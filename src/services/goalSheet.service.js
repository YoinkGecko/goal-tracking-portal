const prisma = require("../config/prisma");

const createGoalSheet = async (employeeId) => {

  const existingGoalSheet = await prisma.goalSheet.findFirst({
    where: {
      employeeId,
      status: {
        not: "LOCKED",
      },
    },
  });

  if (existingGoalSheet) {
    throw new Error("Active GoalSheet already exists");
  }

  const goalSheet = await prisma.goalSheet.create({
    data: {
      employeeId,
    },
  });

  return goalSheet;
};

module.exports = {
  createGoalSheet,
};