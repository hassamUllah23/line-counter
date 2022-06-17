import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);

export function activate(context: vscode.ExtensionContext) {
	
	let countLines = vscode.commands.registerCommand('line-counter.countLines', () => {
		updateStatusBarItem();
	});
	
	let countLinesFromMenu = vscode.commands.registerCommand('line-counter.countLinesFromMenu', () => {
		

		const panel = vscode.window.createWebviewPanel(
			'countLinesOutput', // Identifies the type of the webview. Used internally
			'Count Lines Output', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{} // Webview options. More on these later.
		  );
		  
		  const starting:string =
		  `
		  <html>
			<head>
				<title>Count Lines Output</title>
			</head>
		  <body>
		  `;

		  const ending:string = 
		  `
			</body>
			</html>
		  `;

		  const body:string = `
		  <h1>Languages</h1>
		  <ul>
			  <li>TypeScript</li>
			  <li>HTML</li>
			  <li>CSS</li>
		  </ul>
		  `;

		  const contentString ='';
		  contentString.concat(starting);
		  contentString.concat(body);
		  contentString.concat(ending);

		  vscode.window.showInformationMessage("Final",contentString);
		

		  panel.webview.html=contentString;
	});

	context.subscriptions.push(countLines);
	context.subscriptions.push(countLinesFromMenu);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	
}

function updateStatusBarItem(): void {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	myStatusBarItem.text= `$(megaphone) Total: ${vscode.window.activeTextEditor?.document.lineCount}, Selected: ${n}`;
	myStatusBarItem.show();
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

export function deactivate() {}
