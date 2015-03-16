/**
 * Underscore-template - More APIs for Underscore's template engine - template fetching, rendering and caching.
 * Released under the MIT license.
 * https://github.com/cssmagic/underscore-template
 */
var template = function () {
	'use strict'

	//namespace
	var template = {}

	//config
	var ELEM_ID_PREFIX = 'template-'

	//cache
	var _cacheTemplate = {}
	var _cacheCompiledTemplate = {}

	//string function
	function trim(str){
		// while(str[0] == ' ' || str[str.length-1] == ' '){
		// 	str = str.replace(/^[\s]/g,'');
		// 	str = str.replace(/[\s]$/g,'');
		// }
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	function include(str, key){
		return (str.search(key)+1 == 0)?false:true;
	}

	function startsWith(str, key){
		return (str.substr(0,key.length) == key);
	}

	function endsWith(str, key){
		return (str.substr(str.length-key.length, key.length) == key);
	}

	//util
	function _toTemplateId(id) {
		//`#template-my-tpl-001` -> `my-tpl-001`
		// `template-my-tpl-001` -> `my-tpl-001`
		//          `my-tpl-001` -> `my-tpl-001`
		id = id ? trim(id).replace(/^[#!]+/, '') : ''
		return trim(id).replace(ELEM_ID_PREFIX, '')
	}
	function _toElementId(id) {
		//`template-my-tpl-001` -> `template-my-tpl-001`
		//         `my-tpl-001` -> `template-my-tpl-001`
		id = id ? trim(id) : ''
		return startsWith(id, ELEM_ID_PREFIX) ? id : ELEM_ID_PREFIX + id
	}
	function _stripCommentTag(str) {
		str = String(str)
		if (startsWith(str, '<!' + '--') && endsWith(str, '-->')) {
			str = str.replace(/^<!\-\-/, '').replace(/\-\->$/, '')
			str = trim(str)
		}
		return str
	}
	//get template by id (of dummy script element in html)
	function _getTemplateById(id) {
		if (!id) return false
		var result
		var elementId = _toElementId(String(id))
		var elem = document.getElementById(elementId)
		if (elem) {
			var str = trim(elem.innerHTML)
			if (str) {
				//strip html comment tag wrapping template code
				//especially for jedi 1.0 (https://github.com/baixing/jedi)
				if (_.templateSettings.shouldUnwrapCommentTag) str = _stripCommentTag(str)

				if (_isTemplateCode(str)) {
					result = str
				} else {
					/** DEBUG_INFO_START **/
					console.warn('[Template] Template code in element "#' + elementId + '" is invalid!')
					/** DEBUG_INFO_END **/
				}
			} else {
				/** DEBUG_INFO_START **/
				console.warn('[Template] Element "#' + elementId + '" is empty!')
				/** DEBUG_INFO_END **/
			}
		} else {
			/** DEBUG_INFO_START **/
			console.warn('[Template] Element "#' + elementId + '" not found!')
			/** DEBUG_INFO_END **/
		}
		return result || false
	}
	function _isTemplateCode(s) {
		var code = String(s)
		return include(code, '<%') && include(code, '%>') && /\bdata\b/.test(code)
	}

	//fn
	function add(id, templateCode) {
		//todo: accept second param as a function, to support pre-compiled template.
		if (arguments.length < 2) return false

		var result
		if (templateCode) {
			var templateId = _toTemplateId(id)
			/** DEBUG_INFO_START **/
			if (_cacheTemplate[templateId]) {
				console.warn('[Template] Template id "' + templateId + '" already existed.')
			}
			/** DEBUG_INFO_END **/
			result = _cacheTemplate[templateId] = templateCode
		} else {
			//todo: support `_.template.add(id)` to add from dummy script element
			//console.error('Missing template code to add to cache.')
		}
		return !!result
	}

	//api
	template.remove = function (/* id */) {
		//todo: remove template from cache (both str and fn)
		//todo: remove dummy script element
	}
	template.add = add
	template.render = function (id, data) {
		//todo: support _.template.render(templateCode, templateData)
		if (arguments.length < 2) {
			console.error('Missing data to render template: "' + id + '"')
			return false
		}
		var result
		var templateId = _toTemplateId(id)

		//todo: refactor: use recursion to simplify these codes
		//search in _cacheCompiledTemplate
		var fn = _cacheCompiledTemplate[templateId]
		var templateCode = _cacheTemplate[templateId]
		if (_.isFunction(fn)) {
			result = fn(data)
		}
		//search in _cacheTemplate
		else if (_.isString(templateCode)) {
			fn = _.template(templateCode)
			_cacheCompiledTemplate[templateId] = fn
			result = fn(data)
		}
		//get template code from dom
		else {
			templateCode = _getTemplateById(templateId)
			if (templateCode) {
				_cacheTemplate[templateId] = templateCode
				fn = _.template(templateCode)
				_cacheCompiledTemplate[templateId] = fn
				result = fn(data)
			}
		}
		return result || ''
	}

	/** DEBUG_INFO_START **/
	//exports for unit test
	template.__toTemplateId = _toTemplateId
	template.__toElementId = _toElementId
	template.__isTemplateCode = _isTemplateCode
	template.__stripCommentTag = _stripCommentTag
	template.__cacheTemplate = _cacheTemplate
	template.__cacheCompiledTemplate = _cacheCompiledTemplate
	/** DEBUG_INFO_END **/

	//exports
	return template

}()
