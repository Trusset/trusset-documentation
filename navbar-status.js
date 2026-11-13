/*
 * Live state for the dot in front of the navbar's Status link. The state goes
 * on <html> as data-trusset-status and style.css colours the dot from it, so
 * nothing is injected into the navbar and the dot survives every client-side
 * navigation and re-render. Shares window.__trussetStatus with
 * snippets/live-status.jsx, so a page that also shows the status card makes
 * one request, not two. Refreshes every minute while the tab is visible.
 */
(function () {
  if (typeof window === 'undefined' || window.__trussetNavStatus) return;
  window.__trussetNavStatus = true;

  var URL = 'https://status.trusset.org/index.json';
  var TTL = 30000;
  var KNOWN = ['operational', 'degraded', 'downtime', 'maintenance'];

  function read() {
    var now = Date.now();
    var cached = window.__trussetStatus;
    if (!cached || now - cached.at > TTL) {
      cached = window.__trussetStatus = {
        at: now,
        promise: fetch(URL, { headers: { Accept: 'application/json' }, cache: 'no-store' })
          .then(function (response) {
            return response.ok ? response.json() : Promise.reject(new Error(String(response.status)));
          })
          .then(function (body) {
            var value = body && body.data && body.data.attributes && body.data.attributes.aggregate_state;
            return typeof value === 'string' ? value : 'unknown';
          })
          .catch(function () {
            return 'unknown';
          }),
      };
    }
    cached.promise.then(function (value) {
      var state = KNOWN.indexOf(value) === -1 ? 'unknown' : value;
      document.documentElement.setAttribute('data-trusset-status', state);
    });
  }

  read();
  window.setInterval(function () {
    if (!document.hidden) read();
  }, 60000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) read();
  });
})();
