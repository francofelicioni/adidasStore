// PRODUCTOS DE FORMA DINAMICA
function productsHTML(products) {
    productsRender.innerHTML = "";

    let i = 0; //Para el texto alterno de cada imágen.
    for (const product of products) {
        let divProduct = document.createElement('div');

        //Propuesta para guardar el id del producto en cada elemento que contenga producto.
        let div = document.createElement("div");
        div.className = "product-box";
        divProduct.appendChild(div);

        let img = document.createElement("img");
        img.src = product.img;
        img.alt = "Product " + ++i;
        img.className = "product-img";
        div.appendChild(img);

        let h2 = document.createElement("h2");
        h2.className = "product-title";
        h2.innerHTML = `${product.desc}`;
        div.appendChild(h2);

        let span = document.createElement("span");
        span.className = "price";
        span.innerHTML = `€${product.price}`,
            div.appendChild(span);

        let iElement = document.createElement("i");
        iElement.className = "bx bx-shopping-bag add-cart";
        iElement.productId = product.id; //Crea en el elemento i un atributo de nombre ProductId y le asigna el valor del id del producto.
        div.appendChild(iElement);

        productsRender.append(divProduct);
    }
}


// FUNCION QUE HACE QUE TODO FUNCIONE 
function ready() {
    let recuperoInfo = JSON.parse(localStorage.getItem('totalCart'));
    if (recuperoInfo != null && recuperoInfo != undefined) {
        cartArray = recuperoInfo.carrito;
        regenerarCarrito();
    }

    // Remover items del carrito
    let removeCartButtons = document.getElementsByClassName('cart-remove')
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    // Cambio de cantidades
    let quantityInputs = document.getElementsByClassName('cart-quantity');
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // Agregar al carrito
    let addCart = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    //Funcionamiento del boton comprar
    document
        .getElementsByClassName('btn-buy')[0]
        .addEventListener('click', buyButtonClicked);
}

//Carrito de compras
// Cambio de cantidades en productos
function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    let quantity = parseInt(input.value);
    input.quantity = quantity;
    let id = input.productId;
    for (const product of cartArray) {
        if (product.id == id) {
            product.quantity = quantity; //Se actualiza product y con él cartArray.
            break;
        }
    }
    updateTotal();
}
// Actualizar total
function updateTotal() {
    let total = 0;
    for (const product of cartArray) {
        total += product.quantity * product.price;
    }

    total = Math.round(total * 100) / 100;

    document.getElementsByClassName("total-price")[0].innerText = "€" + total;
    localStorage.setItem('totalCart', JSON.stringify({ carrito: cartArray, tot: total }));
}

//Funcionamiento del boton carrito en cada producto del HTML
function addCartClicked() {
    // alert(this.productId);
    let product = getProduct(this.productId);
    if (product != null) {
        let productCart = new cartItem(product.id, product.desc, product.price, product.img, 1);
        if (isAdded(productCart.id)) {

            statusAlert ("¡Ya lo tenés!","El producto ya se encuentra agregado a tu carrito.","info");
            return;
        }
        cartArray.push(productCart);
        addProductToCart(productCart);
        updateTotal();
    }
}

// Funcion para agregar productos al carrito
function addProductToCart(productAdded) {
    let cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    let cartItems = document.getElementsByClassName('cart-content')[0];

    statusAlert ("¡Producto agregado!","El producto fue agregado al carrito.","success");

    crearElementoCarrito(cartShopBox, productAdded.id, productAdded.desc, productAdded.img, productAdded.price, 1); //1 = Cantidad.

    cartItems.appendChild(cartShopBox);

    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged);
}

//Mostrar productos al carrito HTML
function crearElementoCarrito(cartShopBox, id, desc, img, price, quantity) {
    let image = document.createElement("img");
    image.src = img;
    image.alt = "Producto del carrito";
    image.className = "cart-img"
    cartShopBox.appendChild(image);

    let div = document.createElement("div");
    div.className = "detail-box";

    let div1 = document.createElement("div");
    div1.className = "cart-product-title";
    div1.innerHTML = desc;
    div1.productId = id;
    div.appendChild(div1);

    let div2 = document.createElement("div");
    div2.className = "cart-price";
    div2.innerHTML = `€${price}`;
    div.appendChild(div2);

    let input = document.createElement("input");
    input.type = "number";
    input.value = quantity;
    input.productId = id;
    input.quantity = quantity;
    input.className = "cart-quantity";
    div.appendChild(input);

    cartShopBox.append(div);

    let i = document.createElement("i");
    i.className = "bx bxs-trash-alt cart-remove";
    i.productId = id;
    i.padre = cartShopBox;
    cartShopBox.appendChild(i);
}

//Obtener datos del LocalStorage para generar el carrito HTML
function regenerarCarrito() {
    let cartItems = document.getElementsByClassName('cart-content')[0];

    for (const product of cartArray) {
        let cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');

        crearElementoCarrito(cartShopBox, product.id, product.desc, product.img, product.price, product.quantity);

        cartItems.appendChild(cartShopBox);

        cartShopBox
            .getElementsByClassName('cart-remove')[0]
            .addEventListener('click', removeCartItem);
        cartShopBox
            .getElementsByClassName('cart-quantity')[0]
            .addEventListener('change', quantityChanged);
    }
    updateTotal();
}
// Sacar productos del carrito HTML
function removeCartItem(event) {
    let buttonClicked = event.target;
    let productId = buttonClicked.productId;
    let padre = buttonClicked.padre;
    let cartItems = document.getElementsByClassName('cart-content')[0];

    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].id == productId) {
            cartArray.splice(i, 1);
            break;
        }
    }

    //buttonClicked.parentElement.remove();
    cartItems.removeChild(padre);

    updateTotal();
}
//Vaciar info de productos (Local Storage y array)
function emptyCart() {
    localStorage.clear();
    cartArray.splice(0, cartArray.length);
}
//Vaciar carrito HTML
function emptyCartHTML() {
    let cartItems = document.getElementsByClassName('cart-content')[0];
    let primero = cartItems.firstChild();

    while (primero != null) {
        cartItems.removeChild(primero);
        primero = cartItems.firstChild();
    }
}
// Funcionamiento del Boton comprar
function buyButtonClicked() {
    if (endCart()) {
        return;
    }

    if (cartArray.length == 0) {

        statusAlert ("¡Error!","Tu carrito está vacío.","error");

    } else {
        
        addShippingInfo();
        getStates(urlProvincias).then(function(resultAPI) {
            let statesArray = resultAPI.provincias; //Ejecutar la url en firefox y ver el contenido del objeto provincias.
            if (statesArray !== null) {
                //Guardo stateArray en un nuevo array para ordenarlo por provincia.
                let newArray = [];
                statesArray.forEach(state => { //Pero en lugar de llenar el select, se podría llenar un array local, ordenarlo por nombre de provincia y presentarlo mejor.}
                    newArray.push({ Id: state.id, Name: state.nombre });
                });

                //Ordeno el array ascendente por nombre.
                newArray.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1;
                    } else if (a.Name > b.Name) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                //Obtengo una referencia al pruebaSelect
                let selectState = document.getElementById("provFiltro");
                //Recorro todas las provincias de newArray.
                //El primer elemento tendrá id = -1 y el texto "Selecciona una provincia ...".
                let option = document.createElement("option");
                option.value = "-1";
                option.innerHTML = "Selecciona una provincia ...";
                selectState.appendChild(option);
                newArray.forEach(state => { //Pero en lugar de llenar el select, se podría llenar un array local, ordenarlo por nombre de provincia y presentarlo mejor.
                    let option = document.createElement("option");
                    option.value = state.Id;
                    option.innerHTML = state.Name;
                    selectState.appendChild(option);
                });
            } 
        });
    }
}
//Funcion que agrega la info de provincias y municipios una vez que se clickea el boton "Comprar"
function addShippingInfo() {
    let cartItems = document.getElementsByClassName('cart-content')[0];
    let label = document.createElement('label');
    label.innerHTML = 'Informacion del envio';
    label.classList.add('shippingLabel');
    cartItems.appendChild(label);

    let selectStates = document.createElement('select');
    selectStates.setAttribute("id", "provFiltro");

    selectStates.onchange = function() {
        //Vaciamos la lista de municipios antes de agregar los d ela nueva provincia
        vaciarMunicipios();

        let selectLoc = document.getElementById("provMunicipio");
        let idState = selectStates.options[selectStates.selectedIndex].value;
        //Si el IdState vale "-1" es que se ha seleccionado el título ("Selecciona una provincia") por lo que salimos.
        if (idState == "-1") {
            return;
        }

        let firstOption = selectLoc.firstChild;
        while (firstOption != null) {
            selectLoc.removeChild(firstOption);
            firstOption = selectLoc.firstChild;
        }

        let urlListaMunicipios = urlMunicipios.replace("######", idState);

        getMunicipios(urlListaMunicipios).then(function(resultAPI) {
            let municipiosArray = resultAPI.municipios;
            if (municipiosArray != null) {
                //Guardo municipiosArray en un nuevo array para ordenarlo por municipio.
                let newArray = [];               municipiosArray.forEach(municipio => { 
                    newArray.push({ Id: municipio.id, Name: municipio.nombre });
                });

                //Ordenamos el array ascendente por nombre.
                newArray.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1;
                    } else if (a.Name > b.Name) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                let selectLoc = document.getElementById("provMunicipio");
                newArray.forEach(municipio => {
                    let option = document.createElement("option");
                    option.value = municipio.Id;
                    option.innerHTML = municipio.Name;
                    selectLoc.appendChild(option);
                });

                selectLoc.style.visibility = "visible";
            }
        });

    };

    let selectLoc = document.createElement("select");
    selectLoc.setAttribute("id", "provMunicipio");
    selectLoc.style.visibility = "hidden";
    // selectLoc.style.width = "200px";

    cartItems.appendChild(selectStates);
    cartItems.appendChild(selectLoc);

}
// Validacion si termina o no la compra
function endCart() {
    let selectStateValidation = document.getElementById("provFiltro");
    let selectMuniValidation = document.getElementById("provMunicipio");

    if (!selectStateValidation || !selectMuniValidation) {
        return;
    }
    // fetch('https://jsonplaceholder.typicode.com/posts', )

    statusAlert("¡Pedido #1250!","Orden de compra enviada.", "success");

    let cartContent = document.getElementsByClassName('cart-content')[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }

    updateTotal();
    emptyCart();
    document.getElementsByClassName("total-price")[0].innerText = "€" + "0";
    return true;
}
//Fin Carrito

//Funcionamiento API Georef
//Obteneción de provincias.
async function getStates(url) {
    let newPromise = await fetch(url);
    let resultAPI = await newPromise.json();
    return resultAPI;
}

function prepareStates(url) {
    getStates(url).then(function(resultAPI) {
        let statesArray = resultAPI.provincias; //Ejecutar la url en firefox y ver el contenido del objeto provincias.
        if (statesArray != null) {
            //Obtenemos una referencia al pruebaSelect creado en htmo "SOLO COMO PRUEBA".
            let selectState = document.getElementById("provFiltro");
            //Recorremos todas las provincias de los resultados.
            statesArray.forEach(state => { //Pero en lugar de llenar el select, se podría llenar un array local, ordenarlo por nombre de provincia y presentarlo mejor.
                let option = document.createElement("option");
                option.value = state.id;
                option.innerHTML = state.nombre;
                selectState.appendChild(option);
            });
        }
    });
}

//MUNICIPIOS
//OBTENER MUNICIPIOS
async function getMunicipios(url) {
    let newPromise = await fetch(url);
    let resultAPI = await newPromise.json();
    return resultAPI;
}
//VACIAR INFO MUNICIPIOS
function vaciarMunicipios() {
    let selectMunicipio = document.getElementById("provMunicipio");
    let firstOption = selectMunicipio.firstChild;
    while (firstOption != null) {
        selectMunicipio.removeChild(firstOption);
        firstOption = selectMunicipio.firstChild;
    }
}
//Fin API Georef

//Funciones Generales 
//Validar ID productos
function getProduct(productId) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            return products[i];
        }
    }
    return null; //No encontrado.
}
//Validar si un producto ya esta en el carrito
function isAdded(id) {
    for (const product of cartArray) {
        if (product.id == id)
            return true;
    }
    return false;
}

function statusAlert(title, text, type) {
    swal(
        title,
        text,
        type
    )
}
//Fin Funciones de funcionamiento