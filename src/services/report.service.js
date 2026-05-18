const prisma = require("../config/prisma");
const { Parser } = require("json2csv");

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

const exportDetailedReportCSV = async () => {

  const goalSheets = await prisma.goalSheet.findMany({
    include: {

      employee: {
        include: {
          manager: true,
        },
      },

      goals: {
        include: {
          quarterlyUpdates: true,
        },
      },
    },
  });

  const reportRows = [];

  for (const sheet of goalSheets) {

    for (const goal of sheet.goals) {

      if (goal.quarterlyUpdates.length === 0) {

        reportRows.push({
          employeeName: sheet.employee.name,
          employeeEmail: sheet.employee.email,

          managerName:
            sheet.employee.manager?.name || "N/A",

          goalSheetStatus: sheet.status,

          goalTitle: goal.title,
          thrustArea: goal.thrustArea,

          uomType: goal.uomType,

          targetValue: goal.targetValue,

          weightage: goal.weightage,

          submittedAt: sheet.submittedAt,

          approvedAt: sheet.approvedAt,

          quarter: "N/A",

          actualValue: "N/A",

          progressScore: "N/A",

          progressStatus: "N/A",

          managerComment: "N/A",
        });

      } else {

        for (const update of goal.quarterlyUpdates) {

          reportRows.push({
            employeeName: sheet.employee.name,

            employeeEmail: sheet.employee.email,

            managerName:
              sheet.employee.manager?.name || "N/A",

            goalSheetStatus: sheet.status,

            goalTitle: goal.title,

            thrustArea: goal.thrustArea,

            uomType: goal.uomType,

            targetValue: goal.targetValue,

            weightage: goal.weightage,

            submittedAt: sheet.submittedAt,

            approvedAt: sheet.approvedAt,

            quarter: update.quarter,

            actualValue: update.actualValue,

            progressScore: update.progressScore,

            progressStatus: update.status,

            managerComment:
              update.managerComment || "N/A",
          });
        }
      }
    }
  }

  const parser = new Parser();

  return parser.parse(reportRows);
};

const exportAuditLogsCSV = async () => {

  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const rows = auditLogs.map((log) => ({
    auditId: log.id,

    userName: log.user.name,

    userEmail: log.user.email,

    action: log.action,

    entityType: log.entityType,

    entityId: log.entityId,

    oldValue: JSON.stringify(log.oldValue),

    newValue: JSON.stringify(log.newValue),

    createdAt: log.createdAt,
  }));

  const parser = new Parser();

  return parser.parse(rows);
};

module.exports = {
  getAchievementReport,
  getCompletionDashboard,
  exportDetailedReportCSV,
  exportAuditLogsCSV,
};