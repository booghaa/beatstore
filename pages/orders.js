import React, {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Text, Loading, Divider } from '@geist-ui/core'
import Reciept from '../components/Reciept'
export default function orders({isAuthenticated}) {
  const router = useRouter()
  const [ loading, setLoading ] = useState(true)
  const [orders, setOrders] = useState(null)
  const [isRecieptModalVisible, setIsRecieptModalVisible] = useState(false)
  const [ id , setId] = useState("")
  const [date, setDate] = useState("")

  const toggleRecieptModal = () => { 
    setIsRecieptModalVisible(!isRecieptModalVisible)
  }
  useEffect(() => {

    const getOrders = async() => {
      console.log("getOrders", localStorage.getItem('user'))
      const res = await fetch('/api/get-orders', {method: "POST", body: JSON.stringify({username: localStorage.getItem('user')})})
      const data = await res.json()
      setOrders(data)
      console.log(data)
      setLoading(false)
    }
    console.log(isAuthenticated)
    if(isAuthenticated){
      getOrders()
    
    }
    
    // onClick={() => router.push(`/orders/${order.sessionId}`)}
	}, [isAuthenticated])
  if(!isAuthenticated){
    return (
      <Text h3 i>sign in to view your orders!</Text>
    )
  }
  return (
    <div className='content-container'>
      <Reciept date={date} id={id} visibility={isRecieptModalVisible} toggleVisibility={toggleRecieptModal}/>
      {
        !loading ? 
          (orders.length > 0 ? 
            <div>
              <div className='order-prop-headers'>
                <Text type='secondary' h4 margin={0}>id</Text>
                <Text type='secondary' h4 margin={0}>amount</Text>
                <Text type='secondary' h4 margin={0}>date</Text>
                <Text type='secondary' h4 margin={0}>seller</Text>
              </div>
              {orders.map(order => 
                  <div style={{cursor: "pointer"}} onClick={() => {toggleRecieptModal(order.sessionId); setId(order.sessionId); setDate(order.date)}} className='order-prop-headers'>
                    <Text h4 margin={0}>{order.id}</Text>
                    <Text h4 margin={0}>${order.amount/100}</Text>
                    <Text h4 margin={0}>{order.date}</Text>
                    <Text h4 margin={0}>bogha</Text>
                  </div>
              )}
            </div>
           
          
            : <div style ={{display: "flex"}}>
                <Text i mr={0.1} h4>no</Text> 
                <Text i h4 span>orders found</Text> 
            </div>) 
        : <Loading/>
      }
    </div>
  )
}
