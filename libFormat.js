const licensesJson = require('./license.json');
const licenseKeys = Object.keys(licensesJson);

console.log(`# Libs\n`)
console.log(
    licenseKeys.map((key)=>{
        const target = licensesJson[key];
        return `## ${key}

published by ${target.publisher || '(no info)'}   
repository: ${target.repository || '(no info)'}   
license: ${target.licenses || '(no info)'}`;
    }).join('\n\n')
);