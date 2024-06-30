
import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';
import { getDocs, collection, addDoc } from 'firebase/firestore';


export default function RegisterClass() {

    const [turma, setTurma] = useState('');
    const navigate = useNavigate();

    const [cursos, setCursos] = useState([]);
    const [loadCourses, setLoadCourses] = useState(true);
    const [courseSelected, setCourseSelected] = useState(0);

    const [turnoSelecionado, setTurnoSelecionado] = useState('Manhã')

    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'courses');


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

    async function handleRegisterClass(e) {
        e.preventDefault();

        await addDoc(collection(db, 'turmas'), {
            created: new Date(),
            nomeTurma: turma,
            curso: cursos[courseSelected],
            turnoTurna: turnoSelecionado
        })
            .then(() => {
                toast.success('Turma registrada!')
                setTurma('');
                setCourseSelected(0);
                setTurnoSelecionado('Manhã')
            })
            .catch((e) => {
                console.log(e)
                toast.error('Ops! ocorreu um erro ao registrar');
            })

    }

    function handleChangeCourse(e) {
        setCourseSelected(e.target.value);
    }

    function handleChangeTurno(e) {
        setTurnoSelecionado(e.target.value);
    }

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE TURMAS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile' onSubmit={handleRegisterClass}>

                        <label>DIGITE O NOME DA TURMA:</label>
                        <input type='text' value={turma} onChange={(e) => setTurma(e.target.value)} placeholder='Digite o nome da turma' />

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

                        <label>TURNO:</label>
                        <select value={turnoSelecionado} onChange={handleChangeTurno} className='combo-nivel-ensino'>
                            <option value='Manhã'>Manhã</option>
                            <option value='Tarde'>Tarde</option>
                            <option value='Noite'>Noite</option>
                        </select>

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