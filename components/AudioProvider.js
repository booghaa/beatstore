import React, { useContext, createContext, useState , useEffect, useRef} from 'react';

const AudioContext = createContext();
export const useAudio = () => useContext(AudioContext);
const AudioProvider = ({children, beats}) => {
  const [playing, setPlaying] = useState(false);
  const[index, setIndex] = useState(-1)
  const [duration, setDuration] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [src,setSrc] = useState(null)
  const [position, setPosition] = useState(0)
  const[volume, setVolume] = useState(100)
  const audioRef = useRef()
  
  const changeTrack = (idx) => {
    const audio = audioRef.current;
		audio.pause()
		audio.currentTime = 0;
    setPosition(0)
		audio.setAttribute('src', beats[idx].mp3Src)
		audio.play()   
		setPlaying(true)
		setIndex(idx)
	}

  const volumeSet = (i) => {
    setVolume(i)
    audioRef.current.volume = i/100
  }

  const getCurrDuration = (e) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime
    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  
  

  return (
    <AudioContext.Provider value={{
      playing, setPlaying, 
      index, setIndex, 
        audioRef, duration, percentage, currentTime,
      volume, volumeSet, setPercentage, src, setSrc, changeTrack, setPosition, position
  
    }}>
        <audio
            ref={audioRef}
            onTimeUpdate={getCurrDuration}
            onLoadedData={(e) => {
                setDuration(e.currentTarget.duration.toFixed(2))
            }}
        ></audio>
      {children}
    </AudioContext.Provider>
  )
}
export default AudioProvider;