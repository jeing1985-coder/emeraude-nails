/* Основные настройки. Заполните реальными данными перед запуском студии. */
const SITE_CONFIG = {
  bookingUrl: '',
  telegramUrl: '',
  whatsappUrl: '',
  address: '',
  hours: ''
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner') && navigation.classList.contains('open')) closeMenu();
});
window.matchMedia('(min-width: 980px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const priceButton = document.querySelector('.price-toggle');
const pricePanel = document.querySelector('#price-panel');
priceButton.addEventListener('click', () => {
  const expanded = priceButton.getAttribute('aria-expanded') === 'true';
  pricePanel.hidden = expanded;
  priceButton.setAttribute('aria-expanded', String(!expanded));
  priceButton.firstChild.textContent = expanded ? 'Смотреть полный прайс ' : 'Свернуть прайс ';
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const works = [...document.querySelectorAll('.work')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(filter => {
    filter.classList.toggle('active', filter === button);
    filter.setAttribute('aria-pressed', String(filter === button));
  });
  works.forEach(work => {
    work.hidden = button.dataset.filter !== 'all' && !work.dataset.category.split(' ').includes(button.dataset.filter);
  });
  const count = works.filter(work => !work.hidden).length;
  document.querySelector('#filter-status').textContent = 'Фотографий в выбранной категории: ' + count;
}));

const lightbox = document.querySelector('#lightbox');
let photoTrigger;
works.forEach(work => work.addEventListener('click', () => {
  photoTrigger = work;
  const photo = work.querySelector('img');
  lightbox.querySelector('img').src = photo.getAttribute('src');
  lightbox.querySelector('img').alt = photo.alt;
  lightbox.querySelector('p').textContent = photo.alt;
  lightbox.showModal();
}));
lightbox.addEventListener('close', () => photoTrigger?.focus());
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

const notice = document.querySelector('#notice');
function showNotice(heading, message) {
  document.querySelector('#notice-heading').textContent = heading;
  document.querySelector('#notice-text').textContent = message;
  closeMenu();
  notice.showModal();
}
document.querySelector('.notice-ok').addEventListener('click', () => notice.close());
function configureLink(link, url, heading, message) {
  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      showNotice(heading, message);
    });
  }
}
document.querySelectorAll('.booking').forEach(link => configureLink(link, SITE_CONFIG.bookingUrl, 'Онлайн-запись', 'Ссылка для записи будет добавлена'));
configureLink(document.querySelector('[data-contact="telegram"]'), SITE_CONFIG.telegramUrl, 'Telegram', 'Контакт студии в Telegram будет добавлен');
configureLink(document.querySelector('[data-contact="whatsapp"]'), SITE_CONFIG.whatsappUrl, 'WhatsApp', 'Контакт студии в WhatsApp будет добавлен');
if (SITE_CONFIG.address || SITE_CONFIG.hours || SITE_CONFIG.telegramUrl || SITE_CONFIG.whatsappUrl) {
  const contactDetails = document.querySelector('.contact-details p');
  contactDetails.textContent = [SITE_CONFIG.address, SITE_CONFIG.hours].filter(Boolean).join(' · ');
  [['Telegram', SITE_CONFIG.telegramUrl], ['WhatsApp', SITE_CONFIG.whatsappUrl]].forEach(([name, url]) => {
    if (!url) return;
    const link = document.createElement('a');
    link.textContent = name;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (contactDetails.textContent) contactDetails.append(document.createTextNode(' · '));
    contactDetails.append(link);
  });
}

/* Два отзыва видны на компьютере; на телефоне — один с ручным переключением. */
const reviewCards = [...document.querySelectorAll('.review-card')];
const reviewCarousel = document.querySelector('.review-carousel');
const previousReview = document.querySelector('.review-arrow.previous');
const nextReview = document.querySelector('.review-arrow.next');
const reviewDots = [...document.querySelectorAll('.review-dots button')];
const reviewMobile = window.matchMedia('(max-width: 767px)');
let reviewIndex = 0;
function renderReviews() {
  const oneAtATime = reviewMobile.matches;
  const showControls = oneAtATime && reviewCards.length > 1;
  reviewCards.forEach((card, index) => {
    card.hidden = oneAtATime && index !== reviewIndex;
    card.setAttribute('aria-label', 'Отзыв ' + (index + 1) + ' из ' + reviewCards.length);
  });
  previousReview.hidden = nextReview.hidden = !showControls;
  reviewCarousel.classList.toggle('static', !showControls);
  document.querySelector('.review-dots').hidden = !showControls;
  reviewDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === reviewIndex);
    dot.setAttribute('aria-pressed', String(index === reviewIndex));
  });
}
function selectReview(index) {
  reviewIndex = (index + reviewCards.length) % reviewCards.length;
  renderReviews();
}
previousReview.addEventListener('click', () => selectReview(reviewIndex - 1));
nextReview.addEventListener('click', () => selectReview(reviewIndex + 1));
reviewDots.forEach((dot, index) => dot.addEventListener('click', () => selectReview(index)));
reviewMobile.addEventListener('change', renderReviews);
renderReviews();
