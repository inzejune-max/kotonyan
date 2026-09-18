// Собирает en/index.html из index.html и словаря i18n/en.json.
// Запуск: node build.js  (после любой правки index.html или en.json)
const fs = require('fs');
const path = require('path');

const root = __dirname;
const SITE = 'https://inzejune-max.github.io/kotonyan/';

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const en = JSON.parse(fs.readFileSync(path.join(root, 'i18n', 'en.json'), 'utf8'));

const missing = [];

// Текст элементов с data-i18n
html = html.replace(/(<[^>]*\bdata-i18n="([^"]+)"[^>]*>)([^<]*)(<)/g, (m, open, key, text, close) => {
  if (en[key] === undefined) { missing.push(key); return m; }
  return open + en[key] + close;
});

// alt у картинок: alt="..." идёт раньше data-i18n-alt
html = html.replace(/alt="[^"]*"([^>]*\bdata-i18n-alt="([^"]+)")/g, (m, rest, key) => {
  if (en[key] === undefined) { missing.push(key); return m; }
  return 'alt="' + en[key] + '"' + rest;
});

// content у meta description: data-i18n-content идёт раньше content
html = html.replace(/(\bdata-i18n-content="([^"]+)"[^>]*\bcontent=")[^"]*"/g, (m, pre, key) => {
  if (en[key] === undefined) { missing.push(key); return m; }
  return pre + en[key] + '"';
});

// Open Graph и язык документа
html = html
  .replace('<html lang="ru">', '<html lang="en">')
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${en['meta.title']}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${en['og.desc']}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${SITE}en/">`);

// Пути к ресурсам из подпапки
html = html
  .replace(/href="css\//g, 'href="../css/')
  .replace(/src="js\//g, 'src="../js/')
  .replace(/src="img\//g, 'src="../img/')
  .replace('href="favicon.svg"', 'href="../favicon.svg"');

// Переключатель языка
html = html
  .replace('<a href="./#ru" data-lang="ru" class="is-active">RU</a>', '<a href="../#ru" data-lang="ru">RU</a>')
  .replace('<a href="en/" data-lang="en">EN</a>', '<a href="./" data-lang="en" class="is-active">EN</a>');

if (missing.length) {
  console.error('Нет перевода для ключей:', [...new Set(missing)].join(', '));
  process.exit(1);
}

fs.mkdirSync(path.join(root, 'en'), { recursive: true });
fs.writeFileSync(path.join(root, 'en', 'index.html'), html);
console.log('en/index.html собран');
