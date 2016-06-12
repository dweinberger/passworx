// forgive me
// david weinberger
// david@weinberger.org
// issued under an MIT license. 

	// uname pwd pwdcomment comment1 url ttitle ddate
	var uname = new Array();
	var pwd = new Array();
	var pwdcomment = new Array();
	var comment1 = new Array();
	var url = new Array();
	var ttitle = new Array();
	var ddate = new Array();
	var CodeString = "JCYARBFEHXGLMKOIPNDSQVZTUW9802137465abcdefghijklmnopqrstuvwxyz";
    var DeCodeString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789nucfvdihmlkztgbrqpaosxweyj";
	
var entrypassword = "CREATEPWD"; // create a password for entering the app	
   
function init(){

	// reset arrays
	url.length=0;uname.length=0;pwd.length=0;ttitle.length=0;pwdcomment.length=0;comment1.length=0;ddate.length=0;
	var dat=getData(); // read the file
	var d=dat; var done=false; var lend;	
	// process the file
	var i,l,j;
	
	// realbasic version: 
	
	var a = new Array()
	a = dat.split("\r");
	
	var r = new Array();
	
	for (i=0; i < a.length; i++) {
		// go through 7 lines
		
		j = (i % 7);
			if (j == 0) {
				uname.push(decode(a[i]));
			}
			if (j == 1) {
				pwd.push(decode(a[i]));
			}
			if (j == 2) {
				pwdcomment.push(decode(a[i]));
			}
			if (j == 3) {
				comment1.push(decode(a[i]));
			}
			if (j == 4) {
				url.push(decode(a[i]));
			}
			if (j == 5) {
				ttitle.push(decode(a[i]));
			}
			if (j == 6) {
			//ddate.push(l);
			}
		
		window.status = "Loading record #" + parseInt(i);
	}

	window.status = "Loaded " + parseInt(i) + " records. Done.";

	sortthelist2();
	window.status = "Sorted " + parseInt(i) + " records.";
	displayPwds();
	}
	
function dynasearch(){
	// dynamically searches for label
	// get here when the textarea changes
	var s = document.getElementById("searchtxt").value;
	// look through ttitle
	var i=-1, done=false, match = -1, utit="", sup;
    sup = s.toUpperCase();
	while (!done){
		i++;
		if (i < ttitle.length){
            utit = ttitle[i].toUpperCase();
			if (utit.indexOf(sup) == 0){
				done = true;
				match = i;
			}
		}
		else { done = true;} // searched them all
	}
	
	if (match > -1) {
       //document.getElementById("searchcompletion").innerHTML = ttitle[match];
		document.getElementById("searchcompletion").innerHTML="<span onclick='revealsnapshot(\"" + ttitle[match] + "\")'>" + ttitle[match] + "</span>";
	}
}

function revealsnapshot(which){
  // which = title
  // look up index of title
  var i  = 0;
  var mtch = -1;
  var done = false;
  var sort="[not found]";
  while (!done) {
   if (which == ttitle[i]){
     s = ttitle[i] + "\nuser: " + uname[i] + "\npwd: " + pwd[i] + "\nurl: " + url[i] + "\ncomment: " + comment1[i]; 
     done = true;
    }
    else {
    i++;
    if (i == ttitle.length) {
      done = true;
      }
    }
   } 
  alert(s);   

}

function doSearch(){
	// go to search results
	var s = document.getElementById("searchcompletion").innerHTML;
    // strip out span info
    s = s.replace(/(<([^>]+)>)/ig,"");
	// get position in array
	var done = false, i = -1, match = -1;
		while (!done){
		i++;
		if (i < ttitle.length){
			if (ttitle[i].toUpperCase() == s.toUpperCase()){
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
	var uid = "#" + url[match]; // the id of the table row
	//var elud = document.getElementById(uid);
	document.location = uid;
	return
}
	
function getLine(s){
	var ln=-1;
	ln=s.indexOf('\r');
	return ln
	}

function revealinfo(e){
	 // uses url as id
	//alert(t);
	// get the box next to the span you just clicked on
	//    that first col span id is e preceded by d,
	
	// if e=="", then it's a new one,
	if (e != ""){
			var el=document.getElementById('d'+e); 
	}
	else var el=document.getElementById('newdiv');
	
	// highlight the row, if not a new request
	if (e != "") {
	r=document.getElementById(e);
	r1=r.parentNode;
	r2=r1.parentNode;
	r2.style.backgroundColor='#FF0000';
	r2.style.color='WHITE';
	//r.style.backgroundColor='';	
	}
	else {
		el.style.backgroundColor='#FF0000';
	}
	
	// create element for displaying and upating the info
	// [so primitive. embarrassing.]
	
		var ss="<div id='pwxinfo'   style='background-color:#0000C00;'>";
		ss+="<form id='passworxinfo' name='passwordinfo'><table>";
		ss+="<tr><td width=50px><p class='infostyle'>Title: </td><td><textarea id='pititle' class='infotxt'></textarea></td></tr>";
		ss+="<tr><td>Name: </td><td><textarea id='piname'  class='infotxt' rows=\"1\" cols=\"2\"'></textarea></td></tr>";
		ss+="<tr><td>Pwd: </td><td><textarea id='pipassword' class='infotxt'></textarea></td></tr>";
		ss+="<tr><td>Link: </td><td><textarea id='piurl' class='infotxtu'></textarea></td></tr>";
		ss+="<tr><td>Date: </td><td><textarea id='pidate'  class='infotxt'></textarea></td></tr>";
		ss+="<tr><td>Comment: </td><td><textarea id='picomment'  class='infotxt'></textarea></td></tr>";
		ss+="<tr><td><input id='closebutton' type=button value='Cancel' onclick='removeEntryForm();'></td>";
		ss+="<td><input id='applybutton' type=button value='Apply' onclick='applyChanges()'></td></tr>";
		ss+="</table></form>";
		ss+="</div>";
	
	// insert text into new element
	el.innerHTML=ss;
	
	if (e != ""){
	var which=lookupentry(e);
	document.getElementById('pititle').value=ttitle[i];
	document.getElementById('piname').value=uname[i];
	document.getElementById('pipassword').value=pwd[i];
	document.getElementById('piurl').value=url[i];
	document.getElementById('picomment').value=comment1[i];
	if (ddate[i]==""){ // add today;s date if none
		var d= new Date();
	    var ds=d.toDateString();
		ddate[i]-ds;
		}
	document.getElementById('pidate').value=ddate[i];
	return
	var el=document.getElementById("testdiv");
	var elchild=el.childNodes[e];
	var newdiv=document.createElement("H1");
	newdiv.innerHTML="<h1>NEW H1</h1>";
	el.insertBefore(newdiv,elchild);
	}
	
	var pe=document.getElementById('pipassword');
	pe.focus();
	pe.selectionStart=0;
	//document.getElementById('pwxinfo').style.display='block';
}

function lookupentry(w){
	// from url get array number
	var ind=-1;
	for (i=0;i<url.length;i++){
		if (url[i]==w) {
			ind=i;
			break;
			}
	}
	return ind;
}

function applyChanges(){
	// get url
	var nurl=document.getElementById('piurl').value;
	if (nurl==""){
		alert("Enter URL. No change is being recorded.");
		return
	}
	var wh=lookupentry(nurl);
	if (wh == -1) { // new url, so new entry
	  var resp=false;
	  resp=confirm("Create new entry?");
	  if (resp==true){
	  	url.push(document.getElementById('piurl').value);
	  	ttitle.push(document.getElementById('pititle').value);
	  	uname.push(document.getElementById('piname').value);
	  	ddate.push(document.getElementById('pidate').value);
	  	comment1.push(document.getElementById('picomment').value);
	  	pwd.push(document.getElementById('pititle').value);
		pwdcomment.push("");
      }
	}
	if (wh > -1){ // replacement data
	   //url[i]=document.getElementById('piurl').value;
	   ttitle[i]=document.getElementById('pititle').value;
	   uname[i]=document.getElementById('pititle').value;
	   pwd[i]=document.getElementById('pititle').value;
	   ddate[i]=document.getElementById('pidate').value;
	   comment1[i]=document.getElementById('picomment').value;
	  }
	

	
	removeEntryForm();
	displayPwds();
	
		// write it out
	savedata();

}

function savedata(){
	var thedata="", resp, listresult;
	
	// display status
	window.status = "Making backup.";
	
	// make bak file
	$.ajax({
     type: "POST",
     url: "makebakfile.php",
     async: false,
	 success: function(listresult){
 	    resp=listresult;
     },
    error: function(listresult){
		resp = "Error making backup";
	}
    })
	
	// did it succeed? If so, delete old pwd.data
	if (resp.indexOf("PWD.DAT saved to") > -1) {
		$.ajax({
     	type: "POST",
    	 url: "deletesaveddata.php",
     	async: false
    	})
		window.status = "Backup succeeded";
	}
	else {
		alert("Error making back up. Aborting save.");
		return;
	}
	 var configfile="";
	var enc = "";
	// Loop through the array, writing each line separately
	// uname,pwd,pwdcomment,comment,url,title,number

	for (i = 0; i < url.length; i++) {
		thedata = "";
		thedata = encode(uname[i]) + "\n" + encode(pwd[i]) + "\n" + encode(pwdcomment[i]) + "\n";
		thedata += encode(comment1[i]) + "\n" + encode(url[i]) + "\n" + encode(ttitle[i]) + "\n";
		thedata += "---- " + parseInt(i + 1) + " -------";
		
	
		if (i != (url.length - 1)) {
			thedata = thedata + "\n";
		} // add LF except for last one
		//thedata = encodeURIComponent(thedata);
		
		//return	
		if (1 == 1) {
		
			$.post('savepassworxdata.php', {
				arecord: thedata,
				async: false,
				success: function(listresult){
					configfile = listresult;
				},
				error: function(){
					configfile = 'Error writing pwd.dat at ' + thedata;
				}
			})
			
			
			
			
			window.status = "Saved record #" + parseInt(i);
		}
		
		
	}
	//<a href="#" title="Simple form" onclick="Modalbox.show(this.href, {title: this.title, width: 600}); return false;>"> Saved + parseInt(i + 1) records</a>
	window.status = "Saved " + parseInt(i + 1) + " records. Finished saving.";
	
}


function removeEntryForm(){
	// removes the pwd entry form created ex nihilo
	// ch = cell with revealed info
var ch=document.getElementById('pwxinfo');
ch.innerHTML="";
	// restore color of cells
   //var r=document.getElementById('d'+url[wh]);
	  var r1=ch.parentNode;
	  var r2=r1.parentNode;
	  var r3=r2.parentNode;
	r3.style.backgroundColor='#DDDDCC';
	r3.style.color='#000000';
//var par=ch.parentNode;
///ch.removeNode(false);
}

function displayPwds(){
	

	// Create table of info
	var s="<table class='displaytxt'  width=90% cellspacing=5 bgcolor=#CCCCCC><tr style='background-color: #DDDDCC; text-align: center;' ><td></td><td>Title</td><td>Usr</td><td><URL</td><td>Comment</td></tr>";
	for (var i=0; i < url.length; i++){
		//s+="<tr><td><span id='d"+url[i]+"'><input type='button' onclick='deleteentry(\""+url[i]+"\")' value='x'></span></td>";
		s+="<tr><td><span id='d"+url[i]+"'><span onclick='deleteentry(\""+url[i]+"\")' class='tinytext'> del</span></span></td>";
		s+="<td class='rowstyle'><span id='"+url[i]+"' onclick='revealinfo(" + "\""+ url[i]+ "\"" + ",this)'>";
		s+="<a name='" + url[i] + "'></a>";
		s+= "+" + ttitle[i] + "</span></td><td class='rowstyle'>"+uname[i]+"</td><td class='rowstyle'><a href=\'";
		s+=url[i]+"/'>link</a></td><td class='rowstyle'>" +comment1[i] +"</td></tr>";
		
		}
		s=s+"</table>";
		pd=document.getElementById('pwddiv');
		pd.innerHTML=s;
		//alert(s);
		
		// show the showhidebtn
		var btn = document.getElementById("showhidebtn");
		btn.style.visibility="visible";
	
	}
	
function showhide(){
	// show or hide the contents
	var pwds = document.getElementById("pwddiv");
	var btn = document.getElementById("showhidebtn");
	if (btn.value == "Hide"){
		btn.value = "Show";
		pwds.style.display="none";
	}
	else {
		btn.value = "Hide";
		pwds.style.display="block";
	}
	
	
}
	
function sortthelist2(){
		var temparray = new Array(url.length + 1);
		// populate temp with a number at the end indicating the original position
		for (var i=0; i<url.length; i++){
			temparray[i]=ttitle[i]+"#"+i + "";
		}
		//alert(temparray[1]);
		// sort the temp
		temparray.sort(insensitivesort);
		// go through sorted temp. original number is encoded in the name after #
   	for (i=0; i < url.length; i++){
		//var s=parseInt(i) + " : " + uname[i] + " : " + ttitle[i]  + " : " + pwd[i]  + " : " + url[i]
		var s=temparray[i];
		//alert(s);
	}	

		// retrieve original listing and sort that way
		// create temp listings
		var unamet = new Array();
		var pwdt = new Array();
		var urlt = new Array();
		var comment1t = new Array();
		var ttitlet = new Array();
		var ddatet = new Array();
		var pwdcommentt = new Array();
		for (i=0;i<url.length;i++){
		unamet[i]=uname[i];
		pwdt[i]=pwd[i];
		urlt[i]=url[i];
		comment1t[i]=comment1[i];
		ttitlet[i]=ttitle[i];
		ddatet[i]=ddate[i];
		pwdcommentt[i]=pwdcomment[i];
		}
		
		var ss,sn;
		// 
		for (i=0; i<url.length; i++){
		   	ss=temparray[i].substr(temparray[i].lastIndexOf("#") + 1);
			sn=parseInt(ss);
			url[i]=urlt[sn];	
			uname[i]=unamet[sn];
			pwd[i]=pwdt[sn];
			comment1[i]=comment1t[sn];
			pwdcomment[i]=pwdcommentt[sn];
			ttitle[i]=ttitlet[sn];
			ddate[i]=ddatet[sn];
			
		}
		
		// debug
		//alert("uname0=" + uname[0] + " pwd0 =" + pwd[0]);
}
	
function sortthelist(){
	var temparray = new Array(url.length + 1);
	// make it two dimensional
	for (i=0; i<url.length;i++){
		temparray[i]=new Array(7);
		// uname pwd pwdcomment comment1 url ttitle ddate
		temparray[i][0]=uname[i];
		temparray[i][1]=pwd[i];
		temparray[i][2]=pwdcomment[i];
		temparray[i][3]=comment1[i];
		temparray[i][4]=url[i];
		temparray[i][5]=ttitle[i];
		temparray[i][6]=ddate[i];
	}
	// sort it
temparray.sort(insensitivesort);
// put it back into original arrays
for (i=0; i<url.length;i++){
	uname[i]=temparray[i][0];
	pwd[i]=temparray[i][1];
	pwdcomment[i]=temparray[i][2];
	comment1[i]=temparray[i][3];
	url[i]=temparray[i][4];
	ttitle[i]=temparray[i][5];
	ddate[i]=temparray[i][6];
}	
	// debug
		alert("uname0=" + uname[0] + " pwd0 =" + pwd[0]);
	
}

function insensitivesort(a,b){
  var anew = a.toLowerCase();
  var bnew = b.toLowerCase();
  if (anew < bnew) return -1;
  if (anew > bnew) return 1;
  return 0;
}
	
function decode(x){
     // reverse number pairs and substract 3
	//if (x=="") {return}
	var p,c,d,s=""; var i=-2; var secondn=false; var donne=false;
	var newd, newc, comment1;
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

function encode(x){
     // reverse number pairs and add 3
	//if (x=="") {return}
	if ((x==null) || (x == "")) {
		return "";
	}
	var p,c,d,s=""; var i=-2; var secondn=false; var donne=false;
	var newd, newc, comment1;
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


function deleteentry(e){
	// e = url of entry
	var n=lookupentry(e);
	var resp=confirm("Delete entry titled: "+ttitle[n]+"?");
	if (resp==true){
	url.splice(n,1);
	uname.splice(n,1);
	pwd.splice(n,1);
	pwdcomment.splice(n,1);
	comment1.splice(n,1);
	pwdcomment.splice(n,1);
	ttitle.splice(n,1);
	ddate.splice(n,1);
	//redisplay
	displayPwds();
	savedata();
	}
	return
	
}

function trimquotes(ss){
	var c = ss.substring(0,1);
	if (c=='"'){
		ss=ss.substring(1);
	}
	c = ss.substr(ss.length - 1,1);
	if (c=='"'){
		ss=ss.substring(0,ss.length - 1);
	}
	return ss
}

function removeLfs(w){
   var s1 = RegExp("\r", "g");
       w = w.replace(s1, "SLASHR");
	   s1 = RegExp("\n", "g");
       w = w.replace(s1, "NNNNER");
    return w;
}

function getData(){

	//return
	var resp='';
	var listresult;
 //alert('ion getdata');

$.ajax({
  type: "POST",
  url: "pwd.dat",
  async: false,
  success: function(listresult) {
 	  resp=listresult;
  },
 error: function(){alert('Error reading pwd.dat');}
})

  	//  alert(resp);
  return resp;

}

function splashscreen(){
	var p = prompt("Password:","");
	if (p != entrypassword) {
		document.getElementById("outerdiv").innerHTML = "<h2>Wrong password. Go away.</h2>";
		return
	}
	else {
		init();
	}
	//var resp=window.prompt("Enter password:");
	
}
	
