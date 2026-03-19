function calculate(operator) {
    let n1 = parseFloat(document.getElementById("n1").value);
    let n2 = parseFloat(document.getElementById("n2").value);
    let result;
    if (operator === "+") {
        result = n1 + n2;
    } else if (operator === "-") {
        result = n1 - n2;
    } else if (operator === "*") {
        result = n1 * n2;
    } else if (operator === "/") {
        if (n2 === 0) {
            document.getElementById("result").innerHTML = "Cannot divide by zero";
            return;
        }
        result = n1 / n2;
    } else {
        result = "Invalid";
    }

    document.getElementById("result").innerHTML = "Result: " + result;
}