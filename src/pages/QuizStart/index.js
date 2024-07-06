import './quizStart.css'

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiHelpCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';

import { db } from '../../services/firebaseConnection';
import { collection, getDoc, doc, updateDoc } from 'firebase/firestore';

import { useParams, Link } from "react-router-dom";



export default function QuizStart({ conteudo }) {

    const listRef = collection(db, 'quizzes');

    const { id } = useParams();
    const [quiz, setQuiz] = useState([]);

    useEffect(() => {

        async function loadQuiz() {

            const docRef = doc(db, 'quizzes', id);
            const docSnap = await getDoc(docRef);
            setQuiz({
                id: docSnap.id,
                ...docSnap.data()
            });

        };

        loadQuiz();

    }, [])

    async function handleAddAcess() {

        const docRef = doc(db, 'quizzes', id)
        const docSnap = await getDoc(docRef);
        
        await updateDoc(docRef, {
            acessos:  1 + docSnap.data().acessos 
        })
    }


    return (
        <div>

            <Header />

            <div className="content">

                <Title name='QUIZ - INÍCIO'>
                    <FiHelpCircle size={24} />
                </Title>

                <div className='container-profile'>

                    <div className='quiz-start'>
                        <div>
                            <label>TEMÁTICA: {quiz.tematica}</label>
                            <label>TOTAL DE QUESTÕES: 5</label>
                            <label>DIFICULDADE: {quiz.dificuldade}</label>
                            <label>TEMPO PARA RESPONDER O QUIZ: {quiz.tempoResposta}</label>
                        </div>

                        <Link to={`/quiz-in-progress/${id}`} className='quiz-st-button' onClick={handleAddAcess}>INICIAR QUIZ</Link>
                        <Link to={'/quiz'} className='quiz-st-button' style={{ backgroundColor: '#FF8820' }}>VOLTAR A TELA INICIAL</Link>

                    </div>

                </div>

            </div>

        </div>
    )
}