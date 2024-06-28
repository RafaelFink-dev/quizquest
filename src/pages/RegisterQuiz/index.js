import './registerQuiz.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiEdit } from 'react-icons/fi';

export default function RegisterQuiz() {
    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE QUIZ'>
                    <FiEdit size={24} />
                </Title>


            </div>

        </div>
    )
}