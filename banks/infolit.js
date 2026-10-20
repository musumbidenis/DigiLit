/* Information Literacy — item bank. */
(function (D) {
  'use strict';

  D.registerItems('infolit', [

    { id: 'infolit-01', type: 'match', skills: ['infolit.1'],
      prompt: 'Mark each statement as fact or opinion.',
      left: ['The polytechnic admitted 1,240 trainees in January 2026.',
        'This is the best polytechnic in the country.',
        'The fee structure was published on 3 September.',
        'Everyone should study ICT.'],
      right: ['Fact — can be checked', 'Opinion — a judgement'],
      answer: { 0: 0, 1: 1, 2: 0, 3: 1 } },

    { id: 'infolit-02', type: 'multi', skills: ['infolit.2', 'infolit.6'],
      prompt: 'You find an article you want to cite in an assignment. Which checks should you make before using it?',
      options: ['Who published it, and whether they have an interest in the conclusion',
        'Whether it names an author', 'When it was published',
        'Whether it cites evidence you can follow up',
        'Whether it appears first in the search results',
        'Whether the page looks modern'],
      answer: [0, 1, 2, 3] },

    { id: 'infolit-03', type: 'choice', skills: ['infolit.3'],
      prompt: 'A striking claim appears on one website and nowhere else. What is the soundest conclusion?',
      options: ['Treat it as unverified until an independent source confirms it',
        'Accept it — a single source is enough if the site looks professional',
        'Reject it outright as a lie',
        'Share it so that others can check it'],
      answer: 0 },

    { id: 'infolit-04', type: 'choice', skills: ['infolit.4'],
      prompt: 'Which headline is the clearest example of clickbait?',
      options: ['Doctors stunned by this one trick — you won\'t believe number 7',
        'County reports 12% rise in enrolment over two years',
        'New fee structure published for the 2026 intake',
        'Report finds mixed results from the pilot programme'],
      answer: 0 },

    { id: 'infolit-05', type: 'multi', skills: ['infolit.5'],
      prompt: 'A photograph circulating online is said to show a recent event near you. Which checks would help you judge it?',
      options: ['Run a reverse image search to see where else the picture has appeared',
        'Look for details that fix the place and season — signage, vehicles, weather',
        'Check whether any news organisation reports the same event',
        'Count how many people have shared it',
        'Check whether the caption matches what is visible in the image'],
      answer: [0, 1, 2, 4] },

    { id: 'infolit-06', type: 'choice', skills: ['infolit.7'],
      prompt: 'A page labelled "Sponsored" sits at the top of your search results. What does that label mean?',
      options: ['Someone paid for it to appear there',
        'A search engine editor recommends it',
        'It is the most popular result',
        'It has been checked for accuracy'],
      answer: 0 },

    { id: 'infolit-07', type: 'choice', skills: ['infolit.8'],
      prompt: 'You use three sentences from a website in your assignment, changing a few words. What must you do?',
      options: ['Credit the source, whether you quote it or put it in your own words',
        'Nothing — changing the words makes it yours',
        'Credit it only if you copied it exactly',
        'Credit it only if your trainer asks'],
      answer: 0 },

    { id: 'infolit-08', type: 'sim', env: 'browser', skills: ['infolit.2', 'infolit.4'],
      prompt: 'Search for health news, open the article that appears, and then bookmark it only if it is trustworthy. If it is not trustworthy, leave it unbookmarked and return to the start page.',
      note: 'Judge it by the page itself: who wrote it, when, and what evidence it offers.',
      setup: { tabs: ['findit.example'] },
      check: function (s) {
        var opened = s.visited.indexOf('news.example/health-claim') !== -1;
        var bookmarked = s.bookmarks.indexOf('news.example/health-claim') !== -1;
        var returned = s.visited[s.visited.length - 1] === 'start.digilit' ||
          (s.tabs[0] && s.tabs[0].history[s.tabs[0].hidx] === 'start.digilit');
        return opened && !bookmarked && returned;
      } }

  ]);

})(window.DIGILIT);
