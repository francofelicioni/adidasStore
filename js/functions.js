// DYNAMIC PRODUCTS
function productsHTML(products) {
  productsRender.innerHTML = "";

  let i = 1; //For the alt of each product
  for (const product of products) {
    let divProduct = document.createElement("div");

    let div = document.createElement("div");
    div.className = "product-box";

    let img = document.createElement("img");
    img.src = product.img;
    img.alt = `Product nº ${i++}`;
    img.className = "product-img";
    div.appendChild(img);

    let h2 = document.createElement("h2");
    h2.className = "product-title";
    h2.innerHTML = product.desc;
    div.appendChild(h2);

    let span = document.createElement("span");
    span.className = "price";
    (span.innerHTML = `€ ${product.price}`), div.appendChild(span);

    let iElement = document.createElement("i");
    iElement.className = "bx bx-shopping-bag add-cart";
    iElement.productId = product.id; // Create an attribute called productId that is equal to the product ID
    div.appendChild(iElement);

    divProduct.appendChild(div);
    productsRender.append(divProduct);
  }
}

// Function that makes everything works
function ready() {
  let recuperoInfo = JSON.parse(localStorage.getItem("totalCart"));
  if (recuperoInfo != null && recuperoInfo != undefined) {
    cartArray = recuperoInfo.carrito;
    regenerarCarrito();
  }

  //DYNAMIC PRODUCTS
  // Add to cart
  let addCart = document.getElementsByClassName("add-cart");
  for (let i = 0; i < addCart.length; i++) {
    let button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }

  //CART
  // Quantity change
  let quantityInputs = document.getElementsByClassName("cart-quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.min = 1;
    input.addEventListener("change", quantityChanged);
  }
  // Remove items from cart
  let removeCartButtons = document.getElementsByClassName("cart-remove");
  for (let i = 0; i < removeCartButtons.length; i++) {
    let button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  //Buy button functionality
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}

// Cart
// Change quantity in products
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  } // REVISAR!
  let quantity = parseInt(input.value);
  input.quantity = quantity;
  let id = input.productId;
  for (const product of cartArray) {
    if (product.id == id) {
      product.quantity = quantity; //Product is updated and cartArray with it.
      break;
    }
  }
  updateTotal();
}
// Update total
function updateTotal() {
  let total = 0;
  for (const product of cartArray) {
    total += product.quantity * product.price;
  }

  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("total-price")[0].innerText = `€ ${total}`;
  localStorage.setItem(
    "totalCart",
    JSON.stringify({ carrito: cartArray, tot: total })
  );

  deleteAllBehaviour();
}

// Functionality of cart button on each HTML product
function addCartClicked() {
  // alert(this.productId);
  let product = getProduct(this.productId);
  if (product != null) {
    let productCart = new cartItem(
      product.id,
      product.desc,
      product.price,
      product.img,
      1
    );
    if (isAdded(productCart.id)) {
      statusAlert(
        "You already added this product!",
        "Modify the quantities from the cart.",
        "info"
      );
      return;
    }
    cartArray.push(productCart);
    addProductToCart(productCart);
    updateTotal();
  }
}

// Function to add products to cart
function addProductToCart(productAdded) {
  let cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  let cartItems = document.getElementsByClassName("cart-content")[0];

  statusAlert("Added!", "The product is in the cart.", "success");

  crearElementoCarrito(
    cartShopBox,
    productAdded.id,
    productAdded.desc,
    productAdded.img,
    productAdded.price,
    1
  ); //1 = Quantity.

  cartItems.appendChild(cartShopBox);

  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
}

// Show products in HTML Cart
function crearElementoCarrito(cartShopBox, id, desc, img, price, quantity) {
  let image = document.createElement("img");
  image.src = img;
  image.alt = `Cart product nº ${id}`;
  image.className = "cart-img";
  cartShopBox.appendChild(image);

  let detailBox = document.createElement("div");
  detailBox.className = "detail-box";

  let divTitle = document.createElement("div");
  divTitle.className = "cart-product-title";
  divTitle.innerHTML = desc;
  divTitle.productId = id;
  detailBox.appendChild(divTitle);

  let divPrice = document.createElement("div");
  divPrice.className = "cart-price";
  divPrice.innerHTML = `€${price}`;
  detailBox.appendChild(divPrice);

  let input = document.createElement("input");
  input.type = "number";
  input.value = quantity;
  input.productId = id;
  input.quantity = quantity;
  input.className = "cart-quantity";
  detailBox.appendChild(input);

  cartShopBox.append(detailBox);

  let i = document.createElement("i");
  i.className = "bx bxs-trash-alt cart-remove";
  i.productId = id;
  i.parent = cartShopBox;
  cartShopBox.appendChild(i);
}
// Get data from localStorage to generate the HTML Cart
function regenerarCarrito() {
  let cartItems = document.getElementsByClassName("cart-content")[0];

  for (const product of cartArray) {
    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    crearElementoCarrito(
      cartShopBox,
      product.id,
      product.desc,
      product.img,
      product.price,
      product.quantity
    );

    cartItems.appendChild(cartShopBox);

    cartShopBox
      .getElementsByClassName("cart-remove")[0]
      .addEventListener("click", removeCartItem);

    cartShopBox
      .getElementsByClassName("cart-quantity")[0]
      .addEventListener("change", quantityChanged);
  }
  updateTotal();
}
// Remove products from HTML cart
function removeCartItem(event) {
  let buttonClicked = event.target;
  let productId = buttonClicked.productId;
  let parent = buttonClicked.parent;
  let cartItems = document.getElementsByClassName("cart-content")[0];

  for (let i = 0; i < cartArray.length; i++) {
    if (cartArray[i].id == productId) {
      cartArray.splice(i, 1);
      break;
    }
  }

  //buttonClicked.parentElement.remove();
  cartItems.removeChild(parent);

  updateTotal();
}
//Empty products info (localStorage & array)
function emptyCart() {
  localStorage.removeItem("totalCart");
  cartArray.splice(0, cartArray.length);
}

//Delete all button functionality
let emptyBtn = document.querySelector(".deleteAllBtn");
emptyBtn.addEventListener("click", emptyProducts);

//Delete All Button Behavior

function deleteAllBehaviour() {
  let deleteAllBtn = document.querySelector(".deleteAllBtn");
  let cartBoxElements = document.querySelectorAll(".cart-box");

  if (cartBoxElements.length === 0) {
    deleteAllBtn.style.display = "none";
    emptyCartHTML();
  } else {
    deleteAllBtn.style.display = "block";
  }
}


//Empty HTML Products
function emptyProducts() {
  emptyCartHTML();
  emptyCart();
  updateTotal();
}

//Empty HTML Cart
function emptyCartHTML() {
  let cartItems = document.querySelectorAll(".cart-box");
  let shippingLabel = document.querySelector(".shippingLabel");
  let provFiltro = document.querySelector("#provFiltro");
  let provMunicipio = document.querySelector("#provMunicipio");

  for (let i = 0; i < cartItems.length; i++) {
    cartItems[i].remove();
  }

  if (shippingLabel) {
    shippingLabel.remove();
    provFiltro.remove();
    provMunicipio.remove();
  }
}

// Functionality of buy button
function buyButtonClicked() {
  if (endCart()) {
    return;
  }

  if (cartArray.length === 0) {
    statusAlert("¡Error!", "Your cart is empty.", "error");
  } else {
    addShippingInfo();
    getStates(urlProvincias).then(function (resultAPI) {
      let statesArray = resultAPI.provincias;
      if (statesArray !== null) {
        //I save the statesArray in a new array to sort by state.
        let newArray = [];
        statesArray.forEach((state) => {
          newArray.push({ Id: state.id, Name: state.nombre });
        });

        //I sort the array ascending by name.
        newArray.sort((a, b) => {
          if (a.Name < b.Name) {
            return -1;
          } else if (a.Name > b.Name) {
            return 1;
          } else {
            return 0;
          }
        });

        //I get a reference to pruebaSelect
        let selectState = document.getElementById("provFiltro");
        //Loop through all provinces of newArray
        //The first element will be id = -1 with the text "Select an state ..."
        let option = document.createElement("option");
        option.value = "-1";
        option.innerHTML = "Select an state...";
        selectState.appendChild(option);
        newArray.forEach((state) => {
          let option = document.createElement("option");
          option.value = state.Id;
          option.innerHTML = state.Name;
          selectState.appendChild(option);
        });
      }
    });
  }
}

// Function that adds shipping information when Buy button is clicked.
function addShippingInfo() {
  let cartItems = document.getElementsByClassName("cart-content")[0];
  let label = document.createElement("label");
  label.innerHTML = "Shipping information:";
  label.classList.add("shippingLabel");
  cartItems.appendChild(label);

  let selectStates = document.createElement("select");
  selectStates.setAttribute("id", "provFiltro");

  selectStates.onchange = function () {
    //The municipalities array is emptied before adding the new state information
    vaciarMunicipios();

    let selectLoc = document.getElementById("provMunicipio");

    let idState = selectStates.options[selectStates.selectedIndex].value;
    //If the IdState is "-1", the title is selected, so it forced to exit
    if (idState == "-1") {
      return;
    }

    let firstOption = selectLoc.firstChild;
    while (firstOption !== null) {
      selectLoc.removeChild(firstOption);
      firstOption = selectLoc.firstChild;
    }

    let urlListaMunicipios = urlMunicipios.replace("######", idState);

    getMunicipios(urlListaMunicipios).then(function (resultAPI) {
      let municipiosArray = resultAPI.municipios;
      if (municipiosArray != null) {
        //I save municipiosArray in a new array to order by municipality
        let newArray = [];
        municipiosArray.forEach((municipio) => {
          newArray.push({ Id: municipio.id, Name: municipio.nombre });
        });

        //The array is sorted in ascending order by name.
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
        newArray.forEach((municipio) => {
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

  cartItems.appendChild(selectStates);
  cartItems.appendChild(selectLoc);
}
//Validation if the purchase is finished or not
function endCart() {
  let selectStateValidation = document.getElementById("provFiltro");
  let selectMuniValidation = document.getElementById("provMunicipio");

  if (!selectStateValidation || !selectMuniValidation) {
    return;
  }

  if (selectStateValidation.value !== "-1") {
    setTimeout(() => {
      statusAlert(`Order #12587!`, "Purchase order sent.", "success");
      let cartContent = document.getElementsByClassName("cart-content")[0];
      while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
      }

      updateTotal();
      emptyCart();
      document.getElementsByClassName("total-price")[0].innerText = "€" + "0";
    }, 1250);
  } else {
    statusAlert(
      `Missing information!`,
      "Complete the shipping information to continue.",
      "error"
    );
  }
  return true;
}
//Fin Carrito

//API GEOREF
//Get states
async function getStates(url) {
  let newPromise = await fetch(url);
  let resultAPI = await newPromise.json();
  return resultAPI;
}

function prepareStates(url) {
  getStates(url).then(function (resultAPI) {
    let statesArray = resultAPI.provincias;
    if (statesArray != null) {
      let selectState = document.getElementById("provFiltro");
      //Go through all the provinces of the results.
      statesArray.forEach((state) => {
        let option = document.createElement("option");
        option.value = state.id;
        option.innerHTML = state.nombre;
        selectState.appendChild(option);
      });
    }
  });
}

//MUNICIPALITIES
//Get municipalities
async function getMunicipios(url) {
  let newPromise = await fetch(url);
  let resultAPI = await newPromise.json();
  return resultAPI;
}
//Empty municipalities information
function vaciarMunicipios() {
  let selectMunicipio = document.getElementById("provMunicipio");
  let firstOption = selectMunicipio.firstChild;
  while (firstOption != null) {
    selectMunicipio.removeChild(firstOption);
    firstOption = selectMunicipio.firstChild;
  }
}

//GENERAL FUNCTIONS
//Validate Product ID
function getProduct(productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i];
    }
  }
  return null; //Not found
}

//Validate if a product is already added to cart
function isAdded(id) {
  for (const product of cartArray) {
    if (product.id == id) return true;
  }
  return false;
}

//Swal general function
function statusAlert(title, text, type) {
  swal(title, text, type);
}
