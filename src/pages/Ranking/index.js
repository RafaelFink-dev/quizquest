import './rankingPage.css'

import { getDocs, collection, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { useEffect, useState } from 'react';


import { FiBarChart } from 'react-icons/fi';




export default function Ranking() {

    const listRefUsers = collection(db, 'users');
    const listRefQuizes = collection(db, 'quizzes');
    const [users, setUsers] = useState(0);
    const [usersRanking, setUsersRanking] = useState([]);
    const [quizes, setQuizes] = useState(0);
    const [loadUsers, setLoadUsers] = useState(true);
    const [loadQuizes, setLoadQuizes] = useState(true);

    useEffect(() => {


        async function loadUsersRanking() {
            try {
                // Cria a query para ordenar os documentos pela coluna 'pontos' em ordem decrescente
                const q = query(listRefUsers, orderBy('pontos', 'desc'));

                // Obtém os documentos da query
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

                // Define outros estados conforme necessário
                setLoadUsers(false);
            } catch (e) {
                console.log(e);
                setLoadUsers(false);
                setUsers(0);
            }
        }

        loadUsersRanking();

    }, [])



    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='RANKING'>
                    <FiBarChart size={24} />
                </Title>

                <div className='container-profile'>
                    <div className='container-ranking-page'>

                        <div className='container-ranking'>

                            <h1 className='title-ranking'>CONFIRA O RANKING DE TODOS PARTICIPANTES!</h1>


                            <div className='title-ranking-div'>
                                <div>
                                    <h1>PARTICIPANTE</h1>
                                    <h1>PONTOS</h1>
                                </div>
                            </div>

                            <div style={{ color: '#121212' }} className='list-ranking'>
                                {usersRanking.map((retorno, index) => (
                                    <div key={retorno.id} className='list-ranking-div'>
                                        <div className='list-ranking-div-posicao'>
                                            <h1 style={{ color: '#121212' }}>{index + 1}</h1>
                                        </div>
                                        <div className='list-ranking-div-nome'>
                                            <h1 style={{ color: '#FFF' }}>{retorno.nomeUsuario.toUpperCase()}</h1>
                                        </div>
                                        <div className='list-ranking-div-pontos'>
                                            <h1>{retorno.pontos ? retorno.pontos : 0}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>


    )
}
