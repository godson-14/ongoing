const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

// In-memory storage for serverless environment
let users = [];
let activities = [];
let carts = [];
let purchases = [];
let books = [
  {
    id: 'p1',
    level: 'primary',
    title: 'Primary Maths Basics',
    author: 'A. Teacher',
    description: 'Clear lessons for young learners on numbers, counting, and early problem solving.',
    price: '₦800',
    content: 'Chapter 1: Counting with Confidence\nCounting helps us understand the world. Count the apples, toys, and animals around you.\n\nChapter 2: Adding and Subtracting\nAddition means joining groups. Subtraction means taking away. Use drawings and number lines to make it easy.\n\nChapter 3: Fun Shapes and Patterns\nShapes are all around us. Learn about circles, squares, triangles, and rectangles. Find repeating patterns in nature and art.'
  },
  {
    id: 'p2',
    level: 'primary',
    title: 'Primary English Storybook',
    author: 'B. Story',
    description: 'Reading and spelling practice with short stories and simple questions.',
    price: '₦750',
    content: 'Chapter 1: The Little Bird\nA little bird learned to sing. Each morning, she said hello to the sun and the flowers.\n\nChapter 2: Word Families and Sounds\nLearn words that share the same ending sounds: cat, hat, mat. Say them out loud and write them down.\n\nChapter 3: Reading and Comprehension\nRead short paragraphs and answer questions. Practice using new words in sentences.'
  },
  {
    id: 'p3',
    level: 'primary',
    title: 'Primary Science Starter',
    author: 'D. Explorer',
    description: 'A beginner science book for curious children with simple lessons on plants, animals, and weather.',
    price: '₦820',
    content: 'Chapter 1: Plants Around Us\nPlants need sunlight, water, and soil to grow. They make their own food using leaves.\n\nChapter 2: Animals and Their Homes\nAnimals live in homes called habitats. A bird builds a nest, a fish lives in water, and a rabbit digs a burrow.\n\nChapter 3: Weather and Seasons\nWeather can be sunny, rainy, or windy. Seasons change during the year, bringing different kinds of weather.'
  },
  {
    id: 's1',
    level: 'secondary',
    title: 'Secondary Biology Essentials',
    author: 'C. Scholar',
    description: 'A strong biology foundation for secondary students, covering cells, bodies, and the environment.',
    price: '₦1,200',
    content: 'Chapter 1: Cells - The Building Blocks of Life\nAll living organisms are made of cells. Plant cells have walls and chloroplasts, while animal cells have flexible membranes.\n\nChapter 2: Nutrition and Respiration\nPlants use photosynthesis to turn sunlight into food. Animals get energy from food through respiration, which uses oxygen.\n\nChapter 3: Ecosystems and Habitats\nAn ecosystem includes plants, animals, and the environment. Food chains show how energy moves from one organism to another.'
  },
  {
    id: 's2',
    level: 'secondary',
    title: 'Secondary Chemistry Basics',
    author: 'D. Chemist',
    description: 'Core chemistry concepts for secondary students with examples of elements, mixtures, and reactions.',
    price: '₦1,100',
    content: 'Chapter 1: Matter and Its States\nMatter can be solid, liquid, or gas. Solids keep their shape, liquids flow, and gases spread out.\n\nChapter 2: Elements, Compounds, and Mixtures\nElements are pure substances like oxygen and iron. Compounds are made when elements combine, such as water. Mixtures contain two or more substances mixed together.\n\nChapter 3: Chemical Reactions\nA chemical reaction changes substances into new ones. Burning, rusting, and digestion are examples of reactions.'
  },
  {
    id: 's3',
    level: 'secondary',
    title: 'Secondary Physics Foundations',
    author: 'E. Physicist',
    description: 'Basic physics for secondary learners, with lessons on motion, forces, and simple machines.',
    price: '₦1,150',
    content: 'Chapter 1: Motion and Speed\nMotion means an object is moving. Speed tells us how fast something goes.\n\nChapter 2: Forces and Energy\nA force can push or pull. Energy makes work possible. Gravity is a force that pulls objects toward Earth.\n\nChapter 3: Simple Machines\nLevers, pulleys, and wheels help us lift and move things more easily.'
  },
  {
    id: 't1',
    level: 'tertiary',
    title: 'Tertiary Computing Fundamentals',
    author: 'E. Lecturer',
    description: 'An introductory computing textbook for university students covering systems, programming, and networking.',
    price: '₦2,500',
    content: 'Chapter 1: Understanding Computer Systems\nA computer has hardware and software. The CPU processes instructions, memory stores information, and storage keeps files.\n\nChapter 2: Programming Concepts\nLearn about variables, control flow, functions, and data structures. Programming lets you tell the computer how to solve problems.\n\nChapter 3: Networks and the Internet\nComputers connect to share information. The internet is a network of networks. Learn how addresses, routers, and servers make it possible.'
  },
  {
    id: 't2',
    level: 'tertiary',
    title: 'Tertiary Biology and Genetics',
    author: 'F. Biologist',
    description: 'University-level biology concepts covering genetics, cells, and human systems.',
    price: '₦2,600',
    content: 'Chapter 1: DNA and Heredity\nDNA contains instructions for building living things. Traits pass from parents to children through genes.\n\nChapter 2: Plant and Animal Cells\nCells have organelles like the nucleus and mitochondria. Plant cells have chloroplasts for photosynthesis.\n\nChapter 3: Human Body Systems\nThe body uses systems like the circulatory, respiratory, and digestive systems to keep us alive.'
  },
  {
    id: 'y1',
    level: 'polytechnic',
    title: 'Polytechnic Engineering Workbook',
    author: 'G. Engineer',
    description: 'Practical engineering lessons in forces, materials, and applied design for polytechnic learners.',
    price: '₦2,000',
    content: 'Chapter 1: Forces and Motion\nEngineering uses forces to make things move or stay still. Learn about push, pull, weight, and friction, and how to draw diagrams.\n\nChapter 2: Materials and Strength\nDifferent materials behave differently. Metals are strong, plastics are flexible, and wood is lightweight. Choose the right material for the job.\n\nChapter 3: Design and Problem Solving\nGood engineering starts with a problem. Measure carefully, make a plan, and test your design with simple models.'
  },
  {
    id: 'y2',
    level: 'polytechnic',
    title: 'Polytechnic Business Skills',
    author: 'H. Consultant',
    description: 'Technical business lessons for polytechnic students about planning, finances, and customer service.',
    price: '₦1,900',
    content: 'Chapter 1: Starting a Small Business\nA strong business starts with a clear idea. Write a plan, know your customers, and set achievable goals.\n\nChapter 2: Managing Money\nTrack income and expenses carefully. Keep simple records, understand profit, and know how to price products.\n\nChapter 3: Customers and Service\nGood service keeps customers coming back. Learn how to communicate clearly and solve problems fast.'
  }
];

const exams = [
  {
    id: 'e1',
    level: 'primary',
    title: 'Primary Science Quiz',
    questions: [
      { question: 'Which of these is a plant?', options: ['Cat', 'Tree', 'Car', 'Dog'], answer: 'Tree' },
      { question: 'What does a seed need to grow?', options: ['Sunlight', 'Salt', 'Plastic', 'Noise'], answer: 'Sunlight' },
      { question: 'What shape has 4 equal sides?', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], answer: 'Square' },
      { question: 'Which season is rainy?', options: ['Winter', 'Summer', 'Rainy', 'Autumn'], answer: 'Rainy' }
    ]
  },
  {
    id: 'e2',
    level: 'secondary',
    title: 'Secondary Biology Exam',
    questions: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell wall'], answer: 'Mitochondria' },
      { question: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Dynamic Nucleotide Array', 'Digital Nucleic Acid', 'Deoxynuclear Acid'], answer: 'Deoxyribonucleic Acid' },
      { question: 'Which organ helps plants make food?', options: ['Root', 'Stem', 'Leaf', 'Flower'], answer: 'Leaf' },
      { question: 'Humans belong to which group?', options: ['Mammals', 'Reptiles', 'Birds', 'Amphibians'], answer: 'Mammals' }
    ]
  },
  {
    id: 'e3',
    level: 'secondary',
    title: 'Secondary Chemistry Exam',
    questions: [
      { question: 'What is water made of?', options: ['Oxygen only', 'Hydrogen only', 'Hydrogen and Oxygen', 'Carbon and Oxygen'], answer: 'Hydrogen and Oxygen' },
      { question: 'Which state of matter flows freely?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' },
      { question: 'What happens when iron rusts?', options: ['It melts', 'It changes colour', 'It becomes liquid', 'It disappears'], answer: 'It changes colour' },
      { question: 'A mixture of sand and water is called?', options: ['Solution', 'Compounds', 'Mixture', 'Element'], answer: 'Mixture' }
    ]
  },
  {
    id: 'e4',
    level: 'tertiary',
    title: 'Tertiary Computing Assessment',
    questions: [
      { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], answer: '2x' },
      { question: 'What is the solution to 2x - 6 = 0?', options: ['2', '3', '6', '0'], answer: '3' },
      { question: 'What is 3/4 of 20?', options: ['10', '12', '14', '15'], answer: '15' },
      { question: 'If a matrix A is 2x2, how many elements does it have?', options: ['2', '4', '6', '8'], answer: '4' }
    ]
  },
  {
    id: 'e5',
    level: 'tertiary',
    title: 'Tertiary Biology Assessment',
    questions: [
      { question: 'What is the function of DNA?', options: ['Store energy', 'Carry genetic information', 'Create heat', 'Make food'], answer: 'Carry genetic information' },
      { question: 'What organ system delivers oxygen to cells?', options: ['Digestive', 'Circulatory', 'Nervous', 'Skeletal'], answer: 'Circulatory' },
      { question: 'Photosynthesis takes place in which plant part?', options: ['Root', 'Stem', 'Leaf', 'Flower'], answer: 'Leaf' },
      { question: 'Which cell structure controls cell activities?', options: ['Nucleus', 'Cell membrane', 'Ribosome', 'Mitochondria'], answer: 'Nucleus' }
    ]
  },
  {
    id: 'e6',
    level: 'polytechnic',
    title: 'Polytechnic IT Challenge',
    questions: [
      { question: 'Which device stores data permanently?', options: ['RAM', 'ROM', 'SSD', 'CPU'], answer: 'SSD' },
      { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlink Text Management Language', 'Hyper Tool Markup Language'], answer: 'Hyper Text Markup Language' },
      { question: 'An operating system does which of the following?', options: ['Paints pictures', 'Runs applications', 'Prints books', 'Sells products'], answer: 'Runs applications' },
      { question: 'What is the purpose of a network router?', options: ['Store data', 'Send email', 'Route traffic', 'Make coffee'], answer: 'Route traffic' }
    ]
  }
];

app.use(express.json());

// Auth endpoints
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill every field.' });
  }
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already exists.' });
  }
  const user = { id: uuidv4(), name, email, password, createdAt: new Date().toISOString() };
  users.push(user);
  res.json({ success: true, message: 'Account created successfully.', user: { name: user.name, email: user.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  res.json({ success: true, message: 'Login successful.', user: { name: user.name, email: user.email } });
});

// Books endpoints
app.get('/api/books', (req, res) => {
  const level = (req.query.level || 'primary').toLowerCase();
  const levelBooks = books.filter((book) => book.level === level);
  res.json({ success: true, books: levelBooks });
});

app.post('/api/books', (req, res) => {
  const { title, author, level, description, price, content } = req.body;
  if (!title || !author || !level || !description || !price || !content) {
    return res.status(400).json({ success: false, message: 'All book fields are required.' });
  }
  const book = { id: uuidv4(), title, author, level: level.toLowerCase(), description, price, content };
  books.push(book);
  res.json({ success: true, book });
});

// Exams endpoint
app.get('/api/exams', (req, res) => {
  const level = (req.query.level || 'primary').toLowerCase();
  const levelExams = exams.filter((exam) => exam.level === level);
  res.json({ success: true, exams: levelExams });
});

// Activity endpoint
app.post('/api/activity', (req, res) => {
  const { email, action, detail } = req.body;
  if (!email || !action) {
    return res.status(400).json({ success: false, message: 'Email and action are required.' });
  }
  activities.push({ id: uuidv4(), email, action, detail, timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Activity saved.' });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
  const userCart = carts.find((item) => item.email.toLowerCase() === email.toLowerCase());
  res.json({ success: true, cart: (userCart && userCart.items) || [] });
});

app.post('/api/cart', (req, res) => {
  const { email, book } = req.body;
  if (!email || !book || !book.id) {
    return res.status(400).json({ success: false, message: 'Email and book are required.' });
  }
  let userCart = carts.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!userCart) {
    userCart = { email, items: [] };
    carts.push(userCart);
  }
  const exists = userCart.items.find((item) => item.id === book.id);
  if (exists) {
    return res.json({ success: true, message: 'Book already in cart.', cart: userCart.items });
  }
  userCart.items.push(book);
  res.json({ success: true, message: 'Book added to cart.', cart: userCart.items });
});

app.post('/api/cart/remove', (req, res) => {
  const { email, bookId } = req.body;
  if (!email || !bookId) {
    return res.status(400).json({ success: false, message: 'Email and bookId are required.' });
  }
  const userCart = carts.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!userCart) {
    return res.status(404).json({ success: false, message: 'Cart not found.' });
  }
  userCart.items = userCart.items.filter((item) => item.id !== bookId);
  res.json({ success: true, message: 'Book removed from cart.', cart: userCart.items });
});

// Checkout endpoint
app.post('/api/checkout', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required to checkout.' });
  const userCart = carts.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!userCart || !userCart.items.length) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }
  const purchase = {
    id: uuidv4(),
    email,
    items: userCart.items,
    total: userCart.items.reduce((sum, item) => sum + Number(item.price.replace(/[^0-9]/g, '')), 0),
    createdAt: new Date().toISOString()
  };
  purchases.push(purchase);
  userCart.items = [];
  activities.push({ id: uuidv4(), email, action: 'Checkout completed', detail: `Purchased ${purchase.items.length} items`, timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Checkout successful.', purchase });
});

// Purchases endpoint
app.get('/api/purchases', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
  const userPurchases = purchases.filter((item) => item.email.toLowerCase() === email.toLowerCase());
  res.json({ success: true, purchases: userPurchases });
});

// Activities endpoint
app.get('/api/activities', (req, res) => {
  const email = req.query.email;
  const userActivities = email ? activities.filter((item) => item.email.toLowerCase() === email.toLowerCase()) : activities;
  res.json({ success: true, activities: userActivities });
});

module.exports = app;
