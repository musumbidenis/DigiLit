/* Cyber Threats, Controls and Kenyan Law (LO5) — item bank. Original tasks.
   The CIA triad, the threat taxonomy the curriculum names, control types, and
   the two Kenyan Acts: Computer Misuse and Cybercrimes Act No. 5 of 2018 and
   the Data Protection Act No. 24 of 2019. */
(function (D) {
  'use strict';

  D.registerItems('cyberlaw', [

    /* ---- CIA triad ---- */

    { id: 'cyberlaw-01', type: 'match', skills: ['cyberlaw.1'],
      prompt: 'Match each part of the CIA triad to what it protects.',
      left: ['Confidentiality', 'Integrity', 'Availability'],
      right: [
        'Only authorised people can read the data',
        'The data is accurate and has not been tampered with',
        'The data and systems are there when authorised users need them'],
      answer: { 0: 0, 1: 1, 2: 2 } },

    { id: 'cyberlaw-02', type: 'choice', skills: ['cyberlaw.1'],
      prompt: 'An attacker changes the amount on an electronic invoice from 5,000 to 50,000. Which part of the CIA triad has been broken?',
      options: ['Integrity', 'Confidentiality', 'Availability', 'None of them'],
      answer: 0 },

    /* ---- threat taxonomy ---- */

    { id: 'cyberlaw-03', type: 'match', skills: ['cyberlaw.2', 'cyberlaw.4', 'cyberlaw.5', 'cyberlaw.8', 'cyberlaw.9'],
      prompt: 'Match each internet threat to its description.',
      left: ['Malware', 'Phishing', 'Ransomware', 'Man-in-the-middle (MitM)', 'Distributed denial of service (DDoS)'],
      right: [
        'Malicious software such as viruses, worms, trojans and spyware',
        'A fake message that tricks you into giving passwords or money',
        'Locks or encrypts your files and demands payment to release them',
        'An attacker secretly sits between two parties and reads or alters their traffic',
        'Many machines flood a service with traffic until it goes down'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } },

    { id: 'cyberlaw-04', type: 'choice', skills: ['cyberlaw.3'],
      prompt: 'Which of these is a social engineering attack?',
      options: [
        'A caller pretends to be from your bank’s fraud team and pressures you to read out your OTP',
        'A power surge damages the server',
        'A hard disk fails after five years of use',
        'A program crashes because of a coding bug'],
      answer: 0 },

    { id: 'cyberlaw-05', type: 'multi', skills: ['cyberlaw.8'],
      prompt: 'Which signs suggest an email is a phishing attempt? Select all that apply.',
      options: [
        'It creates urgency — "act in 24 hours or your account is closed"',
        'The sender address is slightly wrong, like support@paybi11.co',
        'It asks you to click a link and confirm your password',
        'It is from a colleague you know, about a meeting you arranged',
        'It has unexpected spelling and grammar mistakes'],
      answer: [0, 1, 2, 4] },

    { id: 'cyberlaw-06', type: 'choice', skills: ['cyberlaw.6'],
      prompt: 'An attacker runs software that tries millions of common words and combinations against a login. What kind of attack is this?',
      options: ['A password (brute-force / dictionary) attack', 'A DDoS attack', 'A man-in-the-middle attack', 'An IoT attack'],
      answer: 0 },

    { id: 'cyberlaw-07', type: 'multi', skills: ['cyberlaw.6'],
      prompt: 'Which of these is a strong password choice?',
      options: [
        'A long passphrase of several unrelated words plus a symbol, e.g. Rain!Goat-River7',
        'password123',
        'Your name and year of birth',
        'A different password for each important account',
        'qwerty'],
      answer: [0, 3] },

    { id: 'cyberlaw-08', type: 'choice', skills: ['cyberlaw.7'],
      prompt: 'Why are Internet of Things (IoT) devices — smart cameras, routers, TVs — a common target?',
      options: [
        'They are often left on default passwords and rarely updated',
        'They cannot be hacked at all',
        'They contain no software',
        'They are never connected to the internet'],
      answer: 0 },

    { id: 'cyberlaw-09', type: 'choice', skills: ['cyberlaw.9'],
      prompt: 'A lab machine shows a full-screen message: "Your files are encrypted. Pay to unlock." What should the lab do?',
      options: [
        'Disconnect it from the network, report it, and restore files from backup rather than pay',
        'Pay the ransom immediately so work is not lost',
        'Keep using the machine and ignore the message',
        'Plug in every USB drive to see which files still open'],
      answer: 0 },

    /* ---- controls ---- */

    { id: 'cyberlaw-10', type: 'match', skills: ['cyberlaw.10'],
      prompt: 'Classify each control as physical, technical/logical or operational.',
      left: [
        'A locked server-room door and burglar bars',
        'A password, PIN or fingerprint to log in',
        'A firewall and antivirus software',
        'A staff policy and training on handling data'],
      right: ['Physical control', 'Technical / logical control', 'Operational control'],
      answer: { 0: 0, 1: 1, 2: 1, 3: 2 } },

    { id: 'cyberlaw-11', type: 'multi', skills: ['cyberlaw.10'],
      prompt: 'Which of these are technical/logical controls (as opposed to physical or operational)?',
      options: ['Passwords and PINs', 'Biometrics such as a fingerprint', 'Encryption of data', 'A guard at the gate', 'A written data-handling policy'],
      answer: [0, 1, 2] },

    /* ---- Kenyan law ---- */

    { id: 'cyberlaw-12', type: 'choice', skills: ['cyberlaw.11'],
      prompt: 'A student logs into another person’s email without permission and reads their messages. Which Kenyan law primarily addresses this?',
      options: [
        'The Computer Misuse and Cybercrimes Act No. 5 of 2018 (unauthorised access)',
        'The Traffic Act',
        'The Employment Act',
        'No Kenyan law covers this'],
      answer: 0 },

    { id: 'cyberlaw-13', type: 'match', skills: ['cyberlaw.11'],
      prompt: 'Match each act to what it mainly governs in Kenya.',
      left: [
        'Computer Misuse and Cybercrimes Act No. 5 of 2018',
        'Data Protection Act No. 24 of 2019'],
      right: [
        'Offences such as unauthorised access, cyber harassment, fraud and false publications',
        'How personal data must be collected, processed, stored and protected'],
      answer: { 0: 0, 1: 1 } },

    { id: 'cyberlaw-14', type: 'multi', skills: ['cyberlaw.12'],
      prompt: 'Under the Data Protection Act 2019, which rights does a data subject (the person whose data it is) have?',
      options: [
        'To be informed of how their data is used',
        'To access the personal data held about them',
        'To have inaccurate data corrected',
        'To demand that no company in the world ever stores any number',
        'To have their data deleted in certain circumstances'],
      answer: [0, 1, 2, 4] },

    { id: 'cyberlaw-15', type: 'choice', skills: ['cyberlaw.12'],
      prompt: 'A college collects trainees’ ID numbers and phone contacts. Under the Data Protection Act, what must it do?',
      options: [
        'Collect only what it needs, use it for the stated purpose, keep it secure and not share it without a lawful basis',
        'Sell the contact list to advertisers to raise funds',
        'Post the full list on a public notice board',
        'Keep the data forever even after it is no longer needed'],
      answer: 0 }

  ]);

})(window.DIGILIT);
