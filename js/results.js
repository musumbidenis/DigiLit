/* DigiLit — scoring, per-skill results, certificate, and file export.
   Lab-local: results are written out as files you collect, not synced. */
(function (D) {
  'use strict';

  var el = D.el;

  /* ---------------- scoring ---------------- */

  D.scoreSession = function (s) {
    var items = s.items, correct = s.correct || {};
    var got = items.filter(function (it) { return correct[it.id]; }).length;
    var score = items.length ? got / items.length : 0;

    var skills = s.module.standards.map(function (std) {
      var mine = items.filter(function (it) { return it.skills.indexOf(std.id) !== -1; });
      var ok = mine.filter(function (it) { return correct[it.id]; }).length;
      return {
        id: std.id, text: std.text,
        total: mine.length, correct: ok,
        state: !mine.length ? 'not-assessed' : (ok === mine.length ? 'mastered' : 'practice')
      };
    });

    return {
      moduleId: s.moduleId, moduleName: s.module.name,
      items: items.length, got: got, score: score,
      passed: score >= D.config.passMark,
      skills: skills
    };
  };

  D.finishSession = function (s) {
    s.finishedAt = new Date();
    s.result = D.scoreSession(s);
    var attempts = D.store.get('attempts', []);
    attempts.push({
      moduleId: s.moduleId, moduleName: s.module.name,
      score: s.result.score, passed: s.result.passed,
      items: s.result.items, got: s.result.got,
      learner: s.learner,
      at: D.timeStamp(s.finishedAt),
      minutes: Math.max(1, Math.round((s.finishedAt - s.startedAt) / 60000))
    });
    D.store.set('attempts', attempts);
    return s.result;
  };

  /* ---------------- file export ---------------- */

  function slug(v) {
    return String(v || '').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'unknown';
  }

  function download(filename, text, mime) {
    try {
      var blob = new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
      return true;
    } catch (e) {
      /* Some locked-down lab browsers block blob downloads from file://.
         Fall back to a window the invigilator can save or print. */
      var w = window.open('', '_blank');
      if (!w) { alert('This browser blocked the download. Use "Print results" instead.'); return false; }
      w.document.write('<pre>' + D.esc(text) + '</pre>');
      w.document.title = filename;
      return true;
    }
  }
  D.download = download;

  /* ---------------- offline collection: OS share sheet + QR ----------------
     No LAN needed. shareOrDownload hands the file to the device's native share
     sheet (Bluetooth, Nearby Share, AirDrop, …) where the browser supports it,
     and falls back to a plain download. The QR codes let a trainer walk the lab
     and scan each result with a phone — no cables, no stick. */

  function shareOrDownload(filename, text, mime, label) {
    try {
      if (navigator.share && window.File) {
        var file = new File([text], filename, { type: mime || 'text/plain' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'DigiLit results', text: label || filename })
            .catch(function (e) { if (e && e.name !== 'AbortError') download(filename, text, mime); });
          return;
        }
      }
    } catch (e) {}
    download(filename, text, mime);   /* browser has no file share — save instead */
  }
  D.shareOrDownload = shareOrDownload;

  function qrSvg(text) {
    if (typeof qrcode === 'undefined') return null;
    try {
      var qr = qrcode(0, 'M');          /* auto-size, medium error correction */
      qr.addData(String(text));
      qr.make();
      return qr.createSvgTag({ cellSize: 5, margin: 12, scalable: true });
    } catch (e) { return null; }        /* payload too big for one code */
  }

  /* pages: [{ text, caption }] — one scannable code each. */
  function openQrModal(title, intro, pages) {
    if (typeof qrcode === 'undefined') { alert('The QR generator did not load. Use Export CSV or Share instead.'); return; }
    if (!pages.length) { alert('Nothing to show yet.'); return; }
    var idx = 0;
    var overlay = el('div', { class: 'qr-overlay', onclick: function (e) { if (e.target === overlay) close(); } });
    var card = el('div', { class: 'qr-card' });
    overlay.appendChild(card);
    function close() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); }
    function go(d) { idx = Math.max(0, Math.min(pages.length - 1, idx + d)); draw(); }
    function draw() {
      D.clear(card);
      card.appendChild(el('button', { class: 'qr-close', type: 'button', text: '✕', 'aria-label': 'Close', onclick: close }));
      card.appendChild(el('h3', { class: 'qr-title', text: title }));
      if (intro) card.appendChild(el('p', { class: 'qr-intro', text: intro }));
      var p = pages[idx];
      var svg = qrSvg(p.text);
      var box = el('div', { class: 'qr-code' });
      if (svg) box.innerHTML = svg; else box.appendChild(el('p', { class: 'muted', text: 'This record is too long for one code — use Export or Share instead.' }));
      card.appendChild(box);
      card.appendChild(el('p', { class: 'qr-caption', text: p.caption || '' }));
      if (pages.length > 1) {
        card.appendChild(el('div', { class: 'qr-nav' }, [
          el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: '‹ Prev', disabled: idx === 0, onclick: function () { go(-1); } }),
          el('span', { class: 'qr-count', text: (idx + 1) + ' of ' + pages.length }),
          el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Next ›', disabled: idx === pages.length - 1, onclick: function () { go(1); } })
        ]));
      }
    }
    draw();
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  }

  /* compact single-line record for a QR (same column order as the CSV). */
  function recLine(name, admno, cls, module, pct, passed, when) {
    return csvRow([name, admno, cls, module, pct + '%', passed ? 'PASS' : 'Not yet', when]);
  }
  var QR_FIELDS = 'Fields in order: name, admission no, class, module, score, result, completed.';

  function resultFilename(s, ext) {
    return ['digilit', slug(s.learner.classGroup), slug(s.learner.admno || s.learner.name),
      slug(s.moduleId), D.stamp(s.finishedAt || new Date())].join('_') + '.' + ext;
  }

  function resultPayload(s) {
    return {
      app: 'DigiLit', version: 1,
      institution: D.config.institution, department: D.config.department,
      learner: s.learner,
      module: { id: s.moduleId, name: s.module.name },
      startedAt: D.timeStamp(s.startedAt), finishedAt: D.timeStamp(s.finishedAt),
      passMark: D.config.passMark,
      score: s.result.score, percent: Math.round(s.result.score * 100),
      passed: s.result.passed, itemsCorrect: s.result.got, itemsTotal: s.result.items,
      skills: s.result.skills.map(function (sk) {
        return { id: sk.id, text: sk.text, state: sk.state, correct: sk.correct, total: sk.total };
      }),
      items: s.items.map(function (it) {
        return { id: it.id, type: it.type, skills: it.skills, correct: !!s.correct[it.id] };
      })
    };
  }

  function csvRow(vals) {
    return vals.map(function (v) {
      v = String(v == null ? '' : v);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(',');
  }

  D.attemptsCsv = function (attempts) {
    var rows = [csvRow(['Name', 'Admission no', 'Class', 'Module', 'Score %', 'Result', 'Correct', 'Total', 'Minutes', 'Completed'])];
    attempts.forEach(function (a) {
      rows.push(csvRow([a.learner.name, a.learner.admno, a.learner.classGroup, a.moduleName,
        Math.round(a.score * 100), a.passed ? 'PASS' : 'Not yet', a.got, a.items, a.minutes, a.at]));
    });
    return rows.join('\n');
  };

  /* ---------------- results view ---------------- */

  D.renderResults = function (main, s) {
    if (!s || !s.result) return D.app.go('home');
    var r = s.result, pct = Math.round(r.score * 100);

    main.appendChild(el('div', { class: 'result-head ' + (r.passed ? 'is-pass' : 'is-work') }, [
      el('div', { class: 'result-dial' }, [
        el('span', { class: 'result-pct', text: pct + '%' }),
        el('span', { class: 'result-of', text: r.got + ' of ' + r.items + ' tasks' })
      ]),
      el('div', [
        el('h1', { text: r.passed ? 'Module passed' : 'Not passed yet' }),
        el('p', { text: r.passed
          ? s.module.name + ' is complete. You met the ' + Math.round(D.config.passMark * 100) + '% standard.'
          : 'You need ' + Math.round(D.config.passMark * 100) + '% to pass ' + s.module.name +
            '. Nothing is lost — work on the skills below and sit it again.' }),
        el('p', { class: 'muted', text: (s.learner.name || 'Unnamed trainee') +
          (s.learner.admno ? ' · ' + s.learner.admno : '') + ' · ' + D.timeStamp(s.finishedAt) })
      ])
    ]));

    var mastered = r.skills.filter(function (k) { return k.state === 'mastered'; });
    var practice = r.skills.filter(function (k) { return k.state === 'practice'; });
    var untested = r.skills.filter(function (k) { return k.state === 'not-assessed'; });

    function skillList(title, list, cls, empty) {
      return el('section', { class: 'card skills-' + cls }, [
        el('h2', [el('span', { text: title }), el('b', { text: String(list.length) })]),
        list.length
          ? el('ul', { class: 'skill-list' }, list.map(function (k) {
              return el('li', [
                el('span', { class: 'skill-dot ' + cls }),
                el('span', { text: k.text }),
                el('em', { text: k.correct + '/' + k.total })
              ]);
            }))
          : el('p', { class: 'muted', text: empty })
      ]);
    }

    main.appendChild(el('div', { class: 'skills-grid' }, [
      skillList('Mastered', mastered, 'mastered', 'Nothing mastered on this attempt.'),
      skillList('Needs practice', practice, 'practice', 'Nothing outstanding — well done.')
    ]));

    if (untested.length) {
      main.appendChild(el('details', { class: 'card muted-card' }, [
        el('summary', { text: untested.length + ' standards in this module have no task authored yet' }),
        el('ul', { class: 'skill-list' }, untested.map(function (k) { return el('li', [el('span', { text: k.text })]); }))
      ]));
    }

    main.appendChild(el('div', { class: 'action-row' }, [
      el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'Save result file',
        onclick: function () { download(resultFilename(s, 'json'), JSON.stringify(resultPayload(s), null, 2), 'application/json'); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Save as CSV row',
        onclick: function () {
          var a = { learner: s.learner, moduleName: s.module.name, score: r.score, passed: r.passed,
            got: r.got, items: r.items, minutes: 1, at: D.timeStamp(s.finishedAt) };
          download(resultFilename(s, 'csv'), D.attemptsCsv([a]), 'text/csv');
        } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Share result…',
        onclick: function () { shareOrDownload(resultFilename(s, 'json'), JSON.stringify(resultPayload(s), null, 2), 'application/json', (s.learner.name || 'Trainee') + ' — ' + s.module.name); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Show QR',
        onclick: function () {
          openQrModal('Scan this result', 'Scan with a phone to capture it. ' + QR_FIELDS,
            [{ text: recLine(s.learner.name, s.learner.admno, s.learner.classGroup, s.module.name, pct, r.passed, D.timeStamp(s.finishedAt)),
               caption: (s.learner.name || 'Unnamed') + ' · ' + s.module.name + ' · ' + pct + '%' }]);
        } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Print results sheet',
        onclick: function () { window.print(); } }),
      r.passed ? el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'View certificate',
        onclick: function () { D.app.go('certificate'); } }) : null,
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Retake this module',
        onclick: function () { D.app.go('intro', { moduleId: s.moduleId }); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'All modules',
        onclick: function () { D.app.go('home'); } })
    ]));
  };

  /* ---------------- certificate ---------------- */

  function verifyCode(str) {
    var h = 5381, i;
    for (i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36).toUpperCase().padStart(7, '0').slice(0, 7);
  }

  D.renderCertificate = function (main, s) {
    /* Only modules actually passed appear, as Northstar does. */
    var attempts = D.store.get('attempts', []);
    var who = (s && s.learner) || D.app.learner;
    var passedByModule = {};
    attempts.forEach(function (a) {
      if (!a.passed) return;
      if (D.norm(a.learner.admno || a.learner.name) !== D.norm(who.admno || who.name)) return;
      if (!passedByModule[a.moduleId] || a.score > passedByModule[a.moduleId].score) passedByModule[a.moduleId] = a;
    });
    var passed = Object.keys(passedByModule).map(function (k) { return passedByModule[k]; });

    var code = verifyCode([who.name, who.admno, passed.map(function (p) { return p.moduleId; }).join('|'), D.stamp()].join('~'));

    main.appendChild(el('button', { class: 'backlink no-print', type: 'button', text: '‹ Back',
      onclick: function () { D.app.go(s && s.result ? 'results' : 'home'); } }));

    if (!passed.length) {
      main.appendChild(el('section', { class: 'card' }, [
        el('h2', { text: 'No modules passed yet' }),
        el('p', { class: 'muted', text: 'A certificate lists only the modules you have actually passed.' })
      ]));
      return;
    }

    main.appendChild(el('section', { class: 'cert' }, [
      el('div', { class: 'cert-rule' }),
      el('p', { class: 'cert-org', text: D.config.institution }),
      el('p', { class: 'cert-dept', text: D.config.department }),
      el('h1', { class: 'cert-title', text: 'Certificate of Digital Literacy' }),
      el('p', { class: 'cert-lead', text: 'This is to certify that' }),
      el('p', { class: 'cert-name', text: who.name || '________________________' }),
      el('p', { class: 'cert-lead', text: (who.admno ? 'Admission number ' + who.admno + ' · ' : '') +
        'has demonstrated competence in the following modules, each at ' + Math.round(D.config.passMark * 100) + '% or above:' }),
      el('ul', { class: 'cert-list' }, passed.map(function (p) {
        return el('li', [el('span', { text: p.moduleName }), el('em', { text: Math.round(p.score * 100) + '%' })]);
      })),
      el('div', { class: 'cert-foot' }, [
        el('div', [el('span', { class: 'cert-sigline' }), el('span', { class: 'cert-siglabel', text: 'Head of Department' })]),
        el('div', { class: 'cert-stamp' }, [
          el('span', { text: 'Issued ' + D.stamp() }),
          el('span', { text: 'Verification ' + code })
        ])
      ]),
      el('p', { class: 'cert-note', text: 'Issued by ' + D.config.institution +
        ' on the basis of performance-based assessment. Not affiliated with any external certifying body.' })
    ]));

    main.appendChild(el('div', { class: 'action-row no-print' }, [
      el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'Print certificate',
        onclick: function () { window.print(); } })
    ]));
  };

  /* ---------------- records sheet ---------------- */

  D.renderRecords = function (main) {
    var attempts = D.store.get('attempts', []);
    main.appendChild(el('button', { class: 'backlink no-print', type: 'button', text: '‹ All modules',
      onclick: function () { D.app.go('home'); } }));
    main.appendChild(el('div', { class: 'hero hero-sm' }, [
      el('h1', { text: 'Record sheet' }),
      el('p', { text: 'Every attempt made on this computer. Export the CSV at the end of a session and collect it from the machine.' })
    ]));

    if (!attempts.length) {
      main.appendChild(el('p', { class: 'muted', text: 'No attempts recorded yet.' }));
      return;
    }

    var table = el('table', { class: 'rec-table' }, [
      el('thead', [el('tr', ['Name', 'Adm no', 'Class', 'Module', 'Score', 'Result', 'Completed'].map(function (h) {
        return el('th', { text: h });
      }))]),
      el('tbody', attempts.slice().reverse().map(function (a) {
        return el('tr', [
          el('td', { text: a.learner.name || '—' }),
          el('td', { text: a.learner.admno || '—' }),
          el('td', { text: a.learner.classGroup || '—' }),
          el('td', { text: a.moduleName }),
          el('td', { text: Math.round(a.score * 100) + '%' }),
          el('td', { class: a.passed ? 'is-pass' : '', text: a.passed ? 'PASS' : 'Not yet' }),
          el('td', { text: a.at })
        ]);
      }))
    ]);
    main.appendChild(el('div', { class: 'card' }, [table]));

    main.appendChild(el('div', { class: 'action-row no-print' }, [
      el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'Export all as CSV',
        onclick: function () { download('digilit_records_' + D.stamp() + '.csv', D.attemptsCsv(attempts), 'text/csv'); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Export all as JSON',
        onclick: function () { download('digilit_records_' + D.stamp() + '.json', JSON.stringify(attempts, null, 2), 'application/json'); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Share CSV…',
        onclick: function () { shareOrDownload('digilit_records_' + D.stamp() + '.csv', D.attemptsCsv(attempts), 'text/csv', 'DigiLit records (' + attempts.length + ')'); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Show QR codes',
        onclick: function () {
          var pages = attempts.slice().reverse().map(function (a) {
            var pct = Math.round(a.score * 100);
            return { text: recLine(a.learner.name, a.learner.admno, a.learner.classGroup, a.moduleName, pct, a.passed, a.at),
              caption: (a.learner.name || 'Unnamed') + ' · ' + a.moduleName + ' · ' + pct + '%' };
          });
          openQrModal('Scan results — ' + pages.length + ' attempt' + (pages.length === 1 ? '' : 's'),
            'One code per attempt — scan each with a phone, use ‹ › to move. ' + QR_FIELDS, pages);
        } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Print sheet',
        onclick: function () { window.print(); } }),
      el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Clear this computer',
        onclick: function () {
          if (confirm('Delete every attempt stored on this computer? Export first if you have not.')) {
            D.store.set('attempts', []); D.app.go('records');
          }
        } })
    ]));
  };

})(window.DIGILIT);
