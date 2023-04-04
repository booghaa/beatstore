import {useEffect} from 'react'
import { useRouter } from 'next/router'
import { Text } from '@geist-ui/core'
export default function receipt() {
    const router = useRouter()

    useEffect(() => {
        const getSession = async() => {
            if(router.isReady){
                const res = await fetch('/api/get-checkout-session', {
                    method: "POST",
                    body: JSON.stringify({id: router.query.id})
                })
                const data = await res.json()
            }
            return
        }
        getSession()
    }, [router.isReady])
    
    return (
        <div>
            <Text span h2>order details</Text>

        </div>
    )
}
