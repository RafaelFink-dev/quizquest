
import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';

import { addDoc, collection } from 'firebase/firestore';

export default function RegisterCourse() {

    const [curso, setCurso] = useState('');
    const [areaConhecimento, setAreaConhecimento] = useState('Ciências Agrárias');

    const navigate = useNavigate();


    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    function handleChangeSelect(e) {
        setAreaConhecimento(e.target.value);
    }

    //INSERINDO CURSO
    async function handleSubmit(e){
        e.preventDefault();

        await addDoc(collection(db, 'courses'), {
            nomeCurso: curso,
            areaConhecimento: areaConhecimento
        })
        .then(() => {
            toast.success('Curso adicionado!')
        })
        .catch(() => {
            toast.error('Erro ao adicionar curso!')
        })
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE CURSOS'>
                    <FiEdit size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile' onSubmit={handleSubmit}>

                        <label>DIGITE O NOME DO CURSO:</label>
                        <input type='text' value={curso} onChange={(e) => setCurso(e.target.value)} maxLength={100} placeholder='Digite o nome do curso' />

                        <label>ÁREA DE CONHECIMENTO:</label>
                        <select value={areaConhecimento} onChange={handleChangeSelect} className='combo-nivel-ensino'>
                            <option value='Ciências Agrárias'>Ciências Agrárias</option>
                            <option value='Ciências Biológicas'>Ciências Biológicas</option>
                            <option value='Ciências da Saúde'>Ciências da Saúde</option>
                            <option value='Ciências Exatas e da Terra'>Ciências Exatas e da Terra</option>
                            <option value='Engenharias'>Engenharias</option>
                            <option value='Ciências Humanas'>Ciências Humanas</option>
                            <option value='Ciências Sociais Aplicadas e Linguística'>Ciências Sociais Aplicadas e Linguística</option>
                            <option value='Letras e Artes'>Letras e Artes</option>
                        </select>

                        <div className='area-btn'>

                            <button className='btn-save' onClick={handleCancel}>CANCELAR</button>
                            <button type='submit' className='btn-save'>CADASTRAR</button>

                        </div>

                    </form>



                </div>

            </div>
        </div>
    )
}