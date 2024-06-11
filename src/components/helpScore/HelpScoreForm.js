// src/components/helpScore/HelpScoreForm.js
import React from 'react';
import useHelpScore from '../../hooks/useHelpScore';
import Question from './Question';
import './HelpScoreForm.css';

const HelpScoreForm = () => {
    const { questions, loading, error } = useHelpScore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="help-score-form">
            <h1>Help Score Form</h1>
            {questions.map((question, index) => (
                <Question key={index} question={question} />
            ))}
        </div>
    );
}

export default HelpScoreForm;
