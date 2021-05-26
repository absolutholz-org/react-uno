/**
 * Randomize the order of a DOM node's children
 * http://xahlee.info/js/js_dom_randomize_list.html
 * version 2017-05-11
 * @param {HTMLDOMElement} nodeX - parent element
**/
export default function xah_randomize_children_f (nodeX) {

	const newNode = nodeX.cloneNode(true);
	const xChildren = newNode.children;
	const newNodeFrag = document.createDocumentFragment();

	while (xChildren.length > 0) {
		newNodeFrag.appendChild(xChildren[ Math.floor(Math.random() * xChildren.length) ]);
	};

	nodeX.innerHTML = '';
	nodeX.appendChild(newNodeFrag);
}
