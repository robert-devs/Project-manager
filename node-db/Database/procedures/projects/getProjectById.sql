USE users;
GO

CREATE OR ALTER PROCEDURE getProjectById
    (
    @id VARCHAR(100)
)
AS
BEGIN
    SELECT users.name uname , projects.id, projects.userId, projects.name pname, projects.description, projects.duedate
    FROM users
        INNER JOIN projects
        ON users.id =projects.userId
    WHERE projects.id = @id
END
GO