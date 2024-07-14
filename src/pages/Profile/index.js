import Header from '../../components/Header';
import Title from '../../components/Title';

import './profile.css';

import { FiUser, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar2.png';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { doc, updateDoc, getDocs, collection, where, query } from 'firebase/firestore';
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
        async function loadCourses() {
            try {
                const snapshot = await getDocs(listRef);
                let lista = [];
                snapshot.forEach((course) => {
                    lista.push({
                        id: course.id,
                        nomeCurso: course.data().nomeCurso,
                    });
                });

                if (lista.length === 0) {
                    setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
                } else {
                    setCursos(lista);
                }
            } catch (e) {
                console.log(e);
                setCursos([{ id: 1, nomeCurso: 'NENHUM CURSO ENCONTRADO' }]);
            } finally {
                setLoadCourses(false);
            }
        }

        async function loadTurmas() {
            try {
                const snapshot = await getDocs(listRefTurmas);
                let lista = [];
                snapshot.forEach((turma) => {
                    lista.push({
                        id: turma.id,
                        nomeTurma: turma.data().nomeTurma,
                    });
                });

                if (lista.length === 0) {
                    setTurmas([{ id: 1, nomeTurma: 'NENHUMA TURMA ENCONTRADA' }]);
                } else {
                    setTurmas(lista);
                }
            } catch (e) {
                console.log(e);
                setTurmas([{ id: 1, nomeTurma: 'NENHUMA TURMA ENCONTRADA' }]);
            } finally {
                setLoadCourses(false);
            }
        }

        async function loadInstituicao() {
            try {
                const q = query(listRefInstituicao, where('instituicao', '==', true));
                const snapshot = await getDocs(q);
                let lista = [];
                snapshot.forEach((instituicao) => {
                    lista.push({
                        id: instituicao.id,
                        nomeInstituicao: instituicao.data().nome,
                    });
                });

                if (lista.length === 0) {
                    setInstituicao([{ id: 1, nomeInstituicao: 'NENHUMA INSTITUIÇÃO ENCONTRADA' }]);
                } else {
                    setInstituicao(lista);
                }
            } catch (e) {
                console.log(e);
                setInstituicao([{ id: 1, nomeInstituicao: 'NENHUMA INSTITUIÇÃO ENCONTRADA' }]);
            } finally {
                setLoadCourses(false);
            }
        }

        if (!user.instituicao) {
            loadTurmas();
            loadCourses();
            loadInstituicao();
        }
    }, [user]);

    useEffect(() => {
        if (!user.instituicao && user.instituicaoEnsino && instituicao.length > 0) {
            const selectedIndex = instituicao.findIndex(item => item.nomeInstituicao === user.instituicaoEnsino);
            if (selectedIndex !== -1) {
                setInstituicaoSelected(selectedIndex);
            }
        }
    }, [user, instituicao]);

    useEffect(() => {
        if (!user.instituicao && user.curso && cursos.length > 0) {
            const selectedIndex = cursos.findIndex(item => item.nomeCurso === user.curso);
            if (selectedIndex !== -1) {
                setCourseSelected(selectedIndex);
            }
        }
    }, [user, cursos]);

    useEffect(() => {
        if (!user.instituicao && user.turma && turmas.length > 0) {
            const selectedIndex = turmas.findIndex(item => item.nomeTurma === user.turma);
            if (selectedIndex !== -1) {
                setTurmaSelected(selectedIndex);
            }
        }
    }, [user, turmas]);

    function handleChangeCourse(e) {
        setCourseSelected(Number(e.target.value));
    }

    function handleChangeTurma(e) {
        setTurmaSelected(Number(e.target.value));
    }

    function handleChangeInstituicao(e) {
        setInstituicaoSelected(Number(e.target.value));
    }

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image); //Arquivo da imagem a enviar
                setAvatarUrl(URL.createObjectURL(image)) //Criando URL para enviar
            } else {
                toast.warn('Envie uma imagem em PNG ou JPG!');
                setAvatarUrl(null);
                return;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/imagePerfil`);

        const snapshot = await uploadBytes(uploadRef, imageAvatar);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
            avatarUrl: downloadUrl,
            nome: nome,
        });

        let data = {
            ...user,
            nome: nome,
            avatarUrl: downloadUrl,
        };

        setUser(data);
        storageUser(data);
        toast.success('Informações alteradas com sucesso! Imagem');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const instituicaoAtualizada = instituicao[instituicaoSelected]?.nomeInstituicao || user.instituicaoEnsino;
        const cursoAtualizado = cursos[courseSelected]?.nomeCurso || user.curso;
        const turmaAtualizada = turmas[turmaSelected]?.nomeTurma || user.turma;

        const docRef = doc(db, 'users', user.uid);

        if (!user.instituicao) {
            if (imageAvatar !== null || nome !== user.nome || instituicaoAtualizada !== user.instituicaoEnsino || cursoAtualizado !== user.curso || turmaAtualizada !== user.turma) {
                await updateDoc(docRef, {
                    nome: nome,
                    instituicaoEnsino: instituicaoAtualizada,
                    curso: cursoAtualizado,
                    turma: turmaAtualizada,
                }).then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        instituicaoEnsino: instituicaoAtualizada,
                        curso: cursoAtualizado,
                        turma: turmaAtualizada,
                    };

                    setUser(data);
                    storageUser(data);

                    if (imageAvatar !== null) {
                        handleUpload();
                    } else {
                        toast.success('Informações alteradas com sucesso!');
                    }
                });
            }
        } else {
            if (imageAvatar === null || nome !== user.nome || cnpj !== user.cnpj || endereco !== user.endereco) {
                await updateDoc(docRef, {
                    nome: nome,
                    cnpj: cnpj,
                    endereco: endereco,
                }).then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        cnpj: cnpj,
                        endereco: endereco,
                    };

                    setUser(data);
                    storageUser(data);
                    toast.success('Informações alteradas com sucesso!');
                });
            } else if (nome !== '' || imageAvatar !== null) {
                handleUpload();
            }
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiUser color="#000" size={25} />
                </Title>
                <div className='container-profile'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} /><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuário" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuário" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        {user.instituicao === true && (
                            <>
                                <label>CNPJ</label>
                                <input type="text" value={cnpj} onChange={(e) => setCNPJ(e.target.value)} />

                                <label>Endereço</label>
                                <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            </>
                        )}

                        {!user.instituicao && (
                            <>
                                <label>Instituição de ensino</label>
                                <select value={instituicaoSelected} onChange={handleChangeInstituicao}>
                                    {instituicao.map((item, index) => (
                                        <option key={index} value={index}>
                                            {item.nomeInstituicao}
                                        </option>
                                    ))}
                                </select>

                                <label>Curso</label>
                                <select value={courseSelected} onChange={handleChangeCourse}>
                                    {cursos.map((item, index) => (
                                        <option key={index} value={index}>
                                            {item.nomeCurso}
                                        </option>
                                    ))}
                                </select>

                                <label>Turma</label>
                                <select value={turmaSelected} onChange={handleChangeTurma}>
                                    {turmas.map((item, index) => (
                                        <option key={index} value={index}>
                                            {item.nomeTurma}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <button type="submit" className='btn-save'>SALVAR</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
