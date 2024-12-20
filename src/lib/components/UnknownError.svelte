<script lang="ts">
	let { show }: { show: boolean } = $props();
</script>

{#if show}
	<div class="toast toast-end">
		<div class="alert alert-error grid grid-rows-2 gap-0">
			<span>An unknown error has occurred.</span>
            <span>What the <strong>fuck</strong> did you do?</span>
		</div>
	</div>
{/if}

<style>
</style>
