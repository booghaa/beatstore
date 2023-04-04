

import { connectToDatabase } from "../../util/mongodb";
export default async function handler(req, res) {
    if(typeof req.body === 'string'){
        req.body = JSON.parse(req.body)
    }
    const { username } = req.body
    console.log("api", username)
   
    const { db, client } = await connectToDatabase()
    const auth = db.collection('auth');
    
    
    const data = await auth.findOne({ username });
   
    if(!data){
        res.status(400).end("Unable to get files")
        return
    }
    res.status(200).json(data.orders)
}
  