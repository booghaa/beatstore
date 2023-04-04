import { CardElement, useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js"
import { Button, Text } from "@geist-ui/core"
import React, { useState } from 'react'
import { useCart } from './CartProvider';
export default function PaymentForm() {
  const { cartItems, removeItem, cartValue } = useCart()
  const [success, setSuccess ] = useState(false)

  const stripe = useStripe()
  const elements = useElements()
  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "#fce883" },
        "::placeholder": { color: "#87bbfd" }
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee"
      }
    }
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(PaymentElement)
      })


  if(!error) {
      try {
          const {id} = paymentMethod
          const res = await fetch("/api/payment", {
            method: 'POST',
            body: JSON.stringify({cartItems, id})
          })
          const data = await res.json()
          if(data.success) {
              console.log("Successful payment")
              setSuccess(true)
          }

      } catch (error) {
          console.log("Error", error)
      }
  } else {
      console.log(error.message)
  }
}

  return (
      !success ? 
    
        <form>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <CardElement/>
              <Button ghost type='secondary' onClick={()=>handleSubmit()}>PAY ${cartValue}</Button>
          </div>
        </form>
      :
     <div>
         <Text h2>THANKS FOR THE MONEY LOL</Text>
     </div> 
      
          
   
  )
}