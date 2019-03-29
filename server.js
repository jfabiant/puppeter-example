const puppeteer = require("puppeteer");
const fs = require("fs");
const download = require("download");
const downloadFile = require("download-file");
const axios = require("axios");

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://portal.mtc.gob.pe/reportedgtt/form/frmconsultaplacaitv.aspx"
    );

    // await Promise.all([
    //     page.type('#txtPlaca', 'ABI452'),
    //     await page.type('#txtCaptcha', 'L4cO8K'),
    //     await page.click('#BtnBuscar'),
    //     page.waitForNavigation(), // wait for the page to load
    //     console.log('New Page URL:', page.url()),
    //     data += await page.evaluate(() => document.body.innerHTML),
    //     console.log("Se ejecuto correctamente")
    // ]).catch(e => console.log(e)).then(
    //     console.log(data),
    //     await page.screenshot({
    //         path: './screenshots/image.png'
    //     })
    // )

    await page.type("input[name=txtPlaca]", "ABI452");

    let base64 = await page.evaluate(() =>
      document.getElementById("imgCaptcha").getAttribute("src")
    );

    // await console.log(base64);

    // await console.log("############# CON SPLIT #############");

    let res = base64.split("/jpeg;base64,");

    let base64Original = res[1];

    // await console.log(base64Original);

    // await console.log("############# FIN CON SPLIT #############");

    var options = {
      directory: "./images/"
      // filename: "cat.gif"
    };

    const responseUpload = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA8uGKb7rpUOLxA7R1WvKWOhVvaTFKiM5g`,
      {
        requests: [
          {
            image: {
              content: base64Original
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1
              }
            ]
          }
        ]
      }
    );

    await console.log("############# RESPONSE FROM API LUCHO #############");
    await console.log(responseUpload.data.responses[0]);

    let myCaptcha =
      responseUpload.data.responses[0].textAnnotations[1].description;

    await page.type("input[name=txtCaptcha]", myCaptcha);
    await page.click("a[id=BtnBuscar]");

    await page.screenshot({
      path: "./screenshots/imagen.png"
    });

    let data = await page.evaluate(() => document.body.innerHTML);
    await fs.writeFile("./public/data.html", data, error => {
      if (error) console.log(error);
      else console.log("El archivo fue creado");
    });

    await console.log(data);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
