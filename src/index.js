import React, { Component } from "react";
import ReactDOM from "react-dom";

import './style.css';

import RoR2Profile from './ror2profile.js';

const parser = new DOMParser(); 
// const userProfile = new RoR2Profile();
// console.log(userProfile);


class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xmlText: '',
      userProfile: new RoR2Profile(),
    }

    this.handlePaste = this.handlePaste.bind(this);
    this.handleCopy = this.handleCopy.bind(this);

    this.handleUnlockChanged = this.handleUnlockChanged.bind(this);
  }

  handlePaste() {
    let text = event.clipboardData.getData('text');
    let xml = parser.parseFromString(text, 'text/xml').getElementsByTagName('UserProfile')[0];
    if (xml === undefined) {
      this.setState({xmlText: 'Something went wrong! Remember to copy all of the text in your save file. If your file is corrupted, just create a new one.'});
      return;
    }
    this.state.userProfile.refreshProfile(xml);
    this.setState({xmlText: '<?xml version="1.0" encoding="utf-8"?>' + new XMLSerializer().serializeToString(xml)});
  }
  handleCopy() {
    event.target.select();
  }

  handleUnlockChanged() {
    let xml = parser.parseFromString(this.state.xmlText, 'text/xml').getElementsByTagName('UserProfile')[0];

    switch(event.target.type) {
      case 'text': {
          this.state.userProfile[event.target.name] = event.target.value;
          xml.getElementsByTagName(event.target.name)[0].innerHTML = event.target.value;
        }
        break;
      case 'checkbox' : {
          let name = event.target.name.split('-');
          const unlock = this.state.userProfile[name[0]][name[1]]

          unlock.isUnlocked = event.target.checked;

          let tag = 'stats';
          if (name[0] == 'achievementsList') tag = 'achievementsList';
          if (name[0] == 'discoveredPickups') tag = 'discoveredPickups';
          let element = xml.getElementsByTagName(tag)[0];
          let insert = (tag=='stats'?'':' ') + unlock.insert;

          if (event.target.checked)
            element.innerHTML += insert
          else {
            element.innerHTML = element.innerHTML.replace(insert, '');
            // element.innerHTML = element.innerHTML.trim();
          }
        }
        break;
    }

    this.setState({xmlText: '<?xml version="1.0" encoding="utf-8"?>' + new XMLSerializer().serializeToString(xml)});
  }

  render() {
    function list(sectionName, displayName) {
      let l = [];

      for (const [key, value] of Object.entries(this.state.userProfile[sectionName])) {
        l.push(
          <label>
            <input key={key} type='checkbox' name={`${sectionName}-${key}`} onChange={this.handleUnlockChanged} checked={value.isUnlocked}/>
            {`${displayName}.${key}`}
          </label>);
      }

      return l;
    }
    list = list.bind(this);


    return (
      <div>
        <textarea value={this.state.xmlText} onChange={()=>{}} onPaste={this.handlePaste} onCopy={this.handleCopy}/>
        <div id='inspector'>
          <label>Name:<input type='text' name='name' onChange={this.handleUnlockChanged} value={this.state.userProfile.name}/></label>
          <label>Coins:<input type='text' name='coins' onChange={this.handleUnlockChanged} value={this.state.userProfile.coins}/>*Type whole numbers only!</label>
          <div className='unlockSection'>ACHIEVEMENTS<div className='unlockSection-list'>{list('achievementsList', 'Achievements')}</div></div>
          <div className='unlockSection'>DISCOVERED PICKUPS<div className='unlockSection-list'>{list('discoveredPickups', 'DiscoveredPickups')}</div></div>
          <div className='unlockSection'>CHARACTERS<div className='unlockSection-list'>{list('characters', 'Characters')}</div></div>
          <div className='unlockSection'>SKILLS<div className='unlockSection-list'>{list('skills', 'Skills')}</div></div>
          <div className='unlockSection'>SKINS<div className='unlockSection-list'>{list('skins', 'Skins')}</div></div>
          <div className='unlockSection'>MONSTER LOGS<div className='unlockSection-list'>{list('monsterLogs', 'MonsterLogs')}</div></div>
          <div className='unlockSection'>ENVIRONMENT LOGS<div className='unlockSection-list'>{list('environmentLogs', 'EnvironmentLogs')}</div></div>
        </div>
      </div>
    );
  }
}



ReactDOM.render(<Editor />, document.getElementById('container'));