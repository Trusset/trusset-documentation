# Open questions

Gaps, contradictions, and stale content found during the style pass and deliberately left in place. Nothing here was guessed at or written around. Each entry names the file, what is wrong or missing, and what a correct answer needs.

Ordered by how much damage the wrong answer does.

---

## 1. The ISO certification claim contradicts itself

**File:** `security/overview.mdx`, lines 8 and 31.

Line 31 states that Trusset renews "our ISO certification with TÜV" once a year. Line 8 states that documents "are currently being reviewed by TÜV as part of the final certification process".

Line 8 describes a certification in progress. Line 31 asserts one that already exists and recurs annually. Both cannot be true.

The task brief states the correct position is "in progress with TÜV SÜD, not completed", which contradicts line 31 directly.

**Why this is first:** this page is read by compliance officers at prospective bank customers. An overstated certification claim on a security page is the kind of thing that gets checked, and the checker is the counterparty deciding whether to sign.

**Needed:** the actual certification status. Is ISO 27001 certified, in progress, or scheduled? If in progress, line 31 needs to describe the intended annual cycle without asserting the certification exists today.

---

## 2. Two pages state different API key limits

**Files:** `endpoints/authentication.mdx` line 21, `protocol/infrastructure/instances.mdx` lines 76 and 83.

| Page | Claim |
|---|---|
| `endpoints/authentication.mdx` | "Each instance supports up to 10 active keys." |
| `protocol/infrastructure/instances.mdx` (table) | "API Keys per Instance: 3 maximum" |
| `protocol/infrastructure/instances.mdx` (prose) | "Each instance supports up to three API keys" |

One of these is wrong. An integrator who builds key rotation against a limit of 3 and hits 10, or plans for 10 and is capped at 3, has a production problem.

**Needed:** the real cap. Then one number, stated once, cross-linked from the other page.

---

## 3. `stock-lending/` and `external-securities-lending/` document overlapping surface at different quality levels

**Files:** all 51 pages under `endpoints/stock-lending/`, all 57 under `endpoints/external-securities-lending/`.

Both sections document overcollateralized lending against tokenized securities. `external-securities-lending/` is newer and materially better: it has a real section introduction, documents the unsigned-calldata write path, and names failure behaviour beside each capability. Only 16 of the 51 `stock-lending/` pages mention the `txHash` confirm pattern; 35 do not.

`endpoints/stock-lending/open-loan.mdx` documents a single returned call with no confirm step. Its `external-securities-lending` counterpart documents the two-shape `SIGN_TRANSACTIONS` response and the confirm call. If both are live, one of them is wrong about how writes work.

**Needed:** are these two products or one product documented twice? If `stock-lending/` is superseded, it should be deleted rather than restyled. If both are live, the 35 pages missing the confirm pattern need it, and that is a correctness fix, not a style fix.

**Blocked work:** a full style pass on 51 pages is not worth spending until this is answered. Those pages received the mechanical pass (heading unification, en dash removal) and nothing more.

---

## 4. Five of the six documented reader roles have no page

The brief names six readers. The docs today serve one of them well.

| Reader | Page addressed to them |
|---|---|
| Integration engineer | Yes: `sdk/`, `endpoints/` |
| Tokenization platform | Partial: `endpoints/` covers integration, no role page |
| Bank or lender of record | None |
| Register provider | None |
| Custodian | None. `protocol/infrastructure/custody.mdx` is about wallet compatibility, not the custodian's own procedure |
| Issuer | None |

Specifically missing, all named in the brief as things these readers need:

- The Lombard analogy and risk parameters framed for a lender of record. Zero occurrences of "Lombard" in the repo.
- A statement that the register entry is the legally operative act, and that agent-role revocation stays with the register provider.
- The custodian pairing procedure: token freeze equals depot block.
- The issuer's shortest path: which holder wants a loan.

**Needed:** a decision on whether these pages are in scope. Writing them is authoring, not a style pass, and every one of them makes legal claims that need review before publication.

---

## 5. Artifacts the brief treats as existing, which do not

Recorded so the next person does not go looking.

| Named | Status |
|---|---|
| Secured lending product and process documentation (Version 2) | Does not exist |
| `LEGAL.md` | Does not exist |
| Paragraph citations (`§ 1259 BGB`, `§ 17 Abs. 2 eWpG`, `§ 1 Abs. 1 KWG`) | Zero `§` characters in the repo. Zero `BGB`, zero `KWG`. `eWpG` appears 13 times, never with a paragraph number |
| German-language role pages | Every page is English. Zero occurrences of Registerführer, Emittent, Tokenisierungsplattform, Sicherungsnehmer, Verfügungsbeschränkung, Weisung, Kryptowertpapier |
| Client-side calldata checker specification | Does not exist |
| A sentence explaining `LendingMarket` as a historic code artifact | Does not exist. `ILendingMarket` appears only as a Solidity interface name in code, diagrams, and contract tables, which is already the code-identifier exception |

The brief also says the legal opinion is "in preparation, available under NDA". No page mentions a legal opinion at all, so there is no hedge to preserve and nothing to weaken. If a legal opinion is referenced anywhere customer-facing, it is not in this repository.

---

## 6. The relayer removal left two identifiers behind

The write path itself is correct everywhere. `endpoints/introduction.mdx` states the current model plainly, and commit `8ba8112` did that work. No page describes Trusset-side signing.

What remains is naming:

| Identifier | Where | Gloss |
|---|---|---|
| `RELAYER_NOT_CONFIGURED` | 6 files | "No verified wallet is registered on this instance" |
| `relayerAddress` | 4 `external-securities-lending/` files | "The instance's registered wallet address" |

Both glosses are correct. Both names are misleading, because there is no relayer.

**Needed:** these are API surface, not documentation. Renaming the error code and the response field is a breaking change for every integrator parsing them. That is a product decision. The docs should follow the API, not lead it.

Unrelated and not affected: `keeperRelayer` in `licenses/commodities/`, which is an on-chain configuration address with its own "receives no implicit on-chain privileges" disclaimer.

---

## 7. A locked sentence uses "we", which the style guide bans

**Files:** `protocol/infrastructure/custody.mdx` lines 6, 85, 88. `protocol/infrastructure/data-storage.mdx` line 6.

Four sentences use "we" or "our" for Trusset inside Tier 1 pages. Three sit inside or immediately beside locked negative capability claims:

- custody.mdx line 88: "We only need your public address and the signatures you produce." Inside the locked warning about private keys.
- custody.mdx line 85: "All providers work identically from Trusset's perspective - we only require valid addresses and transaction signatures."
- custody.mdx line 6: "Trusset is completely wallet-agnostic, meaning we integrate with any custody provider..."
- data-storage.mdx line 6: "We have zero access to your encrypted data - if you lose your key, data becomes permanently unrecoverable."

The style guide bans "we" for Trusset. The lock rule says do not reword a negative capability claim. The lock wins, so these stay as written.

**Needed:** authority to restate the claims in third person. The meaning does not change ("We have zero access" to "Trusset has zero access"), but the sentence is part of the regulatory argument and should be re-approved rather than edited in a style pass.

---

## 8. An empty section

**File:** `protocol/infrastructure/instances.mdx`, "Monitoring and webhooks".

The section is a heading, one sentence ending in a colon, and nothing after it. The colon promises a list that was never written.

**Needed:** the webhook content, or the section removed. Left in place so the gap stays visible.

---

## 9. A TODO shipped in source

**File:** `protocol/infrastructure/data-storage.mdx`, line 49.

```
{/* TODO: link to identity proofs page once learn tab paths are finalized */}
```

An MDX comment, so it does not render, but it marks a cross-link that was never made. The zero-knowledge proofs bullet should link somewhere. `sdk/customers/kyc-proofs.mdx` is the obvious candidate.

**Needed:** confirmation that `kyc-proofs` is the intended target, or the real destination.

---

## 10. En dashes were replaced inside two locked numeric bounds

**File:** `endpoints/stock-lending/update-config.mdx`.

Nine numeric ranges used en dashes, which the style guide bans. They are now hyphens. Two of the nine are locked bounds: the close factor `1000-5000` and the auction duration `600-86400`.

The substitution changed a glyph. No digit, word, or bound moved, and every range was verified identical afterwards. Recorded because it is the only change in this pass that touched a line carrying a locked numeric bound.

**Needed:** nothing, unless the reviewer disagrees that a dash glyph is punctuation rather than content.

---

## 11. A statute name is misspelled inside a locked sentence

**File:** `licenses/stocks/introduction.mdx`, line 56.

The sentence reads "**eWpG** (Gesetz uber elektronische Wertpapiere) is the German Electronic Securities Act."

"Gesetz uber" is wrong under either spelling convention. The umlaut convention wants "über". The transliteration convention wants "ueber". Dropping the umlaut without transliterating is neither.

The sentence cites eWpG, so it is locked byte for byte and cannot be corrected in a style pass. Vale has a scoped exception for this file, in `.vale.ini`, pointing here.

**Why it matters:** a misspelled statute name is the kind of detail a regulator's counsel notices, and the page's job is to establish that the contract design follows eWpG.

**Needed:** sign-off to correct the spelling to "Gesetz über elektronische Wertpapiere". The legal claim does not change. Only the statute's name is repaired.

---

## 12. Em dashes were removed from a Tier 1 service list

**File:** `security/overview.mdx`, lines 16 to 19.

Four em dashes separated a service name from its URL in the incident-management list. They are now hyphens.

Same reasoning as item 10: the change is punctuation, not content. No word, URL, or claim moved. Recorded because `security/overview.mdx` is a Tier 1 page and this is the only edit made to it in the whole pass.

**Needed:** nothing, unless the reviewer disagrees.

---

## Not open, for the record

Two things flagged early that turned out to be non-issues, recorded so they do not get re-raised.

**The 26 JavaScript code blocks.** The inventory first listed converting them to TypeScript as a major job. Reading them showed 25 are Hardhat config and deployment scripts, where `hardhat.config.js` and `require` are the tool's own convention, and 1 is a CommonJS example that exists to demonstrate `require`. All 26 are correct. The style guide carries an explicit exception.

**Trusset-side signing.** Step 4 of the brief expected pages still describing a Trusset-side relayer. There are none. Only the two identifiers in item 6 above.
