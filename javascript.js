// IDEAS
// to left or right etc, add a div, and pass what's inside processDisplay beefore executing calculation with equalButton, so it can be like past calculations, also make them insnide <a>, so when the user click, we can pass what's inside the particular divs that repressents past calculations into the processDisplay...
//
// TODO when the number for example too long, it shouldn't exceed boundries 
// TODO overflow of the process and process-input, when user hover mouse on left or right, scroll the flow to left or right...
// TODO update how ans showed, let the result still be shown in the procecssDisplay until new number entered... (result is also shown in the ans display...
// NOTE: there was a flaw, that would cause error, but I don't remember how it appear at the moment...



// NOTE after having result, if we continue without clicking AC etc, when we pass numbers with operations, operations all bein left in the left of the added number. Which we adjusted like this, but we can add ANS. So the user can continue like he started how to use the calculator...

// NOTE I have lots of other things in my mind, but this already should be enough. Just will complete the past and ans parts, and maybe some scrolliing then go on...
// -- some of them are creating limited length array of ans, for example when you click ans twice, you'd get the result of twices previous operation etc..
// -- there are some other usage things....
// -- for example when using ans, we can instead use 'ANS' as a word instead of it's number. But still there might be some peoples that want to use it like this, but I guess standard is just showing the word 'ANS'. Anyway, already been quite a while, I gotta go on... after adding hover scrolling for pastDisplay, processDisplay etc, I'll leave...


// NOTE: when using enter, ans not being shown in the processDisplay, but with = button in the keyboard and screen, it's being shown. Idk, but will leave like this...
// NOTE: if there is just number in the processDisplay, can just equal ANS to it...


// --------------------------- VARIABLE ---------------------------------
let divOfPast = document.querySelector('.past');
let processDisplay = document.querySelector('.process');
let processInput = document.querySelector('.process-input');
let i;
let ANS = null;
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

let ansButton = document.querySelector('.ans');
let ansDisplay = document.querySelector('.ans-display p');

// ----------------------------------------------------------------------
//
// --------------------------- ASSIGNMENT -------------------------------
if (processInput.firstChild)
	processInput.removeChild(processInput.firstChild);

Object.keys(numbers).forEach((key) => {
	numbers[key]['div'].addEventListener('click', function() {
		addNumber(this.classList[1].split('-')[1]);
	});
});


// numbers can be passed through operation signs or in the end with process execution...
// NOTE, after adding ANS, adding firstly operation sign and then number is simply won't be used anymore, because the result restored in the ANS anymore and no need to directly continue from the result in the processDisplay. But result will be shown until number passed with operation sign... // but same if statement still can stand for 'after deletion'
Object.keys(operations).forEach(function(key) {
	
	operations[key]['div'].addEventListener('click', function() {
		addOperation(this.innerText);
	});

});


clearButton.addEventListener('click', AC); 
deleteButton.addEventListener('click', cleaningFunction);

equalButton.addEventListener('click', executeCalculation);

dotButton.addEventListener('click', addDot);


ansButton.addEventListener('click', () => {
	if (ANS)
	{
		let tmpP = document.createElement('p');
		tmpP.innerText = ANS;
		processInput.insertAdjacentElement('afterbegin', tmpP);
	}
});

document.addEventListener('keydown', (event) => {
	// console.log(event.key);
	// thinking to use switch, but loop is better, also got function for this...
	if (stringIncludesOneOfTheCharInTheList(event.key, numbersArray) && event.key.length == 1)
	{
		addNumber(event.key);
	}
	else
	{
		let _key = event.key;
		console.log(_key);
		switch (true)
		{
			case (_key == '.'):
				addDot();
				break;
			case (stringIncludesOneOfTheCharInTheList(_key, operationsArray) && _key.length == 1):
				// console.log('operation');
				addOperation(_key);
				break;
			case (_key == 'Backspace'):
				cleaningFunction();
				break;
			case (_key == 'Enter' || _key == '=' || _key == '='):
				executeCalculation();
				break;
		}
	}
});



// -- MOUSE HOVER SCROLL PAST--------------------------
let inTopPast = false;
let inBottomPast = false;
let scrollIsOn = false;
let scrollSleep = 10;
let clientX = null; // making these global, would let the scrollPast function to read when it's going on it's own... and we don't have to pass these variables to the scrollPast function everytime
let clientY = null;
document.body.addEventListener('mousemove', (event) => {
	pastTopCoordinate = divOfPast.offsetTop;
	pastBottomCoordinate = divOfPast.offsetTop + divOfPast.clientHeight;
	pastMiddleCoordinate = (divOfPast.offsetTop + divOfPast.clientHeight) / 2;
	pastMiddleCoordinateTop = pastMiddleCoordinate - ((divOfPast.offsetHeight * 2) / 10);
	pastMiddleCoordinateBottom = pastMiddleCoordinate + ((divOfPast.offsetHeight * 2) / 10);
	pastLeftCoordinate = divOfPast.offsetLeft;
	pastRightCoordinate = divOfPast.offsetLeft + divOfPast.offsetWidth;

	clientX = event.clientX;
	clientY = event.clientY;

	if (event.clientX > pastLeftCoordinate && event.clientX < pastRightCoordinate)
	{
		if (event.clientY < pastMiddleCoordinateTop && event.clientY > pastTopCoordinate)
		{
			inTopPast = true;
			inBottomPast = false;
			scrollPast(false);
		}
		else if (event.clientY > pastMiddleCoordinateBottom && event.clientY < pastBottomCoordinate)
		{
			inTopPast = false;
			inBottomPast = true;
			scrollPast(false);
		}
		else
			// console.log('out of scrolling areas');
			scrollIsOn = false;
	}
	else
		scrollIsOn = false;
	
});

document.body.addEventListener('mouseout', (event) => {
	// onsole.log('mouse out');
	inTopPast = false;
	inBottomPast = false;
	scrollIsOn = false;
});

// NOTE if, for example, mouse gets out of the area, and gets into the area during the scrollSleep of setTimeout, then multiple of the function might be called... I don't think we'lll have this issue a lot when we reduce the scrollSleep, but make the scrollSleep veryy small, and therefore also the scrolling every time...
function scrollPast(fromScrollPast=false) {

	divTop = divOfPast.offsetTop;
	divBottom = divOfPast.offsetTop + divOfPast.clientHeight;
	divLeft = divOfPast.offsetLeft;
	divRight = divOfPast.offsetLeft + divOfPast.offsetWidth;
	pastMiddleCoordinateTop = pastMiddleCoordinate - ((divOfPast.offsetHeight * 2) / 10);
	pastMiddleCoordinateBottom = pastMiddleCoordinate + ((divOfPast.offsetHeight * 2) / 10);



	if ((!scrollIsOn || fromScrollPast))
	{
		if ((divLeft < clientX && clientX < divRight) 
			&& 
			(	(divBottom > clientY && clientY > pastMiddleCoordinateBottom) 
				|| (divTop < clientY && clientY < pastMiddleCoordinateTop)
			)
		) // just checking if mouse is in the main boundaries is enough, top or bottom controlled by eventlistener...
		{
			if (inTopPast)
			{
				divOfPast.scrollBy({left:0, top:-40, behavior:'smooth'});
				scrollIsOn = true;
				// console.log('top');
				setTimeout(() => {
						scrollPast(fromScrollPast=true);
					}
					, scrollSleep 
				);
			}
			else if (inBottomPast)
			{
				divOfPast.scrollBy({left:0, top:40, behavior:'smooth'});
				scrollIsOn = true;
				// console.log('bottom');
				setTimeout(() => {
						scrollPast(fromScrollPast=true);
					}
					, scrollSleep
				);
			}
		}
		else
			scrollIsOn = false;
	}
};



// -- MOUSE HOVER SCROLL PROCESS DISPLAY ----------------------------
let inRightDisplay = false;
let inLeftDisplay = false;
let displayScrollIsOn = false;  // for running first time from idle
let displayScrollSleep = 10;


processDisplay.addEventListener('mousemove', (event) => {
	processDisplayTopCoordinate = processDisplay.offsetTop;
	processDisplayBottomCoordinate = processDisplay.offsetTop + processDisplay.clientHeight;

	processDisplayLeftCoordinate = processDisplay.offsetLeft;
	processDisplayRightCoordinate = processDisplay.offsetLeft + processDisplay.offsetWidth;
	processDisplayHorizontalMiddleCoordinate = (processDisplayLeftCoordinate + processDisplayRightCoordinate) / 2;
	processDisplayMiddleCoordinateLeft = processDisplayHorizontalMiddleCoordinate - ((processDisplay.offsetWidth * 2) / 10);
	processDisplayMiddleCoordinateRight = processDisplayHorizontalMiddleCoordinate + ((processDisplay.offsetWidth * 2) / 10);

	clientX = event.clientX;
	clientY = event.clientY;
	
	if (event.clientY > processDisplayTopCoordinate && event.clientY < processDisplayBottomCoordinate)
	{
		if (processDisplayLeftCoordinate < event.clientX && event.clientX < processDisplayMiddleCoordinateLeft)
		{
			inRightDisplay = false;
			inLeftDisplay = true;
			scrollDisplay(false);
		}
		else if (processDisplayMiddleCoordinateRight < event.clientX && event.clientX < processDisplayRightCoordinate)
		{
			inRightDisplay = true;
			inLeftDisplay = false;
			scrollDisplay(false);
		}
		else
			// console.log('out of scrolling areas');
			displayScrollIsOn = false;
	}
	else
		displayScrollIsOn = false;
	
});



document.body.addEventListener('mouseout', (event) => {
	// console.log('mouse out');
	inRightDisplay = false;
	inLeftDisplay = false;
	displayScrollIsOn = false;
});



// you know, when mouse gets in and out faster than the displayScrollSleep, this function called multiple times like past scrolling, but after reducing the displayScrollSleep, this problem can be avoided...
function scrollDisplay(fromScrollDisplay=false, side=null) {

	divTop = processDisplay.offsetTop;
	divBottom = divTop + processDisplay.clientHeight;
	divLeft = processDisplay.offsetLeft;
	divRight = divLeft + processDisplay.offsetWidth;

	processDisplayHorizontalMiddleCoordinate = (processDisplayLeftCoordinate + processDisplayRightCoordinate) / 2;
	processDisplayMiddleCoordinateLeft = processDisplayHorizontalMiddleCoordinate - ((processDisplay.offsetWidth * 2) / 10);
	processDisplayMiddleCoordinateRight = processDisplayHorizontalMiddleCoordinate + ((processDisplay.offsetWidth * 2) / 10);

	if (side == 'left')
		inLeftDisplay = true;
	else if (side == 'right')
		inRightDisplay = true;


	// displayScrollIsOn can be opened inside scrollDisplay, and after the function first run by eventlistener, to prevent multiple calling the function by eventlistener...
	if ((!displayScrollIsOn || fromScrollDisplay))
	{
		if ((divTop < clientY && clientY < divBottom) 
			&& 
			(	(processDisplayLeftCoordinate < clientX && clientX < processDisplayMiddleCoordinateLeft) 
				|| (processDisplayMiddleCoordinateRight < clientX && clientX < processDisplayRightCoordinate)
			)
		)
		{
			
			// for some reason I dont know, inLeftDisplayy and inRightDisplay was being updated to false (maybe something in css was triggering), so I added 'side' as argumnet...
			if (side == 'left')
				inLeftDisplay = true;
			else if (side == 'right')
				inRightDisplay = true;

			// console.log(clientX, clientY, '\n', `inRightDisplay: ${inRightDisplay}\n inLeftDisplay: ${inLeftDisplay}`);
			if (inRightDisplay)
			{
				processDisplay.scrollBy({left:10, top:0, behavior:'smooth'});
				displayScrollIsOn = true;
				// console.log('right');
				setTimeout(() => {
						scrollDisplay(true, 'right');
					}
					, displayScrollSleep 
				);
			}
			else if (inLeftDisplay)
			{
				processDisplay.scrollBy({left:-10, top:0, behavior:'smooth'});
				displayScrollIsOn = true;
				// console.log('left');
				setTimeout(() => {
						scrollDisplay(true, 'left');
					}
					, displayScrollSleep
				);
			}
			else
				// console.log(clientX, clientY, '\n', `inRightDisplay: ${inRightDisplay}\n inLeftDisplay: ${inLeftDisplay}`);
				;		
		}
		else
			displayScrollIsOn = false;
	}
};








// ----------------------------------------------------------------------
//
// --------------------------- FUNCTIONS --------------------------------



function addNumber(_string)
{
	let newP = document.createElement('p');
	newP.innerText = _string;
	processInput.insertAdjacentElement('afterBegin', newP);
}

function addDot()
{
	if (processInput.firstChild && document.evaluate('//*[contains(text(), ".")]', processInput, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 1)
	{
		if (processInput.firstChild.innerText != '.')
		{
			let tmpP = document.createElement('p');
			tmpP.innerText = '.';
			processInput.insertAdjacentElement('afterbegin', tmpP);
		}
	}
}

function addOperation(_string) {

	let tmpString = numberInInput();
		
	if (processDisplay.childElementCount == 1 && parseFloat(processDisplay.firstChild.innerText) == parseFloat(ANS) && resultBeingShown)
	{
		cleanProcessDisplay();
	}

	if (processInput.childElementCount >= 1)
	{
		if (!processDisplay.firstChild) // there'sn't anything in the processDisplay, directly can pass
		{
			addFromInputToProcess(tmpString);
			addFromInputToProcess(_string);
			cleanProcessInput();
		}
		else if (parseInt(processDisplay.firstChild.innerText) && !resultBeingShown) // element at the rightest in processDisplay is not a operation sign but a number, so we should pass operation sign    // this can also appear after deletion!!! // but shouldn't be the result...
		{
			let tmpP = document.createElement('p');
			tmpP.innerText = _string;
			processDisplay.insertAdjacentElement('afterbegin', tmpP);
			tmpP = document.createElement('p');
			tmpP.innerText = numberInInput();
			processDisplay.insertAdjacentElement('afterbegin', tmpP);
			cleanProcessInput();
		}
		else
		{
			if (tmpString != '') // this probably enough for the rest I think
			{
				addFromInputToProcess(tmpString);
				addFromInputToProcess(_string);
				cleanProcessInput();
			}
		}
	}
	else if (parseInt(processDisplay.firstChild.innerText) && !resultBeingShown) // to be able to just pass operationSign for the another specific situation (rightest element in the processDisplay is number, nothing in processInput, so can directly pass operation sign)
	{
		console.log('bbbbbbbbbbbbbbbbbb');
		let tmpP = document.createElement('p');
		tmpP.innerText = _string;
		processDisplay.insertAdjacentElement('afterbegin', tmpP);
	}

}



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
			// console.log(tmpString);
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
				else if (tmpString[i + 1] == '.') // means for loop didn't broken and came up to this point and the next char is '.' (0e.g. 00000.8)
				{
					indexZeroUntil = i;
					break;
				}
				else
					break;
			}
			tmpString = tmpString.slice(indexZeroUntil, );

			// ------
			// very similar  with above, just in the opposite direction for the zeros after last number in the right of the dot... (e.g. , 0.200000000000 -> 0.2)
			let indexZeroUntilBefore = 0;
			for (let i = 0; i < tmpString.length; ++i)
			{
				// from right to left
				let theChar = tmpString[tmpString.length - 1 - i];
				let theCharBefore = tmpString[tmpString.length - 1 - i - 1];
				if (theCharBefore != '.') // until the number just after dot
				{
					if (theChar != '0')
					{
						indexZeroUntilBefore = tmpString.length - i;
						break;
					}
				}
				else if (theCharBefore == '.')		// means for loop didn't broken and came up to this point and the next char is '.' (0e.g. 00000.8)
													// also means something like .0, so can take it as inteeger dirrectly...
				{
					if (theChar == '0')
					{
						indexZeroUntilBefore = tmpString.length - 1 - i -1;
						break;
					}
					else
					{
						// console.log('aaaaaaaaaaaaaaaaaaaaaaa');
						indexZeroUntilBefore = tmpString.length - 1 - i + 1;
						break;
					}
				}
				else
					break;
			}
			tmpString = tmpString.slice(0, indexZeroUntilBefore);

		}
	}
	
	if (tmpString[tmpString.length - 1] == '.')
		tmpString = tmpString.slice(0, -1);

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



	// TODO, 'past' functionality
	function fromProcessDisplayToPast() {
		let tmpDiv = document.createElement('div');
		tmpDiv.innerHTML = processDisplay.innerHTML;
		pastDivPStringDiv = document.evaluate('//div[contains(@class, "past")]/div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
		pastDivPStringDiv.insertAdjacentHTML('afterend', '<div>' + tmpDiv.innerHTML + '</div>');
	}

	if (processInput.firstChild && processDisplay.firstChild)
	{
		if (!parseInt(processDisplay.firstChild.innerText))
		{
			// TODO add number in processInput to processDisplay
			let newP = document.createElement('p');
			newP.innerText = numberInInput();
			processDisplay.insertAdjacentElement('afterBegin', newP);
			cleanProcessInput();	
		
			fromProcessDisplayToPast();

			multiplication_division_execute();
			addition_substraction_execute();

			ANS = parseFloat(processDisplay.firstChild.innerText);
			updateAnsDisplay();

			resultBeingShown = true;
		}
	}
	else // after deletion, there might be calculations to process etc,...
	{
		if (processDisplay.childElementCount > 2 && parseFloat(processDisplay.firstChild.innerText)) // min 2 number and 1 operation sign, and first child (element in the rightest) is number
		{
			fromProcessDisplayToPast();
			
			multiplication_division_execute();
			addition_substraction_execute();

			ANS = parseFloat(processDisplay.firstChild.innerText);
			updateAnsDisplay();

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
		// console.log(num1Node);
		
		processDisplay.removeChild(num2Node);
		processDisplay.removeChild(the_node);
		
		multiplication_division_nodes = document.evaluate(multiplication_division_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		console.log(processInput.innerHTML);
	}

}


// very similat to multiplication_division
function addition_substraction_execute() {
	// addition_substraction_xpath = '//div[@class="process"]/*[(contains(text(), "+") or contains(text(), "-")) and not((';
	// for (let i = 0; i < 10; i++)
	// 	if (i < 9)
	// 		addition_substraction_xpath = addition_substraction_xpath + `contains(text(), "${i}") or `;
	// 	else
	// 		addition_substraction_xpath = addition_substraction_xpath + `contains(text(), "${i}")))]`;
	// console.log(addition_substraction_xpath);
	// // -- no need to use this everytime run
	addition_substraction_xpath = '//div[@class="process"]/*[(contains(text(), "+") or contains(text(), "-")) and not((contains(text(), "0") or contains(text(), "1") or contains(text(), "2") or contains(text(), "3") or contains(text(), "4") or contains(text(), "5") or contains(text(), "6") or contains(text(), "7") or contains(text(), "8") or contains(text(), "9")))]';


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
function stringIncludesOneOfTheCharInTheList(_string, _list) {
	let it_has = false;
	Array.from(_string).forEach((stringChar) => {
		Array.from(_list).forEach((stringToCheck) => {
			if (stringChar == stringToCheck)
				it_has = true;
		});
	});
	// console.log('--', it_has, '\n', _string, _list);
	return it_has;
}


function updateAnsDisplay() {
	ansDisplay.innerText = `${ANS} = ANS`;
}



// ----------------------------------------------------------------------
//
// --------------- FUNCTIONS TO USE IN THE CONSOLE ----------------------

function fillDivOfPast() {
	let pastDivPStringDiv = document.evaluate('//div[contains(@class, "past")]/div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	for (let i = 0; i < 100; ++i)
	{
		let element = document.createElement('div');
		element.innerHTML = `${i} + ${i}`;
		pastDivPStringDiv.insertAdjacentElement('afterend', element);
	}
}

function fillProcessDisplay() {
	for (let i = 0; i < 40; ++i)
	{
		let element = document.createElement('div');
		element.innerHTML = `${i}`;
		processDisplay.insertAdjacentElement('beforeend', element);
		element = document.createElement('div');
		element.innerHTML = `+`;
		processDisplay.insertAdjacentElement('beforeend', element);
	}
}





// ---------------------------------------
// -------------------- SELF NOTE --------------------
// you can declare variable beefore the funtion declaration, but variable declaration should be before the function execution !!!!


