# Documentation inventory and tier classification

This file classifies every `.mdx` page in the repository into one of three edit tiers, and registers every sentence that is locked regardless of tier. Read it to find out what may be rewritten, what may only be restructured, and what may not be touched at all.

Counted on 2026-08-01 against commit `487f413`.

- 229 `.mdx` files, all reachable from `docs.json`.
- No orphan pages. No dangling navigation entries. Verified by diffing the 229 navigation references against the 229 files on disk.
- 5 top-level sections: `protocol/`, `licenses/`, `sdk/`, `endpoints/`, `security/`.

| Tier | Files | What may change |
|---|---|---|
| 1, locked | 16 | Headings, ordering, tables, cross-links. No sentence-level rewording. |
| 2, product and process | 13 | Full style pass. Facts unchanged. |
| 3, developer | 200 | Full style and structure pass, including reorganizing. |

Separately, 78 sentences across 50 files are locked at sentence level. Those locks apply inside Tier 2 and Tier 3 files too. See [Locked sentences](#locked-sentences-independent-of-tier).

---

## Read this before using the tier table

The task brief describes a repository that is not this one. Six of the artifacts the brief names as Tier 1 anchors do not exist here. This is not a judgment about whether they should exist. It is a statement about what is on disk, and it changes what Step 1 can honestly deliver.

| Named in the brief | Present in this repo |
|---|---|
| Secured lending product and process documentation (Version 2) | No. The closest page is `endpoints/external-securities-lending/introduction.mdx`, which is an API section overview, not a product and process document. |
| `LEGAL.md` | No. No file of that name, and no legal-opinion page anywhere. |
| Paragraph citations (`§ 1259 BGB`, `§ 17 Abs. 2 eWpG`, `§ 1 Abs. 1 KWG`, and similar) | No. The `§` character appears zero times across all 229 files. `BGB` and `KWG` appear zero times. `eWpG` appears 13 times, never with a paragraph number. |
| German-language pages, Registerfuehrer / Emittent / Tokenisierungsplattform role guides | No. Every page is in English. Zero occurrences of `Registerf`, `Emittent`, `Tokenisierung`, `Sicherungsnehmer`, `Verfuegungsbeschraenkung`, `Weisung`, `Kryptowertpapier`. |
| The Lombard analogy, risk parameters framed for a lender of record | No. Zero occurrences of "Lombard". The lending risk parameters exist, but only as API field documentation. |
| Client-side calldata checker specification | No. The unsigned-calldata write path is documented, but there is no checker specification page. |

Consequences for the rest of this task:

1. **Tier 1 cannot be defined by the brief's file list.** It is defined here by content signal instead. That rule is mechanical and re-runnable, which matters more than matching a file list that does not apply.

2. **Five of the six named readers have no page written for them.** The docs today serve the integration engineer, and partially serve the tokenization platform. There is no page addressed to a bank or lender of record, a register provider, a custodian, or an issuer. That gap is logged in `docs/OPEN-QUESTIONS.md`, not filled by invention.

3. **Several Step 2 and Step 3 rules have no target here yet.** The German-term rules, the transliteration rule, and the "lender of record / register provider / Registerfuehrer" rule have nothing to apply to. They go into `docs/STYLEGUIDE.md` anyway, because they bind the pages that do not exist yet, and the Vale configuration enforces them from the first day such a page is written.

---

## How a file gets its tier

A file is **Tier 1** when the page's purpose is the regulatory argument. Two signals, either one sufficient:

**Statutory framework cited as a legal claim.** "Under MiCA, the beneficial ownership transfer at settlement time must be compliant" is a legal claim. "MiCA Register API keys" is a product name. Only the first counts. This distinction matters: treating every occurrence of the string `MiCA` as a citation would have locked all 8 `mica-register/` pages, which are ordinary REST reference pages for a public ESMA data lookup and carry no legal argument at all.

**The page's subject is Trusset's own role, control, or custody posture.** Five pages exist to say what Trusset cannot do. Rewording them is rewording the argument.

Everything else is Tier 2 if it sits in `protocol/`, `licenses/`, or `security/`, and Tier 3 if it sits in `endpoints/` or `sdk/`.

### Why tier alone is not enough

A single "Nothing is submitted on your behalf" note on an API endpoint page is a locked sentence. It is not evidence that the whole page is a binding legal reference. Thirteen `endpoints/stock-tokenization/` write endpoints carry that sentence and nothing else regulatory. Promoting all thirteen to Tier 1 would freeze thirteen pages of ordinary parameter tables to protect one line of shared boilerplate. Leaving them fully open would let that line drift.

So there are two independent mechanisms:

- **The tier governs the file.** It decides how freely the page may be restructured and rewritten.
- **The sentence lock governs the sentence.** A sentence carrying a statutory citation, a negative capability claim, or a numeric protocol bound is locked byte for byte wherever it appears, at any tier.

The Vale configuration in Step 5 enforces the sentence locks mechanically, so this does not depend on anyone remembering.

---

## Tier 1, locked: 16 files

| File | Signal |
|---|---|
| `licenses/introduction.mdx` | MiCA/eWpG compliance basis |
| `licenses/commodities/introduction.mdx` | MiCA/eWpG compliance basis |
| `licenses/commodities/contracts.mdx` | MiCA/eWpG compliance basis |
| `licenses/commodity-orderbook/introduction.mdx` | MiCA regulatory framework |
| `licenses/stocks/introduction.mdx` | MiCA and eWpG, register control requirement |
| `licenses/stocks/contracts.mdx` | eWpG register control requirement |
| `licenses/stocks/best-practices.mdx` | eWpG named legal entity requirement |
| `licenses/stock-orderbook/introduction.mdx` | MiCA and eWpG regulatory framework |
| `licenses/stock-orderbook/best-practices.mdx` | Under MiCA, settlement-time compliance burden |
| `sdk/customers/identity.mdx` | MiCA/eWpG-compliant registry claim |
| `security/overview.mdx` | DORA, plus the certification hedges |
| `endpoints/introduction.mdx` | "Trusset holds no private key and has no signer" |
| `endpoints/external-securities-lending/introduction.mdx` | "Trusset holds no role", "Trusset is not involved", no auto-sell |
| `protocol/infrastructure/custody.mdx` | Custody posture, "cannot move your assets" |
| `protocol/infrastructure/data-storage.mdx` | Key control posture, "cannot decrypt your data" |
| `protocol/infrastructure/core-infrastructure.mdx` | Contract ownership posture, "Trusset cannot access or modify them" |

## Tier 2, product and process: 13 files

`protocol/intro.mdx`, `protocol/integration/overview.mdx`, `protocol/infrastructure/instances.mdx`, `security/changelog.mdx`, `security/trusset-audits.mdx`, and the 8 `licenses/*/` pages carrying no statutory claim: `commodities/integration`, `commodities/best-practices`, `commodity-orderbook/contracts`, `commodity-orderbook/integration`, `commodity-orderbook/best-practices`, `stocks/integration`, `stock-orderbook/contracts`, `stock-orderbook/integration`.

`protocol/intro.mdx` is the landing page of the docs and is the one page where positioning language belongs.

## Tier 3, developer: 200 files

All of `endpoints/` except its 2 Tier 1 pages, and all of `sdk/` except `sdk/customers/identity.mdx`. 32 of these carry locked sentences.

---

## Locked sentences, independent of tier

78 sentences across 50 files. Reword none of them. They may be moved between sections and given a different heading.

### Negative capability claims

These are the regulatory argument. Do not soften and do not strengthen.

| Sentence | Location |
|---|---|
| "Nothing is submitted on your behalf." | 14 files: `external-securities-lending/introduction`, and 13 `stock-tokenization/` write endpoints |
| "Trusset holds no private key and has no signer." | `endpoints/introduction.mdx` |
| "Nothing moves on-chain without a signature you produced." | `endpoints/introduction.mdx` |
| "Trusset holds no private key, has no signer, and cannot move your assets." | `protocol/infrastructure/custody.mdx` |
| "No Trusset endpoint accepts a private key, and legitimate integrations never request direct key access." | `protocol/infrastructure/custody.mdx` |
| "You deploy and own all smart contracts - Trusset cannot access or modify them" | `protocol/infrastructure/core-infrastructure.mdx` |
| "Your wallet signs every transaction - Trusset holds no key and cannot sign for you" | `protocol/infrastructure/core-infrastructure.mdx` |
| "Encryption keys never leave your control - Trusset cannot decrypt your data" | `protocol/infrastructure/data-storage.mdx` |
| "Trusset cannot recover lost keys or decrypt data without them." | `protocol/infrastructure/data-storage.mdx` |
| "Personal information never stores on-chain to maintain privacy and comply with regulations like GDPR" | `protocol/infrastructure/data-storage.mdx` |
| "Trusset cannot update global contracts (e.g. the Identity Register) as a single party." | `security/overview.mdx` |
| "Trusset holds no role." | `external-securities-lending/introduction.mdx` |
| "Trusset is not involved." | `external-securities-lending/introduction.mdx` |
| "There is no auto-sell for external securities, because these instruments have no on-platform venue." | `external-securities-lending/introduction.mdx` |
| "There is no auto-sell for external securities." | `external-securities-lending/liquidate.mdx` |
| "It is not automatically covered by the insurance fund, which only steps in on a timeout write-off." | `external-securities-lending/settle-liquidation.mdx` |
| ~~"The proofs themselves (`proofs/*.bin`) and the encrypted witness material (`secrets.enc`) are never uploaded."~~ Corrected: false for `proofs/*.bin`. See OPEN-QUESTIONS item 13. | `sdk/customers/kyc-proofs.mdx` |
| "The IdentityRegistry is never called directly by StockCustody." | `licenses/stock-orderbook/contracts.mdx` |
| "The IdentityRegistry is never called directly by CommodityCustody." | `licenses/commodity-orderbook/contracts.mdx` |
| "The address is configuration only and receives no implicit on-chain privileges" | `licenses/commodities/contracts.mdx` |

One conflict to resolve before the Tier 1 pass, logged in `docs/OPEN-QUESTIONS.md`: `protocol/infrastructure/custody.mdx` line 88 reads "We only need your public address and the signatures you produce." It sits inside a locked negative claim and uses "we" for Trusset, which the style guide bans. The lock wins until someone with authority to restate the claim says otherwise.

### Numeric protocol bounds

| Bound | Location |
|---|---|
| Close factor `1000 to 5000` basis points | `external-securities-lending/update-config.mdx`, `stock-lending/update-config.mdx` |
| Auction duration `600` to `86400` seconds | `external-securities-lending/update-config.mdx`, `stock-lending/update-config.mdx` |
| 7 day liquidation write-off window | `external-securities-lending/`: `introduction`, `handle-timeout`, `get-pending-liquidations`, `get-liquidation-stats`, `settle-expired-auction` |
| Oracle deviation bound, `5000` basis points, 50 percent | `external-securities-lending/sync-oracle.mdx`, `stock-lending/sync-oracle.mdx` |
| `maxPriceAge` staleness, `86400` seconds for daily NAV | `external-securities-lending/update-config.mdx`, `get-config`, `get-oracle-status` |
| Collateral factor below liquidation threshold | `external-securities-lending/get-config.mdx`, `stock-lending/get-config.mdx` |

One deliberate exclusion: `endpoints/authentication.mdx` states that a rotated API key "remains valid for 7 days". That is a key rotation overlap, not the liquidation write-off window. The page stays Tier 3. The number stays locked as a fact, like every number in the docs.

---

## Structural findings the style pass has to deal with

Structure and accuracy problems, not voice problems. Recorded here because the tier classification is the moment to notice them.

### `stock-lending/` and `external-securities-lending/` are two products, documented to different depths

51 files and 57 files. They are separate products with separate purposes, both live, and neither supersedes the other. `external-securities-lending` is the more important of the two and is verified working.

They are not documented to the same depth. Counting write endpoints only, `external-securities-lending` documents the `txHash` confirm call on 20 of 27, and `stock-lending` on 7 of 23. The omissions in the first section are coherent: hooks write backend configuration, and the price endpoints produce a signature without submitting anything, so there is nothing to confirm. `stock-lending` omits those same six and then ten more that do touch the chain.

Whether those ten accept a confirm call is a question about the API, not about the prose, so it is logged rather than answered. See `docs/OPEN-QUESTIONS.md` item 3 for the list.

The first pass reported this as "35 of 51 pages missing the confirm pattern". That number counted GET endpoints, which never need it, and counted a `txHash` appearing in a response example as documentation. The real figure is ten write endpoints.

### The relayer removal is mostly done, and the leftovers are naming, not behaviour

Step 4 of the brief flags pages that still describe a Trusset-side relayer or Trusset-side signing. I found none. `endpoints/introduction.mdx` states the current model plainly: "They return an unsigned payload built against the target contract. You sign it with your registered wallet and broadcast it yourself." Commit `8ba8112` did that work.

What remains is a legacy identifier, not a stale description:

- `RELAYER_NOT_CONFIGURED` is a live error code in 6 files, glossed everywhere as "No verified wallet is registered on this instance". The gloss is correct. The code name is not.
- `relayerAddress` is a live response field in 4 `external-securities-lending/` files, glossed as "the instance's registered wallet address".

Both are API surface. Renaming them is a breaking change to the API, not a docs edit. Logged in `docs/OPEN-QUESTIONS.md` rather than changed.

Separately, `licenses/commodities/` documents a `keeperRelayer` contract field. That is an unrelated on-chain address with an explicit "receives no implicit on-chain privileges" disclaimer, and has nothing to do with the removed issuer wallet relayer.

### Style debt is smaller than expected and concentrated

The prior docs are in better shape than the brief assumes. Measured across all 229 files:

| Check | Count | Where |
|---|---|---|
| Em dashes | 4 | `security/overview.mdx` only |
| En dashes | 9 | `endpoints/stock-lending/update-config.mdx` only |
| "We" or "our" for Trusset | 15 | 5 files in `protocol/` and `security/`. 7 of the 15 are in `security/overview.mdx` alone. |
| Banned vocabulary | 5 hits | "Additionally" x3, "seamlessly" x1, "industry-leading" x1 |
| Umlauts | 5 | `TÜV` x3, `Musterstraße` x2 |
| Inline comments in code blocks | 133 | Across `endpoints/` and `sdk/` |
| JavaScript code blocks | 26 | 25 are Hardhat config and deployment scripts in the two orderbook integration pages. 1 is a CommonJS interop example in `sdk/installation.mdx`. |

The single largest job is the 133 inline comments, which the style guide moves into surrounding prose.

The 26 JavaScript blocks were listed here as the second largest job before they were read. They are not a job. Hardhat config is `hardhat.config.js` and Hardhat scripts use `require`; the CommonJS example exists to demonstrate `require`. All 26 are correctly JavaScript, and the style guide carries an explicit exception for both cases rather than a rule that would break working samples.

One transliteration inconsistency is already live: `licenses/stocks/introduction.mdx` writes "Gesetz uber elektronische Wertpapiere", dropping the umlaut without transliterating. `security/overview.mdx` writes `TÜV` with the umlaut intact. Both cannot be right. The style guide picks one.

### An unhedged certification claim, since corrected

`security/overview.mdx` line 31 stated that Trusset renews "our ISO certification with TÜV" once a year, while line 8 described a certification still in process. Both could not be true, and the overstated version is the one a counterparty checks.

It was left untouched during the pass and logged, because correcting a compliance claim on a guess is the exact failure this task exists to prevent. The status was then confirmed as in process and near completion, and the page now says so without forecasting a completion date. See `docs/OPEN-QUESTIONS.md` item 1.

This is why the log exists. The finding was worth more than a rewrite would have been.

---

## Per-file classification

Every `.mdx` file, grouped by directory. "Locked sentences" counts sentence-level locks in that file, which apply at any tier.

### `endpoints/` - 3 files, tier 1/3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `authentication.mdx` | 3 | 1 |  |
| `introduction.mdx` | 1 | 1 | role and control posture |
| `rate-limits.mdx` | 3 |  |  |

### `endpoints/customers/` - 16 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `archive.mdx` | 3 |  |  |
| `batch-countries.mdx` | 3 |  |  |
| `batch-verify.mdx` | 3 |  |  |
| `can-transfer.mdx` | 3 |  |  |
| `create-id-link.mdx` | 3 |  |  |
| `create.mdx` | 3 |  |  |
| `get.mdx` | 3 |  |  |
| `identity-status.mdx` | 3 |  |  |
| `link-wallet.mdx` | 3 |  |  |
| `list-id-links.mdx` | 3 |  |  |
| `list.mdx` | 3 |  |  |
| `resend-id-link.mdx` | 3 |  |  |
| `revoke-id-link.mdx` | 3 |  |  |
| `revoke-identity.mdx` | 3 |  |  |
| `update.mdx` | 3 |  |  |
| `verify-identity.mdx` | 3 |  |  |

### `endpoints/external-securities-lending/` - 57 files, tier 1/3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `add-collateral.mdx` | 3 |  |  |
| `add-liquidity.mdx` | 3 |  |  |
| `bid-on-auction.mdx` | 3 |  |  |
| `borrow-more.mdx` | 3 |  |  |
| `claim-escrowed-collateral.mdx` | 3 |  |  |
| `close-loan.mdx` | 3 |  |  |
| `create-hook.mdx` | 3 | 1 |  |
| `delete-hook.mdx` | 3 |  |  |
| `deploy-market.mdx` | 3 |  |  |
| `execute-hook.mdx` | 3 |  |  |
| `get-auction.mdx` | 3 |  |  |
| `get-config.mdx` | 3 | 1 |  |
| `get-configuration-status.mdx` | 3 |  |  |
| `get-hook-executions.mdx` | 3 |  |  |
| `get-hook.mdx` | 3 |  |  |
| `get-liquidatable-loans.mdx` | 3 |  |  |
| `get-liquidation-config.mdx` | 3 |  |  |
| `get-liquidation-stats.mdx` | 3 | 2 |  |
| `get-loan-auction.mdx` | 3 |  |  |
| `get-loan.mdx` | 3 |  |  |
| `get-market.mdx` | 3 |  |  |
| `get-max-borrow.mdx` | 3 |  |  |
| `get-metrics.mdx` | 3 |  |  |
| `get-oracle-status.mdx` | 3 | 1 |  |
| `get-pending-liquidations.mdx` | 3 | 2 |  |
| `get-position.mdx` | 3 |  |  |
| `get-provider-balance.mdx` | 3 |  |  |
| `get-router-stats.mdx` | 3 |  |  |
| `get-setup-steps.mdx` | 3 |  |  |
| `get-supply-caps.mdx` | 3 |  |  |
| `get-user-collateral.mdx` | 3 |  |  |
| `get-user-loans.mdx` | 3 |  |  |
| `handle-timeout.mdx` | 3 | 3 |  |
| `introduction.mdx` | 1 | 6 | role and control posture |
| `liquidate.mdx` | 3 | 1 |  |
| `list-auctions.mdx` | 3 |  |  |
| `list-borrow-assets.mdx` | 3 |  |  |
| `list-hooks.mdx` | 3 |  |  |
| `list-markets.mdx` | 3 |  |  |
| `list-positions.mdx` | 3 |  |  |
| `list-providers.mdx` | 3 |  |  |
| `list-transactions.mdx` | 3 |  |  |
| `open-loan.mdx` | 3 |  |  |
| `remove-liquidity.mdx` | 3 |  |  |
| `repay.mdx` | 3 |  |  |
| `report-partial-sale.mdx` | 3 |  |  |
| `set-liquidator-role.mdx` | 3 |  |  |
| `settle-expired-auction.mdx` | 3 | 1 |  |
| `settle-liquidation.mdx` | 3 | 1 |  |
| `sign-price.mdx` | 3 |  |  |
| `sync-oracle.mdx` | 3 | 3 |  |
| `toggle-hook.mdx` | 3 |  |  |
| `update-config.mdx` | 3 | 3 |  |
| `update-hook.mdx` | 3 |  |  |
| `verify-price.mdx` | 3 |  |  |
| `withdraw-collateral-for-sale.mdx` | 3 |  |  |
| `withdraw-collateral.mdx` | 3 |  |  |

### `endpoints/mica-register/` - 8 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `countries.mdx` | 3 |  |  |
| `get-issuer.mdx` | 3 |  |  |
| `health.mdx` | 3 |  |  |
| `introduction.mdx` | 3 |  |  |
| `license-types.mdx` | 3 |  |  |
| `list-issuers.mdx` | 3 |  |  |
| `search.mdx` | 3 |  |  |
| `statistics.mdx` | 3 |  |  |

### `endpoints/stock-lending/` - 51 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `add-collateral.mdx` | 3 |  |  |
| `add-liquidity.mdx` | 3 |  |  |
| `bid-on-auction.mdx` | 3 |  |  |
| `borrow-more.mdx` | 3 |  |  |
| `claim-escrowed-collateral.mdx` | 3 |  |  |
| `close-loan.mdx` | 3 |  |  |
| `confirm-deploy.mdx` | 3 |  |  |
| `create-hook.mdx` | 3 |  |  |
| `delete-hook.mdx` | 3 |  |  |
| `deploy-market.mdx` | 3 |  |  |
| `execute-hook.mdx` | 3 |  |  |
| `get-auction.mdx` | 3 |  |  |
| `get-config.mdx` | 3 | 2 |  |
| `get-configuration-status.mdx` | 3 |  |  |
| `get-hook-executions.mdx` | 3 |  |  |
| `get-hook.mdx` | 3 |  |  |
| `get-liquidatable-loans.mdx` | 3 |  |  |
| `get-liquidation-config.mdx` | 3 |  |  |
| `get-liquidation-stats.mdx` | 3 |  |  |
| `get-loan-auction.mdx` | 3 |  |  |
| `get-loan.mdx` | 3 |  |  |
| `get-market.mdx` | 3 |  |  |
| `get-max-borrow.mdx` | 3 |  |  |
| `get-metrics.mdx` | 3 |  |  |
| `get-oracle-status.mdx` | 3 | 1 |  |
| `get-pending-liquidations.mdx` | 3 |  |  |
| `get-position.mdx` | 3 |  |  |
| `get-price-history.mdx` | 3 |  |  |
| `get-provider-balance.mdx` | 3 |  |  |
| `get-router-stats.mdx` | 3 |  |  |
| `get-supply-caps.mdx` | 3 |  |  |
| `get-user-collateral.mdx` | 3 |  |  |
| `get-user-loans.mdx` | 3 |  |  |
| `liquidate.mdx` | 3 |  |  |
| `list-auctions.mdx` | 3 |  |  |
| `list-hooks.mdx` | 3 |  |  |
| `list-markets.mdx` | 3 |  |  |
| `list-positions.mdx` | 3 |  |  |
| `list-providers.mdx` | 3 |  |  |
| `list-transactions.mdx` | 3 |  |  |
| `open-loan.mdx` | 3 |  |  |
| `remove-liquidity.mdx` | 3 |  |  |
| `repay.mdx` | 3 |  |  |
| `settle-expired-auction.mdx` | 3 |  |  |
| `settle-liquidation.mdx` | 3 |  |  |
| `sign-price.mdx` | 3 |  |  |
| `sync-oracle.mdx` | 3 | 1 |  |
| `toggle-hook.mdx` | 3 |  |  |
| `update-config.mdx` | 3 | 3 |  |
| `update-hook.mdx` | 3 |  |  |
| `withdraw-collateral.mdx` | 3 |  |  |

### `endpoints/stock-tokenization/` - 29 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `add-controller.mdx` | 3 | 1 |  |
| `add-sub-issuer.mdx` | 3 | 1 |  |
| `batch-issue.mdx` | 3 | 1 |  |
| `can-transfer.mdx` | 3 |  |  |
| `check-role.mdx` | 3 |  |  |
| `deploy.mdx` | 3 | 1 |  |
| `force-transfer.mdx` | 3 | 1 |  |
| `freeze.mdx` | 3 | 1 |  |
| `get-balance.mdx` | 3 |  |  |
| `get-holder-tokens.mdx` | 3 |  |  |
| `get-token.mdx` | 3 |  |  |
| `issue.mdx` | 3 | 1 |  |
| `list-holders.mdx` | 3 |  |  |
| `list-tokens.mdx` | 3 |  |  |
| `list-transactions.mdx` | 3 |  |  |
| `list-webhook-events.mdx` | 3 |  |  |
| `list-webhook-partners.mdx` | 3 |  |  |
| `log-deploy.mdx` | 3 |  |  |
| `pause.mdx` | 3 | 1 |  |
| `redeem.mdx` | 3 | 1 |  |
| `register-webhook.mdx` | 3 |  |  |
| `remove-controller.mdx` | 3 | 1 |  |
| `remove-sub-issuer.mdx` | 3 | 1 |  |
| `stock-split.mdx` | 3 | 1 |  |
| `test-webhook.mdx` | 3 |  |  |
| `unfreeze.mdx` | 3 | 1 |  |
| `unpause.mdx` | 3 | 1 |  |
| `update-token.mdx` | 3 |  |  |
| `update-webhook-partner.mdx` | 3 |  |  |

### `endpoints/stock-trading/` - 29 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `accept-rfq-quote.mdx` | 3 |  |  |
| `cancel-order.mdx` | 3 |  |  |
| `cancel-rfq.mdx` | 3 |  |  |
| `create-order-book.mdx` | 3 |  |  |
| `create-rfq.mdx` | 3 |  |  |
| `get-auction.mdx` | 3 |  |  |
| `get-current-auction.mdx` | 3 |  |  |
| `get-custody-balance.mdx` | 3 |  |  |
| `get-order-book-snapshot.mdx` | 3 |  |  |
| `get-order-book-trades.mdx` | 3 |  |  |
| `get-order-book.mdx` | 3 |  |  |
| `get-order.mdx` | 3 |  |  |
| `get-price-reference-history.mdx` | 3 |  |  |
| `get-price-reference.mdx` | 3 |  |  |
| `get-rfq.mdx` | 3 |  |  |
| `get-settlement.mdx` | 3 |  |  |
| `get-shared-peers.mdx` | 3 |  |  |
| `get-trade-readiness.mdx` | 3 |  |  |
| `get-user-orders.mdx` | 3 |  |  |
| `get-user-trades.mdx` | 3 |  |  |
| `import-order-book.mdx` | 3 |  |  |
| `list-importable.mdx` | 3 |  |  |
| `list-order-books.mdx` | 3 |  |  |
| `list-rfq-quotes.mdx` | 3 |  |  |
| `remove-import.mdx` | 3 |  |  |
| `set-price-reference.mdx` | 3 |  |  |
| `submit-order.mdx` | 3 |  |  |
| `submit-priority-order.mdx` | 3 |  |  |
| `update-order-book.mdx` | 3 |  |  |

### `licenses/` - 1 file, tier 1

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `introduction.mdx` | 1 | 1 | statutory citation |

### `licenses/commodities/` - 4 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `best-practices.mdx` | 2 |  |  |
| `contracts.mdx` | 1 | 2 | statutory citation |
| `integration.mdx` | 2 |  |  |
| `introduction.mdx` | 1 | 2 | statutory citation |

### `licenses/commodity-orderbook/` - 4 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `best-practices.mdx` | 2 |  |  |
| `contracts.mdx` | 2 | 1 |  |
| `integration.mdx` | 2 |  |  |
| `introduction.mdx` | 1 | 2 | statutory citation |

### `licenses/stock-orderbook/` - 4 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `best-practices.mdx` | 1 | 1 | statutory citation |
| `contracts.mdx` | 2 | 1 |  |
| `integration.mdx` | 2 |  |  |
| `introduction.mdx` | 1 | 2 | statutory citation |

### `licenses/stocks/` - 4 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `best-practices.mdx` | 1 | 1 | statutory citation |
| `contracts.mdx` | 1 | 3 | statutory citation |
| `integration.mdx` | 2 |  |  |
| `introduction.mdx` | 1 | 4 | statutory citation |

### `protocol/` - 1 file, tier 2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `intro.mdx` | 2 |  |  |

### `protocol/infrastructure/` - 4 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `core-infrastructure.mdx` | 1 | 2 | role and control posture |
| `custody.mdx` | 1 | 1 | role and control posture |
| `data-storage.mdx` | 1 | 2 | role and control posture |
| `instances.mdx` | 2 |  |  |

### `protocol/integration/` - 1 file, tier 2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `overview.mdx` | 2 |  |  |

### `sdk/` - 2 files, tier 3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `installation.mdx` | 3 |  |  |
| `introduction.mdx` | 3 | 1 |  |

### `sdk/customers/` - 8 files, tier 1/3

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `errors.mdx` | 3 |  |  |
| `id-links.mdx` | 3 |  |  |
| `identity.mdx` | 1 | 1 | statutory citation |
| `kyc-proofs.mdx` | 3 | 1 |  |
| `management.mdx` | 3 |  |  |
| `overview.mdx` | 3 |  |  |
| `sync.mdx` | 3 |  |  |
| `verification-profiles.mdx` | 3 |  |  |

### `security/` - 3 files, tier 1/2

| File | Tier | Locked sentences | Tier 1 signal |
|---|---|---|---|
| `changelog.mdx` | 2 |  |  |
| `overview.mdx` | 1 | 2 | statutory citation |
| `trusset-audits.mdx` | 2 |  |  |
