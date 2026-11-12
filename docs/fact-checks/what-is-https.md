```json fact-check
{
  "slug": "what-is-https",
  "hash": "b79d89d08503b8c3e3af090731f48e5875541e4d3c8c91b12f252302bfc077a6",
  "checked": "2026-11-11",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].osi": "✅",
    "backing (the lesson's subtitle and summary)": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].scene.backing (the scene)": "✅",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Port\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Is\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Proves the site with\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"client-request\")": "✅",
    "units[0].steps[0].facts[0] (step \"client-request\", fact \"URL\")": "✅",
    "units[0].steps[0].facts[1] (step \"client-request\", fact \"Scheme\")": "✅",
    "units[0].steps[0].facts[2] (step \"client-request\", fact \"Before the page\")": "✅",
    "units[0].steps[0].facts[3] (step \"client-request\", fact \"HSTS\")": "✅",
    "units[0].steps[1] (step \"dns-resolution\")": "✅",
    "units[0].steps[1].facts[0] (step \"dns-resolution\", fact \"Asks\")": "✅",
    "units[0].steps[1].facts[1] (step \"dns-resolution\", fact \"Answer\")": "✅",
    "units[0].steps[1].facts[2] (step \"dns-resolution\", fact \"Sealed?\")": "✅",
    "units[0].steps[1].facts[3] (step \"dns-resolution\", fact \"To hide it\")": "✅",
    "units[0].steps[1].events[0] (event \"m1\")": "✅",
    "units[0].steps[1].events[1] (event \"m2\")": "✅",
    "units[0].steps[1].events[2] (event \"seen-1\")": "✅",
    "units[0].steps[2] (step \"tcp-connection\")": "✅",
    "units[0].steps[2].facts[0] (step \"tcp-connection\", fact \"From\")": "✅",
    "units[0].steps[2].facts[1] (step \"tcp-connection\", fact \"To\")": "✅",
    "units[0].steps[2].facts[2] (step \"tcp-connection\", fact \"Messages\")": "✅",
    "units[0].steps[2].facts[3] (step \"tcp-connection\", fact \"Sealed?\")": "✅",
    "units[0].steps[2].events[0] (event \"m3\")": "✅",
    "units[0].steps[2].events[1] (event \"m4\")": "✅",
    "units[0].steps[2].events[2] (event \"m5\")": "✅",
    "units[0].steps[2].events[3] (event \"seen-2\")": "✅",
    "units[0].steps[3] (step \"tls-handshake\")": "✅",
    "units[0].steps[3].facts[0] (step \"tls-handshake\", fact \"Version\")": "✅",
    "units[0].steps[3].facts[1] (step \"tls-handshake\", fact \"Certificate for\")": "✅",
    "units[0].steps[3].facts[2] (step \"tls-handshake\", fact \"Shared key made by\")": "✅",
    "units[0].steps[3].facts[3] (step \"tls-handshake\", fact \"Costs\")": "✅",
    "units[0].steps[3].events[0] (event \"m6\")": "✅",
    "units[0].steps[3].events[1] (event \"seen-3\")": "✅",
    "units[0].steps[3].events[2] (event \"m7\")": "✅",
    "units[0].steps[3].events[3] (event \"m8\")": "✅",
    "units[0].steps[3].events[4] (event \"seen-4\")": "✅",
    "units[0].steps[4] (step \"encrypted-http-exchange\")": "✅",
    "units[0].steps[4].facts[0] (step \"encrypted-http-exchange\", fact \"Inside\")": "✅",
    "units[0].steps[4].facts[1] (step \"encrypted-http-exchange\", fact \"On the wire\")": "✅",
    "units[0].steps[4].facts[2] (step \"encrypted-http-exchange\", fact \"Cipher\")": "✅",
    "units[0].steps[4].facts[3] (step \"encrypted-http-exchange\", fact \"A watcher sees\")": "✅",
    "units[0].steps[4].events[0] (event \"m9\")": "✅",
    "units[0].steps[4].events[1] (event \"seen-5\")": "✅",
    "units[0].steps[4].events[2] (event \"m10\")": "✅",
    "units[0].steps[4].events[3] (event \"seen-6\")": "✅",
    "units[0].steps[5] (step \"secure-session\")": "✅",
    "units[0].steps[5].facts[0] (step \"secure-session\", fact \"Padlock means\")": "✅",
    "units[0].steps[5].facts[1] (step \"secure-session\", fact \"Doesn’t mean\")": "✅",
    "units[0].steps[5].facts[2] (step \"secure-session\", fact \"Next visit\")": "✅",
    "units[0].steps[5].facts[3] (step \"secure-session\", fact \"Certificates last\")": "✅",
    "units[0].steps[5].events[0] (event \"m11\")": "✅",
    "units[0].steps[5].events[1] (event \"m12\")": "✅",
    "units[0].steps[5].events[2] (event \"seen-7\")": "✅",
    "units[0].steps[5].events[3] (event \"m13\")": "✅",
    "units[0].steps[0].deep[0] (step \"client-request\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"dns-resolution\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"tcp-connection\", Go deeper)": "⚠️",
    "units[0].steps[3].deep[0] (step \"tls-handshake\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"encrypted-http-exchange\", Go deeper)": "⚠️",
    "units[0].steps[5].deep[0] (step \"secure-session\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-https\")": "✅",
    "units[0].learn.terms[1] (\"term-port\")": "✅",
    "units[0].learn.terms[2] (\"term-handshake\")": "✅",
    "units[0].learn.terms[3] (\"term-cert\")": "✅",
    "units[0].learn.terms[4] (\"term-ca\")": "✅",
    "units[0].learn.terms[5] (\"term-key\")": "✅",
    "units[0].learn.terms[6] (\"term-encrypted\")": "✅",
    "units[0].learn.terms[7] (\"term-html\")": "✅",
    "units[0].learn.terms[8] (\"term-padlock\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.why[2] (\"why-3\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-port\")": "✅",
    "units[0].learn.facts[1] (\"fact-is\")": "✅",
    "units[0].learn.facts[2] (\"fact-certs\")": "✅",
    "units[0].learn.facts[3] (\"fact-watch\")": "⚠️",
    "units[0].learn.facts[4] (\"fact-defined\")": "✅",
    "units[0].learn.facts[5] (\"fact-used\")": "✅",
    "units[0].learn.facts[6] (\"fact-osi\")": "✅",
    "units[0].learn.facts[7] (\"fact-dns\")": "✅",
    "units[0].learn.facts[8] (\"fact-dns-plain\")": "✅",
    "units[0].learn.facts[9] (\"fact-tcp\")": "✅",
    "units[0].learn.facts[10] (\"fact-rides\")": "✅",
    "units[0].learn.facts[11] (\"fact-tls\")": "✅",
    "units[0].learn.facts[12] (\"fact-kx\")": "✅",
    "units[0].learn.facts[13] (\"fact-inside\")": "✅",
    "units[0].learn.facts[14] (\"fact-type\")": "✅",
    "units[0].learn.facts[15] (\"fact-files\")": "✅",
    "units[0].learn.facts[16] (\"fact-records\")": "✅",
    "units[0].learn.facts[17] (\"fact-drawing\")": "✅",
    "units[0].learn.facts[18] (\"fact-ticket\")": "✅",
    "units[0].learn.facts[19] (\"fact-validity\")": "✅",
    "units[0].learn.facts[20] (\"fact-honest\")": "✅",
    "units[0].practice[0].options[0] (question \"cafe-wifi\")": "✅",
    "units[0].practice[0].options[1] (question \"cafe-wifi\")": "⚠️",
    "units[0].practice[0].options[2] (question \"cafe-wifi\")": "✅",
    "units[0].practice[1].options[0] (question \"padlock\")": "✅",
    "units[0].practice[1].options[1] (question \"padlock\")": "✅",
    "units[0].practice[1].options[2] (question \"padlock\")": "✅",
    "units[0].practice[0].prompt (question \"cafe-wifi\")": "✅",
    "units[0].practice[1].prompt (question \"padlock\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-cert-validity",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "cloudflare-dns-encryption",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "cloudflare-lb-proxy-modes",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "cloudflare-mixed-content",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "cloudflare-pqc-support",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "google-chrome-always-secure",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "google-chrome-secure",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-media-types",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-ports",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "letsencrypt-faq",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "letsencrypt-how",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-app-gateway",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-edge-https-first",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-edge-secure",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-10024",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1034",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1035",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-5280",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-6066",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-6797",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7748",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7858",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8484",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8555",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9000",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9001",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9076",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9111",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9112",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9114",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9308",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9499",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9525",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9846",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9849",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "whatwg-fetch",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "whatwg-html",
      "current": true,
      "checked": "2026-11-11"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 208,
    "digest": "556d5b7a3c007640400cbbb7602f2071e205e17e70d0af071abb67e408eed6f1",
    "files": {
      "microsoft-app-gateway": "164a9b0c03be5f81a5bdeafbc75dbc3b419e1653eaf759b5c5a78711f0517f12",
      "cloudflare-lb-proxy-modes": "4e3984dd649ac61f58922d676250f80e45abfbfdb28392e387374e8a96f8b09d",
      "microsoft-edge-https-first": "a2a2a2fc4088ba7224e0998f88dae92bfee130c59c452ee95f74d17fa95d8d67",
      "google-chrome-always-secure": "25370589bf498265dd9b87ccc89d467f31f6dc1defd5fd51df28184ef9c389e5",
      "rfc-6797": "7cefa03f77547532580b7f877b4e6388bb66c20631b624667a0065c14ae3d364",
      "whatwg-fetch": "63b0a018753c330adf1e40417524eb70ea02d4d3e123bcb39b6770f23bad911b",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-9076": "72f6af2881db0300033c3ea7d02f37bf0cd3da09b747eda8b22b8032a4878bf0",
      "rfc-8484": "c2cb41fb72bf45935ba7372fef9d83478ed2ecc7f3749ea9a16b52b06ef0f343",
      "rfc-7858": "872e634c8d5ca4219a90147d356570e7d10046ad12d560e7d8b24f3aa340fdf0",
      "cloudflare-dns-encryption": "bf6ab8fa8e915522d7bae952b42c5c8c39c2f2cf22acffaef44e96577d18d0b8",
      "rfc-9849": "56cf7f40c41b2566bfe9c3df18e73cd649b7c0e33690439a43582a65a3b3a0cc",
      "rfc-9308": "ebe07ab0c29b58548a43c81f7efdb455661d7282a7cc114c11023522e5142946",
      "iana-ports": "6f1b1cfc45642ea7c33da93581249779ea0814339a0389d9cb49b69b8ae247e3",
      "rfc-9114": "6b84555c88eeebcf5d2b2e1d9d7b58630abc97ab877b2cf62dee4cd635db34e4",
      "rfc-9001": "3bbaecdf5afd278052a2c48348ce118c4ff8d0cf6b9915549858171b3f98a591",
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17",
      "rfc-10024": "5efcfacef53549ec4ff57450dfec28085b34cf3f34d829c541c0ddbe19230dfe",
      "cloudflare-pqc-support": "c9cb91d75b5433df9f8656c4912015f04653dd6b6808cd79dfa782eab5bbc859",
      "rfc-6066": "6a33cceaa5e1b6518923d9d04ffaa738bad0417806b3c94a995484e140f5cbc0",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937",
      "cloudflare-mixed-content": "060e2d548f5799870b280ff26585d51df11df34eac9bb528b2eb37c7b9065b08",
      "microsoft-edge-secure": "1260751a018ccc041b451c2c807b3838298ecc5fcac289bd4f80b1f567f5155d",
      "rfc-5280": "a2f2628c0a83b873fc4786abd921f9b2c02395954b655d190bf16b831633345d",
      "rfc-9525": "ed8116c2435376dffe37ec2ca688c3a8515e36820852b29e0b6cdfbe92abd2c5",
      "rfc-8555": "a40983bbf91f2bd3a976d1c16520aa4418c02ba6d6f1ddcaf772881f823b2497",
      "rfc-7748": "279ca0ecc5e92e2962e27b846986aeb74729d9dd34bd4a04a362f80dcb596ad3",
      "whatwg-html": "2ddbf73daa336540be694147ac80ab34237268de9167d29ac99528e79df64213",
      "google-chrome-secure": "227541ac19b661daf1d823dcfec6e873955b3c608b2f0379c9a94ee80cd7ae39",
      "letsencrypt-how": "8c6a26c33a4d87d3f74329beb8f01f4b4e6adf9d3ef769bb50380e1eee7b4795",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a",
      "rfc-9499": "270b62df854911dddd246f6c081952106897983a5e02dfe8b3819d72843d9ab1",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-9000": "f88aae47f8b18e102024916e975e919201d8dde689cba79b01079eaedd402e22",
      "iana-media-types": "018b355e0d521c3a9b20a853ccb3d118100fbf9cb7a5fb46909f6edb7ce4c60d",
      "rfc-9111": "aeb52adb3279d5f23dae34f68af11bd5cef0a0aff7ffcd014c9ca93c5302cf3e",
      "cloudflare-cert-validity": "7ceb0d08ce78dfc73e27c09cf19dbc46121d1ddf1ca6d84dd4c04f534ce0c3b9",
      "letsencrypt-faq": "02ce1e52fd420f28f2b63fc150e78bcd931a2eed43855edc1540e8a3f38072d9"
    }
  },
  "items": {
    "title": "440b98121c21b7d938d28f809a2120507daf37e3d8c8eb0bc42ff1f0a07d783f",
    "units[0].name": "58c9b60692d51f3e5e2ec5654d3df7851b8e9f0fa4d1e2e031aea0bedc55d90b",
    "units[0].osi": "01f62c28148a5e3d4883950c1312ab3cad06e82af399e4aeee80b8273592c10b",
    "backing (the lesson's subtitle and summary)": "43ddc73257ce9d13428565fb2acc1134b1da5a4bd0e2cedfc33fe4f45a0a31c3",
    "units[0].backing (the unit's full name and purpose)": "2ba338707085903603d991285e512b50f5fbd9d7983bcbab352667468d3c4268",
    "units[0].scene.backing (the scene)": "5ae377178e0509adf3f28e9bfd50804334f69713e541f0dadd49783e45718a12",
    "units[0].overview.hookBacking (the Overview hook)": "9f3d456df831003d64648adf43f7d736d60b5194e60be8eb7be377c6ffca371e",
    "units[0].overview.backing (the Overview description)": "409203a308cc486eda467b0b5bf8b47db2c52b55d24e5ec2a23f8032233eec4e",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "fad05f4c653b7ae6da7306914a82916d4d25d3b3435521b79dd91ee23eb5679f",
    "units[0].overview.facts[1] (Overview fact \"Port\")": "2ccf7f1c1fc0ffa5b0b8d7a1b3fd3820202e646074725209f83b2eaff3c9019c",
    "units[0].overview.facts[2] (Overview fact \"Is\")": "451ad022dc247e717033194e3f6b910d7b12479f6dccd802cd160b7b4bfe27df",
    "units[0].overview.facts[3] (Overview fact \"Proves the site with\")": "948fa8135a7aeedc271b59fead34ca5c5047e1dad9b55320bed3eb064486a250",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "33728f08a7c17d7e8aa226ec05570ccda2c731484659b99d2c5c6741af4efdf4",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "a2982d7d0d08dcac52a63d87e8db7e60308a758e056566afb8bc3967a7e969c2",
    "units[0].steps[0] (step \"client-request\")": "0f4da2398030048e3c0f40acbcf104525ea06278644155ba058c345d3e571672",
    "units[0].steps[0].facts[0] (step \"client-request\", fact \"URL\")": "269ab78053465b1f666a7fe7c9c5c196ea74fb8c03240a7cbb3ae8120375fefc",
    "units[0].steps[0].facts[1] (step \"client-request\", fact \"Scheme\")": "5c9d717d893342cea485ca69bbc85ebc6190e4b69da5918666df94a702bd03a5",
    "units[0].steps[0].facts[2] (step \"client-request\", fact \"Before the page\")": "5c9dd871669b4062f860a633c8b11fccdd5960a7f5ca892c033dfe53c83ef524",
    "units[0].steps[0].facts[3] (step \"client-request\", fact \"HSTS\")": "9f27d6a65227000224d56a6141299039202a01be393720ff7f0a4be0491e58e0",
    "units[0].steps[1] (step \"dns-resolution\")": "f218409df0eb87b648ac8770e8c78d6b8ef2e5196d5b8cd6dc2e48392c427f6b",
    "units[0].steps[1].facts[0] (step \"dns-resolution\", fact \"Asks\")": "5d4ebc0953ab95bc3364e9b5660fbf8e92ea71351aee472068ddf6e1641547aa",
    "units[0].steps[1].facts[1] (step \"dns-resolution\", fact \"Answer\")": "8c6c09cbc5a2a1d3d065bd66160784fb45bf7faff99f19d94b46a19f26d6c9b1",
    "units[0].steps[1].facts[2] (step \"dns-resolution\", fact \"Sealed?\")": "f7066d2fe6563c0bfc7667f2aa3156ba06638634adcd137edbd797f8b18b5966",
    "units[0].steps[1].facts[3] (step \"dns-resolution\", fact \"To hide it\")": "61973b607680fe232296c1ef2b8a740dd8e288f69efd29358f400ff639ba6c8b",
    "units[0].steps[1].events[0] (event \"m1\")": "3e05e7846c3f84845358361bccdd90627e195e80d76b333e39b9ff86f9ec0cbe",
    "units[0].steps[1].events[1] (event \"m2\")": "a1398313e5c7e34f8d211eeb2f9d3607d77a93705db94b496aee0dbf6b451b96",
    "units[0].steps[1].events[2] (event \"seen-1\")": "6465257e8cbdb98af3b679461615bef7436ee07965704d2d627cafbdb9662d40",
    "units[0].steps[2] (step \"tcp-connection\")": "ddee7390f440233ba187939d601a621763b3a7a9e38d31aaa8ba1e3531b0ea6b",
    "units[0].steps[2].facts[0] (step \"tcp-connection\", fact \"From\")": "9d035dfb266c1b42fdee91d9b32f9127558b21be2b99d4a99dbd0cd27cc19b84",
    "units[0].steps[2].facts[1] (step \"tcp-connection\", fact \"To\")": "4768682c070ea25631c3a61bccf3c8738f7bfe73fcf5ba437e1d2604f6c828a9",
    "units[0].steps[2].facts[2] (step \"tcp-connection\", fact \"Messages\")": "76d9c2e2b76012e2d4c3f318dfbec9dfa34cc46caa54b9ee8b6bb18bd88654fd",
    "units[0].steps[2].facts[3] (step \"tcp-connection\", fact \"Sealed?\")": "851928f13643bbb0f100c91912375bb833f52cb58749c6d227705b6835e40c97",
    "units[0].steps[2].events[0] (event \"m3\")": "678b2ac6537e979014bdd8edc7d9f6919a51bbd310a5bc17348503219f01de55",
    "units[0].steps[2].events[1] (event \"m4\")": "1bf6ff758fa883a4fd41dd9157efbc9a04d969bc0e7fa4a204c971733c84f06c",
    "units[0].steps[2].events[2] (event \"m5\")": "89f632c9b078ebd3b1096f951ef4f03f0e463c802dd2efb560bced4b3ef16568",
    "units[0].steps[2].events[3] (event \"seen-2\")": "f3a13c238f243b36f6adb901291e849f62fdbd6fcf5ab694c9ec9277517f59c8",
    "units[0].steps[3] (step \"tls-handshake\")": "37a53730d714c9c647f37ac6e5618fbc1520a61df89374fb323c89e6440a91a7",
    "units[0].steps[3].facts[0] (step \"tls-handshake\", fact \"Version\")": "7fa5be9cb6e42bcb9d7148616c3a22ebce08e5a72edac3c648702a5bacb3110a",
    "units[0].steps[3].facts[1] (step \"tls-handshake\", fact \"Certificate for\")": "f53410c0f381632faa07b298a6b9a8edfac53308bc65d7e82d7700ac966b2370",
    "units[0].steps[3].facts[2] (step \"tls-handshake\", fact \"Shared key made by\")": "5587361cef8956402527676a105bb37005a309e42b9f352ff5ab66b34c204ddf",
    "units[0].steps[3].facts[3] (step \"tls-handshake\", fact \"Costs\")": "76925986e960300a98feb733bac20f0bb05066f5ddb4db1936beb1d786b2198f",
    "units[0].steps[3].events[0] (event \"m6\")": "9793a14ce60eb5863164174a2972c169925d25b9cb01bbaa7706d950ce7bdf16",
    "units[0].steps[3].events[1] (event \"seen-3\")": "b949e3048f85258c6abe3039e6151dab67122a199292ad5ea94081f76acd891d",
    "units[0].steps[3].events[2] (event \"m7\")": "ce583123225cc7cbb70c95588994007c5b4d7226a5a0a3ac679bf004bea0a6be",
    "units[0].steps[3].events[3] (event \"m8\")": "02d0fdefc83fb5769bf1be5189f488a586c4e168d3d808d371ab65746056fedd",
    "units[0].steps[3].events[4] (event \"seen-4\")": "76c8e306028fe4f665e5027a79bc10e312b4c3b6e3ca7d13cc328b43de3ffc12",
    "units[0].steps[4] (step \"encrypted-http-exchange\")": "9694ffb467df4f69a17c880bb05b7f0a2f8e0c5398f0d8757631f67b3f9151b2",
    "units[0].steps[4].facts[0] (step \"encrypted-http-exchange\", fact \"Inside\")": "b55c904a9529fd84ea578ad6eccb85c0fda9d872cf5a8f1c35f2f3039deac542",
    "units[0].steps[4].facts[1] (step \"encrypted-http-exchange\", fact \"On the wire\")": "69908ba4e68e7e8749d989abdd40b20e45cd6c11978c388459bec7b5590a076c",
    "units[0].steps[4].facts[2] (step \"encrypted-http-exchange\", fact \"Cipher\")": "88b53b42673660776a1a0f26b9174bef3b9f711ac038dbe312427830f0d3579c",
    "units[0].steps[4].facts[3] (step \"encrypted-http-exchange\", fact \"A watcher sees\")": "6b41cb5c7e011ca00d4bcedb7d4660694923c2d3b54033ef1b04485a47de4d30",
    "units[0].steps[4].events[0] (event \"m9\")": "5acf1705bb4d2f9c1cd28f98fdff23bcbfa6be8e2ddc1ed11db2e13b98c02710",
    "units[0].steps[4].events[1] (event \"seen-5\")": "1dcf1d25f733fc5f2e925e5426220d41a2aaad5f4f466bd5ddc7a7f23f8e11d5",
    "units[0].steps[4].events[2] (event \"m10\")": "822dc40994cf2abb33f367e7e945720587064dfed738d51f9a7b94c63e7bcac7",
    "units[0].steps[4].events[3] (event \"seen-6\")": "7ff1bb0d6eff744eaf4762a622954441e0f8f339b6bd8a2eaa4c00fcb9d746cb",
    "units[0].steps[5] (step \"secure-session\")": "aaa710a038d504cba735c8134078a5e4c7b232ed563790fa7d3ac13f4f847396",
    "units[0].steps[5].facts[0] (step \"secure-session\", fact \"Padlock means\")": "fd9ef2a2559b34b3a66e75d6719f03a64920ade3ca99ef9c30cce25e15792198",
    "units[0].steps[5].facts[1] (step \"secure-session\", fact \"Doesn’t mean\")": "ab71e27a4e4b47433fdd189872f96761f981bb14c119ebb258ac25d6c81c01de",
    "units[0].steps[5].facts[2] (step \"secure-session\", fact \"Next visit\")": "7c1d9c8fbc0c687de059fe6d66d8a3255ab728a1119d381a383f06b0b7a4108e",
    "units[0].steps[5].facts[3] (step \"secure-session\", fact \"Certificates last\")": "b67ec0e1af9984b4b2b8b5856cb85997cfd166d7087d848d90013f98817d73ba",
    "units[0].steps[5].events[0] (event \"m11\")": "dc3748c56a00906496947383ea400f5326ad17f7ccdd1d0237b6b071dac4075a",
    "units[0].steps[5].events[1] (event \"m12\")": "c2ecce1ced4d437814c878f8761215b3e798e531f98169952f1267d991f93e86",
    "units[0].steps[5].events[2] (event \"seen-7\")": "796a57643a7985dc9c1a07bb7523cc26b1c9c66d8be9473060419389a5beb0a7",
    "units[0].steps[5].events[3] (event \"m13\")": "ede67f1c33884277035f2b38a248a7118bd6dcccde4c33993140e571420a4866",
    "units[0].steps[0].deep[0] (step \"client-request\", Go deeper)": "c40861084dbae013c47e0908d4d943bf9551ec1f19633b4bf5fe974c46b403a9",
    "units[0].steps[1].deep[0] (step \"dns-resolution\", Go deeper)": "4d3d20035752f4e5ecf20a552ba11223a7456992199c5e2e08c729fa0f2e1a1c",
    "units[0].steps[2].deep[0] (step \"tcp-connection\", Go deeper)": "be2c372f2461c3d64b9fba5434592f682ea57d3d2be2adfb6e4216d4c04a456d",
    "units[0].steps[3].deep[0] (step \"tls-handshake\", Go deeper)": "6add49bc3690b07e403c95459cb4e5be6cbe347c235ff070573709a838374a6e",
    "units[0].steps[4].deep[0] (step \"encrypted-http-exchange\", Go deeper)": "ef0dcb13aa4e2f0165b88426f31834b40ebf14bba29debe18535912f4b079bd2",
    "units[0].steps[5].deep[0] (step \"secure-session\", Go deeper)": "43c2ea978c3c66f31ae9c50de3816cb1699a4536144bcb45080579415fa514e8",
    "units[0].learn.lead[0] (\"lead-1\")": "5b3314e2aa6f3341bf1d51ef59be740ea9338512e6cc37188b8d09da8a073f8a",
    "units[0].learn.lead[1] (\"lead-2\")": "4843c50944dd418f8aade58e5c3fa0924c650a3fc2e6b1c1ade402f2b55b70be",
    "units[0].learn.terms[0] (\"term-https\")": "39f8d1b81cff118501d795f3cab866c7210d825f2c145a9f5cc167f433f856a4",
    "units[0].learn.terms[1] (\"term-port\")": "b3c97abef75080d61f8757cad738c86fde484e1deff8caba19490a8378f308fb",
    "units[0].learn.terms[2] (\"term-handshake\")": "140c337637bb3c59bded6617d86ee826c3ee47b3156553489a5678ec02ddec0a",
    "units[0].learn.terms[3] (\"term-cert\")": "52d0167527645674a8592e380bad48080311d2e1a6254344dcd068992a395b3c",
    "units[0].learn.terms[4] (\"term-ca\")": "d915d98fce9e9274da06ce320c129fcaa45fbc03a443d474bce6f984a864ac87",
    "units[0].learn.terms[5] (\"term-key\")": "d52fe68ec9ae025a7d96fea89a4669b0fe889efc39047b9a09727661bd6e07f9",
    "units[0].learn.terms[6] (\"term-encrypted\")": "b4b14b8447ebdd90112c7e777d75ba00539f52d5735a375f8852b95292763006",
    "units[0].learn.terms[7] (\"term-html\")": "4ff8c3fd8d12af83eebe688f7707d4d6adf7d7ccb86db04f635840f96241ff60",
    "units[0].learn.terms[8] (\"term-padlock\")": "487e75b201d724746c36e252a8838f1a6d9c9695666c9280960c550476e81353",
    "units[0].learn.pattern (\"pattern\")": "bf8d7b972c50cd834332f8561c16f96c6fc6dfb29ac1ddad894736c6f44d7ef4",
    "units[0].learn.why[0] (\"why-1\")": "5bbb804230cbb9de823db1bb711a57bb052db39d80c1ed10f0ff4414ea30ed08",
    "units[0].learn.why[1] (\"why-2\")": "2fc945f6d08cbc49c50283bbec787306d56161fe049d275210dec48c6376ace5",
    "units[0].learn.why[2] (\"why-3\")": "c51d544f45cc2cacc6d92f2d37f3e3cc9e09582e9bbf68c3a16da667990df754",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "13e599f25e066c0aae48b516b8bfd6453d5b45c59c9622a413aadb681dfd08ca",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "6686453b14cd55822dee5ad08f3d28b438d330d821d82e955fee97870402e26f",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "f1eb384b98c875422cf8591a0bc553b5559ab91f8501e5da92c848ac8dc9ee94",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "ed74a84b04ee61973db15d6400efb946442a63d7b5673d4d6b9785d8ac64dcfb",
    "units[0].learn.facts[0] (\"fact-port\")": "bf0fbdf45d27f2ff31bf0dae1e03774dded5d6fa500d608885c493e085da7699",
    "units[0].learn.facts[1] (\"fact-is\")": "90da09d90a36b94adcc8b72a6b3390df9527c2354e7c30f3f8ee45530ef612c3",
    "units[0].learn.facts[2] (\"fact-certs\")": "e09b861dbab7cea728517320d3e549c7a83c162fb4ec2cd6986cbbd9e0cfe031",
    "units[0].learn.facts[3] (\"fact-watch\")": "6dc9056cb70ca162dcf3160a3a282a9e4154d15b4a618783a6b126d059c87d3d",
    "units[0].learn.facts[4] (\"fact-defined\")": "b7c8faa202b4b3f098547320aa35afd7f5d0ab8c9f1e8466ce82cd026ff23395",
    "units[0].learn.facts[5] (\"fact-used\")": "e84d4d55564c099782d9cc884777aafdd0dae8eab972e14ed7e3acf345a58385",
    "units[0].learn.facts[6] (\"fact-osi\")": "8122ade37b2e9758b2b9b4d850291c0bac4fb38fda57b79d128c5faa6d65a5b2",
    "units[0].learn.facts[7] (\"fact-dns\")": "b0093d74ef44a5cd700570de5a15e253cf2edd514bf6b397c9ca0a509ee78840",
    "units[0].learn.facts[8] (\"fact-dns-plain\")": "7c0d0a7c7b0b56fdb6c97450c63d06c51f9bb0b93490cd4637cab814f1a9de71",
    "units[0].learn.facts[9] (\"fact-tcp\")": "40b1b35effc8c138ea7d951a1773de64859118bc6b14d319cf824bca67b83612",
    "units[0].learn.facts[10] (\"fact-rides\")": "243d1b7c92645fbdd0d800655820a7996eb45ab9d0fb5188c6e635259bb338da",
    "units[0].learn.facts[11] (\"fact-tls\")": "a37f860a8fe4e2ba8b38d9908d9523e2100ff4ba40e6be7540f93ad621b88a23",
    "units[0].learn.facts[12] (\"fact-kx\")": "3a8476c47c0c70e4d53418b24efdfe911dd3d6b92607d1a7d441b85a82e14d9c",
    "units[0].learn.facts[13] (\"fact-inside\")": "36cf8570cb8ae43a48fe66d2b44a836d5ec4c74d1ee56bc19b3194cfc1ada19a",
    "units[0].learn.facts[14] (\"fact-type\")": "2d2dfe57a1a714d99f0a0f06c4774ca7998b3ddacff6a06c23412ce3f763d4f3",
    "units[0].learn.facts[15] (\"fact-files\")": "320fb9f006de93142809f0615877ad4ae67fbe0891fbcffbd37df4d6e919dec8",
    "units[0].learn.facts[16] (\"fact-records\")": "e85b0770298134bdc4cd9c15ccc52707062691266e4d9e62c5d745a1388848e0",
    "units[0].learn.facts[17] (\"fact-drawing\")": "78fd370ed4a5fdab7977e56d31eb8d970353a8417574a5d595f75c1850bd4515",
    "units[0].learn.facts[18] (\"fact-ticket\")": "5fd3606d6390ad70f8a0823e4d1fcf382d87bca55a0738f8f49fe2b628d63934",
    "units[0].learn.facts[19] (\"fact-validity\")": "4393b86c90a9a9acabbac9ed7f25fb68f89f7bf88a52cdf473292915dc2bd0dc",
    "units[0].learn.facts[20] (\"fact-honest\")": "4b16da420245e06e5a6bbbdf7f0749b59233129f8f28063a77d7eae1597bbd48",
    "units[0].practice[0].options[0] (question \"cafe-wifi\")": "a90190d11b94c3c91a62b45e9d34e8929f21715c0aae07c9b7a8f89f6ed796e9",
    "units[0].practice[0].options[1] (question \"cafe-wifi\")": "3d37c07eeddc18450bd54e76f7a1d936bfdb82bca0f201036a19e5203a44b56b",
    "units[0].practice[0].options[2] (question \"cafe-wifi\")": "beebfd5c48a5a573cc63ec563ebe09472791555f6ef68984e67466f44fafe912",
    "units[0].practice[1].options[0] (question \"padlock\")": "d6a1f37de5d9f98cd929020c86d356617adefb33cebcd68d8d511bd323de54a4",
    "units[0].practice[1].options[1] (question \"padlock\")": "708f59797cb6a4fc84b3db2a82197b5ddf106d0c20abd59ed219fd37a41c72fd",
    "units[0].practice[1].options[2] (question \"padlock\")": "52d4efaedfd388d1a18e559c50672c1f9205176b545944269ab0380cdc412c3c",
    "units[0].practice[0].prompt (question \"cafe-wifi\")": "769a9172ead7a8c3c6d5f609e8e605556a959881d19ad9f191dff9bbb7e35817",
    "units[0].practice[1].prompt (question \"padlock\")": "0e57ec4d3cce569aacd574a500e85d6b21b79b2e51c4c06f2183f8435fc24f6f"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-https

Checked on 2026-11-11 against every source on the claim sheet, each fetched from its publisher in this run. 53 claim items (52 claims and the OSI badge), 55 traced items, 5 example items, 1 analogy and 4 unbacked items.

## 1. Claims

### units[0].osi — ✅

Badge: layer 7.

- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7) and provides features like SSL/TLS termination
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway makes intelligent routing decisions based on HTTP request attributes like URL paths and host headers.
- `cloudflare-lb-proxy-modes` §Layer 7 load balancing
  > Layer 7 load balancers direct traffic to specific endpoints based on information present in each HTTP/HTTPS request
- Note: No standard places HTTPS at an OSI layer. Two vendors (Microsoft and Cloudflare) treat HTTP/HTTPS requests as layer 7 information, which the owner's settled rule accepts for an OSI badge. No allowed source met in this run places HTTPS at a different single layer. Both pages are live and describe current products.

### units[0].steps[0].deep[0] (step "client-request", Go deeper) — ✅

"Some browsers upgrade http:// to https:// when they can, by default or as a setting. Many sites also send an HSTS header, which tells the browser to always use HTTPS for them, so a link to http:// is upgraded before anything is sent. The scheme https means port 443 unless the URL names another. Sites on the browser's HSTS preload list are never contacted over plain HTTP at all."

- `microsoft-edge-https-first` §What is HTTPS-First Mode?
  > HTTPS-First Mode in Microsoft Edge automatically upgrades HTTP connections to HTTPS when possible
- `microsoft-edge-https-first` §Manage HTTPS-First Mode in Microsoft Edge
  > Microsoft Edge has this feature enabled by default
- `google-chrome-always-secure` §Manage Advanced security settings
  > When you turn on Always use secure connections, Chrome upgrades URLs to use HTTPS and displays a warning before you visit a site that doesn’t support it.
- `rfc-6797` §5.1
  > An HTTP host declares itself an HSTS Host by issuing to UAs an HSTS
  > Policy, which is represented by and conveyed via the
  > Strict-Transport-Security HTTP response header field
- `rfc-6797` §5.2
  > An HSTS Policy directs UAs to communicate with a Known HSTS Host only
  > over secure transport
- `rfc-6797` §8.3
  > Whenever the UA prepares to "load" (also known as "dereference") any
  > "http" URI
- `rfc-6797` §8.3
  > The UA MUST replace the URI scheme with "https"
- `whatwg-fetch` §4.1
  > Upgrade request to a potentially trustworthy URL, if appropriate.
- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `rfc-6797` §12.3
  > An HSTS pre-loaded list is a facility whereby web site administrators
  > can have UAs pre-configured with HSTS Policy for their site(s) by the
  > UA vendor(s)
- Note: RFC 6797 is the defining standard for HSTS (the header, the policy and the http-to-https rewrite), and RFC 9110 defines the https scheme and its default port. Both are current: RFC 6797 has no obsoleting or updating RFC, and RFC 9110 is not obsoleted.
- Note: Two vendors (Microsoft, Google) confirm the browser upgrade: on by default in Edge, a setting in Chrome. "Many sites" is a describing word that no source counts; it passes as true for a beginner. The preload sentence rests on RFC 6797 §12.3 (a preloaded policy) read with §5.2 (the policy allows only secure transport); it leaves out that the list is a per-browser facility.

### units[0].steps[1].deep[0] (step "dns-resolution", Go deeper) — ✅

"Normal DNS travels as plain UDP on port 53. Encrypted DNS hides the lookup too: DNS over HTTPS (DoH, port 443) or DNS over TLS (DoT, port 853), which many browsers and phones can switch on. The DNS lesson shows how the resolver finds the answer."

- `rfc-1035` §4.2.1
  > Messages sent using UDP user server port 53 (decimal).
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method
  > for standard queries in the Internet.
- `rfc-9076` §1
  > At the time of writing, almost all this DNS traffic is currently sent
  > unencrypted. However, there is increasing deployment of DNS over TLS
  > (DoT) [RFC7858] and DNS over HTTPS (DoH) [RFC8484], particularly in
  > mobile devices, browsers
- `rfc-8484` §1
  > This document defines a specific protocol, DNS over HTTPS (DoH), for
  > sending DNS [RFC1035] queries and getting DNS responses over HTTP
- `rfc-8484` §8.1
  > Additionally, the use of the HTTPS default port 443
- `rfc-7858` §3.1
  > By default, a DNS client desiring privacy from DNS over TLS from a
  > particular server MUST establish a TCP connection to port 853
- `cloudflare-dns-encryption` §Encryption
  > DNS over TLS (DoT) — Encrypts DNS queries over a dedicated TLS connection on port 853.
- `cloudflare-dns-encryption` §Encryption
  > DNS over HTTPS (DoH) — Encrypts DNS queries inside regular HTTPS traffic on port 443.
- `google-chrome-always-secure` §Manage Advanced security settings
  > if secure Domain Name System (DNS) lookup is turned on, Chrome encrypts your information during the lookup process.
- Note: RFC 1035 defines the DNS message transport (UDP port 53), RFC 8484 defines DoH and RFC 7858 defines DoT. None is obsoleted; RFC 1035 and RFC 7858 have updating RFCs, and none of them changes UDP port 53 or DoT's port 853. Cloudflare (a vendor) and RFC 9076 independently confirm both ports and the browser/phone uptake. The last sentence points to another lesson and makes no claim.

### units[0].steps[2].deep[0] (step "tcp-connection", Go deeper) — ⚠️

"A watcher sees the handshake and both addresses and ports, 192.168.1.100:50812 to 198.51.100.7:443, and port 443 is the port reserved for HTTPS. HTTP/3 skips TCP and runs over QUIC on UDP port 443, with the TLS handshake built into QUIC's own."

- `rfc-9849` §1
  > ECH is not in itself sufficient to protect the identity of the
  > server. The target domain may also be visible through other
  > channels, such as plaintext client DNS queries or visible server IP
  > addresses.
- `rfc-9308` §8
  > the use of
  > ports that cannot easily be mapped to a registered service name might
  > lead to blocking or other changes to the forwarding behavior by
  > network elements such as firewalls that use the port number for
  > application identification.
- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- `rfc-9114` §1
  > HTTP/3 supports the same semantics over a new transport
  > protocol: QUIC.
- `rfc-9308` §8
  > For example, the default
  > port for HTTP/3 [QUIC-HTTP] is UDP port 443
- `rfc-9001` §3
  > QUIC uses the TLS handshake; TLS uses the reliability, ordered delivery,
  > and record layer provided by QUIC.
- `rfc-9001` §4
  > QUIC carries TLS handshake data in CRYPTO frames
- `rfc-9110` §4.3.3
  > The "https" scheme (Section 4.2.2) associates authority based on the
  > ability of a server to use the private key corresponding to a
  > certificate that the client considers to be trustworthy
- Note: Port 443 as HTTPS's reserved port is defined by RFC 9110 §4.2.2 and the live IANA registry (tcp and udp 443, "https"). HTTP/3 over QUIC on UDP 443, with TLS carried inside QUIC, is defined by RFC 9114 and RFC 9001 and confirmed by RFC 9308. All are current and not obsoleted.
- Note: What is wrong: the first sentence's claim that a watcher sees the TCP handshake and both addresses and ports is not confirmed. RFC 9849 §1 states only that the server's IP address is visible. RFC 9308 §8 states only that network elements use the port number. No cited section states that the client's address, the ports or the TCP handshake can be seen, and none is a defining standard for that. The claim is true; it needs a citation that states it (for example, a section saying TCP/IP headers are not encrypted by TLS).

### units[0].steps[3].deep[0] (step "tls-handshake", Go deeper) — ✅

"This is TLS 1.3. The ClientHello carries a key share; the ServerHello, certificate, CertificateVerify and Finished come back in one flight; the client's Finished completes it. Sealing costs one round trip. The key exchange is usually X25519, which browsers now pair with ML-KEM, a post-quantum method. The ClientHello names the site in plain text (SNI), so a watcher sees the name; Encrypted Client Hello (ECH) can hide it. The TLS/SSL lesson takes the handshake one message at a time."

- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
  > (TLS) protocol.
- `rfc-9846` §2
  > In the Key Exchange phase, the client sends the ClientHello
  > (Section 4.2.2) message, which contains a random nonce
  > (ClientHello.random); its offered protocol versions; a list of
  > symmetric cipher/hash pairs; either a list of asymmetric key exchange
  > shares
- `rfc-9846` §2
  > Upon receiving the server's messages, the client responds with its
  > Authentication messages, namely Certificate and CertificateVerify (if
  > requested), and Finished.
- `rfc-9846` §2
  > At this point, the handshake is complete
- `rfc-9846` §2.3
  > the 0-RTT data is just added to the 1-RTT
  > handshake in the first flight.
- `rfc-9001` §1
  > Absent packet loss, most new
  > connections can be established and secured within a single round
  > trip
- `rfc-10024` §Abstract
  > This document defines three hybrid key agreement mechanisms for TLS
  > 1.3 -- X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024 --
  > that combine the post-quantum ML-KEM
- `rfc-10024` §2
  > The first group uses X25519 [RFC7748], is widely deployed
- `cloudflare-pqc-support` §Browsers
  > Default in Chrome 131+
- `cloudflare-pqc-support` §Browsers
  > Default in Firefox 132+ (Desktop), 145+ (Android)
- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection
- `rfc-9849` §1
  > This document specifies a new TLS extension called Encrypted Client
  > Hello (ECH) that allows clients to encrypt their ClientHello to the
  > TLS server. This protects the SNI
- `rfc-6066` §3
  > In order to provide any of the server names, clients MAY include an
  > extension of type "server_name" in the (extended) client hello.
- Note: RFC 9846 (July 2026, obsoletes RFC 8446) is the current definition of TLS 1.3 and its message flow. RFC 10024 (August 2026) defines the X25519MLKEM768 hybrid group. RFC 6066 defines SNI; RFC 9846 updates it but keeps server_name. None is obsoleted. Round-trip cost is confirmed by RFC 9846 and RFC 9001 independently; browser defaults by Cloudflare's live support page.
- Note: The one-flight list leaves out EncryptedExtensions, and "usually X25519" speaks loosely of the X25519-based hybrid that browsers send by default. Both pass as true for a beginner. The last sentence points to another lesson and makes no claim.

### units[0].steps[4].deep[0] (step "encrypted-http-exchange", Go deeper) — ⚠️

"Each TLS record carries the encrypted HTTP, sealed with a check that catches any change (AES-GCM or ChaCha20-Poly1305). A record altered on the way fails the check, and the connection is dropped. A watcher still sees the sizes and timing of records, and the addresses. The path (such as /account), cookies and passwords are all inside the seal."

- `rfc-9846` §5.2
  > In TLS 1.3, as opposed to previous versions of TLS, all
  > ciphers are modeled as "Authenticated Encryption with Associated
  > Data" (AEAD)
- `rfc-9846` §5.2
  > If the decryption fails, the receiver MUST terminate the connection
  > with a "bad_record_mac" alert.
- `rfc-9846` §9.1
  > A TLS-compliant application MUST implement the
  > TLS_AES_128_GCM_SHA256 [GCM] cipher suite and SHOULD implement the
  > TLS_AES_256_GCM_SHA384 [GCM] and TLS_CHACHA20_POLY1305_SHA256
- `rfc-9846` §F.3
  > TLS is susceptible to a variety of traffic analysis attacks based on
  > observing the length and timing of encrypted packets
- `rfc-9849` §1
  > visible server IP
  > addresses
- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data"
- Note: RFC 9846 defines TLS 1.3 records, their AEAD protection and the cipher suites; RFC 9112 defines HTTP/1.1 over TLS. Both current.
- Note: What is wrong: "and the addresses" is stated only by RFC 9849 §1 (and only for the server's address). It is not a defining standard for this, and no second independent citation states it, so this part of the claim is not confirmed. The rest holds.

### units[0].steps[5].deep[0] (step "secure-session", Go deeper) — ✅

"The padlock appears only when the certificate is valid, in date and issued for this name, and the whole page came over TLS. Scam sites can have valid certificates too: the padlock proves who you're talking to, not that they're trustworthy. Resuming with a ticket (a pre-shared key) skips the certificate, and can even send the first request in the first flight (0-RTT)."

- `cloudflare-mixed-content` §Mixed content errors
  > This indicates your site has a working SSL certificate and all resources loaded by the site are loaded over HTTPS.
- `cloudflare-mixed-content` §Mixed content errors
  > One of the symptoms of mixed content is that different icons appear instead of the green lock icon.
- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > The website you’re visiting has a valid certificate issued by a trusted authority.
- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > This website's certificate is invalid, or something is severely wrong with the security of the site.
- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > However, even websites with valid certificates may have a poor reputation
- `rfc-5280` §6.1
  > for all x in {1, ..., n}, the certificate was valid at the
  > time in question.
- `rfc-9525` §6.3
  > This section describes how the client must determine if the presented
  > DNS name matches the reference DNS name.
- `rfc-8555` §1
  > The CA is not required to attempt to verify the
  > requester's real-world identity.
- `rfc-9846` §2.2
  > As the server is authenticating via a PSK, it does not send a
  > Certificate or a CertificateVerify message.
- `rfc-9846` §2.3
  > When clients and servers share a PSK (either obtained externally or
  > via a previous handshake), TLS 1.3 allows clients to send data on the
  > first flight ("early data").
- Note: RFC 9846 defines resumption with a PSK and 0-RTT. The padlock conditions are confirmed by two vendors (Cloudflare, Microsoft) and by RFC 5280 (validity in date) and RFC 9525 (name match), all current. Note: Chrome now shows a neutral icon rather than a padlock; the claim says when a padlock appears, which stays true for browsers that show one.

### units[0].learn.lead[0] ("lead-1") — ✅

"HTTPS is HTTP with one extra job before the asking: seal the line."

- `rfc-9112` §9.7
  > It initiates a
  > connection to the server on the appropriate port and sends the TLS
  > ClientHello to begin the TLS handshake. When the TLS handshake has
  > finished, the client may then initiate the first HTTP request.
- `rfc-9110` §4.2.2
  > A client MUST ensure that its HTTP requests for an "https" resource
  > are secured, prior to being communicated
- Note: RFC 9110 defines the https scheme and RFC 9112 defines HTTP/1.1 over TLS; both current (RFC 9112's one update, RFC 9931, does not touch §9.7).

### units[0].learn.lead[1] ("lead-2") — ✅

"After that the conversation is the same, but only the two ends can read it."

- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data" but is otherwise
  > treated like a normal connection for HTTP
- Note: RFC 9846 defines TLS 1.3's confidentiality property; RFC 9112 defines HTTP/1.1 over TLS. Both current.

### units[0].learn.terms[0] ("term-https") — ✅

"HTTPS (HTTP Secure): HTTP inside a sealed line"

- `rfc-9112` §9.7
  > Conceptually, HTTP/TLS is simply sending HTTP messages over a
  > connection secured via TLS
- `rfc-9110` §4.2.2
  > capable of
  > establishing a TLS ([TLS13]) connection that has been secured for
  > HTTP communication.
- `rfc-9110` §4.2
  > Hypertext Transfer Protocol Secure
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > HTTPS (Hypertext Transfer Protocol Secure) encrypts that data, keeping your information private and secure.
- Note: RFC 9110 defines the https scheme and its name; current.

### units[0].learn.terms[1] ("term-port") — ✅

"Port 443: The door for sealed web traffic"

- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- Note: RFC 9110 defines the default port and the live IANA registry (updated 2026-11-10) assigns 443 to https. "The door" leaves out that 443 is the default and another port can be named; passes as true for a beginner.

### units[0].learn.terms[2] ("term-handshake") — ✅

"TLS handshake: Agreeing on the lock and checking the ID"

- `rfc-9846` §1
  > A handshake protocol (Section 4) that authenticates the
  > communicating parties, negotiates cryptographic algorithms and
  > parameters, and establishes shared keying material.
- Note: RFC 9846 defines the TLS 1.3 handshake; current.

### units[0].learn.terms[3] ("term-cert") — ✅

"Certificate: The site's ID card, signed by someone trusted"

- `rfc-5280` §3.1
  > public key
  > certificates, which are data structures that bind public key values
  > to subjects. The binding is asserted by having a trusted CA
  > digitally sign each certificate.
- Note: RFC 5280 defines the Internet X.509 certificate profile; it is not obsoleted, and its updates (RFC 6818, 8398, 8399, 9549, 9598, 9608 and others) do not change §3.1. "ID card" is an everyday word for a binding of a key to a name.

### units[0].learn.terms[4] ("term-ca") — ✅

"Certificate authority (CA): Who signs the ID cards"

- `rfc-5280` §3
  > CAs are responsible for indicating the revocation status of the
  > certificates that they issue.
- `rfc-9846` §C.2
  > certificates should always be verified to ensure
  > proper signing by a trusted certificate authority (CA).
- Note: Two independent standards (RFC 5280 and RFC 9846), both current.

### units[0].learn.terms[5] ("term-key") — ✅

"Shared key: The same secret, made on both sides"

- `rfc-7748` §6.1
  > Both now share K = X25519(a, X25519(b, 9)) = X25519(b, X25519(a, 9))
  > as a shared secret.
- `rfc-9846` §F.1
  > Establishing the same session keys: The handshake needs to output
  > the same set of session keys on both sides of the handshake
- Note: Two independent standards (RFC 7748 and RFC 9846), both current.

### units[0].learn.terms[6] ("term-encrypted") — ✅

"Encrypted: Scrambled so only the two ends can read it"

- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: RFC 9846 defines TLS 1.3's confidentiality; current. "Scrambled" is an everyday word.

### units[0].learn.terms[7] ("term-html") — ✅

"HTML: The text that describes the page"

- `whatwg-html` §1.3
  > HTML is the World Wide Web's core markup language.
- `whatwg-html` §1.10
  > HTML documents consist of a tree of elements and text.
- Note: The WHATWG HTML Living Standard defines HTML; the live standard was read.

### units[0].learn.terms[8] ("term-padlock") — ✅

"Padlock: The sign that the line is sealed and the name checked out"

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > The website you’re visiting has a valid certificate issued by a trusted authority. The information sent to and from the site is secure and can't be intercepted by an attacker.
- `cloudflare-mixed-content` §Mixed content errors
  > Normally, if your website loads all resources securely over HTTPS, visitors observe a lock icon in the address bar of their browser.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > If the site is secure (HTTPS), you’ll see a padlock icon before the URL.
- Note: Two vendors (Microsoft, Cloudflare), pages live. Note: Chrome no longer draws a padlock; the term describes what a padlock means where one is shown.

### units[0].learn.pattern ("pattern") — ✅

"DNS Resolution, TCP Connection, TLS Handshake, Encrypted HTTP. Plain HTTP plus the TLS handshake. Everything after the handshake is sealed."

- `rfc-9110` §4.3.3
  > In practice, a
  > client will make a DNS query to check that the origin's host contains
  > the same server IP address as the established connection.
- `rfc-9112` §9.7
  > The HTTP client also acts as the TLS client. It initiates a
  > connection to the server on the appropriate port and sends the TLS
  > ClientHello to begin the TLS handshake. When the TLS handshake has
  > finished, the client may then initiate the first HTTP request.
- `rfc-9846` §2
  > Once the handshake is complete, the peers use the
  > established keys to protect the application-layer traffic.
- Note: RFC 9112 and RFC 9846 define the order and the protection; both current. The DNS step leaves out cached answers; passes as true for a beginner.

### units[0].learn.why[0] ("why-1") — ✅

"Without HTTPS, anyone on the path, café Wi-Fi, a provider, a router on the way, could read your passwords or quietly change the page."

- `google-chrome-secure` §What each security symbol means
  > The site doesn't use a private connection. Someone may be able to view and change the information you send and get through this site.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > HTTP sends data (like passwords or card numbers) in plain text, making it easier for hackers to intercept.
- `rfc-9110` §4.3.2
  > communication that might not be secured from an on-path attacker.
- Note: Two vendors (Google, Microsoft) and RFC 9110 agree. Café Wi-Fi, a provider and a router are everyday examples of an on-path party.

### units[0].learn.why[1] ("why-2") — ✅

"HTTPS stops both, and the certificate stops someone pretending to be the site."

- `rfc-9846` §1
  > Integrity: Data sent over the channel after establishment cannot
  > be modified by attackers without detection.
- `rfc-9110` §4.3.4
  > Certificate verification is used to prevent
  > server impersonation by an on-path attacker or by an attacker that
  > controls name resolution.
- Note: RFC 9846 defines TLS's confidentiality and integrity, and RFC 9110 defines https certificate verification; both current. "Stops" a change means a change is detected and the connection fails, which the lesson says elsewhere.

### units[0].learn.why[2] ("why-3") — ✅

"That's why browsers now warn you about plain HTTP pages."

- `google-chrome-secure` §What each security symbol means
  > The site doesn't use a private connection. Someone may be able to view and change the information you send and get through this site.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > If the site is not secure (HTTP), you may see:
- Note: Two vendors (Google, Microsoft), pages live, both describing a "Not secure" mark for plain HTTP.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

"Certificates are checked along a chain: the site's certificate is signed by an intermediate, which is signed by a root certificate the browser or system already trusts."

- `rfc-5280` §3.2
  > In general, a chain of multiple certificates
- `rfc-5280` §3.2
  > may be needed, comprising a certificate of the public key owner (the
  > end entity) signed by one CA, and zero or more additional
  > certificates of CAs signed by other CAs.
- `rfc-5280` §6.1
  > for all x in {1, ..., n-1}, the subject of certificate x is
  > the issuer of certificate x+1;
- `google-chrome-secure` §Resolve security and connection issues
  > The Chrome Root Program lists the root certificates trusted by Chrome to authenticate HTTPS sites.
- `google-chrome-secure` §Resolve security and connection issues
  > Chrome will add custom root certificates from the certificates used by your computer's operating system.
- Note: RFC 5280 and Google confirm independently. The claim describes the usual one-intermediate chain and leaves out chains with none or several intermediates; passes as true for a beginner.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

"Authorities such as Let's Encrypt issue certificates automatically (ACME)."

- `rfc-8555` §1
  > This document describes an extensible framework for automating the
  > issuance and domain validation procedure, thereby allowing servers
  > and infrastructure software to obtain certificates without user
  > interaction.
- `letsencrypt-how` §How It Works
  > The objective of Let’s Encrypt and the ACME protocol is to make it possible to set up an HTTPS server and have it automatically obtain browser-trusted certificates without any human intervention.
- Note: RFC 8555 defines ACME (current, not obsoleted); Let's Encrypt's own page is live.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

"A wrong name, an expired certificate or an unknown signer gives a full-page warning."

- `rfc-9110` §4.3.4
  > If the certificate is not valid for the target URI's origin, a user
  > agent MUST either obtain confirmation from the user before proceeding
  > (see Section 3.5) or terminate the connection with a bad certificate
  > error.
- `google-chrome-secure` §Resolve security and connection issues
  > If you get a full-page error message saying "Your connection is not private," then there's a problem with the site, the network, or your device.
- Note: RFC 9110 defines what a client does with a certificate that is not valid for the origin. Name, date and trusted signer are the validity checks of RFC 5280 and RFC 9525 (read for steps[5].deep[0]). Google confirms the full-page form. "Full-page" is how the main browsers show it; passes as true for a beginner.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

"HSTS tells browsers never to use plain HTTP for a site."

- `rfc-6797` §5.2
  > An HSTS Policy directs UAs to communicate with a Known HSTS Host only
  > over secure transport and specifies policy retention time duration.
- Note: RFC 6797 defines HSTS; current. The claim leaves out the policy's lifetime; passes as true for a beginner.

### units[0].learn.facts[0] ("fact-port") — ✅

"Port: 443 (the default for https; plain HTTP: 80)"

- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `rfc-9110` §4.2.1
  > If the port
  > subcomponent is empty or not given, TCP port 80 (the reserved port
  > for WWW services) is the default.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- Note: RFC 9110 defines both defaults; the live IANA registry agrees.

### units[0].learn.facts[1] ("fact-is") — ✅

"Is: HTTP over TLS: every HTTP message goes as TLS application data"

- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data"
- `rfc-9110` §4.2.2
  > all HTTP communication with that server has
  > confidentiality and integrity protection
- Note: RFC 9112 defines HTTP/1.1 over TLS; current. HTTP/3 carries HTTP in QUIC instead, which the lesson names separately; the claim describes the HTTP/1.1 case the lesson shows.

### units[0].learn.facts[2] ("fact-certs") — ✅

"Certificates: X.509, signed by a CA"

- `rfc-9846` §4.5.1.2
  > The certificate type MUST be X.509v3 [RFC5280], unless explicitly
  > negotiated otherwise
- `rfc-5280` §3.1
  > The binding is asserted by having a trusted CA
  > digitally sign each certificate.
- Note: RFC 9846 defines TLS 1.3 certificate selection and RFC 5280 defines the X.509 profile; both current.

### units[0].learn.facts[3] ("fact-watch") — ⚠️

"Watchers still see: addresses and ports, the site's name (SNI), sizes and timing"

- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection
- `rfc-9849` §1
  > visible server IP
  > addresses
- `rfc-9846` §1
  > TLS does not hide the length of
  > the data it transmits
- `rfc-9846` §F.3
  > TLS is susceptible to a variety of traffic analysis attacks based on
  > observing the length and timing of encrypted packets
- `rfc-6066` §3
  > In order to provide any of the server names, clients MAY include an
  > extension of type "server_name" in the (extended) client hello.
- `rfc-9110` §4.3.3
  > The request target's host and port value are passed within each HTTP
  > request
- Note: Sizes and timing are stated by RFC 9846, the defining standard for TLS 1.3. The name is stated by RFC 9849, and SNI itself is defined by RFC 6066. All are current.
- Note: What is wrong: "addresses and ports" is not confirmed. No cited section says ports can be seen. RFC 9849 §1 says only that the server's IP address is visible, and it is neither a defining standard for this nor backed by a second independent citation. RFC 9110 §4.3.3 is about the host and port inside the (encrypted) HTTP request, not what a watcher sees. The claim is true; it needs a citation that states it.

### units[0].learn.facts[4] ("fact-defined") — ✅

"Defined in: RFC 9110, RFC 9846"

- `rfc-9110` §4.2.2
  > The "https" URI scheme is hereby defined
- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
  > (TLS) protocol.
- Note: RFC 9110 defines the https scheme and RFC 9846 defines TLS 1.3; both are the current documents (RFC 9846 obsoletes RFC 8446).

### units[0].learn.facts[5] ("fact-used") — ✅

"Used for: web pages, and apps that talk to servers"

- `rfc-9110` §1.2
  > HTTP has been the primary information transfer protocol for the World
  > Wide Web since its introduction in 1990.
- `rfc-9110` §3.5
  > Other common user agents include spiders (web-traversing robots),
  > command-line tools, billboard screens, household appliances, scales,
  > light bulbs, firmware update scripts, mobile apps
- `rfc-9114` §1
  > HTTP semantics ([HTTP]) are used for a broad range of services on the
  > Internet.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > When you visit a website, your browser uses a protocol called HTTP (Hypertext Transfer Protocol) to communicate with the site
- Note: The sources speak of HTTP; HTTPS is HTTP secured, so its uses are the same. Confirmed by two RFCs and Microsoft.

### units[0].learn.facts[6] ("fact-osi") — ✅

"OSI layer: 7, application"

- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- `cloudflare-lb-proxy-modes` §Layer 7 load balancing
  > Layer 7 load balancers direct traffic to specific endpoints based on information present in each HTTP/HTTPS request
- Note: Two vendors place HTTP/HTTPS request handling at layer 7; no standard places HTTPS, and the owner's settled rule accepts two vendors for this.

### units[0].learn.facts[7] ("fact-dns") — ✅

"DNS resolution: a resolver turns a name into an IP address, which can take from milliseconds to seconds; UDP to port 53 is the recommended way to send a query, such as one for an A record"

- `rfc-1034` §5.2.1
  > Host name to host address translation.
- `rfc-1034` §5.2.1
  > Under the DNS, it
  > translates into a request for type A RRs.
- `rfc-1034` §5.1
  > the
  > amount of time that a resolver will take to complete can vary quite a
  > bit, from milliseconds to several seconds.
- `rfc-1035` §3.2.2
  > A               1 a host address
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method
  > for standard queries in the Internet.
- `rfc-9499` §6
  > A resolver performs queries for a name, type, and
  > class, and receives responses.
- `rfc-9110` §4.3.2
  > If host is a registered name, the registered name is an
  > indirect identifier for use with a name resolution service, such as
  > DNS, to find an address for an appropriate origin server.
- Note: RFC 1034 and RFC 1035 define DNS; neither is obsoleted, and their many updates (such as RFC 7766, RFC 8490) add TCP and other transports without removing UDP as the ordinary way to send a query. RFC 9076 (read for the DNS claims) says almost all queries still go over UDP.

### units[0].learn.facts[8] ("fact-dns-plain") — ✅

"Plain DNS: not encrypted, so the name you look up shows; DoH (port 443) or DoT (port 853) can hide it"

- `rfc-9076` §5.1
  > For unencrypted transports, DNS traffic can be seen by an
  > eavesdropper like any other traffic.
- `rfc-9076` §5.1
  > So,
  > if an initiator starts an HTTPS communication with a recipient, the
  > HTTP traffic will be encrypted, but the DNS exchange prior to it will
  > not be.
- `rfc-9076` §1
  > At the time of writing, almost all this DNS traffic is currently sent
  > unencrypted.
- `rfc-8484` §1
  > This document defines a specific protocol, DNS over HTTPS (DoH)
- `rfc-8484` §8.1
  > DoH encrypts DNS traffic and requires authentication of the server.
- `rfc-8484` §8.1
  > the use of the HTTPS default port 443
- `rfc-7858` §3.1
  > By default, a DNS client desiring privacy from DNS over TLS from a
  > particular server MUST establish a TCP connection to port 853
- `cloudflare-dns-encryption` §Encryption
  > Traditionally, these queries are sent in plaintext — unencrypted and readable by anyone on the network path.
- Note: RFC 8484 defines DoH and RFC 7858 defines DoT; both current (RFC 7858's update, RFC 8310, keeps port 853). RFC 9076 and Cloudflare independently confirm that plain DNS is readable.

### units[0].learn.facts[9] ("fact-tcp") — ✅

"TCP connection: opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default"

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a
  > connection.
- `rfc-9293` §3.5
  > In line 2 of Figure 6, TCP Peer A begins by sending a SYN segment
- `rfc-9293` §3.5
  > In line 3, TCP Peer B sends a SYN and acknowledges the
  > SYN it received from TCP Peer A.
- `rfc-9293` §3.5
  > At line 4, TCP Peer A responds with an empty segment containing an
  > ACK for TCP Peer B's SYN
- `rfc-9112` §9.3
  > HTTP/1.1 defaults to the use of "persistent connections", allowing
  > multiple requests and responses to be carried over a single
  > connection.
- Note: RFC 9293 defines TCP (current Internet Standard, obsoletes RFC 793); RFC 9112 defines HTTP/1.1 persistence. The §3.5.1 citation (half-open connections) adds nothing but contradicts nothing.

### units[0].learn.facts[10] ("fact-rides") — ✅

"Rides on: TCP, which rides on IP (HTTP/3: QUIC, on UDP)"

- `rfc-9112` §9
  > indicates a default connection of TCP over
  > IP
- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP
  > segments, with each TCP segment sent as an Internet Protocol (IP)
  > datagram.
- `rfc-9114` §1
  > HTTP/2 has been used primarily with TLS over
  > TCP. HTTP/3 supports the same semantics over a new transport
  > protocol: QUIC.
- `rfc-9000` §1
  > QUIC packets are carried in UDP datagrams [UDP]
- Note: RFC 9112, RFC 9293 and RFC 9114 are defining standards here, all current; RFC 9000 confirms QUIC over UDP.

### units[0].learn.facts[11] ("fact-tls") — ✅

"TLS 1.3 handshake: runs on the TCP connection: the ClientHello offers locks (cipher suites) and a key share; the server answers with ServerHello, its certificate, CertificateVerify and Finished; the client's Finished ends it; it costs one round trip, and everything after the key exchange is encrypted"

- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
  > (TLS) protocol.
- `rfc-9846` §4.2.1
  > A list of cipher suites which indicates the AEAD algorithm/HKDF
  > hash pairs which the client supports.
- `rfc-9846` §2
  > Key Exchange: Establish shared keying material and select the
  > cryptographic parameters. Everything after this phase is
  > encrypted.
- `rfc-9846` §2
  > Upon receiving the server's messages, the client responds with its
  > Authentication messages, namely Certificate and CertificateVerify (if
  > requested), and Finished.
- `rfc-9846` §2.3
  > the 0-RTT data is just added to the 1-RTT
  > handshake in the first flight.
- `rfc-9112` §9.7
  > It initiates a
  > connection to the server on the appropriate port and sends the TLS
  > ClientHello to begin the TLS handshake.
- `rfc-9001` §1
  > Absent packet loss, most new
  > connections can be established and secured within a single round
  > trip
- Note: RFC 9846 defines the TLS 1.3 handshake; RFC 9112 defines it running on the HTTP/1.1 connection. Leaves out EncryptedExtensions; passes as true for a beginner.

### units[0].learn.facts[12] ("fact-kx") — ✅

"Key exchange: usually X25519, which browsers now pair with ML-KEM, a post-quantum method"

- `rfc-10024` §Abstract
  > that combine the post-quantum ML-KEM (Module-Lattice-Based Key
  > Encapsulation Mechanism) with an ECDHE (Ephemeral Elliptic Curve
  > Diffie-Hellman) exchange.
- `rfc-10024` §2
  > The first group uses X25519 [RFC7748], is widely deployed
- `cloudflare-pqc-support` §Browsers
  > Default in Chrome 131+
- `cloudflare-pqc-support` §Browsers
  > Default in Safari 26+
- Note: RFC 10024 (Standards Track, August 2026, not obsoleted) defines the X25519MLKEM768 hybrid; Cloudflare's live page (updated June 2026) lists it as the default in Chrome, Edge, Firefox and Safari. "Usually" is a describing word that passes as true for a beginner.

### units[0].learn.facts[13] ("fact-inside") — ✅

"Inside the seal: the same HTTP as before (in HTTP/1.1, plain text), such as GET / HTTP/1.1 and a 200 OK reply"

- `rfc-9112` §9.7
  > Conceptually, HTTP/TLS is simply sending HTTP messages over a
  > connection secured via TLS
- `rfc-9112` §3
  > A request-line begins with a method token, followed by a single space
  > (SP), the request-target, and another single space (SP), and ends
  > with the protocol version.
- `rfc-9110` §15.3.1
  > The 200 (OK) status code indicates that the request has succeeded.
- `rfc-9114` §1.1
  > HTTP/1.1 ([HTTP/1.1]) uses whitespace-delimited text fields to convey
  > HTTP messages. While these exchanges are human readable
- `rfc-9110` §1.2
  > retaining compatibility with the existing text-based messaging
  > syntax
- Note: RFC 9112 and RFC 9110 define these; current.

### units[0].learn.facts[14] ("fact-type") — ✅

"Content-Type: names a file's media type, such as text/html, text/css or image/png"

- `rfc-9110` §8.3
  > The "Content-Type" header field indicates the media type of the
  > associated representation
- `iana-media-types` §Media Types, text
  > html text/html
- `iana-media-types` §Media Types, text
  > css text/css
- `iana-media-types` §Media Types, image
  > png PNG image/png
- Note: RFC 9110 defines Content-Type; the live IANA registry (updated 2026-11-10) lists all three types.

### units[0].learn.facts[15] ("fact-files") — ✅

"Other files: a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn't saved is fetched with its own GET"

- `whatwg-html` §4.6.8.23
  > The specified resource is a CSS style sheet that describes how to present the
  > document.
- `whatwg-html` §4.8.3
  > src — Address of the resource
- `whatwg-fetch` §2.2.5
  > Unless stated otherwise it is
  > `GET`.
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- `rfc-9111` §4.2
  > When a response is fresh, it can be used to satisfy subsequent
  > requests without contacting the origin server
- Note: The Fetch Standard defines a request's method (GET unless stated otherwise), RFC 9110 defines GET and RFC 9111 defines caching; all current. A stale saved copy may be revalidated with a conditional GET, which is still a GET.

### units[0].learn.facts[16] ("fact-records") — ✅

"Records: each is encrypted and checked (AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305); one altered on the way ends the connection"

- `rfc-9846` §5.2
  > AEAD functions provide a unified encryption
  > and authentication operation
- `rfc-9846` §5.2
  > If the decryption fails, the receiver MUST terminate the connection
  > with a "bad_record_mac" alert.
- `rfc-9846` §9.1
  > A TLS-compliant application MUST implement the
  > TLS_AES_128_GCM_SHA256 [GCM] cipher suite and SHOULD implement the
  > TLS_AES_256_GCM_SHA384 [GCM] and TLS_CHACHA20_POLY1305_SHA256
- Note: RFC 9846 defines record protection and the cipher suites; current. The three named suites are the ones the standard asks for; others exist, and leaving them out passes as true for a beginner.

### units[0].learn.facts[17] ("fact-drawing") — ✅

"Drawing: Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes."

- `whatwg-html` §4.6.8.23
  > A link element of this type is implicitly potentially render-blocking
  > if the element was created by its node document's parser.
- `whatwg-html` §4.6.8.23
  > If el's media attribute's value
  > matches the environment and el is
  > potentially render-blocking, then block rendering on
  > el.
- `whatwg-html` §4.6.8.23
  > Fire an event named load at el.
  > Otherwise, fire an event named error at el.
- `whatwg-html` §3.1.6
  > and the body element of document is null.
- `whatwg-html` §3.1.6
  > The current high resolution time given document's relevant
  > global object has not exceeded an implementation-defined timeout value.
- `whatwg-html` §8.1.7.3
  > doc is render-blocked;
- Note: The WHATWG HTML Living Standard defines render-blocking and the rendering loop; read live. The stylesheet's processing ends by unblocking rendering after the load or error event.

### units[0].learn.facts[18] ("fact-ticket") — ✅

"Session ticket: after the handshake the server may send a ticket (NewSessionTicket); a later visit can resume with it, skip the certificate, and even send its first request at once (0-RTT)"

- `rfc-9846` §4.7.1
  > the server MAY send a NewSessionTicket message at any time
  > after it has received the client Finished message.
- `rfc-9846` §4.7.1
  > The client MAY use this PSK for future handshakes by including the
  > ticket value in the "pre_shared_key" extension in its ClientHello
- `rfc-9846` §2.2
  > As the server is authenticating via a PSK, it does not send a
  > Certificate or a CertificateVerify message.
- `rfc-9846` §2.3
  > TLS 1.3 allows clients to send data on the
  > first flight ("early data").
- Note: RFC 9846 defines resumption and 0-RTT; current. "At once" leaves out that 0-RTT needs the server's agreement and has weaker replay protection; passes as true for a beginner.

### units[0].learn.facts[19] ("fact-validity") — ✅

"Certificates last: a few months (90 days is common), then they're renewed"

- `cloudflare-cert-validity` §Universal SSL
  > Universal certificates have a 90-day validity period. The auto renewal period starts 30 days before expiration.
- `letsencrypt-faq` §What is the lifetime for Let’s Encrypt certificates?
  > Our default certificates are valid for 90 days.
- `rfc-5280` §3.1
  > A certificate has a limited valid
  > lifetime, which is indicated in its signed contents.
- Note: Two independent vendors (Cloudflare, Let's Encrypt), pages live (Cloudflare updated 2026-10-15). Leaves out six-day and longer certificates; passes as true for a beginner.

### units[0].learn.facts[20] ("fact-honest") — ✅

"Padlock does not mean: the site is safe or honest: scam sites can have valid certificates too"

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > However, even websites with valid certificates may have a poor reputation, so always check the URL in the address bar to be sure you’re on the intended site before you enter any information.
- `rfc-8555` §1
  > The only validation the CA is required to perform in the DV issuance
  > process is to verify that the requester has effective control of the
  > domain [CABFBR]. The CA is not required to attempt to verify the
  > requester's real-world identity.
- Note: Microsoft and RFC 8555 confirm independently; both current.

### units[0].practice[0].options[0] (question "cafe-wifi") — ✅

Option "Everything, including your password." (wrong). Feedback: "Not quite. That would be true of plain HTTP. With HTTPS, the page and your password are sealed."

- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data"
- `rfc-9110` §4.2.2
  > all HTTP communication with that server has
  > confidentiality and integrity protection
- `google-chrome-secure` §What each security symbol means
  > The site doesn't use a private connection. Someone may be able to view and change the information you send and get through this site.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > HTTP sends data (like passwords or card numbers) in plain text, making it easier for hackers to intercept.
- Note: The option is rightly marked wrong, and the feedback is correct for that. Defining standards and two vendors agree.

### units[0].practice[0].options[1] (question "cafe-wifi") — ⚠️

Option "Which site you went to, but not what you read or typed." (right). Feedback: "Right. The addresses and the name show; what's inside the seal doesn't."

- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection
- `rfc-9849` §1
  > visible server IP
  > addresses
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- `rfc-9846` §F.3
  > TLS is susceptible to a variety of traffic analysis attacks based on
  > observing the length and timing of encrypted packets
- Note: "Not what you read or typed" is defined by RFC 9846's confidentiality property. The option is rightly marked as the answer.
- Note: What is wrong: that the site and its addresses show is stated only by RFC 9849 §1. It is not a defining standard for this, and the question's other citations do not state it, so the claim is not confirmed. RFC 9076 §5.1 (DNS seen by an eavesdropper) or RFC 6066 §3 is cited on the sibling option but not here.

### units[0].practice[0].options[2] (question "cafe-wifi") — ✅

Option "Nothing at all, not even the site." (wrong). Feedback: "Not quite. The DNS lookup and the name in the TLS hello can show which site it was. The contents stay sealed."

- `rfc-9076` §5.1
  > So,
  > if an initiator starts an HTTPS communication with a recipient, the
  > HTTP traffic will be encrypted, but the DNS exchange prior to it will
  > not be.
- `rfc-9849` §1
  > The target domain may also be visible through other
  > channels, such as plaintext client DNS queries
- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection
- `rfc-6066` §3
  > clients MAY include an
  > extension of type "server_name" in the (extended) client hello.
- Note: RFC 9076 and RFC 9849 independently state both points; RFC 6066 defines SNI. The option is rightly marked wrong.

### units[0].practice[1].options[0] (question "padlock") — ✅

Option "The line is encrypted and the site proved its name." (right). Feedback: "Yes. It tells you who you're talking to, and that nobody else can listen in."

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > The website you’re visiting has a valid certificate issued by a trusted authority. The information sent to and from the site is secure and can't be intercepted by an attacker.
- `cloudflare-mixed-content` §Mixed content errors
  > This indicates your site has a working SSL certificate and all resources loaded by the site are loaded over HTTPS.
- Note: Two vendors confirm; the option is rightly the answer.

### units[0].practice[1].options[1] (question "padlock") — ✅

Option "The site is safe and honest." (wrong). Feedback: "Not quite. A scam site can have a padlock too. It only proves the name and the seal."

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > However, even websites with valid certificates may have a poor reputation
- `rfc-8555` §1
  > The CA is not required to attempt to verify the
  > requester's real-world identity.
- Note: Microsoft and RFC 8555 confirm; rightly marked wrong.

### units[0].practice[1].options[2] (question "padlock") — ✅

Option "Your laptop has no viruses." (wrong). Feedback: "Not quite. The padlock is only about the connection to this site."

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > As you browse the web, you'll see an icon in the address bar that indicates the security of the connection to the site you're visiting.
- `cloudflare-mixed-content` §Mixed content errors
  > This indicates your site has a working SSL certificate and all resources loaded by the site are loaded over HTTPS.
- Note: Two vendors describe the icon as about the site's connection and certificate only; rightly marked wrong.

## 2. Traced, example, analogy and unbacked parts

Traced (each says nothing beyond the Learn parts it names; made-up addresses, ports, times and sizes in the event logs are illustration, not claims):

- `backing (the lesson's subtitle and summary)`: ✅
- `units[0].backing (the unit's full name and purpose)`: ✅
- `units[0].scene.backing (the scene)`: ✅
- `units[0].overview.hookBacking (the Overview hook)`: ✅
- `units[0].overview.facts[0] (Overview fact "Used for")`: ✅
- `units[0].overview.facts[1] (Overview fact "Port")`: ✅
- `units[0].overview.facts[2] (Overview fact "Is")`: ✅
- `units[0].overview.facts[3] (Overview fact "Proves the site with")`: ✅
- `units[0].overview.facts[4] (Overview fact "OSI layer")`: ✅
- `units[0].steps[0] (step "client-request")`: ✅
- `units[0].steps[0].facts[1] (step "client-request", fact "Scheme")`: ✅
- `units[0].steps[0].facts[2] (step "client-request", fact "Before the page")`: ✅
- `units[0].steps[0].facts[3] (step "client-request", fact "HSTS")`: ✅
- `units[0].steps[1] (step "dns-resolution")`: ✅
- `units[0].steps[1].facts[2] (step "dns-resolution", fact "Sealed?")`: ✅
- `units[0].steps[1].facts[3] (step "dns-resolution", fact "To hide it")`: ✅
- `units[0].steps[1].events[0] (event "m1")`: ✅
- `units[0].steps[1].events[1] (event "m2")`: ✅
- `units[0].steps[1].events[2] (event "seen-1")`: ✅
- `units[0].steps[2] (step "tcp-connection")`: ✅
- `units[0].steps[2].facts[1] (step "tcp-connection", fact "To")`: ✅
- `units[0].steps[2].facts[2] (step "tcp-connection", fact "Messages")`: ✅
- `units[0].steps[2].facts[3] (step "tcp-connection", fact "Sealed?")`: ✅
- `units[0].steps[2].events[0] (event "m3")`: ✅
- `units[0].steps[2].events[1] (event "m4")`: ✅
- `units[0].steps[2].events[2] (event "m5")`: ✅
- `units[0].steps[2].events[3] (event "seen-2")`: ✅ (traces fact-watch, which states it; that Learn part's own confirmation is the ⚠️ above)
- `units[0].steps[3] (step "tls-handshake")`: ✅ ("without the key ever crossing the network" restates term-key's "made on both sides")
- `units[0].steps[3].facts[0] (step "tls-handshake", fact "Version")`: ✅
- `units[0].steps[3].facts[1] (step "tls-handshake", fact "Certificate for")`: ✅
- `units[0].steps[3].facts[2] (step "tls-handshake", fact "Shared key made by")`: ✅
- `units[0].steps[3].facts[3] (step "tls-handshake", fact "Costs")`: ✅
- `units[0].steps[3].events[0] (event "m6")`: ✅
- `units[0].steps[3].events[1] (event "seen-3")`: ✅
- `units[0].steps[3].events[2] (event "m7")`: ✅
- `units[0].steps[3].events[3] (event "m8")`: ✅
- `units[0].steps[3].events[4] (event "seen-4")`: ✅
- `units[0].steps[4] (step "encrypted-http-exchange")`: ✅
- `units[0].steps[4].facts[0] (step "encrypted-http-exchange", fact "Inside")`: ✅
- `units[0].steps[4].facts[1] (step "encrypted-http-exchange", fact "On the wire")`: ✅
- `units[0].steps[4].facts[2] (step "encrypted-http-exchange", fact "Cipher")`: ✅
- `units[0].steps[4].facts[3] (step "encrypted-http-exchange", fact "A watcher sees")`: ✅
- `units[0].steps[4].events[0] (event "m9")`: ✅
- `units[0].steps[4].events[1] (event "seen-5")`: ✅
- `units[0].steps[4].events[2] (event "m10")`: ✅
- `units[0].steps[4].events[3] (event "seen-6")`: ✅
- `units[0].steps[5] (step "secure-session")`: ✅ (placing the ticket last is allowed: the server may send it at any time after the handshake)
- `units[0].steps[5].facts[0] (step "secure-session", fact "Padlock means")`: ✅
- `units[0].steps[5].facts[1] (step "secure-session", fact "Doesn’t mean")`: ✅
- `units[0].steps[5].facts[2] (step "secure-session", fact "Next visit")`: ✅
- `units[0].steps[5].facts[3] (step "secure-session", fact "Certificates last")`: ✅
- `units[0].steps[5].events[0] (event "m11")`: ✅
- `units[0].steps[5].events[1] (event "m12")`: ✅
- `units[0].steps[5].events[2] (event "seen-7")`: ✅
- `units[0].steps[5].events[3] (event "m13")`: ✅

Example:

- `units[0].overview.facts[5] (Overview fact "This example")`: ✅ (198.51.100.7 is RFC 5737 documentation space; the name is the site's own, used as the lesson's worked example)
- `units[0].steps[0].facts[0] (step "client-request", fact "URL")`: ✅
- `units[0].steps[1].facts[0] (step "dns-resolution", fact "Asks")`: ✅ (192.0.2.53, RFC 5737)
- `units[0].steps[1].facts[1] (step "dns-resolution", fact "Answer")`: ✅ (198.51.100.7, RFC 5737)
- `units[0].steps[2].facts[0] (step "tcp-connection", fact "From")`: ✅ (192.168.1.100, RFC 1918)

Analogy:

- `units[0].overview.backing (the Overview description)`: ✅ (postcard and locked box; the lesson itself shows what stays outside the box)

Unbacked:

- `title`: ✅
- `units[0].name`: ✅
- `units[0].practice[0].prompt (question "cafe-wifi")`: ✅
- `units[0].practice[1].prompt (question "padlock")`: ✅ (assumes a padlock by the address, which Edge, Firefox and Safari show; Chrome's change of icon does not make the question false)

## 3. Sources

All checked 2026-11-11.

- `cloudflare-cert-validity`: live, last updated 2026-10-15, current product. Current.
- `cloudflare-dns-encryption`: live, last updated 2026-05-05. Current.
- `cloudflare-lb-proxy-modes`: live, last updated 2026-04-16. Current.
- `cloudflare-mixed-content`: live, last updated 2026-10-21. Current.
- `cloudflare-pqc-support`: live, last updated 2026-06-24. Current.
- `google-chrome-always-secure`: live Chrome Help page (desktop version read). Current.
- `google-chrome-secure`: live Chrome Help page (desktop version read, which holds the cited "Resolve security and connection issues" section). Current.
- `iana-media-types`: live registry, XML form, updated 2026-11-10. Current.
- `iana-ports`: live registry, XML form, updated 2026-11-10. Current.
- `letsencrypt-faq`: live, ISRG's own page. Current.
- `letsencrypt-how`: live, ISRG's own page. Current.
- `microsoft-app-gateway`: live Microsoft Learn page on the current v2 service. Current.
- `microsoft-edge-https-first`: live Microsoft Support page. Current.
- `microsoft-edge-secure`: live Microsoft Support page. Current.
- `rfc-10024`: RFC Editor info page, Standards Track, August 2026, not obsoleted. Current.
- `rfc-1034`: not obsoleted; updated by 19 RFCs, none changing the cited sections. Current.
- `rfc-1035`: not obsoleted; updated by 29 RFCs, none removing UDP port 53. Current.
- `rfc-5280`: not obsoleted; updated by RFC 6818, 8398, 8399, 9549, 9598, 9608 and others, none changing §3, §3.1, §3.2 or §6.1. Current.
- `rfc-6066`: not obsoleted; updated by RFC 8446, 8449, 9325 and 9846; server_name stays in TLS 1.3. Current.
- `rfc-6797`: not obsoleted or updated. Current.
- `rfc-7748`: not obsoleted or updated. Current.
- `rfc-7858`: not obsoleted; updated by RFC 8310, which keeps port 853. Current.
- `rfc-8484`: not obsoleted or updated. Current.
- `rfc-8555`: not obsoleted or updated. Current.
- `rfc-9000`: not obsoleted. Current.
- `rfc-9001`: not obsoleted. Current.
- `rfc-9076`: not obsoleted (it obsoletes RFC 7626). Current.
- `rfc-9110`: not obsoleted. Current.
- `rfc-9111`: not obsoleted. Current.
- `rfc-9112`: not obsoleted; updated by RFC 9931 (optimistic protocol transitions), which does not touch the cited sections. Current.
- `rfc-9114`: not obsoleted. Current.
- `rfc-9293`: not obsoleted. Current.
- `rfc-9308`: not obsoleted. Current.
- `rfc-9499`: not obsoleted. Current.
- `rfc-9525`: not obsoleted (it obsoletes RFC 6125). Current.
- `rfc-9846`: published July 2026, obsoletes RFC 8446; not obsoleted. Current.
- `rfc-9849`: not obsoleted. Current.
- `whatwg-fetch`: WHATWG Living Standard, read live. Current.
- `whatwg-html`: WHATWG Living Standard, read live. Current.

## 4. Limit overrides

None.
