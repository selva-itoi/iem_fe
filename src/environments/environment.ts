// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost/iem/iemAdmin_be/api/v1/',

  // apiUrl: 'https://api-iem-dev.ssamt.org/api/v1',
  emailApiUrl: 'https://dev-iem-mail.ssamt.org/api/v1/',
  apiPayrollUrl: '',
  // apiUrl: 'http://192.168.29.188/IEM_new_module/iemAdmin_be/api/v1/',
  // apiUrl: 'https://api-iem-dev.ssamt.org/api/v1',
  // apiUrl :'http://192.168.29.188/IEM/iemAdmin_be/api/v1',//old selva 
  // apiUrl :'http://192.168.86.21/IEM_new/api/v1',
  // apiUrl :'http://192.168.86.14/IEM_new/iem_dev/api/v1',

  // apiPayrollUrl:'',
  // emailApiUrl: 'https://dev-iem-mail.ssamt.org/api/v1/',

  /* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
}
