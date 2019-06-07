
/*
 *
 * Utility functions
 *
 */
// Establish global state
window.__OMEGA = window.__OMEGA || { };

( function ( __OMEGA ) {









var utils = __OMEGA.utils || { };



/*
 *
 * Handle error / exception response helper
 *
 */
function getErrorResponse ( jqXHR, textStatus, e ) {
	var statusCode = -1;
	var message;
	if ( jqXHR.responseJSON ) {
		code = jqXHR.responseJSON.statusCode;
		message = jqXHR.responseJSON.statusMessage;
	}
	else if ( typeof e == "object" ) {
		message = e.stack;
	}
	else {
		message = jqXHR.responseText;
	}
	return {
		code,
		message
	};
}
utils.getErrorResponse = getErrorResponse;



/*
 *
 * Get the role of a backend user
 *
 */
function getRole ( roleId ) {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/salespeople/roles" + "/" + roleId;
	// var url = "http://omega.capi/salespeople/roles" + "/" + roleId;

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			if ( response.statusCode != 0 )
				reject( response )
			else
				resolve( response.data );
		} );

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}
utils.getRole = getRole;



/*
 *
 * Get the profile of a backend user
 *
 */
function getProfile ( profileId ) {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/salespeople/profiles" + "/" + profileId;
	// var url = "http://omega.capi/salespeople/profiles" + "/" + profileId;

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			if ( response.statusCode != 0 )
				reject( response )
			else
				resolve( response.data );
		} );

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}
utils.getProfile = getProfile;



/*
 *
 * Get all the client projects
 *
 */
function getProjects () {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/projects";
	// var url = "http://omega.capi/projects";

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			if ( response.statusCode != 0 )
				reject( response )
			else
				resolve( response.data );
		} );

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}
utils.getProjects = getProjects;



/*
 *
 * Get all the possible sources for a customer
 *
 */
function getCustomerSources () {

	var apiEndpoint = __OMEGA.settings.apiEndpoint;
	var url = apiEndpoint + "/customers/sources";
	// var url = "http://omega.capi/customers/sources";

	var ajaxRequest = $.ajax( {
		url: url,
		method: "GET"
	} );

	return new Promise( function ( resolve, reject ) {

		ajaxRequest.done( function ( response ) {
			if ( response.statusCode != 0 )
				reject( response )
			else
				resolve( response.data );
		} );

		ajaxRequest.fail( function ( jqXHR, textStatus, e ) {
			var errorResponse = getErrorResponse( jqXHR, textStatus, e );
			reject( errorResponse );
		} );

	} );

}
utils.getCustomerSources = getCustomerSources;









__OMEGA.utils = utils;

}( window.__OMEGA ) );
