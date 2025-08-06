let questions = [];
let currentQuestion = 0;
let score = 0;

// Fetch questions from JSON file
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    questions = await response.json();
    displayQuestion();
  } catch (error) {
    console.error('Error loading questions:', error);
    document.getElementById('quiz-container').innerHTML = `
      <div class="error">Failed to load questions. Please try again later.</div>
    `;
  }
}

function displayQuestion() {
  if (currentQuestion >= questions.length) {
    // Quiz completed
    showResults();
    return;
  }

  const question = questions[currentQuestion];
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  
  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'option-btn';
    button.onclick = () => selectAnswer(index);
    optionsElement.appendChild(button);
  });

  updateProgress();
}

function selectAnswer(selectedIndex) {
  const question = questions[currentQuestion];
  if (selectedIndex === question.correctAnswer) {
    score++;
  }
  
  currentQuestion++;
  displayQuestion();
}

function showResults() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your score: ${score} out of ${questions.length}</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}

function updateProgress() {
  document.getElementById('progress').textContent = 
    `Question ${currentQuestion + 1} of ${questions.length}`;
}

// Initialize the quiz when the page loads
window.onload = loadQuestions;