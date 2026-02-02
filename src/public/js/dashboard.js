// ===============================
// ELEMENTS
// ===============================
const uploadForm = document.getElementById("uploadForm");
const fileTable = document.getElementById("fileTable");

// ===============================
// UPLOAD FILE
// ===============================
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  try {
    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    alert(data.message || "File uploaded");

    uploadForm.reset();
    loadFiles();

  } catch (error) {
    alert("Upload failed");
    console.error(error);
  }
});

// ===============================
// LOAD FILES INTO TABLE
// ===============================
async function loadFiles() {
  try {
    const res = await fetch("/api/files");
    const files = await res.json();

    fileTable.innerHTML = "";

    if (!files || files.length === 0) {
      fileTable.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;">No files uploaded</td>
        </tr>
      `;
      return;
    }

    files.forEach((file, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${file.originalName}</td>
        <td>${new Date(file.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="downloadFile('${file._id}')">Download</button>
        </td>
      `;

      fileTable.appendChild(tr);
    });

  } catch (error) {
    console.error("Failed to load files", error);
    fileTable.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">Error loading files</td>
      </tr>
    `;
  }
}

// ===============================
// DOWNLOAD (OTP FLOW)
// ===============================
function downloadFile(fileId) {
  localStorage.setItem("fileId", fileId);
  window.location.href = "/otp";
}

// ===============================
// INITIAL LOAD
// ===============================
loadFiles();
