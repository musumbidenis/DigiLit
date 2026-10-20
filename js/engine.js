/* DigiLit — app shell and assessment runner. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear;

  var App = D.app = {
    view: 'home',
    moduleId: null,
    session: null,
    learner: D.store.get('learner', { name: '', admno: '', classGroup: '' })
  };

  function root() { return document.getElementById('app'); }

  /* ---------------- speech (offline, built into the browser) ---------------- */
  function speak(text) {
    try {
      if (!window.speechSynthesis) return false;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  function stopSpeech() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }

  /* ---------------- shell ---------------- */
  function header() {
    var h = el('header', { class: 'app-head' }, [
      el('button', {
        class: 'brand', type: 'button', onclick: function () { App.go('home'); },
        html: '<span class="brand-mark" aria-hidden="true"></span><span class="brand-text"><b>' +
          D.esc(D.config.productName) + '</b><em>Digital Literacy Assessments</em></span>'
      }),
      el('div', { class: 'head-right' }, [
        el('span', { class: 'head-org', text: D.config.institution + ' · ' + D.config.department }),
        el('span', { class: 'offline-pill', title: 'This app needs no internet connection', text: 'Offline' })
      ])
    ]);
    return h;
  }

  App.go = function (view, opts) {
    stopSpeech();
    if (App.session && App.session.inst) { App.session.inst.destroy(); App.session.inst = null; }
    App.view = view;
    opts = opts || {};
    if (opts.moduleId !== undefined) App.moduleId = opts.moduleId;
    App.render();
    window.scrollTo(0, 0);
  };

  App.render = function () {
    var r = root();
    clear(r);
    r.appendChild(header());
    var main = el('main', { class: 'app-main' });
    r.appendChild(main);
    if (App.view === 'home') renderHome(main);
    else if (App.view === 'intro') renderIntro(main);
    else if (App.view === 'run') renderRun(main);
    else if (App.view === 'results') D.renderResults(main, App.session);
    else if (App.view === 'certificate') D.renderCertificate(main, App.session);
    else if (App.view === 'records') D.renderRecords(main);
    r.appendChild(el('footer', { class: 'app-foot' }, [
      el('span', { text: D.config.productName + ' — an original system built for ' + D.config.institution +
        '. The task content is original. The simulators are faithful recreations of the real interfaces, drawn for training; no third-party assessment items or logo artwork are bundled.' })
    ]));
  };

  /* ---------------- home ---------------- */
  function renderHome(main) {
    var done = D.store.get('attempts', []);

    var idCard = el('section', { class: 'card learner-card' }, [
      el('h2', { text: 'Who is sitting?' }),
      el('p', { class: 'muted', text: 'Used on the results sheet and the certificate. Nothing leaves this computer.' }),
      el('div', { class: 'learner-fields' }, [
        textField('Full name', 'name'),
        textField('Admission no.', 'admno'),
        textField('Class', 'classGroup')
      ])
    ]);

    function textField(label, key) {
      var inp = el('input', { class: 'dl-input', type: 'text', value: App.learner[key] || '', 'aria-label': label });
      inp.addEventListener('input', function () {
        App.learner[key] = inp.value;
        D.store.set('learner', App.learner);
      });
      return el('label', { class: 'dl-field' }, [el('span', { text: label }), inp]);
    }

    main.appendChild(el('div', { class: 'hero' }, [
      el('h1', { text: 'Show what you can actually do.' }),
      el('p', { text: 'Performance-based assessment for the CDACC unit Apply Digital Literacy — its seven learning outcomes, from operating the machine to performing online jobs. You work inside a simulated computer, browser, mailbox or Office app, not a quiz about them. ' +
        Math.round(D.config.passMark * 100) + '% earns the module. There is no penalty for failing, and you can retake any module.' })
    ]));
    main.appendChild(idCard);

    if (done.length) {
      main.appendChild(el('div', { class: 'row-between' }, [
        el('h2', { class: 'sec-title', text: 'Your record on this computer' }),
        el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Open record sheet',
          onclick: function () { App.go('records'); } })
      ]));
    }

    D.categories.forEach(function (cat) {
      var mods = D.modules.filter(function (m) { return m.category === cat.id; });
      main.appendChild(el('section', { class: 'cat' }, [
        el('h2', { class: 'sec-title', text: cat.name }),
        el('p', { class: 'muted', text: cat.blurb }),
        el('div', { class: 'mod-grid' }, mods.map(function (m) { return moduleCard(m, done); }))
      ]));
    });
  }

  function moduleCard(m, attempts) {
    var ready = m.items.length > 0;
    var best = attempts.filter(function (a) { return a.moduleId === m.id; })
      .reduce(function (acc, a) { return Math.max(acc, a.score); }, -1);
    var card = el('button', {
      class: 'mod-card' + (ready ? '' : ' is-empty') + (best >= D.config.passMark ? ' is-passed' : ''),
      type: 'button', disabled: !ready,
      onclick: function () { App.go('intro', { moduleId: m.id }); }
    }, [
      el('div', { class: 'mod-top' }, [
        el('h3', { text: m.name }),
        best >= 0 ? el('span', { class: 'mod-score' + (best >= D.config.passMark ? ' is-pass' : ''),
          text: Math.round(best * 100) + '%' }) : null
      ]),
      el('p', { class: 'mod-blurb', text: m.blurb }),
      el('div', { class: 'mod-meta' }, [
        el('span', { text: m.standards.length + ' standards' }),
        el('span', { text: ready ? m.items.length + ' tasks' : 'Tasks not yet authored' }),
        m.mirrors ? null : el('span', { class: 'tag-rvnp', text: 'Beyond the unit' })
      ])
    ]);
    return card;
  }

  /* ---------------- module intro ---------------- */
  function renderIntro(main) {
    var m = D.modulesById[App.moduleId];
    if (!m) return App.go('home');
    main.appendChild(el('button', { class: 'backlink', type: 'button', text: '‹ All modules',
      onclick: function () { App.go('home'); } }));
    main.appendChild(el('div', { class: 'hero hero-sm' }, [
      el('h1', { text: m.name }),
      el('p', { text: m.blurb })
    ]));
    main.appendChild(el('section', { class: 'card' }, [
      el('h2', { text: 'What this module checks' }),
      el('ol', { class: 'std-list' }, m.standards.map(function (s) {
        var n = m.items.filter(function (it) { return it.skills.indexOf(s.id) !== -1; }).length;
        return el('li', { class: n ? '' : 'is-unassessed' }, [
          el('span', { text: s.text }),
          el('em', { text: n ? n + (n === 1 ? ' task' : ' tasks') : 'no task yet' })
        ]);
      }))
    ]));
    main.appendChild(el('div', { class: 'start-row' }, [
      el('div', [
        el('p', { class: 'muted', text: m.items.length + ' tasks · pass mark ' + Math.round(D.config.passMark * 100) + '% · no time limit' })
      ]),
      el('button', { class: 'dl-btn dl-btn-primary dl-btn-lg', type: 'button', text: 'Start assessment',
        onclick: function () { startSession(m); } })
    ]));
  }

  /* ---------------- session ---------------- */
  function startSession(m) {
    App.session = {
      moduleId: m.id,
      module: m,
      items: m.items.slice(),
      idx: 0,
      answers: {},
      correct: {},
      inst: null,
      startedAt: new Date(),
      learner: Object.assign({}, App.learner)
    };
    App.go('run');
  }

  function finalizeCurrent() {
    var s = App.session;
    if (!s) return;
    var item = s.items[s.idx];
    if (!item) return;
    var type = D.itemTypes[item.type];
    if (!type) return;
    var ans = s.answers[item.id];
    s.correct[item.id] = !!type.grade(item, ans, s.inst);
    if (s.inst) {
      /* keep a snapshot of what the simulator ended up looking like */
      s.answers[item.id] = { sim: true, events: (s.inst.state.events || []).length };
      s.inst.destroy();
      s.inst = null;
    }
  }

  function renderRun(main) {
    var s = App.session;
    if (!s) return App.go('home');
    var item = s.items[s.idx];
    var type = D.itemTypes[item.type];
    var n = s.items.length;

    var api = {
      setAnswer: function (v) { s.answers[item.id] = v; },
      getAnswer: function () { return s.answers[item.id]; },
      attach: function (inst) { s.inst = inst; }
    };

    /* One dot per task so a learner can see at a glance what is answered,
       what was skipped, and jump straight to any of them. */
    var dots = el('div', { class: 'qdots', role: 'list', 'aria-label': 'All tasks in this assessment' },
      s.items.map(function (it, i) {
        var answered = s.answers[it.id] != null;
        var state = i === s.idx ? 'is-current'
          : answered ? 'is-done'
          : i < s.idx ? 'is-skip' : '';
        var label = 'Task ' + (i + 1) + (i === s.idx ? ' (current)'
          : answered ? ' — answered' : i < s.idx ? ' — skipped' : '');
        return el('button', {
          class: 'qdot ' + state, type: 'button', role: 'listitem',
          title: label, 'aria-label': label, 'aria-current': i === s.idx ? 'true' : null,
          onclick: function () { if (i !== s.idx) { finalizeCurrent(); s.idx = i; App.go('run'); } }
        });
      }));

    main.appendChild(el('div', { class: 'run-top' }, [
      el('div', { class: 'run-meta' }, [
        el('span', { class: 'run-mod', text: s.module.name }),
        el('span', { class: 'run-count', text: 'Task ' + (s.idx + 1) + ' of ' + n })
      ]),
      el('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(s.idx + 1),
        'aria-valuemin': '1', 'aria-valuemax': String(n) }, [
        el('span', { class: 'progress-fill', style: { width: (((s.idx + 1) / n) * 100) + '%' } })
      ]),
      dots
    ]));

    var promptRow = el('div', { class: 'prompt-row' }, [
      el('p', { class: 'prompt', text: item.prompt }),
      el('button', {
        class: 'dl-btn dl-btn-ghost speak-btn', type: 'button', title: 'Read the task aloud',
        text: '🔊 Read aloud',
        onclick: function () { if (!speak(item.prompt)) alert('Read-aloud is not available in this browser.'); }
      })
    ]);
    main.appendChild(promptRow);
    if (item.note) main.appendChild(el('p', { class: 'item-note', text: item.note }));

    var body = el('div', { class: 'item-body item-' + item.type });
    main.appendChild(body);
    type.render(body, item, api);

    var navRow = el('div', { class: 'run-nav' }, [
      el('button', {
        class: 'dl-btn dl-btn-ghost', type: 'button', text: '‹ Previous', disabled: s.idx === 0,
        onclick: function () { finalizeCurrent(); s.idx--; App.go('run'); }
      }),
      s.idx === n - 1 ? null : el('button', {
        class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Skip',
        onclick: function () { finalizeCurrent(); advance(); }
      }),
      el('button', {
        class: 'dl-btn dl-btn-primary', type: 'button',
        text: s.idx === n - 1 ? 'Finish and see results' : 'Next ›',
        onclick: function () { finalizeCurrent(); advance(); }
      })
    ]);
    main.appendChild(navRow);
    main.appendChild(el('button', { class: 'quitlink', type: 'button', text: 'Abandon this attempt',
      onclick: function () {
        if (confirm('Abandon this attempt? Nothing will be recorded.')) { App.session = null; App.go('home'); }
      } }));

    if (item.type === 'sim') {
      main.appendChild(el('p', { class: 'sim-footnote', text:
        'Do the task in the window above using whichever route you prefer — toolbar, right-click menu or keyboard. Only the result is marked.' }));
    }
  }

  function advance() {
    var s = App.session;
    if (s.idx < s.items.length - 1) { s.idx++; App.go('run'); }
    else {
      /* Review gate: don't let a learner finish while tasks sit unanswered
         without being told — those would be marked wrong. */
      var un = s.items.filter(function (it) { return s.answers[it.id] == null; });
      if (un.length) {
        var msg = un.length + (un.length === 1 ? ' task has' : ' tasks have') +
          ' no answer recorded and would be marked wrong.\n\n' +
          'Click Cancel to go back and finish them, or OK to submit as is.';
        if (!confirm(msg)) { s.idx = s.items.indexOf(un[0]); App.go('run'); return; }
      }
      D.finishSession(s); App.go('results');
    }
  }

  D.speak = speak;
  D.stopSpeech = stopSpeech;

  window.addEventListener('DOMContentLoaded', function () {
    var missing = D.modules.filter(function (m) { return !m.items.length; }).length;
    if (missing) console.info('DigiLit: ' + missing + ' of ' + D.modules.length + ' modules have no items yet.');
    App.render();
  });

})(window.DIGILIT);
