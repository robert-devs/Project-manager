"use strict";
const formContainer = document.querySelector(".form-container");
const dashboardContainer = document.querySelector(".dashboard-container");
const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const showLoginBtn = document.querySelector(".show-login-btn");
const showRegisterBtn = document.querySelector(".show-register-btn");
class App {
    constructor() {
        this.BASE_URL = "http://localhost:5000";
        this.user = {};
        this.setupDisplay();
    }
    isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
    setupDisplay() {
        var _a;
        if (this.isLoggedIn()) {
            formContainer.style.display = "none";
            dashboardContainer.style.display = "flex";
            if (localStorage.getItem("user") !== null) {
                try {
                    this.user = JSON.parse((_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "");
                }
                catch (error) {
                    localStorage.clear();
                    this.setupDisplay();
                }
            }
        }
        else {
            formContainer.style.display = "flex";
            dashboardContainer.style.display = "none";
        }
    }
    logginUser(email, password) {
        fetch(`${this.BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
            if (res.success) {
                //
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
                alert("Logged In successfully");
                this.setupDisplay();
            }
            else {
                alert(res.message);
            }
        })
            .catch(error => {
            console.log(error.response);
        });
        // call backend - POST using fetch
    }
}
const app = new App();
console.log(showLoginBtn, showRegisterBtn);
showLoginBtn.onclick = () => {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    registerForm.reset();
};
showRegisterBtn.onclick = () => {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
    loginForm.reset();
};
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("login_email");
    const passwordInput = document.getElementById("logIn_password");
    if (!emailInput.value) {
        alert("please enter email");
        return;
    }
    if (!passwordInput.value) {
        alert("please enter password");
        return;
    }
    app.logginUser(emailInput.value, passwordInput.value);
});
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("register_name");
    const usernameInput = document.getElementById("register_username");
    const emailInput = document.getElementById("register_email");
    const passwordInput = document.getElementById("register_password");
    if (!emailInput.value) {
        alert("please enter email");
        return;
    }
    if (!nameInput.value) {
        alert("please enter email");
        return;
    }
    if (!usernameInput.value) {
        alert("please enter email");
        return;
    }
    if (!passwordInput.value) {
        alert("please enter email");
        return;
    }
});
