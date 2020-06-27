
var fern_canvas = document.getElementById("fern");
var fern_ctx = fern_canvas.getContext('2d');

const WIDTH = fern_canvas.width;
const HEIGHT = fern_canvas.height;

var fern_theta = 0.06;

function draw_fern() {
	fern_ctx.clearRect(0, 0, WIDTH, HEIGHT);
	fern_ctx.fillStyle = "black";
	var fern_nextX, fern_nextY, fern_x, fern_y, fern_plotX, fern_plotY, fern_r;
	fern_x = 0, fern_y = 0;
	for (var fern_i = 0; fern_i < 100000; fern_i++) {
		fern_r = Math.random();
		if (fern_r < 0.03) {
			fern_nextX =  0;
			fern_nextY =  0.16 * fern_y;
		} else if (fern_r < 0.8) {
			fern_nextX =  0.85 * Math.cos(fern_theta) * fern_x + Math.sin(fern_theta) * fern_y;
			fern_nextY = -Math.sin(fern_theta) * fern_x + 0.85 * Math.cos(fern_theta) * fern_y + 1.6;
		} else if (fern_r < 0.9) {
			fern_nextX =  0.20 * fern_x - 0.26 * fern_y;
			fern_nextY =  0.23 * fern_x + 0.22 * fern_y + 1.6;
		} else {
			fern_nextX = 0.19 * fern_x + 0.26 * fern_y;
			fern_nextY = -0.22 * fern_x + 0.23 * fern_y + 0.44;
		}
		fern_x = fern_nextX;
		fern_y = fern_nextY;
		fern_centerX = WIDTH/4 * (fern_x/2.5 + 2);
		fern_centerY = HEIGHT - fern_y * (HEIGHT / 11);
		fern_ctx.fillRect(fern_centerX, fern_centerY, 1, 1);
	}
}
var fernIntervalID;
var fern_i = Math.PI / 2;


function start_fern() {
	// test for speed, start fern
	var fern_start = (new Date()).getTime();
	draw_fern();
	var s = (new Date()).getTime() - fern_start;
	if (s < 80) {
		fernIntervalID = setInterval(function() {
			draw_fern();
			fern_theta = 0.06 * Math.sin(fern_i);
			fern_i += 0.1;
			fern_i = fern_i % (2 * Math.PI);
		}, 80);
	}
}


function stop_fern() {
		clearInterval(fernIntervalID);
		draw_fern();
}
