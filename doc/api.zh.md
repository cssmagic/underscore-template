# API 文档

## 导言<a name="intro"></a>

#### 模板引擎

模板引擎的作用是将数据渲染成为 HTML 代码片断，它将生成 HTML 代码的工作分解为“准备数据”和“编写模板”两个步骤，将开发者从繁重的字符串拼接任务中解脱出来。

#### Underscore 的模板引擎

Underscore 内置了一个小巧而完备的前端模板引擎（`_.template()`），而 Underscore-template 这个库则将它更好地融入了开发流程。

因此，在使用这个库之前，你需要了解 Underscore 的模板引擎。推荐资源如下：

* [Underscore 模板引擎 API 官方文档](http://underscorejs.org/#template)
* [中文注解](https://github.com/cssmagic/blog/issues/4)

#### 功能简介

这个库的主要作用是建立一个模板库，把页面中需要前端模板管理起来，以便在需要的时候调用。

同时，它在内部做了一些性能优化，通过缓存来避免模板的重复编译。但这些优化对使用者来说是透明的，不需要特别操心。

## JavaScript 接口<a name="js-api"></a>

### `template.add(id, template)`<a name="js-api-add"></a>

定义一个模板，即将该模板纳入模板库，以便稍后使用。每个模板都需要有一个独一无二的 ID。

#### 参数

* `id` -- 字符串。模板名。
* `template` -- 字符串。模板代码。

#### 返回值

布尔值。定义模板成功时为 `true`，失败时为 `false`。

#### 示例

以下代码定义了一个名为 `my-list` 的模板，我们可以在后面使用它来渲染数据。

```js
template.add('my-list', [
	'<ul class="my-list">',
	'<% _.each(data.list, function (item) { %>',
		'<li><%= item %></li>',
	'<% }) %>',
	'</ul>'
].join('\n'))
```

***

### `template.render(id, data)`<a name="js-api-render"></a>

使用指定模板来渲染数据，得到 HTML 代码片断。

#### 参数

* `id` -- 字符串。模板名。
* `data` -- 对象（或数组等）。待渲染的数据。

#### 返回值

字符串。渲染生成的 HTML 代码片断。如果出现参数缺失或模板不存在等错误，则返回空字符串。

#### 示例

假设我们有以下数据：

```js
var todoList = {
	list: [
		'买一台新手机',
		'吃一顿大餐',
		'来一次说走就走的旅行'
	]
}
```

以下代码即调用名为 `my-list` 的模板（上面已定义）来渲染上述数据：

```js
var html = template.render('my-list', todoList)
```

我们会得到如下 HTML 代码片断：

```html
<ul class="my-list">
	<li>买一台新手机</li>
	<li>吃一顿大餐</li>
	<li>来一次说走就走的旅行</li>
</ul>
```

## 开发流程

#### 开发阶段

由于 JS 长期缺乏原生的多行字符串功能，在 JS 文件中编辑模板很不方便。因此，在实践中，开发者们普遍将模板代码写在 HTML 中。（如下所示，我们使用一个 `<script>` 标签来存放模板代码，并设置了一个非标准的 `type` 值来避免浏览器把它当作脚本执行。）

```html
<script type="text/template">
<ul class="my-list">
<% _.each(data.list, function (item) { %>
	<li><%= item %></li>
<% }) %>
</ul>
</script>
```

值得高兴的是，上面提到的 `.render()` 方法也接受以这种方式编写的模板。为了让它能认出这个模板，你需要为这个 `<script>` 标签添加一个 ID，且值为模板名加上 `template-` 前缀：

```html
<script type="text/template" id="template-my-list">
...
</script>
```

然后，我们就可以在 JS 中直接使用这个模板了：

```js
var html = template.render('my-list', todoList)
```

#### 部署到生产环境

把模板代码写在 HTML 中，意味着这部分代码会随着 HTML 页面的多次加载而重复加载，且各页面不能共享相同的模板，导致不必要的流量消耗；而把模板代码存放在 JS 文件中，则可以充分利用客户端缓存。

因此，在开发阶段，我们在 HTML 中编写并修改模板代码，直至完成功能开发；在准备部署到生产环境时，我们可以按照如下步骤把模板代码从 HTML 中转移到 JS 文件中：

0. 将 HTML 中的模板代码复制出来，转换为 JS 可用的多行字符串。
0. 用 `.add()` 方法来定义模板。
0. 在 HTML 中删除那些用于存放模板代码的 `<script>` 标签。

有一个 [在线的模板代码转换工具](http://m.uemall.com/static/m/tool/template/) 可以帮助我们实现多行字符串的转换。如果你在部署阶段使用一个自动化构建程序来完成的模板提取和转换就更好了。
