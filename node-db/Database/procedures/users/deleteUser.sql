USE users;
GO

CREATE OR ALTER PROCEDURE deleteUser
    (
    @id VARCHAR(100)
)
AS
BEGIN
    DELETE FROM users
    WHERE id = @id
END