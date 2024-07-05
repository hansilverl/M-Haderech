import Post from '../Posts/Post'
import { useNavigate } from 'react-router-dom'
import usePostDelete from '../../hooks/usePostDelete'

const PostAdmin = ({ id, image, title, date, description, type, contentFile }) => {
	const { deletePostHandler, loading, error } = usePostDelete(id)

	const navigate = useNavigate(`/edit/${id}`)
	const AdminBar = () => {
		return (
			<div className='admin-bar'>
				<button onClick={() => navigate(`/edit/${id}`)} className='admin-button'>
					ערוך
				</button>
				<button onClick={deletePostHandler} className='admin-button'>
					מחק
				</button>
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
