# French review — chapter1.js and chapter2.js

## Summary

The French in both files is in good shape. It is correct, natural, and pitched well for A2–B1. Past-participle agreement is handled carefully throughout ("on l'a trouvée", "je l'ai perdue", "tu me l'as offerte", "je ne l'ai pas crue", "on s'est disputées", "Inès m'a appelée"). The REPORT and REPORT2 answers are all grammatically correct, and all the distractors are real verb forms. I made **6 minimal fixes**: one wrong use of a set phrase, one calque (used twice), one word-order problem, one calqued form of address, and one sentence that did not hold together. Neither file has spelling, accent or gender errors.

Two story points need a decision from the author: Maud's tu/vous switch (see below) and the judge's gender (*le juge* in ch1, *la juge Diallo* in ch2).

`node --check` passes for both files.

## Changes made

| File | Original | Corrected | Why |
|---|---|---|---|
| chapter1.js (Delorme, `first`) | Vous comprenez, je vous en prie ? | Vous comprenez, j'espère ? | *Je vous en prie* means "please / you're welcome". It cannot mean "I trust". *J'espère ?* matches the English ("You do understand, I trust?") and still sounds pompous. |
| chapter2.js (INTRO2) | le maire a gardé sa fête. | le maire a [[maintenu\|kept on]] sa fête. | Calque of "kept his festival". *Garder une fête* sounds like keeping it for himself. For an event, French uses *maintenir*. I added a gloss because the word is new. |
| chapter2.js (Rouvière topic `fete`, `q`) | Pourquoi le maire a gardé la fête ? | Pourquoi le maire a maintenu la fête ? | Same calque. Changed to match INTRO2. |
| chapter2.js (OBJECTIVES2) | Montrez ce que vous avez trouvé chez Inès à Rouvière. | Montrez à Rouvière ce que vous avez trouvé chez Inès. | Word order. Leaving *à Rouvière* at the end makes it read as "found at Inès's, to Rouvière" or "at Rouvière". The short indirect object goes before the long relative clause. |
| chapter2.js (Ferhat, `first`) | Jeune Morvan. | Le petit Morvan. | "Jeune Morvan" with no article is a calque of "Young Morvan" and does not work in French. *Le petit Morvan* is what Ferhat (and Rouvière) say in ch1, and it fits the existing English "Young Morvan". |
| chapter2.js (Lacombe, `first`, narr) | À cause du froid, ou il a pleuré. | À cause du froid. Ou parce qu'il a pleuré. | The two halves did not match: a noun phrase joined by *ou* to a full clause, which reads as broken. Now both halves are causes, and the terse noir rhythm stays. The English still fits. |

## Suggestions (not applied)

Style, naturalness or level. Applying these would change meaning, vocabulary or the mechanic, so they are left to the author.

1. **REPORT2 distractors that a reader could defend.** "À 23 h, Karim **fermait** le café" ("was closing") and "À 23 h 35, Maud **partait**" ("was leaving") are both grammatical and make sense. A strong learner could reasonably pick them. The same goes, to a lesser extent, for "Les deux sœurs se **sont disputées** quand Ferhat est arrivé" ("had a row when he arrived"). The `en` line points to the right answer, but if EN is hidden these items are ambiguous. Options:
   - Make the contrast clearer: "À 23 h **pile**, Karim {} le café" or "À 23 h, Karim {} le café **et il a fait le ménage**".
   - Swap the imparfait distractor for a different wrong form, such as *fermerait* (not ideal, since it is a new tense) or the present *ferme* plus an obviously wrong tense such as *fermera*.
2. **ch1 NIGHT: "la pluie n'a pas arrêté".** This is fine in speech, but standard written French would say "la pluie **ne s'est pas arrêtée**" (or "n'a pas cessé"). It would also echo "Elle s'est arrêtée" from the watch clue. The gloss would become `[[arrêtée|stopped]]`.
3. **ch1/ch2: "le chauffeur" for the hit-and-run driver** (Rouvière: "Et le chauffeur ?", Pellegrin: "Le chauffeur ne s'est pas arrêté"). For a car, the usual word is *le conducteur* (or *le chauffard* for a reckless driver). Leave it if the overlap with Lacombe's role ("le chauffeur") is deliberate foreshadowing. It works well as a clue. Otherwise change it to *conducteur*.
4. **ch1 memory `arret`: "Je n'ai pas regardé derrière moi."** This is understandable. The usual way to say "I didn't look back" is "Je ne me suis pas retourné." It also echoes Maud's "Elle ne se retournait jamais."
5. **ch1 prologue Lacombe: "Bienvenue à la maison, mon garçon."** This is increasingly common, but it is a calque of "welcome home". For a folksy speaker, consider "Te revoilà chez toi, mon garçon." or "Bon retour au pays, mon garçon."
6. **ch1 Ferhat: "Je me couche tôt. Je travaille tôt."** "Je **commence** tôt" is more natural for "I start work early".
7. **ch2 Karim: "Moi, je n'ai pas [[envie|the heart]]."** This is acceptable in speech, but the gloss does not match the word: *envie* means "desire / feel like", not "heart". Either change the gloss to `envie|feel like it`, or change the line to "Moi, j'ai pas le [[cœur|heart]] à ça." The second option fits the English and is very Karim.
8. **ch2 narration tense.** Most ch2 narration is in the present ("Il m'appelle Sacha", "Elle regarde la tombe"). A few lines in the same scenes switch to the past ("Ses mains tremblaient. Il avait peur.", "Il a dit ça sans rougir.", "Il souriait."). That suits a chapter about the imparfait, but within a single scene the switch is noticeable. Consider using the present ("Ses mains tremblent. Il a peur.") or putting the whole scene in the past.
9. **ch2 plus-que-parfait.** "Le bus était-il parti ?" (CONFLICTS) and OUTRO2 "J'étais arrivé… Inès m'avait écrit… Je n'avais pas d'alibi" use the pluperfect, which goes slightly beyond the ch2 target (imparfait vs passé composé). It is natural and only appears in narration, so this is a level note, not an error. "Inès m'a écrit. Je suis arrivé le soir du crime. Je n'avais pas d'alibi." would keep it within level.
10. **ch2 Rouvière topic `fete`, `q`.** "Pourquoi le maire a maintenu la fête ?" uses colloquial word order with no inversion. Sacha uses *vous* with Rouvière, so "Pourquoi le maire a-t-il maintenu la fête ?" would be more consistent. The same applies, to a lesser degree, to ch1 Maud's "Pourquoi tu ne parlais plus à Inès ?", which is fine because it is tu/casual.
11. **ch1 REPORT line 3: "Sa {} s'est arrêtée"** with the option *écharpe*. "Sa écharpe" is ungrammatical (it should be *son écharpe*), so learners can rule it out on grammar rather than content. This is harmless, but you could swap it for a feminine noun that starts with a consonant, such as *lettre* (already an option) or *chambre*.
12. **ch2 Maud: en "You follow me now?"** The French is fine. The English would read better as "So you're following me now?"

## tu/vous and voice consistency

- **Maud, ch1.** Maud uses "vous" in only one line ("Vous voulez mon alibi, monsieur l'inspecteur ?"), which the narration points out ("Elle a choisi « vous »"). Every other ch1 line from her uses tu, including the hostile ones: "Tu n'aurais pas dû revenir", "Ça ne te regarde pas", greet "Encore toi.", wrong "Je n'ai rien à te dire." So the "hostile = vous" switch lasts only one line.
- **Maud, ch2.** All of her ch2 lines already use tu before she confesses ("Tu me suis, maintenant ?", "Tu te souviens de lui ?", "Je te l'ai dit", "Et toi, tu es parti…", greet "Encore toi."). Yet after the confession the narration says "Elle me dit « tu » de nouveau." That line has nothing to contrast with.
  - **Fix option A:** make Maud use vous in her hostile ch1 lines and in her ch2 lines before the confession. For example: "Vous n'auriez pas dû revenir" (if that comes after the switch), greet "Encore vous.", "Je n'ai rien à vous dire.", "Ça ne vous regarde pas.", "Vous me suivez, maintenant ?", "Je vous l'ai dit.", "Et vous, vous êtes parti…". Keep the warmer first lines in ch1 as tu, so the switch is visible.
  - **Fix option B:** keep her tu everywhere and reword the ch2 narration, for example to "Elle me dit « tu ». Comme avant." (which refers back to her single vous in ch1).
  - I did not edit either option because both change the mechanic.
- **Judge's gender.** In ch1, Rouvière says "**Le** juge veut un rapport" and "**Le** juge sera content / va avoir des questions". In ch2, it is "**la** juge Diallo", and Rouvière says "La juge veut savoir…", "Même la juge…". If Diallo is the same judge, change ch1 to "La juge veut un rapport ce soir", "La juge sera contente", "La juge va avoir des questions". Note the agreement *contente*.
- **Everyone else is consistent.** Inès, Karim, Lacombe and Mme Pellegrin use tu, and Sacha uses tu back to them. Rouvière, Delorme, Mme Delorme and Ferhat use vous, and Sacha uses vous back to them. Rouvière's "Sacha + vous" in ch2 is consistent and called out in the narration.
- **Voices hold up.** Karim is casual (T'es, Ouais, J'sais pas, Je sais pas). Lacombe uses folksy sayings ("Après la pluie, le beau temps", "Un chauffeur, ça respecte l'horaire") and says "mon garçon". Mme Pellegrin is warm and mothering ("mon petit", "mange, mange !", "mon chéri"). Delorme is pompous ("Quelle insolence", "C'est l'avenir"). Rouvière is curt. The narration is terse throughout. One small point: Karim's ch2 lines are a touch more standard than his ch1 lines (for example, "Je n'entendais pas grand-chose"). You could casualise one line, for example "J'entendais pas grand-chose", if you want to keep his register.

## Follow-ups applied after the review
- Maud: tu/vous made consistent. In chapter 1 she switches to "vous" when Sacha asks for her alibi and stays cold ("Encore vous", "Ça ne vous regarde pas", "Vous vous souvenez ? Vous me l'avez offerte"). In chapter 2 she keeps "vous" until her confession, then returns to "tu", which the narration now has something to contrast with.
- The judge is "la juge" everywhere (chapter 1 report intro and verdicts).
- Chapter 2 report: removed the double answers by adding context ("…le café, puis il a fait le ménage" → a fermé; "…depuis un quart d'heure quand…" → disputaient; "…et elle n'est pas revenue" → est partie).
- Karim: "Moi, j'ai pas le cœur à ça." (gloss cœur = heart).
- "Le chauffeur" for the hit-and-run driver kept on purpose (foreshadowing).

## Chapter 3

### Summary

`chapter3.js` is in good shape. The chapter's grammar targets are mostly handled well. Pluperfect agreement is correct throughout ("Je l'avais posée", "Je l'avais mise… je l'avais oubliée", "Quelqu'un l'avait cachée", "Il l'avait vue"). The object pronouns are idiomatic ("La pluie l'en a empêché", "On y lançait des pièces", "Vous n'y croyez pas", "T'en as besoin"). *Dont* is used correctly ("Celui dont elle ne m'avait jamais parlé", "Un ami dont il ne dira pas le nom"). There are no spelling, accent or gender errors.

I made **10 minimal fixes**: two tu/vous breaks, one gap in the diary-order logic, one non-standard elision in the report (*que Inès*), one participle that did not agree with *ça*, one meaning error (*faire* vs *faire faire*), one set phrase missing its pronoun, one muddled line from Ferhat, one note that did not make sense, and one word-order point. I did not change any ids, flags or mechanics.

`node --check src/story/chapter3.js` passes.

**Elision before Inès.** The standard form is *qu'Inès* / *d'Inès*: the h is not aspirated. That is what chapters 1–3 already use everywhere ("d'Inès"). The report line "L'ordonnance {} Inès a trouvée" forced the non-standard *que Inès*. The blank cannot hold *qu'* because it has to take *qui* / *dont* too. So I changed the subject (see below).

### Changes made

| Where | Original | Corrected | Why |
|---|---|---|---|
| Pellegrin topic `page`, `q` | Inès vous a laissé quelque chose pour moi ? | Inès t'a laissé quelque chose pour moi ? | tu/vous break. Sacha says *tu* to Mme Pellegrin (ch1/ch2: "Tu connaissais bien Inès ?"). |
| Pellegrin topic `etiquettes`, `q` | C'est vous qui écrivez les étiquettes ? | C'est toi qui écris les étiquettes ? | Same break. This also mirrors "C'est toi qui écris l'ardoise ?" to Karim. |
| DIARY entry `d` | …Quelqu'un l'avait cachée. Sacha arrive ce soir. | …Quelqu'un l'avait cachée. Heureusement, j'avais écrit à Sacha. Il arrive ce soir. | Order logic. Entries b and c each point back to the previous entry with a pluperfect, but d only pointed back to 2011. Nothing tied d to c, so b→d→c looked possible. *J'avais écrit à Sacha* now points back to c ("Ce soir, j'ai écrit à Sacha"). EN updated. |
| REPORT3 line 2 | L'ordonnance {} Inès a trouvée disait… | L'ordonnance {} G. avait reçue disait… | The correct answer produced *que Inès*, which is non-standard and inconsistent with *d'Inès* everywhere else. A blank that also takes *qui*/*dont* cannot hold *qu'*. The new subject keeps *que* as the answer and keeps the preceding-object agreement (*reçue*). It also adds a pluperfect. EN: "that G. had been given". |
| CLUES3 `page_claire` note | Une page du journal, envoyée à Maud. Elle ne l'avait pas ouverte. | Une page du journal, dans une lettre envoyée à Maud. Elle ne l'avait pas ouverte. | You can't "open" a page. The *l'* (*ouverte*) needs a feminine noun you can open: *la lettre*, which matches Maud's own line "Une lettre. Je ne l'avais pas ouverte." EN updated. |
| Maud topic `photo` | J'ai trouvé ça chez elle. Elle l'avait gardée… | J'ai trouvé cette photo chez elle. Elle l'avait gardée… | *l'* refers back to *ça*, which takes masculine agreement (*gardé*). *Gardée* only works with a feminine antecedent. Naming the photo keeps the agreement the chapter is showing off. EN "this photo". |
| Rouvière `aveu` | En 2011, j'ai fait une analyse de sang. | En 2011, j'ai fait faire une analyse de sang. | *Faire une analyse de sang* = to have your own blood tested. A gendarme ordering a test is *faire faire* (as in "a fait réparer" in the report). This matches the EN ("I had a blood test done"). |
| Diallo verdict (max 2) | Ne me faites pas regretter. | Ne me le faites pas regretter. | Fixed expression. *Regretter* needs its object, so it is *ne me le faites pas regretter*. This is also a nice pronoun example for the chapter. |
| Ferhat `first` | Vous avez une tête de chien battu. Moi aussi, je sais. | Vous avez une tête de chien battu. Moi aussi, j'en ai une, je sais. | "Moi aussi, je sais" reads as "I know too", not "I look the same". *J'en ai une* says it clearly with *en* (en = une tête de chien battu). EN: "I've got the same look, I know." |
| Delorme `greet` | Vous encore. | Vous, encore. | Without the comma, "Vous encore" is not idiomatic. The usual form is *Encore vous*, which Rouvière and Mme Delorme already use. The comma version keeps a different, haughtier phrasing for Delorme. |

### Suggestions (not applied)

1. **Diary entry `c`: tense anchoring.** "Depuis que j'étais allée à Lyon, quelqu'un me suivait. Ce soir, j'ai écrit…" A diary is written in the present, so the natural form is "Depuis que je suis allée à Lyon, quelqu'un me suit." The pluperfect + imperfect only works when they hang off a past event. If you want to keep the pluperfect cue, put the past event first: "Ce soir, j'ai écrit à Sacha et j'ai appelé Maud. J'avais peur : depuis que j'étais allée à Lyon, quelqu'un me suivait." Entry b has the same issue to a lesser degree. "J'avais trouvé l'ordonnance… trois semaines plus tôt" is grammatical (it comes before "je suis allée"), but in a diary *Il y a trois semaines, j'ai trouvé…* is more usual. I kept both because the mechanic depends on them.
2. **DIARY `hint`.** It quotes two of the three cue phrases (« j'avais trouvé », « j'étais allée »), so it almost does the puzzle for the player. A gentler version: « Cherchez le plus-que-parfait (avoir/être à l'imparfait + participe). Chaque page parle de la page d'avant. »
3. **REPORT3 line 8 distractor *lui a*.** "Le papier de Ferhat ? Quelqu'un lui a écrit à sa place" is grammatical ("someone wrote to him"). Only the dislocated *Le papier* rules it out. *En a* is also arguably possible. A learner who knows the rule will pick *l'a*, but if you want an option that is clearly wrong, use *y a* or *leur a*. Using *leur* would also get *leur* into the chapter: it is listed in the header but used nowhere.
4. **REPORT3 line 3 distractor *découvrait*.** "Inès découvrait la vérité avant de mourir" is grammatical ("was discovering"). It is weak, but if EN is hidden a learner could defend it. Consider *découvrira*.
5. **REPORT3 line 7 "ce soir".** The photo is given the day after Ferhat's death, and the report is written that same evening, so it works. Check this if the timing changes.
6. **Stone location.** INTRO3 says "Par terre, dans ma chambre, il y avait encore la pierre". The clue says "sur le rebord de la fenêtre. Je l'avais posée là". The objective says "sous votre fenêtre". Choose one place.
7. **Lacombe evidence, narr: "Il connaît bien la nuit de Ferhat."** This is ambiguous: it could mean the night Ferhat died or what Ferhat saw. If the ambiguity is not intended, use "Il sait bien ce que Ferhat a vu cette nuit-là. Trop bien."
8. **Lacombe topic `parechoc`, `q`: "Que lui est-il arrivé ?"** This is correct, but it is formal for Sacha → Lacombe (tu). "Qu'est-ce qui lui est arrivé ?" is more natural spoken and keeps *lui*.
9. **Karim: "Je l'ai réparée avec du carton."** You *boucher* a window with cardboard, you don't *réparer* it: "Je l'ai bouchée avec du carton." The agreement stays the same.
10. **Etiquettes clue: "n'a jamais écrit une majuscule de sa vie".** This is fine as emphatic French, but GCSE learners are taught *ne… jamais de*. "…une seule majuscule…" makes the emphasis clearly intentional.
11. **Diallo `fin`, `q`: "Des preuves. Sur la mort de Tiago Ferreira"** is slightly calqued. "Des preuves. Pour la mort de Tiago Ferreira, en 2011." or "…concernant la mort…" is better.
12. **Maud: "Dix ans sans se parler" vs "quinze ans" elsewhere.** Check this is meant (the sisters' falling-out vs Sacha's absence).
13. **OUTRO3: "moteur allumé".** This is common, but "moteur en marche" is the standard written form for noir narration.

### tu/vous and voice

- **Fixed:** Sacha used *vous* to Mme Pellegrin twice. It is now *tu*.
- **Maud** uses *tu* with Sacha throughout, as intended ("Elle t'a retiré l'enquête ?", "Encore toi", "Regarde derrière").
- Karim, Pellegrin and Lacombe use *tu*. Rouvière, Delorme, Mme Delorme, Ferhat and Diallo use *vous*. Sacha matches all of them. Rouvière still uses "Sacha + vous". Ferhat keeps "Le petit Morvan."
- **Voices:** Karim is casual ("T'as vu", "Ouais", "Je sais pas", "T'en as besoin"). Lacombe uses a saying ("Une pierre qui roule n'amasse pas mousse") and says "mon garçon". Pellegrin says "mon petit / mon chéri". Diallo is cold and clipped ("Seul. Je sais.", "Pas des romans."). Rouvière is curt. Delorme is pompous ("Enfin quelqu'un de raisonnable"). The narration is terse.
- **Minor:** In Pellegrin's line, Inès says *tu* to Mme Pellegrin ("donne-la à Sacha"). That is plausible in a small town, but if Inès says *vous* to her elsewhere, make it "donnez-la".
