document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productList = document.getElementById("product-list");
    const totalProducts = document.getElementById("total-products");
    const val_t_prodcut = document.getElementById("val_t_prodcut");  // Total producto sin envío
    const envioEl = document.getElementById("Envio");               // Costo de envío
    const totalPrice = document.getElementById("total-price");
    const shippingCost = 5000; // Valor fijo de envío ($5.000)

    function updateCartDisplay() {
        productList.innerHTML = "";
        let total = 0;
        let quantity = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("product");
            itemElement.dataset.name = item.name;
            itemElement.dataset.price = item.price;

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <p>Precio Unitario: $${item.price.toLocaleString()}</p>
                <div class="controls">
                    <button class="decrease" data-index="${index}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase" data-index="${index}">+</button>
                </div>
                <button class="remove" data-index="${index}">Eliminar</button>
            `;
            productList.appendChild(itemElement);

            total += item.price * item.quantity;
            quantity += item.quantity;
        });

        totalProducts.textContent = quantity;
        val_t_prodcut.textContent = `$${total.toLocaleString()}`;
        envioEl.textContent = `$${shippingCost.toLocaleString()}`;
        totalPrice.textContent = `$${(total + shippingCost).toLocaleString()}`;
    }

    // Funcionalidad para agregar productos desde menus.html (sin cambios)
    document.querySelectorAll(".menu-item .controls button").forEach(button => {
        button.addEventListener("click", (e) => {
            const menuItem = e.target.closest(".menu-item");
            const productName = menuItem.querySelector("h3").innerText;
            const productPrice = parseFloat(menuItem.querySelector(".price").innerText.replace("$", ""));
            const productImage = menuItem.querySelector("img").src;
            const quantityInput = menuItem.querySelector("input");
            let quantity = parseInt(quantityInput.value);

            if (e.target.innerText === "+") {
                quantity++;
            } else if (e.target.innerText === "-" && quantity > 0) {
                quantity--;
            }
            quantityInput.value = quantity;

            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity = quantity;
            } else if (quantity > 0) {
                cart.push({ name: productName, price: productPrice, quantity: quantity, image: productImage });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        });
    });

    if (window.location.pathname.includes("carrito.html")) {
        updateCartDisplay();

        productList.addEventListener("click", (e) => {
            if (e.target.classList.contains("increase")) {
                const index = e.target.dataset.index;
                cart[index].quantity++;
            } else if (e.target.classList.contains("decrease")) {
                const index = e.target.dataset.index;
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
            } else if (e.target.classList.contains("remove")) {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        });

        document.querySelector(".limpiar_ca").addEventListener("click", () => {
            localStorage.removeItem("cart");
            cart.length = 0;
            updateCartDisplay();
        });

        // Evento para finalizar la compra
        document.querySelector(".checkout").addEventListener("click", () => {
            // Capturamos los valores finales antes de limpiar el carrito
            const finalProducts = totalProducts.textContent;
            const finalTotalProduct = val_t_prodcut.textContent;
            const finalEnvio = envioEl.textContent;
            const finalTotalPrice = totalPrice.textContent;

            // Mensaje de confirmación
            alert("Su compra ha sido finalizada, en un momento nuestro repartidor llevará su pedido.");

            // Limpiamos el carrito
            localStorage.removeItem("cart");
            cart.length = 0;
            updateCartDisplay();

            // Creamos y mostramos un resumen final en la sección de resumen, debajo de la información del cliente
            const cartSummary = document.querySelector(".cart-summary");
            const finalSummary = document.createElement("div");
            finalSummary.classList.add("final-summary");
            finalSummary.innerHTML = `
                <h2>Resumen Final de Compra</h2>
                <p>Productos: ${finalProducts}</p>
                <p>Total producto: ${finalTotalProduct}</p>
                <p>Envio: ${finalEnvio}</p>
                <p>Total neto: ${finalTotalPrice}</p>
            `;
            cartSummary.appendChild(finalSummary);
        });
    }
});

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}
