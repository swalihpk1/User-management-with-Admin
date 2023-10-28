// ----------User_Sign_up_validation-------

const signName = document.querySelector('#signName');
const form = document.querySelector(".form");
const signPhone = document.querySelector('#signPhone');
const errDisplay = document.getElementById("error");

form.addEventListener("submit", onSubmit);

function onSubmit(event){
    console.log(signName.value.length);
    if(signName.value.length >= 5 ) {
        event.preventDefault();
        errDisplay.innerHTML = "required 5 characters";
    }

}
