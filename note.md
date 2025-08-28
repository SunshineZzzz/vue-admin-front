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
	