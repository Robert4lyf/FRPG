# French review — chapter1.js and chapter2.js

## Summary

The French in both files is in good shape. It is correct, natural, and pitched well for A2–B1. Past-participle agreement is handled carefully throughout ("on l'a trouvée", "je l'ai perdue", "tu me l'as offerte", "je ne l'ai pas crue", "on s'est disputées", "Hélène m'a appelée"). The REPORT and REPORT2 answers are all grammatically correct, and all the distractors are real verb forms. I made **6 minimal fixes**: one wrong use of a set phrase, one calque (used twice), one word-order problem, one calqued form of address, and one sentence that did not hold together. Neither file has spelling, accent or gender errors.

Two story points need a decision from the author: Claire's tu/vous switch (see below) and the judge's gender (*le juge* in ch1, *la juge Vasseur* in ch2).

`node --check` passes for both files.

## Changes made

| File | Original | Corrected | Why |
|---|---|---|---|
| chapter1.js (Delacroix, `first`) | Vous comprenez, je vous en prie ? | Vous comprenez, j'espère ? | *Je vous en prie* means "please / you're welcome". It cannot mean "I trust". *J'espère ?* matches the English ("You do understand, I trust?") and still sounds pompous. |
| chapter2.js (INTRO2) | le maire a gardé sa fête. | le maire a [[maintenu\|kept on]] sa fête. | Calque of "kept his festival". *Garder une fête* sounds like keeping it for himself. For an event, French uses *maintenir*. I added a gloss because the word is new. |
| chapter2.js (Dubois topic `fete`, `q`) | Pourquoi le maire a gardé la fête ? | Pourquoi le maire a maintenu la fête ? | Same calque. Changed to match INTRO2. |
| chapter2.js (OBJECTIVES2) | Montrez ce que vous avez trouvé chez Hélène à Dubois. | Montrez à Dubois ce que vous avez trouvé chez Hélène. | Word order. Leaving *à Dubois* at the end makes it read as "found at Hélène's, to Dubois" or "at Dubois". The short indirect object goes before the long relative clause. |
| chapter2.js (Lebrun, `first`) | Jeune Morel. | Le petit Morel. | "Jeune Morel" with no article is a calque of "Young Morel" and does not work in French. *Le petit Morel* is what Lebrun (and Dubois) say in ch1, and it fits the existing English "Young Morel". |
| chapter2.js (Garnier, `first`, narr) | À cause du froid, ou il a pleuré. | À cause du froid. Ou parce qu'il a pleuré. | The two halves did not match: a noun phrase joined by *ou* to a full clause, which reads as broken. Now both halves are causes, and the terse noir rhythm stays. The English still fits. |

## Suggestions (not applied)

Style, naturalness or level. Applying these would change meaning, vocabulary or the mechanic, so they are left to the author.

1. **REPORT2 distractors that a reader could defend.** "À 23 h, Théo **fermait** le café" ("was closing") and "À 23 h 35, Claire **partait**" ("was leaving") are both grammatical and make sense. A strong learner could reasonably pick them. The same goes, to a lesser extent, for "Les deux sœurs se **sont disputées** quand Lebrun est arrivé" ("had a row when he arrived"). The `en` line points to the right answer, but if EN is hidden these items are ambiguous. Options:
   - Make the contrast clearer: "À 23 h **pile**, Théo {} le café" or "À 23 h, Théo {} le café **et il a fait le ménage**".
   - Swap the imparfait distractor for a different wrong form, such as *fermerait* (not ideal, since it is a new tense) or the present *ferme* plus an obviously wrong tense such as *fermera*.
2. **ch1 NIGHT: "la pluie n'a pas arrêté".** This is fine in speech, but standard written French would say "la pluie **ne s'est pas arrêtée**" (or "n'a pas cessé"). It would also echo "Elle s'est arrêtée" from the watch clue. The gloss would become `[[arrêtée|stopped]]`.
3. **ch1/ch2: "le chauffeur" for the hit-and-run driver** (Dubois: "Et le chauffeur ?", Roux: "Le chauffeur ne s'est pas arrêté"). For a car, the usual word is *le conducteur* (or *le chauffard* for a reckless driver). Leave it if the overlap with Garnier's role ("le chauffeur") is deliberate foreshadowing. It works well as a clue. Otherwise change it to *conducteur*.
4. **ch1 memory `arret`: "Je n'ai pas regardé derrière moi."** This is understandable. The usual way to say "I didn't look back" is "Je ne me suis pas retourné." It also echoes Claire's "Elle ne se retournait jamais."
5. **ch1 prologue Garnier: "Bienvenue à la maison, mon garçon."** This is increasingly common, but it is a calque of "welcome home". For a folksy speaker, consider "Te revoilà chez toi, mon garçon." or "Bon retour au pays, mon garçon."
6. **ch1 Lebrun: "Je me couche tôt. Je travaille tôt."** "Je **commence** tôt" is more natural for "I start work early".
7. **ch2 Théo: "Moi, je n'ai pas [[envie|the heart]]."** This is acceptable in speech, but the gloss does not match the word: *envie* means "desire / feel like", not "heart". Either change the gloss to `envie|feel like it`, or change the line to "Moi, j'ai pas le [[cœur|heart]] à ça." The second option fits the English and is very Théo.
8. **ch2 narration tense.** Most ch2 narration is in the present ("Il m'appelle Julien", "Elle regarde la tombe"). A few lines in the same scenes switch to the past ("Ses mains tremblaient. Il avait peur.", "Il a dit ça sans rougir.", "Il souriait."). That suits a chapter about the imparfait, but within a single scene the switch is noticeable. Consider using the present ("Ses mains tremblent. Il a peur.") or putting the whole scene in the past.
9. **ch2 plus-que-parfait.** "Le bus était-il parti ?" (CONFLICTS) and OUTRO2 "J'étais arrivé… Hélène m'avait écrit… Je n'avais pas d'alibi" use the pluperfect, which goes slightly beyond the ch2 target (imparfait vs passé composé). It is natural and only appears in narration, so this is a level note, not an error. "Hélène m'a écrit. Je suis arrivé le soir du crime. Je n'avais pas d'alibi." would keep it within level.
10. **ch2 Dubois topic `fete`, `q`.** "Pourquoi le maire a maintenu la fête ?" uses colloquial word order with no inversion. Julien uses *vous* with Dubois, so "Pourquoi le maire a-t-il maintenu la fête ?" would be more consistent. The same applies, to a lesser degree, to ch1 Claire's "Pourquoi tu ne parlais plus à Hélène ?", which is fine because it is tu/casual.
11. **ch1 REPORT line 3: "Sa {} s'est arrêtée"** with the option *écharpe*. "Sa écharpe" is ungrammatical (it should be *son écharpe*), so learners can rule it out on grammar rather than content. This is harmless, but you could swap it for a feminine noun that starts with a consonant, such as *lettre* (already an option) or *chambre*.
12. **ch2 Claire: en "You follow me now?"** The French is fine. The English would read better as "So you're following me now?"

## tu/vous and voice consistency

- **Claire, ch1.** Claire uses "vous" in only one line ("Vous voulez mon alibi, monsieur l'inspecteur ?"), which the narration points out ("Elle a choisi « vous »"). Every other ch1 line from her uses tu, including the hostile ones: "Tu n'aurais pas dû revenir", "Ça ne te regarde pas", greet "Encore toi.", wrong "Je n'ai rien à te dire." So the "hostile = vous" switch lasts only one line.
- **Claire, ch2.** All of her ch2 lines already use tu before she confesses ("Tu me suis, maintenant ?", "Tu te souviens de lui ?", "Je te l'ai dit", "Et toi, tu es parti…", greet "Encore toi."). Yet after the confession the narration says "Elle me dit « tu » de nouveau." That line has nothing to contrast with.
  - **Fix option A:** make Claire use vous in her hostile ch1 lines and in her ch2 lines before the confession. For example: "Vous n'auriez pas dû revenir" (if that comes after the switch), greet "Encore vous.", "Je n'ai rien à vous dire.", "Ça ne vous regarde pas.", "Vous me suivez, maintenant ?", "Je vous l'ai dit.", "Et vous, vous êtes parti…". Keep the warmer first lines in ch1 as tu, so the switch is visible.
  - **Fix option B:** keep her tu everywhere and reword the ch2 narration, for example to "Elle me dit « tu ». Comme avant." (which refers back to her single vous in ch1).
  - I did not edit either option because both change the mechanic.
- **Judge's gender.** In ch1, Dubois says "**Le** juge veut un rapport" and "**Le** juge sera content / va avoir des questions". In ch2, it is "**la** juge Vasseur", and Dubois says "La juge veut savoir…", "Même la juge…". If Vasseur is the same judge, change ch1 to "La juge veut un rapport ce soir", "La juge sera contente", "La juge va avoir des questions". Note the agreement *contente*.
- **Everyone else is consistent.** Hélène, Théo, Garnier and Mme Roux use tu, and Julien uses tu back to them. Dubois, Delacroix, Mme Delacroix and Lebrun use vous, and Julien uses vous back to them. Dubois's "Julien + vous" in ch2 is consistent and called out in the narration.
- **Voices hold up.** Théo is casual (T'es, Ouais, J'sais pas, Je sais pas). Garnier uses folksy sayings ("Après la pluie, le beau temps", "Un chauffeur, ça respecte l'horaire") and says "mon garçon". Mme Roux is warm and mothering ("mon petit", "mange, mange !", "mon chéri"). Delacroix is pompous ("Quelle insolence", "C'est l'avenir"). Dubois is curt. The narration is terse throughout. One small point: Théo's ch2 lines are a touch more standard than his ch1 lines (for example, "Je n'entendais pas grand-chose"). You could casualise one line, for example "J'entendais pas grand-chose", if you want to keep his register.

## Follow-ups applied after the review
- Claire: tu/vous made consistent. In chapter 1 she switches to "vous" when Julien asks for her alibi and stays cold ("Encore vous", "Ça ne vous regarde pas", "Vous vous souvenez ? Vous me l'avez offerte"). In chapter 2 she keeps "vous" until her confession, then returns to "tu", which the narration now has something to contrast with.
- The judge is "la juge" everywhere (chapter 1 report intro and verdicts).
- Chapter 2 report: removed the double answers by adding context ("…le café, puis il a fait le ménage" → a fermé; "…depuis un quart d'heure quand…" → disputaient; "…et elle n'est pas revenue" → est partie).
- Théo: "Moi, j'ai pas le cœur à ça." (gloss cœur = heart).
- "Le chauffeur" for the hit-and-run driver kept on purpose (foreshadowing).
