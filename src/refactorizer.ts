import { 
    App, 
    CachedMetadata, 
    TFile, 
    WorkspaceLeaf,
    getAllTags,
} from 'obsidian';

export const getAllFiles = (app: App): TFile[] =>
    app.vault.getMarkdownFiles()
;

export const getActiveFile = (app: App): TFile | null =>
    app.workspace.getActiveFile()
;

export const getActiveLeaf = (app: App): WorkspaceLeaf | null =>
    app.workspace.getMostRecentLeaf()
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

export const getTaggedFiles = (app: App, tag: string): TFile[] => 
    getAllFiles(app)
        .map(f => ({
            file:  f,
            cache: app.metadataCache.getFileCache(f),
        }))
        .filter(f => 
            (_getAllTags(f.cache) || [])
            .indexOf(tag) > -1
        )
        .map(f => f.file)
;

const _getAllTags = (f: CachedMetadata | null | undefined) =>
    (f)? getAllTags(f) : []
;

const _notEmpty = <T>(value: T | null): value is T => 
    !!value
;

export const getBacklinks = (app: App, target: TFile): TFile[] => 
     getAllFiles(app)
        .filter(f =>
            _containsFile(
                getLinkedFiles(app, f),
                target,
            )
        )
;


export const getInbox = (app: App): TFile[] => 
    getAllFiles(app)
        // TODO: grab this from the user's config
        .filter(f => f.path.startsWith('01 Inbox')
    )
;

export const moveFile = async (app: App, target: TFile) => 
    // TODO: make a setting for this and grab it from there
    await app.fileManager.renameFile(target, `03 Second brain/${target.name}`)
;


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

export const convertBacklinksToMD = (files: TFile[]) => 
    files
        .map(f => `[[${f.basename}]]`)
        .join('\n')
;

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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



