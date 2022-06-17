import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);

export function activate(context: vscode.ExtensionContext) {
	
	let countLines = vscode.commands.registerCommand('line-counter.countLines', () => {
		updateStatusBarItem();
	});

	context.subscriptions.push(countLines);
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
