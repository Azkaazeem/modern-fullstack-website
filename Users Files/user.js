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

