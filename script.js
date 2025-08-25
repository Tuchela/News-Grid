document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault(); // stop form from reloading page

  let email = document.getElementById("email").value;
  let message = document.getElementById("message");

  // Simple email validation
  if (!email.includes("@")) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address!",
      confirmButtonColor: "#007BFF",
    });
    return;
  }

  // Simulate sending reset email (replace with real API later)
  Swal.fire({
    icon: "success",
    title: "Reset Link Sent!",
    text: `If an account exists for ${email}, a reset link has been sent.`,
    confirmButtonColor: "#007BFF",
  });

  // Clear input
  document.getElementById("email").value = "";
});

  