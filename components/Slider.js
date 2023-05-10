import { set } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { useAudio } from './AudioProvider'
function CustomSlider({ percentage = 0, onChange }) {
  const {playing, setPlaying, index, setIndex, audioRef, duration, currentTime,
    volume, volumeSet, setSrc, position, setPosition
    } = useAudio()
 
  const [marginLeft, setMarginLeft] = useState(0)
  const [progressBarWidth, setProgressBarWidth] = useState(0)
  const rangeRef = useRef()
  const thumbRef = useRef()
  // useEffect(() => { 
  //   if(index != -1){
  //     setPosition(0)
  //     setMarginLeft(0)
  //     setProgressBarWidth(0)
  //   }
   
  // }, [index]);  
  useEffect(() => {
    const rangeWidth = rangeRef.current.getBoundingClientRect().width
    const thumbWidth = thumbRef.current.getBoundingClientRect().width
    const centerThumb = (thumbWidth / 100) * percentage * -1
    const centerProgressBar =
      thumbWidth + (rangeWidth / 100) * percentage - (thumbWidth / 100) * percentage
    setPosition(percentage)
    setMarginLeft(centerThumb)
    setProgressBarWidth(centerProgressBar)
  }, [percentage])
  useEffect(() => {
    if(index != -1){
    
    }
   
  }, [index]);
  return (
    <div className='slider-container'>
      <div
        className='progress-bar-cover'
        style={{
          width: `${position}%`
        }}
      ></div>
      <div
        className='thumb'
        ref={thumbRef}
        style={{
          left: `${position}%`,
          marginLeft: `${marginLeft}px`
        }}
      ></div>
      <input
        type='range'
        value={position}
        ref={rangeRef}
        step='0.01'
        className='range'
        onChange={onChange}
      />
    </div>
  )
}

export default CustomSlider
