```json fact-check
{
  "slug": "what-is-dns",
  "hash": "701861c3dc0196bbfea169f40c8f3b64e7c0832963ae2cafdd3771da6aef7e9b",
  "checked": "2026-11-11",
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
    "units[0].overview.facts[1] (Overview fact \"Port\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Who asks\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Answers kept\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"recursive-query\")": "✅",
    "units[0].steps[0].facts[0] (step \"recursive-query\", fact \"From\")": "✅",
    "units[0].steps[0].facts[1] (step \"recursive-query\", fact \"To\")": "✅",
    "units[0].steps[0].facts[2] (step \"recursive-query\", fact \"Asks for\")": "✅",
    "units[0].steps[0].facts[3] (step \"recursive-query\", fact \"Kind\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[1] (step \"root-referral\")": "✅",
    "units[0].steps[1].facts[0] (step \"root-referral\", fact \"Asks\")": "✅",
    "units[0].steps[1].facts[1] (step \"root-referral\", fact \"Answer\")": "✅",
    "units[0].steps[1].facts[2] (step \"root-referral\", fact \"Endings like .app\")": "✅",
    "units[0].steps[1].facts[3] (step \"root-referral\", fact \"Kept for\")": "✅",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[1].events[1] (event \"m3\")": "✅",
    "units[0].steps[1].events[2] (event \"learned-1\")": "✅",
    "units[0].steps[2] (step \"tld-referral\")": "✅",
    "units[0].steps[2].facts[0] (step \"tld-referral\", fact \"Asks\")": "✅",
    "units[0].steps[2].facts[1] (step \"tld-referral\", fact \"Answer\")": "✅",
    "units[0].steps[2].facts[2] (step \"tld-referral\", fact \"That server is\")": "✅",
    "units[0].steps[2].facts[3] (step \"tld-referral\", fact \"Kept for\")": "✅",
    "units[0].steps[2].events[0] (event \"m4\")": "✅",
    "units[0].steps[2].events[1] (event \"m5\")": "✅",
    "units[0].steps[2].events[2] (event \"learned-2\")": "✅",
    "units[0].steps[3] (step \"authoritative-answer\")": "✅",
    "units[0].steps[3].facts[0] (step \"authoritative-answer\", fact \"Asks\")": "✅",
    "units[0].steps[3].facts[1] (step \"authoritative-answer\", fact \"Answer\")": "✅",
    "units[0].steps[3].facts[2] (step \"authoritative-answer\", fact \"TTL\")": "✅",
    "units[0].steps[3].facts[3] (step \"authoritative-answer\", fact \"Other types\")": "✅",
    "units[0].steps[3].events[0] (event \"m6\")": "✅",
    "units[0].steps[3].events[1] (event \"m7\")": "✅",
    "units[0].steps[3].events[2] (event \"learned-3\")": "✅",
    "units[0].steps[4] (step \"response-and-caching\")": "✅",
    "units[0].steps[4].facts[0] (step \"response-and-caching\", fact \"Answer to the laptop\")": "✅",
    "units[0].steps[4].facts[1] (step \"response-and-caching\", fact \"Trips this time\")": "✅",
    "units[0].steps[4].facts[2] (step \"response-and-caching\", fact \"Next time\")": "✅",
    "units[0].steps[4].facts[3] (step \"response-and-caching\", fact \"Took\")": "✅",
    "units[0].steps[4].events[0] (event \"m8\")": "✅",
    "units[0].steps[0].deep[0] (step \"recursive-query\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"root-referral\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"tld-referral\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"authoritative-answer\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"response-and-caching\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.terms[0] (\"term-resolver\")": "✅",
    "units[0].learn.terms[1] (\"term-root\")": "✅",
    "units[0].learn.terms[2] (\"term-tld\")": "✅",
    "units[0].learn.terms[3] (\"term-referral\")": "✅",
    "units[0].learn.terms[4] (\"term-auth\")": "✅",
    "units[0].learn.terms[5] (\"term-a\")": "✅",
    "units[0].learn.terms[6] (\"term-ttl\")": "✅",
    "units[0].learn.terms[7] (\"term-cache\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-port\")": "✅",
    "units[0].learn.facts[1] (\"fact-types\")": "✅",
    "units[0].learn.facts[2] (\"fact-root\")": "✅",
    "units[0].learn.facts[3] (\"fact-encrypted\")": "✅",
    "units[0].learn.facts[4] (\"fact-defined\")": "✅",
    "units[0].learn.facts[5] (\"fact-used\")": "✅",
    "units[0].learn.facts[6] (\"fact-who\")": "✅",
    "units[0].learn.facts[7] (\"fact-ttl\")": "✅",
    "units[0].learn.facts[8] (\"fact-cache\")": "✅",
    "units[0].learn.facts[9] (\"fact-osi\")": "✅",
    "units[0].practice[0].options[0] (question \"root-referral\")": "✅",
    "units[0].practice[0].options[1] (question \"root-referral\")": "✅",
    "units[0].practice[0].options[2] (question \"root-referral\")": "✅",
    "units[0].practice[1].options[0] (question \"cached\")": "✅",
    "units[0].practice[1].options[1] (question \"cached\")": "✅",
    "units[0].practice[1].options[2] (question \"cached\")": "✅",
    "units[0].practice[0].prompt (question \"root-referral\")": "✅",
    "units[0].practice[1].prompt (question \"cached\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-ports",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-root-db-app",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-root-servers",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-root-zone",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-root-zone-file",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "icann-rssac-faq",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-365-add-domain",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-ipconfig",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-traffic-manager",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1034",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1035",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-2132",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3596",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3833",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-4033",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-5452",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-5625",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7720",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7766",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7858",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8305",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8484",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8555",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8767",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8806",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9076",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9156",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9499",
      "current": true,
      "checked": "2026-11-11"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 134,
    "digest": "2856f13d18a9ef05501a019d706d2607f4c028cbe027164d5b4cd895e25f459a",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-traffic-manager": "7c40c39be0bdbb661df541622895e92665da582e4ea0daa4c9ffd2ab22f2d457",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a",
      "rfc-9499": "270b62df854911dddd246f6c081952106897983a5e02dfe8b3819d72843d9ab1",
      "rfc-9076": "72f6af2881db0300033c3ea7d02f37bf0cd3da09b747eda8b22b8032a4878bf0",
      "rfc-2132": "0cfbedab7cfe859624ae78c07a722bc51bf8ea123a7b43b099fc546ddcf00b90",
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-3596": "2a3d44744086f66a7ba00e7d282dc1f740a3e0b63b4b6f7c763ffc0e61ee1dbb",
      "rfc-8305": "9bb65e288b32acae072d1bf403c609f71c32ea7a5087d0056ee9af3cedca47e1",
      "iana-root-servers": "8fa824eb44720792e0f691eb462d275adf31a012f2c407c02be1d8e116e10b14",
      "iana-root-zone-file": "9adbc5167bf474ae1cdcfc14a5e7c439886eb00bf0969d6d85ef8d5f025f3fd7",
      "icann-rssac-faq": "bcef238c4870294e6906cb0bcae9256cf4f054daec554538b6e2da8bcff2211a",
      "iana-root-db-app": "ed81572feba247f27cc2e557f3aa6cd932797bf0df61a08dee7087c5f5fb687e",
      "rfc-8806": "c9eaa51045e2cca3ed53b15ea8a3faf3dccd27c7fd3f555f0f7e76736c5fa3dc",
      "rfc-8555": "a40983bbf91f2bd3a976d1c16520aa4418c02ba6d6f1ddcaf772881f823b2497",
      "microsoft-365-add-domain": "4de00e6b14c73882c89ca2bc27c1581322262cd1e1dd89e8d510c105afa5e4eb",
      "microsoft-ipconfig": "465cb5a0f45fc18f4ba87f621a14b9b9891a7cf8dc7618e55500f4d9c688fbd5",
      "rfc-5452": "53af0365af1c491204ae27b523699b7732f79cf606ce84fab3b032df7a966c6b",
      "rfc-3833": "cf91742fee8456127dac921deca98e46b3e9c2b38421f9c8e45a9a31c887a8aa",
      "rfc-4033": "b6803149a879dff56cbaffcb8c5a1795d2a2d2facdc3400ebd9937e38724e4cd",
      "iana-root-zone": "c14aa1b74f65280f4d05bd80461cc1c3bc62e26320955a2c97b1232fc93d9213",
      "rfc-7720": "4257c69cb6eb49e92819d9f44b5456c3ec702aa737c5256cc9c9cf3ad89c48fd",
      "rfc-8767": "60841115fa4edc1918ef5cd423ca73c99f9e4e192466729941e55e0537bb6bc4",
      "rfc-7766": "9fbf70d43e5c423c2464eafd724ef164490b4d8e341e5d9b5fe1023402bb404f",
      "rfc-8484": "c2cb41fb72bf45935ba7372fef9d83478ed2ecc7f3749ea9a16b52b06ef0f343",
      "rfc-7858": "872e634c8d5ca4219a90147d356570e7d10046ad12d560e7d8b24f3aa340fdf0",
      "rfc-9156": "50b4bcfc02fff681ecaeb9d4043bd395c560e31bb28c90230cd60475203f93d0",
      "iana-ports": "effec1145145a05374af14992086722392fe258e6f4ac69011c250bfd927a15b",
      "rfc-5625": "2eb24e4bc70faaddb57fb0786e5e60916b9080c1fd012719722b9a27f91cbade"
    }
  },
  "items": {
    "title": "5865448762f180dcf07a5cb9e2cf5d958579ab54cdbfcf55735bac73f991bf9c",
    "units[0].name": "e9c4d1c220aeb73cc95216ee1e0e64c8c747b45c75e885270f928bf5105b77a9",
    "units[0].osi": "1f6e44fb1bedaaa2f8dd96959c5b64351fe9c8240572caebe906480193f5bf99",
    "backing (the lesson's subtitle and summary)": "88f4afb11a096d056bcd73589de06b134bab32c2a75182d98606eeb0770d4b64",
    "units[0].backing (the unit's full name and purpose)": "ac70cc464970992aaf51caec44a0f644e5daf24168b4fcad6659ddfe211e1e2d",
    "units[0].scene.backing (the scene)": "af7c535033b34f18804cbdf4c43caee7a6b5ed0edeb92df3f6ef69ff305bcd44",
    "units[0].overview.hookBacking (the Overview hook)": "d0019c9de831450a1c73dc44f1d832e8cd5a0bdc4cb1edeb38d0434d921e1f61",
    "units[0].overview.backing (the Overview description)": "aec81b2cdeb1a728c9626ffdf6956d0475a3f77dcbb8ec507abdd55bbc1a1594",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "dad3e3833b68e48673b98c2586623e0e68521b9519c3333dfa8f568d9e796079",
    "units[0].overview.facts[1] (Overview fact \"Port\")": "7365a106a0fd4916c9270b81398af1e29bb7c5251373e5a838e273c58a10ee64",
    "units[0].overview.facts[2] (Overview fact \"Who asks\")": "4cd837d8a15bded2602b11152825225584dab2d1bd675e7173ac5d5288c15bb9",
    "units[0].overview.facts[3] (Overview fact \"Answers kept\")": "7b6dd9ff5532e4490161b1105a26dfc751dbc847ad24fb028efa9239ca77b583",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "33728f08a7c17d7e8aa226ec05570ccda2c731484659b99d2c5c6741af4efdf4",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "5017aa2f3a9bcb2ef5892486a2b0849fb166a402856d9790308e917dd6b982d2",
    "units[0].steps[0] (step \"recursive-query\")": "9edb584c526b06f2a9b42db9d7020816ca3bb22c226eeb3d280c7c17e9b2dd94",
    "units[0].steps[0].facts[0] (step \"recursive-query\", fact \"From\")": "e1fa2a82ec44d0bc5a51c2a792886ab845c0cccb481586e30b7af38dc5b335d7",
    "units[0].steps[0].facts[1] (step \"recursive-query\", fact \"To\")": "0a2c4705c730480acd67f941272916d1548e8f440f9003d69cf63ba44bc9d3d8",
    "units[0].steps[0].facts[2] (step \"recursive-query\", fact \"Asks for\")": "044ec701d0ed5afd87e56224113fc73175ffb819d61361e6994be2f63660576c",
    "units[0].steps[0].facts[3] (step \"recursive-query\", fact \"Kind\")": "9a5b3ca9ac8b7941c92127e778313334a40907f47e1fcde3f159e6b47e1a33df",
    "units[0].steps[0].events[0] (event \"m1\")": "0733922f390da05763eb08a7c1d17953ab45c9d92b37b2531b673e29a2947ff8",
    "units[0].steps[1] (step \"root-referral\")": "114079b301b8c97a940d1f6a248b557f05cd9607bb2c99b5e1853ab759bd9f23",
    "units[0].steps[1].facts[0] (step \"root-referral\", fact \"Asks\")": "7da3b657a5072fba283439cec1229773f9272e86100d70f09fe27ca3d19f700c",
    "units[0].steps[1].facts[1] (step \"root-referral\", fact \"Answer\")": "5d12f4fd3c7e57d3bc5fcb1c764cda9180821ac32d2ea68f77ef6fd3aa69c78d",
    "units[0].steps[1].facts[2] (step \"root-referral\", fact \"Endings like .app\")": "fab85c8fa328661bbae5b6c44c02e90a1a5126a6d11e58d4866fa2678eae664a",
    "units[0].steps[1].facts[3] (step \"root-referral\", fact \"Kept for\")": "6e498874afad4451ba1f2e858583510fbe5fd379d547812006a8233dd28f29c8",
    "units[0].steps[1].events[0] (event \"m2\")": "0519b7b7d9cdb4e65239a422782056da44e8b57d398f50a0405bafcbc6e8f68e",
    "units[0].steps[1].events[1] (event \"m3\")": "5d57689f7cfe97d1a049deaba8ecfc265b39d99b7dd4b4d14b5f6411a33c6695",
    "units[0].steps[1].events[2] (event \"learned-1\")": "2d87d4e819129eaafe23e30bb8dd6eb1bb453a01b81aa19fedeeb470738d9577",
    "units[0].steps[2] (step \"tld-referral\")": "6921ce95c6f9293f7aed3c200d6c2ff7c6b7c6fde8edb0c31d940ea0db94998e",
    "units[0].steps[2].facts[0] (step \"tld-referral\", fact \"Asks\")": "8e7a83908179a8ca2846b36528ff3a00d0326e8a1dfb18ff6af70487c2924a37",
    "units[0].steps[2].facts[1] (step \"tld-referral\", fact \"Answer\")": "5a187c3a481da4b41940c8630ab74ab94b4f09302fda4e7a282440e8b82fe0f8",
    "units[0].steps[2].facts[2] (step \"tld-referral\", fact \"That server is\")": "07f1b6ecafe222795e5e03cdf31e22652716b70765a246d815f1b5270a8d5ee8",
    "units[0].steps[2].facts[3] (step \"tld-referral\", fact \"Kept for\")": "dec1216e19b37319f910e790db12ee2cb5a8548d3da7d4f598c7f53834df6cbb",
    "units[0].steps[2].events[0] (event \"m4\")": "1d2835ece76048486c4d86acee5e0f9768513c1b27784d641bd720dbd7668522",
    "units[0].steps[2].events[1] (event \"m5\")": "1c18431720a57b76d24209d2de21e25b0ae2810146cffbd4754a7306114f5ed7",
    "units[0].steps[2].events[2] (event \"learned-2\")": "30cd55e099f90e65e4f754406d458f618e102b0c0d4cabfe71f45901f568596a",
    "units[0].steps[3] (step \"authoritative-answer\")": "0384060320281144800f0eab3d41581c7fa62821c90fea6ef48d6ae239dabb1f",
    "units[0].steps[3].facts[0] (step \"authoritative-answer\", fact \"Asks\")": "ccc2af630617c7f0b616dbc6ed76e0816323a9e837f2d71f486469531dec2f7b",
    "units[0].steps[3].facts[1] (step \"authoritative-answer\", fact \"Answer\")": "44afe4b718b674159a2f29be2d9862906705203f736a60f36922493fd10a5568",
    "units[0].steps[3].facts[2] (step \"authoritative-answer\", fact \"TTL\")": "d3b3cdecf8b791cca7c8352382f20307e31efcb34f29132add714f405c12e880",
    "units[0].steps[3].facts[3] (step \"authoritative-answer\", fact \"Other types\")": "08b7c1c1d54604d4007d056c00cc4fafa20d745e6bcd4a36f3d676361829be61",
    "units[0].steps[3].events[0] (event \"m6\")": "cb7e5858542b50fc8d0e402be28ff155fe77543acfbc56bdbbbc0d0a64d3d748",
    "units[0].steps[3].events[1] (event \"m7\")": "f8145b1e111a17b35a5356ed67b4180288fad3da8ab52c9901c26aadf221c458",
    "units[0].steps[3].events[2] (event \"learned-3\")": "21451abb4622fba70c63dfca9c0b0633d59f24a8c5960aa1de8da2d0737385f3",
    "units[0].steps[4] (step \"response-and-caching\")": "b9c973a943fcfd59b5f9edee452caf6daea6feb5f10c34ba924408444475dea7",
    "units[0].steps[4].facts[0] (step \"response-and-caching\", fact \"Answer to the laptop\")": "d26b37ab61e19ae61c314af852cb0dd98958283293f2c1fa44a049e58fd89265",
    "units[0].steps[4].facts[1] (step \"response-and-caching\", fact \"Trips this time\")": "9d1c12823a1f78a1b3063bc79f034e4917f0863a4652bc0e7b580726c82b1bd5",
    "units[0].steps[4].facts[2] (step \"response-and-caching\", fact \"Next time\")": "18cf0eab93b5402ca89966cc61e575479dadae8e23dc188c0317cc41e51f97bb",
    "units[0].steps[4].facts[3] (step \"response-and-caching\", fact \"Took\")": "f4e8bcc6b7983dd9d97741500297acd2ad49e82c386fd73019cc41e584ea89a3",
    "units[0].steps[4].events[0] (event \"m8\")": "988db72cfd42c735d252f13c17119fc4f428b566b1e1ed2589b6536c16396025",
    "units[0].steps[0].deep[0] (step \"recursive-query\", Go deeper)": "da80a15b5e13afd57e7a7f80fbc1feac87272e12fa5746630781c76dfbe95c01",
    "units[0].steps[1].deep[0] (step \"root-referral\", Go deeper)": "a3b6766d7b8378362d2fba82badd6643b92c607a0f1e119aa4c8c6ad5662350e",
    "units[0].steps[2].deep[0] (step \"tld-referral\", Go deeper)": "8c79acec6abc992fbaa0c89e60c2caf5349968e142b06d9dfd3c505e680dd764",
    "units[0].steps[3].deep[0] (step \"authoritative-answer\", Go deeper)": "c5e5fe768069660793133e32b13d377d8f8940242e6219d5799755b3338b74fd",
    "units[0].steps[4].deep[0] (step \"response-and-caching\", Go deeper)": "acd69fb373cf9b0071dd8ffa50c46d939f04e5425fdbd411b3fe2437028cba21",
    "units[0].learn.lead[0] (\"lead-1\")": "8b4f88ccd8f6ae1fc6f7ce58fae7769405ac4265f3731fdae26d95de5315d56a",
    "units[0].learn.terms[0] (\"term-resolver\")": "096443a075539f057b89095bda51bca4e113bd149b561289d1982807cb61816e",
    "units[0].learn.terms[1] (\"term-root\")": "211ce54867115a386973e27a29049f550cf8f045fc7b575b66a52c54ce9824fc",
    "units[0].learn.terms[2] (\"term-tld\")": "915facca18d607c583da2a0e4fc5126be7904a795b5ddc8d7951352923b9ada2",
    "units[0].learn.terms[3] (\"term-referral\")": "b7c4b406ab9885ade1ca25946467d643ab5fba601a477d471c5005b54b58aaba",
    "units[0].learn.terms[4] (\"term-auth\")": "8a7e3c2851360b27b1b2c3ab4f1fe5d0f90329c6e821650043530d8e8feddfe1",
    "units[0].learn.terms[5] (\"term-a\")": "e1fbbaca1e8a7984fa5e439c9a6810b76c9e341e42eaf0b2703727baff8b6c1b",
    "units[0].learn.terms[6] (\"term-ttl\")": "61ff8ba0f5d3c2b80f9b0f8f814384b49b2e3ccaf6ef2e14765cd0fb5b0da934",
    "units[0].learn.terms[7] (\"term-cache\")": "4fd66e21f0cef7fe918c3f5cd56b6293e70e2f418b49f307204b7d761bbf4188",
    "units[0].learn.pattern (\"pattern\")": "b006cc76c0b3a26d84dd603e9ee63cab18c9dc25c10deadbb89365be95b510af",
    "units[0].learn.why[0] (\"why-1\")": "ca37d5029b8d1470b9f7299b7d1bbac01de81b7a8788c4ddf194c3d83a33413d",
    "units[0].learn.why[1] (\"why-2\")": "58d34aecfeea932a44152f05fba592fca038edcc7d0172e1e6be34674de6e9ac",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "6ac146ae06b2d667162e3c166b28f1d4622e2203ebacad7ecbe5a6f30ffd05e5",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "17ecf910b41275094e8936bd082d07fc19231882bea83376da021a10da80d9c8",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "d019b99b0157eb6b0f1c672a2e21fbdea1ecf338d92caf94cc82b272b4b7389d",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "0dec0b94b8beff6b90e5a34ddf297b4b6e1765195aa7aed81100b9483d7739a8",
    "units[0].learn.facts[0] (\"fact-port\")": "7cd2c8285b49b60d49e41ff940f00cd55cbb8b987a9c2a111efe2daad5ef4202",
    "units[0].learn.facts[1] (\"fact-types\")": "b0db2c2d42d417dc436ef4aa63af890199cc75cc1c58bc0201e4b52aa1b04630",
    "units[0].learn.facts[2] (\"fact-root\")": "6056c4b3092cb1df79a3e50f9944ca122ffeb3030d883f63f93f3fa83d0445fd",
    "units[0].learn.facts[3] (\"fact-encrypted\")": "da4fb682e3bcd2fe88d7b015db95463990f3195b8eadbc5a1d5138759f592853",
    "units[0].learn.facts[4] (\"fact-defined\")": "6267c64498ea0a388b8ac9bd83c7148dabbd4739a21acae6619ead8a743855f7",
    "units[0].learn.facts[5] (\"fact-used\")": "ff7d018b26db650003e7559cca894532ebf532d7bf728350302c06b2cea839a7",
    "units[0].learn.facts[6] (\"fact-who\")": "98058afe89d83da67d79f22d6be0728a978ee9ea28b361f07407671b804ae83d",
    "units[0].learn.facts[7] (\"fact-ttl\")": "c60d8303e5306340d7af6a53012e86b3c42eb5432094a987ce7ba269e40e213a",
    "units[0].learn.facts[8] (\"fact-cache\")": "28b71909e50d579b7eb3c2abfafe080db3b474d05c7c8a50aec9785adab3472f",
    "units[0].learn.facts[9] (\"fact-osi\")": "2280ecbe717815f9e5cd31f6882ba8a8f2b081390472748961cc9d0467dd4f0d",
    "units[0].practice[0].options[0] (question \"root-referral\")": "ce31a20029c98bca1fc7a02b5b4fb4a531215851ff243c02a137aeff644fbbad",
    "units[0].practice[0].options[1] (question \"root-referral\")": "f8464f7de21483961ccdaf4a5e98375d3fc0fbcfdca12e42ffc7157d724a4242",
    "units[0].practice[0].options[2] (question \"root-referral\")": "89c435c755a2a93aa6b6731e55fdb6ab3977a32d79d339bc65d01d55ba823585",
    "units[0].practice[1].options[0] (question \"cached\")": "a82aac0285309b4dde0f6bff12706145ff67660f5f26dbf468129dbf65258222",
    "units[0].practice[1].options[1] (question \"cached\")": "24af248c6b4ac4ce693852a1e234287eaf8ba53029d4337320e4c78c36a53d2a",
    "units[0].practice[1].options[2] (question \"cached\")": "572ebd1449976da38f9d5a68cfa0bc7e8b5e603ec3572ea5e8d1cee9c7f25ccf",
    "units[0].practice[0].prompt (question \"root-referral\")": "f261ffcc69c17f81fd14646f94ee218a4760edd8e8ac90c23bccce471909a098",
    "units[0].practice[1].prompt (question \"cached\")": "1fe0f3e1fbfe0197e2b34d7555a7aab6501065bc44f07895a3331399d2d53249"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-dns

Checked 2026-11-11 by claude-opus-5-5. Every source was fetched in this run from its publisher; RFCs as plain text from rfc-editor.org, with each RFC's info page read for obsoletion.

## Claims

### units[0].osi — ✅

- `cloudflare-network-layers` §Network Layers
  > 7 Application layer HTTP, DNS
- `microsoft-traffic-manager` §How Traffic Manager works
  > Traffic Manager works at the DNS level which is at the Application layer (Layer-7).
- Note: two vendors on different sites each place DNS at layer 7. No standard places DNS on the OSI model; the owner's rule allows two vendors' pages for the badge. Both pages are live (Cloudflare updated Oct 2026, Microsoft dated June 2026).

### units[0].steps[0].deep[0] (step "recursive-query", Go deeper) — ✅

- `rfc-1034` §4.3.1
  > The simplest mode for the client is recursive, since in this
  > mode the name server acts in the role of a resolver and
  > returns either an error or the answer, but never referrals.
- `rfc-9499` §6
  > Recursive query: A query with the Recursion Desired (RD) bit set to
  > 1 in the header.
- `rfc-9076` §5.1
  > For most residential networks and potentially other networks, the typical
  > case is for the user's device to be configured (typically
  > automatically through DHCP or relay agent options) with the
  > addresses of the DNS proxy
- `rfc-2132` §3.8
  > The domain name server option specifies a list of Domain Name System
  > (STD 13, RFC 1035 [8]) name servers available to the client.
- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §3.4.1
  > ADDRESS A 32 bit Internet address.
- `rfc-3596` §2.1
  > The AAAA resource record type is a record specific to the Internet
  > class that stores a single IPv6 address.
- `rfc-8305` §3
  > When a client has both IPv4 and IPv6 connectivity and is trying to
  > establish a connection with a named host, it needs to send out both
  > AAAA and A DNS queries.
- Note: RFC 1034 defines recursive mode, RFC 2132 the DHCP option that carries the resolver's address, RFC 1035 the A type and its 32-bit (IPv4) data, RFC 3596 the AAAA type. All are current.
- Note: the claim says browsers; RFC 8305 says clients with both IPv4 and IPv6 connectivity. True in the ordinary case on a dual-stack network.

### units[0].steps[1].deep[0] (step "root-referral", Go deeper) — ✅

- `iana-root-servers` §Root Name Servers
  > are a network of hundreds of servers in many countries around the world. They are configured in the DNS root zone as 13 named authorities
- `iana-root-zone-file` §The root zone’s NS records
  > . 518400 IN NS a.root-servers.net.
- `iana-root-zone-file` §The root zone’s NS records
  > . 518400 IN NS m.root-servers.net.
- `icann-rssac-faq` §1.1
  > While today there remain 13 RSIs, there are in fact more than 1500 anycast instances in operation throughout the world.
- `rfc-9499` §2
  > A Top-Level Domain is a zone that is one
  > layer below the root, such as "com" or "jp".
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- `iana-root-zone-file` §The app. NS records
  > app. 172800 IN NS ns-tld1.charlestonroadregistry.com.
- `rfc-8806` §1
  > because the TTL for most TLDs is usually long-lived (on the
  > order of a day or two) and is thus usually already in the cache of
  > the recursive resolver
- `rfc-9499` §5
  > TTL: The maximum "time to live" of a resource record.
- `rfc-9499` §6
  > An
  > instance of a server, such as a root server, is often referred to
  > as an 'Anycast instance'.
- Note: the root zone file is the live root zone itself; it defines the root's NS set (a to m) and the .app delegation, whose TTL of 172800 seconds is two days.
- Note: "hundreds of copies" is IANA's own wording; ICANN's RSSAC counts more than 1500 instances, which is still hundreds in the plain sense. "Up to two days" holds for the TLD delegations in the root zone; a resolver may keep them for less.

### units[0].steps[2].deep[0] (step "tld-referral", Go deeper) — ✅

- `rfc-9499` §2
  > A Top-Level Domain is a zone that is one
  > layer below the root, such as "com" or "jp".
- `iana-root-db-app` §.app Top-Level Domain
  > NS ns-tld1.charlestonroadregistry.com
- `rfc-9499` §6
  > Authoritative server: "A server that knows the content of a DNS zone
  > from local knowledge, and thus can answer queries about that zone
  > without needing to query other servers."
- `rfc-1034` §4.1
  > A given zone will be available from several name servers to insure its
  > availability in spite of host or communication link failure. By
  > administrative fiat, we require every zone to be available on at least
  > two servers
- Note: RFC 1034 defines the zone and its server requirements. "Most sites" understates a requirement that applies to every zone; nothing false follows.
- Note: "not from memory" puts "local knowledge, without querying other servers" into plain words.

### units[0].steps[3].deep[0] (step "authoritative-answer", Go deeper) — ✅

- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §3.2.2
  > CNAME 5 the canonical name for an alias
- `rfc-1035` §3.2.2
  > MX 15 mail exchange
- `rfc-1035` §3.2.2
  > NS 2 an authoritative name server
- `rfc-1035` §3.3.14
  > TXT RRs are used to hold descriptive text.
- `rfc-3596` §2.1
  > The AAAA resource record type is a record specific to the Internet
  > class that stores a single IPv6 address.
- `rfc-8555` §8.4
  > When the identifier being validated is a domain name, the client can
  > prove control of that domain by provisioning a TXT resource record
- `microsoft-365-add-domain` §Add a domain to Microsoft 365
  > After you add the TXT DNS record and verify domain ownership
- `rfc-1034` §3.6
  > The TTL is assigned by the administrator for the zone where the
  > data originates.
- `rfc-1034` §3.6
  > If a change can be anticipated, the TTL can be reduced prior to
  > the change to minimize inconsistency during the change
- Note: RFC 1035 defines the A, CNAME, MX, NS and TXT types, RFC 3596 the AAAA type, RFC 1034 the TTL and who sets it. "Notes" for descriptive text and "the site owner" for the zone's administrator are everyday words; the owner may delegate this to a DNS host. TXT for proving ownership is confirmed by two independent sources (RFC 8555 and Microsoft).

### units[0].steps[4].deep[0] (step "response-and-caching", Go deeper) — ✅

- `microsoft-ipconfig` §Parameters
  > Displays the contents of the DNS client resolver cache, which includes both entries preloaded from the local Hosts file and any recently obtained resource records for name queries resolved by the computer.
- `rfc-1034` §5.3.2
  > Since resolvers are responsible for
  > discarding old RRs whose TTL has expired
- `rfc-9499` §6
  > In
  > general, a recursive resolver is expected to cache the answers it
  > receives
- `rfc-5452` §3
  > Once spoofed, a caching server will repeat the data it
  > wrongfully accepted, and make its clients contact the wrong, and
  > possibly malicious, servers.
- `rfc-3833` §2.3
  > By checking signatures, a resolver can
  > determine whether the data associated with a name really was inserted
  > by the delegated authority for that portion of the DNS name space.
- `rfc-5452` §7.2
  > the attacker has a
  > new window of opportunity each time the TTL 'TTL' of the target
  > domain expires.
- `rfc-4033` §3.1
  > If a
  > security-aware resolver reliably learns a zone's public key, it can
  > authenticate that zone's signed data.
- `rfc-4033` §1
  > The DNS security extensions provide origin authentication and
  > integrity protection for DNS data
- Note: RFC 1034 defines the resolver cache and TTL expiry; RFC 4033 defines DNSSEC. Both current (RFC 4033 updated by RFC 6014 and 6840, which do not change this).
- Note: the laptop's cache is shown by Microsoft for Windows; not every operating system keeps one, which the claim leaves out.

### units[0].learn.lead[0] ("lead-1") — ✅

- `rfc-1034` §5.3.3
  > b. if the response contains a better delegation to other
  > servers, cache the delegation information, and go to
  > step 2.
- `rfc-9499` §6
  > Stub resolvers generally depend on a recursive resolver to
  > undertake the actual resolution function.
- `rfc-9499` §6
  > In iterative resolution, the client repeatedly makes non-recursive
  > queries and follows referrals and/or aliases.
- Note: RFC 1034 defines the resolver algorithm. "Four servers, four trips" describes this lesson's walk with an empty cache (the laptop to the resolver, then root, TLD and the site's server); a warm cache needs fewer.

### units[0].learn.terms[0] ("term-resolver") — ✅

- `rfc-1034` §2.4
  > RESOLVERS are programs that extract information from name
  > servers in response to client requests.
- `rfc-9499` §6
  > Resolver: A program "that extract[s] information from name servers
  > in response to client requests."
- Note: RFC 1034 defines the resolver.

### units[0].learn.terms[1] ("term-root") — ✅

- `iana-root-zone` §Root Zone Management
  > The Domain Name System (DNS) root zone is the highest-level of the naming hierarchy, principally composed of delegations of top-level domains
- `rfc-7720` §1
  > The root servers are authoritative servers of the unique [RFC2826]
  > root zone (".") [ROOTZONE].
- Note: IANA and RFC 7720 together state that root servers serve the top zone, made of the TLD delegations; two independent sources. "Who knows each ending" means it knows where each ending is delegated.

### units[0].learn.terms[2] ("term-tld") — ✅

- `rfc-9499` §2
  > A Top-Level Domain is a zone that is one
  > layer below the root, such as "com" or "jp".
- `rfc-9499` §2
  > Most of
  > them are also delegation-centric zones
- `rfc-9499` §7
  > Delegation-centric zone: A zone that consists mostly of delegations
  > to child zones.
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- `rfc-1034` §4.2.1
  > The RRs that describe cuts around the bottom of the zone are NS RRs that
  > name the servers for the subzones.
- Note: RFC 1034 defines a zone's delegation data. "A list of the names under it" is the beginner's word for the delegations a TLD zone holds.

### units[0].learn.terms[3] ("term-referral") — ✅

- `rfc-9499` §4
  > Referrals: A type of response in which a server, signaling that it
  > is not (completely) authoritative for an answer, provides the
  > querying resolver with an alternative place to send its query.
- `rfc-1034` §4.3.1
  > the response
  > contains an error, the answer, or a referral to some other
  > server "closer" to the answer.
- `rfc-1034` §4.3.2
  > Copy the NS RRs for the subzone into the authority
  > section of the reply. Put whatever addresses are
  > available into the additional section
- Note: RFC 1034 defines the referral. The addresses ("here's where they are") come when available; the claim leaves out that a referral may carry only names.

### units[0].learn.terms[4] ("term-auth") — ✅

- `rfc-9499` §6
  > Authoritative server: "A server that knows the content of a DNS zone
  > from local knowledge, and thus can answer queries about that zone
  > without needing to query other servers."
- `rfc-1034` §2.4
  > Name servers
  > know the parts of the domain tree for which they have complete
  > information; a name server is said to be an AUTHORITY for
  > these parts of the name space.
- Note: RFC 1034 defines authority.

### units[0].learn.terms[5] ("term-a") — ✅

- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §3.4.1
  > ADDRESS A 32 bit Internet address.
- Note: RFC 1035 defines the A record. "Number" is the beginner's word for the IPv4 address it holds.

### units[0].learn.terms[6] ("term-ttl") — ✅

- `rfc-8767` §4
  > TTL a 32-bit unsigned integer number of seconds that specifies the
  > duration that the resource record MAY be cached before the
  > source of the information MUST again be consulted.
- `rfc-1034` §3.6
  > The TTL describes how
  > long a RR can be cached before it should be discarded.
- Note: RFC 8767 §4 is the current definition of the TTL field (it amends RFC 1035); RFC 1034 defines its meaning.

### units[0].learn.terms[7] ("term-cache") — ✅

- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and
  > name server load from most requests by answering them from its cache of
  > prior results.
- `rfc-1034` §5.3.3
  > Step 1 searches the cache for the desired data. If the data is in the
  > cache, it is assumed to be good enough for normal use.
- Note: RFC 1034 defines the resolver's cache.

### units[0].learn.pattern ("pattern") — ✅

- `rfc-1034` §5.3.3
  > Thus if SNAME were
  > Mockapetris.ISI.EDU, this step would look for NS RRs for
  > Mockapetris.ISI.EDU, then ISI.EDU, then EDU, and then . (the root).
- `rfc-1034` §3.1
  > By convention, the labels that compose a
  > domain name are printed or read left to right, from the most specific
  > (lowest, farthest from the root) to the least specific (highest, closest
  > to the root).
- Note: RFC 1034 defines name order and the resolver algorithm. With nothing cached, the best servers known are the root's, so the lookup starts at the name's last label and works toward the site; with cached delegations it starts lower down, which the Cache step covers.

### units[0].learn.why[0] ("why-1") — ✅

- `rfc-1034` §2.2
  > The sheer size of the database and frequency of updates
  > suggest that it must be maintained in a distributed manner,
  > with local caching to improve performance.
- `rfc-1034` §2.2
  > attempt to collect a consistent copy of the entire database
  > will become more and more expensive and difficult, and hence
  > should be avoided.
- Note: RFC 1034 states DNS's design goals. It gives size and update rate as the reason a single copy is impractical; "could not" says this more strongly but leaves the beginner with the right reason.

### units[0].learn.why[1] ("why-2") — ✅

- `rfc-1034` §2.2
  > The sheer size of the database and frequency of updates
  > suggest that it must be maintained in a distributed manner,
  > with local caching to improve performance.
- `rfc-1034` §4.1
  > A given zone will be available from several name servers to insure its
  > availability in spite of host or communication link failure.
- `rfc-1034` §2.3
  > When updates are unavailable due to
  > network or host failure, the usual course is to believe old
  > information while continuing efforts to update it.
- Note: RFC 1034 defines the design. The resilience comes from each zone's several servers and from cached copies as well as the split; the claim groups them loosely.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

- `rfc-9499` §6
  > In iterative resolution, the client repeatedly makes non-recursive
  > queries and follows referrals and/or aliases.
- `rfc-1034` §4.3.1
  > The simplest mode for the client is recursive, since in this
  > mode the name server acts in the role of a resolver and
  > returns either an error or the answer, but never referrals.
- Note: RFC 1034 defines both modes. "Iterative queries" is the common name for RFC 9499's non-recursive queries in iterative resolution.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

- `rfc-7766` §1
  > Most DNS [RFC1034] transactions take place over UDP [RFC768]. TCP
  > [RFC793] is always used for full zone transfers (using AXFR) and is
  > often used for messages whose sizes exceed the DNS protocol's
  > original 512-byte limit.
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method
  > for standard queries in the Internet.
- `rfc-1035` §4.2
  > datagrams are preferred for queries due to
  > their lower overhead and better performance.
- Note: RFC 1035 §4.2 defines DNS transport; RFC 7766 (updating it, not obsoleted) is the current TCP requirement. The claim leaves out other TCP uses (TCP must always be supported).

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

- `rfc-8484` §8.1
  > DoH encrypts DNS traffic and requires authentication of the server.
- `rfc-8484` §8.1
  > Additionally, the use of the HTTPS default port 443
- `rfc-7858` §3.1
  > By default, a DNS server that supports DNS over TLS MUST listen for
  > and accept TCP connections on port 853
- `rfc-7858` §1
  > Today, nearly all DNS queries [RFC1034] [RFC1035] are sent
  > unencrypted, which makes them vulnerable to eavesdropping by an
  > attacker that has access to the network channel
- Note: RFC 8484 defines DoH and RFC 7858 DoT; both current (RFC 7858 is updated by RFC 8310, which adds usage profiles). "Hide from the network" means from eavesdroppers on the path; the claim leaves out that the resolver itself still sees each lookup.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

- `rfc-9156` §2
  > Traditionally, these
  > queries would contain the full QNAME and the original QTYPE as
  > received in the client query.
- `rfc-9156` §2
  > the QNAME that is the original QNAME, stripped to just one label
  > more than the longest matching domain name for which the name
  > server is known to be authoritative
- `rfc-9156` §1.1
  > a large
  > percentage of the resolvers deployed on the Internet already support
  > QNAME minimisation in some way.
- Note: RFC 9156 defines QNAME minimisation and obsoletes RFC 7816. For the root, one label more than the root is "app", so the root is asked about .app.

### units[0].learn.facts[0] ("fact-port") — ✅

- `rfc-1035` §4.2
  > The Internet supports name server access using TCP [RFC-793] on server
  > port 53 (decimal) as well as datagram access using UDP [RFC-768] on UDP
  > port 53 (decimal).
- `iana-ports` §Registry
  > domain 53 tcp Domain Name Server
- `iana-ports` §Registry
  > domain 53 udp Domain Name Server
- Note: RFC 1035 defines DNS transport and the IANA registry records the port assignment; the registry was read live.

### units[0].learn.facts[1] ("fact-types") — ✅

- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §3.2.2
  > NS 2 an authoritative name server
- `rfc-1035` §3.2.2
  > CNAME 5 the canonical name for an alias
- `rfc-1035` §3.2.2
  > PTR 12 a domain name pointer
- `rfc-1035` §3.2.2
  > MX 15 mail exchange
- `rfc-1035` §3.2.2
  > TXT 16 text strings
- `rfc-3596` §2.1
  > The AAAA resource record type is a record specific to the Internet
  > class that stores a single IPv6 address.
- Note: RFC 1035 defines six of the types and RFC 3596 defines AAAA. The list is a selection, not every type.

### units[0].learn.facts[2] ("fact-root") — ✅

- `iana-root-servers` §Root Name Servers
  > are a network of hundreds of servers in many countries around the world. They are configured in the DNS root zone as 13 named authorities
- `iana-root-zone-file` §The root zone’s NS records
  > . 518400 IN NS a.root-servers.net.
- `icann-rssac-faq` §1.1
  > While today there remain 13 RSIs, there are in fact more than 1500 anycast instances in operation throughout the world.
- Note: the root zone file defines the root's NS set. ICANN counts more than 1500 instances; "hundreds" is IANA's own wording.

### units[0].learn.facts[3] ("fact-encrypted") — ✅

- `rfc-8484` §8.1
  > Additionally, the use of the HTTPS default port 443
- `rfc-7858` §3.1
  > By default, a DNS server that supports DNS over TLS MUST listen for
  > and accept TCP connections on port 853
- Note: RFC 8484 defines DoH and RFC 7858 defines DoT with its port.

### units[0].learn.facts[4] ("fact-defined") — ✅

- `rfc-9499` §1
  > The protocol and message format are
  > defined in [RFC1034] and [RFC1035].
- `rfc-1034` §1
  > This RFC is an introduction to the Domain Name System (DNS)
- `rfc-1035` §1
  > This RFC describes the details of the domain system and protocol
- Note: RFC 1034 and RFC 1035 together define DNS; neither is obsoleted, though many later RFCs update them, which the fact leaves out.

### units[0].learn.facts[5] ("fact-used") — ✅

- `rfc-1034` §5.2.1
  > Host name to host address translation.
- `rfc-1034` §5.1
  > the
  > amount of time that a resolver will take to complete can vary quite a
  > bit, from milliseconds to several seconds.
- `rfc-9499` §6
  > A resolver performs queries for a name, type, and
  > class, and receives responses.
- Note: RFC 1034 defines the resolver's functions. DNS holds other data too; turning names into addresses is its ordinary use.

### units[0].learn.facts[6] ("fact-who") — ✅

- `rfc-9076` §5.1
  > For most residential networks and potentially other networks, the typical
  > case is for the user's device to be configured (typically
  > automatically through DHCP or relay agent options) with the
  > addresses of the DNS proxy in the Customer Premises Equipment
  > (CPE), which in turn points to the DNS recursive resolvers at the
  > IAP.
- `rfc-5625` §1
  > The proxy serves as a convenient
  > default DNS resolver for clients on the LAN, but relies on an
  > upstream resolver (e.g., at an ISP) to perform recursive DNS lookups.
- `rfc-2132` §3.8
  > The domain name server option specifies a list of Domain Name System
  > (STD 13, RFC 1035 [8]) name servers available to the client.
- `rfc-1034` §5.3.1
  > One option for implementing a resolver is to move the resolution
  > function out of the local machine and into a name server which supports
  > recursive queries.
- Note: RFC 2132 defines the DHCP option; RFC 1034 defines the stub resolver. In a home the laptop's query often goes first to the router's proxy, which passes it to the provider's resolver, and some users choose a public resolver; the fact leaves both out.

### units[0].learn.facts[7] ("fact-ttl") — ✅

- `rfc-1034` §3.6
  > The TTL is assigned by the administrator for the zone where the
  > data originates.
- `rfc-8767` §4
  > TTL a 32-bit unsigned integer number of seconds
- `iana-root-zone-file` §The app. NS records
  > app. 172800 IN NS ns-tld1.charlestonroadregistry.com.
- `rfc-8806` §1
  > because the TTL for most TLDs is usually long-lived (on the
  > order of a day or two)
- Note: RFC 1034 defines who sets the TTL and RFC 8767 its unit; the root zone file defines the .app delegation, whose TTL of 172800 seconds is two days.

### units[0].learn.facts[8] ("fact-cache") — ✅

- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and
  > name server load from most requests by answering them from its cache of
  > prior results. It follows that caches which are shared by multiple
  > processes, users, machines, etc., are more efficient than non-shared
  > caches.
- `rfc-1034` §5.3.3
  > The data is passed back
  > to the user and entered in the cache for future use if its TTL is
  > greater than zero.
- `rfc-9499` §6
  > In
  > general, a recursive resolver is expected to cache the answers it
  > receives
- `microsoft-ipconfig` §Parameters
  > The DNS Client service uses this information to resolve frequently queried names quickly, before querying its configured DNS servers.
- `rfc-1034` §5.3.1
  > or can centralize the cache for a whole local network or
  > organization.
- Note: RFC 1034 defines the resolver cache. Not every laptop's operating system caches and some resolvers do not; the ordinary case holds.

### units[0].learn.facts[9] ("fact-osi") — ✅

- `cloudflare-network-layers` §Network Layers
  > 7 Application layer HTTP, DNS
- `microsoft-traffic-manager` §How Traffic Manager works
  > Traffic Manager works at the DNS level which is at the Application layer (Layer-7).
- Note: two vendors on different sites; no standard places DNS on the OSI model.

### units[0].practice[0].options[0] (question "root-referral") — ✅

- `rfc-1034` §4.3.1
  > the response
  > contains an error, the answer, or a referral to some other
  > server "closer" to the answer.
- `rfc-9499` §4
  > There are two types of referral response. The first is a downward
  > referral (sometimes described as "delegation response"), where the
  > server is authoritative for some portion of the QNAME.
- Note: RFC 1034 defines the responses. The option is wrong and its feedback says so correctly: the root holds the .app delegation, so it refers. (The root would return an error only for an ending that does not exist.)

### units[0].practice[0].options[1] (question "root-referral") — ✅

- `rfc-1034` §4.3.1
  > the response
  > contains an error, the answer, or a referral to some other
  > server "closer" to the answer.
- `rfc-9499` §4
  > Referrals: A type of response in which a server, signaling that it
  > is not (completely) authoritative for an answer, provides the
  > querying resolver with an alternative place to send its query.
- Note: RFC 1034 defines the referral; the option is right and marked right.

### units[0].practice[0].options[2] (question "root-referral") — ✅

- `rfc-1034` §3.6
  > The set of resource information
  > associated with a particular name is composed of separate resource
  > records (RRs).
- `rfc-1035` §3.2.2
  > A 1 a host address
- Note: RFC 1034 and 1035 define resource records. The option is wrong and marked wrong; the feedback is true of a server in its DNS role.

### units[0].practice[1].options[0] (question "cached") — ✅

- `rfc-1034` §5.3.3
  > Step 1 searches the cache for the desired data. If the data is in the
  > cache, it is assumed to be good enough for normal use.
- `rfc-9499` §6
  > In
  > general, a recursive resolver is expected to cache the answers it
  > receives
- `microsoft-ipconfig` §Parameters
  > any recently obtained resource records for name queries resolved by the computer
- `rfc-8767` §4
  > TTL a 32-bit unsigned integer number of seconds that specifies the
  > duration that the resource record MAY be cached
- Note: RFC 1034 defines the cache step and RFC 8767 the TTL. The 5 minutes is the lesson's example TTL of 300 seconds; the option is right and marked right.

### units[0].practice[1].options[1] (question "cached") — ✅

- `rfc-1034` §5.3.3
  > 1. See if the answer is in local information, and if so return
  > it to the client.
- `rfc-1034` §5.3.1
  > or can centralize the cache for a whole local network or
  > organization.
- Note: RFC 1034 defines the algorithm. A cached answer is returned without any query to the root; the option is wrong and marked wrong.

### units[0].practice[1].options[2] (question "cached") — ✅

- `rfc-1035` §3.2.1
  > TTL a 32 bit signed integer that specifies the time interval
  > that the resource record may be cached before the source
  > of the information should again be consulted.
- `rfc-8767` §4
  > duration that the resource record MAY be cached before the
  > source of the information MUST again be consulted.
- Note: RFC 8767 §4 amends RFC 1035's TTL definition (unsigned, and stale data may be served if the source cannot be reached); both say the source is consulted again after the TTL. "Whenever" means the next time the name is needed after that.

## Traced, example and analogy parts, and unbacked items

### title — ✅

### units[0].name — ✅

### backing (the lesson's subtitle and summary) — ✅

### units[0].backing (the unit's full name and purpose) — ✅

### units[0].scene.backing (the scene) — ✅

- Note: every address in the scene is example data (RFC 1918 for the laptop, RFC 5737 for the servers).

### units[0].overview.hookBacking (the Overview hook) — ✅

### units[0].overview.backing (the Overview description) — ✅

- Note: the analogy (reception, floor desk, office) matches the root, TLD, authoritative order and does not mislead.

### units[0].overview.facts[0] (Overview fact "Used for") — ✅

### units[0].overview.facts[1] (Overview fact "Port") — ✅

### units[0].overview.facts[2] (Overview fact "Who asks") — ✅

### units[0].overview.facts[3] (Overview fact "Answers kept") — ✅

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

### units[0].overview.facts[5] (Overview fact "This example") — ✅

- Note: techconcepts.app is not a reserved example name: it is a registered domain (the site's own). The lesson labels it as the example and every address it gives it is from RFC 5737 documentation ranges, so a beginner is not taught anything about how DNS works that is false; the records shown for it are invented.

### units[0].steps[0] (step "recursive-query") — ✅

### units[0].steps[0].facts[0] (step "recursive-query", fact "From") — ✅

- Note: port 50611 is an example value; it adds no claim about how ports are chosen.

### units[0].steps[0].facts[1] (step "recursive-query", fact "To") — ✅

### units[0].steps[0].facts[2] (step "recursive-query", fact "Asks for") — ✅

### units[0].steps[0].facts[3] (step "recursive-query", fact "Kind") — ✅

### units[0].steps[0].events[0] (event "m1") — ✅

### units[0].steps[1] (step "root-referral") — ✅

- Note: ".org" is one more example ending than term-tld names; it is a TLD in the live root zone and adds no claim.

### units[0].steps[1].facts[0] (step "root-referral", fact "Asks") — ✅

### units[0].steps[1].facts[1] (step "root-referral", fact "Answer") — ✅

### units[0].steps[1].facts[2] (step "root-referral", fact "Endings like .app") — ✅

### units[0].steps[1].facts[3] (step "root-referral", fact "Kept for") — ✅

### units[0].steps[1].events[0] (event "m2") — ✅

### units[0].steps[1].events[1] (event "m3") — ✅

### units[0].steps[1].events[2] (event "learned-1") — ✅

### units[0].steps[2] (step "tld-referral") — ✅

### units[0].steps[2].facts[0] (step "tld-referral", fact "Asks") — ✅

### units[0].steps[2].facts[1] (step "tld-referral", fact "Answer") — ✅

### units[0].steps[2].facts[2] (step "tld-referral", fact "That server is") — ✅

### units[0].steps[2].facts[3] (step "tld-referral", fact "Kept for") — ✅

- Note: "1 day" is an example TTL; fact-ttl says the TTL is set by whoever runs the name.

### units[0].steps[2].events[0] (event "m4") — ✅

### units[0].steps[2].events[1] (event "m5") — ✅

### units[0].steps[2].events[2] (event "learned-2") — ✅

### units[0].steps[3] (step "authoritative-answer") — ✅

### units[0].steps[3].facts[0] (step "authoritative-answer", fact "Asks") — ✅

- Note: the name server name is invented for the example and its address is an RFC 5737 documentation address (see the Overview's "This example").

### units[0].steps[3].facts[1] (step "authoritative-answer", fact "Answer") — ✅

### units[0].steps[3].facts[2] (step "authoritative-answer", fact "TTL") — ✅

### units[0].steps[3].facts[3] (step "authoritative-answer", fact "Other types") — ✅

### units[0].steps[3].events[0] (event "m6") — ✅

### units[0].steps[3].events[1] (event "m7") — ✅

### units[0].steps[3].events[2] (event "learned-3") — ✅

### units[0].steps[4] (step "response-and-caching") — ✅

### units[0].steps[4].facts[0] (step "response-and-caching", fact "Answer to the laptop") — ✅

### units[0].steps[4].facts[1] (step "response-and-caching", fact "Trips this time") — ✅

### units[0].steps[4].facts[2] (step "response-and-caching", fact "Next time") — ✅

### units[0].steps[4].facts[3] (step "response-and-caching", fact "Took") — ✅

- Note: "about 60 ms" is the example's own timing (the event log's 0.059s) and sits inside fact-used's range of milliseconds to seconds.

### units[0].steps[4].events[0] (event "m8") — ✅

### units[0].practice[0].prompt (question "root-referral") — ✅

### units[0].practice[1].prompt (question "cached") — ✅

## Sources

All checked 2026-11-11.

- `rfc-1034`, `rfc-1035`: Internet Standards; the RFC Editor info pages list no obsoleting RFC. Their updates (RFC 2181, 2308, 4033 to 4035, 7766, 8767 and others) were weighed where a claim touches them (TTL, TCP).
- `rfc-2132`, `rfc-3596`, `rfc-3833`, `rfc-4033`, `rfc-5452`, `rfc-5625`, `rfc-7720`, `rfc-7766`, `rfc-7858`, `rfc-8305`, `rfc-8484`, `rfc-8555`, `rfc-8767`, `rfc-8806`, `rfc-9076`, `rfc-9156`, `rfc-9499`: each info page lists no obsoleting RFC. Updates read for relevance: RFC 4033 (RFC 6014, 6840), RFC 7766 (RFC 8490, 9103), RFC 7858 (RFC 8310), RFC 2132 (DHCP option updates); none changes a claim here.
- `iana-ports`: the live IANA registry (text form), domain on TCP and UDP 53.
- `iana-root-db-app`: the live IANA root zone database page for .app, last updated 2025-04-11, status Active.
- `iana-root-servers`, `iana-root-zone`: live IANA pages.
- `iana-root-zone-file`: the live root zone from internic.net, SOA serial 2026111102.
- `icann-rssac-faq`: the live ICANN RSSAC FAQ.
- `cloudflare-network-layers`: live Cloudflare docs page, last updated Oct 12, 2026.
- `microsoft-traffic-manager`: live Microsoft Learn page, dated 2026-06-01.
- `microsoft-365-add-domain`: live Microsoft Learn page, dated 2026-05-08.
- `microsoft-ipconfig`: live Microsoft Learn page for the current Windows command; describes a current product.

## Limit overrides

None.
