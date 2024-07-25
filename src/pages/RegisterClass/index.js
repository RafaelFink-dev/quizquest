
import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import { FiEdit, FiList, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';
//import { getDocs, collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { getDocs, collection, addDoc, updateDoc, onSnapshot, doc, where, query } from 'firebase/firestore';


export default function RegisterClass() {

    const [turma, setTurma] = useState('');
    const navigate = useNavigate();

    const [cursos, setCursos] = useState([]);
    const [loadCourses, setLoadCourses] = useState(true);
    const [courseSelected, setCourseSelected] = useState(0);
    const [editing, setEditing] = useState(false);
    const [ativo, setAtivo] = useState('Ativo');
    const [idTurma, setIdTurma] = useState('');

    const [turmas, setTurmas] = useState([]);

    const [turnoSelecionado, setTurnoSelecionado] = useState('Manhã')
    const { loadingAuth, setLoadingAuth } = useContext(AuthContext);

    const getBackgroundColor = (status) => {
        switch (status) {
            case 'Ativo':
                return '#5CB85C';
            case 'Desativado':
                return '#D9534F';

        }
    };

    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'courses');
    const listRefTurmas = collection(db, 'turmas');


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

        async function loadTurmas() {

            const q = query(listRefTurmas);

            onSnapshot(q, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        ...doc.data()
                    })


                    setTurmas(lista);
                    //setLoading(false);
                })
            })

        }

        loadTurmas();
        loadCourses();

    }, [])

    async function handleRegisterClass(e) {
        e.preventDefault();

        if (editing) {

            setLoadingAuth(true);
            //Atualizando turma

            const docRef = doc(db, 'turmas', idTurma)
            await updateDoc(docRef, {
                nomeTurma: turma,
                curso: cursos[courseSelected],
                turnoTurna: turnoSelecionado,
                status: ativo,
            })
                .then(() => {
                    toast.success("Turma atualizada com sucesso!")
                    setLoadingAuth(false)
                    setEditing(false);
                    setTurma('');
                    setCourseSelected(0);
                    setAtivo('Ativo');

                })
                .catch((e) => {
                    toast.error('Ops! erro ao atualizar esta turma!')
                    console.log(e);
                })

            return;
        }

        if (turma !== '') {
            await addDoc(collection(db, 'turmas'), {
                created: new Date(),
                nomeTurma: turma,
                curso: cursos[courseSelected],
                turnoTurna: turnoSelecionado,
                status: ativo
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

            return;
        } else {
            toast.warn('Preencha um nome para inserir uma turma')
        }



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

    function handleEdit(item) {
        setEditing(true);
        setTurma(item.nomeTurma)
        setTurnoSelecionado(item.turnoTurna)
        setIdTurma(item.id)
        const index = cursos.findIndex(course => course.id === item.curso.id);
        setCourseSelected(index);
        setAtivo(item.status);

        //setAreaConhecimento(item.areaConhecimento);
        //setAtivo(item.status);
        //setIdCurso(item.id)
    }

    function handleCancelInsert() {
        setEditing(false);
        //setTematica('');
        //setCourseSelected(0);
        //setAtivo('Ativo')
        toast.warn('Alterações canceladas')
    }

    function handleOptionChange(e) {
        setAtivo(e.target.value);
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

                        <label>Status da turma:</label>
                        <div className='status'>
                            <label className='radio-container'>
                                <input
                                    type='radio'
                                    name='radio'
                                    value='Ativo'
                                    onChange={handleOptionChange}
                                    checked={ativo === 'Ativo'}
                                />
                                <span className='radio-label'>Ativa</span>
                                <span className='radio-checkmark'></span>
                            </label>

                            <label className='radio-container'>
                                <input
                                    type='radio'
                                    name='radio'
                                    value='Desativado'
                                    onChange={handleOptionChange}
                                    checked={ativo === 'Desativado'}
                                />
                                <span className='radio-label'>Desativada</span>
                                <span className='radio-checkmark'></span>
                            </label>
                        </div>

                        {editing ? (
                            <div className='area-btn'>

                                <button type='button' className='btn-save' onClick={handleCancelInsert}>CANCELAR ALTERAÇÕES</button>
                                <button type='submit' className='btn-save'>
                                    {loadingAuth ? 'ALTERANDO...' : 'ALTERAR TURMA'}
                                </button>
                            </div>
                        ) : (
                            <div className='area-btn'>

                                <button type='button' className='btn-save' onClick={handleCancel}>CANCELAR</button>
                                <button type='submit' className='btn-save'>
                                    {loadingAuth ? 'CADASTRANDO...' : 'CADASTRAR TURMA'}

                                </button>
                            </div>
                        )}

                    </form>


                </div>

                <div className='container-profile'>

                    <div className='title-grid'>
                        <FiList size={24} />
                        <h1>LISTAGEM/MANUTENÇÃO DE TURMAS CADASTRADAS</h1>
                    </div>

                    <div className='container'>

                        {turmas.length === 0 ? (
                            <div>
                                <span >Nenhuma turma encontrada...</span>
                            </div>
                        ) : (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col'>TURMA</th>
                                            <th scope='col'>CURSO</th>
                                            <th scope='col'>TURNO</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turmas.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td data-label='Nome' style={{ color: '#121212' }}>{item.nomeTurma}</td>
                                                    <td data-label='Curso' style={{ color: '#121212' }}>{item.curso.nomeCurso}</td>
                                                    <td data-label='Curso' style={{ color: '#121212' }}>{item.turnoTurna}</td>
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