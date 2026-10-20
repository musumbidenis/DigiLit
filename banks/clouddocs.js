/* Cloud Documents — item bank (knowledge items only so far).
   Simulations here need the document editor environment; see banks/word.js. */
(function (D) {
  'use strict';

  D.registerItems('clouddocs', [

    { id: 'cd-01', type: 'choice', skills: ['clouddocs.2'],
      prompt: 'You are typing in a browser-based document and the power goes off. What is the likely position?',
      options: ['Your work was saved automatically as you typed and will be there when you sign in again',
        'Everything since you opened the document is lost',
        'Only the first page survives',
        'The document is permanently corrupted'],
      answer: 0 },

    { id: 'cd-02', type: 'match', skills: ['clouddocs.4'],
      prompt: 'Match each sharing permission to what the other person can do.',
      left: ['Viewer', 'Commenter', 'Editor'],
      right: ['Read it only', 'Read it and leave comments', 'Change the content'],
      answer: { 0: 0, 1: 1, 2: 2 } },

    { id: 'cd-03', type: 'choice', skills: ['clouddocs.6'],
      prompt: 'Your trainer wants to propose changes without altering your text directly. Which mode should they use?',
      options: ['Suggesting mode', 'Editing mode', 'Viewing mode', 'Offline mode'],
      answer: 0 },

    { id: 'cd-04', type: 'choice', skills: ['clouddocs.7'],
      prompt: 'A classmate overwrote a section of a shared document yesterday. What recovers the earlier text?',
      options: ['Version history', 'Undo, next time you open it',
        'The Trash', 'Nothing — shared documents cannot be rolled back'],
      answer: 0 },

    { id: 'cd-05', type: 'choice', skills: ['clouddocs.8'],
      prompt: 'An employer asks for your document as a PDF, but you wrote it in a browser-based editor. What do you do?',
      options: ['Download or export it as a PDF and send that file',
        'Send the editing link instead',
        'Copy the text into the body of an email',
        'Print it and photograph the pages'],
      answer: 0 },

    { id: 'cd-06', type: 'multi', skills: ['clouddocs.4'],
      prompt: 'Which practices reduce the risk when sharing a document widely?',
      options: ['Giving view access rather than edit access by default',
        'Sharing with named people instead of "anyone with the link"',
        'Reviewing who has access from time to time',
        'Turning off download for sensitive documents',
        'Sharing the link publicly so nobody is left out'],
      answer: [0, 1, 2, 3] },

    /* clouddocs.1 — create a document in a browser-based editor */
    { id: 'cd-07', type: 'order', skills: ['clouddocs.1'],
      prompt: 'Put these steps in order for starting a new document in a browser-based editor like Google Docs.',
      steps: ['Sign in to your account in the browser',
        'Open the documents app (for example Google Docs)',
        'Choose Blank document / New',
        'Give the document a title',
        'Start typing — it saves as you go'],
      answer: [0, 1, 2, 3, 4] },

    /* clouddocs.3 — format text and paragraphs */
    { id: 'cd-08', type: 'choice', skills: ['clouddocs.3'],
      prompt: 'In a browser-based document, where are the controls for bold, font size, alignment and lists usually found?',
      options: ['On a toolbar across the top of the document',
        'Only by right-clicking the file in the folder list',
        'In the browser\'s own address bar',
        'They are not available in browser-based editors'],
      answer: 0 },

    /* clouddocs.5 — add, reply to and resolve comments */
    { id: 'cd-09', type: 'choice', skills: ['clouddocs.5'],
      prompt: 'A classmate left a comment on your shared document and you have now dealt with it. What keeps the document tidy?',
      options: ['Mark the comment as Resolved so it is cleared from view but still recoverable',
        'Delete the whole document and start again',
        'Ignore it — comments disappear on their own',
        'Remove the classmate\'s access'],
      answer: 0 },

    /* clouddocs.9 — work offline and sync when reconnected */
    { id: 'cd-10', type: 'choice', skills: ['clouddocs.9'],
      prompt: 'You edited a shared document on your phone while the data was off. What happens when you get back online?',
      options: ['The changes sync automatically and the online copy updates',
        'The changes are lost because you were offline',
        'You must retype everything',
        'The document becomes read-only permanently'],
      answer: 0 },

    /* clouddocs.10 — organise files into folders in cloud storage */
    { id: 'cd-11', type: 'choice', skills: ['clouddocs.10'],
      prompt: 'Your cloud drive is a jumble of files. What makes work easier to find later?',
      options: ['Create folders (for example by unit or term) and move related files into them',
        'Give every file the same name',
        'Keep everything in the main drive with no folders',
        'Delete older files you are unsure about'],
      answer: 0 }

  ]);

})(window.DIGILIT);
