function calculate(operation){

    let n1 = Number(document.getElementById("n1").value);
    let n2 = Number(document.getElementById("n2").value);
    let result;

    if (isNaN(n1) || isNaN(n2)) {
        result = "Please enter valid numbers";
    }
    else if (n1 > 100 || n2 > 100) {
        result = "Number should not be greater than 100";
    }
    else if(operation === "add"){
        result = n1 + n2;
    }
    else if(operation === "sub"){
        result = n1 - n2;
    }
    else if(operation === "mul"){
        result = n1 * n2;
    }
    else if(operation === "div"){
        if(n2 === 0){
            result = "Cannot divide by zero";
        } else {
            result = n1 / n2;
        }
    }
    else{
        result = "Invalid operation";
    }

    document.getElementById("result").innerText = "Result: " + result;
}

