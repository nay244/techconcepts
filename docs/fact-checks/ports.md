```json fact-check
{
  "slug": "ports",
  "hash": "db1a5e07b5f87988b96ae032bc0cd39969fa6429fe9b4b5dcc82abab4d59729a",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].osi": "✅",
    "backing (the lesson's subtitle and summary)": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].scene.backing (the scene)": "✅",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].overview.backing (the Overview description)": "⚠️",
    "units[0].overview.facts[0] (Overview fact \"Port numbers\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Common ports\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Nothing listening\")": "⚠️",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"port-80\")": "✅",
    "units[0].steps[0].facts[0] (step \"port-80\", fact \"Laptop’s port\")": "✅",
    "units[0].steps[0].facts[1] (step \"port-80\", fact \"Server’s port\")": "✅",
    "units[0].steps[0].facts[2] (step \"port-80\", fact \"The answer goes to\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-syn\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-match\")": "✅",
    "units[0].steps[0].events[2] (event \"s1-synack\")": "✅",
    "units[0].steps[1] (step \"port-443\")": "✅",
    "units[0].steps[1].facts[0] (step \"port-443\", fact \"New connection\")": "✅",
    "units[0].steps[1].facts[1] (step \"port-443\", fact \"Two connections\")": "✅",
    "units[0].steps[1].facts[2] (step \"port-443\", fact \"Port 443\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-syn\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-match\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-synack\")": "✅",
    "units[0].steps[2] (step \"port-22\")": "✅",
    "units[0].steps[2].facts[0] (step \"port-22\", fact \"Laptop’s port\")": "✅",
    "units[0].steps[2].facts[1] (step \"port-22\", fact \"Server’s port\")": "✅",
    "units[0].steps[2].facts[2] (step \"port-22\", fact \"Not the web server\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-syn\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-match\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-synack\")": "✅",
    "units[0].steps[3] (step \"port-3389\")": "✅",
    "units[0].steps[3].facts[0] (step \"port-3389\", fact \"Server’s port\")": "✅",
    "units[0].steps[3].facts[1] (step \"port-3389\", fact \"Listening on 3389\")": "✅",
    "units[0].steps[3].facts[2] (step \"port-3389\", fact \"The answer\")": "✅",
    "units[0].steps[3].facts[3] (step \"port-3389\", fact \"Your app reports\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-syn\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-nomatch\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-rst\")": "✅",
    "units[0].steps[4] (step \"open-port\")": "✅",
    "units[0].steps[4].facts[0] (step \"open-port\", fact \"Remote Desktop\")": "✅",
    "units[0].steps[4].facts[1] (step \"open-port\", fact \"Port 3389\")": "✅",
    "units[0].steps[4].facts[2] (step \"open-port\", fact \"The answer\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-add\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-syn\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-match\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-synack\")": "✅",
    "units[0].steps[0].deep[0] (step \"port-80\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"port-443\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"port-22\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"port-3389\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"open-port\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-port\")": "✅",
    "units[0].learn.terms[1] (\"term-listen\")": "✅",
    "units[0].learn.terms[2] (\"term-well-known\")": "✅",
    "units[0].learn.terms[3] (\"term-temporary\")": "✅",
    "units[0].learn.terms[4] (\"term-connection\")": "✅",
    "units[0].learn.terms[5] (\"term-open\")": "✅",
    "units[0].learn.terms[6] (\"term-closed\")": "✅",
    "units[0].learn.terms[7] (\"term-reset\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-firewall\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-udp\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-nat\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-defined\")": "✅",
    "units[0].learn.facts[1] (\"fact-osi\")": "✅",
    "units[0].learn.facts[2] (\"fact-numbers\")": "✅",
    "units[0].learn.facts[3] (\"fact-two-ports\")": "✅",
    "units[0].learn.facts[4] (\"fact-common\")": "✅",
    "units[0].learn.facts[5] (\"fact-ranges\")": "✅",
    "units[0].learn.facts[6] (\"fact-temporary\")": "✅",
    "units[0].learn.facts[7] (\"fact-handshake\")": "✅",
    "units[0].learn.facts[8] (\"fact-closed\")": "✅",
    "units[0].learn.facts[9] (\"fact-see\")": "✅",
    "units[0].practice[0].options[0] (question \"closed-port\")": "✅",
    "units[0].practice[0].options[1] (question \"closed-port\")": "✅",
    "units[0].practice[0].options[2] (question \"closed-port\")": "✅",
    "units[0].practice[1].options[0] (question \"reply-port\")": "✅",
    "units[0].practice[1].options[1] (question \"reply-port\")": "✅",
    "units[0].practice[1].options[2] (question \"reply-port\")": "✅",
    "units[0].practice[2].options[0] (question \"which-port\")": "✅",
    "units[0].practice[2].options[1] (question \"which-port\")": "✅",
    "units[0].practice[2].options[2] (question \"which-port\")": "✅",
    "units[0].practice[2].options[3] (question \"which-port\")": "✅",
    "units[0].practice[0].prompt (question \"closed-port\")": "✅",
    "units[0].practice[1].prompt (question \"reply-port\")": "✅",
    "units[0].practice[2].prompt (question \"which-port\")": "✅"
  },
  "sources": [
    { "id": "cisco-fmc-access-rules", "current": true, "checked": "2026-11-14" },
    { "id": "cloudflare-network-ports", "current": true, "checked": "2026-11-14" },
    { "id": "cloudflare-rdp-browser", "current": true, "checked": "2026-11-14" },
    { "id": "iana-ports", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-dynamic-ports", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-netstat", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-rdp-enable", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-rdp-port", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-windows-firewall", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-winsock-errors", "current": true, "checked": "2026-11-14" },
    { "id": "nist-sp800-41r1", "current": true, "checked": "2026-11-14" },
    { "id": "openbsd-man-connect", "current": true, "checked": "2026-11-14" },
    { "id": "openbsd-man-netstat", "current": true, "checked": "2026-11-14" },
    { "id": "paloalto-layer-3-vs-7", "current": true, "checked": "2026-11-14" },
    { "id": "paloalto-port-scan", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-1122", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-3022", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-4253", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-4787", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-6056", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-6335", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-768", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-791", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-792", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-9293", "current": true, "checked": "2026-11-14" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-14",
    "count": 135,
    "digest": "e75fdb87864d6ecb86edf33e914a72fd9efea8233a2b75f54a8616773832584c",
    "files": {
      "paloalto-layer-3-vs-7": "09e513b2f7fe5646bd4ee9544eeee4538f2bfe62ac541a7f12d45be7e33d3f6e",
      "microsoft-windows-firewall": "0e3bf531a269721686aea4950df2f294e9c586ba6dfd88cca02e6acd31f80d4e",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-6335": "a78d74017b69a480034b81a8951f05ea35841ae4769ab4fe9787ecc689fb783a",
      "rfc-4253": "b471173305154f6c66facffcf7a4a25fc5c32765cb30542120be6c20a88f1ed3",
      "microsoft-rdp-port": "ee85db2a7f5c9e7121d7da3114d9c490bdf689a789250d19eba9400b9c59e5db",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "iana-ports": "effec1145145a05374af14992086722392fe258e6f4ac69011c250bfd927a15b",
      "microsoft-netstat": "8994391cc95554bb0051697a9fe8898b82f11297cb947ddbf5d7576a9699c406",
      "paloalto-port-scan": "901b65bba53b0126afd754382ba4c730166811415ba3af72e0ccbf07f9083b87",
      "rfc-6056": "2d899269f777944a49b7bcd5373a53284b4b6425a5e957bee90959e976ad26bb",
      "microsoft-dynamic-ports": "3f3228f74056c310d3584e7fbb769457eb09bafa889e5aaaa385769578d9f5c6",
      "microsoft-rdp-enable": "4727ed5f78f67582a6439175368a0fc730a8c5d1c76269c305e8e3962a5abc74",
      "microsoft-winsock-errors": "0df4971a3128d0a9402b9a0ced9f538aed2bfe631b41e2381f3b6c0373e0d355",
      "cisco-fmc-access-rules": "1309730824dfde3f5c9a521a0ae6dc6244f4635aae1fa3586dacfe2fd88223aa",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-792": "58714393ded142bacf188d7e8977eef98f4110c4c87ac94595f750df5664c2c6",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-768": "7dc8880e1ecef9c3f9da0db4b876a16e96bfa4f0953cc9d977d414f8f680c2f0",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "cloudflare-rdp-browser": "c155f7b3bfde171cba92e25f61274037b6e5c312bcd57b59f2f46c82c8e74cce",
      "cloudflare-network-ports": "c470b5a31591e43088ac35eef1d341783505845dd1d8201133838c21ffe1fb49",
      "openbsd-man-connect": "bf917a354c86387926139a390b6cf11e515d9198149553385e23f1ac8ef4a1ed",
      "openbsd-man-netstat": "6a811a412e4a5d7bb3177f83acef74badbd282d284e8a63c76492d9a2a4900e2"
    }
  },
  "items": {
    "title": "fa9b57da8e03eb66cf9a393de0af202248ba5c3f6a7f80e4d110542b64e855b6",
    "units[0].name": "4e519e05eb6a635d66af223ce3c50ec6b02d0d46f81f8a6f44d9b0bc14f7be86",
    "units[0].osi": "621a0715ff438e2dc0215e38f7adb6ecebe61c8e163d7dbbcf53e6943fa96534",
    "backing (the lesson's subtitle and summary)": "2b024b4e42cb9edf8f962d219fc4922d8ec232ce90db08a6dfd9d93571bd2843",
    "units[0].backing (the unit's full name and purpose)": "abb8a5c75983f24876aa8ec766bf74d0dde08a288628ed3a84b1747b7c10296e",
    "units[0].scene.backing (the scene)": "09bbc45be7aa921e9816d77c412434fe50f743e205bfc348798be2dd1ee4b22c",
    "units[0].overview.hookBacking (the Overview hook)": "69ca91df72ac4a238afe6e9e0655169e9ddbf11c6df00eb0a8cf279e37ee1b32",
    "units[0].overview.backing (the Overview description)": "d765358c0999749d8dea2c3b5d4b32e250bf3c7401206e1d8963fd451e42bd45",
    "units[0].overview.facts[0] (Overview fact \"Port numbers\")": "c408af9ca82e330a02acec956cb61c8a9e35095cd4cbe75b387f516d94aad437",
    "units[0].overview.facts[1] (Overview fact \"Common ports\")": "ec2d0f9dcd759a497a16b4ab6050d2a203213f95753a9d52e769c625fa6b208d",
    "units[0].overview.facts[2] (Overview fact \"Nothing listening\")": "345f6887be4052a3dbc8063d0b2a8b75d3822ae98b85d7d934def9b270bc0de3",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "3f861a6d8711476da134030d36d622d02514a6d182d7f8ea9887bb332775704e",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "207e4ff6801df41e1dee8bc938a5a132e2d08b73bc5ce3a99c94e019865605a4",
    "units[0].steps[0] (step \"port-80\")": "ece304590c68ba8890889d6cc95b1435d1dfef44fa7e7fcbe42d7a4577749105",
    "units[0].steps[0].facts[0] (step \"port-80\", fact \"Laptop’s port\")": "a4c84f108aff70c4bd7cee48020ab5ca72024e9807df717662b77cbcdbb3d737",
    "units[0].steps[0].facts[1] (step \"port-80\", fact \"Server’s port\")": "e987582457c676ea51dcd2efd3dd567e6e8638be4b4e09a28b834bcb80dfc91b",
    "units[0].steps[0].facts[2] (step \"port-80\", fact \"The answer goes to\")": "8115ca5aaf89a075fdb993e1131403946590bdfad78c8132b0faca5de20fc134",
    "units[0].steps[0].events[0] (event \"s1-syn\")": "7180f9f525b4690ebaeb463125fe04bcceb0b1456f7921ef915da484f38283f4",
    "units[0].steps[0].events[1] (event \"s1-match\")": "2f4c7fb1822534b78b6ad804c7d2ed76a05310ad7b8b7feda6dcd78632b986ce",
    "units[0].steps[0].events[2] (event \"s1-synack\")": "0ea81287a1226819c6c26ab1fc191100c7d2b65bbcb6fc87adb9b0b5eddd9e00",
    "units[0].steps[1] (step \"port-443\")": "ccee6c9f1a2794f8a1bfeb4a76b3392c3ce0a4ac13cbfba4f478f2b822fba05c",
    "units[0].steps[1].facts[0] (step \"port-443\", fact \"New connection\")": "a4ab325c488a33f5133b545175165932772902b6ce731880fc0c5f5bb0a8efc1",
    "units[0].steps[1].facts[1] (step \"port-443\", fact \"Two connections\")": "badc0a7dc052395bcddf348fe2c5d850e4bab8f6e88c684d29d008a21f59b1cd",
    "units[0].steps[1].facts[2] (step \"port-443\", fact \"Port 443\")": "a0cdbc02711915f22133d0c136d668473ee3ec5cd47c22f380a6475f0f4de42f",
    "units[0].steps[1].events[0] (event \"s2-syn\")": "247e65ebef20cd7e55ba1d450756a13aef55ddbea363aadbe481719ba2d45bae",
    "units[0].steps[1].events[1] (event \"s2-match\")": "48e75c7612e0565fa91664e4230d041052d5cbe26019ac9c05dd9610351592a8",
    "units[0].steps[1].events[2] (event \"s2-synack\")": "08537f5f526a1e19074df4cb07e3d4f20cb64f79c0978d8147a579a32a1e572a",
    "units[0].steps[2] (step \"port-22\")": "7ed20b8cde02aef614a23a1142d31a5c4b09b24d88381705ed7ec29a6179c038",
    "units[0].steps[2].facts[0] (step \"port-22\", fact \"Laptop’s port\")": "e0114e25ddc5a02d16a9bdadd58956ceda1c803385526328ecdce2bf3a6c1447",
    "units[0].steps[2].facts[1] (step \"port-22\", fact \"Server’s port\")": "9f8608a7f3ab7609dd0c83b29f922747cfc8d3f64b4450ec629d43c8c3902ff0",
    "units[0].steps[2].facts[2] (step \"port-22\", fact \"Not the web server\")": "04653ae76d02887ff7722fc569865b272fe13a557e4d7ffc5e8f0cdd906611f1",
    "units[0].steps[2].events[0] (event \"s3-syn\")": "86cf794058b08984fcc0a447e62bf54d459e8072254cfac66a2f3e2fbae05881",
    "units[0].steps[2].events[1] (event \"s3-match\")": "5865cdb8159dc220cd35df3f2667348778183efc0276fe286f0e4ec297daaf0c",
    "units[0].steps[2].events[2] (event \"s3-synack\")": "1cd1d10e49bfdc2733c7c9b0c73afa305baa3d2523f306ba1d77b97acb163ce6",
    "units[0].steps[3] (step \"port-3389\")": "abdbc973b95b173640d4d9a50b0da3de49764ec799051e077047d088c983c29a",
    "units[0].steps[3].facts[0] (step \"port-3389\", fact \"Server’s port\")": "f5f2fb28e8279a4f5844748f9b16d175b7785b76cc595b282ad15f796660feb5",
    "units[0].steps[3].facts[1] (step \"port-3389\", fact \"Listening on 3389\")": "e268b6727aeb61ad619b20a7f765edf620d5dc4ae240cf2fefbf012e7b3c341e",
    "units[0].steps[3].facts[2] (step \"port-3389\", fact \"The answer\")": "c8ed8373cdaebd5398a4860669cb83ce3ae977d9089a3dd4166743d851b22990",
    "units[0].steps[3].facts[3] (step \"port-3389\", fact \"Your app reports\")": "5df8b468d130130238a792d55233ade79fedfae0fa5c5ba3afd129e26779949c",
    "units[0].steps[3].events[0] (event \"s4-syn\")": "7f2f31d41c7cc34756676c3fbba69609911794cd9bc15ff1b2884f01853f1a0e",
    "units[0].steps[3].events[1] (event \"s4-nomatch\")": "285c9a3554324ff264975a55137e44d1baff205fd92798ece30acf96b4bf996c",
    "units[0].steps[3].events[2] (event \"s4-rst\")": "bc2397329836ed53e3baeabde98f40d49c62bb7163a059931b6f29abf25819a9",
    "units[0].steps[4] (step \"open-port\")": "00d0206b39e996065c8841f31013cadd1ba0d7b645a0395d2e49f0f1e6816ed9",
    "units[0].steps[4].facts[0] (step \"open-port\", fact \"Remote Desktop\")": "754620b4eb74e02049f72501befb9fb92eaf14b7c7bcbfdb5bbe6397d4472d84",
    "units[0].steps[4].facts[1] (step \"open-port\", fact \"Port 3389\")": "3b853c02b49eecc8006d62c61b8f9bb0aa6f56a5f6520de7b2e1bc404e983072",
    "units[0].steps[4].facts[2] (step \"open-port\", fact \"The answer\")": "5a47cbdbafa11e9dbc0f691432627f601045c8ea80c3cfd1e9806612fd72ab02",
    "units[0].steps[4].events[0] (event \"s5-add\")": "7972a802c30e52d1931df0ef6e82d2abf6b42deddd285f8939e1c83403095252",
    "units[0].steps[4].events[1] (event \"s5-syn\")": "48ab594ce37fd7a1bf6ea5b37a7e6edc8228aabaf7940d2fb66ab43af8000b6f",
    "units[0].steps[4].events[2] (event \"s5-match\")": "8ec4fcac8fd3b5389a75818e918dc6e1bb07bf15771ebd8ed16f6f6d21af1a83",
    "units[0].steps[4].events[3] (event \"s5-synack\")": "aa0f2d1831a342afa80169760e53ca03802151e461794132e6ef58744b03721a",
    "units[0].steps[0].deep[0] (step \"port-80\", Go deeper)": "e7e2f68fc28908d328a163271505d9b5d37caf039aed0efdcb69ce7a3c77593a",
    "units[0].steps[1].deep[0] (step \"port-443\", Go deeper)": "b804ecd63ceb08b55bf4bc6b925d1ba7e6b2a0a24fec4144cc8ae359120b8c07",
    "units[0].steps[2].deep[0] (step \"port-22\", Go deeper)": "4f2c47034f7b18f3d133e6db9354a6ac2ea750a5fc75825e3809bc6974b35492",
    "units[0].steps[3].deep[0] (step \"port-3389\", Go deeper)": "aadd62ac337ab19ce59504805e3d9e047a12682db282c71d854136cb6e41335e",
    "units[0].steps[4].deep[0] (step \"open-port\", Go deeper)": "8db1b650ec1fa6c3803cea83abd013ef53aa587577c2db793152eee9bb154bf8",
    "units[0].learn.lead[0] (\"lead-1\")": "c08a33bef512c39b1fe38b6cd299adf9fe49b6c72b5456380c005b3a29e2569c",
    "units[0].learn.lead[1] (\"lead-2\")": "80ad36953ed5ad0767e812d578ea32d5c0114977f666e3da2088248b24f6a2d1",
    "units[0].learn.terms[0] (\"term-port\")": "92e9940add29cb32ce418163fa2d80502c278a0a22f455590da9f827f90e996a",
    "units[0].learn.terms[1] (\"term-listen\")": "a48f3062d44a22f9f93c33f54eb501be0fba211217763efb4e7e686a31b42f8c",
    "units[0].learn.terms[2] (\"term-well-known\")": "e9908a5d5a866dd2a87a4597329e5d32ec2f45322b12284c3aecce0e1e8fcbac",
    "units[0].learn.terms[3] (\"term-temporary\")": "c930edc93c5ad96491bd53142f78fa1b398bc89ef2732e401602b2a2c7327f85",
    "units[0].learn.terms[4] (\"term-connection\")": "b9d3f0dbca6a95c18246c46458308148e811ebfdebd5e9e0d7bec7502f88db05",
    "units[0].learn.terms[5] (\"term-open\")": "f3c55c727930ad0eb081698ecf1c6647f7da1a32fea73667ade1274cf28a13d0",
    "units[0].learn.terms[6] (\"term-closed\")": "2b08a57710b34e40a1519abee3cba883c25f9999abd51931f588a887fb20905f",
    "units[0].learn.terms[7] (\"term-reset\")": "ad85759ffc30d31d1871ce495977c9087ccdc364d301a16c34115a0ba828a71a",
    "units[0].learn.pattern (\"pattern\")": "023b20fe1200cce31d1827058d8d7e808ca9f6ccb55ed9ef978b9530ed0a5c63",
    "units[0].learn.why[0] (\"why-1\")": "15a22abb88ab3c1bbb39988c95a02a52f954fb578ec8987abcbb0931274aeeda",
    "units[0].learn.why[1] (\"why-2\")": "341dfa4fbd3ffc1eaa4829eaf8393d3b089ccea8030a9a061118f6c3d24f6656",
    "units[0].learn.deep[0] (\"deep-firewall\", Learn's Go deeper)": "a8778151d0b1bcf03da2e879fa5e56de3906ba744b06968ecd9b2cbf2d05ad73",
    "units[0].learn.deep[1] (\"deep-udp\", Learn's Go deeper)": "4a3097df28918abf30181fa121c44482c9a48cd444827023c54e374ab61bf0ed",
    "units[0].learn.deep[2] (\"deep-nat\", Learn's Go deeper)": "9062a7f79a66dd05a68c7808cdcab572369c3801869f9b93a292d090b51042db",
    "units[0].learn.facts[0] (\"fact-defined\")": "7ac852d249ed91c159841f88bf624470563a646ade7c18ebac0c91d552b695a8",
    "units[0].learn.facts[1] (\"fact-osi\")": "bbaea6c5506cc073736e2f20f65ed49bde6ab116a362e76d432519e5ee7d34f9",
    "units[0].learn.facts[2] (\"fact-numbers\")": "1463ced71b49efa8006a1234d0c42e0bedad2e9a102cde8276ed5876267e4a17",
    "units[0].learn.facts[3] (\"fact-two-ports\")": "50ce38a9a562889b410d493242be7005038fced16f86d576200bbc0143698b04",
    "units[0].learn.facts[4] (\"fact-common\")": "f30c56b74561c134a78f7e459edf558a0262a3223eb1ea0242b7b0c988662a1f",
    "units[0].learn.facts[5] (\"fact-ranges\")": "72fb3a63eb217e132ba88353c4423b2fcc931eaf198e7ce832f3e9ca2864b2b7",
    "units[0].learn.facts[6] (\"fact-temporary\")": "9a3d6a5e8ab553b94dd935d73c48661a34469347a2736f7407cefa0264cd7e70",
    "units[0].learn.facts[7] (\"fact-handshake\")": "41a1f56e8257078c08dc681e5d8366680181016212b2758827954504edb04a9b",
    "units[0].learn.facts[8] (\"fact-closed\")": "126000cdf6ace7cbc7cd64ee26dc0c86509b695c5d5edca66a67a065aa016dc2",
    "units[0].learn.facts[9] (\"fact-see\")": "071c70bc08de31c96b1af59e64e60450a1120f45a2bfafddb4383f3d68eb3d6d",
    "units[0].practice[0].options[0] (question \"closed-port\")": "2fec40056be41219c12da30d735645636ff80d180a14adf613392a6658f9dd2c",
    "units[0].practice[0].options[1] (question \"closed-port\")": "45fa7a2d97736dfabda6125c01d671ffc8e5d9adc49a0f4ed47a5415f5d73046",
    "units[0].practice[0].options[2] (question \"closed-port\")": "3e800b5e6cdcde671ed9dca33db7dd279ea0038b80ec1886a05305b6b0557bdb",
    "units[0].practice[1].options[0] (question \"reply-port\")": "d117e99ee7578b8a7d98ad2818ef8befbb49d494b4777da0c95466f7723f99a6",
    "units[0].practice[1].options[1] (question \"reply-port\")": "a5c69a7be89a7c8b8d9224e6dacc6f3fcac70f00abab379b6184a22ab0414a17",
    "units[0].practice[1].options[2] (question \"reply-port\")": "f3e52780e6e1e12df173fd355e4d4692c9881d51c8508821e44b1565edd1eed2",
    "units[0].practice[2].options[0] (question \"which-port\")": "e010826e148ca21e830f4a6f7c2139f2540fb997d6b9857858dce7b72d39bf04",
    "units[0].practice[2].options[1] (question \"which-port\")": "404a571f7fe0d3a803ca24390aa90d23d7a91fb82c212d375e75ddecae02348c",
    "units[0].practice[2].options[2] (question \"which-port\")": "8e193d96251e648a7a6d01c8739d4d68d8a79a70b6f62c8ff16bbd67b13e1b21",
    "units[0].practice[2].options[3] (question \"which-port\")": "9034c670e02c350a26f55c26e7441ffe0066d48d3849529b7a24639c9299ad05",
    "units[0].practice[0].prompt (question \"closed-port\")": "d51aff66eee526d75b22c70ccce9b343d1166e40241ee861ab50801e65b4f084",
    "units[0].practice[1].prompt (question \"reply-port\")": "628a8e471f900584d9faa869e9ab159810e010b9373a06adc7711b386f18a9bb",
    "units[0].practice[2].prompt (question \"which-port\")": "503762a69debe19d49759581fc4ca3afda4b85430fcf648ef37b88901fcc24b7"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: ports

Checked 2026-11-14 by claude-opus-5-5, from the claim sheet alone and the sources fetched in this run. 92 items pass and 2 are imprecise (⚠️): the Overview description and the Overview fact "Nothing listening" both drop the "TCP" that their Learn part states, so they tell a beginner that any message to a port with nothing listening gets a reset, which the lesson's own UDP paragraph contradicts.

## Claims

### units[0].osi — ✅

Layer 4.

- `paloalto-layer-3-vs-7` §What is the difference between Layer 7 and Layer 4 firewall?
  > Layer 7 firewalls analyze data within application payloads for deep content inspection, whereas layer 4 firewalls filter traffic based on transport layer information like TCP/UDP ports without inspecting packet content.
- `microsoft-windows-firewall` §Firewall rules
  > Protocol name or type. For transport layer protocols, TCP and UDP, you can specify ports or port ranges.
- Note: two vendors on different sites place TCP and UDP ports with the transport layer; Palo Alto ties that layer to layer 4. No defining standard places ports at an OSI layer, and the settled rule allows two vendor pages for a badge. The same Palo Alto page says layer 3 firewalls filter on addresses and ports at the network layer; that describes where a kind of firewall works, not where ports sit, so it does not contradict the badge.
- Note: both pages are live and describe current products.

### units[0].steps[0].deep[0] (step "port-80", Go deeper) — ✅

"A port is not a plug on the back of a computer. It is only a number in the message."

- `rfc-9293` §3.1
  > A TCP header follows the IP
  > headers, supplying information specific to TCP.
- `rfc-9293` §3.1
  > Destination Port:  16 bits
- `rfc-6335` §3
  > They have relied on the concept of "ports" as logical
  > entities for Internet communication.
- `rfc-6335` §3
  > Ports are
  > 16-bit numbers
- Note: RFC 9293 is the defining standard for TCP's header, including its source and destination port fields. RFC 6335 independently calls ports logical entities and 16-bit numbers.
- Note: "only a number" leaves out that a host keeps state (a listener, a connection) tied to that number; for a beginner the contrast with a physical socket is true.
- Note: RFC 9293 is an Internet Standard, not obsoleted or updated; RFC 6335 is a Best Current Practice, not obsoleted or updated.

### units[0].steps[1].deep[0] (step "port-443", Go deeper) — ✅

"One server port can carry many connections at once. Each is told apart by the other end’s address and port."

- `rfc-9293` §4
  > A logical communication path identified by a pair of sockets.
- `rfc-9293` §4
  > An address that specifically includes a port identifier, that
  > is, the concatenation of an Internet Address with a TCP port.
- `rfc-6335` §3
  > the combination of source and destination port
  > numbers together with the IP addresses of the communicating end
  > systems uniquely identifies a session of a given transport protocol.
- Note: RFC 9293 defines a TCP connection as a pair of sockets (address plus port at each end). With the server's socket the same, connections differ only by the other end's address and port, which is what the claim says; RFC 6335 states the same four-part identity.

### units[0].steps[2].deep[0] (step "port-22", Go deeper) — ✅

"SSH’s port, 22, is registered with IANA and officially assigned for SSH."

- `rfc-4253` §4.1
  > When used over TCP/IP, the server normally listens for connections on
  > port 22.  This port number has been registered with the IANA, and has
  > been officially assigned for SSH.
- Note: RFC 4253 is the defining standard for the SSH transport layer protocol, including its use over TCP and its port. It is not obsoleted; its updates (RFC 6668, 8268, 8308, 8332, 8709, 8758, 9142) concern algorithms and extensions, not the port.

### units[0].steps[3].deep[0] (step "port-3389", Go deeper) — ✅

"TCP’s standard says a reset is sent whenever a segment arrives that apparently is not intended for the current connection. A SYN that does not match an existing connection is rejected this way."

- `rfc-9293` §3.5.2
  > As a general rule, reset (RST) is sent whenever a segment arrives
  > that apparently is not intended for the current connection.
- `rfc-9293` §3.5.2
  > A SYN
  > segment that does not match an existing connection is rejected by
  > this means.
- Note: RFC 9293 is the defining standard for TCP reset generation.
- Note: the standard gives the first sentence as a general rule and then lists exceptions (in a synchronized connection an unacceptable segment gets an acknowledgment, not a reset). The claim leaves the qualifier out; for a beginner the rule as stated holds in the ordinary case and the second sentence, the one the lesson relies on, is stated exactly.

### units[0].steps[4].deep[0] (step "open-port", Go deeper) — ✅

"A port number is an agreement, not a rule. Remote Desktop can be moved off 3389, and then clients must name the new port when they connect."

- `microsoft-rdp-port` §Test the new Remote Desktop listening port
  > The next time you connect to this computer by using the Remote Desktop Connection or other client, enter the hostname along with the new port.
- `rfc-6335` §3
  > Although this is
  > ultimately a local decision with meaning only between the endpoints
  > of a connection, it is common for many services to have a default
  > port upon which those servers usually listen
- `rfc-6335` §9
  > the fact that
  > network traffic is flowing to or from an assigned port number does
  > not mean that it is "good" traffic, or even that it is used by the
  > assigned service.
- Note: Microsoft's page (live, applies to current Windows and Windows Server) says how to change the listening port and that clients then give the new port. RFC 6335 says a port's meaning is a local decision between the endpoints, with defaults by convention.

### units[0].learn.lead[0] ("lead-1") — ✅

"An IP address gets a message to the right computer. A port number says which program on that computer the message is for."

- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to
  > multiplex distinct flows between hosts.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `rfc-791` §1.1
  > The internet protocol provides for
  > transmitting blocks of data called datagrams from sources to
  > destinations, where sources and destinations are hosts identified by
  > fixed length addresses.
- Note: RFC 791 is the defining standard for IP and its host addresses; RFC 9293 for TCP's use of ports. NIST independently states the port's role.
- Note: "computer" for host and "program" for application service are everyday words. RFC 791 is an Internet Standard, not obsoleted; its updates (RFC 1349, 2474, 6864) concern the type-of-service and ID fields.

### units[0].learn.terms[0] ("term-port") — ✅

Port: "The number that says which program or service on a computer a message is for"

- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services
- `rfc-6335` §3
  > Ports serve two purposes:
  > first, they provide a demultiplexing identifier to differentiate
  > transport sessions between the same pair of endpoints, and second,
  > they may also identify the application protocol and associated
  > service to which processes connect.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `iana-ports` §Note
  > Service names and port numbers are used to distinguish between different services that run
  > over transport protocols such as TCP, UDP, DCCP, and SCTP.
- Note: RFC 9293 defines TCP's port. The definition leaves out the port's other job, telling apart connections between the same two hosts; that does not mislead.

### units[0].learn.terms[1] ("term-listen") — ✅

Listening: "A program waiting for connections on its port"

- `rfc-9293` §3.3.2
  > LISTEN -  represents waiting for a connection request from any remote
  > TCP peer and port.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `microsoft-netstat` §netstat
  > Displays active TCP connections, ports on which the computer is listening
- Note: RFC 9293 defines TCP's LISTEN state. For UDP there are no connections, only arriving datagrams; the term is written for the lesson's TCP story and does not mislead.

### units[0].learn.terms[2] ("term-well-known") — ✅

Well-known ports: "The standard ports, 0 to 1023, that IANA assigns to common services"

- `rfc-6335` §6
  > the System Ports, also known as the Well Known Ports, from 0-1023
  > (assigned by IANA)
- `iana-ports` §Note
  > System Ports (0-1023) are assigned using the [IETF Review] or [IESG Approval] procedures.
- `paloalto-port-scan` §What is a Port Scan?
  > Ports 0 to 1023 are identified as the “well-known ports” or standard ports and have been assigned services by the Internet Assigned Numbers Authority (IANA).
- Note: RFC 6335 is the defining standard for the port number ranges. "Common services" is a describing word; RFC 6335 notes some numbers in the range are reserved or unassigned, which the term leaves out.

### units[0].learn.terms[3] ("term-temporary") — ✅

Temporary (ephemeral) port: "The port your device picks for its own side of a connection, so answers can come back to it"

- `rfc-6056` §1
  > The IP address and
  > port number of the client are normally left unspecified by the client
  > application and thus are chosen automatically by the client
  > networking stack.  Ports chosen automatically by the networking stack
  > are known as ephemeral ports [Stevens].
- `rfc-6335` §8.1.2
  > Application software may simply use any
  > dynamic port that is available on the local host, without any sort
  > of assignment.
- `microsoft-dynamic-ports` §The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008
  > Microsoft has increased the dynamic client port range for outgoing connections in Windows Vista and Windows Server 2008.
- `nist-sp800-41r1` §2
  > a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- Note: "temporary" is the everyday word for "ephemeral", the name RFC 6056 gives. RFC 6056 and RFC 6335 are Best Current Practices, neither obsoleted nor updated.

### units[0].learn.terms[4] ("term-connection") — ✅

Connection: "One conversation, known by both addresses and both ports"

- `rfc-9293` §4
  > A logical communication path identified by a pair of sockets.
- `rfc-6335` §3
  > the combination of source and destination port
  > numbers together with the IP addresses of the communicating end
  > systems uniquely identifies a session of a given transport protocol.
- `nist-sp800-41r1` §2
  > source IP address and port with destination IP address and port helps define the session.
- Note: RFC 9293 defines a connection by its pair of sockets (address plus port at each end). The term leaves out the protocol, the fifth part of the identity in other RFCs; that does not mislead.

### units[0].learn.terms[5] ("term-open") — ✅

Open port: "A port with a program listening on it"

- `rfc-9293` §3.9.1.1
  > If the active/passive flag is set to passive, then this is a call to
  > LISTEN for an incoming connection.
- `microsoft-rdp-enable` §Enable Remote Desktop on your PC
  > Enabling Remote Desktop opens a port on your PC, making it accessible to devices on your local network.
- `paloalto-port-scan` §What is a Port Scan?
  > Running a port scan on a network or server reveals which ports are open and listening (receiving information)
- Note: Palo Alto and Microsoft (two publishers) use "open" for a port where a service listens and can be reached. The term leaves out the case where a firewall blocks a listening port (a scanner calls that "filtered"); the lesson teaches that case in "deep-firewall", so no beginner is misled.

### units[0].learn.terms[6] ("term-closed") — ✅

Closed port: "A port with nothing listening on it: a connection to it is refused"

- `rfc-9293` §3.5.2
  > A SYN
  > segment that does not match an existing connection is rejected by
  > this means.
- `paloalto-port-scan` §Port Scanning Results
  > The target network/server has received the request, but no service is listening
- `microsoft-winsock-errors` §WSAECONNREFUSED
  > No connection could be made because the target computer actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host—that is, one with no server application running.
- Note: three independent sources. The term leaves out the firewall case (silence instead of a refusal), which "deep-firewall" teaches.

### units[0].learn.terms[7] ("term-reset") — ✅

Reset (RST): "The TCP message a closed port sends back"

- `rfc-9293` §3.5.2
  > If the connection does not exist (CLOSED), then a reset is sent
  > in response to any incoming segment except another reset.
- `rfc-9293` §3.10.7.1
  > An incoming segment not
  > containing a RST causes a RST to be sent in response.
- `paloalto-port-scan` §Types of Port Scans
  > For example, a closed port that receives an unsolicited FIN packet, will respond with an RST (an instantaneous abort) packet, but an open port will ignore it.
- Note: RFC 9293 defines the RST segment and when it is sent. The term names the use this lesson shows and leaves out RST's other uses (aborting a connection); it says "TCP", so it does not spread to UDP.

### units[0].learn.pattern ("pattern") — ✅

"Read the destination port", "Find who is listening", "Hand it over: SYN-ACK", "Nobody? Send RST"; note: "What a server’s TCP does with each new connection request, in outline."

- `rfc-9293` §3.3.2
  > LISTEN -  represents waiting for a connection request from any remote
  > TCP peer and port.
- `rfc-9293` §3.10.7.1
  > If the state is CLOSED (i.e., TCB does not exist), then
- `rfc-9293` §3.10.7.1
  > An incoming segment not
  > containing a RST causes a RST to be sent in response.
- `rfc-9293` §3.10.7.2
  > If the state is LISTEN, then
- `rfc-9293` §3.10.7.2
  > Third, check for a SYN:
- `rfc-9293` §3.10.7.2
  > ISS
  > should be selected and a SYN segment sent of the form:
  > <SEQ=ISS><ACK=RCV.NXT><CTL=SYN,ACK>
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- Note: RFC 9293 is the defining standard for segment arrival processing: a SYN to a listening port gets a SYN-ACK, and a segment with no connection gets an RST. "In outline" covers the checks it leaves out (security, unexpected ACKs).

### units[0].learn.why[0] ("why-1") — ✅

"One computer can run many services at the same address. Each listens on its own port, and the port number in a message says which one it is for."

- `rfc-6335` §3
  > it is common for many services to have a default
  > port upon which those servers usually listen
- `rfc-6335` §3
  > multiple instances of the same service on the same host cannot
  > generally listen on the same port
- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `iana-ports` §Note
  > Service names and port numbers are used to distinguish between different services that run
  > over transport protocols such as TCP, UDP, DCCP, and SCTP.
- Note: RFC 9293 defines TCP's use of ports; RFC 6335, NIST and IANA state the same independently.

### units[0].learn.why[1] ("why-2") — ✅

"Services usually sit on fixed, well-known ports, so a client knows where to knock. The client’s side usually needs no fixed number: its system picks a free temporary port, and the answer comes back to it."

- `rfc-6056` §1
  > Services are usually located at fixed, "well-known" ports [IANA] at
  > the host supplying the service (the server).  Client applications
  > connecting to any such service will contact the server by specifying
  > the server IP address and service port number.
- `rfc-6056` §1
  > The IP address and
  > port number of the client are normally left unspecified by the client
  > application and thus are chosen automatically by the client
  > networking stack.
- `rfc-6335` §8.1.2
  > Application software may simply use any
  > dynamic port that is available on the local host, without any sort
  > of assignment.
- `nist-sp800-41r1` §2
  > a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- `microsoft-dynamic-ports` §The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008
  > Microsoft has increased the dynamic client port range for outgoing connections in Windows Vista and Windows Server 2008.

### units[0].learn.deep[0] ("deep-firewall", Learn's Go deeper) — ✅

"A firewall can block a port even while a program listens on it. Then there is often no answer at all, not a reset."

- `microsoft-rdp-enable` §Prerequisites
  > Remote Desktop connections are allowed through the remote PC’s firewall.
- `paloalto-port-scan` §Port Scanning Results
  > Typically, packets sent to filtered ports will not receive a response, but when they do, the error message is usually “communication prohibited” or “destination unreachable.”
- `cisco-fmc-access-rules` §Access control rule blocking actions
  > Block and Block with reset actions immediately stop traffic from entering the network. Block with reset rules reset the connection except for web requests met with an HTTP response page.
- `paloalto-port-scan` §Port Scanning Results
  > For bad actors, locating open ports is the mission. This creates a challenge for security personnel faced with the task of blocking open ports with firewalls (while avoiding cutting off access for authorized users).
- Note: Microsoft (a running Remote Desktop must also be allowed through the firewall) and Palo Alto (firewalls block open ports) confirm the first sentence. Palo Alto (filtered ports typically get no response) and Cisco (a plain Block, unlike Block with reset, sends no reset) confirm the second. "Often" matches Palo Alto's "typically".

### units[0].learn.deep[1] ("deep-udp", Learn's Go deeper) — ✅

"UDP has ports too. A message to a UDP port that nobody listens on may get an ICMP “port unreachable” message back."

- `rfc-1122` §4.1.3.1
  > UDP well-known ports follow the same rules as TCP well-known
  > ports
- `rfc-1122` §4.1.3.1
  > If a datagram arrives addressed to a UDP port for which
  > there is no pending LISTEN call, UDP SHOULD send an ICMP
  > Port Unreachable message.
- `rfc-792` §Destination Unreachable Message, page 4
  > 3 = port unreachable;
- `rfc-792` §Destination Unreachable Message, page 4
  > If, in the destination host, the IP module cannot deliver the
  > datagram  because the indicated protocol module or process port is
  > not active, the destination host may send a destination
  > unreachable message to the source host.
- Note: RFC 1122 is the defining standard for host requirements on UDP, and RFC 792 for the ICMP Destination Unreachable message and its port-unreachable code. "May" matches the SHOULD.
- Note: RFC 1122 and RFC 792 are Internet Standards, not obsoleted. RFC 1122's updates (including RFC 9293 for TCP) leave §4.1.3.1 as it stands; RFC 792's updates (RFC 950, 4884, 6633, 6918) do not deprecate type 3 code 3.

### units[0].learn.deep[2] ("deep-nat", Learn's Go deeper) — ✅

"On the way out, your home router swaps your laptop’s address, and often its port, for its own, so the server sees the router’s address. The NAT lesson shows how."

- `rfc-3022` §2.2
  > NAPT would allow mapping
  > of tuples of the type (local IP addresses, local TU port number) to
  > tuples of the type (registered IP address, assigned TU port number).
- `rfc-3022` §2.2
  > This model fits the requirements of most Small Office Home Office
  > (SOHO) groups to access external network using a single service
  > provider assigned IP address.
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device.  NAPT allows
  > multiple internal hosts to share a single public IP address
  > simultaneously.
- `rfc-4787` §3
  > The effect is that the NAPT
  > establishes a NAT session to translate the (private IP address,
  > private port number) tuple to a (public IP address, public port
  > number) tuple, and vice versa, for the duration of the session.
- Note: two RFCs state it. "Often its port" fits: a NAPT may keep or change the port. RFC 3022 is Informational and not obsoleted; RFC 4787 is a Best Current Practice, updated by RFC 6888 and RFC 7857, which add requirements and do not change this.

### units[0].learn.facts[0] ("fact-defined") — ✅

Defined in: "RFC 9293 (TCP) and RFC 768 (UDP); IANA keeps the list of port numbers (RFC 6335)"

- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to
  > multiplex distinct flows between hosts.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port
  > of the sending  process
- `rfc-6335` §Abstract
  > This document defines the procedures that the Internet Assigned
  > Numbers Authority (IANA) uses when handling assignment and other
  > requests related to the Service Name and Transport Protocol Port
  > Number registry.
- `iana-ports` §Note
  > The registration procedures for service names and port numbers are specified in [RFC 6335]
- Note: RFC 9293 defines TCP's ports, RFC 768 UDP's, and RFC 6335 the registry procedures. Each marker is correct. RFC 768 is an Internet Standard, not obsoleted; its one update, RFC 9868, adds UDP options after the data and leaves the port fields as they are.

### units[0].learn.facts[1] ("fact-osi") — ✅

OSI layer: "4, transport"

- `paloalto-layer-3-vs-7` §What is the difference between Layer 7 and Layer 4 firewall?
  > whereas layer 4 firewalls filter traffic based on transport layer information like TCP/UDP ports
- `microsoft-windows-firewall` §Firewall rules
  > For transport layer protocols, TCP and UDP, you can specify ports or port ranges.
- Note: as for the OSI badge above: two vendors, and the settled rule allows that for a badge.

### units[0].learn.facts[2] ("fact-numbers") — ✅

Port numbers: "0 to 65535"

- `rfc-9293` §3.1
  > Destination Port:  16 bits
- `rfc-6335` §3
  > Ports are
  > 16-bit numbers
- `paloalto-port-scan` §What is a Port Scan?
  > They are numbered from 0 to 65535
- Note: RFC 9293 defines the 16-bit port fields, and 16 bits give 0 to 65535. Palo Alto states the range itself. Port 0 is reserved and not used as a real destination, which the fact leaves out.

### units[0].learn.facts[3] ("fact-two-ports") — ✅

Every TCP or UDP message: "carries two port numbers: a destination port, which says which service it is for, and a source port, which says where answers should go"

- `rfc-9293` §3.1
  > A TCP header follows the IP
  > headers, supplying information specific to TCP.
- `rfc-9293` §3.1
  > Source Port:  16 bits
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port
  > of the sending  process,  and may be assumed  to be the port  to which a
  > reply should  be addressed  in the absence of any other information.
- `rfc-768` §Fields
  > Destination  Port has a meaning  within  the  context  of  a  particular
  > internet destination address.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host, and a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- Note: RFC 9293 and RFC 768 define the two port fields of TCP and UDP. Both headers always have both fields. The fact leaves out that a UDP sender may set the source port to zero when it wants no reply, and that on a reply the destination port is the client's own port, not a service; both are covered by "generally" in NIST and do not mislead a beginner.

### units[0].learn.facts[4] ("fact-common") — ✅

Common ports: "22 SSH, 80 HTTP (the web), 443 HTTPS (the secure web), 3389 Remote Desktop"

- `rfc-4253` §4.1
  > When used over TCP/IP, the server normally listens for connections on
  > port 22.
- `rfc-9110` §4.2.1
  > If the port
  > subcomponent is empty or not given, TCP port 80 (the reserved port
  > for WWW services) is the default.
- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `microsoft-rdp-port` §Change the Remote Desktop listening port on your computer
  > Remote Desktop allows remote connections to computers running Windows or Windows Server over the Remote Desktop Protocol (RDP), listening on port 3389 by default.
- `cloudflare-rdp-browser` §4. Create an Access application
  > It will likely be port 3389.
- `paloalto-port-scan` §What is a Port Scan?
  > Port 80 (TCP) — World Wide Web HTTP
- `cloudflare-network-ports` §Network ports compatible with Cloudflare’s proxy
  > By default, Cloudflare proxies traffic destined for the HTTP/HTTPS ports listed below.
- `cloudflare-network-ports` §How to enable Cloudflare’s proxy for additional ports
  > for example you have an SSH server that listens for incoming connections on port 22
- Note: RFC 4253 defines SSH's port and RFC 9110 the default ports of http and https URIs. 22 is confirmed by RFC 4253 and Cloudflare, 80 by RFC 9110 and Palo Alto, 443 by RFC 9110 and Cloudflare's HTTPS list (443 is first on it), 3389 by Microsoft and Cloudflare. RFC 9110 is an Internet Standard, not obsoleted or updated.

### units[0].learn.facts[5] ("fact-ranges") — ✅

Number ranges: "0-1023 well-known, 1024-49151 registered, 49152-65535 dynamic (never assigned)"

- `rfc-6335` §6
  > the System Ports, also known as the Well Known Ports, from 0-1023
  > (assigned by IANA)
- `rfc-6335` §6
  > the User Ports, also known as the Registered Ports, from 1024-
  > 49151 (assigned by IANA)
- `rfc-6335` §6
  > the Dynamic Ports, also known as the Private or Ephemeral Ports,
  > from 49152-65535 (never assigned)
- `iana-ports` §Note
  > Dynamic and/or Private Ports (49152-65535) are not assigned.
- `paloalto-port-scan` §What is a Port Scan?
  > Ports 0 to 1023 are identified as the “well-known ports” or standard ports
- Note: RFC 6335 is the defining standard for the three ranges; the live IANA registry (updated 2026-11-10) states them the same way.

### units[0].learn.facts[6] ("fact-temporary") — ✅

Temporary ports: "picked by your device for each new connection, often from 49152-65535; some systems use other ranges"

- `rfc-6056` §1
  > Ports chosen automatically by the networking stack
  > are known as ephemeral ports [Stevens].
- `rfc-6056` §2.1
  > The dynamic port range defined by IANA consists of the 49152-65535
  > range, and is meant for the selection of ephemeral ports.
- `rfc-6056` §3.2
  > However, ephemeral port selection algorithms should use
  > the whole range 1024-65535.
- `microsoft-dynamic-ports` §The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008
  > The new default start port is 49152, and the new default end port is 65535.
- `microsoft-dynamic-ports` §The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008
  > This is a change from the configuration of earlier versions of Windows that used a default port range of 1025 through 5000.
- Note: RFC 6056 and Microsoft (Windows' current default) confirm the usual range; RFC 6056's advice to use 1024-65535 and Windows' older range are the "other ranges" the fact names. The Microsoft page is live and applies to supported Windows Server versions.

### units[0].learn.facts[7] ("fact-handshake") — ✅

Opening a TCP connection: "SYN, SYN-ACK, ACK"

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a
  > connection.
- `rfc-9293` §3.5
  > In line 3, TCP Peer B sends a SYN and acknowledges the
  > SYN it received from TCP Peer A.
- `rfc-9293` §3.5
  > At line 4, TCP Peer A responds with an empty segment containing an
  > ACK for TCP Peer B's SYN
- `paloalto-port-scan` §Types of Port Scans
  > This SYN, SYN-ACK, ACK exchange comprises a TCP handshake.
- Note: RFC 9293 defines TCP's three-way handshake. It leaves out simultaneous open, a rare case.

### units[0].learn.facts[8] ("fact-closed") — ✅

Nothing listening (TCP): "the server answers with a reset (RST), and your app reports the connection refused"

- `rfc-9293` §3.5.2
  > A SYN
  > segment that does not match an existing connection is rejected by
  > this means.
- `rfc-9293` §3.10.7.1
  > An incoming segment not
  > containing a RST causes a RST to be sent in response.
- `microsoft-winsock-errors` §WSAECONNREFUSED
  > Connection refused. No connection could be made because the target computer actively refused it.
- `openbsd-man-connect` §ERRORS
  > The attempt to connect was forcefully rejected.
- Note: RFC 9293 defines the reset. Microsoft and OpenBSD, two systems, report a refused connection (WSAECONNREFUSED, ECONNREFUSED). A firewall in the way changes this; "deep-firewall" teaches that.

### units[0].learn.facts[9] ("fact-see") — ✅

See your own: "the netstat command can list the ports your computer is listening on"

- `microsoft-netstat` §Parameters
  > Displays all active TCP connections and the TCP and UDP ports on which the computer is listening.
- `openbsd-man-netstat` §DESCRIPTION
  > With the default display, show only listening sockets.
- Note: Windows and OpenBSD, two vendors, document it. Some Linux systems prefer a newer tool; "can" stays true.

### units[0].practice[0].options[0] (question "closed-port") — ✅

Right answer: "A reset (RST): the connection is refused." Feedback: "Right. With nothing listening, the server’s TCP answers with a reset, and your app reports the connection refused."

- `rfc-9293` §3.5.2
  > A SYN
  > segment that does not match an existing connection is rejected by
  > this means.
- `microsoft-winsock-errors` §WSAECONNREFUSED
  > No connection could be made because the target computer actively refused it.
- Note: RFC 9293 defines the reset; Microsoft states the refusal. Correct for a right answer.

### units[0].practice[0].options[1] (question "closed-port") — ✅

Wrong answer: "Nothing at all." Feedback: "Not quite. A closed port answers with a reset. Silence is what you often get when a firewall blocks the port."

- `rfc-9293` §3.5.2
  > If the connection does not exist (CLOSED), then a reset is sent
  > in response to any incoming segment except another reset.
- `paloalto-port-scan` §Port Scanning Results
  > Typically, packets sent to filtered ports will not receive a response
- Note: correct for a wrong answer: the prompt names no firewall, and the feedback says when silence happens.

### units[0].practice[0].options[2] (question "closed-port") — ✅

Wrong answer: "The web server on port 80 answers instead." Feedback: "Not quite. The port says which program a message is for, and a message for 3389 is not for the program on port 80."

- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `rfc-9110` §4.2.1
  > TCP port 80 (the reserved port
  > for WWW services)
- Note: correct for a wrong answer.

### units[0].practice[1].options[0] (question "reply-port") — ✅

Right answer: "50423, the port it came from." Feedback: "Yes. The answer goes from the server’s port, 443, back to your temporary port, so your laptop knows it is for the browser."

- `rfc-9293` §4
  > The portion of a connection identifier used for
  > demultiplexing connections at an endpoint.
- `nist-sp800-41r1` §2
  > a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- Note: RFC 9293 defines the port as what an endpoint uses to sort arriving segments into connections (here, the laptop finding the browser's); NIST states the reply goes to the source port.

### units[0].practice[1].options[1] (question "reply-port") — ✅

Wrong answer: "443." Feedback: "Not quite. 443 is the server’s own port. The answer goes to the other end of the connection: your port, 50423."

- `rfc-9293` §4
  > A logical communication path identified by a pair of sockets.
- `nist-sp800-41r1` §2
  > a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- Note: correct for a wrong answer.

### units[0].practice[1].options[2] (question "reply-port") — ✅

Wrong answer: "80, the web’s usual port." Feedback: "Not quite. This connection is to 443, and the answer goes back to the port it came from, 50423."

- `rfc-9293` §4
  > A logical communication path identified by a pair of sockets.
- `nist-sp800-41r1` §2
  > a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- `rfc-9110` §4.2.1
  > TCP port 80 (the reserved port
  > for WWW services) is the default.
- Note: correct for a wrong answer; the option's "the web’s usual port" is true too.

### units[0].practice[2].options[0] (question "which-port") — ✅

Right answer: "443". Feedback: "Right. 443 is the standard port for HTTPS."

- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: RFC 9110 defines the https scheme and its default port.

### units[0].practice[2].options[1] (question "which-port") — ✅

Wrong answer: "80". Feedback: "Not quite. 80 is for plain HTTP; HTTPS uses 443."

- `rfc-9110` §4.2.1
  > TCP port 80 (the reserved port
  > for WWW services) is the default.
- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: RFC 9110 defines both defaults. Correct for a wrong answer.

### units[0].practice[2].options[2] (question "which-port") — ✅

Wrong answer: "22". Feedback: "Not quite. 22 is SSH’s port."

- `rfc-4253` §4.1
  > This port number has been registered with the IANA, and has
  > been officially assigned for SSH.
- Note: RFC 4253 defines SSH's port. Correct for a wrong answer.

### units[0].practice[2].options[3] (question "which-port") — ✅

Wrong answer: "3389". Feedback: "Not quite. 3389 is Remote Desktop’s port."

- `microsoft-rdp-port` §Change the Remote Desktop listening port on your computer
  > listening on port 3389 by default
- `cloudflare-rdp-browser` §4. Create an Access application
  > It will likely be port 3389.
- Note: two vendors. Correct for a wrong answer.

## Traced, example and analogy parts, and unbacked items

### title — ✅

- Note: "Ports" makes no claim beyond the lesson.

### units[0].name — ✅

- Note: "Ports" makes no claim beyond the lesson.

### backing (the lesson's subtitle and summary) — ✅

- Note: repeats why-1, term-port and term-listen; the rest describes what the Watch shows (four ports, three answer, one opened later).

### units[0].backing (the unit's full name and purpose) — ✅

- Note: repeats term-port.

### units[0].scene.backing (the scene) — ✅

- Note: example data only (example.net, 203.0.113.80 from RFC 5737); the table's rows (TCP 22 SSH, TCP 80 HTTP, TCP 443 HTTPS) repeat fact-common and fact-see; the legend's Reset repeats term-reset.

### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: repeats why-1, fact-common, term-listen, term-closed and term-open.

### units[0].overview.backing (the Overview description) — ⚠️

- Note: "a message to a port with nothing listening is answered with a reset" drops the "TCP" that fact-closed states ("Nothing listening (TCP)"). As written it covers UDP too, and the lesson's own "deep-udp" says a UDP message there may get an ICMP port unreachable, not a reset. Fix: say "a TCP connection request" (or "a SYN") instead of "a message".

### units[0].overview.facts[0] (Overview fact "Port numbers") — ✅

- Note: repeats fact-numbers.

### units[0].overview.facts[1] (Overview fact "Common ports") — ✅

- Note: repeats fact-common.

### units[0].overview.facts[2] (Overview fact "Nothing listening") — ⚠️

- Note: the label drops the "(TCP)" of fact-closed, and two lines below the Overview names RFC 768 (UDP) as a defining document, so a beginner reads that any port with nothing listening answers with a reset, which "deep-udp" contradicts for UDP. Fix: label it "Nothing listening (TCP)", as Learn does.

### units[0].overview.facts[3] (Overview fact "OSI layer") — ✅

- Note: repeats fact-osi.

### units[0].overview.facts[4] (Overview fact "Defined in") — ✅

- Note: repeats fact-defined.

### units[0].steps[0] (step "port-80") — ✅

- Note: every statement repeats term-temporary, fact-two-ports, fact-handshake (SYN first), term-listen and fact-common; addresses and ports are example data.

### units[0].steps[0].facts[0] (step "port-80", fact "Laptop’s port") — ✅

- Note: repeats term-temporary.

### units[0].steps[0].facts[1] (step "port-80", fact "Server’s port") — ✅

- Note: repeats fact-common and term-listen.

### units[0].steps[0].facts[2] (step "port-80", fact "The answer goes to") — ✅

- Note: repeats fact-two-ports.

### units[0].steps[0].events[0] (event "s1-syn") — ✅

- Note: example addresses (192.168.1.100 is RFC 1918, 203.0.113.80 is RFC 5737); the SYN repeats fact-handshake. The log shows the laptop's own address, as seen at the laptop, which "deep-nat" explains.

### units[0].steps[0].events[1] (event "s1-match") — ✅

- Note: repeats term-listen and fact-common.

### units[0].steps[0].events[2] (event "s1-synack") — ✅

- Note: repeats fact-handshake and fact-two-ports.

### units[0].steps[1] (step "port-443") — ✅

- Note: repeats term-connection (both addresses and both ports), term-temporary, term-listen and fact-common.

### units[0].steps[1].facts[0] (step "port-443", fact "New connection") — ✅

- Note: repeats term-temporary and fact-common.

### units[0].steps[1].facts[1] (step "port-443", fact "Two connections") — ✅

- Note: repeats term-connection.

### units[0].steps[1].facts[2] (step "port-443", fact "Port 443") — ✅

- Note: repeats fact-common.

### units[0].steps[1].events[0] (event "s2-syn") — ✅

- Note: repeats fact-handshake and fact-temporary; example data.

### units[0].steps[1].events[1] (event "s2-match") — ✅

- Note: repeats term-listen and fact-common.

### units[0].steps[1].events[2] (event "s2-synack") — ✅

- Note: repeats fact-handshake and fact-two-ports.

### units[0].steps[2] (step "port-22") — ✅

- Note: repeats why-1, term-port, term-temporary, fact-two-ports and fact-common.

### units[0].steps[2].facts[0] (step "port-22", fact "Laptop’s port") — ✅

- Note: repeats term-temporary.

### units[0].steps[2].facts[1] (step "port-22", fact "Server’s port") — ✅

- Note: repeats fact-common and term-listen.

### units[0].steps[2].facts[2] (step "port-22", fact "Not the web server") — ✅

- Note: repeats why-1.

### units[0].steps[2].events[0] (event "s3-syn") — ✅

- Note: repeats fact-handshake and term-temporary; example data.

### units[0].steps[2].events[1] (event "s3-match") — ✅

- Note: repeats term-listen and fact-common.

### units[0].steps[2].events[2] (event "s3-synack") — ✅

- Note: repeats fact-handshake and fact-two-ports.

### units[0].steps[3] (step "port-3389") — ✅

- Note: repeats term-closed, term-reset, fact-closed (TCP, since it is a SYN), fact-common and fact-see.

### units[0].steps[3].facts[0] (step "port-3389", fact "Server’s port") — ✅

- Note: repeats fact-common.

### units[0].steps[3].facts[1] (step "port-3389", fact "Listening on 3389") — ✅

- Note: repeats term-closed.

### units[0].steps[3].facts[2] (step "port-3389", fact "The answer") — ✅

- Note: repeats term-reset; the step is a TCP SYN, so it matches fact-closed.

### units[0].steps[3].facts[3] (step "port-3389", fact "Your app reports") — ✅

- Note: repeats fact-closed.

### units[0].steps[3].events[0] (event "s4-syn") — ✅

- Note: repeats fact-handshake; example data.

### units[0].steps[3].events[1] (event "s4-nomatch") — ✅

- Note: repeats term-closed.

### units[0].steps[3].events[2] (event "s4-rst") — ✅

- Note: repeats term-reset and fact-closed for a TCP SYN.

### units[0].steps[4] (step "open-port") — ✅

- Note: repeats term-open, term-listen, fact-temporary and fact-handshake.

### units[0].steps[4].facts[0] (step "open-port", fact "Remote Desktop") — ✅

- Note: repeats term-open and term-listen.

### units[0].steps[4].facts[1] (step "open-port", fact "Port 3389") — ✅

- Note: repeats term-open.

### units[0].steps[4].facts[2] (step "open-port", fact "The answer") — ✅

- Note: repeats fact-handshake and fact-closed.

### units[0].steps[4].events[0] (event "s5-add") — ✅

- Note: repeats term-open, term-listen and fact-common.

### units[0].steps[4].events[1] (event "s5-syn") — ✅

- Note: repeats fact-handshake and fact-temporary; example data.

### units[0].steps[4].events[2] (event "s5-match") — ✅

- Note: repeats term-listen.

### units[0].steps[4].events[3] (event "s5-synack") — ✅

- Note: repeats fact-handshake and fact-two-ports.

### units[0].learn.lead[1] ("lead-2") — ✅

- Note: analogy (address as a building, port as a door, an empty office answering "nobody here"). It maps a closed port's reset fairly and does not mislead.

### units[0].practice[0].prompt (question "closed-port") — ✅

- Note: no false premise; matches fact-closed and term-closed.

### units[0].practice[1].prompt (question "reply-port") — ✅

- Note: no false premise; example data.

### units[0].practice[2].prompt (question "which-port") — ✅

- Note: no false premise; "by default" matches RFC 9110 as cited in fact-common.

## Sources

All checked 2026-11-14.

- `cisco-fmc-access-rules`: live on cisco.com. Release 7.7 is past end of sale (29 September 2026) but still in software maintenance until 29 September 2027 and supported until 30 September 2028, per Cisco's end-of-life notice; a newer 10.0 release exists. The cited behaviour (Block versus Block with reset) is a current product's. Current.
- `cloudflare-network-ports`: live Cloudflare developer documentation. Current.
- `cloudflare-rdp-browser`: live Cloudflare One documentation. Current.
- `iana-ports`: the live IANA registry, last updated 2026-11-10. Current.
- `microsoft-dynamic-ports`: live Microsoft Learn article (last updated 2026-02-12), applies to supported Windows Server versions. Current.
- `microsoft-netstat`: live, applies to Windows 10 and 11 and Windows Server 2016 to 2025. Current.
- `microsoft-rdp-enable`: live (2025-06-18), current Windows. Current.
- `microsoft-rdp-port`: live (2025-06-30), current Windows. Current.
- `microsoft-windows-firewall`: live, current Windows. Current.
- `microsoft-winsock-errors`: live Win32 reference. Current.
- `nist-sp800-41r1`: NIST CSRC lists SP 800-41 Rev. 1 as final (September 2009), with no withdrawal or newer revision. Current.
- `openbsd-man-connect`, `openbsd-man-netstat`: live on man.openbsd.org, the current release's pages. Current.
- `paloalto-layer-3-vs-7`, `paloalto-port-scan`: live Palo Alto Networks Cyberpedia explainers. Current.
- `rfc-1122`: Internet Standard, not obsoleted; updates checked as above. Current.
- `rfc-3022`: Informational, not obsoleted or updated. Current.
- `rfc-4253`: Proposed Standard, not obsoleted; updates concern algorithms. Current.
- `rfc-4787`: Best Current Practice, not obsoleted; updated by RFC 6888 and 7857, which do not change the cited text. Current.
- `rfc-6056`: Best Current Practice, not obsoleted or updated. Current.
- `rfc-6335`: Best Current Practice, not obsoleted or updated. Current.
- `rfc-768`: Internet Standard, not obsoleted; updated by RFC 9868 (UDP options), which keeps the port fields. Current.
- `rfc-791`: Internet Standard, not obsoleted; updates concern other header fields. Current.
- `rfc-792`: Internet Standard, not obsoleted; updates do not touch port unreachable. Current.
- `rfc-9110`: Internet Standard, not obsoleted or updated. Current.
- `rfc-9293`: Internet Standard, not obsoleted or updated. Current.

## Limit overrides

None.
