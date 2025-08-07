let questions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = []; // Track user selections

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
   updateNavigationButtons();
  if (currentQuestion >= questions.length) {
    showResults();
    return;
  }

  const question = questions[currentQuestion];
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextBtn = document.getElementById('next-btn');

  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';

  // Initially disable the Next button
  nextBtn.disabled = true;

  question.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'option-label';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'question-options';
    input.value = index;

    // If already selected before, check it
    if (userAnswers[currentQuestion] === index) {
      input.checked = true;
      nextBtn.disabled = false;
      label.classList.add('selected');
    }

    input.onchange = () => {
      selectAnswer(index);
      nextBtn.disabled = false;
      displayQuestion();
    };

    label.appendChild(input);
    label.appendChild(document.createTextNode(option));

    const div = document.createElement('div');
    div.className = 'option-container';
    div.appendChild(label);

    optionsElement.appendChild(div);
  });

  updateProgress();
  toggleButtonStates();
}

function selectAnswer(selectedIndex) {
  userAnswers[currentQuestion] = selectedIndex;
}

function nextQuestion() {
  currentQuestion++;
  displayQuestion();
}

function prevQuestion() {
  currentQuestion--;
  displayQuestion();
}

function skipQuestion() {
  userAnswers[currentQuestion] = null;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  }
}

function showResults() {
  let resultScore = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      resultScore++;
    }
  });

  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your score: ${resultScore} out of ${questions.length}</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}

function updateProgress() {
  document.getElementById('progress').textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;
}

function toggleButtonStates() {
  document.getElementById('prev-btn').disabled = currentQuestion === 0;
  document.getElementById('next-btn').disabled = userAnswers[currentQuestion] == null;
  document.getElementById('submit-btn').style.display =
    currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
}

function updateNavigationButtons() {
  const navContainer = document.getElementById('quiz-navigation');
  navContainer.innerHTML = '';
  
  questions.forEach((_, index) => {
    const btn = document.createElement('button');
    btn.textContent = `Q${index + 1}`;
    btn.className = 'nav-btn';
    
    if (index === currentQuestion) {
      btn.classList.add('current');
    } else if (userAnswers[index] !== null) {
      btn.classList.add('answered');
    }
    
    btn.addEventListener('click', () => {
      currentQuestion = index;
      displayQuestion();
    });
    
    navContainer.appendChild(btn);
  });
}


// Initialize
window.onload = loadQuestions;



