import React, { useEffect, useState } from 'react'

import useResourceManagement, { getDownloadURLFromPath } from '../../hooks/useResourceManagement'

const PostResourceInput = (props) => {
	const { path, setPath, url, setUrl, type, title } = props
	const { resourcePath, loadingResourcePath, errorResourcePath, deleteResource, uploadResource } =
		useResourceManagement(path)

	const [currentFile, setCurrentFile] = useState(undefined)

	const deleteResourceHandler = () => {
		deleteResource()
	}

	const uploadResourceHandler = () => {
		if (!currentFile) return
		if (path) deleteResource()
		uploadResource(currentFile, type)
	}

	useEffect(() => {
		const setAll = async () => {
			const newUrl = await getDownloadURLFromPath(resourcePath)
			setPath(resourcePath)
			setUrl(newUrl)
		}
		setAll()
	}, [resourcePath])

	return (
		<div className='flex-row'>
			<h3>{title}:</h3>
			{!path ? (
				<input type='file' onChange={(e) => setCurrentFile(e.target.files[0])} />
			) : (
				<div className='flex-row'>
					<h3>קיים כבר קובץ</h3>
					<a href={url}>ניתן לראות כאן</a>
				</div>
			)}
			{loadingResourcePath ? (
				<div>Loading...</div>
			) : errorResourcePath ? (
				<div>Error: {errorResourcePath.toString()}</div>
			) : resourcePath ? (
				<button onClick={deleteResourceHandler}>מחק</button>
			) : (
				<button onClick={uploadResourceHandler}>העלה</button>
			)}
		</div>
	)
}

export default PostResourceInput
