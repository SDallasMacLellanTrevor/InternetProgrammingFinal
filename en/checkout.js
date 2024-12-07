document.addEventListener("DOMContentLoaded", () => {
    let totalPrice = 0;
    let cart = [];
    fetchMenuItems(cart, totalPrice);    
});

function fetchMenuItems(cart, totalPrice) {
    const menuContainer = document.querySelector(".checkout-container");

    fetch('../menu.json')
        .then(response => response.json())
        .then(menuItems => {
            displayMenuItems(menuItems, menuContainer, cart, totalPrice);
        });
}

function displayMenuItems(menuItems, container, cart, totalPrice) {
    container.innerHTML = ""; 

    menuItems.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.classList.add("menu-item");

        itemCard.innerHTML = `
            <div class="menu-item-card">
                <img src="${item.image}" class="menu-item-image">
                <div class="menu-item-info">
                    <h3 class="menu-item-name">${item.name.en}</h3>
                    <p class="menu-item-description">${item.description.en}</p>
                    <p class="menu-item-price">Price: $${item.price.toFixed(2)}</p>
                    <div class="item-controls">
                        <button class="add-item">+</button>
                        <button class="remove-item">-</button>
                    </div>
                </div>
            </div>
        `;

        const addItemButton = itemCard.querySelector(".add-item");
        const removeItemButton = itemCard.querySelector(".remove-item");
        
        addItemButton.addEventListener("click", function() {
            cart.push(item);
            totalPrice += item.price;
            updateTotalPrice(totalPrice);
        });

        removeItemButton.addEventListener("click", function() {
            const index = cart.indexOf(item);
            if (index > -1) {
                cart.splice(index, 1);
                totalPrice -= item.price;
                updateTotalPrice(totalPrice);
            }
        });

        container.appendChild(itemCard);
    });

    const checkoutSection = document.createElement("div");
    checkoutSection.classList.add("checkout-section");
    
    checkoutSection.innerHTML = `
        <p class="total-price">Total: $0.00</p>
        <button class="checkout-button">Checkout</button>
    `;

    container.appendChild(checkoutSection);
}

function updateTotalPrice(totalPrice) {
    document.querySelector(".total-price").textContent = `Total: $${totalPrice.toFixed(2)}`;
}
