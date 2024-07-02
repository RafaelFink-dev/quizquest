import './home.css';

import { AuthContext } from '../../contexts/auth';
import { useContext } from 'react';

import { FiHome } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';


export default function Home() {

    const { logout } = useContext(AuthContext);

    return (
        <div>

            <Header />
            <div className='content'>

                <Title name='HOME'>
                    <FiHome size={24} />
                </Title>


            </div>
        </div>
    )
}
