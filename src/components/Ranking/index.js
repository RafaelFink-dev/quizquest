import './ranking.css'

import avatarImg from '../../assets/avatar2.png'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

export default function Ranking({ listRanking = [] }) {

    const { user } = useContext(AuthContext);

    return (
        <div className='container-ranking'>

            <div className='title-ranking-div'>
                <div>
                    <h1>PARTICIPANTE</h1>
                    <h1>PONTOS</h1>
                </div>
            </div>

            <div style={{ color: '#121212' }} className='list-ranking'>
                {listRanking.map((retorno, index) => (
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
    )
}
