const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const needle = require('needle');
const KJUR = require('jsrsasign');

// Handler
exports.handler = async function(event, context) {
	let SDK_KEY, SDK_SECRET, meet_number, role_id;
	if (!event["Records"][event["Records"].length - 1]["cf"]["request"]["body"]) {
		return "Invalid body";
	}

	let data;
	try {
		data = JSON.parse(event["Records"][event["Records"].length - 1]["cf"]["request"]["body"]);
	}
	catch (err) {
		return "Invalid body";
	}
	SDK_KEY = data["sdk_key"];
	SDK_SECRET = data["sdk_secret"];
	meet_number = data["meet_number"];
	role_id = data["role_id"];

	if (SDK_KEY && SDK_SECRET && meet_number && role_id != undefined) {
		return generateSignature(SDK_KEY, SDK_SECRET, meet_number, role_id);
	}
	else
		return "Failed! Check your posted data.";
}

function generateSignature(sdkKey, sdkSecret, meetingNumber, role) {

	const iat = Math.round(new Date().getTime() / 1000) - 30;
  	const exp = iat + 60 * 60 * 2;
	const oHeader = { alg: 'HS256', typ: 'JWT' }
  
	const oPayload = {
	  sdkKey: sdkKey,
	  mn: meetingNumber,
	  role: role,
	  iat: iat,
	  exp: exp,
	}
  
	const sHeader = JSON.stringify(oHeader)
	const sPayload = JSON.stringify(oPayload)
	const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret)
	return sdkJWT
}