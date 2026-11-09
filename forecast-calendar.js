/* Forecast and calendar views. Read-only: these views never write to DB or storage. */
function renderForecastView(sales){
  const today=localDateISO(), key=today.slice(0,7), [year,month]=key.split('-').map(Number);
  const day=Number(today.slice(8)), totalDays=new Date(year,month,0).getDate();
  const active=sales.filter(s=>s.date?.slice(0,7)===key&&isActiveSale(s));
  const revenue=active.reduce((a,s)=>a+realizedRevenue(s),0), gain=active.reduce((a,s)=>a+profit(s),0);
  const elapsed=Math.max(1,day), remaining=Math.max(0,totalDays-day), pace=revenue/elapsed, gainPace=gain/elapsed;
  const forecast=revenue+pace*remaining, gainForecast=gain+gainPace*remaining;
  const fmtForecast=(v)=>fmt(Math.round(v*100)/100);
  const el=document.getElementById('forecast-summary'); if(!el)return;
  el.innerHTML=`<div class="metric"><div class="metric-label">Bisheriger Umsatz</div><div class="rhythm-value">${fmtForecast(revenue)}</div><div class="metric-sub">${active.length} Verkäufe bis ${day}. ${month}.</div></div><div class="metric"><div class="metric-label">Prognose Monatsende</div><div class="rhythm-value" style="color:var(--accent)">${fmtForecast(forecast)}</div><div class="metric-sub">bei ${fmtForecast(pace)} Umsatz pro Tag</div></div><div class="metric"><div class="metric-label">Gewinn-Prognose</div><div class="rhythm-value">${fmtForecast(gainForecast)}</div><div class="metric-sub">bisher ${fmtForecast(gain)} · ${fmtForecast(gainPace)} pro Tag</div></div>`;
  document.getElementById('forecast-note').textContent=active.length<5?'Noch wenige Verkäufe in diesem Monat. Die Prognose ist eine grobe Orientierung.':`Hochrechnung aus ${active.length} aktiven Verkäufen in ${new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(new Date(`${key}-01`))}. Tage ohne Verkauf werden als 0 € berücksichtigt.`;
  const goal=Number(document.getElementById('forecast-goal')?.value||0), goalText=document.getElementById('forecast-goal-text');
  if(goalText)goalText.textContent=goal?`${fmtForecast(forecast)} von ${fmtForecast(goal)} · ${Math.min(100,forecast/goal*100).toFixed(0)}%`:'';
  createChart('forecastChart',{type:'line',data:{labels:Array.from({length:totalDays},(_,i)=>`${i+1}.`),datasets:[{label:'Tatsächlich',data:Array.from({length:totalDays},(_,i)=>{const d=`${key}-${String(i+1).padStart(2,'0')}`;return i<day?active.filter(s=>s.date===d).reduce((a,s)=>a+realizedRevenue(s),0):null}),borderColor:'#007782',backgroundColor:'#007782',spanGaps:false,tension:.25},{label:'Prognose',data:Array.from({length:totalDays},(_,i)=>i<day?null:pace*i),borderColor:'#7F77DD',borderDash:[6,5],backgroundColor:'transparent',spanGaps:true,tension:0}],},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true,ticks:{callback:v=>'€'+v}},x:{ticks:{autoSkip:true,maxTicksLimit:12}}}}});
}

function renderCalendarView(sales){
  const input=document.getElementById('calendar-month'), key=input?.value||localDateISO().slice(0,7); if(input&&!input.value)input.value=key;
  const [year,month]=key.split('-').map(Number), days=new Date(year,month,0).getDate(), first=new Date(year,month-1,1), offset=(first.getDay()+6)%7;
  const dayData=Array.from({length:days},()=>({rev:0,profit:0,count:0}));
  sales.filter(s=>s.date?.slice(0,7)===key&&isActiveSale(s)).forEach(s=>{const d=+s.date.slice(8)-1; if(dayData[d]){dayData[d].rev+=realizedRevenue(s);dayData[d].profit+=profit(s);dayData[d].count++}});
  const names=['Mo','Di','Mi','Do','Fr','Sa','So'];
  document.getElementById('calendar-grid').innerHTML=names.map(n=>`<div class="calendar-weekday">${n}</div>`).join('')+Array(offset).fill('<div class="calendar-empty"></div>').join('')+dayData.map((d,i)=>`<div class="calendar-day ${d.count?'has-sales':''}" title="${d.count?`${d.count} Verkäufe · ${fmt(d.rev)}`:'Keine Verkäufe'}"><strong>${i+1}</strong>${d.count?`<span>${fmt(d.rev)}</span><small>${d.count} ${d.count===1?'Verkauf':'Verkäufe'}</small>`:'<small>–</small>'}</div>`).join('');
  const total=dayData.reduce((a,d)=>a+d.rev,0), best=dayData.map((d,i)=>({...d,i})).filter(d=>d.count).sort((a,b)=>b.rev-a.rev)[0];
  document.getElementById('calendar-summary').textContent=`${new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(first)} · ${fmt(total)} Umsatz · ${dayData.reduce((a,d)=>a+d.count,0)} Verkäufe · bester Tag: ${best?`${best.i+1}. (${fmt(best.rev)})`:'—'}`;
}
