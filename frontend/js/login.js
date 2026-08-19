document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
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

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const pass = password.value.trim();
        const role = document.querySelector('input[name="role"]:checked').value;

        if (email === "" || pass === "") {
            alert("Please fill all fields.");
            return;
        }

        // Temporary Frontend Login
        // Backend authentication will replace this later.

        if (role === "admin") {

            window.location.href = "admin.html";

        } else {

            window.location.href = "dashboard.html";

        }

    });

});