# Underscore-template

> More APIs for Underscore's template engine - template fetching, rendering and caching.

## 简介

著名的 JavaScript 工具库 Underscore 内置了一个小巧而完备的前端模板引擎，而 Underscore-template 对它进行了封装和增强，将它更好地融入了开发流程：

* 提供简洁易用的 API，使用者不需要操心底层细节
* 为各个模板命名，纳入统一的模板库，以便管理和调用
* 可在 JS 中编写模板，也可以在 HTML 中编写模板；且两种方案可平滑切换
* 通过两级缓存来优化性能，避免模板的重复获取和重复编译

## 兼容性

依赖以下类库：

* Underscore

支持以下浏览器：

* Chrome / Firefox / Safari 等现代浏览器
* IE 6+

## 安装

0. 通过 Bower 安装：

	```sh
	$ bower install underscore-template
	```

0. 在页面中加载 Underscore-template 的脚本文件及必要的依赖：

	```html
	<script src="bower_components/underscore/underscore.js"></script>
	<script src="bower_components/underscore-template/src/underscore-template.js"></script>
	```

## API 文档

* Underscore-template 提供了简洁易用的 API，[详见此文档](https://github.com/cssmagic/underscore-template/issues/5)。
* 此外，建议阅读 [Wiki](https://github.com/cssmagic/underscore-template/wiki) 来获取更多信息。

## 单元测试

0. 把本项目的代码 fork 并 clone 到本地。
0. 在本项目的根目录运行 `bower install`，安装必要的依赖。
0. 在浏览器中打开 `test/test.html` 即可运行单元测试。

## 谁在用？

移动 UI 框架 [CMUI](https://github.com/CMUI/CMUI) 采用 Underscore-template 作为轻量的前端模板解决方案，因此所有 CMUI 用户都在使用它：

* [百姓网 - 手机版](http://m.baixing.com/)
* [薇姿官方电子商城 - 手机版](http://m.vichy.com.cn/)
* [优e网 - 手机版](http://m.uemall.com/)

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
