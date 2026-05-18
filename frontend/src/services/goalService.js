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

export const getGoalSheetById = async (id) => {

  const token = localStorage.getItem("token");

  const response = await api.get(
    `/goal-sheets/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createGoal = async (
  goalData
) => {

  const token = localStorage.getItem("token");

  const response = await api.post(
    "/goals",
    goalData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const submitGoalSheet = async (
  id
) => {

  const token = localStorage.getItem("token");

  const response = await api.post(
    `/goal-sheets/${id}/submit`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};