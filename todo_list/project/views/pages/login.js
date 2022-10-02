const { default: Swal } = require("sweetalert2");

//register
async function signUp(){
    const response = await fetch("http://localhost:3000/user/register", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({ 
           userName: document.getElementById("registerUser").value,
           userPassword: document.getElementById("pass1").value,
           pass2: document.getElementById("pass2").value
          })
        });
    
        response.text().then(data => {
          console.log(typeof(data));
          if(data=="the user name is already exists" || data== "the user password is already exists" || data=="the user exists" || data=="the repeat password does'nt match the password")
            alert(data)
          else{
            data=JSON.parse(data)
            sessionStorage.setItem("userId", data["id"]);
            sessionStorage.setItem("userName", document.getElementById("registerUser").value);            
           window.location.href =`/user/getAllTasks/${sessionStorage.getItem("userId")}`
          }
        });
}

//login
async function signIn(){
    const response = await fetch("http://localhost:3000/user/login", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({ 
       userName: document.getElementById("user").value,
       userPassword: document.getElementById("pass").value
      })
    });

    response.text().then(data => {
      console.log(data);
          if(data=="the password is not correct" || data=="the user name is not correct" || data=="the user is not exists, please register" || data=="sql injection")
            Swal.fire(data);
          else{
            data=JSON.parse(data)
            sessionStorage.setItem("userId", data["id"]);
            sessionStorage.setItem("userName", data["userName"]);
            window.location.href =`/user/getAllTasks/${sessionStorage.getItem("userId")}`
          }
    });
}