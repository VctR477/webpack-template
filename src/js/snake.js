import randomInteger from './random-int';

const DEFAULT_CANVAS_WIDTH = 500;
const DEFAULT_CANVAS_HEIGHT = 500;
const DEFAULT_CANVAS_BGCOLOR = '#cecece';
const DEFAULT_CANVAS_BORDER = '1px solid #000';
const SIZE_OF_SQUARE = 30;
const GRID_LINE_WIDTH = 2;
const GRID_LINE_COLOR = 'rgba(255, 0, 0, 0.5)';
const DEFAULT_SNAKE_COLOR = 'darkgreen';
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const TARGET_COLOR = '#0000ff';

const IMAGE = {
	headR: '/images/head-r.png',
	headL: '/images/head-l.png',
	headT: '/images/head-t.png',
	headB: '/images/head-b.png',
	tailR: '/images/tail-r.png',
	tailL: '/images/tail-l.png',
	tailT: '/images/tail-t.png',
	tailB: '/images/tail-b.png',
	turnBR: '/images/turn-b-r.png',
	turnBL: '/images/turn-b-l.png',
	turnTR: '/images/turn-t-r.png',
	turnTL: '/images/turn-t-l.png',
	vertical: '/images/vert.png',
	horizontal: '/images/horz.png',
};

class Snake {
	constructor(props) {
		this.defaultProps = {
			width: DEFAULT_CANVAS_WIDTH,
			height: DEFAULT_CANVAS_HEIGHT,
			bgColor: DEFAULT_CANVAS_BGCOLOR,
			border: DEFAULT_CANVAS_BORDER,
			sizeSquare: SIZE_OF_SQUARE,
			lineWidth: GRID_LINE_WIDTH,
			lineColor: GRID_LINE_COLOR,
			snakeColor: DEFAULT_SNAKE_COLOR,
		};
		this.props = Object.assign({}, this.defaultProps, props);
		this.axisX = [];
		this.axisY = [];
		this.ctx;
		this.snakeSize = 0;
		this.snake = {
			position: [],
			direction: RIGHT,
		};
		this.game = false;
		this.targetShow = false;
		this.targetPosition = [];
		this.gameOver = false;
		this.score = 0;

		this.init();
	}

	prepareCanvas() {
		let width = this.props.width;
		let height = this.props.height;
		let step = this.props.sizeSquare - this.props.lineWidth;
		let remainW = width % step;
		let remainH = height % step;

		if (remainW !== 0) {
			width += this.props.sizeSquare - remainW;
			this.props.width = width;
		}
		if (remainH !== 0) {
			height += this.props.sizeSquare - remainH;
			this.props.height = height;
		}

		const canvas = document.getElementById('canvas');
		
		canvas.width = this.props.width;
		canvas.height = this.props.height;
		canvas.style.backgroundColor = this.props.bgColor;
		canvas.style.border = this.props.border;
		this.ctx = canvas.getContext('2d');
	}

	init() {
		this.prepareCanvas();
		this.createCoordinates();
		this.drawGrid();
		this.createFirstSnakePosition();
		this.drawSnake();
		this.drawScore();
		this.notStarted = true;
	}

	drawGrid() {
		const ctx = this.ctx;
		const height = this.props.height;
		const width = this.props.width;
		const lineStartCoordinate = 0;
		ctx.fillStyle = this.props.lineColor;
		for (let i = 0; i < this.axisX.length; i++) {
			ctx.fillRect(this.axisX[i], lineStartCoordinate, this.props.lineWidth, height);
		}
		for (let j = 0; j < this.axisY.length; j++) {
			ctx.fillRect(lineStartCoordinate, this.axisY[j], width, this.props.lineWidth);
		}
	}

	createCoordinates() {
		let lengthX = this.props.width - 1;
		let lengthY = this.props.height - 1;
		let step = this.props.sizeSquare - this.props.lineWidth;
		for (let i = 0; i <= lengthX; i += step) {
			this.axisX.push(i);
		}
		for (let j = 0; j <= lengthY; j += step) {
			this.axisY.push(j);
		}
		this.snakeSize = this.axisX[ 1 ] - this.axisX[ 0 ];
	}

	createFirstSnakePosition() {
		let snakeYPosition = ~~((this.axisY.length / 2) - 1);
		let snakeXPosition = ~~((this.axisX.length - 4) / 2 - 1);
		for (let i = 0; i < 4; i++) {
			let xy = [];
			xy.push(this.axisX[ snakeXPosition + i ]);
			xy.push(this.axisY[ snakeYPosition ]);
			this.snake.position.push(xy);
		}
	}

	drawSnake() {
		const size = this.snakeSize + this.props.lineWidth;
		const snakeArr = this.snake.position.slice().reverse();
		const snakeLastIdx = snakeArr.length - 1;
		snakeArr.forEach((item, idx) => {
			let path = '';
			const x = item[ 0 ];
			const y = item[ 1 ];
			switch (idx) {
				case 0:
					const nextX = snakeArr[ 1 ][ 0 ];
					const nextY = snakeArr[ 1 ][ 1 ];
					path = this.getDirectionHead(x, y, nextX, nextY);
					break;
				case snakeLastIdx:
					const prevX = snakeArr[ idx - 1 ][ 0 ];
					const prevY = snakeArr[ idx - 1 ][ 1 ];
					path = this.getDirectionTail(x, y, prevX, prevY);
					break;
				default:
					const x0 = snakeArr[ idx - 1 ][ 0 ];
					const y0 = snakeArr[ idx - 1 ][ 1 ];
					const x1 = snakeArr[ idx + 1 ][ 0 ];
					const y1 = snakeArr[ idx + 1 ][ 1 ];
					path = this.getMiddlePart(x0, y0, x, y, x1, y1);
					break;
			}
			this.drawPartImageSnake(path, x, y, size);
		});
	}

	getMiddlePart(x0, y0, x, y, x1, y1) {
		let result = '';
		if (x0 === x && x1 === x) {
			result = IMAGE.vertical;
		} else if (y0 === y && y1 === y) {
			result = IMAGE.horizontal;
		} else if (((x0 < x && x === x1) || (x0 === x && x > x1)) && y0 <= y) {
			result = IMAGE.turnTL;
		} else if (((x0 === x && x < x1) || (x0 > x && x === x1)) && y1 >= y) {
			result = IMAGE.turnTR;
		} else if (((x0 < x && x === x1) || (x0 === x && x > x1)) && y0 >= y) {
			result = IMAGE.turnBL;
		} else if (((x0 === x && x < x1) || (x0 > x && x === x1)) && y1 <= y){
			result = IMAGE.turnBR;
		}
		return result;
	}

	getDirectionTail(x, y, x1, y1) {
		let result = '';
		if (y === y1) {
			if (x > x1) {
				result = IMAGE.tailL;
			} else {
				result = IMAGE.tailR;
			}
		} else {
			if (y > y1) {
				result = IMAGE.tailT;
			} else {
				result = IMAGE.tailB;
			}
		}
		return result;
	}

	getDirectionHead(x, y, x1, y1) {
		let result = '';
		if (y === y1) {
			if (x > x1) {
				result = IMAGE.headR;
			} else {
				result = IMAGE.headL;
			}
		} else {
			if (y > y1) {
				result = IMAGE.headB;
			} else {
				result = IMAGE.headT;
			}
		}
		return result;
	}

	drawPartImageSnake(path, x, y, size) {
		const img = new Image();
		img.src = path;
		this.ctx.drawImage(img, x, y, size, size);
	}

	drawScore() {
		const ctx = this.ctx;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.font = '20px arial';
		ctx.fillText(`score: ${this.score}`, 10, 30);
	}

	snakeOneStep() {
		let direction = this.snake.direction;
		const snakeHeadIndex = this.snake.position.length - 1;
		const snakeHead = this.snake.position[ snakeHeadIndex ];
		let xPositionIndex = this.axisX.indexOf(snakeHead[ 0 ]);
		let yPositionIndex = this.axisY.indexOf(snakeHead[ 1 ]);
		let newXY = [];
		switch (direction) { 
			case RIGHT:
				xPositionIndex++;
				break;
			case LEFT:
				xPositionIndex--;
				break;
			case TOP:
				yPositionIndex--;
				break;
			case BOTTOM:
				yPositionIndex++;
				break;
			default:
				break;
		}
		let x = this.axisX[ xPositionIndex ];
		let y = this.axisY[ yPositionIndex ];
		newXY.push(x);
		newXY.push(y);
		this.crashOnWall(newXY);
		this.killYouself(newXY);
		this.snake.position.push(newXY);
		const targetX = this.targetPosition[ 0 ] - this.props.lineWidth;
		const targetY = this.targetPosition[ 1 ] - this.props.lineWidth;
		if (newXY[ 0 ] === targetX && newXY[ 1 ] === targetY) {
			this.targetShow = false;
			this.score += 1;
		} else {
			this.snake.position.shift();
		}
	}

	gameUpdate() {
		this.snakeOneStep();
		if (!this.gameOver) {
			this.clear();
			this.drawSnake();
			this.drawTarget();
			this.drawScore();
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
		this.drawGrid();
	}

	drawTarget() {
		const ctx = this.ctx;
		ctx.fillStyle = TARGET_COLOR;
		const size = this.snakeSize - this.props.lineWidth;
		if (!this.targetShow) {
			let x;
			let y;
			do {
				this.targetShow = true;
				let min = 0;
				let maxX = this.axisX.length - 2;
				let maxY = this.axisY.length - 2;
				let randomX = randomInteger(min, maxX);
				let randomY = randomInteger(min, maxY);
				let posX = this.axisX[ randomX ];
				let posY = this.axisY[ randomY ];
				x = posX + this.props.lineWidth;
				y = posY + this.props.lineWidth;
				let snakeXY = this.snake.position;
				for (let i = 0; i < snakeXY.length; i++) {
					let X = snakeXY[ i ][ 0 ];
					let Y = snakeXY[ i ][ 1 ];
					if (X === posX && Y === posY) {
						this.targetShow = false;
					}
				}
			} while (!this.targetShow);
			this.targetPosition[ 0 ] = x;
			this.targetPosition[ 1 ] = y;
			ctx.fillRect(x, y, size, size);
		} else {
			let x = this.targetPosition[ 0 ];
			let y = this.targetPosition[ 1 ];
			ctx.fillRect(x, y, size, size);
		}
	}

	crashOnWall(headPosition) {
		const xLimitRight = this.axisX[ this.axisX.length - 1 ];
		const xLimitLeft = undefined;
		const yLimitBottom = this.axisY[ this.axisY.length - 1 ];
		const yLimitTop = undefined;
		let x = headPosition[ 0 ];
		let y = headPosition[ 1 ];
		if (x === xLimitRight || x === xLimitLeft || y === yLimitBottom || y === yLimitTop) {
			this.gameOver = true;
			/** TODO сделать нормальный попап */
			// alert('GAME_OVER');
		}
	}

	killYouself(headPosition) {
		const x = headPosition[ 0 ];
		const y = headPosition[ 1 ];
		let snake = this.snake.position;
		for (let i = 0; i < snake.length; i++) {
			if (x === snake[ i ][ 0 ] && y === snake[ i ][ 1 ]) {
				this.gameOver = true;
			/** TODO сделать нормальный попап */
			// alert('GAME_OVER');
			}
		}
	}
}

export default Snake;
