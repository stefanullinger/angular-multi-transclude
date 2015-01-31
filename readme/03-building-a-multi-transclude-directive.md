1. [Motivation](02-motivation.md)
1. [Building a multi transclude directive](03-building-a-multi-transclude-directive.md)

---

To create a multi transclude directive, we have to find solutions for the following problems:

1. Allow to define multiple insertion points.  
1. The transcluded content should get access to the directive's isolate scope  
1. One should be able to place the insertion point anywhere within the template, event nest it inside of ngIfs

1 and 2 might be fairly easy to solve (see below).

My best solution for 3. is to use registry pattern in the reusable directive, so the transcluded
content gets registered during linking of this directive (» template registration).

Within the reusable directive's template we then could have another directive that – within it's
linking function – will ask the registry for a template (» template lookup). This way we can nest
this directive inside of ngIfs, as Angular will tell us (call the link function) whenever the
directive will be placed in the DOM or whenever it will be removed.

... TO BE CONTINUED
