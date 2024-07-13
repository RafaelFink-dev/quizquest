import Header from '../../components/Header';
import Title from '../../components/Title';

import './profile.css'

import { FiUser, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar2.png';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { doc, updateDoc, getDocs, collection, where, query,  limit } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {

    const { user, storageUser, setUser } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [cnpj, setCNPJ] = useState(user && user.cnpj);
    const [endereco, setEndereco] = useState(user && user.endereco);


    //REFERENCIA PARA COLEÇÃO DE CURSOS
    const listRef = collection(db, 'courses');
    const listRefTurmas = collection(db, 'turmas');
    const listRefInstituicao = collection(db, 'users');
    const [cursos, setCursos] = useState([]);
    const [loadCourses, setLoadCourses] = useState(true);
    const [courseSelected, setCourseSelected] = useState(0);
    const [turmas, setTurmas] = useState([]);
    const [turmaSelected, setTurmaSelected] = useState(0);
    const [instituicao, setInstituicao] = useState([]);
    const [instituicaoSelected, setInstituicaoSelected] = useState(0);


    useEffect(() => {

        if (!user.instituicao) {


            //CARREGAR CURSOS AO ABRIR A TELA
            async function loadCourses() {
                const querySnapshot = await getDocs(listRef)
                    .then((snapshot) => {
                        //LISTA PARA ADD CURSOS
                        let lista = []

                        snapshot.forEach((course) => {
                            lista.push({
                                id: course.id,
                                nomeCurso: course.data().nomeCurso
                            })
                        })

                        if (snapshot.docs.size === 0) {
                            setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                            setLoadCourses(false);
                            return;
                        }

                        setCursos(lista);
                        setLoadCourses(false);
                    })
                    .catch((e) => {
                        console.log(e);
                        setLoadCourses(false);
                        setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                    })
            }

            async function loadTurmas() {
                const querySnapshot = await getDocs(listRefTurmas)
                    .then((snapshot) => {
                        //LISTA PARA ADD CURSOS
                        let lista = []

                        snapshot.forEach((turma) => {
                            lista.push({
                                id: turma.id,
                                nomeTurma: turma.data().nomeTurma
                            })
                        })

                        if (snapshot.docs.size === 0) {
                            setTurmas([{ id: 1, nomeTurma: 'NENHUMA TURMA ENCONTRADA' }]);
                            setLoadCourses(false);
                            return;
                        }

                        setTurmas(lista);
                        setLoadCourses(false);
                    })
                    .catch((e) => {
                        console.log(e);
                        setLoadCourses(false);
                        setTurmas([{ id: 1, nomeTurma: 'NENHUMA TURMA ENCONTRADA' }]);
                    })
            }

            async function loadInstituicao() {

                const q = query(listRefInstituicao, where('instituicao', '==', true));

                const querySnapshot = await getDocs(q)
                    .then((snapshot) => {
                        //LISTA PARA ADD CURSOS
                        let lista = []

                        snapshot.forEach((instituicao) => {
                            lista.push({
                                id: instituicao.id,
                                nomeInstituicao: instituicao.data().nome
                            })
                        })

                        if (snapshot.docs.size === 0) {
                            setInstituicao([{ id: 1, nomeInstituicao: 'NENHUMA INSITUICAO ENCONTRADA' }]);
                            setLoadCourses(false);
                            return;
                        }

                        setInstituicao(lista);
                        setLoadCourses(false);
                    })
                    .catch((e) => {
                        console.log(e);
                        setLoadCourses(false);
                        setInstituicao([{ id: 1, nomeInstituicao: 'NENHUMA INSITUICAO ENCONTRADA' }]);
                    })
            }

            loadTurmas();
            loadCourses();
            loadInstituicao();
        }

    }, [])

    function handleChangeCourse(e) {
        setCourseSelected(e.target.value);
    }

    function handleChangeTurma(e) {
        setTurmaSelected(e.target.value);
    }

    function handleChangeInstituicao(e) {
        setInstituicaoSelected(e.target.value);
    }



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

        if (imageAvatar === null && nome !== user.nome) {
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
                                <input
                                    type='text'
                                    placeholder='00.000.000/0000-00'
                                    value={cnpj}
                                    maxLength={18}
                                    onChange={(e) => {
                                        let formattedCNPJ = e.target.value.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos
                                        if (formattedCNPJ.length > 14) {
                                            formattedCNPJ = formattedCNPJ.substring(0, 14); // Limita a 14 caracteres
                                        }
                                        // Formata o CNPJ com pontos e traços
                                        formattedCNPJ = formattedCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                                        setCNPJ(formattedCNPJ);
                                    }}
                                />

                                <label>ENDEREÇO:</label>
                                <input type='text' value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            </div>
                        ) : (
                            <div className='form-profile-boolean'>
                                <label>INSTITUIÇÃO DE ENSINO:</label>
                                {
                                    loadCourses ? (
                                        <input
                                            type='text'
                                            disabled={true}
                                            value='Carregando...'
                                        />
                                    ) : (
                                        <select value={instituicaoSelected} onChange={handleChangeInstituicao} className='combo-nivel-ensino'>
                                            {instituicao.map((item, index) => {
                                                return (
                                                    <option key={index} value={index}>
                                                        {item.nomeInstituicao}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    )
                                }

                                <label>CURSO:</label>
                                {
                                    loadCourses ? (
                                        <input
                                            type='text'
                                            disabled={true}
                                            value='Carregando...'
                                        />
                                    ) : (
                                        <select value={courseSelected} onChange={handleChangeCourse} className='combo-nivel-ensino'>
                                            {cursos.map((item, index) => {
                                                return (
                                                    <option key={index} value={index}>
                                                        {item.nomeCurso}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    )
                                }

                                <label>TURMA:</label>
                                {
                                    loadCourses ? (
                                        <input
                                            type='text'
                                            disabled={true}
                                            value='Carregando...'
                                        />
                                    ) : (
                                        <select value={turmaSelected} onChange={handleChangeTurma} className='combo-nivel-ensino'>
                                            {turmas.map((item, index) => {
                                                return (
                                                    <option key={index} value={index}>
                                                        {item.nomeTurma}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    )
                                }
                            </div>
                        )}


                        <button type='submit' className='btn-save'>SALVAR ALTERAÇÕES</button>

                    </form>
                </div>
            </div>

        </div>
    )
}