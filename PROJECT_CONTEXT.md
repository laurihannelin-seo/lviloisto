# LVI-Loisto project context

Tämä tiedosto antaa uudelle Codex-tehtävälle pysyvän lähtötilanteen. Lue tämä
ennen sivuston muuttamista ja tarkista sen jälkeen nykyinen koodi sekä viimeisin
Git-historia. Koodi ja Git-historia ovat aina lopullinen totuus, jos tämä tiedosto
on jäänyt päivityksistä jälkeen.

## Projekti

- Yritys: LVI-Loisto Oy
- Sivuston kieli: suomi
- Tavoite: premium-henkinen suomalaisen LVI-urakoitsijan verkkosivusto
- Kohderyhmät: yksityisasiakkaat, arvoasunnot, villat, taloyhtiöt,
  kiinteistöt, rakennusliikkeet ja suunnittelijat
- GitHub: `https://github.com/laurihannelin-seo/lviloisto.git`
- Tuotantohaara: `main`
- Cloudflare Pages julkaisee `main`-haaran automaattisesti
- Nykyinen staging-osoite: `https://lviloisto.pages.dev/`
- Lopullinen domain: `https://lviloisto.fi`

## Tekninen toteutus

- Astro 5, TypeScript ja staattinen build
- Ei CMS:ää, backendia tai sisältökokoelmia tässä vaiheessa
- Fontti: paikallisesti npm-paketista ladattu Figtree Variable
- Päätyylit: `src/styles/global.css`
- Yhteinen layout: `src/layouts/BaseLayout.astro`
- Build output: `dist`

Komennot:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

Tavallinen `npm` toimii ympäristöissä, joissa PowerShellin execution policy ei
estä `npm.ps1`-skriptiä. Windowsissa `npm.cmd` on varma vaihtoehto eikä vaadi
järjestelmänvalvojan oikeuksia tai suojausasetusten muuttamista.

## Nykyiset sivut

- `/` - premium-etusivu
- `/lvi-urakointi/` - LVI-urakoinnin parent-palvelusivu
- `/tietoa-meista/` - yrityssivu
- `/yhteystiedot/` - yhteydenotto, kartta ja yritystiedot

Kaupunkikohtaisia sivuja ei ole vielä rakennettu. Tuleva rakenne:

- `/lvi-urakointi/helsinki/`
- `/lvi-urakointi/espoo/`
- `/lvi-urakointi/vantaa/`

Älä luo näitä sivuja ennen erillistä pyyntöä.

## Keskeiset komponentit

- `Header.astro` - yhteinen sticky-header ja navigaatio
- `Footer.astro` - yhteinen footer
- `ContactForm.astro` - sama tarjouspyyntölomake eri sivuilla
- `FaqSection.astro` - saavutettava FAQ/accordion
- `Breadcrumbs.astro` - sisältösivujen murupolku
- `ServiceContentSection.astro` - palvelu- ja SEO-sivujen yhteinen sisältöosio
- `NumberedContentList.astro` - numeroidut kohderyhmä- ja prosessilistat
- `PortfolioSection.astro` - etusivun kohteet
- `ProcessSection.astro` - etusivun interaktiivinen prosessiosio
- `SplitCta.astro` - kuvallinen kaksipalstainen CTA tarvittaessa

Käytä olemassa olevia komponentteja ennen uuden rinnakkaisen toteutuksen
luomista. Pidä muutokset rajattuina pyydettyyn sivuun tai ominaisuuteen.

## Visuaalinen suunta

- Premium, rauhallinen, arkkitehtoninen ja teknisesti uskottava
- Vaalea/off-white pohja, tumma teksti ja hillitty kultainen korosteväri
- Typografinen ja kuvallinen ilme, ei geneerisiä LVI-ikoneita
- Ei raskaita varjoja, sisäkkäisiä kortteja tai tarpeettomia animaatioita
- Paljon harkittua tilaa, mutta sisältösivuilla ei ylimitoitettua tyhjää tilaa
- Ohuet jakoviivat ja rauhalliset hover-efektit
- Kuvat käyttävät `object-fit: cover` -rajausta ja helposti vaihdettavia polkuja
- Mobiilissa sisältö pinoutuu selkeästi eikä sivu saa vuotaa vaakasuunnassa

Globaalit design-muuttujat ovat `global.css`-tiedoston alussa. Nykyiset
päävärit:

- sivupohja `#f7f4ee`
- valkoinen pinta `#ffffff`
- pääteksti `#161616`
- hillitty teksti `#5f5c56`
- kultainen koroste `#a9813f`
- tumma kultainen koroste `#6f5427`

## Etusivu

Etusivun hero ja sen visuaalinen identiteetti ovat hyväksyttyjä. Älä muuta
heroa tai yleistä sommittelua ilman nimenomaista pyyntöä.

Etusivulla on muun muassa:

- kuvallinen hero, jonka päällä on yksi H1
- palvelu- ja kohdetyyppiosiot
- Tietoa meistä -osio ja luottamuslogot
- menetelmä/prosessiosio
- tumma portfolio-osio
- tarjouspyyntölomake
- FAQ

## Palvelu- ja SEO-sivujen periaate

Palvelusivujen pitää olla etusivua perinteisempiä, tiiviimpiä ja helpommin
silmäiltäviä. Premium-ilme syntyy typografiasta ja viimeistelystä, ei valtavista
otsikoista tai jatkuvasti vaihtuvista editorial-rakenteista.

Oletusrakenne:

1. H1 + hero
2. H2 + sisältö
3. H2 + sisältö
4. Tarvittaessa numeroitu lista, kaksipalstainen vertailu tai FAQ
5. Selkeä loppu-CTA tai yhteydenottolomake

Nykyinen `/lvi-urakointi/` käyttää 92 rem sisältöcontaineria, joka linjautuu
heron tekstin kanssa. Varsinaisilla tekstikappaleilla on edelleen luettava,
noin 65-80 merkin rivipituus. Sivun alaosassa käytetään samaa
tarjouspyyntölomaketta kuin etusivulla.

## SEO ja saavutettavuus

- Jokaisella sivulla vain yksi H1
- Looginen H2/H3-hierarkia
- Sivukohtaiset title- ja meta description -tiedot
- Canonical ja Open Graph -tiedot `BaseLayout`-komponentin kautta
- Merkitykselliset alt-tekstit kuville
- Linkit oikeina linkkeinä ja painikkeet oikeina button-elementteinä
- Näkyvät keyboard-focus-tilat
- Responsiivisuus tarkistetaan desktopilla ja mobiilissa
- `npm.cmd run build` suoritetaan aina ennen valmiiksi ilmoittamista

## Git- ja laitekohtainen työnkulku

Ennen työn aloittamista toisella koneella:

```powershell
git pull origin main
npm.cmd ci
```

Älä tee samanaikaisesti julkaisemattomia muutoksia kahdella koneella. Puske
ensin yhden koneen muutokset GitHubiin ja vedä ne toiselle koneelle.

Työkoneen projektijuureen on jätetty tarkoituksella Git-seurannan ulkopuolisia
raakakuvia ja videoita. Älä poista, siirrä tai commitoi niitä ilman erillistä
pyyntöä. Sivuston käyttämät julkaistavat kuvat ovat `public/images/`-kansiossa
ja kuuluvat Git-repositorioon.

## Työskentely Codexin kanssa

Uuden tehtävän alussa:

1. Lue tämä tiedosto.
2. Lue pyydettyyn muutokseen liittyvät komponentit ja CSS.
3. Tarkista `git status` ja viimeisimmät commitit.
4. Säilytä käyttäjän keskeneräiset ja Git-seurannan ulkopuoliset tiedostot.
5. Toteuta muutos, tarkista responsiivisuus ja aja build.
6. Commitoi ja puske vain kyseiseen tehtävään kuuluvat tiedostot.

Viimeisin merkittävä toteutustilanne tätä tiedostoa luotaessa: commit
`02b9327` (`Add contact form to service page`).
