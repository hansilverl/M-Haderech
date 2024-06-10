// src/hooks/useQuestionnaireManagement.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const useQuestionnaireManagement = (questionnaireId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, 'questionnaires', questionnaireId, 'questions');
        const questionSnapshot = await getDocs(questionsCollection);
        const questionList = await Promise.all(
          questionSnapshot.docs.map(async (questionDoc) => {
            const answersCollection = collection(db, 'questionnaires', questionnaireId, 'questions', questionDoc.id, 'answers');
            const answerSnapshot = await getDocs(answersCollection);
            const answers = answerSnapshot.docs.map(answerDoc => ({ id: answerDoc.id, ...answerDoc.data() }));
            return { id: questionDoc.id, ...questionDoc.data(), answers };
          })
        );
        setQuestions(questionList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId]);

  const deleteQuestion = async (questionId) => {
    try {
      await deleteDoc(doc(db, 'questionnaires', questionnaireId, 'questions', questionId));
      setQuestions(questions.filter(question => question.id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(err.message);
    }
  };

  const deleteAnswer = async (questionId, answerId) => {
    try {
      await deleteDoc(doc(db, 'questionnaires', questionnaireId, 'questions', questionId, 'answers', answerId));
      setQuestions(questions.map(question => 
        question.id === questionId 
          ? { ...question, answers: question.answers.filter(answer => answer.id !== answerId) } 
          : question
      ));
    } catch (err) {
      console.error('Error deleting answer:', err);
      setError(err.message);
    }
  };

  const updateQuestion = async (questionId, updatedQuestion) => {
    try {
      const questionDoc = doc(db, 'questionnaires', questionnaireId, 'questions', questionId);
      await updateDoc(questionDoc, updatedQuestion);
      setQuestions(questions.map(question => 
        question.id === questionId 
          ? { ...question, ...updatedQuestion } 
          : question
      ));
    } catch (err) {
      console.error('Error updating question:', err);
      setError(err.message);
    }
  };

  const updateAnswer = async (questionId, answerId, updatedAnswer) => {
    try {
      const answerDoc = doc(db, 'questionnaires', questionnaireId, 'questions', questionId, 'answers', answerId);
      await updateDoc(answerDoc, updatedAnswer);
      setQuestions(questions.map(question => 
        question.id === questionId 
          ? { ...question, answers: question.answers.map(answer => 
              answer.id === answerId 
                ? { ...answer, ...updatedAnswer } 
                : answer
            ) } 
          : question
      ));
    } catch (err) {
      console.error('Error updating answer:', err);
      setError(err.message);
    }
  };

  return { questions, loading, error, deleteQuestion, deleteAnswer, updateQuestion, updateAnswer };
};

export default useQuestionnaireManagement;