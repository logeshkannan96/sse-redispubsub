const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { publisher } = require("./redis");
const Redis = require("ioredis");
const sub = new Redis();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function eventsHandler(request, response) {
	const headers = {
		"Content-Type": "text/event-stream",
		Connection: "keep-alive",
		"Cache-Control": "no-cache",
	};
	
	response.writeHead(200, headers);

	const clientId = Date.now();

	const newClient = {
		id: clientId,
		response,
	};

	clients.push(newClient);
	if (!subscriptionInitialized) {

		sub.subscribe("liveupdates", (err, count) => {
			if (err) {
				throw new Error(err);
			}
		});

		sub.on("message", (channel, message) => {
			clients.forEach((client) => client.response.write(`data: ${message}\n\n`));
		});

		subscriptionInitialized = true;
	}

	request.on("close", () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter((client) => client.id !== clientId);
	});
}

app.get("/notifications", eventsHandler);

async function pushMessage(request, respsonse) {
	const newMessage = request.body;
	publisher("liveupdates", newMessage);
	respsonse.json(newMessage);
}

app.post("/pushMessage", pushMessage);

app.get("/status", (request, response) =>
	response.json({ clients: clients.length })
);

const PORT = 3001;

let clients = [];
let subscriptionInitialized = false;

app.listen(PORT, () => {
	console.log(`Messages Events service listening at http://localhost:${PORT}`);
});