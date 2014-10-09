void function () {
	//config
	_.templateSettings.variable = 'data'

	//const
	var TEMPLATE_ID_1 = 'paragraph'
	var TEMPLATE_ID_2 = 'person'
	var HELLO = 'Hello world!'
	var PREFIX = 'template-'
	var SCRIPT_TYPE = 'text/template'

	//template code
	var templateCode1 = '<p><%= data.text %><p>'
	var templateCode2 = [
		'<ul>',
		'<% _.each(data, function(person) { %>',
		'<li><%= person.name + \': \' + person.age %></li>',
		'<% }) %>',
		'</ul>'
	].join('\n')

	//template data
	var templateData1 = {text: HELLO}
	var templateData2 = [
		{name: 'Peter', age: '31'},
		{name: 'Judy', age: '24'}
	]

	//result
	var result1 = '<p>' + HELLO + '<p>'
	var result2 = [
		'<ul>',
		'<li>Peter: 31</li>',
		'<li>Judy: 24</li>',
		'</ul>'
	].join('\n')

	describe('Util', function () {
		var _toTemplateId
		var _toElementId
		var _isTemplateCode
		var _stripCommentTag

		before(function () {
			_toTemplateId = template.__toTemplateId
			_toElementId = template.__toElementId
			_isTemplateCode = template.__isTemplateCode
			_stripCommentTag = template.__stripCommentTag
		})

		describe('_toTemplateId()', function () {
			it('return directly if initial character is not space, `#` or `!`', function () {
				var arg
				arg = 'foobar'
				expect(_toTemplateId(arg)).to.equal(arg)
			})
			it('remove `' + PREFIX + '` prefix', function () {
				var arg
				arg = PREFIX + 'foo'
				expect(_toTemplateId(arg)).to.equal('foo')
			})
			it('remove all initial `#` and `!` characters', function () {
				var arg
				arg = '###foo#bar'
				expect(_toTemplateId(arg)).to.equal('foo#bar')
				arg = '!!!foo#bar'
				expect(_toTemplateId(arg)).to.equal('foo#bar')
				arg = '#!!foo!bar'
				expect(_toTemplateId(arg)).to.equal('foo!bar')
				arg = '#!!' + PREFIX + 'foo!bar'
				expect(_toTemplateId(arg)).to.equal('foo!bar')
			})
			it('ignore initial and ending spaces', function () {
				var arg
				arg = '    '
				expect(_toTemplateId(arg)).to.equal('')
				arg = '  foo  '
				expect(_toTemplateId(arg)).to.equal('foo')
				arg = '  ###bar  '
				expect(_toTemplateId(arg)).to.equal('bar')
				arg = '  #!foobar  '
				expect(_toTemplateId(arg)).to.equal('foobar')
				arg = '  #!' + PREFIX + 'foo  '
				expect(_toTemplateId(arg)).to.equal('foo')
				arg = '  #!  ' + PREFIX + 'bar  '
				expect(_toTemplateId(arg)).to.equal('bar')
			})
			it('convert falsy value to empty string', function () {
				var arg
				arg = undefined
				expect(_toTemplateId(arg)).to.equal('')
				arg = null
				expect(_toTemplateId(arg)).to.equal('')
				arg = false
				expect(_toTemplateId(arg)).to.equal('')
				arg = NaN
				expect(_toTemplateId(arg)).to.equal('')
			})
		})
		describe('_toElementId()', function () {
			it('add `' + PREFIX + '` prefix', function () {
				var arg
				arg = 'foo'
				expect(_toElementId(arg)).to.equal(PREFIX + 'foo')
			})
			it('ignore initial and ending spaces', function () {
				var arg
				arg = '    '
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = '  foo  '
				expect(_toElementId(arg)).to.equal(PREFIX + 'foo')
			})
			it('convert falsy value to `' + PREFIX + '`', function () {
				var arg
				arg = undefined
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = null
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = false
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = NaN
				expect(_toElementId(arg)).to.equal(PREFIX)
			})
		})
		describe('_isTemplateCode()', function () {
			it('do basic functionality', function () {
				expect(_isTemplateCode(templateCode1)).to.be.true
				expect(_isTemplateCode(templateCode2)).to.be.true

				var code
				code = '<%= data %>'
				expect(_isTemplateCode(code)).to.be.true

				code = undefined
				expect(_isTemplateCode(code)).to.be.false
				code = ''
				expect(_isTemplateCode(code)).to.be.false
				code = null
				expect(_isTemplateCode(code)).to.be.false
				code = 'foobar'
				expect(_isTemplateCode(code)).to.be.false
				code = '<p>foobar</p>'
				expect(_isTemplateCode(code)).to.be.false
			})
		})
		describe('_stripCommentTag()', function () {
			it('strip outta html comment tag', function () {
				var code
				code = '<!-- foobar -->'
				expect(_stripCommentTag(code)).to.equal('foobar')
				code = '<!-- <p>foobar</p> -->'
				expect(_stripCommentTag(code)).to.equal('<p>foobar</p>')
			})
			it('return if not wrapped by comment tag', function () {
				var code
				code = undefined
				expect(_stripCommentTag(code)).to.equal(String(code))
				code = null
				expect(_stripCommentTag(code)).to.equal(String(code))
				code = ''
				expect(_stripCommentTag(code)).to.equal(code)
				code = '<%= data %>'
				expect(_stripCommentTag(code)).to.equal(code)
				code = 'foobar'
				expect(_stripCommentTag(code)).to.equal(code)
				code = '<p>foobar</p>'
				expect(_stripCommentTag(code)).to.equal(code)
			})
		})
	})

	describe('APIs', function () {
		//elem
		var $body = $(document.body)

		//test data
		var data, html1, html2
		var _cacheTemplate, _cacheCompiledTemplate

		//util
		function clearCodeCache() {
			delete _cacheTemplate[TEMPLATE_ID_1]
			delete _cacheTemplate[TEMPLATE_ID_2]
		}
		function clearCompileCache() {
			delete _cacheCompiledTemplate[TEMPLATE_ID_1]
			delete _cacheCompiledTemplate[TEMPLATE_ID_2]
		}

		//dummy script elements
		var $elem1
		var $elem2
		function prepareDummyScript() {
			$elem1 = $('<script/>', {
				type: SCRIPT_TYPE,
				id: PREFIX + TEMPLATE_ID_1
			}).text(templateCode1).appendTo($body)
			$elem2 = $('<script/>', {
				type: SCRIPT_TYPE,
				id: PREFIX + TEMPLATE_ID_2
			}).text(templateCode2).appendTo($body)
		}
		function destroyDummyScript() {
			$elem1.remove()
			$elem2.remove()
		}

		before(function () {
			_cacheTemplate = template.__cacheTemplate
			_cacheCompiledTemplate = template.__cacheCompiledTemplate
		})
		beforeEach(function () {
			clearCodeCache()
			clearCompileCache()
		})
		after(function () {
			clearCodeCache()
			clearCompileCache()
		})

		describe('template.add()', function () {
			it('add template code to template cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})
				data = {}

				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				data[TEMPLATE_ID_1] = templateCode1
				data[TEMPLATE_ID_2] = templateCode2
				expect(_cacheTemplate).to.deep.equal(data)
				expect(_cacheCompiledTemplate).to.deep.equal({})
			})
			it('overwrite if add existed template id', function () {
				expect(_cacheTemplate).to.deep.equal({})
				data = {}

				template.add(TEMPLATE_ID_1, templateCode1)
				data[TEMPLATE_ID_1] = templateCode1
				expect(_cacheTemplate).to.deep.equal(data)

				template.add(TEMPLATE_ID_2, templateCode2)
				data[TEMPLATE_ID_2] = templateCode2
				expect(_cacheTemplate).to.deep.equal(data)
			})
			it('do nothing if missing template code as second param', function () {
				expect(_cacheTemplate).to.deep.equal({})
				template.add('foo')
				expect(_cacheTemplate).to.deep.equal({})
				template.add(1)
				expect(_cacheTemplate).to.deep.equal({})
				template.add(new Date())
				expect(_cacheTemplate).to.deep.equal({})
			})
		})

		describe('template.render()', function () {
			it('get template from dom, render, and save to cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})
				prepareDummyScript()

				//render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = _.str.clean(html2)
				result2 = _.str.clean(result2)
				expect(html2).to.equal(result2)

				//check if template code saved to cache
				data = {}
				data[TEMPLATE_ID_1] = templateCode1
				data[TEMPLATE_ID_2] = templateCode2
				expect(_cacheTemplate[TEMPLATE_ID_1]).to.be.a('string')
				expect(_cacheTemplate[TEMPLATE_ID_2]).to.be.a('string')
				expect(_cacheTemplate).deep.equal(data)

				//check if compiled template fn saved to cache
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.be.a('function')
				expect(_cacheCompiledTemplate[TEMPLATE_ID_2]).to.be.a('function')

				destroyDummyScript()
			})
			it('get template from code cache, render, and save to compiled cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				//add to code cache
				//notice: there's no template in dom
				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				//render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = html2.replace(/\s+/g, ' ')
				result2 = result2.replace(/\s+/g, ' ')
				expect(html2).to.equal(result2)

				//check if compiled template fn saved to cache
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.be.a('function')
				expect(_cacheCompiledTemplate[TEMPLATE_ID_2]).to.be.a('function')
			})
			it('get template from compiled cache, render', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				//add to code cache
				//notice: there's no template in dom
				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				//render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = html2.replace(/\s+/g, ' ')
				result2 = result2.replace(/\s+/g, ' ')
				expect(html2).to.equal(result2)

				//clear code cache
				//notice: there's no template in dom
				//notice: now code cache is empty
				clearCodeCache()

				//render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = html2.replace(/\s+/g, ' ')
				result2 = result2.replace(/\s+/g, ' ')
				expect(html2).to.equal(result2)
			})
		})
	})

}()
