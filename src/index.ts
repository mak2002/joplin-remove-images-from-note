import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {

		async function removeImages() {
			const note = await joplin.workspace.selectedNote();
			const regexMarkdown = /!\[(.*?)\]\((.*?)\)/g;
			const regexHtml = /<img([\w\W]+?)\/>/g;

			
			if (note) {
				var noteBody = note.body;

				let match;

				// first check for images in markdown format
				let result = noteBody.matchAll(regexMarkdown);

				for (match of result) {
					console.log(match[0]);
					noteBody = noteBody.replace(`${match[0]}`,'');
				}

				await joplin.commands.execute("textSelectAll");
				await joplin.commands.execute("replaceSelection", noteBody);

				// first check for images in HTML format
				result = noteBody.matchAll(regexHtml);

				for (match of result) {
					console.log(match[0]);
					noteBody = noteBody.replace(`${match[0]}`,'');
				}

				await joplin.commands.execute("textSelectAll");
				await joplin.commands.execute("replaceSelection", noteBody);

			} else {
				console.log("-----Note not loaded-----")
			}
		}

		await joplin.commands.register({
			name: 'removeImagesCommand',
			label: 'Remove Images',
			iconName: 'fas fa-ban',
			execute: async () => {
				removeImages();
			},
		});

		// Add the first command to the note toolbar
		await joplin.views.toolbarButtons.create('myButton1', 'removeImagesCommand', ToolbarButtonLocation.EditorToolbar);

		// Also add the commands to the menu
		await joplin.views.menuItems.create('myMenuItem1', 'removeImagesCommand', MenuItemLocation.Tools, { accelerator: 'CmdOrCtrl+Alt+Shift+B' });

	},
});