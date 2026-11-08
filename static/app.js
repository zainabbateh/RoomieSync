// RoomieSync logic: F = factors+weights, S = students, match() = algorithm

var F=[
{k:'sleep',n:'Sleep schedule',w:15,r:4,lo:'Early bird',hi:'Night owl',g:'Similar sleep schedule',b:'Different sleep schedules'},
{k:'clean',n:'Cleanliness',w:15,r:4,lo:'Relaxed',hi:'Spotless',g:'Similar cleanliness preference',b:'Different cleanliness standards'},
{k:'budget',n:'Monthly budget',w:12,r:500,lo:100,hi:600,g:'Similar budget',b:'Budgets are far apart'},
{k:'smoke',n:'Smoking',w:12,r:2,o:['Non-smoker','Outside only','Smoker'],g:'Same smoking habits',b:'Different smoking habits'},
{k:'study',n:'Studying at home',w:8,r:4,lo:'Rarely',hi:'A lot',g:'Compatible study habits',b:'Different study routines'},
{k:'cook',n:'Cooking',w:6,r:4,lo:'Never',hi:'Daily',g:'Similar cooking preferences',b:'Different cooking preferences'},
{k:'noise',n:'Noise level',w:10,r:4,lo:'Needs silence',hi:'Loves music',g:'Similar noise tolerance',b:'Different noise tolerance'},
{k:'share',n:'Sharing items',w:6,r:4,lo:'Mine is mine',hi:'Share everything',g:'Same attitude to sharing things',b:'Different views on sharing items'},
{k:'pets',n:'Pets',w:6,r:2,o:['No pets','Fine with pets','Has / wants pets'],g:'Aligned on pets',b:'Different views on pets'},
{k:'social',n:'Social level',w:10,r:4,lo:'Introvert',hi:'Social butterfly',g:'Similar social energy',b:'Different social energy'}];
var S=[
['Lina','👩',{sleep:2,clean:5,budget:300,smoke:0,study:5,cook:3,noise:1,share:3,pets:1,social:2}],
['Omar','👨',{sleep:4,clean:2,budget:450,smoke:2,study:2,cook:5,noise:5,share:5,pets:2,social:5}],
['Sara','👩',{sleep:2,clean:4,budget:320,smoke:0,study:4,cook:2,noise:2,share:3,pets:0,social:3}],
['Yazan','🧑',{sleep:5,clean:3,budget:250,smoke:1,study:3,cook:4,noise:4,share:4,pets:1,social:4}],
['Maya','👩',{sleep:3,clean:5,budget:400,smoke:0,study:4,cook:4,noise:2,share:2,pets:2,social:3}],
['Khaled','👨',{sleep:1,clean:4,budget:350,smoke:0,study:5,cook:2,noise:1,share:2,pets:0,social:1}],
['Noor','👩',{sleep:4,clean:3,budget:280,smoke:1,study:2,cook:5,noise:4,share:5,pets:1,social:5}],
['Tariq','🧔',{sleep:3,clean:3,budget:500,smoke:2,study:3,cook:3,noise:3,share:3,pets:1,social:4}]
].map(function(x,i){return{id:i,name:x[0],av:x[1],p:x[2]}});
var me={id:99,name:'You',av:'🧑‍🎓',p:{sleep:2,clean:4,budget:320,smoke:0,study:4,cook:3,noise:2,share:3,pets:1,social:3}};
try{var sv=JSON.parse(localStorage.getItem('rs_me')||'null');if(sv&&sv.p)me=sv}catch(e){}
var tab='find',A=99,B=0;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function col(s){return s>=80?'var(--good)':s>=60?'var(--mid)':'var(--bad)'}
function sim(f,a,b){return Math.max(0,1-Math.abs(a-b)/f.r)}
function match(a,b){var t=0,g=[],bad=[],mid=[],flag=[];
F.forEach(function(f){var s=sim(f,a.p[f.k],b.p[f.k]);t+=s*f.w;
if(f.k=='noise'&&a.p.noise<=2&&b.p.noise<=2){g.push('Both prefer a quiet environment');return}
if(s>=.8)g.push(f.g);else if(s<.5)bad.push(f.b);else mid.push('Somewhat different: '+f.n.toLowerCase())});
var d=[];
if(Math.abs(a.p.smoke-b.p.smoke)==2){t*=.75;d.push('Deal-breaker risk: smoker vs non-smoker')}
if(Math.abs(a.p.pets-b.p.pets)==2){t*=.88;d.push('Pet conflict: one has pets, the other prefers none')}
return{s:Math.round(t),g:g,b:bad,m:mid,d:d}}
function why(m){return '<ul class="r">'+m.g.map(function(x){return'<li class="g">✓ '+x+'</li>'}).join('')+m.m.map(function(x){return'<li class="n">~ '+x+'</li>'}).join('')+m.b.map(function(x){return'<li class="w">⚠ '+x+'</li>'}).join('')+'</ul>'+m.d.map(function(x){return'<div class="warn">⛔ '+x+'</div>'}).join('')}
function ring(s,c){return'<div class="ring '+(c||'')+'" style="--p:'+s+';--c:'+col(s)+'"><b>'+s+'%</b></div>'}
function label(s){return s>=85?'Perfect match':s>=70?'Great potential':s>=55?'Workable':'Not recommended'}
function all(){return[me].concat(S)}
function pick(id){return all().filter(function(x){return x.id==id})[0]}
function view(){var h='';
if(tab=='find'){var list=S.map(function(s){return{s:s,m:match(me,s)}}).sort(function(a,b){return b.m.s-a.m.s});
h='<div class="hero"><h2>Hi '+esc(me.name)+', meet your best matches</h2><p>Update your profile and the ranking recalculates instantly.</p></div><div class="grid"><div class="card"><h3>Your profile</h3><label>Name</label><input type="text" id="nm" value="'+esc(me.name)+'" maxlength="20">';
F.forEach(function(f){h+='<label>'+f.n+'</label>';
if(f.o){h+='<select data-k="'+f.k+'">'+f.o.map(function(o,i){return'<option value="'+i+'"'+(me.p[f.k]==i?' selected':'')+'>'+o+'</option>'}).join('')+'</select>'}
else{var mn=f.k=='budget'?100:1,mx=f.k=='budget'?600:5;h+='<input type="range" data-k="'+f.k+'" min="'+mn+'" max="'+mx+'" step="'+(f.k=='budget'?25:1)+'" value="'+me.p[f.k]+'"><div class="ends"><span>'+(f.k=='budget'?'$100':f.lo)+'</span><span id="v_'+f.k+'">'+(f.k=='budget'?'$'+me.p[f.k]:'')+'</span><span>'+(f.k=='budget'?'$600':f.hi)+'</span></div>'}});
h+='</div><div>';
list.forEach(function(x,i){h+='<div class="m"><div class="av">'+x.s.av+'</div><div><b>'+(i==0?'🏆 ':'')+esc(x.s.name)+'</b> <span class="sub">· '+label(x.m.s)+'</span><div>'+F.slice(0,4).map(function(f){return'<span class="pill">'+(f.o?f.o[x.s.p[f.k]]:f.k=='budget'?'$'+x.s.p.budget:f.n+' '+x.s.p[f.k]+'/5')+'</span>'}).join('')+'</div><details><summary>Why this score?</summary>'+why(x.m)+'</details></div>'+ring(x.m.s)+'</div>'});
h+='</div></div>'}
if(tab=='cmp'){var opts=function(sel){return all().map(function(x){return'<option value="'+x.id+'"'+(x.id==sel?' selected':'')+'>'+x.av+' '+esc(x.name)+'</option>'}).join('')};
var a=pick(A),b=pick(B),m=match(a,b);
h='<div class="card"><h3>Compare any two students</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><select id="sa">'+opts(A)+'</select><select id="sb">'+opts(B)+'</select></div>'+
'<div class="cmp"><div class="vs"><div class="av">'+a.av+'</div><b>'+esc(a.name)+'</b></div>'+ring(m.s,'big')+'<div class="vs"><div class="av">'+b.av+'</div><b>'+esc(b.name)+'</b></div></div><h3 style="text-align:center">'+label(m.s)+(m.s>=85?' ❤️':'')+'</h3>'+why(m)+
'<h3 style="margin-top:22px">Factor by factor</h3><table>'+F.map(function(f){var s=Math.round(sim(f,a.p[f.k],b.p[f.k])*100);return'<tr><td>'+f.n+'</td><td style="width:45%"><div class="bar"><i style="width:'+s+'%;background:'+col(s)+'"></i></div></td><td>'+s+'%</td></tr>'}).join('')+'</table></div>'}
if(tab=='how'){h='<div class="card"><h2>How the algorithm works</h2><p>No machine learning. Just transparent, explainable maths — easy to defend in a presentation.</p><ol><li><b>Normalise:</b> every answer becomes a number (sliders 1–5, budget in $, smoking/pets 0–2).</li><li><b>Similarity per factor:</b> <code>1 − |A − B| / range</code> → 0 (opposite) to 1 (identical).</li><li><b>Weighted sum:</b> each factor has a weight; weights total 100.</li><li><b>Deal-breaker penalties:</b> smoker vs non-smoker ×0.75, pet conflict ×0.88.</li><li><b>Explain:</b> similarity ≥ 80% → ✓, below 50% → ⚠, in between → ~.</li><li><b>Rank:</b> sort all candidates by score.</li></ol><h3>Weights</h3><table>'+F.map(function(f){return'<tr><td>'+f.n+'</td><td style="width:50%"><div class="bar"><i style="width:'+f.w*6+'%"></i></div></td><td>'+f.w+'</td></tr>'}).join('')+'</table><p class="sub">Complexity: O(n × f) for n students and f factors. Future work: learn weights from real roommate feedback.</p></div>'}
document.getElementById('app').innerHTML=h;bind()}
function bind(){
var nm=document.getElementById('nm');if(nm)nm.oninput=function(){me.name=nm.value||'You';save()};
document.querySelectorAll('[data-k]').forEach(function(el){var k=el.dataset.k;if(k=='budget'){document.getElementById('v_budget').textContent='$'+el.value}
el.oninput=el.onchange=function(){me.p[k]=+el.value;if(k=='budget')document.getElementById('v_budget').textContent='$'+el.value;save();clearTimeout(window._t);window._t=setTimeout(function(){var y=scrollY;view();scrollTo(0,y)},250)}});
var sa=document.getElementById('sa');if(sa){sa.onchange=function(){A=+sa.value;view()};document.getElementById('sb').onchange=function(e){B=+e.target.value;view()}}}
function save(){try{localStorage.setItem('rs_me',JSON.stringify(me))}catch(e){}}
document.getElementById('nav').onclick=function(e){var t=e.target.dataset.t;if(!t)return;tab=t;document.querySelectorAll('nav button').forEach(function(b){b.classList.toggle('on',b.dataset.t==t)});view()};
view();
