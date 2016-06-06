/**
 * how to use:
 * $(formSelector).formValues({
 *
 * 		action : "read" or "write" . what to do on form
 * 		data : jsonString  or jquery.SerializeArray . data to be write in form.
 *
 * 		beforeWriteCallback : function(){} . callback before write on form
 * 		afterWriteCallback : function(){} . callback before write on form
 *
 * 		beforeReadCallback : function(){} .
 * 		afterReadCallback : function(){}
 * });
 */
;(function($){
        $.fn.extend({
            formValues: function(options) {

                //Set the default values, use comma to separate the settings, example:
                var defaults = {
                    action: "read",
					data:{},

					beforeWriteCallback : function(){},
					afterWriteCallback : function(){},

					beforeReadCallback : function(){},
					afterReadCallback : function(){},
                }

                var options = $.extend(defaults, options);

			function readForm(form){
				return $(form).serializeArray();


				//########## just witout jquery serializer
				// var data=new Object();

				// $("input",form).each(function(index,item){
				// 		var field=$(item);
				// 		var fieldName=field.attr("name");
				// 		var fieldType=field.attr("type");
				// 		var fieldValue=field.val();

				// 		switch(fieldType){
				// 			case "text":
				// 			case "password":
				// 				data[fieldName]=fieldValue;
				// 			break;

				// 			case "radio":
				// 				if($(field).is(":checked"))
				// 					data[fieldName]=fieldValue;
				// 		    break;

				// 			case "checkbox":
				// 					if(typeof data[fieldName] =="undefined" || typeof data[fieldName]!="array")
				// 						data[fieldName]=new Array();
				// 					if($(field).is(":checked") || $(field).is("[checked]"))
				// 						data[fieldName].push(fieldValue);
				// 			break;
				// 		}

				// 	});

				// 	$("select",form).each(function(index,item){
				// 		var field=$(item);
				// 		var fieldName=field.attr("name");
				// 		var fieldType=field.attr("type");
				// 		var fieldValue=field.val();
				// 		if($(field).is("multiple") || $(field).is("[multiple]")){
				// 			$("option",field).each(function(i,option){
				// 				if(typeof data[fieldName] =="undefined" || typeof data[fieldName]!="array")
				// 					data[fieldName]=new Array();
				// 				if($(field).is(":selected") || $(field).is("[selected]"))
				// 					data[fieldName].push(fieldValue);
				// 			});
				// 		}else{
				// 			$("option",field).each(function(i,option){
				// 				if($(field).is(":selected") || $(field).is("[selected]"))
				// 					data[fieldName]=fieldValue;
				// 			});
				// 		}
				// 	});

				// 	$("textarea",form).each(function(index,item){
				// 		var field=$(item);
				// 		var fieldName=field.attr("name");
				// 		var fieldValue=field.val();
				// 		data[fieldName]=fieldValue;
				// 	});

				// 	return data;
			}

			function writeForm(form,jsonData){

				  $("input",form).each(function(index,item){
						var field=$(item);
						var fieldName=field.attr("name");
						var fieldType=field.attr("type");
						var fieldValue=field.val();

						switch(fieldType){
							case "hidden":
							case "text":
								if(typeof jsonData[fieldName]!="undefined")
									field.val(jsonData[fieldName]);
							break;

							case "radio":
								if(typeof jsonData[fieldName]!="undefined")
									if(fieldValue==jsonData[fieldName])
										$(field).attr("checked","checked");
						    break;

							case "checkbox":
								$(field).prop("checked",false);
								if(typeof jsonData[fieldName]!="undefined"){
										if($.inArray(fieldValue,jsonData[fieldName])>-1)
											$(field).prop("checked",true);
								}
								//for php input array
								fieldName=fieldName.substr(0,fieldName.indexOf("["));
								if(typeof jsonData[fieldName]!="undefined"){
										if($.inArray(fieldValue,jsonData[fieldName])>-1)
											$(field).prop("checked",true);
								}
							break;
						}

					});

					$("select",form).each(function(index,item){

						var field=$(item);
						var fieldName=field.attr("name");
						var fieldType=field.attr("type");
						var fieldValue=field.val();

						if(typeof jsonData[fieldName]!="undefined"){

							//to execute single functionality on multipleSelect and singleSelect
							if(typeof jsonData[fieldName] != "Array"){
								var singleSelect=jsonData[fieldName];
								jsonData[fieldName]=new Array();
								jsonData[fieldName].push(singleSelect);
							}

							//console.log(jsonData[fieldName]);
							$("option",field).each(function(i,option){
								$(option).prop("selected",false);


								if($.inArray($(option).val(),jsonData[fieldName])>-1){

									//console.log($.inArray($(option).val(),jsonData[fieldName]));
									$(option).prop("selected",true);
								}
							});
						}
					});

					$("textarea",form).each(function(index,item){
						var field=$(item);
						var fieldName=field.attr("name");
						var fieldValue=jsonData[fieldName];
						if(typeof jsonData[fieldName]!="undefined")
							field.val(fieldValue);
					});

				}

			/**
			 * convert jquery.serializeArray/jsonString to json object
			 */
			function toJson(dataArray){

					if(typeof dataArray == "String")
						return $.parseJSON(dataArray);

				    var o = {};
				    var a = dataArray;
				    $.each(a, function() {
				        if (o[this.name] !== undefined) {
				            if (!o[this.name].push) {
				                o[this.name] = [o[this.name]];
				            }
				            o[this.name].push(this.value || '');
				        } else {
				            o[this.name] = this.value || '';
				        }
				    });
				    return o;
			}


			var formsData=new Object();

			this.each(function(index,form) {
					var formValues=new Object();
					var formName=index;

					if($(form).is("[name]"))
						formName=$(form).prop("name");
					else if($(form).is("[id]"))
						formName=$(form).prop("id");


					if(options.action=="write"){
						options.beforeWriteCallback(form);

						var formValues=options.data;

						formValues=toJson(formValues);

						writeForm(form,formValues);

						options.afterWriteCallback(form);
					}

					if(options.action=="read"){
						options.beforeReadCallback(form);

						formValues =readForm(form);

						options.afterReadCallback(form);
					}

					formsData=formValues;
            });

			return formsData;
        }

        });

    })(jQuery);
