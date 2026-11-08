---
title: The Puppeteer
stardate: 2026.311
date: 2026-11-07
video: https://drive.google.com/file/d/1jcIyRSB3MEga0oJIz3pCBRFuDAU7gg2N/preview
summary: Teaching a cheap robot spider to cheer my handheld football game — which first meant stealing its language off the air with a packet capture.
---

Captain's log, stardate 2026.311.

Two toys on the desk tonight: a handheld football game I built — Messi versus Ronaldo on a tiny screen — and a cheap four-legged robot spider that came with a phone app and no manual worth reading. The mission was simple and ridiculous: make the spider celebrate the goals.

One problem. The spider only takes orders from its own app. To make it dance for my game, I first had to learn the language it speaks.

## Listening to the air

The spider makes its own little WiFi network, and the app talks to it over that. Every time you press a button — forward, dance, stop — the app sends a small message across that WiFi to the robot. Those messages are called **packets**. They're invisible, but they aren't secret; they're just going past, through the air, all the time.

A **packet capture** is a recording of them. You run a sniffer, press one button, and watch exactly which packet went out. Tools like **Wireshark** exist for precisely this — they catch every packet and let you read it, line by line.

## Isolating one command

The trick isn't catching packets — it's catching the *right* one. So I did it deliberately: start recording, press only "forward", stop. Start again, press only "dance", stop. One button at a time, with a pause between, so each command stands alone in the recording instead of drowning in the noise.

Then I filtered the capture down to just the conversation with the robot and read what came out. No encryption, no code — the commands were sitting there in plain text:

`POST /api/v1/action  {"action":"forward"}`

That was the whole secret. A tiny web request with the action's name inside. Once I could read one, I could read all of them: `dance1`, `fighting`, `sleep`, the lot.

## The payoff

From there it was mine. I taught the football game to fire those same requests at the right moments — Messi scores, the spider greets the crowd; Ronaldo scores, it shadow-boxes; whoever wins at full-time gets a victory dance, or a sulk. The clip above is the spider reacting to the final whistle.

Captain's log, supplemental. The lesson wasn't really about robots. **Reverse engineering only works on things you can watch cross a line.** The commands were catchable because they travelled over the air, where I could listen. The robot's distance sensor — which it uses to avoid walls but never transmits — stayed a mystery no matter how hard I looked, and that's the honest boundary of the method: you can read what moves, not what stays home. Next on the chart: a proper handheld remote, so the spider answers to me and not just its app.

End log.
