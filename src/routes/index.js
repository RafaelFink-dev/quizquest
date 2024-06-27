import { Routes, Route } from "react-router-dom";

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from "../pages/Dashboard";
import Private from "./Private";
import Profile from "../pages/Profile";
import PrivateArea from '../pages/PrivateArea';
import RegisterAccount from '../pages/RegisterAccount';
import RegisterThemes from '../pages/RegisterThemes';
import RegisterClass from '../pages/RegisterClass';
import RegisterCourse from '../pages/RegisterCourse';



function RoutesApp() {
    return (
        <Routes>

            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            <Route path="/home" element={ <Private> <Dashboard /> </Private> } />
            <Route path="/profile" element={ <Private> <Profile /> </Private> } />
            <Route path="/privateArea" element={ <Private> <PrivateArea /> </Private> } />
            <Route path="/registerAccount" element={ <Private> <RegisterAccount /> </Private> } />
            <Route path="/registerThemes" element={ <Private> <RegisterThemes /> </Private> } />
            <Route path="/registerClass" element={ <Private> <RegisterClass /> </Private> } />
            <Route path="/registerCourse" element={ <Private> <RegisterCourse /> </Private> } />
            

        </Routes>
    )
}

export default RoutesApp;