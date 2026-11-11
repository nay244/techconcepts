```json fact-check
{
  "slug": "what-is-http",
  "hash": "b478864eb550b8870b0d872bf9b0cf0a3eff40735777960fb03ebfbf95f3d81f",
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
    "units[0].overview.facts[1] (Overview fact \"Port\")": "⚠️",
    "units[0].overview.facts[2] (Overview fact \"Rides on\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Shape\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"client-request\")": "⚠️",
    "units[0].steps[0].facts[0] (step \"client-request\", fact \"URL\")": "✅",
    "units[0].steps[0].facts[1] (step \"client-request\", fact \"Scheme\")": "⚠️",
    "units[0].steps[0].facts[2] (step \"client-request\", fact \"Host\")": "✅",
    "units[0].steps[0].facts[3] (step \"client-request\", fact \"Path\")": "⚠️",
    "units[0].steps[1] (step \"dns-resolution\")": "✅",
    "units[0].steps[1].facts[0] (step \"dns-resolution\", fact \"Asks\")": "✅",
    "units[0].steps[1].facts[1] (step \"dns-resolution\", fact \"Question\")": "✅",
    "units[0].steps[1].facts[2] (step \"dns-resolution\", fact \"Answer\")": "✅",
    "units[0].steps[1].facts[3] (step \"dns-resolution\", fact \"Takes\")": "✅",
    "units[0].steps[1].events[0] (event \"m1\")": "✅",
    "units[0].steps[1].events[1] (event \"m2\")": "✅",
    "units[0].steps[2] (step \"tcp-connection\")": "✅",
    "units[0].steps[2].facts[0] (step \"tcp-connection\", fact \"From\")": "✅",
    "units[0].steps[2].facts[1] (step \"tcp-connection\", fact \"To\")": "✅",
    "units[0].steps[2].facts[2] (step \"tcp-connection\", fact \"Messages\")": "✅",
    "units[0].steps[2].facts[3] (step \"tcp-connection\", fact \"Then\")": "✅",
    "units[0].steps[2].events[0] (event \"m3\")": "⚠️",
    "units[0].steps[2].events[1] (event \"m4\")": "⚠️",
    "units[0].steps[2].events[2] (event \"m5\")": "⚠️",
    "units[0].steps[3] (step \"http-exchange\")": "✅",
    "units[0].steps[3].facts[0] (step \"http-exchange\", fact \"Request line\")": "⚠️",
    "units[0].steps[3].facts[1] (step \"http-exchange\", fact \"Host\")": "✅",
    "units[0].steps[3].facts[2] (step \"http-exchange\", fact \"Status\")": "✅",
    "units[0].steps[3].facts[3] (step \"http-exchange\", fact \"Content-Type\")": "✅",
    "units[0].steps[3].events[0] (event \"m6\")": "⚠️",
    "units[0].steps[3].events[1] (event \"m7\")": "⚠️",
    "units[0].steps[3].events[2] (event \"files-1\")": "✅",
    "units[0].steps[4] (step \"render-page\")": "✅",
    "units[0].steps[4].facts[0] (step \"render-page\", fact \"Requests\")": "✅",
    "units[0].steps[4].facts[1] (step \"render-page\", fact \"Types\")": "✅",
    "units[0].steps[4].facts[2] (step \"render-page\", fact \"Same connection\")": "✅",
    "units[0].steps[4].facts[3] (step \"render-page\", fact \"Unchanged files\")": "✅",
    "units[0].steps[4].events[0] (event \"m8\")": "⚠️",
    "units[0].steps[4].events[1] (event \"m9\")": "⚠️",
    "units[0].steps[4].events[2] (event \"files-2\")": "⚠️",
    "units[0].steps[4].events[3] (event \"m10\")": "⚠️",
    "units[0].steps[4].events[4] (event \"m11\")": "⚠️",
    "units[0].steps[4].events[5] (event \"files-3\")": "⚠️",
    "units[0].steps[0].deep[0] (step \"client-request\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"dns-resolution\", Go deeper)": "⚠️",
    "units[0].steps[2].deep[0] (step \"tcp-connection\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"http-exchange\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"render-page\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "⚠️",
    "units[0].learn.terms[0] (\"term-client\")": "✅",
    "units[0].learn.terms[1] (\"term-url\")": "✅",
    "units[0].learn.terms[2] (\"term-ip\")": "✅",
    "units[0].learn.terms[3] (\"term-tcp\")": "✅",
    "units[0].learn.terms[4] (\"term-method\")": "✅",
    "units[0].learn.terms[5] (\"term-path\")": "✅",
    "units[0].learn.terms[6] (\"term-headers\")": "✅",
    "units[0].learn.terms[7] (\"term-status\")": "✅",
    "units[0].learn.terms[8] (\"term-html\")": "✅",
    "units[0].learn.terms[9] (\"term-rendering\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.why[2] (\"why-3\")": "✅",
    "units[0].learn.why[3] (\"why-4\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-port\")": "✅",
    "units[0].learn.facts[1] (\"fact-rides\")": "✅",
    "units[0].learn.facts[2] (\"fact-used\")": "✅",
    "units[0].learn.facts[3] (\"fact-url\")": "✅",
    "units[0].learn.facts[4] (\"fact-request\")": "⚠️",
    "units[0].learn.facts[5] (\"fact-response\")": "✅",
    "units[0].learn.facts[6] (\"fact-type\")": "✅",
    "units[0].learn.facts[7] (\"fact-methods\")": "✅",
    "units[0].learn.facts[8] (\"fact-status\")": "✅",
    "units[0].learn.facts[9] (\"fact-versions\")": "✅",
    "units[0].learn.facts[10] (\"fact-defined\")": "✅",
    "units[0].learn.facts[11] (\"fact-dns\")": "✅",
    "units[0].learn.facts[12] (\"fact-tcp\")": "✅",
    "units[0].learn.facts[13] (\"fact-files\")": "✅",
    "units[0].learn.facts[14] (\"fact-osi\")": "✅",
    "units[0].practice[0].options[0] (question \"status-404\")": "✅",
    "units[0].practice[0].options[1] (question \"status-404\")": "✅",
    "units[0].practice[0].options[2] (question \"status-404\")": "✅",
    "units[0].practice[1].options[0] (question \"more-files\")": "✅",
    "units[0].practice[1].options[1] (question \"more-files\")": "✅",
    "units[0].practice[1].options[2] (question \"more-files\")": "✅",
    "units[0].practice[0].prompt (question \"status-404\")": "✅",
    "units[0].practice[1].prompt (question \"more-files\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-media-types",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-app-gateway",
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
      "id": "rfc-3986",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-6265",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-6335",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9000",
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
      "id": "rfc-9113",
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
      "id": "rfc-9499",
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
    },
    {
      "id": "whatwg-url",
      "current": true,
      "checked": "2026-11-11"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 174,
    "digest": "2161f4b097e5ad150241d0886f9910679c48ea9bbb2ff4313d171a90bf2d4fdf",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-app-gateway": "fdcfdfc6070cea47a717d74a1efbf4af3588d90fe835b04d005bbd3fe196bdd7",
      "rfc-3986": "3102dae4b68cebe40337730312fcb612297b8928547267e8b3d1ee6002b2d683",
      "whatwg-url": "08cb42a9a8575dab006676378c846fdd8a72d06897c27929aa51eaf099656be4",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-9111": "aeb52adb3279d5f23dae34f68af11bd5cef0a0aff7ffcd014c9ca93c5302cf3e",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a",
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-6335": "a78d74017b69a480034b81a8951f05ea35841ae4769ab4fe9787ecc689fb783a",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937",
      "rfc-9114": "6b84555c88eeebcf5d2b2e1d9d7b58630abc97ab877b2cf62dee4cd635db34e4",
      "rfc-9113": "a00ef91b64e111a282e77ec66980f5242e77c0bb5e33e0927e3b6757080506de",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "whatwg-html": "2ddbf73daa336540be694147ac80ab34237268de9167d29ac99528e79df64213",
      "rfc-9499": "270b62df854911dddd246f6c081952106897983a5e02dfe8b3819d72843d9ab1",
      "rfc-6265": "dc4177094813e85a44a7897b892b76bc09160b3a03aea44f0f511f3a98f91933",
      "rfc-9000": "f88aae47f8b18e102024916e975e919201d8dde689cba79b01079eaedd402e22",
      "iana-media-types": "018b355e0d521c3a9b20a853ccb3d118100fbf9cb7a5fb46909f6edb7ce4c60d",
      "whatwg-fetch": "63b0a018753c330adf1e40417524eb70ea02d4d3e123bcb39b6770f23bad911b"
    }
  },
  "items": {
    "title": "67499fe6da59d1f10d5a1d86aae49e4dc8c4c1c02977449d86718f2ae77cd565",
    "units[0].name": "95303fe9cdbcafdfdacc2cac5c7ad942d0fb6fe3405ec785b1db48777c4293c2",
    "units[0].osi": "392d58dee0db6171e5f5d839d99c37d69da9c53b5782c8b4a4d4d583f3c8ead3",
    "backing (the lesson's subtitle and summary)": "0a9753b2c3f6730b554dbc9915c5f7f9ff6923d0154e964219fcef888375d5d6",
    "units[0].backing (the unit's full name and purpose)": "17e71bc121439f6f0645ab9ec9c82a9ee4417798d45ecd186f968f0bac3175f8",
    "units[0].scene.backing (the scene)": "b010ce44d9ac25b460a520d778181a05adc3cff4e8a27320e5ed10d71ee92d4c",
    "units[0].overview.hookBacking (the Overview hook)": "6d7bd018c71601cb516852d9896ae82b0dfc8431b66306b0b54e4b4664090125",
    "units[0].overview.backing (the Overview description)": "aa0a0b122e74a60a8ae336169edb441faaa47eebf5d409972774f3e3295b3324",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "4d33cafd39095c98a41a758e89833a67815f4e1e432bf7e754d872bed26585f8",
    "units[0].overview.facts[1] (Overview fact \"Port\")": "ebcbdd74b31854cb62ed52744cfde73efebcadc54af13f4c1bcfdcf0e5f5eb6e",
    "units[0].overview.facts[2] (Overview fact \"Rides on\")": "9032eb29d349e50dce5156042ceb37905bd6cfaa76090434dbe2d9547710a89e",
    "units[0].overview.facts[3] (Overview fact \"Shape\")": "3dd1e143689ab096bec6ff3a68e3ad5b6dfc0c23f1e7cd827da0012dfcc50556",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "33728f08a7c17d7e8aa226ec05570ccda2c731484659b99d2c5c6741af4efdf4",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "84524852a0ccd399f76ccbda8394100e77f0242a9391c9981005c2e3f5a98b8e",
    "units[0].steps[0] (step \"client-request\")": "5bda042881466ab0f6d675b804bd8e0218f3ba647c438ba0b88a7cc976004bb3",
    "units[0].steps[0].facts[0] (step \"client-request\", fact \"URL\")": "d0b3d817594b141ca0a5bf454ac248583e22e6fd0b06b504ae47d2b2978ad9b6",
    "units[0].steps[0].facts[1] (step \"client-request\", fact \"Scheme\")": "f9958fc4046054da5907d187167f2acd536ca521044b0261211f1d1f4801ae13",
    "units[0].steps[0].facts[2] (step \"client-request\", fact \"Host\")": "d02ec7cc791e8fb680e577e8e13b656b9f7061c72166775d74b633b07c346568",
    "units[0].steps[0].facts[3] (step \"client-request\", fact \"Path\")": "5fa6a7eb621aea6152f8f8ff84d6dc2c6f06d58ccb9e174d75e911f2f8f165b2",
    "units[0].steps[1] (step \"dns-resolution\")": "003f5414514a5a4f7b4a3e80c9ef97e773c3b4f716fead81b00fa860a2212db9",
    "units[0].steps[1].facts[0] (step \"dns-resolution\", fact \"Asks\")": "5d4ebc0953ab95bc3364e9b5660fbf8e92ea71351aee472068ddf6e1641547aa",
    "units[0].steps[1].facts[1] (step \"dns-resolution\", fact \"Question\")": "dd847fdf08ffc3f9f9f912d20e3b4da20970af545edd767e51d7f4988c368a90",
    "units[0].steps[1].facts[2] (step \"dns-resolution\", fact \"Answer\")": "58ef808c9123099de80fe0f9dace2c6a9bc76f2a8a3585f18f1c70aca7894231",
    "units[0].steps[1].facts[3] (step \"dns-resolution\", fact \"Takes\")": "228af08f8ba147e43012e97a90c7fa1df53f585e1617084c516434195214d549",
    "units[0].steps[1].events[0] (event \"m1\")": "b0279b2ff721ce8549cb53d849f0a6d47a49b5f2772e971c9244b5e3fd4f99b2",
    "units[0].steps[1].events[1] (event \"m2\")": "890e326ba0ccfcda6e512355651b6012e6b731eed3d722a52caeec6381ac01cf",
    "units[0].steps[2] (step \"tcp-connection\")": "0fb1408d45c95d97c27af74bbb41c7d418c9fa842f1786eb225eaddff847b275",
    "units[0].steps[2].facts[0] (step \"tcp-connection\", fact \"From\")": "59718adcc7df85cc8e7c09ea1bde3ab02f1e09b4cde15764bed893cd1ee254d1",
    "units[0].steps[2].facts[1] (step \"tcp-connection\", fact \"To\")": "f1d5f07c8dcb69b5c5da7b041774347aa0c6d523ac55250862e6a9c5f33c1413",
    "units[0].steps[2].facts[2] (step \"tcp-connection\", fact \"Messages\")": "76d9c2e2b76012e2d4c3f318dfbec9dfa34cc46caa54b9ee8b6bb18bd88654fd",
    "units[0].steps[2].facts[3] (step \"tcp-connection\", fact \"Then\")": "e63c59a1493d4fe5a18a186ebef78d63cf34821b8b0942560a0427101b859b95",
    "units[0].steps[2].events[0] (event \"m3\")": "47d53e84ce4b9d0c62e26bd3344545c8268297d583357a1cde7034fb4b19ebff",
    "units[0].steps[2].events[1] (event \"m4\")": "aa1f6c98bb5f3e818af29dfaf626f48fb161e405a81219b9d272b31efa951b2c",
    "units[0].steps[2].events[2] (event \"m5\")": "bf41b172fbf7b26f509ace90556f2012bbec874ad6bf5886171ac9b6090d2a70",
    "units[0].steps[3] (step \"http-exchange\")": "d18579b4d07b9b32086cf483e3570a84ede32b6cdbcc50b863b995cd88ea5a64",
    "units[0].steps[3].facts[0] (step \"http-exchange\", fact \"Request line\")": "b7fa7b070577bc38b210d0a3cda59361f2b0eef9f4a57162ae75bf3f63aef140",
    "units[0].steps[3].facts[1] (step \"http-exchange\", fact \"Host\")": "dbfb9207decaacfb9e666ee6f00c88cac9a84e91af8b4751adaf0d5323be933d",
    "units[0].steps[3].facts[2] (step \"http-exchange\", fact \"Status\")": "507533b38786c01610fdc80ddf097bb6166b08181b966869c2d63abe75f20271",
    "units[0].steps[3].facts[3] (step \"http-exchange\", fact \"Content-Type\")": "45a27b3798ae9edf2f52c66cb129affdcbb58f7db56bbb53fd28afee6d790f30",
    "units[0].steps[3].events[0] (event \"m6\")": "8c4010acc19ef4c119086d62a506be7bf7412efe23fa38f9c2bc2755d8c0a16b",
    "units[0].steps[3].events[1] (event \"m7\")": "62569268792350f43285bbf504123d4f4ba752734ff422b26408b3ab13918f42",
    "units[0].steps[3].events[2] (event \"files-1\")": "6d9d772175a4ebcd7670b8f0a67d9392ea0dd644eb14b4b8ec7bf5769eef5735",
    "units[0].steps[4] (step \"render-page\")": "e050267719b8e215962d4b24592a3f3401e3bc2916293e176fff234bbcb7cf20",
    "units[0].steps[4].facts[0] (step \"render-page\", fact \"Requests\")": "7587c164feead7c7f04a5730f9a358efb0b00fe1658ecbaf45da7cde0814ac64",
    "units[0].steps[4].facts[1] (step \"render-page\", fact \"Types\")": "10e99cadb52c1257c20b44782b163c7c050a9a18f312a091491de519ed8ee4c7",
    "units[0].steps[4].facts[2] (step \"render-page\", fact \"Same connection\")": "5548ee10b722f0eac169032c1080cb5c072b2a43da51f27ccc0a9d962b3beb2f",
    "units[0].steps[4].facts[3] (step \"render-page\", fact \"Unchanged files\")": "efd1a0efe1153a1e2f9110e887ac751ea9d39a7ba1fbfab35cb5a4bf7783d207",
    "units[0].steps[4].events[0] (event \"m8\")": "e92987e069fd96b131fccbc60018e4cf4d2bfb0de803eae9c973f27bf1a1d766",
    "units[0].steps[4].events[1] (event \"m9\")": "f2d55b6a3b0b5b17920ca3bc36971cbe8684961b377c7e686e253a0e6d633c0a",
    "units[0].steps[4].events[2] (event \"files-2\")": "0fefd3d5ba43a0f5b907db4784a42a83aee1a04334aa3c43590d7a091184381e",
    "units[0].steps[4].events[3] (event \"m10\")": "e870f8cccb092f6b350033437a9e6b29a0a069862a1e55b748ca3a1b66e3cf72",
    "units[0].steps[4].events[4] (event \"m11\")": "914386811cc963230731d185b1eec17f1f348a7e39f9fccdcb17f77afbb056b1",
    "units[0].steps[4].events[5] (event \"files-3\")": "527158b4da33be6cd01d27fa61e36df21344554a3a1483a2a54204d9097c0506",
    "units[0].steps[0].deep[0] (step \"client-request\", Go deeper)": "85180c36be3c5f579a615c7637cda036756ea59b99f25f9255ca381730b5a307",
    "units[0].steps[1].deep[0] (step \"dns-resolution\", Go deeper)": "d3af964af7ef4ca7e8a312e1e6ee993a87e0a4386dad54f72246bb48862a4c6d",
    "units[0].steps[2].deep[0] (step \"tcp-connection\", Go deeper)": "f92aed280d785e25d4e539725a94ffca1c765fad0927300548f0c0d4bef4b4a7",
    "units[0].steps[3].deep[0] (step \"http-exchange\", Go deeper)": "e5c4d726fca0b26e32251b970d27b10fe26da1973449e0b2429f9d893a0a91fe",
    "units[0].steps[4].deep[0] (step \"render-page\", Go deeper)": "1cdf2d80cf9649b07ff999d4bb37e2dd2a890fb831497086e196b0aa38d00017",
    "units[0].learn.lead[0] (\"lead-1\")": "db2872c8453d38cbd4dc53977225616d2e037d3425e3456073e998b5c7803804",
    "units[0].learn.lead[1] (\"lead-2\")": "1f0be84f62b3dfe01d7ccb2a2ebb7b6c528e21e22abd6415be46abaf7c981475",
    "units[0].learn.terms[0] (\"term-client\")": "fb74990370209048130460b5cf9d38563096cb89599d654fec571860f94e25b7",
    "units[0].learn.terms[1] (\"term-url\")": "59c04f50059c941146cfef5f39c89dd781a30be23fd498222454e3bbabfdda7e",
    "units[0].learn.terms[2] (\"term-ip\")": "4aeacd32147800e843a120e6ed96f0910726408dd36d3bea1a3d6cad0adaaec0",
    "units[0].learn.terms[3] (\"term-tcp\")": "a8863be09d24c5679a11f4c97289c998c2b40ef44eb22ec82a092504ec378010",
    "units[0].learn.terms[4] (\"term-method\")": "cb5c2eaf4887c06aa6ff00b06a7415a32e025c0b5dfcf1531252e6f1cea7ec9b",
    "units[0].learn.terms[5] (\"term-path\")": "d1d9298ff4a0ab140b742ea249844d0c1723e0570caee1ac12934242308e66d3",
    "units[0].learn.terms[6] (\"term-headers\")": "6d415147a974d5bf9a436f2c0b2d757850083f6dea612ab6d901151850f845f7",
    "units[0].learn.terms[7] (\"term-status\")": "1a1787eaaa847804fe2a688c1a09711b4859a913c74d5d16f2526cab20ad004c",
    "units[0].learn.terms[8] (\"term-html\")": "4ff8c3fd8d12af83eebe688f7707d4d6adf7d7ccb86db04f635840f96241ff60",
    "units[0].learn.terms[9] (\"term-rendering\")": "6bb4ec81c18e31fd39e59a87723a06db133b78f3a831704fb43a2b9ff096d267",
    "units[0].learn.pattern (\"pattern\")": "7f87b538b5da0d533c8f5cae0ace8659a8c2f9656534fbf20f1dd8c3061ba3d1",
    "units[0].learn.why[0] (\"why-1\")": "0a20ecfeff535b64d582743ec4abcc0788dcb5d3ee25a0cd3f2b9d12a2f76bfd",
    "units[0].learn.why[1] (\"why-2\")": "6ab3069b16af35eda9db9fe9bc79b32ce15095c0ae62d1e44331ffb764b96253",
    "units[0].learn.why[2] (\"why-3\")": "01e233654310c557fcfe840fc004f83dd12ad784093a4543d65b1f757cd4fd76",
    "units[0].learn.why[3] (\"why-4\")": "8601790f18d283a68df528b8c701005a5791e4916300465e65989334618b6e58",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "40b5989ef03141a70571da914c117aed980d2ff0874ea36a24c46539379214a0",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "7b908d59dbefabaeddf2ee5172b7112c3f564b7d571e71f21d1e7b903b7f31f3",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "48a189422554da79d9ca111dc44c675f55da9e014cc7e2969de8e841591066c7",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "16905d71639fd76ce67677c80d39a9eba03242b778debded1593be6c8e8d760c",
    "units[0].learn.facts[0] (\"fact-port\")": "ab93e388c8c0939ad80a1e7c2c8f49565ee03307202f7631fc08a3fdce8631e8",
    "units[0].learn.facts[1] (\"fact-rides\")": "243d1b7c92645fbdd0d800655820a7996eb45ab9d0fb5188c6e635259bb338da",
    "units[0].learn.facts[2] (\"fact-used\")": "5888f5113bd6344f5536576e3bd375593e9a6a70a6fedba75b983fdda7255896",
    "units[0].learn.facts[3] (\"fact-url\")": "7e2ca255e13b454b1f9a3df8b83e1e51b1a0e0723681859cf96c4481d4489ca4",
    "units[0].learn.facts[4] (\"fact-request\")": "53217bd7e3ea3bb7c8fa434f5dacb299658d7fbef4947d3166833725cec4d72c",
    "units[0].learn.facts[5] (\"fact-response\")": "9b30e1207a21c16d1c5830af460d9b102086a5b4369202f0b86fc682eb9b0458",
    "units[0].learn.facts[6] (\"fact-type\")": "2d2dfe57a1a714d99f0a0f06c4774ca7998b3ddacff6a06c23412ce3f763d4f3",
    "units[0].learn.facts[7] (\"fact-methods\")": "4052c8ff4d5800b95653daf4be6e9107d4deca543c38f0d700fcddce0753d69b",
    "units[0].learn.facts[8] (\"fact-status\")": "3aa6643c3213c23e30e3661ef06d1e1e67d95b10602d469bf9eac1a6b5e61bce",
    "units[0].learn.facts[9] (\"fact-versions\")": "9671da33c6ff2fa74b9553b820976fc6b00df4f274e65de045d025b6d5f27616",
    "units[0].learn.facts[10] (\"fact-defined\")": "a5e4bb0654326c22e1998cabcfe891ffab07b916f582731f9af5fb452f8509dc",
    "units[0].learn.facts[11] (\"fact-dns\")": "b0093d74ef44a5cd700570de5a15e253cf2edd514bf6b397c9ca0a509ee78840",
    "units[0].learn.facts[12] (\"fact-tcp\")": "40b1b35effc8c138ea7d951a1773de64859118bc6b14d319cf824bca67b83612",
    "units[0].learn.facts[13] (\"fact-files\")": "320fb9f006de93142809f0615877ad4ae67fbe0891fbcffbd37df4d6e919dec8",
    "units[0].learn.facts[14] (\"fact-osi\")": "87250c472f8f4e1092e05e74fcd5c8cc24b1be456a1aff74c9646f0905bcd633",
    "units[0].practice[0].options[0] (question \"status-404\")": "d0a2917ba5608d12c75c36555fb067b25e0bce6c92f7da6308bf511e0dd561fa",
    "units[0].practice[0].options[1] (question \"status-404\")": "be0b74babd0b867129d6dbbc72ceba18b193b4ddc3236458cc6bf11741714253",
    "units[0].practice[0].options[2] (question \"status-404\")": "cf8a62a5dae178ecd44acba1f5bad449a172afdad514fe5f053390d088496fc3",
    "units[0].practice[1].options[0] (question \"more-files\")": "b49a3c3b124349f6128b8eecf6e77df3b0bfa5b5c944ded201477077e9113651",
    "units[0].practice[1].options[1] (question \"more-files\")": "c84ea29079021021cd1f3129df9a8bd0eb05fc8ea89c1ee88aa429df80c19c27",
    "units[0].practice[1].options[2] (question \"more-files\")": "f079cc9284b3fcfb82f908452bf55d68849c0701f1a54da0ed874bd9d586fb45",
    "units[0].practice[0].prompt (question \"status-404\")": "b48563dd49fe8aa9dfca3c52e5c272341a982f39919f2083fb697f58796204b5",
    "units[0].practice[1].prompt (question \"more-files\")": "6abe17955c1b37d34324b2f192b467757a1cae3d1f08f31ef0848614467587d9"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-http

Checked 2026-11-11 by claude-opus-5-5, against the sources fetched from their publishers in this run.

Result: 83 ✅, 19 ⚠️, 0 ❌. The lesson does not pass.

## Claims

### units[0].osi — ✅

Layers: 7.

- `cloudflare-network-layers` §Network Layers
  > 7 Application layer HTTP, DNS
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway makes intelligent routing decisions based on HTTP request attributes like URL paths and host headers.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > This application layer routing gives you more control over how traffic flows to your applications.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- Note: No standard places HTTP in an OSI layer. Two vendors' pages, from different publishers, put it at layer 7: Cloudflare lists HTTP in its layer 7 row, and Microsoft calls routing on HTTP request attributes application-layer routing, at OSI layer 7. Both pages are live (Cloudflare updated Oct 12, 2026; Microsoft dated 2026-09-10) and describe current products.

### units[0].steps[0].deep[0] (step "client-request", Go deeper) — ✅

"A URL has parts: the scheme (http), the host (example.net), an optional port (80 is assumed for http, 443 for https), the path (/), and sometimes a query (?q=…) and a fragment (#top). Before going to the network, the browser can look in its cache first; a fresh saved copy can mean no request at all."

- `rfc-3986` §3
  > The generic URI syntax consists of a hierarchical sequence of
  > components referred to as the scheme, authority, path, query, and
  > fragment.
- Note: RFC 3986 defines the generic URI syntax and its components; it is an Internet Standard, not obsoleted.
- `whatwg-url` §4.1
  > A URL’s port is either null or a
  > 16-bit unsigned integer that identifies a networking port. It is initially null.
- `rfc-9110` §4.2.1
  > The origin server for an "http" URI is identified by the authority
  > component, which includes a host identifier ([URI], Section 3.2.2)
  > and optional port number ([URI], Section 3.2.3). If the port
  > subcomponent is empty or not given, TCP port 80 (the reserved port
  > for WWW services) is the default.
- Note: RFC 9110 §4.2.1 defines the http URI scheme and its default port.
- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: RFC 9110 §4.2.2 defines the https URI scheme and its default port.
- `whatwg-url` §4.2
  > The default port for a special scheme is listed in
  > the second column on the same row.
- `rfc-9110` §7.3.1
  > If the client has a cache [CACHING] and the request can be satisfied
  > by it, then the request is usually directed there first.
- `rfc-9111` §4.2
  > When a response is fresh, it can be used to satisfy subsequent
  > requests without contacting the origin server, thereby improving
  > efficiency.
- Note: RFC 9111 §4.2 defines freshness for HTTP caches. All three RFCs are current Internet Standards; the URL Standard is a current WHATWG Living Standard.

### units[0].steps[1].deep[0] (step "dns-resolution", Go deeper) — ⚠️

"This is a DNS query for the A record of example.net, sent over UDP to port 53. If the laptop looked the name up recently, its resolver can answer from its cache, with no message sent."

- `rfc-1034` §5.2.1
  > Given a character string, the caller wants
  > one or more 32 bit IP addresses. Under the DNS, it
  > translates into a request for type A RRs.
- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §4.2.1
  > Messages sent using UDP user server port 53 (decimal).
- `rfc-1034` §5.1
  > The resolver is located on the same machine as the program that requests
  > the resolver's services, but it may need to consult name servers on
  > other hosts.
- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and
  > name server load from most requests by answering them from its cache of
  > prior results.
- Note: RFC 1034 and RFC 1035 define DNS resolvers, the A type and DNS over UDP port 53. Both are Internet Standards, not obsoleted; their updates (RFC 7766 among them) relax UDP-first but keep UDP as the usual transport.
- Note: What is wrong: the lesson shows the "DNS resolver" as a separate machine (192.0.2.53) that the laptop sends its query to. If that resolver answers from its cache, the query and the answer still cross the network. No message is sent only when a cache on the laptop itself answers. RFC 1034 §5.1 puts the resolver on the asking machine, but the lesson puts it elsewhere, so "its resolver ... with no message sent" misleads. Say the laptop's own cache can answer with no message sent, or that the resolver can answer from its cache without asking other servers.

### units[0].steps[2].deep[0] (step "tcp-connection", Go deeper) — ✅

"The laptop uses a temporary port of its own (here 50310) and connects to port 80, the standard port for plain HTTP. The three messages are SYN, SYN-ACK and ACK. Once it’s open, many requests can share the connection; HTTP/1.1 keeps it open by default."

- `rfc-6335` §6
  > the Dynamic Ports, also known as the Private or Ephemeral Ports,
  > from 49152-65535 (never assigned)
- `rfc-6335` §8.1.2
  > Application software may simply use any
  > dynamic port that is available on the local host, without any sort
  > of assignment.
- Note: RFC 6335 (BCP 165, not obsoleted) defines the port number ranges; 50310 is in the Dynamic range.
- `rfc-9110` §4.2.1
  > If the port
  > subcomponent is empty or not given, TCP port 80 (the reserved port
  > for WWW services) is the default.
- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a
  > connection.
- `rfc-9293` §3.5.1
  > In an attempt to establish the connection, A's TCP
  > implementation will send a segment containing SYN.
- Note: RFC 9293 §3.5, Figure 6, shows the segments as SYN, then SYN,ACK, then ACK. RFC 9293 is the current TCP Internet Standard and defines the handshake.
- `rfc-9112` §9.3
  > HTTP/1.1 defaults to the use of "persistent connections", allowing
  > multiple requests and responses to be carried over a single
  > connection.
- Note: RFC 9112 defines HTTP/1.1 connection persistence. It is updated by RFC 9931 (protocol transitions), which does not touch persistence.

### units[0].steps[3].deep[0] (step "http-exchange", Go deeper) — ✅

"The request line is GET / HTTP/1.1, and in HTTP/1.1 the Host header (Host: example.net) is required, because one server can hold many sites. Other methods: … Status codes come in five families: …"

- `rfc-9112` §3
  > A request-line begins with a method token, followed by a single space
  > (SP), the request-target, and another single space (SP), and ends
  > with the protocol version.
- `rfc-9112` §3.2
  > A client MUST send a Host header field (Section 7.2 of [HTTP]) in all
  > HTTP/1.1 request messages.
- `rfc-9110` §7.2
  > The "Host" header field in a request provides the host and port
  > information from the target URI, enabling the origin server to
  > distinguish among resources while servicing requests for multiple
  > host names.
- `rfc-9110` §9.3.2
  > The HEAD method is identical to GET except that the server MUST NOT
  > send content in the response.
- `rfc-9110` §9.3.3
  > The POST method requests that the target resource process the
  > representation enclosed in the request according to the resource's
  > own specific semantics.
- `rfc-9110` §9.3.4
  > The PUT method requests that the state of the target resource be
  > created or replaced with the state defined by the representation
  > enclosed in the request message content.
- `rfc-9110` §9.3.5
  > The DELETE method requests that the origin server remove the
  > association between the target resource and its current
  > functionality.
- `rfc-9110` §15
  > The first digit of the status code defines the class of response.
  > The last two digits do not have any categorization role. There are
  > five values for the first digit:
- `rfc-9110` §15
  > 1xx (Informational): The request was received, continuing process
- `rfc-9110` §15
  > 4xx (Client Error): The request contains bad syntax or cannot be
  > fulfilled
- `rfc-9110` §15
  > 5xx (Server Error): The server failed to fulfill an apparently
  > valid request
- `rfc-9110` §15.4.2
  > The 301 (Moved Permanently) status code indicates that the target
  > resource has been assigned a new permanent URI
- `rfc-9110` §15.4.5
  > the server is
  > therefore redirecting the client to make use of that stored
  > representation as if it were the content of a 200 (OK) response.
- `rfc-9110` §15.5.4
  > The 403 (Forbidden) status code indicates that the server understood
  > the request but refuses to fulfill it.
- `rfc-9110` §15.5.5
  > The 404 (Not Found) status code indicates that the origin server did
  > not find a current representation for the target resource
- `rfc-9110` §15.6.1
  > The 500 (Internal Server Error) status code indicates that the server
  > encountered an unexpected condition that prevented it from fulfilling
  > the request.
- `rfc-9110` §15.6.4
  > The 503 (Service Unavailable) status code indicates that the server
  > is currently unable to handle the request due to a temporary overload
  > or scheduled maintenance
- Note: RFC 9112 defines the HTTP/1.1 request line and the Host requirement; RFC 9110 defines the methods and status codes. Both are current Internet Standards.

### units[0].steps[4].deep[0] (step "render-page", Go deeper) — ✅

"Browsers often fetch several files at once, over more than one connection. HTTP/2 and HTTP/3 let many requests share one connection at the same time. A file the browser already has can be checked instead of fetched: if it hasn’t changed, the server answers 304 Not Modified with no body."

- `rfc-9112` §9
  > Most clients maintain
  > multiple connections in parallel, including more than one connection
  > per server endpoint.
- `rfc-9114` §1.1
  > Because HTTP/1.1 does not include a multiplexing layer, multiple TCP
  > connections are often used to service requests in parallel.
- `rfc-9113` §1
  > Specifically, it
  > allows interleaving of messages on the same connection
- `rfc-9114` §6.1
  > So as to not unnecessarily limit
  > parallelism, at least 100 request streams SHOULD be permitted at a
  > time.
- `rfc-9111` §4.3
  > it can use the conditional
  > request mechanism (Section 13 of [HTTP]) in the forwarded request to
  > give the next inbound server an opportunity to choose a valid stored
  > response to use
- `rfc-9110` §13.1.3
  > Transfer of the selected representation's data is avoided if that
  > data has not changed.
- `rfc-9110` §15.4.5
  > A 304 response is terminated by the end of the header section; it
  > cannot contain content or trailers.
- Note: RFC 9113 defines HTTP/2, RFC 9111 defines cache validation and RFC 9110 defines 304. RFC 9113 and RFC 9114 are current Proposed Standards, not obsoleted.

### units[0].learn.lead[0] ("lead-1") — ✅

"In HTTP/1.1, getting a web page is a conversation in plain text."

- `rfc-9114` §1.1
  > HTTP/1.1 ([HTTP/1.1]) uses whitespace-delimited text fields to convey
  > HTTP messages. While these exchanges are human readable
- `rfc-9110` §1.2
  > HTTP/1.1 was designed to refine the protocol's features while
  > retaining compatibility with the existing text-based messaging
  > syntax
- Note: Two independent RFCs state it. Both current.

### units[0].learn.lead[1] ("lead-2") — ⚠️

"In HTTP, the browser asks for one thing, the server answers with a status and the file, and the browser asks for the next thing."

- `rfc-9110` §3.4
  > A server responds to a client's request by sending one or more
  > "response" messages, each including a status code (Section 15).
- `rfc-9110` §3.4
  > The response might also contain header fields for server information,
  > resource metadata, and representation metadata, content to be
  > interpreted in accordance with the status code
- `rfc-9112` §9.3
  > HTTP/1.1 defaults to the use of "persistent connections", allowing
  > multiple requests and responses to be carried over a single
  > connection.
- Note: RFC 9110 defines HTTP's request/response messages and RFC 9112 defines persistence; both current.
- Note: What is wrong: the sentence says that in all of HTTP the browser asks for one thing, gets it, and only then asks for the next. The sources do not state that order. RFC 9112 §9 says most clients keep several connections in parallel, HTTP/2 interleaves messages on one connection, and the lesson's own render-page Go deeper says browsers often fetch several files at once. Also, a response carries a status and *might* carry content: a 304 or a reply to HEAD carries no file. Scope it, for example "In HTTP/1.1, on one connection, …", or drop the strict order.

### units[0].learn.terms[0] ("term-client") — ✅

"Client: The side that asks: your browser"

- `rfc-9110` §3.3
  > An HTTP "client" is a program that establishes a connection to a
  > server for the purpose of sending one or more HTTP requests.
- `rfc-9110` §3.5
  > The most familiar form of user agent is the general-purpose Web
  > browser
- Note: RFC 9110 defines the client and user agent roles. Current Internet Standard.

### units[0].learn.terms[1] ("term-url") — ✅

"URL: The web address of a page or file"

- `rfc-3986` §1.1.3
  > The term "Uniform Resource Locator" (URL) refers to the subset of URIs
  > that, in addition to identifying a resource, provide a means of
  > locating the resource by describing its primary access mechanism
  > (e.g., its network "location").
- Note: RFC 3986 defines the term URL; Internet Standard, not obsoleted (updated by RFC 7320 and RFC 8820, which do not change this definition).

### units[0].learn.terms[2] ("term-ip") — ✅

"IP address: Where to send it: the server’s number"

- `rfc-791` §2.3
  > A name indicates what we seek. An address indicates where it is.
- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- `rfc-9110` §4.3.2
  > a client MAY attempt access by resolving the
  > host identifier to an IP address, establishing a TCP connection to
  > that address on the indicated port
- Note: RFC 791 defines the IPv4 address; Internet Standard, not obsoleted.

### units[0].learn.terms[3] ("term-tcp") — ✅

"TCP connection: The open line both sides agreed on"

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a
  > connection. This procedure normally is initiated by one TCP peer and
  > responded to by another TCP peer.
- `rfc-9293` §4
  > A logical communication path identified by a pair of sockets.
- Note: RFC 9293 defines the TCP connection and its establishment; current Internet Standard.

### units[0].learn.terms[4] ("term-method") — ✅

"Method (GET): The kind of asking, like “send me this”"

- `rfc-9110` §9.1
  > The request method token is the primary source of request semantics;
  > it indicates the purpose for which the client has made this request
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- Note: RFC 9110 defines request methods and GET.

### units[0].learn.terms[5] ("term-path") — ✅

"Path: Which page or file on the site"

- `rfc-3986` §3.3
  > The path component contains data, usually organized in hierarchical
  > form, that, along with data in the non-hierarchical query component
  > (Section 3.4), serves to identify a resource within the scope of the
  > URI's scheme and naming authority (if any).
- `rfc-9110` §4.2.1
  > The hierarchical path component and optional query component identify
  > the target resource within that origin server's namespace.
- Note: RFC 3986 defines the path component.

### units[0].learn.terms[6] ("term-headers") — ✅

"Headers: Notes on a request or a reply"

- `rfc-9110` §6.3
  > Each header field might modify or extend message
  > semantics, describe the sender, define the content, or provide
  > additional context.
- Note: RFC 9110 defines header fields.

### units[0].learn.terms[7] ("term-status") — ✅

"Status code: The number that says how it went"

- `rfc-9110` §15
  > The status code of a response is a three-digit integer code that
  > describes the result of the request and the semantics of the
  > response, including whether the request was successful
- Note: RFC 9110 defines status codes.

### units[0].learn.terms[8] ("term-html") — ✅

"HTML: The text that describes the page"

- `whatwg-html` §1.3
  > HTML is the World Wide Web's core markup language.
- `whatwg-html` §1.10
  > HTML documents consist of a tree of elements and text.
- Note: The WHATWG HTML Standard is the Living Standard that defines HTML (last updated 11 November 2026).

### units[0].learn.terms[9] ("term-rendering") — ✅

"Rendering: Drawing the page from its HTML and styles"

- `whatwg-html` §15.1
  > In the absence of style-layer rules to the contrary (e.g. author style sheets), user agents are
  > expected to render an element so that it conveys to the user the meaning that the
  > element represents, as described by this specification.
- `whatwg-html` §4.6.8.23
  > The specified resource is a CSS style sheet that describes how to present the
  > document.
- Note: The HTML Standard's Rendering section (§15) defines how user agents are expected to render HTML.

### units[0].learn.pattern ("pattern") — ✅

Names: Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render. Note: "Opening a page over plain HTTP goes through these five, though a saved copy, a remembered name or an open connection can skip a step. The HTTP exchange repeats for every file the page needs from the server."

- `rfc-9110` §4.3.2
  > When an "http" URI is used within a context that calls for access to
  > the indicated resource, a client MAY attempt access by resolving the
  > host identifier to an IP address, establishing a TCP connection to
  > that address on the indicated port, and sending over that connection
  > an HTTP request message containing a request target that matches the
  > client's target URI (Section 7.1).
- `rfc-9110` §7.3.1
  > If the client has a cache [CACHING] and the request can be satisfied
  > by it, then the request is usually directed there first.
- `rfc-9111` §4.2
  > When a response is fresh, it can be used to satisfy subsequent
  > requests without contacting the origin server
- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and
  > name server load from most requests by answering them from its cache of
  > prior results.
- `rfc-9112` §9.3
  > A client MAY send additional requests on a persistent connection
  > until it sends or receives a "close" connection option
- `whatwg-html` §15.1
  > user agents are
  > expected to render an element so that it conveys to the user the meaning that the
  > element represents
- `whatwg-html` §4.2.4
  > Each link created for a link element is handled separately. For
  > instance, if there are two link elements with rel="stylesheet",
  > they each count as a separate external resource
- `whatwg-html` §4.8.3
  > If the src attribute is present, it must contain a
  > valid non-empty URL potentially surrounded by spaces referencing a non-interactive,
  > optionally animated, image resource
- `rfc-9499` §6
  > A resolver performs queries for a name, type, and
  > class, and receives responses.
- `rfc-9110` §3.9
  > The following example illustrates a typical HTTP/1.1 message exchange
  > for a GET request
- Note: RFC 9110 §4.3.2 defines how a client reaches an http resource (resolve, connect, request); RFC 9111, RFC 1034 and RFC 9112 define the cache and connection reuse that let steps be skipped; the HTML Standard defines rendering.

### units[0].learn.why[0] ("why-1") — ✅

"HTTP gives every web server the same kind of interface, so a browser can open sites it has never seen."

- `rfc-9110` §1.1
  > HTTP hides the details of how a service is implemented by presenting
  > a uniform interface to clients that is independent of the types of
  > resources provided.
- `rfc-9110` §1.1
  > Likewise, servers do not need to be aware of
  > each client's purpose: a request can be considered in isolation
  > rather than being associated with a specific type of client
- Note: RFC 9110 defines HTTP's semantics, including its uniform interface.

### units[0].learn.why[1] ("why-2") — ✅

"Because HTTP/1.1 is plain text it’s easy to read,"

- `rfc-9114` §1.1
  > HTTP/1.1 ([HTTP/1.1]) uses whitespace-delimited text fields to convey
  > HTTP messages. While these exchanges are human readable
- `rfc-9110` §1.2
  > retaining compatibility with the existing text-based messaging
  > syntax
- Note: Two independent RFCs state it.

### units[0].learn.why[2] ("why-3") — ✅

"and that’s the catch: plain HTTP isn’t encrypted, so anyone on the way can read it too."

- `rfc-9110` §4.3.2
  > This is a very weak sense of authority because
  > it depends on both client-specific name resolution mechanisms and
  > communication that might not be secured from an on-path attacker.
- `rfc-9112` §11.4
  > HTTP relies on underlying transport protocols to provide message
  > confidentiality when that is desired.
- `rfc-9110` §4.2.2
  > all HTTP communication with that server has
  > confidentiality and integrity protection that is acceptable to both
  > client and server.
- Note: Two independent RFCs (9110 and 9112) say plain http traffic has no confidentiality of its own and can be exposed on its path.

### units[0].learn.why[3] ("why-4") — ✅

"HTTPS fixes that."

- `rfc-9110` §4.2.2
  > In this context, "secured" specifically means
  > that the server has been authenticated as acting on behalf of the
  > identified authority and all HTTP communication with that server has
  > confidentiality and integrity protection that is acceptable to both
  > client and server.
- Note: RFC 9110 §4.2.2 defines the https scheme.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

"HTTP doesn’t remember anything between requests; each one stands alone."

- `rfc-9110` §3.3
  > HTTP is defined as a stateless protocol, meaning that each request
  > message's semantics can be understood in isolation
- Note: RFC 9110 defines HTTP as stateless.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

"Sites remember you with cookies: names and values the server asks the browser to send back with later requests."

- `rfc-6265` §1
  > Using the Set-Cookie header field, an HTTP server can pass name/value
  > pairs and associated metadata (called cookies) to a user agent. When
  > the user agent makes subsequent requests to the server, the user
  > agent uses the metadata and other information to determine whether to
  > return the name/value pairs in the Cookie header.
- `rfc-6265` §3
  > To store state, the origin server includes a Set-Cookie header in an
  > HTTP response.
- Note: RFC 6265 defines cookies; Proposed Standard, the RFC Editor lists no obsoleting or updating RFC.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

"HTTP/1.1 is plain text, HTTP/2 sends the same meaning as binary frames, and HTTP/3 runs over QUIC, on UDP."

- `rfc-9114` §1.1
  > HTTP/1.1 ([HTTP/1.1]) uses whitespace-delimited text fields to convey
  > HTTP messages.
- `rfc-9110` §1.2
  > HTTP/3
  > ([HTTP/3]) provides greater independence for concurrent messages by
  > using QUIC as a secure multiplexed transport over UDP instead of TCP.
- `rfc-9113` §1
  > HTTP/2 addresses these issues by defining an optimized mapping of
  > HTTP's semantics to an underlying connection.
- `rfc-9113` §1
  > Finally, HTTP/2 also enables more efficient processing of messages
  > through use of binary message framing.
- `rfc-9114` §1
  > HTTP/3 supports the same semantics over a new transport
  > protocol: QUIC.
- `rfc-9000` §1
  > QUIC packets are carried in UDP datagrams [UDP] to better facilitate
  > deployment in existing systems and networks.
- Note: RFC 9113 defines HTTP/2 and RFC 9114 defines HTTP/3; RFC 9000 (QUIC) is a current Proposed Standard.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

"Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes."

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
- `whatwg-html` §3.1.6
  > A Document document allows adding render-blocking elements
  > if document's content type is
  > "text/html" and the body element of document is null.
- `whatwg-html` §3.1.6
  > The current high resolution time given document's relevant
  > global object has not exceeded an implementation-defined timeout value.
- `whatwg-html` §8.1.7.3
  > Filter non-renderable documents: Remove from docs any
  > Document object doc for which any of the following are true:
- `whatwg-html` §8.1.7.3
  > doc is render-blocked;
- Note: The HTML Standard defines the stylesheet link type, the render-blocking mechanism and the event loop's rendering step. After processing the stylesheet, on success or on error, the algorithm unblocks rendering on the element.

### units[0].learn.facts[0] ("fact-port") — ✅

"Port: 80 (HTTPS: 443)"

- `rfc-9110` §4.2.1
  > If the port
  > subcomponent is empty or not given, TCP port 80 (the reserved port
  > for WWW services) is the default.
- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: RFC 9110 defines the http and https schemes and their default ports.

### units[0].learn.facts[1] ("fact-rides") — ✅

"Rides on: TCP, which rides on IP (HTTP/3: QUIC, on UDP)"

- `rfc-9112` §9
  > For example, the "http" URI scheme
  > (Section 4.2.1 of [HTTP]) indicates a default connection of TCP over
  > IP, with a default TCP port of 80
- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP
  > segments, with each TCP segment sent as an Internet Protocol (IP)
  > datagram.
- `rfc-9114` §1
  > HTTP/3 supports the same semantics over a new transport
  > protocol: QUIC.
- `rfc-9000` §1
  > QUIC packets are carried in UDP datagrams [UDP]
- Note: RFC 9112 defines HTTP/1.1 connection management; RFC 9114 defines HTTP/3.

### units[0].learn.facts[2] ("fact-used") — ✅

"Used for: web pages, and apps that talk to servers"

- `rfc-9110` §1.2
  > HTTP has been the primary information transfer protocol for the World
  > Wide Web since its introduction in 1990.
- `rfc-9110` §3.5
  > Other common user agents include spiders (web-traversing robots),
  > command-line tools, billboard screens, household appliances, scales,
  > light bulbs, firmware update scripts, mobile apps, and communication
  > devices in a multitude of shapes and sizes.
- `rfc-9114` §1
  > HTTP semantics ([HTTP]) are used for a broad range of services on the
  > Internet.
- Note: Two independent RFCs (9110 and 9114) confirm it.

### units[0].learn.facts[3] ("fact-url") — ✅

"URL parts: scheme, host, port, path, query, fragment"

- `rfc-3986` §3
  > The generic URI syntax consists of a hierarchical sequence of
  > components referred to as the scheme, authority, path, query, and
  > fragment.
- `rfc-3986` §3.2
  > The generic syntax provides a common
  > means for distinguishing an authority based on a registered name or
  > server address, along with optional port and user information.
- `whatwg-url` §4.1
  > A URL’s host is null or a
  > host. It is initially null.
- Note: RFC 3986 and the URL Standard both define URL components; the URL Standard is the current WHATWG Living Standard (last updated 19 October 2026).

### units[0].learn.facts[4] ("fact-request") — ⚠️

"A request: a request line (method, target, version), then headers; sent straight to the server, the target is the path, such as /; HTTP/1.1 requires a Host header, which names the site"

- `rfc-9112` §3
  > A request-line begins with a method token, followed by a single space
  > (SP), the request-target, and another single space (SP), and ends
  > with the protocol version.
- `rfc-9112` §3.2.1
  > When making a request directly to an origin server, other than a
  > CONNECT or server-wide OPTIONS request (as detailed below), a client
  > MUST send only the absolute path and query components of the target
  > URI as the request-target.
- `rfc-9112` §3.2
  > A client MUST send a Host header field (Section 7.2 of [HTTP]) in all
  > HTTP/1.1 request messages.
- `rfc-9112` §2.1
  > An HTTP/1.1 message consists of a start-line followed by a CRLF and a
  > sequence of octets in a format similar to the Internet Message Format
  > [RFC5322]: zero or more header field lines (collectively referred to
  > as the "headers" or the "header section")
- `rfc-9110` §7.2
  > The "Host" header field in a request provides the host and port
  > information from the target URI
- Note: RFC 9112 defines the HTTP/1.1 request line, request target and Host requirement; RFC 9110 defines Host.
- Note: What is wrong: a dropped condition. Sent straight to the server, the target is the path *and the query*, if the URL has one (RFC 9112 §3.2.1, whose own example is /where?q=now). "The target is the path" is wrong for any URL with a query. Say "the target is the path (and any query), such as /".

### units[0].learn.facts[5] ("fact-response") — ✅

"A response: a status line (version, status code and, optionally, a reason such as OK), then headers, then any content"

- `rfc-9112` §4
  > The first line of a response message is the status-line, consisting
  > of the protocol version, a space (SP), the status code, and another
  > space and ending with an OPTIONAL textual phrase describing the
  > status code.
- `rfc-9112` §2.1
  > zero or more header field lines (collectively referred to
  > as the "headers" or the "header section"), an empty line indicating
  > the end of the header section, and an optional message body.
- `rfc-9110` §6.4
  > HTTP messages often transfer a complete or partial representation as
  > the message "content": a stream of octets sent after the header
  > section, as delineated by the message framing.
- Note: RFC 9112 defines the HTTP/1.1 status line and message format; RFC 9110 defines content.

### units[0].learn.facts[6] ("fact-type") — ✅

"Content-Type: names a file’s media type, such as text/html, text/css or image/png"

- `rfc-9110` §8.3
  > The "Content-Type" header field indicates the media type of the
  > associated representation
- `iana-media-types` §Media Types, text
  > html text/html
- `iana-media-types` §Media Types, text
  > css text/css
- `iana-media-types` §Media Types, image
  > png PNG image/png
- Note: RFC 9110 defines Content-Type; the IANA Media Types registry (live, updated 2026-11-10) is the authoritative list of registered media types and lists all three.

### units[0].learn.facts[7] ("fact-methods") — ✅

"Some methods: GET, POST, PUT, DELETE, HEAD"

- `rfc-9110` §9.1
  > This specification defines a number of standardized methods that are
  > commonly used in HTTP, as outlined by the following table.
- `rfc-9110` §9.1
  > All general-purpose servers MUST support the methods GET and HEAD.
- Note: RFC 9110 defines HTTP methods; its Table 4 lists GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS and TRACE.

### units[0].learn.facts[8] ("fact-status") — ✅

"Status families: 1xx received, still going; 2xx success (200 OK); 3xx more to do (304 Not Modified: use your saved copy); 4xx request problem; 5xx server problem"

- `rfc-9110` §15
  > 2xx (Successful): The request was successfully received,
  > understood, and accepted
- `rfc-9110` §15
  > 3xx (Redirection): Further action needs to be taken in order to
  > complete the request
- `rfc-9110` §15.3.1
  > The 200 (OK) status code indicates that the request has succeeded.
- `rfc-9110` §15.4.5
  > the request indicates that the client, which made the request
  > conditional, already has a valid representation
- Note: RFC 9110 §15 defines the five classes and the codes; the 1xx, 4xx and 5xx wording is quoted under the http-exchange Go deeper above.

### units[0].learn.facts[9] ("fact-versions") — ✅

"Major versions: HTTP/1.1, HTTP/2, HTTP/3"

- `rfc-9110` §1.2
  > All three major versions of HTTP rely on the semantics defined by
  > this document.
- Note: RFC 9110 defines HTTP semantics and names the three major versions.

### units[0].learn.facts[10] ("fact-defined") — ✅

"Defined in: RFC 9110 (the Hypertext Transfer Protocol’s shared meaning); RFC 9112, RFC 9113 and RFC 9114 (the versions)"

- `rfc-9110` §Abstract
  > This document describes the overall architecture of HTTP,
  > establishes common terminology, and defines aspects of the protocol
  > that are shared by all versions.
- `rfc-9110` §1.2
  > This revision of HTTP separates the definition of semantics (this
  > document) and caching ([CACHING]) from the current HTTP/1.1 messaging
  > syntax ([HTTP/1.1])
- `rfc-9112` §1
  > This document specifies how HTTP semantics are conveyed using the
  > HTTP/1.1 message syntax, framing, and connection management
  > mechanisms.
- `rfc-9113` §Abstract
  > This specification describes an optimized expression of the semantics
  > of the Hypertext Transfer Protocol (HTTP), referred to as HTTP
  > version 2 (HTTP/2).
- `rfc-9114` §1.2
  > This document defines HTTP/3: a mapping of HTTP semantics over the
  > QUIC transport protocol
- Note: Each RFC defines the part named. RFC 9111 (caching) is also part of HTTP's definition; the fact names it nowhere, but it does not say its list is complete, so nothing in it is false.

### units[0].learn.facts[11] ("fact-dns") — ✅

"DNS resolution: a resolver turns a name into an IP address, which can take from milliseconds to seconds; UDP to port 53 is the recommended way to send a query, such as one for an A record"

- `rfc-1034` §5.2.1
  > 1. Host name to host address translation.
- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method
  > for standard queries in the Internet.
- `rfc-1035` §4.2.1
  > Messages sent using UDP user server port 53 (decimal).
- `rfc-9499` §6
  > A resolver performs queries for a name, type, and
  > class, and receives responses.
- `rfc-9110` §4.3.2
  > If host is a registered name, the registered name is an
  > indirect identifier for use with a name resolution service, such as
  > DNS, to find an address for an appropriate origin server.
- `rfc-1034` §5.1
  > the
  > amount of time that a resolver will take to complete can vary quite a
  > bit, from milliseconds to several seconds.
- Note: RFC 1034 and RFC 1035 define resolvers, the A type and DNS transport. RFC 7766, which updates RFC 1035, relaxes the UDP-first rule but notes that most DNS transactions use UDP; the RFC 1035 recommendation is not withdrawn.

### units[0].learn.facts[12] ("fact-tcp") — ✅

"TCP connection: opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default"

- `rfc-9293` §3.5
  > In line 3, TCP Peer B sends a SYN and acknowledges the
  > SYN it received from TCP Peer A.
- `rfc-9293` §3.5
  > At line 4, TCP Peer A responds with an empty segment containing an
  > ACK for TCP Peer B's SYN
- `rfc-9293` §3.5.1
  > In an attempt to establish the connection, A's TCP
  > implementation will send a segment containing SYN.
- `rfc-9112` §9.3
  > HTTP/1.1 defaults to the use of "persistent connections", allowing
  > multiple requests and responses to be carried over a single
  > connection.
- Note: RFC 9293 defines the three-way handshake; RFC 9112 defines HTTP/1.1 persistence.

### units[0].learn.facts[13] ("fact-files") — ✅

"Other files: a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn’t saved is fetched with its own GET"

- `whatwg-html` §4.6.8.23
  > The specified resource is a CSS style sheet that describes how to present the
  > document.
- `whatwg-html` §4.8.3
  > If the src attribute is present, it must contain a
  > valid non-empty URL potentially surrounded by spaces referencing a non-interactive,
  > optionally animated, image resource
- `whatwg-fetch` §2.2.5
  > A request has an associated
  > method (a
  > method). Unless stated otherwise it is
  > `GET`.
- `whatwg-fetch` §2.2.5
  > A request has an associated URL
  > (a URL).
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- `rfc-9111` §4.2
  > When a response is fresh, it can be used to satisfy subsequent
  > requests without contacting the origin server
- Note: The Fetch Standard (current WHATWG Living Standard) defines the browser's requests; RFC 9110 defines GET; RFC 9111 defines freshness.

### units[0].learn.facts[14] ("fact-osi") — ✅

"OSI layer: 7, application"

- `cloudflare-network-layers` §Network Layers
  > 7 Application layer HTTP, DNS
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway makes intelligent routing decisions based on HTTP request attributes like URL paths and host headers.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- Note: Two vendors from different publishers place HTTP at layer 7; both pages are live and current.

### units[0].practice[0].options[0] (question "status-404") — ✅

Text "The server found nothing at that path." (right). Feedback "Right. 404 means the server answered, but found nothing at that path, or won’t say whether anything is there."

- `rfc-9110` §15.5.5
  > The 404 (Not Found) status code indicates that the origin server did
  > not find a current representation for the target resource or is not
  > willing to disclose that one exists.
- Note: RFC 9110 defines 404; the feedback keeps both of its conditions.

### units[0].practice[0].options[1] (question "status-404") — ✅

Text "The server is too busy to answer." (wrong). Feedback "Not quite. A busy server may answer 503, a 5xx code. 404 means nothing was found at that path."

- `rfc-9110` §15.6.4
  > The 503 (Service Unavailable) status code indicates that the server
  > is currently unable to handle the request due to a temporary overload
  > or scheduled maintenance
- `rfc-9110` §15.5.5
  > The 404 (Not Found) status code indicates that the origin server did
  > not find a current representation for the target resource
- Note: RFC 9110 defines both codes; "may" matches the RFC's note that an overloaded server need not use 503.

### units[0].practice[0].options[2] (question "status-404") — ✅

Text "The page came back fine." (wrong). Feedback "Not quite. That’s 200 OK. 404 means nothing was found at that path."

- `rfc-9110` §15.3.1
  > The 200 (OK) status code indicates that the request has succeeded.
- `rfc-9110` §15.5.5
  > The 404 (Not Found) status code indicates that the origin server did
  > not find a current representation for the target resource
- Note: RFC 9110 defines both codes.

### units[0].practice[1].options[0] (question "more-files") — ✅

Text "They arrive inside the HTML." (wrong). Feedback "Not quite. Here the HTML only names them, so the browser asks for each one."

- `whatwg-html` §4.2.4
  > The link element allows authors to link their document to other resources.
- `whatwg-html` §4.2.4
  > ...then a compliant UA that supported only CSS style sheets would fetch the B and C files
- `whatwg-html` §4.8.3
  > If the src attribute is present, it must contain a
  > valid non-empty URL potentially surrounded by spaces referencing a non-interactive,
  > optionally animated, image resource
- `whatwg-fetch` §2.2.5
  > A request has an associated URL
  > (a URL).
- Note: Confirmed by two standards, the HTML Standard and the Fetch Standard, both current WHATWG Living Standards. "Here" correctly scopes the claim to this page.

### units[0].practice[1].options[1] (question "more-files") — ✅

Text "It sends a separate request for each file." (right). Feedback "Yes. One GET per file; here they share the open connection."

- `whatwg-fetch` §2.2.5
  > A request has an associated
  > method (a
  > method). Unless stated otherwise it is
  > `GET`.
- `whatwg-html` §4.6.8.23
  > The appropriate times to fetch and
  > process this type of link are:
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- `rfc-9112` §9.3
  > HTTP/1.1 defaults to the use of "persistent connections", allowing
  > multiple requests and responses to be carried over a single
  > connection.
- Note: RFC 9110 defines GET and RFC 9112 defines persistence.

### units[0].practice[1].options[2] (question "more-files") — ✅

Text "It asks the DNS resolver for them." (wrong). Feedback "Not quite. DNS turns the name into an address; it doesn’t hold the files. They come from the web server, one request each."

- `rfc-1034` §5.2.1
  > Given a character string, the caller wants
  > one or more 32 bit IP addresses.
- `rfc-9110` §4.3.2
  > a client MAY attempt access by resolving the
  > host identifier to an IP address, establishing a TCP connection to
  > that address on the indicated port, and sending over that connection
  > an HTTP request message containing a request target that matches the
  > client's target URI (Section 7.1).
- Note: RFC 1034 defines the resolver's name-to-address function; RFC 9110 shows the resource comes from the origin server reached at that address.

## Traced, example and analogy parts, and unbacked items

- `title`: ✅
- `units[0].name`: ✅
- `backing (the lesson's subtitle and summary)`: ✅
- `units[0].backing (the unit's full name and purpose)`: ✅
- `units[0].scene.backing (the scene)`: ✅ (laptop 192.168.1.100 is RFC 1918; 192.0.2.53 and 203.0.113.80 are RFC 5737; the parties and table columns go no further than the traced parts)
- `units[0].overview.hookBacking (the Overview hook)`: ✅
- `units[0].overview.backing (the Overview description)`: ✅ (the counter order is one item at a time, then the next; it does not suggest one request for several files)
- `units[0].overview.facts[0] (Overview fact "Used for")`: ✅
- `units[0].overview.facts[1] (Overview fact "Port")`: ⚠️ "TCP 80" names TCP, which its traced part (fact-port: "80 (HTTPS: 443)") does not state. fact-rides states it; add it to Traces or drop "TCP".
- `units[0].overview.facts[2] (Overview fact "Rides on")`: ✅
- `units[0].overview.facts[3] (Overview fact "Shape")`: ✅
- `units[0].overview.facts[4] (Overview fact "OSI layer")`: ✅
- `units[0].overview.facts[5] (Overview fact "This example")`: ✅
- `units[0].steps[0] (step "client-request")`: ⚠️ The narrative adds two things its traced parts do not state: (1) that the path is "/" *because you named none*: fact-request gives "/" only as an example of a target, and no traced part says an empty path becomes "/"; (2) "the server’s number", which only term-ip states, and term-ip is not in its Traces.
- `units[0].steps[0].facts[0] (step "client-request", fact "URL")`: ✅
- `units[0].steps[0].facts[1] (step "client-request", fact "Scheme")`: ⚠️ "TCP port 80" names TCP, which neither fact-port nor fact-url states. Add fact-rides or drop "TCP".
- `units[0].steps[0].facts[2] (step "client-request", fact "Host")`: ✅
- `units[0].steps[0].facts[3] (step "client-request", fact "Path")`: ⚠️ "/, since the URL names no page" adds a condition (an empty path is sent as "/") that neither term-path nor fact-request states.
- `units[0].steps[1] (step "dns-resolution")`: ✅
- `units[0].steps[1].facts[0] (step "dns-resolution", fact "Asks")`: ✅
- `units[0].steps[1].facts[1] (step "dns-resolution", fact "Question")`: ✅
- `units[0].steps[1].facts[2] (step "dns-resolution", fact "Answer")`: ✅
- `units[0].steps[1].facts[3] (step "dns-resolution", fact "Takes")`: ✅ (20 ms is this scene's timing, inside fact-dns's stated range)
- `units[0].steps[1].events[0] (event "m1")`: ✅
- `units[0].steps[1].events[1] (event "m2")`: ✅
- `units[0].steps[2] (step "tcp-connection")`: ✅
- `units[0].steps[2].facts[0] (step "tcp-connection", fact "From")`: ✅
- `units[0].steps[2].facts[1] (step "tcp-connection", fact "To")`: ✅
- `units[0].steps[2].facts[2] (step "tcp-connection", fact "Messages")`: ✅
- `units[0].steps[2].facts[3] (step "tcp-connection", fact "Then")`: ✅
- `units[0].steps[2].events[0] (event "m3")`: ⚠️ The log puts the server at port 80 (203.0.113.80:80), and neither of its traced parts (fact-tcp, term-tcp) states port 80. Add fact-port.
- `units[0].steps[2].events[1] (event "m4")`: ⚠️ Same: source port 80 is not stated by fact-tcp or term-tcp. Add fact-port.
- `units[0].steps[2].events[2] (event "m5")`: ⚠️ Same: destination port 80 is not stated by fact-tcp or term-tcp. Add fact-port.
- `units[0].steps[3] (step "http-exchange")`: ✅
- `units[0].steps[3].facts[0] (step "http-exchange", fact "Request line")`: ⚠️ "GET / HTTP/1.1" names the method GET, which its only traced part (fact-request) does not name. Add term-method.
- `units[0].steps[3].facts[1] (step "http-exchange", fact "Host")`: ✅
- `units[0].steps[3].facts[2] (step "http-exchange", fact "Status")`: ✅
- `units[0].steps[3].facts[3] (step "http-exchange", fact "Content-Type")`: ✅
- `units[0].steps[3].events[0] (event "m6")`: ⚠️ It says the message goes over TCP to port 80, and none of its traced parts (fact-request, term-method, term-path, lead-1) states TCP or port 80. Add fact-rides and fact-port.
- `units[0].steps[3].events[1] (event "m7")`: ⚠️ Over TCP, from port 80: neither is stated by its traced parts. Add fact-rides and fact-port.
- `units[0].steps[3].events[2] (event "files-1")`: ✅
- `units[0].steps[4] (step "render-page")`: ✅
- `units[0].steps[4].facts[0] (step "render-page", fact "Requests")`: ✅
- `units[0].steps[4].facts[1] (step "render-page", fact "Types")`: ✅
- `units[0].steps[4].facts[2] (step "render-page", fact "Same connection")`: ✅
- `units[0].steps[4].facts[3] (step "render-page", fact "Unchanged files")`: ✅
- `units[0].steps[4].events[0] (event "m8")`: ⚠️ Over TCP, to port 80: neither is stated by fact-files, fact-request or term-method. Add fact-rides and fact-port.
- `units[0].steps[4].events[1] (event "m9")`: ⚠️ Over TCP, port 80, "HTTP/1.1" and "200 OK": none is stated by its traced parts (fact-files, term-status, fact-type, term-rendering, deep-4). Add fact-rides, fact-port, fact-status and fact-request (or lead-1).
- `units[0].steps[4].events[2] (event "files-2")`: ⚠️ "200 OK" is not stated by its traced parts; term-status gives no code. Add fact-status.
- `units[0].steps[4].events[3] (event "m10")`: ⚠️ Over TCP, to port 80: neither is stated by fact-files, fact-request or term-method. Add fact-rides and fact-port.
- `units[0].steps[4].events[4] (event "m11")`: ⚠️ Over TCP, port 80, "HTTP/1.1" and "200 OK": none is stated by its traced parts (fact-files, term-status, fact-type, term-rendering). Add fact-rides, fact-port, fact-status and fact-request (or lead-1).
- `units[0].steps[4].events[5] (event "files-3")`: ⚠️ "200 OK" is not stated by its traced parts. Add fact-status.
- `units[0].practice[0].prompt (question "status-404")`: ✅
- `units[0].practice[1].prompt (question "more-files")`: ✅

## Sources

All checked 2026-11-11.

- `cloudflare-network-layers`: live on developers.cloudflare.com, last updated Oct 12, 2026; vendor documentation of current products. Current.
- `iana-media-types`: live IANA registry (XML form fetched), updated 2026-11-10. Current.
- `microsoft-app-gateway`: live on learn.microsoft.com, dated 2026-09-10; describes the current v2 product. Current.
- `rfc-1034`: Internet Standard; RFC Editor lists no obsoleting RFC (19 updating RFCs, none of which changes the cited resolver text). Current.
- `rfc-1035`: Internet Standard; not obsoleted; updates read where relevant (RFC 7766 on transport). Current.
- `rfc-3986`: Internet Standard; not obsoleted (updated by RFC 7320 and RFC 8820, on URI design, not syntax). Current.
- `rfc-6265`: Proposed Standard; not obsoleted or updated. Current.
- `rfc-6335`: Best Current Practice; not obsoleted or updated. Current.
- `rfc-791`: Internet Standard; not obsoleted (updated by RFC 1349, RFC 2474 and RFC 6864, none on addresses). Current.
- `rfc-9000`: Proposed Standard; not obsoleted or updated. Current.
- `rfc-9110`: Internet Standard; not obsoleted or updated. Current.
- `rfc-9111`: Internet Standard; not obsoleted or updated. Current.
- `rfc-9112`: Internet Standard; not obsoleted; updated by RFC 9931 (security of optimistic protocol transitions), which does not change any cited section. Current.
- `rfc-9113`: Proposed Standard; not obsoleted or updated. Current.
- `rfc-9114`: Proposed Standard; not obsoleted or updated. Current.
- `rfc-9293`: Internet Standard; not obsoleted or updated. Current.
- `rfc-9499`: Best Current Practice; not obsoleted or updated. Current.
- `whatwg-fetch`: WHATWG Living Standard, last updated 19 October 2026. Current.
- `whatwg-html`: WHATWG Living Standard, last updated 11 November 2026. Current.
- `whatwg-url`: WHATWG Living Standard, last updated 19 October 2026. Current.

## Limit overrides

None.
