const STORAGE_DB_NAME='vinted-tracker-db';
const STORAGE_DB_VERSION=1;
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
    const tx=db.transaction('kv','readonly');
    const req=tx.objectStore('kv').get(key);
    req.onsuccess=()=>resolve(req.result?.value);
    req.onerror=()=>resolve(undefined);
  });
}

async function dbSet(key,value){
  const db=await openStorageDB();
  if(!db)return false;
  return new Promise(resolve=>{
    const tx=db.transaction('kv','readwrite');
    tx.objectStore('kv').put({key,value});
    tx.oncomplete=()=>resolve(true);
    tx.onerror=()=>resolve(false);
  });
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

function saveData(){
  saveDataObject(DB);
}
