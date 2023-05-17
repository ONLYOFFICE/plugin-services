const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const needle = require('needle');

// Handler
exports.handler = async function(event, context) {
    if (!event["body"]) {
		return "Invalid body";
	}
	let aURLs = process.env.WHITELIST.split(',');

	console.log("String URLS:" + process.env.WHITELIST);
	console.log("URLS array:");
	console.log(aURLs);

	function getPromise(event) {
		return new Promise(function(resolve) {
			try {
				let oParsedData = JSON.parse(event["body"]);

				let method		= oParsedData["method"] || "GET";
				let targetUrl	= oParsedData["target"];
				let data		= oParsedData["data"] || {};
				let options		= {
					"headers": oParsedData["headers"] || {}
				}
				
				if (!targetUrl) {
					resolve("Have not target URL");
				}
				console.log('Target URL: ' + targetUrl);
				if (!aURLs.find(function(url) {
					console.log('White Url:' + url.trim());
					
					return targetUrl.startsWith(url.trim());
				})) {
					resolve("Target URL isn't allowed")
				};

				needle(method, targetUrl, data, options)
					.then((target_response) => {
						console.log(`Status: ${target_response.statusCode}`);
						console.log('Body: ', target_response.body);
						resolve(JSON.stringify(target_response.body));
					}).catch((err) => {
						console.log(err);
						resolve(err.message);
				});
			}
			catch (err) {
				console.log(err);
				resolve(err.message);
			}
		});
	}
	
	let result = await getPromise(event);
	return result;
}