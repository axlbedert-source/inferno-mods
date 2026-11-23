// ============================================================
//  YOUR MODS — edit this file to add, remove or update mods.
//  Each mod is one { ... } block. Copy one and change the values.
//
//  id          short unique name, no spaces (used in the page link)
//  name        title shown on the card
//  category    one of: Aircraft, Livery, Map, Mission, Script, Sound, Utility
//  version     your mod's version
//  dcsVersion  DCS version you tested it with
//  updated     date in YYYY-MM-DD
//  size        file size shown on the button, e.g. "48 MB"
//  image       path to a screenshot, 16:9 or 3:2, at least 960px wide
//              (put your own in the images/ folder)
//  imageAlt    one line saying what the screenshot shows
//  download    link to the file: a GitHub release, Google Drive,
//              Dropbox, or a path like "downloads/my-mod.zip".
//              Left "", the mod shows without a download button.
//  summary     one line shown on the card
//  description longer text shown when someone opens the mod
//  install     list of install steps
//  changelog   list of { version, notes }
// ============================================================

window.SITE = {
  // Your name or callsign. It also needs changing in index.html and mod.html
  // (search for "Inferno Mods"): the title, the h1, the logo and the footer.
  title: "Inferno Mods",
  // Footer links to your accounts. Leave the list empty to show none.
  links: [
    // { label: "Discord", url: "https://discord.gg/your-invite" },
    // { label: "GitHub", url: "https://github.com/your-name" }
  ]
};

window.MODS = [
  {
    id: "pitts-s12",
    name: "Pitts S12",
    category: "Aircraft",
    // Fill these in when you know them; empty ones are simply not shown.
    version: "",
    dcsVersion: "",
    updated: "",
    size: "",
    // Stand-in photo of a real Pitts Model 12. Swap for your own in-game screenshot.
    image: "assets/img/photo-f111251431-1280.jpg",
    imageAlt: "A yellow and black Pitts biplane parked on an airfield taxiway",
    // Paste the link to the zip here (a GitHub release, Google Drive...).
    download: "",
    summary: "The Pitts aerobatic biplane as a flyable aircraft for DCS World.",
    description: "",
    install: [
      "Unzip the download.",
      "Copy the folder into Saved Games\\DCS\\Mods\\aircraft.",
      "Start DCS and pick the Pitts S12 in the mission editor."
    ],
    changelog: []
  }
];
