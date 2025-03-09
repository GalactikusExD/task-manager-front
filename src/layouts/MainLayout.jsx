import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  UnorderedListOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { taskServices } from '../services/taskService';

const { Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await taskServices.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error al obtener el usuario actual:", error.message);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

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
            <Link to="/dashboard">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CheckCircleOutlined />}>
            <Link to="/dashboard/groups">Grupos</Link>
          </Menu.Item>
          {currentUser?.role === 2 && (
            <Menu.Item key="3" icon={<SettingOutlined />}>
              <Link to="/dashboard/admin">Administración</Link>
            </Menu.Item>
          )}
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