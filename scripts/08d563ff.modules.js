"use strict";function AngularFire(a,b,c,d){this._q=a,this._parse=b,this._timeout=c,this._initial=!0,this._remoteValue=!1,this._fRef="string"==typeof d?new Firebase(d):d}angular.module("firebase",[]).value("Firebase",Firebase),angular.module("firebase").factory("angularFire",["$q","$parse","$timeout",function(a,b,c){return function(d,e,f,g){var h=new AngularFire(a,b,c,d);return h.associate(e,f,g)}}]),AngularFire.prototype={associate:function(a,b,c){var d=this;void 0==c&&(c=[]);var e=this._q.defer(),f=e.promise;return this._fRef.on("value",function(f){var g=!1;if(e&&(g=e,e=!1),d._remoteValue=c,f&&void 0!=f.val()){var h=f.val();if(typeof h!=typeof c)return d._log("Error: type mismatch"),void 0;var i=Object.prototype.toString;if(i.call(c)!=i.call(h))return d._log("Error: type mismatch"),void 0;if(d._remoteValue=angular.copy(h),angular.equals(h,d._parse(b)(a)))return}d._timeout(function(){d._resolve(a,b,g,d._remoteValue)})}),f},disassociate:function(){var a=this;a._unregister&&a._unregister(),this._fRef.off("value")},_resolve:function(a,b,c,d){var e=this;this._parse(b).assign(a,angular.copy(d)),this._remoteValue=angular.copy(d),c&&(c.resolve(function(){e.disassociate()}),this._watch(a,b))},_watch:function(a,b){var c=this;c._unregister=a.$watch(b,function(){if(c._initial)return c._initial=!1,void 0;var d=JSON.parse(angular.toJson(c._parse(b)(a)));angular.equals(d,c._remoteValue)||c._fRef.ref().set(d)},!0),a.$on("$destroy",function(){c.disassociate()})},_log:function(a){console&&console.log&&console.log(a)}},angular.module("firebase").factory("angularFireCollection",["$timeout",function(a){return function(b,c){function d(a,b){this.$ref=a.ref(),this.$id=a.name(),this.$index=b,angular.extend(this,{priority:a.getPriority()},a.val())}function e(a){return a?l[a]+1:0}function f(a,b){l[b.$id]=a,m.splice(a,0,b)}function g(a){var b=l[a];m.splice(b,1),l[a]=void 0}function h(a,b){m[a]=b}function i(a,b,c){m.splice(a,1),m.splice(b,0,c),j(a,b)}function j(a,b){var c=m.length;b=b||c,b>c&&(b=c);for(var d=a;b>d;d++){var e=m[d];e.$index=l[e.$id]=d}}var k,l={},m=[];return k="string"==typeof b?new Firebase(b):b,c&&"function"==typeof c&&k.once("value",c),k.on("child_added",function(b,c){a(function(){var a=e(c);f(a,new d(b,a)),j(a)})}),k.on("child_removed",function(b){a(function(){var a=b.name(),c=l[a];g(a),j(c)})}),k.on("child_changed",function(b,c){a(function(){var a=l[b.name()],f=e(c),g=new d(b,a);h(a,g),f!==a&&i(a,f,g)})}),k.on("child_moved",function(b,c){a(function(){var a=l[b.name()],d=e(c),f=m[a];i(a,d,f)})}),m.add=function(a,b){var c;return c=b?k.ref().push(a,b):k.ref().push(a)},m.remove=function(a,b){var c=angular.isString(a)?m[l[a]]:a;b?c.$ref.remove(b):c.$ref.remove()},m.update=function(a,b){var c=angular.isString(a)?m[l[a]]:a,d={};angular.forEach(c,function(a,b){0!==b.indexOf("$")&&(d[b]=a)}),b?c.$ref.set(d,b):c.$ref.set(d)},m}}]),angular.module("firebase").factory("angularFireAuth",["$rootScope","$parse","$timeout","$location","$route",function(a,b,c,d,e){function f(a){var b=a.split(".");if(!b instanceof Array||3!==b.length)throw new Error("Invalid JWT");var c=b[1];return JSON.parse(decodeURIComponent(escape(window.atob(c))))}function g(a,d,e,f){d&&c(function(){b(d).assign(a,e),f()})}function h(a,b,c){a.authRequired&&!c._authenticated&&(c._redirectTo=void 0===a.pathTo?d.path():a.pathTo===b?"/":a.pathTo,d.replace(),d.path(b))}return{initialize:function(b,c){var d=this;if(c=c||{},this._scope=a,c.scope&&(this._scope=c.scope),c.name&&(this._name=c.name),this._cb=function(){},c.callback&&"function"==typeof c.callback&&(this._cb=c.callback),this._redirectTo=null,this._authenticated=!1,c.path&&(e.current&&h(e.current,c.path,d),a.$on("$routeChangeStart",function(a,b){h(b,c.path,d)})),this._ref=new Firebase(b),c.simple&&c.simple===!1)return g(this._scope,this._name,null),void 0;if(!window.FirebaseSimpleLogin){var f=new Error("FirebaseSimpleLogin undefined, did you include firebase-simple-login.js?");return a.$broadcast("angularFireAuth:error",f),void 0}var i=new FirebaseSimpleLogin(this._ref,function(b,c){d._cb(b,c),b?a.$broadcast("angularFireAuth:error",b):c?d._loggedIn(c):d._loggedOut()});this._authClient=i},login:function(b,c){switch(b){case"github":case"persona":case"twitter":case"facebook":case"password":if(this._authClient)this._authClient.login(b,c);else{var d=new Error("Simple Login not initialized");a.$broadcast("angularFireAuth:error",d)}break;default:var e,g=this;try{e=f(b),this._ref.auth(b,function(b){b?a.$broadcast("angularFireAuth:error",b):g._loggedIn(e)})}catch(h){a.$broadcast("angularFireAuth:error",h)}}},logout:function(){this._authClient?this._authClient.logout():(this._ref.unauth(),this._loggedOut())},_loggedIn:function(b){var c=this;this._authenticated=!0,g(this._scope,this._name,b,function(){a.$broadcast("angularFireAuth:login",b),c._redirectTo&&(d.replace(),d.path(c._redirectTo),c._redirectTo=null)})},_loggedOut:function(){this._authenticated=!1,g(this._scope,this._name,null,function(){a.$broadcast("angularFireAuth:logout")})}}}]),function(a,b,c){b.module("ngResource",["ng"]).factory("$resource",["$http","$parse",function(a,d){function e(a){return f(a,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function f(a,b){return encodeURIComponent(a).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,b?"%20":"+")}function g(a,b){this.template=a+="#",this.defaults=b||{};var c=this.urlParams={};k(a.split(/\W/),function(b){b&&new RegExp("(^|[^\\\\]):"+b+"\\W").test(a)&&(c[b]=!0)}),this.template=a.replace(/\\:/g,":")}function h(d,e,f){function p(a,b){var c={};return b=l({},e,b),k(b,function(b,d){c[d]=b.charAt&&"@"==b.charAt(0)?o(a,b.substr(1)):b}),c}function q(a){m(a||{},this)}var r=new g(d);return f=l({},i,f),k(f,function(d,e){d.method=b.uppercase(d.method);var f="POST"==d.method||"PUT"==d.method||"PATCH"==d.method;q[e]=function(b,c,e,g){var h,i={},o=j,s=null;switch(arguments.length){case 4:s=g,o=e;case 3:case 2:if(!n(c)){i=b,h=c,o=e;break}if(n(b)){o=b,s=c;break}o=c,s=e;case 1:n(b)?o=b:f?h=b:i=b;break;case 0:break;default:throw"Expected between 0-4 arguments [params, data, success, error], got "+arguments.length+" arguments."}var t=this instanceof q?this:d.isArray?[]:new q(h);return a({method:d.method,url:r.url(l({},p(h,d.params||{}),i)),data:h}).then(function(a){var b=a.data;b&&(d.isArray?(t.length=0,k(b,function(a){t.push(new q(a))})):m(b,t)),(o||j)(t,a.headers)},s),t},q.prototype["$"+e]=function(a,b,d){var g,h=p(this),i=j;switch(arguments.length){case 3:h=a,i=b,g=d;break;case 2:case 1:n(a)?(i=a,g=b):(h=a,i=b||j);case 0:break;default:throw"Expected between 1-3 arguments [params, success, error], got "+arguments.length+" arguments."}var k=f?this:c;q[e].call(this,h,k,i,g)}}),q.bind=function(a){return h(d,l({},e,a),f)},q}var i={get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}},j=b.noop,k=b.forEach,l=b.extend,m=b.copy,n=b.isFunction,o=function(a,b){return d(b)(a)};return g.prototype={url:function(a){var c,d,g=this,h=this.template;a=a||{},k(this.urlParams,function(f,i){c=a.hasOwnProperty(i)?a[i]:g.defaults[i],b.isDefined(c)&&null!==c?(d=e(c),h=h.replace(new RegExp(":"+i+"(\\W)","g"),d+"$1")):h=h.replace(new RegExp("(/?):"+i+"(\\W)","g"),function(a,b,c){return"/"==c.charAt(0)?c:b+c})}),h=h.replace(/\/?#$/,"");var i=[];return k(a,function(a,b){g.urlParams[b]||i.push(f(b)+"="+f(a))}),i.sort(),h=h.replace(/\/*$/,""),h+(i.length?"?"+i.join("&"):"")}},h}])}(window,window.angular),function(a,b,c){b.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(a,d){function e(){var a,e,f,i;for(a in h)k(g[a])&&d.cookies(a,c);for(a in g)e=g[a],b.isString(e)?e!==h[a]&&(d.cookies(a,e),i=!0):b.isDefined(h[a])?g[a]=h[a]:delete g[a];if(i){i=!1,f=d.cookies();for(a in g)g[a]!==f[a]&&(k(f[a])?delete g[a]:g[a]=f[a],i=!0)}}var f,g={},h={},i=!1,j=b.copy,k=b.isUndefined;return d.addPollFn(function(){var b=d.cookies();f!=b&&(f=b,j(b,h),j(b,g),i&&a.$apply())})(),i=!0,a.$watch(e),g}]).factory("$cookieStore",["$cookies",function(a){return{get:function(c){var d=a[c];return d?b.fromJson(d):d},put:function(c,d){a[c]=b.toJson(d)},remove:function(b){delete a[b]}}}])}(window,window.angular),function(a,b){function c(a){var b,c={},d=a.split(",");for(b=0;b<d.length;b++)c[d[b]]=!0;return c}function d(a,c){function d(a,d,g,h){if(d=b.lowercase(d),v[d])for(;q.last()&&w[q.last()];)f("",q.last());u[d]&&q.last()==d&&f("",d),h=r[d]||!!h,h||q.push(d);var i={};g.replace(k,function(a,b,c,d,f){var g=c||d||f||"";i[b]=e(g)}),c.start&&c.start(d,i,h)}function f(a,d){var e,f=0;if(d=b.lowercase(d))for(f=q.length-1;f>=0&&q[f]!=d;f--);if(f>=0){for(e=q.length-1;e>=f;e--)c.end&&c.end(q[e]);q.length=f}}var g,h,p,q=[],s=a;for(q.last=function(){return q[q.length-1]};a;){if(h=!0,q.last()&&x[q.last()])a=a.replace(new RegExp("(.*)<\\s*\\/\\s*"+q.last()+"[^>]*>","i"),function(a,b){return b=b.replace(n,"$1").replace(o,"$1"),c.chars&&c.chars(e(b)),""}),f("",q.last());else if(0===a.indexOf("<!--")?(g=a.indexOf("-->"),g>=0&&(c.comment&&c.comment(a.substring(4,g)),a=a.substring(g+3),h=!1)):m.test(a)?(p=a.match(j),p&&(a=a.substring(p[0].length),p[0].replace(j,f),h=!1)):l.test(a)&&(p=a.match(i),p&&(a=a.substring(p[0].length),p[0].replace(i,d),h=!1)),h){g=a.indexOf("<");var t=0>g?a:a.substring(0,g);a=0>g?"":a.substring(g),c.chars&&c.chars(e(t))}if(a==s)throw"Parse Error: "+a;s=a}f()}function e(a){return B.innerHTML=a.replace(/</g,"&lt;"),B.innerText||B.textContent||""}function f(a){return a.replace(/&/g,"&amp;").replace(q,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function g(a){var c=!1,d=b.bind(a,a.push);return{start:function(a,e,g){a=b.lowercase(a),!c&&x[a]&&(c=a),c||1!=y[a]||(d("<"),d(a),b.forEach(e,function(a,c){var e=b.lowercase(c);1!=A[e]||z[e]===!0&&!a.match(p)||(d(" "),d(c),d('="'),d(f(a)),d('"'))}),d(g?"/>":">"))},end:function(a){a=b.lowercase(a),c||1!=y[a]||(d("</"),d(a),d(">")),a==c&&(c=!1)},chars:function(a){c||d(f(a))}}}var h=function(a){var b=[];return d(a,g(b)),b.join("")},i=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,j=/^<\s*\/\s*([\w:-]+)[^>]*>/,k=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,l=/^</,m=/^<\s*\//,n=/<!--(.*?)-->/g,o=/<!\[CDATA\[(.*?)]]>/g,p=/^((ftp|https?):\/\/|mailto:|#)/i,q=/([^\#-~| |!])/g,r=c("area,br,col,hr,img,wbr"),s=c("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),t=c("rp,rt"),u=b.extend({},t,s),v=b.extend({},s,c("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),w=b.extend({},t,c("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),x=c("script,style"),y=b.extend({},r,v,w,u),z=c("background,cite,href,longdesc,src,usemap"),A=b.extend({},z,c("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,span,start,summary,target,title,type,valign,value,vspace,width")),B=document.createElement("pre");b.module("ngSanitize",[]).value("$sanitize",h),b.module("ngSanitize").directive("ngBindHtml",["$sanitize",function(a){return function(b,c,d){c.addClass("ng-binding").data("$binding",d.ngBindHtml),b.$watch(d.ngBindHtml,function(b){b=a(b),c.html(b||"")})}}]),b.module("ngSanitize").filter("linky",function(){var a=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}\<\>]/,b=/^mailto:/;return function(c){if(!c)return c;for(var d,e,f,h=c,i=[],j=g(i);d=h.match(a);)e=d[0],d[2]==d[3]&&(e="mailto:"+e),f=d.index,j.chars(h.substr(0,f)),j.start("a",{href:e}),j.chars(d[0].replace(b,"")),j.end("a"),h=h.substring(f+d[0].length);return j.chars(h),i.join("")}})}(window,window.angular);