/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.html or
 *          http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {

	config.plugins = 'basicstyles,button,clipboard,colorbutton,dialog,dialogui,ebx_toolbarcollapsed,enterkey,fakeobjects,floatpanel,font,image,indent,justify,link,list,listblock,maximize,menu,menubutton,panel,panelbutton,pastefromword,pastetext,preview,print,removeformat,resize,richcombo,sourcearea,toolbar,wysiwygarea';

	config.extraPlugins = '';

	config.toolbar = [ [ "Bold", "Italic", "Underline", "-", "TextColor", "BGColor" ], [ "Font", "FontSize" ],
			[ "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock" ], [ "RemoveFormat" ], [ "NumberedList", "BulletedList" ],
			[ "Outdent", "Indent" ], [ "Cut", "Copy", "Paste", "PasteText", "PasteFromWord" ], [ "Link", "Unlink" ], [ "Image" ],
			[ "Preview", "Print" ], [ "Maximize" ] ];

	config.ebx_toolbarGroupIndexToDisplayOnCollapsed = [ 0, 2, 4, 11 ];

	config.allowedContent = true;

	// Dialog windows are also simplified.
	config.removeDialogTabs = 'image:advanced;link:advanced';

	config.resize_dir = 'both';
	config.resize_minHeight = 200;
	config.resize_minWidth = 300;

	config.toolbarCanCollapse = true;
	config.toolbarStartupExpanded = false;
};

CKEDITOR.skin.name = "ebx_moono";
CKEDITOR.config.skin = "ebx_moono";
CKEDITOR.skin.ua_editor = "";
CKEDITOR.skin.ua_dialog = "";
// this does not work, so the source of ckeditor has been changed for EBX (search for /*===autoinline disabled for EBX===)
CKEDITOR.disableAutoInline = false;
