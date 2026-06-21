// Firebase + lokale Fallback-Speicherung für den Vinted Tracker
// Synchronisiert Verkäufe, Ausgaben, Produkte, Meta und Snapshots pro Firebase-User.

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
const FIRESTORE_DOC_COLLECTION='data';
const FIRESTORE_DOC_ID='app';

let storageDBPromise=null;
let storageFallback=false;
let firebaseApp=null;
let firebaseAuth=null;
let firebaseFirestore=null;
let currentUser=null;
let unsubscribeRemote=null;
let remoteLoaded=false;
let isApplyingRemote=false;
let pendingSaveTimer=null;
let pendingSaveData=null;
let authReadyPromise=null;

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
    meta:{...(meta||{}),storage:'localStorage'},
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

function serializeDataObject(data){
  return {
    sales: data.sales||[],
    expenses: data.expenses||[],
    products: data.products||[],
    meta: {...(data.meta||{}),storage:'firebase',updatedAt:new Date().toISOString()},
    snapshots: data.snapshots||[]
  };
}

function getFirebaseDocRef(){
  if(!currentUser||!firebaseFirestore)return null;
  return firebaseFirestore.collection(FIRESTORE_COLLECTION).doc(currentUser.uid).collection(FIRESTORE_DOC_COLLECTION).doc(FIRESTORE_DOC_ID);
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
      <div class="firebase-auth-logo">PH</div>
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

function installUserBadge(){
  if(document.getElementById('firebase-user-badge'))return;
  const bar=document.querySelector('.topbar');
  if(!bar)return;
  const badge=document.createElement('button');
  badge.id='firebase-user-badge';
  badge.className='btn firebase-user-badge';
  badge.type='button';
  badge.onclick=()=>firebaseAuth?.signOut();
  badge.title='Abmelden';
  bar.appendChild(badge);
}

function updateUserBadge(){
  installUserBadge();
  const badge=document.getElementById('firebase-user-badge');
  if(badge)badge.innerHTML=`<i class="ti ti-cloud-check"></i> ${currentUser?.email||'Online'}`;
}

function refreshAfterRemote(){
  if(typeof refreshCurrentView==='function')refreshCurrentView();
  else if(typeof renderDashboard==='function')renderDashboard();
  if(typeof updateMobileNavIndicator==='function')updateMobileNavIndicator();
}

async function waitForFirebaseAuth(){
  if(!initFirebaseIfPossible())return null;
  if(authReadyPromise)return authReadyPromise;
  ensureAuthOverlay();
  authReadyPromise=new Promise(resolve=>{
    firebaseAuth.onAuthStateChanged(user=>{
      currentUser=user;
      if(user){
        showAuthOverlay(false);
        updateUserBadge();
        resolve(user);
      }else{
        showAuthOverlay(true);
      }
    });
  });
  return authReadyPromise;
}

async function loadRemoteData(){
  const ref=getFirebaseDocRef();
  if(!ref)return null;
  const doc=await ref.get();
  if(!doc.exists)return null;
  return normalizeDataObject(doc.data());
}

function subscribeRemote(){
  if(unsubscribeRemote)unsubscribeRemote();
  const ref=getFirebaseDocRef();
  if(!ref)return;
  unsubscribeRemote=ref.onSnapshot(async doc=>{
    if(!doc.exists||!remoteLoaded)return;
    if(doc.metadata.hasPendingWrites)return;
    const remote=normalizeDataObject(doc.data());
    isApplyingRemote=true;
    window.DB=DB=remote;
    await saveLocalDataObject(remote);
    isApplyingRemote=false;
    refreshAfterRemote();
  },err=>console.error('Firebase Sync Fehler',err));
}

async function loadData(){
  const local=await loadLocalData();
  if(!initFirebaseIfPossible())return local;
  await waitForFirebaseAuth();
  const ref=getFirebaseDocRef();
  if(!ref)return local;
  let remote=await loadRemoteData();
  if(!remote){
    remote=normalizeDataObject(local);
    await ref.set(serializeDataObject(remote),{merge:true});
  }
  remoteLoaded=true;
  await saveLocalDataObject(remote);
  subscribeRemote();
  return remote;
}

async function saveDataObject(data){
  const normalized=normalizeDataObject(data);
  await saveLocalDataObject(normalized);
  if(!initFirebaseIfPossible()||!currentUser)return;
  const ref=getFirebaseDocRef();
  if(ref)await ref.set(serializeDataObject(normalized),{merge:true});
}

function flushPendingSave(){
  if(!pendingSaveData)return;
  const data=pendingSaveData;
  pendingSaveData=null;
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=null;
  saveDataObject(data).catch(err=>console.error('Speichern fehlgeschlagen',err));
}

function saveData(){
  if(isApplyingRemote)return;
  pendingSaveData=JSON.parse(JSON.stringify(DB));
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer=setTimeout(flushPendingSave,120);
}

window.addEventListener('beforeunload',flushPendingSave);
