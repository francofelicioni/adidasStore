productsHTML(products);

// Abrir Carrito
cartIcon.onclick = () => {
    cart.classList.add('active');
};
// Cerrar carrito
closeCart.onclick = () => {
    cart.classList.remove('active');
}

// Cart Render 
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}