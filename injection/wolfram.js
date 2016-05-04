
console.log('wolfram.js');

	var _g = {
		selectors: '.numberedequation, .inlineformula',
		getLatex: 'alt',
		copyClass: 'wolfram-latex-copy-btn',
		copyParent: document.body,
		copyEls: [],
		copy: new CopyToClipboard(),
		responseClass: 'wolfram-latex-copy-response',
		hoverPosition: {
			top: -10,
			left: 10
		}
	}

new managePage(_g);
