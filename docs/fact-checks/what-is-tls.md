```json fact-check
{
  "slug": "what-is-tls",
  "hash": "c25ffde03ca74415c397b32f4f7ba38ed6ab0f809695c9d0f5d79b7a6af3283c",
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
    "units[0].overview.facts[0] (Overview fact \"Used by\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Current version\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"SSL\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Proves identity with\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"Sits\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"clienthello\")": "✅",
    "units[0].steps[0].facts[0] (step \"clienthello\", fact \"Versions\")": "✅",
    "units[0].steps[0].facts[1] (step \"clienthello\", fact \"Cipher suites\")": "✅",
    "units[0].steps[0].facts[2] (step \"clienthello\", fact \"Name (SNI)\")": "✅",
    "units[0].steps[0].facts[3] (step \"clienthello\", fact \"Key share\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[0].events[1] (event \"handshake-1\")": "✅",
    "units[0].steps[1] (step \"serverhello\")": "⚠️",
    "units[0].steps[1].facts[0] (step \"serverhello\", fact \"Version\")": "✅",
    "units[0].steps[1].facts[1] (step \"serverhello\", fact \"Cipher suite\")": "✅",
    "units[0].steps[1].facts[2] (step \"serverhello\", fact \"Key exchange\")": "✅",
    "units[0].steps[1].facts[3] (step \"serverhello\", fact \"Forward secrecy\")": "✅",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[1].events[1] (event \"handshake-2\")": "✅",
    "units[0].steps[1].events[2] (event \"handshake-3\")": "✅",
    "units[0].steps[1].events[3] (event \"handshake-4\")": "✅",
    "units[0].steps[2] (step \"certificate-verification\")": "✅",
    "units[0].steps[2].facts[0] (step \"certificate-verification\", fact \"Certificate for\")": "✅",
    "units[0].steps[2].facts[1] (step \"certificate-verification\", fact \"Signed by\")": "✅",
    "units[0].steps[2].facts[2] (step \"certificate-verification\", fact \"Checks\")": "✅",
    "units[0].steps[2].facts[3] (step \"certificate-verification\", fact \"Proof of the key\")": "✅",
    "units[0].steps[2].events[0] (event \"m3\")": "✅",
    "units[0].steps[2].events[1] (event \"handshake-5\")": "✅",
    "units[0].steps[2].events[2] (event \"handshake-6\")": "✅",
    "units[0].steps[2].events[3] (event \"m4\")": "✅",
    "units[0].steps[2].events[4] (event \"handshake-7\")": "✅",
    "units[0].steps[3] (step \"handshake-finished\")": "✅",
    "units[0].steps[3].facts[0] (step \"handshake-finished\", fact \"Server sends\")": "✅",
    "units[0].steps[3].facts[1] (step \"handshake-finished\", fact \"Browser sends\")": "✅",
    "units[0].steps[3].facts[2] (step \"handshake-finished\", fact \"Proves\")": "✅",
    "units[0].steps[3].facts[3] (step \"handshake-finished\", fact \"Round trips\")": "✅",
    "units[0].steps[3].events[0] (event \"m5\")": "✅",
    "units[0].steps[3].events[1] (event \"m6\")": "✅",
    "units[0].steps[3].events[2] (event \"handshake-8\")": "✅",
    "units[0].steps[4] (step \"encrypted-application-data\")": "✅",
    "units[0].steps[4].facts[0] (step \"encrypted-application-data\", fact \"Record type\")": "✅",
    "units[0].steps[4].facts[1] (step \"encrypted-application-data\", fact \"Cipher\")": "✅",
    "units[0].steps[4].facts[2] (step \"encrypted-application-data\", fact \"Each record\")": "✅",
    "units[0].steps[4].facts[3] (step \"encrypted-application-data\", fact \"Changed on the way?\")": "✅",
    "units[0].steps[4].events[0] (event \"m7\")": "✅",
    "units[0].steps[4].events[1] (event \"m8\")": "✅",
    "units[0].steps[5] (step \"close-notify\")": "✅",
    "units[0].steps[5].facts[0] (step \"close-notify\", fact \"Alert\")": "✅",
    "units[0].steps[5].facts[1] (step \"close-notify\", fact \"Sent\")": "✅",
    "units[0].steps[5].facts[2] (step \"close-notify\", fact \"Stops\")": "✅",
    "units[0].steps[5].facts[3] (step \"close-notify\", fact \"Then\")": "✅",
    "units[0].steps[5].events[0] (event \"m9\")": "✅",
    "units[0].steps[5].events[1] (event \"m10\")": "✅",
    "units[0].steps[0].deep[0] (step \"clienthello\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"serverhello\", Go deeper)": "✅",
    "units[0].steps[2].deep[0] (step \"certificate-verification\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"handshake-finished\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"encrypted-application-data\", Go deeper)": "✅",
    "units[0].steps[5].deep[0] (step \"close-notify\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.terms[0] (\"term-clienthello\")": "✅",
    "units[0].learn.terms[1] (\"term-serverhello\")": "✅",
    "units[0].learn.terms[2] (\"term-suite\")": "✅",
    "units[0].learn.terms[3] (\"term-keyshare\")": "✅",
    "units[0].learn.terms[4] (\"term-shared\")": "✅",
    "units[0].learn.terms[5] (\"term-cert\")": "✅",
    "units[0].learn.terms[6] (\"term-ca\")": "✅",
    "units[0].learn.terms[7] (\"term-finished\")": "✅",
    "units[0].learn.terms[8] (\"term-close\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-current\")": "✅",
    "units[0].learn.facts[1] (\"fact-retired\")": "✅",
    "units[0].learn.facts[2] (\"fact-gives\")": "✅",
    "units[0].learn.facts[3] (\"fact-certs\")": "✅",
    "units[0].learn.facts[4] (\"fact-defined\")": "✅",
    "units[0].learn.facts[5] (\"fact-handshake\")": "✅",
    "units[0].learn.facts[6] (\"fact-runs-on\")": "✅",
    "units[0].learn.facts[7] (\"fact-inside\")": "✅",
    "units[0].learn.facts[8] (\"fact-used\")": "✅",
    "units[0].learn.facts[9] (\"fact-sni\")": "✅",
    "units[0].learn.facts[10] (\"fact-kx\")": "✅",
    "units[0].learn.facts[11] (\"fact-fs\")": "✅",
    "units[0].learn.facts[12] (\"fact-keys\")": "✅",
    "units[0].learn.facts[13] (\"fact-checks\")": "✅",
    "units[0].learn.facts[14] (\"fact-chain\")": "✅",
    "units[0].learn.facts[15] (\"fact-certverify\")": "✅",
    "units[0].learn.facts[16] (\"fact-rtt\")": "✅",
    "units[0].learn.facts[17] (\"fact-records\")": "✅",
    "units[0].learn.facts[18] (\"fact-0rtt\")": "✅",
    "units[0].learn.facts[19] (\"fact-trunc\")": "✅",
    "units[0].learn.facts[20] (\"fact-stands\")": "✅",
    "units[0].learn.facts[21] (\"fact-purpose\")": "✅",
    "units[0].learn.facts[22] (\"fact-hello\")": "✅",
    "units[0].learn.facts[23] (\"fact-secret\")": "✅",
    "units[0].learn.facts[24] (\"fact-why-cert\")": "✅",
    "units[0].learn.facts[25] (\"fact-sent\")": "✅",
    "units[0].learn.facts[26] (\"fact-finished\")": "✅",
    "units[0].practice[0].options[0] (question \"same-secret\")": "✅",
    "units[0].practice[0].options[1] (question \"same-secret\")": "✅",
    "units[0].practice[0].options[2] (question \"same-secret\")": "✅",
    "units[0].practice[1].options[0] (question \"certificate-proves\")": "✅",
    "units[0].practice[1].options[1] (question \"certificate-proves\")": "✅",
    "units[0].practice[1].options[2] (question \"certificate-proves\")": "✅",
    "units[0].practice[0].prompt (question \"same-secret\")": "✅",
    "units[0].practice[1].prompt (question \"certificate-proves\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-client-certificates",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "cloudflare-pqc-support",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "google-chrome-secure",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "iana-ports",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-app-service-certificates",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-edge-secure",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-ms-sstp",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-sql-tls-1-3",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "microsoft-tls-protocol",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "nist-sp800-52r2",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "nist-sp800-77r1",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-tls-certificate",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "paloalto-tls-handshake",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-10024",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5116",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5280",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-5869",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-6066",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-6176",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-6797",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-7568",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-7748",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-8314",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-8996",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9001",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9112",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9162",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9325",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9525",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9846",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9849",
      "current": true,
      "checked": "2026-11-12"
    },
    {
      "id": "rfc-9852",
      "current": true,
      "checked": "2026-11-12"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 193,
    "digest": "e77534cc0af2b65dada3403cc971c4754062959ba34c47ac182b45a64ea304d6",
    "files": {
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17",
      "rfc-9849": "56cf7f40c41b2566bfe9c3df18e73cd649b7c0e33690439a43582a65a3b3a0cc",
      "rfc-6066": "6a33cceaa5e1b6518923d9d04ffaa738bad0417806b3c94a995484e140f5cbc0",
      "rfc-10024": "5efcfacef53549ec4ff57450dfec28085b34cf3f34d829c541c0ddbe19230dfe",
      "cloudflare-pqc-support": "c9cb91d75b5433df9f8656c4912015f04653dd6b6808cd79dfa782eab5bbc859",
      "rfc-5869": "7a40eb3835b35fc947eb12a2ed614db079d43b26e50dbc537c31fba16397089c",
      "rfc-5280": "a2f2628c0a83b873fc4786abd921f9b2c02395954b655d190bf16b831633345d",
      "nist-sp800-52r2": "aecbcc03e9f6e5dee33f58ea47241bec7aebd4a60ea8f37065ca9058f57abed0",
      "rfc-9162": "a0e432ce7580c99fcc8faf0cf3f6191f9ce6b4864f949158e020d4ecb295081f",
      "rfc-6797": "7cefa03f77547532580b7f877b4e6388bb66c20631b624667a0065c14ae3d364",
      "microsoft-edge-secure": "ad82340c105924e576c523716d5613bc79d553a005d00835b6deaa63adc30fe7",
      "google-chrome-secure": "c49a9532ce73ef655cfd7e3f3ad87aa8fd93740b39235303b40472288efbe5ea",
      "rfc-6176": "026957e8ee1cbe85ad04a1cf3a0fae1ad71fa001e809c813a63d79d3bd79a3eb",
      "rfc-8996": "a8250792df7fc533328f2021dbdcce847bbdfbc703de89a93e18ce165d4b8d14",
      "rfc-9325": "e3475381d056bde1eed65252954cce68250168454387f6799b38660806f215bc",
      "microsoft-sql-tls-1-3": "2018f7660bac7c935c2d8c27743f1b4a1d2543ff1aee9d653e09d627c76eed9e",
      "rfc-7748": "279ca0ecc5e92e2962e27b846986aeb74729d9dd34bd4a04a362f80dcb596ad3",
      "nist-sp800-77r1": "2343fd37c8cf23a8bfb594b481a867298f4177adf3146228bd365d2b9affe30e",
      "microsoft-ms-sstp": "3ecfcf4c18219fdf4171a635120f45d103a6c1c0c039f28bc2472b1bcffe69b1",
      "rfc-7568": "84e8adcafd4cde891e258342f9d5c3381f746d0ff40b196a8b83bb0b6a43c7d1",
      "paloalto-tls-handshake": "4e12c337e4edc495207eb517213439cc08c72efe2dd595950f26cb99f5569b7c",
      "paloalto-tls-certificate": "3c2be995e32322e79b9d57d1b7add55018e68f761f20bd6d17d8ec2c8f1edcec",
      "microsoft-app-service-certificates": "d65e8e7063365556f832247b05af9de6e68edad33abe3b87e94704a2c7eae526",
      "cloudflare-client-certificates": "a2829d07e0f02e3e324a271b003d34c06dd73e25a3feeb2c1c5192a2c5aabcc4",
      "rfc-9852": "79059256740e9453965a1c922e2f4b95c67063fa79e002997eb6da6b4617a34d",
      "rfc-9112": "e4f426bac6206b67fdf9e0da826154f70588db2133a0a86b15cde4ff725d8937",
      "rfc-9001": "3bbaecdf5afd278052a2c48348ce118c4ff8d0cf6b9915549858171b3f98a591",
      "microsoft-tls-protocol": "1d703ee224b9c373ac0f9beca2faebd330c584e76ad041b4661d72a650d82902",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "iana-ports": "6f1b1cfc45642ea7c33da93581249779ea0814339a0389d9cb49b69b8ae247e3",
      "rfc-8314": "d626efa01a2176206b81742b77ca8f0d61e4a669f9ae7798e7ae556afc65aae6",
      "rfc-9525": "ed8116c2435376dffe37ec2ca688c3a8515e36820852b29e0b6cdfbe92abd2c5",
      "rfc-5116": "8762fee7c85e682fce609c75e0f5040ee7efa8fca96969ffd85df37585e0eda1"
    }
  },
  "items": {
    "title": "2237a161066e2a0019cfe040670faf0e4eb18318ca8e6f4eb8304bc5094cf569",
    "units[0].name": "6ed6e6fd9d6c720bd8009a5f151fa32e1aee8ca6036bc333492d0b24b8cf5c17",
    "units[0].osi": "17c8769f2b58beff9273753a44012a077e731b61b24948a7d59567552df0492d",
    "backing (the lesson's subtitle and summary)": "921edeaccfe64474b7daa1e568a02dc35e7ffd598652179deb1fcebd500e8132",
    "units[0].backing (the unit's full name and purpose)": "6999a86d90ab7000eaf95d81703932879ba692233f460596d92b52240295e8a5",
    "units[0].scene.backing (the scene)": "f396aa578c172ffb5b5171a6f5d4592b7afd51942d0b6be716c51217de9ea8d8",
    "units[0].overview.hookBacking (the Overview hook)": "1a9bcf7f295f614bb3bbd52a7fad0c230bbe65db996390516639177b01d3a40c",
    "units[0].overview.backing (the Overview description)": "60704075ec2ea689b1efa7f274b6948f4998fd3c16b7ad4d408f5564e480c0da",
    "units[0].overview.facts[0] (Overview fact \"Used by\")": "f6fdc57586fa376e49b0b860e9884768a755e70d9f64b06a16fe67912993a48b",
    "units[0].overview.facts[1] (Overview fact \"Current version\")": "1c8f6cbae81b3773e8396e5bdcb97ae0f7f3dd2ed253db669b661b1720ca599f",
    "units[0].overview.facts[2] (Overview fact \"SSL\")": "182268253e495703bac31f8ab6a069d8a0c09ff59a3b3c848885ec5a57970703",
    "units[0].overview.facts[3] (Overview fact \"Proves identity with\")": "614b7a2ac4bb89d15b3a3177e243d05262b7143c5f2ede28460a8970092282ff",
    "units[0].overview.facts[4] (Overview fact \"Sits\")": "5a8049243939245ee5eddd373e625a15709b6681c8ce0ffd68c8960b3e1ff6b1",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "558906a8bb599cebd4850b7edb17a5fba53eb25e74acc4710cfa2efe0f8e4cf3",
    "units[0].steps[0] (step \"clienthello\")": "30c9b8b3db3f0cce1f4986b641faa44a899d096cb703ed84d35e8810d14c4cd7",
    "units[0].steps[0].facts[0] (step \"clienthello\", fact \"Versions\")": "caa3093c0126f56835a2ea610c75d5e008b99eeea375b16966391fc8427873e2",
    "units[0].steps[0].facts[1] (step \"clienthello\", fact \"Cipher suites\")": "39796a55c7a65e53f8a9dad06037ac0870500d44ae00422e3fec7a255a1ac233",
    "units[0].steps[0].facts[2] (step \"clienthello\", fact \"Name (SNI)\")": "ad157a518cfd96f6093cde35f985dce14489e3c09613c9494dc03c95ef0af3f1",
    "units[0].steps[0].facts[3] (step \"clienthello\", fact \"Key share\")": "53333bf9d2317d9bbbeccd40227984fd32590d5b07c4d4b124810487b9397389",
    "units[0].steps[0].events[0] (event \"m1\")": "7c527b1b7dba9061da49c0b0dc29836a4fa8bb6c53e5b3e66beec61d63417ff4",
    "units[0].steps[0].events[1] (event \"handshake-1\")": "27cea632f78295a83d927965dea367f3c901122d31707d612462bea3e9321d71",
    "units[0].steps[1] (step \"serverhello\")": "44ae1584a5f14d9cff1f2d97546ecb62507185336d7032c1b7de2f313269b325",
    "units[0].steps[1].facts[0] (step \"serverhello\", fact \"Version\")": "9831944105faf478816b233e44f236b45aece3d77a08a3538d3f75004d67df02",
    "units[0].steps[1].facts[1] (step \"serverhello\", fact \"Cipher suite\")": "25d3a98eecd8b933b74ad851d2e3eebfda94c76990c37e825d024206e9fe1477",
    "units[0].steps[1].facts[2] (step \"serverhello\", fact \"Key exchange\")": "836d30bb9a4933837f4e37d09392dde4c64b7882a023a8ddf915ab3327f7dfac",
    "units[0].steps[1].facts[3] (step \"serverhello\", fact \"Forward secrecy\")": "3c8e5e538e1d727c39ea5e7af686e472df1c35c7386742fab135453ef632eb29",
    "units[0].steps[1].events[0] (event \"m2\")": "57824c0c092df874610c99ea0b859ccb04dc6a97a0c3b7db60acfe5ee89fd0ad",
    "units[0].steps[1].events[1] (event \"handshake-2\")": "25a010591ff1ea76fc15c18d5a389d5e55eaeef8a6c5824d9b647c1900908550",
    "units[0].steps[1].events[2] (event \"handshake-3\")": "6f57d2544ae6a3c6d6d2b1603efa99090e38bcf60300fdc0d59ee4941c0a6f34",
    "units[0].steps[1].events[3] (event \"handshake-4\")": "8ccd9b23782a0b26d323e2fb282e732e260f066b3c2fcb652420e080116356d3",
    "units[0].steps[2] (step \"certificate-verification\")": "410e0fae60bc230c32d4f370e2e58d89f4411b762ebf2d15905678ce488890e8",
    "units[0].steps[2].facts[0] (step \"certificate-verification\", fact \"Certificate for\")": "6b27f833fefb2b9ab139d708d203ffaab1990839112fe4dd3b280505bc13c1f6",
    "units[0].steps[2].facts[1] (step \"certificate-verification\", fact \"Signed by\")": "e588cb18b64904d2db89a1df25b3385f2163b9166da3fc56d28de499c663757e",
    "units[0].steps[2].facts[2] (step \"certificate-verification\", fact \"Checks\")": "e9f9f8b8f6f3aa8045383e623f7bf4ff83b6df7a1048afd99c3c5319db31d55d",
    "units[0].steps[2].facts[3] (step \"certificate-verification\", fact \"Proof of the key\")": "2a7774a8edc95b9b69dcb68fd4ec91c11c94eee55794afa02624692dbaeec4b8",
    "units[0].steps[2].events[0] (event \"m3\")": "0c18679c0d09fca5abd5b23567c0e7e34ea723546e8e63f660b369efd2c7732e",
    "units[0].steps[2].events[1] (event \"handshake-5\")": "c33a0d1372648c9371a8cb963f2252cd2801a010cfff68a5eb0c612d92dbc46e",
    "units[0].steps[2].events[2] (event \"handshake-6\")": "50546ead93ffdc17748d13571f723a120aaf18cd72457b5d517a1f4d5359a3a4",
    "units[0].steps[2].events[3] (event \"m4\")": "f59b179862c89ccc70d1d88e5d3d15d5e1e0687a5749ae47a4dcc89372df1649",
    "units[0].steps[2].events[4] (event \"handshake-7\")": "237b38d2bd3341732079fd164c7a4091844ef957c36e5b186f0ecb6de56bd25d",
    "units[0].steps[3] (step \"handshake-finished\")": "0e371b4487ad312bca03e868dcd4a731ee26b0133f0809882f861501e13a6658",
    "units[0].steps[3].facts[0] (step \"handshake-finished\", fact \"Server sends\")": "3854e9172ae02a2bfb17149dac5f5d6bac2358cc860d14d56289b2376e813a66",
    "units[0].steps[3].facts[1] (step \"handshake-finished\", fact \"Browser sends\")": "ca5446d2608131eb932616168cbc14663de736f993b421bfe3617248ee189340",
    "units[0].steps[3].facts[2] (step \"handshake-finished\", fact \"Proves\")": "d225129de508e7829d325af49e33700d2f7319ac012877f0ee3a7318768ca595",
    "units[0].steps[3].facts[3] (step \"handshake-finished\", fact \"Round trips\")": "738b50c628af82713fa16e8c3f0bd0aa03bdb439305716f3ee937c1f5389d31a",
    "units[0].steps[3].events[0] (event \"m5\")": "b9864a7d18c0d9c4eb778e3ff7ffde0d6f6923984de857d1ef4d2ffa61cbb3ca",
    "units[0].steps[3].events[1] (event \"m6\")": "3c45a35c911736897fe4038301148321271eb2712825649f5a033104f498c8fb",
    "units[0].steps[3].events[2] (event \"handshake-8\")": "86bd5667c509fe43cb4e418bb52380979963e96dd7bf4c0d7d3942254cb9c718",
    "units[0].steps[4] (step \"encrypted-application-data\")": "482d4308c6b5e73eb22f42332ccabf7cc5d2e26a61e6e5f8c169c790673ec44e",
    "units[0].steps[4].facts[0] (step \"encrypted-application-data\", fact \"Record type\")": "8c70fb39bad42fec7ce4a44197f4aa714233cc0db8176a65e7b8eaaa7356091b",
    "units[0].steps[4].facts[1] (step \"encrypted-application-data\", fact \"Cipher\")": "88b53b42673660776a1a0f26b9174bef3b9f711ac038dbe312427830f0d3579c",
    "units[0].steps[4].facts[2] (step \"encrypted-application-data\", fact \"Each record\")": "cdf70630915a75d549f29c408f0be088227e4ce0054cb9151f44f90bec813d8a",
    "units[0].steps[4].facts[3] (step \"encrypted-application-data\", fact \"Changed on the way?\")": "83d19fd3e33497df4949653c0d1a71a8edad6bd1d241d5498293e71cfd3d91fe",
    "units[0].steps[4].events[0] (event \"m7\")": "d7325f972cb465a595bb7233a7e7191b50c1eb33684ef3f3048b2104ec8e23eb",
    "units[0].steps[4].events[1] (event \"m8\")": "3b75c953b102e5825ea3b19d2ae8154a7b04645b11329b37e297af00ac790614",
    "units[0].steps[5] (step \"close-notify\")": "f873fcc029285fd660e0695a1f28c58a5757cd1658594539ff2fef27fd6497e9",
    "units[0].steps[5].facts[0] (step \"close-notify\", fact \"Alert\")": "2ac6f7287eea229daa768501bfc0336bd4a66b78a9e0c6ed99bfc64ad9a73c3c",
    "units[0].steps[5].facts[1] (step \"close-notify\", fact \"Sent\")": "58719b30421e61eceb4f3ac30faddab53786bd58769c2e1916b1575bca65e0e3",
    "units[0].steps[5].facts[2] (step \"close-notify\", fact \"Stops\")": "fc02fe51a9dd11bdeba29b42c3d3c08ab00250365dd5f29a30419891d56403c3",
    "units[0].steps[5].facts[3] (step \"close-notify\", fact \"Then\")": "bc1cf7b417c8de6225277a91c559f5113945a18d03624a297ab57085a2ec46de",
    "units[0].steps[5].events[0] (event \"m9\")": "c1fcfa5747fd035413004a067b8410800ec9893bc1971b04fbd3dd074fd84c3d",
    "units[0].steps[5].events[1] (event \"m10\")": "4b0f21984fdf35450739598df1b0e6ed080c9e8e77add27f3dd34d2ae1d59964",
    "units[0].steps[0].deep[0] (step \"clienthello\", Go deeper)": "b0d9a0daecf29c9449785175c4a430e9b1c592d5f39b34194d525d6340b18bb6",
    "units[0].steps[1].deep[0] (step \"serverhello\", Go deeper)": "e7836958ab615197aa0c9af2418e2e57e22b22ebec109c7715a2411d6149d887",
    "units[0].steps[2].deep[0] (step \"certificate-verification\", Go deeper)": "e21572b8977ca96a379f1f052cf7415da1ad70caaccc8a560eab56f7c6743994",
    "units[0].steps[3].deep[0] (step \"handshake-finished\", Go deeper)": "c53fc790ef1de4a9a4bbb9b174bbdbf27d8c836df0a548d12f1f71a76da49242",
    "units[0].steps[4].deep[0] (step \"encrypted-application-data\", Go deeper)": "b40f512e8fadd3ba4a824fd37b89f1af6d1b46963983baed051c2ff374721931",
    "units[0].steps[5].deep[0] (step \"close-notify\", Go deeper)": "1c211285955c00f9adeef2d4a4280cd8e4341ecf86edc71a0b62f0a065a553c7",
    "units[0].learn.lead[0] (\"lead-1\")": "8413d824c15a12a3073e8d8d7f21bdc5d4e426d33ae4d2374c72e82fbae5f7c1",
    "units[0].learn.terms[0] (\"term-clienthello\")": "858d0e8c8ec6ec686e25901df2e90bfbd9ebcf5a14b23e48b0ebceae1c12118e",
    "units[0].learn.terms[1] (\"term-serverhello\")": "750cef58c95dcdf62ae34b3b2a5a5b5b514d4f8d920e9715867652e52052165f",
    "units[0].learn.terms[2] (\"term-suite\")": "82c56e29c09df00d28731723b310fd0d6c62cae180f4b2911dd6539c7c04aee5",
    "units[0].learn.terms[3] (\"term-keyshare\")": "dfbc3521c7d601f6ffa428df523cf64a4a26c88ebbec9dfbdf69abc1b29ab41d",
    "units[0].learn.terms[4] (\"term-shared\")": "f4e2fc783936952df2bff1cd8cf1f6ee0d0995d529913f6e5487a83d1eb0c64a",
    "units[0].learn.terms[5] (\"term-cert\")": "c515e8f6453d38cc533134d6a052a785ff7b8b54f5fb93f670ede7490dbe0d62",
    "units[0].learn.terms[6] (\"term-ca\")": "00b3afddf90de2076e3d1c5ada5f621e052c8922d14b0475de7fe60690b69984",
    "units[0].learn.terms[7] (\"term-finished\")": "f72def68bb52beb93d9147303fde3c68951e0889b4dd6ac60556f952fcc2b667",
    "units[0].learn.terms[8] (\"term-close\")": "c66f2a5f1959d9c20e01cce864452a63a13eaadbffe946c2e952590787979acc",
    "units[0].learn.pattern (\"pattern\")": "99342d4b6cc58e80255f5599f5ae380dded1efbaf70e48d8bb2da69ae4028ec5",
    "units[0].learn.why[0] (\"why-1\")": "49d562c923ff8186a58fe0f3358758e9c3fd3297546832db2c20cfbbb0f08d7d",
    "units[0].learn.why[1] (\"why-2\")": "12609a9c0932a3e28b2d46fc50c4754718c818b6196991ef108e00d4b7c8d5d6",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "ebe28025c1b1976c5b8c28497784bc1079d41e0bb724d059f7083dd4613501c7",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "584aad022b259b1ef41d0c516e5cf0d5454e12851d84ebdfef1a1c2686cc4912",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "13516b7ad876ea0288750768adb5f540f3f7871f4df7a8ae9698008730131ec1",
    "units[0].learn.deep[3] (\"deep-4\", Learn's Go deeper)": "8ab141a1d2da196e25bbb6639acdd28be7a076c0e33901d44b84560ed0cabfc3",
    "units[0].learn.facts[0] (\"fact-current\")": "e15d43bd07969df9d43b9a4d77a7478f26aaacb8d324e77f12e88c3b31cbfa09",
    "units[0].learn.facts[1] (\"fact-retired\")": "2163e0c31f1bbaa10dd35241bc5362b5f27722c2815df38c4af6e7db810b1cbf",
    "units[0].learn.facts[2] (\"fact-gives\")": "3a6f11ef004bb27c8c9857054bcb5d308655b059ce1a8fcdead75ad46dd3f71d",
    "units[0].learn.facts[3] (\"fact-certs\")": "84031cd40ffe5f565a884825763d65fcaf5e695e33f983fddea38f2e5938bba2",
    "units[0].learn.facts[4] (\"fact-defined\")": "4fd15b3fee616f1b2454e4c4313848e5f0b837d3fefd580d673c5942754263d4",
    "units[0].learn.facts[5] (\"fact-handshake\")": "a37f860a8fe4e2ba8b38d9908d9523e2100ff4ba40e6be7540f93ad621b88a23",
    "units[0].learn.facts[6] (\"fact-runs-on\")": "8829b878e233a40afdadbedfe32c1cbe6fe456a31c979c5d4a7b6c1449e64701",
    "units[0].learn.facts[7] (\"fact-inside\")": "a0dfae1b0e3f1ef7a3e5d48de13eddf9a1198aad76481c50f44390f555f3d731",
    "units[0].learn.facts[8] (\"fact-used\")": "a60936a885952d610f779534bffa86f2fd57e4e3bfb8abcd0789c24209db7a22",
    "units[0].learn.facts[9] (\"fact-sni\")": "52073408ef3ef5f43272fbb7c023230a94ddcdb4e616daa8dd48c7afc9780712",
    "units[0].learn.facts[10] (\"fact-kx\")": "38122829584f79bf15f70b38ab08ccad23db4ed2b446f77a8a9d9b600532da2b",
    "units[0].learn.facts[11] (\"fact-fs\")": "a87e378c7682d301261a3f599354af213408089f17995aad524a47b1aa745490",
    "units[0].learn.facts[12] (\"fact-keys\")": "db7c5cb7f9d2eccc52367db47e682b82d04070d60f26e67f36fb1209f3bc7b4f",
    "units[0].learn.facts[13] (\"fact-checks\")": "0241008377466aa1074ea4f2521748b3effe22af831b30890ea8372e928d5058",
    "units[0].learn.facts[14] (\"fact-chain\")": "80d9ce3006620480c1b479469011b57216d9ad2528d2351ab8c08323d1eee652",
    "units[0].learn.facts[15] (\"fact-certverify\")": "331b063cf37b81313e91b4842d8dfbf83c6a48fef88a6c27dc48b8882ca4896f",
    "units[0].learn.facts[16] (\"fact-rtt\")": "167472bac19dd2ebcc518e700df545ec7169dcf8e4aed7e4303a274cdaaaf7f7",
    "units[0].learn.facts[17] (\"fact-records\")": "d350df8d490dfb52211bb0ccd31447eae59b675da6c10c26999ef8466e6b3e5d",
    "units[0].learn.facts[18] (\"fact-0rtt\")": "3b05a0f51cb48441f8ca9c601b6e5f7830db1e1cf4edb705155378f116d8a8e8",
    "units[0].learn.facts[19] (\"fact-trunc\")": "9d4ecb49bbdd490d125f8adb0fedf8bfb1a8c467f7d413c8d48c24b5bdc6fb83",
    "units[0].learn.facts[20] (\"fact-stands\")": "e474796076c48652f495cac22a0ef42fdffbefd2def263f3eb1897e40ee5f9d5",
    "units[0].learn.facts[21] (\"fact-purpose\")": "b38f40f94e1825cec95728341243b72fe3a2473c5160e9b4b3415906dcc1fd4c",
    "units[0].learn.facts[22] (\"fact-hello\")": "8daf57f86b1fdd94d384cc5d3cbd89cc1d93b0d0f085c3cb203e8e63e807b420",
    "units[0].learn.facts[23] (\"fact-secret\")": "dd1e12003288c91a619eea38f3eb28c50c7894e79085492a03a7fa615d4d8d84",
    "units[0].learn.facts[24] (\"fact-why-cert\")": "0b7a1db99d6f0da81861d4d68d434ac5da274ea897fb8bbf7881e7f9f331249f",
    "units[0].learn.facts[25] (\"fact-sent\")": "ebd3fc198a8d45a65574e6639fd5a0b529d5cd5bd3c2af6dca5894a920e06b35",
    "units[0].learn.facts[26] (\"fact-finished\")": "502e7ddff0bd93ca06f05243a1ef2fe7f7e5f1b423e026adb09d40c0e021a589",
    "units[0].practice[0].options[0] (question \"same-secret\")": "7b7299eedaba1128f67b2effba6421b5a5ccb52880df3e86af0f55847db26e3c",
    "units[0].practice[0].options[1] (question \"same-secret\")": "4ccb4d451e61ee38509253158957d1a18b4966f8822374067d31edcaecb0cc45",
    "units[0].practice[0].options[2] (question \"same-secret\")": "1c096aff9a0207c1daecbe6472b9a01de55e91df128c9d8cf45d800bc6ba9536",
    "units[0].practice[1].options[0] (question \"certificate-proves\")": "b42726e47e9d435025e6d5126f0f50de23d6b43d4b5751d66768cf56a44a9a82",
    "units[0].practice[1].options[1] (question \"certificate-proves\")": "818756a85a365bf3d031afca5306b12ffa3bfe2570351efcbf4484d5adc1e1be",
    "units[0].practice[1].options[2] (question \"certificate-proves\")": "544cf1acd822470146cfdec0b7cba95b56841534c08829b4905b4a79aa8a9536",
    "units[0].practice[0].prompt (question \"same-secret\")": "ff368caa7cc2d5ee3af49b983ddab4d0926b1d7a888b40538a0be60afeab7aad",
    "units[0].practice[1].prompt (question \"certificate-proves\")": "eaefe70033038b31c2fe52a683fd991b2078330a1cff810f8d4465b668b0d5e3"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: what-is-tls

Checked 2026-11-12 against the claim sheet with the hash above. Every source was fetched from its publisher in this run. 119 items pass. One traced item is ⚠️: the ServerHello step's narrative.

## Claims

### units[0].osi — ✅

- Note: The badge says TLS spans layers. None of the allowed sources I read puts TLS at one OSI layer. Microsoft's TLS protocol page places TLS between the application protocol layer and the TCP/IP layer and says it works between the application and transport layers. NIST SP 800-52r2 §1 says TLS runs on top of TCP, with application protocols above it. The scope note in NIST SP 800-52r2 §1.2 says the guide covers the "transport layer" part of the network stack. That is the internet stack's wording, not an OSI placement, and §1 of the same guide puts TLS between TCP and the application. RFC 9846 §1 says higher-level protocols layer on top of TLS. None of these is a single-layer OSI placement.

### units[0].steps[0].deep[0] (step "clienthello", Go deeper) — ✅

- `rfc-9846` §B.4
  > This specification defines the following cipher suites for use with
  > TLS 1.3.
- Note: The table in RFC 9846 Appendix B.4 lists exactly five suites, TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_AES_128_CCM_SHA256 and TLS_AES_128_CCM_8_SHA256. RFC 9846 is the current TLS 1.3 standard and defines these values.
- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection, is
  > perhaps the most sensitive information left unencrypted in TLS 1.3.
- `rfc-6066` §3
  > It may be desirable for clients
  > to provide this information to facilitate secure connections to
  > servers that host multiple 'virtual' servers at a single underlying
  > network address.
- Note: RFC 6066 §3 defines the server_name extension (SNI).
- `rfc-9846` §4.5.1.2
  > The "server_name" [RFC6066] extension is used to guide certificate
  > selection.
- `rfc-9846` §4.3.7
  > When sent by the client, the "supported_groups" extension indicates
  > the named groups which the client supports for key exchange, ordered
  > from most preferred to least preferred.
- Note: RFC 9846 §4.3.7 defines the supported_groups extension.
- `rfc-10024` §Abstract
  > This document defines three hybrid key agreement mechanisms for TLS
  > 1.3 -- X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024 --
  > that combine the post-quantum ML-KEM
- `rfc-10024` §2
  > The first group uses X25519 [RFC7748], is widely deployed, and
  > often serves as the most practical choice for a single PQ/T hybrid
  > combiner [RFC9794] in TLS 1.3.
- Note: RFC 10024 (Standards Track, August 2026) defines the X25519MLKEM768 group and its name.
- `cloudflare-pqc-support` §Browsers
  > Default in Chrome 131+
  > …
  > Default in Firefox 132+ (Desktop), 145+ (Android)
  > …
  > Default in Safari 26+
- Note: The browser part rests on Cloudflare's list, which says the hybrid is the default in Chrome, Edge, Firefox and Safari, and on RFC 10024 §2, which says it is widely deployed. Cloudflare says "default", and the lesson's "put first" means the same for a beginner. "Unencrypted" leaves out Encrypted Client Hello (RFC 9849), a newer option that is not yet the ordinary case.
- Note: All cited RFCs are current: none is obsoleted on its RFC Editor info page.

### units[0].steps[1].deep[0] (step "serverhello", Go deeper) — ✅

- `rfc-9846` §7.4.2
  > For X25519 and X448, the ECDH calculations are as follows:
- Note: RFC 9846 §7.4.2 defines the elliptic-curve Diffie-Hellman calculation TLS 1.3 uses with X25519.
- `rfc-10024` §Abstract
  > that combine the post-quantum ML-KEM (Module-Lattice-Based Key
  > Encapsulation Mechanism) with an ECDHE (Ephemeral Elliptic Curve
  > Diffie-Hellman) exchange.
- `rfc-10024` §2
  > The first group uses X25519 [RFC7748], is widely deployed
- `cloudflare-pqc-support` §Browsers
  > Key agreement — the X25519MLKEM768
- `rfc-9846` §4.3.8
  > Clients and Servers MUST NOT reuse a key share for multiple
  > connections.
- `rfc-9846` §F.1
  > If fresh asymmetric keys are
  > used for each connection, then the output keys are forward secret.
- Note: RFC 9846 §F.1 also says that a long-term key compromised after the handshake does not compromise the session key, as long as the session keys have been erased. That matches "steals the server's private key later".
- `rfc-9846` §7.3
  > The traffic keying material is generated from an input traffic secret
  > value using:
  > …
  > [sender] denotes the sending side.
- Note: RFC 9846 §7.3 defines how each side's traffic keys are calculated.
- `rfc-9846` §F.1.1
  > Key derivation in TLS 1.3 uses HKDF as defined in [RFC5869]
- `rfc-5869` §Abstract
  > This document specifies a simple Hashed Message Authentication Code
  > (HMAC)-based key derivation function (HKDF)
- Note: RFC 5869 defines HKDF.
- `rfc-9846` §4.2.1
  > If the server selects an asymmetric key exchange group and the client
  > did not offer a compatible "key_share" extension in the initial
  > ClientHello, the server MUST respond with a HelloRetryRequest
- Note: RFC 9846 §4.2.1 defines this negotiation step. §4.3.8 adds that asking the server to pick a group comes "at the cost of an additional round trip".
- Note: "Paired with ML-KEM" simplifies: the ML-KEM half is a key encapsulation, not Diffie-Hellman. The lesson calls it "a post-quantum method" and does not say it is Diffie-Hellman, so nothing false is taught. All cited RFCs are current.

### units[0].steps[2].deep[0] (step "certificate-verification", Go deeper) — ✅

- `rfc-9846` §4.5.1
  > The sender's certificate MUST come in the first
  > CertificateEntry in the list.  Each following certificate SHOULD
  > directly certify the one immediately preceding it.
- Note: RFC 9846 §4.5.1 defines the Certificate message and its chain.
- `rfc-5280` §3.2
  > In general, a chain of multiple certificates
- `rfc-5280` §6.1
  > When the trust anchor is provided in the form of a self-signed
  > certificate, this self-signed certificate is not included as part of
  > the prospective certification path.
- Note: RFC 5280 §6.1 defines path validation from a trust anchor.
- `rfc-5280` §6.1.3
  > At the current time, the certificate is not revoked.
- Note: RFC 5280 §6.1.3 defines the per-certificate checks, revocation among them.
- `nist-sp800-52r2` §4.2.2
  > The client shall perform revocation checking of the server certificate.
- `rfc-9162` §Abstract
  > This document describes version 2.0 of the Certificate Transparency
  > (CT) protocol for publicly logging the existence of Transport Layer
  > Security (TLS) server certificates as they are issued or observed, in
  > a manner that allows anyone to audit certification authority (CA)
  > activity and notice the issuance of suspect certificates
- Note: RFC 9162 defines Certificate Transparency and is the current CT RFC (it obsoletes RFC 6962).
- `nist-sp800-52r2` §3.4.2.15
  > This is done through the use of public logs of certificates, public log monitoring, and public
  > certificate auditing.
- `rfc-6797` §11.3
  > that organization's root certification authority (CA) certificate
  > is not typically embedded by default in browser and/or operating
  > system CA certificate stores
  > …
  > ...then secure connections to that site will fail, per the HSTS
  > design.
- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > has a valid certificate issued by a trusted authority.
- `google-chrome-secure` §Resolve security and connection issues
  > The Chrome Root Program lists the root certificates trusted by Chrome to authenticate HTTPS sites
- Note: Loosely put: a chain can hold more than one intermediate, and a self-signed certificate becomes trusted if its owner installs it in the trust store (RFC 6797 §11.3 describes this). Neither is the ordinary case for a public site. Browsers check revocation in different ways. NIST requires a client to check, and RFC 5280 makes it part of path validation. All sources are current.

### units[0].steps[3].deep[0] (step "handshake-finished", Go deeper) — ✅

- `rfc-9846` §4.5.3
  > verify_data =
  > HMAC(finished_key,
  > Transcript-Hash(Handshake Context,
  > Certificate*, CertificateVerify*))
- Note: RFC 9846 §4.5.3 defines the Finished message.
- `rfc-9846` §4.1
  > This value is computed by hashing the concatenation
  > of each included handshake message
- `rfc-9846` §4.4.1
  > In all handshakes, the server MUST send the EncryptedExtensions
  > message immediately after the ServerHello message.
- `rfc-9846` §4.5
  > These
  > three messages are always sent as the last messages in their
  > handshake flight.
- `rfc-9846` §2.3
  > When clients and servers share a PSK (either obtained externally or
  > via a previous handshake), TLS 1.3 allows clients to send data on the
  > first flight ("early data").
  > …
  > There are no guarantees of non-replay between connections.
- Note: All of these sections are in RFC 9846, the current TLS 1.3 standard, which defines each message. "A resumed connection" is the common case of the PSK that §2.3 names.

### units[0].steps[4].deep[0] (step "encrypted-application-data", Go deeper) — ✅

- `rfc-9846` §5.1
  > The record layer fragments information blocks into TLSPlaintext
  > records carrying data in chunks of 2^14 bytes or less.
- `rfc-9846` §5.2
  > AEAD functions provide a unified encryption
  > and authentication operation which turns plaintext into authenticated
  > ciphertext and back again.
- `rfc-9846` §5.3
  > A 64-bit sequence number is maintained separately for reading and
  > writing records.
- `rfc-9846` §F.2
  > Non-replayability is
  > provided by using a separate nonce for each record, with the nonce
  > being derived from the record sequence number (Section 5.3)
  > …
  > thus,
  > records which are delivered out of order result in AEAD deprotection
  > failures.
- `rfc-9846` §4.7.3
  > The KeyUpdate handshake message is used to indicate that the sender
  > is updating its sending cryptographic keys.
- `rfc-9846` §F.3
  > TLS is susceptible to a variety of traffic analysis attacks based on
  > observing the length and timing of encrypted packets
- Note: RFC 9846 defines the record layer, AEAD protection, sequence numbers and KeyUpdate. 2^14 bytes is 16 KB. The sequence number is implicit, not sent, and padding can hide a record's true length. Both are details the claim may leave out.

### units[0].steps[5].deep[0] (step "close-notify", Go deeper) — ✅

- `rfc-9846` §6
  > struct {
  > AlertLevel level;
  > AlertDescription description;
  > } Alert;
- Note: RFC 9846 §6 defines the alert format. In TLS 1.3 the level is kept as a legacy field, and its meaning comes from the alert type.
- `rfc-9846` §6.1
  > The client and the server must share knowledge that the connection is
  > ending in order to avoid a truncation attack.
  > …
  > close_notify:  This alert notifies the recipient that the sender will
  > not send any more messages on this connection.
- `rfc-9846` §6.2
  > bad_certificate:  A certificate was corrupt, contained signatures
  > that did not verify correctly, etc.
- Note: §6.2 also lists handshake_failure and decrypt_error among the error alerts.
- `rfc-6176` §2
  > A man-in-the-middle can easily
  > insert a TCP FIN to close the session, and the peer is unable to
  > determine whether or not it was a legitimate end of the session.
- `rfc-9846` §E.5
  > The security of SSL 2.0 [SSL2], SSL 3.0 [RFC6101], TLS 1.0 [RFC2246],
  > and TLS 1.1 [RFC4346] are considered insufficient for the reasons
  > enumerated in [RFC6176], [RFC7568], and [RFC8996] and they MUST NOT
  > be negotiated for any reason.
- `rfc-8996` §Abstract
  > This document formally deprecates Transport Layer Security (TLS)
  > versions 1.0 (RFC 2246) and 1.1 (RFC 4346).
- `rfc-9325` §3.1.1
  > Implementations MUST support TLS 1.2 [RFC5246].
- Note: RFC 6176 is updated by RFC 8996, which does not change its account of SSL 2.0. All sources are current.

### units[0].learn.lead[0] ("lead-1") — ✅

- `rfc-9846` §2
  > Key Exchange: Establish shared keying material and select the
  > cryptographic parameters.  Everything after this phase is
  > encrypted.
  > …
  > Authentication: Authenticate the server (and, optionally, the
  > client) and provide key confirmation and handshake integrity.
- `rfc-9846` §F.1
  > Secrecy of the session keys:  The shared session keys should be known
  > only to the communicating parties and not to the attacker
- `rfc-9846` §2.3
  > the 0-RTT data is just added to the 1-RTT
  > handshake in the first flight.
- `microsoft-sql-tls-1-3` §Differences between TLS 1.2 and TLS 1.3
  > TLS 1.3 reduces the number of round trips from two to one during the handshake phase
- Note: RFC 9846 defines the handshake. Microsoft's page independently confirms the one round trip.

### units[0].learn.terms[0] ("term-clienthello") — ✅

- `rfc-9846` §4.2.2
  > cipher_suites:  A list of the symmetric cipher options supported by
  > the client
- `rfc-9846` §2
  > In the Key Exchange phase, the client sends the ClientHello
  > (Section 4.2.2) message, which contains a random nonce
  > (ClientHello.random); its offered protocol versions; a list of
  > symmetric cipher/hash pairs
- Note: RFC 9846 defines the ClientHello. Calling it "Here's what I can do" is an everyday gloss on "offered" options.

### units[0].learn.terms[1] ("term-serverhello") — ✅

- `rfc-9846` §2
  > It then responds with
  > its own ServerHello (Section 4.2.3), which indicates the negotiated
  > connection parameters.
- `rfc-9846` §4.2.3
  > cipher_suite:  The single cipher suite selected by the server from
  > the ClientHello.cipher_suites list.
- Note: RFC 9846 defines the ServerHello.

### units[0].learn.terms[2] ("term-suite") — ✅

- `rfc-9846` §B.4
  > A cipher suite defines the pair of the AEAD algorithm and hash
  > algorithm to be used with HKDF.
- Note: RFC 9846 Appendix B.4 defines TLS 1.3 cipher suites. "A set of methods for the lock" is an everyday rendering of the algorithm pair.

### units[0].learn.terms[3] ("term-keyshare") — ✅

- `rfc-9846` §4.3.8
  > The "key_share" extension contains the endpoint's cryptographic
  > parameters.
- `rfc-9846` §7.4.2
  > The public key to put into the KeyShareEntry.key_exchange
  > structure is the result of applying the ECDH scalar multiplication
  > function to the secret key
- Note: RFC 9846 defines the key_share extension. For the ML-KEM half, the server's share is a ciphertext rather than a public key. That detail does not change what a beginner takes away.

### units[0].learn.terms[4] ("term-shared") — ✅

- `rfc-7748` §6.1
  > Both now share K = X25519(a, X25519(b, 9)) = X25519(b, X25519(a, 9))
  > as a shared secret.
- `rfc-9846` §F.1
  > Establishing the same session keys:  The handshake needs to output
  > the same set of session keys on both sides of the handshake
- Note: Two independent RFCs. RFC 7748 is an Informational IRTF RFC and is not obsoleted.

### units[0].learn.terms[5] ("term-cert") — ✅

- `rfc-5280` §3.1
  > certificates, which are data structures that bind public key values
  > to subjects.  The binding is asserted by having a trusted CA
  > digitally sign each certificate.
- Note: RFC 5280 defines the Internet X.509 certificate profile. It is not obsoleted, and its updates do not change this. "The site's ID" is an everyday word for the subject binding.

### units[0].learn.terms[6] ("term-ca") — ✅

- `rfc-5280` §3
  > CAs are responsible for indicating the revocation status of the
  > certificates that they issue.
- `rfc-9846` §C.2
  > certificates should always be verified to ensure
  > proper signing by a trusted certificate authority (CA).
- Note: Two independent RFCs.

### units[0].learn.terms[7] ("term-finished") — ✅

- `rfc-9846` §4.5.3
  > The Finished message is the final message in the Authentication
  > Block.  It is essential for providing authentication of the handshake
  > and of the computed keys.
- `rfc-9846` §2
  > Authentication: Authenticate the server (and, optionally, the
  > client) and provide key confirmation and handshake integrity.
- Note: RFC 9846 defines the Finished message.

### units[0].learn.terms[8] ("term-close") — ✅

- `rfc-9846` §6.1
  > close_notify:  This alert notifies the recipient that the sender will
  > not send any more messages on this connection.
- `rfc-9846` §6
  > Like other messages, alert messages are encrypted as
  > specified by the current connection state.
- Note: RFC 9846 defines close_notify.

### units[0].learn.pattern ("pattern") — ✅

- `rfc-9846` §2
  > Figure 1: Message Flow for Full TLS Handshake
- `rfc-9846` §2.2
  > As the server is authenticating via a PSK, it does not send a
  > Certificate or a CertificateVerify message.
- `rfc-9846` §4.7
  > TLS also allows other messages to be sent after the main handshake.
- `rfc-9846` §4.5.3
  > Once a side has sent its Finished message and has received and
  > validated the Finished message from its peer, it may begin to send
  > and receive Application Data over the connection.
- `rfc-9846` §6.1
  > Each party MUST send a "close_notify" alert before closing its write
  > side of the connection, unless it has already sent some error alert.
- Note: RFC 9846 defines the flow. Figure 1 in §2 shows ClientHello, ServerHello, Certificate, CertificateVerify, Finished, then Application Data. The pattern leaves out EncryptedExtensions and CertificateVerify, and full handshakes that don't use certificates (raw public keys), which is allowed.

### units[0].learn.why[0] ("why-1") — ✅

- `rfc-9846` §1
  > Authentication: The server side of the channel is always
  > authenticated; the client side is optionally authenticated.
  > …
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
  > …
  > Integrity: Data sent over the channel after establishment cannot
  > be modified by attackers without detection.
- Note: RFC 9846 defines TLS and states these three properties. "Any app" matches its "TLS is application protocol independent".

### units[0].learn.why[1] ("why-2") — ✅

- `rfc-9325` §1
  > Transport Layer Security (TLS) and Datagram Transport Layer Security
  > (DTLS) are used to protect data exchanged over a wide variety of
  > application protocols, including HTTP [RFC9112] [RFC9113], IMAP
  > [RFC9051], Post Office Protocol (POP) [STD53], SIP [RFC3261], SMTP
  > [RFC5321]
- `nist-sp800-77r1` §8.2
  > Although these are still called
  > SSL VPNs, they now use the TLS protocol rather than the older SSL protocol.
- `nist-sp800-52r2` §1
  > TLS is
  > application-independent and used to provide security to any two communicating applications that
  > transmit data over a network via an application protocol.
- `rfc-9846` §1
  > TLS is application protocol independent; higher-level protocols can
  > layer on top of TLS transparently.
- `microsoft-ms-sstp` §1.3 Overview
  > When a client establishes an SSTP-based VPN connection
- Note: HTTPS and email: RFC 9325 and NIST SP 800-52r2. VPNs: NIST SP 800-77r1 and Microsoft's SSTP specification, which says the SSTP tunnel runs over SSL/TLS. Each part has two independent sources. RFC 9325 is updated by RFC 9852 and RFC 10015, which leave §1 as it is.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

- `nist-sp800-52r2` §1.1
  > The Secure Sockets Layer (SSL) protocol was designed by the Netscape Corporation to meet the
  > security needs of client and server applications.
  > …
  > SSL 2.0
  > was released in 1995 but had well-known security vulnerabilities, which were addressed by the
  > 1996 release of SSL 3.0.
- `rfc-6176` §6.2
  > Hickman, Kipp, "The SSL Protocol", Netscape
  > Communications Corp., Feb 9, 1995.
- `rfc-7568` §1
  > Since it was released in 1996, the SSLv3 protocol [RFC6101] has been
- Note: Three independent sources. RFC 6176 and RFC 7568 are updated by RFC 8996 but are not obsoleted.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

- `rfc-8996` §Abstract
  > TLS version 1.2 became the recommended version for IETF protocols in
  > 2008 (subsequently being obsoleted by TLS version 1.3 in 2018)
- `rfc-9325` §3.1.1
  > TLS 1.0 (published in 1999)
- `rfc-9846` §12.2
  > RFC 2246, DOI 10.17487/RFC2246, January 1999,
- `rfc-9325` §8.1
  > Version 1.3", RFC 8446, DOI 10.17487/RFC8446, August 2018,
- `microsoft-sql-tls-1-3` §Differences between TLS 1.2 and TLS 1.3
  > TLS 1.3 reduces the number of round trips from two to one during the handshake phase
- `paloalto-tls-handshake` §TLS Handshake FAQs
  > A standard TLS 1.2 handshake takes approximately two round trips between the client and server, while TLS 1.3 reduces this to one.
- `nist-sp800-52r2` §1.1
  > the removal of cipher suites that use RSA key transport
  > …
  > the CBC mode of operation, or SHA-1.
- `rfc-9846` §1.3
  > Static RSA and Diffie-Hellman cipher suites have been removed
- Note: RFC 9846 §1.3 lists what TLS 1.3 changed.
- `rfc-9846` §E.5
  > Implementations MUST NOT offer or
  > negotiate RC4 cipher suites for any version of TLS for any reason.
- Note: RFC 9846 Appendix E.5 sets the RC4 ban for every version. §1.3 adds that TLS 1.3 kept only AEAD algorithms. Dates: 1999 (RFC 9325, RFC 9846), 2008 (RFC 8996, RFC 9325), 2018 (RFC 8996, RFC 9325). The claim leaves out TLS 1.1 (2006), which is allowed.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ✅

- `paloalto-tls-certificate` §TLS vs SSL Certificates
  > While the term "SSL certificate" is still widely used in marketing, the SSL (Secure Sockets Layer) protocol is technically obsolete.
- `microsoft-app-service-certificates` §Add and manage TLS/SSL certificates in Azure App Service
  > The certificates are currently called Transport Layer Security (TLS) certificates. They were previously known as Secure Sockets Layer (SSL) certificates.
- Note: Two vendors' pages. Palo Alto says the term is still widely used. Microsoft's page gives the old name and still titles itself "TLS/SSL certificates". Both pages are live explainers or documentation.

### units[0].learn.deep[3] ("deep-4", Learn's Go deeper) — ✅

- `rfc-9846` §4.4.2
  > A server which is authenticating with a certificate MAY optionally
  > request a certificate from the client.
- `cloudflare-client-certificates` §Client certificates (mTLS)
  > Mutual TLS (mTLS) adds a second check: the server also verifies the client's identity using a client certificate.
- `paloalto-tls-handshake` §TLS Handshake FAQs
  > In a two-way handshake, also known as Mutual TLS (mTLS), both the client and the server must present certificates.
- Note: RFC 9846 defines the CertificateRequest. Two vendors name it mTLS.

### units[0].learn.facts[0] ("fact-current") — ✅

- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
  > (TLS) protocol.
- `rfc-9852` §1
  > TLS 1.3 [TLS13] is in widespread use
  > …
  > TLS 1.2 [TLS12] is in use and can be configured such that it provides
  > good security properties.
- `rfc-9325` §3.1.1
  > Implementations SHOULD support TLS 1.3 [RFC8446] and, if
  > implemented, MUST prefer to negotiate TLS 1.3 over earlier
  > versions of TLS.
- Note: RFC 9846 (July 2026) defines TLS 1.3 and obsoletes RFC 8446.

### units[0].learn.facts[1] ("fact-retired") — ✅

- `rfc-9846` §E.5
  > The security of SSL 2.0 [SSL2], SSL 3.0 [RFC6101], TLS 1.0 [RFC2246],
  > and TLS 1.1 [RFC4346] are considered insufficient
- `rfc-8996` §Abstract
  > This document formally deprecates Transport Layer Security (TLS)
  > versions 1.0 (RFC 2246) and 1.1 (RFC 4346).
- `rfc-9325` §3.1.1
  > Implementations MUST NOT negotiate SSL version 2.
  > …
  > Implementations MUST NOT negotiate SSL version 3.
- Note: RFC 9846 Appendix E.5 sets the rule that none of these may be negotiated.

### units[0].learn.facts[2] ("fact-gives") — ✅

- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
  > …
  > Integrity: Data sent over the channel after establishment cannot
  > be modified by attackers without detection.
- Note: RFC 9846 §1 defines TLS's goals, authentication among them (quoted under why-1).

### units[0].learn.facts[3] ("fact-certs") — ✅

- `rfc-9846` §4.5.1.2
  > The certificate type MUST be X.509v3 [RFC5280], unless explicitly
  > negotiated otherwise
- `rfc-5280` §3.1
  > The binding is asserted by having a trusted CA
  > digitally sign each certificate.
- Note: RFC 9846 defines which certificates TLS uses. RFC 5280 defines the X.509 profile.

### units[0].learn.facts[4] ("fact-defined") — ✅

- `rfc-9846` §Abstract
  > This document obsoletes RFC 8446, which specified TLS 1.3.
- Note: RFC 9846 is the current definition of TLS 1.3. Its info page lists no RFC that obsoletes it.

### units[0].learn.facts[5] ("fact-handshake") — ✅

- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
- `rfc-9846` §2
  > Upon receiving the server's messages, the client responds with
  > its Authentication messages, namely Certificate and CertificateVerify (if
  > requested), and Finished.
- `rfc-9846` §4.2.1
  > A list of cipher suites which indicates the AEAD algorithm/HKDF
  > hash pairs which the client supports.
- `rfc-9846` §2.3
  > the 0-RTT data is just added to the 1-RTT
  > handshake in the first flight.
- `rfc-9112` §9.7
  > It initiates a
  > connection to the server on the appropriate port and sends the TLS
  > ClientHello to begin the TLS handshake.
- `rfc-9001` §1
  > Absent packet loss, most new
  > connections can be established and secured within a single round
  > trip
- Note: RFC 9846 §2 also lists the server's Certificate, CertificateVerify and Finished, and says everything after the key-exchange phase is encrypted (quoted under lead-1). The claim leaves out EncryptedExtensions and QUIC, where TLS 1.3 runs over UDP (RFC 9001). Over HTTPS on TCP, as here, it holds.

### units[0].learn.facts[6] ("fact-runs-on") — ✅

- `rfc-9846` §1
  > the only requirement from the underlying
  > transport is a reliable, in-order data stream.
- `nist-sp800-52r2` §1
  > TLS is a layered protocol that runs on top of a reliable transport protocol—typically the
  > Transmission Control Protocol (TCP).
- `microsoft-tls-protocol` §Transport Layer Security protocol
  > The TLS (and SSL) protocols are located between the application protocol layer and the TCP/IP layer
- `microsoft-tls-protocol` §Transport Layer Security protocol
  > TLS and SSL assume that a connection-oriented transport, typically TCP, is in use.
- `rfc-9293` §3.5
  > The "three-way handshake" is the procedure used to establish a
  > connection.
- `rfc-9293` §3.1
  > No more data from sender.
- `rfc-9293` §3.6
  > The remote TCP endpoint initiates by sending a FIN control signal
- `rfc-9112` §9.7
  > When the TLS handshake has
  > finished, the client may then initiate the first HTTP request.
- Note: RFC 9293 defines TCP's handshake and FIN. NIST and Microsoft independently place TLS on TCP, below the application. The claim leaves out QUIC.

### units[0].learn.facts[7] ("fact-inside") — ✅

- `rfc-9112` §9.7
  > All
  > HTTP data MUST be sent as TLS "application data"
- `rfc-9110` §4.2.2
  > If the port
  > subcomponent is empty or not given, TCP port 443 (the reserved port
  > for HTTP over TLS) is the default.
- `rfc-9112` §3
  > A request-line begins with a method token, followed by a single space
  > (SP), the request-target
- `rfc-9110` §15.3.1
  > The 200 (OK) status code indicates that the request has succeeded.
- `iana-ports` §Registry
  > http protocol over TLS/SSL
- Note: The IANA registry (updated 2026-11-10) lists https on TCP port 443. RFC 9110 and RFC 9112 define HTTPS and HTTP/1.1.

### units[0].learn.facts[8] ("fact-used") — ✅

- `rfc-9325` §1
  > are used to protect data exchanged over a wide variety of
  > application protocols, including HTTP [RFC9112] [RFC9113], IMAP
- `rfc-9112` §9.7
  > Conceptually, HTTP/TLS is simply sending HTTP messages over a
  > connection secured via TLS [TLS13].
- `rfc-8314` §1
  > This specification describes current
  > recommendations for the use of TLS in interactions between Mail User
  > Agents (MUAs) and Mail Access Servers, and also between MUAs and Mail
  > Submission Servers.
- `nist-sp800-77r1` §8.2
  > Although these are still called
  > SSL VPNs, they now use the TLS protocol rather than the older SSL protocol.
- `microsoft-ms-sstp` §1.3 Overview
  > When a client establishes an SSTP-based VPN connection
- Note: RFC 8314 (updated by RFC 8997, not obsoleted) defines TLS for email submission and access. Each use has two independent sources.

### units[0].learn.facts[9] ("fact-sni") — ✅

- `rfc-9849` §1
  > The
  > plaintext Server Name Indication (SNI) extension in ClientHello
  > messages, which leaks the target domain for a given connection
- `rfc-6066` §3
  > to facilitate secure connections to
  > servers that host multiple 'virtual' servers at a single underlying
  > network address.
- `rfc-9846` §4.5.1.2
  > The "server_name" [RFC6066] extension is used to guide certificate
  > selection.
- Note: RFC 6066 §3 defines SNI and is updated by RFC 9846 and RFC 9325, which leave this as it is. "In plain text" leaves out Encrypted Client Hello, which is not yet the ordinary case.

### units[0].learn.facts[10] ("fact-kx") — ✅

- `rfc-10024` §Abstract
  > that combine the post-quantum ML-KEM (Module-Lattice-Based Key
  > Encapsulation Mechanism) with an ECDHE (Ephemeral Elliptic Curve
  > Diffie-Hellman) exchange.
- `rfc-10024` §2
  > The first group uses X25519 [RFC7748], is widely deployed
- `cloudflare-pqc-support` §Browsers
  > Default in Chrome 131+
- Note: RFC 10024 defines X25519MLKEM768. "Usually X25519" rests on RFC 10024's "widely deployed". The browser default rests on Cloudflare's list (Chrome, Edge, Firefox, Safari), backed by RFC 10024.

### units[0].learn.facts[11] ("fact-fs") — ✅

- `rfc-9846` §4.3.8
  > Clients and Servers MUST NOT reuse a key share for multiple
  > connections.
- `rfc-9846` §F.1
  > Forward secret with respect to long-term keys:  If the long-term
  > keying material
  > …
  > is compromised after the
  > handshake is complete, this does not compromise the security of
  > the session key
- Note: RFC 9846 §4.3.8 defines the key share rules.

### units[0].learn.facts[12] ("fact-keys") — ✅

- `rfc-9846` §7.3
  > [sender] denotes the sending side.
- `rfc-9846` §F.1.1
  > Key derivation in TLS 1.3 uses HKDF as defined in [RFC5869]
- `rfc-5869` §Abstract
  > This document specifies a simple Hashed Message Authentication Code
  > (HMAC)-based key derivation function (HKDF)
- Note: RFC 9846 §7.3 defines the per-direction traffic keys. RFC 5869 defines HKDF.

### units[0].learn.facts[13] ("fact-checks") — ✅

- `rfc-9525` §6.3
  > This section describes how the client must determine if the presented
  > DNS name matches the reference DNS name.
- Note: RFC 9525 (current; it obsoletes RFC 6125) defines how a TLS client matches the name.
- `rfc-5280` §6.1.3
  > The signature on the certificate can be verified using
  > …
  > The certificate validity period includes the current time.
  > …
  > At the current time, the certificate is not revoked.
- `rfc-5280` §6.1
  > certificate 1 is issued by the trust anchor;
- Note: RFC 5280 §6.1 defines path validation.
- `rfc-9846` §C.2
  > certificates should always be verified to ensure
  > proper signing by a trusted certificate authority (CA).
- `nist-sp800-52r2` §4.2.2
  > The client shall perform revocation checking of the server certificate.

### units[0].learn.facts[14] ("fact-chain") — ✅

- `rfc-5280` §3.2
  > In general, a chain of multiple certificates
- `rfc-5280` §6.1
  > for all x in {1, ..., n-1}, the subject of certificate x is
  > the issuer of certificate x+1;
- `google-chrome-secure` §Resolve security and connection issues
  > Chrome will add custom root certificates from the certificates used by your computer's operating system.
- `rfc-9846` §4.5.1
  > Each following certificate SHOULD
  > directly certify the one immediately preceding it.
- Note: RFC 9846 §4.5.1 defines the chain order. RFC 5280 and Chrome's help page independently describe a chain ending at a trusted root that the browser or the system holds. A chain may hold more than one intermediate. One intermediate is the ordinary case.

### units[0].learn.facts[15] ("fact-certverify") — ✅

- `rfc-9846` §4.5.2
  > This message is used to provide explicit proof that an endpoint
  > possesses the private key corresponding to its certificate.
  > …
  > The private signing key corresponding to the certificate sent in
  > the previous message
- `rfc-9846` §4.3.3
  > /* ECDSA algorithms */
  > ecdsa_secp256r1_sha256(0x0403),
  > ecdsa_secp384r1_sha384(0x0503),
- Note: RFC 9846 defines CertificateVerify and its signature schemes. §4.5.2 also says the signature covers the transcript hash of the handshake so far.

### units[0].learn.facts[16] ("fact-rtt") — ✅

- `rfc-9846` §2.3
  > the 0-RTT data is just added to the 1-RTT
  > handshake in the first flight.
- `microsoft-sql-tls-1-3` §Differences between TLS 1.2 and TLS 1.3
  > TLS 1.3 reduces the number of round trips from two to one during the handshake phase
- `paloalto-tls-handshake` §TLS Handshake FAQs
  > A standard TLS 1.2 handshake takes approximately two round trips between the client and server, while TLS 1.3 reduces this to one.
- Note: Two independent vendors state both numbers. RFC 9846 names the ordinary handshake "1-RTT".

### units[0].learn.facts[17] ("fact-records") — ✅

- `rfc-9846` §5.1
  > The record layer fragments information blocks into TLSPlaintext
  > records carrying data in chunks of 2^14 bytes or less.
- `rfc-9846` §5.2
  > If the decryption fails, the receiver MUST terminate the connection
  > with a "bad_record_mac" alert.
- `rfc-9846` §5.3
  > A 64-bit sequence number is maintained separately for reading and
  > writing records.
- `rfc-9846` §9.1
  > A TLS-compliant application MUST implement the
  > TLS_AES_128_GCM_SHA256 [GCM] cipher suite and SHOULD implement the
  > TLS_AES_256_GCM_SHA384 [GCM] and TLS_CHACHA20_POLY1305_SHA256
  > [RFC8439] cipher suites
- `rfc-9846` §F.2
  > Order protection/non-replayability:  An attacker should not be able
  > to cause the receiver to accept a record which it has already
  > accepted or cause the receiver to accept record N+1 without having
  > first processed record N.
- `rfc-5116` §5.1
  > The AEAD_AES_128_GCM authenticated encryption algorithm works as
  > specified in [GCM], using AES-128 as the block cipher
- Note: RFC 9846 defines the record layer. RFC 5116 defines the AES-GCM AEAD. The claim leaves out the two rarely used CCM suites.

### units[0].learn.facts[18] ("fact-0rtt") — ✅

- `rfc-9846` §2.3
  > TLS 1.3 allows clients to send data on the
  > first flight ("early data").
  > …
  > There are no guarantees of non-replay between connections.
- `rfc-9846` §2.2
  > PSKs can also be
  > established in a previous connection and then used to establish a new
  > connection ("session resumption" or "resuming" with a PSK).
- Note: RFC 9846 defines 0-RTT. An external PSK can also carry 0-RTT, a rarer case the claim leaves out.

### units[0].learn.facts[19] ("fact-trunc") — ✅

- `rfc-9846` §6.1
  > If a transport-level close is
  > received prior to a "close_notify", the receiver cannot know that all
  > the data that was sent has been received.
- `rfc-9846` §6
  > Alerts are divided into two classes: closure alerts and
  > error alerts.
- `rfc-6176` §2
  > Sessions can be easily terminated.
- Note: RFC 9846 §6 defines alerts.

### units[0].learn.facts[20] ("fact-stands") — ✅

- `rfc-9846` §Abstract
  > This document specifies version 1.3 of the Transport Layer Security
  > (TLS) protocol.
- `nist-sp800-77r1` §8.2
  > Although these are still called
  > SSL VPNs, they now use the TLS protocol rather than the older SSL protocol.
- `microsoft-app-service-certificates` §Add and manage TLS/SSL certificates in Azure App Service
  > They were previously known as Secure Sockets Layer (SSL) certificates.
- `paloalto-tls-certificate` §TLS vs SSL Certificates
  > TLS (Transport Layer Security) is the modern, more secure successor.
- `nist-sp800-52r2` §1.1
  > While TLS 1.0 is based on
  > SSL 3.0
- Note: Calling SSL "its old name" is loose: SSL was the earlier protocol that TLS replaced. The lesson also says SSL's versions are retired, so a beginner is not misled.

### units[0].learn.facts[21] ("fact-purpose") — ✅

- `rfc-9846` §1
  > The primary goal of TLS is to provide a secure channel between two
  > communicating peers
- Note: RFC 9846 §1 defines TLS's goal and lists confidentiality, integrity and server authentication.

### units[0].learn.facts[22] ("fact-hello") — ✅

- `rfc-9846` §2
  > which contains a random nonce
  > (ClientHello.random); its offered protocol versions; a list of
  > symmetric cipher/hash pairs; either a list of asymmetric key exchange
  > shares
- `rfc-9846` §4.3.8
  > Selecting a group based on KeyShareEntry may result in the use of a
  > less preferred group than the client and server mutually support,
  > though saving the round trip of HelloRetryRequest.
- `rfc-9846` §4.2.1
  > the server MUST respond with a HelloRetryRequest
- Note: RFC 9846 defines the ClientHello. §4.3.8 also forbids reusing a key share across connections.

### units[0].learn.facts[23] ("fact-secret") — ✅

- `rfc-7748` §6.1
  > Using their generated values and the received input, Alice computes
  > X25519(a, K_B) and Bob computes X25519(b, K_A).
- `rfc-9846` §F.1
  > The shared session keys should be known
  > only to the communicating parties and not to the attacker
- Note: Two independent RFCs. This is the Diffie-Hellman half. With ML-KEM, the server's part travels as a ciphertext that only the client can open, so the beginner's picture still holds.

### units[0].learn.facts[24] ("fact-why-cert") — ✅

- `rfc-9846` §C.5
  > Using a public key contained in a certificate but without
  > validation of the certificate chain or any of its contents.
  > Either technique used alone is vulnerable to man-in-the-middle
  > attacks
- `microsoft-app-service-certificates` §Frequently asked questions
  > The certificate authenticates your app through a separate part of the TLS handshake.
- Note: RFC 9846 Appendix C.5 says what happens without certificate validation.

### units[0].learn.facts[25] ("fact-sent") — ✅

- `rfc-9846` §4.5.1
  > The sender's certificate MUST come in the first
  > CertificateEntry in the list.  Each following certificate SHOULD
  > directly certify the one immediately preceding it.  Because
  > certificate validation requires that trust anchors be distributed
  > independently, a certificate that specifies a trust anchor MAY be
  > omitted from the chain
- Note: RFC 9846 §4.5.1 defines the Certificate message.

### units[0].learn.facts[26] ("fact-finished") — ✅

- `rfc-9846` §2
  > Finished:  A MAC (Message Authentication Code) over the entire
  > handshake.
- `rfc-9846` §4.5
  > Finished:  A MAC over the value Transcript-Hash(Handshake Context,
  > Certificate, CertificateVerify) using a MAC key derived from the
  > Base Key.
- `rfc-9846` §4.5.3
  > Recipients of Finished messages MUST verify that the contents are
  > correct and if incorrect MUST terminate the connection with a
  > "decrypt_error" alert.
- Note: RFC 9846 defines Finished. §4.5.3 shows that the MAC is an HMAC.

### units[0].practice[0].options[0] (question "same-secret") — ✅

- `rfc-9846` §F.1
  > The shared session keys should be known
  > only to the communicating parties and not to the attacker
- `rfc-7748` §6.1
  > Alice generates 32 random bytes in a[0] to a[31] and transmits K_A =
  > X25519(a, 9) to Bob
- Note: The option is wrong, and the feedback rightly says so. Only the public values are sent, and both sides compute the key.

### units[0].practice[0].options[1] (question "same-secret") — ✅

- `rfc-7748` §6.1
  > Both now share K = X25519(a, X25519(b, 9)) = X25519(b, X25519(a, 9))
  > as a shared secret.
- `rfc-9846` §F.1
  > Secrecy of the session keys:  The shared session keys should be known
  > only to the communicating parties and not to the attacker
- `rfc-9846` §2
  > The combination of the ClientHello and the
  > ServerHello determines the shared keys.
- Note: This is the right answer, and the feedback is correct.

### units[0].practice[0].options[2] (question "same-secret") — ✅

- `microsoft-app-service-certificates` §Frequently asked questions
  > X25519MLKEM768 combines classical and post-quantum key exchange to establish TLS keys. The certificate authenticates your app through a separate part of the TLS handshake.
- `rfc-9846` §2
  > If asymmetric key
  > establishment is in use, then the ServerHello contains a "key_share"
  > extension with the server's ephemeral asymmetric key exchange share
- Note: The option is wrong, and the feedback is correct.

### units[0].practice[1].options[0] (question "certificate-proves") — ✅

- `rfc-5280` §3.1
  > Users of a public key require confidence that the associated private
  > key is owned by the correct remote subject (person or system) with
  > which an encryption or digital signature mechanism will be used.
  > This confidence is obtained through the use of public key
  > certificates, which are data structures that bind public key values
  > to subjects.
- Note: RFC 5280 defines the certificate binding. This is the right answer, and the feedback is correct.

### units[0].practice[1].options[1] (question "certificate-proves") — ✅

- `rfc-5280` §3.1
  > certificates, which are data structures that bind public key values
  > to subjects.
- `microsoft-edge-secure` §Verify the connection icon in the address bar
  > However, even websites with valid certificates may have a poor reputation
- Note: The option is wrong, and the feedback is correct.

### units[0].practice[1].options[2] (question "certificate-proves") — ✅

- `rfc-9846` §1
  > Authentication: The server side of the channel is always
  > authenticated
- `microsoft-app-service-certificates` §Frequently asked questions
  > X25519MLKEM768 combines classical and post-quantum key exchange to establish TLS keys.
- Note: The option is wrong, and the feedback is correct. The keys come from the key exchange, and the certificate authenticates.

## Traced, example and analogy parts, and unbacked items

- title — ✅
- units[0].name — ✅
- backing (the lesson's subtitle and summary) — ✅
- units[0].backing (the unit's full name and purpose) — ✅
- units[0].scene.backing (the scene) — ✅ (The addresses are RFC 1918 and RFC 5737 example values. techconcepts.app is the lesson's own example server throughout.)
- units[0].overview.hookBacking (the Overview hook) — ✅
- units[0].overview.backing (the Overview description) — ✅ (The analogy of agreeing a code across a crowded room and showing an ID card does not mislead.)
- units[0].overview.facts[0] (Overview fact "Used by") — ✅
- units[0].overview.facts[1] (Overview fact "Current version") — ✅
- units[0].overview.facts[2] (Overview fact "SSL") — ✅
- units[0].overview.facts[3] (Overview fact "Proves identity with") — ✅
- units[0].overview.facts[4] (Overview fact "Sits") — ✅
- units[0].overview.facts[5] (Overview fact "This example") — ✅
- units[0].steps[0] (step "clienthello") — ✅
- units[0].steps[0].facts[0] (step "clienthello", fact "Versions") — ✅
- units[0].steps[0].facts[1] (step "clienthello", fact "Cipher suites") — ✅
- units[0].steps[0].facts[2] (step "clienthello", fact "Name (SNI)") — ✅
- units[0].steps[0].facts[3] (step "clienthello", fact "Key share") — ✅
- units[0].steps[0].events[0] (event "m1") — ✅ (The port, time and "3 cipher suites" are capture values for this example.)
- units[0].steps[0].events[1] (event "handshake-1") — ✅
- units[0].steps[1] (step "serverhello") — ⚠️ The narrative says "From this message on, everything the server sends is already encrypted." Read plainly, that includes the ServerHello itself, which is sent unencrypted: RFC 9846 §1.3 says only the handshake messages after the ServerHello are encrypted. The traced Learn part (fact-handshake) says only that everything after the key exchange is encrypted. Fix: "After this message, everything the server sends is encrypted."
- units[0].steps[1].facts[0] (step "serverhello", fact "Version") — ✅
- units[0].steps[1].facts[1] (step "serverhello", fact "Cipher suite") — ✅ (The suite name for AES-128-GCM is also stated in the ClientHello Go deeper.)
- units[0].steps[1].facts[2] (step "serverhello", fact "Key exchange") — ✅
- units[0].steps[1].facts[3] (step "serverhello", fact "Forward secrecy") — ✅
- units[0].steps[1].events[0] (event "m2") — ✅
- units[0].steps[1].events[1] (event "handshake-2") — ✅
- units[0].steps[1].events[2] (event "handshake-3") — ✅
- units[0].steps[1].events[3] (event "handshake-4") — ✅
- units[0].steps[2] (step "certificate-verification") — ✅
- units[0].steps[2].facts[0] (step "certificate-verification", fact "Certificate for") — ✅
- units[0].steps[2].facts[1] (step "certificate-verification", fact "Signed by") — ✅
- units[0].steps[2].facts[2] (step "certificate-verification", fact "Checks") — ✅
- units[0].steps[2].facts[3] (step "certificate-verification", fact "Proof of the key") — ✅
- units[0].steps[2].events[0] (event "m3") — ✅ ("chain of 2" matches fact-sent: the site's certificate and the intermediate, with the root left out.)
- units[0].steps[2].events[1] (event "handshake-5") — ✅
- units[0].steps[2].events[2] (event "handshake-6") — ✅
- units[0].steps[2].events[3] (event "m4") — ✅
- units[0].steps[2].events[4] (event "handshake-7") — ✅
- units[0].steps[3] (step "handshake-finished") — ✅
- units[0].steps[3].facts[0] (step "handshake-finished", fact "Server sends") — ✅
- units[0].steps[3].facts[1] (step "handshake-finished", fact "Browser sends") — ✅
- units[0].steps[3].facts[2] (step "handshake-finished", fact "Proves") — ✅
- units[0].steps[3].facts[3] (step "handshake-finished", fact "Round trips") — ✅
- units[0].steps[3].events[0] (event "m5") — ✅
- units[0].steps[3].events[1] (event "m6") — ✅
- units[0].steps[3].events[2] (event "handshake-8") — ✅
- units[0].steps[4] (step "encrypted-application-data") — ✅
- units[0].steps[4].facts[0] (step "encrypted-application-data", fact "Record type") — ✅
- units[0].steps[4].facts[1] (step "encrypted-application-data", fact "Cipher") — ✅
- units[0].steps[4].facts[2] (step "encrypted-application-data", fact "Each record") — ✅
- units[0].steps[4].facts[3] (step "encrypted-application-data", fact "Changed on the way?") — ✅
- units[0].steps[4].events[0] (event "m7") — ✅
- units[0].steps[4].events[1] (event "m8") — ✅ (The 18 KB reply is one HTTP message. The step's Go deeper says a message can span several records.)
- units[0].steps[5] (step "close-notify") — ✅
- units[0].steps[5].facts[0] (step "close-notify", fact "Alert") — ✅
- units[0].steps[5].facts[1] (step "close-notify", fact "Sent") — ✅
- units[0].steps[5].facts[2] (step "close-notify", fact "Stops") — ✅
- units[0].steps[5].facts[3] (step "close-notify", fact "Then") — ✅
- units[0].steps[5].events[0] (event "m9") — ✅
- units[0].steps[5].events[1] (event "m10") — ✅
- units[0].practice[0].prompt (question "same-secret") — ✅
- units[0].practice[1].prompt (question "certificate-proves") — ✅

## Sources

All checked 2026-11-12.

- cloudflare-client-certificates: live Cloudflare documentation describing a current product feature. Current.
- cloudflare-pqc-support: live Cloudflare documentation, last updated June 2026, listing current browser defaults. Current.
- google-chrome-secure: live Chrome Help page (computer version). Current.
- iana-ports: live IANA registry, XML form, last updated 2026-11-10. Current.
- microsoft-app-service-certificates: live Microsoft Learn documentation for a current product. Current.
- microsoft-edge-secure: live Microsoft Support page for current Edge. Current.
- microsoft-ms-sstp: live Microsoft Open Specifications page for SSTP. Current.
- microsoft-sql-tls-1-3: live Microsoft Learn page for SQL Server 2025 (ver17). Current.
- microsoft-tls-protocol: live Microsoft Learn page for Windows Server. Its RFC links name TLS 1.0 to 1.2, but its layering description is still accurate. Current.
- nist-sp800-52r2: final, August 2019. CSRC shows no withdrawal and no newer revision, only a May 2026 note that the publication is under review. Current.
- nist-sp800-77r1: final, June 2020. CSRC shows no withdrawal and no newer revision. Current.
- paloalto-tls-certificate: live Palo Alto Networks Cyberpedia explainer. Current.
- paloalto-tls-handshake: live Palo Alto Networks Cyberpedia explainer. Current.
- rfc-10024: Standards Track, August 2026. Not obsoleted. Current.
- rfc-5116: not obsoleted. Current.
- rfc-5280: not obsoleted. Updated by nine RFCs (RFC 6818, 8398, 8399, 9549, 9598, 9608, 9618, 9925 and 10007), none of which changes the passages cited. Current.
- rfc-5869: not obsoleted. Current.
- rfc-6066: not obsoleted. Updated by RFC 8446, 8449, 9325 and 9846, which leave SNI (§3) as it is. Current.
- rfc-6176: not obsoleted. Updated by RFC 8996. Current.
- rfc-6797: not obsoleted. Current.
- rfc-7568: not obsoleted. Updated by RFC 8996. Current.
- rfc-7748: not obsoleted (IRTF, Informational). Current.
- rfc-8314: not obsoleted. Updated by RFC 8997, which deprecates TLS 1.1 for email and leaves §1 as it is. Current.
- rfc-8996: not obsoleted. Current.
- rfc-9001: not obsoleted. Current.
- rfc-9110: not obsoleted. Current.
- rfc-9112: not obsoleted. Updated by RFC 9931, which does not touch §3 or §9.7. Current.
- rfc-9162: not obsoleted. Current.
- rfc-9293: not obsoleted. Current.
- rfc-9325: not obsoleted. Updated by RFC 9852 and RFC 10015. RFC 9852 now requires TLS 1.3 for new protocols, and neither changes the passages cited. Current.
- rfc-9525: not obsoleted. Current.
- rfc-9846: Standards Track, July 2026. Not obsoleted. Current.
- rfc-9849: not obsoleted. Current.
- rfc-9852: not obsoleted. Current.

## Limit overrides

None.
