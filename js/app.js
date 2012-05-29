$(function(){
	var e = $("#demineur");
	var lin = e.attr('ligne');
	var col = e.attr('colonne');
	var nb_piege = Math.ceil(lin*col*3/10);
	var genere = false;
	var fini = false;

	$('#rejouer').click(function(){
		genere = false;
		fini = false;
		dessiner(lin, col);
		$(this).hide();
		return false;
	});

	var ecouteur = function() {
		$(".demineur_case").click(function(){
			if (fini == true) return false;
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
				$('.demineur_case[piege="1"]').addClass('piege');
				fini = true;
				$('#rejouer').show();
			} else {
				$(this).addClass('not_piege');
				var n_mines = nombre_pieges(voisins(l, c));
				if (n_mines != 0) {
					$(this).html(n_mines);
				} else {
					marqueur_zero(voisins(l, c));
				}
			}
		});

		$(".demineur_case").bind("contextmenu",function(e){
			if (fini == true) return false;
			var node = $(this);
			if (node.hasClass('drapeau'))
				node.removeClass('drapeau');
			else {
				if (!node.hasClass('not_piege'))
					node.addClass('drapeau');
			}
			
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
				if (!(node.hasClass('not_piege'))){
					node.addClass('not_piege');
					if (n_pieges != 0) {
						node.html(n_pieges);
					} else {
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
				contenu += "<div class='demineur_case' piege='0' id='"+i+"_"+j+"' l='"+i+"' c='"+j+"'></div>";
			}
			contenu += "</div>";
		}
		e.html(contenu);

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