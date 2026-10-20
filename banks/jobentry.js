/* Job Entry Techniques (LO7) — item bank. Original tasks.
   Types and sources of opportunity, the CV, the cover letter, a portfolio of
   evidence, and interview skills. */
(function (D) {
  'use strict';

  D.registerItems('jobentry', [

    { id: 'jobentry-01', type: 'match', skills: ['jobentry.1'],
      prompt: 'Match each example to the type of job opportunity it is.',
      left: [
        'Running your own small graphic-design business',
        'Repairing phones for customers who bring them to you',
        'Designing and selling a new mobile app you built',
        'Being hired as a clerk on a monthly salary'],
      right: ['Self-employment', 'Service provision', 'Product development', 'Salaried employment'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3 } },

    { id: 'jobentry-02', type: 'multi', skills: ['jobentry.2'],
      prompt: 'Which of these are genuine sources of job opportunities?',
      options: [
        'Online job boards and company career pages',
        'Newspaper vacancy columns',
        'Referrals from your personal and professional network',
        'Guessing company email addresses and sending demands',
        'Internships, attachments and industry events'],
      answer: [0, 1, 2, 4] },

    { id: 'jobentry-03', type: 'choice', skills: ['jobentry.3'],
      prompt: 'What is a CV (curriculum vitae)?',
      options: [
        'A short written summary of your education, skills and work experience for employers',
        'A legal contract between you and an employer',
        'A certificate proving you passed an exam',
        'A letter asking for a pay rise'],
      answer: 0 },

    { id: 'jobentry-04', type: 'choice', skills: ['jobentry.3'],
      prompt: 'For an entry-level applicant, how long should a CV usually be?',
      options: ['One to two pages', 'At least ten pages', 'A single line', 'As long as possible to show effort'],
      answer: 0 },

    { id: 'jobentry-05', type: 'multi', skills: ['jobentry.3'],
      prompt: 'What should a good CV include? Select all that apply.',
      options: [
        'Your name and up-to-date contact details',
        'Education and qualifications',
        'Work experience and key skills',
        'Your national ID number, religion and a long list of hobbies',
        'Referees (or "available on request")'],
      answer: [0, 1, 2, 4] },

    { id: 'jobentry-06', type: 'multi', skills: ['jobentry.5'],
      prompt: 'Which of these are "don’ts" when writing a CV?',
      options: [
        'Including false or exaggerated qualifications',
        'Leaving spelling and grammar mistakes',
        'Using one tailored, clearly laid-out version per role',
        'Making it long, cluttered and hard to read',
        'Using an unprofessional email address like coolguy2000@...'],
      answer: [0, 1, 3, 4] },

    { id: 'jobentry-07', type: 'order', skills: ['jobentry.4'],
      prompt: 'Put the sections of a typical CV in a sensible order, top to bottom.',
      steps: [
        'Name and contact details',
        'Personal profile / career objective',
        'Education and qualifications',
        'Work experience',
        'Skills and referees'],
      answer: [0, 1, 2, 3, 4] },

    { id: 'jobentry-08', type: 'choice', skills: ['jobentry.6'],
      prompt: 'You addressed a cover letter "Dear Hiring Manager" because you do not know their name. How should you sign off?',
      options: ['Yours faithfully', 'Yours sincerely', 'Cheers', 'Love'],
      answer: 0, keepOrder: true },

    { id: 'jobentry-09', type: 'choice', skills: ['jobentry.6'],
      prompt: 'You addressed a cover letter "Dear Ms. Wanjiru" because you know her name. How should you sign off?',
      options: ['Yours sincerely', 'Yours faithfully', 'Bye for now', 'Regards buddy'],
      answer: 0, keepOrder: true },

    { id: 'jobentry-10', type: 'multi', skills: ['jobentry.6'],
      prompt: 'What should a job application / cover letter include?',
      options: [
        'The specific job you are applying for',
        'Why you are suitable — your relevant skills and experience',
        'A short, polite request for an interview',
        'Your entire life story in ten paragraphs',
        'Where you saw the advert'],
      answer: [0, 1, 2, 4] },

    { id: 'jobentry-11', type: 'multi', skills: ['jobentry.7'],
      prompt: 'What belongs in a portfolio of evidence?',
      options: [
        'Academic credentials (certificates and transcripts)',
        'Letters of commendation',
        'Certificates of participation',
        'Awards and decorations',
        'A photo of your lunch'],
      answer: [0, 1, 2, 3] },

    { id: 'jobentry-12', type: 'multi', skills: ['jobentry.8'],
      prompt: 'Which behaviours help you succeed in a job interview?',
      options: [
        'Arriving on time and being well groomed',
        'Listening carefully and answering the question asked',
        'Maintaining good eye contact and open body language',
        'Interrupting and talking over the interviewer',
        'Being honest about what you do and do not know'],
      answer: [0, 1, 2, 4] },

    { id: 'jobentry-13', type: 'choice', skills: ['jobentry.8'],
      prompt: 'An interviewer asks about a skill you have not yet learned. What is the best response?',
      options: [
        'Answer honestly, then say how quickly you learn and give an example',
        'Claim you are already an expert in it',
        'Say nothing and change the subject',
        'Argue that the skill is not important'],
      answer: 0 }

  ]);

})(window.DIGILIT);
