//import './signin.css';
import logo from '../../assets/logo.png';

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

export default function ResetPassword() {

    const [email, setEmail] = useState('');

    const { ResetPassword, loadingAuth } = useContext(AuthContext);

    async function handleReset(e) {
        e.preventDefault(); 

        if (email !== '') {
            await ResetPassword(email)
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

                    <form onSubmit={handleReset}>
                        <h1>REDEFINIR SENHA</h1>

                        <label>EMAIL:</label>
                        <input
                            type='email'
                            placeholder='email@email.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button type='submit'>
                            {loadingAuth ? 'ENVIANDO...' : 'ENVIAR EMAIL DE REDEFINIÇÃO'}
                        </button>

                        <Link to='/' className='newAccount'>Voltar a tela de login</Link>

                    </form>

                </div>
            </div>

        </div>
    )
}