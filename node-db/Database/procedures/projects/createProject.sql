CREATE or ALTER PROCEDURE createProject
    (
    @id VARCHAR(100),
    @userId VARCHAR(100),
    @name VARCHAR(100),
    @description VARCHAR(100),
    @duedate VARCHAR(100)
)
AS
BEGIN
    INSERT INTO projects
        (id, userId, name, description, duedate, issent)
    VALUES
        (@id, @userId, @name, @description, @duedate, '0')
END