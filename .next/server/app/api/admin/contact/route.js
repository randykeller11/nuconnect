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
exports.id = "app/api/admin/contact/route";
exports.ids = ["app/api/admin/contact/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/contact/route.ts":
/*!****************************************!*\
  !*** ./app/api/admin/contact/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET() {\n    try {\n        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contact_submissions?select=*&order=submitted_at.desc`, {\n            headers: {\n                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,\n                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,\n                'Content-Type': 'application/json'\n            }\n        });\n        if (!response.ok) {\n            throw new Error('Failed to fetch contact submissions');\n        }\n        const data = await response.json();\n        // Transform the data to match the expected format\n        const transformedData = data.map((item)=>({\n                id: item.id,\n                firstName: item.first_name,\n                lastName: item.last_name,\n                email: item.email,\n                phone: item.phone,\n                relationshipStatus: item.relationship_status,\n                message: item.message,\n                submittedAt: item.submitted_at\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(transformedData);\n    } catch (error) {\n        console.error('Error fetching contact submissions:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch contact submissions'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2NvbnRhY3Qvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkM7QUFFcEMsZUFBZUM7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUMsTUFBTSxHQUFHQyxRQUFRQyxHQUFHLENBQUNDLFlBQVksQ0FBQyw2REFBNkQsQ0FBQyxFQUFFO1lBQ3ZIQyxTQUFTO2dCQUNQLGlCQUFpQixDQUFDLE9BQU8sRUFBRUgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUIsRUFBRTtnQkFDbEUsVUFBVUosUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7Z0JBQy9DLGdCQUFnQjtZQUNsQjtRQUNGO1FBRUEsSUFBSSxDQUFDTixTQUFTTyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJQyxNQUFNO1FBQ2xCO1FBRUEsTUFBTUMsT0FBTyxNQUFNVCxTQUFTVSxJQUFJO1FBRWhDLGtEQUFrRDtRQUNsRCxNQUFNQyxrQkFBa0JGLEtBQUtHLEdBQUcsQ0FBQyxDQUFDQyxPQUFlO2dCQUMvQ0MsSUFBSUQsS0FBS0MsRUFBRTtnQkFDWEMsV0FBV0YsS0FBS0csVUFBVTtnQkFDMUJDLFVBQVVKLEtBQUtLLFNBQVM7Z0JBQ3hCQyxPQUFPTixLQUFLTSxLQUFLO2dCQUNqQkMsT0FBT1AsS0FBS08sS0FBSztnQkFDakJDLG9CQUFvQlIsS0FBS1MsbUJBQW1CO2dCQUM1Q0MsU0FBU1YsS0FBS1UsT0FBTztnQkFDckJDLGFBQWFYLEtBQUtZLFlBQVk7WUFDaEM7UUFFQSxPQUFPM0IscURBQVlBLENBQUNZLElBQUksQ0FBQ0M7SUFDM0IsRUFBRSxPQUFPZSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyx1Q0FBdUNBO1FBQ3JELE9BQU81QixxREFBWUEsQ0FBQ1ksSUFBSSxDQUN0QjtZQUFFZ0IsT0FBTztRQUFzQyxHQUMvQztZQUFFRSxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2R1Yl9jZW8vRG93bmxvYWRzL21vZGVybi1tYXRyaW1vbmV5L2FwcC9hcGkvYWRtaW4vY29udGFjdC9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtwcm9jZXNzLmVudi5TVVBBQkFTRV9VUkx9L3Jlc3QvdjEvY29udGFjdF9zdWJtaXNzaW9ucz9zZWxlY3Q9KiZvcmRlcj1zdWJtaXR0ZWRfYXQuZGVzY2AsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWX1gLFxuICAgICAgICAnYXBpa2V5JzogcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIGNvbnRhY3Qgc3VibWlzc2lvbnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIC8vIFRyYW5zZm9ybSB0aGUgZGF0YSB0byBtYXRjaCB0aGUgZXhwZWN0ZWQgZm9ybWF0XG4gICAgY29uc3QgdHJhbnNmb3JtZWREYXRhID0gZGF0YS5tYXAoKGl0ZW06IGFueSkgPT4gKHtcbiAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgZmlyc3ROYW1lOiBpdGVtLmZpcnN0X25hbWUsXG4gICAgICBsYXN0TmFtZTogaXRlbS5sYXN0X25hbWUsXG4gICAgICBlbWFpbDogaXRlbS5lbWFpbCxcbiAgICAgIHBob25lOiBpdGVtLnBob25lLFxuICAgICAgcmVsYXRpb25zaGlwU3RhdHVzOiBpdGVtLnJlbGF0aW9uc2hpcF9zdGF0dXMsXG4gICAgICBtZXNzYWdlOiBpdGVtLm1lc3NhZ2UsXG4gICAgICBzdWJtaXR0ZWRBdDogaXRlbS5zdWJtaXR0ZWRfYXQsXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHRyYW5zZm9ybWVkRGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgY29udGFjdCBzdWJtaXNzaW9uczonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBjb250YWN0IHN1Ym1pc3Npb25zJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIkdFVCIsInJlc3BvbnNlIiwiZmV0Y2giLCJwcm9jZXNzIiwiZW52IiwiU1VQQUJBU0VfVVJMIiwiaGVhZGVycyIsIlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkiLCJvayIsIkVycm9yIiwiZGF0YSIsImpzb24iLCJ0cmFuc2Zvcm1lZERhdGEiLCJtYXAiLCJpdGVtIiwiaWQiLCJmaXJzdE5hbWUiLCJmaXJzdF9uYW1lIiwibGFzdE5hbWUiLCJsYXN0X25hbWUiLCJlbWFpbCIsInBob25lIiwicmVsYXRpb25zaGlwU3RhdHVzIiwicmVsYXRpb25zaGlwX3N0YXR1cyIsIm1lc3NhZ2UiLCJzdWJtaXR0ZWRBdCIsInN1Ym1pdHRlZF9hdCIsImVycm9yIiwiY29uc29sZSIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/contact/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcontact%2Froute&page=%2Fapi%2Fadmin%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcontact%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcontact%2Froute&page=%2Fapi%2Fadmin%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcontact%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_dub_ceo_Downloads_modern_matrimoney_app_api_admin_contact_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/contact/route.ts */ \"(rsc)/./app/api/admin/contact/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/contact/route\",\n        pathname: \"/api/admin/contact\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/contact/route\"\n    },\n    resolvedPagePath: \"/Users/dub_ceo/Downloads/modern-matrimoney/app/api/admin/contact/route.ts\",\n    nextConfigOutput,\n    userland: _Users_dub_ceo_Downloads_modern_matrimoney_app_api_admin_contact_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmNvbnRhY3QlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmFkbWluJTJGY29udGFjdCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmFkbWluJTJGY29udGFjdCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmR1Yl9jZW8lMkZEb3dubG9hZHMlMkZtb2Rlcm4tbWF0cmltb25leSUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZkdWJfY2VvJTJGRG93bmxvYWRzJTJGbW9kZXJuLW1hdHJpbW9uZXkmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9c3RhbmRhbG9uZSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5QjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2R1Yl9jZW8vRG93bmxvYWRzL21vZGVybi1tYXRyaW1vbmV5L2FwcC9hcGkvYWRtaW4vY29udGFjdC9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FkbWluL2NvbnRhY3Qvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi9jb250YWN0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi9jb250YWN0L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2R1Yl9jZW8vRG93bmxvYWRzL21vZGVybi1tYXRyaW1vbmV5L2FwcC9hcGkvYWRtaW4vY29udGFjdC9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcontact%2Froute&page=%2Fapi%2Fadmin%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcontact%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcontact%2Froute&page=%2Fapi%2Fadmin%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcontact%2Froute.ts&appDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdub_ceo%2FDownloads%2Fmodern-matrimoney&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();