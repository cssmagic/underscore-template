/**
 * Underscore-template - More APIs for Underscore's template engine - template fetching, rendering and caching.
 * Released under the MIT license.
 * https://github.com/cssmagic/underscore-template
 */
var template = function () {
	'use strict'

	// namespace
	var template = {}

	// config
	var ELEM_ID_PREFIX = 'template-'

	// cache
	var _cacheTemplate = {}
	var _cacheCompiledTemplate = {}

	// string function
	function _trim(str) {
		return str.replace(/^\s+|\s+$/g, '')
	}
	function _include(str, substring) {
		return str.length > substring.length ? str.indexOf(substring) > -1 : false
	}
	function _startsWith(str, starts) {
		return str.length > starts.length ? str.indexOf(starts) === 0 : false
	}
	function _endsWith(str, ends) {
		return str.length > ends.length ? str.indexOf(ends) === (str.length - ends.length) : false
	}

	// util
	function _toTemplateId(id) {
		//`#template-my-tpl-001` -> `my-tpl-001`
		// `template-my-tpl-001` -> `my-tpl-001`
		//          `my-tpl-001` -> `my-tpl-001`
		id = id && _.isString(id) ? _trim(id).replace(/^[#!]+/, '') : ''
		return _trim(id).replace(ELEM_ID_PREFIX, '')
	}
	function _toElementId(id) {
		//`template-my-tpl-001` -> `template-my-tpl-001`
		//         `my-tpl-001` -> `template-my-tpl-001`
		id = id && _.isString(id) ? _trim(id) : ''
		return _startsWith(id, ELEM_ID_PREFIX) ? id : ELEM_ID_PREFIX + id
	}
	function _stripCommentTag(str) {
		str = String(str)
		if (_startsWith(str, '<!' + '--') && _endsWith(str, '-->')) {
			str = str.replace(/^<!\-\-/, '').replace(/\-\->$/, '')
			str = _trim(str)
		}
		return str
	}
	// get template by id (of dummy script element in html)
	function _getTemplateById(id) {
		if (!id) return false
		var result
		var elementId = _toElementId(String(id))
		var elem = document.getElementById(elementId)
		if (elem) {
			var str = _trim(elem.innerHTML)
			if (str) {
				// strip html comment tag wrapping template code
				// especially for jedi 1.0 (https://github.com/baixing/jedi)
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
		return _include(code, '<%') && _include(code, '%>') && /\bdata\b/.test(code)
	}

	// api
	function add(id, templateCode) {
		// TODO: accept second param as a function, to support pre-compiled template.
		if (arguments.length < 2) return false

		var result
		if (templateCode) {
			var templateId = _toTemplateId(id)
			/** DEBUG_INFO_START **/
			if (_cacheTemplate[templateId] || _cacheCompiledTemplate[templateId]) {
				console.warn('[Template] Template id "' + templateId + '" already existed.')
			}
			/** DEBUG_INFO_END **/
			if (_cacheCompiledTemplate[templateId]) {
				_cacheCompiledTemplate[templateId] = null
			}
			result = _cacheTemplate[templateId] = templateCode
		} else {
			// TODO: support `_.template.add(id)` to add from dummy script element
			// console.error('Missing template code to add to cache.')
		}
		return !!result
	}
	function render(id, data) {
		// TODO: support _.template.render(templateCode, templateData)
		if (arguments.length < 2) {
			console.error('Missing data to render template: "' + id + '"')
			return false
		}
		var result
		var templateId = _toTemplateId(id)

		// TODO: refactor: use recursion to simplify these codes
		// search in _cacheCompiledTemplate
		var fn = _cacheCompiledTemplate[templateId]
		var templateCode = _cacheTemplate[templateId]
		if (_.isFunction(fn)) {
			result = fn(data)
		}
		// search in _cacheTemplate
		else if (_.isString(templateCode)) {
			fn = _.template(templateCode)
			_cacheCompiledTemplate[templateId] = fn
			result = fn(data)
		}
		// get template code from dom
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
	
	// exports
	template.add = add
	template.render = render

	/** DEBUG_INFO_START **/
	// exports for unit test
	template.__trim = _trim
	template.__include = _include
	template.__startsWith = _startsWith
	template.__endsWith = _endsWith
	template.__toTemplateId = _toTemplateId
	template.__toElementId = _toElementId
	template.__isTemplateCode = _isTemplateCode
	template.__stripCommentTag = _stripCommentTag
	template.__cacheTemplate = _cacheTemplate
	template.__cacheCompiledTemplate = _cacheCompiledTemplate
	/** DEBUG_INFO_END **/

	// exports
	return template

}()
