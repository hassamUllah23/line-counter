import path = require("path");
import * as vscode from 'vscode';

export const buildUri = (uri: vscode.Uri, ...names: string[]) => uri.with({ path: `${uri.path}/${names.join('/')}` });
export const dirUri = (uri: vscode.Uri) => uri.with({ path: path.dirname(uri.path) });