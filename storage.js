const STORAGE_DB_NAME='vinted-tracker-db';
const STORAGE_DB_VERSION=1;
let storageDBPromise=null;
let storageFallback=false;


const firebaseConfig = {
  apiKey: "AIzaSyBZ9Da1GiE4661W67MS-MEQ2gPNWKAk6I4",
  authDomain: "vinted-tracker-2958c.firebaseapp.com",
  projectId: "vinted-tracker-2958c",
  storageBucket: "vinted-tracker-2958c.firebasestorage.app",
  messagingSenderId: "684779553961",
  appId: "1:684779553961:web:e4af37ed9e9cb3e9cc55b8"
};

let firebaseReady=false;
let firebaseApp=null;
let firebaseAuth=null;
let firebaseDb=null;
let currentUser=null;

function initFirebase(){
  if(firebaseReady)return true;
  if(!window.firebase || !firebase.initializeApp)return false;
  try{
    firebaseApp=firebase.apps?.length?firebase.app():firebase.initializeApp(firebaseConfig);
    firebaseAuth=firebase.auth();
    firebaseDb=firebase.firestore();
    firebaseReady=true;
    return true;
  }catch(err){
    console.error('Firebase Initialisierung fehlgeschlagen',err);
    return false;
  }
}

function injectAuthStyles(){
  if(document.getElementById('firebase-auth-styles'))return;
  const style=document.createElement('style');
  style.id='firebase-auth-styles';
  style.textContent=`
    .firebase-auth-screen{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:linear-gradient(135deg,#e8f5ee,#f8f7f4);padding:22px;color:#1a1a18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .firebase-auth-card{width:min(430px,100%);background:rgba(255,255,255,.88);border:1px solid rgba(0,0,0,.08);border-radius:24px;padding:26px;box-shadow:0 24px 70px rgba(0,0,0,.16)}
    .firebase-auth-logo{width:54px;height:54px;border-radius:17px;background:#007782;color:white;display:grid;place-items:center;font-weight:850;margin-bottom:14px}
    .firebase-auth-card h1{font-size:22px;margin:0 0 6px}.firebase-auth-card p{margin:0 0 18px;color:#6b6b67;font-size:14px}
    .firebase-auth-card label{font-size:12px;color:#6b6b67;margin:10px 0 5px;display:block}.firebase-auth-card input{width:100%;border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:12px;font-size:15px;background:#fff}
    .firebase-auth-actions{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}.firebase-auth-actions button{border:0;border-radius:12px;padding:11px 14px;font-size:14px;cursor:pointer}.firebase-auth-primary{background:#007782;color:white}.firebase-auth-secondary{background:#eef2f2;color:#1a1a18}.firebase-auth-error{color:#b42318;font-size:13px;margin-top:12px;min-height:18px}
    .firebase-user-bar{position:fixed;right:14px;bottom:14px;z-index:9000;background:rgba(255,255,255,.92);border:1px solid rgba(0,0,0,.08);border-radius:999px;padding:8px 10px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 28px rgba(0,0,0,.12);font-size:12px;color:#555}.firebase-user-bar button{border:0;background:#eef2f2;border-radius:999px;padding:6px 9px;cursor:pointer;font-size:12px}
  `;
  document.head.appendChild(style);
}

function showAuthScreen(){
  injectAuthStyles();
  if(document.getElementById('firebase-auth-screen'))return;
  const el=document.createElement('div');
  el.id='firebase-auth-screen';
  el.className='firebase-auth-screen';
  el.innerHTML=`
    <div class="firebase-auth-card">
      <div class="firebase-auth-logo">PH</div>
      <h1>Vinted Tracker</h1>
      <p>Melde dich an, damit deine Daten auf Mac und Handy synchron bleiben.</p>
      <label>E-Mail</label><input id="firebase-email" type="email" autocomplete="email" placeholder="deine@email.de">
      <label>Passwort</label><input id="firebase-password" type="password" autocomplete="current-password" placeholder="mindestens 6 Zeichen">
      <div class="firebase-auth-actions">
        <button class="firebase-auth-primary" id="firebase-login-btn">Anmelden</button>
        <button class="firebase-auth-secondary" id="firebase-register-btn">Konto erstellen</button>
      </div>
      <div id="firebase-auth-error" class="firebase-auth-error"></div>
    </div>`;
  document.body.appendChild(el);
  const email=el.querySelector('#firebase-email');
  const pass=el.querySelector('#firebase-password');
  const error=el.querySelector('#firebase-auth-error');
  async function run(mode){
    error.textContent='';
    try{
      if(mode==='login')await firebaseAuth.signInWithEmailAndPassword(email.value.trim(),pass.value);
      else await firebaseAuth.createUserWithEmailAndPassword(email.value.trim(),pass.value);
    }catch(e){error.textContent=e?.message||'Anmeldung fehlgeschlagen';}
  }
  el.querySelector('#firebase-login-btn').onclick=()=>run('login');
  el.querySelector('#firebase-register-btn').onclick=()=>run('register');
  pass.addEventListener('keydown',e=>{if(e.key==='Enter')run('login')});
}

function hideAuthScreen(){document.getElementById('firebase-auth-screen')?.remove();}

function showUserBar(user){
  if(document.getElementById('firebase-user-bar'))return;
  const bar=document.createElement('div');
  bar.id='firebase-user-bar';
  bar.className='firebase-user-bar';
  bar.innerHTML=`<span>Sync aktiv</span><button title="Abmelden">Abmelden</button>`;
  bar.querySelector('button').onclick=()=>firebaseAuth.signOut().then(()=>location.reload());
  document.body.appendChild(bar);
}

function waitForFirebaseUser(){
  if(!initFirebase())return Promise.resolve(null);
  return new Promise(resolve=>{
    const unsub=firebaseAuth.onAuthStateChanged(user=>{
      if(user){
        currentUser=user;
        hideAuthScreen();
        showUserBar(user);
        unsub();
        resolve(user);
      }else{
        showAuthScreen();
      }
    });
  });
}

function userDocRef(){
  if(!firebaseReady||!currentUser)return null;
  return firebaseDb.collection('users').doc(currentUser.uid).collection('app').doc('data');
}

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
  const user=await waitForFirebaseUser();
  if(user){
    try{
      const snap=await userDocRef().get();
      if(snap.exists){
        const stored=snap.data()||{};
        const sales=(stored.sales||INITIAL_SALES).map(normalizeSale);
        const expenses=(stored.expenses||[]).map(normalizeExpense);
        const products=buildProductsFromSales(sales,stored.products);
        const meta={...(stored.meta||{}),storage:'firebase'};
        const snapshots=stored.snapshots||[];
        const data={sales,expenses,products,meta,snapshots};
        await saveLocalBackup(data);
        return data;
      }
      const migrated=await loadLocalDataOnly();
      migrated.meta={...(migrated.meta||{}),storage:'firebase',migratedAt:new Date().toISOString()};
      await saveDataObject(migrated);
      return migrated;
    }catch(err){
      console.error('Firebase Laden fehlgeschlagen, lokale Daten werden genutzt',err);
    }
  }
  return loadLocalDataOnly();
}

async function loadLocalDataOnly(){
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
    return {sales,expenses,products,meta:{...meta,storage:meta.storage||'indexeddb'},snapshots};
  }
  const migrated=loadFromLocalStorage();
  await saveLocalBackup(migrated);
  return migrated;
}

async function saveLocalBackup(data){
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

async function saveDataObject(data){
  const cleanData={
    sales:data.sales||[],
    expenses:data.expenses||[],
    products:data.products||[],
    meta:{...(data.meta||{}),storage:currentUser?'firebase':'indexeddb',updatedAt:new Date().toISOString()},
    snapshots:data.snapshots||[]
  };
  await saveLocalBackup(cleanData);
  if(currentUser&&initFirebase()){
    await userDocRef().set(cleanData,{merge:true});
  }
}

let pendingSaveTimer=null;
let pendingSaveData=null;

function flushPendingSave(){
  if(!pendingSaveData)return;
  const data=pendingSaveData;
  pendingSaveData=null;
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=null;
  saveDataObject(data).catch(err=>console.error('Speichern fehlgeschlagen',err));
}

function saveData(){
  pendingSaveData=JSON.parse(JSON.stringify(DB));
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=setTimeout(flushPendingSave,120);
}

window.addEventListener('beforeunload',flushPendingSave);
