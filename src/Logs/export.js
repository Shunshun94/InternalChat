const CommonHtmlExporter = {};

CommonHtmlExporter.download = (html) => {
	const url = window.URL.createObjectURL(new Blob([ html ], { "type" : 'text/html;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = `saved_${Number(new Date())}.html`;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

CommonHtmlExporter.logToHtml = (log) => {
    const base = document.createElement('p');
    const tagName = document.createElement('span');
    base.appendChild(tagName);
    const name = document.createElement('span');
    name.innerText = log.name;
    base.appendChild(name);
    const content = document.createElement('span');
    content.innerText = log.content;
    content.innerHTML = content.innerText.replaceAll('\n', '<br/>');
    base.appendChild(content);
    return base.outerHTML;
};

CommonHtmlExporter.generate = (logs) => {
    return `<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
	  <link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/replay/replay4-ccfolia.css"　type="text/css" />
	</head>
	<body>
    ${logs.map(CommonHtmlExporter.logToHtml).join('\n')}
    </body>
    </html>`;
};

CommonHtmlExporter.exec = (logs) => {
    CommonHtmlExporter.download(CommonHtmlExporter.generate(logs));
};

export default CommonHtmlExporter;
