(function (require, process) {
	var gulp, jtpl, task;

	/**
	 * Include tools
	 */
	gulp = require('gulp');
	jtpl = require('../');

	/**
	 * Get the task name
	 */
	task = (process.argv[2] || null);

	/**
	 * Register template build tasks
	 */
	gulp.task('templates', function(){
		gulp.src('./templates/**/*.mustache')
		.pipe(jtpl('templates.min.js'))
		.pipe(gulp.dest('public'));
	});

	/**
	 * Register default gulp task
	 */
	gulp.task('default', ['templates']);

	/**
	 * If the process argument is not a registered gulp task, throw exception to terminate the process
	 */
	if (task && !gulp.hasTask(task)) {
		throw "Gulp task '" + task + "' not registered";
	}

})(require, process);