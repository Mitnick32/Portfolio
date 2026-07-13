/* =========================================================
   Portfolio — TOTO Yao Wonder Japhet
   Script unique, chargé en defer sur toutes les pages.
   ========================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Menu mobile ---------------------------------- */
  const toggle = $(".nav__toggle");
  const links  = $(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
    });

    document.addEventListener("click", (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
      }
    });
  }

  /* ---- 2. Lien actif selon la page --------------------- */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav__links a").forEach((a) => {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  /* ---- 3. En-tête collant + barre de progression ------- */
  const header   = $(".site-header");
  const progress = $(".progress");

  const avatar = $(".float-avatar");
  const hero   = $(".hero");

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (avatar) {
      // sur l'accueil, on attend d'avoir dépassé le grand portrait
      const seuil = hero ? hero.offsetTop + hero.offsetHeight - 140 : 80;
      avatar.classList.toggle("is-visible", y > seuil);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- 4. Révélation au scroll ------------------------- */
  const revealables = $$(".reveal");
  if (revealables.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px" }
      );
      revealables.forEach((el) => io.observe(el));
    }
  }

  /* ---- 5. Jauges de compétences ------------------------ */
  const meters = $$(".meter__fill");
  if (meters.length) {
    const fill = (el) => (el.style.width = (el.dataset.level || 0) + "%");
    if (reduced || !("IntersectionObserver" in window)) {
      meters.forEach(fill);
    } else {
      const mo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            fill(e.target);
            mo.unobserve(e.target);
          });
        },
        { threshold: 0.5 }
      );
      meters.forEach((el) => mo.observe(el));
    }
  }

  /* ---- 6. Compteurs du hero ---------------------------- */
  const counters = $$("[data-count]");
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduced) { el.textContent = target; return; }
    let start = null;
    const dur = 1300;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---- 7. Filtres de projets --------------------------- */
  const filters  = $$(".filter");
  const projects = $$(".project");

  if (filters.length && projects.length) {
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.filter;
        filters.forEach((b) => b.classList.toggle("is-active", b === btn));

        projects.forEach((p, i) => {
          const match = cat === "tous" || p.dataset.cat === cat;
          p.classList.toggle("is-hidden", !match);
          if (match && !reduced) {
            p.style.animation = "none";
            void p.offsetWidth;               // reflow
            p.style.animation = `rise .5s var(--ease) ${i * 45}ms both`;
          }
        });

        projects.forEach((p) => {
          const b = p.querySelector(".acc__btn[aria-expanded='true']");
          if (b) b.click();
        });

        const shown = projects.filter((p) => !p.classList.contains("is-hidden")).length;
        const count = $("#project-count");
        if (count) count.textContent = shown;
      });
    });
  }

  /* ---- 8. Copier l'adresse e-mail ---------------------- */
  const copyBtn = $(".copy-mail");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", async () => {
      const mail = copyBtn.dataset.mail;
      try {
        await navigator.clipboard.writeText(mail);
        const old = copyBtn.querySelector("span").textContent;
        copyBtn.querySelector("span").textContent = "Adresse copiée";
        setTimeout(() => (copyBtn.querySelector("span").textContent = old), 1800);
      } catch {
        copyBtn.querySelector("span").textContent = "Copie impossible — sélectionne l'adresse";
      }
    });
  }

  /* ---- 9. Formulaire de contact (envoi direct, sans client mail) -- */
  const form = $("#contact-form");
  if (form) {
    const note    = $(".form__note");
    const sendBtn = $("#send-btn");
    const setError = (field, on) => field.classList.toggle("is-invalid", on);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nom     = $("#nom");
      const email   = $("#email");
      const message = $("#message");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      let ok = true;
      [[nom, nom.value.trim().length >= 2],
       [email, emailOk],
       [message, message.value.trim().length >= 10]].forEach(([el, valid]) => {
        setError(el.closest(".field"), !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        form.querySelector(".is-invalid input, .is-invalid textarea").focus();
        return;
      }

      note.className = "form__note";
      note.textContent = "Envoi en cours…";
      sendBtn.classList.add("is-loading");

      try {
        const res = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: nom.value.trim(),
            email: email.value.trim(),
            message: message.value.trim(),
            _subject: `Portfolio — message de ${nom.value.trim()}`,
            _template: "table",
            _captcha: "false"
          })
        });

        if (!res.ok) throw new Error(res.status);

        form.classList.add("is-sent");
        note.className = "form__note is-ok";
        note.textContent = "Message envoyé. Je te réponds sous 24 à 48 heures.";
      } catch {
        note.className = "form__note is-ko";
        note.innerHTML = 'L\'envoi a échoué. Écris-moi directement à <a class="link-u" href="mailto:totowonder010@gmail.com">totowonder010@gmail.com</a>.';
      } finally {
        sendBtn.classList.remove("is-loading");
      }
    });

    form.querySelectorAll("input, textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest(".field").classList.remove("is-invalid"))
    );
  }

  /* ---- 9b. Accordéons (projets, compétences, certifs) -- */
  const accBtns = $$(".acc__btn");

  const closePanel = (btn, panel) => {
    panel.style.maxHeight = panel.scrollHeight + "px";
    requestAnimationFrame(() => {
      panel.style.maxHeight = "0px";
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  };

  const openPanel = (btn, panel) => {
    panel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px";
  };

  accBtns.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      open ? closePanel(btn, panel) : openPanel(btn, panel);

      const lbl = btn.querySelector(".acc__label");
      if (lbl && lbl.dataset.alt === undefined) lbl.dataset.alt = lbl.textContent;
      if (lbl) lbl.textContent = open ? lbl.dataset.alt : "Replier";
      if (btn.dataset.cursor) btn.dataset.cursor = open ? "Détails" : "Replier";
    });

    // une fois l'animation finie, on libère la hauteur (contenu réactif)
    panel.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "max-height") return;
      if (panel.classList.contains("is-open")) panel.style.maxHeight = "none";
    });
  });

  // recalcule les hauteurs au redimensionnement
  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      $$(".acc__panel.is-open").forEach((p) => (p.style.maxHeight = "none"));
    }, 150);
  });

  /* ---- 9c. Curseur ------------------------------------- */
  const cursor = $(".cursor");
  const fine = window.matchMedia("(pointer: fine)").matches;

  if (cursor && fine && !reduced) {
    document.documentElement.classList.add("has-cursor");

    const dot  = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);

    let mx = innerWidth / 2, my = innerHeight / 2;   // position de la souris
    let rx = mx, ry = my;                            // position de l'anneau (retard)
    let scale = 1;                                   // contraction au clic

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cursor.classList.remove("is-out");
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener("mouseleave", () => cursor.classList.add("is-out"));
    document.addEventListener("mousedown", () => { scale = 0.86; });
    document.addEventListener("mouseup",   () => { scale = 1; });

    const HOT  = "a, button, .chip, .card, .project, .filter, .social a";
    const TEXT = "input, textarea";

    document.addEventListener("mouseover", (e) => {
      cursor.classList.toggle("is-hot",  !!e.target.closest(HOT));
      cursor.classList.toggle("is-text", !!e.target.closest(TEXT));
    });
  }

  /* ---- 9d. Transition douce entre les pages ------------- */
  if (!reduced) {
    const internal = (a) =>
      a.hostname === location.hostname &&
      !a.hasAttribute("download") &&
      a.target !== "_blank" &&
      !a.getAttribute("href").startsWith("#") &&
      !a.getAttribute("href").startsWith("mailto:");

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || !internal(a) || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => (location.href = a.href), 250);
    });

    // au retour arrière du navigateur, on réaffiche la page
    window.addEventListener("pageshow", () => document.body.classList.remove("is-leaving"));
  }

  /* ---- 10. Année courante dans le pied de page ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
