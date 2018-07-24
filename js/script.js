'use strict'; //modo estrito, avaliar o código com mais rigorosidade

//API (puxar informações) - como trazer o link com as informações para o projeto: 
// variável com a url para usar na função $.ajax()
const baseURL='https://api.weatherbit.io/v2.0/forecast/daily'; //=base da url
//variável para a APIKey, para usar na função $.ajax()
const apiKey='f0052f158d8444618b77787e5cc8f849';
//objeto para indicar a correspondência entre números e dias da semana
const weekdays={
	0:'Dom',
	1:'Seg',
	2:'Ter',
	3:'Qua',
	4:'Qui',
	5:'Sex',
	6:'Sab'
}

getForecast('Recife');

//identificar quando botão 'pesquisar' é clicado / ID search usando Jquery
$('#search').click(function(event){
	event.preventDefault();
	const newCity=$('#city').val();
	getForecast(newCity);
});

function getForecast(city) {//pegar a previsão de um lugar
	//determinar em quais momentos cada coisa vai acontecer, fazer uma request (esperar resultados), para aparecer no momento certo. 
	$('#loader').css('display','');
	$('#forecast').css('display','none');
	clearFields();
	//função $.ajax: (usar jquery e seu metodo $.ajax()), para fazer request (pedido) e acessar informações
	$.ajax({
		url:baseURL,
		data:{ //parametros da url:
		key:apiKey, 
		city:city,
		lang:'pt' //indicar ao parâmetro da request para receber a resposta em português
	},
	success:function(result){
		//determinar em quais momentos cada coisa vai acontecer, fazer uma request (esperar resultados), para aparecer no momento certo. 
		$('#loader').css('display','none');
		$('#forecast').css('display','');
		$('#city-name').text(result.city_name);
		const forecast=result.data; //array = variavel para trazer informações dos próximos dias
		const today=forecast[0]; //variavel que contem informações de hj
		displayToday(today); //chamando a função displayToday - passando como input a variável today
		const nextDays=forecast.slice(1); //variável que tem as informações da previsão de amanhã em diante
		displayNextDays(nextDays);
	},
	error:function(error){
	console.log(error.responseText);
	}
});
}


function clearFields(){ //para que os valores anteriores das caixas sumam
	$('#next-days').empty();
}

// função que recebe um input com as informações de hj
function displayToday(today){
// variável para cada informação que quero trazer
	const temperature=Math.round(today.temp); //temperatura média //Math.round para arredondar os números
	const windSpeed=today.wind_spd; //velocidade do vento
	const humidity=today.rh; //umidade média
	const weather=today.weather.description; //condição do tempo
//variável com  Icon - alterar icones com facilidade
	const icon=today.weather.icon;
// variável para puxar a URL do icone + icone que preciso
	const iconURL=`https://www.weatherbit.io/static/img/icons/${icon}.png`;
//alterar texto dentro de um elemento
	$('#current-temperature').text(temperature); //# faz referência aos IDs do Index.html // variável dentro de () para puxar o valor que achamos na variável. 
	$('#current-weather').text(weather);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(humidity);
//para fazer o src da imagem a ser a URL do icone
	$('#weather-icon').attr('src',iconURL);
}
//função para receber como imput a array "nextDays". 
function displayNextDays(nextDays){
	for(let i=0;i<nextDays.length;i=i+1){
	const day=nextDays[i]; //variável que contém as informações de previsão de amanhã
	const min=Math.round(day.min_temp); //Math.round para arredondar os números
	const max=Math.round(day.max_temp); //variáveis min e max que contém informações com as temperaturas mínima e máxima de amanhã
	const date=new Date(day.valid_date); //variável com informações do dia de hj //valid_date indica qual data aquela previsão se refere (vem da documentação API)
	const weekday=weekdays[date.getUTCDay()]; //variável para armazenar o dia da semana correspondente
	const card=$( //card= colocando min e max dentro do day-card //getUTCDate e getUTCMonth para inverter o dia/mês //getUTCDay para indicar que dia da semana cai aquela data
		`<div class="day-card"> 
                    <div class="date">${date.getUTCDate()}/${date.getUTCMonth()+1}</div>
                    <div class="weekday">${weekday}</div>
                    <div class="temperatures">
                        <span class="max">${max}°</span>
                        <span class="min">${min}°</span>
                    </div>
                </div>`); //para adicionar as caixas. 
	card.appendTo('#next-days'); //adicionar elemento na página
	}
}