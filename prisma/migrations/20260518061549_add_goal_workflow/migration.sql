-- CreateTable
CREATE TABLE `GoalSheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'RETURNED', 'APPROVED', 'LOCKED') NOT NULL DEFAULT 'DRAFT',
    `submittedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goalSheetId` INTEGER NOT NULL,
    `thrustArea` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `uomType` ENUM('MIN', 'MAX', 'TIMELINE', 'ZERO') NOT NULL,
    `targetValue` DOUBLE NOT NULL,
    `weightage` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GoalSheet` ADD CONSTRAINT `GoalSheet_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_goalSheetId_fkey` FOREIGN KEY (`goalSheetId`) REFERENCES `GoalSheet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
