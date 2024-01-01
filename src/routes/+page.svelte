<script lang="ts">
	import App from '$lib/components/App.svelte';
	import { readWavData } from '$lib/analyzer';

	let data: Float32Array = new Float32Array();
	let shiftBetweenDimensions = 400;
	let maxElements = 7000;
	let startIdx = 40000;
	let stepSize = 3;
	let running = false;

	function start() {
		if (data.length) return;
		analyzeWav();
	}

	async function analyzeWav() {
		const audio = await readWavData();
		data = new Float32Array(audio.getChannelData(0));
		shiftBetweenDimensions = 200;
		running = true;
	}
</script>

{#if !running}
	<dialog open>
		<p>Start analyzing audio file</p>
		<button on:click={start}>Start</button>
	</dialog>
{/if}

<div class="container">
	<div class="controls">
		<label for="shift">Shift between Dimensions ({shiftBetweenDimensions})</label>
		<input type="range" id="shift" bind:value={shiftBetweenDimensions} min="100" max="1000" />

		<label for="maxElements">Max Elements ({maxElements})</label>
		<input type="range" id="maxElements" bind:value={maxElements} min="10" max="10000" />

		<label for="startIdx">Start Index ({startIdx})</label>
		<input type="range" id="startIdx" bind:value={startIdx} min="0" max={data.length} />

		<label for="stepSize">Step Size ({stepSize})</label>
		<input type="range" id="stepSize" bind:value={stepSize} min="1" max="10" />
	</div>

	<App {data} {maxElements} {shiftBetweenDimensions} {startIdx} {stepSize} />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
	}

	div.container {
		width: 100vw;
		height: 100vh;
		background: #495867;
		background: linear-gradient(180deg, #1c1f22 0%, #577399 100%);
	}

	div.controls {
		position: absolute;
		top: 0;
		left: 0;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		display: flex;
		flex-direction: column;
	}

	dialog {
		inset: 0;
		border: none;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		background: #577399;
		color: white;
		font-size: 1rem;
		cursor: pointer;
	}
</style>
