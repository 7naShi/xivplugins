/**
 * pluginmaster.json（または公式直 fetch）を一覧表示。公開: 7naShi/xivplugins gh-pages。
 */

import {
  SETTINGS_EVENT,
  applyStaticLabels,
  bindSettingsUi,
  bindSystemPreferenceListeners,
  formatDirectoryDateTime,
  formatIsoInstant,
  getSettings,
  initSettingsFromStorage,
  intlLocale,
  t,
} from './i18n.js';

const PLUGIN_MASTER_URL = 'https://kamori.goats.dev/Plugin/PluginMaster';
const BUNDLED_URL = './pluginmaster.json';

const gridEl = document.getElementById('plugin-grid');
const countEl = document.getElementById('count');
const errorEl = document.getElementById('error');
const searchInput = document.getElementById('search');
const sourceFilter = /** @type {HTMLSelectElement} */ (document.getElementById('source-filter'));
const sortUpdatedBtn = document.getElementById('sort-updated');
const sortAlphaBtn = document.getElementById('sort-alpha');
const tagSelectorEl = /** @type {HTMLSelectElement} */ (document.getElementById('tag-selector'));
const activeTagsEl = document.getElementById('active-tags');
const buildMetaEl = document.getElementById('build-meta');

/** @type {{ raw: unknown[], filtered: unknown[], sort: 'updated' | 'alpha', meta: object | null, primaryFeedId: string, dataLoaded: boolean }} */
const state = {
  raw: [],
  filtered: [],
  sort: 'updated',
  meta: null,
  primaryFeedId: 'official',
  dataLoaded: false,
  /** @type {string[]} アクティブなタグフィルター（AND条件） */
  activeTags: [],
};

/**
 * 集約 manifest は常に同梱の pluginmaster.json を優先する。
 * 公式 URL を先に取ると CORS が通った環境で公式のみ配列だけが返り、カスタム行が無くなるため不可。
 *
 * @returns {Promise<{ plugins: unknown[], meta?: object|null }>}
 */
async function fetchPluginPayload() {
  try {
    const local = await fetch(BUNDLED_URL, { credentials: 'omit', cache: 'no-store' });
    if (local.ok) {
      const raw = await local.json();
      if (raw && typeof raw === 'object' && Array.isArray(/** @type {any} */ (raw).plugins)) {
        return {
          plugins: /** @type {any} */ (raw).plugins,
          meta: /** @type {any} */ (raw).directoryMeta ?? null,
        };
      }
      if (Array.isArray(raw)) {
        return { plugins: raw, meta: null };
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const remote = await fetch(PLUGIN_MASTER_URL, {
      credentials: 'omit',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (remote.ok) {
      const raw = await remote.json();
      if (Array.isArray(raw)) {
        return { plugins: raw, meta: null };
      }
    }
  } catch {
    /* offline / CORS */
  }

  throw new Error(t('errors.loadPlugins'));
}

function applyBuildMetaBanner(meta) {
  if (!meta || !buildMetaEl) {
    return;
  }

  const atIso = typeof meta.generatedAt === 'string' ? meta.generatedAt : '';
  const at = atIso ? formatIsoInstant(atIso) : '';
  const feeds = Array.isArray(meta.feeds) ? meta.feeds : [];
  const skipped =
    typeof meta.skippedFeedCount === 'number'
      ? meta.skippedFeedCount
      : feeds.filter((f) => f && typeof f === 'object' && /** @type {any} */ (f).fetchOk === false).length;
  const okFeeds = feeds.filter((f) => {
    if (!f || typeof f !== 'object') {
      return false;
    }
    return /** @type {any} */ (f).fetchOk !== false;
  });
  const rows =
    typeof meta.totalListingRows === 'number'
      ? meta.totalListingRows
      : typeof meta.totalPlugins === 'number'
        ? meta.totalPlugins
        : '—';

  const pf =
    typeof meta.primaryFeedId === 'string' && meta.primaryFeedId ? meta.primaryFeedId : 'official';
  const ro =
    typeof meta.listingRowsOfficial === 'number' ? meta.listingRowsOfficial : null;
  const rother =
    typeof meta.listingRowsOtherFeeds === 'number' ? meta.listingRowsOtherFeeds : null;
  const breakdown =
    ro !== null && rother !== null
      ? t('banner.primaryOther', { primary: pf, official: String(ro), other: String(rother) })
      : '';

  const officialLooksEmpty =
    typeof meta.listingRowsOfficial === 'number' &&
    meta.listingRowsOfficial === 0 &&
    typeof meta.totalListingRows === 'number' &&
    meta.totalListingRows > 0;

  const feedsPart = t('banner.feedCounts', { ok: okFeeds.length, total: feeds.length });
  const rowsPart = t('banner.rowCounts', { n: rows });

  const parts = [];
  if (at) {
    parts.push(at);
  }
  parts.push(feedsPart);
  parts.push(rowsPart);
  if (breakdown) {
    parts.push(breakdown);
  }
  if (skipped > 0) {
    parts.push(t('banner.feedsFailed', { n: skipped }));
  }
  if (officialLooksEmpty) {
    parts.push(t('banner.primaryWarn'));
  }

  buildMetaEl.hidden = false;
  buildMetaEl.textContent = parts.filter(Boolean).join(' · ');
}

/**
 * @param {object|null|undefined} meta
 */
function fillSourceFilter(meta) {
  const prev = sourceFilter.value;

  sourceFilter.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = '';
  allOpt.textContent = t('allFeeds');
  sourceFilter.appendChild(allOpt);

  sourceFilter.disabled = false;

  if (!meta || !Array.isArray(meta.feeds)) {
    sourceFilter.value = '';
    return;
  }

  for (const f of meta.feeds) {
    if (!f || typeof f !== 'object') {
      continue;
    }

    if (/** @type {any} */ (f).fetchOk === false) {
      continue;
    }

    const id = typeof /** @type {any} */ (f).id === 'string' ? /** @type {any} */ (f).id : '';
    const label =
      typeof /** @type {any} */ (f).label === 'string' && /** @type {any} */ (f).label
        ? /** @type {any} */ (f).label
        : typeof /** @type {any} */ (f).labelJa === 'string'
          ? /** @type {any} */ (f).labelJa
          : id;
    if (!id) {
      continue;
    }

    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = label;
    sourceFilter.appendChild(opt);
  }

  if ([...sourceFilter.options].some((opt) => opt.value === prev)) {
    sourceFilter.value = prev;
  } else {
    sourceFilter.value = '';
  }
}

/**
 * @param {unknown} ts
 */
function formatUnixUtc(ts) {
  if (typeof ts !== 'number' || ts <= 0) {
    return '—';
  }
  return formatDirectoryDateTime(ts);
}

/**
 * GitHub URL から github.com/org/repo のトップを返す。解釈できなければ null。
 * （releases/download・raw・blob は owner/repo が取れる）
 *
 * @param {string} u
 * @returns {string|null}
 */
function githubOrgRepoRoot(u) {
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let parts;
    if (host === 'github.com') {
      parts = url.pathname.split('/').filter(Boolean);
    } else if (host === 'raw.githubusercontent.com' || host === 'raw.github.com') {
      parts = url.pathname.split('/').filter(Boolean);
    } else if (host === 'codeload.github.com') {
      parts = url.pathname.split('/').filter(Boolean);
    } else {
      return null;
    }
    if (parts.length < 2) {
      return null;
    }
    const owner = parts[0];
    let repo = parts[1];
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    return `https://github.com/${owner}/${repo}`;
  } catch {
    return null;
  }
}

/**
 * @param {string} u
 */
function looksLikeBinaryOrReleaseDownload(u) {
  try {
    const x = new URL(u);
    const path = x.pathname.toLowerCase();
    if (path.includes('/releases/download/')) {
      return true;
    }
    if (path.includes('/releases/assets/')) {
      return true;
    }
    if (/\.(zip|dll|exe|pdb|dmg|deb|rpm|nupkg|tar\.gz|tgz)(\?|$)/i.test(path)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * マニフェストのいずれかの URL から「リポジトリのトップ（またはプロジェクト URL）」を選ぶ。
 *
 * @param {Record<string, unknown>} p
 * @returns {string}
 */
function derivePluginRepoHref(p) {
  const keys = ['RepoUrl', 'DownloadLinkInstall', 'DownloadLinkUpdate', 'DownloadLinkTesting'];
  const candidates = [];
  for (const k of keys) {
    const v = p[k];
    if (typeof v === 'string' && v.trim()) {
      candidates.push(v.trim());
    }
  }

  for (const c of candidates) {
    const gh = githubOrgRepoRoot(c);
    if (gh) {
      return gh;
    }
  }

  const ru = typeof p.RepoUrl === 'string' ? p.RepoUrl.trim() : '';
  if (ru) {
    try {
      const u = new URL(ru);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        if (!looksLikeBinaryOrReleaseDownload(ru)) {
          return ru;
        }
      }
    } catch {
      /* ignore */
    }
  }

  return '';
}

/**
 * @param {Record<string, unknown>} p
 * @returns {string}
 */
function derivePluginIconUrl(p) {
  if (typeof p.IconUrl === 'string' && p.IconUrl.trim()) {
    return p.IconUrl.trim();
  }
  
  const url = derivePluginRepoHref(p);
  if (url) {
    try {
      const u = new URL(url);
      if (u.hostname === 'github.com') {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length >= 1) {
          const owner = parts[0];
          return `https://github.com/${owner}.png?size=64`;
        }
      }
    } catch {
      /* ignore */
    }
  }
  return '';
}

/**
 * @param {Record<string, unknown>} p
 */
function primaryPluginUrl(p) {
  return derivePluginRepoHref(p);
}

/**
 * CategoryTags 等、オブジェクト配列でも Name / Id を拾う。
 *
 * @param {unknown} raw
 * @returns {string[]}
 */
function extractStructuredTagStrings(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }
  /** @type {string[]} */
  const out = [];
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      out.push(item.trim());
    } else if (item && typeof item === 'object') {
      const o = /** @type {Record<string, unknown>} */ (item);
      if (typeof o.Name === 'string' && o.Name.trim()) {
        out.push(o.Name.trim());
      }
      if (typeof o.Id === 'string' && o.Id.trim()) {
        out.push(o.Id.trim());
      }
    }
  }
  return out;
}

/**
 * カード表示・検索に使うタグ一覧（Tags + CategoryTags 等、表記ゆれを除いて重複排除）。
 *
 * @param {Record<string, unknown>} p
 */
function collectPluginTagStrings(p) {
  const fromTags = Array.isArray(p.Tags)
    ? /** @type {string[]} */ (p.Tags).filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean)
    : [];
  const fromCategory = extractStructuredTagStrings(p.CategoryTags);
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const s of [...fromTags, ...fromCategory]) {
    const k = s.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      out.push(s);
    }
  }
  return out;
}

/** @param {Record<string, unknown>} p */
function collectPluginTagsLower(p) {
  return collectPluginTagStrings(p).map((s) => s.toLowerCase());
}

/** @param {Record<string, unknown>} p */
function buildSearchHaystackLower(p) {
  const tags = collectPluginTagStrings(p);
  const fields = [
    p.Author,
    p.Name,
    p.InternalName,
    p.Punchline,
    p.Description,
    p._DirectorySourceLabel,
    p._ListingId,
    ...tags,
  ].filter((x) => typeof x === 'string');
  return fields.join(' ').toLowerCase();
}

/**
 * @param {Record<string, unknown>} p
 * @param {string} rawQuery トリム後のクエリ全文
 */
function pluginMatchesSearch(p, rawQuery) {
  const q0 = rawQuery.trim();
  if (!q0) {
    return true;
  }

  const qLower = q0.toLowerCase();
  const tagsLower = collectPluginTagsLower(p);

  /** tag:needle … タグにだけマッチ（大文字小文字無視・部分一致） */
  let m = /^tag\s*:\s*(.*)$/i.exec(q0);
  if (m) {
    const needle = /** @type {string} */ (m[1]).trim().toLowerCase();
    if (!needle) {
      return true;
    }
    return tagsLower.some((t) => t.includes(needle));
  }

  /** #foo … tag: と同等（ハッシュのみの記法） */
  m = /^#\s*(.+)$/.exec(q0);
  if (m) {
    const needle = /** @type {string} */ (m[1]).trim().toLowerCase();
    if (!needle) {
      return true;
    }
    return tagsLower.some((t) => t.includes(needle));
  }

  const tokens = qLower.split(/\s+/).filter(Boolean);
  const hay = buildSearchHaystackLower(p);
  return tokens.every((tok) => {
    let mTok = /^tag\s*:\s*(.+)$/i.exec(tok);
    if (mTok) {
      const needle = /** @type {string} */ (mTok[1]).trim().toLowerCase();
      if (!needle) {
        return true;
      }
      return tagsLower.some((t) => t.includes(needle));
    }
    if (tok.startsWith('#')) {
      const needle = tok.slice(1).trim().toLowerCase();
      if (!needle) {
        return true;
      }
      return tagsLower.some((t) => t.includes(needle));
    }
    return hay.includes(tok);
  });
}

/**
 * タイル用カード HTML（従来）
 * @param {Record<string, unknown>} p
 */
function pluginCardHtml(p) {
  const author = typeof p.Author === 'string' ? p.Author : '';
  const name = typeof p.Name === 'string' ? p.Name : '';
  const internal = typeof p.InternalName === 'string' ? p.InternalName : '';
  const punch =
    typeof p.Punchline === 'string' && p.Punchline.trim()
      ? p.Punchline
      : typeof p.Description === 'string'
        ? p.Description.slice(0, 260) + (p.Description.length > 260 ? '…' : '')
        : '';
  const ver = p.AssemblyVersion != null ? String(p.AssemblyVersion) : '';
  const last = formatUnixUtc(p.LastUpdate);
  const tags = collectPluginTagStrings(p);
  const sourceLabel =
    typeof p._DirectorySourceLabel === 'string' ? p._DirectorySourceLabel : '—';

  const url = primaryPluginUrl(p);
  const sid = typeof p._DirectorySourceId === 'string' ? p._DirectorySourceId : '';
  const isThird = sid !== '' && sid !== state.primaryFeedId;
  const iconUrl = derivePluginIconUrl(p);

  const classes = ['plugin-card'];
  if (p.IsHide === true) {
    classes.push('is-hidden');
  }
  if (isThird) {
    classes.push('from-custom');
  }

  const tagHtml =
    tags.length === 0
      ? ''
      : `<ul class="tag-list">${tags.map((tg) => `<li>${escapeHtml(tg)}</li>`).join('')}</ul>`;

  const innerBody = `
    <div class="card-top">
      <span class="source-pill"${isThird ? ' data-custom="1"' : ''}>${escapeHtml(sourceLabel)}</span>
      <span class="author">${escapeHtml(author)}</span>
    </div>
    <div class="plugin-title-wrap">
      ${iconUrl ? `<img src="${escapeAttrUrl(iconUrl)}" class="plugin-icon" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
      <span class="plugin-title">${escapeHtml(name)}</span>
    </div>
    <code class="internal-name">${escapeHtml(internal)}</code>
    ${punch ? `<p class="punch">${escapeHtml(punch)}</p>` : ''}
    <dl class="card-meta">
      <div><dt>${escapeHtml(t('cardVersion'))}</dt><dd>${escapeHtml(ver)}</dd></div>
      <div><dt>${escapeHtml(t('cardUpdated'))}</dt><dd>${escapeHtml(last)}</dd></div>
    </dl>
    ${tagHtml}
    ${!url ? `<p class="no-link-hint">${escapeHtml(t('cardNoLink'))}</p>` : ''}
  `.trim();

  if (url) {
    const ariaLabel = escapeHtml(`${name} · ${sourceLabel}`);
    return `<a class="${classes.join(
      ' ',
    )}" href="${escapeAttrUrl(url)}" rel="noopener noreferrer" target="_blank" aria-label="${ariaLabel}">${innerBody}</a>`;
  }

  return `<article class="${classes.join(' ')} plugin-card-nolink">${innerBody}</article>`;
}

/**
 * 一覧（行）表示用。
 *
 * @param {Record<string, unknown>} p
 */
function pluginListRowHtml(p) {
  const author = typeof p.Author === 'string' ? p.Author : '';
  const name = typeof p.Name === 'string' ? p.Name : '';
  const internal = typeof p.InternalName === 'string' ? p.InternalName : '';
  let punchShort = '';
  if (typeof p.Punchline === 'string' && p.Punchline.trim()) {
    punchShort = p.Punchline.trim();
  } else if (typeof p.Description === 'string' && p.Description.trim()) {
    punchShort = p.Description.trim();
  }
  if (punchShort.length > 200) {
    punchShort = `${punchShort.slice(0, 200)}…`;
  }
  const ver = p.AssemblyVersion != null ? String(p.AssemblyVersion) : '';
  const last = formatUnixUtc(p.LastUpdate);
  const tags = collectPluginTagStrings(p);
  const sourceLabel =
    typeof p._DirectorySourceLabel === 'string' ? p._DirectorySourceLabel : '—';

  const url = primaryPluginUrl(p);
  const sid = typeof p._DirectorySourceId === 'string' ? p._DirectorySourceId : '';
  const isThird = sid !== '' && sid !== state.primaryFeedId;
  const iconUrl = derivePluginIconUrl(p);

  const classes = ['plugin-row'];
  if (p.IsHide === true) {
    classes.push('is-hidden');
  }
  if (isThird) {
    classes.push('from-custom');
  }

  const tagHtml =
    tags.length === 0
      ? ''
      : `<div class="plugin-row-tags">${tags
          .map((tg) => `<span class="tag-chip">${escapeHtml(tg)}</span>`)
          .join('')}</div>`;

  const punchBlock = punchShort
    ? `<p class="plugin-row-punch">${escapeHtml(punchShort)}</p>`
    : '';

  const core = `
    <div class="plugin-row-cols">
      <span class="source-pill"${isThird ? ' data-custom="1"' : ''}>${escapeHtml(sourceLabel)}</span>
      <div class="plugin-row-main">
        <div class="plugin-title-wrap">
          ${iconUrl ? `<img src="${escapeAttrUrl(iconUrl)}" class="plugin-icon" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
          <span class="plugin-title">${escapeHtml(name)}</span>
        </div>
        <code class="internal-name">${escapeHtml(internal)}</code>
      </div>
      <span class="plugin-row-author">${escapeHtml(author)}</span>
      <div class="plugin-row-meta">
        <span class="meta-ver">${escapeHtml(ver)}</span>
        <span class="meta-sep">·</span>
        <span class="meta-updated">${escapeHtml(last)}</span>
      </div>
    </div>
    ${punchBlock}
    ${tagHtml}
    ${!url ? `<p class="plugin-row-no-link">${escapeHtml(t('cardNoLink'))}</p>` : ''}
  `.trim();

  if (url) {
    const ariaLabel = escapeHtml(`${name} · ${sourceLabel}`);
    return `<a class="${classes.join(
      ' ',
    )}" href="${escapeAttrUrl(url)}" rel="noopener noreferrer" target="_blank" aria-label="${ariaLabel}">${core}</a>`;
  }

  return `<article class="${classes.join(' ')} plugin-row-nolink">${core}</article>`;
}

/** @param {Record<string, unknown>} p */
function pluginEntryHtml(p) {
  return getSettings().pluginView === 'list' ? pluginListRowHtml(p) : pluginCardHtml(p);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape for URLs in HTML attributes such as href */
/** @param {string} s */
function escapeAttrUrl(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * 全プラグインからユニークなタグを収集し、タグセレクタを更新する。
 */
function populateTagSelector() {
  const seen = new Set();
  /** @type {string[]} */
  const allTags = [];
  for (const item of state.raw) {
    if (!item || typeof item !== 'object') continue;
    const tags = collectPluginTagStrings(/** @type {Record<string, unknown>} */ (item));
    for (const tg of tags) {
      const key = tg.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        allTags.push(tg);
      }
    }
  }
  allTags.sort((a, b) => a.localeCompare(b, intlLocale(), { sensitivity: 'base' }));

  // セレクタを再構築
  tagSelectorEl.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = t('tagFilterAll');
  tagSelectorEl.appendChild(defaultOpt);
  for (const tg of allTags) {
    const opt = document.createElement('option');
    opt.value = tg;
    opt.textContent = tg;
    tagSelectorEl.appendChild(opt);
  }
}

/**
 * アクティブタグのチップ表示を更新する。
 */
function renderActiveTagChips() {
  activeTagsEl.innerHTML = '';
  for (const tg of state.activeTags) {
    const chip = document.createElement('span');
    chip.className = 'active-tag-chip';
    chip.textContent = tg;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'active-tag-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${tg}`);
    removeBtn.addEventListener('click', () => {
      state.activeTags = state.activeTags.filter((t2) => t2 !== tg);
      renderActiveTagChips();
      applyFilter();
    });
    chip.appendChild(removeBtn);
    activeTagsEl.appendChild(chip);
  }
}

function applyFilter() {
  const q = searchInput.value.trim();
  const sid = sourceFilter.value;
  const activeTagsLower = state.activeTags.map((t2) => t2.toLowerCase());

  state.filtered = state.raw.filter((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }
    const p = /** @type {Record<string, unknown>} */ (item);

    if (sid) {
      const psid = typeof p._DirectorySourceId === 'string' ? p._DirectorySourceId : '';
      if (psid !== sid) {
        return false;
      }
    }

    // タグフィルター（AND条件）
    if (activeTagsLower.length > 0) {
      const pluginTags = collectPluginTagsLower(p);
      for (const needle of activeTagsLower) {
        if (!pluginTags.some((pt) => pt.includes(needle))) {
          return false;
        }
      }
    }

    return pluginMatchesSearch(p, q);
  });

  sortAndRender();
}

function sortAndRender() {
  const list = state.filtered.slice();
  const loc = intlLocale();
  if (state.sort === 'alpha') {
    list.sort((a, b) => {
      const na =
        a && typeof a === 'object' && typeof /** @type {any} */ (a).Name === 'string'
          ? /** @type {any} */ (a).Name
          : '';
      const nb =
        b && typeof b === 'object' && typeof /** @type {any} */ (b).Name === 'string'
          ? /** @type {any} */ (b).Name
          : '';
      return na.localeCompare(nb, loc, { sensitivity: 'base' });
    });
  } else {
    list.sort((a, b) => {
      const ta =
        a && typeof a === 'object' && typeof /** @type {any} */ (a).LastUpdate === 'number'
          ? /** @type {any} */ (a).LastUpdate
          : 0;
      const tb =
        b && typeof b === 'object' && typeof /** @type {any} */ (b).LastUpdate === 'number'
          ? /** @type {any} */ (b).LastUpdate
          : 0;
      const ma = ta < 1e12 ? ta * 1000 : ta;
      const mb = tb < 1e12 ? tb * 1000 : tb;
      return mb - ma;
    });
  }

  const html = list
    .map((p) =>
      p && typeof p === 'object' ? pluginEntryHtml(/** @type {Record<string, unknown>} */ (p)) : '',
    )
    .join('');
  gridEl.innerHTML = html;
  gridEl.setAttribute('aria-busy', 'false');
  gridEl.dataset.pluginView = getSettings().pluginView;

  countEl.textContent = t('countShowing', {
    current: String(list.length),
    total: String(state.raw.length),
  });
}

function applyTagFilterLabels() {
  const lbl = document.getElementById('label-tag-filter');
  if (lbl) lbl.textContent = t('tagFilter');
  // セレクタの先頭オプションのラベルを更新
  if (tagSelectorEl && tagSelectorEl.options.length > 0) {
    tagSelectorEl.options[0].textContent = t('tagFilterAll');
  }
}

function onSettingsUpdated() {
  applyStaticLabels();
  applyTagFilterLabels();
  if (state.meta) {
    applyBuildMetaBanner(state.meta);
    fillSourceFilter(state.meta);
  } else {
    fillSourceFilter({
      feeds: [{ id: 'official', label: t('officialFallback'), fetchOk: true }],
    });
  }
  if (state.dataLoaded) {
    populateTagSelector();
    applyFilter();
  }
}

async function main() {
  errorEl.hidden = true;
  countEl.textContent = t('loading');
  try {
    const { plugins, meta } = await fetchPluginPayload();
    if (!Array.isArray(plugins)) {
      throw new Error(t('errors.invalidPayload'));
    }

    state.dataLoaded = true;
    state.meta = meta;
    state.primaryFeedId =
      meta && typeof meta.primaryFeedId === 'string' && meta.primaryFeedId
        ? meta.primaryFeedId
        : 'official';
    state.raw = plugins;

    if (meta) {
      applyBuildMetaBanner(meta);
      fillSourceFilter(meta);
    } else {
      fillSourceFilter({
        feeds: [{ id: 'official', label: t('officialFallback'), fetchOk: true }],
      });
      if (
        plugins.length &&
        typeof plugins[0] === 'object' &&
        !('_DirectorySourceId' in /** @type {object} */ (plugins[0]))
      ) {
        for (const raw of plugins) {
          const p = /** @type {Record<string, unknown>} */ (raw);
          p._DirectorySourceId = 'official';
          p._DirectorySourceLabel = t('officialFallback');
          const internal = typeof p.InternalName === 'string' ? p.InternalName.toLowerCase() : '';
          p._ListingId = `official:${internal}`;
        }
      }
      buildMetaEl && (buildMetaEl.hidden = true);
    }

    populateTagSelector();
    applyTagFilterLabels();
    applyFilter();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errorEl.textContent = msg;
    errorEl.hidden = false;
    countEl.textContent = t('errors.loadFailedBanner');
    gridEl.setAttribute('aria-busy', 'false');
  }
}

initSettingsFromStorage();
bindSystemPreferenceListeners();
window.addEventListener(SETTINGS_EVENT, onSettingsUpdated);
applyStaticLabels();
bindSettingsUi();
countEl.textContent = t('loading');

searchInput.addEventListener('input', () => applyFilter());

sourceFilter.addEventListener('change', () => applyFilter());

tagSelectorEl.addEventListener('change', () => {
  const val = tagSelectorEl.value;
  if (val && !state.activeTags.some((t2) => t2.toLowerCase() === val.toLowerCase())) {
    state.activeTags.push(val);
    renderActiveTagChips();
    applyFilter();
  }
  tagSelectorEl.value = '';
});

sortUpdatedBtn.addEventListener('click', () => {
  state.sort = 'updated';
  sortUpdatedBtn.classList.add('active');
  sortAlphaBtn.classList.remove('active');
  sortAndRender();
});

sortAlphaBtn.addEventListener('click', () => {
  state.sort = 'alpha';
  sortAlphaBtn.classList.add('active');
  sortUpdatedBtn.classList.remove('active');
  sortAndRender();
});

main();
