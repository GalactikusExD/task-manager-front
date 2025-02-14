import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Layout } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  return (
    <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
      <Title level={2}>Dashboard</Title>
      <Paragraph>
        Agrega tus tareas y administra las pendientes.
      </Paragraph>
      <div>
        <Link to="/">
          <Button type="primary" style={{ marginRight: '10px' }}>
            Ir al inicio
          </Button>
        </Link>
        <Link to="/login">
          <Button type="default">pal' Login</Button>
        </Link>
      </div>
    </Content>
  );
};

export default DashboardPage;