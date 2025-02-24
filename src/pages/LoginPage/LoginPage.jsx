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
            const response = await loginUser(values.email, values.password);
            console.log("Respuesta completa:", response); // Verifica la estructura de la respuesta
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                console.log(response.token);
                message.success('Sesión iniciada!');
                navigate('/dashboard');
            } else {
                message.error('Credenciales incorrectas');
            }
        } catch (error) {
            message.error('Algo salió mal: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center' }}>Iniciar sesión</Title>
                <Form onFinish={onFinish}>
                    <Form.Item
                        label="Correo electrónico"
                        name="email"
                        rules={[
                            { required: true, message: 'Ingrese su correo!' },
                            { type: 'email', message: 'Ingrese un correo válido!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{ required: true, message: 'Ingrese su contraseña!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Iniciar sesión
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;