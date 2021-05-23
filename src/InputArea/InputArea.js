import React from 'react';

class NameSelector extends React.Component {
    render() {
        const list = this.props.nameList.map((name, i)=>{
            return (
                <span
                    key={i}
                    className="inputArea-nameSelector-name"
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
    }

    editName(e) {
        this.setState({
            name: e.target.value,
            content: this.state.content
        });
    }

    editContent(e) {
        this.setState({
            name: this.state.name,
            content: e.target.value
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
        this.setState({
            name: this.state.name,
            content: ''
        });
    }

    render() {
        return(<div
            className="inputArea"
        >
            <NameSelector
                nameList={this.state.nameList}
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
            <div
                className="inputArea-content"
            >
                <textarea
                    type="text"
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