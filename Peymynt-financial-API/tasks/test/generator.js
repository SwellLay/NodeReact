var PDFEngine = require('../pdfEngine');

// Read me
// https://github.com/checkly/puppeteer-examples
// https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial
// https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
async function execute() {
    const headless = true;
    const pdfType = 'invoice.modern';
    let data
    switch (pdfType) {
        case 'invoice.contemporary':
        case 'invoice.modern':
        case 'invoice.classic':
            {
                data = require("./../data/invoice.data.json");
                break;
            }
        case 'estimate.contemporary':
        case 'estimate.modern':
        case 'estimate.classic':
            {
                data = require("./../data/estimate.data.json");
                break;
            }
        default: {
            console.log("Cannot process this pdf type ", pdfType);
            return;
        }
    }
    await PDFEngine.exportPdf(data, pdfType, headless, true, true)

}
execute();