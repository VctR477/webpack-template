import './styles.scss';
import Snake from './js/snake';

const KEY_CODE_ARROW_RIGHT = 39;
const KEY_CODE_ARROW_LEFT = 37;
const KEY_CODE_ARROW_BOTTOM = 40 ;
const KEY_CODE_ARROW_TOP = 38;
const KEY_CODE_SPACE = 32;
const KEY_CODE_ESC = 27;
const ONE_SECOND = 1000;
const FPS = 6;
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';

function gameEngine(snake) {
	snake.gameUpdate();
	snake.game = setTimeout(() => {
		requestAnimationFrame(() => {
			gameEngine(snake)
		});
	}, ONE_SECOND / FPS);
	if (snake.gameOver) {
		clearTimeout(snake.game);
		gameOver();
	}
};

function turn(event) {
	switch (event.keyCode) {
		case KEY_CODE_ARROW_RIGHT:
			snake.snake.direction = snake.snake.direction !== LEFT ? RIGHT : LEFT;
			break;
		case KEY_CODE_ARROW_LEFT:
			snake.snake.direction = snake.snake.direction !== RIGHT ? LEFT : RIGHT;
			break;
		case KEY_CODE_ARROW_TOP:
			snake.snake.direction = snake.snake.direction !== BOTTOM ? TOP : BOTTOM;
			break;
		case KEY_CODE_ARROW_BOTTOM:
			snake.snake.direction = snake.snake.direction !== TOP ? BOTTOM : TOP;
			break;
		default:
			break;
	}
};

const cover = document.getElementById('cover');

function start() {
	document.addEventListener('keydown', turn, false);
	snake.notStarted = false;
	gameEngine(snake);
	cover.classList.add('hide');
	cover.innerHTML = '<span>PAUSE</span>';
}

function pause() {
	if (snake.paused) {
		start();
		snake.paused = false;
	} else {
		clearTimeout(snake.game);
		snake.paused = true;
		document.removeEventListener('keydown', turn);
		cover.classList.remove('hide');
	}
}

function reset() {
	if ('snake' in window) {
		clearTimeout(snake.game);
		document.removeEventListener('keydown', turn);
		delete window.snake;
		window.snake = new Snake();
		cover.classList.remove('hide');
		cover.innerHTML = '<span>Press SPACE to start</span>';
	}
}

function gameOver() {
	cover.classList.remove('hide');
	cover.innerHTML = `<span>GAME OVER<em>score: 2334</em></span>`;
}

window.snake = new Snake();

document.addEventListener('keyup', event => {
	switch (event.keyCode) {
		case KEY_CODE_SPACE:
			if (snake && snake.notStarted) {
				start();
			} else if (snake.gameOver) {
				reset();
			} else {
				pause();
			}
			break;
		case KEY_CODE_ESC:
			reset();
			break;
		default:
			break;
	}
}, false);
