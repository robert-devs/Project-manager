"use strict";
const projectsBtn = document.getElementById("projects-btn");
const usersBtn = document.getElementById("users-btn");
const createProjectBtn = document.getElementById("create-project-btn");
const projectsTable = document.getElementById("projects-table");
const projectsTableBody = document.getElementById("projects-table-body");
const usersTable = document.getElementById("users-table");
const usersTableBody = document.getElementById("users-table-body");
const addprojectmBody = document.getElementById("users-table-body");
const addProjectForm = document.getElementById("add-project-form");
class AdminDashboard {
    constructor() {
        var _a;
        this.BASE_URL = "http://localhost:5000";
        this.projects = [];
        this.users = [];
        this.form = [];
        if (!this.isLoggedIn()) {
            window.location.replace("./index.html");
        }
        else {
            try {
                const user = JSON.parse((_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "");
                if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                    localStorage.clear();
                    window.location.replace("./index.html");
                }
                else {
                    this.fetchProjects();
                }
            }
            catch (error) {
                window.location.replace("./index.html");
            }
        }
    }
    isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
    showProjects() {
        console.log(projectsTableBody);
        // console.log(this.projects);
        const html = this.projects.map((project) => (`
        <tr>
            <td>${project.pname}</td>
            <td>${project.description}</td>
            <td>${project.uname}</td>
            <td>${new Date(project.duedate).toDateString()}</td>
            <td><button class = "btn">update</button></td>
        </tr>
        `)).join('');
        projectsTableBody.innerHTML = html;
    }
    fetchProjects() {
        fetch(`${this.BASE_URL}/projects/all`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(res => {
            this.projects = res.projects;
            this.showProjects();
        })
            .catch(error => {
            console.log(error.response);
        });
        // call backend - POST using fetch
    }
    //USER
    showUsers() {
        // console.log(usersTableBody );
        // console.log(this.users);
        const html = this.users.map((users) => {
            var _a;
            return (`
        <tr>
        <td>${(_a = users.id) === null || _a === void 0 ? void 0 : _a.substring(0, 10)} ...</td>
        <td>${users.username}</td>
        <td>${users.email}</td>
        <td>${users.name}</td>
        <td>${users.role}</td>
            <td><button class = "btn">Delete</button></td>
        </tr>
        `);
        }).join('');
        usersTableBody.innerHTML = html;
    }
    fetchUsers() {
        fetch(`${this.BASE_URL}/users`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(res => {
            this.users = res.users;
            console.log(this.users);
            this.showUsers();
        })
            .catch(error => {
            console.log(error.response);
        });
        // call backend - get using fetch
    }
    //ADD REGISTER FORM
    addProject({ name, userId, description, duedate }) {
        fetch(`${this.BASE_URL}/projects/create`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                name,
                description,
                duedate
            })
        })
            .then(res => res.json())
            .then(res => {
            if (res.success) {
                //
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
                alert("user registered  successfully");
                if (res.user.role === "admin") {
                    window.location.replace("./admin.html");
                }
                else {
                    window.location.replace("./user.html");
                }
            }
            else {
                alert(res.message);
            }
        })
            .catch(error => {
            console.log(error.message);
        });
    }
}
const admin = new AdminDashboard();
projectsBtn.onclick = () => {
    //
    usersTable.style.display = "none";
    addProjectForm.style.display = "none";
    projectsTable.style.display = "block";
    admin.fetchProjects();
};
usersBtn.onclick = () => {
    //
    addProjectForm.style.display = "none";
    projectsTable.style.display = "none";
    usersTable.style.display = "block";
    admin.fetchUsers();
};
createProjectBtn.onclick = () => {
    addProjectForm.style.display = "block";
    usersTable.style.display = "none";
    projectsTable.style.display = "none";
};
addProjectForm.addEventListener("submit", e => {
    e.preventDefault();
    const nameInput = document.getElementById("create_name");
    const userIdIput = document.getElementById("create_userId");
    const descriptionInput = document.getElementById("create_description");
    const duedateInput = document.getElementById("create_date");
    if (!nameInput.value) {
        alert("please enter name");
        return;
    }
    if (!userIdIput.value) {
        alert("please enter email");
        return;
    }
    if (!descriptionInput.value) {
        alert("please enter description");
        return;
    }
    if (!duedateInput.value) {
        alert("please enter password");
        return;
    }
    admin.addProject({
        userId: userIdIput.value,
        name: nameInput.value,
        description: descriptionInput.value,
        duedate: duedateInput.value
    });
});
