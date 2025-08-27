1. 什么是Vue，是一款用于构建用户界面的JavaScript框架，特点：
	- 声明式渲染，Vue基于标准HTML拓展了一套模板语法，使得我们可以声明式地描述最终输出的HTML和JavaScript状态之间的关系。
	- 响应性，Vue会自动跟踪JavaScript状态并在其发生变化时响应式地更新DOM
	- 渐进式框架，按需引入Vue.js的部分功能, 而不必全量引入整个框架
	- 组件框架，可复用、封装好的自定义HTML标签
	
2. 快速上手，具体细节要看vue3文档
	- 模板语法
	```HTML
	<div id="app">
		{{ msg }}

		<h2>{{ people.name }}</h2>
		<h3>{{ people.number }}</h3>
	</div>
	```
	```JS
	const { createApp, reactive } = Vue

	createApp({
		setup() {
			const people = reactive({
				name: "sz",
				number: 1111
			})

			return {
				msg: "11111",
				people
			}
		}
	}).mount("#app")
	```

	- 

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
		<!--文本框-->
		<input type="text" v-model="data.text">
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