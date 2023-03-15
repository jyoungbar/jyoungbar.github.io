//Speaking Queue JavaScript File

//stores name and number of times spoken for each speaker
class Speaker {
	constructor(name, tallies) {
		this.name = name;
		this.tallies = tallies;
	}
}

//functions for traversing array as if its a tree
function get_parent(index) {return (index-1) / 2 | 0;}
function get_left_child(index) {return 2*index + 1;}
function get_right_child(index) {return 2*index + 2;}

//Priority queue to keep track of speakers on the queue
class PriorityQueue {


	constructor() {
		this.items = [];

		// key: name
		// value: [int tallies, bool isInItems]
		this.record = new Map();
	}

	add(name) {
		//check if speaker is already in items
		// console.log(this.record.get(name));
		if(!this.record.has(name) || !this.record.get(name)[1]) {

			var tallies = 0;
			if(this.record.has(name)) {
				tallies = this.record.get(name)[0];
			}
			this.record.set(name, [tallies, true]);

			//add speaker to items
			var qSpeaker = new Speaker(name, tallies);
			this.items.push(qSpeaker);

			//update position in items (percolate up kinda)
			var index = this.items.length-1;
			var replaced_speaker = qSpeaker;
			while(index > 0) {
				var parent = get_parent(index);
				// console.log(index);
				// console.log(parent);
				var parent_speaker = this.items[parent];
				// console.log(parent_speaker.name);
				//see if the new speaker has spoken less than the parent
				if(parent_speaker.tallies > qSpeaker.tallies) {
					index = parent;
					replaced_speaker = parent_speaker;
				} else {
					//check all speakers between new speaker and parent
					index--;
					while(index > parent && this.items[index].tallies > qSpeaker.tallies) {
						replaced_speaker = this.items[index];
						index--;
					}
					index++;
					replaced_speaker = this.items[index];
					break;
				}
			}
			this.items[index] = qSpeaker;
			this.items.splice(index+1, 0, replaced_speaker);
			this.items.pop();

			return true;
		} else { return false; }
	}

	pop() {
		// var popped_speaker = this.items[0];
		if(this.items.length == 0) {
			//check that the queue is not empty
			return false;
		}

		var name = this.items[0].name;
		this.record.set(name, [this.items[0].tallies+1, false]);
		// console.log(this.record.get(name));
		// console.log(this.record);
		return this.items.shift();
	}

	remove(name) {
		//make sure name is in items
		if(!this.record.get(name)[1]) {
			alert(name + " is not in the queue");
			return false;
		}

		// //subtract tally from record
		// this.record.set(name, [this.record.get(name)[0]-1, false])

		//iterate through items
		for(var i = 0; i < this.items.length; i++) {
			if(this.items[i].name == name) {
				var removed_speaker = this.items[i];
				this.items.splice(i, 1);
				this.record.set(name, [removed_speaker.tallies, false]);
				return true;
			}
		}
	}

	//clear all items in the queue
	//returns number of removed items
	clear() {
		if(this.items.length == 0) {
			//check that the queue is not empty
			return 0;
		}

		var numRemoved = 0;
		for(var i = this.items.length-1; i >= 0; i--) {
			numRemoved++;
			var removed_speaker = this.items[i];
			this.items.pop();
			this.record.set(removed_speaker.name, [removed_speaker.tallies, false]);
		}
		return numRemoved;
	}
}






// var numOpenQueues = 0;
var openQueues = [];

//clears the specified text from the name input box
function clearText(id) {
   if(id.value == "Name") {
      	id.value = "";
      	id.style.color = "black";
   }
}

//sets the text of the comments box to 'Name' 
//when there is no text in the box
function setBlur(id) {
   if(id.value === "") {
      	id.value = "Name";
      	id.style.color = "lightslategrey";
   }
}

function createQueueHTML() {
	// openQueues++;
	// return openQueues.length;
	// return '<button class="delete" id="delete' + openQueues.length + '">-</button>'
	// return '<input type="text" value="Name" id="nameInput" onfocus="clearText(this)" onblur="setBlur(this)">';
	return '<div class="queue" id="queue' + openQueues.length + '">'
		+ '<button class="delete" id="delete' + openQueues.length + ' name="' + openQueues.length + '" ">X</button>'
		+ '<br>'
		+ '<h4 class="isEmpty" id="isEmpty' + openQueues.length + '">This queue is currently empty</h4>'
		+ '<ol class="list" id="list' + openQueues.length + '"></ol>' 
		+ '<button class="next" id="next' + openQueues.length + '" name="' + openQueues.length + '">Next</button>'
		+ '<button class="clear" id="clear' + openQueues.length + '" name="' + openQueues.length + '">Clear</button>'
		+ '<br>'
		+ '<input type="text" value="Name" id="nameInput' + openQueues.length + '" onfocus="clearText(this)" onblur="setBlur(this)">'
		+ '<button class="add" id="add' + openQueues.length + '" name="' + openQueues.length + '">Add Name</button>'
		+ '<h5>Quick Add</h5>'
		+ '<ul class="quickAddList" id="quickList' + openQueues.length + '" name="' + openQueues.length + '"></ul>'
	+ '</div>';
}

//update the queue on the page
function updateQueue(index) {
	var queueList = document.getElementById('list' + index);
	var isEmptyText = document.getElementById('isEmpty' + index);
	var speakers = openQueues[index-1].items;
	if(speakers.length == 0) {
		//check if the queue is now empty
		isEmptyText.innerHTML = "This queue is currently empty";
		queueList.innerHTML = "";
	} else {
		isEmptyText.innerHTML = "Queue:";
		//iterate through all the names on the queue and put them on the page
		queueList.innerHTML = '<li name="' + index + '">' + speakers[0].name + '&nbsp; &nbsp; &nbsp; &nbsp; Times spoken: ' + speakers[0].tallies 
		+ '<button class="deleteName" name="' + speakers[0].name + '">-</button></li>';
		for(var i = 1; i < speakers.length; i++) {
			queueList.innerHTML += '<li name="' + index + '">' + speakers[i].name + '&nbsp; &nbsp; &nbsp; &nbsp; Times spoken: ' + speakers[i].tallies 
			+ '<button class="deleteName" name="' + speakers[i].name + '">-</button></li>';
		}
	}

	//add to the Quick Add List
	var quickAddList = document.getElementById('quickList' + index);
	var record = Array.from(openQueues[index-1].record.entries());
	quickAddList.innerHTML = "";
	for(var i = 0; i < record.length; i++) {
		if(!record[i][1][1]) {
			quickAddList.innerHTML += '<li name="' + index + '">' + record[i][0] + '&nbsp; &nbsp; &nbsp; &nbsp; Times spoken: ' + record[i][1][0] 
			+ '<button class="addQuickName" name="' + record[i][0] + '">+</button></li>';
		}
	}
	
}

//DOM listener for buttons clicks
document.addEventListener('click', function (event) {
	if (!event.target.matches('button')) return event.preventDefault()

	if(event.target.matches('#create')) {
		//clear default text
		if(document.getElementById('queueSpace').innerHTML === "<text>You currently have no queues open</text>") {
			document.getElementById('queueSpace').innerHTML = "";
		}

		//create new queue
		openQueues.push(new PriorityQueue);
		document.getElementById('queueSpace').innerHTML += createQueueHTML();
	
		//enable enter button to submit name in text input
		var input = document.getElementById('nameInput' + openQueues.length);
		input.addEventListener("keypress", function(event) {
			if(event.key == "Enter") {
				event.preventDefault();
				var addButton = document.getElementById('add'+openQueues.length);
				addButton.click();
				event.currentTarget.value = "";
				event.currentTarget.style.color = "lightslategrey";
			}
		});

	} else if(event.target.matches('.delete')) {
		//delete queue
		event.target.parentNode.remove();
		openQueues.splice(event.target.name, 1);

		//put text back if no queues open
		if(document.getElementById('queueSpace').innerHTML === "") {
			document.getElementById('queueSpace').innerHTML = "<text>You currently have no queues open</text>";
		}

	} else if(event.target.matches('.add')) {
		//add a name to a queue
		var queue = event.target.parentNode;
		var name = queue.childNodes[7].value;
		queue.childNodes[7].value = "Name";
		queue.childNodes[7].style.color = "lightslategrey";
		// console.log(name);
		// console.log(event.target.name-1);

		//make sure name field is not blank
		if(name === "Name" || name === "") {
			alert("Name can not be blank");
		} else {
			var success = openQueues[event.target.name-1].add(name.toUpperCase());

			if(success) {
				updateQueue(event.target.name);
			} else {
				alert(name + " is already in the queue");
			}
		}
	
	} else if(event.target.matches('.next')) {
		//delete the first person in the queue
		// if(openQueues[event.target.name-1].)
		var success = openQueues[event.target.name-1].pop();
		if(success == false) {
			alert("The queue is empty");
		} else {
			updateQueue(event.target.name);
		}
		
	} else if(event.target.matches('.clear')) {
		//Clear the queue
		openQueues[event.target.name-1].clear();
		updateQueue(event.target.name);

	} else if(event.target.matches('.deleteName')) {
		//Remove a name from the queue using the - button
		var parent = event.target.parentElement;
		var index = parent.getAttribute('name');
		openQueues[index-1].remove(event.target.name);
		updateQueue(index);

	} else if(event.target.matches('.addQuickName')) {
		//Add a name to the queue from the Quick Add section
		var parent = event.target.parentElement;
		var index = parent.getAttribute('name');
		openQueues[index-1].add(event.target.name);
		updateQueue(index);
	}

});