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