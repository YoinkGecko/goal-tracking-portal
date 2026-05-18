import api from "./api";

export const getAdminDashboard =
  async () => {

    const token =
      localStorage.getItem("token");

    const response = await api.get(
      "/admin/dashboard",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return response.data;
};