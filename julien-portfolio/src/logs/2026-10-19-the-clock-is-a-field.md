---
title: The Clock Is a Field
stardate: 2026.292
date: 2026-10-19
summary: Splunk training on working with time: time modifiers, bin, strftime, timechart and timewrap.
---

Captain's log, stardate 2026.292.

Today I studied how Splunk handles time. I expected a footnote. It turned out to be most of the job.

Every event that lands in Splunk gets a timestamp, stored in a field called `_time` as epoch seconds. Host, source, sourcetype and index ride along with it. So the clock is not something outside the data. It is a field, and you can search it, cut it and reshape it like any other.

## Steering through time

The time picker is the blunt tool. `earliest` and `latest` in the search itself are the precise one, and they win over the picker. `-7d@d` means seven days back, then snap down to midnight. `@w1` snaps to Monday. Once the snapping clicked, the syntax stopped looking like noise.

Real-time searches exist, and you can watch events arrive. They are also expensive. A scheduled report usually does the same job for less.

## Shaping the data

- `bin span=1h _time` drops events into hourly buckets so `stats` can sum them.
- `eval` with `strftime` turns epoch seconds into something a person can read: `May 12, 07 PM`.
- `timechart` puts `_time` on the x-axis and splits by any field. `limit=5` keeps the top five and folds the rest into OTHER.
- `timewrap 1w` lays this week over last week. Two lines, same weekdays. A spike stops being a guess and becomes a comparison.

## The trap

Splunk gives you `date_hour` and other `date_*` fields for free. They come from the raw event text and ignore your time zone setting, so they can disagree with the `_time` on your screen. Filter on `date_hour` between 2 and 5 and you may get the wrong three hours. The fix is to derive the hour yourself: `strftime(_time, "%H")`.

Captain's log, supplemental. I learned this for my day job. But my curiosity keeps drifting toward security, where "when" is half of "what happened." I intend to get it right.

End log.
