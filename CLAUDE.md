# Halv Mater — nettside

Standalone nettside for Halv Mater forlag, hostet via GitHub Pages på domenet **halvmater.no**.

**Repo:** `pcstrom/halvmater` (GitHub)
**Domene:** halvmater.no (registrert hos Domeneshop)
**Inspirasjonsreferanse:** Fitzcarraldo Editions — minimalistisk, litterær estetikk

---

## Innhold

- Forsiden viser gjeldende utgivelse: **Basaliteter av Georg Grunnvoll** (diktsamling, 329 kr / 479 kr bok+CD)
- Bestilling via Vipps (99031130) og e-post (utsyn@mpcu.no)
- Nav: Forfattere | Musikk | Anmeldelser

## Filstruktur

```
./
  CNAME                    ← halvmater.no
  index.html               ← forsiden (Basaliteter)
  basaliteter.jpg          ← bokbilde (midlertidig)
  logo*.png/svg            ← logovarianter
  banner*.png              ← bannerbilder
  forfattere/
    index.html
    kjetil-grunnvoll.html
    prins-eric-hamtorst.html   ← Per Christians alter ego (anagram av Per Christian Strøm)
    elvira-madiganske.html     ← fiktiv
  musikk/
    index.html             ← to album av Henrik Bazaar & Georg Grunnvoll
  anmeldelser/
    index.html
    avisa-nordland.html    ← «Kortreiste dikt med lang rekkevidde»
    utsidens-dyd.html      ← «Utsidens dyd» (essayistisk lesning)
    vinduet.html           ← «Det halvfortærte»
```

## Design

- Lys, varm bakgrunn: `--bg: #faf9f6`, `--text: #1c1c1a`, `--border: #e0dbd4`
- Sabon-font via Adobe Fonts/Typekit: `<link rel="stylesheet" href="https://use.typekit.net/ukh3stv.css">`
- Logo: teksten «Halv Mater» i Sabon uppercase med `letter-spacing: 0.35em` (ikke bildefil)
- Minimalistisk layout, maks 660px bredde
- På forsiden er site-title en `<span>` (ikke lenke); på undersider er det `<a href="../index.html">`

## Bestilling

- Vipps: **99031130**, merk med «Basaliteter» + postadresse
- E-post: **forlag@halvmater.no**

## E-poststrategi

- **forlag@halvmater.no** — bestillinger, generell kontakt, administrative ting («kontoret»)
- **red@halvmater.no** — redaksjonelle og kunstneriske henvendelser («redaktøren»)
- **utsyn@mpcu.no** — kontakt knyttet til Strøm Epitecphro som eier av forlaget; brukes i footer ved siden av org.nr.-linjen

## Forfattersider

Ligger i `forfattere/`. Alle tre sider bruker samme stilmall som forsiden.
Georg Grunnvoll er eneste forfatter med faktisk utgivelse. Hamtørst er Per Christians alter ego (anagram av Per Christian Strøm) — kan utvikles. Madiganske er fiktiv plassholder.

## Aktuell utgivelse

**Basaliteter** av Georg Grunnvoll — diktsamling, Halv Mater 2026
Pris: 329 kr (bok) / 479 kr (bok + CD)
Bokbilde: `basaliteter.jpg` (midlertidig — byttes ut når endelig bilde er klart)

## Git og publisering

- **Repo:** `git@github.com:pcstrom/halvmater.git`
- **Branch:** `main`
- **Hosting:** GitHub Pages med custom domain `halvmater.no`
- Etter endringer: `git add`, `git commit`, `git push origin main`
- `.DS_Store`-filer skal ikke committes

## Arbeidsform

- Ren HTML/CSS — ingen rammeverk, ingen build-steg
- Norsk språk i all tekst på sidene
- Nøkternt, litterært uttrykk — ikke overdesigne

## Arbeidsregler for Claude

- **Aldri overdesigne.** Når du er i tvil: gjør mindre. Sjekk alltid eksisterende sider for mønster før du lager noe nytt.
- **Bevar stilkonsistens.** Nye sider kopierer HTML-struktur fra nærmeste eksisterende side — samme `<head>`, samme navigasjon, samme CSS-variabler.
- **Ikke endre `<link>`-taggen til Typekit** — fontene er avhengige av nøyaktig denne URL-en.
- **Ikke bruk JavaScript** uten eksplisitt forespørsel. Siden er ren HTML/CSS.
- **Bekreft før strukturelle endringer** (nye seksjoner i nav, endring av URL-struktur, nytt forfatteroppsett). Redaksjonelle/tekstlige endringer kan gjøres direkte.
- **Git:** Commit etter fullførte, logiske enheter — ikke etter hvert filsteg. Commit-meldinger på norsk, korte og beskrivende.
- **Fiktive forfattere** (Madiganske): Behandles som plassholder — ikke utvid innholdet uten eksplisitt ønske. Hamtørst er Per Christians alter ego og kan utvikles.
