```json fact-check
{
  "slug": "router",
  "hash": "b88e6305f5d7dbba0693bbbf4540ab1be3689f0f5594e8a18c8cd97a595e7431",
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
    "units[0].learn.why[1] (\"why-2\")": "✅",
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
    "units[0].learn.facts[7] (\"fact-home\")": "✅",
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
    "count": 109,
    "digest": "7ba6b7c649a4eed6ce2cc4c717d2ab59757c37ec605813962c522815ea3bc8db",
    "files": {
      "cisco-what-is-routing": "fcd8600e3c5f7c67146b56d076a3f2d3fe5e2fc5e4f82f177e4f84336efcc797",
      "paloalto-layer-3-vs-7": "8849d30fa1f285db3dd9abe1b015a9eda8ef019669d517f89dc38738fd5c5781",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "microsoft-tcpip-subnetting": "1c6cd5689711df14f1b84830cca7d1b1d8f120066d77d4696add5ee5bbd6e87a",
      "cisco-how-router-works": "500782315bdc2cc23b15a1f88468156c7295c708b7fd531d3b276756575ce586",
      "rfc-4632": "13694a39f586eb2054407780edccdf7c39332e57f067c8008bba4326bfc24fa9",
      "microsoft-route": "e78965846e64a169b1626bbec5df5053ac52c9b4dbcca0d7ec81e21c4622282e",
      "cisco-gateway-last-resort": "fd22850e077b9ebc68d204b974bf17175996c7cd070d36f423db2759825afec9",
      "cisco-route-selection": "62e6a53500c6f1b80a4e68cbb6d6d28142e32de82104378f9ab1774a2c5cd3f2",
      "rfc-792": "58714393ded142bacf188d7e8977eef98f4110c4c87ac94595f750df5664c2c6",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-5508": "89dd10c7b88610cec8c2a605e928822fd3c2e591a81382ed8c1c2ad2e26493d3",
      "cisco-route-command": "368f500dc9349e4e002c6c51e9f91acff0a9ebcbb5f51ce28fc3fc0df7fa3b47"
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
    "units[0].learn.why[1] (\"why-2\")": "f02a36e871af326d4ca06ce975067dbe0de9864dbeddc799c876e961c5d52081",
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
    "units[0].learn.facts[7] (\"fact-home\")": "bc80bbb9fa023eec097eab28ff3a21a805900e7cf3d4955b4dc995926b6e4330",
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

Checked on 2026-11-14 by a fresh fact-checker, from the claim sheet only. Every source was fetched in this run: the RFCs as plain text from the RFC Editor, the Microsoft and Palo Alto pages with curl, and the five Cisco pages (which refuse a command-line read) as text from the built-in browser.

## The claims

### units[0].osi — ✅

Layers: 3.

- `cisco-what-is-routing` §What are switches and routers?
  > A Layer 2 switch uniquely identifies a device by its MAC address. A Layer 3 router uniquely identifies a device by a network-assigned IP address.
- `paloalto-layer-3-vs-7` §What is a layer 3 firewall (network firewall)?
  > operates at the network layer of the OSI model—the same level as routers.
- Note: two vendors' explainer pages from different publishers each put the router at layer 3, the network layer. No standard places a protocol device on an OSI layer, and the owner's settled rule lets an OSI badge rest on two vendors' pages. Both pages are live and describe current practice.

### units[0].steps[0].deep[0] (step "near-or-far", Go deeper) — ✅

"The laptop compares the destination with its own address and subnet mask. If the bits the mask picks out match, the destination is on its own network and the packet goes straight there."

- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the address mask
  > match the IP source address bits extracted by the same mask, then
  > the destination is on the corresponding connected network, and the
  > datagram is to be transmitted directly to the destination host.
- Note: RFC 1122 is the defining standard for host behaviour; §3.3.1.1 defines the host's local/remote decision. It is an Internet Standard, not obsoleted; its updates (TCP, the IPv4 ID field, TOS, Source Quench, MPLS) do not touch this section.
- Note: leaves out the special cases for broadcast and multicast destinations.

### units[0].steps[1].deep[0] (step "one-way-out", Go deeper) — ✅

"A route's next hop is the next router, or, when the destination is on a network the router is plugged into, the destination itself."

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address
  > and relevant interface of the next-hop router or (for the final hop)
  > the destination host.
- `rfc-1812` §5.2.4
  > Next Hop Address - the IP address of the adjacent host or router to
  > which the packet should be sent next
- Note: RFC 1812 is the defining standard for IPv4 routers; §2.2.3 and §5.2.4 define the router's next-hop choice. It is not obsoleted; its two updates (RFC 2644, directed broadcasts; RFC 6633, Source Quench) do not touch next-hop selection.

### units[0].steps[2].deep[0] (step "most-specific", Go deeper) — ✅

"A route fits when the first bits of the destination, as many as the route's prefix length, are the same as the route's network. The default route has length 0, so it fits every address."

- `rfc-1812` §5.2.4.3
  > This rule discards
  > all routes from the set of candidates except those for which
  > the most significant route.length bits of route.dest and
  > ip.dest are equal.
- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there
  > are no explicit routes. It is by definition the route whose
  > prefix length is zero.
- Note: RFC 1812 §5.2.4.3 defines the router's route lookup (the Basic Match rule and the default route). Not obsoleted; current.

### units[0].steps[3].deep[0] (step "hop-by-hop", Go deeper) — ✅

"Before passing the packet on, a router finds the link-layer address of the next hop and puts the packet in a new frame for that link."

- `rfc-1812` §5.2.1.2
  > The forwarder determines the Link Layer address of the packet's
  > next hop.
- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the
  > fragments thereof) in an appropriate Link Layer frame and queues
  > it for output on the interface selected in step 5.
- Note: RFC 1812 §5.2.1.2 defines the unicast forwarding steps. Not obsoleted; current.

### units[0].steps[4].deep[0] (step "no-route", Go deeper) — ✅

"A router can limit how many error messages like this it sends."

- `rfc-1812` §4.3.2.8
  > A router
  > SHOULD also be able to limit the rate at which it sends other sorts
  > of ICMP error messages (Destination Unreachable, Redirect, Time
  > Exceeded, Parameter Problem).
- Note: RFC 1812 §4.3.2.8 defines the router's ICMP rate limiting. RFC 6633 updates RFC 1812 only to deprecate Source Quench; the rate limit on Destination Unreachable stands.

### units[0].learn.lead[0] ("lead-1") — ✅

"A packet from your laptop goes to your router, then router by router, and each router only chooses where to send it next."

- `rfc-1122` §3.3.1
  > The IP layer chooses the correct next hop for each datagram it
  > sends. If the destination is on a connected network, the
  > datagram is sent directly to the destination host; otherwise,
  > it has to be routed to a gateway on a connected network.
- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address
  > and relevant interface of the next-hop router or (for the final hop)
  > the destination host.
- Note: RFC 1122 defines the host's choice of next hop, RFC 1812 the router's. Both current.
- Note: speaks of the ordinary case, a destination outside the home network; a destination on the laptop's own network is reached directly, which the lesson teaches elsewhere.

### units[0].learn.terms[0] ("term-router") — ✅

"Router: A device that joins two or more networks and passes IP packets between them"

- `rfc-1812` §2.2.3
  > In the Internet model, constituent networks are connected together by
  > IP datagram forwarders which are called routers or IP routers.
- `rfc-1812` §2.2.3
  > A router connects to two or more logical interfaces, represented by
  > IP subnets or unnumbered point to point lines
- `rfc-791` §2.4
  > Gateways implement internet protocol to forward datagrams between
  > networks.
- Note: RFC 1812 defines IPv4 routers; RFC 791 defines IP, and its §2.4 defines the gateway's (router's) part in it. RFC 1812 §2.2.3 says older documents call routers gateways. Both current: RFC 791 is not obsoleted, and its updates (the ID field, TOS, the DS field) do not touch §2.4.

### units[0].learn.terms[1] ("term-gateway") — ✅

"Default gateway: The router your device sends to for anything outside its own network"

- `rfc-1122` §3.3.1.2
  > When there is no route cache entry for the destination host
  > address (and the destination is not on the connected …
  > network), the IP layer MUST pick a gateway from its list of
  > "default" gateways.
- `microsoft-tcpip-subnetting` §Default gateways
  > In TCP/IP terms, a router that is specified on a host, which links the host's subnet to other networks, is called a default gateway.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: RFC 1122 §3.3.1.2 defines the host's gateway selection. Microsoft's page is live, current documentation.
- Note: leaves out static routes and redirects that can send some traffic to another router; in the ordinary case everything off the local network goes to the default gateway.

### units[0].learn.terms[2] ("term-routing-table") — ✅

"Routing table: A router's list of networks, with where to send packets for each"

- `rfc-1812` §2.2.3
  > This choice, called relaying or forwarding
  > depends upon a route database within the router. The route database
  > is also called a routing table or forwarding table.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet,
  > usually by looking up the packet's destination in the router's
  > routing table.
- `cisco-how-router-works` §Creating a routing table
  > A routing table, which is stored on your router, is a list of all possible paths in your network.
- Note: RFC 1812 defines the router's route database and its use in forwarding. Cisco's explainer page is live.
- Note: "list of networks" is an everyday rendering of the route database; the lesson shows elsewhere that a laptop keeps one too, which this definition does not rule out.

### units[0].learn.terms[3] ("term-route") — ✅

"Route: One row: a network, written as a prefix like 203.0.113.0/24, and its next hop"

- `rfc-1812` §5.2.4.3
  > More precisely, we assume that each route has a destination
  > attribute, called route.dest and a corresponding prefix
  > length, called route.length, to specify which bits of
  > route.dest are significant.
- `rfc-4632` §3.1
  > In CIDR notation, a prefix is shown as a 4-octet
  > quantity, just like a traditional IPv4 address or network number,
  > followed by the "/" (slash) character, followed by a decimal value
  > between 0 and 32 that describes the number of significant bits.
- `microsoft-route` §Parameters
  > Specifies the forwarding or next hop IP address over which the set of addresses defined by the network destination and subnet mask are reachable.
- Note: RFC 1812 defines a route's parts in forwarding; RFC 4632 (BCP 122, not obsoleted, no updates) defines prefix notation. Microsoft's page is live and applies to current Windows.

### units[0].learn.terms[4] ("term-next-hop") — ✅

"Next hop: Where the packet goes next: the next router, or on the last hop the destination itself"

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address
  > and relevant interface of the next-hop router or (for the final hop)
  > the destination host.
- `rfc-1812` §5.2.4
  > Next Hop Address - the IP address of the adjacent host or router to
  > which the packet should be sent next
- Note: RFC 1812 defines the next hop. Current.

### units[0].learn.terms[5] ("term-connected") — ✅

"Directly connected: A network the router is plugged straight into; it delivers to devices there directly"

- `rfc-1812` §5.2.4.2
  > Compare the resulting network prefixes. If they are equal to
  > each other, the packet can be transmitted through the
  > corresponding network interface.
- `rfc-1812` §5.2.4.2
  > If the destination was neither the router-id of a neighbor on an
  > unnumbered interface nor a member of a directly connected network
  > prefix, the IP Destination is accessible only through some other
  > router.
- `microsoft-route` §Parameters
  > For locally attached subnet routes, the gateway address is the IP address assigned to the interface that is attached to the subnet.
- Note: RFC 1812 §5.2.4.2 defines the router's local/remote decision. "Plugged straight into" is an everyday word for a network on one of the router's own interfaces.

### units[0].learn.terms[6] ("term-default-route") — ✅

"Default route: The route that matches every address, 0.0.0.0/0, used when nothing more specific does"

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there
  > are no explicit routes. It is by definition the route whose
  > prefix length is zero.
- `rfc-4632` §5.1
  > Note that the degenerate route to
  > prefix 0.0.0.0/0 is used as a default route and MUST be accepted by
  > all implementations.
- `cisco-gateway-last-resort` §Background Information
  > Default routes are used to direct packets addressed to networks not explicitly listed in the routing table.
- Note: RFC 1812 defines the default route in lookup; RFC 4632 names 0.0.0.0/0 as it. Cisco's document is live (updated 2025).

### units[0].learn.terms[7] ("term-longest-match") — ✅

"Longest prefix match: When several routes match, the one with the longest prefix, the most specific, wins"

- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm
  > examines the remaining routes to determine which among them
  > have the largest route.length values. All except these are
  > discarded.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- `cisco-route-selection` §Prefix Lengths
  > Longer prefixes are always preferred over shorter ones when forwarding a packet.
- Note: RFC 1812 defines the Longest Match rule. Current.

### units[0].learn.terms[8] ("term-ttl") — ✅

"TTL: The hop counter that stops loops"

- `rfc-1122` §3.2.1.7
  > The TTL field has two functions: limit the lifetime of
  > TCP segments (see RFC-793 [TCP:1], p. 28), and
  > terminate Internet routing loops.
- `rfc-1812` §5.3.1
  > Its hop count function is critical
  > to ensuring that routing problems can't melt down the network by
  > causing packets to loop infinitely in the network.
- Note: RFC 1122 and RFC 1812 define how hosts and routers use the TTL field. Both current.
- Note: leaves out that TTL is formally a time in seconds; RFC 1812 says many implementations treat it as a pure hop count. "Stops loops" means it stops a packet from looping forever, as the sources say.

### units[0].learn.terms[9] ("term-unreachable") — ✅

"Destination unreachable: "I can't deliver this": the message sent back when no route matches"

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all
  > (including no default route) to the destination specified in the
  > packet, then the router MUST generate a Destination Unreachable, Code
  > 0 (Network Unreachable) ICMP message.
- `rfc-792` §Destination Unreachable Message, page 4
  > If, according to the information in the gateway's routing tables,
  > the network specified in the internet destination field of a
  > datagram is unreachable, e.g., the distance to the network is
  > infinity, the gateway may send a destination unreachable message
  > to the internet source host of the datagram.
- Note: RFC 792 defines the message; RFC 1812 defines when a router must send it. RFC 792 is not obsoleted; its updates (RFC 950, 4884, 6633, 6918) leave the Destination Unreachable message in force (RFC 6918 deprecates only other types).
- Note: leaves out the message's other uses (host, protocol or port unreachable, fragmentation needed); the definition does not say "only".

### units[0].learn.pattern ("pattern") — ✅

Names "Read the destination", "Find the route", "Lower the TTL", "Pass it on"; note "What every router does with each packet, in outline: the longest matching route picks the next hop."

- `rfc-1812` §5.2.1
  > This is just a general
  > outline, and omits important details, such as handling of congestion,
  > that are dealt with in later sections.
- `rfc-1812` §5.2.1.1
  > The router examines the destination IP address of the IP
  > datagram
- `rfc-1812` §5.2.1.2
  > The forwarder decrements (by at least one) and checks the
  > packet's TTL
- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the
  > fragments thereof) in an appropriate Link Layer frame and queues
  > it for output on the interface selected in step 5.
- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm
  > examines the remaining routes to determine which among them
  > have the largest route.length values.
- Note: RFC 1812 §5.2.1 defines the forwarding algorithm; its step (5) looks the destination up in the routing table, before the TTL step (7) and the send (11), so the order matches. "In outline" matches the source's own word.
- Note: leaves out header validation, options, fragmentation and packets addressed to the router itself.

### units[0].learn.why[0] ("why-1") — ✅

"No router has to plan the whole trip. Each one only picks the next hop, and it does that for every packet separately."

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address
  > and relevant interface of the next-hop router or (for the final hop)
  > the destination host.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent
  > entity unrelated to any other internet datagram.
- Note: RFC 1812 defines the router's next-hop forwarding; RFC 791 defines IP's datagram model. Both current.
- Note: leaves out source routing, a rare option in which the sender names the path.

### units[0].learn.why[1] ("why-2") — ✅

"A default route means a router doesn't need to list every network in the world. Your home has one way out, so your router needs only one route for everything outside."

- `cisco-gateway-last-resort` §Background Information
  > Default routes are invaluable in topologies where it is not desirable to learn all the more specific networks, as in case of stub networks, or not feasible due to limited system resources such as memory and limited resources.
- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there
  > are no explicit routes.
- `rfc-1812` §7.5.2
  > Since each of the
  > leaf networks has only one path in and out, the router can simply
  > send a default route to them.
- `rfc-1812` §2.3
  > If it is connected at only one point, a LAN
  > is known as a stub network.
- `rfc-3022` §2.2
  > This model fits the requirements of most Small Office Home Office
  > (SOHO) groups to access external network using a single service
  > provider assigned IP address.
- Note: confirmed by two independent sources, Cisco's document and RFC 1812; RFC 3022 places the single provider link in the home case.
- Note: leaves out homes with more than one connection to the outside, which are uncommon.

### units[0].learn.deep[0] ("deep-metric", Learn's Go deeper) — ✅

"Between equally long matches from the same source, a cost number, the metric, breaks the tie: the lowest wins."

- `rfc-1812` §5.2.4.3
  > If route.domain is equal for the two
  > routes and route.metric is strictly inferior for one when
  > compared with the other, then the one with the inferior metric
  > is discarded from the set.
- `microsoft-route` §Parameters
  > Specifies an integer cost metric (ranging from 1 to 9999) for the route, which is used when choosing among multiple routes in the routing table that most closely match the destination address of a packet being forwarded. The route with the lowest metric is chosen.
- Note: RFC 1812 §5.2.4.3 defines the Best Metric rule, applied after Longest Match, between routes of the same routing domain ("the same source"). Microsoft's current page states that the lowest metric wins among the closest matches. Confirmed by both.
- Note: leaves out the optional TOS rule, vendor policy, and load-sharing between routes with equal metrics.

### units[0].learn.deep[1] ("deep-sources", Learn's Go deeper) — ✅

"A router learns routes from the networks it is plugged into, from routes an administrator types in, and from routing protocols that routers use to tell each other what they can reach."

- `rfc-1812` §2.2.3
  > The term
  > "router" derives from the process of building this route database;
  > routing protocols and configuration interact in a process called
  > routing.
- `rfc-1812` §2.2.3
  > A router normally
  > accomplishes this by participating in distributed routing and
  > reachability algorithms with other routers.
- `rfc-1812` §7.4
  > Static routing provides a means of explicitly defining the next hop
  > from a router for a particular destination.
- `rfc-1812` §5.2.4.2
  > If the destination was neither the router-id of a neighbor on an
  > unnumbered interface nor a member of a directly connected network
  > prefix, the IP Destination is accessible only through some other
  > router.
- Note: RFC 1812 defines how a router's route database is built: configuration (static routes, §7.4), routing protocols (§2.2.3), and the prefixes of its own interfaces (§5.2.4.2). Current.

### units[0].learn.deep[2] ("deep-nat", Learn's Go deeper) — ✅

"Your home router also swaps the laptop's private address for its own public one on the way out, and back on anything that returns, error messages included."

- `rfc-3022` §2.2
  > However, NAPT translates the tuple of source
  > address 10.0.0.10 and source TCP port 3017 in the IP and TCP headers
  > into the globally unique 138.76.28.4 and a uniquely assigned TCP
  > port, say 1024, before the packet is forwarded. Packets on the
  > return path go through similar address and TCP port translations for
  > the target IP address and target TCP port.
- `rfc-3022` §4.3
  > Changes to ICMP error message ([ICMP]) will include changes to IP and
  > ICMP headers on the outer layer as well as changes to headers of the
  > packet embedded within the ICMP-error message payload.
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device. NAPT allows
  > multiple internal hosts to share a single public IP address
  > simultaneously.
- `rfc-5508` §4.2.1
  > Modify the destination IP address of the outer IP header to
  > be the same as the source IP address of the embedded packet
  > after translation.
- Note: two independent documents confirm it: RFC 3022 (Informational, not obsoleted, no updates) and RFC 4787 / RFC 5508 (BCPs, not obsoleted; their update RFC 7857 refines timeouts and hairpinning and leaves error translation in force). RFC 3022 §2.2 places the router's own WAN address as the shared public one in the home (SOHO) case.
- Note: leaves out the port translation, IPv6 (usually without NAT), and carrier-grade NAT, where the router's outside address is itself shared.

### units[0].learn.facts[0] ("fact-defined") — ✅

"Defined in: RFC 1812, Requirements for IP Version 4 Routers"

- `rfc-1812` §1
  > This memo defines and discusses requirements for devices that perform
  > the network layer forwarding function of the Internet protocol suite.
  > The Internet community usually refers to such devices as IP routers or
  > simply routers
- Note: RFC 1812 is the current document that defines IPv4 router requirements: Proposed Standard, not obsoleted, updated only by RFC 2644 and RFC 6633.

### units[0].learn.facts[1] ("fact-osi") — ✅

"OSI layer: 3, network"

- `cisco-what-is-routing` §What are switches and routers?
  > A Layer 3 router uniquely identifies a device by a network-assigned IP address.
- `paloalto-layer-3-vs-7` §What is a layer 3 firewall (network firewall)?
  > operates at the network layer of the OSI model—the same level as routers.
- Note: two vendors' explainer pages from different publishers put routers at layer 3, the network layer. Both live.

### units[0].learn.facts[2] ("fact-host-table") — ✅

"On your laptop: a tiny routing table: its own network, reached directly, and a default route to the gateway; route print shows it on Windows"

- `microsoft-route` §Introduction
  > Displays and modifies the entries in the local IP routing table.
- `microsoft-route` §Examples
  > To display the entire contents of the IP routing table, type:
- `microsoft-route` §Parameters
  > The destination can be an IP network address (where the host bits of the network address are set to 0), an IP address for a host route, or 0.0.0.0 for the default route.
- `microsoft-route` §Parameters
  > For locally attached subnet routes, the gateway address is the IP address assigned to the interface that is attached to the subnet. For remote routes, available across one or more routers, the gateway address is a directly reachable IP address that is assigned to a neighboring router.
- `cisco-route-command` §Use the Route Command
  > In order to view the entire contents of the IP routing table, issue the route print command.
- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the
  > datagram is sent directly to the destination host; otherwise,
  > it has to be routed to a gateway on a connected network.
- `rfc-4632` §3.1
  > 0.0.0.0/0 4294967296 1 "default route"
- Note: RFC 1122 defines the host's routing decision; Microsoft (current, applies to Windows 11) and Cisco (a different publisher) each state that route print shows the table.
- Note: "tiny" and the two rows describe the routes that matter; a real `route print` also lists housekeeping rows (loopback, multicast, broadcast and host routes), which the claim leaves out.

### units[0].learn.facts[3] ("fact-default") — ✅

"Default route: 0.0.0.0/0: matches every address, so it's used only when nothing more specific matches"

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there
  > are no explicit routes. It is by definition the route whose
  > prefix length is zero.
- `rfc-4632` §3.1
  > 0.0.0.0/0 4294967296 1 "default route"
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- Note: RFC 1812 defines the default route in lookup; RFC 4632's table gives 0.0.0.0/0 as one block of all 2^32 addresses, named the default route. With longest match, any longer matching route beats it.

### units[0].learn.facts[4] ("fact-match") — ✅

"Which route wins: the longest matching prefix"

- `rfc-1812` §5.2.4.3
  > For example, if a packet's IP Destination Address is
  > 10.144.2.5 and there are network prefixes 10.144.2.0/24,
  > 10.144.0.0/16, and 10.0.0.0/8, then this rule would keep only
  > the first (10.144.2.0/24) because its prefix length is
  > longest.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- `cisco-route-selection` §Prefix Lengths
  > Longer prefixes are always preferred over shorter ones when forwarding a packet.
- Note: RFC 1812 defines the Longest Match rule. Leaves out the tie-breakers after it (taught in deep-metric).

### units[0].learn.facts[5] ("fact-hop") — ✅

"Each router: reads the destination, picks the next hop from its routing table, and passes the packet on"

- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet,
  > usually by looking up the packet's destination in the router's
  > routing table.
- `cisco-how-router-works` §Creating a routing table
  > When routers receive IP packets that need to be forwarded somewhere else in the network, the router looks at the packet's destination IP address and then searches for the routing information in the routing table.
- Note: RFC 1812 §5.2.1.2 defines the forwarding steps. Cisco's page is live.

### units[0].learn.facts[6] ("fact-ttl") — ✅

"TTL: set by the sender; each router takes at least 1 off, and at 0 the packet is dropped"

- `rfc-791` §1.4
  > It is set by the sender of the datagram and
  > reduced at the points along the route where it is processed. If the
  > time to live reaches zero before the internet datagram reaches its
  > destination, the internet datagram is destroyed.
- `rfc-1122` §3.2.1.7
  > since each gateway is required to reduce the TTL
  > field by at least one.
- `rfc-1812` §5.3.1
  > When a router forwards a packet, it MUST reduce the TTL by at least
  > one.
- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be
  > discarded
- Note: RFC 791 defines the TTL field; RFC 1812 defines the router's handling. All current. Leaves out the Time Exceeded message the router sends back.

### units[0].learn.facts[7] ("fact-home") — ✅

"Your home router: has one way out, its link to your provider, so one default route covers everything outside"

- `cisco-gateway-last-resort` §Background Information
  > Default routes are invaluable in topologies where it is not desirable to learn all the more specific networks, as in case of stub networks
- `rfc-1812` §7.5.2
  > Since each of the
  > leaf networks has only one path in and out, the router can simply
  > send a default route to them.
- `rfc-1812` §2.3
  > If it is connected at only one point, a LAN
  > is known as a stub network.
- `rfc-3022` §2.2
  > Say, an organization has a private IP network and a WAN link to a
  > service provider.
- Note: confirmed by Cisco's document and RFC 1812, two independent sources; RFC 3022 §2.2 places the provider link in the home (SOHO) case.
- Note: leaves out homes with a second connection (a backup line), which are uncommon.

### units[0].learn.facts[8] ("fact-no-route") — ✅

"No route at all: a router with no route, not even a default route, drops the packet and sends back an ICMP destination unreachable message (type 3, code 0: network unreachable)"

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all
  > (including no default route) to the destination specified in the
  > packet, then the router MUST generate a Destination Unreachable, Code
  > 0 (Network Unreachable) ICMP message.
- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is
  > empty (i.e., no routes were found), the packet MUST be discarded
  > and an appropriate ICMP error generated
- `rfc-792` §Destination Unreachable Message, page 4
  > 0 = net unreachable;
- `rfc-792` §Summary of Message Types
  > 3 Destination Unreachable
- Note: RFC 792 defines the message's type and code; RFC 1812 defines the router's duty to drop and send it. Current.
- Note: leaves out rate limiting (taught in the step's Go deeper) and routers configured not to send ICMP.

### units[0].learn.facts[9] ("fact-gateway-name") — ✅

"Why "gateway": older documents call routers gateways"

- `rfc-1812` §2.2.3
  > Many older Internet documents refer to routers as gateways.
- Note: RFC 1812 defines the router and its terminology. Current.

### units[0].practice[0].options[0] (question "where-first") — ✅

"To its default gateway, your router." (right) Feedback: "Right. 203.0.113.80 isn't on the laptop's own network, so only its default route matches, and that points at the gateway."

- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the
  > datagram is sent directly to the destination host; otherwise,
  > it has to be routed to a gateway on a connected network.
- `rfc-1122` §3.3.1.2
  > When there is no route cache entry for the destination host
  > address (and the destination is not on the connected …
  > network), the IP layer MUST pick a gateway from its list of
  > "default" gateways.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- `microsoft-route` §Examples
  > To add a default route with the default gateway address of 192.168.12.1, type:
- Note: 203.0.113.80 is outside 192.168.1.0/24, so the right answer is right. RFC 1122 defines the host's choice.

### units[0].practice[0].options[1] (question "where-first") — ✅

"Straight to 203.0.113.80." (wrong) Feedback: "Not quite. Only an address on the laptop's own network gets a packet directly. This one is outside it, so it goes to the gateway."

- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- Note: RFC 1122 §3.3.1.1 defines the host's local/remote decision. The option is wrong, as marked.

### units[0].practice[0].options[2] (question "where-first") — ✅

"To every device on the network at once." (wrong) Feedback: "Not quite. The laptop knows its default gateway, so it sends the packet to that one router."

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a
  > particular destination, the host chooses a "default"
  > gateway and sends the datagram to it.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: RFC 1122 defines the host's gateway selection. The option is wrong, as marked.

### units[0].practice[1].options[0] (question "which-route") — ✅

"Router b: 203.0.113.0/24 is the longer match." (right) Feedback: "Yes. Both routes match, and the most specific one, with the longest prefix, wins."

- `rfc-1812` §5.2.4.3
  > After performing Basic Match pruning, the algorithm
  > examines the remaining routes to determine which among them
  > have the largest route.length values. All except these are
  > discarded.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- Note: RFC 1812 defines the lookup. The right answer is right.

### units[0].practice[1].options[1] (question "which-route") — ✅

"Router a: the default route comes first." (wrong) Feedback: "Not quite. The default route matches everything, but its prefix is the shortest. It's only used when nothing more specific matches."

- `rfc-1812` §5.2.4.3
  > Default Route: This is a route to all networks for which there
  > are no explicit routes. It is by definition the route whose
  > prefix length is zero.
- Note: RFC 1812 defines the default route. The option is wrong, as marked.

### units[0].practice[1].options[2] (question "which-route") — ✅

"Both, one copy each." (wrong) Feedback: "Not quite. The router sends a packet to one next hop, the one the longest matching route names."

- `rfc-1812` §2.2.3
  > Forwarding an IP datagram generally requires the router to choose the address
  > and relevant interface of the next-hop router or (for the final hop)
  > the destination host.
- `rfc-1812` §5.2.4.3
  > Normally,
  > when the algorithm terminates there is exactly one route remaining in
  > the set.
- Note: RFC 1812 defines next-hop selection. Leaves out load-splitting between equal routes, which still sends each packet one way. The option is wrong, as marked.

### units[0].practice[2].options[0] (question "no-route") — ✅

"It drops the packet and sends the sender a destination unreachable message." (right) Feedback: "Right: network unreachable."

- `rfc-1812` §4.3.3.1
  > If a router cannot forward a packet because it has no routes at all
  > (including no default route) to the destination specified in the
  > packet, then the router MUST generate a Destination Unreachable, Code
  > 0 (Network Unreachable) ICMP message.
- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is
  > empty (i.e., no routes were found), the packet MUST be discarded
- Note: RFC 1812 defines the behaviour. The right answer is right.

### units[0].practice[2].options[1] (question "no-route") — ✅

"It sends the packet back to the sender." (wrong) Feedback: "Not quite. The packet is dropped; only a short ICMP message goes back."

- `rfc-1812` §5.2.4.3
  > If, after application of the pruning rules, the set of routes is
  > empty (i.e., no routes were found), the packet MUST be discarded
  > and an appropriate ICMP error generated
- `rfc-792` §Destination Unreachable Message, page 4
  > The internet header plus the first 64 bits of the original
  > datagram's data.
- Note: RFC 792 defines the message, which carries only the original header and its first 64 bits of data, so "short" holds. The option is wrong, as marked.

### units[0].practice[2].options[2] (question "no-route") — ✅

"It sends it to every router it knows, to be safe." (wrong) Feedback: "Not quite. A router doesn't guess: with no matching route, it drops the packet."

- `rfc-1812` §5.2.4.3
  > If the set ever becomes empty, the packet is discarded
  > because the destination is unreachable.
- Note: RFC 1812 defines the lookup. The option is wrong, as marked.

## Traced, example and analogy parts, and unbacked items

All are ✅.

- `title` — ✅
- `units[0].name` — ✅
- `backing (the lesson's subtitle and summary)` — ✅
- `units[0].backing (the unit's full name and purpose)` — ✅
- `units[0].scene.backing (the scene)` — ✅ (addresses are RFC 1918 and RFC 5737 example data; the labels and legend name only what the Learn parts teach)
- `units[0].overview.hookBacking (the Overview hook)` — ✅
- `units[0].overview.backing (the Overview description)` — ✅ ("the internet is many networks joined together, routers are the joins" restates term-router and lead-1; the last router delivering it restates term-next-hop)
- `units[0].overview.facts[0] (Overview fact "Joins")` — ✅
- `units[0].overview.facts[1] (Overview fact "Each hop")` — ✅
- `units[0].overview.facts[2] (Overview fact "When nothing else fits")` — ✅
- `units[0].overview.facts[3] (Overview fact "No route at all")` — ✅
- `units[0].overview.facts[4] (Overview fact "OSI layer")` — ✅
- `units[0].overview.facts[5] (Overview fact "Defined in")` — ✅
- `units[0].steps[0] (step "near-or-far")` — ✅
- `units[0].steps[0].facts[0] (step "near-or-far", fact "Destination")` — ✅ (example: 203.0.113.80, RFC 5737)
- `units[0].steps[0].facts[1] (step "near-or-far", fact "On my network?")` — ✅
- `units[0].steps[0].facts[2] (step "near-or-far", fact "Route that fits")` — ✅
- `units[0].steps[0].facts[3] (step "near-or-far", fact "Next hop")` — ✅
- `units[0].steps[0].events[0] (event "s1-table")` — ✅
- `units[0].steps[0].events[1] (event "s1-match")` — ✅
- `units[0].steps[0].events[2] (event "s1-packet")` — ✅ (the TTL values in the log, 64 down to 60, are example values: the sender sets one and each router takes 1 off, as fact-ttl says)
- `units[0].steps[1] (step "one-way-out")` — ✅
- `units[0].steps[1].facts[0] (step "one-way-out", fact "Connected")` — ✅
- `units[0].steps[1].facts[1] (step "one-way-out", fact "Route that fits")` — ✅
- `units[0].steps[1].facts[2] (step "one-way-out", fact "Source now")` — ✅
- `units[0].steps[1].events[0] (event "s2-table")` — ✅
- `units[0].steps[1].events[1] (event "s2-match")` — ✅
- `units[0].steps[1].events[2] (event "s2-packet")` — ✅
- `units[0].steps[2] (step "most-specific")` — ✅
- `units[0].steps[2].facts[0] (step "most-specific", fact "Routes that fit")` — ✅
- `units[0].steps[2].facts[1] (step "most-specific", fact "Winner")` — ✅
- `units[0].steps[2].facts[2] (step "most-specific", fact "Next hop")` — ✅
- `units[0].steps[2].events[0] (event "s3-table")` — ✅
- `units[0].steps[2].events[1] (event "s3-candidates")` — ✅
- `units[0].steps[2].events[2] (event "s3-winner")` — ✅
- `units[0].steps[2].events[3] (event "s3-packet")` — ✅
- `units[0].steps[3] (step "hop-by-hop")` — ✅
- `units[0].steps[3].facts[0] (step "hop-by-hop", fact "Router b")` — ✅
- `units[0].steps[3].facts[1] (step "hop-by-hop", fact "Router c")` — ✅
- `units[0].steps[3].facts[2] (step "hop-by-hop", fact "Last next hop")` — ✅
- `units[0].steps[3].events[0] (event "s4-table")` — ✅
- `units[0].steps[3].events[1] (event "s4-to-c")` — ✅
- `units[0].steps[3].events[2] (event "s4-match")` — ✅
- `units[0].steps[3].events[3] (event "s4-delivered")` — ✅
- `units[0].steps[4] (step "no-route")` — ✅
- `units[0].steps[4].facts[0] (step "no-route", fact "Router a’s table")` — ✅
- `units[0].steps[4].facts[1] (step "no-route", fact "The packet")` — ✅
- `units[0].steps[4].facts[2] (step "no-route", fact "The message")` — ✅
- `units[0].steps[4].facts[3] (step "no-route", fact "Back to")` — ✅
- `units[0].steps[4].events[0] (event "s5-table")` — ✅
- `units[0].steps[4].events[1] (event "s5-to-isp")` — ✅
- `units[0].steps[4].events[2] (event "s5-to-a")` — ✅
- `units[0].steps[4].events[3] (event "s5-nomatch")` — ✅
- `units[0].steps[4].events[4] (event "s5-drop")` — ✅
- `units[0].steps[4].events[5] (event "s5-icmp")` — ✅
- `units[0].practice[0].prompt (question "where-first")` — ✅
- `units[0].practice[1].prompt (question "which-route")` — ✅
- `units[0].practice[2].prompt (question "no-route")` — ✅

## Sources

All checked on 2026-11-14.

- `rfc-791` — RFC Editor info page: Internet Standard, not obsoleted; updated by RFC 1349, 2474 and 6864, none of which touches §1.4 or §2.4. Current.
- `rfc-792` — not obsoleted; updated by RFC 950, 4884, 6633 and 6918; RFC 6918 deprecates other ICMP types, not Destination Unreachable. Current.
- `rfc-1122` — not obsoleted; its nine updates (TCP, the ID field, TOS, Source Quench, MPLS, BFD) do not touch §3.2.1.7 or §3.3.1. Current.
- `rfc-1812` — Proposed Standard, not obsoleted; updated by RFC 2644 (directed broadcasts) and RFC 6633 (Source Quench), neither affecting the cited sections. Current.
- `rfc-3022` — Informational, not obsoleted, no updates. Describes current home NAT practice. Current.
- `rfc-4632` — BCP 122, not obsoleted, no updates. Current.
- `rfc-4787` — BCP 127, not obsoleted; updated by RFC 6888 and RFC 7857, which leave §3 standing. Current.
- `rfc-5508` — BCP 148, not obsoleted; updated by RFC 7857, which leaves error-message translation in force. Current.
- `cisco-gateway-last-resort` — Cisco TechNote, live, updated 24 April 2025; read in the browser (Cisco refuses a command-line read). Current.
- `cisco-how-router-works` — Cisco explainer page, live; read in the browser. Current.
- `cisco-route-command` — Cisco TechNote on the Windows route command, live, updated 7 December 2022; read in the browser. Its setting is an older product, but the route print command it describes is current (Microsoft's page applies it to Windows 11). Current.
- `cisco-route-selection` — Cisco TechNote, live, updated 17 January 2024; read in the browser. Current.
- `cisco-what-is-routing` — Cisco explainer page, live; read in the browser. Current.
- `microsoft-route` — Microsoft Learn, live, applies to Windows Server 2016–2025 and Windows 10/11. Current.
- `microsoft-tcpip-subnetting` — Microsoft Learn, live. Current.
- `paloalto-layer-3-vs-7` — Palo Alto Networks Cyberpedia explainer, live. Current.

## Limit overrides

None.
