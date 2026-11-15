```json fact-check
{
  "slug": "switch",
  "hash": "cbb707dce47983bae1e306df98d936046fbfce2e5a1edb534da1da199ce60107",
  "checked": "2026-11-15",
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
    "units[0].overview.facts[0] (Overview fact \"Learns from\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Known address\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Unknown address\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"no-match\")": "✅",
    "units[0].steps[0].facts[0] (step \"no-match\", fact \"Looking for\")": "✅",
    "units[0].steps[0].facts[1] (step \"no-match\", fact \"In the table\")": "✅",
    "units[0].steps[0].facts[2] (step \"no-match\", fact \"Sent out of\")": "✅",
    "units[0].steps[0].facts[3] (step \"no-match\", fact \"Kept by\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-frame\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-match\")": "✅",
    "units[0].steps[1] (step \"learns-the-sender\")": "✅",
    "units[0].steps[1].facts[0] (step \"learns-the-sender\", fact \"Learned from\")": "✅",
    "units[0].steps[1].facts[1] (step \"learns-the-sender\", fact \"On port\")": "✅",
    "units[0].steps[1].facts[2] (step \"learns-the-sender\", fact \"Set up by\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-add\")": "✅",
    "units[0].steps[2] (step \"straight-to-one-port\")": "✅",
    "units[0].steps[2].facts[0] (step \"straight-to-one-port\", fact \"Learned\")": "✅",
    "units[0].steps[2].facts[1] (step \"straight-to-one-port\", fact \"Found\")": "✅",
    "units[0].steps[2].facts[2] (step \"straight-to-one-port\", fact \"Sent out of\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-frame\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-add\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-match\")": "✅",
    "units[0].steps[3] (step \"to-everyone\")": "✅",
    "units[0].steps[3].facts[0] (step \"to-everyone\", fact \"Sent to\")": "✅",
    "units[0].steps[3].facts[1] (step \"to-everyone\", fact \"Sent out of\")": "✅",
    "units[0].steps[3].facts[2] (step \"to-everyone\", fact \"Kept by\")": "✅",
    "units[0].steps[3].facts[3] (step \"to-everyone\", fact \"Learned\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-frame\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-add\")": "✅",
    "units[0].steps[4] (step \"moved\")": "✅",
    "units[0].steps[4].facts[0] (step \"moved\", fact \"Laptop now on\")": "✅",
    "units[0].steps[4].facts[1] (step \"moved\", fact \"Learned from\")": "✅",
    "units[0].steps[4].facts[2] (step \"moved\", fact \"Sent out of\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-frame\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-update\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-match\")": "✅",
    "units[0].steps[0].deep[0] (step \"no-match\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"learns-the-sender\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"straight-to-one-port\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"to-everyone\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"moved\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "⚠️",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-switch\")": "✅",
    "units[0].learn.terms[1] (\"term-port\")": "✅",
    "units[0].learn.terms[2] (\"term-frame\")": "✅",
    "units[0].learn.terms[3] (\"term-table\")": "✅",
    "units[0].learn.terms[4] (\"term-learn\")": "✅",
    "units[0].learn.terms[5] (\"term-flood\")": "✅",
    "units[0].learn.terms[6] (\"term-broadcast\")": "✅",
    "units[0].learn.terms[7] (\"term-age\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "⚠️",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-hub\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-many\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-age\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-l3\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-start\")": "✅",
    "units[0].learn.facts[1] (\"fact-learn\")": "✅",
    "units[0].learn.facts[2] (\"fact-known\")": "✅",
    "units[0].learn.facts[3] (\"fact-unknown\")": "✅",
    "units[0].learn.facts[4] (\"fact-broadcast\")": "✅",
    "units[0].learn.facts[5] (\"fact-keep\")": "✅",
    "units[0].learn.facts[6] (\"fact-age\")": "✅",
    "units[0].learn.facts[7] (\"fact-move\")": "✅",
    "units[0].learn.facts[8] (\"fact-router\")": "✅",
    "units[0].learn.facts[9] (\"fact-wifi\")": "✅",
    "units[0].learn.facts[10] (\"fact-osi\")": "✅",
    "units[0].learn.facts[11] (\"fact-defined\")": "✅",
    "units[0].practice[0].options[0] (question \"unknown-tv\")": "✅",
    "units[0].practice[0].options[1] (question \"unknown-tv\")": "✅",
    "units[0].practice[0].options[2] (question \"unknown-tv\")": "✅",
    "units[0].practice[1].options[0] (question \"broadcast-ports\")": "✅",
    "units[0].practice[1].options[1] (question \"broadcast-ports\")": "✅",
    "units[0].practice[1].options[2] (question \"broadcast-ports\")": "⚠️",
    "units[0].practice[0].prompt (question \"unknown-tv\")": "✅",
    "units[0].practice[1].prompt (question \"broadcast-ports\")": "✅"
  },
  "sources": [
    { "id": "cisco-9300-mac-table", "current": true, "checked": "2026-11-15" },
    { "id": "cisco-arp-config", "current": true, "checked": "2026-11-15" },
    { "id": "cisco-network-switch-how", "current": true, "checked": "2026-11-15" },
    { "id": "cisco-unicast-flooding", "current": true, "checked": "2026-11-15" },
    { "id": "cloudflare-network-switch", "current": true, "checked": "2026-11-15" },
    { "id": "ieee-802-1q-2022", "current": true, "checked": "2026-11-15" },
    { "id": "ieee-eui-guidelines", "current": true, "checked": "2026-11-15" },
    { "id": "microsoft-ndis-packet-filter", "current": true, "checked": "2026-11-15" },
    { "id": "openbsd-man-bpf-4", "current": true, "checked": "2026-11-15" },
    { "id": "openbsd-man-bridge-4", "current": true, "checked": "2026-11-15" },
    { "id": "openbsd-man-ifconfig-8", "current": true, "checked": "2026-11-15" },
    { "id": "paloalto-l2-interface", "current": true, "checked": "2026-11-15" },
    { "id": "paloalto-layer-7", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-1812", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-4762", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-5556", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-826", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-894", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-9542", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-9724", "current": true, "checked": "2026-11-15" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-15",
    "count": 144,
    "digest": "ccb8417c5bbe00bd81975059a32d2c192d964abb6dd9b3f75136fd4bfe6ae341",
    "files": {
      "cisco-arp-config": "738be78fa71af76f27d7f640099dc4df6beb3cde754851248149fe2bef150ea6",
      "cloudflare-network-switch": "678cb5a1e1bfb7e050d92c1f835ed283fcced647488da1e446e36bd9ed21f58c",
      "paloalto-l2-interface": "80c501448f8536a3ecac50a49c3264dcbf47d0236d7bfd6b028e7e89a3c869e2",
      "cisco-unicast-flooding": "9066bbc7052efdb6b3f44891a99be3f0478d3906af50c7746096415ef9ac9dc2",
      "rfc-4762": "5c1f8ae4b6ae226f843c3bd56af3af3971c8bcf4ac55b10f0caaa7bc1f82bb57",
      "cisco-9300-mac-table": "32bc3759565c4eab6f6d07f3546aa78b5a4fa9cfc5a79913db76522d1a9a0fe7",
      "openbsd-man-ifconfig-8": "93242cab3a4e0ca1d61b1783c36c6b1739acf12ae5854f6724e49c9e86e35f90",
      "openbsd-man-bridge-4": "a84656c6d04a9e29497023c04a85949a9cee405bc47c55c1b9d5f6203428ac4a",
      "rfc-826": "01bc62fe6a37e90f1246ac43e8e145f1322b4ed1474836145c3da93d2bd3c8a6",
      "cisco-network-switch-how": "7adee58847ac835562e7ec0abfb1a34138fd50f1207ddea67e393e9776d4c417",
      "rfc-5556": "d6e7cda4329a883121d7d846b5f8da92b4f16a964c551c6be18663dba091bfca",
      "rfc-9542": "5c52f6cb6aacb1dea947a206bc8775ec8aaed52d74b92c600f1b1166d5c3c0f1",
      "rfc-894": "be88b9301e53f986aca3a0e55e488d1d79bae3f88fe3f257640397bc089e7035",
      "paloalto-layer-7": "cfae5f1921bcbe53846ad4515c59bd8c88c747ef94126335da875ba3e1a453da",
      "ieee-eui-guidelines": "2f0e6101d18f1e8bdaef5ccba8dd7f764843e4a9f275ecb93853a0d3f7f76da1",
      "microsoft-ndis-packet-filter": "aa5a72fd08c543643b6f9b62e7214dff13e82374d841ca85c153ff0e0e76dff4",
      "openbsd-man-bpf-4": "dd3de46dfe24267579feb2f1d9968c4b444ac36f4c19aaa1ecf341d53cb1d209",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "rfc-9724": "b0ad27b88fe2c18981558885cff56b523539a5d69784a5188887ab0fbb06095e",
      "ieee-802-1q-2022": "aa956b5122e4dbc2e314e3b7b3cfa3bb7396bbddf4da5c0c23c43d4b207fc3d7"
    }
  },
  "items": {
    "title": "3fb013adef7f96417a4aa62dd91cbf147a6b57fdd0e202c15a3e65a7d03d1fe5",
    "units[0].name": "0cb36a965a669a1d21bc352f6eeaaad865333b23cafbc9c7bee58041e6190e7b",
    "units[0].osi": "8b4373631a87dc10179b2311d9293de3908f881f6dc6f97f62fa688b69260426",
    "backing (the lesson's subtitle and summary)": "ad3f038dd036496786fd326ffe713696521bf38f374f69e4a895c840499862b8",
    "units[0].backing (the unit's full name and purpose)": "c74496b000fc00f1ae95d2056d7f56cdefaf6ea65b62fb7e98685c8f7a91fae5",
    "units[0].scene.backing (the scene)": "b75a0b25b657e2bdd153df270e52b408c2d9310917896d6e36c2dd2d31cd2015",
    "units[0].overview.hookBacking (the Overview hook)": "cc3b3cb660dfaf912dfac077661529279957c27cac104cc72c924e972a6e6940",
    "units[0].overview.backing (the Overview description)": "0f5efd632371a8255c8fb603875dae6fd1d39218d8ae1ea3328ca8f3ea910e0f",
    "units[0].overview.facts[0] (Overview fact \"Learns from\")": "569f678a6968f96d00670d24f1bbbea2c0e7efa32d25c27d0de1df56b8b28206",
    "units[0].overview.facts[1] (Overview fact \"Known address\")": "1260eac82eb71e107aaacb92e1dc7ece10a77a06ec40a3fbe6cc05daf519eddf",
    "units[0].overview.facts[2] (Overview fact \"Unknown address\")": "357454bbe1ee42737a6b13bb9a3dcefcb0e8548cacd844b952bc3ccb85942d99",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "85e7b8cdbae34cd153bbaf4ea3780bf0e0f4118673a0a858e1c51c6c77ed6502",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "189ef578c3bbbe5298693cd3bad42f94e1cf10283ec2dc2929466202933af897",
    "units[0].steps[0] (step \"no-match\")": "9b164d9f709ce742815b1c107fde8cd30773e9cb5123f88d27badd77dc6f22fd",
    "units[0].steps[0].facts[0] (step \"no-match\", fact \"Looking for\")": "e632f1c1e75977266dceaf9bd3c1bc9c65013f1e8e37c074e0b997ba9eb6bc55",
    "units[0].steps[0].facts[1] (step \"no-match\", fact \"In the table\")": "0f65ea7bf51154337304bd4bb3f66a36287dbf8c3811d026a819081ebc25dfed",
    "units[0].steps[0].facts[2] (step \"no-match\", fact \"Sent out of\")": "2f1765a7cdbc9f013555c4ea775c320cd2c6db835174c59a8a90b84bc4c1460e",
    "units[0].steps[0].facts[3] (step \"no-match\", fact \"Kept by\")": "ddec2b5666b45d3c6c2956388512328e1c0cc0aa67ca9777324ef8a95ed0b523",
    "units[0].steps[0].events[0] (event \"s1-frame\")": "2f6fbae9dc9ed640fbff0616f38332d5c3eebbeaf4c96234d92a0f2f2f114e73",
    "units[0].steps[0].events[1] (event \"s1-match\")": "448c5295e8d887911fef2d5318d9bc17ebb21574cc8543a67b1f22d49a1b163a",
    "units[0].steps[1] (step \"learns-the-sender\")": "e51ff9433314d7b644541ea7ef5c8da3d83e52d99bf1dc45006caafab85f41fd",
    "units[0].steps[1].facts[0] (step \"learns-the-sender\", fact \"Learned from\")": "9df724f005fe8e000dcfe04a7893070072854659adc26a52b9ebacf62433f9d7",
    "units[0].steps[1].facts[1] (step \"learns-the-sender\", fact \"On port\")": "2cbd0bfffe5e491de475f8adb6ca9a6409b0808ad18ded39b35b309a48e26dbf",
    "units[0].steps[1].facts[2] (step \"learns-the-sender\", fact \"Set up by\")": "e237734a9061032e1b3155019f27524f3775893a1c40ad700c1b6a344225e386",
    "units[0].steps[1].events[0] (event \"s2-add\")": "4b44850398f6f79a53003c9c71b8beead52314463a8aeff677ec10794c679f0a",
    "units[0].steps[2] (step \"straight-to-one-port\")": "96ea08f2ee4fdc4caff4b387d7ccc6e5520ccce341db2cf13da2020e90f17b9d",
    "units[0].steps[2].facts[0] (step \"straight-to-one-port\", fact \"Learned\")": "c30cf6a2e306f5cd7b90de2d90933dfbb053e6f926f45f51a76f86251b7dca7c",
    "units[0].steps[2].facts[1] (step \"straight-to-one-port\", fact \"Found\")": "b6d117deb94bfed431c580fee542f37a171238efdf01a459a6927dcadfb5c855",
    "units[0].steps[2].facts[2] (step \"straight-to-one-port\", fact \"Sent out of\")": "a2e791bc92e6e7f25f9dcecdd973b59daac84ff702ac12a4a6db3407294482a4",
    "units[0].steps[2].events[0] (event \"s3-frame\")": "97928100d2ad991a06d97ca35000a2841f98ef3c332187a1e249ef9a1e55d9ba",
    "units[0].steps[2].events[1] (event \"s3-add\")": "cad8399908925783d6c856d24e9729e5f05ba7704e45acb887d58beb95c49193",
    "units[0].steps[2].events[2] (event \"s3-match\")": "d876f3d9feae4a9512680770d3695be138eef5bced5d255a7eeb960294a6ccf3",
    "units[0].steps[3] (step \"to-everyone\")": "ccee9e468cf372715f245cb675c2e0691a846311f3d5302b28a83098179f0386",
    "units[0].steps[3].facts[0] (step \"to-everyone\", fact \"Sent to\")": "d95c329d341f3fc5570cd0ed710f2dc00f1dba9677d60ceed734d79c3a3d3cf6",
    "units[0].steps[3].facts[1] (step \"to-everyone\", fact \"Sent out of\")": "6dae529d6cc880f3af5ea2b77e92154f1468cf05c9758d51811fcf11285da582",
    "units[0].steps[3].facts[2] (step \"to-everyone\", fact \"Kept by\")": "e003e2f65516ae3b4d9c6081d6eaa261ec16dc59637c41e6450015a198914dfe",
    "units[0].steps[3].facts[3] (step \"to-everyone\", fact \"Learned\")": "67b6883ce69d471a225182c96a766b1f3b3bb593a7e09c5f36409a22785ecd51",
    "units[0].steps[3].events[0] (event \"s4-frame\")": "2b718ef36e53770b6674944b9e8656418ea16a885abfb8ea359b17a070916067",
    "units[0].steps[3].events[1] (event \"s4-add\")": "8ae61805415111595f813937ea0a47b7d3a8f4bed2b94387af7cba5818d0faea",
    "units[0].steps[4] (step \"moved\")": "8e7b532cf9280ae33638ddc7f11ad7c32468130db69fc7cc3c42772454230ca0",
    "units[0].steps[4].facts[0] (step \"moved\", fact \"Laptop now on\")": "40f8a08843177289b95b10e9e56621a9c9ee6bdeffad9bdcb4f52087dec5b3ee",
    "units[0].steps[4].facts[1] (step \"moved\", fact \"Learned from\")": "e1b1ad826000e0199f49f1ce38fbe887a620729264d7f811605f4d101d87ca01",
    "units[0].steps[4].facts[2] (step \"moved\", fact \"Sent out of\")": "8f0d4418b67cd9fe87832b142a4f640cdb3082709b4d0f02ba0b79023d3a78cf",
    "units[0].steps[4].events[0] (event \"s5-frame\")": "ca81e7d2aa3ee4d173e17ce6a6b8cafc6e13284914aff8c4a255d501c95179c5",
    "units[0].steps[4].events[1] (event \"s5-update\")": "3afd5af3419c2a11c0f408b8899cd5cda571449fad3b2e6e966157c3a5194f0c",
    "units[0].steps[4].events[2] (event \"s5-match\")": "fc389a6442da98252b441fee5a277d56d1b54da4a8571e308dc262c389acf741",
    "units[0].steps[0].deep[0] (step \"no-match\", Go deeper)": "c102b26273948ffd7f099aaf84519218ec6aa171184be1829ef3408efc1e8c26",
    "units[0].steps[1].deep[0] (step \"learns-the-sender\", Go deeper)": "e106d43f192e7dd151d904e18c4a87941763a17c6038aac13513442df8459310",
    "units[0].steps[2].deep[0] (step \"straight-to-one-port\", Go deeper)": "e7519ef16cb1bd872f2cc8ccb97fdfa143662276923aa6829e3b60baaf0b6c10",
    "units[0].steps[3].deep[0] (step \"to-everyone\", Go deeper)": "2ae723d742f8d68cce9f1519c6f5f870f1a66437968912885d6d5c76d48761c2",
    "units[0].steps[4].deep[0] (step \"moved\", Go deeper)": "8d62e93eceefc97446fd79da5f3ee744eb52b251f9563fc1f809cd323162f097",
    "units[0].learn.lead[0] (\"lead-1\")": "30df7dcbfdcb867db840fcbc21a34167d964b59f2fad0d3e47a27090ec190337",
    "units[0].learn.lead[1] (\"lead-2\")": "d2a31bcf96cee1f1780d0514e0d5d4d2ba4b954708908315fb035759990e243f",
    "units[0].learn.terms[0] (\"term-switch\")": "a96db7ae28277627b0688ab32f5dbb2b9903c0769f2f56c38e84c59420b45793",
    "units[0].learn.terms[1] (\"term-port\")": "1af48325c017a0e1e5c1df74e94c7435907d4fd7c709d703f6151850c1531765",
    "units[0].learn.terms[2] (\"term-frame\")": "bc90e7344e22b5802808d0f55a0dfe2a1a4d28e65d537d087e412c305eb22654",
    "units[0].learn.terms[3] (\"term-table\")": "e4a3dc0ab6958e4895874395afbaf0f85a265afa8207bcbea4326f1c7e38c4aa",
    "units[0].learn.terms[4] (\"term-learn\")": "1341c42487dc44d93d70b575c8b39bfaf81514cce2ca6047688e6375aa1d010d",
    "units[0].learn.terms[5] (\"term-flood\")": "c92d5111650c3b1a8517dae300913d41ca5365b69255089b30136dedbefd5631",
    "units[0].learn.terms[6] (\"term-broadcast\")": "d5ac315d412d371f5fadd87ea24942e7c8c8b301cdf976325e5b587883a326c9",
    "units[0].learn.terms[7] (\"term-age\")": "beacb437505faa7082e75614031e95db4ac47a324a441dd8793fa03ec7c06f8c",
    "units[0].learn.pattern (\"pattern\")": "91058ef809e88e392baefd278b794f18cc5856c27145a467a985065d6be41ceb",
    "units[0].learn.why[0] (\"why-1\")": "397b7dec54fe9e788e79e5b0aac0c0777774578241a81ffe66c238b3f3abbf19",
    "units[0].learn.why[1] (\"why-2\")": "28bda7e836778e605c71596895005cf4f3bf5d3d5d8052ecaadc92d7246d211d",
    "units[0].learn.deep[0] (\"deep-hub\", Learn's Go deeper)": "bb60438c4216d9c88e5abe3c177de91132b2da0d19e0504cb5c8860876384771",
    "units[0].learn.deep[1] (\"deep-many\", Learn's Go deeper)": "2924a4f56b2c0df5ad6554af1b76b1ad691f21a452b65730eb22a2a80a6b0c71",
    "units[0].learn.deep[2] (\"deep-age\", Learn's Go deeper)": "c65f12366d880c9d4e9f230b564cdd91b1fa573e05cc10f45e1ab8c5e75b3ba8",
    "units[0].learn.deep[3] (\"deep-l3\", Learn's Go deeper)": "6de193df84acaecd73afa7ae2db3b5ce3097d1ef295fb73157ced15d5ecdb7bb",
    "units[0].learn.facts[0] (\"fact-start\")": "f7f46e7500a516fecf384528510c94d37d64d69c094c4059b3dd686f054f97de",
    "units[0].learn.facts[1] (\"fact-learn\")": "aac819e8d7bd13454c49c7c7b60d44f2cca9c4dd421856c7a3a232c7ba921d5a",
    "units[0].learn.facts[2] (\"fact-known\")": "8fd9f550444827a8a126ac8be9e2524763800b3a3172fd48e2b3d7e185ef6e83",
    "units[0].learn.facts[3] (\"fact-unknown\")": "8a9ed7c00744cfcccf6ab2d474c9b996bdb645f5f535acbab5503e1d579d5222",
    "units[0].learn.facts[4] (\"fact-broadcast\")": "ca5ad5ff0baa0068fc43e94ce8f5b39c1f8a50c5dfc64c8b0ecb032365086e48",
    "units[0].learn.facts[5] (\"fact-keep\")": "cc6ee7559108f8ccfa602f061bc55f7fd9c79fdd7fcb163050cf601e2b3d3875",
    "units[0].learn.facts[6] (\"fact-age\")": "0c19f4845b6c3cd4653b91a0c88d6a14b89b5b673a490819726b8f59df299ab7",
    "units[0].learn.facts[7] (\"fact-move\")": "42f4ebb121f8db9382e42010d9a024fd8b6c44c7da299de24cf3979529c85e2f",
    "units[0].learn.facts[8] (\"fact-router\")": "94367d9c6a1e26f66ce9f8e386a97f176ac71ec0b493fbccebaa0addf3185260",
    "units[0].learn.facts[9] (\"fact-wifi\")": "227d2a0acde93c5eec09615f57122eb00d4d97463e2620901c1fa05044f77ab3",
    "units[0].learn.facts[10] (\"fact-osi\")": "210fbdb52d4da9b27a8c28ee45e329112e918ab12cb942c7a997d69e49cb8e7c",
    "units[0].learn.facts[11] (\"fact-defined\")": "398d0830f9611eae5eae30ec7d4847db6706e3afc9cba6a571c9818c416fae14",
    "units[0].practice[0].options[0] (question \"unknown-tv\")": "95801707b2ac3984062b547889c1dd49332e1f6fb588dce6db30fbf564c13b8f",
    "units[0].practice[0].options[1] (question \"unknown-tv\")": "b8efa089bc4b21a07f7f40d5d0fbf2a52a4c549c8df5a7ad6dcf9bf8c43fbd98",
    "units[0].practice[0].options[2] (question \"unknown-tv\")": "772b01f6751e78915fb54ef96c1df7d7853c7150e90fc0d1fae4bfc6da64af4b",
    "units[0].practice[1].options[0] (question \"broadcast-ports\")": "66acc3a661aad4e18d97d91b3336d72f0db0c89e2a29c66ea85114b468b13989",
    "units[0].practice[1].options[1] (question \"broadcast-ports\")": "1c8031c38e321c97e395201e734af404493058438ef9f173af29fd1e76efdf4a",
    "units[0].practice[1].options[2] (question \"broadcast-ports\")": "e4545cf33adaf1047f72ea72c4d1bc76541c1d273c5edcbb29768534c36c38a4",
    "units[0].practice[0].prompt (question \"unknown-tv\")": "25b7475289069ddb722b3429257ec226c881b8c29260683a2ce917aa7d2aa6f8",
    "units[0].practice[1].prompt (question \"broadcast-ports\")": "c0f344f4a2dd1f037d0d0fde7fad13a6f183d7f9ad4cf3b89cd62079a84825ab"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: Switch

Full check, 2026-11-15. 88 items: 85 ✅, 3 ⚠️, 0 ❌.

The three ⚠️ share one fault: each part says a switch sends a frame for everyone (a broadcast) out of every port, and of that part's own citations only RFC 4762 §4.1 says so. The fix is a citation, not a rewrite: `cisco-unicast-flooding` §Cause 1: Asymmetric Routing and `openbsd-man-ifconfig-8` §discover both state it and are already cited by `fact-broadcast` and the first option of `broadcast-ports`.

## The claims

### units[0].osi — ✅

Layers: [2].

- `cisco-arp-config` §Devices That Do Not Use ARP
  > Layer 2 switches determine which port is connected to a device to which the message is addressed and send the message only
  > to that port, unlike a hub, which sends the message out all its ports.
- `cloudflare-network-switch` §What is a layer 2 switch? What is a layer 3 switch?
  > Network switches can operate at either OSI layer 2 (the data link layer) or layer 3 (the network layer).
  > …
  > Most switches, however, are layer 2 switches.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > Configure a Layer 2 interface on the firewall so it can act as a switch in your layer
  > 2 network
  > …
  > The hosts communicate with the firewall and each other at Layer 2 of the OSI model by
  > exchanging frames.
- Note: No standard places a switch at an OSI layer; two vendors' pages (Cisco, Cloudflare), with Palo Alto as a third, put the ordinary switch at layer 2. Cloudflare adds that some switches also work at layer 3; the lesson teaches that in `deep-l3`, so a single-layer badge for the ordinary switch is true for a beginner.
- Note: All three pages are live vendor documentation or explainers describing current products (checked 2026-11-15).

### units[0].steps[0].deep[0] (step "no-match", Go deeper) — ✅

"Flooding like this is a normal part of a switch's work, not a fault."

- `cisco-unicast-flooding` §Problem Definition
  > Limited flooding is part of the normal switching process.
- `rfc-4762` §4.1
  > One of attributes of an Ethernet service is that frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: Cisco adds that flooding that never stops can hurt a network. The claim is about flooding a frame for an address the switch has not yet learned, which both sources treat as ordinary behaviour.
- Note: RFC 4762 is not obsoleted and has no updates (RFC Editor, 2026-11-15). The Cisco tech note is live and describes current switching behaviour.

### units[0].steps[1].deep[0] (step "learns-the-sender", Go deeper) — ✅

"Entries a switch learns like this are called dynamic; some switches also let you add static ones."

- `cisco-9300-mac-table` §MAC Address Table
  > the type (static or dynamic).
- `cisco-9300-mac-table` §MAC Address Table
  > A source MAC address that the device learns and then ages when it is not in use.
  > Static address—A manually entered unicast address that does not age and that is not lost when the device resets.
- `openbsd-man-ifconfig-8` §discover
  > meaning that
  > there is no static entry and no dynamically learned entry for the
  > destination
- `openbsd-man-ifconfig-8` §static
  > Add a static entry into the address cache pointing to
  > interface. Static entries are never aged out of the
  > cache or replaced
- Note: Cisco names the learned entries "dynamic"; OpenBSD calls them dynamically learned entries. Both let an administrator add static entries.
- Note: Cisco IOS XE 17.18.x guide and the OpenBSD manual are live and current (2026-11-15).

### units[0].steps[2].deep[0] (step "straight-to-one-port", Go deeper) — ✅

"If a frame's destination is on the same port it came in on, the switch drops it instead of sending it back."

- `cisco-9300-mac-table` §MAC Address Table Creation
  > If the destination
  > address is on the port that sent the packet, the packet is filtered and not forwarded.
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the destination is on the same segment as the origin segment,
  > the bridge will drop the packet because the receiver has already had a
  > chance to see the frame.
- Note: Both pages are live and current (2026-11-15).

### units[0].steps[3].deep[0] (step "to-everyone", Go deeper) — ✅

"ARP, which finds a device's MAC address, sends its question as a broadcast, so a switch floods it out of every other port."

- `rfc-826` §An Example
  > and broadcasts this packet to everybody on the cable.
- `cisco-unicast-flooding` §Cause 1: Asymmetric Routing
  > sends a broadcast packet (for example Address Resolution Protocol (ARP)). Switch A will flood this packet to VLAN 1
- `cisco-arp-config` §Address Resolution Protocol
  > ARP finds the hardware address,
  > also known as Media Access Control (MAC) address, of a host from its known IP address.
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: The same Cisco tech note defines flooding as a copy out of every forwarding port in the VLAN except the one the frame came in on, so "every other port" matches it. The claim leaves out VLANs and that ARP starts from a known IP address.
- Note: RFC 826 is an Internet Standard (STD 37), not obsoleted; it is updated by RFC 5227 (address conflict detection, whose ARP probes are also broadcast) and RFC 5494 (IANA rules), and neither changes the request being a broadcast. RFC 4762 is not obsoleted. Both Cisco pages are live (2026-11-15).

### units[0].steps[4].deep[0] (step "moved", Go deeper) — ✅

"The table forgets quietly too: an entry the switch hasn't heard from for a while is dropped, and the device's next frame puts it back."

- `cisco-9300-mac-table` §MAC Address Table
  > A source MAC address that the device learns and then ages when it is not in use.
- `openbsd-man-ifconfig-8` §timeout
  > Set the timeout, in seconds, for addresses in the cache to
  > time. The default is 240 seconds. If
  > time is set to zero, then entries will not be
  > expired.
- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `openbsd-man-ifconfig-8` §learn
  > Mark interface so that the source address of packets
  > received from the interface are entered into the address cache.
- Note: Leaves out that static entries never age and that ageing can be turned off; both are options, not the ordinary case.
- Note: Both sources are live and current (2026-11-15).

### units[0].learn.lead[0] ("lead-1") — ⚠️

"A switch connects the devices of one wired network. From each frame that comes in, it learns which MAC address is on which port. A frame for an address it has learned goes out of that one port; a frame for an address it hasn't learned, or for everyone, goes out of every port except the one it came in on."

- `cisco-network-switch-how` §Introduction
  > on the same network within a building or campus. A switch enables connected devices to share information and talk to each other.
- `cisco-network-switch-how` §How to setup a network switch with a router?
  > that have a wired connection to the internet.
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > Suppose Computer A is connected to an Ethernet cable that plugs into the switch's Port 1
  > …
  > It forwards Computer A's message to all other computers on the network (except Computer A); this is known as "flooding"
- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `cisco-9300-mac-table` §MAC Address Table Creation
  > the device forwards the packet only to the port associated with the destination address.
- `openbsd-man-bridge-4` §DESCRIPTION
  > When a frame comes in, the origin segment and the source
  > address are recorded.
  > …
  > If the destination is known to be on a different segment
  > from its origin, the bridge will forward the packet only to the destination
  > segment.
- `cisco-unicast-flooding` §Causes of Flooding
  > In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: Every claim in this part has two independent sources except one: that a frame for everyone (a broadcast) goes out of every port. Of this part's citations, only RFC 4762 §4.1 says so; the Cisco, Cloudflare and OpenBSD bridge sections cited here speak only of unknown addresses.
- Note: What is wrong: the broadcast half is not confirmed by a second independent source. Adding `cisco-unicast-flooding` §Cause 1: Asymmetric Routing or `openbsd-man-ifconfig-8` §discover (both state it, and `fact-broadcast` already cites them) would confirm it. The wording is true for a beginner and needs no change.
- Note: All sources are live and current (2026-11-15).

### units[0].learn.terms[0] ("term-switch") — ✅

"Switch: A box, also called a network switch, that connects the devices of one network: each plugs into a port with a cable, and the switch passes Ethernet frames between them"

- `cisco-network-switch-how` §Introduction
  > on the same network within a building or campus. A switch enables connected devices to share information and talk to each other.
- `cisco-network-switch-how` §How to setup a network switch with a router?
  > so you can setup a network switch to connect with your router.
- `openbsd-man-bridge-4` §DESCRIPTION
  > The bridge device creates a logical link
  > between two or more Ethernet interfaces
  > …
  > This link between the interfaces selectively forwards
  > frames from each interface on the bridge to every other interface on the
  > bridge.
- `rfc-5556` §2
  > Ethernet subnets have evolved from 'thicknet' to 'thinnet' to twisted
  > pair with hubs to twisted pair with switches
- `cloudflare-network-switch` §What is a network switch?
  > A network switch connects devices within a network
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > Layer 2 network switches maintain a table in memory that matches MAC addresses to the switch's Ethernet ports.
  > …
  > Suppose Computer A is connected to an Ethernet cable that plugs into the switch's Port 1
- Note: "A box" is an everyday description; switching can also be built into other devices, which a beginner does not need here.
- Note: All sources are live; RFC 5556 is not obsoleted and has no updates (2026-11-15).

### units[0].learn.terms[1] ("term-port") — ✅

"Port: A socket on the switch where a device's cable plugs in"

- `cisco-9300-mac-table` §MAC Address Table Creation
  > With multiple MAC addresses supported on all ports, you can connect any port on the device to other network devices.
- `rfc-5556` §3.1
  > Bridge autolearning already is susceptible to moving
  > nodes between ports
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > Suppose Computer A is connected to an Ethernet cable that plugs into the switch's Port 1
- Note: "Socket" is an everyday word for the port the sources describe.

### units[0].learn.terms[2] ("term-frame") — ✅

"Frame: What a packet travels in across your own network, with the MAC address it's for and the one it's from at the front"

- `rfc-9542` §3
  > Ethernet protocol parameters provide a means of indicating, near the
  > beginning of a frame, the contents of that frame
  > …
  > the EtherType of the protocol data in the
  > frame appears immediately after the destination and source MAC
  > addresses.
- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- `paloalto-layer-7` §Encapsulation Process (Data Flow Downwards)
  > The data link layer (Layer 2) encapsulates this packet in a frame, adding MAC addresses in its header
- Note: Leaves out the frame's trailer (a check sequence) and its type field; "your own network" is the local link the frame crosses.
- Note: RFC 9542 is BCP 141, not obsoleted; RFC 894 is STD 41, not obsoleted, no updates. The Palo Alto page is live (2026-11-15).

### units[0].learn.terms[3] ("term-table") — ✅

"MAC table: The switch's list of which MAC address is on which port"

- `cisco-9300-mac-table` §MAC Address Table
  > The MAC address table contains address information that the device uses to forward traffic between ports. All MAC addresses
  > in the address table are associated with one or more ports.
- `openbsd-man-bridge-4` §DESCRIPTION
  > A table is built containing the MAC address and segment to which the
  > MAC address is attached.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall puts source address 0A-76-F2-60-EA-83 and associated Eth1/1
  > into its MAC table.

### units[0].learn.terms[4] ("term-learn") — ✅

"Learning: Noting each incoming frame's source MAC address beside the port it came in on"

- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `openbsd-man-bridge-4` §DESCRIPTION
  > When a frame comes in, the origin segment and the source
  > address are recorded.
- `openbsd-man-ifconfig-8` §learn
  > Mark interface so that the source address of packets
  > received from the interface are entered into the address cache.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall puts source address 0A-76-F2-60-EA-83 and associated Eth1/1
  > into its MAC table.

### units[0].learn.terms[5] ("term-flood") — ✅

"Flooding: Sending a copy of a frame out of every port except the one it came in on, when the switch doesn't know which port leads to its destination"

- `cisco-unicast-flooding` §Causes of Flooding
  > The very cause of flooding is that destination MAC address of the packet is not in the L2 forwarding table of the switch. In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > It forwards Computer A's message to all other computers on the network (except Computer A); this is known as "flooding"
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the bridge has no knowledge about where the destination is to be found, the bridge will forward the frame to all
  > attached segments.
- `openbsd-man-ifconfig-8` §discover
  > If the bridge
  > has no address cache entry for the destination of a packet, meaning that
  > there is no static entry and no dynamically learned entry for the
  > destination, the bridge will forward the packet to all member interfaces
  > that have this flag set.
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: Leaves out VLANs (the flood stays inside the frame's VLAN) and ports an administrator has excluded.

### units[0].learn.terms[6] ("term-broadcast") — ✅

"Broadcast address: The address that means every device on the network: ff:ff:ff:ff:ff:ff"

- `rfc-894` §Address Mappings
  > should be mapped to the broadcast
  > Ethernet address (of all binary ones, FF-FF-FF-FF-FF-FF hex).
- `ieee-eui-guidelines` §Unassigned and NULL EUI values
  > are IEEE 802 multicast (group)
  > MAC addresses indicating all stations on a network.
- Note: The lesson writes the same value in lower case.
- Note: The EUI guidelines PDF (dated 2017-08-03) is live on the IEEE site, and the IEEE RA support portal's current copy of the same tutorial (updated 2022) has this section unchanged (checked 2026-11-15).

### units[0].learn.terms[7] ("term-age") — ✅

"Ageing out: Dropping a table entry the switch hasn't heard from for a while"

- `cisco-9300-mac-table` §MAC Address Table
  > A source MAC address that the device learns and then ages when it is not in use.
- `openbsd-man-ifconfig-8` §timeout
  > Set the timeout, in seconds, for addresses in the cache to
  > time.
- `cisco-unicast-flooding` §Cause 1: Asymmetric Routing
  > Since the switch is not receiving traffic constantly, this forwarding entry will eventually age out and flooding will resume.
- Note: Leaves out that static entries do not age.

### units[0].learn.pattern ("pattern") — ⚠️

Names: "Note the sender's port", "Look up the destination", "Found it: out of that one port", "No match, or for everyone: out of every other port". Note: "What a switch does with each frame that comes in."

- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `cisco-9300-mac-table` §MAC Address Table Creation
  > the device forwards the packet only to the port associated with the destination address.
- `openbsd-man-bridge-4` §DESCRIPTION
  > When a frame comes in, the origin segment and the source
  > address are recorded. If the bridge has no knowledge about where the
  > destination is to be found, the bridge will forward the frame to all
  > attached segments.
- `cisco-unicast-flooding` §Causes of Flooding
  > In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > It records Computer A's MAC address and the port its message came in on
  > It forwards Computer A's message to all other computers on the network (except Computer A); this is known as "flooding"
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: The order (note the sender, then look up the destination) and the known and unknown cases each have two independent sources. The "for everyone" case (a broadcast goes out of every other port) is stated only by RFC 4762 §4.1 among this part's citations.
- Note: What is wrong: the broadcast case is not confirmed by a second independent source. Adding `cisco-unicast-flooding` §Cause 1: Asymmetric Routing or `openbsd-man-ifconfig-8` §discover would confirm it. The wording needs no change.

### units[0].learn.why[0] ("why-1") — ✅

"A switch learns where each device is so that a frame for one device goes down that device's cable alone, not to everyone."

- `cisco-9300-mac-table` §MAC Address Table Creation
  > Using
  > the MAC address table, the device forwards the packet only to the port associated with the destination address.
- `openbsd-man-bridge-4` §DESCRIPTION
  > This allows a bridge to be more selective about
  > what it forwards, which can be used to reduce traffic on a set of segments
- `rfc-5556` §3.2
  > port autolearning reduces unnecessary broadcast of unicast traffic.
- Note: When a port leads to another switch, the frame goes down that port's cable rather than the device's own; the lesson teaches this in `deep-many`.

### units[0].learn.why[1] ("why-2") — ✅

"You don't have to fill the table in: plug the devices in, and the switch learns the rest from the frames they send."

- `cisco-network-switch-how` §Unmanaged switches
  > An unmanaged network switch is designed so that you can simply plug them in and they work, no configuration required.
- `cisco-9300-mac-table` §Default MAC Address Table Settings
  > Automatically learned
- `rfc-5556` §3.2
  > Both bridges and hubs are zero configuration devices; hubs having no
  > configuration at all
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall begins with an empty MAC table.
- Note: The two Cisco pages count as one source; RFC 5556 and Palo Alto are independent of them.

### units[0].learn.deep[0] ("deep-hub", Learn's Go deeper) — ✅

"A hub, the box switches replaced, keeps no table and learns nothing."

- `cisco-arp-config` §Devices That Do Not Use ARP
  > They send messages out all
  > ports to the devices and operate at Layer 1, but they do not maintain an address table.
- `openbsd-man-bridge-4` §DESCRIPTION
  > In general a bridge works like a hub, forwarding traffic from
  > one interface to another. It differs from a hub in that it will
  > "learn" which machines are on each of its attached segments
- `rfc-5556` §2
  > Ethernet subnets have evolved from 'thicknet' to 'thinnet' to twisted
  > pair with hubs to twisted pair with switches
- `cisco-network-switch-how` §Network hubs and switches
  > A switch avoids these and other limitations of network hubs.
- Note: RFC 5556 states the move from hubs to switches; Cisco presents the switch as the device that removes the hub's limits. Cisco's ARP guide and OpenBSD each say a hub keeps no table or does not learn.

### units[0].learn.deep[1] ("deep-many", Learn's Go deeper) — ✅

"One port can lead to another switch, so the table can list several addresses on one port."

- `cisco-9300-mac-table` §MAC Address Table Creation
  > With multiple MAC addresses supported on all ports, you can connect any port on the device to other network devices.
- `openbsd-man-bridge-4` §DESCRIPTION
  > It differs from a hub in that it will
  > "learn" which machines are on each of its attached segments
- `cisco-network-switch-how` §Network hubs and switches
  > A large network may include multiple switches, which connect different groups of computer systems together.
- Note: The two Cisco pages count as one source; OpenBSD (several machines learned on one attached segment) is the independent second.

### units[0].learn.deep[2] ("deep-age", Learn's Go deeper) — ✅

"How long is "a while"? It can be changed, and the default differs: 300 seconds on Cisco's Catalyst 9300 switches, 240 on OpenBSD's bridge."

- `cisco-9300-mac-table` §Changing the Address Aging Time
  > Sets the length of time that a dynamic entry remains in the MAC address table after the entry is used or updated.
  > The range is 10 to 1000000 seconds. The default is 300.
- `openbsd-man-ifconfig-8` §timeout
  > Set the timeout, in seconds, for addresses in the cache to
  > time. The default is 240 seconds.
- Note: Each default is a fact about one product and is stated by that product's own current documentation, which is where it is set; the claim that the time can be changed and differs between products is stated by both. Both pages are live (Cisco IOS XE 17.18.x; current OpenBSD manual), checked 2026-11-15.

### units[0].learn.deep[3] ("deep-l3", Learn's Go deeper) — ✅

"Some switches, called layer 3 switches, can also route using IP addresses."

- `cisco-arp-config` §Devices That Do Not Use ARP
  > However, Layer 3 switches are routers that build an
  > ARP cache (table).
- `cloudflare-network-switch` §What is a layer 2 switch? What is a layer 3 switch?
  > Layer 2 switches forward data based on the destination MAC address (see below for definition), while layer 3 switches forward data based on the destination IP address. Some switches can do both.

### units[0].learn.facts[0] ("fact-start") — ✅

"At the start: the MAC table is empty"

- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall begins with an empty MAC table.
- `cisco-9300-mac-table` §Default MAC Address Table Settings
  > Automatically learned
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > Now, suppose the switch was just turned on and has not yet created its CAM table. It does not know which ports Computers A, B, and C are connected to.
- Note: Leaves out static entries an administrator may have saved; Cisco's default is that none are configured.

### units[0].learn.facts[1] ("fact-learn") — ✅

"Learns from: the source MAC address of each frame that comes in, beside the port it came in on"

- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `openbsd-man-bridge-4` §DESCRIPTION
  > When a frame comes in, the origin segment and the source
  > address are recorded.
- `openbsd-man-ifconfig-8` §learn
  > Mark interface so that the source address of packets
  > received from the interface are entered into the address cache. This is
  > the default for interfaces added to the bridge.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall puts source address 0A-76-F2-60-EA-83 and associated Eth1/1
  > into its MAC table.
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > It records Computer A's MAC address and the port its message came in on

### units[0].learn.facts[2] ("fact-known") — ✅

"Address in the table: the frame goes out of that one port only"

- `cisco-9300-mac-table` §MAC Address Table Creation
  > Using
  > the MAC address table, the device forwards the packet only to the port associated with the destination address.
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the destination is known to be on a different segment
  > from its origin, the bridge will forward the packet only to the destination
  > segment.
- Note: Leaves out the case where the destination is on the incoming port (the frame is dropped), which the lesson teaches in its Go deeper.

### units[0].learn.facts[3] ("fact-unknown") — ✅

"Address not in the table: the switch floods the frame: a copy out of every port except the one it came in on"

- `cisco-unicast-flooding` §Causes of Flooding
  > In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > It forwards Computer A's message to all other computers on the network (except Computer A); this is known as "flooding"
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the bridge has no knowledge about where the
  > destination is to be found, the bridge will forward the frame to all
  > attached segments.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > so it doesn’t know which
  > interface to forward the frame to; it broadcasts the frame to all of its Layer 2
  > interfaces.
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- Note: Leaves out VLANs.

### units[0].learn.facts[4] ("fact-broadcast") — ✅

"Broadcast: ff:ff:ff:ff:ff:ff goes out of every port except the one it came in on, so every device gets a copy"

- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- `cisco-unicast-flooding` §Cause 1: Asymmetric Routing
  > sends a broadcast packet (for example Address Resolution Protocol (ARP)). Switch A will flood this packet to VLAN 1
- `openbsd-man-ifconfig-8` §discover
  > Turning
  > this flag off means that the bridge will not send packets out of this
  > interface unless the packet is a broadcast packet, multicast packet, or a
  > packet with a destination address found on the interface's segment.
- `ieee-eui-guidelines` §Unassigned and NULL EUI values
  > are IEEE 802 multicast (group)
  > MAC addresses indicating all stations on a network.
- Note: Cisco's tech note defines its "flood" as every forwarding port in the VLAN except the one the frame came in on, which gives the "except" here. Leaves out VLANs.

### units[0].learn.facts[5] ("fact-keep") — ✅

"Each device: keeps a frame for its own MAC address or for everyone, and ignores the rest"

- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > receives the broadcast, but the destination MAC address
  > is not its own MAC address, so it drops the frame.
- `microsoft-ndis-packet-filter` §Remarks
  > Directed packets contain a destination address equal to the station address of the NIC.
  > …
  > Broadcast packets.
  > …
  > the protocol driver continues to receive packets even if the sending network node does not direct them to it.
- `openbsd-man-bpf-4` §BIOCPROMISC
  > Forces the interface into promiscuous mode. All packets, not just those
  > destined for the local host, are processed.
- Note: Leaves out multicast frames a device has signed up for and promiscuous mode, which a program must turn on; both are opt-in, and the lesson teaches neither, so the ordinary case holds.
- Note: The Microsoft page is live current Windows driver documentation (updated 2023); bpf(4) is the current OpenBSD manual (2026-11-15).

### units[0].learn.facts[6] ("fact-age") — ✅

"Old entries: an entry the switch hasn't heard from for a while ages out; the device's next frame puts it back"

- `cisco-9300-mac-table` §MAC Address Table
  > A source MAC address that the device learns and then ages when it is not in use.
- `openbsd-man-ifconfig-8` §timeout
  > Set the timeout, in seconds, for addresses in the cache to
  > time.
- `cisco-unicast-flooding` §Cause 1: Asymmetric Routing
  > Switch A will flood this packet to VLAN 1 and switch B will receive and learn the MAC address of S1. Since the switch is not receiving traffic constantly, this forwarding entry will eventually age out and flooding will resume.
- `openbsd-man-ifconfig-8` §learn
  > Mark interface so that the source address of packets
  > received from the interface are entered into the address cache.
- Note: Leaves out static entries, which do not age.

### units[0].learn.facts[7] ("fact-move") — ✅

"A device moves: the switch updates its entry from the first frame the device sends on its new port"

- `rfc-5556` §3.1
  > Bridge autolearning already is susceptible to moving
  > nodes between ports, because previously learned associations between
  > the port and link address change.
- `cisco-9300-mac-table` §Configuring MAC Address Move Notification Traps
  > a MAC address moves from one port to another within the same VLAN.
- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- Note: "The first frame" puts in a beginner's words that learning happens on every received frame. Leaves out static entries, which do not move.

### units[0].learn.facts[8] ("fact-router") — ✅

"Switch or router: a switch connects the devices of one network; a router joins networks"

- `cisco-network-switch-how` §What is a router and how does it work in a network?
  > While switches allow different devices on a network to communicate, routers allow different networks to communicate.
- `rfc-1812` §2.2.3
  > In the Internet model, constituent networks are connected together by
  > IP datagram forwarders which are called routers or IP routers.
  > …
  > Packet switching devices may also operate at the Link Layer; such
  > devices are usually called bridges.  Network segments that are
  > connected by bridges share the same IP network prefix forming a
  > single IP subnet.
- `cloudflare-network-switch` §What is the difference between a switch and a router?
  > Routers do this by connecting with different networks and forwarding data from network to network
- Note: RFC 1812 is not obsoleted; its updates (RFC 2644 on directed broadcasts, RFC 6633 on Source Quench) do not touch this section (RFC Editor, 2026-11-15).

### units[0].learn.facts[9] ("fact-wifi") — ✅

"On Wi-Fi: every device in range hears each frame, and can read its MAC addresses"

- `rfc-9724` §2.1
  > Wi-Fi interfaces have an L2 address
  > (also referred to as a MAC address) that can be seen by anybody who
  > can receive the radio signal transmitted by the network interface.
- `rfc-9724` §2.2
  > MAC addresses can be easily observed by a third party, such as a
  > passive device listening to communications in the same L2 network.
- `microsoft-ndis-packet-filter` §Remarks
  > the protocol driver continues to receive packets even if the sending network node does not direct them to it.
  > …
  > The Native 802.11 miniport driver must only support the following standard packet filter types:
- Note: The two RFC 9724 sections are one source. Microsoft is the second: a Wi-Fi (Native 802.11) adapter must support promiscuous mode, in which it passes up frames not sent to it, so it receives them. Its directed filter works by comparing each frame's destination address with its own.
- Note: RFC 9724 (Informational, 2025) is not obsoleted (RFC Editor, 2026-11-15).

### units[0].learn.facts[10] ("fact-osi") — ✅

"OSI layer: 2, data link"

- `cisco-arp-config` §Devices That Do Not Use ARP
  > Layer 2 switches determine which port is connected to a device to which the message is addressed
- `cloudflare-network-switch` §What is a layer 2 switch? What is a layer 3 switch?
  > Network switches can operate at either OSI layer 2 (the data link layer) or layer 3 (the network layer).
  > …
  > Most switches, however, are layer 2 switches.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The hosts communicate with the firewall and each other at Layer 2 of the OSI model by
  > exchanging frames.
- Note: The layer is stated by all three; the layer's name appears in Cloudflare's cited section. Layer 3 switches are taught in `deep-l3`.

### units[0].learn.facts[11] ("fact-defined") — ✅

"Defined in: IEEE 802.1Q, which calls a switch a bridge"

- `ieee-802-1q-2022` §IEEE 802.1Q-2022
  > This standard specifies how the Media Access Control (MAC) Service is supported by Bridged Networks, the principles of operation of those networks, and the operation of MAC Bridges and VLAN Bridges, including management, protocols, and algorithms.
- `rfc-4762` §4.2
  > Reachability is obtained by
  > standard learning bridge functions in the data plane.
  > …
  > Standard learning, filtering, and forwarding actions, as defined in
  > [802.1D-ORIG], [802.1D-REV], and [802.1Q]
- `rfc-5556` §2.5
  > 802.1D - added bridges (i.e., switches)
- Note: The IEEE page shows that 802.1Q's own name for the device is a bridge; RFC 4762 says the learning, filtering and forwarding this lesson teaches are defined in 802.1Q (with the older 802.1D); RFC 5556 says bridges are switches.
- Note: IEEE SA lists 802.1Q-2022 as the Active Standard, superseding 802.1Q-2018, with amendments through 802.1Qdy-2025 (checked 2026-11-15).

### units[0].practice[0].options[0] (question "unknown-tv") — ✅

"It floods it: a copy out of every port except the laptop's." (right) Feedback: "Right. The TV's address isn't in the table, so the switch can't tell which port leads to it. The TV keeps its copy; the others ignore theirs."

- `cisco-unicast-flooding` §Causes of Flooding
  > The very cause of flooding is that destination MAC address of the packet is not in the L2 forwarding table of the switch. In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `cloudflare-network-switch` §How do network switches know the MAC addresses of the devices in their network?
  > It forwards Computer A's message to all other computers on the network (except Computer A); this is known as "flooding"
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the bridge has no knowledge about where the
  > destination is to be found, the bridge will forward the frame to all
  > attached segments.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > receives the broadcast, but the destination MAC address
  > is not its own MAC address, so it drops the frame.
- `microsoft-ndis-packet-filter` §Remarks
  > Directed packets contain a destination address equal to the station address of the NIC.

### units[0].practice[0].options[1] (question "unknown-tv") — ✅

"It drops it, because the TV isn't in its table." (wrong) Feedback: "No. A switch doesn't drop a frame for an address it hasn't learned: it floods it, so the frame still reaches the TV."

- `cisco-unicast-flooding` §Causes of Flooding
  > The very cause of flooding is that destination MAC address of the packet is not in the L2 forwarding table of the switch. In this case the packet will be flooded out of all forwarding ports in its VLAN (except the port it was received on).
- `openbsd-man-bridge-4` §DESCRIPTION
  > If the bridge has no knowledge about where the
  > destination is to be found, the bridge will forward the frame to all
  > attached segments.
- `openbsd-man-ifconfig-8` §discover
  > This is the default for interfaces added to the
  > bridge.
- Note: Leaves out settings an administrator can turn on to stop flooding on chosen ports (OpenBSD's -discover); flooding is the default.

### units[0].practice[0].options[2] (question "unknown-tv") — ✅

"It sends it out of the TV's port only." (wrong) Feedback: "It would if it knew which port that was. It learns a device's port from the frames that device sends, and the TV hasn't sent one."

- `cisco-9300-mac-table` §MAC Address Table Creation
  > learning the source address of packets it receives on each port and adding the address and
  > its associated port number to the address table.
- `openbsd-man-bridge-4` §DESCRIPTION
  > When a frame comes in, the origin segment and the source
  > address are recorded.
- `paloalto-l2-interface` §Configure a Layer 2 Interface
  > The firewall puts source address 0A-76-F2-60-EA-83 and associated Eth1/1
  > into its MAC table.
- Note: Leaves out static entries, which an administrator could add; the lesson teaches them in a Go deeper.

### units[0].practice[1].options[0] (question "broadcast-ports") — ✅

"Ports 2, 3, 4 and 5." (right) Feedback: "Right. A broadcast goes out of every port except the one it came in on, and every device keeps it."

- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- `cisco-unicast-flooding` §Cause 1: Asymmetric Routing
  > sends a broadcast packet (for example Address Resolution Protocol (ARP)). Switch A will flood this packet to VLAN 1
- `openbsd-man-ifconfig-8` §discover
  > the bridge will not send packets out of this
  > interface unless the packet is a broadcast packet, multicast packet, or a
  > packet with a destination address found on the interface's segment.
- `microsoft-ndis-packet-filter` §Remarks
  > Broadcast packets.
- `ieee-eui-guidelines` §Unassigned and NULL EUI values
  > are IEEE 802 multicast (group)
  > MAC addresses indicating all stations on a network.
- Note: Cisco's flood excludes the port the frame came in on, which makes ports 2 to 5 the right answer.

### units[0].practice[1].options[1] (question "broadcast-ports") — ✅

"Only the ports whose devices are in its table." (wrong) Feedback: "No. A broadcast goes out of every port except the one it came in on, whatever is in the table."

- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- `openbsd-man-ifconfig-8` §discover
  > the bridge will not send packets out of this
  > interface unless the packet is a broadcast packet, multicast packet, or a
  > packet with a destination address found on the interface's segment.
- `cisco-9300-mac-table` §MAC Address Table Creation
  > the device forwards the packet only to the port associated with the destination address.
- Note: RFC 4762 and OpenBSD both say a broadcast goes out regardless of the table. Not sending it back out of the port it came in on repeats the lesson's flooding rule; RFC 4762 says only "all ports", which does not contradict it.

### units[0].practice[1].options[2] (question "broadcast-ports") — ⚠️

"None: no device has that address." (wrong) Feedback: "No device has it, but it means everyone: the switch sends it out of every other port, and every device keeps it."

- `rfc-894` §Address Mappings
  > should be mapped to the broadcast
  > Ethernet address (of all binary ones, FF-FF-FF-FF-FF-FF hex).
- `ieee-eui-guidelines` §Unassigned and NULL EUI values
  > are IEEE 802 multicast (group)
  > MAC addresses indicating all stations on a network. These all-ones values are
  > not valid EUIs.
- `rfc-4762` §4.1
  > frames sent to
  > broadcast addresses and to unknown destination MAC addresses are
  > flooded to all ports.
- `microsoft-ndis-packet-filter` §Remarks
  > Broadcast packets.
- Note: That no device has the address, that it means everyone and that devices take broadcasts each have two sources. That the switch sends it out of every other port is stated only by RFC 4762 §4.1 among this option's citations.
- Note: What is wrong: the switch's half is not confirmed by a second independent source. Adding `cisco-unicast-flooding` §Cause 1: Asymmetric Routing or `openbsd-man-ifconfig-8` §discover (cited by the first option of this question) would confirm it. The wording needs no change.

## Traced, example and analogy parts, and the unbacked items

### title — ✅

"Switch": names the lesson's subject and claims nothing more.

### units[0].name — ✅

"Switch": as the title.

### backing (the lesson's subtitle and summary) — ✅

Every step in it (empty table, flood, learn the port, one port only) is stated by term-learn, term-table, fact-start, term-flood, fact-learn and fact-known.

### units[0].backing (the unit's full name and purpose) — ✅

"Network switch" and "passing frames between the devices of one network" are both in term-switch.

### units[0].scene.backing (the scene) — ✅

Table title, columns and the empty message trace term-table, term-port, term-learn and fact-start. The log legend's "Frame for everyone" is a category label rather than a value or outcome; the idea is taught in term-broadcast, which this item's Traces line could also name.

### units[0].overview.hookBacking (the Overview hook) — ✅

Each sentence repeats fact-wifi, fact-start, fact-unknown, fact-learn (a frame carries its sender's address), fact-known or why-1. The laptop, TV and printer are the scene's example devices.

### units[0].overview.backing (the Overview description) — ✅

"Wired" repeats term-switch's devices plugging in with a cable.

### units[0].overview.facts[0] (Overview fact "Learns from") — ✅

### units[0].overview.facts[1] (Overview fact "Known address") — ✅

### units[0].overview.facts[2] (Overview fact "Unknown address") — ✅

### units[0].overview.facts[3] (Overview fact "OSI layer") — ✅

### units[0].overview.facts[4] (Overview fact "Defined in") — ✅

### units[0].steps[0] (step "no-match") — ✅

The flood, the printer keeping its frame and the others ignoring it trace term-flood, fact-unknown and fact-keep. MAC addresses are in the 00:00:5E:00:53:xx documentation range; port numbers are scene data.

### units[0].steps[0].facts[0] (step "no-match", fact "Looking for") — ✅

### units[0].steps[0].facts[1] (step "no-match", fact "In the table") — ✅

### units[0].steps[0].facts[2] (step "no-match", fact "Sent out of") — ✅

### units[0].steps[0].facts[3] (step "no-match", fact "Kept by") — ✅

### units[0].steps[0].events[0] (event "s1-frame") — ✅

"Ethernet" as the protocol repeats term-switch's Ethernet frames.

### units[0].steps[0].events[1] (event "s1-match") — ✅

### units[0].steps[1] (step "learns-the-sender") — ✅

### units[0].steps[1].facts[0] (step "learns-the-sender", fact "Learned from") — ✅

### units[0].steps[1].facts[1] (step "learns-the-sender", fact "On port") — ✅

### units[0].steps[1].facts[2] (step "learns-the-sender", fact "Set up by") — ✅

### units[0].steps[1].events[0] (event "s2-add") — ✅

### units[0].steps[2] (step "straight-to-one-port") — ✅

Learning the sender before looking up the destination follows the pattern's order.

### units[0].steps[2].facts[0] (step "straight-to-one-port", fact "Learned") — ✅

### units[0].steps[2].facts[1] (step "straight-to-one-port", fact "Found") — ✅

### units[0].steps[2].facts[2] (step "straight-to-one-port", fact "Sent out of") — ✅

### units[0].steps[2].events[0] (event "s3-frame") — ✅

### units[0].steps[2].events[1] (event "s3-add") — ✅

### units[0].steps[2].events[2] (event "s3-match") — ✅

### units[0].steps[3] (step "to-everyone") — ✅

### units[0].steps[3].facts[0] (step "to-everyone", fact "Sent to") — ✅

### units[0].steps[3].facts[1] (step "to-everyone", fact "Sent out of") — ✅

### units[0].steps[3].facts[2] (step "to-everyone", fact "Kept by") — ✅

### units[0].steps[3].facts[3] (step "to-everyone", fact "Learned") — ✅

### units[0].steps[3].events[0] (event "s4-frame") — ✅

### units[0].steps[3].events[1] (event "s4-add") — ✅

### units[0].steps[4] (step "moved") — ✅

### units[0].steps[4].facts[0] (step "moved", fact "Laptop now on") — ✅

### units[0].steps[4].facts[1] (step "moved", fact "Learned from") — ✅

### units[0].steps[4].facts[2] (step "moved", fact "Sent out of") — ✅

### units[0].steps[4].events[0] (event "s5-frame") — ✅

### units[0].steps[4].events[1] (event "s5-update") — ✅

### units[0].steps[4].events[2] (event "s5-match") — ✅

### units[0].learn.lead[1] ("lead-2") — ✅

The porter calls down every corridor until he knows someone's place, and learns it from where they come from. That matches flooding, then learning from the sender; it does not mislead.

### units[0].practice[0].prompt (question "unknown-tv") — ✅

No false premise: the TV has only received (the broadcast in step 4), never sent, so it is not in the table.

### units[0].practice[1].prompt (question "broadcast-ports") — ✅

## Sources

- `cisco-9300-mac-table`: Cisco Catalyst 9300 System Management Configuration Guide, IOS XE 17.18.x. Live, current release documentation. Checked 2026-11-15.
- `cisco-arp-config`: Cisco IOS XE 17.x IP Addressing guide, ARP. Live, current. Checked 2026-11-15.
- `cisco-network-switch-how`: Cisco "How Does a Switch Work?" explainer. Live, describes current practice. Checked 2026-11-15.
- `cisco-unicast-flooding`: Cisco tech note 23563 (updated 2016). Live; the flooding and ageing behaviour it describes is current practice. Checked 2026-11-15.
- `cloudflare-network-switch`: Cloudflare Learning Center explainer. The command-line read got a bot check, so it was read in the built-in browser; live and current. Checked 2026-11-15.
- `ieee-802-1q-2022`: IEEE SA lists 802.1Q-2022 as the Active Standard (superseding 802.1Q-2018; amendments through 2025). Checked 2026-11-15.
- `ieee-eui-guidelines`: IEEE RA tutorial PDF (dated 2017-08-03), live on the IEEE site; the IEEE RA support portal's current copy (updated 2022) has the cited section unchanged. Checked 2026-11-15.
- `microsoft-ndis-packet-filter`: Microsoft Learn, Windows driver documentation (updated 2023). Live, current. Checked 2026-11-15.
- `openbsd-man-bpf-4`, `openbsd-man-bridge-4`, `openbsd-man-ifconfig-8`: current OpenBSD manual pages on man.openbsd.org. Live. Checked 2026-11-15.
- `paloalto-l2-interface`: Palo Alto Networks PAN-OS documentation, updated 2026-09-30. Live, current. Checked 2026-11-15.
- `paloalto-layer-7`: Palo Alto Networks Cyberpedia explainer. Live. Checked 2026-11-15.
- `rfc-1812`: Proposed Standard, not obsoleted; updated by RFC 2644 and RFC 6633, neither touching §2.2.3. Checked 2026-11-15.
- `rfc-4762`: Proposed Standard, not obsoleted, no updates. Checked 2026-11-15.
- `rfc-5556`: Informational, not obsoleted, no updates. Checked 2026-11-15.
- `rfc-826`: Internet Standard (STD 37), not obsoleted; updated by RFC 5227 and RFC 5494, neither changing the broadcast request. Checked 2026-11-15.
- `rfc-894`: Internet Standard (STD 41), not obsoleted, no updates. Checked 2026-11-15.
- `rfc-9542`: Best Current Practice (BCP 141), not obsoleted. Checked 2026-11-15.
- `rfc-9724`: Informational, not obsoleted. Checked 2026-11-15.

## Limit overrides

None.
