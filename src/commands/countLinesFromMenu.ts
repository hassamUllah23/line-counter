import { Disposable,  } from "vscode";
import { Command } from "../Interfaces/Command";
import * as vscode from 'vscode';
import * as path from 'path';
import { COUNT_LINES_FROM_MENU, EXTENSION_BASE } from "../Utils/strings";


export class CountLinesFromMenu implements Command{

    private context:vscode.ExtensionContext;
    private name:string;
    private realTime:boolean;
    constructor(context:vscode.ExtensionContext){
        this.context=context;
        this.name = EXTENSION_BASE +  COUNT_LINES_FROM_MENU;
        this.realTime = false;

        this.context.subscriptions.push(this.getCommandDisposable());
    }

    getCommandDisposable(): Disposable {
        return vscode.commands.registerCommand('line-counter.countLinesFromMenu', () => {
		
            if(vscode.workspace.workspaceFolders !== undefined) {
                let wf = vscode.workspace.workspaceFolders[0].uri.path ;
                let fileSystemPath = vscode.workspace.workspaceFolders[0].uri.fsPath ;
    
                const base = path.basename(wf);
                
                vscode.window.showInformationMessage(`Root Directory: ${base} - Total Lines: `);
                // let document = vscode.
            
                // vscode.window.showInformationMessage(`WF: ${wf} - FS: ${fileSystemPath}`);
                // vscode.window.showInformationMessage(`YOUR-EXTENSION: folder: ${fileSystemPath}`);
            } 
        });
    }

    getCommandName(): string {
        return this.name;
    }
    
    isRealTime(): boolean {
        return this.realTime;
    }

}