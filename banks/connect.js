/* Internet Connection Options (LO1) — item bank. Original tasks.
   Covers the connection options the curriculum names — mobile data, hotspots,
   cabled Ethernet/fibre, dial-up, satellite — plus connecting to a network and
   managing an external device. */
(function (D) {
  'use strict';

  D.registerItems('connect', [

    { id: 'connect-01', type: 'match', skills: ['connect.1', 'connect.3', 'connect.4', 'connect.5'],
      prompt: 'Match each way of getting online to the thing that best describes it.',
      left: [
        'Mobile data bundle on a phone or modem',
        'Wireless hotspot',
        'Cabled Ethernet or fibre',
        'Dial-up over a telephone line',
        'Satellite'],
      right: [
        'Uses the cellular network; you pay for a bundle of MB or GB',
        'Shares one device’s connection with nearby devices over Wi-Fi',
        'A physical cable — usually the fastest and most stable',
        'Very old and very slow; it ties up the phone line while in use',
        'Reaches remote areas that have no cable and little cell coverage'],
      answer: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } },

    { id: 'connect-02', type: 'choice', skills: ['connect.2'],
      prompt: 'A trainee turns on the "Mobile hotspot" feature on their phone. What does this do?',
      options: [
        'It shares the phone’s internet connection so a laptop can get online through it',
        'It makes the phone’s screen brighter to save battery',
        'It downloads all the phone’s photos to the laptop',
        'It connects the phone to a nearby printer only'],
      answer: 0 },

    { id: 'connect-03', type: 'choice', skills: ['connect.3'],
      prompt: 'The computer lab needs the most stable, high-speed connection for 25 machines downloading large files. Which option is best?',
      options: [
        'A cabled fibre/Ethernet connection',
        'A single phone’s mobile data bundle',
        'Dial-up',
        'One phone acting as a hotspot for all 25'],
      answer: 0 },

    { id: 'connect-04', type: 'choice', skills: ['connect.4'],
      prompt: 'Which statement about dial-up internet is TRUE?',
      options: [
        'It is slow and you cannot use the phone line for calls while connected',
        'It is the fastest connection available today',
        'It needs a satellite dish on the roof',
        'It works only inside fibre-covered towns'],
      answer: 0 },

    { id: 'connect-05', type: 'choice', skills: ['connect.5', 'connect.6'],
      prompt: 'A health post in a remote area has no fibre, no copper line and very weak mobile signal. Which connection is most suitable?',
      options: ['Satellite', 'Dial-up', 'Cabled Ethernet', 'A neighbour’s hotspot'],
      answer: 0 },

    { id: 'connect-06', type: 'multi', skills: ['connect.6'],
      prompt: 'You are choosing an internet connection for a small shop. Which factors sensibly affect your choice?',
      options: [
        'The cost of the connection and its data bundles',
        'The speed and reliability you need',
        'Whether the area has fibre, cell or only satellite coverage',
        'The colour of the router',
        'How many devices need to connect at once'],
      answer: [0, 1, 2, 4] },

    { id: 'connect-07', type: 'choice', skills: ['connect.7'],
      prompt: 'You have finished copying files to a USB flash drive on Windows. What is the safe way to remove it?',
      options: [
        'Use "Safely Remove Hardware" / "Eject" first, then pull it out',
        'Pull it out straight away while the files are still copying',
        'Shut the whole computer down by holding the power button',
        'Delete the files first, then pull it out'],
      answer: 0 },

    /* ---- simulation: connect to the correct Wi-Fi network ---- */

    { id: 'connect-08', type: 'sim', env: 'os', skills: ['connect.2', 'connect.6'],
      prompt: 'Connect the computer to the RVNP-Trainees wireless network.',
      note: 'Quick settings on the taskbar, or Settings › Network & internet. The key is accepted for you.',
      setup: { flavour: 'win11', settings: { wifi: null } },
      check: function (s) { return s.settings.wifi === 'RVNP-Trainees'; } },

    { id: 'connect-09', type: 'sim', env: 'os', skills: ['connect.6', 'connect.7'],
      prompt: 'The lab has an open café network and a secured staff network. Avoid the unsecured one: connect to RVNP-Staff instead.',
      note: 'Open networks marked "not secure" expose your traffic. Prefer a secured network.',
      setup: { flavour: 'win11', settings: { wifi: null } },
      check: function (s) { return s.settings.wifi === 'RVNP-Staff'; } }

  ]);

})(window.DIGILIT);
