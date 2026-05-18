const prisma = require("../config/prisma");

const getAchievementReport = async () => {

  const goalSheets = await prisma.goalSheet.findMany({
    include: {
      employee: true,
      goals: {
        include: {
          quarterlyUpdates: true,
        },
      },
    },
  });

  const report = [];

  for (const sheet of goalSheets) {

    for (const goal of sheet.goals) {

      for (const update of goal.quarterlyUpdates) {

        report.push({
          employeeName: sheet.employee.name,

          goalTitle: goal.title,

          quarter: update.quarter,

          targetValue: goal.targetValue,

          actualValue: update.actualValue,

          progressScore: update.progressScore,

          status: update.status,
        });
      }
    }
  }

  return report;
};

const getCompletionDashboard = async () => {

  const draftCount = await prisma.goalSheet.count({
    where: {
      status: "DRAFT",
    },
  });

  const submittedCount = await prisma.goalSheet.count({
    where: {
      status: "SUBMITTED",
    },
  });

  const approvedCount = await prisma.goalSheet.count({
    where: {
      status: "APPROVED",
    },
  });

  const returnedCount = await prisma.goalSheet.count({
    where: {
      status: "RETURNED",
    },
  });

  return {
    DRAFT: draftCount,
    SUBMITTED: submittedCount,
    APPROVED: approvedCount,
    RETURNED: returnedCount,
  };
};

module.exports = {
  getAchievementReport,
  getCompletionDashboard,
};