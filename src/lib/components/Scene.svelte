<script lang="ts">
	import { T } from '@threlte/core';
	import { Float, Grid, OrbitControls } from '@threlte/extras';
</script>

<T.PerspectiveCamera makeDefault position={[-30, 10, 10]}>
	<OrbitControls autoRotate enableDamping autoRotateSpeed={0.5} target.y={1.5} />
</T.PerspectiveCamera>

<Float>
	<T.DirectionalLight intensity={1} position.x={5} position.y={10} color={0xfeff55} />
	<T.AmbientLight intensity={0.5} />
</Float>
