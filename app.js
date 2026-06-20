const PRODUCTS_CATS = {
  'Hose':'Hose','hose':'Hose','Hose ':'Hose',
  'Tshirt Saint Tropez':'Tshirt ST','Tshirt Saint Tropez Navy':'Tshirt ST Navy','Tshirt Saint Tropez Schwarz':'Tshirt ST Schwarz',
  "Tshirt Cap d'Antebes":"Tshirt Cap d'Antebes",
  'Tshirt Monaco':'Tshirt Monaco','Tshirt Monaco Dolce Vita':'Tshirt Monaco DV',
  'Tshirt Monaco Heliport Navy':'Tshirt Monaco Heliport','Tshirt Monaco Heliport':'Tshirt Monaco Heliport','Tshirt Moanco Heliport':'Tshirt Monaco Heliport',
  'Tshirt Dolce Vita navyblau':'Tshirt Dolce Vita',
  'Pullover Miami Collection':'Pullover Miami',
  'Armband mit Karabiner Navyblau':'Armband Karabiner',
  'Armband mit Muschel und Stern':'Armband Muschel',
  'Tshirt Saint Monaco Capd\'Antebes':'Tshirt Bundle',
  'Hose + Tshirt':'Hose + Tshirt Bundle',
};

function cat(name){return PRODUCTS_CATS[name]||(name||'').trim()||'Sonstiges'}
function cleanProductName(name){return (name||'').replace('Moanco','Monaco').trim()}
const DEFAULT_PRODUCTS = [
  {name:'Hose',category:'Hose',cost:7,active:true},
  {name:'Tshirt Saint Tropez',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Saint Tropez Navy',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Saint Tropez Schwarz',category:'Tshirt',cost:8.2,active:true},
  {name:"Tshirt Cap d'Antebes",category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Monaco',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Monaco Dolce Vita',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Monaco Heliport Navy',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Monaco Heliport',category:'Tshirt',cost:8.2,active:true},
  {name:'Tshirt Dolce Vita navyblau',category:'Tshirt',cost:8.2,active:true},
  {name:'Pullover Miami Collection',category:'Pullover',cost:13.19,active:true},
  {name:'Armband mit Karabiner Navyblau',category:'Armband',cost:1.12,active:true},
  {name:'Armband mit Muschel und Stern',category:'Armband',cost:1.88,active:true},
  {name:'Hose + Tshirt',category:'Bundle',cost:15.2,active:true},
  {name:'Sonstiges',category:'Sonstiges',cost:0,active:true}
];

function normalizeProduct(p){
  return {
    name:cleanProductName(p.name||p.art||''),
    category:p.category||expCatForProduct(p.name||p.art)||cat(p.name||p.art)||'Sonstiges',
    cost:+p.cost||0,
    active:p.active!==false
  };
}

const INITIAL_SALES = [
  {id:1,date:'2026-03-07',ship:'2026-03-09',art:'Hose',rev:20,cost:8.28,status:'versendet'},
  {id:2,date:'2026-03-07',ship:'2026-03-09',art:'Hose',rev:18,cost:8.28,status:'versendet'},
  {id:3,date:'2026-03-07',ship:'2026-03-09',art:'Hose',rev:19,cost:8.28,status:'versendet'},
  {id:4,date:'2026-03-07',ship:'2026-03-09',art:'Hose',rev:19,cost:8.28,status:'versendet'},
  {id:5,date:'2026-03-07',ship:'2026-03-09',art:'Hose',rev:22,cost:8.28,status:'versendet'},
  {id:6,date:'2026-03-07',ship:'2026-03-14',art:'Armband mit Karabiner Navyblau',rev:11,cost:1.12,status:'versendet'},
  {id:7,date:'2026-03-07',ship:'2026-03-14',art:'Armband mit Karabiner Navyblau',rev:8.99,cost:1.12,status:'versendet'},
  {id:8,date:'2026-03-08',ship:'2026-03-14',art:'Armband mit Karabiner Navyblau',rev:8,cost:1.12,status:'versendet'},
  {id:9,date:'2026-03-08',ship:'2026-03-14',art:'Armband mit Karabiner Navyblau',rev:12,cost:1.12,status:'versendet'},
  {id:10,date:'2026-03-09',ship:'2026-03-09',art:'Hose',rev:20.5,cost:8.28,status:'versendet'},
  {id:11,date:'2026-03-10',ship:'2026-03-11',art:'Hose',rev:23,cost:8.28,status:'versendet'},
  {id:12,date:'2026-03-10',ship:'2026-03-11',art:'Hose',rev:21,cost:8.28,status:'versendet'},
  {id:13,date:'2026-03-10',ship:'2026-03-18',art:'Armband mit Muschel und Stern',rev:12.85,cost:1.88,status:'versendet'},
  {id:14,date:'2026-03-10',ship:'2026-03-14',art:'Hose',rev:20.35,cost:8.28,status:'versendet'},
  {id:15,date:'2026-03-11',ship:'2026-03-16',art:'Armband mit Karabiner Navyblau',rev:10,cost:1.12,status:'versendet'},
  {id:16,date:'2026-03-11',ship:'2026-03-14',art:'Hose',rev:23,cost:8.28,status:'versendet'},
  {id:17,date:'2026-03-11',ship:'2026-03-16',art:'Armband mit Karabiner Navyblau',rev:10.5,cost:1.12,status:'versendet'},
  {id:18,date:'2026-03-11',ship:'2026-03-16',art:'Hose',rev:16.5,cost:8.28,status:'versendet'},
  {id:19,date:'2026-03-11',ship:'2026-03-18',art:'Hose',rev:22.5,cost:8.28,status:'versendet'},
  {id:20,date:'2026-03-12',ship:'2026-03-18',art:'Hose',rev:21,cost:7.88,status:'versendet'},
  {id:21,date:'2026-03-14',ship:'2026-03-16',art:'Armband mit Karabiner Navyblau',rev:10.85,cost:1.12,status:'versendet'},
  {id:22,date:'2026-03-15',ship:'2026-03-16',art:'Armband mit Karabiner Navyblau',rev:12,cost:1.12,status:'versendet'},
  {id:23,date:'2026-03-16',ship:'2026-03-18',art:'Armband mit Karabiner Navyblau',rev:10.99,cost:1.12,status:'versendet'},
  {id:24,date:'2026-03-16',ship:'2026-03-18',art:'Hose',rev:20,cost:7.38,status:'versendet'},
  {id:25,date:'2026-03-16',ship:'2026-03-18',art:'Armband mit Karabiner Navyblau',rev:9.99,cost:1.12,status:'versendet'},
  {id:26,date:'2026-03-17',ship:'2026-03-18',art:'Armband mit Muschel und Stern',rev:16,cost:1.88,status:'versendet'},
  {id:27,date:'2026-03-17',ship:'2026-03-18',art:'Hose',rev:33,cost:7.88,status:'versendet'},
  {id:28,date:'2026-03-18',ship:'2026-03-18',art:'Armband mit Karabiner Navyblau',rev:10.99,cost:1.12,status:'versendet'},
  {id:29,date:'2026-03-18',ship:'2026-03-25',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:30,date:'2026-03-18',ship:'2026-03-25',art:'Hose',rev:38,cost:7.88,status:'versendet'},
  {id:31,date:'2026-03-19',ship:'2026-03-25',art:'Hose',rev:37,cost:7.88,status:'versendet'},
  {id:32,date:'2026-03-19',ship:'2026-03-25',art:'Hose',rev:31.5,cost:7.88,status:'versendet'},
  {id:33,date:'2026-03-20',ship:'2026-03-25',art:'Hose',rev:42.99,cost:7.88,status:'versendet'},
  {id:34,date:'2026-03-21',ship:'2026-03-25',art:'Hose',rev:41.99,cost:7.88,status:'versendet'},
  {id:35,date:'2026-03-21',ship:'2026-03-23',art:'Armband mit Karabiner Navyblau',rev:9.99,cost:1.12,status:'versendet'},
  {id:36,date:'2026-03-22',ship:'2026-03-27',art:'Hose',rev:30.5,cost:7.88,status:'versendet'},
  {id:37,date:'2026-03-22',ship:'2026-03-23',art:'Armband mit Karabiner Navyblau',rev:11.99,cost:1.12,status:'versendet'},
  {id:38,date:'2026-03-22',ship:'2026-03-23',art:'Armband mit Karabiner Navyblau',rev:9.99,cost:1.12,status:'versendet'},
  {id:39,date:'2026-03-23',ship:'2026-03-27',art:'Hose',rev:27,cost:7.88,status:'versendet'},
  {id:40,date:'2026-03-25',ship:'2026-03-27',art:'Hose',rev:30.6,cost:7.88,status:'versendet'},
  {id:41,date:'2026-03-26',ship:'2026-03-27',art:'Hose',rev:29.75,cost:7.88,status:'versendet'},
  {id:42,date:'2026-03-27',ship:'2026-03-28',art:'Armband mit Karabiner Navyblau',rev:8,cost:1.12,status:'versendet'},
  {id:43,date:'2026-03-27',ship:'2026-03-28',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:44,date:'2026-03-28',ship:'2026-03-28',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:45,date:'2026-03-29',ship:'2026-03-30',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:46,date:'2026-03-30',ship:'2026-03-30',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:47,date:'2026-03-31',ship:'2026-06-01',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:48,date:'2026-03-31',ship:'2026-06-01',art:'Hose',rev:33,cost:7,status:'versendet'},
  {id:49,date:'2026-04-01',ship:'2026-04-02',art:'Hose',rev:29,cost:7.88,status:'versendet'},
  {id:50,date:'2026-04-02',ship:'2026-04-02',art:'Hose',rev:30.9,cost:7.88,status:'versendet'},
  {id:51,date:'2026-04-04',ship:'2026-04-09',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:52,date:'2026-04-05',ship:'2026-04-09',art:'Hose',rev:34.2,cost:7.88,status:'versendet'},
  {id:53,date:'2026-04-06',ship:'2026-04-14',art:'Pullover Miami Collection',rev:36.99,cost:13.19,status:'versendet'},
  {id:54,date:'2026-04-07',ship:'2026-04-09',art:'Hose',rev:29.7,cost:7.88,status:'versendet'},
  {id:55,date:'2026-04-07',ship:'2026-04-09',art:'Hose',rev:28,cost:7.88,status:'versendet'},
  {id:56,date:'2026-04-08',ship:'2026-04-09',art:'Hose',rev:34,cost:7.88,status:'versendet'},
  {id:57,date:'2026-04-08',ship:'2026-04-09',art:'Hose',rev:36,cost:7.88,status:'versendet'},
  {id:58,date:'2026-04-09',ship:'2026-04-14',art:'Pullover Miami Collection',rev:36,cost:13.19,status:'versendet'},
  {id:59,date:'2026-04-10',ship:'2026-04-10',art:'Hose',rev:31.5,cost:7.88,status:'versendet'},
  {id:60,date:'2026-04-10',ship:'2026-04-10',art:'Hose',rev:30,cost:7.88,status:'versendet'},
  {id:61,date:'2026-04-10',ship:'2026-04-10',art:'Hose',rev:28,cost:7.88,status:'versendet'},
  {id:62,date:'2026-04-12',ship:'2026-04-14',art:'Pullover Miami Collection',rev:30,cost:13.119,status:'versendet'},
  {id:63,date:'2026-04-13',ship:'2026-04-14',art:'Pullover Miami Collection',rev:34,cost:13.12,status:'versendet'},
  {id:64,date:'2026-04-14',ship:'2026-04-17',art:'Pullover Miami Collection',rev:34.8,cost:13.12,status:'versendet'},
  {id:65,date:'2026-04-16',ship:'2026-04-17',art:'Hose',rev:34,cost:9.11,status:'versendet'},
  {id:66,date:'2026-04-16',ship:'2026-04-17',art:'Hose',rev:32,cost:9.11,status:'versendet'},
  {id:67,date:'2026-04-17',ship:'2026-04-17',art:'Hose',rev:36,cost:9.11,status:'versendet'},
  {id:68,date:'2026-04-17',ship:'2026-04-20',art:'Hose',rev:29,cost:9.11,status:'versendet'},
  {id:69,date:'2026-04-18',ship:'2026-04-20',art:'Hose',rev:29,cost:9.11,status:'versendet'},
  {id:70,date:'2026-04-20',ship:'2026-04-21',art:'Pullover Miami Collection',rev:32,cost:8.4,status:'versendet'},
  {id:71,date:'2026-04-20',ship:'2026-04-21',art:'Hose',rev:27.5,cost:7.3,status:'versendet'},
  {id:72,date:'2026-04-20',ship:'2026-04-21',art:'Hose',rev:32.5,cost:7.3,status:'versendet'},
  {id:73,date:'2026-04-21',ship:'2026-04-21',art:'Pullover Miami Collection',rev:32,cost:8.4,status:'versendet'},
  {id:74,date:'2026-04-21',ship:'2026-04-21',art:'Hose',rev:30,cost:7.3,status:'versendet'},
  {id:75,date:'2026-04-22',ship:'2026-04-22',art:'Hose',rev:30,cost:7.3,status:'versendet'},
  {id:76,date:'2026-04-22',ship:'2026-04-22',art:'Hose',rev:29.5,cost:7.3,status:'versendet'},
  {id:77,date:'2026-04-23',ship:'2026-04-23',art:'Hose',rev:34.99,cost:7.3,status:'versendet'},
  {id:78,date:'2026-04-23',ship:'2026-04-27',art:'Hose',rev:30,cost:9,status:'versendet'},
  {id:79,date:'2026-04-24',ship:'2026-04-27',art:'Hose',rev:30,cost:11.7,status:'versendet'},
  {id:80,date:'2026-04-25',ship:'2026-04-27',art:'Hose',rev:33.99,cost:11.7,status:'versendet'},
  {id:81,date:'2026-04-25',ship:'2026-04-27',art:'Hose',rev:30,cost:8.54,status:'versendet'},
  {id:82,date:'2026-04-26',ship:'2026-04-27',art:'Hose',rev:29.5,cost:8.7,status:'versendet'},
  {id:83,date:'2026-04-26',ship:'2026-04-27',art:'Hose',rev:33.99,cost:8.7,status:'versendet'},
  {id:84,date:'2026-04-26',ship:'2026-04-27',art:'Pullover Miami Collection',rev:27,cost:12.59,status:'versendet'},
  {id:85,date:'2026-04-27',ship:'2026-04-28',art:'Hose',rev:26,cost:8.7,status:'versendet'},
  {id:86,date:'2026-04-27',ship:'2026-04-28',art:'Hose',rev:29.76,cost:8.7,status:'versendet'},
  {id:87,date:'2026-04-28',ship:'2026-04-28',art:'Pullover Miami Collection',rev:26,cost:12.59,status:'versendet'},
  {id:88,date:'2026-04-28',ship:'2026-04-29',art:'Hose',rev:28,cost:8.7,status:'versendet'},
  {id:89,date:'2026-04-29',ship:'2026-04-30',art:'Hose',rev:32.99,cost:10.19,status:'versendet'},
  {id:90,date:'2026-04-30',ship:'2026-04-30',art:'Hose',rev:32.81,cost:10.19,status:'versendet'},
  {id:91,date:'2026-04-30',ship:'2026-04-30',art:'Hose',rev:28.79,cost:10.19,status:'versendet'},
  {id:92,date:'2026-04-30',ship:'2026-04-30',art:'Hose',rev:31.6,cost:10.19,status:'versendet'},
  {id:93,date:'2026-05-01',ship:'2026-05-04',art:'Hose',rev:29,cost:7.3,status:'versendet'},
  {id:94,date:'2026-05-01',ship:'2026-05-04',art:'Hose',rev:27,cost:8,status:'versendet'},
  {id:95,date:'2026-05-01',ship:'2026-05-04',art:'Hose',rev:33.99,cost:8,status:'versendet'},
  {id:96,date:'2026-05-01',ship:'2026-05-04',art:'Hose',rev:29,cost:8,status:'versendet'},
  {id:97,date:'2026-05-02',ship:'2026-05-04',art:'Hose',rev:29,cost:8,status:'versendet'},
  {id:98,date:'2026-05-02',ship:'2026-05-04',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:99,date:'2026-05-03',ship:'2026-05-04',art:'Hose',rev:29,cost:8,status:'versendet'},
  {id:100,date:'2026-05-04',ship:'2026-05-04',art:'Hose',rev:33,cost:8,status:'versendet'},
  {id:101,date:'2026-05-04',ship:'2026-05-05',art:'Hose',rev:36.8,cost:9.5,status:'versendet'},
  {id:102,date:'2026-05-05',ship:'2026-05-05',art:'Hose',rev:28.5,cost:8,status:'versendet'},
  {id:103,date:'2026-05-05',ship:'2026-05-05',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:104,date:'2026-05-06',ship:'2026-05-07',art:'Hose',rev:28,cost:8,status:'versendet'},
  {id:105,date:'2026-05-06',ship:'2026-05-07',art:'Hose',rev:25.55,cost:8,status:'versendet'},
  {id:106,date:'2026-05-07',ship:'2026-05-07',art:'Hose',rev:27,cost:8,status:'versendet'},
  {id:107,date:'2026-05-07',ship:'2026-05-07',art:'Hose',rev:25.5,cost:8,status:'versendet'},
  {id:108,date:'2026-05-07',ship:'2026-05-07',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:109,date:'2026-05-08',ship:'2026-05-08',art:'Hose',rev:24.37,cost:8,status:'versendet'},
  {id:110,date:'2026-05-08',ship:'2026-05-09',art:'Hose',rev:25,cost:8,status:'versendet'},
  {id:111,date:'2026-05-09',ship:'2026-05-09',art:'Hose',rev:26.5,cost:8,status:'versendet'},
  {id:112,date:'2026-05-09',ship:'2026-05-09',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:113,date:'2026-05-09',ship:'2026-05-09',art:'Hose',rev:25,cost:8,status:'versendet'},
  {id:114,date:'2026-05-10',ship:'2026-05-11',art:'Hose',rev:32.98,cost:8,status:'versendet'},
  {id:115,date:'2026-05-10',ship:'2026-05-11',art:'Hose',rev:30,cost:8,status:'versendet'},
  {id:116,date:'2026-05-10',ship:'2026-05-11',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:117,date:'2026-05-10',ship:'2026-05-11',art:'Hose',rev:33.99,cost:8,status:'versendet'},
  {id:118,date:'2026-05-11',ship:'2026-05-15',art:'Hose',rev:25.5,cost:8,status:'versendet'},
  {id:119,date:'2026-05-11',ship:'2026-05-12',art:'Hose',rev:30,cost:8,status:'versendet'},
  {id:120,date:'2026-05-11',ship:'2026-05-12',art:'Hose',rev:28,cost:8,status:'versendet'},
  {id:121,date:'2026-05-12',ship:'2026-05-12',art:'Hose',rev:26.5,cost:8,status:'versendet'},
  {id:122,date:'2026-05-12',ship:'2026-05-12',art:'Hose',rev:28.5,cost:8,status:'versendet'},
  {id:123,date:'2026-05-13',ship:'2026-05-15',art:'Hose',rev:33.99,cost:8,status:'versendet'},
  {id:124,date:'2026-05-14',ship:'2026-05-15',art:'Hose',rev:25,cost:8,status:'versendet'},
  {id:125,date:'2026-05-14',ship:'2026-05-15',art:'Hose',rev:25,cost:8,status:'versendet'},
  {id:126,date:'2026-05-16',ship:'2026-05-17',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:127,date:'2026-05-17',ship:'2026-05-18',art:'Hose',rev:33,cost:8,status:'versendet'},
  {id:128,date:'2026-05-17',ship:'2026-05-19',art:'Hose',rev:30.5,cost:8,status:'versendet'},
  {id:129,date:'2026-05-18',ship:'2026-05-19',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:130,date:'2026-05-19',ship:'2026-05-21',art:'Hose',rev:28,cost:8,status:'versendet'},
  {id:131,date:'2026-05-19',ship:'2026-05-21',art:'Hose',rev:25.5,cost:8,status:'versendet'},
  {id:132,date:'2026-05-20',ship:'2026-05-21',art:'Hose',rev:26,cost:8,status:'versendet'},
  {id:133,date:'2026-05-20',ship:'2026-05-21',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:134,date:'2026-05-20',ship:'2026-05-21',art:'Hose',rev:27.1,cost:7,status:'versendet'},
  {id:135,date:'2026-05-21',ship:'2026-05-22',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:136,date:'2026-05-21',ship:'2026-05-23',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:137,date:'2026-05-22',ship:'2026-05-23',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:138,date:'2026-05-23',ship:'2026-05-26',art:'Hose',rev:33.99,cost:7,status:'versendet'},
  {id:139,date:'2026-05-24',ship:'2026-05-26',art:'Hose',rev:28.5,cost:7,status:'versendet'},
  {id:140,date:'2026-05-25',ship:'2026-05-26',art:'Hose',rev:27,cost:7,status:'versendet'},
  {id:141,date:'2026-05-26',ship:'2026-05-26',art:'Hose',rev:26.5,cost:7,status:'versendet'},
  {id:142,date:'2026-05-26',ship:'2026-05-26',art:'Hose',rev:25,cost:7,status:'versendet'},
  {id:143,date:'2026-05-27',ship:'2026-05-27',art:'Hose',rev:27,cost:7,status:'versendet'},
  {id:144,date:'2026-05-27',ship:'2026-05-29',art:'Hose',rev:29,cost:7,status:'versendet'},
  {id:145,date:'2026-05-28',ship:'2026-05-29',art:'Hose',rev:34,cost:7,status:'versendet'},
  {id:146,date:'2026-05-28',ship:'2026-05-29',art:'Hose',rev:32.99,cost:7,status:'versendet'},
  {id:147,date:'2026-05-28',ship:'2026-05-29',art:'Hose',rev:29,cost:7,status:'versendet'},
  {id:148,date:'2026-05-29',ship:'2026-05-29',art:'Hose',rev:33,cost:7,status:'versendet'},
  {id:149,date:'2026-05-29',ship:'2026-06-01',art:'Hose',rev:25,cost:7,status:'versendet'},
  {id:150,date:'2026-05-30',ship:'2026-06-01',art:'Hose',rev:30.6,cost:7,status:'versendet'},
  {id:151,date:'2026-05-30',ship:'2026-06-01',art:'Hose',rev:25.5,cost:7,status:'versendet'},
  {id:152,date:'2026-06-01',ship:'2026-06-01',art:'Hose',rev:30.5,cost:7,status:'versendet'},
  {id:153,date:'2026-06-01',ship:'2026-06-01',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:154,date:'2026-06-02',ship:'2026-06-02',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:155,date:'2026-06-02',ship:'2026-06-02',art:'Hose',rev:34,cost:7,status:'versendet'},
  {id:156,date:'2026-06-03',ship:'2026-06-04',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:157,date:'2026-06-04',ship:'2026-06-04',art:'Hose',rev:27,cost:7,status:'versendet'},
  {id:158,date:'2026-06-04',ship:'2026-06-04',art:'Hose',rev:33.49,cost:7,status:'versendet'},
  {id:159,date:'2026-06-04',ship:'2026-06-04',art:'Hose',rev:25,cost:7,status:'versendet'},
  {id:160,date:'2026-06-04',ship:'2026-06-04',art:'Hose',rev:25.5,cost:7,status:'versendet'},
  {id:161,date:'2026-06-05',ship:'2026-06-08',art:'Hose + Tshirt',rev:43,cost:15.2,status:'versendet'},
  {id:162,date:'2026-06-05',ship:'2026-06-06',art:'Hose',rev:29,cost:7,status:'versendet'},
  {id:163,date:'2026-06-06',ship:'2026-06-06',art:'Hose',rev:26.5,cost:7,status:'versendet'},
  {id:164,date:'2026-06-06',ship:'2026-06-08',art:'Hose',rev:29,cost:7,status:'versendet'},
  {id:165,date:'2026-06-07',ship:'2026-06-08',art:'Hose',rev:22,cost:7,status:'versendet'},
  {id:166,date:'2026-06-08',ship:'2026-06-08',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:167,date:'2026-06-08',ship:'2026-06-08',art:'Hose',rev:31.8,cost:7,status:'versendet'},
  {id:168,date:'2026-06-09',ship:'2026-06-10',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:169,date:'2026-06-09',ship:'2026-06-10',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:170,date:'2026-06-10',ship:'2026-06-10',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:171,date:'2026-06-10',ship:'2026-06-10',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:172,date:'2026-06-10',ship:'2026-06-10',art:'Hose',rev:27,cost:7,status:'versendet'},
  {id:173,date:'2026-06-11',ship:'2026-06-12',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:174,date:'2026-06-11',ship:'2026-06-12',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:175,date:'2026-06-12',ship:'2026-06-12',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:176,date:'2026-06-12',ship:'2026-06-15',art:'Hose',rev:28,cost:7,status:'versendet'},
  {id:177,date:'2026-06-13',ship:'2026-06-15',art:'Hose',rev:25,cost:7,status:'versendet'},
  {id:178,date:'2026-06-14',ship:'2026-06-15',art:'Hose',rev:30,cost:7,status:'versendet'},
  {id:179,date:'2026-06-14',ship:'2026-06-15',art:'Hose',rev:27.5,cost:7,status:'versendet'},
  {id:180,date:'2026-06-16',ship:null,art:'Hose',rev:29,cost:7,status:'offen'},
  {id:181,date:'2026-06-17',ship:null,art:'Hose',rev:28,cost:7,status:'offen'},
  {id:182,date:'2026-06-17',ship:null,art:'Hose',rev:26,cost:7,status:'offen'},
  {id:183,date:'2026-06-17',ship:null,art:'Hose',rev:32.99,cost:7,status:'offen'},
  {id:184,date:'2026-06-17',ship:null,art:'Hose',rev:27,cost:7,status:'offen'},
  {id:185,date:'2026-06-17',ship:null,art:'Hose',rev:33.99,cost:7,status:'offen'},
  {id:186,date:'2026-06-17',ship:null,art:'Hose',rev:27.5,cost:7,status:'offen'},
  {id:187,date:'2026-06-17',ship:null,art:'Hose',rev:28,cost:7,status:'offen'},
  {id:188,date:'2026-06-18',ship:null,art:'Hose',rev:27.5,cost:7,status:'offen'},
  {id:189,date:'2026-06-19',ship:null,art:'Hose',rev:30,cost:7,status:'offen'},
  {id:190,date:'2026-06-19',ship:null,art:'Hose',rev:33.5,cost:7,status:'offen'},
  {id:191,date:'2026-06-20',ship:null,art:'Hose',rev:28,cost:7,status:'offen'},
  {id:192,date:'2026-05-25',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:24,cost:8.2,status:'versendet'},
  {id:193,date:'2026-05-25',ship:'2026-05-29',art:"Tshirt Cap d'Antebes",rev:24,cost:8.2,status:'versendet'},
  {id:194,date:'2026-05-25',ship:'2026-05-29',art:'Tshirt Monaco',rev:23,cost:8.2,status:'versendet'},
  {id:195,date:'2026-05-26',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:24.5,cost:8.2,status:'versendet'},
  {id:196,date:'2026-05-26',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:20,cost:8.2,status:'versendet'},
  {id:197,date:'2026-05-27',ship:'2026-05-29',art:"Tshirt Saint Monaco Capd'Antebes",rev:36,cost:16.4,status:'versendet'},
  {id:198,date:'2026-05-28',ship:'2026-05-29',art:"Tshirt Cap d'Antebes",rev:20,cost:8.2,status:'versendet'},
  {id:199,date:'2026-05-28',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:22.3,cost:8.2,status:'versendet'},
  {id:200,date:'2026-05-28',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:28.99,cost:8.2,status:'versendet'},
  {id:201,date:'2026-05-28',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:21,cost:8.2,status:'versendet'},
  {id:202,date:'2026-05-29',ship:'2026-05-29',art:'Tshirt Saint Tropez',rev:25,cost:8.2,status:'versendet'},
  {id:203,date:'2026-05-29',ship:'2026-05-29',art:"Tshirt Cap d'Antebes",rev:25,cost:8.2,status:'versendet'},
  {id:204,date:'2026-05-30',ship:'2026-06-02',art:'Tshirt Monaco',rev:23,cost:8.2,status:'versendet'},
  {id:205,date:'2026-05-30',ship:'2026-06-02',art:'Tshirt Saint Tropez Navy',rev:27.99,cost:8.2,status:'versendet'},
  {id:206,date:'2026-05-31',ship:'2026-06-02',art:'Tshirt Saint Tropez Navy',rev:24,cost:8.2,status:'versendet'},
  {id:207,date:'2026-06-01',ship:'2026-06-02',art:"Tshirt Cap d'Antebes",rev:20.5,cost:8.2,status:'versendet'},
  {id:208,date:'2026-06-01',ship:'2026-06-02',art:'Tshirt Saint Tropez',rev:22.4,cost:8.2,status:'versendet'},
  {id:209,date:'2026-06-02',ship:'2026-06-02',art:'Tshirt Saint Tropez',rev:22,cost:8.2,status:'versendet'},
  {id:210,date:'2026-06-02',ship:'2026-06-02',art:"Tshirt Cap d'Antebes",rev:22,cost:8.2,status:'versendet'},
  {id:211,date:'2026-06-02',ship:'2026-06-02',art:'Tshirt Saint Tropez Schwarz',rev:22.4,cost:8.2,status:'versendet'},
  {id:212,date:'2026-06-03',ship:'2026-06-02',art:'Tshirt Saint Tropez',rev:21,cost:8.2,status:'versendet'},
  {id:213,date:'2026-06-03',ship:'2026-06-02',art:"Tshirt Cap d'Antebes",rev:23.4,cost:8.2,status:'versendet'},
  {id:214,date:'2026-06-04',ship:'2026-06-06',art:'Tshirt Saint Tropez Schwarz',rev:27.99,cost:8.2,status:'versendet'},
  {id:215,date:'2026-06-04',ship:'2026-06-02',art:"Tshirt Cap d'Antebes",rev:22.4,cost:8.2,status:'versendet'},
  {id:216,date:'2026-06-05',ship:'2026-06-06',art:'Tshirt Saint Tropez Navy',rev:23.2,cost:8.2,status:'versendet'},
  {id:217,date:'2026-06-05',ship:'2026-06-06',art:'Tshirt Monaco',rev:23,cost:8.2,status:'versendet'},
  {id:218,date:'2026-06-05',ship:'2026-06-06',art:'Tshirt Monaco',rev:21,cost:8.2,status:'versendet'},
  {id:219,date:'2026-06-06',ship:'2026-06-10',art:'Tshirt Monaco',rev:28.49,cost:8.2,status:'versendet'},
  {id:220,date:'2026-06-06',ship:'2026-06-10',art:"Tshirt Cap d'Antebes",rev:20,cost:8.2,status:'versendet'},
  {id:221,date:'2026-06-08',ship:'2026-06-10',art:'Tshirt Monaco Heliport',rev:22,cost:8.2,status:'versendet'},
  {id:222,date:'2026-06-08',ship:'2026-06-10',art:'Tshirt Saint Tropez',rev:28.99,cost:8.2,status:'versendet'},
  {id:223,date:'2026-06-08',ship:'2026-06-10',art:'Tshirt Monaco Dolce Vita',rev:24,cost:8.2,status:'versendet'},
  {id:224,date:'2026-06-08',ship:'2026-06-10',art:'Tshirt Saint Tropez',rev:23,cost:8.2,status:'versendet'},
  {id:225,date:'2026-06-09',ship:'2026-06-12',art:"Tshirt Cap d'Antebes",rev:24.3,cost:8.2,status:'versendet'},
  {id:226,date:'2026-06-10',ship:'2026-06-12',art:'Tshirt Saint Tropez',rev:21.5,cost:8.2,status:'versendet'},
  {id:227,date:'2026-06-11',ship:'2026-06-12',art:'Tshirt Monaco Dolce Vita',rev:24,cost:8.2,status:'versendet'},
  {id:228,date:'2026-06-13',ship:'2026-06-15',art:'Tshirt Dolce Vita navyblau',rev:20,cost:8.2,status:'versendet'},
  {id:229,date:'2026-06-14',ship:'2026-06-15',art:'Tshirt Monaco Dolce Vita',rev:20,cost:8.2,status:'versendet'},
  {id:230,date:'2026-06-14',ship:'2026-06-15',art:'Tshirt Saint Tropez Navy',rev:26.49,cost:8.2,status:'versendet'},
  {id:231,date:'2026-06-14',ship:'2026-06-15',art:'Tshirt Monaco Heliport Navy',rev:22,cost:8.2,status:'versendet'},
  {id:232,date:'2026-06-16',ship:null,art:'Tshirt Monaco Heliport',rev:28,cost:8.2,status:'offen'},
  {id:233,date:'2026-06-18',ship:'2026-06-15',art:'Tshirt Saint Tropez',rev:22,cost:8.2,status:'versendet'},
  {id:234,date:'2026-06-18',ship:'2026-06-15',art:'Tshirt Monaco',rev:27.49,cost:8.2,status:'versendet'},
  {id:235,date:'2026-06-18',ship:'2026-06-15',art:'Tshirt Dolce Vita navyblau',rev:26.89,cost:8.2,status:'versendet'},
  {id:236,date:'2026-06-18',ship:'2026-06-15',art:'Tshirt Saint Tropez Navy',rev:22,cost:8.2,status:'versendet'},
];

function normalizeSale(s){
  const validStatus=['offen','versendet','storniert','retour'];
  return {
    id:+s.id||0,
    date:s.date||'',
    ship:s.ship||null,
    art:cleanProductName(s.art),
    rev:+s.rev||0,
    cost:+s.cost||0,
    status:validStatus.includes(s.status)?s.status:(s.status==='offen'?'offen':'versendet'),
    note:s.note||''
  };
}
function normalizeExpense(e){
  const qty=+e.qty||0;
  const unit=+e.unit||0;
  return {id:+e.id||0,date:e.date||'',product:e.product||'Sonstiges',kind:e.kind==='sonstige'?'sonstige':'rohling',qty,unit,total:+(e.total||qty*unit).toFixed(2),note:e.note||''};
}
let DB={sales:[],expenses:[],products:[],meta:{}};
let dashboardRange='all';
let undoStack=[];
let undoTimer=null;

function cloneData(data=DB){
  return JSON.parse(JSON.stringify({
    sales:data.sales||[],
    expenses:data.expenses||[],
    products:data.products||[],
    meta:data.meta||{},
    snapshots:data.snapshots||[]
  }));
}

function makeSnapshot(label){
  return {id:Date.now(),at:new Date().toISOString(),label,data:cloneData({...DB,snapshots:[]})};
}

function snapshotLabel(snapshot){
  return `${fmtDate(snapshot.at.slice(0,10))} ${snapshot.at.slice(11,16)} · ${snapshot.label}`;
}

function saveSnapshot(label){
  DB.snapshots=DB.snapshots||[];
  DB.snapshots.unshift(makeSnapshot(label));
  DB.snapshots=DB.snapshots.slice(0,10);
}

function commitChange(label,render=refreshCurrentView,beforeData=null){
  undoStack.push({label,data:beforeData||cloneData(DB)});
  undoStack=undoStack.slice(-10);
  saveSnapshot(label);
  saveData();
  render();
  showUndoBar(label);
}

function showUndoBar(label){
  const bar=document.getElementById('undo-bar');
  if(!bar)return;
  document.getElementById('undo-text').textContent=`${label} gespeichert`;
  bar.classList.add('open');
  clearTimeout(undoTimer);
  undoTimer=setTimeout(hideUndoBar,8000);
}

function hideUndoBar(){
  const bar=document.getElementById('undo-bar');
  if(bar)bar.classList.remove('open');
}

function undoLastChange(){
  const prev=undoStack.pop();
  if(!prev)return;
  DB=cloneData(prev.data);
  saveData();
  hideUndoBar();
  refreshCurrentView();
}

function restoreSnapshot(id){
  const snapshot=(DB.snapshots||[]).find(s=>s.id===id);
  if(!snapshot||!confirm(`Sicherungspunkt "${snapshot.label}" wiederherstellen?`))return;
  undoStack.push({label:'Snapshot-Wiederherstellung',data:cloneData(DB)});
  const currentSnapshots=DB.snapshots||[];
  DB=cloneData(snapshot.data);
  DB.snapshots=currentSnapshots;
  saveData();
  refreshCurrentView();
  showUndoBar('Snapshot wiederhergestellt');
}

let charts={};
function destroyChart(id){if(charts[id]){charts[id].destroy();delete charts[id]}}

function nav(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>{if(n.getAttribute('onclick').includes("'"+page+"'"))n.classList.add('active')});
  const morePages=['charts','packlist','expenses','new-expense','products','goals'];
  if(morePages.includes(page))document.querySelector('.nav-more')?.classList.add('active');
  const titles={'dashboard':'Dashboard','charts':'Diagramme','sales':'Alle Verkäufe','new-sale':'Neuer Verkauf','returns':'Retoure','goals':'Ziele','more':'Mehr','packlist':'Packliste','expenses':'Rohlingskosten','new-expense':'Neue Ausgabe','products':'Produkte'};
  document.getElementById('page-title').textContent=titles[page]||page;
  if(page==='dashboard')renderDashboard();
  if(page==='charts')renderCharts();
  if(page==='sales')renderSalesTable();
  if(page==='returns'){populateProductSelects();document.getElementById('cancel-alert').innerHTML=''}
  if(page==='goals')renderGoalEditor();
  if(page==='more'){}
  if(page==='packlist')renderPacklist();
  if(page==='expenses')renderExpenses();
  if(page==='products')renderProducts();
  if(page==='new-sale'){resetSaleForm();populateProductSelects();setTodayDate('s-date');document.getElementById('sale-alert').innerHTML=''}
  if(page==='new-expense'){setTodayDate('e-date');document.getElementById('exp-alert').innerHTML=''}
}
function setTodayDate(id){document.getElementById(id).value=localDateISO()}

function activeProducts(){return DB.products.filter(p=>p.active)}
function productByName(name){return DB.products.find(p=>p.name===name)}
function ensureProduct(name,cost=0){
  if(!name||productByName(name))return;
  DB.products.push(normalizeProduct({name,category:expCatForProduct(name)||cat(name)||'Sonstiges',cost,active:true}));
}

function populateProductSelects(){
  const selects=[document.getElementById('s-product'),document.getElementById('q-product'),document.getElementById('c-product')].filter(Boolean);
  selects.forEach(select=>{
    const current=select.value;
    select.innerHTML='<option value="">Produkt wählen...</option>'+activeProducts().map(p=>`<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
    if(current&&[...select.options].some(o=>o.value===current))select.value=current;
  });
}

function setDashboardRange(range){
  dashboardRange=range;
  document.querySelectorAll('#dash-range button').forEach(btn=>btn.classList.toggle('active',btn.dataset.range===range));
  renderDashboard();
}

function inDateRange(item,range=dashboardRange){
  if(range==='all')return true;
  const d=new Date(item.date+'T00:00:00');
  const today=new Date(localDateISO()+'T00:00:00');
  if(range==='today')return item.date===localDateISO();
  if(range==='7d'){
    const from=new Date(today);from.setDate(today.getDate()-6);
    return d>=from&&d<=today;
  }
  if(range==='month')return item.date&&item.date.slice(0,7)===localDateISO().slice(0,7);
  return true;
}

function rangeLabel(){
  return {all:'Alle Daten',today:'Heute', '7d':'Letzte 7 Tage', month:'Aktueller Monat'}[dashboardRange]||'Alle Daten';
}

function sortSalesNewest(a,b){
  const dateDiff=String(b.date||'').localeCompare(String(a.date||''));
  if(dateDiff)return dateDiff;
  return (b.id||0)-(a.id||0);
}

function renumberSales(){
  let changed=false;
  const sorted=[...DB.sales].sort((a,b)=>{
    const dateDiff=String(a.date||'').localeCompare(String(b.date||''));
    if(dateDiff)return dateDiff;
    return (a.id||0)-(b.id||0);
  });
  sorted.forEach((sale,index)=>{
    const nextId=index+1;
    if(sale.id!==nextId)changed=true;
    sale.id=nextId;
  });
  DB.sales.sort(sortSalesNewest);
  return changed;
}

function renderDashboard(){
  populateProductSelects();
  const allSales=DB.sales;
  const s=allSales.filter(x=>inDateRange(x)&&isActiveSale(x));
  const todaySales=allSales.filter(x=>x.date===localDateISO()&&isActiveSale(x));
  const todayRev=todaySales.reduce((a,x)=>a+realizedRevenue(x),0);
  const todayProfit=todaySales.reduce((a,x)=>a+profit(x),0);
  const totalRev=s.reduce((a,x)=>a+realizedRevenue(x),0);
  const totalProfit=s.reduce((a,x)=>a+profit(x),0);
  const totalCost=s.reduce((a,x)=>a+realizedCost(x),0);
  const sentSales=s.filter(x=>x.status==='versendet');
  const openSales=allSales.filter(x=>x.status==='offen');
  const avgProfit=s.length?totalProfit/s.length:0;
  const avgMargin=totalRev?((totalProfit/totalRev)*100):0;
  const expTotal=DB.expenses.filter(x=>inDateRange(x)).reduce((a,x)=>a+(x.total||0),0);
  const netProfit=totalProfit-expTotal;
  const hero=document.getElementById('dash-hero');
  if(hero)hero.innerHTML=`
    <div class="hero-main">
      <div class="hero-kicker">Heute</div>
      <div class="hero-value">${fmt(todayRev)}</div>
      <div class="hero-sub">${todaySales.length} Verkäufe · Gewinn ${fmt(todayProfit)}</div>
    </div>
    <div class="hero-stats">
      <div><span>Offen</span><strong>${openSales.length}</strong></div>
      <div><span>Zeitraum</span><strong>${s.length}</strong></div>
      <div><span>Gewinn</span><strong>${fmt(totalProfit)}</strong></div>
    </div>`;

  document.getElementById('dash-metrics').innerHTML=`
    <div class="metric"><div class="metric-label"><i class="ti ti-cash" style="font-size:14px" aria-hidden="true"></i> Umsatz</div><div class="metric-value">${fmt(totalRev)}</div><div class="metric-sub">${rangeLabel()} · ${s.length} Verkäufe</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-trending-up" style="font-size:14px" aria-hidden="true"></i> Gewinn</div><div class="metric-value" style="color:var(--accent)">${fmt(totalProfit)}</div><div class="metric-sub">Umsatz minus verkaufte Rohlinge</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-receipt" style="font-size:14px" aria-hidden="true"></i> Verkaufte Rohlinge</div><div class="metric-value" style="color:var(--red)">${fmt(totalCost)}</div><div class="metric-sub">in Verkäufen verbucht</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-wallet" style="font-size:14px" aria-hidden="true"></i> Cashflow nach Einkäufen</div><div class="metric-value" style="color:${netProfit>=0?'var(--accent)':'var(--red)'}">${fmt(netProfit)}</div><div class="metric-sub">${fmt(expTotal)} Ausgaben erfasst</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-chart-pie" style="font-size:14px" aria-hidden="true"></i> Ø Marge</div><div class="metric-value">${avgMargin.toFixed(1)}%</div><div class="metric-sub">Ø Gewinn ${fmt(avgProfit)}</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-check" style="font-size:14px" aria-hidden="true"></i> Versendet</div><div class="metric-value">${sentSales.length}</div><div class="metric-sub">${fmt(sentSales.reduce((a,x)=>a+x.rev,0))} im Zeitraum</div></div>
    <div class="metric"><div class="metric-label"><i class="ti ti-clock" style="font-size:14px" aria-hidden="true"></i> Offen gesamt</div><div class="metric-value" style="color:var(--amber)">${openSales.length}</div><div class="metric-sub">${fmt(openSales.reduce((a,x)=>a+realizedRevenue(x),0))} muss noch raus</div></div>
  `;

  // Weekly chart
  const weekMap={};
  s.forEach(x=>{
    const d=new Date(x.date);const wk=getWeek(d);
    if(!weekMap[wk])weekMap[wk]={rev:0,profit:0};
    weekMap[wk].rev+=realizedRevenue(x);weekMap[wk].profit+=profit(x);
  });
  const wks=Object.keys(weekMap).sort().slice(-8);
  destroyChart('weekChart');
  charts['weekChart']=new Chart(document.getElementById('weekChart'),{
    type:'bar',data:{labels:wks.map(w=>'KW '+w.split('-W')[1]),datasets:[
      {label:'Umsatz',data:wks.map(w=>+weekMap[w].rev.toFixed(2)),backgroundColor:'#B5D4F4'},
      {label:'Gewinn',data:wks.map(w=>+weekMap[w].profit.toFixed(2)),backgroundColor:'#5DCAA5'}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:11}}},y:{ticks:{callback:v=>'€'+v}}}}
  });

  // Product pie
  const prodMap={};
  s.forEach(x=>{const c=cat(x.art);if(!prodMap[c])prodMap[c]=0;prodMap[c]+=realizedRevenue(x)});
  const topProds=Object.entries(prodMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  destroyChart('productChart');
  charts['productChart']=new Chart(document.getElementById('productChart'),{
    type:'doughnut',data:{labels:topProds.map(p=>p[0]),datasets:[{data:topProds.map(p=>+p[1].toFixed(2)),backgroundColor:['#378ADD','#1D9E75','#BA7517','#D4537E','#7F77DD','#D85A30'],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:12}}}}
  });

  // Recent 10
  renderOpenSalesPanel(openSales);
  const recent=[...s].sort(sortSalesNewest).slice(0,10);
  document.getElementById('recent-table').innerHTML=salesTableHTML(recent);
  renderMonthReport();
  renderGoalProgress(totalRev,totalProfit);
  renderPriceInsights();
  renderStockOverview();
}

function monthKey(){return localDateISO().slice(0,7)}
function daysInMonth(key=monthKey()){
  const [year,month]=key.split('-').map(Number);
  return new Date(year,month,0).getDate();
}
function goalPeriod(){
  const days=daysInMonth();
  if(dashboardRange==='today')return {factor:1/days,label:'Tagesziel',note:`Monatsziel / ${days}`};
  if(dashboardRange==='7d')return {factor:7/days,label:'7-Tage-Ziel',note:`Monatsziel / ${days} × 7`};
  return {factor:1,label:'Monatsziel',note:'voller Monat'};
}
function monthName(key=monthKey()){
  const [y,m]=key.split('-');
  const names=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  return `${names[+m-1]} ${y}`;
}

function renderMonthReport(){
  const key=monthKey();
  const sales=DB.sales.filter(s=>s.date&&s.date.slice(0,7)===key&&isActiveSale(s));
  const expenses=DB.expenses.filter(e=>e.date&&e.date.slice(0,7)===key);
  const rev=sales.reduce((a,s)=>a+realizedRevenue(s),0);
  const prof=sales.reduce((a,s)=>a+profit(s),0);
  const exp=expenses.reduce((a,e)=>a+(e.total||0),0);
  const open=sales.filter(s=>s.status==='offen');
  document.getElementById('month-label').textContent=monthName(key);
  document.getElementById('month-report').innerHTML=`<div class="summary-list">
    <div class="summary-row"><span>Umsatz</span><strong>${fmt(rev)}</strong></div>
    <div class="summary-row"><span>Stückgewinn</span><strong class="${prof>=0?'profit-pos':'profit-neg'}">${fmt(prof)}</strong></div>
    <div class="summary-row"><span>Einkaufsausgaben</span><strong class="profit-neg">${fmt(exp)}</strong></div>
    <div class="summary-row"><span>Cashflow</span><strong class="${prof-exp>=0?'profit-pos':'profit-neg'}">${fmt(prof-exp)}</strong></div>
    <div class="summary-row"><span>Verkäufe / offen</span><strong>${sales.length} / ${open.length}</strong></div>
  </div>`;
}

function monthlyActiveSales(){
  return DB.sales.filter(s=>s.date&&s.date.slice(0,7)===monthKey()&&isActiveSale(s));
}

function saveGoals(){
  DB.meta=DB.meta||{};
  DB.meta.goals=DB.meta.goals||{};
  const current=DB.meta.goals[monthKey()]||{revenue:0,profit:0};
  const revInput=document.getElementById('goal-revenue');
  const profInput=document.getElementById('goal-profit');
  DB.meta.goals[monthKey()]={revenue:revInput?+revInput.value||0:current.revenue||0,profit:profInput?+profInput.value||0:current.profit||0};
  saveData();
  const sales=DB.sales.filter(s=>inDateRange(s)&&isActiveSale(s));
  renderGoalProgress(sales.reduce((a,s)=>a+realizedRevenue(s),0),sales.reduce((a,s)=>a+profit(s),0));
  renderGoalEditor();
}

function renderGoalEditor(){
  const goals=DB.meta?.goals?.[monthKey()]||{revenue:0,profit:0};
  const days=daysInMonth();
  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value?fmt(value):'—'};
  const revInput=document.getElementById('goal-revenue');
  const profInput=document.getElementById('goal-profit');
  if(revInput&&document.activeElement!==revInput)revInput.value=goals.revenue||'';
  if(profInput&&document.activeElement!==profInput)profInput.value=goals.profit||'';
  setText('goal-day-revenue',goals.revenue/days);
  setText('goal-day-profit',goals.profit/days);
  setText('goal-week-revenue',goals.revenue/days*7);
  setText('goal-week-profit',goals.profit/days*7);
  setText('goal-month-revenue',goals.revenue);
  setText('goal-month-profit',goals.profit);
  const setBar=(id,value,max)=>{const el=document.getElementById(id);if(el)el.style.width=(max?Math.min(100,(value/max)*100):0)+'%'};
  setBar('goal-day-bar',goals.revenue/days,goals.revenue);
  setBar('goal-week-bar',goals.revenue/days*7,goals.revenue);
  setBar('goal-month-bar',goals.revenue,goals.revenue);
}

function renderGoalProgress(rev,prof){
  const target=document.getElementById('goal-progress');
  if(!target)return;
  const goals=DB.meta?.goals?.[monthKey()]||{revenue:0,profit:0};
  const period=goalPeriod();
  const revenueTarget=goals.revenue?goals.revenue*period.factor:0;
  const profitTarget=goals.profit?goals.profit*period.factor:0;
  const revPct=revenueTarget?Math.min(100,(rev/revenueTarget)*100):0;
  const profPct=profitTarget?Math.min(100,(prof/profitTarget)*100):0;
  target.innerHTML=`<div class="summary-list">
    <div><div class="summary-row"><span>Umsatz ${fmt(rev)} / ${revenueTarget?fmt(revenueTarget):'kein Ziel'} <span class="muted">(${period.label})</span></span><strong>${revPct.toFixed(0)}%</strong></div><div class="progress"><div class="progress-bar" style="width:${revPct}%"></div></div></div>
    <div><div class="summary-row"><span>Gewinn ${fmt(prof)} / ${profitTarget?fmt(profitTarget):'kein Ziel'} <span class="muted">(${period.label})</span></span><strong>${profPct.toFixed(0)}%</strong></div><div class="progress"><div class="progress-bar" style="width:${profPct}%"></div></div></div>
    <div class="muted">Berechnung: ${period.note}</div>
  </div>`;
}

function priceStats(productName){
  const rows=DB.sales.filter(s=>s.art===productName&&isActiveSale(s));
  if(!rows.length)return null;
  const prices=rows.map(s=>s.rev).sort((a,b)=>a-b);
  const avg=prices.reduce((a,x)=>a+x,0)/prices.length;
  const profits=rows.map(profit);
  const avgProfit=profits.reduce((a,x)=>a+x,0)/profits.length;
  return {count:rows.length,min:prices[0],max:prices[prices.length-1],avg,avgProfit};
}

function renderPriceInsights(){
  const target=document.getElementById('price-insights');
  if(!target)return;
  const rows=DB.products.map(p=>({p,stats:priceStats(p.name)})).filter(x=>x.stats).sort((a,b)=>b.stats.avgProfit-a.stats.avgProfit).slice(0,6);
  if(!rows.length){target.innerHTML='<div class="empty" style="padding:1rem">Noch nicht genug Verkäufe für Preisvorschläge.</div>';return}
  target.innerHTML=`<div class="summary-list">${rows.map(({p,stats})=>`
    <div class="summary-row"><span>${esc(p.name)}<br><span class="muted">${stats.count} Verkäufe · ${fmt(stats.min)} bis ${fmt(stats.max)}</span></span><strong>${fmt(stats.avg)} Ø</strong></div>
  `).join('')}</div>`;
}

function renderOpenSalesPanel(openSales=DB.sales.filter(s=>s.status==='offen')){
  const target=document.getElementById('open-sales-panel');
  if(!target)return;
  const rows=[...openSales].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(!rows.length){
    target.innerHTML='<div class="empty" style="padding:1rem">Alles erledigt. Keine offenen Verkäufe.</div>';
    return;
  }
  target.innerHTML=`<div class="open-list">${rows.map(s=>`
    <div class="open-sale">
      <div class="open-sale-id">#${s.id}</div>
      <div class="open-sale-main">
        <div class="open-sale-product">${esc(cat(s.art))}</div>
        <div class="open-sale-meta">Verkauft am ${fmtDate(s.date)} · Gewinn ${fmt(profit(s))}${s.note?' · '+esc(s.note):''}</div>
      </div>
      <div class="open-sale-amount">${fmt(s.rev)}</div>
      <button class="btn btn-primary" onclick="markSaleShipped(${s.id})"><i class="ti ti-package-export" aria-hidden="true"></i> Versendet</button>
    </div>`).join('')}</div>`;
}

function renderPacklist(){
  const target=document.getElementById('packlist');
  if(!target)return;
  const rows=DB.sales.filter(s=>s.status==='offen').sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(!rows.length){target.innerHTML='<div class="empty">Keine offenen Verkäufe für die Packliste.</div>';return}
  target.innerHTML=`<div class="print-list mobile-list" style="display:grid">${rows.map(s=>`
    <div class="print-item">
      <div><input type="checkbox" aria-label="gepackt"></div>
      <div>
        <div class="print-title">#${s.id} · ${esc(s.art)}</div>
        <div class="print-meta">Verkauft am ${fmtDate(s.date)} · ${fmt(s.rev)} · Rohling ${fmt(s.cost)}${s.note?' · '+esc(s.note):''}</div>
      </div>
      <button class="btn btn-primary" onclick="markSaleShipped(${s.id})"><i class="ti ti-package-export"></i> Versendet</button>
    </div>`).join('')}</div>`;
}

function soldUnitsByType(){
  return DB.sales.reduce((map,s)=>{
    if(!isActiveSale(s))return map;
    const type=expCatForProduct(s.art);
    if(type)map[type]=(map[type]||0)+1;
    if(s.art.toLowerCase().includes('hose + tshirt')){map.Hose=(map.Hose||0)+1;map.Tshirt=(map.Tshirt||0)+1}
    return map;
  },{});
}

function stockStats(){
  const bought=DB.expenses.filter(e=>e.kind!=='sonstige').reduce((map,e)=>{map[e.product]=(map[e.product]||0)+(e.qty||0);return map},{});
  const sold=soldUnitsByType();
  const types=[...new Set([...Object.keys(bought),...Object.keys(sold),'Hose','Tshirt','Pullover','Armband'])].filter(Boolean);
  return {bought,sold,types};
}

function renderStockOverview(){
  const {bought,sold,types}=stockStats();
  const target=document.getElementById('stock-overview');
  if(!target)return;
  target.innerHTML=`<div class="stock-grid">${types.map(t=>{
    const left=(bought[t]||0)-(sold[t]||0);
    return `<div class="stock-item"><div class="stock-name">${t}</div><div class="stock-count" style="color:${left<0?'var(--red)':left<5?'var(--amber)':'var(--text)'}">${left}</div><div class="stock-sub">${bought[t]||0} gekauft · ${sold[t]||0} verkauft</div></div>`;
  }).join('')}</div>`;
}

function getWeek(d){const jan=new Date(d.getFullYear(),0,1);const wk=Math.ceil((((d-jan)/86400000)+jan.getDay()+1)/7);return d.getFullYear()+'-W'+(wk<10?'0'+wk:wk)}

function salesTableActionsHTML(s,{deleteText=false}={}){
  const small='style="padding:4px 8px;font-size:11px"';
  const deleteClass=deleteText?'btn btn-danger':'btn btn-danger btn-icon';
  return `<div class="action-row"><button class="${deleteClass}" title="Diesen Verkauf löschen" onclick="deleteSale(${s.id})" ${small}><i class="ti ti-trash" aria-hidden="true"></i>${deleteText?' Löschen':''}</button></div>`;
}

function salesTableHTML(rows,options={}){
  if(!rows.length)return '<div class="empty">Keine Verkäufe gefunden</div>';
  const table=`<table class="desktop-table"><thead><tr><th>#</th><th>Datum</th><th>Ausführung</th><th>Produkt</th><th>Notiz</th><th>Umsatz</th><th>Rohling</th><th>Gewinn</th><th>Marge</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(s=>`
    <tr>
      <td><button class="id-link" title="Verkauf #${s.id} bearbeiten" onclick="editSale(${s.id})">#${s.id}</button></td>
      <td>${fmtDate(s.date)}</td>
      <td style="color:var(--text2)">${fmtDate(s.ship)}</td>
      <td><span class="tag" style="background:var(--blue-bg);color:var(--blue-text)">${esc(cat(s.art))}</span></td>
      <td style="color:var(--text2);font-size:12px">${s.note?esc(s.note):'—'}</td>
      <td>${fmt(s.rev)}</td>
      <td style="color:var(--text2)">${fmt(s.cost)}</td>
      <td class="${profit(s)>=0?'profit-pos':'profit-neg'}">${fmt(profit(s))}</td>
      <td>${margin(s).toFixed(1)}%</td>
      <td><span class="badge ${statusClass(s.status)}">${statusLabel(s.status)}</span></td>
      <td>${salesTableActionsHTML(s,{deleteText:options.deleteText})}</td>
    </tr>`).join('')}</tbody></table>`;
  return table+salesCardsHTML(rows,{deleteText:options.deleteText});
}

function salesActionsHTML(s,{deleteText=false}={}){
  return `<div class="action-row"><button class="btn btn-danger" onclick="deleteSale(${s.id})"><i class="ti ti-trash"></i>${deleteText?' Löschen':''}</button></div>`;
}

function salesCardsHTML(rows,options={}){
  return `<div class="mobile-list">${rows.map(s=>`
    <div class="sale-card">
      <div class="sale-card-head">
        <div><button class="id-link" onclick="editSale(${s.id})">#${s.id}</button><div class="sale-card-title">${esc(s.art)}</div><div class="sale-card-meta">${fmtDate(s.date)} · Ausführung ${fmtDate(s.ship)}${s.note?' · '+esc(s.note):''}</div></div>
        <span class="badge ${statusClass(s.status)}">${statusLabel(s.status)}</span>
      </div>
      <div class="sale-card-grid">
        <div class="sale-card-stat"><span>Umsatz</span>${fmt(realizedRevenue(s)||s.rev)}</div>
        <div class="sale-card-stat"><span>Gewinn</span>${fmt(profit(s))}</div>
        <div class="sale-card-stat"><span>Marge</span>${margin(s).toFixed(1)}%</div>
      </div>
      ${salesActionsHTML(s,{deleteText:options.deleteText})}
    </div>`).join('')}</div>`;
}

function renderSalesTable(){
  const q=(document.getElementById('search')||{}).value?.toLowerCase()||'';
  const catF=(document.getElementById('filter-cat')||{}).value||'';
  const statusF=(document.getElementById('filter-status')||{}).value||'';
  const from=(document.getElementById('filter-from')||{}).value||'';
  const to=(document.getElementById('filter-to')||{}).value||'';
  const special=(document.getElementById('filter-special')||{}).value||'';

  // populate category filter
  const catEl=document.getElementById('filter-cat');
  if(catEl&&catEl.options.length<=1){
    const cats=[...new Set(DB.sales.map(s=>cat(s.art)))].sort();
    cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catEl.appendChild(o)});
  }

  let rows=[...DB.sales].sort(sortSalesNewest).filter(s=>{
    const c=cat(s.art);
    const hay=[s.art,c,s.note||'',String(s.id)].join(' ').toLowerCase();
    if(q&&!hay.includes(q))return false;
    if(from&&s.date<from)return false;
    if(to&&s.date>to)return false;
    if(catF&&c!==catF)return false;
    if(statusF&&s.status!==statusF)return false;
    if(special==='low-margin'&&!(isActiveSale(s)&&margin(s)<30))return false;
    if(special==='missing-note'&&s.note)return false;
    return true;
  });
  const cnt=document.getElementById('sales-count');
  if(cnt)cnt.textContent=rows.length+' Einträge';
  document.getElementById('sales-table').innerHTML=salesTableHTML(rows,{deleteText:true,showDuplicate:false});
}

function statusLabel(status){
  return {versendet:'Versendet',offen:'Offen',storniert:'Storniert',retour:'Retour'}[status]||status;
}

function statusClass(status){
  return {versendet:'badge-sent',offen:'badge-open',storniert:'badge-cancel',retour:'badge-return'}[status]||'badge-open';
}

function deleteSale(id){
  const sale=DB.sales.find(s=>s.id===id);
  if(!sale)return;
  const label=`#${id} · ${sale.art} · ${fmt(sale.rev)} · ${fmtDate(sale.date)}`;
  if(!confirm(`Verkauf ${label} wirklich löschen?\n\nDie Nummern werden danach automatisch neu sortiert. Du kannst direkt danach noch Rückgängig nutzen.`))return;
  const before=cloneData();
  DB.sales=DB.sales.filter(s=>s.id!==id);
  renumberSales();
  commitChange('Verkauf gelöscht',()=>{renderSalesTable();renderDashboard()},before);
}

function refreshCurrentView(){
  if(document.getElementById('page-dashboard').classList.contains('active'))renderDashboard();
  if(document.getElementById('page-sales').classList.contains('active'))renderSalesTable();
  if(document.getElementById('page-charts').classList.contains('active'))renderCharts();
  if(document.getElementById('page-packlist').classList.contains('active'))renderPacklist();
}

function markSaleShipped(id){
  const sale=DB.sales.find(s=>s.id===id);
  if(!sale)return;
  const before=cloneData();
  sale.ship=localDateISO();
  sale.status='versendet';
  commitChange('Als versendet markiert',refreshCurrentView,before);
}

function duplicateSale(id){
  const sale=DB.sales.find(s=>s.id===id);
  if(!sale)return;
  const before=cloneData();
  const nextId=Math.max(0,...DB.sales.map(s=>s.id))+1;
  DB.sales.push(normalizeSale({
    ...sale,
    id:nextId,
    date:localDateISO(),
    ship:null,
    status:'offen',
    note:sale.note?`Kopie von #${sale.id} · ${sale.note}`:`Kopie von #${sale.id}`
  }));
  renumberSales();
  commitChange('Verkauf dupliziert',()=>{renderSalesTable();renderDashboard()},before);
}

function resetSaleForm(){
  ['s-edit-id','s-date','s-shipdate','s-revenue','s-cost','s-profit','s-margin','s-note'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('s-product').value='';
  document.getElementById('s-status').value='offen';
  document.getElementById('s-cost-hint').style.display='none';
  document.getElementById('s-cost-hint').innerHTML='';
  document.getElementById('sale-form-title').textContent='Neuen Verkauf erfassen';
}

function syncShipStatus(){
  const ship=document.getElementById('s-shipdate').value;
  const status=document.getElementById('s-status');
  if(status.value==='storniert'||status.value==='retour')return;
  status.value=ship?'versendet':'offen';
}

function editSale(id){
  const sale=DB.sales.find(s=>s.id===id);
  if(!sale)return;
  nav('new-sale');
  document.getElementById('s-edit-id').value=sale.id;
  document.getElementById('s-date').value=sale.date;
  document.getElementById('s-shipdate').value=sale.ship||'';
  document.getElementById('s-product').value=sale.art;
  if(document.getElementById('s-product').value!==sale.art){
    const option=document.createElement('option');
    option.value=sale.art;
    option.textContent=sale.art;
    document.getElementById('s-product').appendChild(option);
    document.getElementById('s-product').value=sale.art;
  }
  document.getElementById('s-revenue').value=sale.rev;
  document.getElementById('s-cost').value=sale.cost;
  document.getElementById('s-note').value=sale.note||'';
  document.getElementById('s-status').value=sale.status;
  document.getElementById('sale-form-title').textContent='Verkauf #'+sale.id+' bearbeiten';
  document.getElementById('sale-alert').innerHTML='';
  calcSaleProfit();
}

// Maps sale product to expense category
function expCatForProduct(art){
  if(!art)return null;
  const a=art.toLowerCase();
  if(a.includes('hose + tshirt')||a.includes('bundle'))return null; // bundle: manual
  if(a.includes('hose'))return 'Hose';
  if(a.includes('tshirt')||a.includes('shirt'))return 'Tshirt';
  if(a.includes('pullover'))return 'Pullover';
  if(a.includes('armband'))return 'Armband';
  return null;
}

function unitTypesForSale(art){
  const a=(art||'').toLowerCase();
  if(a.includes('hose + tshirt')||a.includes('bundle'))return ['Hose','Tshirt'];
  const type=expCatForProduct(art);
  return type?[type]:[];
}

function fifoBatchForProduct(art,excludeSaleId=null){
  const types=unitTypesForSale(art);
  if(types.length!==1)return null;
  const type=types[0];
  const batches=DB.expenses
    .filter(e=>e.kind!=='sonstige'&&e.product===type&&e.qty>0)
    .sort((a,b)=>new Date(a.date)-new Date(b.date)||a.id-b.id)
    .map(e=>({...e,remaining:e.qty}));
  DB.sales
    .filter(s=>s.id!==excludeSaleId&&isActiveSale(s))
    .sort((a,b)=>new Date(a.date)-new Date(b.date)||a.id-b.id)
    .forEach(s=>{
      unitTypesForSale(s.art).filter(t=>t===type).forEach(()=>{
        const batch=batches.find(b=>b.remaining>0);
        if(batch)batch.remaining-=1;
      });
    });
  return batches.find(b=>b.remaining>0)||null;
}

// Returns {unit, date, qty, note} from the most recent expense entry for this category
function getExpCostForProduct(art){
  const kat=expCatForProduct(art);
  if(!kat||!DB.expenses.length)return null;
  const matches=DB.expenses.filter(e=>e.product===kat).sort((a,b)=>new Date(b.date)-new Date(a.date));
  return matches.length?matches[0]:null;
}

function defaultCostForProduct(art){
  const exp=fifoBatchForProduct(art)||getExpCostForProduct(art);
  if(exp)return exp.unit;
  const product=productByName(art);
  return product?product.cost:0;
}

function onProductSelect(){
  const art=document.getElementById('s-product').value;
  const hint=document.getElementById('s-cost-hint');
  const editId=parseInt(document.getElementById('s-edit-id').value,10)||null;
  const exp=fifoBatchForProduct(art,editId)||getExpCostForProduct(art);
  const stats=priceStats(art);
  if(exp){
    document.getElementById('s-cost').value=exp.unit.toFixed(2);
    hint.style.display='block';
    hint.innerHTML=`<span style="color:var(--accent-text);display:flex;align-items:center;gap:4px"><i class="ti ti-check" style="font-size:12px" aria-hidden="true"></i> FIFO-Einkauf vom ${fmtDate(exp.date)} · ${exp.remaining??exp.qty} verfügbar · €${exp.unit.toFixed(2)} · ${esc(exp.note||exp.product)}</span>${stats?`<br><span style="color:var(--text2)">Bisher Ø ${fmt(stats.avg)} · Spanne ${fmt(stats.min)}-${fmt(stats.max)}</span>`:''}`;
    calcSaleProfit();
  } else {
    const product=productByName(art);
    const noExp=art&&expCatForProduct(art);
    if(product&&product.cost>0){
      hint.style.display='block';
      document.getElementById('s-cost').value=product.cost.toFixed(2);
      hint.innerHTML=`<span style="color:var(--accent-text)">Standard-Rohling aus Produktverwaltung: ${fmt(product.cost)}</span>${stats?`<br><span style="color:var(--text2)">Bisher Ø ${fmt(stats.avg)} · Spanne ${fmt(stats.min)}-${fmt(stats.max)}</span>`:''}`;
    }else if(noExp){
      hint.style.display='block';
      hint.innerHTML=`<span style="color:var(--amber-text)">Noch kein Einkauf für "${esc(noExp)}" erfasst — bitte manuell eingeben.</span>`;
      document.getElementById('s-cost').value='';
    }else{
      hint.style.display='none';
      hint.innerHTML='';
      document.getElementById('s-cost').value='';
    }
    calcSaleProfit();
  }
}

function calcSaleProfit(){
  const r=parseFloat(document.getElementById('s-revenue').value)||0;
  const c=parseFloat(document.getElementById('s-cost').value)||0;
  const p=+(r-c).toFixed(2);
  const m=r>0?+((p/r)*100).toFixed(1):0;
  document.getElementById('s-profit').value=p||'';
  document.getElementById('s-margin').value=m||'';
}

function saveSale(){
  const editId=parseInt(document.getElementById('s-edit-id').value,10);
  const date=document.getElementById('s-date').value;
  const ship=document.getElementById('s-shipdate').value;
  const art=cleanProductName(document.getElementById('s-product').value);
  const rev=parseFloat(document.getElementById('s-revenue').value);
  const cost=parseFloat(document.getElementById('s-cost').value);
  const note=document.getElementById('s-note').value.trim();
  let status=document.getElementById('s-status').value;
  if(!date||!art||isNaN(rev)||isNaN(cost)){
    document.getElementById('sale-alert').innerHTML='<div class="alert" style="background:var(--red-bg);color:var(--red-text)">Bitte alle Felder ausfüllen.</div>';return;
  }
  if(ship&&new Date(ship)<new Date(date)){
    document.getElementById('sale-alert').innerHTML='<div class="alert" style="background:var(--amber-bg);color:var(--amber-text)">Das Versanddatum liegt vor dem Verkaufsdatum. Bitte prüfen.</div>';return;
  }
  if(status!=='storniert'&&status!=='retour'){
    if(!ship)status='offen';
    if(ship)status='versendet';
  }
  const before=cloneData();
  ensureProduct(art,cost);
  if(editId){
    DB.sales=DB.sales.map(s=>s.id===editId?normalizeSale({id:editId,date,ship:ship||null,art,rev,cost,status,note}):s);
  }else{
    const id=Math.max(0,...DB.sales.map(s=>s.id))+1;
    DB.sales.push(normalizeSale({id,date,ship:ship||null,art,rev,cost,status,note}));
  }
  renumberSales();
  commitChange(editId?'Verkauf geändert':'Verkauf gespeichert',()=>{},before);
  document.getElementById('sale-alert').innerHTML='<div class="alert alert-success">Verkauf gespeichert!</div>';
  setTimeout(()=>nav('sales'),1000);
}

function onQuickProductSelect(){
  const art=document.getElementById('q-product').value;
  const cost=defaultCostForProduct(art);
  document.getElementById('q-cost').value=cost?cost.toFixed(2):'';
  const stats=priceStats(art);
  const hint=document.getElementById('q-price-hint');
  if(stats){
    hint.style.display='block';
    hint.textContent=`Bisher Ø ${fmt(stats.avg)} · bester Preis ${fmt(stats.max)} · Ø Gewinn ${fmt(stats.avgProfit)}`;
  }else{
    hint.style.display='none';
    hint.textContent='';
  }
  calcQuickProfit();
}

function calcQuickProfit(){
  const rev=parseFloat(document.getElementById('q-revenue').value)||0;
  const cost=parseFloat(document.getElementById('q-cost').value)||0;
  const p=rev-cost;
  document.getElementById('q-profit').textContent=rev?`Gewinn ${fmt(p)} · Marge ${rev?((p/rev)*100).toFixed(1):0}%`:'Gewinn —';
}

function quickAddSale(){
  const art=cleanProductName(document.getElementById('q-product').value);
  const rev=parseFloat(document.getElementById('q-revenue').value);
  const cost=parseFloat(document.getElementById('q-cost').value);
  const alert=document.getElementById('quick-alert');
  if(!art||isNaN(rev)||isNaN(cost)){
    alert.innerHTML='<div class="alert" style="background:var(--red-bg);color:var(--red-text)">Bitte Produkt, Umsatz und Rohling ausfüllen.</div>';
    return;
  }
  const id=Math.max(0,...DB.sales.map(s=>s.id))+1;
  const before=cloneData();
  ensureProduct(art,cost);
  DB.sales.push(normalizeSale({id,date:localDateISO(),ship:null,art,rev,cost,status:'offen',note:'Schnell erfasst'}));
  renumberSales();
  commitChange('Schnellverkauf gespeichert',()=>{},before);
  document.getElementById('q-revenue').value='';
  document.getElementById('q-cost').value='';
  document.getElementById('q-profit').textContent='Gewinn —';
  alert.innerHTML='<div class="alert alert-success">Offener Verkauf gespeichert.</div>';
  renderDashboard();
}

function cancelMatchingSale(){
  const art=cleanProductName(document.getElementById('c-product').value);
  const rev=parseFloat(document.getElementById('c-revenue').value);
  const alert=document.getElementById('cancel-alert');
  if(!art||isNaN(rev)||rev<=0){
    alert.innerHTML='<div class="alert" style="background:var(--red-bg);color:var(--red-text)">Bitte Produkt und Storno-Betrag ausfüllen.</div>';
    return;
  }
  const matches=DB.sales
    .filter(s=>isActiveSale(s)&&cleanProductName(s.art).toLowerCase()===art.toLowerCase()&&Math.abs((s.rev||0)-rev)<0.01)
    .sort(sortSalesNewest);
  if(!matches.length){
    alert.innerHTML='<div class="alert" style="background:var(--amber-bg);color:var(--amber-text)">Kein passender Verkauf mit diesem Produkt und Betrag gefunden.</div>';
    return;
  }
  if(matches.length>1){
    alert.innerHTML=`<div class="alert" style="background:var(--amber-bg);color:var(--amber-text)">Mehrere passende Verkäufe gefunden. Bitte den richtigen auswählen.</div>
      <div class="return-choice-list">${matches.map(s=>`
        <button class="return-choice" onclick="cancelSaleById(${s.id})">
          <span><strong>#${s.id} · ${esc(s.art)}</strong><br><span class="muted">${fmtDate(s.date)} · ${statusLabel(s.status)}${s.note?' · '+esc(s.note):''}</span></span>
          <strong>${fmt(s.rev)}</strong>
        </button>`).join('')}</div>`;
    return;
  }
  cancelSaleById(matches[0].id);
}

function cancelSaleById(id){
  const sale=DB.sales.find(s=>s.id===id);
  if(!sale)return;
  if(!confirm(`Passenden Verkauf stornieren und löschen?\n\n#${sale.id} · ${sale.art} · ${fmt(sale.rev)} · ${fmtDate(sale.date)}`))return;
  const alert=document.getElementById('cancel-alert');
  const before=cloneData();
  DB.sales=DB.sales.filter(s=>s.id!==sale.id);
  renumberSales();
  commitChange('Storno verbucht',()=>{},before);
  document.getElementById('c-revenue').value='';
  alert.innerHTML=`<div class="alert alert-success">Storno gebucht. Verkauf #${sale.id} wurde entfernt.</div>`;
  renderDashboard();
}

function renderProducts(){
  populateProductSelects();
  const target=document.getElementById('products-table');
  if(!target)return;
  const rows=DB.products.map((p,index)=>({p,index})).sort((a,b)=>a.p.category.localeCompare(b.p.category)||a.p.name.localeCompare(b.p.name));
  target.innerHTML=`<table><thead><tr><th>Produkt</th><th>Kategorie</th><th>Standard</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(({p,index})=>`
    <tr>
      <td>${esc(p.name)}</td>
      <td>${esc(p.category)}</td>
      <td>${p.cost?fmt(p.cost):'—'}</td>
      <td><span class="product-status ${p.active?'':'inactive'}">${p.active?'Aktiv':'Inaktiv'}</span></td>
      <td><button class="btn" onclick="toggleProduct(${index})" style="padding:4px 8px;font-size:11px">${p.active?'Deaktivieren':'Aktivieren'}</button></td>
    </tr>`).join('')}</tbody></table>`;
}

function addProduct(){
  const name=cleanProductName(document.getElementById('p-name').value);
  const category=document.getElementById('p-category').value;
  const cost=parseFloat(document.getElementById('p-cost').value)||0;
  const alert=document.getElementById('product-alert');
  if(!name){alert.innerHTML='<div class="alert" style="background:var(--red-bg);color:var(--red-text)">Bitte Produktname eingeben.</div>';return}
  const before=cloneData();
  const existing=productByName(name);
  if(existing){
    existing.category=category;existing.cost=cost;existing.active=true;
  }else{
    DB.products.push(normalizeProduct({name,category,cost,active:true}));
  }
  commitChange(existing?'Produkt geändert':'Produkt gespeichert',()=>{},before);
  document.getElementById('p-name').value='';
  document.getElementById('p-cost').value='';
  alert.innerHTML='<div class="alert alert-success">Produkt gespeichert.</div>';
  renderProducts();
}

function toggleProduct(index){
  const product=DB.products[index];
  if(!product)return;
  const before=cloneData();
  product.active=!product.active;
  commitChange('Produktstatus geändert',renderProducts,before);
}

function calcExpTotal(){
  const qty=parseInt(document.getElementById('e-qty').value)||0;
  const unit=parseFloat(document.getElementById('e-unit').value)||0;
  document.getElementById('e-total').value=(qty*unit).toFixed(2)||'';
}

function addExpense(){
  const date=document.getElementById('e-date').value;
  const qty=parseInt(document.getElementById('e-qty').value)||0;
  const product=document.getElementById('e-product').value;
  const kind=document.getElementById('e-kind').value;
  const unit=parseFloat(document.getElementById('e-unit').value)||0;
  const note=document.getElementById('e-note').value;
  if(!date||!product||qty<=0||unit<=0){
    document.getElementById('exp-alert').innerHTML='<div class="alert" style="background:var(--red-bg);color:var(--red-text)">Bitte alle Felder ausfüllen.</div>';return;
  }
  const id=Math.max(0,...(DB.expenses.length?DB.expenses.map(e=>e.id):[0]))+1;
  const before=cloneData();
  DB.expenses.push(normalizeExpense({id,date,product,kind,qty,unit,total:+(qty*unit).toFixed(2),note}));
  commitChange('Ausgabe gespeichert',()=>{},before);
  document.getElementById('exp-alert').innerHTML='<div class="alert alert-success">Ausgabe gespeichert!</div>';
  setTimeout(()=>nav('expenses'),1000);
}

function renderExpenses(){
  const exps=DB.expenses;
  const total=exps.reduce((a,e)=>a+(e.total||0),0);
  const stockExps=exps.filter(e=>e.kind!=='sonstige');
  const stockTotal=stockExps.reduce((a,e)=>a+(e.total||0),0);
  const otherTotal=exps.filter(e=>e.kind==='sonstige').reduce((a,e)=>a+(e.total||0),0);
  const qty=stockExps.reduce((a,e)=>a+(e.qty||0),0);
  document.getElementById('exp-metrics').innerHTML=`
    <div class="metric"><div class="metric-label">Gesamtausgaben</div><div class="metric-value" style="color:var(--red)">${fmt(total)}</div><div class="metric-sub">${exps.length} Bestellungen</div></div>
    <div class="metric"><div class="metric-label">Rohlinge gesamt</div><div class="metric-value">${qty}</div><div class="metric-sub">Stück eingekauft</div></div>
    <div class="metric"><div class="metric-label">Ø pro Rohling</div><div class="metric-value">${qty?fmt(stockTotal/qty):fmt(0)}</div></div>
    <div class="metric"><div class="metric-label">Sonstige Kosten</div><div class="metric-value" style="color:var(--red)">${fmt(otherTotal)}</div><div class="metric-sub">ohne Bestand</div></div>
  `;
  if(!exps.length){document.getElementById('exp-table').innerHTML='<div class="empty" style="padding:3rem">Noch keine Ausgaben erfasst.<br><button class="btn btn-primary" onclick="nav(\'new-expense\')" style="margin-top:1rem">Erste Ausgabe hinzufügen</button></div>';return}
  document.getElementById('exp-table').innerHTML=`<table><thead><tr><th>Datum</th><th>Art</th><th>Produkt</th><th>Anzahl</th><th>€/Stück</th><th>Gesamt</th><th>Notiz</th><th></th></tr></thead><tbody>${exps.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>`
    <tr><td>${fmtDate(e.date)}</td><td>${e.kind==='sonstige'?'Sonstige':'Rohling'}</td><td>${esc(e.product)}</td><td>${e.qty}</td><td>${fmt(e.unit)}</td><td class="profit-neg">${fmt(e.total)}</td><td style="color:var(--text2);font-size:12px">${e.note?esc(e.note):'—'}</td><td><button class="btn btn-danger" onclick="deleteExp(${e.id})" style="padding:4px 8px;font-size:11px"><i class="ti ti-trash" aria-hidden="true"></i></button></td></tr>`).join('')}</tbody></table>`;
}

function deleteExp(id){
  if(!confirm('Ausgabe löschen?'))return;
  const before=cloneData();
  DB.expenses=DB.expenses.filter(e=>e.id!==id);
  commitChange('Ausgabe gelöscht',renderExpenses,before);
}

let currentChartTab='monthly';
function switchChartTab(t){
  currentChartTab=t;
  const tabs=['monthly','product','margin','status','patterns'];
  document.querySelectorAll('.tab').forEach((el,i)=>{el.classList.toggle('active',tabs[i]===t)});
  tabs.forEach(x=>{const section=document.getElementById('chart-'+x);if(section)section.style.display=x===t?'block':'none'});
  renderCharts();
}

function renderCharts(){
  const s=DB.sales.filter(isActiveSale);
  if(currentChartTab==='monthly'){
    const months={};
    s.forEach(x=>{const m=x.date.slice(0,7);if(!months[m])months[m]={rev:0,profit:0,count:0};months[m].rev+=realizedRevenue(x);months[m].profit+=profit(x);months[m].count++});
    const mks=Object.keys(months).sort();
    destroyChart('monthlyChart');
    charts['monthlyChart']=new Chart(document.getElementById('monthlyChart'),{
      type:'bar',data:{labels:mks.map(m=>{const[y,mo]=m.split('-');const mn=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];return mn[+mo-1]+' '+y.slice(2)}),datasets:[
        {label:'Umsatz',data:mks.map(m=>+months[m].rev.toFixed(2)),backgroundColor:'#B5D4F4'},
        {label:'Gewinn',data:mks.map(m=>+months[m].profit.toFixed(2)),backgroundColor:'#5DCAA5'},
      ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},boxWidth:12}}},scales:{y:{ticks:{callback:v=>'€'+v}}}}
    });
    destroyChart('countChart');
    charts['countChart']=new Chart(document.getElementById('countChart'),{
      type:'line',data:{labels:mks.map(m=>{const[y,mo]=m.split('-');const mn=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];return mn[+mo-1]}),datasets:[{label:'Verkäufe',data:mks.map(m=>months[m].count),borderColor:'#7F77DD',backgroundColor:'#EEEDFE',fill:true,tension:0.3,borderWidth:2}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{stepSize:5}}}}
    });
  }
  if(currentChartTab==='product'){
    const pMap={};s.forEach(x=>{const c=cat(x.art);if(!pMap[c])pMap[c]={rev:0,profit:0};pMap[c].rev+=realizedRevenue(x);pMap[c].profit+=profit(x)});
    const prods=Object.entries(pMap).sort((a,b)=>b[1].rev-a[1].rev).slice(0,8);
    const colors=['#378ADD','#1D9E75','#BA7517','#D4537E','#7F77DD','#D85A30','#639922','#E24B4A'];
    destroyChart('prodRevChart');
    charts['prodRevChart']=new Chart(document.getElementById('prodRevChart'),{type:'bar',data:{labels:prods.map(p=>p[0]),datasets:[{label:'Umsatz',data:prods.map(p=>+p[1].rev.toFixed(2)),backgroundColor:colors}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>'€'+v}}}}});
    destroyChart('prodProfitChart');
    charts['prodProfitChart']=new Chart(document.getElementById('prodProfitChart'),{type:'bar',data:{labels:prods.map(p=>p[0]),datasets:[{label:'Gewinn',data:prods.map(p=>+p[1].profit.toFixed(2)),backgroundColor:'#5DCAA5'}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>'€'+v}}}}});
  }
  if(currentChartTab==='margin'){
    const pMap={};
    s.forEach(x=>{const c=cat(x.art);if(!pMap[c])pMap[c]={rev:[],cost:[],count:0};pMap[c].rev.push(realizedRevenue(x));pMap[c].cost.push(realizedCost(x));pMap[c].count++});
    const prods=Object.entries(pMap).sort((a,b)=>b[1].count-a[1].count).slice(0,8);
    const avgRev=p=>p[1].rev.reduce((a,v)=>a+v,0)/p[1].rev.length;
    const avgCost=p=>p[1].cost.reduce((a,v)=>a+v,0)/p[1].cost.length;
    destroyChart('marginChart');
    charts['marginChart']=new Chart(document.getElementById('marginChart'),{type:'bar',data:{labels:prods.map(p=>p[0]),datasets:[
      {label:'Ø Rohling',data:prods.map(p=>+avgCost(p).toFixed(2)),backgroundColor:'#F5C4B3'},
      {label:'Ø Verkaufspreis',data:prods.map(p=>+avgRev(p).toFixed(2)),backgroundColor:'#1D9E75'},
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},boxWidth:12}}},scales:{y:{ticks:{callback:v=>'€'+v}}}}});
  }
  if(currentChartTab==='status'){
    const statuses=['offen','versendet','retour','storniert'];
    const statusCounts=statuses.map(st=>DB.sales.filter(sale=>sale.status===st).length);
    destroyChart('statusChart');
    charts['statusChart']=new Chart(document.getElementById('statusChart'),{
      type:'doughnut',
      data:{labels:statuses.map(statusLabel),datasets:[{data:statusCounts,backgroundColor:['#F0B13A','#1D9E75','#378ADD','#D45353'],borderWidth:0}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},boxWidth:12}}}}
    });

    const {bought,sold,types}=stockStats();
    const stockRows=types.map(t=>({type:t,left:(bought[t]||0)-(sold[t]||0)})).sort((a,b)=>a.left-b.left);
    destroyChart('stockChart');
    charts['stockChart']=new Chart(document.getElementById('stockChart'),{
      type:'bar',
      data:{labels:stockRows.map(x=>x.type),datasets:[{label:'Bestand',data:stockRows.map(x=>x.left),backgroundColor:stockRows.map(x=>x.left<0?'#D45353':x.left<5?'#F0B13A':'#1D9E75')}]},
      options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{stepSize:1}}}}
    });
  }
  if(currentChartTab==='patterns'){
    const days=['Mo','Di','Mi','Do','Fr','Sa','So'];
    const weekdayCounts=[0,0,0,0,0,0,0];
    s.forEach(sale=>{
      const day=new Date(sale.date+'T00:00:00');
      if(Number.isNaN(day.getTime()))return;
      weekdayCounts[(day.getDay()+6)%7]++;
    });
    destroyChart('weekdayChart');
    charts['weekdayChart']=new Chart(document.getElementById('weekdayChart'),{
      type:'bar',
      data:{labels:days,datasets:[{label:'Verkäufe',data:weekdayCounts,backgroundColor:'#7F77DD'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{stepSize:1}}}}
    });

    const points=sortSalesNewest(s).slice(0,120).map(sale=>({x:+realizedRevenue(sale).toFixed(2),y:+profit(sale).toFixed(2),product:cat(sale.art)}));
    destroyChart('priceProfitChart');
    charts['priceProfitChart']=new Chart(document.getElementById('priceProfitChart'),{
      type:'scatter',
      data:{datasets:[{label:'Verkauf',data:points,backgroundColor:'#1D9E75'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.raw.product}: Preis ${fmt(ctx.raw.x)}, Gewinn ${fmt(ctx.raw.y)}`}}},scales:{x:{title:{display:true,text:'Preis'},ticks:{callback:v=>'€'+v}},y:{title:{display:true,text:'Gewinn'},ticks:{callback:v=>'€'+v}}}}
    });
  }
}

async function initApp(){
  DB=await loadData();
  if(renumberSales())saveData();
  renderDashboard();
}

// Init
initApp();
