let carrito;

let carrito_string = sessionStorage.getItem("carrito");
if(carrito_string)
    {
        carrito = JSON.parse(carrito_string);
        let counterElement = document.getElementsByClassName("cart-counter");
        if(counterElement && counterElement.length > 0)
        {
            let counter =  0;
            carrito.productos.forEach(function(value){
                    counter += (value.cantidad)
            });
            counterElement[0].innerText = counter;
        }
   }
else 
{
   carrito = 
    {
        total : 0,
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
    actualizarTotal(carrito);
    parent.find(".product-quantity").text(productoExistente.cantidad) ;
    parent.find(".product-total").text(productoExistente.cantidad  * parseFloat(productoExistente.precio.replace("$","")));

    if(productoExistente.cantidad ==0)
    {
        parent.fadeOut("slow"); 
    }
    else 
    {
        $(ev).effect( "highlight", {color: '#EEDDBB'}, 3000 );

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
            case "item-type":
                producto.tipo = sib[i].innerText;
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

    $(ev).effect( "highlight", {color: '#AA4433'}, 3000 );

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

}

function actualizarTotal(carrito){
    let total = 0;
    for(let i=0;i<carrito.productos.length; i++){
         let producto = carrito.productos[i];
         total += (producto.cantidad *  parseFloat(producto.precio.replace("$","")));
    }
    
    document.getElementsByClassName("cart-footer-subtotal-total")[0].innerText = total;
    if(carrito.promos.length > 0) {
        $(".cart-footer-promo").removeClass("d-none");

        let sumaPromo=0;
        for(let i=0;i<carrito.promos.length; i++){
            let promo = carrito.promos[i];
            let valorPromo = 0;
            if(promo.tipo == "PORCENTAJE") {
                valorPromo = total * promo.descuento / 100;
            }
            else if (promo.tipo == "MONTO") {
                valorPromo =  promo.descuento;
            }

            total = total - valorPromo;
            sumaPromo += valorPromo;
        }

        document.getElementsByClassName("cart-footer-promo-total")[0].innerText = sumaPromo;
        
    }
    else {
        $(".cart-footer-promo").addClass("d-none");

    }

    

    document.getElementsByClassName("cart-footer-total")[0].innerText = total;
    carrito.total = total;
}

function calcularPromos(carrito) {

    let cantidad = 0;
    carrito.productos.filter(prod=> prod.tipo == "ROLLO").forEach(function(elem){
        cantidad += elem.cantidad;
    });

    if(cantidad > 4)
    {
        let promo = carrito.promos.find(promo=> promo.codigo  == "20OFFROLLO");
        if(!promo)
        {
            let promo = {
                descripcion : "PROMO 20% OFF CON 4 O MAS ROLLOS",
                descuento : 20,
                codigo : "20OFFROLLO",
                tipo: "PORCENTAJE"
            }
            carrito.promos.push(promo);
        }
    }
    else 
    {
        let promo = carrito.promos.find(promo=> promo.codigo  == "20OFFROLLO");
        carrito.promos.splice(promo, 1);
    }

    
}

function mostrarCarrito(){
  let template =  document.getElementsByClassName("product-row d-none")[0];

   for(let i=0;i<carrito.productos.length; i++){
        let clone = template.cloneNode(true);
        let producto = carrito.productos[i];

        clone.className = clone.className.replace("d-none","product-row-active");

        clone.getElementsByClassName("product-code")[0].innerText = producto.codigo;
        clone.getElementsByClassName("product-type")[0].innerText = producto.tipo;
        clone.getElementsByClassName("product-img")[0].src = producto.imagen;
        clone.getElementsByClassName("product-description")[0].innerText = producto.descripcion;
        clone.getElementsByClassName("product-price")[0].innerText = producto.precio;
        clone.getElementsByClassName("product-quantity")[0].innerText = producto.cantidad;
        clone.getElementsByClassName("product-total")[0].innerText = producto.cantidad  * parseFloat(producto.precio.replace("$",""));
        insertAfter(template.parentNode.firstElementChild, clone);

   }

   calcularPromos(carrito);
   actualizarTotal(carrito);

  
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
        url: "https://raw.githubusercontent.com/daloestudio/daloestudioweb/master/data/rollosColor.json", //un archivo json con datos de usuarios: nombre, apellido, etc
        dataType: "json",
        success: function(response) {
          let template =  document.getElementsByClassName("store-item-row d-none color-film")[0];
          insertarProductosTienda(template, response.productos)
        }
    });

    $.ajax({
        url: "https://raw.githubusercontent.com/daloestudio/daloestudioweb/master/data/rollosBN.json", //un archivo json con datos de usuarios: nombre, apellido, etc
        dataType: "json",
        success: function(response) {
          let template =  document.getElementsByClassName("store-item-row d-none bw-film")[0];
          insertarProductosTienda(template, response.productos)
        }
    });
      
}

function insertarProductosTienda(template, productos){
    let clone = null;

    let j = 0;
    for(let i = 0 ; i<productos.length; i++){

    if(i % 4 == 0)
    {
        if(clone != null)
        {
            insertAfter(template.parentNode.firstElementChild, clone);
            
        }
        clone = template.cloneNode(true);
        clone.className = clone.className.replace("d-none","");
    }
    
        //falta buscar la forma de acomodar en el sitema de grillas
    let producto = productos[i];
    var itemColumns =clone.getElementsByClassName("store-item");
    var column = itemColumns[ i % 4 ];



    column.getElementsByClassName("item-code")[0].innerText = producto.codigo;
    column.getElementsByClassName("item-type")[0].innerText = producto.tipo;
    column.getElementsByClassName("item-img")[0].src = producto.imagen;
    column.getElementsByClassName("item-img")[0].alt = producto.descripcion;
    column.getElementsByClassName("item-description")[0].innerText = producto.descripcion;
    column.getElementsByClassName("item-price")[0].innerText = producto.precio;
    insertAfter(clone.firstElementChild, column);

    }

    if(clone != null)
    {
        insertAfter(template.parentNode.firstElementChild, clone);
    }
}

function volverATienda(){
    window.history.go(-1); 
    return false;
}