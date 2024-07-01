
import {
    App,
    Command,
} from 'obsidian';

import { 
    getBacklinks, 
    openFilesToRight, 
    filterForwardLinks, 
    getActiveFile,
    copyToClipboard,
    convertBacklinksToMD,
    getInbox,
    moveFile,
    getActiveLeaf
} from 'src/refactorizer';

export const commands = (app: App): Command[] => [
    {
        id:   'copy-backlinks-to-clipboard',
        name: 'Copy the list of backlinks to the clipboard',
        callback: async () => {
            await copyBacklinks(app);
        }
    },
    {
        id:   'copy-backlinks-to-clipboard-filtered',
        name: 'Copy the list of backlinks to the clipboard (excluding forward links)',
        callback: async () => {
            await copyBacklinks(app, true);
        }
    },
    {
        id:   'open-backlinks-as-tabs',
        name: 'Open backlinks in separate tabs',
        callback: async () => {
            await openBacklinksTabs(app);
        }
    },
    {
        id:   'open-backlinks-as-tabs-filtered',
        name: 'Open backlinks in separate tabs (excluding forward links)',
        callback: async () => {
            await openBacklinksTabs(app, true);
        }
    },
    {
        id:   'open-inbox-as-tabs',
        name: 'Open Inbox in separate tabs',
        callback: async () => {
            await openInboxTabs(app);
        }
    },
    {
        id:   'move-to-second-brain',
        name: 'Move the active file into the Second Brain',
        callback: async () => {
            await moveOutOfInbox(app);
        }
    },
]

const _backlinks = (app: App, filter?: boolean) => {
    const active = getActiveFile(app);

    if (!active) {
        return null;
    }

    let files = getBacklinks(app, active);

    if (filter) {
        files = filterForwardLinks(app, files, active);
    }

    return files || null;
}

const openBacklinksTabs = async (app: App, filter?: boolean) => {

    const files = _backlinks(app, filter);

    if (!files) {
        return;
    } 
    
    await openFilesToRight(app, files);
}

const copyBacklinks = async (app: App, filter?: boolean) => {

    const files = _backlinks(app, filter);

    if (!files) {
        return;
    } 
    
    copyToClipboard(convertBacklinksToMD(files));
}

const openInboxTabs = async (app: App) => {

    const files = getInbox(app);

    if (!files) {
        return;
    } 
    
    await openFilesToRight(app, files);
}


const moveOutOfInbox = async (app: App) => {
    const active = getActiveFile(app);

    if (!active) {
        return null;
    }

    await moveFile(app, active);

    const leaf = getActiveLeaf(app);

    leaf?.detach();

}