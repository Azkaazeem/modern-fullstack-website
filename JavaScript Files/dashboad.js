import supabase from "./config.js";


// ================================================================   Logout Button Functionality   ================================================================

// A: Logout Functionality

const LogoutBtn = document.getElementById("LogoutBtn");
// console.log(LogoutBtn);

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

// B: Is User Authenticated Or not?

async function protectDashboard() {
  // 1. Check karein session hai ya nahi
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Session missing, redirecting...");
    window.location.href = "./login/login.html";
    return;
  }

  // 2. Query karein (Small letters aur email filter ke saath)
  const { data: userData, error: dbError } = await supabase
    .from('FullStack-Users')
    .select('role, email') // Casing check: 'role' not 'Role'
    .eq('email', user.email) // Type mismatch se bachne ke liye email use karein
    .single();

  if (dbError) {
    console.error("fetch.ts error ki wajah:", dbError.message);
    return;
  }

  // Admin check
  if (userData.role !== 'admin') {
    window.location.href = "../Users Files/home.html";
  }
}

protectDashboard();


// ================================================================   DashBoard Page Functionality   ================================================================

// ----------------------------------------------   A: UPLOAD FILE   ----------------------------------------------

const fileInput = document.getElementById("prodImg");
const uploadBtn = document.getElementById("publishBtn");
const title = document.getElementById("prodTitle");
const Description = document.getElementById("prodDesc");

// console.log(fileInput);
// console.log(uploadBtn);
// console.log(title);
// console.log(Description);

function displayName(e) {
  // e.preventDefault();

  if (fileInput.click) {
    fileInput.style.visibility = "visible";
    fileInput.style.color = "gray";
    console.log("Styling Update");

  }
}

fileInput && fileInput.addEventListener("click", displayName)

async function UploadFile() {

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Swal.fire("Error", "Please login first!", "error");
  }

  const file = fileInput.files[0];
  const prodTitle = document.getElementById("prodTitle").value.trim();
  // console.log(prodTitle);

  const prodDesc = document.getElementById("prodDesc").value.trim();
  // console.log(prodDesc);

  const colorInputs = document.querySelectorAll(".color-input-field");
  const selectedColors = Array.from(colorInputs).map(input => input.value);
  // console.log(selectedColors);
const selectedStatus = document.querySelector(
  'input[name="prodStatus"]:checked'
).value;

  // console.log(selectedStatus);


  if (!file || !prodTitle || !prodDesc || selectedColors.length === 0) {
    return Swal.fire({
      title: "Fields Required",
      text: "Please fill all fields: Image, Title, Description, at least one Color, and Product Status.",
      icon: "warning",
      confirmButtonColor: "#4f46e5"
    });
  }

  const { data: { dbuser } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("FullStack-Users")
    .select("role")
    .eq("email", user.email)
    .single();

  if (error) {
    console.error(error.message);
  }


  console.log(dbuser);


  if (!data || data.role !== "admin") {
    return Swal.fire("Error", "Login required", "error");
  }
  if (error) {
    console.error("Database error:", error);
  }
  Swal.fire({
    title: 'Publishing...',
    didOpen: () => Swal.showLoading()
  });

  try {
    const fileName = `${Date.now()}_${file.name}`;
    console.log(fileName);
    console.log(file);


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

function AddColorBtn() {

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "fa-solid fa-circle-xmark delete-color-icon";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.color = "#ff4d4d";

  deleteBtn.addEventListener("click", () => {
    wrapper.remove();
  })

  const wrapper = document.createElement("div");
  wrapper.className = "color-item-wrapper";

  const newColorInput = document.createElement("input");
  newColorInput.type = "color";
  newColorInput.className = "color-input-field";

  wrapper.appendChild(newColorInput);
  wrapper.appendChild(deleteBtn);

  colorContainer.insertBefore(wrapper, addColorBtn);
}

addColorBtn && addColorBtn.addEventListener("click", AddColorBtn)


// ----------------------------------------------   C: FETCH FILE   ----------------------------------------------

async function fetchFile() {
  const cardContainer = document.getElementById('product-card-container');
  if (!cardContainer) return;

  cardContainer.innerHTML = "";

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    console.log("Session missing, skipping fetch.");
    return;
  }

  const { data, error } = await supabase
    .from('FullStack-Images')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Fetch error:", error.message);
    cardContainer.innerHTML = `<p style="color:white;">Error loading cardContainer: ${error.message}</p>`;
    return;
  }

  if (data && data.length > 0) {
    data.forEach(item => {
      console.log(item);

      const statusText = item.status === "Active" ? "Active" : "Inactive";
      const statusClass = item.status === "Active" ? "active" : "inactive";

      cardContainer.innerHTML += `
<div class="col-6 col-md-4 col-lg-3 d-flex align-items-stretch"> 
    <div class="product-preview-card">
      <div class="p-visual">
        <div class="img-wrapper">
            <img src="${item.image_url}" alt="${item.image_name}">
        </div>
        
        <div class="p-admin-tools">
          <button class="edit-tool" onclick="startEdit(${item.id}, '${item.image_url}')"><i class="fas fa-edit"></i></button>
          <button class="del-tool" onclick="deleteImage(${item.id}, '${item.image_url}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      
      <div class="p-details">
        <span class="p-tag">NEW ARRIVAL</span>
        <h4>${item.product_title}</h4>
        <p>${item.product_description}</p>
        <div class="p-swatches">
            <span style="background: #4f46e5;"></span>
            <span style="background: #10b981;"></span>
        </div>
        <div class="p-footer-status">Status:<b class="${statusClass}">${statusText}</b></div>
      </div>
    </div>
      </div>
            `;
    });
  } else {
    cardContainer.innerHTML = "<p style='color:white; text-align:center; grid-column: 1/-1;'>Your cardContainer is empty. Upload your first image!</p>";
  }
}

if (uploadBtn) {
  uploadBtn.addEventListener("click", UploadFile);
}

window.onload = fetchFile;

// ----------------------------------------------   D: DELETE FILE   ----------------------------------------------

let currentOldUrl = null;

window.deleteImage = async (id, imageUrl) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action will permanently delete the image.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('FullStackImages').remove([fileName]);

      const { error } = await supabase.from('FullStack-Images').delete().eq('id', id);

      if (error) throw error;

      Swal.fire('Deleted!', 'The image has been removed successfully.', 'success');
      fetchFile();
    } catch (err) {
      Swal.fire('Error', 'Failed to delete image: ' + err.message, 'error');
    }
  }
};

// ----------------------------------------------   D: EDIT FILE   ----------------------------------------------
let currentEditId = null;

window.startEdit = async (id, oldTitle, oldDesc) => {
  currentEditId = id;

  // 1️⃣ Swal input modal
  const { value: formData } = await Swal.fire({
    title: "Edit Product",
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Title" value="">
      <textarea id="swal-desc" class="swal2-textarea" placeholder="Description"></textarea>
      <input id="swal-file" type="file" class="swal2-file" accept="image/*">
    `,
    confirmButtonText: "Update",
    focusConfirm: false,
    preConfirm: () => {
      return {
        title: document.getElementById("swal-title").value.trim(),
        desc: document.getElementById("swal-desc").value.trim(),
        file: document.getElementById("swal-file").files[0]
      };
    }
  });

  if (!formData) return;

  Swal.fire({ title: "Updating...", didOpen: () => Swal.showLoading() });

  try {
    let imageUrl = null;
    let imageName = null;

    // 2️⃣ Image upload (optional)
    if (formData.file) {
      const fileName = `${Date.now()}_${formData.file.name}`;

      await supabase.storage
        .from("FullStackImages")
        .upload(fileName, formData.file);

      const { data } = supabase.storage
        .from("FullStackImages")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
      imageName = formData.file.name;
    }

    // 3️⃣ DB update
    const updateData = {
      product_title: formData.title,
      product_description: formData.desc
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
      updateData.image_name = imageName;
    }

    await supabase
      .from("FullStack-Images")
      .update(updateData)
      .eq("id", currentEditId);

    Swal.fire("Updated!", "Product updated successfully", "success");
    fetchFile();

  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};
