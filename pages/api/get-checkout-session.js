const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
    if (typeof req.body === 'string') {
      req.body = JSON.parse(req.body);
    }
    const {id} = req.body
    if(!id) { 
        res.status(401).send("No session id provided")
        return
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(id, {expand: ['line_items']});
      res.status(200).json({session});
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
    
  }