import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Input, Button, Card } from 'antd';

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const URL = import.meta.env.VITE_APP_URI_API;

    // Function to handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                form.resetFields();
                toast.success('Registration successful');
                navigate('/login');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            toast.error(
                error.message || 'Something went wrong, please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLoginButtonClick = () => {
        navigate('/');
    };

    return (
        <Card
            className="container"
            style={{
                maxWidth: '400px',
                margin: '0 auto',
                padding: '2rem',
                paddingTop: '0',
            }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Register
            </h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        },
                        {
                            pattern: /^[0-9]{10}$/,
                            message:
                                'Please enter a valid 10-digit phone number!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        {loading ? 'Registering...' : 'Register Now'}
                    </Button>
                </Form.Item>
                <Button type="link" block onClick={handleLoginButtonClick}>
                    Already have an account? Login
                </Button>
            </Form>
        </Card>
    );
};

export default Register;
