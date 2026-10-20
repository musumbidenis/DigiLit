/* Internet Basics — item bank. */
(function (D) {
  'use strict';

  D.registerItems('net', [

    { id: 'net-01', type: 'choice', skills: ['net.1'],
      prompt: 'Which of these is a browser rather than a search engine?',
      options: ['The program you open to view web pages',
        'A website where you type keywords to find pages',
        'The cable that connects you to the internet',
        'The company that sells you data bundles'],
      answer: 0 },

    { id: 'net-02', type: 'match', skills: ['net.2'],
      prompt: 'In the address https://www.rvnp.ac.ke/admissions, match each part to what it is.',
      left: ['https', 'www.rvnp.ac.ke', '/admissions', '.ke'],
      right: ['The protocol — how the page is fetched', 'The domain name — which site',
        'The path — which page on that site', 'The country code'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3 } },

    { id: 'net-03', type: 'choice', skills: ['net.9'],
      prompt: 'A page asks for your ID number and M-Pesa PIN. The address bar shows a warning and the address begins with http, not https. What should you do?',
      options: ['Leave the page — the connection is not secure and no genuine service asks for your PIN',
        'Enter the details, since the page looks official',
        'Enter the details but change your PIN afterwards',
        'Refresh the page until the padlock appears'],
      answer: 0 },

    { id: 'net-04', type: 'multi', skills: ['net.8'],
      prompt: 'Which signs suggest a search result is an advert rather than a genuine result?',
      options: ['It is labelled "Sponsored"', 'It sits above the other results in a marked block',
        'The address ends in .ac.ke', 'It has a longer description than the others',
        'It promises a guaranteed outcome if you pay'],
      answer: [0, 1, 4] },

    { id: 'net-05', type: 'choice', skills: ['net.6'],
      prompt: 'A search for "polytechnic" returns millions of results, most of them useless. What is the best next step?',
      options: ['Add more specific words, such as the name and the town',
        'Search the same word again and scroll further down',
        'Try a different browser', 'Clear your history and search again'],
      answer: 0 },

    { id: 'net-06', type: 'typein', skills: ['net.12'],
      prompt: 'On a shared lab computer, what should you clear from the browser before you leave so the next person cannot see where you have been?',
      placeholder: 'Two words',
      accept: ['browsing history', 'history', 'the browsing history', 'browser history'] },

    /* ---- simulations ---- */

    { id: 'net-07', type: 'sim', env: 'browser', skills: ['net.3'],
      prompt: 'Go to rvnp.ac.ke by typing the address.',
      note: 'Click the address bar, type the address and press Enter.',
      setup: { tabs: ['start.digilit'] },
      check: function (s) { return s.visited.indexOf('rvnp.ac.ke') !== -1; } },

    { id: 'net-08', type: 'sim', env: 'browser', skills: ['net.5'],
      prompt: 'Open a second tab and leave both tabs open.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) { return s.tabs.length >= 2; } },

    { id: 'net-09', type: 'sim', env: 'browser', skills: ['net.6', 'net.8'],
      prompt: 'Search for the polytechnic and open its official website. Do not open the sponsored result.',
      note: 'The official site is the institution\'s own address. The sponsored one asks for payment.',
      setup: { tabs: ['findit.example'] },
      check: function (s) {
        var reachedOfficial = s.visited.indexOf('rvnp.ac.ke') !== -1;
        var openedScam = s.visited.some(function (u) { return u.indexOf('cheapforms.net') !== -1; });
        return reachedOfficial && !openedScam && s.searches.length > 0;
      } },

    { id: 'net-10', type: 'sim', env: 'browser', skills: ['net.7', 'net.11'],
      prompt: 'Find the fee structure page on the polytechnic website and bookmark it.',
      note: 'Follow the link from the home page, then use the star in the address bar.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) { return s.bookmarks.indexOf('rvnp.ac.ke/fees') !== -1; } },

    { id: 'net-11', type: 'sim', env: 'browser', skills: ['net.10'],
      prompt: 'Download the admission form from the Admissions page.',
      note: 'When it has downloaded it should be in the Downloads folder.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) {
        return s.vfs.exists('/Downloads/admission-form.pdf') ||
          s.downloads.some(function (d) { return d.name === 'admission-form.pdf'; });
      } },

    { id: 'net-12', type: 'sim', env: 'browser', skills: ['net.4'],
      prompt: 'From the Admissions page, use the browser to return to the page you were on before it.',
      note: 'Navigate to Admissions first, then go back.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) {
        var t = s.tabs.filter(function (x) { return x.id === s.activeTab; })[0];
        var wentThere = t && t.history.indexOf('rvnp.ac.ke/admissions') !== -1;
        var nowBack = t && t.history[t.hidx] === 'rvnp.ac.ke';
        return !!(wentThere && nowBack);
      } },

    { id: 'net-13', type: 'sim', env: 'browser', skills: ['net.12'],
      prompt: 'You are finishing on a shared lab machine. Clear the browsing history.',
      note: 'The browser menu is the ⋮ button at the end of the address bar.',
      setup: { tabs: ['rvnp.ac.ke'] },
      check: function (s) { return s.historyCleared === true; } }

  ]);

})(window.DIGILIT);
