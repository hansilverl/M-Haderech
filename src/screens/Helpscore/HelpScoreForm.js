// src/screens/Helpscore/HelpScoreForm.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useHelpScore from '../../hooks/useHelpScore';
import Question from '../../components/helpScore/Question';
import './HelpScoreForm.css';

const HelpScoreForm = () => {
    const { questions, description, loading, error } = useHelpScore();
    const [answers, setAnswers] = useState({});
    const [validationError, setValidationError] = useState(null);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();
    const errorMessageRef = useRef(null);

    const handleRadioChange = (questionId, selectedValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const allQuestions = document.querySelectorAll('.q-container');
        allQuestions.forEach(questionElement => {
            questionElement.classList.remove('req_question');
        });

        const unansweredRequiredQuestions = questions.filter(question => question.required && !answers[question.id]);

        if (unansweredRequiredQuestions.length > 0) {
            unansweredRequiredQuestions.forEach(question => {
                const questionElement = document.getElementById(`question-${question.id}`).closest('.q-container');
                if (questionElement) {
                    questionElement.classList.add('req_question');
                }
            });
            // validation error is in class component "requiredFieldsErrorMsg"
            setValidationError('כדי לקבל תוצאות, אי אפשר לדלג על השאלות המסומנות ב*');
            setShake(prev => !prev);
            if (errorMessageRef.current) {
                errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        setValidationError(null);
        navigate('/calculateHelpScore', { state: { answers } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="help-score-form">
            <div className="help-score-form-header">
            <h2> מבדק היפרמאזיס(HG) אישי 
            </h2>
            {description && <p className="questionnaire-description">{description}</p>}
            <div className="bordered-container">
                {questions.map((question) => (
                    <Question
                        key={question.id}
                        question={question}
                        onRadioChange={(option) => handleRadioChange(question.id, option)}
                    />
                ))}
                <button type="submit">שליחה</button>
                {validationError && <p key={shake} ref={errorMessageRef} className="requiredFieldsErrorMsg">{validationError}</p>}
            </div>
            </div>
        </form>
    );
};

export default HelpScoreForm;
