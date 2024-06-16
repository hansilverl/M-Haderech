// src/components/helpScore/CalculateHelpScore.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import calculateHelpScore from './calculateHelpScore';

const CalculateHelpScore = () => {
    const location = useLocation();
    const { answers } = location.state || {}; // Retrieve the passed state

    if (!answers) {
        return <div>No answers provided.</div>;
    }

    const score = calculateHelpScore(answers);

    return (
        <div>
            <h1>Your Help Score</h1>
            <p>Your calculated score is: {score}</p>
        </div>
    );
};

export default CalculateHelpScore;
