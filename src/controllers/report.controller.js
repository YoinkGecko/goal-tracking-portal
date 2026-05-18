const reportService = require("../services/report.service");

const getAchievementReport = async (req, res) => {
  try {
    const result = await reportService.getAchievementReport();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompletionDashboard = async (req, res) => {
  try {
    const result = await reportService.getCompletionDashboard();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportDetailedReportCSV = async (req, res) => {
  try {
    const csv = await reportService.exportDetailedReportCSV();

    res.header("Content-Type", "text/csv");

    res.attachment("detailed-goal-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportAuditLogsCSV = async (req, res) => {
  try {
    const csv = await reportService.exportAuditLogsCSV();

    res.header("Content-Type", "text/csv");

    res.attachment("audit-logs-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAchievementReport,
  getCompletionDashboard,
  exportDetailedReportCSV,
  exportAuditLogsCSV
};
