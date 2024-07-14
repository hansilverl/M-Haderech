// src/screens/AdminDashboard/QuestionnaireManagement.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc, deleteField } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './QuestionnaireManagement.css';
import Modal from 'react-modal';
import { FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
Modal.setAppElement('#root'); // Adjust this selector to your app's root element

const QuestionnaireManagement = ({ questionnaireId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newAnswerScore, setNewAnswerScore] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [currentScore, setCurrentScore] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false);
  const [addQuestionModalIsOpen, setAddQuestionModalIsOpen] = useState(false);

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
    setSelectedQuestion(questionId);
    setDeleteConfirmIsOpen(true);
  };

  const confirmDeleteQuestion = async () => {
    try {
      await deleteDoc(doc(db, 'Questionnaire', selectedQuestion));
      setQuestions(questions.filter(question => question.id !== selectedQuestion));
      setDeleteConfirmIsOpen(false);
      alert('השאלה נמחקה!');
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
      alert('התשובה נמחקה בהצלחה!');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleEditQuestion = (question) => {
    setCurrentText(question.question);
    setIsRequired(question.required || false);
    setSelectedQuestion(question);
    setModalIsOpen(true);
  };

  const handleAddAnswer = () => {
    if (newAnswerText && newAnswerScore) {
      const updatedAnswers = [
        ...selectedQuestion.answers,
        { id: newAnswerScore, text: newAnswerText, score: parseInt(newAnswerScore, 10) }
      ];
      const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers };
      setSelectedQuestion(updatedQuestion);
      setNewAnswerText('');
      setNewAnswerScore('');
    }
  };

  const handleEditAnswer = (answer) => {
    setCurrentText(answer.text);
    setCurrentScore(answer.id); // Set the current score based on the answer ID
    setSelectedAnswer(answer);
  };

  const saveQuestionChanges = async () => {
    const { id, question, required, answers } = selectedQuestion;
    try {
      const questionDocRef = doc(db, 'Questionnaire', id);
      const updatedAnswers = answers.reduce((acc, answer) => {
        acc[answer.id] = answer.text;
        return acc;
      }, {});

      await updateDoc(questionDocRef, { q: question, required, ...updatedAnswers });
      setQuestions(prevQuestions =>
        prevQuestions.map(q => (q.id === id ? { ...q, question, required, answers } : q))
      );
      setModalIsOpen(false);
      alert('השאלה עודכנה בהצלחה!');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value, checked, type } = e.target;
    const updatedQuestion = {
      ...selectedQuestion,
      [name]: type === 'checkbox' ? checked : value,
    };
    setSelectedQuestion(updatedQuestion);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    // Update the order in Firestore
    try {
      for (let i = 0; i < reorderedQuestions.length; i++) {
        const questionDocRef = doc(db, 'Questionnaire', reorderedQuestions[i].id);
        await updateDoc(questionDocRef, { order: i });
      }
      setQuestions(reorderedQuestions);
      alert('סדר השאלות עודכן בהצלחה!');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const handleAddQuestion = async () => {
    setAddQuestionModalIsOpen(true);
  };

  const saveNewQuestion = async () => {
    try {
      const newQuestionDocRef = doc(collection(db, 'Questionnaire'));
      await setDoc(newQuestionDocRef, {
        q: newQuestionText,
        required: isRequired,
        order: questions.length, // new question added to the end
      });

      const newQuestion = {
        id: newQuestionDocRef.id,
        question: newQuestionText,
        required: isRequired,
        order: questions.length,
        answers: [],
      };

      setQuestions([...questions, newQuestion]);
      setAddQuestionModalIsOpen(false);
      setNewQuestionText('');
      setIsRequired(false);
      alert('השאלה נוספה בהצלחה!');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  return (
    <div className="questionnaire-management">
      {loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="questions-container">
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        className="question"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="question-header">
                          <span>{index + 1}. {question.question}</span>
                          <button onClick={() => handleEditQuestion(question)}><FaEdit /></button>
                          <button onClick={() => handleDeleteQuestion(question.id)}><FaTrashAlt /></button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="add-question-button" onClick={handleAddQuestion}>הוספת שאלה</button>
        </DragDropContext>
      )}

      {/* Modal for Adding New Question */}
      <Modal isOpen={addQuestionModalIsOpen} onRequestClose={() => setAddQuestionModalIsOpen(false)} contentLabel="Add New Question">
        <h2>הוספת שאלה חדשה</h2>
        <form className="add-question-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveNewQuestion();
          }}>
          <div>
            <label htmlFor="newQuestionText">שאלה:</label>
            <input
              type="text"
              id="newQuestionText"
              name="newQuestionText"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              required
            />
          </div>
          <div className="required-checkbox">
            <label>
              <input
                type="checkbox"
                name="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
              שאלת חובה
            </label>
          </div>
          <button type="submit">Add</button>
          <button type="button" onClick={() => setAddQuestionModalIsOpen(false)}><FaTimes /> Close</button>
        </form>
      </Modal>

      {/* Modal for Editing Question */}
      {selectedQuestion && (
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Edit Question">
          <h2>Edit Question</h2>
          <form className="edit-question-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveQuestionChanges();
          }}>
            <div>
              <label htmlFor="question">שאלה:</label>
              <input
                type="text"
                id="question"
                name="question"
                value={selectedQuestion.question}
                onChange={handleQuestionChange}
              />
            </div>
            <div className="required-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="required"
                  checked={selectedQuestion.required}
                  onChange={handleQuestionChange}
                />
                חובה
              </label>
            </div>
            <h3>תשובות:</h3>
            <ul>
              {selectedQuestion.answers.map((answer, index) => (
                <li key={answer.id}>
                  {answer.text} (ניקוד: {answer.score})
                  <button type="button" onClick={() => handleEditAnswer(answer)}>עריכה</button>
                  <button type="button" onClick={() => handleDeleteAnswer(selectedQuestion.id, answer.id)}>מחיקה</button>
                </li>
              ))}
            </ul>
            <div>
              <input
                type="text"
                placeholder="תשובה"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
              />
              <input
                type="number"
                placeholder="ניקוד"
                value={newAnswerScore}
                onChange={(e) => setNewAnswerScore(e.target.value)}
              />
              <button type="button" onClick={handleAddAnswer}>הוספת תשובה</button>
            </div>
            <button type="submit" className="save-button" title="שמירה"> <FontAwesomeIcon icon={faFloppyDisk} /></button>
            <button type="button" onClick={() => setModalIsOpen(false)}><FaTimes /></button>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {deleteConfirmIsOpen && (
        <Modal isOpen={deleteConfirmIsOpen} onRequestClose={() => setDeleteConfirmIsOpen(false)} contentLabel="Confirm Delete">
          <h2>אישור מחיקה</h2>
          <p>האם את בטוחה שברצונך למחוק את השאלה?</p>
          <button onClick={confirmDeleteQuestion}>כן</button>
          <button onClick={() => setDeleteConfirmIsOpen(false)}>לא</button>
        </Modal>
      )}
    </div>
  );
};

export default QuestionnaireManagement;
