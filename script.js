
let Localversion = {
    "python": "3.10.0",
    "java": "15.0.2",
    "javascript": "1.32.3",
    "csharp.net": "5.0.201",
    "cpp": "10.2.0"
};


let versionShower = document.getElementById("versionShower");


function UpdateVersion() {
    let selectedLanguage = document.querySelector(".language").value;
    versionShower.innerText = "Version: " + (Localversion[selectedLanguage] || "Unknown");
}

document.getElementById("versionCheckbox").addEventListener("change", function () {
    if (this.checked) {
        UpdateVersion(); 
    } else {
        versionShower.innerText = ""; 
    }
});

document.querySelector(".language").addEventListener("change", function () {
    if (document.getElementById("versionCheckbox").checked) {
        UpdateVersion();
    }
});


document.getElementById("btn").addEventListener('click', () => {
    let selectedLanguage = document.querySelector(".language").value;
    let code = document.getElementById("code").value;

    if(code==="" || code===undefined){
        alert("Please write the code")
        return;
    }

    let payload = JSON.stringify({
        language: selectedLanguage,
        version: Localversion[selectedLanguage], 
        files: [{ content: code }]
    });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://emkc.org/api/v2/piston/execute", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let outputDiv = document.getElementById("output");
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                outputDiv.innerText = response.run.output || "No output";
            } else {
                outputDiv.innerText= "Error: Unable to execute code.";
                console.error("Error:", xhr.status, xhr.statusText);
                outputDiv.style.color = "red"
            }
        }
    };

    xhr.send(payload);
});




let AIchat = document.getElementById("AIchat");
let AIbtn = document.getElementById("AIbtn");

AIchat.addEventListener("input", function () {
    if (AIchat.value.trim() !== "") {
        AIbtn.style.display = "block";
    } else {
        AIbtn.style.display = "none"; 
    }
});



function generateContent() {

    const apiKey = "AIzaSyBWQwPuDOSrRrd4ravR1a5uHe2BMiY2Hb4";
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let question = document.getElementById("AIchat").value;
    let answer = document.getElementById("chat");

    const requestBody = {
    contents: [{ parts: [{ text: question }] }]
    };
     
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
     
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {

    if (xhr.status === 200) {

    const response = JSON.parse(xhr.responseText);

    // answer.innerText = question.value;
    if (response.candidates && response.candidates.length > 0) {

       
        // answer.innerText = response.candidates[0].content.parts[0].text;

        answer.innerHTML = `<div class="user-ai-div">
            <div class="usertext-div">
            <p class="usertext">${question}</p>
            </div>
           
            <div class="aitext-div">
             <p class="aitext">${response.candidates[0].content.parts[0].text}</p>
            </div>
        
        </div>`

    } 
    else {

      answer.innerText = "No response from Gemini.";

    }

    } 
    else {

    console.error("Error:", xhr.status, xhr.statusText);

    }

    }

    };
     
    xhr.send(JSON.stringify(requestBody));
    question.innerText = ""
    }


