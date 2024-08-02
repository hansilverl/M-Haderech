import './ResourceInput.css'

import React, { useEffect, useState } from 'react'
import useResourcesMgmt, { getDownloadURLFromPath } from '../../hooks/useResourcesMgmt'
import CustomFileInput from './CustomInput/CustomFileInput'
import { FaDownload } from 'react-icons/fa'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const ResourceInput = (props) => {
	const { paths, setPaths, types, title, urls, setUrls, maxFiles } = props

	const {
		resourceList,
		loadingResourcesMgmt,
		errorResourcesMgmt,
		deleteResources,
		uploadResources,
		downloadResource,
	} = useResourcesMgmt(paths && paths !== '' ? paths : [])

	const [currentFiles, setCurrentFiles] = useState(undefined)

	const deleteResourceHandler = () => {
		deleteResources(paths)
	}

	const uploadResourceHandler = async () => {
		if (!currentFiles) return
		if (paths) await deleteResources(paths)
		await uploadResources(currentFiles, types)
	}

	useEffect(() => {
		const setInternalUrl = async () => {
			const newUrls = []
			for (const path of resourceList) {
				const newUrl = await getDownloadURLFromPath(path)
				newUrls.push(newUrl)
			}
			setUrls(newUrls)
		}
		setPaths(resourceList)
		if (resourceList && resourceList !== '') setInternalUrl()
	}, [resourceList])

	useEffect(() => {
		uploadResourceHandler()
	}, [currentFiles])

	return (
		<div className='resource-input-container'>
			<div className='file-input'>
				<h3 className='title'>קובץ {title}:</h3>
				{paths && paths.length > 0 && paths[0] && (
					<div className='file-info-container'>
						<a href={urls} target='_blank' rel='noopener noreferrer'>
							ניתן לראות כאן
						</a>
						<button onClick={deleteResourceHandler} className='delete-button-input'>
							מחיקה
						</button>
						<button className='download-button' alt='הורדת קובץ' onClick={downloadResource}>
							<FaDownload />
						</button>
					</div>
				)}
				{paths && paths.length === 0 && (
					<CustomFileInput maxFiles={maxFiles} setFiles={setCurrentFiles} />
				)}
			</div>
			<div className='status-message-container'>
				{loadingResourcesMgmt && <LoadingSpinner />}
				{errorResourcesMgmt && (
					<h2 className='status-message error'>שגיאה: {errorResourcesMgmt.toString()}</h2>
				)}
			</div>
		</div>
	)
}

export default ResourceInput
