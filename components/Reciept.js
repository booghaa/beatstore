import React, { useEffect , useState } from 'react'
import { Modal , Text , Card, Loading, Button , useToasts } from '@geist-ui/core'
import { Download } from '@geist-ui/icons'
import { downloadFromAzure } from '../util/azureblob'
export default function Reciept({id, visibility, toggleVisibility, date}) {
    const [items, setItems] = useState(null)
    const [customer, setCustomer] = useState(null)
    const[total, setTotal] = useState(null)
    const[loading, setLoading] = useState(true)

    const { setToast } = useToasts()
    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }
    const download  = async (blobUrl, type) => {
        const location = blobUrl.substring(46)
        await fetch('/api/download-file', {
            method: "POST",
            body: JSON.stringify({location}),
        })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(
            new Blob([blob]),
          );
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            location.substring(getPosition(location, '/', 2)+1)
          );
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        });
    }

    useEffect(() => {
        const getSession = async() => {
            if(visibility){
                const res = await fetch('/api/get-checkout-session', {
                    method: "POST",
                    body: JSON.stringify({id})
                })
                const data = await res.json()
                console.log(data)
                setItems(JSON.parse(data.session.metadata.checkout_items))
                setCustomer(data.session.customer_details)
                setTotal(data.session.amount_total/100)
                setLoading(false)

            }
            return
        }
        getSession()
    }, [visibility])

    return (
        
        <Modal w={2} padding={0} visible={visibility} onClose={toggleVisibility}>
            {!loading ? 
            <Modal.Content>
                <Text type='warning' h2>receipt</Text>
                <Card mb={1}>
                    <Text h3>items</Text>
                    {items.map((beat, idx) =>  
                    <div key={idx} style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "0 0.5rem"}}>
                            <Text b>#{idx+1}</Text>
                            <img style={{height: 50, width: 50}} src={beat.image}/>
                            <div>
                                <Text h4 margin={0}>{beat.title}</Text>
                                <Text h6 type='secondary' margin={0}>{beat.description + "  : $" + beat.price}</Text>
                            </div>
                        </div>
                       <div style={{display: "flex", }}>
                           
                            {/* <Button icon={<Download/>} mr={0.5} auto>LICENSE</Button> */}
                            {beat.wavSrc && <Button onClick={() => download(beat.wavSrc)} icon={<Download/>} mr={0.5} auto>WAV</Button>}
                            <Button onClick={() => download(beat.wavSrc, "mp3")} icon={<Download/>} mr={0.5} auto>MP3</Button>
                            {beat.stemsSrc && <Button onClick={() => download(beat.stemsSrc)} icon={<Download/>}  auto>STEMS</Button>}
                       </div>
                    </div>
                )}
                </Card>
                <Card>
                    <Text h3>customer + order info</Text>
                    <div style={{display: "flex", alignItems:"center", justifyContent:"space-between"}}>
                        <div>
                            <Text h5>name</Text>
                            <Text h5>{customer.name}</Text>
                        </div>
                        <div>
                            <Text h5>email</Text>
                            <Text h5>{customer.email}</Text>
                        </div>
                        <div>
                            <Text h5>date</Text>
                            <Text h5>{date}</Text>
                        </div>
                        <div>
                            <Text h5>total</Text>
                            <Text h5>${total}</Text>
                        </div>
                    </div>
                  
                </Card>
                
            </Modal.Content>
            : <Loading/>}
            
        </Modal>
    )
}
