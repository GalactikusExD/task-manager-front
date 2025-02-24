const express = require("express");
const cors = require("cors");
const conectarDB = require("./database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("./models/Task");
const User = require("./models/User");

require("dotenv").config();

conectarDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "secret-key");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};

app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, last_login: new Date() });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", details: error.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        user.last_login = new Date();
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "secret-key",
            { expiresIn: "10m" }
        );

        res.json({ message: "Inicio de sesión exitoso", token, user });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
    }
});

app.post("/api/tasks", authenticate, async (req, res) => {
    try {
        const { nametask, description, dead_line, remind_me, status, category, assignedTo  } = req.body;

        if (!nametask || !description || !status) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const newTask = new Task({
            nametask,
            description,
            dead_line,
            remind_me,
            status,
            category,
            createdBy: req.user.userId,
            assignedTo: assignedTo || [],
        });

        await newTask.save();
        res.status(201).json({ message: "Tarea agregada correctamente", task: newTask });
    } catch (error) {
        console.error("Error al agregar la tarea:", error);
        res.status(500).json({ error: "Error al agregar la tarea", details: error.message });
    }
});

app.get("/api/tasks", authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ 
            $or: [
                { createdBy: req.user.userId },
                { assignedTo: req.user.userId }
            ]
        }).populate("createdBy", "name email").populate("assignedTo", "name email");

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        res.status(500).json({ error: "Error al obtener las tareas", details: error.message });
    }
});

app.get("/api/users", authenticate, async (req, res) => {
    try {
        const users = await User.find({}, "name email"); // Solo traer nombre y email
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});