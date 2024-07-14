import './quizInProgress.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiHelpCircle } from 'react-icons/fi';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';

import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import { useParams, Link } from "react-router-dom";

export default function QuizInProgress({ conteudo }) {
  const { user, setUser, storageUser } = useContext(AuthContext);

  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    async function loadQuiz() {
      const quizDoc = await getDoc(doc(db, "quizzes", id));
      if (quizDoc.exists()) {
        const quizData = quizDoc.data();
        setQuiz(quizData);
        const questionsPromises = quizData.perguntas.map(id => getDoc(doc(db, "perguntas", id)));
        const questionsDocs = await Promise.all(questionsPromises);
        const loadedQuestions = questionsDocs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(loadedQuestions);
        setCorrectAnswers(new Array(loadedQuestions.length).fill(false));
        setIncorrectAnswers(new Array(loadedQuestions.length).fill(null)); // Inicializa com null para representar não respondido
      } else {
        console.error("Quiz não encontrado!");
      }
    }
    loadQuiz();
  }, [id]);

  async function handleAddPoints() {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    let pontos = score + docSnap.data().pontos;
    await updateDoc(docRef, {
      pontos: pontos
    }).then(() => {
      let data = { 
        ...user,
        pontos: pontos,
      };
      setUser(data);
      storageUser(data);
    });
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNextQuestion();
    }
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestionIndex]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setShowAnswer(true);

    if (index === questions[currentQuestionIndex].resposta_correta) {
      setScore(score + 1);
      setCorrectAnswers(prevCorrect => {
        const updatedCorrect = [...prevCorrect];
        updatedCorrect[currentQuestionIndex] = true;
        return updatedCorrect;
      });
    } else {
      setIncorrectAnswers(prevIncorrect => {
        const updatedIncorrect = [...prevIncorrect];
        updatedIncorrect[currentQuestionIndex] = index; 
        return updatedIncorrect;
      });
    }

    setTimeout(() => {
      setShowAnswer(false);
      handleNextQuestion();
    }, 1000); 
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setTimeLeft(10); 
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Não é possível recarregar a página durante o quiz.';
    };

    const handleKeyDown = (event) => {
      if (event.key === 'F5' || (event.ctrlKey && (event.key === 'r' || event.key === 'R'))) {
        event.preventDefault();
        toast.warn('Não é possível recarregar a página durante o quiz.');
      }
    };

    const handlePopState = (event) => {
      event.preventDefault();
      toast.warn('Não é possível navegar para trás durante o quiz.');
      window.history.pushState(null, null, window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    window.history.pushState(null, null, window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <Header />
        <div className='content'>
          <Title name='QUIZ - RESULTADOS'>
            <FiHelpCircle size={24} />
          </Title>
          <div className='container-profile'>
            <div className="quiz-container-result">
              <div className='title-finish'>
                <h2>Parabéns você concluiu o quiz!</h2>
              </div>
              <p>Sua pontuação: {score} de {questions.length}</p>
              <p>Serão acrescentados em seus pontos do ranking: {score} pontos</p>
              <div className='div-corretas'>
                <h3>Respostas Corretas:</h3>
                <ul>
                  {questions.map((question, index) => (
                    correctAnswers[index] && (
                      <li key={index}>{question.pergunta} - Resposta correta: {question.respostas[question.resposta_correta]}</li>
                    )
                  ))}
                </ul>
              </div>
              <div className='div-incorretas'>
                <h3>Respostas Incorretas:</h3>
                <ul>
                  {questions.map((question, index) => (
                    incorrectAnswers[index] !== null && (
                      <li key={index}>
                        {question.pergunta} - Sua resposta: {questions[index].respostas[incorrectAnswers[index]]}, Resposta correta: {question.respostas[question.resposta_correta]}
                      </li>
                    )
                  ))}
                </ul>
              </div>
              <Link to='/quiz' className='quiz-button' onClick={handleAddPoints}>Voltar ao Início</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Header />
      <div className="content">
        <Title name='QUIZ - EM ANDAMENTO'>
          <FiHelpCircle size={24} />
        </Title>
        <div className='container-profile'>
          <div className='quiz-container-progress'>
            <div className="quiz-info">
              <h2 style={{ marginBottom: 10 }}>Quiz - {quiz.nome}</h2>
              <p style={{ marginBottom: 10 }}>Tempo Restante: {timeLeft} segundos</p>
              <p>Pergunta {currentQuestionIndex + 1} de {questions.length}</p>
            </div>
            <div className="question-box">
              <h3>{currentQuestion.pergunta}</h3>
              <div className="answers">
                {currentQuestion.respostas.map((answer, index) => (
                  <div
                    key={index}
                    className={`answer ${showAnswer && (index === currentQuestion.resposta_correta ? 'correct' : (index === selectedAnswer ? 'incorrect' : ''))}`}
                    onClick={() => !showAnswer && handleAnswerSelect(index)}
                  >
                    {answer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
