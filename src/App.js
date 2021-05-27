import React from 'react';
import { DynamicLoader } from 'bcdice';
import InputArea from './InputArea/InputArea.js';
import ChatLogs from './Logs/ChatLogs.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        logs: [],
        currentSystem: 'DiceBot',
        memo: 'メモ帳:ログの発言をダブルクリックするとここに転記されるよ'
    };
    this.loader = new DynamicLoader();
    this.updateMemo = this.updateMemo.bind(this);
    this.onEditMemo = this.onEditMemo.bind(this);
    this.catchMessage = this.catchMessage.bind(this);
    this.updateSystem = this.updateSystem.bind(this);
    this.systemList = this.loader.listAvailableGameSystems().sort((a,b)=>{
      if(a.sortKey > b.sortKey) {return 1} else {return -1}
    }).map((sys, i)=>{
      return(
        <option
          key={i}
          value={sys.id}
        >{sys.name}</option>
      );
    })
  }
  onEditMemo(e) {
    this.setState({
      logs: this.state.logs,
      currentSystem: this.state.currentSystem,
      memo: e.target.value
    });
  }

  updateMemo(message) {
    this.setState({
      logs: this.state.logs,
      currentSystem: this.state.currentSystem,
      memo: `${message.name}\n${message.content}\n----------\n${this.state.memo}`
    });
  }

  catchMessage(message) {
    this.loader.dynamicLoad(this.state.currentSystem).then((system)=>{
      const diceResult = system.eval(message.content);
      const logs = this.state.logs.slice();
      const newText = diceResult ? `${message.content}\n${diceResult.text}` : message.content;
      logs.push({
        name: message.name,
        content: newText
      });
      this.setState({
        currentSystem: this.state.currentSystem,
        logs: logs,
        memo: this.state.memo
      });
    });
  }

  async updateSystem(e) {
    this.setState({
      logs: this.state.logs,
      currentSystem: e.target.value,
      memo: this.state.memo
    });
  }

  render() {
    return (
      <div className="App">
        <ChatLogs
          logs={this.state.logs}
          onRequest={this.updateMemo}
        ></ChatLogs>
        <InputArea
          getMessage={this.catchMessage}
        ></InputArea>
        <select
          onChange={this.updateSystem}
          className="systemList"
          value={this.state.currentSystem}
        >{this.systemList}</select>
        <textarea
          className="notepad"
          value={this.state.memo}
          onInput={this.onEditMemo}
        ></textarea>
        <footer>
          <p>BCDice が振れる1人用疑似チャット。サーバとかとの通信はないので模擬戦とかしたいけど何かの事情で情報を外に送りたくないときなどにどうぞ<br/>
          出力結果は<a href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/LogEditor.html" target="_blank" rel="noreferrer">こちらのエディタ</a>で編集できます</p>
          <p><a href="https://github.com/Shunshun94/InternalChat" target="_blank" rel="noreferrer">リポジトリ</a> / <a href="https://twitter.com/Shunshun94" target="_blank" rel="noreferrer">作者連絡先（Twitter）</a> / <a href="https://amzn.asia/8mNqdKy" target="_blank" rel="noreferrer">作者欲しい物リスト</a></p>
        </footer>
      </div>
    );
  }
}

export default App;
