// IDEAS
// to left or right etc, add a div, and pass what's inside processDisplay beefore executing calculation with equalButton, so it can be like past calculations, also make them insnide <a>, so when the user click, we can pass what's inside the particular divs that repressents past calculations into the processDisplay...
//
// TODO show the result in the proccessInput... or not. idk. leave this as is, just create the div for past processes
// TODO when the number for example too long, it shouldn't exceed boundries
// dot


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
let dotButton = document.querySelector('.dot');

let numbersArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
let operationsArray = ['*', '/', '+', '-'];
let equalButton = document.querySelector('.equal');
let resultBeingShown = false;


// --------------------------- ASSIGNMENT -------------------------------
if (processInput.firstChild)
	processInput.removeChild(processInput.firstChild);


Object.keys(numbers).forEach((key) => {
	
	// // // maybe let the user pass 0, and improve the numberInInput funcion for like 00008 to 8...
	// numbers[key]['div'].addEventListener('click', function() {
	// 	if (this.innerText != '0') 
	// 	{
	// 		let newP = document.createElement('p');
	// 		newP.innerText = this.classList[1].split('-')[1];
	// 		processInput.insertAdjacentElement('afterBegin', newP);
	// 	}
	// 	else
	// 	{
	// 		if (processInput.firstChild)
	// 		{
	// 			let newP = document.createElement('p');
	// 			newP.innerText = this.classList[1].split('-')[1];
	// 			processInput.insertAdjacentElement('afterBegin', newP);
	// 		}
	// 	}
	// });

	numbers[key]['div'].addEventListener('click', function() {
		let newP = document.createElement('p');
		newP.innerText = this.classList[1].split('-')[1];
		processInput.insertAdjacentElement('afterBegin', newP);
	});

});


// numbers can be passed through operation signs or in the end with process execution...
Object.keys(operations).forEach(function(key) {
	
	operations[key]['div'].addEventListener('click', function() {
				
		let tmpString = numberInInput();
		
		if (!processDisplay.firstChild) // there'sn't anything in the processDisplay, directly can pass
		{
			addFromInputToProcess(tmpString);
			addFromInputToProcess(this.innerText);
			cleanProcessInput();
		}
		else if (parseInt(processDisplay.firstChild.innerText)) // element at the rightest in processDisplay is not a operation sign but a number, so we should pass operation sign
		{
			let tmpP = document.createElement('p');
			tmpP.innerText = this.innerText;
			processDisplay.insertAdjacentElement('afterbegin', tmpP);
			tmpP = document.createElement('p');
			tmpP.innerText = numberInInput();
			processDisplay.insertAdjacentElement('afterbegin', tmpP);
			cleanProcessInput();
		}
		else
		{
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
deleteButton.addEventListener('click', cleaningFunction);

equalButton.addEventListener('click', executeCalculation);

dotButton.addEventListener('click', function() {
	if (processInput.firstChild)
	{
		if (processInput.firstChild.innerText != '.')
		{
			let tmpP = document.createElement('p');
			tmpP.innerText = this.innerText;
			processInput.insertAdjacentElement('afterbegin', tmpP);
		}
	}
});



// --------------------------- FUNCTIONS --------------------------------

function cleaningFunction() {
	
	if (processInput.firstChild)
		processInput.removeChild(processInput.firstChild);
	else
		if (processDisplay.firstChild)
		{	
			let the_number = processDisplay.firstChild.innerText;	
			if (parseInt(the_number)) // it's a number string in the processDisplay
			{
				if (the_number.length == 1) // if it's just a single digit number, just delete the <p> element (I decided to show the whole number as a single <p>, so it's easier to start to calculations here. Also not a big problem while deleting here...
					processDisplay.removeChild(processDisplay.firstChild);
				else
				{
					processDisplay.firstChild.innerText = the_number.slice(0, -1);
				}
			}
			else // it's operation sign
			{
				processDisplay.removeChild(processDisplay.firstChild);
			}
		}
}



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
	// let zeroFromFirst = true;
	Array.from(processInput.childNodes).reverse().forEach(
		(element) => 
		{
			tmpString = tmpString + element.innerText;
			
			// ------ we just need to remove extra 0s in the start of the number, creating another loop wouldn't harm...
			// // update for numbers like 00000888, leting 0 to be addable, 
			// if (zeroFromFirst)
			// {
			// 	if (element.innerText == '.')
			// 	{
			// 		
			// 	}
			// 	else if (element.innerText != '0')
			// 	{
			// 		zeroFromFirst = false;
			// 		tmpString = tmpString + element.innerText;
			// 	}

			// }
			// else
			// {
			// 	tmpString = tmpString + element.innerText;
			// }
		}
	);
	

	// console.log(tmpString);

	if (tmpString.length > 1)
	{
		if (!stringIncludesChar(tmpString, '.'))
		{
			let indexZeroUntil = 0;
			for (let i = 0; i < tmpString.length; ++i)
			{
				if (tmpString[i] != '0')
				{
					indexZeroUntil = i;
					break;
				}
			}
			tmpString = tmpString.slice(indexZeroUntil, );
			console.log(tmpString);
		}
		else // if number includes dot
		{	
			let indexZeroUntil = 0;
			for (let i = 0; i < tmpString.length - 1; ++i)
			{
				if (tmpString[i + 1] != '.') // until the number before dot
				{
					if (tmpString[i] != '0') // until 0s ends in the number from start (for 000000003.0990 > 3.0990)
					{
						indexZeroUntil = i;
						break;
					}
				}
				else
					break;
			}
			tmpString = tmpString.slice(indexZeroUntil, );
		}
	}

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
	// TODO, after calculation executed, we can add processInput number just next to a processDisplay number which is the result of the calculation  without any operation between numbers. 

	if (processInput.firstChild)
	{
		if (!parseInt(processDisplay.firstChild.innerText))
		{
			// TODO add number in processInput to processDisplay
			let newP = document.createElement('p');
			newP.innerText = numberInInput();
			processDisplay.insertAdjacentElement('afterBegin', newP);
			cleanProcessInput();	
			multiplication_division_execute();
			addition_substraction_execute();
			resultBeingShown = true;
		}
	}
	else // after deletion, there might be calculations to process.
	{
		if (processDisplay.childElementCount > 2) // min 2 number and 1 operation sign
		{
			multiplication_division_execute();
			addition_substraction_execute();
			resultBeingShown = true;
		}
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

function stringIncludesChar(_string, _char) {
	let it_has = false;
	Array.from(_string).forEach((stringChar) => {
		if (stringChar == _char)
			it_has = true;
	});
	return it_has;
}







