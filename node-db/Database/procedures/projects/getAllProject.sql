USE users;
GO

CREATE OR ALTER PROCEDURE getAllProjects
AS
BEGIN
    SELECT *
    FROM dbo.projects
END
GO