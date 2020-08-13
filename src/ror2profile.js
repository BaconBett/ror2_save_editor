import * as data from './ror2data.js';

const parser = new DOMParser(); 


export default class RoR2Profile {
  constructor() {
    this.name = '';
    this.coins = 0;
    this.setupList('achievementsList');
    this.setupList('discoveredPickups');
    this.setupUnlocks('characters', 1);
    this.setupUnlocks('items', 1);
    this.setupUnlocks('monsterLogs', 1);
    this.setupUnlocks('environmentLogs', 2);
    this.setupUnlocks('skills', 2);
    this.setupUnlocks('skins', 1, 2);
  }

  setupList(sectionName) {
    this[sectionName] = {};
    let list = data[sectionName].split(' ');
    for (const i of list) {
      this[sectionName][i] = {
        isUnlocked: false,
        insert: i,
      };
    }
  }

  setupUnlocks(sectionName, splitNameIndexA, splitNameIndexB) {
    this[sectionName] = {};
    let list = parser.parseFromString(`<root>${data[sectionName]}</root>`, 'text/xml').getElementsByTagName('unlock');

    for (const i in list) {
      if (list[i].innerHTML === undefined) continue; 

      let s = list[i].innerHTML.split('.');

      let name = `${s[splitNameIndexA]}`
      if (splitNameIndexB)
        name = `${s[splitNameIndexA]}.${s[splitNameIndexB]}`

      this[sectionName][name] = {
        isUnlocked: false,
        insert: list[i].outerHTML,
      }
    }
  }

  refreshProfile(xml) {
    this.name = xml.getElementsByTagName('name')[0].innerHTML; 
    this.coins = xml.getElementsByTagName('coins')[0].innerHTML;

    let achievementsList = xml.getElementsByTagName('achievementsList')[0].innerHTML.split(' ');
    for (const a of achievementsList) {
      if (a !== '')
        this.achievementsList[a].isUnlocked = true;
    }

    let discoveredPickups = xml.getElementsByTagName('discoveredPickups')[0].innerHTML.split(' ');
    for (const a of discoveredPickups) {
      if (a !== '')
        this.discoveredPickups[a].isUnlocked = true;
    }

    let unlocks = xml.getElementsByTagName('unlock');
    for (const a of unlocks) {
      let name = a.innerHTML.split('.');

      switch(name[0]) {
        case 'Characters': this.characters[name[1]].isUnlocked = true; break;
        case 'Items': this.items[name[1]].isUnlocked = true; break;
        case 'Logs': 
          switch(name[1]) {
            case 'Stages': this.environmentLogs[name[2]].isUnlocked = true; break;
            default: this.monsterLogs[name[1]].isUnlocked = true; break;
          }
          break;
        case 'Skills': this.skills[name[2]].isUnlocked = true; break;
        case 'Skins': this.skins[`${name[1]}.${name[2]}`].isUnlocked = true; break;
      }
    }
  }
}