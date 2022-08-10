CREATE OR ALTER PROCEDURE deleteProject
    (
    @id VARCHAR(100)
)
AS
BEGIN
    DELETE FROM projects
    WHERE id = @id
END