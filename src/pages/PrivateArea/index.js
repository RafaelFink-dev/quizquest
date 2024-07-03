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

                        <Link to='/registerQuestion'>
                            CADASTRAR PERGUNTAS
                        </Link>

                        <Link to='/registerQuiz'>
                            CADASTRAR QUIZ
                        </Link>

                        <Link to='/registerThemes'>
                            CADASTRAR TEMÁTICAS
                        </Link>

                        <Link to='/viewIndicators' style={{backgroundColor: '#e8e8e8', pointerEvents: 'none'}}>
                            VISUALIZAR INDICADORES
                        </Link>

                        <Link to='/registerCourse'>
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