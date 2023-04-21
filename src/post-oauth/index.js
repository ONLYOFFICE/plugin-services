const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const needle = require('needle');

// app credentials for OAuth zoom app.
const client_id = process.env.CLIENT_ID;
const secret_id = process.env.CLIENT_SECRET;

// Handler
exports.handler = async function(event, context) {
    if (!event["body"]) {
		return "Invalid body";
	}
	
	function getPromise(event) {
		return new Promise(function(resolve) {
			try {
				let oParsedData	= JSON.parse(event["body"]);
				let method		= "POST";
				let targetUrl	= "https://zoom.us/oauth/token";
				let data		= {
					"code": oParsedData["code"],
					"grant_type": "authorization_code",
					"redirect_uri": oParsedData["redirect_uri"]
				};
				let options = {
					headers: {
						"Host": "zoom.us",
						"Authorization": 'Basic ' + Buffer.from(`${client_id}:${secret_id}`).toString('base64'),
						"Content-Type": "application/x-www-form-urlencoded"
					}
				};
				
				if (!targetUrl || !method || !options["headers"]["Authorization"] || !data["code"]) {
					resolve("Error of request");
				}
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