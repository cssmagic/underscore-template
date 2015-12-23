void function () {
	// config
	_.templateSettings.variable = 'data'

	// const
	var TEST_STR = 'This is test string'
	var LONGER_STR = 'This substring is longer than another'
	var TEMPLATE_ID_1 = 'paragraph'
	var TEMPLATE_ID_2 = 'person'
	var HELLO = 'Hello world!'
	var PREFIX = 'template-'
	var SCRIPT_TYPE = 'text/template'

	// template code
	var templateCode1 = '<p><%= data.text %><p>'
	var templateCode2 = [
		'<ul>',
		'<% _.each(data, function(person) { %>',
		'<li><%= person.name + \': \' + person.age %></li>',
		'<% }) %>',
		'</ul>'
	].join('\n')

	// template data
	var templateData1 = {text: HELLO}
	var templateData2 = [
		{name: 'Peter', age: '31'},
		{name: 'Judy', age: '24'}
	]

	// result
	var result1 = '<p>' + HELLO + '<p>'
	var result2 = [
		'<ul>',
		'<li>Peter: 31</li>',
		'<li>Judy: 24</li>',
		'</ul>'
	].join('\n')

	describe('Util', function () {
		var _trim = template.__trim
		var _include = template.__include
		var _startsWith = template.__startsWith
		var _endsWith = template.__endsWith
		var _toTemplateId = template.__toTemplateId
		var _toElementId = template.__toElementId
		var _isTemplateCode = template.__isTemplateCode

		describe('_trim()', function () {
			it('removes all spaces from the beginning and end of the supplied string', function () {
				var arg
				arg = '  foo bar  '
				expect(_trim(arg)).to.equal('foo bar')
				arg = '  foo bar'
				expect(_trim(arg)).to.equal('foo bar')
				arg = 'foo bar  '
				expect(_trim(arg)).to.equal('foo bar')
				arg = 'foo   bar'
				expect(_trim(arg)).to.equal('foo   bar')
				arg = ''
				expect(_trim(arg)).to.equal('')
			})
		})
		describe('_include()', function () {
			it('returns false when the length of substring is shorter than supplied string', function () {
				expect(_include(TEST_STR, LONGER_STR)).to.be.false
			})
			it('returns whether substring is found within the supplied string', function () {
				var arg
				arg = 'test'
				expect(_include(TEST_STR, arg)).to.be.true
				arg = 'st st'
				expect(_include(TEST_STR, arg)).to.be.true
				arg = 'test String'
				expect(_include(TEST_STR, arg)).to.be.false
				arg = 'foobar'
				expect(_include(TEST_STR, arg)).to.be.false
			})
		})
		describe('_startsWith()', function () {
			it('returns false when the length of substring is shorter than supplied string', function () {
				expect(_startsWith(TEST_STR, LONGER_STR)).to.be.false
			})
			it('returns whether a string begins with the characters of another string', function () {
				var arg
				arg = 'This'
				expect(_startsWith(TEST_STR, arg)).to.be.true
				arg = 'this'
				expect(_startsWith(TEST_STR, arg)).to.be.false
				arg = 'This i'
				expect(_startsWith(TEST_STR, arg)).to.be.true
				arg = 'foobar'
				expect(_startsWith(TEST_STR, arg)).to.be.false
			})
		})
		describe('_endsWith()', function () {
			it('returns false when the length of substring is shorter than supplied string', function () {
				expect(_endsWith(TEST_STR, LONGER_STR)).to.be.false
			})
			it('returns whether a string begins with the characters of another string', function () {
				var arg
				arg = 'string'
				expect(_endsWith(TEST_STR, arg)).to.be.true
				arg = 't string'
				expect(_endsWith(TEST_STR, arg)).to.be.true
				arg = 'est String'
				expect(_endsWith(TEST_STR, arg)).to.false
				arg = 'foobar'
				expect(_endsWith(TEST_STR, arg)).to.be.false
			})
		})
		describe('_toTemplateId()', function () {
			it('returns directly if initial character is not space, `#` or `!`', function () {
				var arg
				arg = 'foobar'
				expect(_toTemplateId(arg)).to.equal(arg)
			})
			it('removes `' + PREFIX + '` prefix', function () {
				var arg
				arg = PREFIX + 'foo'
				expect(_toTemplateId(arg)).to.equal('foo')
			})
			it('removes all initial `#` and `!` characters', function () {
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
			it('ignores initial and ending spaces', function () {
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
			it('converts falsy value to empty string', function () {
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
			it('converts invalid type to empty string', function () {
				var arg
				arg = 1999
				expect(_toTemplateId(arg)).to.equal('')
				arg = {name: 'Peter', age: '20'}
				expect(_toTemplateId(arg)).to.equal('')
				arg = [1,2,3]
				expect(_toTemplateId(arg)).to.equal('')
			})
		})
		describe('_toElementId()', function () {
			it('adds `' + PREFIX + '` prefix', function () {
				var arg
				arg = 'foo'
				expect(_toElementId(arg)).to.equal(PREFIX + 'foo')
			})
			it('ignores initial and ending spaces', function () {
				var arg
				arg = '    '
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = '  foo  '
				expect(_toElementId(arg)).to.equal(PREFIX + 'foo')
			})
			it('converts falsy value to `' + PREFIX + '`', function () {
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
			it('converts invalid type to `' + PREFIX + '`', function () {
				var arg
				arg = 1999
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = {name: 'Peter', age: '20'}
				expect(_toElementId(arg)).to.equal(PREFIX)
				arg = [1,2,3]
				expect(_toElementId(arg)).to.equal(PREFIX)
			})
		})
		describe('_isTemplateCode()', function () {
			it('does basic functionality', function () {
				expect(_isTemplateCode(templateCode1)).to.be.true
				expect(_isTemplateCode(templateCode2)).to.be.true

				var code
				code = '<%= data.foo %>'
				expect(_isTemplateCode(code)).to.be.true
				code = '<%- data.bar %>'
				expect(_isTemplateCode(code)).to.be.true
				code = '<% if (data.isValid) { %><p>...</p><% } %>'
				expect(_isTemplateCode(code)).to.be.true

				// if we have specified variable name
				code = '<%= foo %>'
				expect(_isTemplateCode(code)).to.be.false
				code = '<%- bar %>'
				expect(_isTemplateCode(code)).to.be.false
				code = '<% if (true) { %><p>...</p><% } %>'
				expect(_isTemplateCode(code)).to.be.false

				// if we have not specified variable name
				var configVar = _.templateSettings.variable
				_.templateSettings.variable = ''
				code = '<%= foo %>'
				expect(_isTemplateCode(code)).to.be.true
				code = '<%- bar %>'
				expect(_isTemplateCode(code)).to.be.true
				code = '<% if (true) { %><p>...</p><% } %>'
				expect(_isTemplateCode(code)).to.be.true
				// restore config
				_.templateSettings.variable = configVar

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
	})

	describe('APIs', function () {
		// elem
		var $body = $(document.body)

		// test data
		var data
		var html1
		var html2
		var _cacheTemplate = template.__cacheTemplate
		var _cacheCompiledTemplate = template.__cacheCompiledTemplate

		// string
		function clean(str) {
			return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
		}

		// util
		function clearCodeCache() {
			delete _cacheTemplate[TEMPLATE_ID_1]
			delete _cacheTemplate[TEMPLATE_ID_2]
		}
		function clearCompiledCache() {
			delete _cacheCompiledTemplate[TEMPLATE_ID_1]
			delete _cacheCompiledTemplate[TEMPLATE_ID_2]
		}

		// dummy script elements
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

		beforeEach(function () {
			clearCodeCache()
			clearCompiledCache()
		})
		after(function () {
			clearCodeCache()
			clearCompiledCache()
		})

		describe('template.add()', function () {
			it('adds template code to template cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				data = {}
				data[TEMPLATE_ID_1] = templateCode1
				data[TEMPLATE_ID_2] = templateCode2
				expect(_cacheTemplate).to.deep.equal(data)
				expect(_cacheCompiledTemplate).to.deep.equal({})
			})
			it('updates cache while adding existed template id', function () {
				expect(_cacheTemplate).to.deep.equal({})
				data = {}

				template.add(TEMPLATE_ID_1, templateCode1)
				data[TEMPLATE_ID_1] = templateCode1
				expect(_cacheTemplate).to.deep.equal(data)

				template.add(TEMPLATE_ID_1, templateCode2)
				data[TEMPLATE_ID_1] = templateCode2
				expect(_cacheTemplate).to.deep.equal(data)
			})
			it('updates compiled cache while adding existed template id', function () {
				expect(_cacheCompiledTemplate).to.deep.equal({})

				var fn1 = _.template(templateCode1)
				template.add(TEMPLATE_ID_1, templateCode1)
				template.render(TEMPLATE_ID_1, templateData1)
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1].source).to.equal(fn1.source)

				var fn2 = _.template(templateCode2)
				template.add(TEMPLATE_ID_1, templateCode2)
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.equal(null)
				template.render(TEMPLATE_ID_1, templateData2)
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.be.a('function')
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1].source).to.equal(fn2.source)
			})
			it('does nothing if missing template code as second param', function () {
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
			it('gets template from dom, renders, and saves to compiled cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})
				prepareDummyScript()

				// render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = clean(html2)
				result2 = clean(result2)
				expect(html2).to.equal(result2)

				// only save to compiled cache
				expect(_cacheTemplate[TEMPLATE_ID_1]).to.not.exist
				expect(_cacheTemplate[TEMPLATE_ID_2]).to.not.exist
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.be.a('function')
				expect(_cacheCompiledTemplate[TEMPLATE_ID_2]).to.be.a('function')

				destroyDummyScript()
			})
			it('gets template from code cache, renders, and saves to compiled cache', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				// add to code cache
				// notice: there's no template in dom
				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				// render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = clean(html2)
				result2 = clean(result2)
				expect(html2).to.equal(result2)

				// only save to compiled cache
				expect(_cacheTemplate[TEMPLATE_ID_1]).to.not.exist
				expect(_cacheTemplate[TEMPLATE_ID_2]).to.not.exist
				expect(_cacheCompiledTemplate[TEMPLATE_ID_1]).to.be.a('function')
				expect(_cacheCompiledTemplate[TEMPLATE_ID_2]).to.be.a('function')
			})
			it('clears code cache after rendering', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				// add to code cache
				// notice: there's no template in dom
				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				data = {}
				data[TEMPLATE_ID_1] = templateCode1
				data[TEMPLATE_ID_2] = templateCode2
				expect(_cacheTemplate).to.deep.equal(data)

				// render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)

				// check if code cache is cleared
				expect(_cacheTemplate[TEMPLATE_ID_1]).to.not.exist
				expect(_cacheTemplate[TEMPLATE_ID_2]).to.not.exist
			})
			it('gets template from compiled cache, renders', function () {
				expect(_cacheTemplate).to.deep.equal({})
				expect(_cacheCompiledTemplate).to.deep.equal({})

				// add to code cache
				// notice: there's no template in dom
				template.add(TEMPLATE_ID_1, templateCode1)
				template.add(TEMPLATE_ID_2, templateCode2)

				// render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)

				// call this fn to ensure code cache is empty
				// notice: there's no template in dom
				clearCodeCache()

				// render template
				html1 = template.render(TEMPLATE_ID_1, templateData1)
				expect(html1).to.equal(result1)
				html2 = template.render(TEMPLATE_ID_2, templateData2)
				html2 = clean(html2)
				result2 = clean(result2)
				expect(html2).to.equal(result2)
			})
		})
	})

}()
