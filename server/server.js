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
	const { channel } = request.query;
	channels.push({
		channel,
		response,
	});

	const headers = {
		"Content-Type": "text/event-stream",
		Connection: "keep-alive",
		"Cache-Control": "no-cache",
	};

	response.writeHead(200, headers);

	sub.subscribe(channel, (err, count) => {
		console.log(`Subscribed to ${channel} channel.`);
		if (err) {
			throw new Error(err);
		}
	});

	sub.on("message", (subChannel, message) => {
		if (subChannel === channel) {
			console.log(`${subChannel} : ${message}`);
			response.write(`data: ${message}\n\n`);
		}
	});

	request.on("close", () => {
		console.log(`${channel} Connection closed`);
		sub.unsubscribe(channel);
	});
}

app.get("/notifications", eventsHandler);

async function pushMessage(request, respsonse) {
	const newMessage = request.body;
	const { channel } = request.query;
	publisher(channel, newMessage);
	respsonse.json(newMessage);
}

app.post("/pushMessage", pushMessage);

app.get("/status", (request, response) =>
	response.json({ channels: channels.length })
);

const PORT = 3001;

let channels = [];

app.listen(PORT, () => {
	console.log(`Messages Events service listening at http://localhost:${PORT}`);
});