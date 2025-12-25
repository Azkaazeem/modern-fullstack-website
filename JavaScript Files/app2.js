// import { createElement } from "react";
import supabase from "./config.js";


// ================================================================   SignUp Page Functionality   ================================================================

let sUName = document.getElementById("name");
let sEmail = document.getElementById("email");
let sPass = document.getElementById("password");
let sPhn = document.getElementById("ph-no.");
let sBtn = document.querySelector(".btn-signup");


//  A: Pasword toggle button

const togglePass = document.querySelector(".toggle-password")

togglePass && togglePass.addEventListener("click", () => {
  if (sPass.type === "password") {
    sPass.type = "text"
    togglePass.classList.remove("fa-eye-slash")
    togglePass.classList.add("fa-eye")
  } else {
    sPass.type = "password"
    togglePass.classList.remove("fa-eye")
    togglePass.classList.add("fa-eye-slash")
  }
})


// B: SignUp Page

async function signUp(e) {
  e.preventDefault();

  if (!sUName.value.trim() ||
    !sEmail.value.trim() ||
    !sPass.value.trim() ||
    !sPhn.value.trim()) {
    Swal.fire({
      title: "All fields required!",
      text: "Please fill all fields before signup.",
      icon: "warning",
      background: "#f9fbfc",
      color: "#4f46e5",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "OK",
      padding: "20px",
      borderRadius: "15px",
      customClass: {
        popup: "glass-alert"
      }
    })

    return
  };


  if (sPhn.value.length !== 11) {
    Swal.fire({
      title: "Incorrect Phone Number!",
      text: "Phone number must be exactly 11 digits.",
      icon: "warning",
      background: "#f9fbfc",
      color: "#4f46e5",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Try Again",
      customClass: {
        popup: "glass-alert"
      }

    }).then(() => {
      sPhn.value = "";
    })
    return;
  }


  try {



    const { data, error } = await supabase.auth.signUp(
      {
        email: sEmail.value,
        password: sPass.value,
        options: {
          data: {
            user_name: sUName.value,
            phone_no: sPhn.value,
          }
        }
      }
    )

    if (error) {
      console.log(error);
      Swal.fire({
        title: "Signup Failed!",
        text: error.message,
        icon: "error",
        draggable: true,
        background: "#f9fbfc",
        color: "#4f46e5",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "OK",
        padding: "20px",
        borderRadius: "15px",
        customClass: {
          popup: "glass-alert"
        }
      }).then(() => {
        sUName.value = "";
        sEmail.value = "";
        sPass.value = "";
        sPhn.value = "";

      })
      return;

    } else {
      Swal.fire({
        title: "Signup successfully!",
        text: "Welcome to Our Platform",
        icon: "success",
        draggable: true,
        background: "#f9fbfc",
        color: "#4f46e5",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Go to Home",
        padding: "20px",
        borderRadius: "15px",
        customClass: {
          popup: "glass-alert"
        }

      })
        .then(async () => {


          // C: Inserting Data in table

          const { error } = await supabase
            .from("users")
            .insert({
              username: sUName.value,
              email: sEmail.value,
              phone: sPhn.value,
            })
          location.href = "home.html"
        })
      if (error) {
        console.log(`supabase error ${error}`)
      } else {
        alert("data insert successfully!!")
      }


    }
  } catch (err) {
    console.log(err)
    Swal.fire({
      title: "System error!",
      html: `Something went wrong internally! <br></br> <b>${err.message || "Unknown error"}</b>`,
      icon: "error",
      background: "#f9fbfc",
      color: "#4f46e5",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Report issue",
      padding: "20px",
      borderRadius: "15px",
      customClass: {
        popup: "glass-alert"
      }
    }).then(() => {
      sUName.value = "";
      sEmail.value = "";
      sPass.value = "";
      sPhn.value = "";

    })
  }
}

sBtn && sBtn.addEventListener("click", signUp);

// -------------------------------------------------------------------------- Signup Page OAuth Functions --------------------------------------------------------------------------

// async function signUpWithGoogle() {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       redirectTo: window.location.origin + '/home.html',
//     },
//   });
//   if (error) console.error("Google Error:", error.message);
// }

// async function signUpWithGithub() {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: 'github',
//     options: {
//       redirectTo: window.location.origin + '/home.html',
//     },
//   });
//   if (error) console.error("Github Error:", error.message);
// }

// const googleBtn = document.querySelector(".btn-social.google");
// const githubBtn = document.querySelector(".btn-social.github");

// googleBtn && googleBtn.addEventListener("click", signUpWithGoogle);
// githubBtn && githubBtn.addEventListener("click", signUpWithGithub);





































// ================================================================   Logout Button Functionality   ================================================================

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
        location.href = "./login/login.html";
      });
    }
  } catch (err) {
    console.log(err)
  }
}
LogoutBtn && LogoutBtn.addEventListener("click", logout)

// LogoutBtn.className = "hover-effect"






































// ================================================================   DashBoard Page Functionality   ================================================================

// ----------------------------------------------   A: UPLOAD FILE   ----------------------------------------------

const fileInput = document.getElementById("prodImg");
const uploadBtn = document.getElementById("publishBtn");
const title = document.getElementById("prodTitle");
const Description = document.getElementById("prodDesc");

function displayName() {
  if (fileInput.click) {
    fileInput.style.visibility = "visible";
    fileInput.style.color = "gray";
    // console.log("Styling Update");

  }
}

fileInput && fileInput.addEventListener("click", displayName)

async function UploadFile() {
  const file = fileInput.files[0];
  const prodTitle = document.getElementById("prodTitle").value.trim();
  // console.log(prodTitle);

  const prodDesc = document.getElementById("prodDesc").value.trim();
  // console.log(prodDesc);

  const colorInputs = document.querySelectorAll(".color-input-field");
  const selectedColors = Array.from(colorInputs).map(input => input.value);
  // console.log(selectedColors);

  const selectedStatus = document.querySelector('input[name="prodStatus"]').value;
  // console.log(selectedStatus);


  if (!file || !prodTitle || !prodDesc || selectedColors.length === 0) {
    return Swal.fire({
      title: "Fields Required",
      text: "Please fill all fields: Image, Title, Description, at least one Color, and Product Status.",
      icon: "warning",
      confirmButtonColor: "#4f46e5"
    });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Swal.fire("Error", "Login required", "error");

  Swal.fire({
    title: 'Publishing...',
    didOpen: () => Swal.showLoading()
  });

  try {
    const fileName = `${Date.now()}_${file.name}`;
    // console.log(fileName);

    const { error: uploadErr } = await supabase.storage
      .from("FullStackImages")
      .upload(fileName, file);

    if (uploadErr) throw uploadErr;

    const { data: pubData } = supabase.storage.from("FullStackImages").getPublicUrl(fileName);

    const { error: dbErr } = await supabase.from("FullStack-Images").insert({
      image_url: pubData.publicUrl,
      image_name: file.name,
      product_title: prodTitle,
      product_description: prodDesc,
      product_colors: selectedColors,
      user_id: user.id,
      status: selectedStatus
    });

    if (dbErr) throw dbErr;

    Swal.fire("Success!", "Product Published!", "success");
    fileInput.value = "";
    title.value = "";
    Description.value = "";
    selectedColors.values = "";
    fetchFile();

  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}
// if (uploadBtn) {
//   uploadBtn.addEventListener("click", UploadFile);
// }






// ----------------------------------------------   B: PRODUCT COLOR   ----------------------------------------------

const addColorBtn = document.getElementById("addColorBtn");
const colorContainer = document.getElementById("colorContainer");

addColorBtn && addColorBtn.addEventListener("click", () => {

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "fa-solid fa-circle-xmark delete-color-icon";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.color = "#ff4d4d";

  deleteBtn.addEventListener("click", () => {
    wrapper.remove();
  });

  const wrapper = document.createElement("div");
  wrapper.className = "color-item-wrapper";

  const newColorInput = document.createElement("input");
  newColorInput.type = "color";
  newColorInput.className = "color-input-field";

  wrapper.appendChild(newColorInput);
  wrapper.appendChild(deleteBtn);

  colorContainer.insertBefore(wrapper, addColorBtn);
});







// ----------------------------------------------   C: FETCH FILE   ----------------------------------------------

async function fetchFile() {
  const cardContainer = document.getElementById('product-card-container');

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (!user || userErr) {
        console.log("User not logged in");
        return;                                                    
    }const { data: authData } = await supabase.auth.getUser();

if (!user) {
    return Swal.fire("Error", "Login required", "error");
}

  cardContainer.innerHTML = "";

  
  if (data && data.length > 0) {
    data.forEach(item => {
          cardContainer.className = "row g-3";
      cardContainer.innerHTML += `

<div class="col-6 col-md-4 col-lg-3 d-flex align-items-stretch"> 
    <div class="product-preview-card">
      <div class="p-visual">
        <div class="img-wrapper">
            <img src="${item.image_url}" alt="${item.image_name || 'Product Image'}">
        </div>
        
        <div class="p-admin-tools">
          <button class="edit-tool" onclick="startEdit(${item.id}, '${item.image_url}')"><i class="fas fa-edit"></i></button>
          <button class="del-tool" onclick="deleteImage(${item.id}, '${item.image_url}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      
      <div class="p-details">
        <span class="p-tag">NEW ARRIVAL</span>
        <h4>Silk Scarf Premium</h4>
        <p>This is how the text will display on your store.</p>
        <div class="p-swatches">
            <span style="background: #4f46e5;"></span>
            <span style="background: #10b981;"></span>
        </div>
        <div class="p-footer-status">Status: <b>Active</b></div>
      </div>
    </div>
      </div>`;
    });

  } else {
    cardContainer.innerHTML = "<p style='color:white; text-align:center; grid-column: 1/-1;'>Your cardContainer is empty. Upload your first image!</p>";
  }
}

if (uploadBtn) {
  uploadBtn.addEventListener("click", UploadFile);
}

window.onload = fetchFile;

