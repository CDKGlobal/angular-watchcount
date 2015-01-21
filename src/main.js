'use strict';

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