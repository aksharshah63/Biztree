import Vue from "vue";

const tooltip = {
	bind(el, binding, vnode){
		if (binding.value == null) return

		/* Move the tooltip away from the mouse cursor, so the tooltip content can be fully read */
		const pushForVisiblity = 5;
		/* Create the tooltip variable element */
		const tooltip = document.createElement('div');

		if (typeof binding.value == 'string') {
			const text = document.createTextNode(binding.value);
			tooltip.appendChild(text);
			tooltip.classList.add('bib-tooltip');
		}
			/* 
			* Get some tooltip dimensions in order to allow visibility in extreme positions 
			* e.g the tooltip is too far to the right, or too low on the screen
			*/
			
				/* Display the tooltip on mouse move */
				el.addEventListener('mousemove',(event)=>{
					/* Insert the tooltip in the DOM */
					document.querySelector('body').appendChild(tooltip);
					const tooltipData = tooltip.getBoundingClientRect()
					/* Watch for the available space on the right for extreme triggering position (too close to the right edge of the screen) */
					let availableRight = window.innerWidth - event.clientX - pushForVisiblity;
					const frame = document.querySelector('body')
					/* Position it on the screen */
					tooltip.style.left = /* Horizontal position */
						( (window.innerWidth - event.clientX - pushForVisiblity) > tooltipData.width ) /* Enough available space on the right edge of the screen ? */
						? (event.clientX + pushForVisiblity) + 'px' /* YES: Position it to the right side of the mouse cursor */
						: (event.clientX - tooltip.offsetWidth) + 'px'; /* NO: Position it to the left side of the mouse cursor */
					
					tooltip.style.top = 
						(event.clientY - tooltipData.height - pushForVisiblity > frame.scrollTop)
						? (event.clientY - tooltipData.height - pushForVisiblity) + 'px'
						: (event.clientY + pushForVisiblity) + 'px'; /* Conditions to dynamically position on the Y axiss to come... */
				});
			/* Remove the tooltip from the DOM once the trigger lost mouse movement */
				el.addEventListener('mouseleave',()=>{
					tooltip.parentNode.removeChild(tooltip);
				})
			/* Remove the tooltip from the DOM once the trigger is clicked */
				el.addEventListener('click',()=>{
					tooltip.parentNode.removeChild(tooltip);
				})
	}
}


Vue.directive('tooltip',tooltip);