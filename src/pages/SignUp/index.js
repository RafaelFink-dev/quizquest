import logo from '../../assets/logo.png';
import './signup.css';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

export default function SignUp() {

    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [cnpj, setCNPJ] = useState('');
    const [password, setPassword] = useState('');
    const [instituicao, setInstituicao] = useState(false);

    const { signUp, loadingAuth } = useContext(AuthContext);

    function handleCheckboxChange() {
        setInstituicao(!instituicao)
    }

    async function handleRegister(e) {
        e.preventDefault(); //Previni att pagina ou enviar dados para outra

        if (usuario !== '' && email !== '' && password !== '') {
            await signUp(email, password, usuario, instituicao)
        } else {
            toast.warn('Preencha todos os campos!')
        }
    }

    return (
        <div className="container">
            <div className="div-left">
                <img src={logo} alt='Logo QuizQuest' />
            </div>

            <div className="div-right">
                <div className='login'>

                    <form onSubmit={handleRegister}>
                        <h1>CADASTRE-SE</h1>

                        <label>USUÁRIO:</label>
                        <input
                            type='usuario'
                            placeholder='João da Silva'
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />

                        <label>EMAIL:</label>
                        <input
                            type='email'
                            placeholder='email@email.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {instituicao ? (
                            <div className='div-cnpj'>
                                <label>CNPJ:</label>
                                <input
                                    type='number'
                                    placeholder='00.000.000/0000-00'
                                    value={cnpj}
                                    onChange={(e) => setCNPJ(e.target.value)}
                                />
                            </div>
                        ) : (
                            <></>
                        )}

                        <label>SENHA:</label>
                        <input
                            type='password'
                            placeholder='*******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='checkBox'>
                            <input
                                type="checkbox"
                                checked={instituicao}
                                onChange={handleCheckboxChange}
                            />
                            <label>SOU INSTITUIÇÃO</label>
                        </div>

                        <button type='submit'>
                            {loadingAuth ? 'CARREGANDO...' : 'CADASTRAR'}
                        </button>

                        <Link to='/' className='newAccount'>Já tem uma conta ? Faça login!</Link>

                    </form>

                </div>
            </div>

        </div>
    )
}