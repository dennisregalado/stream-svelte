<script lang="ts">
	import { Stream } from '$lib';
</script>

<Stream autoplay muted src="f83004f17e05034731ce728371dbb474" />

<Stream
	volumechange={() => console.log('volumechange')}
	src="f83004f17e05034731ce728371dbb474"
	width={285}
	height={160}
	autoplay
	controls
	muted
	startTime={10}
/>

<Stream
	src="f83004f17e05034731ce728371dbb474"
	width={285}
	height={160}
	responsive
	customerCode="8d66fkpkomknfu4e"
/>
