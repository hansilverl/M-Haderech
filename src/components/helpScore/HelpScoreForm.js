// src/components/helpScore/HelpScoreForm.js
import React from 'react'
import useHelpScore from '../../hooks/useHelpScore'
import Question from './Question'
import './HelpScoreForm.css'


const HelpScoreForm = () => {
    const { questions, loading, error } = useHelpScore()

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

const descriptionQuestion = questions[0]
return (
    <div className="help-score-form">
        <Question question={descriptionQuestion} />
        <div>
            {questions.slice(1).map((question) => ( // Start from the second question
                <Question key={question.id} question={question} />
            ))}
        </div>
    </div>
)
}

export default HelpScoreForm
