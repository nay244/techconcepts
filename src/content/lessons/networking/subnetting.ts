import { defineLesson } from '../../define';

/**
 * Subnetting, lesson 7 of 19, and the first playground lesson. The learner
 * watches a mask split an address into its network and host parts, works out
 * the network address, the broadcast address and the usable hosts, borrows
 * bits to cut a /24 into four /26 subnets, checks whether two addresses can
 * talk directly, and ends on a /30 link.
 *
 * Every step is driven by its preset, and every number a step states is one
 * the subnet engine produces for that preset; the tests pin them. The
 * playground covers /16 to /30, where usable hosts are always 2 to the power of
 * the host bits, minus 2. A /31 follows other rules (RFC 3021) and a /32 is a
 * single host, so both are left out of this lesson on purpose, and everything
 * the lesson says about reserved addresses says "ordinary subnet" or "/30 and
 * bigger".
 */
export default defineLesson({
  slug: 'subnetting',
  title: 'Subnetting',
  subtitle: 'Splitting networks into smaller ones',
  level: 'beginner',
  osiLayers: [3],
  certTags: ['network-plus', 'ccna'],
  summary:
    'See how a subnet mask splits an IP address into network and host parts, work out how many devices fit in a subnet, and test whether two addresses can talk directly.',
  references: [
    { label: 'RFC 950: Internet Standard Subnetting Procedure', url: 'https://www.rfc-editor.org/rfc/rfc950' },
    { label: 'RFC 4632: Classless Inter-domain Routing (CIDR)', url: 'https://www.rfc-editor.org/rfc/rfc4632' },
  ],

  overview: {
    hook:
      "Picture a street of houses. Every address has two parts: the street and the house number. Neighbors on your street are a short walk away; another street means going out by the main road. IP addresses work the same way. Subnetting is how a network decides where the street ends and the house number begins.",
    name: 'Subnetting',
    fullName: 'Subnetwork addressing',
    description:
      "A subnet is a smaller network cut out of a bigger one. A number called the mask marks where an address stops naming the network and starts naming the device. Subnetting has a reputation for being hard, but it comes down to moving that line and counting.",
    facts: [
      { label: 'Written as', value: '192.168.1.0/24' },
      { label: 'Mask', value: '255.255.255.0' },
      { label: 'Usable hosts', value: '2 to the power of host bits, minus 2 (for prefixes up to /30)' },
      { label: 'Defined in', value: 'RFC 950, RFC 4632' },
    ],
  },

  scene: { type: 'playground', playground: 'subnet' },

  steps: [
    {
      id: 'two-parts',
      title: 'An address has two parts',
      subtitle: 'Network on the left, host on the right',
      narrative:
        'Think of 12 Oak Street. "Oak Street" says which street, and 12 says which house. An IP address also has two parts: a network part, which says which network a device is on, and a host part, which says which device it is. (A host is any device with an address; lesson 3 covers addresses and binary.) Here, in 192.168.1.10, the network part is 192.168.1 and the host part is 10 (the next step shows what decides where the line falls). The canvas shows the 32 bits, the ones and zeros a computer reads, with the network part marked.',
      facts: [
        { label: 'Address', value: '192.168.1.10' },
        { label: 'Network part', value: '192.168.1 (the first 24 bits)' },
        { label: 'Host part', value: '10 (the last 8 bits)' },
        { label: 'Whole address', value: '32 bits' },
      ],
      events: [],
      preset: { address: '192.168.1.10', prefix: 24 },
    },
    {
      id: 'mask',
      title: 'The mask draws the line',
      subtitle: 'A number says where the network part ends',
      narrative:
        "How does a device know where the street name ends? Imagine a card with holes cut in it, laid over the address: the bits under the holes show through as the network part, and the rest are covered up as the host part. That card is the subnet mask, a number with a 1 for every network bit (a bit in the network part) and a 0 for every host bit (a bit in the host part). 255.255.255.0 is 24 ones then 8 zeros, so the first 24 bits are the network. That count is the prefix length, written after a slash: 192.168.1.10/24 (CIDR notation, from Classless Inter-Domain Routing).",
      facts: [
        { label: 'Mask', value: '255.255.255.0' },
        { label: 'Mask in binary', value: '11111111.11111111.11111111.00000000' },
        { label: 'Prefix length', value: '/24 (24 ones)' },
      ],
      events: [],
      preset: { address: '192.168.1.10', prefix: 24 },
    },
    {
      id: 'reserved',
      title: 'Network, broadcast and hosts',
      subtitle: 'Two addresses in an ordinary subnet are reserved',
      narrative:
        "A street has its own name and a loudspeaker every house can hear. A subnet reserves two addresses the same way. Set every host bit to 0 and you get the network address, 192.168.1.0, the subnet's own name. Set them all to 1 and you get the broadcast address, 192.168.1.255, which reaches every device in the subnet at once. Neither can be given to a device. So 8 host bits give 256 addresses (2 to the power of 8), minus 2: 254 usable hosts, 192.168.1.1 to 192.168.1.254.",
      facts: [
        { label: 'Network address', value: '192.168.1.0' },
        { label: 'Broadcast address', value: '192.168.1.255' },
        { label: 'Usable hosts', value: '254' },
        { label: 'Usable range', value: '192.168.1.1 to 192.168.1.254' },
      ],
      events: [],
      preset: { address: '192.168.1.10', prefix: 24 },
    },
    {
      id: 'borrowing-bits',
      title: 'Borrowing bits',
      subtitle: 'Move the line right for smaller subnets',
      narrative:
        "Is the street too long? Move the dividing line to split it. Here the mask grows from /24 to /26, so 2 bits that were host bits become network bits. That is called borrowing bits. Two borrowed bits make 4 subnets (2 to the power of 2) of 64 addresses each, starting at 192.168.1.0, .64, .128 and .192. The address 192.168.1.70 is in the one starting at 192.168.1.64, with 6 host bits left: 64 minus 2 leaves 62 usable hosts. Each subnet is its own street: a router doesn't pass its broadcasts on to the next one.",
      facts: [
        { label: 'Mask', value: '255.255.255.192 (/26)' },
        { label: 'Cut from one /24', value: '4 subnets of 64 addresses' },
        { label: 'This subnet', value: '192.168.1.64 to 192.168.1.127' },
        { label: 'Usable hosts', value: '62 (192.168.1.65 to 192.168.1.126)' },
      ],
      events: [],
      preset: { address: '192.168.1.70', prefix: 26 },
    },
    {
      id: 'same-subnet',
      title: 'Same subnet or not?',
      subtitle: 'Compare the network parts',
      narrative:
        "Two houses on different streets aren't neighbors, however close: you reach them by the main road. A device checks before it sends: it applies its mask to its own address and the destination, then compares the network parts. At /26, 192.168.1.10 is in the subnet starting at 192.168.1.0 and 192.168.1.70 is in the one starting at 192.168.1.64. Different subnets, so the device hands the traffic to its default gateway, the router that leads out (lesson 8 covers routers). Helpdesk techs check this when two devices can't reach each other. At /24, these two would be neighbors.",
      facts: [
        { label: 'This device', value: '192.168.1.10, in the subnet 192.168.1.0' },
        { label: 'Compared with', value: '192.168.1.70, in the subnet 192.168.1.64' },
        { label: 'At /26', value: 'Different subnets: sent via the router' },
        { label: 'At /24', value: 'Same subnet: sent directly' },
      ],
      events: [],
      preset: { address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' },
    },
    {
      id: 'tiny-subnets',
      title: 'Tiny subnets',
      subtitle: 'A /30 holds exactly two devices',
      narrative:
        "Some subnets are tiny, like a short lane with exactly two houses. A /30 leaves just 2 host bits, so 4 addresses (2 to the power of 2): the network address, the broadcast address and 2 usable hosts. A cable between two routers needs exactly that, one address per end, so engineers often use /30 subnets for those links, wasting no host addresses. Here 10.0.0.5/30 is in the subnet 10.0.0.4, whose hosts are 10.0.0.5 and 10.0.0.6. (10.x.x.x is private; see lesson 3.)",
      facts: [
        { label: 'Mask', value: '255.255.255.252 (/30)' },
        { label: 'This subnet', value: '10.0.0.4 to 10.0.0.7' },
        { label: 'Usable hosts', value: '2 (10.0.0.5 and 10.0.0.6)' },
        { label: 'Typical use', value: 'A link between two routers' },
      ],
      events: [],
      preset: { address: '10.0.0.5', prefix: 30 },
    },
  ],

  tryIt: {
    mode: 'free',
    prompt:
      "Now the controls are yours, starting from the /30 link. Type any address, drag the prefix from /16 to /30, and watch the numbers follow. Use Compare with to test a second address.",
    explanation:
      "Three things to notice. First, each step left on the slider moves the line one bit and doubles the addresses in a subnet: a /24 has 256, a /23 has 512. Second, at /26, change only the last number: the network and broadcast addresses stay put until the address crosses into the next block of 64. Third, type 192.168.1.10, put 192.168.1.70 under Compare with and drag the prefix: they share a subnet up to /25 and split at /26, where the mask first reaches a bit that differs.",
  },

  check: [
    {
      id: 'usable-hosts-26',
      prompt: 'How many usable hosts does a /26 subnet have?',
      options: ['30', '62', '64', '126'],
      answer: 1,
      explanation:
        "A /26 leaves 32 − 26 = 6 host bits: 64 addresses (2 to the power of 6). Take away the network and broadcast addresses and 62 are left. Stopping at 64 is a common slip. A /25 has 126 usable hosts and a /27 has 30.",
    },
    {
      id: 'same-24',
      prompt: 'Are 192.168.1.10 and 192.168.1.70 on the same /24 subnet?',
      options: [
        'Only if both connect to one router',
        'No, because 10 and 70 are different numbers',
        'Yes, because the first 24 bits match',
      ],
      answer: 2,
      explanation:
        "In a /24 the first three numbers are the network part, and both addresses begin 192.168.1. Only the host part differs, so they share a subnet and can talk directly. They stop sharing a subnet once the prefix reaches /26 or more.",
    },
    {
      id: 'thirty-uses',
      prompt: 'What is a /30 subnet typically used for?',
      options: [
        'A direct link between two routers',
        'A small office with 50 devices',
        'A home network of phones and laptops',
      ],
      answer: 0,
      explanation:
        "A /30 has exactly 2 usable hosts, one for each end of a link such as the cable between two routers. A bigger subnet would leave addresses unused.",
    },
  ],

  recap: {
    takeaways: [
      "An address has a network part and a host part. The mask, written as a prefix length like /24, marks where one ends.",
      "A subnet with h host bits has 2 to the power of h addresses. In ordinary subnets (prefixes up to /30, the ones you can build here), two are reserved (network and broadcast): 254 usable in a /24, 62 in a /26, 2 in a /30.",
      "Two addresses share a subnet when their network parts match under the same mask. If they don't, traffic between them goes through a router.",
    ],
  },
});
