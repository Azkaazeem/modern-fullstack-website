import supabase from "./config.js";


// ================================================================   Logout Button Functionality   ================================================================

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

  const { data, error } = await supabase
    .from("FullStack-Users")
    .select("role")
    .single()

  console.log(data);


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

if (uploadBtn) {
  uploadBtn.addEventListener("click", UploadFile);
}


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

  cardContainer.innerHTML = "";

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (!user || userErr) {
    console.log("User not logged in");
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
        <h4>Silk Scarf Premium</h4>
        <p>This is how the text will display on your store.</p>
        <div class="p-swatches">
            <span style="background: #4f46e5;"></span>
            <span style="background: #10b981;"></span>
        </div>
        <div class="p-footer-status">Status: <b>Active</b></div>
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

// const editFileInput = document.getElementById('editFileInput');
// let currentEditId = null;
// let currentOldUrl = null;

// window.deleteImage = async (id, imageUrl) => {
//     const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "This action will permanently delete the image.",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//         try {
//             const fileName = imageUrl.split('/').pop(); 
//             await supabase.storage.from('Images').remove([fileName]);

//             const { error } = await supabase.from('userImages').delete().eq('id', id);

//             if (error) throw error;

//             Swal.fire('Deleted!', 'The image has been removed successfully.', 'success');
//             fetchGallery();
//         } catch (err) {
//             Swal.fire('Error', 'Failed to delete image: ' + err.message, 'error');
//         }
//     }
// };

// // ----------------------------------------------   D: EDIT FILE   ----------------------------------------------

// window.startEdit = (id, url) => {
//     currentEditId = id;
//     currentOldUrl = url;
//     editFileInput.click();
// };
// editFileInput.addEventListener('change', async () => {
//     const newFile = editFileInput.files[0];
//     if (!newFile) return;

//     Swal.fire({ title: 'Updating...', didOpen: () => Swal.showLoading() });

//     try {
//         const fileName = `${Date.now()}_${newFile.name}`;
        
//         const { data: upData, error: upErr } = await supabase.storage
//             .from('Images')
//             .upload(fileName, newFile);

//         if (upErr) throw upErr;

//         const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);

//         const { error: dbErr } = await supabase.from('userImages')
//             .update({ image_url: publicUrl, image_name: newFile.name })
//             .eq('id', currentEditId);

//         if (dbErr) throw dbErr;

//         Swal.fire('Updated!', 'Image has been replaced successfully.', 'success');
//         fetchGallery();
//     } catch (err) {
//         Swal.fire('Update Failed', err.message, 'error');
//     }
// });