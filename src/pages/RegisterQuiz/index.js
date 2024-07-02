import './registerQuiz.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiEdit } from 'react-icons/fi';

export default function RegisterQuiz() {
    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE QUIZ'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <div className='header'>

                        <div className='div-title'>

                            <label>DIGITE O NOME DO QUIZ:</label>
                            <input placeholder='Digite o nome do quiz'></input>

                        </div>

                        <div className='div-theme'>

                            <label>TEMÁTICA:</label>
                            <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                <option value='Fácil'>Fácil</option>
                                <option value='Média'>Média</option>
                                <option value='Difícil'>Difícil</option>
                            </select>

                        </div>

                        <div className='div-difficulty'>

                            <label>DIFICULDADE:</label>
                            <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                <option value='Fácil'>Fácil</option>
                                <option value='Média'>Média</option>
                                <option value='Difícil'>Difícil</option>
                            </select>

                        </div>

                    </div>


                    <div className='middle'>

                        <div>
                            <label>QUANTIDADE DE PERGUNTAS:</label>
                            <input placeholder='Quantidade'></input>
                        </div>

                        <div className=''>
                            <label>TEMPO PARA RESPONDER CADA PERGUNTA:</label>
                            <input placeholder='00:00:00'></input>
                        </div>

                    </div>

                    <div className='questions'>

                        <label>SELECIONE AS PERGUNTAS PARA INSERIR NO QUIZ:</label>

                    </div>


                </div>

            </div>

        </div>
    )
}