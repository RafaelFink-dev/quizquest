import { Routes, Route } from "react-router-dom";

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';
import Home from "../pages/Home";
import Private from "./Private";
import PrivateAdmin from "./PrivateAdmin";
import Profile from "../pages/Profile";
import PrivateArea from '../pages/PrivateArea';
import RegisterAccount from '../pages/RegisterAccount';
import RegisterThemes from '../pages/RegisterThemes';
import RegisterClass from '../pages/RegisterClass';
import RegisterCourse from '../pages/RegisterCourse';
import RegisterQuestion from '../pages/RegisterQuestion';
import RegisterQuiz from '../pages/RegisterQuiz';
import Quizes from '../pages/Quizes';
import Ranking from '../pages/Ranking';
import QuizStart from '../pages/QuizStart';
import QuizInProgress from '../pages/QuizInProgress';



function RoutesApp() {
    return (
        <Routes>

            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            <Route path="/home" element={ <Private> <Home /> </Private> } />
            <Route path="/profile" element={ <Private> <Profile /> </Private> } />
            <Route path="/privateArea" element={ <Private> <PrivateAdmin> <PrivateArea /> </PrivateAdmin> </Private> } />
            <Route path="/registerAccount" element={ <Private> <PrivateAdmin> <RegisterAccount /> </PrivateAdmin> </Private> } />
            <Route path="/registerThemes" element={ <Private> <PrivateAdmin> <RegisterThemes /> </PrivateAdmin> </Private> } />
            <Route path="/registerClass" element={ <Private> <PrivateAdmin> <RegisterClass /> </PrivateAdmin> </Private> } />
            <Route path="/registerCourse" element={ <Private> <PrivateAdmin> <RegisterCourse /> </PrivateAdmin> </Private> } />
            <Route path="/registerQuestion" element={ <Private> <PrivateAdmin> <RegisterQuestion /> </PrivateAdmin> </Private> } />
            <Route path="/registerQuiz" element={ <Private> <PrivateAdmin> <RegisterQuiz /> </PrivateAdmin> </Private> } />
            <Route path="/quiz" element={ <Private> <Quizes /> </Private> } />
            <Route path="/ranking" element={ <Private> <Ranking /> </Private> } />
            <Route path="/quiz-start/:id" element={ <Private> <QuizStart /> </Private> } />
            <Route path="/quiz-in-progress/:id" element={ <Private> <QuizInProgress /> </Private> } />

            {/*AQUI VAI O NOT FOUND */}
            {/*<Route path="*" element={ <Private> <Home /> </Private> } />*/}
            

        </Routes>
    )
}

export default RoutesApp;