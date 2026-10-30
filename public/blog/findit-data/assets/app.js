/* Findit field note — reader, counters, records table. No dependencies. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------- sticky bar -- */
  const bar = $(".bar");
  const setBarHeight = () => {
    if (!bar) return;
    document.documentElement.style.setProperty("--bar-h", bar.offsetHeight + "px");
  };
  setBarHeight();
  window.addEventListener("resize", setBarHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setBarHeight).catch(() => {});
  }

  /* -------------------------------------------------------------- reveal -- */
  const revealables = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            reveal.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => reveal.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  /* ------------------------------------------------------------ counters -- */
  const counters = $$("[data-count]");
  const fmt = (value, dec) =>
    dec ? value.toFixed(dec) : Math.round(value).toLocaleString("en-US");

  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || "0", 10);
    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = fmt(target, dec);
      return;
    }
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterObs.observe(el));
  }

  /* -------------------------------------------------------------- meters -- */
  const fills = $$(".meter-fill, .domain-fill");
  if ("IntersectionObserver" in window) {
    const meterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.pct + "%";
            meterObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    fills.forEach((el) => meterObs.observe(el));
  } else {
    fills.forEach((el) => (el.style.width = el.dataset.pct + "%"));
  }

  /* ------------------------------------------------------------ nav spy -- */
  const navLinks = $$(".bar-nav a");
  const navMap = new Map();
  navLinks.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) navMap.set(section, a);
  });
  if ("IntersectionObserver" in window && navMap.size) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.remove("active"));
          const link = navMap.get(entry.target);
          if (link) link.classList.add("active");
        });
      },
      { rootMargin: "-38% 0px -56% 0px", threshold: 0 }
    );
    navMap.forEach((_, section) => navObs.observe(section));
  }

  /* -------------------------------------------------------------- escape -- */
  const esc = (value) =>
    String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const hostOf = (url) =>
    url
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/$/, "");

  const shortHost = (url) => {
    const host = hostOf(url);
    return host.length > 32 ? host.slice(0, 30) + "…" : host;
  };

  const numberCount = (phone) => (phone.match(/\+\d{2,4}[\s\d]{5,}/g) || []).length;

  /* ------------------------------------------------------------ records -- */
  const pageSize = () => (window.innerWidth < 860 ? 12 : 25);

  const state = {
    all: [],
    q: "",
    filters: new Set(),
    sort: "name",
    limit: pageSize(),
  };

  const body = $("#recBody");
  const countEl = $("#recCount");
  const moreBtn = $("#recMore");
  const searchEl = $("#recSearch");
  const sortEl = $("#recSort");
  const csvBtn = $("#recCsv");

  const hasEmail = (r) => r.email.indexOf("@") > -1;
  const hasPhone = (r) => /\d/.test(r.phone);
  const hasWeb = (r) => /^https?:\/\//i.test(r.website);

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let rows = state.all;

    if (q) {
      rows = rows.filter((r) => {
        return (
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.website.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q)
        );
      });
    }

    if (state.filters.size) {
      rows = rows.filter((r) => {
        if (state.filters.has("email") && !hasEmail(r)) return false;
        if (state.filters.has("phone") && !hasPhone(r)) return false;
        if (state.filters.has("web") && !hasWeb(r)) return false;
        return true;
      });
    }

    const copy = rows.slice();
    if (state.sort === "name") {
      copy.sort((a, b) => a.name.localeCompare(b.name, "en"));
    } else if (state.sort === "name-desc") {
      copy.sort((a, b) => b.name.localeCompare(a.name, "en"));
    } else if (state.sort === "complete") {
      const score = (r) => +hasEmail(r) + +hasPhone(r) + +hasWeb(r);
      copy.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, "en"));
    } else if (state.sort === "phones") {
      copy.sort(
        (a, b) => numberCount(b.phone) - numberCount(a.phone) || a.name.localeCompare(b.name, "en")
      );
    }
    return copy;
  }

  function rowHTML(r) {
    const phones = numberCount(r.phone);
    const phone = hasPhone(r)
      ? `${esc(r.phone)}${phones > 1 ? `<span class="phone-badge" title="${phones} numbers published">×${phones}</span>` : ""}`
      : `<span class="na">—</span>`;
    const email = hasEmail(r) ? esc(r.email) : `<span class="na">—</span>`;
    const web = hasWeb(r)
      ? `<a href="${esc(r.website)}" target="_blank" rel="noopener nofollow" title="${esc(r.website)}">${esc(shortHost(r.website))}</a>`
      : `<span class="na">—</span>`;

    return `<tr>
      <td class="cell-name">${esc(r.name)}</td>
      <td class="cell-phone${hasPhone(r) ? "" : " na-cell"}">${phone}</td>
      <td class="cell-email${hasEmail(r) ? "" : " na-cell"}">${email}</td>
      <td class="cell-web${hasWeb(r) ? "" : " na-cell"}">${web}</td>
    </tr>`;
  }

  function render() {
    if (!body) return;
    const rows = filtered();
    const shown = rows.slice(0, state.limit);

    body.innerHTML = shown.length
      ? shown.map(rowHTML).join("")
      : `<tr><td colspan="4" class="rec-empty">No business matches that search. <button type="button" class="chip" id="recClear">Clear filters</button></td></tr>`;

    if (countEl) {
      const total = state.all.length.toLocaleString("en-US");
      const n = rows.length.toLocaleString("en-US");
      countEl.innerHTML =
        rows.length === state.all.length
          ? `Showing <b>${shown.length.toLocaleString("en-US")}</b> of <b>${total}</b> businesses`
          : `<b>${n}</b> matches · showing <b>${shown.length.toLocaleString("en-US")}</b>`;
    }

    if (moreBtn) {
      moreBtn.hidden = rows.length <= state.limit;
      moreBtn.textContent = `Show ${pageSize()} more · ${(rows.length - shown.length).toLocaleString("en-US")} left`;
    }

    const clear = $("#recClear");
    if (clear) {
      clear.addEventListener("click", () => {
        state.q = "";
        if (searchEl) searchEl.value = "";
        state.filters.clear();
        $$(".chip[data-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
        state.limit = pageSize();
        render();
        if (searchEl) searchEl.focus();
      });
    }
  }

  let debounce;
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.q = searchEl.value;
        state.limit = pageSize();
        render();
      }, 110);
    });
  }

  $$(".chip[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.filter;
      const on = chip.getAttribute("aria-pressed") === "true";
      chip.setAttribute("aria-pressed", on ? "false" : "true");
      if (on) state.filters.delete(key);
      else state.filters.add(key);
      state.limit = pageSize();
      render();
    });
  });

  if (sortEl) {
    sortEl.addEventListener("change", () => {
      state.sort = sortEl.value;
      state.limit = pageSize();
      render();
    });
  }

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      state.limit += pageSize();
      render();
    });
  }

  function toCsv(rows) {
    const cell = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const head = ["name", "phone", "email", "website"].join(",");
    return (
      head +
      "\n" +
      rows.map((r) => [r.name, r.phone, r.email, r.website].map(cell).join(",")).join("\n")
    );
  }

  if (csvBtn) {
    csvBtn.addEventListener("click", () => {
      const rows = filtered();
      if (!rows.length) return;
      const blob = new Blob(["\ufeff" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = state.q || state.filters.size ? "findit-malta-filtered.csv" : "findit-malta-2501.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 400);
      const label = csvBtn.textContent;
      csvBtn.textContent = "Saved →";
      setTimeout(() => (csvBtn.textContent = label), 1600);
    });
  }

  fetch("/blog/findit-data/assets/data/records.json")
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then((data) => {
      state.all = data.records || [];
      render();
    })
    .catch((err) => {
      if (body) {
        body.innerHTML = `<tr><td colspan="4" class="rec-empty">The records file didn't load (${esc(
          err.message
        )}). <a href="/blog/findit-data/assets/data/records.json">Download it directly</a>.</td></tr>`;
      }
      if (countEl) countEl.textContent = "Records unavailable";
    });
})();
