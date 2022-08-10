USE users;
GO

CREATE OR ALTER PROCEDURE getProjectById
    (
    @id VARCHAR(100)
)
AS
BEGIN
    SELECT *
    FROM dbo.projects
    WHERE id = @id
END
GO