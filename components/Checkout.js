import { Modal , Text, Button, Collapse, Card, useTheme} from '@geist-ui/core'
import { X } from '@geist-ui/icons';
import React, {useState} from 'react'
import { useCart } from './CartProvider';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { CardElement, Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe('pk_test_51LNst0FT4oZelIVTw5Q6mxIgJsmNXTeENuPizrzh4rkFCRqx9Evs1llnB6ZvBQ3P4KOEtbnOXVmvbo2T9Gtl9XhP00mqOtyLu6');

export default function Checkout({visibility, toggleVisibility, togglePaymentModal}) {
    const { cartItems, removeItem, cartValue } = useCart()
    const[isPaymentVisible, setIsPaymentVisible] = useState(false)
    const[loading, setLoading] = useState(true)
    const { palette } = useTheme()
    
    
    return (
    <Modal padding={0} paddingBottom={1} visible={visibility} onClose={toggleVisibility}>
        <Modal.Content>
            <Text h2 type='warning'>checkout</Text>
            {
                cartItems.length > 0 &&
                cartItems.map((beat, idx) =>  
                    <div key={idx} style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "0 0.5rem"}}>
                            <img style={{height: 50, width: 50}} src={beat[0].imageSrc}/>
                            <div>
                                <Text h4 margin={0}>{beat[0].title}</Text>
                                <Text h6 type='secondary' margin={0}>{beat[0].trackType} • {beat[1].type} Lease</Text>
                            </div>
                        </div>
                        <div  style={{display: "flex", gap: "0 0.5rem"}}>
                            <Text margin={0} h5>${beat[1].price}</Text>
                            <button onClick={()=> removeItem(beat)}>
                                <X/>
                            </button>
                        </div>
                    </div>
                )
            }
            
            <Collapse mb={1} scale={0.5} title='bulk deals'>
            </Collapse>
            <Card mb={1}>
                <div style={{display: "flex", justifyContent:"space-between"}}>
                    <Text h5>gross</Text>
                    <Text h5>${cartValue}</Text>
                </div>
                <div style={{display: "flex", justifyContent:"space-between"}}>
                    <Text h5>discount</Text>
                    <Text h5>-$0.00</Text>
                </div>
                <Card.Footer padding={0} paddingLeft={0.7} paddingRight={0.7}  style={{display: "flex", justifyContent:"space-between"}}>
                        <h3 style={{color: palette.success}}>total</h3>
                        <h3 style={{color: palette.success}}>${cartValue-0}</h3>
                </Card.Footer>
            </Card>
            <div style={{display: "flex", justifyContent:"center"}}>
                    <Elements stripe={stripePromise}>
                        <CardElement/>
                    </Elements>
                   
            </div>
        </Modal.Content>
    </Modal>
    )
}
