$(function(){
	var VIDE = 0;
	var DRAPEAU = 1;
	var MINE = 2;

	var e = $("#demineur");
	var timer = $('#demineur_time');
	var lin = e.attr('ligne');
	var col = e.attr('colonne');
	var nb_piege = Math.ceil(lin*col*2/10);
	var genere = false;
	var fini = false;
	var score = $('#demineur_score');
	var marques = 0;
	var message = $("#demineur_message");
	var reste = parseInt(col)*parseInt(lin)-nb_piege;
	var loose = false; // Si le joueur a perdu
	var start = false; // variable ajoutée pour verifier si le jeu a commencé 
	var timerInterval;

	var options = {caseClass: 'demineur_case'};
	function startTimer(){
		timerInterval = setInterval(function(){
		if (!fini || start)
			timer.html(1+parseInt(timer.html()));
	}, 1000);
	}

	function stopTimer()
	{
		clearInterval(timerInterval);
	}
	

	$('#rejouer').click(function(){
		genere = false;
		fini = false;
		start = false;
		marques=0;
		dessiner(lin, col);
		timer.html('0');
		message.html('');
		reste = parseInt(col)*parseInt(lin)-nb_piege;
		//$(this).hide();
		stopTimer();
		return false;
	});

	var ecouteur = function() {
		$('.'+options.caseClass).click(function(e){

			e.preventDefault();

			if (fini == true) return false;

			if($('#demineur .'+options.caseClass).each(function(){

				if(!$(this).hasClass('drapeau not_piege nulle') && !start)
				{
					start = true;
					startTimer();
				}

			}));

			

			var node = $(this);
			if (node.hasClass('not_piege') || node.hasClass('drapeau'))
				return false;
			var l = parseInt($(this).attr('l'));
			var c = parseInt($(this).attr('c'));

			if (!genere){
				generer_pieges(nb_piege, l, c);
				genere = true;
			}

			if ($(this).attr('piege') == 1) {
				$('.'+options.caseClass+'[piege="1"]').addClass('piege entypo').html('&#128261;').hide().fadeIn();
				message.html('Vous avez perdu !');
				fini = true;
				start = false;

				$('#rejouer').show();
			} else {
				$(this).addClass('not_piege');
				reste--;
				var n_mines = nombre_pieges(voisins(l, c));
				if (n_mines != 0) {
					$(this).text(n_mines).hide().fadeIn();

				} else {
					$(this).addClass('nulle');
					marqueur_zero(voisins(l, c));
				}
				console.log(reste);
				if (reste==0){
					fini=true;
					message.html('GAGNE :-D')
				}
			}
		});

		$('.'+options.caseClass).bind("contextmenu",function(e){
			if (fini) return ;
			var node = $(this);
			if (node.hasClass('drapeau')){
				node.removeClass('drapeau').empty().hide().fadeIn();
				marques--;
			}
			else {
				if (!node.hasClass('not_piege')){
					node.addClass('drapeau').html('&#9873;').hide().fadeIn();
					marques++;
				}
			}
			
			$(score).html(marques+'/'+nb_piege);
			
			return false;  
		});
	}

	var marqueur_zero = function(tab) {
		for (var i = 0; i<tab.length; i++) {
			if ((typeof(tab[i]) != "undefined")) {
				var node = $("#"+tab[i]);
				var l = parseInt(node.attr('l'));
				var c = parseInt(node.attr('c'));
				var n_pieges = nombre_pieges(voisins(l, c));
				if (!(node.hasClass('not_piege')) ){
					node.addClass('not_piege');
					reste--;
					if (n_pieges != 0) {
						node.html(n_pieges);
					} else {
						node.addClass('nulle');
						marqueur_zero(voisins(l, c));
					}
				}
			}
		}
	}

	var dessiner = function(n_ligne, n_colonne) {
		var contenu = "";
		for (var i = 0; i<n_ligne; i++){
			contenu += "<div class='demineur_ligne'>";
			for (var j = 0; j<n_colonne; j++){
				contenu += "<div class=\""+options.caseClass+"\" piege='0' id='"+i+"_"+j+"' l='"+i+"' c='"+j+"'></div>";
			}
			contenu += "</div>";
		}
		e.html(contenu);

		score.html(marques+'/'+nb_piege);

		ecouteur();
	}

	dessiner(lin, col);

	var nombre_pieges = function(tab) {
		var nb_pieges = 0;
		for (var i = 0; i<tab.length; i++) {
			if (typeof(tab[i]) != "undefined") {
				nb_pieges += parseInt($("#"+tab[i]).attr('piege'));
			}
		}
		return nb_pieges;
	}

	var voisins = function(ligne, colonne) {
		ligne = parseInt(ligne);
		colonne = parseInt(colonne);
		var tabs = [];
		for (var i = (ligne-1); i<= (ligne+1); i++){
			for (var j = (colonne-1); j<= (colonne+1); j++) {
				if ((i != ligne) || (j != colonne)){
					tabs.push($("#"+i+"_"+j).attr('id'));
				}
			}
		}
		return tabs;
	}

	var generer_pieges = function(n, ligne, colonne){
		var n_piege = n;
		while (n_piege > 0) {
			var c = parseInt(Math.random()*col);
			var l = parseInt(Math.random()*lin);

			if ((c!=colonne) || (l!=ligne)) {
				if ($('#'+l+'_'+c).attr('piege')==0) {
					$('#'+l+'_'+c).attr('piege','1');
					n_piege--;
				}
			}
		}
	}

	
})