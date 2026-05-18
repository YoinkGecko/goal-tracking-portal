const goalSheetService = require("../services/goalSheet.service");

const createGoalSheet = async (req, res) => {
  try {
    const result = await goalSheetService.createGoalSheet(req.user.id);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createGoalSheet,
};
