import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { AuthContext } from '../../AuthContext';

const { Title } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            registerUser(values);
            message.success('Registro exitoso!');
            navigate('/login');
        } catch (error) {
            message.error('Registro Fallido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center' }}>Registro</Title>
                <Form onFinish={onFinish}>
                    <Form.Item label="Nombre" name="username" rules={[{ required: true, message: 'Ingrese su nombre!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Ingrese su correo!' }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingrese su contraseña!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>Registrar</Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/">Regresar al inicio</Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;