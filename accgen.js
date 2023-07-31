const Adb = require("@devicefarmer/adbkit");
const mineflayer = require("mineflayer");
const client = Adb.Adb.createClient();
const fs = require("fs");

const options = {
	host: "craftplay.pl",
	version: "1.18.2",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const alphabet =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const gen_name = () => {
	var result = "";
	for (var i = 0; i < 16; ++i) {
		result += alphabet[Math.floor(alphabet.length * Math.random())];
	}
	return result;
};

const change_ip = async (device) => {
	device.shell("cmd connectivity airplane-mode enable");
	console.log("Airplane mode on")

	await sleep(5000);
	device.shell("cmd connectivity airplane-mode disable");
	device.shell("svc data enable");
	console.log("Airplace mode off")

	await sleep(10000);
};

const register = async (username) => {
	return new Promise((r) => {
		console.log("Joining as " + username);
		options["username"] = username;
		bot = mineflayer.createBot(options);

		bot.on("spawn", async () => {
			bot.chat("/register Sunderw_3k Sunderw_3k");
			bot.quit();
			r()
		});
	});
};

client
	.listDevices()
	.then(async (devices) => {
		const device = client.getDevice(devices[0].id);

		while (true) {
			await change_ip(device);

			for (let i = 0; i < 4; i++) {
				const name = gen_name();
				await register(name);
				console.log("Registered " + name);
				fs.appendFileSync("accs.txt", `${name}\n`)
			}
		}
	})
	.then(() => {
		console.log("Done.");
	})
	.catch((err) => {
		console.error("Something went wrong:", err.stack);
	});
