import * as vscode from 'vscode';
import { Command } from '../Interfaces/Command';
import { COUNT_LINES, EXTENSION_BASE } from '../Utils/strings';

export class CountLines implements Command{

    private context:vscode.ExtensionContext;
    private name:string;
    private myStatusBarItem: vscode.StatusBarItem;

    constructor(context:vscode.ExtensionContext){
        this.context=context;
        this.name = COUNT_LINES;
        this.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);

        context.subscriptions.push(this.getCommandDisposable());
	    vscode.window.onDidChangeActiveTextEditor(this.updateStatusBarItem,this,context.subscriptions);
	    vscode.window.onDidChangeTextEditorSelection(this.updateStatusBarItem,this,context.subscriptions);
    }


    getCommandDisposable() {
        return vscode.commands.registerCommand('line-counter.countLines', () => {
            this.updateStatusBarItem();
        });
    }

    getCommandName(): string {
        return this.name;
    }

    private updateStatusBarItem(): void {
        const n = this.getNumberOfSelectedLines(vscode.window.activeTextEditor);
        this.myStatusBarItem.text= `$(megaphone) Total: ${vscode.window.activeTextEditor?.document.lineCount}, Selected: ${n}`;
        this.myStatusBarItem.show();
    }
    
    private getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
        let lines = 0;
        if (editor) {
            lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
        }
        return lines;
    }
}

