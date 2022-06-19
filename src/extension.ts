import * as vscode from 'vscode';
import { CountLines } from './commands/countLines';
import { CountLinesInProject } from './commands/countLinesInProject';

export function activate(context: vscode.ExtensionContext) {

	const x = new CountLines(context);
	const y = new CountLinesInProject(context);

}

export function deactivate() {}
