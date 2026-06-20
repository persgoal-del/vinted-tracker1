// Firebase + lokale Fallback-Speicherung für den Vinted Tracker
// Läuft auf GitHub Pages und synchronisiert pro eingeloggtem Firebase-User.

const firebaseConfig = {
  apiKey: "AIzaSyBZ9Da1GiE4661W67MS-MEQ2gPNWKAk6I4",
  authDomain: "vinted-tracker-2958c.firebaseapp.com",
  projectId: "vinted-tracker-2958c",
  storageBucket: "vinted-tracker-2958c.firebasestorage.app",
  messagingSenderId: "684779553961",
  appId: "1:684779553961:web:e4af37ed9e9cb3e9cc55b8"
};

const STORAGE_DB_NAME='vinted-tracker-db';
const STORAGE_DB_VERSION=1;
const FIRESTORE_COLLECTION='users';
const FIRESTORE_DOC_PATH='data/app';

let storageDBPromise=null;
let storageFallback=false;
let firebaseApp=null;
let firebaseAuth=null;
let firebaseFirestore=null;
let currentUser=null;
let unsubscribeRemote=null;
let remoteReadyResolve=null;
let isApplyingRemote=false;
let lastRemoteUpdateAt=0;
let saveTimer=null;
let pendingSaveData=null;

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
    meta:{...(meta||{}),storage:'local'},
    snapshots:snapshots||[]
  };
}

async function loadLocalData(){
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
  await saveLocalDataObject(migrated);
  return migrated;
}

async function saveLocalDataObject(data){
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

function normalizeDataObject(data){
  const sales=Array.isArray(data?.sales)?data.sales.map(normalizeSale):INITIAL_SALES.map(normalizeSale);
  const expenses=Array.isArray(data?.expenses)?data.expenses.map(normalizeExpense):[];
  const products=buildProductsFromSales(sales,Array.isArray(data?.products)?data.products:null);
  return {
    sales,
    expenses,
    products,
    meta:{...(data?.meta||{}),storage:'firebase'},
    snapshots:Array.isArray(data?.snapshots)?data.snapshots:[]
  };
}

function getFirebaseDocRef(){
  if(!currentUser||!firebaseFirestore)return null;
  return firebaseFirestore.collection(FIRESTORE_COLLECTION).doc(currentUser.uid).collection('data').doc('app');
}

function initFirebaseIfPossible(){
  if(firebaseApp)return true;
  if(!window.firebase){
    console.warn('Firebase SDK fehlt. App nutzt lokale Speicherung.');
    return false;
  }
  firebaseApp=firebase.initializeApp(firebaseConfig);
  firebaseAuth=firebase.auth();
  firebaseFirestore=firebase.firestore();
  firebaseFirestore.enablePersistence({synchronizeTabs:true}).catch(()=>{});
  return true;
}

function ensureAuthOverlay(){
  if(document.getElementById('firebase-auth-overlay'))return;
  const overlay=document.createElement('div');
  overlay.id='firebase-auth-overlay';
  overlay.innerHTML=`
    <div class="firebase-auth-card">
      <h2>Vinted Tracker anmelden</h2>
      <p>Mit derselben E-Mail auf Mac und iPhone anmelden, dann synchronisieren sich alle Verkäufe automatisch.</p>
      <div id="firebase-auth-error"></div>
      <input id="firebase-email" type="email" autocomplete="email" placeholder="E-Mail">
      <input id="firebase-password" type="password" autocomplete="current-password" placeholder="Passwort, mindestens 6 Zeichen">
      <div class="firebase-auth-actions">
        <button class="btn btn-primary" id="firebase-login-btn">Einloggen</button>
        <button class="btn" id="firebase-register-btn">Konto erstellen</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('firebase-login-btn').onclick=()=>firebaseLogin(false);
  document.getElementById('firebase-register-btn').onclick=()=>firebaseLogin(true);
  document.getElementById('firebase-password').addEventListener('keydown',e=>{if(e.key==='Enter')firebaseLogin(false)});
}

function showAuthOverlay(show=true){
  ensureAuthOverlay();
  document.getElementById('firebase-auth-overlay').style.display=show?'flex':'none';
}

function setAuthError(message){
  const target=document.getElementById('firebase-auth-error');
  if(target)target.textContent=message||'';
}

function friendlyFirebaseError(error){
  const code=error?.code||'';
  if(code.includes('invalid-email'))return 'Bitte eine gültige E-Mail eingeben.';
  if(code.includes('user-not-found')||code.includes('wrong-password')||code.includes('invalid-credential'))return 'E-Mail oder Passwort stimmt nicht.';
  if(code.includes('email-already-in-use'))return 'Diese E-Mail ist schon registriert. Bitte einloggen.';
  if(code.includes('weak-password'))return 'Das Passwort muss mindestens 6 Zeichen haben.';
  if(code.includes('network'))return 'Keine Verbindung. Bitte Internet prüfen.';
  return error?.message||'Anmeldung nicht möglich.';
}

async function firebaseLogin(register){
  setAuthError('');
  const email=document.getElementById('firebase-email').value.trim();
  const password=document.getElementById('firebase-password').value;
  try{
    if(register){
      await firebaseAuth.createUserWithEmailAndPassword(email,password);
    }else{
      await firebaseAuth.signInWithEmailAndPassword(email,password);
    }
  }catch(error){
    setAuthError(friendlyFirebaseError(error));
  }
}

function addAuthBar(){
  if(document.getElementById('firebase-user-bar'))return;
  const topbar=document.querySelector('.topbar .toolbar')||document.querySelector('.topbar');
  if(!topbar)return;
  const bar=document.createElement('span');
  bar.id='firebase-user-bar';
  bar.style.fontSize='12px';
  bar.style.color='var(--text3)';
  bar.style.display='inline-flex';
  bar.style.alignItems='center';
  bar.style.gap='8px';
  bar.innerHTML=`<span id="firebase-user-email"></span><button class="btn" id="firebase-logout-btn" type="button">Logout</button>`;
  topbar.appendChild(bar);
  document.getElementById('firebase-logout-btn').onclick=()=>firebaseAuth.signOut();
}

function updateAuthBar(){
  addAuthBar();
  const email=document.getElementById('firebase-user-email');
  if(email)email.textContent=currentUser?.email?`Sync: ${currentUser.email}`:'Lokaler Modus';
}

function waitForFirebaseUser(){
  if(!initFirebaseIfPossible())return Promise.resolve(null);
  ensureAuthOverlay();
  return new Promise(resolve=>{
    firebaseAuth.onAuthStateChanged(user=>{
      currentUser=user;
      updateAuthBar();
      if(user){
        showAuthOverlay(false);
        resolve(user);
      }else{
        if(unsubscribeRemote){unsubscribeRemote();unsubscribeRemote=null;}
        showAuthOverlay(true);
      }
    });
  });
}

async function loadRemoteOrCreateFromLocal(){
  const localData=await loadLocalData();
  await waitForFirebaseUser();
  if(!currentUser)return localData;

  const ref=getFirebaseDocRef();
  const snap=await ref.get();
  if(snap.exists){
    const remote=normalizeDataObject(snap.data());
    await saveLocalDataObject(remote);
    startRemoteListener();
    return remote;
  }

  const firstData=normalizeDataObject(localData);
  firstData.meta={...(firstData.meta||{}),storage:'firebase',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  await ref.set(firstData,{merge:true});
  await saveLocalDataObject(firstData);
  startRemoteListener();
  return firstData;
}

function startRemoteListener(){
  if(unsubscribeRemote)unsubscribeRemote();
  const ref=getFirebaseDocRef();
  if(!ref)return;
  unsubscribeRemote=ref.onSnapshot(snap=>{
    if(!snap.exists)return;
    const remote=normalizeDataObject(snap.data());
    const updatedAt=Date.parse(remote.meta?.updatedAt||remote.meta?.createdAt||0)||0;
    if(updatedAt&&updatedAt<lastRemoteUpdateAt)return;
    lastRemoteUpdateAt=updatedAt||Date.now();
    saveLocalDataObject(remote);
    if(typeof DB!=='undefined'){
      isApplyingRemote=true;
      DB=remote;
      isApplyingRemote=false;
      if(typeof renderDashboard==='function')renderDashboard();
    }
  },error=>console.warn('Firebase Sync Fehler',error));
}

async function loadData(){
  if(!window.firebase){
    const data=await loadLocalData();
    return data;
  }
  try{
    return await loadRemoteOrCreateFromLocal();
  }catch(error){
    console.warn('Firebase nicht erreichbar, nutze lokale Daten:',error);
    const data=await loadLocalData();
    data.meta={...(data.meta||{}),storage:'local-offline'};
    return data;
  }
}

async function saveDataObject(data){
  await saveLocalDataObject(data);
  if(!currentUser||!firebaseFirestore||isApplyingRemote)return;
  pendingSaveData=normalizeDataObject(data);
  pendingSaveData.meta={...(pendingSaveData.meta||{}),storage:'firebase',updatedAt:new Date().toISOString(),updatedBy:currentUser.uid};
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    const toSave=pendingSaveData;
    pendingSaveData=null;
    try{
      await getFirebaseDocRef().set(toSave,{merge:true});
    }catch(error){
      console.warn('Speichern in Firebase fehlgeschlagen:',error);
      const status=document.getElementById('backup-status');
      if(status)status.textContent='Offline gespeichert – Sync folgt später';
    }
  },250);
}

function saveData(){
  saveDataObject(DB);
}
