import supabase from "../JavaScript Files/config.js";

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
                    <button class="btn add-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                    <button class="btn wishlist-btn"><i class="fa-regular fa-heart"></i> Wishlist</button>
                </div>

                <div class="trust-badges" style="color: black; font-weight: bold; text-align: center;">
                    BUY NOW
                </div>
            </div>
        `
    }

  } catch (error) {
console.error("Render Error:", error.message);
        productCard.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", ProductRender);
