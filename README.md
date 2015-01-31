# angular-multi-transclude

angular-multi-transclude aims to provide some tools to create highly reusable Angular directives
by allowing you to define multiple insertion points (transcludes) for your directives.

> Please help to improve this component and it's documentation by giving valuable feedback.
> Tell me, if anything is unclear or imprecise.


## How to install

```
bower install angular-multi-transclude
```


## Proposition

When writing reusable directives, you want to be able to extend the directive with custom elements
and business logic by transcluding content into the directive's template in multiple regions.
You want to do this without modifying the directive's code and template.

angular-multi-transclude will allow you to define markup (transclude templates) that gets transcluded
to predefined named insertion points of your directive's HTML template.

In the following example the insertion points' name is `below` and the content that will get
transcluded is wrapped by the `transclude-template` element.

```html
<reusable-directive>
  <transclude-template name="some-predefined-insertion-point">
    <!-- extend the reusable-directive with some elements at a predefined point -->
  </transclude-template>

  <transclude-template name="some-other-insertion-point">
    <!-- Add some content to transclude here -->
  </transclude-template>
</reusable-directive>
```

Additionally, angular-multi-transclude assumes that you want your transcluded content to have
access to the directive's isolate scope, in contrast to ng-transclude which will create a transclude scope.

> It might be possible that I will add a flag / attribute in the future, which will let you
> choose which scope you want to get access to, but for now it is the directive's isolate scope.


## Possible use cases

You might use angular-multi-transclude to build:

* A slideshow component that can easily be extended. Keep in mind that you can also transclude directives
  that manipulate the scope to add custom business logic.
* Creating a video player that consists of multiple components (video, control bar, progress bar,
  overlays, etc.) which you would like to extend by adding other elements (e.g. buttons) per video
  player instance. See the Simple Video Player Demo below for some inspiration!
* ...

## Demos

### Simple Video Player Demo

[Demo](http://plnkr.co/edit/mzk3IE)

This demo shows how you can extend a very simple video player by transcluding content into
predefined, named regions of the player's template using angular-multi-transclude.

The underlying directive for both player instances is exactly the same.

The play/pause toggle button of the first instance, is not part of the player's template.
It gets transcluded into the 'belowPlayer' region.

In the second example, I added some additional overlay elements to demonstrate
even better what's possible with angular-multi-transclude.


## How to use

> If you would like to learn about why you need to integrate angular-multi-transclude in the way
> described below, have a look at the [detailed description about my motivation and thoughts on
> creating angular-multi-transclude](readme/01-overview.md).

Your directive needs to use a controller that will act as a template registry, where all
transcluded templates will be registered automatically.

To start, inject a reference to `AngularMultiTranscludeService` in your controller.

```javascript
(function() {

  angular
    .module( 'someModule' )
    .controller( 'ReusableDirectiveController', controllerDefinition );

  function controllerDefinition( $scope, AngularMultiTranscludeService ) {
    // assuming you are using controllerAs syntax
    var controller = this;

    // create a new transclude registry
    var transcludeService = new AngularMultiTranscludeService();

    // for now, the controller needs to have a property called 'transcludeService'
    // as this will later be used to retrieve the templates from the registry
    controller.transcludeService = transcludeService;

    // we will also need to access this transclude service instance in the directive's
    // link function, because it is the only place where we have access to the
    // transcluded elements. So we will need to pass it to the directive using the scope.
    $scope.transcludeService = transcludeService;
  }

})();
```

In the directive's link function we have to collect all transcluded templates.

```javascript
(function() {

  angular
    .module( 'someModule' )
    .directive( 'reusableDirective', directiveDefinition );

  function directiveDefinition() {
    return {
      bindToController: true,
      controller: 'ReusableDirectiveController'
      controllerAs: 'ReusableDirectiveController',
      link: link,
      restrict: 'AE',
      scope: {
        // we are creating a reusable component, so we might want to define
        // an API here (list of attributes)

        // our transcluded elements will have access to all properties provided
        // here and all other directive's scope properties, of course!
      },
      templateUrl: 'reusable-component.html'
      transclude: true
    };

    function link( scope, element, attributes, controller, transcludeFunction ) {

      // collectTranscludeTemplates will loop through all transcluded elements and store their
      // template in the transclude template registry

      scope.transcludeService.collectTranscludeTemplates( transcludeFunction );
    }
  }

})();
```

As we now have all templates in the registry, we will need to create another directive to mark
insertion points within our directive's template. This directive will be responsible to ask the
registry for a template within it's link function.

To be able to access the registry, this directive has to require the reusable directive's controller.

You can use the TransclusionMarkerDirectiveGenerator service to create this directive with minimal effort.


```javascript
(function() {

  var directiveName = 'reusableDirectiveTransclusionMarker';

  angular
    .module( 'someModule' )
    .directive( directiveName, directiveDefinition );

  function directiveDefinition( TransclusionMarkerDirectiveGenerator ) {

    // we can easily create a directive using the TransclusionMarkerDirectiveGenerator service
    // by passing a name and the require statement

    return TransclusionMarkerDirectiveGenerator.createDirective( directiveName, '^reusableDirective' );
  }

})();
```

Then in your directive's template, insert your marker directives to mark named insertion points
wherever you like.

```html
<div>
  <div data-reusable-directive-transclusion-marker="name-your-insertion-point-whatever-you-like"></div>

  <!-- even works multiple levels deep in the DOM hierarchy and with ng-ifs -->
  <div data-ng-if="someCondition">
    <nav>
      <div data-reusable-directive-transclusion-marker="some-other-insertion-point"></div>
    </nav>
  </div>
</div>
```

In the end, just don't forget to reference the module in your app.

```javascript
(function() {

  angular
    .module( 'someApp', [
      'angularMultiTransclude'
    ] );

})();
```


## Release History

__1.0.0__

  * First stable release of angular-multi-transclude.