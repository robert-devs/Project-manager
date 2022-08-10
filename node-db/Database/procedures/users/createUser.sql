
CREATE OR ALTER PROCEDURE createUser(
    @id VARCHAR(100),
    @username VARCHAR(100),
    @password VARCHAR(100),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @role VARCHAR(100)
)
AS
BEGIN
    INSERT INTO users
        (id,username,name, email,role, password)
    VALUES
        (@id, @username, @name, @email, @role, @password)
END