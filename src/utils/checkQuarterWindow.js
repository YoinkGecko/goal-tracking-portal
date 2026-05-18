const checkQuarterWindow = (quarter) => {
  const currentMonth = process.env.TEST_MONTH
    ? Number(process.env.TEST_MONTH)
    : new Date().getMonth() + 1;

  switch (quarter) {
    case "Q1":
      return currentMonth === 7;

    case "Q2":
      return currentMonth === 10;

    case "Q3":
      return currentMonth === 1;

    case "Q4":
      return currentMonth === 3 || currentMonth === 4;

    default:
      return false;
  }
};

module.exports = checkQuarterWindow;
