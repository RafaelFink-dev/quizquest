import './home.css';

import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useEffect, useState } from 'react';

import { FiHome, FiClipboard } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';


export default function Home() {

    const listRef = collection(db, 'users');
    const [users, setUsers] = useState(0);
    const [loadUsers, setLoadUsers] = useState(true);

    useEffect(() => {

        //BUSCANDO QUANTIDADE DE USUARIOS - TALVEZ COLOCAR O ONSNAPSHOT PARA FICAR OLHANDO O BANCO MAS NAO VEJO NECESSIDADE
        async function loadUsers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {

                    setUsers(snapshot.docs.length);
                    setLoadUsers(false);

                })
                .catch((e) => {

                    console.log(e);
                    setLoadUsers(false);
                    setUsers(0);

                })
        }

        loadUsers();


    }, [])

    return (
        <div>

            <Header />
            <div className='home-content'>

                <Title name='HOME'>
                    <FiHome size={24} />
                </Title>

                <div className='home-container'>

                    <div className='home-div-left'>
                        <h1>ESQUERDA</h1>
                    </div>

                    <div className='home-div-right'>

                        <div className='indicators'>

                            <div className='header-indicators'>
                                <h1>INDICADORES - QUIZQUEST</h1>
                            </div>

                            <div className='header-infos'>
                                <h1>NÚMERO TOTAL DE PARTICIPANTES:</h1>

                                {
                                    loadUsers ? (
                                        <h1>CARREGANDO..</h1>
                                    ) : (
                                        
                                        <h1>{users}</h1>
                                    )
                                }


                            </div>

                            <div className='header-infos'>
                                <h1>TOTAL DE QUIZES CADASTRADOS:</h1>
                                <h1>0</h1>
                            </div>

                        </div>

                        <div className='indicators-quiz'>

                            <div className='indicators-title'>
                                <FiClipboard size={24} />
                                <h1>CONFIRA OS QUIZES MAIS ACESSADOS:</h1>
                            </div>

                            <div className='indicators-infos'>
                                <button type='submit' className='btn-save-indicator'><label>CLIQUE AQUI E CONFIRA</label></button>
                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </div>
    )
}
