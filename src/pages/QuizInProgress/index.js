

import { db } from '../../services/firebaseConnection';
import {  getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useParams, Link } from "react-router-dom";

export default function QuizInProgress({ conteudo }){

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


  return(
    <div>
      <h1>QUIZ EM ANDAMENTO SOB NOME: {quiz.nome}</h1>
    </div>
  )
}