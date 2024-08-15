<template>
	<div :class="['list context-menu', {'dark': !isLightTheme}]" :style="positioning" ref="context">
		<template v-for="language in languages" >
			<div 
				:class="[`ContextLanguageSelector-${language.value} list__item context-menu__item`, {active: language.value == active}]"
				:key="language.value"
				@click="$emit('selected', language.value)"
			>
				{{ language.label }}
			</div>
		</template>
	</div>
</template>



<script>
import { contextMenuPositioning } from '~/assets/utils/misc'

export default {
	props: {
		active: {
			type: String,
			required: true, 
		},
		isLightTheme: {
			type: Boolean
		}
	},
	data() {
		return {
			positioning: {},
		}
	},
	computed: {
		languages() {
			let options = JSON.parse(JSON.stringify(this.$i18n.locales))
			options.forEach(e => {
				e.label = e.name,
				e.value = e.code
			})
			return options
		}
	},
	mounted() {
		document.getElementById("__nuxt").appendChild(this.$el);
		this.positioning = contextMenuPositioning(this.$refs.context, this.$store.state.language.clickCoords)
	}
}
</script>



<style lang="scss" scoped>
	.context-menu{
		position: absolute;
		z-index: 1100;
		border-radius: 8px !important;
    	box-shadow: 0 6px 30px -2px rgb(0 0 0 / 38%);

		& .active{
			background: $light;
		}

		& :hover{
			background: var(--bib-light-sub1);
		}

		&.dark {
			border: 1px solid var(--bib-border-primary);
			background-color: var(--bib-text);
			color: var(--bib-secondary);
			.active {
				background-color: var(--bib-surface-tertiary);
			}
			:hover {
				background-color: var(--bib-surface-tertiary);
			}
		}
	}
</style>