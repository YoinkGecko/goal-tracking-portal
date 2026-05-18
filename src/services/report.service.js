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

module.exports = {
  getAchievementReport,
};