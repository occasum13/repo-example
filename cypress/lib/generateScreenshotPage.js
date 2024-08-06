const fs = require('fs');
const path = require('path');

const filePath = path.resolve('./output', 'screenshotsInBase64.txt');

function generateHtmlPage() {
    // Read the content of the .txt file
    let fileContent = '';
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
        return;
    }

    // Split the content by commas to get an array of base64 strings
    const base64Images = fileContent.split(',').map(base64 => base64.trim());

    // Generate HTML content to display base64 images in a carousel
    let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Base64 Images Carousel</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    margin: 0;
                    font-family: Inter, sans-serif;
                }

                h1{
                    font-size: 28px;
                }

                .container {
                    width: 90%;
                    max-width: 1200px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .carousel-container {
                    width: 90%;
                    margin: 0 auto;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                }
                .carousel-item img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }

                .carousel-control-prev-icon, .carousel-control-next-icon {
                    color: black;
                    transform: scale(2)
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Cypress Screenshots</h1>
                </div>
                <div id="carouselExampleIndicators" class="carousel slide carousel-container" data-ride="carousel">
                    <ol class="carousel-indicators">
    `;

    // Add indicators for each image
    base64Images.forEach((_, index) => {
        htmlContent += `<li data-target="#carouselExampleIndicators" data-slide-to="${index}"${index === 0 ? ' class="active"' : ''}></li>`;
    });

    htmlContent += `
                    </ol>
                    <div class="carousel-inner">
    `;

    // Add carousel items for each image
    base64Images.forEach((base64, index) => {
        if (base64) { // Ensure the base64 string is not empty
            htmlContent += `
                        <div class="carousel-item${index === 0 ? ' active' : ''}">
                            <img src="data:image/png;base64,${base64}" class="d-block w-100" alt="Base64 Image ${index + 1}">
                        </div>
            `;
        }
    });

    htmlContent += `
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>

            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        </body>
        </html>
    `;

    // Write the generated HTML content to a new file
    const outputFilePath = path.resolve('output', 'screenshotsPage.html');
    fs.writeFileSync(outputFilePath, htmlContent);

    console.log(`HTML page generated successfully: ${outputFilePath}`);
}

generateHtmlPage();
