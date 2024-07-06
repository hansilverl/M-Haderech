import Post from '../Posts/Post'
import { useNavigate } from 'react-router-dom'
import usePostDelete from '../../hooks/usePostDelete'
import usePostUpdate from '../../hooks/usePostUpdate'
import { serverTimestamp } from 'firebase/firestore'

const PostAdmin = ({ id, post, setRefresh }) => {
	const { image, title, date, description, type, contentFile, published, datePublished } = post
	const { postDeleteHandler } = usePostDelete()
	const { postUpdate, postUpdateHandler } = usePostUpdate()

	const deletePostButton = () => {
		postDeleteHandler(id)
		if (setRefresh) setRefresh(true)
	}

	const togglePublished = async () => {
		const newPostPublished = published === null || published === undefined ? true : !published
		const newPost = { published: newPostPublished }
		if (newPostPublished && !datePublished) newPost['datePublished'] = serverTimestamp()

		await postUpdateHandler(id, newPost)
		setRefresh(true)
	}

	const navigate = useNavigate(`/edit/${id}`)
	const AdminBar = () => {
		return (
			<div className='admin-bar'>
				<button onClick={() => navigate(`/edit/${id}`)} className='admin-button'>
					ערוך
				</button>
				<button onClick={deletePostButton} className='admin-button'>
					מחק
				</button>
				{!published ? (
					<button onClick={togglePublished}>פרסם</button>
				) : (
					<button onClick={togglePublished}>בטל פרסום</button>
				)}
			</div>
		)
	}
	return (
		<div className='post-admin'>
			<Post
				id={id}
				image={image}
				title={title}
				date={date}
				description={description}
				type={type}
				contentFile={contentFile}
			/>
			<AdminBar id={id} />
		</div>
	)
}

export default PostAdmin
