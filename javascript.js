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
	'sum': 			{'div': document.querySelector('.sum')},
	'substract': 	{'div': document.querySelector('.substract')},
	'multiply': 	{'div': document.querySelector('.multiply')},		
	'divide': 		{'div': document.querySelector('.divide')},
};






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



Object.keys(operations).forEach((item) => {
	
	operations[item]['div'].addEventListener('click', function() {
		let tmpString = numberInInput();
		addFromInputToProcess(tmpString);
		cleanProcessInput();
	});

});









// --------------------------- FUNCTIONS --------------------------------



function cleanProcessInput() {
	while(processInput.firstChild)
		processInput.removeChild(processInput.firstChild);
}



function addFromInputToProcess(_text) {
	for (i = 0; i < _text.length; ++i) {
		let tmpP = document.createElement('p');
		tmpP.innerText = _text[i];
		processDisplay.appendChild(tmpP);
	}
}

function numberInInput() {
	let tmpString = '';  // actually could just create a loop without needed this, but can use this for later...
	processInput.childNodes.forEach(
		(item) => 
		{
			tmpString = tmpString + item.innerText;
		}
	);
	return tmpString;
}









