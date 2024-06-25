import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiUser } from 'react-icons/fi';

export default function Profile(){
    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Meu perfil'>
                    <FiUser size={24}/>
                </Title>
            </div>

        </div>
    )
}