/* Windows 11 Skills — item bank. File management, settings and the desktop shell. */
(function (D) {
  'use strict';

  function desk(extra) {
    return Object.assign({
      flavour: 'win11',
      fs: {
        '/Desktop': null,
        '/Documents': null,
        '/Documents/Term 1': null,
        '/Documents/Term 1/class-notes.txt': 'Notes from term one.',
        '/Documents/budget.xlsx': 'Budget workbook',
        '/Downloads': null,
        '/Downloads/fees-structure.pdf': 'Fee structure 2026',
        '/Downloads/photo-001.png': 'Photo',
        '/Pictures': null,
        '/Pictures/id-badge.png': 'Badge'
      }
    }, extra || {});
  }

  D.registerItems('win11', [

    { id: 'win11-01', type: 'choice', skills: ['win11.2'],
      prompt: 'On Windows 11, where does the Start button sit by default?',
      options: ['Centred on the taskbar', 'At the far left of the taskbar',
        'At the top right of the screen', 'On the desktop, not the taskbar'],
      answer: 0 },

    { id: 'win11-02', type: 'choice', skills: ['win11.6'],
      prompt: 'What is the difference between copying a file and moving it?',
      options: ['Copying leaves the original where it was; moving does not',
        'Copying is faster but otherwise identical',
        'Moving leaves a shortcut behind; copying does not',
        'There is no difference — the words mean the same thing'],
      answer: 0 },

    { id: 'win11-03', type: 'choice', skills: ['win11.8'],
      prompt: 'You deleted a file this morning and now need it back. Where do you look first?',
      options: ['The Recycle Bin', 'The Downloads folder', 'The Start menu', 'Settings'],
      answer: 0 },

    { id: 'win11-04', type: 'multi', skills: ['win11.9'],
      prompt: 'Which of these can you change from quick settings without opening the full Settings app?',
      options: ['Wi-Fi connection', 'Volume', 'Screen brightness', 'Which programs run at startup', 'Your user password'],
      answer: [0, 1, 2] },

    /* ---- simulations ---- */

    { id: 'win11-05', type: 'sim', env: 'os', skills: ['win11.5'],
      prompt: 'Create a new folder called Assignments inside Documents.',
      note: 'Toolbar, right-click menu — whichever you prefer.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) {
        var n = s.vfs.get('/Documents/Assignments');
        return !!n && n.type === 'dir';
      } },

    { id: 'win11-06', type: 'sim', env: 'os', skills: ['win11.5'],
      prompt: 'Rename the folder "Term 1" inside Documents to "Term One".',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) {
        return s.vfs.exists('/Documents/Term One') && !s.vfs.exists('/Documents/Term 1');
      } },

    { id: 'win11-07', type: 'sim', env: 'os', skills: ['win11.6'],
      prompt: 'Move fees-structure.pdf out of Downloads and into Documents.',
      note: 'Moving means it should no longer be in Downloads afterwards.',
      setup: desk({ open: [{ app: 'files', path: '/Downloads' }] }),
      check: function (s) {
        return s.vfs.exists('/Documents/fees-structure.pdf') && !s.vfs.exists('/Downloads/fees-structure.pdf');
      } },

    { id: 'win11-08', type: 'sim', env: 'os', skills: ['win11.6'],
      prompt: 'Put a copy of id-badge.png into Documents, leaving the original in Pictures.',
      setup: desk({ open: [{ app: 'files', path: '/Pictures' }] }),
      check: function (s) {
        return s.vfs.exists('/Documents/id-badge.png') && s.vfs.exists('/Pictures/id-badge.png');
      } },

    { id: 'win11-09', type: 'sim', env: 'os', skills: ['win11.6', 'win11.5'],
      prompt: 'Delete photo-001.png from Downloads.',
      setup: desk({ open: [{ app: 'files', path: '/Downloads' }] }),
      check: function (s) {
        return !s.vfs.exists('/Downloads/photo-001.png') &&
          s.vfs.trash.some(function (t) { return t.node.name === 'photo-001.png'; });
      } },

    { id: 'win11-10', type: 'sim', env: 'os', skills: ['win11.8'],
      prompt: 'budget.xlsx was deleted by mistake. Recover it so it is back in Documents.',
      setup: desk({ open: [{ app: 'recycle' }], trash: ['/Documents/budget.xlsx'] }),
      check: function (s) { return s.vfs.exists('/Documents/budget.xlsx'); } },

    { id: 'win11-11', type: 'sim', env: 'os', skills: ['win11.7'],
      prompt: 'You cannot remember where the fee structure was saved. Search for it by name.',
      note: 'Use the search box in File Explorer or on the Start menu.',
      setup: desk({ open: [{ app: 'files', path: '/' }] }),
      check: function (s) {
        return s.events.some(function (e) {
          return e.name === 'search' && /fee/i.test(String(e.detail || ''));
        });
      } },

    { id: 'win11-12', type: 'sim', env: 'os', skills: ['win11.10', 'win11.11'],
      prompt: 'Connect the computer to the RVNP-Staff wireless network. The security key is Polytechnic2026.',
      note: 'Settings › Network and internet.',
      setup: desk({ settings: { wifi: null } }),
      check: function (s) { return s.settings.wifi === 'RVNP-Staff'; } },

    { id: 'win11-13', type: 'sim', env: 'os', skills: ['win11.4'],
      prompt: 'Maximise the File Explorer window so it fills the whole screen.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) {
        var w = s.windows.filter(function (x) { return x.app === 'files'; })[0];
        return !!w && w.max === true;
      } },

    { id: 'win11-14', type: 'sim', env: 'os', skills: ['win11.5'],
      prompt: 'Using the Text Editor, create a file called attendance.txt in Documents containing any sentence.',
      note: 'Open the Text Editor from the Start menu, type something, then Save As.',
      setup: desk({}),
      check: function (s) {
        var n = s.vfs.get('/Documents/attendance.txt');
        return !!n && n.type === 'file' && String(n.content).trim().length > 0;
      } },

    { id: 'win11-15', type: 'sim', env: 'os', skills: ['win11.12', 'win11.1'],
      prompt: 'You are leaving the lab for ten minutes and must not leave your account open. Lock the computer.',
      note: 'Signing out or locking both secure the machine; shutting it down would lose your open work.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }] }),
      check: function (s) { return s.power === 'lock'; } },

    /* win11.3 — use the taskbar to switch between open programs */
    { id: 'win11-16', type: 'sim', env: 'os', skills: ['win11.3'],
      prompt: 'Both File Explorer and Settings are open, and Settings is in front. Bring File Explorer to the front using the taskbar.',
      note: 'Click the File Explorer button on the taskbar.',
      setup: desk({ open: [{ app: 'files', path: '/Documents' }, { app: 'settings' }] }),
      check: function (s) {
        var f = s.windows.filter(function (w) { return w.id === s.focus; })[0];
        return !!f && f.app === 'files' && !f.min;
      } }

  ]);

})(window.DIGILIT);
