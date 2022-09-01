var Secs,Mins,RelVid,AutoPlay,Lop,ShowInfo,Themes,Colors,VideoId,mw,mh,jumpto;
var ready = 0;
var qualityArray = ["default","small","medium","large","hd720","hd1080","highres"]
var selectedQuality = 0;

var isResponsiveProject = false;
var mainCPNamespace;
var evtHandle;

var movieWidth;
var movieHeight;

var width
var height

var myWidgetiFrame

resourceUse1 = {
	onLoad: function()
	{
		if ( ! this.captivate )
			return;
		
		this.movieProps = this.captivate.CPMovieHandle.getMovieProps();
		if ( ! this.movieProps )
			return;
		this.varHandle = this.movieProps.variablesHandle;
		//this.eventDisp = this.movieProps.eventDispatcher;
		evtHandle = this.movieProps.eventDispatcher;
		mainCPNamespace = this.movieProps.getCpHandle();
		isResponsiveProject = mainCPNamespace.responsive;
		this.xmlStr = this.captivate.CPMovieHandle.widgetParams();
		this.internalImage = '';
		this.externalImage = '';
		this.description = '';
		this.myVar = '';
		this.myVar1 = '';
		var size = this.OpenAjax.getSize();
        width = size.width;
        height = size.height;
		this.ta_fontname = '';
		this.ta_fontsize = '';
		this.ta_bold = '';
		this.ta_underline = '';
		this.ta_italic = '';
		this.ta_align = '';
		this.ta_textcolr = '';
		this.ta_highlightcolor = '';
		this.strProp = '';
		
		movieWidth = parseInt(size.width.split("px")[0]);
        movieHeight = parseInt(size.height.split("px")[0]);
		
		//Captivate Event listener
		evtHandle.addEventListener(mainCPNamespace.WINDOWRESIZECOMPLETEDEVENT,updateSizeNPositionOnResizeComplete, false );
		evtHandle.addEventListener(mainCPNamespace.ORIENTATIONCHANGECOMPLETEDEVENT,updateSizeNPositionOnResizeComplete, false );
		
		this.updateData();
		this.doUpdate();
		
		
	},

	updateData: function()
	{
	//if (this.captivate.CPMovieHandle.pauseMovie ) {
      //                                          setTimeout("parent.cp.movie.pause(parent.cp.ReasonForPause.INTERACTIVE_ITEM)",100);                        }
		var id = 0;
		var result = jQuery.parseXML( this.xmlStr );
		var resultDoc = jQuery( result );
		this.strProp = resultDoc.find( 'string' ).text();
		
		if(window.DOMParser)//Firefox, Chrome and others Browsers
    {
        var relvid0 = resultDoc.find('#videoid');
        if (relvid0) {
            if (relvid0.find('string')) {
                VideoId = relvid0.find('string').text();
                }
        }
		
		var relvid1 = resultDoc.find('#RelVid');
        if (relvid1) {
            if (relvid1.find('string')) {
                RelVid = booltointvalue(relvid1.find('string').text());
                }
        }
		
		var relvid2 = resultDoc.find('#Lop');
        if (relvid2) {
            if (relvid2.find('string')) {
                Lop = booltointvalue(relvid2.find('string').text());
                }
        }
		
		
		var relvid3 = resultDoc.find('#AutoPl');
        if (relvid3) {
            if (relvid3.find('string')) {
                AutoPlay = booltointvalue(relvid3.find('string').text());
                }
        }
		
		var relvid4 = resultDoc.find('#showinformation');
        if (relvid4) {
            if (relvid4.find('string')) {
                ShowInfo = booltointvalue(relvid1.find('string').text());
                }
        }
		
		
		var relvid5 = resultDoc.find('#mint');
        if (relvid5) {
            if (relvid5.find('string')) {
                Mins = relvid5.find('string').text();
                }
        }
		
		var relvid6 = resultDoc.find('#sec');
        if (relvid6) {
            if (relvid6.find('string')) {
                Secs = relvid6.find('string').text();
                }
        }
		
		var relvid7 = resultDoc.find('#theme');
        if (relvid7) {
            if (relvid7.find('string')) {
                Themes = relvid7.find('string').text();
                }
        }
		
		var relvid8 = resultDoc.find('#clor');
        if (relvid8) {
            if (relvid8.find('string')) {
                Colors = relvid8.find('string').text();
                }
        }
		
		var relvid9 = resultDoc.find('#qual');
        if (relvid9) {
            if (relvid9.find('string')) {
                selectedQuality = relvid9.find('string').text();
                }
        }
		
		
    }
    else // Internet Explorer
    {
       testXml(this.xmlStr);
    }
	
	
		
		
		
		jumpto = parseInt(Secs) + parseInt(Mins)*60
		
			var allWidgets = window.parent.document.getElementsByClassName("cp-widget");
			var myFrameName = window.name;
			myWidgetiFrame = window.parent.document.getElementById(window.name);
			if(myWidgetiFrame)
			{
				
				var w = myWidgetiFrame.offsetWidth
				var h = myWidgetiFrame.offsetHeight
			}
			
			//console.log(w,h)
				mw = w 
				mh = h 
				
				/*myWidgetiFrame.parentElement.parentElement.style.width = myWidgetiFrame.parentElement.parentElement.offsetWidth + 7 + "px"
				myWidgetiFrame.parentElement.parentElement.style.height = myWidgetiFrame.parentElement.parentElement.offsetHeight + 8 + "px"
				myWidgetiFrame.parentElement.parentElement.style.top = myWidgetiFrame.parentElement.parentElement.offsetTop - 7 + "px"
				myWidgetiFrame.parentElement.parentElement.style.left = myWidgetiFrame.parentElement.parentElement.offsetLeft - 8 + "px"*/
				
	
	},
	
	

 

	doUpdate: function() 
	{
		
		elem = document.getElementById( 'description_div' );
		
			
		var tag = document.createElement('script');

      // This is a protocol-relative URL as described here:
      //     http://paulirish.com/2010/the-protocol-relative-url/
      // If you're testing a local page accessed via a file:/// URL, please set tag.src to
      //     "https://www.youtube.com/iframe_api" instead.
      

  
  
	//  tag.src = "https://www.youtube.com/iframe_api";
	  
	  tag.src = "//www.youtube.com/iframe_api";
	  
		if(jQuery.browser.msie)
	  tag.src = "https://www.youtube.com/iframe_api";
	  
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	  
	  resizeInteraction(width,height);
     //console.log(firstScriptTag)
		
		
	}
};

resource_use = function ()
{
	return resourceUse1;
}



function testXml(theXml)
{
	//var theXml = "<test><item id='1'>one</item><item id='2'>two</item></test>";		
	theXml = parseXml(theXml);
	
	$(theXml).find('property').each(function() 
	{
		var theItem = $(this);
		var theId = theItem.attr("id");
		var theText = theItem.text();		
		
		
		switch(theId)
		{
		case 'sec':
		Secs = theText;
		break;
		
		case 'mint':
		Mins = theText;
		break;
		
		case 'RelVid':
		RelVid = booltointvalue(theText);
		break;
		
		
		case 'AutoPl':
		AutoPlay = booltointvalue(theText);
		break;
		
		case 'Lop':
		Lop = booltointvalue(theText);
		break;
		
		case 'showinformation':
		ShowInfo = booltointvalue(theText);
		break;
		
		case 'theme':
		Themes = theText;
		break;
		
		case 'clor':
		Colors = theText;
		break;
		
		
		case 'videoid':
		VideoId = theText;
		break;
		
				
				
		}
			//alert(urltext);	
		//alert("Id=" + theId + " Text=" + theText);
	});
}

function parseXml(xml)
{	
	if (jQuery.browser.msie)
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
		xmlDoc.loadXML(xml);
		xml = xmlDoc;
	}
	
	return xml;
}



function booltointvalue(val)
{

if(val == "true")return 1;
else return 0;

}


 // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
	  
	 ready = 1;
	  
	  if(Lop == 0)
	  {
        player = new YT.Player('player', {
          height: mh,
          width: mw,
          videoId: VideoId,
		  playerVars:{
		  start:jumpto,
		  autoplay:AutoPlay,
		  showinfo:ShowInfo,
		  theme:Themes,
		  color:Colors,
		  loop:Lop,
		  rel:RelVid,
		  //playlist:VideoId
		  },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
		}
		else
		{
		player = new YT.Player('player', {
          height: mh,
          width: mw,
          videoId: VideoId,
		  playerVars:{
		  start:jumpto,
		  autoplay:AutoPlay,
		  showinfo:ShowInfo,
		  theme:Themes,
		  color:Colors,
		  loop:Lop,
		  rel:RelVid,
		  playlist:VideoId
		  },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
		}
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        //event.target.playVideo();
		player.setPlaybackQuality(qualityArray[selectedQuality])
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        // if (event.data == YT.PlayerState.PLAYING && !done) {
          // setTimeout(stopVideo, 6000);
          // done = true;
        // }
      }
      function stopVideo() {
        //player.stopVideo();
      }
	  
function updateSizeNPositionOnResizeComplete(){
	resizeInteraction(width,height);
}	

function resizeInteraction(thewidth, theheight){
	myWidgetiFrame.style.width = myWidgetiFrame.parentElement.parentElement.offsetWidth + 7 + "px"
	myWidgetiFrame.style.height = myWidgetiFrame.parentElement.parentElement.offsetHeight + 8 + "px"
    var scale = 0;
    thewidth = String(thewidth).replace("px", "");
    theheight = String(theheight).replace("px", "");
    if (thewidth < theheight){
        scale = thewidth / (movieWidth);
    } else {
        scale = theheight / (movieHeight);
    }
    var margins = Math.round(25 * scale);
    margins += "px"
    scale = "scale(" + scale + ")";
	
	$('#player').css('-webkit-transform', scale);
    $('#player').css('-moz-transform', scale);
    $('#player').css('-o-transform', scale);
    $('#player').css('-ms-transform', scale);
    $('#player').css('-moz-transform-origin', '0 0');
    $('#player').css('-webkit-transform-origin', '0 0');
    $('#player').css('-moz-transform-origin', '0 0');
    $('#player').css('-o-transform-origin', '0 0');
    $('#player').css('-ms-transform-origin', '0 0');
	
    /*$('#'+myWidgetiFrame.id).css('-webkit-transform', scale);
    $('#'+myWidgetiFrame.id).css('-moz-transform', scale);
    $('#'+myWidgetiFrame.id).css('-o-transform', scale);
    $('#'+myWidgetiFrame.id).css('-ms-transform', scale);
    $('#'+myWidgetiFrame.id).css('-moz-transform-origin', '0 0');
    $('#'+myWidgetiFrame.id).css('-webkit-transform-origin', '0 0');
    $('#'+myWidgetiFrame.id).css('-moz-transform-origin', '0 0');
    $('#'+myWidgetiFrame.id).css('-o-transform-origin', '0 0');
    $('#'+myWidgetiFrame.id).css('-ms-transform-origin', '0 0');*/
}
