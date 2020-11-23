let number1 = Number(prompt("Ingrese un Numero"));

if(number1 > 0)
{
    alert("El numero es positivo!");
    if(number1 >= 10 && number1 <= 50)
    {
        console.log("El numero esta entre 10 y 50. El numero es: " + number1);
    }
}