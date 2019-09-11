var chat = {
	1: {
		text: 'Hi! I\'m here to help you find out about SchoolBot. Are you: ',
		options: [
			{
				text: 'a school',
				next: 2
			},
			{
				text: 'a parent',
				next: 5
			}
		]
	},
	2: {
		text: 'Great! Let me tell you a bit about how SchoolBot helps schools.',
		next: 3
	},
	3: {
		text: 'Most schools have information for parents in lots of different places.',
		next: 4
	},
	4: {
		text: 'Which makes it hard to find, and difficult to update.',
		options: [
			{
				text: 'Tell me more',
				//next: 7
			}
		]
	},
	5: {
		text: 'Hey, parent. Are you bombarded with information from your school?',
		options: [
			{
				text: 'Why, yes, actually, I am!',
				next: 6
			}
		]
	},
	6: {
		text: 'We know, we know. And we have a solution that helps both you and the school!'
	}
};


const bot = function () {

	const position = document.getElementById('chat-position');
	const main = document.getElementById('main');

	const sleep = function (ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const scrollMain = function() {
		main.scrollTop = main.scrollTopMax;
	}

	const insertNewChatItem = function(elem) {
		main.insertBefore(elem, position);
		scrollMain();
		//debugger;
		elem.classList.add('activated');
	}
	
	const printResponse = async function (step) {
		const response = document.createElement('div');
		response.classList.add('chat-response');
		response.innerHTML = step.text;
		insertNewChatItem(response);
		
		await sleep(1500);
		
		if (step.options) {
			const choices = document.createElement('div');
			choices.classList.add('choices');
			step.options.forEach( function(option) {
				const button = document.createElement('button');
				button.classList.add('choice');
				button.innerHTML = option.text;
				button.dataset.next = option.next;
				choices.append(button);
			});
			insertNewChatItem(choices);
		} else if (step.next) {
			printResponse(chat[step.next]);
		}
	}

	const printChoice = function (choice) {
		const choiceElem = document.createElement('div');
		choiceElem.classList.add('chat-ask');
		choiceElem.innerHTML = choice.innerHTML;
		insertNewChatItem(choiceElem);
	}

	const disableAllChoices = function() {
		const choices = document.querySelectorAll('.choice');
		choices.forEach( function(choice) {
			choice.disabled = 'disabled';
		});
		return;
	} 

	const handleChoice = async function (e) {

		if (! e.target.classList.contains('choice')) {
			return;
		}

		e.preventDefault();
		const choice = e.target;

		disableAllChoices();

		printChoice(choice);
		scrollMain();
		
		await sleep(1500);
		
		if (choice.dataset.next) {
			printResponse(chat[choice.dataset.next]);
		}
		// Need to disable buttons here to prevent multiple choices
	}

	const init = function () {
		main.addEventListener('click', handleChoice);
		printResponse(chat[1]);
	}

	init();
}

bot();