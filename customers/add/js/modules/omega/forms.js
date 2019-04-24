
$( document ).on( "change", ".js_phone_country_code_selector", function ( event ) {

	var $countryCode = $( event.target )
						.closest( ".js_phone_country_code_selector" );
	var $countryCodeLabel = $countryCode.parent()
							.find( ".js_phone_country_code_label" );

	var countryCode = $countryCode.val().replace( /[^+0-9]/g, "" );
	$countryCodeLabel.text( countryCode );

} );


/*
 * On focusing away from a phone number field, trim out all "invalid" characters
 */
$( document ).on( "change", ".js_phone_field input", function ( event ) {
	$( event.target ).val( ( _i, value ) => value.replace( /[^\d\s()-]/g, "" ) );
} );

/*
 * -----
 * On submitting the Customer form, create a customer
 * -----
 */
$( document ).on( "submit", ".js_customer_form", async function ( event ) {

	/* -----
	 * Prevent the default form submission behaviour
	 * 	which triggers the loading of a new page
	 ----- */
	event.preventDefault();

	var $form = $( event.target );
	var domForm = $form.get( 0 );
	var $feedbackMessage = $form.find( ".js_feedback_message" );

	/* -----
	 * Disable the form
	 ----- */
	$form.find( "input, select, button" ).prop( "disabled", true );
	$feedbackMessage.text( "" );

	/* -----
	 * Pull the data from the form
	 ----- */
		// Project
	var $project = $form.find( "[ name = 'project' ]" );
		// Phone numbers
	var $phoneNumbers = $form.find( ".js_phone_field input" );
		// Phone country codes
	var $phoneCountryCodes = $form.find( ".js_phone_country_code_label" );
		// Name
	var $name = $form.find( "[ name = 'name' ]" );
		// Source / Context
	var $context = $form.find( "[ name = 'context' ]" );
		// Email
	var $email = $form.find( "[ name = 'email' ]" );

	/* -----
	 * Sanitize the data
	 ----- */
	// Phone numbers
	$phoneNumbers.each( ( _i, el ) => {
		$( el ).val( $( el ).val().replace( /[^\d\s()-]/g, "" ) );
	} );
	// Name
	$name.val( $name.val().trim() );
	// Email
	$email.val( $email.val().trim() );


	/* -----
	 * Validate the data
	 ----- */
	// Clear all error messages / indicators from the last submission
	//  	( if there was one )
	$form.find( ".form-validation-error" ).removeClass( "form-validation-error" );

	// Project
	if ( ! $project.val() )
		$project.closest( ".js_form_field" ).addClass( "form-validation-error" );
	// Phone numbers
		// if no (primary) phone number was provided
	if ( ! $phoneNumbers.first().val().replace( /\D/g, "" ) )
		$phoneNumbers.first().closest( ".js_form_field" )
							.addClass( "form-validation-error" );
		// The other phone numbers
	for ( let _i = 0; _i < $phoneNumbers.length; _i += 1 ) {
		let phoneCountryCode = $phoneCountryCodes.eq( _i ).text();
		let phoneNumber = $phoneNumbers.eq( _i ).val().replace( /\D/g, "" );
		if ( phoneCountryCode == "+91" )	// if it's an Indian phone number
								// if the phone number is not 10 digits
			if ( phoneNumber.length != 0 && phoneNumber.length != 10 )
				$phoneNumbers.eq( _i ).closest( ".js_form_field" )
										.addClass( "form-validation-error" );
	}
	// Source (context)
	if ( ! $context.val() )
		$context.closest( ".js_form_field" ).addClass( "form-validation-error" );
	// Name
	if ( ! $name.val() )
		$name.closest( ".js_form_field" ).addClass( "form-validation-error" );
	// Email
	if ( $email.val() && ( ! $email.val().includes( "@" ) ) )
		$email.closest( ".js_form_field" ).addClass( "form-validation-error" );

	// If the form has even one validation issue
	// do not proceed
	if ( $form.find( ".form-validation-error" ).length ) {
		$form.find( "input, select, button" ).prop( "disabled", false );
		$feedbackMessage.html( `
			The fields marked in <b style="color: #FB5959">red</b> are either empty or have invalid data.
		` );
		scrollToTop();
		return;
	}
	$feedbackMessage.html( `Adding the customer.<br>This will take a few moments.` );
	scrollToTop();

	/* -----
	 * Assemble the data
	 ----- */
	var information = { };
	information.ownerId = __OMEGA.user._id;
	information.project = $project.val();
	information.context = $context.val();
	for ( let _i = 0; _i < $phoneNumbers.length; _i += 1 ) {
		let phoneCountryCode = $phoneCountryCodes.eq( _i ).text();
		let phoneNumber = $phoneNumbers.eq( _i ).val().replace( /\D/g, "" );
		if ( phoneNumber )
			information[ "phoneNumber" + ( _i + 1 ) ] = phoneCountryCode + phoneNumber;
	}
	information.phoneNumber = information.phoneNumber1;
	delete information.phoneNumber1;
	information.name = $name.val();
	information.email = $email.val();

	/* -----
	 * Check if the customer already exists
	 ----- */
	var existingCustomer = { };
	try {
		existingCustomer = await getCustomer( information.phoneNumber, information.project );
	}
	catch ( e ) {
		console.log( e );
		if ( e.code == -1 )
			$feedbackMessage.text( `Could not determine if the customer already exists on the CRM. Please contact Sahith.` );
		else
			$feedbackMessage.text( e.message );
	}
	if ( existingCustomer._id ) {
		let message = "This customer already exists.<br>";
		if ( existingCustomer.uid )
			message += "The UID is " + existingCustomer.uid + ".";
		else
			message += "The UID is yet to be assigned.";
		message += "<br>Managed by " + existingCustomer.owner;
		$feedbackMessage.html( message );
		scrollToTop();
		$form.find( "input, select, button" ).prop( "disabled", false );
		return;
	}

	/* -----
	 * Add the customer to the database
	 ----- */
	var customerIds;
	try {
		customerIds = await createCustomer( information );
	}
	catch ( e ) {
		$feedbackMessage.html( `
			The customer could not be added.
			<br>
			Please contact Sahith.
		` );
	}
	if ( customerIds ) {
		$feedbackMessage.html( `
			The customer has been successfully added.
			<br>
			The UID <b>will be</b> ${ customerIds.uid }.
			<br>
			Click <a href="https://crm.zoho.com/crm/org670125445/tab/Contacts/${ customerIds._id }" target="_blank">here</a> to view the record.
		` );
	}
	// Reset and re-enable the form
	scrollToTop();
	domForm.reset();
	$form.find( "input, select, button" ).prop( "disabled", false );

} );



/*
 *
 * Gets a customer from the database, given an id.
 * @args
 * 	phoneNumber -> the customer's phone number
 * 	project -> the client's project
 *
 * Returns a promise with,
 * @params
 * 	customer -> an object containing data on the customer
 *
 */
function getCustomer ( phoneNumber, project ) {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/customers";
	// var url = "http://omega.capi/customers";

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET",
		data: { phoneNumber, project },
		dataType: "json"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			var customer = response.data;
			resolve( customer );
		} );
		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = __OMEGA.utils.getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}

/*
 *
 * Create a customer
 *
 */
function createCustomer ( information ) {

	if ( ! ( information.project && information.phoneNumber && information.context ) )
		return Promise.reject( {
			statusCode: 1,
			message: "Mandatory information has not been provided"
		} );

	// Build the payload
	var requestPayload = {
		project: information.project,
		phoneNumber: information.phoneNumber,
		context: information.context
	};
	requestPayload.ownerId = information.ownerId || null;
	requestPayload.name = information.name || null;
	requestPayload.email = information.email || null;
	requestPayload.phoneNumber2 = information.phoneNumber2 || null;
	requestPayload.phoneNumber3 = information.phoneNumber3 || null;
	requestPayload.phoneNumber4 = information.phoneNumber4 || null;
	requestPayload.phoneNumber5 = information.phoneNumber5 || null;

	// Fetch the lead based on the phone number
	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/customers";
	// var url = "http://omega.capi/customers";
	var createUser__AjaxRequest = $.ajax( {
		url: url,
		method: "POST",
		data: requestPayload
	} );

	return new Promise( function ( resolve, reject ) {

		createUser__AjaxRequest.done( function ( response ) {
			var userData = {
				_id: response.data._id,
				uid: response.data.uid,
				phoneNumber: information.phoneNumber
			};
			resolve( userData );
		} );

		createUser__AjaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = __OMEGA.utils.getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}

function scrollToTop () {
	window.scrollTo( 0, 0 );
};
