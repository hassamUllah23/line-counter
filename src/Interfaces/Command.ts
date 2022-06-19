import { Disposable } from "vscode";

export interface Command {
    getCommandDisposable():Disposable;
    getCommandName():string;
}