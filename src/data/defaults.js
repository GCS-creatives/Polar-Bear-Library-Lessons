// Default/seed content for every content bank. This is what loads before
// any Admin edits exist in Netlify Blobs, and doubles as the shape every
// stored value is merged under (see App.jsx) so a schema change never
// crashes the first render.

export const defaultContent = {
  lessonTitle: {
    internalTitle: 'How We Use Our Library — First Visit',
    studentHeadline: 'Today at the Library 📚'
  },

  standards: {
    aaslFoundation: 'Include',
    aaslDomain: 'Think',
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

// AASL National School Library Standards — Shared Foundations paired with
// their Domains, plus a plain-language description of the Foundation for
// the Standards card. (Domains: Think / Create / Share / Grow.)
export const aaslOptions = [
  { foundation: 'Include', domain: 'Think', description: 'Learners: Demonstrate empathy and respect for diverse perspectives to support a positive climate for learning.' },
  { foundation: 'Include', domain: 'Share', description: 'Learners: Demonstrate empathy and respect for diverse perspectives to support a positive climate for learning.' },
  { foundation: 'Inquire', domain: 'Think', description: 'Learners: Build new knowledge by inquiring, thinking critically, and gaining, evaluating, and sharing knowledge.' },
  { foundation: 'Engage', domain: 'Grow', description: 'Learners: Demonstrate safe, legal, and ethical creating and sharing of knowledge products independently.' },
  { foundation: 'Curate', domain: 'Create', description: 'Learners: Make critical choices about information sources to use.' },
  { foundation: 'Explore', domain: 'Grow', description: 'Learners: Develop and satisfy personal curiosity.' }
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
