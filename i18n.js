/**
 * 文言・ユーザー設定（言語・タイムゾーン・表示）。localStorage に永続化。
 */

export const STORAGE_KEY = 'xivplugins.directory.settings.v1';

/** index.html のインライン同期スクリプトと同一キー／論理を保つこと。 */

/** @typedef {{ locale: string, timeZone: string, colorScheme: 'system'|'light'|'dark', pluginView: 'tile'|'list', fontScale: 'default'|'large' }} UserSettings */

export const SETTINGS_EVENT = 'xivplugins-settings';

/** Intl / 選択肢用。先頭は合成オプション。 */
export const TIMEZONE_IDS = [
  'local',
  'utc',
  'Pacific/Honolulu',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

/**
 * Intl.DisplayNames が使えない環境向けの IANA ラベル。
 * @type {Record<string, { en: string, ja: string }>}
 */
export const TIMEZONE_IANA_LABELS = {
  'Pacific/Honolulu': { en: 'Honolulu', ja: 'ホノルル' },
  'America/Los_Angeles': { en: 'Los Angeles', ja: 'ロサンゼルス' },
  'America/Denver': { en: 'Denver', ja: 'デンバー' },
  'America/Chicago': { en: 'Chicago', ja: 'シカゴ' },
  'America/New_York': { en: 'New York', ja: 'ニューヨーク' },
  'America/Sao_Paulo': { en: 'São Paulo', ja: 'サンパウロ' },
  'Europe/London': { en: 'London', ja: 'ロンドン' },
  'Europe/Berlin': { en: 'Berlin', ja: 'ベルリン' },
  'Europe/Paris': { en: 'Paris', ja: 'パリ' },
  'Africa/Johannesburg': { en: 'Johannesburg', ja: 'ヨハネスブルグ' },
  'Asia/Dubai': { en: 'Dubai', ja: 'ドバイ' },
  'Asia/Kolkata': { en: 'Kolkata', ja: 'コルカタ' },
  'Asia/Bangkok': { en: 'Bangkok', ja: 'バンコク' },
  'Asia/Tokyo': { en: 'Tokyo', ja: '東京' },
  'Asia/Seoul': { en: 'Seoul', ja: 'ソウル' },
  'Asia/Shanghai': { en: 'Shanghai', ja: '上海' },
  'Australia/Sydney': { en: 'Sydney', ja: 'シドニー' },
  'Pacific/Auckland': { en: 'Auckland', ja: 'オークランド' },
};

const MESSAGES = {
  en: {
    title: 'XIVPlugins — Dalamud plugin index',
    heading: 'XIVPlugins',
    settingsSummary: 'Settings',
    language: 'Language',
    timeZone: 'Time zone',
    theme: 'Theme',
    viewLayout: 'View',
    textSize: 'Text size',
    search: 'Search',
    searchPlaceholder: '',
    feed: 'Feed',
    feedFilterTitle: 'Filter by manifest source',
    sort: 'Sort',
    sortUpdated: 'Updated',
    sortAlpha: 'Name (A–Z)',
    loading: 'Loading…',
    allFeeds: 'All',
    countShowing: 'Showing {current} / {total}',
    cardVersion: 'Version',
    cardUpdated: 'Updated',
    cardNoLink: 'Could not derive a repository link from the manifest.',
    errors: {
      loadPlugins:
        'Could not load pluginmaster.json. Run Actions or: node ./scripts/merge-pluginmasters.mjs',
      invalidPayload: 'Invalid plugins array.',
      loadFailedBanner: 'Failed to load.',
    },
    banner: {
      feedCounts: '{ok}/{total} feeds',
      rowCounts: '{n} rows',
      primaryOther: '{primary}: {official} rows · other feeds: {other} rows',
      feedsFailed: '{n} feed(s) failed',
      primaryWarn: 'WARNING: primary feed has 0 rows (rebuild / manifest format?)',
    },
    optSystem: 'Follow system',
    optLight: 'Light',
    optDark: 'Dark',
    optViewTile: 'Card',
    optViewList: 'List',
    optDefaultSize: 'Default',
    optLargeSize: 'Large',
    tagFilter: 'Tags',
    tagFilterAll: 'Add tag…',
    officialFallback: 'Official · kamori',
    tz: {
      local: 'Browser local time',
      utc: 'UTC',
    },
  },
  ja: {
    title: 'XIVPlugins — Dalamud プラグイン一覧',
    heading: 'XIVPlugins',
    settingsSummary: '設定',
    language: '言語',
    timeZone: 'タイムゾーン',
    theme: 'テーマ',
    viewLayout: '表示',
    textSize: '文字サイズ',
    search: '検索',
    searchPlaceholder: '',
    feed: 'フィード',
    feedFilterTitle: 'マニフェストの取得元で絞り込み',
    sort: '並び替え',
    sortUpdated: '更新日',
    sortAlpha: '名前 (A–Z)',
    loading: '読み込み中…',
    allFeeds: 'すべて',
    countShowing: '{current} / {total} 件を表示',
    cardVersion: 'バージョン',
    cardUpdated: '更新',
    cardNoLink: 'manifest の情報だけではリポジトリへのリンクを決められません。',
    errors: {
      loadPlugins:
        'pluginmaster.json を読み込めませんでした。Actions を実行するか、ローカルで node ./scripts/merge-pluginmasters.mjs を実行してください。',
      invalidPayload: 'plugins 配列が不正です。',
      loadFailedBanner: '読み込みに失敗しました。',
    },
    banner: {
      feedCounts: 'フィード {ok}/{total}',
      rowCounts: '{n} 行',
      primaryOther: '{primary}: {official} 行 · その他フィード: {other} 行',
      feedsFailed: '失敗したフィード {n} 件',
      primaryWarn: '警告: プライマリフィードが 0 行です（再ビルド・形式を確認）',
    },
    optSystem: 'システムに追従',
    optLight: 'ライト',
    optDark: 'ダーク',
    optViewTile: 'カード',
    optViewList: 'リスト',
    optDefaultSize: '標準',
    optLargeSize: '大きい',

    tagFilter: 'タグ',
    tagFilterAll: 'タグを追加…',
    officialFallback: '公式 · kamori',
    tz: {
      local: 'ブラウザのローカル時刻',
      utc: 'UTC',
    },
  },
};

/** @type {UserSettings} */
const DEFAULTS = {
  locale: 'en',
  timeZone: 'utc',
  colorScheme: 'system',
  pluginView: 'tile',
  fontScale: 'default',
};

/** @type {UserSettings} */
let settings = { ...DEFAULTS };

function prefersJapanese() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const lang = navigator.language || /** @type {string} */ (navigator.languages && navigator.languages[0]);
  return typeof lang === 'string' && lang.toLowerCase().startsWith('ja');
}

function readStored() {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object') {
      return null;
    }
    return /** @type {UserSettings} */ (o);
  } catch {
    return null;
  }
}

function normalizeSettings(s) {
  const src = typeof s === 'object' && s !== null ? { ...DEFAULTS, .../** @type {Partial<UserSettings>} */ (s) } : DEFAULTS;

  const locale = src.locale === 'ja' ? 'ja' : 'en';
  let timeZone =
    typeof src.timeZone === 'string' && src.timeZone.trim() ? src.timeZone.trim() : DEFAULTS.timeZone;
  const allowed = new Set(TIMEZONE_IDS);
  if (!allowed.has(timeZone)) {
    /** 将来の一覧拡張や手動編集で未知の値があっても保持 */
    /** @type {string} */
    const tz = timeZone;
    if (!/^[\w/+.\-]+$/.test(tz) || tz.length > 64) {
      timeZone = DEFAULTS.timeZone;
    }
  }

  /** @type {'system'|'light'|'dark'} */
  let colorScheme = DEFAULTS.colorScheme;
  if (src.colorScheme === 'light' || src.colorScheme === 'dark' || src.colorScheme === 'system') {
    colorScheme = src.colorScheme;
  }

  /** @type {'tile'|'list'} */
  const pluginView = src.pluginView === 'list' ? 'list' : 'tile';

  const fontScale = src.fontScale === 'large' ? 'large' : 'default';

  return { locale, timeZone, colorScheme, pluginView, fontScale };
}

/** @returns {'light'|'dark'} */
function resolveEffectiveColorScheme() {
  if (settings.colorScheme === 'light') {
    return 'light';
  }
  if (settings.colorScheme === 'dark') {
    return 'dark';
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      /* ignore */
    }
  }
  return 'dark';
}

/**
 * 配色・文字サイズ（一覧本文・注意・フッター中心。ルート font-size とツールバーは変えない）をドキュメントに反映する。
 */
export function applyDisplayPreferences() {
  if (typeof document === 'undefined') {
    return;
  }

  const scheme = resolveEffectiveColorScheme();
  document.documentElement.dataset.colorScheme = scheme;
  try {
    document.documentElement.style.setProperty(
      'color-scheme',
      scheme === 'light' ? 'light' : 'dark',
    );
  } catch {
    /* ignore */
  }

  document.documentElement.dataset.textScale = settings.fontScale === 'large' ? 'large' : 'normal';

  const meta = /** @type {HTMLMetaElement | null} */ (document.getElementById('meta-theme-color'));
  if (meta) {
    meta.content = scheme === 'light' ? '#c8ced8' : '#232428';
  }
}

let mediaListenersBound = false;

/**
 * テーマがシステム追従のとき、ブラウザの配色変化で表示を更新する。
 */
export function bindSystemPreferenceListeners() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }
  if (mediaListenersBound) {
    return;
  }
  mediaListenersBound = true;

  function onPreferChange() {
    if (settings.colorScheme === 'system') {
      applyDisplayPreferences();
    }
  }

  try {
    const mqLight = window.matchMedia('(prefers-color-scheme: light)');
    if (typeof mqLight.addEventListener === 'function') {
      mqLight.addEventListener('change', onPreferChange);
    } else {
      mqLight.addListener(onPreferChange);
    }
  } catch {
    /* ignore */
  }
}

export function getSettings() {
  return { ...settings };
}

export function initSettingsFromStorage() {
  const stored = readStored();
  if (stored) {
    settings = normalizeSettings(stored);
  } else if (prefersJapanese()) {
    settings = { ...DEFAULTS, locale: 'ja' };
  } else {
    settings = { ...DEFAULTS };
  }
}

/**
 * @param {Partial<UserSettings>} partial
 * @param {{ silent?: boolean }} [opts]
 */
export function saveSettings(partial, opts) {
  settings = normalizeSettings({ ...settings, ...partial });
  applyDisplayPreferences();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  } catch {
    /* ignore quota / private mode */
  }
  if (!opts?.silent && typeof window !== 'undefined') {
    const detail = getSettings();
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail, bubbles: true }));
    });
  }
}

/**
 * @template T
 * @param {unknown} obj
 * @param {string} path dot path
 * @param {T} fallback
 */
function pick(obj, path, fallback) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (!cur || typeof cur !== 'object' || !(k in /** @type {object} */ (cur))) {
      return fallback;
    }
    cur = /** @type {Record<string, unknown>} */ (cur)[k];
  }
  return /** @type {T} */ (cur);
}

/**
 * @param {string} key dot notation e.g. "errors.loadPlugins"
 * @param {Record<string, string|number>} [vars]
 */
export function t(key, vars) {
  const locale = settings.locale === 'ja' ? 'ja' : 'en';
  const bundle = /** @type {Record<string, unknown>} */ (
    locale === 'ja' ? MESSAGES.ja : MESSAGES.en
  );
  const val = pick(bundle, key, key);
  let s = typeof val === 'string' ? val : String(val);
  if (vars) {
    s = s.replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] != null ? String(vars[name]) : `{${name}}`,
    );
  }
  return s;
}

/** @returns {string} `ja-JP` / `en-US` */
export function intlLocale() {
  return settings.locale === 'ja' ? 'ja-JP' : 'en-US';
}

/**
 * @param {Intl.DateTimeFormatOptions} overrides
 */
function dateTimeFormatOptions(overrides) {
  /** @type {Intl.DateTimeFormatOptions} */
  const base = {
    dateStyle: 'medium',
    timeStyle: 'medium',
    ...overrides,
  };
  if (settings.timeZone === 'local') {
    return base;
  }
  if (settings.timeZone === 'utc') {
    return { ...base, timeZone: 'UTC' };
  }
  return { ...base, timeZone: settings.timeZone };
}

/**
 * Unix 秒/ミリ秒または Date を表示用に整形する。
 *
 * @param {number|Date|null|undefined} input
 */
export function formatDirectoryDateTime(input) {
  if (input == null) {
    return '—';
  }
  let ms;
  if (input instanceof Date) {
    ms = input.getTime();
  } else if (typeof input === 'number') {
    ms = input < 1e12 ? input * 1000 : input;
  } else {
    return '—';
  }
  if (!Number.isFinite(ms) || ms <= 0) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat(intlLocale(), dateTimeFormatOptions({})).format(ms);
  } catch {
    return new Date(ms).toISOString();
  }
}

/**
 * ISO8601 の instant 文字列（manifest の generatedAt 等）。
 *
 * @param {string} iso
 */
export function formatIsoInstant(iso) {
  if (typeof iso !== 'string' || !iso.trim()) {
    return '';
  }
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return formatDirectoryDateTime(d);
}

/** @returns {string|null} */
function timezoneDisplayNameOrNull(tzId) {
  try {
    const dn = new Intl.DisplayNames([intlLocale()], { type: 'timeZone' });
    const label = dn.of(tzId);
    return typeof label === 'string' && label.trim() ? label.trim() : null;
  } catch {
    return null;
  }
}

/** @param {string} tzId */
function ianaFallbackLabel(tzId) {
  const row = TIMEZONE_IANA_LABELS[tzId];
  if (!row) {
    return tzId;
  }
  return settings.locale === 'ja' ? row.ja : row.en;
}

/** @param {string} tzId TIMEZONE_IDS の値または IANA */
export function timezoneOptionLabel(tzId) {
  if (tzId === 'local') {
    return t('tz.local');
  }
  if (tzId === 'utc') {
    return t('tz.utc');
  }
  return timezoneDisplayNameOrNull(tzId) ?? ianaFallbackLabel(tzId);
}

/**
 * @param {HTMLSelectElement} selectEl
 * @param {string} currentValue
 */
export function populateTimeZoneOptions(selectEl, currentValue) {
  if (!(selectEl instanceof HTMLSelectElement)) {
    return;
  }

  const tzSet = new Set(TIMEZONE_IDS);
  /** @type {Array<{ id: string, label: string }>} */
  const rows = [];
  for (const id of TIMEZONE_IDS) {
    const label = timezoneOptionLabel(id);
    rows.push({ id, label: label || id });
  }
  if (!tzSet.has(currentValue) && /^[\w/+.\-]+$/.test(currentValue) && currentValue.length <= 64) {
    rows.push({
      id: currentValue,
      label: timezoneOptionLabel(currentValue) || currentValue,
    });
  }
  rows.sort((a, b) =>
    a.id === currentValue ? -1 : b.id === currentValue ? 1 : a.label.localeCompare(b.label, intlLocale()),
  );

  const opts = rows.map(({ id, label }) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = label || id;
    return o;
  });

  if (typeof selectEl.replaceChildren === 'function') {
    selectEl.replaceChildren(...opts);
  } else {
    selectEl.innerHTML = '';
    for (const o of opts) {
      selectEl.appendChild(o);
    }
  }

  if ([...selectEl.options].some((opt) => opt.value === currentValue)) {
    selectEl.value = currentValue;
  } else {
    selectEl.value = 'utc';
    saveSettings({ timeZone: 'utc' }, { silent: true });
  }
}

/**
 * DOM の静的文言を現在の設定に合わせる。
 */
export function applyStaticLabels() {
  const htmlLang = settings.locale === 'ja' ? 'ja' : 'en';
  document.documentElement.lang = htmlLang;
  document.documentElement.dataset.locale = htmlLang;
  document.title = t('title');

  /** @type {HTMLElement | null} */
  const heading = document.getElementById('site-heading');
  if (heading) {
    heading.textContent = t('heading');
  }

  /** @type {HTMLMetaElement | null} */
  const desc = /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name="description"]'));
  if (desc) {
    desc.setAttribute('content', t('title'));
  }

  const triggerLbl = /** @type {HTMLElement | null} */ (document.getElementById('settings-trigger-label'));
  if (triggerLbl) {
    triggerLbl.textContent = t('settingsSummary');
  }

  /** @type {HTMLButtonElement | null} */
  const trig = /** @type {HTMLButtonElement | null} */ (document.getElementById('settings-trigger'));
  if (trig) {
    trig.title = t('settingsSummary');
    trig.setAttribute('aria-label', t('settingsSummary'));
  }

  const popTitle = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover-title'));
  if (popTitle) {
    popTitle.textContent = t('settingsSummary');
  }

  /** @type {HTMLLabelElement | null} */
  const ll = /** @type {HTMLLabelElement | null} */ (
    document.querySelector('label.settings-field[for="setting-locale"] span')
  );
  if (ll) {
    ll.textContent = t('language');
  }
  /** @type {HTMLElement | null} */
  const tl = /** @type {HTMLElement | null} */ (
    document.querySelector('label.settings-field[for="setting-timezone"] span')
  );
  if (tl) {
    tl.textContent = t('timeZone');
  }

  /** @type {HTMLElement | null} */
  const themeLbl = /** @type {HTMLElement | null} */ (
    document.querySelector('label.settings-field[for="setting-color-scheme"] span')
  );
  if (themeLbl) {
    themeLbl.textContent = t('theme');
  }
  /** @type {HTMLElement | null} */
  const viewLbl = /** @type {HTMLElement | null} */ (
    document.querySelector('label.settings-field[for="setting-plugin-view"] span')
  );
  if (viewLbl) {
    viewLbl.textContent = t('viewLayout');
  }
  /** @type {HTMLElement | null} */
  const fontLbl = /** @type {HTMLElement | null} */ (
    document.querySelector('label.settings-field[for="setting-font-scale"] span')
  );
  if (fontLbl) {
    fontLbl.textContent = t('textSize');
  }

  /** @type {HTMLSelectElement | null} */
  const colorSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-color-scheme'));
  if (colorSel) {
    const o = (v) => colorSel.querySelector(`option[value="${v}"]`);
    const e1 = o('system');
    const e2 = o('light');
    const e3 = o('dark');
    if (e1) e1.textContent = t('optSystem');
    if (e2) e2.textContent = t('optLight');
    if (e3) e3.textContent = t('optDark');
    colorSel.value = settings.colorScheme;
  }

  /** @type {HTMLSelectElement | null} */
  const viewSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-plugin-view'));
  if (viewSel) {
    const o = (v) => viewSel.querySelector(`option[value="${v}"]`);
    const e1 = o('tile');
    const e2 = o('list');
    if (e1) e1.textContent = t('optViewTile');
    if (e2) e2.textContent = t('optViewList');
    viewSel.value = settings.pluginView;
  }

  /** @type {HTMLSelectElement | null} */
  const fontSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-font-scale'));
  if (fontSel) {
    const o = (v) => fontSel.querySelector(`option[value="${v}"]`);
    const e1 = o('default');
    const e2 = o('large');
    if (e1) e1.textContent = t('optDefaultSize');
    if (e2) e2.textContent = t('optLargeSize');
    fontSel.value = settings.fontScale;
  }

  /** @type {HTMLElement | null} */
  const slbl = /** @type {HTMLElement | null} */ (document.getElementById('label-search'));
  if (slbl) {
    slbl.textContent = t('search');
  }

  /** @type {HTMLInputElement | null} */
  const search = /** @type {HTMLInputElement | null} */ (document.getElementById('search'));
  if (search) {
    search.placeholder = t('searchPlaceholder');
  }

  /** @type {HTMLElement | null} */
  const flbl = /** @type {HTMLElement | null} */ (document.getElementById('label-feed'));
  if (flbl) {
    flbl.textContent = t('feed');
  }

  /** @type {HTMLSelectElement | null} */
  const sf = /** @type {HTMLSelectElement | null} */ (document.getElementById('source-filter'));
  if (sf) {
    sf.title = t('feedFilterTitle');
  }

  /** @type {HTMLElement | null} */
  const sortWrap = /** @type {HTMLElement | null} */ (document.querySelector('.sort'));
  if (sortWrap) {
    /** @type {HTMLElement | undefined} */
    const firstSpan = sortWrap.querySelector('#sort-label');
    if (firstSpan) {
      firstSpan.textContent = t('sort');
    }
    /** @type {HTMLButtonElement | null} */
    const btnU = /** @type {HTMLButtonElement | null} */ (document.getElementById('sort-updated'));
    if (btnU) {
      btnU.textContent = t('sortUpdated');
    }
    /** @type {HTMLButtonElement | null} */
    const btnA = /** @type {HTMLButtonElement | null} */ (document.getElementById('sort-alpha'));
    if (btnA) {
      btnA.textContent = t('sortAlpha');
    }
  }

  /** @type {HTMLSelectElement | null} */
  const locSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-locale'));
  if (locSel) {
    locSel.value = settings.locale === 'ja' ? 'ja' : 'en';
  }

  /** @type {HTMLSelectElement | null} */
  const tzSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-timezone'));
  if (tzSel) {
    populateTimeZoneOptions(tzSel, settings.timeZone);
    tzSel.value = settings.timeZone;
  }

  applyDisplayPreferences();
}

/**
 * 設定 UI のイベントとタイムゾーン選択肢を一度だけひも付ける。
 */
let settingsDocumentListenersBound = false;

export function bindSettingsUi() {
  const root = /** @type {HTMLElement | null} */ (document.getElementById('settings-dropdown-root'));
  const trigger = /** @type {HTMLButtonElement | null} */ (document.getElementById('settings-trigger'));
  const panel = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover'));

  function closePopover() {
    const p = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover'));
    const t = /** @type {HTMLElement | null} */ (document.getElementById('settings-trigger'));
    if (p) {
      p.hidden = true;
    }
    if (t) {
      t.setAttribute('aria-expanded', 'false');
    }
  }

  function openPopover() {
    const p = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover'));
    const t = /** @type {HTMLElement | null} */ (document.getElementById('settings-trigger'));
    if (!p || !t) {
      return;
    }
    p.hidden = false;
    t.setAttribute('aria-expanded', 'true');
    const tz = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-timezone'));
    if (tz) {
      populateTimeZoneOptions(tz, getSettings().timeZone);
      tz.value = getSettings().timeZone;
    }
    const gs = getSettings();
    const cs = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-color-scheme'));
    if (cs) {
      cs.value = gs.colorScheme;
    }
    const vs = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-plugin-view'));
    if (vs) {
      vs.value = gs.pluginView;
    }
    const fs = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-font-scale'));
    if (fs) {
      fs.value = gs.fontScale;
    }
  }

  function togglePopover(ev) {
    const p = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover'));
    const t = /** @type {HTMLElement | null} */ (document.getElementById('settings-trigger'));
    if (!p || !t) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (p.hidden) {
      openPopover();
    } else {
      closePopover();
    }
  }

  if (trigger && panel && root && !trigger.dataset.settingsUiBound) {
    trigger.dataset.settingsUiBound = '1';
    trigger.addEventListener('click', togglePopover);
    panel.addEventListener('click', (ev) => ev.stopPropagation());
  }

  if (!settingsDocumentListenersBound) {
    settingsDocumentListenersBound = true;
    document.addEventListener('click', (ev) => {
      const r = /** @type {HTMLElement | null} */ (document.getElementById('settings-dropdown-root'));
      const p = /** @type {HTMLElement | null} */ (document.getElementById('settings-popover'));
      if (!r || !p || p.hidden) {
        return;
      }
      const path = typeof ev.composedPath === 'function' ? ev.composedPath() : [];
      if (path.length && path.includes(r)) {
        return;
      }
      if (ev.target instanceof Node && r.contains(ev.target)) {
        return;
      }
      closePopover();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        closePopover();
      }
    });
  }

  /** @type {HTMLSelectElement | null} */
  const locSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-locale'));
  /** @type {HTMLSelectElement | null} */
  const tzSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-timezone'));
  /** @type {HTMLSelectElement | null} */
  const colorSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-color-scheme'));
  /** @type {HTMLSelectElement | null} */
  const viewSelBind = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-plugin-view'));
  /** @type {HTMLSelectElement | null} */
  const fontSel = /** @type {HTMLSelectElement | null} */ (document.getElementById('setting-font-scale'));

  if (tzSel && !tzSel.dataset.bound) {
    tzSel.dataset.bound = '1';
    tzSel.addEventListener('change', () => saveSettings({ timeZone: tzSel.value }));
  }
  if (locSel && !locSel.dataset.bound) {
    locSel.dataset.bound = '1';
    locSel.addEventListener('change', () =>
      saveSettings({ locale: locSel.value === 'ja' ? 'ja' : 'en' }),
    );
  }

  if (colorSel && !colorSel.dataset.bound) {
    colorSel.dataset.bound = '1';
    colorSel.addEventListener('change', () => {
      const v = colorSel.value;
      if (v === 'light' || v === 'dark' || v === 'system') {
        saveSettings({ colorScheme: v });
      }
    });
  }

  if (viewSelBind && !viewSelBind.dataset.bound) {
    viewSelBind.dataset.bound = '1';
    viewSelBind.addEventListener('change', () => {
      saveSettings({ pluginView: viewSelBind.value === 'list' ? 'list' : 'tile' });
    });
  }

  if (fontSel && !fontSel.dataset.bound) {
    fontSel.dataset.bound = '1';
    fontSel.addEventListener('change', () => {
      saveSettings({ fontScale: fontSel.value === 'large' ? 'large' : 'default' });
    });
  }

  if (tzSel) {
    populateTimeZoneOptions(tzSel, getSettings().timeZone);
    tzSel.value = getSettings().timeZone;
  }
}
