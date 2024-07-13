// src/screens/AdminDashboard/QuestionnaireManagement.jsx
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        setError('נכשל לטעון את השאלות.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId]);

  const handleFirestoreError = (error) => {
    console.error('Firebase error: ', error);
    alert('שגיאה בפעולת Firestore.');
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
      alert('השאלה נמחקה בהצלחה.');
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
      alert('התשובה נמחקה בהצלחה.');
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
      alert('השאלה עודכנה בהצלחה.');
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
      alert('התשובה עודכנה בהצלחה.');
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const openModal = (question) => {
    setSelectedQuestion(question);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        alert('התשובה נוספה בהצלחה.');
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
        alert('השאלה נוספה בהצלחה.');
      } catch (error) {
        handleFirestoreError(error);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
  
    // Compare the current order with the new order
    const isOrderChanged = JSON.stringify(questions.map(q => q.id)) !== JSON.stringify(reorderedQuestions.map(q => q.id));
  
    // Update the order in Firestore and display the notification if the order is changed
    if (isOrderChanged) {
      try {
        for (let i = 0; i < reorderedQuestions.length; i++) {
          const questionDocRef = doc(db, 'Questionnaire', reorderedQuestions[i].id);
          await updateDoc(questionDocRef, { order: i });
        }
        setQuestions(reorderedQuestions);
        alert('סדר השאלות עודכן בהצלחה.');
      } catch (error) {
        handleFirestoreError(error);
      }
    }
  };
  

  return (
    <div className="questionnaire-management">
      {loading ? (
        <p>טוען שאלות...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        className="question"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h3>
                          {index + 1}. {question.question} (חובה: {question.required ? 'כן' : 'לא'})
                          <button onClick={() => handleEditQuestion(question)}><FaEdit /></button>
                          <button onClick={() => handleDeleteQuestion(question.id)}><FaTrashAlt /></button>
                        </h3>
                        <ul>
                          {question.answers.map(answer => (
                            <li key={answer.id}>
                              תשובה: {answer.text}, ניקוד: {answer.score}
                              <button onClick={() => handleEditAnswer(question, answer)}><FaEdit /></button>
                              <button onClick={() => handleDeleteAnswer(question.id, answer.id)}><FaTrashAlt /></button>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => openModal(question)}>הוסף תשובה</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <button onClick={handleAddQuestion}>הוסף שאלה חדשה</button>

      {/* Modal for Adding Answer */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Add Answer">
        <h2>הוסף תשובה לשאלה</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveAnswer(selectedQuestion.id);
        }}>
          <div>
            <label htmlFor="answerText">תשובה:</label>
            <input
              type="text"
              id="answerText"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="answerScore">ניקוד:</label>
            <input
              type="number"
              id="answerScore"
              value={newAnswerScore}
              onChange={(e) => setNewAnswerScore(e.target.value)}
            />
          </div>
          <button type="submit">שמור</button>
          <button type="button" onClick={closeModal}><FaTimes /></button>
        </form>
      </Modal>

      {/* Modal for Editing Question or Answer */}
      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} contentLabel="Edit">
        <h2>{selectedAnswer ? 'ערוך תשובה' : 'ערוך שאלה'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          selectedAnswer ? confirmEditAnswer() : confirmEditQuestion();
        }}>
          <div>
            <label htmlFor="editText">{selectedAnswer ? 'תשובה:' : 'שאלה:'}</label>
            <input
              type="text"
              id="editText"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
          </div>
          {selectedAnswer && (
            <div>
              <label htmlFor="editScore">ניקוד:</label>
              <input
                type="number"
                id="editScore"
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
              />
            </div>
          )}
          {!selectedAnswer && (
            <div>
              <label htmlFor="isRequired">חובה:</label>
              <input
                type="checkbox"
                id="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            </div>
          )}
          <button type="submit">שמור</button>
          <button type="button" onClick={() => setEditModalIsOpen(false)}><FaTimes /></button>
        </form>
      </Modal>

      {/* Modal for Confirm Delete */}
      <Modal isOpen={deleteConfirmIsOpen} onRequestClose={() => setDeleteConfirmIsOpen(false)} contentLabel="Confirm Delete">
        <h2>אישור מחיקה</h2>
        <p>האם אתה בטוח שברצונך למחוק?</p>
        <button onClick={selectedAnswer ? confirmDeleteAnswer : confirmDeleteQuestion}>מחק</button>
        <button onClick={() => setDeleteConfirmIsOpen(false)}><FaTimes /></button>
      </Modal>

      {/* Modal for Adding New Question */}
      <Modal isOpen={newQuestionModalIsOpen} onRequestClose={closeNewQuestionModal} contentLabel="Add New Question">
        <h2>הוסף שאלה חדשה</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          saveNewQuestion();
        }}>
          <div>
            <label htmlFor="newQuestionText">שאלה:</label>
            <input
              type="text"
              id="newQuestionText"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="isRequired">חובה:</label>
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
          </div>
          <button type="submit">שמור</button>
          <button type="button" onClick={closeNewQuestionModal}><FaTimes /></button>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionnaireManagement;
