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
- Sisällönhallinta: Pages CMS, jonka konfiguraatio on repositorion juuressa
  tiedostossa `.pages.yml`
- Pages CMS muokkaa `src/content/cms/*.json`-tiedostoja ja tallentaa muutokset
  suoraan GitHubin `main`-haaraan
- Astro rakentaa JSON-sisällöstä staattisen sivuston. Tarjouspyyntölomakkeen
  lähetys toimii Cloudflare Pages Function -reitillä `/api/contact`.
- Fontti: paikalliset Clarity City Variable -fonttitiedostot `public/fonts/`-kansiossa
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
- `/lvi-tyot/` - LVI-töiden palvelusivu
- `/lvi-urakointi/` - LVI-urakoinnin parent-palvelusivu
- `/tietoa-meista/` - palveluista ja toimintatavasta kertova sivu
- `/yhteystiedot/` - yhteydenotto, kartta ja yritystiedot
- `/yrityksemme/` - lyhyt CMS-muokattava arvo- ja yrityssivu

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
- `PortfolioSection.astro` ja `ProcessSection.astro` - aiemmat komponentit,
  joita nykyinen etusivu ei käytä
- `SplitCta.astro` - kuvallinen kaksipalstainen CTA tarvittaessa

Käytä olemassa olevia komponentteja ennen uuden rinnakkaisen toteutuksen
luomista. Pidä muutokset rajattuina pyydettyyn sivuun tai ominaisuuteen.

## Visuaalinen suunta

- Premium, rauhallinen, arkkitehtoninen ja teknisesti uskottava
- Vaalea/off-white pohja, tumma teksti ja hillitty kultainen korosteväri
- Typografinen ja kuvallinen ilme, ei geneerisiä LVI-ikoneita
- Ei raskaita varjoja, sisäkkäisiä kortteja tai tarpeettomia animaatioita
- Paljon harkittua tilaa, mutta sisältösivuilla ei ylimitoitettua tyhjää tilaa
- Tarpeettomat osioiden jakoviivat on poistettu; listojen ja lomakekenttien
  toiminnalliset erottimet sekä rauhalliset hover-efektit säilyvät
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
- neljä palvelu- ja kohdetyyppiosiota (Arvoasunnot, Omakotitalot,
  Taloyhtiöt, Rakennusliikkeet) ja niihin vievät heron hyppylinkit
- vaalea tekstipohjainen referenssikohteiden osio, jossa kolme ryhmää,
  CMS-tekstit ja suuri kuva; ei kohdelinkkejä
- tarjouspyyntölomake
- FAQ

Etusivun aiemmat Tietoa meistä - ja Tarkkuutta suunnittelusta luovutukseen
-osiot on poistettu. Hero-CTA avaa yhteystietopuhekuplan.

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

## Tilanne 10.10.2026

- Header on kaikilla kuvan päällä olevilla heroilla läpinäkyvä jo ensi
  latauksella ja muuttuu vaaleaksi, kun hero ei enää ole headerin alla.
  Navigaatio on Palvelumme, Yrityksemme, Yhteystiedot.
- Kaikkien sivujen herojen jälkeinen vaalea osiopohja on `#f3eee6`.
  Koristeelliset osioiden väliviivat poistettiin 10.10.; toiminnalliset
  listan, valikon ja lomakkeen erotinviivat jäivät.
- `/lvi-tyot/`-sivun herossa on avattava sisällysluettelo. CMS:ssä on 20
  muokattavaa linkkipaikkaa. Paikat 7-20 luovat sivulle H2-osion ja
  kappaleet vasta, kun paikalle annetaan nimi (ja mahdollinen sisältö).
- `/yrityksemme/`-sivulla on CMS:stä vaihdettava kuvallinen hero, jonka
  teksti on linjassa etusivun heron kanssa. Hero ei näytä Arvomme-pikkuotsikkoa.
- `/yhteystiedot/`-sivun hero käyttää CMS-kuvaa. Herossa ovat yrityksen,
  Matiaksen ja Miron yhteystiedot; henkilöiden otsikkoina ovat koko nimet,
  ja heti alla ovat puhelinnumero ja sähköposti. Toimistomme-kartta on heron
  jälkeen, tarjouspyyntölomake viimeisenä. Heron ingressin lomake-linkki
  vie lomakkeelle. Kartan vieressä on Google Maps- ja Apple Kartat -linkit.
- Jaettu `ContactForm.astro` sisältää nimen, sähköpostin, puhelimen,
  kohteen sijainnin ja viestin. Lähetyksen vastaanottaja valitaan lopuksi:
  Matias (arvoasunnot ja rakennusliikkeet) tai Miro (omakotitalot,
  taloyhtiöt ja muut LVI-palvelut). Yhteystietopuhekuplassa ovat molemmat
  puhelinnumerot ja sähköpostit.
- Lomake lähettää tiedot Cloudflare Pages Functionin kautta Resend-palveluun.
  Cloudflare-projektin tuotanto- ja preview-ympäristöissä pitää olla salainen
  `RESEND_API_KEY`. Lähettäjä on oletuksena `verkkosivut@lviloisto.fi`, joten
  `lviloisto.fi` pitää olla vahvistettu Resendissä. Valittu vastaanottaja
  (Matias tai Miro) ratkaistaan palvelinpuolella. Liitteitä ei tueta.
- Sivuston CMS-sisältöä muutettiin samana päivänä useilla erillisillä
  commiteilla. Koodi ja `git log` ovat aina ensisijaisia tähän koosteeseen
  nähden.

## Git- ja laitekohtainen työnkulku

Ennen työn aloittamista toisella koneella:

```powershell
git status --short --branch
git pull --ff-only origin main
npm.cmd ci
```

Jos työkoneella on omia keskeneräisiä muutoksia, älä yliaja niitä pullin
tieltä. Selvitä tila ensin. `npm.cmd ci` tarvitaan, jos riippuvuuksia ei ole
vielä asennettu tai `package-lock.json` on muuttunut.

Älä tee samanaikaisesti julkaisemattomia muutoksia kahdella koneella. Puske
ensin yhden koneen muutokset GitHubiin ja vedä ne toiselle koneelle.

Työkoneen projektijuureen on jätetty tarkoituksella Git-seurannan ulkopuolisia
raakakuvia ja videoita. Älä poista, siirrä tai commitoi niitä ilman erillistä
pyyntöä. Sivuston käyttämät julkaistavat kuvat ovat `public/images/`-kansiossa
ja kuuluvat Git-repositorioon.

## Pages CMS

- CMS: `https://app.pagescms.org/laurihannelin-seo/lviloisto/main/file/home`
- Kirjaudu GitHub-tunnuksella, jolla on oikeus repositorioon, tai asiakkaalle
  lisätyllä collaborator-kutsulla.
- CMS toimii selaimessa samalla tavalla millä tahansa tietokoneella. Paikallista
  Node.js- tai Astro-asennusta ei tarvita pelkkään sisältöjen muokkaamiseen.
- CMS:n sivuvalikossa ovat tällä hetkellä Etusivu, Tietoa meistä -nosto,
  Yhteystiedot-sivu, Tietoa meistä -sivu, LVI-työt-sivu,
  LVI-urakointi-sivu ja Yrityksemme-sivu.
- CMS:n tallennus tekee Git-commitin suoraan `main`-haaraan. Cloudflare Pages
  julkaisee commitin automaattisesti.
- Jos sisältöä on muutettu CMS:ssä, aja paikallisessa projektissa aina
  `git pull origin main` ennen seuraavaa Codex-muutosta.
- Älä muokkaa samaa sisältökenttää CMS:ssä samalla hetkellä, kun Codex tekee
  siihen koodimuutosta.

CMS-sisällöt sijaitsevat täällä:

```text
src/content/cms/home.json
src/content/cms/about-overview.json
src/content/cms/yhteystiedot.json
src/content/cms/tietoa-meista.json
src/content/cms/lvi-tyot.json
src/content/cms/lvi-urakointi.json
src/content/cms/yrityksemme.json
```

## Työskentely Codexin kanssa

Uuden tehtävän alussa:

1. Lue tämä tiedosto.
2. Lue pyydettyyn muutokseen liittyvät komponentit ja CSS.
3. Tarkista `git status` ja viimeisimmät commitit.
4. Säilytä käyttäjän keskeneräiset ja Git-seurannan ulkopuoliset tiedostot.
5. Toteuta muutos, tarkista responsiivisuus ja aja build.
6. Commitoi ja puske vain kyseiseen tehtävään kuuluvat tiedostot.

Tämän projektin Codex-keskusteluhistoria ei välttämättä näy toisella koneella.
Uudessa keskustelussa toisella koneella riittää aloituspyyntö:

> Lue ensin `PROJECT_CONTEXT.md`, tarkista `git status` ja viimeisimmät commitit,
> ja jatka sen jälkeen tästä projektista.

Viimeisimmät merkittävät muutokset 10.10.2026:

- `e7ab0d0` - yhteystietosivun henkilöotsikot ja suorat yhteystiedot
- `e805ccf` - ylimääräiset koristeelliset osioviivat pois
- `085b4fa` - Miron lomakevalintaan muut LVI-palvelut
- `63d2bc0` - läpinäkyvä header heti ensilatauksesta
- `d04a3aa` - CMS-sisällysluettelon uusien kohtien sisältöosiot
- `f41268d` - Clarity City -fontti koko sivustolle

Tarkista aina `git log -5 --oneline`, koska tämä lista voi jäädä myöhemmistä
commiteista jälkeen.

## Ulkoasun viimeistely 11.10.2026

- Kaikki kuusi sivua käyttävät yhteistä viimeistelykerrosta
  `src/styles/refinements.css`, joka ladataan `global.css`:n jälkeen.
  Tee jatkossa yhteisen gridin, otsikkokokojen, headerin ja välien muutokset
  ensisijaisesti tähän tiedostoon, jotta vanhat komponenttityylit eivät
  kumoa muutosta. Maksimileveys on 1440 px; pitkät kappaleet rajataan erikseen.
- Mobiilissa on avattava Valikko/Sulje-navigaatio. Näppäimistöfokus, Escape,
  nykyisen sivun merkintä ja Siirry sisältöön -linkki on huomioitu.
- `CmsImage.astro` käsittelee `public/images/`-kuvat Astro-kuvaputken kautta:
  build luo WebP-versiot, srcsetin ja kuvan mitat. CMS:n alkuperäisiä
  kuvapolkuja ei tarvitse vaihtaa. Alkuperäisiä tai raakakuvia ei poisteta.
- Referenssit ja lomake käyttävät samaa gridiä. Lomakepaneeli määrää kuvan
  korkeuden. Etusivun parallax mittaa siirtämätöntä sijaintia ja rajoittaa
  limityksen siten, ettei teksti peity. Liike on pois mobiilissa/tabletissa
  ja reduced-motion-asetuksella.
- Yhteystietosivu: suorat yhteystiedot, lomake, toimiston kartta.
  Palvelusivujen vanha Vantaa-toimipistemaininta yhtenäistettiin muun sivuston
  Helsinki-osoitteen kanssa. LVI-työt-sivun CMS-testiteksti poistettiin;
  workshopiin tarkoitetut yrityksen arvopaikkamerkit säilytettiin.
- Tarkistukset: 6 sivua, 320/390/768/1024/1440/2560 px, sisäiset linkit,
  kuvapolut, ankkurit, tunnisteet, puhekuplat, mobiilivalikko, FAQ,
  kuvagalleria, lomakkeen vastaanottajat ja pakollisten kenttien validointi.
- Lomakkeen oikeaa sähköpostitoimitusta ei pidä väittää vahvistetuksi:
  Resend-domainin DNS-vahvistus on yhä erillinen julkaisun edellytys.
- Oikeat referenssitiedot ja workshopin arvotekstit täydennetään asiakkaan
  kanssa. Niitä ei keksitty ulkoasun korjauskierroksella.
