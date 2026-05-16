export type QuestionType = 'mc' | 'open'

export interface Question {
  id: number
  section: 1 | 2 | 3
  text: string
  type: QuestionType
  options?: { value: string; label: string }[]
  maxLength?: number
}

export const questions: Question[] = [
  // === SECTION 1: AI Fundamentals ===
  {
    id: 1, section: 1, type: 'mc',
    text: 'What does "LLM" stand for in the context of AI?',
    options: [
      { value: 'A', label: 'Large Language Model' },
      { value: 'B', label: 'Linear Learning Machine' },
      { value: 'C', label: 'Logical Logic Module' },
      { value: 'D', label: 'Language Learning Memory' },
    ],
  },
  {
    id: 2, section: 1, type: 'mc',
    text: 'Which of the following best describes "prompt engineering"?',
    options: [
      { value: 'A', label: 'Writing code for AI systems' },
      { value: 'B', label: 'Crafting instructions to get optimal outputs from an AI model' },
      { value: 'C', label: 'Training AI models from scratch' },
      { value: 'D', label: 'Testing AI performance metrics in production' },
    ],
  },
  {
    id: 3, section: 1, type: 'mc',
    text: 'What is "hallucination" in the context of AI?',
    options: [
      { value: 'A', label: 'A feature that enables visual AI generation' },
      { value: 'B', label: 'When an AI generates confidently stated but factually incorrect information' },
      { value: 'C', label: 'An AI security vulnerability exploited by hackers' },
      { value: 'D', label: "The AI model's creative writing mode" },
    ],
  },
  {
    id: 4, section: 1, type: 'mc',
    text: 'Which AI capability allows a model to process both text and images?',
    options: [
      { value: 'A', label: 'Multimodal AI' },
      { value: 'B', label: 'Transfer learning' },
      { value: 'C', label: 'Federated learning' },
      { value: 'D', label: 'Reinforcement learning' },
    ],
  },
  {
    id: 5, section: 1, type: 'mc',
    text: 'What is RAG (Retrieval-Augmented Generation)?',
    options: [
      { value: 'A', label: 'A type of specialized AI hardware' },
      { value: 'B', label: 'A technique combining AI generation with real-time data retrieval' },
      { value: 'C', label: 'A programming language for building AI apps' },
      { value: 'D', label: 'A method for training models with limited data' },
    ],
  },
  {
    id: 6, section: 1, type: 'mc',
    text: 'What does "context window" refer to in large language models?',
    options: [
      { value: 'A', label: 'The graphical interface of an AI application' },
      { value: 'B', label: 'The maximum amount of text an AI can process in a single interaction' },
      { value: 'C', label: "The AI's average response latency" },
      { value: 'D', label: 'A display feature in AI developer tools' },
    ],
  },
  {
    id: 7, section: 1, type: 'mc',
    text: 'Which of the following is the best example of generative AI?',
    options: [
      { value: 'A', label: 'A spam email filter' },
      { value: 'B', label: 'A Netflix recommendation engine' },
      { value: 'C', label: 'A tool that writes marketing copy from a brief' },
      { value: 'D', label: 'A real-time fraud detection system' },
    ],
  },
  {
    id: 8, section: 1, type: 'mc',
    text: 'What is "fine-tuning" in the context of AI models?',
    options: [
      { value: 'A', label: "Adjusting the speed of an AI's responses" },
      { value: 'B', label: 'Further training a pre-built model on domain-specific data' },
      { value: 'C', label: 'Compressing an AI model to reduce its file size' },
      { value: 'D', label: 'Optimizing the hardware running an AI model' },
    ],
  },
  {
    id: 9, section: 1, type: 'mc',
    text: 'Which best describes "AI agents"?',
    options: [
      { value: 'A', label: 'Human operators who manage AI systems' },
      { value: 'B', label: 'AI systems that autonomously take multi-step actions to complete goals' },
      { value: 'C', label: 'AI models specialized in customer service' },
      { value: 'D', label: 'Dedicated hardware processors for AI workloads' },
    ],
  },
  {
    id: 10, section: 1, type: 'mc',
    text: 'What is the primary difference between AI and traditional software?',
    options: [
      { value: 'A', label: 'AI always requires an internet connection' },
      { value: 'B', label: 'AI learns patterns from data rather than following explicitly programmed rules' },
      { value: 'C', label: 'AI is always faster than traditional software' },
      { value: 'D', label: 'AI can only process text-based data' },
    ],
  },
  // === SECTION 2: AI Application & Business Thinking ===
  {
    id: 11, section: 2, type: 'mc',
    text: 'Which is the most appropriate use of AI in a financial services company?',
    options: [
      { value: 'A', label: 'Making final investment decisions autonomously without human oversight' },
      { value: 'B', label: 'Generating first-draft compliance summaries for human review and approval' },
      { value: 'C', label: 'Replacing all customer service agents to reduce headcount' },
      { value: 'D', label: 'Automatically adjusting interest rates in real time' },
    ],
  },
  {
    id: 12, section: 2, type: 'mc',
    text: 'What is "AI governance" in an enterprise context?',
    options: [
      { value: 'A', label: 'Government regulations that control AI companies' },
      { value: 'B', label: 'Policies and processes ensuring AI is used responsibly within an organization' },
      { value: 'C', label: 'The organizational chart of an AI development team' },
      { value: 'D', label: 'A mandatory security audit procedure for AI tools' },
    ],
  },
  {
    id: 13, section: 2, type: 'mc',
    text: 'When considering AI adoption, which risk should typically be prioritized first?',
    options: [
      { value: 'A', label: 'AI displacing all employees over time' },
      { value: 'B', label: 'Data privacy, confidentiality, and regulatory compliance' },
      { value: 'C', label: 'High upfront implementation costs' },
      { value: 'D', label: 'Resistance from employees unfamiliar with technology' },
    ],
  },
  {
    id: 14, section: 2, type: 'mc',
    text: 'What is the most effective approach to measuring AI ROI in a business?',
    options: [
      { value: 'A', label: 'Count the number of AI tools subscribed to or purchased' },
      { value: 'B', label: 'Compare time and cost savings against implementation and ongoing costs' },
      { value: 'C', label: 'Measure by how many employees log into AI tools daily' },
      { value: 'D', label: 'Track vendor customer satisfaction scores' },
    ],
  },
  {
    id: 15, section: 2, type: 'mc',
    text: 'Which statement best describes "responsible AI"?',
    options: [
      { value: 'A', label: 'AI systems guaranteed to never produce errors' },
      { value: 'B', label: 'AI developed and deployed in ways that are fair, transparent, and accountable' },
      { value: 'C', label: 'AI systems that automatically comply with all laws' },
      { value: 'D', label: 'AI with the highest available security configurations' },
    ],
  },
  {
    id: 16, section: 2, type: 'mc',
    text: 'A trading desk wants to use AI for real-time market analysis. What is the MOST important consideration?',
    options: [
      { value: 'A', label: 'Selecting the most recently released AI model available' },
      { value: 'B', label: 'Ensuring AI outputs are reviewed and validated by human analysts before acting' },
      { value: 'C', label: 'Minimizing the total cost of AI implementation' },
      { value: 'D', label: 'Maximizing the processing speed of AI inference' },
    ],
  },
  {
    id: 17, section: 2, type: 'mc',
    text: 'What does "AI democratization" mean in a business context?',
    options: [
      { value: 'A', label: 'Using AI to flatten organizational hierarchies' },
      { value: 'B', label: 'Making AI tools and capabilities accessible to non-technical business users' },
      { value: 'C', label: 'Open-sourcing all proprietary AI models' },
      { value: 'D', label: 'Reducing AI subscription costs across the industry' },
    ],
  },
  {
    id: 18, section: 2, type: 'mc',
    text: 'Which approach best describes effective human-AI collaboration?',
    options: [
      { value: 'A', label: 'Humans review, validate, and take ownership of AI-generated outputs' },
      { value: 'B', label: 'AI makes all decisions; humans serve as passive monitors' },
      { value: 'C', label: 'AI handles only simple, repetitive tasks with no human review needed' },
      { value: 'D', label: 'Humans and AI work in completely separate silos with no overlap' },
    ],
  },
  {
    id: 19, section: 2, type: 'mc',
    text: 'When should an employee escalate an AI-generated output to a supervisor?',
    options: [
      { value: 'A', label: 'Never — modern AI is reliable enough to trust without escalation' },
      { value: 'B', label: 'When the output involves high-stakes decisions, unusual results, or potential compliance issues' },
      { value: 'C', label: 'Only when the AI model itself recommends escalation' },
      { value: 'D', label: 'Only for calculations involving financial figures above a set threshold' },
    ],
  },
  {
    id: 20, section: 2, type: 'mc',
    text: 'What does "AI literacy" mean for a non-technical employee?',
    options: [
      { value: 'A', label: 'The ability to write, train, and deploy AI models from code' },
      { value: 'B', label: "Understanding AI's capabilities, limitations, and appropriate use cases to work with it effectively" },
      { value: 'C', label: 'Successfully completing a recognized AI certification course' },
      { value: 'D', label: 'Actively using at least five different AI tools on a weekly basis' },
    ],
  },
  // === SECTION 3: Learning Motivation & Growth Potential ===
  {
    id: 21, section: 3, type: 'mc',
    text: 'How would you describe your current approach to learning new professional tools?',
    options: [
      { value: 'A', label: 'I wait for formal training programs organized by the company' },
      { value: 'B', label: 'I proactively explore and experiment on my own before formal training' },
      { value: 'C', label: 'I only invest time in learning when explicitly required by my manager' },
      { value: 'D', label: 'I prefer learning informally from teammates when they share tips' },
    ],
  },
  {
    id: 22, section: 3, type: 'open',
    text: 'What area of your work would you most like AI to improve?',
    maxLength: 2000,
  },
  {
    id: 23, section: 3, type: 'mc',
    text: 'Which best describes your current use of AI tools in your daily work?',
    options: [
      { value: 'A', label: "I don't currently use any AI tools in my work" },
      { value: 'B', label: 'I occasionally try AI tools when a colleague suggests them' },
      { value: 'C', label: 'I regularly use AI tools and have built personal workflows around them' },
      { value: 'D', label: 'I build and share AI-enhanced workflows for my broader team' },
    ],
  },
  {
    id: 24, section: 3, type: 'mc',
    text: 'What is your primary motivation for joining this program?',
    options: [
      { value: 'A', label: 'It will look strong on my performance review' },
      { value: 'B', label: 'I want to build skills that future-proof my career in a changing landscape' },
      { value: 'C', label: 'My manager suggested or encouraged me to apply' },
      { value: 'D', label: "I'm curious to get hands-on experience with enterprise AI tools" },
    ],
  },
  {
    id: 25, section: 3, type: 'open',
    text: 'What do you think is the biggest risk or challenge of AI adoption in a company like STARTRADER?',
    maxLength: 2000,
  },
  {
    id: 26, section: 3, type: 'mc',
    text: 'How do you typically respond when a new tool or workflow does not immediately deliver expected results?',
    options: [
      { value: 'A', label: 'I give up and return to familiar, proven methods' },
      { value: 'B', label: 'I log the issue and wait for official support to resolve it' },
      { value: 'C', label: 'I experiment, troubleshoot, and seek input from peers or online resources' },
      { value: 'D', label: 'I escalate to management immediately and ask for a different solution' },
    ],
  },
  {
    id: 27, section: 3, type: 'open',
    text: 'If AI could reliably save you 1 hour every working day, how would you use that extra time?',
    maxLength: 2000,
  },
  {
    id: 28, section: 3, type: 'mc',
    text: 'Which statement best describes your attitude toward sharing knowledge with colleagues?',
    options: [
      { value: 'A', label: 'I keep my methods and shortcuts private to maintain a personal edge' },
      { value: 'B', label: 'I share knowledge freely and enjoy helping others level up their skills' },
      { value: 'C', label: "I share when someone asks directly, but don't take initiative to broadcast" },
      { value: 'D', label: 'I document things internally but rarely proactively share with the wider team' },
    ],
  },
  {
    id: 29, section: 3, type: 'mc',
    text: 'How would you rate your ability to adapt when facing rapid technology changes in your role?',
    options: [
      { value: 'A', label: 'I find rapid change stressful and strongly prefer predictable, stable environments' },
      { value: 'B', label: 'I adapt slowly but reliably catch up once I have sufficient time and support' },
      { value: 'C', label: 'I adapt comfortably when provided with clear guidance and adequate resources' },
      { value: 'D', label: 'I thrive on technological change and actively seek out new challenges' },
    ],
  },
  {
    id: 30, section: 3, type: 'open',
    text: 'Why would you like to join the STARTRADER AI Pioneer Program?',
    maxLength: 2000,
  },
]
