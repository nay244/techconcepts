```json fact-check
{
  "slug": "what-is-icmp",
  "hash": "14577e2467ff740ea173b936575b0666e42b31545ad975685beef1cfa4419414",
  "checked": "2026-11-12",
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
    "units[0].overview.facts[1] (Overview fact \"Tools\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Messages here\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Ports\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"echo-request\")": "✅",
    "units[0].steps[0].facts[0] (step \"echo-request\", fact \"Command\")": "✅",
    "units[0].steps[0].facts[1] (step \"echo-request\", fact \"Message\")": "✅",
    "units[0].steps[0].facts[2] (step \"echo-request\", fact \"Ports\")": "✅",
    "units[0].steps[0].facts[3] (step \"echo-request\", fact \"To\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[1] (step \"echo-reply\")": "✅",
    "units[0].steps[1].facts[0] (step \"echo-reply\", fact \"Answer\")": "✅",
    "units[0].steps[1].facts[1] (step \"echo-reply\", fact \"Round trip\")": "✅",
    "units[0].steps[1].facts[2] (step \"echo-reply\", fact \"Reply’s TTL\")": "✅",
    "units[0].steps[1].facts[3] (step \"echo-reply\", fact \"Lost\")": "✅",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[1].events[1] (event \"answers-1\")": "✅",
    "units[0].steps[2] (step \"time-exceeded-hop-1\")": "✅",
    "units[0].steps[2].facts[0] (step \"time-exceeded-hop-1\", fact \"Probe\")": "✅",
    "units[0].steps[2].facts[1] (step \"time-exceeded-hop-1\", fact \"Dropped by\")": "✅",
    "units[0].steps[2].facts[2] (step \"time-exceeded-hop-1\", fact \"Answer\")": "✅",
    "units[0].steps[2].facts[3] (step \"time-exceeded-hop-1\", fact \"Time\")": "✅",
    "units[0].steps[2].events[0] (event \"m3\")": "✅",
    "units[0].steps[2].events[1] (event \"m4\")": "✅",
    "units[0].steps[2].events[2] (event \"answers-2\")": "✅",
    "units[0].steps[3] (step \"time-exceeded-hop-2\")": "✅",
    "units[0].steps[3].facts[0] (step \"time-exceeded-hop-2\", fact \"Probe\")": "✅",
    "units[0].steps[3].facts[1] (step \"time-exceeded-hop-2\", fact \"Dropped by\")": "✅",
    "units[0].steps[3].facts[2] (step \"time-exceeded-hop-2\", fact \"Time\")": "✅",
    "units[0].steps[3].facts[3] (step \"time-exceeded-hop-2\", fact \"Pattern\")": "✅",
    "units[0].steps[3].events[0] (event \"m5\")": "✅",
    "units[0].steps[3].events[1] (event \"m6\")": "✅",
    "units[0].steps[3].events[2] (event \"answers-3\")": "✅",
    "units[0].steps[4] (step \"traceroute\")": "✅",
    "units[0].steps[4].facts[0] (step \"traceroute\", fact \"Hops\")": "✅",
    "units[0].steps[4].facts[1] (step \"traceroute\", fact \"Path\")": "✅",
    "units[0].steps[4].facts[2] (step \"traceroute\", fact \"Last answer\")": "✅",
    "units[0].steps[4].facts[3] (step \"traceroute\", fact \"Tools\")": "✅",
    "units[0].steps[4].events[0] (event \"m7\")": "✅",
    "units[0].steps[4].events[1] (event \"m8\")": "✅",
    "units[0].steps[4].events[2] (event \"answers-4\")": "✅",
    "units[0].steps[4].events[3] (event \"m9\")": "✅",
    "units[0].steps[4].events[4] (event \"m10\")": "✅",
    "units[0].steps[4].events[5] (event \"answers-5\")": "✅",
    "units[0].steps[4].events[6] (event \"m11\")": "✅",
    "units[0].steps[4].events[7] (event \"m12\")": "✅",
    "units[0].steps[4].events[8] (event \"answers-6\")": "✅",
    "units[0].steps[5] (step \"destination-unreachable\")": "✅",
    "units[0].steps[5].facts[0] (step \"destination-unreachable\", fact \"Pinged\")": "✅",
    "units[0].steps[5].facts[1] (step \"destination-unreachable\", fact \"Answer from\")": "✅",
    "units[0].steps[5].facts[2] (step \"destination-unreachable\", fact \"Message\")": "✅",
    "units[0].steps[5].facts[3] (step \"destination-unreachable\", fact \"Other codes\")": "✅",
    "units[0].steps[5].events[0] (event \"m13\")": "✅",
    "units[0].steps[5].events[1] (event \"m14\")": "✅",
    "units[0].steps[5].events[2] (event \"answers-7\")": "✅",
    "units[0].steps[0].deep[0] (step \"echo-request\", Go deeper)": "✅",
    "units[0].steps[0].deep[1] (step \"echo-request\", Go deeper)": "✅",
    "units[0].steps[0].deep[2] (step \"echo-request\", Go deeper)": "✅",
    "units[0].steps[0].deep[3] (step \"echo-request\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"echo-reply\", Go deeper)": "✅",
    "units[0].steps[1].deep[1] (step \"echo-reply\", Go deeper)": "✅",
    "units[0].steps[1].deep[2] (step \"echo-reply\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"time-exceeded-hop-1\", Go deeper)": "✅",
    "units[0].steps[2].deep[1] (step \"time-exceeded-hop-1\", Go deeper)": "✅",
    "units[0].steps[2].deep[2] (step \"time-exceeded-hop-1\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"time-exceeded-hop-2\", Go deeper)": "✅",
    "units[0].steps[3].deep[1] (step \"time-exceeded-hop-2\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"traceroute\", Go deeper)": "✅",
    "units[0].steps[5].deep[0] (step \"destination-unreachable\", Go deeper)": "✅",
    "units[0].steps[5].deep[1] (step \"destination-unreachable\", Go deeper)": "✅",
    "units[0].steps[5].deep[2] (step \"destination-unreachable\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-echo-request\")": "✅",
    "units[0].learn.terms[1] (\"term-echo-reply\")": "✅",
    "units[0].learn.terms[2] (\"term-ping\")": "✅",
    "units[0].learn.terms[3] (\"term-latency\")": "✅",
    "units[0].learn.terms[4] (\"term-ttl\")": "✅",
    "units[0].learn.terms[5] (\"term-time-exceeded\")": "✅",
    "units[0].learn.terms[6] (\"term-traceroute\")": "✅",
    "units[0].learn.terms[7] (\"term-unreachable\")": "✅",
    "units[0].learn.terms[8] (\"term-loss\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.deep[0] (\"deep-types\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-ports\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-firewalls\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-ipv6\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-types\")": "✅",
    "units[0].learn.facts[1] (\"fact-ports\")": "✅",
    "units[0].learn.facts[2] (\"fact-rides\")": "✅",
    "units[0].learn.facts[3] (\"fact-tools\")": "✅",
    "units[0].learn.facts[4] (\"fact-defined\")": "✅",
    "units[0].learn.facts[5] (\"fact-echo\")": "✅",
    "units[0].learn.facts[6] (\"fact-ttl\")": "✅",
    "units[0].learn.facts[7] (\"fact-traceroute\")": "✅",
    "units[0].learn.facts[8] (\"fact-tracert\")": "✅",
    "units[0].learn.facts[9] (\"fact-unreachable\")": "✅",
    "units[0].learn.facts[10] (\"fact-osi\")": "✅",
    "units[0].learn.facts[11] (\"fact-used\")": "✅",
    "units[0].practice[0].options[0] (question \"traceroute\")": "✅",
    "units[0].practice[0].options[1] (question \"traceroute\")": "✅",
    "units[0].practice[0].options[2] (question \"traceroute\")": "✅",
    "units[0].practice[1].options[0] (question \"no-reply\")": "✅",
    "units[0].practice[1].options[1] (question \"no-reply\")": "✅",
    "units[0].practice[1].options[2] (question \"no-reply\")": "✅",
    "units[0].practice[0].prompt (question \"traceroute\")": "✅",
    "units[0].practice[1].prompt (question \"no-reply\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-ping-traceroute",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-traceroute-os",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-icmp",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "iana-icmp-parameters",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "iana-ip-parameters",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "iana-protocol-numbers",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-azure-tcpip-tuning",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-ping",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-tracert",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-icmp",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1034",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1191",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1812",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-2151",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-2923",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4443",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4861",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4890",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-792",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9099",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 171,
    "digest": "53aa8f5e0b993a8df21adb17ea144e39b75deb186768d5d7b7f5e7d3d6651e00",
    "files": {
      "paloalto-icmp": "3b73a3584c1a7dd48e99bf5a9c6d0a1d407afba0ea28c011d525579113be2808",
      "cloudflare-icmp": "c06909ab1a0ccce146ffef72e46667e22f9014cc1a97ace7e8e8cf6170c31dc9",
      "microsoft-ping": "ed6ed10369c4857fb3f1293ede7c86b92410f2ea1830847303d483c85c3971e1",
      "rfc-2151": "dd194a685fea490195ee9d7f7a4fe68967b6fc2561eb9f72c28e04253034bf2b",
      "rfc-792": "58714393ded142bacf188d7e8977eef98f4110c4c87ac94595f750df5664c2c6",
      "iana-protocol-numbers": "87719866f1d7b0afb9acf32b120c3db3fb73289c8f010ea94e14a17502a2c614",
      "iana-icmp-parameters": "cd88e9dea6a0bfd1efec28bb3268702ce4ce94c6b82eee5f34b2df62b97c6ac2",
      "cisco-ping-traceroute": "0b593f8739811fb7b2f588075b262dfc6acdfc52ed328b3af3106b00470d777e",
      "rfc-2923": "d71f88438b257d0f735276427afe0fcfa3084d19c9fc1d22036a5bc0d04a19f4",
      "iana-ip-parameters": "da4e34e9d8b1873fdf11ecafc69f1eec8667e8fe5b556c00135348c737ec210d",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "microsoft-azure-tcpip-tuning": "f160d42fdcaadce62afcc24d59056b43b5540680716b5dfc49b175255e6312e1",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "microsoft-tracert": "d4011ecb7488344a411a0bb68f13c6d7dbf22cc541491e7bed4963ebce8c5c89",
      "cisco-traceroute-os": "d1d889593cf8d43104e77944417ccf172d149369621b350745eb42d78c77b6d7",
      "rfc-1191": "3de7c2cb99832c6d1929f9f918172865831848f77e8ab585488125581afa6b68",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "rfc-4890": "d95ca8bd14a0a7e139e77d3b29c430b65ff1360c013e3f02185dfbc1d636e7b9",
      "rfc-9099": "6deca72e1902172b598a9897ea6952c85cba26264e84faed4e75614e7f130254",
      "rfc-4443": "f20d1de8878e1142000bfeaa3ad1b0540fab7653a395cf7b07e81d2da2f650bf",
      "rfc-4861": "1a4309c117d765a7c0edfcb2297fc90c3c09f0fcae255f15e53b20748bcc09fb",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a"
    }
  },
  "items": {
    "title": "31f2a0cd477117034db64973cc31d263d2110328c3460c1f6a8c3580ec246818",
    "units[0].name": "48e72baf46617466a30fe8360ea6bbd6b9bc8b493ba7aad65db4dc99ac199f10",
    "units[0].osi": "93e6d0a9b42f4032e80da8245fa97c031bf35fc86ed09757a9aa2a69db2b2775",
    "backing (the lesson's subtitle and summary)": "bce3c3050e9e57fceaf1175c0b7f490eac7178cdb9b761d9c0978eb7855aaa87",
    "units[0].backing (the unit's full name and purpose)": "96ea28304cfb0967567d662302d367e145f74315c5238e04b4476055184fcd26",
    "units[0].scene.backing (the scene)": "bb1de45887d2204a3a0ac8a42d82c676db421db66d4bc24e9d3b9cc06e2a236f",
    "units[0].overview.hookBacking (the Overview hook)": "b3bece2c2d3116134948448f8f62ae9076806d3e6522a883ec818f250d51039f",
    "units[0].overview.backing (the Overview description)": "a7b3159a3e1a523906fdc2e7d9a0e4a293d632cc6e1571db93097b28a68caf3e",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "4a50fdd25ee4f2ff17b90aa671991ffc6db41b0b6fb825511b7fc0551f5bd2fe",
    "units[0].overview.facts[1] (Overview fact \"Tools\")": "2cfedcefa7ab766659fcc28767754445ae6115bbdaf03e6193329b91d612b1d8",
    "units[0].overview.facts[2] (Overview fact \"Messages here\")": "2d105fd4827eb56502eb9f20a702d9494870fcbe678777d80e828a81316463ad",
    "units[0].overview.facts[3] (Overview fact \"Ports\")": "5bca46c5ad121398cebeb3a89eea7eb50437171c65f6a13f83a7507bd3538545",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "1c8a653b23fac582bf31a0e983668e4dbcfddbe9615bf52e8f38c1effa70ac4c",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "ef549d785180c842308d6e0f7e154962bcb60eb198434bfabff0d9ed111974a2",
    "units[0].steps[0] (step \"echo-request\")": "9695b37ca73d92de58b3bb65b21488523d987e7b148f8d5d6dd2e4e178d093f7",
    "units[0].steps[0].facts[0] (step \"echo-request\", fact \"Command\")": "7596117c471c9e2a741a8f6123c4e892adfcf6c352ac69adb4efb71323d114fb",
    "units[0].steps[0].facts[1] (step \"echo-request\", fact \"Message\")": "7a734a78974a1d8554f9d12376797ba3828656b54d4b47beac3cdb78bbcaaa5c",
    "units[0].steps[0].facts[2] (step \"echo-request\", fact \"Ports\")": "ddfed54cc477a11bfb83ceec0ae10b06c2df65a32c1b541a483b80ba60fc85f1",
    "units[0].steps[0].facts[3] (step \"echo-request\", fact \"To\")": "594ff1eefc1e47538d2054a314f434a7d013608416f6167a0a7e80153b044d6e",
    "units[0].steps[0].events[0] (event \"m1\")": "c020e69decc640e94076f905f18c8e77a8a8d7e1708f4bc3ad63eba7d40fdbb2",
    "units[0].steps[1] (step \"echo-reply\")": "244a11ec74164a5e692f7b21b3e0aa4b3e0d8c7dc4d547bb503c12bf0c65d912",
    "units[0].steps[1].facts[0] (step \"echo-reply\", fact \"Answer\")": "9432f5049faf452d911b02911357f1879891af7db003b4881349429618db5a35",
    "units[0].steps[1].facts[1] (step \"echo-reply\", fact \"Round trip\")": "2aebafed1c41caa8383ff43cc56467fca2eab0ba4cd29a7fa374fcbc8129491d",
    "units[0].steps[1].facts[2] (step \"echo-reply\", fact \"Reply’s TTL\")": "5ed6213e2696b56263a6ff974bd9fa31f90cc06f1ce9a81704f9a8c6bab2632c",
    "units[0].steps[1].facts[3] (step \"echo-reply\", fact \"Lost\")": "c6fad2124007c2bc9f3b3bc8f9875fe185253f303633e42fdd0e433d69a7d3e0",
    "units[0].steps[1].events[0] (event \"m2\")": "e06d9584df3dba46c788c94c2a9e5006e8f8e925aa2f50276f4d7e0ee73a224b",
    "units[0].steps[1].events[1] (event \"answers-1\")": "bfca8c6e32363fdbe3bc0d722a183bbd2583e065731c1522fd9d9e2c6115c56d",
    "units[0].steps[2] (step \"time-exceeded-hop-1\")": "c36e0d14a631e585a1aebad9a296b4d0be0f7a7f9473bfc046947461c6830d58",
    "units[0].steps[2].facts[0] (step \"time-exceeded-hop-1\", fact \"Probe\")": "a447c2e7226b006a7500d89f318408baef1f1a318085a4aefb1cd82e54ad6615",
    "units[0].steps[2].facts[1] (step \"time-exceeded-hop-1\", fact \"Dropped by\")": "ba7394b6ced19ba824aee3482e0f66dc00388cb78d3ff4986d14e38455a11176",
    "units[0].steps[2].facts[2] (step \"time-exceeded-hop-1\", fact \"Answer\")": "03c2105eaf812c0b56ae1385e014ce718fea990726ecaef3612420eb8c350a7e",
    "units[0].steps[2].facts[3] (step \"time-exceeded-hop-1\", fact \"Time\")": "6dcd2c27420d222fa082bb73e134083d2575ea2663a50995e6a50b7ba4ff0bb8",
    "units[0].steps[2].events[0] (event \"m3\")": "6947efeb43d21054740bda08ba3a7c8004050bf2a498b24476a595ba4aa997af",
    "units[0].steps[2].events[1] (event \"m4\")": "43b88f37b30f172a0d113f1808fee2cd4243412fe324589168922754b461464f",
    "units[0].steps[2].events[2] (event \"answers-2\")": "74af84cb1065070f989c49494e005f1a76af8810d24e9c31e2b1db6ce5515caf",
    "units[0].steps[3] (step \"time-exceeded-hop-2\")": "17b5d6378e8b887dd1e0c946661da5acb3e20e71f65a01914783116cd592beff",
    "units[0].steps[3].facts[0] (step \"time-exceeded-hop-2\", fact \"Probe\")": "a06434fbf407fcf9473b49c84690aa6478455aba3a124fbe74d534bc6395fdb1",
    "units[0].steps[3].facts[1] (step \"time-exceeded-hop-2\", fact \"Dropped by\")": "3110c1758919dba3985653aae17de938de4b32efb9946a5e02daa6632544a843",
    "units[0].steps[3].facts[2] (step \"time-exceeded-hop-2\", fact \"Time\")": "5488551c6114fad807077fdd4a7c4d99487b86ddc9537cc7746ce7707c2d8238",
    "units[0].steps[3].facts[3] (step \"time-exceeded-hop-2\", fact \"Pattern\")": "b7823743510b85e43f8cb2e2a9ffaa43687c6f31baa8d8c6778f3eb735cbf222",
    "units[0].steps[3].events[0] (event \"m5\")": "8fb350d3e58a614a318dc7e320d215abbe21fa8bff93191c861abf5b9d122baf",
    "units[0].steps[3].events[1] (event \"m6\")": "43d64caf63166af5a51383c8b515f9abeb82928b8ee97304ae839fa511516462",
    "units[0].steps[3].events[2] (event \"answers-3\")": "809b1ba1116d420d0969111f2d1ff99f5b1e9a584541b7829738614a1f141413",
    "units[0].steps[4] (step \"traceroute\")": "f25077d451acf0314fa88041274fe5634cc6e9660e550c5bf5f8c8d3dda6be97",
    "units[0].steps[4].facts[0] (step \"traceroute\", fact \"Hops\")": "24658d1de038e1c0519ec3de119198a19153f4d92fb3efcaece70c597d07589e",
    "units[0].steps[4].facts[1] (step \"traceroute\", fact \"Path\")": "69b7efc48b3b88157bc69e3ab31b4e7bf1915600880ebfbb75da51fd1524836c",
    "units[0].steps[4].facts[2] (step \"traceroute\", fact \"Last answer\")": "3945f5568861ab48b09e3fea1a2da5a0dfc02e0f26e1ddce6262d5205793f17a",
    "units[0].steps[4].facts[3] (step \"traceroute\", fact \"Tools\")": "82ec9778949aa8b1e2276ed13370175bfc74fa00c502764140bd2e78eaa7e253",
    "units[0].steps[4].events[0] (event \"m7\")": "7ae24af05d89b75b944fea9c752ec1a8004fad8913e14fc8f123d88252b8838b",
    "units[0].steps[4].events[1] (event \"m8\")": "502fa55e8af4ea10ab659a001c02181cc8eb81baaaddde69d47712795a78b17c",
    "units[0].steps[4].events[2] (event \"answers-4\")": "ee764f80d885086fc8d679771409c0c41ce854d828445fd14439fe7864b7e5b7",
    "units[0].steps[4].events[3] (event \"m9\")": "91e72fe5800ac3c6f7386402d6dd65c701ea05b787eb8bc893853dc4accc59ce",
    "units[0].steps[4].events[4] (event \"m10\")": "ffc711717290b5decd87d5003c2e181f6fa848b326e413fe6146c4571c89a346",
    "units[0].steps[4].events[5] (event \"answers-5\")": "890d98b6035c1f4ded437c5d674005b35b74d2bd5a62aa0e4a11ee78dca9d481",
    "units[0].steps[4].events[6] (event \"m11\")": "8c58688f9b97fd3bb28e90fcced8997000efb4dc62b865d4f6a34ec41a3ef7fd",
    "units[0].steps[4].events[7] (event \"m12\")": "b7c9a1887cb70c733d2cbf92c08877f6d33e8bfa6bc22a62d4e7af1288fccf1b",
    "units[0].steps[4].events[8] (event \"answers-6\")": "4797a7c757264c49942db8e8396b16f978191f071c4764acb7ce58294e28f4dd",
    "units[0].steps[5] (step \"destination-unreachable\")": "9d32af646765d2e0dc14b869de1d1c6e6579080a490be69bbc0d0abe7cd05db1",
    "units[0].steps[5].facts[0] (step \"destination-unreachable\", fact \"Pinged\")": "f8d06aa2fbbde63ae5265d271cd1250f790e9f538ce8454db8ce3b76bcf9dc70",
    "units[0].steps[5].facts[1] (step \"destination-unreachable\", fact \"Answer from\")": "7f4bf73493f40296ecc86855f129fa53f6534c3e5429a16d2a622aebcaeb47ab",
    "units[0].steps[5].facts[2] (step \"destination-unreachable\", fact \"Message\")": "f3c54ce54c19dc7f1f24d4f56a144f0b836f21431f099892f1b2477ae3927df1",
    "units[0].steps[5].facts[3] (step \"destination-unreachable\", fact \"Other codes\")": "7194478a720ead4edaa633606127ec5b57ff91f57083ff461db3fc27e2afafa9",
    "units[0].steps[5].events[0] (event \"m13\")": "3fe2ed15656375bbc4600fa5d777397e9710ced0364d261280220d9706187391",
    "units[0].steps[5].events[1] (event \"m14\")": "5ab167e4cdcb15545c17312342e75976dbd8a9af8b6b3f41befca3be0436dfd1",
    "units[0].steps[5].events[2] (event \"answers-7\")": "04ce303148decd744396c1e197a9f3ed61b956f70b5268953802cb53bf0b89b7",
    "units[0].steps[0].deep[0] (step \"echo-request\", Go deeper)": "b96bfd36403543f56a65834a68ea821f543dbd3da95b5819f585b6c80f88c645",
    "units[0].steps[0].deep[1] (step \"echo-request\", Go deeper)": "cfe2b715db558c592987ba656a09862cc9e24f3c848380d872118e1bf007d5e3",
    "units[0].steps[0].deep[2] (step \"echo-request\", Go deeper)": "4ebab60d3c8e7806ba20d9ba0f704029ed37c4da321d7df6eac8a2630008e2d9",
    "units[0].steps[0].deep[3] (step \"echo-request\", Go deeper)": "208fd3052d9c14d83f4a263e0b2ba5567f0268e90fb4ef7cebe9a5334683c9fb",
    "units[0].steps[1].deep[0] (step \"echo-reply\", Go deeper)": "ec9b3dd83389e24d3550367efbcc1361c91ae7542edb9affad078b21486c0cec",
    "units[0].steps[1].deep[1] (step \"echo-reply\", Go deeper)": "a79f81cdee8380f384a99c5f7c1e6090c3c86483feba5e523691c28772869477",
    "units[0].steps[1].deep[2] (step \"echo-reply\", Go deeper)": "d9b05f15d5f6ec88a2bd54fc9a978d142148e660c56dc1e1bdec4899eddcb462",
    "units[0].steps[2].deep[0] (step \"time-exceeded-hop-1\", Go deeper)": "fcc46a6867b1aafe277db79b941841ea67cd185f3df329aa21f0da1c17ee7bf1",
    "units[0].steps[2].deep[1] (step \"time-exceeded-hop-1\", Go deeper)": "60b24b5f01291b550ef94d83c5b33dbed2ce17bc1b2cfe7fd29fb44d5f41d08c",
    "units[0].steps[2].deep[2] (step \"time-exceeded-hop-1\", Go deeper)": "b062e162cb96b84d28bec7be809c61185b28ae763698b14d395f9d1f719fd3c2",
    "units[0].steps[3].deep[0] (step \"time-exceeded-hop-2\", Go deeper)": "56cdedca1392fbefb79a35488c9ee73a56115217b9f83b929ed5c9d698e8143f",
    "units[0].steps[3].deep[1] (step \"time-exceeded-hop-2\", Go deeper)": "ccfef963d45d572cd755b4cf2b8288a35561e0540a68dd237cb9504d888cf8ec",
    "units[0].steps[4].deep[0] (step \"traceroute\", Go deeper)": "66d1a2d6a52d5c60567daf20c3a1c963b61e78b63c01a458f9252ae2fe890c2c",
    "units[0].steps[5].deep[0] (step \"destination-unreachable\", Go deeper)": "33a1084383047ac88c9b27ca6447f21f5c0e3ed1453d0b1e51a3f3fdfd1e561a",
    "units[0].steps[5].deep[1] (step \"destination-unreachable\", Go deeper)": "60666029253a8a518536e77482d5d641df2039fcaff3c0251850ee7278164106",
    "units[0].steps[5].deep[2] (step \"destination-unreachable\", Go deeper)": "f6762320981dd1ac9d45eabe301ba9659c5f3dad9e009bec25dc56b543540945",
    "units[0].learn.lead[0] (\"lead-1\")": "f66e2973f67d92bd883d51d16a457fbe8d883d727b2afff32c0d7211f95f7770",
    "units[0].learn.lead[1] (\"lead-2\")": "c95b3bb6a2ab38296b2055b0487faf1b56817550af3b5b8d5c600c3bc332291f",
    "units[0].learn.terms[0] (\"term-echo-request\")": "1ab5e8c7ea00eeb2dd799ab1d53fc3dd9b2771a6f5ea867364a5e7c5d71e04e9",
    "units[0].learn.terms[1] (\"term-echo-reply\")": "0cb2ce5b543d8618980119c4cd682ffa915374e7669ab280dbd8cd2358431096",
    "units[0].learn.terms[2] (\"term-ping\")": "18671d6bcb937f13dc47536c444b73f8025848539beb3fab304d2eb6498485d8",
    "units[0].learn.terms[3] (\"term-latency\")": "2c7cc75188a8a152c72b681f633a8931c9b58d878a41ac7c6b628fe8bf3e4099",
    "units[0].learn.terms[4] (\"term-ttl\")": "dbd30818dfd3dec184e25c9d200ea18099b23bbd48df20752d13314917139d83",
    "units[0].learn.terms[5] (\"term-time-exceeded\")": "dfec1f0d6fb557ee575594bd468f24cb01f9938ea63aa8c84b018d53f9f511db",
    "units[0].learn.terms[6] (\"term-traceroute\")": "3d5c812417bf6ce976936ca0b771969c4e6e7e275991e448ab26c803b686ab98",
    "units[0].learn.terms[7] (\"term-unreachable\")": "4c124654839b3166d01d12e2c74b54e97ac196049366699dda16dce9544c62d0",
    "units[0].learn.terms[8] (\"term-loss\")": "23b94a5fbcd680607906ac0b85a546ada2c9c1c7a93d146bb422c41f00daa85f",
    "units[0].learn.pattern (\"pattern\")": "828de8300d743acfaed2f602d34149dfbfbdfcec0737057e599e44cdfd64f25a",
    "units[0].learn.why[0] (\"why-1\")": "eaf8c942019f2183957fdaf99a57549756cfa09537ea60d78049e93cf2b59fec",
    "units[0].learn.deep[0] (\"deep-types\", Learn's Go deeper)": "56a36f2cf3559d2e7433eb62edf144a16cea9197b8803a697e71d55644c70863",
    "units[0].learn.deep[1] (\"deep-ports\", Learn's Go deeper)": "8ebfa889c497bbb6919e84a23fedf0a903c4e485fc1e8fe4b3649a33f513894f",
    "units[0].learn.deep[2] (\"deep-firewalls\", Learn's Go deeper)": "4a18194aac7dba89f55b1ad9ed66395a3952e45153bc7ef41341bc3af824336c",
    "units[0].learn.deep[3] (\"deep-ipv6\", Learn's Go deeper)": "cddf476b68eae0646deb1e34c88e3c4f3de3ce84789a7ea111ec7136252b0a15",
    "units[0].learn.facts[0] (\"fact-types\")": "26910275f95eff7cfede72d08abf20cc57f92f1165eaed072d73a444396c9e13",
    "units[0].learn.facts[1] (\"fact-ports\")": "518cdc0f5f066aa88c1a53196e67e91242c2f776957fad3a8178c01535babace",
    "units[0].learn.facts[2] (\"fact-rides\")": "74c993504d05db2c01c22f2c145373cbd62af7999cc6f941552399f5f2238559",
    "units[0].learn.facts[3] (\"fact-tools\")": "f848a3a636e836803d7fea6aa71f9bd6c2a71a2d7108ae3f2a6dd485d4e3341d",
    "units[0].learn.facts[4] (\"fact-defined\")": "38cbca1f5aae149fad3dabb344ba7797a3d4d4588adb86b27f4f2c4ab8afe7d2",
    "units[0].learn.facts[5] (\"fact-echo\")": "89b3f78be0604b44795a6243d170c7f784b127a71418d883436a5f179efe0a1b",
    "units[0].learn.facts[6] (\"fact-ttl\")": "726989234dad3d2e474a136040c0560a22c795352e392438a9646b5c272c6572",
    "units[0].learn.facts[7] (\"fact-traceroute\")": "e6e6db01abbd04418c2d6c186632a18d2aa20dabd6c2469926de0ee6507ac217",
    "units[0].learn.facts[8] (\"fact-tracert\")": "9b354722a7b25e4a93a8d98f68cdcdb6d1389fe5d1772356d0616b1b70bcbe5d",
    "units[0].learn.facts[9] (\"fact-unreachable\")": "690a9fc10dd27c3978ed804bd7ad9024c8deeb6725f7b3d4afb63dc0af79cc97",
    "units[0].learn.facts[10] (\"fact-osi\")": "d048df717a4c6af573a414b5227f2d5f34566ae7c565f52d17e83872843dec0b",
    "units[0].learn.facts[11] (\"fact-used\")": "4b4ae27bd69aa20a6439f73677953128b0473a3727ce0bb33998c71607a4dc0f",
    "units[0].practice[0].options[0] (question \"traceroute\")": "5fc45af1f0a5769a2f2790482e5c7d22bf7ae58d2f492a52c0ce98c4abbf8646",
    "units[0].practice[0].options[1] (question \"traceroute\")": "c10cb2038d9f0d3ab883fff0548c395291f9aa6f6e84a86ff607be5d50aab9b2",
    "units[0].practice[0].options[2] (question \"traceroute\")": "ace2a5425c37bd4e24c70a826ac189a8ba9ea719c48cf0acfb5811380951b8f9",
    "units[0].practice[1].options[0] (question \"no-reply\")": "22f9c37b8fc0053f7422254791aa7e9368ddda2d664ccad35fa49728e760709a",
    "units[0].practice[1].options[1] (question \"no-reply\")": "e3f253d8e6ca7f75545a7a68f70a9b7d6f979a4c42c8cc4ed0998d3f38a600c4",
    "units[0].practice[1].options[2] (question \"no-reply\")": "b2b7a8ab544eb757c740357ccc69c8b3aff280b808fbcedaf3e968f4dc7e24bc",
    "units[0].practice[0].prompt (question \"traceroute\")": "77ec31510acea219a7cdbe90e7ce03f86a74fb952c09d11c14307ccb380a518f",
    "units[0].practice[1].prompt (question \"no-reply\")": "ac171fbcbec39d94bd025b0d0c14ca0c58cf89e6ec1e677c7a55c2717d8adf3f"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-icmp

Checked on 2026-11-12 against each source fetched from its publisher in this run. The Cloudflare page refused a command-line read (a check page), so it was read in the built-in browser and its text saved.

## Claims

### units[0].osi — ✅

Layers: 3.

- `paloalto-icmp` §ICMP
  > is another one of the main protocols of the Internet Protocol suite; it operates at the Network layer of the OSI model.
- `cloudflare-icmp` §What is ICMP?
  > The Internet Control Message Protocol (ICMP) is a network layer protocol used by network devices to diagnose network communication issues.
- Note: two independent vendors (Palo Alto Networks and Cloudflare) each put ICMP at the network layer. No allowed source met in this run puts it at another layer. Both pages are live.

### units[0].steps[0].deep[0] (step "echo-request", Go deeper) — ✅

"Ping first finds the name’s address."

- `microsoft-ping` §Introduction
  > If pinging the IP address is successful, but pinging the computer name isn't, you might have a name resolution problem. In this case, make sure the computer name you're specifying can be resolved through the local Hosts file, by using Domain Name System (DNS) queries, or through NetBIOS name resolution techniques.
- `rfc-2151` §3.2
  > Host IP address or host name of target system
- `rfc-2151` §3.2
  > PING thumper.bellcore.com (128.96.41.1): 64 data bytes
- Note: Microsoft says pinging a name depends on that name being resolved; RFC 2151's sample output shows the name turned into an address before any reply. The claim leaves out that a user can ping an address directly, which needs no lookup.
- Note: RFC 2151 is Informational and not obsoleted; the Microsoft page is live (updated 2024-11-01).

### units[0].steps[0].deep[1] (step "echo-request", Go deeper) — ✅

"ICMP sits directly on IP (protocol number 1), with no ports of its own. An echo request is type 8, code 0, with an ID and a sequence number so replies can be matched up."

- `rfc-792` §Message Formats, page 2
  > ICMP messages are sent using the basic IP header.
- `rfc-792` §Message Formats, page 2
  > Protocol ICMP = 1
- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message. Code 0
- `rfc-792` §Echo or Echo Reply Message, page 14
  > If code = 0, an identifier to aid in matching echos and replies, may be zero.
- `rfc-792` §Echo or Echo Reply Message, page 15
  > The identifier and sequence number may be used by the echo sender to aid in matching the replies with the echo requests. For example, the identifier might be used like a port in TCP or UDP to identify a session
- `iana-protocol-numbers` §Assigned Internet Protocol Numbers
  > 1 ICMP Internet Control Message
- `iana-icmp-parameters` §ICMP Type Numbers
  > 8 Echo
- Note: RFC 792 is the defining standard for ICMP's message formats, its type and code values and its place on IP; its formats carry no port field, and it describes the echo identifier as something used like a port. IANA's registries are the live record of protocol number 1 and type 8. RFC 792 is an Internet Standard, not obsoleted; its updates (RFC 950, 4884, 6633, 6918) do not change echo, protocol number or these types.

### units[0].steps[0].deep[2] (step "echo-request", Go deeper) — ✅

"Ping sends a series of them and times each reply."

- `rfc-2151` §3.2
  > Ping uses a series of Internet Control Message Protocol (ICMP) [22] Echo messages to determine if a remote host is active or inactive, and to determine the round-trip delay in communicating with it.
- `cisco-ping-traceroute` §Ping Command
  > It uses a series of Internet Control Message Protocol (ICMP) Echo messages to determine:
- `microsoft-ping` §Introduction
  > The receipt of the corresponding echo Reply messages is displayed, along with round-trip times.
- Note: RFC 2151, Cisco and Microsoft are independent. All three pages are live and describe current tools.

### units[0].steps[0].deep[3] (step "echo-request", Go deeper) — ✅

"Firewalls can block pings, so no reply doesn’t always mean the server is down."

- `rfc-2923` §3
  > ICMP black holes are often caused by over-zealous security administrators who block all ICMP messages.
- `paloalto-icmp` §ICMP
  > For ICMP, you can drop certain types of packets or suppress the sending of certain packets.
- `cisco-ping-traceroute` §Access List Command
  > At the end of an access-list command there is always an implicit deny all. This means that the ICMP packets that enter the Serial 0 interface on Router4 are denied
- Note: the sources show ICMP, and so pings, being blocked by filters while the device behind them is up; the second half of the claim follows from that.
- Note: RFC 2923 is Informational, not obsoleted. The vendor pages are live.

### units[0].steps[1].deep[0] (step "echo-reply", Go deeper) — ✅

"An echo reply is type 0."

- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message.
- `iana-icmp-parameters` §ICMP Type Numbers
  > 0 Echo Reply
- Note: RFC 792 defines the echo reply message and its type value; the IANA registry is live.

### units[0].steps[1].deep[1] (step "echo-reply", Go deeper) — ✅

"Ping also shows the reply’s TTL, here 60: it probably started at 64 and crossed 4 routers."

- `microsoft-ping` §Example of the ping command output
  > Reply from 192.168.239.132: bytes=32 time=101ms TTL=124
- `rfc-2151` §3.2
  > 72 bytes from 128.96.41.1: icmp_seq=0 ttl=240 time=641.8 ms
- `iana-ip-parameters` §IP Time to Live Parameter
  > The current recommended default time to live (TTL) for the Internet Protocol (IP) is 64
- `rfc-1812` §5.3.1
  > Each router (or other module) that handles a packet MUST decrement the TTL by at least one, even if the elapsed time was much less than a second.
- Note: two independent tools' output shows the reply's TTL. IANA's registry records 64 as the recommended default, and RFC 1812 (the defining standard for router behaviour) has each router take at least one off. The claim says "probably", so it does not overstate the starting value.

### units[0].steps[1].deep[2] (step "echo-reply", Go deeper) — ✅

"At the end, ping prints the minimum, average and maximum times and the loss."

- `rfc-2151` §3.2
  > 6 packets transmitted, 5 packets received, 16% packet loss round-trip min/avg/max = 482.1/880.5/1447.4 ms
- `cisco-ping-traceroute` §Ping Command
  > Success rate is 100 percent (5/5), round-trip min/avg/max = 4/6/8 ms
- `microsoft-azure-tcpip-tuning` §Measure round-trip time and packet loss
  > The output of PING shows the minimum/maximum/average latency between a source and destination. It shows packet loss.
- Note: three independent sources. All live.

### units[0].steps[2].deep[0] (step "time-exceeded-hop-1", Go deeper) — ✅

"Time exceeded is ICMP type 11, code 0, and it carries the start of the dropped packet so the sender can match it up."

- `rfc-792` §Time Exceeded Message, page 6
  > Type 11 Code 0 = time to live exceeded in transit;
- `rfc-792` §Time Exceeded Message, page 6
  > The internet header plus the first 64 bits of the original datagram's data.
- `rfc-1122` §3.2.2
  > Every ICMP error message includes the Internet header and at least the first 8 data octets of the datagram that triggered the error
- `iana-icmp-parameters` §Type 11 — Time Exceeded
  > 0 Time to Live exceeded in Transit
- Note: RFC 792 defines the time exceeded message, its type and codes, and its copy of the original header, which it says the host uses to match the message to the process. The claim leaves out code 1 (reassembly), a rarer case. RFC 1122 is an Internet Standard, not obsoleted; its updates do not touch this rule.

### units[0].steps[2].deep[1] (step "time-exceeded-hop-1", Go deeper) — ✅

"The classic traceroute, and Cisco’s, sends UDP probes; tracert on Windows sends echo requests."

- `rfc-2151` §3.4
  > The original version of Traceroute works by sending a sequence of User Datagram Protocol (UDP) datagrams to an invalid port address at the remote host.
- `cisco-ping-traceroute` §Traceroute Command
  > The device (for example, a router or a PC) sends out a sequence of User Datagram Protocol (UDP) datagrams to an invalid port address at the remote host.
- `microsoft-tracert` §Introduction
  > This diagnostic tool determines the path taken to a destination by sending Internet Control Message Protocol (ICMP) echo Request or ICMPv6 messages to the destination with incrementally increasing time to live (TTL) field values.
- `cisco-traceroute-os` §Microsoft Windows
  > The MS Windows tracert command uses ICMP echo request datagrams instead of UDP datagrams as probes.
- Note: each half has two independent sources (RFC 2151 and Cisco; Microsoft and Cisco). All live.

### units[0].steps[2].deep[2] (step "time-exceeded-hop-1", Go deeper) — ✅

"Each hop is usually probed three times, which is why each line shows three times."

- `rfc-2151` §3.4
  > -q is the number of UDP packets that will be sent with each time-to-live setting (default = 3)
- `cisco-ping-traceroute` §Traceroute Command
  > Three datagrams are sent, each with a Time-To-Live (TTL) field value set to one.
- `cisco-ping-traceroute` §Traceroute Command
  > 2 172.16.23.3 20 msec 16 msec 16 msec
- Note: "usually" matches the default of three; the count can be changed.

### units[0].steps[3].deep[0] (step "time-exceeded-hop-2", Go deeper) — ✅

"Each time is a round trip to that hop: a rough idea of the delay."

- `cisco-ping-traceroute` §Performance
  > You can obtain the round-trip time (RTT) with the ping and traceroute commands. This is the time required to send an echo packet and get an answer back. This can provide a rough idea of the delay on the link.
- `rfc-2151` §3.4
  > The Traceroute program displays the round-trip delay associated with each of the attempts.

### units[0].steps[3].deep[1] (step "time-exceeded-hop-2", Go deeper) — ✅

"A router set not to send ICMP shows as * * * in traceroute, but the hops after it still appear."

- `microsoft-tracert` §Introduction
  > However, some routers don't return time Exceeded messages for packets with expired TTL values and are invisible to the tracert command. In this case, a row of asterisks
- `cisco-ping-traceroute` §IP Traceroute Text Characters
  > The probe timed out
- `rfc-1812` §5.2.7.3
  > A router MAY have a per-interface option to disable origination of these messages on that interface, but that option MUST default to allowing the messages to be originated.
- Note: Microsoft's own sample output on the same page shows hops after a row of asterisks still listed. The claim leaves out other reasons a hop can show asterisks (a lost probe, a time-out).

### units[0].steps[4].deep[0] (step "traceroute", Go deeper) — ✅

"Each line of output is one hop: its address (and name, if it has one) and three round-trip times."

- `rfc-2151` §3.4
  > 1 smc.bbnplanet.net (192.80.64.5) 10 ms 0 ms 0 ms
- `microsoft-tracert` §Parameters
  > Stops attempts to resolve the IP addresses of intermediate routers to their names.
- `cisco-ping-traceroute` §IP Traceroute Text Characters
  > For each node, the round-trip time in milliseconds for the specified number of probes
- `cisco-ping-traceroute` §Traceroute Command
  > 1 172.16.12.2 4 msec 4 msec 4 msec
- Note: the RFC 2151 sample shows names where they exist and the bare address where none was assigned; Cisco's shows address and three times per hop.

### units[0].steps[5].deep[0] (step "destination-unreachable", Go deeper) — ✅

"Destination unreachable is type 3, with a code for why: 0 network unreachable, 1 host unreachable, 3 port unreachable (nothing listening on that UDP port), 4 fragmentation needed (used to find the largest packet a path can carry)."

- `rfc-792` §Destination Unreachable Message, page 4
  > Type 3 Code 0 = net unreachable; 1 = host unreachable; 2 = protocol unreachable; 3 = port unreachable; 4 = fragmentation needed and DF set;
- `iana-icmp-parameters` §Type 3 — Destination Unreachable
  > 1 Host Unreachable
- `rfc-1812` §5.2.7.1
  > 3 = Port Unreachable - generated if the designated transport protocol (e.g., UDP) is unable to demultiplex the datagram in the transport layer of the final destination but has no protocol mechanism to inform the sender;
- `rfc-1122` §3.2.2.1
  > 3 (Port Unreachable), when the designated transport protocol (e.g., UDP) is unable to demultiplex the datagram but has no protocol mechanism to inform the sender.
- `rfc-1191` §2
  > If any of the datagrams are too large to be forwarded without fragmentation by some router along the path, that router will discard them and return ICMP Destination Unreachable messages with a code meaning "fragmentation needed and DF set"
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > The device sends back an ICMP Fragmentation Needed (Type 3, Code 4) message that contains its MTU. This ICMP message allows the source host to reduce its Path MTU appropriately. The process is called Path MTU Discovery (PMTUD).
- Note: RFC 792 defines the type and codes; RFC 1122 adds the host rules for code 3. The claim lists four of the codes and leaves out the rest. RFC 1191 is a Draft Standard, not obsoleted.

### units[0].steps[5].deep[1] (step "destination-unreachable", Go deeper) — ✅

"Here, host unreachable comes once the router has asked for the machine with ARP and had no answer."

- `rfc-1812` §3.3.2
  > it SHOULD queue up to a small number of datagrams breifly while performing the ARP request/reply sequence, and reply that the destination is unreachable to one of the queued datagrams only when this proves fruitless.
- `rfc-1812` §5.2.7.1
  > 1 = Host Unreachable - generated by a router if a forwarding path (route) to the destination host on a directly connected network is not available (does not respond to ARP);
- Note: RFC 1812 is the standard that defines how an IPv4 router behaves, including when it sends this code. It is not obsoleted; its updates (RFC 2644, 6633) do not touch these sections.

### units[0].steps[5].deep[2] (step "destination-unreachable", Go deeper) — ✅

"Firewalls often block ICMP, but blocking type 3 code 4 breaks path MTU discovery."

- `rfc-2923` §3
  > ICMP black holes are often caused by over-zealous security administrators who block all ICMP messages.
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > If a network firewall blocks the ICMP Fragmentation Needed message, the sender remains unaware of the need to lower the MSS and repeatedly retransmits the packet.
- `rfc-1191` §2
  > Upon receipt of such a message (henceforth called a "Datagram Too Big" message), the source host reduces its assumed PMTU for the path.
- Note: RFC 2923 and Microsoft independently state the harm; RFC 1191 shows discovery rests on that message.

### units[0].learn.lead[0] ("lead-1") — ✅

"ICMP is how the network talks about itself: “are you there?”, “yes”, “your packet ran out of hops here”, “I can’t deliver this”."

- `rfc-792` §Introduction
  > Occasionally a gateway or destination host will communicate with a source host, for example, to report an error in datagram processing. For such purposes this protocol, the Internet Control Message Protocol (ICMP), is used.
- `rfc-1812` §4.3.1
  > ICMP is an auxiliary protocol, which provides routing, diagnostic and error functionality for IP.
- Note: RFC 792 defines ICMP and its purpose; the four sayings match its echo, echo reply, time exceeded and destination unreachable messages.

### units[0].learn.lead[1] ("lead-2") — ✅

"When something goes wrong, the network can tell the sender, though some packets are still lost without a note."

- `rfc-792` §Introduction
  > There are still no guarantees that a datagram will be delivered or a control message will be returned. Some datagrams may still be undelivered without any report of their loss.
- Note: RFC 792 defines ICMP and states this itself.

### units[0].learn.terms[0] ("term-echo-request") — ✅

"Echo request: “Are you there?”"

- `rfc-1122` §3.2.2.6
  > Every host MUST implement an ICMP Echo server function that receives Echo Requests and sends corresponding Echo Replies.
- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message.
- Note: RFC 792 defines the echo message. "Are you there?" is the everyday sense of a message every host must answer.

### units[0].learn.terms[1] ("term-echo-reply") — ✅

"Echo reply: “Yes, I’m here”"

- `rfc-1122` §3.2.2.6
  > Every host MUST implement an ICMP Echo server function that receives Echo Requests and sends corresponding Echo Replies.
- `rfc-792` §Echo or Echo Reply Message, page 15
  > The data received in the echo message must be returned in the echo reply message.
- Note: RFC 792 defines the echo reply.

### units[0].learn.terms[2] ("term-ping") — ✅

"Ping: the tool that sends those."

- `microsoft-ping` §Introduction
  > Verifies IP-level connectivity to another TCP/IP computer by sending Internet Control Message Protocol (ICMP) echo Request messages.
- `rfc-2151` §3.2
  > Ping uses a series of Internet Control Message Protocol (ICMP) [22] Echo messages
- `cisco-ping-traceroute` §Ping Command
  > The ping command first sends an echo request packet to an address, then waits for a reply.

### units[0].learn.terms[3] ("term-latency") — ✅

"Latency (round-trip time): how long there and back."

- `microsoft-azure-tcpip-tuning` §Measure round-trip time and packet loss
  > The PING utility available in Windows and Linux provides the easiest way to measure RTT and packet loss. The output of PING shows the minimum/maximum/average latency between a source and destination.
- `cisco-ping-traceroute` §Performance
  > This is the time required to send an echo packet and get an answer back.
- `microsoft-ping` §Introduction
  > The receipt of the corresponding echo Reply messages is displayed, along with round-trip times.
- Note: latency can also mean the one-way delay; the lesson names it as the round-trip time ping shows, as Microsoft's Azure page does.

### units[0].learn.terms[4] ("term-ttl") — ✅

"TTL: the hop counter on every packet."

- `rfc-791` §3.1
  > This field indicates the maximum time the datagram is allowed to remain in the internet system.
- `rfc-1812` §5.3.1
  > Since this is very often the case, the TTL is effectively a hop count limit on how far a datagram can propagate through the Internet.
- Note: RFC 791 defines the IPv4 header's TTL field; RFC 1812 says it works in practice as a hop count. The claim leaves out that it was first defined as a time limit. RFC 791 is an Internet Standard, not obsoleted; its updates do not touch TTL.

### units[0].learn.terms[5] ("term-time-exceeded") — ✅

"Time exceeded: “Your packet ran out of hops here”."

- `rfc-792` §Time Exceeded Message, page 6
  > 0 = time to live exceeded in transit;
- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be discarded, and if the destination is not a multicast address the router MUST send an ICMP Time Exceeded message, Code 0 (TTL Exceeded in Transit) message to the source.
- Note: RFC 792 defines the message; RFC 1812 defines when a router sends it.

### units[0].learn.terms[6] ("term-traceroute") — ✅

"Traceroute: listing every router on the way."

- `rfc-2151` §3.4
  > Traceroute is another common TCP/IP tool, this one allowing users to learn about the route that packets take from their local host to a remote host.
- `microsoft-tracert` §Introduction
  > The path displayed is the list of near/side router interfaces of the routers in the path between a source host and a destination.
- `cisco-ping-traceroute` §Traceroute Command
  > The traceroute command is used to discover the routes that packets actually take when they travel to their destination.
- Note: routers that send no time exceeded show only as asterisks (taught in steps[3].deep[1]).

### units[0].learn.terms[7] ("term-unreachable") — ✅

"Destination unreachable: “I can’t deliver this”."

- `rfc-1812` §5.2.7.1
  > The ICMP Destination Unreachable message is sent by a router in response to a packet which it cannot forward because the destination (or next hop) is unreachable or a service is unavailable.
- `rfc-792` §Destination Unreachable Message, page 5
  > If, in the destination host, the IP module cannot deliver the datagram because the indicated protocol module or process port is not active, the destination host may send a destination unreachable message to the source host.
- Note: RFC 792 defines the message; RFC 1812 defines when routers send it.

### units[0].learn.terms[8] ("term-loss") — ✅

"Packet loss: pings that never come back."

- `cisco-ping-traceroute` §Ping Command
  > It uses a series of Internet Control Message Protocol (ICMP) Echo messages to determine: Whether a remote host is active or inactive. The round-trip delay used to communicate with the host. Packet loss.
- `rfc-2151` §3.2
  > 6 packets transmitted, 5 packets received, 16% packet loss
- `microsoft-azure-tcpip-tuning` §Measure round-trip time and packet loss
  > The PING utility available in Windows and Linux provides the easiest way to measure RTT and packet loss.
- Note: packet loss in general means any lost packet; the lesson gives it as ping measures it.

### units[0].learn.pattern ("pattern") — ✅

"Echo Request, Echo Reply, Time Exceeded, Unreachable. Ping uses the first two. Traceroute uses time exceeded, one hop at a time."

- `microsoft-ping` §Introduction
  > by sending Internet Control Message Protocol (ICMP) echo Request messages. The receipt of the corresponding echo Reply messages is displayed
- `cisco-ping-traceroute` §Ping Command
  > The ping command first sends an echo request packet to an address, then waits for a reply.
- `microsoft-tracert` §Introduction
  > This command determines the path by sending the first echo Request message with a TTL of 1 and incrementing the TTL by 1 on each subsequent transmission until the target responds or the maximum number of hops is reached.
- `cisco-ping-traceroute` §Traceroute Command
  > The TTL value of 1 causes the datagram to "timeout" as soon as it hits the first router in the path; this router then responds with an ICMP Time Exceeded Message (TEM) that indicates that the datagram has expired.
- `rfc-1812` §5.3.1
  > ICMP Time Exceeded messages are required because the traceroute diagnostic tool depends on them.

### units[0].learn.why[0] ("why-1") — ✅

"When something on the network fails, you need to find where. Ping answers “can I reach it, and how fast?”, traceroute answers “which way, and where does it slow down?”, and the error notes tell senders why a packet didn’t arrive."

- `microsoft-ping` §Introduction
  > ping is the primary TCP/IP command used to troubleshoot connectivity, reachability, and name resolution.
- `rfc-2151` §3.2
  > to determine if a remote host is active or inactive, and to determine the round-trip delay in communicating with it.
- `microsoft-tracert` §Introduction
  > This diagnostic tool determines the path taken to a destination
- `rfc-2151` §3.4
  > The Traceroute program displays the round-trip delay associated with each of the attempts.
- `cisco-ping-traceroute` §Performance
  > This can provide a rough idea of the delay on the link. However, these figures are not precise enough to be used for performance evaluation.
- `rfc-1812` §5.2.7.1
  > A router MUST be able to generate ICMP Destination Unreachable messages and SHOULD choose a response code that most closely matches the reason the message is being generated.
- Note: per-hop times give only a rough picture of where delay builds up, as Cisco says; the lesson says "rough idea" in Watch. "Tell senders why" is the ordinary case; lead-2 gives the exception.

### units[0].learn.deep[0] ("deep-types", Learn's Go deeper) — ✅

"ICMP types worth knowing: 0 echo reply, 3 destination unreachable, 5 redirect, 8 echo request, 11 time exceeded."

- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message.
- `rfc-792` §Destination Unreachable Message, page 4
  > Type 3
- `rfc-792` §Redirect Message, page 12
  > Type 5 Code 0 = Redirect datagrams for the Network.
- `rfc-792` §Time Exceeded Message, page 6
  > Type 11 Code 0 = time to live exceeded in transit;
- `iana-icmp-parameters` §ICMP Type Numbers
  > 5 Redirect
- Note: RFC 792 defines each type; the live IANA registry lists 0, 3, 5, 8 and 11 as assigned and not deprecated (RFC 6918 deprecates other types, not these).

### units[0].learn.deep[1] ("deep-ports", Learn's Go deeper) — ✅

"ICMP has no ports of its own; an echo’s identifier is used like one."

- `rfc-792` §Message Formats, page 2
  > The first octet of the data portion of the datagram is a ICMP type field; the value of this field determines the format of the remaining data.
- `rfc-792` §Echo or Echo Reply Message, page 15
  > For example, the identifier might be used like a port in TCP or UDP to identify a session, and the sequence number might be incremented on each echo request sent.
- Note: RFC 792 defines ICMP's message formats; none has a port field.

### units[0].learn.deep[2] ("deep-firewalls", Learn's Go deeper) — ✅

"Because it can be used to map a network, many firewalls limit it."

- `rfc-4890` §3.2
  > A major security consideration is preventing attackers from probing the site to determine the topology and identify hosts that might be vulnerable to attack.
- `rfc-4890` §3
  > The most common way of doing this is to establish strict filtering policies in site firewalls to limit the unauthenticated ICMPv6 messages that can pass between the site and the wider Internet.
- `rfc-9099` §2.1.4
  > even a simple traceroute will expose most of the routers on a path.
- `paloalto-icmp` §ICMP
  > For ICMP, you can drop certain types of packets or suppress the sending of certain packets.
- Note: RFC 4890 speaks of ICMPv6; Palo Alto shows the same filtering for ICMP. RFC 4890 and RFC 9099 are Informational and not obsoleted.

### units[0].learn.deep[3] ("deep-ipv6", Learn's Go deeper) — ✅

"IPv6 uses ICMPv6, which also takes over ARP’s job."

- `rfc-4443` §2
  > ICMPv6 is used by IPv6 nodes to report errors encountered in processing packets, and to perform other internet-layer functions, such as diagnostics (ICMPv6 "ping").
- `rfc-4861` §3.1
  > The IPv6 Neighbor Discovery protocol corresponds to a combination of the IPv4 protocols Address Resolution Protocol [ARP], ICMP Router Discovery [RDISC], and ICMP Redirect [ICMPv4].
- `rfc-4861` §3.1
  > Placing address resolution at the ICMP layer makes the protocol more media-independent than ARP
- Note: RFC 4443 defines ICMPv6 and RFC 4861 defines Neighbor Discovery, which does address resolution with ICMPv6 messages. Neither is obsoleted; their updates do not change this.

### units[0].learn.facts[0] ("fact-types") — ✅

"Types: 0 reply, 3 unreachable, 8 request, 11 time exceeded (code 0: the TTL ran out in transit)"

- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message.
- `rfc-792` §Destination Unreachable Message, page 4
  > Type 3
- `rfc-792` §Time Exceeded Message, page 6
  > Type 11 Code 0 = time to live exceeded in transit;
- `iana-icmp-parameters` §ICMP Type Numbers
  > 11 Time Exceeded
- `iana-icmp-parameters` §Type 11 — Time Exceeded
  > 0 Time to Live exceeded in Transit
- Note: RFC 792 defines these types and codes.

### units[0].learn.facts[1] ("fact-ports") — ✅

"Ports: none of its own; an echo’s identifier is used like one"

- `rfc-792` §Message Formats, page 2
  > The first octet of the data portion of the datagram is a ICMP type field; the value of this field determines the format of the remaining data.
- `rfc-792` §Echo or Echo Reply Message, page 15
  > the identifier might be used like a port in TCP or UDP to identify a session
- Note: as deep-ports.

### units[0].learn.facts[2] ("fact-rides") — ✅

"Rides on: IP, protocol 1"

- `rfc-792` §Message Formats, page 2
  > ICMP messages are sent using the basic IP header.
- `iana-protocol-numbers` §Assigned Internet Protocol Numbers
  > 1 ICMP Internet Control Message
- Note: RFC 792 defines ICMP's protocol number; the IANA registry is live.

### units[0].learn.facts[3] ("fact-tools") — ✅

"Tools: ping, traceroute, tracert"

- `microsoft-ping` §Introduction
  > by sending Internet Control Message Protocol (ICMP) echo Request messages.
- `microsoft-tracert` §Introduction
  > by sending Internet Control Message Protocol (ICMP) echo Request or ICMPv6 messages to the destination with incrementally increasing time to live (TTL) field values.
- `rfc-2151` §3.2
  > Ping uses a series of Internet Control Message Protocol (ICMP) [22] Echo messages
- `rfc-2151` §3.4
  > this router will then respond with an ICMP Time Exceeded Message (TEM) indicating that the datagram has expired.
- `cisco-ping-traceroute` §Traceroute Command
  > this router then responds with an ICMP Time Exceeded Message (TEM) that indicates that the datagram has expired.

### units[0].learn.facts[4] ("fact-defined") — ✅

"Defined in: RFC 792"

- `rfc-792` §Introduction
  > For such purposes this protocol, the Internet Control Message Protocol (ICMP), is used.
- `iana-protocol-numbers` §Assigned Internet Protocol Numbers
  > 1 ICMP Internet Control Message
- Note: RFC 792 is the document that defines ICMP (for IPv4) and is not obsoleted; IANA's entry for protocol 1 names RFC 792 as its reference. Later RFCs update it without replacing it.

### units[0].learn.facts[5] ("fact-echo") — ✅

"Echo request: type 8, code 0, with an identifier and a sequence number that come back in the reply, so ping can match them; the reply carries back the same data"

- `rfc-792` §Echo or Echo Reply Message, page 14
  > 8 for echo message; 0 for echo reply message. Code 0
- `rfc-792` §Echo or Echo Reply Message, page 15
  > The data received in the echo message must be returned in the echo reply message.
- `rfc-792` §Echo or Echo Reply Message, page 15
  > The echoer returns these same values in the echo reply.
- Note: RFC 792 defines the echo message format.

### units[0].learn.facts[6] ("fact-ttl") — ✅

"TTL: set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped"

- `rfc-791` §1.4
  > It is set by the sender of the datagram and reduced at the points along the route where it is processed. If the time to live reaches zero before the internet datagram reaches its destination, the internet datagram is destroyed.
- `iana-ip-parameters` §IP Time to Live Parameter
  > The current recommended default time to live (TTL) for the Internet Protocol (IP) is 64
- `rfc-1812` §5.3.1
  > When a router forwards a packet, it MUST reduce the TTL by at least one.
- Note: RFC 791 defines the TTL field and RFC 1812 router handling; IANA's live registry gives 64 as the recommended default. The claim leaves out that a sender may choose another starting value and that a router may take off more than one.

### units[0].learn.facts[7] ("fact-traceroute") — ✅

"How traceroute works: probes with a TTL of 1, then 2, 3 and so on; the router where each runs out sends back time exceeded from its own address"

- `microsoft-tracert` §Introduction
  > This command determines the path by sending the first echo Request message with a TTL of 1 and incrementing the TTL by 1 on each subsequent transmission until the target responds or the maximum number of hops is reached.
- `cisco-ping-traceroute` §Traceroute Command
  > Another three UDP messages are now sent, each with the TTL value set to 2, which causes the second router to return ICMP TEMs.
- `rfc-2151` §3.4
  > The TTL value of 1 causes the datagram to "timeout" as soon as it hits the first router in the path; this router will then respond with an ICMP Time Exceeded Message (TEM) indicating that the datagram has expired.
- `cisco-traceroute-os` §General Operation
  > When a router in the middle of the path finds a packet with TTL = 1, it responds with an Internet Control Message Protocol (ICMP) "time exceeded" message to the source.
- `rfc-1812` §5.3.1
  > the router MUST send an ICMP Time Exceeded message, Code 0 (TTL Exceeded in Transit) message to the source.
- `rfc-1812` §4.3.2.4
  > the IP source address in an ICMP message originated by the router MUST be one of the IP addresses associated with the physical interface over which the ICMP message is transmitted.
- `rfc-792` §Message Formats, page 3
  > The address of the gateway or host that composes the ICMP message.
- Note: RFC 792 defines the source address field of an ICMP message as that of its composer.

### units[0].learn.facts[8] ("fact-tracert") — ✅

"How tracert works: tracert on Windows sends echo requests, and the destination answers the last with an echo reply"

- `microsoft-tracert` §Introduction
  > The path is determined by examining the ICMP time Exceeded messages returned by intermediate routers and the echo Reply message returned by the destination.
- `cisco-traceroute-os` §Microsoft Windows
  > The significance of using ICMP echo request datagrams is that the final hop does not rely on the response of an ICMP unreachable message from the destination host. It relies instead on an ICMP echo reply message.
- `rfc-4890` §1
  > Simple monitoring of connectivity through echo requests and responses used by the ping and traceroute utilities.

### units[0].learn.facts[9] ("fact-unreachable") — ✅

"Destination unreachable: type 3, with a code for why (0 network, 1 host, 3 port, 4 fragmentation needed); a host unreachable comes from the last router when the machine doesn’t answer ARP"

- `rfc-792` §Destination Unreachable Message, page 4
  > Type 3 Code 0 = net unreachable; 1 = host unreachable; 2 = protocol unreachable; 3 = port unreachable; 4 = fragmentation needed and DF set;
- `rfc-1812` §5.2.7.1
  > 1 = Host Unreachable - generated by a router if a forwarding path (route) to the destination host on a directly connected network is not available (does not respond to ARP);
- `rfc-1812` §4.3.3.1
  > If a packet is to be forwarded to a host on a network that is directly connected to the router (i.e., the router is the last-hop router) and the router has ascertained that there is no path to the destination host then the router MUST generate a Destination Unreachable, Code 1 (Host Unreachable) ICMP message.
- `rfc-1812` §3.3.2
  > reply that the destination is unreachable to one of the queued datagrams only when this proves fruitless.
- Note: RFC 792 defines the codes; RFC 1812 defines when a router sends code 1.

### units[0].learn.facts[10] ("fact-osi") — ✅

"OSI layer: 3, network"

- `paloalto-icmp` §ICMP
  > it operates at the Network layer of the OSI model.
- `cloudflare-icmp` §What is ICMP?
  > The Internet Control Message Protocol (ICMP) is a network layer protocol
- Note: two independent vendors' pages, both live.

### units[0].learn.facts[11] ("fact-used") — ✅

"Used for: tests and error notes"

- `rfc-1812` §4.3.1
  > ICMP is an auxiliary protocol, which provides routing, diagnostic and error functionality for IP.
- `paloalto-icmp` §ICMP
  > ICMP is used for diagnostic and control purposes, to send error messages about IP operations, or messages about requested services or the reachability of a host or router.
- Note: the claim leaves out ICMP's routing and control uses (such as redirect), named only in Go deeper.

### units[0].practice[0].options[0] (question "traceroute") — ✅

"It asks DNS for the list." (not the answer) Feedback: "Not quite. DNS turns names into addresses. Traceroute finds the routers itself, one hop at a time."

- `rfc-1034` §5.2.1
  > Host name to host address translation.
- `microsoft-tracert` §Introduction
  > This command determines the path by sending the first echo Request message with a TTL of 1 and incrementing the TTL by 1 on each subsequent transmission
- `cisco-ping-traceroute` §Traceroute Command
  > The purpose behind this is to record the source of each ICMP Time Exceeded Message to provide a trace of the path the packet took to reach the destination.
- Note: RFC 1034 defines DNS and its resolver functions; it is not obsoleted. The feedback leaves out DNS's other lookups and that tracert may look up each hop's name, which does not make DNS the source of the list.

### units[0].practice[0].options[1] (question "traceroute") — ✅

"It sends probes with TTL 1, 2, 3 and so on, and each router where one runs out replies." (the answer) Feedback: "Right. Each time exceeded note comes from the next router along."

- `microsoft-tracert` §Introduction
  > When the TTL on a packet reaches 0, the router is expected to return an ICMP time Exceeded message to the source computer.
- `cisco-ping-traceroute` §Traceroute Command
  > Another three UDP messages are now sent, each with the TTL value set to 2, which causes the second router to return ICMP TEMs.
- `rfc-2151` §3.4
  > Another three UDP messages are now sent, each with the TTL value set to 2, which causes the second router to return ICMP
- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be discarded, and if the destination is not a multicast address the router MUST send an ICMP Time Exceeded message
- Note: routers that do not answer are the exception taught in steps[3].deep[1].

### units[0].practice[0].options[2] (question "traceroute") — ✅

"Each router adds its name to the ping." (not the answer) Feedback: "Not quite. Traceroute learns each router from the time exceeded note it sends back when a probe’s TTL runs out there."

- `microsoft-tracert` §Introduction
  > The path is determined by examining the ICMP time Exceeded messages returned by intermediate routers and the echo Reply message returned by the destination.
- `cisco-ping-traceroute` §Traceroute Command
  > The purpose behind this is to record the source of each ICMP Time Exceeded Message to provide a trace of the path the packet took to reach the destination.
- `rfc-1812` §5.3.1
  > ICMP Time Exceeded messages are required because the traceroute diagnostic tool depends on them.
- Note: RFC 2151 mentions that some older traceroutes used IP's record-route option, a rare case; the ordinary traceroute works as the feedback says.

### units[0].practice[1].options[0] (question "no-reply") — ✅

"The server is switched off." (not the answer) Feedback: "Not quite. Firewalls can block pings, so a server that is on may still not answer."

- `rfc-2923` §3
  > ICMP black holes are often caused by over-zealous security administrators who block all ICMP messages.
- `paloalto-icmp` §ICMP
  > For ICMP, you can drop certain types of packets or suppress the sending of certain packets.
- `cisco-ping-traceroute` §Access List Command
  > This means that the ICMP packets that enter the Serial 0 interface on Router4 are denied

### units[0].practice[1].options[1] (question "no-reply") — ✅

"Your internet is down." (not the answer) Feedback: "Not quite. Other sites might answer fine. One silent ping doesn’t tell you that."

- `cisco-ping-traceroute` §Interface Down
  > From the previous example, the problem is between Router2 and Router3.
- `cisco-ping-traceroute` §Interface Down
  > Success rate is 100 percent (5/5), round-trip min/avg/max = 4/4/4 ms
- `microsoft-ping` §Introduction
  > ping is the primary TCP/IP command used to troubleshoot connectivity, reachability, and name resolution.
- Note: Cisco's worked example has one far device fail to answer while a nearer one answers, so the failure is placed on one stretch of the path, not on the sender's own link.

### units[0].practice[1].options[2] (question "no-reply") — ✅

"Only that no reply came back. It could be one of several things." (the answer) Feedback: "Yes. It may be down, unreachable, or just ignoring pings. Traceroute helps narrow it down."

- `rfc-2151` §3.2
  > to determine if a remote host is active or inactive
- `cisco-ping-traceroute` §Ping Command
  > the echo request gets to the destination, and the destination is able to get an echo reply back to the source within a predetermined time called a timeout.
- `rfc-1812` §5.2.7.1
  > Examples of such cases include a message addressed to a host which is not there and therefore does not respond to ARP requests, and messages addressed to network prefixes for which the router has no valid route.
- `rfc-1812` §4.3.3.6
  > A router SHOULD have a configuration option that, if enabled, causes the router to silently ignore all ICMP echo requests; if provided, this option MUST default to allowing responses.
- `cisco-ping-traceroute` §Access List Command
  > At the end of an access-list command there is always an implicit deny all.
- `cisco-ping-traceroute` §Traceroute Command
  > The purpose behind this is to record the source of each ICMP Time Exceeded Message to provide a trace of the path the packet took to reach the destination.
- `rfc-2151` §3.4
  > Although used often by network and system managers as a simple, yet powerful, debugging tool
- Note: each of the three causes (down, unreachable, ignoring) has a source; traceroute's use for finding where along the path is stated by Cisco and RFC 2151.

## Traced, example, analogy and unbacked parts

### title — ✅

Unbacked: "ICMP" makes no claim.

### units[0].name — ✅

Unbacked: "ICMP" makes no claim.

### backing (the lesson's subtitle and summary) — ✅

Traced to lead-1, lead-2, term-ping, term-echo-request, term-traceroute and fact-used; nothing added.

### units[0].backing (the unit's full name and purpose) — ✅

The full name is the expansion of ICMP and the title of RFC 792, the document fact-defined names; the purpose repeats lead-1 and fact-used.

### units[0].scene.backing (the scene) — ✅

Labels, table and log columns repeat ping and traceroute's work; the parties' addresses are RFC 1918 and RFC 5737 example values, and example.net is an example name.

### units[0].overview.hookBacking (the Overview hook) — ✅

Same words as the summary; traced.

### units[0].overview.backing (the Overview description) — ✅

Analogy. The check-up, the tapped door and the corridor of doors fit ping and traceroute; "can send back a note" keeps lead-2's condition.

### units[0].overview.facts[0] (Overview fact "Used for") — ✅

Repeats fact-used.

### units[0].overview.facts[1] (Overview fact "Tools") — ✅

Repeats fact-tools.

### units[0].overview.facts[2] (Overview fact "Messages here") — ✅

Repeats the four terms and fact-types.

### units[0].overview.facts[3] (Overview fact "Ports") — ✅

Repeats fact-ports and fact-rides.

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

Repeats fact-osi.

### units[0].overview.facts[5] (Overview fact "This example") — ✅

Example name only.

### units[0].steps[0] (step "echo-request") — ✅

Traced to lead-1, fact-used, term-ping, term-echo-request and fact-echo; "it isn't asking for a page" only says what the echo request is not.

### units[0].steps[0].facts[0] (step "echo-request", fact "Command") — ✅

Traced; example name.

### units[0].steps[0].facts[1] (step "echo-request", fact "Message") — ✅

Repeats fact-echo and fact-types.

### units[0].steps[0].facts[2] (step "echo-request", fact "Ports") — ✅

Repeats fact-ports and fact-rides.

### units[0].steps[0].facts[3] (step "echo-request", fact "To") — ✅

RFC 5737 example address.

### units[0].steps[0].events[0] (event "m1") — ✅

Echo request with an id and sequence number, over IP; traced to fact-echo and fact-rides. Example addresses.

### units[0].steps[1] (step "echo-reply") — ✅

Traced to term-echo-reply, term-latency, term-loss and fact-echo; 31 ms is example data.

### units[0].steps[1].facts[0] (step "echo-reply", fact "Answer") — ✅

Repeats fact-types.

### units[0].steps[1].facts[1] (step "echo-reply", fact "Round trip") — ✅

Example time for term-latency.

### units[0].steps[1].facts[2] (step "echo-reply", fact "Reply’s TTL") — ✅

60 against fact-ttl's default of 64 gives 4 routers, which matches the scene's four routers.

### units[0].steps[1].facts[3] (step "echo-reply", fact "Lost") — ✅

Traced to term-loss.

### units[0].steps[1].events[0] (event "m2") — ✅

Traced; example values.

### units[0].steps[1].events[1] (event "answers-1") — ✅

Traced; example values.

### units[0].steps[2] (step "time-exceeded-hop-1") — ✅

Traced to term-ttl, fact-ttl, fact-traceroute and term-time-exceeded.

### units[0].steps[2].facts[0] (step "time-exceeded-hop-1", fact "Probe") — ✅

Traced to fact-traceroute.

### units[0].steps[2].facts[1] (step "time-exceeded-hop-1", fact "Dropped by") — ✅

Traced; RFC 1918 example address.

### units[0].steps[2].facts[2] (step "time-exceeded-hop-1", fact "Answer") — ✅

Repeats fact-types.

### units[0].steps[2].facts[3] (step "time-exceeded-hop-1", fact "Time") — ✅

Example time.

### units[0].steps[2].events[0] (event "m3") — ✅

An echo request probe with TTL 1, as fact-tracert and fact-traceroute describe.

### units[0].steps[2].events[1] (event "m4") — ✅

Time exceeded, code 0 in words, from the router's own address; traced.

### units[0].steps[2].events[2] (event "answers-2") — ✅

Traced; example values.

### units[0].steps[3] (step "time-exceeded-hop-2") — ✅

Traced to fact-ttl and fact-traceroute.

### units[0].steps[3].facts[0] (step "time-exceeded-hop-2", fact "Probe") — ✅

Traced.

### units[0].steps[3].facts[1] (step "time-exceeded-hop-2", fact "Dropped by") — ✅

Traced; RFC 5737 example address.

### units[0].steps[3].facts[2] (step "time-exceeded-hop-2", fact "Time") — ✅

Example time.

### units[0].steps[3].facts[3] (step "time-exceeded-hop-2", fact "Pattern") — ✅

Traced to fact-traceroute.

### units[0].steps[3].events[0] (event "m5") — ✅

Traced.

### units[0].steps[3].events[1] (event "m6") — ✅

Traced.

### units[0].steps[3].events[2] (event "answers-3") — ✅

Traced; example values.

### units[0].steps[4] (step "traceroute") — ✅

Traced to fact-traceroute, fact-tracert, term-echo-reply and why-1. The final echo reply is the echo-request (tracert) kind of trace that the log shows; Learn's Go deeper says the classic traceroute uses UDP instead.

### units[0].steps[4].facts[0] (step "traceroute", fact "Hops") — ✅

Traced.

### units[0].steps[4].facts[1] (step "traceroute", fact "Path") — ✅

Traced.

### units[0].steps[4].facts[2] (step "traceroute", fact "Last answer") — ✅

Repeats fact-tracert.

### units[0].steps[4].facts[3] (step "traceroute", fact "Tools") — ✅

Repeats fact-tools.

### units[0].steps[4].events[0] (event "m7") — ✅

Traced.

### units[0].steps[4].events[1] (event "m8") — ✅

Traced.

### units[0].steps[4].events[2] (event "answers-4") — ✅

Traced; example values.

### units[0].steps[4].events[3] (event "m9") — ✅

Traced.

### units[0].steps[4].events[4] (event "m10") — ✅

Traced.

### units[0].steps[4].events[5] (event "answers-5") — ✅

Traced; example values.

### units[0].steps[4].events[6] (event "m11") — ✅

Traced.

### units[0].steps[4].events[7] (event "m12") — ✅

Echo reply from the destination, as fact-tracert states.

### units[0].steps[4].events[8] (event "answers-6") — ✅

Traced; example values.

### units[0].steps[5] (step "destination-unreachable") — ✅

Traced to lead-2, term-unreachable and fact-unreachable.

### units[0].steps[5].facts[0] (step "destination-unreachable", fact "Pinged") — ✅

Traced; RFC 5737 example address.

### units[0].steps[5].facts[1] (step "destination-unreachable", fact "Answer from") — ✅

From the last router, as fact-unreachable states.

### units[0].steps[5].facts[2] (step "destination-unreachable", fact "Message") — ✅

Repeats fact-unreachable.

### units[0].steps[5].facts[3] (step "destination-unreachable", fact "Other codes") — ✅

Repeats fact-unreachable's codes 0, 3 and 4.

### units[0].steps[5].events[0] (event "m13") — ✅

Traced.

### units[0].steps[5].events[1] (event "m14") — ✅

Host unreachable from the last router; traced. The wait before it is example timing.

### units[0].steps[5].events[2] (event "answers-7") — ✅

Traced; example values.

### units[0].practice[0].prompt (question "traceroute") — ✅

Unbacked; no false premise.

### units[0].practice[1].prompt (question "no-reply") — ✅

Unbacked; no false premise.

## Sources

All checked on 2026-11-12.

- `cisco-ping-traceroute`: Cisco's page, live, updated 3 September 2026.
- `cisco-traceroute-os`: Cisco's page, live, updated 1 December 2025.
- `cloudflare-icmp`: Cloudflare Learning Center page, live (read in the built-in browser after a check page refused the command line).
- `iana-icmp-parameters`: live IANA registry, updated 2026-10-29.
- `iana-ip-parameters`: live IANA registry, updated 2018-05-03.
- `iana-protocol-numbers`: live IANA registry.
- `microsoft-azure-tcpip-tuning`: Microsoft Learn page, live.
- `microsoft-ping`: Microsoft Learn page, live, for current Windows and Windows Server.
- `microsoft-tracert`: Microsoft Learn page, live, for current Windows and Windows Server.
- `paloalto-icmp`: Palo Alto Networks PAN-OS documentation, live, updated 30 September 2026.
- `rfc-1034`: not obsoleted (RFC Editor info page); its updates do not touch §5.2.1.
- `rfc-1122`: not obsoleted; updated by RFC 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029 and 9293, none of which changes the cited ICMP sections.
- `rfc-1191`: not obsoleted.
- `rfc-1812`: not obsoleted; updated by RFC 2644 and 6633, neither touching the cited sections.
- `rfc-2151`: not obsoleted (Informational).
- `rfc-2923`: not obsoleted (Informational).
- `rfc-4443`: not obsoleted; updated by RFC 4884.
- `rfc-4861`: not obsoleted; its updates do not change §3.1.
- `rfc-4890`: not obsoleted (Informational).
- `rfc-791`: not obsoleted; updated by RFC 1349, 2474 and 6864, none touching TTL.
- `rfc-792`: not obsoleted; updated by RFC 950, 4884, 6633 and 6918. RFC 6918 deprecates other types (6, 15–18, 30–39), not 0, 3, 5, 8 or 11.
- `rfc-9099`: not obsoleted (Informational).

## Limit overrides

None.
