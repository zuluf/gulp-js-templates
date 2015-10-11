var Sandbox = require('sandbox');
var should = require('should');
var gutil = require('gulp-util');
var jtpl = require('../');
var pj = require('path').join;
var fs = require('fs');

/**
 * Creates a stream file; If the file exists, populates the fake vinyl with the content
 *
 * @param (String) fileName
 * @return (gutil.File)
 */
function createVinyl (fileName) {
	var base, filePath;

	base = pj(__dirname, 'templates');
	filePath = pj(base, fileName);

	return new gutil.File({
		cwd: __dirname,
		base: base,
		path: filePath,
		contents: fs.readFileSync(filePath)
	});
}

describe('gulp-js-templates', function () {

	// Sandbox's each execution is 450ms minimum
	this.slow(1000);

	describe('jtpl()', function () {
		var sandbox;

		/**
		 * Define new Sandbox for evaluating the code
		 */
		beforeEach(function () {
			sandbox = new Sandbox();
		});

		/**
		 * Empty destination file
		 */
		it('should throw on missing destination file', function (done) {
			(function () {
				jtpl();
			}).should.throw('Missing destination file path');
			done();
		});

		/**
		 * Should throw on invalid variable name
		 */
		it('should throw on invalid variable name', function (done) {

			(function () {
				jtpl('dist/test.js', { varName: {} });
			}).should.throw('Please choose a valid variable name');
			done();
		});

		/**
		 * Should remove base directory from the templates property map
		 */
		it('should remove base directory from the template property', function (done) {
			var file, stream;

			file = createVinyl('small/file.mustache');
			stream = jtpl('dist/test.js', { base : 'small' });

			stream.once('data', function (response) {
				String(response.contents).should.equal("var test = {'file' : '<span></span>'};");
				done();
			});

			stream.write(file);
			stream.end();
		});

		/**
		 * Compile single file
		 */
		it('should parse template file', function (done) {
			var file, stream;

			file = createVinyl('small/file.mustache');
			stream = jtpl('dist/test.js');

			stream.once('data', function (response) {
				String(response.contents).should.equal("var test = {'small.file' : '<span></span>'};");
				done();
			});

			stream.write(file);
			stream.end();
		});

		/**
		 * Compile multiple template files
		 */
		it('should parse multiple template files', function (done) {
			var files, stream;

			files = [
				createVinyl('header/header.mustache'),
				createVinyl('header/menu.mustache'),
				createVinyl('main/main.mustache'),
				createVinyl('small/file.mustache'),
			];

			stream = jtpl('dist/templates.js');

			stream.once('data', function (response) {

				/**
				 * Run the code in the sandbox, just in case
				 */
				sandbox.run(String(response.contents) + 'postMessage(templates);', function (output) { });

				sandbox.on('message', function (templates) {
					should.exist(templates);

					(templates).should.have.property('header.header');
					(templates).should.have.property('header.menu');
					(templates).should.have.property('main.main');
					(templates).should.have.property('small.file');

					done();
				});
			});

			files.forEach(function (file) {
				stream.write(file);
			});

			stream.end();
		});

		/**
		 * Should create template collection in the specified variable name
		 */
		it('should define the collection var "myTemplates"', function (done) {
			var file, stream;

			file = createVinyl('small/file.mustache');
			stream = jtpl('dist/test.js', { varName: 'myTemplates' } );

			stream.once('data', function (response) {

				/**
				 * Run the code in the sandbox, just in case
				 */
				sandbox.run(String(response.contents) + 'postMessage(myTemplates);', function (output) {
					if (output.result !== null) {
						should.not.exist('Variable myTemplates is not defined!');
						done();
					}
				});

				sandbox.on('message', function (myTemplates) {
					should.exist(myTemplates);

					(myTemplates).should.have.property('small.file');

					done();
				});
			});

			stream.write(file);
			stream.end();
		});
	});
});