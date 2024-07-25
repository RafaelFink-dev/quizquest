import './registerThemes.css'

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { getDocs, collection, addDoc, updateDoc, onSnapshot, doc, where, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useNavigate } from 'react-router-dom';

import { FiEdit, FiList, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RegisterThemes() {

    const [tematica, setTematica] = useState('');
    const navigate = useNavigate();


    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'courses');
    const [cursos, setCursos] = useState([]);
    const [loadCourses, setLoadCourses] = useState(true);
    const [courseSelected, setCourseSelected] = useState(0);

    const listRefThemes = collection(db, 'tematicas');
    const [tematicas, setTematicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [ativo, setAtivo] = useState('Ativo');
    const [idTheme, setIdTheme] = useState();

    const { loadingAuth, setLoadingAuth } = useContext(AuthContext);


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
                            /*id: course.id,
                            nomeCurso: course.data().nomeCurso*/

                            id: course.id,
                            ...course.data()
                        })
                    })

                    if (snapshot.docs.size === 0) {
                        setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                        setLoadCourses(false);
                        return;
                    }

                    console.log()

                    setCursos(lista);
                    setLoadCourses(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoadCourses(false);
                    setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                })
        }

        async function loadTematicas() {

            const q = query(listRefThemes);

            onSnapshot(q, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        ...doc.data()
                    })


                    setTematicas(lista);
                    //setLoading(false);
                })
            })

        }

        loadTematicas();
        loadCourses();

        setTimeout(() => {
            setLoading(false);
        }, 500);  // 500ms de atraso



    }, [])

    function handleChangeCourse(e) {
        setCourseSelected(e.target.value);
    }


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    function handleEdit(item) {
        setEditing(true);
        setTematica(item.nomeTematica);
        const index = cursos.findIndex(course => course.id === item.curso.id);
        setCourseSelected(index);
        setAtivo(item.status);
        setIdTheme(item.id);
    }

    function handleOptionChange(e) {
        setAtivo(e.target.value);
    }

    function handleCancelInsert() {
        setEditing(false);
        setTematica('');
        setCourseSelected(0);
        setAtivo('Ativo')
        toast.warn('Alterações canceladas')
    }

    async function handleRegisterClass(e) {
        e.preventDefault();

        if (editing) {

            setLoadingAuth(true);
            //Atualizando tematica

            const docRef = doc(db, 'tematicas', idTheme)
            await updateDoc(docRef, {
                nomeTematica: tematica,
                curso: cursos[courseSelected],
                status: ativo,
            })
                .then(() => {
                    toast.success("Temática atualizada com sucesso!")
                    setLoadingAuth(false)
                    setEditing(false);
                    setTematica('');
                    setCourseSelected(0);
                    setAtivo('Ativo');

                })
                .catch((e) => {
                    toast.error('Ops! erro ao atualizar esta temática!')
                    console.log(e);
                })

            return;
        }

        if (tematica !== '') {

            await addDoc(collection(db, 'tematicas'), {
                created: new Date(),
                nomeTematica: tematica,
                curso: cursos[courseSelected]
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

            return;
        } else {
            toast.warn('Preencha um nome para inserir ua temática!')
        }



    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className='content'>
                    <Title name='ÁREA PRIVADA - CADASTRO DE TEMÁTICAS'>
                        <FiEdit size={24} />
                    </Title>

                    <div style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20 }} className='container'>
                        <span>Buscando temáticas...</span>
                    </div>
                </div>
            </div>
        )
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

                        <label>Status da temática:</label>
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
                                    {loadingAuth ? 'ALTERANDO...' : 'ALTERAR TEMÁTICA'}
                                </button>
                            </div>
                        ) : (
                            <div className='area-btn'>

                                <button type='button' className='btn-save' onClick={handleCancel}>CANCELAR</button>
                                <button type='submit' className='btn-save'>
                                    {loadingAuth ? 'CADASTRANDO...' : 'CADASTRAR TEMÁTICA'}

                                </button>
                            </div>
                        )}

                    </form>



                </div>

                <div className='container-profile'>

                    <div className='title-grid'>
                        <FiList size={24} />
                        <h1>LISTAGEM/MANUTENÇÃO DE TEMÁTICAS CADASTRADAS</h1>
                    </div>

                    <div className='container'>

                        {tematicas.length === 0 ? (
                            <div>
                                <span >Nenhuma temática encontrada...</span>
                            </div>
                        ) : (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Temática</th>
                                            <th scope='col'>Curso</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tematicas.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td data-label='Temática' style={{ color: '#121212' }}>{item.nomeTematica}</td>
                                                    <td data-label='Curso' style={{ color: '#121212' }}>{item.curso.nomeCurso}</td>
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