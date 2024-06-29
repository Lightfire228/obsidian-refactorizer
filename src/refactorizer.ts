import { 
    App, 
    TFile, 
    WorkspaceLeaf,
} from 'obsidian';

export const getAllFiles = (app: App): TFile[] =>
    app.vault.getMarkdownFiles()
;

export const getActiveFile = (app: App): TFile | null =>
    app.workspace.getActiveFile()
;

export const getLinkedFiles = (app: App, file: TFile): TFile[] => 
    (app
        .metadataCache
        .getFileCache(file)
        ?.links || []
    )
    .map(l => app.metadataCache.getFirstLinkpathDest(l.link, ''))
    .filter(_notEmpty)
;

const _notEmpty = <T>(value: T | null): value is T => 
    !!value
;

export const getBacklinks = (app: App, target: TFile): TFile[] => {
    return getAllFiles(app)
        .filter(f =>
            _containsFile(
                getLinkedFiles(app, f),
                target,
            )
        )
    ;
}

export const filterForwardLinks = (app: App, backlinks: TFile[], target: TFile): TFile[] => {
    const links = getLinkedFiles(app, target);

    return backlinks.filter(f => 
        !_containsFile(links, f)
    );

}

export const splitRight = (app: App): WorkspaceLeaf => {
    const leaf = app.workspace.getLeaf('split', 'vertical');
    app.workspace.setActiveLeaf(leaf, { focus: true });
    return leaf;

}

export const openFilesToRight = async (app: App, files: TFile[]) => {
    splitRight(app);
    
    for (const f of files) {
        await app.workspace.openLinkText(f.path, '', 'tab');
    }
}

const _containsFile = (list: string[] | TFile[], val: string | TFile): boolean => {

    const l = 
        _isTFileArray()(list)? list.map(f => f.path)
                             : list
    ;
    
    const v = (val instanceof TFile)? val.path : val;

    return l.indexOf(v) > -1;
}

const _isTFileArray = () => _isArrayOf(_instanceOf(TFile))

// https://stackoverflow.com/a/60514219
const _isArrayOf = <T>(
    elemGuard: (x: unknown) => x is T
) => 
    (arr: unknown[]): arr is Array<T> => arr.every(elemGuard)
;

const _instanceOf = <T>(
    actor: new (...args: unknown[]) => T
) =>
    (x: unknown): x is T => x instanceof actor
;



