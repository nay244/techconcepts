```json fact-check
{
  "slug": "what-is-ip",
  "hash": "548d9c8e845839d233d01fe5ac484b9f0d708e0a58ddde3682ce1a0b66ea2a8d",
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
    "units[0].overview.facts[1] (Overview fact \"Addresses\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Each hop\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Promises\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"routing-decision\")": "✅",
    "units[0].steps[0].facts[0] (step \"routing-decision\", fact \"Destination\")": "✅",
    "units[0].steps[0].facts[1] (step \"routing-decision\", fact \"My network\")": "✅",
    "units[0].steps[0].facts[2] (step \"routing-decision\", fact \"Same network?\")": "✅",
    "units[0].steps[0].facts[3] (step \"routing-decision\", fact \"So send it to\")": "✅",
    "units[0].steps[1] (step \"arp-resolution\")": "✅",
    "units[0].steps[1].facts[0] (step \"arp-resolution\", fact \"Asks\")": "✅",
    "units[0].steps[1].facts[1] (step \"arp-resolution\", fact \"Sent to\")": "✅",
    "units[0].steps[1].facts[2] (step \"arp-resolution\", fact \"Answer\")": "✅",
    "units[0].steps[1].facts[3] (step \"arp-resolution\", fact \"Kept in\")": "✅",
    "units[0].steps[1].events[0] (event \"m1\")": "✅",
    "units[0].steps[1].events[1] (event \"m2\")": "✅",
    "units[0].steps[2] (step \"ip-encapsulation\")": "✅",
    "units[0].steps[2].facts[0] (step \"ip-encapsulation\", fact \"Source\")": "✅",
    "units[0].steps[2].facts[1] (step \"ip-encapsulation\", fact \"Destination\")": "✅",
    "units[0].steps[2].facts[2] (step \"ip-encapsulation\", fact \"TTL\")": "✅",
    "units[0].steps[2].facts[3] (step \"ip-encapsulation\", fact \"Frame to\")": "✅",
    "units[0].steps[2].events[0] (event \"m3\")": "✅",
    "units[0].steps[2].events[1] (event \"written-1\")": "✅",
    "units[0].steps[3] (step \"nat-and-forwarding\")": "✅",
    "units[0].steps[3].facts[0] (step \"nat-and-forwarding\", fact \"Private source\")": "✅",
    "units[0].steps[3].facts[1] (step \"nat-and-forwarding\", fact \"Swapped for\")": "✅",
    "units[0].steps[3].facts[2] (step \"nat-and-forwarding\", fact \"Each hop\")": "✅",
    "units[0].steps[3].facts[3] (step \"nat-and-forwarding\", fact \"Arrives with\")": "✅",
    "units[0].steps[3].events[0] (event \"m4\")": "✅",
    "units[0].steps[3].events[1] (event \"written-2\")": "✅",
    "units[0].steps[3].events[2] (event \"m5\")": "✅",
    "units[0].steps[3].events[3] (event \"written-3\")": "✅",
    "units[0].steps[4] (step \"return-routing\")": "✅",
    "units[0].steps[4].facts[0] (step \"return-routing\", fact \"Reply to\")": "✅",
    "units[0].steps[4].facts[1] (step \"return-routing\", fact \"Router swaps it to\")": "✅",
    "units[0].steps[4].facts[2] (step \"return-routing\", fact \"Path back\")": "✅",
    "units[0].steps[4].facts[3] (step \"return-routing\", fact \"From outside\")": "✅",
    "units[0].steps[4].events[0] (event \"m6\")": "✅",
    "units[0].steps[4].events[1] (event \"written-4\")": "✅",
    "units[0].steps[4].events[2] (event \"m7\")": "✅",
    "units[0].steps[4].events[3] (event \"written-5\")": "✅",
    "units[0].steps[0].deep[0] (step \"routing-decision\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"arp-resolution\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"ip-encapsulation\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"nat-and-forwarding\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"return-routing\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-ip\")": "✅",
    "units[0].learn.terms[1] (\"term-routing\")": "✅",
    "units[0].learn.terms[2] (\"term-gateway\")": "✅",
    "units[0].learn.terms[3] (\"term-mac\")": "✅",
    "units[0].learn.terms[4] (\"term-arp\")": "✅",
    "units[0].learn.terms[5] (\"term-header\")": "✅",
    "units[0].learn.terms[6] (\"term-ttl\")": "✅",
    "units[0].learn.terms[7] (\"term-nat\")": "✅",
    "units[0].learn.terms[8] (\"term-forwarding\")": "✅",
    "units[0].learn.terms[9] (\"term-encapsulation\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-ipv4\")": "✅",
    "units[0].learn.facts[1] (\"fact-ipv6\")": "✅",
    "units[0].learn.facts[2] (\"fact-private\")": "✅",
    "units[0].learn.facts[3] (\"fact-header\")": "✅",
    "units[0].learn.facts[4] (\"fact-defined\")": "✅",
    "units[0].learn.facts[5] (\"fact-osi\")": "✅",
    "units[0].learn.facts[6] (\"fact-label\")": "✅",
    "units[0].learn.facts[7] (\"fact-ttl\")": "✅",
    "units[0].learn.facts[8] (\"fact-arp\")": "✅",
    "units[0].learn.facts[9] (\"fact-frame\")": "✅",
    "units[0].learn.facts[10] (\"fact-hop\")": "✅",
    "units[0].learn.facts[11] (\"fact-nat\")": "✅",
    "units[0].learn.facts[12] (\"fact-reply\")": "✅",
    "units[0].learn.facts[13] (\"fact-outside\")": "✅",
    "units[0].practice[0].options[0] (question \"source-swap\")": "✅",
    "units[0].practice[0].options[1] (question \"source-swap\")": "✅",
    "units[0].practice[0].options[2] (question \"source-swap\")": "✅",
    "units[0].practice[1].options[0] (question \"loops\")": "✅",
    "units[0].practice[1].options[1] (question \"loops\")": "✅",
    "units[0].practice[1].options[2] (question \"loops\")": "✅",
    "units[0].practice[0].prompt (question \"source-swap\")": "✅",
    "units[0].practice[1].prompt (question \"loops\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-dai",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-route-command",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-network-layers",
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
      "id": "microsoft-arp",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-osi",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-route",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1812",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-1918",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-3022",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-3704",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4271",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4632",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4787",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4861",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4864",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5227",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-6250",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-7066",
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
      "id": "rfc-8200",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-826",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-894",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9724",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 164,
    "digest": "98a1e52a0fbb23048e28f30f24c72f7b572bbbed9654c1a0ba18a19370a37fb3",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-osi": "d0bf680f028e01849b2071b408254ed66710edc5532375e2e9a91deb635d7d6f",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-4632": "13694a39f586eb2054407780edccdf7c39332e57f067c8008bba4326bfc24fa9",
      "microsoft-route": "dc3f59f7490777b95d6aebb16a2de052e82de7ae0c45e6dcb6a88970abbc3f65",
      "cisco-route-command": "168f29dff907b718c2f5e2ed554a72d373060f9b894089ceeb0c6ec9048ca174",
      "rfc-894": "be88b9301e53f986aca3a0e55e488d1d79bae3f88fe3f257640397bc089e7035",
      "rfc-826": "01bc62fe6a37e90f1246ac43e8e145f1322b4ed1474836145c3da93d2bd3c8a6",
      "cisco-dai": "bfe24413d27ee5a32ac473a00a461b33260ac50e507345a6b3d8f6b69bfc5057",
      "microsoft-arp": "3bd1318f6e1679c634294ebb341428b0a87f633f681b659b3da23a40427f506e",
      "rfc-4861": "1a4309c117d765a7c0edfcb2297fc90c3c09f0fcae255f15e53b20748bcc09fb",
      "rfc-5227": "bfe6de915c68fddffa6bee54dd217a377d2c694c4233cef1696c936d4202ecd4",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "iana-protocol-numbers": "87719866f1d7b0afb9acf32b120c3db3fb73289c8f010ea94e14a17502a2c614",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-792": "58714393ded142bacf188d7e8977eef98f4110c4c87ac94595f750df5664c2c6",
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-4864": "b1d91c59a4358eb417749fdf08daed2ccab9052b4d3426718def58e0b33e2b09",
      "rfc-4271": "98b851146abcd56ecbb398dd1a818bcde2dcac6fde3d901c423d988f86eaab76",
      "iana-ip-parameters": "da4e34e9d8b1873fdf11ecafc69f1eec8667e8fe5b556c00135348c737ec210d",
      "rfc-6250": "d592b2bd89f6f85949b3b5638a45d61f93775711ce459a1f7e6f43f09dd284f9",
      "rfc-3704": "79aadfe01455bcb96b1663b0bd299c93649f12e623e20105ee0810839a128f89",
      "rfc-9724": "b0ad27b88fe2c18981558885cff56b523539a5d69784a5188887ab0fbb06095e",
      "rfc-7066": "13210647d7dfba285bed43f6d8be24df9c37e4f66dc5a7e553cfb812400f3e3d",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-8200": "371ae3f133d562db5d6385e6def4ca9914c4f831be228ea7779fd28799c2f490"
    }
  },
  "items": {
    "title": "f33ad85e5f00138a8205754c4b32720f9823447a06791d3b9327da854275e20a",
    "units[0].name": "5899165ed8dc57e167062311c6906ac5c6bca8d0a16c5d5201858a870f4f4ae4",
    "units[0].osi": "c3e9ed14b10d30959e193a4bad8102ec2f4a38f3d244e8a17db38f114da3fd29",
    "backing (the lesson's subtitle and summary)": "cc36f2365bd3505886f2e9076dc99b4a1c5de4598226d72e26e79bc72a7c1e2e",
    "units[0].backing (the unit's full name and purpose)": "9c15679c9caeaf1314eaa148755ca28346eda69d7fe6b6bb5bccdb86f5b38e16",
    "units[0].scene.backing (the scene)": "41c038dd33c46d50c89d0b6c796af9aa87d566a1552efddb4ba003a0010a0555",
    "units[0].overview.hookBacking (the Overview hook)": "358bb996e5bbdb21eb103d84777b38e2603f1e3dad7ab89cd5270bfe18e1ce72",
    "units[0].overview.backing (the Overview description)": "962733f2f7542c2818ef4d53d373fb4861f0beaa8a06b0d1d5f45281fb9e3652",
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "f35fd6fd54533dd822fdbc99d0fcf1da63ec28438919b011acc0d1d12a1575ae",
    "units[0].overview.facts[1] (Overview fact \"Addresses\")": "d200aa6df3d843f7134d4458d882c477c08da6eff49fcca718b4387e47ce06b5",
    "units[0].overview.facts[2] (Overview fact \"Each hop\")": "cb0a3a9cdb46027098754aec7ec7c88ffdf9abb95cf0c57532af4a6f4bbed728",
    "units[0].overview.facts[3] (Overview fact \"Promises\")": "d1a415a71a3f455ff319fb314bf47cd09c3bd0610bd94b3e8125b5f311c402c3",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "1c8a653b23fac582bf31a0e983668e4dbcfddbe9615bf52e8f38c1effa70ac4c",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "6b0cbc0cc6159e1203c4e97428cd239bdab8fd13162ba1f1fbeab0d10e6bb999",
    "units[0].steps[0] (step \"routing-decision\")": "1c5a7a10848e13f85014e3dd34c11b64f18f5c5148a3b9596ab456ac62ff70fd",
    "units[0].steps[0].facts[0] (step \"routing-decision\", fact \"Destination\")": "05ccb056384e9aa7f01907c1b3a2276951ed1459b79a5e36f68899a7d4fc0587",
    "units[0].steps[0].facts[1] (step \"routing-decision\", fact \"My network\")": "a232f30f70c8e597d3268b77e8b61808cab75ea637e999d0b3571cc8a68078a5",
    "units[0].steps[0].facts[2] (step \"routing-decision\", fact \"Same network?\")": "2832fe6908abe476a58ef2dc48fb367495f8d2e59f9a7f2e2aa7cdc3458a9ce4",
    "units[0].steps[0].facts[3] (step \"routing-decision\", fact \"So send it to\")": "470c6f55d6065a374397dfd0fdb5c17dcc575332fe9ef0abf08a7f0b669d6a2e",
    "units[0].steps[1] (step \"arp-resolution\")": "4933d1363b85046e3f3a26ddadfbc93cc7bcf37ceea2c372ef2a4e6301775963",
    "units[0].steps[1].facts[0] (step \"arp-resolution\", fact \"Asks\")": "b6eee2a16193d3366d83a6ca20f72c0104d4484f21bdb21d27a5cacad5ab2d6c",
    "units[0].steps[1].facts[1] (step \"arp-resolution\", fact \"Sent to\")": "9e2924b8dd1430390ee9734574bd0b674659808d28f91ac7078c7e065bb3411f",
    "units[0].steps[1].facts[2] (step \"arp-resolution\", fact \"Answer\")": "eefc0827d5d9f64cdee5ffa19053e782f535da09265f084b839bc58b7a1acf4b",
    "units[0].steps[1].facts[3] (step \"arp-resolution\", fact \"Kept in\")": "6bb49548c44c8e5e25d8131d676ec1dd37d3e4ff011bde64e90c3f6772b6dabb",
    "units[0].steps[1].events[0] (event \"m1\")": "6018104ad8107706929e84c3a9c96a5a8c709b5a8401ebfae07a0b8f0ce9e744",
    "units[0].steps[1].events[1] (event \"m2\")": "30b59415d1092a50e5e259737fc6de8fcd746cb9cc44a0f870c7ca511848bbef",
    "units[0].steps[2] (step \"ip-encapsulation\")": "e2e15d9edf31ca7b9511c4f2d5986cf8e3995a8c99341165674dcfe4cb9224ea",
    "units[0].steps[2].facts[0] (step \"ip-encapsulation\", fact \"Source\")": "26d0c148f6b57983f837a342ffbc158903c251e3e64cb013679efcc3f00ba971",
    "units[0].steps[2].facts[1] (step \"ip-encapsulation\", fact \"Destination\")": "582a0d2f6c3ffc9c012d3cea950b9cfe1662e32ef6aa0d56a1e841ae0d8a8080",
    "units[0].steps[2].facts[2] (step \"ip-encapsulation\", fact \"TTL\")": "c4a09bfa79539ca2a07daa39f6361ea6b11d5a412264ab97e6b81867b1d133a2",
    "units[0].steps[2].facts[3] (step \"ip-encapsulation\", fact \"Frame to\")": "c995b594013e356d4c3f20019954ef7197d9ff90109cafe61a9cdda244cef31e",
    "units[0].steps[2].events[0] (event \"m3\")": "b41df8305b0cca1428af6701fd30b82b8cdf7b8752ba8750995ea668f3d0f2ad",
    "units[0].steps[2].events[1] (event \"written-1\")": "6d8af60dab65a42d2cdfdc4a1793c1cf8659d002ea93bcd6f9c57087d8e8d4c9",
    "units[0].steps[3] (step \"nat-and-forwarding\")": "9ff0a0ffbfb9cffa34f7532429b0ccfe8c58960705c9fdbedc17b5ed76e59a98",
    "units[0].steps[3].facts[0] (step \"nat-and-forwarding\", fact \"Private source\")": "9d861b8f075741a46bf35e182bf5ad46f7057cf3ab06c2edd8206cf7e9415b46",
    "units[0].steps[3].facts[1] (step \"nat-and-forwarding\", fact \"Swapped for\")": "1be455d2dc8483a8d5f58f53df17ce09adeddf4b4bad5b5f8857703c2ab10a5c",
    "units[0].steps[3].facts[2] (step \"nat-and-forwarding\", fact \"Each hop\")": "9c7526aac6020a0890943dd52eef489e669762ccb6a88727590c02fe8c89f148",
    "units[0].steps[3].facts[3] (step \"nat-and-forwarding\", fact \"Arrives with\")": "9dc93f839bda418ba1deef9d74b6e9f3b5af589cf276fa87ce0e4e43d2424a07",
    "units[0].steps[3].events[0] (event \"m4\")": "046108151d1eb8abaa1875d7e0a92e59db5c6f56e01948ff077db1ae9305f869",
    "units[0].steps[3].events[1] (event \"written-2\")": "be969b6991c144e30b0cbf9283531212a0de2b2f6832f9921c4e3eb974b2880e",
    "units[0].steps[3].events[2] (event \"m5\")": "ade7082272214a4aad575798eb732cbdbaed77854650d51e3cfcd5c4e67e928c",
    "units[0].steps[3].events[3] (event \"written-3\")": "f20c0362c36b1eabddc86360324ce3a0bdc5b3466d4b533abf12dc1c03554b43",
    "units[0].steps[4] (step \"return-routing\")": "3b3743c99bf368de153896bd89546013a5131f4fc650c5cfadb269fa9b40aa3d",
    "units[0].steps[4].facts[0] (step \"return-routing\", fact \"Reply to\")": "1b1099253d2400309d2fe5370787b8e8533685ebb496ba3c9b967917ff2c3f52",
    "units[0].steps[4].facts[1] (step \"return-routing\", fact \"Router swaps it to\")": "cc5afe4c5b9d9f1f45795a81040484acc5d46a064040b75eeecfa525943b129b",
    "units[0].steps[4].facts[2] (step \"return-routing\", fact \"Path back\")": "66b31d4239014ce3760f41d2f67e53538f695322e63c416ab4c502234491447c",
    "units[0].steps[4].facts[3] (step \"return-routing\", fact \"From outside\")": "15517be6a0708d4125a7c7cb799e3167b05e93b72c35c7fad0d7729241fdbd0f",
    "units[0].steps[4].events[0] (event \"m6\")": "312188b6872a82b13d6c7ac817c234c435f3352cd6639ec14a8e527b4548ff4f",
    "units[0].steps[4].events[1] (event \"written-4\")": "409da78ef8456a0ff5a85d190ca31eb82f36fde9aaac8ec2de73d0ff598d7812",
    "units[0].steps[4].events[2] (event \"m7\")": "a0c5048b0e5f27a3df7eb14ddb5cfe6daa55fc981b4af307c1f8abda39f14810",
    "units[0].steps[4].events[3] (event \"written-5\")": "53723df213778a0cdc23278ed7befd5b01f0ea7e0c9c18a5943503014846508c",
    "units[0].steps[0].deep[0] (step \"routing-decision\", Go deeper)": "a31f7e2273502b8e8c03280d43ec885b9a53050b463a3c65e0223c66d188ede8",
    "units[0].steps[1].deep[0] (step \"arp-resolution\", Go deeper)": "34f322a5e4948c009093af7519b13438628627f7e93af76c685e8de5577c233c",
    "units[0].steps[2].deep[0] (step \"ip-encapsulation\", Go deeper)": "b28629d0ec4c5f1562351ba8a83025e21e9617438eb1dc0a8ab274e43a4bf4fb",
    "units[0].steps[3].deep[0] (step \"nat-and-forwarding\", Go deeper)": "a63836ad92d6f92f346e4d666a632ff1fc7752728942005a1f428e7021d2cdca",
    "units[0].steps[4].deep[0] (step \"return-routing\", Go deeper)": "708163eaf560a5eb4ac27b2392d6aeea5f6f71497fb1cc1bf98801734c078ca0",
    "units[0].learn.lead[0] (\"lead-1\")": "357b071e6448444506ae78e5884ce1b9028b4052b4c2e140bc264c7b17783150",
    "units[0].learn.lead[1] (\"lead-2\")": "bbb31d5bf42b584579a3ca14d1a29090d3275a5828fd9b805caae2ccab5af794",
    "units[0].learn.terms[0] (\"term-ip\")": "742d0fac57cfe3626aeb4e9732c12d5d582b5ea5aa5d727ca6a6b7f2e30e3820",
    "units[0].learn.terms[1] (\"term-routing\")": "e516245aa11e4da143fab4cc0c13b6d3c8fa6b58032b1202251c1a7a511afd1f",
    "units[0].learn.terms[2] (\"term-gateway\")": "4b3dc9c0d1f73da20bb6ebd0d791154ac962c614c5d0abd10af66d4ece455a38",
    "units[0].learn.terms[3] (\"term-mac\")": "3c5be9704a4c3e252c6a000a7cc1589e1efff1ed9b61ffaaecb88f2bc9c6fb01",
    "units[0].learn.terms[4] (\"term-arp\")": "0a2258bdbd68fe022f5d9a60dd068f8c04880c9f7cffa37582551a1c27f4aad7",
    "units[0].learn.terms[5] (\"term-header\")": "7d59d9b6455ea1ede0397245f2fb2640ac6254eb22c8d45f3229138a836d5cd7",
    "units[0].learn.terms[6] (\"term-ttl\")": "4059346ba94ec9283b67090b443fd653098bce8cb57c6f964e96aa0374aa4699",
    "units[0].learn.terms[7] (\"term-nat\")": "fac65503675ad130e6c14b6cff786a8a2563879f502abdcacf66a3154bb50e92",
    "units[0].learn.terms[8] (\"term-forwarding\")": "3c8386fd7076e6a2f5bb42ba604db7a92fdd0f08dce266c91763d6da5e831ce8",
    "units[0].learn.terms[9] (\"term-encapsulation\")": "ea3e6ead60d10e4a1fdbc9187d453acbfa71b66302af70ff6ed491f97b89de52",
    "units[0].learn.pattern (\"pattern\")": "b05a120ff10bd8c7cbed46acd0dcea389f07cf418706ce8ed1067a1a119036c0",
    "units[0].learn.why[0] (\"why-1\")": "48b9707134ebf828b54d082a90600e27f3232eb1d4d53b5e8401cce37557384e",
    "units[0].learn.why[1] (\"why-2\")": "b198cc2de60e22ffa9330c34eda34dae3c1d5231199377d6ba44f6e849c2df32",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "44fa8a3d6b0fd65abc520a24a62e02294c14d02303eed8a162d39edc6f4d73a3",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "1412f57834f4507d0cf215da8dc2f96d389c94065538f9fccad89a7609f4215e",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "a72a78e02ea6a02096f284fdf1c3cf5a3b331b11503abf14c195448c0184fec8",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "43f3b20ac9cfa0d4da6c222044c58e245560bd85496bbc068d071943f55e9616",
    "units[0].learn.facts[0] (\"fact-ipv4\")": "c0d9e35a1d6c41055ecf51b89c6dc9cd1091c682955293c94a9a0e8b4647eeb2",
    "units[0].learn.facts[1] (\"fact-ipv6\")": "9384158e99f07c47b682f44d0dcd0b3d9558cf50bde88c1b3e84b58d784de259",
    "units[0].learn.facts[2] (\"fact-private\")": "aed6a5c595fc30235077b1d1df74e3ae2ed28d7ebcb2d20d99a9c9cae3875a44",
    "units[0].learn.facts[3] (\"fact-header\")": "6b5da3a1334ff9ef2975e8359b34df4f55a5b975f87f513c90f4c9d4bcb1de40",
    "units[0].learn.facts[4] (\"fact-defined\")": "a1bc71e3f70b3637163a56ee4d330aef396aef2fce562b57037c066be17a5fff",
    "units[0].learn.facts[5] (\"fact-osi\")": "4210b980d5487fd317df88e301f7681c1c1c0ddcaa689478608eacd9d96a4dec",
    "units[0].learn.facts[6] (\"fact-label\")": "73503006095c81e292f5b7985ecc3a8681898c30aaa6d8fe89e3a31dc6c36911",
    "units[0].learn.facts[7] (\"fact-ttl\")": "58a2721f3e36caf2a8ef6376ff75962b958523fd7d69676af2a800afeb8b8fc0",
    "units[0].learn.facts[8] (\"fact-arp\")": "86e7f6c4dc4caafa27360849a76913ec2133c52cbe60395e06ff7900be557914",
    "units[0].learn.facts[9] (\"fact-frame\")": "584eecd1dd33b9d77195068f54547d783d47f95c9efed821a1ebdea183c8357f",
    "units[0].learn.facts[10] (\"fact-hop\")": "c8ff20dedea13bc9986d5db55343666a8dbd9ad98f7b32bd0979553669e1de0a",
    "units[0].learn.facts[11] (\"fact-nat\")": "a0f8a029df2628a9b7e8a27972e7c59b11d471a0aaf425a345f5b0a1b4f104b0",
    "units[0].learn.facts[12] (\"fact-reply\")": "b1e2d6ca5821c17e78695a21052b1d53a864b55fd7a3a472f693f5e49c088f7d",
    "units[0].learn.facts[13] (\"fact-outside\")": "c3d21d720be11a8e07e92c8f28e4b9e1d8a3581231f7d72b85753e5b542c3a47",
    "units[0].practice[0].options[0] (question \"source-swap\")": "8a927349354fe8eb7045c8d0fc118b1f7a1e48c35ca8f0668ecc86ca10714adc",
    "units[0].practice[0].options[1] (question \"source-swap\")": "50a38f96595eca8c277d756b8c852c7af15768c9147e14e9ad4512f80862bf6f",
    "units[0].practice[0].options[2] (question \"source-swap\")": "56315c4de0d2b39d5b2fb989f361c5c7739421b3523bf470b7ddd74f47f8cf97",
    "units[0].practice[1].options[0] (question \"loops\")": "432df055042d2a9c87a1b7f0979bc01c2693c9f0b93ad809b791c15718dd7c71",
    "units[0].practice[1].options[1] (question \"loops\")": "0f132b9fe2b1fb1c996ed5d4ac4f2911e345d897dbdd8365e0316d6748a76d95",
    "units[0].practice[1].options[2] (question \"loops\")": "54da517b53ec1b08132f207ca00c968b6770cc4ef009c0101357028bb1cf7046",
    "units[0].practice[0].prompt (question \"source-swap\")": "0cdc446de44d9b7c5baabb1de4a0d3fc5a548cc42bdb07bd8f6420d9ede7b7fe",
    "units[0].practice[1].prompt (question \"loops\")": "f4720f13ef1895d2de0f10316b4920a904040ea61fc518105e19f6adae650e67"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-ip

Checked on 2026-11-12 by claude-opus-5-5. Every source was fetched from its publisher in this run and saved to a temporary folder outside the repository: RFCs as plain text from rfc-editor.org, the IANA registries as XML, and the Cisco, Cloudflare and Microsoft pages as HTML. All 97 items pass.

## Claims

### units[0].osi — ✅

Layers: 3.

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer
  > IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer)
- Note: Two independent vendors (Cloudflare and Microsoft) each place IP at the OSI network layer, layer 3. Neither page is a standard; that is enough under the confirmation rule. Both pages are live, and Cloudflare's was updated in October 2026.

### units[0].steps[0].deep[0] (step "routing-decision", Go deeper) — ✅

"The laptop compares the destination with its own address and subnet mask: 192.168.1.100/24 covers 192.168.1.0 to 192.168.1.255. Anything outside matches only the default route, 0.0.0.0/0, whose next hop is the gateway, 192.168.1.1. You can see the table with route print on Windows."

- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the address mask match the IP source address bits extracted by the same mask, then the destination is on the corresponding connected network
- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a particular destination, the host chooses a "default" gateway and sends the datagram to it.
- `rfc-4632` §3.1
  > the legacy "Class C" network number 192.168.99.0 is defined as the prefix 192.168.99.0/24; the most significant 24 bits are ones and the least significant 8 bits are zeros.
- `rfc-4632` §5.1
  > Note that the degenerate route to prefix 0.0.0.0/0 is used as a default route and MUST be accepted by all implementations.
- `microsoft-route` §Parameters
  > The destination can be an IP network address (where the host bits of the network address are set to 0), an IP address for a host route, or 0.0.0.0 for the default route.
- `microsoft-route` §Introduction
  > Displays and modifies the entries in the local IP routing table.
- `microsoft-route` §Examples
  > To display the entire contents of the IP routing table, type:
  > route print
- `cisco-route-command` §Use the Route Command
  > In order to view the entire contents of the IP routing table, issue the route print command.
- Note: RFC 1122 (Internet Standard for hosts) defines how a host makes the local/remote decision and picks a default gateway. RFC 4632 (BCP 122) defines the CIDR prefix notation and the 0.0.0.0/0 default route. Neither is obsoleted. RFC 1122 has updates, none of which touch these sections.
- Note: A /24 leaves the last 8 bits for hosts, so 192.168.1.0 to 192.168.1.255 follows from the prefix. A real table also holds a few special routes, such as loopback and multicast. Saying "only the default route" holds for internet destinations, which is the ordinary case here.
- Note: Microsoft's route page applies to Windows 11 and Windows Server 2025. Cisco's tech note, about the same Windows command, is a second, independent vendor page.

### units[0].steps[1].deep[0] (step "arp-resolution", Go deeper) — ✅

"The ARP request goes to the broadcast MAC address ff:ff:ff:ff:ff:ff, so every device on the network reads it, and only the owner of 192.168.1.1 replies, directly. The laptop keeps the answer in its ARP cache for a short while. IPv6 does the same job with Neighbor Discovery. Forged ARP replies (ARP spoofing) can trick devices into sending their traffic to an attacker."

- `rfc-894` §Address Mappings
  > should be mapped to the broadcast Ethernet address (of all binary ones, FF-FF-FF-FF-FF-FF hex).
- `rfc-826` §Packet Generation
  > It then causes this packet to be broadcast to all stations on the Ethernet cable originally determined by the routing mechanism.
- `rfc-826` §An Example
  > sets the opcode to reply, and sends the packet directly (not broadcast) to EA(X).
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > All hosts within the broadcast domain receive the ARP request, and Host A responds with its MAC address.
- `rfc-1122` §2.3.2.1
  > MUST provide a mechanism to flush out-of-date cache entries.
- `rfc-1122` §2.3.2.1
  > Approaches (1) and (2) involve ARP cache timeouts on the order of a minute or less.
- `microsoft-arp` §Introduction
  > The arp command displays and modifies entries in the Address Resolution Protocol (ARP) cache.
- `rfc-4861` §1
  > Nodes (hosts and routers) use Neighbor Discovery to determine the link-layer addresses for neighbors known to reside on attached links
- `rfc-4861` §3.1
  > The IPv6 Neighbor Discovery protocol corresponds to a combination of the IPv4 protocols Address Resolution Protocol [ARP], ICMP Router Discovery [RDISC], and ICMP Redirect [ICMPv4].
- `rfc-5227` §5
  > A malicious host may send fraudulent ARP packets on the network, interfering with the correct operation of other hosts.
- Note: RFC 826 (Internet Standard 37) defines ARP's request, broadcast and reply. RFC 4861 defines IPv6 Neighbor Discovery. RFC 1122 sets the host's ARP cache rules. None is obsoleted. RFC 826 is updated by RFC 5227 and RFC 5494, and RFC 4861 by later RFCs. Neither change affects these points.
- Note: The Cisco DAI page (IOS XE 17.18.x) also says that a spoofing attack makes the victim's traffic flow through the attacker's computer. That is a second, independent source for the last sentence.

### units[0].steps[2].deep[0] (step "ip-encapsulation", Go deeper) — ✅

"An IPv4 header is 20 bytes: version, header length, total length, an ID and fragment fields, TTL, the protocol inside (6 TCP, 17 UDP, 1 ICMP), a checksum, and the two addresses. The Ethernet frame around it carries MAC addresses, which change at every hop; the IP addresses inside stay the same end to end, unless NAT changes them. A packet too big for a link is split up (fragmented), or dropped with an ICMP note if it's marked Don't Fragment."

- `rfc-791` §3.1
  > The maximal internet header is 60 octets, and a typical internet header is 20 octets
- `iana-protocol-numbers` §Assigned Internet Protocol Numbers
  > 6 TCP Transmission Control
- `rfc-791` §2.2
  > The datagram arrives at a gateway host wrapped in the local network header, the local network interface strips off this header, and turns the datagram over to the internet module.
- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the fragments thereof) in an appropriate Link Layer frame and queues it for output on the interface selected in step 5.
- `rfc-3022` §1
  > This solution has the disadvantage of taking away the end-to-end significance of an IP address
- `rfc-791` §1.1
  > The internet protocol also provides for fragmentation and reassembly of long datagrams, if necessary, for transmission through "small packet" networks.
- `rfc-791` §2.3
  > If internet datagram marked don't fragment cannot be delivered to its destination without fragmenting it, it is to be discarded instead.
- `rfc-792` §Destination Unreachable Message
  > Another case is when a datagram must be fragmented to be forwarded by a gateway yet the Don't Fragment flag is on.  In this case the gateway must discard the datagram and may return a destination unreachable message.
- Note: RFC 791 (Internet Standard 5) defines the IPv4 header, its fields and fragmentation. RFC 792 defines ICMP's Destination Unreachable message. RFC 1812 defines how an IPv4 router forwards and re-frames a packet. The IANA Protocol Numbers registry defines 1 for ICMP, 6 for TCP and 17 for UDP; all three entries were read. The registry is live and was last updated on 2026-03-09. None of the RFCs is obsoleted. RFC 791 is updated by RFC 1349, RFC 2474 and RFC 6864 (Type of Service and the ID field), which change nothing claimed here.
- Note: 20 bytes is the usual header, with no options; with options it can grow to 60. The field list also leaves out Type of Service and Options. Both omissions pass the beginner rule. "Change at every hop" holds because each router strips the old frame and builds a new one.

### units[0].steps[3].deep[0] (step "nat-and-forwarding", Go deeper) — ✅

"The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Home routers use port address translation: many devices share one public address and are told apart by port numbers in the NAT table. Each router picks the next hop by the longest matching prefix in its routing table; between providers, routes are learned with BGP. A packet whose TTL reaches 0 is dropped, which stops it looping for ever."

- `rfc-1918` §3
  > 10.0.0.0        -   10.255.255.255  (10/8 prefix)
  > 172.16.0.0      -   172.31.255.255  (172.16/12 prefix)
  > 192.168.0.0     -   192.168.255.255 (192.168/16 prefix)
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device.  NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `rfc-4864` §2.3
  > The subsequent checking of this database is not always a simple task, especially if Port Address Translation is used.
- `rfc-3022` §1
  > which would permit multiple nodes in a local network to simultaneously access remote networks using the single IP address assigned to their router.
- `rfc-3022` §2.2
  > NAPT would allow mapping of tuples of the type (local IP addresses, local TU port number) to tuples of the type (registered IP address, assigned TU port number).
- `rfc-1812` §5.2.4.3
  > then this rule would keep only the first (10.144.2.0/24) because its prefix length is longest.
- `rfc-4632` §5.1
  > Forwarding in the Internet is done on a longest-match basis.
- `rfc-4271` §1
  > The Border Gateway Protocol (BGP) is an inter-Autonomous System routing protocol.
- `rfc-1812` §5.3.1
  > Its hop count function is critical to ensuring that routing problems can't melt down the network by causing packets to loop infinitely in the network.
- `rfc-1122` §3.2.1.7
  > The intent is that TTL expiration will cause a datagram to be discarded by a gateway but not by the destination host
- Note: RFC 1918 (BCP 5) defines the private ranges. RFC 1812 defines IPv4 router forwarding, longest-match next-hop choice and TTL handling. RFC 4632 defines CIDR longest-match forwarding. RFC 4271 defines BGP-4. RFC 1122 sets the host rules for TTL. None is obsoleted. RFC 4271 is updated by later RFCs that refine BGP and leave its role as the inter-AS routing protocol in place. RFC 4787 is updated by RFC 6888 and RFC 7857, which keep NAPT as the common form. RFC 3022 and RFC 4864 are not obsoleted.
- Note: RFC 4271 says "inter-Autonomous System" where the lesson says "between providers"; the everyday word is a fair beginner's rendering. NAPT is RFC 3022's name for port address translation.

### units[0].steps[4].deep[0] (step "return-routing", Go deeper) — ✅

"The reply's TTL starts fresh, at the server's own default (often 64). The way back doesn't have to match the way out: each direction is routed on its own. NAT is also why a device at home can't easily be reached from outside, unless the router forwards a port to it."

- `rfc-791` §1.4
  > It is set by the sender of the datagram and reduced at the points along the route where it is processed.
- `iana-ip-parameters` §IP Time to Live Parameter
  > The current recommended default time to live (TTL) for the Internet Protocol (IP) is 64
- `rfc-6250` §3.1.1
  > Originally, it was the case that reachability was symmetric (although the path taken may not be), both within a link and across the Internet.
- `rfc-3704` §2.2
  > it is in no sense common between ISPs, which normally use asymmetrical "hot potato" routing.
- `rfc-3022` §2
  > In a traditional NAT, sessions are uni-directional, outbound from the private network.  Sessions in the opposite direction may be allowed on an exceptional basis using static address maps for pre-selected hosts.
- `rfc-3022` §2.2
  > It is possible to statically configure a well known TU port service [RFC 1700] on the stub router to be directed to a specific node in the private network.
- `rfc-4864` §5.3
  > it makes it quite hard for the equipment to become a worldwide Internet server (HTTP, FTP, etc.) due to the stateful operation of the NAT equipment.
- Note: RFC 791 defines the TTL as set by the sender. The IANA IP Parameters registry defines 64 as the recommended default. The registry is live, and the RFC is not obsoleted. RFC 6250 and RFC 3704 are not obsoleted; RFC 3704 is updated by RFC 8704, which does not change this point.
- Note: "Often 64" matches the registry's recommended default. Other operating systems may start at a different value, and the hedge allows for that.

### units[0].learn.lead[0] ("lead-1") — ✅

"One packet left your laptop with two addresses on it."

- `rfc-791` §3.1
  > Source Address:  32 bits
  > The source address.  See section 3.2.
  > Destination Address:  32 bits
- Note: RFC 791 defines the IPv4 header, which carries one source and one destination address. Not obsoleted.

### units[0].learn.lead[1] ("lead-2") — ✅

"Your router relabelled it once, and every router on the way passed it along."

- `rfc-3022` §2.1
  > However, NAT translates the source address 10.33.96.5 of the IP header to the globally unique 198.76.29.7 before the packet is forwarded.
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- Note: RFC 1812 defines IPv4 forwarding and is not obsoleted. It is updated by RFC 2644 and RFC 6633, which do not touch forwarding. RFC 3022 and RFC 4787 confirm the single swap at the home router.
- Note: "Once" leaves out carrier-grade NAT, where a provider adds a second translation (RFC 4864 describes this). Traditional NAT happens only at the stub border router (RFC 3022 §2), and that is the home case this lesson shows.

### units[0].learn.terms[0] ("term-ip") — ✅

"IP address: The number that says where a device is"

- `rfc-791` §2.3
  > A name indicates what we seek.  An address indicates where it is.
- Note: RFC 791 defines the internet address. Not obsoleted.

### units[0].learn.terms[1] ("term-routing") — ✅

"Routing decision: Is it on my network, or do I send it out?"

- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through a gateway.
- `rfc-791` §1.4
  > these modules (especially in gateways) have procedures for making routing decisions and other functions.
- Note: RFC 1122 §3.3.1.1 defines the host's local/remote decision, and RFC 791 names routing decisions. Neither is obsoleted.

### units[0].learn.terms[2] ("term-gateway") — ✅

"Default gateway: The way out of your network: your router"

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a particular destination, the host chooses a "default" gateway and sends the datagram to it.
- `microsoft-route` §Parameters
  > For remote routes, available across one or more routers, the gateway address is a directly reachable IP address that is assigned to a neighboring router.
- Note: RFC 1122 defines the host's default gateway selection and is not obsoleted. The Microsoft page is live.

### units[0].learn.terms[3] ("term-mac") — ✅

"MAC address: The hardware number of a network card"

- `rfc-9724` §2.1
  > A universally administered address is uniquely assigned to a device by its manufacturer.
- `rfc-826` §Abstract
  > To actually transmit the Ethernet packet a 48.bit Ethernet address must be generated.
- Note: RFC 9724 (2025, Informational) says most devices carry a manufacturer-assigned MAC address on their network interface. RFC 826 calls it the 48-bit Ethernet address used to send on Ethernet hardware. These are two different RFCs. Neither is obsoleted.
- Note: The term leaves out locally administered and randomized MAC addresses, which RFC 9724 describes as a newer practice. That is a variant a beginner can safely skip.

### units[0].learn.terms[4] ("term-arp") — ✅

"ARP: “Who has this address?”"

- `rfc-826` §Abstract
  > Presented here is a protocol that allows dynamic distribution of the information needed to build tables to translate an address A in protocol P's address space into a 48.bit Ethernet address.
- `rfc-826` §Packet Generation
  > ar$tpa with the protocol address of the machine that is trying to be accessed.
- Note: RFC 826 defines ARP. Its request names the protocol (IP) address whose owner it is looking for. Not obsoleted; updated by RFC 5227 and RFC 5494.

### units[0].learn.terms[5] ("term-header") — ✅

"IP header: The label on the front of the packet"

- `rfc-791` §2.2
  > The internet module prepares a datagram header and attaches the data to it.
- `rfc-791` §1.4
  > The internet modules use the addresses carried in the internet header to transmit internet datagrams toward their destinations.
- Note: RFC 791 defines the internet header, which comes before the data. Not obsoleted. "Label" is an everyday word for it.

### units[0].learn.terms[6] ("term-ttl") — ✅

"TTL: The hop counter that stops loops"

- `rfc-1122` §3.2.1.7
  > The TTL field has two functions: limit the lifetime of TCP segments (see RFC-793 [TCP:1], p. 28), and terminate Internet routing loops.
- `rfc-1812` §5.3.1
  > Since this is very often the case, the TTL is effectively a hop count limit on how far a datagram can propagate through the Internet.
- Note: RFC 1122 and RFC 1812 define how hosts and routers handle the TTL. Neither is obsoleted. The term leaves out TTL's old role as a time limit, which RFC 1812 says routers rarely implement.

### units[0].learn.terms[7] ("term-nat") — ✅

"NAT: Swapping a private address for a public one"

- `rfc-3022` §2.1
  > However, NAT translates the source address 10.33.96.5 of the IP header to the globally unique 198.76.29.7 before the packet is forwarded.
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `rfc-1918` §3
  > Because private addresses have no global meaning, routing information about private networks shall not be propagated on inter-enterprise links
- Note: RFC 1918 defines private addresses; RFC 3022 and RFC 4787 describe the swap. None is obsoleted.

### units[0].learn.terms[8] ("term-forwarding") — ✅

"Forwarding: Passing a packet on to the next router"

- `rfc-791` §2.4
  > Gateways implement internet protocol to forward datagrams between networks.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- Note: RFC 791 and RFC 1812 define IPv4 forwarding by gateways (routers). Neither is obsoleted. On the last hop the next device is the destination itself; that is a detail the term can leave out.

### units[0].learn.terms[9] ("term-encapsulation") — ✅

"Encapsulation: Wrapping the packet in a frame for the next link"

- `rfc-1812` §5.2.1.2
  > The forwarder encapsulates the IP datagram (or each of the fragments thereof) in an appropriate Link Layer frame and queues it for output on the interface selected in step 5.
- `rfc-791` §2.2
  > The local network interface creates a local network header, and attaches the datagram to it, then sends the result via the local network.
- Note: RFC 1812 and RFC 791 define the step. Neither is obsoleted.

### units[0].learn.pattern ("pattern") — ✅

Steps: Routing Decision, ARP Resolution, Encapsulation, NAT, Forwarding. Note: "An IPv4 packet you send to the internet leaves this way; ARP is skipped while the answer is in the cache. The routers on the way only forward."

- `rfc-1122` §3.3.1
  > If the destination is on a connected network, the datagram is sent directly to the destination host; otherwise, it has to be routed to a gateway on a connected network.
- `rfc-826` §Packet Generation
  > The Address Resolution module tries to find this pair in a table.  If it finds the pair, it gives the corresponding 48.bit Ethernet address back to the caller (hardware driver) which then transmits the packet.
- `rfc-1122` §2.3.2.1
  > MUST provide a mechanism to flush out-of-date cache entries.
- `rfc-1812` §5.2.1.2
  > The forwarder decrements (by at least one) and checks the packet's TTL
- `rfc-3022` §2.1
  > Likewise, IP packets on the return path go through similar address translations.
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device.
- Note: RFC 1122 (hosts), RFC 826 (ARP) and RFC 1812 (routers) define these steps. None is obsoleted.
- Note: "Only forward" leaves out a provider's own carrier-grade NAT. RFC 3022 §2 limits traditional NAT to the stub border router, which is the home router in this lesson. Forwarding includes the TTL decrement, as RFC 1812 lists it.

### units[0].learn.why[0] ("why-1") — ✅

"IP is the one thing every network on the internet agrees on."

- `rfc-1122` §1.1.3
  > All Internet transport protocols use the Internet Protocol (IP) to carry data from source host to destination host.
- `rfc-791` §1.4
  > These modules share common rules for interpreting address fields and for fragmenting and assembling internet datagrams.
- `rfc-1122` §1.1.2
  > The Internet is a network of networks.
- Note: RFC 791 defines IP and places an IP module in every host and gateway, all sharing common rules. RFC 1122, a second standard, says every transport protocol rides on IP while link layers vary widely. Neither is obsoleted.
- Note: "The one thing" is a beginner's way of saying that IP is the shared layer. It does not deny that networks also share other protocols.

### units[0].learn.why[1] ("why-2") — ✅

"Wi-Fi, Ethernet and mobile networks all work differently underneath, but they all carry IP packets, so a packet can cross all of them to reach any public address."

- `rfc-1122` §1.1.3
  > There is a wide variety of link layer protocols, corresponding to the many different types of networks.
- `rfc-791` §1.3
  > This protocol calls on local network protocols to carry the internet datagram to the next gateway or destination host.
- `rfc-9724` §2.1
  > Like any other kind of network interface based on IEEE 802 such as Ethernet (i.e., IEEE 802.3), Wi-Fi interfaces have an L2 address
- `rfc-9724` §1
  > more and more devices are connecting to the Internet either directly (e.g., via Wi-Fi) or indirectly (e.g., via a smartphone using Bluetooth).
- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- `rfc-7066` §1
  > are making it possible for cellular hosts to have an always-on connection to the Internet.
- `rfc-1918` §3
  > Public hosts can communicate with other hosts inside the enterprise both public and private and can have IP connectivity to public hosts outside the enterprise.
- Note: RFC 791 defines IP over any local network. RFC 894 defines IP over Ethernet. RFC 1918 defines the split between public and private addresses. RFC 9724 covers Wi-Fi and RFC 7066 covers cellular hosts. None is obsoleted.
- Note: "Any public address" is the ordinary case and leaves out firewalls that block traffic.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

"IP is best effort: it promises neither delivery nor order; TCP adds those."

- `rfc-791` §1.4
  > The internet protocol does not provide a reliable communication facility.
- `rfc-6250` §2
  > IP provides a connectionless delivery service for variable size packets, which does not guarantee ordering, delivery, or lack of duplication, but is merely best effort
- `rfc-1122` §1.1.3
  > IP is a connectionless or datagram internetwork service, providing no end-to-end delivery guarantees.
- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- Note: RFC 791 defines IP's service and RFC 9293 (Internet Standard 7) defines TCP's. Neither is obsoleted; RFC 9293 obsoletes RFC 793.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

"IPv4 has about 4.3 billion addresses, not enough for every device, which is why NAT exists."

- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- `rfc-4632` §3.1
  > prefixes may be defined to describe any power of two-sized block of between one and 2^32 end system addresses.
- `rfc-4864` §2.6
  > the ongoing depletion of the IPv4 address range has already taken the remaining pool of unallocated IPv4 addresses well below 20%.
- `rfc-4864` §1
  > Although there are many perceived benefits to NAT, its primary benefit of "amplifying" available address space is not needed in IPv6.
- `rfc-1918` §4
  > The obvious advantage of using private address space for the Internet at large is to conserve the globally unique address space by not using it where global uniqueness is not required.
- Note: RFC 791 defines the 32-bit address, and 2^32 is 4,294,967,296, about 4.3 billion. RFC 4632 and RFC 1918 define the address plan and private space. None is obsoleted.
- Note: RFC 3022 §1 also gives privacy as a reason for translation. "Which is why NAT exists" names the main reason, as RFC 4864 does, without denying the others.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

"IPv6 uses 128-bit addresses (like 2001:db8::80), enough for every device to have its own public address, with no ARP and usually no NAT."

- `rfc-8200` §1
  > IPv6 increases the IP address size from 32 bits to 128 bits
- `rfc-4864` §4.6
  > IPv6 provides sufficient space to completely avoid the need for overlapping address space.
- `rfc-4864` §1
  > Although there are many perceived benefits to NAT, its primary benefit of "amplifying" available address space is not needed in IPv6.
- `rfc-4861` §3.1
  > The IPv6 Neighbor Discovery protocol corresponds to a combination of the IPv4 protocols Address Resolution Protocol [ARP], ICMP Router Discovery [RDISC], and ICMP Redirect [ICMPv4].
- Note: RFC 8200 (Internet Standard 86) defines IPv6 and its 128-bit addresses. RFC 4861 defines Neighbor Discovery, which takes ARP's place. Neither is obsoleted. RFC 8200 is updated by RFC 9673, which covers hop-by-hop options only. 2001:db8::80 is in the documentation prefix.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

"A prefix such as 192.168.1.0/24 names a whole network; the Subnetting lesson goes further."

- `rfc-4632` §3.1
  > In CIDR notation, a prefix is shown as a 4-octet quantity, just like a traditional IPv4 address or network number, followed by the "/" (slash) character, followed by a decimal value between 0 and 32 that describes the number of significant bits.
- Note: RFC 4632 (BCP 122) defines CIDR prefixes and is not obsoleted. The pointer to another lesson is site navigation, not a claim about networking.

### units[0].learn.facts[0] ("fact-ipv4") — ✅

"IPv4: 32 bits, like 203.0.113.80"

- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- Note: RFC 791 defines the IPv4 address. Not obsoleted. 203.0.113.80 is an RFC 5737 example address.

### units[0].learn.facts[1] ("fact-ipv6") — ✅

"IPv6: 128 bits, like 2001:db8::80"

- `rfc-8200` §1
  > IPv6 increases the IP address size from 32 bits to 128 bits
- Note: RFC 8200 defines IPv6. Not obsoleted. 2001:db8::80 is an RFC 3849 example address.

### units[0].learn.facts[2] ("fact-private") — ✅

"Private ranges: 10/8, 172.16/12, 192.168/16"

- `rfc-1918` §3
  > 10.0.0.0        -   10.255.255.255  (10/8 prefix)
  > 172.16.0.0      -   172.31.255.255  (172.16/12 prefix)
  > 192.168.0.0     -   192.168.255.255 (192.168/16 prefix)
- Note: RFC 1918 (BCP 5) defines the private ranges. Not obsoleted; updated by RFC 6761 on DNS names only.

### units[0].learn.facts[3] ("fact-header") — ✅

"Header: 20 bytes (IPv4), 40 (IPv6)"

- `rfc-791` §3.1
  > a typical internet header is 20 octets
- `rfc-8200` §1
  > Some IPv4 header fields have been dropped or made optional, to reduce the common-case processing cost of packet handling and to limit the bandwidth cost of the IPv6 header.
- `rfc-8200` §8.3
  > because the minimum-length IPv6 header (i.e., an IPv6 header with no extension headers) is 20 octets longer than a minimum-length IPv4 header.
- Note: RFC 791 defines the IPv4 header and RFC 8200 the IPv6 header. RFC 8200 §8.3 gives the minimum IPv4 header as 20 octets and the IPv6 header as 20 more, so 40. Neither is obsoleted. The figures are for headers without options or extension headers, which is the ordinary case.

### units[0].learn.facts[4] ("fact-defined") — ✅

"Defined in: RFC 791, Internet Protocol (IPv4); RFC 8200 (IPv6)"

- `rfc-791` §3.1
  > This document describes version 4.
- `rfc-791` §1.1
  > The Internet Protocol is designed for use in interconnected systems of packet-switched computer communication networks.
- `rfc-8200` §1
  > IP version 6 (IPv6) is a new version of the Internet Protocol (IP), designed as the successor to IP version 4 (IPv4) [RFC791].
- Note: RFC 791 is the current IPv4 standard (STD 5) and RFC 8200 the current IPv6 standard (STD 86). The RFC Editor lists neither as obsoleted.

### units[0].learn.facts[5] ("fact-osi") — ✅

"OSI layer: 3, network"

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer
  > IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer)
- Note: Two independent vendor pages place IP at the network layer, layer 3. Both are live.

### units[0].learn.facts[6] ("fact-label") — ✅

"On the label: the source address, the destination address, a TTL, and the protocol inside, such as TCP (6), UDP (17) or ICMP (1)"

- `rfc-791` §3.1
  > This field indicates the next level protocol used in the data portion of the internet datagram.
- `iana-protocol-numbers` §Assigned Internet Protocol Numbers
  > 17 UDP User Datagram
- Note: RFC 791 defines the header's address, TTL and protocol fields. The IANA registry, which is live, defines the protocol numbers: it lists 1 as ICMP, 6 as TCP and 17 as UDP. The source and destination address fields are quoted under lead-1, and the TTL under fact-ttl.

### units[0].learn.facts[7] ("fact-ttl") — ✅

"TTL: set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped"

- `rfc-791` §1.4
  > It is set by the sender of the datagram and reduced at the points along the route where it is processed.
- `iana-ip-parameters` §IP Time to Live Parameter
  > The current recommended default time to live (TTL) for the Internet Protocol (IP) is 64
- `rfc-1122` §3.2.1.7
  > since each gateway is required to reduce the TTL field by at least one.
- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be discarded
- Note: RFC 791, RFC 1122 and RFC 1812 define how the TTL is set and handled. None is obsoleted. The IANA registry is live, and its recommended default is 64.
- Note: "64 by default" is the registry's recommended default; a system may be set to another value. "Takes 1 off" is the required minimum, which is the ordinary case.

### units[0].learn.facts[8] ("fact-arp") — ✅

"ARP: asks everyone on the home network at once, at the broadcast address ff:ff:ff:ff:ff:ff, “who has this address?”, and gives its own; only the owner replies with its MAC address, straight back, and the answer is kept in the ARP cache for a short while"

- `rfc-826` §Packet Generation
  > ar$sha with the 48.bit ethernet address of itself, ar$spa with the protocol address of itself, and ar$tpa with the protocol address of the machine that is trying to be accessed.
- `rfc-826` §Packet Reception
  > Send the packet to the (new) target hardware address on the same hardware on which the request was received.
- `rfc-826` §An Example
  > and broadcasts this packet to everybody on the cable.
- `rfc-894` §Address Mappings
  > should be mapped to the broadcast Ethernet address (of all binary ones, FF-FF-FF-FF-FF-FF hex).
- `rfc-1122` §2.3.2.1
  > MUST provide a mechanism to flush out-of-date cache entries.
- `rfc-1122` §2.3.2.1
  > Approaches (1) and (2) involve ARP cache timeouts on the order of a minute or less.
- `microsoft-arp` §Introduction
  > The ARP cache contains one or more tables that are used to store IP addresses and their resolved Ethernet or Token Ring physical addresses.
- `cisco-dai` §Understanding Dynamic ARP Inspection
  > Host B generates a broadcast message for all hosts within the broadcast domain to obtain the MAC address associated with the IP address of Host A.
- Note: RFC 826 defines ARP's request, which carries the sender's own addresses and is broadcast, and the reply, which goes straight back to the asker. RFC 894 defines Ethernet's all-ones broadcast address. RFC 1122 defines the cache timeout. None is obsoleted. The Microsoft and Cisco pages are live.

### units[0].learn.facts[9] ("fact-frame") — ✅

"On each link: the packet travels in a frame, such as an Ethernet or Wi-Fi frame, addressed to the next device's MAC address; each router puts it in a new frame"

- `rfc-894` §Frame Format
  > IP datagrams are transmitted in standard Ethernet frames.
- `rfc-9724` §2.1
  > Like any other kind of network interface based on IEEE 802 such as Ethernet (i.e., IEEE 802.3), Wi-Fi interfaces have an L2 address
- `rfc-791` §2.2
  > The internet module determines a local network address for this internet address, in this case it is the address of a gateway.
- `rfc-1812` §5.2.1.2
  > The forwarder determines the Link Layer address of the packet's next hop.
- Note: RFC 894 defines IP over Ethernet. RFC 791 and RFC 1812 define the hand-off to the next hop's link address and the new frame at each router. None is obsoleted.
- Note: The lesson's examples are Ethernet and Wi-Fi. Some links, such as point-to-point and cellular links, carry no MAC address. "Each link" is read in the ordinary home and provider case that the examples set.

### units[0].learn.facts[10] ("fact-hop") — ✅

"Each router: reads the destination, picks the next router from its routing table, and passes the packet on; after your router, the next is your provider's"

- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- `rfc-3022` §2.2
  > Say, an organization has a private IP network and a WAN link to a service provider.
- `rfc-3704` §2.2
  > While this is common at edge network interfaces to their ISP
- Note: RFC 1812 defines router forwarding and is not obsoleted. RFC 3022 and RFC 3704 both describe an edge network whose link goes to its provider.

### units[0].learn.facts[11] ("fact-nat") — ✅

"NAT at home: many homes use the same private addresses, which the internet doesn't carry, so your router puts its own public address on each packet going out, notes the swap, and swaps it back on the reply"

- `rfc-1918` §3
  > Because private addresses have no global meaning, routing information about private networks shall not be propagated on inter-enterprise links, and packets with private source or destination addresses should not be forwarded across such links.
- `rfc-3022` §2.1
  > Thus, addresses inside a stub domain can be reused by any other stub domain.
- `rfc-3022` §2.2
  > Packets on the return path go through similar address and TCP port translations for the target IP address and target TCP port.
- `rfc-4787` §3
  > so that subsequent response packets from the external endpoint can be received by the NAPT, translated, and forwarded to the internal host.
- Note: RFC 1918 defines private addresses and says they are not forwarded across the internet. RFC 3022 and RFC 4787 describe the swap and the swap back. None is obsoleted.

### units[0].learn.facts[12] ("fact-reply") — ✅

"The reply: goes to the public address the server saw, with a TTL the server sets, and is routed on its own, so its path can differ from the way out"

- `rfc-4787` §3
  > so that subsequent response packets from the external endpoint can be received by the NAPT, translated, and forwarded to the internal host.
- `rfc-3022` §2.2
  > Packets on the return path go through similar address and TCP port translations for the target IP address and target TCP port.
- `rfc-791` §1.4
  > It is set by the sender of the datagram and reduced at the points along the route where it is processed.
- `rfc-6250` §3.1.1
  > Originally, it was the case that reachability was symmetric (although the path taken may not be), both within a link and across the Internet.
- `rfc-3704` §2.2
  > it is in no sense common between ISPs, which normally use asymmetrical "hot potato" routing.
- Note: RFC 791 defines the TTL as set by the sender, here the server. RFC 6250 and RFC 3704 both say the return path can differ. None is obsoleted.

### units[0].learn.facts[13] ("fact-outside") — ✅

"From outside: a device at home can't be reached first, unless the router forwards a port to it"

- `rfc-3022` §2
  > In a traditional NAT, sessions are uni-directional, outbound from the private network.  Sessions in the opposite direction may be allowed on an exceptional basis using static address maps for pre-selected hosts.
- `rfc-3022` §2.2
  > It is possible to statically configure a well known TU port service [RFC 1700] on the stub router to be directed to a specific node in the private network.
- `rfc-6250` §3.1.1
  > It is relatively easy to initiate communication from hosts (A-E in the example diagram) to servers (S), but not vice versa
- Note: RFC 3022 and RFC 6250 are two different RFCs; neither is obsoleted. The fact leaves out workarounds such as NAT traversal tricks. That is the rarer case.

### units[0].practice[0].options[0] (question "source-swap") — ✅

Option "To hide what's inside the packet." (not the answer). Feedback: "Not quite. NAT doesn't encrypt anything. It swaps a private address for a public one."

- `rfc-3022` §Abstract
  > Basic Network Address Translation or Basic NAT is a method by which IP addresses are mapped from one group to another, transparent to end users.
- `rfc-3022` §2.1
  > However, NAT translates the source address 10.33.96.5 of the IP header to the globally unique 198.76.29.7 before the packet is forwarded.
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `rfc-4864` §2.4
  > Thus, although NATs do nothing to provide application level privacy, they do prevent the external tracking and profiling of individual systems by means of their IP addresses
- Note: The option is correctly marked wrong: NAT maps addresses and does not hide the contents. None of the RFCs is obsoleted.

### units[0].practice[0].options[1] (question "source-swap") — ✅

Option "Private addresses can't be reached from the internet, so it puts its public one on." (the answer). Feedback: "Right. That's NAT, and the router remembers the swap for the reply."

- `rfc-1918` §3
  > Because private addresses have no global meaning, routing information about private networks shall not be propagated on inter-enterprise links, and packets with private source or destination addresses should not be forwarded across such links.
- `rfc-3022` §2.1
  > Likewise, IP packets on the return path go through similar address translations.
- `rfc-3022` §2.2
  > NAPT would allow mapping of tuples of the type (local IP addresses, local TU port number) to tuples of the type (registered IP address, assigned TU port number).
- `rfc-4787` §3
  > so that subsequent response packets from the external endpoint can be received by the NAPT, translated, and forwarded to the internal host.
- Note: RFC 1918 defines private addresses and is not obsoleted. The option is correctly marked as the answer.

### units[0].practice[0].options[2] (question "source-swap") — ✅

Option "Every router changes it at every hop." (not the answer). Feedback: "Not quite. Routers on the way leave the addresses alone; they change the TTL, and the checksum that covers it. Your router swaps it once."

- `rfc-3022` §1
  > This solution has the disadvantage of taking away the end-to-end significance of an IP address
- `rfc-791` §2.2
  > The internet module determines from the internet address that the datagram is to be forwarded to another host in a second network.
- `rfc-791` §3.1
  > Since some header fields change (e.g., time to live), this is recomputed and verified at each point that the internet header is processed.
- `rfc-1812` §5.3.1
  > When a router forwards a packet, it MUST reduce the TTL by at least one.
- `rfc-3022` §2.1
  > However, NAT translates the source address 10.33.96.5 of the IP header to the globally unique 198.76.29.7 before the packet is forwarded.
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- Note: RFC 791 and RFC 1812 define what a router changes: the TTL, and the header checksum recomputed because of it. Neither is obsoleted.
- Note: As with lead-2, "once" leaves out a provider's carrier-grade NAT, which is not this lesson's home case. RFC 3022 §2 limits traditional NAT to the stub border router.

### units[0].practice[1].options[0] (question "loops") — ✅

Option "Its TTL: every router takes 1 off, and at 0 it's dropped." (the answer). Feedback: "Yes. That hop counter is the TTL."

- `rfc-1812` §5.3.1
  > If the TTL is reduced to zero (or less), the packet MUST be discarded
- `rfc-1122` §3.2.1.7
  > The TTL field has two functions: limit the lifetime of TCP segments (see RFC-793 [TCP:1], p. 28), and terminate Internet routing loops.
- Note: RFC 1812 and RFC 1122 define TTL handling and are not obsoleted. "Takes 1 off" is the required minimum.

### units[0].practice[1].options[1] (question "loops") — ✅

Option "The server sends it back." (not the answer). Feedback: "Not quite. A looping packet never reaches the server. Its TTL runs out and a router drops it."

- `rfc-1812` §5.3.1
  > Its hop count function is critical to ensuring that routing problems can't melt down the network by causing packets to loop infinitely in the network.
- `rfc-1122` §3.2.1.7
  > The intent is that TTL expiration will cause a datagram to be discarded by a gateway but not by the destination host
- Note: Both RFCs are current. A packet caught in a loop goes round until a router drops it.

### units[0].practice[1].options[2] (question "loops") — ✅

Option "ARP." (not the answer). Feedback: "Not quite. ARP only finds hardware addresses on your own network. The TTL stops loops."

- `rfc-826` §Abstract
  > The implementation of protocol P on a sending host S decides, through protocol P's routing mechanism, that it wants to transmit to a target host T located some place on a connected piece of 10Mbit Ethernet cable.
- `rfc-826` §Packet Generation
  > It then causes this packet to be broadcast to all stations on the Ethernet cable originally determined by the routing mechanism.
- `rfc-1122` §3.2.1.7
  > The TTL field has two functions: limit the lifetime of TCP segments (see RFC-793 [TCP:1], p. 28), and terminate Internet routing loops.
- Note: RFC 826 defines ARP as resolving addresses on the directly connected network, and RFC 1122 gives the TTL the job of ending loops. Neither is obsoleted.

## Traced, example and analogy parts, and unbacked items

All of these are ✅.

- title — ✅ ("IP" makes no claim.)
- units[0].name — ✅
- backing (the lesson's subtitle and summary) — ✅ (Every part traces to term-ip, term-header, fact-label, term-forwarding, fact-hop, why-1 and why-2.)
- units[0].backing (the unit's full name and purpose) — ✅ (fact-defined names the Internet Protocol.)
- units[0].scene.backing (the scene) — ✅ (Its addresses are RFC 1918 and RFC 5737 example values, and example.net is an example name. The roles, a provider's router after yours, NAT, ARP and TTL, trace to the Learn parts it names.)
- units[0].overview.hookBacking (the Overview hook) — ✅
- units[0].overview.backing (the Overview description) — ✅ (The parcel analogy matches hop-by-hop forwarding, where each router knows only the next hop. It does not mislead.)
- units[0].overview.facts[0] (Overview fact "Used for") — ✅
- units[0].overview.facts[1] (Overview fact "Addresses") — ✅
- units[0].overview.facts[2] (Overview fact "Each hop") — ✅
- units[0].overview.facts[3] (Overview fact "Promises") — ✅
- units[0].overview.facts[4] (Overview fact "OSI layer") — ✅
- units[0].overview.facts[5] (Overview fact "This example") — ✅ (RFC 1918 and RFC 5737 addresses.)
- units[0].steps[0] (step "routing-decision") — ✅
- units[0].steps[0].facts[0] (step "routing-decision", fact "Destination") — ✅ (RFC 5737 address.)
- units[0].steps[0].facts[1] (step "routing-decision", fact "My network") — ✅
- units[0].steps[0].facts[2] (step "routing-decision", fact "Same network?") — ✅
- units[0].steps[0].facts[3] (step "routing-decision", fact "So send it to") — ✅
- units[0].steps[1] (step "arp-resolution") — ✅
- units[0].steps[1].facts[0] (step "arp-resolution", fact "Asks") — ✅
- units[0].steps[1].facts[1] (step "arp-resolution", fact "Sent to") — ✅
- units[0].steps[1].facts[2] (step "arp-resolution", fact "Answer") — ✅
- units[0].steps[1].facts[3] (step "arp-resolution", fact "Kept in") — ✅
- units[0].steps[1].events[0] (event "m1") — ✅ (The MAC addresses are in the documentation range. The timestamps are illustrative.)
- units[0].steps[1].events[1] (event "m2") — ✅
- units[0].steps[2] (step "ip-encapsulation") — ✅
- units[0].steps[2].facts[0] (step "ip-encapsulation", fact "Source") — ✅
- units[0].steps[2].facts[1] (step "ip-encapsulation", fact "Destination") — ✅
- units[0].steps[2].facts[2] (step "ip-encapsulation", fact "TTL") — ✅
- units[0].steps[2].facts[3] (step "ip-encapsulation", fact "Frame to") — ✅
- units[0].steps[2].events[0] (event "m3") — ✅
- units[0].steps[2].events[1] (event "written-1") — ✅
- units[0].steps[3] (step "nat-and-forwarding") — ✅
- units[0].steps[3].facts[0] (step "nat-and-forwarding", fact "Private source") — ✅
- units[0].steps[3].facts[1] (step "nat-and-forwarding", fact "Swapped for") — ✅
- units[0].steps[3].facts[2] (step "nat-and-forwarding", fact "Each hop") — ✅
- units[0].steps[3].facts[3] (step "nat-and-forwarding", fact "Arrives with") — ✅ (60 is 64 less one per router on the example path, as fact-ttl teaches.)
- units[0].steps[3].events[0] (event "m4") — ✅
- units[0].steps[3].events[1] (event "written-2") — ✅
- units[0].steps[3].events[2] (event "m5") — ✅ (63 less three hops is 60, which matches.)
- units[0].steps[3].events[3] (event "written-3") — ✅
- units[0].steps[4] (step "return-routing") — ✅
- units[0].steps[4].facts[0] (step "return-routing", fact "Reply to") — ✅
- units[0].steps[4].facts[1] (step "return-routing", fact "Router swaps it to") — ✅
- units[0].steps[4].facts[2] (step "return-routing", fact "Path back") — ✅
- units[0].steps[4].facts[3] (step "return-routing", fact "From outside") — ✅
- units[0].steps[4].events[0] (event "m6") — ✅ (The reply's TTL is set by the server, as fact-reply says. The example value matches the hop count.)
- units[0].steps[4].events[1] (event "written-4") — ✅
- units[0].steps[4].events[2] (event "m7") — ✅ (Your router takes 1 off, so 61 becomes 60.)
- units[0].steps[4].events[3] (event "written-5") — ✅
- units[0].practice[0].prompt (question "source-swap") — ✅ (The premise, that your router changes the source address, is what the lesson teaches.)
- units[0].practice[1].prompt (question "loops") — ✅

## Sources

All were checked on 2026-11-12.

- `cisco-dai`: live Cisco configuration guide for IOS XE 17.18.x on Catalyst 9300, a current release. Current.
- `cisco-route-command`: live Cisco tech note, updated 2022-12-07, for Unified Contact Center Enterprise. It describes the Windows `route` command, which Microsoft's current page also documents. Current.
- `cloudflare-network-layers`: live Cloudflare docs page, updated October 2026. Current.
- `iana-ip-parameters`: the live IANA registry, read as XML. Current.
- `iana-protocol-numbers`: the live IANA registry, read as XML, last updated 2026-03-09. Current.
- `microsoft-arp`: live Microsoft Learn page, applies to Windows 11 and Windows Server 2025. Current.
- `microsoft-osi`: live Microsoft Learn page, updated 2025-01-31. Current.
- `microsoft-route`: live Microsoft Learn page, applies to Windows 11 and Windows Server 2025. Current.
- `rfc-1122`: not obsoleted. Its updates (RFC 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029, 9293) leave the cited sections in force. Current.
- `rfc-1812`: not obsoleted; updated by RFC 2644 and RFC 6633. Current.
- `rfc-1918`: not obsoleted; updated by RFC 6761. Current.
- `rfc-3022`: not obsoleted. Current.
- `rfc-3704`: not obsoleted; updated by RFC 8704. Current.
- `rfc-4271`: not obsoleted; updated by later BGP RFCs. Current.
- `rfc-4632`: not obsoleted. Current.
- `rfc-4787`: not obsoleted; updated by RFC 6888 and RFC 7857. Current.
- `rfc-4861`: not obsoleted; updated by later RFCs. Current.
- `rfc-4864`: not obsoleted. Current.
- `rfc-5227`: not obsoleted. Current.
- `rfc-6250`: not obsoleted. Current.
- `rfc-7066`: not obsoleted. Current.
- `rfc-791`: not obsoleted; updated by RFC 1349, RFC 2474 and RFC 6864. Current.
- `rfc-792`: not obsoleted; updated by RFC 950, 4884, 6633 and 6918. Current.
- `rfc-8200`: not obsoleted; updated by RFC 9673. Current.
- `rfc-826`: not obsoleted; updated by RFC 5227 and RFC 5494. Current.
- `rfc-894`: not obsoleted. Current.
- `rfc-9293`: not obsoleted. Current.
- `rfc-9724`: not obsoleted. Current.

For every RFC, currency was read from its RFC Editor info page (`https://www.rfc-editor.org/info/rfcNNNN`). None lists an "Obsoleted by" entry.

## Limit overrides

None.
