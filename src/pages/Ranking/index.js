import './ranking.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiBarChart } from 'react-icons/fi';


export default function Ranking() {
    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='RANKING'>
                    <FiBarChart size={24} />
                </Title>

            </div>

        </div>
    )
}