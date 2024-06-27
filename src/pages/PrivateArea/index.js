import './privateArea.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiLock } from 'react-icons/fi';

import { Link } from 'react-router-dom';

export default function PrivateArea() {
    return (
        <div>

            <Header />

            <div className='content'>
                <Title name='ÁREA PRIVADA'>
                    <FiLock size={24} />
                </Title>

                <div className='container-profile'>
                    <div className='container-options'>
                        
                        <Link to='/registerAccount'>
                            CADASTRAR PROFESSORES
                        </Link>

                        <Link to='#'>
                            CADASTRAR PERGUNTAS
                        </Link>

                        <Link to='#'>
                            CADASTRAR QUIZ
                        </Link>

                        <Link to='/registerThemes'>
                            CADASTRAR TEMÁTICAS
                        </Link>

                        <Link to='#'>
                            VISUALIZAR INDICADORES
                        </Link>

                        <Link to='#'>
                            CADASTRAR CURSOS
                        </Link>

                        <Link to='/registerClass'>
                            CADASTRAR TURMAS
                        </Link>

                    </div>

                </div>

            </div>
        </div>
    )
}