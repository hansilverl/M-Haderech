import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc, deleteField } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './QuestionnaireManagement.css';
import Modal from 'react-modal';
import { FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root'); // Adjust this selector to your app's root element

const QuestionnaireManagement = ({ questionnaireId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false);
  const [newQuestionModalIsOpen, setNewQuestionModalIsOpen] = useState(false);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newAnswerScore, setNewAnswerScore] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [currentScore, setCurrentScore] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionCollection = collection(db, 'Questionnaire');
        const questionSnapshot = await getDocs(questionCollection);
        const questionList = questionSnapshot.docs.map(questionDoc => {
          const data = questionDoc.data();
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
          };
        }).sort((a, b) => a.order - b.order); // Sort questions by order
        setQuestions(questionList);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId]);

  const handleFirestoreError = (error) => {
    console.error('Firebase error: ', error);
    alert('Firestore operation failed.');
  };

  const handleDeleteQuestion = async (questionId) => {
    setDeleteConfirmIsOpen(true);
    setSelectedQuestion(questionId);
  };

  const confirmDeleteQuestion = async () => {
    try {
      await deleteDoc(doc(db, 'Questionnaire', selectedQuestion));
      setQuestions(questions.filter(question => question.id !== selectedQuestion));
      setDeleteConfirmIsOpen(false);
      alert('Question deleted successfully.');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    setSelectedAnswer({ questionId, answerId });
    setDeleteConfirmIsOpen(true);
  };

  const confirmDeleteAnswer = async () => {
    const { questionId, answerId } = selectedAnswer;
    try {
      const questionDocRef = doc(db, 'Questionnaire', questionId);
      const questionDoc = await getDoc(questionDocRef);
      const questionData = questionDoc.data();

      // Remove the answer from the question data locally
      const updatedQuestionData = { ...questionData };
      delete updatedQuestionData[answerId];

      // Update the document in Firestore
      await updateDoc(questionDocRef, {
        [answerId]: deleteField()
      });

      // Update the local state
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === questionId
            ? {
                ...question,
                answers: question.answers.filter(answer => answer.id !== answerId)
              }
            : question
        )
      );

      setDeleteConfirmIsOpen(false);
      alert('Answer deleted successfully.');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleEditQuestion = (question) => {
    setCurrentText(question.question);
    setIsRequired(question.required || false);
    setSelectedQuestion(question.id);
    setSelectedAnswer(null); // Ensure no answer is selected
    setEditModalIsOpen(true);
  };

  const confirmEditQuestion = async () => {
    try {
      const questionDocRef = doc(db, 'Questionnaire', selectedQuestion);
      await updateDoc(questionDocRef, { q: currentText, required: isRequired });
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === selectedQuestion
            ? { ...question, question: currentText, required: isRequired }
            : question
        )
      );
      setEditModalIsOpen(false);
      alert('Question updated successfully.');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleEditAnswer = (question, answer) => {
    setSelectedQuestion(question);
    setCurrentText(answer.text);
    setCurrentScore(answer.id); // Set the current score based on the answer ID
    setSelectedAnswer({ questionId: question.id, answerId: answer.id });
    setEditModalIsOpen(true);
  };

  const confirmEditAnswer = async () => {
    const { questionId, answerId } = selectedAnswer;
    try {
      const questionDocRef = doc(db, 'Questionnaire', questionId);
      const questionDoc = await getDoc(questionDocRef);
      const questionData = questionDoc.data();

      // Check if the new score is different from the current score
      if (currentScore !== answerId) {
        // Create a new field with the new score
        await updateDoc(questionDocRef, { [currentScore]: currentText });

        // Delete the old field
        await updateDoc(questionDocRef, { [answerId]: deleteField() });
      } else {
        // Update the existing field's value
        await updateDoc(questionDocRef, { [answerId]: currentText });
      }

      // Fetch the updated document
      const updatedQuestionDoc = await getDoc(questionDocRef);
      const updatedQuestionData = updatedQuestionDoc.data();
      const updatedAnswers = Object.entries(updatedQuestionData)
        .filter(([key, value]) => key !== 'q' && key !== 'required')
        .map(([key, value]) => ({
          id: key,
          text: value,
          score: parseInt(key, 10),
        }));

      // Update the local state
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === questionId
            ? {
                ...question,
                question: updatedQuestionData.q,
                required: updatedQuestionData.required,
                answers: updatedAnswers,
              }
            : question
        )
      );

      setEditModalIsOpen(false);
      alert('Answer updated successfully.');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const openModal = (question) => {
    setSelectedQuestion(question);
    setEditModalIsOpen(true);
  };

  const closeModal = () => {
    setEditModalIsOpen(false);
    setSelectedQuestion(null);
  };

  const handleSaveAnswer = async (questionId) => {
    if (newAnswerText && newAnswerScore) {
      try {
        const questionDocRef = doc(db, 'Questionnaire', questionId);
        await updateDoc(questionDocRef, { [newAnswerScore]: newAnswerText });
        setQuestions(prevQuestions =>
          prevQuestions.map(question =>
            question.id === questionId
              ? {
                  ...question,
                  answers: [...question.answers, { id: newAnswerScore, text: newAnswerText, score: parseInt(newAnswerScore, 10) }]
                }
              : question
          )
        );
        setNewAnswerText('');
        setNewAnswerScore('');
        alert('Answer added successfully.');
      } catch (error) {
        handleFirestoreError(error);
      }
    }
  };

  const handleAddQuestion = () => {
    setNewQuestionModalIsOpen(true);
  };

  const closeNewQuestionModal = () => {
    setNewQuestionModalIsOpen(false);
    setNewQuestionText('');
    setIsRequired(false);
  };

  const saveNewQuestion = async () => {
    if (newQuestionText) {
      try {
        const questionCollection = collection(db, 'Questionnaire');
        const questionDocRef = doc(questionCollection); // Generate a new document reference
        await setDoc(questionDocRef, { q: newQuestionText, required: isRequired });
        const newQuestion = {
          id: questionDocRef.id,
          question: newQuestionText,
          required: isRequired,
          answers: []
        };
        setQuestions([...questions, newQuestion]);
        setNewQuestionText('');
        setIsRequired(false);
        setNewQuestionModalIsOpen(false);
        alert('Question added successfully.');
      } catch (error) {
        handleFirestoreError(error);
      }
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    try {
      const movedQuestions = Array.from(questions);
      const [movedItem] = movedQuestions.splice(source.index, 1);
      movedQuestions.splice(destination.index, 0, movedItem);

      // Update the order field in Firestore
      const batch = db.batch();
      movedQuestions.forEach(async (question, index) => {
        const questionDocRef = doc(db, 'Questionnaire', question.id);
        batch.update(questionDocRef, { order: index });
      });

      await batch.commit();
      setQuestions(movedQuestions);
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  return (
    <div className="questionnaire-management">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2>Questionnaire Management</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="questions-list">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="question-item"
                        >
                          <div className="question-content">
                            <span className="question-text">{question.question}</span>
                            <div className="question-actions">
                              <FaEdit className="edit-icon" onClick={() => handleEditQuestion(question)} />
                              <FaTrashAlt className="delete-icon" onClick={() => handleDeleteQuestion(question.id)} />
                            </div>
                          </div>
                          <ul className="answer-list">
                            {question.answers.map((answer) => (
                              <li key={answer.id} className="answer-item">
                                <span>{answer.text}</span>
                                <div className="answer-actions">
                                  <FaEdit className="edit-icon" onClick={() => handleEditAnswer(question, answer)} />
                                  <FaTrashAlt className="delete-icon" onClick={() => handleDeleteAnswer(question.id, answer.id)} />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <div className="add-question-section">
            <button onClick={handleAddQuestion}>Add Question</button>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="modal"
      >
        <h2>Edit {selectedQuestion ? 'Question' : 'Answer'}</h2>
        {selectedQuestion && (
          <div className="edit-form">
            <label htmlFor="questionText">Question Text:</label>
            <input
              type="text"
              id="questionText"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
            <div>
              <input
                type="checkbox"
                id="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
              <label htmlFor="isRequired">Required</label>
            </div>
            <button onClick={confirmEditQuestion}>Save</button>
          </div>
        )}
        {selectedAnswer && (
          <div className="edit-form">
            <label htmlFor="answerText">Answer Text:</label>
            <input
              type="text"
              id="answerText"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
            <label htmlFor="answerScore">Answer Score:</label>
            <input
              type="number"
              id="answerScore"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
            />
            <button onClick={confirmEditAnswer}>Save</button>
          </div>
        )}
        <button className="modal-close" onClick={closeModal}><FaTimes /></button>
      </Modal>

      <Modal
        isOpen={deleteConfirmIsOpen}
        onRequestClose={() => setDeleteConfirmIsOpen(false)}
        contentLabel="Delete Confirmation Modal"
        className="modal"
      >
        <h2>Are you sure you want to delete this {selectedQuestion ? 'question' : 'answer'}?</h2>
        <button onClick={selectedQuestion ? confirmDeleteQuestion : confirmDeleteAnswer}>Yes</button>
        <button onClick={() => setDeleteConfirmIsOpen(false)}>No</button>
        <button className="modal-close" onClick={() => setDeleteConfirmIsOpen(false)}><FaTimes /></button>
      </Modal>

      <Modal
        isOpen={newQuestionModalIsOpen}
        onRequestClose={closeNewQuestionModal}
        contentLabel="New Question Modal"
        className="modal"
      >
        <h2>Add New Question</h2>
        <div className="edit-form">
          <label htmlFor="newQuestionText">Question Text:</label>
          <input
            type="text"
            id="newQuestionText"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
          />
          <div>
            <input
              type="checkbox"
              id="newIsRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
            <label htmlFor="newIsRequired">Required</label>
          </div>
          <button onClick={saveNewQuestion}>Save</button>
        </div>
        <button className="modal-close" onClick={closeNewQuestionModal}><FaTimes /></button>
      </Modal>
    </div>
  );
};

export default QuestionnaireManagement;
