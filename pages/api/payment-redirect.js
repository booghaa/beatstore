const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
import { v4 as uuidv4 } from 'uuid';
export default async function handler(req, res) {
    if (typeof req.body === 'string') {
      req.body = JSON.parse(req.body);
    }
    const {cartItems, username} = req.body
    let items = []
    let checkout_items = []
    for await(const beat of cartItems){
     
      await stripe.products.update(
        beat[0].id,
        {description: beat[0].trackType + " • " +  beat[1].type, images: [beat[0].imageSrc]}
      );
      items.push({
          price_data: {
            currency: "usd",
            product: beat[0].id,
            unit_amount: beat[1].price*100
            
          },
          quantity: 1,
        },
      )
      
      checkout_items.push({
        title: beat[0].title, 
        price: beat[1].price,
        description: beat[0].trackType + " • " +  beat[1].type,  
        stemsSrc: beat[0].stemsSrc, 
        wavSrc: beat[0].wavSrc, 
        image: beat[0].imageSrc
      })
    } 
   
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: `${req.headers.origin}/orders`,
        cancel_url: `${req.headers.origin}`,
        metadata: {checkout_items: JSON.stringify(checkout_items), username: username},
      });
      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
    
  }