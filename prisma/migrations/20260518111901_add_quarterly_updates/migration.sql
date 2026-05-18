-- CreateTable
CREATE TABLE `QuarterlyUpdate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goalId` INTEGER NOT NULL,
    `quarter` ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    `plannedValue` DOUBLE NULL,
    `actualValue` DOUBLE NULL,
    `status` ENUM('NOT_STARTED', 'ON_TRACK', 'COMPLETED') NOT NULL,
    `progressScore` DOUBLE NULL,
    `managerComment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuarterlyUpdate` ADD CONSTRAINT `QuarterlyUpdate_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
