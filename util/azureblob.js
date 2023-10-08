import axios from "axios";

const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = "https://bogha.blob.core.windows.net/beatstore?sp=racwd&st=2023-10-08T22:29:54Z&se=2025-04-24T06:29:54Z&spr=https&sv=2022-11-02&sr=c&sig=F0t7k7lTnHwucdanVJ7nTiwZZptKVhlpSIALlFalbHQ%3D"
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



