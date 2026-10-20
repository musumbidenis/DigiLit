/* DigiLit — Office suite simulator (LO2).
   One ribbon shell driving three app models: a word processor (document),
   a spreadsheet (workbook + formula engine) and a presentation (deck).
   Faithful to the real ribbon layout and terminology; glyphs drawn in-house.

   Grading reads the resulting MODEL, never the click path:
     word:  s.doc   — paragraphs with run formatting, tables, images, page setup
     excel: s.sheet — cell(ref) → { input, formula, value }, plus sort/filter/charts
     ppt:   s.deck  — slides with layout/title/body/notes/transition, theme

   Registered as D.sims.word / D.sims.excel / D.sims.ppt. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear;

  /* ============================================================= *
   *  Spreadsheet model + formula engine                           *
   * ============================================================= */

  var COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var NROWS = 20;

  function colIndex(letter) { return COLS.indexOf(letter.toUpperCase()); }

  function makeSheet(seed) {
    var cells = {};           /* ref -> { input } */
    var order = COLS.slice(); /* current column order is fixed; rows can reorder */
    var rowOrder = [];
    var i;
    for (i = 1; i <= NROWS; i++) rowOrder.push(i);

    if (seed) Object.keys(seed).forEach(function (ref) { cells[ref] = { input: String(seed[ref]) }; });

    function raw(ref) { return cells[ref] ? cells[ref].input : ''; }

    /* evaluate a ref to a number (blank/text → handled by caller) */
    function numAt(ref, depth) {
      var v = valueAt(ref, depth);
      if (typeof v === 'number') return v;
      var n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    }

    function listFromRange(range, depth) {
      var m = range.match(/^([A-J])(\d+):([A-J])(\d+)$/i);
      var out = [];
      if (!m) return out;
      var c1 = colIndex(m[1]), r1 = parseInt(m[2], 10), c2 = colIndex(m[3]), r2 = parseInt(m[4], 10);
      var ca = Math.min(c1, c2), cb = Math.max(c1, c2), ra = Math.min(r1, r2), rb = Math.max(r1, r2);
      for (var c = ca; c <= cb; c++) for (var r = ra; r <= rb; r++) out.push(COLS[c] + r);
      return out.map(function (ref) { return { ref: ref, v: valueAt(ref, depth) }; });
    }

    function argValues(arg, depth) {
      arg = arg.trim();
      if (/^[A-J]\d+:[A-J]\d+$/i.test(arg)) return listFromRange(arg, depth).map(function (x) { return x.v; });
      return [evalExpr(arg, depth)];
    }

    function nums(vals) {
      return vals.filter(function (v) { return typeof v === 'number' && !isNaN(v); });
    }

    function matchCriteria(v, crit) {
      crit = String(crit).trim().replace(/^"|"$/g, '');
      var m = crit.match(/^(>=|<=|<>|>|<|=)?\s*(.*)$/);
      var op = m[1] || '=', target = m[2];
      var tn = parseFloat(target);
      var vn = typeof v === 'number' ? v : parseFloat(v);
      if (!isNaN(tn) && !isNaN(vn)) {
        switch (op) {
          case '>': return vn > tn; case '<': return vn < tn;
          case '>=': return vn >= tn; case '<=': return vn <= tn;
          case '<>': return vn !== tn; default: return vn === tn;
        }
      }
      var vs = String(v).toLowerCase(), ts = String(target).toLowerCase();
      return op === '<>' ? vs !== ts : vs === ts;
    }

    /* split args at top-level commas */
    function splitArgs(s) {
      var out = [], depth = 0, cur = '', inStr = false;
      for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        if (ch === '"') inStr = !inStr;
        if (!inStr && ch === '(') depth++;
        if (!inStr && ch === ')') depth--;
        if (!inStr && ch === ',' && depth === 0) { out.push(cur); cur = ''; }
        else cur += ch;
      }
      if (cur.length) out.push(cur);
      return out;
    }

    function callFn(name, argStr, depth) {
      name = name.toUpperCase();
      var args = splitArgs(argStr);
      var flat = [];
      args.forEach(function (a) { flat = flat.concat(argValues(a, depth)); });
      var n = nums(flat);
      switch (name) {
        case 'SUM': return n.reduce(function (a, b) { return a + b; }, 0);
        case 'AVERAGE': return n.length ? n.reduce(function (a, b) { return a + b; }, 0) / n.length : 0;
        case 'COUNT': return n.length;
        case 'COUNTA': return flat.filter(function (v) { return v !== '' && v !== null && v !== undefined; }).length;
        case 'MAX': return n.length ? Math.max.apply(null, n) : 0;
        case 'MIN': return n.length ? Math.min.apply(null, n) : 0;
        case 'PRODUCT': return n.reduce(function (a, b) { return a * b; }, 1);
        case 'MODE': {
          var freq = {}, best = null, bc = 0;
          n.forEach(function (x) { freq[x] = (freq[x] || 0) + 1; if (freq[x] > bc) { bc = freq[x]; best = x; } });
          return best === null ? 0 : best;
        }
        case 'IF': {
          var cond = evalExpr(args[0], depth);
          var truthy = (typeof cond === 'number') ? cond !== 0 : !!cond;
          return truthy ? argScalar(args[1], depth) : argScalar(args[2], depth);
        }
        case 'RANK': {
          var val = evalExpr(args[0], depth);
          var list = nums(argValues(args[1], depth));
          var asc = args[2] && evalExpr(args[2], depth);
          list.sort(function (a, b) { return asc ? a - b : b - a; });
          var idx = list.indexOf(val);
          return idx === -1 ? 0 : idx + 1;
        }
        case 'SUMIF': {
          var rng = listFromRange(args[0].trim(), depth);
          var crit = args[1];
          var sumRng = args[2] ? listFromRange(args[2].trim(), depth) : rng;
          var total = 0;
          rng.forEach(function (cell, i) {
            if (matchCriteria(cell.v, evalExpr(crit, depth))) {
              var sv = sumRng[i] ? sumRng[i].v : 0;
              if (typeof sv === 'number') total += sv;
            }
          });
          return total;
        }
        default: return '#NAME?';
      }
    }

    function argScalar(a, depth) { return evalExpr(a, depth); }

    /* expression evaluator: numbers, strings, refs, + - * / ( ), functions */
    function evalExpr(expr, depth) {
      if (depth > 50) return '#REF!';
      expr = String(expr).trim();
      if (expr === '') return '';
      /* function call? */
      var fn = expr.match(/^([A-Za-z]+)\((.*)\)$/);
      if (fn && balanced(fn[2])) return callFn(fn[1], fn[2], depth + 1);
      /* quoted string */
      if (/^".*"$/.test(expr)) return expr.slice(1, -1);
      /* top-level comparison (for IF conditions etc.) */
      var cmp = topComparison(expr);
      if (cmp) {
        var l = evalExpr(cmp.l, depth), r = evalExpr(cmp.r, depth);
        var ln = typeof l === 'number' ? l : parseFloat(l);
        var rn = typeof r === 'number' ? r : parseFloat(r);
        var bothNum = !isNaN(ln) && !isNaN(rn);
        var L = bothNum ? ln : String(l), R = bothNum ? rn : String(r);
        switch (cmp.op) {
          case '>': return L > R; case '<': return L < R;
          case '>=': return L >= R; case '<=': return L <= R;
          case '<>': return L !== R; case '=': return L === R;
        }
      }
      /* try arithmetic parse */
      try { return parseArith(expr, depth); }
      catch (e) { return '#ERROR'; }
    }

    function topComparison(s) {
      var depth = 0, inStr = false;
      for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        if (ch === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (depth === 0) {
          var two = s.substr(i, 2);
          if (two === '>=' || two === '<=' || two === '<>') return { l: s.slice(0, i), op: two, r: s.slice(i + 2) };
          if (ch === '>' || ch === '<' || ch === '=') return { l: s.slice(0, i), op: ch, r: s.slice(i + 1) };
        }
      }
      return null;
    }

    function balanced(s) {
      var d = 0;
      for (var i = 0; i < s.length; i++) { if (s[i] === '(') d++; if (s[i] === ')') d--; if (d < 0) return false; }
      return d === 0;
    }

    /* recursive-descent arithmetic over +,-,*,/ with refs and nested fns */
    function parseArith(expr, depth) {
      var pos = 0;
      function peek() { return expr[pos]; }
      function skip() { while (/\s/.test(expr[pos])) pos++; }
      function parseExpr() {
        var v = parseTerm();
        skip();
        while (peek() === '+' || peek() === '-') {
          var op = expr[pos++]; var r = parseTerm();
          v = op === '+' ? v + r : v - r; skip();
        }
        return v;
      }
      function parseTerm() {
        var v = parseFactor(); skip();
        while (peek() === '*' || peek() === '/') {
          var op = expr[pos++]; var r = parseFactor();
          v = op === '*' ? v * r : v / r; skip();
        }
        return v;
      }
      function parseFactor() {
        skip();
        if (peek() === '(') {
          pos++; var v = parseExpr(); skip();
          if (peek() === ')') pos++;
          return v;
        }
        if (peek() === '-') { pos++; return -parseFactor(); }
        /* function or ref or number */
        var rest = expr.slice(pos);
        var fnm = rest.match(/^([A-Za-z]+)\(/);
        if (fnm) {
          var start = pos + fnm[1].length + 1, d = 1, i = start;
          while (i < expr.length && d > 0) { if (expr[i] === '(') d++; if (expr[i] === ')') d--; i++; }
          var inner = expr.slice(start, i - 1);
          pos = i;
          var fv = callFn(fnm[1], inner, depth + 1);
          return typeof fv === 'number' ? fv : parseFloat(fv) || 0;
        }
        var refm = rest.match(/^([A-J])(\d+)/i);
        if (refm) { pos += refm[0].length; return numAt(refm[0].toUpperCase(), depth + 1); }
        var numm = rest.match(/^\d+(\.\d+)?/);
        if (numm) { pos += numm[0].length; return parseFloat(numm[0]); }
        throw new Error('parse');
      }
      var out = parseExpr();
      return out;
    }

    function valueAt(ref, depth) {
      depth = depth || 0;
      var inp = raw(ref);
      if (inp === '') return '';
      if (inp.charAt(0) === '=') return evalExpr(inp.slice(1), depth + 1);
      var n = parseFloat(inp);
      if (!isNaN(n) && String(n) === inp.trim()) return n;
      return inp;
    }

    return {
      cells: cells,
      rowOrder: rowOrder,
      format: {},        /* ref -> { bold, numFmt, fill, border } */
      charts: [],
      filter: null,      /* { col, value } */
      set: function (ref, input) {
        if (input === '' || input === null || input === undefined) delete cells[ref];
        else cells[ref] = { input: String(input) };
      },
      raw: raw,
      cell: function (ref) {
        var inp = raw(ref);
        return {
          input: inp,
          formula: inp.charAt(0) === '=' ? inp : '',
          value: valueAt(ref, 0)
        };
      },
      value: function (ref) { return valueAt(ref, 0); }
    };
  }

  /* ============================================================= *
   *  Spreadsheet structural edits (fill, insert/delete)           *
   *  Pure operations over a sheet made by makeSheet — no DOM.     *
   * ============================================================= */

  function refParts(ref) { var m = ref.match(/^([A-J])(\d+)$/i); return m ? { c: colIndex(m[1]), r: parseInt(m[2], 10) } : null; }
  function refOf(ci, ri) { return COLS[ci] + ri; }
  function fmtNum(n, d) { return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* Shift the cell references in a formula by (dRow, dCol), honouring $ locks,
     exactly as copying a formula down or across a real spreadsheet does. */
  function shiftFormula(input, dRow, dCol) {
    return String(input).replace(/(\$?)([A-J])(\$?)(\d+)/gi, function (m, lc, col, lr, row) {
      var ci = COLS.indexOf(col.toUpperCase());
      var ri = parseInt(row, 10);
      if (!lc) ci += dCol;
      if (!lr) ri += dRow;
      if (ci < 0 || ci >= COLS.length || ri < 1 || ri > NROWS) return m;
      return lc + COLS[ci] + lr + ri;
    });
  }

  function normRange(sel) {
    return { ca: Math.min(sel.c1, sel.c2), cb: Math.max(sel.c1, sel.c2),
             ra: Math.min(sel.r1, sel.r2), rb: Math.max(sel.r1, sel.r2) };
  }

  /* Fill the top row / left column of a selection across the rest of it.
     dir: 'down' | 'right' copy with relative-reference shift;
          'series' continues an arithmetic number run, else copies. */
  function fillRange(sheet, sel, dir) {
    var n = normRange(sel);
    if (dir === 'right') {
      for (var r = n.ra; r <= n.rb; r++) {
        var src = sheet.raw(refOf(n.ca, r));
        for (var c = n.ca + 1; c <= n.cb; c++) {
          sheet.set(refOf(c, r), src.charAt(0) === '=' ? shiftFormula(src, 0, c - n.ca) : src);
        }
      }
      return;
    }
    for (var c2 = n.ca; c2 <= n.cb; c2++) {
      var top = sheet.raw(refOf(c2, n.ra));
      var step = null;
      if (dir === 'series' && top.charAt(0) !== '=') {
        var a = parseFloat(top), b = parseFloat(sheet.raw(refOf(c2, n.ra + 1)));
        if (!isNaN(a)) step = (!isNaN(b) && n.rb > n.ra) ? (b - a) : 1;
      }
      for (var r2 = n.ra + 1; r2 <= n.rb; r2++) {
        if (top.charAt(0) === '=') sheet.set(refOf(c2, r2), shiftFormula(top, r2 - n.ra, 0));
        else if (step !== null) sheet.set(refOf(c2, r2), String(parseFloat(top) + step * (r2 - n.ra)));
        else sheet.set(refOf(c2, r2), top);
      }
    }
  }

  function moveCell(sheet, from, to) {
    sheet.set(to, sheet.raw(from));
    if (sheet.format[from]) sheet.format[to] = sheet.format[from];
    else delete sheet.format[to];
  }
  function clearCell(sheet, ref) { sheet.set(ref, ''); delete sheet.format[ref]; }

  function insertRowAt(sheet, at) {
    for (var r = NROWS; r > at; r--) COLS.forEach(function (c) { moveCell(sheet, c + (r - 1), c + r); });
    COLS.forEach(function (c) { clearCell(sheet, c + at); });
  }
  function deleteRowAt(sheet, at) {
    for (var r = at; r < NROWS; r++) COLS.forEach(function (c) { moveCell(sheet, c + (r + 1), c + r); });
    COLS.forEach(function (c) { clearCell(sheet, c + NROWS); });
  }
  function insertColAt(sheet, at) {
    for (var ci = COLS.length - 1; ci > at; ci--) for (var r = 1; r <= NROWS; r++) moveCell(sheet, refOf(ci - 1, r), refOf(ci, r));
    for (var r2 = 1; r2 <= NROWS; r2++) clearCell(sheet, refOf(at, r2));
  }
  function deleteColAt(sheet, at) {
    for (var ci = at; ci < COLS.length - 1; ci++) for (var r = 1; r <= NROWS; r++) moveCell(sheet, refOf(ci + 1, r), refOf(ci, r));
    for (var r2 = 1; r2 <= NROWS; r2++) clearCell(sheet, refOf(COLS.length - 1, r2));
  }

  /* ============================================================= *
   *  Shared ribbon shell                                          *
   * ============================================================= */

  var APP_META = {
    word:  { name: 'Document1 — Word Processor', accent: '#2b579a', file: 'Document1', tabs: ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View'] },
    excel: { name: 'Book1 — Spreadsheet',        accent: '#217346', file: 'Book1',     tabs: ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'] },
    ppt:   { name: 'Presentation1 — Slides',     accent: '#b7472a', file: 'Presentation1', tabs: ['File', 'Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View'] }
  };

  function officeInstance(mount, setup, app) {
    setup = setup || {};
    var meta = APP_META[app];
    var state = {
      kind: 'office', app: app, tab: 'Home', saved: false, printed: false,
      fileName: setup.fileName || meta.file, events: []
    };

    if (app === 'word') {
      state.doc = buildDoc(setup);
    } else if (app === 'excel') {
      state.sheet = makeSheet(setup.cells || {});
      state.sheets = ['Sheet1'];
      state.activeSheet = 'Sheet1';
      state.active = setup.active || 'A1';
    } else {
      state.deck = buildDeck(setup);
    }

    var pendingRender = false;
    var cleanup = [];
    var self = {
      state: state,
      el: null,
      fire: function (name, detail) { state.events.push({ name: name, detail: detail }); },
      update: function () { render(); },
      /* deferred re-render: lets a blur/keydown handler finish before the DOM
         is rebuilt, avoiding removeChild races on the node being blurred */
      updateSoon: function () {
        if (pendingRender) return;
        pendingRender = true;
        setTimeout(function () { pendingRender = false; render(); }, 0);
      },
      destroy: function () {
        cleanup.forEach(function (fn) { try { fn(); } catch (e) {} });
        cleanup = [];
        if (root && root.parentNode) root.parentNode.removeChild(root);
      }
    };

    /* ---------- undo / redo (real, like the Office quick access buttons) ----------
       `committed` always holds the model as it was at the last render — i.e.
       before the current, not-yet-rendered change. Each mutation pushes that
       pre-change snapshot, so Undo walks back one user action at a time. */
    var history = [], future = [], committed = null;
    function snapshot() {
      /* Word/PowerPoint models are plain data — serialise them whole so every
         field (old or newly added) round-trips through Undo. */
      if (app === 'word') return JSON.stringify(state.doc);
      if (app === 'ppt') return JSON.stringify(state.deck);
      /* The sheet carries live methods, so capture its data and flags instead. */
      var cells = {};
      Object.keys(state.sheet.cells).forEach(function (r) { cells[r] = state.sheet.cells[r].input; });
      var flags = {};
      Object.keys(state.sheet).forEach(function (k) {
        if (k === 'cells' || typeof state.sheet[k] === 'function') return;
        flags[k] = state.sheet[k];
      });
      return JSON.stringify({ cells: cells, flags: flags, sheets: state.sheets, activeSheet: state.activeSheet });
    }
    function restore(snap) {
      var o = JSON.parse(snap);
      if (app === 'word') { state.doc = o; if (state.doc.sel >= state.doc.paragraphs.length) state.doc.sel = state.doc.paragraphs.length - 1; return; }
      if (app === 'ppt') { state.deck = o; if (state.deck.current >= state.deck.slides.length) state.deck.current = state.deck.slides.length - 1; return; }
      Object.keys(state.sheet.cells).forEach(function (r) { delete state.sheet.cells[r]; });
      Object.keys(o.cells).forEach(function (r) { state.sheet.set(r, o.cells[r]); });
      Object.keys(o.flags).forEach(function (k) { state.sheet[k] = o.flags[k]; });
      state.sheets = o.sheets; state.activeSheet = o.activeSheet;
    }
    function pushUndo() { if (committed != null) { history.push(committed); if (history.length > 60) history.shift(); future = []; } }
    self.doUndo = function () { if (!history.length) return; future.push(snapshot()); restore(history.pop()); self.fire('undo'); self.update(); };
    self.doRedo = function () { if (!future.length) return; history.push(snapshot()); restore(future.pop()); self.fire('redo'); self.update(); };

    /* live cell-range drag selection (Excel) */
    var selDragging = false;
    if (app === 'excel') {
      var onUp = function () {
        if (selDragging) { selDragging = false; self.fire('select-range', selRangeA1()); }
      };
      document.addEventListener('mouseup', onUp);
      cleanup.push(function () { document.removeEventListener('mouseup', onUp); closeSheetMenu(); });
    }

    var root = el('div', { class: 'of-app of-' + app, style: { '--of-accent': meta.accent } });
    mount.appendChild(root);
    self.el = root;

    function render() {
      clear(root);
      root.appendChild(titleBar());
      root.appendChild(ribbon());
      var stage = el('div', { class: 'of-stage' });
      if (app === 'word') renderWord(stage);
      else if (app === 'excel') renderExcel(stage);
      else renderPpt(stage);
      root.appendChild(stage);
      root.appendChild(statusBar());
      committed = snapshot();   /* the state Undo will return to */
    }

    /* ---------- title bar + quick access ---------- */
    function titleBar() {
      return el('div', { class: 'of-title' }, [
        el('div', { class: 'of-qat' }, [
          qatBtn('save', 'Save', function () { state.saved = true; self.fire('save', state.fileName); self.update(); }),
          qatBtn('undo', 'Undo', function () { self.doUndo(); }),
          qatBtn('redo', 'Redo', function () { self.doRedo(); })
        ]),
        el('div', { class: 'of-title-name', text: state.fileName + (state.saved ? '' : ' *') + '  —  ' + appLabel() }),
        el('div', { class: 'of-winbtns' }, [
          el('span', { class: 'of-wb' }), el('span', { class: 'of-wb' }), el('span', { class: 'of-wb of-wb-x' })
        ])
      ]);
    }
    function appLabel() { return app === 'word' ? 'Word Processor' : app === 'excel' ? 'Spreadsheet' : 'Presentation'; }
    function qatBtn(icon, label, fn) {
      return el('button', { class: 'of-qatbtn', type: 'button', title: label, 'aria-label': label,
        html: OFICON[icon] || '', onclick: fn });
    }

    /* ---------- ribbon ---------- */
    function ribbon() {
      var wrap = el('div', { class: 'of-ribbon' });
      wrap.appendChild(el('div', { class: 'of-tabs' }, meta.tabs.map(function (t) {
        return el('button', {
          class: 'of-tab' + (state.tab === t ? ' is-on' : '') + (t === 'File' ? ' of-tab-file' : ''),
          type: 'button', text: t,
          onclick: function () { state.tab = t; self.update(); }
        });
      })));
      var groups = el('div', { class: 'of-groups' });
      ribbonGroups(groups);
      wrap.appendChild(groups);
      return wrap;
    }

    function group(title, children) {
      return el('div', { class: 'of-group' }, [
        el('div', { class: 'of-group-body' }, children),
        el('div', { class: 'of-group-label', text: title })
      ]);
    }
    function rbtn(icon, label, fn, on, big) {
      return el('button', {
        class: 'of-rbtn' + (big ? ' of-rbtn-lg' : '') + (on ? ' is-on' : ''),
        type: 'button', title: label,
        html: (OFICON[icon] || '') + '<span class="of-rlabel">' + D.esc(label) + '</span>',
        onclick: fn
      });
    }
    /* A labelled text-pill control. Primary tools pass a handler; the many
       faithful-but-secondary ribbon controls pass none, and a click is still
       recorded as a 'command' event so a task can check it was used. */
    function tool(label, fn, on) {
      return el('button', { class: 'of-style' + (on ? ' is-on' : ''), type: 'button', text: label, title: label,
        onclick: fn || function () { self.fire('command', label); } });
    }

    function ribbonGroups(host) {
      if (state.tab === 'File') { fileMenu(host); return; }
      if (app === 'word') wordRibbon(host);
      else if (app === 'excel') excelRibbon(host);
      else pptRibbon(host);
    }

    function fileMenu(host) {
      host.appendChild(el('div', { class: 'of-backstage' }, [
        bsBtn('Save', function () { state.saved = true; self.fire('save', state.fileName); self.update(); }),
        bsBtn('Save As', function () {
          promptName('Save As', state.fileName, function (nm) { if (nm) { state.fileName = nm; state.saved = true; self.fire('saveas', nm); } state.tab = 'Home'; self.update(); });
        }),
        bsBtn('Print', function () { state.printed = true; self.fire('print', state.fileName); state.tab = 'Home'; self.update(); }),
        bsBtn('Close', function () { state.tab = 'Home'; self.update(); })
      ]));
    }
    function bsBtn(label, fn) { return el('button', { class: 'of-bs', type: 'button', text: label, onclick: fn }); }

    /* ---------- status bar ---------- */
    function statusBar() {
      var right;
      if (app === 'excel') right = state.active + '  ·  ' + (state.sheet.cell(state.active).value === '' ? 'Ready' : state.sheet.cell(state.active).value);
      else if (app === 'word') right = countWords(state.doc) + ' words';
      else right = 'Slide ' + (state.deck.current + 1) + ' of ' + state.deck.slides.length;
      return el('div', { class: 'of-status' }, [
        el('span', { text: state.saved ? 'Saved' : 'Not saved' }),
        el('span', { class: 'of-status-right', text: right })
      ]);
    }

    /* ===================== WORD ===================== */

    function wordRibbon(host) {
      var p = currentPara();
      if (state.tab === 'Home') {
        host.appendChild(group('Clipboard', [
          rbtn('paste', 'Paste', function () { if (clip != null && p) { p.text = clip; self.fire('paste', clip); dirty(); } }, false, true),
          rbtn('cut', 'Cut', function () { if (p) { clip = p.text; p.text = ''; self.fire('cut', clip); dirty(); } }),
          rbtn('copy', 'Copy', function () { if (p) { clip = p.text; self.fire('copy', clip); } }),
          rbtn('painter', 'Format Painter', function () { self.fire('command', 'Format Painter'); })
        ]));
        host.appendChild(group('Font', [
          fontFamily(p), fontSize(p),
          rbtn('growfont', 'Grow Font', function () { if (p) { p.size = Math.min(96, (p.size || 12) + 2); dirty(); } }),
          rbtn('shrinkfont', 'Shrink Font', function () { if (p) { p.size = Math.max(8, (p.size || 12) - 2); dirty(); } }),
          rbtn('bold', 'Bold', function () { toggle(p, 'bold'); }, p && p.bold),
          rbtn('italic', 'Italic', function () { toggle(p, 'italic'); }, p && p.italic),
          rbtn('under', 'Underline', function () { toggle(p, 'underline'); }, p && p.underline),
          rbtn('strike', 'Strikethrough', function () { toggle(p, 'strike'); }, p && p.strike),
          rbtn('subscript', 'Subscript', function () { setSubSup(p, 'sub'); }, p && p.sub),
          rbtn('superscript', 'Superscript', function () { setSubSup(p, 'sup'); }, p && p.sup),
          rbtn('highlight', 'Text Highlight Colour', function () { if (p) { p.highlight = p.highlight ? null : '#fff3a3'; dirty(); } }, p && p.highlight),
          colorBtn(p),
          rbtn('clearfmt', 'Clear All Formatting', function () { clearFmt(p); })
        ]));
        host.appendChild(group('Paragraph', [
          rbtn('bullets', 'Bullets', function () { setList(p, 'bullet'); }, p && p.list === 'bullet'),
          rbtn('numbers', 'Numbering', function () { setList(p, 'number'); }, p && p.list === 'number'),
          rbtn('outdent', 'Decrease Indent', function () { if (p) { p.indent = Math.max(0, (p.indent || 0) - 1); dirty(); } }),
          rbtn('indent', 'Increase Indent', function () { if (p) { p.indent = Math.min(6, (p.indent || 0) + 1); dirty(); } }),
          rbtn('alignl', 'Align Left', function () { setAlign(p, 'left'); }, p && p.align === 'left'),
          rbtn('alignc', 'Center', function () { setAlign(p, 'center'); }, p && p.align === 'center'),
          rbtn('alignr', 'Align Right', function () { setAlign(p, 'right'); }, p && p.align === 'right'),
          rbtn('justify', 'Justify', function () { setAlign(p, 'justify'); }, p && p.align === 'justify'),
          lineSpacingBtn(p),
          rbtn('shading', 'Shading', function () { if (p) { p.shading = p.shading ? null : '#e8eef7'; dirty(); } }, p && p.shading)
        ]));
        host.appendChild(group('Styles', [
          styleBtn(p, 'Normal'), styleBtn(p, 'No Spacing'), styleBtn(p, 'Heading 1'),
          styleBtn(p, 'Heading 2'), styleBtn(p, 'Title'), styleBtn(p, 'Subtitle')
        ]));
        host.appendChild(group('Editing', [
          tool('Find'),
          tool('Replace', function () { state.doc.findReplace = true; self.fire('replace'); dirty(); }, state.doc.findReplace),
          tool('Select')
        ]));
      } else if (state.tab === 'Insert') {
        host.appendChild(group('Pages', [
          tool('Cover Page', function () { state.doc.coverPage = true; dirty(); }, state.doc.coverPage),
          tool('Blank Page'),
          tool('Page Break', function () { state.doc.pageBreaks = (state.doc.pageBreaks || 0) + 1; self.fire('page-break'); dirty(); })
        ]));
        host.appendChild(group('Tables', [ rbtn('table', 'Table', function () { insertTable(); }, false, true) ]));
        host.appendChild(group('Illustrations', [
          rbtn('picture', 'Pictures', function () { state.doc.hasImage = true; self.fire('insert-picture'); dirty(); }, state.doc.hasImage, true),
          rbtn('shape', 'Shapes', function () { state.doc.hasShape = true; self.fire('insert-shape'); dirty(); }, state.doc.hasShape),
          rbtn('chart', 'Chart', function () { state.doc.hasChart = true; self.fire('insert-chart'); dirty(); }, state.doc.hasChart),
          tool('Icons'), tool('SmartArt', function () { state.doc.hasSmartArt = true; dirty(); }, state.doc.hasSmartArt)
        ]));
        host.appendChild(group('Links', [
          rbtn('link', 'Link', function () { state.doc.hasLink = true; self.fire('insert-link'); dirty(); }, state.doc.hasLink),
          tool('Bookmark')
        ]));
        host.appendChild(group('Comments', [
          rbtn('comment', 'Comment', function () { state.doc.comments = (state.doc.comments || 0) + 1; self.fire('comment'); dirty(); })
        ]));
        host.appendChild(group('Header & Footer', [
          rbtn('header', 'Header', function () { state.doc.header = 'RVNP'; dirty(); }, !!state.doc.header),
          rbtn('footer', 'Footer', function () { state.doc.footer = 'RVNP — ICT Department'; dirty(); }, !!state.doc.footer),
          rbtn('pageno', 'Page Number', function () { state.doc.pageNumbers = true; dirty(); }, state.doc.pageNumbers)
        ]));
        host.appendChild(group('Text', [
          tool('Text Box', function () { state.doc.hasTextBox = true; dirty(); }, state.doc.hasTextBox),
          tool('WordArt', function () { state.doc.hasWordArt = true; dirty(); }, state.doc.hasWordArt),
          tool('Date & Time')
        ]));
        host.appendChild(group('Symbols', [
          tool('Equation', function () { state.doc.hasEquation = true; dirty(); }, state.doc.hasEquation),
          tool('Symbol', function () { state.doc.hasSymbol = true; dirty(); }, state.doc.hasSymbol)
        ]));
      } else if (state.tab === 'Design') {
        host.appendChild(group('Document Formatting', [ tool('Themes'), tool('Colours'), tool('Fonts'), tool('Paragraph Spacing') ]));
        host.appendChild(group('Page Background', [
          tool('Watermark', function () { state.doc.watermark = state.doc.watermark ? null : 'DRAFT'; dirty(); }, !!state.doc.watermark),
          tool('Page Colour', function () { state.doc.pageColor = state.doc.pageColor ? null : '#f4f8ff'; dirty(); }, !!state.doc.pageColor),
          tool('Page Borders')
        ]));
      } else if (state.tab === 'Layout') {
        host.appendChild(group('Page Setup', [
          marginBtn(), orientBtn('portrait', 'Portrait'), orientBtn('landscape', 'Landscape'),
          pageSizeBtn(), columnsBtn(), tool('Breaks'), tool('Line Numbers'), tool('Hyphenation')
        ]));
        host.appendChild(group('Paragraph', [
          rbtn('outdent', 'Indent Left', function () { if (p) { p.indent = Math.max(0, (p.indent || 0) - 1); dirty(); } }),
          rbtn('indent', 'Indent Right', function () { if (p) { p.indent = Math.min(6, (p.indent || 0) + 1); dirty(); } })
        ]));
      } else if (state.tab === 'References') {
        host.appendChild(group('Table of Contents', [ tool('Table of Contents', function () { state.doc.hasTOC = true; dirty(); }, state.doc.hasTOC) ]));
        host.appendChild(group('Footnotes', [
          tool('Insert Footnote', function () { state.doc.footnotes = (state.doc.footnotes || 0) + 1; self.fire('footnote'); dirty(); }),
          tool('Insert Endnote')
        ]));
        host.appendChild(group('Citations & Bibliography', [ tool('Insert Citation'), tool('Bibliography') ]));
        host.appendChild(group('Captions', [ tool('Insert Caption'), tool('Cross-reference') ]));
      } else if (state.tab === 'Mailings') {
        host.appendChild(group('Start Mail Merge', [ tool('Start Mail Merge'), tool('Select Recipients') ]));
        host.appendChild(group('Write & Insert Fields', [ tool('Address Block'), tool('Greeting Line'), tool('Insert Merge Field') ]));
        host.appendChild(group('Finish', [ tool('Finish & Merge') ]));
      } else if (state.tab === 'Review') {
        host.appendChild(group('Proofing', [
          rbtn('spell', 'Spelling & Grammar', function () { runSpell(); }, false, true),
          tool('Thesaurus'), tool('Word Count', function () { self.fire('word-count', countWords(state.doc)); })
        ]));
        host.appendChild(group('Language', [ tool('Translate'), tool('Language') ]));
        host.appendChild(group('Comments', [
          rbtn('comment', 'New Comment', function () { state.doc.comments = (state.doc.comments || 0) + 1; self.fire('comment'); dirty(); }),
          tool('Delete'), tool('Previous'), tool('Next')
        ]));
        host.appendChild(group('Tracking', [
          tool('Track Changes', function () { state.doc.trackChanges = !state.doc.trackChanges; self.fire('track-changes', state.doc.trackChanges); dirty(); }, state.doc.trackChanges)
        ]));
      } else if (state.tab === 'View') {
        host.appendChild(group('Views', [ tool('Read Mode'), tool('Print Layout', null, true), tool('Web Layout') ]));
        host.appendChild(group('Show', [
          tool('Ruler', function () { state.doc.ruler = !state.doc.ruler; dirty(); }, state.doc.ruler),
          tool('Gridlines', function () { state.doc.gridlines = !state.doc.gridlines; dirty(); }, state.doc.gridlines)
        ]));
        host.appendChild(group('Zoom', [ rbtn('zoom', 'Zoom', function () { self.fire('command', 'Zoom'); }), tool('100%'), tool('One Page') ]));
      }
    }

    var clip = null;
    function currentPara() { return state.doc.paragraphs[state.doc.sel] || null; }
    function dirty() { pushUndo(); state.saved = false; self.update(); }
    function toggle(p, k) { if (p) { p[k] = !p[k]; dirty(); } }
    function setAlign(p, a) { if (p) { p.align = a; dirty(); } }
    function setList(p, t) { if (p) { p.list = (p.list === t ? null : t); dirty(); } }

    function fontFamily(p) {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Font',
        onchange: function () { if (p) { p.font = sel.value; dirty(); } } },
        ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(function (f) {
          return el('option', { value: f, text: f, selected: p && p.font === f });
        }));
      return sel;
    }
    function fontSize(p) {
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font size',
        onchange: function () { if (p) { p.size = parseInt(sel.value, 10); dirty(); } } },
        [11, 12, 14, 16, 18, 20, 24, 28, 32].map(function (n) {
          return el('option', { value: String(n), text: String(n), selected: p && p.size === n });
        }));
      return sel;
    }
    function colorBtn(p) {
      var colors = { Automatic: '#1b1b1b', Red: '#c00000', Blue: '#2b579a', Green: '#1f7a3d' };
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font colour',
        onchange: function () { if (p) { p.color = colors[sel.value]; dirty(); } } },
        Object.keys(colors).map(function (name) {
          return el('option', { value: name, text: name, selected: p && p.color === colors[name] });
        }));
      return sel;
    }
    function styleBtn(p, name) {
      return el('button', { class: 'of-style' + (p && p.style === name ? ' is-on' : ''), type: 'button', text: name,
        onclick: function () { if (p) { p.style = name; if (name === 'Heading 1' || name === 'Title') { p.size = name === 'Title' ? 28 : 20; p.bold = true; } dirty(); } } });
    }
    function marginBtn() {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Margins',
        onchange: function () { state.doc.margins = sel.value; dirty(); } },
        ['normal', 'narrow', 'wide'].map(function (m) {
          return el('option', { value: m, text: 'Margins: ' + m.charAt(0).toUpperCase() + m.slice(1), selected: state.doc.margins === m });
        }));
      return sel;
    }
    function orientBtn(o, label) {
      return rbtn(o === 'portrait' ? 'portrait' : 'landscape', label, function () { state.doc.orientation = o; dirty(); }, state.doc.orientation === o);
    }
    function setSubSup(p, which) {
      if (!p) return;
      var other = which === 'sub' ? 'sup' : 'sub';
      p[which] = !p[which]; if (p[which]) p[other] = false;
      dirty();
    }
    function clearFmt(p) {
      if (!p) return;
      p.bold = p.italic = p.underline = p.strike = p.sub = p.sup = false;
      p.highlight = null; p.shading = null; p.color = '#1b1b1b'; p.font = 'Calibri';
      p.size = 12; p.style = 'Normal'; p.list = null; p.indent = 0; p.lineSpacing = 1;
      dirty();
    }
    function lineSpacingBtn(p) {
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Line and paragraph spacing',
        onchange: function () { if (p) { p.lineSpacing = parseFloat(sel.value); dirty(); } } },
        [1, 1.15, 1.5, 2].map(function (n) { return el('option', { value: String(n), text: '↕ ' + n, selected: p && p.lineSpacing === n }); }));
      return sel;
    }
    function pageSizeBtn() {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Page size',
        onchange: function () { state.doc.pageSize = sel.value; self.fire('page-size', sel.value); dirty(); } },
        ['A4', 'Letter', 'Legal', 'A5'].map(function (s) { return el('option', { value: s, text: 'Size: ' + s, selected: state.doc.pageSize === s }); }));
      return sel;
    }
    function columnsBtn() {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Columns',
        onchange: function () { state.doc.columns = parseInt(sel.value, 10); self.fire('columns', state.doc.columns); dirty(); } },
        [1, 2, 3].map(function (n) { return el('option', { value: String(n), text: 'Columns: ' + n, selected: (state.doc.columns || 1) === n }); }));
      return sel;
    }
    function insertTable() {
      state.doc.tables = (state.doc.tables || 0) + 1;
      state.doc.paragraphs.splice(state.doc.sel + 1, 0, { text: '', table: { rows: 2, cols: 2 }, align: 'left', style: 'Normal' });
      self.fire('insert-table'); dirty();
    }
    function runSpell() {
      state.doc.spellChecked = true;
      state.doc.paragraphs.forEach(function (p) {
        if (p.text) p.text = p.text.replace(/\bteh\b/gi, 'the').replace(/\brecieve\b/gi, 'receive').replace(/\bdefinately\b/gi, 'definitely');
      });
      self.fire('spellcheck'); dirty();
    }

    function renderWord(stage) {
      var d = state.doc;
      var page = el('div', { class: 'of-page of-page-' + (d.orientation || 'portrait') + ' of-m-' + (d.margins || 'normal') });
      if (d.pageColor) page.style.background = d.pageColor;
      if ((d.columns || 1) > 1) { page.style.columnCount = d.columns; page.style.columnGap = '24px'; }
      if (d.watermark) page.appendChild(el('div', { class: 'of-watermark', text: d.watermark }));
      if (d.header) page.appendChild(el('div', { class: 'of-hdr', text: d.header }));
      if (d.coverPage) page.appendChild(el('div', { class: 'of-cover', html: '<b>Cover Page</b><span>Title · Subtitle · Author</span>' }));
      if (d.hasTOC) page.appendChild(el('div', { class: 'of-toc', html: '<b>Contents</b><span>1. Introduction</span><span>2. Body</span><span>3. Conclusion</span>' }));
      d.paragraphs.forEach(function (p, i) {
        if (p.table) { page.appendChild(wordTable(p, i)); return; }
        var cls = 'of-para' + (d.sel === i ? ' is-sel' : '');
        if (p.list) cls += ' of-list of-list-' + p.list;
        var deco = [];
        if (p.underline) deco.push('underline');
        if (p.strike) deco.push('line-through');
        var node = el('div', {
          class: cls + ' of-sty-' + (p.style || 'Normal').replace(/\s+/g, '').toLowerCase(),
          contenteditable: 'true', spellcheck: 'false',
          style: {
            fontWeight: p.bold ? '700' : '400', fontStyle: p.italic ? 'italic' : 'normal',
            textDecoration: deco.length ? deco.join(' ') : 'none', textAlign: p.align || 'left',
            fontFamily: p.font || 'Calibri', fontSize: (p.size || 12) + 'pt', color: p.color || '#1b1b1b',
            background: p.highlight || p.shading || 'transparent',
            marginLeft: ((p.indent || 0) * 24) + 'px', lineHeight: String((p.lineSpacing || 1) * 1.3),
            verticalAlign: p.sub ? 'sub' : (p.sup ? 'super' : 'baseline')
          }
        });
        node.textContent = p.text;
        node.addEventListener('focus', function () { d.sel = i; refreshRibbon(); });
        node.addEventListener('input', function () { p.text = node.textContent; state.saved = false; });
        page.appendChild(node);
      });
      if (d.hasImage) page.appendChild(el('div', { class: 'of-img', html: OFICON.imgph }));
      [['hasChart', 'Chart'], ['hasShape', 'Shape'], ['hasSmartArt', 'SmartArt'],
       ['hasTextBox', 'Text Box'], ['hasWordArt', 'WordArt'], ['hasEquation', 'Equation']
      ].forEach(function (f) { if (d[f[0]]) page.appendChild(el('div', { class: 'of-obj', text: '▦ ' + f[1] })); });
      if (d.footer) page.appendChild(el('div', { class: 'of-ftr', text: d.footer }));
      if (d.pageNumbers) page.appendChild(el('div', { class: 'of-pageno', text: '1' }));
      stage.appendChild(page);
    }
    function wordTable(p) {
      var t = el('table', { class: 'of-wtable' });
      for (var r = 0; r < p.table.rows; r++) {
        var tr = el('tr');
        for (var c = 0; c < p.table.cols; c++) tr.appendChild(el('td', { contenteditable: 'true' }));
        t.appendChild(tr);
      }
      return el('div', { class: 'of-wtable-wrap' }, [t]);
    }
    function refreshRibbon() {
      /* re-render only the ribbon groups without stealing caret unnecessarily */
      var groups = root.querySelector('.of-groups');
      if (groups) { clear(groups); ribbonGroups(groups); }
    }

    /* ===================== EXCEL ===================== */

    function excelRibbon(host) {
      if (state.tab === 'Home') {
        host.appendChild(group('Clipboard', [
          rbtn('paste', 'Paste', function () { self.fire('command', 'Paste'); }, false, true),
          rbtn('cut', 'Cut', function () { self.fire('command', 'Cut'); }),
          rbtn('copy', 'Copy', function () { self.fire('command', 'Copy'); }),
          rbtn('painter', 'Format Painter', function () { self.fire('command', 'Format Painter'); })
        ]));
        host.appendChild(group('Font', [
          xFontFamily(), xFontSize(),
          rbtn('bold', 'Bold', function () { cellFmt('bold'); }, fmtOn('bold')),
          rbtn('italic', 'Italic', function () { cellFmt('italic'); }, fmtOn('italic')),
          rbtn('under', 'Underline', function () { cellFmt('underline'); }, fmtOn('underline')),
          rbtn('border', 'Borders', function () { cellFmt('border'); }, fmtOn('border')),
          rbtn('fill', 'Fill Colour', function () { cellFmt('fill'); }, fmtOn('fill')),
          xColorBtn()
        ]));
        host.appendChild(group('Alignment', [
          rbtn('aligntop', 'Top Align', function () { setFmt('valign', 'top'); }, fmtVal('valign') === 'top'),
          rbtn('alignmid', 'Middle Align', function () { setFmt('valign', 'middle'); }, fmtVal('valign') === 'middle'),
          rbtn('alignbot', 'Bottom Align', function () { setFmt('valign', 'bottom'); }, fmtVal('valign') === 'bottom'),
          rbtn('alignl', 'Align Left', function () { setFmt('align', 'left'); }, fmtVal('align') === 'left'),
          rbtn('alignc', 'Center', function () { setFmt('align', 'center'); }, fmtVal('align') === 'center'),
          rbtn('alignr', 'Align Right', function () { setFmt('align', 'right'); }, fmtVal('align') === 'right'),
          rbtn('wrap', 'Wrap Text', function () { cellFmt('wrap'); }, fmtOn('wrap')),
          rbtn('merge', 'Merge & Centre', function () { cellFmt('merge'); }, fmtOn('merge'))
        ]));
        host.appendChild(group('Number', [
          numFmtBtn('General'), numFmtBtn('Number'), numFmtBtn('Currency'), numFmtBtn('Percent'), numFmtBtn('Comma'),
          rbtn('incdec', 'Increase Decimal', function () { decimal(1); }),
          rbtn('decdec', 'Decrease Decimal', function () { decimal(-1); })
        ]));
        host.appendChild(group('Styles', [
          tool('Conditional Formatting', function () { toggleSheet('conditional'); }, state.sheet.conditional),
          tool('Format as Table', function () { state.sheet.asTable = true; self.fire('format-as-table'); dirty(); }, state.sheet.asTable),
          tool('Cell Styles')
        ]));
        host.appendChild(group('Cells', [
          rbtn('insrow', 'Insert Rows', function () { doInsert('row'); }),
          rbtn('inscol', 'Insert Cols', function () { doInsert('col'); }),
          rbtn('delrow', 'Delete Rows', function () { doDelete('row'); }),
          rbtn('delcol', 'Delete Cols', function () { doDelete('col'); })
        ]));
        host.appendChild(group('Editing', [
          rbtn('sum', 'AutoSum', function () { autoSum(); }),
          rbtn('filldown', 'Fill Down', function () { doFill('down'); }),
          rbtn('fillright', 'Fill Right', function () { doFill('right'); }),
          rbtn('fillseries', 'Fill Series', function () { doFill('series'); }),
          rbtn('clearfmt', 'Clear', function () { clearActive(); }),
          tool('Sort & Filter'), tool('Find & Select')
        ]));
      } else if (state.tab === 'Insert') {
        host.appendChild(group('Tables', [
          tool('PivotTable'),
          tool('Table', function () { state.sheet.asTable = true; self.fire('format-as-table'); dirty(); }, state.sheet.asTable)
        ]));
        host.appendChild(group('Illustrations', [
          rbtn('picture', 'Pictures', function () { state.sheet.hasImage = true; self.fire('insert-picture'); dirty(); }, state.sheet.hasImage),
          rbtn('shape', 'Shapes', function () { state.sheet.hasShape = true; dirty(); }, state.sheet.hasShape),
          tool('Icons')
        ]));
        host.appendChild(group('Charts', [
          chartBtn('column', 'Column'), chartBtn('bar', 'Bar'), chartBtn('line', 'Line'), chartBtn('pie', 'Pie'), tool('PivotChart')
        ]));
        host.appendChild(group('Sparklines', [
          tool('Line', function () { state.sheet.sparkline = 'line'; dirty(); }, state.sheet.sparkline === 'line'),
          tool('Column', function () { state.sheet.sparkline = 'column'; dirty(); }, state.sheet.sparkline === 'column')
        ]));
        host.appendChild(group('Links', [ tool('Link') ]));
        host.appendChild(group('Text', [ tool('Text Box'), tool('Header & Footer'), tool('Symbol') ]));
      } else if (state.tab === 'Page Layout') {
        host.appendChild(group('Themes', [ tool('Themes'), tool('Colours'), tool('Fonts') ]));
        host.appendChild(group('Page Setup', [
          xMarginBtn(), xOrientBtn('portrait', 'Portrait'), xOrientBtn('landscape', 'Landscape'), tool('Size'),
          tool('Print Area', function () { state.sheet.printArea = selRangeA1() || state.active; self.fire('print-area', state.sheet.printArea); dirty(); }, !!state.sheet.printArea),
          tool('Breaks'), tool('Background'), tool('Print Titles')
        ]));
        host.appendChild(group('Scale to Fit', [ tool('Width'), tool('Height'), tool('Scale') ]));
        host.appendChild(group('Sheet Options', [
          tool('Gridlines', function () { toggleSheet('gridlines'); }, state.sheet.gridlines !== false),
          tool('Headings')
        ]));
      } else if (state.tab === 'Formulas') {
        host.appendChild(group('Function Library', [
          rbtn('sum', 'AutoSum', function () { autoSum(); }, false, true),
          tool('Recently Used'), tool('Financial'),
          fnInsert('IF'), fnInsert('SUMIF'), fnInsert('COUNT'), fnInsert('AVERAGE'), fnInsert('MAX'), fnInsert('MIN'), fnInsert('RANK'),
          tool('More Functions')
        ]));
        host.appendChild(group('Defined Names', [ tool('Name Manager'), tool('Define Name') ]));
        host.appendChild(group('Formula Auditing', [
          tool('Show Formulas', function () { toggleSheet('showFormulas'); }, state.sheet.showFormulas),
          tool('Trace Precedents'), tool('Error Checking')
        ]));
        host.appendChild(group('Calculation', [ tool('Calculate Now') ]));
      } else if (state.tab === 'Data') {
        host.appendChild(group('Get & Transform', [ tool('Get Data'), tool('From Text/CSV') ]));
        host.appendChild(group('Sort & Filter', [
          rbtn('sortaz', 'Sort A→Z', function () { sortBy(true); }, false, true),
          rbtn('sortza', 'Sort Z→A', function () { sortBy(false); }, false, true),
          rbtn('filter', 'Filter', function () { toggleFilter(); }, !!state.sheet.filter),
          tool('Clear'), tool('Advanced')
        ]));
        host.appendChild(group('Data Tools', [ tool('Text to Columns'), tool('Remove Duplicates'), tool('Data Validation'), tool('Flash Fill') ]));
        host.appendChild(group('Outline', [ tool('Group'), tool('Ungroup'), tool('Subtotal') ]));
      } else if (state.tab === 'Review') {
        host.appendChild(group('Proofing', [ tool('Spelling'), tool('Thesaurus') ]));
        host.appendChild(group('Comments', [ tool('New Comment'), tool('Delete'), tool('Show Comments') ]));
        host.appendChild(group('Protect', [ tool('Protect Sheet'), tool('Protect Workbook') ]));
      } else if (state.tab === 'View') {
        host.appendChild(group('Workbook Views', [ tool('Normal', null, true), tool('Page Break Preview'), tool('Page Layout') ]));
        host.appendChild(group('Show', [
          tool('Gridlines', function () { toggleSheet('gridlines'); }, state.sheet.gridlines !== false),
          tool('Formula Bar', null, true), tool('Headings', null, true)
        ]));
        host.appendChild(group('Zoom', [ rbtn('zoom', 'Zoom', function () { self.fire('command', 'Zoom'); }), tool('100%') ]));
        host.appendChild(group('Window', [
          tool('Freeze Panes', function () { state.sheet.frozen = state.sheet.frozen ? null : state.active; self.fire('freeze', state.sheet.frozen); dirty(); }, !!state.sheet.frozen)
        ]));
      }
    }
    function xFontFamily() {
      var cur = fmtVal('font') || 'Calibri';
      var sel = el('select', { class: 'of-select', 'aria-label': 'Font', onchange: function () { setFmt('font', sel.value); } },
        ['Calibri', 'Arial', 'Times New Roman', 'Consolas', 'Verdana'].map(function (f) { return el('option', { value: f, text: f, selected: cur === f }); }));
      return sel;
    }
    function xFontSize() {
      var cur = fmtVal('size') || 11;
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font size', onchange: function () { setFmt('size', parseInt(sel.value, 10)); } },
        [9, 10, 11, 12, 14, 16, 18, 20, 24].map(function (n) { return el('option', { value: String(n), text: String(n), selected: cur === n }); }));
      return sel;
    }
    function xColorBtn() {
      var colors = { Automatic: '#1b1b1b', Red: '#c00000', Blue: '#2b579a', Green: '#1f7a3d' };
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font colour', onchange: function () { setFmt('fontColor', colors[sel.value]); } },
        Object.keys(colors).map(function (n) { return el('option', { value: n, text: n, selected: fmtVal('fontColor') === colors[n] }); }));
      return sel;
    }
    function fmtVal(k) { var f = state.sheet.format[state.active]; return f ? f[k] : undefined; }
    function setFmt(k, val) { var f = state.sheet.format[state.active] || (state.sheet.format[state.active] = {}); f[k] = val; self.fire('format', k); dirty(); }
    function decimal(delta) { var f = state.sheet.format[state.active] || (state.sheet.format[state.active] = {}); f.decimals = Math.max(0, Math.min(6, (f.decimals || 0) + delta)); dirty(); }
    function toggleSheet(flag) { state.sheet[flag] = !state.sheet[flag]; self.fire('toggle', flag); dirty(); }
    function clearActive() { state.sheet.set(state.active, ''); delete state.sheet.format[state.active]; self.fire('clear', state.active); dirty(); }
    function xMarginBtn() {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Margins', onchange: function () { state.sheet.margins = sel.value; dirty(); } },
        ['normal', 'narrow', 'wide'].map(function (m) { return el('option', { value: m, text: 'Margins: ' + m.charAt(0).toUpperCase() + m.slice(1), selected: state.sheet.margins === m }); }));
      return sel;
    }
    function xOrientBtn(o, label) { return rbtn(o === 'portrait' ? 'portrait' : 'landscape', label, function () { state.sheet.orientation = o; dirty(); }, state.sheet.orientation === o); }

    function fmtOn(k) { var f = state.sheet.format[state.active]; return f && f[k]; }
    function cellFmt(k) {
      var f = state.sheet.format[state.active] || (state.sheet.format[state.active] = {});
      f[k] = !f[k]; dirty();
    }
    function numFmtBtn(name) {
      return el('button', { class: 'of-style' + (numFmtOf(state.active) === name ? ' is-on' : ''), type: 'button', text: name,
        onclick: function () { var f = state.sheet.format[state.active] || (state.sheet.format[state.active] = {}); f.numFmt = name; self.fire('number-format', name); dirty(); } });
    }
    function numFmtOf(ref) { var f = state.sheet.format[ref]; return f && f.numFmt; }

    function fnInsert(name) {
      return el('button', { class: 'of-style', type: 'button', text: name,
        onclick: function () { beginFormula(name + '('); } });
    }
    function autoSum() {
      var col = state.active.match(/^([A-J])(\d+)$/i);
      if (!col) return;
      var c = col[1], r = parseInt(col[2], 10);
      var top = r - 1, bot = r - 1;
      while (top > 1 && state.sheet.raw(c + (top - 1)) !== '' && !isNaN(parseFloat(state.sheet.raw(c + (top - 1))))) top--;
      if (bot < 1) return;
      state.sheet.set(state.active, '=SUM(' + c + top + ':' + c + bot + ')');
      self.fire('autosum', state.active); dirty();
    }
    function beginFormula(prefix) {
      state.editing = prefix; self.update();
      var fb = root.querySelector('.of-fx-input');
      if (fb) { fb.focus(); fb.value = '=' + prefix; }
    }

    function activeRC() { return refParts(state.active) || { c: 0, r: 1 }; }
    function currentSel() {
      if (state.selRange) return state.selRange;
      var rc = activeRC();
      return { c1: rc.c, r1: rc.r, c2: rc.c, r2: rc.r };
    }
    function doInsert(kind) {
      var rc = activeRC();
      if (kind === 'row') { insertRowAt(state.sheet, rc.r); self.fire('insert-row', rc.r); }
      else { insertColAt(state.sheet, rc.c); self.fire('insert-col', COLS[rc.c]); }
      dirty();
    }
    function doDelete(kind) {
      var rc = activeRC();
      if (kind === 'row') { deleteRowAt(state.sheet, rc.r); self.fire('delete-row', rc.r); }
      else { deleteColAt(state.sheet, rc.c); self.fire('delete-col', COLS[rc.c]); }
      dirty();
    }
    function doFill(dir) {
      var sel = currentSel();
      if (normRange(sel).ra === normRange(sel).rb && normRange(sel).ca === normRange(sel).cb) return; /* nothing to fill into */
      fillRange(state.sheet, sel, dir);
      self.fire('fill', dir);
      dirty();
    }

    function chartBtn(type, label) {
      return el('button', { class: 'of-style', type: 'button', text: label,
        onclick: function () {
          var rng = selRangeA1() || usedRange();
          state.sheet.charts.push({ type: type, range: rng });
          self.fire('insert-chart', type); dirty();
        } });
    }
    function selRangeA1() {
      if (!state.selRange) return null;
      var n = normRange(state.selRange);
      if (n.ca === n.cb && n.ra === n.rb) return null;
      return refOf(n.ca, n.ra) + ':' + refOf(n.cb, n.rb);
    }
    function usedRange() {
      var refs = Object.keys(state.sheet.cells);
      if (!refs.length) return 'A1:A1';
      var cs = refs.map(function (r) { return colIndex(r[0]); });
      var rs = refs.map(function (r) { return parseInt(r.slice(1), 10); });
      return COLS[Math.min.apply(null, cs)] + Math.min.apply(null, rs) + ':' + COLS[Math.max.apply(null, cs)] + Math.max.apply(null, rs);
    }

    function sortBy(asc) {
      var col = state.active[0];
      var rng = usedRange();
      var m = rng.match(/^([A-J])(\d+):([A-J])(\d+)$/);
      if (!m) return;
      var r1 = parseInt(m[2], 10), r2 = parseInt(m[4], 10);
      /* assume a header row if the first cell of the sort column is non-numeric */
      var header = isNaN(parseFloat(state.sheet.raw(col + r1)));
      var start = header ? r1 + 1 : r1;
      var rows = [];
      for (var r = start; r <= r2; r++) {
        var rowData = {};
        COLS.forEach(function (c) { rowData[c] = state.sheet.raw(c + r); });
        rows.push(rowData);
      }
      rows.sort(function (a, b) {
        var av = a[col], bv = b[col], an = parseFloat(av), bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
        return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
      rows.forEach(function (rowData, i) {
        var r = start + i;
        COLS.forEach(function (c) { state.sheet.set(c + r, rowData[c]); });
      });
      state.sheet.sortedBy = { col: col, asc: asc };
      self.fire('sort', col); dirty();
    }
    function toggleFilter() {
      if (state.sheet.filter) state.sheet.filter = null;
      else state.sheet.filter = { col: state.active[0], value: state.sheet.value(state.active) };
      self.fire('filter', state.sheet.filter && state.sheet.filter.value); dirty();
    }

    function renderExcel(stage) {
      /* formula bar */
      var nameBox = el('input', { class: 'of-namebox', value: state.active, readonly: 'readonly', 'aria-label': 'Name box' });
      var fx = el('input', { class: 'of-fx-input', 'aria-label': 'Formula bar', spellcheck: 'false',
        value: state.sheet.raw(state.active) });
      var fxDone = false;
      function commitFx() { if (fxDone) return; fxDone = true; commit(state.active, fx.value); }
      fx.addEventListener('change', commitFx);
      fx.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commitFx(); } });
      stage.appendChild(el('div', { class: 'of-fxbar' }, [ nameBox, el('span', { class: 'of-fx-eq', text: 'fx' }), fx ]));

      var grid = el('div', { class: 'of-grid' + (state.sheet.gridlines === false ? ' of-nogrid' : '') });
      /* header row */
      var head = el('div', { class: 'of-grow of-ghead' });
      head.appendChild(el('div', { class: 'of-gcell of-gcorner' }));
      COLS.forEach(function (c) { head.appendChild(el('div', { class: 'of-gcell of-ghcol', text: c })); });
      grid.appendChild(head);
      for (var r = 1; r <= NROWS; r++) {
        if (state.sheet.filter && state.sheet.filter.value != null) {
          var fv = state.sheet.value(state.sheet.filter.col + r);
          var header = r === 1;
          if (!header && String(fv) !== String(state.sheet.filter.value)) continue;
        }
        grid.appendChild(gridRow(r));
      }
      stage.appendChild(grid);
      stage.appendChild(sheetTabs());

      function inSel(ci, ri) {
        if (!state.selRange) return false;
        var n = normRange(state.selRange);
        return ci >= n.ca && ci <= n.cb && ri >= n.ra && ri <= n.rb;
      }
      function paintSel() {
        grid.querySelectorAll('.of-gdata').forEach(function (e) {
          var ci = +e.dataset.ci, ri = +e.dataset.ri;
          e.classList.toggle('is-active', e.dataset.ref === state.active);
          e.classList.toggle('is-insel', inSel(ci, ri) && e.dataset.ref !== state.active);
        });
      }
      function selectTo(ci, ri) {
        state.selRange.c2 = ci; state.selRange.r2 = ri;
        paintSel();
      }
      function beginSelect(ci, ri, ref) {
        state.active = ref;
        state.selRange = { c1: ci, r1: ri, c2: ci, r2: ri };
        selDragging = true;
        nameBox.value = ref;
        fx.value = state.sheet.raw(ref); fxDone = false;
        paintSel();
        refreshRibbon();   /* reflect this cell's format state in the ribbon */
      }
      function gridRow(r) {
        var row = el('div', { class: 'of-grow' });
        row.appendChild(el('div', { class: 'of-gcell of-ghrow', text: String(r) }));
        COLS.forEach(function (c) {
          var ci = colIndex(c), ref = c + r;
          var cellObj = state.sheet.cell(ref);
          var fmt = state.sheet.format[ref] || {};
          var disp = cellObj.value;
          var isNum = typeof disp === 'number';
          if (state.sheet.showFormulas && cellObj.formula) {
            disp = cellObj.formula; isNum = false;
          } else if (isNum) {
            var dec = fmt.decimals;
            if (fmt.numFmt === 'Currency') disp = 'KSh ' + fmtNum(disp, dec == null ? 2 : dec);
            else if (fmt.numFmt === 'Percent') disp = fmtNum(disp * 100, dec == null ? 0 : dec) + '%';
            else if (fmt.numFmt === 'Comma') disp = fmtNum(disp, dec == null ? 2 : dec);
            else if (dec != null) disp = fmtNum(disp, dec);
            else disp = Math.round(disp * 1e9) / 1e9;
          }
          var cell = el('div', {
            class: 'of-gcell of-gdata' + (state.active === ref ? ' is-active' : '') +
              (inSel(ci, r) && state.active !== ref ? ' is-insel' : '') +
              (isNum ? ' is-num' : '') + (fmt.bold ? ' is-bold' : '') +
              (fmt.border ? ' is-bordered' : '') + (fmt.fill ? ' is-filled' : ''),
            data: { ci: String(ci), ri: String(r), ref: ref },
            style: {
              textAlign: fmt.align || '', fontStyle: fmt.italic ? 'italic' : '',
              textDecoration: fmt.underline ? 'underline' : '', color: fmt.fontColor || '',
              whiteSpace: fmt.wrap ? 'normal' : ''
            },
            text: disp === '' ? '' : String(disp)
          });
          cell.addEventListener('mousedown', function (e) { e.preventDefault(); beginSelect(ci, r, ref); });
          cell.addEventListener('mouseenter', function () { if (selDragging) selectTo(ci, r); });
          cell.addEventListener('dblclick', function () { editCell(cell, ref); });
          row.appendChild(cell);
        });
        return row;
      }
      function editCell(cell, ref) {
        var inp = el('input', { class: 'of-celledit', value: state.sheet.raw(ref), spellcheck: 'false' });
        clear(cell); cell.appendChild(inp); inp.focus(); inp.select();
        var finished = false;
        function done() { if (finished) return; finished = true; commit(ref, inp.value); }
        inp.addEventListener('blur', done);
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); done(); }
          else if (e.key === 'Escape') { finished = true; self.updateSoon(); }
        });
      }
    }
    function commit(ref, val) {
      pushUndo();
      state.sheet.set(ref, val.trim());
      state.saved = false;
      self.fire('cell', ref);
      self.updateSoon();
    }
    function sheetMenu(ev, idx) {
      ev.preventDefault();
      closeSheetMenu();
      var items = [
        { label: 'Rename', action: function () { renameSheet(idx); } },
        { label: 'Move Left', disabled: idx === 0, action: function () { moveSheet(idx, -1); } },
        { label: 'Move Right', disabled: idx === state.sheets.length - 1, action: function () { moveSheet(idx, 1); } },
        { label: 'Delete', disabled: state.sheets.length <= 1, action: function () { deleteSheet(idx); } }
      ];
      var menu = el('div', { class: 'of-ctx' }, items.map(function (it) {
        return el('button', { class: 'of-ctx-item' + (it.disabled ? ' is-disabled' : ''), type: 'button', disabled: !!it.disabled, text: it.label,
          onclick: function () { closeSheetMenu(); it.action(); } });
      }));
      root.appendChild(menu);
      var rr = root.getBoundingClientRect();
      menu.style.left = Math.min(ev.clientX - rr.left, rr.width - 150) + 'px';
      menu.style.top = Math.min(ev.clientY - rr.top, rr.height - 140) + 'px';
      self._sheetMenu = menu;
      setTimeout(function () { document.addEventListener('mousedown', closeSheetMenu); }, 0);
    }
    function closeSheetMenu() {
      if (self._sheetMenu && self._sheetMenu.parentNode) self._sheetMenu.parentNode.removeChild(self._sheetMenu);
      self._sheetMenu = null;
      document.removeEventListener('mousedown', closeSheetMenu);
    }
    function renameSheet(idx) {
      promptName('Rename sheet', state.sheets[idx], function (nm) {
        nm = (nm || '').trim();
        if (!nm || state.sheets.indexOf(nm) !== -1) { self.update(); return; }
        var was = state.sheets[idx];
        state.sheets[idx] = nm;
        if (state.activeSheet === was) state.activeSheet = nm;
        self.fire('rename-sheet', nm); dirty();
      });
    }
    function moveSheet(idx, dir) {
      var j = idx + dir;
      if (j < 0 || j >= state.sheets.length) return;
      var t = state.sheets[idx]; state.sheets[idx] = state.sheets[j]; state.sheets[j] = t;
      self.fire('move-sheet', state.sheets[j]); dirty();
    }
    function deleteSheet(idx) {
      if (state.sheets.length <= 1) return;
      var was = state.sheets.splice(idx, 1)[0];
      if (state.activeSheet === was) state.activeSheet = state.sheets[Math.max(0, idx - 1)];
      self.fire('delete-sheet', was); dirty();
    }
    function sheetTabs() {
      return el('div', { class: 'of-sheettabs' }, state.sheets.map(function (sn, i) {
        return el('button', { class: 'of-sheettab' + (state.activeSheet === sn ? ' is-on' : ''), type: 'button', text: sn,
          title: 'Double-click to rename · right-click for more',
          onclick: function () { state.activeSheet = sn; self.fire('activate-sheet', sn); self.update(); },
          ondblclick: function () { renameSheet(i); },
          oncontextmenu: function (e) { sheetMenu(e, i); } });
      }).concat([ el('button', { class: 'of-sheetadd', type: 'button', text: '+', title: 'New sheet',
        onclick: function () { var n = 'Sheet' + (state.sheets.length + 1); while (state.sheets.indexOf(n) !== -1) n += '+'; state.sheets.push(n); self.fire('add-sheet', n); dirty(); } }) ]));
    }

    /* ===================== POWERPOINT ===================== */

    function pptRibbon(host) {
      var s = cur();
      if (state.tab === 'Home') {
        host.appendChild(group('Clipboard', [
          rbtn('paste', 'Paste', function () { self.fire('command', 'Paste'); }, false, true),
          rbtn('cut', 'Cut', function () { self.fire('command', 'Cut'); }),
          rbtn('copy', 'Copy', function () { self.fire('command', 'Copy'); }),
          rbtn('painter', 'Format Painter', function () { self.fire('command', 'Format Painter'); })
        ]));
        host.appendChild(group('Slides', [
          rbtn('newslide', 'New Slide', function () { addSlide(); }, false, true),
          layoutBtn(),
          rbtn('dupslide', 'Duplicate', function () { duplicateSlide(); }),
          rbtn('delslide', 'Delete', function () { deleteSlide(); }),
          tool('Section', function () { state.deck.sections = (state.deck.sections || 0) + 1; dirty(); })
        ]));
        host.appendChild(group('Font', [
          pFontFamily(s), pFontSize(s),
          rbtn('bold', 'Bold', function () { if (s) { s.titleBold = !s.titleBold; dirty(); } }, s && s.titleBold),
          rbtn('italic', 'Italic', function () { if (s) { s.italic = !s.italic; dirty(); } }, s && s.italic),
          rbtn('under', 'Underline', function () { if (s) { s.underline = !s.underline; dirty(); } }, s && s.underline),
          pColorBtn(s)
        ]));
        host.appendChild(group('Paragraph', [
          rbtn('bullets', 'Bullets', function () { self.fire('command', 'Bullets'); }),
          rbtn('alignl', 'Align Left', function () { if (s) { s.align = 'left'; dirty(); } }, s && s.align === 'left'),
          rbtn('alignc', 'Center', function () { if (s) { s.align = 'center'; dirty(); } }, s && s.align === 'center'),
          rbtn('alignr', 'Align Right', function () { if (s) { s.align = 'right'; dirty(); } }, s && s.align === 'right'),
          tool('Columns'), tool('Line Spacing'), tool('Convert to SmartArt')
        ]));
        host.appendChild(group('Drawing', [
          rbtn('shape', 'Shapes', function () { if (s) { s.hasShape = true; dirty(); } }, s && s.hasShape),
          tool('Arrange'), tool('Quick Styles'), tool('Shape Fill'), tool('Shape Outline')
        ]));
        host.appendChild(group('Editing', [ tool('Find'), tool('Replace'), tool('Select') ]));
      } else if (state.tab === 'Insert') {
        host.appendChild(group('Slides', [ rbtn('newslide', 'New Slide', function () { addSlide(); }, false, true) ]));
        host.appendChild(group('Tables', [ rbtn('table', 'Table', function () { if (s) { s.hasTable = true; dirty(); } }, s && s.hasTable) ]));
        host.appendChild(group('Images', [
          rbtn('picture', 'Pictures', function () { if (s) { s.hasImage = true; self.fire('insert-picture'); dirty(); } }, s && s.hasImage, true),
          tool('Screenshot'), tool('Photo Album')
        ]));
        host.appendChild(group('Illustrations', [
          rbtn('shape', 'Shapes', function () { if (s) { s.hasShape = true; dirty(); } }, s && s.hasShape),
          rbtn('chart', 'Chart', function () { if (s) { s.hasChart = true; self.fire('insert-chart'); dirty(); } }, s && s.hasChart),
          tool('Icons'), tool('SmartArt', function () { if (s) { s.hasSmartArt = true; dirty(); } }, s && s.hasSmartArt), tool('3D Models')
        ]));
        host.appendChild(group('Links', [ rbtn('link', 'Link', function () { self.fire('command', 'Link'); }), tool('Action') ]));
        host.appendChild(group('Comments', [ rbtn('comment', 'Comment', function () { self.fire('comment'); }) ]));
        host.appendChild(group('Text', [
          tool('Text Box', function () { if (s) { s.hasTextBox = true; dirty(); } }, s && s.hasTextBox),
          tool('Header & Footer'),
          tool('WordArt', function () { if (s) { s.hasWordArt = true; dirty(); } }, s && s.hasWordArt),
          tool('Slide Number', function () { state.deck.slideNumbers = !state.deck.slideNumbers; dirty(); }, state.deck.slideNumbers)
        ]));
        host.appendChild(group('Media', [
          tool('Video', function () { if (s) { s.hasVideo = true; self.fire('insert-video'); dirty(); } }, s && s.hasVideo),
          tool('Screen Recording')
        ]));
      } else if (state.tab === 'Design') {
        host.appendChild(group('Themes', THEMES.map(function (t) {
          return el('button', { class: 'of-theme' + (state.deck.theme === t.id ? ' is-on' : ''), type: 'button', title: t.name,
            style: { background: t.bg, color: t.fg }, text: t.name.slice(0, 2),
            onclick: function () { state.deck.theme = t.id; self.fire('theme', t.id); dirty(); } });
        })));
        host.appendChild(group('Variants', [0, 1, 2, 3].map(function (v) {
          return el('button', { class: 'of-style' + (state.deck.variant === v ? ' is-on' : ''), type: 'button', text: 'V' + (v + 1),
            onclick: function () { state.deck.variant = v; self.fire('variant', v); dirty(); } });
        })));
        host.appendChild(group('Customise', [
          tool('Slide Size', function () { state.deck.slideSize = state.deck.slideSize === '16:9' ? '4:3' : '16:9'; self.fire('slide-size', state.deck.slideSize); dirty(); }),
          tool('Format Background', function () { state.deck.bgStyle = state.deck.bgStyle ? null : 'gradient'; dirty(); }, !!state.deck.bgStyle),
          tool('Designer')
        ]));
      } else if (state.tab === 'Transitions') {
        host.appendChild(group('Preview', [ tool('Preview') ]));
        host.appendChild(group('Transition to This Slide', ['None', 'Fade', 'Push', 'Wipe', 'Morph', 'Cut'].map(function (tr) {
          return el('button', { class: 'of-style' + (s && s.transition === tr ? ' is-on' : ''), type: 'button', text: tr,
            onclick: function () { if (s) { s.transition = tr; self.fire('transition', tr); dirty(); } } });
        })));
        host.appendChild(group('Timing', [
          tool('Effect Options'), tool('Sound'), tool('Duration'),
          tool('Apply To All', function () { var tr = s && s.transition; state.deck.slides.forEach(function (sl) { sl.transition = tr; }); self.fire('apply-all', tr); dirty(); })
        ]));
      } else if (state.tab === 'Animations') {
        host.appendChild(group('Preview', [ tool('Preview') ]));
        host.appendChild(group('Animation', ['None', 'Appear', 'Fade', 'Fly In', 'Zoom', 'Wipe'].map(function (an) {
          return el('button', { class: 'of-style' + (s && s.animation === an ? ' is-on' : ''), type: 'button', text: an,
            onclick: function () { if (s) { s.animation = an; self.fire('animation', an); dirty(); } } });
        })));
        host.appendChild(group('Advanced Animation', [ tool('Add Animation'), tool('Animation Pane'), tool('Trigger') ]));
        host.appendChild(group('Timing', [ tool('Start'), tool('Duration'), tool('Delay') ]));
      } else if (state.tab === 'Slide Show') {
        host.appendChild(group('Start Slide Show', [
          rbtn('play', 'From Beginning', function () { startShow(0); }, false, true),
          rbtn('play', 'From Current Slide', function () { startShow(state.deck.current); })
        ]));
        host.appendChild(group('Set Up', [ tool('Set Up Slide Show'), tool('Rehearse Timings'), tool('Record Slide Show'), tool('Hide Slide') ]));
      } else if (state.tab === 'Review') {
        host.appendChild(group('Proofing', [ tool('Spelling'), tool('Thesaurus') ]));
        host.appendChild(group('Comments', [ rbtn('comment', 'New Comment', function () { self.fire('comment'); }), tool('Show Comments') ]));
        host.appendChild(group('Compare', [ tool('Compare') ]));
      } else if (state.tab === 'View') {
        host.appendChild(group('Presentation Views', [ tool('Normal', null, true), tool('Slide Sorter'), tool('Notes Page'), tool('Reading View') ]));
        host.appendChild(group('Master Views', [ tool('Slide Master'), tool('Handout Master') ]));
        host.appendChild(group('Show', [ tool('Ruler'), tool('Gridlines'), tool('Guides') ]));
        host.appendChild(group('Zoom', [ rbtn('zoom', 'Zoom', function () { self.fire('command', 'Zoom'); }), tool('Fit to Window') ]));
      }
    }
    function pFontFamily(s) {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Font', onchange: function () { if (s) { s.font = sel.value; dirty(); } } },
        ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(function (f) { return el('option', { value: f, text: f, selected: s && s.font === f }); }));
      return sel;
    }
    function pFontSize(s) {
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font size', onchange: function () { if (s) { s.size = parseInt(sel.value, 10); dirty(); } } },
        [14, 18, 24, 28, 32, 40, 44, 54].map(function (n) { return el('option', { value: String(n), text: String(n), selected: s && s.size === n }); }));
      return sel;
    }
    function pColorBtn(s) {
      var colors = { Automatic: '#1b1b1b', Red: '#c00000', Blue: '#2b579a', Green: '#1f7a3d', White: '#ffffff' };
      var sel = el('select', { class: 'of-select of-select-sm', 'aria-label': 'Font colour', onchange: function () { if (s) { s.color = colors[sel.value]; dirty(); } } },
        Object.keys(colors).map(function (n) { return el('option', { value: n, text: n, selected: s && s.color === colors[n] }); }));
      return sel;
    }

    function cur() { return state.deck.slides[state.deck.current] || null; }
    function addSlide() {
      state.deck.slides.splice(state.deck.current + 1, 0, newSlide(state.deck.layout || 'Title and Content'));
      state.deck.current++; self.fire('add-slide'); dirty();
    }
    function duplicateSlide() {
      var s = cur(); if (!s) return;
      state.deck.slides.splice(state.deck.current + 1, 0, JSON.parse(JSON.stringify(s)));
      state.deck.current++; self.fire('duplicate-slide'); dirty();
    }
    function deleteSlide() {
      if (state.deck.slides.length <= 1) return;
      state.deck.slides.splice(state.deck.current, 1);
      if (state.deck.current >= state.deck.slides.length) state.deck.current = state.deck.slides.length - 1;
      self.fire('delete-slide'); dirty();
    }
    function moveSlide(dir) {
      var i = state.deck.current, j = i + dir;
      if (j < 0 || j >= state.deck.slides.length) return;
      var t = state.deck.slides[i]; state.deck.slides[i] = state.deck.slides[j]; state.deck.slides[j] = t;
      state.deck.current = j; self.fire('move-slide'); dirty();
    }
    function layoutBtn() {
      var sel = el('select', { class: 'of-select', 'aria-label': 'Slide layout',
        onchange: function () { var s = cur(); if (s) { s.layout = sel.value; dirty(); } } },
        ['Title Slide', 'Title and Content', 'Two Content', 'Blank'].map(function (l) {
          return el('option', { value: l, text: l, selected: cur() && cur().layout === l });
        }));
      return sel;
    }
    function startShow(from) { state.deck.slideshow = true; state.deck.showIndex = from; self.fire('slideshow', from); self.update(); }

    function renderPpt(stage) {
      if (state.deck.slideshow) { renderShow(stage); return; }
      var wrap = el('div', { class: 'of-ppt' });
      /* nav pane */
      var nav = el('div', { class: 'of-slidenav' });
      state.deck.slides.forEach(function (s, i) {
        var thumb = el('button', { class: 'of-thumb' + (state.deck.current === i ? ' is-on' : ''), type: 'button',
          onclick: function () { state.deck.current = i; self.update(); } }, [
          el('span', { class: 'of-thumb-no', text: String(i + 1) }),
          el('span', { class: 'of-thumb-mini ' + themeCls(), html: '<b>' + D.esc(s.title || '') + '</b>' })
        ]);
        nav.appendChild(thumb);
      });
      wrap.appendChild(nav);

      /* canvas + notes */
      var center = el('div', { class: 'of-slidecenter' });
      var s = cur();
      var canvas = el('div', { class: 'of-canvas ' + themeCls() + (state.deck.slideSize === '4:3' ? ' of-canvas-43' : '') });
      if (s) {
        if (s.layout !== 'Blank') {
          var title = el('div', { class: 'of-ph of-ph-title', contenteditable: 'true', spellcheck: 'false',
            style: {
              fontWeight: s.titleBold ? '800' : '700', fontStyle: s.italic ? 'italic' : 'normal',
              textDecoration: s.underline ? 'underline' : 'none', textAlign: s.align || 'left',
              fontFamily: s.font || 'Calibri', color: s.color || ''
            } });
          title.textContent = s.title || '';
          if (!s.title) title.setAttribute('data-ph', 'Click to add title');
          title.addEventListener('input', function () { s.title = title.textContent; state.saved = false; updateThumbs(); });
          canvas.appendChild(title);
        }
        if (s.layout === 'Title and Content' || s.layout === 'Two Content') {
          var body = el('div', { class: 'of-ph of-ph-body', contenteditable: 'true', spellcheck: 'false',
            style: { textAlign: s.align || 'left', fontFamily: s.font || 'Calibri' } });
          body.textContent = (s.body || []).join('\n');
          if (!s.body || !s.body.length) body.setAttribute('data-ph', 'Click to add text');
          body.addEventListener('input', function () { s.body = body.textContent.split('\n'); state.saved = false; });
          canvas.appendChild(body);
        }
        if (s.hasImage) canvas.appendChild(el('div', { class: 'of-slide-img', html: OFICON.imgph }));
        [['hasTable', 'Table'], ['hasChart', 'Chart'], ['hasShape', 'Shape'], ['hasSmartArt', 'SmartArt'],
         ['hasTextBox', 'Text Box'], ['hasWordArt', 'WordArt'], ['hasVideo', 'Video']
        ].forEach(function (f) { if (s[f[0]]) canvas.appendChild(el('div', { class: 'of-slide-obj', text: '▦ ' + f[1] })); });
        if (s.transition && s.transition !== 'None') canvas.appendChild(el('span', { class: 'of-trans-badge', text: '✦ ' + s.transition }));
        if (s.animation && s.animation !== 'None') canvas.appendChild(el('span', { class: 'of-anim-badge', text: '★ ' + s.animation }));
        if (state.deck.slideNumbers) canvas.appendChild(el('span', { class: 'of-slide-no', text: String(state.deck.current + 1) }));
      }
      center.appendChild(canvas);
      center.appendChild(el('div', { class: 'of-reorder' }, [
        el('button', { class: 'of-ro', type: 'button', text: '▲ Move up', onclick: function () { moveSlide(-1); } }),
        el('button', { class: 'of-ro', type: 'button', text: '▼ Move down', onclick: function () { moveSlide(1); } })
      ]));
      var notes = el('textarea', { class: 'of-notes', placeholder: 'Click to add notes' });
      notes.value = (s && s.notes) || '';
      notes.addEventListener('input', function () { if (s) { s.notes = notes.value; state.saved = false; } });
      center.appendChild(notes);
      wrap.appendChild(center);
      stage.appendChild(wrap);

      function updateThumbs() {
        nav.querySelectorAll('.of-thumb-mini b').forEach(function (b, i) { b.textContent = state.deck.slides[i].title || ''; });
      }
    }
    function themeCls() { return 'of-th-' + (state.deck.theme || 'office'); }
    function renderShow(stage) {
      var s = state.deck.slides[state.deck.showIndex] || state.deck.slides[0];
      var show = el('div', { class: 'of-show ' + themeCls() }, [
        el('div', { class: 'of-show-slide' }, [
          el('h2', { text: s.title || '' }),
          el('div', { class: 'of-show-body' }, (s.body || []).map(function (b) { return el('p', { text: b }); }))
        ]),
        el('div', { class: 'of-show-ctrls' }, [
          el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: '‹ Prev',
            onclick: function () { if (state.deck.showIndex > 0) { state.deck.showIndex--; self.update(); } } }),
          el('span', { class: 'of-show-count', text: (state.deck.showIndex + 1) + ' / ' + state.deck.slides.length }),
          el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Next ›',
            onclick: function () { if (state.deck.showIndex < state.deck.slides.length - 1) { state.deck.showIndex++; self.update(); } } }),
          el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'End show',
            onclick: function () { state.deck.slideshow = false; self.update(); } })
        ])
      ]);
      stage.appendChild(show);
    }

    /* ---------- tiny prompt ---------- */
    function promptName(title, def, cb) {
      var overlay = el('div', { class: 'of-modal' }, [
        el('div', { class: 'of-modal-card' }, [
          el('h3', { text: title }),
          (function () {
            var inp = el('input', { class: 'dl-input', value: def });
            overlay._inp = inp;
            return inp;
          })(),
          el('div', { class: 'of-modal-row' }, [
            el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Cancel', onclick: function () { root.removeChild(overlay); cb(null); } }),
            el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'OK', onclick: function () { var v = overlay._inp.value; root.removeChild(overlay); cb(v); } })
          ])
        ])
      ]);
      root.appendChild(overlay);
      overlay._inp.focus(); overlay._inp.select();
    }

    render();
    return self;
  }

  /* ============================================================= *
   *  Model builders                                               *
   * ============================================================= */

  function buildDoc(setup) {
    var doc = {
      paragraphs: [], sel: setup.sel || 0, orientation: setup.orientation || 'portrait',
      margins: setup.margins || 'normal', tables: 0, hasImage: false, hasShape: false,
      hasChart: false, hasSmartArt: false, hasLink: false, hasTextBox: false, hasWordArt: false,
      hasEquation: false, hasSymbol: false, comments: 0, pageBreaks: 0, footnotes: 0,
      hasTOC: false, coverPage: false, columns: 1, pageSize: setup.pageSize || 'A4',
      watermark: null, pageColor: null, trackChanges: false, ruler: true, gridlines: false,
      findReplace: false,
      header: setup.header || null, footer: null, pageNumbers: false, spellChecked: false
    };
    var paras = setup.doc || setup.paragraphs;
    if (paras && paras.length) {
      doc.paragraphs = paras.map(function (p) {
        if (typeof p === 'string') return para(p);
        return Object.assign(para(p.text || ''), p);
      });
    } else {
      doc.paragraphs = [ para('') ];
    }
    return doc;
  }
  function para(text) {
    return { text: text, bold: false, italic: false, underline: false, strike: false,
      sub: false, sup: false, highlight: null, align: 'left', style: 'Normal',
      font: 'Calibri', size: 12, color: '#1b1b1b', list: null, indent: 0, lineSpacing: 1, shading: null };
  }
  function countWords(doc) {
    return doc.paragraphs.reduce(function (n, p) {
      var t = (p.text || '').trim();
      return n + (t ? t.split(/\s+/).length : 0);
    }, 0);
  }

  function buildDeck(setup) {
    var deck = { slides: [], current: 0, theme: setup.theme || 'office', variant: 0,
      slideSize: setup.slideSize || '16:9', bgStyle: null, slideNumbers: false, sections: 0,
      layout: 'Title and Content', slideshow: false };
    if (setup.slides && setup.slides.length) {
      deck.slides = setup.slides.map(function (s) {
        if (typeof s === 'string') return newSlide('Title and Content', s);
        return Object.assign(newSlide(s.layout || 'Title and Content'), s);
      });
    } else {
      deck.slides = [ newSlide('Title Slide') ];
    }
    return deck;
  }
  function newSlide(layout, title) {
    return { layout: layout || 'Title and Content', title: title || '', body: [], notes: '',
      transition: 'None', animation: 'None', titleBold: false, italic: false, underline: false,
      align: 'left', font: 'Calibri', size: 28, color: '#1b1b1b',
      hasImage: false, hasTable: false, hasShape: false, hasSmartArt: false, hasChart: false,
      hasVideo: false, hasTextBox: false, hasWordArt: false };
  }

  var THEMES = [
    { id: 'office', name: 'Office', bg: '#ffffff', fg: '#1b1b1b' },
    { id: 'berlin', name: 'Berlin', bg: '#1f2a36', fg: '#f2f4f7' },
    { id: 'ion', name: 'Ion', bg: '#0f5c4a', fg: '#eafff6' },
    { id: 'facet', name: 'Facet', bg: '#f4efe6', fg: '#2a2520' },
    { id: 'wisp', name: 'Wisp', bg: '#eef4fb', fg: '#1b3a5b' }
  ];

  /* ============================================================= *
   *  Drawn glyphs (in-house, no trademarked artwork)              *
   * ============================================================= */

  var OFICON = {
    save: '<svg viewBox="0 0 20 20" class="ofi"><path d="M4 3h9l3 3v11H4z" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="7" y="3" width="6" height="4" fill="currentColor"/><rect x="6" y="11" width="8" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
    undo: '<svg viewBox="0 0 20 20" class="ofi"><path d="M7 7H13a4 4 0 0 1 0 8H8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 7 4 4m3 3L4 10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    redo: '<svg viewBox="0 0 20 20" class="ofi"><path d="M13 7H7a4 4 0 0 0 0 8h5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 7 16 4m-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    bold: '<svg viewBox="0 0 20 20" class="ofi"><text x="4" y="15" font-size="15" font-weight="800" font-family="Georgia">B</text></svg>',
    italic: '<svg viewBox="0 0 20 20" class="ofi"><text x="5" y="15" font-size="15" font-style="italic" font-family="Georgia">I</text></svg>',
    under: '<svg viewBox="0 0 20 20" class="ofi"><text x="5" y="14" font-size="14" font-family="Georgia">U</text><rect x="4" y="16" width="12" height="1.6" fill="currentColor"/></svg>',
    alignl: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.5"><path d="M3 5h14M3 9h9M3 13h14M3 17h9"/></g></svg>',
    alignc: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.5"><path d="M3 5h14M5 9h10M3 13h14M5 17h10"/></g></svg>',
    alignr: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.5"><path d="M3 5h14M8 9h9M3 13h14M8 17h9"/></g></svg>',
    justify: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.5"><path d="M3 5h14M3 9h14M3 13h14M3 17h14"/></g></svg>',
    bullets: '<svg viewBox="0 0 20 20" class="ofi"><g fill="currentColor"><circle cx="4" cy="6" r="1.6"/><circle cx="4" cy="11" r="1.6"/><circle cx="4" cy="16" r="1.6"/></g><g stroke="currentColor" stroke-width="1.5"><path d="M8 6h9M8 11h9M8 16h9"/></g></svg>',
    numbers: '<svg viewBox="0 0 20 20" class="ofi"><g fill="currentColor" font-size="6" font-family="system-ui"><text x="2" y="8">1</text><text x="2" y="13">2</text><text x="2" y="18">3</text></g><g stroke="currentColor" stroke-width="1.5"><path d="M8 6h9M8 11h9M8 16h9"/></g></svg>',
    paste: '<svg viewBox="0 0 20 20" class="ofi"><rect x="5" y="4" width="10" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="7" y="2.5" width="6" height="3" rx="1" fill="currentColor"/></svg>',
    cut: '<svg viewBox="0 0 20 20" class="ofi"><circle cx="5" cy="14" r="2.3" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="13" cy="14" r="2.3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.5 12 15 4M11.5 12 5 4" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
    copy: '<svg viewBox="0 0 20 20" class="ofi"><rect x="4" y="4" width="9" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="7" y="7" width="9" height="11" rx="1" fill="#fff" stroke="currentColor" stroke-width="1.3"/></svg>',
    table: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="4" width="14" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 8h14M3 12h14M8 4v12M12 4v12" stroke="currentColor" stroke-width="1"/></svg>',
    picture: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="4" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="7" cy="8" r="1.4" fill="currentColor"/><path d="M4 15l4-4 3 3 3-4 2 3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    shape: '<svg viewBox="0 0 20 20" class="ofi"><circle cx="7" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="10" y="10" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    header: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="3" width="14" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="3" width="14" height="4" fill="currentColor" opacity=".5"/></svg>',
    footer: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="3" width="14" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="13" width="14" height="4" fill="currentColor" opacity=".5"/></svg>',
    pageno: '<svg viewBox="0 0 20 20" class="ofi"><rect x="4" y="3" width="12" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="7" y="14" font-size="7" fill="currentColor" font-family="system-ui">#</text></svg>',
    portrait: '<svg viewBox="0 0 20 20" class="ofi"><rect x="6" y="3" width="8" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    landscape: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="6" width="14" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    spell: '<svg viewBox="0 0 20 20" class="ofi"><text x="2" y="14" font-size="10" font-weight="700" font-family="Georgia">ab</text><path d="M13 14l2 2 3-4" fill="none" stroke="#1f7a3d" stroke-width="1.6"/></svg>',
    zoom: '<svg viewBox="0 0 20 20" class="ofi"><circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13 13l4 4" stroke="currentColor" stroke-width="1.6"/></svg>',
    sum: '<svg viewBox="0 0 20 20" class="ofi"><path d="M5 4h9l-5 6 5 6H5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    border: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="3" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 10h14M10 3v14" stroke="currentColor" stroke-width=".8"/></svg>',
    fill: '<svg viewBox="0 0 20 20" class="ofi"><path d="M6 3l8 8-5 5-6-6z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M16 13c1 2 1 3 0 3s-1-1 0-3z" fill="currentColor"/></svg>',
    insrow: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="5" width="14" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="1.4"/></svg>',
    delrow: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="5" width="14" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M7 10h6" stroke="currentColor" stroke-width="1.4"/></svg>',
    inscol: '<svg viewBox="0 0 20 20" class="ofi"><rect x="5" y="3" width="10" height="14" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="1.4"/></svg>',
    delcol: '<svg viewBox="0 0 20 20" class="ofi"><rect x="5" y="3" width="10" height="14" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M7 10h6" stroke="currentColor" stroke-width="1.4"/></svg>',
    filldown: '<svg viewBox="0 0 20 20" class="ofi"><rect x="4" y="3" width="12" height="4" rx="1" fill="currentColor" opacity=".55"/><path d="M10 8v7m0 0-3-3m3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fillright: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="4" width="4" height="12" rx="1" fill="currentColor" opacity=".55"/><path d="M8 10h7m0 0-3-3m3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fillseries: '<svg viewBox="0 0 20 20" class="ofi"><g fill="currentColor" font-size="6" font-family="system-ui"><text x="3" y="8">1</text><text x="9" y="8">2</text><text x="15" y="8">3</text></g><path d="M3 12h14m0 0-3-2m3 2-3 2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    painter: '<svg viewBox="0 0 20 20" class="ofi"><rect x="4" y="3" width="10" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M14 5h2v3h-6v3" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="11" width="4" height="6" rx="1" fill="currentColor"/></svg>',
    growfont: '<svg viewBox="0 0 20 20" class="ofi"><text x="1" y="15" font-size="12" font-weight="700" font-family="Georgia">A</text><path d="M14 11V5m0 0-2 2m2-2 2 2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shrinkfont: '<svg viewBox="0 0 20 20" class="ofi"><text x="2" y="15" font-size="9" font-weight="700" font-family="Georgia">A</text><path d="M14 5v6m0 0-2-2m2 2 2-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    strike: '<svg viewBox="0 0 20 20" class="ofi"><text x="4" y="14" font-size="12" font-family="Georgia">S</text><path d="M3 10h14" stroke="currentColor" stroke-width="1.6"/></svg>',
    subscript: '<svg viewBox="0 0 20 20" class="ofi"><text x="1" y="13" font-size="11" font-family="Georgia">x</text><text x="10" y="17" font-size="7" font-family="Georgia">2</text></svg>',
    superscript: '<svg viewBox="0 0 20 20" class="ofi"><text x="1" y="15" font-size="11" font-family="Georgia">x</text><text x="10" y="8" font-size="7" font-family="Georgia">2</text></svg>',
    highlight: '<svg viewBox="0 0 20 20" class="ofi"><path d="M5 15l2-2 5-5 3 3-5 5-2 2H4z" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="17" width="12" height="1.6" fill="#f0c419"/></svg>',
    clearfmt: '<svg viewBox="0 0 20 20" class="ofi"><text x="2" y="13" font-size="10" font-weight="700" font-family="Georgia">A</text><path d="M10 15l6-6M16 15l-6-6" stroke="currentColor" stroke-width="1.2"/></svg>',
    outdent: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.4"><path d="M3 5h14M9 9h8M9 15h8M3 19h14"/></g><path d="M6 9 3 12l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    indent: '<svg viewBox="0 0 20 20" class="ofi"><g stroke="currentColor" stroke-width="1.4"><path d="M3 5h14M9 9h8M9 15h8M3 19h14"/></g><path d="M3 9l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shading: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="3" width="14" height="14" rx="1" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="1.2"/></svg>',
    chart: '<svg viewBox="0 0 20 20" class="ofi"><g fill="currentColor"><rect x="3" y="11" width="3" height="6"/><rect x="8.5" y="7" width="3" height="10"/><rect x="14" y="4" width="3" height="13"/></g></svg>',
    link: '<svg viewBox="0 0 20 20" class="ofi"><path d="M8 12a3 3 0 0 1 0-4l2-2a3 3 0 0 1 4 4l-1 1M12 8a3 3 0 0 1 0 4l-2 2a3 3 0 0 1-4-4l1-1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    comment: '<svg viewBox="0 0 20 20" class="ofi"><path d="M4 4h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8l-3 3v-3H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    aligntop: '<svg viewBox="0 0 20 20" class="ofi"><path d="M3 4h14" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.3"><path d="M7 7v9M13 7v6"/></g></svg>',
    alignmid: '<svg viewBox="0 0 20 20" class="ofi"><path d="M3 10h14" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.3"><path d="M7 5v10M13 7v6"/></g></svg>',
    alignbot: '<svg viewBox="0 0 20 20" class="ofi"><path d="M3 16h14" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.3"><path d="M7 4v9M13 7v6"/></g></svg>',
    wrap: '<svg viewBox="0 0 20 20" class="ofi"><path d="M3 5h14M3 10h10a3 3 0 0 1 0 6h-3m0 0 2-2m-2 2 2 2M3 15h4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    merge: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="5" width="14" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 5v3M10 12v3M7 10h6" stroke="currentColor" stroke-width="1"/></svg>',
    incdec: '<svg viewBox="0 0 20 20" class="ofi"><text x="1" y="15" font-size="7" font-family="system-ui">.00</text><path d="M13 9l2.5-3 2.5 3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    decdec: '<svg viewBox="0 0 20 20" class="ofi"><text x="1" y="15" font-size="7" font-family="system-ui">.0</text><path d="M13 7l2.5 3 2.5-3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sortaz: '<svg viewBox="0 0 20 20" class="ofi"><path d="M5 4v12m0 0-2-2m2 2 2-2" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="9" y="9" font-size="6" fill="currentColor" font-family="system-ui">A</text><text x="9" y="16" font-size="6" fill="currentColor" font-family="system-ui">Z</text></svg>',
    sortza: '<svg viewBox="0 0 20 20" class="ofi"><path d="M5 4v12m0 0-2-2m2 2 2-2" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="9" y="9" font-size="6" fill="currentColor" font-family="system-ui">Z</text><text x="9" y="16" font-size="6" fill="currentColor" font-family="system-ui">A</text></svg>',
    filter: '<svg viewBox="0 0 20 20" class="ofi"><path d="M3 4h14l-5 6v5l-4 2v-7z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    newslide: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="5" width="11" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M15 12v5M12.5 14.5h5" stroke="currentColor" stroke-width="1.4"/></svg>',
    dupslide: '<svg viewBox="0 0 20 20" class="ofi"><rect x="3" y="4" width="9" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="9" width="9" height="7" rx="1" fill="#fff" stroke="currentColor" stroke-width="1.2"/></svg>',
    delslide: '<svg viewBox="0 0 20 20" class="ofi"><rect x="4" y="5" width="12" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M7 8l6 6M13 8l-6 6" stroke="currentColor" stroke-width="1.2"/></svg>',
    play: '<svg viewBox="0 0 20 20" class="ofi"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>',
    imgph: '<svg viewBox="0 0 120 70" preserveAspectRatio="none"><rect width="120" height="70" fill="#eef1f5" stroke="#c7ced6"/><circle cx="34" cy="28" r="9" fill="#c7ced6"/><path d="M12 60l26-24 18 16 20-20 32 28z" fill="#c7ced6"/></svg>'
  };

  D.sims.word  = { create: function (m, s) { return officeInstance(m, s, 'word'); } };
  D.sims.excel = { create: function (m, s) { return officeInstance(m, s, 'excel'); } };
  D.sims.ppt   = { create: function (m, s) { return officeInstance(m, s, 'ppt'); } };

  D.makeSheet = makeSheet; /* exposed for any future tooling */
  D.sheetOps = {           /* pure spreadsheet edits, exposed for tooling/tests */
    shiftFormula: shiftFormula, fillRange: fillRange,
    insertRowAt: insertRowAt, deleteRowAt: deleteRowAt,
    insertColAt: insertColAt, deleteColAt: deleteColAt
  };

})(window.DIGILIT);
