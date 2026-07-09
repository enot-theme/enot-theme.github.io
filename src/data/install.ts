// Install prose per app. The pipeline owns the numbers (site.json);
// the site owns the words. Keyed by the app slug used in the URL
// (/vim/, /wezterm/, ...). body is HTML rendered via set:html;
// download hrefs are root-absolute - the files live at the site root.
export interface Install { app: string; title: string; body: string }

export const INSTALL: Install[] = [
  {
    app: 'vim',
    title: 'vim / neovim',
    body: `
<h3>1. download</h3>
<p><a href="/enot.vim" download>enot.vim</a> - one file, both themes.</p>
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.vim/colors &amp;&amp; cp enot.vim ~/.vim/colors/
# neovim:
mkdir -p ~/.config/nvim/colors &amp;&amp; cp enot.vim ~/.config/nvim/colors/</pre>
<h3>3. enable</h3>
<pre class="snippet">set termguicolors
set background=dark   " or light
colorscheme enot</pre>
<h3>notes</h3>
<p>True color is the primary mode; a 256-color fallback is built in,
taken from the xterm-256 depth of the spec - solved by the same
optimizer, not nearest-color quantization. Terminal palettes
(g:terminal_ansi_colors for vim, g:terminal_color_0..15 for neovim) ship
with the optimized ANSI 16 set.</p>
`,
  },
  {
    app: 'wezterm',
    title: 'WezTerm',
    body: `
<h3>1. download</h3>
<p><a href="/enot-dark.toml" download>enot-dark.toml</a> and
<a href="/enot-light.toml" download>enot-light.toml</a>.</p>
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.config/wezterm/colors
cp enot-dark.toml enot-light.toml ~/.config/wezterm/colors/</pre>
<h3>3. enable</h3>
<pre class="snippet">-- ~/.wezterm.lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.color_scheme = 'enot-dark'   -- or 'enot-light'

return config</pre>
<p>If you already have a config, add the color_scheme line to it -
do not paste a return statement into the middle of the file: in Lua,
return must be the last statement of the chunk.</p>
<h3>follow the OS appearance</h3>
<pre class="snippet">-- wezterm.gui is nil when the mux server evaluates the config
local function get_appearance()
  if wezterm.gui then
    return wezterm.gui.get_appearance()
  end
  return 'Dark'
end
config.color_scheme = get_appearance():find('Dark')
    and 'enot-dark' or 'enot-light'</pre>
<h3>notes</h3>
<p>The ANSI 16 palette in these schemes is optimized separately from the
syntax accents: neutral slots spread along the lightness axis, six color
families in two disjoint lightness tiers, minimum pairwise
&Delta;E00 of 7.2 across simulated visions.</p>
`,
  },
  {
    app: 'mc',
    title: 'Midnight Commander',
    body: `
<h3>1. download</h3>
<p><a href="/enot-dark-16M.ini" download>enot-dark-16M.ini</a> and
<a href="/enot-light-16M.ini" download>enot-light-16M.ini</a> - true color;
<a href="/enot-dark256.ini" download>enot-dark256.ini</a> and
<a href="/enot-light256.ini" download>enot-light256.ini</a> - the xterm-256
fallback.</p>
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.local/share/mc/skins
cp enot-*.ini ~/.local/share/mc/skins/</pre>
<h3>3. enable</h3>
<pre class="snippet">mc -S enot-dark-16M     # or enot-light-16M
# or permanently: Options &gt; Appearance &gt; enot-dark-16M</pre>
<h3>notes</h3>
<p>The -16M skins need mc &ge; 4.8.19 built with S-Lang and a terminal
that advertises COLORTERM=truecolor. mc does not degrade a skin color
by color: on a terminal without true color it falls back to the default
skin entirely - that is what the 256 variants are for. They carry the
xterm-256 depth of the spec, solved by the same optimizer (see the
invariants tables in <a href="/numbers/">numbers</a>). Hotkeys and
dialog titles are encoded with underline and bold rather than accent
colors, so they read the same under any vision.</p>
`,
  },
  {
    app: 'telegram',
    title: 'Telegram Desktop',
    body: `
<h3>1. download</h3>
<p><a href="/enot-dark.tdesktop-theme" download>enot-dark.tdesktop-theme</a> and
<a href="/enot-light.tdesktop-theme" download>enot-light.tdesktop-theme</a> -
plain-text palette files, no archive.</p>
<h3>2. apply</h3>
<p>In Telegram Desktop: Settings &gt; Chat settings &gt; Choose from file,
pick the downloaded theme - the client shows a preview before applying.
Alternatively send the file to any chat (Saved Messages works) and click
it there.</p>
<h3>notes</h3>
<p>The file is the full palette: 586 entries rendered from the spec, so
nothing falls back to the stock day colors. Message bubbles ride the
tinted background roles, the eight userpic slots take the accent set -
the pairwise &Delta;E00 guarantee is what keeps avatars and sender names
apart under color blindness. Shadows, scrims and selection overlays are
alpha channels over specification colors, never colors of their own.
A theme loaded from a file is re-read on every launch, handy while
tweaking. No background image is bundled: your wallpaper stays.</p>
`,
  },
  {
    app: 'ranger',
    title: 'ranger',
    body: `
<h3>1. download</h3>
<p><a href="/enot.py" download>enot.py</a> - one file, both themes.</p>
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.config/ranger/colorschemes
cp enot.py ~/.config/ranger/colorschemes/</pre>
<h3>3. enable</h3>
<pre class="snippet"># ~/.config/ranger/rc.conf
set colorscheme enot</pre>
<h3>notes</h3>
<p>The scheme addresses the terminal palette by index (ANSI 0-15 plus
the terminal default), so one file serves dark and light and follows
whatever palette the terminal provides. Pair it with the enot WezTerm
schemes - or any terminal carrying the enot ANSI 16 set - to get the
guaranteed palette. Requires ranger &ge; 1.9.3.</p>
`,
  },
];
