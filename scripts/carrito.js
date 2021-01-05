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

function modificarCantidad(ev, cantidad){
    let parent = $($(ev).parents(".product-row")[0]);
    let codigoProducto = parent.children(".product-code").text();
    let productoExistente = carrito.productos.find(x=> x.codigo === codigoProducto);
    modificarProducto(productoExistente, cantidad);
    parent.find(".product-quantity").text(productoExistente.cantidad) ;
    if(productoExistente.cantidad ==0)
    {
        parent.remove();
    }
}

function comprarProducto(ev){
    let sib = $(ev).siblings("");
    let producto = { 
        tipo : "ROLLO",
        cantidad : 0

    };
    for(let i=0;i<sib.length;i++){

        switch(sib[i].classList[0]) {
            case "item-description":
                producto.descripcion = sib[i].innerText;
                break;
            case "item-code":
                producto.codigo = sib[i].innerText;
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

    modificarProducto(producto, 1);

}

function modificarProducto(producto, cantidad) {    

    var productoExistente = carrito.productos.find(x=> x.codigo === producto.codigo);
    if(!productoExistente)
    {
        producto.cantidad += cantidad;
        carrito.productos.push(producto);
    }
    else if(producto.cantidad+cantidad == 0)
    {
        let indexOfProducto = carrito.productos.indexOf(productoExistente);
        carrito.productos.splice(indexOfProducto, 1);
        producto.cantidad =0;   
    }
    else {
        productoExistente.cantidad += cantidad;
        producto.cantidad = productoExistente.cantidad;
    }

    calcularPromos(carrito);

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    let counterElement = document.getElementsByClassName("cart-counter");
    if(counterElement && counterElement.length > 0)
    {
        let counter =  0;
        carrito.productos.forEach(function(value){
                counter += (value.cantidad)
        });
        counterElement[0].innerText = counter;
    }

    actualizarTotal(carrito);s
}

function actualizarTotal(carrito){
    let total = 0;
    for(let i=0;i<carrito.productos.length; i++){
         let producto = carrito.productos[i];
         total += (producto.cantidad *  parseFloat(producto.precio.replace("$","")));
    }
    
    document.getElementsByClassName("cart-footer-total")[0].innerText = total;
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

        clone.className = clone.className.replace("d-none","product-row-active");

        clone.getElementsByClassName("product-code")[0].innerText = producto.codigo;
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

function cargarProductos(){
    $.ajax({
        url: "data/datos.json", //un archivo json con datos de usuarios: nombre, apellido, etc
        dataType: "json",
        success: function(response) {
          let template =  document.getElementsByClassName("store-item-row d-none")[0];
          let clone = null;

          let j = 0;
          for(let i = 0 ; i<response.productos.length; i++){

            if(i % 4 == 0)
            {
                clone = template.cloneNode(true);
                clone.className = clone.className.replace("d-none","");
            }
            
              //falta buscar la forma de acomodar en el sitema de grillas
            let producto = response.productos[i];
            var itemColumns =clone.getElementsByClassName("store-item");
            var column = itemColumns[ i % 4 ];



            column.getElementsByClassName("item-code")[0].innerText = producto.codigo;
            column.getElementsByClassName("item-img")[0].src = producto.imagen;
            column.getElementsByClassName("item-img")[0].alt = producto.descripcion;
            column.getElementsByClassName("item-description")[0].innerText = producto.descripcion;
            column.getElementsByClassName("item-price")[0].innerText = producto.precio;
            insertAfter(clone.firstElementChild, column);
    
          }

        }
    });
      
}