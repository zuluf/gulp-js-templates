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
    .pipe(jtpl('templates.js', { varName: 'myTemplates' }))
    .pipe(gulp.dest('./public/dist'));
});
```
## Options

The only option (for now) is to define the global scope variable name to put your templates to
- `varName`: String for the global scope variable to hold your templates

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
	var templates = {
		'layout.header.header': header html,
		'layout.header.menu': menu html
	}
```

## License

The MIT License (MIT)

Copyright (c) 2015 zuluf

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.