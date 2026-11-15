```json fact-check
{
  "slug": "packets",
  "hash": "8d857c11ebbeb9f0584f0b83013d9df32a782bcf10a8dcd047ab9c6576170cec",
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
    "units[0].overview.facts[0] (Overview fact \"Each piece\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Each packet carries\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Travels\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Put back in order by\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].steps[0] (step \"segmentation\")": "✅",
    "units[0].steps[0].facts[0] (step \"segmentation\", fact \"File\")": "✅",
    "units[0].steps[0].facts[1] (step \"segmentation\", fact \"Largest packet\")": "✅",
    "units[0].steps[0].facts[2] (step \"segmentation\", fact \"Each piece\")": "✅",
    "units[0].steps[0].facts[3] (step \"segmentation\", fact \"Pieces\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-req\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-cut\")": "✅",
    "units[0].steps[1] (step \"packet-headers\")": "✅",
    "units[0].steps[1].facts[0] (step \"packet-headers\", fact \"From\")": "✅",
    "units[0].steps[1].facts[1] (step \"packet-headers\", fact \"To\")": "✅",
    "units[0].steps[1].facts[2] (step \"packet-headers\", fact \"Piece 1\")": "✅",
    "units[0].steps[1].facts[3] (step \"packet-headers\", fact \"A packet\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-p1\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-t1\")": "✅",
    "units[0].steps[2] (step \"forwarding\")": "✅",
    "units[0].steps[2].facts[0] (step \"forwarding\", fact \"Each packet\")": "✅",
    "units[0].steps[2].facts[1] (step \"forwarding\", fact \"Every router\")": "✅",
    "units[0].steps[2].facts[2] (step \"forwarding\", fact \"One download\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-p2\")": "✅",
    "units[0].steps[3] (step \"route-change\")": "✅",
    "units[0].steps[3].facts[0] (step \"route-change\", fact \"Arrived\")": "✅",
    "units[0].steps[3].facts[1] (step \"route-change\", fact \"Why\")": "✅",
    "units[0].steps[3].facts[2] (step \"route-change\", fact \"Pieces 3 and 4\")": "✅",
    "units[0].steps[3].facts[3] (step \"route-change\", fact \"The new way\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-p3\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-t3\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-p4\")": "✅",
    "units[0].steps[3].events[3] (event \"s4-t4\")": "✅",
    "units[0].steps[3].events[4] (event \"s4-p2\")": "✅",
    "units[0].steps[3].events[5] (event \"s4-t2\")": "✅",
    "units[0].steps[4] (step \"in-order-delivery\")": "✅",
    "units[0].steps[4].facts[0] (step \"in-order-delivery\", fact \"The browser got\")": "✅",
    "units[0].steps[4].facts[1] (step \"in-order-delivery\", fact \"Who put them in order\")": "✅",
    "units[0].steps[4].facts[2] (step \"in-order-delivery\", fact \"IP itself\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-order\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-done\")": "✅",
    "units[0].steps[0].deep[0] (step \"segmentation\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"packet-headers\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"forwarding\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"route-change\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"in-order-delivery\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-packet\")": "✅",
    "units[0].learn.terms[1] (\"term-header\")": "✅",
    "units[0].learn.terms[2] (\"term-segment\")": "✅",
    "units[0].learn.terms[3] (\"term-mtu\")": "✅",
    "units[0].learn.terms[4] (\"term-sequence\")": "✅",
    "units[0].learn.terms[5] (\"term-datagram\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-fragments\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-mtu\")": "✅",
    "units[0].learn.facts[1] (\"fact-piece-size\")": "✅",
    "units[0].learn.facts[2] (\"fact-who-cuts\")": "✅",
    "units[0].learn.facts[3] (\"fact-ip-header\")": "✅",
    "units[0].learn.facts[4] (\"fact-tcp-header\")": "✅",
    "units[0].learn.facts[5] (\"fact-on-its-own\")": "✅",
    "units[0].learn.facts[6] (\"fact-same-way\")": "✅",
    "units[0].learn.facts[7] (\"fact-routes-change\")": "✅",
    "units[0].learn.facts[8] (\"fact-out-of-order\")": "✅",
    "units[0].learn.facts[9] (\"fact-ip-promises\")": "✅",
    "units[0].learn.facts[10] (\"fact-back-in-order\")": "✅",
    "units[0].learn.facts[11] (\"fact-ports\")": "✅",
    "units[0].learn.facts[12] (\"fact-defined\")": "✅",
    "units[0].learn.facts[13] (\"fact-osi\")": "✅",
    "units[0].practice[0].options[0] (question \"who-cuts\")": "✅",
    "units[0].practice[0].options[1] (question \"who-cuts\")": "✅",
    "units[0].practice[0].options[2] (question \"who-cuts\")": "✅",
    "units[0].practice[1].options[0] (question \"early-pieces\")": "✅",
    "units[0].practice[1].options[1] (question \"early-pieces\")": "✅",
    "units[0].practice[1].options[2] (question \"early-pieces\")": "⚠️",
    "units[0].practice[0].prompt (question \"who-cuts\")": "✅",
    "units[0].practice[1].prompt (question \"early-pieces\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-cef-load-balancing",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cisco-what-is-routing",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-tcpip-tuning",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-osi",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "nist-sp800-41r1",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "nist-sp800-77r1",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-1191",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-1812",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-2991",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-6298",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8085",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8200",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8900",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-894",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-15"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-15",
    "count": 154,
    "digest": "193aeb1986940f76ead09b504ea754a0023679760e79d71cc2b9789897d849c9",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-osi": "3cfdc94b154549ac2982eabc80aed877dc89891449572de8c5836be822e956b3",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "microsoft-azure-tcpip-tuning": "90a2d4af4600538d91d342abf5e6a19a6092e2e05e367272746e1e8ae56604fa",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "rfc-8900": "92bb51d4cb7532468b6ae203df0f74d3f1ebb1fa5a416d3963c050c5a0b67856",
      "rfc-2991": "7ed2e5951b4a31294333563c2829d7ba04b2e2d9e56362653bbd9d9311ad1e7f",
      "cisco-cef-load-balancing": "3d6f01f9b029f04506b75d250469c071c05e644a2cc8f3578a8ec3b3a6f3741d",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "cisco-what-is-routing": "1f0ccfc759bba849137fb561c0690b78211becc10430ad84d80b275853e73795",
      "rfc-8085": "9fc8fa172098ef296040c6e3708d56ff5941fdeda3faf4071c58c68059629f3c",
      "rfc-6298": "f3a6d937c0a7653bd431fdbbdcd7920f4e9d9cdb6134fa9db7a74b90d215edf6",
      "rfc-1191": "3de7c2cb99832c6d1929f9f918172865831848f77e8ab585488125581afa6b68",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "nist-sp800-77r1": "2343fd37c8cf23a8bfb594b481a867298f4177adf3146228bd365d2b9affe30e",
      "rfc-8200": "371ae3f133d562db5d6385e6def4ca9914c4f831be228ea7779fd28799c2f490",
      "rfc-894": "be88b9301e53f986aca3a0e55e488d1d79bae3f88fe3f257640397bc089e7035",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a"
    }
  },
  "items": {
    "title": "d98820854a6616f1ea95a19cebfe0a3d1e1b0aca0db0c566ad199bc037dd88eb",
    "units[0].name": "a60455962fc4abf10761364ba5c0e7411337060009da3356619cd301331d8788",
    "units[0].osi": "5092bce2f09673c6676a7aac5d3db123ee15d94a5a9f15ccee7e2ee02a6a68d9",
    "backing (the lesson's subtitle and summary)": "0b7fd4090a2bfbb84f1fd7258be1139b008d2ba2d1389ec6e05b6e47555d6f79",
    "units[0].backing (the unit's full name and purpose)": "afdd6ac2e2281e936d2a8b62837315a267c6b468956cd60dea070225fc6ea655",
    "units[0].scene.backing (the scene)": "bdf068b0c954bc090e16aea2c840ab4176f83adf3e44afa871107fff6d6a8253",
    "units[0].overview.hookBacking (the Overview hook)": "7b868af6013c0b66ed8ce10c1103bfb96ad57598cd88fba015b994ef69c845d2",
    "units[0].overview.backing (the Overview description)": "984150ad63dae20ffcc4343f0a004d0731fd50899a03944e4f527143a437dbbe",
    "units[0].overview.facts[0] (Overview fact \"Each piece\")": "4587b421962e74507f53f604c14f2c76413e761e56d7e544247c9a679726e19b",
    "units[0].overview.facts[1] (Overview fact \"Each packet carries\")": "b9e8f9ca7a1a26d20974d217983a248cc9d7ca72ad91f3c7299f5eb14b763b9c",
    "units[0].overview.facts[2] (Overview fact \"Travels\")": "fecbe6b5d4e8650f2a88ac8e7501874e9fd7a929e607123557a1d8c26fa1adb0",
    "units[0].overview.facts[3] (Overview fact \"Put back in order by\")": "8ee442ff47c21e8847344a05e3d21b2d8878fcd53e433485c2a2de9a223585fe",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "1c8a653b23fac582bf31a0e983668e4dbcfddbe9615bf52e8f38c1effa70ac4c",
    "units[0].steps[0] (step \"segmentation\")": "261a1c91ad246a885ae723d8870da13add9f14d4f08b96f3a7499b8c222a72f3",
    "units[0].steps[0].facts[0] (step \"segmentation\", fact \"File\")": "0bcbbb09d3c9ce667f0341ce6e0768a11f183f62466d52826c6bb8ab1b65b1db",
    "units[0].steps[0].facts[1] (step \"segmentation\", fact \"Largest packet\")": "9eb5c86c63ff0730130804acb0bfdc03868183826aa5db1f2bf5e1fcc63c6bf9",
    "units[0].steps[0].facts[2] (step \"segmentation\", fact \"Each piece\")": "4587b421962e74507f53f604c14f2c76413e761e56d7e544247c9a679726e19b",
    "units[0].steps[0].facts[3] (step \"segmentation\", fact \"Pieces\")": "156b50e9f6dbb2f94f78ac2334d812c1ee2717916bcd4fbdcb520b4db1aca01f",
    "units[0].steps[0].events[0] (event \"s1-req\")": "4354c3ba7dfb73d155eed74d3c2218567c4e77ba0bae2acdd32d01976bc69d82",
    "units[0].steps[0].events[1] (event \"s1-cut\")": "1bd7955841e258bcf5e6553637d8c4b320d483a3bab56e4ce5327d015ea0933d",
    "units[0].steps[1] (step \"packet-headers\")": "7308315e9f89aa409a74a57ed010c0250d1f9155e6615ab11437827ab797f79a",
    "units[0].steps[1].facts[0] (step \"packet-headers\", fact \"From\")": "bbb5245dbdac77cebe5674f387579ab49cbeb8a470a8c226441d97854aade223",
    "units[0].steps[1].facts[1] (step \"packet-headers\", fact \"To\")": "afbd8c098f2831cda3c66a7ce2c6bdaa9bcff9ebec2529a3e9f07205a05b4654",
    "units[0].steps[1].facts[2] (step \"packet-headers\", fact \"Piece 1\")": "b19e2681b4cd7ac1e96d85128a0efe965d64f02b91136c7dd9cd2cb0f2066221",
    "units[0].steps[1].facts[3] (step \"packet-headers\", fact \"A packet\")": "e2799254f1bdd16b27bedc61c67b260573bb7a48b713794ac116d11e024ec02d",
    "units[0].steps[1].events[0] (event \"s2-p1\")": "f87a296b7708165860a438aa07b312777edd502d260daf9c39725f7d3c6558eb",
    "units[0].steps[1].events[1] (event \"s2-t1\")": "6affe82ce1b27e906ff7b6af911435aebc8b5e4f79b1ca90f2825eb8d8bdfdb1",
    "units[0].steps[2] (step \"forwarding\")": "0eeb92c802ac2018a6f4296c8b6b224eec27fc21a1ba6bf976aff074e57a8bfb",
    "units[0].steps[2].facts[0] (step \"forwarding\", fact \"Each packet\")": "3604de5f995eda6ddc832968396f9ac2711f13d2ac88502b6441c930d6cd8bd1",
    "units[0].steps[2].facts[1] (step \"forwarding\", fact \"Every router\")": "e053b7256633cc963428386294231d93a03f690e4a3a3c37532ed8956ded0620",
    "units[0].steps[2].facts[2] (step \"forwarding\", fact \"One download\")": "4b364e11c9ad33b5608aacc58470c00760685abc8b18b8a94d8ae5e22ab3c26f",
    "units[0].steps[2].events[0] (event \"s3-p2\")": "aa3e9202ce3705fe000896eb6c2a89fa1b6cdcaec218aa24a059add395beb755",
    "units[0].steps[3] (step \"route-change\")": "bf0484177b9e90453e2f6df554ef3c7cba27b1bd71a536c677ba350ed15ca181",
    "units[0].steps[3].facts[0] (step \"route-change\", fact \"Arrived\")": "1b90d4ea2c8fc520f506a873a8eca3505867bafa76b8c12bb7e1f07920ee35be",
    "units[0].steps[3].facts[1] (step \"route-change\", fact \"Why\")": "253413f3aa07b06981c16477246322e0c5178cae9189c280aaf224c5f541b8ba",
    "units[0].steps[3].facts[2] (step \"route-change\", fact \"Pieces 3 and 4\")": "609ad1ee77e0a868f99aad421a9636ddbd8927765aea8f11451fec72727d2aad",
    "units[0].steps[3].facts[3] (step \"route-change\", fact \"The new way\")": "a98b897a085089d27d1da9744a624b4f5924cded565268a031e587cfffcb4e49",
    "units[0].steps[3].events[0] (event \"s4-p3\")": "09757e7d0b21b91a0a60c1d0172b89f66ab6c3be19b99399bb4bf9ebdb2978c4",
    "units[0].steps[3].events[1] (event \"s4-t3\")": "a60c493d69644680f303ab83d72d99471b30f8c9f50e94b5ca0d505bb8bd16dd",
    "units[0].steps[3].events[2] (event \"s4-p4\")": "aea8d5e4943d3c8b52af8a1a5379a3044ff72eaf9512bc4f0997f4f1e3178ca5",
    "units[0].steps[3].events[3] (event \"s4-t4\")": "407bc42326f093d6a36f24a6ee18bc2ac6b6325b427dce1a74ff07102567b346",
    "units[0].steps[3].events[4] (event \"s4-p2\")": "cc870df71fdfaf51b0050d445ac26a4fa3134aa473ec9735d5c749d8722467fb",
    "units[0].steps[3].events[5] (event \"s4-t2\")": "3069dbc57612bb44552d0441700bec9e66545a99cbff3e0d8b31965ab2056c55",
    "units[0].steps[4] (step \"in-order-delivery\")": "d4c349c9da2969191235977e271e9a1c3a4c782d65ff04d14780162cc53bf1e6",
    "units[0].steps[4].facts[0] (step \"in-order-delivery\", fact \"The browser got\")": "05f7e8d1b49b687877dd196142baebade5a15e7521d1d6c4380d47e9ffd1de4c",
    "units[0].steps[4].facts[1] (step \"in-order-delivery\", fact \"Who put them in order\")": "5dcbf4d2cd87c4b3b1b3e02c4fda081eb27010d3d853510eedd910c4ebe9ed60",
    "units[0].steps[4].facts[2] (step \"in-order-delivery\", fact \"IP itself\")": "cf85bd22a5959d4f833a816c9551c82393c2b407186641aedd8c7dc38440609a",
    "units[0].steps[4].events[0] (event \"s5-order\")": "1582963e1433bc25557b4f46a2aaae083dcec2af772790e015bc3eaab3007ed9",
    "units[0].steps[4].events[1] (event \"s5-done\")": "2633e6eb875cad5bd79f365266fd2c19b9921e62c64b1fdb12d93782c866fee4",
    "units[0].steps[0].deep[0] (step \"segmentation\", Go deeper)": "8fb19ad1b183d184364602a5c1b5158479532a1f8750584d593d5077bb726463",
    "units[0].steps[1].deep[0] (step \"packet-headers\", Go deeper)": "90f981ba56a5e13e1353e8ec347c42b90fd487d39e9eeddbc309210b9d991352",
    "units[0].steps[2].deep[0] (step \"forwarding\", Go deeper)": "062ddfb6c9c0e0430574c278f67a5c119f5c82abcc0179b8ca496d1d92ccc215",
    "units[0].steps[3].deep[0] (step \"route-change\", Go deeper)": "9d0f043e99c6dae78b387f2f3e27ce567d94e8a8c4e839dbfe7c4fdff9b2837e",
    "units[0].steps[4].deep[0] (step \"in-order-delivery\", Go deeper)": "992f1ec221bbd07577aa055d50c127690c50ba613cc4bf2fd31ad39032b22737",
    "units[0].learn.lead[0] (\"lead-1\")": "6d020696cc997d9c7a12bff640a8fe601b6b3e2c695a15f5a505334477011875",
    "units[0].learn.lead[1] (\"lead-2\")": "c18898724e28f52881b74eae1f5cde2e73c0b0dd075021e7c9a67955a6d0d605",
    "units[0].learn.terms[0] (\"term-packet\")": "d4092a0263338083d0b34f7497e96edc4412b04f5df3531082e1977ae81714bb",
    "units[0].learn.terms[1] (\"term-header\")": "27e21d8fdab51855daed66b3cd8d4c2f7efd518fcca182d738262c2fb66eef0d",
    "units[0].learn.terms[2] (\"term-segment\")": "5eef721c11ce245d576588fdeb2a854d48edd8fcde03f12cbed85af00c309099",
    "units[0].learn.terms[3] (\"term-mtu\")": "9b844cddd7c609204f0673c4c62aaeea68ef1f556cc72c69b0e5426d2de5ad59",
    "units[0].learn.terms[4] (\"term-sequence\")": "5b9a769d88619b3e99232fc933634702eb5838c973cf1b3b679d97589bf675cb",
    "units[0].learn.terms[5] (\"term-datagram\")": "0b1e10bdcda7cc3b89b7b05ab29ae5b2b4b2b3149125eca15a1525f9962a38be",
    "units[0].learn.pattern (\"pattern\")": "2631428ee4ff607e06d094284932a84c2bac1bd1f2e1a42aea9b3a0b0241bfe9",
    "units[0].learn.why[0] (\"why-1\")": "b4841614735b63263b0b1dce972079a31cecdc19703349bc4bff7140f2ea6e4f",
    "units[0].learn.why[1] (\"why-2\")": "bc88b64501476aa3c0b9a566ed328b3680cf96a9e4c466334e5e727583414d89",
    "units[0].learn.deep[0] (\"deep-fragments\", Learn's Go deeper)": "0514a71ff42e9104a0291997dec1e849362069e94887ad9639cc39650220fae8",
    "units[0].learn.facts[0] (\"fact-mtu\")": "8200315721c704f3defd18b9ea01a02551380f0062b649b7800f43222566e7dd",
    "units[0].learn.facts[1] (\"fact-piece-size\")": "b5e53999df77e5b4df1c287b3f6bd7323586bfe5af21608c10d5a8f3b39697bc",
    "units[0].learn.facts[2] (\"fact-who-cuts\")": "b08e9823609d0147994a1e0862d1babc7eeeec19a295ce5d44f186ede5167839",
    "units[0].learn.facts[3] (\"fact-ip-header\")": "9dd248df7c4ca2e7fa93bae88cfeb5d79c173000a74f238d6e0930a26edd2f0e",
    "units[0].learn.facts[4] (\"fact-tcp-header\")": "0683b79abd5212072a420557fd827b476ea53d19a06b34f47f66a69735d9dbbc",
    "units[0].learn.facts[5] (\"fact-on-its-own\")": "f368d45dbc3f418aab9ad9e75e7945499fb96f58f7c407fadc5176e0eacca92e",
    "units[0].learn.facts[6] (\"fact-same-way\")": "86b85471551a6f8a8cb48728e32fd84be9391d398dbd0ac78721abdaa22a481e",
    "units[0].learn.facts[7] (\"fact-routes-change\")": "9a866b06cbe9d082bec5a4023e2df87dd1ea328d01bc7f8ded4aa568973d5bde",
    "units[0].learn.facts[8] (\"fact-out-of-order\")": "c6fc82cb5414d729eeb9e5cd32b458ed1e5f919af4f394ab4f31ee563c3a5738",
    "units[0].learn.facts[9] (\"fact-ip-promises\")": "47b5456b8abf3b1f22e39f97dd25fd35930762a322229761ab7092d67f7693eb",
    "units[0].learn.facts[10] (\"fact-back-in-order\")": "d6f5cb4800fa5aff9334b0c1a0c4ccc53881414847fde38293d7c845ad2cf70a",
    "units[0].learn.facts[11] (\"fact-ports\")": "61582689e558805f3fbc00baad784e7d56268259c5db139f12668af231c39960",
    "units[0].learn.facts[12] (\"fact-defined\")": "e88a69c9ec3c9e9e903dd2fced215f5162d3347e14b3805bce2f9f3671646840",
    "units[0].learn.facts[13] (\"fact-osi\")": "2946dc8a66b9e9cc2a821b6cecbc04c06b436ad4fd31d2f82b931af372198954",
    "units[0].practice[0].options[0] (question \"who-cuts\")": "654a8314e36aca4e9f1f36d535845b9cb87bdaef40477517463d96c2ad7bebed",
    "units[0].practice[0].options[1] (question \"who-cuts\")": "c357ea10c5079ece18f0d03961b435a8a08d2e6335b45e3289adc62652a0163d",
    "units[0].practice[0].options[2] (question \"who-cuts\")": "bad051d7c76192530407485f816dd541cca0abb04960ed682dedf12bb1160417",
    "units[0].practice[1].options[0] (question \"early-pieces\")": "49a168573a35a82f02aefd681e367d00cd7898d9bbd76a8d76e44d6ddef706a9",
    "units[0].practice[1].options[1] (question \"early-pieces\")": "859bef779e76cea14f6a448d975c84f927f25d5518224df2e6c1f2f4485a1912",
    "units[0].practice[1].options[2] (question \"early-pieces\")": "f5099bdad61538d990c730bc1f40c0d15a74a72c627051441a394f2ac9a9d647",
    "units[0].practice[0].prompt (question \"who-cuts\")": "b2800e411234e08357b0d14d30c57f070d899fbad38e925a8b35d8b6975f36ce",
    "units[0].practice[1].prompt (question \"early-pieces\")": "62bfe76a12a4eadc068324966ae5bd5a52ab71d10e0b8ba581c5a1d126379c18"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: Packets

A full check of the claim sheet for `packets`. Every source was fetched from its publisher on 2026-11-15 and every cited section read in this run. 87 items pass; one Practice option is held for a missing second source.

## Claims

### units[0].osi — ✅

Layers: 3.

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer … IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer), the transport layer should include frame sequencing and acknowledgment
- `nist-sp800-41r1` §2
  > IP Layer (also known as the Network Layer). This layer routes packets across networks.
- Note: Cloudflare's OSI table puts IP at layer 3, and Microsoft's OSI page treats IP's layer as the network layer; two vendors, independent of each other. NIST names IP's layer the network layer in the TCP/IP model. The lesson's packet is the IP packet, so layer 3 fits. No allowed source met in this run puts the IP packet at another layer.
- Note: Cloudflare's page was last updated in October 2026, Microsoft's in January 2025; both are live.

### units[0].steps[0].deep[0] (step "segmentation", Go deeper) — ✅

"The 1,460 is the link’s 1,500 bytes minus a 20-byte IP header and a 20-byte TCP header. Options in the TCP header make it longer, and the data a little shorter."

- `rfc-9293` §3.7.1
  > The MSS value to be sent in an MSS Option should be equal to the effective MTU minus the fixed IP and TCP headers.
- `rfc-9293` §3.7.1
  > TCPhdrsize is the size of the fixed TCP header and any options. This is 20 in the (rare) case that no options are present but may be larger if TCP Options are to be sent.
- `rfc-9293` §3.7.1
  > if there are any IP or TCP Options to be sent in a packet, then the sender must decrease the size of the TCP data accordingly.
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > The IP header and the TCP header are 20 bytes each, or 40 bytes total. An interface with an MTU of 1,500 has an MSS of 1,460.
- `rfc-791` §3.1
  > The maximal internet header is 60 octets, and a typical internet header is 20 octets
- Note: RFC 9293 (Internet Standard, STD 7) defines TCP's maximum segment size and how the data shrinks when options are sent; RFC 791 (STD 5) defines the IPv4 header. Neither is obsoleted.

### units[0].steps[1].deep[0] (step "packet-headers", Go deeper) — ✅

"An IPv4 header is at least 20 bytes. Besides the two addresses, it says how long the packet is and which protocol is inside it, here TCP."

- `rfc-791` §3.1
  > Internet Header Length is the length of the internet header in 32 bit words, and thus points to the beginning of the data. Note that the minimum value for a correct header is 5.
- `rfc-791` §3.1
  > Total Length is the length of the datagram, measured in octets, including internet header and data.
- `rfc-791` §3.1
  > This field indicates the next level protocol used in the data portion of the internet datagram.
- `rfc-791` §3.1
  > Source Address: 32 bits
  > The source address.
- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP segments, with each TCP segment sent as an Internet Protocol (IP) datagram.
- Note: RFC 791 defines the IPv4 header: five 32-bit words is 20 bytes at least, with the length, protocol and both address fields. RFC 9293 defines TCP and states that its segments ride in IP datagrams. RFC 791's updates (1349, 2474, 6864) change the type-of-service and identification fields only, not these.

### units[0].steps[2].deep[0] (step "forwarding", Go deeper) — ✅

"Where a router has two equally good ways, it picks one for each conversation, using the packets’ addresses, and keeps to it, so its pieces stay in order."

- `rfc-8900` §3.5
  > In order to assign a packet or packet fragment to a link, an intermediate node executes a hash (i.e., load-distributing) algorithm. The following paragraphs describe a commonly deployed hash algorithm.
- `rfc-8900` §3.5
  > non-fragmented packets belonging to a flow can be assigned to one link
- `rfc-2991` §3
  > For example, a flow might be identified solely by destination address, or it might be identified by (source address, destination address, protocol id) triplet.
- `rfc-2991` §3
  > The natural solution is therefore to ensure that packets for the same flow always use the same path.
- `cisco-cef-load-balancing` §Per-Destination Load Balancing
  > Packets for a given source-destination host pair are guaranteed to take the same path, even if multiple paths are available.
- `cisco-cef-load-balancing` §Per-Destination Load Balancing
  > You can use per-destination load balancing to ensure that packets for a given host pair arrive in order.
- Note: true for a beginner. It leaves out that the common hash also takes in the ports, and that a router can be set to spread single packets across paths (Cisco's page says that is not recommended, because it reorders packets).
- Note: RFC 8900 (BCP 230) and RFC 2991 are not obsoleted; Cisco's page is live and describes per-flow load sharing, which RFC 8900 calls commonly deployed.

### units[0].steps[3].deep[0] (step "route-change", Go deeper) — ✅

"Routes change when a link or a router fails, and routers keep their routes up to date by themselves. While a route changes, the internet can hold up some packets more than others."

- `rfc-8900` §2.1
  > Internet paths are dynamic. Assume that the path from one node to another contains a set of links and routers. If a link or a router fails, the path can also change so that it includes a different set of links and routers.
- `rfc-1812` §2.4
  > routers are designed to be stateless, forwarding each IP packet independently of other packets. As a result, redundant paths can be exploited to provide robust service in spite of failures of intervening routers and networks.
- `cisco-what-is-routing` §Large intra-domain networks
  > Dynamic routing, which is based on protocols that incorporate updated network information and pathway metrics, keeps itself up-to-date automatically.
- `rfc-1812` §2.2.3
  > The routing database should be maintained dynamically to reflect the current topology of the Internet system. A router normally accomplishes this by participating in distributed routing and reachability algorithms with other routers.
- `rfc-8085` §3.3
  > The Internet can significantly delay some packets with respect to others, e.g., due to routing transients, intermittent connectivity, or mobility.
- `rfc-2991` §3
  > the potential for packet reordering and packet loss due to route flaps can be much greater than when not using multipath.
- Note: RFC 1812 defines the requirements for IPv4 routers, including the dynamic upkeep of their routing tables; its updates (2644, 6633) concern directed broadcast and Source Quench only.
- Note: true for a beginner. Failure is one cause of a route change among others (a new link, a changed metric or policy); the sentence names the common one.

### units[0].steps[4].deep[0] (step "in-order-delivery", Go deeper) — ✅

"Along the way, your laptop’s TCP also tells the server what has arrived. If a piece never came, the server would send that one piece again, not the whole file."

- `rfc-9293` §3.4
  > Since every octet is sequenced, each of them can be acknowledged. The acknowledgment mechanism employed is cumulative so that an acknowledgment of sequence number X indicates that all octets up to but not including X have been received.
- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-9293` §3.8
  > When the receiver accepts a segment, it advances RCV.NXT and sends an acknowledgment.
- `rfc-6298` §5
  > Retransmit the earliest segment that has not been acknowledged by the TCP receiver.
- Note: RFC 9293 defines TCP's acknowledgments and retransmission; RFC 6298 (Proposed Standard, not obsoleted) defines the retransmission timer and what is resent when it fires.
- Note: true for a beginner. Some recoveries resend a few segments rather than exactly one; the ordinary outcome is the missing piece, never the whole file.

### units[0].learn.lead[0] ("lead-1") — ✅

"Data crosses a network in small pieces. TCP cuts an app’s bytes into segments, and each one travels in a packet whose header says where it’s from and where it’s going. Every packet travels on its own, and at the far end TCP puts the pieces back in order."

- `rfc-1191` §1
  > When one IP host has a large amount of data to send to another host, the data is transmitted as a series of IP datagrams.
- `rfc-9293` §3.7
  > The term "segmentation" refers to the activity TCP performs when ingesting a stream of bytes from a sending application and packetizing that stream of bytes into TCP segments.
- `rfc-8900` §4.1
  > Applications submit a stream of data to TCP. TCP divides that stream of data into segments, with no segment exceeding the TCP Maximum Segment Size (MSS). Each segment is encapsulated in a TCP header and submitted to the underlying IP module. The underlying IP module prepends an IP header and forwards the resulting packet.
- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP segments, with each TCP segment sent as an Internet Protocol (IP) datagram.
- `rfc-791` §3.1
  > Source Address: 32 bits
  > The source address.
- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated
- `nist-sp800-41r1` §2.1.1
  > The packet’s destination address—the address of the host the packet is trying to reach
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram. There are no connections or logical circuits (virtual or otherwise).
- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- `nist-sp800-41r1` §2
  > When a user wants to transfer data across networks, the data is passed from the highest layer through intermediate layers to the lowest layer, with each layer adding more information.
- Note: RFC 9293 defines TCP's segmentation and in-order delivery; RFC 791 defines the IPv4 header and IP's handling of each datagram on its own.
- Note: true for a beginner. It speaks of TCP, the lesson's case; apps that use UDP-based transports cut their data by other means, which the lead does not deny.

### units[0].learn.terms[0] ("term-packet") — ✅

"Packet: An IP header followed by data"

- `rfc-1122` §1.3.3
  > A packet is the unit of data passed across the interface between the internet layer and the link layer. It includes an IP header and data.
- `rfc-791` §3.1
  > Internet Header Length is the length of the internet header in 32 bit words, and thus points to the beginning of the data.
- `nist-sp800-77r1` §2.1, footnote 6
  > At each layer, the logical units are typically composed of a header and a payload.
- Note: RFC 791 defines the IPv4 header that leads every packet; RFC 1122 (STD 3, updated but not obsoleted; its updates concern TCP and other fields, not this term) states the term itself, and NIST states the header-then-payload shape.

### units[0].learn.terms[1] ("term-header") — ✅

"Header: The label at the front: where it’s from, where it’s going, and more"

- `rfc-791` §3.1
  > Internet Header Length is the length of the internet header in 32 bit words, and thus points to the beginning of the data.
- `rfc-791` §3.1
  > Destination Address: 32 bits
  > The destination address.
- `rfc-8200` §3
  > Source Address 128-bit address of the originator of the packet.
- `rfc-8200` §3
  > Destination Address 128-bit address of the intended recipient of the packet
- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated
- `nist-sp800-77r1` §2.1, footnote 6
  > while the header contains layer-specific information such as addresses.
- Note: RFC 791 and RFC 8200 (STD 86, updated by RFC 9673 on Hop-by-Hop options only) define the IPv4 and IPv6 headers, each with both addresses and further fields.
- Note: true for a beginner. "Label" is an everyday word for the header's control information.

### units[0].learn.terms[2] ("term-segment") — ✅

"Segment: One piece of the data, with TCP’s header"

- `rfc-9293` §4
  > In particular, a TCP segment is the unit of data transferred between a pair of TCP modules.
- `rfc-9293` §3.7
  > packetizing that stream of bytes into TCP segments.
- `rfc-8900` §4.1
  > TCP divides that stream of data into segments, with no segment exceeding the TCP Maximum Segment Size (MSS). Each segment is encapsulated in a TCP header and submitted to the underlying IP module.
- Note: RFC 9293 defines the TCP segment.

### units[0].learn.terms[3] ("term-mtu") — ✅

"MTU (maximum transmission unit): The biggest packet a link can carry"

- `rfc-1122` §1.3.3
  > The maximum transmission unit, i.e., the size of the largest packet that can be transmitted.
- `rfc-8900` §2.1
  > Each link is constrained by the number of octets that it can convey in a single IP packet. This constraint is called the link Maximum Transmission Unit (MTU).
- `microsoft-azure-tcpip-tuning` §MTU
  > The maximum transmission unit (MTU) is the largest size frame (packet plus network access headers) specified in bytes that can be sent over a network interface.
- Note: two IETF documents give the term and its full name. Microsoft's page counts the link headers in, a looser use the idea does not contradict for a beginner.

### units[0].learn.terms[4] ("term-sequence") — ✅

"Sequence number: The number of a piece’s first byte"

- `rfc-9293` §3.1
  > The sequence number of the first data octet in this segment (except when the SYN flag is set).
- `rfc-9293` §3.4
  > A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number.
- Note: RFC 9293 defines the Sequence Number field. True for a beginner: it leaves out that the count starts from a random initial number, not 1.

### units[0].learn.terms[5] ("term-datagram") — ✅

"Datagram: A packet that travels on its own, with no connection set up"

- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram. There are no connections or logical circuits (virtual or otherwise).
- `rfc-1812` §2.4
  > routers are designed to be stateless, forwarding each IP packet independently of other packets.
- `rfc-1122` §1.1.2
  > gateways are designed to be stateless, forwarding each IP datagram independently of other datagrams.
- Note: RFC 791 defines the IP datagram and states its independence; RFC 1812 defines router behaviour.

### units[0].learn.pattern ("pattern") — ✅

Names: Cut into segments; Add the headers; Send each on its own; Put back in order. Note: "What happens to a file on its way. TCP cuts and puts back, at the two ends; IP carries each packet, and every router on the way passes it on."

- `rfc-8900` §4.1
  > TCP divides that stream of data into segments, with no segment exceeding the TCP Maximum Segment Size (MSS). Each segment is encapsulated in a TCP header and submitted to the underlying IP module. The underlying IP module prepends an IP header and forwards the resulting packet.
- `rfc-9293` §3.7
  > The term "segmentation" refers to the activity TCP performs when ingesting a stream of bytes from a sending application and packetizing that stream of bytes into TCP segments.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- `rfc-791` §1.4
  > The internet modules use the addresses carried in the internet header to transmit internet datagrams toward their destinations.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram.
- `rfc-1812` §2.4
  > routers are designed to be stateless, forwarding each IP packet independently of other packets.
- Note: RFC 9293 defines TCP's segmentation and ordering at the ends; RFC 791 and RFC 1812 define IP's carriage and router forwarding.

### units[0].learn.why[0] ("why-1") — ✅

"A link carries packets only up to its MTU, 1,500 bytes on Ethernet and on most networks, so anything bigger goes in pieces. TCP sizes its pieces to fit."

- `rfc-8900` §2.1
  > Each link is constrained by the number of octets that it can convey in a single IP packet. This constraint is called the link Maximum Transmission Unit (MTU).
- `rfc-894` §Frame Format
  > thus the maximum length of an IP datagram sent over an Ethernet is 1500 octets.
- `microsoft-azure-tcpip-tuning` §MTU
  > The default MTU used on Azure VMs, and the default setting on most network devices globally, is 1,500 bytes.
- `rfc-1191` §1
  > When one IP host has a large amount of data to send to another host, the data is transmitted as a series of IP datagrams.
- `rfc-9293` §3.7
  > Avoiding sending a TCP segment that would result in an IP datagram larger than the smallest MTU along an IP network path because this results in either packet loss or packet fragmentation.
- Note: RFC 894 (STD 41, not obsoleted) gives Ethernet's 1,500 and Microsoft gives 1,500 as the default on most network devices; both state the common figure. RFC 9293 defines TCP's sizing of segments.
- Note: true for a beginner. Some links differ (jumbo frames, tunnels, PPPoE); "most networks" names the ordinary case.

### units[0].learn.why[1] ("why-2") — ✅

"If one piece goes missing, TCP sends just that piece again, not the whole file."

- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-6298` §5
  > Retransmit the earliest segment that has not been acknowledged by the TCP receiver.
- Note: RFC 9293 defines TCP retransmission and RFC 6298 the timer rule that resends the earliest unacknowledged segment. True for a beginner: some recoveries resend more than one segment, never the whole file in the ordinary case.

### units[0].learn.deep[0] ("deep-fragments", Learn's Go deeper) — ✅

"IP can also split a packet that’s too big for the next link into fragments, which the destination puts back together. That’s fragile, so TCP picks piece sizes that avoid it. In IPv6, routers never split packets; only the sender can."

- `rfc-791` §2.3
  > In the routing of messages from one internet module to another, datagrams may need to traverse a network whose maximum packet size is smaller than the size of the datagram. To overcome this difficulty, a fragmentation mechanism is provided in the internet protocol.
- `rfc-791` §3.2
  > The basic internet service is datagram oriented and provides for the fragmentation of datagrams at gateways, with reassembly taking place at the destination internet protocol module in the destination host.
- `rfc-8900` §1
  > Operational experience [Kent] [Huston] [RFC7872] reveals that IP fragmentation introduces fragility to Internet communication.
- `rfc-9293` §3.7.2
  > Both PMTUD and PLPMTUD help TCP choose segment sizes that avoid both on-path (for IPv4) and source fragmentation (IPv4 and IPv6).
- `rfc-8200` §4.5
  > unlike IPv4, fragmentation in IPv6 is performed only by source nodes, not by routers along a packet's delivery path
- `microsoft-azure-tcpip-tuning` §Azure and fragmentation
  > For this reason, we recommend avoiding fragmentation if possible.
- Note: RFC 791 defines IPv4 fragmentation and reassembly at the destination; RFC 8200 defines IPv6's source-only fragmentation; RFC 9293 defines TCP's segment sizing to avoid it.

### units[0].learn.facts[0] ("fact-mtu") — ✅

"Largest packet (MTU): 1,500 bytes on Ethernet and on most networks"

- `rfc-894` §Frame Format
  > thus the maximum length of an IP datagram sent over an Ethernet is 1500 octets.
- `microsoft-azure-tcpip-tuning` §MTU
  > The default MTU used on Azure VMs, and the default setting on most network devices globally, is 1,500 bytes.
- `rfc-1122` §1.3.3
  > The maximum transmission unit, i.e., the size of the largest packet that can be transmitted.
- Note: true for a beginner, as for why-1: "most networks" is the ordinary case; some links use other sizes.

### units[0].learn.facts[1] ("fact-piece-size") — ✅

"Each piece: up to 1,460 bytes of data on a 1,500-byte link: the MTU minus a 20-byte IP header and a 20-byte TCP header"

- `rfc-9293` §3.7.1
  > The MSS value to be sent in an MSS Option should be equal to the effective MTU minus the fixed IP and TCP headers.
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > The IP header and the TCP header are 20 bytes each, or 40 bytes total. An interface with an MTU of 1,500 has an MSS of 1,460.
- `rfc-791` §3.1
  > The maximal internet header is 60 octets, and a typical internet header is 20 octets
- Note: RFC 9293 defines the MSS. "Up to" covers the smaller data size when TCP options are sent.

### units[0].learn.facts[2] ("fact-who-cuts") — ✅

"Who cuts the data: TCP, into segments; IP puts each segment in a packet"

- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP segments, with each TCP segment sent as an Internet Protocol (IP) datagram.
- `rfc-9293` §3.7
  > The term "segmentation" refers to the activity TCP performs when ingesting a stream of bytes from a sending application and packetizing that stream of bytes into TCP segments.
- `rfc-8900` §4.1
  > TCP divides that stream of data into segments, with no segment exceeding the TCP Maximum Segment Size (MSS). Each segment is encapsulated in a TCP header and submitted to the underlying IP module. The underlying IP module prepends an IP header and forwards the resulting packet.
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > TCP maximum segment size (MSS) is a setting that limits the size of TCP segments, which avoids fragmentation of TCP packets.
- Note: RFC 9293 defines TCP segmentation. True for a beginner: it leaves out that a network card can do TCP's cutting for it (large send offload).

### units[0].learn.facts[3] ("fact-ip-header") — ✅

"IP header: the address it’s from and the address it’s going to, among other fields"

- `rfc-791` §3.1
  > Source Address: 32 bits
  > The source address.
- `rfc-791` §3.1
  > Destination Address: 32 bits
  > The destination address.
- `rfc-8200` §3
  > Source Address 128-bit address of the originator of the packet.
- `nist-sp800-41r1` §2.1.1
  > The packet’s destination address—the address of the host the packet is trying to reach
- Note: RFC 791 and RFC 8200 define the IPv4 and IPv6 headers, which carry both addresses among their other fields.

### units[0].learn.facts[4] ("fact-tcp-header") — ✅

"TCP header: the two ports, and the number of the piece’s first byte, which tells the receiver where the piece fits"

- `rfc-9293` §3.1
  > Source Port: 16 bits
  > The source port number.
- `rfc-9293` §3.1
  > Destination Port: 16 bits
  > The destination port number.
- `rfc-9293` §3.1
  > The sequence number of the first data octet in this segment (except when the SYN flag is set).
- `rfc-9293` §3.4
  > The numbering scheme of octets within a segment is as follows: the first data octet immediately following the header is the lowest numbered, and the following octets are numbered consecutively.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- Note: RFC 9293 defines the TCP header's port and sequence fields.

### units[0].learn.facts[5] ("fact-on-its-own") — ✅

"Each packet: travels on its own: every router reads its destination and sends it on, deciding for each packet"

- `rfc-791` §1.4
  > The internet modules use the addresses carried in the internet header to transmit internet datagrams toward their destinations.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram.
- `rfc-1812` §2.4
  > routers are designed to be stateless, forwarding each IP packet independently of other packets.
- `rfc-1122` §1.1.2
  > gateways are designed to be stateless, forwarding each IP datagram independently of other datagrams.
- `nist-sp800-41r1` §2
  > IP Layer (also known as the Network Layer). This layer routes packets across networks.
- Note: RFC 791 defines IP's per-datagram handling; RFC 1812 defines router forwarding.

### units[0].learn.facts[6] ("fact-same-way") — ✅

"One download’s packets: usually all take the same way"

- `rfc-1122` §1.3.3
  > At a given moment, all the IP datagrams from a particular source host to a particular destination host will typically traverse the same sequence of gateways.
- `rfc-2991` §3
  > The natural solution is therefore to ensure that packets for the same flow always use the same path.
- `cisco-cef-load-balancing` §Per-Destination Load Balancing
  > Packets for a given source-destination host pair are guaranteed to take the same path, even if multiple paths are available.

### units[0].learn.facts[7] ("fact-routes-change") — ✅

"Routes: can change while packets travel, for example when a link or a router fails"

- `rfc-8900` §2.1
  > Internet paths are dynamic. Assume that the path from one node to another contains a set of links and routers. If a link or a router fails, the path can also change so that it includes a different set of links and routers.
- `rfc-1812` §2.4
  > As a result, redundant paths can be exploited to provide robust service in spite of failures of intervening routers and networks.
- `cisco-what-is-routing` §Large intra-domain networks
  > Such networks may have complex topologies and multiple subnetworks and undergo continual changes, such as addition and removal of endpoints and applications.
- Note: RFC 1812 defines router behaviour, including routing around failed routers and networks.

### units[0].learn.facts[8] ("fact-out-of-order") — ✅

"Out of order: when packets of one download take different ways, as when a route changes, some can be held up and a later one can arrive first"

- `rfc-8085` §3.3
  > The Internet can significantly delay some packets with respect to others, e.g., due to routing transients, intermittent connectivity, or mobility. This can cause reordering, where UDP datagrams arrive at the receiver in an order different from the transmission order.
- `rfc-2991` §2
  > Since each of the redundant paths may have a different latency involved, having packets take separate paths can cause packets to always arrive out of order
- `rfc-2991` §3
  > the potential for packet reordering and packet loss due to route flaps can be much greater than when not using multipath.
- `cisco-cef-load-balancing` §Per-Packet Load Balancing
  > packets for a given source-destination host pair might take different paths. Per-packet load balancing can therefore introduce reordering of packets.
- Note: RFC 8085 is BCP 145 (updated by RFC 8899 on path MTU probing only); its point on reordering holds for any IP traffic.

### units[0].learn.facts[9] ("fact-ip-promises") — ✅

"IP itself: promises no order and no delivery: packets may arrive out of order, or not at all"

- `rfc-1122` §1.1.3
  > IP is a connectionless or datagram internetwork service, providing no end-to-end delivery guarantees. Thus, IP datagrams may arrive at the destination host damaged, duplicated, out of order, or not at all.
- `rfc-791` §1.2
  > There are no mechanisms to augment end-to-end data reliability, flow control, sequencing, or other services commonly found in host-to-host protocols.
- `rfc-1812` §2.2.1
  > IP datagrams may arrive at the destination host damaged, duplicated, out of order, or not at all.
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer), the transport layer should include frame sequencing and acknowledgment
- Note: RFC 791 defines IP's scope, with no sequencing or reliability.

### units[0].learn.facts[10] ("fact-back-in-order") — ✅

"Put back in order by: TCP at the receiver: it holds pieces that come early and hands the bytes on in order, so the app just gets the bytes"

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- `rfc-9293` §3.7
  > TCP guarantees no correlation between the boundaries of TCP segments sent and received and the boundaries of the read or write buffers of user application data.
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- Note: RFC 9293 defines TCP's receive processing and in-order delivery.

### units[0].learn.facts[11] ("fact-ports") — ✅

"Ports here: the web server’s TCP port 80; your laptop’s side uses a port of its own"

- `rfc-9110` §4.2.1
  > If the port subcomponent is empty or not given, TCP port 80 (the reserved port for WWW services) is the default.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host, and a source port usually identifies the port number on the source host that the destination host should reply to.
- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to multiplex distinct flows between hosts.
- Note: RFC 9110 (STD 97) defines the http scheme and its default TCP port 80; RFC 9293 defines TCP's ports, which tell flows apart at each end. NIST states the client's own source port in plain terms.
- Note: true for a beginner. "Here" ties port 80 to this scene; most sites today use HTTPS on port 443, which the fact does not deny.

### units[0].learn.facts[12] ("fact-defined") — ✅

"Defined in: RFC 791 (IPv4) and RFC 8200 (IPv6); TCP’s segments in RFC 9293"

- `rfc-791` §1.1
  > The internet protocol provides for transmitting blocks of data called datagrams from sources to destinations, where sources and destinations are hosts identified by fixed length addresses.
- `rfc-8200` §1
  > IP version 6 (IPv6) is a new version of the Internet Protocol (IP), designed as the successor to IP version 4 (IPv4) [RFC791].
- `rfc-9293` §4
  > In particular, a TCP segment is the unit of data transferred between a pair of TCP modules.
- Note: RFC 791 (STD 5) is the current IPv4 standard, RFC 8200 (STD 86) the current IPv6 standard, and RFC 9293 (STD 7) the current TCP standard; none is obsoleted.

### units[0].learn.facts[13] ("fact-osi") — ✅

"OSI layer: 3, network"

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer … IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer), the transport layer should include frame sequencing and acknowledgment
- `nist-sp800-41r1` §2
  > IP Layer (also known as the Network Layer). This layer routes packets across networks.
- Note: as for the OSI badge: two vendors place IP at OSI layer 3.

### units[0].practice[0].options[0] (question "who-cuts") — ✅

"TCP on the server, into segments of up to 1,460 bytes." (right) Feedback: "Right. TCP cuts the stream of bytes into segments sized to fit the link, and IP puts each one in a packet."

- `rfc-9293` §3.7
  > The term "segmentation" refers to the activity TCP performs when ingesting a stream of bytes from a sending application and packetizing that stream of bytes into TCP segments.
- `rfc-9293` §3.7.1
  > The MSS value to be sent in an MSS Option should be equal to the effective MTU minus the fixed IP and TCP headers.
- `rfc-8900` §4.1
  > TCP divides that stream of data into segments, with no segment exceeding the TCP Maximum Segment Size (MSS). Each segment is encapsulated in a TCP header and submitted to the underlying IP module. The underlying IP module prepends an IP header and forwards the resulting packet.
- `microsoft-azure-tcpip-tuning` §TCP MSS window scaling and PMTUD
  > An interface with an MTU of 1,500 has an MSS of 1,460.
- Note: RFC 9293 defines segmentation and the MSS. The 1,460 holds on the lesson's 1,500-byte link; the answer is right for the prompt.

### units[0].practice[0].options[1] (question "who-cuts") — ✅

"IP, which cuts the file into packets." (wrong) Feedback: "Not quite. IP carries each segment in a packet. IP can split a packet that’s too big for a link, but TCP sizes its pieces so that isn’t needed."

- `rfc-9293` §2.2
  > The application byte-stream is conveyed over the network via TCP segments, with each TCP segment sent as an Internet Protocol (IP) datagram.
- `rfc-791` §2.3
  > To overcome this difficulty, a fragmentation mechanism is provided in the internet protocol.
- `rfc-9293` §3.7.2
  > Both PMTUD and PLPMTUD help TCP choose segment sizes that avoid both on-path (for IPv4) and source fragmentation (IPv4 and IPv6).
- `rfc-8900` §4.1
  > If the TCP MSS is sufficiently small, then the underlying IP module never produces a packet whose length is greater than the actual PMTU. Therefore, IP fragmentation is not required.
- Note: the option is rightly marked wrong. RFC 9293 and RFC 791 define TCP and IP.

### units[0].practice[0].options[2] (question "who-cuts") — ✅

"Each router on the way, to fit its next link." (wrong) Feedback: "Not quite. The server’s TCP cuts the data before it leaves, sized for the way ahead, and routers just pass each packet on."

- `rfc-9293` §3.7
  > Avoiding sending a TCP segment that would result in an IP datagram larger than the smallest MTU along an IP network path because this results in either packet loss or packet fragmentation.
- `rfc-9293` §3.7.2
  > Both PMTUD and PLPMTUD help TCP choose segment sizes that avoid both on-path (for IPv4) and source fragmentation (IPv4 and IPv6).
- `rfc-8200` §4.5
  > unlike IPv4, fragmentation in IPv6 is performed only by source nodes, not by routers along a packet's delivery path
- `rfc-1812` §2.4
  > routers are designed to be stateless, forwarding each IP packet independently of other packets.
- Note: the option is rightly marked wrong. True for a beginner: "routers just pass each packet on" holds for this download, whose pieces were sized for the path; the lesson's Go deeper and the second option's feedback already say an IPv4 router can split a packet that does not fit.

### units[0].practice[1].options[0] (question "early-pieces") — ✅

"Your laptop’s TCP holds 3 and 4, and when 2 arrives, hands the bytes on in order." (right) Feedback: "Right. TCP numbers every byte, holds pieces that come early, and hands the bytes to the browser in order."

- `rfc-9293` §3.4
  > A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- Note: RFC 9293 defines TCP's byte numbering and receive processing.

### units[0].practice[1].options[1] (question "early-pieces") — ✅

"The browser gets them as they come, and the page is jumbled." (wrong) Feedback: "Not quite. TCP hands the browser the bytes in order, so it never sees them out of order."

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- Note: the option is rightly marked wrong; RFC 9293 defines TCP's in-order service.

### units[0].practice[1].options[2] (question "early-pieces") — ⚠️

"IP puts them back in order on the way." (wrong) Feedback: "Not quite. IP promises no order: each packet travels on its own. Putting the pieces back in order is TCP’s job, at your end."

- `rfc-1122` §1.1.3
  > IP is a connectionless or datagram internetwork service, providing no end-to-end delivery guarantees. Thus, IP datagrams may arrive at the destination host damaged, duplicated, out of order, or not at all.
- `rfc-791` §1.2
  > There are no mechanisms to augment end-to-end data reliability, flow control, sequencing, or other services commonly found in host-to-host protocols.
- `rfc-9293` §3.10
  > they are generally queued and processed in sequence number order.
- Note: what is wrong: the feedback's middle claim, that each packet travels on its own, rests on one citation only. RFC 1122 §1.1.3 states it (a connectionless, datagram service); RFC 791 §1.2, the only defining-standard citation that speaks of IP here, gives IP's scope (no sequencing, no reliability) but not that each datagram is handled on its own, and RFC 9293 §3.10 speaks of TCP. The other two claims pass: IP promises no order (RFC 1122 §1.1.3 and RFC 791 §1.2) and TCP puts the pieces back in order at the receiver (RFC 9293 §3.10). The claim is true and the option is rightly marked wrong.
- Note: the fix is a citation, not a change of words: RFC 791 §1.4 states that IP treats each datagram as an independent entity, and RFC 1812 §2.4 that routers forward each packet independently of the others; either one, added to this option, confirms the claim.

## Traced, example and analogy parts, and the unbacked items

### title — ✅

- Note: "Packets" makes no claim beyond the lesson's cited parts.

### units[0].name — ✅

- Note: "Packets" makes no claim beyond the lesson's cited parts.

### backing (the lesson's subtitle and summary) — ✅

- Note: the subtitle and summary repeat lead-1 (pieces, headers with both addresses, put back in order at the far end), fact-out-of-order (two arrive early) and fact-back-in-order. "Four pieces" is the scene's example.

### units[0].backing (the unit's full name and purpose) — ✅

- Note: "Packets and segments" and "data in small pieces, each with its own addresses" repeat term-packet, term-segment, lead-1 and fact-ip-header.

### units[0].scene.backing (the scene) — ✅

- Note: the scene's labels, table ("kept by your laptop's TCP") and log legend add nothing beyond lead-1, fact-ports, fact-who-cuts, fact-on-its-own and fact-back-in-order; example.net is an example name.

### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: repeats lead-1, why-1 (too big for one packet), fact-out-of-order (pieces can arrive out of order) and fact-back-in-order.

### units[0].overview.backing (the Overview description) — ✅

- Note: the analogy of numbered pages in separate envelopes, each with both addresses, arriving in any order and put back by page number, matches the lesson and does not mislead.

### units[0].overview.facts[0] (Overview fact "Each piece") — ✅

- Note: repeats fact-piece-size without its 1,500-byte link condition; it adds nothing.

### units[0].overview.facts[1] (Overview fact "Each packet carries") — ✅

- Note: repeats fact-ip-header.

### units[0].overview.facts[2] (Overview fact "Travels") — ✅

- Note: repeats fact-on-its-own and fact-same-way.

### units[0].overview.facts[3] (Overview fact "Put back in order by") — ✅

- Note: repeats fact-back-in-order.

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

- Note: repeats fact-osi.

### units[0].steps[0] (step "segmentation") — ✅

- Note: the 1,500-byte MTU on most links, TCP cutting into segments of up to 1,460 bytes and the sender's side doing the cutting all trace to fact-mtu, why-1, fact-piece-size, fact-who-cuts and pattern; 5,840 bytes making four pieces is the example's arithmetic.

### units[0].steps[0].facts[0] (step "segmentation", fact "File") — ✅

- Note: index.html of 5,840 bytes is made-up example data.

### units[0].steps[0].facts[1] (step "segmentation", fact "Largest packet") — ✅

- Note: repeats fact-mtu.

### units[0].steps[0].facts[2] (step "segmentation", fact "Each piece") — ✅

- Note: repeats fact-piece-size.

### units[0].steps[0].facts[3] (step "segmentation", fact "Pieces") — ✅

- Note: 4 pieces and 1,000 pieces for 1,460,000 bytes are arithmetic on fact-piece-size's 1,460.

### units[0].steps[0].events[0] (event "s1-req") — ✅

- Note: the addresses are RFC 1918 and RFC 5737 example addresses; port 80 and the laptop's own port trace to fact-ports.

### units[0].steps[0].events[1] (event "s1-cut") — ✅

- Note: repeats fact-who-cuts and term-segment.

### units[0].steps[1] (step "packet-headers") — ✅

- Note: the TCP header's ports and first-byte number, the IP header in front with both addresses, trace to fact-tcp-header, term-header, fact-ip-header and fact-who-cuts.

### units[0].steps[1].facts[0] (step "packet-headers", fact "From") — ✅

- Note: example address with port 80 (fact-ports).

### units[0].steps[1].facts[1] (step "packet-headers", fact "To") — ✅

- Note: the laptop's own port, from fact-ports; 50422 is example data.

### units[0].steps[1].facts[2] (step "packet-headers", fact "Piece 1") — ✅

- Note: byte numbering from fact-tcp-header and term-sequence.

### units[0].steps[1].facts[3] (step "packet-headers", fact "A packet") — ✅

- Note: repeats term-packet and fact-who-cuts.

### units[0].steps[1].events[0] (event "s2-p1") — ✅

- Note: traces fact-ip-header, fact-tcp-header and fact-ports; example addresses.

### units[0].steps[1].events[1] (event "s2-t1") — ✅

- Note: the table row repeats the piece's byte range.

### units[0].steps[2] (step "forwarding") — ✅

- Note: no connection inside the network (term-datagram), every router reading the destination and deciding per packet (fact-on-its-own), one download usually one way (fact-same-way).

### units[0].steps[2].facts[0] (step "forwarding", fact "Each packet") — ✅

- Note: repeats fact-on-its-own.

### units[0].steps[2].facts[1] (step "forwarding", fact "Every router") — ✅

- Note: repeats fact-on-its-own.

### units[0].steps[2].facts[2] (step "forwarding", fact "One download") — ✅

- Note: repeats fact-same-way.

### units[0].steps[2].events[0] (event "s3-p2") — ✅

- Note: piece 2 on the same way as piece 1 (fact-same-way); example addresses.

### units[0].steps[3] (step "route-change") — ✅

- Note: the route change, two pieces overtaking a held-up one, and the receiver's TCP keeping the early pieces aside trace to fact-routes-change, fact-out-of-order and fact-back-in-order; routers c and d are the scene's.

### units[0].steps[3].facts[0] (step "route-change", fact "Arrived") — ✅

- Note: the scene's order, from fact-out-of-order.

### units[0].steps[3].facts[1] (step "route-change", fact "Why") — ✅

- Note: repeats fact-routes-change and fact-out-of-order.

### units[0].steps[3].facts[2] (step "route-change", fact "Pieces 3 and 4") — ✅

- Note: repeats fact-back-in-order.

### units[0].steps[3].facts[3] (step "route-change", fact "The new way") — ✅

- Note: the scene's router d.

### units[0].steps[3].events[0] (event "s4-p3") — ✅

- Note: traces fact-routes-change and fact-out-of-order.

### units[0].steps[3].events[1] (event "s4-t3") — ✅

- Note: "arrived early, waiting" repeats fact-back-in-order.

### units[0].steps[3].events[2] (event "s4-p4") — ✅

- Note: traces fact-routes-change and fact-out-of-order.

### units[0].steps[3].events[3] (event "s4-t4") — ✅

- Note: repeats fact-back-in-order.

### units[0].steps[3].events[4] (event "s4-p2") — ✅

- Note: the held-up piece arriving last (fact-out-of-order).

### units[0].steps[3].events[5] (event "s4-t2") — ✅

- Note: the table row for piece 2.

### units[0].steps[4] (step "in-order-delivery") — ✅

- Note: TCP putting the bytes in order by number and handing them on, the browser never seeing the disorder, and IP promising no order trace to fact-back-in-order, fact-ip-promises and fact-tcp-header. Handing over "the whole page" at the end simplifies when the bytes reach the browser; it adds no false outcome, since the browser does get the whole page in order.

### units[0].steps[4].facts[0] (step "in-order-delivery", fact "The browser got") — ✅

- Note: repeats fact-back-in-order with the example's byte count.

### units[0].steps[4].facts[1] (step "in-order-delivery", fact "Who put them in order") — ✅

- Note: repeats fact-back-in-order.

### units[0].steps[4].facts[2] (step "in-order-delivery", fact "IP itself") — ✅

- Note: repeats fact-ip-promises.

### units[0].steps[4].events[0] (event "s5-order") — ✅

- Note: the table in order, from fact-back-in-order.

### units[0].steps[4].events[1] (event "s5-done") — ✅

- Note: TCP handing the bytes on in order (fact-back-in-order); example address.

### units[0].learn.lead[1] ("lead-2") — ✅

- Note: the same envelopes analogy as the Overview; it does not mislead.

### units[0].practice[0].prompt (question "who-cuts") — ✅

- Note: no false premise; the page size is the lesson's example.

### units[0].practice[1].prompt (question "early-pieces") — ✅

- Note: no false premise; pieces arriving early is taught by fact-out-of-order.

## Sources

All checked on 2026-11-15.

- `cisco-cef-load-balancing`: live (HTTP 200), Cisco's own configuration guide for IOS 15.0SY, last updated April 2012. The release is old, but the per-destination (per-flow) load sharing it describes is current practice: RFC 8900 (2020) calls flow hashing commonly deployed. Current.
- `cisco-what-is-routing`: live Cisco explainer page, read in full. Current.
- `cloudflare-network-layers`: live Cloudflare docs page, last updated October 2026. Current.
- `microsoft-azure-tcpip-tuning`: live Microsoft Learn page. Current.
- `microsoft-osi`: live Microsoft Learn page, last updated 2025-01-31. Current.
- `nist-sp800-41r1`: NIST CSRC lists SP 800-41 Rev. 1 (September 2009) as final, with no withdrawal and no later revision. Current.
- `nist-sp800-77r1`: NIST CSRC lists SP 800-77 Rev. 1 (June 2020) as final, with no withdrawal and no later revision. Current.
- `rfc-1122`: Internet Standard (STD 3), not obsoleted; updated by RFCs 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029 and 9293, none of which changes the terminology, architecture or IP-service passages cited. Current.
- `rfc-1191`: Draft Standard, not obsoleted. Current.
- `rfc-1812`: Proposed Standard, not obsoleted; updated by RFCs 2644 and 6633 (directed broadcast, Source Quench), which do not touch the cited sections. Current.
- `rfc-2991`: Informational, not obsoleted. Current.
- `rfc-6298`: Proposed Standard, not obsoleted. Current.
- `rfc-791`: Internet Standard (STD 5), not obsoleted; updated by RFCs 1349, 2474 and 6864 (type of service, DS field, identification field), which do not touch the cited passages. Current.
- `rfc-8085`: Best Current Practice (BCP 145), not obsoleted; updated by RFC 8899 (path MTU probing), which does not touch §3.3. Current.
- `rfc-8200`: Internet Standard (STD 86), not obsoleted; updated by RFC 9673 (Hop-by-Hop options processing), which does not touch the header addresses or fragmentation. Current.
- `rfc-8900`: Best Current Practice (BCP 230), not obsoleted. Current.
- `rfc-894`: Internet Standard (STD 41), not obsoleted. Current.
- `rfc-9110`: Internet Standard (STD 97), not obsoleted. Current.
- `rfc-9293`: Internet Standard (STD 7), not obsoleted. Current.

## Limit overrides

None.
