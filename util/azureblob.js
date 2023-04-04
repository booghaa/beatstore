import axios from "axios";

// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = "https://bogha.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-10-02T08:38:05Z&st=2022-10-02T00:38:05Z&spr=https&sig=ZDO4voICa1urMyD4eyiA%2FQGrnaIiJoYGqmOV8ZrLJWc%3D"
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient("beatstore")


export async function uploadToAzure(files) {
  try {
    const promises = []
    for(const f of files){
      const blockBlobClient = containerClient.getBlockBlobClient(f.name)
      promises.push(blockBlobClient.uploadData(f.file))
    }
    await Promise.all(promises)
  } catch (error) {
    return error.message
  }
  return 200
}
export async function downloadFromAzure(location) {
  try {
    
    const blobClient = await containerClient.getBlobClient(location);
    const downloadResponse = await blobClient.download(0);
    const blob = await downloadResponse.blobBody
    return blob 
  
  } catch (error) {
    return error.message
  }
 

  
}



