import './registerQuestion.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiEdit } from 'react-icons/fi';

import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { getDocs, collection, addDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterQuestion() {

    const navigate = useNavigate();

    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'tematicas');

    const [tematicas, setTematicas] = useState([]);
    const [loadTematicas, setLoadTematicas] = useState(true);
    const [tematicaSelected, setTematicaSelected] = useState(0);
    const [difficultySelected, setDifficultySelected] = useState('Fácil');
    const [questionCorrect, setQuestionCorrect] = useState('');


    useEffect(() => {

        //CARREGAR TEMÁTICAS AO ABRIR A TELA
        async function loadCourses() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    //LISTA PARA ADD TEMÁTICAS
                    let lista = []

                    snapshot.forEach((theme) => {
                        lista.push({
                            id: theme.id,
                            nomeTematica: theme.data().nomeTematica
                        })
                    })

                    console.log(snapshot.docs.length)
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

        loadCourses();

    }, [])

    function handleChangeTheme(e) {
        setTematicaSelected(e.target.value);
    }

    function handleChangeDifficulty(e) {
        setDifficultySelected(e.target.value);
    }


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    function handleOptionChange(e) {
        setQuestionCorrect(e.target.value);
    }

    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE PERGUNTAS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>


                    <div className='header-options'>

                        <div className='div-themes'>
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

                    <form className='form-profile'>
                        <label>DIGITE A PERGUNTA:</label>
                        <textarea placeholder='Digite sua pergunta'></textarea>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 1:</label>
                                <div className='checkbox-container'>
                                    <input type="radio"
                                        value={'Alternativa 1'}
                                        onChange={handleOptionChange}
                                        checked={questionCorrect === 'Alternativa 1'}
                                    />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 2:</label>
                                <div className='checkbox-container'>
                                    <input type="radio"
                                        value={'Alternativa 2'}
                                        onChange={handleOptionChange}
                                        checked={questionCorrect === 'Alternativa 2'}
                                    />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 3:</label>
                                <div className='checkbox-container'>
                                    <input type="radio"
                                        value={'Alternativa 3'}
                                        onChange={handleOptionChange}
                                        checked={questionCorrect === 'Alternativa 3'}
                                    />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 4:</label>
                                <div className='checkbox-container'>
                                    <input type="radio"
                                        value={'Alternativa 4'}
                                        onChange={handleOptionChange}
                                        checked={questionCorrect === 'Alternativa 4'}

                                    />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>GABARITO DA QUESTÃO CORRETA:</label>

                            </div>

                            <textarea placeholder='Digite o gabarito'></textarea>

                        </div>

                        <div className='area-btn-other'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                            <button type='submit' className='btn-save'>CADASTRAR</button>

                        </div>

                    </form>



                </div>

            </div>


        </div>
    )
}