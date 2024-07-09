import './home.css';

import { getDocs, collection, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useEffect, useState } from 'react';

import { FiHome, FiClipboard, FiBarChart } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Ranking from '../../components/Ranking';

import { Link } from 'react-router-dom';


export default function Home() {

    const listRefUsers = collection(db, 'users');
    const listRefQuizes = collection(db, 'quizzes');
    const [users, setUsers] = useState(0);
    const [usersRanking, setUsersRanking] = useState({});
    const [quizes, setQuizes] = useState(0);
    const [loadUsers, setLoadUsers] = useState(true);
    const [loadQuizes, setLoadQuizes] = useState(true);



    useEffect(() => {

        //BUSCANDO QUANTIDADE DE USUARIOS - TALVEZ COLOCAR O ONSNAPSHOT PARA FICAR OLHANDO O BANCO MAS NAO VEJO NECESSIDADE
        async function loadUsers() {
            const querySnapshot = await getDocs(listRefUsers)
                .then((snapshot) => {

                    //let usersRanking = [];

                    snapshot.docs.map((aluno) => {
                        usersRanking.push({
                            id: aluno.id,
                            nomeUsuario: aluno.data().nome,
                            pontos: aluno.data().pontos
                        })
                    })

                    //setUsersRanking(usersRanking);
                    //console.log(usersRanking)
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

        async function loadUsersRanking() {
            try {
                // Cria a query para ordenar os documentos pela coluna 'pontos' em ordem decrescente
                const q = query(listRefUsers, orderBy('pontos', 'desc'), limit(11));

                // Obtém os documentos da query
                console.log(q)
                const querySnapshot = await getDocs(q);

                let usersRanking = [];

                // Mapeia os documentos retornados pela query para o array usersRanking
                querySnapshot.docs.forEach((aluno) => {
                    usersRanking.push({
                        id: aluno.id,
                        nomeUsuario: aluno.data().nome,
                        pontos: aluno.data().pontos
                    });
                });

                // Define o estado com a lista de usuários ordenada
                setUsersRanking(usersRanking);
                console.log('Users Ranking:', usersRanking);

                // Define outros estados conforme necessário
                setUsers(querySnapshot.docs.length);
                setLoadUsers(false);
            } catch (e) {
                console.log(e);
                setLoadUsers(false);
                setUsers(0);
            }
        }


        loadUsersRanking();
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
                        <div className='ranking'>
                            <div className='loading-ranking'>
                                {loadUsers ? (
                                    <span style={{ fontSize: 30, marginTop: 30, fontWeight: 'bold' }}>CARREGANDO RANKING...</span>
                                ) : (
                                    <Ranking listRanking={usersRanking} />
                                )}
                            </div>
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
