import React, { useEffect, useState } from 'react'
import useResourceManagement, { getDownloadURLFromPath } from '../../hooks/useResourceManagement'
import './ResourceInput.css'
import CustomFileInput from './CustomInput/CustomFileInput'

const ResourceInput = (props) => {
	const { path, setPath, type, title, url, setUrl } = props
	const {
		resourcePath,
		loadingResourcePath,
		errorResourcePath,
		deleteResource,
		uploadResource,
		downloadResource,
	} = useResourceManagement(path)

	const [currentFile, setCurrentFile] = useState(undefined)

	const deleteResourceHandler = () => {
		setCurrentFile(null)
		setUrl(null)
		deleteResource()
	}

	const uploadResourceHandler = async () => {
		if (!currentFile) return
		if (path) await deleteResource()
		await uploadResource(currentFile, type)
	}

	useEffect(() => {
		const setInternalUrl = async () => {
			const newUrl = await getDownloadURLFromPath(resourcePath)
			setUrl(newUrl)
		}
		setPath(resourcePath)
		if (resourcePath && resourcePath !== '') setInternalUrl()
	}, [resourcePath])

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
							מחק
						</button>
						<button onClick={downloadResource}>הורד</button>
					</div>
				)}
			</div>
			<div className='status-message-container'>
				{loadingResourcePath ? (
					<h2 className='status-message'>טוען</h2>
				) : !errorResourcePath ? null : (
					<h2 className='status-message error'>שגיאה: {errorResourcePath.toString()}</h2>
				)}
			</div>
		</div>
	)
}

export default ResourceInput
