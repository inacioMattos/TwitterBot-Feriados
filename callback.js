var Twit = require('twit')
var T = new Twit({
  consumer_key:         'jBqxguzmeaLiRLPGmsWjyCwVV',
  consumer_secret:      '3MsfiqHKqD9GksleTz5bboefxuRoClJ3SlTGKXGVDt358CuFHT',
  access_token:         '3185598995-IkhPSXC8cDExNySvOrwDZuiXtmSUyh8ccOlCrOX',
  access_token_secret:  'dedVCSD8GDn2xoz7JMCUNGtmF1CoU5oxqXD391VCuD5x4',
});

tweet("te11stree");

function tweet(texto)
{
	T.post('statuses/update', { status: texto }, function(err, data, response) {
	  if (err) console.log("algo deu errado ;(");
	  else console.log("tweet publicado\n" + JSON.stringify(data));
	});
}