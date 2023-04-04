import { useState, useEffect } from 'react'
import { CssBaseline, GeistProvider, Loading, Link, Page, Button, Divider, useToasts} from '@geist-ui/core'
import Footer from '../components/Footer'
import Cookies from 'js-cookie'
import '../styles/globals.css'
import AudioProvider from '../components/AudioProvider'
import CartProvider from '../components/CartProvider'
import { ChakraProvider } from '@chakra-ui/react'
import Auth from '../components/Auth'
import Cart from '../components/Cart'
import Header from '../components/Header'
import Upload from '../components/Upload'

import axios from 'axios'
export default function App({ Component, pageProps }) {
	  const [theme, setTheme] = useState('light')
    const [loading, setLoading] = useState(true)
    const [beats, setBeats] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
    const [isCartModalVisible, setIsCartModalVisible] = useState(false)
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)
    
    
    
    const toggleAuthModal = () => { 
      setIsAuthModalVisible(!isAuthModalVisible)
    }
    const toggleCartModal = () => { 
      setIsCartModalVisible(!isCartModalVisible)
    }
    const toggleUploadModal = () => {
      setIsUploadModalVisible(!isUploadModalVisible)
    }

    const toggleTheme = () => {
      let newTheme = theme === 'light' ? 'dark' : 'light'
      window.localStorage.setItem('theme', newTheme)
      setTheme(newTheme)
    }
    const logOut = () => { 
      setIsAuthenticated(false)
      Cookies.set('authorization', '')
      window.localStorage.removeItem('user', '')
    }
    const getFiles = async () => { 
      const res = await axios.get(`http://localhost:3000/api/beats`)
      const data = res.data
      setBeats(data)
    }
    useEffect(() => {
        if(Cookies.get('authorization')) {
          setIsAuthenticated(true)
        }
        const getBeats = async()=> {
            const res = await axios.get(`http://localhost:3000/api/beats`)
            const beatsInit = res.data
            setBeats(beatsInit)
            console.log(beatsInit)
         }
        getBeats()
        const localTheme = window.localStorage.getItem('theme')
        if (localTheme)
          setTheme(localTheme)
        else {
          window.localStorage.setItem(
            'theme',
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          )
        }
        setLoading(false)
    }, [])
    
   
	return (
    <GeistProvider themeType={theme}>
        <ChakraProvider>
        <CssBaseline/>
        <AudioProvider>
        {!loading ?
          <CartProvider isAuthenticated={isAuthenticated}>
            <Page id="page" dotBackdrop={false} dotSize="1px">
              <Page.Header>
                <Header theme={theme} toggleTheme={toggleTheme} logOut={logOut} toggleAuthModal={toggleAuthModal} toggleUploadModal={toggleUploadModal} isAuthenticated={isAuthenticated} toggleCartModal={toggleCartModal}/>
              </Page.Header>
              <Divider/>
              <Auth visibility={isAuthModalVisible} toggleVisibility={toggleAuthModal} onAuthFinished={(username) => {setIsAuthenticated(true); window.localStorage.setItem('user', username)}}/>
              <Cart isAuthenticated={isAuthenticated} toggleAuthModal={toggleAuthModal} visibility={isCartModalVisible} toggleVisibility={toggleCartModal}/>
              <Upload onUploadFinished={getFiles} visibility={isUploadModalVisible} toggleVisibility={toggleUploadModal}/>
              <Component {...pageProps } isAuthenticated={isAuthenticated} beats={beats} toggleCartModal={toggleCartModal} isCartModalVisible={isCartModalVisible} 
                toggleUploadModal={toggleUploadModal} isUploadModalVisible={isUploadModalVisible}
                isAuthModalVisible={isAuthModalVisible} toggleAuthModal={toggleAuthModal}/>
              <Page.Footer id='footer'>
                <Footer beats={beats}/>
              </Page.Footer>
            </Page>
          </CartProvider>
        : <Loading/>}
        </AudioProvider>
        </ChakraProvider>
      
      </GeistProvider>
      
    
    
	)
}



