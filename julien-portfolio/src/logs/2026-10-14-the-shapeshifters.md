---
title: The Shapeshifters
stardate: 2026.287
date: 2026-10-14
summary: Reading about malware that rewrites itself, and the AI techniques that make the disguise smarter.
---

Captain's log, stardate 2026.287.

No probes fired tonight. This was a night in the library, studying an enemy that never shows the same face twice. My guide was Caroline Wong's **The AI Cybersecurity Handbook**, the same book that sent me after my own domain two nights ago.

Most antivirus defence still rests on recognition. Know the signature, catch the threat. Shapeshifting malware is built to defeat exactly that.

There are two kinds. **Polymorphic** malware keeps the same core but wraps it in a new layer of encryption for every copy, so no two samples look alike on disk. Underneath, the core never changes. **Metamorphic** malware goes further. It rewrites its own instructions each generation, swapping and reordering them until nothing constant is left to recognise.

Then I reached the part where artificial intelligence comes aboard.

Researchers have shown that a generative adversarial network can learn to disguise malicious files from a machine-learning detector. One network makes changes, the other judges them, and the disguise improves until the detector is fooled. Other proofs of concept go further: code that is written by a language model at runtime, or a payload that stays sealed until it recognises the one environment it was built for. A sample like that has no fixed form for a defender to study.

## Lessons recorded

- **Signatures describe the past.** Against code that changes every copy, detection has to watch behaviour, not appearance.
- **A detector is itself a target.** If a model decides what is malicious, an adversary can train against that model.
- **Reading is not the same as doing.** Tonight I only read. I have not built, run or tested any of this.

Captain's log, supplemental. In my reading I came across a simulator from Microsoft Research: a model network where learning agents practise attack and defence, with no real systems at risk. That is the next mission.

End log.
