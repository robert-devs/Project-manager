USE users;
GO

CREATE OR ALTER PROCEDURE getProjectsByUserId
    (
    @userId VARCHAR(100)
)
AS
BEGIN
    SELECT projects.id, projects.userId, projects.name, projects.description, projects.duedate
    FROM users
        INNER JOIN projects
        ON users.id =projects.userId
    WHERE projects.userId = @userId
END
GO