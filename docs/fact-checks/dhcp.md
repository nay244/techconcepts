```json fact-check
{
  "slug": "dhcp",
  "hash": "16978e2c1273ad858b0d891c34dac682d59b261711846a243f4e49d90f617a0e",
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
    "units[0].overview.facts[0] (Overview fact \"Ports\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Hands out\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Exchange\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Lease\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"discover\")": "✅",
    "units[0].steps[0].facts[0] (step \"discover\", fact \"From\")": "✅",
    "units[0].steps[0].facts[1] (step \"discover\", fact \"To\")": "✅",
    "units[0].steps[0].facts[2] (step \"discover\", fact \"MAC destination\")": "✅",
    "units[0].steps[0].facts[3] (step \"discover\", fact \"Laptop MAC\")": "✅",
    "units[0].steps[0].events[0] (event \"msg-discover\")": "✅",
    "units[0].steps[1] (step \"offer\")": "✅",
    "units[0].steps[1].facts[0] (step \"offer\", fact \"Address offered\")": "✅",
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Subnet mask\")": "✅",
    "units[0].steps[1].facts[2] (step \"offer\", fact \"Gateway\")": "✅",
    "units[0].steps[1].facts[3] (step \"offer\", fact \"Lease\")": "✅",
    "units[0].steps[1].events[0] (event \"msg-offer\")": "✅",
    "units[0].steps[2] (step \"request\")": "✅",
    "units[0].steps[2].facts[0] (step \"request\", fact \"Address requested\")": "✅",
    "units[0].steps[2].facts[1] (step \"request\", fact \"Server chosen\")": "✅",
    "units[0].steps[2].facts[2] (step \"request\", fact \"Sent from\")": "✅",
    "units[0].steps[2].events[0] (event \"msg-request\")": "✅",
    "units[0].steps[3] (step \"acknowledge\")": "✅",
    "units[0].steps[3].facts[0] (step \"acknowledge\", fact \"Address\")": "✅",
    "units[0].steps[3].facts[1] (step \"acknowledge\", fact \"Lease\")": "✅",
    "units[0].steps[3].facts[2] (step \"acknowledge\", fact \"Lease table row\")": "✅",
    "units[0].steps[3].events[0] (event \"msg-ack\")": "✅",
    "units[0].steps[3].events[1] (event \"lease-add\")": "✅",
    "units[0].steps[4] (step \"renew\")": "✅",
    "units[0].steps[4].facts[0] (step \"renew\", fact \"Renews at\")": "✅",
    "units[0].steps[4].facts[1] (step \"renew\", fact \"Sent to\")": "✅",
    "units[0].steps[4].facts[2] (step \"renew\", fact \"New expiry\")": "✅",
    "units[0].steps[4].events[0] (event \"msg-renew-request\")": "✅",
    "units[0].steps[4].events[1] (event \"msg-renew-ack\")": "✅",
    "units[0].steps[4].events[2] (event \"lease-renew\")": "✅",
    "units[0].steps[0].deep[0] (step \"discover\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"offer\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"request\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"acknowledge\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"renew\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.terms[0] (\"term-broadcast\")": "✅",
    "units[0].learn.terms[1] (\"term-discover\")": "✅",
    "units[0].learn.terms[2] (\"term-offer\")": "✅",
    "units[0].learn.terms[3] (\"term-request\")": "✅",
    "units[0].learn.terms[4] (\"term-ack\")": "✅",
    "units[0].learn.terms[5] (\"term-lease-table\")": "✅",
    "units[0].learn.terms[6] (\"term-lease\")": "✅",
    "units[0].learn.terms[7] (\"term-renew\")": "✅",
    "units[0].learn.terms[8] (\"term-ip\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-ports\")": "✅",
    "units[0].learn.facts[1] (\"fact-first\")": "✅",
    "units[0].learn.facts[2] (\"fact-t1\")": "✅",
    "units[0].learn.facts[3] (\"fact-t2\")": "✅",
    "units[0].learn.facts[4] (\"fact-no-server\")": "✅",
    "units[0].learn.facts[5] (\"fact-defined\")": "✅",
    "units[0].learn.facts[6] (\"fact-home\")": "✅",
    "units[0].learn.facts[7] (\"fact-settings\")": "✅",
    "units[0].learn.facts[8] (\"fact-mac\")": "✅",
    "units[0].learn.facts[9] (\"fact-replies\")": "✅",
    "units[0].learn.facts[10] (\"fact-request\")": "✅",
    "units[0].learn.facts[11] (\"fact-ack\")": "✅",
    "units[0].learn.facts[12] (\"fact-ignore\")": "✅",
    "units[0].learn.facts[13] (\"fact-link\")": "✅",
    "units[0].learn.facts[14] (\"fact-name\")": "✅",
    "units[0].practice[0].options[0] (question \"why-shout\")": "✅",
    "units[0].practice[0].options[1] (question \"why-shout\")": "✅",
    "units[0].practice[0].options[2] (question \"why-shout\")": "✅",
    "units[0].practice[1].options[0] (question \"no-repeats\")": "✅",
    "units[0].practice[1].options[1] (question \"no-repeats\")": "✅",
    "units[0].practice[1].options[2] (question \"no-repeats\")": "✅",
    "units[0].practice[2].options[0] (question \"when-renew\")": "✅",
    "units[0].practice[2].options[1] (question \"when-renew\")": "✅",
    "units[0].practice[2].options[2] (question \"when-renew\")": "✅",
    "units[0].practice[0].prompt (question \"why-shout\")": "✅",
    "units[0].practice[1].prompt (question \"no-repeats\")": "✅",
    "units[0].practice[2].prompt (question \"when-renew\")": "✅"
  },
  "sources": [
    {
      "id": "canonical-dhcp-concepts",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-dhcp-troubleshoot",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "google-nest-lan-ip",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-dhcp-basics",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-dhcp-server",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-dhcp-training",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-dhcp-troubleshoot",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-ipconfig",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-network-settings",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-2131",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-2132",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-3927",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5227",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-894",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 177,
    "digest": "38df6a27c281453a8584f9a38385036b2242ac11a74e9badcb9c3b1a18ac0e14",
    "files": {
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-2132": "0cfbedab7cfe859624ae78c07a722bc51bf8ea123a7b43b099fc546ddcf00b90",
      "cisco-dhcp-troubleshoot": "a0a19050431ed041266e19888996164fba93240c0c7940b3ea177c925cccd197",
      "microsoft-dhcp-basics": "753b379e6bf66f5797fa20d1c0a419980c2a387b54a79ab8e8c6841a6e91af74",
      "microsoft-dhcp-troubleshoot": "d03c04a3e7bde9e2d1063e0465dd939698018be89f27c825a8ec93f507a42ba3",
      "microsoft-ipconfig": "465cb5a0f45fc18f4ba87f621a14b9b9891a7cf8dc7618e55500f4d9c688fbd5",
      "microsoft-network-settings": "1f07e6d382356fbf80289d7cd5e54dd962339f2c9a7ac5ade0f01f0ef702b05d",
      "google-nest-lan-ip": "785c113f2f6bc47fce7f5064700ee296a941d660b90c7929a963761f1afe7971",
      "microsoft-dhcp-server": "f8e81ba8570e0b624102fd3fe30664ec2e9ce9d8a8a639c3c966941992a5cfc1",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "canonical-dhcp-concepts": "06ce85db84299ca1902e7ccb0b2f81905391488f0cf653cdece4bbcc66f5e827",
      "rfc-5227": "bfe6de915c68fddffa6bee54dd217a377d2c694c4233cef1696c936d4202ecd4",
      "microsoft-dhcp-training": "18fe9bb45d09a9f5a84f6151c3a38e4750fb3dd113ca423e0eea8c2ded69c859",
      "rfc-3927": "8f267f455dc791ca9c63b8a4ff6a9abeb61f6cfbfc288b29483c593fe4cb90e6",
      "rfc-894": "be88b9301e53f986aca3a0e55e488d1d79bae3f88fe3f257640397bc089e7035"
    }
  },
  "items": {
    "title": "27b33ed0f694e89dafbdb5eb7d9975849988eabed01aeec5cbf964043eb02cda",
    "units[0].name": "73571337af6dbc06d87da831bd0221b5c7df07d4c20ddbba20aeaf983e434ec7",
    "units[0].osi": "17c8769f2b58beff9273753a44012a077e731b61b24948a7d59567552df0492d",
    "backing (the lesson's subtitle and summary)": "a8ff073b54a1612a61ab38985f03c69d4c9ce774e761783a5f81bd8e92f84446",
    "units[0].backing (the unit's full name and purpose)": "41398827dfcc0169da47915a6c1b8860ed2753d3f8d7c74b32bfdbd2b8d376be",
    "units[0].scene.backing (the scene)": "d51bf72289950d4f6b34f6bdacb1a6d1896ca425083055a9534942a786def3bf",
    "units[0].overview.hookBacking (the Overview hook)": "b1e8a53e99088f048a39aaa0ae1a776c4b92c074cd9341e959ce372dab0b70a0",
    "units[0].overview.backing (the Overview description)": "6cd6c365a999f9dcd059046b46d9f8d624764b8e12137dd0a8e42b815d99cf2d",
    "units[0].overview.facts[0] (Overview fact \"Ports\")": "9262aa7c5c7dd8ad776b271e9c8f5a123d42e2dc41ba390f960a8d19bd043a9f",
    "units[0].overview.facts[1] (Overview fact \"Hands out\")": "d3e95085c8189e111a71109b4ad6b413c18c09bac86c5dc777a4f74c3c9d7ba7",
    "units[0].overview.facts[2] (Overview fact \"Exchange\")": "ed82697f28cb4574b4420e360c7a181e0a645aa1f96300b5b03cf382a02f6e83",
    "units[0].overview.facts[3] (Overview fact \"Lease\")": "5bf1e58d4c41c2416cff03acf8fe80efcdc841fc5d125dd49b2fa4a8952dda80",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "1f82133a10744fa46069072011b1ab6bc539cd22a4470e47186f4e1ec3d250f0",
    "units[0].steps[0] (step \"discover\")": "9f1c02ea2be2bf2900a15c45506e9bc3b67a0f5914d7eed3468662a9a532120e",
    "units[0].steps[0].facts[0] (step \"discover\", fact \"From\")": "d7c10eb895b11c1eff99f7f2c33f3ab56582cbd957a6078cf7713d836c0f2d66",
    "units[0].steps[0].facts[1] (step \"discover\", fact \"To\")": "752d6bcbc6fedf170fab97d5420dc3d25ab65baa20165bd17162992fbc07c0f3",
    "units[0].steps[0].facts[2] (step \"discover\", fact \"MAC destination\")": "ad83d8f566765824022daa9bb850d793bcd4ba0c48e86e73842bda2f212608a6",
    "units[0].steps[0].facts[3] (step \"discover\", fact \"Laptop MAC\")": "18e34b1c071df05e899e3149d141d5d28a7d7a3c731ad721d8b7f7da577ea618",
    "units[0].steps[0].events[0] (event \"msg-discover\")": "1b88a75566d2fcd632e9ae0d047d250d26880d10618e346ba8b6a909656302af",
    "units[0].steps[1] (step \"offer\")": "dae2f69e418c916b3282b9ab048111d2f3aa4ecea02dd3844291beac4e65002e",
    "units[0].steps[1].facts[0] (step \"offer\", fact \"Address offered\")": "f24f76479e5c70a291b81e98dd5eb560a452e40d8f364acb43d8af5bed040a6a",
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Subnet mask\")": "5c885856f43efa1a8082a261e2b029a94c690423dea7298406aad889054183c0",
    "units[0].steps[1].facts[2] (step \"offer\", fact \"Gateway\")": "f21d329a1840aaa506549796dfb10c95b502d8a9a7d05c8bbf474dde4b03c245",
    "units[0].steps[1].facts[3] (step \"offer\", fact \"Lease\")": "2b5a0db8ed6d045513fac6cb283aeafe392c07b8adc8d1a0a085aba0e74c9f85",
    "units[0].steps[1].events[0] (event \"msg-offer\")": "25003f9c723775c6c5ff94aac845665ed6969635633b6e92d9884d73a89b77e0",
    "units[0].steps[2] (step \"request\")": "dc729f8e8c93b3ce010b02b2af33ccf91622e6a3df9b11a9671752acf7b85641",
    "units[0].steps[2].facts[0] (step \"request\", fact \"Address requested\")": "0ed8c1dd02c2abf2cf74a2dbe98053829f002cd3c7c42e2246b2d2c1feac2abb",
    "units[0].steps[2].facts[1] (step \"request\", fact \"Server chosen\")": "e528b5b198f58436577ea944a420b16e3470e94665d8f1f3c7d43b014990ca84",
    "units[0].steps[2].facts[2] (step \"request\", fact \"Sent from\")": "af4e333920d556cc73d8da16b0c66212fbeb5ff87fac988f271cfa7e547aaa30",
    "units[0].steps[2].events[0] (event \"msg-request\")": "5f41f9c28c2d296d49f8f6a611316c36c21e07da16997a035e7c97a770d06a59",
    "units[0].steps[3] (step \"acknowledge\")": "1152bc95e5ff3c59e2b1417ed2b11e1dc2513e5e8f39e629c71c1ab9a233709c",
    "units[0].steps[3].facts[0] (step \"acknowledge\", fact \"Address\")": "6b6c88529c8b0d4a2258d8e4b3fcddd0ce64eeda704a2ecb6adc53a19768e091",
    "units[0].steps[3].facts[1] (step \"acknowledge\", fact \"Lease\")": "29003594560b0515abf0c47e19f1f97a66e2522f9019aff9126e187f6320f128",
    "units[0].steps[3].facts[2] (step \"acknowledge\", fact \"Lease table row\")": "f4e64a7f4d2781a021089f0e5776ad539a831e9bdd8c60705986d190cecfe69e",
    "units[0].steps[3].events[0] (event \"msg-ack\")": "fba28bee2ade12a61c31b32dca6e0ce7370791846ecd5eafd5ffaf530eb6ce5e",
    "units[0].steps[3].events[1] (event \"lease-add\")": "65b59c397ee96de3369a5bb937d5b96919c6c83d21dae39905360397f28d1a8a",
    "units[0].steps[4] (step \"renew\")": "42bf63482d6b40837372618f937acaffba671c506d651a6eb781a3aae5145b80",
    "units[0].steps[4].facts[0] (step \"renew\", fact \"Renews at\")": "4b9c58f1ae38fed5856355926a0301f3cde8fad63d0f3181d5a1ccaf537060a0",
    "units[0].steps[4].facts[1] (step \"renew\", fact \"Sent to\")": "018ff2cca2202d1de159306b137e69b1fe32d8f7a6251c0f1140bee0b13b452c",
    "units[0].steps[4].facts[2] (step \"renew\", fact \"New expiry\")": "d626478cf7a723bad7dd3a2da7bec9601f3e1dbd6561c5d5b985b331d47227a9",
    "units[0].steps[4].events[0] (event \"msg-renew-request\")": "176982c5efedbe1ed0cf26b0df547e73351b568b24bec5701b8f3265729896ef",
    "units[0].steps[4].events[1] (event \"msg-renew-ack\")": "e47a21bde19b419651dccbf552019f501a51db2fba7f658e64914f0d5cf33059",
    "units[0].steps[4].events[2] (event \"lease-renew\")": "679fda7b1ec9f6ef5c89ff32e8b4604064ec40a3ac84e8c1bbb186c7f093b127",
    "units[0].steps[0].deep[0] (step \"discover\", Go deeper)": "21fe4f550b54253c3415ea86e6762a434232b0e5925dc15861c2813989811479",
    "units[0].steps[1].deep[0] (step \"offer\", Go deeper)": "2d2a7cc354e27ac7cd5d84371d3af000fedac6cb9dd5d6566173e7007ada544f",
    "units[0].steps[2].deep[0] (step \"request\", Go deeper)": "6423ac3ce09f67df44db81150f511cc37752e03163595b0951fb08045dca915c",
    "units[0].steps[3].deep[0] (step \"acknowledge\", Go deeper)": "332456406d8c8c853ec6f6a8e9b8acbf19386723f7a1b07828905bea1dcb1f00",
    "units[0].steps[4].deep[0] (step \"renew\", Go deeper)": "25b6f435fa44de9371340ce2b0fb3c2fb3f1bbfe0d5bab0d630986c1d08a9b77",
    "units[0].learn.lead[0] (\"lead-1\")": "a70b82afab4b8eb43d6ebc9ed3bb995150cf5a28e6163a6b4bb4912300eb1ebf",
    "units[0].learn.terms[0] (\"term-broadcast\")": "a8eb9ac5772b496f206b05626bb417fe8b900a64d43f78ab9e4eb5a8a044e56a",
    "units[0].learn.terms[1] (\"term-discover\")": "d321b998b5202fc666ac189e0f634f2b98c5da22d7544eea76498ce3251759db",
    "units[0].learn.terms[2] (\"term-offer\")": "c09da9b0340aec60b39fd9cfb406b15c7723044906fa29e5f083d3987742f4cf",
    "units[0].learn.terms[3] (\"term-request\")": "0730ee0ab2c1232de586a72f08106bff3724a6f2d57c2333b21201e531468107",
    "units[0].learn.terms[4] (\"term-ack\")": "c77ecb38d6eab59149d7db8ebdf2be86d6708fda654fe4b870d53ad0ad4176e4",
    "units[0].learn.terms[5] (\"term-lease-table\")": "8826921cfa2c94a450464aed4731cbc725c2db432850dcc09f99a0ed8b8a59f6",
    "units[0].learn.terms[6] (\"term-lease\")": "400e34c2600152f37df863ffe973a800b1a517806426c32b7f2114273c762cfb",
    "units[0].learn.terms[7] (\"term-renew\")": "cf127191b33f1b063cfb66bba94730eac397f947774c9938261a4fb9eaf04bab",
    "units[0].learn.terms[8] (\"term-ip\")": "20c47ccdcca42b8c62ec2984cdd76a22f661128e81e0f3b51f68d9c4b29ae333",
    "units[0].learn.pattern (\"pattern\")": "2bcc53053ae88a18374f7da4fa24582f79d001c4275f1182a01a1bd592187a6f",
    "units[0].learn.why[0] (\"why-1\")": "4682f0a40ac77c3745f21033ba53c27b4adff1fd022be954b6a8e6609da011a6",
    "units[0].learn.why[1] (\"why-2\")": "97c06d83347d44c5dc3c73f5c612665a6fb0b332947b5f81ed24ea827af4aaa7",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "ad2197a6e0a89371017efec2dfc2a07e16b8cb68067de013a626c03b9cf35a39",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "f5a29517c3479bccd11287a4d92c0cbbcf07dbf6d9832048521a015a89d9b560",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "4dc02220864326f5fb9e25aa701b5e64af9be39b8c277b5761245b134d50bebf",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "0663e1c25ed7cd76f9e23ac2fb93dbcb22613c33f4503ae5a26880253f7b4834",
    "units[0].learn.facts[0] (\"fact-ports\")": "d8fd75df765921214d2455556b73aef41a85ff61b2dcfeb9bd35654531b47764",
    "units[0].learn.facts[1] (\"fact-first\")": "96efed8e815bc4f384d0906977c6c5bdd57c6b12c5cda072e047ec93b5d4c7db",
    "units[0].learn.facts[2] (\"fact-t1\")": "e7bebca2afcd87fc2498b6a4c3b21f01d650ee8b40f1630860c98d0a1eb0ac52",
    "units[0].learn.facts[3] (\"fact-t2\")": "b5e8ccd937a52cb2e9a5c7031872f997551f294a9f96c3c2005c1615db8a90dc",
    "units[0].learn.facts[4] (\"fact-no-server\")": "bd03694ec9ec598d30a8a0efac82656f1e41de95e61d2d92db88511fe87288e4",
    "units[0].learn.facts[5] (\"fact-defined\")": "60dd1433105d3c55a34e4f25093d282df2d92cdb9f77df7eb8e99929c7658f59",
    "units[0].learn.facts[6] (\"fact-home\")": "24421a9f4b68a1acf7854822c290375cf44e2efc666a7976dec4ffe111ea7868",
    "units[0].learn.facts[7] (\"fact-settings\")": "f819ac501e77df6f1f87c06e745746d0731fdbfc2e59f5f315691d5618af26b8",
    "units[0].learn.facts[8] (\"fact-mac\")": "b5b59bea2f6d8602cdd6da40b502952aff21482cef39255eff926d8c38008455",
    "units[0].learn.facts[9] (\"fact-replies\")": "05a1a338f26a985e1377d1cf0ab46d1b2f49bc0fa26269c33ab93521ebd1b593",
    "units[0].learn.facts[10] (\"fact-request\")": "90f222692f349ddc8d5d0dfc0e8cae59d67bd791e6376a4737e970371ad6610e",
    "units[0].learn.facts[11] (\"fact-ack\")": "c5b9ba2bf5d51f3fe8b929239a5fe5051548a112942e9b529e61284a1d3e1bde",
    "units[0].learn.facts[12] (\"fact-ignore\")": "9e3cfb248386eea717843f3c4163afa69278e65375cd0aba9ac0c65cf4bf3df6",
    "units[0].learn.facts[13] (\"fact-link\")": "ed53051cabc0335f62e66f0ef34bace6be4fcce564b6b6430bcb72c50de9b46c",
    "units[0].learn.facts[14] (\"fact-name\")": "98a8ef025ebf15adfca014d9841fdae4f9c17252e51afd653cd6571804a42f5a",
    "units[0].practice[0].options[0] (question \"why-shout\")": "33662331ca26f725253cfd52a0502b356e0e78bd4c4cff5a4255bb330add01bf",
    "units[0].practice[0].options[1] (question \"why-shout\")": "59dedb997b69a2613bda9246fba2ffe1032f7c71daf24fa93d7a17ecf6d4d127",
    "units[0].practice[0].options[2] (question \"why-shout\")": "513725adb4bddcf11d9c452ac380e956f486c36ef974b58be0c5679a7688140a",
    "units[0].practice[1].options[0] (question \"no-repeats\")": "ced9b91e4300cc4bab680a5554449902b8c38083ed1916f2a3b6b9d25fce444c",
    "units[0].practice[1].options[1] (question \"no-repeats\")": "f75633bcaa77734d9a30540359ec31d8690bc288256dd43dc1afa336dfac8b84",
    "units[0].practice[1].options[2] (question \"no-repeats\")": "cf52f50420c35a14ecd5fb1c0949009fe63ffc6da391360aebfbde2e9ce5b7a0",
    "units[0].practice[2].options[0] (question \"when-renew\")": "61cc7b1782897b367635dcd7febc3b1347afd7153aba9bbaa30c081c0a76b21f",
    "units[0].practice[2].options[1] (question \"when-renew\")": "f0d054b94aa23dea0558d6ee2825067dacf26f2ec6d411a84432800f373473bd",
    "units[0].practice[2].options[2] (question \"when-renew\")": "6f4830362202a99559f31d8b5ce05f1988cf6f1ddd36be43a43f05105fd80d8a",
    "units[0].practice[0].prompt (question \"why-shout\")": "d2e91b8918da94ebb5efde1e0a44b1bd0110230afb07e5cdb130689647185748",
    "units[0].practice[1].prompt (question \"no-repeats\")": "9491e589a4fd64f9d87c3d1ee07710570626269c3dca68a5d1caf58c130dc4ff",
    "units[0].practice[2].prompt (question \"when-renew\")": "9171a2b079d29dce3d05a6479513a334c6c599101c4ee840e04a11ccf7fce88f"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: dhcp

Full check of every item on the claim sheet, against the sources as fetched on 2026-11-12. Every RFC was read from the RFC Editor's plain-text form, and its status was read from its RFC Editor info page. Every web page was read from the publisher's own site.

## Claims

### units[0].osi — ✅

- Note: the badge says DHCP spans layers, and it cites nothing. I looked for a single-layer placement in every source fetched for this check. None of them places DHCP at one OSI layer. RFC 1122 §1.1.3 lists BOOTP, DHCP's predecessor, among the support protocols of the Internet model's application layer. That is a different protocol and a different layer model, not an OSI placement of DHCP. Cisco's page mentions Layer 3 only to describe a broadcast domain. The lesson itself shows DHCP using link-layer broadcast, IP addresses and UDP ports, so a beginner is not misled by "spans".

### units[0].steps[0].deep[0] (step "discover", Go deeper) — ✅

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67)
- `rfc-2131` §4.1
  > DHCP messages broadcast by a client prior to that client obtaining
  > its IP address must have the source address field in the IP header
  > set to 0.
- `rfc-2131` §4.4.1
  > The client then broadcasts the DHCPDISCOVER on the local hardware
  > broadcast address to the 0xffffffff IP broadcast address and 'DHCP
  > server' UDP port.
- `rfc-1122` §3.2.1.3
  > This host on this network.  MUST NOT be sent, except as
  > a source address as part of an initialization procedure
  > by which the host learns its own IP address.
- Note: RFC 2131 is the defining standard for DHCP's message exchange, its ports and its addressing. It gives the broadcast address in hex (all ones, which is 255.255.255.255) and the source as zero (0.0.0.0). RFC 1122's all-zero address for this host is the same 0.0.0.0, which the lesson glosses in plain words as having no address yet.
- Note: RFC 2131 (Draft Standard) is not obsoleted. RFC 3396, 4361, 5494 and 6842 update it, and none of them changes the ports or the broadcast addressing. RFC 1122 (STD 3) is not obsoleted, and none of its updates touches the special addresses.

### units[0].steps[1].deep[0] (step "offer", Go deeper) — ✅

- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field (and other
  > configuration parameters in DHCP options).
- `rfc-2132` §3.3
  > The subnet mask option specifies the client's subnet mask as per RFC
  > 950 [5].
- `rfc-2132` §3.5
  > The router option specifies a list of IP addresses for routers on the
  > client's subnet.
- `rfc-2132` §3.8
  > The domain name server option specifies a list of Domain Name System
  > (STD 13, RFC 1035 [8]) name servers available to the client.
- `cisco-dhcp-troubleshoot` §DHCPOFFER
  > The subnet mask and default gateway are specified in the options field, subnet mask and router options, respectively. Other common options in the DHCPOFFER message include IP Address lease time, renewal time, domain name server, and NetBIOS name server (WINS).
- `rfc-2131` §2
  > chaddr       16  Client hardware address.
- `rfc-2131` §4.4.1
  > The
  > client MUST include its hardware address in the 'chaddr' field, if
  > necessary for delivery of DHCP reply messages.
- `cisco-dhcp-troubleshoot` §DHCPOFFER
  > The DHCP server sends the DHCPOFFER to the broadcast address but includes the client hardware address in the chaddr field of the offer, so the client knows that it is the intended destination.
- `microsoft-dhcp-basics` §DHCPOFFER
  > Note the CHADDR field still contains the physical address of the requesting client.
- Note: RFC 2131 defines the Offer and its chaddr field. RFC 2132 defines the subnet mask, router (default gateway) and DNS server options.
- Note: Cisco states the purpose from the laptop's side (the hardware address shows it that the Offer is meant for it). The lesson states the same fact from the phone's side. The DNS server is a common option, not a required one, and that is the ordinary home case.
- Note: RFC 2132 (Draft Standard) is not obsoleted. Its updates (RFC 3442, 3942, 4361, 4833, 5494) add or reclassify options and leave these three unchanged. The Cisco page is live and was recertified in September 2023.

### units[0].steps[2].deep[0] (step "request", Go deeper) — ✅

- `rfc-2131` §4.1
  > DHCP messages broadcast by a client prior to that client obtaining
  > its IP address must have the source address field in the IP header
  > set to 0.
- `rfc-2131` §3.1
  > The client broadcasts a DHCPREQUEST message
  > that MUST include the 'server identifier' option to indicate which
  > server it has selected
- `rfc-2131` §3.1
  > Those servers not selected by the DHCPREQUEST message use the
  > message as notification that the client has declined that server's
  > offer.
- `rfc-2132` §9.7
  > DHCP clients also
  > indicate which of several lease offers is being accepted by including
  > this option in a DHCPREQUEST message.
- `microsoft-dhcp-basics` §DHCPREQUEST
  > The client retains 0.0.0.0 because the client hasn't received verification from the server that it's okay to start using the address offered.
- `microsoft-dhcp-basics` §DHCPREQUEST
  > This lets those other DHCP servers know they can release their offered addresses and return them to their available pools.
- Note: RFC 2131 defines the Request and its source address. RFC 2132 §9.7 defines the server identifier option. Microsoft's page states both the reason for 0.0.0.0 and that the other servers free their offers. The lesson calls the server identifier a field, which is an everyday word for what the RFC calls an option.
- Note: Microsoft's page is an old knowledge-base article whose product list is legacy Windows. Its packet-level account of the exchange still describes how DHCP works today.

### units[0].steps[3].deep[0] (step "acknowledge", Go deeper) — ✅

- `rfc-2131` §3.1
  > DHCPACK      -  Server to client with configuration parameters,
  > including committed network address.
- Note: RFC 2131 defines the DHCP message types, this one among them. It names the message DHCPACK, and the lesson shortens that to ACK.

### units[0].steps[4].deep[0] (step "renew", Go deeper) — ✅

- `rfc-2131` §4.4.5
  > At time T1 the client moves to RENEWING state and sends (via unicast)
  > a DHCPREQUEST message to the server to extend its lease.
- `rfc-2131` §4.4.5
  > Times T1 and T2 are configurable by the server through options.  T1
  > defaults to (0.5 * duration_of_lease).  T2 defaults to (0.875 *
  > duration_of_lease).
- `rfc-2131` §4.4.5
  > If the lease expires before the client receives a DHCPACK, the client
  > moves to INIT state, MUST immediately stop any other network
  > processing and requests network initialization parameters as if the
  > client were uninitialized.
- `rfc-2131` §4.4.1
  > The client begins in INIT state and forms a DHCPDISCOVER message.
- `cisco-dhcp-troubleshoot` §Renew the Lease
  > When one half of the lease time has expired (T1=0.5 x LT), the client tries to renew the lease.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent after 87.5 percent of the IP address lease duration because this indicates that the directed unicast request didn’t work.
- `cisco-dhcp-troubleshoot` §Renew the Lease
  > If the client is unable to reach the server when it holds the lease for some reason, it attempts to renew the address from any DHCP server after the original DHCP server has not responded to the renewal requests within a time T2.
- `microsoft-ipconfig` §Parameters
  > Renews DHCP configuration for all adapters (if an adapter is not specified) or for a specific adapter if the adapter parameter is included.
- `cisco-dhcp-troubleshoot` §C. Verify Issue as a Startup Problem
  > Issue the command ipconfig/renew in the command prompt window.
- Note: RFC 2131 defines the client's lease timers and states. Half and 87.5% are the defaults, which a server may change; the lesson gives the default, the ordinary case. 43,200 seconds is half of the example's 86,400-second lease.
- Note: the ipconfig page is live and applies to Windows 10, Windows 11 and current Windows Server.

### units[0].learn.lead[0] ("lead-1") — ✅

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- `rfc-2131` §3.1
  > The server selected in the DHCPREQUEST message commits the
  > binding for the client to persistent storage and responds with a
  > DHCPACK message containing the configuration parameters for the
  > requesting client.
- `rfc-2131` §2.2
  > In this document, the period over which a network address
  > is allocated to a client is referred to as a "lease" [11].
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the four-message exchange (Discover, Offer, Request, ACK) and the lease. The two vendors' pages show the home router doing the job. The 24 hours is the lesson's example lease. "Borrowed" is the everyday word for a lease.

### units[0].learn.terms[0] ("term-broadcast") — ✅

- `rfc-1122` §3.2.1.3
  > Limited broadcast.  It MUST NOT be used as a source
  > address.
- `rfc-1122` §3.2.1.3
  > A datagram with this destination address will be
  > received by every host on the connected physical
  > network but will not be forwarded outside that network.
- `rfc-2131` §4.4.4
  > The DHCP client broadcasts DHCPDISCOVER, DHCPREQUEST and DHCPINFORM
  > messages, unless the client knows the address of a DHCP server.
- Note: RFC 1122 defines the limited broadcast address and who receives it. RFC 2131 defines when a DHCP client broadcasts.
- Note: the reason the lesson gives (not knowing whom to ask) is the Discover's. The Request is broadcast for another reason, and the lesson teaches that reason in its own terms and step. The definition does not say this is the only reason to broadcast.

### units[0].learn.terms[1] ("term-discover") — ✅

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCP message types. The lesson puts the Discover's purpose in a beginner's words: ask whoever hands out addresses to answer.

### units[0].learn.terms[2] ("term-offer") — ✅

- `rfc-2131` §3.1
  > DHCPOFFER    -  Server to client in response to DHCPDISCOVER with
  > offer of configuration parameters.
- `rfc-2132` §9.2
  > In a
  > server reply (DHCPOFFER), a DHCP server uses this option to specify
  > the lease time it is willing to offer.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the Offer, and RFC 2132 §9.2 defines its lease-time option. "The router" stands in for the DHCP server, which is the router in a home, as the two vendor pages show.

### units[0].learn.terms[3] ("term-request") — ✅

- `rfc-2131` §3.1
  > DHCPREQUEST  -  Client message to servers either (a) requesting
  > offered parameters from one server and implicitly
  > declining offers from all others
- `rfc-2132` §9.7
  > DHCP clients also
  > indicate which of several lease offers is being accepted by including
  > this option in a DHCPREQUEST message.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the Request, and RFC 2132 §9.7 defines the server identifier that says which offer was accepted. "Every router" stands in for every DHCP server that heard the Discover, and in a home that is the router. The definition gives the Request's first-time use. The lesson teaches its renewal use, sent directly to the server, in the renew step and Go deeper.

### units[0].learn.terms[4] ("term-ack") — ✅

- `rfc-2131` §3.1
  > DHCPACK      -  Server to client with configuration parameters,
  > including committed network address.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the DHCPACK message, which confirms the address. "Acknowledge" is the spelled-out name used in the DORA mnemonic.

### units[0].learn.terms[5] ("term-lease-table") — ✅

- `rfc-2131` §1.5
  > A binding is a collection of configuration parameters, including
  > at least an IP address, associated with or "bound to" a DHCP
  > client.  Bindings are managed by DHCP servers.
- `rfc-2131` §3.1
  > The server selected in the DHCPREQUEST message commits the
  > binding for the client to persistent storage
- `cisco-dhcp-troubleshoot` §DHCPACK
  > Meanwhile, the DHCP server stores the lease in its database and uniquely identifies it with the client identifier or chaddr, and the associated IP address.
- `microsoft-dhcp-server` §Why use DHCP?
  > The DHCP server stores the configuration information in a database that includes:
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the server's bindings and their storage. The sources call it the server's database or persistent storage. "Lease table" is a plain descriptive name for that record, not the standard's term, and it leaves no false belief.

### units[0].learn.terms[6] ("term-lease") — ✅

- `rfc-2131` §2.2
  > The basic mechanism for
  > the dynamic allocation of network addresses is simple: a client
  > requests the use of an address for some period of time.
- `rfc-2131` §2.2
  > In this document, the period over which a network address
  > is allocated to a client is referred to as a "lease" [11].
- Note: RFC 2131 defines the lease. The RFC's term names the period itself, and the lesson describes the borrowing, which is a looser wording of the same idea. Infinite leases are a rarer case the lesson leaves out.

### units[0].learn.terms[7] ("term-renew") — ✅

- `rfc-2131` §4.4.5
  > At time T1 the client moves to RENEWING state and sends (via unicast)
  > a DHCPREQUEST message to the server to extend its lease.
- `rfc-2131` §4.4.5
  > Times T1 and T2 are configurable by the server through options.  T1
  > defaults to (0.5 * duration_of_lease).
- `rfc-2131` §2.2
  > The
  > client may extend its lease with subsequent requests.
- Note: RFC 2131 defines renewal and the T1 timer. Halfway is the default, the ordinary case.

### units[0].learn.terms[8] ("term-ip") — ✅

- `rfc-791` §2.3
  > The datagrams are routed from one
  > internet module to another through individual networks based on the
  > interpretation of an internet address.
- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- `rfc-2131` §1.5
  > A DHCP client is an Internet host using DHCP to obtain
  > configuration parameters such as a network address.
- Note: RFC 791 defines the IPv4 address. "Number" is an everyday word for the 32-bit address, and "so messages can find it" restates that datagrams are delivered by address.
- Note: RFC 791 (STD 5) is not obsoleted. RFC 1349, 2474 and 6864 update it, and none of them changes what an address is.

### units[0].learn.pattern ("pattern") — ✅

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- `microsoft-dhcp-troubleshoot` §More information
  > Broadcast-based DORA (Discover, Offer, Request, Acknowledgement).
- `canonical-dhcp-concepts` §The network version of DORA
  > The DHCP negotiation process is known as DORA: Discover, Offer, Request, Acknowledge.
- Note: RFC 2131 defines the four messages and their order (its timeline in §3.1). Microsoft and Canonical, two independent publishers, each use the DORA name for that order.

### units[0].learn.why[0] ("why-1") — ✅

- `rfc-2131` §1.6
  > Clients should require no manual configuration.
- `rfc-2131` §1.6
  > Guarantee that any specific network address will not be in
  > use by more than one DHCP client at a time
- `microsoft-dhcp-server` §Why use DHCP?
  > Without DHCP, IP addresses for new computers or computers that are moved from one subnet to another must be configured manually; IP addresses for computers that are removed from the network must be manually reclaimed.
- `rfc-5227` §1
  > Historically, accidentally configuring two Internet hosts with the
  > same IP address has often been an annoying and hard-to-diagnose
  > problem.
- Note: RFC 2131 states DHCP's design goals, and RFC 5227 defines IPv4 address conflict detection and describes the duplicate-address problem. The claim leaves out other ways a device can configure itself, such as the 169.254 link-local fallback (which the lesson teaches as reaching neighbours only), and IPv6 autoconfiguration.
- Note: RFC 5227 (Proposed Standard) is not obsoleted.

### units[0].learn.why[1] ("why-2") — ✅

- `rfc-2131` §1.6
  > Guarantee that any specific network address will not be in
  > use by more than one DHCP client at a time
- `rfc-2131` §2.2
  > The
  > allocation mechanism (the collection of DHCP servers) guarantees not
  > to reallocate that address within the requested time
- `cisco-dhcp-troubleshoot` §DHCPACK
  > Meanwhile, the DHCP server stores the lease in its database and uniquely identifies it with the client identifier or chaddr, and the associated IP address.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 states the guarantee itself. "Never" holds among devices that get their address from DHCP, the ordinary case. It leaves out a clash with a device whose address was typed in by hand, which DHCP's own address checks exist to catch.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.
- Note: RFC 2131 defines DHCP's transport.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

- `rfc-2131` §4.1
  > DHCP messages broadcast by a client prior to that client obtaining
  > its IP address must have the source address field in the IP header
  > set to 0.
- `rfc-2131` §4.4.1
  > The client then broadcasts the DHCPDISCOVER on the local hardware
  > broadcast address to the 0xffffffff IP broadcast address and 'DHCP
  > server' UDP port.
- `rfc-1122` §3.2.1.3
  > A datagram with this destination address will be
  > received by every host on the connected physical
  > network but will not be forwarded outside that network.
- Note: RFC 2131 defines the client's source and destination addresses before it has one (0 and all ones, which are 0.0.0.0 and 255.255.255.255). RFC 1122 says who receives the limited broadcast. The claim leaves out the rarer case of a client that already knows its server's address and may send to it directly.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

- `rfc-2131` §4.4.5
  > At time T1 the client moves to RENEWING state and sends (via unicast)
  > a DHCPREQUEST message to the server to extend its lease.
- `rfc-2131` §4.4.5
  > When the client receives a DHCPACK from the server, the client
  > computes the lease expiration time as the sum of the time at which
  > the client sent the DHCPREQUEST message and the duration of the lease
  > in the DHCPACK message.
- `microsoft-dhcp-training` §DHCP lease renewal
  > To attempt to renew the IP address lease, the client sends a unicast DHCPREQUEST message.
- `microsoft-dhcp-training` §DHCP lease renewal
  > If renewal is successful, the lease period resets.
- `cisco-dhcp-troubleshoot` §Renew the Lease
  > When one half of the lease time has expired (T1=0.5 x LT), the client tries to renew the lease.
- Note: RFC 2131 defines T1, the unicast renewal Request and how the ACK restarts the lease. Half is T1's default.
- Note: the Microsoft Learn training module is live and describes current Windows Server DHCP.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

- `rfc-2131` §4.4.5
  > T2 is the time at which the client enters the
  > REBINDING state and attempts to contact any server.
- `rfc-2131` §4.4.5
  > T2 defaults to (0.875 *
  > duration_of_lease).
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent after 87.5 percent of the IP address lease duration because this indicates that the directed unicast request didn’t work.
- `cisco-dhcp-troubleshoot` §Renew the Lease
  > it attempts to renew the address from any DHCP server after the original DHCP server has not responded to the renewal requests within a time T2.
- Note: RFC 2131 defines T2 and its default. 87.5% is the default, the ordinary case.

### units[0].learn.facts[0] ("fact-ports") — ✅

- `rfc-2131` §4.1
  > DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67), and DHCP
  > messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- `microsoft-dhcp-troubleshoot` §More information
  > All communication is done on UDP ports 67 and 68.
- Note: RFC 2131 defines the two ports.

### units[0].learn.facts[1] ("fact-first") — ✅

- `rfc-2131` §4.1
  > DHCP messages broadcast by a client prior to that client obtaining
  > its IP address must have the source address field in the IP header
  > set to 0.
- `rfc-2131` §4.4.1
  > The client then broadcasts the DHCPDISCOVER on the local hardware
  > broadcast address to the 0xffffffff IP broadcast address
- `rfc-1122` §3.2.1.3
  > and the notation "-1" for a field that contains all 1 bits.
- `rfc-1122` §3.2.1.3
  > This host on this network.  MUST NOT be sent, except as
  > a source address as part of an initialization procedure
  > by which the host learns its own IP address.
- Note: RFC 2131 defines the first messages' addresses. In RFC 1122's notation the all-ones address is the limited broadcast 255.255.255.255, and the all-zeros address is 0.0.0.0.

### units[0].learn.facts[2] ("fact-t1") — ✅

- `rfc-2131` §4.4.5
  > Times T1 and T2 are configurable by the server through options.  T1
  > defaults to (0.5 * duration_of_lease).
- `rfc-2132` §9.11
  > This option specifies the time interval from address assignment until
  > the client transitions to the RENEWING state.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent directly to the DHCP server from the DHCP client to renew the IP address assignment after 50 percent of the IP address lease time.
- Note: RFC 2131 defines T1 and its default, and RFC 2132 §9.11 defines the option a server can use to set it otherwise. 50% is the default, the ordinary case.

### units[0].learn.facts[3] ("fact-t2") — ✅

- `rfc-2131` §4.4.5
  > T2 defaults to (0.875 *
  > duration_of_lease).
- `rfc-2132` §9.12
  > This option specifies the time interval from address assignment until
  > the client transitions to the REBINDING state.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent after 87.5 percent of the IP address lease duration
- Note: RFC 2131 defines T2 and its default, and RFC 2132 §9.12 defines its option. 87.5% is the default.

### units[0].learn.facts[4] ("fact-no-server") — ✅

- `rfc-3927` §Abstract
  > This document describes how a host may
  > automatically configure an interface with an IPv4 address within the
  > 169.254/16 prefix that is valid for communication with other devices
  > connected to the same physical (or logical) link.
- `rfc-3927` §1
  > Link-Local communication using IPv4 Link-Local addresses is only
  > suitable for communication with other devices connected to the same
  > physical (or logical) link.
- Note: RFC 3927 defines IPv4 link-local addresses. "Neighbours" is a beginner's word for devices on the same link, and "may" keeps it optional, as it is.
- Note: RFC 3927 (Proposed Standard) is not obsoleted.

### units[0].learn.facts[5] ("fact-defined") — ✅

- `rfc-2131` §1
  > The Dynamic Host Configuration Protocol (DHCP) provides configuration
  > parameters to Internet hosts.
- `rfc-2132` §1
  > This document specifies options for use with both the Dynamic Host
  > Configuration Protocol and the Bootstrap Protocol.
- Note: RFC 2131 defines the DHCP protocol and RFC 2132 defines its options. Both are current, not obsoleted, and updated only by later RFCs that leave them the base documents.

### units[0].learn.facts[6] ("fact-home") — ✅

- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: these are two independent vendors (Microsoft and Google). One says the home router sets a device's addresses automatically, and the other shows a home router's DHCP address pool. That is the ordinary home setup. Some homes use another device as the DHCP server, a case the lesson leaves out.

### units[0].learn.facts[7] ("fact-settings") — ✅

- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field (and other
  > configuration parameters in DHCP options).
- `rfc-2132` §3.3
  > The subnet mask option specifies the client's subnet mask as per RFC
  > 950 [5].
- `rfc-2132` §3.5
  > The router option specifies a list of IP addresses for routers on the
  > client's subnet.
- `rfc-2132` §3.8
  > The domain name server option specifies a list of Domain Name System
  > (STD 13, RFC 1035 [8]) name servers available to the client.
- `rfc-2132` §9.2
  > In a
  > server reply (DHCPOFFER), a DHCP server uses this option to specify
  > the lease time it is willing to offer.
- `cisco-dhcp-troubleshoot` §DHCPOFFER
  > The subnet mask and default gateway are specified in the options field, subnet mask and router options, respectively.
- Note: RFC 2131 defines the address field, and RFC 2132 defines the subnet mask, router, DNS server and lease time options. The list gives the common set, and a server may send more or fewer.

### units[0].learn.facts[8] ("fact-mac") — ✅

- `rfc-2131` §4.4.1
  > The
  > client MUST include its hardware address in the 'chaddr' field, if
  > necessary for delivery of DHCP reply messages.
- `rfc-2131` §2
  > 'chaddr' is used both as a hardware address for transmission of BOOTP
  > reply messages and as a client identifier.
- `rfc-2131` §3.1
  > The combination of 'client identifier' or
  > 'chaddr' and assigned network address constitute a unique
  > identifier for the client's lease
- `microsoft-dhcp-basics` §DHCPDISCOVER
  > The DHCP section identifies the packet as a Discover packet and identifies the client in two places using the physical address of the network card.
- `cisco-dhcp-troubleshoot` §DHCPOFFER
  > includes the client hardware address in the chaddr field of the offer, so the client knows that it is the intended destination.
- Note: RFC 2131 defines the chaddr field, which holds the client's hardware address, and its use in telling clients apart. A separate client identifier option can also identify a client, a detail the lesson leaves out.

### units[0].learn.facts[9] ("fact-replies") — ✅

- `rfc-2131` §4.1
  > messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- `rfc-2131` §4.1
  > If the broadcast bit is not set and 'giaddr' is zero and
  > 'ciaddr' is zero, then the server unicasts DHCPOFFER and DHCPACK
  > messages to the client's hardware address and 'yiaddr' address.
- `rfc-2131` §4.1
  > If 'giaddr' is zero and 'ciaddr' is zero, and the broadcast bit is
  > set, then the server broadcasts DHCPOFFER and DHCPACK messages to
  > 0xffffffff.
- `microsoft-dhcp-troubleshoot` §More information
  > All communication is done on UDP ports 67 and 68.
- Note: RFC 2131 defines how a server addresses its replies. The claim leaves out replies through a relay agent, which is not the home case.

### units[0].learn.facts[10] ("fact-request") — ✅

- `rfc-2131` §3.1
  > The client broadcasts a DHCPREQUEST message
  > that MUST include the 'server identifier' option to indicate which
  > server it has selected
- `rfc-2131` §3.1
  > The 'requested IP
  > address' option MUST be set to the value of 'yiaddr' in the
  > DHCPOFFER message from the server.
- `rfc-2131` §4.1
  > DHCP messages broadcast by a client prior to that client obtaining
  > its IP address must have the source address field in the IP header
  > set to 0.
- `rfc-2132` §9.7
  > The code for this option is 54, and its length is 4.
- `rfc-2132` §9.1
  > 9.1. Requested IP Address
- `rfc-2132` §9.1
  > The code for this option is 50, and its length is 4.
- `rfc-2131` §3.1
  > Those servers not selected by the DHCPREQUEST message use the
  > message as notification that the client has declined that server's
  > offer.
- `microsoft-dhcp-basics` §DHCPREQUEST
  > This lets those other DHCP servers know they can release their offered addresses and return them to their available pools.
- Note: RFC 2131 defines the Request's contents and source address, and RFC 2132 defines options 54 (server identifier) and 50 (requested IP address).

### units[0].learn.facts[11] ("fact-ack") — ✅

- `rfc-2131` §3.1
  > The client receives the DHCPACK message with configuration
  > parameters.
- `rfc-2131` §3.1
  > At this
  > …
  > point, the client is configured.
- `microsoft-dhcp-basics` §DHCPREQUEST
  > The client retains 0.0.0.0 because the client hasn't received verification from the server that it's okay to start using the address offered.
- Note: RFC 2131 defines when the client is configured. It leaves out the client's optional final check that the address is free (an ARP probe), done just after the ACK.

### units[0].learn.facts[12] ("fact-ignore") — ✅

- `rfc-2131` §1
  > A host should not act as a DHCP server unless explicitly configured
  > to do so by a system administrator.
- `canonical-dhcp-concepts` §The network version of DORA
  > Every machine on the network will see the packet, but they will ignore it when they look at the payload.
- `rfc-1122` §3.2.1.3
  > A datagram with this destination address will be
  > received by every host on the connected physical
  > network but will not be forwarded outside that network.
- Note: RFC 2131 defines which hosts act as DHCP servers, and RFC 1122 says every host on the link receives a limited broadcast. The claim leaves out relay agents, which pass DHCP messages on in larger networks rather than answering in a home.

### units[0].learn.facts[13] ("fact-link") — ✅

- `rfc-2131` §4.4.1
  > The client then broadcasts the DHCPDISCOVER on the local hardware
  > broadcast address
- `rfc-894` §Address Mappings
  > The broadcast Internet address (the address on that network with a
  > host part of all binary ones) should be mapped to the broadcast
  > Ethernet address (of all binary ones, FF-FF-FF-FF-FF-FF hex).
- Note: RFC 2131 defines that the Discover goes to the link's hardware broadcast address. RFC 894 (STD 41, Internet Standard, not obsoleted) defines how the IP broadcast maps to the all-ones Ethernet address. The claim does not name a link type. Wi-Fi uses the same all-ones broadcast hardware address, so the claim is true for the lesson's Wi-Fi scene too.

### units[0].learn.facts[14] ("fact-name") — ✅

- `rfc-2131` §Abstract
  > The Dynamic Host Configuration Protocol (DHCP) provides a framework
  > for passing configuration information to hosts on a TCPIP network.
- `rfc-2131` §1
  > DHCP consists of two components: a
  > protocol for delivering host-specific configuration parameters from a
  > DHCP server to a host and a mechanism for allocation of network
  > addresses to hosts.
- `rfc-2131` §1.5
  > A DHCP client is an Internet host using DHCP to obtain
  > configuration parameters such as a network address.
- Note: RFC 2131 defines DHCP, its name and its purpose.

### units[0].practice[0].options[0] (question "why-shout") — ✅

- `rfc-2131` §4.4.4
  > The DHCP client broadcasts DHCPDISCOVER, DHCPREQUEST and DHCPINFORM
  > messages, unless the client knows the address of a DHCP server.
- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- `rfc-1122` §3.2.1.3
  > A datagram with this destination address will be
  > received by every host on the connected physical
  > network but will not be forwarded outside that network.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines why and when the client broadcasts. The option is the right answer and its feedback says so. "The only way" holds for a client that does not know its server's address, which is the case the question sets up.

### units[0].practice[0].options[1] (question "why-shout") — ✅

- `rfc-2131` §4.4.4
  > The DHCP client broadcasts DHCPDISCOVER, DHCPREQUEST and DHCPINFORM
  > messages, unless the client knows the address of a DHCP server.
- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the broadcast's purpose, which is to find a server, not speed. The option is wrong and its feedback correctly says so.

### units[0].practice[0].options[2] (question "why-shout") — ✅

- `rfc-2131` §1
  > A host should not act as a DHCP server unless explicitly configured
  > to do so by a system administrator.
- `canonical-dhcp-concepts` §The network version of DORA
  > Every machine on the network will see the packet, but they will ignore it when they look at the payload.
- `rfc-2131` §4.4.4
  > The DHCP client broadcasts DHCPDISCOVER, DHCPREQUEST and DHCPINFORM
  > messages, unless the client knows the address of a DHCP server.
- Note: RFC 2131 defines who answers as a DHCP server. The option is wrong and its feedback correctly says so.

### units[0].practice[1].options[0] (question "no-repeats") — ✅

- `rfc-5227` §2.4
  > then this is a conflicting ARP packet,
  > indicating some other host also thinks it is validly using this
  > address.
- `rfc-5227` §2.4
  > To resolve the address conflict, a host MUST respond to a
  > conflicting ARP packet as described in either (a), (b), or (c) below:
- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field
- `rfc-2131` §1.5
  > Bindings are managed by DHCP servers.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 5227 defines how a shared address is detected as a conflict that hosts must resolve, which is why two devices could not both work properly. RFC 2131 defines that a server offers an available address from the bindings it manages. The option is wrong and its feedback correctly says so.

### units[0].practice[1].options[1] (question "no-repeats") — ✅

- `rfc-2131` §3.1
  > The server selected in the DHCPREQUEST message commits the
  > binding for the client to persistent storage
- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field
- `rfc-2131` §1.5
  > Bindings are managed by DHCP servers.
- `cisco-dhcp-troubleshoot` §DHCPACK
  > Meanwhile, the DHCP server stores the lease in its database and uniquely identifies it with the client identifier or chaddr, and the associated IP address.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the server's record of bindings and its offer of an available address. "Loan" and "lease table" are everyday words for the lease and that record. The option is the right answer and its feedback says so.

### units[0].practice[1].options[2] (question "no-repeats") — ✅

- `rfc-2131` §1.5
  > Bindings are managed by DHCP servers.
- `rfc-2131` §1
  > A host should not act as a DHCP server unless explicitly configured
  > to do so by a system administrator.
- `cisco-dhcp-troubleshoot` §DHCPACK
  > Meanwhile, the DHCP server stores the lease in its database
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines the server as the one that manages the bindings. The option is wrong and its feedback correctly says so. The server may test an address before offering it (RFC 2131 §3.1), but that is not asking a device for a list of taken addresses, so the feedback still holds.

### units[0].practice[2].options[0] (question "when-renew") — ✅

- `rfc-2131` §4.4.5
  > Times T1 and T2 are configurable by the server through options.  T1
  > defaults to (0.5 * duration_of_lease).
- `rfc-2131` §4.4.5
  > T1 MUST be
  > earlier than T2, which, in turn, MUST be earlier than the time at
  > which the client's lease will expire.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent directly to the DHCP server from the DHCP client to renew the IP address assignment after 50 percent of the IP address lease time.
- `microsoft-network-settings` §Change TCP/IP Settings
  > the IP address settings and DNS server address setting are set automatically by your router or other access point (recommended).
- `google-nest-lan-ip` §Set a custom LAN IP
  > Under “DHCP address pool,” customize your starting and ending IP addresses.
- Note: RFC 2131 defines T1, its default and its place before T2 and the lease's end. The feedback's "plenty of time" is a plain reading of that ordering, which leaves room to retry and to rebind before the lease runs out. Twelve hours is half of the question's 24. The option is the right answer and its feedback says so.

### units[0].practice[2].options[1] (question "when-renew") — ✅

- `rfc-2131` §4.4.5
  > If the lease expires before the client receives a DHCPACK, the client
  > moves to INIT state, MUST immediately stop any other network
  > processing
- `rfc-2131` §4.4.5
  > At time T1 the client moves to RENEWING state and sends (via unicast)
  > a DHCPREQUEST message to the server to extend its lease.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent directly to the DHCP server from the DHCP client to renew the IP address assignment after 50 percent of the IP address lease time.
- Note: RFC 2131 defines what happens when a lease runs out, which is the reason the feedback gives. The option is wrong and its feedback correctly says so.

### units[0].practice[2].options[2] (question "when-renew") — ✅

- `rfc-2131` §4.4.5
  > At time T1 the client moves to RENEWING state and sends (via unicast)
  > a DHCPREQUEST message to the server to extend its lease.
- `microsoft-dhcp-troubleshoot` §More information
  > These are sent directly to the DHCP server from the DHCP client to renew the IP address assignment after 50 percent of the IP address lease time.
- Note: RFC 2131 defines when renewal happens. The option is wrong and its feedback correctly says so. A client may also renew early, for example at startup or on a network change, which the feedback's "first asks halfway" leaves out for this scenario.

## Traced, example, analogy and unbacked parts

Each traced part was compared with the Learn parts its Traces line names. The made-up values (MAC addresses 00:00:5E:00:53:10 and :11, which are in the documentation range; 192.168.1.x and 255.255.255.0 on an RFC 1918 network; the 24-hour, 86,400-second lease of the walkthrough; the log times) are the example's data, not claims about how DHCP works.

- `title` — ✅ The lesson's name, DHCP, makes no claim.
- `units[0].name` — ✅ The unit's name, DHCP, makes no claim.
- `backing (the lesson's subtitle and summary)` — ✅ An address and the other settings, from the router, in four messages, after which the device goes online: all of this is in term-ip, fact-settings, fact-home, pattern, fact-ack and why-1.
- `units[0].backing (the unit's full name and purpose)` — ✅ The full name and purpose match fact-name.
- `units[0].scene.backing (the scene)` — ✅ The router keeps a lease table of address, MAC, device and expiry (term-lease-table, fact-mac, term-lease). Its legend's broadcast, server reply and direct request match term-broadcast, fact-replies and deep-3. All addresses are example data.
- `units[0].overview.hookBacking (the Overview hook)` — ✅ It is traced to term-ip, fact-home, term-offer and why-1. The hotel front-desk analogy does not mislead: a free address is handed out by the one service that keeps track, just as the lesson teaches.
- `units[0].overview.backing (the Overview description)` — ✅ It is traced to fact-settings, fact-home, term-lease and term-lease-table.
- `units[0].overview.facts[0] (Overview fact "Ports")` — ✅ Same as fact-ports.
- `units[0].overview.facts[1] (Overview fact "Hands out")` — ✅ A subset of fact-settings.
- `units[0].overview.facts[2] (Overview fact "Exchange")` — ✅ Same as pattern.
- `units[0].overview.facts[3] (Overview fact "Lease")` — ✅ Renewal at half the lease matches fact-t1.
- `units[0].overview.facts[4] (Overview fact "Defined in")` — ✅ Same as fact-defined.
- `units[0].steps[0] (step "discover")` — ✅ A broadcast because the laptop doesn't know whom to ask, which every device hears and the phone ignores: term-discover, term-broadcast, fact-first, fact-ignore and deep-2.
- `units[0].steps[0].facts[0] (step "discover", fact "From")` — ✅ 0.0.0.0 (fact-first) and the client port 68 (fact-ports).
- `units[0].steps[0].facts[1] (step "discover", fact "To")` — ✅ 255.255.255.255 (fact-first) and the server port 67 (fact-ports).
- `units[0].steps[0].facts[2] (step "discover", fact "MAC destination")` — ✅ Matches fact-link.
- `units[0].steps[0].facts[3] (step "discover", fact "Laptop MAC")` — ✅ Example data. The laptop's hardware address is named in its messages (fact-mac).
- `units[0].steps[0].events[0] (event "msg-discover")` — ✅ The source, destination and ports match fact-first and fact-ports. The time is example data.
- `units[0].steps[1] (step "offer")` — ✅ The router offers a free address, other settings and a time limit: term-offer, fact-home, fact-settings and term-lease. The address and the 24 hours are example data.
- `units[0].steps[1].facts[0] (step "offer", fact "Address offered")` — ✅ Example data.
- `units[0].steps[1].facts[1] (step "offer", fact "Subnet mask")` — ✅ Example data for a setting in fact-settings.
- `units[0].steps[1].facts[2] (step "offer", fact "Gateway")` — ✅ The default gateway is the router (fact-settings). The address is example data.
- `units[0].steps[1].facts[3] (step "offer", fact "Lease")` — ✅ Example data for the lease (term-lease).
- `units[0].steps[1].events[0] (event "msg-offer")` — ✅ From port 67 to port 68, broadcast, which is one of the two ways fact-replies gives.
- `units[0].steps[2] (step "request")` — ✅ It is still a broadcast, so a second server learns it wasn't picked: fact-request and term-request.
- `units[0].steps[2].facts[0] (step "request", fact "Address requested")` — ✅ Matches fact-request.
- `units[0].steps[2].facts[1] (step "request", fact "Server chosen")` — ✅ Matches fact-request (server identifier).
- `units[0].steps[2].facts[2] (step "request", fact "Sent from")` — ✅ Matches fact-request and fact-first.
- `units[0].steps[2].events[0] (event "msg-request")` — ✅ Its addresses and ports match fact-request, fact-first and fact-ports.
- `units[0].steps[3] (step "acknowledge")` — ✅ The router confirms and records the lease, so there are no duplicates, and then the laptop goes online. DORA is the name for the four messages. All of this is in term-ack, term-lease-table, why-2, fact-ack and pattern.
- `units[0].steps[3].facts[0] (step "acknowledge", fact "Address")` — ✅ Example data.
- `units[0].steps[3].facts[1] (step "acknowledge", fact "Lease")` — ✅ Example data.
- `units[0].steps[3].facts[2] (step "acknowledge", fact "Lease table row")` — ✅ Example data for a row of term-lease-table, keyed by the hardware address (fact-mac).
- `units[0].steps[3].events[0] (event "msg-ack")` — ✅ From port 67 to port 68, broadcast (fact-replies).
- `units[0].steps[3].events[1] (event "lease-add")` — ✅ Matches term-lease-table and term-lease.
- `units[0].steps[4] (step "renew")` — ✅ Halfway through, a Request sent straight to the router, whose yes restarts the clock: term-renew, deep-3 and fact-t1. The hotel-room analogy for a borrowed address does not mislead.
- `units[0].steps[4].facts[0] (step "renew", fact "Renews at")` — ✅ Half of the example lease (fact-t1).
- `units[0].steps[4].facts[1] (step "renew", fact "Sent to")` — ✅ Directly to the server on port 67 (deep-3, fact-ports).
- `units[0].steps[4].facts[2] (step "renew", fact "New expiry")` — ✅ The lease starts again (deep-3).
- `units[0].steps[4].events[0] (event "msg-renew-request")` — ✅ A unicast Request from the laptop's own address to the server (deep-3, fact-ack, fact-ports).
- `units[0].steps[4].events[1] (event "msg-renew-ack")` — ✅ Sent straight to the laptop's address (fact-replies), restarting the lease (deep-3).
- `units[0].steps[4].events[2] (event "lease-renew")` — ✅ The expiry moves forward by a full lease (deep-3).
- `units[0].practice[0].prompt (question "why-shout")` — ✅ It has no false premise. The first message is a broadcast (term-discover, fact-first).
- `units[0].practice[1].prompt (question "no-repeats")` — ✅ Its premise is why-2, which passes as the ordinary case for devices that get their address from DHCP.
- `units[0].practice[2].prompt (question "when-renew")` — ✅ It has no false premise. The 24-hour lease is the lesson's example (lead-1).

## Sources

- `rfc-2131`: current (checked 2026-11-12). The RFC Editor info page lists it as a Draft Standard, not obsoleted, updated by RFC 3396, 4361, 5494 and 6842. None of the updates changes what the lesson cites.
- `rfc-2132`: current (checked 2026-11-12). Draft Standard, not obsoleted, updated by RFC 3442, 3942, 4361, 4833 and 5494. The options the lesson cites are unchanged.
- `rfc-1122`: current (checked 2026-11-12). STD 3, Internet Standard, not obsoleted. Its updates (RFC 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029 and 9293) do not touch the 0.0.0.0 or limited-broadcast rules cited.
- `rfc-791`: current (checked 2026-11-12). STD 5, Internet Standard, not obsoleted, updated by RFC 1349, 2474 and 6864, none of which changes addressing.
- `rfc-894`: current (checked 2026-11-12). STD 41, Internet Standard, not obsoleted.
- `rfc-3927`: current (checked 2026-11-12). Proposed Standard, not obsoleted.
- `rfc-5227`: current (checked 2026-11-12). Proposed Standard, not obsoleted.
- `cisco-dhcp-troubleshoot`: current (checked 2026-11-12). The page is live on cisco.com and was recertified in September 2023 (revision 2.0). It is vendor documentation.
- `microsoft-dhcp-basics`: current (checked 2026-11-12). The page is live on learn.microsoft.com. Its product list is legacy Windows, but the packet exchange it describes is current DHCP practice.
- `microsoft-dhcp-server`: current (checked 2026-11-12). The page is live and applies to Windows Server 2016 to 2025.
- `microsoft-dhcp-training`: current (checked 2026-11-12). The Microsoft Learn training unit is live and describes current Windows DHCP practice.
- `microsoft-dhcp-troubleshoot`: current (checked 2026-11-12). The page is live on learn.microsoft.com.
- `microsoft-ipconfig`: current (checked 2026-11-12). The page is live and applies to Windows 10 and 11 and current Windows Server.
- `microsoft-network-settings`: current (checked 2026-11-12). The support page is live and applies to Windows 10 and 11.
- `google-nest-lan-ip`: current (checked 2026-11-12). The Google Home and Nest Help page is live and describes current Nest Wifi settings.
- `canonical-dhcp-concepts`: current (checked 2026-11-12). This is a community source (Canonical's blog), live and readable without signing in, and it describes the DORA exchange as it still works. Every claim that cites it also rests on RFC 2131.

## Limit overrides

None.
