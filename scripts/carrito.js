let carrito;

let carrito_string = sessionStorage.getItem("carrito");
if(carrito_string)
    {
        carrito = JSON.parse(carrito_string);
        let counterElement = document.getElementsByClassName("cart-counter");
        if(counterElement && counterElement.length > 0)
        {
            let counter =  parseInt(counterElement[0].innerText);
            counter= carrito.productos.length;
            counterElement[0].innerText = counter;
        }
   }
else 
{
   carrito = 
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
}


function comprarProducto(ev){
    var sib = $(ev).siblings("");
    let producto = { 
        tipo : "ROLLO",
        cantidad : 1

    };
    for(let i=0;i<sib.length;i++){

        switch(sib[i].className) {
            case "item-description":
                producto.descripcion = sib[i].innerText;
                break;
            case "item-price": {
                producto.precio = sib[i].innerText;
                break;
            }
            case "item-img" : {
                producto.imagen = sib[i].src;
                break;
            }
        }
    }

    agregarProducto(producto);

}

function agregarProducto(producto) {
    carrito.productos.push(producto);
    calcularPromos(carrito);

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    let counterElement = document.getElementsByClassName("cart-counter");
    if(counterElement && counterElement.length > 0)
    {
        let counter =  parseInt(counterElement[0].innerText);
        counter++;
        counterElement[0].innerText = counter;
    }
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

function mostrarCarrito(){
  let template =  document.getElementsByClassName("product-row d-none")[0];

    let total = 0;
   for(let i=0;i<carrito.productos.length; i++){
        let clone = template.cloneNode(true);
        let producto = carrito.productos[i];

        clone.className = clone.className.replace("d-none","");

        clone.getElementsByClassName("product-img")[0].src = producto.imagen;
        clone.getElementsByClassName("product-description")[0].innerText = producto.descripcion;
        clone.getElementsByClassName("product-price")[0].innerText = producto.precio;
        clone.getElementsByClassName("product-quantity")[0].innerText = producto.cantidad;
        clone.getElementsByClassName("product-total")[0].innerText = producto.cantidad  * parseFloat(producto.precio.replace("$",""));
        insertAfter(template.parentNode.firstElementChild, clone);

        total += (producto.cantidad *  parseFloat(producto.precio.replace("$","")));
   }

   document.getElementsByClassName("cart-footer-total")[0].innerText = total;
  
}

function insertAfter(e,i){ 
    if(e.nextSibling){ 
        e.parentNode.insertBefore(i,e.nextSibling); 
    } else { 
        e.parentNode.appendChild(i); 
    }
}