/* Windows 10 Skills — item bank. Same ground as Windows 11 against the left-aligned Start. */
(function (D) {
  'use strict';

  function desk(extra) {
    return Object.assign({
      flavour: 'win10',
      fs: {
        '/Desktop': null,
        '/Documents': null, '/Documents/Practicals': null,
        '/Documents/Practicals/week-01.txt': 'Week one practical.',
        '/Downloads': null, '/Downloads/syllabus.pdf': 'Syllabus',
        '/Pictures': null, '/Pictures/lab-photo.png': 'Lab photo'
      }
    }, extra || {});
  }

  D.registerItems('win10', [

    { id: 'win10-01', type: 'choice', skills: ['win10.3'],
      prompt: 'Several programs are open. What is the quickest way to switch to one of them?',
      options: ['Click its button on the taskbar', 'Shut down and start it again',
        'Open the Start menu and launch a second copy', 'Right-click the desktop'],
      answer: 0 },

    { id: 'win10-02', type: 'choice', skills: ['win10.9'],
      prompt: 'You have finished copying files to a flash disk. What should you do before pulling it out?',
      options: ['Eject it safely, then remove it', 'Pull it out as soon as copying finishes',
        'Shut down the computer first every time', 'Delete the files from the computer first'],
      answer: 0 },

    { id: 'win10-03', type: 'order', skills: ['win10.6'],
      prompt: 'Put these steps in order for moving a file from Downloads into Documents using cut and paste.',
      steps: ['Open the Downloads folder', 'Select the file', 'Choose Cut',
        'Open the Documents folder', 'Choose Paste', 'Check the file is no longer in Downloads'],
      answer: [0, 1, 2, 3, 4, 5] },

    { id: 'win10-04', type: 'multi', skills: ['win10.12'],
      prompt: 'Which of these leave the computer secured if you step away from it?',
      options: ['Lock', 'Sign out', 'Shut down', 'Minimise all windows', 'Turn off the monitor only'],
      answer: [0, 1, 2] },

    /* ---- simulations ---- */

    { id: 'win10-05', type: 'sim', env: 'os', skills: ['win10.2'],
      prompt: 'Open File Explorer from the Start menu.',
      setup: desk({ open: [] }),
      check: function (s) {
        return s.windows.some(function (w) { return w.app === 'files'; }) ||
          s.events.some(function (e) { return e.name === 'open-app' && e.detail === 'files'; });
      } },

    { id: 'win10-06', type: 'sim', env: 'os', skills: ['win10.5'],
      prompt: 'Create a folder called Week 02 inside the Practicals folder in Documents.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) {
        var n = s.vfs.get('/Documents/Practicals/Week 02');
        return !!n && n.type === 'dir';
      } },

    { id: 'win10-07', type: 'sim', env: 'os', skills: ['win10.6'],
      prompt: 'Move syllabus.pdf from Downloads into Documents.',
      setup: desk({ open: [{ app: 'files', path: '/Downloads' }] }),
      check: function (s) {
        return s.vfs.exists('/Documents/syllabus.pdf') && !s.vfs.exists('/Downloads/syllabus.pdf');
      } },

    { id: 'win10-08', type: 'sim', env: 'os', skills: ['win10.8'],
      prompt: 'lab-photo.png has been deleted. Restore it so it is back in Pictures.',
      setup: desk({ open: [{ app: 'recycle' }], trash: ['/Pictures/lab-photo.png'] }),
      check: function (s) { return s.vfs.exists('/Pictures/lab-photo.png'); } },

    { id: 'win10-09', type: 'sim', env: 'os', skills: ['win10.10'],
      prompt: 'Reduce the screen brightness to 30% or less.',
      note: 'Settings › Display.',
      setup: desk({ settings: { brightness: 90 } }),
      check: function (s) { return s.settings.brightness <= 30; } },

    { id: 'win10-10', type: 'sim', env: 'os', skills: ['win10.12'],
      prompt: 'Restart the computer.',
      setup: desk({}),
      check: function (s) { return s.power === 'restart'; } },

    /* win10.1 — sign in and sign out */
    { id: 'win10-11', type: 'sim', env: 'os', skills: ['win10.1'],
      prompt: 'You have finished your session. Sign out of the user account.',
      note: 'Start menu › the user / power area › Sign out. (Lock and Sign out both return to the sign-in screen.)',
      setup: desk({}),
      check: function (s) { return s.power === 'lock'; } },

    /* win10.4 — resize, move, snap and close windows */
    { id: 'win10-12', type: 'sim', env: 'os', skills: ['win10.4'],
      prompt: 'Close the File Explorer window that is open.',
      note: 'Use the ✕ button in the top-right corner of the window.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) { return !s.windows.some(function (w) { return w.app === 'files'; }); } },

    /* win10.7 — search for a file by name */
    { id: 'win10-13', type: 'sim', env: 'os', skills: ['win10.7'],
      prompt: 'You cannot remember where week-01.txt was saved. Search for it by name.',
      note: 'Use the search box in File Explorer, or the Search box on the taskbar / Start menu.',
      setup: desk({ open: [{ app: 'files', path: '/' }] }),
      check: function (s) {
        return s.events.some(function (e) { return e.name === 'search' && /week-?0?1/i.test(String(e.detail || '')); });
      } },

    /* win10.11 — connect to a wireless network */
    { id: 'win10-14', type: 'sim', env: 'os', skills: ['win10.11'],
      prompt: 'Connect the computer to the RVNP-Trainees wireless network. The security key is Trainee2026.',
      note: 'Settings › Network & internet › Wi-Fi, or the network button in the system tray.',
      setup: desk({ settings: { wifi: null } }),
      check: function (s) { return s.settings.wifi === 'RVNP-Trainees'; } }

  ]);

})(window.DIGILIT);
