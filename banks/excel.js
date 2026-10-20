/* Spreadsheets (LO2) — item bank. Original tasks.
   Runs on the Office-suite simulator (env 'excel'). Grading reads the workbook
   model: s.sheet.cell(ref) → { input, formula, value }. The distinction that
   matters — a real formula with cell references passes; a typed-in value fails. */
(function (D) {
  'use strict';

  var SALES = { A1: 'Item', B1: 'Price', A2: 'Books', B2: 1200, A3: 'Pens', B3: 800,
                A4: 'Bags', B4: 1500, A5: 'Files', B5: 600, A6: 'Ink', B6: 700 };

  function marks() {
    return { A1: 'Name', B1: 'Score', A2: 'Asha', B2: 72, A3: 'Brian', B3: 88,
             A4: 'Cate', B4: 65, A5: 'Dan', B5: 91, A6: 'Esha', B6: 54 };
  }

  D.registerItems('excel', [

    { id: 'excel-01', type: 'sim', env: 'excel', skills: ['excel.4', 'excel.5'],
      prompt: 'In cell B7, use a formula to add up the prices in B2 to B6. (Total should be 4800.)',
      note: 'Type an equals sign and a formula — for example =SUM(B2:B6). Typing 4800 by hand will not count.',
      setup: { cells: SALES, active: 'B7' },
      check: function (s) {
        var c = s.sheet.cell('B7');
        return c.formula !== '' && /[A-J]\d/i.test(c.formula) && c.value === 4800;
      } },

    { id: 'excel-02', type: 'sim', env: 'excel', skills: ['excel.5'],
      prompt: 'In cell B7, use the AVERAGE function to find the average price of B2 to B6.',
      note: 'Use =AVERAGE(B2:B6).',
      setup: { cells: SALES, active: 'B7' },
      check: function (s) {
        var c = s.sheet.cell('B7');
        return /^=AVERAGE\(/i.test(c.formula) && c.value === 960;
      } },

    { id: 'excel-03', type: 'sim', env: 'excel', skills: ['excel.5'],
      prompt: 'In cell B7, use the MAX function to find the highest price in B2 to B6.',
      note: 'Use =MAX(B2:B6).',
      setup: { cells: SALES, active: 'B7' },
      check: function (s) {
        var c = s.sheet.cell('B7');
        return /^=MAX\(/i.test(c.formula) && c.value === 1500;
      } },

    { id: 'excel-04', type: 'sim', env: 'excel', skills: ['excel.6'],
      prompt: 'In cell C2, use IF to show "Pass" when the score in B2 is 50 or more, otherwise "Fail".',
      note: 'Use =IF(B2>=50,"Pass","Fail").',
      setup: { cells: marks(), active: 'C2' },
      check: function (s) {
        var c = s.sheet.cell('C2');
        return /^=IF\(/i.test(c.formula) && String(c.value) === 'Pass';
      } },

    { id: 'excel-05', type: 'sim', env: 'excel', skills: ['excel.6'],
      prompt: 'In cell C2, use RANK to show the position of Asha’s score (B2) among all scores B2:B6, highest first.',
      note: 'Use =RANK(B2,B2:B6). Asha’s score of 72 should rank 3rd.',
      setup: { cells: marks(), active: 'C2' },
      check: function (s) {
        var c = s.sheet.cell('C2');
        return /^=RANK\(/i.test(c.formula) && Number(c.value) === 3;
      } },

    { id: 'excel-06', type: 'sim', env: 'excel', skills: ['excel.10'],
      prompt: 'Sort the table by Score from largest to smallest (Z→A).',
      note: 'Click any cell in the Score column, then Data tab › Sort Z→A.',
      setup: { cells: marks(), active: 'B2' },
      check: function (s) {
        return s.sheet.sortedBy && s.sheet.sortedBy.asc === false &&
          s.sheet.value('B2') === 91 && s.sheet.value('B6') === 54;
      } },

    { id: 'excel-07', type: 'sim', env: 'excel', skills: ['excel.12'],
      prompt: 'Select the data and insert a chart to show it visually.',
      note: 'Insert tab › a chart type (Column, Bar, Line or Pie).',
      setup: { cells: SALES, active: 'A1' },
      check: function (s) { return s.sheet.charts.length >= 1; } },

    { id: 'excel-08', type: 'sim', env: 'excel', skills: ['excel.8'],
      prompt: 'Format cell B2 as Currency.',
      note: 'Select B2, then Home tab › Number group › Currency.',
      setup: { cells: SALES, active: 'B2' },
      check: function (s) { var f = s.sheet.format['B2']; return !!f && f.numFmt === 'Currency'; } },

    { id: 'excel-09', type: 'sim', env: 'excel', skills: ['excel.11'],
      prompt: 'Show only the rows for "Books": click the Books cell in column A, then apply Filter.',
      note: 'Data tab › Filter filters to the selected cell’s value.',
      setup: { cells: SALES, active: 'A2' },
      check: function (s) { return s.sheet.filter && String(s.sheet.filter.value) === 'Books'; } },

    { id: 'excel-10', type: 'sim', env: 'excel', skills: ['excel.2', 'excel.4'],
      prompt: 'In cell B3, calculate 16% VAT on the price in B2 using a formula (B2 is 1200).',
      note: 'Use a formula with a cell reference, e.g. =B2*0.16. The answer is 192.',
      setup: { cells: { A1: 'Net', A2: 'Price', B2: 1200, A3: 'VAT' }, active: 'B3' },
      check: function (s) {
        var c = s.sheet.cell('B3');
        return c.formula !== '' && /[A-J]\d/i.test(c.formula) && Math.abs(c.value - 192) < 0.01;
      } },

    /* knowledge items for standards the grid does not exercise directly */

    { id: 'excel-11', type: 'choice', skills: ['excel.1'],
      prompt: 'Which part of the spreadsheet shows the contents of the selected cell, including any formula?',
      options: ['The formula bar', 'The name box', 'The status bar', 'The column header'],
      answer: 0 },

    { id: 'excel-12', type: 'choice', skills: ['excel.14'],
      prompt: 'Before printing a large sheet, which check is most useful?',
      options: [
        'Use Print Preview and set the print area / fit to page',
        'Delete all the formulas first',
        'Change every number to text',
        'Rename the file to "print"'],
      answer: 0 },

    /* excel.3 — select a range and use fill to continue a pattern */
    { id: 'excel-13', type: 'sim', env: 'excel', skills: ['excel.3'],
      prompt: 'Number the rows 1 to 6 down column A. A1 already holds 1 — select A1:A6 and use Fill to continue the series to 6.',
      note: 'Drag from A1 to A6 to select the range, then Home tab › Editing › Fill Series.',
      setup: { cells: { A1: 1 }, active: 'A1' },
      check: function (s) {
        return s.sheet.value('A2') === 2 && s.sheet.value('A4') === 4 && s.sheet.value('A6') === 6;
      } },

    /* excel.4 + excel.7 — write a formula, then copy it down (relative references) */
    { id: 'excel-14', type: 'sim', env: 'excel', skills: ['excel.4', 'excel.7'],
      prompt: 'In C2, use a formula to add the Quantity (A2) and the Bonus (B2). Then fill that formula down to C5 so each row totals its own numbers.',
      note: 'Write =A2+B2 in C2. Select C2:C5 and use Fill Down — the references should change for each row on their own.',
      setup: { cells: { A1: 'Qty', B1: 'Bonus', C1: 'Total',
        A2: 4, B2: 1, A3: 9, B3: 2, A4: 6, B4: 3, A5: 7, B5: 5 }, active: 'C2' },
      check: function (s) {
        var c3 = s.sheet.cell('C3'), c5 = s.sheet.cell('C5');
        return /[A-J]3/i.test(c3.formula) && c3.value === 11 &&
               /[A-J]5/i.test(c5.formula) && c5.value === 12;
      } },

    /* excel.9 — insert rows and columns */
    { id: 'excel-15', type: 'sim', env: 'excel', skills: ['excel.9'],
      prompt: '"Pens" (in A3) was left out of order. Insert a blank row above it so a new item can go there, pushing Pens down to row 4.',
      note: 'Click a cell in row 3, then Home tab › Cells › Insert Rows.',
      setup: { cells: { A1: 'Item', A2: 'Books', A3: 'Pens', A4: 'Bags' }, active: 'A3' },
      check: function (s) {
        return s.sheet.value('A2') === 'Books' &&
          s.sheet.cell('A3').input === '' && s.sheet.value('A4') === 'Pens';
      } },

    /* excel.13 — rename, add and move worksheets */
    { id: 'excel-16', type: 'sim', env: 'excel', skills: ['excel.13'],
      prompt: 'Rename Sheet1 to "Term 1 Marks", then add a second worksheet to the workbook.',
      note: 'Double-click the sheet tab (or right-click it) to rename. Use the + button to add a sheet.',
      setup: { cells: marks(), active: 'A1' },
      check: function (s) {
        return s.sheets[0] === 'Term 1 Marks' && s.sheets.length >= 2;
      } },

    /* breadth — SUMIF across the Formulas/Function library */
    { id: 'excel-17', type: 'sim', env: 'excel', skills: ['excel.6'],
      prompt: 'In B7, use SUMIF to add only the prices (B2:B6) of rows whose item in A2:A6 is "Pens". The answer is 800.',
      note: 'Use =SUMIF(A2:A6,"Pens",B2:B6).',
      setup: { cells: { A1: 'Item', B1: 'Price', A2: 'Books', B2: 1200, A3: 'Pens', B3: 800,
        A4: 'Bags', B4: 1500, A5: 'Pens', B5: 0, A6: 'Ink', B6: 700 }, active: 'B7' },
      check: function (s) {
        var c = s.sheet.cell('B7');
        return /^=SUMIF\(/i.test(c.formula) && Number(c.value) === 800;
      } },

    /* breadth — COUNT */
    { id: 'excel-18', type: 'sim', env: 'excel', skills: ['excel.5'],
      prompt: 'In B7, use COUNT to show how many scores there are in B2:B6. The answer is 5.',
      note: 'Use =COUNT(B2:B6).',
      setup: { cells: marks(), active: 'B7' },
      check: function (s) {
        var c = s.sheet.cell('B7');
        return /^=COUNT\(/i.test(c.formula) && Number(c.value) === 5;
      } }

  ]);

})(window.DIGILIT);
