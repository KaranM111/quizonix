document.addEventListener("DOMContentLoaded", () => {

    const dashboardBtn = document.getElementById("dashboardBtn");

    const subjectFilter = document.querySelectorAll("select")[0];
    const mcqFilter = document.querySelectorAll("select")[1];

    dashboardBtn.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

    subjectFilter.addEventListener("change", () => {

        alert("Backend will load leaderboard for: " + subjectFilter.value);

    });

    mcqFilter.addEventListener("change", () => {

        alert("Backend will load " + mcqFilter.value + " leaderboard.");

    });

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row, index) => {

        row.style.opacity = "0";
        row.style.transform = "translateY(20px)";

        setTimeout(() => {

            row.style.transition = "0.4s";
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";

        }, index * 120);

    });

});