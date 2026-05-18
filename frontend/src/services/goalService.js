import api from "./api";

export const getGoalSheets = async () => {

  const token = localStorage.getItem("token");

  const response = await api.get(
    "/goal-sheets",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};