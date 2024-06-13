import React, { useState } from 'react';
import useHelpScore from '../../hooks/useHelpScore';
import Question from './Question';
import './HelpScoreForm.css';

const HelpScoreForm = () => {
    const { questions, loading, error } = useHelpScore();
    const [answers, setAnswers] = useState({}); // Assuming answers are stored as an object

    const handleRadioChange = (questionId, selectedValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedValue,
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const descriptionQuestion = questions[0];
    return (
        <div className="help-score-form">
            <div className="bordered-container">
                <Question question={descriptionQuestion} onRadioChange={handleRadioChange} />
                <div>
                    {questions.slice(1).map((question) => (
                        <Question key={question.id} question={question} onRadioChange={handleRadioChange} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpScoreForm;