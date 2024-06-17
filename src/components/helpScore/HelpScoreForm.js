// src/components/helpScore/HelpScoreForm.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useHelpScore from '../../hooks/useHelpScore'
import Question from './Question'
import './HelpScoreForm.css'

const HelpScoreForm = () => {
    const { questions, loading, error } = useHelpScore()
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [validationError, setValidationError] = useState(null)
    const navigate = useNavigate()

    const handleRadioChange = (questionId, selectedValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedValue,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Remove the 'req_question' class from all question containers
        const allQuestions = document.querySelectorAll('.q-container');
        allQuestions.forEach(questionElement => {
            questionElement.classList.remove('req_question');
        });
    
        // Check if all required questions have been answered
        const unansweredRequiredQuestions = questions.filter(question => question.required && !answers[question.id]);
        
        if (unansweredRequiredQuestions.length > 0) {   // If there are unanswered required questions
            unansweredRequiredQuestions.forEach(question => {
                const questionElement = document.getElementById(`question-${question.id}`).closest('.q-container');
                if (questionElement) {
                    questionElement.classList.add('req_question');
                }
            });
    
            setValidationError('אנא מלאי את כל הסעיפים המסומנים ב*');
            return;
        }
    
        // If all questions are answered, navigate to CalculateHelpScore
        setValidationError(null);
        setSubmitted(true);
        navigate('/calculateHelpScore', { state: { answers } })
    }
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <form onSubmit={handleSubmit} className="help-score-form">
            <div className="bordered-container">
                {questions.map((question) => (
                    <Question 
                        key={question.id} 
                        question={question} 
                        onRadioChange={(option) => handleRadioChange(question.id, option)}
                    />
                ))}
                <button type="submit">Submit</button>
                {validationError && <p className="error-message">{validationError}</p>}
            </div>
        </form>
    )
}

export default HelpScoreForm
