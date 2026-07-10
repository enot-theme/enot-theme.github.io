// Per-app words. Names, download lists and the basic install line come
// from the port registry (site.json); this file only refines them:
// blurb is the get-page card line, body is the install page's steps and
// notes (HTML via set:html; the download section is generated). Array
// order is the display order of cards and CTA buttons. An app missing
// here still gets its page and card from the registry alone.
export interface Install { app: string; blurb: string; body: string }

// Registry ports in display order: INSTALL order first, unknown apps
// keep their registry order after it.
export function orderPorts<T extends { app: string }>(ports: T[]): T[] {
  const order = new Map(INSTALL.map((i, n) => [i.app, n]));
  return [...ports].sort(
    (a, b) => (order.get(a.app) ?? INSTALL.length)
      - (order.get(b.app) ?? INSTALL.length));
}

export const INSTALL: Install[] = [
  {
    app: 'vim',
    blurb: 'one file, both themes, true-color with a computed 256-color '
      + 'fallback, terminal palettes included',
    body: `
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
    app: 'lightline',
    blurb: 'a statusline palette to match: mode chips on the enot '
      + 'accents, one file for both themes',
    body: `
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.vim/autoload/lightline/colorscheme
cp enot.vim ~/.vim/autoload/lightline/colorscheme/</pre>
<h3>3. enable</h3>
<pre class="snippet">let g:lightline = {'colorscheme': 'enot'}</pre>
<h3>notes</h3>
<p>One file serves both themes: the palette reads &amp;background when
lightline loads it (neovim users can keep it under the nvim config at
the same autoload path). After switching background at runtime,
re-source with :call lightline#init() followed by lightline#colorscheme()
and lightline#update(). Mode chips - normal blue, insert green, replace
red, visual purple - sit on accent fills with base-color text: the 4.5:1
contrast is the same specification guarantee the editor colors carry.
Pairs with the enot vim scheme.</p>
`,
  },
  {
    app: 'sublime',
    blurb: 'two color schemes, dark and light, with OS-appearance '
      + 'auto switching',
    body: `
<h3>2. install</h3>
<p>Preferences &gt; Browse Packages opens the packages folder; drop both
files into <code>User/</code>.</p>
<h3>3. enable</h3>
<pre class="snippet">// Preferences.sublime-settings
"color_scheme": "auto",
"dark_color_scheme": "enot-dark.sublime-color-scheme",
"light_color_scheme": "enot-light.sublime-color-scheme"</pre>
<h3>notes</h3>
<p>Or pick one directly: UI: Select Color Scheme. The rules follow the
same role mapping as the vim scheme - keywords red, functions green,
strings aqua, types yellow, constants purple - and the diff backgrounds
are the specification tint roles, so added and deleted lines stay
distinguishable under any vision.</p>
`,
  },
  {
    app: 'vscode',
    blurb: 'one extension, both themes: workbench colors, token rules '
      + 'and the optimized terminal palette',
    body: `
<h3>2. install</h3>
<pre class="snippet">code --install-extension enot.vsix</pre>
<p>Or in the app: Extensions &gt; &hellip; menu &gt; Install from VSIX.</p>
<h3>3. enable</h3>
<p>Preferences: Color Theme &gt; enot-dark or enot-light; to follow the
OS appearance set window.autoDetectColorScheme and pick the two enot
themes as the preferred dark and light ones.</p>
<h3>notes</h3>
<p>The integrated terminal gets the optimized ANSI 16 set - the same
palette the WezTerm schemes carry. Find matches, scrollbars and
selections are alpha overlays over specification colors; mode-agnostic
chrome (status bar, tabs, side bar) sits on the neutral ladder with the
same contrast guarantees as the editor text.</p>
`,
  },
  {
    app: 'bat',
    blurb: 'two .tmTheme files, dark and light, with the same scope '
      + 'mapping as the editors',
    body: `
<h3>2. install</h3>
<pre class="snippet">mkdir -p "$(bat --config-dir)/themes"
cp enot-dark.tmTheme enot-light.tmTheme "$(bat --config-dir)/themes/"
bat cache --build</pre>
<h3>3. enable</h3>
<pre class="snippet">bat --theme=enot-dark file.py
# or permanently, in ~/.config/bat/config:
--theme="enot-dark"</pre>
<h3>notes</h3>
<p>bat reads TextMate .tmTheme files only - the newer
.sublime-color-scheme is not supported - so this port emits that format
while reusing the enot scope mapping verbatim: keywords red, functions
green, strings aqua, types yellow, constants purple, comments a muted
italic. Diff and patch backgrounds are the specification tint roles, so
added and deleted lines stay apart under any vision. bat names the theme
after the file, hence enot-dark and enot-light in --list-themes.</p>
`,
  },
  {
    app: 'wezterm',
    blurb: 'two TOML schemes, dark and light, with the optimized '
      + 'ANSI 16 palette',
    body: `
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
    app: 'ohmyzsh',
    blurb: 'a minimal one-line prompt driven by the terminal '
      + 'ANSI palette, one file for both themes',
    body: `
<h3>2. install</h3>
<pre class="snippet">cp enot.zsh-theme ~/.oh-my-zsh/custom/themes/</pre>
<h3>3. enable</h3>
<pre class="snippet"># ~/.zshrc
ZSH_THEME="enot"</pre>
<h3>notes</h3>
<p>A quiet single-line prompt in the robbyrussell lineage: the current
directory in blue, the git branch and a dirty marker in yellow and red,
and a leading arrow that turns from green to red on a non-zero exit
status - red and green are the enot pair the palette keeps distinguishable
under protanopia and deuteranopia. Colors are ANSI slots 0-15 taken from
the terminal, so one file serves both themes; pair it with the enot
WezTerm schemes, or any terminal carrying the enot ANSI 16 set, for the
guaranteed palette.</p>
`,
  },
  {
    app: 'mc',
    blurb: 'four skins: dark and light, true color plus an xterm-256 '
      + 'fallback solved on the grid',
    body: `
<h3>2. install</h3>
<pre class="snippet">mkdir -p ~/.local/share/mc/skins
cp enot-*.ini ~/.local/share/mc/skins/</pre>
<h3>3. enable</h3>
<pre class="snippet">mc -S enot-dark-16M     # or enot-light-16M
# or permanently: Options &gt; Appearance &gt; enot-dark-16M</pre>
<h3>notes</h3>
<p>The -16M skins are true color and need mc &ge; 4.8.19 built with
S-Lang and a terminal that advertises COLORTERM=truecolor. mc does not
degrade a skin color by color: on a terminal without true color it
falls back to the default skin entirely - that is what the 256 variants
are for. They carry the xterm-256 depth of the spec, solved by the same
optimizer (see the invariants tables in <a href="/numbers/">numbers</a>).
Hotkeys and dialog titles are encoded with underline and bold rather
than accent colors, so they read the same under any vision.</p>
`,
  },
  {
    app: 'ranger',
    blurb: 'one colorscheme for both themes, driven by the terminal '
      + 'ANSI palette',
    body: `
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
  {
    app: 'nimble',
    blurb: 'two importable themes: panels, tabs, built-in terminal '
      + 'and viewer',
    body: `
<h3>2. import</h3>
<p>Settings &gt; Themes &gt; import, pick <code>enot-dark.json</code>,
repeat for <code>enot-light.json</code>.</p>
<h3>3. enable</h3>
<p>Select the theme in the same tab, or set both as the dark and light
entries of automatic switching to follow the OS appearance.</p>
<h3>notes</h3>
<p>File coloring matches the mc and ranger ports: directories blue,
executables green, links aqua, marked files yellow, hidden files
dimmed. The built-in terminal carries the optimized ANSI 16 set and
the viewer maps its syntax colors to the same roles as the editors.</p>
`,
  },
  {
    app: 'telegram',
    blurb: 'two theme files, dark and light: the full palette plus a '
      + 'solid background instead of the wallpaper',
    body: `
<h3>2. apply</h3>
<p>In Telegram Desktop: Settings &gt; Chat settings &gt; Choose from file,
pick the downloaded theme - the client shows a preview before applying.
Alternatively send the file to any chat (Saved Messages works) and click
it there.</p>
<h3>notes</h3>
<p>The file carries the full palette - 586 entries rendered from the
spec, so nothing falls back to the stock day colors - plus a solid
background in the theme's base color, which replaces the wallpaper:
chats sit on a specification color, not on the doodle pattern.
Message bubbles ride the tinted background roles, the eight userpic
slots take the accent set - the pairwise &Delta;E00 guarantee is what
keeps avatars and sender names apart under color blindness. Shadows,
scrims and selection overlays are alpha channels over specification
colors, never colors of their own. A theme loaded from a file is
re-read on every launch, handy while tweaking.</p>
`,
  },
];
