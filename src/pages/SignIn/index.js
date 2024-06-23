import './signin.css';
import logo from '../../assets/logo.png';

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext);

    async function handleSignIn(e) {
        e.preventDefault(); 

        if (email !== '' && password !== '') {
            await signIn(email, password )
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

                    <form onSubmit={handleSignIn}>
                        <h1>LOGIN</h1>

                        <label>EMAIL:</label>
                        <input
                            type='email'
                            placeholder='email@email.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>SENHA:</label>
                        <input
                            type='password'
                            placeholder='*******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type='submit'>
                            {loadingAuth ? 'CARREGANDO...' : 'ACESSAR'}
                        </button>

                        <Link to='/register' className='newAccount'>Não tem uma conta ? Crie já!</Link>

                    </form>

                </div>
            </div>

        </div>
    )
}