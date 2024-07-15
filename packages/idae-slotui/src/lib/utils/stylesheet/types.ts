
export type BreakPoints  = Record<BreakPointName, BreakPointValue>
type BreakPointName = string
type BreakPointValue = string

type BreakPointsKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
type BeakPointsUnits = 'px' | 'em' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax'
type BreakPointRule = Record<`--bkp-${BreakPointsKeys}`, `${string}${BeakPointsUnits}`>


export interface StyleSheet extends Partial<BreakPointRule> {
    breakpoints?: BreakPoints;   
}