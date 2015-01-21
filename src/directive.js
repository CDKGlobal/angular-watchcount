'use strict';

(function(){
	angular.module('angular.watchcount')
	.directive('watchCount', watchCountDirective);

	function watchCountDirective (watchCountService, watchCountConfig){
		var scopes = [];
        
        function getWatcherCountForScope(scope) {
            var count = 0;
            scopes.length = 0;
            iterateScopes(scope, function(scope) {
                var len = getWatchersFromScope(scope).length;
                scopes.push({'id': scope.$id, 'count': len});
                count += len;
            });
            return count;
        }

        function getWatchersFromScope(scope) {
            return scope && scope.$$watchers ? scope.$$watchers : [];
        }

        function iterateScopes(currentScope, countWatchers) {
            if(!currentScope) {
                return;
            }
            countWatchers(currentScope);
            return iterateChildren(currentScope, countWatchers);
        }

        function iterateChildren(start, countWatchers) {
            while (!!(start = getNextChild(start))) {
                countWatchers(start);
                iterateSiblings(start, countWatchers);
            }
        }

        function iterateSiblings(start, countWatchers) {
            while (!!(start = getNextSibling(start))) {
                countWatchers(start);
                iterateChildren(start, countWatchers);
            }
        }
        
        function getNextChild(scope){
            if(scope.$$childHead && !isToastrScope(scope) && !isToastrScope(scope.$$childHead)){
                return scope.$$childHead;
            }
            return false;
        }

        function getNextSibling(scope){
            if(scope.$$nextSibling && !isToastrScope(scope) && !isToastrScope(scope.$$nextSibling)){
                return scope.$$nextSibling;
            }
            return false;
        }

        function isToastrScope(scope){
            return scope.toastClass ? true: false;
        }

        function WatchCount(count){
            this.Total = count;
            this.GetCategory = function(){
                if(this.Total < 2000){
                    return "GOOD";
                } else if(this.Total < 4000){
                    return "BAD";
                } else {
                    return "WORSE";
                }
            };
        }

        return {
            restrict: 'E',
            replace: false,
            scope: {},
            link: function(scope, elem, attrs){
                if(watchCountConfig.run){
                    var rootScope = scope.$root;
                    var oldCount = new WatchCount(0);

                    var calculateWatchers = function() {
                        var count = getWatcherCountForScope(rootScope);
                        var newCount = new WatchCount(count);
                        if(JSON.stringify(newCount) === JSON.stringify(oldCount)) {
                            return;
                        }
                        oldCount = newCount;
                        console.log("TOTAL $watch count ::" + (count));
                        elem[0].innerHTML = "watchcount: " + count;
                        watchCountService.showToastr(newCount.Total, newCount.GetCategory());
                    };

                    var hasRegistered = false;
                    scope.$watch(function() {
                        if(!hasRegistered) {
                            hasRegistered = true;
                            scope.$$postDigest(function() {
                                hasRegistered = false;
                                calculateWatchers();
                            });
                        }
                    });
                }
            }
        };
	}

	watchCountDirective.$inject = ['watchCountService', 'watchCountConfig'];
})();