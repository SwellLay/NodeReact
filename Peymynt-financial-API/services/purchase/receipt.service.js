import { ReceiptModel } from "../../models/purchase/receipt.model";
import { okResponse, errorResponse } from "../../util/HttpResponse";
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND } from "../../util/constant";
import { getS3BucketKey } from "../../util/utils";
const S3 = require('aws-sdk/clients/s3');
const agenda = require('./../../util/scheduler');

agenda.define('checkReceiptStatus', async (job, done) => {
    const { receiptId } = job.attrs.data;
    console.log("Fetching status for receipt : " + receiptId);
    let receipt = await ReceiptModel.findById(receiptId);
    if (!receipt) {
        console.warn("receipt is not found : " + receiptId);
        done();
    }
    if (receipt.status != 'Processing') {
        console.warn("This receipt is not in processing status. Skipping it");
        done();
    }
    fetchReceiptStatus(receipt)
        .then(data => {
            console.log("Data fetched for receipt with status code " + data.status_code);
            // STATUS CODES
            // 1 - pending (receipt on queue/currently processing)
            // 2 - success (image uploaded)
            // 3 - done (results already available)
            // 4 - failed
            let ocrData;
            switch (data.status_code) {
                case 2:
                case 3:
                    ocrData = data.result;
                    receipt.status = "Ready";
                    break;
                case 4:
                    ocrData = data.result;
                    receipt.status = "Failed";
                    break;
            }
            if (receipt.status != 'Processing') {
                // Lets update receipt
                return fillReceiptFromOcr(receipt, ocrData);
            } else {
                console.log("receipt is not ready yet by OCR engine");
            }
        })
        .then(message => {
            console.log("Job has been finished and closed for receipt id " + receiptId);
            console.log("Message from worker : " + message);
            done();
        })
        .catch(e => {
            console.error("Failed to fetch receipt status ", e);
            console.log("Leaving cron as it is for receipt " + receiptId);
        })
});

function getSafeAmount(amount) {
    try {
        let parsedAmount = amount.replace(",", "");
        parsedAmount = parseInt(parsedAmount);
        console.log(`Amount ${amount} has been parsed to ${parsedAmount}`);
        return parsedAmount;
    } catch (e) {
        console.error("Failed to parse amount ", e);
        return 0;
    }
}
const fillReceiptFromOcr = async (receipt, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // If status is ready that means OCR data is available
            if (receipt.status == "Ready") {
                receipt.receiptDate = data.dateISO;
                receipt.totalAmount = getSafeAmount(data.total);
                // TODO update tax
                receipt.amountBreakup = {
                    subTotal: getSafeAmount(data.subTotal),
                    taxes: [],
                    total: data.total
                }
                receipt.address = data.address;
                receipt.discount = getSafeAmount(data.discount);
                receipt.items = data.lineItems;
                receipt.paymentMethod = data.paymentMethod;
                receipt.phoneNumber = data.phoneNumber;
                receipt.url = data.url;
                receipt.merchant = data.establishment;
            }
            receipt.ocr.rawOcrResponse = JSON.stringify(data);
            await receipt.save();
            resolve("receipt updated");
        } catch (e) {
            console.error("Failed to update receipt with OCR data", e);
            reject(e);
        }
    })
}

const fetchReceiptStatus = async (receipt) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.time("tabscannerFetch")
            request.get({
                url: `https://api.tabscanner.com/${process.env.TABSCANNER_API_KEY}/result/${receipt.ocr.token}`,
            }, function (error, response, body) {
                console.timeEnd("tabscannerFetch")
                if (error) {
                    console.log("Error", error);
                    reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, "Something went wrong"));
                } else {
                    console.log("body", body);
                    body = JSON.parse(body);
                    if (body.code == 202) {
                        resolve(body);
                    } else {
                        body.displayMessage = parseTabScannerCode(body.code);
                        reject(body);
                    }
                }
            });
        } catch (e) {
            console.log("Processing failed with error ", e);
            reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, "Something went wrong"));
        }
    });
};

const parseTabScannerCode = (code) => {
    let displayMessage = "Failed to upload receipt to OCR engine";
    switch (code) {
        case 400:
        case 401:
        case 402:
            displayMessage = "OCR engine is not able to accept new request"
            break;
        case 403:
        case 405:
        case 406:
        case 407:
        case 408:
            displayMessage = "Please provide valid file"
            break;
        case 404:
            displayMessage = "Only one file is supported at a time"
            break;
        case 500:
        case 510:
        case 520:
        case 521:
            displayMessage = "OCR engine failed to process file"
            break;
    }
    return displayMessage;
}

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const request = require('request');
var fs = require("fs");
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

var upload = multer({ storage: storage }).single('receipt')

// Save to temp directory
// Return file path for processing it
// Status should be draft
const preProcessFile = async (req, res, receiptInput) => {
    return new Promise(async (resolve, reject) => {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log("A Multer error occurred when uploading.");
                console.error(err);
                reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, err, "failed"));
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log("An unknown error occurred when uploading.");
                console.error(err);
                reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, err, "failed"))
            }
            // Everything went fine.
            console.log("All well. Ready to upload for processing");
            receiptInput.file = req.file;
            // const uploadResponse = await processReceipt(receiptInput);
            // console.log("uploadResponse ", uploadResponse);
            resolve(receiptInput);
        })
    })
};

// Pass file to OCR engine
const processFile = async (receiptInput) => {
    console.log("Uploading file : ", receiptInput.file);
    return new Promise(async (resolve, reject) => {
        try {
            console.time("tabscanner")
            request.post({
                url: `https://api.tabscanner.com/${process.env.TABSCANNER_API_KEY}/process`,
                formData: {
                    file: fs.createReadStream(`${receiptInput.file.path}`),
                    'decimalPlaces': 2,
                    'documentType': 'auto',
                    'defaultDateParsing': 'm/d',
                    'lineExtract': JSON.stringify(true),
                },
            }, function (error, response, body) {
                console.timeEnd("tabscanner")
                if (error) {
                    console.log("Error", error);
                    reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, "Something went wrong"));
                } else {
                    console.log("body", body);
                    body = JSON.parse(body);
                    if (body.code == 200 || body.code == 300) {
                        resolve(body);
                    } else {
                        body.displayMessage = parseTabScannerCode(body.code);
                        reject(body);
                    }
                }
            });
        } catch (e) {
            console.log("Processing failed with error ", e);
            reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, "Something went wrong"));
        }
    });
};

// Upload file to s3
// Delete temp file
// Update receipt with progress status and file url
// Schedule cron
const postProcessFile = async (businessId, receiptInput) => {
    return new Promise((resolve, reject) => {
        const filePath = receiptInput.file.path;
        const fileName = receiptInput.file.filename;
        const fileType = receiptInput.file.mimetype;
        let data = {
            s3Update: false,
            fileUrl: '',
            tempDeleted: false,
            cronScheduled: false
        };
        uploadToS3(businessId, filePath, fileName, fileType)
            .then(fileUrl => {
                data.s3Update = true;
                data.fileUrl = fileUrl;
                console.log("Deleting " + filePath);
                fs.unlinkSync(filePath);
                data.tempDeleted = true;
                resolve(data);
            })
            .catch(e => {
                console.log("Error on post processing", e);
                reject(e);
            })
    })
};

const uploadToS3 = async (businessId, filePath, fileName, fileType) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error("Failed to read file " + filePath, err);
                reject(err);
            }
            const params = {
                Bucket: process.env.S3_BUCKET, // pass your bucket name
                Key: `${getS3BucketKey(businessId, 'receipt', fileName)}`, // file will be saved as testBucket/contacts.csv
                ContentType: fileType,
                Body: data
            };
            s3.upload(params, function (s3Err, data) {
                if (s3Err) {
                    console.error("S3 file uploading error ", s3Err);
                    reject(s3Err);
                }
                console.log(`File uploaded successfully at ${data.Location}`)
                let fileUrl = data.Location;
                resolve(fileUrl);
            });
        });
    })
}

export const uploadReceipt = async (req, res, receiptInput) => {
    const { businessId } = req;
    console.log("uploading reciept to ", businessId);
    return new Promise(async (resolve, reject) => {
        try {
            preProcessFile(req, res, receiptInput)
                .then(data => {
                    receiptInput = data;
                    return processFile(receiptInput);
                })
                .then(data => {
                    console.log("OCR engine queue response : ", data);
                    receiptInput.ocr = {
                        rawQueueResponse: JSON.stringify(data),
                        token: data.token,
                    };
                    receiptInput.status = "Processing";
                    return postProcessFile(businessId, receiptInput);
                })
                .then(async data => {
                    console.log("Post processing response : ", data);
                    // Sample response structure
                    // {
                    //     s3Update: true,
                    //     fileUrl: 'https://peymynt-dev.s3.ap-south-1.amazonaws.com/receipt/OD115858342684835000.pdf',
                    //     tempDeleted: true,
                    //     cronScheduled: true
                    // }
                    receiptInput.fileUrl = data.fileUrl;
                    // console.log('Ready to create receipt ', receiptInput);
                    let receipt = new ReceiptModel(receiptInput);
                    receipt = await receipt.save();

                    console.log("Scheduling job");
                    (async function () {
                        await agenda.start();
                        await agenda.schedule('in 30 seconds', 'checkReceiptStatus', { receiptId: receipt._id });
                    })();

                    resolve(okResponse(HTTP_OK, { receipt: receipt.toUserJson() }, "File queued for processing"));
                })
                .catch(e => {
                    resolve(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, e.displayMessage || e.message || e));
                })
        } catch (e) {
            reject(errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, "failed"))
        }
    })
};

export const addReceipt = async (receiptInput) => {
    let receipt = new ReceiptModel(receiptInput);
    try {
        receipt = await receipt.save();
        return okResponse(HTTP_CREATED, { receipt: receipt.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchReceipts = async (businessId, filter) => {
    console.log("--------get receipts services--------->", businessId);
    let { startDate, endDate, status } = filter;
    try {
        let query = ReceiptModel.find({
            isActive: true,
            isDeleted: false,
            businessId
        })
        if (startDate) {
            query.where("receiptDate").gte(startDate);
        }
        if (endDate) {
            query.where("receiptDate").lte(endDate);
        }

        if (status) {
            query.where("status").equals(status);
        }
        query.sort({ createdAt: -1 })
        let receipts = await query.exec();
        return okResponse(HTTP_OK, { receipts: receipts.map(v => v.toUserJson()) }, "success");
    } catch (error) {
        console.log("====================================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchReceiptById = async id => {
    try {
        let receipt = await ReceiptModel.findOne({ _id: id, isActive: true, isDeleted: false });
        if (!receipt) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        return okResponse(HTTP_OK, { receipt: receipt.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateReceipt = async (id, receiptInput, businessId) => {
    try {
        let receipt = await ReceiptModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!receipt) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }

        receiptInput.status = "Done";
        await receipt.updateOne(receiptInput);
        receipt = await ReceiptModel.findById(id);
        return okResponse(HTTP_OK, { receipt: receipt.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const patchReceipt = async (id, receiptInput, businessId) => {
    try {
        let receipt = await ReceiptModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!receipt) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }

        await receipt.updateOne(receiptInput);
        receipt = await ReceiptModel.findById(id);
        return okResponse(HTTP_OK, { receipt: receipt.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const deleteReceipt = async (id, businessId) => {
    try {
        let receipt = await ReceiptModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!receipt) {
            return errorResponse(HTTP_NOT_FOUND, true, ERROR_NOT_FOUND);
        }
        await receipt.updateOne({ isDeleted: true, isActive: false });

        return okResponse(HTTP_OK, { deleteReceipt: true }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const moveReceipt = async (receiptId, oldBusinessId, newBusinessId) => {
    try {
        let receipt = await ReceiptModel.findOne({ _id: receiptId, isActive: true, isDeleted: false, businessId: oldBusinessId });
        if (!receipt) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }
        if (receipt.status == 'Done') {
            return errorResponse(HTTP_NOT_FOUND, NULL, "This receipt can't be moved as it has been processed to accounting already");
        }
        if (receipt.status != 'Ready') {
            return errorResponse(HTTP_NOT_FOUND, NULL, "This receipt is not ready yet to move. Please wait for sometime");
        }
        receipt.businessId = newBusinessId;
        await receipt.save();
        return okResponse(HTTP_OK, { receipt: receipt.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};