const puppeteer = require("puppeteer");

void(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://portal.mtc.gob.pe/reportedgtt/form/frmconsultaplacaitv.aspx");
        await page.screenshot({
            path: './screenshots/page2.png'
        });
        await page.pdf({
            path: './pdfs/page2.pdf'
        });

        await browser.close();

    } catch (error) {
        console.log(error);
    }
})();