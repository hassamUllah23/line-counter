import * as vscode from 'vscode';
import { Command } from '../Interfaces/Command';
import { COUNT_LINES, EXTENSION_BASE } from '../Utils/strings';

export class CountLines implements Command{

    private context:vscode.ExtensionContext;
    private name:string;
    private realTime:boolean;
    private myStatusBarItem: vscode.StatusBarItem;

    constructor(context:vscode.ExtensionContext){
        this.context=context;
        this.name = EXTENSION_BASE + COUNT_LINES;
        this.realTime = true;
        this.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);

        this.context.subscriptions.push(this.getCommandDisposable());
        this.context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(this.getCommandDisposable));
        this.context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(this.getCommandDisposable));
    }


    getCommandDisposable() {
        return vscode.commands.registerCommand('line-counter.countLines', () => {
            this.updateStatusBarItem();
        });
    }

    getCommandName(): string {
        return this.name;
    }
    
    isRealTime(): boolean {
        return this.realTime;
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

