import { Disposable,  } from "vscode";
import { Command } from "../Interfaces/Command";
import * as vscode from 'vscode';
import * as path from 'path';
import { COUNT_LINES_IN_PROJECT } from "../Utils/strings";


export class CountLinesInProject implements Command{

    private context:vscode.ExtensionContext;
    private name:string;
    constructor(context:vscode.ExtensionContext){

        this.context=context;
        this.name = COUNT_LINES_IN_PROJECT;
        this.context.subscriptions.push(this.getCommandDisposable());
    }

    getCommandDisposable(): Disposable {
        return vscode.commands.registerCommand('line-counter.countLinesInProject', () => {
		
            if(vscode.workspace.workspaceFolders !== undefined) {
                let wf = vscode.workspace.workspaceFolders[0].uri.path ;
                let fileSystemPath = vscode.workspace.workspaceFolders[0].uri.fsPath ;
    
                const base = path.basename(wf);
                
                // vscode.window.showInformationMessage(`Root Directory: ${base} - Total Lines: `);
                vscode.window.showInformationMessage(`This feature is still under construction.`);
                // let document = vscode.
            
                // vscode.window.showInformationMessage(`WF: ${wf} - FS: ${fileSystemPath}`);
                // vscode.window.showInformationMessage(`YOUR-EXTENSION: folder: ${fileSystemPath}`);
            } 
        });
    }

    getCommandName(): string {
        return this.name;
    }

    currentWorkspaceFolder = async () => {
        const folders = vscode.workspace.workspaceFolders ?? [];
        if (folders.length === 1) {

            return folders[0];

        } else if (folders.length > 1) {

            const folder = await vscode.window.showWorkspaceFolderPick();

            if (folder){
                return folder;
            } 
        }
        throw Error('workspace not open.');
    };
}