const AWSXRay	= require('aws-xray-sdk-core')
const AWS		= AWSXRay.captureAWS(require('aws-sdk'))
const needle	= require('needle');
const KJUR		= require('jsrsasign');

// app credentials for sdk meetings zoom app.
const client_id = process.env.CLIENT_ID;
const secret_id = process.env.CLIENT_SECRET;

// Handler
exports.handler = async function(event, context) {
	let meet_number, role_id, iat, exp;
	if (!event["body"]) {
		return "Invalid body";
	}

	let data;
	try {
		data = JSON.parse(event["body"]);
	}
	catch (err) {
		return "Invalid body";
	}
	meet_number	= data["meet_number"];
	role_id		= data["role_id"];
	iat			= data["iat"];
	exp			= data["exp"];

	if (client_id && secret_id && meet_number && role_id != undefined && iat != undefined && exp != undefined) {
		return generateSignature(client_id, secret_id, meet_number, role_id, iat, exp);
	}
	else
		return "Failed! Check your posted data.";
}

function generateSignature(sdkKey, sdkSecret, meetingNumber, role, iat, exp) {

	const oHeader	= { alg: 'HS256', typ: 'JWT' }
  
	const oPayload = {
	  sdkKey:	sdkKey,
	  mn:		meetingNumber,
	  role:		role,
	  iat:		iat,
	  exp:		exp
	}

	console.log(`iat: ${iat}`);
	console.log(`exp: ${exp}`);
	console.log(`skdKey: ${sdkKey}`);
	console.log(`skdSecret: ${sdkSecret}`);
	console.log(`meetingNumber: ${meetingNumber}`);
	console.log(`role: ${role}`);

  
	const sHeader = JSON.stringify(oHeader);
	const sPayload = JSON.stringify(oPayload);
	console.log(`sHeader: ${sHeader}`);
	console.log(`sPayload: ${sPayload}`);

	const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
	return sdkJWT
}