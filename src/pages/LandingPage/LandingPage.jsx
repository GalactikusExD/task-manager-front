import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={2}>Bienvenido a TaskManager</Title>
        <Paragraph>
          Organiza tus tareas lo más eficiente posible.
        </Paragraph>
        <div style={{ marginTop: '20px' }}>
          <Link to="/login">
            <Button type="primary" style={{ marginRight: '10px' }}>
              Inicio de sesion
            </Button>
          </Link>
          <Link to="/register">
            <Button type="default">Regristrate</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;