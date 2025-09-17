import { tick } from 'svelte';
// Tooltip timing constants (not exported)
const TOOLTIP_SHOW_DELAY = 750;
const TOOLTIP_HIDE_DELAY = 300;
const TOOLTIP_DEFAULT_OFFSET = 0;
const TOOLTIP_BASE_OFFSET = 6;
// Global state to manage tooltip interactions across instances
const globalTooltipState = {
    activeTooltip: null,
    isAnyTooltipVisible: false,
};
function createTooltipElement() {
    // Create the outer wrapper div
    const tooltipWrapper = document.createElement('div');
    tooltipWrapper.className = 'tint-tooltip-wrapper tint--type-ui-small';
    tooltipWrapper.setAttribute('popover', 'manual'); // Use manual popover for full control
    tooltipWrapper.role = 'tooltip';
    // Create the arrow element
    const arrow = document.createElement('div');
    arrow.className = 'tint-tooltip-arrow';
    // Create the bubble that contains the text
    const bubble = document.createElement('div');
    bubble.className = 'tint-tooltip-bubble';
    // Create the paragraph for the text content
    const textElement = document.createElement('p');
    textElement.className = 'tint-tooltip-text';
    // Assemble the structure
    bubble.appendChild(textElement);
    tooltipWrapper.appendChild(arrow);
    tooltipWrapper.appendChild(bubble);
    return tooltipWrapper;
}
function positionTooltip(tooltip, anchor, offset = TOOLTIP_DEFAULT_OFFSET) {
    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const arrow = tooltip.querySelector('.tint-tooltip-arrow');
    let finalPlacement = 'top';
    // Auto placement logic
    const spaceBelow = viewportHeight - anchorRect.bottom;
    finalPlacement = spaceBelow >= tooltipRect.height + offset ? 'bottom' : 'top';
    // Update placement class for styling
    tooltip.classList.remove('tint-tooltip--top', 'tint-tooltip--bottom');
    tooltip.classList.add(`tint-tooltip--${finalPlacement}`);
    // Calculate initial position
    let top;
    let left = anchorRect.left + scrollX + (anchorRect.width - tooltipRect.width) / 2;
    if (finalPlacement === 'bottom') {
        top = anchorRect.bottom + scrollY + offset + TOOLTIP_BASE_OFFSET;
    }
    else {
        top =
            anchorRect.top +
                scrollY -
                tooltipRect.height -
                offset -
                TOOLTIP_BASE_OFFSET;
    }
    // Handle horizontal overflow
    const tooltipLeft = left;
    const tooltipRight = left + tooltipRect.width;
    const padding = 8;
    let arrowOffset = 0;
    if (tooltipLeft < padding) {
        // Tooltip overflows left edge
        const adjustment = padding - tooltipLeft;
        left += adjustment;
        arrowOffset = -adjustment;
    }
    else if (tooltipRight > viewportWidth - padding) {
        // Tooltip overflows right edge
        const adjustment = tooltipRight - (viewportWidth - padding);
        left -= adjustment;
        arrowOffset = adjustment;
    }
    // Position arrow horizontally
    arrow.style.left = `calc(50% + ${arrowOffset}px)`;
    arrow.style.transform = 'translateX(-50%)';
    // Apply final position using popover positioning
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    // Override popover's default positioning
    tooltip.style.position = 'absolute';
}
function showTooltip(state, anchor, text, offset) {
    if (!state.element)
        return;
    // Set text in the paragraph element inside the bubble
    const textElement = state.element.querySelector('.tint-tooltip-text');
    if (textElement) {
        textElement.textContent = text;
    }
    try {
        // Show the popover
        state.element.showPopover();
        // Position it after showing (so we can measure dimensions)
        tick().then(() => {
            if (state.element && state.isVisible) {
                positionTooltip(state.element, anchor, offset);
                // Animate in
                state.element.style.opacity = '1';
                state.element.style.transform = 'translateY(0)';
            }
        });
        state.isVisible = true;
        globalTooltipState.isAnyTooltipVisible = true;
        globalTooltipState.activeTooltip = state;
    }
    catch (e) {
        // Fallback if popover API is not supported or element is already open
        console.warn('Popover API error:', e);
    }
}
function hideTooltip(state) {
    if (!state.element || !state.isVisible)
        return;
    // Animate out first
    state.element.style.opacity = '0';
    state.element.style.transform = 'translateY(-4px)';
    // Hide popover after animation
    setTimeout(() => {
        try {
            if (state.element) {
                state.element.hidePopover();
            }
        }
        catch (_e) {
            // Element might already be hidden
        }
    }, 200);
    state.isVisible = false;
    if (globalTooltipState.activeTooltip === state) {
        globalTooltipState.activeTooltip = null;
        globalTooltipState.isAnyTooltipVisible = false;
    }
}
function clearTimeouts(state) {
    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
    }
    if (state.hideTimeoutId) {
        clearTimeout(state.hideTimeoutId);
        state.hideTimeoutId = null;
    }
}
function shouldInitialize(options) {
    if (!options)
        return false;
    if (typeof options === 'string')
        return options.trim() !== '';
    return options.text.trim() !== '';
}
export function tooltip(element, options) {
    // Check if popover API is supported
    if (!Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover')) {
        console.warn('Popover API is not supported in this browser. Tooltip may not work as expected.');
    }
    const state = {
        isVisible: false,
        element: null,
        timeoutId: null,
        hideTimeoutId: null,
        isInitialized: false,
    };
    let opts = null;
    let tooltipId = null;
    let eventHandlers = null;
    function initializeTooltip(newOptions) {
        if (state.isInitialized)
            return;
        opts =
            typeof newOptions === 'string'
                ? { text: newOptions }
                : { text: newOptions.text, offset: newOptions.offset };
        // Generate unique ID for accessibility
        tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
        // Set up accessibility attributes
        element.setAttribute('aria-describedby', tooltipId);
        // Create tooltip element
        state.element = createTooltipElement();
        state.element.id = tooltipId;
        document.body.appendChild(state.element);
        // Define event handlers
        eventHandlers = {
            handleMouseEnter() {
                clearTimeouts(state);
                // If another tooltip is visible, hide it immediately and show this one
                if (globalTooltipState.isAnyTooltipVisible &&
                    globalTooltipState.activeTooltip !== state) {
                    if (globalTooltipState.activeTooltip) {
                        clearTimeouts(globalTooltipState.activeTooltip);
                        hideTooltip(globalTooltipState.activeTooltip);
                    }
                    // Show immediately
                    showTooltip(state, element, opts.text, opts.offset);
                }
                else {
                    // Normal delay
                    state.timeoutId = setTimeout(() => {
                        showTooltip(state, element, opts.text, opts.offset);
                    }, TOOLTIP_SHOW_DELAY);
                }
            },
            handleMouseLeave() {
                clearTimeouts(state);
                if (state.isVisible) {
                    state.hideTimeoutId = setTimeout(() => {
                        hideTooltip(state);
                    }, TOOLTIP_HIDE_DELAY);
                }
            },
            handleMouseEnterTooltip() {
                clearTimeouts(state);
            },
            handleMouseLeaveTooltip() {
                clearTimeouts(state);
                state.hideTimeoutId = setTimeout(() => {
                    hideTooltip(state);
                }, TOOLTIP_HIDE_DELAY);
            },
            handleTogglePopover(event) {
                const toggleEvent = event;
                if (toggleEvent.newState === 'closed' && state.isVisible) {
                    // Popover was closed externally (e.g., by pressing Escape)
                    state.isVisible = false;
                    if (globalTooltipState.activeTooltip === state) {
                        globalTooltipState.activeTooltip = null;
                        globalTooltipState.isAnyTooltipVisible = false;
                    }
                }
            },
            handlePositionUpdate() {
                if (state.isVisible && state.element && opts) {
                    positionTooltip(state.element, element, opts.offset);
                }
            },
        };
        // Add event listeners
        element.addEventListener('mouseenter', eventHandlers.handleMouseEnter);
        element.addEventListener('mouseleave', eventHandlers.handleMouseLeave);
        element.addEventListener('focus', eventHandlers.handleMouseEnter);
        element.addEventListener('blur', eventHandlers.handleMouseLeave);
        // Add listeners to tooltip to handle hover over tooltip itself
        state.element.addEventListener('mouseenter', eventHandlers.handleMouseEnterTooltip);
        state.element.addEventListener('mouseleave', eventHandlers.handleMouseLeaveTooltip);
        state.element.addEventListener('toggle', eventHandlers.handleTogglePopover);
        // Handle window resize and scroll
        window.addEventListener('scroll', eventHandlers.handlePositionUpdate, true);
        window.addEventListener('resize', eventHandlers.handlePositionUpdate);
        state.isInitialized = true;
    }
    function destroyTooltip() {
        if (!state.isInitialized)
            return;
        clearTimeouts(state);
        // Clean up global state if this was the active tooltip
        if (globalTooltipState.activeTooltip === state) {
            globalTooltipState.activeTooltip = null;
            globalTooltipState.isAnyTooltipVisible = false;
        }
        // Remove event listeners
        if (eventHandlers) {
            element.removeEventListener('mouseenter', eventHandlers.handleMouseEnter);
            element.removeEventListener('mouseleave', eventHandlers.handleMouseLeave);
            element.removeEventListener('focus', eventHandlers.handleMouseEnter);
            element.removeEventListener('blur', eventHandlers.handleMouseLeave);
            if (state.element) {
                state.element.removeEventListener('mouseenter', eventHandlers.handleMouseEnterTooltip);
                state.element.removeEventListener('mouseleave', eventHandlers.handleMouseLeaveTooltip);
                state.element.removeEventListener('toggle', eventHandlers.handleTogglePopover);
            }
            window.removeEventListener('scroll', eventHandlers.handlePositionUpdate, true);
            window.removeEventListener('resize', eventHandlers.handlePositionUpdate);
        }
        // Hide popover and remove from DOM
        if (state.element) {
            try {
                if (state.isVisible) {
                    state.element.hidePopover();
                }
            }
            catch (_e) {
                // Element might already be hidden
            }
            if (state.element.parentNode) {
                state.element.parentNode.removeChild(state.element);
            }
            state.element = null;
        }
        // Clean up accessibility attributes
        element.removeAttribute('aria-describedby');
        // Reset state
        state.isVisible = false;
        state.isInitialized = false;
        opts = null;
        tooltipId = null;
        eventHandlers = null;
    }
    // Initialize if options are valid
    if (shouldInitialize(options)) {
        initializeTooltip(options);
    }
    return {
        update(newOptions) {
            const shouldInit = shouldInitialize(newOptions);
            if (shouldInit && !state.isInitialized) {
                // Initialize tooltip
                initializeTooltip(newOptions);
            }
            else if (!shouldInit && state.isInitialized) {
                // Destroy tooltip
                destroyTooltip();
            }
            else if (shouldInit && state.isInitialized && opts) {
                // Update existing tooltip
                let newOpts;
                if (typeof newOptions === 'string') {
                    newOpts = { text: newOptions };
                }
                else if (newOptions && typeof newOptions.text === 'string') {
                    newOpts = { text: newOptions.text, offset: newOptions.offset };
                }
                else {
                    newOpts = { text: '' };
                }
                Object.assign(opts, newOpts);
                // Update tooltip text if it's currently visible
                if (state.isVisible && state.element) {
                    const textElement = state.element.querySelector('.tint-tooltip-text');
                    if (textElement) {
                        textElement.textContent = opts.text;
                    }
                    // Reposition in case text change affects size
                    tick().then(() => {
                        if (state.isVisible && state.element && opts) {
                            positionTooltip(state.element, element, opts.offset);
                        }
                    });
                }
            }
        },
        destroy() {
            destroyTooltip();
        },
    };
}
