
import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiEdit, FiList, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';

import { getDocs, collection, addDoc, updateDoc, onSnapshot, doc, where, query } from 'firebase/firestore';

export default function RegisterCourse() {

    const listRef = collection(db, 'courses');
    const [curso, setCurso] = useState('');
    const [areaConhecimento, setAreaConhecimento] = useState('Ciências Agrárias');

    const [cursosList, setCursosList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const navigate = useNavigate();

    const getBackgroundColor = (status) => {
        switch (status) {
            case 'Ativo':
                return '#5CB85C';
            case 'Desativado':
                return '#D9534F';

        }
    };

    useEffect(() => {

        //CARREGAR CURSOS AO ABRIR A TELA
        async function loadCourses() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    //LISTA PARA ADD CURSOS
                    let lista = [] 

                    snapshot.forEach((course) => {
                        lista.push({
                            id: course.id,
                            nomeCurso: course.data().nomeCurso,
                            status: course.data().status,
                            areaConhecimento: course.data().areaConhecimento
                        })
                    })

                    setCursosList(lista);
                    //setLoadCourses(false);
                })
                .catch((e) => {
                    console.log(e);
                    //setLoadCourses(false);
                })
        }

        loadCourses();

        setTimeout(() => {
            setLoading(false);
        }, 110); 



    }, [])


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    function handleChangeSelect(e) {
        setAreaConhecimento(e.target.value);
    }

    function handleEdit(item) {
        setEditing(true);
        setCurso(item.nomeCurso);
        setAreaConhecimento(item.areaConhecimento);
        //setAtivo(item.status);
        //setIdCustormer(item.id);
    }

    //INSERINDO CURSO
    async function handleSubmit(e) {
        e.preventDefault();

        if (curso !== '') {
            await addDoc(collection(db, 'courses'), {
                nomeCurso: curso,
                areaConhecimento: areaConhecimento
            })
                .then(() => {
                    toast.success('Curso adicionado!')
                    setCurso('');
                    setAreaConhecimento(0);
                })
                .catch(() => {
                    toast.error('Erro ao adicionar curso!')
                })

            return;
        } else {
            toast.warn('Preencha um nome para inserir um curso!')
        }


    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE CURSOS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile' onSubmit={handleSubmit}>

                        <label>DIGITE O NOME DO CURSO:</label>
                        <input type='text' value={curso} onChange={(e) => setCurso(e.target.value)} maxLength={100} placeholder='Digite o nome do curso' />

                        <label>ÁREA DE CONHECIMENTO:</label>
                        <select value={areaConhecimento} onChange={handleChangeSelect} className='combo-nivel-ensino'>
                            <option value='Ciências Agrárias'>Ciências Agrárias</option>
                            <option value='Ciências Biológicas'>Ciências Biológicas</option>
                            <option value='Ciências da Saúde'>Ciências da Saúde</option>
                            <option value='Ciências Exatas e da Terra'>Ciências Exatas e da Terra</option>
                            <option value='Engenharias'>Engenharias</option>
                            <option value='Ciências Humanas'>Ciências Humanas</option>
                            <option value='Ciências Sociais Aplicadas e Linguística'>Ciências Sociais Aplicadas e Linguística</option>
                            <option value='Letras e Artes'>Letras e Artes</option>
                        </select>

                        <div className='area-btn'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                            <button type='submit' className='btn-save'>CADASTRAR</button>

                        </div>

                    </form>

                </div>

                <div className='container-profile'>

                    <div className='title-grid'>
                        <FiList size={24} />
                        <h1>LISTAGEM/MANUTENÇÃO DE CURSOS CADASTRADOS</h1>
                    </div>

                    <div className='container'>

                        {cursosList.length === 0 ? (
                            <div>
                                <span >Nenhuma temática encontrada...</span>
                            </div>
                        ) : (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Temática</th>
                                            <th scope='col'>Área de conhecimento</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cursosList.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td data-label='Temática' style={{ color: '#121212' }}>{item.nomeCurso}</td>
                                                    <td data-label='Temática' style={{ color: '#121212' }}>{item.areaConhecimento}</td>
                                                    <td data-label='Status'>
                                                        <span className='badge' style={{ backgroundColor: getBackgroundColor(item.status) }}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td data-label='#'>
                                                        <button className='action' style={{ backgroundColor: '#f6a935' }} onClick={() => { handleEdit(item) }}>
                                                            <FiEdit2 color='#FFF' size={17} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}