/*	ADAPTAÇÃO QUE RECARREGA AS PÁGINAS LOCAIS NO SERVIDOR VELHO	*/
	var localH = "file:///V:/", localH_IE = "file://V:/", servidorH = "http://sv.www5.fgv.br/fgvonline/", url = window.location.href;
	if (url.substr(0, 11) == localH) window.location = servidorH + url.split(localH)[1].split("\\").join("/");
	if (url.substr(0, 10) == localH_IE) window.location = servidorH + url.split(localH_IE)[1].split("\\").join("/");
	/* Conversão de domínio para permitir crossdomain intenos na FGV */
	if( (/^((sv)|(cl)|(ead))(.*)fgv\.br/gi).test(document.domain ) ) document.domain = "fgv.br";
/*	ADAPTAÇÃO QUE RECARREGA AS PÁGINAS LOCAIS NO SERVIDOR DE HOMOLOGAÇÃO	*/

var versao = "v2019.07.02"

var doc = function(){
	var $mainContent;
	var $menu_naveg;
	var $version;
	var $mobileBar;
	var $menuButton;
	var pages = [];
	var isSmallport = false;
	var sections = [];

	function init(){
		window['isdoc'] = true;
		$('body').hide();
		setHTML(function(){
			$mainContent = $( '#main-content' );
			$menu_naveg = $( '#menu_naveg' );
			$version = $menu_naveg.find('select').first();
			$mobileBar = $('#mobile-bar');
			$menuButton = $('#mobile-bar').find('.menu-button').first();
		});		

		onResize();
		setMenu();
		addEvents();
		docEvents();
		$('body').fadeIn('slow');
	}

	function setHTML(callback){
		// menu div
		$('body').prepend('<div id="mobile-bar" class="">'+
							'<a class="menu-button"></a>'+
							'<a class="logo" href="index.html"></a>'+
						  '</div>');
		$('body').prepend('<div id="menu_naveg"></div>');
		$('#main').wrap('<div id="main-content"></div>');

		callback();
	}

	function reload(){
		docEvents();
	}

	function addEvents(){
		$(window).on('resize', onResize);

		$menuButton.on('click', function(){
			$menu_naveg.toggleClass('show');
			onResize();
		});

		$mainContent.on('click', function(){
			if(isSmallport) $menu_naveg.removeClass('show');
		})
	}

	function docEvents(){
		jQuery.fn.selectText = function(){
			this.find('input').each(function() {
				if($(this).prev().length == 0 || !$(this).prev().hasClass('p_copy')) {
					$('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
				}
				$(this).prev().html($(this).val());
			});
			
			var doc = document;
			var element = this[0];
			console.log(this, element);
			if (doc.body.createTextRange) {
				var range = document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			} else if (window.getSelection) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.selectNodeContents(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		};

		$('code, pre').on('dblclick', function(e){
			var $this = $(this);
			$this.selectText();
		});

		$('body .divisor').each(function(){
			var slug = $(this).text().replace(/[^a-zA-Z0-9]/g,'');

			var example = $(this).parent().siblings().first();
			var text =  $("<div />").append( example.clone() );
			text = text.html();

			var code = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/(\t{5})(?!\t{5})/g,"");                

			$(this).attr('id',slug);

			$(this).click(function(){
				var self = $(this);

				if(!self.hasClass('open')){
					self.toggleClass("open");
				}

				if( self.find('pre').length ){ return; }
				self.find('pre, button').remove();
				var example = $(this).parent().siblings().first();
				var text =  $("<div />").append(example.clone()).html();
				text = htmlEntities( text );
				self.append($('<pre></pre>').append(code).attr('contenteditable','true'));
				self.append($('<button class="btn" value="Fechar" title="Fechar">Fechar</button>'));
				//$('[data-spy="scroll"]').scrollspy('refresh');

				self.find('button').click(function(e){
					e.preventDefault();
					e.stopPropagation();
					self.find('pre').add('button', self).remove();
					$('[data-spy="scroll"]').scrollspy('refresh');
					return false;
				});
				//self.find('pre').click(function(){ SelectText($(this)[0]); });
				self.find('pre').dblclick(function(){
					var $this = $(this);
					$this.selectText();
				});
			});
		});
	}


	function addMenuEvents(){
		$('#select_version').on('change', function(ev) {
			console.log("valor",$(this).val());
			changeCurrentVersion($(this).val());
		});

		$('.pag-sub-link').on('click', function(){
			//$menu_naveg.scrollTop($(this)[0].offsetTop - $(window).height()/2)
			$menu_naveg.animate({
				scrollTop: $(this)[0].offsetTop - $(window).height()/2
			}, 200);
			goToSection($(this).data('link'));
		});

		if (window.location.hash) goToSection(window.location.hash);

		//$('#select_version').val(getCurrentVersion());
	}

	function changeCurrentVersion ( val ) {
		if ( val.length && val != getCurrentVersion() ) {
			console.log("alterando para a versão",val);
			$('body').fadeOut('fast', function(){
				var urlAtual = window.location.href;
				var urlDestino = urlAtual.replace(getCurrentVersion(), val);
				$.ajax({
					url:urlDestino,
					type:'HEAD',
					error: function() {//página de destino não encontrada
						var splitReg = new RegExp('.*\/([^\/]*)\.html+.*','gi');
						var paginaAtual = urlDestino.replace( splitReg, '$1');
						urlDestino = urlDestino.replace(paginaAtual, 'index');
						console.warn(
							"a página '"+paginaAtual+".html' não existe em ",val,
							"\nrevertendo para a página inicial do framework selecionado",
							"\n",urlDestino
						);
						window.location.href = urlDestino;
					},
					success: function() {//página de destino encontrada
						window.location.href = urlDestino;
					}
				});
			});
		} else {
			console.error("a versão não será alterada – valor inválido:",val);
		}
	}

	function getCurrentVersion(){
		var regex =  new RegExp('(framework_html5/)(\\w+)', 'g');
		var url = window.location.href;
		var curVersion = regex.exec(url)[2];
		return curVersion;
	}

	function getCurrentPage(){
		var path = window.location.pathname;
		var page = path.split("/").pop();
		return page;
	}

	function onResize(r){
		var menuWidth = parseInt($menu_naveg.css('width'));
		var mainWidth = $(window).width() - menuWidth;
		isSmallport = (mainWidth <= 650);
		$menu_naveg.toggleClass('smallport', isSmallport);
		$mobileBar.toggleClass('show', isSmallport);
		$mainContent.css('width', ( isSmallport ? $(window).width() : mainWidth ) + 'px');
		if(!r) onResize(true);
	}

	function setMenu() {
		$menu_naveg.append('<section><div class="content"></div></section>');
		var $menu = $menu_naveg.find('.content').first();
		$menu.load('menu.html', function() {
			var totalPags = $menu_naveg.find('.pag-link').length;
			$menu_naveg.find('.pag-link').each(function(i){
				if( $(this).attr('href') == getCurrentPage() ) {
					$(this).attr('href', 'javascript:void(0);')
					$(this).addClass('highlight');
					$menu_naveg.scrollTop($(this)[0].offsetTop - $(window).height()/2)
					$(this).on('click', function(){goToSection('#main');})					
					$(this).parent().find('.submenu').first().addClass('show');
					
					var self = this;
					var links = [];
					$mainContent.find("*[data-label]").each(function(){
						var id = $(this).attr('id');
						var label = $(this).data('label');
						
						var $link = $('<li><a class="pag-sub-link" data-link="#'+id+'" href="javascript:void(0);">'+label+'</a></p></li>');							
						var $list = $(self).parent().find('ul').first();
						$link.appendTo($list);
						var el = $list.find($link).first();
						var submenu = {
							"id": id,
							"scroll": $(this).offset().top ,
							"el": el ,
							"$section": $(this) 
						}
						links.push(submenu);
					});
					scrollHighlight(links);
				}
				if(i==totalPags-1) onAllLoaded();
			});
		});
	}

	function goToSection(id){
		$('html, body').animate({
			scrollTop: $(id).offset().top - 40
		}, 500);
	}

	function scrollHighlight(links){
		var none = false;
		$(window).scroll(function(){
			var hasFound = false;
			var curScroll = $(window).scrollTop() + 200;
			var maxScroll = $('html').height();
			var link = links[0];
			for(var i = 0; i < links.length; i++){
				var linkScrollPos = links[i].$section.offset().top
				if(curScroll > linkScrollPos) {
					link = links[i];
					hasFound = true;
				}
			}
			hightlightLink(link.el, hasFound);
		});

		function hightlightLink($el, hasFound){
			$el.parent().find('li').each(function(){
				$(this).removeClass('highlight');
			})
			if(hasFound) $el.addClass('highlight');
		}
	}

	var menuLoadCounter = 0;
	function onSubmenuLoaded(obj, length){
		menuLoadCounter++;
		pages.push(obj);
		if(menuLoadCounter == length) onAllLoaded();
	}
	
	function onAllLoaded(){
		var versao = "";
		$('#select_version').find('option').each(function(){
			var selecionado = ( $(this).prop('value') == getCurrentVersion() );
			versao = ( $(this).prop('value') == getCurrentVersion() ? $(this).html() : versao );
			$(this).attr('selected',selecionado);
		});
		//getCurrentPage();
		var titulo = $("#main").find('section:not([class="no-browsersupported"]):first').find('header > h1').html() || "";
		console.log(
			"versao:", versao,
			"\ntitulo:", titulo
		);
		$('title').html(
			(titulo.length?titulo.toUpperCase()+" – ":"")+
			versao
		);
		addMenuEvents();
	}

	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	return {
		init: init,
		reload: reload
	}
}

var Doc = false;

nm.ready( 'before.nm_ui', function( pack, $) {
	if(!Doc){
		Doc = doc();
		Doc.init();
	} else {
		Doc.reload();
	}
});