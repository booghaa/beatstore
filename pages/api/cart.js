import { connectToDatabase } from "../../util/mongodb";
export default async function handler(req, res) {

    if(typeof req.body === 'string'){
        req.body = JSON.parse(req.body)
    }
    const { user, items } = req.body
    try {
        const { db, client } = await connectToDatabase()
        const auth = db.collection('auth');
        let data;
        if(items){
            data = await auth.updateOne({username: user}, {$set: {cart: items} })
        }
        else{
            data = await auth.findOne({ username: user});
        }
        if(!data){
            res.status(400).end("Unable to get cart items")
            return
        }
        res.status(200).json(data.cart)
    } 
    catch (error) {
        res.status(400).end(error.message)
    }
   
    
}
  