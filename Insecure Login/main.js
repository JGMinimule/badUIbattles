( function( $ ) {
	// Set the max number of attempts
	if ( window.LoginAttempts === undefined ) {
		window.LoginAttempts = 4;
	}
	// Wait until the page loads to bind events
	$( function() {
		// Click event for continue button
		$('#btnContinue').click( function() {
			// Don't do anything if the user didn't type a username
			if ( ! $('#inputUsername').val() ) { return; }
			// Disable the username box so the checksum doesn't change
			$('#inputUsername').prop( 'readonly', true );
			// Generate the CRC32 checksum of the username entered and remove the sign if it's negative
			var checksum = Math.abs( CRC32.str( $('#inputUsername').val() ) );
			// Generate three other random integers in the same range to present to the user
			var passOptions = [];
			var i;
			var rand;
			for ( i = 0; i <= 2; i++ ) {
				rand = Math.round( Math.random() * 2147483647 );
				// It's incredibly unlikely that there will be a collision, but handle it if there is
				if ( rand === checksum ) {
					i--;
				} else {
					passOptions.push( rand );
				}
			}
			// Generate elements to display the potential passwords
			var passElements = [];
			$.each( passOptions, function( idx, val ) {
				passElements.push(
					$('<button class="btn btn-outline-dark btn-pass" type="button" value="' + val + '">' + val + '</button>')
				);
			} );
			passElements.push(
				$('<button class="btn this-is-the-password btn-pass btn-outline-dark" type="button" value="' + checksum + '">' + checksum + '</button>')
			);
			// Shuffle the elements in the worst way possible
			passElements.sort( () => Math.random() - 0.5 );
			// Convert the array to a jQuery object and add it to the DOM
			$( passElements ).map( function() { return this.toArray() } ).appendTo('#pass-options');
			// Hide the unneeded buttons
			$('#step-1').hide();
			$('#step-2').show();
		} );
		// Click event for cancel button
		$('#btnCancelLogin').click( function() {
			// Show step 1 again
			$('#step-2').hide();
			$('#step-1').show();
			// Clear the potential passwords
			$('#pass-options').empty();
			// Unlock the username input
			$('#inputUsername').prop( 'readonly', false );
			// Hide the feedback alert
			$('#feedback').hide();
			$('#feedback').removeClass('alert-danger alert-success');
		} );
		// Click event for potential passwords
		$('#pass-options').on( 'click', 'button', function() {
			// Clear classes from feedback
			$('#feedback').removeClass('alert-success alert-danger');
			if ( $(this).is('.this-is-the-password') ) {
				// Indicate login success
				$('#feedback').addClass('alert-success').find('.title').text('Success! ');
				$('#feedback .inner-text').text('You have logged in successfully!');
				$('#step-2').hide();
			} else {
				// Show failure and decrement the try count
				window.LoginAttempts--;
				$('#feedback').addClass('alert-danger').find('.title').text('Incorrect Password!');
				$('#feedback .inner-text').text('Please try again. You have ' + window.LoginAttempts + ' attempts remaining.');
			}
			$('#feedback').show();
		} );
		// Click event for forgot password button
		$('#btnForgot').click( function() {
			// Don't do anything if the user didn't type a username
			if ( ! $('#inputUsername').val() ) { return; }
			// Disable the username box so the checksum doesn't change
			$('#inputUsername').prop( 'readonly', true );
			// Switch the controls over to the forgot password
			$('#step-1').hide();
			$('#password-recovery').show();
		} );
		// Click event for the password recovery cancel button
		$('#btnForgotCancel').click( function() {
			// Show step 1 and hide the recovery
			$('#password-recovery').hide();
			$('#step-1').show();
			// Clear the email box
			$('#inputEmail').val('');
			// Unlock the username input
			$('#inputUsername').prop( 'readonly', false );
			// Hide the feedback alert
			$('#feedback').hide();
			$('#feedback').removeClass('alert-danger alert-success');
		} );
		// Click event for the password recovery continue button
		$('#btnContinueForgot').click( function() {
			// Clear the existing feedback status
			$('#feedback').removeClass('alert-danger alert-success');
			// Check that the email address is filled out
			if ( ! $('#inputEmail').val() ) {
				$('#feedback').addClass('alert-danger').find('.title').text('Error: ');
				$('#feedback .inner-text').text('Please enter a valid email address');
			} else {
				$('#feedback').addClass('alert-success').find('.title').text('Success! ');
				$('#feedback .inner-text').text('We have sent the password for ' + $('#inputUsername').val() + ' to ' + $('#inputEmail').val() );
				// Hide main password recovery and show the extra
				$('#password-recovery').hide();
				$('#password-recovery-extra').show();
			}
			$('#feedback').show();
		} );
		// Click event for the password retriever
		$('#password-retriever').click( function() {
			// Calculate the password and display it in the retrieval box
			var checksum = Math.abs( CRC32.str( $('#inputUsername').val() ) );
			$('#passwordDisplay').val( checksum );
			$('.password-display').show();
		} );
		// Click event for finishing with password recovery
		$('#btnFinishRecovery').click( function() {
			// Hide the recovery and show step 1 again
			$('#password-recovery-extra').hide();
			$('.password-display').hide();
			$('#step-1').show();
			$('#inputUsername').prop( 'readonly', false );
			// Clear the email input
			$('#inputEmail').val('');
			// Hide the feedback
			$('#feedback').hide().removeClass('alert-success alert-danger');
			// Clear the password display
			$('#passwordDisplay').val('');
		} );
	} );
} )( jQuery );