```json fact-check
{
  "slug": "glossary/filtering",
  "hash": "e60accb79e7bb95f26a524a1b2af946efee2e989a36ffed88b3c5d12fae11c66",
  "checked": "2026-11-13",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "entry \"default-deny\": names": "✅",
    "entry \"default-deny\": statement \"default-deny-1\"": "✅",
    "entry \"default-deny\": statement \"default-deny-2\"": "✅",
    "entry \"default-deny\": statement \"default-deny-3\"": "✅",
    "entry \"default-deny\": lessons": "✅",
    "entry \"destination-address\": names": "✅",
    "entry \"destination-address\": statement \"destination-address-1\"": "✅",
    "entry \"destination-address\": statement \"destination-address-2\"": "✅",
    "entry \"destination-address\": statement \"destination-address-3\"": "✅",
    "entry \"firewall\": names": "✅",
    "entry \"firewall\": statement \"firewall-1\"": "✅",
    "entry \"firewall\": statement \"firewall-2\"": "✅",
    "entry \"firewall\": statement \"firewall-3\"": "✅",
    "entry \"firewall\": lessons": "✅",
    "entry \"firewall-rule\": names": "✅",
    "entry \"firewall-rule\": statement \"firewall-rule-1\"": "✅",
    "entry \"firewall-rule\": statement \"firewall-rule-2\"": "✅",
    "entry \"firewall-rule\": statement \"firewall-rule-3\"": "✅",
    "entry \"firewall-rule\": lessons": "✅",
    "entry \"first-match\": names": "✅",
    "entry \"first-match\": statement \"first-match-1\"": "✅",
    "entry \"first-match\": statement \"first-match-2\"": "✅",
    "entry \"first-match\": statement \"first-match-3\"": "✅",
    "entry \"first-match\": lessons": "✅",
    "entry \"nat\": names": "✅",
    "entry \"nat\": statement \"nat-1\"": "✅",
    "entry \"nat\": statement \"nat-2\"": "✅",
    "entry \"nat\": statement \"nat-3\"": "✅",
    "entry \"nat\": lessons": "✅",
    "entry \"port\": names": "✅",
    "entry \"port\": statement \"port-1\"": "✅",
    "entry \"port\": statement \"port-2\"": "✅",
    "entry \"port\": statement \"port-3\"": "✅",
    "entry \"port\": lessons": "✅",
    "entry \"private-address\": names": "✅",
    "entry \"private-address\": statement \"private-address-1\"": "✅",
    "entry \"private-address\": statement \"private-address-2\"": "✅",
    "entry \"private-address\": statement \"private-address-3\"": "✅",
    "entry \"public-address\": names": "✅",
    "entry \"public-address\": statement \"public-address-1\"": "✅",
    "entry \"public-address\": statement \"public-address-2\"": "✅",
    "entry \"shadowed-rule\": names": "✅",
    "entry \"shadowed-rule\": statement \"shadowed-rule-1\"": "✅",
    "entry \"shadowed-rule\": statement \"shadowed-rule-2\"": "✅",
    "entry \"shadowed-rule\": lessons": "✅",
    "entry \"source-address\": names": "✅",
    "entry \"source-address\": statement \"source-address-1\"": "✅",
    "entry \"source-address\": statement \"source-address-2\"": "✅",
    "entry \"source-address\": lessons": "✅",
    "entry \"stateful\": names": "✅",
    "entry \"stateful\": statement \"stateful-1\"": "✅",
    "entry \"stateful\": statement \"stateful-2\"": "✅",
    "entry \"stateful\": statement \"stateful-3\"": "✅",
    "entry \"stateful\": lessons": "✅"
  },
  "sources": [
    { "id": "google-cloud-firewall-insights", "current": true, "checked": "2026-11-13" },
    { "id": "iana-ports", "current": true, "checked": "2026-11-13" },
    { "id": "microsoft-azure-firewall-rule-sets", "current": true, "checked": "2026-11-13" },
    { "id": "microsoft-azure-nsg", "current": true, "checked": "2026-11-13" },
    { "id": "microsoft-windows-firewall", "current": true, "checked": "2026-11-13" },
    { "id": "microsoft-windows-firewall-rules", "current": true, "checked": "2026-11-13" },
    { "id": "nist-sp800-41r1", "current": true, "checked": "2026-11-13" },
    { "id": "paloalto-firewall", "current": true, "checked": "2026-11-13" },
    { "id": "paloalto-firewall-best-practices", "current": true, "checked": "2026-11-13" },
    { "id": "paloalto-firewall-rules", "current": true, "checked": "2026-11-13" },
    { "id": "paloalto-rulebase-best-practices", "current": true, "checked": "2026-11-13" },
    { "id": "paloalto-stateful-firewall", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-1812", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-1918", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-3022", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-4787", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-6335", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-768", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-791", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-8200", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-9293", "current": true, "checked": "2026-11-13" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-13",
    "count": 95,
    "digest": "b56484abe88ad62d532163f2896d474b2021948d05123df405ba5843cec1c856",
    "files": {
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6",
      "microsoft-azure-firewall-rule-sets": "db9b74abdc5f22e1f35078fffbee0f138ce831842b9b53e9466a5f5ac03f2f0f",
      "paloalto-rulebase-best-practices": "42451ba226f014952b7295f831733f5e1099a17a9d1ae173af9e7cf91336723c",
      "paloalto-firewall-best-practices": "1eb49f4e156dd1a5bc3d147804260606dadbbc35e061ca203bd1faf04b36419f",
      "microsoft-windows-firewall-rules": "f9ed5d3eafa5bb59ff15214f3a4430faad9ae9d87788e1e3ef1d4915b8e2a704",
      "paloalto-firewall-rules": "04c28c329928e5946902ed60b6cbb6d5b79b739e82680a42097d9032ebb45df6",
      "microsoft-azure-nsg": "f04ee67c87c7a95419a76b88437300db3edfdad897cfb44f95787b2b66e33870",
      "rfc-8200": "371ae3f133d562db5d6385e6def4ca9914c4f831be228ea7779fd28799c2f490",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "rfc-1812": "72c2c27fecd3eef085f978a8c0ee5f364877708bfc0251af1c8437b56ad2f56d",
      "microsoft-windows-firewall": "08602c7b4950d86a8aa55286e31d818c11ae9f1f5cb07426f1b51958766595cc",
      "paloalto-firewall": "858f34a43f8db1a4c4a361f6f9c1460c9b84a858dd88328e60c84cfc484df68e",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-6335": "a78d74017b69a480034b81a8951f05ea35841ae4769ab4fe9787ecc689fb783a",
      "rfc-768": "7dc8880e1ecef9c3f9da0db4b876a16e96bfa4f0953cc9d977d414f8f680c2f0",
      "iana-ports": "effec1145145a05374af14992086722392fe258e6f4ac69011c250bfd927a15b",
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "google-cloud-firewall-insights": "649469c50a4750d61611247e5a83f29f30cbff69a455efc1f8c275f5f21cf302",
      "paloalto-stateful-firewall": "2000b86119c32a7d6123186c24e079fa588d717fde82ff80c6484694b8591833"
    }
  },
  "items": {
    "entry \"default-deny\": names": "5622ba72ad752aec0eab0424cf431aad77cb4b46361e8e0c5fb9ac06c2f02046",
    "entry \"default-deny\": statement \"default-deny-1\"": "4ad3416932eaddc6c1e0a8e1c682a0ec52b17eb6ea57982037309b922270d403",
    "entry \"default-deny\": statement \"default-deny-2\"": "562195a4a8847eaa99bd865b7ef32815988fa8a9f48ef9dc19d8fb2dd9336b8b",
    "entry \"default-deny\": statement \"default-deny-3\"": "df86cae8b526c800d8176c72c3dbaeeee65d1ce87507128255fdfd790719e83b",
    "entry \"default-deny\": lessons": "3c8a6a513c795e98feabd6d2db025e2e265130ef4d025a11f69819f684a9d185",
    "entry \"destination-address\": names": "9114b15c63ae5eaf9bb55a25f0a909084f0c844976d0b909089b9e89544fe841",
    "entry \"destination-address\": statement \"destination-address-1\"": "c4d91633c1a1539cf02ea8edcb87beaae68604bcf7862e4b819144ffac9a9b74",
    "entry \"destination-address\": statement \"destination-address-2\"": "c06fa71de7ef6f8cabba48d769280a1f6fe4254911425b9f026feb0ac3d15e3f",
    "entry \"destination-address\": statement \"destination-address-3\"": "8caec6647457a209162e4ee8c61e13b8b5c8c177c4947560d705f0f4315f430f",
    "entry \"firewall\": names": "2fe702ebb8a0d41646f6d2110b7506610bc465721d0d70a83ec202b276e08c53",
    "entry \"firewall\": statement \"firewall-1\"": "98113768593a4b043384669893f405a743af633f499b8d4a925f0a09d59fb679",
    "entry \"firewall\": statement \"firewall-2\"": "b698fe78862ce64f2ca2b29a1c9e1df1b51785a4cf73681ff1d05b7a70b876a3",
    "entry \"firewall\": statement \"firewall-3\"": "4d64bbe968723c861063a13f5ba227a6c8307ee50047b92b32fa55572288da7e",
    "entry \"firewall\": lessons": "3871b3678dd38ee95c4324891e1414f2f7d8cfa64daaa6ea7b5279f39159f1a1",
    "entry \"firewall-rule\": names": "771d895bade22f7a5c6d09efcab0a358bcf6d6d806a1bb827a5b8c34aeb09701",
    "entry \"firewall-rule\": statement \"firewall-rule-1\"": "66ecc591e1738e4095c9aee22a1fabee44fa0de60ca114327c33d41e3e7b2d31",
    "entry \"firewall-rule\": statement \"firewall-rule-2\"": "1821adcfb67cc0a9ae85c1dc9af9aa81ac10ef425acc44d24158914a29ca066e",
    "entry \"firewall-rule\": statement \"firewall-rule-3\"": "41220f7829e6f679706a03f8170aa683aff6ec58795ab122a9f3e197e8825f03",
    "entry \"firewall-rule\": lessons": "bf702b49d75b34daf12fe9e3fba13e7f903ff652dc7eeb0b802181b1c444bf30",
    "entry \"first-match\": names": "d7795e0532769972f0dec5bbb88b20104764419807809353fc1e3063421883a4",
    "entry \"first-match\": statement \"first-match-1\"": "b80297079016d28e4f01a049865649473cf802ca944f67a5ab6dff26dc19cbf8",
    "entry \"first-match\": statement \"first-match-2\"": "5e636f775c2d3afc811292d5d37d1781f513bfbd9c71cb83f59203d6c164754d",
    "entry \"first-match\": statement \"first-match-3\"": "0b899a231b309bbf2154f4b9a03fab2bca5104e9d58654ebbd20e3e927517fc8",
    "entry \"first-match\": lessons": "6de8bbf34dde45c1236cee88429904caee277a035673de19a334ba13e30df4d2",
    "entry \"nat\": names": "879ed0452229982a883d9c96920db0eff8e11b63204741ce382818ae51c7c014",
    "entry \"nat\": statement \"nat-1\"": "426738eed3072a929ef1303fe75472d6227ec4b913f8d9b20143756f26f65a57",
    "entry \"nat\": statement \"nat-2\"": "c984fc9a3b15bb022d5e21de9b59b9fb77178782e88377c7cbf5989e9329cffb",
    "entry \"nat\": statement \"nat-3\"": "f202b008b9f5798080bf1acd676a5768a917fa0427ff0d929cb31292e90c3f58",
    "entry \"nat\": lessons": "25f2d0dfc50930441de0afc86e93619a4a0485e630ee4cb20ebd3179da8f2d04",
    "entry \"port\": names": "f705a74311b264c1bc6df3e22adb731e767eb1080c736f867d1037e02c3bb5ae",
    "entry \"port\": statement \"port-1\"": "b3e430f9416ae9e85e375323539bf174c52906544a685d65bf61f5efa60a7a32",
    "entry \"port\": statement \"port-2\"": "aba4caf29158618c6ca6047859ed6fa262d8c49b603ab1d1a0e9392aad7ef64d",
    "entry \"port\": statement \"port-3\"": "a61952d67f144575533e61c4872318be2bf1eac44c5f7a07a90b516ce0b99f29",
    "entry \"port\": lessons": "50aeaae391760de8a076a1624a67206468cb0644e89c788cf7ddf9966abf3c03",
    "entry \"private-address\": names": "dfae2d72188510be403ff89dc21e83a5087004e5db766786ce169f4c39e1ad50",
    "entry \"private-address\": statement \"private-address-1\"": "c886d8697fc7811b279018439cfb0b9c32e5fde512793ebc3c832b3901351cd8",
    "entry \"private-address\": statement \"private-address-2\"": "a77f4129407087ff842c38f7ca034f8c653b4696b54add688a674484d97c8abb",
    "entry \"private-address\": statement \"private-address-3\"": "745affbf962a317b1ee49b100b2ff6be09ddaee15c758e98fe2c1e78ad5c003a",
    "entry \"public-address\": names": "07cc94d0e3dc384db6e7d5c501d764425b22c06aed9565ca845c6859711e1037",
    "entry \"public-address\": statement \"public-address-1\"": "ff26c8e41af1e26948846abe34e38b80474a094678fc393f49e1c8d5b17f57d4",
    "entry \"public-address\": statement \"public-address-2\"": "98250694932408497d181cb3e090f5708a64e2c72a296b37fea1f63661f42b98",
    "entry \"shadowed-rule\": names": "93836075faa7c67e81a2904450fd77a8436e8e2fb21a2227c223260b9713e66e",
    "entry \"shadowed-rule\": statement \"shadowed-rule-1\"": "66ff1ca2660301c0d99df44362bf36742f8b6d0a84a7ff8283f9c076845707d9",
    "entry \"shadowed-rule\": statement \"shadowed-rule-2\"": "349ef9b1e221f19b1225111a095830dce5837ab3132f783d893e67e6cb701869",
    "entry \"shadowed-rule\": lessons": "9eed834c10a92edf8ba63a8f50d8dc6050e7117e22b6756769c9afb281b196cb",
    "entry \"source-address\": names": "eadea1bf9c3d53f4865c1187b3da04e6c88ef2a2b92fb3643f116a6e5253db47",
    "entry \"source-address\": statement \"source-address-1\"": "8f80e02f10b211778857065ffc97c9bc1d36735025f2e46d65d420c24b5bc4ca",
    "entry \"source-address\": statement \"source-address-2\"": "4f27eaaff5e50807511cb7d87a07a0e8e6e25103b7f3513d357f577fdad6bada",
    "entry \"source-address\": lessons": "35db8e5caff55299e7f277acfa99eb4ee00aa7fd0241c3485b4868c0e7dfaea5",
    "entry \"stateful\": names": "8c46276a3d812ce3d0040001ef1420c635f38e067050c0b5d45670e0061cd96d",
    "entry \"stateful\": statement \"stateful-1\"": "b1344a9a3001a4115511c311727bd8387652e7eb66fbf12ae4df5f803dc16994",
    "entry \"stateful\": statement \"stateful-2\"": "5a3280ad42ca537e538f1794748233590bbdebf77cad755e8a6c3ac4b0495a61",
    "entry \"stateful\": statement \"stateful-3\"": "4ba487ad61cb87c8a23491e0559ac00114f8666ca6e12d5a1c0fa31ca374d957",
    "entry \"stateful\": lessons": "c8ff42b46e791e9f298ae612166e1a6ee8e1e0290aa07496bbe282c0bb60f4a7"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: glossary group `filtering`

Checked on 2026-11-13 by a fresh fact-checker, from the claim sheet and the publishers' own pages only. Every source was fetched in this run: the RFCs as raw text from the RFC Editor, NIST SP 800-41r1 as the PDF from nvlpubs.nist.gov (text extracted with `pdftotext -raw`), the IANA registry in its text form, and the vendor pages as HTML from Microsoft Learn, Google Cloud docs and Palo Alto Networks.

Result: 54 items, 54 ✅, 0 ⚠️, 0 ❌.

## 1. The claims

### entry "default-deny": statement "default-deny-1" — ✅

Text: "Default deny, or deny by default, is a firewall policy of blocking all traffic that no rule expressly allows."

- `nist-sp800-41r1` §4
  > Generally, firewalls should block all inbound and outbound traffic that has not been expressly permitted by the firewall policy—traffic that is not needed by the organization. This practice, known as deny by default, decreases the risk of attack
- `microsoft-azure-firewall-rule-sets` §Rules
  > The firewall processes rules in a top-down approach, evaluating all traffic against the defined rules to determine if it matches an allow or deny condition. If no rule allows the traffic, it's denied by default.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > If no rule matches the traffic, the firewall drops the traffic (implicit deny).
- `paloalto-firewall-best-practices` §2. Enforce a default-deny policy with least privilege
  > Enforce a default-deny policy with least privilege
  > The safest firewall policy starts with one principle: block everything by default. Nothing passes unless it's explicitly required.
- Note: Confirmed by two independent publishers, NIST and Microsoft; the two Palo Alto pages count as one more. NIST gives the name "deny by default" and Palo Alto gives "default-deny".
- Note: Currency: NIST SP 800-41 Rev. 1 is the current revision (CSRC lists it as final, superseding the 2002 original, with no withdrawal); the Microsoft and Palo Alto pages are live.

### entry "default-deny": statement "default-deny-2" — ✅

Text: "It is safer than allowing everything that is not forbidden."

- `nist-sp800-41r1` §4
  > Because of the dynamic nature of hosts, networks, protocols, and applications, deny by default is a more secure approach than permitting all traffic that is not explicitly forbidden.
- `microsoft-windows-firewall-rules` §Applications rules
  > The firewall's default settings are designed for security. Allowing all inbound connections by default introduces the network to various threats.
- Note: NIST says it directly; Microsoft says the reverse policy (allowing by default) exposes the network to threats, which states the same comparison from the other side.
- Note: Currency: both sources current and live on 2026-11-13.

### entry "default-deny": statement "default-deny-3" — ✅

Text: "Many firewalls do it with a last rule, at the bottom of the list, that denies all remaining traffic."

- `paloalto-firewall-rules` §Firewall Rules Order
  > Catch-All Deny Rule: Positioned at the bottom, this rule ensures any traffic not explicitly allowed by previous rules is denied by default, enforcing a least privilege approach.
- `microsoft-azure-nsg` §Security rules
  > Azure default security rules are given the lowest priority (highest number) to ensure your custom rules are always processed first.
- `microsoft-azure-nsg` §Default security rules
  > DenyAllInbound Priority Source Source ports Destination Destination ports Protocol Access 65500 0.0.0.0/0 0-65535 0.0.0.0/0 0-65535 Any Deny
- Note: Two independent publishers (Palo Alto and Microsoft). The claim says "many", which leaves room for firewalls that apply the deny as a built-in default action rather than a visible rule (Palo Alto's rulebase page calls it an implicit deny; Windows Firewall has a default block setting).
- Note: Currency: both pages live on 2026-11-13.

### entry "destination-address": statement "destination-address-1" — ✅

Text: "A packet’s destination address is the IP address of the device it is meant for, carried in the packet’s IP header."

- `rfc-8200` §3
  > Destination Address 128-bit address of the intended recipient of the packet
- `nist-sp800-41r1` §2.1.1
  > The packet’s destination address—the address of the host the packet is trying to reach
- `rfc-791` §3.1
  > Destination Address: 32 bits The destination address. See section 3.2.
- Note: RFC 791 (Internet Standard) defines the IPv4 header format, including its Destination Address field; RFC 8200 does the same for IPv6. The defining marker on RFC 791 §3.1 is correct.
- Note: Loosely said: with an IPv6 Routing header the destination field may name an intermediate hop rather than the final recipient; the ordinary case is as stated.
- Note: Currency: RFC 791 is not obsoleted (updated by RFC 1349, 2474 and 6864, none touching the address fields); RFC 8200 is not obsoleted (updated by RFC 9673, on hop-by-hop options only).

### entry "destination-address": statement "destination-address-2" — ✅

Text: "Routers look it up to forward the packet toward that device."

- `rfc-1812` §5.2.1.2
  > The forwarder determines the next hop IP address for the packet, usually by looking up the packet's destination in the router's routing table.
- `rfc-791` §1.4
  > The internet modules use the addresses carried in the internet header to transmit internet datagrams toward their destinations. The selection of a path for transmission is called routing.
- Note: RFC 1812 defines the requirements for IPv4 routers, including the unicast forwarding procedure in §5.2.1.2; RFC 791 defines IP and its use of header addresses for routing. Both defining markers are correct.
- Note: Currency: RFC 1812 is not obsoleted (updated by RFC 2644 and RFC 6633, on directed broadcasts and Source Quench, which do not affect this); RFC 791 is not obsoleted.

### entry "destination-address": statement "destination-address-3" — ✅

Text: "Firewall rules can match on it, to allow or block traffic by where it is going."

- `nist-sp800-41r1` §2.1.1
  > This provides network access control based on several pieces of information contained in a packet, including:
  > …
  > The packet’s destination address—the address of the host the packet is trying to reach
- `microsoft-windows-firewall` §Windows Firewall overview
  > This traffic can be filtered based on several criteria, including source and destination IP address, IP protocol, or source and destination port number.
- `paloalto-firewall-rules` §What Are Firewall Rules?
  > They play an essential role in network security by dictating how firewalls should handle traffic based on parameters such as source or destination IP addresses, ports, and protocols.
- Note: Currency: all three current or live on 2026-11-13.

### entry "firewall": statement "firewall-1" — ✅

Text: "A firewall is a device or program that controls which network traffic may pass between networks or computers."

- `nist-sp800-41r1` §2
  > Firewalls are devices or programs that control the flow of network traffic between networks or hosts that employ differing security postures.
- `paloalto-firewall` §What Is a Firewall?
  > Firewalls act as barriers between private and external networks, checking and filtering data based on set security rules.
- `microsoft-windows-firewall` §Windows Firewall overview
  > Windows Firewall is a security feature that helps to protect your device by filtering network traffic that enters and exits your device.
- Note: Leaves out NIST's qualifier that the networks or hosts have differing security postures; a beginner is not misled.
- Note: Currency: all three current or live on 2026-11-13.

### entry "firewall": statement "firewall-2" — ✅

Text: "It checks traffic against its rules, which look at details such as addresses, protocols and ports, and allows or blocks it."

- `paloalto-firewall` §What do firewalls do, and how do they work?
  > To break it down further, a firewall uses rules to make those decisions. Rules can be based on IP addresses, protocols, ports, or other packet-level details. If a packet violates the rules, the firewall blocks it.
- `nist-sp800-41r1` §2.1.1
  > Their access control functionality is governed by a set of directives referred to as a ruleset.
- `microsoft-windows-firewall` §Windows Firewall overview
  > This traffic can be filtered based on several criteria, including source and destination IP address, IP protocol, or source and destination port number. Windows Firewall can be configured to block or allow network traffic based on the services and applications that are installed on your device.
- Note: "such as" leaves room for the further details (applications, users, content) that more advanced firewalls use.
- Note: Currency: all three current or live on 2026-11-13.

### entry "firewall": statement "firewall-3" — ✅

Text: "It may guard the edge of a network or run as software on one computer, as Windows Firewall does."

- `nist-sp800-41r1` §2.1
  > Firewalls are often placed at the perimeter of a network.
- `nist-sp800-41r1` §2.2.1
  > These firewalls are software-based, residing on the hosts they are protecting—each monitors and controls the incoming and outgoing network traffic for a single host.
- `paloalto-firewall` §Perimeter firewall
  > Placed at the edge of a network to manage traffic entering or leaving.
- `paloalto-firewall` §Host-based firewall
  > Installed on a specific device to monitor traffic to and from that host.
- `microsoft-windows-firewall` §Windows Firewall overview
  > Windows Firewall is a host-based firewall that is included with the operating system and enabled by default on all Windows editions.
- Note: Leaves out other placements (internal and cloud firewalls); "may" keeps it true.
- Note: Currency: all current or live on 2026-11-13.

### entry "firewall-rule": statement "firewall-rule-1" — ✅

Text: "A firewall rule is one entry in a firewall’s list of rules: it describes some traffic and says whether to allow or block it."

- `paloalto-firewall-rules` §How Do Firewall Rules Work?
  > In enterprise environments, access control lists (ACLs) specify firewall rules, providing detailed lists of permissions that instruct the firewall on which traffic to allow or block. Each ACL contains numerous rules, each with conditions traffic must meet to either proceed or halt.
- `microsoft-windows-firewall` §Firewall rules
  > Firewall rules identify allowed or blocked network traffic, and the conditions for this to happen.
- `nist-sp800-41r1` §5.2.2
  > The end result is a set of rules called a ruleset that describes how the firewall acts.
- Note: Leaves out a few other rule actions (Palo Alto also names reject); allow and block are the ordinary case.
- Note: Currency: all current or live on 2026-11-13.

### entry "firewall-rule": statement "firewall-rule-2" — ✅

Text: "It describes the traffic by details such as source and destination addresses, ports and protocol."

- `paloalto-firewall-rules` §What Are Firewall Rules?
  > They play an essential role in network security by dictating how firewalls should handle traffic based on parameters such as source or destination IP addresses, ports, and protocols.
- `microsoft-windows-firewall` §Firewall rules
  > Source and destination IP addresses
  > …
  > Protocol name or type. For transport layer protocols, TCP and UDP, you can specify ports or port ranges.
- `nist-sp800-41r1` §5.2.2
  > To create a ruleset, it should first be determined what types of traffic (protocols, source and destination addresses, etc.) are required by approved applications for the organization.
- Note: Currency: all current or live on 2026-11-13.

### entry "firewall-rule": statement "firewall-rule-3" — ✅

Text: "On many firewalls, the order of the rules matters."

- `nist-sp800-41r1` §5.2.2
  > Some vendors have restrictions or suggestions on the order of the rules in a ruleset.
- `paloalto-firewall-rules` §Firewall Rules Order
  > The ordering of firewall rules is important because firewalls process rules sequentially, typically from the top down.
- Note: "many" leaves room for firewalls without administrator-set ordering, such as Windows Firewall.
- Note: Currency: both current or live on 2026-11-13.

### entry "first-match": statement "first-match-1" — ✅

Text: "First match is how many firewalls read their rules: from the top down, stopping at the first rule that fits the traffic and taking its action."

- `nist-sp800-41r1` §5.2.2
  > For example, many firewalls check traffic against rules in a sequential manner until a match is found.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Firewalls compare traffic to Security policy rules, starting with the first rule at the top of the Security policy rulebase. When traffic matches a rule’s criteria, the firewall executes the rule’s action on the traffic and doesn't compare the traffic to any other rules.
- `microsoft-azure-nsg` §Security rules
  > Rules are processed in priority order, with lower numbers processed before higher numbers because lower numbers have higher priority. Once traffic matches a rule, processing stops.
- `paloalto-firewall-rules` §Firewall Rules FAQs
  > Yes, the order of firewall rules matters because rules are processed top-down, with the first match applied.
- Note: Azure orders by priority number rather than list position; "top down" is the everyday picture of the same thing.
- Note: Currency: all current or live on 2026-11-13.

### entry "first-match": statement "first-match-2" — ✅

Text: "Rules further down are not checked for that traffic, so the order of the rules matters."

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The way you order the rules in the rulebase is critical because the firewall takes action on the traffic on the first rule match and then stops comparing the traffic to the rulebase.
- `microsoft-azure-nsg` §Security rules
  > Once traffic matches a rule, processing stops. As a result, any rules that exist with lower priorities (higher numbers) that have the same attributes as rules with higher priorities aren't processed.
- `nist-sp800-41r1` §5.2.2
  > For these firewalls, rules with the highest chance of matching traffic patterns should be placed as high in the list as possible to improve firewall performance.
- Note: Read in its entry, the statement is about first-match firewalls, as the sources say.
- Note: Currency: all current or live on 2026-11-13.

### entry "first-match": statement "first-match-3" — ✅

Text: "Some firewalls sort rules in other ways, for example checking block rules before allow rules."

- `nist-sp800-41r1` §5.2.2
  > Other firewalls have more complex ways of processing rulesets, such as first checking “deny” rules and then checking “allow” rules.
- `microsoft-windows-firewall-rules` §Rule precedence for inbound and outbound rules
  > Explicit block rules take precedence over any conflicting allow rules.
- Note: Currency: both current or live on 2026-11-13.

### entry "nat": statement "nat-1" — ✅

Text: "NAT (Network Address Translation) changes the IP addresses in packets as they pass between two networks, such as a private network and the internet."

- `nist-sp800-41r1` §Appendix A
  > Network Address Translation (NAT): A routing technology used by many firewalls to hide internal system addresses from an external network through use of an addressing schema.
- `rfc-3022` §Abstract
  > Basic Network Address Translation or Basic NAT is a method by which IP addresses are mapped from one group to another, transparent to end users.
  > …
  > provide a mechanism to connect a realm with private addresses to an external realm with globally unique registered addresses.
- `rfc-4787` §3
  > The effect is that the NAPT establishes a NAT session to translate the (private IP address, private port number) tuple to a (public IP address, public port number) tuple, and vice versa, for the duration of the session.
- Note: The full name is given by NIST's glossary and by RFC 3022. RFC 3022 and RFC 4787 are two different IETF documents, so two independent standards state the translation.
- Note: Currency: RFC 3022 is not obsoleted and has no updates; RFC 4787 (BCP 127) is not obsoleted, and its updates (RFC 6888 on carrier-grade NAT, RFC 7857 on NAT behaviour) add requirements without changing what NAT does.

### entry "nat": statement "nat-2" — ✅

Text: "A home router uses it so that many devices with private addresses share one public address, told apart by port number."

- `rfc-3022` §2.2
  > NAPT would allow mapping of tuples of the type (local IP addresses, local TU port number) to tuples of the type (registered IP address, assigned TU port number). This model fits the requirements of most Small Office Home Office (SOHO) groups to access external network using a single service provider assigned IP address.
- `rfc-4787` §3
  > NAPT is by far the most commonly deployed NAT device. NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `nist-sp800-41r1` §3.2
  > Typically, a NAT acts as a router that has a network with private addresses on the inside and a single public address on the outside.
  > …
  > The NAT uses this source port number to map connections from the outside back to the host on the inside.
- Note: Leaves out the case where the provider itself puts the home router behind a further NAT; the ordinary case is as stated.
- Note: Currency: as for nat-1; NIST current.

### entry "nat": statement "nat-3" — ✅

Text: "It records each mapping, so replies get back to the right device."

- `rfc-4787` §3
  > When an internal host opens an outgoing TCP or UDP session through a NAPT, the NAPT assigns the session a public IP
  > …
  > address and port number, so that subsequent response packets from the external endpoint can be received by the NAPT, translated, and forwarded to the internal host.
- `nist-sp800-41r1` §3.2
  > Hosts on the inside network initiating connections to the outside network cause the NAT to map the source port of the connection to a different source port that is controlled by the NAT. The NAT uses this source port number to map connections from the outside back to the host on the inside.
- `rfc-3022` §2.2
  > Packets on the return path go through similar address and TCP port translations for the target IP address and target TCP port.
- Note: Currency: as for nat-1.

### entry "port": statement "port-1" — ✅

Text: "A port, or port number, is a number that TCP and UDP use to tell apart the programs and services on a computer."

- `rfc-9293` §2.2
  > TCP uses port numbers to identify application services and to multiplex distinct flows between hosts.
- Note: RFC 9293 (Internet Standard, STD 7) is the current definition of TCP, including its port numbers; the defining marker is correct.
- `rfc-6335` §3
  > Ports serve two purposes: first, they provide a demultiplexing identifier to differentiate transport sessions between the same pair of endpoints, and second, they may also identify the application protocol and associated service to which processes connect.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending  process
- Note: RFC 768 (STD 6) defines UDP and its port fields; the defining marker is correct.
- Note: Loosely said: a port also tells apart sessions between the same two hosts, which the definition leaves out.
- Note: Currency: RFC 9293 is not obsoleted and has no updates; RFC 768 is not obsoleted (updated by RFC 9868, which adds UDP options and leaves the port fields as they are); RFC 6335 (BCP 165) is not obsoleted.

### entry "port": statement "port-2" — ✅

Text: "A server usually listens on its service’s port, such as 21 for FTP or 443 for HTTPS."

- `rfc-6335` §3
  > it is common for many services to have a default port upon which those servers usually listen, when possible, and these ports are recorded by the Internet Assigned Numbers Authority (IANA) through the service name and port number registry [PORTREG].
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host
- `iana-ports` §Registry
  > ftp 21 tcp File Transfer Protocol
  > …
  > https 443 tcp http protocol over TLS/SSL
- Note: The IANA Service Name and Transport Protocol Port Number Registry is the authoritative record of port assignments; it assigns TCP port 21 to ftp and 443 to https. The defining marker is correct.
- Note: Currency: the registry is live, last updated 2026-11-10.

### entry "port": statement "port-3" — ✅

Text: "TCP and UDP headers carry a source and a destination port; replies usually go to the source port."

- `rfc-9293` §3.1
  > Source Port: 16 bits The source port number. Destination Port: 16 bits The destination port number.
- Note: RFC 9293 §3.1 defines the TCP header format, including both port fields; the defining marker is correct.
- `rfc-768` §Fields
  > it indicates the port of the sending  process,  and may be assumed  to be the port  to which a reply should  be addressed  in the absence of any other information.
- Note: RFC 768 defines the UDP header's source and destination port fields; the defining marker is correct.
- `nist-sp800-41r1` §2
  > a destination port number generally identifies a service listening on the destination host, and a source port usually identifies the port number on the source host that the destination host should reply to.
- Note: Currency: as for port-1.

### entry "private-address": statement "private-address-1" — ✅

Text: "A private address is an IPv4 address from the ranges set aside for private networks: 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16."

- `rfc-1918` §3
  > The Internet Assigned Numbers Authority (IANA) has reserved the following three blocks of the IP address space for private internets:
  > 10.0.0.0 - 10.255.255.255 (10/8 prefix) 172.16.0.0 - 172.31.255.255 (172.16/12 prefix) 192.168.0.0 - 192.168.255.255 (192.168/16 prefix)
- Note: RFC 1918 (BCP 5) defines the IPv4 private address space; the defining marker is correct.
- `nist-sp800-41r1` §4.1.1
  > These ranges are 10.0.0.0 to 10.255.255.255 (10.0.0.0/8 in Classless Inter-Domain Routing [CIDR] notation), 172.16.0.0 to 172.31.255.255 (172.16.0.0/12), and 192.168.0.0 to 192.168.255.255 (192.168.0.0/16).
- Note: The statement is limited to IPv4, so it does not rule out IPv6's own local ranges.
- Note: Currency: RFC 1918 is not obsoleted (updated only by RFC 6761, on special-use domain names).

### entry "private-address": statement "private-address-2" — ✅

Text: "Any network may use them without asking a registry, so they are reused on many networks and unique only within one."

- `rfc-1918` §3
  > An enterprise that decides to use IP addresses out of the address space defined in this document can do so without any coordination with IANA or an Internet registry. The address space can thus be used by many enterprises. Addresses within this private address space will only be unique within the enterprise
- Note: RFC 1918 defines the terms of use of private address space; the defining marker is correct.
- `rfc-3022` §2.1
  > Addresses inside a stub domain are local to that domain and not valid outside the domain. Thus, addresses inside a stub domain can be reused by any other stub domain.
- Note: Currency: RFC 1918 and RFC 3022 not obsoleted.

### entry "private-address": statement "private-address-3" — ✅

Text: "They should not be passed across the internet, so devices using them usually reach it through NAT."

- `rfc-1918` §3
  > Because private addresses have no global meaning, routing information about private networks shall not be propagated on inter-enterprise links, and packets with private source or destination addresses should not be forwarded across such links.
- Note: RFC 1918 defines this rule for private addresses; the defining marker is correct.
- `nist-sp800-41r1` §4.1.1
  > Perimeter devices can perform address translation services to permit internal hosts with private addresses to communicate through the perimeter, but private addresses should not be passed through the network perimeter.
- `rfc-3022` §Abstract
  > provide a mechanism to connect a realm with private addresses to an external realm with globally unique registered addresses.
- Note: Leaves out RFC 1918's other route out (application layer gateways); "usually" keeps it true.
- Note: Currency: all three current.

### entry "public-address": statement "public-address-1" — ✅

Text: "A public address is an IP address that is unique across the internet, assigned through an internet registry."

- `rfc-1918` §3
  > All other hosts will be public and will use globally unique address space assigned by an Internet Registry.
- `rfc-3022` §Abstract
  > connect a realm with private addresses to an external realm with globally unique registered addresses.
- `rfc-3022` §2.1
  > A stub domain with a set of private network addresses could be enabled to communicate with external network by dynamically mapping the set of private addresses to a set of globally valid network addresses.
- Note: RFC 1918 and RFC 3022 are two different IETF documents; the two RFC 3022 citations count as one source.
- Note: "Assigned through" covers the ordinary path where an ISP hands out addresses from its registry allocation.
- Note: Currency: both RFCs current.

### entry "public-address": statement "public-address-2" — ✅

Text: "Hosts with public addresses can reach each other across the internet; NAT lets many devices with private addresses share one public address."

- `rfc-1918` §3
  > Public hosts can communicate with other hosts inside the enterprise both public and private and can have IP connectivity to public hosts outside the enterprise.
- `rfc-4787` §4.4
  > In general, the NAT needs to allow all internal nodes (including I) to communicate with all external nodes having public (non-RFC 1918) IP addresses
- `rfc-4787` §3
  > NAPT allows multiple internal hosts to share a single public IP address simultaneously.
- `nist-sp800-41r1` §3.2
  > Typically, a NAT acts as a router that has a network with private addresses on the inside and a single public address on the outside.
- Note: "Can reach" states what addressing allows; a firewall may still block a given connection, which the statement does not deny.
- Note: Currency: all current.

### entry "shadowed-rule": statement "shadowed-rule-1" — ✅

Text: "A shadowed rule is a firewall rule that never gets to act, because one or more rules above it already match all the traffic it would match."

- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > Shadowing is when you place a broad rule that includes the same match criteria as a more specific rule higher in the rulebase than the specific rule, so traffic intended to match the specific rule instead matches the general rule first and is never compared to the specific rule.
- `google-cloud-firewall-insights` §Shadowed rules
  > Shadowed rules share attributes, such as IP addresses, with other rules with higher or equal priority, called shadowing rules.
- `microsoft-azure-nsg` §Security rules
  > Once traffic matches a rule, processing stops. As a result, any rules that exist with lower priorities (higher numbers) that have the same attributes as rules with higher priorities aren't processed.
- Note: Leaves out partial shadowing, which Palo Alto mentions for some NAT rules; the plain case is as stated.
- Note: Currency: all three pages live on 2026-11-13; Google's page was last updated 2026-11-10.

### entry "shadowed-rule": statement "shadowed-rule-2" — ✅

Text: "It usually means a mistake in the rule list."

- `google-cloud-firewall-insights` §Examples of shadowed rules
  > The shadowed firewall rules insight usually indicates a firewall misconfiguration—for example, the IP address filter setting of A is broad, or the filter setting of B is too restrictive and unnecessary.
- `paloalto-rulebase-best-practices` §Security Policy Rulebase Best Practices
  > The result is that the firewall executes the action and inspection configured in the general rule when the intention is to execute the action and inspection in the specific rule.
- Note: Google says it directly; Palo Alto describes the result as differing from what was intended, which is the mistake.
- Note: Currency: both live.

### entry "source-address": statement "source-address-1" — ✅

Text: "A packet’s source address is the IP address of the device that sent it, carried in the packet’s IP header."

- `rfc-8200` §3
  > Source Address 128-bit address of the originator of the packet.
- `nist-sp800-41r1` §2.1.1
  > The packet’s source IP address—the address of the host from which the packet originated (such as 192.168.1.1)
- `rfc-791` §3.1
  > Source Address: 32 bits The source address. See section 3.2.
- Note: RFC 791 defines the IPv4 header format, including its Source Address field; the defining marker is correct.
- Note: Currency: as for destination-address-1.

### entry "source-address": statement "source-address-2" — ✅

Text: "Firewall rules can match on it, to allow or block traffic by where it comes from."

- `nist-sp800-41r1` §2.1.1
  > This provides network access control based on several pieces of information contained in a packet, including:
  > …
  > The packet’s source IP address—the address of the host from which the packet originated
- `microsoft-windows-firewall` §Windows Firewall overview
  > This traffic can be filtered based on several criteria, including source and destination IP address, IP protocol, or source and destination port number.
- `paloalto-firewall-rules` §What Are Firewall Rules?
  > They play an essential role in network security by dictating how firewalls should handle traffic based on parameters such as source or destination IP addresses, ports, and protocols.
- Note: Currency: all current or live.

### entry "stateful": statement "stateful-1" — ✅

Text: "A stateful firewall, one that uses stateful inspection, keeps track of the connections passing through it in a state table."

- `nist-sp800-41r1` §2.1.2
  > Stateful inspection improves on the functions of packet filters by tracking the state of connections and blocking packets that deviate from the expected state.
  > …
  > stateful inspection keeps track of each connection in a state table.
- `paloalto-stateful-firewall` §Stateful vs. Stateless Firewalls
  > Stateful firewalls, in contrast, take into account the state of network connections. They maintain a state table that tracks every communication channel over time, allowing them to understand the context of a packet within a given connection.
- Note: Currency: NIST current; Palo Alto page live.

### entry "stateful": statement "stateful-2" — ✅

Text: "Packets that belong to a connection it has allowed, such as the replies, pass without a rule of their own; a new connection is checked against the rules."

- `nist-sp800-41r1` §2.1.2
  > the connection attempt is first checked to see if it is permitted by the firewall ruleset. If it is permitted, an entry is added to the state table that indicates a new session is being initiated
  > …
  > all subsequent traffic matching the entry will be allowed to pass through the firewall.
- `paloalto-stateful-firewall` §How Do Stateful Firewalls Work?
  > If the packet is part of an existing, approved connection, it is allowed to pass. If not, the stateful inspection firewall consults its rule set to determine the appropriate action.
- `microsoft-azure-nsg` §Security rules
  > The flow record allows a network security group to be stateful. If you specify an outbound security rule to any address over port 80, for example, it's not necessary to specify an inbound security rule for the response to the outbound traffic.
- Note: Leaves out that many stateful firewalls still drop packets of an allowed connection that break the protocol's expected state (NIST gives out-of-sequence TCP packets as the example); the ordinary case is as stated.
- Note: Currency: all current or live.

### entry "stateful": statement "stateful-3" — ✅

Text: "A stateless firewall checks each packet on its own."

- `nist-sp800-41r1` §2.1.1
  > These devices, also known as stateless inspection firewalls, do not keep track of the state of each flow of traffic that passes though the firewall; this means, for example, that they cannot associate multiple requests within a single session to each other.
- `paloalto-stateful-firewall` §Stateful vs. Stateless Firewalls
  > Stateless firewalls inspect each data packet independently against a set of predefined rules known as access control lists (ACLs).
- Note: Currency: NIST current; Palo Alto page live.

## 2. Names and ties

### entry "default-deny": names — ✅

- Note: Both names, "Default deny" and "Deny by default", are given for this policy by statement default-deny-1, which passes; NIST's §4 uses "deny by default" and Palo Alto's heading uses "default-deny".

### entry "default-deny": lessons — ✅

- Note: The `firewalls` term "Default deny" (blocking whatever no rule allows, also called deny by default) names the same policy and agrees with the definition.

### entry "destination-address": names — ✅

- Note: "Destination address" is the term used by statement destination-address-1 for this thing; NIST and the RFCs use the same name.

### entry "firewall": names — ✅

- Note: "Firewall" is the term used by statement firewall-1.

### entry "firewall": lessons — ✅

- Note: The `firewalls` term "Firewall" (a guard deciding what may pass between a network and the outside) names the same thing; it is plainer than the definition, which also covers firewalls on a single computer, and does not contradict it.

### entry "firewall-rule": names — ✅

- Note: "Firewall rule" is the term used by statement firewall-rule-1.

### entry "firewall-rule": lessons — ✅

- Note: The `firewalls` term "Rule" (one line on the list, allowing or blocking one kind of visit) names the same thing and agrees with the definition.

### entry "first-match": names — ✅

- Note: "First match" is the term used by statement first-match-1; Palo Alto's FAQ uses the same phrase.

### entry "first-match": lessons — ✅

- Note: The `firewalls` term "First match" (reading from the top and stopping at the first rule that fits) agrees with the definition.

### entry "nat": names — ✅

- Note: "NAT" and "Network Address Translation" are both given by statement nat-1, and the full name is in NIST's glossary and RFC 3022.

### entry "nat": lessons — ✅

- Note: The `what-is-ip` term "NAT" (swapping a private address for a public one) names the same thing; plainer than the definition, not contradicting it.

### entry "port": names — ✅

- Note: "Port" and "Port number" are both given by statement port-1; RFC 9293 and RFC 6335 use both forms.

### entry "port": lessons — ✅

- Note: The `firewalls` term "Port" (the number a service answers at, such as 443 for websites) and the `what-is-udp` term "Port" (which app on the computer the data is for) both name the transport-layer port and agree with port-1 and port-2.

### entry "private-address": names — ✅

- Note: "Private address" is the term used by statement private-address-1; NIST and RFC 1918 use "private address".

### entry "public-address": names — ✅

- Note: "Public address" is the term used by statement public-address-1; RFC 4787 and NIST use "public address".

### entry "shadowed-rule": names — ✅

- Note: "Shadowed rule" is the term used by statement shadowed-rule-1; Google uses "shadowed rules".

### entry "shadowed-rule": lessons — ✅

- Note: The `firewalls` term "Shadowed rule" (a rule that never gets a turn because one above it catches all its traffic first) names the same thing; naming one rule above, where the definition allows one or more, is thinner but not contradictory.

### entry "source-address": names — ✅

- Note: "Source address" is the term used by statement source-address-1.

### entry "source-address": lessons — ✅

- Note: The `firewalls` term "Source" (the address a visit comes from, which a rule can name as one exact address written /32) names the same thing; the /32 remark adds a detail and does not contradict the definition.

### entry "stateful": names — ✅

- Note: "Stateful" and "Stateful inspection" are both given by statement stateful-1; NIST names the technique stateful inspection.

### entry "stateful": lessons — ✅

- Note: The `firewalls` term "Stateful" (remembering the connections it let in, so their replies get back out) agrees with stateful-1 and stateful-2.

## 3. The sources

All checked on 2026-11-13.

- `google-cloud-firewall-insights`: Google Cloud documentation page, live (HTTP 200), last updated 2026-11-10; describes a current product feature. Current.
- `iana-ports`: the live IANA Service Name and Transport Protocol Port Number Registry, last updated 2026-11-10 (the .xhtml link now redirects to the registry's main page). Current.
- `microsoft-azure-firewall-rule-sets`: Microsoft Learn, live, last updated 2026-03-29; current product. Current.
- `microsoft-azure-nsg`: Microsoft Learn, live, last updated 2025-07-15; current product. Current.
- `microsoft-windows-firewall`: Microsoft Learn, live, last updated 2026-05-27; applies to Windows 10, 11 and Server 2016 to 2025. Current.
- `microsoft-windows-firewall-rules`: Microsoft Learn, live, last updated 2025-06-06; same products. Current.
- `nist-sp800-41r1`: NIST SP 800-41 Rev. 1 (September 2009). The CSRC page lists it as final, superseding the 2002 original, and not withdrawn; a search found no later revision. Current.
- `paloalto-firewall`, `paloalto-firewall-best-practices`, `paloalto-firewall-rules`, `paloalto-stateful-firewall`: Palo Alto Networks Cyberpedia explainer pages, live (HTTP 200), describing current practice. Current. They count as one publisher for independence.
- `paloalto-rulebase-best-practices`: Palo Alto Networks technical documentation, live, updated 2026-01-16. Current.
- `rfc-1812`: Proposed Standard, not obsoleted; updated by RFC 2644 and RFC 6633, neither affecting forwarding by destination lookup. Current.
- `rfc-1918`: BCP 5, not obsoleted; updated by RFC 6761 only. Current.
- `rfc-3022`: Informational, not obsoleted, no updates. Current.
- `rfc-4787`: BCP 127, not obsoleted; updated by RFC 6888 and RFC 7857, which add NAT requirements and leave the cited text in force. Current.
- `rfc-6335`: BCP 165, not obsoleted. Current.
- `rfc-768`: Internet Standard (STD 6), not obsoleted; updated by RFC 9868 (UDP options), which leaves the port fields as they are. Current.
- `rfc-791`: Internet Standard (STD 5), not obsoleted; updated by RFC 1349, 2474 and 6864, none on the address fields. Current.
- `rfc-8200`: Internet Standard (STD 86), not obsoleted; updated by RFC 9673 only. Current.
- `rfc-9293`: Internet Standard (STD 7), not obsoleted. Current.

## 4. The limit overrides

None.
