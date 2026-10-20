/* DigiLit — operating system simulator.
   A faithful recreation of the current Windows 11 desktop shell (with a
   Windows 10 flavour), built so trainees practise in an environment that looks
   and behaves like the real machines in front of them: centred taskbar, Start
   with Pinned + Recommended, a File Explorer with the real navigation tree and
   command bar, and a Settings app with the full category rail. The glyphs are
   drawn here rather than copied, so no trademarked bitmaps are bundled.

   Grading inspects OUTCOMES (the filesystem, the settings, the power state),
   never the click path, so a toolbar button, a context menu and a keyboard
   shortcut all count as correct. */
(function (D) {
  'use strict';

  var el = D.el, clear = D.clear;

  /* ---------------- icon set (hand-drawn Fluent-style glyphs) ---------------- */
  var ICONS = {
    /* window / shell */
    start: '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1"/><rect x="13" y="13" width="7.5" height="7.5" rx="1"/>',
    taskview: '<rect x="2.5" y="4" width="13" height="10" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="8.5" y="10" width="13" height="10" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    widgets: '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" opacity=".55"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" opacity=".55"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.6" opacity=".8"/>',
    folder: '<path d="M3 7.2A1.8 1.8 0 0 1 4.8 5.4H9l2 2h8.2A1.8 1.8 0 0 1 21 9.2v8A1.8 1.8 0 0 1 19.2 19H4.8A1.8 1.8 0 0 1 3 17.2z"/>',
    folderOpen: '<path d="M3 7.2A1.8 1.8 0 0 1 4.8 5.4H9l2 2h8.2A1.8 1.8 0 0 1 21 9.2v1H6.6L4 18.4A1.6 1.6 0 0 1 3 17z"/><path d="M5.2 10.6h16L19 18.2a1.6 1.6 0 0 1-1.5 1.1H4.6A1.6 1.6 0 0 1 3 17.2z" opacity=".6"/>',
    file: '<path d="M6 3h7.2L19 8.8V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13 3v6h6" fill="none" stroke="#fff" stroke-width="1.4"/>',
    doc: '<path d="M6 3h7.2L19 8.8V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><g fill="none" stroke="#fff" stroke-width="1.4"><path d="M8 12h8M8 15h8M8 18h5"/></g>',
    image: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><circle cx="8.6" cy="10" r="1.7" fill="#fff"/><path d="M4.4 17.4l4.6-4.6 3 3 3.4-3.4 5 5v1.1a1 1 0 0 1-1 1H6z" fill="#fff" opacity=".7"/>',
    sheet: '<rect x="3" y="4" width="18" height="16" rx="2.2"/><g stroke="#fff" stroke-width="1.2" fill="none"><path d="M3 9h18M3 14h18M9 4v16M15 4v16"/></g>',
    drive: '<rect x="3" y="6" width="18" height="12" rx="2.2"/><circle cx="17" cy="12" r="1.4" fill="#fff"/><rect x="6" y="10" width="6" height="4" rx="1" fill="#fff" opacity=".7"/>',
    usb: '<path d="M11 2h2v7h3l-4 6-4-6h3z"/><rect x="8" y="15" width="8" height="7" rx="1.5"/>',
    trash: '<path d="M6 7h12l-1 12.2A2 2 0 0 1 15 21H9a2 2 0 0 1-2-1.8zM9.5 4h5l.9 2H8.6z"/><path d="M4.5 6.6h15" fill="none" stroke="#fff" stroke-width="1.3"/>',
    notepad: '<rect x="4.5" y="3" width="15" height="18" rx="2.2"/><g stroke="#fff" stroke-width="1.3" fill="none"><path d="M8 8h8M8 12h8M8 16h5"/></g>',
    /* settings categories */
    gear: '<path d="M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4zm9.1 4.1-2.1-.5a7 7 0 0 0-.7-1.7l1.2-1.8-1.5-1.5-1.8 1.2a7 7 0 0 0-1.7-.7L13.9 4.5h-2.1l-.5 2.1a7 7 0 0 0-1.7.7L7.8 6.1 6.3 7.6l1.2 1.8a7 7 0 0 0-.7 1.7l-2.1.5v2.1l2.1.5a7 7 0 0 0 .7 1.7l-1.2 1.8 1.5 1.5 1.8-1.2a7 7 0 0 0 1.7.7l.5 2.1h2.1l.5-2.1a7 7 0 0 0 1.7-.7l1.8 1.2 1.5-1.5-1.2-1.8a7 7 0 0 0 .7-1.7l2.1-.5z"/>',
    bluetooth: '<path d="M8 6.5 16 17l-4 3.5v-17L16 7 8 17.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>',
    wifi: '<path d="M12 18.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/><path d="M8.4 15a5 5 0 0 1 7.2 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5.7 12a9 9 0 0 1 12.6 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M3 9a13 13 0 0 1 18 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    apps: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><path d="M16.5 13.5v6M13.5 16.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0z"/>',
    clock: '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.2V12l3.2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    gaming: '<path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 3.6l.7 3.8A2.4 2.4 0 0 1 17.3 18l-1.6-2.4H8.3L6.7 18A2.4 2.4 0 0 1 2.4 15.4l.7-3.8A4.5 4.5 0 0 1 7.5 8z"/><g fill="#fff"><circle cx="16.3" cy="12" r="1"/><circle cx="18" cy="13.4" r="1"/><rect x="6.2" y="11.3" width="3.4" height="1.2" rx=".6"/><rect x="7.2" y="10.3" width="1.2" height="3.4" rx=".6"/></g>',
    access: '<circle cx="12" cy="4.6" r="1.8"/><path d="M4.5 8.2c2.4.9 4.9 1.3 7.5 1.3s5.1-.4 7.5-1.3M12 9.5v5m0 0-3 5.4m3-5.4 3 5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    privacy: '<path d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    update: '<path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M20 4v3.6h-3.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    home: '<path d="M4 11 12 4l8 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10.5V20h12v-9.5"/><path d="M6 10.5V20h12v-9.5" fill="#fff"/><path d="M10 20v-5h4v5" fill="currentColor"/>',
    gallery: '<rect x="3" y="5" width="18" height="14" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="8.4" cy="10" r="1.5"/><path d="M4.6 17l4.4-4.2 3 2.8 3.2-3 4.2 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    onedrive: '<path d="M7.2 18h10.3a3 3 0 0 0 .5-5.96 4.4 4.4 0 0 0-8.14-1.86A3.6 3.6 0 0 0 7.2 18z"/>',
    pc: '<rect x="2.6" y="4.6" width="18.8" height="11.4" rx="1.6"/><rect x="4.5" y="6.3" width="15" height="8" rx=".6" fill="#fff" opacity=".85"/><path d="M8 19.4h8M12 16v3.4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    display: '<rect x="2.6" y="4.6" width="18.8" height="11.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 19.4h8M12 16v3.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    music: '<path d="M9 17.5a2.5 2.5 0 1 1-2.5-2.5c.9 0 1.7.3 2.5.9V6l9-2v8.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 15a2.5 2.5 0 1 1-2.5-2.5c.9 0 1.8.3 2.5.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5 21 8v8l-5-2.5z"/>',
    network: '<rect x="4" y="15" width="16" height="5" rx="1.2"/><path d="M12 15V9m0 0H7v3m5-3h5v3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="6" r="2.2"/>',
    speaker: '<path d="M5 9h3l4.2-3.6v13.2L8 15H5z"/><path d="M15.4 9.4a4 4 0 0 1 0 5.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18 7a7.5 7.5 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    battery: '<rect x="2.5" y="8" width="17" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="4.4" y="9.9" width="11" height="4.2" rx="1"/><rect x="20" y="10.4" width="2" height="3.2" rx="1"/>',
    power: '<path d="M11 3h2v8.5h-2z"/><path d="M7.4 6.3a8 8 0 1 0 9.2 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    search: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    back: '<path d="M14.5 5 8 12l6.5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    fwd: '<path d="M9.5 5 16 12l-6.5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    up: '<path d="M5 14 12 7l7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    refresh: '<path d="M19 12a7 7 0 1 1-2-4.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M19 4.5V8h-3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    cut: '<circle cx="6.5" cy="7" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6.5" cy="17" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 8.4 20 17M8.5 15.6 20 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    copy: '<rect x="8" y="8" width="11" height="12" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 16V5a1.8 1.8 0 0 1 1.8-1.8H15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    paste: '<rect x="5" y="5" width="14" height="16" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="8.5" y="2.6" width="7" height="3.6" rx="1.2"/>',
    rename: '<path d="M4 16.5 15 5.5l3.5 3.5L7.5 20H4z"/><path d="M13 7.5 16.5 11" fill="none" stroke="#fff" stroke-width="1.3"/>',
    share: '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 11 15.9 7M8.1 13l7.8 4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    sort: '<path d="M7 5v14m0 0-3-3m3 3 3-3M17 19V5m0 0-3 3m3-3 3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    viewmode: '<rect x="3.5" y="4" width="7" height="7" rx="1.2"/><rect x="13.5" y="4" width="7" height="7" rx="1.2"/><rect x="3.5" y="13" width="7" height="7" rx="1.2"/><rect x="13.5" y="13" width="7" height="7" rx="1.2"/>',
    more: '<circle cx="5.5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18.5" cy="12" r="1.8"/>',
    chevron: '<path d="M8.5 5 15.5 12 8.5 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    add: '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };

  function svgIcon(name, cls) {
    return '<svg viewBox="0 0 24 24" class="' + (cls || 'ic') + '" aria-hidden="true" focusable="false">' +
      (ICONS[name] || ICONS.file) + '</svg>';
  }
  D.svgIcon = svgIcon;

  function iconFor(node) {
    if (node.type === 'dir') return 'folder';
    var n = node.name.toLowerCase();
    if (/\.(png|jpg|jpeg|gif|bmp|webp|svg)$/.test(n)) return 'image';
    if (/\.(xlsx|xls|csv)$/.test(n)) return 'sheet';
    if (/\.(docx|doc|odt|pdf|rtf)$/.test(n)) return 'doc';
    if (/\.(txt|md|log|ini)$/.test(n)) return 'notepad';
    if (/\.(mp3|wav|m4a|flac)$/.test(n)) return 'music';
    if (/\.(mp4|mov|avi|mkv)$/.test(n)) return 'video';
    return 'file';
  }

  /* Windows-11-style wallpapers: layered radial blooms rather than copied art. */
  var WALLPAPERS = {
    teal: 'radial-gradient(130% 110% at 62% 34%, #2b7bd6 0%, #1b50b8 28%, #10235f 62%, #060f33 100%), radial-gradient(60% 55% at 60% 40%, rgba(120,210,255,.45), rgba(120,210,255,0) 60%)',
    plum: 'radial-gradient(130% 110% at 60% 36%, #7a4bd0 0%, #4a2d9c 32%, #241452 68%, #120a2e 100%), radial-gradient(55% 50% at 58% 42%, rgba(210,160,255,.4), rgba(210,160,255,0) 62%)',
    clay: 'radial-gradient(130% 110% at 62% 34%, #e08a3c 0%, #b5541f 30%, #6e2f14 66%, #341307 100%), radial-gradient(55% 50% at 60% 40%, rgba(255,210,150,.4), rgba(255,210,150,0) 60%)',
    slate: 'radial-gradient(130% 110% at 60% 34%, #43607f 0%, #334155 30%, #1b2432 68%, #0b1018 100%), radial-gradient(55% 50% at 58% 42%, rgba(160,195,235,.3), rgba(160,195,235,0) 60%)',
    moss: 'radial-gradient(130% 110% at 62% 34%, #3f9d63 0%, #2f6b3f 30%, #1a3d24 66%, #0b1f12 100%), radial-gradient(55% 50% at 60% 40%, rgba(170,245,190,.38), rgba(170,245,190,0) 60%)'
  };

  var WALL_NAMES = { teal: 'Bloom', plum: 'Twilight', clay: 'Sunset', slate: 'Slate', moss: 'Meadow' };

  var APP_TITLES = {
    files: 'File Explorer', settings: 'Settings', editor: 'Notepad',
    recycle: 'Recycle Bin'
  };
  var APP_ICONS = { files: 'folder', settings: 'gear', editor: 'notepad', recycle: 'trash' };

  var PINNED = [
    { app: 'files', label: 'File Explorer', icon: 'folder' },
    { app: 'settings', label: 'Settings', icon: 'gear' },
    { app: 'editor', label: 'Notepad', icon: 'notepad' },
    { app: 'recycle', label: 'Recycle Bin', icon: 'trash' }
  ];

  /* File Explorer navigation tree — the real Windows 11 pane, with the folders
     that are always present even when the task only touches one of them. */
  var NAV_TREE = [
    { label: 'Home', path: 'home', icon: 'home', top: true },
    { label: 'Gallery', path: '/Pictures', icon: 'gallery', top: true },
    { label: 'OneDrive', path: '/Documents', icon: 'onedrive', top: true, cloud: true },
    { label: 'This PC', icon: 'pc', group: true, children: [
      { label: 'Desktop', path: '/Desktop', icon: 'display' },
      { label: 'Documents', path: '/Documents', icon: 'folder' },
      { label: 'Downloads', path: '/Downloads', icon: 'folder' },
      { label: 'Music', path: '/Music', icon: 'music' },
      { label: 'Pictures', path: '/Pictures', icon: 'image' },
      { label: 'Videos', path: '/Videos', icon: 'video' }
    ] },
    { label: 'Network', path: '/', icon: 'network', top: true }
  ];

  var QUICK_HOME = [
    { label: 'Desktop', path: '/Desktop', icon: 'display' },
    { label: 'Downloads', path: '/Downloads', icon: 'folder' },
    { label: 'Documents', path: '/Documents', icon: 'folder' },
    { label: 'Pictures', path: '/Pictures', icon: 'image' }
  ];

  /* ============================ instance ============================ */

  function OSSim(mount, setup) {
    setup = setup || {};
    this.mount = mount;
    this.flavour = setup.flavour || 'win11';
    var seed = setup.fs || {
      '/Desktop': null, '/Documents': null, '/Downloads': null,
      '/Music': null, '/Pictures': null, '/Videos': null
    };
    this.state = {
      kind: 'os',
      flavour: this.flavour,
      vfs: new D.VFS(seed),
      windows: [],
      nextId: 1,
      focus: null,
      start: false,
      quick: false,            // quick settings flyout (tray)
      power: 'on',
      clipboard: null,
      lastDialog: null,
      settings: Object.assign({
        wallpaper: 'teal', volume: 50, brightness: 70,
        wifi: null, theme: 'dark', notifications: true, nightlight: false, bluetooth: true
      }, setup.settings || {}),
      networks: setup.networks || [
        { ssid: 'RVNP-Staff', secure: true, strength: 4 },
        { ssid: 'RVNP-Trainees', secure: true, strength: 3 },
        { ssid: 'RVNP-Lab-5G', secure: true, strength: 4 },
        { ssid: 'Cafeteria-Free-WiFi', secure: false, strength: 2 }
      ],
      events: []
    };
    (setup.trash || []).forEach(function (p) { this.state.vfs.remove(p); }, this);
    this.state.vfs.log = [];

    this.ctxMenu = null;
    this.render();
    (setup.open || []).forEach(function (w) {
      this.openApp(w.app, w.data || { path: w.path, file: w.file });
    }, this);
    if (!(setup.open || []).length) this.update();
  }

  OSSim.prototype.fire = function (name, detail) {
    this.state.events.push({ name: name, detail: detail });
  };

  /* ---------------- window management ---------------- */

  OSSim.prototype.openApp = function (app, data) {
    var existing = this.state.windows.filter(function (w) { return w.app === app; })[0];
    if (existing && app !== 'editor') {
      if (data && data.path) existing.data.path = data.path;
      if (data && data.section) existing.data.section = data.section;
      existing.min = false;
      this.focusWindow(existing.id);
      return existing;
    }
    var n = this.state.windows.length;
    var W = this.root ? this.root.clientWidth : 1000;
    var H = this.root ? this.root.clientHeight : 560;
    var ww = Math.min(app === 'settings' ? 720 : 660, W - 40);
    var wh = Math.min(app === 'editor' ? 360 : 420, H - 90);
    var w = {
      id: this.state.nextId++,
      app: app,
      title: APP_TITLES[app] || app,
      x: Math.max(16, Math.round((W - ww) / 2) - 60 + n * 30),
      y: Math.max(14, Math.round((H - 48 - wh) / 2) - 30 + n * 26),
      w: ww, h: wh,
      min: false, max: false,
      data: Object.assign({ path: '/Documents', history: [], hidx: -1, sel: null, section: 'system', view: 'details' }, data || {})
    };
    if (app === 'files') { w.data.history = [w.data.path]; w.data.hidx = 0; }
    this.state.windows.push(w);
    this.state.focus = w.id;
    this.fire('open-app', app);
    this.update();
    return w;
  };

  OSSim.prototype.closeWindow = function (id) {
    this.state.windows = this.state.windows.filter(function (w) { return w.id !== id; });
    if (this.state.focus === id) {
      this.state.focus = this.state.windows.length ? this.state.windows[this.state.windows.length - 1].id : null;
    }
    this.fire('close-window', id);
    this.update();
  };

  OSSim.prototype.focusWindow = function (id) {
    var i = this.state.windows.findIndex(function (w) { return w.id === id; });
    if (i < 0) return;
    var w = this.state.windows.splice(i, 1)[0];
    this.state.windows.push(w);
    this.state.focus = id;
    this.update();
  };

  OSSim.prototype.win = function (id) {
    return this.state.windows.filter(function (w) { return w.id === id; })[0];
  };

  /* ---------------- dialogs ---------------- */

  OSSim.prototype.prompt = function (title, label, value, onOk) {
    var self = this;
    var input = el('input', { class: 'dl-input', type: 'text', value: value || '' });
    this.modal(title, [el('label', { class: 'dl-field' }, [el('span', { text: label }), input])], [
      { label: 'Cancel', kind: 'ghost' },
      { label: 'OK', kind: 'primary', action: function () { onOk(input.value.trim()); } }
    ]);
    setTimeout(function () { input.focus(); input.select(); }, 0);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { self.closeModal(); onOk(input.value.trim()); }
    });
  };

  OSSim.prototype.confirm = function (title, body, onOk) {
    this.modal(title, [el('p', { text: body })], [
      { label: 'No', kind: 'ghost' },
      { label: 'Yes', kind: 'primary', action: onOk }
    ]);
  };

  OSSim.prototype.modal = function (title, bodyNodes, buttons) {
    var self = this;
    this.closeModal();
    this.state.lastDialog = title;
    var box = el('div', { class: 'sim-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, [
      el('div', { class: 'sim-dialog-head', text: title }),
      el('div', { class: 'sim-dialog-body' }, bodyNodes),
      el('div', { class: 'sim-dialog-foot' }, buttons.map(function (b) {
        return el('button', {
          class: 'dl-btn ' + (b.kind === 'primary' ? 'dl-btn-primary' : 'dl-btn-ghost'),
          type: 'button',
          onclick: function () { self.closeModal(); if (b.action) b.action(); }
        }, [b.label]);
      }))
    ]);
    this.overlay = el('div', { class: 'sim-overlay' }, [box]);
    this.root.appendChild(this.overlay);
  };

  OSSim.prototype.closeModal = function () {
    if (this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    this.overlay = null;
  };

  /* ---------------- context menu ---------------- */

  OSSim.prototype.context = function (ev, entries, iconRow) {
    var self = this;
    ev.preventDefault();
    ev.stopPropagation();
    this.closeContext();
    this.fire('right-click', null);
    var kids = [];
    if (iconRow && iconRow.length) {
      kids.push(el('div', { class: 'sim-ctx-icons' }, iconRow.map(function (e) {
        return el('button', {
          class: 'sim-ctx-iconbtn', type: 'button', title: e.label, 'aria-label': e.label,
          disabled: e.disabled || false,
          onclick: function () { self.closeContext(); if (e.action) e.action(); },
          html: svgIcon(e.icon, 'ic')
        });
      })));
      kids.push(el('div', { class: 'sim-ctx-sep' }));
    }
    entries.forEach(function (e) {
      if (e === '-') { kids.push(el('div', { class: 'sim-ctx-sep' })); return; }
      var btn = el('button', {
        class: 'sim-ctx-item' + (e.disabled ? ' is-disabled' : ''),
        type: 'button', role: 'menuitem', disabled: e.disabled || false,
        onclick: function () { self.closeContext(); if (e.action) e.action(); }
      }, []);
      btn.innerHTML = (e.icon ? svgIcon(e.icon, 'ic') : '<span class="sim-ctx-gap"></span>') +
        '<span class="sim-ctx-label">' + D.esc(e.label) + '</span>' +
        (e.sub ? svgIcon('chevron', 'ic sim-ctx-chev') : '') +
        (e.accel ? '<em class="sim-ctx-accel">' + D.esc(e.accel) + '</em>' : '');
      kids.push(btn);
    });
    var menu = el('div', { class: 'sim-ctx', role: 'menu' }, kids);
    this.root.appendChild(menu);
    var r = this.root.getBoundingClientRect();
    var x = ev.clientX - r.left, y = ev.clientY - r.top;
    menu.style.left = Math.min(x, r.width - menu.offsetWidth - 8) + 'px';
    menu.style.top = Math.min(y, r.height - menu.offsetHeight - 8) + 'px';
    this.ctxMenu = menu;
  };

  OSSim.prototype.closeContext = function () {
    if (this.ctxMenu && this.ctxMenu.parentNode) this.ctxMenu.parentNode.removeChild(this.ctxMenu);
    this.ctxMenu = null;
  };

  /* ---------------- render ---------------- */

  OSSim.prototype.render = function () {
    var self = this;
    clear(this.mount);
    this.root = el('div', { class: 'sim-os flav-' + this.flavour, tabindex: '-1' });
    this.desktop = el('div', { class: 'sim-desktop' });
    this.winLayer = el('div', { class: 'sim-winlayer' });
    this.taskbar = el('div', { class: 'sim-taskbar' });
    this.root.appendChild(this.desktop);
    this.root.appendChild(this.winLayer);
    this.root.appendChild(this.taskbar);
    this.root.addEventListener('mousedown', function (e) {
      if (!e.target.closest('.sim-ctx')) self.closeContext();
      if (!e.target.closest('.sim-start') && !e.target.closest('[data-start]')) {
        if (self.state.start) { self.state.start = false; self.update(); }
      }
      if (!e.target.closest('.sim-quick') && !e.target.closest('[data-quick]')) {
        if (self.state.quick) { self.state.quick = false; self.update(); }
      }
    });
    this.mount.appendChild(this.root);
    this.update();
  };

  OSSim.prototype.update = function () {
    if (this.state.power !== 'on') { this.renderPowerScreen(); return; }
    if (!this.root.querySelector('.sim-desktop')) {
      this.root.appendChild(this.desktop);
      this.root.appendChild(this.winLayer);
      this.root.appendChild(this.taskbar);
    }
    this.renderDesktop();
    this.renderWindows();
    this.renderTaskbar();
  };

  OSSim.prototype.renderPowerScreen = function () {
    var s = this.state;
    clear(this.root);
    var msg = { shutdown: 'The computer has shut down.', restart: 'Restarting…', lock: 'Locked', sleep: 'Sleeping' }[s.power];
    var inner = [
      el('div', { class: 'sim-power-ic', html: svgIcon('power', 'ic ic-xl') }),
      el('p', { class: 'sim-power-msg', text: msg })
    ];
    if (s.power === 'lock') {
      inner = [
        el('div', { class: 'sim-lock-clock', text: '09:41' }),
        el('div', { class: 'sim-lock-date', text: 'Monday, 20 October' }),
        el('div', { class: 'sim-lock-user' }, [
          el('div', { class: 'sim-lock-avatar', html: svgIcon('person', 'ic ic-lg') }),
          el('div', { class: 'sim-lock-name', text: 'Trainee' }),
          el('div', { class: 'sim-lock-hint', text: 'Locked' })
        ])
      ];
    }
    this.root.appendChild(el('div', { class: 'sim-power-screen' + (s.power === 'lock' ? ' is-lock' : ''),
      style: s.power === 'lock' ? { background: WALLPAPERS[s.settings.wallpaper] || WALLPAPERS.teal } : {} }, inner));
  };

  OSSim.prototype.renderDesktop = function () {
    var self = this, s = this.state;
    clear(this.desktop);
    this.desktop.style.background = WALLPAPERS[s.settings.wallpaper] || WALLPAPERS.teal;
    this.desktop.style.filter = 'brightness(' + (0.55 + (s.settings.brightness / 100) * 0.6) + ')';

    var icons = el('div', { class: 'sim-deskicons' });
    var items = D.vfsSplit('/Desktop').length ? s.vfs.list('/Desktop') : [];
    var builtins = [
      { name: 'Recycle Bin', icon: 'trash', open: function () { self.openApp('recycle'); } },
      { name: 'This PC', icon: 'pc', open: function () { self.openApp('files', { path: '/' }); } }
    ];
    builtins.concat(items.map(function (n) {
      return {
        name: n.name, icon: iconFor(n), node: n, path: '/Desktop/' + n.name,
        open: function () {
          if (n.type === 'dir') self.openApp('files', { path: '/Desktop/' + n.name });
          else self.openApp('editor', { file: '/Desktop/' + n.name });
        }
      };
    })).forEach(function (it) {
      var node = el('button', {
        class: 'sim-deskicon', type: 'button',
        ondblclick: it.open,
        oncontextmenu: function (e) {
          if (!it.path) return self.context(e, [{ label: 'Open', action: it.open }]);
          self.context(e, [
            { label: 'Open', action: it.open },
            '-',
            { label: 'Rename', icon: 'rename', action: function () { self.doRename(it.path); } },
            { label: 'Delete', icon: 'trash', action: function () { s.vfs.remove(it.path); self.update(); } }
          ]);
        }
      }, []);
      node.innerHTML = '<span class="sim-deskicon-img">' + svgIcon(it.icon, 'ic ic-lg') + '</span><span>' + D.esc(it.name) + '</span>';
      icons.appendChild(node);
    });
    this.desktop.appendChild(icons);
    this.desktop.addEventListener('contextmenu', function (e) {
      if (e.target.closest('.sim-deskicon')) return;
      self.context(e, [
        { label: 'View', icon: 'viewmode', sub: true, action: function () {} },
        { label: 'Sort by', icon: 'sort', sub: true, action: function () {} },
        { label: 'Refresh', icon: 'refresh', action: function () { self.update(); } },
        '-',
        { label: 'New', icon: 'add', sub: true, action: function () {
          self.prompt('New folder', 'Folder name', 'New folder', function (name) {
            if (name) { s.vfs.mkdir('/Desktop', name); self.update(); }
          });
        } },
        { label: 'Paste', icon: 'paste', disabled: !s.clipboard, action: function () { self.doPaste('/Desktop'); } },
        '-',
        { label: 'Display settings', icon: 'display', action: function () { self.openApp('settings', { section: 'display' }); } },
        { label: 'Personalise', icon: 'image', action: function () { self.openApp('settings', { section: 'personalisation' }); } }
      ]);
    });
  };

  OSSim.prototype.renderTaskbar = function () {
    var self = this, s = this.state, win11 = this.flavour === 'win11';
    clear(this.taskbar);

    var startBtn = el('button', {
      class: 'sim-startbtn' + (s.start ? ' is-on' : ''), type: 'button', 'aria-label': 'Start', data: { start: '1' },
      onclick: function () { s.start = !s.start; s.quick = false; self.update(); },
      html: svgIcon('start', 'ic')
    });

    var searchPill = win11 ? el('button', {
      class: 'sim-tasksearch', type: 'button', data: { start: '1' },
      onclick: function () { s.start = true; self.update(); setTimeout(function () { var b = self.root.querySelector('.sim-startsearch'); if (b) b.focus(); }, 0); }
    }, [el('span', { class: 'sim-ts-ic', html: svgIcon('search', 'ic') }), el('span', { class: 'sim-ts-txt', text: 'Search' })]) : null;

    var tvBtn = el('button', { class: 'sim-tbico', type: 'button', 'aria-label': 'Task view', title: 'Task view', html: svgIcon('taskview', 'ic') });
    var wgBtn = win11 ? el('button', { class: 'sim-tbico', type: 'button', 'aria-label': 'Widgets', title: 'Widgets', html: svgIcon('widgets', 'ic') }) : null;

    /* pinned apps + running windows, merged like the real taskbar */
    var shown = {};
    var appBtns = [];
    PINNED.forEach(function (p) {
      var open = s.windows.filter(function (w) { return w.app === p.app; })[0];
      shown[p.app] = true;
      appBtns.push(self.taskButton(p.app, p.icon, open));
    });
    s.windows.forEach(function (w) {
      if (shown[w.app]) return;
      shown[w.app] = true;
      appBtns.push(self.taskButton(w.app, APP_ICONS[w.app] || 'file', w));
    });

    var left = el('div', { class: 'sim-tb-left' });
    if (!win11) { left.appendChild(startBtn); if (searchPill) left.appendChild(searchPill); }

    var center = el('div', { class: 'sim-tb-center' });
    if (win11) { center.appendChild(startBtn); center.appendChild(searchPill); center.appendChild(tvBtn); }
    else { center.appendChild(tvBtn); }
    appBtns.forEach(function (b) { center.appendChild(b); });

    var tray = el('div', { class: 'sim-tray' }, [
      wgBtn,
      el('button', {
        class: 'sim-sysbtn', type: 'button', 'aria-label': 'Network, sound and battery', data: { quick: '1' },
        onclick: function () { s.quick = !s.quick; s.start = false; self.update(); }
      }, [
        el('span', { class: s.settings.wifi ? 'is-on' : '', html: svgIcon('wifi', 'ic') }),
        el('span', { html: svgIcon(s.settings.volume === 0 ? 'speaker' : 'speaker', 'ic') }),
        el('span', { html: svgIcon('battery', 'ic') })
      ]),
      el('div', { class: 'sim-clock' }, [
        el('span', { class: 'sim-clock-time', text: '09:41' }),
        el('span', { class: 'sim-clock-date', text: '20/10/2026' })
      ])
    ]);

    this.taskbar.appendChild(left);
    this.taskbar.appendChild(center);
    this.taskbar.appendChild(tray);

    var oldS = this.root.querySelector('.sim-start'); if (oldS) oldS.parentNode.removeChild(oldS);
    var oldQ = this.root.querySelector('.sim-quick'); if (oldQ) oldQ.parentNode.removeChild(oldQ);
    if (s.start) this.root.appendChild(this.buildStartMenu());
    if (s.quick) this.root.appendChild(this.buildQuickSettings());
  };

  OSSim.prototype.taskButton = function (app, icon, w) {
    var self = this, s = this.state;
    var active = w && s.focus === w.id && !w.min;
    var b = el('button', {
      class: 'sim-tbapp' + (w ? ' is-open' : '') + (active ? ' is-active' : ''), type: 'button',
      title: APP_TITLES[app] || app,
      onclick: function () {
        if (!w) { self.openApp(app); return; }
        if (s.focus === w.id && !w.min) { w.min = true; self.update(); }
        else { w.min = false; self.focusWindow(w.id); }
      },
      html: svgIcon(icon, 'ic')
    });
    return b;
  };

  OSSim.prototype.buildQuickSettings = function () {
    var self = this, s = this.state;
    function toggle(label, icon, on, fn) {
      return el('button', { class: 'sim-qtile' + (on ? ' is-on' : ''), type: 'button',
        onclick: fn, html: svgIcon(icon, 'ic') + '<span>' + D.esc(label) + '</span>' });
    }
    var tiles = el('div', { class: 'sim-qtiles' }, [
      toggle(s.settings.wifi || 'Wi-Fi', 'wifi', !!s.settings.wifi, function () { self.openApp('settings', { section: 'network' }); s.quick = false; self.update(); }),
      toggle('Bluetooth', 'bluetooth', s.settings.bluetooth, function () { s.settings.bluetooth = !s.settings.bluetooth; self.update(); }),
      toggle('Night light', 'display', s.settings.nightlight, function () { s.settings.nightlight = !s.settings.nightlight; self.update(); }),
      toggle('Accessibility', 'access', false, function () { self.openApp('settings', { section: 'accessibility' }); s.quick = false; self.update(); })
    ]);
    var volRow = el('div', { class: 'sim-qslider' }, [
      el('span', { html: svgIcon('speaker', 'ic') }),
      (function () {
        var r = el('input', { class: 'dl-range', type: 'range', min: '0', max: '100', value: String(s.settings.volume) });
        r.addEventListener('input', function () { s.settings.volume = parseInt(r.value, 10); self.fire('volume', s.settings.volume); });
        return r;
      })()
    ]);
    var brRow = el('div', { class: 'sim-qslider' }, [
      el('span', { html: svgIcon('display', 'ic') }),
      (function () {
        var r = el('input', { class: 'dl-range', type: 'range', min: '0', max: '100', value: String(s.settings.brightness) });
        r.addEventListener('input', function () {
          s.settings.brightness = parseInt(r.value, 10);
          self.desktop.style.filter = 'brightness(' + (0.55 + (s.settings.brightness / 100) * 0.6) + ')';
          self.fire('brightness', s.settings.brightness);
        });
        return r;
      })()
    ]);
    var foot = el('div', { class: 'sim-qfoot' }, [
      el('span', { class: 'sim-qbatt', html: svgIcon('battery', 'ic') + '<span>86%</span>' }),
      el('button', { class: 'sim-qgear', type: 'button', 'aria-label': 'All settings',
        onclick: function () { self.openApp('settings'); s.quick = false; self.update(); }, html: svgIcon('gear', 'ic') })
    ]);
    return el('div', { class: 'sim-quick' }, [tiles, brRow, volRow, foot]);
  };

  OSSim.prototype.buildStartMenu = function () {
    var self = this, s = this.state;
    var searchBox = el('input', { class: 'dl-input sim-startsearch', type: 'search', placeholder: 'Search for apps, settings and documents' });
    var searchWrap = el('div', { class: 'sim-startsearchwrap' }, [el('span', { class: 'sim-startsearch-ic', html: svgIcon('search', 'ic') }), searchBox]);
    var resultWrap = el('div', { class: 'sim-startresults' });
    var mainWrap = el('div', { class: 'sim-startmain' });

    function renderResults() {
      clear(resultWrap);
      var q = searchBox.value.trim();
      if (!q) { resultWrap.style.display = 'none'; mainWrap.style.display = ''; return; }
      resultWrap.style.display = ''; mainWrap.style.display = 'none';
      var hits = s.vfs.find(q);
      self.fire('search', q);
      resultWrap.appendChild(el('div', { class: 'sim-start-label', text: 'Best match' }));
      if (!hits.length) { resultWrap.appendChild(el('p', { class: 'sim-empty', text: 'No results for "' + D.esc(q) + '"' })); return; }
      hits.slice(0, 10).forEach(function (h) {
        var b = el('button', {
          class: 'sim-startresult', type: 'button',
          onclick: function () {
            s.start = false;
            var parts = D.vfsSplit(h.path); parts.pop();
            if (h.node.type === 'dir') self.openApp('files', { path: h.path });
            else self.openApp('files', { path: D.vfsJoin(parts), sel: h.path });
          }
        }, []);
        b.innerHTML = svgIcon(iconFor(h.node), 'ic ic-md fi-' + iconFor(h.node)) + '<span class="sim-sr-name">' + D.esc(h.node.name) +
          '</span><em>' + D.esc(h.path.replace(/\//g, ' › ').replace(/^ › /, 'This PC › ')) + '</em>';
        resultWrap.appendChild(b);
      });
    }
    searchBox.addEventListener('input', renderResults);

    var pinnedHead = el('div', { class: 'sim-start-head' }, [
      el('span', { text: 'Pinned' }),
      el('button', { class: 'sim-start-all', type: 'button', html: 'All apps' + svgIcon('chevron', 'ic') })
    ]);
    var pinned = el('div', { class: 'sim-pinned' }, PINNED.concat([
      { app: 'files', label: 'Documents', icon: 'folder', path: '/Documents' },
      { app: 'files', label: 'Pictures', icon: 'image', path: '/Pictures' },
      { app: 'files', label: 'Downloads', icon: 'folder', path: '/Downloads' },
      { app: 'files', label: 'This PC', icon: 'pc', path: '/' }
    ]).map(function (p) {
      var b = el('button', {
        class: 'sim-pin', type: 'button',
        onclick: function () { s.start = false; self.openApp(p.app, p.path ? { path: p.path } : null); }
      }, []);
      b.innerHTML = svgIcon(p.icon, 'ic ic-lg') + '<span>' + D.esc(p.label) + '</span>';
      return b;
    }));

    /* Recommended — the section Windows 11 always shows, built from recent files */
    var recent = [];
    ['/Desktop', '/Documents', '/Downloads', '/Pictures'].forEach(function (dir) {
      s.vfs.list(dir).forEach(function (n) { if (n.type === 'file') recent.push({ node: n, path: dir + '/' + n.name }); });
    });
    recent = recent.slice(0, 6);
    var recHead = el('div', { class: 'sim-start-head' }, [
      el('span', { text: 'Recommended' }),
      el('button', { class: 'sim-start-all', type: 'button', html: 'More' + svgIcon('chevron', 'ic') })
    ]);
    var recGrid = el('div', { class: 'sim-recgrid' }, recent.length ? recent.map(function (r) {
      var b = el('button', { class: 'sim-recitem', type: 'button',
        onclick: function () {
          s.start = false;
          var parts = D.vfsSplit(r.path); parts.pop();
          self.openApp('files', { path: D.vfsJoin(parts), sel: r.path });
        } }, []);
      b.innerHTML = svgIcon(iconFor(r.node), 'ic ic-md fi-' + iconFor(r.node)) +
        '<span class="sim-rec-txt"><b>' + D.esc(r.node.name) + '</b><em>Recently added</em></span>';
      return b;
    }) : [el('p', { class: 'sim-empty', text: 'Your recent files will appear here' })]);

    mainWrap.appendChild(pinnedHead);
    mainWrap.appendChild(pinned);
    mainWrap.appendChild(recHead);
    mainWrap.appendChild(recGrid);
    resultWrap.style.display = 'none';

    var foot = el('div', { class: 'sim-start-foot' }, [
      el('button', { class: 'sim-user', type: 'button', 'aria-label': 'Account', title: 'Trainee',
        onclick: function () { s.start = false; self.openApp('settings', { section: 'accounts' }); } }, [
        el('span', { class: 'sim-user-av', html: svgIcon('person', 'ic') }),
        el('span', { text: 'Trainee' })
      ]),
      el('button', {
        class: 'sim-powerbtn', type: 'button', 'aria-label': 'Power',
        onclick: function (e) {
          self.context(e, [
            { label: 'Sleep', icon: 'power', action: function () { self.setPower('sleep'); } },
            { label: 'Shut down', icon: 'power', action: function () { self.setPower('shutdown'); } },
            { label: 'Restart', icon: 'refresh', action: function () { self.setPower('restart'); } },
            '-',
            { label: 'Lock', icon: 'privacy', action: function () { self.setPower('lock'); } },
            { label: 'Sign out', icon: 'person', action: function () { self.setPower('lock'); } }
          ]);
        },
        html: svgIcon('power', 'ic')
      })
    ]);

    return el('div', { class: 'sim-start' }, [searchWrap, resultWrap, mainWrap, foot]);
  };

  OSSim.prototype.setPower = function (mode) {
    this.state.power = mode;
    this.state.start = false;
    this.state.quick = false;
    this.fire('power', mode);
    this.update();
  };

  /* ---------------- windows ---------------- */

  OSSim.prototype.renderWindows = function () {
    var self = this, s = this.state;
    clear(this.winLayer);
    s.windows.forEach(function (w) {
      if (w.min) return;
      var node = el('div', {
        class: 'sim-window' + (s.focus === w.id ? ' is-focused' : '') + (w.max ? ' is-max' : '') + ' app-' + w.app,
        style: w.max ? {} : { left: w.x + 'px', top: w.y + 'px', width: w.w + 'px', height: w.h + 'px' },
        onmousedown: function () { if (s.focus !== w.id) self.focusWindow(w.id); }
      });

      var title = el('div', { class: 'sim-titlebar' }, [
        el('span', { class: 'sim-wtitle', html: svgIcon(APP_ICONS[w.app] || 'file', 'ic') + '<b>' + D.esc(w.title) + '</b>' }),
        el('div', { class: 'sim-wctrls' }, [
          el('button', { class: 'sim-wbtn', type: 'button', 'aria-label': 'Minimise',
            html: '<svg viewBox="0 0 12 12" class="wcico"><path d="M2.5 6h7" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
            onclick: function () { w.min = true; self.fire('minimise', w.app); self.update(); } }),
          el('button', { class: 'sim-wbtn', type: 'button', 'aria-label': w.max ? 'Restore' : 'Maximise',
            html: w.max
              ? '<svg viewBox="0 0 12 12" class="wcico"><rect x="3" y="2" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><rect x="2" y="3" width="6" height="6" rx="1" fill="#e9edf3" stroke="currentColor" stroke-width="1"/></svg>'
              : '<svg viewBox="0 0 12 12" class="wcico"><rect x="2.5" y="2.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
            onclick: function () { w.max = !w.max; self.fire('maximise', w.app); self.update(); } }),
          el('button', { class: 'sim-wbtn sim-wclose', type: 'button', 'aria-label': 'Close',
            html: '<svg viewBox="0 0 12 12" class="wcico"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
            onclick: function () { self.closeWindow(w.id); } })
        ])
      ]);
      self.makeDraggable(title, node, w);
      node.appendChild(title);

      var body = el('div', { class: 'sim-wbody' });
      if (w.app === 'files') self.renderFiles(body, w);
      else if (w.app === 'settings') self.renderSettings(body, w);
      else if (w.app === 'editor') self.renderEditor(body, w);
      else if (w.app === 'recycle') self.renderRecycle(body, w);
      node.appendChild(body);
      self.winLayer.appendChild(node);
    });
  };

  OSSim.prototype.makeDraggable = function (handle, node, w) {
    var self = this, dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    handle.addEventListener('mousedown', function (e) {
      if (e.target.closest('.sim-wbtn') || w.max) return;
      dragging = true; sx = e.clientX; sy = e.clientY; ox = w.x; oy = w.y;
      e.preventDefault();
    });
    handle.addEventListener('dblclick', function (e) {
      if (e.target.closest('.sim-wbtn')) return;
      w.max = !w.max; self.fire('maximise', w.app); self.update();
    });
    function move(e) {
      if (!dragging) return;
      w.x = Math.max(0, ox + e.clientX - sx);
      w.y = Math.max(0, oy + e.clientY - sy);
      node.style.left = w.x + 'px';
      node.style.top = w.y + 'px';
    }
    function up() { if (dragging) { dragging = false; self.fire('move-window', w.app); } }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    (this._cleanup = this._cleanup || []).push(function () {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    });
  };

  /* ---------------- File Explorer ---------------- */

  OSSim.prototype.navigate = function (w, path) {
    w.data.path = path;
    w.data.sel = null;
    w.data.query = '';
    w.data.history = w.data.history.slice(0, w.data.hidx + 1);
    w.data.history.push(path);
    w.data.hidx = w.data.history.length - 1;
    this.fire('navigate', path);
    this.update();
  };

  OSSim.prototype.doRename = function (path) {
    var self = this, parts = D.vfsSplit(path), name = parts[parts.length - 1];
    this.prompt('Rename', 'New name', name, function (v) {
      if (v) { self.state.vfs.rename(path, v); self.update(); }
    });
  };

  OSSim.prototype.doPaste = function (destDir) {
    var cb = this.state.clipboard;
    if (!cb) return;
    if (cb.mode === 'copy') this.state.vfs.copy(cb.path, destDir);
    else { this.state.vfs.move(cb.path, destDir); this.state.clipboard = null; }
    this.update();
  };

  function crumbLabel(path) {
    if (path === 'home' ) return 'Home';
    if (path === '/') return 'This PC';
    return 'This PC' + path.replace(/\//g, ' › ');
  }

  OSSim.prototype.renderFiles = function (body, w) {
    var self = this, s = this.state, path = w.data.path;
    body.classList.add('app-files');

    /* ---- command bar (Windows 11 single row) ---- */
    function cmd(label, icon, disabled, fn, cls) {
      var b = el('button', { class: 'sim-cmd ' + (cls || '') , type: 'button', disabled: !!disabled, onclick: fn, title: label, 'aria-label': label });
      b.innerHTML = svgIcon(icon, 'ic') + (cls === 'has-text' ? '<span>' + D.esc(label) + '</span>' : '') + (cls === 'has-text' ? svgIcon('chevron', 'ic chev') : '');
      return b;
    }
    var newBtn = el('button', { class: 'sim-cmd has-text sim-cmd-new', type: 'button' }, []);
    newBtn.innerHTML = svgIcon('add', 'ic') + '<span>New</span>' + svgIcon('chevron', 'ic chev');
    newBtn.addEventListener('click', function (e) {
      self.context(e, [
        { label: 'Folder', icon: 'folder', action: function () {
          self.prompt('New folder', 'Folder name', 'New folder', function (name) { if (name) { s.vfs.mkdir(path, name); self.update(); } });
        } },
        { label: 'Text Document', icon: 'notepad', action: function () {
          self.prompt('New text document', 'File name', 'New Text Document.txt', function (name) { if (name) { s.vfs.touch(path, name, ''); self.update(); } });
        } }
      ]);
    });

    var cmdbar = el('div', { class: 'sim-cmdbar' }, [
      newBtn,
      el('span', { class: 'sim-cmd-sep' }),
      cmd('Cut', 'cut', !w.data.sel, function () { s.clipboard = { mode: 'cut', path: w.data.sel }; self.update(); }),
      cmd('Copy', 'copy', !w.data.sel, function () { s.clipboard = { mode: 'copy', path: w.data.sel }; self.update(); }),
      cmd('Paste', 'paste', !s.clipboard, function () { self.doPaste(path); }),
      cmd('Rename', 'rename', !w.data.sel, function () { self.doRename(w.data.sel); }),
      cmd('Share', 'share', !w.data.sel, function () {}),
      cmd('Delete', 'trash', !w.data.sel, function () { s.vfs.remove(w.data.sel); w.data.sel = null; self.update(); }),
      el('span', { class: 'sim-cmd-sep' }),
      (function () { var b = el('button', { class: 'sim-cmd has-text', type: 'button' }); b.innerHTML = svgIcon('sort', 'ic') + '<span>Sort</span>' + svgIcon('chevron', 'ic chev'); return b; })(),
      (function () { var b = el('button', { class: 'sim-cmd has-text', type: 'button' }); b.innerHTML = svgIcon('viewmode', 'ic') + '<span>View</span>' + svgIcon('chevron', 'ic chev'); return b; })(),
      el('span', { class: 'sim-cmd-spring' }),
      cmd('See more', 'more', false, function () {})
    ]);

    /* ---- address / navigation row ---- */
    var search = el('input', {
      class: 'dl-input sim-filesearch', type: 'search',
      placeholder: 'Search ' + (path === 'home' ? 'Home' : (D.vfsSplit(path).pop() || 'This PC')),
      value: w.data.query || ''
    });
    search.addEventListener('input', function () {
      w.data.query = search.value;
      self.fire('search', search.value);
      renderList();
    });

    var crumbs = crumbLabel(path).split(' › ');
    var crumbBar = el('div', { class: 'sim-crumbs' }, crumbs.map(function (c, i) {
      return el('span', { class: 'sim-crumb', text: c + (i < crumbs.length - 1 ? '  ›' : '') });
    }));

    var nav = el('div', { class: 'sim-filesnav' }, [
      el('button', { class: 'sim-navbtn', type: 'button', 'aria-label': 'Back', disabled: w.data.hidx <= 0,
        html: svgIcon('back', 'ic'),
        onclick: function () { w.data.hidx--; w.data.path = w.data.history[w.data.hidx]; self.update(); } }),
      el('button', { class: 'sim-navbtn', type: 'button', 'aria-label': 'Forward', disabled: w.data.hidx >= w.data.history.length - 1,
        html: svgIcon('fwd', 'ic'),
        onclick: function () { w.data.hidx++; w.data.path = w.data.history[w.data.hidx]; self.update(); } }),
      el('button', { class: 'sim-navbtn', type: 'button', 'aria-label': 'Up to', disabled: path === '/' || path === 'home',
        html: svgIcon('up', 'ic'),
        onclick: function () { var p = D.vfsSplit(path); p.pop(); self.navigate(w, p.length ? D.vfsJoin(p) : '/'); } }),
      el('div', { class: 'sim-addrbox' }, [crumbBar]),
      search
    ]);

    /* ---- navigation tree (the full Windows 11 pane) ---- */
    var side = el('div', { class: 'sim-side' });
    NAV_TREE.forEach(function (entry) {
      if (entry.group) {
        var head = el('button', { class: 'sim-sidegroup', type: 'button',
          onclick: function () { self.navigate(w, '/'); } }, []);
        head.innerHTML = svgIcon('chevron', 'ic sim-side-chev') + svgIcon(entry.icon, 'ic') + '<span>' + D.esc(entry.label) + '</span>';
        side.appendChild(head);
        entry.children.forEach(function (c) {
          var b = el('button', { class: 'sim-sideitem is-child' + (path === c.path ? ' is-active' : ''), type: 'button',
            onclick: function () { self.navigate(w, c.path); } }, []);
          b.innerHTML = svgIcon(c.icon, 'ic') + '<span>' + D.esc(c.label) + '</span>';
          side.appendChild(b);
        });
      } else {
        var b2 = el('button', { class: 'sim-sideitem' + (entry.cloud ? ' is-cloud' : '') + (path === entry.path && entry.top ? '' : (path === entry.path ? ' is-active' : '')), type: 'button',
          onclick: function () { self.navigate(w, entry.path === 'home' ? 'home' : entry.path); } }, []);
        b2.innerHTML = svgIcon(entry.icon, 'ic') + '<span>' + D.esc(entry.label) + '</span>';
        side.appendChild(b2);
      }
    });

    /* ---- main list ---- */
    var list = el('div', { class: 'sim-filelist view-' + (w.data.view || 'details') });

    function openHomeView() {
      list.classList.add('is-home');
      list.appendChild(el('div', { class: 'sim-home-sec', text: 'Quick access' }));
      var qa = el('div', { class: 'sim-qa' }, QUICK_HOME.map(function (q) {
        var b = el('button', { class: 'sim-qacard', type: 'button', ondblclick: function () { self.navigate(w, q.path); },
          onclick: function () {} }, []);
        b.innerHTML = svgIcon(q.icon, 'ic ic-md fi-' + q.icon) + '<span class="sim-fname">' + D.esc(q.label) +
          '</span><span class="sim-fmeta">Pinned</span>';
        b.addEventListener('dblclick', function () { self.navigate(w, q.path); });
        return b;
      }));
      list.appendChild(qa);
      list.appendChild(el('div', { class: 'sim-home-sec', text: 'Recent' }));
      var recent = [];
      ['/Desktop', '/Documents', '/Downloads', '/Pictures'].forEach(function (dir) {
        s.vfs.list(dir).forEach(function (n) { if (n.type === 'file') recent.push({ node: n, path: dir + '/' + n.name, dir: dir }); });
      });
      if (!recent.length) { list.appendChild(el('p', { class: 'sim-empty', text: 'No recent files' })); return; }
      var head = el('div', { class: 'sim-list-head' }, [
        el('span', {}), el('span', { text: 'Name' }), el('span', { text: 'Location' }), el('span', { text: 'Type' })
      ]);
      list.appendChild(head);
      recent.slice(0, 12).forEach(function (r) {
        var row = el('div', { class: 'sim-fileitem', ondblclick: function () { self.openApp('editor', { file: r.path }); } }, []);
        row.innerHTML = svgIcon(iconFor(r.node), 'ic ic-md fi-' + iconFor(r.node)) +
          '<span class="sim-fname">' + D.esc(r.node.name) + '</span>' +
          '<span class="sim-fcol">' + D.esc('This PC' + r.dir.replace(/\//g, ' › ')) + '</span>' +
          '<span class="sim-fcol">' + fileType(r.node) + '</span>';
        row.addEventListener('dblclick', function () { self.openApp('editor', { file: r.path }); });
        list.appendChild(row);
      });
    }

    function fileType(node) {
      if (node.type === 'dir') return 'File folder';
      var ext = (node.name.split('.').pop() || '').toUpperCase();
      return ext ? ext + ' File' : 'File';
    }

    function renderList() {
      clear(list);
      list.className = 'sim-filelist view-' + (w.data.view || 'details');
      if (path === 'home' && !w.data.query) { openHomeView(); return; }

      var entries;
      if (w.data.query) {
        entries = s.vfs.find(w.data.query, (path === '/' || path === 'home') ? '/' : path).map(function (h) {
          return { node: h.node, path: h.path };
        });
      } else {
        entries = s.vfs.list(path).map(function (n) {
          return { node: n, path: (path === '/' ? '' : path) + '/' + n.name };
        });
      }
      if (!entries.length) {
        list.appendChild(el('div', { class: 'sim-empty-box' }, [
          el('div', { class: 'sim-empty-ic', html: svgIcon('folderOpen', 'ic ic-xl') }),
          el('p', { class: 'sim-empty', text: w.data.query ? 'No items match your search' : 'This folder is empty' })
        ]));
        return;
      }

      var head = el('div', { class: 'sim-list-head' }, [
        el('span', {}),
        el('span', { text: 'Name' }),
        el('span', { text: 'Date modified' }),
        el('span', { text: 'Type' }),
        el('span', { text: 'Size' })
      ]);
      list.appendChild(head);

      entries.forEach(function (e) {
        var row = el('div', {
          class: 'sim-fileitem' + (w.data.sel === e.path ? ' is-sel' : ''),
          tabindex: '0',
          onclick: function () { w.data.sel = e.path; self.update(); },
          ondblclick: function () {
            if (e.node.type === 'dir') self.navigate(w, e.path);
            else self.openApp('editor', { file: e.path });
          },
          oncontextmenu: function (ev) {
            w.data.sel = e.path;
            self.context(ev, [
              { label: 'Open', action: function () {
                if (e.node.type === 'dir') self.navigate(w, e.path);
                else self.openApp('editor', { file: e.path });
              } },
              { label: 'Open with', sub: true, action: function () { self.openApp('editor', { file: e.path }); } },
              '-',
              { label: 'Copy path', action: function () {} },
              '-',
              { label: 'Rename', icon: 'rename', accel: 'F2', action: function () { self.doRename(e.path); } },
              { label: 'Delete', icon: 'trash', accel: 'Del', action: function () { s.vfs.remove(e.path); w.data.sel = null; self.update(); } },
              '-',
              { label: 'Properties', action: function () {} },
              { label: 'Show more options', action: function () {} }
            ], [
              { label: 'Cut', icon: 'cut', action: function () { s.clipboard = { mode: 'cut', path: e.path }; self.update(); } },
              { label: 'Copy', icon: 'copy', action: function () { s.clipboard = { mode: 'copy', path: e.path }; self.update(); } },
              { label: 'Rename', icon: 'rename', action: function () { self.doRename(e.path); } },
              { label: 'Share', icon: 'share', action: function () {} },
              { label: 'Delete', icon: 'trash', action: function () { s.vfs.remove(e.path); w.data.sel = null; self.update(); } }
            ]);
          }
        }, []);
        row.innerHTML = svgIcon(iconFor(e.node), 'ic ic-md fi-' + iconFor(e.node)) +
          '<span class="sim-fname">' + D.esc(e.node.name) + '</span>' +
          '<span class="sim-fcol">' + D.esc(e.node.modified || '01/09/2026 09:00') + '</span>' +
          '<span class="sim-fcol">' + fileType(e.node) + '</span>' +
          '<span class="sim-fcol sim-fsize">' + (e.node.type === 'dir' ? '' : fmtSize(e.node.size)) + '</span>';
        list.appendChild(row);
      });
    }

    function fmtSize(bytes) {
      bytes = bytes || 0;
      if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    }

    list.addEventListener('contextmenu', function (ev) {
      if (ev.target.closest('.sim-fileitem')) return;
      if (path === 'home') return;
      self.context(ev, [
        { label: 'View', icon: 'viewmode', sub: true, action: function () {} },
        { label: 'Sort by', icon: 'sort', sub: true, action: function () {} },
        { label: 'Refresh', icon: 'refresh', action: function () { self.update(); } },
        '-',
        { label: 'New', icon: 'add', sub: true, action: function () {
          self.prompt('New folder', 'Folder name', 'New folder', function (name) { if (name) { s.vfs.mkdir(path, name); self.update(); } });
        } },
        { label: 'Paste', icon: 'paste', disabled: !s.clipboard, action: function () { self.doPaste(path); } }
      ]);
    });
    renderList();

    body.appendChild(cmdbar);
    body.appendChild(nav);
    body.appendChild(el('div', { class: 'sim-filesmain' }, [side, el('div', { class: 'sim-filesright' }, [list])]));
    var count = (path === 'home') ? 0 : s.vfs.list(path).length;
    body.appendChild(el('div', { class: 'sim-status' }, [
      el('span', { text: (path === 'home' ? '' : count + ' item' + (count === 1 ? '' : 's')) }),
      w.data.sel ? el('span', { text: '1 item selected' }) : null,
      s.clipboard ? el('span', { class: 'sim-status-clip', text: 'Clipboard: ' + s.clipboard.mode + ' ' + (D.vfsSplit(s.clipboard.path).pop()) }) : null
    ]));
  };

  /* ---------------- Recycle Bin ---------------- */

  OSSim.prototype.renderRecycle = function (body, w) {
    var self = this, s = this.state;
    body.classList.add('app-files', 'app-recycle');

    var cmdbar = el('div', { class: 'sim-cmdbar' }, [
      (function () {
        var b = el('button', { class: 'sim-cmd has-text', type: 'button', disabled: w.data.sel === null || w.data.sel === undefined,
          onclick: function () { s.vfs.restore(w.data.sel); w.data.sel = null; self.update(); } });
        b.innerHTML = svgIcon('up', 'ic') + '<span>Restore the selected items</span>';
        return b;
      })(),
      el('span', { class: 'sim-cmd-sep' }),
      (function () {
        var b = el('button', { class: 'sim-cmd has-text', type: 'button', disabled: !s.vfs.trash.length,
          onclick: function () { self.confirm('Empty Recycle Bin', 'Permanently delete all items?', function () { s.vfs.emptyTrash(); self.update(); }); } });
        b.innerHTML = svgIcon('trash', 'ic') + '<span>Empty Recycle Bin</span>';
        return b;
      })()
    ]);

    var nav = el('div', { class: 'sim-filesnav' }, [
      el('span', { class: 'sim-navbtn is-off', html: svgIcon('back', 'ic') }),
      el('span', { class: 'sim-navbtn is-off', html: svgIcon('fwd', 'ic') }),
      el('span', { class: 'sim-navbtn is-off', html: svgIcon('up', 'ic') }),
      el('div', { class: 'sim-addrbox' }, [el('div', { class: 'sim-crumbs' }, [el('span', { class: 'sim-crumb', html: svgIcon('trash', 'ic') }), el('span', { class: 'sim-crumb', text: 'Recycle Bin' })])])
    ]);

    var list = el('div', { class: 'sim-filelist view-details' });
    if (!s.vfs.trash.length) {
      list.appendChild(el('div', { class: 'sim-empty-box' }, [
        el('div', { class: 'sim-empty-ic', html: svgIcon('trash', 'ic ic-xl') }),
        el('p', { class: 'sim-empty', text: 'Recycle Bin is empty' })
      ]));
    } else {
      list.appendChild(el('div', { class: 'sim-list-head' }, [
        el('span', {}), el('span', { text: 'Name' }), el('span', { text: 'Original location' }), el('span', { text: 'Date deleted' }), el('span', { text: '' })
      ]));
      s.vfs.trash.forEach(function (t, i) {
        var row = el('div', {
          class: 'sim-fileitem' + (w.data.sel === i ? ' is-sel' : ''),
          onclick: function () { w.data.sel = i; self.update(); },
          oncontextmenu: function (ev) {
            w.data.sel = i;
            self.context(ev, [{ label: 'Restore', icon: 'up', action: function () { s.vfs.restore(i); w.data.sel = null; self.update(); } }]);
          }
        }, []);
        row.innerHTML = svgIcon(iconFor(t.node), 'ic ic-md fi-' + iconFor(t.node)) +
          '<span class="sim-fname">' + D.esc(t.node.name) + '</span>' +
          '<span class="sim-fcol">' + D.esc('This PC' + (t.fromPath || '').replace(/\//g, ' › ')) + '</span>' +
          '<span class="sim-fcol">' + D.esc(t.deletedAt || '') + '</span><span class="sim-fcol"></span>';
        list.appendChild(row);
      });
    }

    body.appendChild(cmdbar);
    body.appendChild(nav);
    body.appendChild(el('div', { class: 'sim-filesmain' }, [
      el('div', { class: 'sim-side' }, [
        (function () { var b = el('button', { class: 'sim-sideitem', type: 'button', onclick: function () { self.openApp('files', { path: 'home' }); } }); b.innerHTML = svgIcon('home', 'ic') + '<span>Home</span>'; return b; })(),
        (function () { var b = el('button', { class: 'sim-sideitem is-active', type: 'button' }); b.innerHTML = svgIcon('trash', 'ic') + '<span>Recycle Bin</span>'; return b; })()
      ]),
      el('div', { class: 'sim-filesright' }, [list])
    ]));
    body.appendChild(el('div', { class: 'sim-status' }, [el('span', { text: s.vfs.trash.length + ' item' + (s.vfs.trash.length === 1 ? '' : 's') })]));
  };

  /* ---------------- Notepad ---------------- */

  OSSim.prototype.renderEditor = function (body, w) {
    var self = this, s = this.state;
    body.classList.add('app-editor');
    var filePath = w.data.file || null;
    var node = filePath ? s.vfs.get(filePath) : null;
    w.title = 'Notepad' + (node ? ' — ' + node.name : '');

    var area = el('textarea', { class: 'sim-editor', spellcheck: 'false', placeholder: '' });
    area.value = node ? node.content : (w.data.draft || '');
    area.addEventListener('input', function () {
      w.data.draft = area.value;
      if (node) { node.content = area.value; node.size = Math.max(1, area.value.length); }
    });

    function saveAs() {
      self.prompt('Save As', 'File name', (node && node.name) || 'Untitled.txt', function (name) {
        if (!name) return;
        var dest = w.data.saveDir || '/Documents';
        var created = s.vfs.touch(dest, name, area.value);
        if (created) { w.data.file = dest + '/' + created.name; self.update(); }
      });
    }

    var menubar = el('div', { class: 'sim-np-menu' }, ['File', 'Edit', 'View'].map(function (m, i) {
      return el('button', { class: 'sim-np-mi', type: 'button', onclick: i === 0 ? function (e) {
        self.context(e, [
          { label: 'New', action: function () { w.data.file = null; w.data.draft = ''; self.update(); } },
          { label: 'Save', accel: 'Ctrl+S', action: function () { if (filePath) { s.vfs.write(filePath, area.value); self.fire('save', filePath); self.update(); } else saveAs(); } },
          { label: 'Save as', action: saveAs }
        ]);
      } : null }, [m]);
    }));

    var toolbar = el('div', { class: 'sim-toolbar sim-np-tb' }, [
      el('button', { class: 'sim-tbtn', type: 'button', text: 'Save',
        onclick: function () { if (filePath) { s.vfs.write(filePath, area.value); self.fire('save', filePath); self.update(); } else saveAs(); } }),
      el('button', { class: 'sim-tbtn', type: 'button', text: 'Save as', onclick: saveAs })
    ]);

    body.appendChild(menubar);
    body.appendChild(toolbar);
    body.appendChild(area);
    body.appendChild(el('div', { class: 'sim-np-status' }, [
      el('span', { text: node ? (node.content || '').length + ' characters' : (area.value.length + ' characters') }),
      el('span', { text: 'UTF-8' }),
      el('span', { text: '100%' })
    ]));
  };

  /* ---------------- Settings ---------------- */

  /* Resolve a deep-link id (which may be a page like 'sound') to {cat, page}. */
  function resolveSection(id) {
    switch (id) {
      case 'display': return { cat: 'system', page: 'display' };
      case 'sound': return { cat: 'system', page: 'sound' };
      case 'power': return { cat: 'system', page: 'power' };
      case 'personalization':
      case 'personalisation': return { cat: 'personalisation', page: null };
      case 'network': return { cat: 'network', page: null };
      case 'accounts': return { cat: 'accounts', page: null };
      case 'bluetooth': return { cat: 'bluetooth', page: null };
      case 'apps': return { cat: 'apps', page: null };
      case 'time': return { cat: 'time', page: null };
      case 'gaming': return { cat: 'gaming', page: null };
      case 'accessibility': return { cat: 'accessibility', page: null };
      case 'privacy': return { cat: 'privacy', page: null };
      case 'update': return { cat: 'update', page: null };
      default: return { cat: 'system', page: null };
    }
  }

  OSSim.prototype.renderSettings = function (body, w) {
    var self = this, s = this.state;
    body.classList.add('app-settings');
    var resolved = resolveSection(w.data.section || 'system');
    var cat = resolved.cat, page = w.data.page || resolved.page;

    var CATS = [
      { id: 'system', label: 'System', icon: 'pc' },
      { id: 'bluetooth', label: 'Bluetooth & devices', icon: 'bluetooth' },
      { id: 'network', label: 'Network & internet', icon: 'wifi' },
      { id: 'personalisation', label: 'Personalisation', icon: 'image' },
      { id: 'apps', label: 'Apps', icon: 'apps' },
      { id: 'accounts', label: 'Accounts', icon: 'person' },
      { id: 'time', label: 'Time & language', icon: 'clock' },
      { id: 'gaming', label: 'Gaming', icon: 'gaming' },
      { id: 'accessibility', label: 'Accessibility', icon: 'access' },
      { id: 'privacy', label: 'Privacy & security', icon: 'privacy' },
      { id: 'update', label: 'Windows Update', icon: 'update' }
    ];

    var railTop = el('div', { class: 'sim-set-acct' }, [
      el('span', { class: 'sim-set-av', html: svgIcon('person', 'ic ic-md') }),
      el('span', { class: 'sim-set-acctxt', html: '<b>Trainee</b><em>trainee@rvnp.ac.ke</em>' })
    ]);
    var railSearch = el('div', { class: 'sim-set-search' }, [
      el('span', { html: svgIcon('search', 'ic') }),
      el('input', { class: 'dl-input', type: 'search', placeholder: 'Find a setting' })
    ]);
    var rail = el('div', { class: 'sim-set-rail' }, [railTop, railSearch].concat(CATS.map(function (c) {
      var b = el('button', { class: 'sim-set-cat' + (cat === c.id ? ' is-active' : ''), type: 'button',
        onclick: function () { w.data.section = c.id; w.data.page = null; self.update(); } }, []);
      b.innerHTML = svgIcon(c.icon, 'ic') + '<span>' + D.esc(c.label) + '</span>';
      return b;
    })));

    var pane = el('div', { class: 'sim-settingspane' });

    function h1(t) { return el('h2', { class: 'sim-set-h1', text: t }); }
    function card(children) { return el('div', { class: 'sim-set-card' }, children); }
    function navcard(icon, title, sub, onclick, right) {
      var b = el('button', { class: 'sim-set-navcard', type: 'button', onclick: onclick }, []);
      b.innerHTML = '<span class="sim-set-nc-ic">' + svgIcon(icon, 'ic ic-md') + '</span>' +
        '<span class="sim-set-nc-txt"><b>' + D.esc(title) + '</b><em>' + D.esc(sub) + '</em></span>' +
        '<span class="sim-set-nc-right">' + (right ? D.esc(right) + ' ' : '') + svgIcon('chevron', 'ic') + '</span>';
      return b;
    }
    function toggleRow(title, sub, on, fn) {
      var sw = el('button', { class: 'sim-switch' + (on ? ' is-on' : ''), type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false',
        onclick: fn, html: '<span class="sim-switch-knob"></span>' });
      return el('div', { class: 'sim-set-togrow' }, [
        el('span', { class: 'sim-set-tt', html: '<b>' + D.esc(title) + '</b>' + (sub ? '<em>' + D.esc(sub) + '</em>' : '') }),
        sw
      ]);
    }
    function slider(label, value, onchange, unit) {
      var out = el('output', { text: value + (unit || '%') });
      var inp = el('input', { class: 'dl-range', type: 'range', min: '0', max: '100', value: String(value) });
      inp.addEventListener('input', function () { out.textContent = inp.value + (unit || '%'); onchange(parseInt(inp.value, 10)); });
      return el('div', { class: 'sim-setrow' }, [el('label', { text: label }), inp, out]);
    }
    function breadcrumb(parent, onBack) {
      return el('div', { class: 'sim-set-crumb' }, [
        el('button', { class: 'sim-set-back', type: 'button', html: svgIcon('back', 'ic'), onclick: onBack }),
        el('span', { text: parent })
      ]);
    }

    /* ---- SYSTEM ---- */
    if (cat === 'system' && !page) {
      pane.appendChild(h1('System'));
      pane.appendChild(el('div', { class: 'sim-set-devbanner' }, [
        el('span', { class: 'sim-set-dev-ic', html: svgIcon('pc', 'ic ic-lg') }),
        el('span', { html: '<b>Trainee Workstation</b><em>Windows 11 Pro · 23H2</em>' })
      ]));
      pane.appendChild(navcard('display', 'Display', 'Monitors, brightness, night light, display profile', function () { w.data.page = 'display'; self.update(); }));
      pane.appendChild(navcard('speaker', 'Sound', 'Volume levels, output, input, sound devices', function () { w.data.page = 'sound'; self.update(); }));
      pane.appendChild(navcard('wifi', 'Notifications', 'Alerts from apps and system, do not disturb', function () {}));
      pane.appendChild(navcard('battery', 'Power', 'Sleep, battery usage, power mode', function () { w.data.page = 'power'; self.update(); }));
      pane.appendChild(navcard('pc', 'Storage', 'Storage space, drives, cleanup recommendations', function () {}));
      pane.appendChild(navcard('update', 'About', 'Device specifications, rename this PC', function () {}));
    } else if (cat === 'system' && page === 'display') {
      pane.appendChild(breadcrumb('System', function () { w.data.page = null; self.update(); }));
      pane.appendChild(h1('Display'));
      pane.appendChild(card([
        el('p', { class: 'sim-set-sub', text: 'Brightness & colour' }),
        slider('Brightness', s.settings.brightness, function (v) {
          s.settings.brightness = v;
          self.desktop.style.filter = 'brightness(' + (0.55 + (v / 100) * 0.6) + ')';
          self.fire('brightness', v);
        }),
        toggleRow('Night light', 'Warmer colours to help you sleep', s.settings.nightlight, function () { s.settings.nightlight = !s.settings.nightlight; self.update(); })
      ]));
      pane.appendChild(card([
        el('p', { class: 'sim-set-sub', text: 'Scale & layout' }),
        el('div', { class: 'sim-set-togrow' }, [el('span', { class: 'sim-set-tt', html: '<b>Scale</b><em>Size of text, apps and other items</em>' }), el('span', { class: 'sim-set-pill', text: '100%' })]),
        el('div', { class: 'sim-set-togrow' }, [el('span', { class: 'sim-set-tt', html: '<b>Display resolution</b>' }), el('span', { class: 'sim-set-pill', text: '1920 × 1080' })])
      ]));
    } else if (cat === 'system' && page === 'sound') {
      pane.appendChild(breadcrumb('System', function () { w.data.page = null; self.update(); }));
      pane.appendChild(h1('Sound'));
      pane.appendChild(card([
        el('p', { class: 'sim-set-sub', text: 'Output' }),
        slider('Volume', s.settings.volume, function (v) { s.settings.volume = v; self.fire('volume', v); }),
        toggleRow('Mute', '', s.settings.volume === 0, function () { s.settings.volume = s.settings.volume === 0 ? 50 : 0; self.update(); }),
        el('div', { class: 'sim-set-togrow' }, [el('span', { class: 'sim-set-tt', html: '<b>Output device</b>' }), el('span', { class: 'sim-set-pill', text: 'Speakers' })])
      ]));
    } else if (cat === 'system' && page === 'power') {
      pane.appendChild(breadcrumb('System', function () { w.data.page = null; self.update(); }));
      pane.appendChild(h1('Power'));
      pane.appendChild(card([
        el('div', { class: 'sim-set-togrow' }, [el('span', { class: 'sim-set-tt', html: '<b>Screen and sleep</b><em>When plugged in, put device to sleep after</em>' }), el('span', { class: 'sim-set-pill', text: '15 minutes' })]),
        el('div', { class: 'sim-set-togrow' }, [el('span', { class: 'sim-set-tt', html: '<b>Power mode</b>' }), el('span', { class: 'sim-set-pill', text: 'Balanced' })])
      ]));

    /* ---- NETWORK ---- */
    } else if (cat === 'network') {
      pane.appendChild(h1('Network & internet'));
      pane.appendChild(el('div', { class: 'sim-set-netbanner' + (s.settings.wifi ? ' is-on' : '') }, [
        el('span', { class: 'sim-set-net-ic', html: svgIcon('wifi', 'ic ic-lg') }),
        el('span', { html: s.settings.wifi ? '<b>' + D.esc(s.settings.wifi) + '</b><em>Connected, secured</em>' : '<b>Not connected</b><em>You aren’t connected to any networks</em>' })
      ]));
      pane.appendChild(el('p', { class: 'sim-set-sub', text: 'Wi-Fi' }));
      var netcard = card([]);
      s.networks.forEach(function (n) {
        var connected = s.settings.wifi === n.ssid;
        var row = el('div', { class: 'sim-netrow' + (connected ? ' is-connected' : '') }, [
          el('span', { class: 'sim-netname', html: svgIcon('wifi', 'ic') + '<span class="sim-net-txt"><b>' + D.esc(n.ssid) + '</b>' +
            (connected ? '<em>Connected, secured</em>' : (n.secure ? '<em>Secured</em>' : '<em class="warn">Open — not secure</em>')) + '</span>' }),
          connected
            ? el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Disconnect',
                onclick: function () { s.settings.wifi = null; self.fire('wifi-disconnect', n.ssid); self.update(); } })
            : el('button', { class: 'dl-btn dl-btn-primary', type: 'button', text: 'Connect',
                onclick: function () {
                  if (n.secure) {
                    self.prompt('Connect to ' + n.ssid, 'Enter the network security key', '', function (pw) {
                      if (pw) { s.settings.wifi = n.ssid; self.fire('wifi-connect', n.ssid); self.update(); }
                    });
                  } else { s.settings.wifi = n.ssid; self.fire('wifi-connect', n.ssid); self.update(); }
                } })
        ]);
        netcard.appendChild(row);
      });
      pane.appendChild(netcard);
      pane.appendChild(navcard('network', 'Advanced network settings', 'View all network adapters, network reset', function () {}));

    /* ---- PERSONALISATION ---- */
    } else if (cat === 'personalisation') {
      pane.appendChild(h1('Personalisation'));
      var preview = el('div', { class: 'sim-set-wallpreview', style: { background: WALLPAPERS[s.settings.wallpaper] || WALLPAPERS.teal } });
      pane.appendChild(preview);
      pane.appendChild(navcard('image', 'Background', WALL_NAMES[s.settings.wallpaper] || 'Picture', function () {}, null));
      pane.appendChild(el('p', { class: 'sim-set-sub', text: 'Choose a photo' }));
      var grid = el('div', { class: 'sim-wallgrid' }, Object.keys(WALLPAPERS).map(function (k) {
        return el('button', {
          class: 'sim-wall' + (s.settings.wallpaper === k ? ' is-sel' : ''), type: 'button',
          'aria-label': WALL_NAMES[k] || k, title: WALL_NAMES[k] || k, style: { background: WALLPAPERS[k] },
          onclick: function () { s.settings.wallpaper = k; self.fire('wallpaper', k); self.update(); }
        });
      }));
      pane.appendChild(grid);
      pane.appendChild(navcard('display', 'Colours', 'Accent colour, transparency, dark or light mode', function () {}));
      pane.appendChild(navcard('start', 'Start', 'Layout, pinned apps, recommended, folders', function () {}));
      pane.appendChild(navcard('taskview', 'Taskbar', 'Taskbar items, behaviours, system tray', function () {}));

    /* ---- ACCOUNTS ---- */
    } else if (cat === 'accounts') {
      pane.appendChild(h1('Accounts'));
      pane.appendChild(el('div', { class: 'sim-set-devbanner' }, [
        el('span', { class: 'sim-set-dev-ic', html: svgIcon('person', 'ic ic-lg') }),
        el('span', { html: '<b>Trainee</b><em>trainee@rvnp.ac.ke · Local account</em>' })
      ]));
      pane.appendChild(navcard('person', 'Your info', 'Account settings, profile picture', function () {}));
      pane.appendChild(navcard('privacy', 'Sign-in options', 'Windows Hello, PIN, password, security key', function () {}));
      pane.appendChild(navcard('apps', 'Family & other users', 'Add or remove accounts on this device', function () {}));
      pane.appendChild(el('div', { class: 'sim-set-togrow' }, [
        el('span', { class: 'sim-set-tt', html: '<b>Sign out</b><em>Lock this device and return to the sign-in screen</em>' }),
        el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Sign out', onclick: function () { self.setPower('lock'); } })
      ]));

    /* ---- other categories: realistic read-only panes ---- */
    } else {
      var META = {
        bluetooth: ['Bluetooth & devices', [['Bluetooth', 'On'], ['Printers & scanners', '2 devices'], ['Mouse', 'Connected'], ['Keyboard', 'Connected'], ['USB', 'Autoplay on']]],
        apps: ['Apps', [['Installed apps', '48 apps'], ['Default apps', 'Set defaults'], ['Startup', '6 apps'], ['Advanced app settings', '']]],
        time: ['Time & language', [['Date & time', '20/10/2026, 09:41'], ['Time zone', '(UTC+03:00) Nairobi'], ['Language & region', 'English (Kenya)'], ['Typing', 'On']]],
        gaming: ['Gaming', [['Game Bar', 'On'], ['Captures', 'Off'], ['Game Mode', 'On']]],
        accessibility: ['Accessibility', [['Text size', '100%'], ['Narrator', 'Off'], ['Magnifier', 'Off'], ['Contrast themes', 'Off'], ['Mouse pointer and touch', 'Default']]],
        privacy: ['Privacy & security', [['Windows Security', 'No actions needed'], ['Find my device', 'On'], ['Location', 'On'], ['Camera', 'On'], ['Microphone', 'On']]],
        update: ['Windows Update', [['You’re up to date', 'Last checked: today, 09:10'], ['Update history', ''], ['Advanced options', ''], ['Windows Insider Program', '']]]
      };
      var m = META[cat] || META.update;
      pane.appendChild(h1(m[0]));
      if (cat === 'update') {
        pane.appendChild(el('div', { class: 'sim-set-netbanner is-on' }, [
          el('span', { class: 'sim-set-net-ic', html: svgIcon('update', 'ic ic-lg') }),
          el('span', { html: '<b>You’re up to date</b><em>Last checked: today, 09:10</em>' }),
          el('button', { class: 'dl-btn dl-btn-ghost', type: 'button', text: 'Check for updates' })
        ]));
      }
      m[1].forEach(function (pair) {
        pane.appendChild(navcard(
          { bluetooth: 'bluetooth', apps: 'apps', time: 'clock', gaming: 'gaming', accessibility: 'access', privacy: 'privacy', update: 'update' }[cat] || 'gear',
          pair[0], '', function () {}, pair[1]));
      });
    }

    body.appendChild(el('div', { class: 'sim-set-grid' }, [rail, pane]));
  };

  OSSim.prototype.destroy = function () {
    (this._cleanup || []).forEach(function (fn) { fn(); });
    this._cleanup = [];
    this.closeContext();
    this.closeModal();
    clear(this.mount);
  };

  D.sims = D.sims || {};
  D.sims.os = { create: function (mount, setup) { return new OSSim(mount, setup); } };
  D.WALLPAPERS = WALLPAPERS;
  D.iconFor = iconFor;

})(window.DIGILIT);
