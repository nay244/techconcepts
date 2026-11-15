```json fact-check
{
  "slug": "arp",
  "hash": "ef4b724926bd5ad90e7c3063d851f57ee7d33e91dd38255f84bb4a2aef1aa6c5",
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
    "units[0].overview.facts[0] (Overview fact \"Asks\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Answered by\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Kept in\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Reaches\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"who-has\")": "✅",
    "units[0].steps[0].facts[0] (step \"who-has\", fact \"Looking for\")": "✅",
    "units[0].steps[0].facts[1] (step \"who-has\", fact \"In the cache\")": "✅",
    "units[0].steps[0].facts[2] (step \"who-has\", fact \"Sent to\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-miss\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-ask\")": "✅",
    "units[0].steps[1] (step \"only-the-owner\")": "✅",
    "units[0].steps[1].facts[0] (step \"only-the-owner\", fact \"Who answers\")": "✅",
    "units[0].steps[1].facts[1] (step \"only-the-owner\", fact \"Sent to\")": "✅",
    "units[0].steps[1].facts[2] (step \"only-the-owner\", fact \"Answer\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-answer\")": "✅",
    "units[0].steps[2] (step \"cache-fills\")": "✅",
    "units[0].steps[2].facts[0] (step \"cache-fills\", fact \"Cache now\")": "✅",
    "units[0].steps[2].facts[1] (step \"cache-fills\", fact \"Frame sent to\")": "✅",
    "units[0].steps[2].facts[2] (step \"cache-fills\", fact \"Packet for\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-add\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-packet\")": "✅",
    "units[0].steps[3] (step \"send-again\")": "✅",
    "units[0].steps[3].facts[0] (step \"send-again\", fact \"In the cache\")": "✅",
    "units[0].steps[3].facts[1] (step \"send-again\", fact \"Broadcasts\")": "✅",
    "units[0].steps[3].facts[2] (step \"send-again\", fact \"ARP messages\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-hit\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-packet\")": "✅",
    "units[0].steps[4] (step \"entry-runs-out\")": "✅",
    "units[0].steps[4].facts[0] (step \"entry-runs-out\", fact \"The entry\")": "✅",
    "units[0].steps[4].facts[1] (step \"entry-runs-out\", fact \"How long\")": "✅",
    "units[0].steps[4].facts[2] (step \"entry-runs-out\", fact \"Then\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-remove\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-miss\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-ask\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-answer\")": "✅",
    "units[0].steps[4].events[4] (event \"s5-add\")": "✅",
    "units[0].steps[0].deep[0] (step \"who-has\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"only-the-owner\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"cache-fills\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"send-again\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"entry-runs-out\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-arp\")": "✅",
    "units[0].learn.terms[1] (\"term-mac\")": "✅",
    "units[0].learn.terms[2] (\"term-cache\")": "✅",
    "units[0].learn.terms[3] (\"term-broadcast\")": "✅",
    "units[0].learn.terms[4] (\"term-request\")": "✅",
    "units[0].learn.terms[5] (\"term-reply\")": "✅",
    "units[0].learn.terms[6] (\"term-gateway\")": "✅",
    "units[0].learn.terms[7] (\"term-timeout\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-spoof\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-ipv6\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-probe\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-defined\")": "✅",
    "units[0].learn.facts[1] (\"fact-osi\")": "✅",
    "units[0].learn.facts[2] (\"fact-job\")": "✅",
    "units[0].learn.facts[3] (\"fact-arp\")": "✅",
    "units[0].learn.facts[4] (\"fact-broadcast\")": "✅",
    "units[0].learn.facts[5] (\"fact-cache-first\")": "✅",
    "units[0].learn.facts[6] (\"fact-frame\")": "✅",
    "units[0].learn.facts[7] (\"fact-life\")": "✅",
    "units[0].learn.facts[8] (\"fact-ask-again\")": "✅",
    "units[0].learn.facts[9] (\"fact-local\")": "✅",
    "units[0].learn.facts[10] (\"fact-command\")": "✅",
    "units[0].learn.facts[11] (\"fact-wait\")": "✅",
    "units[0].learn.facts[12] (\"fact-name\")": "✅",
    "units[0].practice[0].options[0] (question \"cache-hit\")": "✅",
    "units[0].practice[0].options[1] (question \"cache-hit\")": "✅",
    "units[0].practice[0].options[2] (question \"cache-hit\")": "✅",
    "units[0].practice[1].options[0] (question \"who-answers\")": "✅",
    "units[0].practice[1].options[1] (question \"who-answers\")": "✅",
    "units[0].practice[1].options[2] (question \"who-answers\")": "✅",
    "units[0].practice[2].options[0] (question \"far-away\")": "✅",
    "units[0].practice[2].options[1] (question \"far-away\")": "✅",
    "units[0].practice[0].prompt (question \"cache-hit\")": "✅",
    "units[0].practice[1].prompt (question \"who-answers\")": "✅",
    "units[0].practice[2].prompt (question \"far-away\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-arp-config",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cisco-dai",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "cloudflare-network-layer",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "microsoft-arp",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "microsoft-arp-caching",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "microsoft-tcpip-subnetting",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "openbsd-man-arp-4",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "openbsd-man-arp-8",
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
      "id": "rfc-4861",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-5227",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-826",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-894",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-919",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-9542",
      "current": true,
      "checked": "2026-11-14"
    },
    {
      "id": "rfc-9724",
      "current": true,
      "checked": "2026-11-14"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-14",
    "count": 122,
    "digest": "9c5a7a353cc5ebb6f8c0663e99c6cc5dc8c78d45c428542e2f1f23b78c49936d",
    "files": {
      "cisco-arp-config": "2b5c837fc2cd3a84cd5e6959e0fa9eeba4a5208d6bc467ffb5fcdcbbdfbec4d6",
      "cloudflare-network-layer": "86d622783e2d95bfc024728cc19e4ee4967f360cbbf6eb68a4a57211a9baa4cd",
      "rfc-826": "01bc62fe6a37e90f1246ac43e8e145f1322b4ed1474836145c3da93d2bd3c8a6",
      "cisco-dai": "eaf42072ca42e325a509e6dfaaa646508f83b014bc34f4978e5d28cef7d2d489",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "rfc-894": "be88b9301e53f986aca3a0e55e488d1d79bae3f88fe3f257640397bc089e7035",
      "rfc-5227": "bfe6de915c68fddffa6bee54dd217a377d2c694c4233cef1696c936d4202ecd4",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "microsoft-arp-caching": "656b16828860eedeffa5239c06eead0237436f8a1608f07e3da5a0f2f1ee73e0",
      "microsoft-arp": "341170ed1192e9685cec6c3e088e9b8b4a42f188f15919861848779d5a355add",
      "rfc-9724": "b0ad27b88fe2c18981558885cff56b523539a5d69784a5188887ab0fbb06095e",
      "openbsd-man-arp-4": "b2b30dd5e4cbad813e8ecd569a15b711052a7b81b5d06905bd9bb91ad84263fc",
      "rfc-919": "37d6bdb202cd4336e0922b862dbcff0516cd0d7cfa5219d0109e16545b1df64e",
      "microsoft-tcpip-subnetting": "1c6cd5689711df14f1b84830cca7d1b1d8f120066d77d4696add5ee5bbd6e87a",
      "rfc-4861": "1a4309c117d765a7c0edfcb2297fc90c3c09f0fcae255f15e53b20748bcc09fb",
      "rfc-9542": "5c52f6cb6aacb1dea947a206bc8775ec8aaed52d74b92c600f1b1166d5c3c0f1",
      "openbsd-man-arp-8": "33019d5321f995fe4e5d75bb8cca1a10c6dd3f30defc93b923a7cb745504e82e"
    }
  },
  "items": {
    "title": "1b7202918e3066be6dde9dc5c8b8ecde25d0240a9f6098f0439ff1fa02295217",
    "units[0].name": "da1d1c8e180731bab60f7f60655486430ae0a423ea4763933b2f9e333dbbc1c0",
    "units[0].osi": "689a5be17e5f77c1cbc152286bdd3f64296b5c5b944f388a858ab2f8f87b9581",
    "backing (the lesson's subtitle and summary)": "13224c73c47da53ffb46d9859f967c60846a38241e8bf9c4897924fd407bc902",
    "units[0].backing (the unit's full name and purpose)": "42a40341dd3d1798576b7a724d3681f18626aa63968baf041b6c97e655aee793",
    "units[0].scene.backing (the scene)": "31b72d06e63e09e57322ef0552c1b206aa75cab73f9e0f663b334850d6e9bc4d",
    "units[0].overview.hookBacking (the Overview hook)": "bf6f8bc9ffcc65029ba661fe59e8b2663c55559ddfbcba611ffaf13fa9005b74",
    "units[0].overview.backing (the Overview description)": "ac306e22193487bdcc3e11b17edef7d202a4fc97783da9651faa76e028f0f3a1",
    "units[0].overview.facts[0] (Overview fact \"Asks\")": "1fee108c55bbf5fa01b7c0071f286c72e2e195513a08c22a6bd5bc83606f1545",
    "units[0].overview.facts[1] (Overview fact \"Answered by\")": "62c65df4ce6670122fdbe85dbfc546f8e1686ee43306cae8082f6c3ba33cf974",
    "units[0].overview.facts[2] (Overview fact \"Kept in\")": "7874f82183fc03ed86dc34488e3c46c81708443761699b9e117c99ebf9267b3d",
    "units[0].overview.facts[3] (Overview fact \"Reaches\")": "c39b5020bcd787c8296dee5784a1cf7ecfe4590851aab4b394f7f8ca4c6b98c4",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "1c8a653b23fac582bf31a0e983668e4dbcfddbe9615bf52e8f38c1effa70ac4c",
    "units[0].overview.facts[5] (Overview fact \"Defined in\")": "b2ec139a2066ed649059ff9483fbb8e933ab427dd9d0e0f50821610baf754f51",
    "units[0].steps[0] (step \"who-has\")": "c962218e93add5ccdc0c2d73862347927ec3ec2acf639b04b30ae2a2f5b5ed5b",
    "units[0].steps[0].facts[0] (step \"who-has\", fact \"Looking for\")": "21cb2d258becf73066e0e770df192d28358d0fc6dc17ad4f1daf75bda5ab7546",
    "units[0].steps[0].facts[1] (step \"who-has\", fact \"In the cache\")": "d65d0cf562f6eec3f6c348cf5a7d11b12d80bafe42100529d79be8de09724010",
    "units[0].steps[0].facts[2] (step \"who-has\", fact \"Sent to\")": "d95c329d341f3fc5570cd0ed710f2dc00f1dba9677d60ceed734d79c3a3d3cf6",
    "units[0].steps[0].events[0] (event \"s1-miss\")": "080c2826c612a224ad2253b61f1cf62507221a939d97df0ebf6b6e4508ee1743",
    "units[0].steps[0].events[1] (event \"s1-ask\")": "396362093d2c889425413933592ce36f38fda8077f60638c9be76c05b9b3b4b7",
    "units[0].steps[1] (step \"only-the-owner\")": "163eec6d123f423a2632e6bbaebcd7f763836b3fa072f87902bf83d558b101a8",
    "units[0].steps[1].facts[0] (step \"only-the-owner\", fact \"Who answers\")": "72f24c66cc8d366ed1a640fba0612023e3e6f2ce4e05652e659d2be0149802c3",
    "units[0].steps[1].facts[1] (step \"only-the-owner\", fact \"Sent to\")": "5322bab5f5b1cbcae1b72ecb816c7c9d9db391b7a27048e1bc7f758a6bf83cdd",
    "units[0].steps[1].facts[2] (step \"only-the-owner\", fact \"Answer\")": "51527990c9d813434b25b6f389d16faf18cf21149d878ed8ffb0013e9525b7c1",
    "units[0].steps[1].events[0] (event \"s2-answer\")": "54228b377705762c0b54efa0c43b2a07b5931d59536a2c6f3c5d0633c96fea62",
    "units[0].steps[2] (step \"cache-fills\")": "ed944f920978a31161cf835b0189364604c1c65ae756498f9a019c367831c3cd",
    "units[0].steps[2].facts[0] (step \"cache-fills\", fact \"Cache now\")": "970d30c614ebfc98a52cc095c45c2d99568689fb8bb35742a79752e752d5fcf7",
    "units[0].steps[2].facts[1] (step \"cache-fills\", fact \"Frame sent to\")": "32181ed97251a093adac14f978d24a2c027e61721b1d12aa82eae366ab30b50f",
    "units[0].steps[2].facts[2] (step \"cache-fills\", fact \"Packet for\")": "c863c70a5c9fddec36db063c4aa5d88576e6b47f4562441622b95e7eb3335d71",
    "units[0].steps[2].events[0] (event \"s3-add\")": "eab9a147cba0194aa3aa8df8c43fae740ac498cfaff666ec33785a38555cade4",
    "units[0].steps[2].events[1] (event \"s3-packet\")": "1b080dfdcbc5f097f0f88492569a19219390826680bcdfd231b4c1d26717890f",
    "units[0].steps[3] (step \"send-again\")": "0bf954fd635971c086bfd51d5376e8277e787288df5476c29a24a4cb0b40b38d",
    "units[0].steps[3].facts[0] (step \"send-again\", fact \"In the cache\")": "62af6e31d8877e396a542239b3edc4f713d6dd338b911d6415739c738117d686",
    "units[0].steps[3].facts[1] (step \"send-again\", fact \"Broadcasts\")": "460bc5c483c82f6a67333512327166097275d0ca903fbe1eb067b3b6b7601f06",
    "units[0].steps[3].facts[2] (step \"send-again\", fact \"ARP messages\")": "5d93adc60e25461fe70628b74ecbc290409f85963c61eaecd86071590c219fd2",
    "units[0].steps[3].events[0] (event \"s4-hit\")": "8973ad32540e25cf0ebee45b8ae3e668d14756bff4b9d3efb4ffeb9f94622252",
    "units[0].steps[3].events[1] (event \"s4-packet\")": "d8e0e04c868d60414f581ee7ba68de4c4552957084943c52b9cde914b7a1af2d",
    "units[0].steps[4] (step \"entry-runs-out\")": "25a2cdb6efee3ed12f43dabbd3766f99f4a7c2f29fbd2970b16168388d420edf",
    "units[0].steps[4].facts[0] (step \"entry-runs-out\", fact \"The entry\")": "ae592f9dd3f98b2e3b2bfdf50b5cb45a1303847d846c9945ae7da0abeb79b5ff",
    "units[0].steps[4].facts[1] (step \"entry-runs-out\", fact \"How long\")": "84e8132879707bd9928035e3c10894b79652265d12319c323d92d5fb925a3b35",
    "units[0].steps[4].facts[2] (step \"entry-runs-out\", fact \"Then\")": "00b00c7b1432fab62d95d70e320b26746c2c0c953e5efc12f4e35bc93277a221",
    "units[0].steps[4].events[0] (event \"s5-remove\")": "e3e8fe63fa858235209f9304bbdae59ed1c8cdc1f8892c3d77c7c263a9497ca1",
    "units[0].steps[4].events[1] (event \"s5-miss\")": "1475a3436f07896151179bcee748d4764cfeec778a4386ca2b3df8f1b2bd941e",
    "units[0].steps[4].events[2] (event \"s5-ask\")": "2cf1208cb27951a2084bb901e6905583d2196426d1a276bcdb124c0dda6f54b5",
    "units[0].steps[4].events[3] (event \"s5-answer\")": "485ea07cea38094a627901b385cf3ccd9f7e68bc8b2e068834dd4604fb89b184",
    "units[0].steps[4].events[4] (event \"s5-add\")": "eab9a147cba0194aa3aa8df8c43fae740ac498cfaff666ec33785a38555cade4",
    "units[0].steps[0].deep[0] (step \"who-has\", Go deeper)": "c08a50a5bcf18d1c12b679af6b01e04c49299533da4f0020d64562325c59cba4",
    "units[0].steps[1].deep[0] (step \"only-the-owner\", Go deeper)": "329cc100c81c79d59f0f922f0007f4bc1d91b20947620057d76df150f0d8f0e0",
    "units[0].steps[2].deep[0] (step \"cache-fills\", Go deeper)": "e2f4a33904af5a4a65cb8f367414c8ac15ddb5b58ee479d93a73edbfca1e46ec",
    "units[0].steps[3].deep[0] (step \"send-again\", Go deeper)": "288063996adbdfe4b88da239b8bdf013b5fd77fde26d25e658c853dab3148c78",
    "units[0].steps[4].deep[0] (step \"entry-runs-out\", Go deeper)": "d54c2b9d788e8a35ccde5e7f3ddad873d90f442afd2ecf8ca9cd4877457fefa0",
    "units[0].learn.lead[0] (\"lead-1\")": "2179de4affb20a19f31c76de8a1a313e6de13f3428f4cbb325f20dbaa7468d76",
    "units[0].learn.lead[1] (\"lead-2\")": "6c08d65629c8d3afda461fb48aa8566cfa4fc623456c8f3f954f92faeae26002",
    "units[0].learn.terms[0] (\"term-arp\")": "653d32ae5e6814fb300890cd4add9624016d8b1fbb41bebecb7bdae84c76f79d",
    "units[0].learn.terms[1] (\"term-mac\")": "a52323087842e8c3b2c090a2033e0223456d6dc7985458674b33119ef8f3083c",
    "units[0].learn.terms[2] (\"term-cache\")": "2b74ab43d83b2c82cbc1141b5a678f3aaf00afc915a932d69304b0ca0bf8174e",
    "units[0].learn.terms[3] (\"term-broadcast\")": "0da1854fdb88a69640e35e8ebb94dcb90603ee211182c591e697ec57c0fa87bf",
    "units[0].learn.terms[4] (\"term-request\")": "109cf5d4dbf26d3dc7a202dc898eb86db3809616cb3eab85ccf57a9ee190676b",
    "units[0].learn.terms[5] (\"term-reply\")": "d6079b94d891a531f201370f625b6e4eca55b3f0b28b94dc4211edcc423e4366",
    "units[0].learn.terms[6] (\"term-gateway\")": "2059a6a4de4d710455a3341dbfb6d6527b0e7596a77412e64eedfaed1a4341af",
    "units[0].learn.terms[7] (\"term-timeout\")": "8a3dccdb2aa4a4c2ab259b8eb161fc6bc22c752931b89c1c8372ebb84864812f",
    "units[0].learn.pattern (\"pattern\")": "23ca27340da4f1335260f0412005cd597b45c1040f462eab0f35d8a28b5cab5b",
    "units[0].learn.why[0] (\"why-1\")": "ea8b4a0ca5e4dade8253b8aeb06398c03c87d505d4397a0f770a55f3da4b2f7d",
    "units[0].learn.why[1] (\"why-2\")": "8035783b7a1e0c8ec73332660e89eed0a2ec212ca64cedc07f1089f7661ef61e",
    "units[0].learn.deep[0] (\"deep-spoof\", Learn's Go deeper)": "ee89418eadea381f95d5277dc5bd954d22ee3003522b0e15c2e4420303216f73",
    "units[0].learn.deep[1] (\"deep-ipv6\", Learn's Go deeper)": "f8279b88ad43f1dc5af78c054652bd151db3b5c3aa1acb197cbac3db442cb317",
    "units[0].learn.deep[2] (\"deep-probe\", Learn's Go deeper)": "67b74feb970d3d260a3eae0e7eb395ee9ac45be5c616b62af915205399de25e3",
    "units[0].learn.facts[0] (\"fact-defined\")": "c32e73d7d9e438599b8b3ad4a84ae789595de5438fb3c676cdd0c6b01dbcec0b",
    "units[0].learn.facts[1] (\"fact-osi\")": "62d6104407043893ca90f5af8843308f71174b0241f151980764fe94b4cf01d4",
    "units[0].learn.facts[2] (\"fact-job\")": "e86f5019bb5f7b106241dc78e34df69ccc8b534dd2f85a42cdb185ae9095d325",
    "units[0].learn.facts[3] (\"fact-arp\")": "e81a6100e29211b57cd448b9b0c82715ceca2246db0f535699eecef00a0ad1a8",
    "units[0].learn.facts[4] (\"fact-broadcast\")": "a392326e72c4abdf0d32dcd6459a7ca1913b3559d3af9e92dab83c90b72d39d9",
    "units[0].learn.facts[5] (\"fact-cache-first\")": "09f17d4190d67f42d8ca1a312948c3960bf6ca8db36c3b0bb9c24d6f61ce7607",
    "units[0].learn.facts[6] (\"fact-frame\")": "9c9039c2934311c6c0c37cb83da1eb0566996f67e8ea2470ef8fd2f66fb266a7",
    "units[0].learn.facts[7] (\"fact-life\")": "48580edd345644e89f100cba9ddadb8fc056207609bb7a12a1721a5dd2cba193",
    "units[0].learn.facts[8] (\"fact-ask-again\")": "c8b837b8819afd5f3390dad9e6bfe700d767983be11e60e7b2f1e4ceca737c59",
    "units[0].learn.facts[9] (\"fact-local\")": "e2e6b462d16b3df6684758eddde1474fa2c64f4af9ece1f7972ec1fe1196bad9",
    "units[0].learn.facts[10] (\"fact-command\")": "813d4fc0be06f3fad6a038c1915b947ea6bc57732218b5818d70f1ae8b1b1142",
    "units[0].learn.facts[11] (\"fact-wait\")": "22d63a90e6dff0a2a6ffd60df19ee1a1d81d429ca522141fa2900f06f065c55b",
    "units[0].learn.facts[12] (\"fact-name\")": "089d2f02ef1420db834cc7efe738c2f0b8e8340c3c84bb10566494994e7c3491",
    "units[0].practice[0].options[0] (question \"cache-hit\")": "215a240557b5a971f8e4032d3a975d826d92b50ad16281d9197b772e5c81fe33",
    "units[0].practice[0].options[1] (question \"cache-hit\")": "f46e7dc31a539925157b783e9ef97812b7e25cd9d557fae0950cf1ffe6223ba5",
    "units[0].practice[0].options[2] (question \"cache-hit\")": "4522a17c490e561fd9ee11506312411e363f0367c170bcd4ab4cfcd7d3d043a7",
    "units[0].practice[1].options[0] (question \"who-answers\")": "f01b0e3bba17796044a9493c4c076a68854aa0894011a5af5056d0b5864a52bb",
    "units[0].practice[1].options[1] (question \"who-answers\")": "535cf1beded15f30bb90201dbf58829c5783142766404ad198d366c33d716094",
    "units[0].practice[1].options[2] (question \"who-answers\")": "049788b51337dff32233e512810a067275f57319b0fae79071eb7828e980dfda",
    "units[0].practice[2].options[0] (question \"far-away\")": "7a712216f3d1d25f0dd34344dbd08d1091a451390c2dc13e6638490f91d40394",
    "units[0].practice[2].options[1] (question \"far-away\")": "da4a5db4d7717d167f497b1fd6edfa9df1ca0b81dfe15d4457caecf8df76cb57",
    "units[0].practice[0].prompt (question \"cache-hit\")": "7f7833696800ba1178de2c4e50bdbb6003626c0e522281a410cc3d79d175509e",
    "units[0].practice[1].prompt (question \"who-answers\")": "408f5f9280371e97ae28b4406ffdf10eba193c3efe5e7fa3024e5869259ce13e",
    "units[0].practice[2].prompt (question \"far-away\")": "11492fa55c79fe8208234b3206a58ccc6c81f9868fbbc40cddc058bd6ccfae7a"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: arp

Checked on 2026-11-14 by claude-opus-5-5, from the claim sheet and the sources fetched in this run. 91 items: 91 ✅, 0 ⚠️, 0 ❌.

## Claims

### units[0].osi — ✅

- `cisco-arp-config` §Layer 2 and Layer 3 Addressing
  > Some of the Layer 3 protocols used to perform the mapping are:
- `cloudflare-network-layer` §What is the OSI model?
  > Network layer: Handles the routing and sending of data between different networks. The most important protocols at this layer are IP, ICMP, ARP, and BGP.
- Note: Cisco lists ARP first among the Layer 3 mapping protocols right after this sentence; Cloudflare names ARP among the network-layer protocols. Two vendors from different publishers place ARP at OSI layer 3; no standard places it on the OSI model, and the project's settled rule lets a badge rest on two vendors' pages then. Many teaching texts put ARP between layers 2 and 3; no source met in this run puts it at a different single OSI layer.
- Note: Cisco's page is live (dated October 2026) for current IOS XE 17.x; Cloudflare's Learning Center page is live. Checked 2026-11-14.

### units[0].steps[0].deep[0] (step "who-has", Go deeper) — ✅

- `rfc-826` §Packet Generation
  > ar$op to ares_op$REQUEST, ar$sha with the 48.bit ethernet address
  > of itself, ar$spa with the protocol address of itself, and ar$tpa
  > with the protocol address of the machine that is trying to be
  > accessed.  It does not set ar$tha to anything in particular,
  > because it is this value that it is trying to determine.
- Note: RFC 826 is the defining standard for the ARP packet and its fields (sender hardware and protocol addresses, target protocol address, target hardware address). It is an Internet Standard, not obsoleted; it is updated by RFC 5227 and RFC 5494, neither of which changes these fields' meaning.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > SPA—Sender protocol address. Specifies the IP address of the sending device.
- Note: the claim leaves out that RFC 826 allows the target hardware field to hold the broadcast address and that RFC 5227 sets it to zero; either way it carries no answer, so the claim holds for a beginner.

### units[0].steps[1].deep[0] (step "only-the-owner", Go deeper) — ✅

- `rfc-826` §Packet Reception
  > ?Am I the target protocol address?
  > Yes:
  > If Merge_flag is false, add the triplet <protocol type,
  > sender protocol address, sender hardware address> to
  > the translation table.
- `rfc-826` §An Example
  > If Y's Internet module then
  > wants to talk to X, this will also succeed since Y has remembered
  > the information from X's request for Address Resolution.
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > When the switch
  > and Host B receive the ARP request, they populate their ARP caches with an ARP binding for a host with the IP address IA and
  > a MAC address MA
- Note: RFC 826 is the defining standard for ARP's reception procedure, which adds the asker's addresses before replying. Cisco's DAI guide, a different publisher's page, describes the same step. Both current (checked 2026-11-14).

### units[0].steps[2].deep[0] (step "cache-fills", Go deeper) — ✅

- `rfc-1812` §5.2.1.2
  > (10) The forwarder determines the Link Layer address of the packet's
  > next hop.
- Note: RFC 1812 is the defining standard for how an IPv4 router forwards a packet; its step 11 then wraps the datagram in a link-layer frame for the chosen interface. It is a Proposed Standard, not obsoleted; its updates (RFC 2644, RFC 6633) concern directed broadcasts and Source Quench, not this procedure.
- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- Note: RFC 894 is the defining standard for carrying IP over Ethernet frames; Internet Standard, not obsoleted.

### units[0].steps[3].deep[0] (step "send-again", Go deeper) — ✅

- `rfc-826` §Why is it done this way??
  > Periodic broadcasting is definitely not desired.
- `cisco-arp-config` §ARP Caching
  > This minimizes the use of valuable network resources to broadcast for the same address each
  > time a datagram is sent.
- `rfc-5227` §2.1
  > A host MUST NOT perform this check periodically as a matter of
  > course.
- Note: RFC 826 defines ARP and rejects periodic broadcasting in favour of asking as needed; RFC 5227 defines ARP probing and forbids running it on a schedule. Cisco states the same practice. All current (checked 2026-11-14).
- Note: leaves out the few start-up announcements of RFC 5227 and the unicast polls some stacks send to refresh an entry; neither is a timed broadcast.

### units[0].steps[4].deep[0] (step "entry-runs-out", Go deeper) — ✅

- `rfc-1122` §2.3.2.1
  > If this mechanism involves a timeout, it SHOULD be
  > possible to configure the timeout value.
- Note: RFC 1122 is the defining standard for host ARP cache validation and its timeout; Internet Standard, not obsoleted, and none of its updates touch section 2.3.2.
- `cisco-arp-config` §Static and Dynamic Entries in the ARP Cache
  > The default time limit is 4 hours. If the network has a great many routes that
  > are added and deleted from the cache, the time limit should be adjusted.
- `microsoft-arp-caching` §More information
  > You can change the "BaseReachable Time" value by typing the following example command at the command prompt:
- Note: "many devices" is a loose word; the standard says the timeout should be configurable, and two vendors show it can be.

### units[0].learn.lead[0] ("lead-1") — ✅

- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
  > originally determined by the routing mechanism.
- `rfc-826` §Packet Reception
  > Send the packet to the (new) target hardware address on
  > the same hardware on which the request was received.
- `rfc-826` §An Example
  > The next time X's Internet module tries to send
  > a packet to Y on the Ethernet, the translation will succeed
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > If there is no entry, the source device sends a broadcast message to every device on
  > the network. Each device compares the IP address to its own. Only the device with the matching IP address replies to the sending
  > device with a packet containing the MAC address for the device
- Note: RFC 826 defines ARP's request, reply and table. Leaves out proxy ARP, where a router answers for another host, and links (such as point-to-point) that need no MAC address.

### units[0].learn.lead[1] ("lead-2") — ✅

- Note: analogy. Calling out to a room, one person answering, and remembering them matches the broadcast request, the single reply and the cache; it does not mislead.

### units[0].learn.terms[0] ("term-arp") — ✅

- `rfc-826` §Abstract
  > Presented here is a protocol that allows dynamic
  > distribution of the information needed to build tables to
  > translate an address A in protocol P's address space into a
  > 48.bit Ethernet address.
- `rfc-826` §Packet Generation
  > ar$tpa
  > with the protocol address of the machine that is trying to be
  > accessed.
- `cisco-arp-config` §Address Resolution Protocol
  > ARP finds the hardware address,
  > also known as Media Access Control (MAC) address, of a host from its known IP address.
- `microsoft-arp` §Introduction
  > The arp command displays and modifies entries in the Address Resolution Protocol (ARP) cache.
- Note: RFC 826 defines ARP; the idea line puts its question in a beginner's words.

### units[0].learn.terms[1] ("term-mac") — ✅

- `rfc-9724` §2.1
  > A universally administered address is uniquely assigned to a device
  > by its manufacturer.  Most physical devices are provided with a
  > universally administered address
- `cisco-arp-config` §Layer 2 and Layer 3 Addressing
  > Layer 2 addresses are used for local transmissions between devices that are directly connected.
- Note: Cisco's same section says Ethernet uses MAC addresses burned in to the network interface card. RFC 9724 is Informational and current (March 2025).
- Note: leaves out locally administered and randomized MAC addresses, which RFC 9724 describes and which phones often use on Wi-Fi; most devices still have a manufacturer-assigned address, so the idea holds for a beginner.

### units[0].learn.terms[2] ("term-cache") — ✅

- `rfc-1122` §2.3.2.1
  > An implementation of the Address Resolution Protocol (ARP)
  > [LINK:2] MUST provide a mechanism to flush out-of-date cache
  > entries.
- Note: RFC 1122 is the current standard that sets the host requirements for the ARP cache (its entries and their flushing); the cache's content is confirmed by the vendor pages below.
- `microsoft-arp` §Introduction
  > The ARP cache contains one or more tables that are used to store IP addresses and their resolved Ethernet or Token Ring physical addresses.
- `cisco-arp-config` §Address Resolution Protocol
  > ARP maintains a cache (table) in which
  > MAC addresses are mapped to IP addresses.
- `openbsd-man-arp-4` §DESCRIPTION
  > ARP caches Internet-Ethernet address mappings.

### units[0].learn.terms[3] ("term-broadcast") — ✅

- `rfc-919` §3
  > Broadcasts are useful when a host needs to find information without
  > knowing exactly what other host can supply it
- Note: RFC 919 is the defining standard for broadcasting on IP networks; Internet Standard, not obsoleted. The same section says broadcasting is a fast way to reach all of a host's neighbours.
- `rfc-894` §Address Mappings
  > It should also use ARP to
  > translate Internet addresses to Ethernet addresses when needed.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > If there is no entry, the source device sends a broadcast message to every device on
  > the network.
- Note: the idea gives ARP's reason for broadcasting; RFC 919 also mentions broadcasts used to announce information, which the idea leaves out without ruling out.

### units[0].learn.terms[4] ("term-request") — ✅

- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
  > originally determined by the routing mechanism.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > the sending device sends an ARP request for the MAC address of the default gateway.
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > All
  > hosts within the broadcast domain receive the ARP request, and Host A responds with its MAC address.
- Note: RFC 826 defines the request. Leaves out unicast requests used to refresh an existing entry (RFC 1122, RFC 826's related issues), a less common case.

### units[0].learn.terms[5] ("term-reply") — ✅

- `rfc-826` §Packet Reception
  > Swap hardware and protocol fields, putting the local
  > hardware and protocol addresses in the sender fields.
- `rfc-826` §An Example
  > sets the
  > opcode to reply, and sends the packet directly (not broadcast) to
  > EA(X).
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Only the device with the matching IP address replies to the sending
  > device with a packet containing the MAC address for the device
- Note: RFC 826 defines the reply. Leaves out the broadcast replies RFC 5227 permits in some uses.

### units[0].learn.terms[6] ("term-gateway") — ✅

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a
  > particular destination, the host chooses a "default"
  > gateway and sends the datagram to it.
- Note: RFC 1122 is the defining standard for how a host picks a default gateway (its word "gateway" means a router). Internet Standard, not obsoleted.
- `microsoft-tcpip-subnetting` §Default gateways
  > In TCP/IP terms, a router that is specified on a host, which links the host's subnet to other networks, is called a default gateway.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > When the destination device lies on a remote network, one beyond another Layer 3 device, the process is the same except that
  > the sending device sends an ARP request for the MAC address of the default gateway.

### units[0].learn.terms[7] ("term-timeout") — ✅

- `rfc-1122` §2.3.2.1
  > If this mechanism involves a timeout, it SHOULD be
  > possible to configure the timeout value.
- Note: RFC 1122 is the defining standard for ARP cache validation and its timeout.
- `cisco-arp-config` §ARP Caching
  > ARP caching is the method of storing network addresses and the associated data-link addresses in memory for a period of time
  > as the addresses are learned.
- `openbsd-man-arp-4` §DESCRIPTION
  > These routes time out
  > periodically (normally 20 minutes after validated; entries are not validated
  > when not in use).
- Note: leaves out static entries, which never time out.

### units[0].learn.pattern ("pattern") — ✅

- `rfc-826` §Packet Generation
  > The Address Resolution module
  > tries to find this pair in a table.  If it finds the pair, it
  > gives the corresponding 48.bit Ethernet address back to the
  > caller (hardware driver) which then transmits the packet.
- `rfc-826` §Packet Reception
  > Set the ar$op field to ares_op$REPLY
- `rfc-826` §An Example
  > Machine X gets the reply packet from Y, forms the map from
  > <ET(IP), IPA(Y)> to EA(Y)
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > The source device adds
  > the destination device MAC address to its ARP table for future reference, creates a data-link header and trailer that encapsulates
  > the packet, and proceeds to transfer the data.
- `openbsd-man-arp-4` §DESCRIPTION
  > If a response is provided, the
  > new mapping is cached and any pending message is transmitted.
- Note: RFC 826 defines each step. The outline is marked as such; when the cache already has the answer, the middle steps are skipped, which the lesson teaches elsewhere.

### units[0].learn.why[0] ("why-1") — ✅

- `cisco-arp-config` §ARP Caching
  > To minimize broadcasts and
  > limit wasteful use of network resources, Address Resolution Protocol (ARP) caching was implemented.
- `rfc-826` §Why is it done this way??
  > The protocol described in this paper distributes information as
  > it is needed, and only once (probably) per boot of a machine.
- Note: RFC 826 defines ARP's ask-when-needed design.

### units[0].learn.why[1] ("why-2") — ✅

- `rfc-826` §Abstract
  > To actually transmit the Ethernet packet
  > a 48.bit Ethernet address must be generated.
- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- `cisco-arp-config` §Layer 2 and Layer 3 Addressing
  > Layer 2 addresses are used for local transmissions between devices that are directly connected.
- Note: RFC 826 and RFC 894 define address resolution and IP-over-Ethernet framing. Leaves out link types that carry no MAC address.

### units[0].learn.deep[0] ("deep-spoof", Learn's Go deeper) — ✅

- `cisco-dai` §Understanding Dynamic ARP Inspection
  > However,because ARP allows
  > a gratuitous reply from a host even if an ARP request was not received, an ARP spoofing attack and the poisoning of ARP caches
  > can occur. After the attack, all traffic from the device under attack flows through the attacker’s computer and then to the
  > router, switch, or host.
- `rfc-5227` §5
  > A malicious host may send fraudulent ARP packets on the network,
  > interfering with the correct operation of other hosts.
- Note: two independent sources (a Cisco guide and an IETF standard). RFC 5227 is a Proposed Standard, not obsoleted.

### units[0].learn.deep[1] ("deep-ipv6", Learn's Go deeper) — ✅

- `rfc-4861` §1
  > Nodes (hosts and routers) use
  > Neighbor Discovery to determine the link-layer addresses for
  > neighbors known to reside on attached links
- `rfc-4861` §3.1
  > The IPv6 Neighbor Discovery protocol corresponds to a combination of
  > the IPv4 protocols Address Resolution Protocol [ARP], ICMP Router
  > Discovery [RDISC], and ICMP Redirect [ICMPv4].
- Note: RFC 4861 is the defining standard for IPv6 Neighbor Discovery; it is a Draft Standard, not obsoleted, and its updates add to ND without returning IPv6 to ARP.

### units[0].learn.deep[2] ("deep-probe", Learn's Go deeper) — ✅

- `rfc-5227` §2.1
  > Before beginning to use an IPv4 address (whether received from manual
  > configuration, DHCP, or some other means), a host implementing this
  > specification MUST test to see if the address is already in use, by
  > broadcasting ARP Probe packets.
- `rfc-5227` §2.1.1
  > An ARP Request constructed this way, with an all-zero
  > 'sender IP address', is referred to as an 'ARP Probe'.
- `rfc-5227` §1.2
  > (1) that a specific ARP Request should be generated when an interface
  > is configured, to discover if the address is already in use
- Note: RFC 5227 is the defining standard for the ARP probe and IPv4 address conflict detection. "Many devices" is a loose word for the hosts that implement it.

### units[0].learn.facts[0] ("fact-defined") — ✅

- `rfc-826` §Title
  > November 1982
  > … An Ethernet Address Resolution Protocol
- Note: RFC 826 is the document that defines ARP; the RFC Editor lists it as an Internet Standard, not obsoleted (updated by RFC 5227 and RFC 5494).
- `rfc-5227` §1.2
  > This document does not modify any of the protocol rules in RFC 826.

### units[0].learn.facts[1] ("fact-osi") — ✅

- `cisco-arp-config` §Layer 2 and Layer 3 Addressing
  > Some of the Layer 3 protocols used to perform the mapping are:
- `cloudflare-network-layer` §What is the OSI model?
  > Network layer: Handles the routing and sending of data between different networks. The most important protocols at this layer are IP, ICMP, ARP, and BGP.
- Note: as for the OSI badge: two vendors from different publishers, ARP listed right after Cisco's sentence; placement on the OSI model is a teaching convention and some texts put ARP between layers 2 and 3.

### units[0].learn.facts[2] ("fact-job") — ✅

- `rfc-826` §Abstract
  > Presented here is a protocol that allows dynamic
  > distribution of the information needed to build tables to
  > translate an address A in protocol P's address space into a
  > 48.bit Ethernet address.
- `cisco-arp-config` §Address Resolution Protocol
  > ARP finds the hardware address,
  > also known as Media Access Control (MAC) address, of a host from its known IP address.
- Note: RFC 826 defines ARP's job.

### units[0].learn.facts[3] ("fact-arp") — ✅

- `rfc-826` §Packet Generation
  > ar$sha with the 48.bit ethernet address
  > of itself, ar$spa with the protocol address of itself
- `rfc-826` §Packet Reception
  > Negative conditionals indicate an end of processing and a
  > discarding of the packet.
- `rfc-826` §An Example
  > and broadcasts this packet to everybody on the cable.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Each device compares the IP address to its own. Only the device with the matching IP address replies to the sending
  > device with a packet containing the MAC address for the device
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > All
  > hosts within the broadcast domain receive the ARP request, and Host A responds with its MAC address.
- Note: RFC 826 defines the procedure; the reply goes straight back (the Example sends it directly, not broadcast), and the asker keeps it (the Example forms the map).
- Note: leaves out proxy ARP, and that a non-target that already holds the asker's entry refreshes it before dropping the question; "ignore" is true in the ordinary sense that it does not answer.

### units[0].learn.facts[4] ("fact-broadcast") — ✅

- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
  > originally determined by the routing mechanism.
- `rfc-894` §Address Mappings
  > should be mapped to the broadcast Ethernet address (of all binary
  > ones, FF-FF-FF-FF-FF-FF hex).
- `rfc-9542` §2.1.1
  > If
  > it is a one, the address is groupcast (multicast or broadcast).
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > All
  > hosts within the broadcast domain receive the ARP request
- `rfc-5227` §1.2
  > every host
  > implementing ARP is *already* required to process every received
  > ARP packet according to the Packet Reception rules specified in
  > RFC 826.
- Note: RFC 826 and RFC 894 (Internet Standards) define the broadcast and its all-ones address; RFC 9542 (BCP, current) only gives the group bit that the all-ones address has set.

### units[0].learn.facts[5] ("fact-cache-first") — ✅

- `rfc-826` §Packet Generation
  > If it finds the pair, it
  > gives the corresponding 48.bit Ethernet address back to the
  > caller (hardware driver) which then transmits the packet.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Before a device sends a datagram to another device, it looks in its ARP cache to see if there is a MAC address and corresponding
  > IP address for the destination device.
- `microsoft-arp-caching` §More information
  > If the entry is in the "Reachable" state, Windows Vista TCP/IP hosts do not send ARP requests to the network. Therefore, Windows Vista TCP/IP hosts use the information in the cache.
- Note: RFC 826 defines the lookup. Leaves out that some stacks send a unicast check on a stale entry.

### units[0].learn.facts[6] ("fact-frame") — ✅

- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- `rfc-826` §Abstract
  > To actually transmit the Ethernet packet
  > a 48.bit Ethernet address must be generated.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > creates a data-link header and trailer that encapsulates
  > the packet, and proceeds to transfer the data.
- Note: RFC 894 defines IP-over-Ethernet framing; RFC 826 defines the address resolution that supplies the frame's address.

### units[0].learn.facts[7] ("fact-life") — ✅

- `rfc-1122` §2.3.2.1
  > An implementation of the Address Resolution Protocol (ARP)
  > [LINK:2] MUST provide a mechanism to flush out-of-date cache
  > entries.  If this mechanism involves a timeout, it SHOULD be
  > possible to configure the timeout value.
- `cisco-arp-config` §ARP Caching
  > Dynamic entries are added by Cisco software, kept for a period of time, and then removed.
- `cisco-arp-config` §Static and Dynamic Entries in the ARP Cache
  > The default time limit is 4 hours.
- `openbsd-man-arp-4` §DESCRIPTION
  > These routes time out
  > periodically (normally 20 minutes after validated
- `microsoft-arp-caching` §More information
  > If an entry is not used for a time between 15 to 45 seconds, it changes to the "Stale" state.
- Note: RFC 1122 defines the flushing and its configurable timeout. Cisco (4 hours), OpenBSD (20 minutes) and Windows (15 to 45 seconds) show the time depends on the device. Windows marks an entry stale rather than deleting it; static entries never expire.

### units[0].learn.facts[8] ("fact-ask-again") — ✅

- `rfc-826` §Packet Generation
  > If it does not, it probably informs the caller that it is throwing the
  > packet away (on the assumption the packet will be retransmitted
  > by a higher network layer), and generates an Ethernet packet with
  > a type field of ether_type$ADDRESS_RESOLUTION.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > If there is no entry, the source device sends a broadcast message to every device on
  > the network.
- `microsoft-arp-caching` §More information
  > If an entry is in the "Stale" state, the Windows Vista TCP/IP host must send an ARP request to reach that destination.
- Note: RFC 826 defines the request made when the table lacks the pair. Leaves out the unicast check some stacks use for a stale entry.

### units[0].learn.facts[9] ("fact-local") — ✅

- `cisco-arp-config` §Proxy ARP
  > However, the router that separates the devices will not send a broadcast message because routers
  > do not pass hardware-layer broadcasts.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > When the destination device lies on a remote network, one beyond another Layer 3 device, the process is the same except that
  > the sending device sends an ARP request for the MAC address of the default gateway.
- `rfc-826` §Packet Generation
  > As a packet is sent down through the network layers, routing
  > determines the protocol address of the next hop for the packet
- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the
  > datagram is sent directly to the destination host; otherwise,
  > it has to be routed to a gateway on a connected network.
- Note: RFC 826 and RFC 1122 define next-hop resolution and gateway routing. Leaves out proxy ARP, where a router answers for a host beyond it.

### units[0].learn.facts[10] ("fact-command") — ✅

- `microsoft-arp` §Parameters
  > Displays the current ARP entries by querying the protocol data.
- `microsoft-arp` §Parameters
  > Deletes the ARP entry for the specified
- `microsoft-arp` §Examples
  > To display the arp cache tables for all interfaces, type:
- `openbsd-man-arp-8` §DESCRIPTION
  > Display all of the current ARP entries.
- `openbsd-man-arp-8` §DESCRIPTION
  > Delete an entry for the host called
- Note: on both pages the display passage is the -a option and the delete passage is the -d option; the Examples section runs arp -a. Two independent publishers. Both pages live (Microsoft updated 2025; OpenBSD current manual).

### units[0].learn.facts[11] ("fact-wait") — ✅

- `rfc-1122` §2.3.2.2
  > The link layer SHOULD save (rather than discard) at least
  > one (the latest) packet of each set of packets destined to
  > the same unresolved IP address, and transmit the saved
  > packet when the address has been resolved.
- `openbsd-man-arp-4` §DESCRIPTION
  > ARP will queue at
  > most one packet while waiting for a response to a mapping request; only the
  > most recently transmitted packet is kept.
- Note: RFC 1122 is the defining standard for the ARP packet queue; it updates RFC 826's throw-away behaviour.

### units[0].learn.facts[12] ("fact-name") — ✅

- `rfc-826` §Title
  > An Ethernet Address Resolution Protocol
- `cisco-arp-config` §Address Resolution Protocol
  > The Address Resolution Protocol (ARP) feature performs a required function in IP routing.
- `microsoft-arp` §Introduction
  > The arp command displays and modifies entries in the Address Resolution Protocol (ARP) cache.
- Note: RFC 826 defines and names the protocol.

### units[0].practice[0].options[0] (question "cache-hit") — ✅

- `rfc-826` §Packet Generation
  > If it finds the pair, it
  > gives the corresponding 48.bit Ethernet address back to the
  > caller (hardware driver) which then transmits the packet.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Before a device sends a datagram to another device, it looks in its ARP cache to see if there is a MAC address and corresponding
  > IP address for the destination device. If there is no entry, the source device sends a broadcast message to every device on
  > the network.
- Note: right answer, and the feedback is correct for it. RFC 826 defines the lookup.

### units[0].practice[0].options[1] (question "cache-hit") — ✅

- `rfc-826` §Packet Generation
  > If it does not, it probably informs the caller that it is throwing the
  > packet away
- `cisco-arp-config` §ARP Caching
  > To minimize broadcasts and
  > limit wasteful use of network resources, Address Resolution Protocol (ARP) caching was implemented.
- Note: wrong option, and the feedback is correct: the request is made only when the table lacks the pair (RFC 826, defining).

### units[0].practice[0].options[2] (question "cache-hit") — ✅

- `microsoft-arp-caching` §More information
  > If the entry is in the "Reachable" state, Windows Vista TCP/IP hosts do not send ARP requests to the network.
- `rfc-826` §Packet Generation
  > If it finds the pair, it
  > gives the corresponding 48.bit Ethernet address back to the
  > caller (hardware driver) which then transmits the packet.
- Note: wrong option, and the feedback is correct. Leaves out the unicast check some stacks send on a stale entry; the prompt's cache holds a usable answer.

### units[0].practice[1].options[0] (question "who-answers") — ✅

- `rfc-826` §Packet Reception
  > Negative conditionals indicate an end of processing and a
  > discarding of the packet.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Each device compares the IP address to its own. Only the device with the matching IP address replies to the sending
  > device with a packet containing the MAC address for the device
- Note: right answer, and the feedback is correct. A phone that already holds the laptop's entry refreshes it before dropping the question; "ignores" holds in the ordinary sense that it does not answer.

### units[0].practice[1].options[1] (question "who-answers") — ✅

- `rfc-826` §Packet Reception
  > ?Am I the target protocol address?
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > Only the device with the matching IP address replies to the sending
  > device with a packet containing the MAC address for the device
- Note: wrong option, and the feedback is correct: only the target replies (RFC 826, defining; proxy ARP left out).

### units[0].practice[1].options[2] (question "who-answers") — ✅

- `cisco-arp-config` §Proxy ARP
  > However, the router that separates the devices will not send a broadcast message because routers
  > do not pass hardware-layer broadcasts.
- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
  > originally determined by the routing mechanism.
- Note: wrong option, and the feedback is correct.

### units[0].practice[2].options[0] (question "far-away") — ✅

- `rfc-826` §Packet Generation
  > As a packet is sent down through the network layers, routing
  > determines the protocol address of the next hop for the packet
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > When the destination device lies on a remote network, one beyond another Layer 3 device, the process is the same except that
  > the sending device sends an ARP request for the MAC address of the default gateway.
- Note: right answer, and the feedback is correct. RFC 826 defines resolving the next hop's address.

### units[0].practice[2].options[1] (question "far-away") — ✅

- `cisco-arp-config` §Proxy ARP
  > However, the router that separates the devices will not send a broadcast message because routers
  > do not pass hardware-layer broadcasts.
- `cisco-arp-config` §Overview of the Address Resolution Protocol
  > the sending device sends an ARP request for the MAC address of the default gateway.
- `rfc-826` §Packet Generation
  > routing
  > determines the protocol address of the next hop for the packet
- Note: wrong option, and the feedback is correct.

## Traced, example, analogy and unbacked parts

### title — ✅

- Note: unbacked; "ARP" is the lesson's subject, named in its cited parts.

### units[0].name — ✅

- Note: unbacked; makes no claim beyond the cited parts.

### backing (the lesson's subtitle and summary) — ✅

- Note: traced; says only what term-arp, term-mac, fact-arp, fact-cache-first and why-1 state. The addresses are RFC 1918 example data.

### units[0].backing (the unit's full name and purpose) — ✅

- Note: traced to fact-name and fact-job.

### units[0].scene.backing (the scene) — ✅

- Note: traced; labels and the cache table repeat its Learn parts. Example values: example.net, 192.168.1.1 (RFC 1918) and 00:00:5E:00:53:01 (documentation MAC range).

### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: traced to why-2, term-mac, term-arp, fact-arp, fact-cache-first and why-1; adds nothing.

### units[0].overview.backing (the Overview description) — ✅

- Note: traced to fact-job, fact-cache-first, fact-life and fact-local.

### units[0].overview.facts[0] (Overview fact "Asks") — ✅

- Note: traced to term-request.

### units[0].overview.facts[1] (Overview fact "Answered by") — ✅

- Note: traced to fact-arp.

### units[0].overview.facts[2] (Overview fact "Kept in") — ✅

- Note: traced to term-cache.

### units[0].overview.facts[3] (Overview fact "Reaches") — ✅

- Note: traced to fact-local.

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

- Note: traced to fact-osi.

### units[0].overview.facts[5] (Overview fact "Defined in") — ✅

- Note: traced to fact-defined.

### units[0].steps[0] (step "who-has") — ✅

- Note: traced; every step (off-network so the gateway, cache empty, broadcast to ff:ff:ff:ff:ff:ff, giving its own address, the packet waits) is in the listed parts. 203.0.113.80 is RFC 5737 example data.

### units[0].steps[0].facts[0] (step "who-has", fact "Looking for") — ✅

- Note: traced to term-gateway and fact-local.

### units[0].steps[0].facts[1] (step "who-has", fact "In the cache") — ✅

- Note: traced to term-cache and fact-cache-first.

### units[0].steps[0].facts[2] (step "who-has", fact "Sent to") — ✅

- Note: traced to term-broadcast and fact-broadcast.

### units[0].steps[0].events[0] (event "s1-miss") — ✅

- Note: traced to term-cache and fact-cache-first.

### units[0].steps[0].events[1] (event "s1-ask") — ✅

- Note: traced; the MAC addresses are in the documentation range.

### units[0].steps[1] (step "only-the-owner") — ✅

- Note: traced to fact-broadcast, fact-arp, term-reply and term-mac; adds nothing.

### units[0].steps[1].facts[0] (step "only-the-owner", fact "Who answers") — ✅

- Note: traced to fact-arp and term-reply.

### units[0].steps[1].facts[1] (step "only-the-owner", fact "Sent to") — ✅

- Note: traced to fact-arp ("straight back").

### units[0].steps[1].facts[2] (step "only-the-owner", fact "Answer") — ✅

- Note: traced; example MAC address.

### units[0].steps[1].events[0] (event "s2-answer") — ✅

- Note: traced to term-reply and fact-arp.

### units[0].steps[2] (step "cache-fills") — ✅

- Note: traced to term-cache, fact-arp, fact-frame, fact-wait and pattern.

### units[0].steps[2].facts[0] (step "cache-fills", fact "Cache now") — ✅

- Note: traced to term-cache and fact-arp.

### units[0].steps[2].facts[1] (step "cache-fills", fact "Frame sent to") — ✅

- Note: traced to fact-frame.

### units[0].steps[2].facts[2] (step "cache-fills", fact "Packet for") — ✅

- Note: traced to fact-wait; example address.

### units[0].steps[2].events[0] (event "s3-add") — ✅

- Note: traced to term-cache and fact-arp.

### units[0].steps[2].events[1] (event "s3-packet") — ✅

- Note: traced to fact-frame and fact-wait.

### units[0].steps[3] (step "send-again") — ✅

- Note: traced to term-cache, fact-cache-first, fact-frame and why-1.

### units[0].steps[3].facts[0] (step "send-again", fact "In the cache") — ✅

- Note: traced to term-cache and fact-cache-first.

### units[0].steps[3].facts[1] (step "send-again", fact "Broadcasts") — ✅

- Note: traced to fact-cache-first and why-1.

### units[0].steps[3].facts[2] (step "send-again", fact "ARP messages") — ✅

- Note: traced to fact-cache-first ("asks nobody").

### units[0].steps[3].events[0] (event "s4-hit") — ✅

- Note: traced to term-cache and fact-cache-first.

### units[0].steps[3].events[1] (event "s4-packet") — ✅

- Note: traced to fact-cache-first and fact-frame.

### units[0].steps[4] (step "entry-runs-out") — ✅

- Note: traced to fact-life, term-timeout, fact-ask-again, fact-arp and fact-cache-first; adds nothing.

### units[0].steps[4].facts[0] (step "entry-runs-out", fact "The entry") — ✅

- Note: traced to fact-life and term-timeout.

### units[0].steps[4].facts[1] (step "entry-runs-out", fact "How long") — ✅

- Note: traced to fact-life.

### units[0].steps[4].facts[2] (step "entry-runs-out", fact "Then") — ✅

- Note: traced to fact-ask-again.

### units[0].steps[4].events[0] (event "s5-remove") — ✅

- Note: traced to term-timeout and fact-life.

### units[0].steps[4].events[1] (event "s5-miss") — ✅

- Note: traced to term-cache, fact-cache-first and fact-ask-again.

### units[0].steps[4].events[2] (event "s5-ask") — ✅

- Note: traced, as s1-ask.

### units[0].steps[4].events[3] (event "s5-answer") — ✅

- Note: traced, as s2-answer.

### units[0].steps[4].events[4] (event "s5-add") — ✅

- Note: traced, as s3-add.

### units[0].practice[0].prompt (question "cache-hit") — ✅

- Note: unbacked; no false premise (an entry in the cache is what fact-cache-first covers).

### units[0].practice[1].prompt (question "who-answers") — ✅

- Note: unbacked; a phone on the same Wi-Fi hears the broadcast, as fact-broadcast says.

### units[0].practice[2].prompt (question "far-away") — ✅

- Note: unbacked; no false premise; 203.0.113.80 is example data.

## Sources

- `rfc-826`: RFC Editor metadata lists it as an Internet Standard, not obsoleted; updated by RFC 5227 (read: it keeps RFC 826's generation and reception rules) and RFC 5494 (IANA guidelines for ARP values, no bearing on these claims). Current, checked 2026-11-14.
- `rfc-894`: Internet Standard, not obsoleted, no updates. Current, 2026-11-14.
- `rfc-919`: Internet Standard, not obsoleted, no updates. Current, 2026-11-14.
- `rfc-1122`: Internet Standard, not obsoleted; its updates (TOS, TCP, BFD, MPLS and others) leave sections 2.3.2 and 3.3.1 as cited. Current, 2026-11-14.
- `rfc-1812`: Proposed Standard, not obsoleted; updated by RFC 2644 and RFC 6633, not on next-hop resolution. Current, 2026-11-14.
- `rfc-4861`: Draft Standard, not obsoleted; its updates extend Neighbor Discovery. Current, 2026-11-14.
- `rfc-5227`: Proposed Standard, not obsoleted, no updates. Current, 2026-11-14.
- `rfc-9542`: Best Current Practice (obsoletes RFC 7042), not obsoleted. Current, 2026-11-14.
- `rfc-9724`: Informational, March 2025, not obsoleted. Current, 2026-11-14.
- `cisco-arp-config`: Cisco IOS XE 17.x configuration guide, live, dated October 2026. Current, 2026-11-14.
- `cisco-dai`: Cisco IOS XE 17.18.x Catalyst 9300 security guide, live, dated October 2026. Current, 2026-11-14.
- `cloudflare-network-layer`: Cloudflare Learning Center explainer, live (command-line read blocked by a check page, so read in the browser). Current, 2026-11-14.
- `microsoft-arp`: Microsoft Learn command reference, live, for current Windows and Windows Server. Current, 2026-11-14.
- `microsoft-arp-caching`: Microsoft Learn troubleshooting article, live, applies to supported Windows Server versions. Current, 2026-11-14.
- `microsoft-tcpip-subnetting`: Microsoft Learn troubleshooting article, live. Current, 2026-11-14.
- `openbsd-man-arp-4`: OpenBSD manual page, live, current release. Current, 2026-11-14.
- `openbsd-man-arp-8`: OpenBSD manual page, live, current release. Current, 2026-11-14.

## Limit overrides

None.
