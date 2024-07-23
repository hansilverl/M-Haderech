import './PostsPresentor.css'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import Post from '../Posts/Post'
import PostAdmin from '../PostAdmin/PostAdmin'
import usePostsGet, { buildQuery } from '../../hooks/usePostsGet'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const DEFAULT_MAX_ROWS = 4
const PostsPresentor = (props) => {
	const {
		type,
		published,
		pageSize,
		allowAdmin,
		allowPages,
		allowSearch,
		maxRows = DEFAULT_MAX_ROWS,
	} = props

	const [currentPage, setCurrentPage] = useState(1)
	const [currentPosts, setCurrentPosts] = useState(null)
	const [needToReload, setNeedToReload] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredPosts, setFilteredPosts] = useState(null)
	const [maxPosts, setMaxPosts] = useState(pageSize ? pageSize : 1)

	const myQuery = buildQuery(type, published, pageSize)

	const { postsGet, loadingGet, errorGet, hasMore, reloadGet, loadMoreGet } = usePostsGet(myQuery)

	const typeName = type === 'post' ? 'מאמר' : 'אירוע'

	const isNextPageAvailable = () => {
		if (!filteredPosts) return false
		if (currentPage * maxPosts >= filteredPosts.length && !hasMore) return false
		return true
	}

	const adjustGridItems = () => {
		const container = document.querySelector('.presentor-posts-container')
		if (!container) return

		const styles = getComputedStyle(container)
		const containerWidthPx = styles.getPropertyValue('width').trim() // Get the full width including padding and borders
		const itemWidthPx = styles.getPropertyValue('--post-grid-width').trim() // Grid item width + gap (including any padding and border)
		const gapPx = styles.getPropertyValue('--post-grid-gap').trim()

		const containerWidth = parseInt(containerWidthPx)
		const itemWidth = parseInt(itemWidthPx)
		const gap = parseInt(gapPx)

		const itemsPerRow = Math.max(1, Math.floor(containerWidth / (itemWidth + gap + 2)))
		const maxItems = itemsPerRow * maxRows

		if (pageSize && pageSize < maxItems) setMaxPosts(pageSize)
		else setMaxPosts(maxItems)
	}

	useEffect(() => {
		window.addEventListener('resize', adjustGridItems)

		adjustGridItems()
		return () => {
			window.removeEventListener('resize', adjustGridItems)
		}
	}, [])

	useEffect(() => {
		if (!needToReload) return
		setNeedToReload(false)
		setCurrentPage(1)
		setCurrentPosts(null)
		reloadGet()
	}, [needToReload])

	useEffect(() => {
		if (loadingGet || !filteredPosts) return
		const pageStart = (currentPage - 1) * maxPosts
		const pageEnd = pageStart + maxPosts
		if (filteredPosts.length < pageEnd && hasMore) {
			loadMoreGet()
			return
		}
		setCurrentPosts(filteredPosts.slice(pageStart, pageEnd))
	}, [filteredPosts, currentPage, maxPosts])

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
			<div className='presentor-posts-container'>
				{loadingGet && <LoadingSpinner />}
				{errorGet && <p>שגיאה: {errorGet}</p>}
				{!currentPosts || (currentPosts.length === 0 && <h2>לא נמצאו {typeName}ים</h2>)}
				{currentPosts &&
					currentPosts.length > 0 &&
					currentPosts?.map((article) =>
						allowAdmin ? (
							<PostAdmin
								key={article.id}
								id={article.id}
								article={article}
								setRefresh={setNeedToReload}
							/>
						) : (
							<Post key={article.id} id={article.id} article={article} />
						)
					)}
			</div>
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
