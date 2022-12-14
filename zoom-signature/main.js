const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const needle = require('needle');

// Handler
exports.handler = async function(event, context) {
	let SDK_KEY, SDK_SECRET, meet_number, role_id;
	SDK_KEY = event["sdk_key"];
	SDK_SECRET = event["sdk_secret"];
	meet_number = event["meet_number"];
	role_id = event["role_id"];

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