export interface AvatarProps extends CommonProps {
    /** icon name 	*/
    icon?: string;
    /**
     * size of the avatar
     */
    size?: ElementProps['width'];
    /**
     * size of the icon
     */
    iconSize?: ElementProps['iconSize'];
    element?: HTMLDivElement;
    class?: string;
    children?: Snippet;
    avatarBadge?: Snippet;
}