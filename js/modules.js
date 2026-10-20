/* DigiLit — module map and skill standards.
   Structured as the Kenyan CDACC/TVET unit "Apply Digital Literacy"
   (Level 5/6, ISCED 0611 541 01B, 80 hrs). The seven Learning Outcomes are the
   top-level categories; each LO's content areas are the modules under it. Two
   modules that RVNP keeps but that sit outside the official unit are grouped
   separately and labelled. Standards wording is original. */
(function (D) {
  'use strict';

  D.registerCategories([
    { id: 'lo1-devices', name: 'LO1 · Operate Computer Devices',
      blurb: 'The machine itself: hardware, ports, the operating system, files and getting online.' },
    { id: 'lo2-office', name: 'LO2 · Solve Tasks Using the Office Suite',
      blurb: 'Producing documents, spreadsheets and presentations other people can use.' },
    { id: 'lo3-data', name: 'LO3 · Manage Data and Information',
      blurb: 'Internet services, browsing, judging what you find, and backing work up.' },
    { id: 'lo4-comms', name: 'LO4 · Online Communication and Collaboration',
      blurb: 'Email, netiquette, shared drives and documents, meetings, calendars and social networks.' },
    { id: 'lo5-cyber', name: 'LO5 · Apply Cybersecurity Skills',
      blurb: 'Protecting data, recognising threats and controls, and the Kenyan laws that govern ICT.' },
    { id: 'lo6-jobs', name: 'LO6 · Perform Online Jobs',
      blurb: 'Online work platforms, profiles, bidding, executing tasks and getting paid.' },
    { id: 'lo7-entry', name: 'LO7 · Apply Job Entry Techniques',
      blurb: 'Finding opportunities, CVs, cover letters, a portfolio of evidence and interviews.' },
    { id: 'rvnp-ext', name: 'RVNP Extensions · beyond the unit',
      blurb: 'Kept because the Kenyan context needs them; not part of the official unit.' }
  ]);

  /* M(id, category, name, inUnit, blurb, standards)
     inUnit=true  → part of the official CDACC unit (no badge)
     inUnit=false → an RVNP extension (badged "beyond the unit") */
  function M(id, category, name, inUnit, blurb, standards) {
    return D.registerModule({
      id: id, category: category, name: name, mirrors: inUnit,
      blurb: blurb, standards: standards
    });
  }

  /* ===================== LO1 · Operate Computer Devices ===================== */

  M('bcs', 'lo1-devices', 'Basic Computer Skills', true,
    'Digital literacy, the parts of a computer, ports, storage, software and the operating system.', [
      { id: 'bcs.1',  text: 'Tell hardware apart from software' },
      { id: 'bcs.2',  text: 'Name the main parts of a desktop or laptop computer' },
      { id: 'bcs.3',  text: 'Sort devices into input, output and storage' },
      { id: 'bcs.4',  text: 'Identify common ports (HDMI, DVI, VGA, USB type C) and what plugs into each' },
      { id: 'bcs.5',  text: 'Use mouse actions: click, double-click, right-click and drag' },
      { id: 'bcs.6',  text: 'Use keyboard keys with a specific purpose (Enter, Shift, Backspace, Caps Lock)' },
      { id: 'bcs.7',  text: 'Start a program and close a window' },
      { id: 'bcs.8',  text: 'Recognise window controls: minimise, maximise and close' },
      { id: 'bcs.9',  text: 'Shut a computer down correctly rather than cutting power' },
      { id: 'bcs.10', text: 'Explain what an operating system does and its functions' },
      { id: 'bcs.11', text: 'Compare storage capacities and pick the right medium' },
      { id: 'bcs.12', text: 'Adjust basic settings such as volume, brightness and wallpaper' },
      { id: 'bcs.13', text: 'Explain the meaning and importance of digital literacy' },
      { id: 'bcs.14', text: 'Describe the functions and uses of computers' },
      { id: 'bcs.15', text: 'Classify computers by type and size (super, mainframe, mini, micro)' },
      { id: 'bcs.16', text: 'Classify software into system software and application software' }
    ]);

  M('win10', 'lo1-devices', 'Windows 10 Skills', true,
    'Desktop, Start menu, taskbar, File Explorer and settings on Windows 10.', [
      { id: 'win10.1', text: 'Sign in and sign out of a user account' },
      { id: 'win10.2', text: 'Use the Start menu to find and launch a program' },
      { id: 'win10.3', text: 'Use the taskbar to switch between open programs' },
      { id: 'win10.4', text: 'Resize, move, snap and close windows' },
      { id: 'win10.5', text: 'Create, rename and delete folders' },
      { id: 'win10.6', text: 'Copy, cut, paste and move files between folders' },
      { id: 'win10.7', text: 'Search for a file by name' },
      { id: 'win10.8', text: 'Recover a file from the Recycle Bin' },
      { id: 'win10.9', text: 'Work with removable storage safely, including ejecting it' },
      { id: 'win10.10', text: 'Change settings through the Settings app' },
      { id: 'win10.11', text: 'Connect to a wireless network' },
      { id: 'win10.12', text: 'Shut down, restart and lock the computer' }
    ]);

  M('win11', 'lo1-devices', 'Windows 11 Skills', true,
    'The same ground as Windows 10 against the centred Start and revised Settings layout.', [
      { id: 'win11.1', text: 'Sign in and sign out of a user account' },
      { id: 'win11.2', text: 'Use the centred Start menu and pinned apps' },
      { id: 'win11.3', text: 'Use the taskbar and Task View to switch between programs' },
      { id: 'win11.4', text: 'Use snap layouts to arrange windows' },
      { id: 'win11.5', text: 'Create, rename and delete folders' },
      { id: 'win11.6', text: 'Copy, cut, paste and move files between folders' },
      { id: 'win11.7', text: 'Search for a file or an app from the taskbar' },
      { id: 'win11.8', text: 'Recover a file from the Recycle Bin' },
      { id: 'win11.9', text: 'Use quick settings for network, sound and brightness' },
      { id: 'win11.10', text: 'Change settings through the Settings app' },
      { id: 'win11.11', text: 'Manage notifications and focus' },
      { id: 'win11.12', text: 'Shut down, restart and lock the computer' }
    ]);

  M('connect', 'lo1-devices', 'Internet Connection Options', true,
    'The ways a computer gets online — mobile data, hotspots, cable, dial-up and satellite — and external devices.', [
      { id: 'connect.1', text: 'Describe mobile network data plans as a way to get online' },
      { id: 'connect.2', text: 'Set up and connect to a wireless hotspot' },
      { id: 'connect.3', text: 'Connect using a cabled Ethernet or fibre link' },
      { id: 'connect.4', text: 'Describe a dial-up connection and its limitations' },
      { id: 'connect.5', text: 'Describe satellite internet and when it is used' },
      { id: 'connect.6', text: 'Choose a suitable connection option for a given situation' },
      { id: 'connect.7', text: 'Connect, control and safely manage an external device' }
    ]);

  /* ===================== LO2 · Solve Tasks Using the Office Suite ===================== */

  M('word', 'lo2-office', 'Word Processing', true,
    'Creating, formatting, saving and printing documents in a word processor.', [
      { id: 'word.1',  text: 'Create, open and save a document, and use Save As' },
      { id: 'word.2',  text: 'Identify ribbon, tabs, groups and the quick access toolbar' },
      { id: 'word.3',  text: 'Enter, select and edit text' },
      { id: 'word.4',  text: 'Apply bold, italic and underline' },
      { id: 'word.5',  text: 'Change font, size and colour' },
      { id: 'word.6',  text: 'Align paragraphs and adjust spacing' },
      { id: 'word.7',  text: 'Create bulleted and numbered lists' },
      { id: 'word.8',  text: 'Cut, copy, paste and undo' },
      { id: 'word.9',  text: 'Insert and format a table' },
      { id: 'word.10', text: 'Insert a picture or drawn object and position it' },
      { id: 'word.11', text: 'Add headers, footers and page numbers' },
      { id: 'word.12', text: 'Run spelling and grammar checks' },
      { id: 'word.13', text: 'Set margins and page orientation' },
      { id: 'word.14', text: 'Preview and print a document' }
    ]);

  M('excel', 'lo2-office', 'Spreadsheets', true,
    'Cells, formulas, functions, sorting, filtering and charts in an electronic spreadsheet.', [
      { id: 'excel.1',  text: 'Identify rows, columns, cells, the name box and the formula bar' },
      { id: 'excel.2',  text: 'Enter text, numbers and dates into cells' },
      { id: 'excel.3',  text: 'Select ranges and use fill to copy a pattern' },
      { id: 'excel.4',  text: 'Write a formula using cell references rather than typed values' },
      { id: 'excel.5',  text: 'Use SUM, AVERAGE, COUNT, MAX and MIN' },
      { id: 'excel.6',  text: 'Use IF, SUMIF, RANK, PRODUCT and MODE' },
      { id: 'excel.7',  text: 'Copy a formula and understand relative references' },
      { id: 'excel.8',  text: 'Format cells: number, currency, decimals, borders and shading' },
      { id: 'excel.9',  text: 'Insert and delete rows and columns' },
      { id: 'excel.10', text: 'Sort data on one or more columns' },
      { id: 'excel.11', text: 'Filter data to show matching rows only' },
      { id: 'excel.12', text: 'Create and label a chart from a range' },
      { id: 'excel.13', text: 'Rename, add and move worksheets' },
      { id: 'excel.14', text: 'Prepare a sheet for printing' }
    ]);

  M('ppt', 'lo2-office', 'Presentations', true,
    'Slides, layouts, text, images, transitions and delivering a show.', [
      { id: 'ppt.1',  text: 'Create a presentation and add slides' },
      { id: 'ppt.2',  text: 'Choose an appropriate slide layout' },
      { id: 'ppt.3',  text: 'Enter and format title and body text' },
      { id: 'ppt.4',  text: 'Apply a design theme' },
      { id: 'ppt.5',  text: 'Insert pictures, shapes and tables' },
      { id: 'ppt.6',  text: 'Reorder, duplicate and delete slides' },
      { id: 'ppt.7',  text: 'Add speaker notes' },
      { id: 'ppt.8',  text: 'Apply transitions and simple animation' },
      { id: 'ppt.9',  text: 'Run a slide show and navigate during it' },
      { id: 'ppt.10', text: 'Save and print handouts' }
    ]);

  /* ===================== LO3 · Manage Data and Information ===================== */

  M('datainfo', 'lo3-data', 'Data and Information', true,
    'What data and information are, the services the internet provides, and keeping work safe with backups.', [
      { id: 'datainfo.1', text: 'Explain the difference between data and information' },
      { id: 'datainfo.2', text: 'Describe the importance and uses of data and information' },
      { id: 'datainfo.3', text: 'Identify types of internet services (communication, retrieval, file transfer, web, e-commerce)' },
      { id: 'datainfo.4', text: 'Explain World Wide Web and web services' },
      { id: 'datainfo.5', text: 'Explain e-commerce and give examples' },
      { id: 'datainfo.6', text: 'Perform a digital data backup, both online and offline' },
      { id: 'datainfo.7', text: 'Identify emerging issues in the use of the internet' }
    ]);

  M('net', 'lo3-data', 'Internet Basics and Web Browsing', true,
    'Browsers, addresses, searching, links, bookmarks, cache and downloads.', [
      { id: 'net.1',  text: 'Tell a browser apart from a search engine' },
      { id: 'net.2',  text: 'Read a web address (URI) and identify its parts' },
      { id: 'net.3',  text: 'Navigate to a site by typing its address' },
      { id: 'net.4',  text: 'Use back, forward, reload and home controls' },
      { id: 'net.5',  text: 'Open, switch between and close browser tabs' },
      { id: 'net.6',  text: 'Search with keywords and refine a search that returns too much' },
      { id: 'net.7',  text: 'Recognise a hyperlink and follow it' },
      { id: 'net.8',  text: 'Spot adverts and sponsored results among genuine results' },
      { id: 'net.9',  text: 'Check whether a connection is secure before entering details' },
      { id: 'net.10', text: 'Download a file and find it afterwards' },
      { id: 'net.11', text: 'Use bookmarks or favourites to save a page' },
      { id: 'net.12', text: 'Clear cache, cookies and browsing history and explain why' }
    ]);

  M('infolit', 'lo3-data', 'Information Literacy', true,
    'Evaluating sources, spotting bias and misinformation, copyright and citing what you use.', [
      { id: 'infolit.1', text: 'Tell fact from opinion in a source' },
      { id: 'infolit.2', text: 'Identify who published something and why' },
      { id: 'infolit.3', text: 'Check a claim against a second independent source' },
      { id: 'infolit.4', text: 'Recognise clickbait and emotionally loaded headlines' },
      { id: 'infolit.5', text: 'Spot altered or out-of-context images' },
      { id: 'infolit.6', text: 'Judge whether a source is current enough to use' },
      { id: 'infolit.7', text: 'Distinguish advertising and sponsored content from editorial' },
      { id: 'infolit.8', text: 'Respect copyright and data protection; credit a source rather than copying it' }
    ]);

  /* ===================== LO4 · Online Communication and Collaboration ===================== */

  M('email', 'lo4-comms', 'Using Email', true,
    'Composing, replying, attaching, organising and handling suspicious mail.', [
      { id: 'email.1',  text: 'Identify the parts of an email address' },
      { id: 'email.2',  text: 'Compose and send a message to one recipient' },
      { id: 'email.3',  text: 'Use To, Cc and Bcc appropriately' },
      { id: 'email.4',  text: 'Write a subject line that describes the message' },
      { id: 'email.5',  text: 'Reply to a sender and reply to everyone, choosing correctly' },
      { id: 'email.6',  text: 'Forward a message to someone else' },
      { id: 'email.7',  text: 'Attach a file and confirm it is attached before sending' },
      { id: 'email.8',  text: 'Open and save an attachment you have received' },
      { id: 'email.9',  text: 'Tell read messages from unread ones' },
      { id: 'email.10', text: 'Delete, archive and recover messages' },
      { id: 'email.11', text: 'Recognise spam and phishing attempts' },
      { id: 'email.12', text: 'Organise mail into folders and search for a message' }
    ]);

  M('collab', 'lo4-comms', 'Online Collaboration', true,
    'Netiquette, shared online storage and documents, meetings and calendars — the Google Workspace way of working together.', [
      { id: 'collab.1', text: 'Apply netiquette principles in online communication' },
      { id: 'collab.2', text: 'Identify online communities and the right communication tool for a purpose' },
      { id: 'collab.3', text: 'Store, organise and share files using online storage (Google Drive)' },
      { id: 'collab.4', text: 'Create and share an online productivity file (Google Docs or Forms)' },
      { id: 'collab.5', text: 'Set up and join an online meeting (Google Meet or Zoom)' },
      { id: 'collab.6', text: 'Schedule an event and invite others using an online calendar' },
      { id: 'collab.7', text: 'Understand digital content copyright and licences when sharing' },
      { id: 'collab.8', text: 'Set up and synchronise collaboration from a mobile device' }
    ]);

  M('clouddocs', 'lo4-comms', 'Cloud Documents', true,
    'Working in browser-based documents: autosave, sharing, comments and version history.', [
      { id: 'clouddocs.1',  text: 'Create a document in a browser-based editor' },
      { id: 'clouddocs.2',  text: 'Understand autosave and where the file is stored' },
      { id: 'clouddocs.3',  text: 'Format text and paragraphs' },
      { id: 'clouddocs.4',  text: 'Share a document and choose view, comment or edit access' },
      { id: 'clouddocs.5',  text: 'Add, reply to and resolve comments' },
      { id: 'clouddocs.6',  text: 'Use suggesting mode and accept or reject suggestions' },
      { id: 'clouddocs.7',  text: 'Restore an earlier version from history' },
      { id: 'clouddocs.8',  text: 'Download or export to another format' },
      { id: 'clouddocs.9',  text: 'Work offline and sync when reconnected' },
      { id: 'clouddocs.10', text: 'Organise files into folders in cloud storage' }
    ]);

  M('social', 'lo4-comms', 'Social Networks', true,
    'Profiles, posting, privacy and settings, and conduct in public and group spaces.', [
      { id: 'social.1',  text: 'Set up a profile and choose what it shows publicly' },
      { id: 'social.2',  text: 'Post, edit and delete content' },
      { id: 'social.3',  text: 'Adjust privacy and audience settings' },
      { id: 'social.4',  text: 'Manage connections, followers and requests' },
      { id: 'social.5',  text: 'Recognise and report harassment or abuse' },
      { id: 'social.6',  text: 'Judge whether something is appropriate to post' },
      { id: 'social.7',  text: 'Spot scam accounts and fake offers' },
      { id: 'social.8',  text: 'Understand that posts can persist and be shared onward' }
    ]);

  M('distlearn', 'lo4-comms', 'Online Learning Environments', true,
    'Joining classes, finding and submitting work, and taking part in a learning platform.', [
      { id: 'distlearn.1', text: 'Sign in to a learning platform' },
      { id: 'distlearn.2', text: 'Join a scheduled online class' },
      { id: 'distlearn.3', text: 'Find assignments and their due dates' },
      { id: 'distlearn.4', text: 'Submit work as a file or typed response' },
      { id: 'distlearn.5', text: 'Check marks and teacher feedback' },
      { id: 'distlearn.6', text: 'Message a teacher appropriately' },
      { id: 'distlearn.7', text: 'Troubleshoot audio, video and connection problems' },
      { id: 'distlearn.8', text: 'Set up a workable study space and routine' }
    ]);

  /* ===================== LO5 · Apply Cybersecurity Skills ===================== */

  M('cyberlaw', 'lo5-cyber', 'Cyber Threats, Controls and Kenyan Law', true,
    'Data protection principles, the main internet threats, the controls that stop them, and the Kenyan laws governing ICT.', [
      { id: 'cyberlaw.1',  text: 'Explain confidentiality, integrity and availability of data (the CIA triad)' },
      { id: 'cyberlaw.2',  text: 'Identify malware attacks' },
      { id: 'cyberlaw.3',  text: 'Recognise social engineering attacks' },
      { id: 'cyberlaw.4',  text: 'Describe denial-of-service and distributed denial-of-service (DDoS) attacks' },
      { id: 'cyberlaw.5',  text: 'Describe man-in-the-middle (MitM) attacks' },
      { id: 'cyberlaw.6',  text: 'Describe password attacks' },
      { id: 'cyberlaw.7',  text: 'Describe IoT (Internet of Things) attacks' },
      { id: 'cyberlaw.8',  text: 'Recognise phishing attacks' },
      { id: 'cyberlaw.9',  text: 'Describe ransomware and its effect' },
      { id: 'cyberlaw.10', text: 'Classify controls as physical, technical/logical or operational' },
      { id: 'cyberlaw.11', text: 'Apply the Computer Misuse and Cybercrimes Act No. 5 of 2018' },
      { id: 'cyberlaw.12', text: 'Apply the Data Protection Act No. 24 of 2019' }
    ]);

  M('cybersafe', 'lo5-cyber', 'Cybersecurity and Safe Practice', true,
    'Passwords, updates, malware, backups and safe public Wi-Fi use in practice.', [
      { id: 'cybersafe.1', text: 'Create and manage strong passwords' },
      { id: 'cybersafe.2', text: 'Turn on two-step verification' },
      { id: 'cybersafe.3', text: 'Recognise phishing and social engineering' },
      { id: 'cybersafe.4', text: 'Keep software and antivirus updated' },
      { id: 'cybersafe.5', text: 'Spot the signs of a malware infection' },
      { id: 'cybersafe.6', text: 'Back up important files' },
      { id: 'cybersafe.7', text: 'Use public Wi-Fi safely' },
      { id: 'cybersafe.8', text: 'Lock devices and handle a lost or stolen device' }
    ]);

  M('footprint', 'lo5-cyber', 'Your Digital Footprint', true,
    'What you leave behind online, who can see it, and how to protect your privacy.', [
      { id: 'footprint.1', text: 'Explain what a digital footprint is' },
      { id: 'footprint.2', text: 'Tell active traces from passive ones' },
      { id: 'footprint.3', text: 'Search for yourself and read what is public' },
      { id: 'footprint.4', text: 'Review and tighten privacy settings on an account' },
      { id: 'footprint.5', text: 'Understand how cookies and trackers follow activity' },
      { id: 'footprint.6', text: 'Judge what employers and institutions may see' },
      { id: 'footprint.7', text: 'Request removal of content about you' },
      { id: 'footprint.8', text: 'Use strong, distinct passwords and two-step verification' }
    ]);

  /* ===================== LO6 · Perform Online Jobs ===================== */

  M('onlinejobs', 'lo6-jobs', 'Perform Online Jobs', true,
    'Online work: the platforms, setting up a profile, finding and bidding for tasks, doing them and getting paid.', [
      { id: 'onlinejobs.1', text: 'Explain online working and weigh its advantages and risks' },
      { id: 'onlinejobs.2', text: 'Identify common types of online jobs' },
      { id: 'onlinejobs.3', text: 'Identify online job platforms (Remotask, Data Annotation Tech, Cloudworker, Upwork, Oneforma, Appen)' },
      { id: 'onlinejobs.4', text: 'Create and manage an online account and profile' },
      { id: 'onlinejobs.5', text: 'Identify suitable online jobs and bid for work' },
      { id: 'onlinejobs.6', text: 'Build and protect an online digital identity' },
      { id: 'onlinejobs.7', text: 'Execute an online task accurately to the instructions' },
      { id: 'onlinejobs.8', text: 'Manage an online payment account safely' }
    ]);

  /* ===================== LO7 · Apply Job Entry Techniques ===================== */

  M('jobentry', 'lo7-entry', 'Job Entry Techniques', true,
    'Kinds of opportunity, the CV, the cover letter, a portfolio of evidence, and interview skills.', [
      { id: 'jobentry.1', text: 'Identify types of job opportunity: self-employment, service provision, product development, salaried' },
      { id: 'jobentry.2', text: 'Identify sources of job opportunities' },
      { id: 'jobentry.3', text: 'Explain what a CV is, how long it should be and what to include' },
      { id: 'jobentry.4', text: 'Apply a correct CV format and good writing practice' },
      { id: 'jobentry.5', text: 'Recognise the don’ts of writing a CV' },
      { id: 'jobentry.6', text: 'Write a job application / cover letter: content, addressing and signing off' },
      { id: 'jobentry.7', text: 'Assemble a portfolio of evidence (credentials, commendations, certificates, awards)' },
      { id: 'jobentry.8', text: 'Demonstrate interview skills: grooming, body language, articulation, time management, honesty' }
    ]);

  M('career', 'lo7-entry', 'Online Job Search and Application', true,
    'Finding vacancies, preparing documents for upload, applying online and following up.', [
      { id: 'career.1', text: 'Search and filter online job listings' },
      { id: 'career.2', text: 'Read a job advert and identify the requirements' },
      { id: 'career.3', text: 'Prepare a CV as a file suitable for upload' },
      { id: 'career.4', text: 'Complete an online application form accurately' },
      { id: 'career.5', text: 'Upload documents in the format requested' },
      { id: 'career.6', text: 'Write a professional email to an employer' },
      { id: 'career.7', text: 'Keep track of applications and deadlines' },
      { id: 'career.8', text: 'Recognise recruitment scams that ask for payment' },
      { id: 'career.9', text: 'Prepare for and join an online interview' }
    ]);

  /* ===================== RVNP Extensions · beyond the official unit ===================== */

  M('payments', 'rvnp-ext', 'Mobile Money and Digital Payments', false,
    'Sending, receiving, paying and avoiding payment fraud. An RVNP addition for the Kenyan context.', [
      { id: 'payments.1', text: 'Send and receive money on a mobile money service' },
      { id: 'payments.2', text: 'Pay a bill or till using a paybill or till number' },
      { id: 'payments.3', text: 'Read a transaction message and confirm it is genuine' },
      { id: 'payments.4', text: 'Check a balance and a statement' },
      { id: 'payments.5', text: 'Protect a PIN and recognise PIN-request scams' },
      { id: 'payments.6', text: 'Reverse or report a wrong transaction' },
      { id: 'payments.7', text: 'Judge whether an online seller is legitimate before paying' }
    ]);

  M('telehealth', 'rvnp-ext', 'Accessing Health Appointments Online', false,
    'Booking, joining and following up a remote consultation, and handling health data. An RVNP addition.', [
      { id: 'telehealth.1', text: 'Book an appointment through a patient portal' },
      { id: 'telehealth.2', text: 'Test camera, microphone and connection beforehand' },
      { id: 'telehealth.3', text: 'Join a video consultation from a link' },
      { id: 'telehealth.4', text: 'Choose a private, well-lit place for a consultation' },
      { id: 'telehealth.5', text: 'Read results or notes in a portal' },
      { id: 'telehealth.6', text: 'Send a secure message to a provider' },
      { id: 'telehealth.7', text: 'Protect personal health information' }
    ]);

})(window.DIGILIT);
