/* Cybersecurity and Safe Practice — RVNP addition. */
(function (D) {
  'use strict';

  D.registerItems('cybersafe', [

    { id: 'cyber-01', type: 'choice', skills: ['cybersafe.1'],
      prompt: 'Which of these is the strongest password?',
      options: ['purple-anchor-rain-92', 'Password2026!', 'Rvnp2026', 'ict1234'],
      answer: 0 },

    { id: 'cyber-02', type: 'choice', skills: ['cybersafe.1'],
      prompt: 'Why is it risky to use the same password for your email and your mobile money account?',
      options: ['If one service is breached, the attacker can open the other as well',
        'Services charge more for reused passwords',
        'It makes passwords harder to remember',
        'It slows down the login process'],
      answer: 0 },

    { id: 'cyber-03', type: 'choice', skills: ['cybersafe.2'],
      prompt: 'What does two-step verification add to a password?',
      options: ['A second proof, such as a code sent to your phone, that an attacker is unlikely to have',
        'A longer password', 'An automatic password change every month',
        'Antivirus protection for the account'],
      answer: 0 },

    { id: 'cyber-04', type: 'multi', skills: ['cybersafe.3'],
      prompt: 'Which of these are social engineering, rather than technical attacks?',
      options: ['A caller claiming to be from IT who asks for your password to "fix" your account',
        'A message saying you have won a prize and must confirm your details',
        'Someone watching over your shoulder as you type your PIN',
        'A program that guesses passwords automatically',
        'A fake sign-in page sent by email'],
      answer: [0, 1, 2, 4] },

    { id: 'cyber-05', type: 'multi', skills: ['cybersafe.5'],
      prompt: 'Which signs might suggest a computer is infected with malware?',
      options: ['It has become much slower with no other explanation',
        'Programs you did not install appear',
        'Pop-up adverts appear even when no browser is open',
        'Files have been renamed or encrypted and a payment is demanded',
        'The screen brightness has changed'],
      answer: [0, 1, 2, 3] },

    { id: 'cyber-06', type: 'choice', skills: ['cybersafe.6'],
      prompt: 'Which backup arrangement is the most dependable for coursework?',
      options: ['A copy on the computer and a second copy somewhere else, kept up to date',
        'One copy on the computer\'s desktop',
        'One copy on a flash disk you carry everywhere',
        'Emailing yourself the file once at the end of term'],
      answer: 0 },

    { id: 'cyber-07', type: 'choice', skills: ['cybersafe.7'],
      prompt: 'You are on open public Wi-Fi at a cafe. Which activity carries the most risk?',
      options: ['Signing in to your bank or mobile money account',
        'Reading the news', 'Watching a video', 'Checking the weather'],
      answer: 0 },

    { id: 'cyber-08', type: 'order', skills: ['cybersafe.8'],
      prompt: 'Your phone has been stolen. Put these actions in a sensible order.',
      steps: ['Use another device to lock or wipe the phone remotely',
        'Change the password on your email account',
        'Tell your mobile money provider and have the line blocked',
        'Report the theft to the police and get an abstract',
        'Check your accounts for transactions you did not make'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'cyber-09', type: 'sim', env: 'os', skills: ['cybersafe.7'],
      prompt: 'Two secured networks and one open network are available. Connect to a secured one — RVNP-Trainees. Its key is Trainee2026.',
      note: 'An open network with no key is the one to avoid.',
      setup: { flavour: 'win11', settings: { wifi: null } },
      check: function (s) { return s.settings.wifi === 'RVNP-Trainees'; } },

    { id: 'cyber-10', type: 'sim', env: 'os', skills: ['cybersafe.8'],
      prompt: 'You are called out of the lab unexpectedly with a document open. Secure the machine without losing your work.',
      setup: { flavour: 'win11', open: [{ app: 'editor', file: null }] },
      check: function (s) { return s.power === 'lock'; } },

    /* cybersafe.4 — keep software and antivirus updated */
    { id: 'cyber-11', type: 'choice', skills: ['cybersafe.4'],
      prompt: 'Why does it matter to keep your operating system, apps and antivirus up to date?',
      options: ['Updates fix security holes that attackers and malware exploit',
        'Updates only change how things look',
        'Updates make the computer slower on purpose',
        'There is no security reason — it is optional'],
      answer: 0 }

  ]);

})(window.DIGILIT);
