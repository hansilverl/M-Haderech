import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import './QuestionnaireManagement.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';

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
            answers: Object.entries(data)
              .filter(([key, value]) => key !== 'q' && key !== 'required')
              .map(([key, value]) => ({
                id: key,
                text: value,
                score: parseInt(key, 10),
              })),
          };
        });
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

      // Remove the answer from the question data
      delete questionData[answerId];

      // Update the document in Firestore
      await updateDoc(questionDocRef, questionData);

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
    setCurrentScore(answer.score);
    setSelectedAnswer({ questionId: question.id, answerId: answer.id });
    setEditModalIsOpen(true);
  };

  const confirmEditAnswer = async () => {
    const { questionId, answerId } = selectedAnswer;
    try {
      const questionDocRef = doc(db, 'Questionnaire', questionId);
      await updateDoc(questionDocRef, { [answerId]: currentText });
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === questionId
            ? {
                ...question,
                answers: question.answers.map(answer =>
                  answer.id === answerId
                    ? { ...answer, text: currentText, score: currentScore }
                    : answer
                )
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

  const confirmAddQuestion = async () => {
    try {
      const questionCollection = collection(db, 'Questionnaire');
      const questionSnapshot = await getDocs(questionCollection);
      const highestQuestionNumber = questionSnapshot.docs.reduce((max, doc) => {
        const docId = doc.id;
        const questionNumber = parseInt(docId.replace('q', ''), 10);
        return questionNumber > max ? questionNumber : max;
      }, 0);
      const newQuestionNumber = highestQuestionNumber + 1;
      const newQuestionDocId = `q${newQuestionNumber}`;
      const newQuestionDocRef = doc(db, 'Questionnaire', newQuestionDocId);
      await setDoc(newQuestionDocRef, { q: newQuestionText, required: isRequired });
      const newQuestion = {
        id: newQuestionDocId,
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
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="questionnaire-management">
      <button onClick={handleAddQuestion}>הוסף שאלה חדשה</button>
      <div className="spacer"></div>
      <div className="question-list">
        {questions.map(question => (
          <div key={question.id} className="question-item">
            <h2>{question.question}</h2>
            <div className="actions">
              <FaEdit
                className="icon"
                title="ערוך שאלה"
                onClick={() => handleEditQuestion(question)}
              />
              <FaTrashAlt
                className="icon"
                title="מחק שאלה"
                onClick={() => handleDeleteQuestion(question.id)}
              />
            </div>
            <button onClick={() => openModal(question)}>ערוך תשובות</button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {selectedQuestion && (
          <div className="modal-content">
            <h2>{selectedQuestion.question}</h2>
            <ul>
              {(selectedQuestion.answers || []).map(answer => (
                <li key={answer.id}>
                  {answer.text} (ניקוד: {answer.score})
                  <div className="actions">
                    <button
                      className="button edit-button"
                      title="ערוך תשובה"
                      onClick={() => handleEditAnswer(selectedQuestion, answer)}
                    >
                      ערוך
                    </button>
                    <button
                      className="button delete-button"
                      title="מחק תשובה"
                      onClick={() => handleDeleteAnswer(selectedQuestion.id, answer.id)}
                    >
                      מחק
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <h3>הוסף תשובה חדשה</h3>
            <input
              type="text"
              placeholder="טקסט התשובה"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
            />
            <input
              type="number"
              placeholder="ניקוד התשובה"
              value={newAnswerScore}
              onChange={(e) => setNewAnswerScore(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => handleSaveAnswer(selectedQuestion.id)}>שמור תשובה</button>
              <button onClick={closeModal}>סגור</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)}>
        <div className="modal-content">
          <h2>ערוך פרטים</h2>
          <input
            type="text"
            placeholder="טקסט"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
          />
          {selectedAnswer && (
            <input
              type="number"
              placeholder="ניקוד"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
            />
          )}
          {selectedQuestion && !selectedAnswer && (
            <div className="checkbox-container">
              <label>
                האם השאלה נדרשת
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
              </label>
            </div>
          )}
          <div className="modal-actions">
            <button onClick={selectedAnswer ? confirmEditAnswer : confirmEditQuestion}>שמור</button>
            <button onClick={() => setEditModalIsOpen(false)}>סגור</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteConfirmIsOpen} onRequestClose={() => setDeleteConfirmIsOpen(false)}>
        <div className="modal-content">
          <h2>אישור מחיקה</h2>
          <p>האם אתה בטוח שברצונך למחוק?</p>
          <div className="modal-actions">
            <button onClick={selectedAnswer ? confirmDeleteAnswer : confirmDeleteQuestion}>מחק</button>
            <button onClick={() => setDeleteConfirmIsOpen(false)}>בטל</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={newQuestionModalIsOpen} onRequestClose={() => setNewQuestionModalIsOpen(false)}>
        <div className="modal-content">
          <h2>הוסף שאלה חדשה</h2>
          <input
            type="text"
            placeholder="טקסט השאלה"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
          />
          <div className="checkbox-container">
            <label>
              האם השאלה נדרשת
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button onClick={confirmAddQuestion}>שמור</button>
            <button onClick={() => setNewQuestionModalIsOpen(false)}>סגור</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionnaireManagement;
