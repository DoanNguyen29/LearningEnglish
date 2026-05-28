-- Chạy script này trên SQL Server để tạo database và bảng

-- 1. Tạo database (bỏ qua nếu đã có)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FlashLearn')
  CREATE DATABASE FlashLearn;
GO

USE FlashLearn;
GO

-- 2. Bảng users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
CREATE TABLE users (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  username   NVARCHAR(100) NOT NULL UNIQUE,
  password   NVARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- 3. Bảng progress  (data lưu dạng JSON string)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'progress')
CREATE TABLE progress (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  username   NVARCHAR(100) NOT NULL UNIQUE,
  data       NVARCHAR(MAX) NOT NULL DEFAULT '{"customSets":[],"progress":{}}',
  updated_at DATETIME DEFAULT GETDATE(),
  CONSTRAINT fk_progress_user
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);
GO
