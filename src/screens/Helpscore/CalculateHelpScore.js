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
            return "ללא\\קל"
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
            <h1>תודה על מילוי המבדק.</h1>
            <div className="score-result">
                <p> הניקוד שקיבלת:</p>
                <div className="user-score">{score}</div>
            </div>
            <div className="score-description">
                <p>רמת היפרמזיס: {scoreDescription(score)}</p>

            </div>
            <div className="info-score">
                <p>תיאור הציון: {scoreDescription(score)}</p>
                <p>
                    {score <= 19 && (
                        <>
                            ציון קל מסמן כי המטופלת חולה מאוד, אינה מסוגלת לאכול כמות נורמלית, ומתקשה לתפקד אך עשויה להיות מסוגלת לבצע חלק מהפעילויות. תמיכה וטיפול רפואי עשויים למנוע התקדמות לתסמינים חמורים יותר.
                        </>
                    )}
                    {score > 19 && score <= 32 && (
                        <>
                            ציון בינוני מסמן כי המטופלת אינה מסוגלת לאכול/לשתות באופן נורמלי או לבצע את רוב פעילויותיה הרגילות. היא עשויה להיות לא מסוגלת לטפל במשפחתה ואפילו בעצמה ולהזדקק למנוחה נוספת. סיבוכים המשפיעים הן על האם והן על הילד עלולים להתרחש אם לא מטופלים כראוי. ההתמודדות קשה וסביר להניח שנדרשת תמיכה בבריאות הנפש כדי להפחית טראומה. נדרשת התערבות אגרסיבית למקרים בינוניים עד חמורים, כולל תוספי ויטמינים, במיוחד B1.
                        </>
                    )}
                    {score > 32 && (
                        <>
                            ציון קשה מסמן כי החולה נמצא בסיכון הגבוה ביותר לסיבוכים חמורים לאם ולילד, במיוחד אם תת-תזונה נמשכת מעבר לטרימסטר הראשון. מנוחה היא קריטית כדי למנוע החמרה.
                        </>
                    )}
                </p>
            </div>
            <div className="button-wrapper">
                <button onClick={saveHistory}>לשמור להשוואה</button>
                <button onClick={() => navigate('/helpscore')}>חזרה לטופס</button>
            </div>
            <button className="contact-calc-button"
             onClick={() => navigate('./contact')}>צרי קשר</button>

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
                <h3>מחכים לך באיזור האישי שלך
                כדי שתוכלי לעקוב ולהשוות נתונים </h3>
                <div className="button-group">
                    <button onClick={() => navigate('/history')}>צפיה בהיסטוריה</button>
                    <button onClick={() => navigate('/helpscore')} className="cancel-button">חזרה לטופס</button>
                </div>
            </Modal>
        </div>
    );
};

export default CalculateHelpScore;
