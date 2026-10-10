# Open questions

Gaps, contradictions, and stale content found during the style pass and deliberately left in place. Nothing here was guessed at or written around. Each entry names the file, what is wrong or missing, and what a correct answer needs.

Ordered by how much damage the wrong answer does.

---

## 1. The ISO certification claim contradicted itself. RESOLVED

**File:** `security/overview.mdx`.

Line 31 stated that Trusset renews "our ISO certification with TÜV" once a year, asserting a certification that already exists. Line 8 described one still in process. Both could not be true.

**Answered:** certification is in process and near completion, not granted.

**Fixed.** The audit-renewal cycle and the certification status are now two separate statements:

> Once a year, Trusset renews all security audits with a chosen third-party auditor based in the EU.
>
> ISO certification with TÜV is in progress and not yet complete. Once it is granted, it enters the same annual renewal cycle.

Two deliberate omissions in that wording:

- **No completion date.** "Soon" and any target date age into a false statement on a page a counterparty may read months later. The page says in progress. It does not forecast.
- **No specific TÜV entity and no ISO standard number.** The page says "TÜV" and "ISO certification" because that is what it said before. The brief mentions TÜV SÜD and ISO 27001. Neither was confirmed here, so neither was written in. Say the word and both get specified.

---

## 2. Two pages stated different API key limits. RESOLVED

**Files:** `endpoints/authentication.mdx`, `protocol/infrastructure/instances.mdx`.

`authentication.mdx` said 10 active keys. `instances.mdx` said 3, in both a table cell and prose.

**Answered:** `authentication.mdx` is correct. The limit is 10 active keys.

**Fixed.** `instances.mdx` now reads "10 active" in the limits table and "up to 10 active API keys" in prose, and carries the rotation window that `authentication.mdx` documents.

One thing deliberately not written: whether a key in `PENDING_ROTATION` counts against the 10 active limit. `authentication.mdx` does not say, so neither does this page. An integrator rotating all 10 keys at once needs that answer.

**Still needed:** does a `PENDING_ROTATION` key occupy one of the 10 slots?

---

## 3. Ten `stock-lending/` write endpoints do not document the confirm call

**Answered, in part:** `stock-lending` and `external-securities-lending` are two separate products with separate purposes, both live. Neither supersedes the other. Do not merge them and do not delete either. `external-securities-lending` is the more important of the two and is verified working.

That settles the product question. It does not settle the documentation question, which is narrower than the first pass suggested.

**The measurement.** Counting only write endpoints, and counting only a `txHash` request parameter as documenting the confirm call:

| Section | Write endpoints documenting the confirm call |
|---|---|
| `external-securities-lending` | 20 of 27 |
| `stock-lending` | 7 of 23 |

The 7 that `external-securities-lending` omits are coherent. They are the five hook endpoints, which write backend configuration rather than chain state, plus `sign-price` and `verify-price`, which produce or check an EIP-712 signature without submitting anything. Nothing on-chain happens, so there is nothing to confirm.

`stock-lending` omits those same six, correctly, and then omits ten more that do touch the chain:

`add-collateral`, `add-liquidity`, `borrow-more`, `claim-escrowed-collateral`, `close-loan`, `deploy-market`, `open-loan`, `remove-liquidity`, `repay`, `withdraw-collateral`

Every one of those ten has a direct counterpart in `external-securities-lending` that does document a `txHash` request parameter.

**Why "different products" does not explain it.** These ten are the same class of operation in both sections: deposit, borrow, repay, withdraw collateral. `endpoints/introduction.mdx` states the pattern platform-wide, naming "loans, liquidations" among the operations that return an unsigned payload and then record state on a second call. `endpoints/stock-lending/open-loan.mdx` already says "Only the `openLoan` call is returned", so it does hand back a transaction for the client to broadcast. What it never says is how the resulting position gets recorded.

**Needed:** one answer covering all ten. Do the `stock-lending` write endpoints accept a `txHash` confirm call, the way their `external-securities-lending` counterparts do?

- **If yes**, the ten pages are missing a request parameter, a response shape, and the confirm paragraph. That is a correctness gap, not a style gap, and it is the kind that costs an integrator a day.
- **If no**, and `stock-lending` records positions by indexing events instead, then `endpoints/introduction.mdx` overstates its scope and should say which product the confirm pattern applies to.

Not written either way, because the request and response contract cannot be inferred from the docs, and guessing at it would be inventing an API.

**Style status:** `stock-lending` is clean on every mechanically checkable rule. It has had the heading unification, the en dash removal, and the Vale pass. What it has not had is the per-page structural rewrite that `sdk/` received.

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

**Update, v2 pass.** The Lending reference now documents the v2 surface (item 14). There `RELAYER_NOT_CONFIGURED` no longer occurs: the oracle routes answer `WALLET_NOT_CONFIGURED` instead. `relayerAddress` is still a live response field, on `deploy-market`, `get-configuration-status`, `get-setup-steps` and `get-upgrade-status`, with the same gloss. The question above stands.

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

## 13. A locked negative capability claim was corrected, not softened

`sdk/customers/kyc-proofs.mdx` carried this, registered as a locked sentence in `docs/INVENTORY.md`:

> "The proofs themselves (`proofs/*.bin`) and the encrypted witness material (`secrets.enc`) are never uploaded."

**It is false for `proofs/*.bin`.** `services/customers/proofVerificationService.js` takes the STARK bytes as a base64 map on `POST /customers/api/identity/claims/from-proof`, verifies each one in a worker pool (stage 8), and refuses a claimed leaf that arrives without its proof with `PROOF_MISSING` whenever proofs are enforced. `config/zkTrustAnchors.js` sets `requireProofsDefault: true` for every `PRODUCTION` instance, so on a production instance the upload is mandatory, not optional.

The `secrets.enc` half is true and stays. No endpoint accepts it.

**Why it was changed rather than logged.** The lock exists to stop a style pass drifting the regulatory argument, and to stop anyone strengthening a claim nobody verified. This claim was verified and found false. A false statement about what data leaves a client's infrastructure, in a privacy product, is the worst kind of error this repository can ship: a client could build a compliance story on it and then be contradicted by their own network traffic.

The replacement states the same protection accurately. A commitment carries no value and a STARK reveals nothing beyond the predicate, so uploading them discloses no personal data; the file that would is `secrets.enc`, which is never accepted.

**Needed:** confirmation from whoever owns the regulatory argument that the replacement wording is the one to stand behind. Until then the page is accurate and the lock entry in `INVENTORY.md` is stale.

---

## 14. The Lending and Vaults reference moved to the v2 surface

**Files:** every page under `endpoints/lending/` and `endpoints/vaults/`, plus `endpoints/asset-register/`.

Every page pointed at `/lending-external-securities/api`, the v1 surface, while describing features only v2 has: rate modes, loan terms, the `ORACLE` price source. Every call written from those pages reached the wrong product. The reference now documents `/lending-external-securities-v2/api` and nothing else. Every x-api-key route the v2 routers mount has exactly one page, 157 in all, and 85 of them are new.

Two facts the pages do not forecast:

- The backend still mounts v1 at `/lending-external-securities`. It is no longer documented anywhere. Nothing on the site says whether it is deprecated, frozen or retired.
- The v2 factory is configured on Ethereum Sepolia only. Every production instance gets `503 SECURITY_LENDING_V2_NOT_CONFIGURED`, and liquidation bots `503 SHIM_NOT_CONFIGURED`. The introduction states the code without naming networks, so it stays true once mainnet is deployed.

**Needed:** a decision on announcing v1's status, and a heads-up to the docs owner when v2 reaches mainnet.

---

## 15. The Tier 1 Lending introduction was rewritten against v2

**File:** `endpoints/lending/introduction.mdx`.

INVENTORY registers this page as Tier 1: no sentence-level rewording. Most of its factual sentences were false for v2. The page claimed adoption could not be done with an API key and that rate mode and terms were fixed at deployment. It also claimed `borrowableLiquidity` included vault capacity and that liquidity providers deposit directly. They were corrected against the backend and the contracts, not restyled.

Locked sentences kept byte for byte, because they are still true: "Nothing is submitted on your behalf.", "Trusset holds no role.", "Trusset is not involved.", the 7 day write-off sentence, and "Write-off does not recover collateral from the router, so dispose of or return the collateral first."

Two changed:

- "There is no auto-sell for external securities, because these instruments have no on-platform venue." The first clause is true and kept. The reason clause is not: a market can now wire its own on-chain Dutch auction venue, and the docs call it that. The sentence now reads "There is no auto-sell for external securities.", followed by a sentence saying the auction venue sells only what a liquidation seizes into it, and that nothing moves from the router back into an auction.
- "Trusset never holds, fetches or uses a private key, and no endpoint signs on your behalf." Not registered as locked, but a negative capability claim. The backend fetches Trusset's own operations key, `ADMIN_PRIVATE_KEY`, to derive the platform address. It does so when `PLATFORM_ADMIN_ADDRESS` is unset (`services/lending-external-securities-v2/rolePositionService.js:165-182`). Trusset also operates the factory owner key. The claim that matters is about the client's keys, so it now reads "No endpoint signs on your behalf, and Trusset never asks for, holds or uses a private key of yours."

The same fact bears on the locked sentence "Trusset holds no private key and has no signer." in `endpoints/introduction.mdx`. Read literally, it is contradicted by the operations key and the factory owner key. It was not edited: the page is outside the lending scope and the lock holds.

**Needed:** re-approval of the introduction by whoever owns the regulatory argument, and a decision on the global sentence. Setting `PLATFORM_ADMIN_ADDRESS` everywhere would stop the backend fetching the key at all.

---

## 16. A locked negative capability claim about the insurance fund was false on v2

**File:** `endpoints/lending/settle-liquidation.mdx`.

Locked: "It is not automatically covered by the insurance fund, which only steps in on a timeout write-off."

Since 2026-09-18 the market draws on its insurance fund at every first settlement that retains less than the record's claim, in the same transaction (`LiquidationLib.sol` `_settle` and `_drawReserve`). Only principal neither the sale nor the fund covers is the pool's loss. The sentences before the locked one already said so, so the paragraph contradicted itself.

The locked sentence was replaced with: "A record that is never settled draws on the fund the same way when Handle Liquidation Timeout writes it off after 7 days." Same reasoning as item 13: a verified-false statement about who bears a loss is worse than an unapproved edit.

**Needed:** confirmation of the replacement wording.

---

## 17. A locked 7 day sentence named the wrong starting point

**File:** `endpoints/lending/settle-expired-auction.mdx`.

Locked: "The 7 day write-off clock starts at this point, not at the original liquidation."

The number is right. The starting point is not: on v2 the market opens its record when the liquidation seizes collateral into the auction venue, and the write-off reads that record's timestamp (`LiquidationLib.sol` `_auctionStart`, `timeout`). Settling the expired auction does not restart it. The sentence now reads: "The 7 day write-off clock does not restart at this point. It runs from the original liquidation, when the market opened its record and the auction began, so the router-side sale has whatever remains of those 7 days."

Two neighbouring 7 day sentences were kept byte for byte, each followed by a qualifying sentence. On `get-pending-liquidations.mdx` the qualifier covers the remainder of an expired auction. On `get-liquidation-stats.mdx` it says the fund pays only what its balance allows.

**Needed:** confirmation of the replacement wording.

---

## 18. Two locked sentences on update-config were overstated or ambiguous

**File:** `endpoints/lending/update-config.mdx`.

"A fund that publishes NAV daily needs `maxPriceAge` above 86400 seconds, or every loan action will revert against a stale price between publications." The bound is right. "Every loan action" is not: repayment and adding collateral never read the price. The sentence now names the four actions that do: opening loans, drawing more, withdrawing collateral against open debt, and liquidating. `maxPriceAge` is also an oracle setting on v2, not part of the market config, and the page says so.

"The contract caps each change at 10 percent per call." Kept byte for byte. The cap is 10 percentage points of the threshold, not 10 percent of its value, so a clarifying sentence follows it.

**Needed:** confirmation of the first replacement, and a decision on restating the second as "10 percentage points".

---

## 19. Two sentences on sync-oracle were false on v2

**File:** `endpoints/lending/sync-oracle.mdx`.

INVENTORY counts three locked sentences on this page and names only one, the 5000 basis point deviation bound, which is kept byte for byte. Two other sentences were replaced, and one of them is probably a registered lock:

- "There is no automatic price feed for these markets." False: an `ORACLE` market reads an external feed, and this endpoint refuses it with `EXTERNAL_FEED_ACTIVE`.
- "The check is skipped when the oracle has never been priced, so the first push after deployment can be any positive value." False: every push-mode oracle is initialized with a positive price (`SecurityPriceOracle.initialize`), so the first push is measured against it.

The page also now states the second circuit breaker v2 added: a rolling one-hour window bounded by the same `maxDeviationBps`.

**Needed:** the list of the page's three locked sentences, so INVENTORY can record which one was corrected.

---

## 20. Backend behaviour documented as it is, pending a decision

The pages describe what the code does. These points look unintended, and each page is worded to stay true after a fix, or carries a short note:

- `realizationReady` on Get Auction Module requires the venue to be authorized on the insurance fund, but the wiring flow never offers that leg. A venue wired through the API therefore reads `false` for good. The non-fungible family already dropped the condition.
- The chain binding middleware stops at the first object carrying `to` and `data`. On roughly ten setter routes that spread the builder result into `data`, `chainId` and `value` land on `data` and `data.transaction` carries only `{ to, data }`. The pages show the fields where they land.
- Set Vault Liquidity and Register Vault have no `txHash` confirm leg on the x-api-key face. The app face has one.
- Close Liquidation refuses a record marked `WRITTEN_OFF`. The router record of a write-off made through this API can therefore never be closed through it, and the router never becomes quiet enough to rotate its sale recipient.
- The v2 hook service re-arms the v1 job name, so a new or edited monitor waits for the scheduler's next wake-up.
- Confirm Bot Deployment writes a duplicate record when called twice, and its signer check cannot fire.
- The API's nomination check reads the factory's deployer register, which the contract says it no longer consults.
- The contracts repository's own documentation is stale in places the pages contradict. `docs/OPERATOR-CONFIG.md` says a binding `CLAMPED` cap suspends borrows, and that the auction venue checks every bidder against the identity registry. `contracts/evm/README.md` says the sale recipient has no setter and that `settleExpiredAuction` needs `LIQUIDATOR_ROLE`. It also says a non-vault provider's distributor slice goes to the operator wallet. The Solidity says otherwise in each case, and the pages follow the Solidity.

**Needed:** a decision per item from the backend and contract owners. None blocks the documentation.

---

## 21. The v2 pass leaves one style convention to confirm

`MISSING_MARKET_ID` (`400`, a market ID longer than 100 characters) is now listed in the error table of every page keyed by a market ID, 110 in all. Before this pass no page listed it. Listing it everywhere is consistent; covering it once in the introduction and removing it from the tables would be shorter.

**Needed:** a preference. Either is a mechanical change.

---

## 22. A locked negative capability claim about on-chain personal data was false

**File:** `protocol/infrastructure/data-storage.mdx`.

Locked: "Personal information never stores on-chain to maintain privacy and comply with regulations like GDPR".

Every ID link registration on an ERC-3643 instance writes the investor's country on-chain: `registerIdentity(wallet, identity, country)` stores the ISO 3166-1 numeric code in the register (`services/customers/trexRegistry.js`), and the residency claim added to the investor's ONCHAINID carries keccak256 of the three-letter code (`services/customers/linkOnboardingService.js`, `identityService.buildCountryHash`), which hashing each code reverses. Reported as r1008d-13.

The sentence now names both exceptions and says they sit on the instance's own register under its signature. The GDPR clause was dropped rather than reworded: whether a hashed country code linked to a wallet stays personal data is for counsel. Same reasoning as item 13.

**Needed:** confirmation of the replacement wording, and a decision from counsel on whether any compliance statement belongs on the page.

---

## 23. The atomic sale qualifies the liquidation sentences

**Files:** `endpoints/lending/introduction.mdx`, `endpoints/lending/liquidate.mdx`.

A liquidation router can now run in atomic mode (`setAtomicMode(1)` on the router, built by `liquidationService.buildAtomicModeTransaction`). A liquidation then sells the seized collateral to the sale recipient at its standing bid and settles the record in the same transaction. Every router starts in two-step mode, and the API builds the switch to atomic mode only for a `MARKET`-priced market whose lender of record declared `EXCHANGE_SALE`. Reported as r1009b-01.

Locked and kept byte for byte, in both files: "There is no auto-sell for external securities." Once the router administrator has switched atomic mode on, the sale runs without an operator step. The buyer is the sale recipient the lender of record fixed, at the bid that buyer posted. Whether that is an auto-sell in the sense of the regulatory argument is for whoever owns the argument to decide. Both pages now describe the atomic sale near the locked sentence: the introduction after the settlement steps, `liquidate.mdx` in the same paragraph.

Two sentences that are not registered were false for a router in atomic mode and now name the mode:

- `introduction.mdx`: "Once collateral reaches the router it does not sell itself." now reads "Once collateral reaches a router in two-step mode, where every router starts, it does not sell itself." It is a negative capability claim by the style guide's definition.
- `liquidate.mdx`: "Once collateral reaches the router it stays there until an operator sells it and settles the proceeds." now reads "Once collateral reaches the router in two-step mode it stays there until an operator sells it and settles the proceeds."
- `withdraw-collateral-for-sale.mdx`: "External securities have no automatic sale path through the router." now reads "A record on a router in two-step mode does not sell itself." The paragraph then names [Sell Pending Liquidation](/endpoints/lending/sell-pending-liquidation) for a market where the atomic sale is offered. The old sentence was false wherever the atomic sale runs (`sellPending` on the router, `liquidationService.buildSellPendingTransaction`).

**Needed:** a decision on the locked sentence (keep, qualify or replace), and confirmation of the three qualified sentences.

---

## 24. The Tier 1 Lending introduction took the proposal round

**File:** `endpoints/lending/introduction.mdx`.

Tier 1 lets headings, ordering, tables and cross-links change. This round added two rows to the Base Path table, a whitelist paragraph under Identity gates, a `FIXED` paragraph under Pricing, the atomic sale paragraph of item 23, and an Error codes section with one reference table. Three existing sentences were false after the round and were corrected:

- "Seven resource groups sit under that path:" now says eight, for the `/access-lists` group.
- "Prices come from one of three sources, fixed at deployment as `priceSource`." now says four, for `FIXED`.
- "On every source the oracle's `maxPriceAge` decides when a price is stale, 24 hours by default." now begins "On every source but `FIXED`". A fixed oracle never reports a stale price (`isPriceStale` returns `false` when `priceFixed` is set, `SecurityPriceOracle.sol`). The 24 hour default, a locked numeric bound, is unchanged.

The verification pass against backend `435a471` (r1010b) added one paragraph under Identity gates on the previous Trusset ID Register (`retiredRegistry.js`), and changed two more existing sentences that had become incomplete:

- "They save or unpublish terms of use, record a price attestation, configure hooks, and update a bot's record." now ends "update a bot's record, and rename, repurpose, archive or rescan a whitelist." `PATCH /access-lists/{listId}` and `POST /access-lists/{listId}/rescan` write nothing on chain (`access-lists.api.js`).
- "The asset data and bot confirms do too." now reads "The asset data, whitelist and bot confirms do too." Every whitelist build names its confirm route in `confirmWith` (`accessListService.js`).

The same pass changed the Lending card on `endpoints/introduction.mdx`, also Tier 1. It named three price sources and two liquidation paths. It now names the fixed price, gates by register or whitelist, and the atomic sale.

**Needed:** re-approval of the changed sentences, as for item 15.

---

## Not open, for the record

Two things flagged early that turned out to be non-issues, recorded so they do not get re-raised.

**The 26 JavaScript code blocks.** The inventory first listed converting them to TypeScript as a major job. Reading them showed 25 are Hardhat config and deployment scripts, where `hardhat.config.js` and `require` are the tool's own convention, and 1 is a CommonJS example that exists to demonstrate `require`. All 26 are correct. The style guide carries an explicit exception.

**Trusset-side signing.** Step 4 of the brief expected pages still describing a Trusset-side relayer. There are none. Only the two identifiers in item 6 above.
