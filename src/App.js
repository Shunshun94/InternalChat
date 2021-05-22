import React from 'react';
import { render } from 'react-dom';
import InputArea from './InputArea/InputArea.js';
import ChatLogs from './Logs/ChatLogs.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        logs: []
    };
  }

  render() {
    return (
      <div className="App">
        <ChatLogs
          logs={this.state.logs}
        ></ChatLogs>
        <InputArea></InputArea>
      </div>
    );
  }
}

export default App;
