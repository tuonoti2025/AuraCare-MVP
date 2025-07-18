const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('stopAllVoice resets UI', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // simulate changed state
  const mainVoiceBtn = document.getElementById('mainVoiceBtn');
  const voiceStatus = document.getElementById('voiceStatus');
  mainVoiceBtn.textContent = 'changed';
  voiceStatus.textContent = 'speaking';

  // expose window functions from script
  const window = dom.window;
  // evaluate script inside the HTML
  const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const func = new Function('window','document', scriptContent + '; return { stopAllVoice };');
  const { stopAllVoice } = func(window, document);

  stopAllVoice();

  expect(mainVoiceBtn.textContent).toBe('🎤 Kokeile äänitoimintoja');
  expect(voiceStatus.textContent).toBe('');
});
