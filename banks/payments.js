/* Mobile Money and Digital Payments — RVNP addition. */
(function (D) {
  'use strict';

  D.registerItems('payments', [

    { id: 'pay-01', type: 'choice', skills: ['payments.5'],
      prompt: 'A caller says they are from your mobile money provider and asks you to read out the PIN you just received so they can reverse a wrong payment. What should you do?',
      options: ['Refuse and hang up — no genuine provider ever asks for your PIN',
        'Read it out, since they called you',
        'Read out only half of it', 'Send the PIN by SMS instead of speaking it'],
      answer: 0 },

    { id: 'pay-02', type: 'multi', skills: ['payments.3'],
      prompt: 'Which details on a payment confirmation message should you check before releasing goods?',
      options: ['The amount', 'The recipient name', 'The transaction code',
        'The time it was sent', 'The font used in the message'],
      answer: [0, 1, 2, 3] },

    { id: 'pay-03', type: 'choice', skills: ['payments.3'],
      prompt: 'A customer shows you a confirmation message on their phone, but nothing has arrived on yours. What is the safest response?',
      options: ['Check your own balance or statement before handing anything over',
        'Accept it — the screenshot is proof',
        'Accept it if the amount is small',
        'Ask them to forward the message to you'],
      answer: 0 },

    { id: 'pay-04', type: 'match', skills: ['payments.2'],
      prompt: 'Match each payment situation to what you would use.',
      left: ['Paying an electricity bill', 'Paying at a shop counter', 'Sending money to a relative'],
      right: ['A paybill number and an account number', 'A till number', 'The recipient\'s phone number'],
      answer: { 0: 0, 1: 1, 2: 2 } },

    { id: 'pay-05', type: 'order', skills: ['payments.6'],
      prompt: 'You sent money to the wrong number. Put these steps in order.',
      steps: ['Stop and check the confirmation message for the number and amount',
        'Use the provider\'s reversal option as soon as possible',
        'Contact the provider\'s customer care with the transaction code',
        'Keep a record of the reference you are given'],
      answer: [0, 1, 2, 3] },

    { id: 'pay-06', type: 'multi', skills: ['payments.7'],
      prompt: 'An online seller on social media offers a phone well below market price. Which signs should make you cautious?',
      options: ['They insist on full payment to a personal number before any meeting',
        'The account was created recently and has few posts',
        'They refuse to meet in person or use an escrow service',
        'They pressure you to decide within minutes',
        'They have a profile photo'],
      answer: [0, 1, 2, 3] },

    { id: 'pay-07', type: 'choice', skills: ['payments.4'],
      prompt: 'Why is it worth checking a mini statement rather than relying on remembered balances?',
      options: ['It shows transactions you may not have noticed, including charges and withdrawals',
        'It increases your transaction limit',
        'It is required before every payment',
        'It cancels pending payments'],
      answer: 0 },

    { id: 'pay-08', type: 'typein', skills: ['payments.5'],
      prompt: 'Complete the rule: a genuine provider will never ask you for your ______.',
      placeholder: 'One word',
      accept: ['pin', 'pin number', 'password', 'secret pin'] },

    /* payments.1 — send and receive money */
    { id: 'pay-09', type: 'order', skills: ['payments.1'],
      prompt: 'Put these steps in order for sending money to someone on a mobile money service.',
      steps: ['Open the mobile money menu or app',
        'Choose Send Money',
        'Enter the recipient\'s phone number',
        'Enter the amount',
        'Enter your PIN to authorise it',
        'Check the confirmation message against what you intended'],
      answer: [0, 1, 2, 3, 4, 5] }

  ]);

})(window.DIGILIT);
