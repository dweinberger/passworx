/* PASSWORX
 *
 * An insecure but convenient browser-based password keeper.
 * Uses a dumb, easy to crack algorithm to "encrypt" info.
 *
 * Requires the following directories and files:
 		passworx.html
 		js/passworx01.js
 		css/passworx.css
 		images/static.jpg (screensaver)
 		includes/[any recent version of jQuery]
 		includes/jquery.visible.min.js
 			[from https://github.com/customd/jquery-visible]
 		php/makebakefile.php
 		php/deletesaveddata.php
 		php/saveConvertedText.php
 		php/savejson.php
 		data/
  *
  * Issued under an MIT open license. 
  * I stand by nothing in this code. I am an amateur. 
  * Forgive me.
  *
  * David Weinberger
  * Jan. 7, 2018
  * david@weinberger.org
 		 
*/

// -- globals

var entrypassword = "nn";
var gLogin = false;
var intervalID =  10;
var bannerTime = 1000; // 1.0 secs
var errorBannerTime = 3000;
var encodeIt = false;
var gtimer;
var timeoutInterval = 600000; // 6000 = 1 min, 600,000 = ten mins

var gDataRaw;
var gData = []; //new Array();

var CodeString = "JCYARBFEHXGLMKOIPNDSQVZTUW9802137465abcdefghijklmnopqrstuvwxyz";
var DeCodeString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789nucfvdihmlkztgbrqpaosxweyj";

// --- INITIALIZE  
function init(){

	// Click on the image that hides the screen
	// after a timeout, and it goes away
    $("#hidescreen").click(function (){
        $(this).fadeOut();
        resetTimer();
    });

    // Clicking anywhere in the body tells the screen
    // saver timer to restart
    $("body").click(function (){
        gtimer = setTimeout(hideScreen, timeoutInterval);
    });
    
    // The enter key sends the login info
     $('#loginTextbox').keypress(function(event) {
        if (event.keyCode == 13) {
        	event.preventDefault();
            splashscreen();
            return false;
        }
    });
    // The enter key does a search
    $('#searchtxt').keypress(function(event) {
        if (event.keyCode == 13) {
        	event.preventDefault();
            doSearch();
            return false;
        }
    });
    // Create a suggested title from an url
    // after the user clicks out of the url box
    $('#piurl').blur(function(event) {
    	var title = $("#pititle").val();
    	var url = $('#piurl').val();
    	var originalurl = url;
    	// if there's an url but no title
        if ( (title == "")  && (url !== "")) {
        	var p;
        	// strip out http://
        	p = url.indexOf("http://");
        	if (p > -1){
        		url = url.substr(p + 7);
        	}
        	// strip out www
        	p = url.indexOf("www.");
        	if (p > -1){
        		url = url.substr(p + 4);
        	}
        	// if a title, remove all after first dot
        	p = url.indexOf(".");
        	if (p > -1){
        		url = url.substr(0,p);
        	}
        	// if new url is diff from original
        	if (url !== originalurl){
        		 $("#pititle").val(url);
        	}
        	
            return false;
        }
    });
    
    // insert today's date if field is empty
    $('#pidate').focus(function(event) {
    	if ( $('#piurl').val() == ""){
    		var ds = todaysDate();
    		$("#pidate").val(ds);
    	}
    });
    
    // --- show first letter of alphabet on scroll
    // https://stackoverflow.com/questions/17908542/how-to-hide-div-when-scrolling-down-and-then-show-it-as-you-scroll-up
	var mywindow = $(window);
	var mypos = mywindow.scrollTop();
	var up = false;
	var newscroll;

	mywindow.scroll(function () {
		newscroll = mywindow.scrollTop();
		// go through the rows to find the one currently at the top
		var letter = "", done = false, i = 0;
		while (!done){
			// "visible" plugin: https://github.com/customd/jquery-visible
			var title = $("#title" + i);
			if ( $(title).visible() == true){ 
				var currentTopRow = i;
				done = true;
				letter = $(title).text().substr(0,1).toUpperCase();
				$("#lettercontent").text(letter);
			}
			// 
			i++;
			if (i >= gData.length){
				done = true;
				letter = "?";
			}
		}
		$('#bigletter').slideDown();
		mypos = newscroll;
	});
	
	// hide letter block when scrolling stops
	// https://stackoverflow.com/questions/4620906/how-do-i-know-when-ive-stopped-scrolling-javascript
	var scrollpausetimer = null;
	$(window).scroll( function() {
		if(scrollpausetimer !== null) {
			clearTimeout(scrollpausetimer);        
		}
		scrollpausetimer = setTimeout(function() {
			  //alert("stopped");
			  $('#bigletter').slideUp();
		}, 150);
		}, false);
	
	
	
	
	
   timer = setTimeout(hideScreen, timeoutInterval); // autoCloseInterval);
 
 	// do a login, unless a global has been set. VERY INSECURE!!!
 	if (gLogin){
		$("#loginPanel").slideDown();
		$("#loginTextbox").focus();
	}
	getData();


    // hide details when clicking anywhere else
    $('#detailsdiv').blur(function(){
        $('#detailsdiv').fadeOut(300);
    });
  
      // get cookies
	var cook = getCookie("showpwd"); // show password column
	if ((!cook) || (cook == "hide")){
		setCookie("showpwd", "hide");
		$("#pwddisplaybtn").val("+Pwd");
		$("#pwdcolhd").css({"display" : "none"});
		$(".pwdcell").css({"display" : "none"});
	}
	else{
		setCookie("showpwd", "show");
		$("#pwddisplaybtn").val("-Pwd");
		$("#pwdcolhd").css({"display" : "table-cell"});
		$(".pwdcell").css({"display" : "table-cell"});
	}
    

     
}

//---------------- SET COOKIE
function setCookie(cookieName,cookieValue) {
	 var today = new Date();
	 var expire = new Date();
	 var nDays = 1700; // about 5 yrs
	 expire.setTime(today.getTime() + 3600000*24*nDays);
	 document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
}

//---------------- GET COOKIE
function getCookie(c_name)
{
	 var i,x,y,ARRcookies=document.cookie.split(";");
	 for (i=0;i<ARRcookies.length;i++)
	 {
	   x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	   y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	   x=x.replace(/^\s+|\s+$/g,"");
	   if (x==c_name)
		 {
		 return unescape(y);
		 }
	   }
}


//--------------- SHOW THE HIDE SCREEN    
function hideScreen(){
    $("#hidescreen").fadeIn();
}
   
//---------------- AUTOCOMPLETE SEARCHES
function dynasearch(){
    // dynamically searches for title.
    // get here whenever the search textarea changes
    var s = document.getElementById("searchtxt").value;
    // look through ttitle
    var i=-1, done=false, match = -1, utit="", sup;
    sup = s.toUpperCase();
    while (!done){
        i++;
        if (i < gData.length){
            utit = gData[i]["title"].toUpperCase();
            if (utit.indexOf(sup) == 0){
                done = true;
                match = i;
                
            }
        }
        else { done = true;} // searched them all
    }
    
    if (match > -1) {
       $("#searchcompletion").text(gData[match]["title"]);
        updateMiniInfo(match);
    }
}

//--------------- HIDE THE DETAILS FORM
function removeEntryForm(){
    $("#detailsdiv").fadeOut();
}

//-----------------UPDATE THE MINI-DETAILS FORM under the search box
function updateMiniInfo(i){
    // updates small info box for dynasearch
    
    $("#miniInfo").slideDown();
    $("#mintitle").text(gData[i]["title"]);
    $("#minuname").text(gData[i]["uname"]);
    $("#minpwd").text(gData[i]["pwd"]);
    $("#mincomment").text(gData[i]["comment"]);
    $("#minnote").text(gData[i]["note"]);
    $("#minurl").text(gData[i]["url"]);
    
    $("#miniInfo")

}

//----------------- SEARCH
function doSearch(){
    // go to search results
    var s = document.getElementById("searchcompletion").innerHTML;
    // strip out span info
    s = s.replace(/(<([^>]+)>)/ig,"");
    // get position in array
    var done = false, i = -1, match = -1;
        while (!done){
        i++;
        if (i < gData.length){
            if (gData[i]["title"].toUpperCase() == s.toUpperCase()){
                done = true;
                match = i;
            }
        }
        else { done = true;} // searched them all
    }
    
    if (match == -1){
        alert("Error searching for " + s + ". Quitting search.");
        return;
    }
    // got the match
    $("#miniInfo").slideUp();
    var rowid = "#row" + match; // the id of the table row
    scrollTo(rowid - 2);

    return
}

//--------------ANIMATED SCROLL
function scrollTo(el){
    // close mini info window
    $("#miniInfo").slideUp(300, function(){
    
    $('html, body').animate({
        scrollTop: $(el).offset().top
    }, 1000);
    })
}


//--------------- SHOW/ANIMATE DETAILS FORM  
function newEntry(){
	// Pop up the Details form, or
	// animate a fade in and out if it's already up
	// and user just clicked on a new entry
	$("#detailsdiv").fadeOut(300);     
	$("#detailsdiv").fadeIn();
}

//----------- CREATE NEW ENTRY FROM DETAILS FORM
function makeNewEntry(){
     
    // needs a title 
    if ( $("#pititle").val() =="") {
        notify("++ERROR: Needs title", "ERROR");
        return;
    }
    // does title already exist?
	if ( titleAlreadyExists($("#pititle").val()) ){
		notify("Title " + $("#pititle").val() + "already exists.", "ERROR");
		return;
	}

    //  add the record to the arrays
    // (Should not ever encode it. The encoding happens when the array is saved.)
    var rec = new Array();
    if (encodeIt == true){
        var url = encode( $("#piurl").val());
    }
    else{
        var url = $("#piurl").val();
    }
    if (encodeIt == true){
        var pwd = encode( $("#pipassword").val());
    }
    else{
        var pwd = $("#pipassword").val();
    }
    if (encodeIt == true){
        var uname = encode( $("#piname").val());
    }
    else{
        var uname = $("#piname").val();
    }
    if (encodeIt == true){
        var note = encode( $("#pinote").val());
    }
    else{
        var note = $("#pinote").val();
    }
    if (encodeIt == true){
        var comment = encode( $("#picomment").val());
    }
    else{
        var comment = $("#picomment").val();
    }
    if (encodeIt == true){
        var title = encode( $("#pititle").val());
    }
    else{
        var title = $("#pititle").val();
    }
    if (encodeIt == true){
        var date = encode( $("#pidate").val());
    }
    else{
        var date = $("#pidate").val();
    }
    var rec = { }// gets encoded when saved
	rec["title"] = title;
	rec["url"] = url;
	rec["pwd"] = pwd;
	rec["uname"] = uname;
	rec["comment"] = comment;
	rec["note"] = note;
	rec["date"] = date;
    
    gData.push(rec);
    
    savedata(); // save the whole thing
    
    gData.sort(sortTheJson);
    displayTheTable();

}

//----------- SHOW DETAILS
function revealinfo(e){
     // e = the title span
     // get the link from the row
     var span1 = e.parentElement;
     var row = span1.parentElement;
     var span = row.children[0].children[0].children[0];
     var linkspan = span;//$(span).children()[1];
     var link = $(linkspan).attr("id");
     link = link.substring(1);
    
    // flash an existing details box
    if ( $("#detailsdiv").is(":visible")){
        if  ( $("#pititle").val() !== ""){
            $("#pititle").val("").fadeOut(200).fadeIn(200);;
        }
        if  ( $("#piname").val() !== ""){
            $("#piname").val("").fadeOut(200).fadeIn(200);
        }
        if  ( $("#piurl").val() !== ""){
            $("#piurl").val("").fadeOut(200).fadeIn(200);
        }
        if  ( $("#picomment").val() !== ""){
            $("#picomment").val("").fadeOut(200).fadeIn(200);
        }
        if  ( $("#pipassword").val() !== ""){
            $("#pipassword").val("").fadeOut(200).fadeIn(200);
        }
        if  ( $("#pinote").val() !== ""){
            $("#pinote").val("").fadeOut(200).fadeIn(200);
        }
        if  ( $("#pidate").val() !== ""){
            $("#pidate").val("").fadeOut(200).fadeIn(200);
        }
    }
    
    // return all lines to original color
    $(".rowstyle").css({"backgroundColor" : "#F1F6FF", "color" : "black"});
    
    // highlight the one we clicked on 
    //var row = document.getElementById(link);
    $(row).parent().css({"backgroundColor" : "#2A50FF", "color" : "white"});
    
    // if e=="", then it's a new one,
    if (link != ""){
            var which=lookupentry(link);
            $("#pititle").val(gData[which]["title"]);
            $("#piname").val(gData[which]["uname"]);
            $("#piurl").val(gData[which]["url"]);
            $("#picomment").val(gData[which]["comment"]);
            $("#pipassword").val(gData[which]["pwd"]);
            $("#pinote").val(gData[which]["note"]);
            $("#pidate").val(gData[which].date);
            $("#detailsdiv").fadeIn();
    }
    else {
        e.style.backgroundColor='#FF0000';
        alert("Can't find " + link);
    
    }
    
     $('#pipassword').focus();

}

//------------FIND AN ENTRY IN THE GLOBAL ARRAY
function lookupentry(w){
    // from url get array number
    var ind=-1;
    for (i=0;i<gData.length;i++){
        if (gData[i]["url"]==w) {
            ind=i;
            break;
            }
    }
    return ind;
}

//--------------- CHANGE AN ENTRY IN THE DETAILS BOX
function modifyEntry(){
    // get url
    var nurl=document.getElementById('piurl').value;
    if (nurl==""){
        notify("Enter URL. No change is being recorded.", "ERROR");
        return
    }
    var wh=lookupentry(nurl);
    if (wh == -1) { // new url, so new entry
      makeNewEntry();
    }
    if (wh > -1){ // replacement data
       var resp=false;
      resp=confirm("Update entry?");
      if (resp==true){
          // update gData
        gData[wh]["title"] = $("#pititle").val();
        gData[wh]["url" ] = $("#piurl").val();
        gData[wh]["pwd"] = $("#pipassword").val();
        gData[wh]["comment"] = $("#picomment").val();
        gData[wh]["note"] = $("#pinote").val();
        gData[wh]["uname"] = $("#piname").val();
        gData[wh]["date"] = todaysDate();
          // display today's date
          $("#pidate").val(todaysDate());
          // update the row
          var row = document.getElementById("row" + wh);
          $("#title" + wh).text(gData[wh]["title"]);
          $("#name" + wh).text(gData[wh]["uname"]);
          $("#pwd" + wh).text(gData[wh]["url"]);
          $("#comment" + wh).text(gData[wh]["comment"]);
          $("#note" + wh).text(gData[wh]["note"]);
          // update the actual link
          var aspan = $("#u" + gData[wh]["url"]).children()[0];
          $(aspan).attr({"href" : gData[wh]["url" ]});
          
          
      }
    }
    
    displayTheTable(); // in order to resort it
    savedata();

}

//---------------- IMPORT FROM PRIOR SAVE FORMAT
function importOldFormat(){
    // open old text-based save file.
    // Shouldn't need this any more.
    
    $.ajax({
     type: "POST",
     url: "./php/pwd.dat",
     async: false,
     success: function(textver){
         // decode
         textver = decode(textver);
         // convert text records to JSON
         var done = false;
         var x=0,p1 = 0, p2 = -1, oldp = 0, line="", jsonstr = '{\n"ndata":[\n{\n', key="";
         var keys = new Array("uname","pwd","note","comment6","url","title");
         while (done == false){
             // get next line feed
             // skip over divider line
             p2 = textver.indexOf("\n", p1) ;
             if (p2 !== -1){
                line = textver.substr(p1, (p2 - p1) );
                p1 = p2 ;
                key = keys[x];
                if (x < 5){ // add comma unless last pair
                    jsonstr += '"' + key + '" : "' + line + '",\n';
                }
                else {
                    jsonstr += '"' + key + '" : "' + line + '"\n';
                }
                x = x + 1;
                if (x == 6){
                    // wrap it
                    jsonstr +=  "},\n{";
                    // skip over divider
                     p2 = textver.indexOf("\n", p1);
                     p1 = p2 + 1;
                    x = 0;
                }
            }
             else {
                 jsonstr +=  "}\n]}";
                 done = true;
             }
         }
         // finish wrap of entire json
         //jsonstr += jsonstr + "}";
         // write it out
         $.ajax({
        type: "POST",
            url: './php/saveConvertedText.php', 
            data: {jsontext :  jsonstr },
            success: function(listresult){
                notify("Converted data saved.", "");
            },
            error: function(e){
                notify("Error converting data:" + e.status, "ERROR");
            }
        });
         
     },
    error: function(e){
        notify("Error making backup: " + e.statusText, "ERROR") ;
    }
    })

    
}

//---------- SAVE 
function savedata(){
    // saves the data as json with "encrypted" entries
    
    // make bak file
    $.ajax({
     type: "POST",
     url: "./php/makebakfile.php",
     async: false,
     success: function savedatasuc(listresult){
         resp=listresult;
     },
    error: function(listresult){
        resp = "Error making backup";
    }
    });
    
	var jdata = gData.slice(); // copy gData
	// encode all of the entries
	for (var i = 0; i < jdata.length; i++){
		var et = encode(jdata[i]["title"]);
		jdata[i]["title"] = encode(jdata[i]["title"]);
		jdata[i]["uname"] = encode(jdata[i]["uname"]);
		jdata[i]["pwd"] = encode(jdata[i]["pwd"]);
		jdata[i]["comment"] = encode(jdata[i]["comment"]);
		jdata[i]["note"] = encode(jdata[i]["note"]);
		jdata[i]["url"] = encode(jdata[i]["url"]);
	}
	
	jdatastr = JSON.stringify(jdata);

	$.ajax({
	type: "POST",
		url: './php/savejson.php', 
		data: {thedata :  jdatastr },
		success:  function savedatasuc (listresult){
			notify("Data saved.", "");
			$("#detailsdiv").fadeOut(300); // fade it out
		},
		error: function(e){
			notify("Error saving data:" + e.status, "ERROR");
		}
	});
}

//-------------- SAVE DATA AS TEXT
function saveDataAsText(){
	// Opens a window showing the info as plain text
	// in case you want a plain text file of all your passwords.
	// If so, please hide the printout where no one will ever
	// find, such as in a folder marked "PORN", or "NOT MY PASSWORDS"
    
    var content ="<p><b>Passworx.</b> Records: " + (gData.length + 1) + ". Date: " + todaysDate() + "	</p>";
    var para = document.createElement("div");


    // define some window attributes
    var features = 'width=600, height=1000, status=1, menubar=1, location=0, left=100, top=100, title="Passworx Text"';
    var winName = 'New_Window';
    
    for (var i=0; i < gData.length; i++){
    	var r = gData[i];
    	var c = "<h2>" + r["title"] + "</h2><p>";
    	c += "user:" + r["uname"] + "<br>";
    	c += "pwd:" +r["pwd"] + "<br />";
    	c += "url:" +r["url"] + "<br />";
    	c += "comment:" +r["comment"] + "<br />";
    	c += "note:" +r["note"] + "</p>";
    	
    	content += c;
    }
    
    content += "</p>"

    // populate the html elements
    $(para).html(content);
   
    // define a reference to the new window
    // and open it with defined attributes
    var winRef = window.open('', winName, features);

    // append the html elements to the head
    // and body of the new window  
    winRef.document.body.appendChild(para);
    
}

//--------------- SCROLL DOWN TO LETTER
function gotoLetter(l){
    // Go through titles to find the first with letter l
    
    // get all rowstyle spans
    var spans = $(".titleclass");
    var done = false;
    var i=0;
    while (!done){
        var title = $(spans[i]).text();
        var firstchar = title.substr(0,1);
        if (l == firstchar.toUpperCase()){
            done = true;
            // get row number from title id (e.g. "title54")
            var titlecell = spans[i];
            var titlediv = $(titlecell).children()[0];
            var tid = $(titlediv).attr("id");
            var id = tid.substr(5);
            var rowid = "#" + "row" + id;
            //$(spans[i])[0].scrollIntoView( true );
            scrollTo(rowid);
        }
        i++;
        if ( i >= spans.length){
            done = true;
        }
    }
}

//----------- TOGGLE PWD DISPLAY
function togglePwd(){
	// toggle display of pwd in main window
	var label = $("#pwddisplaybtn").val();
	if (label == "-Pwd"){
		$("#pwddisplaybtn").val("+Pwd");
		$("#pwdcolhd").fadeOut();
		$(".pwdcell").fadeOut();
		setCookie("showpwd", "hide");
	}
	else {
		$("#pwddisplaybtn").val("-Pwd");
		$("#pwdcolhd").fadeIn();
		$(".pwdcell").fadeIn();
		setCookie("showpwd", "show");
	}
}

//--------------- MAIN DISPLAY   
function displayTheTable(){
    resetTimer();
    //gData = json.slice(); 

    // if the table exists, remove it
    $("#mainTable").remove();
    
    // Create table of info
    var tab = document.createElement("table");
    $(tab).attr({"id" : "mainTable", "class" : "displaytxt"});
    // attach tableheader
    var thead = document.createElement("thead");
    var theadrow = document.createElement("tr");
    $(thead).append(theadrow);
    var th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text(""); // delete btn will go here
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text("Title");
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text("User");
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead", "id" : "pwdcolhd"});
    $(th).css({"display" : "none"});
    $(th).text("Pwd");
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text("Comment");
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text("Note");
    $(theadrow).append(th);
    th = document.createElement("th");
    $(th).attr({"class" : "tblhead"});
    $(th).text("Date");
    $(theadrow).append(th);

    $(tab).append(theadrow);
    var tbody = document.createElement("tbody");
    $(tab).append(tbody);
    

    var numberOfEntries = gData.length;
    for (var i=0; i < numberOfEntries; i++){
        var entry = gData[i];
        var tr = document.createElement("tr");
        $(tr).attr({"class" : "wholerow", "id" : "row" + i});
        
        // delete link
        var td = document.createElement("td");
        var sp = document.createElement("span");
        var sp2 = document.createElement("span");
        $(sp2).attr({"class" : "delclass","id" : "d" + entry['url']});
        var u = entry['url'];
        $(sp2).click(function(){
            deleteentry(this);
        })
        $(sp2).text("del");
        // link 
        var sp3 = document.createElement("span");
        $(sp3).html("<a href='" + entry['url'] + "' target='_blank'>link</a>")
        $(sp3).attr({"class" : "linkclass","id" : "u" + u});
        // append del and link
        $(sp).append(sp2);
        $(sp).append(sp3);
        $(td).append(sp);
        $(tr).append(td);
        
        // title 
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle titleclass"});
        sp = document.createElement("span");
        $(sp).text(entry['title']);
        $(sp).attr({"id" : "title" + i, "class" :  "titleclass"});
        // click pops up details window
        $(td).click(function(){
            revealinfo($(this).children()[0]); // url as id
            });
        $(td).append(sp);
        $(tr).append(td);
        
        // username 
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle gridtext", "id" : "uname" + i});
        $(td).text(entry["uname"]);
        $(tr).append(td);
        
        // pwd
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle gridtext pwdcell", "id" : "pwd" + i});
        $(td).css({"display" : "none"});
        $(td).text(entry["pwd"]);
        $(tr).append(td);
        
        // comment 
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle gridtext", "id" : "comment" + i});
        $(td).text(entry["comment"]);
        $(tr).append(td);
        
        // note 
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle gridtext", "id" : "note" + i});
        $(td).text(entry["note"]);
        $(tr).append(td);
        
        // date 
        td = document.createElement("td");
        $(td).attr({"class" : "rowstyle gridtext datetext", "id" : "date" + i});
        $(td).text(entry["date"]);
        $(tr).append(td);
        
        $(tbody).append(tr);
        }

        pd=document.getElementById('pwddiv');
        $(pd).append(tab);
        
        // show the showhidebtn
        var btn = document.getElementById("showhidebtn");
        btn.style.visibility="visible";
        
        notify(gData.length + " passwords loaded.");
    
    }
    
//----------------------SHOW/HIDE THE TABLE
function showhide(){
    // show or hide the contents
    var pwds = document.getElementById("pwddiv");
    var btn = document.getElementById("showhidebtn");
    if (btn.value == "Hide"){
        btn.value = "Show";
        pwds.style.display="none";
        $(pwds).fadeOut(500);
        $("#detailsdiv").fadeOut(500);
        
    }
    else {
        btn.value = "Hide";
        $(pwds).fadeIn(500);
        $("#detailsdiv").fadeIn(500);
        
    } 
}

//------------------- PRESSED "NEW" BUTTON
function initNew(){
    // opens the details pane
    
    $("#pititle").val("");
    $("#piname").val("");
    $("#piurl").val("");
    $("#picomment").val("");
    $("#pipassword").val("");
    $("#pinote").val("");
    
   // create new date
    var ds = todaysDate();
    $("#pidate").val(ds);
    
    $("#detailsdiv").fadeIn();
}

//---------------- DOES THE TITLE EXIST?
function titleAlreadyExists(val){
	$.grep(gData, function(obj) {
      if (obj.id === val){
      	return true;
    	}
    else {
    	return false;
    }
    });
}

//--------------------- GET AND FORMAT TODAY'S DATE
function todaysDate(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month.length = 1) {month = "0" + month;}
    if (day.length = 1) {day = "0" + day;}
    var ds = year + "-" + month + "-" + day;
    return ds;
}

//--------------- SORTING FUNCTION FOR THE DATA
function sortTheJson(c,d){
    var a = c["title"].toUpperCase();
    var b = d["title"].toUpperCase();
    if (a < b)
    return -1;
  if (a > b)
    return 1;
  return 0;
}
    

//-------------- DECODE THE TEXT    
function decode(x){
     // reverse number pairs and substract 3
    //if (x=="") {return}
    if ( (x == "" ) || (x == null)){
    	return "";
    }
    var p,c,d,s=""; var i=-2; var secondn=false; var donne=false;
    var newd, newc, comment;
    var newx = new Array();
    if (x.length==0){
        donne=true;
        // alert("Empty pwd.dat");
    }
    while (!donne) {
        i=i + 2;
        if (i >= (x.length - 1)) {
            donne=true;
            // get the last, odd one if necessary
            if (i < x.length) {
                 c=x.charCodeAt(i);
                 newc=String.fromCharCode(c - 3);
                newx.push(newc);
                }
        }
       else {
             c=x.charCodeAt(i);
          d=x.charCodeAt(i + 1);
          newd=String.fromCharCode(d - 3);
          newc=String.fromCharCode(c - 3);
          newx.push(newd);
          newx.push(newc);
       }
     }//while
    // construct the string out of the database
    var news=""; 
    for(i=0;i<newx.length;i++){
        news=news+newx[i];
    }
    return news;
}    

//------------------- ENCODE THE TEXT
function encode(x){
     // reverse number pairs and add 3
    //if (x=="") {return}
    if ((x==null) || (x == "")) {
        return "";
    }
    var p,c,d,s=""; var i=-2; var secondn=false; var donne=false;
    var newd, newc, comment;
    var newx = new Array();
    if (x.length==0){
        donne=true;
        // alert("Empty pwd.dat");
    }
    while (!donne) {
        i=i + 2;
        if (i >= (x.length - 1)) {
            donne=true;
            // get the last, odd one if necessary
            if (i < x.length) {
                 c=x.charCodeAt(i);
                 newc=String.fromCharCode(c + 3);
                newx.push(newc);
                }
        }
       else {
             c=x.charCodeAt(i);
          d=x.charCodeAt(i + 1);
          newd=String.fromCharCode(d + 3);
          newc=String.fromCharCode(c + 3);
          newx.push(newd);
          newx.push(newc);
       }
     }//while
    // construct the string out of the database
    var news=""; 
    for(i=0;i<newx.length;i++){
        news=news+newx[i];
    }
    return news;
}

//-------------------- DELETE AN ENTRY
function deleteentry(e){
    // e = id of del = d + url of entry 
    var u = $(e).attr("id");
    var url = u.substr(1);
    var n=lookupentry(url);
    var resp=confirm("Delete entry titled: " + gData[n]["title"] + "?");
    if (resp==true){
        gData.splice(n,1);
        $("#row" + n).slideUp(function (){
            $("#row" + n).remove();
            });
    //redisplay
    displayTheTable(gData);
    notify(gData[n]["title"] + " removed.");
    savedata();
    }
    return
}

//--------------- READ DATA FILE AND BUILD GLOBAL ARRAY
function getData(){

    //return
    var resp='';
    var listresult;
 //alert('ion getdata');
 	var decodeIt = true; // in case we want to open plain text version of data file

$.ajax({
  type: "POST",
  url: "./data/pwd.json",
  async: false,
  dataType: "text",
 //  contentType: 'application/json; charset=utf-8',
  success: function getDataSuc(resp) {
  		gData.length = 0;
  		if (decodeIt == true){
  			gData = JSON.parse(resp);
  			for (var i = 0; i < gData.length; i++){
				gData[i]["title"] = decode(gData[i]["title"]);
				gData[i]["uname"] = decode(gData[i]["uname"]);
				gData[i]["pwd"] = decode(gData[i]["pwd"]);
				gData[i]["comment"] = decode(gData[i]["comment"]);
				gData[i]["note"] = decode(gData[i]["note"]);
				gData[i]["url"] = decode(gData[i]["url"]);
			}
        }
        else {
        	//resp = JSON.parse(resp);
        	gData = JSON.parse(resp);
  		}
       
        gData.sort(sortTheJson);
        displayTheTable();
  },
 error: function(e){
     if (e.status == "200"){
        gDataRaw=e; 
        gData = JSON.parse(e);    
     }
     else{
         notify('Error reading pwd.json: ' + e.status, "ERROR");
     }
     }
})

  return gData;

}

//------------- RESET THE TIMEOUT TIMER
function resetTimer(){
    // all variables are globals
    // close the timeout interval
    clearInterval(gtimer);
    // restart it
    gtimer = setTimeout(hideScreen, timeoutInterval);}

function exportToCSV(){

    var html = "<html><head><title>Passworx data</title></head><body><pre>";
    
    var rows = $(".titleclass");
    var i,url,url2,title2,uname2,pwd2,comment2,date2,j,csvrow;
    for (i=0; i < rows.length; i++){
        // get url
        var childs = $(rows[i]).children();
        urldiv = childs[0];
        url = $(urldiv).attr("id");
        j = lookupentry(url);
        // get the data
    
        title2 = ttitle[j];
        uname2 = uname[j];
        date2= ddate[j];
        comment2 = comment[j];
        pwd2 = pwd[j];
        comment3 = note[j];
        
        csvrow = '"' + url +  '",';
        csvrow += '"' + title2 +  '",';
        csvrow += '"' + pwd2 +  '",';
        csvrow += '"' + uname2 +  '",';
        csvrow += '"' + comment2 +  '",';
        csvrow += '"' + comment3 +  '",';
        csvrow += '"' + date2 +  '",'+ "\n";

        html += csvrow;
    
      }
      
      html += "</pre></body></html>";
      var win = window.open("", "CSV", "toolbar=yes,location=no,directories=no,status=no,menubar=yes,scrollbars=yes,resizable=yes,width=780,height=600,top="+(screen.height-100)+",left="+(screen.width-840));
win.document.body.innerHTML = html;
}

function notify(s, status){

    
     if (status == "ERROR"){
        $("#banner").addClass("bannererror");
        var howlong = errorBannerTime;
    }
    else {
        $("#banner").removeClass("bannererror");
        howlong = bannerTime;
    }
    
        // if it's already up, add the message
    if ($("#banner").is(":visible") == true){
        S = $("#banner").text() + "<br>" + s;
    }
    
    
    $("#banner").text(s);
    $("#banner").slideDown().delay(howlong).slideUp();
  
    
}

//------------------ SHOW THE LOGIN FORM
function splashscreen(){
	
     	
    var p = $("#loginTextbox").val();
    if (p != entrypassword) {
        $("#outerdiv").html("<h1>Wrong password. Go away.</h1>");
        return;
    }
    else {
        $("#loginPanel").slideUp(300);
     	gData=getData();
    }
   
    
}
    