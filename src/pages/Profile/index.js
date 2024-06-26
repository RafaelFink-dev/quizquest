import Header from '../../components/Header';
import Title from '../../components/Title';

import './profile.css'

import { FiUser, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar2.png';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {

    const { user, storageUser, setUser } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image); //Arquivo da imagem a enviar
                setAvatarUrl(URL.createObjectURL(image)) //Criando URL para enviar
            } else {
                toast.warn('Envie uma imagem em PNG ou JPG!')
                setAvatarUrl(null);
                return;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/imagePerfil`);

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
            .then((snapshot) => {

                getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
                    let urlImage = downloadUrl;

                    const docRef = doc(db, 'users', user.uid);
                    await updateDoc(docRef, {
                        avatarUrl: urlImage,
                        nome: nome
                    })
                        .then(() => {

                            let data = { //pegando todas infos e atualizando somente o que precisa
                                ...user,
                                nome: nome,
                                avatarUrl: urlImage
                            }

                            setUser(data);
                            storageUser(data);
                            toast.success('Informações alteradas com sucesso!')

                        })
                })

            })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (imageAvatar === null && nome !== '') {
            //Atualizar somente o nome
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef, {
                nome: nome
            })
                .then(() => {
                    let data = { //pegando todas infos e atualizando somente o que precisa
                        ...user,
                        nome: nome
                    }

                    setUser(data);
                    storageUser(data);
                    toast.success('Informações alteradas com sucesso!')
                })
        } else if (nome !== '' && imageAvatar !== null) {
            //Atualizar nome e imagem
            handleUpload();
        }
    }

    return (
        <div>
            <Header />

            <div className='content'>
                <Title name='MEU PERFIL'>
                    <FiUser size={24} />
                </Title>

                <div className='container-profile'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>

                            <span>
                                <FiUpload size={30} />
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile} /> <br />

                            {avatarUrl === null ? (
                                <img src={avatar} alt='Foto do usuário' width={280} height={280} />
                            ) : (
                                <img src={avatarUrl} alt='Foto do usuário' width={210} height={210} />
                            )}

                        </label>



                        <label>NOME:</label>
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>EMAIL:</label>
                        <input type='text' disabled={true} value={email} />

                        {user.instituicao === true ? (
                            <div className='form-profile-boolean'>
                                <label>CNPJ:</label>
                                <input type='number' placeholder='00.000.000/0000-00' />

                                <label>ENDEREÇO:</label>
                                <input type='text' placeholder='Rua São João' />
                            </div>
                        ) : (
                            <div className='form-profile-boolean'>
                                <label>INSTITUIÇÃO DE ENSINO:</label>
                                <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                </select>

                                <label>CURSO:</label>
                                <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                </select>

                                <label>TURMA:</label>
                                <select value={''} onChange={() => { }} className='combo-nivel-ensino'>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                    <option value='opçoes'>opções do banco</option>
                                </select>
                            </div>
                        )}


                        <button type='submit' className='btn-save'>SALVAR ALTERAÇÕES</button>

                    </form>
                </div>
            </div>

        </div>
    )
}