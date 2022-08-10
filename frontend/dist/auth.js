"use strict";
class Auth {
    constructor() {
        if (this.isLoggedIn()) {
            console.log("User logged in");
        }
        else {
            console.log("Please loggin");
        }
    }
    isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
}
console.log("Hey");
const auth = new Auth();
