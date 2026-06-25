const accountStorageKey = 'chiTechAccounts';
const recordStorageKey = 'chiTechRecords';

const defaultAccounts = [
    { username: 'student1', password: 'pass123', name: 'Student One' },
    { username: 'examuser', password: 'pass456', name: 'Exam Coach' }
];

let accounts = [];
let records = [];

const subjects = {
    Science: [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Further Mathematics',
        'Computer Science',
        'Agricultural Science',
        'Animal Husbandry',
        'Basic Electricity',
        'Technical Drawing'
    ],
    Arts: [
        'English Language',
        'Literature in English',
        'Government',
        'History',
        'Geography',
        'Economics',
        'Commerce',
        'Christian Religious Studies',
        'Islamic Religious Studies',
        'Civic Education'
    ]
};

const subjectTopics = {
    Mathematics: 'a core mathematics problem',
    Physics: 'motion, force or energy',
    Chemistry: 'a chemical reaction',
    Biology: 'a living system concept',
    'Further Mathematics': 'an advanced mathematics idea',
    'Computer Science': 'a programming or logic concept',
    'Agricultural Science': 'a farm crop or soil idea',
    'Animal Husbandry': 'an animal care concept',
    'Basic Electricity': 'a simple electrical circuit',
    'Technical Drawing': 'a design and drawing principle',
    'English Language': 'a grammar or comprehension task',
    'Literature in English': 'a literature analysis question',
    Government: 'a civic governance concept',
    History: 'a historical event or date',
    Geography: 'a physical or human geography fact',
    Economics: 'a market or money principle',
    Commerce: 'a trade or business concept',
    'Christian Religious Studies': 'a biblical or ethical idea',
    'Islamic Religious Studies': 'a faith and practice topic',
    'Civic Education': 'a citizenship or rights question'
};

const questionQualifiers = [
    'in the context of basic theory',
    'using recent exam-style reasoning',
    'with careful attention to detail',
    'based on common past question structure',
    'using the core idea behind the topic',
    'linked to the practical use of the topic',
    'with a focus on the expected exam answer',
    'in a way that connects concept to application',
    'with emphasis on standard marking points',
    'from a foundation-level perspective',
    'from a higher-order thinking angle',
    'with emphasis on experimental reasoning',
    'with reference to typical exam content',
    'using a step-by-step conceptual approach',
    'with a clear cause and effect link',
    'based on the fundamental principle',
    'with an academic exam focus',
    'in the form expected by examiners',
    'with an emphasis on concept recall',
    'using practical examples where needed',
    'with an illustration of the central idea',
    'with a focus on evidence and explanation',
    'in relation to the standard syllabus',
    'using an examination technique mindset',
    'with a problem-solving emphasis',
    'with a detail-oriented approach',
    'using the typical exam wording',
    'with a focus on core definitions',
    'with links to the required learning outcomes',
    'with attention to accuracy and clarity',
    'with a real-world example in mind',
    'using a diagram-friendly concept',
    'with an emphasis on reasoning and judgement',
    'with direct application to the topic'
];

const years = Array.from({ length: 2025 - 2014 + 1 }, (_, index) => 2014 + index);
const quizCount = 30;
let currentQuestions = [];
let currentUser = null;
let timerId = null;
let timeRemaining = 0;

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const showSignupButton = document.getElementById('show-signup');
const signupCard = document.getElementById('signup-card');
const showLoginButton = document.getElementById('show-login');
const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');
const fullNameInput = document.getElementById('new-fullname');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const examPanel = document.getElementById('exam-panel');
const leaguePanel = document.getElementById('league-panel');
const leagueTableBody = document.querySelector('#league-table tbody');
const currentRankText = document.getElementById('current-rank');
const refreshLeagueButton = document.getElementById('refresh-league');
const studentName = document.getElementById('student-name');
const examSelect = document.getElementById('exam-select');
const categorySelect = document.getElementById('category-select');
const subjectSelect = document.getElementById('subject-select');
const yearSelect = document.getElementById('year-select');
const loadQuestionsButton = document.getElementById('load-questions');
const clearScoreButton = document.getElementById('clear-score');
const questionPanel = document.getElementById('question-panel');
const timerSelect = document.getElementById('timer-select');
const timeDisplay = document.getElementById('time-display');
const quizForm = document.getElementById('quiz-form');
const submitAnswersButton = document.getElementById('submit-answers');
const resultPanel = document.getElementById('result-panel');
const scoreText = document.getElementById('score-text');
const resultDetails = document.getElementById('result-details');

function init() {
    loadStoredData();
    populateYearOptions();
    populateSubjectOptions();
    categorySelect.addEventListener('change', populateSubjectOptions);
    safeAddListener(loginForm, 'submit', handleLogin);
    safeAddListener(showSignupButton, 'click', () => toggleSignup(true));
    safeAddListener(showLoginButton, 'click', () => toggleSignup(false));
    safeAddListener(signupForm, 'submit', handleCreateAccount);
    safeAddListener(loadQuestionsButton, 'click', handleLoadQuestions);
    safeAddListener(clearScoreButton, 'click', resetQuiz);
    safeAddListener(submitAnswersButton, 'click', handleSubmitAnswers);
    safeAddListener(refreshLeagueButton, 'click', () => updateLeagueTable(currentUser && currentUser.username));
}

function safeAddListener(el, evt, fn) {
    if (!el) {
        return;
    }
    try {
        el.addEventListener(evt, function (e) {
            console.debug(`Event ${evt} triggered on`, el.id || el.tagName);
            try { fn(e); } catch (err) { console.error('Handler error:', err); }
        });
    } catch (err) {
        // element might not support addEventListener
        console.warn('Could not attach listener', evt, err);
    }
}

// Fallback delegation: attach to document so clicks/submits still work
document.addEventListener('click', function (e) {
    try {
        const t = e.target;
        if (t && (t.id === 'show-signup' || t.closest && t.closest('#show-signup'))) {
            e.preventDefault();
            toggleSignup(true);
        }
        if (t && (t.id === 'show-login' || t.closest && t.closest('#show-login'))) {
            e.preventDefault();
            toggleSignup(false);
        }
    } catch (err) {
        console.error('Delegation click error', err);
    }
});

document.addEventListener('submit', function (e) {
    try {
        const id = e.target && e.target.id;
        if (id === 'login-form') {
            e.preventDefault();
            handleLogin(e);
        }
        if (id === 'signup-form') {
            e.preventDefault();
            handleCreateAccount(e);
        }
    } catch (err) {
        console.error('Delegation submit error', err);
    }
});

function populateYearOptions() {
    yearSelect.innerHTML = years
        .map((year) => `<option value="${year}">${year}</option>`)
        .join('');
}

function populateSubjectOptions() {
    const category = categorySelect.value;
    const list = subjects[category] || [];
    subjectSelect.innerHTML = list.map((subject) => `<option value="${subject}">${subject}</option>`).join('');
}

function handleLogin(event) {
    event.preventDefault();
    loginError.classList.add('hidden');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const account = accounts.find((item) => item.username === username && item.password === password);

    if (!account) {
        loginError.textContent = 'Invalid username or password. Use the demo account or create a new account.';
        loginError.classList.remove('hidden');
        return;
    }

    currentUser = account;
    studentName.textContent = account.name;
    examPanel.classList.remove('hidden');
    leaguePanel.classList.remove('hidden');
    loginForm.reset();
    loginError.classList.add('hidden');
    updateLeagueTable(currentUser.username);
}

function handleCreateAccount(event) {
    event.preventDefault();
    signupError.classList.add('hidden');
    signupSuccess.classList.add('hidden');

    const fullName = fullNameInput.value.trim();
    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!fullName || !username || !password || !confirmPassword) {
        signupError.textContent = 'Please fill in every field.';
        signupError.classList.remove('hidden');
        return;
    }

    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match.';
        signupError.classList.remove('hidden');
        return;
    }

    if (accounts.some((item) => item.username === username)) {
        signupError.textContent = 'Username already exists. Please choose another username.';
        signupError.classList.remove('hidden');
        return;
    }

    const newUser = { username, password, name: fullName };
    accounts.push(newUser);
    saveAccounts();
    signupSuccess.textContent = 'Account created successfully. Please login to continue.';
    signupSuccess.classList.remove('hidden');
    signupForm.reset();
    toggleSignup(false);
}

function toggleSignup(showSignup) {
    if (showSignup) {
        loginForm.classList.add('hidden');
        signupCard.classList.remove('hidden');
        loginError.classList.add('hidden');
    } else {
        loginForm.classList.remove('hidden');
        signupCard.classList.add('hidden');
        signupError.classList.add('hidden');
        signupSuccess.classList.add('hidden');
    }
}

function handleLoadQuestions() {
    const exam = examSelect.value;
    const subject = subjectSelect.value;
    const year = yearSelect.value;
    currentQuestions = createQuestionSet(exam, subject, year);
    renderQuestionForm(currentQuestions, exam, subject, year);
    startTimer();
    scrollToElement(questionPanel);
}

function startTimer() {
    clearTimer();
    const minutes = Number(timerSelect.value) || 15;
    timeRemaining = minutes * 60;
    updateTimerDisplay();
    timerId = setInterval(() => {
        timeRemaining -= 1;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearTimer();
            handleSubmitAnswers(true);
            alert('Time is up! Your answers have been submitted automatically.');
        }
    }, 1000);
}

function clearTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function loadStoredData() {
    try {
        const storedAccounts = localStorage.getItem(accountStorageKey);
        accounts = storedAccounts ? JSON.parse(storedAccounts) : [...defaultAccounts];
    } catch (error) {
        accounts = [...defaultAccounts];
    }

    try {
        const storedRecords = localStorage.getItem(recordStorageKey);
        records = storedRecords ? JSON.parse(storedRecords) : [];
    } catch (error) {
        records = [];
    }
}

function saveAccounts() {
    localStorage.setItem(accountStorageKey, JSON.stringify(accounts));
}

function saveRecords() {
    localStorage.setItem(recordStorageKey, JSON.stringify(records));
}

function recordQuizAttempt(score, exam, subject, year) {
    if (!currentUser) {
        return;
    }

    records.push({
        username: currentUser.username,
        name: currentUser.name,
        exam,
        subject,
        year,
        score,
        timestamp: new Date().toISOString()
    });
    saveRecords();
}

function updateLeagueTable(userName) {
    if (!userName) {
        leagueTableBody.innerHTML = '<tr><td colspan="6">Login to view the league table.</td></tr>';
        currentRankText.textContent = '';
        return;
    }

    const scoresByUser = records.reduce((map, record) => {
        const key = `${record.username}:${record.exam}`;
        if (!map[key]) {
            map[key] = { username: record.username, name: record.name, exam: record.exam, scores: [] };
        }
        map[key].scores.push(record.score);
        return map;
    }, {});

    const ranking = Object.values(scoresByUser).map((entry) => {
        const total = entry.scores.reduce((sum, score) => sum + score, 0);
        const best = Math.max(...entry.scores);
        return {
            ...entry,
            average: Math.round((total / entry.scores.length) * 100) / 100,
            best,
            attempts: entry.scores.length
        };
    });

    ranking.sort((a, b) => b.average - a.average || b.best - a.best || b.attempts - a.attempts);
    leagueTableBody.innerHTML = ranking.slice(0, 20).map((entry, index) => `
            <tr ${entry.username === userName ? 'style="background:#eef6ff"' : ''}>
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.exam}</td>
                <td>${entry.average}%</td>
                <td>${entry.best}%</td>
                <td>${entry.attempts}</td>
            </tr>
        `).join('') || '<tr><td colspan="6">No records yet. Take a quiz to enter the league table.</td></tr>';

    const userEntry = ranking.find((entry) => entry.username === userName);
    if (userEntry) {
        const rank = ranking.findIndex((entry) => entry.username === userName) + 1;
        currentRankText.textContent = `Your current league rank is ${rank} with an average of ${userEntry.average}% and best score ${userEntry.best}%.`;
    } else {
        currentRankText.textContent = 'You do not have recorded quiz results yet. Take a quiz to join the league.';
    }
}

function createQuestionSet(exam, subject, year) {
    const examIndex = ['JAMB', 'WAEC', 'NECO'].indexOf(exam);
    const maxBankSize = questionQualifiers.length * 3 * 7; // 714 distinct variants for each subject
    return Array.from({ length: quizCount }, (_, index) => {
        const bankIndex = ((year - 2014) * quizCount + index + examIndex * 13) % maxBankSize;
        return generateQuestion(exam, subject, year, bankIndex);
    });
}

function generateQuestion(exam, subject, year, questionIndex) {
    const subjectInfo = subjectData[subject] || subjectData[subject.replace(/\s+/g, '')] || subjectData.Default;
    const templateIndex = questionIndex % subjectInfo.templates.length;
    const topicIndex = Math.floor(questionIndex / subjectInfo.templates.length) % subjectInfo.topics.length;
    const qualifierIndex = Math.floor(questionIndex / (subjectInfo.templates.length * subjectInfo.topics.length)) % questionQualifiers.length;

    const topic = subjectInfo.topics[topicIndex];
    const template = subjectInfo.templates[templateIndex];
    const detail = questionQualifiers[qualifierIndex];
    const questionText = template
        .replace('{year}', year)
        .replace('{exam}', exam)
        .replace('{subject}', subject)
        .replace('{topic}', topic)
        .replace('{detail}', detail);

    const choices = createOptionChoices(subject, topic, questionIndex);
    const correctAnswer = ['A', 'B', 'C', 'D'][questionIndex % 4];
    const diagram = subjectInfo.diagram && questionIndex % 3 === 0 ? createDiagram(subject, questionIndex) : null;

    return {
        question: questionText,
        options: choices,
        answer: correctAnswer,
        diagram
    };
}

function createOptionChoices(subject, topic, questionIndex) {
    const labels = ['A', 'B', 'C', 'D'];
    return labels.map((label, index) => {
        const variation = optionVariations[index];
        return `${label}. ${subject} ${variation.replace('{topic}', topic).replace('{subject}', subject)}`;
    });
}

function createDiagram(subject, questionIndex) {
    const diagrams = {
        Physics: `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="50" width="180" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/><path d="M200 80 L300 80" stroke="#1d4ed8" stroke-width="6" marker-end="url(#arrow)"/><defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#1d4ed8"/></marker></defs><text x="30" y="40" fill="#0f172a">Force vector diagram</text></svg></div>`,
        Biology: `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><ellipse cx="160" cy="85" rx="120" ry="55" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/><circle cx="160" cy="85" r="18" fill="#bef264"/><text x="130" y="95" fill="#166534">Cell structure</text></svg></div>`,
        Geography: `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="40" width="260" height="80" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><path d="M45 120 L90 70 L140 110 L190 60 L260 115" fill="none" stroke="#0c4a6e" stroke-width="4"/><text x="40" y="35" fill="#0f172a">Terrain profile</text></svg></div>`,
        'Technical Drawing': `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><polygon points="40,140 180,20 300,140" fill="#e2e8f0" stroke="#475569" stroke-width="4"/><line x1="40" y1="140" x2="300" y2="140" stroke="#0f172a" stroke-width="3"/><text x="120" y="60" fill="#0f172a">A</text></svg></div>`,
        Chemistry: `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="80" r="24" fill="#fde68a" stroke="#b45309" stroke-width="3"/><circle cx="230" cy="80" r="24" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><path d="M112 80 Q160 80 208 80" stroke="#9333ea" stroke-width="3" fill="none"/><text x="120" y="55" fill="#0f172a">Molecule model</text></svg></div>`,
        'Computer Science': `<div class="question-diagram"><strong>Diagram:</strong><br><svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="30" width="220" height="100" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><line x1="110" y1="30" x2="110" y2="130" stroke="#0f172a" stroke-width="2"/><circle cx="260" cy="80" r="18" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="3"/><text x="75" y="75" fill="#0f172a">System flow</text></svg></div>`
    };
    return diagrams[subject] || null;
}

const optionVariations = [
    'requires applying {topic} more carefully.',
    'can be solved by reviewing the {topic} rule.',
    'is best answered with the {topic} principle.',
    'uses a different approach to {topic} than the others.'
];

const subjectData = {
    Mathematics: {
        templates: [
            'In {year} {exam}, which expression best matches {topic}?',
            'For {subject} in the {year} {exam}, choose the correct statement about {topic}.',
            'The {exam} {year} question asks you to evaluate {topic}. Which option is correct?'
        ],
        topics: [
            'a quadratic expression',
            'the area of a circle',
            'a simple linear equation',
            'a set of statistics',
            'a trigonometric ratio',
            'a function rule',
            'a matrix element',
            'a probability question'
        ],
        diagram: false
    },
    Physics: {
        templates: [
            'In {year} {exam}, {subject} students analyze {topic}. Which answer is correct?',
            'A {exam} {subject} question asks about {topic}. Choose the best response.',
            'The {year} {exam} {subject} question asks you to predict the result of {topic}.'
        ],
        topics: [
            'a force acting on an object',
            'motion along a straight line',
            'energy transfer in a circuit',
            'pressure in a fluid',
            'work done on a body',
            'wave frequency',
            'velocity and acceleration'
        ],
        diagram: true
    },
    Chemistry: {
        templates: [
            'For {year} {exam}, which option best describes {topic} in {subject}?',
            'A {exam} question asks you to identify the correct property of {topic}.',
            'In {subject} the {year} {exam} problem uses {topic}. Which choice is right?'
        ],
        topics: [
            'an acid-base reaction',
            'a combustion process',
            'a periodic trend',
            'electrons in an atom',
            'solution concentration',
            'chemical bonding',
            'rate of reaction'
        ],
        diagram: true
    },
    Biology: {
        templates: [
            '{year} {exam} {subject} asks which process describes {topic}.',
            'The {exam} {subject} question is based on {topic}. Select the most suitable answer.',
            'Which statement best explains {topic} in the {year} {exam} {subject}?'
        ],
        topics: [
            'cell structure',
            'photosynthesis in plants',
            'human body systems',
            'genetics and inheritance',
            'disease prevention',
            'ecosystem interactions',
            'nutrition and enzymes'
        ],
        diagram: true
    },
    'Further Mathematics': {
        templates: [
            'In the {year} {exam}, {subject} asks you to solve {topic}. Which answer is correct?',
            '{year} {exam} {subject} includes a problem on {topic}. Choose the best match.',
            'A {subject} question in {exam} tests the method for {topic}.'
        ],
        topics: [
            'a matrix transformation',
            'a complex number',
            'a calculus derivation',
            'a geometric series',
            'a probability distribution',
            'a differential equation',
            'a vector product'
        ],
        diagram: false
    },
    'Computer Science': {
        templates: [
            'The {exam} {year} {subject} question asks about {topic}. Which answer is correct?',
            'For {subject} in {year}, choose the best statement about {topic}.',
            'A {exam} problem on {topic} appears in this {subject} set. Select the right answer.'
        ],
        topics: [
            'algorithm efficiency',
            'database structure',
            'network communication',
            'programming logic',
            'data representation',
            'computer security',
            'system flowcharts'
        ],
        diagram: true
    },
    'Agricultural Science': {
        templates: [
            'A {year} {exam} {subject} question tests {topic}. Choose the correct response.',
            'In {subject}, which answer best explains {topic}?',
            '{year} {exam} asks about {topic} in {subject}.'
        ],
        topics: [
            'crop production',
            'soil fertility',
            'animal management',
            'farm planning',
            'plant nutrition',
            'pest control',
            'harvesting methods'
        ],
        diagram: false
    },
    'Animal Husbandry': {
        templates: [
            'In {year} {exam}, {subject} students are asked about {topic}. Which option is best?',
            'A {exam} question focuses on {topic} in {subject}. Select the correct choice.',
            '{year} {exam} {subject} tests your understanding of {topic}.'
        ],
        topics: [
            'animal nutrition',
            'breeding methods',
            'disease control',
            'livestock housing',
            'animal reproduction',
            'feed formulation',
            'hygiene practices'
        ],
        diagram: false
    },
    'Basic Electricity': {
        templates: [
            'For {year} {exam}, {subject} asks you to analyze {topic}.',
            '{subject} in {exam} tests knowledge of {topic}. Choose the best answer.',
            'Which statement about {topic} is correct for {year} {exam} {subject}?'
        ],
        topics: [
            'a simple circuit',
            'Ohm’s law',
            'electrical safety',
            'series and parallel wiring',
            'current flow',
            'voltage measurement',
            'resistance change'
        ],
        diagram: false
    },
    'Technical Drawing': {
        templates: [
            'The {year} {exam} {subject} problem uses {topic}. Choose the correct diagram or description.',
            'In {subject}, identify the correct result for {topic}.',
            '{exam} {year} asks about {topic} in {subject}. Which is best?'
        ],
        topics: [
            'a scale drawing',
            'a geometric projection',
            'dimensioning practice',
            'isometric view',
            'line weights',
            'orthographic layout',
            'sectional drawing'
        ],
        diagram: true
    },
    'English Language': {
        templates: [
            'In {year} {exam} English Language, which option best handles {topic}?',
            'A {exam} question asks about {topic} in {subject}. Choose the correct answer.',
            'The {year} {exam} English question asks you about {topic}. Which statement fits?'
        ],
        topics: [
            'analyzing a passage',
            'a grammar rule',
            'an essay structure',
            'a vocabulary word',
            'punctuation usage',
            'sentence meaning',
            'comprehension inference'
        ],
        diagram: false
    },
    'Literature in English': {
        templates: [
            'A {year} {exam} Literature question asks about {topic}. Which answer is best?',
            '{subject} in {exam} requires you to compare {topic}. Choose the best option.',
            'For {year} {exam}, which statement about {topic} fits the literary text?'
        ],
        topics: [
            'a character’s motive',
            'a theme in a play',
            'a poet’s language',
            'a literary device',
            'a scene meaning',
            'a writer’s tone',
            'a plot summary'
        ],
        diagram: false
    },
    Government: {
        templates: [
            '{year} {exam} Government asks about {topic}. Which option is correct?',
            'In {subject}, select the best answer for {topic}.',
            'The {exam} {year} question on {topic} in Government is asking you to understand which principle?'
        ],
        topics: [
            'citizenship rights',
            'political structures',
            'electoral systems',
            'public policy',
            'constitutional roles',
            'government agencies',
            'law-making process'
        ],
        diagram: false
    },
    History: {
        templates: [
            '{year} {exam} History asks which event best describes {topic}.',
            'A {subject} question in {exam} covers {topic}. Choose the most accurate answer.',
            'Which statement best explains {topic} in the {year} {exam} History question?'
        ],
        topics: [
            'a national independence movement',
            'a colonial policy',
            'an economic reform',
            'a historic treaty',
            'a social change',
            'a political leader',
            'a historical cause'
        ],
        diagram: false
    },
    Geography: {
        templates: [
            '{year} {exam} Geography includes a question on {topic}. Which is right?',
            'For {exam}, {subject} asks you to identify {topic}. Choose the best answer.',
            'The {year} {exam} {subject} question on {topic} tests your geographic understanding.'
        ],
        topics: [
            'landforms and maps',
            'climate patterns',
            'rural settlement',
            'resource distribution',
            'environmental change',
            'population movement',
            'water systems'
        ],
        diagram: true
    },
    Economics: {
        templates: [
            'The {year} {exam} Economics question asks about {topic}. Which option is best?',
            'In {subject}, choose the answer that matches {topic}.',
            'A {exam} question covering {topic} requires the correct economic principle.'
        ],
        topics: [
            'supply and demand',
            'market price',
            'government policy',
            'production costs',
            'economic growth',
            'international trade',
            'unemployment impact'
        ],
        diagram: false
    },
    Commerce: {
        templates: [
            '{year} {exam} Commerce asks about {topic}. Which is correct?',
            'A {exam} {subject} question tests your knowledge of {topic}.',
            'For {year} {exam}, the {subject} problem asks you to identify the correct {topic} statement.'
        ],
        topics: [
            'business records',
            'capital investment',
            'marketing strategies',
            'trade operations',
            'insurance principles',
            'payment methods',
            'business ownership'
        ],
        diagram: false
    },
    'Christian Religious Studies': {
        templates: [
            'In {year} {exam} CRS, which answer best describes {topic}?',
            'A {subject} question in {exam} focuses on {topic}. Select the most appropriate answer.',
            '{year} {exam} CRS asks you about {topic}. Which statement fits best?'
        ],
        topics: [
            'a biblical teaching',
            'a moral principle',
            'Christian worship',
            'church history',
            'religious leadership',
            'faith practice',
            'spiritual growth'
        ],
        diagram: false
    },
    'Islamic Religious Studies': {
        templates: [
            'For {year} {exam} IRS, which answer best describes {topic}?',
            'A {subject} question in {exam} covers {topic}. Choose the correct option.',
            'In {year} {exam}, {subject} asks about {topic}. Which statement is right?'
        ],
        topics: [
            'a Quranic teaching',
            'Islamic worship',
            'moral conduct',
            'religious history',
            'Islamic law',
            'faith and society',
            'ethical responsibilities'
        ],
        diagram: false
    },
    'Civic Education': {
        templates: [
            '{year} {exam} Civic Education asks about {topic}. Which option is correct?',
            'A {exam} {subject} question covers {topic}. Choose the best answer.',
            '{year} {exam} asks you to explain {topic} in Civic Education.'
        ],
        topics: [
            'citizen responsibilities',
            'democratic process',
            'community service',
            'national symbols',
            'rights and duties',
            'social justice',
            'public participation'
        ],
        diagram: false
    },
    Default: {
        templates: [
            'For {year} {exam}, which outcome best describes {topic}?',
            'A {subject} question in {exam} covers {topic}. Choose the correct answer.'
        ],
        topics: ['a key concept', 'an exam-style problem', 'a subject skill'],
        diagram: false
    }
};

function renderQuestionForm(questions, exam, subject, year) {
    questionPanel.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    quizForm.innerHTML = '';
    document.getElementById('quiz-title').textContent = `${exam} ${subject} Past Questions (${year})`;

    questions.forEach((item, index) => {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = `Question ${index + 1}`;
        fieldset.appendChild(legend);

        const questionText = document.createElement('p');
        questionText.textContent = item.question;
        fieldset.appendChild(questionText);

        if (item.diagram) {
            const diagramWrapper = document.createElement('div');
            diagramWrapper.innerHTML = item.diagram;
            fieldset.appendChild(diagramWrapper);
        }

        item.options.forEach((optionText, optionIndex) => {
            const optionLabel = document.createElement('label');
            optionLabel.className = 'quiz-option';
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${index}`;
            optionInput.value = ['A', 'B', 'C', 'D'][optionIndex];
            optionInput.required = true;
            const optionSpan = document.createElement('span');
            optionSpan.textContent = `${['A', 'B', 'C', 'D'][optionIndex]}. ${optionText}`;
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionSpan);
            fieldset.appendChild(optionLabel);
        });

        quizForm.appendChild(fieldset);
    });
}

function handleSubmitAnswers(forceSubmit = false) {
    if (!currentQuestions.length) {
        return;
    }

    const answers = currentQuestions.map((_, index) => {
        const selected = document.querySelector(`input[name="question-${index}"]:checked`);
        return selected ? selected.value : null;
    });

    if (!forceSubmit && answers.some((value) => value === null)) {
        alert('Please answer all questions before submitting.');
        return;
    }

    const totalCorrect = currentQuestions.reduce((count, item, index) => {
        return count + (item.answer === answers[index] ? 1 : 0);
    }, 0);

    const score = Math.round((totalCorrect / currentQuestions.length) * 100);
    scoreText.textContent = `You scored ${score}% (${totalCorrect} out of ${currentQuestions.length}).`;
    resultDetails.innerHTML = currentQuestions
        .map((item, index) => {
            const selected = answers[index];
            const correct = item.answer;
            const status = selected === correct ? 'Correct' : 'Wrong';
            return `<p><strong>Question ${index + 1}:</strong> ${status}. Answer chosen: ${selected}. Correct answer: ${correct}.</p>`;
        })
        .join('');

    const exam = examSelect.value;
    const subject = subjectSelect.value;
    const year = yearSelect.value;
    recordQuizAttempt(score, exam, subject, year);
    updateLeagueTable(currentUser && currentUser.username);

    clearTimer();
    resultPanel.classList.remove('hidden');
    scrollToElement(resultPanel);
}

function resetQuiz() {
    questionPanel.classList.add('hidden');
    resultPanel.classList.add('hidden');
    quizForm.innerHTML = '';
    currentQuestions = [];
    clearTimer();
    timeRemaining = 0;
    updateTimerDisplay();
}

function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.handleLogin = handleLogin;
window.handleCreateAccount = handleCreateAccount;
window.toggleSignup = toggleSignup;

init();
