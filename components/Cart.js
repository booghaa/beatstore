
import { Modal , Text, Button, useToasts} from '@geist-ui/core'
import { X } from '@geist-ui/icons';
import React from 'react'
import Cookies from 'js-cookie'
import { useCart } from './CartProvider';

export default function Cart({visibility, toggleVisibility, toggleAuthModal, isAuthenticated}) {
    const { cartItems, removeItem } = useCart()
    const { setToast } = useToasts()
    const checkout =  async() => {
        if(!isAuthenticated){ 
            setToast({ text: "Create an account or log in to checkout", type: "warning" })
            toggleAuthModal()
            return
        }
        const res = await fetch('/api/payment-redirect', {
            method: 'POST',
            body: JSON.stringify({cartItems, username: localStorage.getItem('user')})
        })
        const data = await res.json()
        window.location.replace(data.url);
    }
    return (
    <Modal padding={0} paddingBottom={1} visible={visibility} onClose={toggleVisibility}>
        <Modal.Content>
            <Text type='warning' h2>your cart ({cartItems.length}):</Text>
            {
                cartItems.length > 0 &&
                cartItems.map((beat, idx) =>  
                    
                    <div key={idx} style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "0 0.5rem"}}>
                            <img style={{height: 50, width: 50}} src={beat[0].imageSrc}/>
                            <div>
                                <Text h4 margin={0}>{beat[0].title}</Text>
                                <Text h6 type='secondary' margin={0}>{beat[0].trackType}</Text>
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
            {
                cartItems.length > 0 && 
                <div style={{alignItems: "center", display: "flex", flexDirection:"column", justifyContent:"center"}}>
                    <Button ghost type='secondary' onClick={()=>{checkout()}} auto>CHECKOUT</Button>
                </div>
                
            }
           
            
            
        </Modal.Content>
    </Modal>
    )
}
