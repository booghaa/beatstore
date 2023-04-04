import { Button, Text } from '@geist-ui/core'
import { ShoppingCart } from '@geist-ui/icons'
import LeasingOptions from './LeasingOptions'
import { useState } from 'react'
import React from 'react'


export default function AddToCart({scale, beat, index}) {
    const toggleLeasingModal = (idx) => { 
        setIsLeasingModalVisible(!isLeasingModalVisible)
    }
    const [isLeasingModalVisible, setIsLeasingModalVisible] = useState(false)
    return (
        <>
            <LeasingOptions beat={beat} visibility={isLeasingModalVisible} toggleVisibility={()=>setIsLeasingModalVisible(!isLeasingModalVisible)}/>
            <Button onClick={()=>toggleLeasingModal(index)} ghost scale={scale} margin={0} type='secondary' icon={<ShoppingCart />} auto><Text h5>$39.99</Text></Button>
        </>
    )
}
