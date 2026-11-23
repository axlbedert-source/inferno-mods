// Fills the pages from mods.js. Runs before the kit's scripts, so the rows it writes
// get the kit's hover and peek behaviour. You should not need to edit this file.
(function () {
  const site = window.SITE || {};
  const mods = (window.MODS || []).slice().sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const date = (d) => {
    const t = new Date((d || "") + "T00:00:00");
    return isNaN(t) ? d || "" : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  // the facts that are filled in, joined: "Aircraft · v1.0 · 48 MB"
  const meta = (m, sep) => [m.category, m.version && "v" + m.version, m.size].filter(Boolean).map(esc).join(sep);
  const page = (m) => "mod.html?id=" + encodeURIComponent(m.id);
  const isExternal = (u) => /^https?:/.test(u || "");
  const dl = (m, cls) => !m.download ? "" :
    `<a class="${cls}" href="${esc(m.download)}"${isExternal(m.download) ? ' rel="noopener"' : " download"}>Download the mod</a>`;
  // the kit's photos come in 500, 960 and 1280 widths: offer all three
  const srcset = (src) => {
    const k = /^(assets\/img\/photo-[a-z0-9]+)(-960|-1280)?\.jpg$/.exec(src || "");
    if (!k) return "";
    const set = [k[1] + "-500.jpg 500w", k[1] + "-960.jpg 960w"];
    if (k[2] !== "-960") set.push(src + " 1280w");
    // the frame crops a wide photo to fill it, so it needs a wider file than the frame itself
    return `srcset="${esc(set.join(", "))}" sizes="(max-width: 639px) 223vw, (max-width: 1023px) 100vw, 70vw"`;
  };
  const img = (m, extra = "") =>
    m.image ? `<img class="frame__img" src="${esc(m.image)}" ${srcset(m.image)} alt="${esc(m.imageAlt || m.name)}" width="960" height="640" decoding="async" ${extra}>` : "";

  // ---- facts in the hero ----
  const set = (k, v) => document.querySelectorAll(`[data-site="${k}"]`).forEach((e) => (e.textContent = v));
  set("count", mods.length + (mods.length === 1 ? " mod" : " mods"));
  if (mods[0]) set("latest", mods[0].name);
  const versions = [...new Set(mods.map((m) => m.dcsVersion).filter(Boolean))];
  if (versions.length) set("dcs", versions.sort().reverse()[0]);

  // ---- home: the list and its pictures ----
  const list = $("[data-mod-list]");
  if (list) {
    list.innerHTML = mods.map((m) => `
      <li data-peek-to="${esc(m.id)}" tabindex="0">
        <span class="rows__name"><a href="${page(m)}">${esc(m.name)}</a><small>${meta(m, " · ")}</small></span>
        <p>${esc(m.summary)}</p>
        <span class="rows__value">${dl(m, "link")}</span>
      </li>`).join("");
    $("[data-mod-pics]").innerHTML = mods.map((m, i) =>
      img(m, `data-peek-for="${esc(m.id)}" loading="lazy" data-source="stand-in" data-subject="stand-in"${i ? " hidden" : ""}`)).join("");
  }

  // ---- nav panel: the three newest mods as picture cards ----
  const menu = $("[data-mod-menu]");
  if (menu) {
    menu.innerHTML = mods.slice(0, 3).map((m) => `
      <a class="menu-card span-4" href="${page(m)}">
        <div class="panel">${img(m, 'loading="lazy"')}</div>
        <span class="t-card">${esc(m.name)}</span>
        <span class="t-small muted">${meta(m, ", ")}</span>
      </a>`).join("");
  }

  // ---- footer ----
  const foot = $("[data-mod-footer]");
  if (foot) foot.innerHTML = mods.slice(0, 3).map((m) => `<li><a href="${page(m)}">${esc(m.name)}</a></li>`).join("");
  const links = $("[data-site-links]");
  if (links && (site.links || []).length) {
    links.hidden = false;
    const lede = $("[data-footer-lede]");
    if (lede) lede.className = lede.className.replace("span-6", "span-3");
    links.querySelector("ul").innerHTML = site.links
      .map((l) => `<li><a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a></li>`).join("");
  }

  // ---- mod page ----
  const detail = $("[data-mod-detail]");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const m = mods.find((x) => x.id === id) || mods[0];
    if (!m) return;
    document.title = `${m.name}: a free DCS World mod by ${site.title || ""}`;
    const fill = (k, html) => { const e = detail.querySelector(`[data-f="${k}"]`); if (e) e.innerHTML = html; };
    fill("name", esc(m.name));
    fill("summary", esc(m.summary));
    fill("download", dl(m, "btn btn--primary"));
    fill("facts", [
      ["Category", m.category], ["Version", m.version], ["Tested on", m.dcsVersion && "DCS " + m.dcsVersion],
      ["Updated", date(m.updated)], ["Size", m.size]
    ].filter((r) => r[1]).map((r) => `<li><span class="rows__name">${esc(r[0])}</span><span class="rows__value">${esc(r[1])}</span></li>`).join(""));
    fill("pic", img(m, 'fetchpriority="high"'));
    fill("about", esc(m.description));
    // a part with nothing in mods.js yet is left out, its heading too
    const drop = (k) => detail.querySelectorAll(`[data-part="${k}"]`).forEach((e) => (e.hidden = true));
    if (!m.description) drop("about");
    if (!(m.install || []).length) drop("install");
    if (!(m.changelog || []).length) drop("changes");
    fill("install", (m.install || []).map((s) => `<li>${esc(s)}</li>`).join(""));
    fill("changes", (m.changelog || []).map((c) =>
      `<li><span class="rows__name">v${esc(c.version)}</span><p>${esc(c.notes)}</p></li>`).join(""));
  }
})();
