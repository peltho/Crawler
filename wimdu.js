// On charge la configuration
var config = require("config.json");

// Ici j'ai paramétré CasperJS pour qu'il soit verbeux
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});

// On accède au site et on s'y connecte
casper.start('https://www.wimdu.fr/users/login', function() {
	// On récupère le token d'authentification
	token = this.getFormValues('form#new_user').authenticity_token;
	// On remplit le formulaire et on le soumet
	this.fill('form[action="/users/login"]', {
		'user[email]'		: config.credentials.login,
		'user[password]'	: config.credentials.password,
		'commit'			: 'S\'identifier',
		'authenticity_token': token
	}, true);
});

// On attend la redirection suite à la connexion
casper.waitForSelector('div.nbar__user-image', function() {

	// On modifie la partie "pricing", càd "Tarifs et conditions"
	this.open('https://www.wimdu.fr/user/offers/'+config.credentials.offer+'/pricing').then(function() {
		// On met à jour l'offre
		this.fill('form#form-edit-listing', {
            "offer[nightly_rate_amount]" : config.offer.night,
            "offer[weekly_rate_amount]"  : config.offer.week,
            "offer[min_nights]"          : config.offer.min
		}, true);
	});
});

// On capture l'écran afin d'avoir une preuve
casper.then(function() {
    this.capture('wimdu.png', {
        top: 0,
        left: 0,
        width: 1500,
        height: 1400
    });
});

// On lance l'exécution du scénario
casper.run();
