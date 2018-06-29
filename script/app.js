//Вары

var startButton = document.querySelector('#startGame');
var userName = document.querySelector('#userName');
var gameYard = document.querySelector('.gameYard');
var startGame = document.querySelector('.startGame');
var userMap = document.querySelector('.userMap');
var pcMap = document.querySelector('.pcMap');
var uName = '';
var userField = createMap();
var pcField = createMap();
// Смена экрана
var hide = function () {
	startGame.classList.add('hidden');
	gameYard.classList.remove('hidden');
};



//генерация полей
var generate = function () {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let cell = document.createElement('button');
			cell.classList.add('userCell');
			cell.classList.add('Cell');
			cell.classList.add('r' + i + 'c' + j);
			cell.disabled = 'true';
			userMap.appendChild(cell);
			console.log(i);
		}
	}

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let cell = document.createElement('button');
			cell.classList.add('pcCell');
			cell.classList.add('Cell');
			cell.classList.add('r' + i + 'c' + j);
			cell.addEventListener('click', playersTurn);
			pcMap.appendChild(cell);
		}
	}

	let fillTables = function () {
		let TABLES = ['pc', 'player'];
		for (let i = 0; i < 2; i++) {
			let table = document.querySelector('#table_' + TABLES[i]);
			for (let j = 4; j > 0; j--) {
				let cell = table.querySelector('#' + TABLES[i] + '_ship_' + j);
				cell.innerHTML = 5 - j;
			}
		}
		
	};

	fillTables();
};



var getShips = function (arr) {
	let obj = {shipSize_4: arr[0], shipSize_3: arr[1], shipSize_2: arr[2], shipSize_1: arr[3]};
	
	return obj;
};

var userObj = getShips(userField[1]);
var pcObj = getShips(pcField[1]);
console.log(userField);
var colorShips = function (arr, field) {
	let mapName;
	let mapDiv;
	let ship;

	if (field == 0) {
		mapName = 'user';
		mapDiv = document.querySelector('.user');
		let cell = document.querySelector('.userCell');
	} else {
		mapName = 'pc';
		mapDiv = document.querySelector('.pc');
		let cell = document.querySelector('.pcCell');
	}

	for (let i = 0; i < arr[0].length; i++) {
		for (let j = 0; j < arr[0][i].length; j++) {
			let point = arr[0][i][j];
			if (point > 0 && point < 8) {
				mapDiv.querySelector('.r' + i + 'c' + j).style.backgroundColor = 'grey';
			} 
		}
	}
};

var check = function (obj, coord, hit) {
	let shipArr;
	if (hit == 4) {
		shipArr = obj.shipSize_4;
	} else if (hit == 3) {
		shipArr = obj.shipSize_3;
	} else if (hit == 2) {
		shipArr = obj.shipSize_2;
	} else if (hit == 1) {
		shipArr = obj.shipSize_1;
	}

	let checkCoord = function(shipArr) {
		for (let i = 0; i < shipArr.length; i++) {
			let ship = shipArr[i];
			for (let j = 0; j < ship.length; j++) {
				if (coord[0] == ship[j][0] && coord[1] == ship[j][1]) {
					shipArr[i][j][0] = 100;
					shipArr[i][j][1] = 100;
				}
			}
		}
	};

	checkCoord(shipArr);
	return obj;
};

var renewMap = function (i, j, hit, strikeTo) {
	let color;
	let target;

	if (strikeTo == 'pc') {
		target = pcMap;
	} else if (strikeTo == 'player'){
		target = userMap;
	} else {alert(1)}

	if (hit > 0 && hit < 9) {
		color = 'red';
	} else {
		color = 'lightyellow';
	}
	
	let cell = target.querySelector('.r' + i + 'c' + j);
	cell.style.backgroundColor = color;
	cell.disabled = true;
};

var kill = function (shipArr, hit, target) {
	let dead = 0;
	for (let i = 0; i < shipArr.length; i++) {
		
		let ship = shipArr[i];
		let sum = 0;
		let sunk = 0;

		for (let j = 0; j < ship.length; j++) {
			let cell = ship[j];
			sum = cell[0] + cell[1];
			if (sum == 200) {
				sunk++;
			}
		}
		if (sunk == ship.length) {
			dead++;
		}
	}

	target.innerHTML = shipArr.length - dead;

	if (target.innerHTML == 0) {
		target.innerHTML = 'Убил';
	}


};

var renewTable = function (strikeTo, hit, obj) {
	let table;
	let to;
	let target;
	if (strikeTo == 'pc') {
		to = 'pc';
		table = document.querySelector('#table_' + to);
		name = uName;
	} else if (strikeTo == 'player') {
		to = 'player';
		table = document.querySelector('#table_' + to).value;
		name = 'R2-D2';
	}  else {alert(2)}

	let shipArr;
	if (hit == 4) {
		shipArr = obj.shipSize_4;
		target = table.querySelector('#' + to + '_ship_4');
	} else if (hit == 3) {
		shipArr = obj.shipSize_3;
		target = table.querySelector('#' + to + '_ship_3');
	} else if (hit == 2) {
		shipArr = obj.shipSize_2;
		target = table.querySelector('#' + to + '_ship_2');
	} else if (hit == 1) {
		shipArr = obj.shipSize_1;
		target = table.querySelector('#' + to + '_ship_1');
	}

	kill(shipArr, hit, target);

	let w = 0;
	for (let i = 4; i >= 1; i--) {
		if (table.querySelector('#' + to + '_ship_' + i).innerHTML == 'Убил') {
			w++;
		}
		if (w == 4) {
			alert(name + ' побеждает');
		}
		
	}
	console.log(w);

};

var endGame = function() {
	window.location.reload();
};
//ход игрока

var pcTurns = [];

var playersTurn = function () {
	let strikeTo = 'pc';
	let target = pcObj;
	let strike = event.target.className;
	let re = /\D+/ig;
	strike = strike.replace(re, '');

	let i = Math.floor(strike / 10);
	let j = strike % 10;

	let hit = pcField[0][i][j];
	if (hit > 0 && hit < 9) {
		pcObj = check(pcObj, [i, j], hit);
		renewMap(i, j, hit, strikeTo);
		renewTable(strikeTo, hit, target);
	} else {
		renewMap(i, j, hit, strikeTo);
	}

	pcTurn();
};


var pcTurn = function () {
	let strikeTo = 'player';
	let target = userObj;
	let ready = false;
	let iii = 0;
	let random = function () {
		let i = Math.floor(Math.random() * 10);
		let j = Math.floor(Math.random() * 10);

		let num = i * 10 + j;
		return num;
	};

	let guess = random();
	

	while (ready == false) {
		if (pcTurns.indexOf(guess) < 0) {
			pcTurns.push(guess);
			ready = true;
		}  else if (pcTurns.length >= 100){
			endGame();
		} else if (pcTurns.indexOf(guess) >= 0 && pcTurns.length < 100){
			guess = random();
		}
	}

	let i = Math.floor(guess / 10);
	let j = guess % 10;

	let hit = userField[0][i][j];

	if (hit > 0 && hit < 9) {
		userObj = check(userObj, [i, j], hit);
		renewMap(i, j, hit, strikeTo);
		renewTable(strikeTo, hit, target);
	} else {
		renewMap(i, j, hit, strikeTo);
	}
	return;
};


//Начало игры + проверка на ввод имени
var start = function () {
	
	event.preventDefault();
	if (userName.value != '') {
		uName = userName.value;
		generate();
		hide();
		colorShips(userField[1], userMap);
	} else {
		alert('Введите ваше имя, умоляю!');
	}
	
};



// листенеры
startButton.addEventListener('click', start);

