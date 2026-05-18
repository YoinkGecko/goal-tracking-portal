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

const submitGoalSheet = async (req, res) => {
  try {
    const result = await goalSheetService.submitGoalSheet(
      req.user.id,
      req.params.id,
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

const approveGoalSheet = async (req, res) => {
  try {
    const result = await goalSheetService.approveGoalSheet(
      req.user.id,
      req.params.id,
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

const returnGoalSheet = async (req, res) => {
  try {
    const result = await goalSheetService.returnGoalSheet(
      req.user.id,
      req.params.id,
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

const unlockGoalSheet = async (req, res) => {
  try {

    const result =
      await goalSheetService.unlockGoalSheet(
        req.user.id,
        req.params.id
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

const getEmployeeGoalSheets = async (
  req,
  res
) => {

  try {

    const result =
      await goalSheetService.getEmployeeGoalSheets(
        req.user.id
      );

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

const getGoalSheetById = async (
  req,
  res
) => {

  try {

    const result =
      await goalSheetService.getGoalSheetById(
        req.user.id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getManagerGoalSheets = async (
  req,
  res
) => {

  try {

    const result =
      await goalSheetService.getManagerGoalSheets(
        req.user.id
      );

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

const getManagerGoalSheetById =
  async (req, res) => {

    try {

      const result =
        await goalSheetService.getManagerGoalSheetById(
          req.user.id,
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {

      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
};

module.exports = {
  createGoalSheet,
  submitGoalSheet,
  approveGoalSheet,
  returnGoalSheet,
  unlockGoalSheet,
  getEmployeeGoalSheets,
  getGoalSheetById,
  getManagerGoalSheets,
  getManagerGoalSheetById
};
