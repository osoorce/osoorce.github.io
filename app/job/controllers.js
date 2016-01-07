'use strict';

angular
		.module('jobPlatformControllers', [ 'jobPlatformResources', 'timer' ])
		.controller(
				'jobPlatformJobPostController',
				[
						'$rootScope',
						'$scope',
						'jobPlatformJobResource',
						function($rootScope, $scope, jobPlatformJobResource) {
							$scope.save = function(job) {
								jobPlatformJobResource.save(job, function(
										result) {
									$scope.submitted = true;
									$rootScope.areJobsExiting = true;
									$scope.$broadcast('timer-set-countdown',
											(result.expiryDate - new Date(Date
													.now()).getTime()) / 1000);
									$scope.$broadcast('timer-start');
								});
							};

						} ])
		.controller(
				'jobPlatformJobListController',
				[
						'$scope',
						'jobPlatformJobResource',
						function($scope, jobPlatformJobResource) {

							jobPlatformJobResource
									.loadAllForSite(function(jobs) {
										for (var i = 0; i < jobs.length; i++) {
											jobs[i].remainingTime = (jobs[i].expiryDate - new Date(
													Date.now()).getTime()) / 1000;
											jobs[i].current = jobs[i].remainingTime * 1000;
											jobs[i].isShortlyBefore = false;
										}

										$scope.jobs = jobs;
									});

							$scope
									.$on(
											'timer-tick',
											function(event, data) {
												event.targetScope.$parent.job.current = event.targetScope.$parent.job.current - 1000;
												if (data.millis < 900000
														&& !event.targetScope.$parent.job.isShortlyBefore) {
													event.targetScope
															.$apply(function() {
																event.targetScope.$parent.job.isShortlyBefore = true;
															});
												}
											});

							$scope
									.$on(
											'timer-stopped',
											function(event, data) {
												event.currentScope
														.$apply(function() {
															var index = event.currentScope.jobs
																	.indexOf(event.targetScope.$parent.job);
															event.currentScope.jobs
																	.splice(
																			index,
																			1);
														});
											});

						} ])
		.controller(
				'jobPlatformJobDetailsController',
				[
						'$scope',
						'$routeParams',
						'jobPlatformJobResource',
						'jobPlatformApplicationResource',
						function($scope, $routeParams, jobPlatformJobResource,
								jobPlatformApplicationResource) {

							$scope.isShortlyBefore = false;
							$scope.$on('timer-tick', function(event, data) {
								if (data.millis < 900000
										&& !$scope.isShortlyBefore) {
									$scope.$apply(function() {
										$scope.isShortlyBefore = true;
									});
								}
							});
							jobPlatformJobResource
									.details(
											$routeParams.id,
											function(job) {
												$scope.job = job;
												$scope
														.$broadcast(
																'timer-set-countdown',
																(job.expiryDate - new Date(
																		Date
																				.now())
																		.getTime()) / 1000);
												$scope
														.$broadcast('timer-start');
											});

							$scope.apply = function(application) {
								$scope.isSubmitted = true;
								jobPlatformApplicationResource.save(
										$routeParams.id, application, function(
												result) {
											$scope.isSuccessful = true;
										}, function(error) {
											$scope.isSuccessful = false;
										});
							}
						} ]);