import React from 'react'
import { Drawer, Text, Spacer} from '@geist-ui/core'
import Link from 'next/link'
import {Mail, Activity, Box, File, UploadCloud} from '@geist-ui/icons'
export default function MenuDrawer({visible, toggleMenu, toggleUploadModal, isAuthenticated}) {
    
  return (
    <Drawer keyboard visible={visible} onClose={toggleMenu}>
        <Drawer.Content>
                {isAuthenticated &&
                <div style={{cursor: "pointer"}} onClick={()=>{toggleUploadModal()}} id='drawer-link'>
                    <UploadCloud/>
                    <Spacer w={0.5} />
                    <Text>upload</Text>
                </div> 
                        
                }
                <Link passHref href="/">
                    <a onClick={toggleMenu} id='drawer-link'>
                        <Activity/>
                        <Spacer w={0.5} />
                        <Text>beats</Text>
                    </a>
                </Link>
                <Link passHref href="/orders">
                    <a onClick={toggleMenu} id='drawer-link'>
                        <File />
                        <Spacer w={0.5} />
                        <Text>orders</Text>
                    </a>
                </Link>
                <Link passHref href="/kits">
                    <a onClick={toggleMenu} id='drawer-link'>
                        <Box />
                        <Spacer w={0.5} />
                        <Text>kits</Text>
                    </a>
                </Link>
                <Link passHref href="/contact">
                    <a onClick={toggleMenu} id='drawer-link'>
                        <Mail />
                        <Spacer w={0.5} />
                        <Text>contact</Text>
                    </a>
                </Link>
        </Drawer.Content>
        
    </Drawer>
  )
}
