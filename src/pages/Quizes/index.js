import './quizes.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiHelpCircle } from 'react-icons/fi';


export default function Quizes() {
    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='QUIZ'>
                    <FiHelpCircle size={24} />
                </Title>

            </div>

        </div>
    )
}