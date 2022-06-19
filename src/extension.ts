import * as vscode from 'vscode';
import { CountLines } from './commands/countLines';
import { CountLinesFromMenu } from './commands/countLinesFromMenu';
import { Command } from './Interfaces/Command';

// function subscribe(context: vscode.ExtensionContext, command: Command) {
	
// 	context.subscriptions.push(command.getCommandDisposable());

// 	if(command.isRealTime()){
// 		vscode.window.showInformationMessage(`message ${command.isRealTime()}`);
// 		context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(command.getCommandDisposable));
// 		context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(command.getCommandDisposable));
// 	}
// }

let myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);

export function activate(context: vscode.ExtensionContext) {
	// subscribe(context,new CountLines(context));
	// subscribe(context,new CountLinesFromMenu());

	const x = new CountLines(context);
	// const y = new CountLinesFromMenu(context);

	let countLines = vscode.commands.registerCommand('line-counter.countLinesX', () => {
		updateStatusBarItem();
	});

	

	context.subscriptions.push(countLines);

	//only for testing purpose
	vscode.window.showInformationMessage(`Total Subscriptions: ${context.subscriptions.length}`);
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
