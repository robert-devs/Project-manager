"use strict";
const userTable = document.getElementById("user-table");
const userProjectsTableBody = document.getElementById("user-projects-table-body");
const projectTable = document.getElementById("project-table");
class UserDashboard {
    constructor() {
        var _a;
        this.BASE_URL = "http://localhost:5000";
        this.projects = [];
        if (!this.isLoggedIn()) {
            window.location.replace("./index.html");
            // console.log(this.users);
        }
        {
            try {
                const user = JSON.parse((_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "");
                if ((user === null || user === void 0 ? void 0 : user.role) !== "user") {
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
        // console.log({userProjectsTableBody} );
        // console.log("PRO", this.projects);
        const html = this.projects.map((projects) => {
            var _a;
            return (`
        <tr>
        <td>${(_a = projects.id) === null || _a === void 0 ? void 0 : _a.substring(0, 10)} ...</td>
         <td>${projects.name}</td>
        <td>${projects.description}</td>
       <td>${new Date(projects.duedate).toDateString()}</td>
        <td><button class = "btn">Delete</button></td>
        </tr>
        `);
        }).join('');
        userProjectsTableBody.innerHTML = html;
    }
    fetchProjects() {
        var _a;
        const user = JSON.parse((_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "");
        fetch(`${this.BASE_URL}/projects/assigned/${user === null || user === void 0 ? void 0 : user.id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(res => {
            var _a;
            if (((_a = res.projects) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.projects = res.projects;
                localStorage.setItem("projects", JSON.stringify(res.projects));
                this.showProjects();
            }
            else {
                alert(res.message);
            }
        })
            .catch(error => {
            console.log(error);
        });
        // call backend - POST using fetch
    }
}
const userDashboard = new UserDashboard();
