// Globals ///////////////////
//ep: I created a ProductFAmily class to hold messages, and text names
//product families, held by radio buttons
var FAMILY_TRUCK_AND_AUTO = 1;
var FAMILY_CE_WINCHES = 2;
var FAMILY_INDUSTRIAL = 3;
var FAMILY_POWERSPORTS = 4;
var FAMILY_WORKS = 5; //is Utility in partners
var FAMILY_COBRANDED_OE = 6;

function ProductFamily (key, name, snNeeded, message){
	this.key = key;
	this.name = name;
	this.message = message;
	this.serialNumberNeeded = snNeeded;
}
var myProductFamilies = {};

myProductFamilies[FAMILY_TRUCK_AND_AUTO] = new ProductFamily( FAMILY_TRUCK_AND_AUTO, "Truck and Auto", true,
		"<b>Truck and Auto Winches</b><br>"
		+ "You'll need to locate the serial number for your winch. " 
		+ "On planetary gear models the serial number can be found on the gear end housing. "
		+ "On upright spur gear models (M8274) look on the top of the winch housing.<br>"
);

//ep: orphan family, no longer used I think: "<b>CE Self-Recovery Winches</b><br>You'll need to locate the serial number for your winch. On planetary gear models the serial number can be found on the gear end housing. On upright spur gear models (M8274) look on the top of the winch housing.<br>";

myProductFamilies[FAMILY_INDUSTRIAL] = new ProductFamily(FAMILY_INDUSTRIAL, "Industrial Winches", true,	"<b>Industrial Winches</b>" 
		+ "<br>You'll need to locate the serial number for your winch. The serial number can be found on the gear end housing.<br>"
);

myProductFamilies[FAMILY_POWERSPORTS] = new ProductFamily( FAMILY_POWERSPORTS, "Powersports", false, "<b>Powersport Winches</b><br>");

myProductFamilies[FAMILY_WORKS] = new ProductFamily(FAMILY_WORKS, "Works", false, "<b>WARN Works</b><br>");

myProductFamilies[FAMILY_COBRANDED_OE] = new ProductFamily(FAMILY_COBRANDED_OE, "Co-branded/OE", false, "<b>Co-branded/OE</b><br>");

function getSelectedFamily(){
    var familyKey = $("input[name=family]:checked").val();
    return myProductFamilies[familyKey];
}


var partsURL = "/wwwapps/store/PartsFinder?"; //was service_parts_support.jsp?', I changed to servlet;

//////////////// END Globals ///////////////////
function changeFamily(){
	
    clearDocsLinks();
    
	resetModelNumber();

	//this will be reshown once model number is selected
	resetPartNumber();
    
	//if serial number is required, these will be turned on later when the partnumber is selected
	resetSerialNumber();

	//set info for this family
    var thisFamily = getSelectedFamily();
    
	console.log("changeFamily() called, familyKey: " + thisFamily.key + " which means: " + thisFamily.name);

	$("#familyMessage").html(thisFamily.message);	
	
    var thisURL = partsURL + "family=" + thisFamily.key;
    thisURL += "&field=model";
    
    $.ajax({
        url: thisURL,
        success: function(data) {
    		loadFieldIntoDropdown($("#modelDropdown"), data);
    		$("#modelDropdownRow").show();
        }
    });
	
}


function changeModel(){
	//model selector changed
	clearDocsLinks();
	resetPartNumber();
	resetSerialNumber();            
	
	//-1 means "Please Select" was selected, meaning just clear the parts and serial numbers selectors, no ajax gets called
	if( $("#modelDropdown").val() != -1){
		
		var thisFamily = getSelectedFamily();
		
	    var thisURL = partsURL + "family=" + thisFamily.key;
	    thisURL += "&model=" + $("#modelDropdown").val();
        thisURL += "&field=part_number";
        
        $.ajax({
            url: thisURL,
            success: function(data) {
        		loadFieldIntoDropdown($("#partNumberDropdown"), data);
        		$("#partNumberDropdownRow").show();
            }
        });
	}
	
}

function changePartNumber(){

	clearDocsLinks();
	resetSerialNumber();            
	
	//-1 means "Please Select" was selected
	if( $("#partNumberDropdown").val() != -1){
		
		var thisFamily = getSelectedFamily();
		
	    var thisURL = partsURL + "family=" + thisFamily.key;
	    thisURL += "&model=" + $("#modelDropdown").val();
	    thisURL += "&part_number=" + $("#partNumberDropdown").val();

        var partFinderAjax2 = new XMLHttpRequest();

        if(thisFamily.serialNumberNeeded){
        	
        	thisURL += "&field=serial_number";
            $.ajax({
                url: thisURL,
                success: function(data) {
            		loadFieldIntoDropdown($("#serialNumberDropdown"), data);
            		$("#serialNumberDropdownRow").show();
                }
            });
            
        }else{ 
        	
        	thisURL += "&field=linksnosn";
            $.ajax({
                url: thisURL,
                success: function(data) {
            		$("#docLinks").html(data);
            		$("#docLinksRow").show();
                }
            });
        }
        

	}
}

function changeSerialNumber(){
	clearDocsLinks();
	
	//-1 means "Please Select" was selected
	if( $("#serialNumberDropdown").val() != -1){
		
		//this url does not need family, model and partnumbers 
		var thisURL = partsURL + "field=links&id=" + $("#serialNumberDropdown").val();

        $.ajax({
            url: thisURL,
            success: function(data) {
        		$("#docLinks").html(data);
        		$("#docLinksRow").show();
            }
        });
        
	}
}

function clearDocsLinks(){
    $("#docLinksRow").hide();
}

function resetModelNumber(){
	resetDropdownGroup($("#modelDropdownRow"), $("#modelDropdown"), "Select Model");
}

function resetPartNumber(){
	resetDropdownGroup($("#partNumberDropdownRow"), $("#partNumberDropdown"), "Select Part Number");
}

function resetSerialNumber(){
	resetDropdownGroup($("#serialNumberDropdownRow"), $("#serialNumberDropdown"), "Select Serial Number");
}

function resetDropdownGroup( elementRow, theDropdown, selectDefaultText){
	elementRow.hide();
	resetDropdown(theDropdown, selectDefaultText);
}

function resetDropdown(dropDown, defaultText){
	dropDown.empty();
	dropDown.append('<option value="-1" selected>' + defaultText + '</option>');
}

function loadFieldIntoDropdown(thisDropdown, txt) {
	//text comes back ! delimited, then comma delimited
	var tl = trim(txt).split("!");
	for (var x = 0; x < tl.length; x++) {
		var l = tl[x].split(",");
		addItemToDropdown(thisDropdown, l[0], l[1]);
	}
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g, "");
}

function addItemToDropdown(dropDown, key, value) {

	var thisOption = $("<option></option>");
	thisOption.attr("value", key);
	thisOption.text(value);
	dropDown.append(thisOption); 
}

window.onload = function() {
	//this simulates a radio button being selected to kick off the model selector
	changeFamily();

};