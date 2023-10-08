
import axios from "axios";
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_SAS_TOKEN}`;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME)

export default async function (req, res) {
    
    const properties = []
    try {
      for await (const blob of containerClient.listBlobsFlat()) {
        if(blob.name.includes("/properties.json")){
          const res = await axios.get(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/beatstore/${blob.name}`)
          properties.push(res.data)
        }
      }
      
      return res.status(200).json(properties)
    } catch (error) {
      return res.status(401).end(error.message)
      
    }
}