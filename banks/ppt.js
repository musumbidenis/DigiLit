/* Presentations (LO2) — item bank. Original tasks.
   Runs on the Office-suite simulator (env 'ppt'). Grading reads the deck model
   s.deck, never the click path. */
(function (D) {
  'use strict';

  D.registerItems('ppt', [

    { id: 'ppt-01', type: 'sim', env: 'ppt', skills: ['ppt.1'],
      prompt: 'Add a new slide to the presentation.',
      note: 'Home tab › New Slide.',
      setup: { slides: [ { layout: 'Title Slide', title: 'Road Safety' } ] },
      check: function (s) { return s.deck.slides.length >= 2; } },

    { id: 'ppt-02', type: 'sim', env: 'ppt', skills: ['ppt.3'],
      prompt: 'On the first slide, type the title: Road Safety',
      note: 'Click the title placeholder and type.',
      setup: { slides: [ { layout: 'Title Slide', title: '' } ] },
      check: function (s) { return D.norm(s.deck.slides[0].title) === 'road safety'; } },

    { id: 'ppt-03', type: 'sim', env: 'ppt', skills: ['ppt.4'],
      prompt: 'Apply a design theme other than the plain Office theme.',
      note: 'Design tab › choose any theme (Berlin, Ion, Facet, Wisp).',
      setup: { slides: [ { layout: 'Title Slide', title: 'My Project' } ], theme: 'office' },
      check: function (s) { return s.deck.theme && s.deck.theme !== 'office'; } },

    { id: 'ppt-04', type: 'sim', env: 'ppt', skills: ['ppt.7'],
      prompt: 'Add a speaker note to the first slide.',
      note: 'Type in the notes box below the slide.',
      setup: { slides: [ { layout: 'Title and Content', title: 'Introduction' } ] },
      check: function (s) { return (s.deck.slides[0].notes || '').trim().length > 0; } },

    { id: 'ppt-05', type: 'sim', env: 'ppt', skills: ['ppt.6'],
      prompt: 'Duplicate the first slide so there are two identical slides.',
      note: 'Home tab › Duplicate.',
      setup: { slides: [ { layout: 'Title Slide', title: 'Agenda' } ] },
      check: function (s) {
        return s.deck.slides.length === 2 && s.deck.slides[0].title === 'Agenda' && s.deck.slides[1].title === 'Agenda';
      } },

    { id: 'ppt-06', type: 'sim', env: 'ppt', skills: ['ppt.8'],
      prompt: 'Apply the Fade transition to the first slide.',
      note: 'Transitions tab › Fade.',
      setup: { slides: [ { layout: 'Title Slide', title: 'Welcome' } ] },
      check: function (s) { return s.deck.slides[0].transition === 'Fade'; } },

    { id: 'ppt-07', type: 'sim', env: 'ppt', skills: ['ppt.6'],
      prompt: 'Reorder the slides so "Conclusion" comes first.',
      note: 'Select the Conclusion slide and use Move up.',
      setup: { slides: [ { title: 'Introduction' }, { title: 'Conclusion' } ] },
      check: function (s) { return s.deck.slides[0].title === 'Conclusion'; } },

    { id: 'ppt-08', type: 'sim', env: 'ppt', skills: ['ppt.5'],
      prompt: 'Insert a picture on the current slide.',
      note: 'Insert tab › Picture.',
      setup: { slides: [ { layout: 'Title and Content', title: 'Our team' } ] },
      check: function (s) { return s.deck.slides[s.deck.current].hasImage === true; } },

    { id: 'ppt-09', type: 'sim', env: 'ppt', skills: ['ppt.9'],
      prompt: 'Start the slide show.',
      note: 'Slide Show tab › From Beginning.',
      setup: { slides: [ { title: 'Slide one' }, { title: 'Slide two' } ] },
      check: function (s) { return s.deck.slideshow === true; } },

    { id: 'ppt-10', type: 'sim', env: 'ppt', skills: ['ppt.6'],
      prompt: 'Delete the middle slide ("Draft") so only two slides remain.',
      note: 'Select the Draft slide and use Delete.',
      setup: { slides: [ { title: 'Opening' }, { title: 'Draft' }, { title: 'Closing' } ] },
      check: function (s) {
        return s.deck.slides.length === 2 &&
          !s.deck.slides.some(function (sl) { return sl.title === 'Draft'; });
      } },

    { id: 'ppt-11', type: 'choice', skills: ['ppt.10'],
      prompt: 'You want to give the audience a printout with several slides per page. What do you print?',
      options: ['Handouts', 'Only the first slide', 'The speaker notes font', 'The theme file'],
      answer: 0 },

    { id: 'ppt-12', type: 'choice', skills: ['ppt.2'],
      prompt: 'For the opening slide of a talk, which layout is most appropriate?',
      options: ['Title Slide', 'Blank', 'Two Content', 'Comparison'],
      answer: 0, keepOrder: true }

  ]);

})(window.DIGILIT);
