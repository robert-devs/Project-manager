"use strict";
const formContainer = document.querySelector(".form-container")! as HTMLDivElement;
const dashboardContainer = document.querySelector(".dashboard-container")! as HTMLDivElement;

const registerForm = document.querySelector("#register-form")! as HTMLFormElement;
const loginForm = document.querySelector("#login-form")! as HTMLFormElement;

const showLoginBtn = document.querySelector(".show-login-btn")! as HTMLButtonElement;
const showRegisterBtn = document.querySelector(".show-register-btn")! as HTMLButtonElement;


class App {
    readonly BASE_URL = "http://localhost:5000"
    user = {};
    registerUser: any;

    constructor() {
        this.setupDisplay();
    }

    isRegistered(){
        return
    }
    
    isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
    
    setupDisplay(){
        if (this.isLoggedIn()) {
            formContainer.style.display = "none"
            dashboardContainer.style.display = "flex";

            if(localStorage.getItem("user") !== null){
                try {
                    this.user = JSON.parse(localStorage.getItem("user")?? "")
                } catch (error) {
                    localStorage.clear();
                    this.setupDisplay()
                    
                }
                
            }
        }
        else {
            formContainer.style.display = "flex"
            dashboardContainer.style.display = "none"
        }
    }
    
    logginUser(email: string, password: string){
        
        fetch(`${this.BASE_URL}/users/login`, {
            method:"POST", 
            headers: {
              'content-type': 'application/json',
            },
            body:JSON.stringify({ email, password})
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                //
                localStorage.setItem("token", res.token)
                localStorage.setItem("user", JSON.stringify(res.user))

                alert("Logged In successfully")
                this.setupDisplay();
            }else{
                alert(res.message)
            }
        })
        .catch(error=>{
            console.log(error.response);
            
        })
        
        
        // call backend - POST using fetch
    }

    //regiser anew user
    RegisterUser (name:string,username:string,role:string,email:string,password:string){
        fetch(`${this.BASE_URL}/user/register`,{
            method:"POST",
            headers:{
                'conntent-type':'application/json',
            },
            body:JSON.stringify({name,username,role,email,password})
        })
        .then(res =>res.json())
        .then(res=>{
            if(res.success){
                //
                localStorage.setItem("token", res.token)
                localStorage.setItem("user", JSON.stringify(res.user))

                alert("user registered  successfully")
                this.setupDisplay();
            }else{
                alert(res.message)
            }
        })
        .catch(error=>{
            console.log(error.message)
        })
    }

}

const app = new App();


console.log(showLoginBtn, showRegisterBtn);

showLoginBtn.onclick = ()=>{
    loginForm.style.display = "flex"
    registerForm.style.display = "none"
    registerForm.reset()
}

showRegisterBtn.onclick = ()=>{
    registerForm.style.display = "flex"
    loginForm.style.display = "none"
    loginForm.reset()
}

loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const emailInput = document.getElementById("login_email")! as HTMLInputElement
    const passwordInput = document.getElementById("logIn_password")! as HTMLInputElement

     if (!emailInput.value){
        alert("please enter email")
        return
     }
     if (!passwordInput.value){
        alert("please enter password")
        return
     }

     app.logginUser(emailInput.value, passwordInput.value)

})

registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const nameInput = document.getElementById("register_name")! as HTMLInputElement
    const usernameInput = document.getElementById("register_username")! as HTMLInputElement
    const roleInput = document.getElementById("register_role")! as HTMLInputElement
    const emailInput = document.getElementById("register_email")! as HTMLInputElement
    const passwordInput = document.getElementById("register_password")! as HTMLInputElement


     if (!emailInput.value){
        alert("please enter email")
        return
     }

     if (!nameInput.value){
        alert("please enter email")
        return
     }

     if (!usernameInput.value){
        alert("please enter email")
        return
     }

     if (!passwordInput.value){
        alert("please enter email")
        return
     }
        app.RegisterUser(emailInput.value, nameInput.value,usernameInput.value,roleInput.value,passwordInput.value)
     
})