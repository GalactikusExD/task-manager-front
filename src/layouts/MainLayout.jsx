import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UnorderedListOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h3>Task Manager</h3>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UnorderedListOutlined />}>
            <Link to="/tasks">Ver Tareas</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<PlusOutlined />}>
            <Link to="/create-task">Crear Tarea</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CheckCircleOutlined />}>
            <Link to="/completed-tasks">Tareas Completadas</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            <Link to="/settings">Configuración</Link>
          </Menu.Item>
        </Menu>
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