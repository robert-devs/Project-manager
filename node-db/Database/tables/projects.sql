CREATE TABLE projects
(
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    userId VARCHAR(100) NOT NULL FOREIGN KEY REFERENCES users(id),
    name VARCHAR(100) not NULL,
    description VARCHAR(100) NOT NULL,
    duedate VARCHAR(100) NOT NULL,
    issent VARCHAR(5),
)


ALTER TABLE projects ADD issent VARCHAR(5) DEFAULT '0';

SELECT *
FROM projects


DROP TABLE projects