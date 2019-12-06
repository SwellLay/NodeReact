var ContemporaryTemplateEngine = require('./template/contemporary/index.html');
var ModernTemplateEngine = require('./template/modern/index.html');
const puppeteer = require('puppeteer')
var fs = require('fs');
const path = require('path');

// Read me
// https://github.com/checkly/puppeteer-examples
// https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial
// https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/

let headless = true;
let shouldOutput = false;
let shouldSavePdf = false;

async function operate(header, body, footer, margin, pdfType) {
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.setContent(body, { waitUntil: 'networkidle2' });
    await page.emulateMedia('screen');

    // await page.waitForSelector('div.invoice-preview__body');
    // await page.waitFor(10000);
    let pdf = await page.pdf({
        displayHeaderFooter: true,
        format: 'Letter',
        printBackground: true,
        margin: margin,
        path: shouldSavePdf ? `tasks/test/${pdfType}.test.pdf` : undefined,
        footerTemplate: footer,
        headerTemplate: header
    });
    console.log('PDF generation finished');
    await browser.close();
    return pdf;
}

async function exportPdf(data, pdfType, runHeadless = true, generateHtml = false, savePdf = false) {
    headless = runHeadless;
    shouldOutput = generateHtml;
    shouldSavePdf = savePdf;
    let engineOutput;
    let margin;
    console.log("Generating pdf for ", pdfType);
    switch (pdfType) {
        case 'invoice.contemporary': {
            engineOutput = await ContemporaryTemplateEngine.renderInvoice(data.invoice.businessId, data.invoice, data.salesSetting, data.userInfo, data.payments);
            margin = { top: '8.0cm', right: '0cm', bottom: '1cm', left: '0cm' };
            break;
        }
        case 'estimate.contemporary': {
            engineOutput = await ContemporaryTemplateEngine.renderEstimate(data.estimate.businessId, data.estimate, data.salesSetting, data.userInfo);
            margin = { top: '8.0cm', right: '0cm', bottom: '1cm', left: '0cm' };
            break;
        }
        case 'estimate.modern': {
            margin = { top: '5cm', right: '0cm', bottom: '4.5cm', left: '0cm' };
            engineOutput = await ModernTemplateEngine.renderEstimate(data.estimate.businessId, data.estimate, data.salesSetting, data.userInfo);
            break;
        }
        case 'invoice.modern': {
            margin = { top: '5cm', right: '0cm', bottom: '4.5cm', left: '0cm' };
            engineOutput = await ModernTemplateEngine.renderInvoice(data.invoice.businessId, data.invoice, data.salesSetting, data.userInfo, data.payments);
            break;
        }
        default: {
            console.log("Cannot process this pdf type", pdfType);
            return;
        }
    }
    if (shouldOutput) {
        try {
            console.log("Saving output html");
            saveFile(engineOutput.header, engineOutput.body, engineOutput.footer);
        } catch (e) {
            console.log("Failed to save html", e);
        }
    }
    return await operate(engineOutput.header, engineOutput.body, engineOutput.footer, margin, pdfType);
}

function saveFile(header, body, footer) {
    let outputFile = path.join(__dirname, "test/output.test.html");
    let data = body.replace('<div class="header"></div>', header);
    data = data.replace('<div class="footer"></div>', footer);
    data = data.replace('<div class="time"></div>', new Date());
    fs.writeFile(outputFile, data, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.", outputFile);
    });
    let headerFile = path.join(__dirname, "test/header.test.html");
    fs.writeFile(headerFile, header, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to header File.", headerFile);
    });
}
module.exports = {
    exportPdf: exportPdf
}