/* Data and Information (LO3) — item bank. Original tasks.
   Meaning of data vs information, internet services, e-commerce, backups and
   emerging internet issues. */
(function (D) {
  'use strict';

  D.registerItems('datainfo', [

    { id: 'datainfo-01', type: 'choice', skills: ['datainfo.1'],
      prompt: 'What is the difference between data and information?',
      options: [
        'Data is raw, unprocessed facts; information is data that has been processed to have meaning',
        'Data and information mean exactly the same thing',
        'Information is raw facts; data is the processed result',
        'Data is kept on paper; information is kept on computers'],
      answer: 0 },

    { id: 'datainfo-02', type: 'choice', skills: ['datainfo.1'],
      prompt: 'A register lists "72, 65, 80, 90". The teacher works out the class average, 76.75. Which is the information?',
      options: [
        'The average, 76.75',
        'The four separate marks',
        'Both are raw data',
        'Neither — numbers are never information'],
      answer: 0 },

    { id: 'datainfo-03', type: 'multi', skills: ['datainfo.2'],
      prompt: 'Why do organisations value good data and information? Select all that apply.',
      options: [
        'It supports better decisions',
        'It helps plan and allocate resources',
        'It keeps a reliable record for reference and accountability',
        'It automatically makes every decision correct with no human thought',
        'It can be analysed to spot trends'],
      answer: [0, 1, 2, 4] },

    { id: 'datainfo-04', type: 'match', skills: ['datainfo.3'],
      prompt: 'Match each internet service to what it is used for.',
      left: ['Email', 'Search engine', 'FTP', 'The World Wide Web', 'E-commerce'],
      right: [
        'Sending and receiving electronic messages',
        'Finding information by keyword (information retrieval)',
        'Transferring files between computers',
        'Viewing linked pages in a browser',
        'Buying and selling goods and services online'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } },

    { id: 'datainfo-05', type: 'choice', skills: ['datainfo.4'],
      prompt: 'Which statement about the World Wide Web is correct?',
      options: [
        'The Web is a service that runs on the internet; the internet is the underlying network',
        'The Web and the internet are two names for the same wires',
        'The internet runs on top of the Web',
        'The Web works without any internet connection'],
      answer: 0 },

    { id: 'datainfo-06', type: 'multi', skills: ['datainfo.5'],
      prompt: 'Which of these are examples of e-commerce?',
      options: [
        'Buying a phone on Jumia and paying online',
        'Ordering a meal through a delivery app',
        'Booking a bus ticket and paying by M-PESA',
        'Writing a letter by hand and posting it',
        'Selling second-hand goods on an online marketplace'],
      answer: [0, 1, 2, 4] },

    { id: 'datainfo-07', type: 'match', skills: ['datainfo.6'],
      prompt: 'Sort each backup method into online or offline.',
      left: ['Google Drive', 'An external hard disk kept in a drawer', 'OneDrive', 'A USB flash drive', 'Backing up to a cloud service'],
      right: ['Online (cloud) backup', 'Offline (local) backup'],
      answer: { 0: 0, 1: 1, 2: 0, 3: 1, 4: 0 } },

    { id: 'datainfo-08', type: 'order', skills: ['datainfo.6'],
      prompt: 'Put these steps in order to back up an important folder to an external drive.',
      steps: [
        'Connect the external drive and wait for it to be recognised',
        'Open the folder you want to back up',
        'Select the files and copy them',
        'Paste them into a clearly named folder on the external drive',
        'Check the copied files open correctly, then eject the drive safely'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'datainfo-09', type: 'choice', skills: ['datainfo.6'],
      prompt: 'Why keep a backup in a DIFFERENT place from the original (for example, one copy in the cloud)?',
      options: [
        'So that fire, theft or a failed disk cannot destroy both copies at once',
        'Because cloud copies are always smaller',
        'So the original can be deleted to save space',
        'Backups only work if they are far away'],
      answer: 0 },

    { id: 'datainfo-10', type: 'multi', skills: ['datainfo.7'],
      prompt: 'Which of these are genuine emerging issues in the use of the internet?',
      options: [
        'Misinformation and fake news spreading quickly',
        'Online privacy and surveillance',
        'Cybercrime and online fraud',
        'The internet running out of websites to visit',
        'Digital addiction and screen-time on wellbeing'],
      answer: [0, 1, 2, 4] }

  ]);

})(window.DIGILIT);
