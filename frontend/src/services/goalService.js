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

export const createGoalSheet = async () => {

  const token = localStorage.getItem("token");

  const response = await api.post(
    "/goal-sheets",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};