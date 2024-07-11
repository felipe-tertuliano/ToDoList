CREATE DATABASE "TaskDB";

DO $$
BEGIN

    CREATE TABLE "UserProfile" (
        "Id" SERIAL PRIMARY KEY,
        "Username" VARCHAR(255) NOT NULL,
        "PasswordHash" VARCHAR(255) NOT NULL,
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "TaskItem" (
        "Id" SERIAL PRIMARY KEY,
        "Title" VARCHAR(255) NOT NULL,
        "Description" TEXT,
        "IsCompleted" BOOLEAN NOT NULL,
        "Category" VARCHAR(255),
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "UserProfileId" INT REFERENCES "UserProfile"("Id")
    );

END $$