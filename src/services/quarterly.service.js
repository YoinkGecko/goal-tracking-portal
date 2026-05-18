const prisma = require("../config/prisma");

const calculateProgressScore = (uomType, targetValue, actualValue) => {
  switch (uomType) {
    case "MIN":
      return (actualValue / targetValue) * 100;

    case "MAX":
      return (targetValue / actualValue) * 100;

    case "ZERO":
      return actualValue === 0 ? 100 : 0;

    default:
      return 0;
  }
};

const createQuarterlyUpdate = async (employeeId, goalId, data) => {
  const goal = await prisma.goal.findFirst({
    where: {
      id: Number(goalId),
    },
    include: {
      goalSheet: true,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  if (goal.goalSheet.employeeId !== employeeId) {
    throw new Error("Unauthorized");
  }

  if (goal.goalSheet.status !== "APPROVED") {
    throw new Error("Quarterly updates allowed only after approval");
  }

  const existingQuarter = await prisma.quarterlyUpdate.findFirst({
    where: {
      goalId: goal.id,
      quarter: data.quarter,
    },
  });

  if (existingQuarter) {
    throw new Error("Quarter already updated");
  }

  const progressScore = calculateProgressScore(
    goal.uomType,
    goal.targetValue,
    data.actualValue,
  );

  const quarterlyUpdate = await prisma.quarterlyUpdate.create({
    data: {
      goalId: goal.id,
      quarter: data.quarter,
      plannedValue: goal.targetValue,
      actualValue: data.actualValue,
      status: data.status,
      progressScore,
    },
  });

  return quarterlyUpdate;
};

const addManagerComment = async (managerId, quarterlyUpdateId, comment) => {
  const quarterlyUpdate = await prisma.quarterlyUpdate.findFirst({
    where: {
      id: Number(quarterlyUpdateId),
    },
    include: {
      goal: {
        include: {
          goalSheet: {
            include: {
              employee: true,
            },
          },
        },
      },
    },
  });

  if (!quarterlyUpdate) {
    throw new Error("Quarterly update not found");
  }

  const employee = quarterlyUpdate.goal.goalSheet.employee;

  if (employee.managerId !== managerId) {
    throw new Error("Unauthorized");
  }

  const updatedQuarterlyUpdate = await prisma.quarterlyUpdate.update({
    where: {
      id: quarterlyUpdate.id,
    },
    data: {
      managerComment: comment,
    },
  });

  return updatedQuarterlyUpdate;
};

module.exports = {
  createQuarterlyUpdate,
  addManagerComment,
};