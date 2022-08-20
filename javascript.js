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



// --------------------------- ASSIGNMENT -------------------------------
if (processInput.firstChild)
	processInput.removeChild(processInput.firstChild);


Object.keys(numbers).forEach((item) => {
	
	//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler
	//arrow function don't have 'this', also arrow function didn't have \arguments' AFA I remember
	numbers[item]['div'].addEventListener('click', function() {
		let newP = document.createElement('p');
		newP.innerText = this.classList[1].split('-')[1];
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
		processInput.insertAdjacentElement('afterBegin', newP);

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


function order_operator_priority() {
	// this is overdone I know, but I made it to get used to things and learn, so leaving as it is here...
	// let operations_keys = Object.keys(operations);
	// 
	// let multiplication_division_xpath = '//div[@class="process"]/*[';
	// for (let i = 0; i < operations_keys.length; ++i)
	// {
	// 	let symbol = operations[operations_keys[i]]['symbol'];
	// 	if (symbol == '*' || symbol == '/')
	// 	{
	// 		if (i == 0)
	// 			multiplication_division_xpath = multiplication_division_xpath + `contains(text(), "${symbol}")`;
	// 		else
	// 			multiplication_division_xpath = multiplication_division_xpath + ` or contains(text(), "${symbol}")`;
	// 	}
	// }
	// multiplication_division_xpath = multiplication_division_xpath + ']';
	multiplication_division_xpath = '//div[@class="process"]/*[contains(text(), "*") or contains(text(), "/")]';
	// console.log(multiplication_division_xpath);

	let multiplication_division_nodes = document.evaluate(multiplication_division_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	// console.log(multiplication_division_nodes.snapshotLength);
	return multiplication_division_nodes;
}








