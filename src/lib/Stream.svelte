<script lang="ts">
	import type { StreamProps, VideoDimensions } from './types.js';
	import { useStreamSDK } from './sdk.svelte';
	import { validSrcUrl } from './utils.js';

	let {
		src,
		loading = 'lazy',
		customerCode,
		adUrl,
		controls = false,
		autoplay = false,
		loop = false,
		preload = 'metadata',
		primaryColor,
		letterboxColor,
		defaultTextTrack,
		height = 160,
		width = 285,
		poster,
		muted = $bindable(false),
		currentTime = $bindable(0),
		volume = $bindable(1),
		playbackRate = 1,
		startTime = 0,
		responsive = false,
		class: classes,
		title = 'Video',

		// Events
		onabort,
		oncanplay,
		oncanplaythrough,
		ondurationchange,
		onended,
		onerror,
		onloadeddata,
		onloadedmetadata,
		onloadstart,
		onpause,
		onplay,
		onplaying,
		onprogress,
		onratechange,
		onseeked,
		onseeking,
		onstalled,
		onsuspend,
		ontimeupdate,
		onvolumechange,
		onwaiting,
		onstreamadstart,
		onstreamadend,
		onstreamadtimeout
	}: StreamProps = $props();

	let iframeElement = $state<HTMLIFrameElement>();

	let videoDimensions = $state<VideoDimensions>({
		videoHeight: Number(height) || 0,
		videoWidth: Number(width) || 0
	});

	let computedSrc = $derived.by(() => {
		let url = new URL(
			customerCode
				? `https://customer-${customerCode}.cloudflarestream.com/${src}/iframe`
				: `https://iframe.cloudflarestream.com/${src}`
		);

		let searchParams = new URLSearchParams({
			startTime: startTime.toString(),
			preload: preload.toString()
		});

		if (poster) searchParams.set('poster', poster);
		if (adUrl) searchParams.set('adUrl', adUrl);
		if (defaultTextTrack) searchParams.set('defaultTextTrack', defaultTextTrack);
		if (primaryColor) searchParams.set('primaryColor', primaryColor);
		if (letterboxColor) searchParams.set('letterboxColor', letterboxColor);
		if (muted) searchParams.set('muted', 'true');
		if (loop) searchParams.set('loop', 'true');
		if (autoplay) searchParams.set('autoplay', 'true');
		if (!controls) searchParams.set('controls', 'false');

		url.search = searchParams.toString();

		return url.toString();
	});

	const sdk = useStreamSDK();

	// While it's easier for most consumers to simply provide the video UID
	// or signed token and have us compute the iframe's src for them, some
	// consumers may need to manually specify the iframe's src.
	const iframeSrc = $derived(validSrcUrl(src) ? src : computedSrc);

	let loaded = $state(false);

	$effect(() => {
		if (typeof sdk.stream == 'function' && iframeElement && !loaded) {
			const player = sdk.stream(iframeElement);
			loaded = true;

			player.addEventListener('loadedmetadata', (e) => {
				if (player.videoHeight && player.videoWidth) {
					videoDimensions = {
						videoHeight: player.videoHeight,
						videoWidth: player.videoWidth
					};
				}

				if (onloadedmetadata) onloadedmetadata(e);
			});

			// Add all other event listeners
			if (onloadstart) player.addEventListener('loadstart', onloadstart);
			if (onloadeddata) player.addEventListener('loadeddata', onloadeddata);
			if (onprogress) player.addEventListener('progress', onprogress);
			if (oncanplay) player.addEventListener('canplay', oncanplay);
			if (oncanplaythrough) player.addEventListener('canplaythrough', oncanplaythrough);
			if (onplay) player.addEventListener('play', onplay);
			if (onplaying) player.addEventListener('playing', onplaying);
			if (onpause) player.addEventListener('pause', onpause);
			if (onended) player.addEventListener('ended', onended);
			if (onwaiting) player.addEventListener('waiting', onwaiting);
			if (ontimeupdate) player.addEventListener('timeupdate', ontimeupdate);
			if (ondurationchange) player.addEventListener('durationchange', ondurationchange);
			if (onseeking) player.addEventListener('seeking', onseeking);
			if (onseeked) player.addEventListener('seeked', onseeked);
			if (onerror) player.addEventListener('error', onerror);
			if (onabort) player.addEventListener('abort', onabort);
			if (onstalled) player.addEventListener('stalled', onstalled);
			if (onsuspend) player.addEventListener('suspend', onsuspend);
			if (onvolumechange) player.addEventListener('volumechange', onvolumechange);
			if (onratechange) player.addEventListener('ratechange', onratechange);
			if (onstreamadstart) player.addEventListener('streamadstart', onstreamadstart);
			if (onstreamadend) player.addEventListener('streamadend', onstreamadend);
			if (onstreamadtimeout) player.addEventListener('streamadtimeout', onstreamadtimeout);
		}
	});
</script>

{#snippet iframe()}
	<iframe
		{title}
		bind:this={iframeElement}
		src={iframeSrc}
		style:position={responsive ? 'absolute' : undefined}
		style:top={responsive ? 0 : undefined}
		style:left={responsive ? 0 : undefined}
		style:right={responsive ? 0 : undefined}
		style:bottom={responsive ? 0 : undefined}
		style:height={responsive ? '100%' : undefined}
		style:width={responsive ? '100%' : undefined}
		{height}
		{width}
		class={responsive ? undefined : classes}
		{loading}
		frameBorder={0}
		allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
		allowFullScreen
	></iframe>
{/snippet}

{#if responsive}
	<div
		class={classes}
		style="position: relative; aspect-ratio: {videoDimensions.videoWidth} / {videoDimensions.videoHeight}"
	>
		{@render iframe()}
	</div>
{:else}
	{@render iframe()}
{/if}
