if (window.ktoBookmarklet) {
	window.ktoBookmarklet.toggleMenu();
} else {

	(function() {

		var kto = {menuDisplayed: false};
		var document = window.document;

		var test = document.location.protocol === 'file:' || document.location.host === 'kierantop.github.io';
		if (!test && document.location.host !== 'github.com') {
			alert('Only run on github.com');
			return false;
		}

		var showMessage = (msg) => {
			alert(msg);
		};

		var getActiveTA = () => {
			var t = document.activeElement;
			if (!(t && t.type === 'textarea')) {
				showMessage('Please focus on a textarea');
				throw('abc');
			}
			return [t, t.selectionStart, t.selectionEnd];
		};

		var rewriteImages = function () {

			var t, s, e = getActiveTA();

			var msg = [];
			var _in = 'selection';
			if (!(s!==undefined && e!==undefined && e-s > 0)) {
				t.focus(); document.execCommand('selectAll', false);
				s = t.selectionStart;
				e = t.selectionEnd;
				_in = 'entire textarea';
			}
			var sel = t.value.substring(s, e);
		
			var c = 0;
			sel = sel.replaceAll(
				/\!\[image\]\((https:\/\/github\.com\/user-attachments\/.*?)\)/g,
				(s, p1) => { c+=1; return '<img width=30% src=' + p1 + '>'; }
			);
			msg.push('Replaced ' + c + ' occurence(s) of ![image](...) in ' + _in);
			/* Apparently, deprecated, but it's the only way to preserve undo buffer */
			if (document.execCommand) {
				document.execCommand('insertText', false, sel);
			} else {
				msg.push('Beware, your undo buffer might misbehave.');
				t.value = t.value.substring(0, s) + sel + t.value.substring(e);
			}
			showMessage(msg.join(' '), t.parentElement, t.offsetWidth + 'px');
		};

	
		var insert = (name, str) => {
			
			var t, s, e = getActiveTA();

			var msg = [];

			/* Apparently, deprecated, but it's the only way to preserve undo buffer */
			if (document.execCommand) {
				document.execCommand('insertText', false, str);
			} else {
				t.value = t.value.substring(0, s) + str + t.value.substring(e);
				msg.push('Beware, your undo buffer might misbehave.');
			}
			msg.push('Inserted ' + name + ' at cursor');
			showMessage(msg.join(' '));
		};

		var rpl = (s) => s.replaceAll(/\t/g,'    ').replaceAll(/\r?\n/g, '\r\n');

		var insertDetails = () => {
			insert('details', rpl(`<details>
		<summary>
			summary
		</summary>
		details
	</details>
`));
		};

		var insertTable = () => {
			insert('table', rpl(`<table>
	<tr>
		<th>
			head1
		</th>
		<th>
			head2
		</th>
	</tr>
	<tr>
		<td>
			cell1
		</td>
		<td>
			cell2
		</td>
	</tr>
</table>`));
		};

		var createLink = (name, fn) => {
			var a = document.createElement('a');
			a.setAttribute('href', '#');
			a.textContent = name;
			/* Catch clicks without grabbing focus */
			a.onmousedown = function(e) { e.preventDefault(); };
			a.onmouseup = function(e) {
				e.preventDefault();
				fn();
			};
			return a;
		};

		var showMenu = () => {
			var w = kto.el = document.createElement('div');
			w.setAttribute('style', 'width:100%;height:0;position:fixed;top:0;left:0;z-index: 1000;');
			var c = document.createElement('div');
			c.setAttribute('style', 'color:#17303B;margin: auto;text-align: center;padding:  10px;background-color:#eee;border:2px solid #A0AD39;opacity: 0.9;font-family:arial');
			c.textContent='v0.1 | ';
			c.append(createLink('<img>', rewriteImages));
			c.append(' | ');
			c.append(createLink('<table>', insertTable));
			c.append(' | ');
			c.append(createLink('<details>', insertDetails));
			w.appendChild(c);
			document.body.append(w);
			kto.menuDisplayed = true;
		};

		var hideMenu = () => {
			kto.el.remove();
			kto.menuDisplayed = false;
		};

		var toggleMenu = () => {
			if (kto.menuDisplayed) hideMenu();
			else showMenu();
		};

		kto.toggleMenu = toggleMenu;

		toggleMenu();

		window.ktoBookmarklet = kto;
	})();
}