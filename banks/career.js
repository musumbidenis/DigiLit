/* Career Search Skills — item bank. */
(function (D) {
  'use strict';

  /* A factory, not a shared object: each attempt gets a clean mailbox. */
  function cvBox() { return {
    account: 'trainee@rvnp.ac.ke',
    vfs: new D.VFS({
      '/Documents': null, '/Downloads': null,
      '/Documents/my-cv.pdf': 'Curriculum vitae',
      '/Documents/holiday-photos.png': 'Photos',
      '/Documents/certificate.pdf': 'Certificate'
    }),
    messages: [
      { from: 'hr@tatubuild.co.ke', fromName: 'Tatu Build HR',
        subject: 'ICT Attachment — documents required', date: '19 Oct 07:50',
        body: 'Thank you for your interest in the ICT attachment position.\n\nPlease send your CV as a PDF to hr@tatubuild.co.ke, with the subject "ICT Attachment Application".\n\nHR Department' }
    ]
  }; }

  D.registerItems('career', [

    { id: 'car-01', type: 'multi', skills: ['career.2'],
      prompt: 'A job advert lists "Diploma in ICT, one year experience, must be available from January". Which of these are requirements you must meet?',
      options: ['A Diploma in ICT', 'One year of experience', 'Availability from January',
        'A driving licence', 'A reference from a previous employer'],
      answer: [0, 1, 2] },

    { id: 'car-02', type: 'choice', skills: ['career.8'],
      prompt: 'An "employer" offers you a job after a two-minute chat and asks for KSh 2,000 for a medical check before you start. What is the right read?',
      options: ['A recruitment scam — a genuine employer does not ask candidates to pay to be hired',
        'Normal practice for entry-level roles', 'Acceptable if they send a letter first',
        'Fine as long as the amount is small'],
      answer: 0 },

    { id: 'car-03', type: 'choice', skills: ['career.3'],
      prompt: 'An advert asks for your CV as a PDF. Why does the format matter?',
      options: ['A PDF keeps your layout intact on any device and is what they asked for',
        'A PDF is smaller than every other format',
        'PDFs cannot be rejected by applicant systems',
        'It makes no real difference'],
      answer: 0 },

    { id: 'car-04', type: 'choice', skills: ['career.6'],
      prompt: 'Which opening is appropriate in an email to an employer you have never met?',
      options: ['Dear Sir or Madam,', 'Hi there!', 'Hey,', 'Greetings fam,'],
      answer: 0 },

    { id: 'car-05', type: 'multi', skills: ['career.9'],
      prompt: 'You have an online interview tomorrow. What should you do beforehand?',
      options: ['Test the camera, microphone and connection',
        'Find a quiet place with good light and a plain background',
        'Join a few minutes early', 'Have your CV open where you can see it',
        'Take the call while travelling so you do not miss it'],
      answer: [0, 1, 2, 3] },

    { id: 'car-06', type: 'order', skills: ['career.7'],
      prompt: 'Put these steps in a sensible order for applying to an advertised position.',
      steps: ['Read the advert and check you meet the requirements',
        'Update your CV for this particular role',
        'Save the CV in the format requested',
        'Send the application with the subject line they asked for',
        'Record the date and deadline so you can follow up'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'car-07', type: 'sim', env: 'mail', skills: ['career.5', 'career.6'],
      prompt: 'Reply to the HR message. Send your CV to hr@tatubuild.co.ke with the exact subject "ICT Attachment Application", attaching my-cv.pdf from Documents.',
      note: 'Read their message again for the exact subject line they asked for.',
      setup: cvBox,
      check: function (s) {
        return s.sent.some(function (m) {
          return m.to.indexOf('hr@tatubuild.co.ke') !== -1 &&
            D.norm(m.subject) === 'ict attachment application' &&
            (m.attachments || []).some(function (a) { return a.name === 'my-cv.pdf'; });
        });
      } },

    { id: 'car-08', type: 'sim', env: 'browser', skills: ['career.1'],
      prompt: 'Search for the polytechnic\'s official site and open it, so you can check what the institution lists about industrial attachment.',
      setup: { tabs: ['findit.example'] },
      check: function (s) {
        return s.searches.length > 0 && s.visited.indexOf('rvnp.ac.ke') !== -1;
      } },

    /* career.4 — complete an online application form accurately */
    { id: 'car-09', type: 'choice', skills: ['career.4'],
      prompt: 'You are filling in an online job application form. What gives the best result?',
      options: ['Complete every required field accurately, matching the details on your CV, and review before submitting',
        'Fill only the fields you feel like and skip the rest',
        'Enter rough answers quickly and submit — you can resend later',
        'Use a different name so the form stands out'],
      answer: 0 }

  ]);

})(window.DIGILIT);
