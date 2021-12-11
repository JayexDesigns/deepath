const SOCKET_PORT = 6644;

let width = innerWidth,
	height = innerHeight;
    lineWidth = 2.5;
    nodeRadius = 7;
    textSpearation = 12;
    distance = 100;

let svg = d3
	.select("svg")
	.attr("width", width)
	.attr("height", height);

let force = d3.layout
	.force()
	.gravity(0.05)
	.distance(distance)
	.charge(-100)
	.size([width, height]);

const createGraph = (data) => {
    svg.html("");

	force.nodes(data.nodes).links(data.links).start();

	let link = svg
		.selectAll(".link")
		.data(data.links)
		.enter()
		.append("line")
		.attr("class", "link")
		.style("stroke-width", lineWidth);

	let node = svg
		.selectAll(".node")
		.data(data.nodes)
		.enter()
		.append("g")
		.attr("class", "node")
		.call(force.drag);

	node.append("circle").attr("r", nodeRadius);

	node.append("text")
		.attr("dx", textSpearation)
		.attr("dy", ".35em")
		.text(function (d) {
			return d.name;
		});

	force.on("tick", function () {
		link.attr("x1", function (d) {
			return d.source.x;
		})
			.attr("y1", function (d) {
				return d.source.y;
			})
			.attr("x2", function (d) {
				return d.target.x;
			})
			.attr("y2", function (d) {
				return d.target.y;
			});

		node.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	});
};



let data = {
    "nodes": [],
    "links": []
}
createGraph(data);



const indexOfCallback = (array, callback) => {
    for (let i = 0; i < array.length; ++i) {
        if (callback(array[i])) return i;
    }
    return -1;
};



const ws = new WebSocket(`ws://${location.host}:${SOCKET_PORT}`);

ws.onopen = () => {
    ws.send(JSON.stringify({type: "ListenUsers"}));
}

ws.onmessage = (event) => {
    let message = JSON.parse(event.data);
    if (message.type === "Users") {
        data = {
            "nodes": [],
            "links": []
        }
        for (let i = 0; i < message.users.length; ++i) {
            data["nodes"].push({"name": message.users[i]["username"]});
            for (let j = 0; j < message.users[i].friends.length; ++j) {
                let target = indexOfCallback(message.users, elem => elem["username"] === message.users[i].friends[j]);
                if (target != -1) data["links"].push({"source": i, "target": target});
            }
        }
        createGraph(data);
    }
}