// ===============================
// GET FILE ID
// ===============================
const fileId = localStorage.getItem("fileId");

// ===============================
// SEND OTP
// ===============================
async function sendOtp() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    // Disable input & button to avoid multiple clicks
    emailInput.disabled = true;

    const res = await fetch(`/api/files/request-download/${fileId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }

    alert("OTP sent successfully. Please check your email.");

  } catch (error) {
    alert(error.message || "Failed to send OTP");
    emailInput.disabled = false;
  }
}

// ===============================
// VERIFY OTP & DOWNLOAD
// ===============================
async function verifyOtp() {
  const email = document.getElementById("email").value.trim();
  const otpInput = document.getElementById("otp");
  const otp = otpInput.value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    otpInput.disabled = true;

    const res = await fetch("/api/files/verify-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, fileId })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    if (data.downloadUrl) {
      // Redirect to S3 signed URL
      window.location.href = data.downloadUrl;
    } else {
      throw new Error("Download URL not received");
    }

  } catch (error) {
    alert(error.message || "OTP verification failed");
    otpInput.disabled = false;
  }
}
