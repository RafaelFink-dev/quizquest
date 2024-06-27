
import { AuthContext } from '../../contexts/auth';
import { useContext } from 'react';

import { FiBarChart } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';


export default function Dashboard() {

    const { logout } = useContext(AuthContext);

    return (
        <div>

            <Header />
            <div className='content'>
                <Title name='HOME'>
                    <FiBarChart size={24} />
                </Title>
            </div>
        </div>
    )
}
