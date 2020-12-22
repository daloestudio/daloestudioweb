let carrito  = 
{
    productos : [],
    promos: [],
    envio : {
        codigoOpcionEnvio : "",
        direccion : "",
        codigoPostal : "",
        nombreReceptor : "",
        identificacionReceptor : ""
    }
}

function comprarProducto(ev){
    var sib = $(ev).siblings("p");
    let productInfo = "";
    for(let i=0;i<sib.length;i++){
       productInfo +=  sib[i].innerText + "\r\n";
    }

    alert("Producto comprado: " + productInfo);
}

function agregarProducto(carrito, producto) {
    carrito.productos.push(producto);
    calcularPromos(carrito);
}

function calcularPromos(carrito) {
    if(carrito.productos.filter(prod=> prod.tipo == "ROLLO").length > 4)
    {
        let promo = {
            descripcion : "PROMO 20% OFF CON 4 O MAS ROLLOS",
            descuento : 20,
            tipo: "PORCENTAJE"
        }
        carrito.promos.push(promo);
    }
}
