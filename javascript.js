// --------------------------- VARIABLE ---------------------------------
let processDisplay = document.querySelector('.process');
let processInput = document.querySelector('.process-input');
let i;
let numbers = {};
for (i = 0; i < 10; ++i) {
	let tmp_txt = `digit-${i}`;
	numbers[tmp_txt] = {};
	numbers[tmp_txt]['div'] = document.querySelector(`.digit-${i}`);
}

let operations = {
	'sum': 			{'div': document.querySelector('.sum'), 'symbol': '+'},
	'substract': 	{'div': document.querySelector('.substract'), 'symbol': '-'},
	'multiply': 	{'div': document.querySelector('.multiply'), 'symbol': '*'},		
	'divide': 		{'div': document.querySelector('.divide'), 'symbol': '/'},
};

let clearButton = document.querySelector('.clear');
let deleteButton = document.querySelector('.delete');
let numbersArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
let operationsArray = ['*', '/', '+', '-'];
let equalButton = document.querySelector('.equal');


// --------------------------- ASSIGNMENT -------------------------------
if (processInput.firstChild)
	processInput.removeChild(processInput.firstChild);


Object.keys(numbers).forEach((item) => {
	
	//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler
	//arrow function don't have 'this', also arrow function didn't have \arguments' AFA I remember
	numbers[item]['div'].addEventListener('click', function() {
		if (this.innerText != '0') 
		{
			let newP = document.createElement('p');
			newP.innerText = this.classList[1].split('-')[1];
			processInput.insertAdjacentElement('afterBegin', newP);
		}
		else
		{
			if (processInput.firstChild)
			{
				let newP = document.createElement('p');
				newP.innerText = this.classList[1].split('-')[1];
				processInput.insertAdjacentElement('afterBegin', newP);
			}
		}
	});

});



Object.keys(operations).forEach(function(item) {
	
	operations[item]['div'].addEventListener('click', function() {
		let firstChildProcessDisplay = document.querySelector('.process').firstChild;
		// console.log(firstChildProcessDisplay);
				
		let tmpString = numberInInput();
		
		// (!firstChildProcessDisplay.innerText), if display is empty, we can directly pass things...
		if (!firstChildProcessDisplay.innerText) {
			addFromInputToProcess(tmpString);
			addFromInputToProcess(this.innerText);
			cleanProcessInput();
		}
		else{
			let tmpString = numberInInput();
			if (tmpString != '') // this probably would be enough...
			{
				addFromInputToProcess(tmpString);
				addFromInputToProcess(this.innerText);
				cleanProcessInput();

			}
		}
	});

});


clearButton.addEventListener('click', AC); 
deleteButton.addEventListener('click', () => {
	processInput.removeChild(processInput.firstChild);	
});

equalButton.addEventListener('click', multiplication_division_execute);



// --------------------------- FUNCTIONS --------------------------------



function cleanProcessInput() {
	while(processInput.firstChild)
		processInput.removeChild(processInput.firstChild);
}



function addFromInputToProcess(_text) {
	let tmpP = document.createElement('p');
	tmpP.innerText = _text;
	processDisplay.insertAdjacentElement('afterbegin', tmpP);
}

function numberInInput() {
	let tmpString = '';  // actually could just create a loop without needed this, but can use this for later...
	Array.from(processInput.childNodes).reverse().forEach(
		(item) => 
		{
			tmpString = tmpString + item.innerText;
		}
	);
	// console.log(tmpString);
	return tmpString;
}

function AC() {
	while (processInput.firstChild)
		processInput.removeChild(processInput.firstChild);

	while (processDisplay.firstChild)
		processDisplay.removeChild(processDisplay.firstChild);
}

function calculate(operation, num1, num2) {
	console.log(num1, operation, num2);
	switch(operation) {
		case '+':
			return parseFloat(num1) + parseFloat(num2);
		case '-':
			return parseFloat(num1) - parseFloat(num2);
		case '/':
			return parseFloat(num1) / parseFloat(num2);
		case '*':
			return parseFloat(num1) * parseFloat(num2);
	}
}

// ok, for the first time, got some links to put here:
// -- https://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
// -- -- https://stackoverflow.com/a/14284815     ( .evaluate() )
// -- https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
// -- -- https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript
// ----- -- we can get nodes with snapshot (XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)  or iterateNext ...


// it will be a bit messy I guess... 
function multiplication_division_execute() {
	multiplication_division_xpath = '//div[@class="process"]/*[contains(text(), "*") or contains(text(), "/")]';

	let multiplication_division_nodes = document.evaluate(multiplication_division_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	console.log(multiplication_division_nodes);
	console.log(multiplication_division_nodes.snapshotLength);
	
	for (let i = 0; i < multiplication_division_nodes.snapshotLength; ++i) 
	{
		let the_node = multiplication_division_nodes.snapshotItem(i);
		const num1 = the_node.nextSibling.innerText;
		const num2 = the_node.previousSibling.innerText;
		// console.log(the_node, the_node.innerText);
		console.log(calculate(the_node.innerText, num1, num2));
	}
}










