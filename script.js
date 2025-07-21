let timeLeft = 60 * 60; // 60 minutes in seconds
const timerElement = document.getElementById("timer");
const quizContainer = document.getElementById("quizContainer");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const retryButton = document.getElementById("retryButton");
const studentForm = document.getElementById("studentForm");
const studentFormContainer = document.getElementById("studentFormContainer");
const studentDetails = document.getElementById("studentDetails");

// Handle Student Form Submission
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;

  localStorage.setItem("studentName", studentName);
  localStorage.setItem("studentEmail", studentEmail);

  studentFormContainer.style.display = "none";
  quizContainer.style.display = "block";
  document.getElementById("questionNavigator").style.display = "block";
  updateTimer();
});

// Timer Function
function updateTimer() {
  if (timeLeft <= 0 || quizContainer.style.display === "none") return;
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent = `Time Left: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    alert("Time's up! Submitting your quiz.");
    submitQuiz();
  }
}

// Submit Quiz Function
document.getElementById("submit").addEventListener("click", function () {
  submitQuiz();
});

function submitQuiz() {
  let score = 0;
 const answers = {
   q1: "A",
   q2: "A",
   q3: "C",
   q4: "C",
   q5: "B",
   q6: "A",
   q7: "D",
   q8: "A",
   q9: "C",
   q10: "C",
   q11: "D",
   q12: "D",
   q13: "C",
   q14: "A",
   q15: "C",
   q16: "C",
   q17: "B",
   q18: "D",
   q19: "B",
   q20: "A",

   q21: "B",
   q22: "C",
   q23: "C",
   q24: "C",
   q25: "A",
   q26: "D",
   q27: "C",
   q28: "C",
   q29: "B",
   q30: "D",

   q31: "C",
   q32: "B",
   q33: "B",
   q34: "D",
   q35: "B",
   q36: "C",
   q37: "B",
   q38: "C",
   q39: "B",
   q40: "B",

   q41: "C",
   q42: "C",
   q43: "A",
   q44: "B",
   q45: "B",
   q46: "C",
   q47: "C",
   q48: "B",
   q49: "C",
   q50: "C",

   q51: "C",
   q52: "B",
   q53: "B",
   q54: "B",
   q55: "C",
   q56: "A",
   q57: "B",
   q58: "C",
   q59: "D",
   q60: "B",

   q61: "C",
   q62: "D",
   q63: "C",
   q64: "B",
   q65: "A",
   q66: "B",
   q67: "C",
   q68: "A",
   q69: "A",
   q70: "C",

   q71: "C",
   q72: "B",
   q73: "B",
   q74: "B",
   q75: "A",
   q76: "B",
   q77: "C",
   q78: "B",
   q79: "C",
   q80: "C",

   q81: "C",
   q82: "C",
   q83: "C",
   q84: "B",
   q85: "C",
   q86: "A",
   q87: "B",
   q88: "D",
   q89: "D",
   q90: "A",

   q91: "B",
   q92: "A",
   q93: "A",
   q94: "B",
   q95: "C",
   q96: "B",
   q97: "B",
   q98: "A",
   q99: "C",
   q100: "C",
 };

  
  let total = Object.keys(answers).length;

  for (let key in answers) {
    let selected = document.querySelector(`input[name="q${key}"]:checked`);

    if (selected && selected.value === answers[key]) {
      score++;
    }
  }

  const storedName = localStorage.getItem("studentName");
  const storedEmail = localStorage.getItem("studentEmail");
  studentDetails.innerHTML = `<strong>Name:</strong> ${storedName} <br> <strong>Email:</strong> ${storedEmail}`;

  quizContainer.style.display = "none";
  document.getElementById("questionNavigator").style.display = "none";
  resultContainer.style.display = "block";
  resultText.textContent = `Your score: ${score}/${total}`;

  // Send result via email to backend
  sendResultEmail(storedName, storedEmail, score, total);
}

function sendResultEmail(name, email, score, total) {
  fetch("http://localhost:3000/send-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      score: score,
      total: total,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Email sending failed");
      return response.json();
    })
    .then((data) => console.log("Email sent:", data))
    .catch((error) => console.error("Error sending email:", error));
}

retryButton.addEventListener("click", function () {
  location.reload();
});

// Navigator setup
window.addEventListener("DOMContentLoaded", () => {
  const navigator = document.getElementById("questionNavigator");
  const navButtons = document.getElementById("navButtons");
  const questions = document.querySelectorAll(".question");
  const navBtnRefs = [];

  if (questions.length > 0) {
    questions.forEach((q, i) => {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.setAttribute("data-index", i);
      btn.onclick = () =>
        q.scrollIntoView({ behavior: "smooth", block: "center" });
      navButtons.appendChild(btn);
      navBtnRefs.push(btn);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(questions).indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            navBtnRefs.forEach((btn, idx) => {
              const isAnswered = questions[idx].querySelector("input:checked");
              btn.classList.remove("active", "answered");
              if (isAnswered) btn.classList.add("answered");
            });
            navBtnRefs[index].classList.add("active");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    questions.forEach((q) => observer.observe(q));
  }
});

