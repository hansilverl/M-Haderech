import React, { useState, useEffect } from 'react';
import Convention from './Convention';
import usePostsGet, { queryGetAllPostsAdmin } from '../../hooks/usePostsGet';
import './ConventionsList.css';

const ConventionsList = () => {
	const query = queryGetAllPostsAdmin(20);
	const { postsGet, loadingGet, errorGet, postsGetHandler } = usePostsGet(query);
	const [conventions, setConventions] = useState([]);

	useEffect(() => {
		if (postsGet) {
			const filteredConventions = postsGet.filter(post => post.articleType === 'convention');
			setConventions(filteredConventions);
		}
	}, [postsGet]);

	useEffect(() => {
		postsGetHandler(20);
	}, []);

	return (
		<div className='container'>
			{loadingGet ? (
				<div className='loading'>טוען...</div>
			) : errorGet ? (
				<div className='error'>{errorGet.toString()}</div>
			) : conventions.length === 0 ? (
				<h2 className='error'>אין אירועים</h2>
			) : (
				<div className='conventions-container'>
					{conventions.map((convention, index) => (
						<Convention key={index} article={convention} />
					))}
				</div>
			)}
		</div>
	);
};

export default ConventionsList;
