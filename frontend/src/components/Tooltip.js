import styles from "../tooltip.module.css";

export const Tooltip = ({interactionData}) => {
    if (!interactionData) {
        return null;
    }

    return (<div
        className={styles.tooltip}
        style={{
            left: interactionData.xPos, top: interactionData.yPos,
        }}
    >
        {interactionData.name}
    </div>);
};
