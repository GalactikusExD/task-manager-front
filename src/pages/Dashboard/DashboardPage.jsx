import React, { useState, useEffect } from 'react';
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
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token de autenticación");
        return;
    }

    const newTask = {
        nametask: values.nametask,
        description: values.description,
        dead_line: values.dead_line,
        remind_me: values.remind_me,
        status: values.status,
        category: values.category,
        assignedTo: values.assignedTo || []
    };

    try {
        const response = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTask),
        });

        const data = await response.json();

        if (response.ok) {
            setTasks([...tasks, data.task]);
            setIsModalVisible(false);
        } else {
            console.error("Error al guardar la tarea:", data.error);
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
};
const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            console.error("Error al obtener usuarios");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
  };

  fetchUsers();
}, []);

useEffect(() => {
  const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
          const response = await fetch("http://localhost:5000/api/tasks", {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (response.ok) {
              const data = await response.json();
              setTasks(data);
          } else {
              console.error("Error al obtener tareas");
          }
      } catch (error) {
          console.error("Error de conexión:", error);
      }
  };

  fetchTasks();
}, []);

const statusTranslations = {
  "In Progress": "En Progreso",
  "Revision": "En Revisión",
  "Paused": "Pausada",
  "Done": "Finalizada"
};

const statusColors = {
  "In Progress": "#FFD700",
  "Revision": "#87CEEB",
  "Paused": "#FF6347",
  "Done": "#32CD32"
};

  return (
    <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
      <Title level={2}>Tablero</Title>
      <Paragraph>
        Agrega tus tareas y administra las pendientes.
      </Paragraph>
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', overflowX: 'auto' }}>
    {Object.keys(statusTranslations).map((status) => {
      const filteredTasks = tasks.filter((task) => task.status === status);
      return (
        <div key={status} style={{ 
            minWidth: '250px', 
            flex: '1', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '10px', 
            backgroundColor: statusColors[status],
            color: '#333'
          }}>
          <h4 style={{ textAlign: 'center' }}>{statusTranslations[status]}</h4>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <div key={index} style={{ 
                  border: '1px solid #ccc', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '10px', 
                  backgroundColor: '#fff' 
                }}>
                <strong>{task.nametask}</strong>
                <p>{task.description}</p>
                <p><strong>Fecha límite:</strong> {new Date(task.dead_line).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>Sin tareas</p>
          )}
        </div>
      );
    })}
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
            name="assignedTo"
            label="Asignar a"
            rules={[{ required: false }]}
          >
            <Select mode="multiple" placeholder="Selecciona usuarios">
              {users.map(user => (
                <Select.Option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
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
