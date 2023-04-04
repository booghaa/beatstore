import React , { useState , useEffect , useRef } from 'react'
import { Text , Spacer , Button, useTheme, Themes, Grid, Card, useMediaQuery} from '@geist-ui/core'
import { useAudio } from './AudioProvider'
import { Play , Pause, SkipBack, SkipForward , Volume2 , Volume1 , Volume , VolumeX, ShoppingCart, Share2 } from '@geist-ui/icons'
import { Slider , SliderTrack , SliderThumb, SliderFilledTrack, Box, theme } from '@chakra-ui/react'
import AddToCart from './AddToCart'
export default function Footer({beats}) {
  const {
    playing, playingSet, 
    index, indexSet, 
     audio,
    volume, volumeSet
    } = useAudio()

 
  const [isOnClick, setIsOnClick] = useState(false)
  const [timeStamp, setTimeStamp] = useState(0)
  const animationRef = useRef(); 
  const theme = useTheme()
  const upMd = useMediaQuery('md', { match: 'up' })
  const upSm = useMediaQuery('sm', { match: 'up' })
  const stop = () =>{
    cancelAnimationFrame(animationRef.current);
  }
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
  
    audio.currentTime = (clickX / width) * duration;
  }
  const onChangeProgress = (val) => { 
    if(isOnClick){
      setTimeStamp(val)
    }
  }
  
  useEffect(() => {
    if(index != -1){
      setTimeStamp(0)
      whilePlaying()
    }
   
  }, [index]);
  const handleAudio = () =>  {
    if(playing){
     
      audio.pause()
      
      playingSet(false)
    }
    else{
      audio.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
      playingSet(true)
    }
  }
  const whilePlaying = () => {
    setTimeStamp((audio.currentTime/audio.duration) * 100)
    const progressPercent = (audio.currentTime/audio.duration) * 100
   
    animationRef.current = requestAnimationFrame(whilePlaying)
  }
  
  const next = () => {
    if(index + 1 === beats.length){
      
      audio.setAttribute('currentTime',0)
      setTimeStamp(0)
      progress.current.value = `0%`

    }
    else{
      indexSet(index+1)
      audio.setAttribute('src', beats[index+1].audioURL)
		  audio.play()
    }
    
		playingSet(true)
  }
  const back = () => { 
    indexSet(index-1)
    audio.setAttribute('src', beats[index-1].audioURL)
		audio.play()
		playingSet(true)
  }
  
  return (
    <div>
      {index != -1 &&
      <div>
        
        <div className='audioTime'>
        
          <Slider focusThumbOnChange={false} defaultValue={0} onChange={(val) => onChangeProgress(val)} min={0} max={100} step={0.05} value={timeStamp} >
            <SliderTrack onClick={()=>stop()} bg='whiteAlpha.300'>
              <Box position='relative' right={10} />
              <SliderFilledTrack  bg='white' />
            </SliderTrack>
            <SliderThumb onClick={()=>stop()} boxSize={2.5} />
          </Slider>
        </div>
        <Grid.Container>
          <Grid xs={upMd ? 11 : 10} style={{display: "flex", alignItems: "center"}}>
            <input id='image' type="image" onClick={()=>handleAudio()} src={beats[index].imageSrc} />
            <Spacer/>
            <div style={{display:"flex", flexDirection: "column", justifyContent: "space-evenly"}}>
              <a href="https://www.instagram.com/boghabeats/" target="_blank" >
                <div className='txtunder'><Text h4 margin={0}>{beats[index].title}</Text></div>
              </a>
              <Text h6 margin={0} type='warning'>bogha</Text>
            </div>
            {upMd &&
              <div style={{display:"flex", flexDirection: "row-reverse", alignItems: "center"}}>
                <AddToCart scale={0.5} beat={beats[index]} index={index}/>
                <Button margin={0} ml={0.5} scale={1.5} mr={0.5} pl={0.2} pr={0.2} auto type='abort' icon={<Share2/>}/> 
              </div>
            }
          </Grid>
          <Grid xs={upMd ? 7 : 6} style={{display: "flex"}}>
            <Button onClick={()=>back()} scale={1.5} pl={0.2} pr={0.2} auto type='abort' icon={<SkipBack color={theme.palette.accents_7}/>}/>  
            
           { upMd && <Spacer/>}
            {playing 
              ? <Button onClick={()=>handleAudio()} scale={1.5} pl={0.2} pr={0.2} auto type='abort' icon={<Pause color={theme.palette.accents_8}/>}/>    
              : <Button onClick={()=>handleAudio()} scale={1.5} pl={0.2} pr={0.2} auto type='abort' icon={<Play color={theme.palette.accents_8}/>}/> 
            }
             {upMd && <Spacer/>}
            <Button onClick={()=>next()} scale={1.5} pl={0.2} pr={0.2} auto type='abort' icon={<SkipForward color={theme.palette.accents_7}/>}/>  
          </Grid>
          <Grid xs={upMd ? 6 : 8} direction="row-reverse" style={{ alignItems:"center", gap: "0 1rem"}}>
            <Slider defaultValue={80} width={upSm ? 100 : 20} min={0} max={100} step={0.05} onChange={(val) => volumeSet(val)}>
              <SliderTrack bg='whiteAlpha.400'>
                <Box position='relative' right={10} />
                <SliderFilledTrack bg='white' />
              </SliderTrack>
              <SliderThumb boxSize={2.5} />
            </Slider>
            {volume == 0 && <VolumeX/>}
            {volume >= 75 && <Volume2/>}
            {(volume < 75 && volume >= 34) && <Volume1/>}
            {(volume < 34 && volume > 0) && <Volume/>}
          </Grid>
        </Grid.Container>
      </div>}
      
      
    </div>
  )
}