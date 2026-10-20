/* Accessing Health Appointments Online — item bank (knowledge items only so far). */
(function (D) {
  'use strict';

  D.registerItems('telehealth', [

    { id: 'th-01', type: 'order', skills: ['telehealth.2', 'telehealth.3'],
      prompt: 'Put these steps in order for joining a video consultation.',
      steps: ['Check your appointment time and find the link you were sent',
        'Test your camera, microphone and connection beforehand',
        'Move somewhere private and well lit',
        'Open the link a few minutes early',
        'Allow the browser or app to use your camera and microphone'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'th-02', type: 'choice', skills: ['telehealth.4'],
      prompt: 'Where is the most suitable place to take a medical consultation call?',
      options: ['A quiet room where you will not be overheard',
        'A busy matatu on the way home',
        'A cafe with free Wi-Fi',
        'The corridor outside a classroom'],
      answer: 0 },

    { id: 'th-03', type: 'choice', skills: ['telehealth.7'],
      prompt: 'A message claiming to be from a clinic asks for your ID number and card details to "confirm" an appointment. What should you do?',
      options: ['Do not reply — contact the clinic using a number you already know',
        'Reply with the details so the appointment is not cancelled',
        'Send the ID number but not the card details',
        'Forward it to a friend for an opinion'],
      answer: 0 },

    { id: 'th-04', type: 'multi', skills: ['telehealth.2'],
      prompt: 'Your video call keeps freezing. Which steps are worth trying?',
      options: ['Turn off your own video and continue with audio',
        'Move closer to the router or to better signal',
        'Close other programs and tabs using the connection',
        'Ask to switch to a phone call if it does not improve',
        'Restart the computer mid-consultation'],
      answer: [0, 1, 2, 3] },

    { id: 'th-05', type: 'choice', skills: ['telehealth.5'],
      prompt: 'What is a patient portal?',
      options: ['A secure site where you can book appointments and read your own records',
        'A public health news website',
        'A social media group for patients',
        'A government database open to all'],
      answer: 0 },

    { id: 'th-06', type: 'choice', skills: ['telehealth.6'],
      prompt: 'Why send a question through a portal message rather than ordinary social media?',
      options: ['The portal is secure and the message reaches your own records',
        'It is faster in every case',
        'Social media is never used by clinics',
        'Portal messages cost less'],
      answer: 0 },

    /* telehealth.1 — book an appointment through a patient portal */
    { id: 'th-07', type: 'order', skills: ['telehealth.1'],
      prompt: 'Put these steps in order for booking an appointment through a patient portal.',
      steps: ['Sign in to the patient portal',
        'Choose Book / New appointment',
        'Pick the clinic or service and a time that suits you',
        'Confirm the booking',
        'Note the confirmation and any joining link for the day'],
      answer: [0, 1, 2, 3, 4] }

  ]);

})(window.DIGILIT);
