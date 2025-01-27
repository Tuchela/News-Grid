const eyeOpen = document.getElementById("fa-eye");
const eyeClosed = document.getElementById("fa-eye-slash");
const formWrapper = document.getElementById("form-submit");
const passwordInput = document.getElementById("password");

// Create a function to toggle password icon

const togglePassword = () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  } else {
    passwordInput.type = "password";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  }
};

// Create a function to handle form submission

const handleSubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // store user information in local storage

let getEmail = localStorage.getItem("email", email);
let getPassword = localStorage.getItem("password", password);

  // validate user input
  if (email === "" && password === "") {
    Swal.fire({
      title: "Error!",
      text: "Input fields cannot be empty",
      icon: "error",
      confirmButtonText: "Return",
    });
  } else if (email === getEmail && password === getPassword) {
    Swal.fire({
      title: "Success!",
      text: "Login successful",
      icon: "success",
      confirmButtonText: "Ok",
    });

    // Programming setup
    setTimeout(() => {
      window.location.href = "./home.html";
    }, 4000);
  } else {
    Swal.fire({
      title: "Error!",
      text: "User Credentials do not match",
    });

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 4000);
  }
};

// Add event listener to the eye icon
eyeOpen.addEventListener("click", togglePassword);
eyeClosed.addEventListener("click", togglePassword);
formWrapper.addEventListener("submit", handleSubmit);
