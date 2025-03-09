import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Layout, Modal, Form, Input, Select, DatePicker, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { taskServices } from "../../services/taskService.js";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    try {
      const tasks = await taskServices.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const user = await taskServices.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error al verificar autenticación:", error.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await taskServices.getMyGroups();
        console.log("Grupos obtenidos:", groups);
        setGroups(groups);
      } catch (error) {
        console.error("Error al obtener grupos:", error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleOk = async (values) => {
    try {
      if (values.groupId) {
        const group = groups.find((g) => g._id === values.groupId);
        if (!group) {
          message.error("Grupo no encontrado");
          return;
        }

        if (group.createdBy._id !== currentUser._id) {
          message.error("Solo el creador del grupo puede asignar tareas");
          return;
        }
      }

      const newTask = {
        nametask: values.nametask,
        description: values.description,
        dead_line: values.dead_line,
        remind_me: values.remind_me,
        status: values.status,
        category: values.category,
        groupId: values.groupId || null,
      };

      const createdTask = await taskServices.createTask(newTask);
      setTasks([...tasks, createdTask]);
      setIsModalVisible(false);
      form.resetFields();
      message.success("Tarea creada con éxito");
    } catch (error) {
      console.error("Error al crear la tarea:", error.message);
      message.error("Error al crear la tarea");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) {
        message.error("Tarea no encontrada");
        return;
      }
  
      const isCreator = task.createdBy._id === currentUser._id;
  
      const isGroupMember =
        task.group && task.group.members.includes(currentUser._id);
  
      if (!isCreator && !isGroupMember) {
        message.error("No tienes permisos para editar esta tarea");
        return;
      }
  
      await taskServices.updateTaskStatus(taskId, newStatus);
      const updatedTask = { ...task, status: newStatus };
      const updatedTasks = tasks.map((t) => (t._id === taskId ? updatedTask : t));
      setTasks(updatedTasks);
      message.success("Estado de la tarea actualizado");
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error.message);
      message.error("Error al actualizar el estado de la tarea");
    }
  };

  const statusTranslations = {
    "In Progress": "En Progreso",
    Revision: "En Revisión",
    Paused: "Pausada",
    Done: "Finalizada",
  };

  const statusColors = {
    "In Progress": "#FFD700",
    Revision: "#87CEEB",
    Paused: "#FF6347",
    Done: "#32CD32",
  };

  return (
    <Content style={{ padding: "24px", backgroundColor: "#fff" }}>
      <Title level={2}>Tablero</Title>
      <Paragraph>Agrega tus tareas y administra las pendientes.</Paragraph>
      <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
        {Object.keys(statusTranslations).map((status) => {
          const filteredTasks = tasks.filter((task) => task.status === status);
          return (
            <div
              key={status}
              style={{
                minWidth: "250px",
                flex: "1",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: statusColors[status],
              }}
            >
              <h4 style={{ textAlign: "center" }}>{statusTranslations[status]}</h4>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <strong>{task.nametask}</strong>
                    <p>{task.description}</p>
                    <p>
                      <strong>Fecha límite:</strong> {new Date(task.dead_line).toLocaleString()}
                    </p>
                    <Select
                      defaultValue={task.status}
                      onChange={(value) => handleUpdateTaskStatus(task._id, value)}
                    >
                      <Select.Option value="In Progress">En progreso</Select.Option>
                      <Select.Option value="Done">Finalizada</Select.Option>
                      <Select.Option value="Paused">Pausada</Select.Option>
                      <Select.Option value="Revision">En revisión</Select.Option>
                    </Select>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#888" }}>Sin tareas</p>
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
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "24px",
        }}
        onClick={showModal}
      />

      <Modal title="Agregar Tarea" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleOk}>
          <Form.Item name="nametask" label="Nombre de la tarea" rules={[{ required: true, message: "¡Por favor ingresa el nombre de la tarea!" }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "¡Por favor ingresa la descripción!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="dead_line" label="Tiempo hasta finalizar" rules={[{ required: true, message: "¡Por favor ingresa el tiempo!" }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="remind_me" label="Recordarme" rules={[{ required: true, message: "¡Por favor selecciona el tiempo de recordatorio!" }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="status" label="Estado" rules={[{ required: true, message: "¡Por favor selecciona el estado de la tarea!" }]}>
            <Select>
              <Select.Option value="In Progress">En progreso</Select.Option>
              <Select.Option value="Done">Finalizada</Select.Option>
              <Select.Option value="Paused">Pausada</Select.Option>
              <Select.Option value="Revision">En revisión</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="groupId" label="Grupo">
            <Select placeholder="Selecciona un grupo (opcional)">
              {groups.map((group) => (
                <Select.Option key={group._id} value={group._id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "¡Por favor selecciona una categoría!" }]}>
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