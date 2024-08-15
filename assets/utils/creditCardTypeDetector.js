export function creditCardTypeDetector(string){
	/* Sournce: https://www.regular-expressions.info/creditcard.html */
	// const visa = /^4[0-9]{12}(?:[0-9]{3})?$/
	// const mastercard = /^5[1-5][0-9]{14}$/
	// const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/
	// const amex = /^3[47][0-9]{13}$/
	const visa = /^4[0-9]/
	const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/
	const amex = /^3[47][0-9]/

	if ( visa.test(string) ) {
		return {
			brand : "Visa", 
			code : 1,
			symbol : "v"
		}
	}
	if ( mastercard.test(string) ) {
		return {
			brand : "Mastercard", 
			code : 3,
			symbol : "mc"
		}
	}
	if ( amex.test(string) ) {
		return {
			brand : "American Express", 
			code : 2,
			symbol : "axp"
		}
	}

	return {
		brand : null, 
		code : null,
		symbol : null
	}
}

export function getCardTypeName(cardType) {
	switch(cardType) {
		case 1:
			return 'visa'
		case 3:
			return 'mastercard'
		case 2:
			return 'amex'
		default:
			return null
	}
}