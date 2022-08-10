CREATE OR ALTER PROCEDURE updateUser(
    @id VARCHAR(100),
    @username VARCHAR(100),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @role VARCHAR(100)
)
AS
BEGIN
    UPDATE users SET username = @username,name = @name,role = @role, email = @email WHERE id = @id
END