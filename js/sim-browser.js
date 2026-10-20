/* DigiLit — web browser simulator.
   A faithful recreation of a current Chromium browser (the shape Chrome and
   Edge share): rounded tab strip, an omnibox with a security indicator, a
   bookmarks bar that is always present, a real new-tab page with shortcut
   tiles, and an overflow menu. The little self-contained web it browses keeps
   its teaching traps — a sponsored result, a scam look-alike and a clickbait
   article. Grading inspects the resulting state (which page is open, what was
   bookmarked, what was downloaded), not clicks. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear, svgIcon = D.svgIcon;

  /* A tiny web. Keys are addresses without scheme. */
  var DEFAULT_WEB = {
    'start.digilit': {
      title: 'New Tab', secure: true, kind: 'home',
      body: ''
    },
    'findit.example': {
      title: 'FindIt Search', secure: true, kind: 'search',
      body: '<h1>FindIt</h1><p>Search the web.</p>'
    },
    'rvnp.ac.ke': {
      title: 'Rift Valley National Polytechnic', secure: true, official: true,
      body: '<div class="site-hero"><p class="site-kicker">Official institutional website</p>' +
        '<h1>Rift Valley National Polytechnic</h1>' +
        '<p>Technical and vocational training in Nakuru. Admissions, courses, fee structure and student services.</p></div>' +
        '<nav class="site-nav"><a data-link="rvnp.ac.ke/admissions">Admissions</a><a data-link="rvnp.ac.ke/fees">Fee structure</a><a data-link="rvnp.ac.ke">Courses</a><a data-link="rvnp.ac.ke">Contact</a></nav>' +
        '<p>Welcome to RVNP. Use the links above to apply, download the published fee structure, or contact the registrar.</p>'
    },
    'rvnp.ac.ke/admissions': {
      title: 'Admissions — RVNP', secure: true, official: true,
      body: '<p class="site-kicker">Official institutional website</p><h1>Admissions</h1>' +
        '<p>Intakes run in January, May and September. Applications are made with the official admission form below.</p>' +
        '<p><a data-download="admission-form.pdf" data-size="184" class="site-dl">⬇ Download the admission form (PDF, 184 KB)</a></p>'
    },
    'rvnp.ac.ke/fees': {
      title: 'Fee structure — RVNP', secure: true, official: true,
      body: '<p class="site-kicker">Official institutional website</p><h1>Fee structure</h1>' +
        '<p>The published fee structure by programme and level for the 2026 academic year.</p>' +
        '<p><a data-download="fees-structure.pdf" data-size="96" class="site-dl">⬇ Download the fee structure (PDF, 96 KB)</a></p>'
    },
    'rvnp-admissions-apply.cheapforms.net': {
      title: 'Apply Now — Fast Admission!!', secure: false, scam: true,
      body: '<h1>🎉 GUARANTEED ADMISSION — PAY KSH 500 NOW 🎉</h1>' +
        '<p><b>This is not the official site.</b> The address is not rvnp.ac.ke, the connection is not secure, and it asks for a payment before any application is processed.</p>' +
        '<p><a data-link="rvnp-admissions-apply.cheapforms.net/pay" class="scam-btn">Pay registration fee →</a></p>'
    },
    'weather.example': {
      title: 'Weather — Nakuru', secure: true,
      body: '<h1>Nakuru weather</h1><p>Light cloud, 24°C. Wind 11 km/h. Humidity 58%.</p><p>Seven-day outlook: dry through the week, a chance of rain on Saturday.</p>'
    },
    'news.example/health-claim': {
      title: 'Miracle cure found, doctors stunned', secure: true, clickbait: true,
      body: '<h1>Doctors stunned by this one trick</h1>' +
        '<p><b>No author, no date, no sources</b> — and a link to buy a product. These are the signs of a page you should not trust.</p>' +
        '<p><a data-link="news.example/health-claim" class="scam-btn">Buy now — limited offer</a></p>'
    }
  };

  /* Search index: keyword -> ordered results. First entries may be ads. */
  var DEFAULT_RESULTS = [
    { url: 'rvnp-admissions-apply.cheapforms.net', title: 'Apply to RVNP — Instant Admission', snippet: 'Guaranteed placement, pay online today and skip the queue.', ad: true, keys: ['rvnp', 'admission', 'polytechnic', 'apply'] },
    { url: 'rvnp.ac.ke', title: 'Rift Valley National Polytechnic — Official Website', snippet: 'Official site. Courses, admissions, fees and contacts.', keys: ['rvnp', 'admission', 'polytechnic', 'fees', 'rift valley'] },
    { url: 'rvnp.ac.ke/admissions', title: 'Admissions — Rift Valley National Polytechnic', snippet: 'Intake dates and the official admission form.', keys: ['rvnp', 'admission', 'apply', 'intake'] },
    { url: 'rvnp.ac.ke/fees', title: 'Fee structure — Rift Valley National Polytechnic', snippet: 'The published fee structure by programme and level.', keys: ['rvnp', 'fees', 'fee', 'structure'] },
    { url: 'weather.example', title: 'Nakuru weather forecast', snippet: 'Current conditions and seven-day outlook.', keys: ['weather', 'nakuru', 'naivasha', 'forecast'] },
    { url: 'news.example/health-claim', title: 'Miracle cure found, doctors stunned', snippet: 'You will not believe what happened next.', keys: ['health', 'cure', 'news'] }
  ];

  /* New-tab-page shortcut tiles (what a real browser shows under the search box) */
  var NTP_SHORTCUTS = [
    { url: 'rvnp.ac.ke', label: 'RVNP' },
    { url: 'findit.example', label: 'FindIt' },
    { url: 'weather.example', label: 'Weather' }
  ];

  function BrowserSim(mount, setup) {
    setup = setup || {};
    this.mount = mount;
    this.web = Object.assign({}, DEFAULT_WEB, setup.web || {});
    this.results = setup.results || DEFAULT_RESULTS;
    this.state = {
      kind: 'browser',
      vfs: setup.vfs || new D.VFS({ '/Downloads': null, '/Documents': null }),
      tabs: [],
      activeTab: null,
      nextTab: 1,
      bookmarks: (setup.bookmarks || []).slice(),
      downloads: [],
      visited: [],
      searches: [],
      historyCleared: false,
      showDL: false,
      events: []
    };
    (setup.tabs || ['start.digilit']).forEach(function (u) { this.newTab(u, true); }, this);
    this.render();
  }

  BrowserSim.prototype.fire = function (n, d) { this.state.events.push({ name: n, detail: d }); };

  BrowserSim.prototype.page = function (url) { return this.web[url] || null; };

  BrowserSim.prototype.faviconFor = function (url) {
    var p = this.page(url);
    if (!p) return 'globe';
    if (p.kind === 'home') return 'home';
    if (p.scam || p.clickbait || p.secure === false) return 'insecure';
    return 'globe';
  };

  BrowserSim.prototype.favSvg = function (kind, secure) {
    if (kind === 'home') return svgIcon('search', 'ic');
    if (kind === 'insecure') return '<svg viewBox="0 0 24 24" class="ic br-fav-warn"><path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.5v4.2M12 16.6v.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    return '<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.6 12h16.8M12 3.6c2.4 2.3 2.4 14.5 0 16.8M12 3.6c-2.4 2.3-2.4 14.5 0 16.8" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  };

  BrowserSim.prototype.newTab = function (url, quiet) {
    var t = { id: this.state.nextTab++, history: [url || 'start.digilit'], hidx: 0, query: '' };
    this.state.tabs.push(t);
    this.state.activeTab = t.id;
    this.state.visited.push(url || 'start.digilit');
    if (!quiet) { this.fire('new-tab', url); this.update(); }
    return t;
  };

  BrowserSim.prototype.tab = function () {
    var s = this.state;
    return s.tabs.filter(function (t) { return t.id === s.activeTab; })[0] || s.tabs[0];
  };

  BrowserSim.prototype.url = function () {
    var t = this.tab();
    return t ? t.history[t.hidx] : '';
  };

  BrowserSim.prototype.go = function (url) {
    var t = this.tab();
    if (!t) return;
    url = String(url || '').trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
    if (!url) return;
    if (!this.page(url) && url.indexOf('.') === -1) {
      t.query = url;
      url = 'findit.example';
      this.state.searches.push(t.query);
      this.fire('search', t.query);
    }
    t.history = t.history.slice(0, t.hidx + 1);
    t.history.push(url);
    t.hidx = t.history.length - 1;
    this.state.visited.push(url);
    this.fire('navigate', url);
    this.update();
  };

  BrowserSim.prototype.render = function () {
    clear(this.mount);
    this.root = el('div', { class: 'sim-browser' });
    this.mount.appendChild(this.root);
    this.update();
  };

  BrowserSim.prototype.update = function () {
    var self = this, s = this.state, t = this.tab(), url = this.url(), page = this.page(url);
    clear(this.root);

    /* ---- tab strip ---- */
    var strip = el('div', { class: 'br-tabs' }, [
      el('div', { class: 'br-tabrow' }, s.tabs.map(function (tt) {
        var p = self.page(tt.history[tt.hidx]);
        var kind = self.faviconFor(tt.history[tt.hidx]);
        var b = el('div', { class: 'br-tab' + (tt.id === s.activeTab ? ' is-active' : ''),
          onclick: function () { s.activeTab = tt.id; self.update(); }, title: (p && p.title) || 'New Tab' }, []);
        b.innerHTML = '<span class="br-fav">' + self.favSvg(kind, p && p.secure) + '</span>' +
          '<span class="br-tabtitle">' + D.esc((p && p.title) || 'New Tab') + '</span>';
        b.appendChild(el('button', { class: 'br-tabclose', type: 'button', 'aria-label': 'Close tab',
          html: '<svg viewBox="0 0 12 12" class="wcico"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
          onclick: function (e) {
            e.stopPropagation();
            s.tabs = s.tabs.filter(function (x) { return x.id !== tt.id; });
            if (!s.tabs.length) self.newTab('start.digilit', true);
            if (s.activeTab === tt.id) s.activeTab = s.tabs[s.tabs.length - 1].id;
            self.fire('close-tab', tt.id);
            self.update();
          } }));
        return b;
      }).concat([
        el('button', { class: 'br-newtab', type: 'button', 'aria-label': 'New tab', title: 'New tab',
          html: svgIcon('add', 'ic'), onclick: function () { self.newTab('start.digilit'); } })
      ]))
    ]);

    /* ---- toolbar ---- */
    var addr = el('input', { class: 'br-addr', type: 'text', value: (page && page.kind === 'home') ? '' : url,
      placeholder: 'Search FindIt or type a URL', 'aria-label': 'Address and search bar', spellcheck: 'false' });
    addr.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.go(addr.value); });

    var secure = page && page.secure;
    var home = page && page.kind === 'home';
    var lock = el('span', { class: 'br-lock ' + (home ? 'is-home' : (secure ? 'is-secure' : 'is-insecure')),
      title: home ? 'Search' : (secure ? 'Connection is secure' : 'Not secure') },
      []);
    lock.innerHTML = home ? svgIcon('search', 'ic')
      : secure ? '<svg viewBox="0 0 24 24" class="ic"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
      : '<svg viewBox="0 0 24 24" class="ic"><path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.5v4.2M12 16.6v.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

    var star = el('button', {
      class: 'br-omni-ic' + (s.bookmarks.indexOf(url) !== -1 ? ' is-on' : ''), type: 'button',
      'aria-label': 'Bookmark this tab', title: s.bookmarks.indexOf(url) !== -1 ? 'Edit bookmark' : 'Bookmark this tab',
      onclick: function () {
        var i = s.bookmarks.indexOf(url);
        if (i === -1) { s.bookmarks.push(url); self.fire('bookmark', url); }
        else s.bookmarks.splice(i, 1);
        self.update();
      }
    }, []);
    star.innerHTML = s.bookmarks.indexOf(url) !== -1
      ? '<svg viewBox="0 0 24 24" class="ic"><path d="M12 3.5 14.6 9l6 .5-4.6 4 1.4 5.9L12 16.3 6.6 19.4 8 13.5l-4.6-4 6-.5z"/></svg>'
      : '<svg viewBox="0 0 24 24" class="ic"><path d="M12 3.5 14.6 9l6 .5-4.6 4 1.4 5.9L12 16.3 6.6 19.4 8 13.5l-4.6-4 6-.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

    var omni = el('div', { class: 'br-addrwrap' + (home ? ' is-home' : '') }, [
      lock,
      secure && !home ? el('span', { class: 'br-scheme', text: 'https://' }) : null,
      addr,
      star
    ]);

    var bar = el('div', { class: 'br-bar' }, [
      el('button', { class: 'br-navbtn', type: 'button', 'aria-label': 'Back', disabled: !t || t.hidx <= 0,
        html: svgIcon('back', 'ic'), onclick: function () { t.hidx--; self.fire('back'); self.update(); } }),
      el('button', { class: 'br-navbtn', type: 'button', 'aria-label': 'Forward', disabled: !t || t.hidx >= t.history.length - 1,
        html: svgIcon('fwd', 'ic'), onclick: function () { t.hidx++; self.fire('forward'); self.update(); } }),
      el('button', { class: 'br-navbtn', type: 'button', 'aria-label': 'Reload this page',
        html: '<svg viewBox="0 0 24 24" class="ic"><path d="M19 12a7 7 0 1 1-2-4.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M19 4.5V8h-3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        onclick: function () { self.fire('reload'); self.update(); } }),
      el('button', { class: 'br-navbtn', type: 'button', 'aria-label': 'Home',
        html: '<svg viewBox="0 0 24 24" class="ic"><path d="M4 11 12 4l8 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9h12v-9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
        onclick: function () { self.go('start.digilit'); } }),
      omni,
      el('button', { class: 'br-navbtn', type: 'button', 'aria-label': 'Extensions', title: 'Extensions',
        html: '<svg viewBox="0 0 24 24" class="ic"><path d="M10 4a2 2 0 0 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 0 1 0 4h-1v3a1 1 0 0 1-1 1h-3v-1a2 2 0 0 0-4 0v1H7a1 1 0 0 1-1-1v-3H5a2 2 0 0 1 0-4h1V6a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>' }),
      el('button', { class: 'br-profile', type: 'button', 'aria-label': 'Profile', title: 'Trainee',
        html: svgIcon('person', 'ic') }),
      el('button', {
        class: 'br-navbtn', type: 'button', 'aria-label': 'Customise and control', title: 'Menu',
        html: svgIcon('more', 'ic'),
        onclick: function (e) {
          e.stopPropagation();
          self.menu(e, [
            { label: 'New tab', accel: 'Ctrl+T', action: function () { self.newTab('start.digilit'); } },
            { label: 'New window', accel: 'Ctrl+N', action: function () {} },
            { label: 'New incognito window', accel: 'Ctrl+Shift+N', action: function () {} },
            '-',
            { label: 'History', action: function () {} },
            { label: 'Downloads (' + s.downloads.length + ')', accel: 'Ctrl+J', action: function () { s.showDL = true; self.update(); } },
            { label: 'Bookmarks (' + s.bookmarks.length + ')', action: function () {} },
            '-',
            { label: 'Zoom  —  100%  +', action: function () {} },
            { label: 'Print…', accel: 'Ctrl+P', action: function () {} },
            { label: 'Find…', accel: 'Ctrl+F', action: function () {} },
            '-',
            { label: 'Clear browsing data…', accel: 'Ctrl+Shift+Del', action: function () {
              s.visited = []; s.searches = []; s.historyCleared = true; self.fire('clear-history'); self.update();
            } },
            { label: 'Settings', action: function () {} },
            { label: 'Help', sub: true, action: function () {} }
          ]);
        }
      })
    ]);

    /* ---- bookmarks bar (always present) ---- */
    var bmBar = el('div', { class: 'br-bookmarks' }, [
      el('button', { class: 'br-bm br-bm-apps', type: 'button', title: 'Apps',
        html: svgIcon('apps', 'ic') + '<span>Apps</span>' })
    ].concat(s.bookmarks.length ? s.bookmarks.map(function (bm) {
      var p = self.page(bm);
      var b = el('button', { class: 'br-bm', type: 'button', title: bm, onclick: function () { self.go(bm); } }, []);
      b.innerHTML = '<span class="br-bm-fav">' + self.favSvg(self.faviconFor(bm), p && p.secure) + '</span><span>' +
        D.esc((p && p.title) ? p.title.split(' — ')[0].slice(0, 22) : bm) + '</span>';
      return b;
    }) : [el('span', { class: 'br-bm-empty', text: 'Bookmark pages with the ☆ in the address bar to pin them here' })]));

    /* ---- page view ---- */
    var view = el('div', { class: 'br-view' });
    if (home) {
      view.appendChild(this.renderNTP());
    } else if (!page) {
      view.appendChild(el('div', { class: 'br-page br-error' }, [
        el('div', { class: 'br-error-ic', text: ':(' }),
        el('h1', { text: 'This site can’t be reached' }),
        el('p', { text: 'Check that the address is spelled correctly, then try again.' })
      ]));
    } else if (page.kind === 'search') {
      view.appendChild(this.renderSearch(t));
    } else {
      var cls = 'br-page br-site' + (page.scam ? ' is-scam' : '') + (page.clickbait ? ' is-clickbait' : '') + (page.official ? ' is-official' : '');
      var p = el('div', { class: cls, html: page.body });
      p.querySelectorAll('[data-link]').forEach(function (a) {
        a.classList.add('br-link');
        a.addEventListener('click', function (e) { e.preventDefault(); self.go(a.dataset.link); });
      });
      p.querySelectorAll('[data-download]').forEach(function (a) {
        a.classList.add('br-link');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var name = a.dataset.download;
          s.vfs.touch('/Downloads', name, 'Downloaded from ' + url);
          s.downloads.push({ name: name, from: url });
          s.showDL = true;
          self.fire('download', name);
          self.update();
        });
      });
      view.appendChild(p);
    }

    this.root.appendChild(strip);
    this.root.appendChild(bar);
    this.root.appendChild(bmBar);
    this.root.appendChild(view);
    if (s.showDL && s.downloads.length) this.root.appendChild(this.renderDownloadShelf());
  };

  BrowserSim.prototype.renderNTP = function () {
    var self = this, s = this.state;
    var wrap = el('div', { class: 'br-ntp' });
    wrap.appendChild(el('div', { class: 'br-ntp-brand' }, [
      el('span', { class: 'br-ntp-logo', text: 'FindIt' })
    ]));
    var box = el('div', { class: 'br-ntp-searchwrap' }, [
      el('span', { class: 'br-ntp-search-ic', html: svgIcon('search', 'ic') }),
      (function () {
        var inp = el('input', { class: 'br-ntp-search', type: 'text', 'aria-label': 'Search',
          placeholder: 'Search FindIt or type a URL', spellcheck: 'false' });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.go(inp.value); });
        return inp;
      })()
    ]);
    wrap.appendChild(box);

    var tiles = el('div', { class: 'br-ntp-tiles' }, NTP_SHORTCUTS.map(function (sc) {
      var p = self.page(sc.url);
      var b = el('button', { class: 'br-ntp-tile', type: 'button', onclick: function () { self.go(sc.url); } }, []);
      b.innerHTML = '<span class="br-ntp-tile-ic">' + self.favSvg(self.faviconFor(sc.url), p && p.secure) + '</span><span>' + D.esc(sc.label) + '</span>';
      return b;
    }).concat([
      (function () { var b = el('button', { class: 'br-ntp-tile br-ntp-add', type: 'button', title: 'Add shortcut' }); b.innerHTML = '<span class="br-ntp-tile-ic">' + svgIcon('add', 'ic') + '</span><span>Add shortcut</span>'; return b; })()
    ]));
    wrap.appendChild(tiles);
    return wrap;
  };

  BrowserSim.prototype.renderSearch = function (t) {
    var self = this, s = this.state;
    var wrap = el('div', { class: 'br-page br-search' });

    var topbar = el('div', { class: 'br-search-top' }, [
      el('span', { class: 'br-search-logo', text: 'FindIt' }),
      (function () {
        var box = el('input', { class: 'br-searchbox', type: 'search', value: t.query || '',
          placeholder: 'Search FindIt', 'aria-label': 'Search' });
        box.addEventListener('input', run);
        box.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
        self._searchBox = box;
        return box;
      })()
    ]);
    var meta = el('div', { class: 'br-search-meta' });
    var out = el('div', { class: 'br-results' });

    function run() {
      t.query = self._searchBox.value;
      clear(out); clear(meta);
      var q = D.norm(t.query);
      if (!q) return;
      if (s.searches[s.searches.length - 1] !== t.query) { s.searches.push(t.query); self.fire('search', t.query); }
      var words = q.split(' ').filter(Boolean);
      var hits = self.results.filter(function (r) {
        return words.some(function (w) {
          return r.keys.some(function (k) { return k.indexOf(w) !== -1 || w.indexOf(k) !== -1; });
        });
      });
      meta.appendChild(el('span', { text: hits.length ? 'About ' + (hits.length * 1000 + 240).toLocaleString() + ' results (0.31 seconds)' : '' }));
      if (!hits.length) { out.appendChild(el('p', { class: 'sim-empty', text: 'No results found for "' + t.query + '"' })); return; }
      hits.forEach(function (r) {
        var node = el('div', { class: 'br-result' + (r.ad ? ' is-ad' : '') }, []);
        var host = r.url.split('/')[0];
        node.innerHTML =
          (r.ad ? '<span class="br-adtag">Sponsored</span>' : '') +
          '<div class="br-result-url"><span class="br-result-fav">' + self.favSvg(self.faviconFor(r.url), (self.page(r.url) || {}).secure) + '</span>' +
            '<span class="br-result-host">' + D.esc(host) + '</span></div>' +
          '<a class="br-link br-resulttitle" href="#">' + D.esc(r.title) + '</a>' +
          '<p class="br-snippet">' + D.esc(r.snippet) + '</p>';
        node.querySelector('.br-resulttitle').addEventListener('click', function (e) { e.preventDefault(); self.go(r.url); });
        out.appendChild(node);
      });
    }

    wrap.appendChild(topbar);
    wrap.appendChild(meta);
    wrap.appendChild(out);
    run();
    return wrap;
  };

  BrowserSim.prototype.renderDownloadShelf = function () {
    var self = this, s = this.state;
    return el('div', { class: 'br-dlshelf' }, [
      el('div', { class: 'br-dlshelf-items' }, s.downloads.map(function (d) {
        return el('div', { class: 'br-dlchip' }, [
          el('span', { class: 'br-dlchip-ic', html: svgIcon(D.iconFor({ type: 'file', name: d.name }), 'ic fi-' + D.iconFor({ type: 'file', name: d.name })) }),
          el('span', { class: 'br-dlchip-txt', html: '<b>' + D.esc(d.name) + '</b><em>Done · saved to Downloads</em>' })
        ]);
      })),
      el('button', { class: 'br-dlshelf-x', type: 'button', 'aria-label': 'Close downloads bar', text: '✕',
        onclick: function () { s.showDL = false; self.update(); } })
    ]);
  };

  BrowserSim.prototype.showDownloads = function () { this.state.showDL = true; this.update(); };

  BrowserSim.prototype.menu = function (ev, entries) {
    var self = this;
    var old = this.root.querySelector('.sim-ctx');
    if (old) old.parentNode.removeChild(old);
    var menu = el('div', { class: 'sim-ctx br-menu' }, entries.map(function (e) {
      if (e === '-') return el('div', { class: 'sim-ctx-sep' });
      var b = el('button', { class: 'sim-ctx-item', type: 'button',
        onclick: function () { if (menu.parentNode) menu.remove(); e.action(); } }, []);
      b.innerHTML = '<span class="sim-ctx-label">' + D.esc(e.label) + '</span>' +
        (e.sub ? svgIcon('chevron', 'ic sim-ctx-chev') : '') +
        (e.accel ? '<em class="sim-ctx-accel">' + D.esc(e.accel) + '</em>' : '');
      return b;
    }));
    this.root.appendChild(menu);
    var r = this.root.getBoundingClientRect();
    menu.style.right = '8px';
    menu.style.top = (ev.clientY - r.top + 6) + 'px';
    setTimeout(function () {
      document.addEventListener('mousedown', function h(e) {
        if (!menu.contains(e.target)) { if (menu.parentNode) menu.remove(); document.removeEventListener('mousedown', h); }
      });
    }, 0);
  };

  BrowserSim.prototype.destroy = function () { clear(this.mount); };

  D.sims = D.sims || {};
  D.sims.browser = { create: function (mount, setup) { return new BrowserSim(mount, setup); } };

})(window.DIGILIT);
