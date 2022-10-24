const { exec } = require("child_process");
const { join } = require("path");

class CMDLinux {

	static hardwareserial () {

		return new Promise((resolve, reject) => {

			exec("dmidecode -t system | grep \"Serial Number\"", (err, stdout, stderr) => {

				if (err) {
					reject(stderr && stderr.message ? stderr.message : stderr);
				}
				else if (!stdout || "" === stdout.trim()) {

					reject(new CodedError(
						"There is no serialnumber", "NO_SERIAL",
						CodedError.file(), CodedError.line()
					));

				}
				else {
					resolve(stdout);
				}

			});

		// remove empty lines
		}).then((stdout) => {

			return Promise.resolve(stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n").map((line) => {
				return line.trim();
			}).filter((line) => {
				return "" !== line;
			}));

		// get last line
		}).then((stdoutLines) => {

			let result = "";
			stdoutLines.forEach((line) => {

				const _line = line.split(":");

				if (1 < _line.length) {
					result = _line[1];
				}

			});

			return Promise.resolve(result);

		})

	}



	static infos () {

		return new Promise((resolve, reject) => {

			exec("dmidecode -t system | egrep \"Manufacturer|Product Name|Serial Number\"", (err, stdout, stderr) => {
				if (err) {
					reject(stderr && stderr.message ? stderr.message : stderr);
				}
				else if (!stdout || "" === stdout) {
					reject(new CodedError("There is no informations"));
				}
				else {

					const result = {};
					stdout.replace(/\t/g, "").replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n").forEach((line) => {
						if ("" !== line.trim()) {

							const _line = line.split(":");

							if (1 < _line.length) {

								switch (_line[0]) {

									case "Manufacturer":
										result.vendor = _line[1];
									break;
									case "Product Name":
										result.name = _line[1];
									break;
									case "Serial Number":
										result.hardwareserial = _line[1];
									break;
									default:
										// nothing to do here
									break;

								}

							}

						}

					});

					resolve(result);

				}

			});

		})

	}

}



module.exports = CMDLinux
