1. [Motivation](02-motivation.md)
1. [Building a multi transclude directive](03-building-a-multi-transclude-directive.md)

---

# Motivation

## What is transclusion?

> In computer science, transclusion is the inclusion of a document or part of a document into another document by reference.
>
> &mdash; <cite>[Wikipedia](http://en.wikipedia.org/wiki/Transclusion)</cite>

In the context of Angular, transclusion is used to dynamically include some DOM elements into a custom directive. As directives can be made of complex templates, you have to tell Angular, where to put the transcluded element. You can easily do so by using the built-in ngTransclude directive.

ngTransclude
> marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
>
> &mdash; <cite>[docs.angularjs.org](https://docs.angularjs.org/api/ng/directive/ngTransclude)</cite>

### Example

A pane directive:
```javascript
angular
  .module( 'transcludeExample', [] )
  .directive( 'pane', function() {
    return {
      restrict: 'E',
      scope: {
        title: '@'
      },
      template: '<div>' +
                  '<div>{{title}}</div>' +
                  '<div><ng-transclude></ng-transclude></div>' +
                '</div>',
      transclude: true
    };
  });
```

used in HTML:
```html
<pane title="Some Title">
  <b>Transcluded Content</b>
</pane>
```

Will result in the following HTML:
```html
<div>
  <div>Some Title</div>
  <div>
    <b>Transcluded Content</b>
  </div>
</div>
```

## Getting the right scope

A transcluding directive creates a new scope for the transcluded content which prototypically inherits from the directive's parent scope. See [Understanding Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes) for a detailed explanation.

But for modular and reusable directives, you might want the scope of the transcluded elements to be the isolate scope of the directive, so you can access all properties and methods your directive contains.

In Angular, we can change the scope of the transcluded content by using the transclude function that gets passed into the directive's link functions.

```javascript
...
link: function( scope, element, attributes, controller, transclude ) {
  transclude( scope, function( clone, scope ) {
    element.append( clone );
  });
}
...
```

Although this allows to set the scope of the transcluded elements to whichever scope you like, the insertion point must be defined manually &ndash; in this example by using `element.append()`.


## Drawbacks

1. If you want to transclude some content a little deeper into the template using the transclude function, you have to be careful about using ngIf directives within the template, because if the ngIf expression evaluates to false, the element you want to append the transluded contents to, might not be existing in the DOM when linking – so transclusion will fail.

  ```html
  <div>
    <div ng-if="false">
      <div class="insertion-point"></div>
    </div>
  </div>
  ```

  ```javascript
  ...
  link: function( scope, element, attributes, controller, transclude ) {
    transclude( scope, function( clone, scope ) {
      angular.element( element[0].querySelector( '.insertion-point' ) ).append( clone );
    });
  }
  ...
  ```

1. Another drawback when using ngTransclude or the transclude function as shown in the examples above is, that there can only be a single insertion point.

## Conclusion

If we want to build a component that allows multiple insertion points and that uses the scope of the directive instead of creating a new *transclude* scope, we have to come up with a clever solution.