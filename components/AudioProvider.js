import React, { useContext, createContext, useState , useEffect} from 'react';

const AudioContext = createContext();
export const useAudio = () => useContext(AudioContext);
const AudioProvider = ({children}) => {
  const [playing, setPlaying] = useState(false);
  const[index, setIndex] = useState(-1)
  const[audio, setAudio] = useState(null)
  const[volume, setVolume] = useState(100)
  const playingSet = (bool) => { 
    setPlaying(bool)
  }
  const indexSet = (idx) => {
    setIndex(idx)
  }
  const audioSet = (i) => { 
    setAudio(i)
  }
  const volumeSet = (i) => {
    setVolume(i)
    audio.volume = i/100
  }

  
  useEffect(() => {
		
		setAudio(new Audio())
		
	}, [])
  

  return (
    <AudioContext.Provider value={{
      playing, playingSet, 
      index, indexSet, 

      audioSet, audio, 
      volume, volumeSet,
  
    }}>
      {children}
    </AudioContext.Provider>
  )
}
export default AudioProvider;