import supabase from "./config.js";

// ================================================================   SignUp Page Functionality   ================================================================

    //  ---------------   A: Get Input IDs   ---------------


let sUName = document.getElementById("name");
let sEmail = document.getElementById("email");
let sPass = document.getElementById("password");
let sPhn = document.getElementById("ph-no.");
let sBtn = document.querySelector(".btn-signup");

// console.log(sUName);
// console.log(sEmail);
// console.log(sPass);
// console.log(sPhn);
// console.log(sBtn);


//  ---------------   B: Password toggle button   ---------------

const togglePass = document.querySelector(".toggle-password");
// console.log(togglePass);


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


    //  ---------------   C: Form functionality   ---------------

async function signUp(e) {
    e.preventDefault();
    console.log("Function Work Best!");

    if (!sUName.value.trim() || !sEmail.value.trim() || !sPass.value.trim() || !sPhn.value.trim()) {
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
        });
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

    if (sPass.length < "6") {
        Swal.fire({
            title: "Incorrect Phone Number!",
            text: "Password must be at least 6 characters.",
            icon: "warning",
            background: "#f9fbfc",
            color: "#4f46e5",
            confirmButtonColor: "#4f46e5",
            confirmButtonText: "Try Again",
            customClass: {
                popup: "glass-alert"
            }

        }).then(() => {
            sPass.value = "";
        })
        return;
    }

    if (!sEmail.value.includes("@") || !sEmail.value.includes("gmail.com")) {
        Swal.fire({
            title: "Please enter a valid Gmail address.",
            text: "Example: yourname@gmail.com",
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
        }).then(() => {
            lEmail.value = "";
            lPass.value = "";
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
        // console.log(data);

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

            }).then(

   //  ---------------   D: Inserting Data in table   ---------------

                async () => {
                    const { error } = await supabase
                        .from("FullStack-Users")
                        .insert({
                            username: sUName.value,
                            email: sEmail.value,
                            phone: sPhn.value,
                            role: "user"
                        })
                    window.location.href = "../home.html"
                })

            if (error) {
                console.log(`supabase error ${error}`)
            } else {
                console.log("data insert successfully!!")
            }
        }



    } catch (error) {


    //  ---------------   E: System Error Swal   ---------------

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