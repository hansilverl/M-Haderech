import React, { useEffect, useState } from 'react';
import useResourceManagement, { getDownloadURLFromPath } from '../../hooks/useResourceManagement';
import './PostResourceInput.css';

const PostResourceInput = (props) => {
	const { path, setPath, url, setUrl, type, title } = props;
	const { resourcePath, loadingResourcePath, errorResourcePath, deleteResource, uploadResource } =
		useResourceManagement(path);

	const [currentFile, setCurrentFile] = useState(undefined);

	const deleteResourceHandler = () => {
		deleteResource();
	};

	const uploadResourceHandler = () => {
		if (!currentFile) return;
		if (path) deleteResource();
		uploadResource(currentFile, type);
	};

	useEffect(() => {
		const setAll = async () => {
			const newUrl = await getDownloadURLFromPath(resourcePath);
			setPath(resourcePath);
			setUrl(newUrl);
		};
		setAll();
	}, [resourcePath]);

	return (
		<div className="resource-input">
			<h3 className='title'>{title}:</h3>
			{!path ? (
				<div className="file-input">
					<input type="file" onChange={(e) => setCurrentFile(e.target.files[0])} />
					<button onClick={uploadResourceHandler} className="upload-button">העלה</button>
				</div>
			) : (
				<div className="file-info">
					<h5>קיים כבר קובץ</h5>
					<a href={url} target="_blank" rel="noopener noreferrer">ניתן לראות כאן</a>
					<button onClick={deleteResourceHandler} className="delete-button-input">מחק</button>
				</div>
			)}
			{loadingResourcePath && <div className="status-message">Loading...</div>}
			{errorResourcePath && <div className="status-message error">Error: {errorResourcePath.toString()}</div>}
		</div>
	);
};

export default PostResourceInput;
