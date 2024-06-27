
import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RegisterCourse() {

    const [curso, setCurso] = useState('');
    const navigate = useNavigate();

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE CURSOS'>
                    <FiUserPlus size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile'>

                        <label>DIGITE O NOME DO CURSO:*</label>
                        <input type='text' value={curso} onChange={(e) => setCurso(e.target.value)} />

                        <label>ÁREA DE CONHECIMENTO:*</label>
                        <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                            <option value='opçoes'>opções do banco</option>
                            <option value='opçoes'>opções do banco</option>
                            <option value='opçoes'>opções do banco</option>
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