import './ResourceInput.css'

import React, { useEffect, useState } from 'react'
import useResourcesMgmt, { getDownloadURLFromPath } from '../../hooks/useResourcesMgmt'
import CustomFileInput from './CustomInput/CustomFileInput'
import { FaDownload } from 'react-icons/fa'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const ResourceInput = (props) => {
	const { path, setPath, type, title, url, setUrl } = props
	const {
		resourcesPaths,
		loadingResourcesMgmt,
		errorResourcesMgmt,
		deleteResources,
		uploadResources,
		downloadResource,
	} = useResourcesMgmt([path])

	const [currentFile, setCurrentFile] = useState(undefined)

	const deleteResourceHandler = () => {
		setCurrentFile(null)
		setUrl(null)
		deleteResources()
	}

	const uploadResourceHandler = async () => {
		if (!currentFile) return
		if (path) await deleteResources([path])
		await uploadResources([currentFile], [type])
	}

	useEffect(() => {
		const setInternalUrl = async () => {
			const newUrl = await getDownloadURLFromPath(resourcesPaths[0])
			setUrl(newUrl)
		}
		setPath(resourcesPaths[0])
		if (resourcesPaths && resourcesPaths !== '') setInternalUrl()
	}, [resourcesPaths])

	useEffect(() => {
		uploadResourceHandler()
	}, [currentFile])

	return (
		<div className='resource-input-container'>
			<div className='file-input'>
				<h3 className='title'>קובץ {title}:</h3>
				{!path ? (
					<CustomFileInput setFile={setCurrentFile} />
				) : (
					<div className='file-info-container'>
						{/* <h5>קיים כבר קובץ</h5> */}
						<a href={url} target='_blank' rel='noopener noreferrer'>
							ניתן לראות כאן
						</a>
						<button onClick={deleteResourceHandler} className='delete-button-input'>
							מחיקה
						</button>
						<button className='download-button' alt='הורדת קובץ' onClick={downloadResource}>
							{/*download icon:*/}
							<FaDownload />
						</button>
					</div>
				)}
			</div>
			<div className='status-message-container'>
				{loadingResourcesMgmt ? (
					<LoadingSpinner />
				) : !errorResourcesMgmt ? null : (
					<h2 className='status-message error'>שגיאה: {errorResourcesMgmt.toString()}</h2>
				)}
			</div>
		</div>
	)
}

export default ResourceInput
