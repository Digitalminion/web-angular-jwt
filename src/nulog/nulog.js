
(function(){
  'use strict';

  // Prepare the 'ngJwt' module for subsequent registration of controllers and delegates
  angular.module('nuLog', [])
    .constant('logconf', {
      'debugMode':true
    })
    .config(['$provide', '$logProvider', 'logconf', function($provide, $logProvider, logconf) {
//        console.log(providerCache)
        $provide.decorator('$log', ['$delegate', function logDecorator($delegate) {

            var nuLog = {
              warn: function(msg) {
                log(msg, 'warn');
              },
              error: function(msg) {
                log(msg, 'error');
              },
              info: function(msg) {
                log(msg, 'info');
              },
              debug: function(msg) {
                  if(logconf.debugMode === true){
                        log(msg, 'debug');
                  }
              },
              log: function(msg) {
                log(msg, 'log');
              },
              stack: []
            };

            function log(msg, type) {
              nuLog.stack.push({ type: type, message: (msg.toString() != '[object Object]'? msg : 'Object'), arguments:(msg.toString() != '[object Object]'? null : msg)});
              if (console && console[type]) console[type](msg);
            }

            return nuLog;

          }
        ]);

    }])
//    .run(['$logProvider', 'logconf', function($logProvider, logconf){
//        $logProvider.debugEnabled(logconf.debugMode);
//    }])
    .directive('myLog', ['$log', '$anchorScroll', '$location',function($log, $anchorScroll, $location) {
        return {
              restrict: 'E',
              template: `
                            <link href="style.css" rel="stylesheet" type="text/css">
                            <div id="log-layer">
                                <div id="log-window">
                                    <ul id="myLog">
                                        <li ng-repeat="l in myLog track by $index" class="{{l.type}}" id="anchor{{$index}}" >{{l.message}}
                                            <ul>
                                                <li ng-repeat="(obkey, obvalue) in l.arguments track by $index">
                                                    {{obkey}} : {{obvalue}}
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        `,
              scope: { myLog: '=logging'},
              compile: function() {
                return function(scope) {
                    $log.debug({itema:'stuff', itemb:'morestuff'});
                  scope.gotoAnchor = function(x) {
                      var newHash = 'anchor' + x;
                      if ($location.hash() !== newHash) {
                        $location.hash('anchor' + x);
                      } else {
                        $anchorScroll();
                    }
                  };

                  scope.$watchCollection('myLog', function(a,b){
            //                console.log(a[a.length - 1].arguments)
                          return scope.gotoAnchor(a.length - 1)
                  })

                };
              }
        };
    }]);


})();