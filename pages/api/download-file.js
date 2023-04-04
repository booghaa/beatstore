


// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = "https://bogha.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-10-02T08:38:05Z&st=2022-10-02T00:38:05Z&spr=https&sig=ZDO4voICa1urMyD4eyiA%2FQGrnaIiJoYGqmOV8ZrLJWc%3D"
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient("beatstore")
export default async function handler(req, res) {
    if(typeof req.body === 'string'){
        req.body = JSON.parse(req.body)
    }
    const { location } = req.body 
    if(!location) { 
        res.status(400).end("Must provide location")
        return 
    }
    try {
        const blobClient = containerClient.getBlobClient(location);
        const downloadResponse = await blobClient.download();
        const downloaded = await streamToBuffer(downloadResponse.readableStreamBody);
        res.status(200).end(downloaded, 'binary')
    } catch (error) {
        console.log(error.message)
        res.status(400).end(error.message)
    }
 
}
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}
