#!/usr/bin/env python3
"""Count an agent's tokens from its transcript: the growth of its context between requests.
Usage: tokens.py <transcript.jsonl> ...   Prints, per file: requests, last context size, peak, and the summed growth
(which equals the last context size when the context was never summarised), and "read in all": the context summed
over every request, which is what counts against a usage limit."""
import json, sys
for path in sys.argv[1:]:
    seen, sizes = set(), []
    for line in open(path, encoding='utf-8', errors='replace'):
        try: o = json.loads(line)
        except Exception: continue
        m = o.get('message') or {}
        u = m.get('usage')
        if not u or m.get('role') != 'assistant': continue
        mid = m.get('id') or o.get('uuid')
        if mid in seen: continue
        seen.add(mid)
        ctx = (u.get('input_tokens') or 0) + (u.get('cache_read_input_tokens') or 0) + (u.get('cache_creation_input_tokens') or 0) + (u.get('output_tokens') or 0)
        if ctx < 2000: continue  # a request that failed (a usage limit) reports no usage; it is not a summary
        sizes.append(ctx)
    growth, prev, drops = 0, 0, 0
    for s in sizes:
        if s >= prev: growth += s - prev
        else: drops += 1; growth += 0
        prev = s
    print(f"{path.split('/')[-1]}: requests {len(sizes)}, last {sizes[-1] if sizes else 0}, peak {max(sizes) if sizes else 0}, growth {growth}, drops {drops}, read in all {sum(sizes)}")
