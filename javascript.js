// IDEAS
// to left or right etc, add a div, and pass what's inside processDisplay beefore executing calculation with equalButton, so it can be like past calculations, also make them insnide <a>, so when the user click, we can pass what's inside the particular divs that repressents past calculations into the processDisplay...
//




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
let resultBeingShown = false;


// --------------------------- ASSIGNMENT -------------------------------
if (processInput.firstChild)
	processInput.removeChild(processInput.firstChild);


Object.keys(numbers).forEach((item) => {
	
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

equalButton.addEventListener('click', executeCalculation);



// --------------------------- FUNCTIONS --------------------------------



function cleanProcessInput() {
	while(processInput.firstChild)
		processInput.removeChild(processInput.firstChild);
}
function cleanProcessDisplay() {
	while(processDisplay.firstChild)
		processDisplay.removeChild(processDisplay.firstChild);
}

// this is more llike, just add the _text to the proccessDisplay as <p>
function addFromInputToProcess(_text) {
	if (resultBeingShown)
		cleanProcessDisplay();
	resultBeingShown = false;
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
	cleanProcessInput();
	cleanProcessDisplay();
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

function executeCalculation() {
	if (processInput.firstChild)
	{
		// TODO add number in processInput to processDisplay
		let newP = document.createElement('p');
		newP.innerText = numberInInput();
		processDisplay.insertAdjacentElement('afterBegin', newP);
		cleanProcessInput();
		setTimeout(
			() => {
			multiplication_division_execute();
			addition_substraction_execute();
			resultBeingShown = true;
			}
			,1000
		);
	}
}





// it will be a bit messy I guess... 
function multiplication_division_execute() {
	multiplication_division_xpath = '//div[@class="process"]/*[contains(text(), "*") or contains(text(), "/")]';

	let multiplication_division_nodes = document.evaluate(multiplication_division_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	console.log(multiplication_division_nodes);
	console.log(multiplication_division_nodes.snapshotLength);
	
	// operations priority from left to right,
	let snpshtLength = multiplication_division_nodes.snapshotLength;
	for (let i = 0; i < snpshtLength; ++i) 
	{
		let the_node = multiplication_division_nodes.snapshotItem(multiplication_division_nodes.snapshotLength-1);
		// console.log(the_node);
		const num1Node = the_node.nextSibling;
		const num1 = num1Node.innerText;
		const num2Node = the_node.previousSibling;
		const num2 = num2Node.innerText;

		num1Node.innerText = calculate(the_node.innerText, num1, num2);
		console.log(num1Node);
		
		processDisplay.removeChild(num2Node);
		processDisplay.removeChild(the_node);
		
		multiplication_division_nodes = document.evaluate(multiplication_division_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}

}


// very similat to multiplication_division
function addition_substraction_execute() {
	addition_substraction_xpath = '//div[@class="process"]/*[contains(text(), "+") or contains(text(), "-")]';

	let addition_substraction_nodes = document.evaluate(addition_substraction_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	
	// operations priority from left to right,
	let snpshtLength = addition_substraction_nodes.snapshotLength;
	for (let i = 0; i < snpshtLength; ++i) 
	{
		let the_node = addition_substraction_nodes.snapshotItem(addition_substraction_nodes.snapshotLength-1);
		const num1Node = the_node.nextSibling;
		const num1 = num1Node.innerText;
		const num2Node = the_node.previousSibling;
		const num2 = num2Node.innerText;
		num1Node.innerText = calculate(the_node.innerText, num1, num2);
		processDisplay.removeChild(num2Node);
		processDisplay.removeChild(the_node);
		addition_substraction_nodes = document.evaluate(addition_substraction_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}

}








