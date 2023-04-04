import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Beats from '../components/Beats'

export default function Home({beats, toggleCartModal, isCartModalVisible, toggleUploadModal, isUploadModalVisible,}) {
	return (
		<div className='content-container'>
			{beats && <Beats beats={beats}/>}
		</div>
	)
}


  