const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const needle = require('needle');

// Handler
exports.handler = async function(event, context) {
  const options = {
		headers: {
			"content-type": 'application/json'
		}
	};

	try {
		options["headers"]["Authorization"] = event["Authorization"];
		let method = event["method"];
		let targetUrl = "https://api.zoom.us/v2/users/" + event["endPoint"];

		delete event["endPoint"];
		delete event["Authorization"];
		delete event["method"];
		
		if (!targetUrl || !method || !options["headers"]["Authorization"]) {
			return "Error of request";
		}
		
		needle(method, targetUrl, event, options)
			.then((target_response) => {
				console.log(`Status: ${target_response.statusCode}`);
				console.log('Body: ', target_response.body);
				response.statusText = JSON.stringify(target_response.body);
				return JSON.stringify(target_response.body);
			}).catch((err) => {
				return JSON.stringify(err);
		});
	}
	catch (err) {
		return JSON.stringify(err);
	}
}

