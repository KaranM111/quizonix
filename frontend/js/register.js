document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {
            password.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            password.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }

    });

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const college = document.getElementById("college").value.trim();
        const branch = document.getElementById("branch").value.trim();
        const semester = document.getElementById("semester").value.trim();
        const pass = password.value.trim();

        if (
            name === "" ||
            email === "" ||
            college === "" ||
            branch === "" ||
            semester === "" ||
            pass === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        // Temporary frontend registration.
        // Backend database will handle registration later.

        alert("Registration Successful!");

        window.location.href = "login.html";

    });

});