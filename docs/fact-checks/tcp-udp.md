```json fact-check
{
  "slug": "tcp-udp",
  "hash": "3925fac73f1872c5146e8c689b4fc006e663862ec0dfde352966998ba2d98175",
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
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Before any data\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"A lost piece\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"handshake\")": "✅",
    "units[0].steps[0].facts[0] (step \"handshake\", fact \"Messages\")": "✅",
    "units[0].steps[0].facts[1] (step \"handshake\", fact \"Costs\")": "✅",
    "units[0].steps[0].facts[2] (step \"handshake\", fact \"To\")": "✅",
    "units[0].steps[0].facts[3] (step \"handshake\", fact \"From\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-syn\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-synack\")": "✅",
    "units[0].steps[0].events[2] (event \"s1-ack\")": "✅",
    "units[0].steps[1] (step \"tcp-loss\")": "✅",
    "units[0].steps[1].facts[0] (step \"tcp-loss\", fact \"Piece 2\")": "✅",
    "units[0].steps[1].facts[1] (step \"tcp-loss\", fact \"Piece 3\")": "✅",
    "units[0].steps[1].facts[2] (step \"tcp-loss\", fact \"The ACK says\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-req\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-p1\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-g1\")": "✅",
    "units[0].steps[1].events[3] (event \"s2-p2\")": "✅",
    "units[0].steps[1].events[4] (event \"s2-p3\")": "✅",
    "units[0].steps[1].events[5] (event \"s2-g2\")": "✅",
    "units[0].steps[1].events[6] (event \"s2-g3\")": "✅",
    "units[0].steps[1].events[7] (event \"s2-ack\")": "✅",
    "units[0].steps[2] (step \"retransmission\")": "✅",
    "units[0].steps[2].facts[0] (step \"retransmission\", fact \"Sent again\")": "✅",
    "units[0].steps[2].facts[1] (step \"retransmission\", fact \"Waited\")": "✅",
    "units[0].steps[2].facts[2] (step \"retransmission\", fact \"The browser got\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-p2\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-g2\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-g3\")": "✅",
    "units[0].steps[2].events[3] (event \"s3-ack\")": "✅",
    "units[0].steps[3] (step \"udp-send\")": "✅",
    "units[0].steps[3].facts[0] (step \"udp-send\", fact \"Handshake\")": "✅",
    "units[0].steps[3].facts[1] (step \"udp-send\", fact \"Each packet\")": "✅",
    "units[0].steps[3].facts[2] (step \"udp-send\", fact \"Header\")": "✅",
    "units[0].steps[3].facts[3] (step \"udp-send\", fact \"To\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-v1\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-s1\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-g1\")": "✅",
    "units[0].steps[4] (step \"udp-loss\")": "✅",
    "units[0].steps[4].facts[0] (step \"udp-loss\", fact \"Sam’s packet 2\")": "✅",
    "units[0].steps[4].facts[1] (step \"udp-loss\", fact \"Packet 3\")": "✅",
    "units[0].steps[4].facts[2] (step \"udp-loss\", fact \"Who copes\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-s2\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-g2\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-s3\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-g3\")": "✅",
    "units[0].steps[0].deep[0] (step \"handshake\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"tcp-loss\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"retransmission\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"udp-send\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"udp-loss\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-connection\")": "✅",
    "units[0].learn.terms[1] (\"term-handshake\")": "✅",
    "units[0].learn.terms[2] (\"term-ack\")": "✅",
    "units[0].learn.terms[3] (\"term-retransmission\")": "✅",
    "units[0].learn.terms[4] (\"term-flow-control\")": "✅",
    "units[0].learn.terms[5] (\"term-connectionless\")": "✅",
    "units[0].learn.terms[6] (\"term-datagram\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-quic\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-dns\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-messages\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-defined\")": "✅",
    "units[0].learn.facts[1] (\"fact-osi\")": "✅",
    "units[0].learn.facts[2] (\"fact-two\")": "✅",
    "units[0].learn.facts[3] (\"fact-tcp-gives\")": "✅",
    "units[0].learn.facts[4] (\"fact-udp-gives\")": "✅",
    "units[0].learn.facts[5] (\"fact-setup\")": "✅",
    "units[0].learn.facts[6] (\"fact-loss\")": "✅",
    "units[0].learn.facts[7] (\"fact-resend\")": "✅",
    "units[0].learn.facts[8] (\"fact-hold\")": "✅",
    "units[0].learn.facts[9] (\"fact-lost\")": "✅",
    "units[0].learn.facts[10] (\"fact-fail\")": "✅",
    "units[0].learn.facts[11] (\"fact-used\")": "✅",
    "units[0].learn.facts[12] (\"fact-headers\")": "✅",
    "units[0].learn.facts[13] (\"fact-ports\")": "✅",
    "units[0].learn.facts[14] (\"fact-stands-for\")": "✅",
    "units[0].practice[0].options[0] (question \"drop-both\")": "✅",
    "units[0].practice[0].options[1] (question \"drop-both\")": "✅",
    "units[0].practice[0].options[2] (question \"drop-both\")": "✅",
    "units[0].practice[1].options[0] (question \"which-call\")": "✅",
    "units[0].practice[1].options[1] (question \"which-call\")": "✅",
    "units[0].practice[2].options[0] (question \"promise\")": "✅",
    "units[0].practice[2].options[1] (question \"promise\")": "✅",
    "units[0].practice[0].prompt (question \"drop-both\")": "✅",
    "units[0].practice[1].prompt (question \"which-call\")": "✅",
    "units[0].practice[2].prompt (question \"promise\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "itu-g114",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-lb",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-teams-network",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-winsock-errors",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-winsock-socket",
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
      "id": "openbsd-man-socket",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-1035",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-2914",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-3550",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-5321",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-5681",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-6298",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-7413",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-7567",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-768",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-7766",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8085",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8834",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8836",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-8985",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9000",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9112",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9114",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-959",
      "current": true,
      "checked": "2026-11-15"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-15",
    "count": 170,
    "digest": "58b7a81a555b5db7b677a24d12f7726a2c7403ecf174b7b28caa21484dd42e21",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-azure-lb": "1eb0de40f53c136d5ba1c2dcd742a39434f221d8407c31b609146a665b0188ab",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-5681": "a2d99a2421d5c57b248394f26ba44fc364aa546680fbf10ff0aa7034dad8b87d",
      "rfc-6298": "f3a6d937c0a7653bd431fdbbdcd7920f4e9d9cdb6134fa9db7a74b90d215edf6",
      "microsoft-winsock-socket": "eebeb88d4dffcd2188d34e566e6298a6e2830bd93c8a53f6a45c83c13cd6cff0",
      "rfc-768": "7dc8880e1ecef9c3f9da0db4b876a16e96bfa4f0953cc9d977d414f8f680c2f0",
      "rfc-8085": "9fc8fa172098ef296040c6e3708d56ff5941fdeda3faf4071c58c68059629f3c",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "openbsd-man-socket": "5f584eaddacb2b1a9d87335498944fc7cfa96f4fbe241c0ca1fdd17d23a25a6b",
      "nist-sp800-77r1": "2343fd37c8cf23a8bfb594b481a867298f4177adf3146228bd365d2b9affe30e",
      "rfc-7413": "ea094553d58f53df919071b597d3dd0ac1ab512e297271a89463101f8bf6eb16",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937",
      "rfc-5321": "7d560eddff1b213c17d4e1e5f95005728b2f05bc2b3947f0fcc91717c6707634",
      "rfc-959": "e2eb01566e64c12ed75a0c4bd02231e62f91eebb86f596abc40999d5e8bc5a91",
      "itu-g114": "f7d4ae1fa6cc519010cb24985c52de6684de079a0ee7b2e7e4d576ab960c9c62",
      "rfc-8836": "b124b69c5f067cabac4beac23c55dc1cae15be94b802a66f1649db64b01056a6",
      "rfc-8834": "8bc95ea7e25f350adb265457b4c700357a47285b8d2931654b72db8cbc78b630",
      "rfc-3550": "4c210e9434b5b4c029e8536ad8991f3709bc3cbfa0999e951bcb4c2143c539e8",
      "microsoft-teams-network": "b2da2b410ab4424d89123f34091e2339cd65059de42b59f8e7098a15ea96e8df",
      "rfc-9000": "f88aae47f8b18e102024916e975e919201d8dde689cba79b01079eaedd402e22",
      "rfc-9114": "6b84555c88eeebcf5d2b2e1d9d7b58630abc97ab877b2cf62dee4cd635db34e4",
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-7766": "9fbf70d43e5c423c2464eafd724ef164490b4d8e341e5d9b5fe1023402bb404f",
      "rfc-7567": "7bf81566611e1d8c8c917d9fa3c8771f50555514a1b9d8320df8428b70f6a621",
      "rfc-2914": "9fcf305067fd0075887028e8975bb8f6b1e451d1e9ba474d7e840c6dec2ddd38",
      "rfc-8985": "5b947b1dad18d60ed4550e36e0f474d1678412a413b4664feb5d1428e27d7c5f",
      "microsoft-winsock-errors": "0df4971a3128d0a9402b9a0ced9f538aed2bfe631b41e2381f3b6c0373e0d355",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a"
    }
  },
  "items": {
    "title": "0260e252347a6f0ab0e3b36c6e19f5ce10bb66ee57fce12c09b2c191106dd082",
    "units[0].name": "4f2517e84cffd0225f1cca9af2b0ab8b103e49d076c7d71377f504e3354414f6",
    "units[0].osi": "67a9474ff9c7da33e6e84ef272bb21c077c2e15f8beeac6d6a185202305c786f",
    "backing (the lesson's subtitle and summary)": "272e3b3f1b47654fe79e9b082248eabee3bed57339937a33d3691ec2f0b37429",
    "units[0].backing (the unit's full name and purpose)": "ee93906a44fc74f1fb06c01ac9e4965ae7aefdbaa2f4f93bdc95bfd3b56fec18",
    "units[0].scene.backing (the scene)": "f160a91fd2fcb8b1febac11f40dfc371d63b9f9c23b7f33be870e0bdfc732e23",
    "units[0].overview.hookBacking (the Overview hook)": "3c7b951340fe70990c67a6fbab5969edc052c3c0d0a3d3fdfdd34aa008c5e8f1",
    "units[0].overview.backing (the Overview description)": "6bed5735e068083168d14527c9d221c5dfdd9c7a4fc8367242e789fae3fad81b",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "cccfb23a9b40ea292a3dfa05ffa5d6cd9436eb478b89d2184bc7ec81dfc98370",
    "units[0].overview.facts[1] (Overview fact \"Before any data\")": "f9663687bbf8a07f94b792cea7c08779e901c95fc7deb5498ede3fa594f598bb",
    "units[0].overview.facts[2] (Overview fact \"A lost piece\")": "a7812a87b1d2e2b364ced061c36e6853873b27006dbdb2d8979a03167e344d6a",
    "units[0].overview.facts[3] (Overview fact \"OSI layer\")": "3f861a6d8711476da134030d36d622d02514a6d182d7f8ea9887bb332775704e",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "92c5a9996e29841d410a1e7d092d87e3c7ff46ed8a5c149dc0015fdf2db51760",
    "units[0].steps[0] (step \"handshake\")": "c856e37dc2fc0eea2da913b8696629568d295966366d2deb30483806e3b1d124",
    "units[0].steps[0].facts[0] (step \"handshake\", fact \"Messages\")": "21f91cb4dbd93e8e98ea9db7e161309e50369fc6aa9c137dcf54dedf482139a9",
    "units[0].steps[0].facts[1] (step \"handshake\", fact \"Costs\")": "bb38fc5e2b8d8c9427cb22b0ad7ca59d4f303d4ced1cb94380ca874c3a008296",
    "units[0].steps[0].facts[2] (step \"handshake\", fact \"To\")": "eddc30e00674b085589b3c0b23b20af8b679e702914e4d4c69c97cce3a51724c",
    "units[0].steps[0].facts[3] (step \"handshake\", fact \"From\")": "6f1c1e6472f5da26085f44fd25eebdc0fdc5babe5bb8c959737222b21c1cf4af",
    "units[0].steps[0].events[0] (event \"s1-syn\")": "0805d297fc235fd4afa83d97e82d910d636ffc7818942c5f8b458df1adae09f1",
    "units[0].steps[0].events[1] (event \"s1-synack\")": "4c20d99044defe2e80380f846ad81732915f2c2fb42b759f7e8ba2dce19e6d8c",
    "units[0].steps[0].events[2] (event \"s1-ack\")": "4de12e9b77820b11499b3eab3d75719ae035b20e4a72ce1d8298bebbf4689adb",
    "units[0].steps[1] (step \"tcp-loss\")": "f3348c6d90f3665b62aa08a43401a677c2cac7b3f42062973e32a943b908afd7",
    "units[0].steps[1].facts[0] (step \"tcp-loss\", fact \"Piece 2\")": "155433623e1ed673f88c6e2b96c33c25ccfaff84efe7108d6e5aff42380f5b20",
    "units[0].steps[1].facts[1] (step \"tcp-loss\", fact \"Piece 3\")": "1a57ae50499d7144685c0203d44849ac64eb25b6917c1c11b575f62620b7511a",
    "units[0].steps[1].facts[2] (step \"tcp-loss\", fact \"The ACK says\")": "627b01ab1e9130485ca5bd77f5e1a8e5837a814e0c8e6018ce937d421c504a3a",
    "units[0].steps[1].events[0] (event \"s2-req\")": "705d339b5ceaca0d098d86460bc6b108950197dd4943fe3ec8f4c62ef7557472",
    "units[0].steps[1].events[1] (event \"s2-p1\")": "f05b4d22ee6683191a10ecc82a09ef16cd5c51e8dd1a0c5b981d2d88766e9690",
    "units[0].steps[1].events[2] (event \"s2-g1\")": "f99f16dd1230eb99405b39ec6d181ad4e6fa52b7b511986439cd09ff584f8a0e",
    "units[0].steps[1].events[3] (event \"s2-p2\")": "e46b28877e0f4361301c633390dbc9ae0931464f34066bf12bce4c22f4a286f8",
    "units[0].steps[1].events[4] (event \"s2-p3\")": "588c7ff2815585741e0b98d0d49d59b1c5c429f5613d739da4d3ab1bdd7fcda6",
    "units[0].steps[1].events[5] (event \"s2-g2\")": "fad040164f2c10f7c62cf251c6e6251cf0143e27542fc3901b4db97dcdcacc1d",
    "units[0].steps[1].events[6] (event \"s2-g3\")": "9d756e4196cbe40c4ae9427df584dc5d50a314e1a124715dab6f75bb125abcf1",
    "units[0].steps[1].events[7] (event \"s2-ack\")": "e386700e6cafd0898cad48b27218bdc46405dd011b50b9dab052729a556b84b1",
    "units[0].steps[2] (step \"retransmission\")": "7ce0389ac4a70abdc4b7258b0074b69ac8d1fa97b48c97548086df7dbbbb7f21",
    "units[0].steps[2].facts[0] (step \"retransmission\", fact \"Sent again\")": "614c76982d9be499482bcd25e2ba1133d4859cbb68ff9045c556daae88c4b208",
    "units[0].steps[2].facts[1] (step \"retransmission\", fact \"Waited\")": "1123948630b098ed26f1041ba25e232d1cfcf1e669ae4749c224539d80eece14",
    "units[0].steps[2].facts[2] (step \"retransmission\", fact \"The browser got\")": "7e27cfbb9ba0258d9e105444c1faf404d1554f77cfbb3d915ad918d323c91077",
    "units[0].steps[2].events[0] (event \"s3-p2\")": "0b3eeb0ed612fea24a3b502ca6631737c84fbbb827cea732e6875d40836936a1",
    "units[0].steps[2].events[1] (event \"s3-g2\")": "587ec94d28601b6bfb6dedbc3b0f0db67c64e8d68dd7c951b9d08d869b3babc6",
    "units[0].steps[2].events[2] (event \"s3-g3\")": "6ae2b9644c6a7a95a1c143d08e609df3642d975a4522819e360a09c862043f07",
    "units[0].steps[2].events[3] (event \"s3-ack\")": "ee9187ab993eb89a4183086713ceefe02f848be57635f543037082b332c71dd5",
    "units[0].steps[3] (step \"udp-send\")": "b23226394f9c02ac3f61d104bad7496bb80527933aab7b2734a9b9c17d655182",
    "units[0].steps[3].facts[0] (step \"udp-send\", fact \"Handshake\")": "15a0cbefe8fb53b80235d6f6851aa9f80e99a6bcee980fa55aa22b4f186cd0e2",
    "units[0].steps[3].facts[1] (step \"udp-send\", fact \"Each packet\")": "82a29d6db711daaee9c904f647ad979d0fd2bb996f2b8de2b4f5bc42b7cd1a75",
    "units[0].steps[3].facts[2] (step \"udp-send\", fact \"Header\")": "5bd7ee68bf109c678547210ca3e04cfb28c6039ccfb9fabad4804100f0ffe14e",
    "units[0].steps[3].facts[3] (step \"udp-send\", fact \"To\")": "ef6d2d0147e34aa6dfd4d5a037e379e7f87115a2dfb1730ba8cecdde9e265d75",
    "units[0].steps[3].events[0] (event \"s4-v1\")": "2fa54a41bd35f15a3f609313181d6772bcc6a81d2419c400548722316e2ef0c0",
    "units[0].steps[3].events[1] (event \"s4-s1\")": "6b70991d377f3e228a783097fc54d0195800241a4f786be3b406841c15a3f02c",
    "units[0].steps[3].events[2] (event \"s4-g1\")": "0c3bb72f56718485cd529bbf2af335bd247241eebee3bd673efbb38d01760ace",
    "units[0].steps[4] (step \"udp-loss\")": "22e70be9ce8a1a83cf7963e45ca4b3776f2ea1994ba5726ae7e4218ba9880475",
    "units[0].steps[4].facts[0] (step \"udp-loss\", fact \"Sam’s packet 2\")": "8afc5dcf2c3cf4dfe76eb99da6e22bd2096c8a5153cb22e8082105bc10e1e503",
    "units[0].steps[4].facts[1] (step \"udp-loss\", fact \"Packet 3\")": "9c446b0f131337bb606beaedf12d222038ae0ea711da84b66cffcc9b1919ef53",
    "units[0].steps[4].facts[2] (step \"udp-loss\", fact \"Who copes\")": "c8cd472469362fe7957e39d8f88136785fcb6ceb5023c37565b8da1721be0e67",
    "units[0].steps[4].events[0] (event \"s5-s2\")": "51adf0464f685793f1fa4bf99ccf2987456cfa10a00b5dcd6e805767abc6e332",
    "units[0].steps[4].events[1] (event \"s5-g2\")": "77c773c90904f3f9437105d591f6e0d9f67e57b138736236ebe14ed2859722e3",
    "units[0].steps[4].events[2] (event \"s5-s3\")": "3eed721823a694829b68d1eca00f7fae4e15012deec5a9bf310a0f98ea35e0b6",
    "units[0].steps[4].events[3] (event \"s5-g3\")": "b523d2fb4d422b37d67beca67a4e4cd110cc32948a7b3aa4af2ad18232c31587",
    "units[0].steps[0].deep[0] (step \"handshake\", Go deeper)": "e7fa4b79e776a1b831dd365564f560d3dae4e9efdb3c436832a2fcee7380ef22",
    "units[0].steps[1].deep[0] (step \"tcp-loss\", Go deeper)": "10f48f6e59f5f316dfb4566b4d0d86bf43ff1ba89803aa92feb71e9cd5e18b5c",
    "units[0].steps[2].deep[0] (step \"retransmission\", Go deeper)": "d495bc379c2f0896c7d0583aa4b9f795bb7879d476316b3863e3a6bac8de0340",
    "units[0].steps[3].deep[0] (step \"udp-send\", Go deeper)": "5c162253f0a911a3b1915abac7a70ddf064416c277a5574f3eb916633cb35d81",
    "units[0].steps[4].deep[0] (step \"udp-loss\", Go deeper)": "ba7d12238dfa1d29e116bc0bdf789e7e183e34539d43944a8e1b73c176f5365c",
    "units[0].learn.lead[0] (\"lead-1\")": "da81f99b17a7db047a0e8fda44a61b7b7d3d9373f57c47107b9e486e74c09eb0",
    "units[0].learn.lead[1] (\"lead-2\")": "9accc7728610d84b9f95f460b73add5f4ed69538b6d16362a30b0b08e2aceaf4",
    "units[0].learn.terms[0] (\"term-connection\")": "e5012d2a3cfa62878d00a3ddd0bcc75a4267263c9436dd2aacf1f5bb2ee7cd2d",
    "units[0].learn.terms[1] (\"term-handshake\")": "928283fa12e2a94c5433824ad45e86d7127a1e7e3f047ca8c70b12c05c3439c5",
    "units[0].learn.terms[2] (\"term-ack\")": "27f76faeea078ac1cdb2c9e4e0f9dcc2ff56f0bef2a7372dd76a988288435662",
    "units[0].learn.terms[3] (\"term-retransmission\")": "245236c87a2dad850cb538ca16eef27dff2742c3ddb7ce5f0fc9ed254ba9a72f",
    "units[0].learn.terms[4] (\"term-flow-control\")": "e18ca050c89d9b8251066eb6a4f9911b7c700ba75544128753f1054c496feea6",
    "units[0].learn.terms[5] (\"term-connectionless\")": "48b646c0564d3ffb20b047c84aed763843624d7a02961d3667941a6aec5a4bc1",
    "units[0].learn.terms[6] (\"term-datagram\")": "459ab2e052cc402cd6bf1bd0323414bfc20fb48d5ecad451fd2d159a6606306f",
    "units[0].learn.pattern (\"pattern\")": "216445d73030926d6d090a657dfa2f56693f0a4758a7f59804a69524cc08c56a",
    "units[0].learn.why[0] (\"why-1\")": "dc7a90a075a91f7478da2e28e3aa8db8042da2dc37c74560197bb6302e804ff1",
    "units[0].learn.why[1] (\"why-2\")": "d199a65f9a25442a9ee9760b97ff9b424b4dd43f345fb3b7eea4d05031e9241c",
    "units[0].learn.deep[0] (\"deep-quic\", Learn's Go deeper)": "02dea95e412e9636821c0738d21a9be44d7aaaab698556262cf4e67bd64b70e0",
    "units[0].learn.deep[1] (\"deep-dns\", Learn's Go deeper)": "38298cbb7715da36b42fb5fc5bd96ead317f2dab22419eb45aa1300521247127",
    "units[0].learn.deep[2] (\"deep-messages\", Learn's Go deeper)": "699c8279ec2dbb54edf6690e79449201c67727293c8bd2234ab90907575dced6",
    "units[0].learn.facts[0] (\"fact-defined\")": "1747bf649e7ff2094a66447b0a0cb9ce05f9a42ff618cf7d7aceb85b0f4bfe1f",
    "units[0].learn.facts[1] (\"fact-osi\")": "f9bb668d0b1b8b1f68c978d99d04efa06475bc014a81886d43dea17b2b41f1e8",
    "units[0].learn.facts[2] (\"fact-two\")": "e208de24190aa2bafdb842d685f4162c537d5ba9b149bfab1cf4a9e3b3fb99ae",
    "units[0].learn.facts[3] (\"fact-tcp-gives\")": "70b9510bf9130024f4f72559f9fce148d57f5c795c54696f8deb7c41bf64403d",
    "units[0].learn.facts[4] (\"fact-udp-gives\")": "5f48b74704aac3d31d4c6d7bf2164dac38aa47b9368d46739d0956a65b630537",
    "units[0].learn.facts[5] (\"fact-setup\")": "bbe67571ebcba730b18a0b126bfe6a5752cf5e026aed6c73cca2835fdf5b9867",
    "units[0].learn.facts[6] (\"fact-loss\")": "3df88e2c83d0b33b2f8d8833ded2bb4597c2725e5dc0ef61c400b0b622ab11a5",
    "units[0].learn.facts[7] (\"fact-resend\")": "55d0a5136c470c6ec4a61b48692398539419b6dea77b4da2c358233194bb6539",
    "units[0].learn.facts[8] (\"fact-hold\")": "e7f58b0b1509c9f3846c6b47e83c8b387f74c577432d52b344b2d8f54b66c078",
    "units[0].learn.facts[9] (\"fact-lost\")": "919f17944b018948e105eb1ff3418f4d8cfff150433e78f978dfe9a64b62a71c",
    "units[0].learn.facts[10] (\"fact-fail\")": "debea40dece72eae52c5ed8a57a68d55038688c1dc6c65b6e2d6eca00a531909",
    "units[0].learn.facts[11] (\"fact-used\")": "63784b95e8cf1addba1894675402409530b393838d11727b5727f514c3afbf83",
    "units[0].learn.facts[12] (\"fact-headers\")": "6cb51d4efcc2e74aadad4b20539a2def8d7598e8908c2424e96a10599d42fb15",
    "units[0].learn.facts[13] (\"fact-ports\")": "c0f07e0cc5b58a4de8b3953bec3b031cc88330a68fc83d59c77cc512ae60ef5b",
    "units[0].learn.facts[14] (\"fact-stands-for\")": "0db237e7c92bf1b7460b1afb1c98949305d7c3b9b87a89e44ef990c7d2ea25ec",
    "units[0].practice[0].options[0] (question \"drop-both\")": "895bcaa9c21de18b8d7e670996c14438d28f5885a493f0f1dd86a8739191f4b9",
    "units[0].practice[0].options[1] (question \"drop-both\")": "de813d13dc06c71204e4e4cd406c32ae75cb38742deaa794e590356a55a3cbf5",
    "units[0].practice[0].options[2] (question \"drop-both\")": "1b3e5a428997b0669e51d5a5ec49df7c0bc616ccceffdd21f2eb337d516d6a12",
    "units[0].practice[1].options[0] (question \"which-call\")": "79632172e15b55c828976a31fb6dd347dd12cec93aa314575d9a08771c371af2",
    "units[0].practice[1].options[1] (question \"which-call\")": "bbb5394ed2bad3d7f73dddc72c6584b48319a1ffaa9a8c05ab4bd39a505acf1f",
    "units[0].practice[2].options[0] (question \"promise\")": "3f9758d48f34e99f6bc7fb531819e0064c2061c1fa28c6faf263b0a491a267de",
    "units[0].practice[2].options[1] (question \"promise\")": "be2bb40f086b2920cc9c6ba7995d89b0498ebd849be9493edd2ddf5ac4109183",
    "units[0].practice[0].prompt (question \"drop-both\")": "a88800b9ca3ef0de0de5d3498549cef95c66c3edd7474bdb0623a15d2ef1c5ac",
    "units[0].practice[1].prompt (question \"which-call\")": "1eaac6b15c96db6ec17b49a2ef340eda076325f570d44813555bc83687439243",
    "units[0].practice[2].prompt (question \"promise\")": "a445425ad320a564f4619e98278c34b90318b7c26a1b04f47a727376af6f799f"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: tcp-udp

## Claims

### units[0].osi — ✅

Layers: 4.

- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer TCP/UDP
- `microsoft-azure-lb` §Introduction
  > Use Azure Load Balancer when you need to distribute Layer 4 TCP or UDP traffic across VMs or virtual machine scale sets.
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- Note: Cloudflare's OSI table lists TCP/UDP in the transport layer row, layer 4, and Microsoft's page calls TCP and UDP traffic Layer 4 traffic, for a service it says works at OSI layer 4. Two vendors on their own sites, independent of each other.
- Note: Currency: both pages are live (checked 2026-11-15); Cloudflare's says it was last updated in October 2026. The Azure page reports only that the Basic SKU was retired, which does not touch this claim.

### units[0].steps[0].deep[0] (step "handshake", Go deeper) — ✅

SYN means synchronize: each side tells the other the number its bytes start from, and the other acknowledges it.

- `rfc-9293` §3.5
  > In line 2 of Figure 6, TCP Peer A begins by sending a SYN segment indicating that it will use sequence numbers starting with sequence number 100.
- `rfc-9293` §3.4.1
  > This is done in an exchange of connection-establishing segments carrying a control bit called "SYN" (for synchronize) and the initial sequence numbers.
  > …
  > The synchronization requires each side to send its own initial sequence number and to receive a confirmation of it in acknowledgment from the remote TCP peer.
- Note: RFC 9293 is the current defining standard for TCP, its handshake (§3.5) and its initial sequence numbers (§3.4.1). It is an Internet Standard, not obsoleted.
- Note: "the number its bytes start from" is the initial sequence number; strictly the first data byte is numbered one after it, a detail a beginner can leave out.

### units[0].steps[1].deep[0] (step "tcp-loss", Go deeper) — ✅

An ACK names the next byte the laptop expects. While piece 2 is missing, every ACK names the same byte, which tells the server a piece is missing.

- `rfc-9293` §3.4
  > SEG.ACK = acknowledgment from the receiving TCP peer (next sequence number expected by the receiving TCP peer)
- `rfc-5681` §3.2
  > A TCP receiver SHOULD send an immediate duplicate ACK when an out-of-order segment arrives. The purpose of this ACK is to inform the sender that a segment was received out-of-order and which sequence number is expected.
  > …
  > In this case, all segments after the dropped segment will trigger duplicate ACKs until the loss is repaired.
- Note: RFC 9293 defines TCP's acknowledgement number; RFC 5681 is the current Standards Track definition of fast retransmit and its duplicate ACKs. RFC 5681 is updated only by RFC 9438 (CUBIC), which concerns window growth, not duplicate ACKs.
- Note: Leaves out that the sender waits for three duplicate ACKs, and that reordering can also cause them.

### units[0].steps[2].deep[0] (step "retransmission", Go deeper) — ✅

If no ACK came back at all, the server's timer would run out and it would send the piece again anyway. And if the other end never answered, TCP would give up after a while and tell the app the connection failed.

- `rfc-6298` §5
  > When the retransmission timer expires, do the following:
  > …
  > Retransmit the earliest segment that has not been acknowledged by the TCP receiver.
- `rfc-9293` §3.8.3
  > When the number of transmissions of the same segment reaches a threshold R2 greater than R1, close the connection.
  > …
  > TCP implementations SHOULD inform the application of the delivery problem
- `microsoft-winsock-socket` §Remarks
  > If data for which the peer protocol has buffer space cannot be successfully transmitted within a reasonable length of time, the connection is considered broken and subsequent calls will fail with the error code set to
- Note: RFC 6298 is the current definition of TCP's retransmission timer (not obsoleted); RFC 9293 §3.8.3 defines how TCP handles excessive retransmission. Microsoft's Winsock page confirms the failure reaches the app as an error.
- Note: Leaves out that an app may set the give-up threshold to infinity (RFC 9293 §3.8.3 (d)); the ordinary case is as stated.

### units[0].steps[3].deep[0] (step "udp-send", Go deeper) — ✅

UDP's header is four 2-byte fields: source port, destination port, length and checksum. There's no sequence number, no ACK and no window.

- `rfc-768` §Fields
  > Length is the length in octets of this user datagram including this header and the data. (This means the minimum value of the length is eight.)
  > …
  > Checksum is the 16-bit one's complement of the one's complement sum of a pseudo header
- `rfc-9293` §3.1
  > Sequence Number: 32 bits
  > …
  > Acknowledgment Number: 32 bits
  > …
  > Window: 16 bits
- Note: RFC 768 defines UDP's header. Its Format figure shows exactly four fields, Source Port, Destination Port, Length and Checksum, each 16 bits wide, in an eight-byte header; RFC 9293 §3.1 defines the TCP fields that UDP's list lacks.
- Note: RFC 768 is not obsoleted. Its one update, RFC 9868 (UDP options), puts options in a surplus area after the user data and leaves the eight-byte header unchanged.

### units[0].steps[4].deep[0] (step "udp-loss", Go deeper) — ✅

UDP also has no congestion control, so it is up to the app to keep from overloading the network.

- `rfc-8085` §1
  > Because UDP itself provides no congestion control mechanisms, it is up to the applications that use UDP for Internet communication to employ suitable mechanisms to prevent congestion collapse and establish a degree of fairness.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery, packetization and reassembly, flow control, congestion avoidance, etc., when these are required.
- Note: Two independent RFCs (a Best Current Practice and an Internet Standard), each stating the claim. RFC 8085 is updated only by RFC 8899 (path MTU discovery); RFC 1122 is updated, for TCP, by RFC 9293 and RFC 6298, which leave its UDP section unchanged. Neither is obsoleted.

### units[0].learn.lead[0] ("lead-1") — ✅

TCP and UDP both carry an app's data from port to port. TCP sets up a connection, numbers the bytes and sends again whatever is lost, so the app gets every byte in order, or hears that the connection failed. UDP just sends each message on its own: no setup, no resending.

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
  > …
  > TCP is connection oriented
  > …
  > TCP uses port numbers to identify application services and to multiplex distinct flows between hosts.
- `rfc-9293` §3.4
  > A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number.
- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-9293` §3.8.3
  > When the number of transmissions of the same segment reaches a threshold R2 greater than R1, close the connection.
- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism. The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
- `rfc-8085` §1
  > UDP and its UDP-Lite variant [RFC3828] are unique in that they do not establish end-to-end connections between communicating end systems.
- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.
- `microsoft-winsock-socket` §Parameters
  > A socket type that provides sequenced, reliable, two-way, connection-based byte streams with an OOB data transmission mechanism. This socket type uses the Transmission Control Protocol (TCP) for the Internet address family (AF_INET or AF_INET6).
- `microsoft-winsock-socket` §Remarks
  > the connection is considered broken and subsequent calls will fail with the error code set to
- `openbsd-man-socket` §DESCRIPTION
  > SOCK_DGRAM socket supports datagrams (connectionless, unreliable messages of a fixed (typically small) maximum length).
- Note: RFC 9293 defines TCP and RFC 768 defines UDP; both are current. Each part is also stated by a second independent source (RFC 8085, Microsoft's and OpenBSD's socket pages).
- Note: "or hears that the connection failed" passes for the ordinary case; RFC 9293 makes telling the app a SHOULD.

### units[0].learn.terms[0] ("term-connection") — ✅

Connection: An agreed two-way line, set up before any data moves.

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a connection.
- `rfc-9293` §2.2
  > Data flow is supported bidirectionally over TCP connections
- `microsoft-winsock-socket` §Remarks
  > Connection-oriented sockets such as SOCK_STREAM provide full-duplex connections, and must be in a connected state before any data can be sent or received on it.
- `openbsd-man-socket` §DESCRIPTION
  > A stream socket must be in a connected state before any data may be sent or received on it.
- Note: RFC 9293 defines TCP's connection and its setup. Two vendors confirm the two-way, set-up-first idea.
- Note: Leaves out that a SYN may carry data that is held until the connection is set up (RFC 9293 §3.5, and TCP Fast Open); the ordinary case is as stated.

### units[0].learn.terms[1] ("term-handshake") — ✅

Three-way handshake: Hello, hello back, OK.

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a connection.
  > …
  > In line 3, TCP Peer B sends a SYN and acknowledges the SYN it received from TCP Peer A.
  > …
  > At line 4, TCP Peer A responds with an empty segment containing an ACK for TCP Peer B's SYN
- Note: RFC 9293 §3.5 is the current definition of TCP's three-way handshake. "Hello, hello back, OK" puts SYN, SYN-ACK and ACK in everyday words.

### units[0].learn.terms[2] ("term-ack") — ✅

Acknowledgement (ACK): "Got everything up to here".

- `rfc-9293` §3.4
  > The acknowledgment mechanism employed is cumulative so that an acknowledgment of sequence number X indicates that all octets up to but not including X have been received.
- `rfc-9293` §3.1
  > If the ACK control bit is set, this field contains the value of the next sequence number the sender of the segment is expecting to receive.
- Note: RFC 9293 defines TCP's cumulative acknowledgement.

### units[0].learn.terms[3] ("term-retransmission") — ✅

Retransmission: Sending a lost piece again.

- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-9293` §2.2
  > TCP reliability consists of detecting packet losses (via sequence numbers) and errors (via per-segment checksums), as well as correction via retransmission.
- Note: RFC 9293 defines TCP's retransmission.

### units[0].learn.terms[4] ("term-flow-control") — ✅

Flow control: The receiver saying how much more it can take.

- `rfc-9293` §3.8.6
  > The window sent in each segment indicates the range of sequence numbers the sender of the window (the data receiver) is currently prepared to accept.
- `rfc-1122` §1.1.3
  > TCP is a reliable connection-oriented transport service that provides end-to-end reliability, resequencing, and flow control.
- Note: RFC 9293 §3.8.6 defines TCP's receive window, the mechanism of flow control; RFC 1122 names it flow control.

### units[0].learn.terms[5] ("term-connectionless") — ✅

Connectionless: Sending with no setup first.

- `rfc-8085` §1
  > UDP and its UDP-Lite variant [RFC3828] are unique in that they do not establish end-to-end connections between communicating end systems. UDP communication consequently does not incur connection establishment and teardown overheads
- `nist-sp800-77r1` §2.1
  > TCP, which provides reliable connection-oriented communications, and the User Datagram Protocol (UDP), which provides unreliable connectionless communications, are commonly used transport layer protocols.
- `rfc-1122` §1.1.3
  > UDP is a connectionless ("datagram") transport service.
- `microsoft-winsock-socket` §Parameters
  > A socket type that supports datagrams, which are connectionless, unreliable buffers of a fixed (typically small) maximum length.
- Note: RFC 8085 states the meaning outright: no connection is set up. RFC 1122, NIST and Microsoft each call UDP connectionless, in contrast to TCP's connection-oriented service, which is the plain sense of the word. NIST SP 800-77 Rev. 1 is the current final revision.

### units[0].learn.terms[6] ("term-datagram") — ✅

Datagram: One message that travels on its own.

- `rfc-768` §Introduction
  > This User Datagram Protocol (UDP) is defined to make available a datagram mode of packet-switched computer communication
  > …
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- `microsoft-winsock-socket` §Parameters
  > A socket type that supports datagrams, which are connectionless, unreliable buffers of a fixed (typically small) maximum length.
- `openbsd-man-socket` §DESCRIPTION
  > SOCK_DGRAM socket supports datagrams (connectionless, unreliable messages of a fixed (typically small) maximum length).
- Note: RFC 768 defines UDP's datagram service. OpenBSD's page calls a datagram a connectionless message, which "travels on its own" puts in a beginner's words.

### units[0].learn.pattern ("pattern") — ✅

Names: TCP: set up a connection; TCP: acknowledge; TCP: resend what's lost; UDP: just send; UDP: the app copes. Note: What each does, in the order this lesson shows it. TCP resends only when a piece is lost.

- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a connection.
- `rfc-9293` §3.4
  > Since every octet is sequenced, each of them can be acknowledged.
- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- `rfc-8085` §3.3
  > Applications that do require reliable message delivery MUST implement an appropriate mechanism themselves.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled
- Note: RFC 9293 defines TCP's steps and RFC 768 defines UDP; RFC 8085 and RFC 1122 confirm that the app copes.
- Note: "TCP resends only when a piece is lost" is meant to say that resending is not a step every piece goes through. It leaves out the rarer resend that happens when TCP wrongly thinks a piece is lost (a lost ACK or reordering).

### units[0].learn.why[0] ("why-1") — ✅

Apps that need every byte, in order, such as a web page, an email or a file, usually use TCP. They pay with a round trip to set up, and a wait whenever a piece is lost.

- `rfc-768` §Introduction
  > Applications requiring ordered reliable delivery of streams of data should use the Transmission Control Protocol (TCP) [2].
- `rfc-8085` §3.3
  > an application that requires reliable and ordered message delivery SHOULD whenever possible choose an IETF standard transport protocol that provides these features.
- `rfc-7413` §1
  > Current TCP only permits data exchange after the three-way handshake (3WHS) [RFC793], which adds one RTT to network latency.
- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- `nist-sp800-41r1` §4.1.3
  > For example, although SMTP uses TCP port 25 for sending mail, it uses TCP port 587 for mail submission.
- `rfc-9112` §9
  > the "http" URI scheme (Section 4.2.1 of [HTTP]) indicates a default connection of TCP over IP, with a default TCP port of 80
- `rfc-5321` §4.5.4.2
  > This requires the support of multiple incoming TCP connections for SMTP.
- `rfc-959` §8
  > The FTP control connection is established via TCP between the user process port U and the server process port L.
- Note: The defining standards for UDP (RFC 768, which itself points apps that need ordered reliable delivery to TCP), TCP (RFC 9293), HTTP/1.1 (RFC 9112), SMTP (RFC 5321) and FTP (RFC 959) each state their part; RFC 8085 and NIST SP 800-41 Rev. 1 confirm independently.
- Note: RFC 7413 is an Experimental RFC, not obsoleted, cited for the round trip it describes. "usually" covers web pages over HTTP/3, which the lesson treats separately; TCP Fast Open, which can save the setup round trip, is left out.

### units[0].learn.why[1] ("why-2") — ✅

Apps for which late is as bad as lost, such as a call, often use UDP. A resend would only help if it arrived in time to be played. UDP resends nothing and holds nothing back, and the app deals with whatever else it needs itself.

- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.
  > …
  > Applications that require ordered delivery MUST reestablish datagram ordering themselves.
- `rfc-1122` §4.1.1
  > gives applications direct access to the datagram service of the IP layer
- `itu-g114` §Annex A.3
  > If the delivery time of a packet exceeds the length of the
  > receive buffer, then this packet "arrives too late" with respect to its intended play-out time, and will
  > be discarded. Consequently, the speech carried in this packet is lost for the decoding process.
- `rfc-8836` §1
  > since it's consumed in real time, data delivered late is commonly useless.
- `rfc-8834` §6.1
  > Retransmission needs to be used with care in interactive real-time applications to ensure that the retransmitted packet arrives in time to be useful
- `rfc-3550` §1
  > Applications typically run RTP on top of UDP to make use of its multiplexing and checksum services
- `microsoft-teams-network` §Network optimization
  > Teams media prefers UDP ports 3478-3481.
- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- Note: "late is as bad as lost" is stated by ITU-T G.114 (in force) and RFC 8836; calls over UDP by RFC 3550 and Microsoft Teams; a resend helping only when in time by RFC 8834; UDP's lack of resending and ordering by RFC 8085 and RFC 1122. RFC 9293 (defining TCP) shows the holding back UDP does not do.

### units[0].learn.deep[0] ("deep-quic", Learn's Go deeper) — ✅

QUIC, which carries HTTP/3, runs over UDP and does its own acknowledgements and resending, so a lost packet holds up only the streams whose data it carried.

- `rfc-9000` §1
  > QUIC packets are carried in UDP datagrams [UDP] to better facilitate deployment in existing systems and networks.
  > …
  > QUIC provides the necessary feedback to implement reliable delivery and congestion control.
- `rfc-9000` §13
  > When a packet loss occurs, only streams with data in that packet are blocked waiting for a retransmission to be received, while other streams can continue making progress.
- `rfc-9114` §1.2
  > This document defines HTTP/3: a mapping of HTTP semantics over the QUIC transport protocol
- Note: RFC 9000 is the current defining standard for QUIC version 1; RFC 9114 defines HTTP/3. Neither is obsoleted.

### units[0].learn.deep[1] ("deep-dns", Learn's Go deeper) — ✅

DNS asks over UDP and asks again if no answer comes. It uses TCP too, for big answers and for copying whole zones.

- `rfc-1035` §4.2
  > datagrams are preferred for queries due to their lower overhead and better performance. Zone refresh activities must use virtual circuits because of the need for reliable transfer.
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method for standard queries in the Internet. Queries sent using UDP may be lost, and hence a retransmission strategy is required.
- `rfc-7766` §5
  > Authoritative server implementations MUST support TCP so that they do not limit the size of responses to what fits in a single UDP packet.
- `nist-sp800-41r1` §4.1.3
  > DNS lookups can occur on UDP port 53 or TCP port 53.
- Note: RFC 1035 defines DNS transport and is not obsoleted. RFC 7766, which updates it, also lets a resolver use TCP first, a less common case that the claim leaves out.

### units[0].learn.deep[2] ("deep-messages", Learn's Go deeper) — ✅

UDP keeps each message whole. TCP is one stream of bytes, so it may split or join what the app wrote.

- `rfc-9293` §3.7
  > Individual TCP segments often do not correspond one-for-one to individual send (or socket write) calls from the application.
  > …
  > TCP guarantees no correlation between the boundaries of TCP segments sent and received and the boundaries of the read or write buffers of user application data.
- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- `rfc-8085` §1
  > A UDP datagram is carried in a single IP packet
- `openbsd-man-socket` §DESCRIPTION
  > Datagrams are generally received with recvfrom(2), which returns the next datagram with its return address.
- Note: RFC 9293 defines TCP's segmentation; RFC 768 defines UDP as message-based. RFC 8085 and OpenBSD confirm a datagram goes and comes back as one unit.

### units[0].learn.facts[0] ("fact-defined") — ✅

Defined in: RFC 9293 (TCP) and RFC 768 (UDP).

- `rfc-9293` §Abstract
  > This document specifies the Transmission Control Protocol (TCP).
- `rfc-768` §Introduction
  > This User Datagram Protocol (UDP) is defined to make available a datagram mode of packet-switched computer communication
- Note: Each is the current defining document: RFC 9293 obsoletes RFC 793 and is not itself obsoleted; RFC 768 is not obsoleted (updated by RFC 9868, which adds options).

### units[0].learn.facts[1] ("fact-osi") — ✅

OSI layer: 4, transport.

- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer TCP/UDP
- `microsoft-azure-lb` §Introduction
  > Use Azure Load Balancer when you need to distribute Layer 4 TCP or UDP traffic across VMs or virtual machine scale sets.
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- Note: Two vendors place TCP and UDP at OSI layer 4, the transport layer. Both pages are live.

### units[0].learn.facts[2] ("fact-two") — ✅

Both: carry an app's data from a port on one computer to a port on another; they are the two common transport protocols.

- `rfc-1122` §1.1.3
  > The transport layer provides end-to-end communication services for applications. There are two primary transport layer protocols at present:
- `nist-sp800-41r1` §2
  > Transmission Control Protocol (TCP) and User Datagram Protocol
  > (UDP) are commonly used transport layer
- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to multiplex distinct flows between hosts.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
- Note: RFC 1122 lists TCP and UDP as the two primary transport protocols; NIST SP 800-41 Rev. 1 (current, not withdrawn) calls them the common ones. RFC 9293 and RFC 768 define their ports. QUIC, a newer transport, runs over UDP and does not contradict this.

### units[0].learn.facts[3] ("fact-tcp-gives") — ✅

TCP gives: a connection, every byte in order, acknowledgements and resending, and flow control.

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.4
  > Since every octet is sequenced, each of them can be acknowledged.
- `rfc-9293` §3.8
  > TCP uses retransmission to ensure delivery of every segment.
- `rfc-9293` §3.8.6
  > The window sent in each segment indicates the range of sequence numbers the sender of the window (the data receiver) is currently prepared to accept.
- `rfc-1122` §1.1.3
  > TCP is a reliable connection-oriented transport service that provides end-to-end reliability, resequencing, and flow control.
- `microsoft-winsock-socket` §Parameters
  > A socket type that provides sequenced, reliable, two-way, connection-based byte streams with an OOB data transmission mechanism.
- `openbsd-man-socket` §DESCRIPTION
  > A SOCK_STREAM type provides sequenced, reliable, two-way connection based byte streams.
- Note: RFC 9293 defines each service; RFC 1122 and two vendors confirm.

### units[0].learn.facts[4] ("fact-udp-gives") — ✅

UDP gives: ports and a checksum: no setup, no resending and no promise of order; each message travels whole, on its own.

- `rfc-768` §Introduction
  > The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
- `rfc-1122` §4.1.1
  > UDP is almost a null protocol; the only services it provides over IP are checksumming of data and multiplexing by port number.
- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
  > …
  > Applications that require ordered delivery MUST reestablish datagram ordering themselves.
- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads
  > …
  > A UDP datagram is carried in a single IP packet
- `microsoft-winsock-socket` §Parameters
  > A socket type that supports datagrams, which are connectionless, unreliable buffers of a fixed (typically small) maximum length.
- `openbsd-man-socket` §DESCRIPTION
  > SOCK_DGRAM socket supports datagrams (connectionless, unreliable messages of a fixed (typically small) maximum length).
- Note: RFC 768 defines UDP; RFC 1122 and RFC 8085 state each part independently.

### units[0].learn.facts[5] ("fact-setup") — ✅

Before any data: TCP: a three-way handshake (SYN, SYN-ACK, ACK), one round trip. UDP: nothing.

- `rfc-9293` §3.5
  > In line 3, TCP Peer B sends a SYN and acknowledges the SYN it received from TCP Peer A.
  > …
  > At line 4, TCP Peer A responds with an empty segment containing an ACK for TCP Peer B's SYN; and in line 5, TCP Peer A sends some data.
- `rfc-7413` §1
  > Current TCP only permits data exchange after the three-way handshake (3WHS) [RFC793], which adds one RTT to network latency.
- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads
- Note: RFC 9293 defines the handshake; RFC 768 defines UDP. Leaves out TCP Fast Open (RFC 7413, Experimental), which can carry data in the SYN.

### units[0].learn.facts[6] ("fact-loss") — ✅

Losing a packet: can happen on the way, perhaps because a busy router's queue is full. That's normal, not a fault.

- `rfc-7567` §2
  > The traditional technique for managing the queue length in a network device is to set a maximum length (in terms of packets) for each queue, accept packets for the queue until the maximum length is reached, then reject (drop) subsequent incoming packets until the queue decreases because a packet from the queue has been transmitted.
- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-5681` §3
  > note that the algorithms specified in this document work in terms of using loss as the signal of congestion.
- `rfc-2914` §6.1
  > when congestion is heavy, and a router's buffers overflow, the router has no choice but to drop arriving packets.
- Note: RFC 7567 (BCP, current) and RFC 2914 (BCP, updated only by RFC 7141) independently state that routers drop packets when queues are full. RFC 9293 defines TCP as built to expect loss, and RFC 5681 defines TCP's congestion control as using loss as its routine signal, which is what makes loss normal rather than a fault.

### units[0].learn.facts[7] ("fact-resend") — ✅

How TCP knows a piece is lost: its ACKs keep naming the missing bytes, or its timer runs out with no ACK; then it sends the piece again.

- `rfc-5681` §3.2
  > In this case, all segments after the dropped segment will trigger duplicate ACKs until the loss is repaired.
  > …
  > After receiving 3 duplicate ACKs, TCP performs a retransmission of what appears to be the missing segment, without waiting for the retransmission timer to expire.
- `rfc-6298` §5
  > When the retransmission timer expires, do the following:
  > …
  > Retransmit the earliest segment that has not been acknowledged by the TCP receiver.
- `rfc-9293` §3.8
  > TCP uses retransmission to ensure delivery of every segment.
- `rfc-8985` §1
  > This document presents RACK-TLP, a TCP loss detection algorithm that improves upon the widely implemented duplicate acknowledgment (DupAck) counting approach described in [RFC5681] and [RFC6675]
  > …
  > Recent Acknowledgment (RACK) detects losses quickly using time-based inferences derived from ACK feedback.
- Note: RFC 5681 defines duplicate-ACK loss detection, RFC 6298 the retransmission timer, RFC 8985 RACK-TLP; all current. RACK-TLP, now recommended, still works from the ACKs that come back, so the beginner's picture holds; its timing details are left out.

### units[0].learn.facts[8] ("fact-hold") — ✅

Held pieces: TCP delivers bytes in order, so when one piece is lost, the data behind it waits until it is sent again.

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- Note: RFC 9293 defines TCP's in-order delivery and the holding of later segments.

### units[0].learn.facts[9] ("fact-lost") — ✅

A lost piece: TCP sends it again, and the data behind it waits. UDP doesn't, and the data behind it goes straight to the app.

- `rfc-9293` §3.8
  > TCP uses retransmission to ensure delivery of every segment.
- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- `rfc-768` §Introduction
  > The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed.
- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
  > …
  > This can cause reordering, where UDP datagrams arrive at the receiver in an order different from the transmission order.
- `rfc-9114` §1.1
  > a lost or reordered packet causes all active transactions to experience a stall regardless of whether that transaction was directly impacted by the lost packet.
- Note: RFC 9293 defines TCP's resending and holding; RFC 9114 confirms the wait independently. RFC 8085 states that UDP does not resend and hands datagrams over in the order they arrive, which leaves the app to reorder.

### units[0].learn.facts[10] ("fact-fail") — ✅

If the other end stops answering: TCP gives up after a while, closes the connection and tells the app it failed.

- `rfc-9293` §3.8.3
  > When the number of transmissions of the same segment reaches a threshold R2 greater than R1, close the connection.
  > …
  > TCP implementations SHOULD inform the application of the delivery problem
- `microsoft-winsock-socket` §Remarks
  > If data for which the peer protocol has buffer space cannot be successfully transmitted within a reasonable length of time, the connection is considered broken and subsequent calls will fail with the error code set to
- `openbsd-man-socket` §DESCRIPTION
  > If a piece of data for which the peer protocol has buffer space cannot be successfully transmitted within a reasonable length of time, then the connection is considered broken and calls will indicate an error with -1 returns and with ETIMEDOUT as the specific code in the global variable errno.
- `microsoft-winsock-errors` §WSAETIMEDOUT
  > A connection attempt failed because the connected party did not properly respond after a period of time, or the established connection failed because the connected host has failed to respond.
- Note: RFC 9293 §3.8.3 defines TCP's handling of excessive retransmission. Leaves out that an app may set no limit, and that an idle connection with nothing to send does not notice (RFC 9293 §2.2 says TCP has no built-in liveness check); "stops answering" implies something is being sent.

### units[0].learn.facts[11] ("fact-used") — ✅

Used for: TCP: web pages (except over HTTP/3), email, files. UDP: typically a call's sound and DNS lookups, and QUIC, which carries HTTP/3.

- `rfc-9110` §4.3.2
  > a client MAY attempt access by resolving the host identifier to an IP address, establishing a TCP connection to that address on the indicated port
- `rfc-9112` §9
  > the "http" URI scheme (Section 4.2.1 of [HTTP]) indicates a default connection of TCP over IP, with a default TCP port of 80
- `rfc-5321` §4.5.4.2
  > This requires the support of multiple incoming TCP connections for SMTP.
- `rfc-959` §8
  > The FTP control connection is established via TCP between the user process port U and the server process port L.
- `rfc-8085` §3.3
  > Instead of implementing these relatively complex reliability mechanisms by itself, an application that requires reliable and ordered message delivery SHOULD whenever possible choose an IETF standard transport protocol that provides these features.
- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to multiplex distinct flows between hosts.
- `rfc-9114` §1
  > HTTP/3 supports the same semantics over a new transport protocol: QUIC.
- `rfc-9000` §1
  > QUIC packets are carried in UDP datagrams [UDP] to better facilitate deployment in existing systems and networks.
- `nist-sp800-41r1` §4.1.3
  > DNS lookups can occur on UDP port 53 or TCP port 53.
- `rfc-3550` §1
  > Applications typically run RTP on top of UDP to make use of its multiplexing and checksum services
- `microsoft-teams-network` §Network optimization
  > Teams media prefers UDP ports 3478-3481.
- `rfc-1035` §4.2
  > datagrams are preferred for queries due to their lower overhead and better performance.
- Note: Each use is stated by the defining standard of that protocol: HTTP (RFC 9110, RFC 9112), SMTP (RFC 5321), FTP (RFC 959), HTTP/3 (RFC 9114), QUIC (RFC 9000), DNS (RFC 1035). RTP (RFC 3550) and Microsoft Teams confirm calls over UDP. All current.
- Note: "files" is shown by FTP; most files today come over HTTP, which is TCP too, so the claim holds either way.

### units[0].learn.facts[12] ("fact-headers") — ✅

Header: UDP: 8 bytes, holding the source port, destination port, length and checksum. TCP's is bigger: it also has sequence and acknowledgement numbers and a window, which UDP's doesn't.

- `rfc-768` §Fields
  > Length is the length in octets of this user datagram including this header and the data. (This means the minimum value of the length is eight.)
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
  > …
  > Destination Port has a meaning within the context of a particular internet destination address.
- `rfc-9293` §3.1
  > Sequence Number: 32 bits
  > …
  > Acknowledgment Number: 32 bits
  > …
  > Window: 16 bits
- Note: RFC 768 defines UDP's header (its Format figure shows the four fields; an empty datagram is eight bytes, so the header is eight). RFC 9293 §3.1 defines TCP's header, which carries these extra fields and is at least five 32-bit words.

### units[0].learn.facts[13] ("fact-ports") — ✅

Ports here: a destination port names the service listening there, such as the web's TCP port 80; a source port is usually the port on your own computer that replies go to.

- `rfc-9110` §4.2.1
  > If the port subcomponent is empty or not given, TCP port 80 (the reserved port for WWW services) is the default.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host, and a source port
  > usually identifies the port number on the source host that the destination host should reply to.
- `nist-sp800-41r1` §4.1.3
  > An application server typically listens on one or more fixed TCP or UDP ports.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process, and may be assumed to be the port to which a reply should be addressed in the absence of any other information.
- Note: RFC 9110 defines the http scheme's default TCP port 80; NIST and RFC 768 independently state the meaning of each port. Port 80 is offered as an example ("such as"); most pages today use HTTPS on port 443, which the claim does not deny.

### units[0].learn.facts[14] ("fact-stands-for") — ✅

Stands for: Transmission Control Protocol and User Datagram Protocol.

- `rfc-9293` §Abstract
  > This document specifies the Transmission Control Protocol (TCP).
- `rfc-768` §Introduction
  > This User Datagram Protocol (UDP) is defined to make available a datagram mode of packet-switched computer communication
- Note: The defining documents give both full names.

### units[0].practice[0].options[0] (question "drop-both") — ✅

Right answer: "TCP sends the page's piece again; the call's packet stays lost." Feedback: "Right. TCP sends again whatever isn't acknowledged. UDP doesn't resend; the call app has to cope with the gap."

- `rfc-9293` §3.8
  > Because segments may be lost due to errors (checksum test failure) or network congestion, TCP uses retransmission to ensure delivery of every segment.
- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
  > …
  > Applications that do require reliable message delivery MUST implement an appropriate mechanism themselves.
- `rfc-768` §Introduction
  > The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed.
- Note: Correct as the right answer. RFC 9293 defines TCP's retransmission of unacknowledged data; RFC 768 defines UDP. A call app could in rare cases ask for a resend itself (RFC 8834 §6.1), which the option leaves out; UDP itself never resends.

### units[0].practice[0].options[1] (question "drop-both") — ✅

Wrong answer: "Both are sent again." Feedback: "Not quite. UDP doesn't send a lost packet again, and TCP does."

- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery
- `rfc-9293` §3.8
  > TCP uses retransmission to ensure delivery of every segment.
- Note: Correctly wrong; the feedback is true.

### units[0].practice[0].options[2] (question "drop-both") — ✅

Wrong answer: "Both stay lost." Feedback: "Not quite. TCP's ACKs show the gap, and the server sends the piece again."

- `rfc-9293` §3.8
  > TCP uses retransmission to ensure delivery of every segment.
- `rfc-5681` §3.2
  > The purpose of this ACK is to inform the sender that a segment was received out-of-order and which sequence number is expected.
  > …
  > After receiving 3 duplicate ACKs, TCP performs a retransmission of what appears to be the missing segment
- Note: Correctly wrong; the feedback is true.

### units[0].practice[1].options[0] (question "which-call") — ✅

Right answer: "UDP." Feedback: "Right. With UDP nothing waits for a lost packet, and in a call, late is as bad as lost."

- `itu-g114` §Annex A.3
  > If the delivery time of a packet exceeds the length of the
  > receive buffer, then this packet "arrives too late" with respect to its intended play-out time, and will
  > be discarded.
- `rfc-8836` §1
  > since it's consumed in real time, data delivered late is commonly useless.
- `rfc-8834` §6.1
  > Retransmission needs to be used with care in interactive real-time applications to ensure that the retransmitted packet arrives in time to be useful
- `rfc-3550` §1
  > Applications typically run RTP on top of UDP to make use of its multiplexing and checksum services
- `microsoft-teams-network` §Network optimization
  > Teams media prefers UDP ports 3478-3481.
- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
- Note: Correct as the right answer; calls usually run over UDP (RFC 3550, Microsoft Teams) and late audio is useless (ITU-T G.114, RFC 8836).

### units[0].practice[1].options[1] (question "which-call") — ✅

Wrong answer: "TCP." Feedback: "Not quite. TCP would make everything behind a lost piece wait until it was sent again, and by then its moment to be played may have passed."

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §3.10.7.4
  > Segments with higher beginning sequence numbers SHOULD be held for later processing (SHLD-31).
- `itu-g114` §Annex A.3
  > If the delivery time of a packet exceeds the length of the
  > receive buffer, then this packet "arrives too late" with respect to its intended play-out time, and will
  > be discarded.
- `rfc-8836` §1
  > since it's consumed in real time, data delivered late is commonly useless.
- Note: Correctly wrong; RFC 9293 defines the holding back, and two independent sources state that late audio is useless.

### units[0].practice[2].options[0] (question "promise") — ✅

Right answer: "No. It sends again whatever is lost, but if the other end stops answering, it gives up and tells the app." Feedback: "Right. The app gets every byte in order, or hears that the connection failed."

- `rfc-9293` §3.8.3
  > Excessive retransmission of the same segment by a TCP endpoint indicates some failure of the remote host or the internetwork path.
  > …
  > When the number of transmissions of the same segment reaches a threshold R2 greater than R1, close the connection.
- `microsoft-winsock-socket` §Remarks
  > The communications protocols used to implement a reliable, connection-oriented socket ensure that data is not lost or duplicated. If data for which the peer protocol has buffer space cannot be successfully transmitted within a reasonable length of time, the connection is considered broken and subsequent calls will fail with the error code set to
- `openbsd-man-socket` §DESCRIPTION
  > then the connection is considered broken and calls will indicate an error with -1 returns and with ETIMEDOUT as the specific code in the global variable errno.
- Note: Correct as the right answer. RFC 9293 defines the give-up; two vendors confirm the app is told. Leaves out that an app may set no limit.

### units[0].practice[2].options[1] (question "promise") — ✅

Wrong answer: "Yes, always." Feedback: "Not quite. TCP can't deliver to a computer that has stopped answering. After enough failed resends it closes the connection and tells the app."

- `rfc-9293` §3.8.3
  > When the number of transmissions of the same segment reaches a threshold R2 greater than R1, close the connection.
  > …
  > TCP implementations SHOULD inform the application of the delivery problem
- `microsoft-winsock-socket` §Remarks
  > the connection is considered broken and subsequent calls will fail with the error code set to
- `microsoft-winsock-errors` §WSAETIMEDOUT
  > the established connection failed because the connected host has failed to respond.
- Note: Correctly wrong; the feedback is true.

## Traced parts

### backing (the lesson's subtitle and summary) — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].backing (the unit's full name and purpose) — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].scene.backing (the scene) — ✅

- Note: Example addresses only (192.168.1.100 is RFC 1918 private, 203.0.113.80 and 203.0.113.90 are RFC 5737 documentation addresses, example.net); the table and log only name what the traced parts state.


### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].overview.facts[0] (Overview fact "Used for") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].overview.facts[1] (Overview fact "Before any data") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].overview.facts[2] (Overview fact "A lost piece") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].overview.facts[3] (Overview fact "OSI layer") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].overview.facts[4] (Overview fact "Defined in") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0] (step "handshake") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0].facts[0] (step "handshake", fact "Messages") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0].facts[1] (step "handshake", fact "Costs") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0].facts[2] (step "handshake", fact "To") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0].events[0] (event "s1-syn") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[0].events[1] (event "s1-synack") — ✅

- Note: "I got your hello" is the ACK in SYN-ACK (term-handshake, fact-setup).


### units[0].steps[0].events[2] (event "s1-ack") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1] (step "tcp-loss") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].facts[0] (step "tcp-loss", fact "Piece 2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].facts[1] (step "tcp-loss", fact "Piece 3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].facts[2] (step "tcp-loss", fact "The ACK says") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[0] (event "s2-req") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[1] (event "s2-p1") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[2] (event "s2-g1") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[3] (event "s2-p2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[4] (event "s2-p3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[5] (event "s2-g2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[6] (event "s2-g3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[1].events[7] (event "s2-ack") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2] (step "retransmission") — ✅

- Note: The single ACK shown stands for the repeated ACKs fact-resend describes.


### units[0].steps[2].facts[0] (step "retransmission", fact "Sent again") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].facts[1] (step "retransmission", fact "Waited") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].facts[2] (step "retransmission", fact "The browser got") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].events[0] (event "s3-p2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].events[1] (event "s3-g2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].events[2] (event "s3-g3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[2].events[3] (event "s3-ack") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3] (step "udp-send") — ✅

- Note: "No handshake: your first packet already carries sound" restates fact-setup and term-connectionless for UDP itself. A real call app may exchange its own setup messages first; that is the app, not UDP, and the step does not claim otherwise.


### units[0].steps[3].facts[0] (step "udp-send", fact "Handshake") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3].facts[1] (step "udp-send", fact "Each packet") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3].facts[2] (step "udp-send", fact "Header") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3].events[0] (event "s4-v1") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3].events[1] (event "s4-s1") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[3].events[2] (event "s4-g1") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4] (step "udp-loss") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].facts[0] (step "udp-loss", fact "Sam’s packet 2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].facts[1] (step "udp-loss", fact "Packet 3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].facts[2] (step "udp-loss", fact "Who copes") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].events[0] (event "s5-s2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].events[1] (event "s5-g2") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].events[2] (event "s5-s3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


### units[0].steps[4].events[3] (event "s5-g3") — ✅

- Note: Says nothing beyond the Learn parts it traces.


## Example parts

### units[0].steps[0].facts[3] (step "handshake", fact "From") — ✅

- Note: 192.168.1.100 is an RFC 1918 private address; port 50422 is a made-up client port.


### units[0].steps[3].facts[3] (step "udp-send", fact "To") — ✅

- Note: 203.0.113.90 is an RFC 5737 documentation address; port 16384 is a made-up example port.


## Analogies

### units[0].overview.backing (the Overview description) — ✅

- Note: Numbered postcards with a "got them all?" check and resending fit TCP; a walkie-talkie with no setup and no repeat of a crackled word fits UDP. Nothing in it teaches a false idea about either.


### units[0].learn.lead[1] ("lead-2") — ✅

- Note: Same analogy as the Overview description; it does not mislead.


## Unbacked items

### title — ✅

- Note: "TCP/UDP" names the lesson's two protocols and claims nothing more.


### units[0].name — ✅

- Note: "TCP/UDP" claims nothing beyond the cited parts.


### units[0].practice[0].prompt (question "drop-both") — ✅

- Note: True premise: a web page over TCP and a call over UDP (fact-used), and loss on the way happens (fact-loss).


### units[0].practice[1].prompt (question "which-call") — ✅

- Note: True premise: a call needs timely playback and tolerates a small gap (why-2).


### units[0].practice[2].prompt (question "promise") — ✅

- Note: A plain question with no premise.


## Sources

All checked on 2026-11-15, each read from its publisher's own site.

- `cloudflare-network-layers`: Cloudflare developer documentation, live, last updated October 2026. Current.
- `itu-g114`: ITU-T G.114 (05/2003). ITU-T's Recommendation page lists this edition as in force, with Amendments 1 and 2 also in force; earlier editions are superseded. Current.
- `microsoft-azure-lb`: Microsoft Learn, live; describes the current service. Only the Basic SKU is noted as retired. Current.
- `microsoft-teams-network`: Microsoft Learn, live; describes current Teams network guidance. Current.
- `microsoft-winsock-errors`: Microsoft Learn, live; current Winsock reference. Current.
- `microsoft-winsock-socket`: Microsoft Learn, live; current Winsock reference. Current.
- `nist-sp800-41r1`: NIST SP 800-41 Rev. 1 (September 2009). CSRC lists it as final, not withdrawn, with no newer revision. Current.
- `nist-sp800-77r1`: NIST SP 800-77 Rev. 1 (June 2020). CSRC lists it as final, not withdrawn, with no newer revision. Current.
- `openbsd-man-socket`: OpenBSD's own manual page (OpenBSD-current), live. Current.
- `rfc-1035`: not obsoleted per the RFC Editor; updated by many RFCs, including RFC 7766, which was read for the DNS-over-TCP claim. Current.
- `rfc-1122`: not obsoleted; its TCP parts are updated by RFC 9293 and RFC 6298, which this lesson cites directly. Current.
- `rfc-2914`: Best Current Practice, not obsoleted; updated only by RFC 7141, which does not touch §6.1's point. Current.
- `rfc-3550`: Internet Standard, not obsoleted; its updates do not change RTP's usual use over UDP. Current.
- `rfc-5321`: not obsoleted; updated only by RFC 7504 (reply codes). Current.
- `rfc-5681`: not obsoleted; updated only by RFC 9438 (CUBIC), which does not change fast retransmit. Current.
- `rfc-6298`: not obsoleted, not updated. Current.
- `rfc-7413`: Experimental, not obsoleted, not updated. Current.
- `rfc-7567`: Best Current Practice, not obsoleted, not updated. Current.
- `rfc-768`: Internet Standard, not obsoleted; updated only by RFC 9868 (UDP options in the surplus area after the data), which leaves the eight-byte header and UDP's lack of resending as they are. Current.
- `rfc-7766`: not obsoleted; updated by RFC 8490 and RFC 9103, which do not change §5. Current.
- `rfc-8085`: Best Current Practice, not obsoleted; updated only by RFC 8899 (path MTU discovery). Current.
- `rfc-8834`: not obsoleted, not updated. Current.
- `rfc-8836`: not obsoleted, not updated. Current.
- `rfc-8985`: not obsoleted, not updated. Current.
- `rfc-9000`: not obsoleted, not updated. Current.
- `rfc-9110`: Internet Standard, not obsoleted. Current.
- `rfc-9112`: Internet Standard, not obsoleted; updated only by RFC 9931 (security of protocol transitions), which does not change §9. Current.
- `rfc-9114`: not obsoleted, not updated. Current.
- `rfc-9293`: Internet Standard, not obsoleted. Current.
- `rfc-959`: Internet Standard, not obsoleted; its updates are extensions. Current.

## Limit overrides

None.
