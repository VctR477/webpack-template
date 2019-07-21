import './styles.scss';
import Snake from './js/snake';

const KEY_CODE_ARROW_RIGHT = 39;
const KEY_CODE_ARROW_LEFT = 37;
const KEY_CODE_ARROW_BOTTOM = 40 ;
const KEY_CODE_ARROW_TOP = 38;
const ONE_SECOND = 1000;
const FPS = 6;
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';

function gameStart(snake) {
	snake.gameUpdate();
	snake.game = setTimeout(() => {
		requestAnimationFrame(() => {
			gameStart(snake)
		});
	}, ONE_SECOND / FPS);
	if (snake.gameOver) {
		clearTimeout(snake.game);
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


window.snake = new Snake();
snake.init();

const btn = document.getElementById('btn');
btn.addEventListener('click', event => {
	event.currentTarget.innerText = 'restart';
	// if ('snake' in window) {
	// 	clearTimeout(snake.game);
	// 	document.removeEventListener('keydown', turn);
	// 	delete window.snake;
	// }
	
	document.addEventListener('keydown', turn, false);
	gameStart(snake);
});
