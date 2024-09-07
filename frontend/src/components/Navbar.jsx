import React from 'react';
import './Navbar.css';
import { Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../featuresRedux/auth/action';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        try {
            dispatch(logout());
            message.success('Logged out successfully.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            message.error('Logout failed. Please try again.');
        }
    };

    return (
        <div className="navbar">
            <div className="logo">Name</div>
            <div className="nav-links">
                <a href="#">Home</a>
                <a href="#">Pricing</a>
                <a href="#">Events</a>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
            </div>
            <Button
                type="primary"
                onClick={handleLogout}
                style={{
                    backgroundColor: '#1877f2',
                    borderColor: '#1877f2',
                }}
            >
                Log Out
            </Button>
        </div>
    );
};

export default Navbar;
