/* DigiLit — core registry, DOM helpers, storage.
   Offline-first: no fetch(), no network, no build step. All data arrives
   via <script src> tags so the app runs straight from file:// or a USB stick. */
(function (global) {
  'use strict';

  var DIGILIT = global.DIGILIT = global.DIGILIT || {};

  /* ---------- registry ---------- */
  DIGILIT.categories = [];
  DIGILIT.modules = [];
  DIGILIT.modulesById = {};

  DIGILIT.registerCategories = function (list) {
    DIGILIT.categories = list;
  };

  DIGILIT.registerModule = function (mod) {
    mod.items = mod.items || [];
    mod.standardsById = {};
    (mod.standards || []).forEach(function (s) { mod.standardsById[s.id] = s; });
    DIGILIT.modules.push(mod);
    DIGILIT.modulesById[mod.id] = mod;
    return mod;
  };

  /* Bank files call this. Items are validated loudly so a typo in a bank
     file surfaces at load time instead of mid-assessment. */
  DIGILIT.registerItems = function (moduleId, items) {
    var mod = DIGILIT.modulesById[moduleId];
    if (!mod) { console.error('DigiLit: unknown module "' + moduleId + '"'); return; }
    items.forEach(function (it) {
      var skills = it.skills || (it.skill ? [it.skill] : []);
      if (!skills.length) console.warn('DigiLit: item ' + it.id + ' maps to no standard');
      skills.forEach(function (sk) {
        if (!mod.standardsById[sk]) {
          console.warn('DigiLit: item ' + it.id + ' references unknown standard "' + sk + '"');
        }
      });
      it.skills = skills;
      it.moduleId = moduleId;
      mod.items.push(it);
    });
  };

  DIGILIT.moduleStatus = function (mod) {
    if (!mod.items.length) return 'empty';
    return 'ready';
  };

  /* ---------- DOM helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    /* el(tag, [children]) is allowed as shorthand for el(tag, null, [children]) */
    if (Array.isArray(attrs)) { children = attrs; attrs = null; }
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'style' && typeof v === 'object') {
          Object.keys(v).forEach(function (p) {
            /* custom properties (--x) must go through setProperty; bracket
               assignment is silently ignored for them */
            if (p.slice(0, 2) === '--') node.style.setProperty(p, v[p]);
            else node.style[p] = v[p];
          });
        } else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === 'data' && typeof v === 'object') {
          Object.keys(v).forEach(function (p) { node.dataset[p] = v[p]; });
        } else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  DIGILIT.el = el;

  DIGILIT.clear = function (node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  };

  DIGILIT.$ = function (sel, root) { return (root || document).querySelector(sel); };

  DIGILIT.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- small utils ---------- */
  DIGILIT.shuffle = function (arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  DIGILIT.norm = function (s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  };

  DIGILIT.pad = function (n) { return n < 10 ? '0' + n : '' + n; };

  DIGILIT.stamp = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + DIGILIT.pad(d.getMonth() + 1) + '-' + DIGILIT.pad(d.getDate());
  };

  DIGILIT.timeStamp = function (d) {
    d = d || new Date();
    return DIGILIT.stamp(d) + ' ' + DIGILIT.pad(d.getHours()) + ':' + DIGILIT.pad(d.getMinutes());
  };

  /* ---------- local storage (best effort; lab machines may block it) ---------- */
  var MEM = {};
  DIGILIT.store = {
    get: function (k, fallback) {
      try {
        var v = global.localStorage.getItem('digilit.' + k);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return k in MEM ? MEM[k] : fallback; }
    },
    set: function (k, v) {
      try { global.localStorage.setItem('digilit.' + k, JSON.stringify(v)); }
      catch (e) { MEM[k] = v; }
    },
    remove: function (k) {
      try { global.localStorage.removeItem('digilit.' + k); } catch (e) { delete MEM[k]; }
    }
  };

  /* ---------- config ---------- */
  DIGILIT.config = {
    passMark: 0.85,              // Northstar-style 85% threshold
    institution: 'Rift Valley National Polytechnic',
    department: 'ICT Department',
    productName: 'DigiLit'
  };

})(window);
