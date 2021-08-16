const vscode = require('vscode');
const xmlParser = require('fast-xml-parser');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	const res = await axios.get('https://blog.webdevsimplified.com/rss.xml');
	const articles = xmlParser.parse(res.data).rss.channel.item.map(article => {
		return {
			label: article.title,
			detail: article.description,
			link: article.link
		}
	});
	console.log(articles);

	let disposable = vscode.commands.registerCommand('samplevscextension.searchKyleBlog', async function () {
		const article = await vscode.window.showQuickPick(articles,{
			matchOnDetail: true
		})
		console.log(article);
		if(article == null) return;
		vscode.env.openExternal(article.link);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
