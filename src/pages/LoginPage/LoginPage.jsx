import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { AuthContext } from '../../AuthContext';

const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = loginUser(values.email, values.password);
            if (response) {
                localStorage.setItem('token', response.token);
                message.success('Sesión iniciada!');
                navigate('/dashboard');
            } else {
                message.error('Credenciales incorrectas');
            }
        } catch (error) {
            message.error('Algo salió mal!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
                <Form onFinish={onFinish}>
                    <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Ingrese su correo!' }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingrese su contraseña!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>Iniciar</Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/">Regresar al inicio</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;