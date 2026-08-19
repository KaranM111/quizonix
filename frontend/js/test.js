document.addEventListener("DOMContentLoaded", () => {

    const timeElement = document.getElementById("time");
    const questionNo = document.getElementById("questionNo");
    const totalQuestions = document.getElementById("totalQuestions");
    const progressBar = document.getElementById("progressBar");

    const previousBtn = document.getElementById("previousBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    const navigatorButtons = document.querySelectorAll(".num");
    const options = document.querySelectorAll('input[name="option"]');

    let total = localStorage.getItem("selectedMCQs");

    if (!total) total = 30;

    totalQuestions.textContent = total;

    navigatorButtons.forEach((btn, index) => {

        if (index >= total) {

            btn.style.display = "none";

        }

    });

    let currentQuestion = 1;

    let timeLeft = 45 * 60;

    function updateTimer() {

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timeElement.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        if (timeLeft <= 0) {

            clearInterval(timer);

            alert("Time is over!");

            window.location.href = "result.html";

        }

        timeLeft--;

    }

    const timer = setInterval(updateTimer, 1000);

    updateTimer();

    function updateProgress() {

        questionNo.textContent = currentQuestion;

        progressBar.style.width =
            ((currentQuestion / total) * 100) + "%";

        navigatorButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        navigatorButtons[currentQuestion - 1].classList.add("active");

    }

    navigatorButtons.forEach((btn, index) => {

        if (index >= total) return;

        btn.addEventListener("click", () => {

            currentQuestion = index + 1;

            updateProgress();

        });

    });

    options.forEach(option => {

        option.addEventListener("change", () => {

            navigatorButtons[currentQuestion - 1].classList.add("answered");

        });

    });

    nextBtn.addEventListener("click", () => {

        if (currentQuestion < total) {

            currentQuestion++;

            updateProgress();

        }

    });

    previousBtn.addEventListener("click", () => {

        if (currentQuestion > 1) {

            currentQuestion--;

            updateProgress();

        }

    });

    submitBtn.addEventListener("click", () => {

        if (confirm("Submit Test?")) {

            clearInterval(timer);

            window.location.href = "result.html";

        }

    });

    updateProgress();

});