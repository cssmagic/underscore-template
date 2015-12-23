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

	// util - string
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
		/** example:
			`#template-my-tmpl-001` -> `my-tmpl-001`
			 `template-my-tmpl-001` -> `my-tmpl-001`
			          `my-tmpl-001` -> `my-tmpl-001`
		 */
		id = id && _.isString(id) ? _trim(id).replace(/^[#!]+/, '') : ''
		return _trim(id).replace(ELEM_ID_PREFIX, '')
	}
	function _toElementId(id) {
		/** example:
			`template-my-tmpl-001` -> `template-my-tmpl-001`
			         `my-tmpl-001` -> `template-my-tmpl-001`
		 */
		id = id && _.isString(id) ? _trim(id) : ''
		return _startsWith(id, ELEM_ID_PREFIX) ? id : ELEM_ID_PREFIX + id
	}
	// get template by id (of dummy script element in html)
	function _getTemplateById(id) {
		if (!id) return false
		var result = ''
		var elementId = _toElementId(String(id))
		var elem = document.getElementById(elementId)
		if (elem) {
			result = _trim(elem.innerHTML)
			/** DEBUG_INFO_START **/
			if (!result) {
				console.warn('[Template] Element "#' + elementId + '" is empty!')
			} else if (!_isTemplateCode(result)) {
				console.warn('[Template] Template code in element "#' + elementId + '" is invalid!')
			}
			/** DEBUG_INFO_END **/
		} else {
			/** DEBUG_INFO_START **/
			console.warn('[Template] Element "#' + elementId + '" not found!')
			/** DEBUG_INFO_END **/
		}
		return result
	}
	function _isTemplateCode(s) {
		var code = String(s)
		var config = _.templateSettings
		return (
			// it must contain any template tags
			config.escape.test(code) ||
			config.interpolate.test(code) ||
			config.evaluate.test(code)
		) && (
			// it must contain variable name (if we have specified a variable name)
			config.variable ? _include(code, config.variable) : true
		)
	}

	// API
	function add(id, templateCode) {
		// TODO: accept second param as a function, to support pre-compiled template.
		var result = false
		if (arguments.length < 2) {
			/** DEBUG_INFO_START **/
			console.error('[Template] Missing param for `.add()` method.')
			/** DEBUG_INFO_END **/
			return result
		}

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
			_cacheTemplate[templateId] = String(templateCode)
			result = true
		}
		return result
	}
	function render(id, data) {
		var result = ''
		if (arguments.length < 2) {
			/** DEBUG_INFO_START **/
			console.error('[Template] Missing param for `.render()` method.')
			/** DEBUG_INFO_END **/
			return result
		}

		var templateId = _toTemplateId(id)

		// TODO: refactor: use recursion to simplify these codes
		// search in _cacheCompiledTemplate
		var fn = _cacheCompiledTemplate[templateId]
		var templateCode = _cacheTemplate[templateId]
		if (_.isFunction(fn)) {
			result = fn(data)
		}
		// search in _cacheTemplate
		else if (templateCode) {
			fn = _.template(templateCode)
			_cacheCompiledTemplate[templateId] = fn
			result = fn(data)
			// clear _cacheTemplate
			_cacheTemplate[templateId] = null
		}
		// get template code from dom
		else {
			templateCode = _getTemplateById(templateId)
			if (templateCode) {
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
	template.__cacheTemplate = _cacheTemplate
	template.__cacheCompiledTemplate = _cacheCompiledTemplate
	/** DEBUG_INFO_END **/

	// exports
	return template

}()
