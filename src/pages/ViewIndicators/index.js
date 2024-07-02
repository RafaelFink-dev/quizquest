import './viewIndicators.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiBarChart2 } from 'react-icons/fi';

export default function ViewIndicators() {
    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - VISUALIZAR INDICADORES'>
                    <FiBarChart2 size={24} />
                </Title>

            </div>

        </div>
    )
}