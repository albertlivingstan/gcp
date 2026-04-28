export const subjects = [
  {
    id: 'system-software',
    title: 'System Software and Compiler Design',
    color: 'bg-blue-500',
    description: 'Learn about assemblers, loaders, linkers, macro processors, and the phases of a compiler.',
    icon: 'Cpu'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Techniques',
    color: 'bg-purple-500',
    description: 'Explore algorithms that allow computers to learn from and make predictions based on data.',
    icon: 'Brain'
  },
  {
    id: 'devops',
    title: 'DevOps',
    color: 'bg-green-500',
    description: 'Practices that combine software development and IT operations to shorten the development lifecycle.',
    icon: 'Infinity'
  },
  {
    id: 'cryptography',
    title: 'Cryptography and Network Security',
    color: 'bg-red-500',
    description: 'Techniques for secure communication in the presence of adversarial behavior.',
    icon: 'Lock'
  },
  {
    id: 'distributed-computing',
    title: 'Distributed Computing',
    color: 'bg-orange-500',
    description: 'Study of distributed systems where components located on networked computers communicate.',
    icon: 'Network'
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    color: 'bg-teal-500',
    description: 'Interactions between computers and human language, in particular how to process large amounts of natural language data.',
    icon: 'MessageSquare'
  }
];

export const mockPPTs = {
  'system-software': [
    { id: 1, title: 'Introduction to Compilers', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock1/embed?start=false&loop=false&delayms=3000' }
  ],
  'machine-learning': [
    { id: 2, title: 'Supervised Learning', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock2/embed?start=false&loop=false&delayms=3000' }
  ],
  'devops': [
    { id: 3, title: 'CI/CD Pipelines', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock3/embed?start=false&loop=false&delayms=3000' }
  ],
  'cryptography': [
    { id: 4, title: 'Public Key Infrastructure', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock4/embed?start=false&loop=false&delayms=3000' }
  ],
  'distributed-computing': [
    { id: 5, title: 'MapReduce & Hadoop', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock5/embed?start=false&loop=false&delayms=3000' }
  ],
  'nlp': [
    { id: 6, title: 'Transformers & Attention', url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-mock6/embed?start=false&loop=false&delayms=3000' }
  ]
};

export const mockBigQuestions = {
  'system-software': [
    'Explain the phases of a compiler with a neat diagram.',
    'Differentiate between top-down and bottom-up parsing.'
  ],
  'machine-learning': [
    'Explain Support Vector Machines and the kernel trick.',
    'Describe the backpropagation algorithm in neural networks.'
  ],
  'devops': [
    'What is a CI/CD pipeline? Explain with an example.',
    'Compare Docker and Virtual Machines.'
  ],
  'cryptography': [
    'Explain the RSA algorithm with an example.',
    'What are digital signatures? How do they provide authentication?'
  ],
  'distributed-computing': [
    'Explain the bully election algorithm.',
    'Describe the architecture of Hadoop Distributed File System (HDFS).'
  ],
  'nlp': [
    'Explain the architecture of the Transformer model.',
    'What is Word2Vec? Explain CBOW and Skip-gram models.'
  ]
};
