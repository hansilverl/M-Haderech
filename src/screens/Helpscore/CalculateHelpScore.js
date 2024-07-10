import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CalculateHelpScore.css';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useLogin } from '../../hooks/useLogin';
import useFirebaseErrorTranslation from '../../hooks/useFirebaseErrorTranslation';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CalculateHelpScore = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [score, setScore] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { user, loading: authLoading } = useAuthStatus();
    const { login, error: loginError } = useLogin();
    const translateErrorToHebrew = useFirebaseErrorTranslation();

    const scoreDescription = (score) => {
        if (score <= 19) {
            return "ללא\קל"
        } else if (score <= 32) {
            return "בינונית"
        } else {
            return "קשה"
        }
    }

    const calculateScore = (answers) => {
        let totalScore = 0;
        Object.values(answers).forEach(answer => {
            totalScore += parseInt(answer, 10);
        });
        return totalScore;
    };

    const getQuestions = async () => {
        const querySnapshot = await getDocs(collection(db, 'Questionnaire'));
        const questions = {};
        querySnapshot.forEach((doc) => {
            questions[doc.id] = doc.data();
        });
        return questions;
    };

    const saveHistory = useCallback(async () => {
        if (user) {
            try {
                const { answers } = location.state;
                const questions = await getQuestions();

                const responseData = Object.keys(answers).map(questionId => ({
                    question: questions[questionId].q,
                    selectedOption: answers[questionId],
                    score: questions[questionId][answers[questionId]]
                }));

                await addDoc(collection(db, 'QuestionnaireHistory'), {
                    userId: user.uid,
                    userEmail: user.email,
                    timestamp: serverTimestamp(),
                    responses: responseData,
                    totalScore: score,
                });
                setShowSuccessModal(true);
            } catch (error) {
                console.error('Error saving questionnaire: ', error);
            }
        } else {
            setShowLoginModal(true);
        }
    }, [user, location.state, score]);

    useEffect(() => {
        if (!location.state || !location.state.answers) {
            navigate('/helpscore');
            return;
        }

        const { answers } = location.state;
        const calculatedScore = calculateScore(answers);
        setScore(calculatedScore);
    }, [location, navigate]);

    useEffect(() => {
        if (user && showLoginModal) {
            setShowLoginModal(false);
            saveHistory();
        }
    }, [user, showLoginModal, saveHistory]);

    const handleLogin = async () => {
        if (!email || !password) {
            setFormError('יש למלא את כל השדות.');
            return;
        }

        try {
            await login(email, password);
        } catch (error) {
            setFormError(translateErrorToHebrew(error.code));
        }
    };

    if (score === null || authLoading) {
        return <div>טוען...</div>;
    }

    return (
        <div className="score-container unique-background">
            <h1>תודה על מילוי השאלון.</h1>
            <div className="score-result">
                <p>התוצאה שלך:</p>
                <div className="user-score">{score}</div>
            </div>
            <div className="score-description">
                <p>רמת היפרמזיס: {scoreDescription(score)}</p>
            </div>
            <div className="button-wrapper">
                <button onClick={saveHistory}>שמור</button>
                <button onClick={() => navigate('/helpscore')}>חזור לטופס</button>
            </div>

            <Modal
                isOpen={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
                contentLabel="Login Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>אנא התחבר כדי לשמור את הציון שלך</h2>
                <input
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="אימייל"
                    required
                    data-error-message="יש למלא אימייל."
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="סיסמה"
                    required
                    data-error-message="יש למלא סיסמה."
                />
                <div className="button-group">
                    <button onClick={handleLogin}>התחבר</button>
                    <button onClick={() => setShowLoginModal(false)} className="cancel-button">בטל</button>
                </div>
                {formError && <p className="error-message">{formError}</p>}
            </Modal>

            <Modal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
                contentLabel="Success Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>נשמר בהצלחה</h2>
                <div className="button-group">
                    <button onClick={() => navigate('/history')}>צפה בהיסטוריה</button>
                    <button onClick={() => navigate('/helpscore')} className="cancel-button">חזור לטופס</button>
                </div>
            </Modal>
        </div>
    );
};

export default CalculateHelpScore;
