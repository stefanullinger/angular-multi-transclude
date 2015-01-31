(function() {

	angular
		.module( 'angularMultiTransclude' )
		.directive( 'transcludeTemplate', directiveDefinition );

	function directiveDefinition() {

		var directive = {
			priority : 1000,
			terminal : true
		};

		return directive;
	}

})();