import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc} from 'firebase/firestore';
import './QuestionnaireManagement.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const QuestionnaireManagement = ({ questionnaireId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionCollection = collection(db, 'Questionnaire');
        const questionSnapshot = await getDocs(questionCollection);
        const questionList = questionSnapshot.docs.map(questionDoc => ({
          id: questionDoc.id,
          question: questionDoc.data().q,
          answers: Object.entries(questionDoc.data())
            .filter(([key, value]) => key !== 'q' && key !== 'required')
            .map(([key, value]) => ({
              id: key,
              text: value,
              score: parseInt(key, 10),
            })),
        }));
        setQuestions(questionList);
        setLoading(false);
      } catch (err) {
        setError('נכשל לטעון את השאלות.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId]);

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את השאלה הזו?')) {
      try {
        await deleteDoc(doc(db, 'Questionnaire', questionId));
        setQuestions(questions.filter(question => question.id !== questionId));
        alert('השאלה נמחקה בהצלחה.');
      } catch (error) {
        console.error('שגיאה במחיקת השאלה: ', error);
        alert('שגיאה במחיקת השאלה.');
      }
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התשובה הזו?')) {
      try {
        const questionDoc = doc(db, 'Questionnaire', questionId);
        const questionData = (await getDoc(questionDoc)).data();
        delete questionData[answerId];
        await updateDoc(questionDoc, questionData);
        setQuestions(questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              answers: question.answers.filter(answer => answer.id !== answerId)
            };
          }
          return question;
        }));
        alert('התשובה נמחקה בהצלחה.');
      } catch (error) {
        console.error('שגיאה במחיקת התשובה: ', error);
        alert('שגיאה במחיקת התשובה.');
      }
    }
  };

  const handleEditQuestion = async (questionId) => {
    const newQuestionText = prompt('הזן את הטקסט החדש של השאלה:');
    if (newQuestionText) {
      try {
        const questionDoc = doc(db, 'Questionnaire', questionId);
        await updateDoc(questionDoc, { q: newQuestionText });
        setQuestions(questions.map(question => {
          if (question.id === questionId) {
            return { ...question, question: newQuestionText };
          }
          return question;
        }));
      } catch (error) {
        console.error('שגיאה בעריכת השאלה: ', error);
        alert('שגיאה בעריכת השאלה.');
      }
    }
  };

  const handleEditAnswer = async (questionId, answerId) => {
    const newAnswerText = prompt('הזן את הטקסט החדש של התשובה:');
    const newScore = parseInt(answerId, 10);
    if (newAnswerText) {
      try {
        const questionDoc = doc(db, 'Questionnaire', questionId);
        await updateDoc(questionDoc, { [answerId]: newAnswerText });
        setQuestions(questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              answers: question.answers.map(answer => {
                if (answer.id === answerId) {
                  return { ...answer, text: newAnswerText, score: newScore };
                }
                return answer;
              })
            };
          }
          return question;
        }));
      } catch (error) {
        console.error('שגיאה בעריכת התשובה: ', error);
        alert('שגיאה בעריכת התשובה.');
      }
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="questionnaire-management">
      <div className="question-list">
        {questions.map(question => (
          <div key={question.id} className="question-item">
            <h2>{question.question}</h2>
            <div className="actions">
              <FaEdit
                className="icon"
                title="ערוך שאלה"
                onClick={() => handleEditQuestion(question.id)}
              />
              <FaTrashAlt
                className="icon"
                title="מחק שאלה"
                onClick={() => handleDeleteQuestion(question.id)}
              />
            </div>
            <ul>
              {question.answers.map(answer => (
                <li key={answer.id}>
                  {answer.text} (ניקוד: {answer.score})
                  <div className="actions">
                    <button
                      className="button edit-button"
                      title="ערוך תשובה"
                      onClick={() => handleEditAnswer(question.id, answer.id)}
                    >
                      ערוך
                    </button>
                    <button
                      className="button delete-button"
                      title="מחק תשובה"
                      onClick={() => handleDeleteAnswer(question.id, answer.id)}
                    >
                      מחק
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireManagement;
