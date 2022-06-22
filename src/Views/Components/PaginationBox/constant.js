import Colors from '../../../Theme/Colors/colors';

const controlButtonStyle = {
    height: 'auto',
    width: '1em',
    padding: '1rem 1.5rem',
    border: "none",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '400',
    color: `${Colors.orange}`,
    borderRadius: '6px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
}

const titlePageLength = "Page length";
const arrPagiLength = [10, 25, 50, 100];

export { titlePageLength, arrPagiLength, controlButtonStyle };