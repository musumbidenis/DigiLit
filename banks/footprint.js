/* Your Digital Footprint — item bank. */
(function (D) {
  'use strict';

  D.registerItems('footprint', [

    { id: 'fp-01', type: 'typein', skills: ['footprint.1'],
      prompt: 'What two-word term describes the trail of data a person leaves behind through their online activity?',
      placeholder: 'Two words',
      accept: ['digital footprint', 'a digital footprint', 'digital foot print'] },

    { id: 'fp-02', type: 'match', skills: ['footprint.2'],
      prompt: 'Mark each trace as active (you chose to leave it) or passive (collected as you went).',
      left: ['Posting a photo on social media', 'A site recording which pages you viewed',
        'Writing a product review', 'Your phone reporting your location to an app in the background'],
      right: ['Active', 'Passive'],
      answer: { 0: 0, 1: 1, 2: 0, 3: 1 } },

    { id: 'fp-03', type: 'choice', skills: ['footprint.6'],
      prompt: 'An employer searches for your name before an interview. What are they most likely to find?',
      options: ['Whatever you have made public, plus anything others have posted about you',
        'Only what you have posted in the last month',
        'Nothing, unless you give them your usernames',
        'Only your professional profiles'],
      answer: 0 },

    { id: 'fp-04', type: 'multi', skills: ['footprint.4', 'footprint.8'],
      prompt: 'Which steps genuinely reduce your exposure online?',
      options: ['Reviewing who can see your old posts',
        'Turning on two-step verification',
        'Removing apps you no longer use and revoking their access',
        'Using a different password for each important account',
        'Deleting your browser history on your own phone',
        'Posting less often'],
      answer: [0, 1, 2, 3] },

    { id: 'fp-05', type: 'choice', skills: ['footprint.5'],
      prompt: 'What are third-party cookies mainly used for?',
      options: ['Following your activity across different websites, usually for advertising',
        'Storing your password securely',
        'Speeding up the website you are currently on',
        'Backing up the pages you visit'],
      answer: 0 },

    { id: 'fp-06', type: 'choice', skills: ['footprint.7'],
      prompt: 'Someone has posted a photo of you that you want taken down. What is the best first step?',
      options: ['Ask the person who posted it to remove it, and report it to the platform if they refuse',
        'Post a photo of them in return',
        'Nothing can be done once something is online',
        'Delete your own account'],
      answer: 0 },

    { id: 'fp-07', type: 'choice', skills: ['footprint.3'],
      prompt: 'Why is it worth searching for your own name occasionally?',
      options: ['So you know what is publicly visible and can act on anything inaccurate or unwanted',
        'To improve your search ranking',
        'Because platforms require it annually',
        'To find out who has been searching for you'],
      answer: 0 },

    { id: 'fp-08', type: 'sim', env: 'browser', skills: ['footprint.5'],
      prompt: 'You are finishing on a shared machine. Clear the browsing history so the trail of pages you visited is not left behind.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) { return s.historyCleared === true; } }

  ]);

})(window.DIGILIT);
