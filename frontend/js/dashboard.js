document.addEventListener("DOMContentLoaded", () => {

    const menuItems = document.querySelectorAll(".sidebar ul li");
    const startButtons = document.querySelectorAll(".start-btn");
    const selects = document.querySelectorAll(".tests select");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

            const text = item.innerText.trim();

            switch (text) {

                case "Leaderboard":
                    window.location.href = "leaderboard.html";
                    break;

                case "Profile":
                    alert("Profile page will be available soon.");
                    break;

                case "My Attempts":
                    alert("Attempt history will be connected with backend.");
                    break;

                case "Logout":

                    if (confirm("Logout from Quizonix?")) {

                        window.location.href = "login.html";

                    }

                    break;

            }

        });

    });

    startButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            const mcqs = selects[index].value;

            const confirmTest = confirm(
                "Start " + mcqs + "?\n\nDuration : 45 Minutes"
            );

            if (confirmTest) {

                localStorage.setItem("selectedMCQs", mcqs);

                window.location.href = "test.html";

            }

        });

    });

});