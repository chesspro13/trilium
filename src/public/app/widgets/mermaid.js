import libraryLoader from "../services/library_loader.js";
import NoteContextAwareWidget from "./note_context_aware_widget.js";
import froca from "../services/froca.js";

const TPL = `<div class="mermaid-widget">
    <div class="mermaid-error alert alert-warning">
        <p><strong>The diagram could not displayed.</strong></p>
        <p class="error-content">Rendering diagram...</p>
    </div>

    <div class="mermaid-render"></div>
</div>`;

export default class MermaidWidget extends NoteContextAwareWidget {
    isEnabled() {
        return super.isEnabled() && this.note && this.note.type === 'mermaid';
    }

    doRender() {
        this.$widget = $(TPL);
        this.contentSized();
        this.$display = this.$widget.find('.mermaid-render');
        this.$errorContainer = this.$widget.find(".mermaid-error");
        this.$errorMessage = this.$errorContainer.find(".error-content");
    }

    async refreshWithNote(note) {
        await libraryLoader.requireLibrary(libraryLoader.MERMAID);

        const documentStyle = window.getComputedStyle(document.documentElement);
        const mermaidTheme = documentStyle.getPropertyValue('--mermaid-theme');

        mermaid.mermaidAPI.initialize({ startOnLoad: false, theme: mermaidTheme.trim() });

        const noteComplement = await froca.getNoteComplement(note.noteId);
        const content = noteComplement.content || "";

        this.$display.empty();

        this.$errorMessage.text('Rendering diagram...');

        try {
            mermaid.mermaidAPI.render('graphDiv', content, content => this.$display.html(content));

            this.$errorContainer.hide();
        } catch (e) {
            this.$errorMessage.text(e.message);
            this.$errorContainer.show();
        }
    }

    async entitiesReloadedEvent({loadResults}) {
        if (loadResults.isNoteContentReloaded(this.noteId)) {
            await this.refresh();
        }
    }
}