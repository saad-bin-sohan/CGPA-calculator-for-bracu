export interface CourseDefinition {
  code: string;
  title: string;
  credits: number;
  category: 'Core' | 'Elective' | 'GED';
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
}

export interface SemesterPlanEntry {
  termName: string;
  courseCodes: string[]; // references to CourseDefinition.code values
}

export const CSE_COURSES: CourseDefinition[] = [
  // ── MANDATORY (Core) ─────────────────────────────────────
  { code: 'CSE101',  title: 'Computer Fundamentals',                        credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE110',  title: 'Programming Language I',                       credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE111',  title: 'Programming Language II',                      credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE220',  title: 'Data Structures',                              credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE221',  title: 'Algorithms',                                   credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE230',  title: 'Digital Logic Design',                         credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE250',  title: 'Discrete Mathematics',                         credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE251',  title: 'Probability and Statistics for Engineers',      credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE260',  title: 'Computer Organization and Architecture',        credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE310',  title: 'Microprocessors and Microcontrollers',          credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE320',  title: 'Design and Analysis of Algorithms',             credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE321',  title: 'Operating Systems',                             credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE330',  title: 'Numerical Methods',                             credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE331',  title: 'Computer Graphics',                             credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE340',  title: 'Database Systems',                              credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE341',  title: 'Theory of Computation',                        credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE342',  title: 'Computer Networks',                             credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE350',  title: 'Software Engineering',                          credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE360',  title: 'Artificial Intelligence',                       credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE370',  title: 'Digital Signal Processing',                     credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE371',  title: 'Machine Learning',                              credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE390',  title: 'Technical Writing and Professional Ethics',     credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE391',  title: 'Internship',                                    credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE392',  title: 'Project Work',                                  credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE410',  title: 'Computer and Network Security',                 credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE419',  title: 'Special Topics in CSE',                        credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE420',  title: 'Compiler Design',                               credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE421',  title: 'Distributed Systems',                           credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE422',  title: 'Simulation and Modeling',                       credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE423',  title: 'VLSI Design',                                   credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE424',  title: 'Natural Language Processing',                   credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE425',  title: 'Computer Vision',                               credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE426',  title: 'Data Mining',                                   credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE427',  title: 'Bioinformatics',                                credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE428',  title: 'Software Testing and Quality Assurance',        credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE429',  title: 'Game Development',                              credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE430',  title: 'Information Retrieval',                         credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE431',  title: 'Cloud Computing',                               credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE432',  title: 'Internet of Things',                            credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE460',  title: 'Thesis Part I',                                 credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE461',  title: 'Thesis Part II',                                credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE462',  title: 'Senior Design Project',                         credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE470',  title: 'Human Computer Interaction',                    credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE471',  title: 'Mobile Application Development',                credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE472',  title: 'Computer Ethics and Society',                   credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE473',  title: 'Entrepreneurship for Engineers',                credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE474',  title: 'Technology Management',                         credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE490',  title: 'Capstone Project',                              credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE491',  title: 'Capstone Project II',                           credits: 3, category: 'Core',     countsTowardsCGPA: true, countsTowardsCredits: true },

  // ── ELECTIVES ────────────────────────────────────────────
  { code: 'CSE402',  title: 'Advanced Topics in Programming',               credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE437',  title: 'Multimedia Systems',                            credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE440',  title: 'Advanced Database Systems',                     credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE443',  title: 'Network Programming',                           credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE446',  title: 'Embedded Systems',                              credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE447',  title: 'Digital Image Processing',                      credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE449',  title: 'Advanced Machine Learning',                     credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE463',  title: 'Cybersecurity and Ethical Hacking',             credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE481',  title: 'Advanced Computer Networks',                    credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE489',  title: 'Special Topics in Computing',                   credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE490A', title: 'Capstone Project A',                            credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE490B', title: 'Capstone Project B',                            credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
  { code: 'CSE490D', title: 'Capstone Project D',                            credits: 3, category: 'Elective', countsTowardsCGPA: true, countsTowardsCredits: true },
];

export const CSE_SEMESTER_PLAN: SemesterPlanEntry[] = [
  {
    termName: 'Semester 1',
    courseCodes: ['CSE101', 'CSE110', 'CSE111']
  },
  {
    termName: 'Semester 2',
    courseCodes: ['CSE220', 'CSE221', 'CSE230']
  },
  {
    termName: 'Semester 3',
    courseCodes: ['CSE250', 'CSE251', 'CSE260']
  },
  {
    termName: 'Semester 4',
    courseCodes: ['CSE310', 'CSE320', 'CSE321', 'CSE330']
  },
  {
    termName: 'Semester 5',
    courseCodes: ['CSE331', 'CSE340', 'CSE341', 'CSE342']
  },
  {
    termName: 'Semester 6',
    courseCodes: ['CSE350', 'CSE360', 'CSE370', 'CSE371']
  },
  {
    termName: 'Semester 7',
    courseCodes: ['CSE390', 'CSE391', 'CSE392']
  },
  {
    termName: 'Semester 8',
    courseCodes: ['CSE410', 'CSE419', 'CSE420', 'CSE421', 'CSE422']
  },
  {
    termName: 'Semester 9',
    courseCodes: ['CSE423', 'CSE424', 'CSE425', 'CSE426']
  },
  {
    termName: 'Semester 10',
    courseCodes: ['CSE427', 'CSE428', 'CSE429', 'CSE430', 'CSE431']
  },
  {
    termName: 'Semester 11',
    courseCodes: ['CSE432', 'CSE460', 'CSE461', 'CSE462', 'CSE470']
  },
  {
    termName: 'Semester 12',
    courseCodes: ['CSE471', 'CSE472', 'CSE473', 'CSE474', 'CSE490', 'CSE491']
  },
];
