-- USE users;
-- GO

-- -- Ceate user
-- exec [dbo].[createUser]
--     @id='44r4545dfsdfxs3', 
--     @username='maina', 
--     @email='maina_254@yopmail.com',
--     @role='admin';


-- --  Create Project
-- exec [dbo].[createProject]
--     @id ='46564fgfgryry64545gdfgf',
--     @userId = '44r4545dfsdfxs3',
--     @description = 'Update the server to create user',
--     @duedate = '2022-08-14T14:29:45.018Z'


-- -- GET PROJECT BY ID
-- EXEC [dbo].[getAllProjects]


-- -- GET PROJECT BY ID
-- EXEC [dbo].[getProjectById]
--     @id ='44r4545dfsdFFfxs3'

-- select *
-- from projects


-- // UPADTTE PROCEDURE

-- CREATE OR ALTER PROCEDURE updateProjects
--     (
--     @id VARCHAR(100),
--     @userId VARCHAR(100),
--     @name VARCHAR(100),
--     @description VARCHAR(100),
--     @duedate VARCHAR(100)
-- )
-- AS
-- BEGIN
--     UPDATE projects SET id= @id,userId = @userId,name = @name,description=@description,duedate=@duedate WHERE id = @id
-- END

-- -- UPDATE USERS

-- CREATE OR ALTER PROCEDURE updateUsers(
--     @id VARCHAR(100),
--     @username VARCHAR(100),
--     @name VARCHAR(100),
--     @email VARCHAR(100),
--     @role VARCHAR(100)
-- )
-- AS
-- BEGIN
--   UPDATE users SET id = @id,username = @username,name = @name,role=@role WHERE id=@id
-- END

CREATE OR ALTER PROCEDURE updateUser(
    @id VARCHAR(100),
    @username VARCHAR(100),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @role VARCHAR(100)
)
AS
BEGIN
    delete users WHERE id = @id
END