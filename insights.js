/* Read-only sales analysis. No storage access or writes. */
(function(root){
  'use strict';
  const DAY=86400000;
  function dateValue(value){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return null;
    const n=Date.parse(value+'T00:00:00Z');
    return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===value?n:null;
  }
  function bucket(){return {revenue:0,profit:0,count:0,days:0};}
  function analyze(sales,{today,month='all'}={}){
    const endToday=dateValue(today);
    if(endToday===null)throw new Error('Ein gültiges heutiges Datum ist erforderlich.');
    const valid=sales.filter(s=>dateValue(s.date)!==null&&dateValue(s.date)<=endToday);
    const first=valid.length?valid.reduce((min,s)=>s.date<min?s.date:min,valid[0].date):null;
    const result={first,start:null,end:null,months:[],byDay:Array.from({length:31},bucket),phases:Array.from({length:3},bucket),daily:[],monthly:[],count:0,excluded:sales.length-valid.length};
    if(!first)return result;
    const firstTime=dateValue(first);
    for(let d=new Date(firstTime);d.getTime()<=endToday;d.setUTCMonth(d.getUTCMonth()+1,1)){
      result.months.push(d.toISOString().slice(0,7));
    }
    let start=firstTime,end=endToday;
    if(month!=='all'){
      const m=dateValue(month+'-01');
      if(m===null)return result;
      const d=new Date(m);d.setUTCMonth(d.getUTCMonth()+1);
      start=Math.max(start,m);end=Math.min(end,d.getTime()-DAY);
    }
    if(start>end)return result;
    result.start=new Date(start).toISOString().slice(0,10);result.end=new Date(end).toISOString().slice(0,10);
    const daily=new Map(),monthly=new Map();
    for(let t=start;t<=end;t+=DAY){
      const iso=new Date(t).toISOString().slice(0,10),day=+iso.slice(8),phase=day<=10?0:day<=20?1:2;
      const row={date:iso,...bucket(),days:1};daily.set(iso,row);
      result.byDay[day-1].days++;result.phases[phase].days++;
      const key=iso.slice(0,7);if(!monthly.has(key))monthly.set(key,{month:key,rows:[],...bucket()});
      monthly.get(key).rows.push(row);monthly.get(key).days++;
    }
    for(const sale of valid){
      if(sale.status==='storniert'||sale.status==='retour'||!daily.has(sale.date))continue;
      const revenue=Number.isFinite(+sale.rev)?+sale.rev:0,cost=Number.isFinite(+sale.cost)?+sale.cost:0;
      const day=+sale.date.slice(8),phase=day<=10?0:day<=20?1:2;
      for(const b of [daily.get(sale.date),result.byDay[day-1],result.phases[phase],monthly.get(sale.date.slice(0,7))]){
        b.revenue+=revenue;b.profit+=Math.round((revenue-cost)*100)/100;b.count++;
      }
      result.count++;
    }
    result.daily=[...daily.values()];result.monthly=[...monthly.values()];return result;
  }
  root.MonthRhythm={analyze,dateValue};
  if(typeof module!=='undefined')module.exports=root.MonthRhythm;
})(typeof window==='undefined'?globalThis:window);

function renderMonthlyInsights(sales){
  const picker=document.getElementById('rhythm-month'),metricPicker=document.getElementById('rhythm-metric');
  if(!picker)return;
  const today=localDateISO(),all=MonthRhythm.analyze(sales,{today});
  const selected=picker.value||'all';
  const monthName=m=>new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(m+'-01T00:00:00Z'));
  picker.innerHTML='<option value="all">Gesamter Zeitraum</option>'+all.months.slice().reverse().map(m=>`<option value="${m}">${monthName(m)}</option>`).join('');
  picker.value=all.months.includes(selected)?selected:'all';
  const data=picker.value==='all'?all:MonthRhythm.analyze(sales,{today,month:picker.value});
  const key=metricPicker.value||'revenue',name={revenue:'Umsatz',profit:'Gewinn',count:'Verkäufe'}[key];
  const money=new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}),number=new Intl.NumberFormat('de-DE',{maximumFractionDigits:2});
  const format=v=>key==='count'?number.format(v):money.format(v);
  const avg=b=>b.days?b[key]/b.days:null;
  const phaseNames=['Monatsanfang','Monatsmitte','Monatsende'],phaseDates=['1.–10.','11.–20.','21.–Monatsende'];
  const ranked=data.phases.map((b,i)=>({b,i,value:avg(b)})).filter(x=>x.value!==null).sort((a,b)=>b.value-a.value);
  const winners=ranked.filter(x=>Math.abs(x.value-(ranked[0]?.value||0))<1e-8);
  const positive=data.count>0;
  const dayRank=data.byDay.map((b,i)=>({b,day:i+1,value:avg(b)})).filter(x=>x.value!==null).sort((a,b)=>b.value-a.value);
  const bestDays=dayRank.filter(x=>Math.abs(x.value-(dayRank[0]?.value||0))<1e-8);
  const bestActual=data.daily.filter(x=>x.count>0).sort((a,b)=>b[key]-a[key]||a.date.localeCompare(b.date));
  const maxActual=bestActual[0];
  document.getElementById('rhythm-summary').innerHTML=positive?[
    ['Stärkste Monatsphase',winners.length===1?phaseNames[winners[0].i]:'Gleichstand',`${format(ranked[0].value)} ${name==='Verkäufe'?'Verkäufe':' '+name} pro Kalendertag`],
    ['Stärkster Kalendertag',bestDays.length===1?`Der ${bestDays[0].day}.`:`${bestDays.length} Tage gleichauf`,`${format(dayRank[0].value)} im Schnitt · ${bestDays[0].b.days} beobachtete Tage`],
    ['Bester einzelner Tag',maxActual?fmtDate(maxActual.date):'—',maxActual?`${format(maxActual[key])} · ${maxActual.count} Verkäufe${bestActual.filter(x=>Math.abs(x[key]-maxActual[key])<1e-8).length>1?' · mehrere Tage gleichauf':''}`:'']
  ].map(([label,value,sub])=>`<div class="metric"><div class="metric-label">${label}</div><div class="rhythm-value">${value}</div><div class="metric-sub">${sub}</div></div>`).join(''):'<div class="empty-state"><strong>Noch keine Verkäufe in diesem Zeitraum</strong><p>Wähle einen anderen Monat oder erfasse deinen ersten Verkauf.</p></div>';
  document.getElementById('rhythm-note').textContent=data.start?`${fmtDate(data.start)} bis ${fmtDate(data.end)} · ${data.count} Verkäufe. Offene und versendete Verkäufe nach Verkaufsdatum; Retouren und Stornos ausgeschlossen. ${data.monthly.length<3?'Noch wenig Vergleichsdaten: Das ist eine Momentaufnahme, keine belastbare Tendenz.':'Die Ergebnisse beschreiben deine bisherigen Verkäufe, keine Vorhersage.'}${data.excluded?' Einträge mit ungültigem oder zukünftigem Datum sind ausgeschlossen.':''}`:'Für diese Auswertung fehlen gültige Verkaufsdaten.';
  document.getElementById('rhythm-method').textContent='Verglichen wird der Durchschnitt pro beobachtetem Kalendertag, einschließlich Tagen ohne Verkauf. Der Zeitraum beginnt mit dem ersten erfassten Verkauf und endet heute. Fehlende Aufzeichnungen lassen sich nicht von Tagen ohne Verkauf unterscheiden. Zukünftige Tage und nicht existierende Daten (z. B. 31. Februar) zählen nicht mit. Der heutige Tag ist noch unvollständig. Gewinn = Umsatz minus zugeordnete Rohlingskosten, wie im Dashboard.';
  document.getElementById('rhythm-phase-caption').textContent=positive&&winners.length===1?`${phaseNames[winners[0].i]} liegt im ausgewählten Zeitraum vorn. Die unterschiedlich langen Monatsphasen werden pro Kalendertag verglichen.`:'Die Monatsphasen werden pro Kalendertag verglichen, nicht nach ihrer Gesamtsumme.';
  const style=getComputedStyle(document.documentElement),accent=style.getPropertyValue('--accent').trim(),text=style.getPropertyValue('--text2').trim(),grid=style.getPropertyValue('--border2').trim();
  const options={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${format(ctx.raw)} ${name==='Verkäufe'?'Verkäufe':''} / Tag`}}},scales:{x:{ticks:{color:text},grid:{display:false}},y:{beginAtZero:true,ticks:{color:text,callback:v=>format(v)},grid:{color:grid}}}};
  createChart('rhythmDayChart',{type:'bar',data:{labels:data.byDay.map((_,i)=>`${i+1}.`),datasets:[{label:`Ø ${name} pro Kalendertag`,data:data.byDay.map(avg),backgroundColor:accent,borderRadius:4}]},options:{...options,plugins:{...options.plugins,tooltip:{callbacks:{label:ctx=>`${format(ctx.raw)} / Tag · ${data.byDay[ctx.dataIndex].days} Beobachtungen`}}},scales:{...options.scales,x:{...options.scales.x,title:{display:true,text:'Tag im Monat',color:text},ticks:{color:text,autoSkip:true,maxTicksLimit:16}}}}});
  createChart('rhythmPhaseChart',{type:'bar',data:{labels:phaseNames.map((n,i)=>[n,phaseDates[i]]),datasets:[{label:`Ø ${name} pro Kalendertag`,data:data.phases.map(avg),backgroundColor:accent,borderRadius:6}]},options});
  const table=document.getElementById('rhythm-best-months');
  table.innerHTML=data.monthly.slice().reverse().map(m=>{
    const ranked=m.rows.filter(r=>r.count>0).sort((a,b)=>b[key]-a[key]||a.date.localeCompare(b.date)),best=ranked[0];
    const ties=best?ranked.filter(r=>Math.abs(r[key]-best[key])<1e-8):[];
    const daysInMonth=new Date(Date.UTC(+m.month.slice(0,4),+m.month.slice(5),0)).getUTCDate();
    const partial=m.days<daysInMonth||m.month===today.slice(0,7);
    return `<tr><th scope="row">${monthName(m.month)}${partial?'<span class="rhythm-partial">Teilmonat</span>':''}</th><td>${best?ties.map(x=>`${+x.date.slice(8)}.`).join(', '):'Keine Verkäufe'}</td><td>${best?format(best[key]):'—'}</td><td>${m.days} Tage</td></tr>`;
  }).join('')||'<tr><td colspan="4">Noch keine Daten vorhanden.</td></tr>';
  document.getElementById('rhythm-best-label').textContent=name+' am besten Tag';
  document.getElementById('rhythm-day-values').innerHTML=data.byDay.map((b,i)=>`<tr><th scope="row">${i+1}.</th><td>${b.days?format(avg(b)):'—'}</td><td>${b.days}</td></tr>`).join('');
  document.getElementById('rhythm-phase-values').innerHTML=data.phases.map((b,i)=>`<div class="summary-row"><span>${phaseNames[i]} <span class="muted">(${phaseDates[i]})</span></span><strong>${b.days?format(avg(b)):'—'}<small> pro Tag · ${b.days} Tage</small></strong></div>`).join('');
  document.getElementById('rhythmDayChart').setAttribute('aria-label',`Durchschnittlicher ${name} nach Tag im Monat. Alle Werte in der Tabelle unter dem Diagramm.`);
  document.getElementById('rhythmPhaseChart').setAttribute('aria-label',`Durchschnittlicher ${name} nach Monatsphase. Alle Werte unter dem Diagramm.`);
  document.getElementById('rhythm-chart-fallback').hidden=typeof Chart!=='undefined';
}
