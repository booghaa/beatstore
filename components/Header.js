import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MenuDrawer from './MenuDrawer'
import { Button, Text, Tabs , Drawer , Spacer, useToasts} from '@geist-ui/core'
import { Moon, Sun, User, LogOut, UploadCloud, ShoppingBag, Mail, Menu } from '@geist-ui/icons'
import { useCart } from './CartProvider'
import { useMediaQuery } from 'usehooks-ts'
export default function Header({isAuthenticated, toggleCartModal, toggleAuthModal, logOut, toggleUploadModal, theme, toggleTheme}) {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const isBig = useMediaQuery('(min-width: 760px)')
    const isMedium =  useMediaQuery('(min-width: 450px)')
    const {cartValue} = useCart()
	const router = useRouter()
    const { setToast } = useToasts()
    const toggleMenu = () => { 
        setIsMenuVisible(!isMenuVisible)
    }
    return (
        <div className='header-container'>
            <div className='header-title'>
                {!isBig && 
                    <MenuDrawer isAuthenticated={isAuthenticated} toggleUploadModal={toggleUploadModal} visible={isMenuVisible} toggleMenu={toggleMenu}/>
                }
                <Link passHref href={'/'}>
                    <a>
                        <Text h2 type="warning">bogha</Text>
                    </a>
                </Link>
            </div>
            <div className='tabs'>
                {isBig &&
                <Tabs unselectable='on' hideDivider hideBorder value={router.asPath} onChange={(route) => router.push(route)}>
                    <Tabs.Item label="Tracks" value="/" />
                    <Tabs.Item label="Orders" value="/orders" />
                    <Tabs.Item label="Kits" value="/kits" />
                    <Tabs.Item label="Contact" value="/contact" />
                </Tabs>}
            </div>
            <div className='header-icons'>
                <div style={{display: "flex"}}>
                    {
                        isAuthenticated
                        ? <Button style={{ textTransform: 'none', marginRight: 10}} paddingLeft={0.7} paddingRight={0.7} auto icon={<LogOut />} onClick={()=>{logOut(); setToast({ text: "Signed Out!", type: "success" })}}/>
                        : <Button paddingLeft={0.7} paddingRight={0.7} auto icon={<User />} onClick={toggleAuthModal} style={{ marginRight: 10 }}/>
                        }	
                    {
                        isAuthenticated && isBig &&
                        <Button paddingLeft={0.5} paddingRight={0.5} auto icon={<UploadCloud />} onClick={toggleUploadModal} style={{ marginRight: 10 }}/>
                        }
                    {
                        cartValue > 0
                            ? <Button type='secondary' ghost paddingLeft={0.7} paddingRight={0.7} onClick={()=> toggleCartModal()} auto icon={<ShoppingBag />} style={{ marginRight: 10 }}>${cartValue}</Button>
                            : <Button paddingLeft={0.7} paddingRight={0.7} onClick={()=> toggleCartModal()} auto icon={<ShoppingBag />} style={{ marginRight: 10 }}/>
                        }
                    <Button paddingLeft={0.7} paddingRight={0.7} onClick={toggleTheme} auto className='theme-toggle'
                        icon = 
                        {
                        theme == 'light' 
                        ? <Moon color='purple' />
                        : <Sun color='yellow' />
                        }
                    />
                    {
                        !isBig && <Button paddingLeft={0.7} paddingRight={0.7} auto icon={<Menu />} onClick={toggleMenu} style={{ marginLeft: 10 }}/>
                    }
                </div>
            </div>
        </div>
    )
}
