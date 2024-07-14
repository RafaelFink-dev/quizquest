import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'


export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        //Ciclo de vida para ao carregar ele verifica se tem usuario e faz as ações necessárias

        async function loadUser() {
            const storageUser = localStorage.getItem('@userDetail')

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }

            setLoading(false);
        };

        loadUser();

    }, [])


    //Gravar no LocalStorage
    function storageUser(data) {
        localStorage.setItem('@userDetail', JSON.stringify(data));
    }

    //Cadastrar professor

    async function handleRegisterTeacher(email, password, name) {
        setLoadingAuth(true);

        await api.get(`&email=${email}`, {
            params: {
                key: 'PrSTju7GKesbspuFIaY8tMbPkauVW2GrGBiX'
            }
        })
            .then(async (response) => {

                if (response.data.email_status === 'VALID') {
                    await createUserWithEmailAndPassword(auth, email, password)
                        //Caso de sucesso
                        .then(async (value) => {

                            let uid = value.user.uid;

                            await setDoc(doc(db, 'users', uid), {
                                nome: name,
                                email: email,
                                professor: true,
                                avatarUrl: null,
                                pontos: 0
                            })
                                .then(() => {


                                    setLoadingAuth(false);
                                    toast.success('Professor cadastrado com sucesso!')
                                    ResetPasswordTeacher(email);
                                    return
                                })

                        })
                        .catch((error) => {

                            if (error.code === 'auth/email-already-in-use') {
                                toast.warn('E-mail já esta em uso!')
                                console.log(error.code)
                                setLoadingAuth(false);
                            }

                            setLoadingAuth(false);
                        })
                }
                else {
                    toast.warn('E-mail invalido!')
                    setLoadingAuth(false)
                }


            })
            .catch(() => {
                console.log("Erro ao validar e-mail");
            })


    }

    //Cadastrar usuário aluno/instituicao
    async function signUp(email, password, name, instituicao, endereco, nivelDeEnsino, cnpj) {
        setLoadingAuth(true);

        if (instituicao) {

            await api.get(`&email=${email}`, {
                params: {
                    key: 'PrSTju7GKesbspuFIaY8tMbPkauVW2GrGBiX'
                }
            })
                .then(async (response) => {

                    if (response.data.email_status === 'VALID') {
                        await createUserWithEmailAndPassword(auth, email, password)
                            //Caso de sucesso
                            .then(async (value) => {

                                let uid = value.user.uid;

                                await setDoc(doc(db, 'users', uid), {
                                    nome: name,
                                    email: email,
                                    cnpj: cnpj,
                                    instituicao: instituicao,
                                    endereco: endereco,
                                    nivelDeEnsino: nivelDeEnsino,
                                    avatarUrl: null,
                                    pontos: 0
                                })
                                    .then(() => {

                                        setLoadingAuth(false);
                                        toast.success('Cadastro efetuado, faça login!')
                                        navigate('/')

                                    })
                            })
                            .catch((error) => {

                                if (error.code === 'auth/weak-password') {
                                    toast.warn('A senha deve ter no mínimo 6 digitos!')
                                    console.log(error.code)
                                    setLoadingAuth(false);
                                }

                                if (error.code === 'auth/email-already-in-use') {
                                    toast.warn('E-mail já esta em uso!')
                                    console.log(error.code)
                                    setLoadingAuth(false);
                                }

                                setLoadingAuth(false);
                            })
                    }
                    else {
                        toast.warn('E-mail invalido!')
                        setLoadingAuth(false)
                        return;
                    }


                })
                .catch(() => {
                    console.log("Erro ao validar e-mail");
                    return;
                })



            return;
        }


        await api.get(`&email=${email}`, {
            params: {
                key: 'PrSTju7GKesbspuFIaY8tMbPkauVW2GrGBiX'
            }
        })
            .then(async (response) => {

                if (response.data.email_status === 'VALID') {
                    //CASO NAO FOR INSTITUIÇÃO É ALUNO--MODELO ORIGINAL
                    await createUserWithEmailAndPassword(auth, email, password)
                        //Caso de sucesso
                        .then(async (value) => {

                            let uid = value.user.uid;

                            await setDoc(doc(db, 'users', uid), {
                                nome: name,
                                email: email,
                                aluno: true,
                                avatarUrl: null,
                                pontos: 0,
                                instituicaoEnsino: '',
                                curso: '',
                                turma: ''
                            })
                                .then(() => {

                                    setLoadingAuth(false);
                                    toast.success('Cadastro efetuado, faça login!')
                                    navigate('/')

                                })
                        })
                        .catch((error) => {

                            if (error.code === 'auth/weak-password') {
                                toast.warn('A senha deve ter no mínimo 6 digitos!')
                                console.log(error.code)
                                setLoadingAuth(false);
                            }

                            if (error.code === 'auth/email-already-in-use') {
                                toast.warn('E-mail já esta em uso!')
                                console.log(error.code)
                                setLoadingAuth(false);
                            }

                            setLoadingAuth(false);
                        })
                } else {
                    toast.warn('E-mail invalido!')
                    setLoadingAuth(false)
                    return;
                }

            })
            .catch(() => {
                console.log("Erro ao validar e-mail");
                return;
            })

    }

    //LOGANDO USUÁRIO

    async function signIn(email, password) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const constRef = doc(db, 'users', uid);
                const docSnap = await getDoc(constRef);

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    email: docSnap.data().email,
                    cnpj: docSnap.data().cnpj,
                    endereco: docSnap.data().endereco,
                    instituicao: docSnap.data().instituicao,
                    professor: docSnap.data().professor,
                    aluno: docSnap.data().aluno,
                    avatarUrl: docSnap.data().avatarUrl,
                    pontos: docSnap.data().pontos,
                    instituicaoEnsino: docSnap.data().instituicaoEnsino ? docSnap.data().instituicaoEnsino.nomeInstituicao : null,
                    curso: docSnap.data().curso ? docSnap.data().curso.nomeCurso : null,
                    turma: docSnap.data().turma ? docSnap.data().turma.nomeTurma : null
    

                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem-vindo(a)!')
                navigate('/home')
            })
            .catch((error) => {

                if (error.code === 'auth/invalid-credential') {
                    toast.error('Usuário e/ou senha invalido!')
                    setLoadingAuth(false);
                }

            })
    }


    //REDEFINIR SENHA DO USUARIO PADRÃO

    async function ResetPassword(email) {
        setLoadingAuth(true);

        await api.get(`&email=${email}`, {
            params: {
                key: 'PrSTju7GKesbspuFIaY8tMbPkauVW2GrGBiX'
            }
        })
            .then((response) => {
                console.log(email)
                console.log(response.data.email_status)
                if (response.data.email_status === 'INVALID') {
                    toast.warn('E-mail invalido!')
                    setLoadingAuth(false)
                    return;
                } else {
                    sendPasswordResetEmail(auth, email)
                        .then(() => {
                            toast.success('E-mail de redefinição enviado com sucesso!')
                            navigate('/')
                            setLoadingAuth(false);
                        })
                        .catch((error) => {
                            toast.error("Erro ao enviar e-mail de redefinição");
                            setLoadingAuth(false);
                        })
                }
            })
            .catch(() => {
                console.log("Erro ao validar e-mail");
                return;
            })

    }

    //ENVIAR EMAIL SENHA PROFESSOR

    async function ResetPasswordTeacher(email) {
        setLoadingAuth(true);

        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success('E-mail para criação de senha enviado!')
                setLoadingAuth(false);
            })
            .catch((error) => {
                toast.error("Erro ao enviar e-mail de criação de senha");
                setLoadingAuth(false);
            })


    }


    //DESLOGAR USUARIO

    async function logout() {
        //Desloga o contexto, remove local storage e nulla user
        await signOut(auth);
        localStorage.removeItem('@userDetail');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            //Exportando quais informações podem acessar
            value={{
                signed: !!user,
                user,
                signUp,
                signIn,
                ResetPassword,
                handleRegisterTeacher,
                ResetPasswordTeacher,
                loadingAuth,
                loading,
                logout,
                storageUser,
                setUser
            }}

        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;


