const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_SAS_TOKEN}`;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME)
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
