/* Using Email — item bank. */
(function (D) {
  'use strict';

  var ACCOUNT = 'trainee@rvnp.ac.ke';

  function mailbox(extra) {
    return Object.assign({
      account: ACCOUNT,
      vfs: new D.VFS({
        '/Documents': null, '/Downloads': null,
        '/Documents/my-cv.pdf': 'Curriculum vitae',
        '/Documents/assignment-1.docx': 'Assignment one'
      }),
      messages: [
        { from: 'j.wanjiru@rvnp.ac.ke', fromName: 'J. Wanjiru (Trainer)',
          to: [ACCOUNT], cc: ['c.otieno@rvnp.ac.ke'],
          subject: 'Term 2 assessment timetable',
          date: '19 Oct 08:14',
          body: 'Good morning,\n\nThe assessment timetable for Term 2 is attached. Please confirm that you have received it.\n\nRegards,\nJ. Wanjiru',
          attachments: [{ name: 'timetable-term2.pdf', size: 184 }] },
        { from: 'c.otieno@rvnp.ac.ke', fromName: 'C. Otieno',
          to: [ACCOUNT], subject: 'Group project notes', date: '18 Oct 16:02',
          body: 'Here are my notes from the group meeting. Can you add yours before Friday?' },
        { from: 'support@rvnp-verify-login.ru', fromName: 'IT Support',
          to: [ACCOUNT], subject: 'URGENT: your account will be closed in 24 hours',
          date: '18 Oct 03:41',
          body: 'Dear user,\n\nYour mailbox has exceeded its limit and will be CLOSED. Click the link below and confirm your username and password immediately to avoid losing your account.\n\nhttp://rvnp-verify-login.ru/confirm\n\nIT Support Team' },
        { from: 'hod.ict@rvnp.ac.ke', fromName: 'HOD, ICT Department',
          to: [ACCOUNT], subject: 'Industrial attachment letters', date: '17 Oct 11:30', read: true,
          body: 'Attachment letters are ready for collection at the department office.' }
      ]
    }, extra || {});
  }

  D.registerItems('email', [

    { id: 'email-01', type: 'match', skills: ['email.1'],
      prompt: 'In the address trainee@rvnp.ac.ke, match each part to what it is.',
      left: ['trainee', '@', 'rvnp.ac.ke'],
      right: ['The username — who the mailbox belongs to', 'The separator, read as "at"', 'The domain — which organisation hosts the mailbox'],
      answer: { 0: 0, 1: 1, 2: 2 } },

    { id: 'email-02', type: 'choice', skills: ['email.3'],
      prompt: 'You are emailing twenty trainees who do not know each other, and none of them should see the others\' addresses. Which field do you put them in?',
      options: ['Bcc', 'To', 'Cc', 'Subject'],
      answer: 0 },

    { id: 'email-03', type: 'choice', skills: ['email.4'],
      prompt: 'Which is the best subject line for a message asking your trainer to re-open a submission?',
      options: ['Request to re-open Assignment 1 submission — ICT/2026/114',
        'Hello', 'URGENT!!!', 'Question'],
      answer: 0 },

    { id: 'email-04', type: 'multi', skills: ['email.11'],
      prompt: 'Which features of a message suggest it is a phishing attempt?',
      options: ['It threatens that your account will be closed within hours',
        'It asks you to confirm your username and password by clicking a link',
        'The sender\'s domain is not your organisation\'s domain',
        'It was sent in the middle of the night',
        'It addresses you as "Dear user" rather than by name'],
      answer: [0, 1, 2, 4] },

    { id: 'email-05', type: 'choice', skills: ['email.5'],
      prompt: 'A message was sent to you with three colleagues in Cc. Your answer concerns only the sender. What should you use?',
      options: ['Reply', 'Reply all', 'Forward', 'Bcc everyone'],
      answer: 0 },

    /* ---- simulations ---- */

    { id: 'email-06', type: 'sim', env: 'mail', skills: ['email.2', 'email.4'],
      prompt: 'Send a message to c.otieno@rvnp.ac.ke with the subject "Group project notes received" and any short message in the body.',
      setup: mailbox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.to.indexOf('c.otieno@rvnp.ac.ke') !== -1 &&
            D.norm(m.subject) === 'group project notes received' &&
            D.norm(m.body).length > 0;
        });
      } },

    { id: 'email-07', type: 'sim', env: 'mail', skills: ['email.5'],
      prompt: 'Reply to the trainer\'s message about the Term 2 assessment timetable, confirming you received it.',
      note: 'Only the trainer needs the reply.',
      setup: mailbox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.to.indexOf('j.wanjiru@rvnp.ac.ke') !== -1 &&
            /^re:/i.test(m.subject || '') && D.norm(m.body).length > 0;
        });
      } },

    { id: 'email-08', type: 'sim', env: 'mail', skills: ['email.5', 'email.3'],
      prompt: 'Reply to everyone who received the Term 2 assessment timetable message, not just the sender.',
      setup: mailbox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.to.indexOf('j.wanjiru@rvnp.ac.ke') !== -1 &&
            (m.cc || []).indexOf('c.otieno@rvnp.ac.ke') !== -1;
        });
      } },

    { id: 'email-09', type: 'sim', env: 'mail', skills: ['email.6'],
      prompt: 'Forward the message about industrial attachment letters to c.otieno@rvnp.ac.ke.',
      setup: mailbox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.mode === 'forward' && m.to.indexOf('c.otieno@rvnp.ac.ke') !== -1 &&
            /attachment letters/i.test(m.subject || '');
        });
      } },

    { id: 'email-10', type: 'sim', env: 'mail', skills: ['email.7'],
      prompt: 'Send your CV to hod.ict@rvnp.ac.ke. The file my-cv.pdf is in Documents and must be attached.',
      note: 'Use Attach file in the compose window. Check it is listed before you send.',
      setup: mailbox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.to.indexOf('hod.ict@rvnp.ac.ke') !== -1 &&
            (m.attachments || []).some(function (a) { return a.name === 'my-cv.pdf'; });
        });
      } },

    { id: 'email-11', type: 'sim', env: 'mail', skills: ['email.8'],
      prompt: 'Save the attachment on the Term 2 assessment timetable message to the Downloads folder.',
      setup: mailbox,
      check: function (s) { return s.vfs.exists('/Downloads/timetable-term2.pdf'); } },

    { id: 'email-12', type: 'sim', env: 'mail', skills: ['email.11', 'email.10'],
      prompt: 'One message in the inbox is a phishing attempt. Report it as spam. Do not click anything in it.',
      setup: mailbox,
      check: function (s) {
        var spam = s.folders.Spam || [];
        var movedRight = spam.some(function (m) { return /rvnp-verify-login/.test(m.from); });
        var movedWrong = spam.some(function (m) { return !/rvnp-verify-login/.test(m.from); });
        return movedRight && !movedWrong;
      } },

    { id: 'email-13', type: 'sim', env: 'mail', skills: ['email.12'],
      prompt: 'Archive the message from C. Otieno about the group project notes, keeping it out of the inbox but not deleting it.',
      setup: mailbox,
      check: function (s) {
        return (s.folders.Archive || []).some(function (m) { return /group project/i.test(m.subject); });
      } },

    /* email.9 — tell read messages from unread ones */
    { id: 'email-14', type: 'choice', skills: ['email.9'],
      prompt: 'In the message list, how can you usually tell an unread message from one you have already read?',
      options: ['Unread messages are shown in bold, often with a coloured dot or bar; read ones are not',
        'Unread messages appear in a separate app',
        'Read messages are always deleted automatically',
        'There is no way to tell them apart'],
      answer: 0 }

  ]);

})(window.DIGILIT);
