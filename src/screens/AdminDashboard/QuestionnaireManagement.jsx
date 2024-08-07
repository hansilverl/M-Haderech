import React, { useEffect, useState } from 'react'
import { db } from '../../firebase/config'
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	getDoc,
	setDoc,
	deleteField,
} from 'firebase/firestore'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import './QuestionnaireManagement.css'
import Modal from 'react-modal'
import { FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faBars } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import EditScoreDescModal from '../../components/helpScore/EditScoreDescModal'
import { Tooltip, TextField } from '@mui/material'

Modal.setAppElement('#root')

const ScoreTooltip = ({ children, error }) => (
	
	<Tooltip title="ניקוד זה כבר קיים. אנא בחרי ניקוד אחר." open={error}
	classes={{ tooltip: 'custom-tooltip' }}
>
		
		{children}
	</Tooltip>
)

const QuestionnaireManagement = ({ questionnaireId }) => {
	const [description, setDescription] = useState('')
	const [questions, setQuestions] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [selectedQuestion, setSelectedQuestion] = useState(null)
	const [selectedAnswer, setSelectedAnswer] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [newAnswerText, setNewAnswerText] = useState('')
	const [newAnswerScore, setNewAnswerScore] = useState('')
	const [currentText, setCurrentText] = useState('')
	const [currentScore, setCurrentScore] = useState('')
	const [newQuestionText, setNewQuestionText] = useState('')
	const [isRequired, setIsRequired] = useState(false)
	const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)
	const [addQuestionModalIsOpen, setAddQuestionModalIsOpen] = useState(false)
	const [editingAnswer, setEditingAnswer] = useState(null) // New state for editing answer
	const [showNewAnswerFields, setShowNewAnswerFields] = useState(false)
	const [editScoreDescModalIsOpen, setEditScoreDescModalIsOpen] = useState(false);

	// for loading icon:
	const [isReordering, setIsReordering] = useState(false)

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const questionCollection = collection(db, 'Questionnaire')
				const questionSnapshot = await getDocs(questionCollection)
				const questionList = questionSnapshot.docs
					.filter((questionDoc) => questionDoc.id.startsWith('q')) // Filter documents by id starting with 'q'
					.map((questionDoc) => {
						const data = questionDoc.data()
						return {
							id: questionDoc.id,
							question: data.q,
							required: data.required || false,
							order: data.order || 0,
							answers: Object.entries(data)
								.filter(([key, value]) => key !== 'q' && key !== 'required' && key !== 'order')
								.map(([key, value]) => ({
									id: key,
									text: value,
									score: parseInt(key, 10),
								})),
						}
					})
					.sort((a, b) => a.order - b.order) // Sort questions by order
				// Fetch the description
				const descriptionDoc = await getDoc(doc(db, 'Questionnaire', 'description'))
				const descriptionData = descriptionDoc.exists() ? descriptionDoc.data().text : ''
				setDescription(descriptionData)

				setQuestions(questionList)
				setLoading(false)
			} catch (err) {
				setError('Failed to load questions.')
				setLoading(false)
			}
		}

		fetchQuestions()
	}, [questionnaireId])

	const handleFirestoreError = (error) => {
		console.error('Firebase error: ', error)
		alert('Firestore operation failed.')
	}

	const handleDeleteQuestion = async (question) => {
		setSelectedQuestion(question)
		setDeleteConfirmIsOpen(true)
	}

	const confirmDeleteQuestion = async () => {
		try {
			if (!selectedQuestion || !selectedQuestion.id) {
				throw new Error('Selected question is not valid.')
			}
			await deleteDoc(doc(db, 'Questionnaire', selectedQuestion.id))
			setQuestions(questions.filter((question) => question.id !== selectedQuestion.id))
			setDeleteConfirmIsOpen(false)
			setSelectedQuestion(null) // Clear the selectedQuestion state
			alert('השאלה נמחקה!')
		} catch (error) {
			handleFirestoreError(error)
		}
	}

	const handleDeleteAnswer = async (questionId, answerId) => {
		setSelectedAnswer({ questionId, answerId })
		setDeleteConfirmIsOpen(true)
	}

	const confirmDeleteAnswer = async () => {
		const { questionId, answerId } = selectedAnswer
		try {
			const questionDocRef = doc(db, 'Questionnaire', questionId)
			const questionDoc = await getDoc(questionDocRef)
			const questionData = questionDoc.data()

			// Remove the answer from the question data locally
			const updatedQuestionData = { ...questionData }
			delete updatedQuestionData[answerId]

			// Update the document in Firestore
			await updateDoc(questionDocRef, {
				[answerId]: deleteField(),
			})

			// Update the local state
			setQuestions((prevQuestions) =>
				prevQuestions.map((question) =>
					question.id === questionId
						? {
							...question,
							answers: question.answers.filter((answer) => answer.id !== answerId),
						}
						: question
				)
			)

			// Update the selectedQuestion object's answers array
			setSelectedQuestion((prevQuestion) => ({
				...prevQuestion,
				answers: prevQuestion.answers.filter((answer) => answer.id !== answerId),
			}))

			setDeleteConfirmIsOpen(false)
			setSelectedAnswer(null) // Clear the selectedAnswer state
			alert('התשובה נמחקה בהצלחה!')
		} catch (error) {
			handleFirestoreError(error)
		}
	}

	const handleEditQuestion = (question) => {
		setCurrentText(question.question)
		setIsRequired(question.required || false)
		setSelectedQuestion(question)
		setModalIsOpen(true)
	}

	const checkDuplicateScore = (score, answers) => {
		return answers.some((answer) => answer.score === parseInt(score, 10))
	}

	const handleAddAnswer = async () => {
		if (newAnswerText && newAnswerScore) {
			const score = parseInt(newAnswerScore, 10)
			const scoreExists = checkDuplicateScore(score, selectedQuestion.answers)

			if (scoreExists) {
				return
			}

			const updatedAnswers = [
				...selectedQuestion.answers,
				{ id: newAnswerScore, text: newAnswerText, score: score },
			]

			// Sort the updatedAnswers array by score
			updatedAnswers.sort((a, b) => a.score - b.score)

			const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers }
			setSelectedQuestion(updatedQuestion)

			// Update Firebase
			// check if we need to update(if any changes were made)
			if (JSON.stringify(selectedQuestion.answers) !== JSON.stringify(updatedAnswers)) {

				try {
					const questionDocRef = doc(db, 'Questionnaire', selectedQuestion.id)
					await updateDoc(questionDocRef, {
						[newAnswerScore]: newAnswerText,
					})

					// Reset the input fields
					setNewAnswerText('')
					setNewAnswerScore('')
				} catch (error) {
					handleFirestoreError(error)
				}
			}

		}
	}

	const handleEditAnswer = (answer) => {
		setEditingAnswer(answer)
		setCurrentText(answer.text)
		setCurrentScore(answer.score)
	}

	const saveEditedAnswer = async () => {
		// const previousScore = editingAnswer.score;
		const updatedAnswers = selectedQuestion.answers.map((answer) =>
			answer.id === editingAnswer.id
				? { ...answer, text: currentText, score: parseInt(currentScore, 10) }
				: answer
		);

		// Check for duplicate scores
		const scoreExists = checkDuplicateScore(currentScore, updatedAnswers.filter(a => a.id !== editingAnswer.id))
		if (scoreExists) {
			// don't save the answer, show an error message
			return
			
		}

		// Sort the updatedAnswers array by score
		updatedAnswers.sort((a, b) => a.score - b.score);

		const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers };
		setSelectedQuestion(updatedQuestion);
		setEditingAnswer(null);

		// Update Firebase
		// check if we need to update(if any changes were made)
		if (JSON.stringify(selectedQuestion.answers) !== JSON.stringify(updatedAnswers)) {
			try {
				const questionDocRef = doc(db, 'Questionnaire', selectedQuestion.id);
				const questionDoc = await getDoc(questionDocRef);
				const questionData = questionDoc.data();

				// Remove the old answer
				await updateDoc(questionDocRef, {
					[editingAnswer.id]: deleteField(),
				});

				// Add the updated answer with the new score as the key
				await updateDoc(questionDocRef, {
					[currentScore]: currentText,
				});

			} catch (error) {
				handleFirestoreError(error);
			}
		}
	};

	const saveQuestionChanges = async () => {
		const { id, question, required, answers } = selectedQuestion
		try {
			const questionDocRef = doc(db, 'Questionnaire', id)
			const updatedAnswers = answers.reduce((acc, answer) => {
				acc[answer.score.toString()] = answer.text
				return acc
			}, {})

			await updateDoc(questionDocRef, { q: question, required, ...updatedAnswers })
			setQuestions((prevQuestions) =>
				prevQuestions.map((q) => (q.id === id ? { ...q, question, required, answers } : q))
			)
			setModalIsOpen(false)
			resetInputFields()
			alert('השאלה עודכנה בהצלחה!')
		} catch (error) {
			handleFirestoreError(error)
		}
	}

	const resetInputFields = () => {
		setNewAnswerText('')
		setNewAnswerScore('')
		setEditingAnswer(null)
		setCurrentText('')
		setCurrentScore('')
		setShowNewAnswerFields(false)
	}

	const handleQuestionChange = (e) => {
		const { name, value, checked, type } = e.target
		const updatedQuestion = {
			...selectedQuestion,
			[name]: type === 'checkbox' ? checked : value,
		}
		setSelectedQuestion(updatedQuestion)
	}

	const handleAnswerChange = (e) => {
		const { name, value } = e.target
		if (name === 'answerText') {
			setCurrentText(value)
		} else if (name === 'answerScore') {
			setCurrentScore(value)
		}
	}

	const onDragEnd = async (result) => {
		if (!result.destination) return
		const reorderedQuestions = Array.from(questions)
		const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1)
		reorderedQuestions.splice(result.destination.index, 0, movedQuestion)

		// Check if the order has been changed
		const orderChanged = JSON.stringify(questions) !== JSON.stringify(reorderedQuestions)
		const lastQuestionsOrder = questions
		setQuestions(reorderedQuestions)

		// Update the order in Firestore
		try {
			for (let i = 0; i < reorderedQuestions.length; i++) {
				const questionDocRef = doc(db, 'Questionnaire', reorderedQuestions[i].id)
				await updateDoc(questionDocRef, { order: i })
			}
			// setQuestions(reorderedQuestions);
			if (orderChanged) {
				alert('סדר השאלות עודכן בהצלחה!')
			}
		} catch (error) {
			handleFirestoreError(error)
			setQuestions(lastQuestionsOrder)
		}
	}

	const handleAddQuestion = async () => {
		setNewQuestionText('') // Reset the newQuestionText state
		setAddQuestionModalIsOpen(true)
	}

	const saveNewQuestion = async () => {
		try {
			// Fetch the last used number from the Firestore database
			const questionCollection = collection(db, 'Questionnaire')
			const questionSnapshot = await getDocs(questionCollection)
			const lastQuestion = questionSnapshot.docs
				.map((questionDoc) => ({ id: questionDoc.id, order: questionDoc.data().order }))
				.sort((a, b) => b.order - a.order)[0]

			const lastUsedNumber = lastQuestion ? parseInt(lastQuestion.id.replace('q', ''), 10) : 0
			const newQuestionNumber = lastUsedNumber + 1

			// Create a new document with the incremented number
			const newQuestionDocRef = doc(collection(db, 'Questionnaire'), `q${newQuestionNumber}`)
			await setDoc(newQuestionDocRef, {
				q: newQuestionText,
				required: isRequired,
				order: questions.length, // new question added to the end
			})

			const newQuestion = {
				id: newQuestionDocRef.id,
				question: newQuestionText,
				required: isRequired,
				order: questions.length,
				answers: [],
			}

			setQuestions([...questions, newQuestion])
			setAddQuestionModalIsOpen(false)
			resetInputFields() // Reset the input fields
			alert('השאלה נוספה בהצלחה!')
		} catch (error) {
			handleFirestoreError(error)
		}
	}

	// Description editing functions
	const handleDescriptionChange = (e) => {
		setDescription(e.target.value)
	}

	const saveDescription = async () => {
		try {
			const descriptionDocRef = doc(db, 'Questionnaire', 'description')
			await setDoc(descriptionDocRef, { text: description })
			alert('התיאור עודכן בהצלחה!')
		} catch (error) {
			handleFirestoreError(error)
		}
	}

	return (
		<div className='questionnaire-management'>
			{loading && <LoadingSpinner />}
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					<h1>ניהול שאלון</h1>
					<div className='description-section'>
						<h3>תיאור:</h3>
						<div className='description-actions'>
							<textarea
								className='description-textarea'
								value={description}
								onChange={handleDescriptionChange}
								rows='2'
								cols='50'
							/>
							<button className='save-description' onClick={saveDescription}>
								עדכון
							</button>
						</div>
					</div>
					<br />
					<h4>שימי לב! ניתן לגרור את השאלה כדי לשנות את הסדר</h4>
					{loading && <LoadingSpinner />}
					{error && <p>שגיאה: {error}</p>}
					{!loading && !error && (
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId='questions'>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='questions-container'>
										{questions.map((question, index) => (
											<Draggable key={question.id} draggableId={question.id} index={index}>
												{(provided) => (
													<div
														className='question'
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}>
														<div className='question-header'>
															<span>
																{index + 1}. {question.question}
															</span>
															<button onClick={() => handleEditQuestion(question)}>
																<FaEdit style={{ color: 'black' }} />
															</button>
															<button onClick={() => handleDeleteQuestion(question)}>
																<FaTrashAlt style={{ color: 'black' }} />
															</button>
														</div>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
										{isReordering && <FontAwesomeIcon icon={faBars} style={{ color: 'black' }} />}
									</div>
								)}
							</Droppable>
							<button className='add-question-button' onClick={handleAddQuestion}>
								הוספת שאלה
							</button>
							<button className='edit-score-desc-button'
								onClick={() => setEditScoreDescModalIsOpen(true)}>
								עריכת תיאורי תוצאות המבדק
							</button>

						</DragDropContext>
					)}

					{/* Modal for Adding New Question */}
					<Modal
						isOpen={addQuestionModalIsOpen}
						onRequestClose={() => {
							setAddQuestionModalIsOpen(false)
							resetInputFields()
						}}
						contentLabel='Add New Question'>
						<button
							className='close-button'
							onClick={() => {
								setAddQuestionModalIsOpen(false)
								resetInputFields()
							}}>
							<FaTimes />
						</button>
						<div className='add-checkbox'>
							<h2>הוספת שאלה חדשה</h2>
							<div className='required-checkbox-add'>
								<label>
									<input
										type='checkbox'
										name='isRequired'
										checked={isRequired}
										onChange={(e) => setIsRequired(e.target.checked)}
									/>
									שאלת חובה
								</label>
							</div>
						</div>
						<form
							className='add-question-form'
							onSubmit={(e) => {
								e.preventDefault()
								saveNewQuestion()
							}}>
							<div>
								<label htmlFor='newQuestionText'>שאלה: </label>
								<input
									type='text'
									id='newQuestionText'
									name='newQuestionText'
									value={newQuestionText}
									onChange={(e) => setNewQuestionText(e.target.value)}
									required
								/>
							</div>
							<button type='submit' className='submit-add-question'>
								הוספה
							</button>
							{/* <button type="button" onClick={() => { setAddQuestionModalIsOpen(false); resetInputFields(); }}><FaTimes /> Close</button> */}
						</form>
					</Modal>
					{/* Modal for Editing Question */}
					{selectedQuestion && (
						<Modal
							isOpen={modalIsOpen}
							onRequestClose={() => {
								setModalIsOpen(false)
								resetInputFields()
							}}
							contentLabel='Edit Question'>
							<button
								className='close-button'
								onClick={() => {
									setModalIsOpen(false)
									resetInputFields()
								}}>
								<FaTimes />
							</button>
							<h2> עריכת שאלה</h2>
							<form
								className='edit-question-form'
								onSubmit={(e) => {
									e.preventDefault()
									saveQuestionChanges()
								}}>
								<div>
									<label htmlFor='question'>שאלה: </label>
									<input
										className='question-input'
										type='text'
										id='question'
										name='question'
										value={selectedQuestion.question}
										onChange={handleQuestionChange}
									/>
									<div className='required-checkbox'>
										<label>
											<input
												type='checkbox'
												name='required'
												checked={selectedQuestion.required}
												onChange={handleQuestionChange}
											/>
											חובה
										</label>
									</div>
								</div>
								<div className='answers-section'>
									<h3>תשובות:</h3>
									<div className='answers-table-wrapper'>
										<div className='answers-table-container'>
											<table className='answers-table'>
												<tbody>
													{selectedQuestion.answers.map((answer) => (
														<tr key={answer.id} className='edit-answer-row'>
															<td>
																{editingAnswer && editingAnswer.id === answer.id ? (
																	<input
																		type='text'
																		name='answerText'
																		value={currentText}
																		onChange={handleAnswerChange}
																	/>
																) : (
																	<>{answer.text}</>
																)}
															</td>
															<td>
																{editingAnswer && editingAnswer.id === answer.id ? (
																	<ScoreTooltip error={checkDuplicateScore(currentScore, selectedQuestion.answers.filter(a => a.id !== editingAnswer.id))}>
																		<TextField
																			type='number'
																			name='answerScore'
																			value={currentScore}
																			onChange={handleAnswerChange}
																			error={checkDuplicateScore(currentScore, selectedQuestion.answers.filter(a => a.id !== editingAnswer.id))}
																		/>
																	</ScoreTooltip>
																) : (
																	<>ניקוד: {answer.score}</>
																)}
															</td>
															<td>
																{editingAnswer && editingAnswer.id === answer.id ? (
																	<div className='edit-answer-buttons'>
																		<button
																			type='button'
																			className='save-answer'
																			onClick={saveEditedAnswer}>
																			שמירה
																		</button>
																	</div>
																) : (
																	<>
																		<button
																			type='button'
																			className='editButton'
																			onClick={() => handleEditAnswer(answer)}>
																			{' '}
																			<FaEdit style={{ color: 'black' }} />
																		</button>
																		<button
																			type='button'
																			className='trashButton'
																			onClick={() =>
																				handleDeleteAnswer(selectedQuestion.id, answer.id)
																			}>
																			{' '}
																			<FaTrashAlt style={{ color: 'black' }} />
																		</button>
																	</>
																)}
															</td>
														</tr>
													))}
													<tr className='new-answer-row'>
														<td>
															<input
																type='text'
																placeholder='תשובה'
																value={newAnswerText}
																onChange={(e) => setNewAnswerText(e.target.value)}
															/>
														</td>
														<td>
															<ScoreTooltip error={checkDuplicateScore(newAnswerScore, selectedQuestion.answers)}>
																<TextField
																	type='number'
																	placeholder='ניקוד'
																	value={newAnswerScore}
																	onChange={(e) => setNewAnswerScore(e.target.value)}
																	error={checkDuplicateScore(newAnswerScore, selectedQuestion.answers)}
																/>
															</ScoreTooltip>
														</td>
														<td>
															<button
																type='button'
																className='add-answer-button'
																onClick={handleAddAnswer}>
																הוספת תשובה
															</button>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<h5></h5>
								</div>
								<div>
									<button type='submit' className='save-button' title='שמירה'>
										{' '}
										שמירת שינויים <FontAwesomeIcon icon={faFloppyDisk} />
									</button>
								</div>
							</form>
						</Modal>
					)}

					{/* Confirm Delete Modal */}
					{deleteConfirmIsOpen && (
						<Modal
							isOpen={deleteConfirmIsOpen}
							onRequestClose={() => setDeleteConfirmIsOpen(false)}
							contentLabel='Confirm Delete'>
							<button className='close-button' onClick={() => setDeleteConfirmIsOpen(false)}>
								<FaTimes />
							</button>
							<h2>אישור מחיקה</h2>
							<div className='delete-confirm-content'>
								{selectedAnswer ? (
									<>
										<p>האם את בטוחה שברצונך למחוק את התשובה?</p>

										<button className='delete-button' onClick={confirmDeleteAnswer}>
											כן
										</button>
									</>
								) : (
									<>
										<p>האם את בטוחה שברצונך למחוק את השאלה?</p>
										<button className='delete-button' onClick={confirmDeleteQuestion}>
											כן
										</button>
									</>
								)}
								<button className='cancel-button' onClick={() => setDeleteConfirmIsOpen(false)}>
									לא
								</button>
							</div>
						</Modal>
					)}
					<EditScoreDescModal
						isOpen={editScoreDescModalIsOpen}
						onRequestClose={() => setEditScoreDescModalIsOpen(false)}

					/>

				</>
			)}
		</div>
	)
}

export default QuestionnaireManagement
