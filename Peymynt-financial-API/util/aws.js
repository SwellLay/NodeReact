import AWS from "aws-sdk";
import { getS3BucketKey } from "../util/utils";

// Setting up AWS client credentials
AWS.config.update({
  signatureVersion: "v4",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const S3 = new AWS.S3({ httpOptions: { timeout: 600000 } });

export const generateUrl = async (businessId, s3Input) => {
  const bucketKey = getS3BucketKey(businessId, s3Input.uploadType, s3Input.fileName);
  var params = {
    Bucket: process.env.S3_BUCKET,
    Key: bucketKey,
    Expires: 7200,
    ACL: "public-read",
    "Metadata": { "ContentType": s3Input.contentType }
  };
  const signedUrl = await S3.getSignedUrl("putObject", params);

  return {
    sUrl: signedUrl,
    pUrl: `${process.env.S3_BASE_URL}${bucketKey}`
  };
};

export const deleteSignedUrl = async signedurl => {
  console.log("<----------deleteSignedUrl key----------> >> ", signedurl);
  var mimeUrl = signedurl.split(process.env.S3_BUCKET + "/");
  var params = {
    Bucket: process.env.S3_BUCKET,
    Key: mimeUrl[1]
  };
  const data = await S3.deleteObject(params);
  return data;
};

export const getS3Object = async bucketKey => {
  logger(`=======> invoking getS3Object bucketKey: ${bucketKey} `);
  var params = {
    Bucket: process.env.S3_BUCKET,
    Key: bucketKey
  };

  //const data = await S3.getObject(params);
  let data = await S3.getObject(params).promise();
  return data;
};

export const uploadS3 = async (readStream, key) => {
  console.log(" In upload S3 stream --- key --", key);
  let upload = await S3.upload({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ACL: "public-read",
    ContentDisposition: "attachment",
    Body: readStream
  })
    .promise()
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(error => {
      console.log(error);
      throw new Error(error);
    });

  return upload;
};
