import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //Gravar no LocalStorage
    function storageUser(data) {
        localStorage.setItem('@userDetail', JSON.stringify(data));
    }

    //Cadastrar usuário
    async function signUp(email, password, name, instituicao) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
            //Caso de sucesso
            .then(async (value) => {

                let uid = value.user.uid;

                await setDoc(doc(db, 'users', uid), {
                    nome: name,
                    instituicao: instituicao,
                    avatarUrl: null
                })
                    .then(() => {

                        let data = {
                            uid: uid,
                            nome: name,
                            email: value.user.email,
                            instituicao: instituicao,
                            avatarUrl: null
                        };

                        storageUser(data);
                        setUser(data);
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
                    email: value.user.email,
                    instituicao: value.user.instituicao,
                    avatarUrl: docSnap.data().avatarUrl
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem-vindo(a)!')
                navigate('/dashboard')
            })
            .catch((error) => {

                if (error.code === 'auth/invalid-credential') {
                    toast.error('Usuário e/ou senha invalido!')
                    setLoadingAuth(false);
                }

            })
    }

    return (
        <AuthContext.Provider
        //Exportando quais informações podem acessar
            value={{
                signed: !!user,
                user,
                signUp,
                signIn,
                loadingAuth,
            }}

        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;


