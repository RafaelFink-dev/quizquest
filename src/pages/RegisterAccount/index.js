import './registerAccount.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';

import { FiUserPlus, FiList, FiEdit2 } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { db } from '../../services/firebaseConnection';
import { updateDoc, collection, where, query, onSnapshot, doc } from 'firebase/firestore';



export default function RegisterAccount() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [professores, setProfessores] = useState([]);
    const [ativo, setAtivo] = useState('Ativo');
    const [idCustomer, setIdCustormer] = useState();

    const getBackgroundColor = (status) => {
        switch (status) {
            case 'Ativo':
                return '#5CB85C';
            case 'Desativado':
                return '#D9534F';

        }
    };

    const listRef = collection(db, 'users');

    const navigate = useNavigate();

    const { handleRegisterTeacher, loadingAuth, setLoadingAuth } = useContext(AuthContext);


    useEffect(() => {

        async function loadProfessores() {

            const q = query(listRef, where('professor', '==', true));

            onSnapshot(q, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        ...doc.data()
                    })


                    setProfessores(lista);
                    //setLoading(false);
                })
            })

        }

        loadProfessores();


        setLoading(false);


    }, [])


    async function handleRegister(e) {
        e.preventDefault();


        if (editing) {

            setLoadingAuth(true);
            //Atualizando professor

            const docRef = doc(db, 'users', idCustomer)
            await updateDoc(docRef, {
                nome: nome,
                status: ativo,
            })
                .then(() => {
                    toast.success("Professor atualizado com sucesso!")
                    setLoadingAuth(false)
                    setEditing(false);
                    setNome('');
                    setEmail('');
                    setAtivo('Ativo');

                })
                .catch((e) => {
                    toast.error('Ops! erro ao atualizar este professor!')
                    console.log(e);
                })

            return;
        }

        if (email !== '' && nome !== '') {

            const password = generatePassword(12);

            await handleRegisterTeacher(email, password, nome)

            const successMessage = 'Professor cadastrado com sucesso!';

            const toastContainer = document.querySelector('.Toastify__toast-container');
            const lastToast = toastContainer?.lastChild?.innerText;

            if (lastToast === successMessage) {
                setEmail('');
                setNome('');
            }

        } else {
            toast.warn('Preencha todos os campos!')
        }
    }

    function generatePassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    function handleEdit(item) {
        setEditing(true);
        setNome(item.nome);
        setEmail(item.email)
        setAtivo(item.status);
        setIdCustormer(item.id);
    }

    function handleCancelInsert() {
        setEditing(false);
        setNome('');
        setEmail('');
        toast.warn('Alterações canceladas')
    }

    function handleOptionChange(e) {
        setAtivo(e.target.value);
    }


    if (loading) {
        return (
            <div>
                <Header />

                <div className='content'>
                    <Title name='ÁREA PRIVADA - CADASTRO DE PROFESSORES'>
                        <FiUserPlus size={24} />
                    </Title>

                    <div style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20 }} className='container'>
                        <span>Buscando professores...</span>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div>
            <Header />

            <div className='content'>
                <Title name='ÁREA PRIVADA - CADASTRO DE PROFESSORES'>
                    <FiUserPlus size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>NOME:</label>
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} placeholder='Digite o nome' />

                        <label>EMAIL:</label>
                        {editing ? <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite o e-mail' disabled={true} /> : <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite o e-mail' />}

                        <label>Status do professor:</label>
                        <div className='status'>
                            <label className='radio-container'>
                                <input
                                    type='radio'
                                    name='radio'
                                    value='Ativo'
                                    onChange={handleOptionChange}
                                    checked={ativo === 'Ativo'}
                                />
                                <span className='radio-label'>Ativo</span>
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
                                <span className='radio-label'>Desativado</span>
                                <span className='radio-checkmark'></span>
                            </label>
                        </div>


                        <label className='obs1'>OBSERVAÇÃO:</label>
                        <label className='obs2'>Ao finalizar o cadastro, será enviado um e-mail para definição de senha para o professor cadastrado!</label>


                        {editing ? (
                            <div className='area-btn'>

                                <button type='button' className='btn-save' onClick={handleCancelInsert}>CANCELAR ALTERAÇÕES</button>
                                <button type='submit' className='btn-save'>
                                    {loadingAuth ? 'ALTERANDO...' : 'ALTERAR PROFESSOR'}
                                </button>
                            </div>
                        ) : (
                            <div className='area-btn'>

                                <button type='button' className='btn-save' onClick={handleCancel}>CANCELAR</button>
                                <button type='submit' className='btn-save'>
                                    {loadingAuth ? 'CADASTRANDO...' : 'CADASTRAR PROFESSOR'}

                                </button>
                            </div>
                        )}


                    </form>
                </div>

                <div className='container-profile'>

                    <div className='title-grid'>
                        <FiList size={24} />
                        <h1>LISTAGEM/MANUTENÇÃO DE PROFESSORES CADASTRADOS</h1>
                    </div>

                    <div className='container'>

                        {professores.length === 0 ? (
                            <div>
                                <span >Nenhum professor encontrado...</span>
                            </div>
                        ) : (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Professor</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {professores.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td data-label='Professor' style={{ color: '#121212' }}>{item.nome}</td>
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