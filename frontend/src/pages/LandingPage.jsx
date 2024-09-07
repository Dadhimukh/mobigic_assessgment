import React from 'react';
import { Button, Card, Typography, Layout } from 'antd';
import { Link } from 'react-router-dom';
import 'antd/dist/reset.css';
import './LandingPage.css';
import Login from './Login';
const { Content } = Layout;
const { Title, Text } = Typography;

const LandingPage = () => {
    return (
        <Layout style={{ height: '100vh' }}>
            <Content style={{ display: 'flex', width: '100%' }}>
                <div className="left-panel">
                    <div className="logo"></div>
                    <Title level={2}>Get Started</Title>
                    <Text type="secondary" style={{ textAlign: 'center' }}>
                        Welcome
                        <br />- Let's create your account
                    </Text>
                    <Login />
                    <div className="login-link">
                        Don't have an account?{' '}
                        <Link to="/sign_up">Register</Link>
                    </div>
                </div>
                <div className="right-panel">
                    <Title level={1}>Enter the Future</Title>
                    <Card
                        style={{ width: 300 }}
                        title="Lorem Ipsum"
                        extra={<Button type="link">View All</Button>}
                    >
                        <div className="card">
                            <div className="balance">46532874$</div>
                            <div className="balance-label">Lorem Ipsum</div>
                            <div className="card-details">
                                <div className="card-number">
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default LandingPage;
