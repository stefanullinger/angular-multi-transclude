(function() {

	'use strict';

	angular
		.module( 'angularMultiTransclude' )
		.provider( 'TransclusionMarkerDirectiveGenerator', providerDefinition );

	function providerDefinition() {

		this.$get = serviceDefinition;

		serviceDefinition.$inject = [ '$compile' ];

		function serviceDefinition( $compile ) {
			// ********
			// Public
			// ********
			var service = {
				createDirective: createDirective
			};


			// ****************
			// Initialization
			// ****************
			return service;


			// ****************
			// Implementation
			// ****************
			function createDirective( directiveName, require ) {
				var directive = {
					link: link,
					require: require,
					restrict : 'AE'
				};

				return directive;

				function link( scope, element, attributes, controller ) {
					var transcludeName = attributes[ directiveName ];

					if ( transcludeName && transcludeName != '' ) {

						// Step 1: get the template from parent directive
						controller.transcludeService.getTranscludeTemplate( transcludeName ).then( function( template ) {

							// Step 2: prepare transcluded elements
							var transcludedElements = angular.element( template );

							// Step 3: compile the elements
							var link = $compile( transcludedElements );

							// Step 4: Append the elements
							element.append( transcludedElements );

							// Step 5: Link the compiled elements with the scope.
							link(scope);

							scope.$on( '$destroy', function() {
								transcludedElements.remove();
							});
						});
					}
				}
			}
		}
	}

})();