import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './QuestionnaireManagement.css';

const QuestionnaireManagement = ({ questionnaireId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionCollection = collection(db, 'questionnaires', questionnaireId, 'questions');
        const questionSnapshot = await getDocs(questionCollection);
        const questionList = await Promise.all(questionSnapshot.docs.map(async questionDoc => {
          const answersCollection = collection(db, 'questionnaires', questionnaireId, 'questions', questionDoc.id, 'answers');
          const answersSnapshot = await getDocs(answersCollection);
          const answersList = answersSnapshot.docs.map(answerDoc => ({
            id: answerDoc.id,
            ...answerDoc.data()
          }));
          return {
            id: questionDoc.id,
            ...questionDoc.data(),
            answers: answersList
          };
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
        await deleteDoc(doc(db, 'questionnaires', questionnaireId, 'questions', questionId));
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
        await deleteDoc(doc(db, 'questionnaires', questionnaireId, 'questions', questionId, 'answers', answerId));
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

  const handleEditQuestion = (questionId) => {
    const newQuestionText = prompt('הזן את הטקסט החדש של השאלה:');
    if (newQuestionText) {
      try {
        const questionDoc = doc(db, 'questionnaires', questionnaireId, 'questions', questionId);
        updateDoc(questionDoc, { question: newQuestionText });
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

  const handleEditAnswer = (questionId, answerId) => {
    const newAnswerText = prompt('הזן את הטקסט החדש של התשובה:');
    const newScore = parseInt(prompt('הזן את הניקוד החדש:'), 10);
    if (newAnswerText && !isNaN(newScore)) {
      try {
        const answerDoc = doc(db, 'questionnaires', questionnaireId, 'questions', questionId, 'answers', answerId);
        updateDoc(answerDoc, { text: newAnswerText, score: newScore });
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
            <button className="button edit-button" onClick={() => handleEditQuestion(question.id)}>עריכה</button>
            <button className="button delete-button" onClick={() => handleDeleteQuestion(question.id)}>מחיקה</button>
            <ul>
              {question.answers.map(answer => (
                <li key={answer.id}>
                  {answer.text} (ניקוד: {answer.score})
                  <div className="actions">
                    <button className="button edit-button" onClick={() => handleEditAnswer(question.id, answer.id)}>עריכה</button>
                    <button className="button delete-button" onClick={() => handleDeleteAnswer(question.id, answer.id)}>מחיקה</button>
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
