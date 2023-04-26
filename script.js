//Variabler för URL adresser
const userURL = "http://localhost:1337/api/auth/local/";
const studentsURL = "http://localhost:1337/api/students";

//Skapa Eventlistener till SendData button
document.getElementById("btnSendData").addEventListener("click", sendData);

//Funktion för att skicka data
async function sendData() {
    //Hämta userName och Password (ignorera validering)
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    //Skapa ett JS objekt med indetifier och password some attribut
    let userData = {
        "identifier": username,
        "password": password
    };

    //Skicka en Payload till userURL och få en AWT tillbaka
    let userResponse = await sendHTTPRequest(userURL, {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(userData)
    });

    //Om inloggning misslyckades, avbryt processen
    if (!userResponse.jwt) {
        alert("Felaktig inloggning");
        return;
    }

    let token = userResponse.jwt;

    //Hämta data om ny student
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let age = parseInt( document.getElementById("age").value );

    //Skapa ett js objekt med ny student data
    let studentData = {
        "data": {
            "firstName":firstName,
            "lastName":lastName,
            "age":age
        }
    };
    
    //Skicka en payload till studentsURL med data
    let studentResponse = await sendHTTPRequest(studentsURL, {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(studentData)
    });

    //Få bekräftelse tillbaka
    alert(`${studentResponse.data.attributes.firstName} har lagts till!`);
}

//Metod som tar in en HTTP request. Returnerar en Respons.
async function sendHTTPRequest(url, payload = null) {
    //Skicka payload till url
    let response = await fetch(url, payload);
    let jsObject = await response.json();

    return jsObject;
}