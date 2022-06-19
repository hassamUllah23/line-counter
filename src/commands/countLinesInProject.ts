import { Disposable,  } from "vscode";
import { Command } from "../Interfaces/Command";
import * as vscode from 'vscode';
import * as path from 'path';
import { COUNT_LINES_IN_PROJECT } from "../Utils/strings";
import { buildUri } from "../Utils/utils";
import { log } from "console";


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

    public async countLinesInWorkSpace() {
        const folder = await this.currentWorkspaceFolder();
        await this.countLinesInDirectory_(folder.uri, folder.uri);
    }

    private async countLinesInDirectory_(targetUri: vscode.Uri, workspaceDir: vscode.Uri) {
        
        const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,0);
        try {
            statusBar.show();
            statusBar.text = `Line Counter: Loading...`;

            const outputDir = buildUri(workspaceDir, this.conf.outputDirectory);
           
            const files = await vscode.workspace.findFiles('**​/*.ts', '**​/node_modules/**', 10);
            let targetFiles = files.filter(uri => !path.relative(targetUri.path, uri.path).startsWith(".."));
            // if (this.conf.useGitignore) {
            //     log(`target : ${targetFiles.length} files -> use .gitignore`);
            //     const gitignores = await loadGitIgnore();
            //     targetFiles = targetFiles.filter(p => gitignores.excludes(p.fsPath));
            // }

            // const counter = await this.getCodeCounter();
            const results = await countLines(counter, targetFiles, targetFiles, this.conf.encoding, this.conf.ignoreUnsupportedFile, (msg: string) => statusBar.text = `VSCodeCounter: ${msg}`);
            if (results.length <= 0) {
                throw Error(`There was no target file.`);
            }
            statusBar.text = `VSCodeCounter: Totaling...`;

            await makeDirectories(outputDir);
            const regex = /^\d\d\d\d-\d\d-\d\d\_\d\d-\d\d-\d\d$/;
            const histories = (await vscode.workspace.fs.readDirectory(outputDir))
                .filter(d => ((d[1] & vscode.FileType.Directory) != 0) && regex.test(d[0]))
                .map(d => d[0])
                .sort()
                .map(d => buildUri(outputDir, d));

            const outSubdir = buildUri(outputDir, toLocalDateString(date, ['-', '_', '-']));
            await outputResults(date, targetUri, results, outSubdir, histories[histories.length - 1], this.conf);

            if (histories.length >= this.conf.history) {
                histories.length -= this.conf.history - 1;
                histories.forEach(dir => vscode.workspace.fs.delete(dir, { recursive: true }));
            }
        } finally {
            log(`finished. ${(new Date().getTime() - date.getTime())}ms`);
            statusBar.dispose();
        }


    }

    const countLines = (lineCounterTable: LineCounterTable, fileUris: vscode.Uri[], maxOpenFiles: number, fileEncoding: string, ignoreUnsupportedFile: boolean, showStatus: (text: string) => void) => {
        log(`countLines : target ${fileUris.length} files`);
        return new Promise(async (resolve: (value: Result[]) => void, reject: (reason: string) => void) => {
            const results: Result[] = [];
            if (fileUris.length <= 0) {
                resolve(results);
            }
            const decoder = createTextDecoder(fileEncoding);
            const totalFiles = fileUris.length;
            let fileCount = 0;
            const onFinish = () => {
                ++fileCount;
                if (fileCount === totalFiles) {
                    log(`count finished : total:${totalFiles} valid:${results.length}`);
                    resolve(results);
                }
            };
            for (let i = 0; i < totalFiles; ++i) {
                const fileUri = fileUris[i];
                const lineCounter = lineCounterTable.getCounter(fileUri.fsPath);
                if (lineCounter) {
    
                    while ((i - fileCount) >= maxOpenFiles) {
                        // log(`sleep : total:${totalFiles} current:${i} finished:${fileCount} valid:${results.length}`);
                        showStatus(`${fileCount}/${totalFiles}`);
                        await sleep(50);
                    }
    
                    vscode.workspace.fs.readFile(fileUri).then(data => {
                        try {
                            results.push(new Result(fileUri, lineCounter.name, lineCounter.count(decoder.decode(data))));
                        } catch (e: any) {
                            log(`"${fileUri}" Read Error : ${e.message}.`);
                            results.push(new Result(fileUri, '(Read Error)'));
                        }
                        onFinish();
                    },
                        (reason: any) => {
                            log(`"${fileUri}" Read Error : ${reason}.`);
                            results.push(new Result(fileUri, '(Read Error)'));
                            onFinish();
                        });
                } else {
                    if (!ignoreUnsupportedFile) {
                        results.push(new Result(fileUri, '(Unsupported)'));
                    }
                    onFinish();
                }
            }
        });
    }

}