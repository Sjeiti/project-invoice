Project Invoice
===============

Dit facturatie programma bewaart alle data lokaal op je machine.
 
Je lokale bestanden worden niet gedeelt met andere browsers of computers.
Project Invoice offline toegankelijk nadat de applicatie één keer is geladen. Je kan het een mobiele web applicatie maken middels de toevoegen-aan-startscherm functionaliteit van je mobiele browser.

Project Invoice is een facturatie programma bedoelt voor freelancers en ZZP-ers.


## Beginnen

Ga naar [Project Invoice](https://projectinvoice.nl) en begin met facturen maken.
Of je kan een lokale installatie maken

### De applicatie

De basis is gemakkelijk: je hebt [klanten](https://projectinvoice.nl/clients), klanten hebben projecten, projecten hebben facturen (en optioneel een offerte).
Je kan [zelf bepalen](https://projectinvoice.nl/layout) hoe je factuur er uit ziet. Je kan het printen naar pdf formaat ~~of png~~.
Op de home- of [overzichts pagina](https://projectinvoice.nl/overview) kan je de uitstaande facturen inzien, of ze als betaald markeren.

Alles wat je bewaart gebeurt op je lokale machine of toestel. Om de data van bijvoorbeeld je telefoon naar je desktop te krijgen kun je [exporteren](https://projectinvoice.nl/settings) naar json, dit bestand kan je op een andere machine importeren.
Wanneer je browserdata verwijdert heb je kans dat *al je data verwijdert wordt*. Maak geregeld backups!

### Draaien op localhost

Om de applicatie op localhost te draaien heb je alleen NodeJS, npm en GIT nodig. Als je niet weet dat die dingen zijn kun je beter gewoon de [online versie](https://projectinvoice.nl) gebruiken, je data zal net zo veilig zijn.

`git clone https://github.com/Sjeiti/project-invoice.git`

`npm i`

`npm run start`
  

## faq

### Wacht ff, deze app is online in een browser. Hoe kan het dan dat mijn privé data niet online is?

Elke site heeft toegang tot iets dat LocalStorage heet, dat zit lokaal op je computer in je browser. Dit is waar je data wordt weggeschreven. Een website kan nooit de data van een andere website uitlezen. Ook zal je data nooit van je computer naar een server online verstuurd worden. De enige netwerk communicatie is die van de server naar jouw computer. All je privé data blijft op jouw computer.
Tenzij je natuurlijk gebruik maakt van een cloud service, maar deze staat standaard uit.

### Is dit wel veilig?

Je data lokaal op je eigen machine bewaren is altijd veiliger dan je dat versturen en ontvangen over het internet. En sinds LocalStorage origin-specifiek is kan een site alleen haar eigen LocalStorage lezen. Maar je zou het natuurlijk ook nog lokaal kunnen draaien als je dat liever hebt.

Deze applicatie is net zo veilig als je eigen computer.

### Moet ik niet inloggen met een naam en een wachtwoord?

Inloggen is handig voor server authenticatie. Maar sinds je data lokaal staat, en niet ergens op een server, heb je geen authenticatie nodig.

### Hoe kan ik mijn data op een andere machine krijgen?

Omdat de data lokaal is opgeslagen kan je er alleen bij vanaf je eigen computer. Maar je kan de data exporteren.
De data kan je vervolgens overbrengen naar een andere device of computer om het daar te inporteren.

### Ik wil al mijn privé data verwijderen.

Dat kan door via je devtools je LocalStorage schoon te vegen, maar de applicatie heeft er ook gewoon een knopje voor op de [settings pagina](https://projectinvoice.nl/settings).

### Is er een Android of IOS app die ik kan installeren?

Ja en nee. Nee dit is geen App- of Play Store applicatie. Want ja: je kan deze applicatie gewoon als desktop icoon toevoegen via je browser.
Op Android ga je naar de site, druk je op de drie verticale puntjes rechts boven en kies je 'Voeg toe aan beginscherm'.
Op IOS Safari open je de site, klikt op het uitgang icoontje beneden en klik je op de 'Voeg toe aan beginscherm' knop.

### Waarom?

Ik ben al mijn hele leven freelancer, dus ik verstuur al een tijdje facturen. Ik heb een boel facturatie applicaties gezien en geprobeerd maar ik was nooit echt tevreden. Dus heb ik het zelf maar gemaakt:

 - geen cloud data, alles wordt lokaal op je machine bewaard, er wordt niets naar een server verstuurd
 - mooi ontworpen en zelf aan te passen factuur opmaak
 - makkelijk in gebruik
 - open-source
 - gratis
 - je kan het online, offline of op een lokale server gebruiken
 
 Ik heb alle code een beetje opgeschoont omdat jullie het misschien leuk zouden vinden.

## Bijdragen

De bronbestanden van deze applicatie zijn open-source en staan op [Github](https://github.com/Sjeiti/project-invoice).

Als je een goed idee hebt, of een fout vindt kan deze  [hier parkeren](https://github.com/Sjeiti/project-invoice/issues).
Doorzoek de bestaande issues voor je een nieuwe aanmaakt.

Je mag ook zelf bugs fixen of features toevoegen als je daar zin in hebt. Lees deze [contribution guidelines](https://github.com/Sjeiti/project-invoice/blob/master/CONTRIBUTING.md).


## Licentie

This project heeft een MIT Licentie - zie [LICENSE](https://raw.githubusercontent.com/Sjeiti/project-invoice/master/LICENSE) voor details.