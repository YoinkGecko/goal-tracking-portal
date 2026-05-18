const reportService = require("../services/report.service");

const getAchievementReport = async (req, res) => {
  try {

    const result =
      await reportService.getAchievementReport();

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

    const result =
      await reportService.getCompletionDashboard();

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
module.exports = {
  getAchievementReport,
  getCompletionDashboard,
};