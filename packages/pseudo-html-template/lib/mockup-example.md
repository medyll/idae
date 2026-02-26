Structural description of the interface as semantic pseudo-HTML. Tags are utility layout elements — they carry no style, only structure and functional responsibilities.

**Conventions:**
- `<row>` — horizontal container
- `<column>` — vertical container
- `<panel>` — delimited area with a functional role
- `<toolbar>` — fixed horizontal toolbar
- `<text-zone>` — text input or display area
- `<chat-bubble>` — AI or user message bubble
- `<tab-bar>` — tab bar
- `<tab>` — individual tab
- `<overlay>` — floating element positioned above the layout
- `<spinner>` — loading indicator
- `<timeline>` — chronological timeline
- `<diff-view>` — side-by-side diff display
- `<badge>` — discreet indicator (dot)
- `<resize-handle>` — resize handle between two panels

```html
<!-- [main-screen] : MAIN SCREEN — Writing Mode -->
<column id="app-root" full-height>

  <!-- [main-toolbar] : Fixed top main toolbar -->
  <toolbar id="main-toolbar" position="top">
    <!-- Active project name + chapter -->
    <text label="active_project / current_chapter" />

    <!-- Global actions -->
    <button action="focus-mode"  label="Focus" />         <!-- hides right panel -->
    <button action="review-mode" label="Review" />
    <button action="harden"      label="💾 New version" /> <!-- triggers versioning -->
    <button action="settings"    label="⚙" />
  </toolbar>

  <!-- [main-body] : Main body — resizable split -->
  <row id="main-body" flex>

    <!--[left-panel] LEFT PANEL — Editor -->
    <panel id="editor-panel" default-width="55%" resizable>
      <text-zone
        id="main-editor"
        role="main editor for the current chapter"
        multiline
        spellcheck
        autosave
        <!-- Narrative .md text is edited here -->
        <!-- Modifications trigger the AI spinner on the right -->
      />
    </panel>

    <!-- [resize-handle] : Resize handle between the two panels -->
    <resize-handle id="split-handle" axis="horizontal" />

    <!-- [right-panel] : RIGHT PANEL — AI & Tools -->
    <panel id="ai-panel" default-width="45%" resizable collapsible>

      <!-- [right-panel-tab-bar] : Right panel tab bar -->
      <tab-bar id="ai-tabs">
        <tab id="tab-suggestions" label="Suggestions" default-active />
        <tab id="tab-coherence"   label="Coherence" />
        <tab id="tab-style"       label="Style" />
        <tab id="tab-history"     label="History" />
      </tab-bar>

      <!-- [ai-spinner] : AI Spinner — visible during processing, in the right panel -->
      <spinner
        id="ai-spinner"
        position="top-right-of-panel"
        visible-when="ai-processing"
        <!-- Appears as soon as an AI process is running -->
        <!-- Disappears when the result is displayed -->
      />

      <!-- [tab-content-suggestions] Suggestions tab content -->
      <panel id="tab-content-suggestions" visible-when="tab-suggestions-active">
        <!-- List of AI proposals as a diff -->
        <diff-view
          id="suggestions-diff"
          left="original text"
          right="AI proposal"
          <!-- Each proposal can be independently accepted or rejected -->
        />
        <row id="suggestion-actions">
          <button action="accept-suggestion" label="Accept" />
          <button action="reject-suggestion" label="Reject" />
          <button action="accept-all"        label="Accept all" />
        </row>
      </panel>

      <!-- [tab-content-coherence] : Coherence tab content -->
      <panel id="tab-content-coherence" visible-when="tab-coherence-active">
        <!-- List of alerts produced by skill_coherence -->
        <!-- Each alert: concerned entity + discrepancy type + confidence level -->
        <column id="coherence-alerts">
          <chat-bubble
            role="coherence-alert"
            fields="[entity, discrepancy_type, confidence, note]"
            <!-- Low = grey | Medium = orange | High = red -->
          />
          <!-- One bubble per detected alert -->
        </column>
      </panel>

      <!-- [tab-content-style] : Style tab content -->
      <panel id="tab-content-style" visible-when="tab-style-active">
        <button action="analyse-passage" label="Analyse this passage" />
        <!-- skill_style results on the current selection -->
        <column id="style-results">
          <chat-bubble role="style-signal" fields="[location, signal, suggestion]" />
        </column>
      </panel>

      <!-- [tab-content-history] : History tab content -->
      <panel id="tab-content-history" visible-when="tab-history-active">
        <!-- [harden-timeline] Harden version timeline -->
        <timeline
          id="harden-timeline"
          source="index.yaml"
          <!-- Each point = a Harden with label + message + date -->
          <!-- Click on a point = preview that version -->
        />
        <!-- [diff-controls] -->
        <row id="diff-controls">
          <text label="Compare:" />
          <select id="version-a" source="harden-list" />
          <text label="↔" />
          <select id="version-b" source="harden-list" />
          <button action="launch-diff" label="View differences" />
        </row>
        <!-- [diff-view] : Visual diff between two selected versions -->
        <diff-view id="version-diff" visible-when="diff-launched" />
      </panel>

    </panel>
  </row>

  <!-- [chat-bar] : OVERLAY — Floating chat bar (voice commands + image upload) -->
  <overlay id="chat-bar" position="bottom-center" draggable collapsible>
    <row>
      <button action="toggle-voice" icon="mic"   label="Voice" />  <!-- LiveKit -->
      <text-zone id="chat-input" role="text or voice command to AI" inline />
      <button action="upload-image" icon="image" label="Image" />
      <button action="send"         icon="send"  label="Send" />
    </row>
  </overlay>

  <!-- [suggestions-ready-badge] : BADGE — Discreet indicator in Focus Mode (right panel hidden) -->
  <badge
    id="suggestions-ready-badge"
    position="right-edge-of-editor"
    visible-when="focus-mode AND suggestions-available"
    <!-- Coloured dot indicating AI suggestions are ready -->
    <!-- Only visible when the right panel is hidden -->
  />

</column>


<!--  [onboarding-screen] : ONBOARDING SCREEN — First launch -->
<column id="onboarding-screen" centered>

  <!-- [step-name] : Step 1 — Name -->
  <panel id="step-name" visible-when="step === 1">
    <text-zone
      id="input-name"
      role="first name or pseudonym input"
      placeholder="What should we call you?"
      <!-- Loose validation — any non-empty string -->
    />
    <button action="next-step" label="Continue →" />
  </panel>

  <!-- [step-security] : Step 2 — Security choice -->
  <panel id="step-security" visible-when="step === 2">
    <text label="Do you want to protect your space?" />
    <column id="security-options">
      <button action="no-password"  label="Direct access — no password" />
      <button action="set-password" label="Create a password" />
      <button action="use-oauth"    label="Sign in with an existing account" />
    </column>
  </panel>

  <!-- [step-password] Step 2b — Password entry (if password chosen) -->
  <panel id="step-password" visible-when="step === 2b">
    <text-zone id="input-password"  role="password input"        type="password" placeholder="Password" />
    <text-zone id="input-password2" role="password confirmation" type="password" placeholder="Confirm" />
    <button action="confirm-password" label="Confirm" />
  </panel>

  <!-- [step-oauth] : Step 2c — OAuth provider choice (if OAuth chosen) -->
  <panel id="step-oauth" visible-when="step === 2c">
    <text label="Choose a provider:" />
    <column id="oauth-providers">
      <button action="oauth-google"  label="Continue with Google" />
      <button action="oauth-github"  label="Continue with GitHub" />
      <button action="oauth-apple"   label="Continue with Apple" />
      <!-- extensible: oauth-discord, oauth-microsoft, etc. -->
    </column>
  </panel>

</column>


<!-- [review-screen] :REVIEW MODE SCREEN -->
<column id="review-screen">
  <!--  [toolbar] -->
  <toolbar id="review-toolbar" position="top">
    <text label="Review Mode" />
    <select id="scope-selector" options="[selected passage, current chapter, entire volume]" />
    <button action="launch-review" label="Run analysis" />
    <button action="exit-review"   label="← Back to writing" />
    <button action="export-report" label="Export report" />  <!-- .md or .pdf -->
  </toolbar>
  <!--  [review-body] -->  
  <row id="review-body">

    <!-- [review-text] : Read-only text with highlights -->
    <panel id="review-text" width="55%">
      <text-zone
        id="text-readonly"
        role="narrative text in read-only mode"
        readonly
        <!-- Flagged passages are highlighted -->
        <!-- Click on a highlight = scroll to the corresponding alert -->
      />
    </panel>

    <!-- [review-report] : Structured audit report -->
    <panel id="review-report" width="45%">
      <!-- [report-sections] -->
      <column id="report-sections">
        <!-- [report-inconsistencies] -->
        <panel id="report-inconsistencies">
          <text label="Inconsistencies" role="section-header" />
          <chat-bubble role="report-item" fields="[entity, description, confidence]" />
        </panel>
        <!-- [report-pov] -->  
        <panel id="report-pov">
          <text label="Point of View" role="section-header" />
          <chat-bubble role="report-item" fields="[location, detected_deviation]" />
        </panel>
        <!-- [report-threads] -->
        <panel id="report-threads">
          <text label="Narrative Threads" role="section-header" />
          <chat-bubble role="report-item" fields="[thread_id, status, note]" />
        </panel>
        <!-- [report-tension] -->
        <panel id="report-tension">
          <text label="Tension Curve" role="section-header" />
          <!-- Line chart: actual tension vs target tension -->
          <chart type="line" series="[actual_tension, target_tension]" />
        </panel>
        <!-- [report-themes] -->
        <panel id="report-themes">
          <text label="Themes & Motifs" role="section-header" />
          <chat-bubble role="report-item" fields="[motif_id, presence, consistency]" />
        </panel>
        <!-- [report-voices] -->
        <panel id="report-voices">
          <text label="Character Voices" role="section-header" />
          <chat-bubble role="report-item" fields="[character_id, register_deviation, example]" />
        </panel>
        <!-- [report-style] -->
        <panel id="report-style">
          <text label="Style & Rhythm" role="section-header" />
          <chat-bubble role="report-item" fields="[signal_type, location, suggestion]" />
        </panel>

      </column>
    </panel>

  </row>

</column>
```