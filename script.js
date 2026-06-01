/* ============================================================
   THE TONIS WEDDING — script.js (JavaScript vanilla)
   Funzioni:
   1. Countdown al 3 ottobre 2026
   2. Copia IBAN + feedback
   3. Scroll fluido tra sezioni
   4. Active state della bottom navigation
   5. Generazione/download file .ics (Aggiungi al calendario)
   6. Animazioni on-scroll
   7. Fallback se il Google Form non è disponibile
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DATA DEL MATRIMONIO ---------- */
  // 3 ottobre 2026, inizio giornata ore 10:00 (orario locale)
  const WEDDING = new Date("2026-10-03T10:00:00");

  /* ============================================================
     1 · COUNTDOWN
     ============================================================ */
  const cd = {
    days:  document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins:  document.getElementById("cd-mins"),
    secs:  document.getElementById("cd-secs"),
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tickCountdown() {
    const diff = WEDDING.getTime() - Date.now();
    if (diff <= 0) {
      cd.days.textContent = cd.hours.textContent = cd.mins.textContent = cd.secs.textContent = "00";
      return;
    }
    const s = Math.floor(diff / 1000);
    cd.days.textContent  = pad(Math.floor(s / 86400));
    cd.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.mins.textContent  = pad(Math.floor((s % 3600) / 60));
    cd.secs.textContent  = pad(s % 60);
  }
  if (cd.days) { tickCountdown(); setInterval(tickCountdown, 1000); }

  /* ============================================================
     2 · COPIA IBAN + feedback elegante
     ============================================================ */
  const btnIban  = document.getElementById("btnCopyIban");
  const feedback = document.getElementById("ibanFeedback");

  if (btnIban) {
    btnIban.addEventListener("click", async () => {
      const iban = (btnIban.dataset.iban || "").replace(/\s+/g, "");
      let ok = false;
      try {
        await navigator.clipboard.writeText(iban);
        ok = true;
      } catch (e) {
        // Fallback per browser senza Clipboard API
        const tmp = document.createElement("textarea");
        tmp.value = iban;
        tmp.style.position = "fixed";
        tmp.style.opacity = "0";
        document.body.appendChild(tmp);
        tmp.select();
        try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
        document.body.removeChild(tmp);
      }
      if (feedback) {
        feedback.textContent = ok ? "IBAN copiato" : "Copia manualmente l’IBAN";
        feedback.classList.add("show");
        clearTimeout(feedback._t);
        feedback._t = setTimeout(() => feedback.classList.remove("show"), 2600);
      }
    });
  }

  /* ============================================================
     3 · SCROLL FLUIDO tra sezioni
     ============================================================ */
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
  ) || 68;

  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 6;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ============================================================
     4 · ACTIVE STATE della bottom navigation
     ============================================================ */
  const navItems = Array.from(document.querySelectorAll(".bottomnav__item"));
  // sezioni osservate (mappate alle voci di menu)
  const watched = ["home", "programma", "rsvp", "viaggio", "storia"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    navItems.forEach((it) =>
      it.classList.toggle("is-active", it.dataset.section === id)
    );
  }

  if ("IntersectionObserver" in window && watched.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        // sceglie la sezione più visibile
        let best = null;
        entries.forEach((en) => {
          if (en.isIntersecting && (!best || en.intersectionRatio > best.intersectionRatio)) {
            best = en;
          }
        });
        if (best) setActive(best.target.id);
      },
      { rootMargin: `-45% 0px -45% 0px`, threshold: [0, 0.25, 0.5, 1] }
    );
    watched.forEach((sec) => navObserver.observe(sec));
  }

  /* ============================================================
     5 · AGGIUNGI AL CALENDARIO — genera e scarica file .ics
     ============================================================ */
  const btnIcs = document.getElementById("btnIcs");

  function formatICSDate(d) {
    // formato locale "floating" YYYYMMDDTHHMMSS
    return (
      d.getFullYear() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) + "T" +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds())
    );
  }

  if (btnIcs) {
    btnIcs.addEventListener("click", () => {
      const start = new Date("2026-10-03T10:00:00");
      const end   = new Date("2026-10-03T23:00:00");
      const stamp = formatICSDate(new Date());

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//The Tonis Wedding//IT",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "UID:tonis-wedding-2026@deboraenicola",
        "DTSTAMP:" + stamp,
        "DTSTART:" + formatICSDate(start),
        "DTEND:" + formatICSDate(end),
        "SUMMARY:The Tonis Wedding — Debora & Nicola",
        "DESCRIPTION:Matrimonio di Debora e Nicola.",
        "LOCATION:Paese (TV)",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "the-tonis-wedding.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
  }

  /* ============================================================
     6 · ANIMAZIONI ON-SCROLL (reveal elementi .animate)
     ============================================================ */
  const animated = document.querySelectorAll(".animate");
  if ("IntersectionObserver" in window && animated.length) {
    const animObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    animated.forEach((el) => animObserver.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("in-view"));
  }

  /* ============================================================
     7 · FALLBACK Google Form
     Se il link embed non è stato ancora sostituito (placeholder),
     nasconde l'iframe e mostra il messaggio + pulsante.
     ============================================================ */
  const frame    = document.getElementById("rsvpFrame");
  const fallback = document.getElementById("rsvpFallback");
  const iframe   = frame ? frame.querySelector("iframe") : null;
  const rsvpLink = document.getElementById("rsvpLink");

  const formNotReady = iframe && iframe.getAttribute("src") === "GOOGLE_FORM_EMBED_URL";
  const linkNotReady = rsvpLink && rsvpLink.getAttribute("href") === "GOOGLE_FORM_LINK";

  if (formNotReady) {
    frame.hidden = true;
    if (fallback) fallback.hidden = false;
  }
  // Evita che il link placeholder porti a una pagina rotta
  if (linkNotReady && rsvpLink) {
    rsvpLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (fallback) {
        fallback.hidden = false;
        fallback.querySelector("p").textContent =
          "Il link del modulo non è ancora stato inserito.";
      }
    });
  }

  /* ============================================================
     8 · VIDEO (ingresso hero + sfondo RSVP) — autoplay con fallback
     - prova a far partire ogni video (muto) automaticamente
     - se il browser blocca l'autoplay del video hero, mostra "Riproduci"
     - rispetta "riduci movimento": resta sul poster, senza riprodurre
     ============================================================ */
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Coppie video + eventuale pulsante di riproduzione manuale
  const videos = [
    { el: document.getElementById("heroVideo"), btn: document.getElementById("heroPlayBtn") },
    { el: document.getElementById("rsvpVideo"), btn: null },
  ];

  videos.forEach(({ el, btn }) => {
    if (!el) return;

    if (reduceMotion) {
      // niente autoplay: resta sul fotogramma poster
      el.removeAttribute("autoplay");
      el.removeAttribute("loop");
      try { el.pause(); } catch (e) {}
      return;
    }

    el.muted = true;                 // obbligatorio per l'autoplay su mobile
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        if (btn) {
          // hero: offri un pulsante per avviare il video
          btn.hidden = false;
          btn.addEventListener("click", () => { el.play(); btn.hidden = true; });
        }
        // sfondo RSVP senza pulsante: in caso di blocco resta il poster
      });
    }
  });

  /* ============================================================
     9 · MUSICA DI SOTTOFONDO — compatibile iPhone / Safari
     ============================================================
     iOS richiede che audio.play() sia chiamato DIRETTAMENTE dentro
     un event handler di un tocco dell'utente, nella stessa call-stack,
     senza controlli asincroni prima. Per questo:
     - al primo tap/click: play() subito (volume 0), poi fade-in
     - nessun check "audioReady" prima del play
     - se il file non esiste, play() fallisce e il pulsante non compare
     ============================================================ */
  const music  = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");

  if (music && toggle) {
    const TARGET_VOL = 0.45;    // volume finale (0 – 1)
    const FADE_MS    = 2200;    // durata fade-in
    let unlocked = false;       // true dopo il primo play() riuscito

    // Fade-in dolce
    function fadeIn() {
      music.volume = 0;
      const step = TARGET_VOL / (FADE_MS / 50);
      const iv = setInterval(() => {
        const next = music.volume + step;
        if (next >= TARGET_VOL) { music.volume = TARGET_VOL; clearInterval(iv); }
        else { music.volume = next; }
      }, 50);
    }

    // Mostra il pulsante nello stato corretto
    function showPlaying() {
      toggle.classList.add("visible", "is-playing");
      toggle.classList.remove("is-paused");
    }
    function showPaused() {
      toggle.classList.add("visible", "is-paused");
      toggle.classList.remove("is-playing");
    }

    // ── Primo tocco: "sblocca" l'audio su iOS chiamando play() subito ──
    function unlockAndPlay() {
      if (unlocked) return;
      // Volume 0 subito, così anche se parte non si sente nulla prima del fade
      music.volume = 0;
      // play() DEVE essere nella call-stack diretta del gesto utente
      const p = music.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
          fadeIn();
          showPlaying();
        }).catch(() => {
          // Il file non esiste o il browser ha bloccato: non mostrare nulla
        });
      }
    }

    // Ascolta il primo gesto (click + touchend coprono tutti i device)
    function onFirstGesture() {
      unlockAndPlay();
      document.removeEventListener("click", onFirstGesture, true);
      document.removeEventListener("touchend", onFirstGesture, true);
    }
    // ⚠ NON usare scroll/keydown: iOS non li considera gesti utente per l'audio
    if (!reduceMotion) {
      document.addEventListener("click", onFirstGesture, { capture: true, passive: true });
      document.addEventListener("touchend", onFirstGesture, { capture: true, passive: true });
    }

    // ── Toggle play / pause dal pulsante ──
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!unlocked) {
        // Primo tocco proprio sul pulsante
        unlockAndPlay();
        return;
      }
      if (music.paused) {
        music.volume = TARGET_VOL;
        music.play().then(showPlaying).catch(() => {});
      } else {
        music.pause();
        showPaused();
      }
    });

    // ── Rispetto "riduci movimento" ──
    if (reduceMotion) {
      showPaused();   // mostra il pulsante ma non avvia la musica
    }
  }
});
