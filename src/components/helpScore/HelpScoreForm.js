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
        e.preventDefault()

        // Check if all required questions have been answered
        if (questions.some(question => question.required && !answers[question.id])) {
            // remodel and highlight the un-answered questions:
            const unAnsweredQuestions = questions.filter(question => question.required && !answers[question.id])

            setValidationError('Please answer all required questions.')
            return
        }

        // If all questions are answered, navigate to CalculateHelpScore
        setValidationError(null)
        setSubmitted(true)
        navigate('/calculate-score', { state: { answers } })
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
