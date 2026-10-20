/* DigiLit — email client simulator.
   A faithful recreation of a current webmail client (the shape Outlook on the
   web and Gmail share): a top app bar with global search, the full folder rail
   with unread counts, a message list with sender avatars, a reading pane with
   the real action toolbar, and a compose window docked bottom-right. Grading
   looks at the resulting mailbox state: what was sent, to whom, in which field,
   with what attached, and where messages ended up. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear, svgIcon = D.svgIcon;

  /* internal folder names (kept stable for grading) + display + icon */
  var FOLDERS = ['Inbox', 'Sent', 'Drafts', 'Archive', 'Spam', 'Trash'];
  var FOLDER_META = {
    Inbox:   { label: 'Inbox',       icon: 'inbox' },
    Sent:    { label: 'Sent Items',  icon: 'send' },
    Drafts:  { label: 'Drafts',      icon: 'draft' },
    Archive: { label: 'Archive',     icon: 'archive' },
    Spam:    { label: 'Junk Email',  icon: 'junk' },
    Trash:   { label: 'Deleted Items', icon: 'bin' }
  };

  var MI = {
    inbox: '<path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 13h5l1.5 2.2h5L16 13h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    send: '<path d="M3.5 11 20 4l-6 16-3.4-6.4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10.6 13.6 20 4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    draft: '<path d="M6 3h8l5 5v13H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    archive: '<rect x="3.2" y="4.5" width="17.6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M9.5 12h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    junk: '<path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9.5v4.4M12 16.8v.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    bin: '<path d="M6 7h12l-1 12.2A2 2 0 0 1 15 21H9a2 2 0 0 1-2-1.8zM9.5 4h5l.9 2H8.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4.5 6.6h15" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    reply: '<path d="M10 7 4 12l6 5v-3c5 0 8 1.5 9 5 .5-6-2.5-9.5-9-9.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    replyall: '<path d="M7 7 2 12l5 5v-3M12 7 7 12l5 5v-3c5 0 8 1.5 9 5 .5-6-2.5-9.5-9-9.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    forward: '<path d="M14 7l6 5-6 5v-3c-5 0-8 1.5-9 5-.5-6 2.5-9.5 9-9.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    paperclip: '<path d="M18 8.5 10.5 16a3 3 0 0 1-4.3-4.2l7.8-7.8a4.5 4.5 0 0 1 6.4 6.3l-7.9 7.9a6 6 0 0 1-8.5-8.5l7.3-7.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    search: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round"/>',
    gear: '<path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    help: '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.6 9.3a2.4 2.4 0 1 1 3.2 2.5c-.7.3-1.3.9-1.3 1.8M11.5 16.4v.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    more: '<circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/>'
  };
  function mi(name, cls) { return '<svg viewBox="0 0 24 24" class="' + (cls || 'ic') + '" aria-hidden="true">' + (MI[name] || MI.inbox) + '</svg>'; }

  function initials(nameOrAddr) {
    var s = String(nameOrAddr || '?').replace(/[<>]/g, ' ').trim();
    var at = s.indexOf('@');
    var base = at > 0 ? s.slice(0, at) : s;
    var parts = base.split(/[\s._-]+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  var AV_HUES = [8, 28, 150, 200, 260, 320, 190, 95];
  function avatarHue(key) {
    var h = 0, str = String(key || '');
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % AV_HUES.length;
    return AV_HUES[h];
  }

  function MailSim(mount, setup) {
    setup = setup || {};
    this.mount = mount;
    var folders = {};
    FOLDERS.forEach(function (f) { folders[f] = []; });
    var nextId = 1;
    (setup.messages || []).forEach(function (m) {
      var msg = Object.assign({
        id: nextId++, folder: 'Inbox', read: false, date: '19 Oct 09:12',
        to: [setup.account || 'trainee@rvnp.ac.ke'], cc: [], attachments: []
      }, m);
      folders[msg.folder].push(msg);
    });

    this.state = {
      kind: 'mail',
      account: setup.account || 'trainee@rvnp.ac.ke',
      vfs: setup.vfs || new D.VFS({ '/Documents': null, '/Downloads': null }),
      folders: folders,
      nextId: nextId,
      current: setup.open || 'Inbox',
      openMsg: null,
      compose: null,
      sent: [],
      query: '',
      events: []
    };
    this.render();
  }

  MailSim.prototype.fire = function (n, d) { this.state.events.push({ name: n, detail: d }); };

  MailSim.prototype.all = function () {
    var s = this.state, out = [];
    FOLDERS.forEach(function (f) { out = out.concat(s.folders[f]); });
    return out;
  };

  MailSim.prototype.msg = function (id) {
    return this.all().filter(function (m) { return m.id === id; })[0] || null;
  };

  MailSim.prototype.moveTo = function (id, folder) {
    var s = this.state, m = this.msg(id);
    if (!m) return;
    s.folders[m.folder] = s.folders[m.folder].filter(function (x) { return x.id !== id; });
    m.folder = folder;
    s.folders[folder].unshift(m);
    this.fire('move', { id: id, folder: folder });
    if (s.openMsg === id) s.openMsg = null;
    this.update();
  };

  MailSim.prototype.startCompose = function (mode, src) {
    var s = this.state, c = { to: '', cc: '', bcc: '', subject: '', body: '', attachments: [], mode: mode || 'new', showCc: false, min: false };
    if (src && mode === 'reply') {
      c.to = src.from;
      c.subject = /^re:/i.test(src.subject) ? src.subject : 'Re: ' + src.subject;
    } else if (src && mode === 'replyall') {
      var others = (src.to || []).concat(src.cc || []).filter(function (a) { return a !== s.account; });
      c.to = src.from;
      c.cc = others.join(', ');
      c.showCc = !!others.length;
      c.subject = /^re:/i.test(src.subject) ? src.subject : 'Re: ' + src.subject;
    } else if (src && mode === 'forward') {
      c.subject = /^fw:/i.test(src.subject) ? src.subject : 'Fw: ' + src.subject;
      c.body = '\n\n--- Forwarded message ---\nFrom: ' + src.from + '\n' + src.body;
      c.attachments = (src.attachments || []).slice();
    }
    c.replyTo = src ? src.id : null;
    s.compose = c;
    this.fire('compose', mode);
    this.update();
  };

  function addrList(v) {
    return String(v || '').split(/[,;]/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  MailSim.prototype.send = function () {
    var s = this.state, c = s.compose;
    if (!c) return;
    var msg = {
      id: s.nextId++, folder: 'Sent', read: true, date: '19 Oct 09:40',
      from: s.account, to: addrList(c.to), cc: addrList(c.cc), bcc: addrList(c.bcc),
      subject: c.subject, body: c.body, attachments: c.attachments.slice(),
      mode: c.mode, inReplyTo: c.replyTo
    };
    s.folders.Sent.unshift(msg);
    s.sent.push(msg);
    s.compose = null;
    this.fire('send', msg.id);
    this.update();
  };

  MailSim.prototype.render = function () {
    clear(this.mount);
    this.root = el('div', { class: 'sim-mail' });
    this.mount.appendChild(this.root);
    this.update();
  };

  MailSim.prototype.update = function () {
    var self = this, s = this.state;
    clear(this.root);

    /* ---- top app bar ---- */
    var search = el('input', { class: 'ml-search', type: 'search', placeholder: 'Search', value: s.query, 'aria-label': 'Search mail' });
    search.addEventListener('input', function () { s.query = search.value; self.fire('search', s.query); self.update(); });
    var topbar = el('div', { class: 'ml-topbar' }, [
      el('span', { class: 'ml-brand', text: 'Mail' }),
      el('div', { class: 'ml-searchwrap' }, [el('span', { class: 'ml-search-ic', html: mi('search', 'ic') }), search]),
      el('div', { class: 'ml-topicons' }, [
        el('button', { class: 'ml-topico', type: 'button', 'aria-label': 'Settings', html: mi('gear', 'ic') }),
        el('button', { class: 'ml-topico', type: 'button', 'aria-label': 'Help', html: mi('help', 'ic') }),
        el('span', { class: 'ml-topav', title: s.account, text: initials(s.account) })
      ])
    ]);

    /* ---- folder rail ---- */
    var newBtn = el('button', { class: 'ml-compose', type: 'button',
      onclick: function () { self.startCompose('new'); } }, []);
    newBtn.innerHTML = svgIcon('add', 'ic') + '<span>New mail</span>';

    var side = el('div', { class: 'ml-side' }, [newBtn, el('div', { class: 'ml-foldhead', text: 'Favourites' })]
      .concat(FOLDERS.map(function (f) {
        var meta = FOLDER_META[f];
        var unread = s.folders[f].filter(function (m) { return !m.read; }).length;
        var count = f === 'Drafts' ? s.folders[f].length : unread;
        var b = el('button', {
          class: 'ml-folder' + (s.current === f ? ' is-active' : ''), type: 'button',
          onclick: function () { s.current = f; s.openMsg = null; self.fire('open-folder', f); self.update(); }
        }, []);
        b.innerHTML = '<span class="ml-fold-ic">' + mi(meta.icon, 'ic') + '</span><span class="ml-fold-lbl">' +
          D.esc(meta.label) + '</span>' + (count ? '<b class="ml-fold-n">' + count + '</b>' : '');
        return b;
      })));

    /* ---- message list ---- */
    var items = s.folders[s.current].slice();
    var searching = !!s.query;
    if (searching) {
      var q = D.norm(s.query);
      items = self.all().filter(function (m) {
        return D.norm(m.subject).indexOf(q) !== -1 || D.norm(m.from).indexOf(q) !== -1 ||
          D.norm(m.fromName).indexOf(q) !== -1 || D.norm(m.body).indexOf(q) !== -1;
      });
    }

    var listHead = el('div', { class: 'ml-listhead' }, [
      el('span', { class: 'ml-listtitle', text: searching ? 'Search results' : FOLDER_META[s.current].label }),
      el('span', { class: 'ml-listfilter', text: 'Filter' })
    ]);
    var list = el('div', { class: 'ml-list' });
    if (!items.length) {
      list.appendChild(el('div', { class: 'ml-empty-box' }, [
        el('div', { class: 'ml-empty-ic', html: mi(searching ? 'search' : FOLDER_META[s.current].icon, 'ic ic-xl') }),
        el('p', { class: 'sim-empty', text: searching ? 'No matching messages' : 'Nothing in ' + FOLDER_META[s.current].label })
      ]));
    }
    items.forEach(function (m) {
      var who = m.fromName || m.from || '(no sender)';
      var row = el('div', {
        class: 'ml-item' + (m.read ? '' : ' is-unread') + (s.openMsg === m.id ? ' is-open' : ''),
        onclick: function () { m.read = true; s.openMsg = m.id; self.fire('open-message', m.id); self.update(); }
      }, []);
      var hue = avatarHue(m.from || who);
      row.innerHTML =
        '<span class="ml-unreaddot"></span>' +
        '<span class="ml-avatar" style="background:hsl(' + hue + ',52%,42%)">' + D.esc(initials(who)) + '</span>' +
        '<span class="ml-item-main">' +
          '<span class="ml-item-top"><span class="ml-from">' + D.esc(who) + '</span><span class="ml-date">' + D.esc(m.date) + '</span></span>' +
          '<span class="ml-subject">' + D.esc(m.subject || '(no subject)') + '</span>' +
          '<span class="ml-snippet">' + D.esc(String(m.body || '').replace(/\s+/g, ' ').slice(0, 72)) +
            ((m.attachments && m.attachments.length) ? ' <span class="ml-clip">' + mi('paperclip', 'ic') + '</span>' : '') + '</span>' +
        '</span>';
      list.appendChild(row);
    });

    /* ---- reading pane ---- */
    var pane = el('div', { class: 'ml-pane' });
    var open = s.openMsg ? this.msg(s.openMsg) : null;
    if (!open) {
      pane.appendChild(el('div', { class: 'ml-nopane' }, [
        el('div', { class: 'ml-nopane-ic', html: mi('inbox', 'ic ic-xl') }),
        el('p', { class: 'sim-empty', text: 'Select an item to read' })
      ]));
    } else {
      var fromWho = open.fromName || open.from;
      pane.appendChild(el('div', { class: 'ml-pane-actions' }, [
        actionBtn('reply', 'Reply', function () { self.startCompose('reply', open); }),
        actionBtn('replyall', 'Reply all', function () { self.startCompose('replyall', open); }),
        actionBtn('forward', 'Forward', function () { self.startCompose('forward', open); }),
        el('span', { class: 'ml-act-sep' }),
        actionBtn('archive', 'Archive', function () { self.moveTo(open.id, 'Archive'); }),
        actionBtn('junk', 'Report junk', function () { self.moveTo(open.id, 'Spam'); }),
        actionBtn('bin', 'Delete', function () { self.moveTo(open.id, 'Trash'); }),
        el('button', { class: 'ml-act ml-act-more', type: 'button', 'aria-label': 'More', html: mi('more', 'ic') })
      ]));
      pane.appendChild(el('h2', { class: 'ml-pane-subject', text: open.subject || '(no subject)' }));
      var hue2 = avatarHue(open.from || fromWho);
      pane.appendChild(el('div', { class: 'ml-pane-head' }, [
        el('span', { class: 'ml-avatar ml-avatar-lg', style: { background: 'hsl(' + hue2 + ',52%,42%)' }, text: initials(fromWho) }),
        el('div', { class: 'ml-pane-meta' }, [
          el('div', { class: 'ml-pane-from', html: '<b>' + D.esc(open.fromName || open.from) + '</b>' + (open.fromName ? ' <span class="ml-pane-addr">&lt;' + D.esc(open.from) + '&gt;</span>' : '') }),
          el('div', { class: 'ml-pane-to', text: 'To: ' + (open.to || []).join(', ') + ((open.cc && open.cc.length) ? ';  Cc: ' + open.cc.join(', ') : '') })
        ]),
        el('span', { class: 'ml-pane-date', text: open.date })
      ]));
      pane.appendChild(el('div', { class: 'ml-body', text: open.body || '' }));
      if ((open.attachments || []).length) {
        pane.appendChild(el('div', { class: 'ml-attachrow' }, (open.attachments || []).map(function (a) {
          return el('div', { class: 'ml-attach' }, [
            el('span', { class: 'ml-attach-ic', html: svgIcon(D.iconFor({ type: 'file', name: a.name }), 'ic ic-md fi-' + D.iconFor({ type: 'file', name: a.name })) }),
            el('span', { class: 'ml-attach-txt', html: '<b>' + D.esc(a.name) + '</b><em>' + (a.size || 12) + ' KB</em>' }),
            el('button', { class: 'ml-attach-dl', type: 'button', text: 'Save to Downloads',
              onclick: function () {
                s.vfs.touch('/Downloads', a.name, 'Saved from email');
                self.fire('save-attachment', a.name);
                self.update();
              } })
          ]);
        })));
      }
    }

    function actionBtn(icon, label, fn) {
      var b = el('button', { class: 'ml-act', type: 'button', onclick: fn, title: label }, []);
      b.innerHTML = mi(icon, 'ic') + '<span>' + D.esc(label) + '</span>';
      return b;
    }

    var shell = el('div', { class: 'ml-shell' }, [
      topbar,
      el('div', { class: 'ml-grid' }, [side, el('div', { class: 'ml-listcol' }, [listHead, list]), pane])
    ]);
    this.root.appendChild(shell);

    if (s.compose) this.root.appendChild(this.renderCompose());
  };

  MailSim.prototype.renderCompose = function () {
    var self = this, s = this.state, c = s.compose;

    function field(label, key) {
      var inp = el('input', { class: 'ml-finput', type: 'text', value: c[key], 'aria-label': label });
      inp.addEventListener('input', function () { c[key] = inp.value; });
      return el('label', { class: 'ml-field' }, [el('span', { class: 'ml-flabel', text: label }), inp]);
    }

    var bodyArea = el('textarea', { class: 'ml-bodyinput', 'aria-label': 'Message body', placeholder: '' });
    bodyArea.value = c.body;
    bodyArea.addEventListener('input', function () { c.body = bodyArea.value; });

    var attachWrap = el('div', { class: 'ml-attachlist' });
    function renderAttach() {
      clear(attachWrap);
      c.attachments.forEach(function (a, i) {
        attachWrap.appendChild(el('span', { class: 'ml-chip' }, [
          el('span', { class: 'ml-chip-ic', html: svgIcon(D.iconFor({ type: 'file', name: a.name }), 'ic fi-' + D.iconFor({ type: 'file', name: a.name })) }),
          el('span', { text: a.name }),
          el('button', { class: 'ml-chipx', type: 'button', text: '✕', 'aria-label': 'Remove attachment',
            onclick: function () { c.attachments.splice(i, 1); renderAttach(); } })
        ]));
      });
    }
    renderAttach();

    function pickFile() {
      var files = [];
      ['/Documents', '/Downloads', '/Desktop', '/Pictures'].forEach(function (dir) {
        s.vfs.list(dir).forEach(function (n) {
          if (n.type === 'file') files.push({ name: n.name, path: dir + '/' + n.name, size: Math.ceil(n.size / 1024) || 1 });
        });
      });
      var picker = el('div', { class: 'sim-overlay' }, [
        el('div', { class: 'sim-dialog' }, [
          el('div', { class: 'sim-dialog-head', text: 'Attach a file' }),
          el('div', { class: 'sim-dialog-body' }, [
            files.length ? el('div', { class: 'sim-filelist' }, files.map(function (f) {
              var row = el('div', { class: 'sim-fileitem', onclick: function () {
                c.attachments.push({ name: f.name, size: f.size, path: f.path });
                self.fire('attach', f.name);
                picker.remove(); renderAttach();
              } }, []);
              row.innerHTML = svgIcon(D.iconFor({ type: 'file', name: f.name }), 'ic ic-md fi-' + D.iconFor({ type: 'file', name: f.name })) +
                '<span class="sim-fname">' + D.esc(f.name) + '</span><span class="sim-fmeta">' +
                D.esc('This PC' + f.path.replace(/\//g, ' › ')) + '</span>';
              return row;
            })) : el('p', { class: 'sim-empty', text: 'No files available to attach' })
          ]),
          el('div', { class: 'sim-dialog-foot' }, [
            el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Cancel', onclick: function () { picker.remove(); } })
          ])
        ])
      ]);
      self.root.appendChild(picker);
    }

    var titleText = c.mode === 'new' ? 'New message' : c.mode === 'forward' ? 'Forward' : c.mode === 'replyall' ? 'Reply all' : 'Reply';
    var head = el('div', { class: 'ml-composehead' }, [
      el('span', { text: titleText }),
      el('div', { class: 'ml-composehead-ctrls' }, [
        el('button', { class: 'ml-chbtn', type: 'button', 'aria-label': c.min ? 'Expand' : 'Minimise',
          text: c.min ? '▴' : '▾', onclick: function () { c.min = !c.min; self.update(); } }),
        el('button', { class: 'ml-chbtn', type: 'button', 'aria-label': 'Discard', text: '✕',
          onclick: function () { s.compose = null; self.fire('discard'); self.update(); } })
      ])
    ]);

    var fields = el('div', { class: 'ml-fields' }, [
      el('div', { class: 'ml-torow' }, [
        field('To', 'to'),
        c.showCc ? null : el('button', { class: 'ml-ccbtn', type: 'button', text: 'Cc Bcc',
          onclick: function () { c.showCc = true; self.update(); } })
      ]),
      c.showCc ? field('Cc', 'cc') : null,
      c.showCc ? field('Bcc', 'bcc') : null,
      field('Subject', 'subject')
    ]);

    var win = el('div', { class: 'ml-compose-win' + (c.min ? ' is-min' : '') }, [
      head,
      el('div', { class: 'ml-compose-body' }, [
        fields, bodyArea, attachWrap,
        el('div', { class: 'ml-composefoot' }, [
          el('button', { class: 'ml-sendbtn', type: 'button', text: 'Send', onclick: function () { self.send(); } }),
          el('button', { class: 'ml-footico', type: 'button', 'aria-label': 'Attach file', title: 'Attach file',
            html: mi('paperclip', 'ic'), onclick: pickFile }),
          el('span', { class: 'ml-foot-spring' }),
          el('button', { class: 'ml-footlink', type: 'button', text: 'Save draft',
            onclick: function () {
              s.folders.Drafts.unshift({ id: s.nextId++, folder: 'Drafts', read: true, date: '19 Oct',
                from: s.account, to: addrList(c.to), cc: addrList(c.cc), subject: c.subject, body: c.body,
                attachments: c.attachments.slice() });
              s.compose = null; self.fire('save-draft'); self.update();
            } }),
          el('button', { class: 'ml-footico', type: 'button', 'aria-label': 'Discard', title: 'Discard draft',
            html: mi('bin', 'ic'), onclick: function () { s.compose = null; self.fire('discard'); self.update(); } })
        ])
      ])
    ]);
    return win;
  };

  MailSim.prototype.destroy = function () { clear(this.mount); };

  D.sims = D.sims || {};
  D.sims.mail = { create: function (mount, setup) { return new MailSim(mount, setup); } };
  D.mailAddrList = addrList;

})(window.DIGILIT);
