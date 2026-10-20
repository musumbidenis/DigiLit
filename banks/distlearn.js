/* Supporting Learners Online — item bank (knowledge items only so far). */
(function (D) {
  'use strict';

  D.registerItems('distlearn', [

    { id: 'dl-01', type: 'order', skills: ['distlearn.3', 'distlearn.4'],
      prompt: 'Put these steps in order for submitting an assignment on a learning platform.',
      steps: ['Sign in to the platform',
        'Open the unit and find the assignment',
        'Check the due date and what format is required',
        'Upload the file or type the response',
        'Confirm the submission shows as received'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'dl-02', type: 'choice', skills: ['distlearn.7'],
      prompt: 'A learner can hear the teacher but the teacher cannot hear them. What should they check first?',
      options: ['Whether their microphone is muted or the wrong device is selected',
        'Their internet speed',
        'Whether the teacher is muted',
        'Whether the camera is on'],
      answer: 0 },

    { id: 'dl-03', type: 'choice', skills: ['distlearn.6'],
      prompt: 'Which message to a teacher is appropriate?',
      options: ['Good afternoon. I could not submit Assignment 2 — the upload failed twice. May I send it by email?',
        'why didnt u mark my work',
        'Hello??? Reply fast please',
        'Sending again. See attached.'],
      answer: 0 },

    { id: 'dl-04', type: 'multi', skills: ['distlearn.8'],
      prompt: 'Which arrangements help a learner study online at home?',
      options: ['A regular time set aside each day',
        'A table and chair away from the television',
        'Charging the device the night before',
        'Downloading materials while there is data or Wi-Fi',
        'Keeping the phone face-up with notifications on'],
      answer: [0, 1, 2, 3] },

    { id: 'dl-05', type: 'choice', skills: ['distlearn.5'],
      prompt: 'A learner wants to know why they lost marks. Where should they look first?',
      options: ['The feedback the teacher attached to the graded submission',
        'The class group chat',
        'The platform\'s help pages',
        'The assignment brief only'],
      answer: 0 },

    { id: 'dl-06', type: 'choice', skills: ['distlearn.2'],
      prompt: 'A scheduled class starts in five minutes and the link is in the platform calendar. What is the sensible step?',
      options: ['Open the link a few minutes early and check audio before the class starts',
        'Wait until the exact start time to click it',
        'Ask a classmate to send a different link',
        'Join by phone call instead'],
      answer: 0 },

    /* distlearn.1 — sign in to a learning platform */
    { id: 'dl-07', type: 'choice', skills: ['distlearn.1'],
      prompt: 'You are signing in to the learning platform on a shared lab computer. What is the safe habit?',
      options: ['Enter your own username and password, and sign out when you finish',
        'Tick "remember me" so the next person can get in quickly',
        'Share your login with a classmate who forgot theirs',
        'Stay signed in and just close the browser tab'],
      answer: 0 }

  ]);

})(window.DIGILIT);
