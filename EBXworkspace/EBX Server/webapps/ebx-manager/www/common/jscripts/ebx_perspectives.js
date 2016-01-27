function EBX_Perspective() {}

EBX_Perspective.isNavigationPaneReduced = false;
EBX_Perspective.navigationPaneWidthBeforeReduced = null;
EBX_Perspective.toggleNavigationPaneReduced = function() {
	var targetNavigationWidth;

	if (EBX_Perspective.isNavigationPaneReduced) {
		targetNavigationWidth = EBX_Perspective.navigationPaneWidthBeforeReduced;
	} else {
		EBX_Perspective.navigationPaneWidthBeforeReduced = EBX_LayoutManager.getNavigationWidth();
		targetNavigationWidth = EBX_LayoutManager.navigationPaneReducedWidth;
	}

	EBX_LayoutManager.bodyLayout.getUnitByPosition(EBX_LayoutManager.bodyUnits.navigation.position).set('width', targetNavigationWidth);

	window.setTimeout(EBX_Perspective.refreshScrollButtons, Math.max(EBX_Perspective.sectionsReductionCSSTransitionDuration,
			EBX_Perspective.groupExpandCollapseCSSTransitionDuration));
};

EBX_Perspective.refreshNavigationPane = function(previousState) {
	var itemFirstLevel, collapsibleBlockToClearWidth;

	// close any group root if state of pane has changed
	if (previousState !== EBX_Perspective.isNavigationPaneReduced && EBX_Perspective.buttonToClickToCollapseCurrentGroupRoot !== null) {
		EBX_Perspective.buttonToClickToCollapseCurrentGroupRoot.click();
	}

	if (EBX_Perspective.isNavigationPaneReduced) {
		// nothing to do now
	} else {

		// roll-up still-opened groups
		while ((itemFirstLevel = EBX_Perspective.stillOpenedItemFirstLevel.pop()) !== undefined) {
			EBX_Perspective.mouseleaveItemFirstLevelListener(itemFirstLevel, true, true);
		}

		// clear collapsible blocks width
		while ((collapsibleBlockToClearWidth = EBX_Perspective.collapsibleBlockToClearWidthOnExpandPane.pop()) !== undefined) {
			collapsibleBlockToClearWidth.style.width = "";
			EBX_Perspective.removeSubGroupScroll(collapsibleBlockToClearWidth);
		}
	}
};

EBX_Perspective.navigationContentEl = null;
EBX_Perspective.navigationPaneScrollTop = null;
EBX_Perspective.navigationPaneScrollBottom = null;

EBX_Perspective.initScrollController = function() {
	EBX_Perspective.navigationContentEl = document.getElementById("ebx_NavigationContent");
	EBX_Perspective.navigationPaneScrollTop = document.getElementById("ebx_NavigationPaneScrollTop");
	EBX_Perspective.navigationPaneScrollBottom = document.getElementById("ebx_NavigationPaneScrollBottom");

	YAHOO.util.Event.addListener(EBX_Perspective.navigationContentEl, "scroll", EBX_Perspective.refreshScrollButtons, null, this);

	EBX_LayoutManager.bodyLayout.addListener("resize", EBX_Perspective.refreshScrollButtons);

	// init browser's exceptions too
	if (EBX_LayoutManager.doesBrowserSupportsCSSTransitions === false) {
		EBX_Perspective.sectionsReductionCSSTransitionDuration = 0;
		EBX_Perspective.groupExpandCollapseCSSTransitionDuration = 0;
	}

	window.setTimeout(EBX_Perspective.refreshScrollButtons, EBX_Perspective.groupExpandCollapseCSSTransitionDuration);
};

EBX_Perspective.scrollTopButtonEnabledCSSClass = "ebx_ScrollTopButtonEnabled";
EBX_Perspective.scrollBottomButtonEnabledCSSClass = "ebx_ScrollBottomButtonEnabled";

EBX_Perspective.maxScroll = 0;

EBX_Perspective.refreshScrollButtons = function() {
	var scrollTop = EBX_Perspective.navigationContentEl.scrollTop;
	var scrollHeight = EBX_Perspective.navigationContentEl.scrollHeight;
	var clientHeight = EBX_Perspective.navigationContentEl.clientHeight;

	EBX_Perspective.maxScroll = scrollHeight - clientHeight;

	if (scrollTop > 0) {
		EBXUtils.addCSSClass(EBX_Perspective.navigationContentEl, EBX_Perspective.scrollTopButtonEnabledCSSClass);
	} else {
		EBXUtils.removeCSSClass(EBX_Perspective.navigationContentEl, EBX_Perspective.scrollTopButtonEnabledCSSClass);
	}

	if (scrollHeight - scrollTop !== clientHeight) {
		EBXUtils.addCSSClass(EBX_Perspective.navigationContentEl, EBX_Perspective.scrollBottomButtonEnabledCSSClass);
	} else {
		EBXUtils.removeCSSClass(EBX_Perspective.navigationContentEl, EBX_Perspective.scrollBottomButtonEnabledCSSClass);
	}
};

EBX_Perspective.scrollAmount = 50;//px

/* When the user hold a scroll button.
 * The scroll is done once, then a delay, then repeated scrolls. */
EBX_Perspective.delayToLaunchRepeatedScrolling = 400;//ms

EBX_Perspective.scrollAnimationDuration = 100;//ms
EBX_Perspective.delayForRepeatedScrolling = 100;//ms

EBX_Perspective.scrollTimeout = null;
EBX_Perspective.scrollInterval = null;

EBX_Perspective.scrollNavigationPaneUpMouseDown = function() {
	window.setTimeout(EBX_Perspective.scrollNavigationPaneUp, 0);
	EBX_Perspective.scrollTimeout = window.setTimeout(EBX_Perspective.scrollNavigationPaneUpLaunchScrollInterval,
			EBX_Perspective.delayToLaunchRepeatedScrolling);
};
EBX_Perspective.scrollNavigationPaneUpLaunchScrollInterval = function() {
	EBX_Perspective.scrollInterval = window.setInterval(EBX_Perspective.scrollNavigationPaneUp, EBX_Perspective.delayForRepeatedScrolling);
};

EBX_Perspective.scrollNavigationPaneDownMouseDown = function() {
	window.setTimeout(EBX_Perspective.scrollNavigationPaneDown, 0);
	EBX_Perspective.scrollTimeout = window.setTimeout(EBX_Perspective.scrollNavigationPaneDownLaunchScrollInterval,
			EBX_Perspective.delayToLaunchRepeatedScrolling);
};
EBX_Perspective.scrollNavigationPaneDownLaunchScrollInterval = function() {
	EBX_Perspective.scrollInterval = window.setInterval(EBX_Perspective.scrollNavigationPaneDown, EBX_Perspective.delayForRepeatedScrolling);
};

EBX_Perspective.stopScrollNavigationPane = function() {
	window.clearTimeout(EBX_Perspective.scrollTimeout);
	window.clearInterval(EBX_Perspective.scrollInterval);
};

EBX_Perspective.scrollNavigationPaneUp = function() {
	var targetScrollTop = EBX_Perspective.navigationContentEl.scrollTop + EBX_Perspective.scrollAmount;

	if (targetScrollTop > EBX_Perspective.maxScroll) {
		targetScrollTop = EBX_Perspective.maxScroll;
	}

	new YAHOO.util.Scroll(EBX_Perspective.navigationContentEl, {
		scroll: {
			to: [ 0, targetScrollTop ]
		}
	}, EBX_Perspective.scrollAnimationDuration / 1000).animate();
};

EBX_Perspective.scrollNavigationPaneDown = function() {
	var targetScrollTop = EBX_Perspective.navigationContentEl.scrollTop - EBX_Perspective.scrollAmount;

	if (targetScrollTop < 0) {
		targetScrollTop = 0;
	}

	new YAHOO.util.Scroll(EBX_Perspective.navigationContentEl, {
		scroll: {
			to: [ 0, targetScrollTop ]
		}
	}, EBX_Perspective.scrollAnimationDuration / 1000).animate();
};

EBX_Perspective.buttonToClickToCollapseCurrentGroupRoot = null;

/* Map group id -> Object {
 * childrenCount: Number,
 * parentGroup: String group id, (optional)
 * childrenGroup: Array of group id, (optional)
 * expanded: boolean (lazy loading: false if undefined)
 * }
 * */
EBX_Perspective.group = [];

EBX_Perspective.sectionCSSClass = "ebx_perspectiveSection";
EBX_Perspective.groupsCSSClass = "ebx_perspectiveGroups";
EBX_Perspective.groupCSSClass = "ebx_perspectiveGroup";
EBX_Perspective.actionCSSClass = "ebx_perspectiveAction";

EBX_Perspective.groupExpandedCSSClass = "ebx_PerspectiveGroupExpanded";
EBX_Perspective.itemHiddenCSSClass = "ebx_perspectiveItemHidden";
EBX_Perspective.groupExpandedHideChildrenCSSClass = "ebx_PerspectiveGroupExpandedHideChildren";

EBX_Perspective.groupCollapseTransitionCSSClass = "ebx_PerspectiveGroupCollapseTransition";

EBX_Perspective.groupSubMenuModeCSSClass = "ebx_PerspectiveGroupSubMenuMode";

EBX_Perspective.sectionsReductionCSSTransitionDuration = 500;//ms
EBX_Perspective.groupExpandCollapseCSSTransitionDuration = 500;//ms

EBX_Perspective.originalMarginTopOfFloatingGroupLabel = -10;
EBX_Perspective.groupMoveUpIfNoEnoughSpace_GutterHeight = 25; // height of the scroll button (just for esthetic)

EBX_Perspective.collapsibleBlockToClearWidthOnExpandPane = [];

EBX_Perspective.getTopParentId = function(groupId) {
	var currentGroupId = groupId;

	while (EBX_Perspective.group[currentGroupId].parentGroup !== undefined) {
		currentGroupId = EBX_Perspective.group[currentGroupId].parentGroup;
	}

	return currentGroupId;
};

EBX_Perspective.getParentsNumber = function(groupId) {
	var ret = 0, currentGroupId = groupId;

	while (EBX_Perspective.group[currentGroupId].parentGroup !== undefined) {
		ret++;
		currentGroupId = EBX_Perspective.group[currentGroupId].parentGroup;
	}

	return ret;
};

EBX_Perspective.getNumberOfVisibleItemsInThisGroupFromTop = function(groupId) {
	var topGroupId, count, currentGroup, currentChildrenGroupIds, currentChild, firstChildExpanded, i, len;

	topGroupId = EBX_Perspective.getTopParentId(groupId);

	count = 1;// top parent

	currentGroup = EBX_Perspective.group[topGroupId];

	if (currentGroup.expanded === undefined) {
		currentGroup.expanded = false;
	}

	// this condition is only used for the first loop, in next loops, current group is always expanded
	while (currentGroup.expanded === true) {
		// search for an expanded child
		currentChildrenGroupIds = currentGroup.childrenGroup;
		firstChildExpanded = null;
		if (currentChildrenGroupIds !== undefined) {
			for (i = 0, len = currentChildrenGroupIds.length; i < len; i++) {
				currentChild = EBX_Perspective.group[currentChildrenGroupIds[i]];
				if (currentChild.expanded === undefined) {
					currentChild.expanded = false;
				} else if (currentChild.expanded === true) {
					firstChildExpanded = currentChild;
					break;
				}
			}
		}

		// if first expanded child found
		if (firstChildExpanded !== null) {
			// count this child
			count++;
			// and go deeper
			currentGroup = firstChildExpanded;
		} else {
			// no child is expanded, so we are at the current opened level
			// so just return the current count plus current children count
			return count + currentGroup.childrenCount;
		}
	}

	// should return 1 (if top group is not expanded)
	return count;
};

EBX_Perspective.getCurrentOpenedGroupIdFromTop = function(topGroupId) {
	var currentGroup, currentGroupid, currentChildrenGroupIds, currentChild, firstChildExpanded, firstChildExpandedId, i, len;

	currentGroup = EBX_Perspective.group[topGroupId];
	currentGroupid = topGroupId;

	firstChildExpandedId = topGroupId;// just in case

	if (currentGroup.expanded === undefined) {
		currentGroup.expanded = false;
	}

	// this condition is only used for the first loop, in next loops, current group is always expanded
	while (currentGroup.expanded === true) {
		// search for an expanded child
		currentChildrenGroupIds = currentGroup.childrenGroup;
		firstChildExpanded = null;
		if (currentChildrenGroupIds !== undefined) {
			for (i = 0, len = currentChildrenGroupIds.length; i < len; i++) {
				currentChild = EBX_Perspective.group[currentChildrenGroupIds[i]];
				if (currentChild.expanded === undefined) {
					currentChild.expanded = false;
				} else if (currentChild.expanded === true) {
					firstChildExpanded = currentChild;
					firstChildExpandedId = currentChildrenGroupIds[i];
					break;
				}
			}
		}

		// if first expanded child found
		if (firstChildExpanded !== null) {
			// and go deeper
			currentGroup = firstChildExpanded;
			currentGroupid = firstChildExpandedId;
		} else {
			// no child is expanded, so we are at the current opened level
			return currentGroupid;
		}
	}

	// if top group is not expanded
	return null;
};

EBX_Perspective.currentSubGroupCollapsibleBlockToScroll = null;
EBX_Perspective.setSubGroupScroll = function(collapsibleBlockContent, targetHeight) {
	if (EBX_Perspective.currentSubGroupCollapsibleBlockToScroll !== null
			&& EBX_Perspective.currentSubGroupCollapsibleBlockToScroll !== collapsibleBlockContent) {
		EBX_Perspective.removeCurrentSubGroupScroll();
	}

	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll = collapsibleBlockContent;

	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll.style.overflowY = "scroll";
	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll.style.height = targetHeight + "px";

	// TODO scroll button and mask scrollbar
};

EBX_Perspective.removeSubGroupScroll = function(parentEl) {
	if (EBX_Perspective.currentSubGroupCollapsibleBlockToScroll === null) {
		return;
	}

	if (EBXUtils.isChildOf(EBX_Perspective.currentSubGroupCollapsibleBlockToScroll, parentEl) === false) {
		return;
	}

	// TODO remove scroll buttons

	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll.style.overflowY = "";
	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll.style.height = "";

	EBX_Perspective.currentSubGroupCollapsibleBlockToScroll = null;
};

EBX_Perspective.updateFloatingGroupPosition = function(groupId) {
	if (EBX_Perspective.isNavigationPaneReduced === false) {
		return;
	}

	// move up if the content exceeds the bottom border of window

	var topGroupId = EBX_Perspective.getTopParentId(groupId);
	var topGroup = document.getElementById(topGroupId);

	var aElTop = EBXUtils.getFirstDirectChildMatchingTagName(topGroup, "a");
	EBX_Perspective.initPerspectiveItemA(aElTop);

	var collapsibleBlockTop = EBXUtils.getFirstDirectChildMatchingCSSClass(topGroup, "ebx_CollapsibleBlock");

	var visibleItemsNumber = EBX_Perspective.getNumberOfVisibleItemsInThisGroupFromTop(groupId);

	var navigationHeight = EBX_Perspective.navigationContentEl.clientHeight;
	if (collapsibleBlockTop.ebx_originalOffsetTop === undefined) {
		collapsibleBlockTop.ebx_originalOffsetTop = collapsibleBlockTop.offsetTop;
		if (EBX_LayoutManager.browser == "Firefox") {
			// take the scroll in account, because the content follows the scroll
			collapsibleBlockTop.ebx_originalOffsetTop += EBX_Perspective.navigationContentEl.scrollTop;
		}
	}
	var originalOffsetTop = collapsibleBlockTop.ebx_originalOffsetTop - 40;
	// each element have 40px height
	var visibleItemsHeight = visibleItemsNumber * 40;

	// case if there is no enough vertical space to display all => scroll
	// 40 is currentGroup
	if (EBX_Perspective.groupMoveUpIfNoEnoughSpace_GutterHeight + visibleItemsHeight + EBX_Perspective.groupMoveUpIfNoEnoughSpace_GutterHeight > navigationHeight) {
		var availableHeight = navigationHeight - EBX_Perspective.groupMoveUpIfNoEnoughSpace_GutterHeight * 2;
		// remove parent heights (and current group)
		var currentOpenedGroupId = EBX_Perspective.getCurrentOpenedGroupIdFromTop(topGroupId);
		var parentsHeight = (EBX_Perspective.getParentsNumber(currentOpenedGroupId) + 1) * 40;
		visibleItemsHeight = availableHeight;

		var collapsibleBlockContent = EBXUtils.getFirstDirectChildMatchingCSSClass(EBXUtils.getFirstDirectChildMatchingCSSClass(document
				.getElementById(currentOpenedGroupId), "ebx_CollapsibleBlock"), "ebx_CollapsibleBlockContent");

		EBX_Perspective.setSubGroupScroll(collapsibleBlockContent, availableHeight - parentsHeight);
	} else {
		EBX_Perspective.removeSubGroupScroll(document.getElementById(groupId));
	}

	var remainingSpaceBelowCollapsibleBlock = navigationHeight
			- (originalOffsetTop + visibleItemsHeight + EBX_Perspective.groupMoveUpIfNoEnoughSpace_GutterHeight);

	if (EBX_LayoutManager.browser == "Firefox") {
		// take the scroll in account, because the content follows the scroll
		remainingSpaceBelowCollapsibleBlock += EBX_Perspective.navigationContentEl.scrollTop;
	}

	var marginTopForCollapsibleBlock = 0;
	var marginTopForLabel = 0;

	// maybe the actual position of the label is enough to display collapsibleBlock below
	if (remainingSpaceBelowCollapsibleBlock + EBX_Perspective.originalMarginTopOfFloatingGroupLabel > aElTop.ebx_labelFirstLevelMarginTop) {
		// don't move the label, but define the marginTopForCollapsibleBlock from the label position
		marginTopForLabel = aElTop.ebx_labelFirstLevelMarginTop;
		marginTopForCollapsibleBlock = aElTop.ebx_labelFirstLevelMarginTop - EBX_Perspective.originalMarginTopOfFloatingGroupLabel;
	} else if (remainingSpaceBelowCollapsibleBlock < 0) {
		// there is no enough space below collapsibleBlock
		// move up

		marginTopForLabel = remainingSpaceBelowCollapsibleBlock + EBX_Perspective.originalMarginTopOfFloatingGroupLabel;

		marginTopForCollapsibleBlock = remainingSpaceBelowCollapsibleBlock;

	} else {
		// does this case exists? - even in case of scroll...?
		//		alert("move down: not implemented case");
	}

	aElTop.ebx_labelFirstLevel.style.marginTop = marginTopForLabel + "px";
	collapsibleBlockTop.style.marginTop = marginTopForCollapsibleBlock + "px";
};

EBX_Perspective.expandGroup = function(collapsibleBlockId) {
	var currentGroup, sibling, isGroupRoot, groupList, groupChild, expandCollapseButton;

	EBX_CollapsibleBlock.expand(collapsibleBlockId);

	currentGroup = EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(collapsibleBlockId), EBX_Perspective.groupCSSClass);

	EBXUtils.addCSSClass(currentGroup, EBX_Perspective.groupExpandedCSSClass);
	EBX_Perspective.group[currentGroup.id].expanded = true;

	EBX_Perspective.updateFloatingGroupPosition(currentGroup.id);

	isGroupRoot = EBX_Perspective.group[currentGroup.id].parentGroup === undefined;

	if (isGroupRoot === true) {

		sibling = currentGroup.parentNode.parentNode.parentNode.firstChild;
		do {
			if (EBXUtils.matchCSSClass(sibling, EBX_Perspective.sectionCSSClass)) {
				groupList = EBXUtils.getFirstDirectChildMatchingCSSClass(sibling, EBX_Perspective.groupsCSSClass);
				// if the section is not empty (#14689)
				if (groupList !== null) {
					groupChild = groupList.firstChild;
					do {
						if (EBXUtils.matchCSSClass(groupChild, EBX_Perspective.groupCSSClass)) {
							expandCollapseButton = EBXUtils.getFirstRecursiveChildMatchingTagName(groupChild, "button");
							if (groupChild !== currentGroup) {
								if (EBXUtils.matchCSSClass(expandCollapseButton, "ebx_Collapse")) {
									expandCollapseButton.click();
									// roll-up expanded group
									EBX_Perspective.mouseleaveItemFirstLevelListener(EBXUtils.getFirstDirectChildMatchingTagName(groupChild, "a"),
											true);
								}
							} else {
								// save these in case of toggle reduced pane (collapse current group)
								EBX_Perspective.buttonToClickToCollapseCurrentGroupRoot = expandCollapseButton;
							}
						}
					} while ((groupChild = groupChild.nextSibling));
				}
			}
		} while ((sibling = sibling.nextSibling));
	} else {
		sibling = currentGroup.parentNode.firstChild;
		do {
			if (EBXUtils.matchCSSClass(sibling, EBX_Perspective.groupCSSClass)) {
				if (sibling !== currentGroup) {
					expandCollapseButton = EBXUtils.getFirstRecursiveChildMatchingTagName(sibling, "button");
					if (EBXUtils.matchCSSClass(expandCollapseButton, "ebx_Collapse")) {
						expandCollapseButton.click();
					}
					EBXUtils.addCSSClass(sibling, EBX_Perspective.itemHiddenCSSClass);
				}
			} else if (EBXUtils.matchCSSClass(sibling, EBX_Perspective.actionCSSClass)) {
				EBXUtils.addCSSClass(sibling, EBX_Perspective.itemHiddenCSSClass);
			}
		} while ((sibling = sibling.nextSibling));
	}

	window.setTimeout(EBX_Perspective.refreshScrollButtons, EBX_Perspective.groupExpandCollapseCSSTransitionDuration);
};

EBX_Perspective.collapseGroup = function(collapsibleBlockId) {
	var currentGroup, isGroupRoot, aEl;

	EBX_CollapsibleBlock.collapse(collapsibleBlockId);

	currentGroup = EBXUtils.getFirstParentMatchingCSSClass(document.getElementById(collapsibleBlockId), EBX_Perspective.groupCSSClass);

	EBXUtils.removeCSSClass(currentGroup, EBX_Perspective.groupExpandedCSSClass);
	EBX_Perspective.group[currentGroup.id].expanded = false;

	EBX_Perspective.updateFloatingGroupPosition(currentGroup.id);

	isGroupRoot = EBX_Perspective.group[currentGroup.id].parentGroup === undefined;

	if (isGroupRoot === true) {
		//		if (EBX_Perspective.isNavigationPaneReduced === true) {
		// XXX less performant, but important if a group is expanded when the pane is expanding
		// restore the default margin-top

		EBXUtils.addCSSClass(currentGroup, EBX_Perspective.groupCollapseTransitionCSSClass);

		aEl = EBXUtils.getFirstDirectChildMatchingTagName(currentGroup, "a");
		EBX_Perspective.initPerspectiveItemA(aEl);
		if (aEl.ebx_labelFirstLevelMarginTop !== undefined) {
			aEl.ebx_labelFirstLevel.style.marginTop = aEl.ebx_labelFirstLevelMarginTop + "px";
		}

		collapsibleBlock = EBXUtils.getFirstDirectChildMatchingCSSClass(currentGroup, "ebx_CollapsibleBlock");

		collapsibleBlock.style.marginTop = "";
		//		}

		EBX_Perspective.buttonToClickToCollapseCurrentGroupRoot = null;
	} else {
		sibling = currentGroup.parentNode.firstChild;
		do {
			if (EBXUtils.matchCSSClass(sibling, EBX_Perspective.groupCSSClass)) {
				if (sibling !== currentGroup) {
					EBXUtils.removeCSSClass(sibling, EBX_Perspective.itemHiddenCSSClass);
				}
			} else if (EBXUtils.matchCSSClass(sibling, EBX_Perspective.actionCSSClass)) {
				EBXUtils.removeCSSClass(sibling, EBX_Perspective.itemHiddenCSSClass);
			}
		} while ((sibling = sibling.nextSibling));
	}

	window.setTimeout(EBX_Perspective.refreshScrollButtons, EBX_Perspective.groupExpandCollapseCSSTransitionDuration);

	window.setTimeout(function() {
		EBXUtils.removeCSSClass(currentGroup, EBX_Perspective.groupCollapseTransitionCSSClass);
	}, EBX_Perspective.groupExpandCollapseCSSTransitionDuration);
};

EBX_Perspective.actionLabelFirstLevelCSSClass = "ebx_PerspectiveActionLabelFirstLevel";
EBX_Perspective.groupLabelFirstLevelCSSClass = "ebx_PerspectiveGroupLabelWithButtonFirstLevel";

EBX_Perspective.labelFirstLevelFloatingCSSClass = "ebx_PerspectiveLabelFirstLevelFloating";

EBX_Perspective.groupLabelFirstLevelFloatingCloseTransitionCSSClass = "ebx_PerspectiveGroupLabelFirstLevelFloatingCloseTransition";
EBX_Perspective.groupLabelFirstLevelFloatingClosedTransitionEndCSSClass = "ebx_PerspectiveGroupLabelFirstLevelFloatingClosedTransitionEnd";

EBX_Perspective.paddingRightToAddToWidthForLabelFirstLevel = 15;

EBX_Perspective.currentPerspectiveItemAToSetLabelWidth = null;

EBX_Perspective.initPerspectiveItemA = function(perspectiveItemA) {
	var collapsibleBlockSibling, collapsibleBlockSiblingWidth;

	collapsibleBlockSibling = EBXUtils.getFirstDirectChildMatchingCSSClass(perspectiveItemA.parentNode, "ebx_CollapsibleBlock");
	if (collapsibleBlockSibling != null) {
		// group

		perspectiveItemA.ebx_labelFirstLevel = EBXUtils.getFirstRecursiveChildMatchingCSSClass(perspectiveItemA,
				EBX_Perspective.groupLabelFirstLevelCSSClass);

		if (perspectiveItemA.ebx_originalLabelWidth === undefined) {
			perspectiveItemA.ebx_originalLabelWidth = perspectiveItemA.ebx_labelFirstLevel.offsetWidth
					+ EBX_Perspective.paddingRightToAddToWidthForLabelFirstLevel;
		}

		collapsibleBlockSiblingWidth = collapsibleBlockSibling.offsetWidth;

		if (perspectiveItemA.ebx_originalLabelWidth < collapsibleBlockSiblingWidth) {
			perspectiveItemA.ebx_originalLabelWidth = collapsibleBlockSiblingWidth;
		} else {
			// set the sub-menu to the same width of longer group title
			collapsibleBlockSibling.style.width = perspectiveItemA.ebx_originalLabelWidth + "px";

			// TODO keep it for the pane expanding, else, the sub group will not be auto-width in navigation pane expanded mode
			if (!EBXUtils.arrayContains(EBX_Perspective.collapsibleBlockToClearWidthOnExpandPane, collapsibleBlockSibling)) {
				EBX_Perspective.collapsibleBlockToClearWidthOnExpandPane.push(collapsibleBlockSibling);
			}
		}
	} else {
		// action

		perspectiveItemA.ebx_labelFirstLevel = EBXUtils.getFirstRecursiveChildMatchingCSSClass(perspectiveItemA,
				EBX_Perspective.actionLabelFirstLevelCSSClass);

		perspectiveItemA.ebx_originalLabelWidth = perspectiveItemA.ebx_labelFirstLevel.offsetWidth
				+ EBX_Perspective.paddingRightToAddToWidthForLabelFirstLevel;
	}

	EBXUtils.addCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.labelFirstLevelFloatingCSSClass);
};

EBX_Perspective.mouseenterItemFirstLevelListener = function(perspectiveItemA) {
	var scrollTop, marginTop;

	if (EBX_Perspective.isNavigationPaneReduced !== true) {
		return;
	}

	if (perspectiveItemA.ebx_labelFirstLevel === undefined) {
		EBX_Perspective.initPerspectiveItemA(perspectiveItemA);
	}

	// move only if not expanded
	if (EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupExpandedCSSClass) === false) {

		if (EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupCSSClass) === true) {
			EBXUtils.removeCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.groupLabelFirstLevelFloatingCloseTransitionCSSClass);
			EBXUtils.removeCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.groupLabelFirstLevelFloatingClosedTransitionEndCSSClass);
		}

		if (EBX_LayoutManager.browser == "Firefox") {
			// the label automatically follows the scroll: no need to apply a negative margin-top
			scrollTop = 0;
		} else {
			scrollTop = EBX_Perspective.navigationContentEl.scrollTop;
		}
		marginTop = -scrollTop + EBX_Perspective.originalMarginTopOfFloatingGroupLabel;

		perspectiveItemA.ebx_labelFirstLevelMarginTop = marginTop;
		perspectiveItemA.ebx_labelFirstLevel.style.marginTop = marginTop + "px";
	}

	if (EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupCSSClass) === true) {
		window.clearTimeout(perspectiveItemA.ebx_SetCSSClosedEndTransition);
	}

	// delay set width, else, no animation (because only final width set in this function/call-stack is taken into account)
	window.setTimeout(function() {
		perspectiveItemA.ebx_labelFirstLevel.style.width = perspectiveItemA.ebx_originalLabelWidth + "px";
	}, 50);
};

EBX_Perspective.stillOpenedItemFirstLevel = [];

EBX_Perspective.mouseleaveItemFirstLevelListener = function(perspectiveItemA, closeEvenIfExpanded, closeEvenIfNavigationPaneExpanded) {
	var scrollTop, marginTop;

	if (closeEvenIfNavigationPaneExpanded !== true && EBX_Perspective.isNavigationPaneReduced !== true) {
		return;
	}

	if (perspectiveItemA.ebx_labelFirstLevel === undefined) {
		EBX_Perspective.initPerspectiveItemA(perspectiveItemA);
	}

	// don't close if expanded
	if (closeEvenIfExpanded !== true && EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupExpandedCSSClass)) {
		// but keep it, to close it in case of expanding pane
		if (!EBXUtils.arrayContains(EBX_Perspective.stillOpenedItemFirstLevel, perspectiveItemA)) {
			EBX_Perspective.stillOpenedItemFirstLevel.push(perspectiveItemA);
		}
		return;
	}

	if (EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupCSSClass) === true) {
		EBXUtils.addCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.groupLabelFirstLevelFloatingCloseTransitionCSSClass);
	}

	if (EBX_LayoutManager.browser == "Firefox") {
		// the label automatically follows the scroll
		scrollTop = 0;
	} else {
		scrollTop = EBX_Perspective.navigationContentEl.scrollTop;
	}
	marginTop = -scrollTop + EBX_Perspective.originalMarginTopOfFloatingGroupLabel;

	perspectiveItemA.ebx_labelFirstLevelMarginTop = marginTop;
	perspectiveItemA.ebx_labelFirstLevel.style.marginTop = marginTop + "px";

	window.setTimeout(function() {
		perspectiveItemA.ebx_labelFirstLevel.style.width = "";// reset to 0
	}, 50);

	perspectiveItemA.ebx_SetCSSClosedEndTransition = window.setTimeout(function() {
		if (EBXUtils.matchCSSClass(perspectiveItemA.parentNode, EBX_Perspective.groupCSSClass) === true) {
			EBXUtils.addCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.groupLabelFirstLevelFloatingClosedTransitionEndCSSClass);
			EBXUtils.removeCSSClass(perspectiveItemA.ebx_labelFirstLevel, EBX_Perspective.groupLabelFirstLevelFloatingCloseTransitionCSSClass);
		}
		perspectiveItemA.ebx_labelFirstLevel.style.marginTop = "";
	}, EBX_Perspective.sectionsReductionCSSTransitionDuration);
};
