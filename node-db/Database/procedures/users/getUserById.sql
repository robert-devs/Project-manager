USE users;
GO

CREATE OR ALTER PROCEDURE getUserById
    (
    @id VARCHAR(100)
)
AS
BEGIN
    SELECT id, email, role, username, name
    FROM dbo.users
    WHERE id = @id
END