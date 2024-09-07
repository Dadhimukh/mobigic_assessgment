import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from '../pages/LandingPage';
import Homepage from '../pages/Homepage';
import Signup from '../pages/SignUp';

// Private route component
const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.token);

    return token && token.length > 2 ? children : <Navigate to="/" />;
};

const Router = () => {
    return (
        <Routes>
            <Route path="/sign_up" element={<Signup />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Homepage />
                    </PrivateRoute>
                }
            ></Route>
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    );
};

export default Router;
