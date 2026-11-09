function exportVintedBackup(){
  const payload={schema:1,app:'vinted-tracker',exportedAt:new Date().toISOString(),data:cloneData(DB)};
  downloadFile(`vinted-backup-${localDateISO()}.json`,'application/json;charset=utf-8',JSON.stringify(payload,null,2));
  appToast('Backup heruntergeladen','ti-download');
}

function validateVintedBackup(payload){
  const data=payload?.data||payload;
  if(!data||typeof data!=='object'||!Array.isArray(data.sales)||!Array.isArray(data.expenses)||!Array.isArray(data.products))return null;
  if(data.sales.some(s=>!s||typeof s!=='object'||typeof s.date!=='string'||!Number.isFinite(+s.rev)))return null;
  if(data.expenses.some(e=>!e||typeof e!=='object'))return null;
  if(data.products.some(p=>!p||typeof p!=='object'||typeof p.name!=='string'))return null;
  return {sales:data.sales,expenses:data.expenses,products:data.products,meta:data.meta||{},snapshots:Array.isArray(data.snapshots)?data.snapshots:[]};
}

function importVintedBackup(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const payload=JSON.parse(reader.result), data=validateVintedBackup(payload);
      if(!data){appToast('Backup konnte nicht geprüft werden','ti-alert-triangle');return;}
      const when=payload.exportedAt?new Date(payload.exportedAt).toLocaleString('de-DE'):'unbekanntem Datum';
      if(!confirm(`Backup vom ${when} mit ${data.sales.length} Verkäufen wiederherstellen? Deine aktuellen Daten werden ersetzt.`))return;
      saveSnapshot('Vor Backup-Wiederherstellung');
      DB=cloneData(data); saveData(); refreshCurrentView();
      appToast(`${data.sales.length} Verkäufe wiederhergestellt`,'ti-check');
    }catch(err){console.error('Backup-Import fehlgeschlagen',err);appToast('Backup-Datei ist ungültig','ti-alert-triangle');}
  };
  reader.readAsText(file);
}

function chooseVintedBackup(){document.getElementById('backup-file')?.click()}
