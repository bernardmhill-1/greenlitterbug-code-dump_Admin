angular.module('userService', [])
  .factory('User', function($http){

    var userFactory = {};

    userFactory.signupUser = function (userData,file){
      return $http({
          method: 'POST',
          url: '/api/signupUser',
          headers: {
              "Content-Type": undefined
          },
          data: {
              name: userData.name,
              email: userData.email,
              contactno: userData.contactno,
              dob: userData.dob,
              password: userData.password,
              profileimage: file
          },
          transformRequest: function (data, headersGetter) {
              var formData = new FormData();
              angular.forEach(data, function (value, key) {
                  formData.append(key, value);
              });
              var headers = headersGetter();
              delete headers['Content-Type'];

              return formData;
          }
      });
    }

    return userFactory;

  });
