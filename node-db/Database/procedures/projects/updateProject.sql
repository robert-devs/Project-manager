CREATE OR ALTER PROCEDURE updateProjects
    (
    @id VARCHAR(100),
    @userId VARCHAR(100),
    @name VARCHAR(100),
    @description VARCHAR(100),
    @duedate VARCHAR(100)
)
AS
BEGIN
    UPDATE projects SET userId = @userId,name = @name,description=@description,duedate=@duedate WHERE id = @id
END