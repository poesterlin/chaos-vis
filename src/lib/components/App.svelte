<script lang="ts">
	import { Canvas, T, useTask } from '@threlte/core';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
	import { onMount, tick } from 'svelte';
	import { Vector3 } from 'three';
	import Scene from './Scene.svelte';

	export let data: Float32Array;
	export let shiftBetweenDimensions = 200;
	export let zoom = 20;
	export let maxElements = 5000;
	export let stepSize = 5;
  
	let startIdx = 0;
	let path: Vector3[] = [];
	let balls: { idx: number; position: Vector3; lerp: number }[] = [];

	function getPath(data: Float32Array, length = maxElements): Vector3[] {
		const p: Vector3[] = [];
    let counter = 0;
		for (let i = startIdx; i < data.length && counter < length; i += stepSize) {
			const value = new Vector3(
				sqrt(data[i]),
				sqrt(data[i + shiftBetweenDimensions]),
				sqrt(data[i + shiftBetweenDimensions * 2])
			);

			p.push(value.multiplyScalar(zoom));
      counter++;
		}

		return p;
	}

	function sqrt(x: number): number {
		if (x === undefined) {
			return 0;
		}

		if (x < 0) {
			return sqrt(-x) * -1;
		}

		return Math.sqrt(x);
	}

	$: {
		if (shiftBetweenDimensions && maxElements && stepSize && data.length) {
			reset();
		}
	}

	async function reset() {
		path = [];
		await tick();
		path = getPath(data);
		initBalls();
	}

	function findClosestPoints(points: Vector3[], referencePoint: Vector3, n: number) {
		// Calculate distances from reference point and store with index
		const distances = points.map((point, index) => ({
			index,
			distance: point.distanceTo(referencePoint)
		}));

		// Sort by distance
		distances.sort((a, b) => a.distance - b.distance);

		// Return the 'n' closest points
		return distances.slice(0, n).map((d) => d.index);
	}

	function initBalls() {
		const start = path[0];

		// find indices of close points in path
		const closePoints = findClosestPoints(path, start, 120);

		balls = closePoints.map((idx) => ({
			idx,
			position: path[idx],
			lerp: 0
		}));
	}

  let frame = 0;
	onMount(() => {
		const interval = setInterval(() => updateBalls(), 1000 / 60);
		return () => clearInterval(interval);
	});

	function updateBalls() {
    frame++;
		const max = path.length;
		const distancePerFrame = 0.08;
		const shiftPerFrame = 30;

		balls.forEach((ball) => {
			let distanceTraveled = 0;
			while (distanceTraveled < distancePerFrame) {
				const current = ball.position.clone();
				const nextIdx = (ball.idx + 1) % max;
				const next = path[nextIdx].clone();

				if (ball.lerp > 1) {
					ball.idx = nextIdx;
					ball.position = next;
					ball.lerp = 0;
				} else {
					ball.lerp += 0.1;
					ball.position.lerp(next, ball.lerp);
				}

				distanceTraveled += current.distanceTo(ball.position);
			}

			// shift path
			ball.idx -= shiftPerFrame;
			if (ball.idx < 0) {
				ball.idx = max + ball.idx;
				ball.position = path[ball.idx].clone();
        ball.lerp = 0;
			}
		});

		balls = [...balls];

		// update path
		startIdx += shiftPerFrame;
		if (startIdx > data.length) {
			startIdx = 0;
		}
    const newPaths = getPath(data, shiftPerFrame);

    path.splice(0, newPaths.length);
    path.push(...newPaths);
    path = path;
	}
</script>

<Canvas>
	<Scene />
	{#if path.length}
		<T.Mesh>
			<MeshLineGeometry points={path} />
			<MeshLineMaterial width={0.06} color="#bdd5ea" transparent opacity={0.08} />
		</T.Mesh>

		{#each balls as ball}
			<T.Mesh position={ball.position.toArray()}>
				<T.SphereGeometry args={[0.08, 15, 15]} />
				<T.MeshStandardMaterial color="#fe5f55" />
			</T.Mesh>
		{/each}
	{/if}
</Canvas>
