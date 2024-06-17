// src/components/helpScore/CalculateHelpScore.js
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './CalculateHelpScore.css'

const CalculateHelpScore = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [score, setScore] = useState(null)

    useEffect(() => {
        if (!location.state || !location.state.answers) {
            // If there are no answers in the state, navigate back to the form
            navigate('/help-score-form')
            return
        }

        const { answers } = location.state

        // Calculate the score based on the answers
        const calculatedScore = calculateScore(answers)
        setScore(calculatedScore)
    }, [location, navigate])

    const calculateScore = (answers) => {
        // Example scoring logic
        // Assign points based on answer values (this should be customized based on your specific scoring logic)
        let totalScore = 0
        Object.values(answers).forEach(answer => {
            totalScore += parseInt(answer, 10) // assuming the answers are numeric
        })
        return totalScore
    }

    if (score === null) {
        return <div>Calculating...</div>
    }

    return (
        <div className="score-container">
            <h1>Your Help Score</h1>
            <p>Your score is: {score}</p>
            <button onClick={() => navigate('/help-score-form')}>Back to Form</button>
        </div>
    )
}

export default CalculateHelpScore
