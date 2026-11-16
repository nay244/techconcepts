```json fact-check
{
  "slug": "load-balancers",
  "hash": "70b5b183d7cc398b55589206b2fe30dbc6d8de18aa975fe66e71dbd9641831c3",
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
    "units[0].overview.facts[0] (Overview fact \"Does\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Readers use\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Checks\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"A failing server\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].steps[0] (step \"one-address\")": "✅",
    "units[0].steps[0].facts[0] (step \"one-address\", fact \"Readers use\")": "✅",
    "units[0].steps[0].facts[1] (step \"one-address\", fact \"Behind it\")": "✅",
    "units[0].steps[0].facts[2] (step \"one-address\", fact \"The servers’ addresses\")": "✅",
    "units[0].steps[0].facts[3] (step \"one-address\", fact \"Your request went to\")": "✅",
    "units[0].steps[0].events[0] (event \"s1-req\")": "✅",
    "units[0].steps[0].events[1] (event \"s1-a\")": "✅",
    "units[0].steps[1] (step \"spread\")": "✅",
    "units[0].steps[1].facts[0] (step \"spread\", fact \"This balancer picks\")": "✅",
    "units[0].steps[1].facts[1] (step \"spread\", fact \"Other ways\")": "✅",
    "units[0].steps[1].facts[2] (step \"spread\", fact \"Each server has\")": "✅",
    "units[0].steps[1].events[0] (event \"s2-req-b\")": "✅",
    "units[0].steps[1].events[1] (event \"s2-b\")": "✅",
    "units[0].steps[1].events[2] (event \"s2-req-c\")": "✅",
    "units[0].steps[1].events[3] (event \"s2-c\")": "✅",
    "units[0].steps[2] (step \"health-check-fails\")": "✅",
    "units[0].steps[2].facts[0] (step \"health-check-fails\", fact \"Checks\")": "✅",
    "units[0].steps[2].facts[1] (step \"health-check-fails\", fact \"A check fails when\")": "✅",
    "units[0].steps[2].facts[2] (step \"health-check-fails\", fact \"This balancer acts after\")": "✅",
    "units[0].steps[2].facts[3] (step \"health-check-fails\", fact \"Server B\")": "✅",
    "units[0].steps[2].events[0] (event \"s3-chk-a\")": "✅",
    "units[0].steps[2].events[1] (event \"s3-ok-a\")": "✅",
    "units[0].steps[2].events[2] (event \"s3-chk-b\")": "✅",
    "units[0].steps[2].events[3] (event \"s3-quiet-1\")": "✅",
    "units[0].steps[2].events[4] (event \"s3-b1\")": "✅",
    "units[0].steps[2].events[5] (event \"s3-chk-b2\")": "✅",
    "units[0].steps[2].events[6] (event \"s3-quiet-2\")": "✅",
    "units[0].steps[2].events[7] (event \"s3-b2\")": "✅",
    "units[0].steps[3] (step \"skipped\")": "✅",
    "units[0].steps[3].facts[0] (step \"skipped\", fact \"Server B\")": "✅",
    "units[0].steps[3].facts[1] (step \"skipped\", fact \"B’s turn\")": "✅",
    "units[0].steps[3].facts[2] (step \"skipped\", fact \"Readers\")": "✅",
    "units[0].steps[3].facts[3] (step \"skipped\", fact \"Checks to B\")": "✅",
    "units[0].steps[3].events[0] (event \"s4-req-a\")": "✅",
    "units[0].steps[3].events[1] (event \"s4-a2\")": "✅",
    "units[0].steps[3].events[2] (event \"s4-req-c\")": "✅",
    "units[0].steps[3].events[3] (event \"s4-c2\")": "✅",
    "units[0].steps[3].events[4] (event \"s4-req-a3\")": "✅",
    "units[0].steps[3].events[5] (event \"s4-a3\")": "✅",
    "units[0].steps[3].events[6] (event \"s4-chk-b\")": "✅",
    "units[0].steps[3].events[7] (event \"s4-quiet\")": "✅",
    "units[0].steps[4] (step \"healthy-again\")": "✅",
    "units[0].steps[4].facts[0] (step \"healthy-again\", fact \"B is healthy after\")": "✅",
    "units[0].steps[4].facts[1] (step \"healthy-again\", fact \"The next request\")": "✅",
    "units[0].steps[4].facts[2] (step \"healthy-again\", fact \"The pool\")": "✅",
    "units[0].steps[4].events[0] (event \"s5-chk-1\")": "✅",
    "units[0].steps[4].events[1] (event \"s5-ok-1\")": "✅",
    "units[0].steps[4].events[2] (event \"s5-b1\")": "✅",
    "units[0].steps[4].events[3] (event \"s5-chk-2\")": "✅",
    "units[0].steps[4].events[4] (event \"s5-ok-2\")": "✅",
    "units[0].steps[4].events[5] (event \"s5-b2\")": "✅",
    "units[0].steps[4].events[6] (event \"s5-req-b\")": "✅",
    "units[0].steps[4].events[7] (event \"s5-b3\")": "✅",
    "units[0].steps[0].deep[0] (step \"one-address\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"spread\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"health-check-fails\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"skipped\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"healthy-again\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "✅",
    "units[0].learn.terms[0] (\"term-load-balancer\")": "✅",
    "units[0].learn.terms[1] (\"term-pool\")": "✅",
    "units[0].learn.terms[2] (\"term-health-check\")": "✅",
    "units[0].learn.terms[3] (\"term-unhealthy\")": "✅",
    "units[0].learn.terms[4] (\"term-round-robin\")": "✅",
    "units[0].learn.terms[5] (\"term-least-requests\")": "✅",
    "units[0].learn.terms[6] (\"term-hash\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-layers\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-firewall\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-open\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-what\")": "✅",
    "units[0].learn.facts[1] (\"fact-address\")": "✅",
    "units[0].learn.facts[2] (\"fact-private\")": "✅",
    "units[0].learn.facts[3] (\"fact-methods\")": "✅",
    "units[0].learn.facts[4] (\"fact-checks\")": "✅",
    "units[0].learn.facts[5] (\"fact-threshold\")": "✅",
    "units[0].learn.facts[6] (\"fact-unhealthy\")": "✅",
    "units[0].learn.facts[7] (\"fact-back\")": "✅",
    "units[0].learn.facts[8] (\"fact-here\")": "✅",
    "units[0].learn.facts[9] (\"fact-osi\")": "✅",
    "units[0].practice[0].options[0] (question \"skipped\")": "✅",
    "units[0].practice[0].options[1] (question \"skipped\")": "✅",
    "units[0].practice[0].options[2] (question \"skipped\")": "✅",
    "units[0].practice[1].options[0] (question \"in-turn\")": "✅",
    "units[0].practice[1].options[1] (question \"in-turn\")": "✅",
    "units[0].practice[0].prompt (question \"skipped\")": "✅",
    "units[0].practice[1].prompt (question \"in-turn\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-lb-components",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cloudflare-lb-health",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cloudflare-lb-lor",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cloudflare-lb-maintenance",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "cloudflare-lb-proxy-modes",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "google-backend-service",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "google-health-checks",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "google-lb-overview",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-app-gateway",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-app-gateway-how",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-lb",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-lb-components",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-lb-distribution",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "microsoft-azure-lb-probes",
      "current": true,
      "checked": "2026-11-15"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-15"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-15",
    "count": 148,
    "digest": "5566d4b92efdd34de6dcb85b01a1c636fe32e3129a411dd701ee43b591e68d35",
    "files": {
      "microsoft-azure-lb": "05df429467889b5e4d8c5bb703221b6a0fa84348ff0b2f0c35f2107a968fd087",
      "microsoft-app-gateway": "7118123a3f736086e81c028bb8ddaef4716a47a590e0dc0fc7937241cf768e04",
      "cloudflare-lb-proxy-modes": "4e3984dd649ac61f58922d676250f80e45abfbfdb28392e387374e8a96f8b09d",
      "google-lb-overview": "23a1473f579f87b3dc38ef4a37caa1e464fa319b44bac7d3f682222d74cc1a4f",
      "microsoft-azure-lb-components": "598dc7da06aff6c2dd9d2baa5bcae789d6ffb65caddbee935a4408ab2709029b",
      "microsoft-azure-lb-distribution": "a2796f9b5890d03f7dce1954d68521052197bacd2b8295f22830dc08930b17ba",
      "google-backend-service": "41c279c3db1d0a682082cff08e5727f352dee78e3bd7a4b1dcd0284140e0bf52",
      "microsoft-azure-lb-probes": "0eb9e2ce5d7bc688399e97dc920c445416d6670391f2b7c507b5661dfa29408e",
      "google-health-checks": "cca6ae161d90d15e54da033d79f5bf3313f61f05259bb1d0b1708e5e30205fcf",
      "cloudflare-lb-maintenance": "015ebea1b7ba71bb6789d8bf2d379b672adf49797cf6b533ee50ac8cc91e909e",
      "cloudflare-lb-components": "a341def69c1f5e7fa6f3f5d889cd0db5897b33ac9540baf6b7e6b8d89d871db2",
      "microsoft-app-gateway-how": "c5e00fcb2035f7d8a3c0c1f8a949eea4bdb6389ba38d21e59c4369043e9ed1b7",
      "cloudflare-lb-health": "fc89f70bed8c2cae1b650076667a3d769200b84c4b9d95dff79a0271863859f6",
      "cloudflare-lb-lor": "beacf55803f89872a38c859db5adb0ee845e8fa3c1dad669f0c2c76b93a6bb6a",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a"
    }
  },
  "items": {
    "title": "ae1e8f1d622709e08b756f4c90ae7b835445f98b98777ae0ac3c470e47ee8906",
    "units[0].name": "b342bc404e5fde2e3d995a4b05c61458f6806531cd5093d71bcd4337256b3403",
    "units[0].osi": "a15ac249c71e72020abbb1ef08e3f66cf0e0530e4ed1860034502d9de64ea2e8",
    "backing (the lesson's subtitle and summary)": "059fcb43990f3d604692660e0743a09076d626fd2780081e414683b94f2bea45",
    "units[0].backing (the unit's full name and purpose)": "07d01860a7ecdeb7367752ab060d9981424d01051376a1f60740cb9c9f59e45a",
    "units[0].scene.backing (the scene)": "de69704a7bd931a76d706efc98324c6e9cea2cec261a29b3cdfa8228fc3c732a",
    "units[0].overview.hookBacking (the Overview hook)": "afb3d45fc460f2065f505b75ac415e0472a99e18977b2cb12f57eea02e704f48",
    "units[0].overview.backing (the Overview description)": "89c459a1ce61696881ad00bc095ead87fb21be478c1bbf8a13f874f5175bc795",
    "units[0].overview.facts[0] (Overview fact \"Does\")": "bbb3d85205edc3a529d3d6d47de4fd60a2d7f78fa40db631a45c22c7756b8b11",
    "units[0].overview.facts[1] (Overview fact \"Readers use\")": "42aee186a38a062f01e1213854ab9781bee5a447125359d807fc37add7b4f61b",
    "units[0].overview.facts[2] (Overview fact \"Checks\")": "a72710fb0f8d78fd18ea9698f8e5be739c76c1f6c7d8a163a096b0c46c6ebab1",
    "units[0].overview.facts[3] (Overview fact \"A failing server\")": "fdfe138b4e799e74ad13224b192e3e75b528f31da79bc4145570b577f432d1a1",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "7e59326740f941b57162e02b8376e08b2199df9464e5dfa8e41cfff211b5490f",
    "units[0].steps[0] (step \"one-address\")": "0bff0a3191fd8853c21074beebbfb7117485bfccde2a3f6bb82ad3fea3095313",
    "units[0].steps[0].facts[0] (step \"one-address\", fact \"Readers use\")": "f172f095cff280d6c82fb039f96285ab5416a85fcb4948b8b420c9033c22f81a",
    "units[0].steps[0].facts[1] (step \"one-address\", fact \"Behind it\")": "2bf292126e795bb96c2bd390c66f7b29c90bbfcc72267a2f3899edfac11229f8",
    "units[0].steps[0].facts[2] (step \"one-address\", fact \"The servers’ addresses\")": "5298a8a5750595be78ddca2e40db636234abd155761a364ceb84d88b0b95774c",
    "units[0].steps[0].facts[3] (step \"one-address\", fact \"Your request went to\")": "7bca103f073a61d42936f019bc0028db42b051bc5cb083c0f33fb89135ed9039",
    "units[0].steps[0].events[0] (event \"s1-req\")": "50ecdfb9fbedd5e83fc4c9ff7167fe07e67c59b1f0d8f954abed95121bae5189",
    "units[0].steps[0].events[1] (event \"s1-a\")": "412efa58867952f16e1abe4dd9ca25bd4bdf7e2dfb50520256085cac0907351f",
    "units[0].steps[1] (step \"spread\")": "eaa0afab77aa48fb0cc42380e80047d0c15ae74c831d45c30ae41c2caa271cc4",
    "units[0].steps[1].facts[0] (step \"spread\", fact \"This balancer picks\")": "5ae99319b2a08aa54dfb14e085c9a8e6a75c447dca16640725b6685717e4f031",
    "units[0].steps[1].facts[1] (step \"spread\", fact \"Other ways\")": "c556933f2a9def7bd0b100d29c4532bc92d71c0b0b53bc600a76f815cc9f49a4",
    "units[0].steps[1].facts[2] (step \"spread\", fact \"Each server has\")": "f933f6b6f0e97ad81f60bffe4b6dc6aae037f3bf858f5113ee12018fab12ad1c",
    "units[0].steps[1].events[0] (event \"s2-req-b\")": "264550169ea54a61abc1038f672ab111e48781d0d422db282298096a25877934",
    "units[0].steps[1].events[1] (event \"s2-b\")": "215454a4f6e5ee7b80cd12a079acd2f48f071d3c8b9a082c60396b8b96f5b5b2",
    "units[0].steps[1].events[2] (event \"s2-req-c\")": "82fcb27a6051d38e1c3fa7f20bde358b90b0eac0b5985d51584cec110d7d4f14",
    "units[0].steps[1].events[3] (event \"s2-c\")": "d00b9889b19fbbd23029f1a15cb080dbec71b4af4728de7601bb84e8d5dc103e",
    "units[0].steps[2] (step \"health-check-fails\")": "846c3d83087f7c5b4b0655a74554f7b1ae10f179fc9d218a707f5cf9ef05d095",
    "units[0].steps[2].facts[0] (step \"health-check-fails\", fact \"Checks\")": "9529c905ffeeb707113f90bd97277db2a085a968b21c3177018798024d66400f",
    "units[0].steps[2].facts[1] (step \"health-check-fails\", fact \"A check fails when\")": "fea33466643c5f5cd8ce31b5cd5ca5e08c82fe35f9971d945ba4af3617114c80",
    "units[0].steps[2].facts[2] (step \"health-check-fails\", fact \"This balancer acts after\")": "cf15ae23d63ae89ed3094f150609dcfb69ecebb43682367374baa3d8dfd1d5e4",
    "units[0].steps[2].facts[3] (step \"health-check-fails\", fact \"Server B\")": "8038471754f0b545f8f14d32d86a8f68486f199d97a9e6efe2360e2f874fce12",
    "units[0].steps[2].events[0] (event \"s3-chk-a\")": "f9b1e2b66187cf254cc99d04244e7a8a0ab5ef0c1e299cd5a34d431f9c481e36",
    "units[0].steps[2].events[1] (event \"s3-ok-a\")": "d40dd9d1b236f7df7c2086b6fe7dcfb094098207f381c48fbd939c40c5aabfef",
    "units[0].steps[2].events[2] (event \"s3-chk-b\")": "7f21afcec8c94a24665c486e7539fc992d3066036e9054174e24dff750d0c83e",
    "units[0].steps[2].events[3] (event \"s3-quiet-1\")": "6bcd5de6fd3cac327f29e182c6e7c18995afff3de04f1f8e53e82bed8528b2f5",
    "units[0].steps[2].events[4] (event \"s3-b1\")": "3c2fcac30d0e7918952904484766ddba0d3deb698693278a0cf98d31ac65a9c4",
    "units[0].steps[2].events[5] (event \"s3-chk-b2\")": "7f21afcec8c94a24665c486e7539fc992d3066036e9054174e24dff750d0c83e",
    "units[0].steps[2].events[6] (event \"s3-quiet-2\")": "62b2aa03c1ac517f11b522dda093166d21c225d172216be5fb7dfa6a51c49a1d",
    "units[0].steps[2].events[7] (event \"s3-b2\")": "f666967df146bc03335fe595ba8d3cec21cdbf1298855a9c6a4bd666d4251319",
    "units[0].steps[3] (step \"skipped\")": "49cecb95f52bd9dd332329a3e8295d6143e9c049d67c7ad9043c52cc04ddf751",
    "units[0].steps[3].facts[0] (step \"skipped\", fact \"Server B\")": "b72e61ba03acb4c9f72850998bb8eec30c109017314cae9068e5a6b01de33c98",
    "units[0].steps[3].facts[1] (step \"skipped\", fact \"B’s turn\")": "19e40e492eb726b9749bce389d99286fa5c2435351906fbbf63e9e299b87270c",
    "units[0].steps[3].facts[2] (step \"skipped\", fact \"Readers\")": "286c98ce917868d98963d276a6f5eb42b7b11a8e5319b2cbe54eab342f233bfa",
    "units[0].steps[3].facts[3] (step \"skipped\", fact \"Checks to B\")": "6da70f673a322273e661f0043a0e14e26a46cc7bcaa56be66003015b97a7ee76",
    "units[0].steps[3].events[0] (event \"s4-req-a\")": "523288bec2d3c086870e35ffd133f183ed180dce59e74ac2f7ac1eff7b092bcf",
    "units[0].steps[3].events[1] (event \"s4-a2\")": "dd8ff07c3fded45fe883f2a10cce4d202bcac5151789b30026806a7be239b740",
    "units[0].steps[3].events[2] (event \"s4-req-c\")": "a98ca63c5231928a2151b057adf39a56a220601b69b531219c786577ddbdc345",
    "units[0].steps[3].events[3] (event \"s4-c2\")": "d74d3e9bde143976dddb063a0bab45f3f8869c33418c83ebfea5012284df3f4f",
    "units[0].steps[3].events[4] (event \"s4-req-a3\")": "dc077a31ea86ae87910e8e1061f3eb6a6d4e8c6a5fd3484b0b2263a9f0a15982",
    "units[0].steps[3].events[5] (event \"s4-a3\")": "99efb3f60497aba268ece322c9dfba62c247977af502d3d5e3e1f1a1ca2ea703",
    "units[0].steps[3].events[6] (event \"s4-chk-b\")": "7f21afcec8c94a24665c486e7539fc992d3066036e9054174e24dff750d0c83e",
    "units[0].steps[3].events[7] (event \"s4-quiet\")": "8a4b9dbf047f7fbf3a4255856ef60af87cacfad188d8854207f8f44229e28856",
    "units[0].steps[4] (step \"healthy-again\")": "acac6d89ceb5949f7053066005f5dca5a36fa42920dfc4ef8d5d0ea1f349b995",
    "units[0].steps[4].facts[0] (step \"healthy-again\", fact \"B is healthy after\")": "d2622469bea1a3ce4f49c3431bc1fec3f46b4406e6a709a8f9ffb689a41dd829",
    "units[0].steps[4].facts[1] (step \"healthy-again\", fact \"The next request\")": "6cce7901858cd29ff881918d2367ec7136746bea04fbb118e36d9799a8e9207d",
    "units[0].steps[4].facts[2] (step \"healthy-again\", fact \"The pool\")": "2bbc001d0a1895463edee99fda487c9c6f8888ad1cf660444cbc02e6ac74aa7c",
    "units[0].steps[4].events[0] (event \"s5-chk-1\")": "7f21afcec8c94a24665c486e7539fc992d3066036e9054174e24dff750d0c83e",
    "units[0].steps[4].events[1] (event \"s5-ok-1\")": "baf9b65ecf5617beb42b89879a68348c40f34019c302cfbe35d431840179674f",
    "units[0].steps[4].events[2] (event \"s5-b1\")": "7cbe8500ecf103df0a4c4c7e478d705e18f1b1d8f3f164a6e41fbc3a6c71c2c6",
    "units[0].steps[4].events[3] (event \"s5-chk-2\")": "7f21afcec8c94a24665c486e7539fc992d3066036e9054174e24dff750d0c83e",
    "units[0].steps[4].events[4] (event \"s5-ok-2\")": "baf9b65ecf5617beb42b89879a68348c40f34019c302cfbe35d431840179674f",
    "units[0].steps[4].events[5] (event \"s5-b2\")": "439fbaeff3ea099b7119d35cee38199f27f67886dd4fd4c974f0a25946a4de1a",
    "units[0].steps[4].events[6] (event \"s5-req-b\")": "44e493696695a90f7df7baf2e498ab1a94d1b688cc8ec17b5bd4da2e003480fa",
    "units[0].steps[4].events[7] (event \"s5-b3\")": "3af2ec96bb7c17e6baa4921b87c27571395d6e9ce35b3598fbc2931b3f8bdb8c",
    "units[0].steps[0].deep[0] (step \"one-address\", Go deeper)": "9f25202f9051229118083fef45a3dc7faa5479d9246ab0b5609ba2f434cdeb43",
    "units[0].steps[1].deep[0] (step \"spread\", Go deeper)": "d399cca8ac4fcb33d6df64eef8812ee20957d59efd22960c55c1fbfa3deee7e3",
    "units[0].steps[2].deep[0] (step \"health-check-fails\", Go deeper)": "1ea08146df9b3f5bcb2a29aa388ccd1c5a1bdb2478990c79b3662e08c5d4e5e7",
    "units[0].steps[3].deep[0] (step \"skipped\", Go deeper)": "df5be2d7625b2f45313e5c8942bcf946c2319b5c9e4d159820ba54ec0d30d9a7",
    "units[0].steps[4].deep[0] (step \"healthy-again\", Go deeper)": "98b4d68dc18d3f190d509bf4f92c5ce294ee5dca14333e49db291d3fb473fd46",
    "units[0].learn.lead[0] (\"lead-1\")": "54651d552ef5dc14067216103b1d94c241a96ce9a7ef8b42b4c67e97a7cf2816",
    "units[0].learn.lead[1] (\"lead-2\")": "d652d4db72efe4291e12bbaae0136bd938dbca4e56c2075086b9ebf4bc994bd0",
    "units[0].learn.lead[2] (\"lead-3\")": "afbedaacdac402ae9a908cce5933c40aa1bb3c2a354142f93679618a48d8dc08",
    "units[0].learn.terms[0] (\"term-load-balancer\")": "7d955b59d24fb1be578ad84767b54198a0d2f8e82c277d2a2056c7b9b8d77ab5",
    "units[0].learn.terms[1] (\"term-pool\")": "e63428539ae12fae1efd92621530bff74d58042bda8605987aafe8246f8a6fbe",
    "units[0].learn.terms[2] (\"term-health-check\")": "a39fe2effc75325a6720f813942eca38079d5f339c3250df734f3dfe406ebd9d",
    "units[0].learn.terms[3] (\"term-unhealthy\")": "f47eed2efb90daa54bd71aaa7e1c87aa555897de3f0327ebfb282afd1fb186e3",
    "units[0].learn.terms[4] (\"term-round-robin\")": "74958835177e2e603e5c6f40ea63f2f1574f4a24da10b7187a20f5068e331c31",
    "units[0].learn.terms[5] (\"term-least-requests\")": "c5243741af1f6e7122c200c3e3bd9431e5cf0970eb114fcccc68688e0589fcc6",
    "units[0].learn.terms[6] (\"term-hash\")": "a1d8e994b4887fafedb7dcb9adb230fce4a919bda18a1997b8dfac7cde81a06d",
    "units[0].learn.pattern (\"pattern\")": "0ea5fd1fa9910f5bb6005fd3744a72d25e9b09f78638681a57a790582d43ca68",
    "units[0].learn.why[0] (\"why-1\")": "e1692454773f8b8c4c3afa40bb89081b7cb9a59fbdd87cfdd6403bd9f5055080",
    "units[0].learn.why[1] (\"why-2\")": "8e6122cd51cafc807ecb04bb7dfff9e1adcb6527f7b35b07bbc26d5c7ac0f8ea",
    "units[0].learn.deep[0] (\"deep-layers\", Learn's Go deeper)": "4640043f8e8891b86684b06a321d53e8be472aebb5667cb653278a5102f01fb3",
    "units[0].learn.deep[1] (\"deep-firewall\", Learn's Go deeper)": "632b8773a9f80df6579b1c886a8783ade71e2d568fa2bee26d3385d2d1ab4e51",
    "units[0].learn.deep[2] (\"deep-open\", Learn's Go deeper)": "d1aafc85a78ee3a542467b64e78903a50a33b38e545ae23cef153810f9eb3b7b",
    "units[0].learn.facts[0] (\"fact-what\")": "4b5d82478593f412a4f4f9a68b5e5325bc58c181a86afc538e12df2916e6fd24",
    "units[0].learn.facts[1] (\"fact-address\")": "ac62a85604a0c7df786736a147442a8eed817186d1fa77c04dfd3c96fdfb9aba",
    "units[0].learn.facts[2] (\"fact-private\")": "866ce9b6cea3311e0057066837ed09185d568208094bb0290aa1800c4a29e657",
    "units[0].learn.facts[3] (\"fact-methods\")": "3bceb3bc9173f807eedbc0d45a8540067ee7c42346a360549d05e667ff96662a",
    "units[0].learn.facts[4] (\"fact-checks\")": "52486d3219e35e65f23064292d56b55ae061ee293dca6d962c331d157557d185",
    "units[0].learn.facts[5] (\"fact-threshold\")": "0bb25d5dd9905a265d0dc260c1869ed6136f03f5981334988380a29b96e9b667",
    "units[0].learn.facts[6] (\"fact-unhealthy\")": "fda8072c999dbe12177e7fed5bece2bc4cd250c6091997c786e8b7d7de2a5420",
    "units[0].learn.facts[7] (\"fact-back\")": "5ed141a18a063e4620da4f4684e2fe6c539d59b3756aefaa579f3a8ffda69f3b",
    "units[0].learn.facts[8] (\"fact-here\")": "9c2591fa016150f6a885da9b0a37393c85c50d1f8afbcef8b75492cfb7e91d0a",
    "units[0].learn.facts[9] (\"fact-osi\")": "d5377669619b0e2c59f2d966bc427fd26bd27206eeb58ca4968defa07f6604b4",
    "units[0].practice[0].options[0] (question \"skipped\")": "f1d04e98ab074d8c60c03efeef8ff36a3547f47c557e29ea3299e4396ca38ab9",
    "units[0].practice[0].options[1] (question \"skipped\")": "27bb3ddbedf783c188adad11e901cee6c1673444c0039b53778c5a62c7310d2f",
    "units[0].practice[0].options[2] (question \"skipped\")": "3a8681d57a692f1d405687aa0299adac6579e968eee988f94cdebafd6b60cb6e",
    "units[0].practice[1].options[0] (question \"in-turn\")": "f17a4ceebc1e0411959f6b40a031871dc88de21d5f9c58719b9eaaa0dc2d5853",
    "units[0].practice[1].options[1] (question \"in-turn\")": "594e0a810605459ee753451b1cf4eb621dd43a92c80612b0fccf85f05f839c01",
    "units[0].practice[0].prompt (question \"skipped\")": "7698f2ba1855568c09408e1f31dc5ab9366af6b136f0be36992dabe13c1d3917",
    "units[0].practice[1].prompt (question \"in-turn\")": "94004de0c5e316886666503e6d463315c093d38c201b373c7f84ee2915668f5b"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: load-balancers

Full check of the Load Balancers lesson, 104 items: 104 ✅, 0 ⚠️, 0 ❌. Every source was fetched from its publisher on 2026-11-15 and read in this run. The lesson's citations are vendor documentation from three independent publishers (Microsoft, Google and Cloudflare) plus RFC 9110; every vendor claim below is confirmed by at least two of those publishers.

## 1. The claims

### units[0].osi — ✅

- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- `cloudflare-lb-proxy-modes` §Layer 4 load balancing
  > Layer 4 load balancers route traffic by forwarding traffic to certain ports or IP addresses.
- `cloudflare-lb-proxy-modes` §Layer 7 load balancing
  > Layer 7 load balancers direct traffic to specific endpoints based on information present in each HTTP/HTTPS request
- `google-lb-overview` §Network Load Balancers
  > Network Load Balancers are Layer 4 load balancers that can handle TCP, UDP, or other IP protocol traffic.
- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers
- Note: the badge says a load balancer sits at layer 4 or layer 7. Microsoft and Google, two independent publishers, each place one kind of balancer at layer 4 and another at layer 7, and Cloudflare does the same. No source names a third layer for a proxy or pass-through balancer; Cloudflare also offers DNS-only balancing, a different technique the badge leaves out.
- Note: currency: all three vendor pages are live and describe current products (Microsoft pages updated in August and September 2026, Google's on 2026-11-10, Cloudflare's in April 2026).

### units[0].steps[0].deep[0] (step "one-address", Go deeper) — ✅

- `microsoft-azure-lb-components` §Frontend IP configuration
  > The frontend IP configuration is the IP address of your Azure Load Balancer and the point of contact for clients.
- `microsoft-azure-lb-components` §Backend pool
  > VMs don't need a public IP address to attach to the backend pool of a public load balancer.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > a single anycast IP address is the frontend for all of your backend instances
- `cloudflare-lb-proxy-modes` §Benefits
  > Protects endpoints from DDoS attacks by hiding their IP addresses.
  > … Supports private IP addresses with Private Network Load Balancing.
- Note: the name "frontend" for the balancer's address is given by Microsoft and Google; that the servers need no public address is stated by Microsoft and confirmed by Cloudflare, whose proxied balancer hides the endpoints' addresses and supports private ones. "Frontend" is the vendors' word; the claim leaves out that a balancer can have several frontend addresses.
- Note: currency: all pages live and current.

### units[0].steps[1].deep[0] (step "spread", Go deeper) — ✅

- `microsoft-azure-lb-distribution` §Hash based
  > Azure Load Balancer uses a five-tuple hash based distribution mode by default.
  > The five-tuple consists of:
  > Source IP
  > Source port
  > Destination IP
  > Destination port
  > Protocol type
  > The hash is used to route traffic to healthy backend instances within the backend pool. The algorithm provides stickiness only within a transport session.
- `google-backend-service` §Session affinity
  > Session affinity lets you control how the load balancer selects backends for new connections in a predictable way as long as the number of healthy backends remains constant.
  > … By default, all Google Cloud load balancers select backends by using a five-tuple hash
- Note: both publishers name the same five values and use their hash to pick the backend; Microsoft says the result sticks for the transport session, and Google that the choice is predictable while the healthy backends stay the same. The claim leaves out that a change in the pool can move later connections, and calls hashing "mixing into a number", a fair everyday description.
- Note: currency: both pages live and current.

### units[0].steps[2].deep[0] (step "health-check-fails", Go deeper) — ✅

- `microsoft-azure-lb-probes` §Probe properties
  > Interval of health probe. The amount of time (in seconds) between different probes on two consecutive health check attempts to the virtual machine
  > Threshold
  > Threshold of the health probe. The number of times the health probe needs to succeed or fail in order to allow or deny traffic from being delivered to the virtual machine
- `google-health-checks` §Health checks overview
  > Based on a configurable number of sequential successful or failed probes, an overall health state is computed for each backend.
- `google-health-checks` §Probes
  > When you create a health check or a legacy health check, you specify the following flags or accept their default values.
- `microsoft-azure-lb-probes` §Probe protocol
  > TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port.
- `google-health-checks` §Success criteria for SSL and TCP
  > For TCP health checks, a health check prober must successfully open a TCP connection to the backend before the health check timeout.
- Note: Microsoft and Google both make the interval and the count of consecutive results a setting, and both offer a check that only opens a TCP connection. Google's table also shows that such a check sends no request string by default.
- Note: currency: both pages live and current.

### units[0].steps[3].deep[0] (step "skipped", Go deeper) — ✅

- `microsoft-azure-lb-probes` §Probe down behavior
  > New TCP connections succeed to remaining healthy backend endpoint. Established TCP connections to this backend endpoint continue.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections; however, existing connections are *not* immediately terminated. Instead, the connection remains open until a timeout occurs or until traffic is dropped.
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it. However, existing connections (including long-lived WebSocket connections) are not terminated — they remain open until they close naturally.
- Note: three publishers agree. The word "usually" covers the exceptions they list, such as Azure moving existing UDP flows to another instance.
- Note: currency: all pages live and current.

### units[0].steps[4].deep[0] (step "healthy-again", Go deeper) — ✅

- `microsoft-azure-lb-distribution` §Session persistence
  > Session persistence is also known session affinity, source IP affinity, or client IP affinity.
  > … Client IP (2-tuple) - Specifies that successive requests from the same client IP address are handled by the same backend instance.
- `google-backend-service` §Session affinity
  > This is useful for applications that need multiple requests from a given user to be directed to the same backend or endpoint.
- Note: both name it session affinity and describe it as an option to set. Google adds that it is best-effort; the claim's "can be set" leaves that out harmlessly.
- Note: currency: both pages live and current.

### units[0].learn.lead[0] ("lead-1") — ✅

- `microsoft-azure-lb` §Introduction
  > Azure Load Balancer is a cloud service that distributes incoming network traffic across backend virtual machines (VMs) or virtual machine scale sets (VMSS).
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > It's the single point of contact for clients. The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances.
- `microsoft-azure-lb-components` §Backend pool
  > The backend pool is the group of virtual machines or instances in a virtual machine scale set that serves the incoming request.
- `google-lb-overview` §Cloud Load Balancing overview
  > A load balancer distributes user traffic across multiple instances of your applications. By spreading the load, load balancing reduces the risk that your applications experience performance issues.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > a single anycast IP address is the frontend for all of your backend instances
- `cloudflare-lb-components` §Pools
  > a pool can be a group of several endpoints
- `microsoft-app-gateway-how` §How an application gateway routes a request
  > When the application gateway selects the backend pool, it sends the request to one of the healthy backend servers in the pool (y.y.y.y).
- Note: Microsoft and Google independently state each part: one address in front, a group of servers called the pool, and each request passed to one of them to spread the load. A layer 4 balancer passes connections (flows) rather than single requests, and a balancer may have more than one frontend address; the claim leaves these out.
- Note: currency: all pages live and current.

### units[0].learn.lead[1] ("lead-2") — ✅

- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > It sends a request to the instances to check if they're available and responding to requests.
  > … When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- `microsoft-azure-lb-probes` §Probe interval & timeout
  > The interval value determines how frequently the health probe checks for a response from your backend pool instances.
  > … If the health probe succeeds on the next check, Azure Load Balancer marks your backend pool instances as healthy.
- `google-health-checks` §Health state
  > Previously unhealthy backends can become healthy if they are able to meet the healthy threshold again.
  > … Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-components` §Monitors
  > the monitor will issue health monitor requests to your endpoints at regular intervals.
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- Note: confirmed by Microsoft, Google and Cloudflare. The claim leaves out the last-resort case when every server is unhealthy (some Google balancers then spread traffic among unhealthy backends) and balancers set up with no health check at all.
- Note: currency: all pages live and current.

### units[0].learn.terms[0] ("term-load-balancer") — ✅

- `microsoft-azure-lb` §Introduction
  > Azure Load Balancer is a cloud service that distributes incoming network traffic across backend virtual machines (VMs) or virtual machine scale sets (VMSS).
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > It's the single point of contact for clients.
- `google-lb-overview` §Cloud Load Balancing overview
  > A load balancer distributes user traffic across multiple instances of your applications.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > a single anycast IP address is the frontend for all of your backend instances
- Note: Microsoft and Google each state both halves of the idea. "Each new request" simplifies a layer 4 balancer, which distributes connections.
- Note: currency: both pages live and current.

### units[0].learn.terms[1] ("term-pool") — ✅

- `microsoft-azure-lb-components` §Backend pool
  > The backend pool is the group of virtual machines or instances in a virtual machine scale set that serves the incoming request.
- `cloudflare-lb-components` §Pools
  > a pool can be a group of several endpoints
- Note: Microsoft gives the name "backend pool" and Cloudflare the name "pool", each for the group of servers the balancer spreads work over. Cloudflare also allows a pool of one endpoint; the idea leaves that out.
- Note: currency: both pages live and current.

### units[0].learn.terms[2] ("term-health-check") — ✅

- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > An Azure Load Balancer health probe is a feature that detects the health status of your application instances. It sends a request to the instances to check if they're available and responding to requests.
- `microsoft-azure-lb-probes` §Probe protocol
  > Probe endpoint doesn't respond at all during the minimum of the probe interval and 30-second timeout period.
- `google-health-checks` §Health checks overview
  > Each connection attempt is called a probe.
- `cloudflare-lb-health` §How an endpoint becomes unhealthy
  > Does the endpoint respond to the health monitor request at all? If so, does it respond quickly enough (as specified in the monitor's Timeout field)?
- `cloudflare-lb-components` §Monitors
  > the monitor will issue health monitor requests to your endpoints at regular intervals.
- Note: the name "probe" is Microsoft's and Google's; "health check" is Google's and Cloudflare's. The idea asks only whether the server answers in time; an HTTP check also wants the right answer, which the lesson's fact "A health check" adds.
- Note: currency: all pages live and current.

### units[0].learn.terms[3] ("term-unhealthy") — ✅

- `microsoft-azure-lb-probes` §Probe threshold
  > The probe threshold value is the number of times a health probe will need to succeed or fail consecutively in order for the probe to mark a backend instance as healthy or unhealthy, respectively.
- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- `google-health-checks` §Health state
  > Google Cloud considers backends to be unhealthy when the unhealthy threshold has been met. Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- Note: three publishers agree. Leaves out the last-resort case when all backends are unhealthy.
- Note: currency: all pages live and current.

### units[0].learn.terms[4] ("term-round-robin") — ✅

- `microsoft-app-gateway-how` §How an application gateway routes a request
  > If the backend pool contains multiple servers, the application gateway uses a round-robin algorithm to route the requests between healthy servers.
- `google-backend-service` §Load balancing locality policy
  > ROUND_ROBIN (default): This is the default load balancing locality policy setting in which the load balancer selects a healthy backend in round robin order.
- Note: Microsoft and Google both describe round robin over the healthy servers.
- Note: currency: both pages live and current.

### units[0].learn.terms[5] ("term-least-requests") — ✅

- `cloudflare-lb-lor` §Least Outstanding Requests
  > Least Outstanding Requests steering allows you to route traffic to endpoints that currently have the lowest number of outstanding requests.
  > … Endpoints with more pending requests are weighted proportionately less in relation to others.
- `google-backend-service` §Load balancing locality policy
  > LEAST_REQUEST: An O(1) algorithm in which the load balancer selects two random healthy hosts and picks the host which has fewer active requests.
- Note: the name is Cloudflare's; Google's policy of the same idea is called LEAST_REQUEST. "Favouring" matches both: Cloudflare weights by in-flight requests and Google picks the less busy of two.
- Note: currency: both pages live and current.

### units[0].learn.terms[6] ("term-hash") — ✅

- `microsoft-azure-lb-distribution` §Hash based
  > Azure Load Balancer uses a five-tuple hash based distribution mode by default.
  > … The algorithm provides stickiness only within a transport session.
- `google-backend-service` §Session affinity
  > By default, all Google Cloud load balancers select backends by using a five-tuple hash
- Note: both name the five-tuple hash and list the same five values (both addresses, both ports, the protocol).
- Note: currency: both pages live and current.

### units[0].learn.pattern ("pattern") — ✅

- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances. These flows are distributed according to configured load-balancing rules and health probes.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > a single anycast IP address is the frontend for all of your backend instances
- `microsoft-app-gateway-how` §How an application gateway routes a request
  > it sends the request to one of the healthy backend servers in the pool (y.y.y.y). The health of the server is determined by a health probe.
- `google-backend-service` §Load balancing locality policy
  > the load balancer selects a healthy backend in round robin order.
- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- `microsoft-azure-lb-probes` §Probe threshold
  > The probe threshold value is the number of times a health probe will need to succeed or fail consecutively in order for the probe to mark a backend instance as healthy or unhealthy, respectively.
- `google-health-checks` §Health state
  > Previously unhealthy backends can become healthy if they are able to meet the healthy threshold again.
- `cloudflare-lb-health` §How an endpoint becomes unhealthy
  > Health checks are requests issued by a monitor at regular interval
- Note: each of the five names is stated by Microsoft and by Google (arrive at one frontend address; pass to a healthy server; check the servers; skip an unhealthy one; return after the healthy threshold). The note's claim that the checks run alongside the requests matches the regular-interval checks.
- Note: currency: all pages live and current.

### units[0].learn.why[0] ("why-1") — ✅

- `microsoft-azure-lb-components` §Backend pool
  > To scale cost-effectively and meet high volumes of incoming traffic, add more instances to the backend pool.
- `microsoft-azure-lb` §Why use Azure Load Balancer?
  > By using Azure Load Balancer, you can scale your applications and create highly available services.
- `google-lb-overview` §Cloud Load Balancing overview
  > By spreading the load, load balancing reduces the risk that your applications experience performance issues.
- `cloudflare-lb-lor` §Least Outstanding Requests
  > Least Outstanding Requests steering is best to use if your endpoints are easily overwhelmed by a spike in concurrent requests.
- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers that enable you to run and scale your services behind an anycast IP address.
- Note: that a server can be overwhelmed is stated by Cloudflare and, as performance trouble from load, by Google; that a site grows by adding servers behind the balancer is stated by Microsoft and by Google (scaling services behind one address).
- Note: currency: all pages live and current.

### units[0].learn.why[1] ("why-2") — ✅

- `microsoft-azure-lb` §Why use Azure Load Balancer?
  > By using Azure Load Balancer, you can scale your applications and create highly available services.
- `microsoft-azure-lb` §Core capabilities
  > Health monitoring: Use health probes to ensure traffic is only sent to healthy instances.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > It provides cross-region load balancing, including automatic multi-region failover, which moves traffic to failover backends if your primary backends become unhealthy.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- Note: Microsoft, Google and Cloudflare each say traffic goes only to the healthy servers, so the others carry on serving. The claim leaves out that the remaining servers must have room for the extra load.
- Note: currency: all pages live and current.

### units[0].learn.deep[0] ("deep-layers", Learn's Go deeper) — ✅

- `microsoft-azure-lb` §Introduction
  > Use Azure Load Balancer when you need to distribute Layer 4 TCP or UDP traffic across VMs or virtual machine scale sets.
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > For example, you can route requests with /images in the URL to servers optimized for images, while routing /video requests to servers optimized for video content.
- `cloudflare-lb-proxy-modes` §Layer 4 load balancing
  > Layer 4 load balancers route traffic by forwarding traffic to certain ports or IP addresses.
- `cloudflare-lb-proxy-modes` §Layer 7 load balancing
  > Layer 7 load balancers direct traffic to specific endpoints based on information present in each HTTP/HTTPS request (HTTP headers, URI, cookies, type of data, etc.).
- `google-lb-overview` §Network Load Balancers
  > Network Load Balancers are Layer 4 load balancers that can handle TCP, UDP, or other IP protocol traffic.
- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers
- Note: layer 4 balancing of TCP or UDP is stated by Microsoft and Google. Layer 7 balancers reading each request and routing by its path are stated by Microsoft (the /images and /video example) and Cloudflare (routing by the URI). Google's layer 4 balancers also carry some other IP protocols, which the claim leaves out.
- Note: currency: all pages live and current.

### units[0].learn.deep[1] ("deep-firewall", Learn's Go deeper) — ✅

- `microsoft-azure-lb-probes` §Probe source IP address
  > If you don't allow the source IP of the probe in your firewall policies, the health probe fails as it is unable to reach your instance. In turn, Azure Load Balancer marks your instance as -down- due to the health probe failure.
- `google-health-checks` §Importance of firewall rules
  > If you don't have ingress allow firewall rules that permit the health check, the implied deny ingress rule blocks inbound traffic. When probers can't contact your backends, the load balancer considers your backends to be unhealthy.
- Note: Microsoft and Google independently state both sentences.
- Note: currency: both pages live and current.

### units[0].learn.deep[2] ("deep-open", Learn's Go deeper) — ✅

- `microsoft-azure-lb-probes` §Probe down behavior
  > New TCP connections succeed to remaining healthy backend endpoint. Established TCP connections to this backend endpoint continue.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections; however, existing connections are *not* immediately terminated. Instead, the connection remains open until a timeout occurs or until traffic is dropped.
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it. However, existing connections (including long-lived WebSocket connections) are not terminated — they remain open until they close naturally.
- Note: three publishers agree; "usually" covers exceptions such as Azure moving UDP flows.
- Note: currency: all pages live and current.

### units[0].learn.facts[0] ("fact-what") — ✅

- `microsoft-azure-lb` §Introduction
  > Azure Load Balancer is a cloud service that distributes incoming network traffic across backend virtual machines (VMs) or virtual machine scale sets (VMSS).
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances.
- `microsoft-app-gateway-how` §How an application gateway routes a request
  > When the application gateway selects the backend pool, it sends the request to one of the healthy backend servers in the pool (y.y.y.y).
- `google-lb-overview` §Cloud Load Balancing overview
  > A load balancer distributes user traffic across multiple instances of your applications.
- Note: Microsoft and Google agree. A layer 4 balancer passes connections rather than single requests; "each new request" is the beginner's view.
- Note: currency: all pages live and current.

### units[0].learn.facts[1] ("fact-address") — ✅

- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > It's the single point of contact for clients. The service distributes inbound flows that arrive at the load balancer's frontend to backend pool instances.
- `microsoft-azure-lb-components` §Frontend IP configuration
  > The frontend IP configuration is the IP address of your Azure Load Balancer and the point of contact for clients.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > a single anycast IP address is the frontend for all of your backend instances
- `cloudflare-lb-proxy-modes` §Benefits
  > Protects endpoints from DDoS attacks by hiding their IP addresses.
- Note: Microsoft and Google both give the one address and the name frontend. Leaves out that a balancer can have several frontends, and Cloudflare's DNS-only mode, which hands out the endpoints' own addresses.
- Note: currency: all pages live and current.

### units[0].learn.facts[2] ("fact-private") — ✅

- `microsoft-azure-lb-components` §Backend pool
  > VMs don't need a public IP address to attach to the backend pool of a public load balancer.
- `microsoft-azure-lb-components` §Frontend IP configuration
  > A public load balancer maps the public IP and port of incoming traffic to the private IP and port of the VM.
- `cloudflare-lb-proxy-modes` §Benefits
  > Supports private IP addresses with Private Network Load Balancing.
- `cloudflare-lb-components` §Endpoints
  > Examples of endpoints include origins, hostnames, private or public IP addresses, virtual IP addresses (VIPs), servers, and other dedicated hardware boxes.
- Note: Microsoft and Cloudflare both state that the servers behind the balancer can have private addresses.
- Note: currency: all pages live and current.

### units[0].learn.facts[3] ("fact-methods") — ✅

- `microsoft-app-gateway-how` §How an application gateway routes a request
  > the application gateway uses a round-robin algorithm to route the requests between healthy servers.
- `google-backend-service` §Load balancing locality policy
  > The load balancing locality policy is configured per-backend service. The following settings are available:
  > ROUND_ROBIN (default): This is the default load balancing locality policy setting in which the load balancer selects a healthy backend in round robin order.
  > LEAST_REQUEST: An O(1) algorithm in which the load balancer selects two random healthy hosts and picks the host which has fewer active requests.
  > RING_HASH: This algorithm implements consistent hashing to backends.
- `cloudflare-lb-lor` §Least Outstanding Requests
  > Least Outstanding Requests steering allows you to route traffic to endpoints that currently have the lowest number of outstanding requests.
- `microsoft-azure-lb-distribution` §Hash based
  > Azure Load Balancer uses a five-tuple hash based distribution mode by default.
- `google-backend-service` §Session affinity
  > By default, all Google Cloud load balancers select backends by using a five-tuple hash
- Note: each method is stated by two publishers: round robin (Microsoft, Google), fewer requests in progress (Cloudflare, Google), hash of the connection (Microsoft, Google). "For example" keeps the list open.
- Note: currency: all pages live and current.

### units[0].learn.facts[4] ("fact-checks") — ✅

- `microsoft-azure-lb-probes` §Probe protocol
  > TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port.
  > … HTTP and HTTPS issue an HTTP GET with the specified path.
  > … Probe endpoint returns an HTTP response code other than 200 (for example, 403, 404, or 500).
  > … Probe endpoint doesn't respond at all during the minimum of the probe interval and 30-second timeout period.
- `google-health-checks` §Success criteria for HTTP, HTTPS, and HTTP/2
  > HTTP, HTTPS, and HTTP/2 health checks always require an HTTP 200 (OK) response code to be received before the health check timeout.
- `google-health-checks` §Success criteria for SSL and TCP
  > For TCP health checks, a health check prober must successfully open a TCP connection to the backend before the health check timeout.
- `cloudflare-lb-health` §How an endpoint becomes unhealthy
  > Does the endpoint respond to the health monitor request at all? If so, does it respond quickly enough (as specified in the monitor's Timeout field)?
- Note: Microsoft and Google both describe the two kinds of check (a new connection, or a page request that must return 200 OK) and the timeout. Leaves out other check types (TLS, gRPC) and checks that also test the page's content.
- Note: currency: all pages live and current.

### units[0].learn.facts[5] ("fact-threshold") — ✅

- `microsoft-azure-lb-probes` §Probe properties
  > Threshold of the health probe. The number of times the health probe needs to succeed or fail in order to allow or deny traffic from being delivered to the virtual machine
- `microsoft-azure-lb-probes` §Probe threshold
  > The probe threshold value is the number of times a health probe will need to succeed or fail consecutively in order for the probe to mark a backend instance as healthy or unhealthy, respectively.
- `google-health-checks` §Health checks overview
  > Based on a configurable number of sequential successful or failed probes, an overall health state is computed for each backend.
- `google-health-checks` §Health state
  > The unhealthy threshold specifies the number of sequential failed probe results for a previously healthy backend^2 to be considered unhealthy.
- `cloudflare-lb-health` §How an endpoint becomes unhealthy
  > For greater accuracy and consistency when changing endpoint health status, you can also set the consecutive_up and consecutive_down parameters via the Create Monitor API endpoint.
- Note: three publishers agree. "Usually" covers the exception Microsoft gives, where an explicit non-200 answer to an HTTP probe marks it down at once.
- Note: currency: all pages live and current.

### units[0].learn.facts[6] ("fact-unhealthy") — ✅

- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- `microsoft-azure-lb` §Core capabilities
  > Health monitoring: Use health probes to ensure traffic is only sent to healthy instances.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- `microsoft-app-gateway-how` §How an application gateway routes a request
  > the application gateway uses a round-robin algorithm to route the requests between healthy servers.
- Note: three publishers agree. Leaves out the last-resort behaviour when every server is unhealthy.
- Note: currency: all pages live and current.

### units[0].learn.facts[7] ("fact-back") — ✅

- `microsoft-azure-lb-probes` §Probe interval & timeout
  > The interval value determines how frequently the health probe checks for a response from your backend pool instances.
  > … If the health probe succeeds on the next check, Azure Load Balancer marks your backend pool instances as healthy.
- `microsoft-azure-lb-probes` §Probe threshold
  > The probe threshold value is the number of times a health probe will need to succeed or fail consecutively in order for the probe to mark a backend instance as healthy or unhealthy, respectively.
- `google-health-checks` §Health state
  > The healthy threshold specifies the number of sequential successful probe results for a previously unhealthy backend^1 to be considered healthy. Previously unhealthy backends can become healthy if they are able to meet the healthy threshold again.
  > … Healthy backends are eligible to receive new connections.
- `cloudflare-lb-health` §How an endpoint becomes unhealthy
  > The same applies — from unhealthy to healthy — for consecutive_up.
- Note: three publishers agree that checks continue and a set number of consecutive passes brings a server back.
- Note: currency: all pages live and current.

### units[0].learn.facts[8] ("fact-here") — ✅

- `rfc-9110` §4.2.1
  > If the port subcomponent is empty or not given, TCP port 80 (the reserved port for WWW services) is the default.
- Note: defining standard: RFC 9110 §4.2.1 defines the "http" URI scheme, including its default TCP port, 80. The fact describes the lesson's own example, plain HTTP requests for web pages sent to that default port.
- Note: currency: RFC 9110 is an Internet Standard; the RFC Editor lists it as neither obsoleted nor updated.

### units[0].learn.facts[9] ("fact-osi") — ✅

- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- `microsoft-app-gateway` §What is Azure Application Gateway?
  > Application Gateway operates at the application layer (OSI layer 7)
- `cloudflare-lb-proxy-modes` §Layer 4 load balancing
  > Layer 4 load balancers route traffic by forwarding traffic to certain ports or IP addresses.
- `cloudflare-lb-proxy-modes` §Layer 7 load balancing
  > Layer 7 load balancers direct traffic to specific endpoints based on information present in each HTTP/HTTPS request
- `google-lb-overview` §Network Load Balancers
  > Network Load Balancers are Layer 4 load balancers that can handle TCP, UDP, or other IP protocol traffic.
- `google-lb-overview` §Application Load Balancers
  > Application Load Balancers are proxy-based Layer 7 load balancers
- Note: as for the OSI badge: Microsoft and Google each place one kind of balancer at layer 4 and another at layer 7.
- Note: currency: all pages live and current.

### units[0].practice[0].options[0] (question "skipped") — ✅

- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- Note: the right answer, and its feedback is correct for it; three publishers agree.
- Note: currency: all pages live and current.

### units[0].practice[0].options[1] (question "skipped") — ✅

- `microsoft-app-gateway-how` §How an application gateway routes a request
  > the application gateway uses a round-robin algorithm to route the requests between healthy servers.
- `google-backend-service` §Load balancing locality policy
  > the load balancer selects a healthy backend in round robin order.
- `microsoft-azure-lb-probes` §Azure Load Balancer health probes
  > When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance.
- Note: a wrong option, and its feedback correctly says why; Microsoft and Google agree that round robin skips the unhealthy server.
- Note: currency: all pages live and current.

### units[0].practice[0].options[2] (question "skipped") — ✅

- `microsoft-azure-lb` §Why use Azure Load Balancer?
  > By using Azure Load Balancer, you can scale your applications and create highly available services.
- `google-health-checks` §Health state
  > Unhealthy backends are not eligible to receive new connections
- `cloudflare-lb-maintenance` §Perform planned maintenance
  > When an endpoint becomes unhealthy, Cloudflare Load Balancing stops routing new requests to it.
- `google-lb-overview` §Key features of Cloud Load Balancing
  > It provides cross-region load balancing, including automatic multi-region failover, which moves traffic to failover backends if your primary backends become unhealthy.
- Note: a wrong option, and its feedback correctly says the other servers keep serving; Microsoft (high availability), Google and Cloudflare agree.
- Note: currency: all pages live and current.

### units[0].practice[1].options[0] (question "in-turn") — ✅

- `microsoft-app-gateway-how` §How an application gateway routes a request
  > the application gateway uses a round-robin algorithm to route the requests between healthy servers.
- `google-backend-service` §Load balancing locality policy
  > The load balancing locality policy is configured per-backend service.
- `cloudflare-lb-lor` §Least Outstanding Requests
  > Least Outstanding Requests steering allows you to route traffic to endpoints that currently have the lowest number of outstanding requests.
- `microsoft-azure-lb-distribution` §Hash based
  > Azure Load Balancer uses a five-tuple hash based distribution mode by default.
- `google-backend-service` §Session affinity
  > By default, all Google Cloud load balancers select backends by using a five-tuple hash
- `microsoft-azure-lb-distribution` §Session persistence
  > Session persistence mode has two configuration types:
- Note: the right answer; each method is stated by two publishers as for fact-methods, and both Microsoft and Google make the method a setting, which supports the feedback's "and on how it's set up".
- Note: currency: all pages live and current.

### units[0].practice[1].options[1] (question "in-turn") — ✅

- `cloudflare-lb-lor` §Least Outstanding Requests
  > Least Outstanding Requests steering allows you to route traffic to endpoints that currently have the lowest number of outstanding requests.
- `google-backend-service` §Load balancing locality policy
  > LEAST_REQUEST: An O(1) algorithm in which the load balancer selects two random healthy hosts and picks the host which has fewer active requests.
- `microsoft-azure-lb-distribution` §Hash based
  > Azure Load Balancer uses a five-tuple hash based distribution mode by default.
  > … The algorithm provides stickiness only within a transport session.
- `google-backend-service` §Session affinity
  > By default, all Google Cloud load balancers select backends by using a five-tuple hash
- Note: a wrong option, and its feedback correctly names the other methods; each is stated by two publishers.
- Note: currency: all pages live and current.

## 2. The traced, example and analogy parts, and the unbacked items

### title — ✅

- Note: Unbacked: makes no claim beyond the lesson's cited parts and has no false premise.

### units[0].name — ✅

- Note: Unbacked: makes no claim beyond the lesson's cited parts and has no false premise.

### backing (the lesson's subtitle and summary) — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].backing (the unit's full name and purpose) — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].scene.backing (the scene) — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.
- Note: example.net and the RFC 1918 addresses 10.0.0.11 to 10.0.0.13 are example data; the legend's no-answer-in-time row traces to fact-checks.

### units[0].overview.hookBacking (the Overview hook) — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].overview.backing (the Overview description) — ✅

- Note: Analogy: one person directing each shopper to a till, and skipping a till whose light is off until it is back on, matches passing each request to a healthy server and returning a server once it passes again; it does not mislead.

### units[0].overview.facts[0] (Overview fact "Does") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].overview.facts[1] (Overview fact "Readers use") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].overview.facts[2] (Overview fact "Checks") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].overview.facts[3] (Overview fact "A failing server") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].overview.facts[4] (Overview fact "OSI layer") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0] (step "one-address") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.
- Note: the closing words, that server A sends you the page, add nothing beyond the Learn parts: a server answering the request it is passed is what lead-1's servers carrying the traffic and why-2's servers that keep serving mean. 203.0.113.80 and the 10.0.0.x addresses are example data (RFC 5737 and RFC 1918).

### units[0].steps[0].facts[0] (step "one-address", fact "Readers use") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0].facts[1] (step "one-address", fact "Behind it") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0].facts[2] (step "one-address", fact "The servers’ addresses") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0].facts[3] (step "one-address", fact "Your request went to") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0].events[0] (event "s1-req") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[0].events[1] (event "s1-a") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1] (step "spread") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].facts[0] (step "spread", fact "This balancer picks") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].facts[1] (step "spread", fact "Other ways") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].facts[2] (step "spread", fact "Each server has") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].events[0] (event "s2-req-b") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].events[1] (event "s2-b") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].events[2] (event "s2-req-c") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[1].events[3] (event "s2-c") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2] (step "health-check-fails") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.
- Note: the two missed checks are given as this balancer's setting; fact-threshold says the number is a setting, so the value is example data for it.

### units[0].steps[2].facts[0] (step "health-check-fails", fact "Checks") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].facts[1] (step "health-check-fails", fact "A check fails when") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].facts[2] (step "health-check-fails", fact "This balancer acts after") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].facts[3] (step "health-check-fails", fact "Server B") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[0] (event "s3-chk-a") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[1] (event "s3-ok-a") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[2] (event "s3-chk-b") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[3] (event "s3-quiet-1") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[4] (event "s3-b1") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[5] (event "s3-chk-b2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[6] (event "s3-quiet-2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[2].events[7] (event "s3-b2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3] (step "skipped") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].facts[0] (step "skipped", fact "Server B") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].facts[1] (step "skipped", fact "B’s turn") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].facts[2] (step "skipped", fact "Readers") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].facts[3] (step "skipped", fact "Checks to B") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[0] (event "s4-req-a") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[1] (event "s4-a2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[2] (event "s4-req-c") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[3] (event "s4-c2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[4] (event "s4-req-a3") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[5] (event "s4-a3") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[6] (event "s4-chk-b") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[3].events[7] (event "s4-quiet") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4] (step "healthy-again") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.
- Note: the two passed checks are given as this balancer's setting; fact-back says a set number of passes in a row brings a server back.

### units[0].steps[4].facts[0] (step "healthy-again", fact "B is healthy after") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].facts[1] (step "healthy-again", fact "The next request") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].facts[2] (step "healthy-again", fact "The pool") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[0] (event "s5-chk-1") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[1] (event "s5-ok-1") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[2] (event "s5-b1") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[3] (event "s5-chk-2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[4] (event "s5-ok-2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[5] (event "s5-b2") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[6] (event "s5-req-b") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].steps[4].events[7] (event "s5-b3") — ✅

- Note: Traced: says nothing beyond the Learn parts it traces to.

### units[0].learn.lead[2] ("lead-3") — ✅

- Note: Analogy: one person directing each shopper to a till, and skipping a till whose light is off until it is back on, matches passing each request to a healthy server and returning a server once it passes again; it does not mislead.

### units[0].practice[0].prompt (question "skipped") — ✅

- Note: Unbacked: makes no claim beyond the lesson's cited parts and has no false premise.

### units[0].practice[1].prompt (question "in-turn") — ✅

- Note: Unbacked: makes no claim beyond the lesson's cited parts and has no false premise.

## 3. The sources

All fetched from the publisher's own site on 2026-11-15.

- `cloudflare-lb-components`: Cloudflare Load Balancing docs, live, last updated April 2026; describes the current product. Current, checked 2026-11-15.
- `cloudflare-lb-health`: Cloudflare Load Balancing docs, live, last updated April 2026. Current, checked 2026-11-15.
- `cloudflare-lb-lor`: Cloudflare Load Balancing docs, live, last updated April 2026. Current, checked 2026-11-15.
- `cloudflare-lb-maintenance`: Cloudflare Load Balancing docs, live, last updated July 2026. Current, checked 2026-11-15.
- `cloudflare-lb-proxy-modes`: Cloudflare Load Balancing docs, live, last updated April 2026. Current, checked 2026-11-15.
- `google-backend-service`: Google Cloud documentation, live, last updated 2026-11-11. Current, checked 2026-11-15.
- `google-health-checks`: Google Cloud documentation, live, last updated 2026-11-10. Current, checked 2026-11-15.
- `google-lb-overview`: Google Cloud documentation, live, last updated 2026-11-10. Current, checked 2026-11-15.
- `microsoft-app-gateway`: Microsoft Learn, live, last updated 2026-09-10; describes the current v2 SKUs. Current, checked 2026-11-15.
- `microsoft-app-gateway-how`: Microsoft Learn, live, last updated 2026-09-09. Current, checked 2026-11-15.
- `microsoft-azure-lb`: Microsoft Learn, live, last updated 2026-08-21; describes the current Standard and Gateway SKUs. Current, checked 2026-11-15.
- `microsoft-azure-lb-components`: Microsoft Learn, live, last updated 2026-08-17. Current, checked 2026-11-15.
- `microsoft-azure-lb-distribution`: Microsoft Learn, live, last updated 2026-05-20. Current, checked 2026-11-15.
- `microsoft-azure-lb-probes`: Microsoft Learn, live, last updated 2026-09-10. Current, checked 2026-11-15.
- `rfc-9110`: HTTP Semantics, Internet Standard (June 2022); the RFC Editor's record lists no RFC that obsoletes or updates it. Current, checked 2026-11-15.

All are documentation pages written by the vendor or the RFC Editor, none a sales page, forum or draft.

## 4. The limit overrides

None.
