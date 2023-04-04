
import axios from "axios";
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl = "https://bogha.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-10-02T08:38:05Z&st=2022-10-02T00:38:05Z&spr=https&sig=ZDO4voICa1urMyD4eyiA%2FQGrnaIiJoYGqmOV8ZrLJWc%3D"
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient("beatstore")

export default async function (req, res) {
    const properties = []
    try {
      for await (const blob of containerClient.listBlobsFlat()) {
        if(blob.name.includes("/properties.json")){
          const res = await axios.get(`https://bogha.blob.core.windows.net/beatstore/${blob.name}`)
          properties.push(res.data)
        }
      }
      
      return res.status(200).json(properties)
    } catch (error) {
      return res.status(401).end(error.message)
      
    }
}