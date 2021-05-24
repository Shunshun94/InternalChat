import React from 'react';
import { render } from 'react-dom';
import { DynamicLoader, Version } from 'bcdice';
import InputArea from './InputArea/InputArea.js';
import ChatLogs from './Logs/ChatLogs.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        logs: [],
        currentSystem: 'DiceBot'
    };
    this.loader = new DynamicLoader();
    this.catchMessage = this.catchMessage.bind(this);
    this.updateSystem = this.updateSystem.bind(this);
    this.systemList = this.loader.listAvailableGameSystems().sort((a,b)=>{
      if(a.sortKey > b.sortKey) {return 1}
      if(a.sortKey < b.sortKey) {return -1}
    }).map((sys, i)=>{
      return(
        <option
          key={i}
          value={sys.id}
        >{sys.name}</option>
      );
    })
  }

  catchMessage(message) {
    console.log('catch', message, this.state.currentSystem);
  }

  updateSystem(e) {
    this.setState({
      logs: this.state.logs,
      currentSystem: e.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <ChatLogs
          logs={this.state.logs}
        ></ChatLogs>
        <InputArea
          getMessage={this.catchMessage}
        ></InputArea>
        <select
          onChange={this.updateSystem}
          className="systemList"
          value={this.state.currentSystem}
        >{this.systemList}</select>
      </div>
    );
  }
}

export default App;
