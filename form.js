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
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // store user information in local storage

  localStorage.setItem("firstName", firstName);
  localStorage.setItem("lastName", lastName);
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  // validate user input
  if (firstName === "" && lastName === "" && email === "" && password === "") {
    Swal.fire({
      title: "Error!",
      text: "Input fields cannot be empty",
      icon: "error",
      confirmButtonText: "Return",
    });
  } else if (password.length >= 8 && password.length <= 20) {
    Swal.fire({
      title: "Success!",
      text: "User registered successfully",
      icon: "success",
      confirmButtonText: "Ok",
    });

    // programatically redirect user to the login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 4000);
  } else {
    Swal.fire({
      title: "Error!",
      text: "Minimum password length is 8 characters or maximum of 20 characters",
      icon: "error",
      confirmButtonText: "Return",
    });
  }
};

// Add event listener to the eye icon
eyeOpen.addEventListener("click", togglePassword);
eyeClosed.addEventListener("click", togglePassword);
formWrapper.addEventListener("submit", handleSubmit);
