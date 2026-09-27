#!/usr/bin/env python3
"""Seed content for The Tribunal of Everyday Objects. Writes seed/tribunal.ndjson (Sanity import format)."""
import json, re, os
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
docs = []
def ref(_id): return {"_type": "reference", "_ref": _id, "_key": _id[-12:].replace(".", "")}

judges = [
 ("judge-kettle", "The Hon. Justice Kettle", "Boils over slowly, then all at once. Believes every object deserves a fair hearing and a cup of tea.", "Stern but warm"),
 ("judge-grandfather-clock", "Chief Justice Grandfather Clock", "Has presided since 1887. Punctual to the second. Deeply suspicious of anything with a snooze button.", "Unforgiving about lateness"),
 ("judge-rubber-duck", "Magistrate Rubber Duck", "Listens silently while defendants explain themselves, until they realise what they did wrong.", "Unnervingly calm"),
]
for _id, n, bio, t in judges:
    docs.append({"_id": _id, "_type": "judge", "name": n, "slug": {"_type": "slug", "current": slug(n.replace("The Hon. ", ""))}, "bio": bio, "temperament": t})

charges = [
 ("charge-malicious-disappearance", "Malicious Disappearance", "§ 1.1", "Vanishing at the precise moment one is needed.", "Permanent relocation to a clearly labelled drawer"),
 ("charge-premature-death", "Premature Expiry", "§ 2.4", "Ceasing to function days after the warranty ends.", "Public display as a cautionary tale"),
 ("charge-false-promises", "Obtaining Trust by False Pretences", "§ 3.1", "Displaying a status (full bars, 'almost done', 'sunny') that is untrue.", "Mandatory honesty indicator"),
 ("charge-ambush", "Ambush of the Bare Foot", "§ 4.7", "Lying in wait on a floor, specifically in the dark.", "Confinement to a tub with a lid"),
 ("charge-tangling", "Wilful Tangling", "§ 5.2", "Becoming knotted while left completely alone.", "Rehabilitation on a spool"),
 ("charge-noise", "Disturbance of the Peace", "§ 6.3", "Beeping, creaking or rattling with no discernible purpose.", "Removal of voice privileges"),
 ("charge-betrayal", "Betrayal of the Morning", "§ 7.0", "Undermining a person before 9am.", "Probation until noon"),
 ("charge-conspiracy", "Conspiracy to Inconvenience", "§ 9.9", "Acting in concert with another object to ruin an afternoon.", "Separation from all known accomplices"),
]
for _id, n, code, desc, mx in charges:
    docs.append({"_id": _id, "_type": "charge", "name": n, "slug": {"_type": "slug", "current": slug(n)}, "statuteCode": code, "definition": desc, "maximumSentence": mx})

defendants = [
 ("def-left-sock", "The Left Sock", "Household", "🧦", 4, ["Lefty", "The Solo Act", "Half of a Pair"], "Last seen entering a washing machine in 2019. Its partner still waits in the drawer.", ["def-washing-machine"]),
 ("def-washing-machine", "The Washing Machine", "Household", "🌀", 3, ["The Spin Cycle", "Big White"], "Suspected of running an underground sock-trafficking operation behind its door seal.", ["def-left-sock"]),
 ("def-wifi", "The Wi-Fi", "Digital", "📶", 5, ["The Router", "Full Bars", "Network_5G_Ext"], "Displays full bars while delivering nothing. Most active during video calls with your boss.", ["def-printer"]),
 ("def-printer", "The Printer", "Digital", "🖨️", 5, ["PC LOAD LETTER", "The Jammer"], "Has not printed a document on the first try since its manufacture. Demands cyan to print in black.", ["def-wifi"]),
 ("def-lego-brick", "The Lego Brick", "Household", "🧱", 5, ["The 2x2", "Caltrop"], "A known ambusher. Operates exclusively at night on hallway floors.", []),
 ("def-monday", "Monday", "Abstract", "📅", 4, ["The First Day", "Start of the Week"], "Arrives every week without fail, despite repeated written objections.", ["def-alarm-clock"]),
 ("def-alarm-clock", "The Alarm Clock", "Household", "⏰", 3, ["Snooze", "The Rooster"], "Believed to be in league with Monday. Its snooze button is widely considered entrapment.", ["def-monday"]),
 ("def-irish-weather", "Irish Weather", "Weather", "🌦️", 4, ["Four Seasons in a Day", "A Soft Day"], "Forecast as 'sunny intervals'. Delivered horizontal rain in all four directions.", []),
 ("def-charging-cable", "The Charging Cable", "Digital", "🔌", 3, ["The Frayed One", "Only Works at an Angle"], "Charges only when held at a precise angle known to no living person.", ["def-headphones"]),
 ("def-headphones", "The Headphones", "Digital", "🎧", 3, ["The Knot", "Wired Ones"], "Emerge from every pocket as a single solid knot, despite being put away neatly.", ["def-charging-cable"]),
 ("def-toaster", "The Toaster", "Household", "🍞", 2, ["Setting 3", "The Pop-Up"], "Settings 1 to 5 all produce either bread or charcoal. Nothing in between.", []),
 ("def-shopping-trolley", "The Shopping Trolley", "Transport", "🛒", 2, ["The Wonky Wheel", "Lefty II"], "Steers only to the left. Refuses all correction. No relation to the Left Sock (denied).", []),
]
for _id, n, cat, emoji, danger, aliases, desc, acc in defendants:
    docs.append({"_id": _id, "_type": "defendant", "name": n, "slug": {"_type": "slug", "current": slug(n.replace("The ", ""))}, "category": cat, "mugshot": emoji,
                 "dangerLevel": danger, "aliases": aliases, "description": desc, "knownAccomplices": [ref(a) for a in acc]})

cases = [
 # id, title, filedBy, defendant, charges, date, severity, testimony, witnesses, ruling
 ("case-001", "The Disappearance on Laundry Day", "A Tired Parent", "def-left-sock", ["charge-malicious-disappearance"], "2026-03-02", "grave",
  "I put in two socks. I took out one sock. I searched the drum, the door seal and the laundry basket. I checked the other sock. It had no explanation either.", ["The Remaining Sock", "The Laundry Basket"],
  ("judge-kettle", "guilty", "Permanent relocation to a clearly labelled drawer, pending recapture.", "The court notes that the defendant has never once been found. Absence is not innocence.", [])),
 ("case-002", "Accessory to Sock Disappearance", "A Tired Parent", "def-washing-machine", ["charge-conspiracy"], "2026-03-05", "serious",
  "Every sock that has vanished was last seen inside this machine. It hums innocently. Too innocently.", ["The Door Seal"],
  ("judge-kettle", "guilty-extenuating", "Monthly inspection of its door seal by a qualified sock investigator.", "Following the precedent in the Laundry Day matter, the machine is found to have provided the getaway vehicle.", ["case-001"])),
 ("case-003", "Full Bars, Zero Internet", "Remote Worker, Co. Galway", "def-wifi", ["charge-false-promises"], "2026-04-14", "grave",
  "The defendant showed five full bars for the entire meeting. My face froze mid-sentence while presenting quarterly numbers. My boss saw me frozen with my mouth open for 40 seconds.", ["The Frozen Video Call", "My Boss"],
  ("judge-grandfather-clock", "guilty", "Mandatory honesty indicator: bars must now reflect actual performance.", "Displaying full bars while delivering nothing is the purest form of false pretences this court has seen.", [])),
 ("case-004", "The Cyan Ransom", "Student, Final Year", "def-printer", ["charge-false-promises", "charge-conspiracy"], "2026-05-20", "grave",
  "Deadline at 9am. Document is black and white. The printer refused to print because it was out of cyan. It then jammed, unjammed and printed a single blank page.", ["The Blank Page", "The Cyan Cartridge"],
  ("judge-grandfather-clock", "guilty", "Removal of voice privileges and all error codes replaced with plain English.", "As in the matter of Full Bars, Zero Internet, a device claiming readiness it cannot deliver is guilty. The court also finds it coordinated with the Wi-Fi to reject the print job twice.", ["case-003"])),
 ("case-005", "The 3am Hallway Incident", "Anonymous Parent of Three", "def-lego-brick", ["charge-ambush"], "2026-01-08", "catastrophic",
  "I went to get a glass of water in the dark. I will not describe the sound I made. The defendant was exactly in the middle of the hallway, studs facing up.", ["The Hallway", "The Glass of Water (spilled)"],
  ("judge-rubber-duck", "guilty", "Confinement to a tub with a lid, indefinitely.", "The defendant did not speak in its defence. It did not need to. Studs facing up is intent.", [])),
 ("case-006", "Monday, Again", "Everyone", "def-monday", ["charge-betrayal"], "2026-02-02", "serious",
  "It came back. We told it not to. It came back anyway, and brought emails.", ["Sunday Evening", "The Inbox"],
  ("judge-grandfather-clock", "not-guilty", "None. The court cannot sentence the passage of time.", "Regrettably, Monday is operating within the calendar. The court is sympathetic, but its hands are literally tied to the calendar.", [])),
 ("case-007", "The Snooze Button Entrapment", "Night Owl, Dublin 8", "def-alarm-clock", ["charge-betrayal", "charge-conspiracy"], "2026-02-09", "serious",
  "The button says 'snooze'. It is the largest button on the device. It is right there. And then it gives me nine minutes. Nine! Who decided nine?", ["The Snooze Button"],
  ("judge-grandfather-clock", "guilty", "Probation until noon, and the snooze interval to be set to a round number.", "Unlike Monday, the Alarm Clock chose its actions. Nine minutes is a deliberate cruelty.", ["case-006"])),
 ("case-008", "Sunny Intervals (Alleged)", "Tourist, Wild Atlantic Way", "def-irish-weather", ["charge-false-promises"], "2026-07-19", "serious",
  "The forecast said sunny intervals. I got sun, hail, sideways rain and a rainbow in 25 minutes. I was wearing shorts.", ["The Shorts", "A Sheep"],
  ("judge-kettle", "case-dismissed", "None. The defendant technically delivered sunny intervals.", "The court finds that 'intervals' was doing a great deal of work in that forecast. Case dismissed with a warning to bring a jacket.", ["case-003"])),
 ("case-009", "Charging Only at 37 Degrees", "Commuter, Luas Green Line", "def-charging-cable", ["charge-premature-death"], "2026-06-03", "moderate",
  "It only charges if the cable is bent at a specific angle and the phone is not touched, looked at or thought about.", ["The Phone at 3%"],
  ("judge-rubber-duck", "guilty-extenuating", "Rehabilitation with electrical tape.", "The court accepts it is old and tired. Still, 37 degrees is not a reasonable demand.", [])),
 ("case-010", "The Pocket Knot", "Jogger, Phoenix Park", "def-headphones", ["charge-tangling"], "2026-06-11", "moderate",
  "I coiled them neatly. I put them in my pocket. I took them out 20 minutes later and they were a single solid sphere.", ["The Pocket"],
  ("judge-rubber-duck", "guilty", "Rehabilitation on a spool.", "Tangling while completely unattended demonstrates independent criminal intent.", [])),
 ("case-011", "The Cable Tangle Syndicate", "Jogger, Phoenix Park", "def-charging-cable", ["charge-tangling", "charge-conspiracy"], "2026-06-12", "serious",
  "The day after the Pocket Knot, the charging cable was found knotted into the headphones. They were holding hands.", ["The Drawer of Cables"],
  ("judge-rubber-duck", "guilty", "Separation from all known accomplices.", "Given the Pocket Knot conviction, the court finds a pattern of coordinated tangling.", ["case-010", "case-002"])),
 ("case-012", "Setting Three Means Nothing", "Breakfast Enthusiast", "def-toaster", ["charge-false-promises"], "2026-08-01", "minor",
  "Setting 3 yesterday: warm bread. Setting 3 today: a fire alarm. The dial is decorative.", ["The Smoke Alarm"],
  ("judge-kettle", "guilty-extenuating", "Mandatory honesty indicator on the dial.", "Like the Wi-Fi, the dial promises one thing and delivers another. The court is lenient: the Toaster is a close colleague of the bench.", ["case-003"])),
 ("case-013", "Veering Left in Aisle Four", "Weekly Shopper", "def-shopping-trolley", ["charge-noise"], "2026-08-15", "minor",
  "It veered into the biscuits. Every time I corrected it, it screamed. The whole shop looked.", ["Aisle Four", "The Biscuits"],
  ("judge-kettle", "not-guilty", "None.", "The court finds the defendant was drawn to the biscuits by forces understood by all present. Not guilty.", [])),
 ("case-014", "The Second Sock (Appeal Pending)", "A Tired Parent", "def-left-sock", ["charge-malicious-disappearance"], "2026-09-10", "grave",
  "It happened again. Different socks. Same machine. I believe it's the same sock operating under an alias.", ["The Remaining Sock (Again)"], None),
 ("case-015", "The Printer Strikes at 8:59", "Office Manager, Cork", "def-printer", ["charge-noise", "charge-premature-death"], "2026-09-18", "serious",
  "It made a grinding noise, displayed 'Error 0x8F', and died one minute before the board meeting.", ["The Board Meeting Agenda"], None),
]
for cid, title, by, dfn, chs, date, sev, test, wit, rul in cases:
    docs.append({"_id": cid, "_type": "grievance", "title": title, "slug": {"_type": "slug", "current": slug(title)}, "caseNumber": "TEO-2026-" + cid.split("-")[1],
                 "filedBy": by, "defendant": {"_type": "reference", "_ref": dfn}, "charges": [ref(c) for c in chs], "incidentDate": date, "severity": sev,
                 "testimony": test, "witnesses": wit, "status": "ruled" if rul else "awaiting-trial"})
    if rul:
        j, verdict, sentence, remarks, prec = rul
        docs.append({"_id": "ruling-" + cid.split("-")[1], "_type": "ruling", "grievance": {"_type": "reference", "_ref": cid}, "judge": {"_type": "reference", "_ref": j},
                     "verdict": verdict, "sentence": sentence, "judgeRemarks": remarks, "rulingDate": date,
                     "precedents": [ref("ruling-" + p.split("-")[1]) for p in prec]})

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tribunal.ndjson")
with open(out, "w") as f:
    for d in docs: f.write(json.dumps(d, ensure_ascii=False) + "\n")
print(len(docs), "documents ->", out)
