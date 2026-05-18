const prisma = require("../config/prisma");

const createAuditLog = async ({
  userId,
  entityType,
  entityId,
  action,
  oldValue,
  newValue,
}) => {
  return prisma.auditLog.create({
    data: {
      userId,
      entityType,
      entityId,
      action,
      oldValue,
      newValue,
    },
  });
};

module.exports = {
  createAuditLog,
};
