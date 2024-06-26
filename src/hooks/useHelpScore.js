// src/hooks/useHelpScore.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const useHelpScore = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true); // Ensure loading state is true at the start of fetch
            try {
                const querySnapshot = await getDocs(collection(db, 'Questionnaire'));
                const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Include document ID if needed

                // Sort questions by numeric order of their IDs
                data.sort((a, b) => {
                    const idA = parseInt(a.id.replace('q', ''), 10);
                    const idB = parseInt(b.id.replace('q', ''), 10);
                    return idA - idB;
                });

                setQuestions(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions: ", error); // Log error for debugging
                setError(error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return { questions, loading, error };
};

export default useHelpScore;
