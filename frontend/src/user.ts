
const userTable = document.getElementById("user-table")! as HTMLDivElement;
const userProjectsTableBody = document.getElementById("user-projects-table-body")! as HTMLTableElement;
const projectTable = document.getElementById("project-table")! as HTMLDivElement;



interface projectsInterfaces{
    id?:string,
    name:string,
    description:string
    role:string
    duedate:string
}

class UserDashboard {
    readonly BASE_URL = "http://localhost:5000"
    projects:projectsInterfaces[] | [] = [];

    constructor() {
        if(!this.isLoggedIn()){
            window.location.replace("./index.html")
            // console.log(this.users);
        }{
            try {
                const user = JSON.parse(localStorage.getItem("user") ?? "");
                if(user?.role !== "user"){
                    localStorage.clear()
                     window.location.replace("./index.html")
                }else{
                    this.fetchProjects()
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
        // console.log({userProjectsTableBody} );
        // console.log("PRO", this.projects);

        const html = this.projects.map((projects: projectsInterfaces)=>(`
        <tr>
        <td>${projects.id?.substring(0, 10)} ...</td>
         <td>${projects.name}</td>
        <td>${projects.description}</td>
       <td>${new Date(projects.duedate).toDateString()}</td>
        </tr>
        `)).join('')
        userProjectsTableBody.innerHTML = html;
    }
    
    fetchProjects(){
        const user = JSON.parse(localStorage.getItem("user") ?? "");
        
        fetch(`${this.BASE_URL}/projects/assigned/${user?.id}`, {
            method:"GET", 
            headers: {

              'content-type': 'application/json',
            },
            
        })
        .then(res=>res.json())
        .then(res=>{
            
            
            if(res.projects?.length>0){
                this.projects = res.projects
                localStorage.setItem("projects", JSON.stringify(res.projects))
                this.showProjects()

            }else{
                alert(res.message)
            }
        })
        .catch(error=>{
            console.log(error);
            
        })
        
        
        // call backend - POST using fetch
    }
}

const userDashboard = new UserDashboard();