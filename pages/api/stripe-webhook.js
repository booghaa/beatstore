import { buffer } from "micro";
import { connectToDatabase } from "../../util/mongodb";
import Cookies from 'js-cookie'
import { nanoid } from 'nanoid'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import axios from "axios";
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;
const nodemailer = require("nodemailer");
export const config = {
    api: {
        bodyParser: false,
    },
}


const handler = async (req, res) => {
    if (req.method === "POST") {
        const buf = await buffer(req);
        const sig = req.headers["stripe-signature"];
        let stripeEvent;
        try {
            stripeEvent = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
            
        } catch (err) {
            console.log(err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        if ( 'checkout.session.completed' === stripeEvent.type ) {
            const session = await stripe.checkout.sessions.retrieve(stripeEvent.data.object.id);
            const { db, client } = await connectToDatabase()
            const auth = db.collection('auth');
            const date = new Date().toLocaleString('en-us',{month:'short', day:'numeric', year:'numeric'})
            const updated = await auth.updateOne({ username: session.metadata.username }, {$set: {cart: []} , $push: {orders: {sessionId: session.id, amount: session.amount_total, date: date, id: nanoid()}}})
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user:"boghabeats@gmail.com",
                    pass: "oaabqptwvonphkqt"
                }
            });
            transporter.sendMail(
                {
                    from: `"bogha" <boghabeats@gmail.com>`,
                    to:  session.customer_details.email,
                    subject: `here are your files ${session.customer_details.name}!`,
                    html: `
                    <head>
                        <style>
                            h1 {text-align: center;}
                            p {text-align: center;}
                        </style>
                    </head>
                    <body>
                    <h1>Link to Order</h1>
                    </body>`
                },
                (error, info) => {
                    console.log(
                        `Attempted to send email`
                    );
                    if (error) {
                        console.error('Error sending email');
                        console.error(error);
                    } else {
                        console.info('email sent: ' + info);
                    }
                }
            );
        } 
        res.json({ received: true });
       
    }
    else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}


export default handler