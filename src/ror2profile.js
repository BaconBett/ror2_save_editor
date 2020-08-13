import * as data from './ror2data.js';

const parser = new DOMParser(); 


export default class RoR2Profile {
	constructor() {
		this.name = '';
		this.coins = 0;
		this.achievementsList = {};
		this.discoveredPickups = {};
		this.unlocks = {};

		this.setupList('achievementsList');
		this.setupList('discoveredPickups');
		this.setupUnlocks('characters', 1);
		this.setupUnlocks('items', 1);
		this.setupUnlocks('monsterLogs', 1);
		this.setupUnlocks('environmentLogs', 2);
		this.setupUnlocks('skills', 1, 2);
		this.setupUnlocks('skins', 1, 2);
	}

	setupList(sectionName) {
		let list = data[sectionName].split(' ');
		for (const i of list) {
			this[sectionName][i] = false;
		}
	}

	setupUnlocks(sectionName, splitNameIndexA, splitNameIndexB) {
		this.unlocks[sectionName] = {};
		let list = parser.parseFromString(`<root>${data.unlocks[sectionName]}</root>`, 'text/xml').getElementsByTagName('unlock');

		for (const i in list) {
			if (list[i].innerHTML === undefined) continue; 

			let s = list[i].innerHTML.split('.');

			let name = `${s[splitNameIndexA]}`
			if (splitNameIndexB)
				name = `${s[splitNameIndexA]}.${s[splitNameIndexB]}`

			this.unlocks[sectionName][name] = {
				isUnlocked: false,
				insert: list[i].outerHTML,
			}
		}
	}
}