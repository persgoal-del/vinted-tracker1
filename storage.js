const STORAGE_DB_NAME='vinted-tracker-db';
const STORAGE_DB_VERSION=2;
let storageDBPromise=null;
let storageFallback=false;

function safeJSON(value,fallback){
  try{return value?JSON.parse(value):fallback}catch{return fallback}
}

function openStorageDB(){
  if(!('indexedDB' in window)){storageFallback=true;return Promise.resolve(null)}
  if(storageDBPromise)return storageDBPromise;
  storageDBPromise=new Promise((resolve)=>{
    const req=indexedDB.open(STORAGE_DB_NAME,STORAGE_DB_VERSION);
    req.onupgradeneeded=()=> {
      const db=req.result;
      if(!db.objectStoreNames.contains('kv'))db.createObjectStore('kv',{keyPath:'key'});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>{storageFallback=true;resolve(null)};
  });
  return storageDBPromise;
}

async function dbGet(key){
  const db=await openStorageDB();
  if(!db)return undefined;
  return new Promise(resolve=>{
    try{
      const tx=db.transaction('kv','readonly');
      const req=tx.objectStore('kv').get(key);
      req.onsuccess=()=>resolve(req.result?.value);
      req.onerror=()=>resolve(undefined);
    }catch(err){
      notifyStorageError(err);
      resolve(undefined);
    }
  });
}

async function dbSet(key,value){
  const db=await openStorageDB();
  if(!db)return false;
  return new Promise(resolve=>{
    try{
      const tx=db.transaction('kv','readwrite');
      tx.objectStore('kv').put({key,value});
      tx.oncomplete=()=>resolve(true);
      tx.onerror=()=>{notifyStorageError(tx.error);resolve(false)};
    }catch(err){
      notifyStorageError(err);
      resolve(false);
    }
  });
}

// Wird aufgerufen, wenn ein Speichervorgang fehlschlägt, damit das (früher stille)
// Scheitern jetzt sichtbar gemeldet wird, statt Daten unbemerkt zu verlieren.
function notifyStorageError(err){
  console.error('Speichern fehlgeschlagen',err);
  if(typeof window!=='undefined'&&typeof window.appToast==='function'){
    window.appToast('Speichern fehlgeschlagen — bitte Seite neu laden','ti-alert-triangle');
  }
}

function buildProductsFromSales(sales,existingProducts){
  const fromSales=[...new Set((sales||INITIAL_SALES).map(x=>cleanProductName(x.art)))].map(name=>({
    name,
    category:expCatForProduct(name)||cat(name),
    cost:+((sales||INITIAL_SALES).find(x=>cleanProductName(x.art)===name)?.cost)||0,
    active:true
  }));
  const products=(existingProducts||[...DEFAULT_PRODUCTS,...fromSales]).map(normalizeProduct).filter(p=>p.name);
  return [...new Map(products.map(p=>[p.name,p])).values()];
}

function loadFromLocalStorage(){
  const sales=safeJSON(localStorage.getItem('vinted_sales'),null);
  const expenses=safeJSON(localStorage.getItem('vinted_expenses'),[]);
  const products=safeJSON(localStorage.getItem('vinted_products'),null);
  const meta=safeJSON(localStorage.getItem('vinted_meta'),{});
  const snapshots=safeJSON(localStorage.getItem('vinted_snapshots'),[]);
  const normalizedSales=(sales||INITIAL_SALES).map(normalizeSale);
  return {
    sales:normalizedSales,
    expenses:(expenses||[]).map(normalizeExpense),
    products:buildProductsFromSales(normalizedSales,products),
    meta:{...(meta||{}),storage:'indexeddb'},
    snapshots:snapshots||[]
  };
}

async function loadData(){
  const db=await openStorageDB();
  if(!db){
    const data=loadFromLocalStorage();
    data.meta.storage='localStorage-fallback';
    return data;
  }
  const storedSales=await dbGet('sales');
  if(storedSales){
    const sales=storedSales.map(normalizeSale);
    const expenses=((await dbGet('expenses'))||[]).map(normalizeExpense);
    const products=buildProductsFromSales(sales,await dbGet('products'));
    const meta=(await dbGet('meta'))||{};
    const snapshots=(await dbGet('snapshots'))||[];
    return {sales,expenses,products,meta:{...meta,storage:'indexeddb'},snapshots};
  }
  const migrated=loadFromLocalStorage();
  await saveDataObject(migrated);
  return migrated;
}

async function saveDataObject(data){
  const db=await openStorageDB();
  if(!db){
    localStorage.setItem('vinted_sales',JSON.stringify(data.sales));
    localStorage.setItem('vinted_expenses',JSON.stringify(data.expenses));
    localStorage.setItem('vinted_products',JSON.stringify(data.products));
    localStorage.setItem('vinted_meta',JSON.stringify(data.meta||{}));
    localStorage.setItem('vinted_snapshots',JSON.stringify(data.snapshots||[]));
    return;
  }
  await Promise.all([
    dbSet('sales',data.sales),
    dbSet('expenses',data.expenses),
    dbSet('products',data.products),
    dbSet('meta',data.meta||{}),
    dbSet('snapshots',data.snapshots||[])
  ]);
}

let pendingSaveTimer=null;
let pendingSaveData=null;

function flushPendingSave(){
  if(!pendingSaveData)return;
  const data=pendingSaveData;
  pendingSaveData=null;
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=null;
  saveDataObject(data).catch(err=>notifyStorageError(err));
}

function saveData(){
  pendingSaveData=JSON.parse(JSON.stringify(DB));
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=setTimeout(flushPendingSave,120);
}

window.addEventListener('beforeunload',flushPendingSave);
