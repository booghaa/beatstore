const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_SAS_TOKEN}`;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME)

export default async function handler(req, res) {
    const formData = req.body.formData 
    try {
        const promises = []
        for (const pair of formData.entries()) {
            const blockBlobClient = containerClient.getBlockBlobClient(pair[0])
            promises.push(blockBlobClient.uploadData(pair[1]))
        }
        await Promises.all(promises)
        res.status(200)
      } catch (error) {
        res.status(401)
    }
     
}



