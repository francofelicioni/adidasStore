// State API
const urlProvincias = "https://apis.datos.gob.ar/georef/api/provincias";
const urlMunicipios = "https://apis.datos.gob.ar/georef/api/municipios?provincia=######&campos=id,nombre&max=100";

// Display products
const products = [];
const productsRender = document.querySelector('.shop-content');

//Products selection
const addCart = document.querySelector('.add-cart');

// Cart
let cartArray = [];
let cart = document.querySelector('.cart');
let cartIcon = document.querySelector('#cart-icon');
let closeCart = document.querySelector('#close-cart');

class Product {
    constructor(id, desc, price, img) {
        this.id = id;
        this.desc = desc;
        this.price = price;
        this.img = img;
    }
}

class cartItem {
    constructor(id, desc, price, img, quantity) {
        this.id = id;
        this.desc = desc;
        this.price = price;
        this.img = img;
        this.quantity = quantity;
        this.total = quantity * price;
    }

    updateTotal() {
        total = quantity * price;
    }

    get Total() {
        return this.total;
    }

    get Desc() {
        return this.desc;
    }

    set Desc(newDesc) {
        this.desc = newDesc;
    }
}