const prisma = require("../config/prisma");

const getDashboardData = async () => {

  const totalEmployees =
    await prisma.user.count({
      where: {
        role: "EMPLOYEE",
      },
    });

  const totalGoalSheets =
    await prisma.goalSheet.count();

  const approvedGoalSheets =
    await prisma.goalSheet.count({
      where: {
        status: "APPROVED",
      },
    });

  const pendingGoalSheets =
    await prisma.goalSheet.count({
      where: {
        status: "SUBMITTED",
      },
    });

  const goalSheets =
    await prisma.goalSheet.findMany({
      include: {
        employee: true,
        goals: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const auditLogs =
    await prisma.auditLog.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });

  return {
    stats: {
      totalEmployees,
      totalGoalSheets,
      approvedGoalSheets,
      pendingGoalSheets,
    },

    goalSheets,

    auditLogs,
  };
};

module.exports = {
  getDashboardData,
};