import { 
    Editor,
    MarkdownView,
} from 'obsidian';

export const insertNewLine = (editor: Editor, view: MarkdownView) => {
    if (!view) {
        return;
    }

    const cursor = editor.getCursor();
    const line   = cursor.line
    const text   = editor.getLine(line);
    editor.setLine(line, `${text}\n`);

    editor.setCursor(line + 1);
}

