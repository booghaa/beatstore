const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = "https://bogha.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-10-02T08:38:05Z&st=2022-10-02T00:38:05Z&spr=https&sig=ZDO4voICa1urMyD4eyiA%2FQGrnaIiJoYGqmOV8ZrLJWc%3D"
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient("beatstore")

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



