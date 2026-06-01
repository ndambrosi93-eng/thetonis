# The Tonis Wedding · Debora & Nicola

Sito web **mobile-first** del matrimonio di Debora e Nicola — 3 ottobre 2026, Paese (TV).
Realizzato in **HTML + CSS + JavaScript vanilla**, senza framework, senza backend e senza database.
Si pubblica gratuitamente online (GitHub Pages o Netlify).

---

## Struttura del progetto

```text
the-tonis-wedding/
├── index.html          ← pagina unica (one-page)
├── style.css           ← stile "secret garden imperiale"
├── script.js           ← countdown, copia IBAN, .ics, nav, animazioni
├── README.md           ← questo file
│
└── assets/
    ├── favicon.svg
    ├── images/
    │   ├── user/        ← LE TUE FOTO (da sostituire)
    │   └── ai/          ← decorazioni e placeholder grafici
    └── icons/           ← icone della bottom navigation (SVG)
```

> Per vedere il sito basta aprire `index.html` in un browser.
> Suggerimento: per far funzionare tutto al meglio (font, iframe), usa un piccolo
> server locale, ad esempio dal terminale nella cartella del progetto:
> `python3 -m http.server` e apri `http://localhost:8000`.

---

## 1 · Sostituire le immagini

Metti le tue foto personali nella cartella:

```text
assets/images/user/
```

mantenendo **esattamente questi nomi file** (così non devi toccare il codice):

```text
foto-coppia-1.jpg     → Our Story (blocco "Le nostre radici")
foto-coppia-2.jpg     → Our Story (blocco "Il nostro sì a Paese")
foto-casa-toni.jpg    → Our Story (blocco "La casa di Toni")
foto-location.jpg     → (riserva / uso futuro)
foto-mood-1.jpg       → Moodboard
foto-mood-2.jpg       → Moodboard
foto-mood-3.jpg       → Moodboard
foto-mood-4.jpg       → Moodboard
```

Consigli:
- Usa immagini in formato **.jpg** ottimizzate (lato lungo ~1200–1600 px) per un caricamento veloce.
- Le foto verticali rendono meglio nei blocchi "coppia"; quella della casa e della location possono essere orizzontali.
- Se cambi i **nomi** dei file, ricordati di aggiornarli dentro `index.html`.

---

## 2 · Cambiare l'IBAN

L'IBAN si trova in **due punti** dentro `index.html`, nella sezione *Honeymoon*.
Sostituisci ovunque il valore di esempio:

```text
IT00X0000000000000000000000
```

con l'IBAN reale. I due punti sono:

```html
<p class="iban__code" id="ibanCode">IT00X0000000000000000000000</p>
...
<button ... data-iban="IT00X0000000000000000000000">Copia IBAN</button>
```

Il testo dentro `iban__code` è quello mostrato a video; l'attributo `data-iban`
è quello che viene **copiato** quando si preme "Copia IBAN".
Puoi anche cambiare l'intestatario nella riga `Intestatario: Nicola D'Ambrosi`.

---

## 3 · Inserire il Google Form (RSVP)

Crea un Google Form con questi campi:

1. Nome e cognome
2. Parteciperai? (Sì / No)
3. Numero partecipanti
4. Presenza di bambini (Sì / No)
5. Se sì, quanti bambini?
6. Tipologia menu (Adulto / Bambino / Vegetariano / Vegano)
7. Allergie o intolleranze alimentari
8. Una canzone che ti farebbe piacere ballare
9. Messaggio per gli sposi

Poi, in `index.html`, sostituisci **due segnaposto**:

**a) Il modulo incorporato** — su Google Form: *Invia → icona `< >` (Incorpora HTML)*,
copia solo l'URL dentro `src="..."` e incollalo al posto di `GOOGLE_FORM_EMBED_URL`:

```html
<!-- Sostituire GOOGLE_FORM_EMBED_URL con il link embed reale del Google Form -->
<iframe src="GOOGLE_FORM_EMBED_URL" ...></iframe>
```

**b) Il link diretto** (pulsante "Apri il form") — su Google Form: *Invia → icona catena 🔗*,
incolla quel link al posto di `GOOGLE_FORM_LINK`:

```html
<a class="btn btn--solid" id="rsvpLink" href="GOOGLE_FORM_LINK" ...>Apri il form</a>
```

> Finché i segnaposto non vengono sostituiti, il sito mostra automaticamente
> un messaggio di fallback al posto dell'iframe (gestito da `script.js`).

---

## 4 · Cambiare i video (ingresso + sfondo RSVP)

I video del sito si trovano in:

```text
assets/video/hero.mp4        ← video di ingresso della home
assets/video/poster.jpg      ← anteprima della home (prima che il video parta)
assets/video/rsvp.mp4        ← video di sfondo della sezione RSVP
assets/video/rsvp-poster.jpg ← anteprima dello sfondo RSVP
```

Per sostituire un video, rimpiazza il file mantenendo lo stesso nome
(`hero.mp4` per la home, `rsvp.mp4` per l'RSVP).
Consigli importanti per smartphone:

- **Comprimi** i video per il web: gli attuali pesano ~5 MB (home) e ~1,6 MB (RSVP),
  720p senza audio. Evita file da decine di MB: su rete mobile sarebbero lentissimi.
- L'**audio viene comunque silenziato**: i telefoni riproducono i video in
  automatico solo se sono muti. Per questo l'audio è stato rimosso.
- I video sono orizzontali e su smartphone viene mostrata la **parte centrale**
  (riempiono lo schermo / lo sfondo). Se vuoi che si veda tutto il fotogramma,
  posso preparare versioni verticali dedicate.
- Per aggiornare le anteprime, sostituisci `poster.jpg` e `rsvp-poster.jpg`
  con un fotogramma del relativo video.

> Se l'autoplay viene bloccato dal browser, sul video della home compare un
> piccolo pulsante "Riproduci"; lo sfondo RSVP resta sul fotogramma di anteprima.
> Chi ha attivo "riduci movimento" vedrà i poster fermi.

## 5 · Aggiungere la musica di sottofondo

Metti il tuo file musicale qui:

```text
assets/audio/music.mp3
```

(c'è già un file silenzioso di prova — sostituiscilo con la vostra canzone,
mantenendo il nome `music.mp3`).

Consigli:

- Formato **MP3** (compatibile con tutti i browser e iPhone).
- Brano **strumentale** o significativo per voi, ideale come sottofondo.
- Tienilo sotto i **3–5 MB** (un brano di 3 min a 128 kbps ≈ 3 MB).
  Per tagliarlo: [mp3cut.net](https://mp3cut.net) (gratuito).

Come funziona:

- La musica **parte al primo tap** dell'invitato (tocco, click su qualsiasi punto).
  I telefoni non permettono audio completamente automatico.
- Entra con un **fade-in dolce**.
- Un pulsantino in basso a sinistra (🎵 con onde animate) permette
  di **mettere in pausa e riavviare**.
- **Funziona su iPhone** — il codice è scritto apposta per Safari iOS.
- Se il file `music.mp3` non c'è, il pulsante non compare.

Per cambiare il volume: in `script.js` cerca `TARGET_VOL = 0.45`
e modifica (0 = muto, 1 = massimo).

## 6 · Pubblicare online (gratis)

### Opzione A — GitHub Pages

1. Crea un account su [github.com](https://github.com) e poi un nuovo **repository** (es. `the-tonis-wedding`).
2. Carica tutti i file del progetto (mantenendo la struttura delle cartelle).
   Puoi trascinarli nella pagina del repo con *Add file → Upload files*.
3. Vai su **Settings → Pages**.
4. In *Build and deployment*, alla voce *Source* scegli **Deploy from a branch**,
   seleziona il branch `main` e la cartella `/ (root)`, poi **Save**.
5. Dopo qualche minuto il sito sarà online all'indirizzo:
   `https://TUO-UTENTE.github.io/the-tonis-wedding/`

### Opzione B — Netlify (ancora più rapido)

1. Crea un account su [netlify.com](https://www.netlify.com).
2. Vai su **Netlify Drop**: [app.netlify.com/drop](https://app.netlify.com/drop).
3. **Trascina l'intera cartella** `the-tonis-wedding` nella finestra.
4. Il sito viene pubblicato in pochi secondi e ricevi un **link pubblico**
   (es. `https://nome-casuale.netlify.app`), che puoi personalizzare nelle impostazioni.

> Entrambe le soluzioni sono gratuite e perfette per condividere il link via WhatsApp.

---

## Note tecniche

- **Mobile-first** con bottom navigation fissa (Home · Programma · RSVP · Viaggio · Storia).
- **Countdown** al 3 ottobre 2026 in tempo reale.
- **Aggiungi al calendario**: genera e scarica un file `.ics`.
- **Copia IBAN** con feedback "IBAN copiato".
- **Scroll fluido**, **active state** del menu e **micro-animazioni on-scroll**.
- Rispetta `prefers-reduced-motion` per chi preferisce meno animazioni.
- Font via Google Fonts: *Cormorant Garamond*, *Mulish*, *Pinyon Script*.

Buone nozze! 🤍
```text
The Tonis Wedding
Debora & Nicola
3 ottobre 2026 · Paese (TV)
```
