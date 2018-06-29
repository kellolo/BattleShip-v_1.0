var SHIPSNUMBER = [[1, 4], [2, 3], [3, 2], [4, 1]];
var randomize = function () {
	let rndCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
	return rndCoord; 
};

var generate = function () {
	let map = [];
	for (let i = 0; i < 10; i++) {
		let b = [];
		for (let j = 0; j < 10; j++){
			b.push(0);
		}
		map.push(b);
	}
	return map; //возвращает поле сост из нулей (ноль - свободная ячейка)
};

var findStartPosition = function () {
	let newStartPoint = randomize();
	return newStartPoint;
};

var check = function (coord, size, delta, block) {
	//coord - [x, y]
	//size - num
	//delta === direction [x, y]
	let checkStart = function () {
		let k = 0;
		for (let i = 0; i < block.length; i++) {
			if (coord[0] == block[i][0] && coord[1] == block[i][1]) {
				k++;
			}
		}
		if (k == 0) {
			return true;
		}
		return false;
	};

	let checkX = function () {
		let x = coord[0];
		for (let i = 0; i < size; i++) {
			x = x + delta[0];
			if (x > 10 || x < 0) {
				return false;
			}
		}
	};

	let checkY = function () {
		let y = coord[1];
		for (let i = 0; i < size; i++) {
			y = y + delta[1];
			if (y > 10 || y < 0) {
				return false;
			}
		}
	};

	let checkBlock = function () {
		let k = 0;
		let direction = delta; // [~x, ~y]
		let suppose = [[coord[0]], [coord[1]]]; //[[x...], [y...]]
		let newSup = coord; // [x, y]

		for (let x = 1; x < size; x++) {
			suppose[0][x] = newSup[0] + direction[0];
			suppose[1][x] = newSup[1] + direction[1];
			newSup = [newSup[0] + direction[0], newSup[1] + direction[1]];
		}

		for (let i = 0; i < suppose[0].length; i++) {
			for (j = 0; j < block.length; j++) {
				if (suppose[0][i] == block[j][0] && suppose[1][i] == block[j][1]) {
					k++;
				}
			}
		}
		
		if (k == 0) {
			return true;
		}
		return false;
	};

	if (checkStart() != false && checkX() != false && checkY() != false && checkBlock() != false) {
		return true;
	} else {
		return false;
	}
};

var createShip = function (type, blocked) {
	let DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	let newShipObj = {cells: [], holes: []};
	let ship = new Array;

	let newCoord = new Array;
	let direction = DIRECTIONS[(Math.round(Math.random() * 3))];

	let create = function (blocked) {
		let aval = false;
		let start = randomize();

		while (aval != true) {
			let blockedCells = blocked;
			start = randomize();
			aval = check(start, type, direction, blockedCells);
		}

		if (aval == true) {
			while (ship.length === 0) {
				ship.push(start);
				for (let i = 1; i < type; i++) {
					newCoord = [start[0] + direction[0], start[1] + direction[1]];
					start = newCoord;
					ship.push(newCoord);
				}
				newShipObj.cells = ship;
				newShipObj.holes = filter(crHoles(ship));
			}
			return true;
		} 
		return false;
	};

	let crHoles = function (ship) {
		let holes = [];

		for (let i = 0; i < ship.length; i++) {
			let current = ship[i];
			let newHole = [];
			while (holes.indexOf(newHole) < 0) {
				for (let j = -1; j < 2; j++) {
					for (let k = -1; k < 2; k++) {
						newHole = [current[0] + j, current[1] + k];
						if ((newHole[0] >= 0 && newHole[0] <= 10) && (newHole[1] >= 0 && newHole[1] <= 10)) {
							let k = 0;
							for (let xx = 0; xx < ship.length; xx++) {
								if (newHole[0] == ship[xx][0] && newHole[1] == ship[xx][1]) {
									k++;
								}
							}
							if (k == 0) {
								holes.push(newHole);
							}
						}
					}
				}
			}
		}
		return filter(holes);
	};

	let stop = false
	while (stop != true) {
		stop = false;
		stop = create(blocked);
	}

	let newHoles = crHoles(ship);
	return newShipObj;
};

//Фильтрация массивов до уникальных значений//
var filter = function (arr) {
	let rezult = [];

	for (let i = 0; i < arr.length; i++) {
		if (rezult == []) {
			result.push(arr[i]);
			} else {
				let current = arr[i];
				let k = 0;
				for (let j = 0; j < rezult.length; j++) {
					if (current[0] == rezult[j][0] && current[1] == rezult[j][1]) {
				  	k++;
				  }
			}
			if (k == 0) {
				rezult.push(current);
			}
		}
	}
	return rezult;
};

//Создание кораблей и блокированных ячеек и размещение их в общем объекте//
var createShips = function () {
	let object = {ships: [], holes: [], all: []};
	let allShips = [];
	let allHoles = [];

	let map = function (type) {
		for (let i = 4 - type; i < allShips.length; i++) {
			object.ships.push(allShips[i]);
		}

		for (let i = 0; i < allHoles.length; i++) {
			for (let j = 0; j < allHoles[i].length; j++) {
				for (let k = 0; k < allHoles[i][j].length; k++) {
					object.holes.push(allHoles[i][j][k]);
				}
			}
		}
		object.holes = filter(object.holes);

		for (let i = 0; i < object.holes.length; i++) {
			object.all.push(object.holes[i]);
		}

		for (let i = 0; i < object.ships.length; i++) {
			for (let j = 0; j < object.ships[i].length; j++) {
				for (let k = 0; k < object.ships[i][j].length; k++) {
					object.all.push(object.ships[i][j][k]);
				}
			}
		}
		object.all = filter(object.all);
		return object;
	};

	for (let type = 4; type > 0; type--) {
		let ships = [];
		let holes = [];
		for (let number = 1; number <= 5 - type; number++) {

			let get = createShip(type, object.all);

			for (k = 0; k < get.holes.length; k++) {
				object.all.push(get.holes[k]);
			}

			for (l = 0; l < get.cells.length; l++) {
				object.all.push(get.cells[l]);
			}

			while (ships.length < number) {
				ships.push(get.cells);
			}
			while (holes.length < number) {
				holes.push(get.holes);
			}
			
		}
		allShips.push(ships);
		allHoles.push(holes);
		map(type);
	}
	return object;
};

//ZAPUSK//
var createMap = function () {
	var mapObjects = createShips();
	var map = generate();
	let drawMap = function (map) {
		let ships = mapObjects.ships;
		let u = 0;
		
		let holess = mapObjects.holes;

		for (let m = 0; m < holess.length; m++) {
			if (holess[m][0] < 10 && holess[m][1] < 10) {
				map[holess[m][0]][holess[m][1]] = 9;
			}
		}

		for (let i = 0; i < ships.length; i++) {
			let ship =  ships[i];
			for (let j = 0; j < ship.length; j++) {
				for (let k = 0; k < ship[j].length; k++) {
					map[ship[j][k][0]][ship[j][k][1]] = 5 - ship.length;
				}
			}
		}
		return map;
	};
	drawMap(map);
	return [map, mapObjects.ships];
};

