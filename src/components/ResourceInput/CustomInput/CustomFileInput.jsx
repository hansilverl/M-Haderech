import './CustomFileInput.css' // Import the CSS file for styling

import React, { useCallback, useState } from 'react'
import Dropzone from 'react-dropzone'

const CustomFileInput = ({ setFiles, maxFiles }) => {
	maxFiles = maxFiles == undefined || maxFiles <= 1 ? 1 : maxFiles
	const [error, setError] = useState(null)

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles.length > maxFiles) {
			setError(`מספר הקבצים המקסימלי הוא ${maxFiles}`)
			return
		}
		console.log('acceptedFiles', acceptedFiles)
		setError(null)
		setFiles(acceptedFiles)
		return
	}, [])

	const handleFileChange = (event) => {
		if (event.target.files.length > maxFiles) {
			setError(`מספר הקבצים המקסימלי הוא ${maxFiles}`)
			return
		}
		setFiles(event.target.files)
	}

	return (
		<div className='custom-file-input-container'>
			<Dropzone onDrop={onDrop}>
				{({ getRootProps, getInputProps }) => (
					<div className='custom-file-input-div' {...getRootProps()}>
						<input
							type='file'
							onChange={handleFileChange}
							style={{ display: 'none' }}
							{...getInputProps()}
						/>
						<div className='file-info-container'>
							<p className='drag-message'>גרור קובץ או לחץ כאן לבחירת קובץ</p>
							{error && <p className='drag-error-message'>{error}</p>}
						</div>
					</div>
				)}
			</Dropzone>
		</div>
	)
}

export default CustomFileInput
