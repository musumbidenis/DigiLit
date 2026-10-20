/* Word Processing (LO2) — item bank. Original tasks.
   Runs on the Office-suite simulator (env 'word'). Grading reads the document
   model s.doc, never the click path: the ribbon button, a right-click or a
   keyboard shortcut all count. */
(function (D) {
  'use strict';

  D.registerItems('word', [

    { id: 'word-01', type: 'sim', env: 'word', skills: ['word.4'],
      prompt: 'Make the heading "Staff Meeting" bold.',
      note: 'Click the heading line first, then use Bold (Home tab, or Ctrl+B).',
      setup: { doc: [ { text: 'Staff Meeting', style: 'Heading 1' }, { text: 'Please arrive by 9 a.m. in the ICT lab.' } ] },
      check: function (s) { return s.doc.paragraphs[0].bold === true; } },

    { id: 'word-02', type: 'sim', env: 'word', skills: ['word.6'],
      prompt: 'Centre the title line.',
      note: 'Select the title, then choose Center alignment.',
      setup: { doc: [ { text: 'RVNP ICT Department', style: 'Title' }, { text: 'Annual report 2026' } ] },
      check: function (s) { return s.doc.paragraphs[0].align === 'center'; } },

    { id: 'word-03', type: 'sim', env: 'word', skills: ['word.7'],
      prompt: 'Turn the three listed items (Milk, Bread, Sugar) into a bulleted list.',
      note: 'Click each item line and apply Bullets. All three should become bullets.',
      setup: { doc: [ 'Shopping list', 'Milk', 'Bread', 'Sugar' ] },
      check: function (s) {
        var p = s.doc.paragraphs;
        return p[1].list === 'bullet' && p[2].list === 'bullet' && p[3].list === 'bullet';
      } },

    { id: 'word-04', type: 'sim', env: 'word', skills: ['word.4', 'word.5'],
      prompt: 'Make the warning line both bold and italic.',
      note: 'Select the line, then apply Bold and Italic.',
      setup: { doc: [ 'Notes', 'Do not switch off the server during backups.' ], sel: 1 },
      check: function (s) { var p = s.doc.paragraphs[1]; return p.bold === true && p.italic === true; } },

    { id: 'word-05', type: 'sim', env: 'word', skills: ['word.3'],
      prompt: 'Type the sentence "Welcome to the course." as the first line of the document.',
      note: 'Click into the page and type.',
      setup: { doc: [ '' ] },
      check: function (s) { return D.norm(s.doc.paragraphs[0].text) === 'welcome to the course.'; } },

    { id: 'word-06', type: 'sim', env: 'word', skills: ['word.9'],
      prompt: 'Insert a table into the document.',
      note: 'Insert tab › Table.',
      setup: { doc: [ 'Timetable', '' ] },
      check: function (s) { return s.doc.tables >= 1; } },

    { id: 'word-07', type: 'sim', env: 'word', skills: ['word.10'],
      prompt: 'Insert a picture into the document.',
      note: 'Insert tab › Picture.',
      setup: { doc: [ 'Our campus', '' ] },
      check: function (s) { return s.doc.hasImage === true; } },

    { id: 'word-08', type: 'sim', env: 'word', skills: ['word.13'],
      prompt: 'Change the page orientation to Landscape.',
      note: 'Layout tab › Landscape.',
      setup: { doc: [ 'Wide table follows', '' ] },
      check: function (s) { return s.doc.orientation === 'landscape'; } },

    { id: 'word-09', type: 'sim', env: 'word', skills: ['word.11'],
      prompt: 'Add page numbers to the document.',
      note: 'Insert tab › Page Number.',
      setup: { doc: [ 'Chapter 1', 'Introduction' ] },
      check: function (s) { return s.doc.pageNumbers === true; } },

    { id: 'word-10', type: 'sim', env: 'word', skills: ['word.12'],
      prompt: 'This document has spelling mistakes. Run the spelling and grammar check to correct them.',
      note: 'Review tab › Spelling & Grammar.',
      setup: { doc: [ 'Meeting notes', 'Please recieve teh files and reply.' ], sel: 1 },
      check: function (s) {
        var joined = s.doc.paragraphs.map(function (p) { return p.text; }).join(' ');
        return s.doc.spellChecked === true && !/\bteh\b/i.test(joined) && !/\brecieve\b/i.test(joined);
      } },

    { id: 'word-11', type: 'sim', env: 'word', skills: ['word.1'],
      prompt: 'Save the document with the name "Report".',
      note: 'File › Save As, or the Save button on the quick access toolbar.',
      setup: { doc: [ 'Draft', '' ], fileName: 'Document1' },
      check: function (s) { return s.saved === true && /report/i.test(s.fileName); } },

    { id: 'word-12', type: 'sim', env: 'word', skills: ['word.6'],
      prompt: 'Right-align the date line.',
      note: 'Select the date, then choose Align Right.',
      setup: { doc: [ '20 October 2026', 'Dear Sir,' ], sel: 0 },
      check: function (s) { return s.doc.paragraphs[0].align === 'right'; } },

    /* word.2 — identify the parts of the ribbon (click the picture) */
    { id: 'word-13', type: 'hotspot', skills: ['word.2'],
      prompt: 'Click the Quick Access Toolbar — the small strip of one-click buttons (Save, Undo, Redo) at the very top of the window, above the ribbon tabs.',
      scene: {
        viewBox: '0 0 600 150', alt: 'A word processor window showing the quick access toolbar, ribbon tabs and a group',
        svg:
          '<rect x="0" y="0" width="600" height="150" fill="#f3f4f7"/>' +
          '<rect x="0" y="0" width="600" height="26" fill="#2b579a"/>' +
          '<circle cx="18" cy="13" r="6" fill="#ffffff" opacity=".85"/><circle cx="40" cy="13" r="6" fill="#ffffff" opacity=".85"/><circle cx="62" cy="13" r="6" fill="#ffffff" opacity=".85"/>' +
          '<text x="250" y="17" fill="#dde6f5" font-family="system-ui" font-size="11">Document1 — Word Processor</text>' +
          '<rect x="0" y="26" width="600" height="24" fill="#ffffff"/>' +
          '<text x="12" y="42" fill="#2b579a" font-family="system-ui" font-size="12" font-weight="700">File</text>' +
          '<text x="56" y="42" fill="#1b1b1b" font-family="system-ui" font-size="12">Home</text>' +
          '<text x="108" y="42" fill="#555" font-family="system-ui" font-size="12">Insert</text>' +
          '<text x="160" y="42" fill="#555" font-family="system-ui" font-size="12">Layout</text>' +
          '<text x="218" y="42" fill="#555" font-family="system-ui" font-size="12">Review</text>' +
          '<rect x="0" y="50" width="600" height="100" fill="#fbfbfd" stroke="#e2e5ea"/>' +
          '<rect x="12" y="60" width="150" height="74" fill="none" stroke="#d7dbe2"/>' +
          '<rect x="22" y="70" width="26" height="26" rx="3" fill="#e9edf4"/><rect x="54" y="70" width="26" height="26" rx="3" fill="#e9edf4"/><rect x="86" y="70" width="26" height="26" rx="3" fill="#e9edf4"/>' +
          '<text x="56" y="128" fill="#8a8f98" font-family="system-ui" font-size="10">Font</text>',
        targets: [
          { id: 'qat', x: 6, y: 4, w: 70, h: 19, label: 'Quick Access Toolbar' },
          { id: 'tab', x: 48, y: 28, w: 48, h: 20, label: 'A ribbon tab' },
          { id: 'group', x: 12, y: 60, w: 150, h: 74, label: 'A ribbon group' }
        ]
      },
      answer: 'qat' },

    /* word.8 — cut, copy, paste */
    { id: 'word-14', type: 'sim', env: 'word', skills: ['word.8'],
      prompt: 'Copy the heading on the first line and paste it onto the empty second line, so both lines read "Quarterly Report".',
      note: 'Click the first line, use Copy. Then click the empty second line and use Paste.',
      setup: { doc: [ 'Quarterly Report', '' ] },
      check: function (s) {
        var p = s.doc.paragraphs;
        return D.norm(p[0].text) === 'quarterly report' && D.norm(p[1].text) === 'quarterly report';
      } },

    /* word.14 — preview and print */
    { id: 'word-15', type: 'sim', env: 'word', skills: ['word.14'],
      prompt: 'Print this document.',
      note: 'File › Print.',
      setup: { doc: [ 'Fee statement', 'Please find the statement below.' ] },
      check: function (s) { return s.printed === true; } },

    /* breadth — the Font group */
    { id: 'word-16', type: 'sim', env: 'word', skills: ['word.5'],
      prompt: 'Change the title line to the Arial font at size 18.',
      note: 'Select the title, then set the font and the font size in the Font group.',
      setup: { doc: [ { text: 'Notice to all trainees', style: 'Heading 1' }, 'The lab will close early on Friday.' ], sel: 0 },
      check: function (s) { var p = s.doc.paragraphs[0]; return p.font === 'Arial' && p.size === 18; } },

    /* breadth — Insert tab, Header */
    { id: 'word-17', type: 'sim', env: 'word', skills: ['word.11'],
      prompt: 'Add a header to the document.',
      note: 'Insert tab › Header.',
      setup: { doc: [ 'Minutes of meeting', '' ] },
      check: function (s) { return !!s.doc.header; } },

    /* breadth — Layout tab, margins */
    { id: 'word-18', type: 'sim', env: 'word', skills: ['word.13'],
      prompt: 'Set the page margins to Narrow.',
      note: 'Layout tab › Margins.',
      setup: { doc: [ 'Poster text', '' ] },
      check: function (s) { return s.doc.margins === 'narrow'; } }

  ]);

})(window.DIGILIT);
