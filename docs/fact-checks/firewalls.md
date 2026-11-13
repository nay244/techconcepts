```json fact-check
{
  "slug": "firewalls",
  "hash": "941d9df3663cb02403cc84a97cb333d15c98482f6452bac78d974113bbb35b7c",
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
    "units[0].overview.facts[0] (Overview fact \"Works with\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Reads rules\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Recommended default\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Remembers\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Common types\")": "✅",
    "units[0].steps[0] (step \"rule-evaluation\")": "✅",
    "units[0].steps[0].facts[0] (step \"rule-evaluation\", fact \"Visit\")": "✅",
    "units[0].steps[0].facts[1] (step \"rule-evaluation\", fact \"Rule 1\")": "✅",
    "units[0].steps[0].facts[2] (step \"rule-evaluation\", fact \"Result\")": "✅",
    "units[0].steps[0].facts[3] (step \"rule-evaluation\", fact \"Rules read\")": "✅",
    "units[0].steps[0].events[0] (event \"visit-website\")": "✅",
    "units[0].steps[0].events[1] (event \"visit-website-conn\")": "✅",
    "units[0].steps[1] (step \"first-match\")": "✅",
    "units[0].steps[1].facts[0] (step \"first-match\", fact \"Visit\")": "✅",
    "units[0].steps[1].facts[1] (step \"first-match\", fact \"Rule 1\")": "✅",
    "units[0].steps[1].facts[2] (step \"first-match\", fact \"Rule 2\")": "✅",
    "units[0].steps[1].facts[3] (step \"first-match\", fact \"Result\")": "✅",
    "units[0].steps[1].events[0] (event \"visit-login\")": "✅",
    "units[0].steps[2] (step \"source-filtering\")": "✅",
    "units[0].steps[2].facts[0] (step \"source-filtering\", fact \"Visit\")": "✅",
    "units[0].steps[2].facts[1] (step \"source-filtering\", fact \"Rule 2\")": "✅",
    "units[0].steps[2].facts[2] (step \"source-filtering\", fact \"Result\")": "✅",
    "units[0].steps[2].events[0] (event \"admin-login\")": "✅",
    "units[0].steps[2].events[1] (event \"admin-login-conn\")": "✅",
    "units[0].steps[3] (step \"default-deny\")": "✅",
    "units[0].steps[3].facts[0] (step \"default-deny\", fact \"Visit\")": "✅",
    "units[0].steps[3].facts[1] (step \"default-deny\", fact \"Rules that fit\")": "✅",
    "units[0].steps[3].facts[2] (step \"default-deny\", fact \"Result\")": "✅",
    "units[0].steps[3].events[0] (event \"visit-telnet\")": "✅",
    "units[0].steps[4] (step \"stateful\")": "✅",
    "units[0].steps[4].facts[0] (step \"stateful\", fact \"Reply\")": "✅",
    "units[0].steps[4].facts[1] (step \"stateful\", fact \"Why it passes\")": "✅",
    "units[0].steps[4].facts[2] (step \"stateful\", fact \"Rules read\")": "✅",
    "units[0].steps[4].events[0] (event \"reply-website\")": "✅",
    "units[0].steps[5] (step \"shadowing\")": "✅",
    "units[0].steps[5].facts[0] (step \"shadowing\", fact \"Change\")": "✅",
    "units[0].steps[5].facts[1] (step \"shadowing\", fact \"Visit\")": "✅",
    "units[0].steps[5].facts[2] (step \"shadowing\", fact \"Result\")": "✅",
    "units[0].steps[5].facts[3] (step \"shadowing\", fact \"Never read\")": "✅",
    "units[0].steps[5].events[0] (event \"move-catch-all-rules\")": "✅",
    "units[0].steps[5].events[1] (event \"move-catch-all-conns\")": "✅",
    "units[0].steps[5].events[2] (event \"move-catch-all\")": "✅",
    "units[0].steps[5].events[3] (event \"visit-website-again\")": "✅",
    "units[0].steps[0].deep[0] (step \"rule-evaluation\", Go deeper)": "✅",
    "units[0].steps[0].deep[1] (step \"rule-evaluation\", Go deeper)": "✅",
    "units[0].steps[0].deep[2] (step \"rule-evaluation\", Go deeper)": "✅",
    "units[0].steps[0].deep[3] (step \"rule-evaluation\", Go deeper)": "⚠️",
    "units[0].steps[1].deep[0] (step \"first-match\", Go deeper)": "✅",
    "units[0].steps[1].deep[1] (step \"first-match\", Go deeper)": "✅",
    "units[0].steps[1].deep[2] (step \"first-match\", Go deeper)": "✅",
    "units[0].steps[1].deep[3] (step \"first-match\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"source-filtering\", Go deeper)": "✅",
    "units[0].steps[2].deep[1] (step \"source-filtering\", Go deeper)": "✅",
    "units[0].steps[2].deep[2] (step \"source-filtering\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"default-deny\", Go deeper)": "✅",
    "units[0].steps[3].deep[1] (step \"default-deny\", Go deeper)": "✅",
    "units[0].steps[3].deep[2] (step \"default-deny\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"stateful\", Go deeper)": "✅",
    "units[0].steps[4].deep[1] (step \"stateful\", Go deeper)": "✅",
    "units[0].steps[4].deep[2] (step \"stateful\", Go deeper)": "✅",
    "units[0].steps[5].deep[0] (step \"shadowing\", Go deeper)": "✅",
    "units[0].steps[5].deep[1] (step \"shadowing\", Go deeper)": "✅",
    "units[0].steps[5].deep[2] (step \"shadowing\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.terms[0] (\"term-firewall\")": "✅",
    "units[0].learn.terms[1] (\"term-rule\")": "✅",
    "units[0].learn.terms[2] (\"term-port\")": "✅",
    "units[0].learn.terms[3] (\"term-source\")": "✅",
    "units[0].learn.terms[4] (\"term-first-match\")": "✅",
    "units[0].learn.terms[5] (\"term-default-deny\")": "✅",
    "units[0].learn.terms[6] (\"term-stateful\")": "✅",
    "units[0].learn.terms[7] (\"term-shadowed\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-acl\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-types\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-where\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-reads\")": "✅",
    "units[0].learn.facts[1] (\"fact-order\")": "✅",
    "units[0].learn.facts[2] (\"fact-default\")": "✅",
    "units[0].learn.facts[3] (\"fact-stateful\")": "✅",
    "units[0].learn.facts[4] (\"fact-acl\")": "✅",
    "units[0].learn.facts[5] (\"fact-ports\")": "✅",
    "units[0].learn.facts[6] (\"fact-logins\")": "✅",
    "units[0].learn.facts[7] (\"fact-catch-all\")": "✅",
    "units[0].practice[0].options[0] (question \"port-8080\")": "✅",
    "units[0].practice[0].options[1] (question \"port-8080\")": "✅",
    "units[0].practice[0].options[2] (question \"port-8080\")": "✅",
    "units[0].practice[1].options[0] (question \"two-rules\")": "✅",
    "units[0].practice[1].options[1] (question \"two-rules\")": "✅",
    "units[0].practice[1].options[2] (question \"two-rules\")": "✅",
    "units[0].practice[2].options[0] (question \"why-reply\")": "✅",
    "units[0].practice[2].options[1] (question \"why-reply\")": "✅",
    "units[0].practice[2].options[2] (question \"why-reply\")": "✅",
    "units[0].practice[0].prompt (question \"port-8080\")": "✅",
    "units[0].practice[1].prompt (question \"two-rules\")": "✅",
    "units[0].practice[2].prompt (question \"why-reply\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-asa-access-rules",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-asa-connections",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-firewall",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-fmc-access-rules",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-ngfw",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-firewall",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-ssh",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "google-cloud-firewall-insights",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "iana-ports",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-azure-firewall-rule-sets",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-azure-network-best-practices",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-azure-nsg",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-windows-firewall",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-windows-firewall-rules",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "nist-ir-7966",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "nist-sp800-123",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "nist-sp800-41r1",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-firewall",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-firewall-rules",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-firewall-types",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-ngfw",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-rulebase-best-practices",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-security-rules",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-stateful-firewall",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1918",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4251",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4632",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 183,
    "digest": "9e2a142fb2e38e0b6c57773711a2ad4cd4078101ec4a1d678bfba14c7ddc5ce7",
    "files": {
      "paloalto-firewall-types": "d73ab9319efdaca546c9bb9b443e44b4a0bc92c61504de6e0d10415a37afef0e",
      "microsoft-azure-firewall-rule-sets": "db9b74abdc5f22e1f35078fffbee0f138ce831842b9b53e9466a5f5ac03f2f0f",
      "cloudflare-firewall": "cb2e06de332c719c6e7b9bf32c3ef6ea9da722a835b9416e3134e17208465e65",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "iana-ports": "effec1145145a05374af14992086722392fe258e6f4ac69011c250bfd927a15b",
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "rfc-4251": "23a5052796d29edc2f0ff4f5be557df244544d129cfc26ed51971a6485eff4ef",
      "paloalto-firewall-rules": "3f41361c840d7758339bbed97eefe2c6995f969569e93e2fc45b64d7c2490761",
      "cisco-asa-access-rules": "b253cb17ae2ad1bf56b50a4e211d486ef6e757c61da46ba0a2ee9c9b55f3a300",
      "cisco-fmc-access-rules": "94d07737540cb5447359c7b8c1677f8ce08d728f6dc6c239e81c60697bc03a64",
      "microsoft-azure-nsg": "f04ee67c87c7a95419a76b88437300db3edfdad897cfb44f95787b2b66e33870",
      "microsoft-windows-firewall-rules": "f9ed5d3eafa5bb59ff15214f3a4430faad9ae9d87788e1e3ef1d4915b8e2a704",
      "paloalto-security-rules": "ad2cbb2d237466c7a5ca27b143f39e7677f2acf78a236073ad1984a236e108f8",
      "rfc-4632": "13694a39f586eb2054407780edccdf7c39332e57f067c8008bba4326bfc24fa9",
      "microsoft-windows-firewall": "08602c7b4950d86a8aa55286e31d818c11ae9f1f5cb07426f1b51958766595cc",
      "microsoft-azure-network-best-practices": "6a8271bdf0be46cb90a6afb79fca905a03a3c3eb874643b22f3155ca03676d28",
      "nist-sp800-123": "742981fb54b065581f1c70d39b44c06b997775234e7d29c9f41f829acdf6ef89",
      "paloalto-rulebase-best-practices": "42451ba226f014952b7295f831733f5e1099a17a9d1ae173af9e7cf91336723c",
      "cisco-asa-connections": "d199852031bee2e4e2c152ee94e888215f4aae8d5113c9724d0f4806de983829",
      "paloalto-stateful-firewall": "b80ce485113392b343e76e3f8fb96fbef5e156e1f42cefdbf269f889c4bac656",
      "cisco-firewall": "f8894c0ed34d11a75e9c1e287e3fcfb1fc5354dd417bf123e7d154dd649f54fd",
      "cisco-ngfw": "72e35d3d2b78407373a4a02bda1b783b30343b1c09e29b287b58b950d4c86e9c",
      "google-cloud-firewall-insights": "3f9ab44ca8db771f2ee41d0ceb0e16e6102157ad8065baae57d39a236707b878",
      "paloalto-ngfw": "3cc6d25cc25ed63c89afbe8a631ede1a52c4e3a36a8c2ae75df1d55754343770",
      "paloalto-firewall": "1323c227e7ed7396b0e83c743fedeb0386eba97754b33277c6a695828129d4f0",
      "nist-ir-7966": "f6e53e3eb033f995488ec71ee0c025044e03d5ce3c8dbee36e69e186174e8e64",
      "cloudflare-ssh": "6fd94dd7f95d15c9feb02b68726d72324825b3ee3ef42f078e3dc92022e517a4"
    }
  },
  "items": {
    "title": "2d80989401f06fa65fb75057b6fdee1c0de22e0304a20d677be2ffdf67cab506",
    "units[0].name": "82cba0c9ef0554e1d88c23d2c285048f9441e970e5a18566a739ebae82e7ea0c",
    "units[0].osi": "46e9048a065ca2f40891fc7473c994a0425aa4a0cd58c0bb51dac2ef4d84ba71",
    "backing (the lesson's subtitle and summary)": "2bee0bd0efd20dac894770651ab102fe22c984c76a807c6898775f0892dc6e45",
    "units[0].backing (the unit's full name and purpose)": "170a3647370da2b7750829e79b6ce80713b1ee9f32e5341b9362fda97a63482a",
    "units[0].scene.backing (the scene)": "31cfde62cab41016eeaff1df26a2b04282a968ae5012b0de4a62b8486394b4e0",
    "units[0].overview.hookBacking (the Overview hook)": "aa33a38028252d2dc7c6c352d74c6c30aeb6406599da6d0ba28eb30f5a507c7d",
    "units[0].overview.backing (the Overview description)": "46e2a85882087ab3b3375a9a2ca23be0574114c9d5cd8172786e40130f775c65",
    "units[0].overview.facts[0] (Overview fact \"Works with\")": "36b9e447f3deba3d1ddb07fb234ace99ca24182a3a90802c92778bafd99635ab",
    "units[0].overview.facts[1] (Overview fact \"Reads rules\")": "37d47acf08ff5f69294b4f27d23465f8caf62f481cc01cafe332b38e62353717",
    "units[0].overview.facts[2] (Overview fact \"Recommended default\")": "43b1e6579aeff204577e3fdaa7636900c470ac8de7e0dde9be68d9b3ad2a26eb",
    "units[0].overview.facts[3] (Overview fact \"Remembers\")": "727f05511df461f8ebc3ec21bc7f999ef4361ff5eb20346dd6eabf999e06940e",
    "units[0].overview.facts[4] (Overview fact \"Common types\")": "75330c326015cd2e1238930901e65e7762ad7dd00195279b747852de84dec44a",
    "units[0].steps[0] (step \"rule-evaluation\")": "c5f62a9800b55bc8785d69d1926ee2e9321b2dbb94516d428b193d2b6c355055",
    "units[0].steps[0].facts[0] (step \"rule-evaluation\", fact \"Visit\")": "bde5573e206cb9d43ae0e1ef2f67518b8b81ce37c34cc7875ec7f020417d54c5",
    "units[0].steps[0].facts[1] (step \"rule-evaluation\", fact \"Rule 1\")": "f80b17bbdb4caa5d1ac75ea426bdf41cdf82b641aa83bfc62c57b22a3656685f",
    "units[0].steps[0].facts[2] (step \"rule-evaluation\", fact \"Result\")": "aeb5280500386976a1b39b309a22af6837581dab2869190def93dc74538dc485",
    "units[0].steps[0].facts[3] (step \"rule-evaluation\", fact \"Rules read\")": "d2e3c0995f28b8a56fddef12c719071e1e38c9b79964743abc385b89d65766ca",
    "units[0].steps[0].events[0] (event \"visit-website\")": "a6b791897952016c1e9bca4f43e89f0a2bb4e62ba47094edbcd9a22977fff11c",
    "units[0].steps[0].events[1] (event \"visit-website-conn\")": "d21d03466eb770d74d4bd9f79ff86e1aedf0d08f1da900606d803986256a7e96",
    "units[0].steps[1] (step \"first-match\")": "17d79d61b7abaec71ab299f759017b2caeee7cddc98b6a58321234755c46722f",
    "units[0].steps[1].facts[0] (step \"first-match\", fact \"Visit\")": "ed88f1229b6a489e9d78451f27cf450ee0b3c244a59bf86b871d6261b1a12524",
    "units[0].steps[1].facts[1] (step \"first-match\", fact \"Rule 1\")": "13bd4f8012e2a25afa71057bb67c838101ed31cba7e129892ba3f8a0b4364757",
    "units[0].steps[1].facts[2] (step \"first-match\", fact \"Rule 2\")": "d36041ecb76eec5cc6940a39aebdd2b087181573165fcfc5a3212c8a43421743",
    "units[0].steps[1].facts[3] (step \"first-match\", fact \"Result\")": "23e5459437f35502cabcfdb298533e37d6d4b1878547e59fa0ae330272d82d15",
    "units[0].steps[1].events[0] (event \"visit-login\")": "8b9b3c047e65b9521be52eeb0bbd225424b1e68bf476ee164c18963a42b3a81e",
    "units[0].steps[2] (step \"source-filtering\")": "9dfbfae84febab195c8fb438998e582e70d1a7ee64ef0feb01d7a499a4b569fb",
    "units[0].steps[2].facts[0] (step \"source-filtering\", fact \"Visit\")": "0b53fddd3420ebb3ef7431762e7cee70122c4495a1681b42fedf2c556d4eed99",
    "units[0].steps[2].facts[1] (step \"source-filtering\", fact \"Rule 2\")": "327ae18eb4ee7975f6778c860530222b3de39d483ac0b5d4eacda01d8e9bd46f",
    "units[0].steps[2].facts[2] (step \"source-filtering\", fact \"Result\")": "8347ac4142e4d5c0a2a30e2d796b36a47309a1a3b62bc9e6f018cdaa38b66ee5",
    "units[0].steps[2].events[0] (event \"admin-login\")": "b6de615ffd04759d0121bedc389cd5dab40f0f5310a72324378053cdcddeca26",
    "units[0].steps[2].events[1] (event \"admin-login-conn\")": "2764541388f2713904b6e84bd6aa53fb305f79bb06488bbddb1b6b44b682e3c4",
    "units[0].steps[3] (step \"default-deny\")": "af749cfd645e2b07ac12b0fcbfd34c6eedbe5a97cecf682bd7df74dd79aa8e9f",
    "units[0].steps[3].facts[0] (step \"default-deny\", fact \"Visit\")": "928b0e5a149240eaccae7d941b4fa29c65adceaaab801955540f2b57f2664429",
    "units[0].steps[3].facts[1] (step \"default-deny\", fact \"Rules that fit\")": "ad84272b3baf4a226d61ddc6b2ed11488b80ea3833b2e69e42077382aec2d6c3",
    "units[0].steps[3].facts[2] (step \"default-deny\", fact \"Result\")": "23e5459437f35502cabcfdb298533e37d6d4b1878547e59fa0ae330272d82d15",
    "units[0].steps[3].events[0] (event \"visit-telnet\")": "102e6b67b1cb71c3b8b1c5d04d9d02cca5fd9ca700aefc41838516d78893630a",
    "units[0].steps[4] (step \"stateful\")": "0e8c7dada0976174ef2059801a1cceef2f9e9774cbe652276c6a52d7d596721c",
    "units[0].steps[4].facts[0] (step \"stateful\", fact \"Reply\")": "91e710c67456efa632f203254cb7e72d1322df3bccaffd76499b26520796f1cd",
    "units[0].steps[4].facts[1] (step \"stateful\", fact \"Why it passes\")": "d2fa051e65ab5e9b88f122e387dbc93750bd107c2c8725556e755cb8fa6e608c",
    "units[0].steps[4].facts[2] (step \"stateful\", fact \"Rules read\")": "ef183bef9f9864c132a742b56505f07ac8fa9eb19d0a1b751a8524b6c144d67e",
    "units[0].steps[4].events[0] (event \"reply-website\")": "5abac7602184c980071e52dfb10919de1405056e87aae189215fcbe3f3346778",
    "units[0].steps[5] (step \"shadowing\")": "68c994c1ce859832dea7e510129eaa5345a0b5c696a3cad14ed82096cae54deb",
    "units[0].steps[5].facts[0] (step \"shadowing\", fact \"Change\")": "e6b3207e097cda0323e68ecf45474e73facf8809aba4da628b6a5ba83202ad7b",
    "units[0].steps[5].facts[1] (step \"shadowing\", fact \"Visit\")": "bde5573e206cb9d43ae0e1ef2f67518b8b81ce37c34cc7875ec7f020417d54c5",
    "units[0].steps[5].facts[2] (step \"shadowing\", fact \"Result\")": "6eec74c5d85e1465eb8d8c64484d01a1f6164dbac1c887adc9dcec9a534a4dd5",
    "units[0].steps[5].facts[3] (step \"shadowing\", fact \"Never read\")": "9dd41bfce7008ab90be8eac929fbed895a26469dbee0373081cce902738dc8d6",
    "units[0].steps[5].events[0] (event \"move-catch-all-rules\")": "111ac2b567676997b422846ff90c0cb7e9f2a6a30fdd98a9f836d46deecb04fa",
    "units[0].steps[5].events[1] (event \"move-catch-all-conns\")": "a3ae09079605af81086f40df08e5fc5ee67ba52f71dcaed2d4910effd1e98e8f",
    "units[0].steps[5].events[2] (event \"move-catch-all\")": "333bdaa67c18885a59a37b49698144386fa1aa1c269243d931854b55fe01f54a",
    "units[0].steps[5].events[3] (event \"visit-website-again\")": "adc19a669a58b35788af1411ea11c9ed0ef396104a56d29289e614ae331bb40a",
    "units[0].steps[0].deep[0] (step \"rule-evaluation\", Go deeper)": "3a4838eb968b1430099238426acc2285d421b2f3571f47c4935f0e6b609b9578",
    "units[0].steps[0].deep[1] (step \"rule-evaluation\", Go deeper)": "d60f082f1352609d8526ecef61019d8e65ad55b527a8eb8169799c094192ec9a",
    "units[0].steps[0].deep[2] (step \"rule-evaluation\", Go deeper)": "ba573b1f007385c834fee00c91e6f4b1d7636da4d4df08113d0a2596d95608d6",
    "units[0].steps[0].deep[3] (step \"rule-evaluation\", Go deeper)": "e884a8a876ad6d26d26d75994810d5b1919216b9fb3b7666e9d2539125f186cc",
    "units[0].steps[1].deep[0] (step \"first-match\", Go deeper)": "c552b3c12a623567c292e1018f4f6a53270dcf9cd278660245fbceccd01f6b79",
    "units[0].steps[1].deep[1] (step \"first-match\", Go deeper)": "bbf026863acc9ba025daa48dabc7b7a87541382ca40d8cad6ea64bb963814a1b",
    "units[0].steps[1].deep[2] (step \"first-match\", Go deeper)": "e63cf1a107c303c939ec51218d37e7321bbdb063171eee04ce1b253ea3e35325",
    "units[0].steps[1].deep[3] (step \"first-match\", Go deeper)": "04eb7e5ce2622718e7af51634849ae50dc0fb9bea1a8ed8175742679d4595721",
    "units[0].steps[2].deep[0] (step \"source-filtering\", Go deeper)": "05c2a9021057a47a23178396eb84d3971058184afd61a062348d1e218409dc1b",
    "units[0].steps[2].deep[1] (step \"source-filtering\", Go deeper)": "cb4b170d595df7787b6c84b8b030fdef2b6a68fd92e0dfea99e7d3b4d5353d45",
    "units[0].steps[2].deep[2] (step \"source-filtering\", Go deeper)": "619777badb7efdb1fea56d4f9723d24d19dad179ecf7c1a5d4a34ad54e279b58",
    "units[0].steps[3].deep[0] (step \"default-deny\", Go deeper)": "6af81ef9735d2aba0f9d132a119583bfbfe90e9975910b8e5a7097a566555601",
    "units[0].steps[3].deep[1] (step \"default-deny\", Go deeper)": "fdc705d506fe4d3ffbdd316aac913e25f0217f014b0739e024cf8589dc39dfce",
    "units[0].steps[3].deep[2] (step \"default-deny\", Go deeper)": "42f2620f1ebb89d5e065a329d3fc1ee7e1788ea32ad5ae9fce03d17ca58f101e",
    "units[0].steps[4].deep[0] (step \"stateful\", Go deeper)": "fc5fbb08c10d7497578daae37f784fab348f8ff5a60e223e91220bfcfab6aa46",
    "units[0].steps[4].deep[1] (step \"stateful\", Go deeper)": "d924d2ea910a4b04ee833e17be75fddfeee74dbf86dc1d671e3192874c0fc0d7",
    "units[0].steps[4].deep[2] (step \"stateful\", Go deeper)": "3094a2aeaf123467519b38518789750010e44d482cd21cc9b379079b5ff284c6",
    "units[0].steps[5].deep[0] (step \"shadowing\", Go deeper)": "fea86ab1fd39dad3bfadf1acaf3bc0a8574ad604c2703ea22bf92790c9b10224",
    "units[0].steps[5].deep[1] (step \"shadowing\", Go deeper)": "bba56f70ce17a46e2dc3d3634202c0b2ba40ed017a26743592d2a3431f1d6292",
    "units[0].steps[5].deep[2] (step \"shadowing\", Go deeper)": "f6befca87dd2d5f86719218083bbe607eebd7d4b84f2bc57801a169149f956ae",
    "units[0].learn.lead[0] (\"lead-1\")": "d71db57b1a3df6096c796eb7fd6a5ec64ca41bc88ba49d006df458d8ecf396df",
    "units[0].learn.terms[0] (\"term-firewall\")": "edfc8fdf5c02d019f236f5b55037d39054163659b6016519fa66b6c614049eb4",
    "units[0].learn.terms[1] (\"term-rule\")": "e737ec81906905acec01abd31e27963cc8f3b77bc1845e4dec49ea2222edbb7f",
    "units[0].learn.terms[2] (\"term-port\")": "dc0ee9ad97a20d4fe0ed3e1405e3bf7415462cd3619978301aa62bb61f659992",
    "units[0].learn.terms[3] (\"term-source\")": "71376f41c9b932eaf1417ce3f252b12ce348aaee36215ebaf7e4289197933d2e",
    "units[0].learn.terms[4] (\"term-first-match\")": "aa989fe88ff653017c09cd3db772035fbf88bd39a0c638e98cf4152fece58529",
    "units[0].learn.terms[5] (\"term-default-deny\")": "6165f7bba0a0452bb3feb60170e74f8d043d078fc773f9fe61409ad5f938650e",
    "units[0].learn.terms[6] (\"term-stateful\")": "3c5f39db0ae101c2cf3f848e29a30dabe7bb7aef5f4bbdff1cd477c04a2dd40f",
    "units[0].learn.terms[7] (\"term-shadowed\")": "fc47d51635eff65e76e853a78e91c281456602eb1f16a48846afe1223acaab29",
    "units[0].learn.pattern (\"pattern\")": "358ee7121b700e78b7775941f6b03877d96ea1836d03a928b05e88b061f6234f",
    "units[0].learn.why[0] (\"why-1\")": "3b5f914304825c77ba1c7dca37e17b906642f60077b589c1fbdfcff53768a434",
    "units[0].learn.why[1] (\"why-2\")": "7d47784228664c3fa7229f763c67da7aa6657af4da85036f199b1b7de51eec3c",
    "units[0].learn.deep[0] (\"deep-acl\", Learn's Go deeper)": "75960320c7c9656fac09c16dc003d827929332db3816e3e377e79e165a7d68d7",
    "units[0].learn.deep[1] (\"deep-types\", Learn's Go deeper)": "c2064e114e9c9768c913d279445d4d7b1f8658fe179e06eadd99f02c2a95e3ed",
    "units[0].learn.deep[2] (\"deep-where\", Learn's Go deeper)": "c8c5c66ceacf71a4fe99919c985a60720b2d9d2b53c70a1553261495194880f1",
    "units[0].learn.facts[0] (\"fact-reads\")": "7d572c83f2ba5359ca145bb5ef1c5cebc31b86562ae0fe7f072e11e3f68b7ba0",
    "units[0].learn.facts[1] (\"fact-order\")": "2ae570801ba2195a612292b1185287aed7b172a86436c87f57dfdae2b82b96c8",
    "units[0].learn.facts[2] (\"fact-default\")": "27eefd2339d6b4d3bb549213aba6db8f955a12b308818d753521fe232483f5db",
    "units[0].learn.facts[3] (\"fact-stateful\")": "51947ea8d9b303ddca1a56a6729e46fc567272e86f9d8c6a1fac35134b6c01fc",
    "units[0].learn.facts[4] (\"fact-acl\")": "d60efeac42b13f21ff04e5f1185e2c6beea6c47e54257131218eb8698eb52448",
    "units[0].learn.facts[5] (\"fact-ports\")": "730806e6de3b426e06a53c6c91cd58b31005d1802f104fa5785e546aaef0ed2b",
    "units[0].learn.facts[6] (\"fact-logins\")": "6aa30a73b42bc24d58931a3623863c1f86363f22db42265736310de3e746de12",
    "units[0].learn.facts[7] (\"fact-catch-all\")": "7458bb12c085d219d2f835511fe8b3eede6208cf8858a4256a16a43f66f6bdc8",
    "units[0].practice[0].options[0] (question \"port-8080\")": "23c028ef3912d9da03062322f791016075cfc22e70e8b1565c627af0c88a5833",
    "units[0].practice[0].options[1] (question \"port-8080\")": "5272115b4497c89f4b1110492aaf8ebfddf56297d424bb3cb20149d1bbcc6332",
    "units[0].practice[0].options[2] (question \"port-8080\")": "e68e7bdf4fbcddfd9c786fbaac7cd8cc9861c907e6bf577d29ce9d28bfff76f7",
    "units[0].practice[1].options[0] (question \"two-rules\")": "30b968405d3e9406ad1bf9f64f9579f02abf318fe6aa341c78cb8a02512c2b3e",
    "units[0].practice[1].options[1] (question \"two-rules\")": "4b20ee94b31ed66e4da338df33730df3f974e4d0f6ef96d1b8f5f8ef78363ad7",
    "units[0].practice[1].options[2] (question \"two-rules\")": "4c27b492086ef647e74c72617dd22338d6479ace2466c8ede129957de0be0725",
    "units[0].practice[2].options[0] (question \"why-reply\")": "f9acd19c7568c97426e6b76a89ebeb084fd0e5f1689815b78dbb4fd2be5ca8a7",
    "units[0].practice[2].options[1] (question \"why-reply\")": "fbc30be4835ace060eace888e8257021a1e9451b5ccb91fc6016940cdbcea07c",
    "units[0].practice[2].options[2] (question \"why-reply\")": "ce1cef99fe4451d8415037f444dd77ca9038bd37bcf86ebe417230f7092744f0",
    "units[0].practice[0].prompt (question \"port-8080\")": "4591da190af29154ce3122efa8c85b16856079510658c42359901a3308757f8d",
    "units[0].practice[1].prompt (question \"two-rules\")": "9c9300ae411d4173c929bc9ca7e37aee8628f1999b0f319e0b2e9be8bbb9d67f",
    "units[0].practice[2].prompt (question \"why-reply\")": "6dac566ac9940e8e9f6ba2e58dcb09c8bcef059f56556d56289c4217574c70b8"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: firewalls

Checked on 2026-11-12 by a fresh fact-checker, from the claim sheet and the sources only. 105 items pass and 1 item is ⚠️: the NAT clause in the Go deeper note on 10.0.0.10 rests on one cited source.

## Claims

### units[0].osi — ✅

Badge: layers 3 and 4.

- `paloalto-firewall-types` §Stateful Inspection Firewall
  > Located at Layers 3 and 4 of the Open Systems Interconnection (OSI) model, their primary function is to filter traffic based on its state and context.
- `microsoft-azure-firewall-rule-sets` §Network rules
  > Network rules control inbound, outbound, and east-west traffic based on the network layer (L3) and transport layer (L4). Use a network rule to filter traffic based on IP addresses, ports, and protocols.
- `cloudflare-firewall` §What is the history of firewalls?
  > They decided which packets to allow and which to block by inspecting their network layer and transport layer headers to see their source and destination IP address and port
- Note: Three vendors on three different sites each put address-and-port filtering, the kind of firewall this lesson shows, at layers 3 and 4. The badge leaves out that next-generation firewalls also work at layer 7, which the lesson itself says in "deep-types".
- Note: All three pages are live and describe current products or current practice (checked 2026-11-12).

### units[0].steps[0].deep[0] (step "rule-evaluation", Go deeper) — ✅

"The visit is the first packet of a TCP connection, called a SYN."

- `rfc-9293` §3.5
  > In line 2 of Figure 6, TCP Peer A begins by sending a SYN segment
  > indicating that it will use sequence numbers starting with sequence
  > number 100.
- `rfc-9293` §3.1
  > SYN: 1 bit
  > Synchronize sequence numbers.
- Note: RFC 9293 is the defining standard for TCP; it defines the three-way handshake (§3.5) and the SYN control bit in the header (§3.1). It is an Internet Standard, not obsoleted and not updated.
- Note: The claim says "packet" where TCP says "segment"; for a beginner that is the same thing.

### units[0].steps[0].deep[1] (step "rule-evaluation", Go deeper) — ✅

"The firewall reads the source and destination addresses in its IP header and the destination port in its TCP header."

- `rfc-791` §3.1
  > Source Address: 32 bits
  > The source address.
- `rfc-9293` §3.1
  > The Internet Protocol
  > (IP) header carries several information fields, including the source
  > and destination host addresses
- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated
- Note: RFC 791 defines the IPv4 header and its address fields; RFC 9293 §3.1 defines the TCP header, whose Destination Port field is the port the rule reads. NIST SP 800-41r1 §2.1.1 (page 13 of the PDF) goes on to list the destination address, the protocol and the destination port as what a packet filter checks.
- Note: RFC 791 is an Internet Standard, not obsoleted; its updates (RFC 1349, 2474, 6864) change the Type of Service, DS and ID fields, not the address fields.

### units[0].steps[0].deep[2] (step "rule-evaluation", Go deeper) — ✅

"Port 443 is HTTPS."

- `rfc-9110` §4.2.2
  > If the port subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- Note: RFC 9110 defines the https URI scheme and its default port; the IANA registry is the defining record of port assignments, and its entry for 443/tcp is named https. Both current (registry last updated 2026-11-10).

### units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper) — ⚠️

"The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT."

- `rfc-1918` §3
  > The Internet Assigned Numbers Authority (IANA) has reserved the
  > following three blocks of the IP address space for private internets:
- `rfc-1918` §3
  > Private hosts can communicate with all other hosts
  > inside the enterprise, both public and private. However, they cannot
  > have IP connectivity to any host outside of the enterprise.
- `nist-sp800-41r1` §3.2
  > Typically, a NAT acts as a router that has a network with private addresses on the inside and a single public address on the outside.
- `nist-sp800-41r1` §3.2
  > for example, all HTTP requests that go to the NAT could be directed
  > to a single host on the protected side of the firewall.
- Note: RFC 1918 is the defining standard for private address space and lists 10.0.0.0 to 10.255.255.255 as the first block, so "10.0.0.10 is private" is confirmed. RFC 1918 is a Best Current Practice, not obsoleted; its one update (RFC 6761) concerns special-use domain names.
- Note: What is wrong: the second half, that the visit reaches the server through NAT, is stated only by NIST SP 800-41r1 §3.2. RFC 1918 §3 says a private host cannot be reached directly from outside but never mentions NAT, so this half has one source and no defining standard. The sentence is true in the ordinary case. It needs a second independent source that states inbound NAT to a private server, such as a NAT RFC or a vendor's static NAT or port-forwarding page.

### units[0].steps[1].deep[0] (step "first-match", Go deeper) — ✅

"Port 22 is SSH, a secure way to log in to a computer over the network."

- `rfc-4251` §1
  > Secure Shell (SSH) is a protocol for secure remote login and other
  > secure network services over an insecure network.
- `iana-ports` §Registry
  > The Secure Shell (SSH)
- Note: RFC 4251 defines the SSH protocol architecture; the IANA registry assigns 22/tcp to ssh, citing RFC 4251. RFC 4251 is not obsoleted; its updates (RFC 8308, extension negotiation; RFC 9141, FTP references) do not touch what SSH is for.

### units[0].steps[1].deep[1] (step "first-match", Go deeper) — ✅

"Most firewalls stop at the first rule that matches."

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `paloalto-firewall-rules` §Firewall Rules Order
  > The ordering of firewall rules is important because firewalls process rules sequentially, typically from the top down. This ordered structure is imperative because once a rule matches a packet, the firewall does not evaluate subsequent rules.
- `cisco-asa-access-rules` §Rule Order
  > When the ASA decides whether to forward or drop a packet, the ASA tests the packet against
  > each rule in the order in which the rules are listed in the applied ACL. After a match is found, no more rules are checked.
- `cisco-fmc-access-rules` §Access control rule order
  > The system matches traffic to rules in top-down order by ascending rule number.
- `microsoft-azure-nsg` §Security rules
  > Rules are processed in priority order, with lower numbers processed before higher numbers because lower numbers have higher priority. Once traffic matches a rule, processing stops.
- Note: NIST says "many" and Palo Alto says "typically"; three vendors' products work this way. "Most" is a fair beginner's word for it, and the next note in the lesson names the exceptions.

### units[0].steps[1].deep[2] (step "first-match", Go deeper) — ✅

"Some products sort their rules in other ways, so check yours."

- `nist-sp800-41r1` §5.2.2
  > Other firewalls have more complex ways of processing rulesets, such as
  > first checking “deny” rules and then checking “allow” rules.
- `microsoft-windows-firewall-rules` §Rule precedence for inbound and outbound rules
  > Explicit block rules take precedence over any conflicting allow rules.
- Note: Windows Firewall rules page also notes it has no administrator-assigned rule order. Page live (updated 2026-10-08).

### units[0].steps[1].deep[3] (step "first-match", Go deeper) — ✅

"A blocked visit can be dropped without a word or refused with a reply."

- `paloalto-security-rules` §Action
  > When
  > you configure your environment to deny traffic, it either resets
  > the connection or silently drops packets.
- `cisco-fmc-access-rules` §Access control rule blocking actions
  > Block and Block with reset actions immediately stop traffic from entering the network. Block with reset rules reset the connection
- Note: "Refused with a reply" puts a TCP reset (or an ICMP unreachable) in everyday words.

### units[0].steps[2].deep[0] (step "source-filtering", Go deeper) — ✅

"198.51.100.7/32 means exactly one address: all 32 bits must match (the Subnetting lesson covers the slash)."

- `rfc-4632` §3.1
  > In CIDR notation, a prefix is shown as a 4-octet
  > quantity, just like a traditional IPv4 address or network number,
  > followed by the "/" (slash) character, followed by a decimal value
  > between 0 and 32 that describes the number of significant bits.
- `rfc-4632` §3.1
  > n.n.n.n/32 1 4294967296 "host route"
- Note: RFC 4632 defines CIDR prefix notation; its table in §3.1 gives one address per /32 block. It is a Best Current Practice, not obsoleted or updated. The pointer to the Subnetting lesson is a cross-reference, not a claim about networks.

### units[0].steps[2].deep[1] (step "source-filtering", Go deeper) — ✅

"A rule that names an address only works while that address stays the same."

- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated
- `microsoft-windows-firewall` §Windows Firewall overview
  > This traffic can be filtered based on several criteria, including source and destination IP address, IP protocol, or source and destination port number.
- `microsoft-azure-network-best-practices` §Logically segment subnets
  > Define an application security group for lists of IP addresses that you think might change in the future or be used across many network security groups.
- Note: NIST and Microsoft each state that a rule matches on the packet's source address, so a rule that names one address stops matching when the sender's address changes; Microsoft's advice exists because addresses do change. The claim leaves out that some products can name a group or a dynamic value instead of a fixed address.

### units[0].steps[2].deep[2] (step "source-filtering", Go deeper) — ✅

"Admin logins from outside are safer through a VPN."

- `nist-sp800-123` §6.5
  > Do not allow remote administration from the Internet through the firewall unless accomplished via
  > strong mechanisms, such as VPNs.
- `microsoft-azure-network-best-practices` §Disable RDP and SSH access to virtual machines
  > Point-to-site VPN is more secure than direct RDP or SSH connections because the user has to authenticate twice before connecting to a VM.

### units[0].steps[3].deep[0] (step "default-deny", Go deeper) — ✅

"Port 23 is Telnet."

- `iana-ports` §Registry
  > telnet 23 tcp Telnet
- Note: The IANA registry is the defining record of port assignments; 23/tcp is assigned to telnet (RFC 854).

### units[0].steps[3].deep[1] (step "default-deny", Go deeper) — ✅

"NIST’s firewall guidance (SP 800-41) recommends default deny."

- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted
  > by the firewall policy—traffic that is not needed by the organization. This practice, known as deny by
  > default, decreases the risk of attack
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- Note: The claim is about what NIST's own guidance says, and SP 800-41 Rev. 1 is that guidance, so it is the defining document here. It is the current revision on CSRC (September 2009, supersedes the 2002 edition), not withdrawn.

### units[0].steps[3].deep[2] (step "default-deny", Go deeper) — ✅

"Many firewalls end every list with an invisible deny, often called the implicit deny, but not all do, so when you inherit a rule list, read its last rule."

- `cisco-asa-access-rules` §Implicit Deny
  > ACLs have an implicit deny at the end of the list, so unless you
  > explicitly permit it, traffic cannot pass.
- `cisco-asa-access-rules` §Implicit Deny
  > For management (control plane) ACLs, which control to-the-box traffic, there is no implicit deny at the end of a set of management
  > rules for an interface.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- `paloalto-security-rules` §Action
  > The default rules—displayed at the bottom of the security
  > rulebase—are predefined to allow all intrazone traffic (within a zone) and deny all
  > interzone traffic (between zones).
- `microsoft-windows-firewall` §Concepts
  > allow all outgoing traffic, unless matching a rule
- Note: Cisco and Palo Alto both name an implicit deny; Cisco's management rules, Palo Alto's intrazone default and Windows' outbound default show that not every list ends in a deny.

### units[0].steps[4].deep[0] (step "stateful", Go deeper) — ✅

"The connection table records each allowed connection’s addresses and ports, here 203.0.113.50:50432 to 10.0.0.10:443, and drops the entry when the connection closes or goes quiet."

- `nist-sp800-41r1` §2.1.2
  > While the details of state table
  > entries vary by firewall product, they typically include source IP address, destination IP address, port
  > numbers, and connection state information.
- `nist-sp800-41r1` §2.1.2
  > Three major states exist for TCP traffic—connection establishment, usage, and termination (which refers
  > to both an endpoint requesting that a connection be closed and a connection with a long period of
  > inactivity.)
- `nist-sp800-41r1` §2.1.2
  > the entry is removed from the state table after a preconfigured timeout value is
  > reached.
- `cisco-asa-connections` §Configure Global Timeouts
  > If the slot has
  > not been used for the idle time specified, the resource is returned to the free pool.
- `cisco-asa-connections` §Configure Global Timeouts
  > The idle time after which a connection closes,
- `paloalto-stateful-firewall` §How Does Stateful Inspection Work?
  > The process involves building and maintaining a state table that logs every outgoing and incoming packet.
- Note: The addresses and ports are example values (RFC 5737 and RFC 1918 addresses, a made-up client port). "Goes quiet" is the everyday word for an idle timeout.

### units[0].steps[4].deep[1] (step "stateful", Go deeper) — ✅

"A packet filter without state judges each packet alone, so it would need a rule for the replies too."

- `nist-sp800-41r1` §2.1.1
  > These devices, also known as stateless inspection firewalls, do not keep track of
  > the state of each flow of traffic that passes though the firewall
- `paloalto-stateful-firewall` §Stateful vs. Stateless Firewalls
  > Stateless firewalls inspect each data packet independently against a set of predefined rules known as access control lists (ACLs).
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > For connectionless protocols such as ICMP, however, the ASA
  > establishes unidirectional sessions, so you either need access rules to allow
  > ICMP in both directions
- `microsoft-azure-nsg` §Security rules
  > The flow record allows a network security group to be stateful. If you specify an outbound security rule to any address over port 80, for example, it's not necessary to specify an inbound security rule for the response to the outbound traffic.

### units[0].steps[4].deep[2] (step "stateful", Go deeper) — ✅

"Almost every modern firewall is stateful."

- `nist-sp800-41r1` §2.1.1
  > Packet filtering is at the core of most
  > modern firewalls, but there are few firewalls sold today that only do stateless packet filtering.
- `nist-sp800-41r1` §2.1.1
  > Because of this, most firewalls that use packet filters
  > also maintain some state information for the packets that traverse the firewall.
- `cisco-firewall` §Stateful inspection firewall
  > Now considered a traditional firewall, a stateful inspection firewall allows or blocks traffic based on state, port, and protocol.
- `cisco-ngfw` §What is a next-generation firewall (NGFW)?
  > Like a traditional firewall, an NGFW tracks connection state and filters traffic on the 5-tuple
- Note: NIST's text dates from 2009; Cisco's current pages confirm that today's traditional and next-generation firewalls both track state.

### units[0].steps[5].deep[0] (step "shadowing", Go deeper) — ✅

"Rule audits look for shadowed rules: rules hidden by a broader one above them."

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Shadowing is when you place a broad rule that includes the same match criteria as a more specific
  > rule higher in the rulebase than the specific rule,
- `google-cloud-firewall-insights` §Shadowed rules
  > Shadowed rules share attributes, such as IP addresses, with other rules with
  > higher or equal priority, called shadowing rules. Firewall Insights
  > analyzes your VPC firewall rules and
- `nist-sp800-41r1` §5.5
  > Some firewalls have tools that can do automated reviews of policies, looking for such things as
  > redundant rules or missing rules that are widely recommended.

### units[0].steps[5].deep[1] (step "shadowing", Go deeper) — ✅

"Put the most specific rules first and the broadest last."

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The logic for all other rules is to place the most specific rules near the top of the rulebase
  > and the most general rules closer to the bottom of the rulebase.
- `paloalto-firewall-rules` §Firewall Rules Order
  > More specific rules must precede more general ones to ensure proper traffic filtering and avoid unintended blocking or allowing of traffic.
- `cisco-fmc-access-rules` §Access control rule order
  > Access control rules that use specific conditions (such as networks and IP addresses) should be ordered before rules that use general conditions (such as applications).
- Note: The two Palo Alto pages are one publisher, so the second independent source is Cisco. Palo Alto also puts rules that block known-bad traffic and allow core services such as DNS near the top; the claim leaves out that exception.

### units[0].steps[5].deep[2] (step "shadowing", Go deeper) — ✅

"Yesterday’s connections have closed, so today’s visit is a new connection and the rules are read again."

- `nist-sp800-41r1` §2.1.2
  > the connection attempt is
  > first checked to see if it is permitted by the firewall ruleset.
- `nist-sp800-41r1` §2.1.2
  > the entry is removed from the state table after a preconfigured timeout value is
  > reached.
- `paloalto-stateful-firewall` §How Does Stateful Inspection Work?
  > If a packet does not match an existing connection in the state table, it is evaluated against the set of defined firewall rules to decide whether to allow it to pass.

### units[0].learn.lead[0] ("lead-1") — ✅

"Five visits and one reply reached the firewall. For each visit, it read its list from the top and stopped at the first rule that fit. Here is what each part was, and what it’s called."

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Firewalls compare traffic to Security policy rules, starting with the first rule at the top of
  > the Security policy rulebase. When traffic matches a rule’s criteria, the firewall executes the
  > rule’s action on the traffic and doesn't compare the traffic to any other rules.
- `cisco-asa-access-rules` §Rule Order
  > After a match is found, no more rules are checked.
- Note: The count matches Watch: five visits (website, visitor on port 22, admin on port 22, Telnet, website again) and one reply.

### units[0].learn.terms[0] ("term-firewall") — ✅

"Firewall: A guard that decides what may pass between a network and the outside"

- `nist-sp800-41r1` §2
  > Firewalls are devices or programs that control the flow of network traffic between networks or hosts that
  > employ differing security postures.
- `cisco-firewall` §What is a firewall?
  > A firewall is a network security device that separates a trusted internal network from an external network deemed untrustworthy, such as the internet.
- `cisco-firewall` §What is a firewall?
  > A firewall is the first line of defense that monitors incoming and outgoing traffic and decides to allow or block specific traffic based on a defined set of security rules.
- Note: Leaves out host firewalls and firewalls inside a network, which "deep-where" covers.

### units[0].learn.terms[1] ("term-rule") — ✅

"Rule: One line on the list: allow or block one kind of visit"

- `nist-sp800-41r1` §5.2.2
  > The end result is a set of rules called a
  > ruleset that describes how the firewall acts.
- `cisco-firewall` §What is a firewall?
  > decides to allow or block specific traffic based on a defined set of security rules.
- `paloalto-firewall-rules` §How Do Firewall Rules Work?
  > Each ACL contains numerous rules, each with conditions traffic must meet to either proceed or halt.

### units[0].learn.terms[2] ("term-port") — ✅

"Port: The door number a service answers at, like 443 for websites"

- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the
  > destination host
- `rfc-9110` §4.2.2
  > If the port subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- Note: "Websites" means secure (HTTPS) websites, the ordinary case today; plain HTTP uses port 80. RFC 9110 and the IANA registry define the 443 assignment.

### units[0].learn.terms[3] ("term-source") — ✅

"Source: The address a visit comes from (a rule can name one exact address, written /32)"

- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated
- `microsoft-windows-firewall` §Windows Firewall overview
  > This traffic can be filtered based on several criteria, including source and destination IP address
- `rfc-791` §3.1
  > Source Address: 32 bits
  > The source address.
- `rfc-4632` §3.1
  > n.n.n.n/32 1 4294967296 "host route"
- Note: RFC 791 defines the source address field and RFC 4632 defines the prefix notation. /32 is for IPv4; the claim leaves out IPv6, where one address is /128.

### units[0].learn.terms[4] ("term-first-match") — ✅

"First match: Reading from the top and stopping at the first rule that fits"

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `cisco-asa-access-rules` §Rule Order
  > When the ASA decides whether to forward or drop a packet, the ASA tests the packet against
  > each rule in the order in which the rules are listed in the applied ACL. After a match is found, no more rules are checked.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The way you order the rules
  > in the rulebase is critical because the firewall takes action on the traffic on the first rule
  > match and then stops comparing the traffic to the rulebase.

### units[0].learn.terms[5] ("term-default-deny") — ✅

"Default deny: Blocking whatever no rule allows, also called deny by default"

- `nist-sp800-41r1` §4
  > This practice, known as deny by
  > default, decreases the risk of attack
- `nist-sp800-41r1` §Appendix A
  > Deny by Default: To block all inbound and outbound traffic that has not been expressly permitted by
  > firewall policy.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- `cisco-asa-access-rules` §Implicit Deny
  > ACLs have an implicit deny at the end of the list, so unless you
  > explicitly permit it, traffic cannot pass.

### units[0].learn.terms[6] ("term-stateful") — ✅

"Stateful: Remembering the connections it let in, so their replies get back out"

- `nist-sp800-41r1` §2.1.2
  > If 192.0.2.71 and 192.168.1.100 complete the three-way TCP handshake, the connection
  > state will change to “established” and all subsequent traffic matching the entry will be allowed to pass
  > through the firewall.
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > you do not need an access rule to allow returning
  > traffic because the ASA allows all returning traffic for established,
  > bidirectional connections.
- `microsoft-azure-nsg` §Security rules
  > If inbound traffic is allowed over a port, it's not necessary to specify an outbound security rule to respond to traffic over the port.

### units[0].learn.terms[7] ("term-shadowed") — ✅

"Shadowed rule: A rule that never gets a turn, because one above it catches all its traffic first"

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > so traffic intended to match the specific rule
  > instead matches the general rule first and is never
  > compared to the specific rule.
- `google-cloud-firewall-insights` §Shadowed rules
  > Shadowed rules share attributes, such as IP addresses, with other rules with
  > higher or equal priority, called shadowing rules.
- `cisco-fmc-access-rules` §Rule preemption
  > Rule preemption is a policy evaluation condition that occurs when a rule will never match traffic because a rule earlier in
  > the evaluation order matches the traffic first.
- Note: Cisco calls the same thing rule preemption. The term leaves out partial shadowing, where only some of a rule's traffic is caught above it.

### units[0].learn.pattern ("pattern") — ✅

Names: Rule Evaluation, First-Match Rule, Default Deny, Stateful Inspection. Note: "Every visit: read from the top, stop at the first rule that fits, block whatever nothing allows, and let replies to allowed connections back out."

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted
  > by the firewall policy
- `nist-sp800-41r1` §Appendix A
  > Stateful Inspection: Packet filtering that also tracks the state of connections and blocks packets that
  > deviate from the expected state.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Firewalls compare traffic to Security policy rules, starting with the first rule at the top of
  > the Security policy rulebase.
- `cisco-asa-access-rules` §Rule Order
  > After a match is found, no more rules are checked.
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > the ASA allows all returning traffic for established,
  > bidirectional connections.
- Note: "Stateful Inspection" is NIST's term; the other names describe what the sources state in plain words. Default deny is what NIST recommends rather than what every firewall does; the pattern describes the lesson's list, which ends in one.

### units[0].learn.why[0] ("why-1") — ✅

"Without a firewall, every service on a computer the internet can reach would be open to anyone, including ones nobody meant to share."

- `nist-sp800-41r1` §2
  > By employing firewalls to control
  > connectivity to these areas, an organization can prevent unauthorized access to its systems and resources.
- `microsoft-windows-firewall-rules` §Applications rules
  > Allowing all inbound connections by default introduces the network to various threats.
- Note: "Open" means reachable over the network. A service may still ask for a login, which the claim leaves out.

### units[0].learn.why[1] ("why-2") — ✅

"A short list, read from the top, opens only the doors you need."

- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted
  > by the firewall policy—traffic that is not needed by the organization.
- `nist-sp800-41r1` §5.2.2
  > These rulesets should implement the organization’s firewall policy as documented in the system security
  > plan, and should be as specific as possible with regards to the network traffic they control.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- Note: "Short" is an everyday describing word; the point, allow only what is needed, is stated by both.

### units[0].learn.deep[0] ("deep-acl", Learn's Go deeper) — ✅

"Rule lists are also called access control lists (ACLs)."

- `nist-sp800-41r1` §2.1.1
  > the most common example of a pure
  > packet filtering device is a network router that employs access control lists.
- `paloalto-stateful-firewall` §Stateful vs. Stateless Firewalls
  > Stateless firewalls inspect each data packet independently against a set of predefined rules known as access control lists (ACLs).
- `paloalto-firewall-rules` §How Do Firewall Rules Work?
  > In enterprise environments, access control lists (ACLs) specify firewall rules
- `cisco-asa-access-rules` §Rule Order
  > each rule in the order in which the rules are listed in the applied ACL.
- Note: Some products use other names (Palo Alto's rulebase, Azure's security rules); "also called" allows for that.

### units[0].learn.deep[1] ("deep-types", Learn's Go deeper) — ✅

"A packet filter reads addresses and ports (layers 3 and 4), a stateful firewall adds a connection table, and a next-generation firewall also looks inside the traffic at the application."

- `nist-sp800-41r1` §2.1.1
  > In their most basic form, firewalls with packet filters operate at the network layer.
- `nist-sp800-41r1` §2.1.2
  > but unlike packet
  > filtering, stateful inspection keeps track of each connection in a state table.
- `nist-sp800-41r1` §2.1.3
  > an inspection engine that analyzes protocols
  > at the application layer
- `cisco-firewall` §Packet filtering firewall
  > These firewalls scrutinize each packet of data that passes through them, and then filters them based on parameters like source and destination IP addresses, port numbers, and protocol types.
- `cisco-firewall` §Stateful inspection firewall
  > It monitors all activity from the opening of a connection until it is closed.
- `cisco-firewall` §Next-generation firewall (NGFW)
  > While a traditional firewall typically provides stateful inspection of incoming and outgoing network traffic, a next-generation firewall includes additional features like application awareness and control
- `cisco-ngfw` §What is a next-generation firewall (NGFW)?
  > What sets it apart is inspection at the application layer
- `paloalto-firewall-types` §Stateful Inspection Firewall
  > Located at Layers 3 and 4 of the Open Systems Interconnection (OSI) model
- `paloalto-ngfw` §How does an NGFW work?
  > NGFWs operate at higher layers of the OSI model, including the application layer.
- `microsoft-azure-firewall-rule-sets` §Network rules
  > Network rules control inbound, outbound, and east-west traffic based on the network layer (L3) and transport layer (L4).

### units[0].learn.deep[2] ("deep-where", Learn's Go deeper) — ✅

"Network firewalls guard the edge of a network; host firewalls, like the one built into Windows, guard one computer."

- `nist-sp800-41r1` §2.1
  > Firewalls are often placed at the perimeter of a network.
- `nist-sp800-41r1` §2.2.1
  > These firewalls are software-based,
  > residing on the hosts they are protecting—each monitors and controls the incoming and outgoing network
  > traffic for a single host.
- `microsoft-windows-firewall` §Windows Firewall overview
  > Windows Firewall is a host-based firewall that is included with the operating system and enabled by default on all Windows editions.
- `paloalto-firewall` §Host-based firewall
  > Installed on a specific device to monitor traffic to and from that host.
- `paloalto-firewall` §Perimeter firewall
  > Placed at the edge of a network to manage traffic entering or leaving.
- Note: Leaves out internal firewalls that sit between parts of a network.

### units[0].learn.facts[0] ("fact-reads") — ✅

"Reads: Source, destination, protocol, port"

- `nist-sp800-41r1` §2.1.1
  > The network or transport protocol being used to communicate between source and destination hosts,
  > such as TCP, UDP, or ICMP
- `cisco-firewall` §Packet filtering firewall
  > filters them based on parameters like source and destination IP addresses, port numbers, and protocol types.

### units[0].learn.facts[1] ("fact-order") — ✅

"Order: Top to bottom, first match wins"

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `cisco-asa-access-rules` §Rule Order
  > After a match is found, no more rules are checked.
- `cisco-fmc-access-rules` §Access control rule order
  > The system matches traffic to rules in top-down order by ascending rule number.
- `paloalto-firewall-rules` §Firewall Rules Order
  > once a rule matches a packet, the firewall does not evaluate subsequent rules.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Firewalls compare traffic to Security policy rules, starting with the first rule at the top of
  > the Security policy rulebase.
- Note: True of the lesson's firewall and of most products; the exceptions are named in a Go deeper note on the "first-match" step.

### units[0].learn.facts[2] ("fact-default") — ✅

"Recommended default: Deny anything not allowed"

- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted
  > by the firewall policy
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- `cisco-asa-access-rules` §Implicit Deny
  > ACLs have an implicit deny at the end of the list, so unless you
  > explicitly permit it, traffic cannot pass.
- `microsoft-windows-firewall-rules` §Applications rules
  > The firewall's default settings are designed for security. Allowing all inbound connections by default introduces the network to various threats.

### units[0].learn.facts[3] ("fact-stateful") — ✅

"Stateful: Tracks the connections it allowed, until they close or go quiet"

- `nist-sp800-41r1` §2.1.2
  > stateful inspection keeps track of each connection in a state table.
- `nist-sp800-41r1` §2.1.2
  > the entry is removed from the state table after a preconfigured timeout value is
  > reached.
- `cisco-asa-connections` §Configure Global Timeouts
  > If the slot has
  > not been used for the idle time specified, the resource is returned to the free pool.
- `cisco-asa-connections` §Configure Global Timeouts
  > The idle time after which a connection closes,
- Note: NIST's termination state covers both a connection that is closed and one idle for a long time (quoted under the step "stateful" Go deeper); the second NIST quote, on page 15, is about removing an entry once its timeout runs out.

### units[0].learn.facts[4] ("fact-acl") — ✅

"Also called: Access control list (ACL)"

- `nist-sp800-41r1` §2.1.1
  > the most common example of a pure
  > packet filtering device is a network router that employs access control lists.
- `paloalto-stateful-firewall` §Stateful vs. Stateless Firewalls
  > a set of predefined rules known as access control lists (ACLs).
- `paloalto-firewall-rules` §How Do Firewall Rules Work?
  > In enterprise environments, access control lists (ACLs) specify firewall rules
- `cisco-asa-access-rules` §Rule Order
  > each rule in the order in which the rules are listed in the applied ACL.

### units[0].learn.facts[5] ("fact-ports") — ✅

"Ports here: TCP 443 HTTPS, TCP 22 SSH, TCP 23 Telnet"

- `iana-ports` §Registry
  > The Secure Shell (SSH)
- `iana-ports` §Registry
  > telnet 23 tcp Telnet
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- `rfc-9110` §4.2.2
  > TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- Note: The IANA registry is the defining record of all three assignments (22/tcp ssh, 23/tcp telnet, 443/tcp https); RFC 9110 defines the https default port.

### units[0].learn.facts[6] ("fact-logins") — ✅

"Remote logins: SSH is for logging in to and managing a computer from far away, and it is encrypted; Telnet, older and far less safe, sends plain text"

- `rfc-4251` §1
  > Secure Shell (SSH) is a protocol for secure remote login and other
  > secure network services over an insecure network.
- `rfc-4251` §4.1
  > while still providing a much higher
  > level of security than that offered by older solutions (e.g., telnet
- `nist-ir-7966` §3
  > Secure Shell (SSH) is a protocol for securely logging into a remote host and executing commands on that
  > host (e.g., administrative commands).
- `nist-ir-7966` §3
  > What distinguishes the SSH protocol from earlier remote
  > administration protocols, such as telnet, remote shell (rsh), remote login (rlogin), and remote copy (rcp),
  > is its built-in support for robust security features such as secure user and device authentication and
  > transmission encryption.
- `nist-sp800-123` §6.5
  > Use secure protocols that can provide encryption of both passwords and data (e.g., SSH, HTTPS); do
  > not use less secure protocols (e.g., telnet, FTP, NFS, HTTP)
- `nist-sp800-123` §4.2.1
  > Remote control and remote access programs, particularly those that do not strongly encrypt their
  > communications (e.g., Telnet)
- `cloudflare-ssh` §What is the Secure Shell (SSH) protocol?
  > Older remote management protocols like Telnet transported administrators' commands in a form that anyone could see.
- Note: RFC 4251 defines SSH; NISTIR 7966 is current (October 2015, not withdrawn). Plain text for Telnet is stated by Cloudflare and NIST SP 800-123, a government guide.

### units[0].learn.facts[7] ("fact-catch-all") — ✅

"Catch-all rule: Last, below the more specific rules"

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The logic for all other rules is to place the most specific rules near the top of the rulebase
  > and the most general rules closer to the bottom of the rulebase.
- `paloalto-firewall-rules` §Firewall Rules Order
  > More specific rules must precede more general ones to ensure proper traffic filtering and avoid unintended blocking or allowing of traffic.
- `cisco-fmc-access-rules` §Access control rule order
  > Access control rules that use specific conditions (such as networks and IP addresses) should be ordered before rules that use general conditions (such as applications).
- Note: The two Palo Alto pages are one publisher; Cisco is the second independent source. A catch-all is the most general rule there is, so it goes at the bottom.

### units[0].practice[0].options[0] (question "port-8080") — ✅

Option (right): "It’s blocked by Block everything else, because nothing above it allows the visit." Feedback: "Right. It doesn’t fit Website or Admin login, so it falls through to Block everything else. That’s default deny."

- `nist-sp800-41r1` §4
  > This practice, known as deny by
  > default, decreases the risk of attack
- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > When traffic matches a rule’s criteria, the firewall executes the
  > rule’s action on the traffic and doesn't compare the traffic to any other rules.
- `cisco-asa-access-rules` §Rule Order
  > After a match is found, no more rules are checked.
- Note: Against the lesson's list (443 from anyone, 22 from the admin, deny all), port 8080 falls to rule 3; the option is right.

### units[0].practice[0].options[1] (question "port-8080") — ✅

Option (wrong): "It gets through, because no rule mentions port 8080." Feedback: "Not quite. With default deny, a door nobody opened stays shut. Block everything else stops it."

- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted
  > by the firewall policy
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule
  > matches the traffic, the firewall drops the traffic (implicit deny).
- `cisco-asa-access-rules` §Implicit Deny
  > ACLs have an implicit deny at the end of the list, so unless you
  > explicitly permit it, traffic cannot pass.

### units[0].practice[0].options[2] (question "port-8080") — ✅

Option (wrong): "The firewall asks the admin what to do." Feedback: "Not quite. The firewall decides on its own, from its list. Block everything else stops it."

- `nist-sp800-41r1` §5.2.2
  > The end result is a set of rules called a
  > ruleset that describes how the firewall acts.
- `cisco-firewall` §What is a firewall?
  > A firewall is the first line of defense that monitors incoming and outgoing traffic and decides to allow or block specific traffic based on a defined set of security rules.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > When traffic matches a rule’s criteria, the firewall executes the
  > rule’s action on the traffic
- Note: A host firewall such as Windows Firewall can prompt a user when a new app wants to accept connections; that is not this network firewall's case, and the feedback is about the lesson's list.

### units[0].practice[1].options[0] (question "two-rules") — ✅

Option (right): "Yes. Rule 1 fits first, so rule 2 is never read." Feedback: "That’s it. The first rule that fits decides. Swap the two rules and the login would be blocked."

- `nist-sp800-41r1` §5.2.2
  > For example, many
  > firewalls check traffic against rules in a sequential manner until a match is found.
- `cisco-asa-access-rules` §Rule Order
  > After a match is found, no more rules are checked.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > the firewall takes action on the traffic on the first rule
  > match and then stops comparing the traffic to the rulebase.
- Note: The prompt sets a list read from the top, so the first-match answer is right; "log in" means the firewall lets the login attempt through.

### units[0].practice[1].options[1] (question "two-rules") — ✅

Option (wrong): "No. Rule 2 names its exact address, so it wins." Feedback: "Not quite. Being more exact doesn’t win; being higher up does. Rule 1 fits first."

- `cisco-asa-access-rules` §Rule Order
  > For example, if you create an access rule at the beginning that explicitly permits all traffic for an interface, no further
  > rules are ever checked.
- `paloalto-firewall-rules` §Firewall Rules Order
  > once a rule matches a packet, the firewall does not evaluate subsequent rules.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If you place general rules
  > before specific rules in the rulebase, traffic that you intend to match the specific rule
  > might match the general rule instead
- Note: True for a list read from the top, which the prompt sets. Some products (Windows Firewall) do favour the more specific rule, and the lesson says elsewhere that some products sort rules in other ways.

### units[0].practice[1].options[2] (question "two-rules") — ✅

Option (wrong): "No. Deny always beats allow." Feedback: "Not quite. Neither word beats the other. The first rule that fits decides, and that’s rule 1."

- `cisco-asa-access-rules` §Rule Order
  > The order of rules is important. When the ASA decides whether to forward or drop a packet, the ASA tests the packet against
  > each rule in the order in which the rules are listed in the applied ACL.
- `paloalto-firewall-rules` §Firewall Rules Order
  > The ordering of firewall rules is important because firewalls process rules sequentially, typically from the top down.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The order of the rules determines
  > how the firewall handles traffic.
- Note: True within the prompt's top-down list. Some products do check deny rules first, which a Go deeper note on the "first-match" step covers.

### units[0].practice[2].options[0] (question "why-reply") — ✅

Option (wrong): "Replies are never checked." Feedback: "Not quite. Replies cross the firewall too. This one passed because the firewall remembered the connection."

- `nist-sp800-41r1` §2.1.2
  > Each new packet is compared by the firewall to the firewall’s state table to
  > determine if the packet’s state contradicts its expected state.
- `paloalto-stateful-firewall` §How Does Stateful Inspection Work?
  > Stateful inspection analyzes the packet header to determine whether it is part of an existing conversation or if it is a new request.
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > the ASA allows all returning traffic for established,
  > bidirectional connections.

### units[0].practice[2].options[1] (question "why-reply") — ✅

Option (right): "It belonged to a connection the firewall had already let in." Feedback: "Yes. A stateful firewall remembers the connections it allowed and lets their replies through."

- `nist-sp800-41r1` §2.1.2
  > all subsequent traffic matching the entry will be allowed to pass
  > through the firewall.
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > you do not need an access rule to allow returning
  > traffic because the ASA allows all returning traffic for established,
  > bidirectional connections.
- `microsoft-azure-nsg` §Security rules
  > The flow record allows a network security group to be stateful.

### units[0].practice[2].options[2] (question "why-reply") — ✅

Option (wrong): "The Website rule allows everything to and from port 443." Feedback: "Not quite. The Website rule is for visits coming in. The reply passed because it belonged to a connection the firewall remembered."

- `nist-sp800-41r1` §2.1.2
  > If it is permitted, an entry is added to the state
  > table that indicates a new session is being initiated
- `cisco-asa-access-rules` §Extended Access Rules for Returning Traffic
  > For TCP, UDP, and SCTP connections for both
  > routed and transparent mode, you do not need an access rule to allow returning
  > traffic
- `microsoft-azure-nsg` §Security rules
  > If inbound traffic is allowed over a port, it's not necessary to specify an outbound security rule to respond to traffic over the port.

## Traced, example and analogy parts, and unbacked items

All traced items say nothing beyond the Learn parts they trace to. Addresses and ports in them are example data: 203.0.113.50 and 198.51.100.7 (RFC 5737), 10.0.0.10 (RFC 1918), and made-up client ports such as 50432.

- `title` — ✅
- `units[0].name` — ✅
- `backing (the lesson's subtitle and summary)` — ✅
- `units[0].backing (the unit's full name and purpose)` — ✅
- `units[0].scene.backing (the scene)` — ✅
- `units[0].overview.hookBacking (the Overview hook)` — ✅
- `units[0].overview.backing (the Overview description)` — ✅
- `units[0].overview.facts[0] (Overview fact "Works with")` — ✅
- `units[0].overview.facts[1] (Overview fact "Reads rules")` — ✅
- `units[0].overview.facts[2] (Overview fact "Recommended default")` — ✅
- `units[0].overview.facts[3] (Overview fact "Remembers")` — ✅
- `units[0].overview.facts[4] (Overview fact "Common types")` — ✅
- `units[0].steps[0] (step "rule-evaluation")` — ✅
- `units[0].steps[0].facts[0] (step "rule-evaluation", fact "Visit")` — ✅
- `units[0].steps[0].facts[1] (step "rule-evaluation", fact "Rule 1")` — ✅
- `units[0].steps[0].facts[2] (step "rule-evaluation", fact "Result")` — ✅
- `units[0].steps[0].facts[3] (step "rule-evaluation", fact "Rules read")` — ✅
- `units[0].steps[0].events[0] (event "visit-website")` — ✅
- `units[0].steps[0].events[1] (event "visit-website-conn")` — ✅
- `units[0].steps[1] (step "first-match")` — ✅
- `units[0].steps[1].facts[0] (step "first-match", fact "Visit")` — ✅
- `units[0].steps[1].facts[1] (step "first-match", fact "Rule 1")` — ✅
- `units[0].steps[1].facts[2] (step "first-match", fact "Rule 2")` — ✅
- `units[0].steps[1].facts[3] (step "first-match", fact "Result")` — ✅
- `units[0].steps[1].events[0] (event "visit-login")` — ✅
- `units[0].steps[2] (step "source-filtering")` — ✅
- `units[0].steps[2].facts[0] (step "source-filtering", fact "Visit")` — ✅
- `units[0].steps[2].facts[1] (step "source-filtering", fact "Rule 2")` — ✅
- `units[0].steps[2].facts[2] (step "source-filtering", fact "Result")` — ✅
- `units[0].steps[2].events[0] (event "admin-login")` — ✅
- `units[0].steps[2].events[1] (event "admin-login-conn")` — ✅
- `units[0].steps[3] (step "default-deny")` — ✅
- `units[0].steps[3].facts[0] (step "default-deny", fact "Visit")` — ✅
- `units[0].steps[3].facts[1] (step "default-deny", fact "Rules that fit")` — ✅
- `units[0].steps[3].facts[2] (step "default-deny", fact "Result")` — ✅
- `units[0].steps[3].events[0] (event "visit-telnet")` — ✅
- `units[0].steps[4] (step "stateful")` — ✅
- `units[0].steps[4].facts[0] (step "stateful", fact "Reply")` — ✅
- `units[0].steps[4].facts[1] (step "stateful", fact "Why it passes")` — ✅
- `units[0].steps[4].facts[2] (step "stateful", fact "Rules read")` — ✅
- `units[0].steps[4].events[0] (event "reply-website")` — ✅
- `units[0].steps[5] (step "shadowing")` — ✅
- `units[0].steps[5].facts[0] (step "shadowing", fact "Change")` — ✅
- `units[0].steps[5].facts[1] (step "shadowing", fact "Visit")` — ✅
- `units[0].steps[5].facts[2] (step "shadowing", fact "Result")` — ✅
- `units[0].steps[5].facts[3] (step "shadowing", fact "Never read")` — ✅
- `units[0].steps[5].events[0] (event "move-catch-all-rules")` — ✅
- `units[0].steps[5].events[1] (event "move-catch-all-conns")` — ✅
- `units[0].steps[5].events[2] (event "move-catch-all")` — ✅
- `units[0].steps[5].events[3] (event "visit-website-again")` — ✅
- `units[0].practice[0].prompt (question "port-8080")` — ✅
- `units[0].practice[1].prompt (question "two-rules")` — ✅
- `units[0].practice[2].prompt (question "why-reply")` — ✅

Notes on these parts:

- The scene's rule list, connection table and log repeat term-rule, fact-ports, term-source, term-stateful and fact-order; every address in it is example data.
- The Overview hook's gate-guard picture matches term-firewall, term-rule and term-default-deny, and does not mislead.
- In step "stateful", the line that no rule allows traffic out to the visitor, and the fact "Rules read: None", restate that the reply passes on the connection table alone, as term-stateful and fact-stateful say.
- The three prompts have no false premise: port 8080 is in no rule of the starting list, the two-rule list is set as read from the top, and the reply did pass with no rule of its own.

## Sources

All checked 2026-11-12.

- `rfc-791`: RFC Editor metadata says Internet Standard, not obsoleted; updated by RFC 1349, 2474 and 6864, which do not touch the address fields. Current.
- `rfc-1918`: Best Current Practice (BCP 5), not obsoleted; updated by RFC 6761 (special-use domain names), which does not change the private blocks. Current.
- `rfc-4251`: Proposed Standard, not obsoleted; updated by RFC 8308 and RFC 9141, which leave §1 and §4.1 as they are. Current.
- `rfc-4632`: Best Current Practice, not obsoleted or updated. Current.
- `rfc-9110`: Internet Standard, not obsoleted or updated. Current.
- `rfc-9293`: Internet Standard, not obsoleted or updated. Current.
- `iana-ports`: live registry, last updated 2026-11-10. Current.
- `nist-sp800-41r1`: CSRC lists SP 800-41 Rev. 1 (September 2009) as final, superseding the 2002 edition; not withdrawn, no newer revision. Current.
- `nist-sp800-123`: CSRC lists it as final (July 2008), not withdrawn or superseded. Current.
- `nist-ir-7966`: CSRC lists it as final (October 2015), not withdrawn or superseded. Current.
- `cisco-asa-access-rules`, `cisco-asa-connections`: live pages of the ASA 9.24(x) Firewall CLI guide, the current ASA release line (guide revised 2026). Current.
- `cisco-fmc-access-rules`: live page of the FMC 7.7 guide. A 10.x guide also exists, but 7.7 is a release line still in use and the rule order, block actions and preemption it describes are current behaviour. Current.
- `cisco-firewall`, `cisco-ngfw`: live Cisco explainer pages. Current.
- `cloudflare-firewall`, `cloudflare-ssh`: the command line got a 403, so both were read in the built-in browser; live Learning Center pages. Current.
- `google-cloud-firewall-insights`: live Google Cloud documentation. Current.
- `microsoft-azure-firewall-rule-sets` (updated 2026-03), `microsoft-azure-network-best-practices` (2026-07), `microsoft-azure-nsg` (2025-10), `microsoft-windows-firewall`, `microsoft-windows-firewall-rules` (2026-10): live Microsoft Learn pages for current products. Current.
- `paloalto-firewall`, `paloalto-firewall-rules`, `paloalto-firewall-types`, `paloalto-ngfw`, `paloalto-stateful-firewall`: live Palo Alto Cyberpedia explainers describing current practice. Current.
- `paloalto-rulebase-best-practices`, `paloalto-security-rules`: live Palo Alto product documentation (PAN-OS). Current.

## Limit overrides

None.
