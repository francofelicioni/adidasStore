productsHTML(products);

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add('active');
};
// Close cart
closeCart.onclick = () => {
    cart.classList.remove('active');
}

// Cart Render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}