import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import { useContext } from 'react';


export default function Dashboard() {

    const { logout } = useContext(AuthContext);

    async function handleLogout() {
        await logout();
    }

    return (
        <div className=''>

            <Header />
            <div className='content'>
                <h1>PAGINA Dashboard</h1>
                <button onClick={handleLogout}>SAIR DA CONTA</button>
            </div>
        </div>
    )
}
