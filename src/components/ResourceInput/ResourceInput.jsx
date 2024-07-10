import React, { useEffect, useState } from 'react'
import useResourceManagement, { getDownloadURLFromPath } from '../../hooks/useResourceManagement'
import './ResourceInput.css'
import CustomFileInput from './CustomInput/CustomFileInput';

const ResourceInput = (props) => {
	const { path, setPath, type, title } = props
	const {
		resourcePath,
		loadingResourcePath,
		errorResourcePath,
		deleteResource,
		uploadResource,
		downloadResource,
	} = useResourceManagement(path)

	const [currentFile, setCurrentFile] = useState(undefined)
	const [url, setUrl] = useState(undefined)

	const deleteResourceHandler = () => {
		deleteResource()
	}

	const uploadResourceHandler = async () => {
		if (!currentFile) return
		if (path) await deleteResource()
		await uploadResource(currentFile, type)
	}

	useEffect(() => {
		const setInternalUrl = async () => {
			if (!resourcePath || resourcePath === '') return
			const newUrl = await getDownloadURLFromPath(resourcePath)
			setUrl(newUrl)
		}
		setPath(resourcePath)
		setInternalUrl()
	}, [resourcePath])

	return (
		<div className='resource-input'>
			<h3 className='title'>{title}:</h3>
			{!errorResourcePath ? null : (
				<h2 className='status-message error'>שגיאה: {errorResourcePath.toString()}</h2>
			)}
			{loadingResourcePath ? (
				<h2 className='status-message'>טוען</h2>
			) : !path ? (
				<div className='file-input'>
					<CustomFileInput setFile={setCurrentFile} />
					<button onClick={uploadResourceHandler} className='upload-button'>
						העלה
					</button>
				</div>
			) : (
				<div className='file-info'>
					<h5>קיים כבר קובץ</h5>
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
	)
}

export default ResourceInput
