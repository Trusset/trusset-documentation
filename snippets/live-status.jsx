export const LiveStatus = ({ part = 'label' }) => {
  const [state, setState] = useState('loading');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let alive = true;

    const read = () => {
      const now = Date.now();
      const cached = window.__trussetStatus;
      if (!cached || now - cached.at > 30000) {
        window.__trussetStatus = {
          at: now,
          promise: fetch('https://status.trusset.org/index.json', {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          })
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
            .then((body) => {
              const value = body && body.data && body.data.attributes && body.data.attributes.aggregate_state;
              return typeof value === 'string' ? value : 'unknown';
            })
            .catch(() => 'unknown'),
        };
      }
      window.__trussetStatus.promise.then((value) => {
        if (alive) setState(value);
      });
    };

    read();
    const timer = window.setInterval(read, 60000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const states = {
    loading: { tone: 'neutral', label: 'Checking status' },
    operational: { tone: 'up', label: 'All systems operational' },
    degraded: { tone: 'warn', label: 'Degraded performance' },
    downtime: { tone: 'down', label: 'Service disruption' },
    maintenance: { tone: 'info', label: 'Scheduled maintenance' },
    unknown: { tone: 'neutral', label: 'Live status unavailable' },
  };
  const current = states[state] || states.unknown;

  if (part === 'dot') {
    return <span className={`trusset-status-dot trusset-status-${current.tone}`} aria-hidden="true" />;
  }

  return (
    <span className="trusset-status-label" role="status" aria-live="polite">
      {current.label}
    </span>
  );
};
