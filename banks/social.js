/* Social Media — item bank. */
(function (D) {
  'use strict';

  D.registerItems('social', [

    { id: 'soc-01', type: 'choice', skills: ['social.3'],
      prompt: 'Your profile is set to Public. What does that mean in practice?',
      options: ['Anyone can see your posts, including people who do not follow you',
        'Only people you have approved can see your posts',
        'Only people in your country can see your posts',
        'Your posts disappear after a day'],
      answer: 0 },

    { id: 'soc-02', type: 'multi', skills: ['social.6', 'social.8'],
      prompt: 'Which of these should you think twice about before posting publicly?',
      options: ['Your home address', 'A photo of your admission letter showing your details',
        'A complaint naming a classmate', 'A photo of a sunset',
        'Your travel plans while you are away'],
      answer: [0, 1, 2, 4] },

    { id: 'soc-03', type: 'choice', skills: ['social.7'],
      prompt: 'An account offering attachment placements asks for a "processing fee" sent to a personal number before anything is confirmed. What is the right read?',
      options: ['It is almost certainly a scam — legitimate placements do not work this way',
        'It is normal practice, so pay promptly',
        'Pay half now and half later',
        'Pay, but ask for a receipt first'],
      answer: 0 },

    { id: 'soc-04', type: 'choice', skills: ['social.5'],
      prompt: 'Someone repeatedly sends you abusive messages on a platform. Which response uses the tools available to you?',
      options: ['Block the account and report it to the platform, keeping screenshots',
        'Reply angrily so they stop',
        'Delete your own account',
        'Ignore it and change nothing'],
      answer: 0 },

    { id: 'soc-05', type: 'choice', skills: ['social.8'],
      prompt: 'You delete a post an hour after publishing it. What can you rely on?',
      options: ['Nothing — anyone may already have screenshotted or shared it',
        'It is gone everywhere immediately',
        'Only your followers could have kept a copy',
        'The platform guarantees removal from all devices'],
      answer: 0 },

    { id: 'soc-06', type: 'multi', skills: ['social.1'],
      prompt: 'You are setting up a profile you may share with employers. Which choices help?',
      options: ['A clear photo of your face', 'A username based on your real name',
        'A short line saying what you study and where',
        'Your full date of birth and ID number',
        'Your home address'],
      answer: [0, 1, 2] },

    { id: 'soc-07', type: 'order', skills: ['social.5'],
      prompt: 'Put these steps in order for dealing with a harassing account.',
      steps: ['Take screenshots of the messages',
        'Report the account to the platform',
        'Block the account',
        'Tell a trainer or someone you trust if it continues'],
      answer: [0, 1, 2, 3] },

    /* social.2 — post, edit and delete content */
    { id: 'soc-08', type: 'multi', skills: ['social.2'],
      prompt: 'You published a post with a mistake in it. Which of these can you normally do to your own post?',
      options: ['Edit it to correct the mistake',
        'Delete it',
        'Change who it is shared with, on many platforms',
        'Edit other people\'s posts',
        'Guarantee it is removed from everyone who already saw or saved it'],
      answer: [0, 1, 2] },

    /* social.4 — manage connections, followers and requests */
    { id: 'soc-09', type: 'choice', skills: ['social.4'],
      prompt: 'A stranger sends you a connection or friend request. What is the sensible default?',
      options: ['Look at their profile and accept only if you know them or have a clear reason — otherwise ignore or decline',
        'Accept everyone, so your numbers grow',
        'Accept only if they have many followers',
        'Report every request you receive'],
      answer: 0 }

  ]);

})(window.DIGILIT);
