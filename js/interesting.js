const EDGES = [[0,1], [1,2], [2,0]];


function get_triangulation(p) {
  	// console.log("get triangularization")
  	// triangulation := empty triangle mesh data structure
  	// add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
  	let triangulation = [[-1, -2, -3]];
  	// for each point in pointList do // add all the points one at a time to the triangulation
  	for (let point = 0; point < p.length; point++) {
  		// console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ adding point: " + point);
  		// console.log("\ttriangulation:["); for (zzz in triangulation) {console.log("\t\t" + triangulation[zzz]);} console.log("\t\t]");
  		// console.log("Find all of the bad triangles");
  		// badTriangles := empty set
  		let badTriangles = [];
  		// for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
  		for (let i = 0; i < triangulation.length; i++) {
  			let triangle = triangulation[i];
  			// if point is inside circumcircle of triangle
  			if (point_inside_circumference_of_triangle(point, triangle, p)) {
  				// console.log("\tfound: " + triangle);
  				// 	add triangle to badTriangles
  				badTriangles.push(triangle);
  			}
  		}
  		// console.log("\tBad Triangles:["); for (zzz in badTriangles) {console.log("\t\t" + badTriangles[zzz]);} console.log("\t\t]");
  		// console.log("look through the bad Triangles and find the `polygon` of space around `point` that needs to be re-triangulated");
  		// polygon := empty set
  		let polygon = [];
  		// for each triangle in badTriangles do // find the boundary of the polygonal hole
  		for (let i = 0; i < badTriangles.length; i++) {
  			let triangle = badTriangles[i];
  			// console.log("\tbad triangle: " + triangle + "\n\tfind edges not shared with other bad triangles and add them to `polygon`");
  			// for each edge in triangle do
  			for (let j = 0; j < 3; j++) {
  				// if edge is not shared by any other triangles in badTriangles
  				let edge = [triangle[EDGES[j][0]], triangle[EDGES[j][1]]];
  				// console.log("\t\tedge: " + edge);
  				let shared = false;
  				for (let k = 0; k < badTriangles.length; k++) {
  					if (k != i) {
  						// console.log("     " + badTriangles[k]);
  						if (badTriangles[k].includes(edge[0]) && badTriangles[k].includes(edge[1])) {
  							shared = true;
  							break;
  						}
  					}
  				}
  				// console.log("\t\t\t shared: " + shared);
  				// add edge to polygon
  				if (!shared) {
  					polygon.push(edge)
  				}
  			}
  		}
  		// console.log("\tpolygon:"); for (zzz in polygon) {console.log("\t\t" + polygon[zzz]);}

  		// console.log("Remove all of the bad triangles from triangulation");
  		// for each triangle in badTriangles do // remove them from the data structure
  		// console.log("\tBad Triangles:["); for (zzz in badTriangles) {console.log("\t\t" + badTriangles[zzz]);} console.log("\t\t]");
  		// console.log("\ttriangulation:["); for (zzz in triangulation) {console.log("\t\t" + triangulation[zzz]);} console.log("\t\t]");
  		// console.log("\tremoving...");
  		for (let i = 0; i < badTriangles.length; i++) {
  			// remove triangle from triangulation
  			remove_obj_from_arr(badTriangles[i], triangulation);
  		}
  		// console.log("\ttriangulation:["); for (zzz in triangulation) {console.log("\t\t" + triangulation[zzz]);} console.log("\t\t]");
  		// console.log("re-triangulate polygon hole using `point`");
  		// for each edge in polygon do // re-triangulate the polygonal hole
  		for (let i = 0; i < polygon.length; i++) {
  			// newTri := form a triangle from edge to point
  			let newTri = [polygon[i][0], polygon[i][1], point];
  			// console.log("\tadding new triangle: " + newTri);
  			// add newTri to triangulation
  			triangulation.push(newTri);
  		}
  		// console.log("\ttriangulation:["); for (zzz in triangulation) {console.log("\t\t" + triangulation[zzz]);} console.log("\t\t]");
  	}

  	// for each triangle in triangulation // done inserting points, now clean up
  	let new_triangles = [];
  	for (let i = 0; i < triangulation.length; i++) {
  		// if triangle contains a vertex from original super-triangle
  		// remove triangle from triangulation
  		if (!triangulation[i].includes(-1) && !triangulation[i].includes(-2) && !triangulation[i].includes(-3)) {
  			new_triangles.push(triangulation[i]);
  		}
  	}
  	return new_triangles;
}

function get_triangle_lines(tris) {
	var l = [];
	for (var k = 0; k < tris.length; k++) {
		for (var i = 0; i < 3; i++) {
			var a = Math.min(i, (i + 1) % 3);
			var b = Math.max(i, (i + 1) % 3);
			if (!l.includes([tris[k][a], tris[k][b]])) {
				l.push([tris[k][a], tris[k][b]]);
			}
		}
	}
	return l;
}


function remove_obj_from_arr(obj, arr) {
	let index = arr.indexOf(obj);
	if (index > -1) {
		arr.splice(index, 1);
	}
}

function point_inside_circumference_of_triangle(point, triangle, pts) {
	let a = pts[point];
	let b = pts[triangle[0]];
	let c = pts[triangle[1]];
	let d = pts[triangle[2]];
	let m = [a.x-d.x, a.y-d.y, (a.x-d.x)**2 + (a.y-d.y)**2,   // 0 1 2
         b.x-d.x, b.y-d.y, (b.x-d.x)**2 + (b.y-d.y)**2,   // 3 4 5
         c.x-d.x, c.y-d.y, (c.x-d.x)**2 + (c.y-d.y)**2];  // 6 7 8
	let det = m[0] * (m[4] * m[8] - m[5] * m[7]) -
	          m[1] * (m[3] * m[8] - m[5] * m[6]) +
          m[2] * (m[3] * m[7] - m[4] * m[6]);
	return det > 0;
}

function get_connections(tris) {
	let connections = [];
	for (let i = 0; i < tris.length; i++) {
		for (let j = 0; j < 3; j++) {
			if (connections[tris[i][j]] == undefined) {
				connections[tris[i][j]] = [];
			}
			connections[tris[i][j]].push(...tris[i]);
		}
	}
	for (let i = 0; i < connections.length; i++) {
		let new_conn = [];
		for (let j = 0; j < connections[i].length; j++) {
			if (connections[i][j] != i && !new_conn.includes(connections[i][j])) {
				new_conn.push(connections[i][j]);
			}
		}
		connections[i] = new_conn;
	}
	return connections;
}

function distance(a, b) {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function are_adjacent(triangle1, triangle2) {
	// check to see if they have two elements in common (so a total of 4)
	return [...(new Set([...triangle1, ...triangle2]))].length == 4;
}

function get_rel_pos(triangle1, triangle2) {
	let adjacent = false;
	let shared_edge_num;
	for (let i = 0; i < EDGES.length; i++) {
		if (triangle2.includes(triangle1[EDGES[i][0]]) && triangle2.includes(triangle1[EDGES[i][1]])) {
			adjacent = true;
			shared_edge_num = i;
		}
	}
	return {are_adjacent:adjacent, shared_edge_num_of_1:shared_edge_num};
}

function get_adj_triangles(tris) {
	let adj_triangles = [];
	for (let i = 0; i < tris.length; i++) {
		adj_triangles[i] = {adjacent:[], open_edge_nums: [0, 1, 2]};
		for (let j = 0; j < tris.length; j++) {
			if (i != j) {
				let rel_pos = get_rel_pos(tris[i], tris[j]);
				if (rel_pos.are_adjacent) {
					adj_triangles[i].adjacent.push(j);
					remove_obj_from_arr(rel_pos.shared_edge_num_of_1, adj_triangles[i].open_edge_nums);
				}
			}
		}
	}
	return adj_triangles;
}


function logistic(x) {
	return 2 / (1 + Math.exp(-0.005 * x)) - 1;
}



class Stars {

	constructor(canvas) {
		this.numStars = 200;
		this.radius = 3;
		this.focalLength = canvas.width;
		this.centerX, this.centerY;
		this.stars = [];
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.intervalId;
	}


	start() {

		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;

		this.stars = [];
		for (let i = 0; i < this.numStars; i++){
			this.star = [
				Math.random() * this.canvas.width,
		        Math.random() * this.canvas.height,
		        Math.random() * this.canvas.width
		    ];
			this.stars.push(this.star);
		}
		
		const t = this;
		this.canvas.addEventListener("mousemove",function(e){
			t.centerX = t.canvas.width / 2 + (t.canvas.width / 2 - e.x) / 5;
			t.centerY = t.canvas.height / 2 + (t.canvas.height / 2 - e.y) / 5;
		});


		// reset this.centerX and Y when mouse leaves
		this.canvas.addEventListener("mouseout",function(e){
			t.centerX = t.canvas.width / 2;
			t.centerY = t.canvas.height / 2;
		});


		clearInterval(this.intervalId);
		this.intervalId = setInterval(function() {
			t.update_stars();
		}, 20);

	}

	update_stars() {
		this.moveStars();
		this.drawStars();
	}

	moveStars(){
		for(let i = 0; i < this.numStars; i++) {
			let star = this.stars[i];
			star[2]--;

			if (star[2] <= 0) {
				star[2] = this.canvas.width;
			}
		}
	}

	drawStars() {
		let pixelX, pixelY, pixelRadius;
		// Resize to the screen
		if (this.canvas.width != this.canvas.clientWidth){
			this.canvas.width = this.canvas.clientWidth;
			this.start();
		}

		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "white";
		for (let i = 0; i < this.numStars; i++){
			let star = this.stars[i];

			pixelX = (star[0] - this.centerX) * (this.focalLength / star[2]);
			pixelX += this.centerX;
			pixelY = (star[1] - this.centerY) * (this.focalLength / star[2]);
			pixelY += this.centerY;
			pixelRadius = this.radius * (this.focalLength / star[2]) * this.canvas.width / 2000;

			this.ctx.beginPath();
			this.ctx.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI);
			this.ctx.fill();
		}
	}
}


class Network {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.numNodes = 75;
        this.radius = 3;
        this.speed = 0.3;
        this.border = 50;
        this.nodes;
        this.network_interval_id = null;
    }

    start() {

        this.nodes = [];
        for (let i = 0; i < this.numNodes; i++) {
            this.nodes.push({
                x: Math.random() * (this.canvas.width + 2 * this.border),
                y: Math.random() * (this.canvas.height + 2 * this.border),
                dir: Math.random() * Math.random() * Math.PI * 2
            });
        }

        const t = this;
        document.addEventListener("mousemove",function(e){
            let rect = t.canvas.getBoundingClientRect();
            let user_x = (e.clientX - rect.left) * (t.canvas.width / t.canvas.clientWidth);
            let user_y = (e.clientY - rect.top) * (t.canvas.height / t.canvas.clientHeight);
            if (user_y > 0 && user_y < t.canvas.height) {
                for (let i = 0; i < t.numNodes; i++) {
                    let d = Math.sqrt(Math.pow((t.nodes[i].x - user_x), 2) + Math.pow((t.nodes[i].y - user_y), 2));
                    t.nodes[i].x = (t.nodes[i].x + (t.nodes[i].x - user_x) * 7 / (Math.abs(t.nodes[i].x - user_x) * d) + t.border) % (t.canvas.width + t.border * 2) - t.border;
                    t.nodes[i].y = (t.nodes[i].y + (t.nodes[i].y - user_y) * 7 / (Math.abs(t.nodes[i].y - user_y) * d) + t.border) % (t.canvas.height + t.border * 2) - t.border;
                }
            }
        });

        clearInterval(this.network_interval_id);
        this.network_interval_id = setInterval(function() {
            t.update_network();
        }, 15);
    }


    update_network() {
        this.move_network();
        this.draw_network();
    }

    move_node(i, dir,  amount) {
       this.nodes[i].x = (this.nodes[i].x + Math.cos(dir) * amount + this.border + this.canvas.width + this.border * 2) % (this.canvas.width + this.border * 2) - this.border;
       this.nodes[i].y = (this.nodes[i].y + Math.sin(dir) * amount + this.border + this.canvas.height + this.border * 2) % (this.canvas.height + this.border * 2) - this.border;
    }

    move_network() {
        for (let i = 0; i < this.numNodes; i++) {
            this.move_node(i, this.nodes[i].dir, this.speed);
        }
    }

    draw_network() {
        // Resize to the screen
        if (this.canvas.width != this.canvas.clientWidth){
            this.canvas.width = this.canvas.clientWidth;
            this.start();
        }

        // draw background
        this.ctx.fillStyle = "darkblue";// "rgb(235, 235, 235)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // this.nodes and connections
        this.ctx.fillStyle = "white";// "#bfbfbf";
        this.ctx.strokeStyle = "white";// "#bfbfbf";
        for (let i = 0; i < this.numNodes; i++) {
            // draw node
            this.ctx.beginPath();
            this.ctx.arc(this.nodes[i].x, this.nodes[i].y, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            for (let j = i + 1; j < this.numNodes; j++) {
                // draw connection
                let d = Math.sqrt(Math.pow((this.nodes[i].x - this.nodes[j].x), 2) + Math.pow((this.nodes[i].y - this.nodes[j].y), 2));
                if (d < this.canvas.width / (4 * Math.sqrt(this.canvas.width / 100)) && d > this.radius) {
                    this.ctx.lineWidth = Math.min(25 / Math.pow(d, 1), 10);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }

    }
}


class Eyes {
    constructor(canvas) {
        this.numEyes = 50;
        this.eye_border = 20;
        this.eyes;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.updateId;
    }

    blink_eye(eye) {
    	clearInterval(eye.blinkID);
    	let theta = 0;
    	eye.blinkID = setInterval(function() {
    		if (theta <= Math.PI) {
    			eye.closed = Math.sin(theta);
    			theta += Math.PI/80;
    		} else {
    			clearInterval(eye.blinkID);
    			eye.closed = 0;
    		}
    	}, 1);
    }

    get_connections(tris) {
    	let connections = [];
    	for (let i = 0; i < tris.length; i++) {
    		for (let j = 0; j < 3; j++) {
    			if (connections[tris[i][j]] == undefined) {
    				connections[tris[i][j]] = [];
    			}
    			connections[tris[i][j]].push(...tris[i]);
    		}
    	}
    	for (let i = 0; i < connections.length; i++) {
    		let new_conn = [];
    		for (let j = 0; j < connections[i].length; j++) {
    			if (connections[i][j] != i && !new_conn.includes(connections[i][j])) {
    				new_conn.push(connections[i][j]);
    			}
    		}
    		connections[i] = new_conn;
    	}
    	return connections;
    }


    start() {
    	this.eyes = [];
    	for (let i = 0; i < this.numEyes; i++) {
    		this.eyes.push({
    			x: Math.random() * (this.canvas.width + 2 * this.eye_border),
    			y: Math.random() * (this.canvas.height + 2 * this.eye_border),
    			dir: Math.random() * Math.random() * Math.PI * 2,
    			dist: 1,
    			closed: 0,
    		});
    	}
    	this.eyes[-1] = {x: -this.canvas.width, y: this.canvas.width * 2};
    	this.eyes[-2] = {x: this.canvas.width * 2, y: this.canvas.width * 2};
    	this.eyes[-3] = {x: this.canvas.width / 2, y: -this.canvas.width};

    	let tris = get_triangulation(this.eyes);
    	let tri_conns = get_connections(tris);


    	for (let i = 0; i < this.numEyes; i++) {
    		let min_radius = this.canvas.width;
    		for (let j = 0; j < tri_conns[i].length; j++) {
    			let radius = distance(this.eyes[i], this.eyes[tri_conns[i][j]]) / 2.5;
    			if (radius < min_radius) {
    				min_radius = radius;
    			}
    		}
    		this.eyes[i].radius = min_radius;
    	}

        const t = this;

    	document.addEventListener("mousemove",function(e){
    		let rect = t.canvas.getBoundingClientRect();
    		let user_x = (e.clientX - rect.left) * (t.canvas.width / t.canvas.clientWidth);
    		let user_y = (e.clientY - rect.top) * (t.canvas.height / t.canvas.clientHeight);
    		for (let i = 0; i < t.numEyes; i++) {
    			let slope = (t.eyes[i].y - user_y)/(user_x - t.eyes[i].x);
    			t.eyes[i].dir = Math.atan(slope) + (user_x < t.eyes[i].x ? Math.PI : 0);
    			t.eyes[i].dist = distance(t.eyes[i], {x:user_x, y:user_y});
    		}
    	});

    	document.addEventListener("click",function(e){
    		let rect = t.canvas.getBoundingClientRect();
    		let user_x = (e.clientX - rect.left) * (t.canvas.width / t.canvas.clientWidth);
    		let user_y = (e.clientY - rect.top) * (t.canvas.height / t.canvas.clientHeight);
    		if (user_y > 0 && user_y < t.canvas.height) {
    			for (let i = 0; i < t.numEyes; i++) {
    				t.blink_eye(t.eyes[i]);
    			}
    		}
    	});


        clearInterval(this.updateId);
        this.updateId = setInterval(function() {
            t.update_eyes();
        }, 15);

    }



    update_eyes() {

    	// Resize to the screen
    	if (this.canvas.width != this.canvas.clientWidth) {
    		this.canvas.width = this.canvas.clientWidth;
    		this.start();
    	}

    	// random blinks
    	if (Math.random() < 0.025) {
    		this.blink_eye(this.eyes[Math.floor(Math.random() * this.numEyes)]);
    	}

    	this.ctx.fillStyle = "#660066";
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    	this.ctx.strokeStyle = "black";
    	for (let i = 0; i < this.numEyes; i++) {
    		// white part
    		this.ctx.fillStyle = "#f0f4ff";
    		this.ctx.strokeStyle = "#330033";
    		this.ctx.lineWidth = 5;
    		this.ctx.beginPath();
    		this.ctx.arc(this.eyes[i].x, this.eyes[i].y, this.eyes[i].radius, 0 , Math.PI * 2);
    		this.ctx.stroke();
    		this.ctx.fill();

    		// pupil
    		this.ctx.fillStyle = "black";
    		this.ctx.beginPath();
    		this.ctx.arc(this.eyes[i].x + (logistic(this.eyes[i].dist) * this.eyes[i].radius / 3) * Math.cos(this.eyes[i].dir),
    		        this.eyes[i].y - (logistic(this.eyes[i].dist) * this.eyes[i].radius / 3) * Math.sin(this.eyes[i].dir),
    		        this.eyes[i].radius / 3, 0 , Math.PI * 2);
    		this.ctx.fill();

    		// lid
    		if (this.eyes[i].closed != 0) {
    			this.ctx.fillStyle = "#330033";
    			this.ctx.strokeStyle = "#330033";
    			this.ctx.beginPath();
    			let angle = Math.asin(1 - this.eyes[i].closed * 2);
    			this.ctx.arc(this.eyes[i].x, this.eyes[i].y, this.eyes[i].radius, Math.PI + angle, Math.PI * 2 - angle);
    			this.ctx.fill();
    			this.ctx.stroke();
    		}

    	}

    }
}







class Delaunay {

	constructor(canvas) {
		this.TRIANGLES = 0;
		this.BOTH = 1;
		this.VORONOI = 2;

		this.numPoints = 75;
		this.del_radius = 3;
		this.del_speed = 0.3;
		this.del_border = 150;
		this.points;
		this.triangles = [];
		this.del_mode;

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.updateId = null;
	}


	start() {
		this.points = [];
		for (let i = 0; i < this.numPoints; i++) {
			this.points.push({
				x: Math.random() * (this.canvas.width + 2 * this.del_border),
				y: Math.random() * (this.canvas.height + 2 * this.del_border),
				dir: Math.random() * Math.random() * Math.PI * 2
			});
		}
		this.points[-1] = {x: -this.canvas.width, y: this.canvas.width * 2};
		this.points[-2] = {x: this.canvas.width * 2, y: this.canvas.width * 2};
		this.points[-3] = {x: this.canvas.width / 2, y: -this.canvas.width};

		this.del_mode = this.TRIANGLES;

		const t = this;
		this.canvas.addEventListener("click",function(e){
			let rect = t.canvas.getBoundingClientRect();
			let user_x = (e.clientX - rect.left) * (t.canvas.width / t.canvas.clientWidth);
			let user_y = (e.clientY - rect.top) * (t.canvas.height / t.canvas.clientHeight);
			if (user_y > 0 && user_y < t.canvas.height) {
				t.del_mode = (t.del_mode + 1) % 3;
			}
		});

		clearInterval(this.updateId);
		this.updateId = setInterval(function() {
			t.update_delaunay();
		}, 15);

	}



	update_delaunay() {
		this.move_delaunay();
		this.draw_delaunay();
	}

	move_point(i, dir, amount) {
		this.points[i].x = (this.points[i].x + Math.cos(dir) * amount + this.del_border + this.canvas.width + this.del_border * 2) % (this.canvas.width + this.del_border * 2) - this.del_border;
		this.points[i].y = (this.points[i].y + Math.sin(dir) * amount + this.del_border + this.canvas.height + this.del_border * 2) % (this.canvas.height + this.del_border * 2) - this.del_border;
	}

	move_delaunay() {
		for (let i = 0; i < this.numPoints; i++) {
			this.move_point(i,this. points[i].dir, this.del_speed);
		}

		this.triangles = get_triangulation(this.points);
	}

	midpoint_of(i, j) {
		let a = this.points[i];
		let b = this.points[j];
		return {x: (a.x+b.x)/2, y: (a.y+b.y)/2};
	}

	

	get_voronoi(tris) {

		let adj_triangles = get_adj_triangles(tris);

		let circumcenters = [];
		for (let i = 0; i < tris.length; i++) {
			circumcenters.push(this.get_circumcenter(tris[i]));
		}

		let l = [];
		for (let i = 0; i < tris.length; i++) {
			let cc1 = circumcenters[i];
			for (let j = 0; j < adj_triangles[i].adjacent.length; j++) {
				let cc2 = circumcenters[adj_triangles[i].adjacent[j]];
				l.push([cc1, cc2]);
			}
			for (let j = 0; j < adj_triangles[i].open_edge_nums.length; j++) {
				// a point is at "infinity"
				let open_edge = EDGES[adj_triangles[i].open_edge_nums[j]];
				let mid = this.midpoint_of(tris[i][open_edge[0]], tris[i][open_edge[1]]);
				let xdir = cc1.x > this.canvas.width / 2 ? 1 : -1;
				let ydir = cc1.y > this.canvas.height / 2 ? 1 : -1;
				let new_point = {
					x: 100 * xdir * Math.abs(cc1.x - mid.x) + cc1.x,
				    y: 100 * ydir * Math.abs(cc1.y - mid.y) + cc1.y
				};
				l.push([cc1, new_point]);
			}
		}
		let n_l = [];
		let corner = {x:this.canvas.width + 2 * this.del_border, y:this.canvas.height + 2 * this.del_border};
		let mx = distance({x:0,y:0}, corner);
		for (let i = 0; i < l.length; i++) {
			if (distance(l[i][0], l[i][1]) < mx) {
				n_l.push(l[i]);
			}
		}

		return {circumcenters:circumcenters, lines:n_l};
	}

	get_circumcenter(triangle) {
		let a = this.points[triangle[0]];
		let b = this.points[triangle[1]];
		let c = this.points[triangle[2]];

		let ab = distance(a,b);
		let bc = distance(b,c);
		let ca = distance(c,a);

		let A = Math.acos((-(bc**2) + ca**2 + ab**2)/(2 * ca * ab));
		let B = Math.acos((-(ca**2) + bc**2 + ab**2)/(2 * bc * ab));
		let C = Math.acos((-(ab**2) + ca**2 + bc**2)/(2 * bc * ca));

		let den = Math.sin(2 * A) + Math.sin(2 * B) + Math.sin(2 * C);

		let x = (a.x * Math.sin(2 * A) + b.x * Math.sin(2 * B) + c.x * Math.sin(2 * C)) / den;
		let y = (a.y * Math.sin(2 * A) + b.y * Math.sin(2 * B) + c.y * Math.sin(2 * C)) / den;

		return {x:x, y:y};
	}


	draw_delaunay() {
		// Resize to the screen
		if (this.canvas.width != this.canvas.clientWidth) {
			this.canvas.width = this.canvas.clientWidth;
			this.start();
		}

		// draw background
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


		if (this.del_mode == this.TRIANGLES || this.del_mode == this.BOTH) {
			// points
			this.ctx.fillStyle = "white";// "#bfbfbf";
			for (let i = 0; i < this.numPoints; i++) {
				// draw node
				this.ctx.beginPath();
				this.ctx.arc(this.points[i].x, this.points[i].y, this.del_radius, 0, 2 * Math.PI);
				this.ctx.fill();
				// ctx.font = "14px Arial";
				// ctx.fillText(i, points[i].x, points[i].y);
			}

			// triangles
			let lines = get_triangle_lines(this.triangles);
			this.ctx.strokeStyle = "white";
			this.ctx.lineWidth = .25;
			for (let i = 0; i < lines.length; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.points[lines[i][0]].x, this.points[lines[i][0]].y);
				this.ctx.lineTo(this.points[lines[i][1]].x, this.points[lines[i][1]].y);
				this.ctx.stroke();
			}
		}
		if (this.del_mode == this.VORONOI || this.del_mode == this.BOTH) {
			this.ctx.fillStyle = "black";
			let voronio = this.get_voronoi(this.triangles);
			for (let i = 0; i < voronio.circumcenters.length; i++) {
				this.ctx.beginPath();
				this.ctx.arc(voronio.circumcenters[i].x, voronio.circumcenters[i].y, this.del_radius, 0, 2 * Math.PI);
				this.ctx.fill();
				// ctx.font = "20px Arial";
				// ctx.fillText(i, voronio.circumcenters[i].x, voronio.circumcenters[i].y);
			}
			this.ctx.strokeStyle = "black";
			this.ctx.lineWidth = .25;
			for (let i = 0; i < voronio.lines.length; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(voronio.lines[i][0].x, voronio.lines[i][0].y);
				this.ctx.lineTo(voronio.lines[i][1].x, voronio.lines[i][1].y);
				this.ctx.stroke();
			}

		}


	}
}









