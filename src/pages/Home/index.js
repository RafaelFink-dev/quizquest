import './home.css';

import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useEffect, useState } from 'react';

import { FiHome, FiClipboard, FiBarChart } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { Link } from 'react-router-dom';


export default function Home() {

    const listRefUsers = collection(db, 'users');
    const listRefQuizes = collection(db, 'quizzes');
    const [users, setUsers] = useState(0);
    const [quizes, setQuizes] = useState(0);
    const [loadUsers, setLoadUsers] = useState(true);
    const [loadQuizes, setLoadQuizes] = useState(true);



    useEffect(() => {

        //BUSCANDO QUANTIDADE DE USUARIOS - TALVEZ COLOCAR O ONSNAPSHOT PARA FICAR OLHANDO O BANCO MAS NAO VEJO NECESSIDADE
        async function loadUsers() {
            const querySnapshot = await getDocs(listRefUsers)
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

        async function loadQuizes() {
            const querySnapshot = await getDocs(listRefQuizes)
                .then((snapshot) => {

                    setQuizes(snapshot.docs.length);
                    setLoadQuizes(false);

                })
                .catch((e) => {

                    console.log(e);
                    setLoadQuizes(false);
                    setQuizes(0);

                })
        }


        loadUsers();
        loadQuizes();


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
                        <div className='ranking-title'>
                            <FiBarChart size={24} />
                            <h1>CONFIRA O RANKING DOS MELHORES COLOCADOS:</h1>
                        </div>
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

                                {
                                    loadQuizes ? (
                                        <h1>CARREGANDO..</h1>
                                    ) : (

                                        <h1>{quizes}</h1>
                                    )
                                }

                            </div>

                        </div>

                        <div className='indicators-quiz'>

                            <div className='indicators-title'>
                                <FiClipboard size={24} />
                                <h1>CONFIRA OS QUIZES MAIS ACESSADOS:</h1>
                            </div>

                            <div className='indicators-infos'>
                                <div>
                                    <Link to='/quiz'>
                                        CLIQUE AQUI E CONFIRA
                                    </Link>
                                </div>
                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </div>
    )
}
