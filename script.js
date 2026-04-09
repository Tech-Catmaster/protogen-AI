// --- Login & Account System ---
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const displayUser = document.getElementById('display-user');

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if(username) {
    localStorage.setItem('username', username);
    displayUser.textContent = username;
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
  } else {
    alert('Enter a valid username!');
  }
});

// Auto-login if user already exists
window.addEventListener('load', () => {
  const savedUser = localStorage.getItem('username');
  if(savedUser) {
    displayUser.textContent = savedUser;
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
  }
});

// --- Answer Generator ---
const questionInput = document.getElementById('question');
const answerDiv = document.getElementById('answer');

// List of answers (expandable)
const answers = [
  "Yes, definitely!",
  "No way!",
  "Maybe...",
  "Absolutely!",
  "I can't tell now.",
  "Ask again later.",
  "Definitely not!",
  "Of course!",
  "It's possible.",
  "Without a doubt!"
];

// Generate answer on Enter key press
questionInput.addEventListener('keypress', function(e) {
  if(e.key === 'Enter') generateAnswer();
});

function generateAnswer() {
  const question = questionInput.value.trim();
  if(question) {
    const randomIndex = Math.floor(Math.random() * answers.length);
    answerDiv.textContent = answers[randomIndex];
    questionInput.value = '';
  } else {
    answerDiv.textContent = "Please ask a question first!";
  }
}

// --- Sidebar Toggle ---
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});
