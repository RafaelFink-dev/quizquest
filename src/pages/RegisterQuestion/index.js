import './registerQuestion.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiEdit } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterQuestion() {

    const navigate = useNavigate();


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    return (
        <div>

            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE PERGUNTAS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>


                    <div className='header-options'>

                        <div className='div-themes'>
                            <label>TEMÁTICA:</label>
                            <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                <option value='opçoes'>opções do banco</option>
                                <option value='opçoes'>opções do banco</option>
                                <option value='opçoes'>opções do banco</option>
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

                    <form className='form-profile'>
                        <label>DIGITE A PERGUNTA:</label>
                        <textarea placeholder='Digite sua pergunta'></textarea>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 1:</label>
                                <div className='checkbox-container'>
                                    <input type="checkbox"/>
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 2:</label>
                                <div className='checkbox-container'>
                                    <input type="checkbox" />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 3:</label>
                                <div className='checkbox-container'>
                                    <input type="checkbox" />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>ALTERNATIVA 4:</label>
                                <div className='checkbox-container'>
                                    <input type="checkbox" />
                                    <label>ALTERNATIVA CORRETA</label>
                                </div>

                            </div>

                            <textarea placeholder='Digite sua alternativa'></textarea>

                        </div>

                        <div className='container-alternativas'>

                            <div className='alternativa'>

                                <label>GABARITO DA QUESTÃO CORRETA:</label>

                            </div>

                            <textarea placeholder='Digite o gabarito'></textarea>

                        </div>

                        <div className='area-btn-other'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                            <button type='submit' className='btn-save'>CADASTRAR</button>

                        </div>

                    </form>



                </div>

            </div>


        </div>
    )
}