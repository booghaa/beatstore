
import React, { useContext, createContext, useState , useEffect} from 'react';
import { useToasts } from '@geist-ui/core';
import Cookies from 'js-cookie'
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
const CartProvider = ({children, isAuthenticated}) => {
    const [cartItems, setCartItems] = useState([])
    const [cartValue, setCartValue] = useState(0)
    const {setToast} = useToasts()
    // useEffect(() => {
        
    // }, [])
    useEffect(() => {
        if(isAuthenticated){
            const getCart = async ()=> {
              const res = await fetch('/api/cart', {method: "POST", body: JSON.stringify({user: localStorage.getItem('user')})})
              const data = await res.json()
              setCartItems(data)
              setCartValue(getCartValue(data))
            }
            getCart()
        }
        if(!isAuthenticated){
            console.log("second useeffect")
            const localCart = window.localStorage.getItem('cartItems')
            if(localCart){
                const jsoned = JSON.parse(localCart)
                setCartItems(jsoned)
                setCartValue(getCartValue(jsoned))
            }
            else{
                setCartItems([])
                setCartValue(0)
            }
        }
    }, [isAuthenticated])
    const onAuthChange = (i) => { 
        setCartItems(i)
    }
    const removeItem = async(i) => {
        setCartValue(cartValue-i[1].price)
        const newItems = cartItems.filter(item => item[0].id != i[0].id)
        
        if(!isAuthenticated){
            window.localStorage.setItem('cartItems', JSON.stringify(newItems))
        }
        if(isAuthenticated){
            await fetch('/api/cart', {method: "POST", body: JSON.stringify({user: localStorage.getItem('user'), items: newItems})})
        }
        setCartItems(newItems)
    }
    const addToCart = async(i) => { 
        let items = [...cartItems]
        if(items.length > 0){
           for(const item of items) {
                if(item[0].id === i[0].id && item[1].price === i[1].price ){
                    setToast({text: "Already added!", type: "error"})
                    return 
                }
                if(i[0].id === item[0].id){
                    item[1] = i[1]
                    if(isAuthenticated){
                        await fetch('/api/cart', {method: "POST", body: JSON.stringify({user: localStorage.getItem('user'), items})})
                    }
                    setCartItems(items)
                    setCartValue(getCartValue(items))
                    setToast({text: "Changed lease type!", type: "success"})
                    if(!isAuthenticated){
                        window.localStorage.setItem('cartItems', JSON.stringify(items))
                    }   
                    return 
                }
            }
        }
        setCartItems([...cartItems,i])
        setCartValue(cartValue+i[1].price)
        if(isAuthenticated){
            await fetch('/api/cart', {method: "POST", body: JSON.stringify({user: localStorage.getItem('user'), items: [...cartItems,i] })})
        }
        if(!isAuthenticated){
            window.localStorage.setItem('cartItems', JSON.stringify([...cartItems,i]))
        }
        setToast({text: "Added!", type: "success"})
    }
    const getCartValue = (items) => {
        let price = 0;
        items.forEach(i => price += i[1].price)
        return price
    }

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, cartValue, removeItem, onAuthChange
        }}>
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider;