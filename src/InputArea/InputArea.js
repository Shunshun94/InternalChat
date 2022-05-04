import React from 'react';
import CharacterHandler from './characterHandler.js';

class NameSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectName = this.onSelectName.bind(this);
    }
    onSelectName(e) {
        this.props.setName(e.target.innerText);
    }

    render() {
        const list = this.props.nameList.map((name, i)=>{
            return (
                <option
                    key={i}
                    className="inputArea-nameSelector-name"
                    value={name}
                >{name}</option>
            );
        });
        return (
            <datalist
                className="inputArea-nameSelector"
                id="inputArea-nameSelector"
            >
                {list}
            </datalist>
        );
    }
}
// 
class CommandSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const list = this.props.commandList.map((command, i)=>{
            return (
                <option
                    key={i}
                    className="inputArea-nameSelector-name"
                    value={command.label}
                >{command.value}</option>
            );
        });
        return (
            <datalist
                className="inputArea-commandSelector"
                id="inputArea-commandSelector"
            >
                {list}
            </datalist>
        );
    }
}


class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content: '',
            smallchat: '',
            nameList: [],
            characters: {},
            commandSuggestion: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.sendSmallMessage = this.sendSmallMessage.bind(this);
        this.onPushTab = this.onPushTab.bind(this);
        this.editContent = this.editContent.bind(this);
        this.editSmallChat = this.editSmallChat.bind(this);
        this.editName = this.editName.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.setName = this.setName.bind(this);
        this.importFromClipboard = this.importFromClipboard.bind(this);
        this.getCommandSuggestion = this.getCommandSuggestion.bind(this);
        this.nameRef = React.createRef();
        this.contentRef = React.createRef();
        this.smallchatRef = React.createRef();
    }

    getCommandSuggestion(name) {
        const map = this.state.characters[name];
        if(map) {
            const resources = [];
            for(var label in map.status) {
                resources.push({label: `:${label}`, value: map.status[label]});
            }
            return map.commands.map((l)=>{return {label: l, value: ''}}).concat(resources);
        } else {
            return [];
        }
    }

    setName(name) {
        this.setState({
            name: name,
            content: this.state.content,
            smallchat: this.state.smallchat,
            nameList: this.state.nameList,
            characters: this.state.characters,
            commandSuggestion: this.getCommandSuggestion(name)
        });
    }

    editName(e) {
        this.setState({
            name: e.target.value,
            content: this.state.content,
            smallchat: this.state.smallchat,
            nameList: this.state.nameList,
            characters: this.state.characters,
            commandSuggestion: this.getCommandSuggestion(e.target.value)
        });
    }

    onFocus(e) {
        this.setState({
            name: '',
            content: this.state.content,
            smallchat: this.state.smallchat,
            nameList: this.state.nameList,
            characters: this.state.characters,
            commandSuggestion: []
        });
    }
    editSmallChat(e) {
        this.setState({
            name: this.state.name,
            content: this.state.content,
            smallchat: e.target.value,
            nameList: this.state.nameList,
            characters: this.state.characters,
            commandSuggestion: this.state.commandSuggestion
        });
    }
    editContent(e) {
        this.setState({
            name: this.state.name,
            content: e.target.value,
            smallchat: this.state.smallchat,
            nameList: this.state.nameList,
            characters: this.state.characters,
            commandSuggestion: this.state.commandSuggestion
        });
    }

    sendSmallMessage(e) {
        if(e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        if(
            ['', '[]', "''", '""', '「」'].includes(this.state.smallchat.trim()) &&
            (! Boolean(window.confirm('多分誤送信です。それでも送信しますか？')))) {
            return;
        }
        const modifyResult = CharacterHandler.handleTextMessage(this.state.smallchat, this.state.characters[this.state.name]);
        const characters = JSON.parse(JSON.stringify(this.state.characters));
        characters[this.state.name] = JSON.parse(JSON.stringify(modifyResult.character));
        (this.props.getMessage || console.log)({
            name: this.state.name,
            content: modifyResult.text
        });
        const names = this.state.nameList.slice();
        names.unshift(this.state.name);
        this.setState({
            name: this.state.name,
            content: this.state.content,
            smallchat: '',
            nameList: [...new Set(names)],
            characters: characters,
            commandSuggestion: this.state.commandSuggestion
        });
    }

    sendMessage(e) {
        if(e.key !== 'Enter') {
            return;
        }
        if(e.shiftKey) {
            return;
        }
        e.preventDefault();
        if(
            ['', '[]', "''", '""', '「」'].includes(this.state.content.trim()) &&
            (! Boolean(window.confirm('多分誤送信です。それでも送信しますか？')))) {
            return;
        }
        (this.props.getMessage || console.log)({
            name: this.state.name,
            content: this.state.content.trim()
        });
        const names = this.state.nameList.slice();
        names.unshift(this.state.name);
        this.setState({
            name: this.state.name,
            content: '',
            smallchat: this.state.smallchat,
            nameList: [...new Set(names)],
            characters: this.state.characters,
            commandSuggestion: this.state.commandSuggestion
        });
    }

    onPushTab(e) {
        if(e.key !== 'Tab') {
            return;
        }
        e.preventDefault();

        if(e.target.className === 'inputArea-name-input') {
            this.contentRef.current.focus();
        } else if(e.target.className === 'inputArea-content-input') {
            this.smallchatRef.current.focus();
        } else {
            this.nameRef.current.focus()            
        }
    }

    importFromClipboard(e) {
        navigator.clipboard.readText().then((text)=>{
            const json = JSON.parse(text).data;
            const name = json.name;
            const names = this.state.nameList.slice();

            const characters = JSON.parse(JSON.stringify(this.state.characters));
            characters[name] = CharacterHandler.jsonToCharacterData(json);

            names.unshift(name);
            this.setState({
                name: this.state.name,
                content: this.state.content,
                smallchat: this.state.smallchat,
                nameList: [...new Set(names)],
                characters: characters,
                commandSuggestion: this.state.commandSuggestion
            });
        });
    }

    render() {
        return(<div
            className="inputArea"
            onKeyDown={this.onPushTab}
        >
            <NameSelector
                nameList={this.state.nameList}
                setName={this.setName}
            ></NameSelector>
            <div
                className="inputArea-name"
            >
                発言者 <input
                    type="text"
                    ref={this.nameRef}
                    className="inputArea-name-input"
                    list="inputArea-nameSelector"
                    value={this.state.name}
                    onChange={this.editName}
                    onFocus={this.onFocus}
                />
            </div>
            <p
                className="inputArea-explanation"
            >Enter で送信 / Shift+Enter で改行</p>
            <div
                className="inputArea-content"
            >
                <textarea
                    ref={this.contentRef}
                    className="inputArea-content-input"
                    value={this.state.content}
                    onKeyDown={this.sendMessage}
                    onChange={this.editContent}
                >
                </textarea>
                <input
                    type="text"
                    ref={this.smallchatRef}
                    className="inputArea-smallchat-input"
                    list="inputArea-commandSelector"
                    value={this.state.smallchat}
                    onKeyDown={this.sendSmallMessage}
                    onChange={this.editSmallChat}
                />
                <CommandSelector
                    commandList={this.state.commandSuggestion}
                ></CommandSelector>
            </div>
            <div
                className="inputArea-import"
            >
                <button
                    onClick={this.importFromClipboard}
                    title="クリップボードからココフォリアの Clipborad API 形式の情報をインポートします"
                >クリップボードからインポート</button>
            </div>
        </div>);
    }
}

export default InputArea;