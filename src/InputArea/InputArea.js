import React from 'react';

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
                <span
                    key={i}
                    className="inputArea-nameSelector-name"
                    onClick={this.onSelectName}
                >{name}</span>
            );
        });
        return (
            <div
                className="inputArea-nameSelector"
            >
                {list}
            </div>
        );
    }
}


class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content: '',
            nameList: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.editContent = this.editContent.bind(this);
        this.editName = this.editName.bind(this);
        this.setName = this.setName.bind(this);
    }

    setName(name) {
        this.setState({
            name: name,
            content: this.state.content,
            nameList: this.state.nameList
        });
    }

    editName(e) {
        this.setState({
            name: e.target.value,
            content: this.state.content,
            nameList: this.state.nameList
        });
    }

    editContent(e) {
        this.setState({
            name: this.state.name,
            content: e.target.value,
            nameList: this.state.nameList
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
        (this.props.getMessage || console.log)({
            name: this.state.name,
            content: this.state.content
        });
        const names = this.state.nameList.slice();
        names.unshift(this.state.name);
        this.setState({
            name: this.state.name,
            content: '',
            nameList: [...new Set(names)]
        });
    }

    render() {
        return(<div
            className="inputArea"
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
                    className="inputArea-name-input"
                    value={this.state.name}
                    onChange={this.editName}
                />
            </div>
            <p
                className="inputArea-explanation"
            >Enter で送信 / Shift+Enter で改行</p>
            <div
                className="inputArea-content"
            >
                <textarea
                    className="inputArea-content-input"
                    value={this.state.content}
                    onKeyDown={this.sendMessage}
                    onChange={this.editContent}
                >
                </textarea>
            </div>
        </div>);
    }
}

export default InputArea;