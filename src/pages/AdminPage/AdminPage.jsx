import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Select, message, Space } from "antd";
import { taskServices } from "../../services/taskService";
import { DeleteOutlined } from "@ant-design/icons";
// eslint-disable-next-line no-unused-vars

const { Option } = Select;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await taskServices.getCurrentUser();
        setCurrentUser(user);
        if (user.role !== 2) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error al obtener el usuario actual:", error.message);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser?.role === 2) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const users = await taskServices.getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    }
  };

  const handleEditUser = async (userId, values) => {
    try {
      await taskServices.updateUser(userId, values);
      message.success("Usuario actualizado con éxito");
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error.message);
      message.error("Error al actualizar el usuario");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
  
      await taskServices.deleteUser(userId);

      message.success("Usuario eliminado con éxito");
      
    } catch (error) {
      message.destroy();

      console.error("Error al eliminar usuario:", error.message);
      message.error(error.message || "Error al eliminar el usuario");
    }
  };
  const columns = [
    {
      title: "Nombre",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <Space size="small">
          <Form
            initialValues={{ role: record.role }}
            onFinish={(values) => handleEditUser(record._id, values)}
          >
            <Form.Item name="role" noStyle>
              <Select style={{ width: 150 }}>
                <Option value={1}>Usuario</Option>
                <Option value={2}>Administrador</Option>
              </Select>
            </Form.Item>
            <Button type="link" htmlType="submit">
              Guardar
            </Button>
          </Form>
        </Space>
      ),
    },
  ];

  if (currentUser?.role !== 2) {
    return null;
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff" }}>
      <h2>Administración de Usuarios</h2>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
};

export default AdminPage;
