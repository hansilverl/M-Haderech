import './AboutFull.css'
// src/pages/AboutFull/AboutFull.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePostsGet from '../../hooks/usePostsGet'

import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import logo from '../../assets/logo.png' // Adjust the path to your logo file

import { FaArrowRight } from 'react-icons/fa'
import PostElementPresentor from '../../components/PostElementPresentor/PostElementPresentor'

const formatDate = (timestamp) => {
	if (!timestamp) return ''
	const date = new Date(timestamp.seconds * 1000) // Convert Firestore timestamp to JavaScript Date object
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() is zero-based
	const year = date.getFullYear()
	return `${day}/${month}/${year}`
}
const AboutFull = () => {
	const id = 'about-us'
	const { postsGet, loadingGet, errorGet } = usePostsGet(id)
	const navigate = useNavigate()

	return (
		<div className='post-details-container'>
			<button className='back-button' onClick={() => navigate(-1)}>
				<FaArrowRight />
			</button>
			{loadingGet ? (
				<p>טוען...</p>
			) : errorGet ? (
				<p>{errorGet.toString()}</p>
			) : !postsGet ? (
				<p>המאמר לא נמצא</p>
			) : (
				<>
					<div className='post-details-header'>
						<h1>{postsGet.title}</h1>
						<p>
							<strong>תיאור:</strong> {postsGet.description}
						</p>
					</div>
					<div className='post-details-elements'>
						{postsGet?.elements.map((element, index) => (
							<PostElementPresentor key={`element-${index}`} element={element} />
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default AboutFull
