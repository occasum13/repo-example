const faker = require('faker-br')

export function fakerName () {
	return `${faker.name.firstName() + ' ' + faker.name.lastName()}`
}

export function fakerEmail () {
	return `${faker.internet.email().toLowerCase()}`
}

export function fakerPhone (option) {
	if (!option){
		return `${faker.phone.phoneNumber('1199#######')}`
	} else {
		const options = [
			{ name: 'inexistent', values: ['00','01', '02'] },
			{ name: 'special', values: ['!@', '#$', '$%'] },
			{ name: 'letter', values: ['ab', 'cd', 'ef'] },
			{ name: 'validBrDDD', values: [11, 41, 51] },
		]
		const optionResult = options.find(({ name }) => name === option)
	
		var random = optionResult.values[(faker.random.number({
			'min': 0,
			'max': 2
		}))]

		return `${faker.phone.phoneNumber(`${random}99#######`)}`
	} 
}

export function fakerText () {
	return `${faker.lorem.paragraph()}`
}

export function fakerUuid () {
	return `${faker.random.uuid()}`
}

export function fakerExternalId () {
	return `${(faker.random.alpha(4))}`
}