(function() {

	CKEDITOR.editor.prototype.ebx_refreshToolbarCollapsed = function() {
		// overwrite expand/collapse system

		this.ebx_toolbar_main.style.display = "";

		for ( var i = 0, len = this.ebx_toolbarGroups.length; i < len; i++) {
			if (this.ebx_isToolbarExpanded === true) {
				this.ebx_toolbarGroups[i].style.display = "";
			} else {
				if (!EBXUtils.arrayContains(this.config.ebx_toolbarGroupIndexToDisplayOnCollapsed, i)) {
					this.ebx_toolbarGroups[i].style.display = "none";
				}
			}
		}

		this.ebx_isToolbarExpanded = !this.ebx_isToolbarExpanded;
	};

})();

CKEDITOR.plugins.add('ebx_toolbarcollapsed', {
	requires: [ 'button', 'toolbar' ],

	init: function(editor) {

		editor.on('afterCommandExec', function(event) {
			if (event.data.name == 'toolbarCollapse') {
				editor.ebx_refreshToolbarCollapsed();
			}
		});

		editor.on('instanceReady', function(event) {

			this.ebx_isToolbarExpanded = this.config.toolbarStartupExpanded;

			var toolbar_collapser = this.ui.space('toolbar_collapser');
			this.ebx_toolbar_main = toolbar_collapser.$.previousSibling;

			this.ebx_toolbarGroups = this.ebx_toolbar_main.childNodes;

			editor.ebx_refreshToolbarCollapsed();
		});
	}
});