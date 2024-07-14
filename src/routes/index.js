import { Routes, Route } from "react-router-dom";

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';
import Home from "../pages/Home";
import Private from "./Private";
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
            <Route path="/privateArea" element={ <Private> <PrivateArea /> </Private> } />
            <Route path="/registerAccount" element={ <Private> <RegisterAccount /> </Private> } />
            <Route path="/registerThemes" element={ <Private> <RegisterThemes /> </Private> } />
            <Route path="/registerClass" element={ <Private> <RegisterClass /> </Private> } />
            <Route path="/registerCourse" element={ <Private> <RegisterCourse /> </Private> } />
            <Route path="/registerQuestion" element={ <Private> <RegisterQuestion /> </Private> } />
            <Route path="/registerQuiz" element={ <Private> <RegisterQuiz /> </Private> } />
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