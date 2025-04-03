import api from "./api";

export const taskServices = {
  getCurrentUser: async () => {
    try {
      const response = await api.get("/currentUser");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al obtener el usuario actual");
    }
  },

  getTasks: async () => {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al obtener las tareas");
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data.task;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al crear la tarea");
    }
  },

  updateTaskStatus: async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al actualizar el estado de la tarea");
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al obtener los usuarios");
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await api.post("/groups", groupData);
      return response.data.group;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al crear el grupo");
    }
  },

  getMyGroups: async () => {
    try {
      const response = await api.get("/groups/me");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al obtener los grupos del usuario");
    }
  },
  
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al eliminar el grupo");
    }
  },

  updateUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al actualizar el usuario");
    }
  },
  
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      console.log(response)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al actualizar el usuario");
    }
  }
  
};