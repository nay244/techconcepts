```json fact-check
{
  "slug": "router",
  "hash": "d3b71023aac827eac8cfdccce3ec666b87e16459e30f2a7f2ef4503156e95268",
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
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[0] (Overview fact \"Joins\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Each hop\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"When nothing else fits\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"No route at all\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"near-or-far\")": "✅",
    "units[0].steps[0].facts[0] (step \"near-or-far\", fact \"Destination\")": "✅",
    "units[0].steps[0].facts[1] (step \"near-or-far\", fact \"On my network?\")": "✅",
    "units[0].steps[0].facts[2] (step \"near-or-far\", fact \"Route that fits\")": "✅",
    "units[0].steps[0].facts[3] (step \"near-or-far\", fact \"Next hop\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-table\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-match\")": "✅",
    "units[0].steps[0].events[2] (event \"s1-packet\")": "✅",
    "units[0].steps[1] (step \"one-way-out\")": "✅",
    "units[0].steps[1].facts[0] (step \"one-way-out\", fact \"Connected\")": "✅",
    "units[0].steps[1].facts[1] (step \"one-way-out\", fact \"Route that fits\")": "✅",
    "units[0].steps[1].facts[2] (step \"one-way-out\", fact \"Source now\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-table\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-match\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-packet\")": "✅",
    "units[0].steps[2] (step \"most-specific\")": "✅",
    "units[0].steps[2].facts[0] (step \"most-specific\", fact \"Routes that fit\")": "✅",
    "units[0].steps[2].facts[1] (step \"most-specific\", fact \"Winner\")": "✅",
    "units[0].steps[2].facts[2] (step \"most-specific\", fact \"Next hop\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-table\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-candidates\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-winner\")": "✅",
    "units[0].steps[2].events[3] (event \"s3-packet\")": "✅",
    "units[0].steps[3] (step \"hop-by-hop\")": "✅",
    "units[0].steps[3].facts[0] (step \"hop-by-hop\", fact \"Router b\")": "✅",
    "units[0].steps[3].facts[1] (step \"hop-by-hop\", fact \"Router c\")": "✅",
    "units[0].steps[3].facts[2] (step \"hop-by-hop\", fact \"Last next hop\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-table\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-to-c\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-match\")": "✅",
    "units[0].steps[3].events[3] (event \"s4-delivered\")": "✅",
    "units[0].steps[4] (step \"no-route\")": "✅",
    "units[0].steps[4].facts[0] (step \"no-route\", fact \"Router a’s table\")": "✅",
    "units[0].steps[4].facts[1] (step \"no-route\", fact \"The packet\")": "✅",
    "units[0].steps[4].facts[2] (step \"no-route\", fact \"The message\")": "✅",
    "units[0].steps[4].facts[3] (step \"no-route\", fact \"Back to\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-table\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-to-isp\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-to-a\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-nomatch\")": "✅",
    "units[0].steps[4].events[4] (event \"s5-drop\")": "✅",
    "units[0].steps[4].events[5] (event \"s5-icmp\")": "✅",
    "units[0].steps[0].deep[0] (step \"near-or-far\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"one-way-out\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"most-specific\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"hop-by-hop\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"no-route\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.terms[0] (\"term-router\")": "✅",
    "units[0].learn.terms[1] (\"term-gateway\")": "✅",
    "units[0].learn.terms[2] (\"term-routing-table\")": "✅",
    "units[0].learn.terms[3] (\"term-route\")": "✅",
    "units[0].learn.terms[4] (\"term-next-hop\")": "✅",
    "units[0].learn.terms[5] (\"term-connected\")": "✅",
    "units[0].learn.terms[6] (\"term-default-route\")": "✅",
    "units[0].learn.terms[7] (\"term-longest-match\")": "✅",
    "units[0].learn.terms[8] (\"term-ttl\")": "✅",
    "units[0].learn.terms[9] (\"term-unreachable\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "⚠️",
    "units[0].learn.deep[0] (\"deep-metric\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-sources\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-nat\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-defined\")": "✅",
    "units[0].learn.facts[1] (\"fact-osi\")": "✅",
    "units[0].learn.facts[2] (\"fact-host-table\")": "✅",
    "units[0].learn.facts[3] (\"fact-default\")": "✅",
    "units[0].learn.facts[4] (\"fact-match\")": "✅",
    "units[0].learn.facts[5] (\"fact-hop\")": "✅",
    "units[0].learn.facts[6] (\"fact-ttl\")": "✅",
    "units[0].learn.facts[7] (\"fact-home\")": "⚠️",
    "units[0].learn.facts[8] (\"fact-no-route\")": "✅",
    "units[0].learn.facts[9] (\"fact-gateway-name\")": "✅",
    "units[0].practice[0].options[0] (question \"where-first\")": "✅",
    "units[0].practice[0].options[1] (question \"where-first\")": "✅",
    "units[0].practice[0].options[2] (question \"where-first\")": "✅",
    "units[0].practice[1].options[0] (question \"which-route\")": "✅",
    "units[0].practice[1].options[1] (question \"which-route\")": "✅",
    "units[0].practice[1].options[2] (question \"which-route\")": "✅",
    "units[0].practice[2].options[0] (question \"no-route\")": "✅",
    "units[0].practice[2].options[1] (question \"no-route\")": "✅",
    "units[0].practice[2].options[2] (question \"no-route\")": "✅",
    "units[0].practice[0].prompt (question \"where-first\")": "✅",
    "units[0].practice[1].prompt (question \"which-route\")": "✅",
    "units[0].practice[2].prompt (question \"no-route\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-gateway-last-resort",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cisco-how-router-works",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cisco-route-command",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cisco-route-selection",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cisco-what-is-routing",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "microsoft-route",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "microsoft-tcpip-subnetting",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "paloalto-layer-3-vs-7",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-1812",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-3022",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-4632",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-4787",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-5508",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-792",
      "current": true,
      "checked": "2026-11-14"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-14",
    "count": 111,
    "digest": "ef579c2ac324bdad19b7ff62c87e2c38b52a87f40e69cf27af85ca23d9198f01",
    "files": {
      "cisco-what-is-routing": "7c41028fad67b674ce16247f884eb59484864b1af44bc95c721f497cd87196bd",
      "paloalto-layer-3-vs-7": "c549517cb576ade30f74645ecbccfe52c5ac018850e97f71d423deeb58e38e8f",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "microsoft-tcpip-subnetting": "1c6cd5689711df14f1b84830cca7d1b1d8f120066d77d4696add5ee5bbd6e87a",
      "cisco-how-router-works": "2c7f50907bc4d56ca4f2d2a90118381a1df5e92f0173f977a2141428edc44b50",
      "rfc-4632": "13694a39f586eb2054407780edccdf7c39332e57f067c8008bba4326bfc24fa9",
      "microsoft-route": "e78965846e64a169b1626bbec5df5053ac52c9b4dbcca0d7ec81e21c4622282e",
      "cisco-gateway-last-resort": "155c3730f4d68dd8e71fdeb53cffeb1514bf079813ab6d89e20c60c9af3b78d0",
      "cisco-route-selection": "9d1013b9d87331d2530d30737a9f442eaa46d8e21d8f1701a1252d80709f772b",
      "rfc-792": "58714393ded142bacf188d7e8977eef98f4110c4c87ac94595f750df5664c2c6",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-5508": "89dd10c7b88610cec8c2a605e928822fd3c2e591a81382ed8c1c2ad2e26493d3",
      "cisco-route-command": "f638050be4c50f1fea6a1348db10f0a1830f443d19dd877b1c48d724eadfe621"
    }
  },
  "items": {
    "title": "b8f805c918c010795a1f99110a54ae1de9b67d6fc2ee9be3a5589841d68893b8",
    "units[0].name": "961d920c581778c1b7fe14f6f4dc0c50709d52c31ca32b2f5a2530d213e11195",
    "units[0].osi": "133ef57c44ea8d7e416a0543489f036b1d413ef7ab9aafe4847b8c1b7d3c5c24",
    "backing (the lesson's subtitle and summary)": "3655df4b08be3e7761c61d1321a40c50edd7b0a8fda1263a4824728c5deec9f0",
    "units[0].backing (the unit's full name and purpose)": "e62f4677d53746fe3a97c2fcc127543866a2aad5bd91590284b9836daf7bc9c2",
    "units[0].scene.backing (the scene)": "f0fde8f4a9e3017c0f45d8f9ce6b1e8b38e200d6c95fe3c003fec62576e39005",
    "units[0].overview.hookBacking (the Overview hook)": "11c965f3154a9961012bc2216e6b11553542269fdc38a8e4dc8ea591ee8d8f48",
    "units[0].overview.backing (the Overview description)": "248f8fd798ecb157d5a485c0b732696e92ddb75784a973496768deacc83b1faf",
    "units[0].overview.facts[0] (Overview fact \"Joins\")": "d1ff98b3d2acd1469adf30645dd024772673b6ef92786665e1e04069842b0340",
    "units[0].overview.facts[1] (Overview fact \"Each hop\")": "4b02965f8f17811407577b37a9c89b360272406f45326eef6eee56b7accc95cc",
    "units[0].overview.facts[2] (Overview fact \"When nothing else fits\")": "e10d9a513fc0ce5ac81b2fe4ba896343fe2cbd6c01943bb55ed335c05201c723",
    "units[0].overview.facts[3] (Overview fact \"No route at all\")": "48501dc949dc1b3d9f839059ff173c372957273f55474a8fa7498395eaef8c01",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "1c8a653b23fac582bf31a0e983668e4dbcfddbe9615bf52e8f38c1effa70ac4c",
    "units[0].overview.facts[5] (Overview fact \"Defined in\")": "a0c1e1a33880c42196ddb4a101a8561e29f9e637ebdcadca46ee3e308f103820",
    "units[0].steps[0] (step \"near-or-far\")": "4e3e9a284b3b9151685b8d9ab08e2121d48ce56af5ae9aab2bda2559dff025b2",
    "units[0].steps[0].facts[0] (step \"near-or-far\", fact \"Destination\")": "05ccb056384e9aa7f01907c1b3a2276951ed1459b79a5e36f68899a7d4fc0587",
    "units[0].steps[0].facts[1] (step \"near-or-far\", fact \"On my network?\")": "08b1e798c780a7338b723cd60ebe6e6089c935559e8aea79e5792ec7f983e344",
    "units[0].steps[0].facts[2] (step \"near-or-far\", fact \"Route that fits\")": "518d3e2e41da650b2cfe67b6a87379217369195eecfc161b3697de0771d29b98",
    "units[0].steps[0].facts[3] (step \"near-or-far\", fact \"Next hop\")": "0ae45d9aa0913f00aa3994e02b2ece14d2fdf6ef200ce82f825bfef6e6203a36",
    "units[0].steps[0].events[0] (event \"s1-table\")": "c39febf52e57dd88591801a11e322480ea899452b0b19b5419aa556208dcb3a7",
    "units[0].steps[0].events[1] (event \"s1-match\")": "2d25fc359ca81635b7b24a7fd3d51a61dc1abf891d9352c0ba48a8b68d55461a",
    "units[0].steps[0].events[2] (event \"s1-packet\")": "23e897c6e101a15b60396406f615991f34f1c132d172807b3e082b8d496aa805",
    "units[0].steps[1] (step \"one-way-out\")": "8ff6ee11ecd5d521e9dc8e0ae50d5a88f74b8eaaecdf57f619e5ace5828532fa",
    "units[0].steps[1].facts[0] (step \"one-way-out\", fact \"Connected\")": "3c83c47fb864763eec7db46268fb0c8b7959a41b4941823015a495f2a064d7d6",
    "units[0].steps[1].facts[1] (step \"one-way-out\", fact \"Route that fits\")": "7b84600de4fa82b1f81ec676af94683c654f4e487682141efad5356a00f01500",
    "units[0].steps[1].facts[2] (step \"one-way-out\", fact \"Source now\")": "bae7d13cdff1b9b5240fe919555ddc92b2d534c9135b22f1bc76cbebdf7f59db",
    "units[0].steps[1].events[0] (event \"s2-table\")": "9e64ed062d8f5729723e4ae987a51577f7ea0f1b94b42fba0b27e30e4c7dc1b6",
    "units[0].steps[1].events[1] (event \"s2-match\")": "62ef6c76a497b9d422bbff25ecdf142deea6ad238130d8c043472345826095e1",
    "units[0].steps[1].events[2] (event \"s2-packet\")": "b96228912959272e8463fb4124c40116639abef16f1506072dbd8e976721c533",
    "units[0].steps[2] (step \"most-specific\")": "79fd8c8b59613e3fb5378139c4e14ed4777aa3fe1cf493ae2fcb6c6c795bb465",
    "units[0].steps[2].facts[0] (step \"most-specific\", fact \"Routes that fit\")": "a7d2baa0ea71eb6b40b03d1fe56d2c2a21a81aab4a1eca3d1eefde7dbf4745bd",
    "units[0].steps[2].facts[1] (step \"most-specific\", fact \"Winner\")": "1fe63e16b83871506b2275193d43a503fb6e019cefe4a39ea1daf1b8a1c7a6a8",
    "units[0].steps[2].facts[2] (step \"most-specific\", fact \"Next hop\")": "8368d6ec1baa701d8af563e005c79dd6aa8d6b869d3d5e0fb4a1772f64fd8b7b",
    "units[0].steps[2].events[0] (event \"s3-table\")": "207fa751cce1a10e4b957f4c191ced3381ff392323978a58e8b81aa10a3e8ae1",
    "units[0].steps[2].events[1] (event \"s3-candidates\")": "a19cf88a563e467cbb3e288b449d362604b280c56583b641c044f31e85ddf09a",
    "units[0].steps[2].events[2] (event \"s3-winner\")": "b3f9c6b1c45fc2d8525411172ebab9fee731a386529870d74b8e39a719b7cb31",
    "units[0].steps[2].events[3] (event \"s3-packet\")": "cf7fa82a36a87e5e5b5637b97a4520108b0ce398e49361e1d00279bbabcf9c9f",
    "units[0].steps[3] (step \"hop-by-hop\")": "9bef399c966fac35b40b7532785719ba214e4699620d467b669265e4943a6fee",
    "units[0].steps[3].facts[0] (step \"hop-by-hop\", fact \"Router b\")": "8e68f4deb178e2c5090be026f531edc0a317358536c2df0419948daeefd5b1b9",
    "units[0].steps[3].facts[1] (step \"hop-by-hop\", fact \"Router c\")": "938633b34098338fc2550824d5405faeaf8565c9e36a8a19c12e633903e8abbd",
    "units[0].steps[3].facts[2] (step \"hop-by-hop\", fact \"Last next hop\")": "eca4f9595ce2b25592fab4ea5ba59ec3b1909deceddf4062c7ee119cd015b243",
    "units[0].steps[3].events[0] (event \"s4-table\")": "a96d68cd8d6b1b07385703d34b7c74bc60e9556e860e4be01f126052bc5b8654",
    "units[0].steps[3].events[1] (event \"s4-to-c\")": "72128eba10e4eb7f78c3fdacd6a71fd15441148cec212e02c88114be9e168a6a",
    "units[0].steps[3].events[2] (event \"s4-match\")": "91af594e5d99cb9309becf11c43d828396f34905264b8e70731ed05abeca3c64",
    "units[0].steps[3].events[3] (event \"s4-delivered\")": "8991979950ce92d569427281bccb2930987f00dfbbddd6cdd5d4741b55cbf393",
    "units[0].steps[4] (step \"no-route\")": "2a74276bba1ba90c5b641d525212a61c7f1898b2a4a82fe00b7b6e2bd5344bec",
    "units[0].steps[4].facts[0] (step \"no-route\", fact \"Router a’s table\")": "69669987557bab144fb91418a604bbc8adeb336bde4d26b7901b34c09b08aa52",
    "units[0].steps[4].facts[1] (step \"no-route\", fact \"The packet\")": "d2f2330058f7f22a466115ed3f0b7214129f9cb3f86c569797441633bb9196d9",
    "units[0].steps[4].facts[2] (step \"no-route\", fact \"The message\")": "eb558815340f3591d535ad50bad826f2f549545737febddd9291d76cd015ff3a",
    "units[0].steps[4].facts[3] (step \"no-route\", fact \"Back to\")": "a75a067d9723f2ee0dab77eaea8708e29976325f0c8f380eaf1b3a3d27ad24aa",
    "units[0].steps[4].events[0] (event \"s5-table\")": "6fa8003911193de7b66ba5fba5b947a8a2e3d62b1d2757ec2b73955ce452fbce",
    "units[0].steps[4].events[1] (event \"s5-to-isp\")": "6167322a5878c3c9fbbf738e0932ca58bfa869048542bf819a76cdf144474831",
    "units[0].steps[4].events[2] (event \"s5-to-a\")": "6e7701009ad0bd0f5de7763608a182378ec2268dff74f5ef16df0e1bbf246865",
    "units[0].steps[4].events[3] (event \"s5-nomatch\")": "2ca0322d440c51728affb35d997c7672ede06fd31f82049e21aa9101408f1de6",
    "units[0].steps[4].events[4] (event \"s5-drop\")": "da1e02a0a838d54c544dec32ad033c64d981e0d5d9af0d1b7965cb6bde25e48b",
    "units[0].steps[4].events[5] (event \"s5-icmp\")": "6513b3cda2921f3e37c29a241472ebf6cf3144962df29f26f4552403becf9ac8",
    "units[0].steps[0].deep[0] (step \"near-or-far\", Go deeper)": "4c095b728fcb018923e97efffc6db3499d2b2bff45fe38852f71dc25bffe4697",
    "units[0].steps[1].deep[0] (step \"one-way-out\", Go deeper)": "d5078fe5577c4afa2d356ad09a9ca83c0bb042bafa97bbde27c51c8ad9e90535",
    "units[0].steps[2].deep[0] (step \"most-specific\", Go deeper)": "c961359d0b507bd0149c94222ed4d6e981edb46299d0551bf8e06804fdd3269f",
    "units[0].steps[3].deep[0] (step \"hop-by-hop\", Go deeper)": "b5f2edf4a88c3d9ff00d664d7bcd94fdd0e5e4c0c20cec4cc3122079bc408f0a",
    "units[0].steps[4].deep[0] (step \"no-route\", Go deeper)": "99d097bbce34c7472332364fc33554af095b5ca9adb0fc719cfbfc7c6b919279",
    "units[0].learn.lead[0] (\"lead-1\")": "aac3b11670788dbed9eb979bd21c2ba328a680ee51c754d37e1c2a1142545d8c",
    "units[0].learn.terms[0] (\"term-router\")": "ade48b45701476921011bf87da542e15fab840072b9db44649e21c546faa807e",
    "units[0].learn.terms[1] (\"term-gateway\")": "4bb2615639bb65f417defbabade390a93b84c3ea14c6e7ab71f2ed6d392a9862",
    "units[0].learn.terms[2] (\"term-routing-table\")": "dbdce24d8283a6b8a7d9a7e0900d5005b506a870cd8a24e69443cc1e81d4347b",
    "units[0].learn.terms[3] (\"term-route\")": "ff10b4fbe18f5d34c4979cf90b7e317c0622d616916eab3414395da35003d49b",
    "units[0].learn.terms[4] (\"term-next-hop\")": "2c92103c09ef169b462a69d53201cd8b2bfe6101899be3b92b5c3f399dc01417",
    "units[0].learn.terms[5] (\"term-connected\")": "1d206a8c3c46a3f5bc3b455c44ebb89b4e70a80732a098ae7585b3dc9d10af9a",
    "units[0].learn.terms[6] (\"term-default-route\")": "a06bee5cee45d46054c8d6467c9a647246c6c07d7bb6f417f9b9a56128b4eefc",
    "units[0].learn.terms[7] (\"term-longest-match\")": "9325c8e561d3a870d4dd221e57dbadcfa884331733a4441032898968c875639b",
    "units[0].learn.terms[8] (\"term-ttl\")": "4059346ba94ec9283b67090b443fd653098bce8cb57c6f964e96aa0374aa4699",
    "units[0].learn.terms[9] (\"term-unreachable\")": "8fedf182ef8e1d887d0a41a2f4ba02edc0fe1267c24d72080883836f2ca08be8",
    "units[0].learn.pattern (\"pattern\")": "b4d0690ebaa19c9f4751eb059eb506b50a64e5726950523fdc0e218abc21458d",
    "units[0].learn.why[0] (\"why-1\")": "a3dc584aced1f042217e2cc40202683837d19e3faccc807f76f344f59574c246",
    "units[0].learn.why[1] (\"why-2\")": "8c4558da6513c1a32eca16c314fe6d141f3088a04639f1eecf40c43fc527ee96",
    "units[0].learn.deep[0] (\"deep-metric\", Learn's Go deeper)": "5239aee3a1d6ad0436519179d1d49ec00e526c029ae886ec6df0ae8e4e6d7c14",
    "units[0].learn.deep[1] (\"deep-sources\", Learn's Go deeper)": "a41a65826f02a99067a461402b3be97df4b1c949a316be96bc63c4068f3ae447",
    "units[0].learn.deep[2] (\"deep-nat\", Learn's Go deeper)": "c08dac12fe594bcb4a1711f26ebd7dc64f300bce45274f285c78c448d447568d",
    "units[0].learn.facts[0] (\"fact-defined\")": "17dc35476bcd730905de9b152bf7364b44baf9ce9e0c158a0e38be64a8ff39f4",
    "units[0].learn.facts[1] (\"fact-osi\")": "dadb9232caff03dda15a7b56c8f3a48f7313d81e87638466f01518a5caddc75f",
    "units[0].learn.facts[2] (\"fact-host-table\")": "e2657fb0b1424e647f767efb13d235bb86699b3eb76f6b940cb640491df9cf34",
    "units[0].learn.facts[3] (\"fact-default\")": "d866a969e59355603f3bdfdceca4150add1a8b8caaad47569dbc633fef7d6d86",
    "units[0].learn.facts[4] (\"fact-match\")": "7345e0b82e64ead8e94c0cddf89806af1e9176fb48481fba3554e2bb222d5a88",
    "units[0].learn.facts[5] (\"fact-hop\")": "ff1926e5eef6b89cc7d479c9cde476149b3068e5eff08bb535253b11754e1960",
    "units[0].learn.facts[6] (\"fact-ttl\")": "e4da7477a5c6f176fc38426ea6feaad3dda6c00fb12014003489440aecc52d4e",
    "units[0].learn.facts[7] (\"fact-home\")": "a6f7e7fe3323ac1d60c2793b4605dd38a39dc21d76f76bd1d538c30fd7e1fa75",
    "units[0].learn.facts[8] (\"fact-no-route\")": "97d47055e5221e5d6410b11f2e9200cf64be4e2e57292ac76a6b452918c22816",
    "units[0].learn.facts[9] (\"fact-gateway-name\")": "720985e07dd9564f642f0107327486ee6ddf1508edce7fb9e8f4778fcbe66b1c",
    "units[0].practice[0].options[0] (question \"where-first\")": "f2d38bc28e59a5dce4afb442537cd365e5868222cdd7069db6873727e19b3776",
    "units[0].practice[0].options[1] (question \"where-first\")": "e62e8c34cbab10ff899eb4a9513ad5a4801ada6d89ed4acf5c4081e54bb4722b",
    "units[0].practice[0].options[2] (question \"where-first\")": "f61f24c9e50ea4c8ffeffa0f2032d8b396b221495d61b650eb5f0c8c368ffeda",
    "units[0].practice[1].options[0] (question \"which-route\")": "791141d0e61d18ba8709fd9d5e52805ba5b76bc39170a44bbe7342813d2d7d14",
    "units[0].practice[1].options[1] (question \"which-route\")": "f67046ce9f4e7134c07954e328c538f9c45696fcdaa8734aac24f574146f5c74",
    "units[0].practice[1].options[2] (question \"which-route\")": "8e505261d3bdfd8c7694bc3aa2a9b11289a5c1130d964336e58c5d95e6e04dc3",
    "units[0].practice[2].options[0] (question \"no-route\")": "8f9077219dde886f4c9a26c15e3b6b58c6f00708d5f51d5767b71e41a90920a0",
    "units[0].practice[2].options[1] (question \"no-route\")": "eef62397f6558a047a0fcf19990adc8342d947296b46daa6ae1602e04c9a1221",
    "units[0].practice[2].options[2] (question \"no-route\")": "965c936dc46e71cd600f8e7450f8d4f1e7baf50f8af419d27f3c1d2de3b87d12",
    "units[0].practice[0].prompt (question \"where-first\")": "89221beb396c577b26bfb37edf9bf61692000a4ee01fe00e9c84c83ff3b24224",
    "units[0].practice[1].prompt (question \"which-route\")": "f097c7200ffa15cbddf9525dd2485b89ef491b87a5dab1f15d8e61b7ca34ede7",
    "units[0].practice[2].prompt (question \"no-route\")": "e577acc35eca82724cd953b87b6c82771ad8791e18e73f22325bfa3356f2c5f5"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: router

Checked 2026-11-14 against the claim sheet printed for this hash. Every source was fetched in this run from its publisher (RFCs as plain text from rfc-editor.org, the vendor pages as HTML from cisco.com, learn.microsoft.com and paloaltonetworks.com). 98 items pass and 2 are imprecise (`why-2` and `fact-home`): only one cited source says that a default route spares a router from listing every network, so the claim has no second confirmation.

## Claims

### units[0].osi — ✅

- `cisco-what-is-routing` §What are switches and routers?
  > A Layer 3 router uniquely identifies a device by a network-assigned IP address.
- `paloalto-layer-3-vs-7` §What is a layer 3 firewall (network firewall)?
  > A layer 3 firewall, also known as a network firewall, operates at the network layer of the OSI model—the same level as routers.
- Note: Two vendors (Cisco and Palo Alto Networks), on different sites, each put routers at layer 3, the network layer. Both pages are live and describe current practice. No standard places the router at an OSI layer, and the owner's rule allows a badge to rest on two vendors' pages.

### units[0].steps[0].deep[0] (step "near-or-far", Go deeper) — ✅

- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the address mask match the IP source address bits extracted by the same mask, then the destination is on the corresponding connected network, and the datagram is to be transmitted directly to the destination host.
- Note: RFC 1122 is the defining standard for how a host makes this local/remote decision (§3.3.1.1 is the algorithm a host must use). It is not obsoleted. Its nine updating RFCs cover TCP, MPLS, BFD, TOS, Source Quench and the IPv4 ID field, and none of them changes this section.
- Note: The lesson's "subnet mask" is the source's "address mask". It leaves out the special cases for broadcast and multicast destinations.

### units[0].steps[1].deep[0] (step "one-way-out", Go deeper) — ✅

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address and relevant interface of the next-hop router or (for the final hop) the destination host.
- `rfc-1812` §5.2.4
  > Next Hop Address - the IP address of the adjacent host or router to which the packet should be sent next
- Note: RFC 1812 is the defining standard for IPv4 router forwarding. §5.2.4 defines the next hop address. It is not obsoleted. Its two updates (RFC 2644, directed broadcasts, and RFC 6633, Source Quench) do not touch next-hop selection.

### units[0].steps[2].deep[0] (step "most-specific", Go deeper) — ✅

- `rfc-1812` §5.2.4.3
  > This rule discards all routes from the set of candidates except those for which the most significant route.length bits of route.dest and ip.dest are equal.
- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there are no explicit routes. It is by definition the route whose prefix length is zero.
- Note: RFC 1812 §5.2.4.3 is the defining standard for the route lookup (its Basic Match rule). A prefix length of zero compares no bits, so the default route fits every destination. The RFC is current, as noted above.

### units[0].steps[3].deep[0] (step "hop-by-hop", Go deeper) — ✅

- `rfc-1812` §5.2.1.2
  > The forwarder determines the Link Layer address of the packet's next hop.
- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the fragments thereof) in an appropriate Link Layer frame and queues it for output on the interface selected in step 5.
- Note: RFC 1812 §5.2.1.2 is the defining standard for a router's unicast forwarding steps. Steps 10 and 11 are these two. The RFC is current.

### units[0].steps[4].deep[0] (step "no-route", Go deeper) — ✅

- `rfc-1812` §4.3.2.8
  > A router SHOULD also be able to limit the rate at which it sends other sorts of ICMP error messages (Destination Unreachable, Redirect, Time Exceeded, Parameter Problem).
- Note: RFC 1812 is the defining standard for the ICMP behaviour of IPv4 routers, and this section defines the rate limiting. RFC 6633 updates this section only for Source Quench, which is not this claim.

### units[0].learn.lead[0] ("lead-1") — ✅

- `rfc-1122` §3.3.1
  > The IP layer chooses the correct next hop for each datagram it sends. If the destination is on a connected network, the datagram is sent directly to the destination host; otherwise, it has to be routed to a gateway on a connected network.
- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address and relevant interface of the next-hop router or (for the final hop) the destination host.
- Note: These are the defining standards for host routing (RFC 1122) and router forwarding (RFC 1812), and both are current. The claim covers the ordinary case of a packet bound for another network. It leaves out that a packet for the laptop's own network goes there directly, which `steps[0].deep[0]` teaches.

### units[0].learn.terms[0] ("term-router") — ✅

- `rfc-1812` §2.2.3
  > In the Internet model, constituent networks are connected together by IP datagram forwarders which are called routers or IP routers.
- `rfc-1812` §2.2.3
  > A router connects to two or more logical interfaces, represented by IP subnets or unnumbered point to point lines
- `rfc-791` §2.4
  > Gateways implement internet protocol to forward datagrams between networks.
- Note: RFC 1812 defines the IPv4 router. RFC 791 defines IP and uses the older word "gateway" for the same device, as RFC 1812 §2.2.3 also says. Both are current: RFC 791's three updates (the ID field, TOS and the DS field) do not touch this section.

### units[0].learn.terms[1] ("term-gateway") — ✅

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a particular destination, the host chooses a "default" gateway and sends the datagram to it.
- `microsoft-tcpip-subnetting` §Default gateways
  > In TCP/IP terms, a router that is specified on a host, which links the host's subnet to other networks, is called a default gateway.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: These are two independent sources: the defining standard for hosts, and Microsoft's current support article (updated 2026-02-12). The claim leaves out that a host may hold several default gateways or extra static routes.

### units[0].learn.terms[2] ("term-routing-table") — ✅

- `rfc-1812` §2.2.3
  > This choice, called relaying or forwarding depends upon a route database within the router. The route database is also called a routing table or forwarding table.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- `cisco-how-router-works` §Creating a routing table
  > A routing table, which is stored on your router, is a list of all possible paths in your network.
- Note: RFC 1812 is the defining standard and Cisco is an independent second source. Both are current. The lesson's "list of networks" is a plain wording: the table also holds host routes and a default route.

### units[0].learn.terms[3] ("term-route") — ✅

- `rfc-1812` §5.2.4.3
  > More precisely, we assume that each route has a destination attribute, called route.dest and a corresponding prefix length, called route.length, to specify which bits of route.dest are significant.
- `rfc-4632` §3.1
  > In CIDR notation, a prefix is shown as a 4-octet quantity, just like a traditional IPv4 address or network number, followed by the "/" (slash) character, followed by a decimal value between 0 and 32 that describes the number of significant bits.
- `microsoft-route` §Parameters
  > Specifies the forwarding or next hop IP address over which the set of addresses defined by the network destination and subnet mask are reachable.
- Note: RFC 1812 defines the route lookup and RFC 4632 (Best Current Practice, not obsoleted) defines the prefix notation. Microsoft's current page shows a route as a destination, a mask and a next hop. A real route also carries a metric and an interface, which the claim leaves out.

### units[0].learn.terms[4] ("term-next-hop") — ✅

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address and relevant interface of the next-hop router or (for the final hop) the destination host.
- `rfc-1812` §5.2.4
  > Next Hop Address - the IP address of the adjacent host or router to which the packet should be sent next
- Note: RFC 1812 is the defining standard for the next hop address (§5.2.4) and is current.

### units[0].learn.terms[5] ("term-connected") — ✅

- `rfc-1812` §5.2.4.2
  > Compare the resulting network prefixes. If they are equal to each other, the packet can be transmitted through the corresponding network interface.
- `rfc-1812` §5.2.4.2
  > If the destination was neither the router-id of a neighbor on an unnumbered interface nor a member of a directly connected network prefix, the IP Destination is accessible only through some other router.
- `microsoft-route` §Parameters
  > For locally attached subnet routes, the gateway address is the IP address assigned to the interface that is attached to the subnet.
- Note: RFC 1812 §5.2.4.2 is the defining standard for a router's local/remote decision and is current. Microsoft's current page is an independent second source.

### units[0].learn.terms[6] ("term-default-route") — ✅

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there are no explicit routes. It is by definition the route whose prefix length is zero.
- `rfc-4632` §5.1
  > Note that the degenerate route to prefix 0.0.0.0/0 is used as a default route and MUST be accepted by all implementations.
- `cisco-gateway-last-resort` §Background Information
  > Default routes are used to direct packets addressed to networks not explicitly listed in the routing table.
- Note: RFC 1812 defines the default route in the lookup, and RFC 4632 names 0.0.0.0/0 as that route. Both are current, and Cisco's page (updated 2025-04-24) agrees.

### units[0].learn.terms[7] ("term-longest-match") — ✅

- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm examines the remaining routes to determine which among them have the largest route.length values. All except these are discarded.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- `cisco-route-selection` §Prefix Lengths
  > Longer prefixes are always preferred over shorter ones when forwarding a packet.
- Note: These are two defining standards and an independent vendor page (updated 2024-01-17), all current.

### units[0].learn.terms[8] ("term-ttl") — ✅

- `rfc-1122` §3.2.1.7
  > The TTL field has two functions: limit the lifetime of TCP segments (see RFC-793 [TCP:1], p. 28), and terminate Internet routing loops.
- `rfc-1812` §5.3.1
  > Since this is very often the case, the TTL is effectively a hop count limit on how far a datagram can propagate through the Internet.
- `rfc-1812` §5.3.1
  > Its hop count function is critical to ensuring that routing problems can't melt down the network by causing packets to loop infinitely in the network.
- Note: RFC 1122 and RFC 1812 are two independent defining standards for TTL handling by hosts and by routers. Both are current. On paper TTL is also a time in seconds, but it works as a hop count, and the claim calls it a hop counter.

### units[0].learn.terms[9] ("term-unreachable") — ✅

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all (including no default route) to the destination specified in the packet, then the router MUST generate a Destination Unreachable, Code 0 (Network Unreachable) ICMP message.
- `rfc-792` §Destination Unreachable Message, page 4
  > If, according to the information in the gateway's routing tables, the network specified in the internet destination field of a datagram is unreachable, e.g., the distance to the network is infinity, the gateway may send a destination unreachable message to the internet source host of the datagram.
- Note: RFC 792 defines the message and RFC 1812 defines when a router must send it. Both are current. RFC 792's updates (950, 4884, 6633, 6918) leave Destination Unreachable in force. The claim names the case this lesson teaches. It leaves out the message's other uses, such as host or port unreachable, and it does not say "only".

### units[0].learn.pattern ("pattern") — ✅

- `rfc-1812` §5.2.1
  > This is just a general outline, and omits important details, such as handling of congestion, that are dealt with in later sections.
- `rfc-1812` §5.2.1.1
  > The router examines the destination IP address of the IP datagram, as described in Section [5.2.3], to determine how it should continue to process the IP datagram.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- `rfc-1812` §5.2.1.2
  > The forwarder decrements (by at least one) and checks the packet's TTL, as described in Section [5.3.1].
- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the fragments thereof) in an appropriate Link Layer frame and queues it for output on the interface selected in step 5.
- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm examines the remaining routes to determine which among them have the largest route.length values. All except these are discarded.
- Note: RFC 1812 §5.2.1 is the defining standard for the forwarding algorithm and is current. The four names follow its order: read the destination, look up the route, decrement the TTL, send it out. "Every router … each packet" means each packet it forwards. Packets addressed to the router itself, header checks, options and fragmentation are left out, and the lesson calls this an outline.

### units[0].learn.why[0] ("why-1") — ✅

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address and relevant interface of the next-hop router or (for the final hop) the destination host.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram.
- Note: These are two defining standards, both current. The claim holds for ordinary IP forwarding. It leaves out source routing and path-steering techniques such as segment routing, which are not the ordinary case.

### units[0].learn.why[1] ("why-2") — ⚠️

- `cisco-gateway-last-resort` §Background Information
  > Default routes are invaluable in topologies where it is not desirable to learn all the more specific networks, as in case of stub networks, or not feasible due to limited system resources such as memory and limited resources.
- `rfc-1812` §2.3
  > If it is connected at only one point, a LAN is known as a stub network.
- `rfc-3022` §2.2
  > Say, an organization has a private IP network and a WAN link to a service provider.
- `rfc-3022` §2.2
  > This model fits the requirements of most Small Office Home Office (SOHO) groups to access external network using a single service provider assigned IP address.
- Note: The claim is true in the ordinary case, and no cited section contradicts it. All three sources are current: Cisco's page is live (updated 2025-04-24), RFC 1812 is not obsoleted, and RFC 3022 is an Informational RFC that is not obsoleted.
- Note: What is wrong: only Cisco says that a default route spares a router from learning every network, or that a stub network can do with one. RFC 1812 §2.3 only defines a stub network as one joined at a single point. RFC 3022 §2.2 only says a home or small office has one WAN link to its provider; its own example forwards by a specific static route, not a default route. Neither says anything about default routes, and neither is marked as a defining standard, so the claim lacks a second independent confirmation.

### units[0].learn.deep[0] ("deep-metric", Learn's Go deeper) — ✅

- `rfc-1812` §5.2.4.3
  > If route.domain is equal for the two routes and route.metric is strictly inferior for one when compared with the other, then the one with the inferior metric is discarded from the set.
- `microsoft-route` §Parameters
  > Specifies an integer cost metric (ranging from 1 to 9999) for the route, which is used when choosing among multiple routes in the routing table that most closely match the destination address of a packet being forwarded. The route with the lowest metric is chosen.
- Note: RFC 1812 (defining standard, current) applies Best Metric after Longest Match, and only between routes of the same routing domain, which the lesson words as "the same source". Microsoft's current page says the lowest metric wins among the closest matches. The claim leaves out the TOS rule and vendor policy, and that some protocols compare metrics in a more complex way.

### units[0].learn.deep[1] ("deep-sources", Learn's Go deeper) — ✅

- `rfc-1812` §2.2.3
  > The term "router" derives from the process of building this route database; routing protocols and configuration interact in a process called routing.
- `rfc-1812` §2.2.3
  > A router normally accomplishes this by participating in distributed routing and reachability algorithms with other routers.
- `rfc-1812` §7.4
  > Static routing provides a means of explicitly defining the next hop from a router for a particular destination. A router SHOULD provide a means for defining a static route to a destination, where the destination is defined by a network prefix.
- `rfc-1812` §5.2.4.2
  > If the destination was neither the router-id of a neighbor on an unnumbered interface nor a member of a directly connected network prefix, the IP Destination is accessible only through some other router.
- Note: RFC 1812 is the current defining standard for IPv4 routers. It defines static routes (§7.4), routing protocols (§2.2.3 and chapter 7) and the use of directly connected prefixes (§5.2.4.2). "Learns routes from the networks it is plugged into" is a plain wording: the RFC says a router reaches its connected prefixes directly.

### units[0].learn.deep[2] ("deep-nat", Learn's Go deeper) — ✅

- `rfc-3022` §2.2
  > However, NAPT translates the tuple of source address 10.0.0.10 and source TCP port 3017 in the IP and TCP headers into the globally unique 138.76.28.4 and a uniquely assigned TCP port, say 1024, before the packet is forwarded. Packets on the return path go through similar address and TCP port translations for the target IP address and target TCP port.
- `rfc-3022` §4.3
  > In order for NAT to be transparent to end-host, the IP address of the IP header embedded within the payload of ICMP-Error message must be modified
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device. NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `rfc-5508` §4.2.1
  > Modify the destination IP address of the outer IP header to be the same as the source IP address of the embedded packet after translation.
- Note: RFC 3022 and RFC 4787 are two independent RFCs saying the private address is swapped for a public one, and swapped back on return. RFC 3022 §4.3 and RFC 5508 §4.2.1 are two saying the same of ICMP error messages. None is obsoleted. RFC 4787 and RFC 5508 are updated by RFC 7857 (and RFC 4787 also by RFC 6888), but neither changes these sections. The claim leaves out the port translation and the IPv4-only scope.

### units[0].learn.facts[0] ("fact-defined") — ✅

- `rfc-1812` §1
  > This memo defines and discusses requirements for devices that perform the network layer forwarding function of the Internet protocol suite. The Internet community usually refers to such devices as IP routers or simply routers;
- Note: RFC 1812 defines the requirements for IPv4 routers. It is a Proposed Standard, not obsoleted, and its two updates do not change §1. Its full title is the one the fact gives.

### units[0].learn.facts[1] ("fact-osi") — ✅

- `cisco-what-is-routing` §What are switches and routers?
  > A Layer 3 router uniquely identifies a device by a network-assigned IP address.
- `paloalto-layer-3-vs-7` §What is a layer 3 firewall (network firewall)?
  > A layer 3 firewall, also known as a network firewall, operates at the network layer of the OSI model—the same level as routers.
- Note: Two independent vendors each place routers at layer 3, the network layer. Both pages are live.

### units[0].learn.facts[2] ("fact-host-table") — ✅

- `microsoft-route` §Introduction
  > Displays and modifies the entries in the local IP routing table.
- `microsoft-route` §Parameters
  > For locally attached subnet routes, the gateway address is the IP address assigned to the interface that is attached to the subnet.
- `microsoft-route` §Parameters
  > The destination can be an IP network address (where the host bits of the network address are set to 0), an IP address for a host route, or 0.0.0.0 for the default route.
- `microsoft-route` §Examples
  > To add a default route with the default gateway address of 192.168.12.1, type:
- `cisco-route-command` §Use the Route Command
  > In order to view the entire contents of the IP routing table, issue the route print command.
- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the datagram is sent directly to the destination host; otherwise, it has to be routed to a gateway on a connected network.
- `rfc-4632` §3.1
  > 0.0.0.0/0 4294967296 1 "default route"
- Note: Microsoft's route page (applies to Windows 11 and Windows Server 2025) and Cisco's route command note are two publishers that both show `route print` displaying a Windows host's routing table. RFC 1122 (defining standard, current) gives the direct-or-gateway rule those two rows carry out.
- Note: "Tiny" and the two rows are the ordinary picture. A real `route print` also lists loopback, multicast, broadcast and host routes, which the claim leaves out. Cisco's note was written for Windows NT, but the command it describes is still current.

### units[0].learn.facts[3] ("fact-default") — ✅

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there are no explicit routes. It is by definition the route whose prefix length is zero.
- `rfc-4632` §3.1
  > 0.0.0.0/0 4294967296 1 "default route"
- `rfc-4632` §5.1
  > Note that the degenerate route to prefix 0.0.0.0/0 is used as a default route and MUST be accepted by all implementations.
- Note: These are two defining standards, both current. RFC 4632's table gives 0.0.0.0/0 all 2^32 addresses, and RFC 1812 uses it only where no explicit route matches.

### units[0].learn.facts[4] ("fact-match") — ✅

- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm examines the remaining routes to determine which among them have the largest route.length values. All except these are discarded.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- `cisco-route-selection` §Prefix Lengths
  > Longer prefixes are always preferred over shorter ones when forwarding a packet.
- Note: These are two defining standards and an independent vendor page, all current.

### units[0].learn.facts[5] ("fact-hop") — ✅

- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- `cisco-how-router-works` §Creating a routing table
  > When routers receive IP packets that need to be forwarded somewhere else in the network, the router looks at the packet's destination IP address and then searches for the routing information in the routing table.
- Note: RFC 1812 is the defining standard and Cisco's live page is an independent second source.

### units[0].learn.facts[6] ("fact-ttl") — ✅

- `rfc-791` §1.4
  > It is set by the sender of the datagram and reduced at the points along the route where it is processed. If the time to live reaches zero before the internet datagram reaches its destination, the internet datagram is destroyed.
- `rfc-1122` §3.2.1.7
  > each gateway is required to reduce the TTL field by at least one.
- `rfc-1812` §5.3.1
  > When a router forwards a packet, it MUST reduce the TTL by at least one.
- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be discarded
- Note: These are three defining standards, all current. The claim leaves out the ICMP Time Exceeded message a router sends when it drops the packet.

### units[0].learn.facts[7] ("fact-home") — ⚠️

- `cisco-gateway-last-resort` §Background Information
  > Default routes are invaluable in topologies where it is not desirable to learn all the more specific networks, as in case of stub networks, or not feasible due to limited system resources such as memory and limited resources.
- `rfc-1812` §2.3
  > If it is connected at only one point, a LAN is known as a stub network.
- `rfc-3022` §2.2
  > Say, an organization has a private IP network and a WAN link to a service provider.
- `rfc-3022` §2.2
  > This model fits the requirements of most Small Office Home Office (SOHO) groups to access external network using a single service provider assigned IP address.
- Note: All three sources are current. The claim is true in the ordinary case, and no cited section contradicts it.
- Note: What is wrong: "has one way out, its link to your provider" is confirmed by RFC 3022 §2.2 together with RFC 1812 §2.3, but "so one default route covers everything outside" is stated only by Cisco. Neither RFC section mentions default routes, and neither is marked as a defining standard, so this part has no second independent confirmation.

### units[0].learn.facts[8] ("fact-no-route") — ✅

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all (including no default route) to the destination specified in the packet, then the router MUST generate a Destination Unreachable, Code 0 (Network Unreachable) ICMP message.
- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is empty (i.e., no routes were found), the packet MUST be discarded and an appropriate ICMP error generated
- `rfc-792` §Destination Unreachable Message, page 4
  > 0 = net unreachable;
- `rfc-792` §Summary of Message Types
  > 3 Destination Unreachable
- Note: RFC 792 defines the type and code values, and RFC 1812 defines when a router must drop the packet and send the message. Both are current. The claim leaves out rate limiting, which `steps[4].deep[0]` covers.

### units[0].learn.facts[9] ("fact-gateway-name") — ✅

- `rfc-1812` §2.2.3
  > Many older Internet documents refer to routers as gateways.
- Note: RFC 1812, the current defining standard for IPv4 routers, defines the term router in §2.2.3 and records the older name there.

### units[0].practice[0].options[0] (question "where-first") — ✅

- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the datagram is sent directly to the destination host; otherwise, it has to be routed to a gateway on a connected network.
- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a particular destination, the host chooses a "default" gateway and sends the datagram to it.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- `microsoft-route` §Examples
  > To add a default route with the default gateway address of 192.168.12.1, type:
- Note: 203.0.113.80 is outside 192.168.1.0/24, so this is the right answer, and its feedback is correct. Both sources are current.

### units[0].practice[0].options[1] (question "where-first") — ✅

- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the address mask match the IP source address bits extracted by the same mask, then the destination is on the corresponding connected network, and the datagram is to be transmitted directly to the destination host.
- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through a gateway.
- Note: RFC 1122 is the current defining standard for this decision. The option is correctly marked wrong, and the feedback's "only" is the RFC's own rule, quoted above.

### units[0].practice[0].options[2] (question "where-first") — ✅

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a particular destination, the host chooses a "default" gateway and sends the datagram to it.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: The option is correctly marked wrong, and the feedback is correct. It leaves out that the laptop may broadcast an ARP request to find the gateway's link address; the packet itself goes only to the gateway.

### units[0].practice[1].options[0] (question "which-route") — ✅

- `rfc-1812` §5.2.4.3
  > For example, if a packet's IP Destination Address is 10.144.2.5 and there are network prefixes 10.144.2.0/24, 10.144.0.0/16, and 10.0.0.0/8, then this rule would keep only the first (10.144.2.0/24) because its prefix length is longest.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- Note: This is the right answer and its feedback is correct. Both are current defining standards.

### units[0].practice[1].options[1] (question "which-route") — ✅

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there are no explicit routes. It is by definition the route whose prefix length is zero.
- Note: The option is correctly marked wrong. RFC 1812, the current defining standard, ranks the default route last. Its prefix length of zero is the shortest, and it covers only destinations with no explicit route.

### units[0].practice[1].options[2] (question "which-route") — ✅

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address and relevant interface of the next-hop router or (for the final hop) the destination host.
- `rfc-1812` §5.2.4.3
  > Normally, when the algorithm terminates there is exactly one route remaining in the set.
- Note: The option is correctly marked wrong. Even with load-splitting between equal routes, each unicast packet goes to one next hop.

### units[0].practice[2].options[0] (question "no-route") — ✅

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all (including no default route) to the destination specified in the packet, then the router MUST generate a Destination Unreachable, Code 0 (Network Unreachable) ICMP message.
- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is empty (i.e., no routes were found), the packet MUST be discarded and an appropriate ICMP error generated
- Note: This is the right answer and its feedback is correct, per RFC 1812, the current defining standard.

### units[0].practice[2].options[1] (question "no-route") — ✅

- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is empty (i.e., no routes were found), the packet MUST be discarded and an appropriate ICMP error generated
- `rfc-792` §Destination Unreachable Message, page 4
  > The internet header plus the first 64 bits of the original
- Note: The option is correctly marked wrong. The packet is discarded, and the ICMP message carries only the original header and the first 64 bits of data, so "short" is fair.

### units[0].practice[2].options[2] (question "no-route") — ✅

- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is empty (i.e., no routes were found), the packet MUST be discarded and an appropriate ICMP error generated
- Note: The option is correctly marked wrong, and the feedback is correct.

## Traced, example and unbacked parts

### title — ✅

- Note: "Router" makes no claim beyond the lesson.

### units[0].name — ✅

- Note: "Router" makes no claim beyond the lesson.

### backing (the lesson's subtitle and summary) — ✅

- Note: Traces to `term-router`, `term-routing-table`, `term-next-hop`, `fact-hop` and `why-1`, and says nothing beyond them.

### units[0].backing (the unit's full name and purpose) — ✅

- Note: Traces to `term-router`.

### units[0].scene.backing (the scene) — ✅

- Note: The addresses are example data (RFC 1918, RFC 5737). "Inside" and "outside" for the router's two addresses trace to `deep-nat`, and the panel and the legend trace to `term-routing-table`, `fact-host-table` and `fact-no-route`.

### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: Traces to `term-router`, `term-routing-table`, `term-next-hop`, `why-1` and `fact-home`. The part it repeats from `fact-home` (your home router is one of them) is the confirmed part of that fact.

### units[0].overview.backing (the Overview description) — ✅

- Note: "Many networks joined together" and "routers are the joins" restate `term-router`. "One hop closer" and the last router delivering restate `term-next-hop` and `fact-hop`.

### units[0].overview.facts[0] (Overview fact "Joins") — ✅

### units[0].overview.facts[1] (Overview fact "Each hop") — ✅

### units[0].overview.facts[2] (Overview fact "When nothing else fits") — ✅

### units[0].overview.facts[3] (Overview fact "No route at all") — ✅

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

### units[0].overview.facts[5] (Overview fact "Defined in") — ✅

### units[0].steps[0] (step "near-or-far") — ✅

- Note: The laptop's two-row table, the default gateway and the choice of the default route trace to `fact-host-table`, `term-gateway`, `term-default-route` and `fact-default`. The addresses are example data.

### units[0].steps[0].facts[0] (step "near-or-far", fact "Destination") — ✅

- Note: 203.0.113.80 is an RFC 5737 documentation address.

### units[0].steps[0].facts[1] (step "near-or-far", fact "On my network?") — ✅

### units[0].steps[0].facts[2] (step "near-or-far", fact "Route that fits") — ✅

### units[0].steps[0].facts[3] (step "near-or-far", fact "Next hop") — ✅

### units[0].steps[0].events[0] (event "s1-table") — ✅

### units[0].steps[0].events[1] (event "s1-match") — ✅

### units[0].steps[0].events[2] (event "s1-packet") — ✅

- Note: The TTL of 64 is a sample value the sender sets (`fact-ttl`). The lesson does not present it as a rule, and the log's addresses are example data.

### units[0].steps[1] (step "one-way-out") — ✅

- Note: Traces to `fact-hop`, `term-connected`, `term-default-route`, `fact-ttl`, `deep-nat` and `fact-home`. "Your home has one way out, so one route covers everything outside" repeats `fact-home` word for word and adds nothing to it. It passes the trace rule, but the claim it repeats is ⚠️ above and must be confirmed there.

### units[0].steps[1].facts[0] (step "one-way-out", fact "Connected") — ✅

### units[0].steps[1].facts[1] (step "one-way-out", fact "Route that fits") — ✅

### units[0].steps[1].facts[2] (step "one-way-out", fact "Source now") — ✅

### units[0].steps[1].events[0] (event "s2-table") — ✅

### units[0].steps[1].events[1] (event "s2-match") — ✅

### units[0].steps[1].events[2] (event "s2-packet") — ✅

### units[0].steps[2] (step "most-specific") — ✅

### units[0].steps[2].facts[0] (step "most-specific", fact "Routes that fit") — ✅

### units[0].steps[2].facts[1] (step "most-specific", fact "Winner") — ✅

### units[0].steps[2].facts[2] (step "most-specific", fact "Next hop") — ✅

### units[0].steps[2].events[0] (event "s3-table") — ✅

### units[0].steps[2].events[1] (event "s3-candidates") — ✅

### units[0].steps[2].events[2] (event "s3-winner") — ✅

### units[0].steps[2].events[3] (event "s3-packet") — ✅

### units[0].steps[3] (step "hop-by-hop") — ✅

- Note: "No router planned the whole trip … for this packet on its own" traces to `why-1`, and the TTL being lowered at each router traces to `fact-ttl`.

### units[0].steps[3].facts[0] (step "hop-by-hop", fact "Router b") — ✅

### units[0].steps[3].facts[1] (step "hop-by-hop", fact "Router c") — ✅

### units[0].steps[3].facts[2] (step "hop-by-hop", fact "Last next hop") — ✅

### units[0].steps[3].events[0] (event "s4-table") — ✅

### units[0].steps[3].events[1] (event "s4-to-c") — ✅

### units[0].steps[3].events[2] (event "s4-match") — ✅

### units[0].steps[3].events[3] (event "s4-delivered") — ✅

### units[0].steps[4] (step "no-route") — ✅

- Note: Dropping the packet, the network-unreachable message and its return through the router's public address trace to `fact-no-route`, `term-unreachable` and `deep-nat`.

### units[0].steps[4].facts[0] (step "no-route", fact "Router a’s table") — ✅

### units[0].steps[4].facts[1] (step "no-route", fact "The packet") — ✅

### units[0].steps[4].facts[2] (step "no-route", fact "The message") — ✅

### units[0].steps[4].facts[3] (step "no-route", fact "Back to") — ✅

### units[0].steps[4].events[0] (event "s5-table") — ✅

### units[0].steps[4].events[1] (event "s5-to-isp") — ✅

### units[0].steps[4].events[2] (event "s5-to-a") — ✅

### units[0].steps[4].events[3] (event "s5-nomatch") — ✅

### units[0].steps[4].events[4] (event "s5-drop") — ✅

### units[0].steps[4].events[5] (event "s5-icmp") — ✅

### units[0].practice[0].prompt (question "where-first") — ✅

- Note: The prompt uses example addresses, and its premise is sound.

### units[0].practice[1].prompt (question "which-route") — ✅

### units[0].practice[2].prompt (question "no-route") — ✅

## Sources

All checked 2026-11-14.

- `cisco-gateway-last-resort`: live on cisco.com, updated 2025-04-24. It describes current Cisco IOS default-route configuration. Current.
- `cisco-how-router-works`: live Cisco Learn explainer that describes current practice. Current.
- `cisco-route-command`: live on cisco.com (updated 2022-12-07). It was written for Windows NT with Cisco ICM, but the `route print` command it describes is current practice, as Microsoft's current page confirms. Current.
- `cisco-route-selection`: live on cisco.com, updated 2024-01-17. It describes current route selection. Current.
- `cisco-what-is-routing`: live Cisco Learn explainer. Current.
- `microsoft-route`: live on Microsoft Learn (updated 2023-02-03). It applies to Windows 11 and Windows Server 2025. Current.
- `microsoft-tcpip-subnetting`: live on Microsoft Learn, updated 2026-02-12. Current.
- `paloalto-layer-3-vs-7`: live Palo Alto Networks Cyberpedia explainer that describes current practice. Current.
- `rfc-1122`: the RFC Editor's info page lists no "Obsoleted by". It is updated by RFCs 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029 and 9293, none of which changes §3.2.1.7 or §3.3.1. Current.
- `rfc-1812`: not obsoleted. It is updated by RFC 2644 (directed broadcasts) and RFC 6633 (Source Quench), neither of which changes the cited sections. Current.
- `rfc-3022`: Informational, not obsoleted. Current.
- `rfc-4632`: Best Current Practice, not obsoleted, with no updates. Current.
- `rfc-4787`: Best Current Practice, not obsoleted. It is updated by RFC 6888 and RFC 7857, neither of which changes §3. Current.
- `rfc-5508`: Best Current Practice, not obsoleted. It is updated by RFC 7857, which does not change §4.2.1 (REQ-4). Current.
- `rfc-791`: not obsoleted. It is updated by RFCs 1349, 2474 and 6864, none of which changes §1.4 or §2.4. Current.
- `rfc-792`: not obsoleted. It is updated by RFCs 950, 4884, 6633 and 6918, which leave Destination Unreachable in force. Current.

## Limit overrides

None.
