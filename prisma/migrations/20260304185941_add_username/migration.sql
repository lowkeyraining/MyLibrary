/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `month` on table `reading_goals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `reading_goals` MODIFY `month` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `username` VARCHAR(191) NULL,
    MODIFY `image` LONGTEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);
