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
    { id: 1, title: 'Module 1 - Introduction to System Software', url: 'https://docs.google.com/presentation/d/1LAK9KTfF-BOKJO6mV1pg-ZurXVKfa1bs/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 2, title: 'Module 1 - Macro Processors', url: 'https://docs.google.com/presentation/d/1vFbgMJseJvos8Welgphso--FUBQ69Rct/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 3, title: 'Module 1 - Loaders and Linkers', url: 'https://docs.google.com/presentation/d/1J-JeyL_cHrVWm42qgFEIfn5UKqC82jTD/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 4, title: 'Module 2 Compiler Structure', url: 'https://docs.google.com/presentation/d/1IZxNQZ5gt0zR99lJF6HljRZjA6mZ-eb7/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 5, title: 'Module 2 Role of Lexical Analysis and Input Buffering', url: 'https://docs.google.com/presentation/d/11V-Uh9A5LGhF4pl3v97eoO1r1Lje1QlF/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 6, title: 'Module 2 - DFA', url: 'https://docs.google.com/presentation/d/1reOI3ucdIizVnc-i31NamFypxj8Svemi/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 7, title: 'Module 2 - Lex', url: 'https://docs.google.com/presentation/d/1UXcpf1nw7RpOHrp0TK2vkdTaXAyUce8x/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 8, title: 'Module 3 - Syntax Analysis_Top Down Parsing', url: 'https://docs.google.com/presentation/d/1Pb3-DB15tgXwdjrzBWn-685GwLuYxKUv/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 9, title: 'Syntax Analysis_Bottom Up Parsing', url: 'https://docs.google.com/presentation/d/1btqQgyBVQnquJI7lyGzOqoJckge1PKtU/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 10, title: 'Module 4 - SDD', url: 'https://docs.google.com/presentation/d/1e8G9y10rN186OPK7WnTtRbgFtm7SWpp4/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 11, title: 'Module 4 - Run Time Environment', url: 'https://docs.google.com/presentation/d/1-Cb3t3nVVMGhUl185PVFjGxmjGjlHCIz/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 12, title: 'Module 5 - Type and Declarations', url: 'https://docs.google.com/presentation/d/110MStj3yFKemdnViSJkL98Vz1ZLij3Bh/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 13, title: 'Module 5 - Control Flow', url: 'https://docs.google.com/presentation/d/1YRwsBLK43Buk4vTbzFozg1V7jxdVlMN0/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 14, title: 'Module 5 - Issues in the design, Basic blocks and Flow graphs', url: 'https://docs.google.com/presentation/d/18rWOM7IKG299Rd_BXhk56wlIVUmEBN3C/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 15, title: 'Module 6 - Basic Blocks', url: 'https://docs.google.com/presentation/d/1mCsujt_ydznUGlb9xRPSnzNHBtt3gZU-/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 16, title: 'Module 6 - Peephole Optimization', url: 'https://docs.google.com/presentation/d/1_uzy07yRPsp_58dg8lZVBUBQ4EbJVGUi/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 17, title: 'Module 6. Principal Sources of Optimization', url: 'https://docs.google.com/presentation/d/1bkDQ6eYu-2Kpy4qAAua_rAxrZLDACJ3t/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 18, title: 'Module 6 - Machine Dependent Optimization', url: 'https://docs.google.com/presentation/d/1Xe7JF0il0jxHjgUzRPtZyuYuFoLdPH2R/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' },
    { id: 19, title: 'Module 6 - Principal Sources of Optimization', url: 'https://docs.google.com/presentation/d/1O_CXk5E_pxJR47A6BnSGX7mvyo2rNDlI/edit?usp=sharing&ouid=115633142695649252380&rtpof=true&sd=true' }


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
