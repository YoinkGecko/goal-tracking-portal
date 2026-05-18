const goalService = require("../services/goal.service");

const createGoal = async (req, res) => {
  try {

    const result = await goalService.createGoal(
      req.user.id,
      req.body
    );

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

const updateGoal = async (req, res) => {
  try {

    const result = await goalService.updateGoal(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json({
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
  createGoal,
  updateGoal,
};