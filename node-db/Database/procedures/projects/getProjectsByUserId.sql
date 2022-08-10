USE users;
GO

CREATE OR ALTER PROCEDURE getProjectsByUserId
    (
    @userId VARCHAR(100)
)
AS
BEGIN
    SELECT *
    FROM dbo.projects
    WHERE userId = @userId
END
GO