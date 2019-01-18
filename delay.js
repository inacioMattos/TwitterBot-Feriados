var proxFeriados = [
	{
		"nome": "none",
		"dia": -1,
		"mes": -1
	},
	{
		"nome": "none2",
		"dia": -1,
		"mes": -1
	}
]


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('templates.json', 'utf8'));
//console.log(obj[2].frases[1]);
console.log(fazerFrase(obj, 1));



function fazerFrase(templates, dias)
{
	e = -1;

	for (var i = 0; i < templates.length; i++)
		if (templates[i].tempo >= dias && e == -1) e = i;

	var r = randomRange(0, templates[e].emojis.length);
	console.log(r);
	emoji = templates[e].emojis[r];
	frase = templates[e].frases[randomRange(0, templates[e].frases.length)];

	console.log("emoji: " + emoji + "\nfrase: " + frase);


	frase = frase.replace("$DIAS$", dias);
	frase = frase.replace("$EMOJI$", emoji);

	return frase;
}

function randomRange(min, max) {
	max--;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}