import './registerAccount.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import { FiUserPlus } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function RegisterAccount() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const { ResetPasswordTeacher, handleRegisterTeacher, loadingAuth } = useContext(AuthContext);

    async function handleRegister(e) {
        e.preventDefault();

        if (email !== '' && nome !== '') {

            const password = '123123'

            await handleRegisterTeacher(email, password, nome)
            await ResetPasswordTeacher(email);

        } else {
            toast.warn('Preencha todos os campos!')
        }
    }

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
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
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} placeholder='Digite o nome'/>

                        <label>EMAIL:</label>
                        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite o e-mail'/>

                        <label className='obs1'>OBSERVAÇÃO:</label>
                        <label className='obs2'>Ao finalizar o cadastro, será enviado um e-mail para definição de senha para o professor cadastrado!</label>

                        <div className='area-btn'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>

                            <button type='submit' className='btn-save'>
                                {loadingAuth ? 'CADASTRANDO...' : 'CADASTRAR PROFESSOR'}
                            </button>
                        </div>

                    </form>


                </div>
            </div>
        </div>
    )
}