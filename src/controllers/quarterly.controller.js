const quarterlyService = require("../services/quarterly.service");

const createQuarterlyUpdate = async (req, res) => {
  try {

    const result = await quarterlyService.createQuarterlyUpdate(
      req.user.id,
      req.params.goalId,
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

const addManagerComment = async (req, res) => {
  try {

    const result =
      await quarterlyService.addManagerComment(
        req.user.id,
        req.params.id,
        req.body.comment
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
  createQuarterlyUpdate,
  addManagerComment,
};