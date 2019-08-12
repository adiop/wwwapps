//TODO: rewrite endpoint to Jersey JSON, get patents as JSON, no HTML in them
function searchClicked() {
    
	var d = new Date();
    
	$.get(
    	"/wwwapps/PatentSearch", 
   		{ 
   			patentNumber: $("#patent_number").val(), 
   			itemNumber: $("#item_number").val(), 
   			ts: d.getTime() 
   		},
   		function (data) {
			if ($.trim(data).length > 0) {
				$("#searchResults").html(data);
            } else {
                $("#searchResults").html("No results found.");
			}
		}
    );
	
}

$(document).ready(function() {
	searchClicked();
});
    
