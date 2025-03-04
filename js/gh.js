if (window.ktoBookmarklet) {
	window.ktoBookmarklet.toggleMenu();
} else {

	(function() {

		var kto = {};
		var {document} = window;
		var {location} = document;
		var {host,protocol} = location;
		var menuEl;
		var test = protocol === 'file:' || host === 'kierantop.github.io';
		var github = 'github.com';
		if (!test && host !== github) {
			alert('Only run on '+github);
			return false;
		}

		var createEl = (name, attrs, text) => {
			var el = document.createElement(name);
			Object.assign(el, attrs || {});
			text ? el.textContent = text : 0;
			return el;
		};

		var showMessage = (msg, raise) => {
			var msgEl = createEl('div', {
				style: 'border-radius:3px;width:fit-content;padding:3px;background-color:red;color:yellow;margin:10px auto -9px auto;'
			}, msg);
			menuEl.children[0].append(msgEl);
			setTimeout(()=>msgEl.remove(), 2000);
			if (raise) throw(msg);
		};

		var getActiveTA = () => {
			var t = document.activeElement;
			if (!(t && t.type === 'textarea')) {
				showMessage('Please focus on a textarea', true);
			}
			return [t, t.selectionStart, t.selectionEnd];
		};

		var toggleFont = () => {
			var [textarea] = getActiveTA();
			var [style,fontFamily,courier,whiteSpace,nowrap] = [textarea.style,'fontFamily','Courier','whiteSpace','nowrap'];
			if (style[fontFamily]) {
				style[fontFamily] = '';
				style[whiteSpace] = '';
			} else {
				style[fontFamily] = courier;
				style[whiteSpace] = nowrap;
				showMessage('Switched font to ' + courier + ' and white-space to ' + nowrap + '; click again to revert');
			}
		};

		var undoWarning = 'Beware, your undo buffer might misbehave.';

		var replaceInTextarea = (textarea, s, e, str) => {
			/* Apparently, deprecated, but it's the only way to preserve undo buffer */
			if (document.execCommand) {
				document.execCommand('insertText', false, str);
			} else {
				showMessage(undoWarning);
				textarea.value = textarea.value.substring(0, s) + str + textarea.value.substring(e);
			}
		};

		var rewriteImages = () => {

			var [textarea, s, e] = getActiveTA();

			var _in = 'selection';
			if (!(s!==undefined && e!==undefined && e-s > 0)) {
				textarea.focus();
				document.execCommand('selectAll', false);
				s = textarea.selectionStart;
				e = textarea.selectionEnd;
				_in = 'entire textarea';
			}
			var sel = textarea.value.substring(s, e);

			var c = 0;
			sel = sel.replaceAll(
				/\!\[image\]\((https:\/\/github\.com\/user-attachments\/.*?)\)/g,
				(s, p1) => { c+=1; return '<img width=30% src=' + p1 + '>'; }
			);
			replaceInTextarea(textarea, s, e, sel);
			showMessage('Replaced ' + c + ' occurence(s) of ![image](...) in ' + _in);
		};

		var insert = (name, str) => {
			var [t, s, e] = getActiveTA();
			replaceInTextarea(t, s, e, str);
			showMessage('Inserted ' + name + ' at cursor');
		};

		var rpl = (s) => s.replaceAll(/^(\s+)/gm,'$1$1$1$1'); /*.replaceAll(/\n/g, '\r\n'); */

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
</table>
`));
		};

		var createLink = (name, fn, title, attrOverrides) => {
			// attrs.href = attrs.href || '#';
			var preventDefault = (e) => e.preventDefault();
			var a = createEl('a', {
				href: 'javascript:',
				title: title,
				style: 'text-decoration:none;color:#551a8b;',
				onmouseover: (e) => e.target.style.textDecoration = 'underline',
				onmouseout: (e) => e.target.style.textDecoration = 'none',
				/* Catch clicks without grabbing focus */
				/* Prevent the href being followed */
				onmousedown: preventDefault,
				onclick: preventDefault,
				onmouseup: (e) => { preventDefault(e); fn && fn() }
			}, name);
			Object.assign(a, attrOverrides || {});
			return a;
		};

		var showMenu = () => {
			menuEl = createEl('div', {
				style: 'width:100%;height:0;position:fixed;top:0;left:0;z-index:1000;'
			});
			var c = createEl('div', {
				style: 'color:#17303B;margin:auto;text-align:center;padding:10px;background-color:#eee;border:2px solid #A0AD39;opacity:0.95;font-family:arial'
			});

			[
				'v0.4 | ',
				createLink('<img>', rewriteImages, 'Rewrite ![image] to <img>'),
				' | ',
				createLink('<table>', insertTable, 'Insert <table>'),
				' | ',
				createLink('<details>', insertDetails, 'Insert <details>'),
				' | ',
				createLink('Aa↩', toggleFont, 'Fixed-width font, no wrap'),
				' | ',
				createLink('help', undefined, 'Help', {onclick: '', target: '_blank', href: 'https://kierantop.github.io/gh.html'}),
			].forEach(x => c.append(x));
			menuEl.appendChild(c);
			document.body.append(menuEl);
		};

		var hideMenu = () => {
			menuEl.remove();
			menuEl = null;
		};

		var toggleMenu = () => {
			if (menuEl) hideMenu();
			else showMenu();
		};

		kto.toggleMenu = toggleMenu;

		toggleMenu();

		window.ktoBookmarklet = kto;
	})();
}