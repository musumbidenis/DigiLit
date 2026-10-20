# DigiLit — Digital Literacy Assessments

Performance-based digital literacy assessment for the RVNP ICT Department.
Structured as the Kenyan CDACC unit **Apply Digital Literacy** (Level 5/6,
ISCED 0611 541 01B, 80 hours): its seven learning outcomes are the top-level
structure, with each outcome's content areas as modules. Two modules RVNP
keeps but that sit outside the official unit are grouped and labelled
separately.

It needs **no internet, no server, no install and no build step**. Open
`index.html` in a browser and it runs — from a USB stick, a shared folder, or
a copy on each lab machine.

---

## Running it

**From a USB stick or a folder**
Copy the whole `digilit` folder. Double-click `index.html`. That's it.
Tested in Chromium; Chrome, Edge and Firefox all work.

**From a LAN share**
Put the folder on a share every machine can read, and make a desktop shortcut
to `index.html` on each. Read-only is fine — the app never writes back to its
own folder.

**If you'd rather serve it over the lab network** (slightly better behaviour
for downloads on locked-down browsers):

```
cd digilit
python3 -m http.server 8080
```

Then trainees open `http://<your-ip>:8080` — still entirely inside the lab,
with no internet involved.

---

## Collecting results

Everything is marked on the machine and stored in that browser's local
storage. Nothing is transmitted anywhere.

- **After each attempt** the trainee clicks **Save result file** — a JSON file
  named `digilit_<class>_<admno>_<module>_<date>.json`.
- **At the end of a session** open the record sheet from the home page and
  click **Export all as CSV**. One file, every attempt on that machine, ready
  to paste into your marksheet.
- **Print results sheet** and **Print certificate** both produce clean pages;
  the app chrome is hidden in print.
- **Clear this computer** wipes the stored attempts. Export first.

Because marking happens on the device, a determined trainee could read the
answer key out of the bank files. That's fine for practice and for formative
use. For a graded CAT, invigilate as you would any practical.

---

## What's in the box

| | |
|---|---|
| Learning outcomes | 7 (+ RVNP extensions) |
| Modules | 24 |
| Modules with tasks authored | 24 |
| Pass mark | 85% |

**Four simulators**, built as faithful recreations of the real, current
interfaces so trainees practise in what looks and behaves like the machines in
front of them. The glyphs and wallpapers are drawn in-house — no trademarked
logo artwork is bundled — but the layout, terminology and behaviour mirror the
real thing, including the surrounding sections a real screen always carries:

- **Operating system** — a Windows 11 desktop (with a Windows 10 flavour): the
  centred taskbar with Start, Search, Task view and the system tray; a Start
  menu with Pinned apps and a Recommended list; File Explorer with the full
  navigation tree (Home, Gallery, OneDrive, This PC, Network), the command bar
  and details columns, backed by a real virtual filesystem; Recycle Bin;
  Notepad; and a Settings app with the complete category rail (System,
  Bluetooth & devices, Network & internet, Personalisation, Apps, Accounts,
  Time & language, Gaming, Accessibility, Privacy & security, Windows Update),
  quick settings, context menus, dialogs and the power menu.
- **Browser** — a Chromium-style window: rounded tab strip, an omnibox with a
  security indicator, the bookmarks bar, a new-tab page with shortcut tiles,
  back/forward/reload/home, bookmarks, downloads shelf, overflow menu and
  history. It browses a small self-contained web with a search engine whose
  results carry a sponsored entry and a scam look-alike site.
- **Mail client** — a webmail layout (the shape Outlook on the web and Gmail
  share): the top app bar with global search, the full folder rail with unread
  counts, a message list with sender avatars, a reading pane with the real
  action toolbar, and a docked compose window with To/Cc/Bcc, attachments
  picked from the filesystem, reply, reply-all, forward, archive, report junk
  and search.
- **Office suite** — a ribbon editor driving three app models: a **word
  processor** (document paragraphs with font, alignment, lists, styles,
  tables, pictures, page setup, headers and spell-check), a **spreadsheet**
  with a real formula engine (SUM, AVERAGE, COUNT, MAX, MIN, IF, SUMIF, RANK,
  PRODUCT, MODE, cell references, ranges, sorting, filtering, charts and cell
  formatting), and a **presentation** deck (slides, layouts, themes, notes,
  transitions, reorder/duplicate/delete and a slide show). The spreadsheet
  grades the model, so `=SUM(B2:B6)` passes where typing `4800` fails.

**Seven item types**: simulation, click-the-picture, single choice, multiple
response, ordering, matching, short typed answer.

**Accessibility**: every task has a Read aloud button (browser speech, works
offline), the whole app is keyboard-navigable, hotspot targets are focusable,
and nothing relies on colour alone.

---

## The grading rule

Everything is graded on the **outcome**, never the click path. Create a folder
from the toolbar, from the right-click menu, or any other way — all count.
That is what makes it a skills test rather than a test of one remembered route.

The validators are written to catch the plausible-but-wrong answer, which is
where the real assessment happens:

- a **move** task fails if the trainee copies and leaves the original behind
- a **reply all** task fails on a plain reply
- "open the official site" fails if they open the sponsored result
- the phishing task fails if they report a genuine message instead
- "lock the machine" fails on shut down, which would lose the open work

---

## Adding tasks

One file per module in `banks/`. Each registers against the standards declared
in `js/modules.js`, and the app warns in the console if an item points at a
standard that doesn't exist.

A knowledge item:

```js
{ id: 'bcs-05', type: 'choice', skills: ['bcs.1'],
  prompt: 'Which of these is software?',
  options: ['A web browser', 'A keyboard', 'A monitor', 'A flash disk'],
  answer: 0 }
```

A simulation:

```js
{ id: 'win11-05', type: 'sim', env: 'os', skills: ['win11.5'],
  prompt: 'Create a new folder called Assignments inside Documents.',
  note: 'Toolbar, right-click menu — whichever you prefer.',
  setup: { flavour: 'win11', fs: { '/Documents': null },
           open: [{ app: 'files', path: '/Documents' }] },
  check: function (s) {
    var n = s.vfs.get('/Documents/Assignments');
    return !!n && n.type === 'dir';
  } }
```

`check` receives the simulator's state: `s.vfs` (filesystem and recycle bin),
`s.settings`, `s.windows`, `s.power` and `s.events` for the OS; `s.visited`,
`s.bookmarks`, `s.downloads`, `s.searches`, `s.tabs` for the browser;
`s.sent`, `s.folders`, `s.vfs` for mail.

Add a new module by calling `M(...)` in `js/modules.js`, creating
`banks/<id>.js`, and adding one `<script>` tag in `index.html`.

Two settings live at the bottom of `js/core.js`: `passMark` and the
institution name printed on certificates.

---

## Planned next

Every module is now authored. Two learning outcomes are covered by knowledge
and click-the-picture items and would gain from a small dedicated simulator:

- **LO6 Perform Online Jobs** — a job-platform profile/bidding flow
- **LO4 Online Collaboration** — a Google-Drive/Docs share-and-permissions flow

**Mac OS** currently has knowledge items only; the Mac flavour of the OS
simulator isn't written, so simulating it would teach the wrong layout. The
spreadsheet's `select ranges / fill`, `relative references`, `insert-delete
rows` and `rename worksheets` standards are covered by neighbouring tasks
rather than one each.

---

## On the content

The *system* is modelled on Northstar Digital Literacy — the module structure,
the simulation-based approach, per-skill results, the 85% threshold,
certificates listing only modules passed. None of their assessment items,
standards wording, branding or screens are reproduced; every task and standard
here is original.

The *simulators* deliberately recreate the real, current interfaces — Windows
11, a Chromium browser, a webmail client — because a digital-literacy test is
only valid if it looks like the software the learner will actually meet. The
recreations are built from drawn glyphs and original wallpapers rather than
copied logo files, so no trademarked artwork is bundled, but the layouts,
terminology and behaviour are intentionally close to the originals.

Two modules are RVNP additions rather than part of the mirrored eighteen, and
are labelled as such in the app: **Mobile Money and Digital Payments** and
**Cybersecurity and Safe Practice**.
