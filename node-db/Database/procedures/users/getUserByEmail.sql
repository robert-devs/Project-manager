USE users;
GO

CREATE OR ALTER PROCEDURE getUserByEmail
    (
    @email VARCHAR(100)
)
AS
BEGIN
    SELECT *
    FROM dbo.users
    WHERE email = @email
END