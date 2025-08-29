1. 什么是Vue，是一款用于构建用户界面的JavaScript框架，特点：
	- 声明式渲染，Vue基于标准HTML拓展了一套模板语法，使得我们可以声明式地描述最终输出的HTML和JavaScript状态之间的关系。
	- 响应性，Vue会自动跟踪JavaScript状态并在其发生变化时响应式地更新DOM
	- 渐进式框架，按需引入Vue.js的部分功能, 而不必全量引入整个框架
	- 组件框架，可复用、封装好的自定义HTML标签
	
2. 快速上手，具体细节要看vue3文档
	- 模板语法
	```HTML
	<template>
		<h2>{{ people.name }}</h2>
		<h3>{{ people.number }}</h3>
		<!--将数据解析为纯文本格式-->
		<h3 v-text="people.name"></h3>
		<!--将数据解析为html格式-->
		<h3 v-html="people.url"></h3>
	</template>
	```
	```JS
	<script setup>
		import { reactive } from 'vue'

		const people = reactive({
			name: "sz",
			number: 1111,
			url:"<i style='color:blue;'>https://github.com/SunshineZzzz</i>"
		})
	</script>
	```

	- ref vs reactive
	```JS
	<script setup>
		import { ref, reactive } from 'vue'

		// 简单类型
		const number = ref(10)
		number.value = 20

		// 复杂
		const people = reactive({
			name: "sz",
			number: 1111
		})
		people.number = 222
	</script>
	```

	- 计算属性
	```HTML
	<template>
		<p>Has published books:</p>
		<span>{{ publishedBooksMessage }}</span>
		<p>{{ calculateBooksMessage() }}</p>
	</template>
	```
	```JS
	<script setup>
		import { reactive, computed } from 'vue'

		const author = reactive({
			name: 'John Doe',
			books: [
				'Vue 2 - Advanced Guide',
				'Vue 3 - Basic Guide',
				'Vue 4 - The Mystery'
			]
		})
		// 计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。
		// 这意味着只要 author.books 不改变，无论多少次访问 publishedBooksMessage 都会立即返回先前的计算结果，
		// 而不用重复执行 getter 函数
		const publishedBooksMessage = computed(() => {
  			return author.books.length > 0 ? 'Yes' : 'No'
		})

		// 方法调用总是会在重渲染发生时再次执行函数
		function calculateBooksMessage() {
  			return author.books.length > 0 ? 'Yes' : 'No'
		}
	</script>
	```

	- 绑定事件
	```HTML
	<template>
		<h3>{{ sum }}</h3>
		<!--简写-->
		<button @click="plus(1, 1)">PLUS</button> <br>
		<button v-on:click="plus(1, 1)">PLUS</button> <br>
	</template>
	```
	```JS
	<script setup>
		import { ref } from 'vue'

		const sum = ref(100)
		const plus = (a, b) => {
			sum.value = a + b + sum.value
		}
	</script>
	```

	- 条件渲染，v-if适用于较少改变的场景, 频繁从dom中删除或添加元素, 影响性能。显示隐藏，v-show适用于频繁切换元素的显示状态, 只改变display属性, 不需要重新渲染整个组件
	```HTML
	<template>
		<p v-show="show.show">showornotshow</p>
		<p v-if="show.show">showornotshow</p>
	</template>
	```
	```JS
	<script setup>
		import { reactive } from 'vue'

		const show = reactive({
			show: true
		})
	</script>
	```

	- 类与样式绑定
	```HTML
	<template>
		<div v-bind:class="classObject">1</div>
		<!--简写-->
		<div :class="classObject">2</div>

		<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">3</div>
		<!--简写-->
		<div :style="{ color: activeColor, fontSize: fontSize + 'px' }">4</div>
	</template>
	```
	```JS
	<script setup>
		import { reactive, ref } from 'vue'

		const classObject = reactive({
			active: true,
			'text-danger': false
		})
		const activeColor = ref('red')
		const fontSize = ref(30)
	</script>
	```

	- 列表渲染
	```HTML
	<template>
		<li v-for="(value, index) in data.arr">
			index - {{ index }} : value - {{ value }}
		</li>
		<hr/>
		<li v-for="(value, key, index) in data.book">
			index - {{ index }} : key - {{ key }} : value - {{ value }}
		</li>
	</template>
	```
	```JS
	<script setup>
		import { reactive } from 'vue'

		const data = reactive({
			arr: [1, 2, 3, 4],
			book: {
				title: 'How to do lists in Vue',
				author: 'Jane Doe',
				publishedAt: '2016-04-10'
			},
		})
	</script>
	```

	- 表单输入绑定
	```HTML
	<template>
		<!--文本框，v-model修饰符-->
		<input type="text" v-model.lazy="data.text">
		<p>{{ data.text }}</p>
		<hr>
		<!--单选框-->
		<input type="radio" v-model="data.radio" value="1">单选框1
		<input type="radio" v-model="data.radio" value="2">单选框2
		<p>{{ data.radio }}</p>
		<hr>
		<!--复选框-->
		<input type="checkbox" v-model="data.checkbox" value="1">复选框1
		<input type="checkbox" v-model="data.checkbox" value="2">复选框2
		<input type="checkbox" v-model="data.checkbox" value="3">复选框3
		<input type="checkbox" v-model="data.checkbox" value="4">复选框4
		<p>{{ data.checkbox }}</p>
		<hr>
		<!--下拉框-->
		<select v-model="data.select">
			<option value="0">请选择</option>
			<option value="1">下拉框1</option>
			<option value="2">下拉框2</option>
			<option value="3">下拉框3</option>
		</select>
		<p>{{ data.select }}</p>
	</template>	
	```
	```JS
	<script setup>
		import { reactive } from 'vue'

		const data = reactive({
			// 文本框
			text: "文本框", 
			// 单选框
			radio: "1",
			// 复选框
			checkbox: [],
			// 下拉框
			select: "1"
		})
	</script>
	```

	- 侦听器
	```HTML
	<template>
	<p>
		Ask a yes/no question:
		<input v-model="question" :disabled="loading" />
	</p>
	<p>{{ answer }}</p>
	</template>
	```
	```JS
	<script setup>
		import { ref, watch } from 'vue'

		const question = ref('')
		const answer = ref('Questions usually contain a question mark. ;-)')
		const loading = ref(false)

		// watch works directly on a ref
		watch(question, async (newQuestion, oldQuestion) => {
			if (newQuestion.includes('?')) {
				loading.value = true
				answer.value = 'Thinking...'
				try {
					const res = await fetch('https://yesno.wtf/api')
					answer.value = (await res.json()).answer
				} catch (error) {
					answer.value = 'Error! Could not reach the API. ' + error
				} finally {
					loading.value = false
				}
			}
		})
	</script>
	```

	- 自动监听你在其回调函数内部访问的所有响应式数据，立即运行，并追踪依赖
	```HTML
	<template>
  		<p>{{ count1 }}</p>
  		<p>{{ count2 }}</p>
	</template>
	```
	```JS
	<script setup>
		import { ref, watchEffect } from 'vue';

		const count1 = ref(0);
		const count2 = ref(0);

		// watchEffect 自动追踪在它内部使用的 count
		watchEffect(() => {
			console.log(`当前 count1 是 ${count1.value}, 当前 count2 是 ${count2.value}`);
		});

		// 每秒增加 count1
		setInterval(() => {
			count1.value++;
		}, 1000);
		// 每1/2秒增加 count2
		setInterval(() => {
			count2.value++;
		}, 500);
	</script>
	```

	- 模板引用, 虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素
	```HTML
	<template>
		<ul>
			<li v-for="item in list" ref="items">
			{{ item }}
			</li>
		</ul>
	</template>
	```
	```JS
	<script setup>
	import { ref, useTemplateRef, onMounted } from 'vue'

	const list = ref([1, 2, 3])

	const itemRefs = useTemplateRef('items')

	onMounted(() => {
		alert(itemRefs.value.map(i => i.textContent))
	})
	</script>
	```

	- 组件
	```HTML
		<!--ButtonCounter.vue-->
		<template>
			<button @click="count++">
				You clicked me {{ count }} times.
			</button>
		</template>

		<!--App.vue-->
		<template>
			<h1>Here are many child components!</h1>
			<ButtonCounter />
			<ButtonCounter />
			<ButtonCounter />
		</template>
	```
	```JS
	// ButtonCounter.vue
	<script setup>
		import { ref } from 'vue'

		const count = ref(0)
	</script>

	// App.vue
	<script setup>
		import ButtonCounter from './ButtonCounter.vue'
	</script>
	```

	- 父亲传递儿子，defineProps
	```HTML
	<!--BlogPost1.vue-->
	<template>
		<h4>{{ title }} - {{ id }}</h4>
	</template>

	<!--BlogPost2.vue-->
	<template>
		<h4>{{ title }}</h4>
	</template>

	<!--App.vue-->
	<template>
		<BlogPost1
		v-for="post in posts"
			:key="post.id"
			title="post.title"
			:id="post.id"
		>
		</BlogPost1>

		<hr>

		<!--v-bind="post"-->
		<BlogPost2
  			v-for="post in posts"
	  		:key="post.id"
  			:="post"
		>
		</BlogPost2>	
	</template>
	```
	```JS
	// ButtonCounter1.vue
	<script setup>
		defineProps(['title', 'id'])
	</script>
	
	// ButtonCounter2.vue
	<script setup>
		defineProps({
			title: {
				type: String,
				required: true,
				default: ''
			}
		})
	</script>

	// App.vue
	<script setup>
	import { ref } from 'vue'
	import BlogPost1 from './BlogPost1.vue'
	import BlogPost2 from './BlogPost2.vue'

	const posts = ref([
		{ id: 1, title: 'My journey with Vue' },
		{ id: 2, title: 'Blogging with Vue' },
		{ id: 3, title: 'Why Vue is so fun' }
	])
	</script>
	```

	- 儿子传递父亲，defineEmits
	```HTML
	<!--BlogPost.vue-->
	<template>
	<div class="blog-post">
		<h4>{{ title }}</h4>
		<button @click="$emit('enlarge-text')">Enlarge text</button>
	</div>
	</template>

	<!--App.vue-->
	<template>
		<div :style="{ fontSize: postFontSize + 'em' }">
			<BlogPost
			v-for="post in posts"
			:key="post.id"
			:title="post.title"
			@enlarge-text="postFontSize += 0.1"
			></BlogPost>
		</div>
	</template>
	```
	```JS
	// BlogPost.vue
	<script setup>
		defineProps(['title'])
		defineEmits(['enlarge-text'])
	</script>

	// App.vue
	<script setup>
		import { ref } from 'vue'
		import BlogPost from './BlogPost.vue'
	
		const posts = ref([
			{ id: 1, title: 'My journey with Vue' },
			{ id: 2, title: 'Blogging with Vue' },
			{ id: 3, title: 'Why Vue is so fun' }
		])

		const postFontSize = ref(1)
	</script>
	```

	- 依赖注入, 跨组件通信，Prop 逐级透传问题，provide 和 inject 可以帮助我们解决这一问题
	```HTML
	<!--GrandChild.vue-->
	<template>
		<p>
			Message to grand child: {{ message }}
		</p>
	</template>

	<!--Child.vue-->
	<template>
  		<GrandChild />
	</template>

	<!--App.vue-->
	<template>
		<input v-model="message">
		<Child />
	</template>
	```
	```JS
	// GrandChild.vue
	<script setup>
		import { inject } from 'vue'

		const message = inject('message')
	</script>

	// Child.vue
	<script setup>
		import GrandChild from './GrandChild.vue'
	</script>

	// App.vue
	<script setup>
		import { ref, provide } from 'vue'
		import Child from './Child.vue'

		// by providing a ref, the GrandChild
		// can react to changes happening here.
		const message = ref('hello')
		provide('message', message)
	</script>
	```

	- 插槽，在父组件内自定义模板片段，在子组件中可以将定义的模板片段插入到子组件的特定位置
	```HTML
	<!--ScopedSlot.vue 作用域插槽-->
	<!--在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据-->
	<template>
		<div>
			<slot :text="greetingMessage" :count="1"></slot>
		</div>
	</template>

	<!--BaseLayout.vue 具名插槽-->
	<template>
		<div class="container">
			<header>
				<slot name="header"></slot>
			</header>
			<main>
				<slot></slot>
			</main>
			<footer>
				<slot name="footer"></slot>
			</footer>
		</div>
	</template>
	<style>
		footer {
			border-top: 1px solid #ccc;
			color: #666;
			font-size: 0.8em;
		}
	</style>

	<!--AnonymousSlot.vue 匿名插槽-->
	<template>
		<slot/>
	</template>

	<!--App.vue-->
	<template>
		<AnonymousSlot>
			<p>Anonymous Slot</p>
		</AnonymousSlot>
	
		<hr>

		<BaseLayout>
			<template #header>
				<h1>Here might be a page title</h1>
			</template>

			<template #default>
				<p>A paragraph for the main content.</p>
				<p>And another one.</p>
			</template>

			<template #footer>
				<p>Here's some contact info</p>
			</template>
		</BaseLayout>

		<hr>

		<ScopedSlot v-slot="slotProps">
			{{ slotProps.text }} {{ slotProps.count }}
		</ScopedSlot>
	</template>
	```
	```JS
	// ScopedSlot.vue 作用域插槽
	<script setup>
		const greetingMessage = 'hello'
	</script>

	// BaseLayout.vue 具名插槽
	<script setup>
	</script>

	// AnonymousSlot.vue 匿名插槽
	<script setup>
	</script>

	// App.vue
	<script setup>
		import AnonymousSlot from './AnonymousSlot.vue'
		import BaseLayout from './BaseLayout.vue'
		import ScopedSlot from './ScopedSlot.vue'
	</script>
	```

	- 生命周期
  
  	![官网生命周期图](https://cn.vuejs.org/assets/lifecycle_zh-CN.W0MNXI0C.png)
	
3. TS简单介绍
	- 原始数据类型
	>JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。
	>
	>原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol 和 ES10 中的新类型 BigInt。
	```TS
	// 布尔值
	let isDone: boolean = false;
	let createdByBoolean: boolean = Boolean(1);
	// new Boolean() 返回的是一个 Boolean 对象
	// let createdByNewBoolean: boolean = new Boolean(1);

	// 数值
	let decLiteral: number = 6;
	let hexLiteral: number = 0xf00d;
	// ES6 中的二进制表示法
	let binaryLiteral: number = 0b1010;
	// ES6 中的八进制表示法
	let octalLiteral: number = 0o744;
	let notANumber: number = NaN;
	let infinityNumber: number = Infinity;

	// 字符串
	let myName: string = 'Tom';
	let myAge: number = 25;

	// 模板字符串
	let sentence: string = `Hello, my name is ${myName}.
	I'll be ${myAge + 1} years old next month.`;

	// 空值
	// JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数
	function alertName(): void {
		alert('My name is Tom');
	}
	// 声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null（只在 --strictNullChecks 未指定时）
	let unusable: void = undefined;

	// Null 和 Undefined
	let u: undefined = undefined;
	let n: null = null;
	// 与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量
	let num: number = undefined;
	// 错误
	let u: void;
	let num: number = u;
	// Type 'void' is not assignable to type 'number'.
	```

	- 任意值，任意值（Any）用来表示允许赋值为任意类型
	```TS
	// 任意值的属性和方法, 可以认为，声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。
	let anyThing: any = 'hello';
	console.log(anyThing.myName);
	console.log(anyThing.myName.firstName);
	anyThing.setName('Jerry');
	anyThing.setName('Jerry').sayHello();
	anyThing.myName.setFirstName('Cat');

	// 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型
	let something;
	something = 'seven';
	something = 7;

	something.setName('Tom');
	```
	
	- 类型推论
	>如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。
	如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查
	```TS
	// 推导string
	let myFavoriteNumber = 'seven';

	let myFavoriteNumber;
	myFavoriteNumber = 'seven';
	myFavoriteNumber = 7;
	```

	- 联合类型，联合类型（Union Types）表示取值可以为多种类型中的一种
	```TS
	let myFavoriteNumber: string | number;
	myFavoriteNumber = 'seven';
	myFavoriteNumber = 7;
	
	// TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法
	function getString(something: string | number): string {
		// 错误
		// return something.length;
		return something.toString();
	}

	// 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型
	let myFavoriteNumber: string | number;
	myFavoriteNumber = 'seven';
	console.log(myFavoriteNumber.length); // 5
	myFavoriteNumber = 7;
	console.log(myFavoriteNumber.length); // 编译时报错
	```

	- 接口
	```TS
	// 简单的例子
	interface Person {
		name: string;
		age: number;
	}

	let tom: Person = {
		name: 'Tom',
		age: 25
	};

	// 可选属性
	interface Person {
		name: string;
		age?: number;
	}

	let tom: Person = {
		name: 'Tom'
	};

	// 任意属性, 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
	interface Person {
		name: string;
		age?: number;
		[propName: string]: string;
	}
	let tom: Person = {
		name: 'Tom',
		// 错误！
		age: 25,
		gender: 'male'
	};


	// 只读属性
	interface Person {
		readonly id: number;
		name: string;
		age?: number;
		[propName: string]: any;
	}

	let tom: Person = {
		name: 'Tom',
		gender: 'male'
	};

	// 错误
	tom.id = 89757;	
	```

	- 数组的类型
	```TS
	// 「类型 + 方括号」表示法
	let fibonacci: number[] = [1, 1, 2, 3, 5];

	// 数组泛型
	let fibonacci: Array<number> = [1, 1, 2, 3, 5];

	// 用接口表示数组
	interface NumberArray {
		[index: number]: number;
	}
	let fibonacci: NumberArray = [1, 1, 2, 3, 5];	

	// any 在数组中的应用, 用 any 表示数组中允许出现任意类型
	let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];

	// 类数组, 类数组（Array-like Object）不是数组类型
	function sum() {
		let args: {
			[index: number]: number;
			length: number;
			callee: Function;
		} = arguments;
	}
	```

	- 函数的类型
	```TS
	function sum(x: number, y: number): number {
		return x + y;
	}

	let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
		return x + y;
	}

	// 用接口定义函数的形状
	interface SearchFunc {
		(source: string, subString: string): boolean;
	}

	let mySearch: SearchFunc;
	mySearch = function(source: string, subString: string) {
		return source.search(subString) !== -1;
	}

	// 可选参数
	function buildName(firstName: string, lastName?: string) {
		if (lastName) {
			return firstName + ' ' + lastName;
		} else {
			return firstName;
		}
	}
	let tomcat = buildName('Tom', 'Cat');
	let tom = buildName('Tom');

	// 参数默认值
	function buildName(firstName: string = 'Tom', lastName: string) {
		return firstName + ' ' + lastName;
	}
	let tomcat = buildName('Tom', 'Cat');
	let cat = buildName(undefined, 'Cat');

	// 剩余参数
	function push(array: any[], ...items: any[]) {
		items.forEach(function(item) {
			array.push(item);
		});
	}

	let a = [];
	push(a, 1, 2, 3);

	// 重载, 我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。
	function reverse(x: number): number;
	function reverse(x: string): string;
	function reverse(x: number | string): number | string | void {
		if (typeof x === 'number') {
			return Number(x.toString().split('').reverse().join(''));
		} else if (typeof x === 'string') {
			return x.split('').reverse().join('');
		}
	}
	```

	- 类型断言, 类型断言（Type Assertion）可以用来手动指定一个值的类型
	```TS
	// 将一个联合类型断言为其中一个类型, 需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误
	interface Cat {
		name: string;
		run(): void;
	}
	interface Fish {
		name: string;
		swim(): void;
	}

	function isFish(animal: Cat | Fish) {
		// 将 animal 断言成 Fish
		if (typeof (animal as Fish).swim === 'function') {
			return true;
		}
		return false;
	}

	// 将一个父类断言为更加具体的子类
	class ApiError extends Error {
		code: number = 0;
	}
	class HttpError extends Error {
		statusCode: number = 200;
	}

	function isApiError(error: Error) {
		// if (error instanceof ApiError) { 这样更佳
		if (typeof (error as ApiError).code === 'number') {
			return true;
		}
		return false;
	}

	// 将任何一个类型断言为 any， 将一个变量断言为 any 可以说是解决 TypeScript 中类型问题的最后一个手段
	// index.ts:1:8 - error TS2339: Property 'foo' does not exist on type 'Window & typeof globalThis'.
	window.foo = 1;
	(window as any).foo = 1;

	// 将 any 断言为一个具体的类型
	function getCacheData(key: string): any {
		return (window as any).cache[key];
	}

	interface Cat {
		name: string;
		run(): void;
	}

	const tom = getCacheData('tom') as Cat;
	tom.run();

	// 类型断言的限制, 若 A 兼容 B，那么 A 能够被断言为 B，B 也能被断言为 A，也就是A extends B
	interface Animal {
		name: string;
	}
	interface Cat {
		name: string;
		run(): void;
	}

	let tom: Cat = {
		name: 'Tom',
		run: () => { console.log('run') }
	};
	let animal: Animal = tom;

	function testAnimal(animal: Animal) {
		return (animal as Cat);
	}
	function testCat(cat: Cat) {
		return (cat as Animal);
	}

	// 总结：
	// 联合类型可以被断言为其中一个类型
	// 父类可以被断言为子类
	// 任何类型都可以被断言为 any
	// any 可以被断言为任何类型
	// 要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可

	// 类型断言 vs 类型转换, 类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除
	function toBoolean(something: any): boolean {
		return something as boolean;
	}

	toBoolean(1);
	// 返回值为 1

	function toBoolean(something: any): boolean {
		return Boolean(something);
	}

	toBoolean(1);
	// 返回值为 true

	// 类型断言 vs 类型声明
	// 前者，A=B, 只需要 A 兼容 B 或 B 兼容 A 即可
	// 后者更严格，A=B，必须B兼容A
	interface Animal {
		name: string;
	}
	interface Cat {
		name: string;
		run(): void;
	}

	const animal: Animal = {
		name: 'tom'
	};
	let tom = animal as Cat;


	interface Animal {
		name: string;
	}
	interface Cat {
		name: string;
		run(): void;
	}

	const animal: Animal = {
		name: 'tom'
	};
	let tom: Cat = animal;

	// index.ts:12:5 - error TS2741: Property 'run' is missing in type 'Animal' but required in type 'Cat'.

	// animal 断言为 Cat，只需要满足 Animal 兼容 Cat 或 Cat 兼容 Animal 即可
	// animal 赋值给 tom，需要满足 Cat 兼容 Animal 才行
	```

	- 声明文件, 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能
	```TS
	// 假如我们想使用第三方库 jQuery，一种常见的方式是在 html 中通过 <script> 标签引入 jQuery，然后就可以使用全局变量 $ 或 jQuery 了。
	// 但是在 ts 中，编译器并不知道 $ 或 jQuery 是什么东西，这个时候就需要声明文件jQuery.d.ts
	jQuery('#foo');
	// ERROR: Cannot find name 'jQuery'.

	// src/jQuery.d.ts
	declare var jQuery: (selector: string) => any;
	```

	- 类型别名
	```TS
	type Name = string;
	```

	- 字符串字面量类型，字符串字面量类型用来约束取值只能是某几个字符串中的一个。
	```TS
	type EventNames = 'click' | 'scroll' | 'mousemove';
	```

	- 元组, 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
	```TS
	let tom: [string, number] = ['Tom', 25];
	```

	- 枚举
	```TS
	enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
	```

	- 类
		- 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法
		- 对象（Object）：类的实例，通过 new 生成
		- 面向对象（OOP）的三大特性：封装、继承、多态
		- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
		- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
		- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat
		- 存取器（getter & setter）：用以改变属性的读取和赋值行为
		- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法
		- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
		- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

	- 类与接口
	```TS
	// 类实现接口
	interface Alarm {
		alert(): void;
	}

	interface Light {
		lightOn(): void;
		lightOff(): void;
	}

	class Car implements Alarm, Light {
		alert() {
			console.log('Car alert');
		}
		lightOn() {
			console.log('Car light on');
		}
		lightOff() {
			console.log('Car light off');
		}
	}


	// 接口继承接口
	interface Alarm {
		alert(): void;
	}

	interface LightableAlarm extends Alarm {
		lightOn(): void;
		lightOff(): void;
	}

	// 接口继承类, 常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的
	class Point {
		x: number;
		y: number;
		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
		}
	}

	interface Point3d extends Point {
		z: number;
	}

	let point3d: Point3d = {x: 1, y: 2, z: 3};
	```

	- 泛型
	```TS
	function createArray(length: number, value: any): Array<any> {
		let result = [];
		for (let i = 0; i < length; i++) {
			result[i] = value;
		}
		return result;
	}

	createArray(3, 'x'); // ['x', 'x', 'x']

	// 多个类型参数
	function swap<T, U>(tuple: [T, U]): [U, T] {
   		return [tuple[1], tuple[0]];
	}

	swap([7, 'seven']); // ['seven', 7]

	// 泛型约束
	interface Lengthwise {
		length: number;
	}

	function loggingIdentity<T extends Lengthwise>(arg: T): T {
		console.log(arg.length);
		return arg;
	}

	loggingIdentity(7);

	// index.ts(10,17): error TS2345: Argument of type '7' is not assignable to parameter of type 'Lengthwise'.	

	// 泛型接口
	interface CreateArrayFunc<T> {
		(length: number, value: T): Array<T>;
	}

	let createArray: CreateArrayFunc<any>;
	createArray = function<T>(length: number, value: T): Array<T> {
		let result: T[] = [];
		for (let i = 0; i < length; i++) {
			result[i] = value;
		}
		return result;
	}

	createArray(3, 'x'); // ['x', 'x', 'x']

	// 泛型类
	class GenericNumber<T> {
		zeroValue: T;
		add: (x: T, y: T) => T;
	}

	let myGenericNumber = new GenericNumber<number>();
	myGenericNumber.zeroValue = 0;
	myGenericNumber.add = function(x, y) { return x + y; };	
	```

	- 声明合并, 如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型
	```TS
	// 函数的合并
	function reverse(x: number): number;
	function reverse(x: string): string;
	function reverse(x: number | string): number | string {
		if (typeof x === 'number') {
			return Number(x.toString().split('').reverse().join(''));
		} else if (typeof x === 'string') {
			return x.split('').reverse().join('');
		}
	}

	// 接口的合并
	interface Alarm {
		price: number;
	}
	interface Alarm {
		weight: number;
	}
	interface Alarm {
		price: number;
		weight: number;
	}
	```

4. Webpack，是一个用于现代 JavaScript 应用程序的静态模块打包器，简单来说，它的主要作用是把各种前端资源（如 JavaScript、CSS、图片、字体等）视为一个个独立的模块，然后将它们打包成浏览器可以理解和运行的静态文件。
   
5. Vite，是一个现代化的前端构建工具，主要用于开发和构建现代 Web 应用。Vite 利用现代浏览器的原生 ES 模块特性，避免了在开发时进行打包，从而提供了更快的开发体验。

6. Vue Router，是 Vue.js 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。
```JS
// demo/src/router\index.js
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
const routes = [
	{
		path: "/", 
		component: () => import("../views/index.vue")
	},
	{
		path: "/content",
		component: () => import("../views/content.vue")
	},
]	
const router = createRouter({
	// 哈希模式，服务端无需特殊配置
	// history: createWebHashHistory(),
	// 历史模式，服务端需要将所有请求重定向到index.html 
	history: createWebHistory(),
	routes
})
export default router

// demo/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
```
```HTML
<!--demo\src\views\index.vue-->
<script setup>
</script>

<template>
	index
</template>

<style scoped>
</style>

<!--demo\src\views\content.vue-->
<script setup>
</script>

<template>
	content
</template>

<style scoped>
</style>

<!--demo\src\App.vue-->
<script setup>
</script>

<template>
	<router-view />
</template>

<style scoped>
</style>
```

7. Pinia, 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。pinia-plugin-persistedstate, 为每个人和每个项目提供对 Pinia store 的持久化。
```JS
// demo/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')

// demo/src/stores/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// demo/src/stores/info.js
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', () => {
  //定义一个响应式对象，存储网站信息
  const info = reactive({
	name: "sz",
	number: 7758521
  })

  return {
	info,
  }
}, {
  persist: true,
})
```
``` HTML
<!--demo/src/App.vue-->
<script setup>
	import { useInfoStore } from './stores/info.js'

	const infoStore = useInfoStore()
	
	console.log("infoStore.info:", infoStore.info)
</script>

<template>
	{{ infoStore.info.name }}
	{{ infoStore.info.number }}
</template>

<style scoped>
</style>
```

8.  ElementPlus, 是一个基于 Vue 3 的 UI 组件库，它提供了一套全面、可复用的组件，用于快速构建桌面端应用。element-plus/icons-vue, Element Plus 提供了一套常用的图标集合。
```JS
// demo/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
// 图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// UI组件库 
import ElementPlus from 'element-plus'
// UI样式
import 'element-plus/dist/index.css'

const app = createApp(App)
// 全局注册 Element Plus 的所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
```
```HTML
<!--demo/src/App.vue-->
<script setup>
</script>

<template>
	<el-icon>
		<Delete />
  	</el-icon>

	<el-button type="primary">主要按钮</el-button>
	<el-button type="success">成功按钮</el-button>
	<el-button type="info">信息按钮</el-button>
	<el-button type="warning">警告按钮</el-button>
	<el-button type="danger">危险按钮</el-button>
</template>

<style scoped>
</style>
```

9. vite-plugin-svg-icons，vite引入svg图标，具体配置看(https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md)

10. Apache ECharts, [一个基于 JavaScript 的开源可视化图表库](https://echarts.apache.org/handbook/zh/get-started/)

11. Axios, 是一个基于 promise 网络请求库，作用于node.js 和浏览器中(https://axios-http.com/zh/docs/instance)。

12. Mitt, 发布/订阅模式（Publish/Subscribe Pattern）

13. Sass/SCSS，一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。使用 Sass 以及 Sass 的样式库（如 Compass）有助于更好地组织管理样式文件，以及更高效地开发项目

14. sass-loader，加载 Sass/SCSS 文件并将他们编译为 CSS。
    
15. style-loader, 将 CSS 代码以 <style> 标签的形式，注入到 HTML 页面中。

16. 杂项
	- Promise, 在异步执行的流程中，把执行代码和处理结果的代码清晰地分离了
	```JS
									┌──────────────────┐
							then    │on_resolve(data) {│
						┌──────────▶│    // TODO       │
						│           │}                 │
	┌────────────────────────┐      └──────────────────┘
	│   new Promise(async)   │
	└────────────────────────┘        ┌──────────────────┐
				│         │           │on_reject(data) { │
				│         └──────────▶│    // TODO       │
		promise│             catch    │}                 │
				│                     └──────────────────┘
				▼
	┌────────────────────────┐
	│async(resolve, reject) {│
	│    // TODO             │
	│}                       │
	└────────────────────────┘


	function log(s) {
		console.log(s);
	}

	new Promise(function (resolve, reject) {
		log('start new Promise...');
		let timeOut = Math.random() * 2;
		log('set timeout to: ' + timeOut + ' seconds.');
		setTimeout(function () {
			if (timeOut < 1) {
				log('call resolve()...');
				resolve('200 OK');
			}
			else {
				log('call reject()...');
				reject('timeout in ' + timeOut + ' seconds.');
			}
		}, timeOut * 1000);
	}).then(function (r) {
		log('Done: ' + r);
	}).catch(function (reason) {
		log('Failed: ' + reason);
	});

	```


	