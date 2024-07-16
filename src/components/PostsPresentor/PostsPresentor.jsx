import './PostsPresentor.css'

import React, { useEffect, useState } from 'react'
import Post from '../Posts/Post'
import PostAdmin from '../PostAdmin/PostAdmin'
import usePostsGet, { buildQuery } from '../../hooks/usePostsGet'

const PostsPresentor = ({ type, published, pageSize, allowAdmin, allowPages, allowSearch }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [currentPosts, setCurrentPosts] = useState(null)
	const [needToReload, setNeedToReload] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredPosts, setFilteredPosts] = useState(null)

	const myQuery = buildQuery(type, published, pageSize)
	const { postsGet, loadingGet, errorGet, hasMore, reloadGet, loadMoreGet } = usePostsGet(myQuery)

	const typeName = type === 'post' ? 'מאמר' : 'כנס'

	const isNextPageAvailable = () => {
		if (!filteredPosts) return false
		if (currentPage * pageSize >= filteredPosts.length && !hasMore) return false
		return true
	}

	useEffect(() => {
		if (!needToReload) return
		setNeedToReload(false)
		setCurrentPage(1)
		setCurrentPosts(null)
		reloadGet()
	}, [needToReload])

	useEffect(() => {
		if (loadingGet || !filteredPosts) return
		console.log('filteredPosts: ', filteredPosts);
		const pageStart = (currentPage - 1) * pageSize
		const pageEnd = pageStart + pageSize
		if (filteredPosts.length < pageEnd && hasMore) {
			loadMoreGet()
			return
		}
		setCurrentPosts(filteredPosts.slice(pageStart, pageEnd))
	}, [filteredPosts, currentPage])

	useEffect(() => {
		if (loadingGet || !postsGet) return
		setFilteredPosts(
			postsGet.filter((article) => {
				if (!searchQuery) return true
				return article.title.toLowerCase().includes(searchQuery.toLowerCase())
			})
		)
	}, [postsGet, searchQuery])

	useEffect(() => {
		setCurrentPage(1)
	}, [searchQuery])

	return (
		<div className='general-posts-presentor'>
			{!allowSearch ? null : (
				<div className='posts-presentor-search-container'>
					<input
						className='posts-presentor-search-input'
						type='text'
						placeholder='חיפוש'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			)}
			{loadingGet ? (
				<h2>טוען...</h2>
			) : errorGet ? (
				<h2>{errorGet.toString()}</h2>
			) : !currentPosts ? (
				<h2>לא נמצאו ${typeName}ים</h2>
			) : (
				<div className='presentor-posts-container'>
					{currentPosts.length === 0 ? (
						<h2>המאמרים לא נמצאו</h2>
					) : (
						currentPosts?.map((article, index) =>
							allowAdmin ? (
								<PostAdmin
									key={article.id}
									id={article.id}
									article={article}
									setRefresh={setNeedToReload}
								/>
							) : (
								<Post key={index} id={article.id} article={article} />
							)
						)
					)}
				</div>
			)}
			{!allowPages ? null : (
				<div className='posts-pagination-buttons'>
					{currentPage <= 1 ? null : (
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage <= 1}
							className='pagination-button'>
							עמוד הקודם
						</button>
					)}
					{!isNextPageAvailable() ? null : (
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={!isNextPageAvailable()}
							className='pagination-button'>
							עמוד הבא
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default PostsPresentor
