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
    if (!event["body"]) {
		return "Invalid body";
	}
	
	function getPromise(event) {
		return new Promise(function(resolve) {
			try {
				let data = JSON.parse(event["body"]);
				console.log('Parsing data success!');
		
				options["headers"]["Authorization"] = data["Authorization"];
				let method = data["method"];
				let targetUrl = "https://api.zoom.us/v2/users/" + data["endPoint"];
		
				delete data["endPoint"];
				delete data["Authorization"];
				delete data["method"];
				
				if (!targetUrl || !method || !options["headers"]["Authorization"]) {
					console.log("Error of request, check data!");
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