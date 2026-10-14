# LVI-Loisto project context

## Yrityssivun arvot ja omistajat 14.10.2026

Heron jälkeinen osio on nyt Arvomme-otsikko, yksi arvoteksti ja kaksi
vierekkäistä omistajan kuvapaikkaa, joiden kummankin alla on oma tekstikenttä.
Mobiilissa omistajat pinoutuvat. CMS-kentät ovat `valuesSection.owners`
(täsmälleen kaksi omistajaa): nimi, valinnainen kuva, alt-teksti ja kuvaus.
Kuvat ja kuvaukset ovat aluksi tyhjiä; tyhjä kuvapaikka näkyy neutraalina
pintana. Aiemmat `introductionSection`- ja `workingSection`-osiot on korvattu
tällä rakenteella. Niitä koskevat alemmat 13.10. muistiinpanot ovat historiallisia.

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
  ja heti alla ovat puhelinnumero ja sähköposti. Tarjouspyyntölomake on heron
  jälkeen, Toimistomme-kartta viimeisenä. Heron ingressin lomake-linkki
  vie lomakkeelle. Kartan vieressä on Google Maps- ja Apple Kartat -linkit.
- Jaettu `ContactForm.astro` sisältää nimen, sähköpostin, puhelimen,
  kohteen sijainnin ja viestin. Lähetyksen vastaanottaja valitaan lopuksi:
  Matias (omakotitalot ja rakennusliikkeet) tai Miro (omakotitalot,
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
  LVI-urakointi-sivu, Yrityksemme-sivu sekä Arvoasunnot, Omakotitalot,
  Taloyhtiöt ja Rakennusliikkeet.
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
src/content/cms/arvoasunnot.json
src/content/cms/omakotitalot.json
src/content/cms/taloyhtiot.json
src/content/cms/rakennusliikkeet.json
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
- SIHA/Fume-suunnan mukaisesti body, header, herot ja osioiden taustat
  täyttävät selainleveyden. Vanha 1792 px sivukehys poistettiin, jotta
  heron ympärille ei jää erivärisiä sivupalkkeja. Sisältögridin raja on
  edelleen 1440 px ja pitkät tekstikappaleet rajataan erikseen.
  Etusivun heron tavoitekorkeus rajataan 832 px:iin; sisältö saa kasvattaa
  korkeutta tarvittaessa pienissä näkymissä. Header ja sisältö pysyvät linjassa.
- Etusivulla referenssikuva on vasemmalla ja teksti oikealla; seuraavassa
  yhteydenotto-osiossa lomake on vasemmalla ja kuva oikealla. Kuva-/tekstirivit
  jakavat saman gridin ja kuvat käyttävät pääosin 4:3-rajausta. Kuvallisten
  osioiden väli on desktopilla 72 px ja mobiilissa 48 px. Vanha 64 px
  porrastus, päällekkäisyys ja erillinen parallax poistettiin.
  Lomake määrää yhteydenottokuvan korkeuden, ei päinvastoin.
- `ScrollReveal.astro` ja `src/scripts/scroll-reveal.ts` lisäävät kaikille
  sivuille yhteisen IntersectionObserver-sisääntulon: kuvat häivyttyvät ja
  nousevat kevyesti, teksti vain häivyttyy. Lomaketta ei animoida. Vain aluksi
  näkymän ulkopuolella olevat elementit animoidaan kerran. Näppäimistöfokus,
  reduced-motion ja selaimen historiapalautus näyttävät sisällön heti;
  ilman JavaScriptiä sisältö pysyy näkyvänä. Älä lisää rinnakkaisia kuvaefektejä.
- Hero-kuvien srcset sisältää tarvittaessa myös 3200 px version. Mobiilin
  sizes huomioi vaakakuvan korkean cover-rajauksen, jotta kuva ei sumentuisi
  liian pienen kuvatiedoston vuoksi. CMS-kuvapolut ja omat kuvat säilyvät.
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
- Uuden kuvarytmin tarkistukset: kaikki 6 sivua 320/390/768/1440/2560/4096 px
  selainleveyksillä ilman vaakasuuntaista ylivuotoa, mobiilin puhekuplat ja
  kuvagallerian seuraava kuva. Referenssi-/yhteydenottoväli mitattu 72 px;
  lomake ja viereinen kuva saman korkuiset. `npm run build` menee läpi.
  `node --test tests/scroll-reveal.test.mjs` suorittaa 5 sisääntulon,
  näppäimistöfokuksen ja reduced-motionin regressiotestiä.

## Kohderyhmäsivut ja sisältösivujen viimeistely 11.10.2026

- Palvelumme säilyy linkkinä yleissivulle `/tietoa-meista/`. Viereinen
  nuolipainike avaa alavalikon: Arvoasunnot, Omakotitalot, Taloyhtiöt,
  Rakennusliikkeet. Desktopilla myös linkin hover avaa alavalikon.
  Valikko toimii kosketuksella ja näppäimistöllä; Escape palauttaa fokuksen,
  ulkopuolinen klikkaus ja linkin valinta sulkevat valikon. Mobiilivalikko
  scrollaa tarvittaessa, jotta kaikki kohteet ovat käytettävissä.
- Uudet URL:t: `/arvoasunnot/`, `/omakotitalot/`, `/taloyhtiot/`,
  `/rakennusliikkeet/`. Reitit tulevat `src/pages/[audience].astro`:sta ja
  jakavat `AudiencePage.astro`-pohjan. Navigaatiotiedot ovat
  `src/data/audience-pages.ts`:ssä.
- Sivupohja on lyhyt: oma kuvallinen hero, palvelun esittely, palvelunostot,
  toimintatapa ja yhteydenotto. Lyhyet hakasulkeissa olevat tekstit ovat
  asiakkaan täytettäviä paikkamerkkejä, eivät lopullisia palvelulupauksia.
  Kuvat ovat projektin omia; uusia ulkopuolisia kuvia ei lisätty.
- Kaikki neljä sivua ovat Pages CMS:n tiedostosisältöjä. Jaetut kenttämallit
  ovat `.pages.yml`:ssä. `noindex: true` estää paikkamerkkisivujen indeksoinnin.
  Asiakas poistaa CMS:n "Estä hakukoneindeksointi" -valinnan vasta, kun
  sivun tekstit ja SEO-tiedot on viimeistelty.
- Etusivun neljän palveluosion Katso lisää -linkit sekä footer vievät uusiin
  sivuihin. Etusivun JSON:n palvelun `href` säilyy osion mukana myös CMS:ssä
  uudelleenjärjestettäessä; kenttä on CMS:ssä piilotettu. Älä sido näitä
  sivulinkkejä pelkkään listan järjestysnumeroon.
- `ContactAction.astro` käyttää yhteistä `ContactPopover.astro`:a. Uusien
  sivujen hero- ja loppu-CTA avaavat yhteystietokuplan. Desktopin loppukupla
  avautuu painikkeen oikeaan reunaan sidottuna, mobiilissa sisällön joukossa.
- LVI-urakoinnin introkuva on nyt otsikon ja koko tekstipalstan vieressä,
  prosessivaiheet desktopilla 2 x 2 ja mobiilissa allekkain. LVI-työt käyttää
  samoja rajattuja kuvakokoja ja yhtenäistä CTA-gridiä. Yhteystietosivulle
  lisättiin murupolku, henkilöotsikot ovat normaalikokoisia ja lomake/kartta
  noudattavat yhteistä kuvallisten osioiden rytmiä. Nykyiset sisällöt säilyivät.
- Tarkistukset: seitsemän muutettua/uuden pohjan sivua 320/390/768/1440/2560 px,
  muiden kolmen sivun valikko/leveys 320/768/1440/4096 px. Ei vaakaylivuotoa.
  Näppäimistö, mobiilialavalikko, uusien sivujen puhekuplat 320–1440 px ja
  vanhat palvelusivujen mobiilikuplat tarkistettu selaimessa.
- `npm.cmd run build` tuottaa 10 sivua. `node --test
  tests/scroll-reveal.test.mjs tests/audience-pages.test.mjs` suorittaa
  8 testiä: sisääntulot, CMS-kentät, omat kuvat, SEO ja uudet sivulinkit.

## Yrityssivu ja yhteyshenkilöt 13.10.2026

- `/yrityksemme/`: hero säilyi. Arvot-otsikon alla on nyt yksi CMS:n
  tekstikenttä (`valuesSection.text`), ei neljää numeroitua nostoa.
  Tämän jälkeen `introductionSection` näyttää kuvan vasemmalla ja
  yritysesittelyn oikealla; `workingSection` näyttää tekstin vasemmalla ja
  kuvan oikealla. Molemmat käyttävät etusivun `solution-feature`-gridiä,
  kuvakokoja ja yhteistä scroll reveal -sisääntuloa. Mobiilissa kuvat ja
  tekstit pinoutuvat. Molempien otsikot, kappaleet ja kuvat ovat CMS:ssä.
- Aiempi erillinen `imageSection` siirrettiin yritysesittelyn yhteyteen.
  Toinen kuva on projektin oma valmis kylpyhuone. Esittelyn ja arvojen
  tekstit jätettiin asiakkaan täytettäviksi, lopullisia arvoja ei keksitty.
- Yhteiset henkilöprofiilit ovat `src/content/cms/contact-people.json`:ssä.
  Pages CMS:n kohta on "Yhteyshenkilöt – kuvat ja vastuualueet". Kummallakin
  henkilöllä on vastuualue, valinnainen henkilökuva ja alt-teksti. Kuvaa ei
  ole vielä annettu, joten pyöreä 44 px paikka näyttää nimikirjaimet.
  Puhekuplassa kuva on 36 px. Valittu kuva rajautuu pyöreäksi automaattisesti.
- Käyttäjän antamat vastuualueet: Matias "Omakotitalot & Rakennusliikkeet",
  Miro "Omakotitalot & Taloyhtiöt & Muut". Nämä näkyvät nimien alla
  yritystiedoissa, yhteystiedoissa, footerissa, puhekuplissa ja lomakkeen
  vastaanottajavalinnassa. Puhelimet, sähköpostit ja palvelinpuolen
  vastaanottajat eivät muuttuneet.
- `PersonIdentity.astro`, `ContactPhones.astro` ja `src/data/contact-people.ts`
  jakavat profiilit eri näkymille. Puhekupliin ei pidä enää kirjoittaa
  erillisiä henkilöprofiileja. CMS-profiilin muutos päivittyy kaikkialle
  seuraavassa Cloudflare-buildissa.
- Heron suurempi yhteystietokupla avautuu desktopilla painikkeen viereen.
  Matalissa desktop-ikkunoissa se keskitetään ja sen sisältö scrollaa;
  sulkupainike pysyy näkyvänä. Mobiilissa kupla pysyy sivun normaalissa
  sisällössä painikkeen alla. Escape ja ulkopuolinen klikkaus säilyivät.
- Tarkistukset: yritys-, yhteystieto- ja palvelutietosivut 320/390/768/1440/2560 px,
  heropuhekuplat 320/390/768/1440 px sekä matalat 1024 x 600 ja 1024 x 450
  näkymät, puhekuplan sähköpostivalinta ja lomakkeen mobiilivastaanottajat.
  Build läpäisty. `node --test tests/scroll-reveal.test.mjs
  tests/audience-pages.test.mjs tests/company-contacts.test.mjs` suorittaa
  11 testiä, mukaan lukien uusi yrityssivun ja yhteisten profiilien kattavuus.
