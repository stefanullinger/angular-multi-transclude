(function() {

	'use strict';

	angular
		.module( 'angularMultiTransclude' )
		.factory( 'AngularMultiTranscludeService', serviceDefinition );

	serviceDefinition.$inject = [ '$q' ];

	function serviceDefinition( $q ) {

		// ********
		// Public
		// ********
		function TranscludeService() {
			this._templateMap = {};
		}

		TranscludeService.prototype = {
			addTranscludeTemplate:       addTranscludeTemplate,
			collectTranscludeTemplates:  collectTranscludeTemplates,
			getTranscludeTemplate:       getTranscludeTemplate
		};


		// ****************
		// Initialization
		// ****************
		return TranscludeService;


		// ****************
		// Implementation
		// ****************
		function addTranscludeTemplate( templateIdentifier, templateContent ) {
			var existingTemplateDeferred = this._templateMap[ templateIdentifier ];

			if ( !existingTemplateDeferred ) {
				this._templateMap[ templateIdentifier] = $q.defer();
			}

			this._templateMap[ templateIdentifier].resolve( templateContent );
		}

		function collectTranscludeTemplates( transcludeFunction ) {
			var transcludeService = this;

			transcludeFunction( function( clone ) {
				// Register transclude templates...
				for( var c = 0; c < clone.length; c++ ) {
					var template = angular.element( clone[c] );
					var templateName = template.attr( 'name' );

					if ( !templateName ) {
						continue;
					}

					transcludeService.addTranscludeTemplate( templateName, template.html() );
				}
			});
		}

		function getTranscludeTemplate( templateIdentifier ) {
			var existingTemplateDeferred = this._templateMap[ templateIdentifier ];

			if ( !existingTemplateDeferred ) {
				this._templateMap[ templateIdentifier] = $q.defer();
			}

			return this._templateMap[ templateIdentifier].promise;
		}
	}
})();