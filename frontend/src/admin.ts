const projectsBtn = document.getElementById("projects-btn")! as HTMLButtonElement;
const usersBtn = document.getElementById("users-btn")! as HTMLButtonElement;
const createProjectBtn = document.getElementById("create-project-btn")! as HTMLButtonElement;

const projectsTable = document.getElementById("projects-table")! as HTMLDivElement;
const projectsTableBody = document.getElementById("projects-table-body")! as HTMLElement;

const usersTable = document.getElementById("users-table")! as HTMLDivElement;
const usersTableBody = document.getElementById("users-table-body")! as HTMLElement;

const addprojectmBody = document.getElementById("users-table-body")! as HTMLElement;
const addProjectForm = document.getElementById("add-project-form")! as HTMLFormElement;

interface ProjectInterface{
    id?:string
    pname:string,
    description: string,
    userId: string,
    uname: string,
    duedate: string
}
interface UserInterface{
    id?:string,
    username:string,
    email:string,
    name:string,
    password?:string,
    role:string
    description:string
}


class AdminDashboard {
    [x: string]: any;
    readonly BASE_URL = "http://localhost:5000"
    projects:ProjectInterface[] | [] = [];
    users:UserInterface[ ] | [] =[];
    form:ProjectInterface[]|[]=[]
    constructor() {
        if(!this.isLoggedIn()){
            window.location.replace("./index.html")
        }else{

            try {
                const user = JSON.parse(localStorage.getItem("user") ?? "");
                if(user?.role !== "admin"){
                    localStorage.clear()
                     window.location.replace("./index.html")
                }else{
                    this.fetchProjects();
                    this.fetchUsers()
                }
            } catch (error) {
                window.location.replace("./index.html")
            }
        }
    }
    
    isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }

    showProjects(){
        // console.log(projectsTableBody);
        // console.log(this.projects);

        const html = this.projects.map((project: ProjectInterface)=>(`
        <tr >
            <td>${project.pname}</td>
            <td>${project.description}</td>
            <td>${project.uname}</td>
            <td>${new Date(project.duedate).toDateString()}</td>
            <td><button class = "delete-project-btn" data-id="${project.id}" >delete</button></td>
             <td><button  class = "updateProject"  data-id="${project.id}" >update</button></td>
            
        </tr>

        `)).join('')

        projectsTableBody.innerHTML = html;
        this.addEventlisteners()
    }
    
    fetchProjects(){
        fetch(`${this.BASE_URL}/projects/all`, {
            method:"GET", 
            headers: {
              'content-type': 'application/json',
            },
        })
        .then(res=>res.json())
        .then(res=>{
            this.projects = res.projects;
            this.showProjects()
        })
        .catch(error=>{
            console.log(error.response);
        })
        // call backend - POST using fetch
    }

    
    populateUsers(){
        // console.log(this.users);
        const html = this.users.map(({id, name})=>{
            
            return `<option value='${id}'>${name}</option>`
        }).join("")

        const userIdSelectInput = document.getElementById("create_userId")! as HTMLSelectElement;
        userIdSelectInput.innerHTML = `<option value=""></option>` ;
        userIdSelectInput.innerHTML += html;
    }




    //USER
    showUsers(){
        // console.log(usersTableBody );
        // console.log(this.users);

        const html = this.users.map((users: UserInterface)=>(`
        <tr>
        <td>${users.id?.substring(0, 10)} ...</td>
        <td>${users.username}</td>
        <td>${users.email}</td>
        <td>${users.name}</td>
        <td>${users.role}</td>
          
        </tr>
        `)).join('')

        usersTableBody.innerHTML = html;

        this.addEventlisteners()
    }

      fetchUsers(){
        fetch(`${this.BASE_URL}/users`, {
            method:"GET", 
            headers: {
              'content-type': 'application/json',
            },
        })
        .then(res=>res.json())
        .then(res=>{
            this.users = res.users;
            // console.log( this.users)
            this.showUsers()
        })
        .catch(error=>{
            console.log(error.response);
        })
        // call backend - get using fetch
    }


    //ADD REGISTER FORM
    addProject({name,userId,description,duedate}:{name: string,userId: string,description: string,duedate: string}){
        fetch(`${this.BASE_URL}/projects/create`,{
            method:"POST",
            mode: 'cors',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                userId,
                name,
                description,
                duedate
                
            })
        })
        .then(res =>res.json())
        .then(res=>{
            if(res.success){
                alert("Project Created Successfully")
                addProjectForm.reset()
            }else{
                alert(res.message)
            }
        })
        .catch(error=>{
            console.log(error.message)
        })
    }

    //deleteProject
  deletePoject(id: string){
    fetch(`${this.BASE_URL}/projects/${id}`,{
            method:"DELETE",
            mode: 'cors',
            headers:{
                'Content-Type':'application/json',
            }
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                this.fetchProjects()
                alert('project deleted succesfully')
            }else{
                alert(res.message)
            }
        })
  }
//   updateProject



    //eventslisterners
    addEventlisteners = ()=>{
        const   deleteProjectBtns = document.querySelectorAll('.delete-project-btn')

        // console.log(deleteProjectBtns);
        
        for (const index in deleteProjectBtns){
            const deleteProjectBtn = deleteProjectBtns[index]
            if(deleteProjectBtn instanceof HTMLButtonElement){
                deleteProjectBtn.addEventListener('click',(e)=>{
                    
                    if(e.target){
                        const target=e.target as HTMLElement;
                        const id = target.getAttribute('data-id')
                        console.log("IFD", target);
                        if(id) this.deletePoject(id)
                    }
                })
            }
        }

        ///delete
        const deletebtns =document.querySelectorAll('.deleteBtn')
        // console.log(deletebtns)
        for (const index in deletebtns){
            const deleteBtn = deletebtns[index]
            if(deleteBtn instanceof HTMLButtonElement){
                deleteBtn.addEventListener('click',(e)=>{
                    if (e.target){
                        const target =e.target as HTMLElement
                        const id =target.getAttribute("data-id")
                        if(id)this.deleteProject(parseInt(id))
                    }
                })
            }
        }
        const updateProjects= document.querySelectorAll('.updateProject')
        console.log(updateProjects)
        for (const index in updateProjects){

        }

    }

}

const admin = new AdminDashboard();

projectsBtn.onclick = ()=>{
    //
    usersTable.style.display = "none";
    addProjectForm.style.display = "none";
    projectsTable.style.display = "block";
    admin.fetchProjects();
}

usersBtn.onclick = ()=>{
    //
    addProjectForm.style.display = "none";
    projectsTable.style.display = "none";
    usersTable.style.display = "block";
    admin.fetchUsers();
}
createProjectBtn.onclick = ()=>{
    addProjectForm.style.display = "block";
    usersTable.style.display = "none";
    projectsTable.style.display = "none";
    admin.populateUsers()
}

addProjectForm.addEventListener("submit", e=>{
    e.preventDefault();
    const nameInput = document.getElementById("create_name")! as HTMLInputElement
    const userIdIput = document.getElementById("create_userId")! as HTMLInputElement
    const descriptionInput = document.getElementById("create_description")! as HTMLInputElement
    const duedateInput = document.getElementById("create_date")! as HTMLInputElement


    if (!nameInput.value){
       alert("please enter name")
       return
    }

     if (!userIdIput.value){
        alert("please enter email")
        return
     }


     if (!descriptionInput.value){
        alert("please enter description")
        return
     }

     if (!duedateInput.value){
        alert("please enter password")
        return
     }

        admin.addProject({
            userId: userIdIput.value, 
            name: nameInput.value, 
            description: descriptionInput.value,
            duedate:duedateInput.value
        })
    })



