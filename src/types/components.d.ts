export interface ISnackbarProps {
    showMessage: boolean;
    variant: 'success' | 'warning' | 'error' | 'info';
    message: string;
    handleClose: () => void;
}