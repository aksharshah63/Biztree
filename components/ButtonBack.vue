<template>
	<div 
		class="button-back"
		:class="{'button-back--visible': $store.state.gui.backButtonVisible}"
		@click="goBack"
	>
		<bib-icon icon="arrow-left" variant="primary-24"></bib-icon>
	</div>
</template>



<script>
export default {
	methods: {
		goBack() {
			this.$mobile.emit("backbutton")
			this.$router.back()
		}
	}
}
</script>



<style lang="scss" scoped>
.button-back {
	width: 2rem;
	height: 2rem;
	content: "";
	background-color: $white;
	border-radius: 50%;
	box-shadow: 0 1px 8px 0 rgba(#262626,0.50);
	z-index: 10;
	display: grid;
	place-items: center;
	transform: translateX(-5px);
	opacity: 0;
	transition: all .2s ease;
	&--visible {
		transform: translateX(0);
		opacity: 1;
	}
}
</style>