import React, { useRef, useState } from 'react'
import './CustomFileInput.css' // Import the CSS file for styling

const CustomFileInput = ({ setFile }) => {
	const [fileName, setFileName] = useState('לא נבחר קובץ')
	const fileInputRef = useRef(null)

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			setFileName(file.name)
			setFile(file)
		} else {
			setFileName('לא נבחר קובץ')
			setFile(null)
		}
	}

	const handleButtonClick = () => {
		fileInputRef.current.click()
	}

	return (
		<div className='custom-file-input-container'>
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
			<button type='choose-file-button' onClick={handleButtonClick} className='choose-file-button'>
				בחר קובץ
			</button>
			<span className='file-name'>{fileName}</span>
		</div>
	)
}

export default CustomFileInput
