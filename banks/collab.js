/* Online Collaboration (LO4) — item bank. Original tasks.
   Netiquette, communities and tools, Google Workspace (Drive, Docs, Forms,
   Meet, Calendar), copyright/licences and mobile collaboration.
   A Google Workspace share/meet simulator is added in a later build; until then
   these knowledge items carry the standards. */
(function (D) {
  'use strict';

  D.registerItems('collab', [

    { id: 'collab-01', type: 'multi', skills: ['collab.1'],
      prompt: 'Which of these follow good netiquette in a class group chat?',
      options: [
        'Writing clearly and politely, and reading before you reply',
        'TYPING EVERYTHING IN CAPITALS to be heard',
        'Keeping messages on-topic and not spamming the group',
        'Forwarding someone’s private message without asking',
        'Respecting others’ time by being concise'],
      answer: [0, 2, 4] },

    { id: 'collab-02', type: 'choice', skills: ['collab.1'],
      prompt: 'A classmate posts an answer you think is wrong. What is the most respectful response?',
      options: [
        'Explain politely why you see it differently and offer a source',
        'Call them foolish in front of the whole group',
        'Screenshot it and mock it in another chat',
        'Report them to the administrator for being wrong'],
      answer: 0 },

    { id: 'collab-03', type: 'match', skills: ['collab.2'],
      prompt: 'Match each task to the most suitable online tool.',
      left: [
        'Store a file so several people can open it',
        'Write a report together at the same time',
        'Collect survey responses from 100 people',
        'Hold a face-to-face meeting with people far away',
        'Agree a date and remind everyone'],
      right: ['Google Drive', 'Google Docs', 'Google Forms', 'Google Meet / Zoom', 'Google Calendar'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } },

    { id: 'collab-04', type: 'choice', skills: ['collab.3'],
      prompt: 'You share a Google Drive folder and set a classmate to "Viewer". What can they do?',
      options: [
        'Open and read the files, but not change them',
        'Edit and delete the files',
        'Nothing — Viewer means they cannot open it',
        'Only they can see it; you lose access'],
      answer: 0 },

    { id: 'collab-05', type: 'choice', skills: ['collab.4'],
      prompt: 'Two people open the same Google Doc and type at once. What happens?',
      options: [
        'Both edits appear live and the document autosaves',
        'The document is locked to whoever opened it first',
        'The second person’s changes are deleted',
        'The file must be emailed back and forth to merge changes'],
      answer: 0 },

    { id: 'collab-06', type: 'choice', skills: ['collab.5'],
      prompt: 'Before joining an online meeting on Google Meet, what is the sensible thing to check?',
      options: [
        'That your camera, microphone and internet connection work',
        'That you have memorised the whole agenda',
        'That everyone else has joined first',
        'That your screen brightness is at maximum'],
      answer: 0 },

    { id: 'collab-07', type: 'choice', skills: ['collab.6'],
      prompt: 'You schedule an event in Google Calendar and add guests’ email addresses. What does adding guests do?',
      options: [
        'Sends them an invitation and puts the event on their calendars too',
        'Deletes the event from your calendar',
        'Makes the event visible to the whole internet',
        'Nothing until you print it'],
      answer: 0 },

    { id: 'collab-08', type: 'choice', skills: ['collab.7'],
      prompt: 'You find a great photo online marked "All rights reserved". Can you reuse it in your shared presentation?',
      options: [
        'Not without permission or a licence — "all rights reserved" means it is protected',
        'Yes, anything found online is free to reuse',
        'Yes, as long as you do not credit the author',
        'Only if you change its file name'],
      answer: 0 },

    { id: 'collab-09', type: 'choice', skills: ['collab.8'],
      prompt: 'You edit a shared document on your phone on the bus, then open it on a lab PC later. What makes your phone edits appear on the PC?',
      options: [
        'Synchronisation — the file syncs to the cloud and down to each signed-in device',
        'You must email the file to yourself each time',
        'Nothing; mobile and desktop versions are separate',
        'You have to retype the changes on the PC'],
      answer: 0 }

  ]);

})(window.DIGILIT);
