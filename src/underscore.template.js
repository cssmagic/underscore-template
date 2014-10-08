/**
 * Underscore.template - More APIs for Underscore's template engine.
 * (https://github.com/cssmagic/underscore.template)
 */
void function (window, _ext) {
	'use strict'

	//namespace
	var template = {}

	//config
	var _config = {
		//for jedi 1.0
		needStripCommentTag: true,

		//compatible with ejs
		interpolate : /<%-([\s\S]+?)%>/g,
		escape      : /<%=([\s\S]+?)%>/g,

		//to avoid use `with` in compiled templates
		//see: https://github.com/cssmagic/blog/issues/4
		variable: 'data'
	}
	var PREFIX_TEMPLATE = 'template-'

	//cache
	var _cacheTemplate = {}
	var _cacheCompiledTemplate = {}

	//util
	function _toTemplateId(id) {
		return String(id).replace(PREFIX_TEMPLATE, '')
	}
	function _toElementId(id) {
		return _.str.startsWith(id, PREFIX_TEMPLATE) ? id : PREFIX_TEMPLATE + id
	}
	function _stripCommentTag(str) {
		str = String(str)
		if (_.str.startsWith(str, '<!' + '--') && _.str.endsWith(str, '-->')) {
			str = str.replace(/^<!\-\-/, '').replace(/\-\->$/, '')
			str = _.str.trim(str)
		}
		return str
	}
	//get template by id (of dummy script element in html)
	function _getTemplateById(id) {
		if (!id || !_.isString(id)) return false
		var result
		var idElement = _toElementId(id)
		var elem = document.getElementById(idElement)
		if (!elem) {
			console.error('Element "#' + idElement + '" not found!')
		} else {
			var str = _.str.trim(elem.innerHTML)
			if (!str) {
				console.error('Element "#' + idElement + '" is empty!')
			} else {
				//strip html comment tag wrapping template code
				if (_.templateSettings.needStripCommentTag) str = _stripCommentTag(str)
				if (_isTemplateCode(str)) {
					result = str
				} else {
					console.error('Template code in element "#' + idElement + '" is no valid!')
				}
			}
		}
		return result || false
	}
	function _isTemplateCode(s) {
		var code = String(s)
		return _.str.include(code, '<%') && _.str.include(code, '%>') && /\bdata\b/.test(code)
	}

	//fn
	function updateSettings() {
		_.extend(_.templateSettings, _config)
	}
	function add(id, templateCode) {
		//todo: accept second param as a function, to support pre-compiled template.
		if (!id || !_.isString(id)) return false
		id = _.str.stripHash(id)
		var result
		if (templateCode) {
			var templateId = _toTemplateId(id)
			if (_cacheTemplate[templateId]) {
				console.warn('Template cache already has id: "' + templateId + '"')
			}
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

	//init
	updateSettings()

	//exports for unit test
	template.__isTemplateCode = _isTemplateCode
	template.__stripCommentTag = _stripCommentTag
	template.__cacheTemplate = _cacheTemplate
	template.__cacheCompiledTemplate = _cacheCompiledTemplate

	//exports
	_ext.exports('template', template)
}(window, _ext)
