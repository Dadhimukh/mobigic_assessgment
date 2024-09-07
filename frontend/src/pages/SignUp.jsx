import React from 'react';
import { Typography } from 'antd';
import Register from './Register';
import 'antd/dist/reset.css';
import './Signup.css';

const { Title, Paragraph } = Typography;

const Signup = () => {
    return (
        <div className="container">
            <div className="signup-container">
                <div className="image-section"></div>
                <div className="form-section">
                    <Register />
                </div>
            </div>
        </div>
    );
};

export default Signup;
