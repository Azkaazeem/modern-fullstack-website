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
      color: "#003b46",
      confirmButtonColor: "#003b46",
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
      color: "#003b46",
      confirmButtonColor: "#003b46",
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
        color: "#003b46",
        confirmButtonColor: "#003b46",
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
        color: "#003b46",
        confirmButtonColor: "#003b46",
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
        console.log(`supabase Erorr ${error}`)
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
      color: "#003b46",
      confirmButtonColor: "#003b46",
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























// ================================================================   DashBoard Page Functionality   ================================================================

const addColorBtn = document.getElementById("addColorBtn");
const colorContainer = document.getElementById("colorContainer");

addColorBtn.addEventListener("click", () => {
    console.log("Button Clicked!");

    const newColorInput = document.createElement("input");

    newColorInput.type = "color";
    newColorInput.className = "color-input-field";
    newColorInput.value = "#000000ff";

    colorContainer.insertBefore(newColorInput, addColorBtn);
});