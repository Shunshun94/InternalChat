import React from 'react';
import CommonHtmlExporter from './export.js';

class ChatLogPost extends React.Component {
    render() {
        return (
            <div
                className="chat-logs-post"
                onDoubleClick={(e)=>{this.props.onRequest(this.props.log)}}
            >
                <div
                    className="chat-logs-post-name"
                >{this.props.log.name}</div>
                <div
                    className="chat-logs-post-content"
                >{this.props.log.content}</div>
            </div>
        );
    }
}

class ChatLogs extends React.Component {
    render() {
        const display = this.props.logs.reverse().map((log, i)=>{
            return (<ChatLogPost
                key={i}
                log={log}
                onRequest={this.props.onRequest}
            ></ChatLogPost>);
        })
        return (<div
            className="chat-logs"
        >
            <div
                className="chat-logs-save"
            >
                <button
                    className="chat-logs-save-button"
                    onClick={(e)=>{CommonHtmlExporter.exec(this.props.logs)}}
                >ログを保存する</button>
            </div>
            {display}
        </div>);
    }
}

export default ChatLogs;