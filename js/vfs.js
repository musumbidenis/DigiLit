/* DigiLit — virtual filesystem shared by the OS, browser and mail simulators.
   Paths are POSIX-style under a set of named roots (/Desktop, /Documents, ...). */
(function (D) {
  'use strict';

  function split(path) {
    return String(path || '/').split('/').filter(function (p) { return p.length; });
  }
  function join(parts) { return '/' + parts.join('/'); }

  function dir(name) { return { name: name, type: 'dir', children: {} }; }
  function file(name, content, meta) {
    return {
      name: name, type: 'file',
      content: content === undefined ? '' : content,
      size: (meta && meta.size) || Math.max(1, String(content || '').length),
      modified: (meta && meta.modified) || '2026-09-01 09:00'
    };
  }

  function VFS(seed) {
    this.root = dir('');
    this.trash = [];           // {node, fromPath}
    this.log = [];             // every mutation, for multi-path grading
    if (seed) this.seed(seed);
  }

  VFS.prototype.record = function (action, detail) {
    this.log.push({ action: action, detail: detail });
  };

  /* seed: { '/Documents': null, '/Documents/notes.txt': 'hello' }
     A null/undefined value makes a directory, a string makes a file. */
  VFS.prototype.seed = function (map) {
    var self = this;
    Object.keys(map).forEach(function (p) {
      var v = map[p];
      if (v === null || v === undefined) self.mkdirp(p);
      else {
        var parts = split(p), name = parts.pop();
        self.mkdirp(join(parts));
        var parent = self.get(join(parts));
        parent.children[name] = file(name, v);
      }
    });
    this.log = [];
  };

  VFS.prototype.get = function (path) {
    var parts = split(path), node = this.root, i;
    for (i = 0; i < parts.length; i++) {
      if (!node.children || !node.children[parts[i]]) return null;
      node = node.children[parts[i]];
    }
    return node;
  };

  VFS.prototype.exists = function (path) { return !!this.get(path); };

  VFS.prototype.mkdirp = function (path) {
    var parts = split(path), node = this.root, i;
    for (i = 0; i < parts.length; i++) {
      if (!node.children[parts[i]]) node.children[parts[i]] = dir(parts[i]);
      node = node.children[parts[i]];
    }
    return node;
  };

  VFS.prototype.parentOf = function (path) {
    var parts = split(path); parts.pop();
    return this.get(join(parts));
  };

  VFS.prototype.list = function (path) {
    var node = this.get(path);
    if (!node || node.type !== 'dir') return [];
    return Object.keys(node.children).map(function (k) { return node.children[k]; })
      .sort(function (a, b) {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });
  };

  /* Returns the unique name actually used (Windows-style " (2)" suffixing). */
  VFS.prototype.uniqueName = function (parent, name) {
    if (!parent.children[name]) return name;
    var base = name, ext = '', dot = name.lastIndexOf('.');
    if (dot > 0) { base = name.slice(0, dot); ext = name.slice(dot); }
    var n = 2;
    while (parent.children[base + ' (' + n + ')' + ext]) n++;
    return base + ' (' + n + ')' + ext;
  };

  VFS.prototype.mkdir = function (parentPath, name) {
    var parent = this.get(parentPath);
    if (!parent || parent.type !== 'dir') return null;
    var n = this.uniqueName(parent, name);
    parent.children[n] = dir(n);
    this.record('mkdir', parentPath + '/' + n);
    return parent.children[n];
  };

  VFS.prototype.touch = function (parentPath, name, content) {
    var parent = this.get(parentPath);
    if (!parent || parent.type !== 'dir') return null;
    var n = this.uniqueName(parent, name);
    parent.children[n] = file(n, content);
    this.record('create', parentPath + '/' + n);
    return parent.children[n];
  };

  VFS.prototype.write = function (path, content) {
    var node = this.get(path);
    if (!node || node.type !== 'file') return false;
    node.content = content;
    node.size = Math.max(1, String(content || '').length);
    this.record('write', path);
    return true;
  };

  VFS.prototype.rename = function (path, newName) {
    var parent = this.parentOf(path), parts = split(path), old = parts[parts.length - 1];
    if (!parent || !parent.children[old] || !newName) return false;
    if (newName !== old && parent.children[newName]) return false;
    var node = parent.children[old];
    delete parent.children[old];
    node.name = newName;
    parent.children[newName] = node;
    this.record('rename', { from: path, to: newName });
    return true;
  };

  /* Soft delete — goes to the Recycle Bin so restore tasks can be graded. */
  VFS.prototype.remove = function (path, permanent) {
    var parent = this.parentOf(path), parts = split(path), name = parts[parts.length - 1];
    if (!parent || !parent.children[name]) return false;
    var node = parent.children[name];
    delete parent.children[name];
    if (permanent) this.record('delete-permanent', path);
    else {
      parts.pop();
      this.trash.push({ node: node, fromPath: join(parts), deletedAt: D.timeStamp() });
      this.record('delete', path);
    }
    return true;
  };

  VFS.prototype.restore = function (index) {
    var entry = this.trash[index];
    if (!entry) return false;
    var parent = this.get(entry.fromPath) || this.mkdirp(entry.fromPath);
    var n = this.uniqueName(parent, entry.node.name);
    entry.node.name = n;
    parent.children[n] = entry.node;
    this.trash.splice(index, 1);
    this.record('restore', entry.fromPath + '/' + n);
    return true;
  };

  VFS.prototype.emptyTrash = function () {
    this.trash = [];
    this.record('empty-trash', null);
  };

  function cloneNode(node) {
    if (node.type === 'file') return file(node.name, node.content, { size: node.size, modified: node.modified });
    var d = dir(node.name);
    Object.keys(node.children).forEach(function (k) { d.children[k] = cloneNode(node.children[k]); });
    return d;
  }

  VFS.prototype.copy = function (srcPath, destDirPath) {
    var src = this.get(srcPath), destDir = this.get(destDirPath);
    if (!src || !destDir || destDir.type !== 'dir') return false;
    if (destDirPath === srcPath || destDirPath.indexOf(srcPath + '/') === 0) return false; // into itself
    var copyNode = cloneNode(src);
    var n = this.uniqueName(destDir, copyNode.name);
    copyNode.name = n;
    destDir.children[n] = copyNode;
    this.record('copy', { from: srcPath, to: destDirPath + '/' + n });
    return true;
  };

  VFS.prototype.move = function (srcPath, destDirPath) {
    var src = this.get(srcPath), destDir = this.get(destDirPath);
    if (!src || !destDir || destDir.type !== 'dir') return false;
    if (destDirPath === srcPath || destDirPath.indexOf(srcPath + '/') === 0) return false;
    var parent = this.parentOf(srcPath), parts = split(srcPath), name = parts[parts.length - 1];
    if (parent === destDir) return true;
    delete parent.children[name];
    var n = this.uniqueName(destDir, name);
    src.name = n;
    destDir.children[n] = src;
    this.record('move', { from: srcPath, to: destDirPath + '/' + n });
    return true;
  };

  /* Recursive search by partial name, case-insensitive. */
  VFS.prototype.find = function (query, startPath) {
    var hits = [], q = D.norm(query);
    if (!q) return hits;
    (function walk(node, path) {
      Object.keys(node.children || {}).forEach(function (k) {
        var child = node.children[k], p = path + '/' + k;
        if (D.norm(child.name).indexOf(q) !== -1) hits.push({ node: child, path: p });
        if (child.type === 'dir') walk(child, p);
      });
    })(this.get(startPath || '/') || this.root, startPath === '/' || !startPath ? '' : startPath);
    return hits;
  };

  /* Flat list of every path, for validators that want a whole-tree assertion. */
  VFS.prototype.paths = function () {
    var out = [];
    (function walk(node, path) {
      Object.keys(node.children || {}).forEach(function (k) {
        var p = path + '/' + k;
        out.push(p);
        if (node.children[k].type === 'dir') walk(node.children[k], p);
      });
    })(this.root, '');
    return out;
  };

  VFS.prototype.did = function (action) {
    return this.log.some(function (e) { return e.action === action; });
  };

  D.VFS = VFS;
  D.vfsSplit = split;
  D.vfsJoin = join;

})(window.DIGILIT);
