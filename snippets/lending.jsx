export const WriteFlow = () => {
  const steps = [
    { label: 'Build', text: 'Call the endpoint. The API answers with unsigned transaction data.' },
    { label: 'Sign', text: 'A wallet the right party controls signs it. Trusset never does.' },
    { label: 'Broadcast', text: 'The signer sends it to the chain and waits for it to mine.' },
    { label: 'Confirm', text: 'Call again with the txHash. The API checks the receipt and records it.' },
  ];
  return (
    <div className="tl-flow" role="list" aria-label="How a write works">
      {steps.map((step, index) => (
        <div className="tl-flow-step" role="listitem" key={step.label}>
          <div className="tl-flow-head">
            <span className="tl-flow-index">{index + 1}</span>
            <span className="tl-flow-label">{step.label}</span>
          </div>
          <p className="tl-flow-text">{step.text}</p>
        </div>
      ))}
    </div>
  );
};

export const InterestSplit = ({ currency = 'USDC' }) => {
  const [amount, setAmount] = useState('1000');
  const [fundRate, setFundRate] = useState('0');

  const interest = Math.max(0, Number(amount) || 0);
  const rate = Math.min(100, Math.max(0, Number(fundRate) || 0)) / 100;
  const infrastructure = interest * 0.2;
  const remainder = interest - infrastructure;
  const operator = remainder * 0.08;
  const distributor = remainder * 0.05;
  const left = remainder - operator - distributor;
  const fund = left * rate;
  const providers = left - fund;

  const legs = [
    { key: 'trusset', label: 'Trusset infrastructure fee', rule: '20% of the interest', value: infrastructure },
    { key: 'operator', label: 'Operator share', rule: '8% of the rest', value: operator },
    { key: 'distributor', label: 'Distributor share', rule: '5% of the rest', value: distributor },
    { key: 'fund', label: 'Insurance fund', rule: 'protocolFeeRate of what is left', value: fund },
    { key: 'providers', label: 'Liquidity providers', rule: 'Everything else', value: providers },
  ];
  const format = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const share = (value) => (interest > 0 ? (value / interest) * 100 : 0);

  return (
    <div className="tl-panel">
      <div className="tl-inputs">
        <label className="tl-field">
          <span>Repaid interest ({currency})</span>
          <input type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label className="tl-field">
          <span>Insurance fund rate (%)</span>
          <input type="number" min="0" max="100" step="any" inputMode="decimal" value={fundRate} onChange={(event) => setFundRate(event.target.value)} />
        </label>
      </div>
      <div className="tl-bar" aria-hidden="true">
        {legs.map((leg) => (
          <span key={leg.key} className={`tl-seg tl-seg-${leg.key}`} style={{ width: `${share(leg.value)}%` }} />
        ))}
      </div>
      <div className="tl-legend">
        {legs.map((leg) => (
          <div className="tl-legend-row" key={leg.key}>
            <span className={`tl-swatch tl-seg-${leg.key}`} aria-hidden="true" />
            <span className="tl-legend-label">
              {leg.label}
              <span className="tl-legend-rule">{leg.rule}</span>
            </span>
            <span className="tl-legend-value">
              {format(leg.value)} {currency}
              <span className="tl-legend-rule">{share(leg.value).toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HealthFactor = ({ currency = 'USDC' }) => {
  const [collateral, setCollateral] = useState('25000');
  const [debt, setDebt] = useState('15000');
  const [factor, setFactor] = useState('70');
  const [threshold, setThreshold] = useState('80');

  const value = Math.max(0, Number(collateral) || 0);
  const owed = Math.max(0, Number(debt) || 0);
  const cf = Math.max(0, Number(factor) || 0) / 100;
  const lt = Math.max(0, Number(threshold) || 0) / 100;

  const ltv = value > 0 ? owed / value : null;
  const health = owed > 0 && value > 0 ? (lt * value) / owed : null;
  const maxBorrow = value * cf;
  const room = Math.max(0, maxBorrow - owed);
  const drop = health !== null ? Math.max(0, 1 - 1 / health) : null;
  const invalid = lt <= cf;

  let tone = 'ok';
  let verdict = 'Healthy. The borrower can still draw more.';
  if (owed === 0) {
    tone = 'idle';
    verdict = 'No debt. The health factor reads null.';
  } else if (health !== null && health < 1) {
    tone = 'bad';
    verdict = 'Liquidatable. The health factor is below 1.0.';
  } else if (owed > maxBorrow) {
    tone = 'warn';
    verdict = 'Healthy, but above the collateral factor. Borrow More is refused.';
  }

  const format = (number) => number.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const percent = (number) => `${(number * 100).toFixed(1)}%`;

  return (
    <div className="tl-panel">
      <div className="tl-inputs tl-inputs-4">
        <label className="tl-field">
          <span>Collateral value ({currency})</span>
          <input type="number" min="0" step="any" inputMode="decimal" value={collateral} onChange={(event) => setCollateral(event.target.value)} />
        </label>
        <label className="tl-field">
          <span>Debt ({currency})</span>
          <input type="number" min="0" step="any" inputMode="decimal" value={debt} onChange={(event) => setDebt(event.target.value)} />
        </label>
        <label className="tl-field">
          <span>Collateral factor (%)</span>
          <input type="number" min="10" max="90" step="any" inputMode="decimal" value={factor} onChange={(event) => setFactor(event.target.value)} />
        </label>
        <label className="tl-field">
          <span>Liquidation threshold (%)</span>
          <input type="number" min="10" max="95" step="any" inputMode="decimal" value={threshold} onChange={(event) => setThreshold(event.target.value)} />
        </label>
      </div>
      {invalid ? (
        <p className="tl-verdict tl-verdict-bad">The liquidation threshold must be above the collateral factor. The market refuses this pair with INVALID_CONFIG.</p>
      ) : (
        <>
          <div className="tl-stats">
            <div className="tl-stat">
              <span className="tl-stat-label">Loan-to-value</span>
              <span className="tl-stat-value">{ltv === null ? '-' : percent(ltv)}</span>
            </div>
            <div className="tl-stat">
              <span className="tl-stat-label">Health factor</span>
              <span className="tl-stat-value">{health === null ? 'null' : health.toFixed(2)}</span>
            </div>
            <div className="tl-stat">
              <span className="tl-stat-label">Room to draw</span>
              <span className="tl-stat-value">{format(room)}</span>
            </div>
            <div className="tl-stat">
              <span className="tl-stat-label">Price drop to liquidation</span>
              <span className="tl-stat-value">{drop === null ? '-' : percent(drop)}</span>
            </div>
          </div>
          <p className={`tl-verdict tl-verdict-${tone}`} role="status" aria-live="polite">{verdict}</p>
        </>
      )}
    </div>
  );
};
