import { connectToDatabase } from "../../util/mongodb";
export default async function (req, res) {
    const { db, client } = await connectToDatabase();
    const auth = db.collection('auth');
    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }
    const { username, password, cart } = req.body;

    if (!username || !password) {
        res.status(401).end('Missing username or password.');
        return;
    }

    const user = await auth.findOne({ username });

    if (user) {
        res.status(401).end('User already exists. Try logging in or selecting a different username.');
        return;
    }
    if (password.length < 8) {
        res.status(401).end('Password must be at least 8 characters long.');
        return;
    }
    await auth.insertOne({ username, password, orders: [], cart: []});
    res.status(200).end('User created.');
   
}





  
    

  

 
   
    

        