gulp-js-templates
=========

Add your template files to javascript object.


## Installation

```
npm install gulp-js-templates
```

## Basic Usage

```js
var jtpl = require('gulp-js-templates');

gulp.task('templates', function () {
  return gulp.src('./templates/**/*.mustache')
    .pipe(jtpl('templates.min.js', { varName: 'myTemplates' }))
    .pipe(gulp.dest('./public/dist'));
});
```
## Options

Plugin supports these options:
- `varName`: String for the global scope variable to hold your templates
- `base`: String to remove from the beggining of every file path

## File streams

Plugin supports both buffer and stream files.

## Error Handling

By default, a gulp task will fail and all streams will halt when an error happens.
If you run into some sintax errors with template parsing, please let me know on the [issues](https://github.com/zuluf/gulp-js-templates/issues) page so we could handle the case in question.

## Why?

Since [web components and rel="import"](https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports) are not available, and with the idea to avoid require for the browser environment,
the plugin provides a simple logic you can use to import your templates with a script tag.

Use the plugin to concatenate your mustache|hbs|whatever templates into usable js object.
Template content will be packed into global variable as { filePath : templateString }
Property name will be derived from path to template.

ex file structure:
```
	layout/
		header/
			- header.mustache
			- menu.mustache
```
will map to:
```
	var myTemplates = {
		'layout.header.header': header html,
		'layout.header.menu': menu html
	}
```
In your app just add `<script type="text/javascript" src="path/to/public/dist/templates.min.js"></script>` and render your template like:
```
var menu = {
    // your menu instance properties
}
var output = Mustache.render(myTemplates['layout.header.menu'], menu);
```
Enjoy the ride!

## License

The Beerware License (Beerware)

Copyright (c) 2015 zuluf

As long as you retain this notice you can do whatever you want with this stuff.
If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.