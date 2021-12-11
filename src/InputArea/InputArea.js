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


class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content: '',
            nameList: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.onPushTab = this.onPushTab.bind(this);
        this.editContent = this.editContent.bind(this);
        this.editName = this.editName.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.setName = this.setName.bind(this);
        this.nameRef = React.createRef();
        this.contentRef = React.createRef();
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

    onFocus(e) {
        this.setState({
            name: '',
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
            nameList: [...new Set(names)]
        });
    }

    onPushTab(e) {
        if(e.key !== 'Tab') {
            return;
        }
        e.preventDefault();
        
        if(e.target.className === 'inputArea-content-input') {
            this.nameRef.current.focus()
        } else {
            this.contentRef.current.focus();
        }
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
            </div>
        </div>);
    }
}

export default InputArea;