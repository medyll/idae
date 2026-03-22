'use strict';
const parseArgs = require('minimist');

const argv = parseArgs(process.argv);
const _port = argv.p || 3005;

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

const tables = ['agent']; //'cron','agent', 'cron', 'leaser', 'contrat'
const rolesList = ['ROLE_ADMIN']; // , "ROLE_USER", "ROLE_DEV", "ROLE_TECH"
const fakeFields = ['nom', 'code', 'prenom', 'email', 'telephone', 'address'];
const methods = ['post', 'patch', 'put', 'delete'];

periodicallyPostFakeData();

function periodicallyPostFakeData() {
	const delay = getRandomInt(30) * 1000;
	postFakeData();

	console.log('next in ' + delay);

	setTimeout(() => {
		periodicallyPostFakeData();
	}, delay);
}

function postFakeData() {
	const tableIndex = getRandomInt(tables.length);

	const roles = [];
	const rolesNumber = getRandomInt(5);

	for (let i = 0; i <= rolesNumber; i++) {
		let rolesIndex = getRandomInt(rolesList.length);
		roles.push(rolesList[rolesIndex]);
	}

	const entity = tables[tableIndex];
	const data = {};
	const fakeFieldsNumber = getRandomInt(fakeFields.length);

	data.id = getRandomInt(100);
	data['id' + tables[tableIndex]] = data.id;
	for (let i = 0; i <= fakeFieldsNumber; i++) {
		let fakeFieldsIndex = getRandomInt(fakeFields.length);
		let fakeFieldName = fakeFields[fakeFieldsIndex];
		data[fakeFieldName + entity.charAt(0).toUpperCase() + entity.slice(1)] = 'test field ' + i;
	}

	const methodsIndex = getRandomInt(methods.length);

	const jsonBody = {
		fromHost: 'here.com',
		entity: entity,
		roles: roles,
		data: data,
		method: methods[methodsIndex]
	};

	fetch(`http://localhost:${_port}/dispatch`, {
		method: 'POST',
		headers: { 'content-type': 'text/json' },
		body: JSON.stringify(jsonBody)
	})
		.then(() => console.log('post ok'))
		.catch((err) => console.error('err test post', err));
}
