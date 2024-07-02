import './header.css'
import avatarImg from '../../assets/avatar2.png'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import { FiHome, FiHelpCircle, FiBarChart, FiUser, FiLock } from 'react-icons/fi';

export default function Header() {

    const { user, logout } = useContext(AuthContext);

    async function handleLogout() {
        await logout();
    }

    return (
        <div className="sidebar">
            <div className='sidebar-header'>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
                <h2>Seja bem-vindo(a):</h2>
                <h2>{user.nome}</h2>
                <h3>Sua pontuação: {user.pontos} pontos</h3>
            </div>

            <div className="sidebar-middle">
                <Link to='/home'>
                    <FiHome color='#121212' size={24} />
                    HOME
                </Link>

                <Link to='/quiz'>
                    <FiHelpCircle color='#121212' size={24} />
                    QUIZ
                </Link>

                <Link to='/ranking'>
                    <FiBarChart color='#121212' size={24} />
                    RANKING
                </Link>

                <Link to='/profile'>
                    <FiUser color='#121212' size={24} />
                    PERFIL
                </Link>
            </div>


            <div className='sidebar-footer'>
                <>
                    {user.instituicao === true || user.professor === true ?
                        <>
                            <Link to='/privateArea'>
                                <FiLock color='#121212' size={24} />
                                ÁREA PRIVADA
                            </Link>
                        </> : <></>}

                </>

                <Link to='#' onClick={handleLogout}>
                    <FiUser color='#121212' size={24} />
                    SAIR DO SISTEMA
                </Link>
            </div>

        </div>

    )
}