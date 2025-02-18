import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Layout, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async (values) => {
    const newTask = {
      nametask: values.nametask,
      description: values.description,
      dead_line: values.dead_line,
      remind_me: values.remind_me,
      status: values.status,
      category: values.category,
    };

    console.log("Datos a enviar:", newTask);

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      console.log("Respuesta del servidor:", response);

      const data = await response.json();

      if (response.ok) {
        setTasks([...tasks, data.task]);
        setIsModalVisible(false);
      } else {
        console.error('Error al guardar la tarea:', data.error);
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  return (
    <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
      <Title level={2}>Tablero</Title>
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
          <Button type="default">Ir al Login</Button>
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Tareas:</h3>
        {tasks.map((task, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div><strong>{task.nametask}</strong> - {task.status}</div>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        shape="circle"
        icon={<PlusCircleOutlined />}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '24px',
        }}
        onClick={showModal}
      />

      <Modal
        title="Agregar Tarea"
        visible={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleOk}>
          <Form.Item
            name="nametask"
            label="Nombre de la tarea"
            rules={[{ required: true, message: '¡Por favor ingresa el nombre de la tarea!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: '¡Por favor ingresa la descripción!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="dead_line"
            label="Tiempo hasta finalizar"
            rules={[{ required: true, message: '¡Por favor ingresa el tiempo!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="remind_me"
            label="Recordarme"
            rules={[{ required: true, message: '¡Por favor selecciona el tiempo de recordatorio!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: '¡Por favor selecciona el estado de la tarea!' }]}
          >
            <Select>
              <Select.Option value="In Progress">En progreso</Select.Option>
              <Select.Option value="Done">Finalizada</Select.Option>
              <Select.Option value="Paused">Pausada</Select.Option>
              <Select.Option value="Revision">En revisión</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoría"
            rules={[{ required: true, message: '¡Por favor selecciona una categoría!' }]}
          >
            <Select>
              <Select.Option value="Work">Trabajo</Select.Option>
              <Select.Option value="Study">Estudio</Select.Option>
              <Select.Option value="Personal">Personal</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar tarea
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default DashboardPage;
