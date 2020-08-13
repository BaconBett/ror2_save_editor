import React, { Component } from "react";
import ReactDOM from "react-dom";

import RoR2Profile from './ror2profile.js';


const userProfile = new RoR2Profile();
console.log(userProfile);



class TestComponent extends Component {
	render() {
		return (<div>test component</div>);
	}
}


ReactDOM.render(<TestComponent/>, document.getElementById('container'));