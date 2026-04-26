function calculate(){
let m1 = Number(document.getElementById("m1").value);
let m2 = Number(document.getElementById("m2").value);
let m3 = Number(document.getElementById("m3").value);
let m4 = Number(document.getElementById("m4").value);
let m5 = Number(document.getElementById("m5").value);
let m6 = Number(document.getElementById("m6").value);
let m7 = Number(document.getElementById("m7").value);
let m8 = Number(document.getElementById("m8").value);
let total = m1+m2+m3+m4+m5+m6+m7+m8;
let result = document.getElementById("result");

result.classList.add("show");

if(total < 400){
    result.innerHTML = "Total: " + total + " - Fail";
    result.style.color = "red";
    result.style.background = "#ffebee";
}
else if(total < 500){
    result.innerHTML = "Total: " + total + " - Third Division";
    result.style.color = "#ff6f00";
    result.style.background = "#fff3e0";
}
else if(total < 600){
    result.innerHTML = "Total: " + total + " - Second Division";
    result.style.color = "#1976d2";
    result.style.background = "#e3f2fd";
}
else if(total < 700){
    result.innerHTML = "Total: " + total + " - First Division";
    result.style.color = "#388e3c";
    result.style.background = "#e8f5e9";
}
else{
    result.innerHTML = "Total: " + total + " - Distinction";
    result.style.color = "green";
    result.style.background = "#c8e6c9";
}

}