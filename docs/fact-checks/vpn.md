```json fact-check
{
  "slug": "vpn",
  "hash": "5d626a2f1e228a9ce9ed9dd6ef5921188417176ad172b785780a796858a37a9a",
  "checked": "2026-11-16",
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
    "units[0].overview.facts[0] (Overview fact \"Does\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Protects\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"The network you’re on sees\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Kinds include\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"One way to build it\")": "✅",
    "units[0].steps[0] (step \"plain-cafe\")": "✅",
    "units[0].steps[0].facts[0] (step \"plain-cafe\", fact \"Your request\")": "✅",
    "units[0].steps[0].facts[1] (step \"plain-cafe\", fact \"Someone on the café’s Wi-Fi\")": "✅",
    "units[0].steps[0].facts[2] (step \"plain-cafe\", fact \"On Wi-Fi you don’t run\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-get\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-row\")": "✅",
    "units[0].steps[0].events[2] (event \"s1-page\")": "✅",
    "units[0].steps[1] (step \"ike\")": "✅",
    "units[0].steps[1].facts[0] (step \"ike\", fact \"IKE\")": "✅",
    "units[0].steps[1].facts[1] (step \"ike\", fact \"Someone listening\")": "✅",
    "units[0].steps[1].facts[2] (step \"ike\", fact \"Your address on the VPN’s side\")": "✅",
    "units[0].steps[1].facts[3] (step \"ike\", fact \"Ports\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-init\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-init-back\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-auth\")": "✅",
    "units[0].steps[1].events[3] (event \"s2-auth-back\")": "✅",
    "units[0].steps[2] (step \"esp\")": "✅",
    "units[0].steps[2].facts[0] (step \"esp\", fact \"Outside\")": "✅",
    "units[0].steps[2].facts[1] (step \"esp\", fact \"Inside, sealed\")": "✅",
    "units[0].steps[2].facts[2] (step \"esp\", fact \"Someone on the café’s Wi-Fi\")": "✅",
    "units[0].steps[2].facts[3] (step \"esp\", fact \"It travels\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-esp\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-row\")": "✅",
    "units[0].steps[3] (step \"out-of-the-tunnel\")": "✅",
    "units[0].steps[3].facts[0] (step \"out-of-the-tunnel\", fact \"The VPN server\")": "✅",
    "units[0].steps[3].facts[1] (step \"out-of-the-tunnel\", fact \"From there to the site\")": "✅",
    "units[0].steps[3].facts[2] (step \"out-of-the-tunnel\", fact \"The site sees you as\")": "✅",
    "units[0].steps[3].facts[3] (step \"out-of-the-tunnel\", fact \"The page\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-server\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-get\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-after\")": "✅",
    "units[0].steps[3].events[3] (event \"s4-page\")": "✅",
    "units[0].steps[3].events[4] (event \"s4-esp\")": "✅",
    "units[0].steps[4] (step \"https-matters\")": "✅",
    "units[0].steps[4].facts[0] (step \"https-matters\", fact \"With HTTPS\")": "✅",
    "units[0].steps[4].facts[1] (step \"https-matters\", fact \"The VPN server sees\")": "✅",
    "units[0].steps[4].facts[2] (step \"https-matters\", fact \"The VPN protects\")": "✅",
    "units[0].steps[4].facts[3] (step \"https-matters\", fact \"HTTPS protects\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-esp\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-server\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-https\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-after\")": "✅",
    "units[0].steps[4].events[4] (event \"s5-https-back\")": "✅",
    "units[0].steps[4].events[5] (event \"s5-esp-back\")": "✅",
    "units[0].steps[0].deep[0] (step \"plain-cafe\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"ike\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"esp\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"out-of-the-tunnel\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"https-matters\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "✅",
    "units[0].learn.terms[0] (\"term-vpn\")": "✅",
    "units[0].learn.terms[1] (\"term-vpn-server\")": "✅",
    "units[0].learn.terms[2] (\"term-tunnel\")": "✅",
    "units[0].learn.terms[3] (\"term-ipsec\")": "✅",
    "units[0].learn.terms[4] (\"term-ike\")": "✅",
    "units[0].learn.terms[5] (\"term-esp\")": "✅",
    "units[0].learn.terms[6] (\"term-remote-access\")": "✅",
    "units[0].learn.terms[7] (\"term-site-to-site\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-protocols\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-admin\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-wifi\")": "✅",
    "units[0].learn.facts[1] (\"fact-https\")": "✅",
    "units[0].learn.facts[2] (\"fact-setup\")": "✅",
    "units[0].learn.facts[3] (\"fact-address\")": "✅",
    "units[0].learn.facts[4] (\"fact-ports\")": "✅",
    "units[0].learn.facts[5] (\"fact-nat\")": "✅",
    "units[0].learn.facts[6] (\"fact-outer\")": "✅",
    "units[0].learn.facts[7] (\"fact-inner\")": "✅",
    "units[0].learn.facts[8] (\"fact-ends\")": "✅",
    "units[0].learn.facts[9] (\"fact-server-reads\")": "✅",
    "units[0].learn.facts[10] (\"fact-reply\")": "✅",
    "units[0].learn.facts[11] (\"fact-whose\")": "✅",
    "units[0].learn.facts[12] (\"fact-here\")": "✅",
    "units[0].learn.facts[13] (\"fact-layers\")": "✅",
    "units[0].learn.facts[14] (\"fact-get\")": "✅",
    "units[0].learn.facts[15] (\"fact-name\")": "✅",
    "units[0].practice[0].options[0] (question \"past-the-server\")": "✅",
    "units[0].practice[0].options[1] (question \"past-the-server\")": "✅",
    "units[0].practice[0].options[2] (question \"past-the-server\")": "✅",
    "units[0].practice[1].options[0] (question \"what-the-cafe-sees\")": "✅",
    "units[0].practice[1].options[1] (question \"what-the-cafe-sees\")": "✅",
    "units[0].practice[1].options[2] (question \"what-the-cafe-sees\")": "✅",
    "units[0].practice[0].prompt (question \"past-the-server\")": "✅",
    "units[0].practice[1].prompt (question \"what-the-cafe-sees\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-what-is-vpn",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "cisco-wifi-security",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-chrome-secure",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "google-cloud-vpn",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-azure-network-best-practices",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-azure-vpn-p2s",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-edge-https-first",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-ms-sstp",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "microsoft-windows-vpn",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "nist-sp800-123",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "nist-sp800-77r1",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "paloalto-ipsec",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "paloalto-vpn-tunnel",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "paloalto-what-is-vpn",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-3948",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-4301",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-4303",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-7296",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9112",
      "current": true,
      "checked": "2026-11-16"
    },
    {
      "id": "rfc-9846",
      "current": true,
      "checked": "2026-11-16"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-16",
    "count": 197,
    "digest": "c2d7b4b5a5f138b86a8c836756cd19c20068c786ffdf8c523d186053d2bfa64d",
    "files": {
      "nist-sp800-77r1": "2343fd37c8cf23a8bfb594b481a867298f4177adf3146228bd365d2b9affe30e",
      "paloalto-what-is-vpn": "5796490b8af8375e6da1f3f80d03ebf5cd8bccdc8f603d7551e8a7926a914a86",
      "cisco-wifi-security": "ec57b48747bab148cfbe68e4aa2f30a5cae49f13baf8a3aab373f115a2511200",
      "rfc-7296": "b6c1bf3921e85dd3674f427ffcaded0209e1f9718e8d601e2f918371f46329a1",
      "rfc-3948": "e37df55098e76e53dc15d681da342a077759f480f953370bff50cf2bba87123c",
      "rfc-4303": "d22f9d4120e5645525b63ac7bbf8ef78c334fe003a2c48bf1e25ac25f6e7dc58",
      "paloalto-vpn-tunnel": "e39588aaa7fa4823a9c5beb72459e0c4ddc1f1005382f67a348f3feb1a2ed111",
      "microsoft-windows-vpn": "465d70443854ce1feff40100599dc288c2f714458b14b0e10dddde75e81b2ab9",
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17",
      "cisco-what-is-vpn": "f169538b3111cf60f797a1a8e1e1ef8cd1db49119c52bd4c3bdea6a2f516dea3",
      "rfc-4301": "a2411e90515f59665e1059b1bb66d8123bd9e384ccfc8b7ccca65db85d5d7736",
      "paloalto-ipsec": "df76ff1d7e2289d683f60ccb98fde16a86db6ae1a4c88f1d481a611c3a396b09",
      "microsoft-azure-network-best-practices": "2c1ded97c988911f361df8c0b355640d36289dd1e38be33f19c7d199463e6b51",
      "google-cloud-vpn": "c2d9f51673a11f39157cdff5a658daa65247a53a484767ea3b66b816e7ffcaf7",
      "microsoft-azure-vpn-p2s": "ff5c5e99f2f24077b72cd0d4900c5165f7b1b011461671564b557bb087564131",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "microsoft-ms-sstp": "73054080b3820ebef5d5d875a9901ea28bb14f7a5aac27906ef89d9fb2dc1850",
      "nist-sp800-123": "742981fb54b065581f1c70d39b44c06b997775234e7d29c9f41f829acdf6ef89",
      "microsoft-edge-https-first": "24eadb5fec82053c55652b1d3439cfe4006b45f4e17e4f2cdbcc74c73ca5143a",
      "google-chrome-secure": "6e11ed7c92bfc27a26f8fe1c18aaee345e050da8e9a17228aa53a860dcec0c5d",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937"
    }
  },
  "items": {
    "title": "8390ddffb7c63d66780d88c08c5dd1637a3c43611b773381e47619617eddc501",
    "units[0].name": "adecff31c6138becef0074394305f71922ade5ad0f472367f7c2614c400d75bd",
    "units[0].osi": "17c8769f2b58beff9273753a44012a077e731b61b24948a7d59567552df0492d",
    "backing (the lesson's subtitle and summary)": "0c763db0d945853a0851a42417b5cb316af1ca6fa042ff704d77f6eca564db8f",
    "units[0].backing (the unit's full name and purpose)": "3aff50b858a0341dcf02f2e9a22f34c72bbdb7afe46114e17c093b316fb87ea8",
    "units[0].scene.backing (the scene)": "22c7c72e78be927083cf097e7c97ba6dd14ec9aadb3a42348bf3d307efb89597",
    "units[0].overview.hookBacking (the Overview hook)": "97eca5137178a03f17f33a764ada9db78b9a9b97becd8ab29f30174e7f7fa670",
    "units[0].overview.backing (the Overview description)": "c26a9b195d23e19b710a3c08a18fdb9aa39ff053ab3ebeac5beeafd351f403af",
    "units[0].overview.facts[0] (Overview fact \"Does\")": "7f41aeda9975abd53b641bbd394fd0a1affd2aaea456cde4a2b4db725e99c186",
    "units[0].overview.facts[1] (Overview fact \"Protects\")": "d0a9bb09b4be142df43dd9a7615e7cad1ceef8c1cc3193772ad0d7b3be390a4a",
    "units[0].overview.facts[2] (Overview fact \"The network you’re on sees\")": "b6345cb44dbaeffdebe8524dcfcb7768a354fd35526e408f1031310f23c4841b",
    "units[0].overview.facts[3] (Overview fact \"Kinds include\")": "54f400cae68683e2bd48c3eaa5806720f19bfddd288bab36f2cf3d88319f0f6f",
    "units[0].overview.facts[4] (Overview fact \"One way to build it\")": "cba2fca42d05645c3ae17a92458ca0503a76b2828eef859230ad7314e852e7b2",
    "units[0].steps[0] (step \"plain-cafe\")": "0f7cfd6225a2951020c818d25575f365e45b5275f52728d9a3f00c065504e3b6",
    "units[0].steps[0].facts[0] (step \"plain-cafe\", fact \"Your request\")": "e1da1148f8581b95b0ab692c0dd9f055e204f852d43e0b48da0004b6412a5bdd",
    "units[0].steps[0].facts[1] (step \"plain-cafe\", fact \"Someone on the café’s Wi-Fi\")": "5f47b2fe0d0155e485c44a06b85990aaad4a3014ad069a15843d9718b8db6c38",
    "units[0].steps[0].facts[2] (step \"plain-cafe\", fact \"On Wi-Fi you don’t run\")": "b62b10ea3aeb309afce569c663cc6859352fc59638b2c5a0c050d5efcc930302",
    "units[0].steps[0].events[0] (event \"s1-get\")": "f111afe66f63a13d11f0f222ed3466732e2306ed0e9cdd5410e39fbf8db147e1",
    "units[0].steps[0].events[1] (event \"s1-row\")": "0ab03eb17282aa0054bc37361a87821c6044039891616cd1a38e428312628d78",
    "units[0].steps[0].events[2] (event \"s1-page\")": "d529984976283c08ecdae9e187ff91666d21cc23c34417a4a2648e2f63b94a2e",
    "units[0].steps[1] (step \"ike\")": "facc5896eff74dcad0440cf876e3a0e45ca69d0a84b9b4dfc5159cf709e5903c",
    "units[0].steps[1].facts[0] (step \"ike\", fact \"IKE\")": "a0b9ad9e0c42a540704a5154429faf8a791f1ef1606a9814f1d4bad1a542122e",
    "units[0].steps[1].facts[1] (step \"ike\", fact \"Someone listening\")": "7a28b78af85f2130242d611be7383b6e2e1b4df99802f20a7b46f1ace7b4699b",
    "units[0].steps[1].facts[2] (step \"ike\", fact \"Your address on the VPN’s side\")": "01efc1e8edf352c8e4a278cc8858e8880b6b6abe69a08471b415e6c77e0104b1",
    "units[0].steps[1].facts[3] (step \"ike\", fact \"Ports\")": "f565f9362179f2aad019124ef5d28f18bfc3dae8bd2c13c065d6dc14f19ebc96",
    "units[0].steps[1].events[0] (event \"s2-init\")": "9f2d90397012e175764954557291ebe645ab687e924397d267755b0a867957ff",
    "units[0].steps[1].events[1] (event \"s2-init-back\")": "18b51bf416cc6d87c50d1c69aaf2f0630d4722f6f22ae26c8aee41c75a61b976",
    "units[0].steps[1].events[2] (event \"s2-auth\")": "281341a895ca6e249217ed8f098c4276493e0efb7934c36f8382d4ea44134382",
    "units[0].steps[1].events[3] (event \"s2-auth-back\")": "8ec9e211cca36e0839c89621601fecdf6971ae99dcb188802ff09552e973f6c6",
    "units[0].steps[2] (step \"esp\")": "f76335c65109d016fe51a6e00b24ea535a840642f53a21a39d7caee48f3b2acb",
    "units[0].steps[2].facts[0] (step \"esp\", fact \"Outside\")": "4e13b7ca18a8abf7de49ec5f5f7566ec4886dfe2cffd32c3fedb04acb9678f15",
    "units[0].steps[2].facts[1] (step \"esp\", fact \"Inside, sealed\")": "431b0e452ef913a744181ec8de77567327be196375211d7d872ba5d72152537f",
    "units[0].steps[2].facts[2] (step \"esp\", fact \"Someone on the café’s Wi-Fi\")": "d197305de92f14e1da9fbbd893acddb3ebe40997a01267cd3c0079513def3d06",
    "units[0].steps[2].facts[3] (step \"esp\", fact \"It travels\")": "679e7a0e460ed6686005d1f7532254b582837fd8abf0f825573acb9f2b7f86ef",
    "units[0].steps[2].events[0] (event \"s3-esp\")": "28ed4022f0bbad7263a3939b014c191f1a23d9f29c056efb0578e15917f43016",
    "units[0].steps[2].events[1] (event \"s3-row\")": "b94003549ccbc34e6fca34c759b979b8f1c6556f318b448402a6866984d80743",
    "units[0].steps[3] (step \"out-of-the-tunnel\")": "69f1bbba38b346c220cfa6b47ee3796820970d3f5f95c0b1b62f84a5bc15012b",
    "units[0].steps[3].facts[0] (step \"out-of-the-tunnel\", fact \"The VPN server\")": "6e1633cf5a40b7f12bf696cacc68bb28c659babdad3412e7cce4fa5876d43395",
    "units[0].steps[3].facts[1] (step \"out-of-the-tunnel\", fact \"From there to the site\")": "0f25d63a5d624f1a4a976e8635c62fefaf8efec35bc46f13d01837ff3778f7aa",
    "units[0].steps[3].facts[2] (step \"out-of-the-tunnel\", fact \"The site sees you as\")": "c12effdf97fba88cecc28c43c2810a94e8a5015366d8db60e976f078fc46530e",
    "units[0].steps[3].facts[3] (step \"out-of-the-tunnel\", fact \"The page\")": "04059fa109301d3b9f26236e4948bdc4b1d65b3f5459a033b8aa9c6303d2befc",
    "units[0].steps[3].events[0] (event \"s4-server\")": "04a6811724dcef8eb107ef972a7047bb4d16f2c9e4bdd528db155376db2474eb",
    "units[0].steps[3].events[1] (event \"s4-get\")": "a1e56a1e0abc184eec7fcfbaa27fdb7facf40be0e7e90d76173bdbebaff93935",
    "units[0].steps[3].events[2] (event \"s4-after\")": "0d5f7b47823fc7ce5be19043e48e7026560e5226643a6484aa371b3d0174f769",
    "units[0].steps[3].events[3] (event \"s4-page\")": "35cfea231b9097f3fd13bb38aef731bd0819951a56a1f60171a582f706a652a8",
    "units[0].steps[3].events[4] (event \"s4-esp\")": "25d29b426b276bb3deaa1acf66a7cce165e33d8d2d6adf90f2856b7cdae1089f",
    "units[0].steps[4] (step \"https-matters\")": "875a6b4b765914d11e53f03c68001313bb61b6fa29444cf80836114dcc272e0b",
    "units[0].steps[4].facts[0] (step \"https-matters\", fact \"With HTTPS\")": "2a5d6746d7657336be65c51e4d17b5b021da218b3272919c112467a110bf3606",
    "units[0].steps[4].facts[1] (step \"https-matters\", fact \"The VPN server sees\")": "2b9e409b95a9ad0a86439c4248e2b64f6ed9441ffac8d8af375a89ad59d2624b",
    "units[0].steps[4].facts[2] (step \"https-matters\", fact \"The VPN protects\")": "a38343defdb901907bc59aec46773b05063176b09e6bc0e1f02c8eee7e02d0d2",
    "units[0].steps[4].facts[3] (step \"https-matters\", fact \"HTTPS protects\")": "c7a01dc73c2dd7c06b604fb81d8932a6f54900e5e65a41f6b934acd16c5e0740",
    "units[0].steps[4].events[0] (event \"s5-esp\")": "501de1037af8ac6d439d97e99f0382b3237ad9e54e8f10a5fb8d99965ae247d3",
    "units[0].steps[4].events[1] (event \"s5-server\")": "4934def9b9b8516104841bc873494abdec041c1fe6b85e22fc775d9673ad0417",
    "units[0].steps[4].events[2] (event \"s5-https\")": "327a4488a65d0bfb69ee60fe2145a18c84fbd6909af7b3670c88d64add3c274f",
    "units[0].steps[4].events[3] (event \"s5-after\")": "ec2a232929bb79e9539e1e4dfdfb2159ad5d6073e8e4f5bee167d3eb43708959",
    "units[0].steps[4].events[4] (event \"s5-https-back\")": "2eca946f93dbed44d5243d1b7eaf33d089f4b776a625440760eeb45e2c8e8256",
    "units[0].steps[4].events[5] (event \"s5-esp-back\")": "73fda7d72a8a490d57a02d8915b3679ab07ba626d90fe9c4159117f567129b1b",
    "units[0].steps[0].deep[0] (step \"plain-cafe\", Go deeper)": "e2a2333c8671bfdc19b62437f56d1fca2a9c062aad96c6cb8749074c0dd3a427",
    "units[0].steps[1].deep[0] (step \"ike\", Go deeper)": "8c5b1cf989ca2f0b5038784bcefc788d3d6932b9eb3a16776c040dea60dc3dc5",
    "units[0].steps[2].deep[0] (step \"esp\", Go deeper)": "72031d40b37a6b0c85585c22e250f96a297a8ad2e63c375d8faeec549a6bf2fe",
    "units[0].steps[3].deep[0] (step \"out-of-the-tunnel\", Go deeper)": "4cb65335e337018f0f6ac2b9242f7b27082ded0f838a83256e77cb552eea0214",
    "units[0].steps[4].deep[0] (step \"https-matters\", Go deeper)": "553c37085e2cc24ad4226e47c25ff33431852c4bf95e4e178220ca88ea719ea6",
    "units[0].learn.lead[0] (\"lead-1\")": "375c7a8c2d4f0789e55616d16814acbfbd74a62ff4057f9b6c8a66ca1d77397b",
    "units[0].learn.lead[1] (\"lead-2\")": "ea8cb9b238a75029722aae786aa2c912d286a510f0b465dd6976b84eaa26aea7",
    "units[0].learn.lead[2] (\"lead-3\")": "521cfd75aa28dbc65f702b1c094c1903228af57eb147ae945b159f04d32f5de8",
    "units[0].learn.terms[0] (\"term-vpn\")": "b266ff0b7cb2ca5de095fcc15a278041fa30a3701df02ebf0a8b3e5ac0ddb482",
    "units[0].learn.terms[1] (\"term-vpn-server\")": "5d373adb6af2ce50d8f4ec19b7fee71a2d7871ef6392c0f053b4b17ad4619f67",
    "units[0].learn.terms[2] (\"term-tunnel\")": "e049865006bbd2c64928723401b89ff2d259b3dbc74f2139e36a849f6385dbb4",
    "units[0].learn.terms[3] (\"term-ipsec\")": "cd16d8d7dd8ea4eeaf68658b0836e55d57ba80c144db3428a944b796027b0840",
    "units[0].learn.terms[4] (\"term-ike\")": "ac8089e56daa82077b0555cd60c160709186ace8899209ca53960173d8a35d2b",
    "units[0].learn.terms[5] (\"term-esp\")": "178a8991d20b880cf9d3689e87869861887885780514248e730a4dbf2aaf5194",
    "units[0].learn.terms[6] (\"term-remote-access\")": "9fc0197d6dba316950f93f58c9a12620c2d72f87a4b6adf79c6b16121233b4ea",
    "units[0].learn.terms[7] (\"term-site-to-site\")": "7d741719b14112c031cb0b9a3cefe340593044877060ff629f788c2abfcf73a1",
    "units[0].learn.pattern (\"pattern\")": "3abbd049fe0afb74b67d74d3ceca7107eca2fa57a14f6bc8e1a66877db87858a",
    "units[0].learn.why[0] (\"why-1\")": "78e81fae90159be0e57f857415b77191df3e9be750a546006180c6937afa7836",
    "units[0].learn.why[1] (\"why-2\")": "b184e43b082b5a8ab0efd0cbda5ddd9251461f422c778c89781cec5d4edd791e",
    "units[0].learn.deep[0] (\"deep-protocols\", Learn's Go deeper)": "a905ff0420969fc2b712c5a0051ea0fdbf19479f24d9ce232a38a2ae477215dc",
    "units[0].learn.deep[1] (\"deep-admin\", Learn's Go deeper)": "396543f594a306d4d3ceebc924b39b863fa6bc8657c9c225777380d3d8709b43",
    "units[0].learn.facts[0] (\"fact-wifi\")": "5594bbe10721bfbb5fd075b0322b599914cb700a842dad7bea9afb7bb7898794",
    "units[0].learn.facts[1] (\"fact-https\")": "336100db8001e369438a2308ace79f6ea5fe04a836984c6cd991bd1cb531cf12",
    "units[0].learn.facts[2] (\"fact-setup\")": "3d60a798fd47ef3976aa57dc63a337bce2c67b09f46ea7a5042158404daeb545",
    "units[0].learn.facts[3] (\"fact-address\")": "3bf396e5a696bf1ee89aa224b74e30a62aabaf87f32cdd885ae02437fd4340ca",
    "units[0].learn.facts[4] (\"fact-ports\")": "9ea6da5d3a777e5d545a081b0077ad58627ed883f634ef003f3f7dca8ca49522",
    "units[0].learn.facts[5] (\"fact-nat\")": "12993c7a442ed448b6b132ce1ddf7f92d8f65407b2fe48f0d896fa91f3ab48c2",
    "units[0].learn.facts[6] (\"fact-outer\")": "70960ea4f56d111970b4fa9414f67b6a8a21ec15af4c4a64bb4fb985ab8abeb7",
    "units[0].learn.facts[7] (\"fact-inner\")": "d5c850389d865d67bbc28d11f5483e01069b7a26abe9cbda8f31bc621a0fdcb8",
    "units[0].learn.facts[8] (\"fact-ends\")": "eb414e41040a0631863375495eb74931f3003c67f41accbcf12e4454cc350315",
    "units[0].learn.facts[9] (\"fact-server-reads\")": "5391ab5c4737498622a3831f5b687f33f7ba1436198506feaf23f78bc560aa0f",
    "units[0].learn.facts[10] (\"fact-reply\")": "0170cc4cd984bce6c8446e5f43364f907fc577aeaec5c08bbe97b192fb6e6e81",
    "units[0].learn.facts[11] (\"fact-whose\")": "2c41301563b4b13f5bb29343963bcef58d1327e855ce6e0d102696457bb1ffbb",
    "units[0].learn.facts[12] (\"fact-here\")": "3e18279bace4123b5d2dc6f07b3aa6eb7ad009e080d0f17f25b868e63d706874",
    "units[0].learn.facts[13] (\"fact-layers\")": "28038e9485e7366bbd59db4ae786da102ecc3ae9894621ae3f0506d4a09d7547",
    "units[0].learn.facts[14] (\"fact-get\")": "a4fa13e28e500d349ba2437169f6de748cde400401a7afab773b297fc10709cb",
    "units[0].learn.facts[15] (\"fact-name\")": "586745bb60783928e0683e19f1575bfd091fc02a145e6495c3c797f4c7ddae2a",
    "units[0].practice[0].options[0] (question \"past-the-server\")": "d96c901fea791d8e56b0d70810f67aaedf00ec7de7759bb7b79c4a9f6f4ea175",
    "units[0].practice[0].options[1] (question \"past-the-server\")": "344ae5d13f78c3a939b66b84bd00a47766ee1eb15523bd8545edd49d6986446a",
    "units[0].practice[0].options[2] (question \"past-the-server\")": "af0715e7d5117e02c3d8cf541b78c73f64d5bc090ead230a8e77e0dfa6810a53",
    "units[0].practice[1].options[0] (question \"what-the-cafe-sees\")": "55e6a178d039652f5399f0236c29da01b1429c106c0823c569619d4cea6ecc8c",
    "units[0].practice[1].options[1] (question \"what-the-cafe-sees\")": "e75555f0309701e6925e9e515fc3930c9c5813b1aa8e3a40796635a74660b644",
    "units[0].practice[1].options[2] (question \"what-the-cafe-sees\")": "fcce25c876a29d24289901ae6c97f51945e22de05b4a5b4eb0d8901a6c8875f9",
    "units[0].practice[0].prompt (question \"past-the-server\")": "1d5d07b79e156a1d847cc3f16ba236fd3acc9dff691fc9330ef0decbfdbe2221",
    "units[0].practice[1].prompt (question \"what-the-cafe-sees\")": "e924c7e285c96760a82eac080a7e68e6ed28ee8859cd90e418b12100f31ec571"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: VPN

Full check of the claim sheet, every source fetched from its publisher on 2026-11-16. All 102 items pass.

## Claims

### units[0].osi — ✅

- Note: The badge is `spans`. NIST SP 800-77r1 §8 groups VPN protocols by the layer they work at (data link layer VPNs, transport layer SSL VPNs) and its Executive Summary puts IPsec at the network layer; Palo Alto's IPsec page puts IPsec VPNs at the network layer and SSL VPNs at the application layer. No allowed source met in this check puts "a VPN" at a single layer, so `spans` holds.

### units[0].steps[0].deep[0] (step "plain-cafe", Go deeper) — ✅

- `nist-sp800-77r1` §8.1.1
  > Devices on a WiFi network should use a remote access VPN like IPsec to communicate with resources on the wired network. This is especially true for WiFi access points belonging to third parties, such as restaurants and hotels.
- `paloalto-what-is-vpn` §Personal VPN benefits
  > Public networks are often unsecured. That makes it easier for attackers to intercept data. A VPN helps reduce that risk by encrypting your traffic before it leaves the device.
- `cisco-wifi-security` §Virtual private networks (VPNs)
  > VPNs are another source of Wi-Fi network security. They allow users to create secure, identity-protected tunnels between unprotected Wi-Fi networks and the internet.
- `nist-sp800-77r1` §2.4.2
  > the network traffic between the user’s host (the remote device in Figure 3) and the VPN gateway will be protected by the IPsec connection.
- Note: The advice to use a VPN on others' Wi-Fi, and the sealing before the traffic leaves the device, are each stated by NIST and by Palo Alto. "As far as the VPN server" matches NIST's host-to-gateway protection.
- Note: NIST SP 800-77r1 (June 2020) is final and not withdrawn; the vendor pages are live.

### units[0].steps[1].deep[0] (step "ike", Go deeper) — ✅

- `rfc-7296` §2.23
  > When those nodes make connections to nodes on the real Internet, the NAT gateway "translates" the IP source address to an address that will be routed back to the gateway.
- `rfc-7296` §2.23
  > It is a common practice of NATs to translate TCP and UDP port numbers as well as addresses
- `rfc-7296` §2.23
  > For that reason, IKEv2 will use UDP encapsulation of IKE and ESP packets. This encoding is slightly less efficient but is easier for NATs to process.
- `rfc-7296` §2.23
  > An IPsec endpoint that discovers a NAT between it and its correspondent (as described below) MUST send all subsequent traffic from port 4500,
- `rfc-3948` §1
  > This protocol specification defines methods to encapsulate and decapsulate ESP packets inside UDP packets for traversing Network Address Translators (NATs)
- `nist-sp800-77r1` §4.2.1
  > when IKE detects a NAT during the negotiation, it switches the IKE negotiation from UDP port 500 to UDP port 4500.
- `nist-sp800-77r1` §4.2.1
  > ESPinUDP also uses port 4500 to ensure that the NAT device only has one NAT mapping for all traffic (ESP and IKE).
- Note: RFC 7296 (IKEv2, Internet Standard) defines NAT traversal for IKE, including the move to port 4500; RFC 3948 (Proposed Standard) defines UDP encapsulation of ESP. Neither is obsoleted; RFC 7296's updates (RFCs 7427, 7670, 8247, 8983, 9370, 9827) do not touch NAT traversal.

### units[0].steps[2].deep[0] (step "esp", Go deeper) — ✅

- `rfc-4303` §3.1.2
  > In tunnel mode, the "inner" IP header carries the ultimate (IP) source and destination addresses, while an "outer" IP header contains the addresses of the IPsec "peers", e.g., addresses of security gateways.
- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `rfc-4303` §1
  > ESP can be used to provide confidentiality, data origin authentication, connectionless integrity, an anti-replay service
- `nist-sp800-77r1` §4.1.1
  > The new IP header lists the endpoints of the ESP tunnel (such as two IPsec gateways) as the source and destination of the packet and contains the entire, now-encrypted, original packet as its payload.
- `nist-sp800-77r1` §4.1.1
  > The ICV is used to detect any changes to the data over which the ICV is computed.
- Note: RFC 4303 defines ESP, its tunnel mode and its services; it is a Proposed Standard and not obsoleted. NIST independently states each part.
- Note: ESP can in principle run without integrity; the claim describes the ordinary, recommended case.

### units[0].steps[3].deep[0] (step "out-of-the-tunnel", Go deeper) — ✅

- `nist-sp800-77r1` §2.4.2
  > Only traffic for the organization itself will be sent over the VPN connection; a separate internet connection would be required. This is called a split-tunnel VPN.
- `nist-sp800-77r1` §2.4.2
  > In that case, a remote host will send all its traffic via the VPN connection to the VPN gateway;
- `paloalto-vpn-tunnel` §What Is VPN Split Tunneling?
  > VPN split tunneling is a feature that allows a user to route some internet traffic through a secure VPN, while other traffic accesses the internet directly, bypassing the VPN.
- Note: "Work traffic" is the lesson's everyday word for NIST's traffic for the organization itself.

### units[0].steps[4].deep[0] (step "https-matters", Go deeper) — ✅

- `rfc-4303` §3.4.4.1
  > The receiver decrypts the ESP Payload Data, Padding, Pad Length, and Next Header using the key, encryption algorithm, algorithm mode, and cryptographic synchronization data (if any), indicated by the SA.
- `nist-sp800-77r1` §2.4.2
  > As shown in Figure 3, the remote access VPN does not provide full protection for data throughout transit.
- `microsoft-windows-vpn` §Create a VPN profile
  > If it’s for work, look for VPN settings or a VPN app on your company’s intranet site while you’re at work, or contact your company's support person.
- `microsoft-windows-vpn` §Create a VPN profile
  > If it’s for a VPN service you subscribe to for personal use,
- `paloalto-what-is-vpn` §How does a VPN work?
  > The VPN encrypts the user’s internet traffic and routes it through a remote server operated by the VPN provider.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: RFC 4303 defines ESP's inbound processing, in which the VPN server decrypts what it receives; RFC 9846 is the current TLS 1.3 specification (obsoletes RFC 8446) and defines the confidentiality HTTPS relies on. Who runs the server is stated by Microsoft and Palo Alto.
- Note: "A VPN service you pay for" leaves out free and self-run VPN services.

### units[0].learn.lead[0] ("lead-1") — ✅

- `cisco-what-is-vpn` §What is a virtual private network (VPN)?
  > A virtual private network, or VPN, is an encrypted connection over the Internet from a device to a network.
- `paloalto-vpn-tunnel` §What Is a VPN Tunnel?
  > A VPN tunnel is a secure, encrypted connection between a network device and a VPN server that safeguards data transfer over the internet.
- `nist-sp800-77r1` §2.4.2
  > each remote access user then establishes a VPN connection between their remote device (host) and the VPN gateway.
- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `rfc-4301` §4.1
  > If ESP is employed, the protection is afforded only to the tunneled packet, not to the outer header.
- `rfc-7296` §1.1.3
  > The outer destination address will always be that of the security gateway, while the inner destination address will be the ultimate destination for the packet.
- `nist-sp800-77r1` §4.1.1
  > encrypting the original IP header conceals the nature of the communications, such as the actual source or destination of the packet, protocol, and ports used
- `paloalto-ipsec` §IPsec Tunnel Mode
  > Tunnel Mode encapsulates the entire IP packet, including its header, within a new packet with a new header.
- Note: RFC 4303 and RFC 4301 define ESP tunnel mode; RFC 7296 §1.1.3 defines the device-to-gateway tunnel and its addresses. NIST and Palo Alto independently state the same.
- Note: "Sees only that you're talking to the VPN server" leaves out what the outer packets still show, such as their size and timing.

### units[0].learn.lead[1] ("lead-2") — ✅

- `rfc-4303` §3.4.4.1
  > The receiver reconstructs the original IP datagram from:
- `rfc-4303` §3.4.4.1
  > for tunnel mode -- the entire IP datagram in the ESP Payload field.
- `rfc-7296` §1.1.3
  > the protected endpoint will want an IP address associated with the security gateway so that packets returned to it will go to the security gateway and be tunneled back.
- `nist-sp800-77r1` §2.4.2
  > The dashed lines indicate that communications between the gateway and the destination hosts (e.g., servers, laptops, desktops) on the right side of the figure are not protected.
- `paloalto-vpn-tunnel` §4. Decryption at the VPN server
  > The VPN server receives the encrypted data and uses keys to decrypt it. Once decrypted, the data can continue to its intended destination on the internet.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: "As they would have gone without a VPN" speaks of how readable they are; the source address does change to the VPN's, which the lesson teaches in its own fact.

### units[0].learn.terms[0] ("term-vpn") — ✅

- `cisco-what-is-vpn` §What is a virtual private network (VPN)?
  > A virtual private network, or VPN, is an encrypted connection over the Internet from a device to a network.
- `nist-sp800-77r1` §2.3
  > A Virtual Private Network (VPN) is a virtual network built on top of existing physical networks that can provide a secure communications mechanism for data and IP information transmitted between networks or between different nodes on the same network.
- `paloalto-vpn-tunnel` §What Is a VPN Tunnel?
  > A VPN tunnel is a secure, encrypted connection between a network device and a VPN server that safeguards data transfer over the internet.
- Note: The full name is given by Cisco and NIST. The idea describes the device-to-server kind this lesson shows; NIST's definition is broader (network to network too), which the lesson covers in its site-to-site term.

### units[0].learn.terms[1] ("term-vpn-server") — ✅

- `nist-sp800-77r1` §2.4.2
  > The organization deploys a VPN gateway onto its network; each remote access user then establishes a VPN connection between their remote device (host) and the VPN gateway.
- `nist-sp800-77r1` §2.4.2
  > Traffic received and decrypted by the VPN gateway that is not meant for the local organization can be sent to the organization’s firewall for inspection and then sent onwards through the organization’s internet connection.
- `paloalto-vpn-tunnel` §4. Decryption at the VPN server
  > The VPN server receives the encrypted data and uses keys to decrypt it. Once decrypted, the data can continue to its intended destination on the internet.
- `paloalto-what-is-vpn` §How does a VPN work?
  > That client establishes a secure connection to a VPN gateway managed by the organization.
- `rfc-7296` §1.1.3
  > the inner IP header will contain the source IP address assigned by the security gateway (i.e., the address that will get traffic routed to the security gateway for forwarding to the endpoint).
- `rfc-4303` §3.4.4.1
  > for tunnel mode -- the entire IP datagram in the ESP Payload field.
- Note: Both names, VPN server and VPN gateway, are used by Palo Alto; NIST uses VPN gateway.

### units[0].learn.terms[2] ("term-tunnel") — ✅

- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `rfc-4301` §4.1
  > For a tunnel mode SA, there is an "outer" IP header that specifies the IPsec processing source and destination, plus an "inner" IP header that specifies the (apparently) ultimate source and destination for the packet.
- `nist-sp800-77r1` §4.1.1
  > The new IP header lists the endpoints of the ESP tunnel (such as two IPsec gateways) as the source and destination of the packet and contains the entire, now-encrypted, original packet as its payload.
- `paloalto-ipsec` §IPsec Tunnel Mode
  > Tunnel Mode encapsulates the entire IP packet, including its header, within a new packet with a new header.
- `cisco-what-is-vpn` §Is VPN traffic encrypted?
  > traffic on the virtual network is sent securely by establishing an encrypted connection across the Internet known as a tunnel.
- `paloalto-vpn-tunnel` §How is tunneling accomplished in a VPN?
  > In a VPN, tunneling is accomplished by encapsulating a network protocol within packets carried by the second network.
- Note: RFC 4303 and RFC 4301 define tunnel mode. The idea describes IPsec's tunnel mode, which the lesson shows; other VPN kinds tunnel in their own ways.

### units[0].learn.terms[3] ("term-ipsec") — ✅

- `rfc-4301` §3.1
  > IPsec security services are offered at the IP layer through selection of appropriate security protocols, cryptographic algorithms, and cryptographic keys.
- `rfc-4301` §3.2
  > IPsec uses two protocols to provide traffic security services -- Authentication Header (AH) and Encapsulating Security Payload (ESP).
- `nist-sp800-77r1` §2.3
  > The most common use of IPsec implementations is providing VPN services.
- `nist-sp800-77r1` §Executive Summary
  > IPsec is a network layer security protocol with two main components:
- Note: RFC 4301 defines the IPsec architecture; it is a Proposed Standard, not obsoleted, updated only by RFCs 6040 and 7619, which do not touch this.

### units[0].learn.terms[4] ("term-ike") — ✅

- `rfc-7296` §1
  > IKE performs mutual authentication between two parties and establishes an IKE Security Association (SA) that includes shared secret information
- `rfc-7296` §1.2
  > The first pair of messages (IKE_SA_INIT) negotiate cryptographic algorithms, exchange nonces, and do a Diffie-Hellman exchange [DH].
- `nist-sp800-77r1` §Executive Summary
  > Internet Key Exchange (IKE) is the protocol used by IPsec to negotiate IPsec connection settings; authenticate endpoints to each other;
- `paloalto-what-is-vpn` §Internet Protocol Security (IPsec)
  > It also uses Internet Key Exchange (IKE) to establish encryption keys between devices.
- Note: RFC 7296 defines IKEv2, including the full name; it is an Internet Standard (STD 79) and not obsoleted.

### units[0].learn.terms[5] ("term-esp") — ✅

- `rfc-4303` §1
  > ESP can be used to provide confidentiality, data origin authentication, connectionless integrity, an anti-replay service
- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `rfc-4301` §3.2
  > The Encapsulating Security Payload (ESP) protocol [Ken05a] offers the same set of services, and also offers confidentiality. Use of ESP to provide confidentiality without integrity is NOT RECOMMENDED.
- `nist-sp800-77r1` §Executive Summary
  > Encapsulating Security Payload (ESP) is the protocol that transports the encrypted and integrity-protected network communications across the network.
- Note: RFC 4303 defines ESP and gives its full name. ESP may run with NULL encryption or without integrity; the idea gives the ordinary case.

### units[0].learn.terms[6] ("term-remote-access") — ✅

- `nist-sp800-77r1` §2.4.2
  > The organization deploys a VPN gateway onto its network; each remote access user then establishes a VPN connection between their remote device (host) and the VPN gateway.
- `cisco-what-is-vpn` §Remote access
  > A remote access VPN securely connects a device outside the corporate office.
- `cisco-what-is-vpn` §Remote access
  > Think of remote access as computer to network.
- `microsoft-azure-network-best-practices` §Disable RDP and SSH access to virtual machines
  > Point-to-site VPN is another term for a remote access VPN client/server connection.

### units[0].learn.terms[7] ("term-site-to-site") — ✅

- `nist-sp800-77r1` §2.4.1
  > This is typically done by deploying a VPN gateway onto each network and establishing a VPN connection between the two gateways.
- `cisco-what-is-vpn` §Site-to-site
  > A site-to-site VPN connects the corporate office to branch offices over the Internet.
- `paloalto-what-is-vpn` §Site-to-site VPN
  > A site-to-site VPN connects two or more networks over the internet.
- `microsoft-azure-network-best-practices` §Disable RDP and SSH access to virtual machines
  > A site-to-site VPN connects an entire network to another network over the internet.
- `google-cloud-vpn` §Cloud VPN overview
  > The VPN connection encrypts traffic traveling between the networks, with one VPN gateway handling encryption and the other handling decryption.

### units[0].learn.pattern ("pattern") — ✅

- `rfc-7296` §1.2
  > The first pair of messages (IKE_SA_INIT) negotiate cryptographic algorithms, exchange nonces, and do a Diffie-Hellman exchange [DH].
- `rfc-7296` §1.2
  > The second pair of messages (IKE_AUTH) authenticate the previous messages, exchange identities and certificates, and establish the first Child SA.
- `nist-sp800-77r1` §2.3.3
  > After performing the DH key exchange and calculating the shared key, the endpoints still need to authenticate each other
- `nist-sp800-77r1` §Executive Summary
  > Encapsulating Security Payload (ESP) is the protocol that transports the encrypted and integrity-protected network communications across the network.
- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `nist-sp800-77r1` §4.1.1
  > The new IP header lists the endpoints of the ESP tunnel (such as two IPsec gateways) as the source and destination of the packet
- `rfc-4303` §3.4.4.1
  > for tunnel mode -- the entire IP datagram in the ESP Payload field.
- `paloalto-vpn-tunnel` §4. Decryption at the VPN server
  > The VPN server receives the encrypted data and uses keys to decrypt it. Once decrypted, the data can continue to its intended destination on the internet.
- `rfc-7296` §1.1.3
  > the address that will get traffic routed to the security gateway for forwarding to the endpoint
- `nist-sp800-77r1` §2.4.2
  > the remote access VPN does not provide full protection for data throughout transit.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: The order (keys, then identities, then sealed traffic, unwrapped and sent on at the gateway) is defined by RFC 7296 §1.2 and RFC 4303, and stated independently by NIST and Palo Alto.

### units[0].learn.why[0] ("why-1") — ✅

- `nist-sp800-77r1` §8.1.1
  > It is good practice to consider WiFi encryption to be insufficient and to not trust the access point.
- `paloalto-what-is-vpn` §Personal VPN benefits
  > Public networks are often unsecured. That makes it easier for attackers to intercept data.
- `cisco-wifi-security` §Virtual private networks (VPNs)
  > They allow users to create secure, identity-protected tunnels between unprotected Wi-Fi networks and the internet.
- `microsoft-windows-vpn` §Summary
  > A VPN connection can help provide a more secure connection and access to your company's network and the internet, for example, when you’re working from a coffee shop or similar public place.
- `cisco-what-is-vpn` §What is a virtual private network (VPN)?
  > It prevents unauthorized people from eavesdropping on the traffic and allows the user to conduct work remotely.
- `nist-sp800-77r1` §2.4.2
  > the network traffic between the user’s host (the remote device in Figure 3) and the VPN gateway will be protected by the IPsec connection.
- `paloalto-vpn-tunnel` §2. Establishment of an encrypted tunnel
  > This encryption shields the internet traffic from unauthorized access as it moves through the user's internet connection to the VPN server.
- Note: "You can't tell who is listening" puts in a beginner's words NIST's advice not to trust the access point and Palo Alto's point that public networks are often unsecured.

### units[0].learn.why[1] ("why-2") — ✅

- `cisco-what-is-vpn` §How does a virtual private network (VPN) work?
  > A VPN extends a corporate network through encrypted connections made over the Internet.
- `cisco-what-is-vpn` §How does a virtual private network (VPN) work?
  > An employee can work outside the office and still securely connect to the corporate network.
- `paloalto-what-is-vpn` §Remote access VPN
  > This allows remote employees to access apps, files, and services as if they were on the corporate network.
- `nist-sp800-77r1` §2.4.2
  > The user can now use the organization’s computing resources,

### units[0].learn.deep[0] ("deep-protocols", Learn's Go deeper) — ✅

- `nist-sp800-77r1` §8.2
  > The most common IPsec alternative is the SSL VPN. Although these are still called SSL VPNs, they now use the TLS protocol rather than the older SSL protocol.
- `nist-sp800-77r1` §8.2
  > Usually, it is run over port 443 (HTTPS) since most networks pass on this traffic without attempting any kind of deep packet inspection.
- `microsoft-azure-vpn-p2s` §What protocol does P2S use?
  > OpenVPN® Protocol, an SSL/TLS based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses.
- `microsoft-azure-vpn-p2s` §What protocol does P2S use?
  > Secure Socket Tunneling Protocol (SSTP), a proprietary TLS-based VPN protocol.
- `paloalto-what-is-vpn` §SSL VPN
  > An SSL VPN uses the Secure Sockets Layer (SSL) or Transport Layer Security (TLS) protocol to encrypt browser-based connections.
- `rfc-9110` §4.2.2
  > The "https" URI scheme is hereby defined for minting identifiers within the hierarchical namespace governed by a potential origin server listening for TCP connections on a given port and capable of establishing a TLS ([TLS13]) connection that has been secured for HTTP communication.
- `paloalto-what-is-vpn` §Secure Socket Tunneling Protocol (SSTP)
  > Because it relies on the same port used for HTTPS traffic, it can pass through most firewalls without issue.
- `microsoft-ms-sstp` §1.3 Overview
  > When a client establishes an SSTP-based VPN connection, it first establishes a TCP connection to the SSTP server over TCP port 443.
- `microsoft-ms-sstp` §1.3 Overview
  > This protocol enables users to access a private network by using HTTPS.
- `nist-sp800-77r1` §8.2.1
  > Secure Socket Tunneling Protocol (SSTP) is the Microsoft version of an SSL VPN. It uses SSL/TLS over port 443
- `nist-sp800-77r1` §8.2.3
  > OpenVPN is a popular SSL VPN protocol/implementation that was originally written in 2001. It uses SSL or TLS over any preconfigured port
- `paloalto-what-is-vpn` §OpenVPN
  > OpenVPN is a flexible open-source protocol that supports both site-to-site and remote access VPNs.
- `nist-sp800-77r1` §8.3
  > is a fairly new VPN implementation originally written for the Linux kernel.
- `paloalto-what-is-vpn` §WireGuard
  > WireGuard is a modern, open-source VPN protocol
- `paloalto-what-is-vpn` §WireGuard
  > It uses UDP for fast, low-latency communication
- Note: RFC 9110 defines the https scheme, which requires TLS (current, Internet Standard). "Often on port 443" is NIST's "usually"; OpenVPN can use any configured port.

### units[0].learn.deep[1] ("deep-admin", Learn's Go deeper) — ✅

- `microsoft-azure-network-best-practices` §Disable RDP and SSH access to virtual machines
  > Point-to-site VPN is more secure than direct RDP or SSH connections because the user has to authenticate twice before connecting to a VM.
- `microsoft-azure-network-best-practices` §Disable RDP and SSH access to virtual machines
  > Disable direct RDP and SSH access to your Azure virtual machines from the internet.
- `nist-sp800-123` §6.5
  > Remote administration should generally not be allowed from a host located outside the organization’s network unless it is performed from an organization-controlled computer through the organization’s remote access solution, such as a VPN.
- `nist-sp800-123` §6.5
  > Use a strong authentication mechanism (e.g., public/private key pair, two-factor authentication).
- `nist-sp800-77r1` §2.4.2
  > The user is typically asked by the VPN gateway to authenticate their identity before the connection can be established.
- Note: Reaching servers only through the VPN is stated by Microsoft and by NIST SP 800-123; the two sign-ins are stated by Microsoft, and separately by NIST (the VPN sign-in in SP 800-77r1, the server sign-in in SP 800-123). SP 800-123 (July 2008) is final and not withdrawn on CSRC.
- Note: "A company can" leaves the choice open, as the sources do.

### units[0].learn.facts[0] ("fact-wifi") — ✅

- `nist-sp800-77r1` §8.1.1
  > It is good practice to consider WiFi encryption to be insufficient and to not trust the access point. Devices on a WiFi network should use a remote access VPN like IPsec to communicate with resources on the wired network.
- `paloalto-what-is-vpn` §Personal VPN benefits
  > Public networks are often unsecured. That makes it easier for attackers to intercept data. A VPN helps reduce that risk
- `cisco-wifi-security` §Virtual private networks (VPNs)
  > VPNs are another source of Wi-Fi network security.
- `microsoft-windows-vpn` §Summary
  > when you’re working from a coffee shop or similar public place.

### units[0].learn.facts[1] ("fact-https") — ✅

- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > HTTP sends data (like passwords or card numbers) in plain text, making it easier for hackers to intercept.
- `microsoft-edge-https-first` §What are HTTP and HTTPS?
  > HTTPS (Hypertext Transfer Protocol Secure) encrypts that data, keeping your information private and secure.
- `google-chrome-secure` §What each security symbol means
  > Information you send or get through the site is private between you and the site.
- `google-chrome-secure` §What each security symbol means
  > The site doesn’t use a private connection. Someone may be able to view and change the information you send and get through this site.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: RFC 9846 is the current TLS 1.3 specification and defines the confidentiality HTTPS gives; Microsoft and Google each state both halves.

### units[0].learn.facts[2] ("fact-setup") — ✅

- `rfc-7296` §1.2
  > The first pair of messages (IKE_SA_INIT) negotiate cryptographic algorithms, exchange nonces, and do a Diffie-Hellman exchange [DH].
- `rfc-7296` §1.2
  > Parts of these messages are encrypted and integrity protected with keys established through the IKE_SA_INIT exchange, so the identities are hidden from eavesdroppers
- `nist-sp800-77r1` §2.3.3
  > VPNs typically use the DH key exchange algorithm to create a confidential communication channel to calculate a shared key between the two endpoints that an eavesdropper cannot obtain or compute.
- `rfc-7296` §1
  > IKE performs mutual authentication between two parties
- Note: RFC 7296 defines the IKE_SA_INIT and IKE_AUTH exchanges.

### units[0].learn.facts[3] ("fact-address") — ✅

- `rfc-7296` §1.1.3
  > the inner IP header will contain the source IP address assigned by the security gateway
- `rfc-7296` §2.19
  > Since the IKE_AUTH exchange creates an IKE SA and a Child SA, the IRAC MUST request the IRAS-controlled address (and optionally other information concerning the protected network) in the IKE_AUTH exchange.
- `paloalto-what-is-vpn` §How does a VPN work?
  > That server assigns a new IP address to the user’s device. Which helps obscure location and identity.
- `cisco-wifi-security` §Virtual private networks (VPNs)
  > It also can conceal a user's IP address by using a virtual IP address it assigns to the user's traffic as it passes through the VPN server.
- Note: RFC 7296 defines the address request in IKE_AUTH and the assigned inner source address. That sites see the VPN's address is stated by Palo Alto and Cisco.
- Note: Some VPN servers translate the assigned address to a public one of their own before sending traffic on; either way a site sees a VPN address, not the café's or yours, so a beginner is not misled.

### units[0].learn.facts[4] ("fact-ports") — ✅

- `rfc-7296` §2
  > IKE normally listens and sends on UDP port 500, though IKE messages may also be received on UDP port 4500 with a slightly different format (see Section 2.23).
- `rfc-7296` §2.23
  > An IPsec endpoint that discovers a NAT between it and its correspondent (as described below) MUST send all subsequent traffic from port 4500,
- `nist-sp800-77r1` §4.2.1
  > when IKE detects a NAT during the negotiation, it switches the IKE negotiation from UDP port 500 to UDP port 4500.
- `paloalto-ipsec` §IPSec Ports
  > UDP port 500 for initiating connections and negotiating keys, and UDP port 4500 for situations where Network Address Translation (NAT) is involved.
- Note: "Normally" leaves room for IKEv2 starting on port 4500, which RFC 7296 allows.

### units[0].learn.facts[5] ("fact-nat") — ✅

- `rfc-7296` §2.23
  > For that reason, IKEv2 will use UDP encapsulation of IKE and ESP packets. This encoding is slightly less efficient but is easier for NATs to process.
- `rfc-3948` §1
  > This protocol specification defines methods to encapsulate and decapsulate ESP packets inside UDP packets for traversing Network Address Translators (NATs)
- `rfc-7296` §1.1.3
  > In that case, the IP address as seen by the security gateway will not be the same as the IP address sent by the protected endpoint, and packets will have to be UDP encapsulated in order to be routed properly.
- `nist-sp800-77r1` §4.2.1
  > The NAT device can rewrite the IP address of the outer UDP packet and track multiple clients by the UDP port number.

### units[0].learn.facts[6] ("fact-outer") — ✅

- `rfc-4301` §4.1
  > If ESP is employed, the protection is afforded only to the tunneled packet, not to the outer header.
- `rfc-7296` §1.1.3
  > On each packet from the protected endpoint, the outer IP header will contain the source IP address associated with its current location
- `rfc-7296` §1.1.3
  > The outer destination address will always be that of the security gateway,
- `rfc-4303` §3.1.2
  > an "outer" IP header contains the addresses of the IPsec "peers", e.g., addresses of security gateways.
- `nist-sp800-77r1` §4.1.1
  > The ICV computation does not include the new IP header.
- Note: RFC 4301, RFC 4303 and RFC 7296 define the outer header and what ESP covers.

### units[0].learn.facts[7] ("fact-inner") — ✅

- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `nist-sp800-77r1` §4.1.1
  > encrypting the original IP header conceals the nature of the communications, such as the actual source or destination of the packet, protocol, and ports used
- `paloalto-ipsec` §IPsec Tunnel Mode
  > It is most commonly used in gateway-to-gateway communications, where it safeguards internal network details by encrypting the entire original packet.

### units[0].learn.facts[8] ("fact-ends") — ✅

- `nist-sp800-77r1` §2.4.2
  > The dashed lines indicate that communications between the gateway and the destination hosts (e.g., servers, laptops, desktops) on the right side of the figure are not protected.
- `nist-sp800-77r1` §2.4.2
  > the network traffic between the user’s host (the remote device in Figure 3) and the VPN gateway will be protected by the IPsec connection.
- `rfc-7296` §1.1.3
  > The outer destination address will always be that of the security gateway,
- `paloalto-vpn-tunnel` §2. Establishment of an encrypted tunnel
  > This encryption shields the internet traffic from unauthorized access as it moves through the user's internet connection to the VPN server.
- `paloalto-vpn-tunnel` §4. Decryption at the VPN server
  > The VPN server receives the encrypted data and uses keys to decrypt it.

### units[0].learn.facts[9] ("fact-server-reads") — ✅

- `rfc-4303` §3.4.4.1
  > The receiver decrypts the ESP Payload Data, Padding, Pad Length, and Next Header using the key, encryption algorithm, algorithm mode, and cryptographic synchronization data (if any), indicated by the SA.
- `rfc-4303` §3.1.2
  > In tunnel mode, the "inner" IP header carries the ultimate (IP) source and destination addresses,
- `nist-sp800-77r1` §2.4.2
  > Traffic received and decrypted by the VPN gateway that is not meant for the local organization can be sent to the organization’s firewall for inspection
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: RFC 4303 defines the decryption at the receiving end of the tunnel; RFC 9846 defines TLS's confidentiality, which keeps HTTPS content from the VPN server.

### units[0].learn.facts[10] ("fact-reply") — ✅

- `rfc-7296` §1.1.3
  > the protected endpoint will want an IP address associated with the security gateway so that packets returned to it will go to the security gateway and be tunneled back.
- `nist-sp800-77r1` §2.4.2
  > Similarly, response traffic from the internet flows back via the organization’s firewall to the VPN gateway and is then sent via the VPN connection to the remote host.
- `paloalto-vpn-tunnel` §5. Return of data to the user's device
  > Data sent from the internet back to the user also passes through the encrypted tunnel, ensuring privacy and security in both directions.

### units[0].learn.facts[11] ("fact-whose") — ✅

- `microsoft-windows-vpn` §Create a VPN profile
  > You can either create a VPN profile on your own or set up a work account to get a VPN profile from your company.
- `microsoft-windows-vpn` §Create a VPN profile
  > If it’s for a VPN service you subscribe to for personal use,
- `paloalto-what-is-vpn` §How does a VPN work?
  > The VPN encrypts the user’s internet traffic and routes it through a remote server operated by the VPN provider.
- `paloalto-what-is-vpn` §How does a VPN work?
  > That client establishes a secure connection to a VPN gateway managed by the organization.
- Note: Leaves out free VPN services and servers people run themselves; work and paid services are the ordinary cases.

### units[0].learn.facts[12] ("fact-here") — ✅

- `rfc-9110` §4.2.1
  > If the port subcomponent is empty or not given, TCP port 80 (the reserved port for WWW services) is the default.
- `rfc-9110` §4.2.2
  > If the port subcomponent is empty or not given, TCP port 443 (the reserved port for HTTP over TLS) is the default.
- Note: RFC 9110 defines the http and https schemes and their default ports; it is an Internet Standard and not obsoleted.

### units[0].learn.facts[13] ("fact-layers") — ✅

- `nist-sp800-77r1` §Executive Summary
  > IPsec is a network layer security protocol with two main components:
- `nist-sp800-77r1` §8.2
  > Transport layer VPNs are what people usually think of when describing a VPN.
- `nist-sp800-77r1` §8.1
  > Data link layer VPN protocols function below the network layer in the TCP/IP model.
- `paloalto-ipsec` §IPsec vs. SSL VPN
  > IPsec VPNs encrypt at the network layer.
- `paloalto-ipsec` §IPsec vs. SSL VPN
  > SSL VPNs work at the application layer
- Note: NIST places TLS (SSL) VPNs at the transport layer and Palo Alto at the application layer; both are above the network layer, so "higher up" holds. The fact does not say every VPN is at the network layer or above.

### units[0].learn.facts[14] ("fact-get") — ✅

- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation for the target resource.
- `rfc-9112` §3
  > A request-line begins with a method token, followed by a single space (SP), the request-target, and another single space (SP), and ends with the protocol version.
- `rfc-9112` §3.2.1
  > If the target URI's path component is empty, the client MUST send "/" as the path within the origin-form of request-target.
- Note: RFC 9110 defines GET and RFC 9112 the request line; both are Internet Standards, not obsoleted (RFC 9112's update, RFC 9931, does not touch this). "A page" is the everyday word for the representation.

### units[0].learn.facts[15] ("fact-name") — ✅

- `cisco-what-is-vpn` §What is a virtual private network (VPN)?
  > A virtual private network, or VPN, is an encrypted connection over the Internet from a device to a network.
- `nist-sp800-77r1` §2.3
  > A Virtual Private Network (VPN) is a virtual network built on top of existing physical networks

### units[0].practice[0].options[0] (question "past-the-server") — ✅

- `nist-sp800-77r1` §2.4.2
  > The dashed lines indicate that communications between the gateway and the destination hosts (e.g., servers, laptops, desktops) on the right side of the figure are not protected.
- `rfc-7296` §1.1.3
  > the inner IP header will contain the source IP address assigned by the security gateway (i.e., the address that will get traffic routed to the security gateway for forwarding to the endpoint).
- `rfc-4303` §3.4.4.1
  > for tunnel mode -- the entire IP datagram in the ESP Payload field.
- `paloalto-vpn-tunnel` §4. Decryption at the VPN server
  > The VPN server receives the encrypted data and uses keys to decrypt it. Once decrypted, the data can continue to its intended destination on the internet.
- Note: The option is the right answer for a plain http:// page sent through a full tunnel; its feedback matches.

### units[0].practice[0].options[1] (question "past-the-server") — ✅

- `nist-sp800-77r1` §2.4.2
  > As shown in Figure 3, the remote access VPN does not provide full protection for data throughout transit.
- `paloalto-vpn-tunnel` §2. Establishment of an encrypted tunnel
  > This encryption shields the internet traffic from unauthorized access as it moves through the user's internet connection to the VPN server.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is only visible to the endpoints.
- Note: The option is wrong and marked wrong; the feedback says why.

### units[0].practice[0].options[2] (question "past-the-server") — ✅

- `rfc-4301` §4.1
  > If ESP is employed, the protection is afforded only to the tunneled packet, not to the outer header.
- `rfc-7296` §1.1.3
  > The outer destination address will always be that of the security gateway, while the inner destination address will be the ultimate destination for the packet.
- `nist-sp800-77r1` §4.1.1
  > encrypting the original IP header conceals the nature of the communications, such as the actual source or destination of the packet, protocol, and ports used
- Note: The option is wrong (on the café's Wi-Fi the request is sealed) and marked wrong.

### units[0].practice[1].options[0] (question "what-the-cafe-sees") — ✅

- `rfc-7296` §1.1.3
  > On each packet from the protected endpoint, the outer IP header will contain the source IP address associated with its current location
- `rfc-7296` §1.1.3
  > The outer destination address will always be that of the security gateway, while the inner destination address will be the ultimate destination for the packet.
- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `nist-sp800-77r1` §4.1.1
  > encrypting the original IP header conceals the nature of the communications, such as the actual source or destination of the packet, protocol, and ports used
- Note: Right, and marked right, for a full tunnel as the prompt sets.

### units[0].practice[1].options[1] (question "what-the-cafe-sees") — ✅

- `rfc-4301` §4.1
  > If ESP is employed, the protection is afforded only to the tunneled packet, not to the outer header.
- `nist-sp800-77r1` §4.1.1
  > The new IP header lists the endpoints of the ESP tunnel (such as two IPsec gateways) as the source and destination of the packet
- Note: Wrong, and marked wrong.

### units[0].practice[1].options[2] (question "what-the-cafe-sees") — ✅

- `rfc-4303` §3.1.2
  > In tunnel mode, ESP protects the entire inner IP packet, including the entire inner IP header.
- `nist-sp800-77r1` §4.1.1
  > Encrypting the original IP header and its payload protects their confidentiality;
- `paloalto-ipsec` §IPsec Tunnel Mode
  > Tunnel Mode encapsulates the entire IP packet, including its header, within a new packet with a new header.
- Note: Wrong, and marked wrong.

## Traced, example, analogy and unbacked parts

Each traced part was read against the Learn parts its Traces line names; none adds a value, name, number, outcome or condition beyond them. The addresses are RFC 1918 (192.168.1.100) and RFC 5737 (203.0.113.0/24) example data; the names are example.net.

- `title` — ✅
- `units[0].name` — ✅
- `backing (the lesson's subtitle and summary)` — ✅
- `units[0].backing (the unit's full name and purpose)` — ✅
- `units[0].scene.backing (the scene)` — ✅
- `units[0].overview.hookBacking (the Overview hook)` — ✅
- `units[0].overview.backing (the Overview description)` — ✅ (analogy: the envelope is opened by the friend and the postcard goes on readable, as the tunnel ends at the VPN server; the locked box stands for HTTPS sealing to the site)
- `units[0].overview.facts[0]` to `facts[4]` — ✅ (facts[4] says IPsec is one way to build a VPN, which is weaker than term-ipsec, not more)
- `units[0].steps[0]` and its facts and events — ✅
- `units[0].steps[1]` and its facts and events — ✅ (the address is given in IKE_AUTH, as fact-address now says; the laptop asking for it in IKE_AUTH is the request side of that same exchange)
- `units[0].steps[2]` and its facts and events — ✅
- `units[0].steps[3]` and its facts and events — ✅
- `units[0].steps[4]` and its facts and events — ✅
- `units[0].learn.lead[2] ("lead-3")` — ✅ (analogy, as for the Overview description)
- `units[0].practice[0].prompt (question "past-the-server")` — ✅ (no false premise; it sets a full tunnel and a plain http:// page)
- `units[0].practice[1].prompt (question "what-the-cafe-sees")` — ✅

## Sources

All checked on 2026-11-16.

- `rfc-3948` — Proposed Standard; the RFC Editor info page lists no obsoleting RFC. Current.
- `rfc-4301` — Proposed Standard; not obsoleted; updated by RFCs 6040 and 7619, neither of which touches the sections used. Current.
- `rfc-4303` — Proposed Standard; not obsoleted. Current.
- `rfc-7296` — Internet Standard (STD 79); not obsoleted; updated by RFCs 7427, 7670, 8247, 8983, 9370 and 9827, none of which changes NAT traversal, the initial exchanges or address assignment. Current.
- `rfc-9110` — Internet Standard; not obsoleted. Current.
- `rfc-9112` — Internet Standard; not obsoleted; updated by RFC 9931, which does not touch the request line. Current.
- `rfc-9846` — Proposed Standard; the current TLS 1.3 specification (obsoletes RFC 8446); not obsoleted. Current.
- `nist-sp800-77r1` — CSRC lists SP 800-77 Rev. 1 (June 2020) as final; it supersedes SP 800-77 and is not itself withdrawn or superseded. Current.
- `nist-sp800-123` — CSRC lists SP 800-123 (July 2008) as final, with no withdrawal or superseding revision. Current.
- `cisco-what-is-vpn`, `cisco-wifi-security` — live Cisco explainer pages on current practice. Current.
- `google-chrome-secure` — live Chrome Help page. Current.
- `google-cloud-vpn` — live Google Cloud documentation for a current product. Current.
- `microsoft-azure-network-best-practices`, `microsoft-azure-vpn-p2s` — live Microsoft Learn documentation for current products. Current.
- `microsoft-edge-https-first`, `microsoft-windows-vpn` — live Microsoft Support pages for current products. Current.
- `microsoft-ms-sstp` — live Microsoft Open Specifications page for SSTP. Current.
- `paloalto-ipsec`, `paloalto-vpn-tunnel`, `paloalto-what-is-vpn` — live Palo Alto Networks Cyberpedia explainer pages describing current practice. Current.

## Limit overrides

None.
