const prisma = require("../config/prisma");
const auditService = require("./audit.service");

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

if (
  !["DRAFT", "RETURNED"].includes(goalSheet.status)
) {
  throw new Error(
    "Only draft or returned GoalSheets can be submitted"
  );
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

const approveGoalSheet = async (managerId, goalSheetId) => {
  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      id: Number(goalSheetId),
    },
    include: {
      employee: true,
    },
  });

  if (!goalSheet) {
    throw new Error("GoalSheet not found");
  }

  if (goalSheet.status !== "SUBMITTED") {
    throw new Error("Only submitted GoalSheets can be approved");
  }

  if (goalSheet.employee.managerId !== managerId) {
    throw new Error("You are not authorized to approve this GoalSheet");
  }

  const updatedGoalSheet = await prisma.goalSheet.update({
    where: {
      id: goalSheet.id,
    },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  await auditService.createAuditLog({
    userId: managerId,
    entityType: "GOAL_SHEET",
    entityId: goalSheet.id,
    action: "APPROVE",
    oldValue: {
      status: "SUBMITTED",
    },
    newValue: {
      status: "APPROVED",
    },
  });

  return updatedGoalSheet;
};

const returnGoalSheet = async (managerId, goalSheetId) => {
  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      id: Number(goalSheetId),
    },
    include: {
      employee: true,
    },
  });

  if (!goalSheet) {
    throw new Error("GoalSheet not found");
  }

  if (goalSheet.status !== "SUBMITTED") {
    throw new Error("Only submitted GoalSheets can be returned");
  }

  if (goalSheet.employee.managerId !== managerId) {
    throw new Error("Unauthorized");
  }

  const updatedGoalSheet = await prisma.goalSheet.update({
    where: {
      id: goalSheet.id,
    },
    data: {
      status: "RETURNED",
    },
  });

  await auditService.createAuditLog({
    userId: managerId,
    entityType: "GOAL_SHEET",
    entityId: goalSheet.id,
    action: "RETURN",
    oldValue: {
      status: "SUBMITTED",
    },
    newValue: {
      status: "RETURNED",
    },
  });

  return updatedGoalSheet;
};

const unlockGoalSheet = async (
  adminId,
  goalSheetId
) => {

  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      id: Number(goalSheetId),
    },
  });

  if (!goalSheet) {
    throw new Error("GoalSheet not found");
  }

  if (goalSheet.status !== "APPROVED") {
    throw new Error(
      "Only approved GoalSheets can be unlocked"
    );
  }

  const updatedGoalSheet =
    await prisma.goalSheet.update({
      where: {
        id: goalSheet.id,
      },
      data: {
        status: "RETURNED",
      },
    });

  await auditService.createAuditLog({
    userId: adminId,
    entityType: "GOAL_SHEET",
    entityId: goalSheet.id,
    action: "UNLOCK",
    oldValue: {
      status: "APPROVED",
    },
    newValue: {
      status: "RETURNED",
    },
  });

  return updatedGoalSheet;
};

const getEmployeeGoalSheets = async (
  employeeId
) => {

  return prisma.goalSheet.findMany({
    where: {
      employeeId,
    },
    include: {
      goals: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createGoalSheet,
  submitGoalSheet,
  approveGoalSheet,
  returnGoalSheet,
  unlockGoalSheet,
  getEmployeeGoalSheets
};