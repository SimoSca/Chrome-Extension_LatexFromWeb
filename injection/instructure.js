
console.log('instructure.js');

	var _g = {
		selectors: '.equation_image',
		getLatex: 'data-equation-content',
		copyClass: 'wikipedia-latex-copy-btn',
		copyParent: document.body,
		copyEls: [],
		copy: new CopyToClipboard(),
		responseClass: 'wikipedia-latex-copy-response',
		hoverPosition: {
			top: 15,
			left: 20
		}
	}

new managePage(_g);

