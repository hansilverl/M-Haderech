// src/screens/Helpscore/CalculateHelpScore.js
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CalculateHelpScore.css';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useLogin } from '../../hooks/useLogin';
import useFirebaseErrorTranslation from '../../hooks/useFirebaseErrorTranslation';
import Modal from 'react-modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

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
    const [resultRanges, setResultRanges] = useState([]);
    const { user, loading: authLoading } = useAuthStatus();
    const { login, error: loginError } = useLogin();
    const translateErrorToHebrew = useFirebaseErrorTranslation();

    const fetchResultRanges = async () => {
        const querySnapshot = await getDocs(collection(db, 'QuestionnaireRes'));
        const ranges = {};
        querySnapshot.forEach((doc) => {
            ranges[doc.id] = doc.data();
        });
        setResultRanges(ranges);
    };

    const getRangeDescription = (score) => {
        if (score <= 19) {
            return resultRanges['0-19'] || { title: '', desc: '' };
        } else if (score <= 32) {
            return resultRanges['20-32'] || { title: '', desc: '' };
        } else {
            return resultRanges['33+'] || { title: '', desc: '' };
        }
    };

    const calculateScore = (answers) => {
        let totalScore = 0;
        Object.values(answers).forEach(answer => {
            totalScore += parseInt(answer, 10); // the score is a string
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
                console.error('Error saving questionnaire:', error);
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
        fetchResultRanges();
    }, []);

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

    if (score === null || authLoading || resultRanges.length === 0) {
        return <LoadingSpinner />;
    }

    const { title, desc } = getRangeDescription(score);

    return (
        <div className="score-container unique-background">
            <h1>תודה על מילוי המבדק.</h1>
            <div className="score-result">
                <p>הניקוד שקיבלת:</p>
                <div className="user-score">{score}</div>
            </div>
            <div className="score-description">
                <p>רמת היפרמזיס: {title}</p>
            </div>
            <div className="info-score">
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{desc}</pre>
            </div>
            <div className="button-wrapper">
                <button onClick={saveHistory}>לשמור להשוואה</button>
                <button onClick={() => navigate('/helpscore')}>חזרה לטופס</button>
            </div>
            <button className="contact-calc-button" onClick={() => navigate('/contact')}>צרי קשר</button>
            <Modal
                isOpen={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
                contentLabel="Login Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>עדיין לא נרשמת? מחכים לך!</h2>
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
                    <button onClick={handleLogin}>התחברות</button>
                    <button onClick={() => setShowLoginModal(false)} className="cancel-button">ביטול</button>
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
                <h3>מחכים לך באזור האישי שלך כדי שתוכלי לעקוב ולהשוות נתונים</h3>
                <div className="button-group">
                    <button onClick={() => navigate('/history')}>צפיה בהיסטוריה</button>
                    <button onClick={() => navigate('/helpscore')} className="cancel-button">חזרה לטופס</button>
                </div>
            </Modal>
        </div>
    );
};

export default CalculateHelpScore;
