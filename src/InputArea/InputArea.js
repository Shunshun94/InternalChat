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
                />
            </div>
            <div
                className="inputArea-content"
            >
                <textarea
                    type="text"
                    className="inputArea-content-input"
                    value={this.state.content}
                >
                </textarea>
            </div>
        </div>);
    }
}

export default InputArea;