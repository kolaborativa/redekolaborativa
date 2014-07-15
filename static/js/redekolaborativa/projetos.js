document.addEventListener('DOMContentLoaded',function(){

		console.log("Etapa",pegaGET('stage'));
		mudando_fase_perfil(pegaGET('stage'));

});





function mudando_fase_perfil(fase){
	console.log(fase)
	fase = fase == null? "1": fase; // se o valor vier null ele atribui a fase numero 1 do formulário

	var fases_edicao = SelectAll("data-fase")
	var status_fase  = SelectAll("data-fase-atual")
	var img_fase     = SelectAll("data-img-fase");
	var status;
	var iImg         = 0;
	var iFases       = 0;

	for (; iFases < fases_edicao.length; iFases++) {
		status = fases_edicao[iFases].getAttribute("data-fase-atual");

		// Identifica qual o bloco que vai
		if (fases_edicao[iFases].getAttribute("data-fase") == fase){
			status = "true";
		}
		else{
			status = "false";
		}
		// Muda o bloco
		if (status == "false") {
			fases_edicao[iFases].style.display = "none";
		}
		else{
			fases_edicao[iFases].style.display = "block";
		};
	};

	// Identifica quais as imagens da fase atual de edição do perfil e adiciona dinamicamente
	switch(fase){
		case "1":
			 img_fase[0].src = image.editProfilefase1
			 img_fase[1].src = image.editProfilefase2_cinza
			 img_fase[2].src = image.editProfilefase3_cinza
		break;
		case "2":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2
			 img_fase[2].src = image.editProfilefase3_cinza
			 img_fase[3].src = image.editProfilefase4_cinza
		break;
		case "3":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2_completa
			 img_fase[2].src = image.editProfilefase3
			 img_fase[3].src = image.editProfilefase4_cinza
		break;
		case "4":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2_completa
			 img_fase[2].src = image.editProfilefase3_completa
			 img_fase[3].src = image.editProfilefase4
		break;

	};
}

function gravaAjaxEditProfile(e){

	var field;
	var value;
	var vars;

	if(e.name == "profession"){

	}
	else if(e.name == "avatar"){

		var img 	= Id("hidden-avatar").value;
			vars    = {image64: img, field : e.name}; // Cria um objeto com a img em base64 e o nome do campo
			// caminho = url.edit_profile;
	}
	else {
			field = e.name;
			value = e.value;
			vars = "field="+field+"&value="+value;
			caminho = url.testaAjax;
	}

	$.ajax({
		type: 'POST',
		url: caminho,
		data: vars,
		success: function(data){
			console.log(data);
		},
		error: function(data){
			console.log(data);
		}
	});
}