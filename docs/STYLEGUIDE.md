# Trusset documentation style guide

This page is for anyone writing or editing a page in this repository. After reading it you will know how to open a page, how to address its reader, which words are fixed, and which sentences you may not touch.

Every rule below is either enforced by Vale in CI or marked as a judgment call. The rules that Vale cannot check are the ones that need a human, so they are stated in a way a reviewer can apply without re-reading this file.

---

## Know which of six readers you are writing for

The docs serve six readers who want different things from the same product. Naming yours before you write is the single decision that most changes the page.

| Reader | Wants | Fails when the page |
|---|---|---|
| Bank or lender of record | The Lombard analogy, risk parameters, proof the license and control stay with them | Reads as a crypto product |
| Register provider | That the register entry is the legally operative act, and that agent-role revocation stays theirs | Implies Trusset or the platform holds register authority |
| Custodian | The pairing procedure: token freeze equals depot block | Describes the freeze without the depot-side equivalent |
| Tokenization platform | Template config and API integration | Buries the config behind product narrative |
| Issuer | The shortest path to the answer: which holder wants a loan | Makes them read the lending model first |
| Integration engineer | A quickstart, real TypeScript, an error reference | Explains concepts before showing a call |

Compliance and legal readers read the same pages as engineers. A page that reads as casual to a compliance officer costs a deal. There is no separate compliance edition and there should not be one.

Five of these six readers have no page addressed to them today. That is tracked in `docs/OPEN-QUESTIONS.md`.

---

## Voice

### Write in present tense, active voice, imperative for steps

The API does not "will return" and did not "has returned". It returns.

> The oracle rejects a price that deviates from the current price by more than `maxDeviationBps`.

Steps are commands. "Broadcast in order", not "the steps should then be broadcast".

*Vale enforces:* passive-voice warning. Tense is a judgment call.

### Never write "we" for Trusset

Reference material says what Trusset does. "We" reads as a vendor talking about itself, which is exactly the register a compliance reader discounts.

Wrong, from `security/overview.mdx`:

> We provide a searchable database of regularly updated compliance documents.

Right:

> Trusset provides a searchable database of regularly updated compliance documents.

This applies to "our" and "us" equally. It does not apply inside quoted third-party text.

*Vale enforces:* error on `we`, `our`, `us`, `we're` outside code blocks.

### Use "you" only where the page names its reader

Second person is allowed on a page whose first line says who it is for. "This page is for the register provider." On that page, "you" is the register provider and stays the register provider to the last line. Switching mid-page is how a reader ends up applying a custodian instruction to a bank.

On shared pages and anywhere legal, there is no unspecified "you". Name the role: the lender of record, the register provider, the borrower, the market admin.

The existing docs already get this right in places and it is worth copying. From `external-securities-lending/get-setup-steps.mdx`, the actor is named rather than assumed:

> These are executed by the token's agent or identity registry operator, not by Trusset.

*Vale enforces:* nothing automatic. Second person is correct on most Tier 3 pages, so a blanket rule would be noise. This one needs a reviewer.

### Name the limitation in the same breath as the capability

This is the company's credibility mechanism. It is not a weakness and it is not hedging. A reader who finds the limitation themselves, after the page implied there was none, stops trusting the rest of the page.

The existing docs do this well. Keep the habit everywhere:

> Once collateral reaches the router it does not sell itself. There is no auto-sell for external securities, because these instruments have no on-platform venue.

> `stuck` counts intermediate states produced by the automated sell orchestrator, which external securities markets do not use. It is always `0` here and carries no signal.

Both name the gap in the same paragraph as the feature. Neither apologises for it.

Known limitations that must stay visible wherever they are relevant: issuer-attested price conflict of interest, thin Category B markets, stranded locks on revocation.

*Vale enforces:* nothing. Judgment call, and the most important one in this guide.

---

## Sentences

### Keep sentences short and paragraphs to two to four sentences

One idea per sentence. If a sentence has two clauses joined by "and" and each could stand alone, it is two sentences.

*Vale enforces:* warning above 30 words.

### Vary sentence length deliberately

Three medium sentences in a row is what generated text sounds like. A short sentence after two long ones is how a page stops sounding generated.

The custody page does this in three words:

> Trusset builds transactions. Your wallet signs them.

*Vale enforces:* nothing. Read the paragraph aloud.

### Use hyphens, never em dashes or en dashes

No em dash (U+2014), no en dash (U+2013), anywhere, including inside tables and code comments. Use a hyphen, a comma, or a full stop.

This guide names the two characters by codepoint rather than printing them, so that Vale runs clean against the guide itself.

*Vale enforces:* error on both characters.

### Do not open with these

Banned openers and connectives:

`In today's landscape`, `It is important to note`, `Moreover`, `Furthermore`, `Additionally`, `delve`, `leverage` as a verb, `seamless`, `robust`, `cutting-edge`, `revolutionize`, `empower`, `unlock the potential`, `at the end of the day`.

`Additionally` at the start of a sentence is almost always deletable with no loss. From `licenses/commodity-orderbook/best-practices.mdx`:

> Additionally, the commodity token's own pause mechanism provides a third layer.

The sentence works better as:

> The commodity token's own pause mechanism provides a third layer.

`leverage` is banned as a verb, not as a noun. Financial leverage is a real thing and the word is correct there.

*Vale enforces:* error on the full list, with `leverage` scoped to verb positions.

### Do not pad with rules of three

"Fast, secure, and compliant" carries one idea, not three. Three items are fine when each carries information the other two do not.

*Vale enforces:* nothing. Ask what the third item tells the reader that the first two did not.

### Do not restate the heading, and do not summarize at the end

A section called "Open a loan" does not open with "This section explains how to open a loan." It opens with the first thing the reader does.

Sections do not close with a paragraph repeating what they just said. The reader was there.

*Vale enforces:* nothing.

---

## Page structure

### Open with who the page is for and what they can do after reading

One line, first line, before any heading. The reader decides in that line whether to keep reading, so it has to carry the role and the outcome.

`sdk/introduction.mdx` gets close:

> The Trusset SDK is a typed client library for the Trusset REST API.

That says what the thing is. It does not say who should read it or what they will be able to do, so it is a description rather than an opening.

*Vale enforces:* nothing.

### Lead with what the reader gets, then how it works, then the constraints

Never open a section with background. The reader wants the outcome first and will read the mechanism to get it.

### Put the happy path first, then failures and edge cases

One exception, and it is absolute: **anywhere collateral or money can be lost, state the failure behaviour before the happy path.**

`external-securities-lending/handle-timeout.mdx` already does this correctly. The warning about stranded collateral is the first thing on the page, above the parameters:

> Write-off does not touch the liquidation router. Whatever collateral the router still holds stays there [...] Dispose of or return the collateral before calling this, otherwise it is stranded.

That ordering is not stylistic. A reader who meets that sentence after the happy path has already lost the collateral.

*Vale enforces:* nothing.

### Write task-shaped headings

"Open a loan", not "Loan opening". "Revoke the agent role", not "Revocation". A heading names what the reader does, so they can scan for their task instead of reading for it.

Reference sections that document a thing rather than an action keep noun headings: "Response envelope", "Error codes", "Units".

*Vale enforces:* nothing.

### Use tables for comparisons, prose for reasoning

Tables are for role-by-role and category-by-category comparison. Reasoning goes in prose, because a table cannot hold a "because".

Never build a table whose second column is the only one carrying content. That is a list.

*Vale enforces:* nothing.

---

## Code

### Write TypeScript, real and runnable

Every code sample is TypeScript, with four exceptions where another language is the correct answer:

| Exception | Why |
|---|---|
| Shell commands | Tag them `bash`. |
| JSON payloads | Tag them `json`. |
| Hardhat config and deployment scripts | Hardhat config is `hardhat.config.js` and its scripts conventionally use `require`. Rewriting them in TypeScript would ship a sample that does not match the tool. |
| CommonJS interop examples | The point of the sample is `require`. A TypeScript version would not demonstrate the thing. |

Samples must run. A sample that omits an await, or calls a method that does not exist, costs more than no sample. That is why the exceptions exist: a correct JavaScript sample beats a TypeScript sample that nobody can paste.

The 26 JavaScript blocks in this repository were all checked against this rule and all four fall under an exception. None need converting.

*Vale enforces:* warning on ` ```js ` and ` ```javascript ` fences, which a reviewer clears against the table above.

### Put explanation above the block, not inside it

No inline comments. The prose above the block explains what the block does; the block shows it.

Wrong, from `external-securities-lending/sync-oracle.mdx`:

```
if (!success && error.code === 'PRICE_DEVIATION_TOO_LARGE') {
  // surface the deviation to an operator rather than retrying
}
```

Right: move that sentence into the paragraph above the block, where it can be a full sentence and can explain why rather than what.

133 inline comments exist across `endpoints/` and `sdk/` today. They move into prose during the Tier 3 pass.

*Vale enforces:* warning on `//` at the start of a line inside a fence.

### Keep code next to the prose that describes it

A block that is three paragraphs below its explanation is a block the reader scrolls past.

---

## Fixed terminology

These are not preferences. Each one exists because the alternative creates a legal, commercial, or classification problem.

| Write | Not | Why |
|---|---|---|
| "any asset", "assets" | "tokenized assets" | Positioning text. The product covers stocks, commodities, real estate, and more. "Tokenized assets" narrows it to a crypto category. |
| "tokenized securities" | "assets" | Where the legal category is the point, keep it precise. This is the exception to the row above, not a contradiction of it. |
| "lending module" | "LendingMarket" | Outside code identifiers. `ILendingMarket` in a Solidity signature stays as it is. |
| "settlement token (stablecoin)" | "settlement token" alone | On first use per page, so the MiCA classification is unambiguous. Later uses on the same page drop the parenthetical. |
| "lender of record" | "the bank", "the lender" | English pages. |
| "register provider" | "Registerführer" | English pages. |
| "Registerführer" | "register provider" | German pages. Never mix the two on one page. |
| "works with any wallet, self-custody or regulated custodian, no preference" | anything implying self-custody is the default | Institutional readers custody with a licensed provider. A default reads as a recommendation. |

The wallet-neutrality rule is about ordering as much as wording. `protocol/infrastructure/custody.mdx` lists "Self-Custody" as the first of four custody cards, which reads as a ranking whatever the prose says. Reordering cards is a structural change and is allowed even on a locked page.

Keep German legal terms of art untranslated: **Sicherungsnehmer**, **Verfügungsbeschränkung**, **Weisung**, **Kryptowertpapier**. Translating a term of art loses the legal meaning it carries. Gloss it once in parentheses on first use if the page's reader may not know it.

*Vale enforces:* substitution rules for every row, and an existence check for the `(stablecoin)` gloss.

---

## German spelling: umlauts, not transliteration

**Write `ü`, `ö`, `ä`, and `ß` in prose. Use `ue`, `oe`, `ae`, and `ss` only in code identifiers, file paths, URL slugs, and API string values.**

So: `TÜV SÜD`, `Verfügungsbeschränkung`, `Gesetz über elektronische Wertpapiere`, `Registerführer`.

The reasoning, since this is the rule most likely to be revisited. These are proper nouns and statute names. TÜV SÜD writes its own name with umlauts, and a statute name is a citation. Misspelling either costs credibility with the reader who is checking. The repository is already UTF-8 throughout, with umlauts live in three files.

The repo is currently inconsistent in a way that proves the rule is needed. `security/overview.mdx` writes `TÜV`. `licenses/stocks/introduction.mdx` writes "Gesetz uber elektronische Wertpapiere", which drops the umlaut without transliterating it and is wrong under either convention.

This is the one rule in this guide that is cheap to reverse. Flipping it means changing this section, inverting one Vale rule, and running one search and replace. If the preference is transliteration, say so and it flips.

*Vale enforces:* error on bare `ue`/`oe`/`ae` inside the known German terms, and on `TUEV`.

---

## What you may not change

Three categories of sentence are locked byte for byte, in every file, at every tier. `docs/INVENTORY.md` lists all 78 of them.

**Statutory citations.** Any sentence containing a paragraph reference to BGB, eWpG, KWG, MiCA, or DORA. You may move it to a different section and give that section a new heading. You may not reword it, not even to fix its grammar.

**Negative capability claims.** "Trusset does not...", "the pool is never...", "no path exists by which...", "the router cannot...". These are the regulatory argument, not prose. Softening one weakens the argument; strengthening one makes a claim nobody has verified.

**Numeric protocol bounds.** Collateral factor below liquidation threshold, the 10 percentage point cap per threshold move, the 50 percent liquidation penalty cap, the 10 to 50 percent close factor, the 7 day write-off window, the 24 hour staleness default, the 50 percent deviation bound.

Two further prohibitions:

**Do not remove a hedge.** ISO 27001 is "in progress with TÜV SÜD, not completed". The legal opinion is "in preparation, available under NDA". An unhedged version of either is a false statement to a regulator's counterparty.

**Do not invent.** Not a fact, not a number, not a benchmark, not a customer name. A page with a gap keeps the gap and gets an entry in `docs/OPEN-QUESTIONS.md`.

### When a lock and a style rule conflict, the lock wins

This happens. `protocol/infrastructure/custody.mdx` line 88 reads:

> We only need your public address and the signatures you produce.

That uses "we" for Trusset, which this guide bans, and it sits inside a locked negative capability claim. It stays as written until someone with authority to restate the claim restates it. Log the conflict, do not resolve it by editing.

### Keep the three platform roles distinct

Issuer, Tokenisierungsplattform, and Registerführer are three roles held by three parties. Merging any two of them is the specific failure the previous version of these docs had. A sentence that says "the issuer or platform" where only one of them holds the authority is that failure in miniature.

---

## Positioning belongs on one page

`protocol/intro.mdx` is the landing page and is where positioning language lives. Every other page is reference material.

A reference page does not need to say the product is good. The reader already chose to read it.

---

## How this is enforced

`.vale.ini` at the repo root, run on every push by `.github/workflows/vale.yml`. The rules split three ways:

| Enforcement | Rules |
|---|---|
| Error, blocks CI | Em and en dashes, banned vocabulary, "we" for Trusset, terminology substitutions, transliteration in prose |
| Warning, does not block | Sentence length, passive voice, JavaScript fences, inline code comments |
| Human review only | Reader naming, "you" consistency, limitation-with-capability, happy-path ordering, table versus prose, rule-of-three padding |

The third column is the one that decays. A style guide with no linter decays in a week; a linter with no reviewer decays into a spell checker. Both are needed.

To check a single file before committing:

```bash
vale docs/STYLEGUIDE.md
```
