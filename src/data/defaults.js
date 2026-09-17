// Default/seed content for every content bank. This is what loads before
// any Admin edits exist in Netlify Blobs, and doubles as the shape every
// stored value is merged under (see App.jsx) so a schema change never
// crashes the first render.

export const defaultContent = {
  lessons: {
    items: [], // [{ id, name, savedAt, snapshot: {...LESSON_BANK_NAMES} }]
    activeId: null // null = an unsaved/new lesson currently being built
  },

  lessonTitle: {
    internalTitle: 'How We Use Our Library — First Visit',
    studentHeadline: 'Today at the Library 📚'
  },

  standards: {
    aaslCode: 'II.A.1',
    aaslFoundation: 'Include',
    aaslDomain: 'Think',
    aaslText: 'Articulating an awareness of the contributions of a range of learners.',
    ncesCode: 'RL.8.1',
    ncesDescription: 'Cite text to support inferences from stories and poems.',
    icanStatement: "I can find clues in the story that help me understand what's happening."
  },

  wordOfWeek: {
    word: 'gentle',
    definition: 'soft and careful, not rough',
    example: 'We give the dog a gentle boop.'
  },

  // Planning-only fields — no student-facing counterpart, by design.
  goal: {
    text: 'Students will participate in their first library shared-reading experience and interact appropriately with a library book.'
  },
  barriers: {
    text: 'Unfamiliar environment/routine\nLanguage-processing demands\nMotor access to books\nSafe handling of materials'
  },
  access: {
    text: 'Predictable 3-step routine: Story → Activity → Explore\nBrief, repeated participation cue ("Oh, dragon!")\nBooks brought within reach, not floor-level\nConcrete "gentle vs. too hard" demonstration\nVisible FINISHED spot'
  },
  participationNotes: {
    text: 'Looking, listening, reacting to the story\nTaking or declining a "boop" turn\nExploring a sensory book\nCommunicating MORE / FINISHED / a preference'
  },
  evidence: {
    text: 'Which students showed a reliable way to participate, choose, reject, request more, or indicate finished?'
  },

  // Student-facing "Your Turn" prompts — one per line.
  prompts: {
    text: 'Gentle boop? 🐾\nDragon or dog? 🐉🐶\nBook finished? Put it here ✅'
  },

  materials: {
    book1: { emoji: '🐉', title: 'Do Not Bring Your Dragon to the Library', author: 'Julie Gassman' },
    book2: { emoji: '🐶', title: 'Boop!', author: 'Bea Birdsong' },
    other: 'Other materials (planning only, no student mapping)\n1–2 sensory/interactive books\nFINISHED basket or tray\nStable table/cart (books off the floor)'
  },

  video: {
    url: 'https://www.youtube.com/watch?v=VErVChrcNZM'
  },

  slides: {
    url: '' // Canva "Share → More → Embed" link
  },

  visualSchedule: {
    step1Label: 'Story',
    step2Label: 'Activity',
    step2Sub: 'Boop! 🐾',
    step3Label: 'Explore'
  },

  visualRules: {
    rule1: { emoji: '👀', label: 'LOOK / LISTEN' },
    rule2: { emoji: '🤲', label: 'GENTLE HANDS' },
    rule3: { emoji: '✅', label: 'FINISHED GOES HERE' }
  },

  timer: {
    defaultMinutes: 5 // starting value only — running/remaining time is not persisted
  },

  agenda: {
    text: '0–2 min | Welcome + show 3-part visual schedule: STORY → ACTIVITY → EXPLORE | Orient to the routine\n2–3 min | Introduce 2 expectations: "Books stay safe," "Gentle hands." Model both. | Watch / model gesture\n3–9 min | Read Do Not Bring Your Dragon to the Library | Look, listen, react, locate dragons\n9–14 min | Read/interact with Boop! | Touch/point to noses, take a boop turn\n14–18 min | Sensory-book exploration | Explore one book at a time; MORE/FINISHED\n18–20 min | Review + goodbye routine | Choose favorite: dragon or dog?'
  }
};

// Every bank name EXCEPT `lessons` itself — this is what gets bundled into
// a snapshot when saving a lesson, and what gets restored when loading one.
export const LESSON_BANK_NAMES = Object.keys(defaultContent).filter((k) => k !== 'lessons');

// AASL National School Library Standards — the actual Learner Competencies
// (not just a one-line Foundation summary), verified against AASL's
// National School Library Standards for Learners, School Librarians, and
// School Libraries (2018). Each competency is coded
// <Foundation Roman numeral>.<Domain letter>.<number> — Domain A = Think,
// B = Create, C = Share, D = Grow — matching AASL's own citation format.
export const aaslOptions = [
  // I. Inquire — Build new knowledge by inquiring, thinking critically, identifying problems, and developing strategies for solving problems.
  { code: 'I.A.1', foundation: 'Inquire', domain: 'Think', text: 'Formulating questions about a personal interest or a curricular topic.' },
  { code: 'I.A.2', foundation: 'Inquire', domain: 'Think', text: 'Recalling prior and background knowledge as context for new meaning.' },
  { code: 'I.B.1', foundation: 'Inquire', domain: 'Create', text: 'Using evidence to investigate questions.' },
  { code: 'I.B.2', foundation: 'Inquire', domain: 'Create', text: 'Devising and implementing a plan to fill knowledge gaps.' },
  { code: 'I.B.3', foundation: 'Inquire', domain: 'Create', text: 'Generating products that illustrate learning.' },
  { code: 'I.C.1', foundation: 'Inquire', domain: 'Share', text: 'Interacting with content presented by others.' },
  { code: 'I.C.2', foundation: 'Inquire', domain: 'Share', text: 'Providing constructive feedback.' },
  { code: 'I.C.3', foundation: 'Inquire', domain: 'Share', text: 'Acting on feedback to improve.' },
  { code: 'I.C.4', foundation: 'Inquire', domain: 'Share', text: 'Sharing products with an authentic audience.' },
  { code: 'I.D.1', foundation: 'Inquire', domain: 'Grow', text: 'Continually seeking knowledge.' },
  { code: 'I.D.2', foundation: 'Inquire', domain: 'Grow', text: 'Engaging in sustained inquiry.' },
  { code: 'I.D.3', foundation: 'Inquire', domain: 'Grow', text: 'Enacting new understanding through real-world connections.' },
  { code: 'I.D.4', foundation: 'Inquire', domain: 'Grow', text: 'Using reflection to guide informed decisions.' },

  // II. Include — Demonstrate an understanding of and commitment to inclusiveness and respect for diversity in the learning community.
  { code: 'II.A.1', foundation: 'Include', domain: 'Think', text: 'Articulating an awareness of the contributions of a range of learners.' },
  { code: 'II.A.2', foundation: 'Include', domain: 'Think', text: 'Adopting a discerning stance toward points of view and opinions expressed in information resources and learning products.' },
  { code: 'II.A.3', foundation: 'Include', domain: 'Think', text: 'Describing their understanding of cultural relevancy and placement within the global learning community.' },
  { code: 'II.B.1', foundation: 'Include', domain: 'Create', text: 'Interacting with learners who reflect a range of perspectives.' },
  { code: 'II.B.2', foundation: 'Include', domain: 'Create', text: 'Evaluating a variety of perspectives during learning activities.' },
  { code: 'II.C.1', foundation: 'Include', domain: 'Share', text: 'Engaging in informed conversation and active debate.' },
  { code: 'II.C.2', foundation: 'Include', domain: 'Share', text: 'Contributing to discussions in which multiple viewpoints on a topic are expressed.' },
  { code: 'II.D.1', foundation: 'Include', domain: 'Grow', text: 'Seeking interactions with a range of learners.' },
  { code: 'II.D.2', foundation: 'Include', domain: 'Grow', text: 'Demonstrating interest in other perspectives during learning activities.' },
  { code: 'II.D.3', foundation: 'Include', domain: 'Grow', text: 'Reflecting on their own place within the global learning community.' },

  // III. Collaborate — Work effectively with others to broaden perspectives and work toward common goals.
  { code: 'III.A.1', foundation: 'Collaborate', domain: 'Think', text: 'Demonstrating their desire to broaden and deepen understandings.' },
  { code: 'III.A.2', foundation: 'Collaborate', domain: 'Think', text: 'Developing new understandings through engagement in a learning group.' },
  { code: 'III.A.3', foundation: 'Collaborate', domain: 'Think', text: 'Deciding to solve problems informed by group interaction.' },
  { code: 'III.B.1', foundation: 'Collaborate', domain: 'Create', text: 'Using a variety of communication tools and resources.' },
  { code: 'III.B.2', foundation: 'Collaborate', domain: 'Create', text: 'Establishing connections with other learners to build on their own prior knowledge and create new knowledge.' },
  { code: 'III.C.1', foundation: 'Collaborate', domain: 'Share', text: 'Soliciting and responding to feedback from others.' },
  { code: 'III.C.2', foundation: 'Collaborate', domain: 'Share', text: 'Involving diverse perspectives in their own inquiry processes.' },
  { code: 'III.D.1', foundation: 'Collaborate', domain: 'Grow', text: 'Actively contributing to group discussions.' },
  { code: 'III.D.2', foundation: 'Collaborate', domain: 'Grow', text: 'Recognizing learning as a social responsibility.' },

  // IV. Curate — Make meaning for oneself and others by collecting, organizing, and sharing resources of personal relevance.
  { code: 'IV.A.1', foundation: 'Curate', domain: 'Think', text: 'Determining the need to gather information.' },
  { code: 'IV.A.2', foundation: 'Curate', domain: 'Think', text: 'Identifying possible sources of information.' },
  { code: 'IV.A.3', foundation: 'Curate', domain: 'Think', text: 'Making critical choices about information sources to use.' },
  { code: 'IV.B.1', foundation: 'Curate', domain: 'Create', text: 'Seeking a variety of sources.' },
  { code: 'IV.B.2', foundation: 'Curate', domain: 'Create', text: 'Collecting information representing diverse perspectives.' },
  { code: 'IV.B.3', foundation: 'Curate', domain: 'Create', text: 'Systematically questioning and assessing the validity and accuracy of information.' },
  { code: 'IV.B.4', foundation: 'Curate', domain: 'Create', text: 'Organizing information by priority, topic, or other systematic scheme.' },
  { code: 'IV.C.1', foundation: 'Curate', domain: 'Share', text: 'Accessing and evaluating collaboratively constructed information sites.' },
  { code: 'IV.C.2', foundation: 'Curate', domain: 'Share', text: "Contributing to collaboratively constructed information sites by ethically using and reproducing others' work." },
  { code: 'IV.C.3', foundation: 'Curate', domain: 'Share', text: 'Joining with others to compare and contrast information derived from collaboratively constructed information sites.' },
  { code: 'IV.D.1', foundation: 'Curate', domain: 'Grow', text: 'Performing ongoing analysis of and reflection on the quality, usefulness, and accuracy of curated resources.' },
  { code: 'IV.D.2', foundation: 'Curate', domain: 'Grow', text: 'Integrating and depicting in a conceptual knowledge network their understanding gained from resources.' },
  { code: 'IV.D.3', foundation: 'Curate', domain: 'Grow', text: 'Openly communicating curation processes for others to use, interpret, and validate.' },

  // V. Explore — Discover and innovate in a growth mindset developed through experience and reflection.
  { code: 'V.A.1', foundation: 'Explore', domain: 'Think', text: 'Reading widely and deeply in multiple formats and writing and creating for a variety of purposes.' },
  { code: 'V.A.2', foundation: 'Explore', domain: 'Think', text: 'Reflecting and questioning assumptions and possible misconceptions.' },
  { code: 'V.A.3', foundation: 'Explore', domain: 'Think', text: 'Engaging in inquiry-based processes for personal growth.' },
  { code: 'V.B.1', foundation: 'Explore', domain: 'Create', text: 'Problem solving through cycles of design, implementation, and reflection.' },
  { code: 'V.B.2', foundation: 'Explore', domain: 'Create', text: 'Persisting through self-directed pursuits by tinkering and making.' },
  { code: 'V.C.1', foundation: 'Explore', domain: 'Share', text: 'Expressing curiosity about a topic of personal interest or curricular relevance.' },
  { code: 'V.C.2', foundation: 'Explore', domain: 'Share', text: 'Co-constructing innovative means of investigation.' },
  { code: 'V.C.3', foundation: 'Explore', domain: 'Share', text: 'Collaboratively identifying innovative solutions to a challenge or problem.' },
  { code: 'V.D.1', foundation: 'Explore', domain: 'Grow', text: 'Iteratively responding to challenges.' },
  { code: 'V.D.2', foundation: 'Explore', domain: 'Grow', text: 'Recognizing capabilities and skills that can be developed, improved, and expanded.' },
  { code: 'V.D.3', foundation: 'Explore', domain: 'Grow', text: 'Open-mindedly accepting feedback for positive and constructive growth.' },

  // VI. Engage — Demonstrate safe, legal, and ethical creating and sharing of knowledge products independently.
  { code: 'VI.A.1', foundation: 'Engage', domain: 'Think', text: 'Responsibly applying information, technology, and media to learning.' },
  { code: 'VI.A.2', foundation: 'Engage', domain: 'Think', text: 'Understanding the ethical use of information, technology, and media.' },
  { code: 'VI.A.3', foundation: 'Engage', domain: 'Think', text: 'Evaluating information for accuracy, validity, social and cultural context, and appropriateness for need.' },
  { code: 'VI.B.1', foundation: 'Engage', domain: 'Create', text: "Ethically using and reproducing others' work." },
  { code: 'VI.B.2', foundation: 'Engage', domain: 'Create', text: 'Acknowledging authorship and demonstrating respect for the intellectual property of others.' },
  { code: 'VI.B.3', foundation: 'Engage', domain: 'Create', text: 'Including elements in personal-knowledge products that allow others to credit content appropriately.' },
  { code: 'VI.C.1', foundation: 'Engage', domain: 'Share', text: 'Sharing information resources in accordance with modification, reuse, and remix policies.' },
  { code: 'VI.C.2', foundation: 'Engage', domain: 'Share', text: 'Disseminating new knowledge through means appropriate for the intended audience.' },
  { code: 'VI.D.1', foundation: 'Engage', domain: 'Grow', text: 'Personalizing their use of information and information technologies.' },
  { code: 'VI.D.2', foundation: 'Engage', domain: 'Grow', text: 'Reflecting on the process of ethical creation of new knowledge.' },
  { code: 'VI.D.3', foundation: 'Engage', domain: 'Grow', text: 'Inspiring others to engage in safe, responsible, ethical, and legal information behaviors.' }
];

// NC Extended Content Standards, Reading: Literature, grades 6–8 (verified
// against DPI / Extended Content Standards source documents). Each option
// carries a suggested "I can" translation — editable in Admin, never
// treated as the only correct wording.
export const ncesOptions = [
  { code: 'RL.6.1', description: 'Determine what a text says explicitly as well as what simple inferences must be drawn.', ican: 'I can find clues in the story that tell me what is happening.' },
  { code: 'RL.6.2', description: 'Identify details in a text that are related to the theme.', ican: 'I can point to parts of the story that match the big idea.' },
  { code: 'RL.6.3', description: 'Identify how a character responds to a challenge in a story.', ican: 'I can show how a character solves a problem in the story.' },
  { code: 'RL.7.1', description: 'Analyze text to identify where information is explicitly stated and where inferences must be drawn.', ican: 'I can find what the story tells me and what I have to figure out myself.' },
  { code: 'RL.7.2', description: 'Identify events in a text that are related to the theme.', ican: 'I can find story events that connect to the big idea.' },
  { code: 'RL.7.3', description: 'Determine how two or more story elements are related.', ican: 'I can show how two parts of the story connect.' },
  { code: 'RL.8.1', description: 'Cite text to support inferences from stories and poems.', ican: "I can find clues in the story that help me understand what's happening." },
  { code: 'RL.8.2', description: 'Recount an event related to the theme, including details about character and setting.', ican: 'I can retell a part of the story, including who was there and where it happened.' },
  { code: 'RL.8.3', description: 'Identify which incidents in a story or drama lead to subsequent action.', ican: 'I can show what happens first, next, and after in the story.' }
];
