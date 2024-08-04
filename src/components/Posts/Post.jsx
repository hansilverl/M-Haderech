// src/components/Posts/Post.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pdfIcon from '../../assets/pdf-file.png'
import defaultCoverImage from '../../assets/default-post-cover.jpg'
import { getDownloadURLFromPath } from '../../hooks/useResourceManagement'
import './Post.css'

const getDateStringFromTimeStamp = (timeStamp) => {
    if (!timeStamp) return null
    const now = timeStamp?.toDate()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    return `${day}/${month}/${year}`
}

const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

const Post = ({ article, onPostClick }) => {
    const { id, title, datePublished, description, elements } = article
    const navigate = useNavigate()

    const [imageUrl, setImageUrl] = useState(null)
    const [pdfUrls, setPdfUrls] = useState(null)

    const [imagePath] = useState(elements?.find((element) => element.type === 'image')?.resourcePath)
    const [pdfPaths] = useState(
        elements
            ?.filter((element) => element.type === 'document' && element.resourcePath)
            ?.map((element) => element.resourcePath)
    )

    useEffect(() => {
        const getUrls = async () => {
            if (imagePath) {
                setImageUrl(await getDownloadURLFromPath(imagePath))
            } else {
                setImageUrl(defaultCoverImage)
            }

            if (pdfPaths) {
                const promises = pdfPaths.map(async (path) => await getDownloadURLFromPath(path))
                setPdfUrls(await Promise.all(promises))
            }
        }
        getUrls()
    }, [imagePath, pdfPaths])

    const handleViewPost = () => {
        if (onPostClick) {
            onPostClick()
        } else {
            navigate(`/posts/${id}`)
        }
    }

    return !id ? null : (
        <div className='detailed-post-container' onClick={handleViewPost}>
            <div className='title-date-container'>
                <h3 className='post-title'>{title}</h3>
                <p className='post-date'>{getDateStringFromTimeStamp(datePublished)}</p>
            </div>
            <img src={imageUrl || defaultCoverImage} alt={title} className='post-image' />
			<div className='post-preview'>
            <p className='post-description'>{truncateDescription(description, 100)}</p>

            {pdfUrls && pdfUrls.map((pdfUrl, index) => (
                <a
                    key={index}
                    href={pdfUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='post-pdf-button'
                    onClick={(e) => e.stopPropagation()} // Prevents the click from propagating to the parent div
                >
                    <img src={pdfIcon} alt='pdf-icon' className='pdf-icon' />
                </a>
            ))}
			</div>
        </div>
    )
}

export default Post
