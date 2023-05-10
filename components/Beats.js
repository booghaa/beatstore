import { Text, User, Divider, Grid, Spacer, Badge, Button, useMediaQuery, Card, Progress, Image, Loading, Modal} from '@geist-ui/core'
import { Share2, ShoppingCart, DownloadCloud } from '@geist-ui/icons'
import { useAudio } from './AudioProvider'
import { useCart } from './CartProvider'
import LeasingOptions from './LeasingOptions'
import { useState } from 'react'
import AddToCart from './AddToCart'

export default function Beats({beats}){
	console.log(beats)
	const {playing, setPlaying, index, audioRef, changeTrack} = useAudio()
    const [isLeasingModalVisible, setIsLeasingModalVisible] = useState(false)
	const upMd = useMediaQuery('md', { match: 'up' })
	const upSm = useMediaQuery('sm', { match: 'up' })
	let gridVal = [
		upMd ? 1.875: 2, 
		upMd ? 7.75: 10, 
		upMd ? 1.875 : 0, 
		upMd ? 1.875 : 0, 
		upMd ? 8 : 0, 
		upMd ? 2.525 : 12
	]
	const handleAudio = (idx) => {
		const audio = audioRef.current;
		if(idx != index){
			changeTrack(idx)
		}
		else if(playing){
			audio.pause()
			setPlaying(false)
		}
		else if(!playing){
			audio.play()
			setPlaying(true)
		}
	}
    return(
		<div>
			{beats.length > 0 ?
				<>
					<Grid.Container margin={0} mb={1} justify="center">
						<Grid xs={gridVal[0] + gridVal[1]}>
							<Text style={{marginLeft: "66px"}} h4 margin={0}>title</Text>
						</Grid>
						<Grid xs={gridVal[2]}><Text h4 margin={0}>key</Text></Grid>
						<Grid xs={gridVal[3]}><Text h4 margin={0}>bpm</Text></Grid>
						<Grid xs={gridVal[4]}><Text h4 margin={0}>tags</Text></Grid>
						<Grid xs={gridVal[5]}></Grid>
					</Grid.Container>
					
					{beats.map((beat, idx) =>
						<Grid.Container margin={0} mb={1} alignItems='center' justify="center">
							<Grid alignItems='center' style={{gap: "0 1rem"}} xs={gridVal[0] + gridVal[1]}>
								<input id='image' type="image" onClick={()=>handleAudio(idx)} src={beats[idx].imageSrc} />
								<a href="https://www.instagram.com/boghabeats/" target="_blank" >
									<div className='txtunder'>
										<Text h3 margin={0}>{beats[idx].title}</Text>
									</div>
								</a>
							</Grid>
							<Grid xs={gridVal[2]}>
								<Text h4 margin={0}>{beats[idx].key}</Text>
							</Grid>
							<Grid xs={gridVal[3]}>
								<Text h4 margin={0}>{beats[idx].bpm}</Text>
							</Grid>

							<Grid xs={gridVal[4]}>
								<div style={{display: "flex", flexWrap:"wrap"}}>
									{beat.tags.map(tag => <Badge scale={0.75} align type='success' mr={1}>#{tag}</Badge> )}
								</div>
							</Grid>
							<Grid direction='row-reverse' xs={gridVal[5]}>
								<AddToCart scale={1} beat={beat} index={index}/>
								<Button margin={0} pt={0} pb={0}  pl={0.5} pr={0.5} mr={1} auto icon={<Share2/>}/>  
								<Button margin={0} pt={0} pb={0}  pl={0.5} pr={0.5} mr={1} auto icon={<DownloadCloud/>}/>  
							</Grid>
						</Grid.Container>
					)}
				</> 
				:   <div style ={{display: "flex"}}>
                        <Text i mr={0.1} h4>no</Text> 
                        <Text i h4 span>beats/samples available</Text> 
                    </div>}
			
		</div> 
		
    )
}	

