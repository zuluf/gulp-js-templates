/**
 * Use `gulp-js-templates` to concatenate your mustache|hbs|whatever templates into usable js object
 * Template content will be packed into global variable as property : template
 * Property name will be derived from path to template
 * ex:
 *	layout/
 *		header/
 *			- header.mustache
 *			- menu.mustache
 *
 * will map to:
 *
 *	var templates = {
 *		'layout.header.header': header html,
 *		'layout.header.menu': menu html
 * 	}
 */
(function (module, require, Buffer) {
	var Stream, through, gutil, path;

	Stream = require('readable-stream');
	through = require('through2');
	gutil = require('gulp-util');
	path = require('path');

	module.exports = function (destFile, options) {
		var buffers;

		/**
		 * Check if moron sent the path to dist file
		 */
		if (!destFile) {
			throw new gutil.PluginError('gulp-js-templates', 'Missing destination file path');
		}

		/**
		 * Set the collection global scope variable name
		 * Defaults to the destFile name without the extension
		 */
		options = {
			varName: sanitizeVarName((options && options.varName) || path.basename(destFile).split('.').shift())
		};

		/**
		 * Parsed templates container
		 *
		 * @var (Array) buffers
		 */
		buffers = [];

		/**
		 * Converts through2 file.path to object property name
		 *
		 * @param (File) file
		 * @return (String)
		 */
		function formatName (file) {
			var fileName;

			fileName = file.path.replace(file.base, '');
			fileName = fileName.split('.').shift();

			return "'" + (fileName[0] === "\\" ? fileName.substr(1) : fileName).replace(/\\/g, '.') + "'";
		}

		/**
		 * Sanitizes global variable name
		 *
		 * @param  (String) string variable name
		 * @throws (PluginError) wrong type error
		 * @return (String)
		 */
		function sanitizeVarName (string) {
			if (typeof string !== "string") {
				throw new gutil.PluginError('gulp-js-templates', 'Please choose a valid variable name');
			}

			return string.replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g, '');
		}

		/**
		 * Converts through2 file to object property name
		 *
		 * @param  (string) content
		 * @return void
		 */
		function parseContent (content) {
			if (typeof content !== "string") {
				return;
			}

			// get rid of the new lines
			content = content.split(/[\r\n]/);
			content = content.filter(function (line) {
				return !!line.length;
			});

			// clean single quotes and tabs
			content = content.join("").replace(/'/g, '&#39;').replace(/\t/g, ' ');

			return "'" + content + "'";
		}

		/**
		 * Format template row
		 *
		 * @param  (string) content
		 * @param  (File) file trouh file
		 * @return void
		 */
		function templateContent (content, file) {
			return formatName(file) + " : " + parseContent(content);
		}

		/**
		 * Converts through2 file to object property name
		 *
		 * @param  (File) file
		 * @param  (String) encoding
		 * @param  (Function) done callback
		 * @return void
		 */
		function fileBuffer (file, enc, done) {
			var content;

			// ignore empty files and directories
			if (file.isNull() || file.isDirectory()) {
				done();
				return;
			}

			if (file.isStream()) {
				file.pipe(new Stream.PassThrough())
					.on('data', function (response) {
						buffers.push(templateContent(response.toString(), file));
						done();
					});
			}

			if (file.isBuffer()) {
				buffers.push(templateContent(file.contents.toString(), file));
				done();
			}
		}

		/**
		 * Output function, creates destination file and writes the parsed templates
		 *
		 * @param  (Function) done callback
		 * @return void
		 */
		function templateOutput (done) {
			var templateFile, templateContent;


			if (typeof destFile === "string") {
				templateFile = new gutil.File({
					cwd: "",
					base: "",
					path: destFile
				});

			} else {
				templateFile = destFile;
			}

			if (templateFile) {


				templateContent = 'var ' + options.varName + ' = {' + buffers.join(', ') + '};';
				templateFile.contents = new Buffer(templateContent);
			}

			this.push(templateFile);

			done();
			return;
		}

		return through.obj(fileBuffer, templateOutput);
	};

})(module, require, Buffer);