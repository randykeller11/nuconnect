/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/me/profile/route";
exports.ids = ["app/api/me/profile/route"];
exports.modules = {

/***/ "(rsc)/./app/api/me/profile/route.ts":
/*!*************************************!*\
  !*** ./app/api/me/profile/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _lib_supabase_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/supabase/server */ \"(rsc)/./lib/supabase/server.ts\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nasync function GET() {\n    try {\n        const supabase = await (0,_lib_supabase_server__WEBPACK_IMPORTED_MODULE_0__.createSupabaseServerClient)();\n        const { data: { user }, error: authError } = await supabase.auth.getUser();\n        if (authError || !user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const { data: profile, error: profileError } = await supabase.from('profiles').select('user_id').eq('user_id', user.id).single();\n        const hasProfile = !profileError && !!profile;\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            hasProfile,\n            userId: user.id\n        });\n    } catch (error) {\n        console.error('Profile check error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: 'Internal server error'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lL3Byb2ZpbGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FBQ3hCO0FBRW5DLGVBQWVFO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1ILGdGQUEwQkE7UUFFakQsTUFBTSxFQUFFSSxNQUFNLEVBQUVDLElBQUksRUFBRSxFQUFFQyxPQUFPQyxTQUFTLEVBQUUsR0FBRyxNQUFNSixTQUFTSyxJQUFJLENBQUNDLE9BQU87UUFFeEUsSUFBSUYsYUFBYSxDQUFDRixNQUFNO1lBQ3RCLE9BQU9KLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7Z0JBQUVKLE9BQU87WUFBZSxHQUFHO2dCQUFFSyxRQUFRO1lBQUk7UUFDcEU7UUFFQSxNQUFNLEVBQUVQLE1BQU1RLE9BQU8sRUFBRU4sT0FBT08sWUFBWSxFQUFFLEdBQUcsTUFBTVYsU0FDbERXLElBQUksQ0FBQyxZQUNMQyxNQUFNLENBQUMsV0FDUEMsRUFBRSxDQUFDLFdBQVdYLEtBQUtZLEVBQUUsRUFDckJDLE1BQU07UUFFVCxNQUFNQyxhQUFhLENBQUNOLGdCQUFnQixDQUFDLENBQUNEO1FBRXRDLE9BQU9YLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFBRVM7WUFBWUMsUUFBUWYsS0FBS1ksRUFBRTtRQUFDO0lBQ3pELEVBQUUsT0FBT1gsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMsd0JBQXdCQTtRQUN0QyxPQUFPTCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQUVKLE9BQU87UUFBd0IsR0FBRztZQUFFSyxRQUFRO1FBQUk7SUFDN0U7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2R1Yl9jZW8vRGVza3RvcC9udWNvbm5lY3QvYXBwL2FwaS9tZS9wcm9maWxlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVN1cGFiYXNlU2VydmVyQ2xpZW50IH0gZnJvbSAnQC9saWIvc3VwYWJhc2Uvc2VydmVyJ1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVTdXBhYmFzZVNlcnZlckNsaWVudCgpXG4gICAgXG4gICAgY29uc3QgeyBkYXRhOiB7IHVzZXIgfSwgZXJyb3I6IGF1dGhFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcbiAgICBcbiAgICBpZiAoYXV0aEVycm9yIHx8ICF1c2VyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KVxuICAgIH1cbiAgICBcbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGUsIGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgncHJvZmlsZXMnKVxuICAgICAgLnNlbGVjdCgndXNlcl9pZCcpXG4gICAgICAuZXEoJ3VzZXJfaWQnLCB1c2VyLmlkKVxuICAgICAgLnNpbmdsZSgpXG4gICAgXG4gICAgY29uc3QgaGFzUHJvZmlsZSA9ICFwcm9maWxlRXJyb3IgJiYgISFwcm9maWxlXG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgaGFzUHJvZmlsZSwgdXNlcklkOiB1c2VyLmlkIH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignUHJvZmlsZSBjaGVjayBlcnJvcjonLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlU3VwYWJhc2VTZXJ2ZXJDbGllbnQiLCJOZXh0UmVzcG9uc2UiLCJHRVQiLCJzdXBhYmFzZSIsImRhdGEiLCJ1c2VyIiwiZXJyb3IiLCJhdXRoRXJyb3IiLCJhdXRoIiwiZ2V0VXNlciIsImpzb24iLCJzdGF0dXMiLCJwcm9maWxlIiwicHJvZmlsZUVycm9yIiwiZnJvbSIsInNlbGVjdCIsImVxIiwiaWQiLCJzaW5nbGUiLCJoYXNQcm9maWxlIiwidXNlcklkIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/me/profile/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/server.ts":
/*!********************************!*\
  !*** ./lib/supabase/server.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createSupabaseServerClient: () => (/* binding */ createSupabaseServerClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_ssr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/ssr */ \"(rsc)/./node_modules/@supabase/ssr/dist/module/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nasync function createSupabaseServerClient() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    return (0,_supabase_ssr__WEBPACK_IMPORTED_MODULE_0__.createServerClient)(\"https://ymxhgdcezmcrrzqdhble.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGhnZGNlem1jcnJ6cWRoYmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTQ4ODAsImV4cCI6MjA3MDI3MDg4MH0.7yDxOxI4pkbFmUDUOfFpCVYo53NnSB6uGpBrhnBID4E\", {\n        cookies: {\n            getAll: ()=>cookieStore.getAll(),\n            setAll: ()=>{}\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2Uvc2VydmVyLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFrRDtBQUNaO0FBRS9CLGVBQWVFO0lBQ3BCLE1BQU1DLGNBQWMsTUFBTUYscURBQU9BO0lBQ2pDLE9BQU9ELGlFQUFrQkEsQ0FDdkJJLDBDQUFvQyxFQUNwQ0Esa05BQXlDLEVBQ3pDO1FBQ0VILFNBQVM7WUFDUE8sUUFBUSxJQUFNTCxZQUFZSyxNQUFNO1lBQ2hDQyxRQUFRLEtBQU87UUFDakI7SUFDRjtBQUVKIiwic291cmNlcyI6WyIvVXNlcnMvZHViX2Nlby9EZXNrdG9wL251Y29ubmVjdC9saWIvc3VwYWJhc2Uvc2VydmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlckNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zc3InXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU3VwYWJhc2VTZXJ2ZXJDbGllbnQoKSB7XG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gYXdhaXQgY29va2llcygpXG4gIHJldHVybiBjcmVhdGVTZXJ2ZXJDbGllbnQoXG4gICAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMISxcbiAgICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSEsXG4gICAge1xuICAgICAgY29va2llczoge1xuICAgICAgICBnZXRBbGw6ICgpID0+IGNvb2tpZVN0b3JlLmdldEFsbCgpLFxuICAgICAgICBzZXRBbGw6ICgpID0+IHt9LCAvLyBtaWRkbGV3YXJlIHdyaXRlcyBjb29raWVzXG4gICAgICB9LFxuICAgIH1cbiAgKVxufVxuIl0sIm5hbWVzIjpbImNyZWF0ZVNlcnZlckNsaWVudCIsImNvb2tpZXMiLCJjcmVhdGVTdXBhYmFzZVNlcnZlckNsaWVudCIsImNvb2tpZVN0b3JlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiZ2V0QWxsIiwic2V0QWxsIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/server.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fme%2Fprofile%2Froute&page=%2Fapi%2Fme%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fprofile%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fme%2Fprofile%2Froute&page=%2Fapi%2Fme%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fprofile%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_dub_ceo_Desktop_nuconnect_app_api_me_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/me/profile/route.ts */ \"(rsc)/./app/api/me/profile/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/me/profile/route\",\n        pathname: \"/api/me/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/me/profile/route\"\n    },\n    resolvedPagePath: \"/Users/dub_ceo/Desktop/nuconnect/app/api/me/profile/route.ts\",\n    nextConfigOutput,\n    userland: _Users_dub_ceo_Desktop_nuconnect_app_api_me_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtZSUyRnByb2ZpbGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm1lJTJGcHJvZmlsZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm1lJTJGcHJvZmlsZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmR1Yl9jZW8lMkZEZXNrdG9wJTJGbnVjb25uZWN0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmR1Yl9jZW8lMkZEZXNrdG9wJTJGbnVjb25uZWN0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDWTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2R1Yl9jZW8vRGVza3RvcC9udWNvbm5lY3QvYXBwL2FwaS9tZS9wcm9maWxlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvbWUvcHJvZmlsZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21lL3Byb2ZpbGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL21lL3Byb2ZpbGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZHViX2Nlby9EZXNrdG9wL251Y29ubmVjdC9hcHAvYXBpL21lL3Byb2ZpbGUvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fme%2Fprofile%2Froute&page=%2Fapi%2Fme%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fprofile%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fme%2Fprofile%2Froute&page=%2Fapi%2Fme%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Fprofile%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDesktop%2Fnuconnect&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();