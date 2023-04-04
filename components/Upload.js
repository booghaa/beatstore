import React, { useState, useEffect, useRef } from 'react'
import { Text, Button, Spacer, Input, Badge, Dot, Modal, Radio, AutoComplete, useToasts, useTheme, Code, useKeyboard, KeyCode, Loading} from "@geist-ui/core";
import { XCircleFill } from '@geist-ui/icons';
import { uploadToAzure} from '../util/azureblob';




export default function Upload({visibility, toggleVisibility, onUploadFinished}) {
    const[wav, setWav] = useState(null)
    const[mp3, setMp3] = useState(null)
    const[stems, setStems] = useState(null)
    const[schedule, setSchedule] = useState("")
    const [title, setTitle] = useState("")
    const[description, setDescription] = useState(null)
    const[tagged, setTagged] = useState(null)
    const[image, setImage] = useState(null)
    const [majOrMin, setMajOrMin] = useState(null)
    const [key, setKey] = useState(null)
    const [bpm, setBpm] = useState("")
    const [collaborators, setCollaborators] = useState([])
    const [collabInputVal, setCollabInputVal] = useState("")
    const [tags, setTags] = useState([])
    const [tagInputVal, setTagInputVal] = useState("")
    const[imageSrc, setImageSrc] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const[keyOptions, setKeyOptions] = useState(null)
    const { setToast } = useToasts()
    const theme = useTheme()
    const [isTags, setIsTags] = useState(true)
    const [trackType, setTrackType] = useState("")
    const[fileType, setFileType] = useState(null)
    const [isCalendarVisible, setisCalendarVisible] = useState(true)
    const ref = useRef()
    const trackTypeOptions = [
        { label: 'beat', value: 'BEAT' },
        { label: 'sample', value: 'SAMPLE' },
    ]
    useEffect(() => {
        const keys = ["Ab", "A", "A#", "Bb", "Cb", "C#", "Db", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"]
        const options = []
        keys.forEach(key => options.push({label: key, value: key}))
        setKeyOptions(options)
    }, [])
    

    const getRandomImg = async () => {
        await fetch(`https://picsum.photos/500`).then(res=>{{setImageSrc(res.url); console.log(res.url)}})
        setImage(null)
    }
    useEffect(() => {
        if(fileType != null){
            console.log(fileType)
            ref.current.click()
        }
        
    }, [fileType])
    
    const handleTagsEnter = () => {
        if(tags.length === 3){
            setToast({
                text: "Max # of tags is 3",
                type: "error"
            })
            return;
        }
       
        for (let tag of tags) {
            if(tag == tagInputVal){
                setToast({
                    text: "Already added",
                    type: "error"
                })
                return
            }
        }
        
        setTags([tagInputVal, ...tags])
        setTagInputVal("")
    }
    const handleCollabEnter = () => { 
        for (let c of collaborators) {
            if(c === collabInputVal){
                setToast({
                    text: "Already added",
                    type: "error"
                })
                return
            }
        }
        setCollaborators([collabInputVal, ...collaborators])
        setCollabInputVal("")
    }
    const { bindings } = useKeyboard(
        (s) => 
           {isTags ? handleTagsEnter() : handleCollabEnter()}, 
        [KeyCode.Enter],
        { disableGlobalEvent: true },
    )
    const onUpload = async () => {

        setIsUploading(true)
        const res = await fetch('/api/create-product', {
            method: 'POST',
            body: JSON.stringify({name: title, image: imageSrc})
        })
        const productId = await res.json()
        const wavName = wav && `${title}/wav/${wav.name}`
        const mp3Name = mp3 && `${title}/wav/${mp3.name}`
        const taggedName = tagged && `${title}/tagged/${tagged.name}`
        const stemsName = stems && `${title}/stems/${stems.name}`
        const mp3Src = `https://bogha.blob.core.windows.net/beatstore/${mp3Name}`
        const stemsSrc = `https://bogha.blob.core.windows.net/beatstore/${stemsName}`
        const taggedSrc = tagged ? `https://bogha.blob.core.windows.net/beatstore/${taggedName}` : null
        const wavSrc = `https://bogha.blob.core.windows.net/beatstore/${wavName}`
        const propertiesName = `${title}/properties.json`

        const today = new Date()
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateFormatted = today.toLocaleDateString(undefined, options)
        const timestamp = today.getTime()
        let m  = majOrMin === "major" ? "" : "m"
        let keyFormat = key + m
        const properties = {
            id: productId, title: title, key: keyFormat, description: description, 
            bpm: bpm, imageSrc: imageSrc, collaborators: collaborators, 
            tags: tags, trackType: trackType, stemsSrc: stemsSrc, wavSrc: wavSrc, mp3Src: mp3Src,
            date: dateFormatted, timestamp: timestamp, taggedSrc: taggedSrc
        }
        const jsoned = JSON.stringify(properties);
        const files = []
        tagged && files.push({name: taggedName, file: tagged})
        mp3 && files.push({name: mp3Name, file: mp3})
        wav && files.push({name: wavName, file: wav})
        stems && files.push({name: stemsName, file: stems})

        const status = await uploadToAzure(files)
        if  ( status == 200 ) {
            onUploadFinished()
            setIsUploading(false)
            setToast({ text: `Uploaded ${trackType}!`, type: "success" })
            toggleVisibility()
            return
        }
        else { 
            setToast({ text: status, type: "error" })
        }
        setIsUploading(false)
    }
    const handleFiles = (e) => {
        if(!e){
            return
        }
        console.log(e)
        if (fileType == "wav"){
            setWav(e)
        }
        else if(fileType === "tagged"){
            setTagged(e)
        }
        else if(fileType === "mp3"){
            setMp3(e)
        }
        else if (fileType === "stems") {
            setStems(e)
        }
        else if (fileType === "image"){
            let reader  = new FileReader();
            setImage(e)
            reader.onload = function(e)  {
                setImageSrc(e.target.result)
             }
             reader.readAsDataURL(e);
        }
    }
    const handleFileType = (e) => {
        if(fileType === e){
            ref.current.click()
            return
        }
        else if(e == "wav") { 
            ref.current.accept = ".wav"
        }
        else if(e == "mp3" || e == "tagged") { 
            ref.current.accept = ".mp3"
        }
        else if(e ==="stems"){
            ref.current.accept = ".zip,.rar"
        }
        else if(e === "image"){
            ref.current.accept = ".jpeg,.gif,.png"
        }
        setFileType(e)
    }

    const handleSchedule = (e)  => {
        if(e.length === 1 && (e.substring(0,1) != "0" && e.substring(0,1) != "1" )){
            setSchedule("0"+e+"/")
            return
        }
        if(e.length === 4 && (e.substring(3,4) != "0" && e.substring(3,4) != "1" && e.substring(3,4) != "2" && e.substring(3,4) != "3" )){
            setSchedule(schedule.substring(0,3) +"0"+e.substring(3,4)+"/")
            return
        }
        if(e.length > 10){
            return
        }
        if(e.length === 2 && schedule.length < e.length){
            setSchedule(e + "/")
        }
        else if(e.length === 2 && schedule.length > e.length){
            if(schedule.substring(0,1) === "0"){
                setSchedule('')
                return
            }
            setSchedule(schedule.substring(0,1))
         
        }
        else if(e.length === 5 && schedule.length < e.length){
            setSchedule(e + "/")
        }
        else if(e.length === 5 && schedule.length > e.length){
            if(schedule.substring(3,4) === "0"){
                setSchedule(schedule.substring(0,3))
                return
            }
            setSchedule(schedule.substring(0,4))
        }
        else{
            setSchedule(e)
        }

    }
   
   
    if (!keyOptions) return (<Loading/>)

    return (
        <Modal padding={0} visible={visibility} onClose={toggleVisibility}>
            <Modal.Content>
                <div style={{height: "60vh", overflowY: "scroll"}}>
                    <input ref={ref} type="file" onChange={(e) => handleFiles(e.target.files[0])}/>
                    <Text type='warning' h2>create track</Text>
                    <div style={{display: "flex", alignItems: "flex-start"}}>
                        <Dot mt={0.5} type={bpm && key && title && trackType && tags.length > 0 && majOrMin
                            ? 'success':'secondary'}>
                        </Dot>
                        <div>
                            <Text margin={0} h4>track details</Text>
                            <Text type='warning' small>* = required</Text>
                        </div>
                    </div>
                    <Spacer/>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Input placeholder="title*" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <Input placeholder='bpm*' value={bpm} onChange={(e)=> setBpm(e.target.value)}/>
                    </div>
                    <Spacer/>
                    <div style={{display: "flex", alignItems:"center"}}>
                        <AutoComplete width={11} clearable placeholder='key*' onChange={(val) => setKey(val)} disableFreeSolo options={keyOptions} initialValue="" />
                        <Radio.Group ml={1.5} useRow value={majOrMin} onChange={(val) => setMajOrMin(val)}>
                            <Radio type="warning" value="major">major</Radio>
                            <Radio type="success" value="minor">minor</Radio>
                        </Radio.Group>
                    </div>
                    <Spacer/>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <AutoComplete width={11} clearable placeholder='track type*' onChange={(val) => setTrackType(val)} disableFreeSolo options={trackTypeOptions} initialValue="" />
                        <Input placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <Spacer/>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Input placeholder="collaborators"   {...bindings} value={collabInputVal} onChange={(e) => {setCollabInputVal(e.target.value); setIsTags(false)}} />
                            {
                                collaborators.length > 0 && 
                                <div style={{display: "flex", width: "180px", flexWrap: "wrap", marginTop: "15px", gap: "0 0.5rem"}}>
                                    {collaborators.map(c => <Badge mb={0.5} scale={0.75} type='success'>{c}</Badge>)}
                                </div>
                            }
                        </div>
                        <div>
                            <Input placeholder="tags*" {...bindings} value={tagInputVal} onChange={(e) => {setTagInputVal(e.target.value); setIsTags(true)}} />
                            {
                                tags.length > 0 && 
                                    <div style={{display: "flex", width: "180px", flexWrap: "wrap", marginTop: "15px", gap: "0 0.5rem"}}>
                                        {tags.map(tag => <Badge mb={0.5} scale={0.75} type='success'>#{tag}</Badge>)}
                                    </div>
                            }
                        </div>
                    </div>
                    {/* <Spacer h={2}/>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div>
                            <div style={{display: "flex"}}>
                                <Dot type={ schedule.length === 10 ? 'success' : 'secondary'}></Dot><Text margin={0} h4>schedule upload</Text>
                                
                            </div>
                            <Text type='warning' small>optional</Text>
                        </div>
                        <Input icon={<Calendar/>} value={schedule} onChange={(e) => handleSchedule(e.target.value)}  ml={1} w={9} placeholder="MM/DD/YYYY"/>
                        <Button icon={<Calendar/>} onClick={()=>setisCalendarVisible(true)} ml={1} auto>MM/DD/YYYY</Button>
                    </div> */}
                    <Spacer h={2}/>
                    <div style={{display: "flex"}}>
                        <Dot type={ wav || mp3 ? 'success' : 'secondary'}></Dot><Text margin={0} h4>audio files</Text>
                    </div>
                    <Text type='warning' small>tagged is optional</Text>
                    <Spacer/>
                    <Button mr={1} onClick={()=>{handleFileType("wav")}} type={wav ? "success" : "default"} ghost auto>WAV</Button>
                    <Button mr={1} onClick={()=>{handleFileType("mp3")}} type={mp3 ? "success" : "default"} ghost auto>MP3</Button>
                    <Button mr={1} onClick={()=>{handleFileType("stems")}} type={stems ? "success" : "default"} ghost auto>STEMS</Button>
                    <Button auto onClick={()=>{handleFileType("tagged")}} type={tagged ? "success" : "default"} ghost>TAGGED</Button>
                    <Spacer h={2}/>
                    <div style={{display: "flex"}}>
                        <Dot type={imageSrc ? 'success' :'secondary'}></Dot><Text margin={0} h4>image</Text>
                    </div>
                    <Spacer/>
                    {imageSrc && 
                        <div className='img-and-remove' style={{backgroundImage: `url(${imageSrc})`}}>
                            <button onClick={() => {setImageSrc(null); setImage(null)}}  style={{paddingTop: "4px", paddingRight: "4px" }}>
                                <XCircleFill/>
                            </button>
                        </div>
                    }
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Button mr={1} type={image ? "success" : "default"} ghost onClick={()=>handleFileType("image")} auto>UPLOAD</Button>
                        <Text type='warning' margin={0} h6>or<Text i span><button style={{background:"transparent", border: "0px"}}><Code onClick={()=> {getRandomImg()}}>generate</Code></button></Text>a random image</Text>
                    </div>
                    <Spacer h={2}/>
                    <div style={{justifyContent: "center", display: 'flex'}}>
                        <Button 
                            disabled={!(
                                title.length > 1 && trackType.length > 0 &&
                                majOrMin && (mp3 || wav) && 
                                tags && imageSrc && bpm.length > 1 
                                && key.length > 0
                            )} 
                            loading={isUploading}
                            type={"success"} 
                            ghost 
                            onClick={()=>onUpload()} 
                            auto>
                            CREATE
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
        
    )
}


