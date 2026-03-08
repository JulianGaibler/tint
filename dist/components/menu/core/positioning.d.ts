import { type MenuBehaviorType, type Vec2 } from './types';
/**
 * Determines if a point lies within a triangle using barycentric coordinates
 * Used for safe area detection during mouse navigation to submenus
 */
export declare function checkIfInTriangle(a: Vec2, b: Vec2, c: Vec2, s: Vec2): boolean;
/**
 * Calculates optimal positioning for a menu considering window boundaries
 * Handles different menu types (context, select, autocomplete) and positioning
 * logic
 */
export declare function calculatePosition(depth: number, parentItemRect: DOMRect, menuRect: DOMRect, behavior: MenuBehaviorType, windowDimensions: {
    innerWidth: number;
    innerHeight: number;
    scrollX: number;
    scrollY: number;
}, relativeDistance?: number): {
    x: number;
    y: number;
    endAlign: boolean;
    height: number | undefined;
    minWidth: number | undefined;
    animationOrigin?: string;
};
