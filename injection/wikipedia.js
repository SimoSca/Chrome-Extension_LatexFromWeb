
console.log('wikipedia.js');

	var _g = {
		selectors: '.mwe-math-fallback-image-inline, .tex',
		getLatex: 'alt',
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