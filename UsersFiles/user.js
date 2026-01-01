import supabase from "../JavaScriptFiles/config.js";



// ================================================================   Navbar Functionality   ================================================================

let navbar = document.querySelector(".nav");

navbar.innerHTML = `
            <input type="checkbox" id="menu-toggle" hidden>

            <div class="nav-wrap">
                <label for="menu-toggle" class="hamburger">
                    <i class="fa-solid fa-bars-staggered"></i>
                </label>

                <div class="brand">Luxora</div>

                <div class="nav-links">
                    <div class="drawer-header">
                        <div class="user-avatar">
                            <i class="fa-solid fa-circle-user"></i>
                        </div>
                        <span>Welcome back,</span>

                        <label for="menu-toggle" class="close-drawer">
                            <i class="fa-solid fa-xmark"></i>
                        </label>
                    </div>

                    <ul class="menu-list">
                        <li><a href="home.html"><i class="fa-solid fa-house"></i> Home</a></li>
                        <li><a href="products.html"><i class="fa-solid fa-bag-shopping"></i> Shop All</a></li>
                        <li><a href="#"><i class="fa-solid fa-bolt"></i> New Arrivals</a></li>
                        <li><a href="#"><i class="fa-solid fa-heart"></i> Wishlist</a></li>
                        <hr class="mobile-only">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact & Support</a></li>
                    </ul>
                </div>
                <div class="user-action">
                    <button class="cart-trigger" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span class="cart-count">0</span>
                    </button>

                    <button id="LogoutBtn" title="Logout">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>

                    <div class="offcanvas offcanvas-end luxora-cart-drawer" tabindex="-1" id="cartDrawer"
            aria-labelledby="cartDrawerLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="cartDrawerLabel">Shopping Bag</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div id="cart-items-list">
                    <div class="empty-cart">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <p>Your bag is empty</p>
                    </div>
                </div>
            </div>
            <div class="offcanvas-footer">
                <div class="total-section">
                    <span>Subtotal</span>
                    <span id="cart-total">Rs: 0</span>
                </div>
                <button class="btn-checkout">Proceed to Checkout</button>
            </div>
        </div>

        <div class="offcanvas offcanvas-end luxora-cart-drawer" tabindex="-1" id="cartDrawer">
            <div class="offcanvas-header border-bottom">
                <h5 class="offcanvas-title">Shopping Bag</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <div id="cart-items-list">
                    <p class="empty-cart-msg">Your bag is empty</p>
                </div>
            </div>
        </div>


`































// ================================================================   Logout Button Functionality   ================================================================

// A: Logout Functionality

const LogoutBtn = document.getElementById("LogoutBtn");
console.log(LogoutBtn);

async function logout() {
    try {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            Swal.fire({
                title: "Successfully logged out!",
                icon: "success",
                background: "#f9fbfc",
                color: "rgb(132, 0, 255)",
                confirmButtonColor: "rgb(132, 0, 255)",
                confirmButtonText: "Go to Login page",
                padding: "20px",
            }).then(() => {
                location.href = "../login/login.html";
            });
        }
    } catch (err) {
        console.log(err)
    }
}
LogoutBtn && LogoutBtn.addEventListener("click", logout)



























// ================================================================   Product Detail Functionality   ================================================================

let searchParam = new URLSearchParams(window.location.search);
console.log(searchParam);

let productId = searchParam.get('id');
// console.log(productId);

let productCard = document.getElementById("productContainer");
// console.log(productCard);

async function ProductRender(e) {
    try {
        const { data, error } = await supabase
            .from("FullStack-Images")
            .select("*")
            .eq("id", productId)
            .single();
        console.log(data);

        if (data) {

            console.log(typeof data.product_colors);

            productCard.innerHTML = `

            <div class="detail-img-box">
                <img src="${data.image_url}" alt="Product"
                    id="main-img">
            </div>

            <div class="detail-info-box">
                <span class="p-tag tag-new">${data.Arrival}</span>
                <h1 class="prod-title">${data.product_title}</h1>
                <div class="price-row">
                    <span class="currency">Rs:</span>
                    <span class="amount">${data.product_price}</span>
                </div>

                <p class="prod-desc">${data.product_description}</p>

                <div class="options-section">
                    <h4>Available Colors</h4>
                    <div class="color-dots">
                    <!--  ${(data.product_colors ? data.product_colors.split(',') : []).map((color) => `
                        <span style="background: ${color.trim()};"></span>
                      `).join("")} -->
                </div>
                </div>

                <div class="detail-actions">
                    <button class="btn add-cart-btn" id="addToCartBtn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                    <button class="btn wishlist-btn"><i class="fa-regular fa-heart"></i> Wishlist</button>
                </div>

                <div class="trust-badges" style= "font-weight: bolder; font-size: 20px">
                    BUY NOW
            </div>
        `
            const cartBtn = document.getElementById("addToCartBtn");
            if (cartBtn) {
                cartBtn.addEventListener("click", () => {
                    addToCart(data);
                });
            }
        }

    } catch (error) {
        console.error("Render Error:", error.message);
        productCard.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", ProductRender);

































// ================================================================   Add to Cart Functionality   ================================================================

// 1. Har user ke liye alag key banane ka function
async function getCartKey() {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? `cart_${user.id}` : "cart_guest";
}

// 2. Badge (number) update karne ka function
function updateCartUI(count) {
    const badge = document.querySelector(".cart-count");
    if (badge) {
        badge.innerText = count;
    }
}

window.addToCart = async (product) => {
    const key = await getCartKey();
    let cart = JSON.parse(localStorage.getItem(key) || "[]");

    let exist = cart.find((item) => item.id === product.id);

    if (exist) {
        exist.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            product_title: product.product_title,
            product_price: product.product_price,
            image_url: product.image_url,
            quantity: 1
        });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    updateCartUI(cart.length);
    Swal.fire("Success", "Added to bag", "success");
    renderCart();
};

async function renderCart() {
    const key = await getCartKey();
    const cart = JSON.parse(localStorage.getItem(key) || "[]");
    const cartContainer = document.getElementById("cart-items-list");
    const totalDiv = document.getElementById("cart-total");

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your bag is empty</p>
            </div>`;
        if (totalDiv) totalDiv.innerText = "Rs: 0";
        return;
    }

    let total = 0;
    cartContainer.innerHTML = "";

    cart.forEach((product, index) => {
        total += product.product_price * product.quantity;

        // UPDATED HTML STRUCTURE FOR NEW STYLING
        cartContainer.innerHTML += `
            <div class="cart-item d-flex align-items-center gap-3">
                <img src="${product.image_url}" class="cart-item-img" alt="${product.product_title}">
                
                <div class="flex-grow-1">
                    <h6 class="cart-item-title">${product.product_title}</h6>
                    <span class="cart-item-price">Unit Price: Rs ${product.product_price}</span>
                    
                    <div class="quantity-pill">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="qty-number">${product.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="text-end">
                    <div class="cart-item-total">Rs: ${product.product_price * product.quantity}</div>
                </div>
            </div>
        `;
    });

    if (totalDiv) totalDiv.innerText = `Rs: ${total}`;
}

// Drawer khulne par render function chalayein
const cartBtnTrigger = document.querySelector('.cart-trigger');
if (cartBtnTrigger) {
    cartBtnTrigger.addEventListener('click', renderCart);
}

window.updateQty = async (index, operand) => {
    const key = await getCartKey();
    let cart = JSON.parse(localStorage.getItem(key) || "[]");

    // Quantity update karein
    cart[index].quantity += operand;

    // Agar quantity 0 ho jaye to delete kar dein
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem(key, JSON.stringify(cart));
    renderCart(); // UI refresh karein
    loadCartOnRefresh(); // Badge refresh karein
};

