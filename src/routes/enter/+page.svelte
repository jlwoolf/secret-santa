<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<figure>
	<img src="/knee-surgery.jpg" alt="Knee Surgery" />
</figure>
<div class="card-body">
	<h2 class="card-title">Welcome!</h2>
	<p>Have you already signed up?</p>
	<div class="grid grid-cols-4 gap-2">
		<button
			aria-label="yes"
			class="btn btn-primary col-span-2"
			onclick={() => goto('/enter/login')}
		>
			Yes
		</button>
		<button
			aria-label="yes"
			class="btn btn-secondary col-span-2"
			onclick={() => goto('/enter/signup')}
		>
			No
		</button>
	</div>
</div>

<style>
</style>
