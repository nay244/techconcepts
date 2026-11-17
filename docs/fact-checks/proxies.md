```json fact-check
{
  "slug": "proxies",
  "hash": "4247ed6a908dc6be79da665546d0df7ee26d44693fec54432ef79f66d3b803cf",
  "checked": "2026-11-16",
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
    "units[0].overview.facts[0] (Overview fact \"Does\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Forward proxy\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Reverse proxy\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"The site sees\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].steps[0] (step \"straight\")": "✅",
    "units[0].steps[0].facts[0] (step \"straight\", fact \"Your laptop\")": "✅",
    "units[0].steps[0].facts[1] (step \"straight\", fact \"The site sees\")": "✅",
    "units[0].steps[0].facts[2] (step \"straight\", fact \"Can read the request\")": "✅",
    "units[0].steps[0].facts[3] (step \"straight\", fact \"Going to\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-get\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-row\")": "✅",
    "units[0].steps[0].events[2] (event \"s1-page\")": "✅",
    "units[0].steps[1] (step \"set-to-use\")": "✅",
    "units[0].steps[1].facts[0] (step \"set-to-use\", fact \"The proxy\")": "✅",
    "units[0].steps[1].facts[1] (step \"set-to-use\", fact \"Your browser asks\")": "✅",
    "units[0].steps[1].facts[2] (step \"set-to-use\", fact \"The proxy\")": "✅",
    "units[0].steps[1].facts[3] (step \"set-to-use\", fact \"The answer\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-connect\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-tcp\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-ok\")": "✅",
    "units[0].steps[2] (step \"tunnel\")": "✅",
    "units[0].steps[2].facts[0] (step \"tunnel\", fact \"The site sees\")": "✅",
    "units[0].steps[2].facts[1] (step \"tunnel\", fact \"The proxy reads\")": "✅",
    "units[0].steps[2].facts[2] (step \"tunnel\", fact \"The proxy knows\")": "✅",
    "units[0].steps[2].facts[3] (step \"tunnel\", fact \"A proxy\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-in\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-out\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-row\")": "✅",
    "units[0].steps[2].events[3] (event \"s3-back\")": "✅",
    "units[0].steps[2].events[4] (event \"s3-page\")": "✅",
    "units[0].steps[3] (step \"reverse-proxy\")": "✅",
    "units[0].steps[3].facts[0] (step \"reverse-proxy\", fact \"techconcepts.app’s address\")": "✅",
    "units[0].steps[3].facts[1] (step \"reverse-proxy\", fact \"Your sealed line\")": "✅",
    "units[0].steps[3].facts[2] (step \"reverse-proxy\", fact \"The web server\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-get\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-note\")": "✅",
    "units[0].steps[4] (step \"passed-on\")": "✅",
    "units[0].steps[4].facts[0] (step \"passed-on\", fact \"The server sees\")": "✅",
    "units[0].steps[4].facts[1] (step \"passed-on\", fact \"Your address\")": "✅",
    "units[0].steps[4].facts[2] (step \"passed-on\", fact \"Inside the site\")": "✅",
    "units[0].steps[4].facts[3] (step \"passed-on\", fact \"A reverse proxy can also\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-get\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-row\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-ok\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-page\")": "✅",
    "units[0].steps[0].deep[0] (step \"straight\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"set-to-use\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"tunnel\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"reverse-proxy\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"passed-on\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "✅",
    "units[0].learn.terms[0] (\"term-proxy\")": "✅",
    "units[0].learn.terms[1] (\"term-forward\")": "✅",
    "units[0].learn.terms[2] (\"term-reverse\")": "✅",
    "units[0].learn.terms[3] (\"term-tunnel\")": "✅",
    "units[0].learn.terms[4] (\"term-xff\")": "✅",
    "units[0].learn.terms[5] (\"term-termination\")": "✅",
    "units[0].learn.terms[6] (\"term-cache\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-inspect\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-cdn\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-transparent\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-sees\")": "✅",
    "units[0].learn.facts[1] (\"fact-knows\")": "✅",
    "units[0].learn.facts[2] (\"fact-passes-on\")": "✅",
    "units[0].learn.facts[3] (\"fact-not-sealed\")": "⚠️",
    "units[0].learn.facts[4] (\"fact-connect\")": "✅",
    "units[0].learn.facts[5] (\"fact-https\")": "✅",
    "units[0].learn.facts[6] (\"fact-here\")": "✅",
    "units[0].learn.facts[7] (\"fact-termination\")": "✅",
    "units[0].learn.facts[8] (\"fact-inside\")": "✅",
    "units[0].learn.facts[9] (\"fact-cache\")": "✅",
    "units[0].learn.facts[10] (\"fact-nat\")": "✅",
    "units[0].learn.facts[11] (\"fact-setup\")": "✅",
    "units[0].learn.facts[12] (\"fact-osi\")": "✅",
    "units[0].learn.facts[13] (\"fact-request\")": "✅",
    "units[0].learn.facts[14] (\"fact-padlock\")": "✅",
    "units[0].practice[0].options[0] (question \"who-sees\")": "✅",
    "units[0].practice[0].options[1] (question \"who-sees\")": "✅",
    "units[0].practice[0].options[2] (question \"who-sees\")": "✅",
    "units[0].practice[1].options[0] (question \"reverse\")": "✅",
    "units[0].practice[1].options[1] (question \"reverse\")": "✅",
    "units[0].practice[0].prompt (question \"who-sees\")": "✅",
    "units[0].practice[1].prompt (question \"reverse\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-gateway-proxy",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cloudflare-how-works",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cloudflare-http-headers",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cloudflare-mixed-content",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cloudflare-tls-decryption",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-cdn-overview",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-https-lb",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-lb-overview",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-swp-overview",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-swp-tls",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-app-gateway",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-app-gateway-how",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-app-gateway-tls",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-edge-secure",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-what-is-proxy",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-windows-proxy",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "paloalto-proxy-server",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-3022",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-4787",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-7239",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9111",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9112",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9846",
      "current": true,
      "checked": "2026-11-16"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-16",
    "count": 189,
    "digest": "5927e4ba0551b31b6aff09248bfd208acf19b7385a46cd4ebfe49e8d4e172674",
    "files": {
      "google-lb-overview": "6476846f588b0bce4298caff89d18e5218a87b3b82a907bb1a1e99dff759fea0",
      "cloudflare-network-layers": "25920dcd3a954c776d5b4f53317fdfb4321c3d71fcc80e1e5ca2213a9c8edf8e",
      "cloudflare-gateway-proxy": "511cffc641671e216b574ab0c6b6497559bf55dcfcbd59d999dfdb2777da8ac1",
      "microsoft-app-gateway": "9ec33585339657009307439c927466e977e1324b7e13aff485717a8c72346bd2",
      "microsoft-app-gateway-how": "81b7450c19204a784f6e45049aa5398bb35e09b2d1a1d42b8a4b47b11724cda6",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "microsoft-windows-proxy": "2140ad856e135a37c7ebf419e310ee009c5a1bebee86fbecd7278f7783f0fa29",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "google-swp-overview": "43e78a3ef364521e80c3d35110fdd49d7afd23bc5ab324cfc6626f1492797565",
      "microsoft-what-is-proxy": "71fa3d715be280320c69f9a4fc4eba4fcb22cac1fe6ecfada3146e5567c6e578",
      "paloalto-proxy-server": "b61cb93a87699cbdc2a4d704839d49b24bda6a553e4329503e6201de106e3e5a",
      "rfc-7239": "f15c45c9e079684bc4284d041be63285923962448cb0d8540d54106c68c2a40d",
      "cloudflare-http-headers": "ecff2daf246839988c95c390e8645c2ef7bb046643e20fd45ea4b02601999859",
      "microsoft-app-gateway-tls": "a2248097507db0955540d458f8549a9b786a10ecd5a112f31105d0fdaa0efc64",
      "cloudflare-how-works": "0c0732ebcdeaa21a61c1874f00c900d23d40f465ca2507886fd387438f417b60",
      "google-https-lb": "8c8af0eb1a81b55d4bc7d92c1243d72182a04142062bac8d11aec4c3bc1bf600",
      "rfc-9111": "aeb52adb3279d5f23dae34f68af11bd5cef0a0aff7ffcd014c9ca93c5302cf3e",
      "google-cdn-overview": "5576bdf093c6b784e35501fd53363a5c23b5dcd2ed3e7c8285498208a062d896",
      "google-swp-tls": "d42189aa5260919f8bf19b949e5f5cb0233b50915be169acec1e639bd43e4d21",
      "cloudflare-tls-decryption": "1ee2a8d13fdf087ff482aafaf2563b7cf1342e85b36c63233c5040c62985d40a",
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937",
      "microsoft-edge-secure": "e34cd96de00d278fdcaaef53474134c08e9cf99930429a2373157d3e76b048ee",
      "cloudflare-mixed-content": "c628a90860b17475ff6e18ee7963ba9a770cd3b383c93c18955e873ac60eeed3"
    }
  },
  "items": {
    "title": "8c64e20ab19a1f4b301c6d7f17325c7df7b6edb5e8d5829dec829bf1e36ac483",
    "units[0].name": "9246a02889012d2493dc5450ba5792b05eb1ae6ceb12b70254e767de48231a47",
    "units[0].osi": "43a10eae3c9d1be657b16530a5089454b1749fb70cf28072831cb2a504c8fdfd",
    "backing (the lesson's subtitle and summary)": "aefbf5027768155a6cc3ab30f5d0901fff98adb3b2ee95e21379abbc4616c368",
    "units[0].backing (the unit's full name and purpose)": "dd12f420037a3fb5821ffc517839d1ce96599ec83d8b14e173dc157daca47301",
    "units[0].scene.backing (the scene)": "6f5e97802fa1b5f4ed01a9af7bf130e42d6fe1c6d46d6c9c07edf676b1b4167a",
    "units[0].overview.hookBacking (the Overview hook)": "6898053eb48bc45877bced5801188b4207d5e029de12f7abf6f927fc378e646d",
    "units[0].overview.backing (the Overview description)": "bed09a03528c7196d1efb22cade286276a4f0643b76fbae67d1cf8708824a5d3",
    "units[0].overview.facts[0] (Overview fact \"Does\")": "3cf91d28b0a1c82b843b850ab8b51abdf5ae4ffde0b228d1c05a2f188200d44c",
    "units[0].overview.facts[1] (Overview fact \"Forward proxy\")": "cb2964c84d981326d418c58928c9a988eab516b70f2b32d49b4edae3b52bb7f0",
    "units[0].overview.facts[2] (Overview fact \"Reverse proxy\")": "1492aec236ead2967205a9c6b65bd5d12bbb57d554e86b9d56a44827019e0762",
    "units[0].overview.facts[3] (Overview fact \"The site sees\")": "0a8ad77fde132b6bf9ec9b2286bd18aee42eb9560203902ba26fc48bd5605d3f",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "0448557f8c3e9e109bbfcf50bb388ee56cdab743d7b15abeab9f61ab57e24e84",
    "units[0].steps[0] (step \"straight\")": "9bc34e29b0a4da30d966c890ef0099ea393ed6aa63582759630b28a9b960f5b5",
    "units[0].steps[0].facts[0] (step \"straight\", fact \"Your laptop\")": "b32a465bb1c345db7d1d6203254dab148a47dd302340f32b2210e790469b460c",
    "units[0].steps[0].facts[1] (step \"straight\", fact \"The site sees\")": "8fb45dcea56537d73efbaaf4f4d11cd21a22660d7913e1792bc182f1a703e1d3",
    "units[0].steps[0].facts[2] (step \"straight\", fact \"Can read the request\")": "3444bf7b22c3006df383d12750984465d6b3004a7c7956e4ad57897de7259a16",
    "units[0].steps[0].facts[3] (step \"straight\", fact \"Going to\")": "c17d64ede5464f34ad81846cd151224e60ffee048db86ec5ea4a4dad7373d1b0",
    "units[0].steps[0].events[0] (event \"s1-get\")": "0e6d2ac4ca494fa307afa5a77e1246254d05dcd1f4d7bb9ff95b4c8a468de79b",
    "units[0].steps[0].events[1] (event \"s1-row\")": "1755dc1ffd08da19a39ea30ba1f5d60a49b47fc066fc8afff2d20613caa93c29",
    "units[0].steps[0].events[2] (event \"s1-page\")": "dbce54adb11d4288529202259bfc1890f3a1702c5343267c58f0b09a1f25a067",
    "units[0].steps[1] (step \"set-to-use\")": "a0e01a00106c04f18f4d274841c91ba2bd9f8e87f93a49cb2c165034416aaa61",
    "units[0].steps[1].facts[0] (step \"set-to-use\", fact \"The proxy\")": "e47be5e55d66c30e47551bc9c6a7972e94bcff6789ae25375b0f9321bbd57270",
    "units[0].steps[1].facts[1] (step \"set-to-use\", fact \"Your browser asks\")": "c36758b65ac83909f93e47eeccfb5525d7e12ea3d4c986c91ac66a34f4fd3c91",
    "units[0].steps[1].facts[2] (step \"set-to-use\", fact \"The proxy\")": "b012058e514704c283a3b4b1895e5ddbec80bed1a11e419c8d2825ccf6380cc6",
    "units[0].steps[1].facts[3] (step \"set-to-use\", fact \"The answer\")": "9da69dbd23173507f072119ae5e89e909cc2ab19d69447cdc850c6a6ba04c981",
    "units[0].steps[1].events[0] (event \"s2-connect\")": "9e6548ebe2ae5060598a602a26cdedf1602fa2541a7f0ea89b50b3b6de482f95",
    "units[0].steps[1].events[1] (event \"s2-tcp\")": "b9157aa5f723ec861b21ae4c570444d081a48e2158dccb388e801b6d909dd076",
    "units[0].steps[1].events[2] (event \"s2-ok\")": "183dd08588d954a742147b893b1244baa7eec33b6eb9d3010f35e2be370d9908",
    "units[0].steps[2] (step \"tunnel\")": "822c0a10f2e1b750b655742598e539691bca71bfbb0ae7d3245a187fb492be43",
    "units[0].steps[2].facts[0] (step \"tunnel\", fact \"The site sees\")": "42dd44952013f84e08e67459837b2f3b521492a7e114e6cc7fc395215f857ae2",
    "units[0].steps[2].facts[1] (step \"tunnel\", fact \"The proxy reads\")": "bb155fa9c6434dd43a35ae2b02cefcb36dce58a8dc317ad887abd1c1b9d9a24c",
    "units[0].steps[2].facts[2] (step \"tunnel\", fact \"The proxy knows\")": "39427defedcff99012aad97fffa02714c3a5a0184a1b502e8303fa9225a5da88",
    "units[0].steps[2].facts[3] (step \"tunnel\", fact \"A proxy\")": "a771a2d2f6fd1280aaefc16ba86e2e3a930619d2e55ee95ce70842e60af67d9b",
    "units[0].steps[2].events[0] (event \"s3-in\")": "c711e0b9634c2ce82a3a2927f76438704b5e1a495380ada69918047829250784",
    "units[0].steps[2].events[1] (event \"s3-out\")": "40902f41e4fe181a43c0f3f5e75ed80e3a3b23ed5697734d953287ac40129d39",
    "units[0].steps[2].events[2] (event \"s3-row\")": "355af051bdc4a20b74d19b36882e0b8c66b7c698403485310f4efd304eb93e70",
    "units[0].steps[2].events[3] (event \"s3-back\")": "1a0ad23734a556971d75f04fdd9b663be58f5dbc74467b0716b51015ad96f476",
    "units[0].steps[2].events[4] (event \"s3-page\")": "7a1812c7dd54cb5c2270e94bb8b6f5f5ed1033c207a856a3a3b001f99de5d11c",
    "units[0].steps[3] (step \"reverse-proxy\")": "f8334526600708edade78a123ff282220266b96fda27654333259541f8063716",
    "units[0].steps[3].facts[0] (step \"reverse-proxy\", fact \"techconcepts.app’s address\")": "fece1666c9b93df3a468311e613610cf56af063aa0c9b9541423ffaafc9920b4",
    "units[0].steps[3].facts[1] (step \"reverse-proxy\", fact \"Your sealed line\")": "f5dae60e1bf94d7f8fc282bc2df281e2bdfb7d1edad8aef27433d7d6b3928aa1",
    "units[0].steps[3].facts[2] (step \"reverse-proxy\", fact \"The web server\")": "e236e3731f1565fee8afeb4a13ed0241acf5696b7f4f3d55424cbfbaf560cb07",
    "units[0].steps[3].events[0] (event \"s4-get\")": "a4ff7e7ce2cab88c231091ceef5f645cb41005c4fb8b71c93e6e525e66e861e7",
    "units[0].steps[3].events[1] (event \"s4-note\")": "e3b48a5787064c93d3f60fe388fa77a7ff96200a60a34896e15c4940ac7d913f",
    "units[0].steps[4] (step \"passed-on\")": "ef6f97e94527813e79e7f964fb128a42dca7707efa74b5b505a61470fa177a85",
    "units[0].steps[4].facts[0] (step \"passed-on\", fact \"The server sees\")": "a595a41be2bb3c35a50027c8f327cf6c5bcc81f2911aa07914ba89a063cc1ba7",
    "units[0].steps[4].facts[1] (step \"passed-on\", fact \"Your address\")": "c9418956172a07cad903db6449d6b1fa46b211915da5fef0abbe8592b84c75dc",
    "units[0].steps[4].facts[2] (step \"passed-on\", fact \"Inside the site\")": "a2f5d8ef3f0b726270a28d6c6b76335fa5f8f9108c70626a884a0678f5d04e39",
    "units[0].steps[4].facts[3] (step \"passed-on\", fact \"A reverse proxy can also\")": "776fd83b99cb7ff009e20a698d72684b4453621abfbf9a77eae36cc61c6a64f0",
    "units[0].steps[4].events[0] (event \"s5-get\")": "9ab1c27728baea1948decc23884ac73efcacce864358e62662cd9dc2bc6d9047",
    "units[0].steps[4].events[1] (event \"s5-row\")": "8d94756653db0df72e54b106322c9d6d2fc3e12347c5c864a4a375b2e56b77a5",
    "units[0].steps[4].events[2] (event \"s5-ok\")": "ee70670d6f0eb0b7400215cbc59d0ee17369f56cf05fcfc788427826748c9159",
    "units[0].steps[4].events[3] (event \"s5-page\")": "10671ae60084aa43a37dabd8f0ab3ae8bc56497cb3f57defc948b5ceacdc0838",
    "units[0].steps[0].deep[0] (step \"straight\", Go deeper)": "141c5cea2f15f3e17e70f0267dec81a498ebdfa84592ef9bf9c09ee08d8e7517",
    "units[0].steps[1].deep[0] (step \"set-to-use\", Go deeper)": "5b114b7bac3ea9b290f335834255c31161d2cf22719d343955601d96717970db",
    "units[0].steps[2].deep[0] (step \"tunnel\", Go deeper)": "32e71b889ac5054d15879b86843e59a45d304e82bb60acb9b11852d1e40c03b0",
    "units[0].steps[3].deep[0] (step \"reverse-proxy\", Go deeper)": "1725d17dc21cb6be8d680191a352ee03e2f09f2fd0c700fd494b31fc4a28c651",
    "units[0].steps[4].deep[0] (step \"passed-on\", Go deeper)": "493a6c4684a915d3c39ea28ee182a69e5f8e4f769ffd8d4e98c9175558dcaaf1",
    "units[0].learn.lead[0] (\"lead-1\")": "96ef75434b929149d4d2ec02a5f3295a0766124e6bb16eae3089230375e11dc3",
    "units[0].learn.lead[1] (\"lead-2\")": "5663d2c0e578c8ea884ee95803765166ee67bb08ba31b08e070d761142930adc",
    "units[0].learn.lead[2] (\"lead-3\")": "eca4ef2a77304ec6e71a11cde4fe5761250b4aa7d51c81cae100b1b7c32caf4a",
    "units[0].learn.terms[0] (\"term-proxy\")": "84cf31fa4508f78910ed35d86d22104cee2bad896a6c1201b994b8f9b6bdda2d",
    "units[0].learn.terms[1] (\"term-forward\")": "c47087a99b8b9e091c77b00f516c74edb9105117629a4fbceddb903dd77c8538",
    "units[0].learn.terms[2] (\"term-reverse\")": "f59151538856ee85b5832001354444a41c28d25a07b8d96a5bec5059032a1936",
    "units[0].learn.terms[3] (\"term-tunnel\")": "cea0acbf9f722b09cf45a9905b112d85b3900723f19a389e0a5c7430e1fb7dd9",
    "units[0].learn.terms[4] (\"term-xff\")": "3680f42a566f6f4f574e670736bcc4815a09bd369b826d483733dcad6cf62eed",
    "units[0].learn.terms[5] (\"term-termination\")": "d4863ff1633f917a2a961f4b6384f7b272c1ea9c6ae1069dffe3dd99e5f3af62",
    "units[0].learn.terms[6] (\"term-cache\")": "851faf5df2aa4af82be293af3661d0ede40d81f4d7f75f2cb77aaa1a583abec1",
    "units[0].learn.pattern (\"pattern\")": "dccbf9e359c7842fd45b241fa9c976e30b1b6fd646cfbc1e53ce1764641573c3",
    "units[0].learn.why[0] (\"why-1\")": "d70f2b5a550991edf5048888fe005d170953297a61b1cbbf30e5d130324ea331",
    "units[0].learn.why[1] (\"why-2\")": "e96fe27ae7b8ae1efc433d542611a6e816043c0f004779d48791c95f9722d244",
    "units[0].learn.deep[0] (\"deep-inspect\", Learn's Go deeper)": "9fc44feb7c9ddcac8c44e0043db647a006157f10b182d3acb7ec21ce958efcd8",
    "units[0].learn.deep[1] (\"deep-cdn\", Learn's Go deeper)": "728a05fa17ce8b463313e5f43dd937da095d3cb46acd8d729277ae069bbc6beb",
    "units[0].learn.deep[2] (\"deep-transparent\", Learn's Go deeper)": "3046797c85dcd947169cd8a78a44ddcd1275e0392c9ec54a6f4569367126a71f",
    "units[0].learn.facts[0] (\"fact-sees\")": "9a4a2eec773af8a4ec8a5e4a6aff3d33988e5dd9bceb576f85c031b91edd9c9f",
    "units[0].learn.facts[1] (\"fact-knows\")": "fb57f5159838ff9d335c3a0d02b0b7c7d738728f7fdc91038a0b0be7bd426b52",
    "units[0].learn.facts[2] (\"fact-passes-on\")": "e0f5787f2296c1e1718d090b03d957a74c1b9c26c4bcef730f144357841e38c4",
    "units[0].learn.facts[3] (\"fact-not-sealed\")": "5f63d6feded2da3640b9cff8b6d61579948df1f82727f0626808e7756dfa5c76",
    "units[0].learn.facts[4] (\"fact-connect\")": "503eb04b19ba977819edd7f5ac6e82618d5d96c1500600f672335d552742b2d9",
    "units[0].learn.facts[5] (\"fact-https\")": "38ceb69116362c9089afe7f8b59f84812da88a035c977476731b99fc26027f18",
    "units[0].learn.facts[6] (\"fact-here\")": "8ee6e0c78574a8cff34a09d1534700771fe613c9c10389fd2533506ef98ae405",
    "units[0].learn.facts[7] (\"fact-termination\")": "27e8fff6fb17ce50d30ec01277cb7aea4bbb265b857626e9c64c3c6a528935aa",
    "units[0].learn.facts[8] (\"fact-inside\")": "f57fc65cebc6367624127caa9c7706c0f211904e79fa1cb91382c61ea6f6cc81",
    "units[0].learn.facts[9] (\"fact-cache\")": "af55de999ec1bc0a52e22e0761e99d71ef75cb3307cf95a369f913841c4b972f",
    "units[0].learn.facts[10] (\"fact-nat\")": "881b03681d66a726bd1f00fa9b6831bf70f39dc077d38341e27e086021c1dc95",
    "units[0].learn.facts[11] (\"fact-setup\")": "afba7bdf257b02850a81a12416fe3c42aa8a6216b927e339db9145a8a6883549",
    "units[0].learn.facts[12] (\"fact-osi\")": "8ce6530cbfef01fc2d11a5eb870fd5a697fe5c98538afc469110a470fd03f503",
    "units[0].learn.facts[13] (\"fact-request\")": "ecdeef1d0fa76f2c0cb4a9afe005b2bf53aa6426d4f8e1b6c56be78d45ad57b5",
    "units[0].learn.facts[14] (\"fact-padlock\")": "0acce424146ce2675155f123b41ec5432498578aa9c25127f3cb088dba435f76",
    "units[0].practice[0].options[0] (question \"who-sees\")": "068ba5241a9ffdf1615a48ffc83d25bf2182088eb9668ef5112c25d745447efc",
    "units[0].practice[0].options[1] (question \"who-sees\")": "325a186a62b921ad7899a5fd69473d2add13e1cf4b2eca9481dd88396499577b",
    "units[0].practice[0].options[2] (question \"who-sees\")": "9b13a04795121e66457a1df7ecbf88ac7e0ba888b5d68a3c6f9b2e34b74a78a8",
    "units[0].practice[1].options[0] (question \"reverse\")": "0bc4df900af62664f89adec489691ff0f10bb007a5292da9b8d689aec1843b83",
    "units[0].practice[1].options[1] (question \"reverse\")": "825fe72fe609f641bf51fbee3123222109b383a7689638d5c5132084428db474",
    "units[0].practice[0].prompt (question \"who-sees\")": "d4005f480447119d1f9385b47736f95f3ce9d660eadd110c79fa9753f866c92f",
    "units[0].practice[1].prompt (question \"reverse\")": "42bbc5f886a9edea10de78429f11da4381f4d435d6df6bdaa15f39853e469707"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: proxies

Checked 2026-11-16 against every cited source, fetched in this run from the publisher's own site. 97 items: 96 ✅, 1 ⚠️, 0 ❌.

## Claims

### units[0].osi — ✅

Layers 4 and 7.

- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers
- `google-lb-overview` §Proxy Network Load Balancers
  > Proxy Network Load Balancers are Layer 4 reverse proxy load balancers that distribute
  > TCP traffic to virtual machine (VM) instances in your Google Cloud
- `cloudflare-network-layers` §Network Layers
  > 7 Application layer
- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer
- `cloudflare-gateway-proxy` §Proxy
  > When a user connects to the Gateway proxy, Gateway will accept the connection and establish a new, separate connection to the origin server.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7) and provides features like SSL/TLS termination
- `microsoft-app-gateway-how` §Modifications to the request
  > Application gateway inserts six additional headers to all requests before it forwards the requests to the backend.
- Note: Layer 7 is confirmed by Google (proxy-based Layer 7 load balancers) and Microsoft (Application Gateway at OSI layer 7); layer 4 by Google (Layer 4 reverse proxy load balancers) and Cloudflare, whose layer table lists Cloudflare Gateway (outbound only) and Load Balancing in both the layer 7 and the layer 4 rows. Two publishers for each layer.
- Note: Palo Alto's explainer opens by describing a proxy loosely as working at the network layer, not meaning OSI layer 3, and every source that names an OSI layer puts proxies at 7 or 4. No allowed source met places proxies at a single layer.
- Note: all pages live and current, checked 2026-11-16.

### units[0].steps[0].deep[0] (step "straight", Go deeper) — ✅

"Every device at home goes out through your router’s one public address."

- `rfc-3022` §2.2
  > nodes on the private network could be allowed
  > simultaneous access to the external network, using the single
  > registered IP address with the aid of NAPT.
- `rfc-3022` §2.2
  > This model fits the requirements of most Small Office Home Office
  > (SOHO) groups to access external network using a single service
  > provider assigned IP address.
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address
  > simultaneously.
- Note: two independent RFCs. The claim speaks of the ordinary home IPv4 case; it leaves out IPv6, where home devices usually have their own public addresses, and carrier-grade NAT.
- Note: RFC 3022 is not obsoleted. RFC 4787 is updated by RFC 6888 (carrier-grade NAT requirements) and RFC 7857 (NAT44 clarifications); neither changes the sharing of one public address described here.

### units[0].steps[1].deep[0] (step "set-to-use", Go deeper) — ✅

"Your laptop knows to use the proxy because it’s set up with the proxy’s address. Organisations often set their devices up this way, to check and log their web traffic."

- `microsoft-windows-proxy` §Summary
  > In some cases, your company or organization might require a proxy server.
- `microsoft-windows-proxy` §To set up a proxy server connection manually
  > In the Proxy IP address and Port boxes, enter the proxy server name or IP address and port (optional) in the respective boxes.
- `rfc-9110` §3.7
  > A "proxy" is a message-forwarding agent that is chosen by the client,
  > usually via local configuration rules
- `rfc-9110` §3.7
  > Proxies are often used to group an
  > organization's HTTP requests through a common intermediary for the
  > sake of security services, annotation services, or shared caching.
- `google-swp-overview` §How Secure Web Proxy works
  > the proxy inspects the request and applies your
  > security policies to determine whether to allow or deny the connection.
- `google-swp-overview` §Deployment modes
  > you must explicitly configure your workload environments and clients to
  > point directly to the proxy server.
- `microsoft-what-is-proxy` §Forward proxy
  > Log outgoing traffic for monitoring.
- `paloalto-proxy-server` §Forward proxy
  > This is the most common type of proxy in enterprise networks, where it's used for traffic filtering, TLS decryption, policy enforcement, and user activity logging.
- Note: RFC 9110 §3.7 is the defining standard for an HTTP proxy: it defines the proxy as an agent the client chooses, usually by its own configuration.
- Note: leaves out automatic detection and setup scripts (Windows lists them), which still give the device the proxy's address, and transparent proxies, which the lesson covers in its own Go deeper.

### units[0].steps[2].deep[0] (step "tunnel", Go deeper) — ✅

"Over plain HTTP there’s no seal. Your browser hands the proxy the whole request, so the proxy can read it, and it can add your address in a header before passing it on."

- `paloalto-proxy-server` §HTTP/HTTPS proxy
  > HTTP proxies can inspect unencrypted traffic
- `rfc-9110` §3.7
  > A "proxy" is a message-forwarding agent that is chosen by the client,
  > usually via local configuration rules, to receive requests for some
  > type(s) of absolute URI and attempt to satisfy those requests via
  > translation through the HTTP interface.
- `rfc-7239` §4
  > This applies
  > to forwarding proxies, as well as reverse proxies.  Information
  > passed in this header field can be, for example, the source IP
  > address of the request
- `cloudflare-http-headers` §X-Forwarded-For
  > Proxy A will append the original visitor's IP address (203.0.113.1) to X-Forwarded-For before proxying the request to proxy B
- Note: RFC 9110 §3.7 defines the HTTP proxy, which receives the request itself; RFC 7239 §4 defines the Forwarded header field, which forwarding proxies may fill with the request's source address. Palo Alto and Cloudflare confirm independently.

### units[0].steps[3].deep[0] (step "reverse-proxy", Go deeper) — ✅

"Ending HTTPS at the reverse proxy saves the servers behind it that work, and lets the reverse proxy read each request to choose where it goes."

- `microsoft-app-gateway-tls` §TLS termination
  > Better utilization of the backend servers – SSL/TLS processing is very CPU intensive, and is becoming more intensive as key sizes increase.
- `microsoft-app-gateway-tls` §TLS termination
  > Intelligent routing – By decrypting the traffic, the application gateway has access to the request content, such as headers, URI, and so on, and can use this data to route requests.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > A reverse proxy can be configured to decrypt all incoming requests and encrypt all outgoing responses, freeing up valuable resources on the origin server.
- `google-https-lb` §Architecture
  > The HTTP(S) proxy uses a URL map to make a routing
  > determination based on HTTP attributes (such as the request path, cookies,
  > or headers).
- Note: both halves are stated by two publishers (Microsoft and Cloudflare for the saved work; Microsoft and Google for routing on the request's content).

### units[0].steps[4].deep[0] (step "passed-on", Go deeper) — ✅

"A reverse proxy can keep a copy of the page and give it to the next reader without asking the server, but only if the site’s response allows it. A response marked no-store or private isn’t kept for others."

- `rfc-9111` §3
  > A cache MUST NOT store a response to a request unless:
- `rfc-9111` §5.2.2.5
  > The no-store response directive indicates that a cache MUST NOT store
  > any part of either the immediate request or the response and MUST NOT
  > use the response to satisfy any other request.
- `rfc-9111` §5.2.2.7
  > The unqualified private response directive indicates that a shared
  > cache MUST NOT store the response (i.e., the response is intended for
  > a single user).
- `rfc-9111` §1
  > A cache considers a stored response "fresh", as defined in Section 4.2,
  > if it can be reused without "validation" (checking with the origin
  > server to see if the cached response remains valid for this request).
- `google-cdn-overview` §Serve content from a cache
  > Your origin server uses HTTP headers to indicate which
  > responses are cached.
- Note: RFC 9111 is the defining standard for HTTP caching: §3 lists when a cache may store a response, §5.2.2.5 and §5.2.2.7 define no-store and private, §1 defines reuse without checking with the origin.
- Note: "allows it" covers both explicit permission and responses that are cacheable by default (heuristic caching, RFC 9111 §3); the claim says it loosely, which is true for a beginner.

### units[0].learn.lead[0] ("lead-1") — ✅

"A proxy is a go-between. Your request goes to the proxy, and the proxy opens a connection of its own to the site and passes the request on. So the site sees the proxy’s address, not yours."

- `rfc-9110` §3.7
  > A request or response message that
  > travels the whole chain will pass through four separate connections.
- `microsoft-what-is-proxy` §What is a proxy?
  > A proxy is an intermediary server that sits between a client (such as your application) and a destination server (such as a back-end API).
- `paloalto-proxy-server` §How do proxy servers work?
  > The proxy responds to the request back to the client to keep the session open, and opens a second connection to the destination.
- `google-swp-overview` §Deployment modes
  > In this way, Secure Web Proxy acts as an
  > intermediary, establishing new TCP connections for the client
- `cloudflare-gateway-proxy` §Proxy
  > When a user connects to the Gateway proxy, Gateway will accept the connection and establish a new, separate connection to the origin server.
- `rfc-7239` §1
  > However, these proxies make the requests appear as if
  > they originated from the proxy's IP address
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's, effectively masking the original IP address.
- Note: RFC 9110 §3.7 defines HTTP intermediaries and shows each hop on its own connection. "Sees the proxy’s address" is about the connection; the lesson teaches separately that a header can carry yours (fact-passes-on).

### units[0].learn.lead[1] ("lead-2") — ✅

"A **forward proxy** works for the people whose devices are set to use it. A **reverse proxy** works for a site: it stands in front of the site’s servers."

- `rfc-9110` §3.7
  > A "gateway" (a.k.a. "reverse proxy") is an intermediary that acts as
  > an origin server for the outbound connection but translates received
  > requests and forwards them inbound to another server or servers.
- `microsoft-what-is-proxy` §What is a proxy?
  > In short, a proxy acts on behalf of either the client or the server to mediate communication.
- `microsoft-what-is-proxy` §Forward proxy
  > A forward proxy sits in front of the client.
- `microsoft-what-is-proxy` §Reverse proxy
  > A reverse proxy sits in front of the server.
- `paloalto-proxy-server` §Forward proxy
  > A forward proxy acts on behalf of the client.
- `paloalto-proxy-server` §Reverse proxy
  > A reverse proxy acts on behalf of a server or service.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > A reverse proxy is a network of servers that sits in front of web servers and either forwards requests to those web servers, or handles requests on behalf of the web servers.
- Note: RFC 9110 §3.7 defines the proxy (chosen by the client) and the gateway, or reverse proxy. "Set to use it" leaves out transparent forward proxies, which the lesson's own Go deeper teaches.

### units[0].learn.terms[0] ("term-proxy") — ✅

"Proxy (proxy server)": "A go-between that takes your request and passes it on, on a connection of its own".

- `rfc-9110` §3.7
  > A request or response message that
  > travels the whole chain will pass through four separate connections.
- `microsoft-what-is-proxy` §What is a proxy?
  > A proxy is an intermediary server that sits between a client (such as your application) and a destination server (such as a back-end API).
- `paloalto-proxy-server` §How do proxy servers work?
  > opens a second connection to the destination.
- `google-swp-overview` §Deployment modes
  > establishing new TCP connections for the client
- `cloudflare-gateway-proxy` §Proxy
  > Gateway will accept the connection and establish a new, separate connection to the origin server.
- `microsoft-windows-proxy` §Summary
  > A proxy server in Windows routes your internet traffic through an intermediary instead of connecting directly from your device.
- Note: RFC 9110 §3.7 defines HTTP intermediaries, the proxy among them; Microsoft's Windows page gives the name "proxy server".

### units[0].learn.terms[1] ("term-forward") — ✅

"Forward proxy": "A proxy that devices are set to use, working for them on the way out".

- `rfc-9110` §3.7
  > A "proxy" is a message-forwarding agent that is chosen by the client,
  > usually via local configuration rules
- `microsoft-what-is-proxy` §Forward proxy
  > A forward proxy sits in front of the client. When your application makes a request, it goes through the proxy, which decides whether and how to forward it.
- `paloalto-proxy-server` §Forward proxy
  > It sits between internal users and external services, forwarding client requests to the internet.
- `paloalto-proxy-server` §Explicit proxy
  > An explicit proxy requires the client device or application to be configured with the proxy's address.
- `microsoft-windows-proxy` §To set up a proxy server connection manually
  > In the Proxy IP address and Port boxes, enter the proxy server name or IP address and port (optional) in the respective boxes.
- Note: RFC 9110 §3.7 defines the proxy as the client's chosen agent. Leaves out transparent proxies, covered by the lesson's Go deeper.

### units[0].learn.terms[2] ("term-reverse") — ✅

"Reverse proxy": "A proxy in front of a site’s servers, working for the site: requests for the site reach it first".

- `rfc-9110` §3.7
  > A "gateway" (a.k.a. "reverse proxy") is an intermediary that acts as
  > an origin server for the outbound connection but translates received
  > requests and forwards them inbound to another server or servers.
- `microsoft-what-is-proxy` §Reverse proxy
  > The reverse proxy receives incoming requests and forwards them to one of several back-end servers.
- `paloalto-proxy-server` §Reverse proxy
  > It receives incoming requests from external clients and routes them to backend systems.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > If the domain's status is active, all HTTP/HTTPS requests for proxied DNS records route through Cloudflare.
- Note: RFC 9110 §3.7 defines the gateway, or reverse proxy.

### units[0].learn.terms[3] ("term-tunnel") — ✅

"Tunnel": "A connection a proxy only relays, both ways, without reading or changing it. A CONNECT request asks for one".

- `rfc-9110` §3.7
  > A "tunnel" acts as a blind relay between two connections without
  > changing the messages.
- `rfc-9110` §9.3.6
  > The CONNECT method requests that the recipient establish a tunnel to
  > the destination origin server identified by the request target and,
  > if successful, thereafter restrict its behavior to blind forwarding
  > of data, in both directions, until the tunnel is closed.
- Note: RFC 9110 defines the tunnel (§3.7) and the CONNECT method (§9.3.6); it is current (not obsoleted). Strictly, a tunnel relays between two connections; calling it one connection is a beginner's simplification.

### units[0].learn.terms[4] ("term-xff") — ✅

"X-Forwarded-For": "A header in which a proxy writes the address a request came from. The standard form is called Forwarded".

- `rfc-7239` §4
  > Information
  > passed in this header field can be, for example, the source IP
  > address of the request
- `rfc-7239` §1
  > This document standardizes a header field called "Forwarded" and provides the syntax and
  > semantics for disclosing such information.
- `cloudflare-http-headers` §X-Forwarded-For
  > X-Forwarded-For maintains proxy server and original visitor IP addresses.
- `microsoft-what-is-proxy` §Common headers and proxy considerations
  > X-Forwarded-For: Indicates the original IP address of the client.
- `microsoft-app-gateway-how` §Modifications to the request
  > These headers are x-forwarded-for, x-forwarded-port, x-forwarded-proto, x-original-host, x-original-url, and x-appgw-trace-id.
- `google-https-lb` §X-Forwarded-For header
  > The IP address of the client that connects to the load balancer
- Note: RFC 7239 §4 defines the standard Forwarded header field; its §1 names X-Forwarded-For as the non-standard header it standardizes. X-Forwarded-For itself is confirmed by Cloudflare, Microsoft and Google.

### units[0].learn.terms[5] ("term-termination") — ✅

"TLS termination": "A reverse proxy that holds the site’s certificate ends your HTTPS connection itself: it opens what you send and seals what it sends back, so it can read the request".

- `microsoft-app-gateway-tls` §TLS termination
  > To configure TLS termination, a TLS/SSL certificate must be added to the listener. This allows the Application Gateway to decrypt incoming traffic and encrypt response traffic to the client.
- `google-https-lb` §Architecture
  > For HTTPS load balancing, the target HTTPS proxy uses SSL
  > certificates to prove its identity to clients.
- `paloalto-proxy-server` §Reverse proxy
  > Reverse proxies are typically used for load balancing, TLS termination, traffic steering, and web application protection.
- `microsoft-what-is-proxy` §Reverse proxy
  > Terminate TLS/SSL connections.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > A reverse proxy can be configured to decrypt all incoming requests and encrypt all outgoing responses
- Note: Microsoft and Cloudflare each state the decrypt-and-re-encrypt behaviour; Google states the certificate.

### units[0].learn.terms[6] ("term-cache") — ✅

"Cache": "Copies of answers kept to answer the next request, when the response allows it".

- `rfc-9111` §1
  > A cache stores cacheable responses to reduce the response
  > time and network bandwidth consumption on future equivalent requests.
- `rfc-9111` §3
  > A cache MUST NOT store a response to a request unless:
- `google-cdn-overview` §Serve content from a cache
  > Your origin server uses HTTP headers to indicate which
  > responses are cached.
- Note: RFC 9111 is the defining standard for HTTP caches (§1 defines the cache, §3 when it may store).

### units[0].learn.pattern ("pattern") — ✅

"Take the request / Allow or block it / Open its own connection / Pass the answer back", with its note.

- `rfc-9110` §3.7
  > A request or response message that
  > travels the whole chain will pass through four separate connections.
- `rfc-9110` §9.3.6
  > restrict its behavior to blind forwarding
  > of data, in both directions, until the tunnel is closed.
- `microsoft-what-is-proxy` §What is a proxy?
  > When your application sends a request, the proxy receives it first.
- `microsoft-what-is-proxy` §How a proxy works
  > Rejecting the request based on rules or access policies.
- `microsoft-what-is-proxy` §How a proxy works
  > Forwarding the request to the target server and then relaying the response back to the client.
- `google-swp-overview` §How Secure Web Proxy works
  > the proxy inspects the request and applies your
  > security policies to determine whether to allow or deny the connection.
- `google-swp-overview` §Deployment modes
  > establishing new TCP connections for the client
- `cloudflare-gateway-proxy` §Proxy
  > Gateway will accept the connection and establish a new, separate connection to the origin server.
- `cloudflare-gateway-proxy` §Proxy algorithm
  > If the traffic passes inspection, Gateway proxies traffic bidirectionally between the user and the origin server.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > either forwards requests to those web servers, or handles requests on behalf of the web servers.
- `paloalto-proxy-server` §How do proxy servers work?
  > opens a second connection to the destination.
- Note: RFC 9110 defines intermediaries (§3.7) and the tunnel's blind relay (§9.3.6).
- Note: the order (decide, then connect) is Google's and Microsoft's; Cloudflare's Gateway opens the TCP connection to the origin first and inspects afterwards. "A new TCP connection" leaves out reverse proxies that reuse kept-open connections to their servers, and QUIC; the point, a connection of the proxy's own, is true.

### units[0].learn.why[0] ("why-1") — ✅

"Organisations use a forward proxy to control and log their people’s web traffic, and to share one cache."

- `rfc-9110` §3.7
  > Proxies are often used to group an
  > organization's HTTP requests through a common intermediary for the
  > sake of security services, annotation services, or shared caching.
- `microsoft-what-is-proxy` §Forward proxy
  > Control access to external resources.
- `google-swp-overview` §How Secure Web Proxy works
  > Secure Web Proxy acts as a mandatory security checkpoint for all web traffic
  > from your organization's network to the internet.
- `paloalto-proxy-server` §Forward proxy
  > This is the most common type of proxy in enterprise networks, where it's used for traffic filtering, TLS decryption, policy enforcement, and user activity logging.
- Note: RFC 9110 §3.7 defines the proxy and states the organisational uses, shared caching among them; Microsoft and Palo Alto confirm control and logging.

### units[0].learn.why[1] ("why-2") — ✅

"Sites use a reverse proxy to spread requests over several servers, to answer from copies, to handle HTTPS for their servers, and so readers never need the servers’ own addresses."

- `rfc-9110` §3.7
  > to improve server performance through "accelerator" caching, and to enable partitioning or load balancing
  > of HTTP services across multiple machines.
- `microsoft-what-is-proxy` §Reverse proxy
  > Load balance traffic across multiple services.
- `microsoft-what-is-proxy` §Reverse proxy
  > Serve cached responses to reduce back-end load.
- `microsoft-what-is-proxy` §Reverse proxy
  > Terminate TLS/SSL connections.
- `microsoft-what-is-proxy` §Reverse proxy
  > Hide internal service details from the public internet.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > With a reverse proxy in place, a web site or service never needs to reveal the IP address of their origin servers
- `paloalto-proxy-server` §Reverse proxy
  > Reverse proxies are typically used for load balancing, TLS termination, traffic steering, and web application protection.
- Note: each of the four uses is stated by at least two publishers (Microsoft with Cloudflare or Palo Alto; RFC 9110 for load balancing and caching).

### units[0].learn.deep[0] ("deep-inspect", Learn's Go deeper) — ✅

"Some organisations have their proxy open HTTPS to check it. The proxy then shows your browser a certificate of its own for each site, which works only on devices set up to trust the organisation."

- `google-swp-tls` §How it works
  > Secure Web Proxy generates a temporary
  > certificate for www.example.com in real time.
- `google-swp-tls` §Client trust requirements
  > clients trust the
  > connection only if your private root CA is pre-installed.
- `cloudflare-tls-decryption` §TLS decryption
  > When you turn on TLS decryption, Gateway will decrypt all traffic sent over HTTPS, apply your HTTP policies, and then re-encrypt the request with a user-side certificate.
- `cloudflare-tls-decryption` §Turn on TLS decryption
  > Before you turn on TLS decryption, ensure you have installed either a Cloudflare-generated certificate or custom certificate on your users' devices.
- `paloalto-proxy-server` §HTTP/HTTPS proxy
  > HTTPS proxies can decrypt and inspect TLS-encrypted traffic if configured with the appropriate certificates.
- Note: Google and Cloudflare each state both the proxy's own certificate and the need for devices to trust it.

### units[0].learn.deep[1] ("deep-cdn", Learn's Go deeper) — ✅

"A content delivery network (CDN) is the same idea on a large scale: reverse proxies in many places, each keeping copies of a site’s pages near the readers there."

- `rfc-9110` §3.8
  > content delivery networks that use gateway
  > caching to optimize regional and global distribution of popular
  > sites
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > Subsequent Parisian users who browse the site will then get the locally cached version from the Parisian reverse proxy server, resulting in much faster performance.
- `google-cdn-overview` §Cloud CDN overview
  > Cloud CDN (Content Delivery Network) uses Google's global edge network to
  > serve content closer to users
- Note: RFC 9110 uses "gateway" for the reverse proxy (§3.7), so §3.8 says CDNs use reverse-proxy caching; Cloudflare and Google confirm the many places near readers. RFC 9110 is not obsoleted.

### units[0].learn.deep[2] ("deep-transparent", Learn's Go deeper) — ✅

"Some networks put a proxy in the way without your device being set to use one. It’s called a transparent, or interception, proxy."

- `rfc-9110` §3.7
  > For example, an "interception proxy" [RFC3040] (also commonly known
  > as a "transparent proxy" [RFC1919]) differs from an HTTP proxy
  > because it is not chosen by the client.
- `microsoft-what-is-proxy` §Transparent proxy
  > A transparent proxy intercepts traffic without the client being explicitly configured to use it.
- `paloalto-proxy-server` §Transparent proxy
  > Transparent proxies intercept traffic without requiring users to manually configure proxy settings.
- Note: RFC 9110 §3.7 defines both names; two vendors confirm.

### units[0].learn.facts[0] ("fact-sees") — ✅

"The site sees: the proxy’s address, not yours: the connection is the proxy’s".

- `rfc-7239` §1
  > However, these proxies make the requests appear as if
  > they originated from the proxy's IP address
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's, effectively masking the original IP address.
- `paloalto-proxy-server` §How do proxy servers work?
  > The proxy replaces the user's IP address with its own and forwards the request to the destination site.
- `rfc-9110` §3.7
  > A request or response message that
  > travels the whole chain will pass through four separate connections.
- Note: RFC 9110 §3.7 defines intermediaries, each hop on its own connection. RFC 7239 and Palo Alto confirm what the site sees. A header may still carry your address; the lesson says so in fact-passes-on.

### units[0].learn.facts[1] ("fact-knows") — ✅

"The proxy sees: your address, and the name and port of each site you ask for, and it can log them".

- `rfc-9110` §9.3.6
  > CONNECT uses a special form of request target, unique to this method,
  > consisting of only the host and port number of the tunnel
  > destination, separated by a colon.
- `microsoft-what-is-proxy` §Forward proxy
  > Log outgoing traffic for monitoring.
- `paloalto-proxy-server` §Can my IP be tracked if I use a proxy?
  > If the proxy logs your activity or leaks your IP, it can be traced.
- `paloalto-proxy-server` §Forward proxy
  > user activity logging.
- Note: RFC 9110 §9.3.6 defines CONNECT and its host-and-port target. Your address reaching the proxy follows from your connection going to it (lead-1); Palo Alto states the proxy can log it.

### units[0].learn.facts[2] ("fact-passes-on") — ✅

"Your address: still reaches the site if a proxy that reads the request writes it in a header".

- `rfc-7239` §4
  > Information
  > passed in this header field can be, for example, the source IP
  > address of the request
- `cloudflare-http-headers` §X-Forwarded-For
  > X-Forwarded-For maintains proxy server and original visitor IP addresses.
- `microsoft-what-is-proxy` §Common headers and proxy considerations
  > When a request passes through a proxy, certain headers are added or modified to preserve important metadata.
- Note: RFC 7239 §4 defines the Forwarded header field; Cloudflare and Microsoft confirm with X-Forwarded-For.

### units[0].learn.facts[3] ("fact-not-sealed") — ⚠️

"Does a proxy encrypt?": "no; over HTTPS the seal is your browser’s and the site’s".

- `paloalto-proxy-server` §What does a proxy server do?
  > Proxies are used for privacy, access control, and performance optimization—but do not encrypt traffic by default.
- `paloalto-proxy-server` §What are the limitations of proxy servers?
  > Basic proxies don't encrypt traffic, exposing data on public or untrusted networks.
- `rfc-9110` §9.3.6
  > Tunnels are commonly used to create an end-to-end virtual connection, through one
  > or more proxies, which can then be secured using TLS
- `rfc-9846` §1
  > Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: what is wrong: the flat "no" is an absolute that rules out what this lesson itself teaches. A reverse proxy that ends HTTPS "seals what it sends back" (term-termination) and "seals it for you" (step "passed-on"), and an inspecting proxy shows your browser a certificate of its own (deep-inspect); in both cases the proxy does encrypt. The cited Palo Alto sections qualify the point (default behaviour, simple proxies); neither says a proxy never encrypts. A qualifier such as "not on its own" or "a forward proxy doesn’t add encryption" would make it true.
- Note: RFC 9110 and RFC 9846 are current; RFC 9846 (July 2026) obsoletes RFC 8446.

### units[0].learn.facts[4] ("fact-connect") — ✅

"HTTPS through a forward proxy": "an HTTP CONNECT request for the site’s name and port; a 2xx answer, such as 200 OK; then a tunnel, sealed end to end by HTTPS, that the proxy only relays".

- `rfc-9110` §9.3.6
  > Any 2xx (Successful) response indicates that the sender (and all
  > inbound proxies) will switch to tunnel mode immediately after the
  > response header section
- `rfc-9110` §9.3.6
  > Tunnels are commonly used to create an end-to-end virtual connection, through one
  > or more proxies, which can then be secured using TLS
- `rfc-9110` §3.7
  > Tunnels are used to
  > extend a virtual connection through an intermediary, such as when
  > Transport Layer Security (TLS, [TLS13]) is used to establish
  > confidential communication through a shared firewall proxy.
- Note: RFC 9110 §9.3.6 defines CONNECT, its host-and-port target and its 2xx answer; it is the current HTTP semantics standard. Leaves out the TLS-inspecting proxy, covered by deep-inspect.

### units[0].learn.facts[5] ("fact-https") — ✅

"HTTPS": "sends every HTTP message encrypted, as TLS application data, so only its two ends, your browser and the site, can read what’s inside".

- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data"
- `rfc-9846` §1
  > Data sent over the channel after establishment is
  > only visible to the endpoints.
- `rfc-9110` §4.2.2
  > A client MUST ensure that its HTTP requests for an "https" resource
  > are secured, prior to being communicated, and that it only accepts
  > secured responses to those requests.
- `cloudflare-tls-decryption` §TLS decryption
  > Without it, information contained within HTTPS encryption, such as the full URL, headers, and request body, will not be visible to Gateway.
- Note: RFC 9112 §9.7 defines HTTP/1.1 over TLS; RFC 9846 §1 defines TLS 1.3's confidentiality; RFC 9110 §4.2.2 defines the https scheme. RFC 9112 is updated by RFC 9931 (protocol upgrades), which does not touch this. The site's end may be its reverse proxy, as the lesson shows; HTTP/3 carries its messages over QUIC rather than TLS records, a newer variant left out.

### units[0].learn.facts[6] ("fact-here") — ✅

"The site here": "techconcepts.app, over HTTPS to port 443".

- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: RFC 9110 §4.2.2 defines the https scheme and its default port. The site is the lesson's scenario; the port is the standard default.

### units[0].learn.facts[7] ("fact-termination") — ✅

"A reverse proxy": "can hold the site’s certificate and open HTTPS itself".

- `microsoft-app-gateway-tls` §TLS termination
  > To configure TLS termination, a TLS/SSL certificate must be added to the listener. This allows the Application Gateway to decrypt incoming traffic and encrypt response traffic to the client.
- `google-https-lb` §Architecture
  > For HTTPS load balancing, the target HTTPS proxy uses SSL
  > certificates to prove its identity to clients.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > A reverse proxy can be configured to decrypt all incoming requests and encrypt all outgoing responses
- `paloalto-proxy-server` §Reverse proxy
  > Reverse proxies are typically used for load balancing, TLS termination, traffic steering, and web application protection.
- Note: Microsoft, Google and Cloudflare each state it.

### units[0].learn.facts[8] ("fact-inside") — ✅

"Behind a reverse proxy": "plain HTTP to port 80, or sealed again: the site chooses".

- `microsoft-app-gateway-tls` §TLS termination
  > Application Gateway supports TLS termination at the gateway, after which traffic typically flows unencrypted to the backend servers.
- `microsoft-app-gateway-tls` §End-to-end TLS encryption
  > Application Gateway then initiates a new TLS connection to the backend server and re-encrypts data using the backend server's public key certificate before transmitting the request to the backend.
- `google-https-lb` §Protocol to the backends
  > HTTP, which uses HTTP/1.1 and no TLS
- `google-https-lb` §Protocol to the backends
  > HTTPS, which uses HTTP/1.1 and TLS
- `rfc-9110` §4.2.1
  > If the port subcomponent is empty or not given, TCP port 80 (the reserved port for WWW services) is the default.
- Note: RFC 9110 §4.2.1 defines the http scheme and its default port 80. Servers behind a proxy may listen on other ports; port 80 is the default.

### units[0].learn.facts[9] ("fact-cache") — ✅

"Copies": "only when the response lets it be kept: one marked no-store or private isn’t kept for others".

- `rfc-9111` §3
  > A cache MUST NOT store a response to a request unless:
- `rfc-9111` §5.2.2.5
  > The no-store response directive indicates that a cache MUST NOT store
  > any part of either the immediate request or the response
- `rfc-9111` §5.2.2.7
  > The unqualified private response directive indicates that a shared
  > cache MUST NOT store the response
- `google-cdn-overview` §Serve content from a cache
  > Your origin server uses HTTP headers to indicate which
  > responses are cached.
- Note: RFC 9111 is the defining standard for HTTP caching and is not obsoleted.

### units[0].learn.facts[10] ("fact-nat") — ✅

"Your home router": "swaps your laptop’s private address for your home’s public one, the address seen outside".

- `rfc-3022` §2.2
  > nodes on the private network could be allowed
  > simultaneous access to the external network, using the single
  > registered IP address with the aid of NAPT.
- `rfc-4787` §3
  > The effect is that the NAPT
  > establishes a NAT session to translate the (private IP address,
  > private port number) tuple to a (public IP address, public port
  > number) tuple
- Note: two independent RFCs. The ordinary home IPv4 case; IPv6 and carrier-grade NAT left out. RFC 4787's updates (RFC 6888, RFC 7857) do not change this.

### units[0].learn.facts[11] ("fact-setup") — ✅

"A forward proxy is used by": "devices set up with its address".

- `rfc-9110` §3.7
  > A "proxy" is a message-forwarding agent that is chosen by the client,
  > usually via local configuration rules
- `microsoft-windows-proxy` §Summary
  > When you’re connected to the internet and using a proxy server while browsing the web, that traffic goes through the proxy server instead of coming directly from your Windows PC.
- `microsoft-windows-proxy` §To set up a proxy server connection manually
  > In the Proxy IP address and Port boxes, enter the proxy server name or IP address and port (optional) in the respective boxes.
- `google-swp-overview` §Deployment modes
  > you must explicitly configure your workload environments and clients to
  > point directly to the proxy server.
- `paloalto-proxy-server` §Explicit proxy
  > An explicit proxy requires the client device or application to be configured with the proxy's address.
- Note: RFC 9110 §3.7 defines the proxy as chosen by the client's configuration. Leaves out transparent (interception) proxies, which RFC 9110 treats as a different kind and the lesson teaches in deep-transparent.

### units[0].learn.facts[12] ("fact-osi") — ✅

"OSI layer": "7 when it reads web requests; some work at 4".

- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers
- `google-lb-overview` §Proxy Network Load Balancers
  > Traffic is terminated at the load balancing layer
  > and then forwarded to the closest available backend by using TCP.
- `cloudflare-network-layers` §Network Layers
  > 7 Application layer
- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer
- `cloudflare-gateway-proxy` §Proxy
  > Gateway will accept the connection and establish a new, separate connection to the origin server.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- `microsoft-app-gateway-how` §Modifications to the request
  > Application gateway inserts six additional headers to all requests before it forwards the requests to the backend.
- Note: as for units[0].osi: Google and Microsoft for 7 (a proxy that reads HTTP); Google's Layer 4 reverse proxies and Cloudflare's layer table (Gateway and Load Balancing in the layer 4 row) for 4.

### units[0].learn.facts[13] ("fact-request") — ✅

"An HTTP page request": "GET asks for a page, and GET / for the page at the site’s bare address; the answer 200 OK sends it back".

- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- `rfc-9110` §15.3.1
  > The 200 (OK) status code indicates that the request has succeeded.
- `rfc-9112` §3.2.1
  > If the target URI's path component is
  > empty, the client MUST send "/" as the path within the origin-form of
  > request-target.
- Note: RFC 9110 defines GET (§9.3.1) and 200 OK (§15.3.1, whose table gives a GET's 200 content as the target resource); RFC 9112 §3.2.1 defines the "/" for an empty path. "A page" is the everyday word for a representation.

### units[0].learn.facts[14] ("fact-padlock") — ✅

"The padlock": "your browser shows it when the page came over HTTPS from a site with a valid certificate".

- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > The website you’re visiting has a valid certificate issued by a trusted authority.
- `cloudflare-mixed-content` §Mixed content errors
  > Normally, if your website loads all resources securely over HTTPS, visitors observe a lock icon in the address bar of their browser.
- `cloudflare-mixed-content` §Mixed content errors
  > This indicates your site has a working SSL certificate and all resources loaded by the site are loaded over HTTPS.
- Note: Microsoft (Edge's secure-connection icon for a valid certificate) and Cloudflare (lock icon for HTTPS with a working certificate) confirm. Leaves out mixed content, which removes the lock, and the different icons browsers use (Cloudflare notes each browser warns in its own way).

### units[0].practice[0].options[0] (question "who-sees") — ✅

Right answer: "The site sees the proxy’s address. The proxy sees the site’s name, but can’t read your request." Feedback: "Right. The proxy opens its own connection, so the site sees the proxy. It learns the site’s name from your CONNECT, but your request is sealed by HTTPS."

- `rfc-9110` §9.3.6
  > CONNECT uses a special form of request target, unique to this method,
  > consisting of only the host and port number of the tunnel
  > destination, separated by a colon.
- `rfc-7239` §1
  > However, these proxies make the requests appear as if
  > they originated from the proxy's IP address
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's, effectively masking the original IP address.
- `rfc-9846` §1
  > Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: RFC 9110 §9.3.6 defines CONNECT; RFC 9846 §1 defines TLS confidentiality. Correct as the answer for an ordinary (non-inspecting) forward proxy.

### units[0].practice[0].options[1] (question "who-sees") — ✅

Wrong answer: "The proxy encrypts your request, so no one can tell which site you visit." Feedback: "Not quite. A proxy doesn’t encrypt: the seal is HTTPS’s. And the proxy itself sees which site you asked for."

- `paloalto-proxy-server` §What does a proxy server do?
  > Proxies are used for privacy, access control, and performance optimization—but do not encrypt traffic by default.
- `paloalto-proxy-server` §What are the limitations of proxy servers?
  > Basic proxies don't encrypt traffic, exposing data on public or untrusted networks.
- `rfc-9110` §9.3.6
  > consisting of only the host and port number of the tunnel
  > destination
- `rfc-9846` §1
  > Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: rightly marked wrong. The prompt sets the case: a forward proxy carrying HTTPS through a tunnel, where the proxy adds no encryption and the seal is HTTPS's; read in that case the feedback is true. Unlike fact-not-sealed, it is not offered as a rule for every proxy.

### units[0].practice[0].options[2] (question "who-sees") — ✅

Wrong answer: "The site still sees your home’s address." Feedback: "Not quite. The site’s connection comes from the proxy, so it sees the proxy’s address. Yours only reaches it if a proxy writes it in a header, and a tunnel can’t."

- `rfc-7239` §1
  > However, these proxies make the requests appear as if
  > they originated from the proxy's IP address
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's, effectively masking the original IP address.
- `rfc-7239` §4
  > Information
  > passed in this header field can be, for example, the source IP
  > address of the request
- `rfc-9110` §3.7
  > A "tunnel" acts as a blind relay between two connections without
  > changing the messages.
- `cloudflare-http-headers` §X-Forwarded-For
  > X-Forwarded-For maintains proxy server and original visitor IP addresses.
- Note: RFC 7239 §4 defines the Forwarded header; RFC 9110 §3.7 defines the tunnel, which does not change messages, so it cannot add one. Rightly marked wrong.

### units[0].practice[1].options[0] (question "reverse") — ✅

Right answer: "The site. It takes readers’ requests and passes each to a server behind it." Feedback: "Right. A reverse proxy works for the site. It can also end HTTPS, spread requests over several servers, and answer from copies the site allows."

- `rfc-9110` §3.7
  > A "gateway" (a.k.a. "reverse proxy") is an intermediary that acts as
  > an origin server for the outbound connection but translates received
  > requests and forwards them inbound to another server or servers.
- `microsoft-what-is-proxy` §Reverse proxy
  > The reverse proxy receives incoming requests and forwards them to one of several back-end servers.
- `paloalto-proxy-server` §Reverse proxy
  > A reverse proxy acts on behalf of a server or service.
- `cloudflare-how-works` §Cloudflare as a reverse proxy
  > A reverse proxy can also cache content, resulting in faster performance.
- `paloalto-proxy-server` §Reverse proxy
  > Reverse proxies are typically used for load balancing, TLS termination, traffic steering, and web application protection.
- `rfc-9111` §3
  > A cache MUST NOT store a response to a request unless:
- Note: RFC 9110 §3.7 defines the reverse proxy; RFC 9111 §3 defines when a cache may store. Rightly the answer.

### units[0].practice[1].options[1] (question "reverse") — ✅

Wrong answer: "The readers. It hides their addresses from the site." Feedback: "Not quite. It works for the site, and it can pass each reader’s address on to the server in a header such as X-Forwarded-For."

- `rfc-7239` §4
  > This applies
  > to forwarding proxies, as well as reverse proxies.
- `microsoft-app-gateway-how` §Modifications to the request
  > These headers are x-forwarded-for, x-forwarded-port, x-forwarded-proto, x-original-host, x-original-url, and x-appgw-trace-id.
- `cloudflare-http-headers` §X-Forwarded-For
  > X-Forwarded-For maintains proxy server and original visitor IP addresses.
- `google-https-lb` §X-Forwarded-For header
  > The load balancer appends two IP addresses to the
  > X-Forwarded-For header
- `microsoft-what-is-proxy` §Reverse proxy
  > A reverse proxy sits in front of the server.
- Note: RFC 7239 §4 defines the Forwarded header for reverse proxies too; Microsoft, Cloudflare and Google each add X-Forwarded-For. Rightly marked wrong.

## Traced, example, analogy and unbacked parts

All ✅. Each traced item was read against the Learn parts its Traces line names and says nothing beyond them. The addresses in the Watch (192.168.1.100, 10.0.0.2 and 10.0.0.20 from RFC 1918; 198.51.100.7, 198.51.100.23 and 203.0.113.30 from RFC 5737) and the client ports in the logs are example values that illustrate those Learn facts, not new claims.

- title (unbacked) — ✅
- units[0].name (unbacked) — ✅
- backing (the lesson's subtitle and summary) (traced) — ✅
- units[0].backing (the unit's full name and purpose) (traced) — ✅
- units[0].scene.backing (the scene) (traced) — ✅
- units[0].overview.hookBacking (the Overview hook) (traced) — ✅
- units[0].overview.backing (the Overview description) (analogy) — ✅: analogy: the post room sending letters on under the office’s own address and passing sealed envelopes unopened matches lead-1 and the tunnel; the inspecting proxy is left to the lesson’s Go deeper.
- units[0].overview.facts[0] (Overview fact "Does") (traced) — ✅
- units[0].overview.facts[1] (Overview fact "Forward proxy") (traced) — ✅
- units[0].overview.facts[2] (Overview fact "Reverse proxy") (traced) — ✅
- units[0].overview.facts[3] (Overview fact "The site sees") (traced) — ✅
- units[0].overview.facts[4] (Overview fact "OSI layer") (traced) — ✅
- units[0].steps[0] (step "straight") (traced) — ✅
- units[0].steps[0].facts[0] (step "straight", fact "Your laptop") (example) — ✅: example: 192.168.1.100 is an RFC 1918 private address.
- units[0].steps[0].facts[1] (step "straight", fact "The site sees") (traced) — ✅
- units[0].steps[0].facts[2] (step "straight", fact "Can read the request") (traced) — ✅
- units[0].steps[0].facts[3] (step "straight", fact "Going to") (traced) — ✅
- units[0].steps[0].events[0] (event "s1-get") (traced) — ✅
- units[0].steps[0].events[1] (event "s1-row") (traced) — ✅
- units[0].steps[0].events[2] (event "s1-page") (traced) — ✅
- units[0].steps[1] (step "set-to-use") (traced) — ✅
- units[0].steps[1].facts[0] (step "set-to-use", fact "The proxy") (example) — ✅: example: 203.0.113.30 is an RFC 5737 documentation address.
- units[0].steps[1].facts[1] (step "set-to-use", fact "Your browser asks") (traced) — ✅
- units[0].steps[1].facts[2] (step "set-to-use", fact "The proxy") (traced) — ✅
- units[0].steps[1].facts[3] (step "set-to-use", fact "The answer") (traced) — ✅
- units[0].steps[1].events[0] (event "s2-connect") (traced) — ✅
- units[0].steps[1].events[1] (event "s2-tcp") (traced) — ✅
- units[0].steps[1].events[2] (event "s2-ok") (traced) — ✅
- units[0].steps[2] (step "tunnel") (traced) — ✅
- units[0].steps[2].facts[0] (step "tunnel", fact "The site sees") (traced) — ✅
- units[0].steps[2].facts[1] (step "tunnel", fact "The proxy reads") (traced) — ✅
- units[0].steps[2].facts[2] (step "tunnel", fact "The proxy knows") (traced) — ✅
- units[0].steps[2].facts[3] (step "tunnel", fact "A proxy") (traced) — ✅: repeats fact-not-sealed inside the forward-proxy step, where it holds; the fault is in the Learn fact’s general form.
- units[0].steps[2].events[0] (event "s3-in") (traced) — ✅
- units[0].steps[2].events[1] (event "s3-out") (traced) — ✅
- units[0].steps[2].events[2] (event "s3-row") (traced) — ✅
- units[0].steps[2].events[3] (event "s3-back") (traced) — ✅
- units[0].steps[2].events[4] (event "s3-page") (traced) — ✅
- units[0].steps[3] (step "reverse-proxy") (traced) — ✅
- units[0].steps[3].facts[0] (step "reverse-proxy", fact "techconcepts.app’s address") (traced) — ✅
- units[0].steps[3].facts[1] (step "reverse-proxy", fact "Your sealed line") (traced) — ✅
- units[0].steps[3].facts[2] (step "reverse-proxy", fact "The web server") (traced) — ✅
- units[0].steps[3].events[0] (event "s4-get") (traced) — ✅
- units[0].steps[3].events[1] (event "s4-note") (traced) — ✅
- units[0].steps[4] (step "passed-on") (traced) — ✅
- units[0].steps[4].facts[0] (step "passed-on", fact "The server sees") (traced) — ✅
- units[0].steps[4].facts[1] (step "passed-on", fact "Your address") (traced) — ✅
- units[0].steps[4].facts[2] (step "passed-on", fact "Inside the site") (traced) — ✅
- units[0].steps[4].facts[3] (step "passed-on", fact "A reverse proxy can also") (traced) — ✅
- units[0].steps[4].events[0] (event "s5-get") (traced) — ✅
- units[0].steps[4].events[1] (event "s5-row") (traced) — ✅
- units[0].steps[4].events[2] (event "s5-ok") (traced) — ✅
- units[0].steps[4].events[3] (event "s5-page") (traced) — ✅
- units[0].learn.lead[2] ("lead-3") (analogy) — ✅: analogy, the same text as the Overview description; does not mislead.
- units[0].practice[0].prompt (question "who-sees") (unbacked) — ✅
- units[0].practice[1].prompt (question "reverse") (unbacked) — ✅

## Sources

All checked 2026-11-16.

- `rfc-3022`: RFC Editor info page lists no "Obsoleted by"; current.
- `rfc-4787`: not obsoleted; updated by RFC 6888 and RFC 7857, whose abstracts (read) concern carrier-grade NAT and NAT44 clarifications, not the claims here; current.
- `rfc-7239`: not obsoleted or updated; current.
- `rfc-9110`: not obsoleted or updated; current.
- `rfc-9111`: not obsoleted or updated; current.
- `rfc-9112`: not obsoleted; updated by RFC 9931 (security of protocol upgrades on HTTP/1.1), which does not affect §3.2.1 or §9.7; current.
- `rfc-9846`: TLS 1.3, July 2026, obsoletes RFC 8446; not obsoleted; current.
- `cloudflare-gateway-proxy`, `cloudflare-how-works`, `cloudflare-http-headers`, `cloudflare-mixed-content`, `cloudflare-network-layers`, `cloudflare-tls-decryption`: live Cloudflare documentation, last updated in 2026, describing current products; current.
- `google-cdn-overview`, `google-https-lb`, `google-lb-overview`, `google-swp-overview`, `google-swp-tls`: live Google Cloud documentation, last updated 2026-11-10 to 2026-11-12; current.
- `microsoft-app-gateway`, `microsoft-app-gateway-how`, `microsoft-app-gateway-tls`: live Microsoft Learn pages for Application Gateway v2, the current product; current.
- `microsoft-edge-secure`, `microsoft-windows-proxy`: live Microsoft Support pages for current Edge and Windows; current.
- `microsoft-what-is-proxy`: live Microsoft Learn concept page (Dev Proxy docs), last updated 2026-10-05; current.
- `paloalto-proxy-server`: live Palo Alto Networks Cyberpedia explainer, a vendor explainer page describing current practice; current.

## Limit overrides

None.
