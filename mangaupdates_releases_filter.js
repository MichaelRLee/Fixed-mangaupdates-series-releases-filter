// ==UserScript==
// @name           mangaupdates releases filter
// @namespace      mangaupdates releases filter (https://github.com/MichaelRLee/Fixed-mangaupdates-series-releases-filter)
// @description    Adds filters on the mangaupdates release page for series on your Reading, Wish, Completed, Unfinsihed, or On Hold list
// @include        https*://www.mangaupdates.com/releases.html*
// @version        1.0
// @downloadURL    https://github.com/MichaelRLee/Fixed-mangaupdates-series-releases-filter/raw/main/mangaupdates_releases_filter.js
// @updateURL      https://github.com/MichaelRLee/Fixed-mangaupdates-series-releases-filter/raw/main/mangaupdates_releases_filter.js
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_log
// An updated/fixed version of chulian's script: https://userscripts-mirror.org/scripts/show/66979
// ==/UserScript==

try{

	var options ="<input id='rl' type='checkbox' value='type0' "+GM_getValue("rl","")+" />Reading    <br/>";
	    options+="<input id='wl' type='checkbox' value='type1' "+GM_getValue("wl","")+" />Wish       <br/>";
	    options+="<input id='cl' type='checkbox' value='type2' "+GM_getValue("cl","")+" />Complete   <br/>";
	    options+="<input id='ul' type='checkbox' value='type3' "+GM_getValue("ul","")+" />Unfished   <br/>";
	    options+="<input id='hl' type='checkbox' value='type4' "+GM_getValue("hl","")+" />Hold       <br/>";
	    options+="Show the selected lists on top: <input id='top' type='checkbox' value='top' "+GM_getValue("top","")+"  />  <br/>";
	    options+="<input type='button' value='Filter' id='go'/>";

	$("p.titlesmall:first").before("<div id='wikiwasa'></div><a id='toggle' href='void()'><u>Toggle filter</u></a><br/><div id='wiki'> Show only the folowing lists: <br/> "+options+"  <br/> </div>");
	$("#wiki").hide();
	//display filter options
	$('#toggle').click(function() {
		$('#wiki').toggle("slow");
		return false;
	});
	//click the filter button
    $("#go").click(function () {
      filter();
    });

    function getRow(tag){
        var row=new Array();
        var index=0;
        var node = $(tag);
        do {
            row[index]=$(node);index++;
            node=node.next();
        }while(node.length > 0 && !$(node).hasClass("col-6"));
        return row;
    }

    function hideRow(tag){
        var nodes = getRow(tag);
        nodes.forEach(node => $(node).hide());
    }

    function cloneRow(tag){
        var nodes = getRow(tag);
        nodes.forEach(node => $(node).clone().appendTo($("#wikiwasachapters")));
    }

	function filter(){
		var checked=new Array();
		var index=0;
		$("#wiki input[type='checkbox']").each(function(i){
			if($(this).is(":checked")){
				checked[index]=$(this).val();index++;
				GM_setValue($(this).attr("id"),"checked");
			}else{
				GM_setValue($(this).attr("id"),"");
			}
		});

        //Unhide all entries first
        $("div.alt div.row div").each(function(i){
            $(this).show();
        });

        var listOnTop = $("#top").is(":checked");

        //copy formatting for table if user has list on top
        if (listOnTop){
            $("#wikiwasa").html("<div class=\"alt p-1\" style=\"border: 1px solid #7F8E9E;\">"+
                                "<div class=\"row no-gutters\" id='wikiwasachapters'>"+
                                "<div class=\"col-6\"><b>Title</b></div><div class=\"col-2\"><b>Release</b></div><div class=\"col-4\"><b>Groups</b></div>"+
                                "</div></div>");
        }else{
            $("#wikiwasa").html("");
        }

		var checkStr=checked.join("|");
		$("div.alt div.row div.col-6").each(function(i){
			var list=$(this).find("a img").attr("src");//look for the icon

			if( checkStr==""){//if no list to filter are checked...
				return true;//nothing more to do
			}
			if(!list){//if the release does not have a list icon ......
				if(!listOnTop){
                    if(!$(this).has("b").length > 0){//always display the headers
					    hideRow($(this));
                    }
				}
				return true;
			}
			if(checkStr!="" && !list.match( eval("/"+checkStr+"/") ) ){
				if(!listOnTop){
					hideRow($(this));
				}
			}else{
				if(listOnTop){
					cloneRow($(this));
				}
			}
		});
	}
	filter();
}catch(e){
	GM_log(e.description);
}
