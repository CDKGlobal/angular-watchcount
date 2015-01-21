'use strict';
// Source: src/main.js
(function(){
	angular.module('angular.watchcount', ['toastr'])
	.config(function(toastrConfig){
            angular.extend(toastrConfig, {
                allowHtml: false,
                closeButton: true,
                containerId: 'toast-container',
                extendedTimeOut: 0,
                iconClasses: {
                  error: 'toast-error',
                  info: 'toast-info',
                  success: 'toast-success',
                  warning: 'toast-warning'
                },
                messageClass: 'toast-message',
                positionClass: 'toast-top-right',
                tapToDismiss: false,
                timeOut: 0,
                titleClass: 'toast-title',
                toastClass: 'toast'
            });
        })
    .constant('watchCountConfig', {
        run: false
    });
})();
// Source: src/service.js
(function(){
	angular.module('angular.watchcount')
	.factory('watchCountService', watchCountService);

	function watchCountService ($timeout, toastr) {
		var toasts = [];
        var toastTimeout = null;
        function showToastr(count, category){
            if(count) {
                switch(category){
                    case "GOOD":
                        pushToast('success', '$watch count = ' + count, 'Good Job!');
                        break;
                    case "BAD":
                        pushToast('warning', '$watch count = ' + count, 'Watch out!!');
                        break;
                    case "WORSE":
                        pushToast('danger', '$watch count = ' + count, '**Danger**');
                        break;
                    default:
                        break;
                }
            }
        }

        function pushToast(type, message, title){
            clearToasts();
            $timeout.cancel(toastTimeout);
            toastTimeout = $timeout(function(){
                toasts.push(toastr[type](message, title));
            }, 500);
        }    

        function clearToasts(){
            for (var i = toasts.length - 1; i >= 0; i--) {
                var toast = toasts.pop();
                toastr.clear(toast);
            }
        }

        return {
            showToastr: showToastr
        };
	}

	watchCountService.$inject = ['$timeout', 'toastr'];
})();
// Source: src/directive.js
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