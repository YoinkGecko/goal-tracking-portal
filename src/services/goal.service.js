const prisma = require("../config/prisma");

const createGoal = async (employeeId, data) => {

  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      employeeId,
      status: "DRAFT",
    },
    include: {
      goals: true,
    },
  });

  if (!goalSheet) {
    throw new Error("No active draft GoalSheet found");
  }

  if (goalSheet.goals.length >= 8) {
    throw new Error("Maximum 8 goals allowed");
  }

  if (data.weightage < 10) {
    throw new Error("Minimum goal weightage is 10%");
  }

  const goal = await prisma.goal.create({
    data: {
      goalSheetId: goalSheet.id,
      thrustArea: data.thrustArea,
      title: data.title,
      description: data.description,
      uomType: data.uomType,
      targetValue: data.targetValue,
      weightage: data.weightage,
    },
  });

  return goal;
};

module.exports = {
  createGoal,
};