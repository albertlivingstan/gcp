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
    { id: 1, title: 'Module 1 - Introduction to System Software', url: 'https://docs.google.com/presentation/d/1L8DunCwAcIn1yx5OgtPWNuwxRG0NrNa1/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 2, title: 'Module 1 - Macro Processors', url: 'https://docs.google.com/presentation/d/165a4D9dqQqd3C-k4kiFyT6ZN-m81-fAT/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 3, title: 'Module 1 - Loaders and Linkers', url: 'https://docs.google.com/presentation/d/1eGZ_lu6UBb5Y71C9pWfPd7KCIlcy_Dwe/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 4, title: 'Module 2 Compiler Structure', url: 'https://docs.google.com/presentation/d/1lUAjpC9UEo1LFOB-v12_nPFx_E1o3lcP/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 5, title: 'Module 2 Role of Lexical Analysis and Input Buffering', url: 'https://docs.google.com/presentation/d/1OpNsvDBXQlF3IHU2khic_eBLj9uY2HtD/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 6, title: 'Module 2 - DFA', url: 'https://docs.google.com/presentation/d/1pflsEAR7RdI0xQfKr9iTkf0EOLjGQfBW/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 7, title: 'Module 2 - Lex', url: 'https://docs.google.com/presentation/d/1zHnwJsTLPtWtg9_b0P4WqNlEwo1L8BkE/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 8, title: 'Module 3 - Syntax Analysis_Top Down Parsing', url: 'https://docs.google.com/presentation/d/1fifm4gzaF0NGrsOPqbZI8lcX2BBbZL9A/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 9, title: 'Syntax Analysis_Bottom Up Parsing', url: 'https://docs.google.com/presentation/d/19qjyY5WhX2UZrPgFVsKSA5Zz2792JScO/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 10, title: 'Module 4 - SDD', url: 'https://docs.google.com/presentation/d/10K0jg4cp7mPAvkhgWGK1hCiSc-XiRGL1/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 11, title: 'Module 4 - Run Time Environment', url: 'https://docs.google.com/presentation/d/1AzGuowNaGYX91b5x29h6cm5u66DC-rbR/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 12, title: 'Module 5 - Type and Declarations', url: 'https://docs.google.com/presentation/d/1pVRpVA9suLmeNNVdEwBoJSbWMNcccqaX/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 13, title: 'Module 5 - Control Flow', url: 'https://docs.google.com/presentation/d/1myemnPtWaqowGefD9iGdfKDRwz2omukh/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 14, title: 'Module 5 - Issues in the design, Basic blocks and Flow graphs', url: 'https://docs.google.com/presentation/d/1etJcLrsN_Huat2wM1CW_6LMx4QFrWKmv/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 15, title: 'Module 6 - Basic Blocks', url: 'https://docs.google.com/presentation/d/1Xtw8CSbKjewEI30J92J6VMpoaR2jCBbn/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 16, title: 'Module 6 - Peephole Optimization', url: 'https://docs.google.com/presentation/d/17Oduu62HOO0yw4eecPzhgcT9EvYRGtMc/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 17, title: 'Module 6. Principal Sources of Optimization', url: 'https://docs.google.com/presentation/d/1TtgafP69s5eDlM09zlF3vgJg5vZ3H9PV/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 18, title: 'Module 6 - Machine Dependent Optimization', url: 'https://docs.google.com/presentation/d/1l0L4SwPp7S0Vps0yq0n7EVRpdMxWyw0s/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 19, title: 'Module 6 - Principal Sources of Optimization', url: 'https://docs.google.com/presentation/d/1PEAEzWwXOV_ASt-YdoRE3AizlIyLyeAD/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' }


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
