import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, List, Typography, message } from "antd";
import { taskServices } from "../../services/taskService.js";
import { deleteGroup } from '../../services/groupService';

const { Option } = Select;
const { Title,Text } = Typography;

const CreateGroupPage = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await taskServices.getUsers();
        setUsers(users);

        const currentUser = await taskServices.getCurrentUser();
        setCurrentUser(currentUser);

        const groups = await taskServices.getMyGroups();
        setGroups(groups);
      } catch (error) {
        console.error("Error al obtener datos:", error.message);
        message.error("Error al cargar los datos");
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      const newGroup = {
        name: values.name,
        members: values.members,
      };

      await taskServices.createGroup(newGroup);
      message.success("Grupo creado con éxito");

      const updatedGroups = await taskServices.getMyGroups();
      setGroups(updatedGroups);

      form.resetFields();
    } catch (error) {
      console.error("Error al crear el grupo:", error.message);
      message.error("Error al crear el grupo");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await taskServices.deleteGroup(groupId);
      message.success("Grupo eliminado con éxito");

      const updatedGroups = await taskServices.getMyGroups();
      setGroups(updatedGroups);
    } catch (error) {
      console.error("Error al eliminar el grupo:", error.message);
      message.error("Error al eliminar el grupo");
    }
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff" }}>
      <Title level={2}>Crear Grupo</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Nombre del grupo"
          rules={[{ required: true, message: "¡Por favor ingresa el nombre del grupo!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="members"
          label="Miembros"
          rules={[{ required: true, message: "¡Por favor selecciona los miembros!" }]}
        >
          <Select mode="multiple" placeholder="Selecciona miembros">
            {users
              .filter((user) => user._id !== currentUser?._id)
              .map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear Grupo
          </Button>
        </Form.Item>
      </Form>

      <Title level={2} style={{ marginTop: "24px" }}>Mis Grupos</Title>
      <List
        dataSource={groups}
        renderItem={(group) => (
          <List.Item
            // actions={[
            //   <Button type="link" onClick={() => navigate(`/groups/${group._id}`)}>
            //     Ver detalles
            //   </Button>,
            // ]}

            actions={[
              group.createdBy._id === currentUser?._id && (
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteGroup(group._id)}
                >
                  Eliminar
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={group.name}
              description={
                <>
                  <p><Text strong>Creado por:</Text> {group.createdBy.username}</p>
                  <p><Text strong>Miembros:</Text> {group.members.map((member) => member.username).join(", ")}</p>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CreateGroupPage;
