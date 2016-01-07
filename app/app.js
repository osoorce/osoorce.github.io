'use strict';

angular.module(
		'app',
		[ 'ngRoute', 'ngSanitize', 'jobPlatformResources',
				'jobPlatformControllers' ]).config(
		[ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/job-create/', {
				templateUrl : 'app/job/job_create.html',
				controller : 'jobPlatformJobPostController'
			}).when('/job-details/:id', {
				templateUrl : 'app/job/job_details.html',
				controller : 'jobPlatformJobDetailsController'
			}).when('/job-list/', {
				templateUrl : 'app/job/job_all_list.html',
				controller : 'jobPlatformJobListController'
			}).otherwise({
				redirectTo : 'job-list'
			});
		} ]).filter(
		'nl2br',
		function($sce) {
			return function(msg, is_xhtml) {
				var is_xhtml = is_xhtml || true;
				var breakTag = (is_xhtml) ? '<br />' : '<br>';
				var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
						'$1' + breakTag + '$2');
				return $sce.trustAsHtml(msg);
			}
		}).run(
		function($rootScope, totalNumberOfJobs, $location) {
			$rootScope.$on('$routeChangeStart', function(event, toState,
					toParams, fromState, fromParams) {
				totalNumberOfJobs.perform(function(number) {
					if (number == 0) {
						$location.path('/job-create/');
						$rootScope.areJobsExiting = false;
					} else {
						$rootScope.areJobsExiting = true;
					}
				});
			})
		});
