document.addEventListener("DOMContentLoaded", () => {

    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");

    let totalQuestions = parseInt(localStorage.getItem("selectedMCQs")) || 30;

    let correct = Math.floor(totalQuestions * 0.86);
    let wrong = totalQuestions - correct;
    let accuracy = Math.round((correct / totalQuestions) * 100);

    document.getElementById("score").textContent = correct + "/" + totalQuestions;
    document.getElementById("correct").textContent = correct;
    document.getElementById("wrong").textContent = wrong;
    document.getElementById("accuracy").textContent = accuracy + "%";

    leaderboardBtn.addEventListener("click", () => {

        window.location.href = "leaderboard.html";

    });

    dashboardBtn.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

});