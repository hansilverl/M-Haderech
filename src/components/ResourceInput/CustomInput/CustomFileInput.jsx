import React, { useCallback, useRef, useState } from 'react'
import './CustomFileInput.css' // Import the CSS file for styling
import Dropzone from 'react-dropzone'

const CustomFileInput = ({ setFile }) => {
	const onDrop = useCallback((acceptedFiles) => {
		console.log(acceptedFiles)
		if (acceptedFiles.length > 1) {
			setError('אפשר להעלות רק קובץ אחד')
			return
		}
		setError(null)
		setFile(acceptedFiles[0])
		return
	}, [])

	const [error, setError] = useState(null)
	const [fileName, setFileName] = useState(null)


	const handleFileChange = (event) => {
		if (event.target.files.length > 1) {
			setError('אפשר להעלות רק קובץ אחד')
			return
		}
		const file = event.target.files[0]
		if (file) {
			setFileName(file.name)
			setFile(file)
		} else {
			setFileName('לא נבחר קובץ')
			setFile(null)
		}
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
							{fileName && <p className='file-name'>{fileName}</p>}
							{!fileName && (
								<>
									<p className='drag-message'>לא נבחר קובץ</p>
									<p className='drag-message'>גרור קובץ או לחץ כאן לבחירת קובץ</p>
								</>
							)}
							{error && <p className='drag-error-message'>{error}</p>}
						</div>
					</div>
				)}
			</Dropzone>
		</div>
	)
}

export default CustomFileInput
