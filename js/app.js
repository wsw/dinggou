// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ngTouch', 'ionic', 'starter.services', 'starter.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // the pet tab has its own child nav-view and history
    .state('tab.select', {
      url: '/select',
      views: {
        'select-tab': {
          templateUrl: 'templates/select.html',
          controller: 'SelectCtrl'
        }
      }
    })

    .state('tab.price', {
      url: '/price',
      views: {
        'price-tab': {
          templateUrl: 'templates/price.html',
          controller: 'PriceCtrl'
        }
      }
    })

    .state('tab.look', {
      url: '/look',
      views: {
        'look-tab': {
          templateUrl: 'templates/look.html',
          controller: 'LookCtrl'
        }
      }
    })
    
    .state('detail', {
    	url: '/detail/:id',
    	templateUrl: 'templates/lookdetail.html',
    	controller: 'LookDetailCtrl'
    })

    .state('tab.edit', {
      url: '/edit',
      views: {
        'edit-tab': {
          templateUrl: 'templates/edit.html',
          controller: 'EditCtrl'
        }
      }
    })
    
    .state('list', {
    	url: '/list',
    	templateUrl: 'templates/list.html',
    	controller: 'ListCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/select');

});

