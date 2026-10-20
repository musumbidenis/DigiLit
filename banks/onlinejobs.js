/* Perform Online Jobs (LO6) — item bank. Original tasks.
   Online working, job types, the platforms the curriculum names, profile and
   account management, bidding, digital identity, executing tasks and online
   payment accounts. A job-platform profile/bidding simulator is added in a
   later build; until then these knowledge items carry the standards. */
(function (D) {
  'use strict';

  D.registerItems('onlinejobs', [

    { id: 'onlinejobs-01', type: 'multi', skills: ['onlinejobs.1'],
      prompt: 'What are genuine advantages of online work? Select all that apply.',
      options: [
        'You can work from home and choose your hours',
        'You can earn from clients anywhere in the world',
        'Every platform guarantees a fixed salary every month',
        'It needs little physical capital to start',
        'Payment and workload are always certain and never vary'],
      answer: [0, 1, 3] },

    { id: 'onlinejobs-02', type: 'multi', skills: ['onlinejobs.1'],
      prompt: 'What are real risks a new online worker should plan for?',
      options: [
        'Irregular income and competition for tasks',
        'Fake platforms and clients who do not pay',
        'Reliance on a stable internet connection and power',
        'The complete disappearance of all online work overnight',
        'Scams that ask you to pay a fee to "unlock" jobs'],
      answer: [0, 1, 2, 4] },

    { id: 'onlinejobs-03', type: 'match', skills: ['onlinejobs.2', 'onlinejobs.3'],
      prompt: 'Match each online job platform to the kind of work it is best known for.',
      left: ['Upwork', 'Remotask / Data Annotation Tech', 'Appen', 'Oneforma'],
      right: [
        'Freelance contracts — writing, design, development, bidding on client jobs',
        'Data labelling and annotation tasks that train AI',
        'Crowdsourced AI training and language data projects',
        'Micro-tasks such as data collection and transcription'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3 } },

    { id: 'onlinejobs-04', type: 'multi', skills: ['onlinejobs.2'],
      prompt: 'Which of these are common types of online jobs?',
      options: [
        'Data annotation and labelling',
        'Freelance writing, design and programming',
        'Virtual assistance and transcription',
        'Walking into an office to clock in at 8 a.m. daily',
        'Online tutoring'],
      answer: [0, 1, 2, 4] },

    { id: 'onlinejobs-05', type: 'multi', skills: ['onlinejobs.4', 'onlinejobs.6'],
      prompt: 'You are setting up a profile on a freelancing platform. What builds a strong, trustworthy online identity?',
      options: [
        'A clear professional photo and an honest headline',
        'A complete bio listing real skills and samples of your work',
        'A verified email and payment details',
        'Exaggerated claims and fake five-star reviews',
        'Using the same professional name across your profiles'],
      answer: [0, 1, 2, 4] },

    { id: 'onlinejobs-06', type: 'order', skills: ['onlinejobs.5'],
      prompt: 'Put these steps in order for winning your first task on a bidding platform.',
      steps: [
        'Complete your profile and verify your account',
        'Search and filter for jobs that match your skills',
        'Read the job description carefully',
        'Write a tailored proposal / bid showing you fit the job',
        'Deliver the work well to earn a good rating'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'onlinejobs-07', type: 'choice', skills: ['onlinejobs.5'],
      prompt: 'Which proposal is most likely to win a data-entry job?',
      options: [
        'A short, specific bid: relevant experience, how you will do it, realistic timeline',
        'A one-word bid that just says "Me."',
        'The same copy-pasted message sent to every job',
        'A bid demanding payment before any work is discussed'],
      answer: 0 },

    { id: 'onlinejobs-08', type: 'choice', skills: ['onlinejobs.7'],
      prompt: 'A labelling task says "Tag only clearly visible road signs; skip blurred ones." You see a blurred sign. What do you do?',
      options: [
        'Follow the instruction exactly and skip the blurred sign',
        'Tag it anyway because more tags look like more effort',
        'Guess what it says and tag that',
        'Stop and tag nothing for the rest of the task'],
      answer: 0 },

    { id: 'onlinejobs-09', type: 'multi', skills: ['onlinejobs.8'],
      prompt: 'How should you manage an online payment account (e.g. a withdrawal to PayPal, Payoneer or M-PESA)?',
      options: [
        'Use a strong password and two-step verification',
        'Confirm the platform and payment details are genuine before withdrawing',
        'Keep records of what you earned and were paid',
        'Share your account password with any client who asks',
        'Beware anyone who asks you to pay a fee to "release" your earnings'],
      answer: [0, 1, 2, 4] },

    { id: 'onlinejobs-10', type: 'choice', skills: ['onlinejobs.1', 'onlinejobs.8'],
      prompt: 'A new "platform" promises KSh 5,000 a day but asks for a KSh 1,000 registration fee first. What is this most likely to be?',
      options: [
        'A scam — legitimate platforms do not charge you to be allowed to work',
        'A normal, safe way to start earning',
        'A government-approved job scheme',
        'A sign the platform is especially trustworthy'],
      answer: 0 }

  ]);

})(window.DIGILIT);
