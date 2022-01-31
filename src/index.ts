import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {

		async function removeImages() {
			const note = await joplin.workspace.selectedNote();
			
			const regexMarkdownImgWithHyperlink = /\[?(!)(\[[^\]\[]*\[?[^\]\[]*\]?[^\]\[]*)\]\(([^\s]+?)(?:\s+(["'])(.*?)\4)?\)/; // [ ![alt-text](:/path-to-file)(link) ]
			const regexHTMLImgWithHyperlink = /\[<img([\w\W]+?)\/>\]\((.*?)\)/; // [<img src=":/12345"/>](link)
			const regexMarkdown = /!\[(.*?)\]\((.*?)\)/; // ![alt-text](:/path-to-file)
			const regexHtml = /<img([\w\W]+?)\/>/; // <img src=""/>

			
			if (note) {
				var noteBody = note.body;

				let match;
				let result;
				let newNoteBody = note.body;

				// combine all the regex
				var rgx = new RegExp([regexMarkdownImgWithHyperlink, regexHTMLImgWithHyperlink, regexMarkdown, regexHtml].map(function(r){
					return (r+"").replace(/\//g,"");
				}).join("|"), "g");
			
				let m;

				while ((m = rgx.exec(noteBody)) !== null) {

					// to avoid to avoid infinite loops with zero-width matches
					if (m.index === rgx.lastIndex) {
						rgx.lastIndex++;
					}
					
					
					m.forEach((match, groupIndex) => {
						if(groupIndex === 0 && groupIndex !== undefined) {
							newNoteBody = newNoteBody.replace(`${match}`,'');
						}
					});
				}
				await joplin.commands.execute("textSelectAll");
				await joplin.commands.execute("replaceSelection", newNoteBody);


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