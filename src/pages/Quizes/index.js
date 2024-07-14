import './quizes.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiHelpCircle } from 'react-icons/fi';

import { useEffect, useState } from 'react';

import { db } from '../../services/firebaseConnection';
import { collection, getDocs, where, query,  limit, and, startAfter } from 'firebase/firestore';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Quizes() {

    const listRefThemes = collection(db, 'tematicas');

    const [quizzes, setQuizzes] = useState([]);

    const [tematicas, setTematicas] = useState([]);
    const [loadTematicas, setLoadTematicas] = useState(true);
    const [tematicaSelected, setTematicaSelected] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [reset, setReset] = useState(false);

    const [difficultySelected, setDifficultySelected] = useState('Todos');

    const listRef = collection(db, 'quizzes');


    useEffect(() => {

        async function loadQuizes() {

            const q = query(listRef);

            const querySnapshot = await getDocs(q);
            const quizzesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuizzes(quizzesList);
            console.log(quizzes)

        };

        loadQuizes();

    }, [reset])

    useEffect(() => {

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

    }, [])

    async function loadQuizesFiltrados() {

        if (difficultySelected !== 'Todos') {
            const q = query(listRef, and(where('dificuldade', '==', difficultySelected), where('tematica', '==', tematicas[tematicaSelected].nomeTematica)));

            const querySnapshot = await getDocs(q);
            const quizzesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (querySnapshot.docs.length === 0){
                toast.warn('Nenhum quiz encontrado com o filtro informado!')
                return;
            }

            setQuizzes(quizzesList);
            //alert(tematicas[tematicaSelected].nomeTematica)


            return;
        }

        //const q = query(listRef);
        const q = query(listRef, where('tematica', '==', tematicas[tematicaSelected].nomeTematica));


        const querySnapshot = await getDocs(q);
        const quizzesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setQuizzes(quizzesList);

    }


    function handleChangeTheme(e) {
        setTematicaSelected(e.target.value);
    }

    function handleChangeDifficulty(e) {
        setDifficultySelected(e.target.value);
    }


    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='QUIZ'>
                    <FiHelpCircle size={24} />
                </Title>

                <div className='container-div-quiz'>

                    <div className='header' style={{ padding: 20 }}>

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
                                <option value='Todos'>Todos</option>
                                <option value='Fácil'>Fácil</option>
                                <option value='Média'>Média</option>
                                <option value='Difícil'>Difícil</option>
                            </select>

                        </div>

                        <button className='btn-save' onClick={loadQuizesFiltrados} style={{ fontSize: 16 }}>FILTRAR</button>

                    </div>

                    <div className="quiz-list">
                        {quizzes.map(quiz => (

                            <div className='quiz-container'>

                                <div className='quiz-title'>
                                    <h1>{quiz.nome}</h1>
                                </div>


                                <div className='quiz-level'
                                    style={{
                                        backgroundColor:
                                            quiz.dificuldade === 'Fácil' ? 'green' :
                                                quiz.dificuldade === 'Média' ? 'yellow' :
                                                    quiz.dificuldade === 'Difícil' ? 'red' : 'defaultColor',
                                        color:
                                            quiz.dificuldade === 'Fácil' ? '#FFF' :
                                                quiz.dificuldade === 'Média' ? '#121212' :
                                                    quiz.dificuldade === 'Difícil' ? '#FFF' : 'defaultColor'
                                    }}
                                >
                                    <h1>{quiz.dificuldade.toUpperCase()}</h1>
                                </div>


                                <div className='quiz-acessos'>
                                    <h1>TOTAL DE ACESSOS: {quiz.acessos}</h1>
                                </div>


                                <Link to={`/quiz-start/${quiz.id}`}  className='quiz-button'>ACESSAR QUIZ</Link>

                            </div>


                        ))}
                    </div>

                </div>

            </div>

        </div>
    )
}