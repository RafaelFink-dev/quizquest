import './registerQuiz.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiEdit } from 'react-icons/fi';

import { db } from '../../services/firebaseConnection';
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore';

import { toast } from 'react-toastify';

export default function RegisterQuiz() {


    const [quizName, setQuizName] = useState('');
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [difficultySelected, setDifficultySelected] = useState('Fácil');
    const [quantidadePerguntas, setQuantidadePerguntas] = useState(3);
    const [time, setTime] = useState('01:00')

    const [tematicas, setTematicas] = useState([]);
    const [loadTematicas, setLoadTematicas] = useState(true);
    const [tematicaSelected, setTematicaSelected] = useState(0);

    const navigate = useNavigate();

    const listRef = collection(db, 'perguntas');
    const listRefThemes = collection(db, 'tematicas');

    /*useEffect(() => {
        const fetchQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, "perguntas"));
            const questionsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableQuestions(questionsList);
        };

        fetchQuestions();
    }, [difficultySelected]);
    //VALIDAR TODA VEZ QUE O COMO DA DIFICULDADE MUDAR ELE FILTRAR NOVAMENTE AS QUESTÕES NO GRID*/

    useEffect(() => {

        async function loadQuestions() {

            const q = query(listRef, where('dificuldade', '==', difficultySelected));

            const querySnapshot = await getDocs(q)
            const questionsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableQuestions(questionsList);
        }

        loadQuestions();

        async function loadThemes() {
            const querySnapshot = await getDocs(listRefThemes)
                .then((snapshot) => {
                    //LISTA PARA ADD TEMÁTICAS
                    let lista = []

                    snapshot.forEach((theme) => {
                        lista.push({
                            id: theme.id,
                            nomeTematica: theme.data().nomeTematica
                        })
                    })

                    if (snapshot.docs.length === 0) {
                        setTematicas([{ id: 1, nomeTematica: 'Nenhuma temática encontrada' }]);
                        setLoadTematicas(false);
                        return;
                    }

                    setTematicas(lista);
                    setLoadTematicas(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoadTematicas(false);
                    setTematicas([{ id: 1, nomeTematica: 'NENHUMA TEMÁTICA ENCONTRADA' }]);
                })
        }

        loadThemes();


        return () => {

        } //quando desmontar o componente

    }, [difficultySelected])

    function handleChangeDifficulty(e) {
        setDifficultySelected(e.target.value);
    }

    async function handleSubmitQuiz(e) {
        e.preventDefault()

        if (!quizName || selectedQuestions.length === 0) {
            toast.warn('Por favor, preencha o nome do quiz e selecione pelo menos três perguntas.');
            return;
        }

        if (selectedQuestions.length < 3) {
            toast.warn('Necessário o minimo de 3 perguntas para ser um quiz!');
            return;
        }

        if (quantidadePerguntas !== selectedQuestions.length) {
            toast.warn('Número de questões selecionadas divergente do informado.');
            return;
        }

        try {
            await addDoc(collection(db, "quizzes"), {
                nome: quizName,
                perguntas: selectedQuestions,
                dificuldade: difficultySelected,
                tempoResposta: time,
                tematica: tematicaSelected
            });
            alert('Quiz adicionado com sucesso!');
            setQuizName('');
            setSelectedQuestions([]);
        } catch (error) {
            console.error('Erro ao adicionar quiz: ', error);
            alert('Erro ao adicionar quiz. Por favor, tente novamente.');
        }
    }



    const toggleQuestionSelection = (questionId) => {
        setSelectedQuestions(prevSelected =>
            prevSelected.includes(questionId)
                ? prevSelected.filter(id => id !== questionId)
                : [...prevSelected, questionId]
        );
    };

    function handleChangeTheme(e) {
        setTematicaSelected(e.target.value);
    }

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE QUIZ'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <div className='header'>

                        <div className='div-title'>

                            <label>DIGITE O NOME DO QUIZ:</label>
                            <input placeholder='Digite o nome do quiz'
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                            ></input>

                        </div>

                        <div className='div-theme'>

                            <label>TEMÁTICA:</label>
                            {
                                loadTematicas ? (
                                    <input
                                        type='text'
                                        disabled={true}
                                        value='Carregando...'
                                    />
                                ) : (
                                    <select value={tematicaSelected} onChange={handleChangeTheme} className='combo-nivel-ensino'>
                                        {tematicas.map((item, index) => {
                                            return (
                                                <option key={index} value={index}>
                                                    {item.nomeTematica}
                                                </option>
                                            )
                                        })}
                                    </select>
                                )
                            }

                        </div>

                        <div className='div-difficulty'>

                            <label>DIFICULDADE:</label>
                            <select value={difficultySelected} onChange={handleChangeDifficulty} className='combo-nivel-ensino'>
                                <option value='Fácil'>Fácil</option>
                                <option value='Média'>Média</option>
                                <option value='Difícil'>Difícil</option>
                            </select>

                        </div>

                    </div>


                    <div className='middle'>

                        <div>
                            <label>QUANTIDADE DE PERGUNTAS:</label>
                            <input placeholder='Quantidade' value={quantidadePerguntas} onChange={(e) => setQuantidadePerguntas(e.target.value)}></input>
                        </div>

                        <div className=''>
                            <label>TEMPO PARA RESPONDER CADA PERGUNTA:</label>
                            <input placeholder='00:00:00' value={time} onChange={(e) => setTime(e.target.value)}></input>
                        </div>

                    </div>

                    <div className='questions'>

                        <div className='questions-title'>
                            <label>SELECIONE AS PERGUNTAS PARA INSERIR NO QUIZ:</label>
                        </div>

                        <form className='form-group'>

                            <div className="form-group">

                                {availableQuestions.map(question => (

                                    <div key={question.id} className="question-selection">

                                        <div>
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.includes(question.id)}
                                                onChange={() => toggleQuestionSelection(question.id)}
                                            />
                                            <label>{question.pergunta}</label>
                                        </div>

                                        <div>
                                            <label>DIFICULDADE:</label>
                                            <span
                                                className='badge'
                                                style={{
                                                    backgroundColor:
                                                        question.dificuldade === 'Fácil' ? 'green' :
                                                            question.dificuldade === 'Média' ? 'yellow' :
                                                                question.dificuldade === 'Difícil' ? 'red' : 'defaultColor',
                                                    color:
                                                        question.dificuldade === 'Fácil' ? '#FFF' :
                                                            question.dificuldade === 'Difícil' ? '#FFF' : 'defaultColor'
                                                }}
                                            >
                                                {question.dificuldade}
                                            </span>
                                        </div>

                                    </div>
                                ))}

                            </div>

                        </form>

                    </div>

                    <div className='area-btn-quiz'>

                        <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                        <button type='submit' className='btn-save' onClick={handleSubmitQuiz}>CADASTRAR</button>

                    </div>

                </div>

            </div>

        </div >
    )
}