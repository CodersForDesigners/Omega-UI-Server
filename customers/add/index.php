<?php

/*
 *
 * Get client-specific data
 *
 */
$omega = json_decode( file_get_contents( __DIR__ . '/../../__environment/configuration/omega.json' ), true );
$apiEndpoint = $omega[ 'apiEndpoint' ];

?>

<!DOCTYPE html>
<html>

<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover">

	<title>Add Customer</title>

	<base href="/customers/add/">

	<link rel="stylesheet" type="text/css" href="css/1_normalize.css">
	<link rel="stylesheet" type="text/css" href="css/4_helper.css">
	<link rel="stylesheet" type="text/css" href="css/3_grid.css">
	<link rel="stylesheet" type="text/css" href="css/5_stylescape.css">
	<link rel="stylesheet" type="text/css" href="css/pages/customer-creator.css">

	<script type="text/javascript">

		/*
		 * Omega Settings
		 */
		// Establish global state
		window.__OMEGA = window.__OMEGA || { };

		( function ( __OMEGA ) {

			var settings = __OMEGA.settings || { };


				// API endpoint
			settings.apiEndpoint = "<?php echo $apiEndpoint ?>";


			__OMEGA.settings = settings;

		}( window.__OMEGA ) );

	</script>

</head>

<body>

	<div class="container text-center">

		<div class="h3 space-half-top-bottom">Add Customer</div>

		<form class="columns large-4 text-left js_customer_form">
			<p class="sans-serif label text-italic js_feedback_message"></p>
			<label class="form-field space-quarter-top-bottom js_form_field">
				<span class="small field-required">Project</span>
				<select class="" name="project">
					<option value="">- Select -</option>
				</select>
			</label>
			<label class="form-field space-quarter-top-bottom js_form_field">
				<span class="small field-required">Source</span>
				<select class="" name="context">
					<option value="">- Select -</option>
				</select>
			</label>
			<label class="form-field space-quarter-top-bottom js_form_field">
				<span class="small field-required">Name</span>
				<input class="" type="text" name="name">
			</label>
			<label class="form-field space-quarter-top-bottom phone-number js_form_field js_phone_field">
				<span class="small field-required">Phone Number</span>
				<!-- redundant container; so that the layout works on Ubuntu -->
				<div style="display: flex; width: 100%;">
					<input class="" type="text" name="phoneNumber">
					<div class="country-code-container">
						<span class="js_phone_country_code_label">+91</span>
						<select class="js_phone_country_code_selector">
							<?php require __DIR__ . '/inc/phone-country-codes.php' ?>
						</select>
					</div>
				</div>
			</label>
			<label class="form-field space-quarter-top-bottom js_form_field">
				<span class="small">Email</span>
				<input class="" type="text" name="email">
			</label>

			<!-- Phone Number #2 -->
			<label class="form-field space-quarter-top-bottom phone-number js_form_field js_phone_field hidden">
				<span class="small">Phone Number #2</span>
				<!-- redundant container; so that the layout works on Ubuntu -->
				<div style="display: flex; width: 100%;">
					<input class="" type="text" name="phoneNumber2">
					<div class="country-code-container">
						<span class="js_phone_country_code_label">+91</span>
						<select class="js_phone_country_code_selector">
							<?php require __DIR__ . '/inc/phone-country-codes.php' ?>
						</select>
					</div>
				</div>
			</label>
			<!-- Phone Number #3 -->
			<label class="form-field space-quarter-top-bottom phone-number js_form_field js_phone_field hidden">
				<span class="small">Phone Number #3</span>
				<!-- redundant container; so that the layout works on Ubuntu -->
				<div style="display: flex; width: 100%;">
					<input class="" type="text" name="phoneNumber3">
					<div class="country-code-container">
						<span class="js_phone_country_code_label">+91</span>
						<select class="js_phone_country_code_selector">
							<?php require __DIR__ . '/inc/phone-country-codes.php' ?>
						</select>
					</div>
				</div>
			</label>
			<!-- Phone Number #4 -->
			<label class="form-field space-quarter-top-bottom phone-number js_form_field js_phone_field hidden">
				<span class="small">Phone Number #4</span>
				<!-- redundant container; so that the layout works on Ubuntu -->
				<div style="display: flex; width: 100%;">
					<input class="" type="text" name="phoneNumber4">
					<div class="country-code-container">
						<span class="js_phone_country_code_label">+91</span>
						<select class="js_phone_country_code_selector">
							<?php require __DIR__ . '/inc/phone-country-codes.php' ?>
						</select>
					</div>
				</div>
			</label>
			<!-- Phone Number #5 -->
			<label class="form-field space-quarter-top-bottom phone-number js_form_field js_phone_field hidden">
				<span class="small">Phone Number #5</span>
				<!-- redundant container; so that the layout works on Ubuntu -->
				<div style="display: flex; width: 100%;">
					<input class="" type="text" name="phoneNumber5">
					<div class="country-code-container">
						<span class="js_phone_country_code_label">+91</span>
						<select class="js_phone_country_code_selector">
							<?php require __DIR__ . '/inc/phone-country-codes.php' ?>
						</select>
					</div>
				</div>
			</label>

			<button class="" type="submit">
				Add Customer
			</button>

			<p class="sans-serif label text-italic js_feedback_message"></p>

		</form>

	</div>





<script type="text/javascript" src="plugins/jquery/jQuery-v3.3.1.min.js"></script>
<script type="text/javascript" src="js/modules/omega/forms.js"></script>
<script type="text/javascript" src="js/modules/omega/utils.js"></script>
<script type="text/javascript">

	$( async function () {

		// Pull the role ID from the URL
		let queryParams = ( new URLSearchParams( location.search.slice( 1 ) ) );
		let roleId = queryParams.get( "roleId" );
		let profileId = queryParams.get( "profileId" );
		__OMEGA.user = {
			_id: queryParams.get( "userId" )
		};

		/*
		 * -----
		 * Pull all the data required for the form
		 * -----
		 */
		let role;
		let projects;
		let customerSources;
		try {
			[ role, profile, projects ] = await Promise.all( [
				__OMEGA.utils.getRole( roleId ),
				__OMEGA.utils.getProfile( profileId ),
				__OMEGA.utils.getProjects()
			] );
		}
		catch ( e ) {
			console.error( e )
		}

		let roleName = role.name;
		let profileName = profile.name;

		// Filter the projects based on the backend user's role
		if ( ! [ "CEO", "Business Head", "PSA" ].includes( roleName ) )
			projects = projects.filter( function ( project ) {
				let clientName__FromProject = project.split( /\s+/ )[ 0 ].toLowerCase();
				let clientName__FromRole = roleName.split( /\s+/ )[ 0 ].toLowerCase();
				return clientName__FromProject == clientName__FromRole;
			} );

		// Set the customer's source based on the backend user's profile and role
		var sources = [ "Self Generated" ];
		if ( roleName == "PSA" )
			sources = sources.concat( [ "Phone", "Channel Partner", "Customer Referral", "Chat" ] );
		if ( roleName.includes( "RM" ) )
			sources = sources.concat( [ "Walk-in at Site", "Customer Referral" ] );
		if ( roleName.includes( "Team" ) )
			sources = sources.concat( [ "Walk-in at Site", "Customer Referral" ] );
		if ( roleName == "CEO" )
			sources = sources.concat( [ "Website", "Walk-in at Site" ] );
		if ( profileName == "Data Analysis" )
			sources = sources.concat( [ "Online Portal", "Chat", "Promotional Event" ] );

		/*
		 * -----
		 * Set the values for the form fields
		 * -----
		 */
		var $form = $( ".js_customer_form" );
			// 	the "Project" field
		$form.find( "[ name = 'project' ]" ).html(
			`<option value="">- Select -</option>`
				+
			projects.reduce( ( markup, project ) => `${ markup }
				<option value="${ project }">
					${ project }
				</option>`, "" )
		);
			// 	the "Source" field
		$form.find( "[ name = 'context' ]" ).html(
			`<option value="">- Select -</option>`
				+
			sources.reduce( ( markup, source ) => `${ markup }
				<option value="${ source }">
					${ source }
				</option>`, "" )
		);

	} );

</script>





</body>

</html>
