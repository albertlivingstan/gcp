export const EMAIL_SCENARIOS = [
  { value: 'casual_leave', label: '🏖️ Casual Leave Request', prompt: 'Write a professional email to my manager requesting one day of casual leave on 25th July 2026 because of a family function. Assure that I will complete all pending work before my leave.' },
  { value: 'sick_leave', label: '🤒 Sick Leave Request', prompt: 'Write a polite email to my manager requesting two days of sick leave because I have a fever. Mention that I will submit a medical certificate if required.' },
  { value: 'wfh', label: '⏰ Work From Home Request', prompt: 'Write an email requesting permission to work from home for one day due to heavy rain and transportation issues. Mention that I have a stable internet connection and will be available throughout the day.' },
  { value: 'meeting', label: '📅 Schedule a Meeting', prompt: 'Write an email requesting a 30-minute meeting with my manager to discuss the progress of Project Alpha and clarify the next milestones.' },
  { value: 'status', label: '📋 Weekly Project Status Update', prompt: 'Write a weekly status update email to my team lead. Mention that I completed the login module, fixed three bugs, started the dashboard development, and plan to finish it next week.' },
  { value: 'task_done', label: '📂 Task Completed', prompt: 'Write an email informing my manager that I have completed the assigned database optimization task before the deadline. Ask them to review my work and share any feedback.' },
  { value: 'help', label: '❓ Request for Assistance', prompt: 'Write an email to a senior developer asking for help in resolving an API integration issue that is blocking my assigned task.' },
  { value: 'docs', label: '📎 Submission of Documents', prompt: 'Write an email to HR informing them that I have attached my PAN card, Aadhaar card, and bank account details for employee verification.' },
  { value: 'expense', label: '🧾 Expense Reimbursement', prompt: 'Write an email requesting reimbursement for travel expenses incurred during an official client visit. Mention that all bills are attached.' },
  { value: 'laptop', label: '💻 Laptop Issue', prompt: 'Write an email to the IT support team explaining that my office laptop frequently freezes and restarts automatically. Request immediate assistance.' },
  { value: 'password', label: '🔑 Password Reset', prompt: 'Write an email requesting the IT department to reset my email account password because I am unable to log in despite multiple attempts.' },
  { value: 'leave_balance', label: '👥 Leave Balance Inquiry', prompt: 'Write an email to HR asking for my current casual leave and earned leave balance before planning my vacation.' },
  { value: 'salary', label: '💰 Salary Clarification', prompt: 'Write an email to the payroll team asking why my overtime allowance was not included in this month’s salary.' },
  { value: 'training', label: '📚 Training Program', prompt: 'Write an email requesting approval to attend a two-day Java Full Stack Development training program. Mention how it will benefit my current role.' },
  { value: 'team_update', label: '📢 Team Update', prompt: 'Write an email updating the team that our project milestone has been completed successfully and thanking everyone for their contributions.' },
  { value: 'thank_you', label: '🙏 Thank You', prompt: 'Write a thank-you email to my manager for guiding me throughout my first project and helping me improve my technical skills.' },
  { value: 'intro', label: '🤝 New Team Member', prompt: 'Write a professional introduction email introducing myself as a new software engineer joining the team. Briefly mention my educational background and enthusiasm to work with the team.' },
  { value: 'resign', label: '📝 Resignation Notice', prompt: 'Write a professional resignation email informing my manager that I am resigning from my position due to higher education opportunities. Mention my last working day and thank the company.' },
  { value: 'congrats', label: '🎉 Congratulations', prompt: 'Write a warm congratulatory email to my colleague for being promoted to Team Lead. Appreciate their hard work and wish them success.' },
  { value: 'followup', label: '🔄 Follow-up Email', prompt: 'Write a polite follow-up email regarding my previous email about the software license approval, as I have not yet received a response.' },
];

export const PASSAGE_RECALL_DATA = [
  `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. Leading AI textbooks define the field as the study of "intelligent agents": any system that perceives its environment and takes actions that maximize its chance of achieving its goals. Some popular accounts use the term "artificial intelligence" to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving", however this definition is rejected by major AI researchers.`,
  `The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system.`,
  `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. Some of this chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water – hence the name photosynthesis, from the Greek phōs, "light", and synthesis, "putting together".`
];

export const MOCK_MCQ_QUESTIONS_BY_TOPIC = {
  'Averages': [
    {
      id: 1,
      question: "Average weight of students of class A is 40 kg and that of class B is 45 kg. Find the average weight of students of both the classes put together.",
      options: ["42.5 kg", "42 kg", "43 kg", "Cannot be determined"],
      correctAnswer: 3
    },
    {
      id: 5,
      question: "What is the average of the series 11, 22, 33, …, 1100?",
      options: ["550", "555.5", "560", "565"],
      correctAnswer: 1
    },
    {
      id: 10,
      question: "The average weight of 11 children is 11 kg. The average weight of the first five children is 9 kg, whereas the average weight of the last five children is 13 kg. What is the weight of the sixth child?",
      options: ["9 kg", "10 kg", "11 kg", "12 kg"],
      correctAnswer: 2
    }
  ],
  'Ratio & Proportion': [
    {
      id: 2,
      question: "Abishek and Baskar together invested Rs.20,000 in a business. The ratio of their investments was 3 : 2. At the end of the year, a total profit of Rs.3000 was generated. Find their shares of profit.",
      options: ["Rs.1800, Rs.1200", "Rs.1500, Rs.1500", "Rs.2000, Rs.1000", "Rs.1200, Rs.1800"],
      correctAnswer: 0
    },
    {
      id: 7,
      question: "In what ratio must a grocer mix two varieties of wheat costing Rs.16/kg and Rs.18.5/kg respectively, so as to get a mixture worth Rs.17/kg?",
      options: ["3:2", "2:3", "1:2", "2:1"],
      correctAnswer: 0
    },
    {
      id: 8,
      question: "2 litres of bottle A (with 20% salt solution) is mixed with an unknown quantity of bottle B (with 40% salt solution) such that the mixture has 30% salt solution. How many litres of salt solution from bottle B was mixed with bottle A?",
      options: ["1L", "2L", "3L", "4L"],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "Two solutions with acid concentrations of 20% and 30% are mixed in the ratio of 1 : 2 respectively. What will be the acid concentration in the resultant mixture?",
      options: ["25%", "26.66%", "28%", "30%"],
      correctAnswer: 1
    }
  ],
  'Profit & Loss': [
    {
      id: 3,
      question: "A book worth Rs.300 is sold for Rs.200. What is the loss percentage?",
      options: ["20%", "25%", "30%", "33.33%"],
      correctAnswer: 3
    },
    {
      id: 4,
      question: "Two pen drives are bought for Rs.1000 each. One of them is sold at a profit of 10%, while the other is sold at a loss of 10%. What is the overall profit/loss percentage in the entire transaction?",
      options: ["1% loss", "1% profit", "No profit no loss", "2% loss"],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "A dishonest shopkeeper professes to sell his goods at cost price, but he gives only 750 g instead of 1000 g. What is his profit percentage?",
      options: ["25%", "30%", "33.33%", "50%"],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "Varun started a business by investing Rs.1,00,000. Six months later, Vikram joined him with a capital of Rs.50,000. If at the end of the year, the total profit is Rs.50,000, then what is Varun's share of profit?",
      options: ["Rs.25,000", "Rs.30,000", "Rs.40,000", "Rs.10,000"],
      correctAnswer: 2
    },
    {
      id: 11,
      question: "Two cars are sold at Rs.5 lakhs each such that a profit of 20% was made on the first car, while a loss of 20% was incurred on the other. What would be the net profit/loss on the two transactions?",
      options: ["4% profit", "4% loss", "No profit no loss", "2% loss"],
      correctAnswer: 1
    },
    {
      id: 12,
      question: "If a watch is sold at Rs.X, the profit is 10%. If the price is reduced by Rs.110, the loss is 10%. Find the cost price of the watch.",
      options: ["Rs.500", "Rs.550", "Rs.600", "Rs.650"],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "If the Selling Price (S.P.) of 8 articles is the same as the Cost Price (C.P.) of 6 articles, find the gain/loss percentage.",
      options: ["20% profit", "25% profit", "20% loss", "25% loss"],
      correctAnswer: 3
    },
    {
      id: 14,
      question: "If an article worth Rs.50 is sold at a profit of 150%, what is the selling price?",
      options: ["Rs.100", "Rs.125", "Rs.150", "Rs.200"],
      correctAnswer: 1
    }
  ]
};

// Fallback questions if a topic doesn't have specific ones yet
export const DEFAULT_MCQ_QUESTIONS = [
  {
    id: 101,
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctAnswer: 3
  },
  {
    id: 102,
    question: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?",
    options: ["4 years", "8 years", "10 years", "None of these"],
    correctAnswer: 0
  }
];

export const getQuestionsForTopic = (topicName) => {
  return MOCK_MCQ_QUESTIONS_BY_TOPIC[topicName] || DEFAULT_MCQ_QUESTIONS;
};
