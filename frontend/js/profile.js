document.addEventListener("DOMContentLoaded", () => {

    const saveBtn = document.getElementById("saveBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const inputs = document.querySelectorAll("input");

    saveBtn.addEventListener("click", () => {

        let valid = true;

        inputs.forEach(input => {

            if (input.value.trim() === "") {

                valid = false;

                input.style.borderColor = "#EF4444";

            } else {

                input.style.borderColor = "#3B82F6";

            }

        });

        if (!valid) {

            alert("Please fill all fields.");

            return;

        }

        alert("Profile updated successfully.");

    });

    dashboardBtn.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

    logoutBtn.addEventListener("click", () => {

        if (confirm("Logout from Quizonix?")) {

            localStorage.clear();

            window.location.href = "login.html";

        }

    });

});