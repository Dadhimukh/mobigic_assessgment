import { Button, Card, Divider, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginfailure, loginsuccess } from '../featuresRedux/auth/action';
import { saveData } from '../utils/localstore';

const URL = import.meta.env.VITE_APP_URI_API;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        // console.log('login clicked', values);

        try {
            const res = await fetch(`${URL}/login`, {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (data.token) {
                dispatch(loginsuccess(data.token));
                saveData('user', data.user);
                message.success('Login Successful. Welcome to Home Page.');
                navigate('/home');
            } else {
                dispatch(loginfailure(data));
                saveData('user', '');
                message.error(
                    'Invalid Details. Please check your email id or password.'
                );
            }
        } catch (err) {
            console.error(err);
            message.error('Network Error. Please try again.');
        }
    };

    return (
        <Card
            style={{
                background: 'white',
                padding: '24px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit} // Use onFinish instead of onSubmit
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                    ]}
                >
                    <Input
                        type="email"
                        placeholder="example@gmail.com"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Password" size="large" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        style={{
                            backgroundColor: '#1877f2',
                            borderColor: '#1877f2',
                        }}
                    >
                        Log In
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
        </Card>
    );
};

export default Login;
