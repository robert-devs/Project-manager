"use strict";
const formContainer = document.querySelector(".form-container");
const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const showLoginBtn = document.querySelector(".show-login-btn");
const showRegisterBtn = document.querySelector(".show-register-btn");
class App {
    constructor() {
        this.BASE_URL = "http://localhost:5000";
        this.RegisterProject = [];
    }
    logginUser(email, password) {
        fetch(`${this.BASE_URL}/users/login`, {
            method: "POST",
            mode: 'cors',
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
            console.log(error.response);
        });
        // call backend - POST using fetch
    }
    RegisterUser({ name, username, email, password }) {
        fetch(`${this.BASE_URL}/users/register`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                username,
                role: "user",
                email,
                password
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
const app = new App();
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
        alert("please enter name");
        return;
    }
    if (!usernameInput.value) {
        alert("please enter username");
        return;
    }
    if (!passwordInput.value) {
        alert("please enter password");
        return;
    }
    app.RegisterUser({
        name: nameInput.value,
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    });
});
