'use strict';

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