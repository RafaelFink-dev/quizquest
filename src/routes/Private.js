import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from '../contexts/auth';

export default function Private({ children }){

    const { signed, loading } = useContext(AuthContext);

    //Loading para o usuario nao ver nada enquanto carrega

    if(loading){
        return (
            <div></div>
        )
    }

    //Verifica se nao estiver logado barra, caso esteja deixa o filho exibir

    if (!signed){
        return <Navigate to='/'/>
    }

    return children;
}