<script lang="ts">
	const modules = import.meta.glob(
		'/src/assets/patterns/*/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}'
	);

	type Module<T = { default: string }> = {
		index: number;
		folder: string;
		file: string;
		path: string;
		module: () => Promise<T>;
	};

	const folders = Object.entries(modules).reduce(
		(acc, [path, module], index) => {
			const [folder, file] = path.replace('/src/assets/patterns/', '').split('/');
			if (!acc[folder]) acc[folder] = [];
			acc[folder].push({ index, folder, file, path, module } as Module);
			return acc;
		},
		{} as Record<string, Module[]>
	);

	let img: Module | null = folders[0]?.[0];

	const flatArray = Object.values(folders).flat();

	const nextOrBack = (forward = true) => {
		if (img?.index === undefined) return;

		const length = flatArray.length;
		img = flatArray[(img.index + (forward ? 1 : -1) + length) % length];
	};

	const onNext = () => nextOrBack();
	const onPrevious = () => nextOrBack(false);

	let scale = true;
	let show = true;
</script>

<div class="container">
	<div class="select-container">
		<select tabindex="0" bind:value={img}>
			{#each Object.entries(folders) as [folder, modules]}
				<optgroup label={folder}>
					{#each modules as module}}
						<option value={module}>{module.file}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
		<button tabindex="0" on:click={onPrevious}>Previous</button>
		<button tabindex="0" on:click={onNext}>Next</button>
		<button tabindex="0" on:click={() => (scale = !scale)}>{scale ? 'scaled' : 'original'}</button>
		<button tabindex="0" on:click={() => (show = !show)}>{show ? 'hide' : 'show'}</button>
	</div>
	{#if show}
		<div class="img-container" tabindex="0" on:click={onNext} on:keydown={onNext} role="button">
			{#if img?.path}
				{#await img.module()}
					<p>Loading...</p>
				{:then m}
					{#if m?.default}
						<img class:scale src={m.default} alt={img.file} title={img.file} />
					{:else}
						<p>No path found for {img.file}</p>
					{/if}
				{:catch e}
					<p>Error: {e.message}</p>
				{/await}
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		align-items: center;

		.select-container {
			display: flex;
			flex: 1 1 auto;
			flex-wrap: wrap;
			gap: 1rem;
			margin-bottom: 0.5rem;
		}

		.img-container {
			display: flex;
			flex: 1 1 auto;
			cursor: pointer;

			.scale {
				width: 100%;
			}
		}
	}
</style>
