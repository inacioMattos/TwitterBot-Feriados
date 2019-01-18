console.log("o bot está começando!");
request = require("request");
var DateDiff = require('date-diff');
var fs = require('fs');
var Twit = require('twit')
var T = new Twit({
  consumer_key:         'jBqxguzmeaLiRLPGmsWjyCwVV',
  consumer_secret:      '3MsfiqHKqD9GksleTz5bboefxuRoClJ3SlTGKXGVDt358CuFHT',
  access_token:         '3185598995-IkhPSXC8cDExNySvOrwDZuiXtmSUyh8ccOlCrOX',
  access_token_secret:  'dedVCSD8GDn2xoz7JMCUNGtmF1CoU5oxqXD391VCuD5x4',
});

ano = "2018";
ibge = "4303509";
token = "aW5hY2lvdG1AaG90bWFpbC5jb20maGFzaD05NjY5Mjc3Mw";
var feriados = JSON.parse("{\"text\": \"oi\"}");
var lastFrase = "";
var error = true;
var proxFeriados = [
	{
		"nome": "none",
		"dia": -1,
		"mes": -1,
		"codigo": -1,
		"desc": "none",
		"tipo": "none",
		"diaSemana": "none",
		"countdown": -1
	},
	{
		"nome": "none",
		"dia": -1,
		"mes": -1,
		"codigo": -1,
		"desc": "none",
		"tipo": "none",
		"diaSemana": "none",
		"countdown": -1
	},
	{
		"nome": "none",
		"dia": -1,
		"mes": -1,
		"codigo": -1,
		"desc": "none",
		"tipo": "none",
		"diaSemana": "none",
		"countdown": -1
	},
	{
		"nome": "none",
		"dia": -1,
		"mes": -1,
		"codigo": -1,
		"desc": "none",
		"tipo": "none",
		"diaSemana": "none",
		"countdown": -1
	},
	{
		"nome": "none",
		"dia": -1,
		"mes": -1,
		"codigo": -1,
		"desc": "none",
		"tipo": "none",
		"diaSemana": "none",
		"countdown": -1
	}
]

var diasSemana = ["Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira",
				  "Sexta-feira", "Sabado"];

var timeDiff = 3;
var hour = 11;
var minute = 25;
var seconds = 32;

var go = true;


setInterval(main, 1000*31);


function main()
{
	var obj = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
	settings(obj);
	console.log(new Date().getHours() + "/" + new Date().getMinutes());
	console.log(hour + "/" + minute + "\\" + go);
	if (new Date().getHours() - timeDiff == hour && new Date().getMinutes() == minute && new Date().getSeconds()<= seconds && go == true)
	{
		getFeriados(ano, ibge, token);
		setTimeout(main2, 10000);

		go = false;
	}
	else go = true;
}


function settings(obj)
{
	hour = obj.hour;
	minute = obj.minute;
	timeDiff = obj.timeDiff;
	seconds = obj.seconds;
}


function main2()
{
	feriado();

	var indexFeriado = 0;
	var obj = JSON.parse(fs.readFileSync('templates.json', 'utf8'));
	
	frase = fazerFrase(obj, proxFeriados[indexFeriado])

	var info = tweet(frase);
}


function answerTweet(info, texto)
{
	var obj = JSON.parse(fs.readFileSync('info.json', 'utf8'));
	texto = fazerInfo(obj, proxFeriados[0]);

	T.post('statuses/update', { status: texto, in_reply_to_status_id: info.id}, function(err, data, response) {
	  if (err) console.log(err);
	  else 
	  {
	  	console.log("tweet publicado\n" + data.user.screen_name + ": " + data.text);
	  }
	});
}


function maisInfoSobreFeriado()
{
	var txt = proxFeriados[0].nome + "\nData: " + proxFeriados[0].dia + "/" + 
			  proxFeriados[0].mes + "\nTipo: " + proxFeriados[0].tipo + "\n\nDescrição: " +
			  proxFeriados[0].desc;

	if (txt.length > 280)
	{
		var txt = proxFeriados[0].nome + "\nData: " + proxFeriados[0].dia + "/" + 
			  	  proxFeriados[0].mes + "\nTipo: " + proxFeriados[0].tipo;
	}

	return txt;
}


function fazerInfo(obj, feriado)
{
	var info = obj[randomRange(0, obj.length)];

	info = info.replace("$DIA$", feriado.dia);
	info = info.replace("$MES$", feriado.mes);
	info = info.replace("$DIA_SEMANA$", feriado.diaSemana);
	info = info.replace("$TIPO$", feriado.tipo);
	info = info.replace("$DATA$", feriado.dia + "/" + feriado.mes);
	info = info.replace("$NOME$", feriado.nome);

	if (info.replace("$DESCRICAO$", feriado.desc).length <= 280)
		info = info.replace("$DESCRICAO$", feriado.desc);

	return info;
}


function fazerFrase(templates, obj_feriado)
{
	e = -1;

	for (var i = 0; i < templates.length; i++)
		if (templates[i].tempo >= obj_feriado.countdown && e == -1) e = i;

	var r = randomRange(0, templates[e].emojis.length);
	emoji = templates[e].emojis[r];
	frase = lastFrase;
	while (lastFrase == frase || templates[e].frases.length > 1)
		frase = templates[e].frases[randomRange(0, templates[e].frases.length)];

	frase = frase.replace("$DIAS$", obj_feriado.countdown);
	frase = frase.replace("$NOME_FERIADO$", obj_feriado.nome);
	frase = frase.replace("$EMOJI$", emoji);
	frase = frase.replace("$DIA_SEMANA$", obj_feriado.diaSemana);
	frase = frase.replace("$TIPO$", obj_feriado.tipo);


	if (templates[e].piada.length > 0)
	{
		piadoca = templates[e].piada[randomRange(0, templates[e].piada.length)];
		piadoca = piadoca.replace("$DIAS$", obj_feriado.countdown);
		piadoca = piadoca.replace("$NOME_FERIADO$", obj_feriado.nome);
		piadoca = piadoca.replace("$TIPO$", obj_feriado.tipo);
		piadoca = piadoca.replace("$DIA_SEMANA$", obj_feriado.diaSemana);

		frase = frase + "\n\n" + piadoca;
	}

	return frase;
}


function randomRange(min, max) {
	max--;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function feriado()
{
	var e = 0;
	var dia = new Date().getUTCDate();
	var mes = new Date().getUTCMonth() + 1;

	for (var i = 0; i < feriados.length; i++)
	{
		var diaAtual = feriados[i].date.slice(0, 2);
		var mesAtual = feriados[i].date.slice(3, 5);

		//console.log(feriados[i].name + " é dia " + diaAtual + " e mes " + mesAtual);
		//console.log("dia: " + dia + "	mes: " + mes);

		if (((mesAtual > mes) || (mes == mesAtual && diaAtual >= dia)) && e < 5)
		{
			proxFeriados[e].nome = feriados[i].name;
			proxFeriados[e].dia = diaAtual;
			proxFeriados[e].mes = mesAtual;
			proxFeriados[e].codigo = feriados[i].type_code;
			proxFeriados[e].countdown = new DateDiff(new Date(ano, mesAtual - 1, diaAtual), new Date(ano, mes - 1, dia)).days();
			proxFeriados[e].countdown = Math.ceil(proxFeriados[e].countdown);
			proxFeriados[e].desc = feriados[i].description;
			proxFeriados[e].diaSemana = diasSemana[(new Date(ano, mesAtual - 1, diaAtual).getDay())];
			proxFeriados[e].tipo = feriados[i].type;


			e++;
		}
	}

	if (dia > 25 && mes == 12)
	{
		var e = 0;
		var i = 0;

		proxFeriados[e].nome = feriados[i].name;
		proxFeriados[e].dia = diaAtual;
		proxFeriados[e].mes = mesAtual;
		proxFeriados[e].codigo = feriados[i].type_code;
		proxFeriados[e].countdown = dia - 32;
		proxFeriados[e].desc = feriados[i].description;
		proxFeriados[e].tipo = feriados[i].type;
	}
	if (dia == 31 && mes == 12)
	{
		ano++;
	}
	//console.log("há " + e + " feriados reais.");
}


function tweet(texto)
{
	T.post('statuses/update', { status: texto }, function(err, data, response) {
	  if (err) console.log("algo deu errado ;(");
	  else 
	  {
	  	console.log("tweet publicado\n" + data.user.screen_name + ": " + data.text);
	  	var info = {id: data.id_str, username: data.user.screen_name};
	  	answerTweet(info, maisInfoSobreFeriado());
	  	return info;
	  }
	});
}


function getFeriados(ano, ibgeCidade, token)
{
	ano = new Date().getUTCFullYear();
	path = '/?json=true&ano='+ano+'&ibge='+ibgeCidade+'&token='+token+'==';
	request({
	    url: "https://api.calendario.com.br" + path,
	    headers: {'Content-Type': 'application/json; charset=utf-8'},
	    json: true
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) {
	        console.log("td certo");
	        feriados = body;
	        error = false
	        return null;
	    }
	    else console.log(error.message);
	})
	error = true;
}
