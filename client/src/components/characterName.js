const charName = [
  'Kvothe',
  'Hemme',
  'Herma',
  'Aaron',
  'Abenthy',
  'Aethe',
  'Alder',
  'Aleph',
  'Alleg',
  'Ambrose',
  'Amlia',
  'Anisat',
  'Anker',
  'Arliden',
  'Arthur',
  'Arwyl',
  'Auri',
  'Greyfallow',
  'Jakis',
  'Basil',
  'Bast',
  'Ben_Bentley',
  'Benjamin',
  'Bil',
  'Brandeur',
  'Brann',
  'Brean',
  'Bredon',
  'Brenden',
  'Caleb',
  'Cammar',
  'Carceret',
  'Carter',
  'Caudicus',
  'Caverin',
  'Celean',
  'Cinder',
  'Crazy_Martin',
  'Cyphus',
  'Daeln',
  'Dagon',
  'Dedan',
  'Denna',
  'Dennais',
  'Deoch',
  'Derrik',
  'Devan',
  'Devi',
  'Drenn',
  'Ellie',
  'Elodin',
  'Elxa',
  'Emberlee',
  'Encanis',
  'Ensal',
  'Erlus',
  'Fela',
  'Felurian',
  'Fenton',
  'Finol',
  'Gel',
  'Gerrek',
  'Graham',
  'Gran',
  'Gregan',
  'Haliax',
  'Hap',
  'Hespe',
  'Hetera',
  'Iax',
  'Illien',
  'Inyssa',
  'Jacob',
  'Jake',
  'Jamison',
  'Jane',
  'Jarret',
  'Jasom',
  'Jason',
  'Jaxim',
  'Jenna',
  'Jessom',
  'Josn',
  'Kale',
  'Katie',
  'Kilvin',
  'Kostrel',
  'Krin',
  'Kvothe',
  'Laclith',
  'Lanre',
  'Larel',
  'Laren',
  'Lasrel',
  'Laurel',
  'Laurian',
  'Lerand',
  'Lily',
  'Loni',
  'Losine',
  'Lyra',
  'Magwyn',
  'Mandrag',
  'Manet',
  'Marea',
  'Marie',
  'Marten',
  'Mary',
  'Ash',
  'Mayor_Anwater',
  'Mayor_Lant',
  'Meluan',
  'Meradin',
  'Mola',
  'Mr_Walker',
  'Mrs_Walker',
  'Naden',
  'Nalto',
  'Nathan',
  'Netalia',
  'Old_Cob',
  'Oren',
  'Otto',
  'Penny',
  'Penthe',
  'Perial',
  'Pete',
  'Pike',
  'Princess_Icing_Bun',
  'Remmen',
  'Reta',
  'Rethe',
  'Rian',
  'Riem',
  'Rike',
  'Roderic',
  'Roent',
  'Selitos',
  'Sephran',
  'Seth',
  'Shandi',
  'Shehyn',
  'Shep',
  'Simmon',
  'Savien',
  'Skarpi',
  'Skoivan',
  'Sleat',
  'Sovoy',
  'Stanchion',
  'Stapes',
  'Syl',
  'Taborlin',
  'Tam',
  'Tanee',
  'Teccam',
  'Tehlu',
  'Tempi',
  'Teren',
  'Cthaeh',
  'Tim',
  'Trapis',
  'Trip',
  'Uresh',
  'Vashet',
  'Verainia',
  'Viari',
  'Viette',
  'Vin',
  'Widow_Creel',
  'Wilem',
];

const generateCharacterName = () => {
  const personCharName = charName[Math.floor(Math.random() * charName.length)];
  return `${personCharName}_${Math.random().toString(36).slice(2,4)}`
};

export default generateCharacterName;