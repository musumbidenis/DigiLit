/* Basic Computer Skills — item bank. Original tasks. */
(function (D) {
  'use strict';

  var DESK_SVG =
    '<rect x="0" y="0" width="600" height="300" fill="#f3f1ec"/>' +
    '<rect x="0" y="252" width="600" height="48" fill="#e2dbcd"/>' +
    /* tower */
    '<rect x="36" y="64" width="84" height="186" rx="6" fill="#39424f"/>' +
    '<rect x="48" y="80" width="60" height="9" rx="3" fill="#6d7886"/>' +
    '<rect x="48" y="96" width="60" height="9" rx="3" fill="#6d7886"/>' +
    '<circle cx="60" cy="126" r="6" fill="#4fb3bf"/>' +
    '<rect x="48" y="146" width="36" height="5" rx="2" fill="#5c6775"/>' +
    /* monitor */
    '<rect x="176" y="34" width="214" height="136" rx="8" fill="#2b333e"/>' +
    '<rect x="186" y="44" width="194" height="112" rx="3" fill="#8fd0d6"/>' +
    '<rect x="266" y="170" width="34" height="34" fill="#39424f"/>' +
    '<rect x="228" y="204" width="110" height="10" rx="5" fill="#39424f"/>' +
    /* keyboard */
    '<rect x="186" y="228" width="190" height="38" rx="5" fill="#cfcabf"/>' +
    '<g fill="#a9a396">' +
    '<rect x="194" y="235" width="14" height="9" rx="2"/><rect x="212" y="235" width="14" height="9" rx="2"/>' +
    '<rect x="230" y="235" width="14" height="9" rx="2"/><rect x="248" y="235" width="14" height="9" rx="2"/>' +
    '<rect x="266" y="235" width="14" height="9" rx="2"/><rect x="284" y="235" width="14" height="9" rx="2"/>' +
    '<rect x="302" y="235" width="14" height="9" rx="2"/><rect x="320" y="235" width="14" height="9" rx="2"/>' +
    '<rect x="338" y="235" width="14" height="9" rx="2"/><rect x="194" y="250" width="120" height="9" rx="2"/>' +
    '</g>' +
    /* mouse */
    '<ellipse cx="412" cy="246" rx="19" ry="26" fill="#cfcabf"/>' +
    '<path d="M412 221v16" stroke="#a9a396" stroke-width="2"/>' +
    /* speaker */
    '<rect x="452" y="150" width="40" height="92" rx="5" fill="#49525f"/>' +
    '<circle cx="472" cy="176" r="11" fill="#2b333e"/><circle cx="472" cy="212" r="7" fill="#2b333e"/>' +
    /* printer */
    '<rect x="498" y="88" width="84" height="56" rx="6" fill="#d8d3c7"/>' +
    '<rect x="510" y="72" width="60" height="16" rx="3" fill="#bdb7a9"/>' +
    '<rect x="508" y="130" width="64" height="22" rx="3" fill="#fff" stroke="#bdb7a9"/>';

  var PORTS_SVG =
    '<rect x="0" y="0" width="600" height="260" fill="#2b333e"/>' +
    '<rect x="24" y="24" width="552" height="212" rx="10" fill="#39424f" stroke="#55606e"/>' +
    /* USB-A pair */
    '<rect x="64" y="70" width="58" height="26" rx="3" fill="#121820" stroke="#7d8896"/>' +
    '<rect x="70" y="80" width="46" height="9" fill="#9aa5b3"/>' +
    '<rect x="64" y="112" width="58" height="26" rx="3" fill="#121820" stroke="#7d8896"/>' +
    '<rect x="70" y="122" width="46" height="9" fill="#9aa5b3"/>' +
    /* RJ45 ethernet */
    '<path d="M176 68h62v34h-14v10h-34v-10h-14z" fill="#121820" stroke="#7d8896"/>' +
    '<g fill="#9aa5b3"><rect x="186" y="76" width="5" height="12"/><rect x="196" y="76" width="5" height="12"/>' +
    '<rect x="206" y="76" width="5" height="12"/><rect x="216" y="76" width="5" height="12"/></g>' +
    /* HDMI */
    '<path d="M292 76h78l-8 24h-62z" fill="#121820" stroke="#7d8896"/>' +
    '<path d="M300 82h62l-5 12h-52z" fill="#9aa5b3"/>' +
    /* VGA */
    '<path d="M292 136h78l-9 26h-60z" fill="#121820" stroke="#7d8896"/>' +
    '<g fill="#9aa5b3"><circle cx="306" cy="146" r="2.6"/><circle cx="318" cy="146" r="2.6"/><circle cx="330" cy="146" r="2.6"/>' +
    '<circle cx="342" cy="146" r="2.6"/><circle cx="354" cy="146" r="2.6"/>' +
    '<circle cx="312" cy="155" r="2.6"/><circle cx="324" cy="155" r="2.6"/><circle cx="336" cy="155" r="2.6"/><circle cx="348" cy="155" r="2.6"/></g>' +
    /* audio jacks */
    '<circle cx="432" cy="84" r="15" fill="#121820" stroke="#7d8896"/><circle cx="432" cy="84" r="7" fill="#5aa75a"/>' +
    '<circle cx="432" cy="130" r="15" fill="#121820" stroke="#7d8896"/><circle cx="432" cy="130" r="7" fill="#cf7b9b"/>' +
    /* power inlet */
    '<rect x="486" y="150" width="66" height="44" rx="5" fill="#121820" stroke="#7d8896"/>' +
    '<g fill="#9aa5b3"><circle cx="506" cy="172" r="4.5"/><circle cx="519" cy="164" r="4.5"/><circle cx="532" cy="172" r="4.5"/></g>' +
    '<text x="48" y="222" fill="#7d8896" font-size="13" font-family="system-ui">Back panel of a desktop computer</text>';

  D.registerItems('bcs', [

    { id: 'bcs-01', type: 'hotspot', skills: ['bcs.2'],
      prompt: 'Click the system unit.',
      scene: { viewBox: '0 0 600 300', alt: 'A desktop computer setup on a desk', svg: DESK_SVG,
        targets: [
          { id: 'tower', x: 32, y: 60, w: 92, h: 194, label: 'tall box' },
          { id: 'monitor', x: 172, y: 30, w: 222, h: 180, label: 'screen' },
          { id: 'keyboard', x: 182, y: 224, w: 198, h: 46, label: 'keys' },
          { id: 'mouse', x: 390, y: 216, w: 46, h: 60, label: 'pointer device' },
          { id: 'speaker', x: 448, y: 146, w: 48, h: 100, label: 'sound box' },
          { id: 'printer', x: 494, y: 68, w: 92, h: 88, label: 'paper machine' }
        ] },
      answer: 'tower' },

    { id: 'bcs-02', type: 'hotspot', skills: ['bcs.2', 'bcs.3'],
      prompt: 'Click the device you would use to produce a hard copy on paper.',
      scene: { viewBox: '0 0 600 300', alt: 'A desktop computer setup on a desk', svg: DESK_SVG,
        targets: [
          { id: 'tower', x: 32, y: 60, w: 92, h: 194 },
          { id: 'monitor', x: 172, y: 30, w: 222, h: 180 },
          { id: 'keyboard', x: 182, y: 224, w: 198, h: 46 },
          { id: 'mouse', x: 390, y: 216, w: 46, h: 60 },
          { id: 'speaker', x: 448, y: 146, w: 48, h: 100 },
          { id: 'printer', x: 494, y: 68, w: 92, h: 88 }
        ] },
      answer: 'printer' },

    { id: 'bcs-03', type: 'hotspot', skills: ['bcs.4'],
      prompt: 'Click the network port — the one an Ethernet cable plugs into.',
      scene: { viewBox: '0 0 600 260', alt: 'The back panel of a desktop computer showing its ports', svg: PORTS_SVG,
        targets: [
          { id: 'usb', x: 58, y: 64, w: 70, h: 80, label: 'rectangular ports' },
          { id: 'ethernet', x: 170, y: 62, w: 74, h: 56, label: 'wide port with a clip' },
          { id: 'hdmi', x: 286, y: 70, w: 90, h: 36, label: 'flat tapered port' },
          { id: 'vga', x: 286, y: 130, w: 90, h: 38, label: 'port with pin holes' },
          { id: 'audio', x: 412, y: 64, w: 42, h: 88, label: 'round coloured sockets' },
          { id: 'power', x: 482, y: 146, w: 74, h: 52, label: 'three-pin inlet' }
        ] },
      answer: 'ethernet' },

    { id: 'bcs-04', type: 'hotspot', skills: ['bcs.4'],
      prompt: 'A trainee wants to plug in a flash disk. Click the port they should use.',
      scene: { viewBox: '0 0 600 260', alt: 'The back panel of a desktop computer showing its ports', svg: PORTS_SVG,
        targets: [
          { id: 'usb', x: 58, y: 64, w: 70, h: 80 },
          { id: 'ethernet', x: 170, y: 62, w: 74, h: 56 },
          { id: 'hdmi', x: 286, y: 70, w: 90, h: 36 },
          { id: 'vga', x: 286, y: 130, w: 90, h: 38 },
          { id: 'audio', x: 412, y: 64, w: 42, h: 88 },
          { id: 'power', x: 482, y: 146, w: 74, h: 52 }
        ] },
      answer: 'usb' },

    { id: 'bcs-05', type: 'choice', skills: ['bcs.1'],
      prompt: 'Which of these is software?',
      options: ['A web browser', 'A keyboard', 'A monitor', 'A flash disk'],
      answer: 0 },

    { id: 'bcs-06', type: 'match', skills: ['bcs.3'],
      prompt: 'Sort each device into input, output or storage.',
      left: ['Microphone', 'Projector', 'External hard disk', 'Scanner', 'Headphones'],
      right: ['Input', 'Output', 'Storage'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 0, 4: 1 } },

    { id: 'bcs-07', type: 'multi', skills: ['bcs.6'],
      prompt: 'Which keys would you use to type a single capital letter?',
      options: ['Shift (held down with the letter)', 'Caps Lock (pressed, then the letter, then pressed again)',
        'Backspace', 'Enter', 'Tab'],
      answer: [0, 1] },

    { id: 'bcs-08', type: 'choice', skills: ['bcs.5'],
      prompt: 'You want to see the options available for a file — rename, copy, delete. Which mouse action opens that list?',
      options: ['Right-click on the file', 'Double-click the file', 'Single left-click the file', 'Scroll over the file'],
      answer: 0 },

    { id: 'bcs-09', type: 'order', skills: ['bcs.9'],
      prompt: 'Put these steps in the correct order for shutting down a computer properly.',
      steps: ['Save the work you have open', 'Close the programs you are using',
        'Open the Start menu', 'Choose Power', 'Choose Shut down', 'Switch off at the wall once the screen is dark'],
      answer: [0, 1, 2, 3, 4, 5] },

    { id: 'bcs-10', type: 'choice', skills: ['bcs.10'],
      prompt: 'What does an operating system do?',
      options: ['Manages the hardware and runs the programs you use',
        'Connects the computer to the electricity supply',
        'Stores all your files permanently even without a hard disk',
        'Protects the computer from physical damage'],
      answer: 0 },

    { id: 'bcs-11', type: 'choice', skills: ['bcs.11'],
      prompt: 'Which of these storage sizes is the largest?',
      options: ['1 terabyte (TB)', '1 gigabyte (GB)', '1 megabyte (MB)', '1 kilobyte (KB)'],
      answer: 0, keepOrder: true },

    { id: 'bcs-12', type: 'typein', skills: ['bcs.8'],
      prompt: 'What is the name of the window control that hides a window without closing it, leaving it on the taskbar?',
      placeholder: 'One word',
      accept: ['minimise', 'minimize', 'minimise button', 'minimize button', 'the minimise button'] },

    /* ---- simulations ---- */

    { id: 'bcs-13', type: 'sim', env: 'os', skills: ['bcs.7'],
      prompt: 'Open the Settings app.',
      note: 'Use the Start menu on the taskbar. Any route that gets Settings open counts.',
      setup: { flavour: 'win11', open: [] },
      check: function (s) {
        return s.windows.some(function (w) { return w.app === 'settings'; }) ||
          s.events.some(function (e) { return e.name === 'open-app' && e.detail === 'settings'; });
      } },

    { id: 'bcs-14', type: 'sim', env: 'os', skills: ['bcs.12'],
      prompt: 'Mute the computer by setting the volume to 0.',
      note: 'Settings › Sound. The speaker icon in the system tray takes you there too.',
      setup: { flavour: 'win11', settings: { volume: 65 } },
      check: function (s) { return s.settings.volume === 0; } },

    { id: 'bcs-15', type: 'sim', env: 'os', skills: ['bcs.12'],
      prompt: 'Change the desktop background to the green one.',
      note: 'Settings › Personalisation, or right-click the desktop and choose Personalise.',
      setup: { flavour: 'win11', settings: { wallpaper: 'teal' } },
      check: function (s) { return s.settings.wallpaper === 'moss'; } },

    { id: 'bcs-16', type: 'sim', env: 'os', skills: ['bcs.8'],
      prompt: 'Minimise the File Explorer window so the desktop is visible, without closing it.',
      setup: { flavour: 'win11', open: [{ app: 'files', path: '/Documents' }] },
      check: function (s) {
        var w = s.windows.filter(function (x) { return x.app === 'files'; })[0];
        return !!w && w.min === true;
      } },

    { id: 'bcs-17', type: 'sim', env: 'os', skills: ['bcs.9'],
      prompt: 'Shut the computer down correctly.',
      note: 'Do not simply walk away — use the proper route.',
      setup: { flavour: 'win11', open: [{ app: 'files', path: '/Documents' }] },
      check: function (s) { return s.power === 'shutdown'; } },

    /* ---- digital literacy, functions, classification, software ---- */

    { id: 'bcs-18', type: 'choice', skills: ['bcs.13'],
      prompt: 'What does "digital literacy" mean?',
      options: [
        'The ability to find, evaluate, use and create information safely using digital devices',
        'Being able to type quickly without looking at the keyboard',
        'Owning the latest smartphone and laptop',
        'Knowing how to repair computer hardware'],
      answer: 0 },

    { id: 'bcs-19', type: 'multi', skills: ['bcs.13'],
      prompt: 'Why does digital literacy matter for a young person looking for work in Kenya today?',
      options: [
        'Many jobs and services — HELB, KRA iTax, job applications — are now online',
        'It lets you communicate and collaborate with people at a distance',
        'It helps you judge whether information online is trustworthy',
        'It guarantees you will never be targeted by any online scam',
        'It removes the need to ever use a pen and paper again'],
      answer: [0, 1, 2] },

    { id: 'bcs-20', type: 'choice', skills: ['bcs.14'],
      prompt: 'Which of these best describes the main function of a computer?',
      options: [
        'It takes in data, processes it, stores it and gives out information',
        'It only stores files and never changes them',
        'It connects the building to the electricity supply',
        'It prints documents and nothing else'],
      answer: 0 },

    { id: 'bcs-21', type: 'match', skills: ['bcs.15'],
      prompt: 'Match each class of computer to where it fits best.',
      left: [
        'Weather forecasting and research — the fastest, most powerful machines',
        'A bank running millions of accounts on one large central system',
        'A mid-range system serving a department, between a mainframe and a PC',
        'The laptop or desktop one person uses at a time'],
      right: ['Supercomputer', 'Mainframe', 'Minicomputer', 'Microcomputer'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3 } },

    { id: 'bcs-22', type: 'match', skills: ['bcs.16'],
      prompt: 'Sort each item into system software or application software.',
      left: ['Windows 11', 'A printer device driver', 'Microsoft Excel', 'A web browser', 'Linux'],
      right: ['System software', 'Application software'],
      answer: { 0: 0, 1: 0, 2: 1, 3: 1, 4: 0 } },

    { id: 'bcs-23', type: 'choice', skills: ['bcs.16'],
      prompt: 'What is system software?',
      options: [
        'Software that runs and manages the computer itself, such as the operating system',
        'Software you buy to do a specific job, such as writing a letter',
        'The physical parts you can touch inside the computer',
        'Any file saved on the hard drive'],
      answer: 0 },

    { id: 'bcs-24', type: 'choice', skills: ['bcs.10'],
      prompt: 'Which of these is NOT a function of an operating system?',
      options: [
        'Soldering the components onto the motherboard',
        'Managing files and folders on storage',
        'Sharing the processor and memory between running programs',
        'Providing the desktop and windows you interact with'],
      answer: 0 }

  ]);

})(window.DIGILIT);
