# jq_formvalue
JQuery form reader and writer . 

reading form data in the page and can write data to form .

how to use:

 $(formSelector).formValues({

 		action : "read" or "write" . what to do on form
		data :   data to be write in form in jsonString  or jquery.SerializeArray

		beforeWriteCallback : function(formJqObject){} . callback before write on form
		afterWriteCallback : function(formJqObject){} . callback before write on form

		beforeReadCallback : function(formJqObject){} .
		afterReadCallback : function(formJqObject){}
 });
