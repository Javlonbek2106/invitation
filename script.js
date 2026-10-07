const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const openInviteBtn = document.getElementById("openInviteBtn");
const letterHero = document.getElementById("letterHero");
const languageSwitcher = document.querySelector(".language-switcher");
const languageButtons = document.querySelectorAll(".language-option");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const backgroundMusic = document.getElementById("backgroundMusic");

const WEDDING_TIME = "18:00";
const targetWeddingDate = new Date(`2026-11-08T${WEDDING_TIME}:00+05:00`).getTime();
// Cloudflare Worker manzili (worker/rsvp-worker.js). Bo'sh bo'lsa RSVP bo'limi ko'rinmaydi.
const RSVP_ENDPOINT = "";
// Aloqa telefoni, masalan "+998901234567". Bo'sh bo'lsa aloqa qatori ko'rinmaydi.
const CONTACT_PHONE = "";
const OPENING_DURATION_MS = 1000;
const DEFAULT_LANGUAGE = "uz";
const LANGUAGE_STORAGE_KEY = "weddingInvitationLanguage";
const MUSIC_VOLUME = 0.16;
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
const ONE_DAY_MS = ONE_HOUR_MS * 24;

const LOCALES = {
  ru: {
    pageTitle: "Джамшидбек и Чарос | Свадебное приглашение",
    metaDescription: "Свадебное приглашение Джамшидбека и Чарос на 8 ноября 2026 года.",
    ariaIntro: "Конверт с приглашением",
    ariaEnvelope: "Запечатанный бумажный конверт",
    ariaWeddingDate: "Дата свадьбы",
    ariaCalendar: "Календарь ноября 2026 с выделенным 8 ноября",
    ariaWeddingDay: "День свадьбы",
    ariaOrnamentHero: "Традиционная страница с именами молодоженов",
    ariaVenueDetails: "Место проведения",
    ariaCountdown: "Обратный отсчет",
    ariaRsvp: "Подтверждение присутствия",
    envelopeTopNote:
      "<span class=\"flap-note-top\">ВЫ</span><span class=\"flap-note-middle\">ПРИГЛАШАЕМ</span><span class=\"flap-note-script\">вас на свадьбу</span>",
    withLove: "с любовью,",
    signatureNames: "Джамшидбек\u00a0и\u00a0Чарос",
    ornamentNames:
      "<span class=\"ornament-name-line\">Джамшидбек</span><span class=\"ornament-name-amp\">и</span><span class=\"ornament-name-line\">Чарос</span>",
    heroNames: "Дорогие&nbsp;наши<br />родные&nbsp;и&nbsp;<span class=\"no-break\">близкие!</span>",
    openHere: "нажмите",
    lead: "В этот прекрасный день мы соединяем наши сердца и начинаем новую историю — историю нашей любви.<br /><br />Нам будет очень приятно разделить радость этого особенного вечера вместе с вами.<br /><br /><strong>С любовью и трепетом ждём вас на нашей свадьбе.</strong>",
    scrollHint: "Прокрутите вниз",
    calendarMonth: "Ноябрь, 2026",
    weekdayMon: "ПН",
    weekdayTue: "ВТ",
    weekdayWed: "СР",
    weekdayThu: "ЧТ",
    weekdayFri: "ПТ",
    weekdaySat: "СБ",
    weekdaySun: "ВС",
    eventTimeLabel: "Начало в",
    locationTitle: "Место проведения",
    venueName: "ресторан ТУРКИСТОН",
    venueAddress: "Ташкентская область",
    venueLandmark: "Ресторан: Туркистон.",
    mapLinkYandex: "Яндекс Карты",
    mapLinkGoogle: "Google Maps",
    contactLabel: "Если есть вопросы:",
    rsvpTitle: "Подтвердите присутствие",
    rsvpLead: "Чтобы мы могли всё подготовить, пожалуйста, сообщите, сможете ли вы прийти.",
    rsvpNameLabel: "Ваше имя",
    rsvpNamePlaceholder: "Имя и фамилия",
    rsvpAttendingLegend: "Вы придёте?",
    rsvpYes: "Обязательно приду",
    rsvpNo: "К сожалению, не смогу",
    rsvpGuestsLabel: "Сколько человек придёт (включая вас)?",
    rsvpNoteLabel: "Пожелание или комментарий (необязательно)",
    rsvpSubmit: "Отправить",
    rsvpSending: "Отправляем…",
    rsvpSuccessYes: "Спасибо! Мы с нетерпением ждём вас.",
    rsvpSuccessNo: "Спасибо за ответ. Жаль, что вас не будет с нами.",
    rsvpNameRequired: "Пожалуйста, укажите ваше имя.",
    rsvpError: "Не удалось отправить. Попробуйте ещё раз.",
    countdownTitle: "Считаем каждое мгновение",
    unitDays: "Дней",
    unitHours: "Часов",
    unitMinutes: "Минут",
    unitSeconds: "Секунд",
    countdownWaiting: "Мы ждем вас.",
    countdownToday: "Этот день настал. Мы ждем вас.",
    languageSwitcher: "Выбор языка",
    languageRuLabel: "Русский",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Включить музыку",
    musicPauseLabel: "Остановить музыку",
  },
  uz: {
    pageTitle: "Jamshidbek va Charos | To'y taklifnomasi",
    metaDescription: "Jamshidbek va Charosning 2026-yil 8-noyabrdagi to'y taklifnomasi.",
    ariaIntro: "Taklifnoma konverti",
    ariaEnvelope: "Muhrlangan qog'oz konvert",
    ariaWeddingDate: "To'y sanasi",
    ariaCalendar: "2026-yil noyabr kalendari, 8-noyabr belgilangan",
    ariaWeddingDay: "To'y kuni",
    ariaOrnamentHero: "Yoshlar ismlari tushirilgan an'anaviy sahifa",
    ariaVenueDetails: "To'y manzili",
    ariaCountdown: "Orqaga sanoq",
    ariaRsvp: "Kelishni tasdiqlash",
    envelopeTopNote:
      "<span class=\"flap-note-top\">SIZ</span><span class=\"flap-note-middle\">TO'YIMIZGA</span><span class=\"flap-note-script\">taklif qilamiz</span>",
    withLove: "muhabbat ila,",
    signatureNames: "Jamshidbek\u00a0va\u00a0Charos",
    ornamentNames:
      "<span class=\"ornament-name-line\">Jamshidbek</span><span class=\"ornament-name-amp\">va</span><span class=\"ornament-name-line\">Charos</span>",
    heroNames: "Aziz\u00a0va\u00a0qadrdon<br /><span class=\"no-break\">insonimiz!</span>",
    openHere: "ochish",
    lead: "Hayotimizdagi eng baxtli kunlardan biri \u2014 nikoh to'yimizni siz bilan birga nishonlashni istaymiz.<br /><br />Quvonchimizga sherik bo'lib, bu oqshomni biz bilan birga yanada go'zal qilishingizni so'raymiz.<br /><br /><strong>Aziz mehmonimiz bo'lishingizni samimiy intizorlik bilan kutamiz.</strong>",
    scrollHint: "Pastga tushuring",
    calendarMonth: "Noyabr, 2026",
    weekdayMon: "DU",
    weekdayTue: "SE",
    weekdayWed: "CHOR",
    weekdayThu: "PAY",
    weekdayFri: "JU",
    weekdaySat: "SHA",
    weekdaySun: "YA",
    eventTimeLabel: "Boshlanish vaqti",
    locationTitle: "To'y manzili",
    venueName: "Turkiston restorani",
    venueAddress: "Toshkent viloyati",
    venueLandmark: "To'yxona: Turkiston restorani.",
    mapLinkYandex: "Yandex xaritasi",
    mapLinkGoogle: "Google Maps",
    contactLabel: "Savollar bo'lsa:",
    rsvpTitle: "Kelishingizni tasdiqlang",
    rsvpLead: "Stollarni to'g'ri tayyorlashimiz uchun, iltimos, javobingizni yuboring.",
    rsvpNameLabel: "Ismingiz",
    rsvpNamePlaceholder: "Ism va familiya",
    rsvpAttendingLegend: "Kelasizmi?",
    rsvpYes: "Albatta kelaman",
    rsvpNo: "Afsuski, kela olmayman",
    rsvpGuestsLabel: "Jami necha kishi kelasiz?",
    rsvpNoteLabel: "Tilak yoki izoh (ixtiyoriy)",
    rsvpSubmit: "Yuborish",
    rsvpSending: "Yuborilmoqda…",
    rsvpSuccessYes: "Rahmat! Sizni intiqlik bilan kutamiz.",
    rsvpSuccessNo: "Javobingiz uchun rahmat. Sizni o'rtamizda ko'ra olmasligimiz afsus.",
    rsvpNameRequired: "Iltimos, ismingizni yozing.",
    rsvpError: "Yuborib bo'lmadi. Iltimos, qayta urinib ko'ring.",
    countdownTitle: "Har lahzani sanayapmiz",
    unitDays: "Kun",
    unitHours: "Soat",
    unitMinutes: "Daqiqa",
    unitSeconds: "Soniya",
    countdownWaiting: "Sizni intiqlik bilan kutamiz.",
    countdownToday: "Bugun aynan o'sha kun. Sizni kutamiz.",
    languageSwitcher: "Til tanlash",
    languageRuLabel: "Ruscha",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Musiqani yoqish",
    musicPauseLabel: "Musiqani to'xtatish",
  },
};

let isOpening = false;
let currentLanguage = DEFAULT_LANGUAGE;
let ornamentNameFitFrame = null;
let rsvpStatus = null;

function resetPageScrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function getLocale() {
  return LOCALES[currentLanguage] || LOCALES[DEFAULT_LANGUAGE];
}

function isMusicPlaying() {
  if (!backgroundMusic) {
    return false;
  }

  return !backgroundMusic.paused && !backgroundMusic.ended;
}

function updateMusicToggleState(isPlaying = false) {
  if (!musicToggleBtn) {
    return;
  }

  const locale = getLocale();
  const label = isPlaying ? locale.musicPauseLabel : locale.musicPlayLabel;

  musicToggleBtn.classList.toggle("is-playing", isPlaying);
  musicToggleBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  musicToggleBtn.setAttribute("aria-label", label);
  musicToggleBtn.setAttribute("title", label);
}

function playBackgroundMusic() {
  if (!backgroundMusic) {
    return;
  }

  backgroundMusic.loop = true;
  backgroundMusic.volume = MUSIC_VOLUME;

  const playPromise = backgroundMusic.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        updateMusicToggleState(true);
      })
      .catch(() => {
        updateMusicToggleState(false);
      });
    return;
  }

  updateMusicToggleState(isMusicPlaying());
}

function stopBackgroundMusic() {
  if (!backgroundMusic) {
    return;
  }

  backgroundMusic.pause();
  updateMusicToggleState(false);
}

function toggleBackgroundMusic() {
  if (!backgroundMusic) {
    return;
  }

  if (isMusicPlaying()) {
    stopBackgroundMusic();
    return;
  }

  playBackgroundMusic();
}

function setLanguageSwitcherState(lang) {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function saveLanguagePreference(lang) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (_error) {
    // Ignore storage access issues (private mode, disabled storage, etc.).
  }
}

function getSavedLanguagePreference() {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LOCALES[savedLanguage] ? savedLanguage : null;
  } catch (_error) {
    return null;
  }
}

function getInitialLanguage() {
  return getSavedLanguagePreference() || DEFAULT_LANGUAGE;
}

function fitOrnamentNames() {
  const namesBlock = document.querySelector(".ornament-names");
  if (!namesBlock) {
    return;
  }

  const nameLines = Array.from(namesBlock.querySelectorAll(".ornament-name-line"));
  if (!nameLines.length) {
    return;
  }

  namesBlock.style.setProperty("--ornament-name-fit-scale", "1");
  nameLines.forEach((line) => {
    line.style.setProperty("--line-fit-scale", "1");
  });

  const availableWidth = namesBlock.clientWidth;
  if (!availableWidth) {
    return;
  }

  const sideSafePadding = Math.max(8, availableWidth * 0.045);
  const safeWidth = Math.max(0, availableWidth - sideSafePadding * 2);
  if (!safeWidth) {
    return;
  }

  nameLines.forEach((line) => {
    const lineWidth = line.scrollWidth;
    if (!lineWidth) {
      return;
    }

    const fitScale = Math.max(0.68, Math.min(1, (safeWidth / lineWidth) * 0.985));
    line.style.setProperty("--line-fit-scale", fitScale.toFixed(3));
  });
}

function scheduleOrnamentNameFit() {
  if (ornamentNameFitFrame !== null) {
    window.cancelAnimationFrame(ornamentNameFitFrame);
  }

  ornamentNameFitFrame = window.requestAnimationFrame(() => {
    fitOrnamentNames();
    ornamentNameFitFrame = null;
  });
}

function applyTranslations(lang = DEFAULT_LANGUAGE) {
  if (!LOCALES[lang]) {
    return;
  }

  currentLanguage = lang;
  setLanguageSwitcherState(lang);
  const locale = getLocale();

  document.documentElement.lang = lang;
  document.title = locale.pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", locale.metaDescription);
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key && Object.prototype.hasOwnProperty.call(locale, key)) {
      node.textContent = locale[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.getAttribute("data-i18n-html");
    if (key && Object.prototype.hasOwnProperty.call(locale, key)) {
      node.innerHTML = locale[key];
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    const rawMapping = node.getAttribute("data-i18n-attr");
    if (!rawMapping) {
      return;
    }

    rawMapping.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((item) => item.trim());
      if (!attr || !key) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(locale, key)) {
        node.setAttribute(attr, locale[key]);
      }
    });
  });

  const countdownMessage = document.getElementById("countdownMessage");
  if (countdownMessage) {
    countdownMessage.textContent = locale.countdownWaiting;
  }

  renderRsvpStatus();
  scheduleOrnamentNameFit();
  updateMusicToggleState(isMusicPlaying());
}

function openInvitation() {
  if (isOpening) {
    return;
  }

  isOpening = true;
  intro.classList.add("opened");
  openInviteBtn.setAttribute("aria-expanded", "true");
  playBackgroundMusic();

  window.setTimeout(() => {
    openInviteBtn.blur();
    document.body.classList.remove("intro-active");
    resetPageScrollToTop();
    window.requestAnimationFrame(resetPageScrollToTop);

    document.body.classList.add("invitation-visible");
    invitation.setAttribute("aria-hidden", "false");
    intro.classList.add("fade-out");

    revealVisibleSections();
    launchPetals();
    window.setTimeout(() => {
      intro.hidden = true;
    }, 900);
  }, OPENING_DURATION_MS);
}

function revealVisibleSections() {
  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  reveals.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
    observer.observe(node);
  });
}

function observeHeroVisibility() {
  if (!letterHero) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    document.body.classList.add("hero-in-view");
    return;
  }

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("hero-in-view", entry.isIntersecting);
      });
    },
    {
      threshold: 0.22,
    }
  );

  heroObserver.observe(letterHero);
}

function launchPetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const layer = document.createElement("div");
  layer.className = "petals";
  layer.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement("span");
    petal.style.setProperty("--x", `${Math.round(Math.random() * 100)}vw`);
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 120 - 60)}px`);
    petal.style.setProperty("--size", `${(0.55 + Math.random() * 0.6).toFixed(2)}rem`);
    petal.style.setProperty("--spin", `${Math.round(180 + Math.random() * 360)}deg`);
    petal.style.animationDuration = `${(5 + Math.random() * 3.5).toFixed(2)}s`;
    petal.style.animationDelay = `${(Math.random() * 2.5).toFixed(2)}s`;
    layer.appendChild(petal);
  }

  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 9500);
}

function setCountdownValue(id, value) {
  const node = document.getElementById(id);
  const text = String(value).padStart(2, "0");
  if (node.textContent === text) {
    return;
  }

  node.textContent = text;
  node.classList.remove("tick");
  void node.offsetWidth;
  node.classList.add("tick");
}

function setCountdownValues(days, hours, minutes, seconds) {
  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
}

function setupContact() {
  const contactLine = document.getElementById("contactLine");
  const contactLink = document.getElementById("contactLink");
  if (!contactLine || !contactLink || !CONTACT_PHONE) {
    return;
  }

  contactLink.textContent = CONTACT_PHONE;
  contactLink.href = `tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`;
  contactLine.hidden = false;
}

function renderRsvpStatus() {
  const statusNode = document.getElementById("rsvpStatus");
  if (!statusNode) {
    return;
  }

  statusNode.textContent = rsvpStatus ? getLocale()[rsvpStatus.key] : "";
  statusNode.dataset.kind = rsvpStatus ? rsvpStatus.kind : "";
}

function setRsvpStatus(key, kind) {
  rsvpStatus = key ? { key, kind } : null;
  renderRsvpStatus();
}

function setupRsvp() {
  const section = document.getElementById("rsvp");
  const form = document.getElementById("rsvpForm");
  if (!section || !form || !RSVP_ENDPOINT) {
    return;
  }

  const submitButton = document.getElementById("rsvpSubmit");
  const guestsField = document.getElementById("rsvpGuestsField");
  section.hidden = false;

  form.addEventListener("change", (event) => {
    if (event.target.name === "attending") {
      guestsField.hidden = event.target.value === "no";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) {
      setRsvpStatus("rsvpNameRequired", "error");
      form.elements.name.focus();
      return;
    }

    const attending = data.get("attending") === "yes";
    const payload = {
      name,
      attending,
      guests: attending ? Number(data.get("guests")) : 0,
      note: String(data.get("note") || "").trim(),
      website: String(data.get("website") || ""),
      lang: currentLanguage,
    };

    submitButton.disabled = true;
    setRsvpStatus("rsvpSending", "pending");

    try {
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`RSVP request failed: ${response.status}`);
      }

      form.reset();
      guestsField.hidden = false;
      form.classList.add("is-sent");
      setRsvpStatus(attending ? "rsvpSuccessYes" : "rsvpSuccessNo", "success");
    } catch (_error) {
      submitButton.disabled = false;
      setRsvpStatus("rsvpError", "error");
    }
  });
}

function updateCountdown() {
  const now = Date.now();
  const difference = targetWeddingDate - now;
  const countdownMessage = document.getElementById("countdownMessage");
  const locale = getLocale();

  if (difference <= 0) {
    setCountdownValues(0, 0, 0, 0);
    countdownMessage.textContent = locale.countdownToday;
    return false;
  }

  const days = Math.floor(difference / ONE_DAY_MS);
  const hours = Math.floor((difference % ONE_DAY_MS) / ONE_HOUR_MS);
  const minutes = Math.floor((difference % ONE_HOUR_MS) / ONE_MINUTE_MS);
  const seconds = Math.floor((difference % ONE_MINUTE_MS) / ONE_SECOND_MS);

  setCountdownValues(days, hours, minutes, seconds);
  countdownMessage.textContent = locale.countdownWaiting;
  return true;
}

function handleLanguageSwitcherClick(event) {
  const button = event.target.closest(".language-option");
  if (!button) {
    return;
  }

  const selectedLanguage = button.dataset.language;
  if (!selectedLanguage || selectedLanguage === currentLanguage || !LOCALES[selectedLanguage]) {
    return;
  }

  applyTranslations(selectedLanguage);
  updateCountdown();
  saveLanguagePreference(selectedLanguage);
}

openInviteBtn.addEventListener("click", openInvitation);
if (languageSwitcher) {
  languageSwitcher.addEventListener("click", handleLanguageSwitcherClick);
}
if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", toggleBackgroundMusic);
}
if (backgroundMusic) {
  backgroundMusic.loop = true;
  backgroundMusic.volume = MUSIC_VOLUME;
}

document.body.classList.add("intro-active");
resetPageScrollToTop();
observeHeroVisibility();
document.getElementById("eventTime").textContent = WEDDING_TIME;
setupContact();
setupRsvp();
applyTranslations(getInitialLanguage());
window.addEventListener("resize", scheduleOrnamentNameFit);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    scheduleOrnamentNameFit();
  });
}
updateCountdown();
const countdownInterval = window.setInterval(() => {
  const hasTimeLeft = updateCountdown();
  if (!hasTimeLeft) {
    window.clearInterval(countdownInterval);
  }
}, 1000);
