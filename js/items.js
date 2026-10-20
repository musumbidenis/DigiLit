/* DigiLit — item types.
   Each type renders into a mount and grades itself. Grading is by outcome, so
   several routes to the same result all count. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear;

  D.itemTypes = {};

  /* ---------------- single choice ---------------- */
  D.itemTypes.choice = {
    render: function (mount, item, api) {
      var name = 'ch-' + item.id;
      var order = item.keepOrder ? item.options.map(function (_, i) { return i; })
        : D.shuffle(item.options.map(function (_, i) { return i; }));
      mount.appendChild(el('div', { class: 'opt-list' }, order.map(function (idx) {
        var id = name + '-' + idx;
        var input = el('input', { type: 'radio', name: name, id: id, value: String(idx) });
        input.addEventListener('change', function () { api.setAnswer(idx); });
        if (api.getAnswer() === idx) input.checked = true;
        return el('label', { class: 'opt', for: id }, [input, el('span', { text: item.options[idx] })]);
      })));
    },
    grade: function (item, answer) { return answer === item.answer; }
  };

  /* ---------------- multiple response ---------------- */
  D.itemTypes.multi = {
    render: function (mount, item, api) {
      var picked = api.getAnswer() || [];
      var order = item.keepOrder ? item.options.map(function (_, i) { return i; })
        : D.shuffle(item.options.map(function (_, i) { return i; }));
      mount.appendChild(el('p', { class: 'item-hint', text: 'Select all that apply.' }));
      mount.appendChild(el('div', { class: 'opt-list' }, order.map(function (idx) {
        var id = 'mu-' + item.id + '-' + idx;
        var input = el('input', { type: 'checkbox', id: id });
        if (picked.indexOf(idx) !== -1) input.checked = true;
        input.addEventListener('change', function () {
          var cur = (api.getAnswer() || []).slice();
          var at = cur.indexOf(idx);
          if (input.checked && at === -1) cur.push(idx);
          if (!input.checked && at !== -1) cur.splice(at, 1);
          api.setAnswer(cur);
        });
        return el('label', { class: 'opt', for: id }, [input, el('span', { text: item.options[idx] })]);
      })));
    },
    grade: function (item, answer) {
      var a = (answer || []).slice().sort(), b = (item.answer || []).slice().sort();
      return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
    }
  };

  /* ---------------- type a short answer ---------------- */
  D.itemTypes.typein = {
    render: function (mount, item, api) {
      var inp = el('input', { class: 'dl-input dl-input-lg', type: 'text',
        placeholder: item.placeholder || 'Type your answer', value: api.getAnswer() || '',
        'aria-label': 'Your answer', spellcheck: 'false' });
      inp.addEventListener('input', function () { api.setAnswer(inp.value); });
      mount.appendChild(inp);
    },
    grade: function (item, answer) {
      var v = D.norm(answer);
      if (!v) return false;
      if (item.pattern) return new RegExp(item.pattern, 'i').test(String(answer).trim());
      return (item.accept || []).some(function (a) { return D.norm(a) === v; });
    }
  };

  /* ---------------- put steps in order ---------------- */
  D.itemTypes.order = {
    render: function (mount, item, api) {
      var current = api.getAnswer();
      if (!current) {
        current = D.shuffle(item.steps.map(function (_, i) { return i; }));
        /* never hand them the finished sequence */
        if (current.every(function (v, i) { return v === item.answer[i]; }) && current.length > 1) {
          current.push(current.shift());
        }
        api.setAnswer(current);
      }
      var list = el('ol', { class: 'ord-list' });
      function draw() {
        clear(list);
        api.getAnswer().forEach(function (stepIdx, pos) {
          var row = el('li', { class: 'ord-row' }, [
            el('span', { class: 'ord-num', text: String(pos + 1) }),
            el('span', { class: 'ord-text', text: item.steps[stepIdx] }),
            el('span', { class: 'ord-btns' }, [
              el('button', { class: 'ord-btn', type: 'button', 'aria-label': 'Move up', text: '▲', disabled: pos === 0,
                onclick: function () {
                  var a = api.getAnswer().slice();
                  var t = a[pos - 1]; a[pos - 1] = a[pos]; a[pos] = t;
                  api.setAnswer(a); draw();
                } }),
              el('button', { class: 'ord-btn', type: 'button', 'aria-label': 'Move down', text: '▼',
                disabled: pos === api.getAnswer().length - 1,
                onclick: function () {
                  var a = api.getAnswer().slice();
                  var t = a[pos + 1]; a[pos + 1] = a[pos]; a[pos] = t;
                  api.setAnswer(a); draw();
                } })
            ])
          ]);
          list.appendChild(row);
        });
      }
      draw();
      mount.appendChild(el('p', { class: 'item-hint', text: 'Put the steps in the correct order, first at the top.' }));
      mount.appendChild(list);
    },
    grade: function (item, answer) {
      if (!answer || answer.length !== item.answer.length) return false;
      return answer.every(function (v, i) { return v === item.answer[i]; });
    }
  };

  /* ---------------- match pairs ---------------- */
  D.itemTypes.match = {
    render: function (mount, item, api) {
      var picked = api.getAnswer() || {};
      var rightOrder = D.shuffle(item.right.map(function (_, i) { return i; }));
      mount.appendChild(el('p', { class: 'item-hint', text: 'Choose the matching item for each row.' }));
      mount.appendChild(el('div', { class: 'match-list' }, item.left.map(function (l, li) {
        var sel = el('select', { class: 'dl-select', 'aria-label': 'Match for ' + l }, [
          el('option', { value: '', text: '— choose —' })
        ].concat(rightOrder.map(function (ri) {
          return el('option', { value: String(ri), text: item.right[ri] });
        })));
        if (picked[li] !== undefined) sel.value = String(picked[li]);
        sel.addEventListener('change', function () {
          var cur = Object.assign({}, api.getAnswer() || {});
          if (sel.value === '') delete cur[li]; else cur[li] = parseInt(sel.value, 10);
          api.setAnswer(cur);
        });
        return el('div', { class: 'match-row' }, [el('span', { class: 'match-left', text: l }), sel]);
      })));
    },
    grade: function (item, answer) {
      answer = answer || {};
      return item.left.every(function (_, li) { return answer[li] === item.answer[li]; });
    }
  };

  /* ---------------- click the right part of a picture ---------------- */
  D.itemTypes.hotspot = {
    render: function (mount, item, api) {
      var sc = item.scene;
      var wrap = el('div', { class: 'hot-wrap' });
      var svgHtml = '<svg viewBox="' + (sc.viewBox || '0 0 600 320') + '" class="hot-svg" role="img" aria-label="' +
        D.esc(sc.alt || 'Diagram') + '">' + sc.svg +
        sc.targets.map(function (t) {
          return '<rect class="hot-target" data-target="' + D.esc(t.id) + '" x="' + t.x + '" y="' + t.y +
            '" width="' + t.w + '" height="' + t.h + '" rx="' + (t.rx || 4) + '"><title>' +
            D.esc(t.label || t.id) + '</title></rect>';
        }).join('') + '</svg>';
      wrap.innerHTML = svgHtml;
      var svg = wrap.querySelector('svg');
      function paint() {
        svg.querySelectorAll('.hot-target').forEach(function (r) {
          r.classList.toggle('is-picked', r.dataset.target === api.getAnswer());
        });
      }
      svg.querySelectorAll('.hot-target').forEach(function (r) {
        r.addEventListener('click', function () { api.setAnswer(r.dataset.target); paint(); });
        r.setAttribute('tabindex', '0');
        r.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.setAnswer(r.dataset.target); paint(); }
        });
      });
      paint();
      mount.appendChild(el('p', { class: 'item-hint', text: 'Click the correct part of the picture.' }));
      mount.appendChild(wrap);
    },
    grade: function (item, answer) {
      if (Array.isArray(item.answer)) return item.answer.indexOf(answer) !== -1;
      return answer === item.answer;
    }
  };

  /* ---------------- simulation ---------------- */
  D.itemTypes.sim = {
    render: function (mount, item, api) {
      var factory = D.sims[item.env];
      if (!factory) {
        mount.appendChild(el('p', { class: 'sim-empty', text: 'Simulator "' + item.env + '" is not loaded.' }));
        return;
      }
      var host = el('div', { class: 'sim-host sim-host-' + item.env });
      mount.appendChild(host);
      var setup = typeof item.setup === 'function' ? item.setup() : (item.setup || {});
      var inst = factory.create(host, setup);
      api.attach(inst);
      api.setAnswer('sim');
    },
    grade: function (item, answer, inst) {
      if (!inst) return false;
      try { return !!item.check(inst.state, inst); }
      catch (e) { console.error('Validator threw for ' + item.id, e); return false; }
    }
  };

})(window.DIGILIT);
