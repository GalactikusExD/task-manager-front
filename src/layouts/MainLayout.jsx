import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  UnorderedListOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h3>Task Manager</h3>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UnorderedListOutlined />}>
            <Link to="/dashboard">Ver Tareas</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CheckCircleOutlined />}>
            <Link to="/completed-tasks">Tareas Completadas</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            <Link to="/settings">Configuración</Link>
          </Menu.Item>
        </Menu>
        
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </Sider>
      
      <Layout>
        <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
