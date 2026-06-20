function isActiveSale(s){return s.status!=='storniert'&&s.status!=='retour'}
function realizedRevenue(s){return isActiveSale(s)?s.rev:0}
function realizedCost(s){return isActiveSale(s)?s.cost:0}
function profit(s){return +(realizedRevenue(s)-realizedCost(s)).toFixed(2)}
function margin(s){return realizedRevenue(s)>0?+((profit(s)/realizedRevenue(s))*100).toFixed(1):0}
function fmt(n){return '€'+(+n||0).toFixed(2).replace('.',',')}
function fmtDate(d){if(!d)return '—';return d.split('-').reverse().join('.')}
function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function filenameDate(){return new Date().toISOString().slice(0,10)}
function localDateISO(date=new Date()){
  const offset=date.getTimezoneOffset()*60000;
  return new Date(date.getTime()-offset).toISOString().slice(0,10);
}
function downloadFile(name,type,content){
  const blob=new Blob([content],{type});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.click();
  URL.revokeObjectURL(a.href);
}
