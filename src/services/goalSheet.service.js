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

const submitGoalSheet = async (employeeId, goalSheetId) => {
  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      id: Number(goalSheetId),
      employeeId,
    },
    include: {
      goals: true,
    },
  });

  if (!goalSheet) {
    throw new Error("GoalSheet not found");
  }

  if (goalSheet.status !== "DRAFT") {
    throw new Error("Only draft GoalSheets can be submitted");
  }

  if (goalSheet.goals.length === 0) {
    throw new Error("At least one goal is required");
  }

  const totalWeightage = goalSheet.goals.reduce(
    (sum, goal) => sum + goal.weightage,
    0,
  );

  if (totalWeightage !== 100) {
    throw new Error("Total goal weightage must equal 100%");
  }

  const updatedGoalSheet = await prisma.goalSheet.update({
    where: {
      id: goalSheet.id,
    },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return updatedGoalSheet;
};

module.exports = {
  createGoalSheet,
  submitGoalSheet,
};
