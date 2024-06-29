import './registerThemes.css'

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect } from 'react';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useNavigate } from 'react-router-dom';

import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RegisterThemes() {

    const [tematica, setTematica] = useState('');
    const navigate = useNavigate();


    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'courses');
    const [cursos, setCursos] = useState([]);
    const [loadCourses, setLoadCourses] = useState(true);
    const [courseSelected, setCourseSelected] = useState(0);


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
                            nomeCurso: course.data().nomeCurso
                        })
                    })

                    if (snapshot.docs.size === 0) {
                        setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                        setLoadCourses(false);
                        return;
                    }

                    setCursos(lista);
                    setLoadCourses(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoadCourses(false);
                    setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                })
        }

        loadCourses();

    }, [])

    function handleChangeCourse(e) {
        setCourseSelected(e.target.value);
    }


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    async function handleRegisterClass(e) {
        e.preventDefault();

        await addDoc(collection(db, 'tematicas'), {
            created: new Date(),
            nomeTematica: tematica,
            curso: cursos[courseSelected].nomeCurso,
        })
            .then(() => {
                toast.success('Temática registrada!')
                setTematica('');
                setCourseSelected(0);
            })
            .catch((e) => {
                console.log(e)
                toast.error('Ops! ocorreu um erro ao registrar');
            })

    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE TEMÁTICAS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile' onSubmit={handleRegisterClass}>

                        <label>DIGITE O NOME DA TEMÁTICA:</label>
                        <input type='text' value={tematica} onChange={(e) => setTematica(e.target.value)} placeholder='Digite o nome da temática' />

                        <label>CURSO:</label>
                        {
                            loadCourses ? (
                                <input
                                    type='text'
                                    disabled={true}
                                    value='Carregando...'
                                />
                            ) : (
                                <select value={courseSelected} onChange={handleChangeCourse} className='combo-nivel-ensino'>
                                    {cursos.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.nomeCurso}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        <div className='area-btn'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                            <button type='submit' className='btn-save'>CADASTRAR</button>

                        </div>

                    </form>



                </div>

            </div>
        </div>
    )
}