import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Card, Typography, message } from "antd";
import { loginUser } from "../../services/authService";
import { Layout, Image } from "antd";
const { Footer } = Layout;
const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values.email, values.password);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        message.success("Sesión iniciada!");
        navigate("/dashboard");
      } else {
        message.error("Credenciales incorrectas");
      }
    } catch (error) {
      message.error("Algo salió mal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Coloca los elementos en columna
        minHeight: "100vh", // Usa minHeight en lugar de height
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          flex: 1, // Esto hace que el contenido ocupe el espacio disponible
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card style={{ width: 400 }}>
          <Title level={2} style={{ textAlign: "center" }}>
            Iniciar sesión
          </Title>
          <Form onFinish={onFinish}>
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: "Ingrese su correo!" },
                { type: "email", message: "Ingrese un correo válido!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Ingrese su contraseña!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: "center" }}>
            <Link to="/register">¿No tienes una cuenta? Crear una</Link>
          </div>
        </Card>
      </div>
      <footer
        style={{
          backgroundColor: "#001529",
          color: "white",
          textAlign: "center",
          padding: "20px",
          width: "100%",
        }}
      >
        <Image
          src="https://preregidiomas.uteq.edu.mx/Images/Logo_uteq.png"
          alt="Logo UTEC"
          preview={false}
          style={{
            height: "auto",
            maxWidth: "200px",
            marginBottom: "8px",
          }}
        />
        <p>© {new Date().getFullYear()} Lorena</p>
      </footer>
    </div>
  );
};

export default LoginPage;
