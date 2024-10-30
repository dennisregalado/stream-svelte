const scriptSrc = "https://embed.cloudflarestream.com/embed/sdk.latest.js";

export const safelyAccessStreamSDK = () => {
    if (typeof window === "undefined") return undefined;
    return window.Stream;
};

let stream = $state(safelyAccessStreamSDK());

export function useStreamSDK() {
    $effect(() => {
        if (!stream) {
            const existingScript = document.querySelector<HTMLScriptElement>(`script[src='${scriptSrc}']`);
            const script = existingScript ?? document.createElement("script");

            const onload = () => {
                const sdk = safelyAccessStreamSDK();

                if (sdk) {
                    stream = sdk;
                }

                script.removeEventListener('load', onload);
            };

            script.addEventListener("load", onload);

            if (!existingScript) {
                script.setAttribute('data-cfasync', 'false');
                script.setAttribute('defer', 'true');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', scriptSrc);
                document.head.appendChild(script);
            }
        }
    });

    return {
        get stream() {
            return stream;
        }
    }
}
