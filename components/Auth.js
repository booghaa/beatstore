import { Text, Card, ButtonGroup, Button, Spacer, Input, Divider, Modal } from "@geist-ui/core";
import { useState } from "react";
import { useToasts } from "@geist-ui/core";
import Cookies from 'js-cookie'
import { useCart } from "./CartProvider";



export default function Auth ({visibility, toggleVisibility, onAuthFinished}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [isSigningUp, setIsSigningUp] = useState(false)
    const { setToast } = useToasts()
    const {onAuthChange} = useCart()
    
    
    const onSignIn = async () => {
        setIsAuthenticating(true)
        const localCart = localStorage.getItem('cartItems') 
        let cart;
        if(localCart){
            cart = JSON.parse(localCart)
        }
        else{
            cart = []
        }
        const res = await fetch('/api/signin', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
                cart
            })
        })
        if (res.status !== 200) {
            setToast({
                text: await res.text(),
                type: "error"
            })
            setIsAuthenticating(false)
            return
        }
        const data = await res.json()
        Cookies.set('authorization', data.token, { expires: 1 })
        localStorage.setItem('cartItems', '')
        setIsAuthenticating(false)
        setToast({ text: "Signed In!", type: "success" })
        onAuthFinished(username)
        toggleVisibility()
    }

    const onSignUp = async () => {
        setIsSigningUp(true)
        const res = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            })
        })
        if (res.status == 200) {
            setToast({ text: "Signed Up!", type: "success" })
            onSignIn()
        }
        else {
            setToast({ text: await res.text(), type: "error" })
        }
        setIsSigningUp(false)
    }
    return (
        <Modal visible={visibility} onClose={toggleVisibility}>
            <div className="auth-container">
                <Text h3 style={{ width: '100%', textAlign: 'center' }}>authenticate</Text>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 80, marginBottom: 20 }}>
                    <Input
                        placeholder="username"
                        width='100%'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input.Password
                        placeholder="password"
                        width='100%'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: 'center' }}>
                    <Button
                        width='100px'
                        type="success"
                        loading={isAuthenticating}
                        onClick={()=> onSignIn()}
                    >
                        Sign In
                    </Button>
                    <Spacer w={0.5} />
                    <Button
                        width='100px'
                        type="warning"
                        loading={isSigningUp}
                        onClick={()=> onSignUp()}
                    >
                        sign Up
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

