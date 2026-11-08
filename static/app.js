// RoomieSync front-end. All matching maths is done by the Flask backend (matching.py).
var F = [], S = [];
var me = { id: 99, name: 'You', av: '🧑‍🎓', p: { sleep: 2, clean: 4, budget: 325, smoke: 0, study: 4, cook: 3, noise: 2, share: 3, pets: 1, social: 3 } };
try { var sv = JSON.parse(localStorage.getItem('rs_me') || 'null'); if (sv && sv.p) me = sv } catch (e) {}
var tab = 'find', A = 99, B = 0, tick = 0;

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
function col(s) { return s >= 80 ? 'var(--good)' : s >= 60 ? 'var(--mid)' : 'var(--bad)' }
function label(s) { return s >= 85 ? 'Perfect match' : s >= 70 ? 'Great potential' : s >= 55 ? 'Workable' : 'Not recommended' }
function all() { return [me].concat(S) }
function pick(id) { return all().filter(function (x) { return x.id == id })[0] }
function ring(s, c) { return '<div class="ring ' + (c || '') + '" style="--p:' + s + ';--c:' + col(s) + '"><b>' + s + '%</b></div>' }
function post(url, body) {
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then(function (r) { if (!r.ok) throw new Error('Server error'); return r.json() });
}
function why(m) {
  return '<ul class="r">' + m.good.map(function (x) { return '<li class="g">✓ ' + x + '</li>' }).join('') +
    m.mid.map(function (x) { return '<li class="n">~ ' + x + '</li>' }).join('') +
    m.bad.map(function (x) { return '<li class="w">⚠ ' + x + '</li>' }).join('') + '</ul>' +
    m.deals.map(function (x) { return '<div class="warn">⛔ ' + x + '</div>' }).join('');
}
function show(h) { document.getElementById('app').innerHTML = h; bind() }

function view() {
  var t = ++tick;
  if (tab == 'find') {
    post('/api/rank', { profile: me.p }).then(function (d) { if (t == tick) show(findHtml(d.results)) })
      .catch(function () { show('<div class="card">Could not reach the server. Is <code>python app.py</code> running?</div>') });
  } else if (tab == 'cmp') {
    post('/api/compare', { a: pick(A).p, b: pick(B).p }).then(function (m) { if (t == tick) show(cmpHtml(m)) })
      .catch(function () { show('<div class="card">Could not reach the server.</div>') });
  } else show(howHtml());
}

function findHtml(list) {
  var h = '<div class="hero"><h2>Hi ' + esc(me.name) + ', meet your best matches</h2><p>Update your profile and the ranking recalculates instantly.</p></div><div class="grid"><div class="card"><h3>Your profile</h3><label>Name</label><input type="text" id="nm" value="' + esc(me.name) + '" maxlength="20">';
  F.forEach(function (f) {
    h += '<label>' + f.n + '</label>';
    if (f.o) {
      h += '<select data-k="' + f.k + '">' + f.o.map(function (o, i) { return '<option value="' + i + '"' + (me.p[f.k] == i ? ' selected' : '') + '>' + o + '</option>' }).join('') + '</select>';
    } else {
      var bud = f.k == 'budget';
      h += '<input type="range" data-k="' + f.k + '" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + me.p[f.k] + '"><div class="ends"><span>' + (bud ? '$' + f.min : f.lo) + '</span><span id="v_' + f.k + '">' + (bud ? '$' + me.p[f.k] : '') + '</span><span>' + (bud ? '$' + f.max : f.hi) + '</span></div>';
    }
  });
  h += '</div><div>';
  list.forEach(function (r, i) {
    var s = pick(r.id);
    h += '<div class="m"><div class="av">' + s.av + '</div><div><b>' + (i == 0 ? '🏆 ' : '') + esc(s.name) + '</b> <span class="sub">· ' + label(r.score) + '</span><div>' +
      F.slice(0, 4).map(function (f) { return '<span class="pill">' + (f.o ? f.o[s.p[f.k]] : f.k == 'budget' ? '$' + s.p.budget : f.n + ' ' + s.p[f.k] + '/5') + '</span>' }).join('') +
      '</div><details><summary>Why this score?</summary>' + why(r) + '</details></div>' + ring(r.score) + '</div>';
  });
  return h + '</div></div>';
}

function cmpHtml(m) {
  var opts = function (sel) { return all().map(function (x) { return '<option value="' + x.id + '"' + (x.id == sel ? ' selected' : '') + '>' + x.av + ' ' + esc(x.name) + '</option>' }).join('') };
  var a = pick(A), b = pick(B);
  return '<div class="card"><h3>Compare any two students</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><select id="sa">' + opts(A) + '</select><select id="sb">' + opts(B) + '</select></div>' +
    '<div class="cmp"><div class="vs"><div class="av">' + a.av + '</div><b>' + esc(a.name) + '</b></div>' + ring(m.score, 'big') + '<div class="vs"><div class="av">' + b.av + '</div><b>' + esc(b.name) + '</b></div></div><h3 style="text-align:center">' + label(m.score) + (m.score >= 85 ? ' ❤️' : '') + '</h3>' + why(m) +
    '<h3 style="margin-top:22px">Factor by factor</h3><table>' + m.factors.map(function (x, i) { return '<tr><td>' + F[i].n + '</td><td style="width:45%"><div class="bar"><i style="width:' + x.sim + '%;background:' + col(x.sim) + '"></i></div></td><td>' + x.sim + '%</td></tr>' }).join('') + '</table></div>';
}

function howHtml() {
  return '<div class="card"><h2>How the algorithm works</h2><p>No machine learning. The Flask backend (<code>matching.py</code>) runs transparent, explainable maths.</p><ol><li><b>Normalise:</b> every answer becomes a number (sliders 1–5, budget in $, smoking/pets 0–2).</li><li><b>Similarity per factor:</b> <code>1 − |A − B| / range</code> gives 0 (opposite) to 1 (identical).</li><li><b>Weighted sum:</b> each factor has a weight; weights total 100.</li><li><b>Deal-breaker penalties:</b> smoker vs non-smoker ×0.75, pet conflict ×0.88.</li><li><b>Explain:</b> similarity ≥ 80% gives ✓, below 50% gives ⚠, in between gives ~.</li><li><b>Rank:</b> sort all candidates by score.</li></ol><h3>Weights</h3><table>' +
    F.map(function (f) { return '<tr><td>' + f.n + '</td><td style="width:50%"><div class="bar"><i style="width:' + f.w * 6 + '%"></i></div></td><td>' + f.w + '</td></tr>' }).join('') +
    '</table><h3>API</h3><p><code>GET /api/config</code> · <code>POST /api/rank</code> · <code>POST /api/compare</code></p><p class="sub">Complexity: O(n × f). Future work: user accounts, a database, learning weights from feedback.</p></div>';
}

function bind() {
  var nm = document.getElementById('nm'); if (nm) nm.oninput = function () { me.name = nm.value || 'You'; save() };
  document.querySelectorAll('[data-k]').forEach(function (el) {
    var k = el.dataset.k;
    el.oninput = el.onchange = function () {
      me.p[k] = +el.value; if (k == 'budget') document.getElementById('v_budget').textContent = '$' + el.value;
      save(); clearTimeout(window._t);
      window._t = setTimeout(function () { var y = scrollY; view(); setTimeout(function () { scrollTo(0, y) }, 120) }, 250);
    };
  });
  var sa = document.getElementById('sa');
  if (sa) { sa.onchange = function () { A = +sa.value; view() }; document.getElementById('sb').onchange = function (e) { B = +e.target.value; view() } }
}
function save() { try { localStorage.setItem('rs_me', JSON.stringify(me)) } catch (e) {} }

document.getElementById('nav').onclick = function (e) {
  var t = e.target.dataset.t; if (!t) return; tab = t;
  document.querySelectorAll('nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.t == t) });
  view();
};
fetch('/api/config').then(function (r) { return r.json() }).then(function (c) {
  F = c.factors;
  S = c.students.map(function (s) { return { id: s.id, name: s.name, av: s.avatar, p: s.profile } });
  F.forEach(function (f) { if (me.p[f.k] === undefined) me.p[f.k] = Math.round((f.min + f.max) / 2) });
  view();
}).catch(function () { show('<div class="card">Could not load data. Start the server with <code>python app.py</code>.</div>') });
