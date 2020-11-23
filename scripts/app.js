let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

for(let i=0; i<7; i++) {

   alert(dias[i]); 

    if( i % 2 == 0)
    {
        alert('Este dia es PAR');
    }
    
    if (i==6){
        alert('TERMINO LA SEMANA!!!');
    }
}
