const WIDGET_DB_NAME='vinted-tracker-db';
const WIDGET_DB_VERSION=1;

function widgetFmt(n){return '€'+(+n||0).toFixed(2).replace('.',',')}
function widgetDateISO(date=new Date()){
  const offset=date.getTimezoneOffset()*60000;
  return new Date(date.getTime()-offset).toISOString().slice(0,10);
}
function widgetActive(s){return s.status!=='storniert'&&s.status!=='retour'}
function widgetRevenue(s){return widgetActive(s)?(+s.rev||0):0}
function widgetCost(s){return widgetActive(s)?(+s.cost||0):0}
function widgetProfit(s){return +(widgetRevenue(s)-widgetCost(s)).toFixed(2)}
function widgetJSON(value,fallback){try{return value?JSON.parse(value):fallback}catch{return fallback}}

function openWidgetDB(){
  if(!('indexedDB' in window))return Promise.resolve(null);
  return new Promise(resolve=>{
    const req=indexedDB.open(WIDGET_DB_NAME,WIDGET_DB_VERSION);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>resolve(null);
    req.onupgradeneeded=()=>resolve(null);
  });
}

async function widgetGet(db,key){
  if(!db)return undefined;
  return new Promise(resolve=>{
    const tx=db.transaction('kv','readonly');
    const req=tx.objectStore('kv').get(key);
    req.onsuccess=()=>resolve(req.result?.value);
    req.onerror=()=>resolve(undefined);
  });
}

async function loadWidgetData(){
  const db=await openWidgetDB();
  if(db){
    const sales=await widgetGet(db,'sales');
    const expenses=await widgetGet(db,'expenses');
    const meta=await widgetGet(db,'meta');
    return {sales:sales||[],expenses:expenses||[],meta:meta||{}};
  }
  return {
    sales:widgetJSON(localStorage.getItem('vinted_sales'),[]),
    expenses:widgetJSON(localStorage.getItem('vinted_expenses'),[]),
    meta:widgetJSON(localStorage.getItem('vinted_meta'),{})
  };
}

function renderWidget(data){
  const sales=(data.sales||[]).filter(widgetActive);
  const today=widgetDateISO();
  const month=today.slice(0,7);
  const todaySales=sales.filter(s=>s.date===today);
  const monthSales=sales.filter(s=>s.date&&s.date.slice(0,7)===month);
  const open=(data.sales||[]).filter(s=>s.status==='offen');
  const todayRev=todaySales.reduce((a,s)=>a+widgetRevenue(s),0);
  const todayProfit=todaySales.reduce((a,s)=>a+widgetProfit(s),0);
  const monthRev=monthSales.reduce((a,s)=>a+widgetRevenue(s),0);
  const monthProfit=monthSales.reduce((a,s)=>a+widgetProfit(s),0);
  const root=document.getElementById('widget-root');
  root.innerHTML=`
    <section class="widget-card">
      <div class="widget-head">
        <div>
          <div class="widget-title">Vinted</div>
          <div class="widget-sub">Heute</div>
        </div>
        <button class="widget-refresh" onclick="initWidget()" aria-label="Aktualisieren"><i class="ti ti-refresh"></i></button>
      </div>
      <div class="widget-main-value">${widgetFmt(todayRev)}</div>
      <div class="widget-main-sub">${todaySales.length} Verkäufe · Gewinn ${widgetFmt(todayProfit)}</div>
      <div class="widget-grid">
        <div><span>Offen</span><strong>${open.length}</strong></div>
        <div><span>Monat</span><strong>${widgetFmt(monthRev)}</strong></div>
        <div><span>Gewinn</span><strong>${widgetFmt(monthProfit)}</strong></div>
      </div>
      <button class="widget-open" onclick="location.href='./index.html'">App öffnen</button>
    </section>`;
}

async function initWidget(){
  renderWidget(await loadWidgetData());
}

initWidget();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)initWidget()});
