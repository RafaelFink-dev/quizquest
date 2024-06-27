import './registerThemes.css'

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RegisterThemes() {

    const [tematica, setTematica] = useState('');
    const navigate = useNavigate();

    function handleCancel() {
        navigate('/privateArea')
        toast.warn('Operação cancelada!')
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='ÁREA PRIVADA - CADASTRO DE TEMÁTICAS'>
                    <FiUserPlus size={24} />
                </Title>

                <div className='container-profile'>

                    <form className='form-profile'>

                        <label>DIGITE O NOME DA TEMÁTICA:*</label>
                        <input type='text' value={tematica} onChange={(e) => setTematica(e.target.value)} />

                        <label>CURSO:*</label>
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