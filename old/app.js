(function () {
  const site = window.SITE || {};
  const mods = (window.MODS || []).slice().sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---- Site text ----
  document.title = site.title || "DCS Mods";
  $("#site-title").textContent = site.title || "DCS Mods";
  $("#site-tagline").textContent = site.tagline || "";
  $("#site-author").textContent = site.author || "";
  $("#mod-count").textContent = mods.length + (mods.length === 1 ? " mod" : " mods");
  $("#footer-links").innerHTML = (site.links || [])
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
    .join("");

  // ---- Placeholder art when a mod has no image ----
  const palette = { Aircraft: 150, Livery: 200, Map: 95, Mission: 20, Script: 265, Sound: 320, Utility: 45 };
  function placeholder(mod) {
    const hue = palette[mod.category] ?? 180;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='hsl(${hue},35%,22%)'/><stop offset='1' stop-color='hsl(${hue},30%,9%)'/></linearGradient></defs>
      <rect width='320' height='180' fill='url(#g)'/>
      <g stroke='hsla(${hue},60%,70%,.35)' fill='none' stroke-width='1.2'>
        <circle cx='160' cy='90' r='46'/><circle cx='160' cy='90' r='4'/>
        <path d='M100 90h40M180 90h40M160 30v30M160 120v30'/>
        <path d='M60 140l20-10M240 140l20 10M60 40l20 10M240 40l20-10'/>
      </g></svg>`;
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg).replace(/'/g, "%27") + "\")";
  }
  const bg = (mod) => (mod.image ? `url("${encodeURI(mod.image).replace(/'/g, "%27")}")` : placeholder(mod));
  const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  const downloadBtn = (mod) =>
    `<a class="btn btn-primary" href="${esc(mod.download)}" ${/^https?:/.test(mod.download) ? 'target="_blank" rel="noopener"' : "download"}>
       Download ${mod.size ? `<small>${esc(mod.size)}</small>` : ""}</a>`;

  // ---- Filters ----
  const cats = ["All", ...new Set(mods.map((m) => m.category).filter(Boolean))];
  let active = "All";
  let query = "";
  $("#filters").innerHTML = cats
    .map((c) => `<button class="chip" role="tab" data-cat="${esc(c)}" aria-selected="${c === active}">${esc(c)}</button>`)
    .join("");
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    active = b.dataset.cat;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", c === b));
    render();
  });
  $("#search").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); render(); });

  // ---- Grid ----
  function render() {
    const list = mods.filter((m) =>
      (active === "All" || m.category === active) &&
      (!query || [m.name, m.summary, m.description, m.category].join(" ").toLowerCase().includes(query))
    );
    $("#grid").innerHTML = list.map((m) => `
      <article class="card">
        <button class="thumb" data-open="${esc(m.id)}" style='background-image:${bg(m)}' aria-label="Details for ${esc(m.name)}">
          <span class="tag">${esc(m.category)}</span>
        </button>
        <div class="card-body">
          <h2><button data-open="${esc(m.id)}">${esc(m.name)}</button></h2>
          <p class="summary">${esc(m.summary)}</p>
          <div class="meta">
            <span>v<b>${esc(m.version)}</b></span>
            ${m.dcsVersion ? `<span>DCS <b>${esc(m.dcsVersion)}</b></span>` : ""}
            <span>${esc(fmtDate(m.updated))}</span>
          </div>
          <div class="actions">
            ${downloadBtn(m)}
            <button class="btn btn-ghost" data-open="${esc(m.id)}">Details</button>
          </div>
        </div>
      </article>`).join("");
    $("#empty").hidden = list.length > 0;
  }

  // ---- Detail dialog ----
  const dlg = $("#detail");
  function open(id, push = true) {
    const m = mods.find((x) => x.id === id);
    if (!m) return;
    const list = (arr) => (arr || []).map((s) => `<li>${esc(s)}</li>`).join("");
    $("#detail-body").innerHTML = `
      <div class="thumb" style='background-image:${bg(m)}'><span class="tag">${esc(m.category)}</span></div>
      <div class="detail-inner">
        <h2>${esc(m.name)}</h2>
        <div class="meta">
          <span>Version <b>${esc(m.version)}</b></span>
          ${m.dcsVersion ? `<span>Tested on DCS <b>${esc(m.dcsVersion)}</b></span>` : ""}
          <span>Updated <b>${esc(fmtDate(m.updated))}</b></span>
          ${m.size ? `<span>Size <b>${esc(m.size)}</b></span>` : ""}
        </div>
        <div class="actions">${downloadBtn(m)}</div>
        ${m.description ? `<h3>About</h3><p>${esc(m.description)}</p>` : ""}
        ${m.install?.length ? `<h3>Install</h3><ol>${list(m.install)}</ol>` : ""}
        ${m.changelog?.length ? `<h3>Changelog</h3><ul class="changelog">${m.changelog
          .map((c) => `<li><b>v${esc(c.version)}</b>${esc(c.notes)}</li>`).join("")}</ul>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    if (push) history.replaceState(null, "", "#" + encodeURIComponent(id));
  }
  function close() {
    dlg.close();
  }
  dlg.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) open(t.dataset.open);
  });
  $("#close").addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });

  render();
  // Link straight to a mod: yoursite.com/#mod-id
  if (location.hash.length > 1) open(decodeURIComponent(location.hash.slice(1)), false);
})();
