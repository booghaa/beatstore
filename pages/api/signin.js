

import { connectToDatabase } from "../../util/mongodb";

export default async function (req, res) {
    const { db, client } = await connectToDatabase()
    const auth = db.collection('auth');
    const tokens = db.collection('tokens');

    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }
    const { username, password, cart } = req.body;
    
    if (!username || !password) {
        res.status(401).end('Missing username or password.');
        return;
    }

    const user = await auth.findOne({ username });
    if (!user) {
        res.status(401).end('User does not exist. Check your username or create an account.');
        return;
    }
    if (user.password !== password) {
        res.status(401).end('Incorrect password.');
        return;
    }

    if(cart.length > 0){
        const updated = await auth.updateOne({username: username}, { $push: { cart: { $each: cart }}})
    }

    // Generate token
    const token = Math.random().toString(36);
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

    // Delete any existing tokens for this user
    await tokens.deleteMany({ username });

    // Insert new token, set expiration, and send to user
    await tokens.insertOne({ token, username, expiration });

    res
        .status(200)
        .setHeader('Set-Cookie', `authorization=${token}; path=/; expires=${expiration.toUTCString()}`)
        .json({ token, expiration,  });
}

