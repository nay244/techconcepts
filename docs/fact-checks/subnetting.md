```json fact-check
{
  "slug": "subnetting",
  "hash": "17005e579a5d69765401c98577739d117dbeae9eb8924fa0f5ac94775637c5c2",
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
    "units[0].overview.facts[0] (Overview fact \"Written as\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Mask\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Usable addresses\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Addresses here\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].steps[0] (step \"portions\")": "✅",
    "units[0].steps[0].facts[0] (step \"portions\", fact \"Address\")": "✅",
    "units[0].steps[0].facts[1] (step \"portions\", fact \"Network portion\")": "✅",
    "units[0].steps[0].facts[2] (step \"portions\", fact \"Host portion\")": "✅",
    "units[0].steps[0].facts[3] (step \"portions\", fact \"Whole address\")": "✅",
    "units[0].steps[0].events[0] (event \"address\")": "✅",
    "units[0].steps[0].events[1] (event \"network-part\")": "✅",
    "units[0].steps[0].events[2] (event \"host-part\")": "✅",
    "units[0].steps[1] (step \"subnet-mask\")": "✅",
    "units[0].steps[1].facts[0] (step \"subnet-mask\", fact \"Mask\")": "✅",
    "units[0].steps[1].facts[1] (step \"subnet-mask\", fact \"In bits\")": "✅",
    "units[0].steps[1].facts[2] (step \"subnet-mask\", fact \"Prefix length\")": "✅",
    "units[0].steps[1].facts[3] (step \"subnet-mask\", fact \"Written\")": "✅",
    "units[0].steps[1].events[0] (event \"mask-24\")": "✅",
    "units[0].steps[1].events[1] (event \"prefix-24\")": "✅",
    "units[0].steps[2] (step \"network-broadcast\")": "✅",
    "units[0].steps[2].facts[0] (step \"network-broadcast\", fact \"Network address\")": "✅",
    "units[0].steps[2].facts[1] (step \"network-broadcast\", fact \"Broadcast address\")": "✅",
    "units[0].steps[2].facts[2] (step \"network-broadcast\", fact \"Usable addresses\")": "✅",
    "units[0].steps[2].facts[3] (step \"network-broadcast\", fact \"Usable range\")": "✅",
    "units[0].steps[2].events[0] (event \"network-24\")": "✅",
    "units[0].steps[2].events[1] (event \"broadcast-24\")": "✅",
    "units[0].steps[2].events[2] (event \"usable-24\")": "✅",
    "units[0].steps[3] (step \"borrowing-bits\")": "✅",
    "units[0].steps[3].facts[0] (step \"borrowing-bits\", fact \"Mask\")": "✅",
    "units[0].steps[3].facts[1] (step \"borrowing-bits\", fact \"Cut from one /24\")": "✅",
    "units[0].steps[3].facts[2] (step \"borrowing-bits\", fact \"Design’s subnet\")": "✅",
    "units[0].steps[3].facts[3] (step \"borrowing-bits\", fact \"Usable addresses\")": "✅",
    "units[0].steps[3].events[0] (event \"mask-26\")": "✅",
    "units[0].steps[3].events[1] (event \"subnets-26\")": "✅",
    "units[0].steps[3].events[2] (event \"network-26\")": "✅",
    "units[0].steps[3].events[3] (event \"broadcast-26\")": "✅",
    "units[0].steps[4] (step \"local-remote\")": "✅",
    "units[0].steps[4].facts[0] (step \"local-remote\", fact \"Laptop\")": "✅",
    "units[0].steps[4].facts[1] (step \"local-remote\", fact \"Printer\")": "✅",
    "units[0].steps[4].facts[2] (step \"local-remote\", fact \"Design PC\")": "✅",
    "units[0].steps[4].facts[3] (step \"local-remote\", fact \"Default gateway\")": "✅",
    "units[0].steps[4].events[0] (event \"same-subnet\")": "✅",
    "units[0].steps[4].events[1] (event \"different-subnet\")": "✅",
    "units[0].steps[5] (step \"point-to-point\")": "✅",
    "units[0].steps[5].facts[0] (step \"point-to-point\", fact \"Mask\")": "✅",
    "units[0].steps[5].facts[1] (step \"point-to-point\", fact \"This subnet\")": "✅",
    "units[0].steps[5].facts[2] (step \"point-to-point\", fact \"Usable addresses\")": "✅",
    "units[0].steps[5].facts[3] (step \"point-to-point\", fact \"Typical use\")": "✅",
    "units[0].steps[5].events[0] (event \"mask-30\")": "✅",
    "units[0].steps[5].events[1] (event \"network-30\")": "✅",
    "units[0].steps[5].events[2] (event \"usable-30\")": "✅",
    "units[0].steps[0].deep[0] (step \"portions\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"subnet-mask\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"network-broadcast\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"borrowing-bits\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"local-remote\", Go deeper)": "✅",
    "units[0].steps[5].deep[0] (step \"point-to-point\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.terms[0] (\"term-network\")": "✅",
    "units[0].learn.terms[1] (\"term-host\")": "✅",
    "units[0].learn.terms[2] (\"term-mask\")": "✅",
    "units[0].learn.terms[3] (\"term-prefix\")": "✅",
    "units[0].learn.terms[4] (\"term-netaddr\")": "✅",
    "units[0].learn.terms[5] (\"term-broadcast\")": "✅",
    "units[0].learn.terms[6] (\"term-subnet\")": "✅",
    "units[0].learn.terms[7] (\"term-borrow\")": "✅",
    "units[0].learn.terms[8] (\"term-gateway\")": "✅",
    "units[0].learn.terms[9] (\"term-p2p\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-block\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-25\")": "✅",
    "units[0].learn.facts[1] (\"fact-26\")": "✅",
    "units[0].learn.facts[2] (\"fact-27\")": "✅",
    "units[0].learn.facts[3] (\"fact-28\")": "✅",
    "units[0].learn.facts[4] (\"fact-29\")": "✅",
    "units[0].learn.facts[5] (\"fact-30\")": "✅",
    "units[0].learn.facts[6] (\"fact-defined\")": "✅",
    "units[0].learn.facts[7] (\"fact-bits\")": "✅",
    "units[0].learn.facts[8] (\"fact-usable\")": "✅",
    "units[0].learn.facts[9] (\"fact-borrow\")": "✅",
    "units[0].learn.facts[10] (\"fact-examples\")": "✅",
    "units[0].learn.facts[11] (\"fact-cidr\")": "✅",
    "units[0].learn.facts[12] (\"fact-osi\")": "✅",
    "units[0].practice[0].options[0] (question \"usable-26\")": "✅",
    "units[0].practice[0].options[1] (question \"usable-26\")": "✅",
    "units[0].practice[0].options[2] (question \"usable-26\")": "✅",
    "units[0].practice[1].options[0] (question \"via-router\")": "✅",
    "units[0].practice[1].options[1] (question \"via-router\")": "✅",
    "units[0].practice[1].options[2] (question \"via-router\")": "✅",
    "units[0].practice[2].options[0] (question \"why-30\")": "✅",
    "units[0].practice[2].options[1] (question \"why-30\")": "✅",
    "units[0].practice[2].options[2] (question \"why-30\")": "✅",
    "units[0].practice[0].prompt (question \"usable-26\")": "✅",
    "units[0].practice[1].prompt (question \"via-router\")": "✅",
    "units[0].practice[2].prompt (question \"why-30\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-host-subnet-quantities",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cisco-ip-subnets",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-osi",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-tcpip-subnetting",
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
      "id": "rfc-2131",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-2644",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-3021",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-4632",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5737",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-826",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-919",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-950",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 172,
    "digest": "8fb7dac0b854557f3df38b665dceed66f958eaf2fe1fb3c80d7e840762fad4ed",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-osi": "d0bf680f028e01849b2071b408254ed66710edc5532375e2e9a91deb635d7d6f",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-950": "59294d6dbdfcb02589d00ba66386261f8c6e714d8b3f3d2e37b39424f5c9a795",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "cisco-ip-subnets": "368154cc939ede030b8d02d6bbd3834268231a12f7a344f7ed3393a767a1b36f",
      "microsoft-tcpip-subnetting": "0366d8b26a791632a83d82ccac70a4fb6476fa4cb788ae122ad1c5bdff33feda",
      "rfc-4632": "13694a39f586eb2054407780edccdf7c39332e57f067c8008bba4326bfc24fa9",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "cisco-host-subnet-quantities": "cbd417acd6b6761ccde89c2b1ca492b5643946b906547b172af7584fd58f27d5",
      "rfc-3021": "e19bf6ce80f4d5c9f82c2b7c08802bf8a1b8f8f00fea348dffac1142646861e7",
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "rfc-826": "01bc62fe6a37e90f1246ac43e8e145f1322b4ed1474836145c3da93d2bd3c8a6",
      "rfc-2644": "aab4831f1d657eacbf81510d2e8c282db55549b72a1222ee8fc3871b390716cb",
      "rfc-5737": "9d16217614a74a9b064eff900e5cd07a525793cf8227dca1267100e880f0c410",
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "rfc-919": "37d6bdb202cd4336e0922b862dbcff0516cd0d7cfa5219d0109e16545b1df64e"
    }
  },
  "items": {
    "title": "e7357447bad7fe3adf2a91c945ed203a98f6023806c5cea63ec8adc6ed6cf27d",
    "units[0].name": "dba6d5c4d235bfdc9ac2f17f0d10f1d874d013694b6a5a241f0f02c7c6b4ad5f",
    "units[0].osi": "f37ec550a1d3562e1cd1277485d5320927d5059f6c98e868b2518dcbbf74c99f",
    "backing (the lesson's subtitle and summary)": "335e9fe539fe76a5d1850228ca49285ad2f99e5f7366c50b4ab82291e0678f00",
    "units[0].backing (the unit's full name and purpose)": "b9d37b5bc75938d8e84650e9175b6e2d5359bc927e593f607f759186c561e964",
    "units[0].scene.backing (the scene)": "4dc9410a8246ed0b2519334e1aaaf5db83ae44757387fb452f5f454ea6d37577",
    "units[0].overview.hookBacking (the Overview hook)": "85c37cba0c41495d50527785a3b91d7585eaf4ddd445b16f906dc0c2616f3ba8",
    "units[0].overview.backing (the Overview description)": "b3eff5b52920a0ff1e7cc2877e44288d435d91a6aa48e147265a9b4f71f8db0f",
    "units[0].overview.facts[0] (Overview fact \"Written as\")": "ca61ce190edab7f589c9c32896cbffa5af90b79718a598df3ff1186cc78ae2e2",
    "units[0].overview.facts[1] (Overview fact \"Mask\")": "dce468bd3556a897289fb14de477d7e11ee8757e54d2d7b8b3e6fb8a6bdd1401",
    "units[0].overview.facts[2] (Overview fact \"Usable addresses\")": "031667f551cebbb751117b800e33a5128cc9ddd582c49b4e5626a8aa9c7f3e8e",
    "units[0].overview.facts[3] (Overview fact \"Addresses here\")": "a2b6bcde23aa3b0da2392b467ba548cdc648ef82d3ac9367285d66798cbaa717",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "07102b7c3685baebfee6ad0489539f0345953b2f5276bd3fe74d6b075ac476a2",
    "units[0].steps[0] (step \"portions\")": "64aa7e917b5a58c5a99937e6efeb3e04dde2ca89ebcf8739a80c28311c2d6c98",
    "units[0].steps[0].facts[0] (step \"portions\", fact \"Address\")": "312e17888e55d9772b4420c70a0cc567d7cc60f72d31b7fec2291ce7a682c991",
    "units[0].steps[0].facts[1] (step \"portions\", fact \"Network portion\")": "cdcf341bda77b9521e65779c746cd386c3e86a4b44384a2e9dad0a790506c67c",
    "units[0].steps[0].facts[2] (step \"portions\", fact \"Host portion\")": "038da28cea587fc03e0f8eccfbdb851dcf0bfd36452b12de209a9baf6517d936",
    "units[0].steps[0].facts[3] (step \"portions\", fact \"Whole address\")": "f742cd6c14503e698f53cb6729e4dcdf03ba268a58a843f2c1189c5af464091f",
    "units[0].steps[0].events[0] (event \"address\")": "1f0fe72cfe5509ed7887270008a6a5d16bdbcb8e0322e670cb53dcab6e350df4",
    "units[0].steps[0].events[1] (event \"network-part\")": "2f8f73d72c25a2408f986f8eaa93e3b05eb700dede0232022eb0ca1932624c4b",
    "units[0].steps[0].events[2] (event \"host-part\")": "7aad52cc46ae1a55390df8bef5fc85503c3894ce633cea12391b8508d3b029af",
    "units[0].steps[1] (step \"subnet-mask\")": "e9fce310f796b2efe26880c27e8f803f306da030c3377e5285da7232d2ae1e0d",
    "units[0].steps[1].facts[0] (step \"subnet-mask\", fact \"Mask\")": "b17265cdec6db3d999f64fe5613e3f175979b3ffe7959b07ef7bf7274741071e",
    "units[0].steps[1].facts[1] (step \"subnet-mask\", fact \"In bits\")": "ccdc1d8b837fdd50e2e1f50634e6ff491b187d09f334e66793cfb030647039fd",
    "units[0].steps[1].facts[2] (step \"subnet-mask\", fact \"Prefix length\")": "2d494f02e82006fb1d28ef437326c68fbcef011e1663ee5660b684cce0b8fdf4",
    "units[0].steps[1].facts[3] (step \"subnet-mask\", fact \"Written\")": "2b59e7018198e16e1312df88364a81a3cf4fd2b67b41a68cb694918bbf21e3f5",
    "units[0].steps[1].events[0] (event \"mask-24\")": "eeefde3fd49c2748f759660e2f7f89270c64ab827be97226b7e707f425edd9f0",
    "units[0].steps[1].events[1] (event \"prefix-24\")": "e9803b57d28242239685524a7c2c15035e3a8eb4d2b488c06ff375e5fb78f4f9",
    "units[0].steps[2] (step \"network-broadcast\")": "ecd27b2be5b2229305d5020a56529a4c74b21a46badc9ccbd8996f7b84e6fd1c",
    "units[0].steps[2].facts[0] (step \"network-broadcast\", fact \"Network address\")": "c345e55b7e51768573deb3755ab98876de67198f0c37d3cc8d91d7e676039a51",
    "units[0].steps[2].facts[1] (step \"network-broadcast\", fact \"Broadcast address\")": "851b1294b0f5ea82dbf02e3688cd596fecf8cb32e6ed0f981d6b672216fbdcfc",
    "units[0].steps[2].facts[2] (step \"network-broadcast\", fact \"Usable addresses\")": "87b65e34f3c74c9ce0344f56adb69656974b9e902b53d6c2db5f4cf78519f345",
    "units[0].steps[2].facts[3] (step \"network-broadcast\", fact \"Usable range\")": "790f6dfb617566b31b42e95a4e480cc7ea46f26a11857199e7a8a48cc660f0ba",
    "units[0].steps[2].events[0] (event \"network-24\")": "d6c9572c7b0428f06269ee0cfce825bc7dfda8899afccc78fbeab9800e3e7044",
    "units[0].steps[2].events[1] (event \"broadcast-24\")": "deb1fb25ccbe8c40030c0dcad7f7befa2bf2ad08dd59608b3fb5d929e006ee5c",
    "units[0].steps[2].events[2] (event \"usable-24\")": "578913aa5c6931c412ac9f1b7cfd7a8c12510a452acedb6623b8f20d4c32ca2e",
    "units[0].steps[3] (step \"borrowing-bits\")": "e7cabb24ea06d147c7f02d4e3156030910ef2d08c28afa80fe2be0359232dfda",
    "units[0].steps[3].facts[0] (step \"borrowing-bits\", fact \"Mask\")": "981d5d1c1a3e482dd8af7a26d3bfaf80f71d60f18ea4b514f401667486314f49",
    "units[0].steps[3].facts[1] (step \"borrowing-bits\", fact \"Cut from one /24\")": "682fe5a46fcfb3cd42b3279e81138b0994c5fae20606204e84fd9db61b055224",
    "units[0].steps[3].facts[2] (step \"borrowing-bits\", fact \"Design’s subnet\")": "ad087193988041a4794c89bd92053992731e3812ffdfd5e60533ba135eede0b4",
    "units[0].steps[3].facts[3] (step \"borrowing-bits\", fact \"Usable addresses\")": "498ba74c92e06010fc763252a61eb1026306dfc7d6d20d902ee1cc96062dde35",
    "units[0].steps[3].events[0] (event \"mask-26\")": "6de5575fca5d255bcd6865079816fb4f70a89371bfaef46eaa01036724657808",
    "units[0].steps[3].events[1] (event \"subnets-26\")": "820f5cd1ab77b9a220d7fbadac7d9840e25783a561e88e538716310ac32ec495",
    "units[0].steps[3].events[2] (event \"network-26\")": "e646c2ee56c218c7e2baee4ccbace8903417d82f28f66cf9fc8a10c6c89290a3",
    "units[0].steps[3].events[3] (event \"broadcast-26\")": "a7f0b96c5495b5fa45408af1879460e31264cb0264e152b0be2901c143cb3b81",
    "units[0].steps[4] (step \"local-remote\")": "84d57ddba05c4d0b885b945f9a246c11a4832d646506653c781ea2a2b148dd5c",
    "units[0].steps[4].facts[0] (step \"local-remote\", fact \"Laptop\")": "1aea63567b55fa17fe73d3f5401508d6662a3784517f21238485fb5405bc4e79",
    "units[0].steps[4].facts[1] (step \"local-remote\", fact \"Printer\")": "8bf7fc242db92b78435e6ac2841974c1c0cfa8e655429d8045532bc8e89dd1c2",
    "units[0].steps[4].facts[2] (step \"local-remote\", fact \"Design PC\")": "88f9ad8ee991e7a32b54adc33847f9ef07e84c8f93eeb14972a689d6b41aa731",
    "units[0].steps[4].facts[3] (step \"local-remote\", fact \"Default gateway\")": "0da78ee698374c6d370f414e05a6c94d94d21cd684887a6cacf5088f27efef36",
    "units[0].steps[4].events[0] (event \"same-subnet\")": "fc226a2b41c52982c8860ec61b9e41e04df4a9f8573dd0feb9e620099af97c94",
    "units[0].steps[4].events[1] (event \"different-subnet\")": "487d42ff54a921689bbc969583356b1368bb745b6cf1f9648a4a544a3b4afb55",
    "units[0].steps[5] (step \"point-to-point\")": "87e3785567e736842d23c46754b7e998bc071ec38355fbba75ef65991a6558b3",
    "units[0].steps[5].facts[0] (step \"point-to-point\", fact \"Mask\")": "fe7a0915c17557d6e235790ef9ca5505c27ab36c3f73d5ec54d73580bfafe19b",
    "units[0].steps[5].facts[1] (step \"point-to-point\", fact \"This subnet\")": "ed119a113bb642f588b4548b2a66e53ee7ac50529c02ff32f569204256bdeb15",
    "units[0].steps[5].facts[2] (step \"point-to-point\", fact \"Usable addresses\")": "11202ef8047d0e89eba8db828417a471afd3d4511c5b3c57980d6bc96dcd9e26",
    "units[0].steps[5].facts[3] (step \"point-to-point\", fact \"Typical use\")": "2aa2d40669b75aba3d362930556487d7c99dd60084eadba8c94d2536867048a0",
    "units[0].steps[5].events[0] (event \"mask-30\")": "1eaed9c8b47c6f8957803abebf987035c4e1c88d3f8b9f631f19c6a28e5b9acd",
    "units[0].steps[5].events[1] (event \"network-30\")": "e2cd46ddc18b7ae4213639812d4b99af9fdec06d885e4accf6d36674ee58fb0c",
    "units[0].steps[5].events[2] (event \"usable-30\")": "00fdd26b69e9c07e9f7fe4e33d36a18eb10a1b4752d6012797dfed992ba14109",
    "units[0].steps[0].deep[0] (step \"portions\", Go deeper)": "069402f9dd7296a86f51d5766f6e231243382faf620dad706ca6cb6869a4e227",
    "units[0].steps[1].deep[0] (step \"subnet-mask\", Go deeper)": "befc37792eeb7cb2c778c5121a36a6f21930d391d72e7679882009a0ae1bf675",
    "units[0].steps[2].deep[0] (step \"network-broadcast\", Go deeper)": "b515a121b38aea76708c1f5bdb76824032d66f20b271cfb6bbe39f71e36896d7",
    "units[0].steps[3].deep[0] (step \"borrowing-bits\", Go deeper)": "d5a03afbf28bb5ca670678281b57d2c0507a480001cd9afa3c615f3749605b4f",
    "units[0].steps[4].deep[0] (step \"local-remote\", Go deeper)": "7381a20546019417d5d26d8aeac1006433fd5af1bfd9bf6150f04bfd2d350afc",
    "units[0].steps[5].deep[0] (step \"point-to-point\", Go deeper)": "3bcea8d5da42df946eec23c90ddaf313494996cf8f8d12f2c901498ca19ce5bd",
    "units[0].learn.lead[0] (\"lead-1\")": "aa3095e35d9ab1fd35a4c59194a60c912e42f41e40bedcde0a4b4aac06005d1b",
    "units[0].learn.lead[1] (\"lead-2\")": "ef4cbcf96b0b02f5bdd886a8a895a2a8d50020df36c7f885614b37dddb688e3f",
    "units[0].learn.terms[0] (\"term-network\")": "d1e274962bcc70663ace9512598fdf9766870b2b92b8b6425349a8a473c5f2c8",
    "units[0].learn.terms[1] (\"term-host\")": "c3027113225a8bae08353480641da175b5028c3807eaca62965e5a3a66c3b763",
    "units[0].learn.terms[2] (\"term-mask\")": "282b5a865ea2849b159ed558da481931807e4bc5e02fa108764ff7413d75dd4f",
    "units[0].learn.terms[3] (\"term-prefix\")": "6e7152fa28d4109bd073fdfe5f78082b9a80b46ddd6df9a115a807a465983565",
    "units[0].learn.terms[4] (\"term-netaddr\")": "690362c88fe87da906a2a7843dfb62f729aac1a712791ce689840c5155c8bb60",
    "units[0].learn.terms[5] (\"term-broadcast\")": "6a7cc16b94e69cace8c9d11d892d5ed3d07b4eee13081c1ff6e5b073a1a7ce82",
    "units[0].learn.terms[6] (\"term-subnet\")": "c63364ed27859d76f6a41e7915bf1ac92918cc6d14373df3c1548acf759f195b",
    "units[0].learn.terms[7] (\"term-borrow\")": "0ec3a50f3fb527ec4160ae451f6b1f58719ffb1d5d58746726f3fb7dc998bc2d",
    "units[0].learn.terms[8] (\"term-gateway\")": "6ad18cd3dac67166697faf2e49fc43f70352fe3c4d23e86b4dfb9bb73a7520c8",
    "units[0].learn.terms[9] (\"term-p2p\")": "bd39db9fff87bd86eb7c5f2c6b1d170a56d2b6adb973578bc18048b30a63b030",
    "units[0].learn.pattern (\"pattern\")": "466d846433bba57739bd9ef54e3e1a8678a946d6ca0025185fdf4431994b5f7f",
    "units[0].learn.why[0] (\"why-1\")": "ab53c47293ec7b80cc7f969b18f6b1c29fd96027c7f9fa8a3ba1249e12a09acc",
    "units[0].learn.why[1] (\"why-2\")": "80ac6a04db4673065dd9855058473fa77bf69d9b39173669bb073185be6d288f",
    "units[0].learn.deep[0] (\"deep-block\", Learn's Go deeper)": "18012059a25cbd095775faec836aefc7c0809b43fd6f5997817560d8ccd9f527",
    "units[0].learn.facts[0] (\"fact-25\")": "4f2cc98e927b36d32e4fb271a6c37d6673fdc3ac6d37db6b8c7eb8edee2fa4a8",
    "units[0].learn.facts[1] (\"fact-26\")": "650fd6159f804b8e9cb8d33188215aa9bbbdf5d12540698d5f2222eded2b850c",
    "units[0].learn.facts[2] (\"fact-27\")": "46c6a1a0232edb60b9b676bd99619b2ec2a1667e1c8fdc39bdc5f6970dd7f8ad",
    "units[0].learn.facts[3] (\"fact-28\")": "f621fc27b1bf7e5191af74563b00386c8c904e9b840a2bed342992a7cd2db14c",
    "units[0].learn.facts[4] (\"fact-29\")": "396a125c62f916b8b766036321b783b25595b1717ef31ed7971f63f3531e90c0",
    "units[0].learn.facts[5] (\"fact-30\")": "92ddd2571ba33f56e911a8ce1b07fc48359761176d2ac4649456ff0a3571b8cb",
    "units[0].learn.facts[6] (\"fact-defined\")": "5bbcb950c6120891a0a990e03ccc30791b06d84738a56ac2e984b0c8f3ea6e31",
    "units[0].learn.facts[7] (\"fact-bits\")": "2e09fd63006d3cec37e4a04493fe48c18204a9474708214f2bab4ea4d2475cb5",
    "units[0].learn.facts[8] (\"fact-usable\")": "c68ef68033a320465b4842f134eb288ad503d649c01ef42e4f21d3c94faddd0a",
    "units[0].learn.facts[9] (\"fact-borrow\")": "43d4fdaffe3ade39dad61f38b8e4ae51e110090527a000b3437ca527ced95171",
    "units[0].learn.facts[10] (\"fact-examples\")": "c1d403b371b965186c9e84e8a73c5e890032838057b8e2b4cd45b57587f8de41",
    "units[0].learn.facts[11] (\"fact-cidr\")": "b0041165a4f437e792acd1514dd6a4621ca45eef033784978ca5a55bcdbbeb09",
    "units[0].learn.facts[12] (\"fact-osi\")": "fa5c37f0e8bf44fbb1bca88831a4d430cd0a64b104c19a13f444199b6ffc6a17",
    "units[0].practice[0].options[0] (question \"usable-26\")": "c636f7ef0a2775d3d4b0d05d1c4ef1fc10598e2a71eaf7e5158eab5089855e33",
    "units[0].practice[0].options[1] (question \"usable-26\")": "8200fce91a8c1e22e155d6cca585c7a3f8c1812175bb7aa7b095a16f6867677c",
    "units[0].practice[0].options[2] (question \"usable-26\")": "ee334de89221f62db178715a586de2b8a3c4ad792e8f9da73e0b292ce55fd28b",
    "units[0].practice[1].options[0] (question \"via-router\")": "98e45cf1fc8bf692f6d7a0c861016cefd93d87bf77d303bf102e2d0d6de311ad",
    "units[0].practice[1].options[1] (question \"via-router\")": "ed986fdab477433bebdc67c9d591e896baacfe804483100b9719c2431b56b01c",
    "units[0].practice[1].options[2] (question \"via-router\")": "062df49b5f5170d69e2d4d91ee27953fb7227c1c3e83259049ed5abe9cb6b969",
    "units[0].practice[2].options[0] (question \"why-30\")": "0a42b4acc0d45912a8b9877bfe745e359dccaaeda5aa7213089774b68247cd58",
    "units[0].practice[2].options[1] (question \"why-30\")": "215988f8f0bc182c2ec6bbd1dc6dccf9ad3a3816c78fc64e7e63b4689346b3dd",
    "units[0].practice[2].options[2] (question \"why-30\")": "252aa2a323fdf51bf108e8480b5584b65113b9b4d15a83bc986a0ba1c7bfa3e1",
    "units[0].practice[0].prompt (question \"usable-26\")": "684c1f37c89c8e6d18ee943733b32a4dd902b46a4379781f8d58f04573e688a2",
    "units[0].practice[1].prompt (question \"via-router\")": "529bd1e1e284aaaa9b26920e60d5a800e5a61192c9dbe16fdc45bab26d1440d1",
    "units[0].practice[2].prompt (question \"why-30\")": "55550df8bd20e584fcefff067a776bbb9e224f20e5a353fd9cac33b2a8ed9fa9"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: subnetting

Checked 2026-11-12 against the claim sheet with hash `17005e579a5d69765401c98577739d117dbeae9eb8924fa0f5ac94775637c5c2`. Every source was fetched from its publisher in this run (RFCs as plain text from rfc-editor.org; the Cisco, Microsoft and Cloudflare pages as HTML with a plain command-line read).

Result: 107 items, 107 ✅, 0 ⚠️, 0 ❌.

## Claims

### units[0].osi — ✅

Badge: layer 3 (network).

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer
  > IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer), the transport layer should include frame sequencing and acknowledgment
- `rfc-1122` §3.2.1.3
  > A host MUST support the subnet extensions to IP [IP:3].  As
  > a result, there will be an address mask of the form:
  > {-1, -1, 0} associated with each of the host's local IP
  > addresses
- `rfc-950` §2.1
  > For example, the Internet address might be interpreted as:
  > <network-number><subnet-number><host-number>
- Note: Two independent vendors (Cloudflare and Microsoft) place IP at the OSI network layer, and RFC 950 and RFC 1122 make subnetting part of how an IP address is read (the subnet field and the address mask are part of the IP address). No allowed source met in this check places subnetting at any other layer.
- Note: Currency. Both vendor pages are live (Cloudflare's last updated 2026-10-12, Microsoft's 2025-01-31). RFC 1122 and RFC 950 are not obsoleted; their updates (RFC 6918 for RFC 950; TCP, MPLS and IPv4 ID updates for RFC 1122) do not touch these passages.

### units[0].steps[0].deep[0] (step "portions", Go deeper) — ✅

Text: "Each of the four numbers is one byte: 8 bits, so it runs from 0 to 255. 192 is 11000000 and 10 is 00001010. Nothing in the address itself says where the network part ends. That is the mask’s job, in the next step."

- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- Note: RFC 791 is the defining standard for the IPv4 address format (its length and its four octets). Its class scheme in the same paragraph is legacy; RFC 4632 replaced it, which is what the claim about the mask reflects.
- `cisco-ip-subnets` §Understand IP Addresses
  > The 32 binary bits are broken into four octets (1 octet = 8 bits).
  > Each octet is converted to decimal and separated by a period (dot).
- `cisco-ip-subnets` §Understand IP Addresses
  > The value in each octet ranges from 0 to 255 decimal, or 00000000 - 11111111 binary.
- `microsoft-tcpip-subnetting` §IP addresses, networks and hosts
  > The example IP address, then, becomes 11000000.10101000.01111011.10000100.
- `microsoft-tcpip-subnetting` §Subnet mask
  > In TCP/IP, the parts of the IP address that are used as the network and host addresses aren't fixed. Unless you have more information, the network and host addresses above can't be determined. This information is supplied in another 32-bit number called a subnet mask.
- `rfc-4632` §3.1
  > In the simplest sense, the change from Class A/B/C network numbers to
  > classless prefixes is to make explicit which bits in a 32-bit IPv4
  > address are interpreted as the network number (or prefix)
- Note: RFC 4632 is the defining document for classless (CIDR) prefixes, under which the split is given separately from the address.
- `microsoft-tcpip-subnetting` §Glossary
  > Octet--An 8-bit number, 4 of which comprise a 32-bit IP address. They have a range of 00000000-11111111 that correspond to the decimal values 0-255.
- Note: 192 as 11000000 is shown by Microsoft's example (192.168.123.132 in binary begins 11000000); 10 as 00001010 is shown by Cisco's mask example (net id 00001010 = 10, under its Network Masks section, not quoted here because that section is not cited for this part). "Byte" is the everyday word for the sources' "octet".
- Note: Currency. RFC 791 and RFC 4632 are not obsoleted (RFC 791's updates concern the ID, TOS and DS fields). The vendor pages are live.

### units[0].steps[1].deep[0] (step "subnet-mask", Go deeper) — ✅

Text: "Writing /24 is called CIDR notation, from Classless Inter-Domain Routing. A mask’s ones always come first and never mix with its zeros, so the prefix length says everything the mask does. Common pairs: /8 is 255.0.0.0, /16 is 255.255.0.0 and /24 is 255.255.255.0."

- `rfc-4632` §3.1
  > In CIDR notation, a prefix is shown as a 4-octet
  > quantity, just like a traditional IPv4 address or network number,
  > followed by the "/" (slash) character, followed by a decimal value
  > between 0 and 32 that describes the number of significant bits.
- `rfc-4632` §3.1
  > For example, the legacy "Class B" network 172.16.0.0, with an implied
  > network mask of 255.255.0.0, is defined as the prefix 172.16.0.0/16,
- `rfc-4632` §3.1
  > the
  > legacy "Class C" network number 192.168.99.0 is defined as the prefix
  > 192.168.99.0/24; the most significant 24 bits are ones and the least
  > significant 8 bits are zeros.
- `rfc-4632` §Abstract
  > This document obsoletes the original Classless Inter-domain Routing
  > (CIDR) spec in RFC 1519
- Note: RFC 4632 is the current defining document for CIDR and its prefix notation.
- `rfc-1812` §2.2.5.1
  > The length of the prefix equals the number of ones in the
  > subnet mask.  This document assumes that all subnet masks are
  > expressible as prefix lengths.
- `rfc-1812` §2.2.5.2
  > Architecturally
  > correct subnet masks are capable of being represented using the
  > prefix length description.  They comprise that subset of all possible
  > bits patterns that have
- `rfc-1812` §2.2.5.2
  > a contiguous string of ones at the more significant end,
  > o a contiguous string of zeros at the less significant end, and
  > o no intervening bits.
- `microsoft-tcpip-subnetting` §Subnet mask
  > Almost all decimal subnet masks convert to binary numbers that are all ones on the left and all zeros on the right.
- `cisco-ip-subnets` §CIDR
  > Length means the number of left-most contiguous mask bits that are set to one. So, network 172.16.0.0 255.255.0.0 can be represented as 172.16.0.0/16.
- `cisco-ip-subnets` §Network Masks
  > 255.0.0.0 = 11111111.00000000.00000000.00000000
- Note: "Always" is looser than Microsoft's "almost all": RFC 950 once allowed masks whose ones were not contiguous, but RFC 1812 treats only contiguous masks as correct and assumes every mask is a prefix length, so the ordinary case is as the claim says. /8 = 255.0.0.0 follows from Cisco's binary form of 255.0.0.0 (8 ones) and its rule that the length counts the left-most ones.
- Note: Currency. RFC 4632 and RFC 1812 are not obsoleted; RFC 1812's updates (RFC 2644 on directed broadcasts, RFC 6633 on Source Quench) do not touch §2.2.5.

### units[0].steps[2].deep[0] (step "network-broadcast", Go deeper) — ✅

Text: "Up to a /30, the number of usable addresses is 2 to the power of the host bits, minus 2. A broadcast reaches every device on the network, which is how DHCP finds a server and ARP finds a neighbour’s hardware address. Routers don’t pass broadcasts on, so a broadcast never leaves its network."

- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- `cisco-host-subnet-quantities` §Subnet Example
  > An exception to this rule is 31-bit prefixes, marked with an asterisk ( * ).
- `rfc-3021` §2.1
  > If a 31-bit subnet mask is assigned to a point-to-point link, it
  > leaves the <Host-number> with only 1 bit.
- `rfc-3021` §2.1
  > In a point-to-point link with
  > a 31-bit subnet mask, the two addresses above MUST be interpreted as
  > host addresses.
- Note: RFC 3021 defines the /31 exception, which is why the formula is limited to /30 and shorter.
- `microsoft-tcpip-subnetting` §Subnetting
  > The 255 address (in binary notation, a host address of all ones) is used to broadcast a message to every host on a network.
- `rfc-1812` §4.2.2.11
  > A datagram with this destination address will be received by
  > every host and router on the connected physical network, but
  > will not be forwarded outside that network.
- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- Note: RFC 2131 is the defining standard for DHCP (IPv4) and its DHCPDISCOVER step.
- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
  > originally determined by the routing mechanism.
- Note: RFC 826 is the defining standard for ARP and its broadcast request.
- `rfc-1812` §5.3.5.1
  > Limited broadcasts MUST NOT be forwarded.
- Note: RFC 1812 is the defining standard for IPv4 router behaviour, including broadcast forwarding.
- `rfc-2644` §3
  > These
  > options MUST default to blocking receipt and blocking forwarding
  > of network-prefix-directed broadcasts.
- Note: RFC 2644 is the current rule for the default treatment of directed broadcasts; it updates RFC 1812.
- Note: Passes as true for a beginner. It leaves out three things: DHCP sends to the all-ones limited broadcast and ARP uses a link-layer broadcast, neither of them the subnet's own broadcast address; a DHCP relay agent, often on the router, can carry a DHCP request to a server on another subnet as a new message (RFC 2131 mentions such relays in the same section); and a router can be set to forward directed broadcasts, which RFC 2644 makes off by default. In the ordinary case a broadcast stays on its own network, as the claim says.
- Note: Currency. None of these RFCs is obsoleted. RFC 2131's updates (client identifiers, long options, the ARP registry) and RFC 826's (address conflict detection, the IANA registry) do not touch these passages; RFC 1812 §5.3.5.2 is updated by RFC 2644, which is cited and agrees.

### units[0].steps[3].deep[0] (step "borrowing-bits", Go deeper) — ✅

Text: "Each borrowed bit doubles the number of subnets and halves their size. At /26 the 6 host bits give 64 addresses, 62 of them usable. The mask’s last number, 192, is 256 minus 64, the block size, and every subnet starts at a multiple of it. The router now needs an address in each subnet: here .1, .65, .129 and .193."

- `cisco-ip-subnets` §Understand Subnetting
  > The more host bits you use for a subnet mask, the more subnets you have available. However, the more subnets available, the less host addresses available per subnet.
- `cisco-ip-subnets` §Understand Subnetting
  > Any device, or gateway, that connects n networks/subnetworks has n distinct IP addresses, one for each network / subnetwork that it interconnects.
- `rfc-1812` §2.2.7
  > Traditionally, each network interface on an IP host or router has its
  > own IP address.
- `rfc-4632` §3.1
  > n.n.n.x/26              64       67108864
- `rfc-4632` §3.1
  > n.n.n.x/25             128       33554432
- Note: RFC 4632's table, from the defining CIDR document, shows each extra prefix bit halving the block (128 at /25, 64 at /26).
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 1 255.255.255.128 2 126 /25
  > 2 255.255.255.192 4 62 /26
- `microsoft-tcpip-subnetting` §Subnetting
  > The first two digits of the last octet become network addresses, so you get the additional networks 00000000 (0), 01000000 (64), 10000000 (128) and 11000000 (192).
- `microsoft-tcpip-subnetting` §Subnetting
  > In these four networks, the last six binary digits can be used for host addresses.
- Note: 192 = 256 − 64 is arithmetic on the quoted values, and Microsoft's four network starts (0, 64, 128, 192) are the multiples of 64. Microsoft's ranges of valid hosts for those four networks begin at .1, .65, .129 and .193, so the router addresses given are valid ones. Picking the first usable address for the router is a common choice, not a rule, and the claim gives them as this example's ("here").
- Note: Currency. RFC 1812 and RFC 4632 are not obsoleted; the vendor pages are live.

### units[0].steps[4].deep[0] (step "local-remote", Go deeper) — ✅

Text: "The comparison is a bitwise AND: each address with the laptop’s own mask. If the results match, the laptop finds the printer’s hardware address with ARP and sends to it directly. If not, it sends to its default gateway, 192.168.1.1, and the router passes it on. At /24 the same two addresses would be on one network and talk directly."

- `rfc-950` §2.2
  > IF bitwise_and(dg.ip_dest, my_ip_mask)
  > = bitwise_and(my_ip_addr, my_ip_mask)
  > THEN
  > send_dg_locally(dg, dg.ip_dest)
- Note: RFC 950 is the defining standard for the subnet procedure, including this local-or-gateway test.
- `cisco-ip-subnets` §Sample Exercise 1
  > Look at the address bits that have a corresponding mask bit set to one, and set all the other address bits to zero (this is equivalent to when you perform a logical AND between the mask and address).
- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the
  > address mask match the IP source address bits extracted
  > by the same mask, then the destination is on the
  > corresponding connected network, and the datagram is to
  > be transmitted directly to the destination host.
- Note: RFC 1122 is the defining standard for a host's local/remote decision.
- `rfc-826` §Packet Generation
  > In the case of the
  > 10Mbit Ethernet, address resolution is needed and some lower
  > layer (probably the hardware driver) must consult the Address
  > Resolution module
- `rfc-1122` §3.3.1.2
  > When there is no route cache entry for the destination host
  > address (and the destination is not on the connected
- `rfc-1122` §3.3.1.2
  > network), the IP layer MUST pick a gateway from its list of
  > "default" gateways.
- `microsoft-tcpip-subnetting` §Default gateways
  > If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties. It's then the responsibility of the router to forward the packet to the correct subnet.
- `microsoft-tcpip-subnetting` §Subnetting
  > If you used the default Class C subnet mask of 255.255.255.0, both addresses are on the 192.168.123.0 network. However, if you use the subnet mask of 255.255.255.192, they are on different networks
- Note: Passes as true for a beginner. It leaves out the ARP cache (a known hardware address is reused without asking) and links that do not use ARP. 192.168.1.1 is this lesson's example gateway (a private address).
- Note: Currency. RFC 950, RFC 1122 and RFC 826 are not obsoleted; their updates do not touch these sections.

### units[0].steps[5].deep[0] (step "point-to-point", Go deeper) — ✅

Text: "The link’s network address is 203.0.113.4 and its broadcast address is 203.0.113.7. Routers may instead use a /31 for links like this: RFC 3021 lets both of its 2 addresses be used, with no network or broadcast address. 203.0.113.0/24 is set aside for documentation, so these addresses are examples."

- `microsoft-tcpip-subnetting` §Glossary
  > Network address--An IP address with a host portion that is all zeros.
- `microsoft-tcpip-subnetting` §Glossary
  > Broadcast address--An IP address with a host portion that is all ones.
- `rfc-3021` §2.1
  > In a point-to-point link with
  > a 31-bit subnet mask, the two addresses above MUST be interpreted as
  > host addresses.
- Note: RFC 3021 is the defining standard for /31 prefixes on point-to-point links.
- `cisco-ip-subnets` §31-bit Subnets
  > A 30-bit subnet mask allows for four IPv4 addresses: two host addresses, one all-zeros network, and one all-ones broadcast address.
- `cisco-ip-subnets` §31-bit Subnets
  > A 31-bit subnet mask allows for exactly two host addresses, and eliminates the broadcast and all-zeros addresses
- `rfc-5737` §3
  > The blocks 192.0.2.0/24 (TEST-NET-1), 198.51.100.0/24 (TEST-NET-2),
  > and 203.0.113.0/24 (TEST-NET-3) are provided for use in
  > documentation.
- Note: RFC 5737 is the defining document for the IPv4 documentation blocks. 203.0.113.4/30: host bits 00 give .4 and 11 give .7, by the glossary rules quoted.
- Note: Currency. RFC 3021 and RFC 5737 are not obsoleted or updated.

### units[0].learn.lead[0] ("lead-1") — ✅

Text: "One office, one block of 256 addresses, cut into four smaller networks, one for each team. Here is what each part was, and what it’s called."

- `rfc-4632` §3.1
  > n.n.n.0/24             256       16777216    legacy "Class C"
- Note: RFC 4632 defines the prefix sizes; a /24 (the lesson's block) holds 256 addresses.
- `microsoft-tcpip-subnetting` §Subnetting
  > In this case, you divide your network into four subnets by using a subnet mask that makes the network address larger and the possible range of host addresses smaller.
- Note: "one for each team" is the lesson's scene.
- Note: Currency. RFC 4632 is the current CIDR document; the Microsoft page is live (updated 2026-02-12).

### units[0].learn.lead[1] ("lead-2") — ✅

Text: "Before it sends, a device lays its mask over its own address and the other one, a bitwise AND, and compares the network parts. If they match, the device finds the other’s hardware address with ARP and sends to it directly: that is local delivery. If not, it sends to its default gateway."

- `rfc-1122` §3.3.1.1
  > If the IP destination address bits extracted by the
  > address mask match the IP source address bits extracted
  > by the same mask, then the destination is on the
  > corresponding connected network, and the datagram is to
  > be transmitted directly to the destination host.
- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- Note: RFC 1122 is the defining standard for a host's local/remote decision.
- `rfc-950` §2.2
  > IF bitwise_and(dg.ip_dest, my_ip_mask)
  > = bitwise_and(my_ip_addr, my_ip_mask)
- Note: RFC 950 defines the subnet procedure that uses this bitwise AND.
- `rfc-826` §Packet Generation
  > The Address
  > Resolution module then sets the ar$hrd field to
- `rfc-826` §Packet Generation
  > It then causes
  > this packet to be broadcast to all stations on the Ethernet cable
- Note: RFC 826 is the defining standard for ARP.
- `microsoft-tcpip-subnetting` §Default gateways
  > When a host attempts to communicate with another device using TCP/IP, it performs a comparison process using the defined subnet mask and the destination IP address versus the subnet mask and its own IP address.
- `microsoft-tcpip-subnetting` §Default gateways
  > then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: Passes as true for a beginner. It leaves out the ARP cache, broadcast and multicast destinations (RFC 1122 handles them separately), and routes other than the default.
- Note: Currency. RFC 1122, RFC 950 and RFC 826 are not obsoleted; their updates do not touch these sections.

### units[0].learn.terms[0] ("term-network") — ✅

Text: "Network portion: The part of an address that says which network, the same for every device on it"

- `microsoft-tcpip-subnetting` §IP addresses, networks and hosts
  > For this process to work, an IP address has two parts. The first part of an IP address is used as a network address, the last part as a host address.
- `cisco-host-subnet-quantities` §Background Information
  > The network address is used to identify the network and is common to all the devices attached to the network.
- Note: Currency. Both vendor pages are live (Cisco 13790 updated 2023-05-17).

### units[0].learn.terms[1] ("term-host") — ✅

Text: "Host portion: The part that says which device, or host: any device with an address"

- `microsoft-tcpip-subnetting` §IP addresses, networks and hosts
  > An IP address is a 32-bit number. It uniquely identifies a host (computer or other device, such as a printer or router) on a TCP/IP network.
- `cisco-host-subnet-quantities` §Background Information
  > The host (or node) address is used to identify a particular device attached to the network.
- `microsoft-tcpip-subnetting` §Glossary
  > Host--A computer or other device on a TCP/IP network.
- Note: Microsoft counts a router as a host, as the claim does; the RFCs use "host" more narrowly, which a beginner does not need here.
- Note: Currency. The vendor pages are live.

### units[0].learn.terms[2] ("term-mask") — ✅

Text: "Subnet mask: The card laid over the address: a 1 for each network bit and a 0 for each host bit"

- `cisco-ip-subnets` §Network Masks
  > Any address bits which have corresponding mask bits set to 1 represent the network ID. Any address bits that have corresponding mask bits set to 0 represent the node ID.
- `rfc-950` §2.2
  > To support subnets, it is necessary to store one more 32-bit
  > quantity, called my_ip_mask.  This is a bit-mask with bits set in
  > the fields corresponding to the IP network number, and additional
  > bits set corresponding to the subnet number field.
- Note: RFC 950 is the defining standard for the subnet (address) mask.
- Note: Currency. RFC 950 is not obsoleted; its one update, RFC 6918, deprecates ICMP Address Mask messages and leaves the mask itself unchanged. The Cisco page is live (updated 2023-07-07).

### units[0].learn.terms[3] ("term-prefix") — ✅

Text: "Prefix length: Counting the mask’s ones and writing them after a slash"

- `rfc-1812` §2.2.5.1
  > The length of the prefix equals the number of ones in the
  > subnet mask.
- `rfc-4632` §3.1
  > followed by the "/" (slash) character, followed by a decimal value
  > between 0 and 32 that describes the number of significant bits.
- Note: RFC 4632 defines CIDR prefix notation.
- Note: Currency. Neither RFC is obsoleted.

### units[0].learn.terms[4] ("term-netaddr") — ✅

Text: "Network address: The network’s own name: every host bit 0"

- `microsoft-tcpip-subnetting` §Glossary
  > Network address--An IP address with a host portion that is all zeros.
- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself
- Note: "The network's own name" is the lesson's everyday wording for the source's "network number itself".
- Note: Currency. Both vendor pages are live.

### units[0].learn.terms[5] ("term-broadcast") — ✅

Text: "Broadcast address: The address every device on the network hears: every host bit 1"

- `microsoft-tcpip-subnetting` §Glossary
  > Broadcast address--An IP address with a host portion that is all ones.
- `rfc-1812` §5.3.5
  > A network-prefix-directed broadcast is composed of the network prefix
  > of the IP address with a local part of all-ones
- `microsoft-tcpip-subnetting` §Subnetting
  > The 255 address (in binary notation, a host address of all ones) is used to broadcast a message to every host on a network.
- Note: Currency. RFC 1812 §5.3.5 is unchanged by RFC 2644, which changes only how routers treat directed broadcasts from elsewhere; the Microsoft page is live.

### units[0].learn.terms[6] ("term-subnet") — ✅

Text: "Subnet: A smaller network cut out of a bigger one"

- `microsoft-tcpip-subnetting` §Glossary
  > Subnet or Subnetwork--A smaller network created by dividing a larger network into equal parts.
- `cisco-host-subnet-quantities` §Subnetting and Tables
  > As a concept, subnetting divides the network into smaller portions called subnets.
- Note: Currency. Both vendor pages are live.

### units[0].learn.terms[7] ("term-borrow") — ✅

Text: "Borrowing bits: Turning host bits into network bits to make smaller networks"

- `cisco-host-subnet-quantities` §Subnetting and Tables
  > This is done with borrowed bits from the host portion of the IP address
- `microsoft-tcpip-subnetting` §Subnetting
  > In other words, you are 'borrowing' some of the bits used for the host address, and using them for the network portion of the address.
- Note: Currency. Both vendor pages are live.

### units[0].learn.terms[8] ("term-gateway") — ✅

Text: "Default gateway: The router a device sends to when the other address is on another subnet"

- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a
  > particular destination, the host chooses a "default"
  > gateway and sends the datagram to it.
- Note: RFC 1122 is the defining standard for a host's gateway selection.
- `microsoft-tcpip-subnetting` §Default gateways
  > In TCP/IP terms, a router that is specified on a host, which links the host's subnet to other networks, is called a default gateway.
- Note: Passes as true for a beginner. It leaves out more specific routes (static routes, redirects) that can send some traffic to another router.
- Note: Currency. RFC 1122 is not obsoleted; the Microsoft page is live.

### units[0].learn.terms[9] ("term-p2p") — ✅

Text: "Point-to-point /30: A tiny subnet with exactly two usable addresses, one for each end of a link, such as between two routers"

- `rfc-3021` §1
  > In current practice, numbered Internet subnets do not use longer than
  > a 30-bit subnet mask (in most cases), which requires four addresses
  > per link - two host addresses, one all-zeros network
- `rfc-3021` §1
  > One option, which is used today on some parts of
  > the Internet, is to simply not number point-to-point links between
  > routers.
- `cisco-ip-subnets` §31-bit Subnets
  > A 30-bit subnet mask allows for four IPv4 addresses: two host addresses, one all-zeros network, and one all-ones broadcast address. A point-to-point link can only have two host addresses.
- Note: /31 links (RFC 3021) are now common too; the lesson teaches them in its Go deeper, so presenting /30 as the point-to-point subnet is not a superseded practice.
- Note: Currency. RFC 3021 is not obsoleted; the Cisco page is live.

### units[0].learn.pattern ("pattern") — ✅

Text: names Subnet Mask, Network Address, Broadcast Address, Usable Addresses; "Any address, any prefix up to /30: work these four out in this order. Steps 2 and 3 did it for a /24, step 4 for a /26 and step 6 for a /30."

- `microsoft-tcpip-subnetting` §Subnet mask
  > The first 24 bits (the number of ones in the subnet mask) are identified as the network address. The last 8 bits (the number of remaining zeros in the subnet mask) are identified as the host address.
- `microsoft-tcpip-subnetting` §Glossary
  > Network address--An IP address with a host portion that is all zeros.
- `microsoft-tcpip-subnetting` §Glossary
  > Broadcast address--An IP address with a host portion that is all ones.
- `microsoft-tcpip-subnetting` §Subnetting
  > Just remember that the first and last address in any network or subnet can't be assigned to any individual host.
- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- Note: The order follows from the sources: the mask gives the host bits, which give the network and broadcast addresses, which give the usable ones. The step references are right: step 2 works out the /24 mask, step 3 its network, broadcast and usable addresses, step 4 all four for /26, and step 6 all four for /30.
- Note: Currency. Both vendor pages are live.

### units[0].learn.why[0] ("why-1") — ✅

Text: "Subnets keep groups apart. A guest’s phone can’t reach the servers unless the router lets it, and one team’s broadcasts don’t disturb the others."

- `cisco-ip-subnets` §Understand Subnetting
  > Each data link on this network would then have a unique network/subnetwork ID.
- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- Note: RFC 1122 defines that traffic to another subnet must go through a gateway.
- `rfc-1812` §5.3.9
  > As a means of providing security and/or limiting traffic through
  > portions of a network a router SHOULD provide the ability to
  > selectively forward (or filter) packets.
- Note: RFC 1812 defines this router filtering requirement.
- `rfc-1812` §5.3.5.1
  > Limited broadcasts MUST NOT be forwarded.
- `rfc-2644` §3
  > These
  > options MUST default to blocking receipt and blocking forwarding
  > of network-prefix-directed broadcasts.
- Note: RFC 2644 is the current default for directed broadcasts.
- Note: Passes as true for a beginner. Every packet between subnets has to pass the router, and the router can filter (RFC 1812 §5.3.9); the claim puts the control there, which is right. It leaves out that a router passes traffic between its subnets unless it is set up to filter it, so separating the guests' subnet does not by itself block them. The lesson's own Practice feedback ("Keeping guests out is the router's job") points the same way.
- Note: Currency. RFC 1122 and RFC 1812 are not obsoleted; RFC 2644 is a Best Current Practice and is not obsoleted; the Cisco page is live.

### units[0].learn.why[1] ("why-2") — ✅

Text: "They also stop addresses going to waste: a link between two routers needs 2 addresses, not 254."

- `cisco-ip-subnets` §VLSM
  > You need this in some cases, but, in most cases when there is the same subnet mask for all subnets, it wastes address space.
- `cisco-ip-subnets` §VLSM
  > Variable Length Subnet Masks (VLSM) allow you to use different masks for each subnet, thereby they use address space efficiently.
- `rfc-3021` §1
  > This is unfortunate for point-to-point links, since
  > they can only possibly have two identifying endpoints
- `rfc-4632` §2
  > Class C, with a
  > maximum of 254 host addresses, is too small
- `cisco-ip-subnets` §31-bit Subnets
  > A point-to-point link can only have two host addresses.
- `cisco-host-subnet-quantities` §Class B Host/Subnet Table
  > 14 255.255.255.252 16384 2 /30
- Note: Currency. RFC 3021 and RFC 4632 are not obsoleted; the Cisco pages are live.

### units[0].learn.deep[0] ("deep-block", Learn's Go deeper) — ✅

Text: "From /24 on, each prefix has a block size: 256 minus the mask’s last number below 255. Subnets start at multiples of it. To find which subnet an address is in, round its last number down to a multiple of the block size: at /26, .70 rounds down to .64. The broadcast address is the next subnet’s start, minus 1."

- `rfc-4632` §3.1
  > prefixes may be defined to describe any power of two-sized block of
  > between one and 2^32 end system addresses.
- `rfc-4632` §3.1
  > n.n.n.x/26              64       67108864
- Note: RFC 4632 defines prefix block sizes (its table's addresses per block).
- `microsoft-tcpip-subnetting` §Subnetting
  > Using a subnet mask of 255.255.255.192, your 192.168.123.0 network then becomes the four networks 192.168.123.0, 192.168.123.64, 192.168.123.128 and 192.168.123.192.
- `microsoft-tcpip-subnetting` §Subnetting
  > 192.168.123.71 is on the 192.168.123.64 network, 192.168.123.133 is on the 192.168.123.128 network.
- `microsoft-tcpip-subnetting` §Subnetting
  > so you can't use addresses with the last octet of 0, 63, 64, 127, 128, 191, 192, or 255.
- Note: The shortcut is arithmetic on facts both sources give: 256 − 192 = 64, the /26 block; the networks start at multiples of 64; Microsoft places .71 in the .64 network as the rule does for .70; and each subnet's last address (63, 127, 191, 255) is one below the next start.
- Note: Currency. RFC 4632 is not obsoleted; the Microsoft page is live.

### units[0].learn.facts[0] ("fact-25") — ✅

Text: "/25: 255.255.255.128: 128 addresses, 126 usable"

- `rfc-4632` §3.1
  > n.n.n.x/25             128       33554432
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 1 255.255.255.128 2 126 /25
- Note: RFC 4632 defines the prefix sizes; Cisco's table gives the mask and the usable hosts.
- Note: Currency. RFC 4632 is not obsoleted; the Cisco page is live.

### units[0].learn.facts[1] ("fact-26") — ✅

Text: "/26: 255.255.255.192: 64 addresses, 62 usable"

- `rfc-4632` §3.1
  > n.n.n.x/26              64       67108864
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 2 255.255.255.192 4 62 /26
- Note: RFC 4632 defines the prefix sizes.
- Note: Currency. As for fact-25.

### units[0].learn.facts[2] ("fact-27") — ✅

Text: "/27: 255.255.255.224: 32 addresses, 30 usable"

- `rfc-4632` §3.1
  > n.n.n.x/27              32      134217728
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 3 255.255.255.224 8 30 /27
- Note: RFC 4632 defines the prefix sizes.
- Note: Currency. As for fact-25.

### units[0].learn.facts[3] ("fact-28") — ✅

Text: "/28: 255.255.255.240: 16 addresses, 14 usable"

- `rfc-4632` §3.1
  > n.n.n.x/28              16      268435456
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 4 255.255.255.240 16 14 /28
- Note: RFC 4632 defines the prefix sizes.
- Note: Currency. As for fact-25.

### units[0].learn.facts[4] ("fact-29") — ✅

Text: "/29: 255.255.255.248: 8 addresses, 6 usable"

- `rfc-4632` §3.1
  > n.n.n.x/29               8      536870912
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 5 255.255.255.248 32 6 /29
- Note: RFC 4632 defines the prefix sizes.
- Note: Currency. As for fact-25.

### units[0].learn.facts[5] ("fact-30") — ✅

Text: "/30: 255.255.255.252: 4 addresses, 2 usable"

- `rfc-4632` §3.1
  > n.n.n.x/30               4     1073741824
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 6 255.255.255.252 64 2 /30
- Note: RFC 4632 defines the prefix sizes.
- Note: Currency. As for fact-25.

### units[0].learn.facts[6] ("fact-defined") — ✅

Text: "Defined in: RFC 950 (subnets), RFC 4632 (CIDR), RFC 3021 (/31 links)"

- `rfc-950` §Overview
  > This memo specifies procedures for the use of subnets.
- Note: RFC 950, titled Internet Standard Subnetting Procedure, defines subnets.
- `rfc-4632` §Abstract
  > This document obsoletes the original Classless Inter-domain Routing
  > (CIDR) spec in RFC 1519
- Note: RFC 4632 is the current CIDR document; it obsoletes the original, RFC 1519.
- `rfc-3021` §Abstract
  > by allowing the use of 31-bit subnet masks
  > in a very limited way.
- Note: RFC 3021 is the standard for 31-bit prefixes on point-to-point links.
- Note: Currency. None of the three is obsoleted; RFC 950's update (RFC 6918) concerns only ICMP Address Mask messages.

### units[0].learn.facts[7] ("fact-bits") — ✅

Text: "An address: 32 bits: four numbers of 8 bits, each 0 to 255"

- `rfc-791` §2.3
  > Addresses are fixed length of four octets (32 bits).
- Note: RFC 791 defines the IPv4 address format.
- `cisco-ip-subnets` §Understand IP Addresses
  > The value in each octet ranges from 0 to 255 decimal, or 00000000 - 11111111 binary.
- `microsoft-tcpip-subnetting` §Glossary
  > Octet--An 8-bit number, 4 of which comprise a 32-bit IP address. They have a range of 00000000-11111111 that correspond to the decimal values 0-255.
- Note: Currency. RFC 791 is not obsoleted; the vendor pages are live.

### units[0].learn.facts[8] ("fact-usable") — ✅

Text: "Usable addresses: 2 to the power of the host bits, minus 2, up to a /30: the network and broadcast addresses are kept back"

- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- `cisco-host-subnet-quantities` §Subnet Example
  > An exception to this rule is 31-bit prefixes, marked with an asterisk ( * ).
- `rfc-1812` §4.2.2.11
  > IP addresses are not permitted to have the value 0 or -1 for the
  > <Host-number> or <Network-prefix> fields except in the special cases
  > listed above.
- `rfc-4632` §2
  > Class C (MSB '110'), and 2097152 possible networks each and 254 end
  > systems (256 bit combinations minus the reserved all-zeros
- Note: "Up to a /30" leaves out /31 (RFC 3021) and /32, as the Cisco exception does.
- Note: Currency. RFC 1812 §4.2.2.11 (d) is updated by RFC 2644 only in how routers receive directed broadcasts; the reserved values stand. RFC 4632 is not obsoleted.

### units[0].learn.facts[9] ("fact-borrow") — ✅

Text: "Each borrowed bit: doubles the subnets and halves their size: 2 borrowed bits can be 00, 01, 10 or 11, which makes 4 subnets"

- `cisco-ip-subnets` §Understand Subnetting
  > The more host bits you use for a subnet mask, the more subnets you have available. However, the more subnets available, the less host addresses available per subnet.
- `cisco-host-subnet-quantities` §Subnet Example
  > then with two bits you have four (2^2) combinations, 00, 01, 10, and 11. Each of these can represent a subnet.
- `rfc-4632` §3.1
  > n.n.n.x/25             128       33554432
- Note: RFC 4632's table (the defining CIDR document) halves the block with each prefix bit; the /25 row is quoted here and the /26 row (64) under fact-26.
- `microsoft-tcpip-subnetting` §Subnetting
  > The subnet mask 255.255.255.192 gives you four networks of 62 hosts each.
- Note: Currency. RFC 4632 is not obsoleted; the vendor pages are live.

### units[0].learn.facts[10] ("fact-examples") — ✅

Text: "Example addresses: 192.168.x.x is private; 203.0.113.x is for documentation"

- `rfc-1918` §3
  > The Internet Assigned Numbers Authority (IANA) has reserved the
  > following three blocks of the IP address space for private internets:
- `rfc-1918` §3
  > 192.168.0.0     -   192.168.255.255 (192.168/16 prefix)
- Note: RFC 1918 defines the private IPv4 blocks.
- `rfc-5737` §3
  > and 203.0.113.0/24 (TEST-NET-3) are provided for use in
  > documentation.
- Note: RFC 5737 defines the documentation blocks.
- Note: Currency. RFC 1918 is not obsoleted (its update, RFC 6761, concerns special-use domain names); RFC 5737 is not obsoleted or updated.

### units[0].learn.facts[11] ("fact-cidr") — ✅

Text: "Written as: an address, a slash and the prefix length: 192.168.1.0/24 has the mask 255.255.255.0, 24 ones then 8 zeros"

- `rfc-4632` §3.1
  > followed by the "/" (slash) character, followed by a decimal value
  > between 0 and 32 that describes the number of significant bits.
- `rfc-4632` §3.1
  > 192.168.99.0/24; the most significant 24 bits are ones and the least
  > significant 8 bits are zeros.
- Note: RFC 4632 defines CIDR notation.
- `cisco-ip-subnets` §CIDR
  > In CIDR , an IP network is represented by a prefix, which is an IP address and some indication of the length of the mask.
- `microsoft-tcpip-subnetting` §Subnet mask
  > So, the subnet mask is 11111111.11111111.11111111.00000000.
- Note: Currency. RFC 4632 is not obsoleted; the vendor pages are live.

### units[0].learn.facts[12] ("fact-osi") — ✅

Text: "OSI layer: 3, network: subnetting is part of how IP addresses work"

- `cloudflare-network-layers` §Network Layers
  > 3 Network layer
  > IP, GRE, any packet/protocol
- `microsoft-osi` §Transport layer
  > if the network layer is unreliable or supports datagrams (as with TCP/IP's IP layer or NWLink's IPX layer)
- `rfc-1122` §3.2.1.3
  > A host MUST support the subnet extensions to IP [IP:3].
- `rfc-950` §2.1
  > For example, the Internet address might be interpreted as:
  > <network-number><subnet-number><host-number>
- Note: As for the OSI badge: two vendors put IP at layer 3, and the RFCs make subnetting part of the IP address.
- Note: Currency. As for units[0].osi.

### units[0].practice[0].options[0] (question "usable-26") — ✅

Text: "64" (wrong); feedback "Not quite. 64 is how many addresses a /26 has. Two of them are kept back, the network and broadcast addresses, so 62 are left for devices."

- `rfc-4632` §3.1
  > n.n.n.x/26              64       67108864
- Note: RFC 4632 defines the prefix sizes.
- `rfc-1812` §4.2.2.11
  > IP addresses are not permitted to have the value 0 or -1 for the
  > <Host-number> or <Network-prefix> fields except in the special cases
  > listed above.
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 2 255.255.255.192 4 62 /26
- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- Note: The option is rightly marked wrong.
- Note: Currency. As for fact-26.

### units[0].practice[0].options[1] (question "usable-26") — ✅

Text: "62" (right); feedback "Right. A /26 leaves 6 host bits: 64 addresses. Take away the network and broadcast addresses and 62 are left."

- `rfc-4632` §3.1
  > n.n.n.x/26              64       67108864
- Note: RFC 4632 defines the prefix sizes.
- `rfc-1812` §4.2.2.11
  > IP addresses are not permitted to have the value 0 or -1 for the
  > <Host-number> or <Network-prefix> fields except in the special cases
  > listed above.
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 2 255.255.255.192 4 62 /26
- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- Note: The option is rightly marked right.
- Note: Currency. As for fact-26.

### units[0].practice[0].options[2] (question "usable-26") — ✅

Text: "30" (wrong); feedback "Not quite. 30 is a /27. A /26 has 6 host bits: 64 addresses, minus 2, is 62."

- `rfc-4632` §3.1
  > n.n.n.x/27              32      134217728
- Note: RFC 4632 defines the prefix sizes.
- `rfc-1812` §4.2.2.11
  > IP addresses are not permitted to have the value 0 or -1 for the
  > <Host-number> or <Network-prefix> fields except in the special cases
  > listed above.
- `cisco-host-subnet-quantities` §Class C Host/Subnet Table
  > 3 255.255.255.224 8 30 /27
- `cisco-host-subnet-quantities` §Subnet Example
  > A host portion with all zeros is network number itself, and a host portion with all ones is reserved for broadcast on that subnet
- Note: The option is rightly marked wrong.
- Note: Currency. As for fact-26.

### units[0].practice[1].options[0] (question "via-router") — ✅

Text: "To the router, because the network parts differ." (right); feedback "Right. Under a /26 mask the borrowed bits differ, 00 against 01, so they’re on different subnets. The laptop hands the message to its default gateway."

- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- Note: RFC 1122 defines the local/remote decision.
- `rfc-1122` §3.3.1.2
  > If the route cache contains no information for a
  > particular destination, the host chooses a "default"
  > gateway and sends the datagram to it.
- `microsoft-tcpip-subnetting` §Subnetting
  > However, if you use the subnet mask of 255.255.255.192, they are on different networks
- `microsoft-tcpip-subnetting` §Default gateways
  > then the computer will forward the packet to the default gateway defined in its TCP/IP properties.
- Note: .10 is 00001010 and .70 is 01000110, so their first two host bits are 00 and 01. The option is rightly marked right.
- Note: Currency. RFC 1122 is not obsoleted; the Microsoft page is live.

### units[0].practice[1].options[1] (question "via-router") — ✅

Text: "Straight to 192.168.1.70, because both start 192.168.1." (wrong); feedback "Not quite. That would be true at /24. At /26 the network part takes 2 more bits, and those differ, so the message goes via the router."

- `microsoft-tcpip-subnetting` §Subnetting
  > If you used the default Class C subnet mask of 255.255.255.0, both addresses are on the 192.168.123.0 network. However, if you use the subnet mask of 255.255.255.192, they are on different networks
- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- Note: RFC 1122 defines the local/remote decision. The option is rightly marked wrong.
- Note: Currency. As above.

### units[0].practice[1].options[2] (question "via-router") — ✅

Text: "To every device, as a broadcast." (wrong); feedback "Not quite. A broadcast is for when you don’t know who to ask. The laptop knows the address. It only checks whether to send directly or via the router."

- `rfc-919` §3
  > Broadcasts are useful when a host needs to find information without
  > knowing exactly what other host can supply it
- Note: RFC 919 defines the rules for broadcasting IP datagrams.
- `rfc-1122` §3.3.1.1
  > To decide if the destination is on a connected network, the
  > following algorithm MUST be used
- Note: RFC 1122 defines the local/remote decision. Passes as true for a beginner. RFC 919 also names a second use, telling many hosts something at once, which the feedback leaves out; neither use applies to a message for one known address. The option is rightly marked wrong.
- Note: Currency. RFC 919 and RFC 1122 are not obsoleted.

### units[0].practice[2].options[0] (question "why-30") — ✅

Text: "A smaller subnet makes the link faster." (wrong); feedback "Not quite. A subnet’s size only sets how many addresses it has. The link uses a /30 because it needs exactly 2 addresses."

- `rfc-4632` §3.1
  > The following table provides a convenient shortcut to all the CIDR
  > prefix sizes, showing the number of addresses possible in each prefix
- Note: RFC 4632 defines what a prefix length sets: the size of the address block.
- `rfc-3021` §1
  > This is unfortunate for point-to-point links, since
  > they can only possibly have two identifying endpoints
- `cisco-ip-subnets` §31-bit Subnets
  > A point-to-point link can only have two host addresses.
- Note: Passes as true for a beginner. No source ties prefix length to link speed. The "only" is about the address count: elsewhere the lesson teaches that splitting a network also keeps broadcasts apart, which is not about link speed. The option is rightly marked wrong.
- Note: Currency. RFC 4632 and RFC 3021 are not obsoleted; the Cisco page is live.

### units[0].practice[2].options[1] (question "why-30") — ✅

Text: "It keeps the guest Wi-Fi off the link." (wrong); feedback "Not quite. Keeping guests out is the router’s job. The /30 is about size: the link has two ends, so it needs exactly 2 addresses."

- `rfc-1812` §5.3.9
  > As a means of providing security and/or limiting traffic through
  > portions of a network a router SHOULD provide the ability to
  > selectively forward (or filter) packets.
- Note: RFC 1812 defines this router filtering requirement.
- `rfc-1122` §3.3.1.1
  > If not, then the destination is accessible only through
  > a gateway.
- `rfc-3021` §1
  > which requires four addresses
  > per link - two host addresses, one all-zeros network
- `cisco-ip-subnets` §31-bit Subnets
  > A 30-bit subnet mask allows for four IPv4 addresses: two host addresses, one all-zeros network, and one all-ones broadcast address. A point-to-point link can only have two host addresses.
- Note: The option is rightly marked wrong.
- Note: Currency. RFC 1812, RFC 1122 and RFC 3021 are not obsoleted; the Cisco page is live.

### units[0].practice[2].options[2] (question "why-30") — ✅

Text: "It has exactly 2 usable addresses, one for each end." (right); feedback "Yes. A /30 has 4 addresses: the network, the broadcast, and 2 for devices. A link has two ends, so neither usable address goes to waste."

- `rfc-3021` §1
  > In current practice, numbered Internet subnets do not use longer than
  > a 30-bit subnet mask (in most cases), which requires four addresses
  > per link - two host addresses, one all-zeros network
- `cisco-ip-subnets` §31-bit Subnets
  > A 30-bit subnet mask allows for four IPv4 addresses: two host addresses, one all-zeros network, and one all-ones broadcast address. A point-to-point link can only have two host addresses.
- Note: The option is rightly marked right.
- Note: Currency. RFC 3021 is not obsoleted; the Cisco page is live.

## Traced, example and unbacked items

All traced items were compared with the Learn parts their `Traces:` line names.

- title — ✅
- units[0].name — ✅
- backing (the lesson's subtitle and summary) — ✅
- units[0].backing (the unit's full name and purpose) — ✅
- units[0].scene.backing (the scene) — ✅
- units[0].overview.hookBacking (the Overview hook) — ✅ (the team names Sales and Design are scene labels, not claims; the goal of keeping a guest's phone off the servers traces to why-1)
- units[0].overview.backing (the Overview description) — ✅
- units[0].overview.facts[0] (Overview fact "Written as") — ✅
- units[0].overview.facts[1] (Overview fact "Mask") — ✅
- units[0].overview.facts[2] (Overview fact "Usable addresses") — ✅
- units[0].overview.facts[3] (Overview fact "Addresses here") — ✅
- units[0].overview.facts[4] (Overview fact "Defined in") — ✅
- units[0].steps[0] (step "portions") — ✅ (the street analogy maps network then device; it does not mislead)
- units[0].steps[0].facts[0] (step "portions", fact "Address") — ✅ (example: an RFC 1918 private address)
- units[0].steps[0].facts[1] (step "portions", fact "Network portion") — ✅
- units[0].steps[0].facts[2] (step "portions", fact "Host portion") — ✅
- units[0].steps[0].facts[3] (step "portions", fact "Whole address") — ✅
- units[0].steps[0].events[0] (event "address") — ✅
- units[0].steps[0].events[1] (event "network-part") — ✅
- units[0].steps[0].events[2] (event "host-part") — ✅
- units[0].steps[1] (step "subnet-mask") — ✅ (the card with holes matches term-mask)
- units[0].steps[1].facts[0] (step "subnet-mask", fact "Mask") — ✅
- units[0].steps[1].facts[1] (step "subnet-mask", fact "In bits") — ✅
- units[0].steps[1].facts[2] (step "subnet-mask", fact "Prefix length") — ✅
- units[0].steps[1].facts[3] (step "subnet-mask", fact "Written") — ✅
- units[0].steps[1].events[0] (event "mask-24") — ✅
- units[0].steps[1].events[1] (event "prefix-24") — ✅
- units[0].steps[2] (step "network-broadcast") — ✅
- units[0].steps[2].facts[0] (step "network-broadcast", fact "Network address") — ✅
- units[0].steps[2].facts[1] (step "network-broadcast", fact "Broadcast address") — ✅
- units[0].steps[2].facts[2] (step "network-broadcast", fact "Usable addresses") — ✅
- units[0].steps[2].facts[3] (step "network-broadcast", fact "Usable range") — ✅
- units[0].steps[2].events[0] (event "network-24") — ✅
- units[0].steps[2].events[1] (event "broadcast-24") — ✅
- units[0].steps[2].events[2] (event "usable-24") — ✅
- units[0].steps[3] (step "borrowing-bits") — ✅ (the starts .0, .64, .128, .192 and .70 in the .64 subnet follow deep-block and fact-borrow; "only Design hears" follows why-1)
- units[0].steps[3].facts[0] (step "borrowing-bits", fact "Mask") — ✅
- units[0].steps[3].facts[1] (step "borrowing-bits", fact "Cut from one /24") — ✅
- units[0].steps[3].facts[2] (step "borrowing-bits", fact "Design’s subnet") — ✅
- units[0].steps[3].facts[3] (step "borrowing-bits", fact "Usable addresses") — ✅
- units[0].steps[3].events[0] (event "mask-26") — ✅
- units[0].steps[3].events[1] (event "subnets-26") — ✅
- units[0].steps[3].events[2] (event "network-26") — ✅
- units[0].steps[3].events[3] (event "broadcast-26") — ✅
- units[0].steps[4] (step "local-remote") — ✅
- units[0].steps[4].facts[0] (step "local-remote", fact "Laptop") — ✅
- units[0].steps[4].facts[1] (step "local-remote", fact "Printer") — ✅ (the printer's .20 is a private example address in the scene)
- units[0].steps[4].facts[2] (step "local-remote", fact "Design PC") — ✅
- units[0].steps[4].facts[3] (step "local-remote", fact "Default gateway") — ✅ (192.168.1.1 is the scene's private example address for the gateway, the same one the local-remote Go deeper gives)
- units[0].steps[4].events[0] (event "same-subnet") — ✅
- units[0].steps[4].events[1] (event "different-subnet") — ✅
- units[0].steps[5] (step "point-to-point") — ✅ (203.0.113.x addresses are documentation examples)
- units[0].steps[5].facts[0] (step "point-to-point", fact "Mask") — ✅
- units[0].steps[5].facts[1] (step "point-to-point", fact "This subnet") — ✅
- units[0].steps[5].facts[2] (step "point-to-point", fact "Usable addresses") — ✅
- units[0].steps[5].facts[3] (step "point-to-point", fact "Typical use") — ✅ ("typical" is a small describing word for term-p2p's "such as between two routers")
- units[0].steps[5].events[0] (event "mask-30") — ✅
- units[0].steps[5].events[1] (event "network-30") — ✅
- units[0].steps[5].events[2] (event "usable-30") — ✅
- units[0].practice[0].prompt (question "usable-26") — ✅
- units[0].practice[1].prompt (question "via-router") — ✅
- units[0].practice[2].prompt (question "why-30") — ✅

## Sources

- `cisco-host-subnet-quantities`: Cisco tech note 13790, live on cisco.com, last revised 2023-05-17, describes current subnetting practice. Current. Checked 2026-11-12.
- `cisco-ip-subnets`: Cisco tech note 13788, live on cisco.com, last revised 2023-07-07. It still teaches classes, but it says they are rarely used now and the cited sections describe current practice. Current. Checked 2026-11-12.
- `cloudflare-network-layers`: Cloudflare developer documentation, live, last updated 2026-10-12. Current. Checked 2026-11-12.
- `microsoft-osi`: Microsoft Learn, live, last updated 2025-01-31. Current. Checked 2026-11-12.
- `microsoft-tcpip-subnetting`: Microsoft Learn troubleshooting article, live, last updated 2026-02-12. Current. Checked 2026-11-12.
- `rfc-1122`: the RFC Editor info page lists no obsoleting RFC; its nine updates (TCP, MPLS, IPv4 ID, Source Quench and others) do not touch §3.2.1.3 or §3.3.1. Current. Checked 2026-11-12.
- `rfc-1812`: Standards Track; not obsoleted; updated by RFC 2644 (directed broadcast defaults, cited and agreeing) and RFC 6633 (Source Quench). Current. Checked 2026-11-12.
- `rfc-1918`: Best Current Practice; not obsoleted; updated only by RFC 6761 (special-use domain names). Current. Checked 2026-11-12.
- `rfc-2131`: Standards Track, the DHCP specification; not obsoleted; its updates (RFC 3396, 4361, 5494, 6842) do not touch §3.1. Current. Checked 2026-11-12.
- `rfc-2644`: Best Current Practice; not obsoleted or updated. Current. Checked 2026-11-12.
- `rfc-3021`: Standards Track; not obsoleted or updated. Current. Checked 2026-11-12.
- `rfc-4632`: Best Current Practice; not obsoleted; it obsoletes RFC 1519. Current. Checked 2026-11-12.
- `rfc-5737`: Informational; not obsoleted or updated. Current. Checked 2026-11-12.
- `rfc-791`: not obsoleted; its updates (RFC 1349, 2474, 6864) touch the header fields, not addressing. Current. Checked 2026-11-12.
- `rfc-826`: not obsoleted; updated by RFC 5227 and RFC 5494, which do not change packet generation. Current. Checked 2026-11-12.
- `rfc-919`: the RFC Editor info page lists no obsoleting or updating RFC. Current. Checked 2026-11-12.
- `rfc-950`: not obsoleted; updated only by RFC 6918, which deprecates ICMP Address Mask messages and leaves §2.1 and §2.2 as they are. Current. Checked 2026-11-12.

## Limit overrides

None.
