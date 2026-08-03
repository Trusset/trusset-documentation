# Pass 3 inventory

Step 1 only. Nothing changed. Four audits requested, plus what the brief assumed exists and does not.

Counted 2026-08-03 against commit `c78ecef`. 229 `.mdx` files.

---

## Before the audits: three of the four structural premises do not hold here

| Named in the brief | Status |
|---|---|
| A `/new/` tree overlapping `/protocol/` | **Does not exist.** No `new/` directory. |
| A `/products/` tree | **Does not exist.** |
| `/protocol/infrastructure/relayer.md` | **Does not exist.** `protocol/infrastructure/` holds exactly four pages: `core-infrastructure`, `custody`, `data-storage`, `instances`. |
| Typo "Requiremnets" | **Not present.** Zero occurrences anywhere. |

There is one tree, not two: `protocol/`, `licenses/`, `sdk/`, `endpoints/`, `security/`. Every one of the 229 files is reachable from `docs.json`, with no orphans and no dangling entries. So the two-tree table has nothing to compare and the "one tree" proposal is not a merge, it is a restructure of the tree that exists.

This is the third pass in a row where the brief has described a repository state that is not this one. Worth resolving before pass 4: it is possible there is a second repository, or a branch, that these briefs are written against.

The typo that **is** real is in the second file named:

- `security/changelog.mdx:3` - `description: 'Official changelogs of teh Trusset protocol.'`

---

## Audit 1: banned subject-verb pairs

Rule: Trusset never operates, runs, offers, provides credit, lends, extends, manages a market, holds, takes collateral, or is counterparty.

Every occurrence found, including the ones that are correct and must not be touched.

### Violations, ordered by exposure

| # | Location | Text | Problem |
|---|---|---|---|
| 1 | `docs.json:53` `og:description` | "...and access **collateralized lending on our blockchain platform**." | The worst one. This is the social-share card for every page on the site. Reads as Trusset offering lending directly. |
| 2 | `docs.json:38` `description` | "Build on **our blockchain platform** for asset tokenization, DeFi trading, and **collateralized lending**." | Site-wide meta description. Same attribution. |
| 3 | `docs.json` `article:tag` | "blockchain, tokenization, DeFi, smart contracts, asset management, collateral, **lending**, trading" | Lending tagged as a Trusset property. |
| 4 | `protocol/integration/overview.mdx:39` | "The API covers the full scope of **Trusset services**: ... **lending and collateral operations**..." | Lending named as a Trusset service. |
| 5 | `protocol/infrastructure/instances.mdx:28` | Card title **"Lending Services"**, under the heading "Adaptive services" | The heading frames the cards as Trusset's services. |
| 6 | `protocol/infrastructure/instances.mdx:29` | "Overcollateralized **lending markets** against tokenized collateral" | Body of card 5. Market operation attributed to Trusset. |
| 7 | `protocol/infrastructure/instances.mdx:25` | Card title **"Trading Services"**, "AMM pools and listing-based marketplaces" | Same frame. Venue operation attributed to Trusset. |
| 8 | `endpoints/external-securities-lending/introduction.mdx:9` | "...which operates on stock tokens **Trusset issued**." | Trusset as issuer. Different verb, same category error: the institution issues. |
| 9 | `endpoints/introduction.mdx:6` | "The Trusset API **provides programmatic access to** tokenization infrastructure, custody operations, trading, **lending**, and the MiCA Register." | Defensible as API surface, but "provides access to lending" is the sentence a compliance officer screenshots. |
| 10 | `protocol/intro.mdx:13` | "Discover what powers Trusset. Explore tokenization, **credit systems**, and compliance tools." | Landing page. Credit systems as a Trusset capability. |
| 11 | `protocol/intro.mdx:22` | "Start with tokenization basics or explore advanced **credit systems**." | Landing page, same. |
| 12 | `protocol/infrastructure/core-infrastructure.mdx:6` | "**Our** infrastructure combines... **We keep** your existing data in step with **on-chain markets**..." | First person plus market attribution. Also breaches the pass-2 first-person rule; currently carries a Vale exception because it sits beside a locked claim. |
| 13 | `protocol/infrastructure/data-storage.mdx:27` | "**Trusset manages** three distinct data categories..." | "Manages" with Trusset as subject. Not a market, so lower risk, but it is on the banned verb list. |

Thirteen. Numbers 1 to 3 are in `docs.json` and therefore render into the `<head>` of all 229 pages.

### Correct, and must not be "fixed"

These match the banned pattern textually but state the opposite. All are locked negative capability claims from pass 1.

| Location | Text |
|---|---|
| `endpoints/introduction.mdx:73` | "Trusset **holds no** private key and has no signer." |
| `protocol/infrastructure/custody.mdx:67` | "Trusset **holds no** private key, has no signer, and cannot move your assets." |
| `protocol/infrastructure/core-infrastructure.mdx:18` | "Trusset **holds no** key and cannot sign for you" |
| `endpoints/external-securities-lending/introduction.mdx:173` | "Trusset **holds no** role." |
| `endpoints/external-securities-lending/introduction.mdx` | "Trusset **is not involved**." |
| `endpoints/external-securities-lending/deploy-market.mdx:12` | "...who is typically **not Trusset** and not you." |
| `endpoints/external-securities-lending/get-setup-steps.mdx:65` | "...the original issuer or their transfer agent, **not Trusset**." |
| `security/overview.mdx:10` | "Trusset provides a searchable database of compliance documents." Not credit. Permitted. |
| `protocol/infrastructure/data-storage.mdx:6` | "Trusset provides infrastructure for encrypting your instance data." Not credit. Permitted. |

The MiCA register is the one place the brief explicitly permits "Trusset operates". No page currently says it, so nothing to fix and one claim available to use.

### The good news

The endpoint reference bodies are clean. Across 191 endpoint pages, the operator-facing language already says "you", "the market admin", "the liquidation operator", "the issuer or their transfer agent". The positioning problem is concentrated in `docs.json`, the two `protocol/` overview pages, and the landing page. That is roughly six files, not two hundred.

---

## Audit 2: stale relayer and Trusset-side signing

**No page describes Trusset-side signing or relaying.** The write path is documented correctly everywhere. `endpoints/introduction.mdx:71` states endpoints "return an unsigned payload built against the target contract. You sign it with your registered wallet and broadcast it yourself." Commit `8ba8112` did that work before pass 1.

What remains is two legacy identifiers in live API surface, unchanged since pass 1 because renaming them breaks integrator code:

| Identifier | Files | Gloss on every occurrence |
|---|---|---|
| `RELAYER_NOT_CONFIGURED` | 6 | "No verified wallet is registered on this instance" |
| `relayerAddress` | 4 | "The instance's registered wallet address" |

Both glosses are accurate. Both names are misleading because no relayer exists. This is a product decision, not a docs one.

Unrelated, do not confuse: `keeperRelayer` in `licenses/commodities/` is an on-chain configuration address for a customer's own automation, with its own "receives no implicit on-chain privileges" disclaimer.

**Nothing to log per-endpoint** for confirmation, because nothing asserts the old behaviour. The open per-endpoint question from pass 2 is a different one and still stands: ten `stock-lending` write endpoints do not document the `txHash` confirm call. See `docs/OPEN-QUESTIONS.md` item 3.

---

## Audit 3: "Coming Soon"

No standalone "Coming Soon" page exists. Five inline markers do:

| Location | Text |
|---|---|
| `licenses/introduction.mdx:29` | "**Coming soon** - Commodity Lending and Stock Lending license documentation is in progress." |
| `protocol/infrastructure/data-storage.mdx:43` | "**Coming Soon:** Integrated key management options including HSM, multi-signature key recovery, and encrypted key backup." |
| `protocol/infrastructure/data-storage.mdx:55` | Heading: "Public data endpoints (coming soon)" |
| `protocol/infrastructure/instances.mdx:75` | Table cell: "Usage-based pricing (coming soon)" |
| `protocol/infrastructure/instances.mdx:77` | Table cell: "Usage-based pricing (coming soon)" |

Two of these are roadmap promises on Tier 1 pages, which is a separate question from whether the wording is tidy.

---

## Audit 4: naming

### "Tokenization" in external-facing language

| Location | Text |
|---|---|
| `docs.json` `og:title` | "Trusset Protocol - Infrastructure for Asset **Tokenization**" |
| `docs.json` `description` | "...end-to-end infrastructure for **tokenizing** any asset..." |
| `docs.json` `og:description` | "...**tokenizing** any asset... manage **tokenized** assets..." |
| `docs.json` nav group | "**Stock Tokenization**" |
| `sdk/introduction.mdx:3` | "TypeScript SDK for integrating Trusset **tokenization** infrastructure" |
| `licenses/introduction.mdx:3` | "...smart contract suites for **tokenized** assets, trading, and lending." |

### "Stock" where the product is asset-agnostic

Navigation groups: "Stock Tokenization", "Stock Lending", "Stock Token License", "Stock Orderbook License".

Directory paths, which per the brief must **not** change: `endpoints/stock-tokenization/` (29 pages), `endpoints/stock-lending/` (51), `endpoints/stock-trading/` (29), `licenses/stocks/`, `licenses/stock-orderbook/`. API base paths `/lending-stocks/api/...` likewise stay.

That means 109 endpoint pages will have a title and heading saying "asset" while their URL says "stock". The brief's remedy is one explanatory line per section, modelled on how the lending documentation handles the `LendingMarket` identifier. Note that no such sentence exists in this repository to copy; it was logged as absent in pass 1.

---

## The three products, against what exists

| Product | Current coverage |
|---|---|
| **1. Earning** | No product page. The mechanics exist only as four endpoint pages per lending section: `add-liquidity`, `remove-liquidity`, `list-providers`, `get-provider-balance`. |
| **2. Lending** | No product page. 108 endpoint pages across two sections, plus one section introduction. |
| **3. Market operator** | **Nothing.** No page, no mention. The phrase "market operator" appears zero times in the repository. |

Top-level navigation today is Protocol, Licenses, SDK, API Reference, Security. None of the three products is a top-level concept.

One thing already correct on the earning side: the word **yield** appears zero times, and there are no second-person return promises anywhere. The existing wording is share-based and already close to what section 12 requires: "The depositor receives LP shares proportional to their contribution, and those shares accrue value as borrowers pay interest." Whatever section 12 says will still win, but the current text is not fighting it.

---

## What I need before Step 2

1. **The `/new/` and `/products/` question.** Is there another repository or branch these briefs are written against? Three passes have now named files that are not here.
2. **Section 12 of the lending documentation**, verbatim. It is the binding text for the earning page and I do not have it.
3. **Sections 1 and 13**, for the operating-versus-software sentence, so the landing page matches the regulatory text rather than paraphrasing it.
4. **The claim-based adoption flow**, for the market operator page. The brief says to ask before writing it, and I am asking.
5. **Confirmation on the two uncleared claims** so I can keep them out: the two licensed German crypto securities registrars, and any named partner. Both are listed as pending and neither will appear until you say otherwise.
