
export type BreakPoints  = Record<BreakPointName, BreakPointValue>
export type BreakPointName = string
export type BreakPointValue = string
 
export type BreakPointsKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
export type BeakPointsUnits = 'px' | 'em' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax'
export type BreakPointRule = Record<`--bkp-${BreakPointsKeys}`, `${string}${BeakPointsUnits}`>




export interface SlotUiStyleSheet extends Partial<BreakPointRule> {
    breakpoints?: BreakPoints;   
    showSelectors?: boolean;
}