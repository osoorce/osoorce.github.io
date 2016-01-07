'use strict';

angular.module('jobPlatformResources', [ 'ngResource' ]).factory(
		'totalNumberOfJobs', [ '$http', function($http) {

			return {
				perform : function(callback) {
					$http({
						method : "GET",
						url : '/api/jobs/status/active/number'
					}).success(function(result) {
						callback(result);
					});
				}
			}

		} ]).factory('jobPlatformJobResource',
		[ '$resource', function($resource) {
			var jobResource = $resource('/api/jobs/:id', {}, {});

			return {
				save : function(job, callback) {
					jobResource.save(job, function(result) {
						callback(result);
					});
				},
				details : function(id, callback) {
					var data = {
						id : id
					};
					jobResource.get(data, function(result) {
						callback(result);
					});
				},
				loadAllForSite : function(callback) {
					jobResource.query(function(result) {
						callback(result);
					});
				}
			};

		} ]).factory(
		'jobPlatformApplicationResource',
		[
				'$resource',
				function($resource) {
					var applicationResource = $resource(
							'/api/jobs/:id/applications', {}, {});

					return {
						save : function(id, application, callback,
								errorCallback) {
							var data = {
								id : id
							};
							applicationResource.save(data, application,
									function(result) {
										callback(result);
									}, function(error) {
										errorCallback(error);
									});
						}
					};

				} ]);