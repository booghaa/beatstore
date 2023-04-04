const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }
    const {name, image} = req.body
    if (!name || !image) {
        res.status(401).end('Missing name/image');
        return;
    }

    const product = await stripe.products.create({name: name, shippable: false, images: [image]});
    console.log(product)
    if(product.id){
        res.status(200).json(product.id)
        return;
    }
    else{
        res.status(401).end('Unable to create stripe product');
    }
}