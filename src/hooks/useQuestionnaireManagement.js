// src/hooks/useQuestionnaireManagement.js
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const useQuestionnaireManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestionsAndDescription = async () => {
            setLoading(true); // Ensure loading state is true at the start of fetch
            try {
                // Fetch questions
                const querySnapshot = await getDocs(collection(db, 'Questionnaire'));
                const data = querySnapshot.docs
                    .filter(doc => doc.id !== 'description') // Filter out the description document
                    .map((doc) => ({ id: doc.id, ...doc.data() })); // Include document ID if needed

                // Sort questions by the numeric 'order' field
                data.sort((a, b) => a.order - b.order);

                setQuestions(data);

                // Fetch the description
                const descriptionDoc = await getDoc(doc(db, 'Questionnaire', 'description'));
                if (descriptionDoc.exists()) {
                    setDescription(descriptionDoc.data().text);
                } else {
                    setDescription(''); // Set a default or empty description if it doesn't exist
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions: ", error); // Log error for debugging
                setError(error);
                setLoading(false);
            }
        };

        fetchQuestionsAndDescription();
    }, []);

    return { questions, description, loading, error };
};

export default useQuestionnaireManagement;
