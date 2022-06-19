import { Disposable } from "vscode";
import { Command } from "../Interfaces/Command";
import * as vscode from 'vscode';
import { EXTENSION_BASE, SHOW_TABLE } from "../Utils/strings";

export class ShowTable implements Command{

    private name:string;
    private panel: vscode.WebviewPanel;
    private contentString: string;
    constructor(){
        this.name = SHOW_TABLE;
        this.panel = vscode.window.createWebviewPanel(
            'countLinesOutput', // Identifies the type of the webview. Used internally
            'Count Lines Output', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );

        this.contentString = 
            `
            <html>
                <head>
                    <title>Count Lines Output</title>
                </head>
                <body>
                <h1>Languages</h1>
                <ul>
                    <li>TypeScript</li>
                    <li>HTML</li>
                    <li>CSS</li>
                </ul>
                </body>
            </html>
            `;
    }

    getCommandDisposable(): Disposable {
        return vscode.commands.registerCommand('line-counter.showTable', () => {
            this.panel.webview.html=this.contentString;
        });
    }

    getCommandName(): string {
        return this.name;
    }
}