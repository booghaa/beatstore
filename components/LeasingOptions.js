import React from 'react'
import { Modal, Text, useTheme, Spacer, Card, Button, Collapse, Tooltip, useMediaQuery} from '@geist-ui/core'
import { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai';

import { Copy, Mic, ShoppingCart, Volume2, Radio, Video, Speaker} from '@geist-ui/icons';
import { useCart } from './CartProvider';
export default function LeasingOptions({visibility, toggleVisibility, beat}) {
  const { addToCart } = useCart()
  const upMd = useMediaQuery('md', { match: 'up' })
  const [licenses, setLicenses] = useState([])
  const theme = useTheme();
  
  useEffect(() => {
    const licenseArray = []
    beat.wavSrc && licenseArray.push({type: "BASIC MP3", featured: false, price: 40, files: [beat.mp3Src], fileTypes: "mp3", streams: 100000, copies: 2500, musicVid: 1, radio: 0})
    beat.wavSrc && beat.stemsSrc && licenseArray.push({type: "PREMIUM WAV", featured: true, price: 50, files: [beat.wavSrc, beat.mp3Src], fileTypes:"mp3, wav", streams: 300000, copies: 5000, musicVid: 2, radio: 2})
    beat.stemsSrc && beat.wavSrc && licenseArray.push({type: "WAV + TRACKOUTS", featured: false, price: 100, files: [beat.wavSrc, beat.mp3Src, beat.stemsSrc], fileTypes:"mp3, wav, zip", streams: 500000, copies: 10000, musicVid: 2, radio: 2},
    {type: "UNLIMITED", featured: false, price: 200, files: [beat.wavSrc, beat.mp3Src, beat.stemsSrc], fileTypes:"mp3, wav, zip", streams: "unlimited", copies: "unlimited", musicVid: "unlimited", radio: "unlimited"})
    setLicenses(licenseArray)
  }, [beat])

  
  return (

    <Modal w={2} padding={0} visible={visibility} onClose={toggleVisibility}>
        {licenses &&
        <Modal.Content>
            <div>
              <Text type='warning' h2>choose lease</Text>
              <Spacer/>
              <div style={{display: "flex", gap: "0 1rem"}}>
                {upMd &&
                  <div style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <img style={{height: 150, width: 150}} src={beat.imageSrc}/>
                    <Text h4>{beat.title}</Text>
                  </div>
                }
                <div style={{display: "flex", flexDirection: "column"}}>
                  {!upMd &&
                    <div style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
                      <img style={{height: 150, width: 150}} src={beat.imageSrc}/>
                      <Text h4>{beat.title}</Text>
                    </div>
                  }
                  {licenses.map((l,idx) =>
                      <Card key={l.type} mb={1} shadow width="100%">
                        <div style={{display:"flex", justifyContent: "space-between"}}>
                          <div style={{display:"flex", gap: "0 0.5rem", alignItems: "center"}}>
                            <Text margin={0} h3>{l.type}</Text>
                            {l.featured && 
                              <Tooltip text={'featured'}>
                                <AiFillStar size={22} color={theme.palette.warning}/>
                              </Tooltip>
                            }
                          </div>
                          <Button scale={0.75} onClick={()=>{addToCart([beat, licenses[idx]]); toggleVisibility()}} margin={0} type="secondary" icon={<ShoppingCart />} auto><Text h5>${l.price-1}.99</Text></Button>
                        </div>
                        <Text h4 type='success'>{l.fileTypes}</Text>
                        <Collapse scale={0.5} accord title='usage terms'>
                          <div className='usage-terms'>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Mic/>
                              <Text b h5>used for music recording</Text>
                            </div>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Copy/>
                              <Text h5>distribute up to {l.copies} copies</Text>
                            </div>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Volume2/>
                              <Text h5>{l.streams} online audio streams</Text>
                            </div>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Video/>
                              <Text h5> {l.musicVid} music video{l.musicVid == 1 ? "" : "s"}</Text>
                            </div>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Speaker/>
                              <Text h5>for profit live performances</Text>
                            </div>
                            <div style={{display: "flex", gap: "0 0.5rem"}}>
                              <Radio/>
                              <Text h5>radio broadcasting rights ({l.radio} station{l.radio == 1 ? "" : "s"})</Text>
                            </div>
                          </div>
                        </Collapse>
                      </Card>
                  )}
                </div>
             
              </div>
            </div>
        </Modal.Content>}
    </Modal>
    
  )
}
