const adminService =
  require("../services/admin.service");

const getDashboardData =
  async (req, res) => {

    try {

      const result =
        await adminService.getDashboardData();

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
  getDashboardData,
};