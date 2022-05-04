const CharacterHandler = {};
CharacterHandler.variableRegExp = /\/\/\s*(.+)\s*=(.+)$/;
CharacterHandler.resolveTextVariableRegExp = /{([^}]+)}/;
CharacterHandler.updateRegExp = /^:([^+=-]+)([+-=])(\d+)/;

CharacterHandler.resolveTextVariable = (text, data, depth=20) => {
    if(depth === 0) {
        return `無限ループしているようです（処理中の文字列 ${text}）`;
    }
    if(CharacterHandler.resolveTextVariableRegExp.test(text)) {
        const execResult = CharacterHandler.resolveTextVariableRegExp.exec(text);
        const column = execResult[1];
        if(data.status[column]) {
            return CharacterHandler.resolveTextVariable(text.replace(execResult[0], data.status[column]), data, depth - 1);
        } else {
            return CharacterHandler.resolveTextVariable(text.replace(execResult[0], column), data, depth - 1);
        }
    }
    return text;
};

CharacterHandler.updateData = (text, data) => {
    if(! CharacterHandler.updateRegExp.test(text)) {
        return {
            text: text,
            character: data
        };
    }
    const execResult = CharacterHandler.updateRegExp.exec(text);
    const column = execResult[1];
    if(! data.status[column]) {
        return {
            text: text,
            character: data
        };
    }

    const action  = execResult[2];
    const value   = execResult[3];
    const current = data.status[column];

    const resultText = `[ ${data.name} ] ${column} : ${current} → `;

    if(action === '=') {
        data.status[column] = value;
        return {
            text: `${resultText}${value}`,
            character: data
        }
    } else {
        if(Number(current) || current === '0' || current === 0) {
            if(action === '+') {
                data.status[column] = (Number(data.status[column]) || 0) + Number(value || 0);
            }
            if(action === '-') {
                data.status[column] = (Number(data.status[column]) || 0) - Number(value || 0);
            }
            return {
                text: `${resultText}${data.status[column]}`,
                character: data
            }
        } else {
            throw "${status}は数値ではありません (入力したコマンド： ${text})";
        }
    }
};

CharacterHandler.handleTextMessage = (text, data) => {
    const tmpText = CharacterHandler.resolveTextVariable(text, data);
    return CharacterHandler.updateData(tmpText, data);
};

CharacterHandler.jsonToCharacterData = (json) => {
    const character = {};
    character.name = json.name;
    character.status = {};
    character.commands = [];
    const statusShareTextBase = [];
    json.status.forEach((d)=>{
        character.status[d.label] = d.value;
        statusShareTextBase.push(`${d.label}:{${d.label}}`);
    });
    character.commands.push(statusShareTextBase.join(' / '));
    json.params.forEach((d)=>{
        character.status[d.label] = d.value;
    });
    json.commands.split('\n').forEach((t)=>{
        const l = t.trim();
        if(l === '') {return;}
        if(l.startsWith('//') && CharacterHandler.variableRegExp.test(l)) {
            const execResult = CharacterHandler.variableRegExp.exec(l);
            character.status[execResult[1]] = execResult[2];
        } else {
            character.commands.push(l);
        }
    });
    character.status['イニシアティブ'] = String(json.initiative);
    return character;
};

export default CharacterHandler;