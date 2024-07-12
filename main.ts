import { 
	Plugin, 
} from 'obsidian';

import { commands } from 'src/command';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		for (const cmd of commands(this.app)) {
			this.addCommand(cmd);
		}

	}

	onunload() {}

	async loadSettings() {}

	async saveSettings() {}
}

