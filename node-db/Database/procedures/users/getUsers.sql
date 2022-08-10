CREATE OR ALTER PROCEDURE getUsers
AS
BEGIN
    SELECT id, email, role, username, name
    FROM dbo.users
END
GO